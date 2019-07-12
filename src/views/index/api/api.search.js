import request from '@/config/axios';

/*--------------------------  检索start  ---------------------------------*/
/**
 * ScpGETPortraitInfo 人像检索接口
 * @param {object} params
 */
export function ScpGETPortraitInfo(params) {
  return request({
    url: '/portrait-structures/page',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * ScpGETstrucInfoList 抓拍检索列表接口
 * @param {object} params
 */
export function ScpGETstrucInfoList(data) {
  return request({
    url: '/structures/page',
    method: 'post',
    data,
    mode: 'judge'
  })
}
/**
 * ScpGETbasePortraitInfo 信息库人员查询接口
 * @param {object} params
 */
export function ScpGETbasePortraitInfo(params) {
  return request({
    url: '/portraits/by-idno',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * ScpGETportraitCmpInfo 人像比对接口
 * @param {object} params
 */
export function ScpGETportraitCmpInfo(params) {
  return request({
    url: '/portrait-structures/compare',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * ScpGETretrievalHisList 历史检索记录查询接口
 * @param {object} params
 */
export function ScpGETretrievalHisList(params) {
  return request({
    url: '/retrieval-histories/page',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * ScpGETretrievalHisById 历史检索记录详情查询接口
 * @param {object} params
 */
export function ScpGETretrievalHisById(params) {
  return request({
    url: '/retrieval-histories/' + params,
    method: 'get',
    mode: 'judge'
  })
}
/**
 * ScpGETdeviceListById
 通过用户id查询监控设备列表
 * @param {object} params
 */
export function ScpGETdeviceListById(params) {
  return request({
    url: '/device-service/device-list',
    method: 'get',
    mode: 'base',
    params: params
  })
}
/*--------------------------  检索end  ---------------------------------*/