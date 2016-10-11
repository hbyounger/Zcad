/**
 * Created by wxk on 2016/5/25.
 */
/*import request from 'superagent'

 export function login(name,password){
 return function(dispatch){
 console.log('login');
 request
 .post('/plogin')
 /!*            .send({
 acct_name:'1',
 password:'123'
 })*!/
 .end(function(err,res){
 dispatch({
 type : 'LOGIN',
 logresult : res.body
 })
 })
 }
 }*/

export function modalclose(){
    return function(dispatch){
        //console.log('MODAL_CLOSE');
        dispatch({
            type : 'MODAL_CLOSE'
        });
    }
}

export function modalopen(){
    return function(dispatch){
        //console.log('MODAL_OPEN');
        dispatch({
            type : 'MODAL_OPEN'
        });
    }
}

export function onchange(name,value){
    return function(dispatch){
        //console.log('MODAL_OPEN');
        dispatch({
            type : 'ONCHANGE',
            name : name,
            value : value
        });
    }
}

/*export function anonymouslogin(name,password){
    return function(dispatch){
        //console.log('anonymouslogin');
        request
            .post('/quickLogin')
            .end(function(err,res){
                dispatch({
                    type : 'ALOGIN',
                    logresult : res.body
                })
            })
    }
}*/

export function setaccount(value){
    return function(dispatch){
        //console.log('SETACCOUNT'+value);
        dispatch({
            type : 'SETACCOUNT',
            account : value
        })
    }
}
export function setstatus(value){
    return function(dispatch){
        //console.log('SETSTATUS'+value);
        dispatch({
            type : 'SETSTATUS',
            logstatus : value
        })
    }
}
