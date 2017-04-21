/**
 * Created by wxk on 2016/8/11.
 */
'use strict';

import React,{Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    View,
    TextInput,
    Alert,
    TouchableHighlight
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as loginActions from '../actions/login';


class Login extends Component {
    constructor(props){
        super(props);

        this.state = {
            userName : '',//用户名称
            passWord : '',//密码
            urlServer: ''//服务器地址
        };

        console.log('storage.load');
        //读取服务器地址
        storage.load({
                key:'server',
                id:'login',
                autoSync: false,//true,
                syncInBackground: false,//true
            })
            .then(ret => {
                console.log("load:" + ret);
                this.setState({ urlServer: ret });
            })
            .catch(err => {
                console.log("storage.load server " + err);
            });

        //读取用户名称
        storage.load({
                key: 'user',
                id:'last',
                autoSync: false,//true,
                syncInBackground: false,//true
            })
            .then(ret => {
                console.log("load:" + ret);
                this.setState({ userName: ret });
            })
            .catch(err => {
                console.log("storage.load user " + err);
            });      
    };

    //点击登录
    onPress = ()=>{
        let {actions} = this.props;
        //得到userid
        actions.userLogin(this.state.urlServer,this.state.userName,this.state.passWord,(userid)=>{
            storage.save({
                key: 'user',  // 注意:请不要在key中使用_下划线符号!
                id:'last',
                rawData: this.state.userName,
                expires: null,//1000 * 3600 // 如果不指定过期时间，则会使用defaultExpires参数 // 如果设为null，则永不过期
            });
           storage.save({
                key: 'userid',  // 注意:请不要在key中使用_下划线符号!
                id:'last',
                rawData: userid,
                expires: null,//1000 * 3600
            });

            storage.save({
                key: 'server',  // 注意:请不要在key中使用_下划线符号!
                id:'login',
                rawData: this.state.urlServer,
                expires: null,//1000 * 3600
            });

            this.props.navigator.push({name: 'welcome'});
        });
    };

    //登录离线登录
    onOfflinePress = () => {
        let {actions} = this.props;
        storage.load({
                key: 'userid',
                id: 'last',
                autoSync: false, //true,
                syncInBackground: false, //true
            })
            .then(ret => {
                console.log("load userid " + ret);
                actions.userOfflineLogin(ret);
                this.props.navigator.push({ name: 'welcome'});
            })
            .catch(err => {
                console.warn(err.message);
                switch (err.name) {
                    case 'NotFoundError':
                        alert('onOfflinePress:未找到之前登录数据');
                        break;
                    default:
                        alert('onOfflinePress:' + err.name);
                        break;
                }
            });
    };

    handleServerChange = (e)=>{
        this.setState({
            urlServer: e,
        });
    };
    
    handleUserChange =(e)=>{
        this.setState({
            userName: e,
        });
    };

    handlePasswordChange = (e)=>{
        this.setState({
            passWord: e,
        });
    };

    render() {
        //autoFocus={true}
        return (
            <View style={{backgroundColor:'#f4f4f4',flex:1}}>
                <Image
                    style={styles.style_image}
                    source={require('../img/app_icon.png')}/>
                <TextInput
                    style={styles.style_user_input}
                    placeholder='服务器地址'
                    numberOfLines={1}
                    underlineColorAndroid={'transparent'}
                    textAlign='center'
                    onChangeText ={this.handleServerChange}
                    //ref = {'server'}
                    value={this.state.urlServer}
                />
                <TextInput
                    style={styles.style_user_input}
                    placeholder='用户名'
                    numberOfLines={1}
                    autoFocus={true}
                    underlineColorAndroid={'transparent'}
                    textAlign='center'
                    onChangeText ={this.handleUserChange}
                    value={this.state.userName}
                />
                <View
                    style={{height:1,backgroundColor:'#f4f4f4'}}
                />
                <TextInput
                    style={styles.style_pwd_input}
                    placeholder='密码'
                    numberOfLines={1}
                    underlineColorAndroid={'transparent'}
                    secureTextEntry={true}
                    textAlign='center'
                    onChangeText ={this.handlePasswordChange}
                />
                <TouchableHighlight
                    onPress={this.onPress}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View  style={styles.style_view_commit} >
                        <Text style={{color:'#fff'}} >
                            登录
                        </Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={this.onOfflinePress}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View  style={styles.style_view_commit} >
                        <Text  style={{color:'#fff'}} >
                            离线登录
                        </Text>
                    </View>
                </TouchableHighlight>
                <View style={{flex:1,flexDirection:'row',alignItems: 'flex-end',bottom:10}}>

                </View>
            </View>
        );
    };
}
const styles =StyleSheet.create({
    style_image:{
        borderRadius:35,
        height:70,
        width:70,
        marginTop:40,
        alignSelf:'center',
    },
    style_user_input:{
        backgroundColor:'#fff',
        marginTop:10,
        height:40,
    },
    style_pwd_input:{
        backgroundColor:'#fff',
        height:40,
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
    style_view_unlogin:{
        fontSize:12,
        color:'#63B8FF',
        marginLeft:10,
    },
    style_view_register:{
        fontSize:12,
        color:'#63B8FF',
        marginRight:10,
        alignItems:'flex-end',
        flex:1,
        flexDirection:'row',
        textAlign:'right',
    }
});
/*export class LoginView extends Component {
    render() {
        return (
            <View>
                <View>
                    <Text>添加账号</Text>
                </View>
                <View>
                    <Image source="{require('./images/ic_sina.png')}" src="" style="display: none;"/>
                        <Image alt="加载中..." title="图片加载中..." src="http://statics.2cto.com/images/s_nopic.gif"/>
                </View>
                <View>
                    <TextInput placeholder="'手机号/邮箱'/" underlinecolorandroid="'transparent'">
                        <Text></Text>
                        <TextInput placeholder="'密码'" securetextentry="{true}/" underlinecolorandroid="'transparent'">
                        </TextInput>
                    </TextInput>
                </View>
                <TextInput placeholder="'手机号/邮箱'/" underlinecolorandroid="'transparent'">

                </TextInput>
                <TextInput placeholder="'密码'" securetextentry="{true}/" underlinecolorandroid="'transparent'">

                </TextInput>
                <View>
                    <View>
                        <Text>登 录</Text>
                    </View>
                    <View></View>
                    <View>
                        <View>
                            <Text>无法登录？</Text>
                        </View>
                        <View>
                            <Text>新用户</Text>
                        </View>
                    </View>
                </View>
            </View>)
    }
}*/
/*


 */
/*const styles = {
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    header: {
        height: 50,
        justifyContent: 'center',
    },
    headtitle: {
        alignSelf: 'center',
        fontSize: 18,
        color: '#000000',
    },
    avatarview: {
        height: 150,
        backgroundColor: '#ECEDF1',
        justifyContent: 'center',
    },
    avatarimage: {
        width: 100,
        height: 100,
        alignSelf: 'center'
    },
    inputview: {
        height: 100,
    },
    textinput: {
        flex: 1,
        fontSize: 16,
    },
    dividerview: {
        flexDirection: 'row',
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ECEDF1'
    },
    bottomview: {
        backgroundColor: '#ECEDF1',
        flex: 1,
    },
    buttonview: {
        backgroundColor: '#1DBAF1',
        margin: 10,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logintext: {
        fontSize: 17,
        color: '#FFFFFF',
        marginTop: 10,
        marginBottom: 10,
    },
    emptyview: {
        flex: 1,
    },
    bottombtnsview: {
        flexDirection: 'row',
    },
    bottomleftbtnview: {
        flex: 1,
        height: 50,
        paddingLeft: 10,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    bottomrightbtnview: {
        flex: 1,
        height: 50,
        paddingRight: 10,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    bottombtn: {
        fontSize: 15,
        color: '#1DBAF1',
    }
};*/

function mapStateToProps(state){
    return {
        login : state.login.toJS()
    }
}

function mapDispatchToProps(dispatch){
    return {
        actions : bindActionCreators( loginActions , dispatch )
    }
}

export default connect(
    mapStateToProps ,
    mapDispatchToProps
)(Login);
