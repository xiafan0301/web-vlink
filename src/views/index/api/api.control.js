import request from '@/config/axios';
/* ================== 布控模块 =================== */
/* ========== 布控库 ========== */
/**
 * addPortrait 新建人像
 * @param {object} data
 */
export function addPortrait(data) {
  return request({
    url: '/portraits',
    method: 'post',
    data,
    mode: 'control'
  })
}
/**
 * delPortrait 删除人像
 * @param {object} data
 */
export function delPortrait(data) {
  return request({
    url: '/portraits',
    method: 'delete',
    data,
    mode: 'control'
  })
}
/**
 * getPortraitList 人像库列表分页查询接口
 * @param {object} params
 */
export function getPortraitList(params) {
  return request({
    url: '/portraits/page',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getPortraitById 通过标识获取人像包含组信息
 * @param {object} uid
 */
export function getPortraitById(uid) {
  return request({
    url: '/portraits/' + uid,
    method: 'get',
    mode: 'control'
  })
}
/**
 * putPortrait 修改人像
 * @param {object} data
 */
export function putPortrait(data) {
  return request({
    url: '/portraits',
    method: 'put',
    data,
    mode: 'control'
  })
}
/**
 * getPortraitByIdNo 通过证件号搜索人像（根据返回对象为空可判断证件号是否存在）
 * @param {object} params
 */
export function getPortraitByIdNo(params) {
  return request({
    url: '/portraits',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * copyPortrait 批量复制人像到别的分组
 * @param {object} data
 */
export function copyPortrait(data) {
  return request({
    url: '/portrait-groups/portraits',
    method: 'post',
    data,
    mode: 'control'
  })
}
/**
 * removePortrait 批量移出人像到别的分组
 * @param {object} data
 */
export function removePortrait(data) {
  return request({
    url: '/portrait-groups/portraits',
    method: 'delete',
    data,
    mode: 'control'
  })
}

/**
 * addVehicle 新建车像
 * @param {object} data
 */
export function addVehicle(data) {
  return request({
    url: '/vehicles',
    method: 'post',
    data,
    mode: 'control'
  })
}
/**
 * delVehicle 删除车像
 * @param {object} data
 */
export function delVehicle(data) {
  return request({
    url: '/vehicles',
    method: 'delete',
    data,
    mode: 'control'
  })
}
/**
 * getVehicleList 车像库列表分页查询接口
 * @param {object} params
 */
export function getVehicleList(params) {
  return request({
    url: '/vehicles/page',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getVehicleById 通过标识获取车辆包含组信息
 * @param {object} uid
 */
export function getVehicleById(uid) {
  return request({
    url: '/vehicles/' + uid,
    method: 'get',
    mode: 'control'
  })
}
/**
 * getVehicleByIdNo 通过车牌号搜索车辆
 * @param {object} params
 */
export function getVehicleByIdNo(params) {
  return request({
    url: '/vehicles',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * putVehicle 修改车像
 * @param {object} data
 */
export function putVehicle(data) {
  return request({
    url: '/vehicles',
    method: 'put',
    data,
    mode: 'control'
  })
}
/**
 * copyVehicle 批量复制车像到别的分组  
 * @param {object} data
 */
export function copyVehicle(data) {
  return request({
    url: '/vehicle-groups/vehicles',
    method: 'post',
    data,
    mode: 'control'
  })
}
/**
 * removeVehicle 批量移出车像到别的分组
 * @param {object} data
 */
export function removeVehicle(data) {
  return request({
    url: '/vehicle-groups/vehicles',
    method: 'delete',
    data,
    mode: 'control'
  })
}
/**
 * getGroupListIsPortrait 根据组名【未传查询所有】模糊查询人像组【包含人员数目】      
 * @param {object} params
 */
export function getGroupListIsPortrait(params) {
  return request({
    url: '/portrait-groups',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getGroupListIsVehicle 根据组名【未传查询所有】模糊查询车辆组【包含车辆数目】      
 * @param {object} params
 */
export function getGroupListIsVehicle(params) {
  return request({
    url: '/vehicle-groups',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getGroupsById 根据分组标识查询分组
 * @param {object} params
 */
export function getGroupsById(uid) {
  return request({
    url: '/groups/' + uid,
    method: 'get',
    mode: ''
  })
}
/**
 * putGroup 修改分组
 * @param {object} params
 */
export function putGroup(data) {
  return request({
    url: '/groups',
    method: 'put',
    data,
    mode: ''
  })
}
/**
 * delPortraitGroupById 删除人像组  
 * @param {object} params
 */
export function delPortraitGroupById(uid) {
  return request({
    url: '/portrait-groups/' + uid,
    method: 'delete',
    mode: 'control'
  })
}
/**
 * delVehicleGroupById 删除车辆组  
 * @param {object} params
 */
export function delVehicleGroupById(uid) {
  return request({
    url: '/vehicle-groups/' + uid,
    method: 'delete',
    mode: 'control'
  })
}
/* ========== 布控管理 ========== */
/**
 * addControl 新增布控
 * @param {object} data
 */
export function addControl(data) {
  return request({
    url: '/surveillances',
    method: 'post',
    data,
    mode: 'control'
  })
}
/**
 * getControlInfoByName 通过布控名称获取布控信息
 * @param {object} params
 */
export function getControlInfoByName(params) {
  return request({
    url: '/surveillances',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getControlList 布控列表分页查询接口
 * @param {object} params
 */
export function getControlList(params) {
  return request({
    url: '/surveillances/page',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getControlObject 获取所有布控对象
 * @param {object} params
 */
export function getControlObject(params) {
  return request({
    url: '/surveillance-objects',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getControlDevice 获取所有布控设备
 * @param {object} params
 */
export function getControlDevice(params) {
  return request({
    url: '/surveillance-devices',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getControlDetail 布控详情查询接口
 * @param {object} params
 */
export function getControlDetail(uid) {
  return request({
    url: '/surveillances/' + uid + '/detail',
    method: 'get',
    mode: 'control'
  })
}
/**
 * getControlDetailIsEditor 编辑时根据标识获取所有布控信息
 * @param {object} params
 */
export function getControlDetailIsEditor(uid) {
  return request({
    url: '/surveillances/' + uid,
    method: 'get',
    mode: 'control'
  })
}
/**
 * putControl 编辑布控
 * @param {object} data
 */
export function putControl(data) {
  return request({
    url: '/surveillances',
    method: 'put',
    data,
    mode: 'control'
  })
}
/**
 * getControlObjList 布控对象列表分页查询
 * @param {object} params
 */
export function getControlObjList(params) {
  return request({
    url: '/surveillances/object/page',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * delControl 删除布控
 * @param {object} params
 */
export function delControl(uid) {
  return request({
    url: '/surveillances/' + uid,
    method: 'delete',
    mode: 'control'
  })
}
/**
 * controlArea 布控范围
 * @param {object} params
 */
export function controlArea(uid) {
  return request({
    url: '/surveillances/' + uid + '/devices' ,
    method: 'get',
    mode: 'control'
  })
}
/**
 * controlStop 终止布控
 * @param {object} params
 */
export function controlStop(data) {
  return request({
    url: '/surveillances/' + data.uid + '/stop' ,
    method: 'put',
    data,
    mode: 'control'
  })
}
/**
 * repertorySel 从库中选择
 * @param {object} params
 */
export function repertorySel(params) {
  return request({
    url: '/surveillances/objects',
    method: 'get',
    params,
    mode: 'control'
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
    mode: ''
  })
}
/**
 * getAreas 区域列表查询
 * @param {object} params
 */
export function getAreas(params) {
  return request({
    url: '/area-service/areas',
    method: 'get',
    params,
    mode: 'user'
  })
}
/**
 * getAllBayontListByAreaId 通过行政地区id查所有卡口列表
 * @param {object} params
 */
export function getAllBayontListByAreaId(params) {
  return request({
    url: '/bayonet-service/areaId',
    method: 'get',
    params,
    mode: ''
  })
}
/* ========== 布控地图 ========== */
/**
 * getControlMap 根据条件查询布控的所有设备点位【默认查询正在进行的布控的所有设备】
 * @param {object} params
 */
export function getControlMap(params) {
  return request({
    url: '/surveillances/devices',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getControlMapByDevice 设备下布控列表查询接口
 * @param {object} params
 */
export function getControlMapByDevice(params) {
  return request({
    url: '/surveillances/device/' + params.uid + '/surveillance-detail',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getAlarmSnap 布控详情中的布控抓拍结果分页查询列表
 * @param {object} params
 */
export function getAlarmSnap(params) {
  return request({
    url: '/surveillances/' + params['where.surveillanceId'] + '/alarm-snaps/page',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getAlarmListByDev 获得设备报警列表
 * @param {object} params
 */
export function getAlarmListByDev(params) {
  return request({
    url: 'alarm-snaps/devices',
    method: 'get',
    params,
    mode: 'control'
  })
}
/**
 * getAllAlarmSnapListByDev 获得当前展示在地图上的设备抓拍列表
 * @param {object} params
 */
export function getAllAlarmSnapListByDev(params) {
  return request({
    url: 'alarm-snaps/by-dev/page',
    method: 'get',
    params,
    mode: 'control'
  })
}