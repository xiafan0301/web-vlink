<template>
  <div class="vehicle_content">
    <div class="vc_rep_bd" is="vehicleBreadcrumb" :oData="[{name: '车辆侦察报告'}]"></div>
    <div class="vc_rep">
      <div class="vc_rep_t">
        <div class="vc_rep_sc">
          <el-input style="width: 200px;" v-model="searchForm.plateNo" placeholder="请输入车牌信息" size="small"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
          <el-date-picker style="width: 280px;" size="small" 
            v-model="searchForm.time"
            type="daterange"
            align="left"
            unlink-panels
            :editable="false"
            :clearable="false"
            range-separator="至"
            start-placeholder="开始日期"
            @change="pickerChanged"
            :picker-options="pickerOptions"
            end-placeholder="结束日期">
          </el-date-picker>&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button size="small" :disabled="!searchForm.plateNo" :loading="searchLoading" type="primary" @click="searchSubmit">查询</el-button>
        </div>
        <ul class="vc_rep_mu">
          <li><span :class="{'vc_rep_mu_sed': showType === 1}" @click="changeShowType(1)">车辆档案信息</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 2}" @click="changeShowType(2)">车辆入城信息</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 3}" @click="changeShowType(3)">车辆出城信息</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 4}" @click="changeShowType(4)">车辆行驶轨迹</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 5}" @click="changeShowType(5)">夜间活动规律</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 6}" @click="changeShowType(6)">频繁出没分析</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 7}" @click="changeShowType(7)">套牌车分析</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 8}" @click="changeShowType(8)">同行车辆分析</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 9}" @click="changeShowType(9)">区域碰撞</span></li>
        </ul>
      </div>
      <div class="vc_rep_c">
        <div id="report_content">
          <div>
            <!-- 车辆档案信息-车辆信息  showType 1 -->
            <div class="vc_rep_cl" id="report_showtype_1">
              <div>
                <h2>车辆档案信息-车辆信息</h2>
                <div>
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
                </div>
              </div>
            </div>
            <!-- 车辆档案信息-违章信息 -->
            <div class="vc_rep_cl">
              <div>
                <h2>车辆档案信息-违章信息</h2>
                <div>
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
            <!-- 车辆入城分析-入城记录 showType 2 -->
            <div class="vc_rep_cl" id="report_showtype_2">
              <div>
                <h2>车辆入城分析-入城记录</h2>
                <div>
                  <el-table :data="rcList">
                    <el-table-column label="序号" type="index" width="100"></el-table-column>
                    <el-table-column label="入城时间" prop="inOutTime" show-overflow-tooltip></el-table-column>
                    <el-table-column label="入城卡口" prop="inOutBayonetName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="抓拍摄像头" prop="inOutDeviceName" show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <!-- 车辆出城分析-出城记录 showType 3 -->
            <div class="vc_rep_cl" id="report_showtype_3">
              <div>
                <h2>车辆出城分析-出城记录</h2>
                <div>
                  <el-table :data="ccList">
                    <el-table-column label="序号" type="index" width="100"></el-table-column>
                    <el-table-column label="出城时间" prop="inOutTime" show-overflow-tooltip></el-table-column>
                    <el-table-column label="出城卡口" prop="inOutBayonetName" show-overflow-tooltip></el-table-column>
                    <el-table-column label="抓拍摄像头" prop="inOutDeviceName" show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <!-- 车辆行驶轨迹-车辆轨迹 showType 4 -->
            <div class="vc_rep_cl" id="report_showtype_4">
              <div>
                <h2>车辆行驶轨迹-车辆轨迹</h2>
                <div style="padding: 0;">
                  <div class="rep_map">
                    <div class="rep_map_c" id="map_report_clgj"></div>
                    <ul class="rep_map_o">
                      <li><i class="vl_icon vl_icon_map_o01" @click="mapChangeState('clgj', 1)"></i></li>
                      <li><i class="vl_icon vl_icon_map_o02" @click="mapChangeState('clgj', 2)"></i></li>
                      <li>
                        <i class="vl_icon vl_icon_map_o03" @click="mapChangeState('clgj', 3)"></i>
                        <span></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!-- 夜间活动规律-夜间出没记录 showType 5 -->
            <div class="vc_rep_cl" id="report_showtype_5">
              <div>
                <h2>夜间活动规律-夜间出没记录</h2>
                <div>
                  <el-table :data="yjcmList.allRecords">
                    <el-table-column label="设备名称" prop="deviceName"></el-table-column>
                    <el-table-column label="过车时间" prop="shotTime" show-overflow-tooltip></el-table-column>
                    <el-table-column label="时间间隔" prop="timeQuantum" show-overflow-tooltip></el-table-column>
                    <el-table-column label="参考时间" prop="timeSlot" show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <!-- 夜间活动规律-出没点分布 -->
            <div class="vc_rep_cl">
              <div>
                <h2>夜间活动规律-出没点分布</h2>
                <div style="padding: 0;">
                  <div class="rep_map">
                    <div class="rep_map_c" id="map_report_yjcm"></div>
                    <ul class="rep_map_o">
                      <li><i class="vl_icon vl_icon_map_o01" @click="mapChangeState('yjcm', 1)"></i></li>
                      <li><i class="vl_icon vl_icon_map_o02" @click="mapChangeState('yjcm', 2)"></i></li>
                      <li>
                        <i class="vl_icon vl_icon_map_o03" @click="mapChangeState('yjcm', 3)"></i>
                        <span></span>
                      </li>
                    </ul>
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
                </div>
              </div>
            </div>
            <!-- 夜间活动规律-夜间出没结论 -->
            <div class="vc_rep_cl">
              <div>
                <h2>夜间活动规律-夜间出没结论</h2>
                <div>
                  <ul class="rep_yjcm">
                    <li>
                      <span>较常在出没时间段：</span>
                      <div>
                        <template v-for="(item, index) in yjcmjlList">
                          <template v-if="index != 0">|</template>
                          <span :key="'yjcmjl1_' + index">{{item.timeSegment}}</span>
                        </template>
                      </div>
                    </li>
                    <li>
                      <span>较常出没地点为：</span>
                      <div>
                        <template v-for="(item, index) in yjcmjlList">
                          <template v-if="index != 0">|</template>
                          <span :key="'yjcmjl2_' + index">{{item.address}}</span>
                        </template>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- 频繁出没分析 showType 6 -->
            <div class="vc_rep_cl" id="report_showtype_6">
              <div>
                <h2>频繁出没分析</h2>
                <div>
                  <el-table :data="pfcmList">
                    <el-table-column label="序号" type="index" width="100"></el-table-column>
                    <el-table-column label="摄像头安装地点" prop="address" show-overflow-tooltip></el-table-column>
                    <el-table-column label="车辆出没次数（次）" prop="nums" show-overflow-tooltip></el-table-column>
                    <el-table-column label="较多出没时间" prop="timeSegment" show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <!-- 套牌车分析 showType 7 -->
            <div class="vc_rep_cl" id="report_showtype_7">
              <div>
                <h2>套牌车分析</h2>
                <div style="padding: 10px;" v-if="tpcList && tpcList.length > 0">
                  <ul class="rep_tpc_list">
                    <li v-for="(item, index) in tpcList" :key="'tpc_list_' + index">
                      <div>
                        <div class="com_width_to_height" style="margin-bottom: 5px;">
                          <div>
                            <div>
                              <img :src="item.vehicleDto.storagePath" :alt="item.vehicleDto.plateNo" :title="item.vehicleDto.plateNo">
                            </div>
                          </div>
                        </div>
                        <p class="tpc_list_fst com_ellipsis"><i class="vl_icon vl_icon_sm_sj"></i>&nbsp;&nbsp;{{ item.vehicleDto.shotTime }}</p>
                        <p class="com_ellipsis"><i class="vl_icon vl_icon_sm_sxt"></i>&nbsp;&nbsp;{{ item.vehicleDto.deviceName }}</p>
                        <p class="com_ellipsis"><i class="vl_icon vl_icon_sm_sxt"></i>&nbsp;&nbsp;{{ item.fakeReason }}</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div v-else>
                  <div class="rep_cl_empty">暂无数据</div>
                </div>
              </div>
            </div>
            <!-- 同行车辆分析 showType 8 -->
            <div class="vc_rep_cl" id="report_showtype_8">
              <div>
                <h2>同行车辆分析</h2>
                <div>
                  <el-table :data="txclList">
                    <el-table-column label="序号" type="index" width="100"></el-table-column>
                    <el-table-column label="车牌号码" prop="plateNo" show-overflow-tooltip></el-table-column>
                    <el-table-column label="号牌颜色" prop="plateColor" show-overflow-tooltip></el-table-column>
                    <el-table-column label="车辆颜色" prop="vehicleColor" show-overflow-tooltip></el-table-column>
                    <el-table-column label="车辆型号" prop="vehicleStyles" show-overflow-tooltip></el-table-column>
                    <el-table-column label="同行次数" prop="" show-overflow-tooltip></el-table-column>
                   <!--  <el-table-column
                      label="操作"
                      width="120">
                      <template slot-scope="scope">
                        <el-button
                          @click.native.prevent="cktxjlEvent(scope.$index, tableData)"
                          type="text" size="small">
                          查看同行记录
                        </el-button>
                      </template>
                    </el-table-column> -->
                  </el-table>
                </div>
              </div>
            </div>
            <!-- 区域碰撞 showType 9 -->
            <div class="vc_rep_cl" id="report_showtype_9">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vehicleBreadcrumb from '../breadcrumb.vue';
import {formatDate} from '@/utils/util.js';
import {mapXupuxian} from '@/config/config.js';
import {getVehicleInvestigationReport, JfoGETSurveillanceObject} from '@/views/index/api/api.judge.js';
export default {
  components: {vehicleBreadcrumb},
  data () {
    return {
      searchForm: {
        plateNo: '', // 沪D008CP 沪A009CP 湘AN8888
        time: [new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), new Date()]
      },
      searchLoading: false,

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

      pickerOptions: {
        disabledDate (d) {
          return d > new Date();
        }
      }
    }
  },
  mounted () {
    this.initClgjMap();
    this.initYjcmMap();
  },
  methods: {
    // 湘AN8888 2019-07-01 00:00:00 2019-07-04 00:00:00
    searchSubmit () {
      this.searchLoading = true;
      getVehicleInvestigationReport({
        plateNo: this.searchForm.plateNo,
        startTime: formatDate(this.searchForm.time[0]),
        endTime: formatDate(this.searchForm.time[1])
      }).then(res => {
        if (res && res.data && res.data.vehicleArchivesDto) {
          let data = res.data;
          this.clInfo = data.vehicleArchivesDto;
          this.wzList = data.violationDtoList;
          this.rcList = data.inCityDtoList;
          this.ccList = data.outCityDtoList;
          this.yjcmList = data.analysisResultDto;
          this.yjcmjlList = data.nightHauntConclusionList;
          this.pfcmList = data.oftenCarAnalysisDtoList;
          this.tpcList = data.fakePlateResultDtoList;
          this.txclList =  data.tailBehindListForReportList; // 同行车
          this.clgjList = data.struVehicleDtoList;
          this.setMapMarkerForYjcm(); // 夜间出没
          this.setMapMarkerForClgj(); // 车辆轨迹
        }
        this.searchLoading = false;
      }).catch(error => {
        console.log('error');
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
          let marker = new window.AMap.Marker({ // 添加自定义点标记
            map: _this.yjcmMap,
            position: [_oo.longitude, _oo.latitude], // 基点位置 [116.397428, 39.90923]
            offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            // extData: obj,
            // 自定义点标记覆盖物内容
            content: '<div class="map_icons vl_icon vl_icon_cl"></div>'
          });
          marker.on('mouseover', function (mEvent) {
            // let iW = Math.round($(window).width() * 0.15);
            // let extD = mEvent.target.F.extData;
            // console.log('mEvent', mEvent);
            let sContent = '<div class="cl_report_hw"><div>' +
              '<p>' + _oo.deviceName + '</p>' +
              '<h3>' + _oo.CM_shotTimes.length + '次</h3>' +
              '<ul><li>出没时间:</li>';
            for (let j = 0; j < _oo.CM_shotTimes.length; j++) {
              sContent += '<li>' + _oo.CM_shotTimes[j] + '</li>';
            }
            sContent += '</ul></div></div>';
            let aOffSet = [0, -50];
            _this.yjcmHoverWindow = new AMap.InfoWindow({
              isCustom: true,
              closeWhenClickMap: true,
              offset: new AMap.Pixel(aOffSet[0], aOffSet[1]), // 相对于基点的偏移位置
              content: sContent
            });
            let aCenter = mEvent.target.B.position;
            _this.yjcmHoverWindow.open(_this.yjcmMap, aCenter);
          });
          /* marker.on('mouseout', function (mEvent) {
            // if (_this.yjcmHoverWindow) { _this.yjcmHoverWindow.close(); }
          }); */
        }
        this.yjcmMap.setFitView();
      }
    },
    setMapMarkerForClgj () {
      let gjPath = [];
      for (let i = 0; i < this.clgjList.length; i++) {
        // console.log('doMark', obj);
        let obj = this.clgjList[i];
        let  sVideo = '';
        if (obj.videoPath) {
          sVideo = '<div><video src="' + obj.videoPath + '" controls></video></div>';
        }
        let marker = new window.AMap.Marker({ // 添加自定义点标记
          map: this.clgjMap,
          position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
          offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // extData: obj,
          // 自定义点标记覆盖物内容
          content: '<div class="map_icons vl_icon vl_icon_sxt cl_report_gj">' +
            sVideo +
            '</div>'
        });
        gjPath.push([obj.shotPlaceLongitude, obj.shotPlaceLatitude]);
      }
      // 绘制轨迹
      var polyline = new window.AMap.Polyline({
          map: this.clgjMap,
          path: gjPath,
          strokeColor: "#61c772",  //线颜色
          strokeOpacity: 1,     //线透明度
          strokeWeight: 2,      //线宽
          strokeStyle: "solid"  //线样式
      });
      this.clgjMap.setFitView();
    },

    changeShowType (val) {
      this.showType = val;
      let $tar = $('#report_showtype_' + val);
      if ($tar && $tar.length > 0) {
        let osTop = $tar.offset().top -250;
        let sTop = $('#report_content').scrollTop();
        // $('#report_content').scrollTop(osTop + sTop);
        $('#report_content').animate({scrollTop: (osTop + sTop) + 'px'}, 500);
      }
    },
    initClgjMap () {
      // 初始化地图
      let map = new window.AMap.Map('map_report_clgj', {
        zoom: this.zoom,
        center: mapXupuxian.center,
        zooms: [2, 18]
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
        zooms: [2, 18]
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
    },
    pickerChanged () {
      if ((this.searchForm.time[1].getTime() - this.searchForm.time[0].getTime()) > 2 * 24 * 60 * 60 * 1000) {
        this.searchForm.time[1] = new Date(this.searchForm.time[0].getTime() + 2 * 24 * 60 * 60 * 1000);
        this.$message('最多不能超过3天.');
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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
  padding: 20px 0 5px 20px;
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
      color: #333; font-size: 16px;
      padding-left: 20px;
      border-bottom: 1px solid #eee;
    }
    > div {
      padding: 20px 20px;
    }
  }

  .rep_cl_empty { text-align: center; color: #999; }

  .rep_clxx {
    overflow: hidden;
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
    width: 100%; height: 500px;
    > .rep_map_c {
      width: 100%; height: 100%;
    }
    > .rep_map_o {
      position: absolute; bottom: 10px; right: 10px;
      > li {
        padding: 10px;
        background-color: #fff;
        box-shadow: 0px 5px 5px 0px rgba(131,131,131,0.28);
        &:nth-child(1) { margin-bottom: 10px; }
        &:nth-child(2) { border-bottom: 0; }
        &:nth-child(3) { 
          border-top: 0;
          position: relative;
          > span {
            display: block;
            position: absolute; top: 0; left: 10px;
            width: 34px; height: 1px;
            background-color: #ddd;
            overflow: hidden;
          }
        }
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
</style>
<style lang="scss">
.cl_report_hw {
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
.cl_report_gj {
  position: relative;
  > div {
    position: absolute; top: -40px; left: 105%; z-index: 1;
    width: 218px; height: 122px;
    background-color: #fff;
    border-radius: 3px;
    &:hover { z-index: 2; }
    > video {
      width: 100%; height: 100%;
    }
  }
}
</style>