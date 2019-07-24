<template>
  <el-dialog
    :visible.sync="strucDetailDialog"
    class="gcck_detail_dialog"
    :close-on-click-modal="false"
    :append-to-body="true"
    :show-close="false"
    >
    <div class="struc_tab">
      <span :class="{'active': strucCurTab === 1}" @click="strucCurTab = 1">抓拍详情</span>
      <span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>
      <span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>
      <i style="font-size: 20px;" class="el-icon-close" @click="strucDetailDialog = false"></i>
    </div>
    <div class="struc_main" >
      <div v-show="strucCurTab === 1" class="struc_c_detail">
        <div class="struc_c_d_qj struc_c_d_img">
          <img :src="sturcDetail.storagePath" class="bigImg" title="点击放大图片" alt />
          <span>全景图</span>
        </div>
        <div class="struc_c_d_box">
          <div class="struc_c_d_img struc_c_d_img_green">
            <img :src="sturcDetail.subStoragePath" class="bigImg" title="点击放大图片" alt />
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_info">
            <vue-scroll>
              <h2>抓拍信息</h2>
              <!-- 特征展示框 -->
              
              <!-- 车辆的信息栏 -->
              <div class="struc_cdi_line_tzsc" v-if="sturcDetail.shotTime">
                <p class="line_content">
                  <span class="key">抓拍时间</span>
                  <span class="val">{{sturcDetail.shotTime}}</span>
                </p>
              </div>
              <div class="struc_cdi_line_tzsc" v-if="sturcDetail.deviceName">
                <p class="line_content">
                  <span class="key">抓拍设备</span>
                  <span class="val">{{sturcDetail.deviceName}}</span>
                </p>
              </div>
              <div class="struc_cdi_line_tzsc" v-if="sturcDetail.address">
                <p class="line_content">
                  <span class="key" title="抓拍地点">抓拍地点</span>
                  <span class="val">{{sturcDetail.address}}</span>
                </p>
              </div>
              <div class="struc_cdi_line_tzsc" v-if="sturcDetail.plateNo">
                <p class="line_content">
                  <span class="key">车牌号码</span>
                  <span class="val">{{sturcDetail.plateNo}}</span>
                </p>
              </div>
              <!-- 5个特征 -->
              <div class="struc_cdi_line_tzsc" v-if="sturcDetail.plateColor">
                <p class="line_content">
                  <span class="key">车牌颜色</span>
                  <span class="val">{{sturcDetail.plateColor}}</span>
                </p>
              </div>
              <div class="struc_cdi_line_tzsc" v-if="sturcDetail.vehicleModel">
                <p class="line_content">
                  <span class="key">车辆型号</span>
                  <span class="val">{{sturcDetail.vehicleModel}}</span>
                </p>
              </div>
              <div class="struc_cdi_line_tzsc" v-if="sturcDetail.vehicleColor">
                <p class="line_content">
                  <span class="key">车辆颜色</span>
                  <span class="val">{{sturcDetail.vehicleColor}}</span>
                </p>
              </div>
              <div class="struc_cdi_line_tzsc" v-if="sturcDetail.vehicleClass">
                <p class="line_content">
                  <span class="key">车辆类型</span>
                  <span class="val">{{sturcDetail.vehicleClass}}</span>
                </p>
              </div>
              <div
                class="struc_cdi_line_tzsc"
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
        <div id="capMap"></div>
      </div>
      <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
        <div class="struc_c_d_qj struc_c_d_img">
          <img class="bigImg" title="点击放大图片" :src="sturcDetail.subStoragePath" alt />
          <span>抓拍图</span>
        </div>
        <div class="struc_c_d_box" v-if="sturcDetail.videoPath">
          <video id="capVideo" :src="sturcDetail.videoPath"></video>
          <div class="play_btn" @click="videoTap" v-show="!playing">
            <i class="vl_icon vl_icon_judge_01" v-if="playing"></i>
            <i class="vl_icon vl_icon_control_09" v-else></i>
          </div>
        </div>
        <div class="struc_c_d_box" style="padding: 10px 0 0 0; color: #666;" v-else>
          暂无视频
        </div>
        <div class="download_btn" v-show="sturcDetail.videoPath">
          <a download="视频" :href="videoUrl"></a>下载视频
        </div>
      </div>
    </div>
    <div class="struc-list" v-show="strucInfoList.length > 1">
      <swiper :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide v-for="(item, index) in strucInfoList" :key="'my_swiper' + index">
          <div
            class="swiper_img_item"
            :class="{'active': index === curImgIndex}"
            @click="imgListTap(item, index)">
            <img style="width: 100%; height: .88rem;" :src="item.subStoragePath" alt />
          </div>
        </swiper-slide>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
    </div>
  </el-dialog>
</template>
<script>
import { mapXupuxian } from "@/config/config.js";
export default {
  props: ['oData'],
  data () {
    return {
      strucDetailDialog: false,
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
      amap: null,
      markerPoint: null,
      infoWindow: null,
      strucInfoList: [],
      playing: false, // 视频播放是否
      strucCurTab: 1, // 1抓拍详情 2抓拍地点 3抓拍视频
      curImgIndex: 0, // 当前图片index
      sturcDetail: {},
      videoUrl: '' // 弹窗视频回放里的视频
    }
  },
  watch: {
    oData (val) {
      if (val) {
        this.strucDetailDialog = true;
        this.sturcDetail = val.list[val.index];
        this.strucInfoList = val.list;
        this.curImgIndex = val.index;
      }
    },
    strucCurTab(e) {
      if (e === 2) {
        this.drawPoint(this.sturcDetail);
      }
    }
  },
  created () {
  },
  methods: {
    imgListTap(data, index) {
      // 点击swiper图片
      this.playing = false;
      this.curImgIndex = index;
      this.sturcDetail = data;
      if (this.strucCurTab === 2) {
        this.drawPoint(data); // 重新绘制地图
      }
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
    // 绘制地图
    drawPoint(data) {
      if (!this.amap) {
        // 初始化地图
        let map = new AMap.Map("capMap", {
          center:mapXupuxian.center,
          zoom: 16
        });
        map.setMapStyle("amap://styles/whitesmoke");
        this.amap = map;
      }
      if (this.markerPoint) {
        this.amap.remove(this.markerPoint);
        this.markerPoint = null;
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
  },
  beforeDestroy () {
    if (this.amap) {
      this.amap.destroy();
    }
  }
}
</script>
<style lang="scss">
// 抓拍详情弹窗
.gcck_detail_dialog {
  .el-dialog {
    max-width: 13.06rem;
    width: 100% !important;
  }
  .el-dialog__header {
    display: none;
  }
  .struc_tab {
    height: 1.16rem;
    padding: 0.3rem 0.3rem;
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
      right: 30px;
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
          .struc_cdi_line_tzsc {
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
          border: 2px solid #ffffff;
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
</style>
