<template>
  <div class="audit-detail">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/event/audit' }">事件管理</el-breadcrumb-item>
        <el-breadcrumb-item>受理核实</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-box">
      <div class="content-left">
        <div class="content_left_scroll">
          <vue-scroll>
            <div class="content_left">
              <ul>
                <li>
                  <span class="audit-label">状态:</span>
                  <span :class="[$route.query.status === 'pass' ? 'pass-status' : 'reject-status']">{{$route.query.status === 'pass' ? '通过' : '驳回'}}</span>
                </li>
                <li>
                  <span>事件编号:</span>
                  <span>{{detailInfo.eventCode}}</span>
                </li>
                <li>
                  <span>上报人:</span>
                  <div class="phone_box" style='margin-right:20px;'>
                    <!-- <template v-if="$route.query.status === 'reject'"> -->
                      <span >{{detailInfo.reporterPhone}}</span>
                    <!-- </template>
                    <template v-else>
                      <span class="reportUser">{{detailInfo.reporterPhone}}</span>
                      <div class="phone_dialog">
                        <div>
                          <i class="vl_icon vl_icon_event_14"></i>
                          <span>语音通话</span>
                        </div>
                        <div>
                          <i class="vl_icon vl_icon_event_17"></i>
                          <span>视频通话</span>
                        </div>
                      </div>
                    </template> -->
                  </div>
                </li>
                <li>
                  <span>上报时间:</span>
                  <span>{{detailInfo.reportTime}}</span>
                </li>
                <li>
                  <span>事发地点:</span>
                  <span>{{detailInfo.eventAddress}}</span>
                </li>
                <li>
                  <span>事件情况:</span>
                  <span>{{detailInfo.eventDetail}}</span>
                  <div class="img_list">
                    <img
                      v-for="(item, index) in detailInfo.attachmentList"
                      :key="index"
                      :src="item.path"
                      @click="handleBigImg(index)"
                      alt="" 
                    />
                  </div>
                </li>
                <li>
                  <span>处理单位:</span>
                  <span>{{detailInfo.handleCompany}}</span>
                </li>
                <li>
                  <span>事件类型:</span>
                  <span>{{detailInfo.eventTypeName}}</span>
                </li>
                <li>
                  <span>事件等级:</span>
                  <span>{{detailInfo.eventLevelName}}</span>
                </li>
                <li>
                  <span>伤亡人员:</span>
                  <template v-if='detailInfo.casualties == -1'>
                    <span>不确定</span>
                  </template>
                  <template v-else-if='detailInfo.casualties == 0'>
                    <span>无</span>
                  </template>
                  <template v-if='detailInfo.casualties > 0'>
                    <span>{{detailInfo.casualties}}</span>
                  </template>
                </li>
                <li>
                  <span>驳回原因:</span>
                  <span>{{detailInfo.rejectReason}}</span>
                </li>
              </ul>
            </div>
          </vue-scroll>
        </div>
      </div>
      <div class="content-right">
        <!--地图-->
        <div id="mapBox"></div>
        <div class="right-flag">
          <ul class="map-rrt">
            <li><i class="vl_icon vl_icon_control_23" @click="resetMap"></i></li>
          </ul>
          <ul class="map-rrt map_rrt_u2">
            <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
            <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn back_btn" @click="back">返回</el-button>
    </div>
    <BigImg :imgList="imgList1" :imgIndex='imgIndex' :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
  </div>
</template>
<script>
import BigImg from './components/bigImg.vue';
import { getEventDetail } from '@/views/index/api/api.js';
export default {
  components: { BigImg },
  data () {
    return {
      imgIndex: 0, // 点击的图片索引
      isShowImg: false, // 是否放大图片
      imgList1: [],
      imgList: [
        {
          uid: '001',
          src: require('./img/1.jpg')
        },
        {
          uid: '002',
          src: require('./img/2.jpg')
        },
        {
          uid: '003',
          src: require('./img/3.jpg')
        },
        {
          uid: '004',
          src: require('./img/4.jpg')
        },
        {
          uid: '005',
          src: require('./img/4.jpg')
        }
      ],
      detailInfo: {
        // eventNumber: 'X23912831283129038210938', // 事件编号
        // userName: '18077777777', // 报案人  手机号码
        // createTime: '2019-1-12 12:12:12', // 上报时间
        // eventAddress: '湖南省怀化市溆浦县', // 事发地点
        // describe: '啊撒可怜见的昂克赛拉的骄傲啊看来撒娇的啊卢卡斯就的看拉萨角度来看啊卢卡斯就的', // 事件情况
        // eventType: '自然灾害', // 事件类型
        // eventLevel: 'IV级', // 事件等级
        // casualtiesFlag: '无', // 伤亡人员
        // longitude: 112.975828, // 经度
        // latitude: 28.093804, // 纬度
        // handleCompany: '公安部', // 处理单位
        // fileList: [
        //   {
        //     uid: '001',
        //     src: require('./img/1.jpg')
        //   },
        //   {
        //     uid: '002',
        //     src: require('./img/2.jpg')
        //   },
        //   {
        //     uid: '003',
        //     src: require('./img/3.jpg')
        //   },
        //   {
        //     uid: '004',
        //     src: require('./img/4.jpg')
        //   },
        //   {
        //     uid: '005',
        //     src: require('./img/4.jpg')
        //   }
        // ], // 图片文件
        // rejectReason: '你猜你猜你猜你猜你猜你猜你猜', // 驳回原因
      },
      map: null
    }
  },
  mounted () {
    this.initMap();
    this.getDetail();
  },
  methods: {
    initMap () {
      let _this = this;
      let map = new window.AMap.Map('mapBox', {
        zoom: 16, // 级别
        center: [112.980377, 28.100175], // 中心点坐标112.980377,28.100175
      });
      map.setMapStyle('amap://styles/whitesmoke');
      _this.map = map;
    },
    // 获取事件详情
    getDetail () {
      const eventId = this.$route.query.eventId;
      getEventDetail(eventId)
        .then(res => {
          if (res) {
            this.detailInfo = res.data;
            this.mapMark(this.detailInfo);
          }
        })
        .catch(() => {})
    },
    resetMap () {
      let _this = this;
      let map = new window.AMap.Map('mapBox', {
        zoom: 16, // 级别
        center: [112.980377, 28.100175], // 中心点坐标112.980377,28.100175
        // viewMode: '3D' // 使用3D视图
      });
      map.setMapStyle('amap://styles/whitesmoke');
      _this.map = map;
    },
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    // 地图标记
    mapMark (obj) {
      let _this = this;
      _this.map.clearMap();
      let hoverWindow = null;
      if (obj.longitude > 0 && obj.latitude > 0) {
        let offSet = [-20.5, -48];
        let marker = new window.AMap.Marker({ // 添加自定义点标记
          map: _this.map,
          position: [obj.longitude, obj.latitude],
          offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: '<div class="vl_icon vl_icon_control_30"></div>'
        });
        marker.setMap(_this.map);
        _this.newMarker = marker;
        // hover
        marker.on('mouseover', function () {
          let sContent = '<div class="vl_map_hover" >' +
            '<div class="vl_main_hover_address" style="min-width: 300px;padding: 15px"><p class="vl_map_hover_main_p">事发地点： ' + obj.eventAddress + '</p></div></div>';
          hoverWindow = new window.AMap.InfoWindow({
            isCustom: true,
            closeWhenClickMap: true,
            offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
            content: sContent
          });
          // aCenter = mEvent.target.F.position
          hoverWindow.open(_this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
          hoverWindow.on('close', function () {
            // console.log('infoWindow close')
          });
        });
        marker.on('mouseout', function () {
          if (hoverWindow) { hoverWindow.close(); }
        });
      }
    },
    back () { // 返回
      this.$router.back(-1);
    },
    emitCloseImgDialog(data){
      this.imgList1 = [];
      this.isShowImg = data;
    },
    // 图片放大
    handleBigImg (index) {
      console.log(index)
      this.isShowImg = true;
      this.imgIndex = index;
      this.imgList1 = JSON.parse(JSON.stringify(this.imgList));
    }
  }
}
</script>
<style lang="scss" scoped>
.audit-detail {
  width: 100%;
  height: 100%;
  .content-box {
    width: 98%;
    margin: 0 20px; 
    height: calc(100% - 50px - 100px);
    display: flex;
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    .content-left {
      .content_left_scroll {
        width: 500px;
        height: 100%;
        background: #ffffff;
        /deep/ .__view {
          width: 100% !important;
        }
        .content_left {
          width: 100%;
          padding: 20px 10px 0 10px;
          > ul {
            width: 100%;
            font-size: 14px;
            > li {
              line-height: 30px;
              display: flex;
              flex-wrap: wrap;
              width: 100%;
              > span:nth-child(1) {
                padding-right: 10px;
                color: #666666;
                width: 20%;
                display: inline-block;
                text-align: right;
                &.audit-label {
                  color: #333333;
                }
              }
              > span:nth-child(2) {
                width: 70%;
                color: #333333;
                display: inline-block;
                &.pass-status {
                  font-size: 20px;
                  color: #4FCB61;
                }
                &.reject-status {
                  color: #F94539;
                  font-size: 20px;
                }
                &.phone {
                  color: #0C70F8;
                  cursor: pointer;
                }
              }
              .phone_box {
                position: relative;
                padding-right: 10px;
                &:hover {
                  .phone_dialog {
                    display: block;
                  }
                }
                .reportUser {
                  color: #0C70F8;
                  cursor: pointer;
                }
                .phone_dialog {
                  display: none;
                  position: absolute;
                  background-color: #ffffff;
                  right: -30px;
                  bottom: 30px;
                  box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.15);
                  >div {
                    padding: 0 10px;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    >span {
                      color: #333333;
                      font-size: 12px;
                    }
                    &:hover {
                      >span {
                        color: #0C70F8;
                      }
                    }
                  }
                }
              }
              .img_list {
                width: 100%;
                flex-wrap: wrap;
                display: flex;
                margin-left: 20%;
                img {
                  cursor: pointer;
                  width: 80px;
                  height: 80px;
                  border-radius: 4px;
                  margin-bottom: 5px;
                  margin-right: 5px;
                }
              }
            }
          }
        }
      }
    }
    .content-right {
      width: 100%;
      height: 100%;
      #mapBox{
        height: 100%;
        width: 100%;
      }
      .right-flag {
        position: absolute; right: 40px; bottom: 100px;
        height: 220px;
        transition: right .3s ease-out;
        animation: fadeInRight .4s ease-out .4s both;
        .map-rrt {
          padding: 0 5px;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(148,148,148,0.24);
          >li {
            padding: 15px 15px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            text-align: center;
            >i {
              font-size: 20px;
              color: #0B6FF7;
            }
            &:last-child { border-bottom: 0; }
          }
        }
        .map_rrt_u2 {
          margin-top: 20px;
        }
      }
    }
  }
  .operation-footer {
    border-left: 1px solid #F2F2F2;
    width: 100%;
    height: 65px;
    line-height: 65px;
    position: fixed;
    bottom: 0;
    background: #ffffff;
    padding-left: 20px;
    .operation_btn {
      padding: 0;
      width: 100px;
      height: 40px;
      text-align: center;
    }
    .function_btn {
      background: #0C70F8;
      color: #ffffff;
    }
    .back_btn {
      background: #ffffff;
      border: 1px solid #DDDDDD;
      color: #666666;
    }
  }
}
</style>
