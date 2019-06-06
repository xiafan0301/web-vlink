import request from '@/config/axios';

/**     档案管理     ** */

/**
 * 新增车辆
 * @param {*} data 
 */
export function addVehicle (data) {
  return request ({
    url: '/vehicle/add',
    data,
    method: 'post',
    mode: 'vehicle'
  });
}
/**
 * 修改车辆信息
 * @param {*} data 
 */
export function updateVehicle (data) {
  return request ({
    url: '/vehicle/vehicle-info',
    data,
    method: 'put',
    mode: 'vehicle'
  });
}
/**
 * 分页查询车辆列表
 * @param {*} data 
 */
export function getVehicleList (data) {
  return request ({
    url: '/vehicle/vehicle-info/page',
    params: data,
    method: 'get',
    mode: 'vehicle'
  });
}
/**
 * 查询车辆详情
 * @param {*} data 
 */
export function getVehicleDetail (uid) {
  return request ({
    url: '/vehicle/vehicle-info/' + uid,
    method: 'get',
    mode: 'vehicle'
  });
}
/**
 * 删除车辆
 * @param {*} data 
 */
export function delVehicle (uid) {
  return request ({
    url: '/vehicle/vehicle-info/' + uid,
    method: 'delete',
    mode: 'vehicle'
  });
}