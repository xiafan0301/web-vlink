import request from '@/config/axios';

/**
 * 字典接口
 * @param {*} data 
 */
export function getDiciData(uid) {
  return request({
    url: 'dictService/dictList/?pid=' + uid,
    method: 'get'
  })
}
/*=================事件管理模块================== */
/**
 * 获取事件列表数据
 * @param {*} data 
 */
export function getEventList(data) {
  return request({
    url: 'eventServices/events/page',
    method: 'get',
    params: data,
    mode: 'event'
  })
}
/**
 * 修改事件
 */
export function updateEvent(data, uid) {
  return request({
    url: 'eventServices/events/' + uid,
    method: 'put',
    data,
    mode: 'event'
  })
}
/**
 * 添加事件
 */
export function addEvent(data) {
  return request({
    url: 'eventServices/event',
    method: 'post',
    data,
    mode: 'event'
  })
}
/**
 * 获取事件详情
 * @param {*} data 
 */
export function getEventDetail(uid) {
  return request({
    url: 'eventServices/events/' + uid,
    method: 'get',
    mode: 'event'
  })
}
/**
 * 获取调度指挥列表数据
 * @param {*} data 
 */
export function getCtcList(data) {
  return request({
    url: 'eventServices/events/page',
    method: 'get',
    params: data,
    mode: 'ctc'
  })
}
/**
 * 分页查询预案
 * @param {*} data 
 */
export function getPlanData(data) {
  return request({
    url: 'planServices/plans',
    method: 'get',
    params: data,
    mode: 'ctc'
  })
}
/**
 * 获取预案详情
 * @param {*} data 
 */
export function getPlanDetail(uid) {
  return request({
    url: 'planServices/plans/' + uid,
    method: 'get',
    mode: 'ctc'
  })
}
/**
 * 添加预案
 * @param {*} data 
 */
export function addPlan(data) {
  return request({
    url: 'planServices/plan',
    data,
    method: 'post',
    mode: 'ctc'
  })
}
/**
 * 修改预案
 * @param {*} data 
 */
export function updatePlan(data) {
  return request({
    url: 'planServices/plans',
    method: 'put',
    data,
    mode: 'ctc'
  })
}
/**
 * 删除预案
 * @param {*} data 
 */
export function delPlan(uid) {
  return request({
    url: 'planServices/plans/' + uid,
    method: 'delete',
    mode: 'ctc'
  })
}
/**
 * 预览预案
 * @param {*} data 
 */
export function previewPlan(uid) {
  return request({
    url: 'planServices/plans/' + uid,
    method: 'get',
    mode: 'ctc'
  })
}
/**
 * 分页获取调度任务
 * @param {*} data 
 */
export function getCtcData(data) {
  return request({
    url: 'taskServices/tasks',
    method: 'get',
    params: data,
    mode: 'ctc'
  })
}
/**
 * 调度指挥
 * @param {*} data 
 */
export function ctcTasks(data, uid) {
  return request({
    url: 'taskServices/task/' + uid,
    method: 'post',
    data,
    mode: 'ctc'
  })
}
/**
 * 修改事件过程状态
 * @param {*} data 
 */
export function updateProcess(uid, data) {
  return request({
    url: 'taskServices/task/process/' + uid,
    method: 'put',
    params: data,
    mode: 'ctc'
  })
}
/* ================== 管理模块 =================== */
/*****  部门架构  ** */

/**
 * 获取部门列表数据
 * @param {*} data 
 */
export function getDepartmentList (data) {
  return request({
    url: 'auth/authServices/organInfos',
    params: data,
    method: 'get'
  })
}
/**
 * 编辑部门
 * @param {*} data 
 */
export function updateDepart (data) {
  return request({
    url: 'auth/authServices/organInfo',
    data,
    method: 'put'
  })
}
/**
 * 删除部门
 * @param {*} data 
 */
export function delDepart (data) {
  return request({
    url: 'auth/authServices/organInfo?uids=' + data.deleteId + '&proKey=' + data.proKey,
    method: 'delete'
  })
}
/**
 * 判断部门名称是否重复
 * @param {*} data 
 */
export function judgeDepart (data) {
  return request({
    url: 'auth/authServices/organName',
    params: data,
    method: 'get'
  })
}
/**
 * 添加部门
 * @param {*} data 
 */
export function addDepart (data) {
  return request({
    url: 'auth/authServices/organInfo',
    data,
    method: 'post'
  })
}
/**
 * 获取用户列表数据
 * @param {*} data 
 */
export function getUserList (data) {
  return request({
    url: 'userServices/users',
    params: data,
    method: 'get'
  })
}
/**
 * 获取部门详情
 * @param {*} data 
 */
export function getDepartDetail (data) {
  return request({
    url: 'auth/authServices/organInfo',
    params: data,
    method: 'get'
  })
}
/**
 * 获取用户组
 * @param {*} data 
 */
export function getUserGroup (data) {
  return request({
    url: 'auth/authServices/userGroups',
    params: data,
    method: 'get'
  })
}
/**
 * 删除用户
 * @param {*} data 
 */
export function delUser (uid) {
  return request({
    url: 'auth/authServices/user/' + uid,
    method: 'delete'
  })
}
/**
 * 启用/禁用用户
 * @param {*} data 
 */
export function isForceUser (params) {
  return request({
    url: 'auth/authServices/user',
    params,
    method: 'put'
  })
}
/**
 * 编辑用户
 * @param {*} data 
 */
export function updateUser (params) {
  return request({
    url: 'auth/authServices/user',
    params,
    method: 'put'
  })
}
/**
 * 创建用户
 * @param {*} data 
 */
export function createUser (params) {
  return request({
    url: 'auth/authServices/user',
    params,
    method: 'post'
  })
}
/* ================== 布控模块 =================== */
/* ========== 布控库 ========== */
/**
 * addPortrait 新建人像
 * @param {object} data
 */
export function addPortrait(data) {
  return request({
    url: '/surveillanceRepertory/portrait',
    method: 'post',
    data,
    mode: ''
  })
}
/**
 * delPortrait 删除人像
 * @param {object} data
 */
export function delPortrait(data) {
  return request({
    url: '/surveillanceRepertory/portrait/batch',
    method: 'delete',
    data,
    mode: ''
  })
}
/**
 * getPortraitList 人像库列表分页查询接口
 * @param {object} params
 */
export function getPortraitList(params) {
  return request({
    url: '/surveillanceRepertory/portrait/page',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getPortraitById 通过标识获取人像包含组信息
 * @param {object} uid
 */
export function getPortraitById(uid) {
  return request({
    url: '/surveillanceRepertory/portrait/withGroup/' + uid,
    method: 'get',
    mode: ''
  })
}
/**
 * putPortrait 修改人像
 * @param {object} data
 */
export function putPortrait(data) {
  return request({
    url: '/surveillanceRepertory/portrait',
    method: 'put',
    data,
    mode: ''
  })
}
/**
 * getPortraitListByGroup 根据不同分组人像库列表分页查询接口
 * @param {object} params
 */
export function getPortraitListByGroup(params) {
  return request({
    url: '/surveillanceRepertory/portrait/pageByGroup',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getPortraitByIdNo 通过证件号搜索人像（根据返回对象为空可判断证件号是否存在）
 * @param {object} params
 */
export function getPortraitByIdNo(params) {
  return request({
    url: '/surveillanceRepertory/portrait/byIdNo',
    method: 'get',
    params,
    mode: ''
  })
}

/**
 * addVehicle 新建车像
 * @param {object} data
 */
export function addVehicle(data) {
  return request({
    url: '/surveillanceRepertory/vehicle',
    method: 'post',
    data,
    mode: ''
  })
}
/**
 * delVehicle 删除车像
 * @param {object} data
 */
export function delVehicle(data) {
  return request({
    url: '/surveillanceRepertory/vehicle/batch',
    method: 'delete',
    data,
    mode: ''
  })
}
/**
 * getVehicleList 车像库列表分页查询接口
 * @param {object} params
 */
export function getVehicleList(params) {
  return request({
    url: '/surveillanceRepertory/vehicle/page',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getVehicleById 通过标识获取车辆包含组信息
 * @param {object} uid
 */
export function getVehicleById(uid) {
  return request({
    url: '/surveillanceRepertory/vehicle/withGroup/' + uid,
    method: 'get',
    mode: ''
  })
}
/**
 * getVehicleByIdNo 通过车牌号搜索车辆
 * @param {object} params
 */
export function getVehicleByIdNo(params) {
  return request({
    url: '/surveillanceRepertory/vehicle/byIdNo',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getVehicleListByGroup 根据不同分组车像库列表分页查询接口
 * @param {object} params
 */
export function getVehicleListByGroup(params) {
  return request({
    url: '/surveillanceRepertory/vehicle/pageByGroup',
    method: 'get',
    params,
    mode: ''
  })
}
