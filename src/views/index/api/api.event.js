  import request from '@/config/axios';

/*=================事件管理模块================== */
/**
 * 是否开启自动审核政务人员
 * @param {*} data 
 */
export const openAutoCheck = (data) => {
  return request({
    url: 'dict-service/update',
    method: 'put',
    data,
  });
}
/**
 * 获取事件列表数据
 * @param {*} data
 */
export const getEventList = (data) => {
  return request({
    url: 'events/page',
    method: 'get',
    params: data,
    mode: 'event'
  });
}
/**
 * 修改事件
 */
export const updateEvent = (data) => {
  return request({
    url: 'events/update',
    method: 'put',
    data,
    mode: 'event'
  });
}
/**
 * 添加事件
 */
export const addEvent = (data) => {
  return request({
    url: 'events',
    method: 'post',
    data,
    mode: 'event'
  });
}
/**
 * 获取事件详情
 * @param {*} data
 */
export const getEventDetail = (uid) => {
  return request({
    url: 'events/' + uid,
    method: 'get',
    mode: 'event'
  });
}
/**
 * 获取调度指挥列表数据
 * @param {*} data
 */
export const getAllCtcList = (data) => {
  return request({
    url: 'task-services/dispatches',
    method: 'get',
    params: data,
    mode: 'ctc'
  });
}
/**
 * 分页查询预案
 * @param {*} data
 */
export const getPlanData = (data) => {
  return request({
    url: 'plan-services/plans',
    method: 'get',
    params: data,
    mode: 'ctc'
  });
}
/**
 * 获取预案详情
 * @param {*} data
 */
export const getPlanDetail = (uid) => {
  return request({
    url: 'plan-services/plans/' + uid,
    method: 'get',
    mode: 'ctc'
  });
}
/**
 * 添加预案
 * @param {*} data
 */
export const addPlan = (data) => {
  return request({
    url: 'plan-services/plan',
    data,
    method: 'post',
    mode: 'ctc'
  });
}
/**
 * 修改预案
 * @param {*} data
 */
export const updatePlan = (data) => {
  return request({
    url: 'plan-services/plans',
    method: 'put',
    data,
    mode: 'ctc'
  });
}
/**
 * 删除预案
 * @param {*} data
 */
export const delPlan = (uid) => {
  return request({
    url: 'plan-services/plans/' + uid,
    method: 'delete',
    mode: 'ctc'
  });
}
/**
 * 分页获取调度任务
 * @param {*} data
 */
export const getCtcData = (data) => {
  return request({
    url: 'task-services/tasks',
    method: 'get',
    params: data,
    mode: 'ctc'
  });
}
/**
 * 调度指挥
 * @param {*} data
 */
export const ctcTasks = (data, uid) =>{
  return request({
    url: 'task-services/task/' + uid,
    method: 'post',
    data,
    mode: 'ctc'
  });
}
/**
 * 修改事件过程状态
 * @param {*} data
 */
export const updateProcess = (uid, data) => {
  return request({
    url: 'task-services/task/process/' + uid,
    method: 'put',
    data,
    mode: 'ctc'
  });
}
/**
 * 添加调度任务
 * @param {*} data 
 */
export const addTaskInfo = (data, uid) => {
  return request({
    url: 'task-services/task/' + uid,
    method: 'post',
    data,
    mode: 'ctc'
  });
}
/**
 * 结束调度--结束事件
 * @param {*} data 
 */
export const endEvent = (data, uid) => {
  return request({
    url: 'events/finish/' + uid,
    method: 'put',
    data,
    mode: 'event'
  });
}
/** ===== 事件统计分析 ====== */
/**
 * 事件总体情况统计
 * @param {*} data
 */
export const getGeneralcondition = (data) => {
  return request({
    url: 'eventCount/generalCondition',
    method: 'get',
    params: data,
    mode: 'event'
  });
}
/**
 * 事件等级分析
 * @param {*} data
 */
export const getRankAnalysis = (data) => {
  return request({
    url: 'eventCount/rankAnalysis',
    method: 'get',
    params: data,
    mode: 'event'
  });
}
/**
 * 事件类型分析
 * @param {*} data
 */
export const getTypeAnalysis = (data) => {
  return request({
    url: 'eventCount/typeAnalysis',
    method: 'get',
    params: data,
    mode: 'event'
  });
}
/**
 * 事件数量分析
 * @param {*} data
 */
export const getQuantitativeTrend = (data) => {
  return request({
    url: 'eventCount/quantitativeTrend',
    method: 'get',
    params: data,
    mode: 'event'
  });
}
/**
 * 事件高发地点分析
 * @param {*} data
 */
export const getHotLocation = (data) => {
  return request({
    url: 'eventCount/hotLocation',
    method: 'get',
    params: data,
    mode: 'event'
  });
}
/**
 * 事件布控统计分析
 * @param {*} data
 */
export const getSurveillance = (data) => {
  return request({
    url: 'eventCount/evtSurvStatistics',
    method: 'get',
    params: data,
    mode: 'event'
  });
}