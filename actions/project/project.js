/**
 * Created by younger on 2016/8/14.
 */
import Immutable from 'immutable'
const $$initialState = Immutable.fromJS({});

export function SetProject(value){
    return function(dispatch){
        //console.log('SETACCOUNT'+value);
        dispatch({
            type : 'PRO_SET_PROJECT',
            value : value
        })
    }
}

export default function project( $$state = $$initialState , action ){
    let status,
        account;
    switch(action.type){
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
        case 'PRO_SET_PROJECT' :
            return $$state.merge({
                project : action.value
            });
            break;
        default :
            return $$state;
    }
}