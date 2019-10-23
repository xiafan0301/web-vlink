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
 * JtcPOSTAppendixInfo 套牌车查询接（分页）
 * @param {object} params
 */
export function JtcPOSTAppendtpInfo(data) {
  return request({
    url: '/fake-plate-vehicle',
    method: 'post',
    data,
    mode: 'vehicle'
  })
}
/**
 * JtcPOSTAppendixInfo 套牌车查询接（分页）
 * @param {object} params
 */
export function JtcPOSTAppendtpInfos(data) {
  return request({
    url: '/fake-plate-vehicles',
    method: 'post',
    data,
    mode: 'vehicle'
  })
}
/**
 * JtcPOSTAppendixInfo 特殊场所
 * @param {object} params
 */
export function Jtcgettsc(data) {
  return request({
    url: '/special-place/groups-devices',
    method: 'get',
    params: data,
    mode: 'base'
  })
}
/**
 * JtcPOSTAppendixInfo 套牌车查询接（分页）
 * @param {object} params
 */
export function getbayonet() {
  return request({
    url: '/analysis-device/enter-city-bayonet',
    method: 'get',
    mode: 'judge'
  })
}
/**
 * JfoGETGroup 分组列表查询接口
 * @param {object} params
 */
export function JfoGETCity(data) {
  return request({
    url: '/vehicle-investigate/first-enter-city',
    method: 'post',
    data,
    mode: 'judge'
  })
}
/**
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
export function newGETAlarmSnapList(params) {
  return request({
    url: '/portrait/shot-num/focus/detail',
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
    data,
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
    method: 'post',
    data:params,
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
    method: 'post',
    data:params,
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
export function QyphGetAreaWander(data) {
  return request({
    url: '/vehicle-analysis/area-wander',
    method: 'post',
    data,
    mode: 'judge'
  });
}
/*--------------------------  区域徘徊碰撞end  ---------------------------------*/
/**
 * 区域碰撞
 * @param {object} params
 */
export function QypzGetAreaCross(data) {
  return request({
    url: '/vehicle-analysis/area-cross',
    method: 'post',
    data,
    mode: 'judge'
  });
}
/*--------------------------  车辆侦查-车辆轨迹start  ---------------------------------*/
/**
 * 查询设备抓拍图片汇总信息
 * @param {object} params
 */
export function InvestigateGetTrace(data) {
  return request({
    url: '/vehicle-investigate/trace',
    method: 'post',
    data,
    mode: 'judge'
  })
}
/*--------------------------  车辆轨迹end  ---------------------------------*/
/**
 * 查询设备抓拍图片汇总信息
 * @param {object} params
 */
export function getDeviceSnapImagesSum(params) {
  return request({
    url: '/device-snap-service/device-snap-images-sum',
    method: 'post',
    data: params,
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
    method: 'post',
    data: params,
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
/**
 * 判断基准车辆是否有抓拍数据
 * @param {object} params
 */
export function getBaseVehicleList(params) {
  return request({
    url: '/base-vehicle-check',
    method: 'get',
    params,
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

/**
 * 车辆侦查报告查询接口
 * @param {object} params
 */
export function getVehicleInvestigationReport(params) {
  return request({
    url: '/report-service/vehicle-report',
    method: 'post',
    data: params,
    mode: 'vehicle'
  })
}

/*--------------------------  人像接口--重点关注  ---------------------------------*/
/**
 * 重点关注次数统计接口
 * @param {object} params
 */
export function getFocusList(params) {
  return request({
    url: '/portrait/shot-num/focus',
    method: 'post',
    data: params,
    mode: 'judge'
  })
}
/**
 * 重点关注实时接口
 * @param {object} params
 */
export function PortraitPostFocusRealTime(data, extData) {
  return request({
    url: '/portrait/shot-num/focus/real-time',
    method: 'post',
    data,
    mode: 'judge',
    extData: extData
  })
}
/**
 * 重点关注离线任务接口
 * @param {object} params
 */
export function PortraitPostFocusTask(data) {
  return request({
    url: '/portrait/shot-num/focus/task',
    method: 'post',
    data,
    mode: 'judge'
  })
}
/*--------------------------  导入导出  ---------------------------------*/
/**
 * 夜间行车分析导出接口
 * @param {object} params
 */
export function exportNightVehicle(params) {
  return request({
    url: '/export',
    method: 'post',
    data: params,
    mode: 'judge'
  })
}
/**
 * 人像落脚点查询接口接口
 * @param {object} params
 */
export function getFoothold(params) {
  return request({
    url: '/foothold',
    method: 'post',
    data: params,
    mode: 'portrait'
  })
}

/**
 * 人脸查询接口
 * @param {object} params
 */
export function getFaceRetrieval(params) {
  return request({
    url: '/face-retrieval/query',
    method: 'post',
    data: params,
    mode: 'judge'
  })
}
/**
 * 人体查询接口
 * @param {object} params
 */
export function getFaceRetrievalPerson(params, extData) {
  return request({
    url: '/face-retrieval/query-person',
    method: 'post',
    data: params,
    mode: 'judge',
    extData: extData
  })
}

/*--------------------------  参数设置  ---------------------------------*/
/**
 * 获取落脚点分析距离和停留时间
 * @param {object} params
 */
export function getLjdDistanceAndTime() {
  return request({
    url: '/params',
    method: 'get',
    mode: 'judge'
  })
}
/**
 * 设置落脚点分析距离和停留时间
 * @param {object} params
 */
export function setLjdDistanceAndTime(data) {
  return request({
    url: '/params',
    method: 'post',
    data,
    mode: 'judge'
  })
}


/* 视频接力接口 */
/**
 * 添加人员视频接力任务
 * @param {object} params
 */
export function addPersonVideoContinue(params) {
  return request({
    url: '/add/person/video/continue',
    method: 'post',
    data: params,
    mode: 'judge'
  })
}

 /* 添加车辆视频接力任务
 * @param {object} params
 */
export function addVhicleVideoContinue(params) {
  return request({
    url: '/add/vhicle/video/continue',
    method: 'post',
    data: params,
    mode: 'judge'
  })
}
/**
 * 搜素所有视频接力任务
 * @param {object} params
 */
export function selectVideoContinue(params) {
  return request({
    url: '/begin/video/continue',
    method: 'post',
    data: params,
    mode: 'judge'
  })
}
/**
 * 终止或重新开始视频接力
 * @param {object} params
 */
export function updVideoContinue(params) {
  return request({
    url: '/end/video/continue',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}

/**
 * 搜索视频接力详情
 * @param {object} params
 */
export function getVideoContinue(params) {
  return request({
    url: '/query/video/continue',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}

/**
 * 搜索视频接力详情
 * @param {object} params
 */
export function getVideoContinueAllpointss(params) {
  return request({
    url: '/allpointss/video/continues',
    method: 'get',
    params: params,
    mode: 'judge'
  })
}


/**************************** 区域人员分析接口 ******************************** */
/**
 * 区域人员在线查询实时接口
 * @param {object} params
 */
export function getAreaRealTimeData(params, extData) {
  return request({
    url: '/portrait/shot-num/area/real-time/web',
    method: 'post',
    data: params,
    mode: 'judge',
    extData: extData
  })
}
/**
 * 区域人员新建离线任务接口
 * @param {object} params
 */
export function addAreaPersonTask(params) {
  return request({
    url: '/portrait/shot-num/area/task/web',
    method: 'post',
    data: params,
    mode: 'judge'
  })
}


/****************************车辆限行接口 ******************************** */
/**
 * 创建限行任务接口
 * @param {object} params
 */
export function addLimitTask(params) {
  return request({
    url: '/limit-task',
    method: 'post',
    data: params,
    mode: 'judge'
  })
}
/**
 * 限行任务详情接口
 * @param {object} params
 */
export function getLimitTaskDetail(params) {
  return request({
    url: '/limit-task/detail',
    data: params,
    method: 'post',
    mode: 'judge'
  })
}
/**
 * 车辆限行抓拍记录查询接口
 * @param {object} params
 */
export function getLimitShotRecord(params) {
  return request({
    url: '/limit-task/shot-records',
    method: 'get',
    params,
    mode: 'judge'
  })
}
/**
 * 限行任务状态修改接口
 * @param {object} params
 */
export function updateLimitTaskStatus(params) {
  return request({
    url: '/limit-task/status',
    method: 'put',
    data: params,
    mode: 'judge'
  })
}
/**
 * 限行任务分页查询接口
 * @param {object} params
 */
export function getLimitTaskList(params) {
  return request({
    url: '/limit-tasks',
    method: 'get',
    params,
    mode: 'judge'
  })
}