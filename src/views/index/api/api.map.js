import request from '@/config/axios';

/*--------------------------  地图start  ---------------------------------*/
/**
 * MapGETmonitorList
 监控设备区域分组列表查询
 * @param {id:用户标识，areaUid:县级区域标识，likeKey:模糊查询关键字} params
 */
export function MapGETmonitorList(params) {
  return request({
    url: '/area-service/all-list',
    method: 'get',
    mode: 'base',
    params: params
  })
}
/**
 * MapPOSTmapSign
 新增地图标注
 * @param {} params
 */
export function MapPOSTmapSign(data) {
  return request({
    url: '/mark-map-service/mark-map',
    method: 'post',
    mode: 'gis',
    data
  })
}
/**
 * MapDELETEmapSign
 删除地图标注
 * @param {} params
 */
export function MapDELETEmapSign(params) {
  return request({
    url: '/mark-map-service/mark-map/' + params.id,
    method: 'delete',
    mode: 'gis'
  })
}
/**
 * MapDELETEmapSign
 修改地图标注
 * @param {} params
 */
export function MapUPDATEEmapSign(data) {
  return request({
    url: '/mark-map-service/mark-map',
    method: 'put',
    mode: 'gis',
    data
  })
}
/**
 * MapDELETEmapSigns
 清空标注信息接口
 * @param {} params
 */
export function MapDELETEmapSigns(params) {
  return request({
    url: '/mark-map-service/mark-maps',
    method: 'delete',
    mode: 'gis',
    params: params
  })
}
/**
 * MapGETvehicleList
 车辆轨迹列表查询接口
 * @param {vehicleId} params
 */
export function MapGETvehicleList(params) {
  return request({
    url: '/mapSignService/vehicleList',
    method: 'get',
    mode: 'base',
    params: params
  })
}
/**
 * MapGETdeviceList
 监控设备列表查询
 * @param {vehicleId} params
 */
export function MapGETdeviceList(params) {
  return request({
    url: '/deviceService/deviceList',
    method: 'get',
    mode: 'base',
    params: params
  })
}
/**
 * MapGETsignList
 标记列表查询接口
 * @param {} params
 */
export function MapGETsignList(params) {
  return request({
    url: '/mark-map-service/mark-map-list',
    method: 'get',
    mode: 'gis',
    params: params
  })
}
/**
 * MapGETsignDetails
 标记详情查询接口
 * @param {} params
 */
export function MapGETsignDetails(params) {
  return request({
    url: '/videoService/signDetails',
    method: 'get',
    mode: 'base',
    params: params
  })
}
/**
 * MapGETpersList
 人员列表查询接口
 * @param {} params
 */
export function MapGETpersList(params) {
  return request({
    url: '/videoCallService/persList',
    method: 'get',
    mode: 'base',
    params: params
  })
}
/**
 * MapPOSTvideoCallInfo
 新增视频通话记录接口
 * @param {} params
 */
export function MapPOSTvideoCallInfo(params) {
  return request({
    url: '/videoCallService/videoCallInfo',
    method: 'post',
    mode: 'base',
    params: params
  })
}
/**
 * MapGETvideoCallInfo
 通话记录列表查询接口
 * @param {} params
 */
export function MapGETvideoCallInfo(params) {
  return request({
    url: '/videoCallService/videoCallInfo',
    method: 'get',
    mode: 'base',
    params: params
  })
}
/**
 * MapPOSTsigns
 新增标记接口
 * @param {} params
 */
export function MapPOSTsigns(params) {
  return request({
    url: '/videoCallService/signs',
    method: 'post',
    mode: 'base',
    params: params
  })
}
/**
 * MapGETvideoCallInfo
 新增标记接口
 * @param {} params
 */
export function MapDELETEsigns(params) {
  return request({
    url: '/videoCallService/signs/' + params.id,
    method: 'delete',
    mode: 'base'
  })
}
/**
 * MapGetBayonetInfo
 查看卡口详情接口
 * @param {} params
 */
export function MapGetBayonetInfo(params) {
  return request({
    url: '/bayonet-service/bayonet-info',
    method: 'get',
    mode: 'base',
    params: params
  })
}
/*--------------------------  地图end  ---------------------------------*/