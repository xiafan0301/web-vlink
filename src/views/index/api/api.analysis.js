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
    mode: 'judge',
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
    mode: 'judge'
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
    mode: 'judge',
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
    mode: 'judge',
    params: params
  })
}

/*-------------------------- 频繁出没start -------------------------------*/
/**
 * getTaskInfosPage
 * 离线分析任务分页查询接口
 * @param {object} params
 */
export function getTaskInfosPage(params) {
  return request({
    url: '/analysisTaskInfos/page',
    method: 'get',
    mode: 'judge',
    params: params
  })
}
/**
 * getTaskInfosDetail
 * 离线分析任务详情查询接口
 * @param {object} uid
 */
export function getTaskInfosDetail(uid) {
  return request({
    url: '/analysisTaskInfos/' + uid,
    method: 'get',
    mode: 'judge',
  })
}
/**
 * putAnalysisTask 
 * 离线分析任务更新(中断、删除)接口
 * @param {object} data
 */
export function putAnalysisTask(data) {
  return request({
    url: '/analysisTaskInfos',
    method: 'put',
    mode: 'judge',
    data,
  })
}
/**
 * putTaskInfosResume 
 * 离线分析任务恢复接口
 * @param {object} uid
 */
export function putTaskInfosResume(uid) {
  return request({
    url: '/analysisTaskInfos/resume/' + uid,
    method: 'put',
    mode: 'judge',
  })
}
/**
 * postTaskAnalysis
 * 频繁出没新建任务接口
 * @param {object} data
 */
export function postTaskAnalysis(data) {
  return request({
    url: '/face-retrieval/add-frequently-haunt-job',
    method: 'post',
    mode: 'judge',
    data
  })
}