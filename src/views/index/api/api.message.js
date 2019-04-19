import request from '@/config/axios';
/*=================消息模块================== */
/**
 * addMutualHelp 新增民众互助接口
 * @param {object} params
 */
export function addMutualHelp(data) {
  return request({
    url: '/event-service/mutual-help',
    method: 'post',
    data,
    mode: 'message'
  })
}
/**
 * getMutualHelpDetail 民众互助详情查询接口  

 * @param {object} params
 */
export function getMutualHelpDetail(uid) {
  return request({
    url: '/event-service/mutual-help/' + uid,
    method: 'get',
    mode: 'message'
  })
}
/**
 * putMutualHelp 修改民众互助接口
 * @param {object} params
 */
export function putMutualHelp(data) {
  return request({
    url: '/event-service/mutual-help',
    method: 'put',
    data,
    mode: 'message'
  })
}
/**
 * replyComment 回复事件评论接口   
 * @param {object} params
 */
export function replyComment(data) {
  return request({
    url: '/event-service/reply-comment',
    method: 'post',
    data,
    mode: 'message'
  })
}
/**
 * shieldComment 屏蔽评论接口   
 * @param {object} params
 */
export function shieldComment(data) {
  return request({
    url: '/event-service/shield-comment',
    method: 'post',
    data,
    mode: 'message'
  })
}
/**
 * getMutualHelpList 民众互助列表分页查询接口
 * @param {object} params
 */
export function getMutualHelpList(params) {
  return request({
    url: '/event-service/mutual-help-list',
    method: 'get',
    params,
    mode: 'message'
  })
}
/**
 * getCommentInfoList 事件评论列表分页查询接口
 * @param {object} params
 */
export function getCommentInfoList(uid) {
  return request({
    url: '/event-service/comment-info-list/' + uid,
    method: 'get',
    mode: 'message'
  })
}
/**
 * addMsgNote 新增消息公告接口
 * @param {object} params
 */
export function addMsgNote(data) {
  return request({
    url: '/message-service/msg-note',
    method: 'post',
    data,
    mode: 'message'
  })
}
/**
 * getMsgNoteList 公告消息列表分页查询接口  
 * @param {object} params
 */
export function getMsgNoteList(params) {
  return request({
    url: '/message-service/msg-note-list',
    method: 'get',
    params,
    mode: 'message'
  })
}
/**
 * getMsgNoteDetail 消息公告详情查询接口
 * @param {object} params
 */
export function getMsgNoteDetail(uid) {
  return request({
    url: '/message-service/msg-note/' + uid,
    method: 'get',
    mode: 'message'
  })
}
/**
 * putMsgNote 修改消息公告接口    
 * @param {object} params
 */
export function putMsgNote(data) {
  return request({
    url: '/message-service/msg-note',
    method: 'put',
    data,
    mode: 'message'
  })
}
/**
 * sendMsg 发送短信消息接口     
 * @param {object} params
 */
export function sendMsg(data) {
  return request({
    url: '/message-service/send-msg',
    method: 'post',
    data,
    mode: 'message'
  })
}
/**
 * getOrganInfos 组织机构列表分页查询接口
 * @param {object} params
 */
export function getOrganInfos(params) {
  return request({
    url: '/authServices/organInfos',
    method: 'get',
    params,
    mode: 'auth'
  })
}
/**
 * getOrganUser 根据组织机构查人员分页接口   
 * @param {object} params
 */
export function getOrganUser(params) {
  return request({
    url: '/authServices/organ/user',
    method: 'get',
    params,
    mode: 'auth'
  })
}
/**
 * getSmsTemplate 通过项目类型查询短信模板列表分页查询接口
 * @param {object} params
 */
export function getSmsTemplate(params) {
  return request({
    url: '/SmsController/news/v3/smsTemplate',
    method: 'get',
    params,
    mode: 'sms'
  })
}
/**
 * getSmsList 获取短信分页
 * @param {object} params
 */
export function getSmsList(params) {
  return request({
    url: '/SmsController/news/v3/msgRecord',
    method: 'get',
    params,
    mode: 'sms'
  })
}