/**
 * Created by younger on 2016/5/18.
 */
import Immutable from 'immutable'

const $$initialState = Immutable.fromJS({});

export default function login( $$state = $$initialState , action ){
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
            return $$state.merge({
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
            return $$state.merge({
                alogresult : action.logresult,
                logstatus : status
            });
            break;
        case 'MODAL_OPEN' :
            return $$state.merge({
                showModal : true
            });
            break;
        case 'MODAL_CLOSE' :
            return $$state.merge({
                showModal : false
            });
            break;
        case 'ONCHANGE' :
            let value = new Object();
            value[action.name] = action.value;
            return $$state.merge(value);
            break;
        case 'SETACCOUNT' :
            return $$state.merge({
                account : action.account
            });
            break;
        case 'SETSTATUS' :
            console.log('SETSTATUS:'+action.logstatus);
            return $$state.merge({
                logstatus : action.logstatus
            });
            break;
        default :
            return $$state;
    }
}

//export default login