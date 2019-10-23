/*
 * vue全局方法
 */
import Vue from 'vue';
import ElementUI from 'element-ui';
/*
 * 消息提示全局方法
 * @param {string} msg 消息提示内容
 * @param {string} type 主题 success/warning/info/error
 * */
Vue.prototype.$MyMessage = function (msg, type) { 
  if (!type) { type = 'info'; } 
  let nMsg = $('.el-message--' + type);
  if (nMsg && nMsg.length > 0) {
    nMsg.find('.el-message__content').text(msg);
  } else {
    ElementUI.Message({
      message: msg,
      type: type
    });
  }
}
Vue.prototype.Bus = new Vue();
/*
 * 获取字符串长度
 * @param {string} str 字符串
 * @param {int} clen 中文所占字节，默认为2
 * */
Vue.prototype.strLen = function (str, clen) {
  if (!clen) { clen = 2; }
  let ilt = 0;
  if (str && str.length > 0) {
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
        ilt += clen;
      } else {
        ilt += 1;
      }
    }
  }
  return ilt;
};
/*
 * 截取字符串
 * @param {string} str 字符串
 * @param {int} len 需要截取的长度
 * @param {int} clen 中文所占字节，默认为2
 * @param {string} siff 结尾，默认为"..."
 * */
Vue.prototype.strCutWithLen = function (str, len, clen, siff) {
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
};
/**
 * 去掉字符前后中间所有空格
 */
Vue.prototype.Trim = function (str, isGlobal) {
  if (str === null) {
    return false;
  }
  let result;
  result = str.replace(/(^\s+)|(\s+$)/g, '');
  if (isGlobal.toLowerCase() === 'g') {
    result = result.replace(/\s/g, '');
  }
  return result;
};