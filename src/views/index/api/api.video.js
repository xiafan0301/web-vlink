import request from '@/config/axios';
let videoModeName = 'video';
/* ======== 视频播放服务API ======== */

/**
 * 视频播放接口
 * @param {Object} data 接口入参
 */
export const apiVideoPlay = data => {
  return request({
    url: '/video-patrol-service/video-play',
    method: 'get',
    // data,
    params: data,
    mode: videoModeName
  })
}
/**
 * 视频播放接口
 * @param {Object} data 接口入参
 */
export const apiVideoPlayBack = data => {
  return request({
    url: '/video-patrol-service/video-play-back',
    method: 'get',
    // data,
    params: data,
    mode: videoModeName
  })
}
/**
 * 轮巡列表分页查询接口
 * @param {Object} data 接口入参
 */
export const apiVideoRoundList = data => {
  return request({
    // url: '/videoDownloadService/videoDownloadList?' + $.param(data),
    url: '/round/page',
    method: 'get',
    // data,
    params: data,
    mode: videoModeName
  })
}
/**
 * 轮巡列表删除接口
 * @param {Object} data 接口入参
 */
export const apiDelVideoRoundList = data => {
  return request({
    // url: '/videoDownloadService/videoDownloadList?' + $.param(data),
    url: '/round/' + data.id,
    method: 'delete',
    params: data,
    mode: videoModeName
  })
}
/**
 * 新增轮巡
 * @param {Object} data 接口入参
 */
export const addVideoRound = data => {
  return request({
    url: '/round',
    method: 'post',
    data,
    mode: videoModeName
  })
}
/**
 * 查看轮巡详情
 * @param {Object} data 接口入参
 */
export const getVideoRoundDetail = id => {
  return request({
    url: '/round/' + id,
    method: 'get',
    // data,
    mode: videoModeName
  })
}
/**
 * 关闭轮巡
 * @param {Object} data 接口入参
 */
export const closeVideoRound = data => {
  return request({
    url: '/round',
    method: 'put',
    data,
    mode: videoModeName
  })
}
/**
 * 分页查询视频下载记录接口
 * @param {Object} data 接口入参
 */
export const apiVideoDownloadList = data => {
  return request({
    // url: '/videoDownloadService/videoDownloadList?' + $.param(data),
    url: '/video-download-service/video-download-list',
    method: 'get',
    // data,
    params: data,
    mode: videoModeName
  })
}
/**
 * 标记列表查询接口
 * @param {Object} data 接口入参
 */
export const apiVideoList = data => {
  return request({
    // url: '/videoDownloadService/videoDownloadList?' + $.param(data),
    url: '/video-sign-service/sign-list',
    method: 'get',
    // data,
    params: data,
    mode: videoModeName
  })
}
/**
 * 标记内容列表查询接口
 * @param {Object} data 接口入参
 */
export const apiSignContentList = data => {
  return request({
    url: '/video-sign-content-service/content-list',
    method: 'get',
    // data,
    params: data,
    mode: videoModeName
  })
}
/**
 * 新增视频标记内容接口
 * @param {Object} data 接口入参
 */
export const apiVideoSignContent = data => {
  return request({
    url: '/video-sign-content-service/video-sign-content',
    method: 'post',
    data,
    mode: videoModeName
  })
}
/**
 * 标记人列表查询接口
 * @param {Object} data 接口入参
 */
export const apiVideoSignPeopleList = data => {
  return request({
    url: '/video-sign-service/sign-people-list',
    method: 'get',
    params: data,
    mode: videoModeName
  })
}
/**
 * 新增视频标记接口
 * @param {Object} data 接口入参
 */
export const apiVideoSign = data => {
  return request({
    url: '/video-sign-service/video-sign',
    method: 'post',
    data,
    mode: videoModeName
  })
}

/**
 * 删除视频标记接口
 * @param {String} data 接口入参
 */
export const apiVideoSignDel = data => {
  return request({
    url: '/video-sign-service/sign/' + data,
    method: 'delete',
    mode: videoModeName
  })
}

/**
 * 设备列表接口
 * @param {Object} data 接口入参
 */
export const apiDeviceList = data => {
  return request({
    url: '/device-service/device-list',
    method: 'get',
    params: data,
    mode: 'base'
  })
}

/**
 * 新增视频播放记录接口
 * @param {Object} data 接口入参
 */
export const apiVideoRecord = data => {
  return request({
    url: '/video-patrol-service/video-record',
    method: 'post',
    data: data,
    mode: videoModeName
  })
}
/**
 * 视频播放记录列表查询接口
 * @param {Object} data 接口入参
 */
export const apiVideoRecordList = data => {
  return request({
    url: '/video-patrol-service/video-record-list',
    method: 'get',
    params: data,
    mode: videoModeName
  })
}
/**
 * 视频播放记录列表分页查询接口
 * @param {Object} data 接口入参
 */
export const apiVideoRecordPageList = data => {
  return request({
    url: '/video-patrol-service/video-record-page-list',
    method: 'get',
    params: data,
    mode: videoModeName
  })
}
/**
 * 删除视频播放记录接口
 * @param {Object} data 接口入参
 */
export const apiDelVideoRecord = data => {
  return request({
    url: '/video-patrol-service/video-record/' + data,
    method: 'delete',
    // params: data,
    mode: videoModeName
  })
}
/**
 * 清空视频播放记录接口
 * @param {Object} data 接口入参
 */
export const apiDelVideoRecords = data => {
  return request({
    url: '/video-patrol-service/video-records',
    method: 'delete',
    params: data,
    mode: videoModeName
  })
}
/**
 * 获取视频标记接口--分页
 * @param {Object} data 接口入参
 */
export const apiGetVideoRecords = data => {
  return request({
    url: '/video-sign-content-service/video-sign-content-page-list',
    method: 'get',
    params: data,
    mode: videoModeName
  })
}
/**
 * 修改视频标记接口
 * @param {Object} data 接口入参
 */
export const updateVideoRecords = data => {
  return request({
    url: '/video-sign-content-service/video-sign-content',
    method: 'put',
    data,
    mode: videoModeName
  })
}
/**
 * 删除视频标记接口
 * @param {Object} data 接口入参
 */
export const deleteVideoRecords = data => {
  return request({
    url: '/video-sign-content-service/video-sign-content/' + data.id,
    method: 'delete',
    params: data,
    mode: videoModeName
  })
}

/**
 * 当前轮巡记录查询接口
 * @param {Object} data 接口入参
 */
export const getVideoCurrentRound = () => {
  return request({
    url: '/round/current-round',
    method: 'get',
    mode: videoModeName
  })
}

/**
 * 修改轮巡状态接口
 * @param {Object} data 接口入参
 */
export const mdfVideoRoundState = (data) => {
  // console.log('mdfVideoRoundState', data);
  return request({
    url: '/round',
    method: 'put',
    data: data,
    mode: videoModeName
  })
}

/**
 * 修改轮巡接口
 * @param {Object} data 接口入参
 */
export const updateVideoRoundState = (data) => {
  return request({
    url: '/round',
    method: 'put',
    data: data,
    mode: videoModeName
  })
}

/**
 * 判断轮巡名称是否重复接口
 * @param {Object} data 接口入参
 */
export const judgeRoundName = (name) => {
  return request({
    url: '/round/check-round-name/' + name,
    method: 'get',
    mode: videoModeName
  })
}

/**
 * 视频录像开始接口
 * @param {Object} data 接口入参
 */
export const getVideoPlayRecordStart = (data) => {
  return request({
    url: '/video-patrol-service/video-play-record-start',
    method: 'get',
    params: data,
    mode: videoModeName
  })
}

/**
 * 视频录像结束接口
 * @param {Object} data 接口入参
 */
export const getVideoPlayRecordEnd = (data) => {
  return request({
    url: '/video-patrol-service/video-play-record-end',
    method: 'get',
    params: data,
    mode: videoModeName
  })
}

/**
 * 视频录像记录分页查询接口-支持按天查询
 * @param {Object} data 接口入参
 */
export const getVideoTranscribeDatePageList = (data) => {
  return request({
    url: '/video-transcribe-service/video-transcribe-date-page-list',
    method: 'get',
    params: data,
    mode: videoModeName
  })
}

/**
 * 删除视频记录接口
 * @param {Object} data 接口入参
 */
export const delVideoTranscribe = (data) => {
  return request({
    url: '/video-transcribe-service/video-transcribe/' + data,
    method: 'delete',
    mode: videoModeName
  })
}

/**
 * 开始后端录像下载任务
 * @param {Object} data 接口入参
 */
export const getVideoFileDownStartBatch= (data) => {
  return request({
    url: '/video-patrol-service/video-file-down-start-batch',
    method: 'post',
    data: data,
    mode: videoModeName
  })
}

/**
 * 后端录像下载任务进度查询
 * @param {Object} data 接口入参
 */
export const getVideoFileDownProgressBatch = (data) => {
  return request({
    url: '/video-patrol-service/video-file-down-progress-batch' + data,
    method: 'get',
    mode: videoModeName
  })
  /* return request({
    url: '/video-patrol-service/video-file-down-progress-batch',
    method: 'get',
    params: data,
    mode: videoModeName
  }) */
}

/**
 * 新增视频下载记录接口
 * @param {Object} data 接口入参
 */
export const addVideoDownload = (data) => {
  return request({
    url: '/video-download-service/video-download',
    method: 'post',
    data: data,
    mode: videoModeName
  })
}

/**
 * 当前服务器时间
 */
export const videoFileDownStartTime = (data) => {
  return request({
    url: '/video-patrol-service/video-file-down-start-time',
    method: 'get',
    params: data,
    mode: videoModeName
  })
}

/**
 * 当前服务器时间
 */
export const getServerTimestamp = () => {
  return request({
    url: '/video-patrol-service/server-timestamp',
    method: 'get',
    mode: videoModeName
  })
}

/**
 * 当前服务器时间
 */
export const ptzControl = (data) => {
  return request({
    url: '/video-patrol-service/ptz-control',
    method: 'get',
    params: data,
    mode: videoModeName
  })
}