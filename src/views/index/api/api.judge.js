import request from '@/config/axios';

/*--------------------------  研判start  ---------------------------------*/
/**
 * JtcPOSTAppendixInfo 指定记录上传附件
 * @param {object} params
 */
export function JtcPOSTAppendixInfo(data) {
  return request({
    url: '/appendixes',
    method: 'post',
    data,
    mode: 'judge'
  })
}
/**
 * JtcGETAppendixInfoList 历史上传图片
 * @param {object} params
 */
export function JtcGETAppendixInfoList(params) {
  return request({
    url: '/appendixes/page',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JtcPUTAppendixsOrder 附件信息更新接口
 * @param {object} params
 */
export function JtcPUTAppendixsOrder(params) {
  return request({
    url: '/appendixes',
    method: 'put',
    params: params,
    mode: 'judge'
  })
}
/**
 * JtcGETTrail 布控抓拍结果图片检索接口
 * @param {object} params
 */
export function JtcGETTrail(params) {
  return request({
    url: '/structures',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JigGETEvent 事件编号查询列表接口
 * @param {object} params
 */
export function JigGETEvent(params) {
  return request({
    url: '/events/page',
    method: 'get',
    params: params,
    mode: 'event'
  })
}
/**
 * JigGETEventAlarm 事件侦查检索接口
 * @param {object} params
 */
export function JigGETEventAlarm(params) {
  return request({
    url: '/events/' + params.eventId + '/alarm-snaps',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JigGETAlarmSnapList 设备抓拍结果列表接口
 * @param {object} params
 */
export function JigGETAlarmSnapList(params) {
  return request({
    url: '/surveillances/' + params.surveillanceId + '/alarm-snaps',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JfoGETGroup 分组列表查询接口
 * @param {object} params
 */
export function JfoGETGroup(params) {
  return request({
    url: '/group',
    method: 'get',
    params: params,
    mode: 'base'
  })
}
/**
 * JfoGETSurveillanceObject 布控范围内监控设备列表查询接口
 * @param {object} params
 */
export function JfoGETSurveillanceObject(params) {
  return request({
    url: '/alarm-snaps/by-group',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JfoGETEventList 事件列表查询接口
 * @param {object} params
 */
export function JfoGETEventList(params) {
  return request({
    url: '/events/by-surveillance',
    method: 'get',
    params: params,
    mode: 'event'
  })
}
/**
 * JhaGETStatisicByAddress 高危人员抓拍区域统计接口
 * @param {object} params
 */
export function JhaGETStatisicByAddress(params) {
  return request({
    url: '/alarm-snaps/by-address',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JhaGETAlarmSnapByAddress 高危人员抓拍结果列表查询接口
 * @param {object} params
 */
export function JhaGETAlarmSnapByAddress(params) {
  return request({
    url: '/devices/' + params.deviceId + '/alarm-snaps',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/*--------------------------  研判end  ---------------------------------*/