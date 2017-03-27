/**
 * Created by wxk on 2016/5/25.
 */
//import fetchURL from 'fetch';
//import env from '../../helpers/env';
import { toJSON, genAction, genFetchOptions } from '../../helpers/util';

export function modalclose(){
    return function(dispatch){
        dispatch({
            type : 'MODAL_CLOSE'
        });
    }
}

export function modalopen(){
    return function(dispatch){
        dispatch({
            type : 'MODAL_OPEN'
        });
    }
}

export function onchange(name,value){
    return function(dispatch){
        dispatch({
            type : 'ONCHANGE',
            name : name,
            value : value
        });
    }
}

export const userLogin = (server,username,userWord,callback) => {
    let formData = new FormData;
    formData.append("username",username);
    formData.append("password",userWord);
    formData.append("option","login");
    return (dispatch) => {
        // 登陆中，做禁用登陆 Button 等操作
        dispatch({
            type: 'PLATFORM_DATA_USER_LOGIN',
        });
        console.log('http://'+server+'/ajaxService/admin.ashx');
        options = genFetchOptions('post', formData);
        //let id;env.HTTP_USER_LOGIN//http://www.zcadsoft.com/zjweb/ajaxService/admin.ashx
        fetch('http://'+server+'/ajaxService/admin.ashx', {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                //'Content-Type': 'application/json',
            },
            body: formData,
        })
            .then(toJSON)

            .then((json) => {
                console.log(json);
                if (json.userid) {// === 200
                    //console.log("json");
                    alert("登录成功");
                    dispatch({
                        type:'PLATFORM_DATA_USER_LOGIN_SUCCEED',
                        payload:{
                            userid: json.userid,
                            offline : false,
                            server:server,
                        }
                    });
                    callback(json.userid);
                }
                else {
                    if(json.code==500){
                        alert("账号或密码错误，请重试");
                    }
                    console.log('登录失败，请重试～' + json);
                    dispatch({
                        type:'PLATFORM_DATA_USER_LOGIN_FAILURE',
                        payload:json
                    });
                    alert('登录失败，请重试～' + json);
                }
            })
            .catch((error) => {
                alert(error);
                //console.error(error);
            });
    }
};

export const userOfflineLogin = (userid) => {
    return (dispatch) => {
        // 登陆中，做禁用登陆 Button 等操作
        dispatch({
            type:'PLATFORM_DATA_USER_LOGIN_SUCCEED',
            payload:{
                offline : true,
                userid : userid
            },
        });
    }
};

//得到用户的项目名称
export const getProjectNameByUser = (server,userid,callback) => {
    let formData = new FormData;
    formData.append("userid",userid);
    formData.append("option","getProjectNameByUser");
    return (dispatch) => {
        // 登陆中，做禁用登陆 Button 等操作
        fetch('http://'+server+'/ajaxService/admin.ashx', {
            method: 'POST',
            headers: {},
            body: formData,
        })
            .then((response) => {
                return response.json()
            })
            .then((json) => {
                if (json) {
                    storage.load({
                            key: 'userid',
                            id:userid,
                            autoSync: false,//true, autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                            syncInBackground: false,//true
                        })
                        .then(ret => {
                            //比较工程队列是否需要更新
                            if(ret.length!=json.length){
                                storage.save({
                                    key: 'userid',  // 注意:请不要在key中使用_下划线符号!
                                    id:userid,
                                    rawData: json,
                                    expires: null,//1000 * 3600
                                });
                            }
                            //this.setState({ user: ret });
                        })
                        .catch(err => {
                            console.log(err.message);
                            switch (err.name) {
                                case 'NotFoundError':
                                    storage.save({
                                        key: 'userid',  // 注意:请不要在key中使用_下划线符号!
                                        id:userid,
                                        rawData: json,
                                        expires: null,//1000 * 3600
                                    });
                                    break;
                                case 'ExpiredError':
                                    // TODO
                                    alert('出错了');
                                    break;
                            }
                        });
                     dispatch({
                        type:'PLATFORM_DATA_USER_LOGIN_PRJS',
                         projects:json
                     });
                    callback(json);
                }
                else {
                    alert('服务器打了小瞌睡，请重试～')
                }
            })
            .catch((error) => {
                alert(error);
            })
    }
};

//获得离线数据
export const getOfflineData = (data)=>{
    return(dispatch)=>{
        dispatch({
            type:'PLATFORM_DATA_USER_LOGIN_PRJS',
            projects:data
        });
    }
};

export const getOfflineTables = (data) => {

    return (dispatch) => {
        dispatch({
            type:'PLATFORM_DATA_USER_LOGIN_TABLES',
            payload:data
        });
    }
};

//得到工程下的所有表
export const getAllData = (server,userid,projectName,callback) => {
    console.log('getAllData  ' + userid);
    let formData = new FormData;
    formData.append("userid",userid);
    formData.append("projectName",projectName);
    formData.append("option","getAllData");
    return (dispatch) => {
        // 登陆中，做禁用登陆 Button 等操作
        console.log('http://'+server+'/ajaxService/admin.ashx');
        fetch('http://'+server+'/ajaxService/admin.ashx', {
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
                alert(error);
            })
    }
};

export const setAllData = (server,userid,projectName,Data) => {
    console.log(userid);
    let formData = new FormData;
    formData.append("userid",userid);
    formData.append("projectName",projectName);
    formData.append("Data",Data);
    formData.append("option","setAllData");
    console.log(formData);
    return (dispatch) => {
        // 登陆中，做禁用登陆 Button 等操作
        console.log('http://'+server+'/ajaxService/admin.ashx');
        fetch('http://'+server+'/ajaxService/admin.ashx', {
            method: 'POST',
            headers: {},
            body: formData,
        })
            .then(toJSON)
            .then((json) => {
                if (json) {
                    console.log(json)
                }
                else {
                    console.log(json)
                    alert('服务器打了小瞌睡，请重试～')
                }
            })
            .catch((error) => {
                alert(error);
            })
    }
};

export const updateData = (server,userid,projectName,holeNo,Data,DbTableName) => {
    console.log(userid);
    let formData = new FormData;
    formData.append("userid",userid);
    formData.append("projectName",projectName);
    formData.append("holeNo",holeNo);
    formData.append("option","updateData");
    formData.append("Data",Data);
    formData.append("DbTableName",DbTableName);
    return (dispatch) => {
        console.log('http://'+server+'/ajaxService/admin.ashx');
        fetch('http://'+server+'/ajaxService/admin.ashx', {
            method: 'POST',
            headers: {},
            body: formData,
        })
            .then(toJSON)
            .then((json) => {
                if (json) {
                    /*dispatch({
                     type:'PLATFORM_DATA_USER_LOGIN_TABLES',
                     payload:json
                     });*/
                    //callback(json);
                    console.log(json)
                }
                else {
                    console.log(json)
                    alert('服务器打了小瞌睡，请重试～')
                }
            })
            .catch((error) => {
                alert(error);
            })
    }
};
