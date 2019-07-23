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

/**
 * 查询全国车辆型号列表信息   
 * @param {object} params
 */
export function getCarmodelList(params) {
  return request({
    url: '/vehicle-brands',
    method: 'get',
    params,
    mode: baseModeName
  })
}

/**
 * 通过设备id监控设备详情查询   
 * @param {object} params
 */
export function getDeviceDetailById(params) {
  return request({
    url: '/device-service/device-details',
    method: 'get',
    params: params,
    mode: baseModeName
  })
}

/**
 * 根据卡口标识集合查询设备列表信息   
 * @param {object} params
 */
export function getDeviceByBayonetUids(params) {
  let str = '';
  for (let i = 0; i < params.length; i++) {
    str += (i === 0 ? '' : '&') + 'bayonetUids=' + params[i] + '&';
  }
  return request({
    url: '/device-service/bayonetUids?' + str,
    method: 'get',
    // params: params,
    mode: baseModeName
  })
}

/**
 * 车辆品牌/型号列表   
 */
export function getVehicleList() {
  return request({
    url: '/vehicle-dict/list',
    method: 'get',
    mode: baseModeName
  })
}

/*******    摄像头管理       ******** */

/**
 * 获取摄像头列表
 */
export function getCameraList() {
  return request({
    url: '/device-service/deviceBasicPageList',
    method: 'get',
    mode: baseModeName
  });
}