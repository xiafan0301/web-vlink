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