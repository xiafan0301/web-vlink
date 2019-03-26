import request from '@/config/axios';

/**
 * testApiService
 * @param {Object} data 接口入参
 */
export function testApiService(data) {
  return request({
    url: '/testApiService',
    method: 'post/get/put...',
    data,
    params: null,
    mode: ''
  })
}

/* ========== 可视化 ========== */
/**
 * getBorders 区域边框描点
 * @param {string} data 区域adcode
 */
export function getBorders(data) {
  return request({
    url: 'mapServices/borders/' + data,
    method: 'get',
    // params: data,
    // data,
    mode: ''
  })
}
/* ========== 应急指挥 ========== */
/**
 * getEventsStatistics 事件统计信息
 * @param {object} data 事件ID eventId: ''
 */
export function getEventsStatistics(data) {
  return request({
    url: 'eventServices/events/statistics',
    method: 'get',
    params: data,
    // data,
    mode: 'ecc'
  })
}
/* ================== 布控模块 =================== */
/* ========== 布控库 ========== */
/**
 * addPortrait 新建人像
 * @param {object} data
 */
export function addPortrait(data) {
  return request({
    url: '/surveillanceRepertory/portrait',
    method: 'post',
    data,
    mode: ''
  })
}
/**
 * delPortrait 删除人像
 * @param {object} data
 */
export function delPortrait(data) {
  return request({
    url: '/surveillanceRepertory/portrait/batch',
    method: 'delete',
    data,
    mode: ''
  })
}
/**
 * getPortraitList 人像库列表分页查询接口
 * @param {object} params
 */
export function getPortraitList(params) {
  return request({
    url: '/surveillanceRepertory/portrait/page',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getPortraitById 通过标识获取人像包含组信息
 * @param {object} uid
 */
export function getPortraitById(uid) {
  return request({
    url: '/surveillanceRepertory/portrait/withGroup/' + uid,
    method: 'get',
    mode: ''
  })
}
/**
 * putPortrait 修改人像
 * @param {object} data
 */
export function putPortrait(data) {
  return request({
    url: '/surveillanceRepertory/portrait',
    method: 'put',
    data,
    mode: ''
  })
}
/**
 * getPortraitListByGroup 根据不同分组人像库列表分页查询接口
 * @param {object} params
 */
export function getPortraitListByGroup(params) {
  return request({
    url: '/surveillanceRepertory/portrait/pageByGroup',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getPortraitByIdNo 通过证件号搜索人像（根据返回对象为空可判断证件号是否存在）
 * @param {object} params
 */
export function getPortraitByIdNo(params) {
  return request({
    url: '/surveillanceRepertory/portrait/byIdNo',
    method: 'get',
    params,
    mode: ''
  })
}

/**
 * addVehicle 新建车像
 * @param {object} data
 */
export function addVehicle(data) {
  return request({
    url: '/surveillanceRepertory/vehicle',
    method: 'post',
    data,
    mode: ''
  })
}
/**
 * delVehicle 删除车像
 * @param {object} data
 */
export function delVehicle(data) {
  return request({
    url: '/surveillanceRepertory/vehicle/batch',
    method: 'delete',
    data,
    mode: ''
  })
}
/**
 * getVehicleList 车像库列表分页查询接口
 * @param {object} params
 */
export function getVehicleList(params) {
  return request({
    url: '/surveillanceRepertory/vehicle/page',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getVehicleById 通过标识获取车辆包含组信息
 * @param {object} uid
 */
export function getVehicleById(uid) {
  return request({
    url: '/surveillanceRepertory/vehicle/withGroup/' + uid,
    method: 'get',
    mode: ''
  })
}
/**
 * getVehicleByIdNo 通过车牌号搜索车辆
 * @param {object} params
 */
export function getVehicleByIdNo(params) {
  return request({
    url: '/surveillanceRepertory/vehicle/byIdNo',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getVehicleListByGroup 根据不同分组车像库列表分页查询接口
 * @param {object} params
 */
export function getVehicleListByGroup(params) {
  return request({
    url: '/surveillanceRepertory/vehicle/pageByGroup',
    method: 'get',
    params,
    mode: ''
  })
}

/*--------------------------  研判start  ---------------------------------*/
/**
 * JtcPOSTAppendixInfo 指定记录上传附件
 * @param {object} params
 */
export function JtcPOSTAppendixInfo(data) {
  return request({
    url: '/appendix-service/appendix-info',
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
    url: '/appendix-service/appendix-info-list',
    method: 'get',
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
    url: '/portrait-structured/trail',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JtcDELETETrail 删除布控抓拍结果结果
 * @param {object} params
 */
export function JtcDELETETrail(data) {
  return request({
    url: '/portrait-structured/trail',
    method: 'delete',
    data,
    mode: 'judge'
  })
}
/**
 * JigGETEvent 事件编号查询列表接口
 * @param {object} params
 */
export function JigGETEvent(params) {
  return request({
    url: '/eventServices/events/page',
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
    url: '/event/alarm',
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
    url: '/alarm-snap/by-surveillance-object',
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
    mode: 'judge'
  })
}
/**
 * JfoGETSurveillanceObject 布控范围内监控设备列表查询接口
 * @param {object} params
 */
export function JfoGETSurveillanceObject(params) {
  return request({
    url: '/surveillance-object/alarm',
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
    url: '/event-services/event/by-surveillance',
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
    url: '/alarm-snap/statisic/by-address',
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
    url: '/alarm-snap/by-address',
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
    url: '/retrieval-service/portrait-info-list',
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
    url: '/retrieval-service/struc-info-list',
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
    url: '/basePortrait-service/base-portrait-info',
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
    url: '/retrieval-service/portrait-cmpInfo',
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
    url: '/retrieval-service/retrieval-history-list',
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
    url: '/retrieval-service/retrieval-history/' + params,
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