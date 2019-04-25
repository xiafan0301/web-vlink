import request from '@/config/axios';

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
/**
 * getAlarmDetail
 * 报警记录详情查询接口
 * @param {string} uid
 */
export function getAlarmDetail(uid) {
  return request({
    url: '/alarm-snaps/' + uid,
    method: 'get',
    mode: 'control'
  })
}
/**
 * delAlarm 撤销告警接口
 * @param {string} uid
 */
export function delAlarm(uid) {
  return request({
    url: '/alarm-snaps/' + uid,
    method: 'delete',
    mode: 'control'
  })
}
/*-------------------------- 告警end ---------------------------------*/
