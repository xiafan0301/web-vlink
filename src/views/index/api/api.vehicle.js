import request from '@/config/axios';
/*================车辆侦查=================== */
/**
 * 过车数据统计接口
 * @param {*} params 
 */
export const apiPassingCarSta = (params) => {
  return request({
    url: '/analysis/passing-car',
    method: 'get',
    params,
    mode: 'judge'
  });
}
/**
 * 车流量统计接口
 * @param {*} params 
 */
export const apiCarFlow = (params) => {
  return request({
    url: '/analysis/car-flow',
    method: 'get',
    params,
    mode: 'judge'
  });
}
/**
 * getAllMonitorList 查询所有卡口列表接口   
 * @param {object} params
 */
export function getAllBayonetListByName(params) {
  return request({
    url: '/analysis/bayonets',
    method: 'get',
    params,
    mode: 'judge'
  })
}
/**
 * getAllMonitorList 布控车辆出城统计接口   
 * @param {object} params
 */
export function apiOutCityStatistics(params) {
  return request({
    url: '/vehicle-investigate/out-city-statistics',
    method: 'get',
    params,
    mode: 'judge'
  })
}