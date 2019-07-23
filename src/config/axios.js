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
// axios添加一个请求拦截器
service.interceptors.request.use((config) => {
  // 用户信息
  const userInfo = localStorage.getItem('as_vlink_user_info');
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
      // store.commit('setLoginToken', {
      //   loginToken: false
      // });
      // return null;
      // 未登录
      // ElementUI.Message({ message: _data.viewMsg, type: 'error', customClass: 'request_tip' });
    } else if ( contenType === 'application/msexcel') {
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
  let msg = '网络繁忙，请稍后重试！';
  ElementUI.Message({ message: msg, type: 'error', customClass: 'request_tip' });
  return Promise.reject(error);
});
Vue.prototype.axios = service;
export default service
