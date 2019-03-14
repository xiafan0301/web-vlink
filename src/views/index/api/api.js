import request from '@/config/axios';

/**
 * 用户登录
 * @param {*} data 
 */
export function login(data) {
  return request({
    url: '/userService/login',
    data,
    mode: 'user',
    method: 'post'
  });
}
/**
 * 用户退出登录
 * @param {*} data 
 */
export function logout(data) {
  return request({
    url: '/userService/logout',
    params: data,
    mode: 'user',
    method: 'get'
  });
}
/**
 * getBorders 区域边框描点
 * @param {string} data 区域adcode0
 * 判断用户是否注册
 * @param {*} data 
 */
export function isRegister(data) {
  return request({
    url: '/userService/checkUserMobile',
    params: data,
    mode: 'user',
    method: 'get'
  });
}
/**
 * 字典接口
 * @param {*} data 
 */
export function getDiciData(uid) {
  return request({
    url: 'dictService/dictList/?pid=' + uid,
    method: 'get'
  });
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
  });
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
  });
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
  });
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
  });
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
  });
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
  });
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
  });
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
  });
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
  });
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
  });
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
  });
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
  });
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
  });
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
  });
}
/* ================== 管理模块 =================== */
/*****  部门架构  ** */

/**
 * 获取部门列表数据
 * @param {*} data 
 */
export function getDepartmentList (data) {
  return request({
    url: 'authServices/organInfos',
    params: data,
    method: 'get',
    mode: 'auth'
  });
}
/**
 * 编辑部门
 * @param {*} data 
 */
export function updateDepart (data) {
  return request({
    url: 'authServices/organInfo',
    data,
    mode: 'auth',
    method: 'put'
  });
}
/**
 * 删除部门
 * @param {*} data 
 */
export function delDepart (data) {
  return request({
    url: 'authServices/organInfo?uids=' + data.deleteId + '&proKey=' + data.proKey,
    mode: 'auth',
    method: 'delete'
  });
}
/**
 * 判断部门名称是否重复
 * @param {*} data 
 */
export function judgeDepart (data) {
  return request({
    url: 'authServices/organName',
    params: data,
    mode: 'auth',
    method: 'get'
  });
}
/**
 * 添加部门
 * @param {*} data 
 */
export function addDepart (data) {
  return request({
    url: 'authServices/organInfo',
    data,
    mode: 'auth',
    method: 'post'
  });
}
/**
 * 获取用户列表数据
 * @param {*} data 
 */
export function getUserList (data) {
  return request({
    url: 'userServices/users',
    params: data,
    mode: 'auth',
    method: 'get'
  });
}
/**
 * 获取部门详情
 * @param {*} data 
 */
export function getDepartDetail (data) {
  return request({
    url: 'authServices/organInfo',
    params: data,
    mode: 'auth',
    method: 'get'
  });
}
/**
 * 获取用户组
 * @param {*} data 
 */
export function getUserGroup (data) {
  return request({
    url: 'authServices/userGroups',
    params: data,
    mode: 'auth',
    method: 'get'
  });
}
/**
 * 删除用户
 * @param {*} data 
 */
export function delUser (uid) {
  return request({
    url: 'authServices/user/' + uid,
    mode: 'auth',
    method: 'delete'
  });
}
/**
 * 启用/禁用用户
 * @param {*} data 
 */
export function isForceUser (params) {
  return request({
    url: 'authServices/user',
    params,
    mode: 'auth',
    method: 'put'
  });
}
/**
 * 编辑用户
 * @param {*} data 
 */
export function updateUser (params) {
  return request({
    url: 'authServices/user',
    params,
    mode: 'auth',
    method: 'put'
  });
}
/**
 * 创建用户
 * @param {*} data 
 */
export function createUser (params) {
  return request({
    url: 'authServices/user',
    params,
    mode: 'auth',
    method: 'post'
  });
}
/**
 * 获取用户组
 * @param {*} data 
 */
export function getUserGroups (params) {
  return request({
    url: 'authServices/userGroups',
    params,
    mode: 'auth',
    method: 'get'
  });
}
/**
 * 创建用户组
 * @param {*} data 
 */
export function createUserGroups (params) {
  return request({
    url: 'authServices/userGroup',
    params,
    mode: 'auth',
    method: 'post'
  });
}
/**
 * 编辑用户组
 * @param {*} data 
 */
export function updateUserGroups (params) {
  return request({
    url: 'authServices/userGroup',
    params,
    mode: 'auth',
    method: 'put'
  });
}
/**
 * 判断用户组名称是否重复
 * @param {*} data 
 */
export function judgeUserGroup (data) {
  return request({
    url: 'authServices/userGroupRename',
    params: data,
    mode: 'auth',
    method: 'get'
  });
}
/**
 * 删除用户组
 * @param {*} data 
 */
export function delUserGroup (params) {
  return request({
    url: 'authServices/userGroup/' + params.uid,
    mode: 'auth',
    method: 'delete'
  });
}
/**
 * 添加所选成员
 * @param {*} data 
 */
export function addMemberInfo (params) {
  return request({
    url: 'authServices/userGroupBatch',
    params,
    mode: 'auth',
    method: 'post'
  });
}
/**
 * 删除所选成员
 * @param {*} data 
 */
export function delMemberInfo (params) {
  return request({
    url: 'authServices/userGroupBatch',
    params,
    mode: 'auth',
    method: 'delete'
  });
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
 * copyPortrait 批量复制人像到别的分组
 * @param {object} data
 */
export function copyPortrait(data) {
  return request({
    url: '/surveillanceRepertory/portrait/group/copy/batch',
    method: 'post',
    data,
    mode: ''
  })
}
/**
 * removePortrait 批量移出人像到别的分组
 * @param {object} data
 */
export function removePortrait(data) {
  return request({
    url: '/surveillanceRepertory/portrait/group/delete/batch',
    method: 'delete',
    data,
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
 * putVehicle 修改车像
 * @param {object} data
 */
export function putVehicle(data) {
  return request({
    url: '/surveillanceRepertory/vehicle',
    method: 'put',
    data,
    mode: ''
  })
}
/**
 * copyVehicle 批量复制车像到别的分组
 * @param {object} data
 */
export function copyVehicle(data) {
  return request({
    url: '/surveillanceRepertory/vehicle/group/copy/batch',
    method: 'post',
    data,
    mode: ''
  })
}
/**
 * removeVehicle 批量移出车像到别的分组
 * @param {object} data
 */
export function removeVehicle(data) {
  return request({
    url: '/surveillanceRepertory/vehicle/group/delete/batch',
    method: 'delete',
    data,
    mode: ''
  })
}
/* ========== 布控管理 ========== */
/**
 * addControl 新增布控
 * @param {object} data
 */
export function addControl(data) {
  return request({
    url: '/surveillance',
    method: 'post',
    data,
    mode: ''
  })
}
/**
 * getControlInfoByName 通过布控名称获取布控信息
 * @param {object} params
 */
export function getControlInfoByName(params) {
  return request({
    url: '/surveillance/byName',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getControlList 布控列表分页查询接口
 * @param {object} params
 */
export function getControlList(params) {
  return request({
    url: '/surveillance/page',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getControlObject 获取所有布控对象
 * @param {object} params
 */
export function getControlObject(params) {
  return request({
    url: '/surveillance/object',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getControlDevice 获取所有布控设备
 * @param {object} params
 */
export function getControlDevice(params) {
  return request({
    url: '/surveillance/device',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getControlDetail 布控详情查询接口
 * @param {object} params
 */
export function getControlDetail(uid) {
  return request({
    url: '/surveillance/detail/' + uid,
    method: 'get',
    mode: ''
  })
}
/**
 * getControlDetailIsEditor 编辑时根据标识获取所有布控信息
 * @param {object} params
 */
export function getControlDetailIsEditor(uid) {
  return request({
    url: '/surveillance/beforeUpdate/' + uid,
    method: 'get',
    mode: ''
  })
}
/**
 * putControl 编辑布控
 * @param {object} data
 */
export function putControl(data) {
  return request({
    url: '/surveillance',
    method: 'put',
    data,
    mode: ''
  })
}
/**
 * getControlObjList 布控对象列表分页查询
 * @param {object} params
 */
export function getControlObjList(params) {
  return request({
    url: '/surveillance/object/page',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * delControl 删除布控
 * @param {object} params
 */
export function delControl(uid) {
  return request({
    url: '/surveillance/' + uid,
    method: 'delete',
    mode: ''
  })
}
/**
 * controlArea 布控范围
 * @param {object} params
 */
export function controlArea(uid) {
  return request({
    url: '/surveillance/area/' + uid,
    method: 'get',
    mode: ''
  })
}
/**
 * controlStop 终止布控
 * @param {object} params
 */
export function controlStop(data) {
  return request({
    url: '/surveillance/stop/' + data.uid,
    method: 'put',
    data,
    mode: ''
  })
}
/**
 * repertorySel 从库中选择
 * @param {object} params
 */
export function repertorySel(params) {
  return request({
    url: '/surveillance/repertory',
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
    url: '/controlMap',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getControlMapByDevice 设备下布控列表查询接口
 * @param {object} params
 */
export function getControlMapByDevice(params) {
  return request({
    url: '/controlMap/byDevice',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getAlarmSnap 布控抓拍结果分页查询列表
 * @param {object} params
 */
export function getAlarmSnap(params) {
  return request({
    url: '/surveillance/alarmSnap/page',
    method: 'get',
    params,
    mode: ''
  })
}
/**
 * getEventDetailById 通过事件id查询事件详情
 * @param {object} params
 */
export function getEventDetailById(uid) {
  return request({
    url: '/api/emi/eventServices/events/' + uid,
    method: 'get',
    mode: ''
  })
}
