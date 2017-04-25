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
    Alert
} from 'react-native';

import CheckBox from 'react-native-checkbox'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/table/table';

const RIGHT_LISTVIEW = 'right_listView';
const window = Dimensions.get('window');

class DataGrid extends Component {
    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        let { holeNo, data, table, login } = this.props;

        this.FieldList = [];            //显示的数据字段
        this.renderFieldList = [];      //渲染时显示的字段
        this.MapFieldName_Type = {};    //Map  字段名 : 字段类型 
        this.MapFieldName_ID = {};      //Map  字段名 : 字段ID
        if (login.tables['表_字段']) {
            login.tables['表_字段'].forEach((item, i) => {
                if (item['表名'] === table.table) {

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
        //-----------------------
        this.rightArray = [];
        data.forEach((row, i) => {
            console.log(row);
            this.rightArray.push(row);
        });

        //-----------------------
        this.state = {
            rightdataSource: this.ds.cloneWithRows(this.rightArray)
        };
        this.SelectedRow = -1//当前选择行号

    }

    onTableChange = () => {
        this.props.callback(this.rightArray, this.SelectedRow);
    };

    refeshView(msg) {
        alert(msg);
        alert(this.SelectedRow);

        // this.rightArray
        // this.state = {
        //     rightdataSource: this.ds.cloneWithRows(this.rightArray),
        // }
        //rowData[FieldName] = msg;
    }


    //点击选择值
    onPressSelectValue(fieldID, value) {
        let { actions } = this.props;
        this.props.navigator.push({ name: 'SelectValue', callBack: (msg) => { this.refeshView(msg); } });
        actions.SetSelectValue({
            fieldID: fieldID,
            curvalue: value
        });
    }

    //render 每行数据
    _rightRenderRow = (rowData: object, sectionID: number, rowID: number) => {
        this.renderRowList = [];
        this.FieldList.forEach((FieldName, i) => {
            if (this.MapFieldName_ID[FieldName]) {//选择项
                let fieldID = this.MapFieldName_ID[FieldName];//字段的ID
                let value = rowData[FieldName];

                this.renderRowList.push(
                    <View key={`right${i}`}>
                        <TextInput style={this.SelectedRow == rowID ? styles.cellViewSelect : styles.cellView}
                            onFocus={this.onPressSelectValue.bind(this, fieldID, value)}
                        >
                            {value}
                        </TextInput>
                    </View>
                );
            }
            else {//没有选择项
                this.renderRowList.push(
                    <View key={`right${i}`}>
                        <TextInput style={this.SelectedRow == rowID ? styles.cellViewSelect : styles.cellView}
                            onChangeText={(e) => { rowData[FieldName] = e; this.onTableChange(); }}
                            keyboardType={this.MapFieldName_Type[FieldName] == '数字' ? "numeric" : "default"}
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

const styles = StyleSheet.create({

    container: {
        flexDirection: 'row',
        //marginTop: 20,
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    right: {
        flex: 3,
        backgroundColor: 'white',
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
    }
});



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