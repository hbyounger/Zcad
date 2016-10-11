import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { message, Tabs, Modal, Button, Icon, Input } from 'antd'
import { isBoolean, isString } from 'lodash'

import ActionStatus from '../../constants/ActionStatus'
import {
  PLATFORM_UI_QUERYSCHEME_SETVISIBLE,
  PLATFORM_UI_QUERYSCHEME_PROPERTYS_SETVISIBLE,
  PLATFORM_UI_QUERYSCHEME_SETNAME_EDITING,
  setVisibility,
  setSpecifics,
  createQueryScheme,
  deleteQueryScheme,
  updateQuerySchemeName,
  fetchQuerySchemes,
} from '../../redux/modules/queryScheme'
import { DragList, DragListItem } from '../common/DragList'
import SetFieldProperty from './SetFieldProperty'

class QuerySchemeManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      querySchemeName: null
    }
    this.handleOk = this.handleOk.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleQuerySchemeNameChange = this.handleQuerySchemeNameChange.bind(this)
    this.handleEditQuerySchemeNameSubmit = this.handleEditQuerySchemeNameSubmit.bind(this)
    this.handleCreateQuerySchemeSubmit = this.handleCreateQuerySchemeSubmit.bind(this)
    this.handleNewQuerySchemeNameChange = this.handleNewQuerySchemeNameChange.bind(this)
  }

  storeQuerySchemeName(id, name) {
    const key = `queryScheme_${id}`
    if (isString(name) && name.length > 0) {
      this.setState({
        [key]: name
      })
    } else {
      return this.state[key]
    }
  }

  handleOk() {
    this.props.setVisibility(PLATFORM_UI_QUERYSCHEME_SETVISIBLE, false)
  }

  handleCancel() {
    this.props.setVisibility(PLATFORM_UI_QUERYSCHEME_SETVISIBLE, false)
  }

  handleSetSpecifies(item) {
    return e => (this.props.setSpecifics({
      id: item.id,
      filtersId: item.filtersId,
      isDefault: item.isDefault,
      isPublic: Math.abs(item.isPublic - 1),
      userId: item.userId,
      solutionName: item.solutionName,
      orderId: item.orderId,
    }))
  }

  handleEditQuerySchemeName(queryScheme) {
    return e => {
      this.storeQuerySchemeName(queryScheme.id, queryScheme.solutionName)
      this.props.dispatch({
        type: PLATFORM_UI_QUERYSCHEME_SETNAME_EDITING,
        payload: queryScheme.id
      })
    }
  }

  handleEditQueryScheme(solutionId) {
    return e => (this.props.setVisibility(PLATFORM_UI_QUERYSCHEME_PROPERTYS_SETVISIBLE, {
      visiblePropertys: true,
      updateFields_Status: ActionStatus.READY,
      solutionId,
    })
    )
  }

  handleDelete(queryScheme) {
    return e => Modal.confirm({
      title: '您是否确认要删除这项内容',
      content: queryScheme.solutionName,
      onOk: () => this.props.deleteQueryScheme(queryScheme.id),
    })
  }

  handleQuerySchemeNameChange(queryScheme) {
    return e => this.storeQuerySchemeName(queryScheme.id, e.currentTarget.value)
  }

  handleEditQuerySchemeNameSubmit(queryScheme) {
    return e => {
      this.props.updateQuerySchemeName({
        id: queryScheme.id,
        filtersId: queryScheme.filtersId,
        isDefault: queryScheme.isDefault,
        isPublic: queryScheme.isPublic,
        userId: queryScheme.userId,
        solutionName: this.storeQuerySchemeName(queryScheme.id),
        orderId: queryScheme.orderId,
      })
    }
  }

  handleNewQuerySchemeNameChange(e) {
    this.setState({
      querySchemeName: e.currentTarget.value
    })
  }

  handleCreateQuerySchemeSubmit() {
    const filtersId = 1
    const isDefault = 0
    const isPublic = 1
    const solutionName = this.state.querySchemeName

    this.props.createQueryScheme({
      solutionVO: {
        filtersId,
        isDefault,
        isPublic,
        solutionName,
      }
    })
  }

  renderQuerySchemeList() {
    const {
      querySchemes,
      tempQuerySchemeId,
      editingQuerySchemeIDs,
      delete_Status,
      setSpecifics_Status,
      updateName_Status,
    } = this.props.querySchemeState

    return querySchemes.map(dataItem => {
      let actionsDOM = null

      if (dataItem.isPublic !== 10) {
        const imgIsCommon = dataItem.isPublic === 1 ? 'u1256.png' : 'u1264.png'

        actionsDOM = (
          <div key={`queryScheme-${dataItem.id}`}>
            {
              (tempQuerySchemeId === dataItem.id && setSpecifics_Status === ActionStatus.ING) ?
                <Icon type="loading" /> :
                <img onClick={this.handleSetSpecifies(dataItem) } src={`/styles/default/images/components/draglist/${imgIsCommon}`} alt="设置为公共方案"/>
            }
            <img onClick={this.handleEditQuerySchemeName(dataItem) } src="/styles/default/images/components/draglist/u1250.png" alt="修改方案名字"/>
            <img onClick={this.handleEditQueryScheme(dataItem.id) } src="/styles/default/images/components/draglist/u1252.png" alt="修改方案内容"/>
            <img onClick={this.handleDelete(dataItem) } src="/styles/default/images/components/draglist/u250.png" alt="新增方案"/>
          </div>
        )
      }

      return (
        <DragListItem key={dataItem.id} text={dataItem.solutionName}>
          <img src="/styles/default/images/components/draglist/u1224.png" alt="拖拽排序" className="draglist-item-icon"/>
          <span className="draglist-item-title">
            {
              editingQuerySchemeIDs.indexOf(dataItem.id) !== -1 ?
                <span>
                  <Input
                    value={this.state[`queryScheme_${dataItem.id}`]}
                    onChange={this.handleQuerySchemeNameChange(dataItem) }
                    placeholder="请填写"
                    style={{ width: 180 }}/>&nbsp; &nbsp;
                  <Button onClick={this.handleEditQuerySchemeNameSubmit(dataItem) }>确定</Button>
                </span> :
                dataItem.solutionName
            }
          </span>
          <div className="draglist-actions">
            {actionsDOM}
          </div>
        </DragListItem>
      )
    })
  }

  renderCreateQuerySchemeForm() {
    const { querySchemeName } = this.state
    const styleObj = {
      width: 180,
      'margin-right': '10px',
    }
    return (
      <DragListItem>
        <Icon type="plus-circle" className="draglist-item-icon" />
        <span className="draglist-item-title">
          <Input
            value={querySchemeName}
            onChange={this.handleNewQuerySchemeNameChange }
            placeholder="查询方案名称"
            style={styleObj}/>
          <Button onClick={this.handleCreateQuerySchemeSubmit }>确定</Button>
        </span>
      </DragListItem>
    )
  }

  render() {
    const {
      solutionId,
      visible,
      visiblePropertys,
      querySchemes,
      fetch_Status,
      fields,
      updateFields_Status, } = this.props.querySchemeState

    return (
      <Modal
        title="管理方案"
        maskClosable={false}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}>
        <DragList>
          {
            fetch_Status === ActionStatus.ING ?
              <div className="draglist-info">正在加载..</div> :
              fetch_Status === ActionStatus.FAILURE ?
                <div className="draglist-error">获取管理方案失败</div> :
                this.renderQuerySchemeList(querySchemes)
          }
          { this.renderCreateQuerySchemeForm() }
        </DragList>
        <SetFieldProperty solutionId={solutionId} />
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    querySchemeState: state.queryScheme.toJS()
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatch,
  ...bindActionCreators({
    setVisibility,
    setSpecifics,
    createQueryScheme,
    deleteQueryScheme,
    updateQuerySchemeName,
    fetchQuerySchemes,
  }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(QuerySchemeManager)
