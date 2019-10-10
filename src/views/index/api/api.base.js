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
 * 获取设备列表
 */
export function getDeviceList(params) {
  return request({
    url: '/device-service/deviceBasicPageList',
    method: 'get',
    params,
    mode: baseModeName
  });
}
/**
 * 删除设备
 */
export function delDevice(uid) {
  return request({
    url: '/device-service/deviceBasic/' + uid,
    method: 'delete',
    mode: baseModeName
  });
}
/**
 * 添加设备
 */
export function addDeviceInfo (data) {
  return request({
    url: '/device-service/deviceBasic',
    data,
    method: 'post',
    mode: baseModeName
  });
}
/**
 * 修改设备
 */
export function editDeviceInfo (data) {
  return request({
    url: '/device-service/deviceBasic',
    data,
    method: 'put',
    mode: baseModeName
  });
}
/**
 * 摄像头模板下载
 */
export function downloadCameraModel () {
  return request({
    url: '/device-service/templateDown',
    method: 'get',
    responseType: 'blob',
    mode: baseModeName
  });
}
/**********************  卡口管理  ********************/
/**
 * 新增卡口
 */
export function addBayonetInfo (data) {
  return request({
    url: '/bayonet-service',
    data,
    method: 'post',
    mode: baseModeName
  });
}
/**
 * 修改卡口
 */
export function putBayonetInfo (data) {
  return request({
    url: '/bayonet-service',
    data,
    method: 'put',
    mode: baseModeName
  });
}
/**
 * 修改卡口基础信息
 */
export function putBayonetBasisInfo (data) {
  return request({
    url: '/bayonet-service/bayonet-info',
    data,
    method: 'put',
    mode: baseModeName
  });
}
/**
 * 卡口列表查询接口
 */
export function getBayonetList (params) {
  return request({
    url: '/bayonet-service/bayonet-info-list',
    params,
    method: 'get',
    mode: baseModeName
  });
}
/**
 * 删除卡口
 */
export function delBayonet (params) {
  return request({
    url: '/bayonet-service/bayonet',
    params,
    method: 'delete',
    mode: baseModeName
  });
}
/**
 * 查看卡口详情
 */
export function getBayonetDetail (params) {
  return request({
    url: '/bayonet-service/bayonet-info',
    params,
    method: 'get',
    mode: baseModeName
  });
}
/**
 * 导出
 */
export function exportService (data) {
  return request({
    url: '/excel-service/export',
    data,
    method: 'post',
    mode: baseModeName
  });
}

/*
* 上传
* */
export function handUpload (file) {
  return request({
    url: '/new',
    data: file,
    datatype: 'json',
    method: 'post',
    mode: baseModeName
  })
}

/**********************  特殊场所相关接口  ********************/
/**
 * 新增卡口
 */
export function getGroupsDevices (params) {
  return request({
    url: '/special-place/groups-devices',
    params,
    method: 'get',
    mode: baseModeName
  });
}
/* ----------区域信息服务-------------- */
/**
 * 根据区域id（多个以逗号隔开）查询区域下（不包含子区域）设备和卡口信息
 */
export function getCaBa (params) {
  return request({
    url: '/area-service/device-and-bayonet',
    params,
    method: 'get',
    mode: baseModeName
  });
}