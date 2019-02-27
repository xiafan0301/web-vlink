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
 * addPortrait 人像库列表分页查询接口
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
 * addPortrait 通过证件号搜索人像（根据返回对象为空可判断证件号是否存在）
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
 * addPortrait 车像库列表分页查询接口
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
 * addPortrait 新建车像
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