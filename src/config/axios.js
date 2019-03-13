/*
 * axios定义
 * */
import Vue from 'vue/dist/vue.js';
import axios from 'axios';
import ElementUI from 'element-ui';
// import store from '@/store/store.js';
import { ajaxCtx } from '@/config/config.js';
// axios支持跨域cookie
// axios.defaults.withCredentials = true;
// create an axios instance
const service = axios.create({
	baseURL: ajaxCtx.base, // api的base_url
	timeout: 30000, // request timeout
  withCredentials: true
})
// axios添加一个请求拦截器
service.interceptors.request.use((config) => {
  // console.log('axios request config', config);
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
Vue.prototype.axios = service;
export default service
