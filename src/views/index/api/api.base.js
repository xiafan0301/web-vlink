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