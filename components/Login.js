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
//import userLogin from '../reducers/login';

class Login extends Component {
    constructor(props){
        super(props);
        // Initialize a Realm with Car and Person models
        //this.state
        console.log(this);
        console.log(this.state);
        this.state = {
            userName : '',
            wordValue : '',
        };
        console.log(this.state);
    }
    onPress = ()=>{
        /*let { actions } = this.props;
        this.props.navigator.push({name: 'welcome'});*/
        //actions.test(this.props.num);
        //let { loginActions } = this.props;
        //e.preventDefault();
        let {actions} = this.props;
        //console.log('收到表单值：', this.props.form.getFieldsValue());
        //

        actions.userLogin(this.state.userName,this.state.wordValue,(userid)=>{
            console.log(userid);
            this.props.navigator.push({name: 'welcome'});
        });
        /*const alertMessage =  '登录失败';
        Alert.alert('alert',alertMessage,[{text: 'OK', onPress: () => console.log('OK Pressed!')},]);*/
    }

    onOfflinePress = ()=>{
        let { actions } = this.props;
        this.props.navigator.push({name: 'welcome'});
        //actions.test(this.props.num);
    };

    handleServerChange = (e)=>{
        this.setState({
            server: e,
        });
    };
    
    handleUserChange (e){
        this.setState({
            userName: e,
        });
    };

    handlePasswordChange = (e)=>{
        this.setState({
            wordValue: e,
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
                />
                <TextInput
                    style={styles.style_user_input}
                    placeholder='用户名/手机号/邮箱'
                    numberOfLines={1}
                    autoFocus={true}
                    underlineColorAndroid={'transparent'}
                    textAlign='center'
                    onChangeText ={this.handleUserChange.bind(this)}
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
                    <View
                        style={styles.style_view_commit}
                    >
                        <Text
                            style={{color:'#fff'}}
                        >
                            登录
                        </Text>

                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={this.onOfflinePress}
                    underlayColor="transparent"
                    activeOpacity={0.5}>
                    <View
                        style={styles.style_view_commit}
                    >
                        <Text
                            style={{color:'#fff'}}
                        >
                            离线登录
                        </Text>
                    </View>
                </TouchableHighlight>
                <View style={{flex:1,flexDirection:'row',alignItems: 'flex-end',bottom:10}}>
                    <Text style={styles.style_view_unlogin}>
                        无法登录?
                    </Text>
                    <Text style={styles.style_view_register}>
                        新用户
                    </Text>
                </View>
            </View>
        );
    }
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
