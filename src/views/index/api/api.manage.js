import request from '@/config/axios';

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
 * 获取用户详细信息
 * @param {*} data
 */
export function getAuthUserDetail (params) {
  return request({
    url: 'authServices/users/userDetailInfo',
    params,
    mode: 'auth',
    method: 'get'
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
 * 删除分组
 * @param {*} data
 */
export function delGroup (uid) {
  return request({
    url: '/groups/' + uid,
    method: 'delete'
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
 * 获取所有分组及分组下的设备
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
 * 获取当前分组下的设备列表
 * @param {*} data
 */
export function getCurrentDevices (params) {
  return request({
    url: '/group-device-service/devices',
    params,
    method: 'get'
  });
}
/**
 * 获取所有的分组
 * @param {*} data
 */
export function getAllGroups (params) {
  return request({
    url: '/groups',
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
/**
 * 修改分组
 * @param {*} data
 */
export function updateGroupDevice (data) {
  return request({
    url: '/group-device-service/group-info',
    method: 'put',
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

/**
 * 区域信息分层查询接口
 * @param {*} data
 */
export function getAreaList (pid) {
  return request({
    url: 'area-service/area-list/'+ pid,
    mode: 'user',
    method: 'get'
  });
}

/**********************特殊车辆管理*************************** */
/**
 * 获取特殊车辆分组
 * @param {*} data
 */
export function getSpecialGroup () {
  return request({
    url: '/special-vehicle/groups',
    method: 'get'
  });
}
/**
 * 新增特殊车辆
 * @param {*} data
 */
export function addSpecialVehicle (data) {
  return request({
    url: '/special-vehicle',
    data,
    method: 'post'
  });
}
/**
 * 修改特殊车辆
 * @param {*} data
 */
export function editSpecialVehicle (data) {
  return request({
    url: '/special-vehicle',
    data,
    method: 'put'
  });
}
/**
 * 获取特殊车辆详情
 * @param {*} data
 */
export function getSpecialVehicleDetail (uid) {
  return request({
    url: '/special-vehicle/' + uid,
    method: 'get'
  });
}
/**
 * 获取特殊车辆列表
 * @param {*} data
 */
export function getSpecialVehicleList (params) {
  return request({
    url: '/special-vehicles',
    params,
    method: 'get'
  });
}
/**
 * 根据车牌号获取车辆信息
 * @param {*} data
 */
export function getReVehicleInfo (params) {
  return request({
    url: '/vehicle-special/vehicle',
    params,
    method: 'get'
  });
}
/**
 * 验证特殊组是否重名
 * @param {*} data
 */
export function checkRename (params) {
  return request({
    url: '/vehicle-special-group/rename',
    params,
    method: 'get'
  });
}
/**
 * 特殊车辆导入
 * @param {*} data
 */
export function vehicleImport (params) {
  return request({
    url: '/special-vehicle/import',
    data: params,
    method: 'post'
  });
}
/**
 * 特殊车辆导出
 * @param {*} data
 */
export function vehicleExport (params) {
  return request({
    url: '/excel-service/export',
    data: params,
    method: 'post'
  });
}
/**
 * 车辆品牌数据获取
 * @param {*} data
 */
export function getVehicleBrand (params) {
  return request({
    url: '/vehicle-dict/brands',
    params,
    method: 'get'
  });
}
/**
 * 车辆型号数据获取
 * @param {*} data
 */
export function getVehicleModel (brands) {
  return request({
    url: '/vehicle-dict/' + brands + '/types',
    method: 'get'
  });
}
  