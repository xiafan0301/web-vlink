<template>
  <div class="bkclcc_container">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{name: 'vehicle'}">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>布控车辆出城查询</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="con_box">
      <div class="con_left">
        <div class="left_start">
          <el-date-picker
            :clearable="false"
            class="vl_date"
            style="width: 100%"
            v-model="queryForm.startTime"
            :picker-options="pickerOptions"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择开始时间">
          </el-date-picker>
        </div>
        <div class="left_end">
          <el-date-picker
            :clearable="false"
            class="vl_date vl_date_end"
            style="width: 100%"
            :picker-options="pickerOptions1"
            v-model="queryForm.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择结束时间">
          </el-date-picker>
        </div>
        <el-select v-model="queryForm.bayonet" filterable multiple collapse-tags placeholder="请选择卡口" style="width: 100%;">
          <el-option
            v-for="item in listBayonet"
            :key="item.value"
            :label="item.label"
            :value="item">
          </el-option>
        </el-select>
        <el-select
            v-model="queryForm.carType"
            multiple
            collapse-tags
            clearable
            placeholder="全部车辆类别"
            style="width: 100%;margin-top: 10px;"
          >
            <el-option
              v-for="item in vehicleClassOptions"
              :key="item.enumField"
              :label="item.enumValue"
              :value="item.enumField"
            ></el-option>
          </el-select>
        <div class="left_radio" style="overflow: hidden;"><span>车牌：</span><el-checkbox style="float: right;" v-model="queryForm.radio" :label="true">排除</el-checkbox></div>
        <div class="left_province">
          <el-select v-model="queryForm.province">
            <el-option
              v-for="item in provinceList"
              :key="item.value"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
          <el-input v-model="queryForm.provinceName"></el-input>
        </div>
        <div class="left_btn">
          <el-button class="reset_btn" @click="resetQueryForm">重置</el-button>
          <el-button class="select_btn" @click="getControlCarSta" :loading="loadingBtn">查询</el-button>
        </div>
      </div>
      <div class="con_right">
        <div class="right_box table_box" v-if="bkclccList && bkclccList.length > 0">
          <el-table
            v-loading="loading"
            :data="bkclccList"
            >
            <el-table-column
              type="index"
              label="序号"
              :index="indexMethod">
            </el-table-column>
            <el-table-column
              label="车牌号码"
              prop="plateNo"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="卡口名称"
              prop="bayonetName"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="抓拍时间"
              prop="shotTime"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="车牌颜色"
              prop="vehicleColor"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="车辆类型"
              prop="vehicleClass"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="操作"
              show-overflow-tooltip
              >
              <template slot-scope="scope">
                <span class="operation_btn" @click="showStrucInfo(scope.row, scope.$index)">出城信息</span>
              </template>
            </el-table-column>
          </el-table>
         <!--  <el-pagination
            class="cum_pagination"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="bkclccList.total">
          </el-pagination> -->
        </div>
        <div is="noResult" v-else :isInitPage="isInitPage"></div>
      </div>
    </div>
    <!-- 出城信息弹窗 -->
    <el-dialog
      :visible.sync="strucDetailDialog"
      class="struc_detail_dialog"
      :close-on-click-modal="false"
      top="4vh"
      :show-close="false"
    >
      <div class="struc_tab">
        <span :class="{'active': strucCurTab === 1}" @click="strucCurTab = 1">抓拍详情</span>
        <span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>
        <span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>
        <i class="el-icon-close" @click="strucDetailDialog = false"></i>
      </div>
      <div class="struc_main">
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img class="bigImg" title="点击放大图片" :src="sturcDetail.storagePath" alt />
            <span>全景图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img struc_c_d_img_green">
              <img class="bigImg" title="点击放大图片" :src="sturcDetail.subStoragePath" alt />
              <span>抓拍图</span>
            </div>
            <div class="struc_c_d_info">
              <vue-scroll>
                <h2>
                  抓拍信息
                  <!-- <div class="vl_jfo_sim" v-show="showSim">
                  <i class="vl_icon vl_icon_retrieval_03"></i>
                  {{sturcDetail.semblance ? sturcDetail.semblance : 98.32}}
                  <span
                    style="font-size: 12px;"
                  >%</span>
                  </div>-->
                </h2>
                <!-- 特征展示框 -->
                <!-- <div class="struc_cdi_box">
                <div
                  class="item"
                  v-if="sturcDetail.plateReliability"
                >{{sturcDetail.plateReliability}}</div>
                <div class="item" v-if="sturcDetail.vehicleBrand">{{ sturcDetail.vehicleBrand}}</div>
                <div class="item" v-if="sturcDetail.sunvisor">{{ '遮阳板：' + sturcDetail.sunvisor}}</div>
                <div
                  class="item"
                  v-if="sturcDetail.plateColor"
                >{{ '车牌颜色：' + sturcDetail.plateColor}}</div>
                <div class="item" v-if="sturcDetail.plateNo">{{ sturcDetail.plateNo}}</div>
                <div class="item" v-if="sturcDetail.vehicleClass">{{ sturcDetail.vehicleClass}}</div>
                <div
                  class="item"
                  v-if="sturcDetail.vehicleColor"
                >{{ '车辆颜色：' + sturcDetail.vehicleColor}}</div>
                <div class="item" v-if="sturcDetail.vehicleModel">{{sturcDetail.vehicleModel}}</div>
                <div
                  class="item"
                  v-if="sturcDetail.vehicleRoof"
                >{{ '车顶(天窗)：' + sturcDetail.vehicleRoof}}</div>
                </div>-->
                <!-- 车辆的信息栏 -->
                <div class="struc_cdi_line_mhsc" v-if="sturcDetail.shotTime">
                  <p class="line_content">
                    <span class="key">抓拍时间</span>
                    <span class="val">{{sturcDetail.shotTime}}</span>
                  </p>
                </div>
                <div class="struc_cdi_line_mhsc" v-if="sturcDetail.deviceName">
                  <p class="line_content">
                    <span class="key">抓拍设备</span>
                    <span class="val">{{sturcDetail.deviceName}}</span>
                  </p>
                </div>
                <div class="struc_cdi_line_mhsc" v-if="sturcDetail.address">
                  <p class="line_content">
                    <span class="key" title="抓拍地点">抓拍地点</span>
                    <span class="val">{{sturcDetail.address}}</span>
                  </p>
                </div>
                <div class="struc_cdi_line_mhsc" v-if="sturcDetail.plateNo">
                  <p class="line_content">
                    <span class="key">车牌号码</span>
                    <span class="val">{{sturcDetail.plateNo}}</span>
                  </p>
                </div>
                <!-- 5个特征 -->
                <div class="struc_cdi_line_mhsc" v-if="sturcDetail.plateColor">
                  <p class="line_content">
                    <span class="key">车牌颜色</span>
                    <span class="val">{{sturcDetail.plateColor}}</span>
                  </p>
                </div>
                <div class="struc_cdi_line_mhsc" v-if="sturcDetail.vehicleModel">
                  <p class="line_content">
                    <span class="key">车辆型号</span>
                    <span class="val">{{sturcDetail.vehicleModel}}</span>
                  </p>
                </div>

                <div class="struc_cdi_line_mhsc" v-if="sturcDetail.vehicleColor">
                  <p class="line_content">
                    <span class="key">车辆颜色</span>
                    <span class="val">{{sturcDetail.vehicleColor}}</span>
                  </p>
                </div>
                <div class="struc_cdi_line_mhsc" v-if="sturcDetail.vehicleClass">
                  <p class="line_content">
                    <span class="key">车辆类型</span>
                    <span class="val">{{sturcDetail.vehicleClass}}</span>
                  </p>
                </div>
                <div
                  class="struc_cdi_line_mhsc"
                  v-if="sturcDetail.plateClass || sturcDetail.plateClass === 0"
                >
                  <p class="line_content">
                    <span class="key">号牌类型</span>
                    <span class="val">{{dicFormater(45, sturcDetail.plateClass)}}</span>
                  </p>
                </div>
              </vue-scroll>
            </div>
          </div>
        </div>
        <div v-show="strucCurTab === 2" class="struc_c_address">
          <!-- <div style="width: 100%; height: 100%;" id="capMap"></div> -->
        </div>
        <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.subStoragePath" class="bigImg" title="点击放大图片" alt />
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <video id="capVideo" :src="sturcDetail.videoPath"></video>
            <div class="play_btn" @click="videoTap" v-show="!playing">
              <i class="vl_icon vl_icon_judge_01" v-if="playing"></i>
              <i class="vl_icon vl_icon_control_09" v-else></i>
            </div>
          </div>
          <div class="download_btn">
            <a download="视频" :href="videoUrl"></a>下载视频
          </div>
        </div>
      </div>
      <div class="struc-list" v-show="strucInfoList && strucInfoList.length > 1">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in strucInfoList" :key="'my_swiper' + index">
            <div
              class="swiper_img_item"
              :class="{'active': index === curImgIndex}"
              @click="imgListTap(item, index)"
            >
              <img style="width: 100%; height: .88rem;" :src="item.subStoragePath" alt />
              <!-- <div class="vl_jfo_sim" v-show="showSim">
                <i
                  class="vl_icon vl_icon_retrieval_05"
                  :class="{'vl_icon_retrieval_06':  index === curImgIndex}"
                ></i>
                {{item.semblance ? item.semblance : 92}}
                <span
                  style="font-size: 12px;"
                >%</span>
              </div>-->
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
    </el-dialog>
    <div id="capMap"></div>
  </div>
</template>
<script>
let startTime = formatDate(new Date().getTime() - 1 * 3600 * 24 * 1000, 'yyyy-MM-dd HH:mm:ss');
let endTime = formatDate(new Date().getTime() + (24 * 60 * 60 * 1000 - 1) - 1 * 3600 * 24 * 1000, 'yyyy-MM-dd HH:mm:ss');
import {getOutCityBayonet, apiOutCityStatistics} from '@/views/index/api/api.vehicle.js';
import {dataList} from '@/utils/data.js';
import {formatDate} from '@/utils/util.js';
import { getGroupsByType } from "@/views/index/api/api.js";
import noResult from '@/components/common/noResult.vue';
export default {
  components: {noResult},
  data () {
    return {
      isInitPage: false,
      queryForm: {
        startTime: startTime,
        endTime: endTime,
        bayonet: '',
        carType: '',
        province: {label: '湘', value: 9},
        provinceName: '',
        radio: false
      },
      listBayonet: [],
      vehicleClassOptions: [
        // 车辆类别下拉
        {
          enumField: "无牌车",
          enumValue: "无牌车"
        },
        {
          enumField: "布控库车辆",
          enumValue: "布控库车辆"
        }
      ],
      provinceList: this.dicFormater(dataList.ownership)[0].dictList.map(m => {
        return {
          value: parseInt(m.enumField),
          label: m.enumValue
        }
      }),
      loading: false,
      loadingBtn: false,
      bkclccList: [],
      // 翻页数据
      currentPage: 1,
      pageSize: 10,
      pageNum: 1,
      pickerOptions: {
        disabledDate: time => {
          if (this.queryForm.endTime) {
            return (
              time.getTime() > new Date(this.queryForm.endTime).getTime() ||
              time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90
            );
          } else {
            return (
              time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90 ||
              time.getTime() > new Date().getTime()
            );
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          if (this.queryForm.startTime) {
            return (
              time.getTime() < new Date(this.queryForm.startTime).getTime() ||
              time.getTime() > new Date().getTime()
            );
          } else {
            return (
              time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 30 ||
              time.getTime() > new Date().getTime()
            );
          }
        }
      },

      /* 检索结果变量 */
      strucInfoList: [],
     

      /* 检索详情弹窗变量 */
      swiperOption: {
        // swiper配置
        slidesPerView: 10,
        spaceBetween: 18,
        slidesPerGroup: 10,
        loop: false,
        slideToClickedSlide: true,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      amap: null, // 地图实例
      markerPoint: null, // 地图点集合
      InfoWindow: null,
      strucDetailDialog: false, // 弹窗是否展示
      playing: false, // 视频播放是否
      strucCurTab: 1,
      showSim: false, // 展示相似度排序
      curImgIndex: 0, // 当前图片index
      sturcDetail: {},
      videoUrl: "" // 弹窗视频回放里的视频
    }
  },
  mounted () {
    // 初始化 地图
    let map = new AMap.Map("capMap", {
      center: [112.974691, 28.093846],
      zoom: 16
    });
    map.setMapStyle("amap://styles/whitesmoke");
    this.amap = map;
    this.getListBayonet();
    this.getGroupsByType();
    this.getControlCarSta();
  },
  watch: {
    // stucOrder () {
    //   this.tcDiscuss(true);
    // },
    strucCurTab(e) {
      if (e === 2) {
        this.drawPoint(this.sturcDetail);
      } else if (e === 3) {
        this.videoUrl = document.getElementById("capVideo").src;
      }
    }
  },
  methods: { 
    // 获取到车辆类别
    getGroupsByType () {
      getGroupsByType({ groupType: 9 }).then(res => {
        if (res.data) {
          this.vehicleClassOptions = [
            ...this.vehicleClassOptions,
            ...res.data.map(item => {
              return {
                enumField: item.groupName,
                enumValue: item.groupName // uid
              };
            })
          ];
        }
      })
    },
    // 绘制地图
    drawPoint(data) {
      this.$nextTick(() => {
        $(".struc_c_address").append($("#capMap"));
      });
      if (this.markerPoint) {
        this.amap.remove(this.markerPoint);
      }
      let _content = '<div class="vl_icon vl_icon_judge_02"></div>';
      this.markerPoint = new AMap.Marker({
        // 添加自定义点标记
        map: this.amap,
        position: [data.shotPlaceLongitude, data.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
        offset: new AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // 自定义点标记覆盖物内容
        content: _content
      });
      this.amap.setZoomAndCenter(16, [
        data.shotPlaceLongitude,
        data.shotPlaceLatitude
      ]); // 自适应点位置
      let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`;
      this.infoWindow = new AMap.InfoWindow({
        map: this.amap,
        isCustom: true,
        closeWhenClickMap: false,
        position: [data.shotPlaceLongitude, data.shotPlaceLatitude],
        offset: new AMap.Pixel(0, -70),
        content: sConent
      });
    },
    // 模糊搜索卡口
    getListBayonet () {
      getOutCityBayonet().then(res => {
        if (res) {
          let data = res.data;
          let bayonetList = [];
          if(data && data.length > 0) {
            for(let item of data) {
              bayonetList.push(...item.bayonetList)
            }
            this.listBayonet = bayonetList.map(m => {
              return {
                value: m.uid,
                label: m.bayonetName
              }
            });
          }
        }
      })
    },  
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    handleCurrentChange (page) {
      this.pageNum = page;
      this.currentPage = page;
      this.getControlCarSta();
    },
    // 重置表单
    resetQueryForm () {
      this.pageNum = 1;
      this.currentPage = 1;
      this.queryForm = {
        startTime: startTime,
        endTime: endTime,
        bayonet: '',
        carType: '',
        province: {label: '湘', value: 9},
        provinceName: '',
        radio: false
      };
      this.getControlCarSta();
    },
    // 获取布控车辆出城统计
    getControlCarSta () {
      console.log(this.queryForm.bayonet, 'this.queryForm.bayonet')
      const params = {
        'startTime': this.queryForm.startTime,
        'endTime': this.queryForm.endTime,
        'vehicleNumber': this.queryForm.province.label + this.queryForm.provinceName,
        'unvehicleFlag': this.queryForm.radio,
      }
      if(this.queryForm.bayonet && this.queryForm.bayonet.length > 0) {
        let bayonet = this.queryForm.bayonet.map(r => r.value)
        params['bayonetUid'] = bayonet.join(',')
      }
      this.loadingBtn = true;
      apiOutCityStatistics(params).then(res => {
        if (res) {
          this.bkclccList = res.data;
          this.strucInfoList = res.data;
        }
      }).finally(() => {
        this.loadingBtn = false;
      })
    },
    videoTap() {
      // 播放视频
      let vDom = document.getElementById("capVideo");
      if (this.playing) {
        vDom.pause();
      } else {
        vDom.play();
      }
      vDom.addEventListener("ended", e => {
        e.target.currentTime = 0;
        this.playing = false;
      });
      this.playing = !this.playing;
    },
    showStrucInfo(data, index) {
      this.curImgIndex = index;
      this.strucDetailDialog = true;
      this.sturcDetail = data;
      this.drawPoint(data);
      console.log(index, 'index')
    },
    imgListTap(data, index) {
      this.curImgIndex = index;
      this.sturcDetail = data;
      this.drawPoint(data);
    }
  }
}
</script>
<style lang="scss" scoped>
.bkclcc_container{
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #FFFFFF;
  .breadcrumb_heaer{
    border-bottom: 1px solid #D3D3D3;
  }
  .con_box{
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    height: calc(100% - 55px);
    .con_left{
      width: 272px;
      height: 100%;
      padding: 20px;
      > .left_start, .left_end{
        display: flex;
        padding-bottom: 10px; 
        > span{
          color: #999999;
        }
      }
      .left_radio{
        padding: 40px 0 10px 0;
        > span{
          color: #999999;
        }
      }
      .left_province{
        display: flex;
        .el-select{
          width: 82px;
        }
      }
      .left_btn{
        display: flex;
        justify-content: space-between;
        padding-top: 10px;
        .select_btn, .reset_btn {
          width: 110px;
        }
        .select_btn {
          background-color: #0C70F8;
          color: #ffffff;
        }
        .reset_btn {
          background-color: #ffffff;
          color: #666666;
          border-color: #DDDDDD;
        }
      }
    }
    .con_right{
      width: calc(100% - 272px);
      height: 100%;
      overflow-y: auto;
      background: #F7F9F9;
      .right_box{
        height: calc(100% - 40px);
        margin: 20px;
        padding: 20px;
        background: #fff;
      }
    }
  }
}
</style>
<style lang="scss">
.bkclcc_container{
  .left_radio .el-radio__label{
    color: #999999;
  }
  .left_province{
    .el-input .el-input__inner{
      border-radius: 0 4px 4px 0!important;
    }
    .el-select .el-input--suffix .el-input__inner{
      border-radius: 4px 0 0 4px!important;
      border-right: none;
    }
  }
   // 抓拍详情弹窗
  .struc_detail_dialog {
    .el-dialog {
      max-width: 13.06rem;
      width: 100% !important;
    }
    .el-dialog__header {
      display: none;
    }
    .struc_tab {
      height: 1.16rem;
      padding: 0.3rem 0;
      position: relative;
      color: #999999;
      span {
        display: inline-block;
        margin-right: 0.55rem;
        padding-bottom: 0.1rem;
        cursor: pointer;
      }
      .active {
        color: #0c70f8;
        border-bottom: 2px solid #0c70f8;
      }
      i {
        display: block;
        position: absolute;
        top: 0.3rem;
        right: 0px;
        cursor: pointer;
      }
    }
    .struc_main {
      width: 11.46rem;
      height: 4.4rem;
      margin: 0 auto;
      border-bottom: 1px solid #f2f2f2;
      .struc_c_detail {
        width: 100%;
        height: 3.6rem;
        > div {
          float: left;
        }
        // 默认为蓝色
        .struc_c_d_img {
          width: 3.6rem;
          height: 3.6rem;
          background: #eaeaea;
          position: relative;
          img {
            width: 100%;
            height: auto;
            max-height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
          }
          i {
            display: block;
            position: absolute;
            top: 0.1rem;
            right: 0.1rem;
            line-height: 0.26rem;
            height: 0.26rem;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 0.13rem;
            font-style: normal;
            color: #0c70f8;
            font-size: 12px;
            padding: 0 0.1rem;
          }
        }
        // 绿色标签
        .struc_c_d_img_green {
          &:before {
            display: block;
            content: "";
            position: absolute;
            top: -0.5rem;
            left: -0.5rem;
            transform: rotate(-45deg);
            border: 0.5rem solid #50cc62;
            border-color: transparent transparent #50cc62;
            z-index: 9;
          }
          span {
            display: block;
            position: absolute;
            top: 0.1rem;
            left: 0.1rem;
            width: 0.6rem;
            height: 0.6rem;
            text-align: center;
            color: #ffffff;
            font-size: 0.12rem;
            -webkit-transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            transform: rotate(-45deg);
            z-index: 99;
          }
          i {
            color: #50cc62;
          }
        }
        .struc_c_d_qj {
          margin-right: 0.3rem;
          &:before {
            display: block;
            content: "";
            position: absolute;
            top: -0.5rem;
            left: -0.5rem;
            transform: rotate(-45deg);
            border: 0.5rem solid #0c70f8;
            border-color: transparent transparent #0c70f8;
            z-index: 9;
          }
          span {
            display: block;
            position: absolute;
            top: 0.1rem;
            left: 0.1rem;
            width: 0.6rem;
            height: 0.6rem;
            text-align: center;
            color: #ffffff;
            font-size: 0.12rem;
            -webkit-transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            transform: rotate(-45deg);
            z-index: 99;
          }
        }
        .struc_c_d_box {
          width: calc(100% - 3.9rem);
          box-shadow: 0px 5px 16px 0px rgba(169, 169, 169, 0.2);
          border-radius: 1px;
          position: relative;
          overflow: hidden;
          > div {
            float: left;
          }
          .struc_c_d_info {
            width: calc(100% - 3.6rem);
            height: 3.6rem;
            padding-left: 0.24rem;
            color: #333333;
            h2 {
              font-weight: bold;
              line-height: 0.74rem;
              padding-right: 1rem;
              .vl_jfo_sim {
                color: #0c70f8;
                font-weight: bold;
                font-size: 0.24rem;
                float: right;
                i {
                  vertical-align: text-bottom;
                  margin-right: 0.1rem;
                }
                span {
                  font-weight: normal;
                }
              }
            }
            // 特征展示框
            .struc_cdi_box {
              overflow: hidden;
              margin-bottom: 0.08rem;
              .item {
                float: left;
                padding: 0 0.1rem;
                border: 1px solid #f2f2f2;
                background: #fafafa;
                color: #333333;
                font-size: 12px;
                line-height: 0.3rem;
                margin-top: 0.08rem;
              }
              .item + .item {
                margin-left: 0.1rem;
              }
            }
            .struc_cdi_line_mhsc {
              .line_content {
                max-width: 100%;
                display: inline-block;
                height: 0.3rem;
                line-height: 0.3rem;
                margin-bottom: 0.08rem;
                border: 1px solid #f2f2f2;
                background: #fafafa;
                color: #333333;
                white-space: nowrap;
                text-overflow: ellipsis;
                border-radius: 3px;
                font-size: 12px;
                overflow: hidden;
                padding-left: 0.1rem;
                margin-right: 0.08rem;
                .key {
                  color: #999999;
                  padding-right: 10px;
                  display: inline-block;
                  &::before {
                    content: "";
                    width: 1px;
                    height: 14px;
                    position: absolute;
                    right: 0px;
                    top: 1px;
                    background: #f2f2f2;
                  }
                }
                .val {
                  display: inline-block;
                  background: #fff;
                  padding: 0 9px;
                  position: relative;
                }
              }
            }
          }
          // &:before {
          //   display: block;
          //   content: "";
          //   position: absolute;
          //   top: -0.7rem;
          //   right: -0.7rem;
          //   transform: rotate(-46deg);
          //   border: 0.7rem solid #0c70f8;
          //   border-color: transparent transparent transparent #0c70f8;
          // }
          // &:after {
          //   display: block;
          //   content: "";
          //   position: absolute;
          //   top: -0.4rem;
          //   right: -0.4rem;
          //   transform: rotate(-45deg);
          //   border: 0.4rem solid #ffffff;
          //   border-color: transparent transparent transparent #ffffff;
          // }
          // > span {
          //   display: block;
          //   position: absolute;
          //   top: 0.19rem;
          //   right: 0.19rem;
          //   width: 1rem;
          //   height: 1rem;
          //   text-align: center;
          //   color: #ffffff;
          //   font-size: 0.12rem;
          //   -webkit-transform: rotate(45deg);
          //   -moz-transform: rotate(45deg);
          //   -ms-transform: rotate(45deg);
          //   -o-transform: rotate(45deg);
          //   transform: rotate(45deg);
          //   z-index: 99;
          // }
        }
      }
      // 抓拍视频
      .struc_c_video {
        .struc_c_d_box {
          background: #e9e7e8;
          height: 100%;
          text-align: center;
          &:hover {
            .play_btn {
              display: block !important;
            }
          }
          .play_btn {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            background: rgba(0, 0, 0, 0.4);
            width: 1rem;
            height: 1rem;
            text-align: center;
            line-height: 1rem;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            cursor: pointer;
            i {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
              height: 22px !important;
            }
          }
          > video {
            width: auto;
            height: 100%;
          }
          &:after {
            content: none !important;
          }
          &:before {
            content: none !important;
          }
          -webkit-box-shadow: 0 0 0 !important;
          -moz-box-shadow: 0 0 0 !important;
          box-shadow: 0 0 0 !important;
        }
        .download_btn {
          text-align: center;
          width: 1.1rem;
          height: 0.4rem;
          float: right !important;
          margin-top: 0.2rem;
          background: rgba(246, 248, 249, 1);
          border: 1px solid rgba(211, 211, 211, 1);
          border-radius: 4px;
          line-height: 0.4rem;
          cursor: pointer;
          color: #666666;
          position: relative;
          &:hover {
            color: #ffffff;
            background: #0c70f8;
            border-color: #0c70f8;
          }
          a {
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
          }
        }
      }

      .struc_c_address {
        height: 100%;
        #capMap {
          width: 100%;
          height: 100%;
        }
      }
    }
    .struc-list {
      width: 12.46rem;
      margin: 0 auto;
      padding: 0.44rem 0 0.34rem 0;
      .swiper-container {
        padding: 0.02rem 0.5rem;
        &:before {
          display: block;
          content: "";
          width: 0.5rem;
          height: 110%;
          background: #ffffff;
          position: absolute;
          left: 0;
          z-index: 9;
          border: 1px solid #ffffff;
        }
        &:after {
          display: block;
          content: "";
          width: 0.5rem;
          height: 110%;
          background: #ffffff;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 9;
          border: 1px solid #ffffff;
        }
        .swiper-button-next {
          right: 0;
        }
        .swiper-button-prev {
          left: 0;
        }
        .swiper-slide {
          .swiper_img_item {
            cursor: pointer;
            border: 1px solid #ffffff;
            padding: 2px;
            .vl_jfo_sim {
              font-size: 0.14rem;
              height: 0.3rem;
              margin-top: 0;
              /*display: inline-block;*/
              white-space: nowrap;
              text-align: center;
              color: #999999;
              i {
                margin-right: 0;
              }
            }
          }
          .active {
            border-color: #0c70f8;
            .vl_jfo_sim {
              color: #0c70f8;
            }
          }
        }
      }
    }
  }
}
</style>