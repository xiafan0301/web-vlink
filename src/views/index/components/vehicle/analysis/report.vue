<template>
  <div class="vehicle_content" :class="{'map_pic_show': mapPicShow}">
    <div class="vc_rep_bd" is="vehicleBreadcrumb" :oData="[{name: '车辆综合分析报告'}]"></div>
    <div class="vc_rep">
      <div class="vc_rep_t">
        <div class="vc_rep_sc">
          <el-date-picker style="width: 420px;" size="small" 
            class="vl_date"
            v-model="searchForm.time"
            type="datetimerange"
            align="left"
            unlink-panels
            :editable="false"
            :clearable="false"
            time-arrow-control
            range-separator="至"
            start-placeholder="开始日期"
            @change="pickerChanged"
            :picker-options="pickerOptions"
            end-placeholder="结束日期">
          </el-date-picker>&nbsp;&nbsp;&nbsp;&nbsp;
          <el-input style="width: 200px;" v-model="searchForm.plateNo" placeholder="请输入车牌信息" size="small"></el-input>&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button size="small" :disabled="!searchForm.plateNo" :loading="searchLoading" type="primary" @click="searchSubmit">查询</el-button>
          <!-- <el-button style="float: right;" size="small" :disabled="!clInfo || searchLoading" type="primary" @click="vehicleExport">导出为PDF</el-button> -->
          
          <router-link v-if="clInfo && !searchLoading" target="_blank" class="vc_rep_cs_dc" :to="{name: 'vehicle_report_save', query: {
            pn: searchForm.plateNo,
            st: timeStr[0],
            et: timeStr[1]
            }}">导出报告</router-link>
          <a class="vc_rep_cs_dc vc_rep_cs_dc_dis" v-else>导出报告</a>
        </div>
        <ul class="vc_rep_mu">
          <li><span :class="{'vc_rep_mu_sed': showType === 1}" @click="changeShowType(1)">车辆档案信息</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 2}" @click="changeShowType(2)">车辆入城信息</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 3}" @click="changeShowType(3)">车辆出城信息</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 4}" @click="changeShowType(4)">车辆行驶轨迹</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 5}" @click="changeShowType(5)">夜间活动规律</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 6}" @click="changeShowType(6)">频繁出没分析</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 7}" @click="changeShowType(7)">套牌车分析</span></li>
          <li><span :class="{'vc_rep_mu_sed': showType === 8}" @click="changeShowType(8)">落脚点分析</span></li>
          <!-- <li><span :class="{'vc_rep_mu_sed': showType === 8}" @click="changeShowType(8)">同行车辆分析</span></li> -->
          <!-- <li><span :class="{'vc_rep_mu_sed': showType === 9}" @click="changeShowType(9)">区域碰撞</span></li> -->
        </ul>
      </div>
      <div class="vc_rep_c">
        <div id="report_content">
          <div>
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
                    <ul class="rep_map_o">
                      <li @click="mapPicShow = !mapPicShow" style="font-size: 12px;" :style="{'color': mapPicShow ? '#0C70F8' : '#999'}">显示图片</li>
                      <li><i class="el-icon-aim" @click="mapChangeState('clgj', 1)"></i></li>
                      <li><i class="el-icon-plus" @click="mapChangeState('clgj', 2)"></i></li>
                      <li>
                        <i class="el-icon-minus" @click="mapChangeState('clgj', 3)"></i>
                        <span></span>
                      </li>
                    </ul>
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
                    <ul class="rep_map_o">
                      <li><i class="el-icon-aim" @click="mapChangeState('yjcm', 1)"></i></li>
                      <li><i class="el-icon-plus" @click="mapChangeState('yjcm', 2)"></i></li>
                      <li>
                        <i class="el-icon-minus" @click="mapChangeState('yjcm', 3)"></i>
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
                                <img class="bigImg" :src="item.vehicleDto.StorageUrl1" :alt="item.vehicleDto.plateNo" :title="item.vehicleDto.plateNo">
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
            <!-- 落脚点 showType 8 -->
            <div class="vc_rep_cl" id="report_showtype_8">
              <div>
                <h2>8、落脚点分析</h2>
                <div>
                  <div class="rep_map">
                    <div class="rep_map_c" id="map_report_yjcm1" style="border:1px solid rgba(211,211,211,1);"></div>
                    <ul class="rep_map_o">
                      <li><i class="el-icon-aim" @click="mapChangeState('yjcm1', 1)"></i></li>
                      <li><i class="el-icon-plus" @click="mapChangeState('yjcm1', 2)"></i></li>
                      <li>
                        <i class="el-icon-minus" @click="mapChangeState('yjcm1', 3)"></i>
                      </li>
                    </ul>
                    <div class="rep_map_sk rep_map_sk1">
                      <h2 style="border-bottom: 0">分析结果</h2>
                      <div>
                        <div>
                          <span>序号</span>
                          <span>落脚地点位置</span>
                          <span>停留时长</span>
                        </div>
                        <ul>
                          <li v-for="(item, index) in stopOverRecordList" :key="index" @click="createInfoWindow(item)" style="cursor: pointer">
                            <span style="padding-left: 10px">{{index + 1}}</span><span style="padding-left: 5px; padding-top: 14px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{item.address}}</span>
                            <span style="margin-left: 13px; padding-left: 0">{{item.stopOverTime&&formdata(item.stopOverTime)}}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
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
                <div v-if="clInfo && !searchLoading">
                  请前往
                   <span @click="goToQypz" style="color: #0C70F8; cursor: pointer;">
                    区域碰撞
                  </span>
                  进行操作查看
                </div>
                <div v-else>
                  请前往
                  <span>
                    区域碰撞
                  </span>
                  进行操作查看
                </div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div is="mapVideoPlay" :oData="mapVideoData"></div>
  </div>
</template>
<script>
import vehicleBreadcrumb from '../breadcrumb.vue';
import {getDate, formatDate, dateOrigin, transMinute} from '@/utils/util.js';
import {mapXupuxian} from '@/config/config.js';
import {getVehicleInvestigationReport} from '@/views/index/api/api.judge.js';
import mapVideoPlay from '@/components/common/mapVideoPlay.vue';
export default {
  components: {vehicleBreadcrumb, mapVideoPlay},
  data () {
    return {
      mapVideoData: null,
      curInfoWinVideoPath: '',
      hoverWindow: null,
      mapPicShow: false,
      mapPicShow2: false,
      searchForm: {
        plateNo: '', // 湘A757BW
        time: [dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)), new Date()]
        // time: [new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000), new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000)]
      },
      timeStr: ['', ''],
      searchLoading: false,

      clInfo: null,
      wzList: [], // 违章信息
      rcList: [], // 入城记录
      ccList: [], // 出城记录
      yjcmList: {}, // 夜间出没记录
      yjcmjlList: {},  // 夜间出没结论
      yjcmHoverWindow: null,
      pfcmList: [], // 频繁出没分析
      txclList: [], // 同行车分析

      tpcList: [], // 套牌车

      clgjList: [], // 车辆轨迹
      stopOverRecordList: [],

      showType: 1,

      zoom: 11,
      yjcmMap: null,
      clgjMap: null,
      yjcmMap1: null,

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
    this.initYjcmMap1();
    $('body').on('click', '.vl_vehicle_ljd_mk_p', () => {
      this.showVideo(this.curInfoWinVideoPath);
    })
    if (this.$route.query.pn && this.$route.query.st && this.$route.query.et) {
      this.searchForm.plateNo = this.$route.query.pn;
      this.searchForm.time = [getDate(this.$route.query.st), getDate(this.$route.query.et)];
      this.searchSubmit();
    }
  },
  methods: {
    showVideo(path){
      this.mapVideoData = {
        name: Math.random(),
        url: path
      }
    },
    // goToQypz () {
    //     // vehicle_search_qy
    //   this.$store.commit('setBreadcrumbData', {
    //     breadcrumbData: [
    //       {name: '车辆侦查', routerName: 'vehicle'},
    //       {name: '车辆综合分析报告', routerName: 'vehicle_report', query: {pn: this.searchForm.plateNo, st: formatDate(this.searchForm.time[0], 'yyyy-MM-dd'), et: formatDate(this.searchForm.time[1], 'yyyy-MM-dd')}},
    //       {name: '区域碰撞'}
    //     ]
    //   });
    //   this.$router.push({name: 'vehicle_search_qy', query: {
    //     breadcrumb: 2
    //   }});
    // },
    // 湘AN8888 2019-07-01 00:00:00 2019-07-04 00:00:00
    searchSubmit () {
      this.searchLoading = true;
      this.timeStr = [formatDate(this.searchForm.time[0]),
        formatDate(this.searchForm.time[1])];
      getVehicleInvestigationReport({
        plateNo: this.searchForm.plateNo,
        startTime: this.timeStr[0],
        endTime: this.timeStr[1]
      }).then(res => {
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
          this.stopOverRecordList = data.stopOverRecordList;
          this.setMapMarkerForYjcm(); // 夜间出没
          this.setMapMarkerForClgj(); // 车辆轨迹
          this.setMapMarkerForYjcm1(this.stopOverRecordList); // 夜间出没
         
        } else {
          this.clInfo = null;
          this.wzList = [];
          this.rcList = [];
          this.ccList = [];
          this.yjcmList = {};
          this.yjcmjlList = [];
          this.pfcmList = [];
          this.tpcList = [];
          this.txclList =  []; // 同行车
          this.clgjList = [];
          this.setMapMarkerForYjcm(); // 夜间出没
          this.setMapMarkerForClgj(); // 车辆轨迹
          this.setMapMarkerForYjcm1(); // 夜间出没
          // #/vehicle-report-save
        }
        this.searchLoading = false;
      }).catch(error => {
        console.log('getVehicleInvestigationReport error', error);
        this.searchLoading = false;
      });
    },

    setMapMarkerForYjcm () {
      this.yjcmMap.clearMap();
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
    setMapMarkerForYjcm1 (data) {
      let _this = this
      for (let i = 0; i < data.length; i++) {
        let obj = data[i];
        // 摄像头
        let _id = "vlVehicleLjdSxt" + i;
        let _content =
          "<div id=" +
          _id +
          ' class="vl_icon vl_jfo_sxt vl_icon_judge_04"></div>';
        let marker = new window.AMap.Marker({
          // 添加自定义点标记
          map: this.yjcmMap1,
          position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
          offset: new window.AMap.Pixel(-28.5, -50), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          extData: obj,
          // 自定义点标记覆盖物内容
          content: _content,
          zIndex: 100
        });
        marker.on('mouseover', function () {
          $("#" + _id).addClass("vl_icon_judge_02");
          _this.createInfoWindow(obj)
        })
        marker.on('mouseout', function () {
          $("#" + _id).removeClass("vl_icon_judge_02");
        })
      }
      this.yjcmMap1.setFitView();
    },
    createInfoWindow (obj) {
      let _sContent = `<div class="vl_vehicle_ljd_mk_p"><img class="igm" src="${obj.storagePath}"><p class='addres'>${obj.address} <i class='el-icon-caret-right'></i></p><p class='times'>${transMinute(obj.stopOverTime)}</p></div>`;
      this.hoverWindow = new window.AMap.InfoWindow({
        isCustom: true,
        closeWhenClickMap: true,
        offset: new window.AMap.Pixel(-2, -50), // 相对于基点的偏移位置
        content: _sContent
      });
      this.hoverWindow.open(this.yjcmMap1, new window.AMap.LngLat(obj.shotPlaceLongitude, obj.shotPlaceLatitude));
      this.curInfoWinVideoPath = obj.videoPath;
      this.yjcmMap1.setCenter([obj.shotPlaceLongitude, obj.shotPlaceLatitude])
    },
    formdata (val) {
      if (val> 60) {
        let _b = parseInt(val/60)
        let _c = val - _b*60
        return _b + '小时' + _c + '分钟'
      } else if (val === 60) {
        return 1 + '小时'
      }else {
        return val + '分钟'
      }
    },
    setMapMarkerForClgj () {
      this.clgjMap.clearMap();
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
            sVideo = '<div><img class="bigImg" src="' + obj.storagePath + '" controls></img></div>' +
              '<p>' + obj.shotTime + '</p>';
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
    initYjcmMap1 () {
      // 初始化地图
      let map = new window.AMap.Map('map_report_yjcm1', {
        zoom: 11,
        center: mapXupuxian.center,
        zooms: [2, 18],
        scrollWheel: false
      });
      map.setMapStyle('amap://styles/light');
      // map.setMapStyle('amap://styles/a00b8c5653a6454dd8a6ec3b604ec50c');
      // console.log('_config', _config)
      this.yjcmMap1 = map;
    },
    cktxjlEvent () {
    },
    mapChangeState (type, state) {
      let _map = this.yjcmMap;
      if (type === 'clgj') { _map = this.clgjMap; }
      if (type === 'yjcm1') { _map = this.yjcmMap1; }
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
      /* if ((this.searchForm.time[1].getTime() - this.searchForm.time[0].getTime()) > 2 * 24 * 60 * 60 * 1000) {
        this.searchForm.time[1] = new Date(this.searchForm.time[0].getTime() + 2 * 24 * 60 * 60 * 1000);
        this.$message('最多不能超过3天.');
      } */
    },

    /* vehicleExport () {
      // report_content
      let _this = this;
      this.$confirm('确定导出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        let pdf = new jsPDF('p','pt','a3');
        // 设置打印比例 越大打印越小
        pdf.internal.scaleFactor = 2;
        let options = {
          pagesplit: true, //设置是否自动分页
          "background": '#FFFFFF'   //如果导出的pdf为黑色背景，需要将导出的html模块内容背景 设置成白色。
        };
        pdf.addHTML($('#report_content')[0], 15, 15, options, function () {
          pdf.save('车辆侦察报告_' + _this.clInfo.plateno + '_' +
            formatDate(_this.searchForm.time[0], 'yyyyMMdd') + '-'  + formatDate(_this.searchForm.time[1], 'yyyyMMdd') + '.pdf');
        });
      }).catch(() => {
      });
    } */
  },
  beforeDestroy () {
    // if (this.amap) {
    //   this.amap.destroy();
    // }
    $('body').unbind('click');
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
  overflow: hidden;
  padding: 20px 20px 5px 20px;
}
.vc_rep_mu {
  overflow: hidden;
  border-bottom: 1px solid #eee;
  padding: 6px 20px 0 20px;
  > li {
    float: left;
    padding: 0 5px;
    > span {
      color: #333;
      display: inline-block;
      height: 34px; line-height: 34px;
      padding: 0 25px;
      border-radius:2px 2px 0px 0px;
      background-color: #F7F7F7;
      cursor: pointer;
      &.vc_rep_mu_sed {
        cursor: default;
        color: #fff;
        background-color: #0C70F8;
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
    .rep_map_sk1{
      width: 270px;
      top: 1px; left: 1px; bottom: 22px;
      box-shadow: none;
      border-radius:4px 0px 0px 4px;
      span:nth-of-type(1){
        width: 40px !important;
      }
      span:nth-of-type(2){
        width: 85px !important;
      }
      span:nth-of-type(3){
        width: 90px !important;
      }
      ul{
        max-height: 398px !important;
        li:hover{
          background-color: #F0F5FF;
        }
      }
    }
  }
}
.vc_rep_cs_dc {
  float: right;
  position: relative; top: 1px;
  padding: 9px 15px; 
  font-size: 12px; color: #FFF !important;
  border-radius: 3px;
  background-color: #409EFF;
  border: 1px solid #409EFF;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  text-decoration: none !important;
  &.vc_rep_cs_dc_dis { 
    cursor: not-allowed;
    background-color: #a0cfff;
    border-color: #a0cfff;
  }
}
.tpc_fake_res { width: 14px; height: 15px; background-position: -863px -530px; }
</style>
<style lang="scss">
.vl_vehicle_ljd_mk_p {
    /*display: none;*/
    position: relative;
    width: 180px;
    height: auto;
    background: #ffffff;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    box-shadow: 4px 0px 10px 0px #838383;
    box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
    .times{
      position: absolute;
      left: 10px;
      top: 10px;
      background: #50CC62;
      padding: 0px 8px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      color: #ffffff;
    }
    .addres{
      right: 10px;
      text-align: left;
      position: absolute;
      left: 10px;
      bottom: 10px;
      color: #ffffff;
      i{
        float: right;
        font-size: 24px;;
      }
    }
    .igm{
      width: 100%;
      height: 100px;
      background: #666666;
    }
    .big {
      font-size: 16px;
      font-weight: bold;
    }
    &:after {
      border-bottom-color: rgba(0, 0, 0, 1);
      content: "";
      display: inline-block;
      position: absolute;
      left: 50%;
      margin-left: -10px;
      bottom: -10px;
      border-top: 10px solid #fff;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
    }
    &.vl_jig_mk_img_show{
      display: block;
    }
    &.vl_jig_mk_img_hover {
      &:after {
        border-bottom-color: rgba(0, 0, 0, 1);
        content: "";
        display: inline-block;
        position: absolute;
        left: 50%;
        margin-left: -10px;
        bottom: -10px;
        border-top: 10px solid #0c70f8;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
      }
      background: rgba(12, 112, 248, 1);
      position: relative;
      border: 0.04rem solid #0c70f8;
      > p {
        color: #ffffff;
      }
    }
  }
.map_pic_show, .map_pic_show2 {
  .cl_report_gj {
    > div {
      display: block;
    }
    > p {
      display: none;
    }
  }
}
.cl_report_gj {
  position: relative;
  display: inline-block;
  width: 42px; height: 49px;
  background: url(../../../../../assets/img/icons/icons_sxt.png) center center no-repeat;
  > div {
    display: none;
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
   .cl_report_hw {
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
       h3 {
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
   .cl_report_hw1{
    > h3 {
      color: #fff;
      text-align: center;
      font-weight: normal !important;
    }
  }
}
</style>