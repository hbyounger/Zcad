/**
 * Created by younger on 2016/7/17.
 */
import Immutable from 'immutable'
const $$initialState = Immutable.fromJS({});


export default function cell( $$state = $$initialState , action ){

    switch(action.type){
        case 'MAP_SET_HOLENO' :
            return $$state.merge({
                holeNo: action.holeNo.holeNo,
            });
            break;
        default :
            return $$state;
    }
}

export function SetHoleNo(holeNo){
    return function(dispatch){
        //console.log(value);
        dispatch({
            type : 'MAP_SET_HOLENO',
            holeNo:holeNo
        })
    }
}