/**
 * Created by younger on 2016/9/10.
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
export function loadAndQueryDB(){
    //this.state.progress.push("Opening database ...");
    //this.setState(this.state);
    console.log('loadAndQueryDB');
    console.log('state');
    //console.log(this.state);
    db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, this.openCB, this.errorCB);
    //console.log('db');
    //console.log(db);
    this.populateDatabase(db);
}
export default function database( $$state = $$initialState , action ){
    let status,
        account;
    switch(action.type){
        case 'PRO_SET_PROJECT' :
            return $$state.merge({
                project : action.value
            });
            break;
        default :
            return $$state;
    }
}