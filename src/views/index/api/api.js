import request from '@/config/axios';
/**
 * 获取视频点播接口
 */
export function getTestLive() {
  return request({
    url: '/live',
    mode: 'live',
    method: 'get'
  });
}

/**
 * 字典接口
 * @param {*} data
 */
export const getDiciData = (uid) => {
  return request({
    url: 'dict-service/dict-list/?pid=' + uid,
    method: 'get'
  });
}

/* ================== 布控模块 =================== */
/* ========== 布控库 ========== */
/**
 * addPortrait 新建人像
 * @param {object} data
 */
export function addPortrait(data) {
  return request({
    url: '/portraits',
    method: 'post',
    data,
    mode: 'control'
  })
}
/**
 * delPortrait 删除人像
 * @param {object} data
 */
export function delPortrait(data) {
  return request({
    url: '/portraits',
    method: 'delete',
    data,
    mode: 'control'
  })
}
/**
 * getPortraitList 人像库列表分页查询接口
 * @param {object} params
 */
export function getPortraitList(params) {
  return request({
    url: '/portraits/page',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getPortraitById 通过标识获取人像包含组信息
 * @param {object} uid
 */
export function getPortraitById(uid) {
  return request({
    url: '/portraits/' + uid,
    method: 'get',
    mode: 'control'
  })
}
/**
 * putPortrait 修改人像
 * @param {object} data
 */
export function putPortrait(data) {
  return request({
    url: '/portraits',
    method: 'put',
    data,
    mode: 'control'
  })
}
/**
 * getPortraitByIdNo 通过证件号搜索人像（根据返回对象为空可判断证件号是否存在）
 * @param {object} params
 */
export function getPortraitByIdNo(params) {
  return request({
    url: '/portraits',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * copyPortrait 批量复制人像到别的分组
 * @param {object} data
 */
export function copyPortrait(data) {
  return request({
    url: '/portrait-groups/portraits',
    method: 'post',
    data,
    mode: 'control'
  })
}
/**
 * removePortrait 批量移出人像到别的分组
 * @param {object} data
 */
export function removePortrait(data) {
  return request({
    url: '/portrait-groups/portraits',
    method: 'delete',
    data,
    mode: 'control'
  })
}

/**
 * addVehicle 新建车像
 * @param {object} data
 */
export function addVehicle(data) {
  return request({
    url: '/vehicles',
    method: 'post',
    data,
    mode: 'control'
  })
}
/**
 * delVehicle 删除车像
 * @param {object} data
 */
export function delVehicle(data) {
  return request({
    url: '/vehicles',
    method: 'delete',
    data,
    mode: 'control'
  })
}
/**
 * getVehicleList 车像库列表分页查询接口
 * @param {object} params
 */
export function getVehicleList(params) {
  return request({
    url: '/vehicles/page',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getVehicleById 通过标识获取车辆包含组信息
 * @param {object} uid
 */
export function getVehicleById(uid) {
  return request({
    url: '/vehicles/' + uid,
    method: 'get',
    mode: 'control'
  })
}
/**
 * getVehicleByIdNo 通过车牌号搜索车辆
 * @param {object} params
 */
export function getVehicleByIdNo(params) {
  return request({
    url: '/vehicles',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * putVehicle 修改车像
 * @param {object} data
 */
export function putVehicle(data) {
  return request({
    url: '/vehicles',
    method: 'put',
    data,
    mode: 'control'
  })
}
/**
 * copyVehicle 批量复制车像到别的分组  
 * @param {object} data
 */
export function copyVehicle(data) {
  return request({
    url: '/vehicle-groups/vehicles',
    method: 'post',
    data,
    mode: 'control'
  })
}
/**
 * removeVehicle 批量移出车像到别的分组
 * @param {object} data
 */
export function removeVehicle(data) {
  return request({
    url: '/vehicle-groups/vehicles',
    method: 'delete',
    data,
    mode: 'control'
  })
}
/**
 * getGroupListIsPortrait 根据组名【未传查询所有】模糊查询人像组【包含人员数目】      
 * @param {object} params
 */
export function getGroupListIsPortrait(params) {
  return request({
    url: '/portrait-groups',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getGroupListIsVehicle 根据组名【未传查询所有】模糊查询车辆组【包含车辆数目】      
 * @param {object} params
 */
export function getGroupListIsVehicle(params) {
  return request({
    url: '/vehicle-groups',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getGroupsById 根据分组标识查询分组
 * @param {object} params
 */
export function getGroupsById(uid) {
  return request({
    url: '/groups/' + uid,
    method: 'get',
    mode: ''
  })
}
/**
 * putGroup 修改分组
 * @param {object} params
 */
export function putGroup(data) {
  return request({
    url: '/groups',
    method: 'put',
    data,
    mode: ''
  })
}
/**
 * delPortraitGroupById 删除人像组  
 * @param {object} params
 */
export function delPortraitGroupById(uid) {
  return request({
    url: '/portrait-groups/' + uid,
    method: 'delete',
    mode: 'control'
  })
}
/**
 * delVehicleGroupById 删除车辆组  
 * @param {object} params
 */
export function delVehicleGroupById(uid) {
  return request({
    url: '/vehicle-groups/' + uid,
    method: 'delete',
    mode: 'control'
  })
}
/* ========== 布控管理 ========== */
/**
 * addControl 新增布控
 * @param {object} data
 */
export function addControl(data) {
  return request({
    url: '/surveillances',
    method: 'post',
    data,
    mode: 'control'
  })
}
/**
 * getControlInfoByName 通过布控名称获取布控信息
 * @param {object} params
 */
export function getControlInfoByName(params) {
  return request({
    url: '/surveillances',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getControlList 布控列表分页查询接口
 * @param {object} params
 */
export function getControlList(params) {
  return request({
    url: '/surveillances/page',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getControlObject 获取所有布控对象
 * @param {object} params
 */
export function getControlObject(params) {
  return request({
    url: '/surveillance-objects',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getControlDevice 获取所有布控设备
 * @param {object} params
 */
export function getControlDevice(params) {
  return request({
    url: '/surveillance-devices',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getControlDetail 布控详情查询接口
 * @param {object} params
 */
export function getControlDetail(uid) {
  return request({
    url: '/surveillances/' + uid + '/detail',
    method: 'get',
    mode: 'control'
  })
}
/**
 * getControlDetailIsEditor 编辑时根据标识获取所有布控信息
 * @param {object} params
 */
export function getControlDetailIsEditor(uid) {
  return request({
    url: '/surveillances/' + uid,
    method: 'get',
    mode: 'control'
  })
}
/**
 * putControl 编辑布控
 * @param {object} data
 */
export function putControl(data) {
  return request({
    url: '/surveillances',
    method: 'put',
    data,
    mode: 'control'
  })
}
/**
 * getControlObjList 布控对象列表分页查询
 * @param {object} params
 */
export function getControlObjList(params) {
  return request({
    url: '/surveillances/object/page',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * delControl 删除布控
 * @param {object} params
 */
export function delControl(uid) {
  return request({
    url: '/surveillances/' + uid,
    method: 'delete',
    mode: 'control'
  })
}
/**
 * controlArea 布控范围
 * @param {object} params
 */
export function controlArea(uid) {
  return request({
    url: '/surveillances/' + uid + '/devices' ,
    method: 'get',
    mode: 'control'
  })
}
/**
 * controlStop 终止布控
 * @param {object} params
 */
export function controlStop(data) {
  return request({
    url: '/surveillances/' + data.uid + '/stop' ,
    method: 'put',
    data,
    mode: 'control'
  })
}
/**
 * repertorySel 从库中选择
 * @param {object} params
 */
export function repertorySel(params) {
  return request({
    url: '/surveillances/objects',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getAllMonitorList 通过行政编码所有监控设备列表   
 * @param {object} params
 */
export function getAllMonitorList(params) {
  return request({
    url: '/device-service/all-monitor-list',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getAreas 区域列表查询
 * @param {object} params
 */
export function getAreas(params) {
  return request({
    url: '/area-service/areas',
    method: 'get',
    params,
    mode: 'user'
  })
}
/**
 * getAllBayontListByAreaId 通过行政地区id查所有卡口列表
 * @param {object} params
 */
export function getAllBayontListByAreaId(params) {
  return request({
    url: '/bayonet-service/areaId',
    method: 'get',
    params,
    mode: ''
  })
}
/* ========== 布控地图 ========== */
/**
 * getControlMap 根据条件查询布控的所有设备点位【默认查询正在进行的布控的所有设备】
 * @param {object} params
 */
export function getControlMap(params) {
  return request({
    url: '/surveillances/devices',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getControlMapByDevice 设备下布控列表查询接口
 * @param {object} params
 */
export function getControlMapByDevice(params) {
  return request({
    url: '/surveillances/device/' + params.uid + '/surveillance-detail',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getAlarmSnap 布控详情中的布控抓拍结果分页查询列表
 * @param {object} params
 */
export function getAlarmSnap(params) {
  return request({
    url: '/surveillances/' + params['where.surveillanceId'] + '/alarm-snaps/page',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getAlarmListByDev 获得设备报警列表
 * @param {object} params
 */
export function getAlarmListByDev(params) {
  return request({
    url: 'alarm-snaps/devices',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getAllAlarmSnapListByDev 获得当前展示在地图上的设备抓拍列表
 * @param {object} params
 */
export function getAllAlarmSnapListByDev(params) {
  return request({
    url: 'alarm-snaps/by-dev/page',
    method: 'get',
    params,
    mode: 'control'
  })
}
/*=================消息管理模块================== */
/**
 * addMutualHelp 新增民众互助接口
 * @param {object} params
 */
export function addMutualHelp(data) {
  return request({
    url: '/event-service/mutual-help',
    method: 'post',
    data,
    mode: 'message'
  })
}
/**
 * getMutualHelpDetail 民众互助详情查询接口  

 * @param {object} params
 */
export function getMutualHelpDetail(uid) {
  return request({
    url: '/event-service/mutual-help/' + uid,
    method: 'get',
    mode: 'message'
  })
}
/**
 * putMutualHelp 修改民众互助接口
 * @param {object} params
 */
export function putMutualHelp(data) {
  return request({
    url: '/event-service/mutual-help',
    method: 'put',
    data,
    mode: 'message'
  })
}
/**
 * replyComment 回复事件评论接口   
 * @param {object} params
 */
export function replyComment(data) {
  return request({
    url: '/event-service/reply-comment',
    method: 'post',
    data,
    mode: 'message'
  })
}
/**
 * shieldComment 屏蔽评论接口   
 * @param {object} params
 */
export function shieldComment(data) {
  return request({
    url: '/event-service/shield-comment',
    method: 'post',
    data,
    mode: 'message'
  })
}
/**
 * getMutualHelpList 民众互助列表分页查询接口
 * @param {object} params
 */
export function getMutualHelpList(params) {
  return request({
    url: '/event-service/mutual-help-list',
    method: 'get',
    params,
    mode: 'message'
  })
}
/**
 * getCommentInfoList 事件评论列表分页查询接口
 * @param {object} params
 */
export function getCommentInfoList(uid) {
  return request({
    url: '/event-service/comment-info-list/' + uid,
    method: 'get',
    mode: 'message'
  })
}
/**
 * addMsgNote 新增消息公告接口
 * @param {object} params
 */
export function addMsgNote(data) {
  return request({
    url: '/message-service/msg-note',
    method: 'post',
    data,
    mode: 'message'
  })
}
/**
 * getMsgNoteList 公告消息列表分页查询接口  
 * @param {object} params
 */
export function getMsgNoteList(params) {
  return request({
    url: '/message-service/msg-note-list',
    method: 'get',
    params,
    mode: 'message'
  })
}
/**
 * getMsgNoteDetail 消息公告详情查询接口
 * @param {object} params
 */
export function getMsgNoteDetail(uid) {
  return request({
    url: '/message-service/msg-note/' + uid,
    method: 'get',
    mode: 'message'
  })
}
/**
 * putMsgNote 修改消息公告接口    
 * @param {object} params
 */
export function putMsgNote(data) {
  return request({
    url: '/message-service/msg-note',
    method: 'put',
    data,
    mode: 'message'
  })
}
/**
 * sendMsg 发送短信消息接口     
 * @param {object} params
 */
export function sendMsg(data) {
  return request({
    url: '/message-service/send-msg',
    method: 'post',
    data,
    mode: 'message'
  })
}
/**
 * getOrganInfos 组织机构列表分页查询接口
 * @param {object} params
 */
export function getOrganInfos(params) {
  return request({
    url: '/authServices/organInfos',
    method: 'get',
    params,
    mode: 'auth'
  })
}
/**
 * getOrganUser 根据组织机构查人员分页接口   
 * @param {object} params
 */
export function getOrganUser(params) {
  return request({
    url: '/authServices/organ/user',
    method: 'get',
    params,
    mode: 'auth'
  })
}
/**
 * getSmsTemplate 通过项目类型查询短信模板列表分页查询接口
 * @param {object} params
 */
export function getSmsTemplate(params) {
  return request({
    url: '/SmsController/news/v3/smsTemplate',
    method: 'get',
    params,
    mode: 'sms'
  })
}
/**
 * getSmsList 获取短信分页
 * @param {object} params
 */
export function getSmsList(params) {
  return request({
    url: '/SmsController/news/v3/msgRecord',
    method: 'get',
    params,
    mode: 'sms'
  })
}

/*--------------------------  研判start  ---------------------------------*/
/**
 * JtcPOSTAppendixInfo 指定记录上传附件
 * @param {object} params
 */
export function JtcPOSTAppendixInfo(data) {
  return request({
    url: '/appendixes',
    method: 'post',
    data,
    mode: 'judge'
  })
}
/**
 * JtcGETAppendixInfoList 历史上传图片
 * @param {object} params
 */
export function JtcGETAppendixInfoList(params) {
  return request({
    url: '/appendixes/page',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JtcPUTAppendixsOrder 附件信息更新接口
 * @param {object} params
 */
export function JtcPUTAppendixsOrder(params) {
  return request({
    url: '/appendixes',
    method: 'put',
    params: params,
    mode: 'judge'
  })
}
/**
 * JtcGETTrail 布控抓拍结果图片检索接口
 * @param {object} params
 */
export function JtcGETTrail(params) {
  return request({
    url: '/structures',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JigGETEvent 事件编号查询列表接口
 * @param {object} params
 */
export function JigGETEvent(params) {
  return request({
    url: '/events/page',
    method: 'get',
    params: params,
    mode: 'event'
  })
}
/**
 * JigGETEventAlarm 事件侦查检索接口
 * @param {object} params
 */
export function JigGETEventAlarm(params) {
  return request({
    url: '/events/' + params.eventId + '/alarm-snaps',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JigGETAlarmSnapList 设备抓拍结果列表接口
 * @param {object} params
 */
export function JigGETAlarmSnapList(params) {
  return request({
    url: '/surveillances/' + params.surveillanceId + '/alarm-snaps',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JfoGETGroup 分组列表查询接口
 * @param {object} params
 */
export function JfoGETGroup(params) {
  return request({
    url: '/group',
    method: 'get',
    params: params,
    mode: 'base'
  })
}
/**
 * JfoGETSurveillanceObject 布控范围内监控设备列表查询接口
 * @param {object} params
 */
export function JfoGETSurveillanceObject(params) {
  return request({
    url: '/alarm-snaps/by-group',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JfoGETEventList 事件列表查询接口
 * @param {object} params
 */
export function JfoGETEventList(params) {
  return request({
    url: '/events/by-surveillance',
    method: 'get',
    params: params,
    mode: 'event'
  })
}
/**
 * JhaGETStatisicByAddress 高危人员抓拍区域统计接口
 * @param {object} params
 */
export function JhaGETStatisicByAddress(params) {
  return request({
    url: '/alarm-snaps/by-address',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JhaGETAlarmSnapByAddress 高危人员抓拍结果列表查询接口
 * @param {object} params
 */
export function JhaGETAlarmSnapByAddress(params) {
  return request({
    url: '/devices/' + params.deviceId + '/alarm-snaps',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/*--------------------------  研判end  ---------------------------------*/
/*--------------------------  检索start  ---------------------------------*/
/**
 * ScpGETPortraitInfo 人像检索接口
 * @param {object} params
 */
export function ScpGETPortraitInfo(params) {
  return request({
    url: '/portrait-structures/page',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * ScpGETstrucInfoList 抓拍检索列表接口
 * @param {object} params
 */
export function ScpGETstrucInfoList(params) {
  return request({
    url: '/structures/page',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * ScpGETbasePortraitInfo 信息库人员查询接口
 * @param {object} params
 */
export function ScpGETbasePortraitInfo(params) {
  return request({
    url: '/portraits/by-idno',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * ScpGETportraitCmpInfo 人像比对接口
 * @param {object} params
 */
export function ScpGETportraitCmpInfo(params) {
  return request({
    url: '/portrait-structures/compare',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * ScpGETretrievalHisList 历史检索记录查询接口
 * @param {object} params
 */
export function ScpGETretrievalHisList(params) {
  return request({
    url: '/retrieval-histories/page',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * ScpGETretrievalHisById 历史检索记录详情查询接口
 * @param {object} params
 */
export function ScpGETretrievalHisById(params) {
  return request({
    url: '/retrieval-histories/' + params,
    method: 'get',
    mode: 'judge'
  })
}
/**
 * ScpGETdeviceListById
 通过用户id查询监控设备列表
 * @param {object} params
 */
export function ScpGETdeviceListById(params) {
  return request({
    url: '/device-service/device-list',
    method: 'get',
    mode: 'base',
    params: params
  })
}
/*--------------------------  检索end  ---------------------------------*/
