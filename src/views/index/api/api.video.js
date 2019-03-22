import request from '@/config/axios';

/* ======== 视频播放服务API ======== */
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
    mode: 'video'
  })
}
/**
 * 分页查询视频下载记录接口
 * @param {Object} data 接口入参
 */
export const apiVideoDownloadList = data => {
  return request({
    // url: '/videoDownloadService/videoDownloadList?' + $.param(data),
    url: '/videoDownloadService/videoDownloadList',
    method: 'get',
    // data,
    params: data,
    mode: 'video'
  })
}
/**
 * 标记列表查询接口
 * @param {Object} data 接口入参
 */
export const apiVideoList = data => {
  return request({
    // url: '/videoDownloadService/videoDownloadList?' + $.param(data),
    url: '/videoSignService/signList',
    method: 'get',
    // data,
    params: data,
    mode: 'video'
  })
}