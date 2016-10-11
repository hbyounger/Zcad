import Immutable from 'immutable'
import warning from 'warning'
import fetch from 'isomorphic-fetch'
import { isFunction, findIndex } from 'lodash'
import { message } from 'antd'

import ActionStatus from '../../constants/ActionStatus'
import env from '../../helpers/env'
import { toJSON, genAction, genFetchOptions } from '../../helpers/util'


// 界面 - 设置查询方案字段在编辑状态
export const PLATFORM_UI_QUERYSCHEME_SETFIELDEDITING = 'PLATFORM_UI_QUERYSCHEME_SETFIELDEDITING'

// 界面 - 设置查询方案字段被修改过
export const PLATFORM_UI_QUERYSCHEME_SETFILEDALTERED = 'PLATFORM_UI_QUERYSCHEME_SETFILEDALTERED'

// 界面 - 设置查询方案列表的visible
export const PLATFORM_UI_QUERYSCHEME_SETVISIBLE = 'PLATFORM_UI_QUERYSCHEME_SETVISIBLE'

// 界面 - 设置查询方案的字段列表的visible
export const PLATFORM_UI_QUERYSCHEME_PROPERTYS_SETVISIBLE = 'PLATFORM_UI_QUERYSCHEME_PROPERTYS_SETVISIBLE'

// 界面 - 修改查询方案
export const PLATFORM_UI_QUERYSCHEME_SETNAME_EDITING = 'PLATFORM_UI_QUERYSCHEME_SETNAME_EDITING'

// 获取查询方案列表
export const PLATFORM_DATA_QUERYSCHEME_FETCH = 'PLATFORM_DATA_QUERYSCHEME_FETCH'
export const PLATFORM_DATA_QUERYSCHEME_FETCH_SUCCEED = 'PLATFORM_DATA_QUERYSCHEME_FETCH_SUCCEED'
export const PLATFORM_DATA_QUERYSCHEME_FETCH_FAILURE = 'PLATFORM_DATA_QUERYSCHEME_FETCH_FAILURE'

// 获取查询方案的内容字段列表
export const PLATFORM_DATA_QUERYSCHEME_FETCHFIELDS = 'PLATFORM_DATA_QUERYSCHEME_FETCHFIELDS'
export const PLATFORM_DATA_QUERYSCHEME_FETCHFIELDS_SUCCEED = 'PLATFORM_DATA_QUERYSCHEME_FETCHFIELDS_SUCCEED'
export const PLATFORM_DATA_QUERYSCHEME_FETCHFIELDS_FAILURE = 'PLATFORM_DATA_QUERYSCHEME_FETCHFIELDS_FAILURE'

// 修改查询方案的名字
export const PLATFORM_DATA_QUERYSCHEME_SETNAME = 'PLATFORM_DATA_QUERYSCHEME_SETNAME'
export const PLATFORM_DATA_QUERYSCHEME_SETNAME_SUCCEED = 'PLATFORM_DATA_QUERYSCHEME_SETNAME_SUCCEED'
export const PLATFORM_DATA_QUERYSCHEME_SETNAME_FAILURE = 'PLATFORM_DATA_QUERYSCHEME_SETNAME_FAILURE'

// 修改查询方案的字段属性
export const PLATFORM_DATA_QUERYSCHEME_UPDATE = 'PLATFORM_DATA_QUERYSCHEME_UPDATE'
export const PLATFORM_DATA_QUERYSCHEME_UPDATE_SUCCEED = 'PLATFORM_DATA_QUERYSCHEME_UPDATE_SUCCEED'
export const PLATFORM_DATA_QUERYSCHEME_UPDATE_FAILURE = 'PLATFORM_DATA_QUERYSCHEME_UPDATE_FAILURE'

// 设置查询方案的特性：isPublic、isDefault
export const PLATFORM_DATA_QUERYSCHEME_SETSPECIFIC = 'PLATFORM_DATA_QUERYSCHEME_SETSPECIFIC'
export const PLATFORM_DATA_QUERYSCHEME_SETSPECIFIC_SUCCEED = 'PLATFORM_DATA_QUERYSCHEME_SETSPECIFIC_SUCCEED'
export const PLATFORM_DATA_QUERYSCHEME_SETSPECIFIC_FAILURE = 'PLATFORM_DATA_QUERYSCHEME_SETSPECIFIC_FAILURE'

// 删除查询方案
export const PLATFORM_DATA_QUERYSCHEME_DELETE = 'PLATFORM_DATA_QUERYSCHEME_DELETE'
export const PLATFORM_DATA_QUERYSCHEME_DELETE_SUCCEED = 'PLATFORM_DATA_QUERYSCHEME_DELETE_SUCCEED'
export const PLATFORM_DATA_QUERYSCHEME_DELETE_FAILURE = 'PLATFORM_DATA_QUERYSCHEME_DELETE_FAILURE'

// 创建查询方案
export const PLATFORM_DATA_QUERYSCHEME_CREATE = 'PLATFORM_DATA_QUERYSCHEME_CREATE'
export const PLATFORM_DATA_QUERYSCHEME_CREATE_SUCCEED = 'PLATFORM_DATA_QUERYSCHEME_CREATE_SUCCEED'
export const PLATFORM_DATA_QUERYSCHEME_CREATE_FAILURE = 'PLATFORM_DATA_QUERYSCHEME_CREATE_FAILURE'


const $$initialState = Immutable.fromJS({
  filterId: 0,
  solutionId: 0,

  // 窗口是否隐藏
  visible: false,
  visiblePropertys: false,

  // 查询方案列表
  querySchemes: [],
  fetch_Status: ActionStatus.READY,

  // 查询方案内容字段列表
  fields: [],
  fetchFields_Status: ActionStatus.READY,

  // 本次修改的查询方案内容字段列表
  editingField: {},
  alteredFields: [],
  updateFields_Status: ActionStatus.READY,

  // 设置为公开时的Action状态
  tempQuerySchemeId: 0,
  setSpecifics_Status: ActionStatus.READY,

  // 记录编辑状态的solutionID
  editingQuerySchemeIDs: [],
  updateName_Status: ActionStatus.READY,

  // 删除查询方案状态
  delete_Status: ActionStatus.READY,

  // 新增查询方案状态
  create_Status: ActionStatus.READY,
})

export default (state = $$initialState, action) => {
  switch (action.type) {
    case PLATFORM_UI_QUERYSCHEME_SETVISIBLE:
      return state.set('visible', action.payload)

    case PLATFORM_UI_QUERYSCHEME_PROPERTYS_SETVISIBLE:
      return state.merge(action.payload)

    case PLATFORM_UI_QUERYSCHEME_SETFIELDEDITING:
      return state.set('editingField', action.payload)

    case PLATFORM_UI_QUERYSCHEME_SETFILEDALTERED:
      return state.update('alteredFields', fields => {
        let field = action.payload
        let index = -1
        if ((index = findIndex(fields, field)) === -1) {
          fields.push(field)
        } else {
          fields[index] = field
        }
        return fields
      })

    case PLATFORM_UI_QUERYSCHEME_SETNAME_EDITING:
      const key = 'editingQuerySchemeIDs'
      const index = state.get(key).indexOf(action.payload)

      return state.update(key, arr => (
        index === -1 ?
          arr.push(action.payload) :
          arr.remove(index))
      )


    case PLATFORM_DATA_QUERYSCHEME_FETCH:
      return state
        .set('fetch_Status', ActionStatus.ING)
        .set('visible', true)

    case PLATFORM_DATA_QUERYSCHEME_FETCH_SUCCEED:
      return state
        .set('fetch_Status', ActionStatus.SUCCEED)
        .set('querySchemes', action.payload)

    case PLATFORM_DATA_QUERYSCHEME_FETCH_FAILURE:
      return state.set('fetch_Status', ActionStatus.FAILURE)


    case PLATFORM_DATA_QUERYSCHEME_FETCHFIELDS:
      return state.set('fetchFields_Status', ActionStatus.ING)

    case PLATFORM_DATA_QUERYSCHEME_FETCHFIELDS_SUCCEED:
      return state
        .set('fetchFields_Status', ActionStatus.SUCCEED)
        .set('fields', action.payload)
        .set('editingField', action.payload[0] || {})
        .set('alteredFields', [])

    case PLATFORM_DATA_QUERYSCHEME_FETCHFIELDS_FAILURE:
      return state.set('fetchFields_Status', ActionStatus.FAILURE)


    case PLATFORM_DATA_QUERYSCHEME_UPDATE:
      return state.set('updateFields_Status', ActionStatus.ING)

    case PLATFORM_DATA_QUERYSCHEME_UPDATE_SUCCEED:
      return state
        .set('updateFields_Status', ActionStatus.SUCCEED)
        .set('visiblePropertys', false)

    case PLATFORM_DATA_QUERYSCHEME_UPDATE_FAILURE:
      return state.set('updateFields_Status', ActionStatus.FAILURE)


    case PLATFORM_DATA_QUERYSCHEME_SETSPECIFIC:
      return state
        .set('setSpecifics_Status', ActionStatus.ING)
        .set('tempQuerySchemeId', action.payload)

    case PLATFORM_DATA_QUERYSCHEME_SETSPECIFIC_SUCCEED:
      return state
        .set('setSpecifics_Status', ActionStatus.SUCCEED)
        .update('querySchemes', querySchemes => {
          return querySchemes.map(item => item.id === action.payload.id ? action.payload : item)
        })

    case PLATFORM_DATA_QUERYSCHEME_SETSPECIFIC_FAILURE:
      return state.set('setSpecifics_Status', ActionStatus.FAILURE)


    case PLATFORM_DATA_QUERYSCHEME_SETNAME:
      return state.set('updateName_Status', ActionStatus.ING)

    case PLATFORM_DATA_QUERYSCHEME_SETNAME_SUCCEED:
      return state
        .set('updateName_Status', ActionStatus.SUCCEED)
        .update('editingQuerySchemeIDs', arr => {
          const index = arr.indexOf(action.payload.id)
          return index === -1 ? arr : arr.splice(index, 1)
        })
        .update('querySchemes', querySchemes => {
          return querySchemes.map(item => item.id === action.payload.id ? action.payload : item)
        })

    case PLATFORM_DATA_QUERYSCHEME_SETNAME_FAILURE:
      return state.set('updateName_Status', ActionStatus.FAILURE)


    case PLATFORM_DATA_QUERYSCHEME_DELETE:
      return state
        .set('delete_Status', ActionStatus.ING)
        .set('tempQuerySchemeId', action.payload)

    case PLATFORM_DATA_QUERYSCHEME_DELETE_SUCCEED:
      return state
        .set('delete_Status', ActionStatus.SUCCEED)
        .update('querySchemes', querySchemes => {
          return querySchemes.filter(x => x.id !== action.payload)
        })

    case PLATFORM_DATA_QUERYSCHEME_DELETE_FAILURE:
      return state.set('delete_Status', ActionStatus.FAILURE)


    case PLATFORM_DATA_QUERYSCHEME_CREATE:
      return state.set('create_Status', ActionStatus.ING)

    case PLATFORM_DATA_QUERYSCHEME_CREATE_SUCCEED:
      return state
        .set('create_Status', ActionStatus.SUCCEED)
        .update('querySchemes', querySchemes => {
          return (querySchemes.push(action.payload), querySchemes)
        })

    case PLATFORM_DATA_QUERYSCHEME_CREATE_FAILURE:
      return state.set('create_Status', ActionStatus.FAILURE)

    default:
      return state
  }
}


export const setVisibility = (type, visible) => {
  return (dispatch, getState) => dispatch(genAction(type, visible))
}

// 获取查询方案列表
export const fetchQuerySchemes = (filterId) => {
  return (dispatch, getState) => {
    dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_FETCH))

    const options = genFetchOptions('post', {
      filterId
    })

    const u = new URLSearchParams()
    u.append('terminaltype', 'PC')
    u.append('token', getState().user.get('token'))

    fetch(env.HTTP_FETCH_QUERYSCHEMES + u, options).then(toJSON).then(function (json) {
      if (json.code === 200) {
        dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_FETCH_SUCCEED, json.data))
      } else {
        dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_FETCH_FAILURE))
        message.error(json.message, 2)
      }
    })
  }
}

// 获取某个查询方案的内容字段列表
export const fetchQuerySchemesFields = (solutionId) => {
  return (dispatch, getState) => {
    const options = genFetchOptions('post', {
      solutionId
    })

    const u = new URLSearchParams()
    u.append('terminaltype', 'PC')
    u.append('token', getState().user.get('token'))

    fetch(env.HTTP_FETCH_QUERYSCHEMES_COMMON + u, options).then(toJSON).then(function (json) {
      if (json.code === 200) {
        dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_FETCHFIELDS_SUCCEED, json.data))
      } else {
        dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_FETCHFIELDS_FAILURE))
        message.error(json.message, 2)
      }
    })
  }
}

// 更新某个查询方案的内容字段列表
export const updateQuerySchemeFields = () => {
  return (dispatch, getState) => {
    const alteredFileds = getState().queryScheme.get('alteredFields')
    if (alteredFileds.length === 0) {
      return dispatch(genAction(PLATFORM_UI_QUERYSCHEME_PROPERTYS_SETVISIBLE, {
        visiblePropertys: false
      }))
    }

    dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_UPDATE))

    const options = genFetchOptions('post', alteredFileds)
    const u = new URLSearchParams()
    u.append('terminaltype', 'PC')
    u.append('token', getState().user.get('token'))

    fetch(env.HTTP_UPDATE_QUERYSCHEME_COMMON + u, options).then(toJSON).then(function (json) {
      if (json.code === 200) {
        dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_UPDATE_SUCCEED, json.data))
      } else {
        dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_UPDATE_FAILURE))
        message.error(json.message, 2)
      }
    })
  }
}

export const setQuerySchemeFieldEditing = (col) => {
  return (dispatch, getState) => dispatch(genAction(PLATFORM_UI_QUERYSCHEME_SETFIELDEDITING, col))
}

export const setQuerySchemeFieldAltered = (obj) => {
  return (dispatch, getState) => {
    const field = getState().queryScheme.get('editingField')
    Object.assign(field, obj)
    dispatch(genAction(PLATFORM_UI_QUERYSCHEME_SETFILEDALTERED, field))
  }
}

export const setSpecifics = (solutionObj) => {
  return (dispatch, getState) => {
    dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_SETSPECIFIC, solutionObj.id))

    const options = genFetchOptions('post', solutionObj)
    const u = new URLSearchParams()
    u.append('terminaltype', 'PC')
    u.append('token', getState().user.get('token'))

    fetch(env.HTTP_UPDATE_QUERYSCHEME + u, options).then(toJSON).then(function (json) {
      if (json.code === 200) {
        dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_SETSPECIFIC_SUCCEED, solutionObj))
      } else {
        dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_SETSPECIFIC_FAILURE))
        message.error(json.message, 2)
      }
    })
  }
}

export const updateQuerySchemeName = (solutionObj) => {
  return (dispatch, getState) => {
    dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_SETNAME, solutionObj.id))

    const options = genFetchOptions('post', solutionObj)
    const u = new URLSearchParams()
    u.append('terminaltype', 'PC')
    u.append('token', getState().user.get('token'))

    fetch(env.HTTP_UPDATE_QUERYSCHEME + u, options).then(toJSON).then(function (json) {
      if (json.code === 200) {
        dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_SETNAME_SUCCEED, solutionObj))
      } else {
        dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_SETNAME_FAILURE))
        message.error(json.message, 2)
      }
    })
  }
}

export const deleteQueryScheme = (solutionId) => {
  return (dispatch, getState) => {
    dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_DELETE, solutionId))

    const options = genFetchOptions('post', { solutionId })
    const u = new URLSearchParams()
    u.append('terminaltype', 'PC')
    u.append('token', getState().user.get('token'))

    fetch(env.HTTP_DELETE_QUERYSCHEME + u, options).then(toJSON).then(function (json) {
      if (json.code === 200) {
        dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_DELETE_SUCCEED, solutionId))
      } else {
        dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_DELETE_FAILURE))
        message.error(json.message, 3)
      }
    })
  }
}

export const createQueryScheme = (solutionObj) => {
  return (dispatch, getState) => {
    dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_CREATE))

    const options = genFetchOptions('post', solutionObj)
    const u = new URLSearchParams()
    u.append('terminaltype', 'PC')
    u.append('token', getState().user.get('token'))

    fetch(env.HTTP_CREATE_QUERYSCHEME + u, options).then(toJSON).then(function (json) {
      if (json.code === 200) {
        dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_CREATE_SUCCEED, json.data))
      } else {
        dispatch(genAction(PLATFORM_DATA_QUERYSCHEME_CREATE_FAILURE))
        message.error(json.message, 3)
      }
    })
  }
}
