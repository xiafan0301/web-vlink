import request from '@/config/axios';

/*--------------------------  研判start  ---------------------------------*/
/**
 * JtcPOSTAppendixInfo 指定记录上传附件
 * @param {object} params
 */
export function JtcPOSTAppendixInfo(data) {
  return request({
    url: '/appendixes',
    method: 'post',
    data,
    mode: 'judge'
  })
}
/**
 * JtcGETAppendixInfoList 历史上传图片
 * @param {object} params
 */
export function JtcGETAppendixInfoList(params) {
  return request({
    url: '/appendixes/page',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JtcPUTAppendixsOrder 附件信息更新接口
 * @param {object} params
 */
export function JtcPUTAppendixsOrder(params) {
  return request({
    url: '/appendixes',
    method: 'put',
    params: params,
    mode: 'judge'
  })
}
/**
 * JtcGETTrail 布控抓拍结果图片检索接口
 * @param {object} params
 */
export function JtcGETTrail(params) {
  return request({
    url: '/structures',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JigGETEvent 事件编号查询列表接口
 * @param {object} params
 */
export function JigGETEvent(params) {
  return request({
    url: '/events/page',
    method: 'get',
    params: params,
    mode: 'event'
  })
}
/**
 * JigGETEventAlarm 事件侦查检索接口
 * @param {object} params
 */
export function JigGETEventAlarm(params) {
  return request({
    url: '/events/' + params.eventId + '/alarm-snaps',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JigGETEventAlarm 事件侦查检索接口
 * @param {object} params
 */
export function JigGETEventAreas(params) {
  return request({
    url: '/events/' + params.eventId + '/areas',
    method: 'get',
    mode: 'user'
  })
}
/**
 * JigGETAlarmSnapList 设备抓拍结果列表接口
 * @param {object} params
 */
export function JigGETAlarmSnapList(params) {
  return request({
    url: '/surveillances/alarm-snaps',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JfoGETGroup 分组列表查询接口
 * @param {object} params
 */
export function JfoGETGroup(params) {
  return request({
    url: '/group',
    method: 'get',
    params: params,
    mode: 'base'
  })
}
/**
 * JfoGETGroup 分组列表查询接口
 * @param {object} params
 */
export function JfoGETCity(params) {
  return request({
    url: '/vehicle-investigate/first-enter-city',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
/**
 * JfoGETSurveillanceObject 布控范围内监控设备列表查询接口
 * @param {object} params
 */
export function JfoGETSurveillanceObject(params) {
  return request({
    url: '/alarm-snaps/by-group',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JfoGETEventList 事件列表查询接口
 * @param {object} params
 */
export function JfoGETEventList(params) {
  return request({
    url: '/events/by-surveillance',
    method: 'get',
    params: params,
    mode: 'event'
  })
}
/**
 * JhaGETStatisicByAddress 高危人员抓拍区域统计接口
 * @param {object} params
 */
export function JhaGETStatisicByAddress(params) {
  return request({
    url: '/alarm-snaps/by-address',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * JhaGETAlarmSnapByAddress 高危人员抓拍结果列表查询接口
 * @param {object} params
 */
export function JhaGETAlarmSnapByAddress(params) {
  return request({
    url: '/devices/' + params.deviceId + '/alarm-snaps',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * MapGetPortraitsByName 通过姓名模糊搜索人像
 * @param {object} params
 */
export function MapGetPortraitsByName(params) {
  return request({
    url: '/portraits/by-name',
    method: 'get',
    params,
    mode: 'control'
  })
}
/*--------------------------  研判end  ---------------------------------*/

/*--------------------------  车辆侦查--尾随分析start  ---------------------------------*/
/**
 * 查询车辆抓拍设备接口
 * @param {object} params
 */
export function getShotDevice(params) {
  return request({
    url: '/vehicle/shot-dev',
    method: 'get',
    params,
    mode: 'judge'
  });
}
/**
 * 查询尾随记录列表接口
 * @param {object} params
 */
export function getTailBehindList(params) {
  return request({
    url: '/vehicle/tail-behind/list',
    method: 'get',
    params,
    mode: 'judge'
  });
}
/**
 * 查询尾随记录详情接口
 * @param {object} params
 */
export function getTailBehindDetail(params) {
  return request({
    url: '/vehicle/tail-behind/detail',
    method: 'get',
    params,
    mode: 'judge'
  });
}
/**
 * 根据车牌号码查询车辆详情接口
 * @param {object} params
 */
export function getVehicleArchives(params) {
  return request({
    url: '/vehicle/archives',
    method: 'get',
    params,
    mode: 'judge'
  });
}
/*--------------------------  车辆侦查--尾随分析end  ---------------------------------*/

/*--------------------------  人脸检索--身份核实start  ---------------------------------*/
/**
 * 查询身份核实列表接口
 * @param {object} params
 */
export function getIdNoList(params) {
  return request({
    url: '/portrait/identify',
    method: 'get',
    params,
    mode: 'judge'
  });
}
/*--------------------------  车辆侦查--尾随分析end  ---------------------------------*/


/*--------------------------  车辆侦查--车辆落脚点start  ---------------------------------*/
/**
 * 查询车辆落脚点
 * @param {object} data
 */

export function getVehicleShot(data) {
  return request({
    url: '/vehicle/shot-num',
    method: 'post',
    params:data,
    mode: 'judge'
  });
}
/**
 * 查询所有的设备
 * @param {object} params
 */
export function getAllDevice(params) {
  return request({
    url: '/device-service/all-deviceInfo',
    method: 'get',
    params,
    mode: 'base'
  });
}
/*--------------------------  车辆侦查--车辆落脚点end  ---------------------------------*/

/**
 * 查询车辆详情
 * @param {object} params
 */
export function getSnapDetail(params) {
  return request({
    url: '/vehicle/snap-detail',
    method: 'get',
    params,
    mode: 'judge'
  });
}
/**
 * 查询车辆登记信息
 * @param {object} params
 */
export function getArchives(params) {
  return request({
    url: '/vehicle/archives',
    method: 'get',
    params,
    mode: 'judge'
  });
}
/**
 * 查询车辆登违章信息
 * @param {object} params
 */
export function getViolationInfo(params) {
  return request({
    url: '/vehicle/violation',
    method: 'get',
    params,
    mode: 'judge'
  });
}
/**
 * 查询连续违章
 * @param {object} params
 */
export function getViolation(params) {
  return request({
    url: '/vehicle/continuous-violation',
    method: 'get',
    params,
    mode: 'judge'
  });
}
/**
 * 查询车辆
 * @param {object} params
 */
export function getSnapList(params) {
  return request({
    url: '/vehicle/snap',
    method: 'get',
    params,
    mode: 'judge'
  });
}
/**
 * 
车辆图片分析接口
 * @param {object} params
 */
export function getPhotoAnalysis(params) {
  return request({
    url: '/vehicle-investigate/photo-analysis',
    method: 'get',
    params,
    mode: 'judge'
  });
}
/*--------------------------  车辆侦查--尾随分析end  ---------------------------------*/


/*--------------------------  vehicle区域徘徊碰撞start  ---------------------------------*/
/**
 * 区域徘徊
 * @param {object} params
 */
export function QyphGetAreaWander(params) {
  return request({
    url: '/vehicle-analysis/area-wander',
    method: 'get',
    params: params,
    mode: 'noServe'
  });
}
/*--------------------------  区域徘徊碰撞end  ---------------------------------*/
/**
 * 区域碰撞
 * @param {object} params
 */
export function QypzGetAreaCross(params) {
  return request({
    url: '/vehicle-analysis/area-cross',
    method: 'get',
    params: params,
    mode: 'noServe'
  });
}
/*--------------------------  车辆轨迹start  ---------------------------------*/

/*--------------------------  车辆轨迹end  ---------------------------------*/
/**
 * 查询设备抓拍图片汇总信息
 * @param {object} params
 */
export function getDeviceSnapImagesSum(params) {
  return request({
    url: '/device-snap-service/device-snap-images-sum',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/**
 * 查询特殊组
 * @param {object} params
 */
export function getGroups(params) {
  return request({
    url: '/groups',
    method: 'get',
    params: params,
    mode: 'base'
  })
}

/**
 * 查询设备抓拍图片汇总信息
 * @param {object} params
 */
export function getDeviceSnapImagesPage(params) {
  return request({
    url: '/device-snap-service/device-snap-images-page',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}
/*--------------------------  车辆侦查--多车同行分析start  ---------------------------------*/
/**
 * 多车同行查询接口
 * @param {object} params
 */
export function getMultiVehicleList(params) {
  return request({
    url: '/multi-vehicle-peer',
    method: 'post',
    data: params,
    mode: 'judge'
  })
}
/*--------------------------  车辆侦查--多车同行分析end  ---------------------------------*/

/*--------------------------  车辆侦查--夜间行车分析start  ---------------------------------*/
/**
 * 夜间行车查询接口
 * @param {object} params
 */
export function getNightVehicleList(params) {
  return request({
    url: '/night-driving-vehicle',
    method: 'post',
    data: params,
    mode: 'judge'
  })
}
/**
 * 夜间行车抓拍记录查询接口
 * @param {object} params
 */
export function getNightVehicleRecordList(params) {
  return request({
    url: '/night-driving-vehicle/records',
    method: 'post',
    data: params,
    mode: 'judge'
  })
}
/*--------------------------  车辆侦查--夜间行车分析end  ---------------------------------*/