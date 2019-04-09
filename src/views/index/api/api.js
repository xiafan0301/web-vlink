import request from '@/config/axios';

/**
 * 用户登录
 * @param {*} data
 */
export function login(data) {
  return request({
    url: '/user-service/login',
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
    url: '/user-service/logout/' + data.userMobile,
    params: data,
    mode: 'user',
    method: 'get'
  });
}
/**
 * 获取短信验证码
 * @param {*} data 
 */
export function getCode(data) {
  return request({
    url: '/user-service/sms/code',
    data,
    mode: 'user',
    method: 'post'
  });
}
/**
 * 校验短信验证码
 * @param {*} data 
 */
export function checkCode(data) {
  return request({
    url: '/user-service/sms/code',
    params: data,
    mode: 'user',
    method: 'get'
  });
}
/**
 * 重置密码
 * @param {*} data 
 */
export function resetPassword(data) {
  return request({
    url: '/user-service/forget-pwd',
    data,
    mode: 'user',
    method: 'put'
  });
}
/**
 * 判断用户是否注册
 * @param {*} data
 */
export function isRegister(data) {
  return request({
    url: '/user-service/check-user-mobile/' + data.userMobile,
    params: data,
    mode: 'user',
    method: 'get'
  });
}
/**
 * 修改密码
 * @param {*} data 
 */
export function updatePwd(data) {
  return request({
    url: '/user-service/user-password',
    data,
    mode: 'user',
    method: 'put'
  });
}
/**
 * 字典接口
 * @param {*} data
 */
export function getDiciData(uid) {
  return request({
    url: 'dict-service/dict-list/?pid=' + uid,
    method: 'get'
  });
}
/*=================事件管理模块================== */
/**
 * 是否开启自动审核政务人员
 * @param {*} data 
 */
export function openAutoCheck(data) {
  return request({
    url: 'dict-service/update',
    method: 'put',
    data,
  });
}
/**
 * 获取事件列表数据
 * @param {*} data
 */
export function getEventList(data) {
  return request({
    url: 'events/page',
    method: 'get',
    params: data,
    mode: 'event'
  });
}
/**
 * 修改事件
 */
export function updateEvent(data) {
  return request({
    url: 'events/update',
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
    url: 'events',
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
    url: 'events/' + uid,
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
    url: 'events/page',
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
    url: 'plan-services/plans',
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
    url: 'plan-services/plans/' + uid,
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
    url: 'plan-services/plan',
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
    url: 'plan-services/plans',
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
    url: 'plan-services/plans/' + uid,
    method: 'delete',
    mode: 'ctc'
  });
}
/**
 * 分页获取调度任务
 * @param {*} data
 */
export function getCtcData(data) {
  return request({
    url: 'task-services/tasks',
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
    url: 'task-services/task/' + uid,
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
    url: 'task-services/task/process/' + uid,
    method: 'put',
    data,
    mode: 'ctc'
  });
}
/**
 * 添加调度任务
 * @param {*} data 
 */
export function addTaskInfo(data, uid) {
  return request({
    url: 'task-services/task/' + uid,
    method: 'post',
    data,
    mode: 'ctc'
  });
}
/**
 * 结束调度--结束事件
 * @param {*} data 
 */
export function endEvent(data, uid) {
  return request({
    url: 'events/finish/' + uid,
    method: 'put',
    data,
    mode: 'event'
  });
}
/** ===== 事件统计分析 ====== */
/**
 * 事件总体情况统计
 * @param {*} data
 */
export function getGeneralcondition(data) {
  return request({
    url: 'eventCount/generalCondition',
    method: 'get',
    params: data,
    mode: 'event'
  });
}
/**
 * 事件等级分析
 * @param {*} data
 */
export function getRankAnalysis(data) {
  return request({
    url: 'eventCount/rankAnalysis',
    method: 'get',
    params: data,
    mode: 'event'
  });
}
/**
 * 事件类型分析
 * @param {*} data
 */
export function getTypeAnalysis(data) {
  return request({
    url: 'eventCount/typeAnalysis',
    method: 'get',
    params: data,
    mode: 'event'
  });
}
/**
 * 事件数量分析
 * @param {*} data
 */
export function getQuantitativeTrend(data) {
  return request({
    url: 'eventCount/quantitativeTrend',
    method: 'get',
    params: data,
    mode: 'event'
  });
}
/**
 * 事件高发地点分析
 * @param {*} data
 */
export function getHotLocation(data) {
  return request({
    url: 'eventCount/hotLocation',
    method: 'get',
    params: data,
    mode: 'event'
  });
}
/**
 * 事件布控统计分析
 * @param {*} data
 */
export function getSurveillance(data) {
  return request({
    url: 'eventCount/evtSurvStatistics',
    method: 'get',
    params: data,
    mode: 'event'
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
    url: 'user-service/user-info',
    data: data,
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
    url: 'user-service/user-info',
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
 * 判断用户角色是否重名
 * @param {*} data
 */
export function judgeRoleName (data) {
  return request({
    url: 'authServices/userRoleRename',
    params: data,
    mode: 'auth',
    method: 'get'
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
    url: '/vehicle-group/list',
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
    url: '/vehicle-bank/list',
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
    url: '/vehicle/info-page',
    params,
    method: 'get'
  });
}
/**
 * 新增分组
 * @param {*} data
 */
export function addGroup (data) {
  return request({
    url: '/groups',
    data,
    method: 'post'
  });
}
/**
 * 判断车辆新增分组组名是否重名
 * @param {*} data 
 */
export function checkVelRename (params) {
  return request({
    url: '/vehicle-group/rename',
    params,
    method: 'get'
  });
}
/**
 * 修改分组
 * @param {*} data
 */
export function editVeGroup (data) {
  return request({
    url: '/groups',
    data,
    method: 'put'
  });
}
/**
 * 管理车辆分组--删除车辆分组
 * @param {*} data
 */
export function delVeGroup (uid) {
  return request({
    url: '/vehicle-group/delete/' + uid,
    method: 'delete'
  });
}
/**
 * 管理车辆分组--获取车辆列表数据
 * @param {*} data
 */
export function getAdminVelList (params) {
  return request({
    url: '/vehicle/page',
    params,
    method: 'get'
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
/**
 * 管理车辆分组---移出分组
 * @param {*} data
 */
export function moveoutGroup (data) {
  return request({
    url: '/vehicle-group/batch-delete',
    params: data,
    method: 'delete'
  });
}
/**
 * 管理车辆分组---复制分组
 * @param {*} data
 */
export function copyGroup (data) {
  return request({
    url: '/vehicle-group/copy',
    data,
    method: 'post'
  });
}
/***======== 人员信息库 ========== */
/**
 * 底库列表查询
 * @param {*} data
 */
export function getPerBottomBankList (params) {
  return request({
    url: '/portrait/bottom-bank',
    params,
    method: 'get'
  });
}
/**
 * 分组列表查询
 * @param {*} data
 */
export function getPerGroupList (params) {
  return request({
    url: '/portrait/group',
    params,
    method: 'get'
  });
}
/**
 * 获取人员列表
 * @param {*} data 
 */
export function getPersonData (params) {
  return request({
    url: '/portrait/page',
    params,
    method: 'get'
  });
}
/**
 * 获取人员详细信息
 * @param {*} data 
 */
export function getPersonDetail (uid) {
  return request({
    url: '/user/details/' + uid,
    method: 'get'
  });
}
/**
 * 判断人员分组是否重复
 * @param {*} data 
 */
export function judgePerson (params) {
  return request({
    url: '/portrait-group/check-name',
    params,
    method: 'get'
  });
}
/**
 * 人员---复制到组
 * @param {*} data 
 */
export function copyPersonGroup (data) {
  return request({
    url: '/portrait/group/users',
    data,
    method: 'post'
  });
}
/**
 * 人员---新增分组同时将人员添加到组中
 * @param {*} data 
 */
export function addGroupCopyPerson (data) {
  return request({
    url: '/portrait-group/copy-group-member',
    data,
    method: 'post'
  });
}
/**
 * 人员---将人员移出分组
 * @param {*} data 
 */
export function moveoutPerson (data) {
  return request({
    url: '/portrait-group/batch-move',
    params: data,
    method: 'delete'
  });
}
/**
 * 人员---删除分组
 * @param {*} data 
 */
export function deletePersonGroup (uid, data) {
  return request({
    url: '/portrait-group/group/' + uid,
    params: data,
    method: 'delete'
  });
}
/*** =======================视频设置=========================== */
/**===== 自定义组 ===== */
/**
 * 获取所有分组
 * @param {*} data
 */
export function getCusGroup (params) {
  return request({
    url: '/group-device-service/groups-devices',
    params,
    method: 'get'
  });
}
/**
 * 获取所有设备列表
 * @param {*} data
 */
export function getAllDevices (params) {
  return request({
    url: '/area-device-service/areas-devices',
    params,
    method: 'get'
  });
}
/**
 * 删除分组设备
 * @param {*} data
 */
export function delGroupDevice (id) {
  return request({
    url: '/group-service/group-info/' + id,
    method: 'delete'
  });
}
/**
 * 新增分组
 * @param {*} data
 */
export function addGroupDevice (data) {
  return request({
    url: '/group-device-service/group-info',
    method: 'post',
    data
  });
}
/* ========== 设备授权 ========== */
/** ==== 临时授权 ==== */
/**
 * 点击用户获取可用设备
 * @param {*} data
 */
export function getTempDeviceList (data) {
  return request({
    url: '/dev-auth-temp-service/devices',
    method: 'get',
    params: data
  });
}
/**
 * 终止授权
 * @param {*} data
 */
export function stopTerminate (data) {
  return request({
    url: '/dev-auth-temp-service/terminate',
    method: 'delete',
    params: data
  });
}
/**
 * 单个设备终止授权
 * @param {*} data
 */
export function stopOneTerminate (data) {
  return request({
    url: '/dev-auth-temp-service/terminate/' + data.uid,
    method: 'delete',
    params: data
  });
}
/**
 * 新增临时授权---获取可用设备
 * @param {*} data
 */
export function getASelectDevice (data) {
  return request({
    url: '/dev-auth-temp-service/auth-devices',
    method: 'get',
    params: data
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
/*=================消息管理模块================== */
/**
 * addMutualHelp 新增民众互助接口
 * @param {object} params
 */
export function addMutualHelp(data) {
  return request({
    url: '/event-service/mutual-help',
    method: 'post',
    data,
    mode: 'message'
  })
}
/**
 * getMutualHelpDetail 民众互助详情查询接口  

 * @param {object} params
 */
export function getMutualHelpDetail(uid) {
  return request({
    url: '/event-service/mutual-help/' + uid,
    method: 'get',
    mode: 'message'
  })
}
/**
 * putMutualHelp 修改民众互助接口
 * @param {object} params
 */
export function putMutualHelp(data) {
  return request({
    url: '/event-service/mutual-help',
    method: 'put',
    data,
    mode: 'message'
  })
}
/**
 * replyComment 回复事件评论接口   
 * @param {object} params
 */
export function replyComment(data) {
  return request({
    url: '/event-service/reply-comment',
    method: 'post',
    data,
    mode: 'message'
  })
}
/**
 * shieldComment 屏蔽评论接口   
 * @param {object} params
 */
export function shieldComment(data) {
  return request({
    url: '/event-service/shield-comment',
    method: 'post',
    data,
    mode: 'message'
  })
}
/**
 * getMutualHelpList 民众互助列表分页查询接口
 * @param {object} params
 */
export function getMutualHelpList(params) {
  return request({
    url: '/event-service/mutual-help-list',
    method: 'get',
    params,
    mode: 'message'
  })
}
/**
 * getCommentInfoList 事件评论列表分页查询接口
 * @param {object} params
 */
export function getCommentInfoList(uid) {
  return request({
    url: '/event-service/comment-info-list/' + uid,
    method: 'get',
    mode: 'message'
  })
}
/**
 * addMsgNote 新增消息公告接口
 * @param {object} params
 */
export function addMsgNote(data) {
  return request({
    url: '/message-service/msg-note',
    method: 'post',
    data,
    mode: 'message'
  })
}
/**
 * getMsgNoteList 公告消息列表分页查询接口  
 * @param {object} params
 */
export function getMsgNoteList(params) {
  return request({
    url: '/message-service/msg-note-list',
    method: 'get',
    params,
    mode: 'message'
  })
}
/**
 * getMsgNoteDetail 消息公告详情查询接口
 * @param {object} params
 */
export function getMsgNoteDetail(uid) {
  return request({
    url: '/message-service/msg-note/' + uid,
    method: 'get',
    mode: 'message'
  })
}
/**
 * putMsgNote 修改消息公告接口    
 * @param {object} params
 */
export function putMsgNote(data) {
  return request({
    url: '/message-service/msg-note',
    method: 'put',
    data,
    mode: 'message'
  })
}
/**
 * sendMsg 发送短信消息接口     
 * @param {object} params
 */
export function sendMsg(data) {
  return request({
    url: '/message-service/send-msg',
    method: 'post',
    data,
    mode: 'message'
  })
}
/**
 * getOrganInfos 组织机构列表分页查询接口
 * @param {object} params
 */
export function getOrganInfos(params) {
  return request({
    url: '/authServices/organInfos',
    method: 'get',
    params,
    mode: 'auth'
  })
}
/**
 * getOrganUser 根据组织机构查人员分页接口   
 * @param {object} params
 */
export function getOrganUser(params) {
  return request({
    url: '/authServices/organ/user',
    method: 'get',
    params,
    mode: 'auth'
  })
}
/**
 * getSmsTemplate 通过项目类型查询短信模板列表分页查询接口
 * @param {object} params
 */
export function getSmsTemplate(params) {
  return request({
    url: '/SmsController/news/v3/smsTemplate',
    method: 'get',
    params,
    mode: 'sms'
  })
}
/**
 * getSmsList 获取短信分页
 * @param {object} params
 */
export function getSmsList(params) {
  return request({
    url: '/SmsController/news/v3/msgRecord',
    method: 'get',
    params,
    mode: 'sms'
  })
}

/*--------------------------  研判start  ---------------------------------*/
/**
 * JtcPOSTAppendixInfo 指定记录上传附件
 * @param {object} params
 */
export function JtcPOSTAppendixInfo(data) {
  return request({
    url: '/appendixes',
    method: 'post',
    data,
    mode: 'judge'
  })
}
/**
 * JtcGETAppendixInfoList 历史上传图片
 * @param {object} params
 */
export function JtcGETAppendixInfoList(params) {
  return request({
    url: '/appendixes/page',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JtcPUTAppendixsOrder 附件信息更新接口
 * @param {object} params
 */
export function JtcPUTAppendixsOrder(params) {
  return request({
    url: '/appendixes',
    method: 'put',
    params: params,
    mode: 'judge'
  })
}
/**
 * JtcGETTrail 布控抓拍结果图片检索接口
 * @param {object} params
 */
export function JtcGETTrail(params) {
  return request({
    url: '/structures',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JigGETEvent 事件编号查询列表接口
 * @param {object} params
 */
export function JigGETEvent(params) {
  return request({
    url: '/events/page',
    method: 'get',
    params: params,
    mode: 'event'
  })
}
/**
 * JigGETEventAlarm 事件侦查检索接口
 * @param {object} params
 */
export function JigGETEventAlarm(params) {
  return request({
    url: '/events/' + params.eventId + '/alarm-snaps',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JigGETAlarmSnapList 设备抓拍结果列表接口
 * @param {object} params
 */
export function JigGETAlarmSnapList(params) {
  return request({
    url: '/surveillances/' + params.surveillanceId + '/alarm-snaps',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JfoGETGroup 分组列表查询接口
 * @param {object} params
 */
export function JfoGETGroup(params) {
  return request({
    url: '/group',
    method: 'get',
    params: params,
    mode: 'base'
  })
}
/**
 * JfoGETSurveillanceObject 布控范围内监控设备列表查询接口
 * @param {object} params
 */
export function JfoGETSurveillanceObject(params) {
  return request({
    url: '/alarm-snaps/by-group',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JfoGETEventList 事件列表查询接口
 * @param {object} params
 */
export function JfoGETEventList(params) {
  return request({
    url: '/events/by-surveillance',
    method: 'get',
    params: params,
    mode: 'event'
  })
}
/**
 * JhaGETStatisicByAddress 高危人员抓拍区域统计接口
 * @param {object} params
 */
export function JhaGETStatisicByAddress(params) {
  return request({
    url: '/alarm-snaps/by-address',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JhaGETAlarmSnapByAddress 高危人员抓拍结果列表查询接口
 * @param {object} params
 */
export function JhaGETAlarmSnapByAddress(params) {
  return request({
    url: '/devices/' + params.deviceId + '/alarm-snaps',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/*--------------------------  研判end  ---------------------------------*/
/*--------------------------  检索start  ---------------------------------*/
/**
 * ScpGETPortraitInfo 人像检索接口
 * @param {object} params
 */
export function ScpGETPortraitInfo(params) {
  return request({
    url: '/portrait-structures/page',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * ScpGETstrucInfoList 抓拍检索列表接口
 * @param {object} params
 */
export function ScpGETstrucInfoList(params) {
  return request({
    url: '/structures/page',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * ScpGETbasePortraitInfo 信息库人员查询接口
 * @param {object} params
 */
export function ScpGETbasePortraitInfo(params) {
  return request({
    url: '/portraits/by-idno',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * ScpGETportraitCmpInfo 人像比对接口
 * @param {object} params
 */
export function ScpGETportraitCmpInfo(params) {
  return request({
    url: '/portrait-structures/compare',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * ScpGETretrievalHisList 历史检索记录查询接口
 * @param {object} params
 */
export function ScpGETretrievalHisList(params) {
  return request({
    url: '/retrieval-histories/page',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * ScpGETretrievalHisById 历史检索记录详情查询接口
 * @param {object} params
 */
export function ScpGETretrievalHisById(params) {
  return request({
    url: '/retrieval-histories/' + params,
    method: 'get',
    mode: 'judge'
  })
}
/**
 * ScpGETdeviceListById
 通过用户id查询监控设备列表
 * @param {object} params
 */
export function ScpGETdeviceListById(params) {
  return request({
    url: '/device-service/device-list',
    method: 'get',
    mode: 'base',
    params: params
  })
}
/*--------------------------  检索end  ---------------------------------*/
