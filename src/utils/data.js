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
  eventType: 20, // 事件类型
  distanceId: 23, // 推送距离
  taskStatus: 24, // 任务状态,
  taskType: 25, // 任务类型
  ctcStatus: 26, // 调度事件状态
  deviceStatus: 33, // 设备状态
  maxPixel: 34, // 最大像素
  cameraType: 35, // 摄像头类型
  manufacturer: 37, // 厂商
  intelCharac: 38, // 智能特性
  importantLevel: 40, // 重要级别
  memberJob: 42, // 成员职位
  operateCompany: 43, // 运营公司
  vehicleType: 44, // 车辆类型
  numberType: 45, // 号牌种类
  plateType: 45, // 号牌类型  
  vehicleColor: 47, // 车身颜色
  carColor: 47, // 车辆颜色
  ownership: 48, //号牌归属
  plateColor: 50,     //号牌颜色
  licensePlateColor: 50, //车牌颜色
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
const cityCode = [
  '京','津','沪','冀','晋','蒙','辽','吉','黑','苏','浙','皖','闽','赣','鲁','豫','鄂','湘','粤','桂','琼','川','贵','云','渝','藏','陕','甘','青','宁','新','港','澳','台'
]


export { dataList, handeMethods, operationType, proccessEventType,cityCode };