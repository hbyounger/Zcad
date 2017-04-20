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
import CheckBox from 'react-native-checkbox';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/table/table';
import Cell from './Cell'//SvgExample
//import SvgExample from './main'
//import Example from './Map'
import * as loginActions from '../actions/login';

import Grid from './DataGrid';
const window = Dimensions.get('window');
/*
var RIGHT_LISTVIEW = 'right_listView';
var LEFT_LISTVIEW = 'left_listView';

var array = [];
var titleArray = [];
var rightArray = [];

class Grid extends Component{
    constructor(props){
        super(props);
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        let offsetval = {x : 0, y: 0};
        let {login,table,pointInfo,data} = this.props;
        console.log("pointInfo : " + pointInfo);
        console.log("data : " + data);

        //要显示什么字段
        this.nameArray = [];

        let tables = login.tables;
        let List = tables["表_字段"];//表名
        List.forEach(ele=>{
            if(ele["表名"]===table.table){
                this.nameArray.push(ele["字段名"]);}
        })

 
        this.leftArray = [];
        this.rightArray = [];
        // for(let ele in data[0]){
        //     console.log(ele);
        //     this.nameArray.push(ele)
        // }
        data.forEach((ele,i)=>{
            if((ele["钻孔编号"]===pointInfo["钻孔编号"])||(!ele["钻孔编号"])){
                this.leftArray.push(ele["ID"]?ele["ID"]:i);
                this.rightArray.push(ele);
            }
        });
        this.props.callback(this.rightArray);
        this.nameList=[];
        this.nameArray.forEach((ele,i)=>{
            this.nameList.push(
                <View key = {`title${i}`} style = {styles.titleView}>
                    <Text>{ele}</Text>
                </View>
            )
        });
        this.state ={
            leftDataSource: ds.cloneWithRows(this.leftArray),
            rightdataSource: ds1.cloneWithRows(this.rightArray),
            leftListOffset: {x : 0, y: 0},
            loaded: false,

            selected1: 'key1',
            selected2: 'key1',
            selected3: 'key1',
            color: 'red',
            mode: Picker.MODE_DIALOG,
        };
    }

    componentDidMount(){
        this.setState({
            loaded : true
        });
        //this.state.loaded = true;
    }

    /!*let alertMessage = 'Credibly reintermediate next-generation potentialities after goal-oriented ' +
     'catalysts for change. Dynamically revolutionize.';
     Alert.alert('Alert Title',alertMessage,[{text: 'OK', onPress: () => console.log('OK Pressed!')},]);*!/
    onPressPicker(value){
        let alertMessage = value;
        Alert.alert('Alert Title',alertMessage,[{text: 'OK', onPress: () => console.log('OK Pressed!')},]);
        this.props.navigator.push({name: 'picker'});
    }
 
    onValChange = (key: string, value: string)=>{
        const newState = {};
        newState[key] = value;
        this.setState(newState);
        //Alert.alert('Alert Title',key+','+value,[{text: 'OK', onPress: () => console.log('OK Pressed!')}]);
    }
    onTableChange = (e)=>{
        this.props.callback(this.rightArray);
    };
    onScroll = ()=>{
        //console.log("onScroll");
        //console.log(this.state.loaded);
        if (this.state.loaded) {//this.state.loaded
            var rightList = this.refs[RIGHT_LISTVIEW];
            //console.log(rightList)
            var y1 = rightList.scrollProperties.offset;
            //console.log(y1)
            this.setState({
                leftListOffset :{x: 0 , y: y1}
            });
        }
    }

    _leftRenderRow = (rowData: string, sectionID: number, rowID: number)=>{
        return (
            <View style={styles.leftListRow}>
                <Text >
                    {rowData}
                </Text>
            </View>
        );
    }

    _rightRenderRow = (rowData: object, sectionID: number, rowID: number)=>{
        //() => Alert.alert('Alert Title',alertMessage,[{text: 'OK', onPress: () => console.log('OK Pressed!')},])  <TextInput>{rowData.name}</TextInput>
        let list=[];
        this.nameArray.forEach((ele,i)=>{
            list.push(
                <View key = {`right${i}`}>
                    <TextInput style = {styles.cellView} onChangeText ={(e)=>{rowData[ele]=e;this.onTableChange(e);}}>{rowData[ele]}</TextInput>
                </View>)
        });

        return (
            <View style = {styles.rightListRow}>
                {list}
            </View>
        );
    }

    render() {

        return (
            <ScrollView horizontal = {true} style = {styles.container}>
                <View style = {styles.left}>
                    <View style = {styles.mingcheng}>
                        <Text>ID</Text>
                    </View>

                    <ListView
                        ref = {LEFT_LISTVIEW}
                        style = {styles.leftListView}
                        contentOffset = {this.state.leftListOffset}
                        showsHorizontalScrollIndicator = {false}
                        showsVerticalScrollIndicator = {false}
                        scrollEnabled = {false}
                        bounces={false}
                        // scrollEventThrottle={500}
                        dataSource = {this.state.leftDataSource}
                        renderRow = {this._leftRenderRow}
                    />

                </View>
                <View style = {styles.right}>
                    <ScrollView
                        style = {styles.scrollView}
                        horizontal = {true}
                    >
                        <View style = {styles.contentView}>
                            <View style = {{width: 1000 , height: 40, flexDirection:'row'}}>
                                {this.nameList}
                            </View>
                            <ListView
                                ref = {RIGHT_LISTVIEW}
                                //scrollEventThrottle={500}
                                style = {styles.rightListView}
                                dataSource = {this.state.rightdataSource}
                                //onScroll={this.onScroll}
                                renderRow = {this._rightRenderRow}
                            />
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
        );
    }
}
*/

class DataView extends Component{
    constructor(props) {
        super(props);
        let {cell,login,table,project} = this.props;
        let tables = login.tables;
        this.List = tables[table.table];
        console.log(tables[table.table]);
        this.Array=[];
        this.pointInfo = cell.pointData;
        this.projectid = login.userid+'-'+project.project;
        this.login = login;
        this.table = table;
        //console.log(table.table);
        //console.log(this.List);
        //console.log(cell.pointData);
        //cell.pointData
        this.indexList = [];
        tables[table.table].forEach((ele,i)=>{
            if(ele&&((ele["钻孔编号"]===this.pointInfo["钻孔编号"])||(!ele["钻孔编号"]))){
                //this.leftArray.push(ele["ID"]?ele["ID"]:i);
                ele['check'] = i;
                ele = this.objKeySort(ele);
                this.Array.push(ele);
                console.log(ele);
                this.indexList.push(i);
                //tables[table.table][i] = ele;
                //delete();// = null;
            }
        });


        this.state ={
            List:this.Array,
        }
    }
    objKeySort = (obj)=> {//排序的函数
        var newkey = Object.keys(obj).reverse();
        //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
        var newObj = {};//创建一个新的对象，用于存放排好序的键值对
        newkey.map((item,index)=>{
            newObj[item] = obj[item];//向新创建的对象中按照排好的顺序依次增加键值对
        })
        return newObj;//返回排好序的新对象
    }
    //todo:保存---存在问题，还需要修改
    onSubmit = ()=>{
        let {login,table,loginactions} = this.props;
        let tables = login.tables;
        //tables[table.table] = this.List;
        console.log(tables[table.table]);
        /*this.state.List.forEach((ele,i)=>{
         if((ele["钻孔编号"]===this.pointInfo["钻孔编号"])||(!ele["钻孔编号"])){
         //this.leftArray.push(ele["ID"]?ele["ID"]:i);
         ele['check'] = i;
         this.Array.push(ele);
         }
         });*/
        for(let i = this.indexList.length;i>0;i--){
            tables[table.table].splice(this.indexList[i-1],1)
        }
        this.state.List.forEach((item,index)=>{
            delete (item['check']);
            tables[table.table].push(this.objKeySort(item));
        })
        loginactions.getOfflineTables(tables);
        storage.save({
            key: 'projectid',  // 注意:请不要在key中使用_下划线符号!
            id: this.projectid,
            rawData: tables,
            expires: null,//1000 * 3600
        });
        this.props.navigator.push({name: 'tablelist'});
    };

    //上传
    onUpload=(data)=>{
        let {loginactions,login,table,project} = this.props;
        loginactions.updateData(login.server,login.userid,project.project,this.pointInfo["钻孔编号"],this.state.List,table.table);
    }
//navigator = {this.props.navigator}

    /*onBack=()=>{
        let {login,table,loginactions} = this.props;
        let tables = login.tables;
        console.log(tables[table.table]);
        loginactions.getOfflineTables(tables);
        this.state.List.forEach((item,index)=>{
            delete (item['check']);
            tables[table.table].push(this.objKeySort(item));
        })
        this.props.navigator.pop({name: 'tablelist'});
    };*/
    onAdd = ()=>{
        console.log(this.state.List.length,'----->this.state.List.length')
        let newItem = Object.assign({},this.state.List[this.state.List.length-1]);
        newItem['ID'] += 1;
        console.log(newItem,'----->newItem')
        let newArray = [];
        newArray.push(newItem); 
        this.state.List.map((item,index)=>{
            newArray.push(item);
            item.check = false;
        })
        this.setState({
            List:newArray,
        })
    };
    onInsert = ()=>{
        console.log(this.state.List.length,'----->this.state.List.length')
        let newArray = [];
        this.state.List.map((item,index)=>{
            if(item.check) {
                let newItem = Object.assign({},this.state.List[this.state.List.length-1]);
                newItem['ID'] += 1;
                console.log(newItem,'----->newItem')
                newArray.push(newItem);
                item.check = false;
            }
            newArray.push(item);
        })
        this.setState({
            List:newArray,
        })
    };
    onDelete = ()=>{
        console.log(this.state.List.length,'----->this.state.List.length')
        let newArray = [];
        this.state.List.map((item,index)=>{
            if(!item.check){
                newArray.push(item);
            }
            else {
                item.check = false;
            }
        })
        this.setState({
            List:newArray,
        })
    };
    render(){
        let {login,table} = this.props;
        let tables = login.tables;
        console.log(login.tables['表_字段'],'------------------->login.tables[表_字段]');//选择值//表_字段

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
                        onPress={this.onSubmit}
                        underlayColor="transparent"
                        activeOpacity={0.5}>
                        <View >
                                <Text style={{color:'#fff'}} >
                                {'保存并返回'}
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
                    login = {this.login}
                    table = {this.table}
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
