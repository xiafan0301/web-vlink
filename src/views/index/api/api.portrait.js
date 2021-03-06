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
/*================ 车流量对比 start=================== */
export const apiCarFlowCompa = (data) => {
  return request({
    url: '/analysis/car-flow-compa',
    method: 'post',
    data,
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
    mode: 'portrait'
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
    mode: 'portrait'
  });
}
/*================人脸检索 --- 跟踪尾随 end=================== */

/*================人脸检索 --- 轨迹分析 start=================== */

/**
 * 轨迹分析离线任务
 * @data {object} data
 */
export function PortraitPostPersonTrace(data) {
  return request({
    url: '/person-trace/analysis/task',
    method: 'post',
    data,
    mode: 'portrait'
  })
}
/**
 * 轨迹分析实时查询
 * @data {object} data
 */
export function PersonTracePostRealTime(data) {
  return request({
    url: '/person-trace/analysis/real-time',
    method: 'post',
    data,
    mode: 'portrait'
  })
}
/*================人脸检索 --- 轨迹分析 end=================== */

/*================人脸检索 --- 以图搜人 start=================== */

/**
 * 以图搜人实时/离线判断
 * @data {object} data
 */
export function PortraitGetDispatch(data) {
  return request({
    url: '/portrait/by-photo/dispatch',
    method: 'post',
    data,
    mode: 'judge'
  })
}
/**
 * 以图搜人实时/离线判断
 * @data {object} data
 */
export function PortraitPostByphotoTask(data) {
  return request({
    url: '/portrait/by-photo/task',
    method: 'post',
    data,
    mode: 'portrait'
  })
}

/**
 * 以图搜人实时
 * @data {object} data
 */
export function PortraitPostByphotoRealtime(data, extData) {
  return request({
    url: '/portrait/by-photo/real-time',
    method: 'post',
    data,
    mode: 'portrait',
    extData: extData
  })
}
/*================人脸检索 --- 以图搜人 end=================== */


/*================人脸检索 --- 人像落脚点 start=================== */

/**
 * 人像落脚点实时
 * @data {object} data
 */
export function PortraitPostStayPointRealtime(data) {
  return request({
    url: '/person-stay-point/real-time',
    method: 'post',
    data,
    mode: 'portrait'
  })
}

/**
 * 人像落脚点离线任务创建
 * @data {object} data
 */
export function PortraitPostStayPointTask(data) {
  return request({
    url: '/person-stay-point/task',
    method: 'post',
    data,
    mode: 'portrait'
  })
}

/**
 * 人像落脚点任务状态修改
 * @data {object} data
 */
export function PortraitPutStayPointTaskUpDate(data) {
  return request({
    url: '/person-stay-point/task',
    method: 'put',
    data,
    mode: 'portrait'
  })
}

/**
 * 人像落脚点任务结果接口
 * @data {object} data
 */
export function PortraitGetStayPointTaskByUid(params) {
  return request({
    url: '/person-stay-point/task/' + params.uid,
    method: 'get',
    mode: 'portrait'
  })
}

/**
 * 人像落脚点任务分页列表查询接口
 * @data {object} data
 */
export function PortraitGetStayPointTasks(params) {
  return request({
    url: '/person-stay-point/tasks',
    method: 'get',
    params,
    mode: 'portrait'
  })
}

/*================人脸检索 --- 人像落脚点 end=================== */

/*================人脸检索 --- 重点关注 start=================== */
/**
 * FocusPostReloadtask
 * 重点人群关注离线分析任务接口--重启任务
 * @param {object} uid
 */
export function FocusPostReloadtask(data) {
  return request({
    url: '/portrait/shot-num/focus/reloadtask',
    method: 'post',
    mode: 'portrait',
    data
  })
}
/**
/*================人脸检索 --- 重点关注 end=================== */

