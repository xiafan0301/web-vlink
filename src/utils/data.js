const dataList = {
  imgId: 1, // 图片id
  videoId: 2, // 视频id
  eventLevel: 2, // 事件等级
  fileId: 3, // 文件id
  handleUnit: 3, // 处理单位
  identity: 4, // 上报者身份
  eventSource: 5, // 事件来源  中心端--1 app端--2
  sourceType: 5, //资源来源
  participateType: 6, // 参与类型
  eventStatus: 7, // 事件状态
  auditStatus: 8, // 审核状态
  autoCheck: 10, // 自动审核政务人员
  alarmLevel: 11, //告警级别
  planType: 12, // 预案类型
  rejectReason: 13, // 驳回原因
  vehicleColor: 17, // 车身颜色
  eventType: 20, // 事件类型
  distanceId: 23, // 推送距离
  taskStatus: 24, // 任务状态,
  taskType: 25, // 任务类型
  ctcStatus: 26, // 调度事件状态
  licensePlateColor: 30, //车牌颜色
  vehicleType: 31, // 车辆类型
  numberType: 32, // 号牌种类
  intelCharac: 38, // 智能特性
  memberJob: 42, // 成员职位
  operateCompany: 43, // 运营公司
}
// 处理方式
const handeMethods = {
  control: 1, // 智能布控
  ctc: 2, // 调度指挥
  reportSuper: 3, // 向上级呈报
  sendOtherUint: 4 // 转到其他单位
}

// 操作类型
const operationType = {
  auditEvent: 1, // 事件审核
  changeEvent: 2, // 事件处理
  sendOtherUint: 3, // 转到其他单位
  endEvent: 4 // 结束事件
}
// 事件处理过程类型
const proccessEventType = {
  dispatchId: 1, // 派单
  directiveId: 2, // 上级指示
  reportSuperId: 3, // 下级呈报
  acceptId: 4, // 受理
  feedbackId: 5 // 反馈
}

export { dataList, handeMethods, operationType, proccessEventType };