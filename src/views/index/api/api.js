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