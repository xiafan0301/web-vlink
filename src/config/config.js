/*
 * API
 * dev: 开发环境    test: 测试环境    prod: 生产环境
 * */
const oDomains = {
    // 默认ajax地址
    base: {
        dev: 'http://apidev.aorise.org/vlink-base',
        // dev: 'http://10.116.64.92:8081',//钟赞
        test: 'http://emi.aorise.org/api/vis/',
        prod: 'http://emi.aorise.org/api/vis/'
    },
    // 事件部分地址
    event: {
      // dev: 'http://apidev.aorise.org/vlink-event/api/emi',
      dev: 'http://10.116.64.134:8081/api/emi',
      test: 'http://apirel.aorise.org/vlink-event/api/emi',
      prod: 'http://apidev.aorise.org/vlink-event/api/emi'
    },
    // 调度和预案部分地址
    ctc: {
      // dev: 'http://apidev.aorise.org/vlink-dispatching/api/emi',
      dev: 'http://10.116.64.134:8082/api/emi',
      test: 'http://apirel.aorise.org/vlink-dispatching',
      prod: 'http://apidev.aorise.org/vlink-dispatching'
    },
    // 应急指挥   : ecc
    ecc: {
        dev: 'http://apiemi.aorise.org/api/emi/',
        test: 'http://apiemi.aorise.org/api/emi/',
        prod: 'http://apiemi.aorise.org/api/emi/'
    },
    // 上传图片
    upload: {
        dev: 'http://apidev.aorise.org/education-user-related',
        test: 'http://apirel.aorise.org/education-user-related',
        prod: 'http://apirel.aorise.org/education-user-related'
    }
};
let ENV_API = process.env.VUE_APP_API;
if (!ENV_API) { ENV_API = 'dev'; }
console.log('config.js env', ENV_API);
// ajax default
let ajaxCtx = {};
for (let _key in oDomains) {
    ajaxCtx[_key] = oDomains[_key][ENV_API]
}
// console.log('*****oDomains*****', ajaxCtx);
export {ajaxCtx};

// cookie名
export const cookieUserId = 'AS.VLINK.USERID';
export const cookieUserName = 'AS.VLINK.USERNAME';
// cookie默认有效时间（小时）
export const cookieTime = 24;

// 高德地图 溆浦县 adcode
export const mapXupuxian = {
    adcode: '431224',
    name: '溆浦县',
    center: [110.685133, 27.907633]
};
