/**
 * Created by wxk on 2016/7/19.
 */
import Immutable from 'immutable'
import env from '../../helpers/env'

const $$initialState = Immutable.fromJS({
  //logstatus : 'alogin'
});

export function tree( $$state = $$initialState , action ){
  let status,
    account;
  switch(action.type){

    case 'PLATFORM_UI_TREE_LOAD' :
      //console.log(action.TreeData);
      return $$state.merge({
        TreeData : action.TreeData
      });
      break;
    case 'PLATFORM_UI_TREE_NODE_LOAD' :
      //console.log('action.TreeNode');
      //console.log(action.TreeNode);
      return $$state.merge({
        TreeNode : action.TreeNode
      });
      break;

    default :
      return $$state;
  }
}

export function treeload(){
  /*return function(dispatch){
    /!*let proxy = cb.rest.DynamicProxy.create({ getTree: { url: 'menu/getMenuTree.do', method: 'POST' } });
    proxy.getTree(function (err, rs) {
      if (err) {
        alert("后台获取元数据服务出错");
        console.log(err);
        return;
      }
      dispatch({
        type : 'TREE_LOAD',
        TreeData : rs
      });
    });*!/

  }*/
  //console.log('treeload')
  return function(dispatch) {
    //let proxy = cb.rest.DynamicProxy.create({ getTree: { url: 'menu/getMetaByMenu.do', method: 'POST' } });
    let options = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    };

    fetch('/getMenuTree', options)//env.HTTP_USER_FETCH_TREE
      .then(function (response) {
        //console.log(response);
        if (response.status >= 400) {
          throw new Error("Bad response from server")
        }
        return response.json()
      })
      .then(function (json) {
        //console.log(json);
        dispatch({
          type: 'PLATFORM_UI_TREE_LOAD',
          TreeData: json.data
        });
      });
  }
}

export function TreeNodeLoad(value,CallBack){
  let options = {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      menu_code : value
    })
  }
  console.log('PLATFORM_UI_TREE_NODE_LOAD')
  console.log('/meta/bill/'+ value)
  return function(dispatch){
    fetch('/meta.do/bill/'+ value)
      .then(function (response) {
        //console.log(response);
        if (response.status >= 400) {
          throw new Error("Bad response from server")
        }
        return response.json()
      })
      .then(function (json) {
        //console.log('TREE_NODE_LOAD');
        //console.log(json);
        dispatch({
          type : 'PLATFORM_UI_TREE_NODE_LOAD',
          //TreeNode : json
        })
        CallBack();
      });
  };


    /*Voucher.getMetaByMenu(value,function (err, rs) {
      if (err) {
        alert("后台获取元数据服务出错");
        console.log(err);
        return;
      }
      dispatch({
        type : 'TREE_NODE_LOAD',
        TreeNode : rs
      });
      CallBack();
    });*/
    /*proxy.getTree({menu_code:value},function (err, rs) {
     if (err) {
     alert("后台获取元数据服务出错");
     console.log(err);
     return;
     }
     dispatch({
     type : 'TREE_NODE_LOAD',
     TreeNode : rs
     });
     CallBack();
     });*/
}
