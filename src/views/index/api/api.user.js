import request from '@/config/axios';

/* ======== 用户登录权限API ======== */
/**
 * sms code 登录-安全验证
 * @param {Object} data 接口入参
 */
export function smsCode(data) {
  return request({
    url: '/sms/code',
    method: 'post',
    data,
    params: null,
    mode: 'user'
  })
}
/**
 * userInfo 新增用户/用户注册
 * @param {Object} data 接口入参
 */
export function userInfo(data) {
  return request({
    url: '/userInfo',
    method: 'post',
    data,
    params: null,
    mode: 'user'
  })
}

/**
 * 用户登录
 * @param {*} data
 */
export function login(data) {
  return request({
    url: '/login',
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
    url: '/api/xl/logout' + data.uid,
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
 * 获取用户详情
 * @param {*} data 
 */
export function getUserDetail(uid) {
  return request({
    url: '/user-service/user/' + uid,
    mode: 'user',
    method: 'get'
  });
}
/**
 * 获取用户列表
 * @param {*} data 
 */
export function getUserList(data) {
  return request({
    url: '/user-service/user',
    params: data,
    mode: 'user',
    method: 'get'
  });
}
/**
 * 修改用户信息
 * @param {*} data 
 */
export function updateUserInfo(data) {
  return request({
    url: '/user-service/user',
    data,
    mode: 'user',
    method: 'put'
  });
}
/**
 * 删除用户信息
 * @param {*} data 
 */
export function delUser(data) {
  return request({
    url: '/user-service/user',
    params: data,
    mode: 'user',
    method: 'delete'
  });
}
/**
 * 获取所有省市区县信息
 * @param {*} data 
 */
export function getAreaList(pid) {
  return request({
    url: '/area-service/area-list/'+ pid,
    mode: 'user',
    method: 'get'
  });
}
