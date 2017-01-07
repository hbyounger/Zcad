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
    ScrollView,
    ListView
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import * as actions from '../actions/cell';
import * as projectActions from '../redux/project';
import * as loginActions from '../actions/login';
import Cell from './Cell';


const FieldType = {
    typeID : 'int',
    typeName : 'string',
} 

class WelcomeView extends Component {
    constructor(props){
        super(props);
        this.projectList = [];
        //console.log("loadData");
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
                autoSync: false,//true,
                syncInBackground: false,//true
            })
            .then(ret => {
                loginactions.getOfflineTables(ret);
                this.props.navigator.push({name: 'map'});
            })
            .catch(err => {
                console.warn(err.message);
                switch (err.name) {
                    case 'NotFoundError':
                        alert("没有数据");
                        break;
                    case 'ExpiredError':
                        alert('出错了');
                        break;
                }
            });
    }

    onSubmit(){
        this.props.navigator.push({name: 'login'});
    }

    onTest(){
        let { loginactions,login } = this.props;
        loginactions.getUserPrivilege(login.server,login.userid,(projects)=>{
            projects.forEach((ele)=>{
                console.log(login);
                let projectid = login.userid+'-'+ele.PRIVILEGENAME;
                loginactions.getAllData(login.server,login.userid,ele.PRIVILEGENAME,(data)=>{
                    storage.save({
                        key: 'projectid',  // 注意:请不要在key中使用_下划线符号!
                        id: projectid,
                        rawData: data,
                        expires: null,//1000 * 3600
                    });

                });
            });
            alert("操作成功");
            //console.log(login.projects)
        });
    }

    loadData = ()=>{
        let { loginactions,login } = this.props;
        if(!login.offline){
            console.log(login.server);
            loginactions.getUserPrivilege(login.server,login.userid,(projects)=>{
                projects.forEach((ele)=>{
                    //console.log(ele.PRIVILEGENAME);
                    let projectid = login.userid+'-'+ele.PRIVILEGENAME;
                    storage.load({
                            key: 'projectid',
                            id:projectid,
                            autoSync: false,//true,
                            syncInBackground: false,//true
                        })
                        .then(ret => {
                            //alert("数据已存在");
                        })
                        .catch(err => {
                            console.warn(err.message);
                            switch (err.name) {
                                case 'NotFoundError':
                                    loginactions.getAllData(login.server,login.userid,ele.PRIVILEGENAME,(data)=>{
                                        storage.save({
                                            key: 'projectid',  // 注意:请不要在key中使用_下划线符号!
                                            id:projectid,
                                            rawData: data,
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
                    //console.log(ele);
                });
                //console.log(login.projects)
            });
        }
        else {
            //console.log("offline")
            if(!login.projects){
                storage.load({
                        key: 'userid',
                        id:login.userid,
                        // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                        autoSync: false,//true,
                        syncInBackground: false,//true
                    })
                    .then(ret => {
                        /*console.log("load");
                        console.log(ret);*/
                        //TODO:比较工程队列是否需要更新
                        loginactions.getOfflineData(ret);
                        //this.setState({ user: ret });
                    })
                    .catch(err => {
                        console.warn(err.message);
                        switch (err.name) {
                            case 'NotFoundError':
                                alert('未找到数据');
                                break;
                            case 'ExpiredError':
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

    onUpload = ()=>{
        let {loginactions,login} = this.props;
        if(this.projectList){
            this.projectList.forEach((ele,i)=>{
                let projectid = login.userid+'-'+ele.PRIVILEGENAME;
                storage.load({
                        key: 'projectid',
                        id:projectid,
                        autoSync: false,//true,
                        syncInBackground: false,//true
                    })
                    .then(ret => {
                        loginactions.setAllData(login.server,login.userid,ele.PRIVILEGENAME,ret);
                    })
                    .catch(err => {
                        console.warn(err.message);
                        switch (err.name) {
                            case 'NotFoundError':
                                // TODO;
                                //
                                break;
                            case 'ExpiredError':
                                // TODO
                                alert('出错了');
                                break;
                        }
                    });

            })
        }
    };

    render() {

        let { loginactions,login } = this.props;
        let ProjectArray = [];//.bind(this,ele)

        if(login.projects){
            this.projectList = login.projects;
        }

        if(this.projectList){
            this.projectList.forEach((ele,i)=>{
                ProjectArray.push(
                    <TouchableHighlight
                        key = {i}
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

        console.log(!login.offline);
        return (
            <ScrollView >
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
                {
                    (!login.offline)&&(
                        <TouchableHighlight
                            style={[styles.style_view_exit,{top : 0 ,left : 0}]}
                            onPress={this.onTest.bind(this)}
                            underlayColor="transparent"
                            activeOpacity={0.5}>
                            <View >
                                <Text style={{color:'#fff'}} >
                                    {'重新加载数据并覆盖本地数据'}
                                </Text>
                            </View>
                        </TouchableHighlight>
                    )

                }

            </ScrollView>
        );
    }
}
/*{
 (!login.offline)&&(
 <TouchableHighlight
 style={[styles.style_view_exit,{top : 0 ,left : 0}]}
 onPress={this.onUpload}
 underlayColor="transparent"
 activeOpacity={0.5}>
 <View >
 <Text style={{color:'#fff'}} >
 {'上传数据'}
 </Text>
 </View>
 </TouchableHighlight>
 )
 }*/
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

