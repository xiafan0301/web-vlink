<template>
  <div class="vehicle_content">
    <div class="vc_gcck_bd" is="vehicleBreadcrumb" :oData="[{name: '区域碰撞', routerName: 'vehicle_search_qy'}, {name: '碰撞结果'}]"></div>
    <div class="the-right-result">
      <div class="vc_main_left">
        <vue-scroll>
          <div class="vc_l_sup_m">
            <h5 class="">车辆列表</h5>
            <p @click="leftActive = -1" :class="{'active': leftActive === -1}">全部</p>
            <ul>
              <li :class="{'active': leftActive === index}" v-for="(item, index) in leftList" :key="item.id" @click="leftActive = index">{{item}}</li>
            </ul>
          </div>
        </vue-scroll>
      </div>
      <div class="vl_s_right">
        <div class="vl_jig_right">
          <div class="vl_jig_right_title">
            <div class="vl_jr_t_item">
              <span><span style="color: #333333">共有过车数据</span> ({{strucInfoList.length}}) 条 </span>
              <div :class="{'active-item': stucOrder < 3}" @click="timeOrderS">时间排序 <span><i :class="{'active': stucOrder === 2}" class="el-icon-caret-top"></i><i :class="{'active': stucOrder === 1}" class="el-icon-caret-bottom"></i></span></div>
            </div>
            <div class="vl_jr_t_item">
              <div :class="{'active-item': stucOrder === 3}" @click="stucOrder = 3">监控排序</div>
            </div>
          </div>
          <div class="vl_jfo_event">
            <vue-scroll>
              <div class="vl_jfo_event_box clearfix">
                <div class="vl_jfo_box_item" :class="{'vl_jfo_box_item_su': index === 4 || index === 9}" v-for="(item, index) in curStrucList" :key="item.id" @click="showStrucInfo(item, index)">
                  <img :src="item.subStoragePath" alt="">
                  <p class="time"><i></i>{{item.shotTime}}</p>
                  <p class="address"><i></i>抓拍设备:{{item.deviceName}}</p>
                </div>
              </div>
              <el-pagination
                v-show="pagination.total > 10"
                style="text-align: center"
                background
                @current-change="handleCurrentChange"
                :current-page="pagination.pageNum"
                :page-size="pagination.pageSize"
                layout="prev, pager, next"
                :total="pagination.total">
              </el-pagination>
            </vue-scroll>
          </div>
        </div>
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
        <i class="el-icon-close" @click="closeDialog"></i>
      </div>
      <div class="struc_main">
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.subStoragePath" alt="">
            <span>上传图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img">
              <img :src="sturcDetail.storagePath" alt="">
              <span>全景图</span>
            </div>
            <div class="struc_c_d_info">
              <h2>抓拍信息</h2>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.shotTime}} <font>抓拍时间</font></span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.deviceName}} <font>抓拍设备</font></span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.address}} <font>抓拍地址</font></span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.plateNo}} <font>车牌号</font></span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.vehicleColor}} {{sturcDetail.vehicleClass}} {{sturcDetail.vehicleBrand}} {{sturcDetail.vehicleStyles}} <font>特征</font></span>
              </div>
              <div class="struc_cdi_line"></div>
            </div>
          </div>
        </div>
        <div v-show="strucCurTab === 2" class="struc_c_address"></div>
        <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.subStoragePath" alt="">
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
          <swiper-slide v-for="(item, index) in curStrucList" :key="item.id">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
              <img style="width: 100%; height: .88rem;" :src="item.subStoragePath" alt="">
              <!--<div class="vl_jfo_sim" ><i class="vl_icon vl_icon_retrieval_05" :class="{'vl_icon_retrieval_06':  index === curImgIndex}"></i>{{item.semblance ? item.semblance : 92}}<span style="font-size: 12px;">%</span></div>-->
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
  import {QypzGetAreaCross} from '@/views/index/api/api.judge.js'
  export default {
    components: {vehicleBreadcrumb, flvplayer},
    data () {
      return {
        stucOrder: 2, // 1升序，2降序，3监控，4相似度
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
        pagination: { total: 0, pageSize: 10, pageNum: 1 },
        amap: null, // 地图实例
        markerPoint: null, // 地图点集合
        InfoWindow: null,
        curVideoUrl: '',
        playing: false, // 视频播放是否
        strucInfoList: [], // 检索抓拍信息
        strucCurTab: 1,
        leftActive: -1, // -1全部
        curImgIndex: 0,
        sturcDetail: {},
        strucDetailDialog: false,
        videoUrl: '' // 弹窗视频回放里的视频
      }
    },
    computed: {
      leftList () {
        let _arr = [];
        this.strucInfoList.forEach(x => {
          if (!_arr.includes(x.plateNo)) {
            _arr.push(x.plateNo)
          }
        })
        return _arr;
      },
      curStrucList () {
        if (this.leftActive === -1) {
          return this.strucInfoList
        } else {
          return this.strucInfoList.filter(x => x.plateNo === this.leftList[this.leftActive])
        }
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
        params.pageNum = this.pagination.pageNum;
        params.pageSize = this.pagination.pageSize;
        params.order = this.stucOrder === 2 ? "desc" : "asc";
        params.orderBy= "shotTime";
        QypzGetAreaCross(params).then(res => {
          if (res) {
            console.log(res)
            if(res.data.list.length === 0) {
              this.$message.info('抱歉，没有找到匹配结果');
              this.$router.push({name: "vehicle_search_qy"})
            }
            this.strucInfoList = res.data.list;
            this.pagination.pageNum = res.data.pageNum;
            this.pagination.total = res.data.total;
          } else {
            if(res.data.list.length === 0) {
              this.$message.info('抱歉，没有找到匹配结果');
              this.$router.push({name: "vehicle_search_qy"})
            }
          }
        }).catch(err => {
          this.$message.info('抱歉，没有找到匹配结果');
          this.$router.push({name: "vehicle_search_qy"})
        })
      },
      searchSubmit () {
      },
      searchReset () {
      },
      timeOrderS () {
        if (this.stucOrder > 2) {
          this.stucOrder = 2;
        } else {
          this.stucOrder === 1 ? this.stucOrder = 2 : this.stucOrder = 1;
        }
      },
      handleCurrentChange (e) {
        this.pagination.pageNum = e;
        this.getTheList();
      },
      showStrucInfo (data, index) {
        this.curImgIndex = index;
        this.strucDetailDialog = true;
        this.sturcDetail = data;
        this.strucCurTab = 1;
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
      },
      closeDialog () {
        this.strucDetailDialog = false;
      }
    },
    watch: {
      stucOrder () {
        this.getTheList();
      },
      strucCurTab (e) {
        if (e === 2) {
          this.drawPoint(this.sturcDetail)
        } else if (e === 3) {
          this.videoUrl = document.getElementById('capVideo').src;
        }
      },
      leftActive (e) {
        if (e === -1) {

        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vehicle_content {
    height: calc(100% - 50px);
  }
  .the-right-result {
    width: 100%; height: 100%;
    background: #F7F9F9;
    /*padding: 15px 12px 25px 0;*/
    display: flex;
    overflow-y: hidden;
    margin-top: 50px;
    .vc_main_left {
      width: 250px;
      height: 100%;
      color: #333333;
      text-indent: 20px;
      background: #ffffff;
      .vc_l_sup_m{
        > h5 {
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid #DCDCDC;
        }
        .active {
          background: #E0F3FF;
          color: #0C70F8;
          border-left-color: #0C70F8;
        }
        > p, ul li {
          height: 54px;
          line-height: 54px;
          border-bottom: 1px solid #DCDCDC;
          cursor: pointer;
          border-left: 4px solid #ffffff;
          &:hover {
            background: #E0F3FF;
            color: #0C70F8;
            border-left-color: #0C70F8;
          }
        }
      }
    }
    .vl_s_right {
      display: inline-block;
      width: calc(100% - 250px);
      height: 100%;
      position: relative;
      .vl_jig_right {
        width: 100%;
        height: 100%;
        padding: 0 20px;
        padding-right: 0;
        .vl_jig_right_title {
          width: 100%;
          height: 56px;
          line-height: 56px;
          color: #999999;
          .vl_jr_t_item {
            float: left;
            width: 50%;
            text-align: left;
            padding-left: 10px;
            >div {
              cursor: pointer;
              display: inline-block;
            }
            .active-item {
              color: #2580FC;
              i {
                color: #999999;
              }
              .active {
                color: #2580FC;
              }
            }
            &:first-child {
              padding-right: 10px;
              padding-left: 0;
              >div {
                float: right;
                span {
                  display: inline-block;
                  vertical-align: middle;
                  i {
                    display: block;
                    font-size: 10px;
                  }
                }
              }
            }
          }
        }
        .vl_jfo_event {
          height: calc(100% - 70px);
          .vl_jfo_event_box {
            width: 100%;
            height: auto;
            .vl_jfo_box_item {
              float: left;
              cursor: pointer;
              width: 292px;
              height: 346px;
              padding: 14px;
              margin-right: 40px;
              margin-bottom: 26px;
              background: rgba(255, 255, 255, 1);
              box-shadow: 0px 5px 16px 0px rgba(169, 169, 169, 0.2);
              img {
                display: inline-block;
                width: 265px;
                height: 263px;
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
            .vl_jfo_box_item_su {
              margin-right: 0px;
            }
          }
        }
      }
    }
    .the-result-box {
      width: calc(100% - 250px); height: 100%;
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
      width: 11.46rem;
      height: 4.4rem;
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
        .download_btn {
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
          position: relative;
          &:hover {
            color: #FFFFFF;
            background: #0C70F8;
            border-color: #0C70F8;
          }
          a {
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
          }
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