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
    mode: 'vehicle',
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
    mode: 'vehicle',
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
    mode: 'vehicle',
    data
  })
}
/**
 * postExport
 * 导出接口
 * @param {object} data
 */
export function postExport(data) {
  return request({
    url: '/export',
    method: 'post',
    mode: 'vehicle',
    data
  })
}

/*-------------------------- 特征搜车start -------------------------------*/
/**
 * getFeatureSearch
 * 查询特征搜车分页接口
 * @param {object} data
 */
export function getFeatureSearch(data) {
  return request({
    url: '/vehicle-investigate/feature-search',
    method: 'post',
    mode: 'vehicle',
    data
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
    mode: 'vehicle'
  })
}

/*-------------------------- 以图搜车start -------------------------------*/
/**
 * getPhotoSearch
 * 查询以图搜车分页接口
 * @param {object} data
 */
export function getPhotoSearch(data) {
  return request({
    url: '/vehicle-investigate/photo-search',
    method: 'post',
    mode: 'vehicle',
    data
  })
}

/*-------------------------- 模糊搜车start -------------------------------*/
/**
 * getVagueSearch
 * 查询模糊搜车分页接口
 * @param {object} data
 */
export function getVagueSearch(data) {
  return request({
    url: '/vehicle-investigate/vague-search',
    method: 'post',
    mode: 'vehicle',
    data
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
    url: '/face-retrieval/frequently-haunt-reload/' + uid,
    method: 'post',
    mode: 'portrait',
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
    mode: 'portrait',
    data
  })
}
/**
 * postModifyTaskAnalysis
 * 频繁出没修改任务接口
 * @param {object} data
 */
export function postModifyTaskAnalysis(data, ids) {
  return request({
    url: '/face-retrieval/modify-frequently-haunt-job',
    method: 'post',
    mode: 'portrait',
    data,
    params: ids
  })
}

/*-------------------------- 人员侦察报告start -------------------------------*/
/**
 * getTaskInfosPage
 * 离线分析任务分页查询接口
 * @param {object} params
 */
export function postTaskInfosPage(params) {
  return request({
    url: '/personinvestigation/showtasklist',
    method: 'post',
    mode: 'portrait',
    params
  })
}
export function newTaskInfos(params) {
  return request({
    url: '/personinvestigation/addinvestigationtask',
    method: 'post',
    mode: 'portrait',
    params
  })
}
export function getdetailbg(params) {
  return request({
    url: '/personinvestigation/showinvestigationdetails',
    method: 'get',
    mode: 'portrait',
    params
  })
}
export function postdetailbg(params) {
  return request({
    url: '/personinvestigation/updateinvestigationtask',
    method: 'post',
    mode: 'portrait',
    params
  })
}

/*-------------------------- 区域人员分析start -------------------------------*/
// /**
//  * postShotNumArea
//  * 区域人员抓拍统计接口
//  * @param {object} data
//  */
// export function postShotNumArea(data) {
//   return request({
//     url: '/portrait/shot-num/area',
//     method: 'post',
//     mode: 'judge',
//     data
//   })
// }

// /**
//  * postShotNumAreaDetail
//  * 区域人员抓拍详情接口
//  * @param {object} data
//  */
// export function getShotNumAreaDetail(data) {
//   return request({
//     url: '/portrait/shot-num/area/detail',
//     method: 'post',
//     mode: 'judge',
//     data
//   })
// }

// /**
//  * dispatchRealtime
//  * 区域分析实时/离线判断接口(web)
//  * @param {object} data
//  */
// export function dispatchRealtime(data) {
//   return request({
//     url: '/portrait/shot-num/area/dispatch/web',
//     method: 'post',
//     mode: 'judge',
//     data
//   })
// }

/**
 * getPortraitRealtime
 * 区域分析实时查询接口(web)
 * @param {object} data
 */
export function getPortraitRealtime(data) {
  return request({
    url: '/portrait/shot-num/area/real-time/web',
    method: 'post',
    mode: 'portrait',
    data
  })
}

/**
 * addOffLineTask
 * 新建区域分析离线分析任务接口(Web)
 * @param {object} data
 */
export function addOffLineTask(data) {
  return request({
    url: '/portrait/shot-num/area/task/web',
    method: 'post',
    mode: 'portrait',
    data
  })
}
/**
 * addOffLineTask
 * 区域分析重启-恢复任务接口(Web)
 * @param {object} data
 */
export function restartAreaTask(uid) {
  return request({
    url: '/portrait/shot-num/area/reload/' + uid,
    method: 'post',
    mode: 'portrait',
  })
}
/*-------------------------- 区域人员分析end -------------------------------*/
/**
 * postPeopleTask
 * 新增行人同行分析任务
 * @param {object} data
 */
export function postPeopleTask(data) {
  return request({
    url: '/person/peer-analysis',
    method: 'post',
    mode: 'portrait',
    data
  })
}
/**
 * getPeopleTaskDetail
 * 行人同行分析任务详情
 * @param {String} uid
 */
export function getPeopleTaskDetail(data) {
  return request({
    url: '/analysisTaskInfos/' + data,
    method: 'get',
    mode: 'judge'
  })
}
/*-------------------------- 区域人员分析 end -------------------------------*/