/*
 * axios定义
 * */
import Vue from 'vue';
import axios from 'axios';
import ElementUI from 'element-ui';
// import store from '@/store/store.js';
import { ajaxCtx } from '@/config/config.js';
import store from '@/store/store.js'
// axios支持跨域cookie
// axios.defaults.withCredentials = true;
// create an axios instance
let service = axios.create({
  baseURL: ajaxCtx.base, // api的base_url
  timeout: 30000, // request timeout
  withCredentials: true
})
/*
 * extData {
 *    timeout: 自定义超时时间，单位毫秒，默认为30000，
 *    errorMsg：自定义普通错误信息，默认为'网络繁忙，请稍后重试！'
 *    timeoutMsg：自定义超时错误信息，默认为'网络繁忙，请稍后重试！'，优先级大于errorMsg
 * }
 *  e.g. xxxx(params, extData).then()
 */
// axios添加一个请求拦截器
service.interceptors.request.use((config) => {
  // console.log('request config', config)
  if (config.extData && config.extData.timeout) { config.timeout = config.extData.timeout; }
  // 用户信息
  const userInfo = localStorage.getItem('as_vlink_user_info');
  // console.log(userInfo);
  if (userInfo) {
    config.headers['Auth-Session-Id'] = JSON.parse(userInfo).sessionId;
  }
  // 序列化的时候空格变+的问题
  // config.url = config.url.replace(/\+/g, '%20');
  // 模式，微服务
  if (config.mode && ajaxCtx[config.mode]) {  
    config.baseURL = ajaxCtx[config.mode];
  }
  let r = '_r=' + new Date().getTime();
  if (config.url.indexOf('?') > 0) {
    r = '&' + r;
  } else {
    r = '?' + r;
  }
  config.url = config.url + r;
  return config;
}, (error) => {
  console.log('地址：' + error.config.url + '请求失败！');
  return Promise.reject(error);
});
// axios添加一个响应拦截器
service.interceptors.response.use(function (response) {
  // console.log('response', response)
  if (response && response.data) {
    const contenType = response.headers['content-type'];
    let _data = response.data;
    if (_data.code === '00000000') {
      return _data;
    } else if (_data.code === '10060002') {
      store.commit('setLoginToken', {
        loginToken: false
      });
      return null;
      // 未登录
      // ElementUI.Message({ message: _data.viewMsg, type: 'error', customClass: 'request_tip' });
    } else if ( contenType === 'application/msexcel' || contenType === 'application/octet-stream;charset=UTF-8') {
      return _data;
    } else {
      let msg = '网络繁忙，请稍后重试！';
      if (_data.viewMsg) {
        msg = _data.viewMsg;
      }
      ElementUI.Message({ message: msg, type: 'error', customClass: 'request_tip' });
      return null;
    }
  } else {
    return null;
  }
}, function (error) {
  // 请求失败、错误处理回调
  // 默认请求错误信息
  let msg = '网络繁忙，请稍后重试！';
  if (error.config.extData) {
    if (error.config.extData.errorMsg) {
      // 自定义普通错误信息
      msg = error.config.extData.errorMsg;
    } else if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') != -1 && error.config.extData.timeoutMsg) {
      // 自定义超时错误信息
      msg = error.config.extData.timeoutMsg;
    }
  }
  ElementUI.Message({ message: msg, type: 'error', customClass: 'request_tip' });
  return Promise.reject(error);
});
Vue.prototype.axios = service;
export default service
