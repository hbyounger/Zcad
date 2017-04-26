/**
 * Created by wxk on 2016/5/25.
 */
//import fetchURL from 'fetch';
//import env from '../../helpers/env';
import { toJSON, genAction, genFetchOptions } from '../../helpers/util';
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
    ...user,

    // 登陆状态
    loginStatus: 'READY',
});

export default function login( state = $$initialState , action ){
    let status,
        account;
    switch(action.type){
        case 'LOGIN' :
            //logresult : action.logresult,
            //console.log('r-logresult'+ action.logresult['code']);
            switch (action.logresult['code']){
                case 0:
                case '0':
                    status = 'login';
                    account = action.logresult['info']['account'];
                    console.log('r-account'+action.logresult['info']['account'])
                    break;
                default :
                    status = 'alogin';
                    account = 0;
            }
            return state.merge({
                //logresult : action.logresult,
                logstatus : status,
                account : account
            });
            break;
        case 'ALOGIN' :
            //logresult : action.logresult,
            //console.log('alogresult-'+ action.logresult);
            switch (action.logresult){
                case 0:
                case '0':
                    status = 'alogin';
                    break;
                default :
                    status = '';
            }
            return state.merge({
                alogresult : action.logresult,
                logstatus : status
            });
            break;
        case 'MODAL_OPEN' :
            return state.merge({
                showModal : true
            });
            break;
        case 'MODAL_CLOSE' :
            return state.merge({
                showModal : false
            });
            break;
        case 'ONCHANGE' :
            let value = new Object();
            value[action.name] = action.value;
            return state.merge(value);
            break;
        case 'SETACCOUNT' :
            return state.merge({
                account : action.account
            });
            break;
        case 'SETSTATUS' :
            console.log('SETSTATUS:'+action.logstatus);
            return state.merge({
                logstatus : action.logstatus
            });
            break;
        case 'PLATFORM_DATA_USER_LOGIN':
            return state
                .set('loginStatus', 'ING')

        case 'PLATFORM_DATA_USER_LOGIN_SUCCEED':
            //console.log('PLATFORM_DATA_USER_LOGIN_SUCCEED')
            return state
                .set('loginStatus', 'SUCCEED')
                .merge(action.payload)
        //.merge({ userId: loginid });

        case 'PLATFORM_DATA_USER_LOGIN_FAILURE':
            //console.log('action');
            //console.log(action.payload.message);
            return state
                .set('loginStatus', 'FAILURE')
                .merge({
                    errorMsg: action.payload.message
                });
        case 'PLATFORM_DATA_USER_LOGIN_PRJS':
            //console.log(action);
            //console.log(action.projects);
            return state
                .merge({projects: action.projects});//
        case 'PLATFORM_DATA_USER_LOGIN_TABLES':
            //console.log(action);
            //console.log(action.payload);
            return state
                .merge({tables: action.payload});
        default :
            return state;
    }
}


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
                            server:server
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
                    alert('登录失败，请重试～' + json.code);
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
        //从服务器得到项目名称
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
                    //得到了项目名称,保存起来
                    storage.save({
                                    key: 'userid',  // 注意:请不要在key中使用_下划线符号!
                                    id:userid,
                                    rawData: json,
                                    expires: null,//1000 * 3600
                                });
                    //设置 projects = 项目名称;
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

//获得离线 工程名称
export const getOfflineProjectName = (data)=>{
    return(dispatch)=>{
        dispatch({
            type:'PLATFORM_DATA_USER_LOGIN_PRJS',
            projects:data       //离线 工程名称
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
        //
        console.log('http://'+server+'/ajaxService/admin.ashx');
        fetch('http://'+server+'/ajaxService/admin.ashx', {
            method: 'POST',
            headers: {},
            body: formData,
        })
            .then(toJSON)
            .then((json) => {
                if (json) {
                    //保存起来
                    let projectid = userid+'-'+projectName;
                    console.log('下载数据 ' + projectid);
                    // console.log('json ');
                    // console.log(json);
                    // let data = {},
                    //     tableItemList = {},
                    //     itemList = json['表_字段'];
                    // if(itemList){
                    //     itemList.map((item,index)=>{
                    //         console.log(item);
                    //         if(item['表名']){
                    //             if(!tableItemList[item['表名']]){
                    //                 tableItemList[item['表名']] = {};
                    //             }
                    //             tableItemList[item['表名']][item['字段名']] = item['类型'];
                    //         }
                    //     })
                    // }
                    // else {
                    //     alert('可用字段数据为空，请联系数据管理员！')
                    // }
                    // console.log(tableItemList,'---tableItemList');
                    // let tables = json['项目_表'],
                    //     tableList = {};
                    // if(tables){
                    //     tables.map((item,index)=>{
                    //         console.log(item);
                    //         if(item['表名']){
                    //             tableList[item['表名']] = item['顺序'];
                    //         }
                    //     })
                    // }
                    // else {
                    //     alert('可用表数据为空，请联系数据管理员！')
                    // }

                    // console.log(tableList,'-----tableList');
                    // for(let tName in json){
                    //     console.log(tName,'-----tName');
                    //     if(tableList[tName]){
                    //         data[tName] =[];

                    //         if(json[tName].length!==0){
                    //             json[tName].map((item,index)=>{
                    //                 let tempItem = {};
                    //                 for(let iName in item){
                    //                     if(tableItemList[tName][iName]||iName === '钻孔编号'){
                    //                         tempItem[iName] = item[iName];
                    //                     }
                    //                 }
                    //                 data[tName].push(tempItem);
                    //             })
                    //         }
                    //         else {
                    //             let tempItem = {};
                    //             for(let itName in tableItemList[tName]){
                    //                 tempItem[itName] = '';
                    //             }
                    //             if(!tableItemList[tName]['钻孔编号']){
                    //                 tempItem['钻孔编号'] = '';
                    //             }
                    //             data[tName].push(tempItem);
                    //         }
                    //     }
                    // }
                    // data['表_字段'] = json['表_字段'];
                    // data['选择值'] = json['选择值'];
                    // data['项目_表'] = json['项目_表'];
                    // data['勘探点数据表'] = json['勘探点数据表'];
                    // data['土层表'] = json['土层表'];
                    // console.log(data,'------data');
                    storage.save({
                        key: 'projectid',  // 注意:请不要在key中使用_下划线符号!
                        id: projectid,
                        rawData: json,
                        expires: null,//1000 * 3600
                    });

                    dispatch({
                        type:'PLATFORM_DATA_USER_LOGIN_TABLES',
                        payload:json
                    });
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
