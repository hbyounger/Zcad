/**
 * Created by younger on 2016/5/18.
 */
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
            console.log('action');
            console.log(action.payload.message);
            return state
                .set('loginStatus', 'FAILURE')
                .merge({
                    errorMsg: action.payload.message
                });
        case 'PLATFORM_DATA_USER_LOGIN_PRJS':
            console.log(action);
            console.log(action.projects);
            return state
                .merge({projects: action.projects});//
        case 'PLATFORM_DATA_USER_LOGIN_TABLES':
            console.log(action);
            console.log(action.payload);
            return state
                .merge({tables: action.payload});
        default :
            return state;
    }
}

//export default login