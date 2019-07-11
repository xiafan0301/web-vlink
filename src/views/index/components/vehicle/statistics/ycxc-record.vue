<template>
  <div class="th-ycxc-record">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle'},
        {name: '夜间行车分析', routerName: 'vehicle_search_ycxc', params: {
          ... this.queryObj
        }}, {name: '抓拍记录'}]"></div>
    </div>
    <!-- <Breadcrumb :oData="[{name: '夜间行车分析', routerName: 'vehicle_search_ycxc'}, {name: '抓拍记录'}]"></Breadcrumb> -->
    <div class="th-ycxc-record-list">
      <div class="result_sort">
        <!-- <h3 class="result">检索结果（{{ total }}）</h3> -->
        <div class="sort">
          <div class="sort_item" :class="{ 'active_sort': sortType === 1 }" @click="clickTime">
            时间排序
            <i
              :class="{'el-icon-arrow-down': timeSortType, 'el-icon-arrow-up': !timeSortType }"
              v-show="sortType === 1"
            ></i>
          </div>
          <div class="sort_item" :class="{ 'active_sort': sortType === 2 }" @click="clickCamera">
            监控排序
            <i
              :class="{'el-icon-arrow-down': cameraSortType, 'el-icon-arrow-up': !cameraSortType }"
              v-show="sortType === 2"
            ></i>
          </div>
        </div>
      </div>
      <div class="list-box">
        <div class="list-item" v-for="item in dataList" :key="item.id" @click="onOpenDetail(item)">
          <img :src="item.storagePath" alt="">
          <p class="time"><i></i>{{item.shotTime}}</p>
          <p class="address"><i></i>抓拍设备:{{item.deviceName}}</p>
        </div>
        <el-pagination
          class="cum_pagination th-center-pagination"
          @current-change="onPageChange"
          :current-page.sync="currentPage"
          :page-size="pagination.pageSize"
          layout="prev, pager, next"
          :total="pagination.total">
        </el-pagination>
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
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.subStoragePath" alt="">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_qii struc_c_d_img">
              <img :src="sturcDetail.storagePath" alt="">
              <span>全景图</span>
            </div>
            <div class="struc_c_d_info">
              <h2>抓拍信息</h2>
                <div class="struc_cdi_line" v-show="sturcDetail.snapTime">
                <span>{{sturcDetail.snapTime}}<b>抓拍时间</b></span>
              </div>
              <div class="struc_cdi_line" v-show="sturcDetail.snapDevice">
                <span>{{sturcDetail.snapDevice}}<b>抓拍设备</b></span>
              </div>
              <div class="struc_cdi_line" v-show="sturcDetail.snapAddress">
                <span>{{sturcDetail.snapAddress}}<b>抓拍地址</b></span>
              </div>
              <div class="struc_cdi_line" v-show="sturcDetail.plateNo">
                <span>{{sturcDetail.plateNo}}<b>车牌号</b></span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.vehicleBrand}}</span>
                <span>{{sturcDetail.vehicleModel}}</span>
                <span>{{sturcDetail.vehicleClass}}</span>
                <span>{{sturcDetail.vehicleColor}}</span>
                <span>{{sturcDetail.vehicleRoof}}</span>
                <span>{{sturcDetail.vehicleStyles}}</span>
                <span>{{sturcDetail.feature}}<b>特征</b></span>
              </div>
              <div class="struc_cdi_line"></div>
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
            <video id="capVideo" :src="sturcDetail.videoPath"></video>
            <div class="play_btn" @click="videoTap" v-show="!playing">
              <i class="vl_icon vl_icon_judge_01" v-if="playing"></i>
              <i class="vl_icon vl_icon_control_09" v-else></i>
            </div>
          </div>
          <a class="download_btn" target="_blank" download="视频" :href="sturcDetail.videoPath">下载视频</a>
        </div>
      </div>
      <div class="struc-list">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in dataList" :key="index + 'isgm'">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
              <img style="display: block; width: 100%; height: .88rem;" :src="item.storagePath" alt="">
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
// import flvplayer from '@/components/common/flvplayer.vue';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import { getNightVehicleRecordList, getSnapDetail  }from "@/views/index/api/api.judge.js";
export default {
  components: {
    // flvplayer,
    vlBreadcrumb
  },
  data () {
    return {
      sortType: 1, // 1为时间排序， 2为监控排序
      timeSortType: false, // true为时间降序， false为时间升序
      cameraSortType: true, // true为监控降序， false为监控升序
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        order: 'asc',
        orderBy: 'shotTime' // 默认抓拍时间升序
      },
      currentPage: 1,
      sortTimeType: 'asc', // 时间排序active  默认升序
      sortMonitoryType: null, // 监控排序active
      /* 抓拍记录页面参数 */
      strucDetailDialog: false, // 抓拍记录弹窗
      strucCurTab: 1, // 抓拍记录弹窗tab
      curImgIndex: 0, // 当前选择的图片index
      strucInfoList: [],
      sturcDetail: {},
      bResize: {},
      markerPoint: null, // 地图icon
      newMarker: null,
      playUrl: {},
      videoUrl: null, // 下载地址
      map: null,
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
      dataList: [],
      playing: false, // 视频播放是否
      queryObj: {}
    }
  },
  created () {
    console.log('aaa', this.$route.params)
    this.queryObj = {
      bayonetIds: this.$route.params.bayonetIds,
      cameraIds: this.$route.params.cameraIds,
      endDate: this.$route.params.endDate,
      endhour: this.$route.params.endhour,
      startDate: this.$route.params.startDate,
      startHour: this.$route.params.startHour,
      minShotTimes: this.$route.params.minShotTimes,
      vehicleTypes: this.$route.params.vehicleTypes,
      surveillanceIds: this.$route.params.surveillanceIds,
      isNextDay: this.$route.params.isNextDay
    }
  },
  mounted () {
    this.getList();
  },
  methods: {
    // 播放视频
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
    // 获取抓拍记录
    getList () {
      this.queryObj['vehicleNumber'] = this.$route.params.vehicleNumber;
      this.queryObj['pageSize'] = this.pagination.pageSize;
      this.queryObj['pageNum'] = this.pagination.pageNum;
      this.queryObj['order'] = this.pagination.order;
      this.queryObj['orderBy'] = this.pagination.orderBy;
      getNightVehicleRecordList( this.queryObj)
        .then(res => {
          if (res && res.data) {
            this.dataList = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    /**
     * 弹框地图初始化
     */
    initMap (obj) {
      // this.map.setZoomAndCenter(iZoom, aCenter);
      let map = new window.AMap.Map('container', {
        zoom: 14, // 级别
        center: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 中心点坐标
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.map = map;
      this.drawPoint(obj)
    },
    /**
     * 地图描点
     */
    drawPoint (data) {
      console.log(data)
      if (this.markerPoint) {
        this.map.remove(this.markerPoint)
      }
      if (this.newMarker) {
        this.map.remove(this.newMarker);
        this.newMarker = null;
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
      let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`
      this.newMarker = new window.AMap.InfoWindow({
        map: this.map,
        isCustom: true,
        closeWhenClickMap: false,
        position: [data.shotPlaceLongitude, data.shotPlaceLatitude],
        offset: new window.AMap.Pixel(0, -70),
        content: sConent
      })
    },
    /*sort排序方法*/
    clickTime() {
      if (this.sortType === 1) {
        this.timeSortType = !this.timeSortType;
        if (this.timeSortType) {
          this.pagination.order = 'desc';
        } else {
          this.pagination.order = 'asc';
        }
      } else if (this.sortType === 2) {
        this.sortType = 1;
      }
      // this.pagination.order = type;
      this.pagination.orderBy = 'shotTime';

      this.$nextTick(() => {
        this.getList();
      })
    },
    // 点击监控排序
    clickCamera() {
      if (this.sortType === 2) {
        this.cameraSortType = !this.cameraSortType;
        if (this.cameraSortType) {
          this.pagination.order = 'desc';
        } else {
          this.pagination.order = 'asc';
        }
      } else if (this.sortType === 1) {
        this.sortType = 2;
      }

      // this.pagination.order = type;
      this.pagination.orderBy = 'deviceName';

      this.$nextTick(() => {
        this.getList();
      })
    },
    /**
     * 分页赋值
     */
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.getList();
    },
    /**
     * 打开抓拍弹框
     */
    onOpenDetail (obj) {

      this.sturcDetail = obj;
      this.strucDetailDialog = true;
      this.$nextTick(() => {
        this.initMap(obj);
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
      this.$nextTick(() => {
        this.initMap(obj);
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.vc_gcck_bd {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 50px; line-height: 50px;
}
.th-ycxc-record {
  width: 100%;
  height: 100%;
  padding-top: 50px;
  .th-ycxc-record-list {
    width: 100%;
    // height: calc(100% - 55px);
    padding: 0 20px;
    background: #f7f9f9;
    // 检索结果与排序
    .result_sort {
      overflow: hidden;
      height: 40px;
      line-height: 40px;
      .result {
        font-size: 14px;
        color: #666;
        float: left;
      }
      .sort {
        font-size: 14px;
        width: 220px;
        height: 14px;
        margin: 0 auto;
        .sort_item {
          text-align: center;
          width: 110px;
          float: left;
          color: #999;
          cursor: pointer;
        }
        .active_sort {
          color: #2580fc;
          i {
            color: #2580fc;
          }
        }
      }
    }
    .list-box {
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      flex-flow: row wrap;
      // height: calc(100% - 45px);
      .list-item {
        width: 19%;
        height: 320px;
        padding: 15px;
        margin-bottom: 15px;
        cursor: pointer;
        background: #fff;
        margin-left: 1.25%;
        &:nth-child(5n - 4) {
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
          padding: 10px 0 5px 0;
          display: flex;
          align-items: center;
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
      &:hover {
        background-color: #FFFFFF;
        border-color: #0C70F8;
        color: #0C70F8;
      }
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
          width: 100%;
          height: 100%;
          background-color: #E9E7E8;
        }
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
              height: .3rem;
              line-height: .3rem;
              margin-bottom: .08rem;
              border: 1px solid #F2F2F2;
              background: #FAFAFA;
              color: #333333;
              white-space: nowrap;
              text-overflow: ellipsis;
              border-radius:3px;
              font-size: 12px;
              overflow: hidden;
              padding: 0 .3rem 0 .1rem;
              margin-right: .08rem;
              > b {
                color: #999;
                font-weight: normal;
                padding-left: 18px;
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
  margin-bottom: -15px;
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
</style>

  