import request from '@/config/axios';

/**     档案管理     ** */

/***     一车一档             */
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
/**
 * 查询车辆轨迹信息
 * @param {*} data 
 */
export function getVehicleTracks (data) {
  return request ({
    url: 'position-current/tracks',
    method: 'get',
    params: data,
    mode: 'vehicle'
  });
}

/****     一室一档      ***** */
/**
 * 删除点室
 * @param {*} data 
 */
export function delRoom (uid) {
  return request ({
    url: '/point-room/' + uid,
    method: 'delete',
    mode: 'vehicle'
  });
}
/**
 * 添加点室
 * @param {*} data 
 */
export function addRoomInfo (data) {
  return request ({
    url: '/point-room/add',
    method: 'post',
    data,
    mode: 'vehicle'
  });
}
/**
 * 修改点室
 * @param {*} data 
 */
export function updateRoom (data) {
  return request ({
    url: '/point-room/update',
    method: 'put',
    data,
    mode: 'vehicle'
  });
}
/**
 * 分页获取点室列表数据
 * @param {*} data 
 */
export function getRoomData (data) {
  return request ({
    url: '/point-room/page',
    method: 'get',
    params: data,
    mode: 'vehicle'
  });
}
/**
 * 获取点室详情
 * @param {*} data 
 */
export function getRoomDetail (uid) {
  return request ({
    url: '/point-room/' + uid,
    method: 'get',
    mode: 'vehicle'
  });
}