/**
 * Created by wxk on 2016/5/25.
 */
//import fetchURL from 'fetch';
//import env from '../../helpers/env';
import { toJSON, genAction } from '../../helpers/util';
import Immutable from 'immutable'
const user = {
    id: null,
    username: null,
    password: null,
    corp_id: null,
    pubuts: null,
    bActivate: null,
    bEmailValid: null,
    bMobileValid: null,
    mobile: null,
    salt: null,
    iDeleted: null,
    bCorpRegister: null,
    dataSourceName: null,
    alias: null,
    token: null,
};

const $$initialState = Immutable.fromJS({
    // 用户属性
    ...user
});

export default function login(state = $$initialState, action) {
    let status,
        account;
    switch (action.type) {
        case 'PLATFORM_DATA_USER_LOGIN_SUCCEED'://登录成功了
            return state
                .merge(action.payload)
        case 'PLATFORM_DATA_USER_LOGIN_PRJS'://工程名称
            return state
                .merge({ projects: action.projects });//
        case 'PLATFORM_DATA_USER_LOGIN_TABLES'://设置数据表
            return state
                .merge({ tables: action.payload });
        default:
            return state;
    }
}

export const userLogin = (server, username, userWord, callback) => {
    let formData = new FormData;
    formData.append("username", username);
    formData.append("password", userWord);
    formData.append("option", "login");
    return (dispatch) => {
        // 登陆中，做禁用登陆 Button 等操作
        console.log('http://' + server + '/ajaxService/admin.ashx');

        fetch('http://' + server + '/ajaxService/admin.ashx', {
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
                        type: 'PLATFORM_DATA_USER_LOGIN_SUCCEED',
                        payload: {
                            userid: json.userid,
                            offline: false,
                            server: server
                        }
                    });
                    callback(json.userid);
                }
                else {
                    if (json.code == 500) {
                        alert("账号或密码错误，请重试");
                    }
                    alert('登录失败，请重试～' + json.code);
                }
            })
            .catch((error) => {
                alert(error);
                //console.error(error);
            });
    }
};

//得到用户的项目名称
export const getProjectNameByUser = (server, userid, callback) => {
    let formData = new FormData;
    formData.append("userid", userid);
    formData.append("option", "getProjectNameByUser");
    return (dispatch) => {
        //从服务器得到项目名称
        fetch('http://' + server + '/ajaxService/admin.ashx', {
            method: 'POST',
            headers: {},
            body: formData,
        })
            .then((response) => {
                return response.json()
            })
            .then((json) => {
                if (json) {
                    //得到了项目名称,保存起来
                    storage.save({
                        key: 'userid',  // 注意:请不要在key中使用_下划线符号!
                        id: userid,
                        rawData: json,
                        expires: null,//1000 * 3600
                    });
                    //设置 projects = 项目名称;
                    //SetStateprojects(json);//工程名称保存到state  projects 中
                    dispatch({
                        type: 'PLATFORM_DATA_USER_LOGIN_PRJS',
                        projects: json       //工程名称
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

//工程名称
export const SetStateprojects = (data) => {
    return (dispatch) => {
        dispatch({
            type: 'PLATFORM_DATA_USER_LOGIN_PRJS',
            projects: data       //工程名称
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

//工程的所有表格 放到state 的 tables
export const SetStateTables = (data) => {
    return (dispatch) => {
        dispatch({
            type: 'PLATFORM_DATA_USER_LOGIN_TABLES',
            payload: data
        });
    }
};

//得到工程下的所有表
export const getAllData = (server, userid, projectName, callback) => {
    console.log('getAllData  ' + userid);
    let formData = new FormData;
    formData.append("userid", userid);
    formData.append("projectName", projectName);
    formData.append("option", "getAllData");
    return (dispatch) => {
        //
        console.log('http://' + server + '/ajaxService/admin.ashx');
        fetch('http://' + server + '/ajaxService/admin.ashx', {
            method: 'POST',
            headers: {},
            body: formData,
        })
            .then(toJSON)
            .then((json) => {
                if (json) {
                    //保存起来
                    let projectid = userid + '-' + projectName;
                    console.log('下载数据 ' + projectid);

                    storage.save({
                        key: 'projectid',  // 注意:请不要在key中使用_下划线符号!
                        id: projectid,
                        rawData: json,
                        expires: null,//1000 * 3600
                    });

                    //工程的所有表格 放到state 的 tables
                    dispatch({ type: 'PLATFORM_DATA_USER_LOGIN_TABLES', payload: json });
                    //SetStateTables(json);

                    callback(json);
                }
                else {
                    console.log(json);
                    alert('服务器打了小瞌睡，请重试～');
                }
            })
            .catch((error) => {
                alert(error);
            })
    }
};

export const updateData = (server, userid, projectName, holeNo, Data, DbTableName) => {
    console.log(userid);
    let formData = new FormData;
    formData.append("userid", userid);
    formData.append("projectName", projectName);
    formData.append("holeNo", holeNo);
    formData.append("option", "updateData");
    formData.append("Data", JSON.stringify(Data));
    formData.append("DbTableName", DbTableName);
    return (dispatch) => {
        console.log('http://' + server + '/ajaxService/admin.ashx');
        fetch('http://' + server + '/ajaxService/admin.ashx', {
            method: 'POST',
            headers: {},
            body: formData,
        })
            .then(toJSON)
            .then((json) => {
                if (json) {
                    console.log(json)
                    alert('上传成功!')
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
