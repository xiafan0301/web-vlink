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
 * 预览预案
 * @param {*} data
 */
export function previewPlan(uid) {
  return request({
    url: 'plan-services/plans/' + uid,
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
    url: 'event-count-services/generalCondition',
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
    url: 'event-count-services/rankAnalysis',
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
    url: 'event-count-services/typeAnalysis',
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
    url: 'event-count-services/quantitativeTrend',
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
    url: 'event-count-services/hotLocation',
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
    url: 'event-count-services/surveillance',
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
 * 车辆--新增分组
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
 * 管理车辆分组---修改车辆分组
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
export function MapPOSTmapSign(params) {
  return request({
    url: '/mapSignService/map-sign',
    method: 'post',
    mode: 'base',
    params: params
  })
}
/**
 * MapDELETEmapSign
 删除地图标注
 * @param {} params
 */
export function MapDELETEmapSign(params) {
  return request({
    url: '/mapSignService/map-sign',
    method: 'delete',
    mode: 'base',
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
    url: '/videoService/signList',
    method: 'get',
    mode: 'base',
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
/*--------------------------  地图end  ---------------------------------*/