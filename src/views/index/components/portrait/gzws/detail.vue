<template>
  <div class="gzws_record">
    <Breadcrumb :oData="[{name: '跟踪尾随', routerName: 'gzws_portrait'}, {name: '尾随记录'}]"></Breadcrumb>
    <div class="content_box">
      <div class="left">
        <h2>尾随人员的库信息</h2>
        <ul>
          <li>
            <img src="../../../../../assets/img/temp/vis-eg.png" alt="">
          </li>
          <li>
            <span>姓名：</span>
            <span>雪佛兰科鲁兹</span>
          </li>
          <li>
            <span>性别：</span>
            <span>红色</span>
          </li>
          <li>
            <span>身份证号：</span>
            <span>430322199709831112</span>
          </li>
          <li>
            <span>布控组：</span>
            <span>你猜咯</span>
          </li>
        </ul>
      </div>
      <div class="right">
        <div class="operation_box">
          <p>人员布控</p>
          <p>人脸检索</p>
          <p>轨迹碰撞</p>
          <p>落脚点分析</p>
        </div>
        <div id="rightMap"></div>
      </div>
    </div>
    <!-- 视频全屏放大 -->
    <div style="width: 0; height: 0;" v-show="showLarge" :class="{vl_j_fullscreen: showLarge}">
      <video id="controlVideo" :src="videoDetail.videoPath"></video>
      <div @click="closeVideo" class="vl_icon vl_icon_event_23 close_icon"></div>
      <div class="control_bottom">
        <div>{{videoDetail.deviceName}}</div>
        <div>
          <span @click="playLargeVideo(false)" class="vl_icon vl_icon_judge_01" v-show="isPlaying"></span>
          <span @click="playLargeVideo(true)" class="vl_icon vl_icon_control_09" v-show="!isPlaying"></span>
          <span @click="cutScreen" class="vl_icon vl_icon_control_07"></span>
          <span><a download="视频" :href="videoDetail.videoPath" class="vl_icon vl_icon_event_26"></a></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { testData } from './testData.js';
import { getTailBehindDetail } from '@/views/index/api/api.judge.js';
import Breadcrumb from '../breadcrumb.vue';
import { formatESDate } from '@/utils/util.js';
export default {
  components: { Breadcrumb },
  data () {
    return {
      showLarge: false, // 全屏显示
      videoDetail: {}, // 播放视频的信息
      isPlaying: false, // 是否播放视频
      map: null,
      // testData: testData,
      resultList: [],
      marker: {},
    }
  },
  mounted () {
    this.initMap();
    // setTimeout(() => {
    //   this.getDetail();
    // }, 500)
  },
  methods: {
    // 获取尾随车辆详情
    getDetail () {
      const plateNo = this.$route.query.plateNo;
      const dateStart = formatESDate(this.$route.query.dateStart);
      const dateEnd = formatESDate(this.$route.query.dateEnd);
      const plateNoTb = this.$route.query.plateNoTb;
      const dateStartTb = formatESDate(this.$route.query.dateStartTb);
      const params = {
        plateNo,
        dateStart,
        dateEnd,
        plateNoTb,
        dateStartTb
      };
      getTailBehindDetail(params)
        .then(res => {
          if (res && res.data) {
            console.log('res', res)
            this.resultList = res.data;

            this.mapMark(this.resultList)
          }
        })
    },
    // 初始化地图
    initMap () {
      let _this = this;
      let map = new window.AMap.Map('rightMap', {
        zoom: 15, // 级别
        center: [110.596015, 27.907662], // 中心点坐标[110.596015, 27.907662]
      });
      map.setMapStyle('amap://styles/whitesmoke');

      _this.map = map;
    },
    mapMark (data) {
      if (data && data.length > 0) {
        let _this = this, hoverWindow = null, path= [];
        for (let i = 0; i < data.length; i++) {
          
          let obj = data[i];
          if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
            let offSet = [-20.5, -55];
            
            let _idBtn = 'vlJtcPlayBtn' + obj.deviceID;
            let _id = 'vlJtcVideo' + obj.deviceID;

            let marker = new window.AMap.Marker({
              map: _this.map,
              position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude],
              offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: '', // 用户自定义属性
              // 自定义点标记覆盖物内容
              content: '<div id="vehicle' + obj.deviceID + '"  title="'+ obj.deviceName +'" class="vl_icon vl_icon_sxt"></div>'
            });
  
            path.push(new window.AMap.LngLat(obj.shotPlaceLongitude, obj.shotPlaceLatitude));

            marker.on('mouseover', function () {
              $('#vehicle' + obj.deviceID).addClass('vl_icon_map_hover_mark0');

              let sContent = "<div class='tip_box'><div class='select_target'><p class='select_p'>查询目标</p>"
                    +"<img src="+ obj.subStoragePath +" /><div class='mongolia'>"
                    +"<span>"+ obj.shotTime +"</span><i id="+ _id +" class='vl_icon vl_icon_control_09'></i></div></div>"
                    +"<div class='tail_vehicle'><p class='tail_p'>尾随车辆</p><img src="+ obj.subStoragePathTb +" />"
                    +"<div class='mongolia'><span>"+ obj.shotTimeTb +"</span><i id="+ _idBtn +" class='vl_icon vl_icon_control_09'></i></div></div>"
                    +"<div class='divide'></div><div class='device_name'>"+ obj.deviceName +"</div></div>";

                hoverWindow = new window.AMap.InfoWindow({
                  isCustom: true,
                  closeWhenClickMap: true,
                  offset: new window.AMap.Pixel(180, 180), // 相对于基点的偏移位置
                  content: sContent
                });
                hoverWindow.open(_this.map, new window.AMap.LngLat(obj.shotPlaceLongitude, obj.shotPlaceLatitude));

                setTimeout(() => {
                  _this.addListen(_idBtn, obj);
                  _this.addListen(_id, obj);
                }, 500);
            });
            marker.on('mouseout', function () {
              $('#vehicle' + obj.deviceID).removeClass('vl_icon_map_hover_mark0');
            });
            _this.map.setZoom(13)
            // marker.setPosition([obj.shotPlaceLongitude, obj.shotPlaceLatitude]);
             _this.map.setCenter([obj.shotPlaceLongitude, obj.shotPlaceLatitude]);
            // marker.setMap(_this.map);
            //_this.map.setFitView();// 执行定位

          }
          // 绘制线条
          let polyline = new window.AMap.Polyline({
            path: path,
            strokeWeight: 4,
            strokeColor: '#61C772',
            strokeStyle: 'dashed'
          });

          _this.map.add(polyline);
        }
      }
    },
    // 视频播放点击事件
    addListen (id, obj) {
      let _Dom = document.getElementById(id);
      let self = this;
      _Dom.addEventListener('click', function () {
        self.openVideo(obj);
      })
    },
    // 点击视频播放按钮全屏播放视频
    openVideo (obj) {
      this.videoDetail = obj;
      this.showLarge = true;
    },
    // 关闭视频
    closeVideo () {
      this.showLarge = false;
      document.getElementById('controlVideo').pause();
    },
    // 播放视频
    playLargeVideo (val) {
       if (val) {
        this.isPlaying = true;
        document.getElementById('controlVideo').play();
        this.handleVideoEnd();
      } else {
        this.isPlaying = false;
        document.getElementById('controlVideo').pause();
      }
    },
    // 监听视频是否已经播放结束
    handleVideoEnd () {
      let _this = this;
      const obj = document.getElementById('controlVideo');
      if (obj) {
        obj.addEventListener('ended', () => { // 当视频播放结束后触发
          _this.isPlaying = false;
        });
      }
    },
    // 截屏
    cutScreen () {

    },
  }
}
</script>
<style lang="scss">
.tip_box {
  width: 258px;
  height: 361px;
  padding: 20px;
  background:rgba(255,255,255,1);
  box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
  .select_target, .tail_vehicle {
    width:218px;
    height:122px;
    margin-bottom: 15px;
    position: relative;
    >p {
      left: 0;
      top: 0;
      position: absolute;
      width:68px;
      height:20px;
      border-radius:0px 10px 10px 0px;
      color: #ffffff;
    }
    .select_p {
      background:rgba(12,112,248,1);
    }
    .tail_p {
      background-color: #50CC62;
    }
    .mongolia {
      width: 100%;
      // height: 26px;
      padding: 5px 0;
      display: flex;
      justify-content: space-between;
      position: absolute;
      background:rgba(0,0,0,1);
      opacity:0.7;
      bottom: 0;
      left: 0;
      align-items: center;
      font-size: 12px;
      color: #fff;
      >span {
        margin-left: 5px;
      }
      > i {
        margin-right: 5px;
        cursor: pointer;
      }
    }
    // .img_box {
      >img {
        width: 100%;
        height: 100%;
      }
    // }
  }
  .divide {
    height:1px;
    margin-bottom: 15px;
    border-bottom: 1px solid #F2F2F2;
    box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
  }
  .device_name {
    color: #666666;
  }
}
</style>

<style lang="scss" scoped>
.gzws_record {
  height: 100%;
  .content_box {
    display: flex;
    height: 100%;
    padding-top: 50px;
    // height: calc(100% - 55px);
    .left {
      width: 272px;
      background-color: #ffffff;
      box-shadow:2px 3px 10px 0px rgba(131,131,131,0.28);
      padding: 20px;
      >h2 {
        color: #222222;
        font-weight: bold;
        font-size: 18px;
      }
      >ul {
        margin-top: 15px;
        >li {
          line-height: 30px;
          > img {
            width: 160px;
            height: 160px;
          }
          span:first-child {
            color: #666666;
          }
          span:last-child {
            color: #222222;
          }
        }
      }
    }
    .right {
      width: calc(100% - 272px);
      height: 100%;
      position: relative;
      .operation_box {
        width: 100%;
        top: 0;
        left: 0;
        position: absolute;
        height: 50px;
        box-shadow:2px 3px 10px 0px rgba(131,131,131,0.28);
        background-color: #ffffff;
        display: flex;
        align-items: center;
        padding-left:15px;
        z-index: 1111;
        >p {
          width:130px;
          height:40px;
          line-height: 40px;
          margin-right: 15px;
          cursor: pointer;
          background:rgba(246,248,249,1);
          border:1px solid rgba(211,211,211,1);
          border-radius:4px;
          color: #666666;
          font-size: 16px;
          text-align: center;
          &:hover {
            background:linear-gradient(90deg,rgba(8,106,234,1) 0%,rgba(4,102,222,1) 100%);
            color: #ffffff;
          }
        }
      }
      #rightMap {
        z-index: 1000;
        width: 100%;
        height: 100%;
      }
    }
  }
}
.vl_j_fullscreen {
  position: fixed;
  width: 100% !important;
  height: 100% !important;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #000000;
  z-index: 9999;
  -webkit-transition: all .4s;
  -moz-transition: all .4s;
  -ms-transition: all .4s;
  -o-transition: all .4s;
  transition: all .4s;
  > video {
    width: 100%;
    height: 100%;
  }
  > .control_bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 48px;
    background: rgba(0, 0, 0, .65);
    > div {
      float: left;
      width: 50%;
      height: 100%;
      line-height: 48px;
      text-align: right;
      padding-right: 20px;
      color: #FFFFFF;
      &:first-child {
        text-align: left;
        padding-left: 20px;
      }
      > span {
        display: inline-block;
        height: 22px;
        margin-left: 10px;
        vertical-align: middle;
        cursor: pointer;
        a {
          font-size: 25px;
          text-decoration: none;
          color: #ffffff;
          vertical-align: top;
        }
      }
    }
  }
}
.close_icon {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 1000;
  cursor: pointer;
}
</style>
