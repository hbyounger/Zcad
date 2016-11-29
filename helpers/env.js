const env = {
  HTTP_CONTENT_TYPE: {
    JSON: 'application/json',
    PDF: 'application/pdf',
    XLS: 'application/vnd.ms-excel',
  },

  // 静态文件根路径
  HTTP_SCRIPT_BASEURL: 'http://www.zcadsoft.com/',

  // 关于用户的ajax接口//ZJWeb/
  HTTP_USER_LOGIN: combine('http://www.zcadsoft.com/','ajaxService/admin.ashx'),//www.zcadsoft.com


  // 查询方案
  HTTP_FETCH_QUERYSCHEMES: gen('/filterDesign/getSolutionList.do?terminaltype=PC&token={0}'),
  HTTP_FETCH_QUERYSCHEMES_COMMON: gen('/filterDesign/getSolutionCommonList.do?terminaltype=PC&token={0}'),
  HTTP_UPDATE_QUERYSCHEME: gen('/filterDesign/updateSolution.do?terminaltype=PC&token={0}'),
  HTTP_UPDATE_QUERYSCHEME_COMMON: gen('/filterDesign/updateSolutionCommon.do?terminaltype=PC&token={0}'),
  HTTP_DELETE_QUERYSCHEME: gen('/filterDesign/delSolution.do?terminaltype=PC&token={0}'),
  HTTP_CREATE_QUERYSCHEME: gen('/filterDesign/addSolution.do?terminaltype=PC&token={0}'),

  // 预警
  HTTP_FETCH_TASKORIGINS: gen('/task/getTaskTree.do?terminaltype=PC&token={0}'),
  HTTP_FETCH_TASKCONFIG_BYKEY: gen('/task/getTaskConfigByKey.do?terminaltype=PC&token={0}'),
  HTTP_FETCH_TASK_BYKEY: gen('/task/getNewTaskConfig.do?terminaltype=PC&token={0}'),
  HTTP_FETCH_TASKCONFIG_BYNAME: gen('/task/getTaskConfigByName.do?terminaltype=PC&token={0}'),
  HTTP_INSERT_TASKCONFIG: gen('/task/insertTaskConfig.do?terminaltype=PC&token={0}'),
  HTTP_UPDATE_TASKCONFIG: gen('/task/updateTaskConfig.do?terminaltype=PC&token={0}'),
  HTTP_UPDATE_EXECTASK: gen('/task/execTask.do?terminaltype=PC&token={0}'),
  HTTP_DELETE_TASKCONFIG: gen('/task/deleteTaskConfig.do?terminaltype=PC&token={0}'),

  HTTP_DOWNLOAD_BILL: '/files/bill/print/printBill.do?token={0}',
  HTTP_DOWNLOAD_BILLLIST: '/files/bill/print/printBillList.do?token={0}',

  //消息中心
  HTTP_FETCH_MESSAGECENTER_SOURCELIST: gen('/msg/messagesource/query.do?terminaltype=PC&token={0}'),
  HTTP_FETCH_MESSAGECENTER_MESSAGElIST: gen('/msg/message/query.do?terminaltype=PC&token={0}'),
  HTTP_FETCH_MESSAGECENTER_SOURCESUMMARY: gen('/msg/message/summery.do?terminaltype=PC&token={0}'),
  HTTP_UPDATE_MESSAGECENTER_UNREADMESSAGE: gen('/msg/message/read.do?terminaltype=PC&token={0}'),
  HTTP_DEL_MESSAGECENTER_MESSAGE: gen('/msg/message/delete.do?terminaltype=PC&token={0}'),
  HTTP_FETCH_MESSAGECENTER_MESSAGETYPELIST: gen('/msg/messagetype/query.do?terminaltype=PC&token={0}')
}

if (process.env.NODE_ENV === 'production') {
  Object.assign(env, {
    HTTP_SCRIPT_BASEURL: '',
  })
}

export default env

export function combine(baseurl, pathname) {
  const separator = (/\/$/.test(baseurl) === false && /^\//.test(pathname) === false) ? '/' : ''
  return Array.prototype.slice.call(arguments, 0).join(separator)
}

function gen(url) {
  return combine('/api-unsure', url)
}
