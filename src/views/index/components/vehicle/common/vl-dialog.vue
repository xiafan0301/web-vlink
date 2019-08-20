<template>
  <el-dialog
      :visible.sync="strucDetailDialog"
      class="struc_detail_dialog_qypz"
      :close-on-click-modal="false"
      :append-to-body="true"
      :show-close="false">
    <div class="struc_tab">
      <span :class="{'active': strucCurTab === 1}" @click="strucCurTab = 1">抓拍详情</span>
      <span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>
      <span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>
      <i class="el-icon-close" @click="strucDetailDialog = false"></i>
    </div>
    <div class="struc_main">
      <ul v-show="strucCurTab === 1">
        <!-- <li><span>抓拍设备：{{sturcDetail.deviceName}}</span></li> -->
        <li><span>抓拍地址：{{sturcDetail.address}}</span></li>
        <li style="color: #999;">{{sturcDetail.shotTime}}</li>
      </ul>
      <div v-show="strucCurTab === 1" class="struc_c_detail">
        <div class="struc_c_d_qj struc_c_d_img">
          <img :src="sturcDetail[detailLeftInfo.imgKey]"  class="bigImg" alt="">
          <span>{{detailLeftInfo.name}}</span>
        </div>
        <div class="struc_c_d_box">
          <div class="struc_c_d_img ">
            <img :src="sturcDetail[detailRightInfo.imgKey]"  class="bigImg" alt="">
            <span>{{detailRightInfo.name}}</span>
          </div>
          <div class="struc_c_d_info">
            <h2>分析结果</h2>
            <div class="struc_cd_info_main">
              <vue-scroll>
                <div class="scroll_box">
                  <!--<div class="struc_cdi_line">-->
                  <!--<span><font>抓拍时间</font>{{sturcDetail.shotTime}}</span>-->
                  <!--</div>-->
                  <!--<div class="struc_cdi_line">-->
                  <!--<span><font>抓拍设备</font>{{sturcDetail.deviceName}}</span>-->
                  <!--</div>-->
                  <!--<div class="struc_cdi_line">-->
                  <!--<span><font>抓拍地址</font>{{sturcDetail.address}}</span>-->
                  <!--</div>-->
                  <div class="struc_cdi_line">
                    <span><font>车牌号码</font>{{sturcDetail.plateNo}}</span>
                  </div>
                  <div class="struc_cdi_line">
                    <span><font>车牌颜色</font>{{sturcDetail.plateColor}}</span>
                  </div>
                  <div class="struc_cdi_line">
                    <span><font>车辆型号</font>{{sturcDetail.vehiclelModel ? sturcDetail.vehiclelModel : '未知'}}</span>
                  </div>
                  <div class="struc_cdi_line">
                    <span><font>车辆颜色</font>{{sturcDetail.vehicleColor ? sturcDetail.vehicleColor : '未知'}}</span>
                  </div>
                  <div class="struc_cdi_line">
                    <span><font>车辆类型</font>{{sturcDetail.vehicleClass ? sturcDetail.vehicleClass : '未知'}}</span>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.plateNo && sturcDetail.plateClass">
                    <span><font>号牌类型</font>{{dicFormater(45, sturcDetail.plateClass)}}</span>
                  </div>
                </div>
              </vue-scroll>
            </div>
          </div>
        </div>
        <div class="struc_t_btn" v-show="btnList.length">
          <template v-for="item in btnList">
            <a class="is_active" @click="pageJump(sturcDetail, item)" v-if="!item.disabled">{{item.label}}</a>
            <a class="disabled"  v-else>{{item.label}}</a>
          </template>
        </div>

      </div>
      <div v-show="strucCurTab === 2" class="struc_c_address">
        <div id="capMap"></div>
      </div>
      <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
        <div class="struc_c_d_qj struc_c_d_img">
          <img class="bigImg"  :src="sturcDetail.subStoragePath" alt="">
          <span>抓拍图</span>
        </div>
        <div class="struc_c_d_box" style="float: left;" v-if="playerData">
          <div is="flvplayer" :oData="playerData"
               :oConfig="{fit: false, sign: false, pause: true, close: false, tape: false, download: false}">
          </div>
        </div>
        <div class="struc_c_d_box struc_vid_empty" style="float: left;" v-else>
          <div class="struc_vid_empty_c com_trans50_lt">
            <div></div>
            <p>暂无视频</p>
          </div>
        </div>
        <p class="download_tips" v-show="sturcDetail.videoPath">下载提示：右键点击视频选择“另存视频为”即可下载视频。</p>
      </div>
    </div>
    <div class="struc-list">
      <swiper :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide v-for="(item, index) in strucInfoList" :key="item.id">
          <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
            <img style="width: 100%; height: .88rem;" :src="item[detailBottomInfo.imgKey]" alt="">
            <!--<div class="vl_jfo_sim" ><i class="vl_icon vl_icon_retrieval_05" :class="{'vl_icon_retrieval_06':  index === curImgIndex}"></i>{{item.semblance ? item.semblance : 92}}<span style="font-size: 12px;">%</span></div>-->
          </div>
        </swiper-slide>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
    </div>
  </el-dialog>
</template>
<script>
  import flvplayer from '@/components/common/flvplayer.vue';
  import { mapXupuxian } from "@/config/config.js";
  export default {
    /*
    * detailData, 两个值，index（当前展示第几个）跟list(所有展示数据的集合),
    * btnList, 例如区域徘徊
    * this.btnList = [
            {
            disabled: data.isInSur, // 弹窗出现应该就能确定按钮是否禁用，
            label: '加入布控库', // 按钮的文字
            cb: 'gotoControl' // 点击按钮emit出来的方法，参数为当前车辆数据vehicleDetial
          }
        ]
        *<div is="vlDialog" :detailData="detailData" :btnList="btnList" @gotoControl="gotoControl"></div>
        * detailLeftInfo,detailRightInfo,detailBottomInfo,
        *
    * */
    name: 'VlDialog',
    props: {
      detailData: {
        type: Object,
        default: () => {}
      },
      btnList: {
        type: Array,
        default: () => []
      },
      detailLeftInfo: {
        type: Object,
        default: () => {
          return {
            name: '抓拍图',
            imgKey: 'subStoragePath'
          }
        }
      },
      detailRightInfo: {
        type: Object,
        default: () => {
          return {
            name: '全景图',
            imgKey: 'storagePath'
          }
        }
      },
      detailBottomInfo: {
        type: Object,
        default: () => {
          return {
            imgKey: 'subStoragePath'
          }
        }
      }
    },
    components: {flvplayer},
    data() {
      return {
        playerData: null,
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
        amap: null, // 地图实例
        markerPoint: null, // 地图点集合
        InfoWindow: null,
        strucInfoList: [],
        strucCurTab: 1,
        curImgIndex: 0,
        sturcDetail: {},
        strucDetailDialog: false,
      }
    },
    methods: {
      // 设置视频数据
      setPlayerData () {
        if (this.sturcDetail.videoPath) {
          this.playerData = {
            type: 3,
            title: this.sturcDetail.deviceName,
            video: {
              uid: new Date().getTime() + '',
              downUrl: this.sturcDetail.videoPath
            }
          }
        } else {
          this.playerData = null;
        }
      },
      drawPoint (data) {
        console.log(data)
        if (!this.amap) {
          // 地图不存在 初始化地图
          let map = new window.AMap.Map("capMap", {
            center:mapXupuxian.center,
            zoom: 16
          });
          map.setMapStyle("amap://styles/whitesmoke");
          this.amap = map;
        }
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
      imgListTap (data, index) {
        this.curImgIndex = index;
        this.sturcDetail = data;
        this.drawPoint(data);
        this.setPlayerData();
      },
      pageJump (data, curBtn) {
        this.$emit(curBtn.cb, data)
      }
    },
    watch: {
      detailData (val) {
        this.strucCurTab = 1;
        this.curImgIndex = val.index;
        this.strucInfoList = val.list;
        this.sturcDetail = val.list[val.index]
        this.strucDetailDialog = true;
      },
      sturcDetail (val) {
        // 更新地图
        if (this.strucCurTab === 2) {
          this.drawPoint(val);
        }
        // 更新视频
        if (this.strucCurTab === 3) {
          this.setPlayerData();
        }
      },
      // 监听tab
      strucCurTab(e) {
        if (e === 2) {
          this.drawPoint(this.sturcDetail);
        }
        if (e === 3) {
          this.setPlayerData();
        }
      }
    },
    beforeDestroy () {
      if (this.amap) {
        this.amap.destroy();
      }
    }
  }
</script>
<style lang="scss">
  .struc_detail_dialog_qypz {
    .el-dialog {
      max-width: 13.06rem;
      width: 100%!important;
      /* 祖先元素设置了transform属性则会导致固定定位属性position: fixed失效。 */
      transform: none !important;
      top: calc((100% - 7.96rem)/2);
      left: calc((100% - 13.06rem)/2);
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
      height: 5rem;
      margin: 0 auto;
      border-bottom: 1px solid #F2F2F2;
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
          &:before {
            display: block;
            content: '';
            position: absolute;
            top: -.5rem;
            left: -.5rem;
            transform: rotate(-45deg);
            border: .5rem solid #0C70F8;
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
          margin-right: .3rem;
          &:before {
            border: .5rem solid #50CC62;
            border-color: transparent transparent #50CC62;
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
            height: 3.2rem;
            h2 {
              font-weight: bold;
              line-height: .74rem;
              padding-right: 1rem;
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
            }
            .struc_cd_info_main {
              height: calc(100% - 0.74rem);
            }
            .struc_cdi_line {
              >span {
                /*position: relative;*/
                max-width: 100%;
                display: inline-block;
                height: .3rem;
                line-height: .3rem;
                margin-bottom: .08rem;
                border: 1px solid #F2F2F2;
                color: #333333;
                white-space: nowrap;
                text-overflow: ellipsis;
                border-radius:3px;
                font-size: 12px;
                overflow: hidden;
                padding-right: .1rem;
                margin-right: .08rem;
                > i {
                  vertical-align: middle;
                  margin-left: .1rem;
                }
                > font {
                  width: 75px;
                  text-align: center;
                  border-right: 1px solid #F2F2F2;
                  color: #999999;
                  background: #FAFAFA;
                  display: inline-block;
                  margin-right: .1rem;
                }
              }
              p {
                color: #999999;
              }
            }
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
        .struc_t_btn {
          margin-top: .2rem;
          float: right;
          a {
            display: inline-block;
            text-align: center;
            line-height: .38rem;
            border: solid 1px #eeeeee;
            border-radius: 4px;
            margin-top: 10px;
            padding: 0px .15rem;
            text-decoration: none;
            margin-left: 10px;
            background: rgba(246, 248, 249, 1);
            border: 1px solid rgba(211, 211, 211, 1);
            cursor: pointer;
          }
          a:hover {
            background: #0c70f8;
            border: solid 1px #0c70f8;
            color: #ffffff;
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
        .download_tips {
          float: left;
          width: 100%;
          text-align: right;
          padding-right: 40px; padding-top: 10px;
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
</style>
