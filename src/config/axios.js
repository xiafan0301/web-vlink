/*
 * axios定义
 * */
import Vue from 'vue/dist/vue.js';
import axios from 'axios';
import ElementUI from 'element-ui';
// import store from '@/store/store.js';
import { ajaxCtx } from '@/config/config.js';
// axios支持跨域cookie
axios.defaults.withCredentials = true;
// axios添加一个请求拦截器u
axios.interceptors.request.use((config) => {
  if (config.url.indexOf('http') !== 0 && config.url.indexOf('https') !== 0) {
    if (config.url.indexOf('@user/') === 0 || config.url.indexOf('/@user/') === 0) {
      config.url = ajaxCtx.domain_user + config.url.substring(3);
    } else {
      config.url = ajaxCtx.domain + config.url;
    }
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
axios.interceptors.response.use(function (response) {
  // console.log('response', response)
  if (response && response.data) {
    let _data = response.data;
    if (_data.code === '00000000') {
      return _data;
    } else {
      let msg = '访问出错';
      if (_data.viewMsg) {
        msg = _data.viewMsg;
      }
      ElementUI.Message({ message: msg, type: 'error' });
      return null;
    }
  } else {
    return null;
  }
}, function (error) {
  let errorMsg = '<span style="font-weight: bold; font-size: 13px; display: inline-block; padding-bottom: 5px;">请求失败</span><br/>' +
    '<span>请刷新页面重新操作，如果问题依旧存在，请联系管理员</span>';
  // 提示
  ElementUI.Message({
    message: errorMsg,
    dangerouslyUseHTMLString: true,
    type: 'error'
  });
  return Promise.reject(error);
});
Vue.prototype.axios = axios;
