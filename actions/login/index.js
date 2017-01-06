/**
 * Created by wxk on 2016/5/25.
 */
//import fetchURL from 'fetch';
import env from '../../helpers/env';
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
        fetch('http://'+server+'/ajaxService/admin.ashx'/*'http://'+server+'/ajaxService/admin.ashx'*/, {
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
                        alert("账号或密码错误，请重试")
                    }
                    //console.log(json);
                    dispatch({
                        type:'PLATFORM_DATA_USER_LOGIN_FAILURE',
                        payload:json
                    });
                    alert('登录失败，请重试～')
                }
            })
            .catch((error) => {
                alert(error);
                //console.error(error);
            });
    }
};

export const userOfflineLogin = (userid) => {
    //console.log(userid);
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

export const getUserPrivilege = (server,userid,callback) => {
    //console.log(userid);
    let formData = new FormData;
    formData.append("userid",userid);
    formData.append("option","getProjectNameByUser");
    //console.log(formData);
    //console.log("post");
    //(formData);
    return (dispatch) => {
        // 登陆中，做禁用登陆 Button 等操作
        //console.log('http://'+server+'/ajaxService/admin.ashx');
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
                    //console.log(json);
                    storage.load({
                            key: 'userid',
                            id:userid,
                            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                            autoSync: false,//true,
                            syncInBackground: false,//true
                        })
                        .then(ret => {
                            //console.log("load");
                            //console.log(ret);
                            //TODO:比较工程队列是否需要更新
                            if(ret.length!=json.length){
                                storage.save({
                                    key: 'userid',  // 注意:请不要在key中使用_下划线符号!
                                    id:userid,
                                    rawData: json,
                                    // 如果不指定过期时间，则会使用defaultExpires参数
                                    // 如果设为null，则永不过期
                                    expires: null,//1000 * 3600
                                });
                            }
                            //this.setState({ user: ret });
                        })
                        .catch(err => {
                            console.warn(err.message);
                            switch (err.name) {
                                case 'NotFoundError':
                                    // TODO;
                                    //alert('未找到数据');
                                    //console.log("save");
                                    //console.log(userid);
                                    storage.save({
                                        key: 'userid',  // 注意:请不要在key中使用_下划线符号!
                                        id:userid,
                                        rawData: json,
                                        // 如果不指定过期时间，则会使用defaultExpires参数
                                        // 如果设为null，则永不过期
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
                    //console.log(json);
                    alert('服务器打了小瞌睡，请重试～')
                }
            })
            .catch((error) => {
                alert(error);
            })
    }
};

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

export const getAllData = (server,userid,projectName,callback) => {
    console.log(userid);
    let formData = new FormData;
    formData.append("userid",userid);
    formData.append("projectName",projectName);
    formData.append("option","getAllData");
    //console.log(formData);
    //console.log("post");
    //post(formData);
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
    //console.log("post");
    //post(formData);
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

export const updateData = (server,userid,projectName,holeNo,Data,DbTableName) => {
    console.log(userid);
    let formData = new FormData;
    formData.append("userid",userid);
    formData.append("projectName",projectName);
    formData.append("holeNo",holeNo);
    formData.append("option","updateData");
    formData.append("Data",Data);
    formData.append("DbTableName",DbTableName);

    console.log(formData);
    //console.log("post");
    //post(formData);
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
