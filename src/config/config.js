/*
 * API
 * dev: 开发环境    test: 测试环境    prod: 生产环境
 * */
const oDomains = {
    // 默认ajax地址
    base: {
      // dev: 'http://apidev.aorise.org/vlink-base',
        dev: 'http://apidev.aorise.org/vlink-base',
        // dev: 'http://10.116.64.92:8081',//钟赞
        test: 'http://emi.aorise.org/api/vis/',
        prod: 'http://emi.aorise.org/api/vis/'
        // dev: 'http://apidev.assorise.org/vlink-base',
        // dev: 'http://10.116.64.142:8083',
        // // dev: 'http://10.116.64.92:8081',//钟赞
        // test: 'http://emi.aorise.org/api/vis/',
        // prod: 'http://emi.aorise.org/api/vis/'
    },
    // 事件部分地址
    event: {
      // dev: 'http://apidev.aorise.org/vlink-event/api/vlink',
      dev: 'http://10.116.64.134:8082/',
      test: 'http://apirel.aorise.org/vlink-event/api/vlink',
      prod: 'http://apidev.aorise.org/vlink-event/api/vlink'
    },
    // 上传图片
    upload: {
        dev: 'http://apidev.aorise.org/education-user-related',
        test: 'http://apirel.aorise.org/education-user-related',
        prod: 'http://apidev.aorise.org/education-user-related'
    },
    // 研判检索服务
    judge: {
        // dev: 'http://10.116.64.127:8082/',
        dev: 'http://apidev.aorise.org/vlink-judge/',
        test: 'http://apirel.aorise.org/vlink-judge/',
        prod: 'http://apidev.aorise.org/vlink-judge/',
    },
    // 调度和预案部分地址
    ctc: {
      // dev: 'http://apidev.aorise.org/vlink-dispatching/api/vlink',
      dev: 'http://10.116.64.134:8081/api/vlink',
      test: 'http://apirel.aorise.org/vlink-dispatching',
      prod: 'http://apidev.aorise.org/vlink-dispatching'
    },
    // 用户登录地址
    user: {
      // dev: 'http://10.116.64.142:8082', // 江先琨
      dev: 'http://apidev.aorise.org/vlink-user',
      test: 'http://apidev.aorise.org/vlink-user',
      prod: 'http://apidev.aorise.org/vlink-user'
    },
    // 用户权限地址
    auth: {
      // dev: 'http://10.116.64.142:8081/api/auth/', // 江先琨
      dev: 'http://apidev.aorise.org/vlink-auth/api/auth/',
      test: 'http://apidev.aorise.org/vlink-auth/api/auth/',
      prod: 'http://apidev.aorise.org/vlink-auth/api/auth/'
    },
    // 视频播放服务
    video: {
      // dev: 'http://apidev.aorise.org/vlink-monitor',
      dev: 'http://10.116.64.138:8082',
      test: 'http://apidev.aorise.org/vlink-monitor',
      prod: 'http://apidev.aorise.org/vlink-monitor',
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
