import request from '@/config/axios';

/**
 * getPicRecognize 单张图片识别
 * @param {string} bussType  识别类型：vehicle机动车、face人脸、person人体
 * @param {string} url 图片URL
 */
export function getPicRecognize(params) {
  return request({
    url: '/recognize/picRecognize',
    method: 'get',
    mode: 'structuring',
    params: params
  })
}

/**
 * getPicRecognize 单张（多目标）图片识别， 识别多辆车辆
 * @param {string} bussType  识别类型：vehicle机动车、face人脸、person人体
 * @param {string} url 图片URL
 */
export function getMultiPicRecognize(params) {
  return request({
    url: '/recognize/picRecognizeMultiple',
    method: 'get',
    mode: 'structuring',
    params: params
  })
}