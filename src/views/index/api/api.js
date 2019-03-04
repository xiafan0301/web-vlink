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
/*=================事件管理模块================== */
/**
 * 获取事件列表数据
 * @param {*} data 
 */
export function getEventList(data) {
  return request({
    url: 'eventServices/events/page',
    method: 'get',
    params: data
  })
}
/**
 * 添加事件
 */
export function addEvent(data) {
  return request({
    url: 'eventServices/event',
    method: 'post',
    data
  })
}
/**
 * 获取事件详情
 * @param {*} data 
 */
export function getEventDetail(uid) {
  return request({
    url: 'eventServices/event/' + uid,
    method: 'get'
  })
}
// /**
//  * 获取调度指挥列表数据
//  * @param {*} data 
//  */
// export function getCtcList(data) {
//   return request({
//     url: 'eventServices/events/page',
//     method: 'get',
//     params: data
//   })
// }