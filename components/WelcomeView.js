/**
 * Created by wxk on 2016/7/18.
 */
import React,{ Component } from 'react';
import {
    Navigator,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    ListView
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import * as actions from '../actions/cell';
import * as projectActions from '../redux/project';
import * as loginActions from '../actions/login';
import Cell from './Cell';
//import Realm from 'realm';

const CarSchema = {
  name: 'Car',
  properties: {
    make:  'string',
    model: 'string',
    miles: {type: 'int', default: 0},
  }
};

const PersonSchema = {
  name: 'Person',
  properties: {
    name:     'string',
    birthday: 'date',
    cars:     {type: 'list', objectType: 'Car'},
    picture:  {type: 'data', optional: true}, // optional property
  }
};
//工程表
const ProjectSchema = {
    name : 'Projects',
    properties: {
        projectID :'int',
        projectName : 'string',
        tablesListID : {
            type: 'list',
            objectType: 'Tables',
        }
    }
};
//表表
const TableSchema = {
    name : 'Tables',
    properties: {
        tableID :'int',
        projectID :'int',
        tableType : 'string',
        fieldsID : {
            type : 'list',
            objectType : 'Field'
        },
    }
}
//字段表
const FieldSchema = {
    name : 'Field',
    properties: {
        fieldID :'int',
        tableID :'int',
        fieldName : 'string',
        typeName : 'string',
        typeID : 'int',
    }
}
//标贯表:ID 钻孔编号 试验点的底深度 杆长 标贯击数 试验编号
const BGSchema = {
    name : 'biaoguan',
    properties :　{
        ID : 'int',
        holeIndex : 'int',

    }
}
//波速表：钻孔编号 试验点的深度 横波波速 纵波波速 ID
const BSSchema ={
    name : 'bosu',
    properties : {
        ID : 'int',
        holeIndex : 'int',
        pointDepth : 'float',
        HWSpeed : 'float',
        VWSpeed : 'float',
    }
}

//场地地层表：
//主地层编号 亚地层编号 地质时代 成因 岩土类名 岩土名称 亚岩土名称 颜色 密实度 湿度 可塑性 浑圆度 均匀性
//风化程度 岩石倾向 岩石倾角 矿物成分 结构构造 包含物 气味 描述 压缩模量 ID
const layerSchema = {
    name : 'string',
    properties : {
        ID : 'int',
        mainLayerInx : 'int',
        subLayerInx : 'int',
        GeoTime : 'string',
        reason : 'string',
        rockType : 'string',
        rockName : 'string',
        subRockName : 'string',
        color : 'string',
        density : 'string',
        humidity :'string',
        plasticity : 'string',
        circular : 'string',
        evenness : 'string',
        weathing : 'string',
        rockOrientation :'float',
        rockAngle : 'float',
        materialIngredient : 'string',
        structure : 'string',

    }
}
//动探表：钻孔编号 试验点的底深度 动探类型 杆长 动探击数 ID

//静探表：钻孔编号 实验点底深度 静探类型 锥头阻力 侧壁摩阻力 磨阻比 ID

//勘探点数据表：钻孔编号 孔口标高 勘探深度 坐标X 坐标Y 勘探点类型 探井深度 勘探日期 ID 钻孔直径 水位高程

//剖线数据表： 剖线编号 剖线孔号 ID

//取样表: 钻孔编号 取样编号 取样类型 取样深度 取样长度 ID

//土层表 钻孔编号 层底深度 主地层编号  亚地层编号 地质时代 成因 地层厚度 岩土类名 岩土名称  土名代号 亚岩土名称 颜色 
//密实度 湿度 可塑性 压缩性 浑圆度 均匀性 风化程度 包含物 气味 描述 ID

//岩心采取率、RQD表： ID 钻孔编号 深度 岩心采取率 RQD 备注

//字段类型：
const FieldType = {
    typeID : 'int',
    typeName : 'string',
} 

class WelcomeView extends Component {
    constructor(props){
        super(props);
        // Initialize a Realm with Car and Person models
        this.projectList = [];
        console.log("loadData");
        this.loadData();
    }

    onPressMap(value){
        let {loginactions,login,projectActions} = this.props;
        let projectid = login.userid+'-'+value;
        //console.log(login);
        projectActions.SetProject(value);

        storage.load({
                key: 'projectid',
                id:projectid,
                // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                autoSync: false,//true,
                syncInBackground: false,//true
            })
            .then(ret => {
                // 如果找到数据，则在then方法中返回
                // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
                // 你只能在then这个方法内继续处理ret数据
                // 而不能在then以外处理
                // 也没有办法“变成”同步返回
                // 你也可以使用“看似”同步的async/await语法
                console.log("load prj");
                console.log(ret);
                //this.setState({ user: ret });
                loginactions.getOfflineTables(ret);
                this.props.navigator.push({name: 'map'});
            })
            .catch(err => {
                //如果没有找到数据且没有sync方法，
                //或者有其他异常，则在catch中返回
                console.warn(err.message);
                switch (err.name) {
                    case 'NotFoundError':
                        // TODO;
                        alert("没有数据");
                        break;
                    case 'ExpiredError':
                        // TODO
                        alert('出错了');
                        break;
                }
            });
    }
    onSubmit(){
        this.props.navigator.push({name: 'login'});
    }
    onTest(){
        this.loadData();
        //loginactions.getAllData();
        //this.props.navigator.push({name: 'realm'});//callback//promise
    }
    loadData = ()=>{
        let { loginactions,login } = this.props;
        console.log(login);
        console.log(login.offline);
        if(!login.offline){
            loginactions.getUserPrivilege(login.userid,(projects)=>{

                projects.forEach((ele)=>{
                    //console.log(ele.PRIVILEGENAME);
                    let projectid = login.userid+'-'+ele.PRIVILEGENAME;
                    storage.load({
                            key: 'projectid',
                            id:projectid,
                            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                            autoSync: false,//true,

                            // syncInBackground(默认为true)意味着如果数据过期，
                            // 在调用sync方法的同时先返回已经过期的数据。
                            // 设置为false的话，则始终强制返回sync方法提供的最新数据(当然会需要更多等待时间)。
                            syncInBackground: false,//true
                        })
                        .then(ret => {
                            // 如果找到数据，则在then方法中返回
                            // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
                            // 你只能在then这个方法内继续处理ret数据
                            // 而不能在then以外处理
                            // 也没有办法“变成”同步返回
                            // 你也可以使用“看似”同步的async/await语法
                            console.log("load prj");
                            console.log(ret);
                            //this.setState({ user: ret });
                        })
                        .catch(err => {
                            //如果没有找到数据且没有sync方法，
                            //或者有其他异常，则在catch中返回
                            console.warn(err.message);
                            switch (err.name) {
                                case 'NotFoundError':
                                    // TODO;
                                    //
                                    console.log("save prj");
                                    console.log(projectid);
                                    loginactions.getAllData(login.userid,ele.PRIVILEGENAME,(data)=>{
                                        console.log("getAllData");
                                        console.log(data);
                                        //console.log(login.projects)
                                        storage.save({
                                            key: 'projectid',  // 注意:请不要在key中使用_下划线符号!
                                            id:projectid,
                                            rawData: data,
                                            // 如果不指定过期时间，则会使用defaultExpires参数
                                            // 如果设为null，则永不过期
                                            expires: null,//1000 * 3600
                                        });
                                    });
                                    break;
                                case 'ExpiredError':
                                    // TODO
                                    alert('出错了');
                                    break;
                            }
                        });
                    console.log(ele);
                });
                //console.log(login.projects)
            });
        }
        else {
            console.log("offline")
            if(!login.projects){
                storage.load({
                        key: 'userid',
                        id:login.userid,
                        // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                        autoSync: false,//true,
                        syncInBackground: false,//true
                    })
                    .then(ret => {
                        console.log("load");
                        console.log(ret);
                        //TODO:比较工程队列是否需要更新
                        loginactions.getOfflineData(ret);
                        //this.setState({ user: ret });
                    })
                    .catch(err => {
                        console.warn(err.message);
                        switch (err.name) {
                            case 'NotFoundError':
                                // TODO;
                                alert('未找到数据');
                                break;
                            case 'ExpiredError':
                                // TODO
                                alert('出错了');
                                break;
                        }
                    });
            }
        }
    };
    renderProgressEntry = (entry)=>{
        //styles.style_view_commit
        //listStyles.li
        return (
            <TouchableHighlight
                onPress={this.onPressMap.bind(this,entry)}
                underlayColor="transparent"
                activeOpacity={0.5}>
                <View style={styles.style_view_commit}>
                    <View>
                        <Text style={{color:'#fff'}}>{entry}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    render() {

        let { loginactions,login } = this.props;
        let ProjectArray = [];//.bind(this,ele)

        if(login.projects){
            this.projectList = login.projects;
        }

        if(this.projectList){
            this.projectList.forEach((ele)=>{
                ProjectArray.push(
                    <TouchableHighlight
                        onPress={this.onPressMap.bind(this,ele.PRIVILEGENAME)}
                        underlayColor="transparent"
                        activeOpacity={0.5}>
                        <View style={styles.style_view_commit}>
                            <Text style={{color:'#fff'}} >
                                {ele.PRIVILEGENAME}
                            </Text>
                        </View>
                    </TouchableHighlight>
                )
            })
        }

        return (

            <View >
                <Text style={styles.welcome} >
                    选择项目
                </Text>
                {ProjectArray}
                <TouchableHighlight
                    style={[styles.style_view_exit,{top : 0 ,left : 0}]}
                    onPress={this.onSubmit.bind(this)}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View >
                        <Text style={{color:'#fff'}} >
                            {'退出'}
                        </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    style={[styles.style_view_exit,{top : 0 ,left : 0}]}
                    onPress={this.onTest.bind(this)}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View >
                        <Text style={{color:'#fff'}} >
                            {'加载数据'}
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    style_view_exit:{
        marginTop:25,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'#63B8FF',
        height:35,
        //width:60,
        //borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        color:'#63B8FF',
        fontSize: 16,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    cell: {
        width: 16,
        height: 16,
        borderRadius: 3,
        backgroundColor: '#7b8994',
        margin: 2,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellX: {
        backgroundColor: '#72d0eb',
    },
    cellO: {
        backgroundColor: '#7ebd26',
    },
    cellText: {
        fontSize: 50,
        fontFamily: 'AvenirNext-Bold',
    },
    cellTextX: {
        color: '#19a9e5',
    },
    cellTextO: {
        color: '#b9dc2f',
    },
    style_view_commit:{
        marginTop:15,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'#63B8FF',
        height:35,
        borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

function mapStateToProps(state){
    return {
        cell : state.cell.toJS(),
        login : state.login.toJS()
    }
}

function mapDispatchToProps(dispatch){
    return {
        projectActions : bindActionCreators( projectActions , dispatch ),
        loginactions : bindActionCreators( loginActions , dispatch )
    }
}
//export default
export default connect(
    mapStateToProps ,
    mapDispatchToProps
)(WelcomeView);

