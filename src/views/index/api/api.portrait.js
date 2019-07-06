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
 * @param {*} params 
 */
export const apiFaceSnap = (params) => {
  return request({
    url: '/analysis/face-snap',
    method: 'get',
    params,
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