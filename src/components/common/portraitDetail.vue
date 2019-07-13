<template>
<div>
  <el-dialog
  class="struc_detail_dialog"
    :visible.sync="strucDetailDialog"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    width="1180px"
    >
     <div class="struc_tab" >
                <span :class="{'active': strucCurTab === 1}" @click="strucCurTab = 1">抓拍详情</span>
                <span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>
                <span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>
                <i class="el-icon-close"  @click="onCloseDetail"></i>
              </div>
              <div class="struc_main" v-if="sturcDetail">
                <div v-show="strucCurTab === 1" class="struc_c_detail">
                  <div class="struc_c_d_qj struc_c_d_img">
                    <img :src="sturcDetail.storagePath"  @click="extendImg(sturcDetail.storagePath)" >
                    <span>抓拍图</span>
                  </div>
                  <div class="struc_c_d_box">
                    <div class="struc_c_d_qii struc_c_d_img">
                      <img :src="sturcDetail.personStoragePath"  @click="extendImg(sturcDetail.personStoragePath)" >
                      <span>全景图</span>
                    </div>
                    <div class="struc_c_d_info">
                      <h2>抓拍信息</h2>
                      <div class="struc_cdi_line">
                        <span><b>抓拍时间</b>{{sturcDetail.shotTime}}</span>
                      </div>
                      <div class="struc_cdi_line">
                        <span><b>抓拍设备</b>{{sturcDetail.deviceName}}</span>
                      </div>
                      <div class="struc_cdi_line">
                        <span><b>抓拍地址</b>{{sturcDetail.address}}</span>
                      </div>
                      <!-- <div class="struc_cdi_line">
                        <span><b>性别</b>{{sturcDetail.sex}}</span>
                      </div> -->
                      <div class="struc_cdi_line" v-if="sturcDetail.semblance">
                        <span ><b>相似度</b>{{(sturcDetail.semblance*1).toFixed(2)}}%</span>
                      </div>
                      <div class="struc_cdi_line">
                        <span v-if="sturcDetail.features"><b>特征</b>{{sturcDetail.features}}</span>
                        <span v-else><b>特征</b>{{sturcDetail.sex+" "+(sturcDetail.age || "")+ " "+ (sturcDetail.baby || "")+ " " + (sturcDetail.bag || "")+ " " + (sturcDetail.bottomColor || "") +(sturcDetail.bottomType || "")+ " " + (sturcDetail.hair || "")+ " " +(sturcDetail.hat || "")+ " "+(sturcDetail.upperColor || "")+(sturcDetail.upperTexture || "")+(sturcDetail.upperType || "")}}</span>
                      </div>
                      <div class="struc_cdi_line"></div>
                    </div>
                  </div>
                  <div class="tablink" v-if="show">
                    <a @click="goToPage('portrait_gjfx')">轨迹分析</a>
                    <a @click="goToPage('control_create')">新建布控</a>
                  </div>
                </div>
                <div v-show="strucCurTab === 2" class="struc_c_address">
                  <div id="container"></div>
                </div>
                <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
                  <div class="struc_c_d_qj struc_c_d_img">
                    <img :src="sturcDetail.storagePath" alt="">
                    <span>抓拍图</span>
                  </div>
                  <div class="struc_c_d_box">
                    <span class="th-video-text">视频回放</span>
                    <div is="flvplayer" :index="1" :oData="playUrl" :bResize="bResize" :oConfig="{sign: false, close: false, pause: true}" ></div>
                  </div>
                  <a class="download_btn" target="_blank" download="视频" :href="videoUrl">下载视频</a>
                </div>
              </div>
              <div class="struc-list" v-if="strucInfoList && strucInfoList.length>1">
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
  <extendBig :url="bigurl" :open="openBig" @closeimg="openBig=false"></extendBig>
  </div>
</template>
<script>
import extendBig from '@/components/common/extendBig.vue';
import flvplayer from '@/components/common/flvplayer.vue';
export default {
  /* 提交成功后通过在父组件 emit mapSelectorEmit 事件获取所框选的东西 */
  /* 
    open  open值true则打开窗口
    
    detailData : {
      address: "长沙市创谷产业园111"
      deviceName: "创谷产业园1"
      shotTime: "2019-07-10 11:09:00"
      personStoragePath: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3978560765,783149633&fm=26&gp=0.jpg"
      semblance: "90"
      sex: "女"
      features: "特征"
      shotPlaceLatitude: 32.00000
      shotPlaceLongitude: 112.00000
      storagePath: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3978560765,783149633&fm=26&gp=0.jpg"
      subStoragePath: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3978560765,783149633&fm=26&gp=0.jpg"
      videoPath:'',
      uid:1
    }
    scrollData :[ {
      uid:1
      address: "长沙市创谷产业园111"
      deviceName: "创谷产业园1"
      shotTime: "2019-07-10 11:09:00"
      personStoragePath: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3978560765,783149633&fm=26&gp=0.jpg"
      semblance: "90"
      sex: "女"
      features: "特征"
      shotPlaceLatitude: 32.00000
      shotPlaceLongitude: 112.00000
      storagePath: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3978560765,783149633&fm=26&gp=0.jpg"
      subStoragePath: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3978560765,783149633&fm=26&gp=0.jpg"
      videoPath:''
    }]
   
  */
 components: {
    flvplayer,extendBig
  },
  props: ['open', 'detailData','scrollData','showItem'],
  data () {
    return {
      bigurl:'',
      openBig: false,
      show: false,
      strucDetailDialog:this.open, // 抓拍记录弹窗
      strucCurTab: 1, // 抓拍记录弹窗tab
      curImgIndex: 0, // 当前选择的图片index
      strucInfoList:null ,
      sturcDetail:null,
      bResize: {},
      markerPoint: null, // 地图icon
      playUrl: {},
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
      videoUrl: null, // 下载地址
      map: null,
    }
  },
  watch: {
    open (v) {
      this.strucDetailDialog = v;
      if (!this.amap) {
        setTimeout(() => {
          this.initMap();
        }, 200)
      }
    },
   goToPage(v){
      this.$router.push({
        name: v,
        query: { imgurl: this.sturcDetail.subStoragePath, modelName: '人员追踪' }
      });
   },
    scrollData (v) {
     
     this.strucInfoList=v
     this.curImgIndex = v.findIndex(el=>el.uid==this.detailData.uid)
     
    },
    detailData (){
      // console.log(12345);
      
      this.sturcDetail=this.detailData
      // console.log(this.sturcDetail)
       
      this.videoUrl = this.sturcDetail.videoPath
      this.playUrl = {
        type: 3,
        title: '',
        video: {
          uid: 1,
          downUrl: this.sturcDetail.videoPath
        }
      }
      this.strucDetailDialog = this.open
    }
    
  },
  mounted () {
    
    this.show=this.showItem
    
    // this.getTreeList();
    // this.mapEvents();
   // this.$_showLoading({text: '加载中...'})
      // console.log(obj)
      
      // this.$nextTick(() => {
       
      // })
      //this.$_hideLoading()
  },
  methods: {
    extendImg(v){
      this.openBig=true
      this.bigurl=v
    },
   
    /**
     * 弹框地图初始化
     */
    initMap () {
      
      let longitude = this.sturcDetail.shotPlaceLongitude
      let latitude = this.sturcDetail.shotPlaceLatitude
      // this.map.setZoomAndCenter(iZoom, aCenter);
      let map = new window.AMap.Map('container', {
        zoom: 14, // 级别
        center: [longitude, latitude], // 中心点坐标
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.map = map;
      this.drawPoint(this.sturcDetail)
    },
    /**
     * 地图描点
     */
    drawPoint (data) {
     // console.log(data)

      if (this.markerPoint) {
        this.map.remove(this.markerPoint)
      }
      let longitude = data.shotPlaceLongitude
      let latitude = data.shotPlaceLatitude
      let _this=this
      let _content = '<div class="vl_icon vl_icon_judge_02"></div>'
      this.markerPoint = new window.AMap.Marker({ // 添加自定义点标记
        map: _this.map,
        position: [longitude, latitude], // 基点位置 [116.397428, 39.90923]
        offset: new window.AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // 自定义点标记覆盖物内容
        content: _content
      });
      this.map.setZoomAndCenter(16, [longitude, latitude]); // 自适应点位置
      let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`
      this.infoWindow = new window.AMap.InfoWindow({
        map: _this.map,
        isCustom: true,
        closeWhenClickMap: false,
        position: [longitude, latitude],
        offset: new window.AMap.Pixel(0, -60),
        content: sConent
      })
    },
    
    /**
     * 关闭抓拍弹框
     */
    onCloseDetail () {
      this.strucCurTab = 1
      this.strucDetailDialog = false
      this.$emit("closeDialog")
    },
    /**
     * 图片切换
     */
    imgListTap (obj, i) {
      this.curImgIndex = i
      this.sturcDetail = obj
    },
  },
  beforeDestroy () {
    if (this.map) {
      this.map.destroy();
    }
  }
}
</script>
<style lang="scss" paged>

</style>
<style lang="scss" >
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
      padding: .3rem 0.3rem;
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
        right: 0.3rem;
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
      .download_btn:hover{
         background:#0c70f8;
        border:1px solid #0c70f8;
        color: #ffffff;
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
            transform: scale(1);         
            transition: all ease 0.2s;
          }
          img.active{
             transform: scale(3);          /*图片需要放大3倍*/
              position: absolute;           /*是相对于前面的容器定位的，此处要放大的图片，不能使用position：relative；以及float，否则会导致z-index无效*/
              z-index: 100;
              left: 50%;
              
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
          // overflow: hidden;
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
            h2 {
              font-weight: bold;
              line-height: .74rem;
              padding-right: 1rem;
            }
            .struc_cdi_line {
              span {
                /*position: relative;*/
                max-width: 100%;
                display: inline-block;
                height: .4rem;
                line-height: .4rem;
                margin-bottom: .08rem;
                border: 1px solid #F2F2F2;
                background: #ffffff;
                color: #333333;
                white-space: nowrap;
                text-overflow: ellipsis;
                border-radius:3px;
                font-size: 12px;
                overflow: hidden;
                padding-right: 10px;
                margin-right: .08rem;
                > b {
                  display :inline-block;
                   border-right: 1px solid #F2F2F2;
                   height: .4rem;
                  line-height: .4rem;
                  background: #FAFAFA;
                  color: #999;
                  font-weight: normal;
                  padding-right: 10px;
                  padding-left: 10px;
                  margin-right: 5px;
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
  .vl_flvplayer {
  &.flvplayer_fullscreen {
    width: 100vw; height: 100vh;
    top: 50% !important; 
    left: 50% !important; 
    margin-left: -50vw; margin-top: -50vh;
  }
  }
  .tablink {
      height: 50px;
      width:100%;
      background: #ffffff;
      margin: 0px auto;
      padding: 0px 0px;
      text-align: right;
      a {
        display: inline-block;
        text-align: center;
        line-height: 38px;
        border: solid 1px #eeeeee;
        border-radius: 4px;
        margin-top: 10px;
        padding: 0px 15px;
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
</style>


