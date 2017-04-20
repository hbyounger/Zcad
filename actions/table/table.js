/**
 * Created by younger on 2016/8/14.
 */
import Immutable from 'immutable'
const $$initialState = Immutable.fromJS({});

export function SetTable(value){
    return function(dispatch){
        //console.log('SETACCOUNT'+value);
        dispatch({
            type : 'TBL_SET_TABLE',
            value : value
        })
    }
}

export default function project( $$state = $$initialState , action ){
    switch(action.type){
        case 'TBL_SET_TABLE' :
            return $$state.merge({
                table : action.value
            });
            break;
        default :
            return $$state;
    }
}