<template>
  <div class="th-many-peers">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle'}, {name: '多车同行'}]"></div>
    </div>
    <div class="the-bottom">
      <div class="the-left-search" :class="['left',{hide:hideleft}]">
        <div class="input-box">
          <vue-scroll>
            <div class="input-box-line">
              <p class="title"><span>开</span><span>始</span></p>
              <el-date-picker
                align="right"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
                :picker-options="pickerStart"
                v-model="filterObj.startDate"
                type="datetime"
                placeholder="选择日期"
                >
                </el-date-picker>
            </div>
            <div class="input-box-line">
              <p class="title"><span>结</span><span>束</span></p>
              <el-date-picker
                v-model="filterObj.endDate"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
                @focus="handleEndTime"
                :picker-options="pickerEnd"
                type="datetime" 
                placeholder="选择日期" 
              ></el-date-picker>
            </div>
            <div class="input-box-line" v-for="(item, index) in filterObj.vehicleNumberList" :key="index + 'ssd'">
              <el-input class="left-none-border" v-model="item.vehicleNumber" placeholder="请输入车牌号码" @blur="handleChangeVNumber(item.vehicleNumber)">
                <template slot="prepend">车辆{{ index + 1 }}:</template>
                <i v-if="index > 1" slot="suffix" class="el-input__icon el-icon-remove" @click="onDeleteVehicleNumber(index)"></i>
              </el-input>
            </div>
            <p v-if="filterObj.vehicleNumberList.length < 8" class="add-vehicle-number" @click="onAddVehicleNumber">
              <i class="el-icon-circle-plus"></i>
              添加车辆
            </p>
          </vue-scroll>
        </div>
        <div class="btn-box">
          <el-button class="reset_btn" @click="onReset" :loading="resetLoading">重置</el-button>
          <el-button class="select_btn" type="primary" @click="onSearch" :loading="searchLoading">查询</el-button>
        </div>
        <div class="insetLeft" @click="hideLeft"></div>
      </div>
      <div class="the-right-result" :class="[{hide:!hideleft}]">
        <div id="mapContainer"></div>
        <ul class="top_ul">
          <li v-for="(item, index) in dataList" :key="index">
            <el-radio v-model="radioChecked" @change="handleRadio(index, item.vehicleNumber)" :label="index">车辆{{index + 1}}</el-radio>
            <span class="line"></span>
          </li>
          <!-- <li v-for="(item, index) in dataList" :key="index">
            <el-radio v-model="radioChecked" @change="handleRadio(index, item.vehicleNumber)" :label="index">车辆{{index + 1}}</el-radio>
            <span class="line"></span>
          </li> -->
        </ul>

        <div class="right_list" v-show="isShowRightContent">
          <div class="top_content">
            <p>
              <i class="vl_icon vl_icon_v11"></i>
              <span>{{recordDetail.deviceName}}</span>
            </p>
            <p>
              <i class="vl_icon vl_icon_v11"></i>
              <span>{{recordDetail.shotAddress}}</span>
            </p>
            <span class="close_btn el-icon-close" @click="closeRightBox"></span>
            <div class="divide"></div>
          </div>
          <ul class="result_ul" v-show="recordDetail.recordList.length > 0">
            <vue-scroll>
              <li v-for="(item, index) in recordDetail.recordList" :key="index">
                <p>{{item.plateNo}}</p>
                <div class="video_box">
                  <img :src="item.storagePath" alt="">
                  <div class="video_time">
                    <span>{{item.shotTime}}</span>
                    <i class="vl_icon vl_icon_control_09" @click="openVideo(item)"></i>
                  </div>
                </div>
              </li>
            </vue-scroll>
          </ul>
        </div>
      </div>
    </div>
    <!-- 视频全屏放大 -->
    <div style="width: 0; height: 0;" v-show="showLarge" :class="{vl_j_fullscreen: showLarge}">
      <video id="controlVideo" :src="videoDetail.videoPath" ></video>
      <div @click="closeVideo" class="vl_icon vl_icon_event_23 close_icon"></div>
      <div class="control_bottom">
        <div>{{videoDetail.deviceName}}</div>
        <div>
          <span @click="playLargeVideo(false)" class="vl_icon vl_icon_judge_01" v-show="isPlaying"></span>
          <span @click="playLargeVideo(true)" class="vl_icon vl_icon_control_09" v-show="!isPlaying"></span>
          <span @click="playerCut" class="vl_icon vl_icon_control_07"></span>
          <span><a download="视频" :href="videoDetail.videoPath" target="_blank" class="vl_icon vl_icon_event_26"></a></span>
        </div>
      </div>
    </div>
    <!-- 截屏 dialog -->
    <el-dialog title="截屏" :visible.sync="cutDialogVisible" :center="false" :append-to-body="true" width="1000px">
      <div style="text-align: center; padding-top: 30px;">
        <canvas :id="flvplayerId + '_cut_canvas'"></canvas>
      </div>
      <div slot="footer" class="dialog-footer" style="padding: 0 0 20px 0;">
        <el-button  @click="cutDialogVisible = false">取 消</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button  type="priamry" @click="playerCutSave">保 存</el-button>
        <a :id="flvplayerId + '_cut_a'" style="display: none;">保存</a>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { testData } from './ws/testData.js';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import { formatDate, random14 } from "@/utils/util.js";
import { checkPlateNumber } from '@/utils/validator.js';
import { getMultiVehicleList } from '@/views/index/api/api.judge.js';
const overStartTime = new Date() - 24 * 60 * 60 *1000;
const reg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
export default {
  components: {
    vlBreadcrumb
  },
  data () {
    return {
      cutDialogVisible: false, // 截屏弹出框
      showLarge: false, // 全屏显示
      videoDetail: {}, // 播放视频的信息
      isPlaying: false, // 是否播放视频
      flvplayerId: 'flv_' + random14(),
      isShowRightContent: false, // 是否显示右侧抓拍详情
      radioChecked: -1,
      pickerStart: {
        disabledDate (time) {
          return time.getTime() > (new Date().getTime());
        }
      },
      pickerEnd: {},
      pagination: {
        pageNum: 1,
        pageSize: 15,
        total: 0
      },
      /* 抓拍记录页面参数 */
      strucDetailDialog: false, // 抓拍记录弹窗
      strucCurTab: 1, // 抓拍记录弹窗tab
      curImgIndex: 0, // 当前选择的图片index
      // strucInfoList: [],
      sturcDetail: {},
      vehicleList: [], // 同行车辆
      bResize: {},
      markerPoint: null, // 地图icon
      newMarker: null,
      playUrl: {},
      videoUrl: null, // 下载地址
      map: null,
      filterObj: {
        startDate: new Date(overStartTime),
        endDate: new Date(),
        vehicleNumberList: [
          {vehicleNumber: ''},
          {vehicleNumber: ''},
        ],
        // vehicleNumberList: [
        //   {vehicleNumber: '沪D008CP'},
        //   {vehicleNumber: '沪A009CP'},
        // ],
        vehicleNumbers: null
      },
      resetLoading: false,
      searchLoading: false,
      dataList: [], // 查询结果列表数据
      hasError: false, // 是否符合查询条件
      playing: false, // 视频播放是否
      polylineList: [], // 折线数组
      polylineObj: {},
      reselt: false,
      hideleft: false,
      recordDetail: { // 右侧抓拍的详情
        deviceName: null,
        shotAddress: null,
        recordList : []
      },
      currentSelectPolyline: null
    }
  },
  watch: {
    'filterObj.startDate' () {
      let _this = this;
      const threeDays = 2 * 3600 * 24 * 1000;
      const endTime = new Date(_this.filterObj.startDate).getTime() + threeDays;
      _this.filterObj.endDate = formatDate(endTime);
    }
  },
  mounted () {
    this.initMap();
    this.onSearch();
  },
  methods: {
    hideLeft() {
      this.hideleft = !this.hideleft;
    },
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
    /**
     * 弹框地图初始化
     */
    initMap (obj) {
      let map = new window.AMap.Map('mapContainer', {
        zoom: 18, // 级别
        center: [110.595111, 27.90289], // 中心点坐标
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.map = map;

      // if (this.dataList.length > 0) {
      //   this.dataList.map((item, index) => {
      //     this.drawPoint(item.arrList, item.vehicleNumber, testData[0].vehicleNumber);
      //   })
      // }
    },
    /**
     * 地图描点
     */
    drawPoint (data, number, recordObj) {
      if (data && data.length > 0) {
        let _this = this, hoverWindow = null, path= [];

        _this.map.setCenter([data[0].shotPlaceLongitude, data[0].shotPlaceLatitude])

        for (let i = 0; i < data.length; i++) {

          let obj = data[i];

          if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
            let offSet = [-20.5, -55], deviceType;

            let longitude = null, latitude = null, detailDeviceName, detailShotAddress;

           if (obj.isAllPassed) { // 全部车辆经过该设备
             if (obj.bayonetId) { // 设备为卡口
               deviceType = 1;
             } else {
               deviceType = 7;
             }
           } else {
             if (obj.bayonetId) { // 设备为卡口
               deviceType = 8;
             } else {
               deviceType = 0;
             }
           }

            if (obj.bayonetId) { // 设备为卡口
              longitude = obj.bayonetLongitude;
              latitude = obj.bayonetLatitude;

              detailDeviceName = obj.bayonetName;
              detailShotAddress = obj.bayonetAddress;

            } else { // 设备为摄像头
              longitude = obj.shotPlaceLongitude;
              latitude = obj.shotPlaceLatitude;

              detailDeviceName = obj.deviceName;
              detailShotAddress = obj.address;

            }
            let idName = obj.deviceID + '_' + number;

            let marker = new window.AMap.Marker({
              map: _this.map,
              position: [longitude, latitude],
              offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: '', // 用户自定义属性
              // 自定义点标记覆盖物内容
              content: '<div id="vehicle_mark'+ idName +'" class="icon_box no_checked"><span class="vl_icon mark_span vl_icon_map_mark'+ deviceType +'"></span><span class="vl_icon mark_hover_span vl_icon_map_hover_mark'+ deviceType +'"></span></div>'
            });

             
            marker.on('click', function () {

              $('.icon_box').removeClass('is_checked');
              $('.icon_box').addClass('no_checked');

              $('#vehicle_mark' + idName).removeClass('no_checked');
              $('#vehicle_mark' + idName).addClass('is_checked');
              

              _this.recordDetail.recordList = [];
              _this.isShowRightContent = true;
              _this.recordDetail.deviceName = detailDeviceName;
              _this.recordDetail.shotAddress = detailShotAddress;

              if (recordObj) {
                for (let i in recordObj) {
                  if (obj.deviceID === i) {
                    recordObj[i].map(item => {
                      _this.recordDetail.recordList.push(item);
                    })
                  }
                }
              }
            })

            path.push(new window.AMap.LngLat(longitude, latitude));

            _this.map.setZoom(13);
            _this.map.setCenter([longitude, latitude]);
          }
          // 绘制线条
          let polyline = new window.AMap.Polyline({
            path: path,
            showDir: true,
            strokeWeight: 8,
            strokeColor: '#D3D3D3',
            strokeStyle: 'solid'
          });

          polyline.on('mouseover', function () {
            polyline.setOptions({
              strokeWeight: 10,
              // extData: {
              //   title: number
              // },
              strokeColor: '#41D459',
            })
          });
        
          polyline.on('mouseout', function () {
            if (_this.currentSelectPolyline !== number) { // 当前选中的折线鼠标移开不消失选中的效果
              polyline.setOptions({
                strokeWeight: 8,
                strokeColor: '#D3D3D3',
              })
            }
          });


          _this.polylineObj[number] = polyline; // 将折线都存储起来

          _this.map.add(polyline);

        }
      }
    },
    // 结束时间change
    handleEndTime (time) {
      let _this = this;
      const startDate = new Date(_this.filterObj.startDate).getTime();
      _this.pickerEnd = {
        disabledDate (time) {
         return time.getTime() < (startDate - 8.64e7) || time.getTime() > ((startDate + 2 * 3600 * 24 * 1000) - 8.64e6);
        }
      }
    },
    /**
     * 新增车牌
     */
    onAddVehicleNumber () {
      this.$set(this.filterObj.vehicleNumberList, this.filterObj.vehicleNumberList.length, {vehicleNumber: ''});
    },
    /**
     * 删除车牌
     */
    onDeleteVehicleNumber (i) {
      this.filterObj.vehicleNumberList.splice(i, 1);
    },
    // 车牌号change
    handleChangeVNumber (number) {
      if (number) {
        if (!reg.test(number)) {
          this.hasError = true;
          if (!document.querySelector('.el-message--info')) {
            this.$message.info('请输入正确的车牌号码');
          }
        } else {
          this.hasError = false;
        }
      } else {
        this.hasError = true;
      }
    },
    /**
     * 重置按钮
     */
    onReset () {
      this.resetLoading = true;
      let obj = {
        startDate: new Date(overStartTime),
        endDate: new Date(),
        vehicleNumberList: [
          {vehicleNumber: ''},
          {vehicleNumber: ''},
        ],
        vehicleNumbers: null
      };
      this.filterObj = Object.assign({}, obj);
      this.resetLoading = false;
    },
    /**
     * 查询按钮
     */
    onSearch () {
      // let arr = [];
      // this.filterObj.vehicleNumberList.forEach(item => {
      //   if (!reg.test(item.vehicleNumber)) {
      //     this.hasError = true;
      //   }
      //   arr.push(item.vehicleNumber)
      // });

      // if (this.hasError) {
      //   if (!document.querySelector('.el-message--info')) {
      //     this.$message.info('请输入正确的车牌号码');
      //   }
      //   return;
      // }

      // this.filterObj.vehicleNumbers = arr.join(',');

      // this.searchLoading = true;

      const params = {
        startTime: formatDate(this.filterObj.startDate),
        endTime: formatDate(this.filterObj.endDate),
        vehicleNumbers: this.filterObj.vehicleNumbers,
        // startTime: '2019-07-13 00:00:00',
        // endTime: '2019-07-13 13:59:59',
        // vehicleNumbers: "湘LYV366,湘NF8988,湘NJM910,湘NJY056",
        order:"asc",
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      };

      getMultiVehicleList(params)
        .then(res => {
          if (res && res.data) {
            this.pagination.total = res.data.total;
            this.searchLoading = false;
            this.dataList = res.data;

            this.dataList.map(item => {
              this.drawPoint(item.shotRecords, item.vehicleNumber, item.deviceShotRecords);
            })
          } else {
            this.searchLoading = false;
          }
        })
        .catch(() => {this.searchLoading = false;})
    },
    // 车辆单选框change
    handleRadio (index, number) {
      this.radioChecked = index;
      for (let i in this.polylineObj) {
        if (number === i ) {
          this.currentSelectPolyline = i; // 当前选中的车辆
          this.polylineObj[i].setOptions({
            strokeWeight: 10,
            strokeColor: '#41D459',
          })
        } else {
          this.polylineObj[i].setOptions({
            strokeWeight: 8,
            strokeColor: '#D3D3D3',
          })
        }
      }
    },
    // 关闭右侧弹出框
    closeRightBox () {
      this.isShowRightContent = false;
      this.recordDetail = {
        deviceName: null,
        shotAddress: null,
        recordList: []
      };
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
    playerCut () {
      this.cutDialogVisible = true;
      this.$nextTick(() => {
        let $video = $('#controlVideo');
        let $canvas = $('#' + this.flvplayerId + '_cut_canvas');
        // console.log($video.width(), $video.height());
        if ($canvas && $canvas.length > 0) {
          // let w = 920, h = 540;
          let w = $video.width(), h = $video.height();
          if (w > 920) {
            h = Math.floor(920 / w * h);
            w = 920;
          }
          $canvas.attr({
            width: w,
            height: h,
          });
          // $video[0].crossOrigin = 'anonymous';
          // video canvas 必须为原生对象
          let ctx = $canvas[0].getContext('2d');
          this.cutTime = new Date().getTime();
          ctx.drawImage($video[0], 0, 0, w, h);
        }
      });
    },
    // 截屏保存
    playerCutSave () {
      let $canvas = $('#' + this.flvplayerId + '_cut_canvas');
      if ($canvas && $canvas.length > 0) {
        console.log('$canvas[0]', $canvas[0])
        let img = $canvas[0].toDataURL('image/png');
        // img.crossOrigin  = '';
        let filename = 'image_' + this.cutTime + '.png';
        if('msSaveOrOpenBlob' in navigator){
          // 兼容EDGE
          let arr = img.split(',');
          let mime = arr[0].match(/:(.*?);/)[1];
          let bstr = atob(arr[1]);
          let n = bstr.length;
          let u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          let blob = new Blob([u8arr], {type:mime});
          window.navigator.msSaveOrOpenBlob(blob, filename);
          return;
        }
        img.replace('image/png', 'image/octet-stream');
        let saveLink = $('#' + this.flvplayerId + '_cut_a')[0];
        saveLink.href = img;
        saveLink.download = filename;
        saveLink.click();
        // console.log(base64);
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.vc_gcck_bd {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 50px; line-height: 50px;
}
.th-many-peers {
  width: 100%; height: 100%;
  padding-top: 50px;
  .the-bottom {
    width: 100%;
    height: 100%;
    // height: calc(100% - 60px);
    display: flex;
    position: relative;
    .the-left-search {
      width: 272px;height: 100%;
      background: #fff;
      box-shadow: 5px 0 10px #E5E7E7;
      animation: fadeInLeft .4s ease-out .3s both;
      padding: 20px 0 20px 15px;
      position: relative;
      .input-box {
        width: 100%;
        height: calc(100% - 50px);
        overflow: hidden;
        .input-box-line {
          display: flex;
          padding-bottom: 12px;
          padding-right: 15px;
          .title {
            display: flex;
            flex-direction: column;
            color: #909399;
            width: 20px;
          }
        }
        .add-vehicle-number {
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #909399;
          cursor: pointer;
          i {
            font-size: 20px;
            vertical-align: text-top;
          }
        }
      }
    }
    .the-right-result {
      height: 100%;
      position: relative;
      #mapContainer {
        height: 100%;
        width: 100%;
      }
      .top_ul {
        width: auto;
        box-shadow: 0px 12px 14px 0px rgba(148,148,148,0.4);
        position: absolute;
        top: 15px;
        left: 20px;
        // margin-left: -25%;
        display: flex;
        padding: 0 10px;
        background-color: #FFFFFF;
        >li {
          height: 48px;
          align-items: center;
          display: flex;
          /deep/ .el-radio {
            margin-right: 0;
          }
          /deep/ .is-checked {
            color: #333333;
          }
          .line {
            color: #999999;
            width: 1px;
            height: 32px;
            display: inline-block;
            background-color: #F2F2F2;
            margin: 0 10px;
          }
          &:last-child {
            .line {
              display: none;
            }
          }
        }
      }
      .right_list {
        position: absolute;
        right: 0;
        top: 15px;
        width: 258px;
        height: calc(100% - 30px);
        background-color: #FFFFFF;
        padding: 15px 10px 0 10px;
        color: #333333;
        box-shadow: 0px 12px 14px 0px rgba(148,148,148,0.4);
        .top_content {
          position: relative;
          >p {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            i {
              margin-right: 5px;
            }
          }
          .divide {
            margin: 10px 0;
            background-color: #F2F2F2;
            height: 1px;
            box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
          }
          .close_btn {
            position: absolute;
            right: 0;
            top: 0;
            cursor: pointer;
            font-size: 20px;
            color: #999999;
          }
        }
        .result_ul {
          height: calc(100% - 60px);
          li {
            margin-bottom: 10px;
            &:last-child {
              margin-bottom: 0;
            }
            >p {
              color: #333333;
              font-size: 12px;
              font-weight: 600;
            }
            .video_box {
              margin-top: 10px;
              height: 122px;
              width: 100%;
              position: relative;
              >img {
                width: 100%;
                height: 100%;
                border: 1px solid #000;
                cursor: pointer;
              }
              .video_time {
                width: 100%;
                position: absolute;
                height: 30px;
                bottom: 0;
                display: flex;
                align-items: center;
                color: #fff;
                justify-content: space-between;
                background-color: #000;
                opacity: 0.7;
                >span {
                  margin-left: 10px;
                }
                i {
                  margin-right: 5px;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
  }
  .the-right-result {
    width: 100%;  
  }
  .the-right-result.hide {
    width: calc(100% - 285px);
    // height: calc(100% - 54px);
    // float: right;
  }
  .left.hide {
    margin-left: -272px;
    transition: marginLeft 0.3s ease-in;
    position: relative;
    z-index: 2;
    // animation: fadeOutLeft 0.4s ease-out 0.3s both;
  }
  .left {
    position: relative;
    width: 272px;
    height: calc(100% - 54px);
    background-color: #ffffff;
    float: left;
    z-index: 1;
    margin-left: 0px;
    box-shadow: 4px 0px 10px 0px #838383;
    box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
    animation: fadeInLeft 0.4s ease-out 0.3s both;
    transition: marginLeft 0.3s ease-in;
    .plane {
      padding: 10px;
      position: relative;
      height: 100%;
    }
    .line40 {
      line-height: 40px;
    }
    .inset {
      display: inline-block;
      line-height: 40px;
      font-style: normal;
    }
    .firstItem {
      margin-bottom: 5px;
    }
  }
  .insetLeft{
    position: absolute;
    right: -28px;
    width: 25px;
    height: 178px;
    top: 50%;
    margin-top: -89px;
    display: inline-block;
    background-repeat: no-repeat;
    transform: rotate(180deg);
    background-image: url(../../../../../assets/img/icons.png);
    background-position: -380px -1269px;
    cursor: pointer;
  }
  .hide {
    .insetLeft {
      transform: rotate(180deg);
      background-position: -504px -1269px;
    }
    .insetLeft:hover{
      transform: rotate(180deg);
      background-position: -440px -1269px;
    }
    
  }
  .insetLeft:hover {
    position: absolute;
    right: -28px;
    width: 28px;
    height: 178px;
    top: 50%;
    margin-top: -89px;
    display: inline-block;
    background-repeat: no-repeat;
    transform: rotate(180deg);
    background-image: url(../../../../../assets/img/icons.png);
    background-position: -318px -1269px;
    cursor: pointer;
  }
  .reset_btn, .select_btn {
    width: 110px;
  }
}
/deep/.__view {
  padding-right: 10px;
}
@media screen and (max-width: 1439px) { // 小屏幕
  .top_ul {
    left: 20px;
  }
}
@media screen and (min-width: 1440px) { // 大屏幕
  .top_ul {
    // left: 40%;
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


<style lang="scss">
#mapContainer {
  .is_checked {
    .mark_hover_span {
      display: block;
    }
    .mark_span {
      display: none;
    }
  }
  .no_checked {
    .mark_hover_span {
      display: none;
    }
    .mark_span {
      display: block;
    }
  }
  .icon_box {
    width: 43px;
    height: 68px;
    position: relative;
    
    .mark_span {
      width: 100%;
      height: 100%;
    }
    .mark_hover_span {
      position: absolute;
      left: 0px;
      top: 0;
      // display: none;
    }
  }
}
.cap_info_win {
  background: #FFFFFF;
  padding: .18rem;
  font-size: .14rem;
  color: #666666;
  position: relative;
  margin-bottom: -15px;
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
