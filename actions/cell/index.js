/**
 * Created by younger on 2016/7/17.
 */
export function test(value){
    return function(dispatch){
        //console.log('SETACCOUNT'+value);
        dispatch({
            type : 'TEST',
            value : value
        })
    }
}

export function SetPosition(value){
    return function(dispatch){
        //console.log(value);
        dispatch({
            type : 'MAP_SET_POSITION',
            value : value.num,
            pointData:value.data
        })
    }
}