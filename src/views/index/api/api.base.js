import request from '@/config/axios';
let baseModeName = 'base';
/* ======== vlink-base-data服务 API ======== */

/**
 * 监控设备总数查询
 */
export const apiDeviceTotalList = () => {
  return request({
    url: '/device-service/device-total-list',
    method: 'get',
    mode: baseModeName
  })
}
/**
 * 通过区域编码查询区域设备列表
 */
export const apiAreaServiceDeviceList = (data) => {
  return request({
    url: '/area-service/device-list',
    method: 'get',
    params: data,
    mode: baseModeName
  })
}
/**
 * 通过区域编码查询下级区域数据列表
 */
export const apiAreaList = (data) => {
  return request({
    url: '/area-service/subordinate-area-list',
    method: 'get',
    params: data,
    mode: baseModeName
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
    mode: baseModeName
  })
}
/**
 * getAllMonitorList 通过行政编码所有监控设备列表   
 * @param {object} params
 */
export function getAllBayonetList(params) {
  return request({
    url: '/bayonet-service/areaId',
    method: 'get',
    params,
    mode: baseModeName
  })
}

/**
 * 根据卡口标识查询设备列表信息   
 * @param {object} params
 */
export function getDeviceByBayonetUid(params) {
  return request({
    url: '/device-service/bayonetUid',
    method: 'get',
    params,
    mode: baseModeName
  })
}