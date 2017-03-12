/**
 * Created by wxk on 2016/7/19.
 */
'use strict';

import React,{ Component } from 'react';
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
    Picker
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../redux/table';
import Cell from './Cell'//SvgExample
//import SvgExample from './main'
//import Example from './Map'
import * as loginActions from '../actions/login';

import Grid from './DataGrid';
const window = Dimensions.get('window');

//<SvgExample/><Example/><Game2048/><Text style={styles.instructions} onPress={this.onPressWelcome}>Default view</Text>
class DataView extends Component{
    constructor(props) {
        super(props);
        let {cell,login,table,project} = this.props;
        let tables = login.tables;
        this.List = tables[table.table];
        //console.log(tables[table.table]);
        this.Array=[];
        this.pointInfo = cell.pointData;
        this.projectid = login.userid+'-'+project.project;
        //console.log(table.table);
        //console.log(this.List);
        //console.log(cell.pointData);
        //cell.pointData
        tables[table.table].forEach((ele,i)=>{
            if((ele["钻孔编号"]===this.pointInfo["钻孔编号"])||(!ele["钻孔编号"])){
                //this.leftArray.push(ele["ID"]?ele["ID"]:i);
                this.Array.push(ele);
            }
        });
        this.state ={
            List:this.Array,
        }
    }

    //保存
    onSubmit = (list)=>{
        let {login,table,loginactions} = this.props;
        let tables = login.tables;
        //tables[table.table] = this.List;
        console.log(tables[table.table]);
        loginactions.getOfflineTables(tables);
        storage.save({
            key: 'projectid',  // 注意:请不要在key中使用_下划线符号!
            id: this.projectid,
            rawData: tables,
            expires: null,//1000 * 3600
        });
        //this.props.navigator.push({name: 'tablelist'});
    };

    onUpload=(data)=>{
        let {loginactions,login,table,project} = this.props;
        loginactions.updateData(login.server,login.userid,project.project,this.pointInfo["钻孔编号"],this.Array,table.table);
    }
//navigator = {this.props.navigator}

    onBack=()=>{
        this.props.navigator.pop({name: 'tablelist'});
    };
    onAdd = ()=>{
        console.log(this.state.List.length,'----->this.state.List.length')
        let newItem = Object.assign({},this.state.List[this.state.List.length-1]);
        newItem['ID'] += 1;
        console.log(newItem,'----->newItem')
        let newArray = [];
        newArray.push(newItem);
        this.state.List.map((item,index)=>{
            newArray.push(item);
        })
        this.setState({
            List:newArray,
        })
    };
    onInsert = ()=>{

    };
    onDelete = ()=>{

    };
    render(){
        let {login,table} = this.props;
        let tables = login.tables;

        return (
            <View >
                <View >
                    <Text style = {styles.welcome} >
                        {table.table}
                    </Text>
                </View>

                <View style={{flex: 1, flexDirection: 'row'}}>
                    <TouchableHighlight
                        style={[styles.style_view_commit,{flex: 1,top : 0 ,left : 0}]}
                        onPress={this.onBack}
                        underlayColor="transparent"
                        activeOpacity={0.5}>
                        <View >
                            <Text style={{color:'#fff'}} >
                                {'返回'}
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[styles.style_view_commit,{flex: 1,top : 0 ,left : 0}]}
                        onPress={this.onSubmit}
                        underlayColor="transparent"
                        activeOpacity={0.5}>
                        <View >
                            <Text style={{color:'#fff'}} >
                                {'保存'}
                            </Text>
                        </View>
                    </TouchableHighlight>
                    {
                        (!login.offline)&&(
                            <TouchableHighlight
                                style={[styles.style_view_commit,{flex: 1,top : 0 ,left : 0,}]}
                                onPress={this.onUpload}
                                underlayColor="transparent"
                                activeOpacity={0.5}>
                                <View >
                                    <Text style={{color:'#fff'}} >
                                        {'上传'}
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        )
                    }
                    <TouchableHighlight
                        style={[styles.style_view_commit,{flex: 1,top : 0 ,left : 0}]}
                        onPress={this.onAdd}
                        underlayColor="transparent"
                        activeOpacity={0.5}>
                        <View >
                            <Text style={{color:'#fff'}} >
                                {'新增'}
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[styles.style_view_commit,{flex: 1,top : 0 ,left : 0}]}
                        onPress={this.onInsert}
                        underlayColor="transparent"
                        activeOpacity={0.5}>
                        <View >
                            <Text style={{color:'#fff'}} >
                                {'插入'}
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[styles.style_view_commit,{flex: 1,top : 0 ,left : 0}]}
                        onPress={this.onDelete}
                        underlayColor="transparent"
                        activeOpacity={0.5}>
                        <View >
                            <Text style={{color:'#fff'}} >
                                {'删除'}
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={{top : 10 }}>
                    <ScrollView >
                        <Grid
                            callback ={(list)=>{
                    this.Array=list;
                    this.setState({
                    List:list,
                    })
                    }}
                            pointInfo = {this.pointInfo}
                            data = {this.state.List}
                            navigator = {this.props.navigator}/>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    style_view_commit:{
        marginTop:0,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'#63B8FF',
        height:35,
        //width:60,
        borderRadius:5,
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
    left:{
        width: 50,
        //flex: 1,
        // backgroundColor:'yellow',
        flexDirection: 'column',
    },
    right:{
        flex: 3,
        backgroundColor:'white',
    },

    mingcheng:{
        height:40,
        marginLeft:0,
        marginRight:0,
        // backgroundColor:'red',
        borderColor: '#DCD7CD',
        borderBottomWidth:1,
        borderRightWidth:1,
        borderTopWidth: 1,
        alignItems: 'center',      // 水平局中
        justifyContent: 'center',  // 垂直居中
    },

    leftListView:{
        flex: 1,
        marginTop: 0,
        marginLeft:0,
        marginRight:0,
        marginBottom:30,
        // backgroundColor:'gray',
    },

    leftListRow:{
        //width:50,
        alignItems: 'center',      // 水平局中
        justifyContent: 'center',  // 垂直居中
        height: 40,
        //backgroundColor:'#db384c',
        borderColor: '#DCD7CD',
        borderBottomWidth:1,
        borderRightWidth:1,
    },

    rightListRow:{
        //width: 1000 ,
        height: 40,
        flexDirection:'row'
    },

    scrollView:{
        //flex: 1,
        marginRight:1,
        marginLeft:1,
        marginTop:0,
        marginBottom:1,
        // backgroundColor: 'red',
        flexDirection:'column',
        //height:Dimensions.get('window').height-110,
        //height: window.height -50,
    },

    contentView:{

        height: window.height -120,
        //width: 900 ,
        // backgroundColor:'yellow',
        flexDirection: 'column',
    },

    rightListView:{
        flex: 1,
        // backgroundColor : 'gray'
    },

    titleView:{
        width:100,
        height:40,
        backgroundColor:'#F5FCFF',
        borderColor: '#DCD7CD',
        borderTopWidth: 1,
        borderRightWidth:1,
        borderBottomWidth:1,
        alignItems: 'center',      // 水平局中
        justifyContent: 'center',  // 垂直居中
    },
    cell: {
        width:100,
        height:40,
        backgroundColor: '#7b8994',
        //margin: 2,
        //flex: 1,
        borderTopWidth: 1,
        borderRightWidth:1,
        borderBottomWidth:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellView:{
        width:100,
        height:40,
        // backgroundColor:'#db384c',
        borderColor: '#DCD7CD',
        borderRightWidth:1,
        borderBottomWidth:1,
        alignItems: 'center',      // 水平局中
        justifyContent: 'center',  // 垂直居中
    },
});

function mapStateToProps(state){
    return {
        table : state.table.toJS(),
        login : state.login.toJS(),
        cell : state.cell.toJS(),
        project : state.project.toJS(),
    }
}

function mapDispatchToProps(dispatch){
    return {
        actions : bindActionCreators( actions , dispatch ),
        loginactions : bindActionCreators( loginActions , dispatch )
    }
}

export default connect(
    mapStateToProps ,
    mapDispatchToProps
)(DataView);
