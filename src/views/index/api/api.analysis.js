import request from '@/config/axios';


/*-------------------------- 车辆档案start -------------------------------*/
/**
 * getArchives
 * 车辆档案-根据车牌号码查询车辆的信息（车管所登记信息）
 * @param {object} params
 */
export function getArchives(params) {
  return request({
    url: '/vehicle/archives',
    method: 'get',
    mode: 'judge',
    params: params
  })
}
/**
 * getViolation
 * 违章信息-根据日期范围、车牌号码查询车辆的违法信息（车管所登记信息）
 * @param {object} params
 */
export function getViolation(params) {
  return request({
    url: '/vehicle/violation',
    method: 'get',
    mode: 'judge',
    params: params
  })
}

/*-------------------------- 行车分析start -------------------------------*/
/**
 * getDrivingAnalysis
 * 行车规律分析接口
 * @param {object} data
 */
export function getDrivingAnalysis(data) {
  return request({
    url: '/driving-discipline-analysis',
    method: 'post',
    mode: 'judge',
    data
  })
}

/*-------------------------- 特征搜车start -------------------------------*/
/**
 * getFeatureSearch
 * 查询特征搜车分页接口
 * @param {object} params
 */
export function getFeatureSearch(params) {
  return request({
    url: '/vehicle-investigate/feature-search',
    method: 'get',
    mode: 'analysis',
    params: params
  })
}

/**
 * getPhotoAnalysis
 * 车辆图片分析接口
 * @param {String} url
 */
export function getPhotoAnalysis(url) {
  return request({
    url: '/vehicle-investigate/photo-analysis?uploadImgUrls=' + url,
    method: 'get',
    mode: 'analysis'
  })
}

/*-------------------------- 以图搜车start -------------------------------*/
/**
 * getPhotoSearch
 * 查询以图搜车分页接口
 * @param {object} params
 */
export function getPhotoSearch(params) {
  return request({
    url: '/vehicle-investigate/photo-search',
    method: 'get',
    mode: 'analysis',
    params: params
  })
}

/*-------------------------- 模糊搜车start -------------------------------*/
/**
 * getVagueSearch
 * 查询模糊搜车分页接口
 * @param {object} params
 */
export function getVagueSearch(params) {
  return request({
    url: '/vehicle-investigate/vague-search',
    method: 'get',
    mode: 'analysis',
    params: params
  })
}