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
