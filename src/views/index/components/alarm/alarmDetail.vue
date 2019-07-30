<template>
  <div class="alarm_dialog">
    <!--详情弹窗-->
    <vue-scroll>
    <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/alarm/today' }" v-if="type === 'today'">今日告警</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/alarm/history' }" v-if="type === 'history'">历史告警</el-breadcrumb-item>
          <el-breadcrumb-item>告警详情</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="struc_detail_dialog" v-loading="isLoading">
      <div class="struc_tab">
        <span :class="{'active': strucCurTab === 1}" @click="strucCurTab = 1">抓拍详情</span>
        <span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>
        <span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>
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
          <div class="hover_info" v-show="isSeen && !(sturcDetail.objType == 3 || sturcDetail.objType == 4)">
            <p class="hover_i_header">布控信息</p>
              <template v-if="sturcDetail.objType == 1">
                <div v-if="sturcDetail.basePortraitInfo">
                  <p class="name_info" >
                    <span>{{sturcDetail.basePortraitInfo.name}}</span>
                    <span>{{sturcDetail.basePortraitInfo.sexStr}}</span>
                    <span>{{sturcDetail.basePortraitInfo.nationStr}}</span>
                  </p>
                </div>
                <div v-if="sturcDetail.basePortraitInfo.idNo">
                  <p class="correlated_info">
                    <span>{{sturcDetail.basePortraitInfo.idNo}}</span>
                    <span>身份证号</span>
                  </p>
                </div>
                <div v-if="sturcDetail.basePortraitInfo.birthDate">
                  <p class="correlated_info">
                    <span>{{sturcDetail.basePortraitInfo.birthDate | fmTimestamp('yyyy-MM-dd')}}</span>
                    <span>出生日期</span>
                  </p>
                </div>
                <div v-if="sturcDetail.basePortraitInfo.remarks">
                  <p class="correlated_info">
                    <span>{{sturcDetail.basePortraitInfo.remarks}}</span>
                    <span>备注信息</span>
                  </p>
                </div>
              </template>
              <template v-if="sturcDetail.objType == 2">
                <div v-if="sturcDetail.vehicleInfo">
                  <p class="name_info" >
                    <span>{{sturcDetail.vehicleInfo.vehicleNumber}}</span>
                    <span>{{sturcDetail.vehicleInfo.vehicleTypeStr}}</span>
                    <span v-if="sturcDetail.vehicleInfo.ownerName">{{sturcDetail.vehicleInfo.ownerName}}</span>
                  </p>
                </div>
                <div v-if="sturcDetail.vehicleInfo.ownerIdCard">
                  <p class="correlated_info" >
                    <span>{{sturcDetail.vehicleInfo.ownerIdCard}}</span>
                    <span>身份证号</span>
                  </p>
                </div>
                <div v-if="sturcDetail.vehicleInfo.ownerBirth">
                  <p class="correlated_info">
                    <span>{{sturcDetail.vehicleInfo.ownerBirth | fmTimestamp('yyyy-MM-dd')}}</span>
                    <span>出生日期</span>
                  </p>
                </div>
                <div v-if="sturcDetail.vehicleInfo.desci">
                   <p class="correlated_info">
                    <span>{{sturcDetail.vehicleInfo.desci}}</span>
                    <span>备注信息</span>
                  </p>
                </div>
              </template>
              <template v-if="sturcDetail.objType == 3 || sturcDetail.objType == 4">
                <p class="name_info"></p>
              </template>
            </div>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img struc_c_d_qj struc_mr" v-show="showImg">
              <img :src="sturcDetail.snapPhoto" alt="抓拍图">
              <span>抓拍图</span>
              <i @click="displayImg()">切换全景图</i>
            </div>
            <div class="struc_c_d_img struc_c_d_qj struc_mr" v-show="!showImg">
              <img :src="sturcDetail.snapFullPhoto" alt="全景图">
              <span>全景图</span>
              <i @click="displayImg()">切换抓拍图</i>
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
                <!-- <div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_03"></i>{{sturcDetail.semblance ? (sturcDetail.semblance).toFixed(2) : 0.00}}<span style="font-size: 12px;">%</span></div> -->
              </h2>
              <div class="struc_cdi_line" v-if="sturcDetail.alarmFeature">
                <span class="feature_name">{{sturcDetail.alarmFeature.featureName}}</span>
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
            <span>{{sturcDetail.semblance ? (sturcDetail.semblance).toFixed(2) : 0.00}}<span style="font-size: 12px;">%</span></span>
          </div>
          <div class="alarm_btn">
            <a class="cancel_btn" @click="back">返回</a>
            <a class="cancel_btn" @click="cancel(sturcDetail.uid)">撤销告警</a>
            <a class="operate_btn" @click="spinToCtc(sturcDetail)">
              <template v-if="sturcDetail.eventInfo">
                  <template v-if="sturcDetail.eventInfo.taskList">
                     再次调度
                  </template>
                  <template v-else>
                     调度指挥
                  </template>
              </template>
              <template v-else>
                  调度指挥
              </template>
            </a>
          </div>
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
            <div class="swiper_img_item" :class="{'active': item.uid == curImgUid}" @click="imgListTap(item,index)">
              <img style="width: 100%; height: .88rem;" :src="item.snapPhoto" alt="抓拍图">
              <div class="vl_jfo_sim"  v-show="showSim"><i class="vl_icon vl_icon_retrieval_05" :class="{'vl_icon_retrieval_06':  item.uid == curImgUid}"></i>{{item.semblance ? item.semblance : 92}}<span style="font-size: 12px;">%</span></div>
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev" @click="getPreList"></div>
          <div class="swiper-button-next" slot="button-next" @click="getNextList"></div>
        </swiper>
      </div>
    </div>
    <div id="capMap"></div>
    </vue-scroll>
  </div>
</template>
<script>
let AMap = window.AMap;
import { getAlarmList, getAlarmDetail, delAlarm } from "@/views/index/api/api.control.js";
import {formatDate} from '@/utils/util';
export default {
  data () {
    return {
      strucInfoList: [],
      type: '',     //今日告警或历史告警
      playing: false, // 视频播放是否
      stucOrder: 2, // 1升序，2降序，3监控，4相似度
      showSim: false, // 展示相似度排序
      strucCurTab: 1,
      curImgUid: null,
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
          disabledClass: 'my-button-disabled'
        },
      },
      amap: null, // 地图实例
      markerPoint: null, // 地图点集合
      InfoWindow: null,
      startTime: null,
      endTime: null,
      isLoading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
    }
  },
  mounted() {
    let map = new AMap.Map('capMap', {
      center: [112.974691, 28.093846],
      zoom: 16
    });
    map.setMapStyle('amap://styles/whitesmoke');
    this.amap = map;
    this.type = this.$route.query.type
    this.curImgUid = this.$route.query.uid
    this.getAlarm()
    if(this.$route.query.uid) {
      this.toAlarmDetail(this.$route.query.uid, this.$route.query.objType)
    }
  },
  watch: {
    strucCurTab (e) {
      if (e === 2) {
        this.drawPoint(this.sturcDetail)
      }
    }
  },
  methods: {
    getPreList() {
      if(this.pageNum > 1) {
        this.pageNum = this.pageNum -1;
        this.getAlarm()
      }
    },
    getNextList() { 
      if(this.pageNum < (this.total/this.pageSize)) {
        this.pageNum = this.pageNum +1;
        this.getAlarm()
      }
    },
    //告警
    getAlarm() {
      this.alarmList = [];
      if(this.$route.query.type === 'today') {
        this.startTime = formatDate(new Date(), 'yyyy-MM-dd')
        this.endTime = formatDate(new Date(), 'yyyy-MM-dd')
      }else {
        this.startTime = formatDate(new Date().getTime() - 3600 * 1000 * 24 * 90, 'yyyy-MM-dd'),
        this.endTime = formatDate(new Date(), 'yyyy-MM-dd')
      }
      let params = {
        "where.startTime": this.startTime,
        "where.endTime": this.endTime,
        "where.sortType": 2,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        /* pageNum:-1,
        pageSize: 0, */
      };
      getAlarmList(params).then( res => {
        if(res.data.list && res.data.list.length > 0) {
          this.strucInfoList = [...res.data.list]
          this.total = res.data.total;
          for(let item of this.strucInfoList) {
            item['semblance'] = (item.semblance).toFixed(2)
            item['isSeen'] = false
          }
        }
      })
    },
    //告警详情
    toAlarmDetail(uid, objType) {
      this.isLoading = true
      getAlarmDetail(uid).then( res => {
        this.sturcDetail = res.data
        this.sturcDetail['objType'] = objType
        this.drawPoint(this.sturcDetail);
        this.$nextTick(()=> {
          this.isLoading = false
        })
      }).catch(() => {
        this.isLoading = false
      })
    },
    imgListTap (item, index) {
      this.curImgUid = item.uid;
      console.log("--------------",this.curImgUid, index)
      this.toAlarmDetail(item.uid, item.objType)
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
      if(this.type === 'history') {
        this.$router.push({name: 'alarm_ctc', query: {eventId: item.uid, eventType: eventType, type: this.type,
                                                    objType: this.$route.query.objType, startTime: this.startTime, endTime: this.endTime, id: item.eventInfo ? item.eventInfo.uid : ''}});
      }else {
        this.$router.push({name: 'alarm_ctc', query: {eventId: item.uid, eventType: eventType, type: this.type,
                                                    objType: this.$route.query.objType, id: item.eventInfo ? item.eventInfo.uid : ''}});
      }
    },
    //撤销告警
    cancel(uid) {
      delAlarm(uid).then(res => {
        console.log("---------",res)
        this.$emit("isLoading", true)
        this.$message.success('撤销告警成功！');
        this.strucDetailDialog = false
        if(this.type === 'history') {
          this.$router.push({path: '/alarm/history'});
        }else {
          this.$router.push({path: '/alarm/today'});
        }
      }).catch((e)=> {console.log(e)})
    },
    // 返回
    back () {
      this.$router.back(-1);
    },
  }
}
</script>
<style lang="scss">
.alarm_dialog {
  height: 100%;
  .struc_detail_dialog {
      max-width: 100%;
      height: 7.26rem;
      background: #fff;
      border: 1px solid #EAEAEA;
      margin: 0 20px;
      .struc_tab {
        height: 1.12rem;
        padding: .4rem .4rem;
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
        height: 6.13rem;
        margin: 0 .4rem;
        @mixin btn-style {
          text-decoration: none;
            text-align: center;
            width: 1.6rem;
            height: .4rem;
            display: inline-block;
            background: rgba(246,248,249,1);
            border: 1px solid rgba(211,211,211,1);
            border-radius: 4px;
            line-height: .4rem;
            cursor: pointer;
            color: #666666;
        }
        .struc_c_detail {
          width:  100%;
          height: 4.96rem;
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
              width: 4.76rem;
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
            width: 4.96rem;
            height: 4.96rem;
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
              bottom: .2rem;
              right: .2rem;
              line-height: .26rem;
              height: .26rem;
              background: #0C70F8;
              border-radius: .13rem;
              font-style: normal;
              color: #fff;
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
          .struc_mr {
            margin-right: 0;
            &:before {
              border: .5rem solid #50CC62;
              border-color: transparent transparent #50CC62;
            }
          }
          .struc_c_d_box {
            width: calc(100% - 5.26rem);
            box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
            border-radius:1px;
            position: relative;
            overflow: hidden;
            >div {
              float: left;
            }
            .struc_c_d_info {
              width: calc(100% - 4.96rem);
              padding-left: .4rem;
              color: #333333;
              h2 {
                font-weight: bold;
                line-height: .74rem;
                padding-right: 1rem;
                font-size: .18rem;
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
                  margin: 0 .1rem .1rem 0;
                  height: .34rem;
                  line-height: .34rem;
                  padding-left: .12rem;
                  padding-right: .12rem;
                  font-size: 12px;
                  display: inline-block;
                  span:nth-child(1) {
                    padding-right: .12rem;
                    border-right: 1px solid#F2F2F2;
                  }
                  span:nth-child(2) {
                    padding-left: .12rem;
                    color: #666;
                  }
              }
              .struc_cdi_line {
                span {
                  position: relative;
                  max-width: 100%;
                  display: inline-block;
                  max-height: .34rem;
                  line-height: .34rem;
                  margin-bottom: .1rem;
                  border: 1px solid #F2F2F2;
                  background: #FAFAFA;
                  color: #333333;
                  border-radius:3px;
                  font-size: 12px;
                  padding: 0 .12rem;
                  margin-right: .1rem;
                  > i {
                    vertical-align: middle;
                    margin-left: .1rem;
                  }
                }
              }
              .feature_name {
                max-width: 82%!important;
                max-height: 1.02rem!important;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box!important;
                -webkit-line-clamp: 3; //行数
                -webkit-box-orient: vertical;
              }
            }
            &:before {
              display: block;
              content: '';
              position: absolute;
              top: -1rem;
              right: -1rem;
              transform: rotate(-46deg);
              border: 1rem solid #0c70f8;
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
              &:last-child {
                font-size: .24rem;
                top: .3rem;
                right: .3rem;
                font-weight: bold;
              }
            }
          }
          .alarm_btn {
            margin: .4rem 0;
            float: right;
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
            float: right;
            margin: .4rem 0;
            &:hover {
              color: #FFFFFF;
              background: #0C70F8;
              border-color: #0C70F8;
            }
          }
        }
      }
      .struc-list {
        width: 15.6rem;
        margin: 0 auto;
        padding: .44rem 0 .34rem 0;
        .swiper-container {
          padding: .02rem .5rem;
          &:before {
            display: block;
            content: '';
            width: .5rem;
            height: 110%;
            position: absolute;
            left: 0;
            z-index: 9;
          }
          &:after {
            display: block;
            content: '';
            width: .5rem;
            height: 110%;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 9;
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
