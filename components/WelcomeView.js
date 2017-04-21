/**
 * Created by wxk on 2016/7/18.
 */
'use strict';
import React,{ Component } from 'react';
import {
    Navigator,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    ScrollView,
    Alert,
    ListView
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import * as actions from '../actions/cell';
import * as projectActions from '../actions/project/project';
import * as loginActions from '../actions/login';
import Cell from './Cell';

//选择哪个项目
class WelcomeView extends Component {
    constructor(props){
        super(props);
 
        let { loginactions,login } = this.props;

        if(!login.offline){//在线状态
            //获得所有的工程名称
            loginactions.getProjectNameByUser(login.server,login.userid,(projects)=>{
            });
        }
        else {//离线状态
            if(!login.projects){
                //读取 项目名称
                storage.load({
                        key: 'userid',
                        id:login.userid,
                        autoSync: false,//true, // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                        syncInBackground: false,//true
                    })
                    .then(ret => {//获得离线数据
                        loginactions.getOfflineProjectName(ret);//所有的工程名称
                    })
                    .catch(err => {
                        console.warn(err.message);
                        switch (err.name) {
                            case 'NotFoundError':
                                alert('未找到数据');
                                break;
                            default:
                                alert(err.name);
                                break;
                        }
                    });
            }
        }
    }


    //点击工程
    onPressMap(projectName){
        let {loginactions,login,projectActions} = this.props;
        let projectid = login.userid+'-'+projectName;
        
        projectActions.SetProject(projectName);//??

        //得到工程的所有表格
        storage.load({
                key: 'projectid',
                id:projectid,
                autoSync: false,//true,
                syncInBackground: false,//true
            })
            .then(ret => {
                loginactions.getOfflineTables(ret);//工程的所有表格
                this.props.navigator.push({name: 'map'});
            })
            .catch(err => {
                console.log(err.message);
                switch (err.name) {
                    case 'NotFoundError':
                        alert("onPressMap:" + projectName + " 没有数据!");
                        break;
                    default:
                        alert('onPressMap:' + err.name + err.message);
                        break;
                }
            });
    };

    //退到登录界面
    onPressBack = () => {
        this.props.navigator.pop({name: 'login'});
    };

    //下载数据
    onDownLoadData(ele){
        let { loginactions,login } = this.props;
        loginactions.getAllData(login.server,login.userid,ele,(data)=>{
        });
        
        Alert.alert('成功',"下载数据成功",[{text: '确定', onPress: () => console.log('下载数据成功')},]);
    };


    render() {
        let { loginactions,login } = this.props;
        let ProjectArray = [];

        if(login.projects && login.projects.length > 0){
            login.projects.forEach((ele,i)=>{
               
                ProjectArray.push(

                <View key ={`prj${i}`} style={{flex: 1, flexDirection: 'row'}}>
                <TouchableHighlight
                style={{flex: 6}}
                    key = {`prjn${i}`}
                    onPress={this.onPressMap.bind(this,ele.PRIVILEGENAME)}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View style={{marginTop:15,marginLeft:10,marginRight:10,backgroundColor:'#63B8FF',height:35,borderRadius:5, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color:'#fff'}} >
                           {ele.PRIVILEGENAME}
                        </Text>
                    </View>
                </TouchableHighlight>

                {
                    (!login.offline)&&(
                                <TouchableHighlight
                                style={{flex: 2}}
                                    key = {`down${i}`}
                                    onPress={this.onDownLoadData.bind(this,ele.PRIVILEGENAME)}
                                    underlayColor="transparent"
                                    activeOpacity={0.5}>
                                    <View style={{marginTop:15,marginLeft:10,marginRight:10,backgroundColor:'#03B8FF',height:35,borderRadius:5, justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{color:'#fff'}} >
                                            {'下载数据'}
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                    )
                }

                </View>
                )
            })
        }

        return (
            <ScrollView >
                <Text style={styles.welcome} >
                    选择项目
                </Text>

                {ProjectArray}

                <TouchableHighlight
                    style={[styles.style_view_exit,{top : 0 ,left : 0}]}
                    onPress={this.onPressBack}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View >
                        <Text style={{color:'#fff'}} >
                            {'退出'}
                        </Text>
                    </View>
                </TouchableHighlight>

            </ScrollView>
        );

    };
}

const styles = StyleSheet.create({
    style_view_exit:{
        marginTop:25,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'#72d0eb',//#63B8FF//#7ebd26
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
        fontSize: 32,
        fontWeight: 'bold',
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
    style_view_Left:{
        flex: 1,
        marginTop:15,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'#63B8FF',
        height:35,
        width:150,
        borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    style_view_Right:{
        marginTop:15,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'#63B8FF',
        height:35,
        borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
    }
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

