/**
 * Created by younger on 2017/3/5.
 */
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
    Picker,
    TouchableOpacity
} from 'react-native';

import CheckBox from 'react-native-checkbox'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/table/table';

const RIGHT_LISTVIEW = 'right_listView';
const LEFT_LISTVIEW = 'left_listView';
const window = Dimensions.get('window');
const Item = Picker.Item;

class DataGrid extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        let ds1 = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        let { pointInfo, data, table, login } = this.props;
        console.log("DataGrid  构造开始");
        console.log("pointInfo : " + pointInfo);
        console.log("data : " + data);
        console.log("table : " + table);
        console.log("login : " + login);


        let fieldIDs = [],          //字段ID数组
            MapFieldID_Name = {};      //字段ID : 字段名
        if (login.tables['表_字段']) {
            login.tables['表_字段'].forEach((item, index) => {
                if (item['表名'] === table.table) {
                    MapFieldID_Name[item['ID']] = item['字段名'];
                    fieldIDs.push(item['ID']);
                }
            })//字段ID
        }
        //console.log(MapFieldID_Name,'------------------->MapFieldID_Name');//选择值//表_字段
        this.MapFieldID_Dom = {};           //  <Item key = {i} label={value} value={`${i}`}
        this.MapValue_ID = {};      // 
        this.MapID_Value = {};      // 
        this.MapFieldName_ID = {};      //字段名 :字段ID
        if (login.tables['选择值']) {
            login.tables['选择值'].forEach((item, i) => {
                //let ID = item['ID'];
                let fieldID = item['字段ID'];
                let value = item['值'];
                let fieldName = MapFieldID_Name[fieldID];//字段名

                if (-1 !== fieldIDs.indexOf(fieldID)) {

                    if (!this.MapFieldID_Dom[fieldID]) {
                        this.MapFieldID_Dom[fieldID] = [];
                    }
                    this.MapFieldID_Dom[fieldID].push(<Item key={i} label={value} value={`${i}`} />);

                    this.MapValue_ID[value] = i;
                    this.MapID_Value[i] = value;
                    this.MapFieldName_ID[fieldName] = fieldID;//item['字段名']
                }
            })
        }

        this.FieldList = [];//显示的数据字段
        this.renderFieldList = [];//渲染时显示的字段
        this.MapField_Type = {};//Map 字段_字段类型
        if (login.tables['表_字段']) {
            login.tables['表_字段'].forEach((item, i) => {
                if (item['表名'] === table.table) {
                    let FieldName = item['字段名'];
                    this.FieldList.push(FieldName);

                    let FieldType = item['类型'];
                    this.MapField_Type[FieldName] = FieldType;

                    this.renderFieldList.push(
                        <View key={`title${i}`} style={styles.titleView}>
                            <Text>{FieldName}</Text>
                        </View>
                    )
                }
            })
        }
        //-----------------------
        this.rightArray = [];
        data.forEach((row, i) => {
            console.log(row);
            this.rightArray.push(row);
        });

        //-----------------------
        this.state = {
            rightdataSource: ds1.cloneWithRows(this.rightArray),
            leftListOffset: { x: 0, y: 0 },
            mode: Picker.MODE_DIALOG,

        };
        this.SelectedRow = -1//当前选择行号

    }

    onTableChange = () => {
        this.props.callback(this.rightArray, this.SelectedRow);
    };

    // //点击一行
    // _onPressRow = (rowID) => {
    //     this.setState({SelectedRow: rowID});
    // };

    // onScroll = () => {
    //     //console.log("onScroll");
    //     //console.log(this.state.loaded);
    //     if (this.state.loaded) {//this.state.loaded
    //         var rightList = this.refs[RIGHT_LISTVIEW];
    //         //console.log(rightList)
    //         var y1 = rightList.scrollProperties.offset;
    //         //console.log(y1)
    //         this.setState({
    //             leftListOffset: { x: 0, y: y1 }
    //         });
    //     }
    // }


    // componentWillUpdate(nextProps: object, nextState: object) {
    //     //console.log(nextState.rightdataSource,'------------------->nextState.rightdataSource');
    //     let { pointInfo, data } = this.props;
    //     if (nextProps.data !== data) {
    //         this.rightArray = [];
    //         nextProps.data.forEach((ele, i) => {
    //             if ((ele["钻孔编号"] === pointInfo["钻孔编号"]) || (!ele["钻孔编号"])) {
    //                 this.rightArray.push(ele);
    //             }
    //         });
    //         this.state.rightdataSource = this.ds.cloneWithRows(this.rightArray);
    //     }
    //     else {
    //         if (this.changedRowIndex != -1) {
    //             this.state.rightdataSource = this.ds.cloneWithRows(this.rightArray);
    //         }
    //     }
    // };

    renderPicker = (FieldName, rowData, i) => {

        let FieldID = this.MapFieldName_ID[FieldName];

        return (<View style={styles.cellView} key={`right${i}`}>
            <Picker style={styles.cellView}
                selectedValue={this.MapValue_ID[rowData[FieldName]] ? this.MapValue_ID[rowData[FieldName]] : -1}
                onValueChange={(index) => {
                    let value = this.MapID_Value[index];
                    rowData[FieldName] = value;
                    this.onTableChange();
                }}
                mode="dropdown">
                {this.MapFieldID_Dom[FieldID]}
            </Picker>
        </View>);
    }


    //render 每行数据
    _rightRenderRow = (rowData: object, sectionID: number, rowID: number) => {
        this.renderRowList = [];
        this.FieldList.forEach((FieldName, i) => {
            if (this.MapFieldName_ID[FieldName]) {//选择项
                let fieldID = this.MapFieldName_ID[FieldName];//字段的ID
                this.renderRowList.push(this.renderPicker(FieldName, rowData, i));
            }
            else {//没有选择项
                this.renderRowList.push(
                    <View key={`right${i}`}>
                        <TextInput style={this.SelectedRow == rowID ? styles.cellViewSelect : styles.cellView}
                            onChangeText={(e) => { rowData[FieldName] = e; this.onTableChange(); }}
                            keyboardType={this.MapField_Type[FieldName] == '数字' ? "numeric" : "default"}
                            onFocus={() => { this.SelectedRow = rowID; }}
                        >
                            {rowData[FieldName]}
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
                                dataSource={this.state.rightdataSource}
                                //onScroll={this.onScroll}
                                renderRow={this._rightRenderRow}
                            />
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        );
    }
}

function mapStateToProps(state) {
    return {
        table: state.table.toJS(),
        login: state.login.toJS(),
        //cell : state.cell.toJS(),
        //project : state.project.toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DataGrid);

const styles = StyleSheet.create({
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
    darkTitleView: {
        width: 100,
        height: 40,
        backgroundColor: '#db384c',
        borderColor: '#DCD7CD',
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        alignItems: 'center',      // 水平局中
        justifyContent: 'center',  // 垂直居中
    },
    cellViewSelect: {           //选择状态的
        backgroundColor: '#90EE90',
        width: 100,
        height: 40,
        // backgroundColor:'#db384c',
        borderColor: '#DCD7CD',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        alignItems: 'center',      // 水平局中
        justifyContent: 'center',  // 垂直居中
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
    style_view_commit: {
        marginTop: 0,
        //marginLeft:10,
        //marginRight:10,
        backgroundColor: '#63B8FF',
        height: 35,
        //width:60,
        //borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});