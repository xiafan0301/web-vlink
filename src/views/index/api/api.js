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
 * @param {string} data 区域adcode0
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
 * copyPortrait 批量复制人像到别的分组
 * @param {object} data
 */
export function copyPortrait(data) {
  return request({
    url: '/surveillanceRepertory/portrait/group/copy/batch',
    method: 'post',
    data,
    mode: ''
  })
}
/**
 * removePortrait 批量移出人像到别的分组
 * @param {object} data
 */
export function removePortrait(data) {
  return request({
    url: '/surveillanceRepertory/portrait/group/delete/batch',
    method: 'delete',
    data,
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
 * putVehicle 修改车像
 * @param {object} data
 */
export function putVehicle(data) {
  return request({
    url: '/surveillanceRepertory/vehicle',
    method: 'put',
    data,
    mode: ''
  })
}
/**
 * copyVehicle 批量复制车像到别的分组
 * @param {object} data
 */
export function copyVehicle(data) {
  return request({
    url: '/surveillanceRepertory/vehicle/group/copy/batch',
    method: 'post',
    data,
    mode: ''
  })
}
/**
 * removeVehicle 批量移出车像到别的分组
 * @param {object} data
 */
export function removeVehicle(data) {
  return request({
    url: '/surveillanceRepertory/vehicle/group/delete/batch',
    method: 'delete',
    data,
    mode: ''
  })
}
/* ========== 布控管理 ========== */
/**
 * addControl 新增布控
 * @param {object} data
 */
export function addControl(data) {
  return request({
    url: '/surveillance',
    method: 'post',
    data,
    mode: ''
  })
}
/**
 * getControlInfoByName 通过布控名称获取布控信息
 * @param {object} params
 */
export function getControlInfoByName(params) {
  return request({
    url: '/surveillance/byName',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getControlList 布控列表分页查询接口
 * @param {object} params
 */
export function getControlList(params) {
  return request({
    url: '/surveillance/page',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getControlObject 获取所有布控对象
 * @param {object} params
 */
export function getControlObject(params) {
  return request({
    url: '/surveillance/object',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getControlDevice 获取所有布控设备
 * @param {object} params
 */
export function getControlDevice(params) {
  return request({
    url: '/surveillance/device',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getControlDetail 布控详情查询接口
 * @param {object} params
 */
export function getControlDetail(uid) {
  return request({
    url: '/surveillance/detail/' + uid,
    method: 'get',
    mode: ''
  })
}
/**
 * getControlDetailIsEditor 编辑时根据标识获取所有布控信息
 * @param {object} params
 */
export function getControlDetailIsEditor(uid) {
  return request({
    url: '/surveillance/beforeUpdate/' + uid,
    method: 'get',
    mode: ''
  })
}
/**
 * putControl 编辑布控
 * @param {object} data
 */
export function putControl(data) {
  return request({
    url: '/surveillance',
    method: 'put',
    data,
    mode: ''
  })
}
/**
 * getControlObjList 布控对象列表分页查询
 * @param {object} params
 */
export function getControlObjList(params) {
  return request({
    url: '/surveillance/object/page',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * delControl 删除布控
 * @param {object} params
 */
export function delControl(uid) {
  return request({
    url: '/surveillance/' + uid,
    method: 'delete',
    mode: ''
  })
}
/**
 * controlArea 布控范围
 * @param {object} params
 */
export function controlArea(uid) {
  return request({
    url: '/surveillance/area/' + uid,
    method: 'get',
    mode: ''
  })
}
/**
 * controlStop 终止布控
 * @param {object} params
 */
export function controlStop(data) {
  return request({
    url: '/surveillance/stop/' + data.uid,
    method: 'put',
    data,
    mode: ''
  })
}
/**
 * repertorySel 从库中选择
 * @param {object} params
 */
export function repertorySel(params) {
  return request({
    url: '/surveillance/repertory',
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
    url: '/controlMap',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getControlMapByDevice 设备下布控列表查询接口
 * @param {object} params
 */
export function getControlMapByDevice(params) {
  return request({
    url: '/controlMap/byDevice',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getAlarmSnap 布控抓拍结果分页查询列表
 * @param {object} params
 */
export function getAlarmSnap(params) {
  return request({
    url: '/surveillance/alarmSnap/page',
    method: 'get',
    params,
    mode: ''
  })
}