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
    mode: 'analysis',
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
    mode: 'analysis',
    params: params
  })
}

/*-------------------------- 行车分析start -------------------------------*/
/**
 * getDrivingAnalysis
 * 行车规律分析接口
 * @param {object} params
 */
export function getDrivingAnalysis(params) {
  return request({
    url: '/driving-discipline-analysis',
    method: 'get',
    mode: 'analysis',
    params: params
  })
}
