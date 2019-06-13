/*
 * API
 * dev: 开发环境    test: 测试环境    prod: 生产环境
 * */
const oDomains = {
    // 默认ajax地址
    base: {
        dev: 'http://apidev.aorise.org/vlink-base',
        // dev: 'http://10.116.64.107:8081',
        // dev: 'http://10.116.64.142:8082',
        // dev: 'http://10.116.66.29:8082',// 钟赞
        test: 'http://apirel.aorise.org/vlink-base',
        prod: 'http://apirel.aorise.org/vlink-base'
    },
    // 视频服务地址
    video: {
        dev: 'http://apidev.aorise.org/vlink-monitor',
        // dev: 'http://10.116.64.82:8082',
        test: 'http://apirel.aorise.org/vlink-monitor',
        prod: 'http://apirel.aorise.org/vlink-monitor',
    },
    // 布控部分地址
    control: {
        dev: 'http://apidev.aorise.org/vlink-control',
        // test: 'http://10.116.64.98:8081',//钟赞
        // dev: 'http://10.116.64.127:8081',//龙志海
        test: 'http://apirel.aorise.org/vlink-control',
        prod: 'http://apirel.aorise.org/vlink-control'
    },
    // 消息部分地址
    message: {
        dev: 'http://apidev.aorise.org/vlink-message',
        // dev: 'http://10.116.64.136:8081',//花艳玲
        // dev: 'http://10.116.64.142:8083',
        // dev: 'http://10.116.64.92:8081',//钟赞
        test: 'http://apirel.aorise.org/vlink-message',
        prod: 'http://apirel.aorise.org/vlink-message'
    },
    // 事件部分地址
    event: {
      dev: 'http://apidev.aorise.org/vlink-event',
      // dev: 'http://10.116.64.142:8081',
      test: 'http://apirel.aorise.org/vlink-event',
      prod: 'http://apirel.aorise.org/vlink-event'
    },
    // 研判检索服务
    judge: {
        // dev: 'http://10.116.64.127:8082/',
        dev: 'http://apidev.aorise.org/vlink-judge/',
        test: 'http://apirel.aorise.org/vlink-judge/',
        prod: 'http://apirel.aorise.org/vlink-judge/',
    },
    // 调度和预案部分地址
    ctc: {
      dev: 'http://apidev.aorise.org/vlink-dispatching/api/vlink',
      // dev: 'http://10.116.64.142:8083/api/vlink',
      // dev: 'http://10.116.64.127:8081/api/vlink',
      test: 'http://apirel.aorise.org/vlink-dispatching/api/vlink',
      prod: 'http://apirel.aorise.org/vlink-dispatching/api/vlink'
    },
    // 用户登录地址
    user: {
      // dev: 'http://10.116.64.107:8082', // 熊日成
      dev: 'http://apidev.aorise.org/vlink-user',
      test: 'http://apirel.aorise.org/vlink-user',
      prod: 'http://apirel.aorise.org/vlink-user'
    },
    // 用户权限地址
    auth: {
      dev: 'http://10.116.64.107:8081/api/auth/', // 江先琨
      // dev: 'http://apidev.aorise.org/vlink-auth/api/auth/',
      test: 'http://apirel.aorise.org/vlink-auth/api/auth/',
      prod: 'http://apirel.aorise.org/vlink-auth/api/auth/'
    },
    // 车辆地址
    vehicle: {
      // dev: 'http://10.116.64.107:8081',
      dev: 'http://apidev.aorise.org/vlink-vehicle',
      test: 'http://apirel.aorise.org/vlink-vehicle',
      prod: 'http://apirel.aorise.org/vlink-vehicle'
    },
    // 公共短信服务
    sms: {
      // dev: 'http://10.116.64.169:8085',
      dev: 'http://apidev.aorise.org/smart-city-common/',
      test: 'http://apirel.aorise.org/smart-city-common/',
      prod: 'http://apidev.aorise.org/smart-city-common/'
    },
    // 文件上传
    upload: {
        dev: 'http://apidev.aorise.org/vlink-base',
        test: 'http://apirel.aorise.org/vlink-base',
        prod: 'http://apirel.aorise.org/vlink-base'
    },
    // test-video服务
    live: {
      dev: 'http://apidev.aorise.org/vlink-link',
      test: 'http://apirel.aorise.org/vlink-link',
      prod: 'http://apidev.aorise.org/vlink-link'
    },
    // 视频播放服务 gis
    gis: {
      dev: 'http://apidev.aorise.org/vlink-gis',
      test: 'http://apirel.aorise.org/vlink-gis',
      prod: 'http://apidev.aorise.org/vlink-gis'
    }
};
let ENV_API = process.env.VUE_APP_API;
console.log(ENV_API)
if (!ENV_API) { ENV_API = 'dev'; }
console.log('config.js env', ENV_API);
// ajax default
let ajaxCtx = {};
for (let _key in oDomains) {
    ajaxCtx[_key] = oDomains[_key][ENV_API]
}
// console.log('*****oDomains*****', ajaxCtx);
export {ajaxCtx};

// 视频通讯相关配置
let _wsEnv = '';
if (ENV_API === 'dev') {
  _wsEnv = 'apidev'
} else {
  _wsEnv = 'apidev'
}
export const webrtcConfig = {
  wsUrl: 'ws://' + _wsEnv + '.aorise.org/visual-video/ws/signaling', // websocket地址
  turnUrl: '222.244.147.121:3479', // turn地址
  turnUsername: 'test', // turn name
  turnCredential: 'test', // turn credential
  // websocket 信息
  stompHeaders: {
    token: 'eee675aad8a64049894e10f9f65fe123',
    username: '',
    name: ''
  },
  // 信令
  apis: {
    message: '/user/topic/message', // 接收消息
    ping: '/user/topic/ping', // 接收心跳
    pong: '/signal/pong', // 发送心跳
    candidate: '/signal/candidate', // 候选
    offer: '/signal/offer', // offer
    refuse: '/signal/refuse', // 拒绝
    addrefuse: '/signal/addrefuse', // 拒绝
    answer: '/signal/answer', // 答应
    addanswer: '/signal/addanswer', // 答应
    remove: '/signal/remove', // 挂断
    leave: '/signal/leave', // 挂断
    change: '/signal/change' // 切换
  }
};

// cookie名
export const cookieUserId = 'AS.VLINK.USERID';
export const cookieUserName = 'AS.VLINK.USERNAME';
// cookie默认有效时间（小时）
export const cookieTime = 24;

// 高德地图 溆浦县 adcode
export const mapXupuxian = {
    adcode: '431224',
    name: '溆浦县',
    center: [110.594280, 27.908490]
};
