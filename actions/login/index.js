/**
 * Created by wxk on 2016/5/25.
 */
//import fetchURL from 'fetch';
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

        /*fetchUrl(env.HTTP_USER_COR_ACC, options)
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

function createXMLHTTPRequest() {
    //1.创建XMLHttpRequest对象
    //这是XMLHttpReuquest对象无部使用中最复杂的一步
    //需要针对IE和其他类型的浏览器建立这个对象的不同方式写不同的代码
    var xmlHttpRequest;
    if (window.XMLHttpRequest) {
        //针对FireFox，Mozillar，Opera，Safari，IE7，IE8
        xmlHttpRequest = new XMLHttpRequest();
        //针对某些特定版本的mozillar浏览器的BUG进行修正
        if (xmlHttpRequest.overrideMimeType) {
            xmlHttpRequest.overrideMimeType("text/xml");
        }
    } else if (window.ActiveXObject) {
        //针对IE6，IE5.5，IE5
        //两个可以用于创建XMLHTTPRequest对象的控件名称，保存在一个js的数组中
        //排在前面的版本较新
        var activexName = [ "MSXML2.XMLHTTP", "Microsoft.XMLHTTP" ];
        for ( var i = 0; i < activexName.length; i++) {
            try {
                //取出一个控件名进行创建，如果创建成功就终止循环
                //如果创建失败，回抛出异常，然后可以继续循环，继续尝试创建
                xmlHttpRequest = new ActiveXObject(activexName[i]);
                if(xmlHttpRequest){
                    break;
                }
            } catch (e) {
            }
        }
    }
    return xmlHttpRequest;
}

function post(options){
    console.log('post');
    var req = createXMLHTTPRequest();
    if(req){
        req.open("POST", env.HTTP_USER_LOGIN, true);
        req.setRequestHeader("Content-Type","multipart/form-data; charset=utf-8");//application/json//application/x-www-form-urlencoded
        req.send(options);
        req.onreadystatechange = function(e){
            console.log(req);
            console.log(e);
            console.log(req.json());
            if(req.readyState == 4){
                if(req.status == 200){
                    alert("success");
                }
                else{
                    alert("error");
                }
            }
        }
    }
}

export const userLogin = (username,userWord,callback) => {

    let formData = new FormData;
    formData.append("username",username);
    formData.append("password",userWord);
    formData.append("option","login");
    return (dispatch) => {
        // 登陆中，做禁用登陆 Button 等操作
        dispatch({
            type: 'PLATFORM_DATA_USER_LOGIN',
        });
        console.log(env.HTTP_USER_LOGIN);
        //console.log(formData);
        options = genFetchOptions('post', formData);
        //console.log(options);
        //post(options);
        let id;
        fetch(env.HTTP_USER_LOGIN, {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                //'Content-Type': 'application/json',
            },
            body: formData,
        })
            .then(toJSON)
            .then((json) => {
                if (json.userid) {// === 200
                    console.log("json");
                    console.log(json);
                    dispatch({
                        type:'PLATFORM_DATA_USER_LOGIN_SUCCEED',
                        payload:json,
                        logType : 'off',
                    });
                    callback(json.userid);
                }
                else {
                    console.log(json);
                    dispatch({
                        type:'PLATFORM_DATA_USER_LOGIN_FAILURE',
                        payload:json
                    });
                    alert('登录失败，请重试～')
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
};
export const userOfflineLogin = (userid) => {

    return (dispatch) => {
        // 登陆中，做禁用登陆 Button 等操作
        dispatch({
            type:'PLATFORM_DATA_USER_LOGIN_SUCCEED',
            payload:{
                logType : 'off',
                userid : userid
            },
        });
    }
};
export const getUserPrivilege = (userid,callback) => {
    console.log(userid);
    let formData = new FormData;
    formData.append("userid",userid);
    formData.append("option","getProjectNameByUser");
    console.log(formData);
    console.log(formData);
    console.log("post");
    //(formData);
    return (dispatch) => {
        // 登陆中，做禁用登陆 Button 等操作
        console.log(env.HTTP_USER_LOGIN);
        fetch(env.HTTP_USER_LOGIN, {
            method: 'POST',
            headers: {},
            body: formData,
        })
            .then((response) => {
                return response.json()
            })
            .then((json) => {
                if (json) {
                    console.log(json);
                     dispatch({
                     type:'PLATFORM_DATA_USER_LOGIN_PRJS',
                         projects:json
                     });
                    callback(json);
                }
                else {
                    console.log(json)
                    alert('服务器打了小瞌睡，请重试～')
                }
            })
            .catch((error) => {
                console.error(error);
            })
    }
}

export const getAllData = (userid,projectName,callback) => {
    console.log(userid);
    let formData = new FormData;
    formData.append("userid",userid);
    formData.append("projectName",projectName);
    formData.append("option","getAllData");
    console.log(formData);
    console.log("post");
    //post(formData);
    return (dispatch) => {
        // 登陆中，做禁用登陆 Button 等操作
        console.log(env.HTTP_USER_LOGIN);
        fetch(env.HTTP_USER_LOGIN, {
            method: 'POST',
            headers: {},
            body: formData,
        })
            .then(toJSON)
            .then((json) => {
                if (json) {
                    dispatch({
                        type:'PLATFORM_DATA_USER_LOGIN_TABLES',
                        payload:json
                    });
                    callback(json);
                    //console.log(json)
                }
                else {
                    console.log(json)
                    alert('服务器打了小瞌睡，请重试～')
                }
            })
            .catch((error) => {
                console.error(error);
            })
    }
}