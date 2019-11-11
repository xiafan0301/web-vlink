const dataList = {
  imgId: 1, // 图片id
  videoId: 1023, // 视频id
  eventLevel: 1023, // 事件等级
  fileId: 1035, // 文件id
  handleUnit: 1035, // 处理单位
  identity: 1031, // 上报者身份
  eventSource: 1025, // 事件来源  中心端--1 app端--2
  sourceType: 1025, //资源来源
  participateType: 1026, // 参与类型
  eventStatus: 1024, // 事件状态
  auditStatus: 1030, // 审核状态
  autoCheck: 10, // 自动审核政务人员
  alarmLevel: 1057, //告警级别
  planType: 12, // 预案类型
  rejectReason: 1032, // 驳回原因
  eventType: 1022, // 事件类型
  distanceId: 1055, // 推送距离
  taskStatus: 1035, // 任务状态,
  taskType: 1036, // 任务类型
  ctcStatus: 1027, // 调度事件状态
  deviceStatus: 1041, // 设备状态
  maxPixel: 1040, // 最大像素
  cameraType: 1043, // 摄像头类型
  manufacturer: 1038, // 厂商
  intelCharac: 1039, // 智能特性
  importantLevel: 1042, // 重要级别
  memberJob: 1058, // 成员职位
  operateCompany: 1051, // 运营公司
  vehicleType: 1011, // 车辆类型
  numberType: 1009, // 号牌种类
  plateType: 1009, // 号牌类型
  vehicleColor: 1047, // 车身颜色
  carColor: 1050, // 车辆颜色
  ownership: 1052, //号牌归属
  plateColor: 1046,     //号牌颜色
  licensePlateColor: 1046, //车牌颜色
  vehicleBrand: 1010, //车辆品牌
  idType: 1060, // 证件类型
  bayonetUse: 1061, // 卡口用途
  isEnterPoint: 1062, // 出入场类型
  sexType: 1018, // 性别类型
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