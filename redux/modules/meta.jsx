import Immutable from 'immutable'
import fetch from 'isomorphic-fetch'
import { isFunction, findIndex } from 'lodash'

import { toJSON, genAction, genFetchOptions } from '../../helpers/util'


export const PLATFORM_UI_TABS_ADDITEM = 'PLATFORM_UI_TABS_ADDITEM'
export const PLATFORM_UI_TABS_REMOVEITEM = 'PLATFORM_UI_TABS_REMOVEITEM'
export const PLATFORM_UI_TABS_CHANGEITEM = 'PLATFORM_UI_TABS_CHANGEITEM'

export const PLATFORM_DATA_METADATA_FETCH = 'PLATFORM_DATA_METADATA_FETCH'  // 获取元数据
export const PLATFORM_DATA_METADATA_FETCH_SUCCEED = 'PLATFORM_DATA_METADATA_FETCH_SUCCEED'
export const PLATFORM_DATA_METADATA_FETCH_FAILURE = 'PLATFORM_DATA_METADATA_FETCH_FAILURE'


let newMetaId = 0;

const $$initialState = Immutable.fromJS({
  tabs: {
    activeKey: 0,
    panes: [],
  },
  viewmeta: {},
  vm: {},
})

export default (state = $$initialState, action) => {
  switch (action.type) {
    case PLATFORM_DATA_METADATA_FETCH:
      return state

    case PLATFORM_DATA_METADATA_FETCH_SUCCEED:
      {
        return state.merge(action.payload)
      }
    case PLATFORM_UI_TABS_ADDITEM:
      {
        const newTabItem = action.payload
        return state
          .updateIn(['tabs', 'panes'], panes => {
            const _panes = Immutable.Iterable.prototype.isPrototypeOf(panes) ? panes.toJS() : panes
            if (findIndex(_panes, ['key', newTabItem.key]) === -1) {
              _panes.push(newTabItem)
            }
            return _panes
          })
          .updateIn(['tabs', 'activeKey'], activeKey => newTabItem.key)
      }
    case PLATFORM_UI_TABS_REMOVEITEM:
      {
        let targetKey = action.payload
        let tempPanes = []
        let targetIndex = 0

        return state
          .updateIn(['tabs', 'panes'], panes => {
            return tempPanes = panes.filter((pane, i) => {
              if (pane.key === targetKey) {
                targetIndex = i - 1
                return false
              }
              return true
            })
          })
          .updateIn(['tabs', 'activeKey'], activeKey => {
            if (targetIndex > 0 && activeKey === targetKey) {
              return tempPanes[targetIndex].key
            }
            return activeKey
          })
      }

    case PLATFORM_UI_TABS_CHANGEITEM:
      {
        return state.updateIn(['tabs', 'activeKey'], activeKey => action.payload)
      }
    case 'INIT':
      return state.update('newMetaId', newMetaId => { newMetaId++ })

    default:
      return state
  }
}

export const fetchMetaDataAction = (type, data) => {
  return {
    type,
    payload: data
  }
}

export const fetchMetaData = (metaType, key) => {
  return (dispatch, getState) => {
    // fetching
    //dispatch(fetchMetaDataAction(PLATFORM_DATA_METADATA_FETCH))

    // let options = {
    //   method: 'post',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     metaId,
    //   })
    // }
    let url = '/meta.do/' + metaType + '/' + key
    fetch(url).then(toJSON).then(function (json) {
      console.log(json)
      dispatch(fetchMetaDataAction(PLATFORM_DATA_METADATA_FETCH_SUCCEED, json))
    })
  }
}

export const addTabItemAction = (key) => {
  return {
    type: PLATFORM_UI_TABS_ADDITEM,
    payload: {
      key,
      title: '新建页签' + key
    }
  }
}

export const removeTabItemAction = (key) => {
  return {
    type: PLATFORM_UI_TABS_REMOVEITEM,
    payload: key
  }
}

export const changeTabItemAction = (key) => {
  return {
    type: PLATFORM_UI_TABS_CHANGEITEM,
    payload: key
  }
}

export const metaInit = (callback) => {
  callback(`meta${newMetaId++}`);
}
