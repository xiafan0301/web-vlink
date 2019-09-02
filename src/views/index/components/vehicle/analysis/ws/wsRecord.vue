<template>
  <div class="ws_record">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" 
        :breadcrumbData="[
          {name: '车辆侦查', routerName: 'vehicle'},
          {name: '尾随分析', routerName: 'vehicle_search_ws', query: {
            plateNo: $route.query.plateNo,
            dateStart: $route.query.dateStart,
            searchStartTime: $route.query.searchStartTime,
            dateEnd: $route.query.dateEnd,
            vehicleClass: $route.query.vehicleClass,
            interval: $route.query.interval,
            deviceCode: $route.query.deviceCode
          }},
          {name: '尾随记录'}]">
      </div>
    </div>
    <div class="content_box">
      <div class="left">
        <vue-scroll>
          <h2>尾随车辆的特征信息</h2>
          <ul class="left_ul">
            <li>
              <img :src="resultList.length > 0 && resultList[0].struVehicleDto.storagePath" alt="" class="bigImg">
            </li>
            <li>
              <span>有无车牌：</span>
              <span>{{resultList.length > 0 && resultList[0].struVehicleDto.hasPlate ? resultList[0].struVehicleDto.hasPlate : '未知'}}</span>
            </li>
            <li>
              <span>车牌号：</span>
              <span>{{resultList.length > 0 && resultList[0].struVehicleDto.plateNo ? resultList[0].struVehicleDto.plateNo : '未知'}}</span>
            </li>
            <li>
              <span>号牌种类：</span>
              <span>{{resultList.length > 0 && resultList[0].struVehicleDto.plateClass ? resultList[0].struVehicleDto.plateClass : '未知'}}</span>
            </li>
            <li>
              <span>车牌颜色：</span>
              <span>{{resultList.length > 0 && resultList[0].struVehicleDto.plateColor ? resultList[0].struVehicleDto.plateColor : '未知'}}</span>
            </li>
            <li>
              <span>车辆类型：</span>
              <span>{{resultList.length > 0 && resultList[0].struVehicleDto.vehicleClass ? resultList[0].struVehicleDto.vehicleClass : '未知'}}</span>
            </li>
            <li>
              <span>车辆品牌：</span>
              <span>{{resultList.length > 0 && resultList[0].struVehicleDto.vehicleBrand ? resultList[0].struVehicleDto.vehicleBrand : '未知'}}</span>
            </li>
            <li>
              <span>车辆型号：</span>
              <span>{{resultList.length > 0 && resultList[0].struVehicleDto.vehicleModel ? resultList[0].struVehicleDto.vehicleModel : '未知'}}</span>
            </li>
            <li>
              <span>车辆年款：</span>
              <span>{{resultList.length > 0 && resultList[0].struVehicleDto.vehicleStyles ? resultList[0].struVehicleDto.vehicleStyles : '未知'}}</span>
            </li>
            <li>
              <span>车辆颜色：</span>
              <span>{{resultList.length > 0 && resultList[0].struVehicleDto.vehicleColor ? resultList[0].struVehicleDto.vehicleColor : '未知'}}</span>
            </li>
            <li>
              <span>车顶：</span>
              <span>{{resultList.length > 0 && resultList[0].struVehicleDto.vehicleRoof ? resultList[0].struVehicleDto.vehicleRoof : '未知'}}</span>
            </li>
            <li>
              <span>撞痕：</span>
              <span>{{resultList.length > 0 && resultList[0].struVehicleDto.hitMarkInfo ? resultList[0].struVehicleDto.hitMarkInfo : '未知'}}</span>
            </li>
            <li>
              <span>车前物品描述：</span>
              <span>{{resultList.length > 0 && resultList[0].struVehicleDto.descOfFrontItem ? resultList[0].struVehicleDto.descOfFrontItem : '未知'}}</span>
            </li>
            <li>
              <span>车后物品描述：</span>
              <span>{{resultList.length > 0 && resultList[0].struVehicleDto.descOfRearItem ? resultList[0].struVehicleDto.descOfRearItem : '未知'}}</span>
            </li>
            <li>
              <span>遮阳板状态：</span>
              <span>{{resultList.length > 0 && resultList[0].struVehicleDto.sunvisor ? resultList[0].struVehicleDto.sunvisor : '未知'}}</span>
            </li>
            <li>
              <span>安全带状态：</span>
              <span>{{resultList.length > 0 && resultList[0].struVehicleDto.safetyBelt ? resultList[0].struVehicleDto.safetyBelt : '未知'}}</span>
            </li>
            <li>
              <span>打电话状态：</span>
              <span>{{resultList.length > 0 && resultList[0].struVehicleDto.calling ? resultList[0].struVehicleDto.calling : '未知'}}</span>
            </li>
          </ul>
        </vue-scroll>
      </div>
      <div class="right">
        <div class="operation_box">
          <!-- <p @click="skipBreakRecordPage">查看违章记录</p> -->
          <p @click="skipVehicleControlPage">车辆布控</p>
          <p @click="skipTrajectoryPage">轨迹分析</p>
          <p @click="skipFootholdPage">落脚点分析</p>
          <!-- <p>以车搜车</p> -->
        </div>
        <div id="rightContainerMap"></div>
        <!--地图操作按钮-->
        <ul class="map_rrt_u2">
          <li @click="resetZoom"><i class="el-icon-aim"></i></li>
          <li @click="mapZoomSet(1)"><i class="el-icon-plus"></i></li>
          <li @click="mapZoomSet(-1)"><i class="el-icon-minus"></i></li>
        </ul>
      </div>
    </div>
    <!-- 视频全屏放大 -->
    <div style="width: 0; height: 0;" v-if="showLarge" :class="{vl_j_fullscreen: showLarge}">
      <div is="flvplayer" :oData="playerData" @playerClose="playerClose"  :oConfig="{sign: false, close: true, pause: true}" ></div>

      <!-- <video id="controlVideo" :src="videoDetail.videoPath" crossOrigin="anonymous"></video>
      <div @click="closeVideo" class="vl_icon vl_icon_event_23 close_icon"></div>
      <div class="control_bottom">
        <div>{{videoDetail.deviceName}}</div>
        <div>
          <span @click="playLargeVideo(false)" class="vl_icon vl_icon_judge_01" v-show="isPlaying"></span>
          <span @click="playLargeVideo(true)" class="vl_icon vl_icon_control_09" v-show="!isPlaying"></span>
          <span @click="playerCut" class="vl_icon vl_icon_control_07"></span>
          <span><a download="视频" :href="videoDetail.videoPath" target="_blank" class="vl_icon vl_icon_event_26"></a></span>
        </div>
      </div> -->
    </div>
    <!-- 截屏 dialog -->
    <!-- <el-dialog title="截屏" :visible.sync="cutDialogVisible" :center="false" :append-to-body="true" width="1000px">
      <div style="text-align: center; padding-top: 30px;">
        <canvas :id="flvplayerId + '_cut_canvas'"></canvas>
      </div>
      <div slot="footer" class="dialog-footer" style="padding: 0 0 20px 0;">
        <el-button  @click="cutDialogVisible = false">取 消</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button  type="priamry" @click="playerCutSave">保 存</el-button>
        <a :id="flvplayerId + '_cut_a'" style="display: none;">保存</a>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import { mapXupuxian } from "@/config/config.js";
import { getTailBehindDetail, getVehicleArchives } from '@/views/index/api/api.judge.js'
import { random14 } from '@/utils/util.js';
import flvplayer from '@/components/common/flvplayer.vue';
export default {
  components: { vlBreadcrumb, flvplayer },
  data () {
    return {
      // cutDialogVisible: false, // 截屏弹出框
      showLarge: false, // 全屏显示
      // videoDetail: {}, // 播放视频的信息
      // isPlaying: false, // 是否播放视频
      map: null,
      resultList: [],
      vehicleDetail: {}, // 尾随车辆详细信息
      marker: {},
      // flvplayerId: 'flv_' + random14(),
      playerData: null,
      queryObj: {}
    }
  },
  created () {
    this.queryObj = {
      plateNo: this.$route.query.plateNo,
      dateStart: this.$route.query.dateStart,
      dateEnd: this.$route.query.dateEnd,
      plateNoTb: this.$route.query.dateStart,
      vehicleClass: this.$route.query.vehicleClass,
      interval: this.$route.query.interval,
      deviceCode: this.$route.query.deviceCode,
      dateStartTb: this.$route.query.dateStartTb
    };
  },
  mounted () {
    this.initMap();
    // this.getVehicleDetail();
    setTimeout(() => {
      this.getDetail();
    }, 500)
  },
  methods: {
    // 跳至新建布控页面
    skipVehicleControlPage () {
      this.$store.commit('setBreadcrumbData', {
        breadcrumbData: [
          {name: '车辆侦查', routerName: 'vehicle'},
          {name: '尾随分析', routerName: 'vehicle_search_ws', query: { ...this.queryObj }},
          { name: '尾随记录', routerName: 'ws_record', query: { ...this.queryObj }},
          { name: '新建布控' }
        ]
      });
      this.$router.push({name: 'control_create', query: { plateNo: this.resultList[0].struVehicleDto.plateNo, imgurl: this.resultList[0].struVehicleDto.storagePath, modelName: '车辆追踪' }});
    },
    // 跳至轨迹分析页面
    skipTrajectoryPage () {
      this.$store.commit('setBreadcrumbData', {
        breadcrumbData: [
          {name: '车辆侦查', routerName: 'vehicle'},
          {name: '尾随分析', routerName: 'vehicle_search_ws', query: { ...this.queryObj }},
          { name: '尾随记录', routerName: 'ws_record', query: { ...this.queryObj }},
          { name: '车辆轨迹' }
        ]
      });
      this.$router.push({name: 'vehicle_analysis_clgj', query: { plateNo: this.resultList[0].struVehicleDto.plateNo }});
    },
    // 跳至落脚点分析页面
    skipFootholdPage () {
      this.$store.commit('setBreadcrumbData', {
        breadcrumbData: [
          {name: '车辆侦查', routerName: 'vehicle'},
          {name: '尾随分析', routerName: 'vehicle_search_ws', query: { ...this.queryObj }},
          { name: '尾随记录', routerName: 'ws_record', query: { ...this.queryObj }},
          { name: '落脚点分析' }
        ]
      });
      this.$router.push({name: 'vehicle_search_ljd', query: { plateNo: this.resultList[0].struVehicleDto.plateNo }});
    },
    // 获取尾随车辆详情
    getDetail () {
      const plateNo = this.$route.query.plateNo;
      const startTime = this.$route.query.dateStart;
      const endTime = this.$route.query.dateEnd;
      const plateNoTb = this.$route.query.plateNoTb;
      const startTimeTb = this.$route.query.dateStartTb;
      const params = {
        plateNo,
        startTime,
        endTime,
        plateNoTb,
        startTimeTb
      };
      getTailBehindDetail(params)
        .then(res => {
          if (res && res.data && res.data.length > 0) {
            console.log('res', res)
            this.resultList = res.data;

            this.mapMark(this.resultList)
          }
        })
    },
    // 初始化地图
    initMap () {
      let _this = this;
      let map = new window.AMap.Map('rightContainerMap', {
        zoom: 14, // 级别
        center: mapXupuxian.center, // 中心点坐标[110.596015, 27.907662]
      });
      map.setMapStyle('amap://styles/whitesmoke');

      _this.map = map;
    },
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    resetZoom () {
      if (this.map) {
        this.map.setZoomAndCenter(18, mapXupuxian.center);
        this.map.setFitView();
      }
    },
    mapMark (data) {
      if (data && data.length > 0) {
        let _this = this, hoverWindow = null, path= [];
        for (let i = 0; i < data.length; i++) {
          
          let obj = data[i];
          if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
            let offSet = [-20.5, -55];
            let _idBtn = 'vlJtcPlayBtn' + obj.struVehicleDto.deviceID;
            let _id = 'vlJtcVideo' + obj.deviceID;

            let iconType, sContent;

            if (i === 0) {
              // iconType = 'vl_icon_04_019';
              sContent = '<div id="vehicle' + obj.deviceID + '"  title="'+ obj.deviceName +'" class="vl_icon vl_icon_04_019"></div>';
            } else if (i === (data.length - 1)) {
              // iconType = 'vl_icon_05_019';
              sContent = '<div id="vehicle' + obj.deviceID + '"  title="'+ obj.deviceName +'" class="vl_icon vl_icon_05_019"></div>';
            } else {
              let name;
              if (!obj.bayonetName) { // 摄像头
                iconType = 0;
                name = obj.deviceName;
              } else { // 卡口
                iconType = 8;
                name = obj.bayonetName;
              }
              sContent = '<div id="vehicle' + obj.deviceID + '"  title="'+ name +'" class="vl_icon vl_icon_map_mark'+ iconType +'"></div>';
            }

            let marker = new window.AMap.Marker({
              map: _this.map,
              position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude],
              offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: '', // 用户自定义属性
              // 自定义点标记覆盖物内容
              content: sContent
            });
  
            path.push(new window.AMap.LngLat(obj.shotPlaceLongitude, obj.shotPlaceLatitude));

            marker.on('mouseover', function () {
              if(i !== 0 && i !== (data.length - 1)) {
                $('#vehicle' + obj.deviceID).addClass('vl_icon_map_hover_mark' + iconType);
              }

              let sContent = "<div class='tip_box'><div class='select_target'><p class='select_p'>查询目标</p>"
                    +"<img src="+ obj.storagePath +" /><div class='mongolia'>"
                    +"<span>"+ obj.shotTime +"</span><i id="+ _id +" class='vl_icon vl_icon_control_09'></i></div></div>"
                    +"<div class='tail_vehicle'><p class='tail_p'>尾随车辆</p><img src="+ obj.struVehicleDto.storagePath +" />"
                    +"<div class='mongolia'><span>"+ obj.struVehicleDto.shotTime +"</span><i id="+ _idBtn +" class='vl_icon vl_icon_control_09'></i></div></div>"
                    +"<div class='divide'></div><div class='device_name'>"+ obj.deviceName +"</div></div>";

                hoverWindow = new window.AMap.InfoWindow({
                  isCustom: true,
                  closeWhenClickMap: true,
                  offset: new window.AMap.Pixel(180, 180), // 相对于基点的偏移位置
                  content: sContent
                });
                hoverWindow.open(_this.map, new window.AMap.LngLat(obj.shotPlaceLongitude, obj.shotPlaceLatitude));

                setTimeout(() => {
                  _this.addListen(_idBtn, obj.struVehicleDto);
                  _this.addListen(_id, obj);
                }, 500);
            });
            marker.on('mouseout', function () {
              if(i !== 0 && i !== (data.length - 1)) {
                $('#vehicle' + obj.deviceID).removeClass('vl_icon_map_hover_mark' + iconType);
              }
            });
            // _this.map.setZoom(13)
            // marker.setPosition([obj.shotPlaceLongitude, obj.shotPlaceLatitude]);
            //  _this.map.setCenter([obj.shotPlaceLongitude, obj.shotPlaceLatitude]);
            // marker.setMap(_this.map);
            //_this.map.setFitView();// 执行定位

          }
          // 绘制线条
          let polyline = new window.AMap.Polyline({
            path: path,
            strokeWeight: 8,
            showDir: true,
            strokeColor: '#61C772',
            strokeStyle: 'solid'
          });

          _this.map.add(polyline);

          _this.map.setFitView();
        }
      }
    },
    // 设置视频数据
    setPlayData () {
      if (this.videoDetail.videoPath) {
        this.playerData = {
          type: 3,
          title: this.videoDetail.deviceName,
          video: {
            uid: new Date().getTime() + '',
            downUrl: this.videoDetail.videoPath
          }
        }
      } else {
        this.playerData = null;
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
      this.setPlayData();
      this.showLarge = true;
    },
    playerClose () {
      this.showLarge = false;
    },
    // 关闭视频
    // closeVideo () {
    //   this.isPlaying = false;
    //   this.showLarge = false;
    //   document.getElementById('controlVideo').pause();
    // },
    // // 播放视频
    // playLargeVideo (val) {
    //    if (val) {
    //     this.isPlaying = true;
    //     document.getElementById('controlVideo').play();
    //     this.handleVideoEnd();
    //   } else {
    //     this.isPlaying = false;
    //     document.getElementById('controlVideo').pause();
    //   }
    // },
    // // 监听视频是否已经播放结束
    // handleVideoEnd () {
    //   let _this = this;
    //   const obj = document.getElementById('controlVideo');
    //   if (obj) {
    //     obj.addEventListener('ended', () => { // 当视频播放结束后触发
    //       _this.isPlaying = false;
    //     });
    //   }
    // },
    // // 截屏
    // playerCut () {
    //   this.cutDialogVisible = true;
    //   this.$nextTick(() => {
    //     let $video = $('#controlVideo');
    //     let $canvas = $('#' + this.flvplayerId + '_cut_canvas');
    //     // console.log($video.width(), $video.height());
    //     if ($canvas && $canvas.length > 0) {
    //       // let w = 920, h = 540;
    //       let w = $video.width(), h = $video.height();
    //       if (w > 920) {
    //         h = Math.floor(920 / w * h);
    //         w = 920;
    //       }
    //       $canvas.attr({
    //         width: w,
    //         height: h,
    //       });
    //       // $video[0].crossOrigin = 'anonymous';
    //       // video canvas 必须为原生对象
    //       let ctx = $canvas[0].getContext('2d');
    //       this.cutTime = new Date().getTime();
    //       ctx.drawImage($video[0], 0, 0, w, h);
    //     }
    //   });
    // },
    // // 截屏保存
    // playerCutSave () {
    //   let $canvas = $('#' + this.flvplayerId + '_cut_canvas');
    //   if ($canvas && $canvas.length > 0) {
    //     console.log('$canvas[0]', $canvas[0])
    //     let img = $canvas[0].toDataURL('image/png');
    //     // img.crossOrigin  = '';
    //     let filename = 'image_' + this.cutTime + '.png';
    //     if('msSaveOrOpenBlob' in navigator){
    //       // 兼容EDGE
    //       let arr = img.split(',');
    //       let mime = arr[0].match(/:(.*?);/)[1];
    //       let bstr = atob(arr[1]);
    //       let n = bstr.length;
    //       let u8arr = new Uint8Array(n);
    //       while (n--) {
    //         u8arr[n] = bstr.charCodeAt(n);
    //       }
    //       let blob = new Blob([u8arr], {type:mime});
    //       window.navigator.msSaveOrOpenBlob(blob, filename);
    //       return;
    //     }
    //     img.replace('image/png', 'image/octet-stream');
    //     let saveLink = $('#' + this.flvplayerId + '_cut_a')[0];
    //     saveLink.href = img;
    //     saveLink.download = filename;
    //     saveLink.click();
    //     // console.log(base64);
    //   }
    // }
  }
}
</script>
<style lang="scss">
.tip_box {
  width: 258px;
  // height: 341px;
  padding: 20px 20px 14px 20px;
  background:rgba(255,255,255,1);
  box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
  .select_target, .tail_vehicle {
    width: 218px;
    height: 122px;
    margin-bottom: 10px;
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
    margin-bottom: 10px;
    border-bottom: 1px solid #F2F2F2;
    box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
  }
  .device_name {
    color: #666666;
  }
}
</style>

<style lang="scss" scoped>
.vc_gcck_bd {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 50px; line-height: 50px;
}
.ws_record {
  height: 100%;
  .content_box {
    display: flex;
    height: 100%;
    padding-top: 50px;
    .left {
      width: 272px;
      height: 100%;
      background-color: #ffffff;
      box-shadow:2px 3px 10px 0px rgba(131,131,131,0.28);
      padding: 20px;
      h2 {
        color: #222222;
        font-weight: bold;
        font-size: 18px;
      }
      .left_ul {
        margin-top: 15px;
        >li {
          line-height: 30px;
          >img {
            width: 120px;
            height: 120px;
          }
          span:first-child {
            color: #666666;
          }
          span:last-child {
            color: #222222;
            img {
              width:60px;
              height:60px;
              border-radius:2px;
              vertical-align: text-top;
            }
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
        height: 60px;
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
          // font-size: 16px;
          text-align: center;
          &:hover {
            background:linear-gradient(90deg,rgba(8,106,234,1) 0%,rgba(4,102,222,1) 100%);
            color: #ffffff;
          }
        }
      }
      #rightContainerMap {
        // z-index: 1000;
        width: 100%;
        height: 100%;
      }
      .map_rrt_u2 {
        position: absolute; right: 30px;
        bottom: 30px;
        margin-top: .2rem;
        font-size: 26px;
        background: #ffffff;
        width: 78px;
        padding: 0 10px;
        > li {
          line-height: 70px;
          text-align: center;
          cursor: pointer;
          border-bottom: 1px solid #F2F2F2;
          > i {
            margin-top: 0;
            display: inline-block;
          }
          color: #999999;
          &:hover {
            color: #0C70F8;
          }
        }
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
  z-index: 1111;
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
