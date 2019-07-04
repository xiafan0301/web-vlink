<template>
  <div class="vehicle_content">
    <div class="vc_gcck_bd" is="vehicleBreadcrumb" :oData="[{name: '区域徘徊', routerName: 'vehicle_search_qyph'}, {name: '分析结果'}]"></div>
    <div class="the-right-result">
      <div class="the-result-box">
        <vue-scroll>
          <div class="list-box">
            <div class="list-item" v-for="(item, index) in strucInfoList" :key="item.id" @click="showStrucInfo(item, index)">
              <img src="../../../../../assets/img/666.jpg" alt="">
              <p class="time"><i></i>{{item.shotTime}}</p>
              <p class="address"><i></i>抓拍设备:{{item.deviceName}}</p>
            </div>
            <el-pagination
              class="cum_pagination th-center-pagination"
              @current-change="onPageChange"
              :current-page.sync="pagination.pageNum"
              :page-size="pagination.pageSize"
              layout="prev, pager, next"
              :total="pagination.total">
            </el-pagination>
          </div>
        </vue-scroll>
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
        <i class="el-icon-close" @click="strucDetailDialog = false"></i>
      </div>
      <div class="struc_main">
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <!--<img :src="showSim ? sturcDetail.uploadPath : sturcDetail.panoramaPath" alt="">-->
            <img src="../../../../../assets/img/666.jpg" alt="">
            <span>上传图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img">
              <!--<img :src="sturcDetail.photoPath" alt="">-->
              <img src="../../../../../assets/img/666.jpg" alt="">
              <span>全景图</span>
            </div>
            <div class="struc_c_d_info">
              <h2>对比信息<div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_03"></i>{{sturcDetail.semblance ? sturcDetail.semblance : 98.32}}<span style="font-size: 12px;">%</span></div></h2>
              <div class="struc_cdi_line">
                <span :title="sturcDetail.feature">{{sturcDetail.feature}}</span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.shotTime}}<i class="vl_icon vl_icon_retrieval_01"></i></span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.deviceName}}<i class="vl_icon vl_icon_retrieval_02"></i></span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.address}}<i class="vl_icon vl_icon_retrieval_04"></i></span>
              </div>
              <div class="struc_cdi_line"></div>
            </div>
            <span>抓拍信息</span>
          </div>
        </div>
        <div v-show="strucCurTab === 2" class="struc_c_address"></div>
        <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.photoPath" alt="">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <video id="capVideo" :src="sturcDetail.videoPath"></video>
            <div class="play_btn" @click="videoTap" v-show="!playing">
              <i class="vl_icon vl_icon_judge_01" v-if="playing"></i>
              <i class="vl_icon vl_icon_control_09" v-else></i>
            </div>
          </div>
          <div class="download_btn"><a download="视频" :href="videoUrl"></a>下载视频</div>
        </div>
      </div>
      <div class="struc-list">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in strucInfoList" :key="item.id">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
              <!--<img style="width: 100%; height: .88rem;" :src="item.photoPath" alt="">-->
              <img src="../../../../../assets/img/666.jpg" alt="">
              <div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_05" :class="{'vl_icon_retrieval_06':  index === curImgIndex}"></i>{{item.semblance ? item.semblance : 92}}<span style="font-size: 12px;">%</span></div>
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
  import vehicleBreadcrumb from '../breadcrumb.vue';
  import flvplayer from '@/components/common/flvplayer.vue';
  import {QyphGetAreaWander} from '@/views/index/api/api.judge.js'
  export default {
    components: {vehicleBreadcrumb, flvplayer},
    data () {
      return {
        swiperOption: {
          slidesPerView: 10,
          spaceBetween: 10,
          slidesPerGroup: 9,
          loop: false,
          slideToClickedSlide: true,
          loopFillGroupWithBlank: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        },
        pagination: { total: 0, pageSize: 18, pageNum: 1 },
        amap: null, // 地图实例
        markerPoint: null, // 地图点集合
        InfoWindow: null,
        curVideoUrl: '',
        playing: false, // 视频播放是否
        strucInfoList: [], // 检索抓拍信息
        strucCurTab: 1,
        curImgIndex: 0,
        sturcDetail: {},
        vehicleList: [],
        strucDetailDialog: false,
        videoUrl: '' // 弹窗视频回放里的视频
      }
    },
    mounted () {
      let map = new AMap.Map('capMap', {
        center: [112.974691, 28.093846],
        zoom: 16
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.amap = map;
      console.log(this.$route.query);
      this.getTheList();
    },
    methods: {
      getTheList () {
        let params = this.$route.query;
        QyphGetAreaWander(params).then(res => {
          if (res) {
            console.log(res)
            res.data.list.forEach(x => {
              this.strucInfoList.push(...x.vehicleDetailList);
            })
            this.pagination.pageNum = res.data.pageNum;
            this.pagination.total = this.strucInfoList.length;
          }
        })
      },
      searchSubmit () {
      },
      searchReset () {
      },
      onPageChange (page) {
        this.pagination.pageNum = page;
      },
      showStrucInfo (data, index) {
        this.curImgIndex = index;
        this.strucDetailDialog = true;
        this.sturcDetail = data;
        this.drawPoint(data);
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
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
          offset: new AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: _content
        });
        this.amap.setZoomAndCenter(16, [data.shotPlaceLongitude, data.shotPlaceLatitude]); // 自适应点位置
        let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`
        this.infoWindow = new AMap.InfoWindow({
          map: this.amap,
          isCustom: true,
          closeWhenClickMap: false,
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude],
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
      imgListTap (data, index) {
        this.curImgIndex = index;
        this.sturcDetail = data;
        this.drawPoint(data);
      }
    },
    watch: {
      strucCurTab (e) {
        if (e === 2) {
          this.drawPoint(this.sturcDetail)
        } else if (e === 3) {
          this.videoUrl = document.getElementById('capVideo').src;
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .the-right-result {
    width: 100%; height: 100%;
    margin-left: 13px;
    background: #F7F9F9;
    padding: 15px 12px 25px 0;
    overflow-y: hidden;
    .the-result-box {
      width: 100%; height: 100%;
      background: #F6F8F9;
      .list-box {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        flex-flow: row wrap;
        // height: calc(100% - 45px);
        .list-item {
          width: 293px;
          height: 346px;
          padding: 14px;
          margin-bottom: 15px;
          background: #fff;
          margin-left: 1.3%;
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
</style>
<style lang="scss">
  html {font-size: 100px;}
  @media screen and (min-width: 960px) and (max-width: 1119px) {html {font-size: 60px !important;}}
  @media screen and (min-width: 1200px) and (max-width: 1439px) {html {font-size: 70px !important;}}
  @media screen and (min-width: 1440px) and (max-width: 1679px) {html {font-size: 80px !important;}}
  @media screen and (min-width: 1680px) and (max-width: 1919px) {html {font-size: 90px !important;}}
  @media screen and (min-width: 1920px) {html {font-size: 100px !important;} }
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
        .struc_c_d_box {
          width: calc(100% - 3.9rem);
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
            width: calc(100% - 3.6rem);
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
                    b {
                      padding-left: 10px;
                      color: #999;
                      font-weight: normal;
                    }
                  }
                }
              }
              // span {
              //   max-width: 100%;
              //   display: inline-block;
              //   height: .3rem;
              //   line-height: .3rem;
              //   margin-bottom: .08rem;
              //   border: 1px solid #F2F2F2;
              //   background: #FAFAFA;
              //   color: #333333;
              //   white-space: nowrap;
              //   text-overflow: ellipsis;
              //   border-radius:3px;
              //   font-size: 12px;
              //   overflow: hidden;
              //   padding: 0 .3rem 0 .1rem;
              //   margin-right: .08rem;
              //   > b {
              //     color: #999;
              //     font-weight: normal;
              //     padding-left: 18px;
              //   }
              // }
            }
          }
        }
      }
      .struc_c_address {
        width:  100%;
        height: 100%;
        #capMap {
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
            img {
              width: 100%;
              height: 100%;
            }
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