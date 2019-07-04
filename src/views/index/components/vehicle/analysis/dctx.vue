<template>
  <div class="th-many-peers">
    <Breadcrumb :oData="[{name: '多车同行'}]"></Breadcrumb>
    <div class="the-bottom">
      <div class="the-left-search">
        <div class="input-box">
          <vue-scroll>
            <div class="input-box-line">
              <p class="title"><span>开</span><span>始</span></p>
              <el-date-picker
                align="right"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
                @blur="handleStartTime"
                :picker-options="pickerStart"
                v-model="filterObj.startDate"
                type="datetime"
                placeholder="选择日期"
                >
                </el-date-picker>
            </div>
            <div class="input-box-line">
              <p class="title"><span>结</span><span>束</span></p>
              <el-date-picker
                v-model="filterObj.endDate"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
                @blur="handleEndTime"
                :picker-options="pickerStart"
                type="datetime" 
                placeholder="选择日期" 
              ></el-date-picker>
            </div>
            <div class="input-box-line" v-for="(item, index) in filterObj.vehicleNumberList" :key="index + 'ssd'">
              <el-input class="left-none-border" v-model="item.vehicleNumber" placeholder="请输入车牌号码">
                <template slot="prepend">车辆{{ index + 1 }}:</template>
                <i v-if="index > 1" slot="suffix" class="el-input__icon el-icon-remove" @click="onDeleteVehicleNumber(index)"></i>
              </el-input>
            </div>
            <p v-if="filterObj.vehicleNumberList.length < 8" class="add-vehicle-number" @click="onAddVehicleNumber">
              <i class="el-icon-circle-plus"></i>
              添加车辆
            </p>
          </vue-scroll>
        </div>
        <div class="btn-box">
          <el-button class="th-btn-no-color" @click="onReset" :loading="resetLoading">重置</el-button>
          <el-button class="th-btn-color" @click="onSearch" :loading="searchLoading">查询</el-button>
        </div>
      </div>
      <div class="the-right-result">
        <template v-if="dataList.length > 0">
          <div class="the-result-box-dctx">
            <vue-scroll>
              <div class="list-box">
                <div class="list-item" v-for="item in dataList" :key="item.id" @click="onOpenDetail(item)">
                  <img :src="item.shotRecord.subStoragePath" alt="">
                  <p class="time"><i></i>{{item.shotRecord.shotTime}}</p>
                  <p class="address"><i></i>抓拍设备:{{item.shotRecord.deviceName}}</p>
                </div>
                <template v-if="pagination.total > 8">
                  <el-pagination
                    class="cum_pagination th-center-pagination"
                    @current-change="onPageChange"
                    :current-page.sync="currentPage"
                    :page-size="pagination.pageSize"
                    layout="prev, pager, next"
                    :total="pagination.total">
                  </el-pagination>
                </template>
              </div>
            </vue-scroll>
          </div>
        </template>
        <template v-else>
          <div class="not_content">
            <img src="../../../../../assets/img/not-content.png" alt="">
            <p style="color: #666666; margin-top: 30px;">抱歉，没有相关的结果!</p>
          </div>
        </template>
      </div>
    </div>
    <el-dialog
        :visible.sync="strucDetailDialog"
        class="struc_detail_dialog"
        :close-on-click-modal="false"
        top="4vh"
        :show-close="false">
      <div class="struc_tab">
        <span :class="{'active': strucCurTab === 1}" @click="strucCurTab = 1">抓拍详情</span>
        <span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>
        <span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>
        <i class="el-icon-close" @click="onCloseDetail"></i>
      </div>
      <div class="struc_main">
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_quanjing">
            <div class="struc_c_d_qii struc_c_d_img" style="width: 600px">
              <img :src="sturcDetail.storagePath" alt="">
              <span>全景图</span>
            </div>
            <div class="struc_c_d_info" style="padding-left: 14px;">
              <div class="th-dctx-tab">
                <p class="line">
                  <span>卡口名称：</span>
                  <span>{{ sturcDetail.deviceName }}</span>
                </p>
                <p class="line">
                  <span>同行车辆（{{ vehicleList && vehicleList.length }}）</span>
                </p>
              </div>
              <div class="struc_cdi_box">
                <vue-scroll>
                  <div v-for="(item, index) in vehicleList" :key="index + 'tjj'" class="vehicle-info-box">
                    <div class="left">车辆{{ index + 1 }}</div>
                    <div class="right">
                      <p>{{ item.vehicleNumber }}</p>
                      <p>
                        <span>{{ item.vehicleBrand }}</span>
                        <span>{{ item.vehicleColor }}</span>
                        <span>{{ item.vehicleModel }}</span>
                        <span>{{ item.vehicleStyles }}</span>
                        <span>{{ item.peerTimes }}</span>
                        <span>{{ item.plateColor }}</span>
                        <span>{{ item.registrationInfo }}</span>
                        <b>特征</b>
                      </p>
                    </div>
                  </div>
                </vue-scroll>
              </div>
            </div>
          </div>
        </div>
        <div v-show="strucCurTab === 2" class="struc_c_address">
          <div id="container"></div>
        </div>
        <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.subStoragePath" alt="">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <span class="th-video-text">视频回放</span>
            <div is="flvplayer" :index="1" :oData="playUrl" :bResize="bResize" :oConfig="{sign: false, close: false, pause: true}" ></div>
          </div>
          <a class="download_btn" target="_blank" download="视频" :href="sturcDetail.videoPath">下载视频</a>
        </div>
      </div>
      <div class="struc-list">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in strucInfoList" :key="index + 'isgm'">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
              <img style="display: block; width: 100%; height: .88rem;" :src="item.subStoragePath" alt="">
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from '../breadcrumb.vue';
import flvplayer from '@/components/common/flvplayer.vue';
import { formatDate } from "@/utils/util.js";
import { getMultiVehicleList, getSnapDetail } from '@/views/index/api/api.judge.js';
export default {
  components: {
    flvplayer,
    Breadcrumb
  },
  data () {
    const startTime = new Date() - 24 * 60 * 60 *1000;
    return {
      pickerStart: {
        disabledDate (time) {
          return time.getTime() > (new Date().getTime());
        }
      },
      pickerEnd: {
        disabledDate (time) {
          return time.getTime() > (new Date().getTime());
        }
      },
      isSelect: false,
      pagination: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      currentPage: 1,
      /* 抓拍记录页面参数 */
      strucDetailDialog: false, // 抓拍记录弹窗
      strucCurTab: 1, // 抓拍记录弹窗tab
      curImgIndex: 0, // 当前选择的图片index
      strucInfoList: [],
      sturcDetail: {},
      vehicleList: [], // 同行车辆
      bResize: {},
      markerPoint: null, // 地图icon
      playUrl: {},
      videoUrl: null, // 下载地址
      map: null,
      filterObj: {
        startDate: new Date(startTime),
        endDate: new Date(),
        vehicleNumberList: [
          {vehicleNumber: '沪D008CP'},
          {vehicleNumber: '沪A009CP'},
        ],
        vehicleNumbers: null
      },
      // startDate: new Date(startTime), // 开始时间
      // endDate: new Date(), // 结束时间
      resetLoading: false,
      searchLoading: false,
      swiperOption: {
        slidesPerView: 10,
        spaceBetween: 18,
        slidesPerGroup: 10,
        loop: false,
        slideToClickedSlide: true,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      dataList: [], // 查询结果列表数据
    }
  },
  methods: {
    /**
     * 弹框地图初始化
     */
    initMap () {
      // this.map.setZoomAndCenter(iZoom, aCenter);
      let map = new window.AMap.Map('container', {
        zoom: 14, // 级别
        center: [110.595111, 27.90289], // 中心点坐标
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.map = map;
      this.drawPoint(this.sturcDetail)
    },
    /**
     * 地图描点
     */
    drawPoint (data) {
      console.log(data)
      if (this.markerPoint) {
        this.map.remove(this.markerPoint)
      }
      let _content = '<div class="vl_icon vl_icon_judge_02"></div>'
      this.markerPoint = new window.AMap.Marker({ // 添加自定义点标记
        map: this.map,
        position: [data.shotPlaceLongitude, data.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
        offset: new window.AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // 自定义点标记覆盖物内容
        content: _content
      });
      this.map.setZoomAndCenter(16, [data.shotPlaceLongitude, data.shotPlaceLatitude]); // 自适应点位置
      let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.shotPlaceFullAdress}</p></div>`
      this.infoWindow = new window.AMap.InfoWindow({
        map: this.map,
        isCustom: true,
        closeWhenClickMap: false,
        position: [data.shotPlaceLongitude, data.shotPlaceLatitude],
        offset: new window.AMap.Pixel(0, -70),
        content: sConent
      })
    },
    // 开始时间change
    handleStartTime () {
      let _this = this;
      _this.pickerEnd.disabledDate = function (time) {
        return time.getTime() > new Date(_this.filterObj.startDate).getTime() + 3 * 24 * 3600 * 1000;
      }
    },
    // 结束时间change
    handleEndTime () {
      let _this = this;
      _this.pickerStart.disabledDate = function (time) {
        return time.getTime() > new Date(_this.filterObj.endDate).getTime();
      }
    },
    /**
     * 新增车牌
     */
    onAddVehicleNumber () {
      this.$set(this.filterObj.vehicleNumberList, this.filterObj.vehicleNumberList.length, {vehicleNumber: ''});
    },
    /**
     * 删除车牌
     */
    onDeleteVehicleNumber (i) {
      this.filterObj.vehicleNumberList.splice(i, 1);
    },
    /**
     * 重置按钮
     */
    onReset () {
      this.resetLoading = true;
      let obj = {
        startDate: null,
        endDate: null,
        vehicleNumberList: [
          {vehicleNumber: ''},
          {vehicleNumber: ''},
        ],
        vehicleNumbers: null
      };
      this.filterObj = Object.assign({}, obj);
      this.resetLoading = false;
    },
    /**
     * 查询按钮
     */
    onSearch () {
      this.searchLoading = true;
      let arr = [];
      this.filterObj.vehicleNumberList.forEach(item => {arr.push(item.vehicleNumber)});
      this.filterObj.vehicleNumbers = arr.join('-');
      const params = {
        // startDate: formatDate(this.filterObj.startDate),
        startDate: '2019-07-01 00:12:12',
        endDate: formatDate(this.filterObj.endDate),
        vehicleNumbers: this.filterObj.vehicleNumbers,
        order:"asc",
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      }
      getMultiVehicleList(params)
        .then(res => {
          if (res && res.data) {
            console.log('res', res)
            this.pagination.total = res.data.total;
            this.dataList = res.data.list;
            this.searchLoading = false;
          } else {
            this.searchLoading = false;
          }
        })
        .catch(() => {this.searchLoading = false;})
    },
    /**
     * 打开抓拍弹框
     */
    onOpenDetail (obj) {
      this.$_showLoading({text: '加载中...'});
      console.log(obj)
      console.log(this.sturcDetail.videoPath)
      if (obj.peerVehicleInfoDtoList && obj.peerVehicleInfoDtoList.length > 0) {
        this.vehicleList = obj.peerVehicleInfoDtoList;
      }
      // this.videoUrl = this.sturcDetail.videoPath;
      // this.playUrl = {
      //   type: 3,
      //   title: '',
      //   video: {
      //     uid: 1,
      //     downUrl: this.sturcDetail.videoPath
      //   }
      // }
      this.strucDetailDialog = true;
      this.$nextTick(() => {
        this.getVehicleDetail(obj);
      })
      this.$_hideLoading();
    },
    // 获取车辆抓拍详情
    getVehicleDetail (obj) {
      // const params = {
      //   dateStart: formatDate(this.filterObj.startDate),
      //   dateEnd: formatDate(this.filterObj.endDate),
      //   devIds: obj.deviceID,
      //   plateNo: obj.plateNo
      // }
      const params = {
        dateStart: '2019-01-01',
        dateEnd: '2019-09-01',
        // devIds: obj.deviceID,
        plateNo: '湘A77777'
      }
      getSnapDetail(params)
        .then(res => {
          if (res && res.data) {
            this.strucInfoList = res.data.snapDtoList;
            this.sturcDetail = res.data.snapDtoList[0];
            this.initMap();
          }
        })
    },
    /**
     * 关闭抓拍弹框
     */
    onCloseDetail () {
      this.strucCurTab = 1;
      this.strucDetailDialog = false;
    },
    /**
     * 图片切换
     */
    imgListTap (obj, i) {
      this.sturcDetail = {};
      this.curImgIndex = i;
      this.sturcDetail = obj;
      console.log(this.sturcDetail)
    },
    /**
     * 分页赋值
     */
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.onSearch();
    },
  }
}
</script>
<style lang="scss" scoped>
.th-many-peers {
  width: 100%; height: 100%;
  padding-top: 50px;
  .the-bottom {
    width: 100%;
    height: 100%;
    // height: calc(100% - 60px);
    display: flex;
    position: relative;
    .the-left-search {
      width: 272px;height: 100%;
      background: #fff;
      box-shadow: 5px 0 10px #E5E7E7;
      animation: fadeInLeft .4s ease-out .3s both;
      padding: 20px 0 20px 15px;
      position: relative;
      .input-box {
        width: 100%;
        height: calc(100% - 50px);
        overflow: hidden;
        .input-box-line {
          display: flex;
          padding-bottom: 12px;
          padding-right: 15px;
          .title {
            display: flex;
            flex-direction: column;
            color: #909399;
            width: 20px;
          }
        }
        .add-vehicle-number {
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #909399;
          cursor: pointer;
          i {
            font-size: 20px;
            vertical-align: text-top;
          }
        }
      }
    }
    .the-right-result {
      width: calc(100% - 285px);  
      height: 100%;
      margin-left: 13px;
      // background: #F7F9F9;
      padding: 15px 12px 25px 0;
      overflow-y: hidden;
      .the-result-box-dctx {
        width: 100%;
        height: 100%;
        // background: #F6F8F9;
        .list-box {
          display: flex;
          flex-wrap: wrap;
          // justify-content: space-between;
          flex-flow: row wrap;
          // height: calc(100% - 45px);
          .list-item {
            width: 24%;
            height: 344px;
            padding: 15px;
            margin-bottom: 15px;
            background: #fff;
            margin-left: 1.3%;
            cursor: pointer;
            &:nth-child(4n - 3) {
              margin-left: 0;
            }
            img {
              display: inline-block;
              width: 100%;
              height: calc(100% - 70px);
            }
            p {
              font-size: 14px;
              font-family: 'MicrosoftYaHei';
              font-weight: 500;
              color: #333;
              i {
                color: #999;
                margin-right: 3px;
                display: block;
                width: 15px;
                height: 15px;
              }
            }
            .time {
              display: flex;
              align-items: center;
              padding: 10px 0 5px 0;
              i {
                background: url("../../../../../assets/img/the-time.png") no-repeat;
                background-size: 15px 15px;
              }
            }
            .address {
              display: flex;
              align-items: center;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              i {
                background: url("../../../../../assets/img/the-daynoint.png") no-repeat;
                background-size: 15px 15px;
              }
            }
          }
        }
        .th-center-pagination {
          width: 100%;
          text-align: center;
          padding: 0 0 20px 0;
        }
      }
    }
  }
}
</style>


<style lang="scss">
html {font-size: 100px;}
@media screen and (min-width: 960px) and (max-width: 1119px) {html {font-size: 60px !important;}}
@media screen and (min-width: 1200px) and (max-width: 1439px) {html {font-size: 70px !important;}}
@media screen and (min-width: 1440px) and (max-width: 1679px) {html {font-size: 80px !important;}}
@media screen and (min-width: 1680px) and (max-width: 1919px) {html {font-size: 90px !important;}}
@media screen and (min-width: 1920px) {html {font-size: 100px !important;} }
.the-right-result .__view {
  background-color: none;
}
.struc_detail_dialog {
  .el-dialog {
    max-width: 13.06rem;
    width: 100%!important;
  }
  .el-dialog__header {
    display: none;
  }
  .struc_tab {
    height: 1.16rem;
    padding: .3rem 0;
    position: relative;
    color: #999999;
    span {
      display: inline-block;
      margin-right: .55rem;
      padding-bottom: .1rem;
      cursor: pointer;
    }
    .active {
      color: #0C70F8;
      border-bottom: 2px solid #0C70F8;
    }
    i {
      display: block;
      position: absolute;
      top: .3rem;
      right: 0px;
      cursor: pointer;
    }
  }
  .struc_main {
    width: 11.86rem;
    height: 4.4rem;
    margin: 0 auto;
    border-bottom: 1px solid #F2F2F2;
    .download_btn {
      display: inline-block;
      width:160px;height:40px;
      background:rgba(246,248,249,1);
      border:1px solid rgba(211,211,211,1);
      border-radius:4px;
      text-align: center;
      line-height: 40px;
      position: absolute;
      top: 4.9rem;
      right: 0.68rem;
      text-decoration: none;
      color: #B2B2B2;
      cursor: pointer;
    }
    .struc_c_detail {
      width:  100%;
      height: 3.6rem;
      >div {
        float: left;
      }
      .struc_c_d_img {
        width: 3.6rem;
        height: 3.6rem;
        background: #EAEAEA;
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
          top: .1rem;
          right: .1rem;
          line-height: .26rem;
          height: .26rem;
          background: rgba(255, 255, 255, .8);
          border-radius: .13rem;
          font-style: normal;
          color: #0C70F8;
          font-size: 12px;
          padding: 0 .1rem;
        }
      }
      .struc_c_d_qj {
        margin-right: .2rem;
        &:before {
          display: block;
          content: '';
          position: absolute;
          top: -.5rem;
          left: -.5rem;
          transform: rotate(-45deg);
          border: .5rem solid #50CC62;
          border-color: transparent transparent #50CC62;
          z-index: 9;
        }
        span {
          display: block;
          position: absolute;
          top: .1rem;
          left: .1rem;
          width: .6rem;
          height: .6rem;
          text-align: center;
          color: #FFFFFF;
          font-size: .12rem;
          -webkit-transform: rotate(-45deg);
          -moz-transform: rotate(-45deg);
          -ms-transform: rotate(-45deg);
          -o-transform: rotate(-45deg);
          transform: rotate(-45deg);
          z-index: 99;
        }
      }
      .struc_c_d_qii {
        // margin-right: .3rem;
        &:before {
          display: block;
          content: '';
          position: absolute;
          top: -.5rem;
          left: -.5rem;
          transform: rotate(-45deg);
          border: .5rem solid #0c70f8;
          border-color: transparent transparent #0C70F8;
          z-index: 9;
        }
        span {
          display: block;
          position: absolute;
          top: .1rem;
          left: .1rem;
          width: .6rem;
          height: .6rem;
          text-align: center;
          color: #FFFFFF;
          font-size: .12rem;
          -webkit-transform: rotate(-45deg);
          -moz-transform: rotate(-45deg);
          -ms-transform: rotate(-45deg);
          -o-transform: rotate(-45deg);
          transform: rotate(-45deg);
          z-index: 99;
        }
      }
      // .struc_c_d_quanjing {

      // }
      .struc_c_d_box {
        width: calc(100% - 3.9rem);
      }
      .struc_c_d_box, .struc_c_d_quanjing {
        display: flex;
        height: 3.6rem;
        box-shadow: 0px 5px 16px 0px rgba(169,169,169,0.2);
        border-radius: 1px;
        position: relative;
        overflow: hidden;
        &:before {
          display: block;
          content: '';
          position: absolute;
          top: -.5rem;
          left: -.5rem;
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
          border: .5rem solid #0c70f8;
          border-color: transparent transparent #0C70F8;
          z-index: 9;
        }
        .th-video-text {
          display: block;
          position: absolute;
          top: .08rem;
          left: .08rem;
          width: 0.8rem;
          height: 0.8rem;
          text-align: center;
          color: #FFFFFF;
          font-size: .12rem;
          -webkit-transform: rotate(-45deg);
          -moz-transform: rotate(-45deg);
          -ms-transform: rotate(-45deg);
          -o-transform: rotate(-45deg);
          transform: rotate(-45deg);
          z-index: 99;
        }
        > div {
          float: left;
        }
        .struc_c_d_info {
          width: calc(100% - 600px);
          padding-left: .24rem;
          color: #333333;
          .th-dctx-tab {
            padding: 8px 0 5px 0;
            .line {
              padding: 2px 0;
              span {
                display: inline-block;
                &:nth-child(1) {
                  color: #333;
                  font-weight: 600;
                }
                &:nth-child(2) {
                  color: #999;
                }
              }
            }
          }
          .struc_cdi_box {
            height: calc(100% - 75px);
            .vehicle-info-box {
              display: flex;
              // width: 100%;
              height: 60px;
              background: #FAFAFA;
              border: 1px solid #F2F2F2;
              margin-top: 10px;
              margin-right: .14rem;
              &:nth-child(1) {
                margin-top: 0;
              }
              .left {
                width: 71px;
                height: 60px;
                line-height: 60px;
                text-align: center;
                border-right: 1px solid #F2F2F2;
              }
              .right {
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 0 8px;
                color: #333;
                p:nth-child(2) {
                  padding-top: 2px;
                  >span {
                    margin-right: 5px;
                  }
                  b {
                    // float: right;
                    padding-left: 10px;
                    color: #999;
                    font-weight: normal;
                  }
                }
              }
            }
          }
        }
      }
    }
    .struc_c_address {
      width:  100%;
      height: 100%;
      #container {
        width:  100%;
        height: 100%;
      }
    }
  }
  .struc-list {
    width: 12.46rem;
    margin: 0 auto;
    padding: .44rem 0 .34rem 0;
    .swiper-container {
      padding: .02rem .5rem;
      &:before {
        display: block;
        content: '';
        width: .5rem;
        height: 110%;
        background: #FFFFFF;
        position: absolute;
        left: 0;
        z-index: 9;
        border: 1px solid #FFFFFF;
      }
      &:after {
        display: block;
        content: '';
        width: .5rem;
        height: 110%;
        background: #FFFFFF;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 9;
        border: 1px solid #FFFFFF;
      }
      .swiper-button-next {
        right:  0;
      }
      .swiper-button-prev {
        left: 0;
      }
      .swiper-slide {
        .swiper_img_item {
          cursor: pointer;
          border: 1px solid #FFFFFF;
          padding: 2px;
          .vl_jfo_sim {
            font-size: .14rem;
            height: .3rem;
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
          border-color: #0C70F8;
          box-shadow: inset 0px 3px 3px #c8c8c8;
          .vl_jfo_sim {
            color: #0C70F8;
          }
        }
      }
    }
  }
}
.cap_info_win {
  background: #FFFFFF;
  padding: .18rem;
  font-size: .14rem;
  color: #666666;
  position: relative;
  &:after {
    display: block;
    content: '';
    border: .1rem solid #FFFFFF;
    border-color: #FFFFFF transparent transparent;
    position: absolute;
    bottom: -.2rem;
    left: calc(50% - .05rem);
  }
}
.input-box-line {
  .el-input__inner:hover,
  .el-input__inner:focus {
    border-color: #DCDFE6;
  }
  .el-input-group__prepend {
    background: #fff;
    padding: 0 5px;
  }
  .left-none-border {
    .el-input__inner {
      border-left: none;
    }
  }
  .el-date-editor {
    .el-input__inner {
      padding-left: 15px;
    }
    .el-input__prefix {right: 5px;left: auto;}
  }
}
.the-left-search {
  .btn-box {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    position: fixed;
    bottom: 15px;
    left: 0;
    .el-button {
      width: 110px;height: 40px;
    }
    .el-button.th-btn-color {
      background: #0C70F8;
      color: #fff;
      border: none;
    }
  }
}
</style>
