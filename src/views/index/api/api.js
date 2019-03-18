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
 * 根据组织机构查人员
 * @param {*} data 
 */
export function getUserMember (data) {
  return request({
    url: 'authServices/organ/user',
    params: data,
    mode: 'auth',
    method: 'get'
  });
}
/**
 * 组织机构批量添加人员
 * @param {*} data 
 */
export function addUserMember (data) {
  return request({
    url: 'authServices/organ/user',
    data,
    mode: 'auth',
    method: 'post'
  });
}
/**
 * 组织机构批量删除人员
 * @param {*} data 
 */
export function delUserMember (data) {
  return request({
    url: 'authServices/organ/user',
    params: data,
    mode: 'auth',
    method: 'delete'
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
    url: 'authServices/users',
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
 * 删除用户
 * @param {*} data 
 */
export function delUser (params) {
  return request({
    url: 'authServices/user/' + params.uid + '?proKey=' + params.proKey,
    mode: 'auth',
    method: 'delete'
  });
}
/**
 * 重置密码
 * @param {*} data 
 */
export function resetPwd (data) {
  return request({
    url: 'authServices/users/user',
    mode: 'auth',
    data,
    method: 'put'
  });
}
/**
 * 启用/禁用用户
 * @param {*} data 
 */
export function isForceUser (data) {
  return request({
    url: 'authServices/user',
    data,
    mode: 'auth',
    method: 'put'
  });
}
/**
 * 编辑用户
 * @param {*} data 
 */
export function updateUser (data) {
  return request({
    url: 'userService/userInfo',
    data,
    mode: 'user',
    method: 'put'
  });
}
/**
 * 创建用户
 * @param {*} data 
 */
export function createUser (data) {
  return request({
    url: 'userService/userInfo',
    data,
    mode: 'user',
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
export function createUserGroups (data) {
  return request({
    url: 'authServices/userGroup',
    data,
    mode: 'auth',
    method: 'post'
  });
}
/**
 * 批量新增所选组
 * @param {*} data 
 */
export function addUserBatchGroups (data) {
  return request({
    url: 'authServices/userBatchGroup',
    data,
    mode: 'auth',
    method: 'post'
  });
}
/**
 * 批量新增所选角色
 * @param {*} data 
 */
export function addUserBatchRoles (data) {
  return request({
    url: 'authServices/userBatchRole',
    data,
    mode: 'auth',
    method: 'post'
  });
}
/**
 * 批量删除所选组
 * @param {*} data 
 */
export function delUserBatchGroups (data) {
  return request({
    url: 'authServices/userBatchGroup',
    data,
    mode: 'auth',
    method: 'delete'
  });
}
/**
 * 批量删除所选角色
 * @param {*} data 
 */
export function delUserBatchRoles (data) {
  return request({
    url: 'authServices/userBatchRole',
    data,
    mode: 'auth',
    method: 'delete'
  });
}
/**
 * 编辑用户组
 * @param {*} data 
 */
export function updateUserGroups (data) {
  return request({
    url: 'authServices/userGroup',
    data,
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
    url: 'authServices/userGroup/' + params.uid + '?proKey=' + params.proKey,
    mode: 'auth',
    method: 'delete'
  });
}
/**
 * 用户组批量添加所选用户成员
 * @param {*} data 
 */
export function addMemberInfo (data) {
  return request({
    url: 'authServices/userGroupBatch',
    data,
    mode: 'auth',
    method: 'post'
  });
}
/**
 * 用户组批量删除所选用户成员
 * @param {*} data 
 */
export function delMemberInfo (data) {
  return request({
    url: 'authServices/userGroupBatch',
    data,
    mode: 'auth',
    method: 'delete'
  });
}
/**
 * 用户组批量添加所选角色
 * @param {*} data 
 */
export function addUserGroupRoles (data) {
  return request({
    url: 'authServices/groupBatchRole',
    data,
    mode: 'auth',
    method: 'post'
  });
}
/**
 * 用户组批量删除所选角色
 * @param {*} data 
 */
export function delUserGroupRoles (data) {
  return request({
    url: 'authServices/groupBatchRole',
    data,
    mode: 'auth',
    method: 'delete'
  });
}
/**
 * 获取角色列表数据
 * @param {*} data 
 */
export function getRoleList (params) {
  return request({
    url: 'authServices/userRoles',
    params,
    mode: 'auth',
    method: 'get'
  });
}
/**
 * 创建角色
 * @param {*} data 
 */
export function createRole (data) {
  return request({
    url: 'authServices/userRole',
    data,
    mode: 'auth',
    method: 'post'
  });
}
/**
 * 编辑角色
 * @param {*} data 
 */
export function updateRole (data) {
  return request({
    url: 'authServices/userRole',
    data,
    mode: 'auth',
    method: 'post'
  });
}
/**
 * 删除角色
 * @param {*} data 
 */
export function delRole (data) {
  return request({
    url: 'authServices/userRole/' + data.uid + '?proKey=' + data.proKey,
    mode: 'auth',
    method: 'delete'
  });
}
/* ==========基础信息库============  */
/* 车辆信息库 *****/

/**
 * 获取车辆分组数据
 * @param {*} data 
 */
export function getVehicleGroup (params) {
  return request({
    url: '/vehicleGroup/list',
    params,
    method: 'get'
  });
}
/**
 * 获取车辆底库数据
 * @param {*} data 
 */
export function getVehicleBottomName (params) {
  return request({
    url: '/vehicleBank/list',
    params,
    method: 'get'
  });
}
/**
 * 获取车辆列表数据
 * @param {*} data 
 */
export function getVehicleDataList (params) {
  return request({
    url: '/vehicle/infoPage',
    params,
    method: 'get'
  });
}
/**
 * 车辆--新增分组
 * @param {*} data 
 */
export function addGroup (data) {
  return request({
    url: '/group',
    data,
    method: 'post'
  });
}
/**
 * 修改车辆分组
 * @param {*} data 
 */
export function editVeGroup (data) {
  return request({
    url: '/group',
    data,
    method: 'put'
  });
}
/**
 * 查询车辆详细信息
 * @param {*} data 
 */
export function getVehicleInfo (uid) {
  return request({
    url: '/vehicle/details/' + uid,
    method: 'get'
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
