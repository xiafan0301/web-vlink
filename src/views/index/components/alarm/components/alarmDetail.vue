<template>
  <div class="alarm-dialog">
    <!--详情弹窗-->
    <el-dialog
      :visible.sync="strucDetailDialog"
      class="struc_detail_dialog_comp"
      :close-on-click-modal="false"
      top="4vh"
      :show-close="false">
      <div class="struc_tab">
        <span :class="{'active': strucCurTab === 1}" @click="strucCurTab = 1">抓拍详情</span>
        <span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>
        <span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>
        <i class="el-icon-close" @click="strucDetailDialog = false"></i>
      </div>
      <div class="struc_main" v-if="sturcDetail">
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_l_box" @mouseenter="onMouseOver()" @mouseleave="onMouseOut()">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.basePortraitInfo.photoUrl" alt="布控图" v-if="sturcDetail.objType == 1">
            <img :src="sturcDetail.vehicleInfo.vehicleImagePath" alt="布控图" v-if="sturcDetail.objType == 2">
            <img :src="sturcDetail.appendixInfo.path" alt="布控图" v-if="sturcDetail.objType == 3">
            <span>布控图</span>
          </div>
          <div class="hover_info" v-show="isSeen">
            <p class="hover_i_header">布控信息</p>
              <template v-if="sturcDetail.objType == 1">
                <p class="name_info" >
                  <span>{{sturcDetail.basePortraitInfo.name}}</span>
                  <span>{{sturcDetail.basePortraitInfo.sexStr}}</span>
                  <span>{{sturcDetail.basePortraitInfo.nationStr}}</span>
                </p>
                <p class="correlated_info">
                  <span>{{sturcDetail.basePortraitInfo.idNo}}</span>
                  <span>身份证号</span>
                </p>
                <p class="correlated_info">
                  <span>{{sturcDetail.basePortraitInfo.birthDate | fmTimestamp('yyyy-MM-dd')}}</span>
                  <span>出生日期</span>
                </p>
                <p class="correlated_info">
                  <span>{{sturcDetail.basePortraitInfo.remarks}}</span>
                  <span>备注信息</span>
                </p>
              </template>
              <template v-if="sturcDetail.objType == 2">
                <p class="name_info" >
                  <span>{{sturcDetail.vehicleInfo.vehicleNumber}}</span>
                  <span>{{sturcDetail.vehicleInfo.vehicleTypeStr}}</span>
                  <span v-if="sturcDetail.vehicleInfo.ownerName">{{sturcDetail.vehicleInfo.ownerName}}</span>
                </p>
                <p class="correlated_info" v-if="sturcDetail.vehicleInfo.ownerIdCard">
                  <span>{{sturcDetail.vehicleInfo.ownerIdCard}}</span>
                  <span>身份证号</span>
                </p>
                <p class="correlated_info" v-if="sturcDetail.vehicleInfo.ownerBirth">
                  <span>{{sturcDetail.vehicleInfo.ownerBirth | fmTimestamp('yyyy-MM-dd')}}</span>
                  <span>出生日期</span>
                </p>
                <p class="correlated_info" v-if="sturcDetail.vehicleInfo.desci">
                  <span>{{sturcDetail.vehicleInfo.desci}}</span>
                  <span>备注信息</span>
                </p>
              </template>
              <template v-if="sturcDetail.objType == 3 || sturcDetail.objType == 4">
                <p class="name_info"></p>
              </template>
            </div>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img" v-show="showImg">
              <img :src="sturcDetail.snapPhoto" alt="抓拍图">
              <i @click="displayImg()">全景图</i>
            </div>
            <div class="struc_c_d_img" v-show="!showImg">
              <img :src="sturcDetail.snapFullPhoto" alt="全景图">
              <i @click="displayImg()">抓拍图</i>
            </div>
            <div class="struc_c_d_info">
              <h2>抓拍信息
                <div class="box_grade_info"> 
                    <i class="vl_icon vl_icon_alarm_2" v-if="sturcDetail.alarmLevel == 1"></i>
                    <i class="vl_icon vl_icon_alarm_3" v-if="sturcDetail.alarmLevel == 2"></i>
                    <i class="vl_icon vl_icon_alarm_4" v-if="sturcDetail.alarmLevel == 3"></i>
                    <i class="vl_icon vl_icon_alarm_5" v-if="sturcDetail.alarmLevel == 4"></i>
                    <i class="vl_icon vl_icon_alarm_6" v-if="sturcDetail.alarmLevel == 5"></i>
                </div>
                <div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_03"></i>{{sturcDetail.semblance ? (sturcDetail.semblance).toFixed(2) : 0.00}}<span style="font-size: 12px;">%</span></div>
              </h2>
              <div class="struc_cdi_line">
                <span>青年</span>
                <span>女性</span>
              </div>
              <div v-if="sturcDetail.snapTime">
                <div class="struc_cdu_line">
                  <span>{{sturcDetail.snapTime | fmTimestamp('yyyy-MM-dd HH:mm:ss')}}</span><span>抓拍时间</span>
                </div>
              </div>
              <div v-if="sturcDetail.devInfo">
                <div class="struc_cdu_line">
                  <span>{{sturcDetail.devInfo.deviceName}}</span><span>抓拍设备</span>
                </div>
              </div>
              <div v-if="sturcDetail.addressDesc">
                <div class="struc_cdu_line">
                  <span>{{sturcDetail.addressDesc}}</span><span>抓拍地址</span>
                </div>
              </div>
              <div v-if="sturcDetail.areaInfo">
                <div class="struc_cdu_line">
                  <span>{{sturcDetail.areaInfo.cname}}</span><span>区域名称</span>
                </div>
              </div>
              <div v-if="sturcDetail.eventInfo">
                <div class="struc_cdu_line">
                  <span>{{sturcDetail.eventInfo.eventCode}}</span><span>关联事件</span>
                </div>
              </div>
            </div>
            <span>相似度</span>
          </div>
          <a class="operate_btn" @click="spinToCtc(sturcDetail)">调度指挥</a>
          <a class="cancel_btn" @click="cancel(sturcDetail.uid)">撤销告警</a>
        </div>
        <div v-show="strucCurTab === 2" class="struc_c_address"></div>
        <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.snapPhoto" alt="抓拍图">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <video id="capVideo" :src="sturcDetail.snapVideo"></video>
            <div class="play_btn" @click="videoTap" v-show="!playing">
              <i class="vl_icon vl_icon_judge_01" v-if="playing"></i>
              <i class="vl_icon vl_icon_control_09" v-else></i>
            </div>
          </div>
          <a class="download_btn" :href="sturcDetail.snapVideo" download="视频">下载视频</a>
        </div>
      </div>
      <div class="struc-list">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in strucInfoList" :key="item.id">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item,index)">
              <img style="width: 100%; height: .88rem;" :src="item.snapPhoto" alt="抓拍图">
              <div class="vl_jfo_sim"  v-show="showSim"><i class="vl_icon vl_icon_retrieval_05" :class="{'vl_icon_retrieval_06':  index === curImgIndex}"></i>{{item.semblance ? item.semblance : 92}}<span style="font-size: 12px;">%</span></div>
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
import { getAlarmList, getAlarmDetail, delAlarm } from "@/views/index/api/api.control.js";
export default {
  props: {
    strucInfoList: {
      type: Array,
      default: () => []
    },
    alarmObj: {
      type: Object,
      default: () => {}
    },
  },
  data () {
    return {
      playing: false, // 视频播放是否
      stucOrder: 2, // 1升序，2降序，3监控，4相似度
      showSim: false, // 展示相似度排序
      strucCurTab: 1,
      curImgIndex: 0,
      strucDetailDialog: false,
      showImg: true,      //=true，展示抓拍图片，=false，展示全景图
      isSeen: false,
      sturcDetail: {},
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
      amap: null, // 地图实例
      markerPoint: null, // 地图点集合
      InfoWindow: null,
    }
  },
  mounted() {
    /* let map = new AMap.Map('capMap', {
      center: [112.974691, 28.093846],
      zoom: 16
    });
    map.setMapStyle('amap://styles/whitesmoke');
    this.amap = map; */
  },
  watch: {
    alarmObj(val) {
      console.log("========",val)
      if(val) {
        this.toAlarmDetail(val)
        this.curImgIndex = val.inx
      }
    },
    strucCurTab (e) {
      if (e === 2) {
        this.drawPoint(this.sturcDetail)
      }
    }
  },
  methods: {
    toogleVisiable (f) {
      this.strucDetailDialog = f
      if(this.alarmObj.uid) {
        console.log("99999999",this.alarmObj)
        this.toAlarmDetail(this.alarmObj)
        this.curImgIndex = this.alarmObj.inx
      }
    },
    //告警详情
    toAlarmDetail(item) {
      getAlarmDetail(item.uid).then( res => {
        this.sturcDetail = res.data
        this.sturcDetail['objType'] = item.objType
        this.drawPoint(this.sturcDetail);
      }).catch(() => {})
    },
    imgListTap (item, index) {
      this.curImgIndex = index;
      console.log("--------------",this.curImgIndex)
      this.toAlarmDetail(item)
    },
    drawPoint (data) {
      this.$nextTick(() => {
        $('.struc_c_address').append($('#capMap'))
      })
      if (this.markerPoint) {
        this.amap.remove(this.markerPoint)
      }
      let _content = '<div class="vl_icon vl_icon_judge_02"></div>'
      this.markerPoint = new AMap.Marker({ // 添加自定义点标记
        map: this.amap,
        position: [data.addLongitude, data.addLatitude], // 基点位置 [116.397428, 39.90923]
        offset: new AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // 自定义点标记覆盖物内容
        content: _content
      });
      this.amap.setZoomAndCenter(16, [data.addLongitude, data.addLatitude]); // 自适应点位置
      let sConent = `<div class="cap_info_win"><p>设备名称：${data.devInfo.deviceName}</p><p>抓拍地址：${data.addressDesc}</p></div>`
      this.infoWindow = new AMap.InfoWindow({
        map: this.amap,
        isCustom: true,
        closeWhenClickMap: false,
        position: [data.addLongitude, data.addLatitude],
        offset: new AMap.Pixel(0, -70),
        content: sConent
      })
    },
    videoTap () {
      let vDom = document.getElementById('capVideo')
      if (this.playing) {
        vDom.pause();
      } else {
        vDom.play();
      }
      vDom.addEventListener('ended', (e) => {
        e.target.currentTime = 0;
        this.playing = false;
      })
      this.playing = !this.playing;
    },
    displayImg() {
      this.showImg = !this.showImg
    },
    onMouseOver() {
      this.isSeen = true
    },
    onMouseOut() {
      this.isSeen = false
    },
    //跳转到调度指挥页面
    spinToCtc(item) {
      let eventType = null
      if(item.eventInfo) {
        eventType = item.eventInfo.eventType
      }
      this.$router.push({name: 'alarm_ctc', query: {eventId: item.uid, eventType: eventType}});
    },
    //撤销告警
    cancel(uid) {
      delAlarm(uid).then(res => {
        console.log("---------",res)
        this.$emit("isLoading", true)
        this.$message.success('撤销告警成功！');
        this.strucDetailDialog = false
      }).catch((e)=> {console.log(e)})
    }
  }
}
</script>
<style lang="scss">
.alarm-dialog {
  height: 100%;
  .struc_detail_dialog_comp {
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
        width: 11.46rem;
        height: 4.4rem;
        margin: 0 auto;
        border-bottom: 1px solid #F2F2F2;
        @mixin btn-style {
          text-decoration: none;
            text-align: center;
            width: 1.1rem;
            height: .4rem;
            float: right!important;
            margin-top: .2rem;
            background: rgba(246,248,249,1);
            border: 1px solid rgba(211,211,211,1);
            border-radius: 4px;
            line-height: .4rem;
            cursor: pointer;
            color: #666666;
            &:hover {
              color: #FFFFFF;
              background: #0C70F8;
              border-color: #0C70F8;
            }
        }
        .struc_c_detail {
          width:  100%;
          height: 3.6rem;
          >div {
            float: left;
          }
          @mixin text-style {
            p {
                font-size: 12px;
                color: #666;
                &.name_info {
                  span {
                    border: 1px solid #F2F2F2;
                    border-radius: 3px;
                    background-color: #FAFAFA;
                    margin: 0 .08rem .08rem 0;
                    display: inline-block;
                    height: .26rem;
                    line-height: .26rem;
                    padding-left: .08rem;
                    padding-right: .08rem;
                    &:nth-child(1) {
                      padding-left: .12rem;
                      padding-right: .12rem;
                    }
                  }
                }
                &.correlated_info {
                  border: 1px solid #F2F2F2;
                  border-radius: 3px;
                  background-color: #FAFAFA;
                  margin: 0 .08rem .08rem 0;
                  display: inline-block;
                  height: .26rem;
                  line-height: .26rem;
                  padding-left: .12rem;
                  padding-right: .12rem;
                  span:nth-child(1) {
                    padding-right: .12rem;
                    border-right: 1px solid#F2F2F2;
                  }
                  span:nth-child(2) {
                    padding-left: .12rem;
                  }
                }
              }
          }
          .struc_c_d_l_box {
            position: relative;
            .hover_info {
              width: 3.4rem;
              max-height: 2.23rem;
              box-shadow:0px 5px 18px 0px rgba(169,169,169,0.39);
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
                padding-bottom: .2rem;
              }
              @include text-style;
            }
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
              cursor: pointer;
            }
          }
          .struc_c_d_qj {
            margin-right: .3rem;
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
          .struc_c_d_box {
            width: calc(100% - 3.9rem);
            box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
            border-radius:1px;
            position: relative;
            overflow: hidden;
            >div {
              float: left;
            }
            .struc_c_d_info {
              width: calc(100% - 3.6rem);
              padding-left: .24rem;
              color: #333333;
              h2 {
                font-weight: bold;
                line-height: .74rem;
                padding-right: 1rem;
                font-size: 18px;
                position: relative;
                .vl_jfo_sim {
                  color: #0C70F8;
                  font-weight: bold;
                  font-size: .24rem;
                  float: right;
                  i {
                    vertical-align: text-bottom;
                    margin-right: .1rem;
                  }
                  span {
                    font-weight: normal;
                  }
                }
                .box_grade_info {
                  position: absolute;
                  top: .09rem;
                  left: .8rem;
                }
              }
              .struc_cdu_line {
                  border: 1px solid #F2F2F2;
                  border-radius: 3px;
                  background-color: #FAFAFA;
                  margin: 0 .08rem .08rem 0;
                  display: inline-block;
                  height: .3rem;
                  line-height: .3rem;
                  padding-left: .1rem;
                  padding-right: .1rem;
                  font-size: 12px;
                  span:nth-child(1) {
                    padding-right: .1rem;
                    border-right: 1px solid#F2F2F2;
                  }
                  span:nth-child(2) {
                    padding-left: .1rem;
                    color: #666;
                  }
              }
              .struc_cdi_line {
                span {
                  position: relative;
                  max-width: 100%;
                  display: inline-block;
                  height: .3rem;
                  line-height: .3rem;
                  margin-bottom: .08rem;
                  border: 1px solid #F2F2F2;
                  background: #FAFAFA;
                  color: #333333;
                  border-radius:3px;
                  font-size: 12px;
                  padding: 0 .1rem;
                  margin-right: .08rem;
                  > i {
                    vertical-align: middle;
                    margin-left: .1rem;
                  }
                }
              }
            }
            &:before {
              display: block;
              content: '';
              position: absolute;
              top: -.7rem;
              right: -.7rem;
              transform: rotate(-46deg);
              border: .7rem solid #0c70f8;
              border-color: transparent transparent transparent #0C70F8;
            }
            &:after {
              display: block;
              content: '';
              position: absolute;
              top: -.4rem;
              right: -.4rem;
              transform: rotate(-45deg);
              border: .4rem solid #FFFFFF;
              border-color: transparent transparent transparent #FFFFFF;
            }
            >span {
              display: block;
              position: absolute;
              top: .19rem;
              right: .19rem;
              width: 1rem;
              height: 1rem;
              text-align: center;
              color: #FFFFFF;
              font-size: .12rem;
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
            color: #FFFFFF;
            background: #0C70F8;
            border-color: #0C70F8;
          }
          .cancel_btn {
            @include btn-style;
            margin-right: 20px;
          }
        }
        .struc_c_address {
          height: 100%;
          #capMap {
            width:  100%;
            height: 100%;
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
        .struc_c_video {
          .struc_c_d_box {
            background: #E9E7E8;
            height: 100%;
            text-align: center;
            &:hover {
              .play_btn {
                display: block!important;
              }
            }
            .play_btn {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
              background: rgba(0, 0, 0, .4);
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
                height: 22px!important;
              }
            }
            >video {
              width: auto;
              height: 100%;
            }
            &:after {
              content: none!important;
            }
            &:before {
              content: none!important;
            }
            -webkit-box-shadow: 0 0 0!important;
            -moz-box-shadow: 0 0 0!important;
            box-shadow: 0 0 0!important;
          }
          .download_btn {
            @include btn-style;
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
              .vl_jfo_sim {
                color: #0C70F8;
              }
            }
          }
        }
      }
    }
}

</style>
