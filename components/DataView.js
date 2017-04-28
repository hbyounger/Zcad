/**
 * Created by wxk on 2016/7/19.
 */
'use strict';
//数据表填写
import React, { Component } from 'react';
import {
    Dimensions,
    ListView,
    Navigator,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    TextInput,
    ScrollView,
    Alert,
    DeviceEventEmitter
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/table/table';
import * as loginActions from '../actions/login';

const RIGHT_LISTVIEW = 'right_listView';

const window = Dimensions.get('window');

class DataView extends Component {
    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                if (r1 !== r2) {
                    console.log("不相等=");
                    console.log(r1);
                } else {
                    console.log("相等=");
                    console.log(r1);
                    console.log(r2);
                }
                return r1 !== r2;
            }
        });

        let { cell, login, table, project } = this.props;

        this.holeNo = cell.holeNo;  //孔号
        this.tableName = table.table;//表名

        this.table = login.tables[this.tableName];

        this.projectid = login.userid + '-' + project.project;//工程ID
        this.login = login;

        this.isEnableAdd = true;//是否允许 添加 插入 删除 行为
        if (this.tableName == "勘探点数据表") {
            this.isEnableAdd = false;
        }

        this.hasHoleNo = true;   //是否有钻孔编号
        this.MaxID = -1;        //最大的ID
        this.ItemArray = [];    //符合条件的数据,增删改,修改这个
        this.table.forEach((ele, i) => {
            if (null == ele["ID"]) {
                alert(this.tableName + ' 错误! 没有 ID 列!!!');
            }
            if (ele["ID"] > this.MaxID) {
                this.MaxID = ele["ID"];
            }

            if (!ele["钻孔编号"]) {//没有 钻孔编号
                this.ItemArray.push(ele);
                this.hasHoleNo = false;
            }
            else if (ele["钻孔编号"] === this.holeNo) {//有 钻孔编号
                this.ItemArray.push(ele);
            }
        });

        this.state = {
            dataSource: this.ds.cloneWithRows(this.ItemArray),
            SelectedID: -1,     //当前选择行的ID
            SelectedFieldName: ""  //当前选择行字段名称
        }

        this.FieldList = [];            //显示的数据字段
        this.renderFieldList = [];      //渲染时显示的字段
        this.MapFieldName_Type = {};    //Map  字段名 : 字段类型 
        this.MapFieldName_ID = {};      //Map  字段名 : 字段ID
        if (login.tables['表_字段']) {
            login.tables['表_字段'].forEach((item, i) => {
                if (item['表名'] === this.tableName) {

                    let FieldName = item['字段名'];
                    this.FieldList.push(FieldName);
                    this.MapFieldName_Type[FieldName] = item['类型'];
                    this.MapFieldName_ID[FieldName] = item['ID'];

                    this.renderFieldList.push(
                        <View key={`title${i}`} style={styles.titleView}>
                            <Text>{FieldName}</Text>
                        </View>
                    )
                }
            })
        }
    }

    componentWillUnmount() {
        this.subscription.remove();
    };

    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('changeValue', (newValue) => {//监听变量改变
            //alert("newValue = " + newValue);
            if (this.state.SelectedID <= 0 || this.state.SelectedFieldName === "") {
                //alert("this.state.SelectedFieldName = " + this.state.SelectedFieldName);
                //alert("this.state.SelectedID = " + this.state.SelectedID);
                return;
            }

            this.NewItemArray = this.ItemArray.slice(0);//深拷贝
            this.NewItemArray.forEach((ele) => {
                if (ele["ID"] === this.state.SelectedID) {
                    ele[this.state.SelectedFieldName] = newValue;
                    //alert("found ID!");
                }
            });
            this.ItemArray = this.NewItemArray.slice(0);

            this.setState({
                dataSource: this.ds.cloneWithRows(this.ItemArray)
            });
            //this.forceUpdate();//setState 不触发render ??
            //alert("changeValue OK!");
        }
        );
    };



    //保存
    onSubmit = () => {
        let { login, loginactions } = this.props;
        let tables = login.tables;

        //删除原来的数据
        for (let i = this.table.length - 1; i >= 0; i--) {
            let ele = this.table[i];
            if (!ele["钻孔编号"]) {//没有 钻孔编号
                this.table.splice(i, 1);
            }
            else if (ele["钻孔编号"] === this.holeNo) {//有 钻孔编号
                this.table.splice(i, 1);
            }
        }

        //添加现有的数据
        this.ItemArray.forEach((item) => {
            this.table.push(item);
        });

        //保存
        storage.save({
            key: 'projectid',  // 注意:请不要在key中使用_下划线符号!
            id: this.projectid,
            rawData: tables,        //浅拷贝 this.table 改变了 tables也改变了
            expires: null,//1000 * 3600
        });


        loginactions.SetStateTables(tables);//工程的所有表格 放到state 的 tables

        alert("保存成功");
    };

    //上传
    onUpload = (data) => {
        let { loginactions, login, project } = this.props;
        loginactions.updateData(login.server, login.userid, project.project, this.holeNo, this.ItemArray, this.tableName);
    }

    //添加一行
    onAdd = () => {
        //新建一条记录
        let newItem = {};
        this.FieldList.forEach((FieldName) => {
            newItem[FieldName] = "";
        })
        if (this.hasHoleNo) {
            newItem['钻孔编号'] = this.holeNo;
        }
        newItem['ID'] = ++this.MaxID;

        //新的记录数组
        let newArray = [];
        this.ItemArray.forEach((item) => {
            newArray.push(item);
        })
        newArray.push(newItem);

        this.ItemArray = newArray.slice();
        //改变State
        this.setState({
            dataSource: this.ds.cloneWithRows(this.ItemArray)
        })
    };

    //插入一行
    onInsert = () => {
        //新建一条记录
        let newItem = {};
        this.FieldList.forEach((FieldName) => {
            newItem[FieldName] = "";
        })
        if (this.hasHoleNo) {
            newItem['钻孔编号'] = this.holeNo;
        }
        newItem['ID'] = ++this.MaxID;

        //新的记录数组
        let newArray = [];
        this.ItemArray.forEach((item) => {
            if (item["ID"] === this.state.SelectedID) {
                newArray.push(newItem);
            }
            newArray.push(item);
        })

        this.ItemArray = newArray.slice();
        //改变State
        this.setState({
            dataSource: this.ds.cloneWithRows(this.ItemArray)
        })
    };

    //删除一行
    onDelete = () => {
        //新的记录数组
        let newArray = [];
        this.ItemArray.forEach((item) => {
            if (item["ID"] !== this.state.SelectedID) {
                newArray.push(item);
            }
        })

        this.ItemArray = newArray.slice();
        //改变State
        this.setState({
            dataSource: this.ds.cloneWithRows(this.ItemArray)
        })
    };


    //选择改变 行高亮
    onSelChangeRow(ID, FieldName) {
        if (ID !== this.state.SelectedID) {
            this.setState({
                SelectedID: ID,
                SelectedFieldName: FieldName,
                dataSource: this.ds.cloneWithRows(this.ItemArray)//不写这句,选择状态不出来,郁闷
            });
            //alert("onSelChangeRow");
            //this.forceUpdate();//setState 不触发render ??
        }
    }

    //点击选择值
    onPressSelectValue(fieldID, value) {
        let { actions } = this.props;
        this.props.navigator.push({ name: 'SelectValue' });//弹出选择值界面
        actions.SetSelectValue({
            fieldID: fieldID,
            curvalue: value
        });
    }

    //render 每行数据
    _rightRenderRow = (rowData, sectionID, rowID, highlightRow) => {
        this.renderRowList = [];
        this.FieldList.forEach((FieldName, i) => {

            let FieldType = this.MapFieldName_Type[FieldName];//字段类型
            let value = rowData[FieldName];
            let ID = rowData["ID"];

            if (FieldType === "选择") {//选择项
                let fieldID = this.MapFieldName_ID[FieldName];//字段的ID
                this.renderRowList.push(
                    <View key={`right${rowID}${i}`}>
                        <TextInput style={this.state.SelectedID == ID ? styles.cellViewSelect : styles.cellView}
                            onFocus={() => { this.onSelChangeRow(ID, FieldName); this.onPressSelectValue(fieldID, value); }}
                        >
                            {value}
                        </TextInput>
                    </View>
                );
            }
            else if (FieldType === "只读") {
                this.renderRowList.push(
                    <View key={`right${rowID}${i}`}>
                        <TextInput style={this.state.SelectedID == ID ? styles.cellViewSelect : styles.cellView}
                            editable={false}
                            onFocus={() => { this.onSelChangeRow(ID, FieldName); }}
                        >
                            {value}
                        </TextInput>
                    </View>)
            }
            else {//一般编写项目
                this.renderRowList.push(
                    <View key={`right${rowID}${i}`}>
                        <TextInput style={this.state.SelectedID == ID ? styles.cellViewSelect : styles.cellView}
                            onChangeText={(e) => { rowData[FieldName] = e; }}
                            keyboardType={this.MapFieldName_Type[FieldName] == '数字' ? "numeric" : "default"}
                            onFocus={() => { this.onSelChangeRow(ID, FieldName); }}
                        >
                            {value}
                        </TextInput>
                    </View>)
            }
        });
        return (
            <View style={styles.rightListRow}>
                {this.renderRowList}
            </View>
        );
    }


    render() {
        return (
            <View >
                <View >
                    <Text style={styles.welcome} >
                        {this.tableName}
                    </Text>
                </View>

                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TouchableHighlight
                        style={[styles.style_view_commit, { flex: 1, top: 0, left: 0 }]}
                        onPress={() => { this.props.navigator.pop({ name: 'tablelist' }); }}
                        underlayColor="transparent"
                        activeOpacity={0.5}>
                        <View >
                            <Text style={{ color: '#fff' }} >
                                {'返回'}
                            </Text>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={[styles.style_view_commit, { flex: 1, top: 0, left: 0 }]}
                        onPress={this.onSubmit}
                        underlayColor="transparent"
                        activeOpacity={0.5}>
                        <View >
                            <Text style={{ color: '#fff' }} >
                                {'保存'}
                            </Text>
                        </View>
                    </TouchableHighlight>

                    {
                        (!this.login.offline) && (
                            <TouchableHighlight
                                style={[styles.style_view_commit, { flex: 1, top: 0, left: 0, }]}
                                onPress={this.onUpload}
                                underlayColor="transparent"
                                activeOpacity={0.5}>
                                <View >
                                    <Text style={{ color: '#fff' }} >
                                        {'上传'}
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        )
                    }
                    {
                        (true == this.isEnableAdd) && (

                            <TouchableHighlight
                                style={[styles.style_view_commit, { flex: 1, top: 0, left: 0 }]}
                                onPress={this.onAdd}
                                underlayColor="transparent"
                                activeOpacity={0.5}>
                                <View >
                                    <Text style={{ color: '#fff' }} >
                                        {'新增'}
                                    </Text>
                                </View>
                            </TouchableHighlight>)
                    }
                    {
                        (true == this.isEnableAdd) && (
                            <TouchableHighlight
                                style={[styles.style_view_commit, { flex: 1, top: 0, left: 0 }]}
                                onPress={this.onInsert}
                                underlayColor="transparent"
                                activeOpacity={0.5}>
                                <View >
                                    <Text style={{ color: '#fff' }} >
                                        {'插入'}
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        )
                    }
                    {
                        (true == this.isEnableAdd) && (
                            <TouchableHighlight
                                style={[styles.style_view_commit, { flex: 1, top: 0, left: 0 }]}
                                onPress={this.onDelete}
                                underlayColor="transparent"
                                activeOpacity={0.5}>
                                <View >
                                    <Text style={{ color: '#fff' }} >
                                        {'删除'}
                                    </Text>
                                </View>
                            </TouchableHighlight>)
                    }

                </View>
                <View style={{ top: 10 }}>
                    <ScrollView horizontal={true} style={styles.container}>
                        <View style={styles.right}>
                            <ScrollView
                                style={styles.scrollView}
                                horizontal={true}
                            >
                                <View style={styles.contentView}>
                                    <View style={{ width: 100 * this.rowNum + 100, height: 40, flexDirection: 'row' }}>
                                        {this.renderFieldList}
                                    </View>
                                    <ListView
                                        ref={RIGHT_LISTVIEW}
                                        //scrollEventThrottle={500}
                                        style={styles.rightListView}
                                        dataSource={this.state.dataSource}
                                        //onScroll={this.onScroll}
                                        renderRow={this._rightRenderRow}
                                    />
                                </View>
                            </ScrollView>
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    style_view_commit: {
        marginTop: 0,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#63B8FF',
        height: 35,
        //width:60,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcome: {
        color: '#19a9e5',
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
    },
    container: {
        flexDirection: 'row',
        //marginTop: 20,
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    picker: {
        width: 100,
    },
    left: {
        width: 50,
        //flex: 1,
        // backgroundColor:'yellow',
        flexDirection: 'column',
    },
    right: {
        flex: 3,
        backgroundColor: 'white',
    },

    mingcheng: {
        height: 40,
        marginLeft: 0,
        marginRight: 0,
        // backgroundColor:'red',
        borderColor: '#DCD7CD',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderTopWidth: 1,
        alignItems: 'center',      // 水平局中
        justifyContent: 'center',  // 垂直居中
    },

    leftListView: {
        flex: 1,
        marginTop: 0,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 30,
        // backgroundColor:'gray',
    },

    leftListRow: {
        //width:50,
        alignItems: 'center',      // 水平局中
        justifyContent: 'center',  // 垂直居中
        height: 40,
        //backgroundColor:'#db384c',
        borderColor: '#DCD7CD',
        borderBottomWidth: 1,
        borderRightWidth: 1,
    },

    rightListRow: {
        //width: 1000 ,
        height: 40,
        flexDirection: 'row'
    },

    scrollView: {
        //flex: 1,
        marginRight: 1,
        marginLeft: 1,
        marginTop: 0,
        marginBottom: 1,
        // backgroundColor: 'red',
        flexDirection: 'column',
        //height:Dimensions.get('window').height-110,
        //height: window.height -50,
    },

    contentView: {

        height: window.height - 120,
        //width: 900 ,
        // backgroundColor:'yellow',
        flexDirection: 'column',
    },

    rightListView: {
        flex: 1,
        // backgroundColor : 'gray'
    },

    titleView: {
        width: 100,
        height: 40,
        backgroundColor: '#F5FCFF',
        borderColor: '#DCD7CD',
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        alignItems: 'center',      // 水平局中
        justifyContent: 'center',  // 垂直居中
    },
    cell: {
        width: 100,
        height: 40,
        backgroundColor: '#7b8994',
        //margin: 2,
        //flex: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellView: {
        width: 100,
        height: 40,
        // backgroundColor:'#db384c',
        borderColor: '#DCD7CD',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        alignItems: 'center',      // 水平局中
        justifyContent: 'center',  // 垂直居中
    },
    cellViewSelect: {
        width: 100,
        height: 40,
        backgroundColor: '#db384c',
        borderColor: '#7CD7CD',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        alignItems: 'center',      // 水平局中
        justifyContent: 'center',  // 垂直居中
    },
});

function mapStateToProps(state) {
    return {
        table: state.table.toJS(),
        login: state.login.toJS(),
        cell: state.cell.toJS(),
        project: state.project.toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        loginactions: bindActionCreators(loginActions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DataView);
