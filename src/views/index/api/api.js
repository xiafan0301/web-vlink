import request from '@/config/axios';
/**
 * 获取视频点播接口
 */
export function getTestLive() {
  return request({
    url: '/live',
    mode: 'live',
    method: 'get'
  });
}

/**
 * 字典接口
 * @param {*} data
 */
export const getDiciData = (uid) => {
  return request({
    url: 'dict-service/dict-list/?pid=' + uid,
    method: 'get'
  });
}
/*-------------------------- 告警start -------------------------------*/
/**
 * getStatistics
 * 报警统计接口
 * @param {object} params
 */
export function getStatistics(params) {
  return request({
    url: '/alarm-snaps/statistics',
    method: 'get',
    mode: 'control',
    params: params
  })
}
/**
 * getAlarmList
 * 报警记录列表查询接口
 * @param {object} params
 */
export function getAlarmList(params) {
  return request({
    url: '/alarm-snaps/page',
    method: 'get',
    mode: 'control',
    params: params
  })
}
/*-------------------------- 告警end ---------------------------------*/
