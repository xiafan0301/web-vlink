<template>
  <div id="vehicle_report_save_c">
    <div>
      <div class="vc_rep_c_tt">车辆综合分析报告 <span v-if="clInfo">- {{pn}}</span></div>
      <div class="vc_rep_c_ti"><span>{{time[0] | fmTimestamp('yyyy年MM月dd日')}}&nbsp;-&nbsp;{{time[1] | fmTimestamp('yyyy年MM月dd日')}}</span></div>
      <!-- 车辆档案信息  showType 1 -->
      <div class="vc_rep_cl" id="report_showtype_1">
        <div>
          <h2>1、车辆档案信息</h2>
          <div>
            <h3>1.1 车辆信息</h3>
            <ul class="rep_clxx" v-if="clInfo">
              <li><span>车牌号码：</span><p>{{clInfo.plateno}}</p></li>
              <li><span>车辆所有人：</span><p>{{clInfo.owner}}</p></li>
              <li><span>中文品牌：</span><p>{{clInfo.brand}}</p></li>
              <li><span>车身颜色：</span><p>{{clInfo.color}}</p></li>
              <li><span>车身形式：</span><p>{{clInfo.bodyform}}</p></li>
              <li><span>车门数：</span><p>{{clInfo.doornumber}}</p></li>
              <li><span>发动机号：</span><p>{{clInfo.engineno}}</p></li>
              <li><span>车辆类型：</span><p>{{clInfo.platetype}}</p></li>
              <li><span>年款：</span><p>{{clInfo.model}}</p></li>
              <li><span>座位数：</span><p>{{clInfo.seatnumber}}</p></li>
              <li><span>车辆状态：</span><p>{{clInfo.status}}</p></li>
              <li><span>使用性质：</span><p>{{clInfo.usecharacter}}</p></li>
              <li><span>车型：</span><p>{{clInfo.vehicletype}}</p></li>
              <li><span>厂商名称：</span><p>{{clInfo.vendor}}</p></li>
              <li><span>有效期止：</span><p>{{clInfo.validuntil}}</p></li>
            </ul>
            <div class="rep_cl_empty" v-else>暂无数据</div>
            <h3>1.2 违章信息</h3>
            <div class="rep_cl_tbl">
              <el-table :data="wzList" max-height="300">
                <el-table-column label="序号" type="index" width="80"></el-table-column>
                <el-table-column label="违法时间" prop="vioDate" show-overflow-tooltip></el-table-column>
                <el-table-column label="违法地点" prop="address" show-overflow-tooltip></el-table-column>
                <el-table-column label="城市名称" prop="city" show-overflow-tooltip></el-table-column>
                <el-table-column label="罚款金额" prop="fine" show-overflow-tooltip></el-table-column>
                <el-table-column label="违章归属地" prop="vioAsPlace" show-overflow-tooltip></el-table-column>
                <el-table-column label="违法行为" prop="vioName" show-overflow-tooltip></el-table-column>
                <el-table-column label="分类类型" prop="vioCategory" show-overflow-tooltip></el-table-column>
                <el-table-column label="采集机关" prop="vioCollectionOffice" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <!-- 车辆入城分析 showType 2 -->
      <div class="vc_rep_cl" id="report_showtype_2">
        <div>
          <h2>2、车辆入城分析</h2>
          <div>
            <h3>2.1 入城记录</h3>
            <div class="rep_cl_tbl">
              <el-table :data="rcList">
                <el-table-column label="序号" type="index" width="100"></el-table-column>
                <el-table-column label="入城时间" prop="inOutTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="入城卡口" prop="inOutBayonetName" show-overflow-tooltip></el-table-column>
                <el-table-column label="抓拍摄像头" prop="inOutDeviceName" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <!-- 车辆出城分析 showType 3 -->
      <div class="vc_rep_cl" id="report_showtype_3">
        <div>
          <h2>3、车辆出城分析</h2>
          <div>
            <h3>3.1 出城记录</h3>
            <div class="rep_cl_tbl">
              <el-table :data="ccList">
                <el-table-column label="序号" type="index" width="100"></el-table-column>
                <el-table-column label="出城时间" prop="inOutTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="出城卡口" prop="inOutBayonetName" show-overflow-tooltip></el-table-column>
                <el-table-column label="抓拍摄像头" prop="inOutDeviceName" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <!-- 车辆行驶轨迹 showType 4 -->
      <div class="vc_rep_cl" id="report_showtype_4">
        <div>
          <h2>4、车辆行驶轨迹</h2>
          <div>
            <h3 style="margin: 0 0 15px 0;">4.1 车辆轨迹</h3>
            <div class="rep_map">
              <div class="rep_map_c" id="map_report_clgj"></div>
              <!-- <ul class="rep_map_o">
                <li @click="mapPicShow = !mapPicShow" style="font-size: 12px;" :style="{'color': mapPicShow ? '#0C70F8' : '#999'}">显示图片</li>
                <li><i class="el-icon-aim" @click="mapChangeState('clgj', 1)"></i></li>
                <li><i class="el-icon-plus" @click="mapChangeState('clgj', 2)"></i></li>
                <li>
                  <i class="el-icon-minus" @click="mapChangeState('clgj', 3)"></i>
                  <span></span>
                </li>
              </ul> -->
            </div>
          </div>
        </div>
      </div>
      <!-- 夜间活动规律 showType 5 -->
      <div class="vc_rep_cl" id="report_showtype_5">
        <div>
          <h2>5、夜间活动规律</h2>
          <div>
            <h3>5.1 夜间出没记录</h3>
            <div class="rep_cl_tbl">
              <el-table :data="yjcmList.allRecords">
                <el-table-column label="设备名称" prop="deviceName"></el-table-column>
                <el-table-column label="过车时间" prop="shotTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="时间间隔" prop="timeSlot" show-overflow-tooltip></el-table-column>
                <el-table-column label="常规行驶时间" prop="refTime" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
            <h3>5.2 出没点分布</h3>
            <div class="rep_map">
              <div class="rep_map_c" id="map_report_yjcm"></div>
              <!-- <ul class="rep_map_o">
                <li><i class="el-icon-aim" @click="mapChangeState('yjcm', 1)"></i></li>
                <li><i class="el-icon-plus" @click="mapChangeState('yjcm', 2)"></i></li>
                <li>
                  <i class="el-icon-minus" @click="mapChangeState('yjcm', 3)"></i>
                </li>
              </ul> -->
              <div class="rep_map_sk">
                <h2>全部时刻</h2>
                <div>
                  <div>
                    <span>出没时间段</span>
                    <span>出没次数</span>
                  </div>
                  <ul>
                    <li>
                      <span>19:00-21:00</span><span>{{yjcmList.period19_21Records ? yjcmList.period19_21Records.length : 0}}次</span>
                    </li>
                    <li>
                      <span>21:00-23:00</span><span>{{yjcmList.period21_23Records ? yjcmList.period21_23Records.length : 0}}次</span>
                    </li>
                    <li>
                      <span>23:00-01:00</span><span>{{yjcmList.period23_1Records ? yjcmList.period23_1Records.length : 0}}次</span>
                    </li>
                    <li>
                      <span>01:00-03:00</span><span>{{yjcmList.period1_3Records ? yjcmList.period1_3Records.length : 0}}次</span>
                    </li>
                    <li>
                      <span>03:00-05:00</span><span>{{yjcmList.period3_5Records ? yjcmList.period3_5Records.length : 0}}次</span>
                    </li>
                    <li>
                      <span>05:00-07:00</span><span>{{yjcmList.period5_7Records ? yjcmList.period5_7Records.length : 0}}次</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <h3>5.3 夜间出没结论</h3>
            <ul class="rep_yjcm">
              <li>
                <span>较常出没时间段：</span>
                <div>
                  <span>{{yjcmjlList ? yjcmjlList.timeSegment : ''}}</span>
                </div>
              </li>
              <li>
                <span>较常出没地点为：</span>
                <div>
                  <span>{{yjcmjlList ? yjcmjlList.address : ''}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 频繁出没分析 showType 6 -->
      <div class="vc_rep_cl" id="report_showtype_6">
        <div>
          <h2>6、频繁出没分析</h2>
          <div>
            <h3>6.1 车辆频繁出没地点</h3>
            <div class="rep_cl_tbl">
              <el-table :data="pfcmList">
                <el-table-column label="序号" type="index" width="100"></el-table-column>
                <el-table-column label="摄像头安装地点" prop="address" show-overflow-tooltip></el-table-column>
                <el-table-column label="车辆出没次数（次）" prop="nums" show-overflow-tooltip></el-table-column>
                <el-table-column label="频繁出没时间段" prop="timeSegment" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <!-- 套牌车分析 showType 7 -->
      <div class="vc_rep_cl" id="report_showtype_7">
        <div>
          <h2>7、套牌车分析</h2>
          <div>
            <h3>7.1 套牌车抓拍信息</h3>
            <div style="padding: 10px;" v-if="tpcList && tpcList.length > 0">
              <ul class="rep_tpc_list">
                <li v-for="(item, index) in tpcList" :key="'tpc_list_' + index">
                  <div>
                    <div class="com_width_to_height" style="margin-bottom: 5px;">
                      <div>
                        <div>
                          <img :src="item.vehicleDto.subStoragePath" :alt="item.vehicleDto.plateNo" :title="item.vehicleDto.plateNo">
                        </div>
                      </div>
                    </div>
                    <p class="tpc_list_fst com_ellipsis"><i class="vl_icon vl_icon_sm_sj"></i>&nbsp;&nbsp;{{ item.vehicleDto.shotTime }}</p>
                    <p class="com_ellipsis"><i class="vl_icon vl_icon_sm_sxt"></i>&nbsp;&nbsp;{{ item.vehicleDto.deviceName }}</p>
                    <p class="com_ellipsis" style="color: #FA453A;"><i class="vl_icon tpc_fake_res"></i>&nbsp;&nbsp;{{ item.fakeReason }}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div v-else>
              <div class="rep_cl_empty">暂无数据</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 同行车辆分析 showType 8 -->
      <!-- <div class="vc_rep_cl" id="report_showtype_8">
        <div>
          <h2>同行车辆分析</h2>
          <div>
            <el-table :data="txclList">
              <el-table-column label="序号" type="index" width="100"></el-table-column>
              <el-table-column label="车牌号码" prop="plateNo" show-overflow-tooltip></el-table-column>
              <el-table-column label="车辆颜色" prop="vehicleColor" show-overflow-tooltip></el-table-column>
              <el-table-column label="车辆类型" prop="vehicleClass" show-overflow-tooltip></el-table-column>
              <el-table-column label="同行次数" prop="shotNum" show-overflow-tooltip></el-table-column>
            </el-table>
          </div>
        </div>
      </div> -->
      <!-- 区域碰撞 showType 9 -->
      <!-- <div class="vc_rep_cl" id="report_showtype_9">
        <div>
          <h2>区域碰撞</h2>
          <div>
            请前往
              <router-link :to="{name: 'vehicle_search_qy'}">
              区域碰撞
            </router-link>
            进行操作查看
          </div>
        </div>
      </div> -->
    </div>
  </div>
  <!-- http://localhost:9101/#/vehicle-report-save?pn=%E6%B9%98NCP100&st=2019-07-12%2000%3A00%3A00&et=2019-07-14%2023%3A59%3A59 -->
</template>
<script>
import vehicleBreadcrumb from '../breadcrumb.vue';
import {formatDate} from '@/utils/util.js';
import {mapXupuxian} from '@/config/config.js';
import {getVehicleInvestigationReport} from '@/views/index/api/api.judge.js';
export default {
  components: {vehicleBreadcrumb},
  data () {
    return {
      searchLoading: true,

      time: ['', ''],

      clInfo: null,
      wzList: [], // 违章信息
      rcList: [], // 入城记录
      ccList: [], // 出城记录
      yjcmList: {}, // 夜间出没记录
      yjcmjlList: [],  // 夜间出没结论
      yjcmHoverWindow: null,
      pfcmList: [], // 频繁出没分析
      txclList: [], // 同行车分析

      tpcList: [], // 套牌车

      clgjList: [], // 车辆轨迹

      showType: 1,

      zoom: 11,
      yjcmMap: null,
      clgjMap: null,

      pn: ''

    }
  },
  mounted () {
    // $('html, body').css({ 'height': 'auto', width: '210mm' });
    // min-width: 1200px; max-width: 1800px;
    $('html, body').css({
      'margin': '0 auto',
      'height': 'auto',
      'min-width': '1200px',
      'max-width': '1800px'
    });
    $('#app').css({ 'height': 'auto' });
    $('#app').css({ 'height': 'auto' });
    this.pn = this.$route.query.pn;
    this.time = [this.$route.query.st, this.$route.query.et];
    $('title').text('车辆综合分析报告 - ' + this.pn);
    this.initClgjMap();
    this.initYjcmMap();
    this.searchSubmit();
  },
  methods: {
    // 湘AN8888 2019-07-01 00:00:00 2019-07-04 00:00:00
    searchSubmit () {
      this.searchLoading = true;
      let params = {
        plateNo: this.$route.query.pn,
        startTime: this.time[0],
        endTime: this.time[1]
      }
      getVehicleInvestigationReport(params).then(res => {
        if (res && res.data && res.data.vehicleArchivesDto) {
          let data = res.data;
          this.clInfo = data.vehicleArchivesDto;
          this.wzList = data.violationDtoList;
          this.rcList = data.inCityDtoList;
          this.ccList = data.outCityDtoList;
          this.yjcmList = data.analysisResultDto;
          this.yjcmjlList = data.nightHauntConclusionDto;
          this.pfcmList = data.oftenCarAnalysisDtoList;
          this.tpcList = data.fakePlateResultDtoList;
          this.txclList =  data.tailBehindListForReportList; // 同行车
          this.clgjList = data.struVehicleDtoList;
          this.setMapMarkerForYjcm(); // 夜间出没
          this.setMapMarkerForClgj(); // 车辆轨迹
          // $('title').text('车辆侦察报告 - ' + this.clInfo.plateno);
          this.$nextTick(() => {
            this.$msgbox({
              title: '确认',
              message: '确认导出吗？',
              showCancelButton: true,
              confirmButtonText: ' 确定 ',
              cancelButtonText: ' 取消 ',
              beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true;
                  instance.confirmButtonText = '正在生成文件...';
                  let _this = this;
                  let pdf = new window.jsPDF('p','pt','a3');
                  // 设置打印比例 越大打印越小
                  pdf.internal.scaleFactor = 2;
                  let options = {
                    pagesplit: true, //设置是否自动分页
                    background: '#FFFFFF'   //如果导出的pdf为黑色背景，需要将导出的html模块内容背景 设置成白色。
                  };
                  pdf.addHTML($('#vehicle_report_save_c')[0], 0, 0, options, function () {
                      pdf.save('车辆侦察报告_' + _this.pn + '_' +
                        formatDate(params.startTime, 'yyyyMMdd') + '-'  + formatDate(params.endTime, 'yyyyMMdd') + '.pdf');
                  });
                  setTimeout(() => {
                    done();
                    setTimeout(() => {
                      instance.confirmButtonLoading = false;
                    }, 300);
                  }, 1000);
                } else {
                  done();
                }
              }
            }).then(() => {
            });
          });
        }
      }).catch(() => {
        this.searchLoading = false;
      });
    },

    setMapMarkerForYjcm () {
      if (this.yjcmList && this.yjcmList.allRecords && this.yjcmList.allRecords.length > 0) {
        let _this = this;
        let oList = {};
        for (let i = 0; i < this.yjcmList.allRecords.length; i++) {
          let _o = this.yjcmList.allRecords[i];
          if (!oList[_o.deviceId]) {
            oList[_o.deviceId] = Object.assign({}, _o, {
              CM_shotTimes: [_o.shotTime]
            });
          } else {
            oList[_o.deviceId].CM_shotTimes.push(_o.shotTime);
          }
        }
        // console.log('oList', oList);
        for (let key in oList) {
          let _oo = oList[key];
          if (_oo.longitude > 0 && _oo.latitude > 0) {
            // console.log('_oo', _oo);
            new window.AMap.Marker({ // 添加自定义点标记
              map: _this.yjcmMap,
              position: [_oo.longitude, _oo.latitude], // 基点位置 [116.397428, 39.90923]
              offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              // extData: obj,
              // 自定义点标记覆盖物内容
              content: '<div class="map_icons vl_icon vl_icon_cl cl_report_cm">' +
                '<div class="cl_report_hw"><div>' +
                '<p>' + _oo.deviceName + '</p>' +
                '<h3>' + _oo.CM_shotTimes.length + '次</h3>' +
                '</div></div></div>'
            });
          }
        }
        this.yjcmMap.setFitView();
      }
    },
    setMapMarkerForClgj () {
      let gjPath = [];
      let ism = this.clgjList.length > 1;
      for (let i = 0; i < this.clgjList.length; i++) {
        // console.log('doMark', obj);
        let obj = this.clgjList[i];
        let offset = [-20, -48];
        let sClass = 'cl_report_gj';
        if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
          // 起点
          if (ism && i === 0) {
            offset = [-40, -40];
            sClass += ' cl_report_gj_qz cl_report_gj_q';
          }
          // 终点
          if (ism && i === (this.clgjList.length - 1)) {
            offset = [-40, -40];
            sClass += ' cl_report_gj_qz cl_report_gj_z';
          }
          let  sVideo = '';
          if (obj.storagePath) {
            /* sVideo = '<div><img class="bigImg" src="' + obj.storagePath + '" controls></img></div>' +
              '<p>' + obj.shotTime + '</p>'; */
            sVideo = '<p>' + obj.shotTime + '</p>';
          }
          new window.AMap.Marker({ // 添加自定义点标记
            map: this.clgjMap,
            position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
            offset: new window.AMap.Pixel(offset[0], offset[1]), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            // extData: obj,
            // 自定义点标记覆盖物内容
            content: '<div title="' + obj.deviceName + '" class="' + sClass + '">' +
              sVideo +
              '</div>'
          });
          gjPath.push([obj.shotPlaceLongitude, obj.shotPlaceLatitude]);
        }
      }
      // 绘制轨迹
      new window.AMap.Polyline({
          map: this.clgjMap,
          path: gjPath,
          showDir: true,
          strokeColor: "#61c772",  //线颜色
          strokeOpacity: 1,     //线透明度
          strokeWeight: 8,      //线宽
          strokeStyle: "solid"  //线样式
      });
      this.clgjMap.setFitView();
    },
    initClgjMap () {
      // 初始化地图
      let map = new window.AMap.Map('map_report_clgj', {
        zoom: this.zoom,
        center: mapXupuxian.center,
        zooms: [2, 18],
        scrollWheel: false
      });
      map.setMapStyle('amap://styles/light');
      // map.setMapStyle('amap://styles/a00b8c5653a6454dd8a6ec3b604ec50c');
      // console.log('_config', _config)
      this.clgjMap = map;
    },
    initYjcmMap () {
      // 初始化地图
      let map = new window.AMap.Map('map_report_yjcm', {
        zoom: 11,
        center: mapXupuxian.center,
        zooms: [2, 18],
        scrollWheel: false
      });
      map.setMapStyle('amap://styles/light');
      // map.setMapStyle('amap://styles/a00b8c5653a6454dd8a6ec3b604ec50c');
      // console.log('_config', _config)
      this.yjcmMap = map;
    },
    cktxjlEvent () {
    },
    mapChangeState (type, state) {
      let _map = this.yjcmMap;
      if (type === 'clgj') { _map = this.clgjMap; }
      if (state === 1) {
        _map.setFitView();
        // _map.setZoomAndCenter(this.zoom, mapXupuxian.center);
      } else if (state === 2) {
        _map.setZoom(_map.getZoom() + 1);
      } else if (state === 3) {
        _map.setZoom(_map.getZoom() - 1);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#vehicle_report_save_c {
  margin: 0 auto;
}
.vc_rep_c_tt {
  text-align: center;
  font-size: 20px; font-weight: bold;
  padding-top: 20px;
}
.vc_rep_c_ti {
  padding-top: 10px;
  overflow: hidden;
  text-align: center;
  > span {color: #666; }
}
.vc_rep {
  position: relative;
  height: 100%;
  padding-top: 50px;
  > .vc_rep_t {
    position: absolute; top: 50px; left: 0;
    width: 100%;
    background-color: #fff;
  }
  > .vc_rep_c {
    padding-top: 99px;
    height: 100%;
    > div {
      height: 100%;
      padding: 10px 0 10px 0;
      overflow: auto;
      overflow-x: hidden;
      overflow-y: auto;
      > div {
      }
    }
  }
}
.vc_rep_sc {
  overflow: hidden;
  padding: 20px 20px 5px 20px;
}
.vc_rep_mu {
  overflow: hidden;
  border-bottom: 1px solid #eee;
  > li {
    float: left;
    padding: 0 20px;
    > span {
      color: #333;
      display: inline-block;
      height: 40px; line-height: 40px;
      padding: 0 2px;
      border-bottom: 2px solid #fff;
      cursor: pointer;
      &.vc_rep_mu_sed {
        cursor: default;
        color: #0C70F8;
        border-bottom-color: #0C70F8;
      }
    }
  }
}
.vc_rep_cl {
  padding: 10px 20px;
  > div {
    background:rgba(255,255,255,1);
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    > h2 {
      height: 48px; line-height: 48px;
      color: #333; font-size: 16px; font-weight: bold;
      padding-left: 18px;
    }
    > div {
      padding: 5px 20px 0 20px;
      > h3 {
        color: #333; font-size: 16px;
        padding: 0 0 15px 0;
        border-bottom: 1px solid #eee;
      }
    }
  }

  .rep_cl_empty { text-align: center; color: #999; padding: 20px 0 20px 0; }
  .rep_cl_tbl { padding: 20px 0 20px 0; }
  .rep_clxx {
    overflow: hidden;
    padding-top: 10px; padding-bottom: 20px;
    > li {
      width: 25%;
      float: left;
      padding: 8px 0;
      > span {
        float: left;
        width: 120px;
        padding-right: 15px;
        color: #666;
        text-align: right;
      }
      > div {
        margin-left: 120px;
        color: #333;
      }
    }
  }
  .rep_yjcm {
    padding-top: 10px; padding-bottom: 20px;
    > li {
      overflow: hidden;
      padding: 5px 0;
      > span {
        float: left;
        width: 150px;
        padding-right: 5px;
        color: #666;
        text-align: right;
      }
      > div {
        margin-left: 150px;
        color: #333;
        > span {
          display: inline-block;
          padding: 0 10px;
        }
      }
    }
  }
  .rep_tpc_list {
    overflow: hidden;
    > li {
      float: left;
      width: 20%;
      padding: 10px;
      > div {
        border-radius:4px;
        border:1px solid rgba(211,211,211,1);
        padding-bottom: 10px;
        > p {
          padding-left: 10px;
          height: 24px; line-height: 24px;
          overflow: hidden;
          color: #999;
          &.tpc_list_fst { color: #333; }
          > i { position: relative; top: 2px; }
        }
      }
    }
  }
  .rep_map {
    position: relative;
    width: 100%; height: 520px; padding-bottom: 20px;
    > .rep_map_c {
      width: 100%; height: 100%;
    }
    > .rep_map_o {
      position: absolute; bottom: 30px; right: 10px;
      padding: 5px 10px;
      background-color: #fff;
      > li {
        padding: 10px 0;
        width: 60px;
        font-size: 20px; font-weight: bold;
        text-align: center;
        cursor: pointer;
        color: #999;
        border-top: 1px solid #F2F2F2;
        &:nth-child(1) { padding: 15px 0; border-top: 0; font-weight: normal; }
        &:nth-child(2) { }
        &:nth-child(3) { 
          position: relative;
          > span {
            display: block;
            position: absolute; top: 0; left: 10px;
            width: 34px; height: 1px;
            background-color: #ddd;
            overflow: hidden;
          }
        }
        &:hover { color: #0C70F8; }
      }
    }
    > .rep_map_sk {
      position: absolute; top: 10px; left: 10px;
      width: 260px;
      background-color: #fff;
      box-shadow:4px 0px 15px 0px rgba(131,131,131,0.23),0px 0px 13px 0px rgba(255,255,255,0.55);
      > h2 {
        height: 50px; line-height: 50px;
        padding-left: 20px;
        border-bottom: 1px solid #ddd;
        font-size: 16px;
      }
      > div {
        padding: 0;
        > div {
          padding: 10px 20px 0 20px;
          > span {
            display: inline-block;
            width: 55%;
            height: 40px; line-height: 40px;
            background:rgba(246,246,246,1);
            border-radius:4px 4px 0px 0px;
            font-weight: bold;
            color: #333;
            text-align: center;
            &:last-child {
              width: 45%;
            }
          }
        }
        > ul {
          max-height: 300px;
          overflow: auto;
          padding: 0 20px 10px 20px;
          > li {
            border-bottom: 1px solid #ddd;
            > span {
              display: inline-block;
              width: 55%;
              height: 40px; line-height: 40px;
              color: #333;
              padding-left: 20px;
              &:last-child {
                width: 45%;
              }
            }
            &:last-child {
              border-bottom: 0;
            }
          }
        }
      }
    }
  }
}
.rep_save_cover {
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed; top: 0; left: 0;
  height: 100%; width: 100%;
  > p {
    text-align: center;
    padding-top: 10px;
    height: 30px; line-height: 30px;
    > i { font-size: 18px; color: #000; position: relative; top: 2px; }
    > span {
      display: inline-block;
      margin-left: 10px;
      color: #000;
    }
  }
}
</style>
<style lang="scss">
.cl_report_gj {
  position: relative;
  display: inline-block;
  width: 42px; height: 49px;
  background: url(../../../../../assets/img/icons/icons_sxt.png) center center no-repeat;
  > div {
    position: absolute; bottom: -20px; left: 95%; z-index: 1;
    width: 160px; height: 120px;
    background-color: #fff;
    border-radius: 3px;
    &:hover { z-index: 2; }
    > img {
      width: 100%; height: 100%;
    }
  }
  > p {
    position: absolute; bottom: 17px; left: 95%; z-index: 1;
    width: 150px; height: 20px; line-height: 20px;
    background-color: #0C70F8;
    border-radius: 10px;
    color: #fff; font-size: 12px;
    text-align: center;
    &:hover { z-index: 2; }
  }
  &.cl_report_gj_qz {
    width: 80px; height: 80px;
    > div {
      bottom: -25px; left: 100%;
    }
    > p {
      bottom: 27px; left: 100%;
    }
  }
  &.cl_report_gj_q {
    background: url(../../../../../assets/img/icons/icons_qd.png) center center no-repeat;
  }
  &.cl_report_gj_z {
    background: url(../../../../../assets/img/icons/icons_zd.png) center center no-repeat;
  }
}
.cl_report_cm {
  position: relative;
  > .cl_report_hw {
    position: absolute; bottom: 125%; left: -90px; z-index: 1;
    background-color: #fff;
    background:rgba(255,255,255,1);
    box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
    padding: 10px 20px;
    border-radius: 4px;
    > div {
      position: relative;
      width: 180px;
      > p {
        color: #666;
        padding-bottom: 5px;
        text-align: center;
      }
      > h3 {
        color: #333; font-weight: bold; font-size: 20px;
        text-align: center;
      }
      > ul {
        display: none;
        position: absolute; top: -10px; left: 180px;
        background-color: #fff;
        padding: 5px 0;;
        > li {
          padding: 5px 10px 5px 15px;
          color: #666;
          word-break:keep-all; white-space:nowrap;
          &:first-child { color: #999; padding-left: 10px; }
        }
      }
      &:hover {
        > ul { display: block; }
      }
      &::after {
        border-bottom-color: rgba(0, 0, 0, 0.2);
        content: "";
        display: inline-block;
        position: absolute;
      }
      &::after {
        left: 70px; bottom: -20px;
        border-top: 20px solid #fff;
        border-left: 20px solid transparent;
        border-right: 20px solid transparent;
      }
    }
  }
}
</style>