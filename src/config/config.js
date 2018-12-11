// ctx
export const ctx = process.env.VUE_APP_PROJECTNAME;
/*
 * API
 * dev: 开发环境    test: 测试环境    prod: 生产环境
 * */
const oDomains = {
    // ajax地址
    domain: {
        dev: 'http://localhost:8080/api/vis/',
        test: 'http://10.16.4.18:8080/api/vis/',
        prod: 'http://10.16.4.18:8080/api/vis/'
    },
    // 用户服务 url以 @user/开头
    domain_user: {
        dev: 'http://10.16.2.88:8443/api/user/',
        test: 'http://10.16.2.88:8443/api/user/',
        prod: 'http://10.16.2.88:8443/api/user/'
    },
    // websocket地址
    domain_ws: {
        dev: 'ws://10.16.2.88:8443',
        test: 'ws://10.16.2.88:8443',
        prod: 'ws://10.16.2.88:8443'
    },
    // 文件/图片/CDN地址
    domain_file: {
        dev: 'http://swift.aorise.org:8090/v1/AUTH_a415edee1cbd404795977372009b51dd/travel-pub',
        test: 'http://swift.aorise.org:8090/v1/AUTH_a415edee1cbd404795977372009b51dd/travel-pub',
        prod: 'http://swift.aorise.org:8090/v1/AUTH_a415edee1cbd404795977372009b51dd/travel-pub'
    },
    // 上传地址
    domain_upload: {
        dev: 'http://10.16.4.50:8084',
        test: 'http://10.16.4.50:8084',
        prod: 'http://10.16.4.50:8084'
    }
};
let ENV_API = process.env.VUE_APP_API;
if (!ENV_API) { ENV_API = 'test'; }
console.log('config.js env', ENV_API);
// ajax default
export const ajaxCtx = {
    domain: oDomains.domain[ENV_API],
    domain_user: oDomains.domain_user[ENV_API],
    domain_ws: oDomains.domain_ws[ENV_API],
    domain_file: oDomains.domain_file[ENV_API],
    domain_upload: oDomains.domain_upload[ENV_API]
};

// cookie名
export const cookieUserId = 'sc.web.user_id';
export const cookieUserName = 'sc.web.user_name';
// cookie默认有效时间（小时）
export const cookieTime = 24;

// 高德地图 溆浦县 adcode
export const mapXupuxian = {
    adcode: '431224',
    name: '溆浦县',
    center: [110.685133, 27.907633]
};
