import React, {PropTypes, Component} from 'react'
import { connect } from 'react-redux'
import { Tabs, Modal, Button, Table } from 'antd'

import QuerySchemeManager from '../../components/QuerySchemeManager'

class OrderList extends Component {
  handleQuerySchemeManagerClick() {
    const filterId = 1
    this.refs.querySchemeManager.mergedProps.fetchQuerySchemes(filterId)
  }

  handleTabsChange(key) {
    console.log(key)
  }

  render() {
    const TabPane = Tabs.TabPane

    const mock = require('../../../__mock__/table')
    const dataSource = mock.dataSource
    const columns = mock.columns

    return (
      <div>
        <Tabs defaultActiveKey="1" onChange={this.handleTabsChange}>
          <TabPane tab="全部订单" key="1">
            <div>
              <span>查询条件区域</span>
              <Button onClick={this.handleQuerySchemeManagerClick.bind(this) }>查询方案管理</Button>
            </div>
            <Table dataSource={dataSource} columns={columns} />
          </TabPane>
          <TabPane tab="待审批" key="2">选项卡二内容</TabPane>
        </Tabs>
        <QuerySchemeManager ref="querySchemeManager"/>
      </div>
    )
  }
}

export default connect()(OrderList)
