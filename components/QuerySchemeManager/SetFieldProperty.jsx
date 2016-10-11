import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { message, Col, Tabs, Modal, Button, Form, Input, Checkbox, Switch, Select } from 'antd'
import { isBoolean } from 'lodash'

if (process.env.__CLIENT__ === true) {
  require('./SetFieldProperty.less')
}
import ActionStatus from '../../constants/ActionStatus'
import {
  PLATFORM_UI_QUERYSCHEME_PROPERTYS_SETVISIBLE,
  setVisibility,
  fetchQuerySchemesFields,
  setQuerySchemeFieldEditing,
  setQuerySchemeFieldAltered,
  updateQuerySchemeFields,
} from '../../redux/modules/queryScheme'
import ConditionOperator from '../../constants/ConditionOperator'
import FilterItemType from '../../constants/FilterItemType'

class QuerySchemeManager extends Component {
  static propTypes = {
    solutionId: PropTypes.number.isRequired,
  }

  handleOk() {
    this.props.updateQuerySchemeFields()
  }

  handleCancel() {
    this.props.setVisibility(PLATFORM_UI_QUERYSCHEME_PROPERTYS_SETVISIBLE, {
      visiblePropertys: false
    })
  }

  handleChangeIsCommon(col) {
    return e => {
      col.isCommon = e.target.checked ? 1 : 0
      this.props.setQuerySchemeFieldAltered(col)
    }
  }

  handleChangeSelectedField(col) {
    return e => this.props.setQuerySchemeFieldEditing(col)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.solutionId !== this.props.solutionId) {
      this.props.fetchQuerySchemesFields(nextProps.solutionId)
    }
  }

  render() {
    const FormItem = Form.Item
    const InputGroup = Input.Group
    const Option = Select.Option
    const {
      visiblePropertys,
      updateFields_Status,
      fields,
      editingField,
    } = this.props.querySchemeState
    const { getFieldProps } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 12
      },
    }

    const querySchemeFileds = fields.map((col, index) => {
      return (
        <li
          key={`querySchemeField-${col.id}`}
          onClick={this.handleChangeSelectedField(col) }
          className={editingField === col ? 'active' : ''}
          >
          <Checkbox checked={col.isCommon === 1} onChange={this.handleChangeIsCommon(col) } />
          <span>{col.itemName}</span>
        </li>
      )
    })

    return (
      <Modal
        title="方案属性设置"
        style={{ top: 20 }}
        width={760}
        visible={visiblePropertys}
        confirmLoading={updateFields_Status === ActionStatus.ING}
        maskClosable={false}
        onOk={this.handleOk.bind(this) }
        onCancel={this.handleCancel.bind(this) }>
        <div className="field-list">
          <ul>{querySchemeFileds}</ul>
        </div>
        <div className="field-form">
          <Form horizontal={true}>
            <FormItem label="名称" key="fi-itemTitle" {...formItemLayout}>
              <Input
                placeholder="请输入名称"
                {...getFieldProps('itemTitle', {
                  initialValue: editingField.itemTitle
                }) }
                />
            </FormItem>
            <FormItem label="参照样式" key="fi-refType" {...formItemLayout}>
              <Select
                placeholder="请选择参照样式"
                style={{ width: 200 }}
                {...getFieldProps('refType', {
                  initialValue: editingField.refType
                }) }
                >
                <Option value={1}>弹出式</Option>
              </Select>
            </FormItem>
            <FormItem label="多选" key="fi-multSelect" {...formItemLayout}>
              <Switch
                {...getFieldProps('multSelect', {
                  valuePropName: 'checked',
                  initialValue: editingField.multSelect === 1
                }) }
                />
            </FormItem>
            <FormItem label="区间条件" key="fi-rangeInput" {...formItemLayout}>
              <Switch
                {...getFieldProps('rangeInput', {
                  valuePropName: 'checked',
                  initialValue: editingField.rangeInput === 1
                }) }
                />
            </FormItem>
            <FormItem label="比较符" key="fi-compareLogic" {...formItemLayout}>
              <Select
                style={{ width: 200 }}
                placeholder="请选择比较符"
                {...getFieldProps('compareLogic', {
                  initialValue: editingField.compareLogic
                }) }
                >
                {
                  ConditionOperator.map(item => <Option key={`co-${item}`} value={item}>{item}</Option>)
                }
              </Select>
            </FormItem>
            <FormItem label="默认值" key="fi-defaultVal" {...formItemLayout}>
              <InputGroup size="large">
                <Col span="2">从</Col>
                <Col span="10">
                  <Input
                    placeholder="请填写默认值"
                    {...getFieldProps('defaultVal1', {
                      initialValue: editingField.defaultVal1
                    }) }
                    />
                </Col>
                <Col span="2">到</Col>
                <Col span="10">
                  <Input
                    placeholder="请填写默认值"
                    {...getFieldProps('defaultVal2', {
                      initialValue: editingField.defaultVal2
                    }) }
                    />
                </Col>
              </InputGroup>
            </FormItem>
            <FormItem label="校验参照录入值" key="fi-checkRefer" {...formItemLayout}>
              <Switch
                {...getFieldProps('checkRefer', {
                  valuePropName: 'checked',
                  initialValue: editingField.checkRefer === 1
                }) }
                />
            </FormItem>
            <FormItem label="记忆上次录入值" key="fi-saveHistory" {...formItemLayout}>
              <Switch
                {...getFieldProps('saveHistory', {
                  valuePropName: 'checked',
                  initialValue: editingField.saveHistory === 1
                }) }
                />
            </FormItem>
          </Form>
        </div>
      </Modal>
    )
  }
}

const options = {
  mapPropsToFields(props) {
    const { editingField } = props.querySchemeState
    return {
      solutionId: { value: editingField['solutionId'] },
      saveHistory: { value: editingField['saveHistory'] },
      refType: { value: editingField['refType'] },
      rangeInput: { value: editingField['rangeInput'] },
      orderId: { value: editingField['orderId'] },
      multSelect: { value: editingField['multSelect'] },
      itemTitle: { value: editingField['itemTitle'] },
      itemName: { value: editingField['itemName'] },
      itemId: { value: editingField['itemId'] },
      isCommon: { value: editingField['isCommon'] },
      id: { value: editingField['id'] },
      defaultVal2: { value: editingField['defaultVal2'] },
      defaultVal1: { value: editingField['defaultVal1'] },
      compareLogic: { value: editingField['compareLogic'] },
      checkRefer: { value: editingField['checkRefer'] },
    }
  },
  onFieldsChange: (props, fields) => {
    for (let p in fields) {
      if (!fields.hasOwnProperty(p))
        continue

      const field = fields[p]
      if (isBoolean(field.value)) {
        field.value = field.value ? 1 : 0
      }
      props.setQuerySchemeFieldAltered({
        [field.name]: field.value
      })
    }
  },
}

const mapStateToProps = (state, ownProps) => {
  return {
    querySchemeState: state.queryScheme.toJS()
  }
}

const mapDispatchToProps = {
  setVisibility,
  fetchQuerySchemesFields,
  setQuerySchemeFieldEditing,
  setQuerySchemeFieldAltered,
  updateQuerySchemeFields,
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create(options)(QuerySchemeManager))
