import request from '@/config/axios';
/*================人脸检索=================== */
/**
 * 人脸数据汇总分析接口
 * @param {*} params 
 */
export const apiFaceTotal = (params) => {
  return request({
    url: '/analysis/face-total',
    method: 'get',
    params,
    mode: 'judge'
  });
}
/**
 * 人脸抓拍统计接口
 * @param {*} data 
 */
export const apiFaceSnap = (data) => {
  return request({
    url: '/analysis/face-snap',
    method: 'post',
    data,
    mode: 'judge'
  });
}
/**
 * 人脸布控告警数据分析接口
 * @param {*} params 
 */
export const apiFaceWarning = (params) => {
  return request({
    url: '/analysis/face-warning',
    method: 'get',
    params,
    mode: 'judge'
  });
}

/*================人脸检索 --- 跟踪尾随 start=================== */
/**
 * 行人抓拍设备查询接口
 * @param {*} params 
 */
export const getPersonShotDev = (params) => {
  return request({
    url: '/person/shot-dev',
    method: 'post',
    data: params,
    mode: 'judge'
  });
}
/**
 * 尾随记录列表 --新建一个跟踪尾随离线任务
 * @param {*} params 
 */
export const getPersonFollowing = (params) => {
  return request({
    url: '/person/trace-following',
    method: 'post',
    data: params,
    mode: 'judge'
  });
}
/*================人脸检索 --- 跟踪尾随 end=================== */

/*================人脸检索 --- 轨迹分析 start=================== */

/**
 * 轨迹分析
 * @data {object} data
 */
export function PortraitPostPersonTrace(data) {
  return request({
    url: '/person-trace/analysis',
    method: 'post',
    data,
    mode: 'judge'
  })
}
/*================人脸检索 --- 轨迹分析 end=================== */