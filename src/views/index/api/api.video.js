import request from '@/config/axios';

/* ======== 视频播放服务API ======== */
/**
 * 分页查询视频下载记录接口
 * @param {Object} data 接口入参
 */
export function apiVideoDownloadList(data) {
  return request({
    url: '/videoDownloadService/videoDownloadList',
    method: 'get',
    // data,
    params: data,
    mode: 'video'
  })
}
