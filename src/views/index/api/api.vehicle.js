import request from '@/config/axios';
/*================车辆侦查=================== */
/**
 * 过车数据统计接口
 * @param {*} data 
 */
export const apiPassingCarSta = (data) => {
  return request({
    url: '/analysis/passing-car',
    method: 'post',
    data,
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
 * @param {object} data
 */
export function apiOutCityStatistics(data) {
  return request({
    url: '/vehicle-investigate/out-city-statistics',
    method: 'post',
    data,
    mode: 'vehicle'
  })
}
/**
 * getAllMonitorList 所有出城卡口列表查询   
 * @param {object} params
 */
export function getOutCityBayonet(params) {
  return request({
    url: '/analysis-device/out-city-bayonet',
    method: 'get',
    params,
    mode: 'judge'
  })
}

/**
 * 导出接口 
 * @param {object} params
 */
export function exportExcel(data) {
  return request({
    url: '/export',
    method: 'post',
    data,
    mode: 'vehicle'
  })
}