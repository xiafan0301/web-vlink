<template>
  <div class="snap_dialog">
    <!--详情弹窗-->
    <el-dialog
      :visible.sync="strucDetailDialog"
      class="struc_detail_dialog_comp"
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
        <ul v-show="strucCurTab === 1">
          <!-- <li><span>抓拍设备：{{sturcDetail.deviceName}}</span></li> -->
          <li><span style="line-height: 0.24rem;">抓拍地址：{{sturcDetail.address}}</span></li>
          <li style="color: #999;line-height: 0.24rem;">{{sturcDetail.shotTime}}</li>
        </ul>
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.subStoragePath" class="bigImg" />
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_qjj struc_c_d_img">
              <img :src="sturcDetail.storagePath" class="bigImg" />
              <span>全景图</span>
            </div>
            <div class="struc_c_d_info">
              <h2>分析结果</h2>
              <div class="struc_cdi_content">
                <vue-scroll>
              <!-- <div class="struc_cdi_line simple_line">
                <p>
                  <b>抓拍时间</b>
                  <span>{{sturcDetail.shotTime}}</span>
                </p>
              </div>
              <div class="struc_cdi_line simple_line">
                <p>
                  <b>抓拍设备</b>
                  <span>{{sturcDetail.deviceName}}</span>
                </p>
              </div>
              <div class="struc_cdi_line">
                <p>
                  <b>抓拍地址</b>
                  <span>{{sturcDetail.address}}</span>
                </p>
              </div> -->
              <div class="struc_cdi_line" v-if="sturcDetail.sex">
                <p>
                  <b>性别</b>
                  <span>{{sturcDetail.sex}}</span>
                </p>
              </div>
              <div class="struc_cdi_line" v-if="sturcDetail.age">
                <p>
                  <b>年龄段</b>
                  <span>{{sturcDetail.age}}</span>
                </p>
              </div>
              <div class="struc_cdi_line" v-if="sturcDetail.glasses">
                <p>
                  <b>眼镜</b>
                  <span>{{sturcDetail.glasses}}</span>
                </p>
              </div>
              <div class="struc_cdi_line" v-if="sturcDetail.hat">
                <p>
                  <b>帽子</b>
                  <span>{{sturcDetail.hat}}</span>
                </p>
              </div>
              <div class="struc_cdi_line" v-if="sturcDetail.mask">
                <p>
                  <b>口罩</b>
                  <span>{{sturcDetail.mask}}</span>
                </p>
              </div>
              <div class="struc_cdi_line" v-if="sturcDetail.hair">
                <p>
                  <b>发型</b>
                  <span>{{sturcDetail.hair}}</span>
                </p>
              </div>
              <div class="struc_cdi_line" v-if="sturcDetail.upperType">
                <p>
                  <b>上身款式</b>
                  <span>{{sturcDetail.upperType}}</span>
                </p>
              </div>
              <div class="struc_cdi_line" v-if="sturcDetail.upperColor">
                <p>
                  <b>上身颜色</b>
                  <span>{{sturcDetail.upperColor}}</span>
                </p>
              </div>
              <div class="struc_cdi_line" v-if="sturcDetail.bottomType">
                <p>
                  <b>下身款式</b>
                  <span>{{sturcDetail.bottomType}}</span>
                </p>
              </div>
              <div class="struc_cdi_line" v-if="sturcDetail.bottomColor">
                <p>
                  <b>下身颜色</b>
                  <span>{{sturcDetail.bottomColor}}</span>
                </p>
              </div>
              <div class="struc_cdi_line" v-if="sturcDetail.baby">
                <p>
                  <b>抱小孩</b>
                  <span>{{sturcDetail.baby}}</span>
                </p>
              </div>
              <div class="struc_cdi_line" v-if="sturcDetail.bag">
                <p>
                  <b>拎东西</b>
                  <span>{{sturcDetail.bag}}</span>
                </p>
              </div>
           
              <!-- <div class="struc_cdi_line">
                <p v-if="sturcDetail.features">
                  <b>特征</b>
                  <span>{{sturcDetail.features}}</span>
                </p>
                <p class="tz" v-else>
                  <b>特征</b>
                  <span>{{sturcDetail.sex+" "+(sturcDetail.age || "")+ " " + (sturcDetail.hair || "")+ " " +(sturcDetail.hat || "")+" "+ (sturcDetail.baby || "")+ " " + (sturcDetail.bag || "") + " "+(sturcDetail.upperColor || "")+(sturcDetail.upperTexture || "")+(sturcDetail.upperType || "")+ " " + (sturcDetail.bottomColor || "") +(sturcDetail.bottomType || "")}}</span>
                </p>
              </div> -->
                </vue-scroll>
              </div>
            </div>
            <!-- <span>抓拍信息</span> -->
          </div>
          <!-- <div class="operate_btn" @click="spinToRecog()">身份确认</div> -->
          <div class="operate_btn" @click="spinToGJFX()">轨迹分析</div>
          <div class="operate_btn margin_btn" @click="spinToLJD()">落脚点分析</div>
          <div class="operate_btn margin_btn" @click="spinToControl()">新建布控</div>
        </div>
        <div v-show="strucCurTab === 2" class="struc_c_address"></div>
        <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
          <div class="struc_c_d_qj struc_c_d_img">
            <img class="bigImg" :src="sturcDetail.subStoragePath" alt />
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
      <div class="struc-list">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in strucInfoList" :key="item.id">
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
                <span style="font-size: 12px;">%</span>
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
let AMap = window.AMap;
export default {
  props: {
    snapObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      playing: false, // 视频播放是否
      stucOrder: 2, // 1升序，2降序，3监控，4相似度
      strucCurTab: 1,
      curImgIndex: 0,
      strucDetailDialog: false,
      sturcDetail: {},
      swiperOption: {
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
      strucInfoList: [],
      videoUrl: "" // 弹窗视频回放里的视频
    };
  },
  watch: {
    snapObj(val) {
      console.log("=====111111111111===", val);
      if (val.personDetailList && val.personDetailList.length > 0) {
        this.sturcDetail = val.personDetailList[0];
        this.strucInfoList = val.personDetailList;
        if (this.amap) {
          this.drawPoint(this.sturcDetail);
        } else {
          setTimeout(() => {
            this.initMap();
          }, 200);
        }
      }
    },
    strucCurTab(e) {
      if (e === 2) {
        if (this.amap) {
          this.drawPoint(this.sturcDetail);
        } else {
          setTimeout(() => {
            this.initMap();
          }, 200);
        }
      } else if (e === 3) {
        this.videoUrl = document.getElementById("capVideo").src;
      }
    }
  },
  mounted() {},
  methods: {
    toogleVisiable(f) {
      this.strucDetailDialog = f;
      if (
        this.snapObj.personDetailList &&
        this.snapObj.personDetailList.length > 0
      ) {
        console.log("99999999", this.snapObj);
        this.curImgIndex = 0;
        this.strucCurTab = 1;
        this.sturcDetail = this.snapObj.personDetailList[0];
        this.strucInfoList = this.snapObj.personDetailList;
        if (this.amap) {
          this.drawPoint(this.sturcDetail);
        } else {
          setTimeout(() => {
            this.initMap();
          }, 200);
        }
      }
    },
    imgListTap(item, index) {
      this.curImgIndex = index;
      console.log("--------------", this.curImgIndex, item);
      this.sturcDetail = item;
      if (this.amap) {
        this.drawPoint(item);
      } else {
        setTimeout(() => {
          this.initMap();
        }, 200);
      }
    },
    initMap() {
      if (this.amap) {
        return;
      }
      let _this = this;
      let map = new AMap.Map("capMap", {
        center: [112.974691, 28.093846],
        zoom: 16
      });
      map.setMapStyle("amap://styles/whitesmoke");
      this.amap = map;
      this.drawPoint(_this.sturcDetail);
    },
    drawPoint(data) {
      this.$nextTick(() => {
        $(".struc_c_address").append($("#capMap"));
      });
      if (this.markerPoint) {
        this.amap.remove(this.markerPoint);
      }
      let _content = '<div class="vl_icon vl_icon_judge_02"></div>';
      if (data.shotPlaceLongitude && data.shotPlaceLatitude) {
        console.log(
          "--------------------",
          data.shotPlaceLongitude,
          data.shotPlaceLatitude
        );
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
      }
    },
    videoTap() {
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
    //跳转到身份确认页面
    spinToRecog() {
      this.$router.push({
        name: "indenty_recog",
        query: { path: this.sturcDetail.subStoragePath, semblance: 90 }
      });
    },
    //跳转到新建布控任务页面
    spinToControl() {
      this.$router.push({
        name: "control_create",
        query: {
          imgurl: this.sturcDetail.subStoragePath,
          modelName: "人员追踪"
        }
      });
    },
    //跳转到落脚点分析页面
    spinToLJD() {
      this.$router.push({
        name: "portrait_ljd",
        query: { path: this.sturcDetail.subStoragePath }
      });
    },
    //跳转到轨迹分析页面
    spinToGJFX() {
      this.$router.push({
        name: "portrait_gjfx",
        query: { imgurl: this.sturcDetail.subStoragePath }
      });
    }
  }
};
</script>
<style lang="scss">
html {font-size: 100px;}
  @media screen and (min-width: 960px) and (max-width: 1119px) {html {font-size: 60px !important;}}
  @media screen and (min-width: 1200px) and (max-width: 1439px) {html {font-size: 70px !important;}}
  @media screen and (min-width: 1440px) and (max-width: 1679px) {html {font-size: 80px !important;}}
  @media screen and (min-width: 1680px) and (max-width: 1919px) {html {font-size: 90px !important;}}
  @media screen and (min-width: 1920px) {html {font-size: 100px !important;} }
.snap_dialog {
  /* height: 100%; */
  .struc_detail_dialog_comp {
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
      width: 12rem;
      height: 4.88rem;
      margin: 0 auto;
      border-bottom: 1px solid #f2f2f2;
      @mixin btn-style {
        position: relative;
        text-decoration: none;
        text-align: center;
        height: 0.4rem;
        float: right !important;
        margin-top: 0.2rem;
        padding: 0 0.12rem;
        background: rgba(246, 248, 249, 1);
        border: 1px solid rgba(211, 211, 211, 1);
        border-radius: 4px;
        line-height: 0.4rem;
        cursor: pointer;
        color: #666666;
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
      .struc_c_detail {
        width: 100%;
        height: 3.6rem;
        > div {
          float: left;
        }
        @mixin text-style {
          p {
            font-size: 12px;
            color: #666;
            &.name_info {
              span {
                border: 1px solid #f2f2f2;
                border-radius: 3px;
                background-color: #fafafa;
                margin: 0 0.08rem 0.08rem 0;
                display: inline-block;
                height: 0.26rem;
                line-height: 0.26rem;
                padding-left: 0.08rem;
                padding-right: 0.08rem;
                &:nth-child(1) {
                  padding-left: 0.12rem;
                  padding-right: 0.12rem;
                }
              }
            }
            &.correlated_info {
              border: 1px solid #f2f2f2;
              border-radius: 3px;
              background-color: #fafafa;
              margin: 0 0.08rem 0.08rem 0;
              display: inline-block;
              height: 0.26rem;
              line-height: 0.26rem;
              padding-left: 0.12rem;
              padding-right: 0.12rem;
              span:nth-child(1) {
                padding-right: 0.12rem;
                border-right: 1px solid#F2F2F2;
              }
              span:nth-child(2) {
                padding-left: 0.12rem;
              }
            }
          }
        }
        .struc_c_d_l_box {
          position: relative;
          .hover_info {
            width: 3.4rem;
            max-height: 2.23rem;
            box-shadow: 0px 5px 18px 0px rgba(169, 169, 169, 0.39);
            background-color: #fff;
            position: absolute;
            bottom: 0.1rem;
            left: 0.1rem;
            padding: 0.24rem 0.2rem;
            cursor: pointer;
            .hover_i_header {
              font-size: 18px;
              color: #333;
              font-weight: bold;
              padding-bottom: 0.2rem;
            }
            @include text-style;
          }
        }
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
            cursor: pointer;
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
        .struc_c_d_qjj {
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
          .struc_cdi_content {
            height: 2.75rem;
            display: flex;
            flex-wrap: wrap;
          }
          .struc_c_d_info {
            width: calc(100% - 3.6rem);
            padding-left: 0.2rem;
            color: #333333;
            h2 {
              font-weight: bold;
              line-height: 0.74rem;
              padding-right: 1rem;
              font-size: 18px;
              position: relative;
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
              .box_grade_info {
                position: absolute;
                top: 0.09rem;
                left: 0.8rem;
              }
            }
            .struc_cdu_line {
              border: 1px solid #f2f2f2;
              border-radius: 3px;
              background-color: #fafafa;
              margin: 0 0.08rem 0.08rem 0;
              display: inline-block;
              height: 0.3rem;
              line-height: 0.3rem;
              padding-left: 0.1rem;
              padding-right: 0.1rem;
              font-size: 12px;
              span:nth-child(1) {
                padding-right: 0.1rem;
                border-right: 1px solid#F2F2F2;
              }
              span:nth-child(2) {
                padding-left: 0.1rem;
                color: #666;
              }
            }
            .struc_cdi_line {
              flex: none;
              width: 50%;
              display: inline-block;
              p {
                max-width: 100%;
                overflow: hidden;
                display: table;
                min-height: .3rem;
                margin-bottom: 0.08rem;
                padding-right: .08rem;
                margin-right: 0.08rem;
                border: 1px solid #f2f2f2;
                border-radius: 3px;
                font-size: 12px;
                > b {
                  width: 70px;
                  background: #fafafa;
                  color: #999;
                  font-weight: normal;
                  text-align: center;
                  display: table-cell;
                  vertical-align: middle;
                  border-right: 1px solid #f2f2f2;
                }
                >span {
                  display: table-cell;
                  vertical-align: middle;
                  padding-left: .08rem;
                }
              }
            }
          }
         /*  &:before {
            display: block;
            content: "";
            position: absolute;
            top: -0.7rem;
            right: -0.7rem;
            transform: rotate(-46deg);
            border: 0.7rem solid #0c70f8;
            border-color: transparent transparent transparent #0c70f8;
          }
          &:after {
            display: block;
            content: "";
            position: absolute;
            top: -0.4rem;
            right: -0.4rem;
            transform: rotate(-45deg);
            border: 0.4rem solid #ffffff;
            border-color: transparent transparent transparent #ffffff;
          } */
          > span {
            display: block;
            position: absolute;
            top: 0.19rem;
            right: 0.19rem;
            width: 1rem;
            height: 1rem;
            text-align: center;
            color: #ffffff;
            font-size: 0.12rem;
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            transform: rotate(45deg);
            z-index: 99;
          }
        }
        .operate_btn {
          @include btn-style;
          color: #ffffff;
          background: #0c70f8;
          border-color: #0c70f8;
        }
        .margin_btn {
          margin-right: 20px;
        }
      }
      .struc_c_address {
        height: 100%;
        #capMap {
          width: 100%;
          height: 100%;
        }
      }
      .cap_info_win {
        background: #ffffff;
        padding: 0.18rem;
        font-size: 0.14rem;
        color: #666666;
        position: relative;
        &:after {
          display: block;
          content: "";
          border: 0.1rem solid #ffffff;
          border-color: #ffffff transparent transparent;
          position: absolute;
          bottom: -0.2rem;
          left: calc(50% - 0.05rem);
        }
      }
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
          @include btn-style;
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
