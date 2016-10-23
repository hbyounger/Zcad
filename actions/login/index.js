/**
 * Created by wxk on 2016/5/25.
 */
import fetch from 'isomorphic-fetch';
import env from '../../helpers/env';
import { toJSON, genAction, genFetchOptions } from '../../helpers/util';
/*import request from 'superagent'

 export function login(name,password){
 return function(dispatch){
 console.log('login');
 request
 .post('/plogin')
 /!*            .send({
 acct_name:'1',
 password:'123'
 })*!/
 .end(function(err,res){
 dispatch({
 type : 'LOGIN',
 logresult : res.body
 })
 })
 }
 }*/


export function modalclose(){
    return function(dispatch){
        //console.log('MODAL_CLOSE');
        dispatch({
            type : 'MODAL_CLOSE'
        });
    }
}

export function modalopen(){
    return function(dispatch){
        //console.log('MODAL_OPEN');
        dispatch({
            type : 'MODAL_OPEN'
        });
    }
}

export function onchange(name,value){
    return function(dispatch){
        //console.log('MODAL_OPEN');
        dispatch({
            type : 'ONCHANGE',
            name : name,
            value : value
        });
    }
}

/*export function anonymouslogin(name,password){
    return function(dispatch){
        //console.log('anonymouslogin');
        request
            .post('/quickLogin')
            .end(function(err,res){
                dispatch({
                    type : 'ALOGIN',
                    logresult : res.body
                })
            })
    }
}*/

export function setaccount(value){
    return function(dispatch){
        //console.log('SETACCOUNT'+value);
        dispatch({
            type : 'SETACCOUNT',
            account : value
        })
    }
}
export function setstatus(value){
    return function(dispatch){
        //console.log('SETSTATUS'+value);
        dispatch({
            type : 'SETSTATUS',
            logstatus : value
        })
    }
}

export function setUserName(value) {
    //emptyAccountUL();
    //console.log(value);
    let username = value,
        errorMsg = '';
    if (!username || username == "") {
        errorMsg = "登录账号不能为空，请输入";
        //hiddenTitle();
        //return;
        //console.log(errorMsg);
    }
    return (dispatch) => {
        dispatch({
            type: 'PLATFORM_DATA_LOGIN_USERNAME',
            username: value,
            errorMsg: errorMsg
        })
    };
}


export function setPassWord(name, word) {
    //emptyAccountUL();
    //console.log(name+'-'+word);
    let password = word,
        username = name,
        errorMsg = '';
    if (!username || username == "") {
        if (!password || password == "") {
            errorMsg = "登录账号和密码不能为空，请输入";
        }
        else {
            errorMsg = "登录账号不能为空，请输入";
        }
    }
    else {
        if (!password || password == "") {
            errorMsg = "密码不能为空，请输入";
        }
    }
    //console.log(errorMsg);
    /*if (!password || password == "") {
     errorMsg = "密码不能空，请输入";
     //hiddenTitle();
     //return;

     }*/
    return (dispatch) => {
        //getAccount(username,password);
        dispatch({
            type: 'PLATFORM_DATA_LOGIN_PASSWORD',
            errorMsg: errorMsg
        })
        let options = {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'password': password,
            })
        }

        /*fetch(env.HTTP_USER_COR_ACC, options)
            .then(function (response) {
                if (response.status >= 400) {
                    throw new Error("Bad response from server")
                }
                //let temp = response.json()
                //console.log(temp);
                return response.json()
            })
            .then(function (json) {
                if (json.code === 200) {
                    //console.log(json.data);
                    dispatch({
                        type: 'PLATFORM_DATA_LOGIN_GET_ACCOUT_SUC',
                        account: json.data,
                    });
                } else {
                    //console.log(json.data);
                    dispatch({
                        type: 'PLATFORM_DATA_LOGIN_GET_ACCOUT_FAI',
                        errorMsg: json.data
                    })
                }
            })*/
    };
}

export const userLogin = (username,userWord,callback) => {
    /*let corp_id = user.corp_id,
     username = user.username;*/
    return (dispatch) => {
        // 登陆中，做禁用登陆 Button 等操作
        dispatch({
            type: 'PLATFORM_DATA_USER_LOGIN',
        });
        /*    username = 'zhangsan';
         userWord = '123456';
         corp_id = '2';
         let code_v = '002';*/
        let options;
        console.log(env.HTTP_USER_LOGIN);

        options = genFetchOptions('post', {
            username: username,
            password: userWord,
            option: 'login',
        });
        console.log(options);
        fetch(env.HTTP_USER_LOGIN, options)
            .then(toJSON)
            .then(function (json){
                console.log(json);
                if (json.code === 200) {
                    //console.log(json.data)
                    dispatch({
                        type:'PLATFORM_DATA_USER_LOGIN_SUCCEED',
                        payload:json
                    });
                    callback();
                    /*if (process.env.__CLIENT__ === true) {
                        //cb.rest.AppContext.token = json.data.token;
                        //location.href = '/'
                    }*/
                }
                else {
                    console.log(json)
                    dispatch({
                        type:'PLATFORM_DATA_USER_LOGIN_FAILURE',
                        payload:json
                    });
                    alert('服务器打了小瞌睡，请重试～')
                }
            })
        /*$.ajax({
            type: 'POST',
            // url: 'ajaxService/mapOperate.ashx',
            url: env.HTTP_USER_LOGIN,
            dataType: 'json',
            data: {
                username:username,
                password:userWord,
                option:'login'//  option: 'layerControl'   //
            },
            success: function (json) {

                var msg = json.result;
                if(msg =='0'){
                    console.log('提示', '用户名或密码错误');// alert('用户名或密码错误！');
                }
                else if(msg == "-1"){
                    console.log('提示', '用户尚未被审核，请尽快与管理员联系！'); //alert('用户尚未被审核，请尽快与管理员联系！');
                }
                else if (msg == "-2") {
                    console.log('提示', '数据服务错误，请尽快与管理员联系！'); //alert('数据连接错误，请尽快与管理员联系！');
                }
                else if (msg == "-3") {
                    console.log('提示', '权限不足，您无法登录系统！');
                }
                else{
                    callback();
                }
            },
            error: function () {
                alert('用户信息错误！');
            }
        });*/
        /*if(process.env.NODE_ENV === 'development'){
            console.log(options);

        }
        else {
            dispatch({
                type:'PLATFORM_DATA_USER_LOGIN_FAILURE',
                payload:{message :'请选择账套'},
            })
        }*/

        //console.log(options);

    }
}