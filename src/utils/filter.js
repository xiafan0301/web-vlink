// 全局过滤器
import Vue from 'vue';
import {formatDate} from './util.js';
/*
 * 求百分比
 * */
Vue.filter('fnPercent', function (val, total) {
  if (isNaN(val) || isNaN(total)) { return ''; }
  return Math.round(val / total * 100) + '%';
});
/*
 * 时间戳处理
 * */
Vue.filter('fmTimestamp', function (timestamp, fm) {
  return formatDate(timestamp, fm);
});
/*
 * 数量处理
 * @param {int} number 熟练
 * @param {string} currency 单位
 * */
Vue.filter('fmTenThousand', function (number, currency) {
  if (isNaN(number)) { return 0; }
  if (number < 10000) { return number; }
  if (!currency) { currency = '万'; }
  number = Math.round((number / 10000) * 100) / 100;
  number = number + currency;
  return number;
});
/*
 * 截取字符串
 * @param {string} str 字符串
 * @param {int} len 需要截取的长度
 * @param {int} clen 中文所占字节，默认为2
 * @param {string} siff 结尾，默认为"..."
 * */
Vue.filter('strCutWithLen', function (str, len, clen, siff) {
  if (!clen) { clen = 2; }
  if (!siff) { siff = '...'; }
  let ilt = 0, idx = 0, srtn = '';
  if (str && str.length > 0) {
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
        ilt += clen;
      } else {
        ilt += 1;
      }
      if (ilt >= len) {
        idx = i - 1;
        break;
      }
    }
    if (idx > 0) {
      srtn = str.substring(0, idx) + siff;
    } else {
      srtn = str;
    }
  }
  return srtn;
});
/*
 * 手机号安全处理
 * @param {int|string} mobile 手机号
 * */
Vue.filter('mobileSecurity', function (mobile) {
  if (mobile && mobile > 0) {
    if (!mobile || mobile.length < 7) { return mobile; }
    mobile = mobile + '';
    if (mobile.length > 7) {
      let str = '';
      str = mobile.substring(0, 3);
      for (let i = 0; i < mobile.length - 7; i++) {
        str += '*';
      }
      str += mobile.substring(mobile.length - 4, mobile.length);
      return str;
    }
  }
  return mobile;
});
