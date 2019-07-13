<template>
  <div class="th-many-peers">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle'}, {name: '多车同行'}]"></div>
    </div>
    <div class="the-bottom">
      <div class="the-left-search">
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
      </div>
      <div class="the-right-result">
        <div id="mapContainer"></div>
        <ul class="top_ul">
          <li v-for="(item, index) in dataList" :key="index">
            <el-radio v-model="radioChecked" @change="handleRadio(index, item.vehicleNumber)" :label="index">{{item.vehicleNumber}}</el-radio>
            <span class="line"></span>
          </li>
        </ul>
        <div class="right_list">
          <div class="top_content">
            <p>
              <i class="vl_icon vl_icon_v11"></i>
              <span>雀园路口右1设备</span>
            </p>
            <p>
              <i class="vl_icon vl_icon_v11"></i>
              <span>长沙市天心区雀园路口</span>
            </p>
            <span class="close_btn">关闭</span>
            <div class="divide"></div>
          </div>
          <ul class="result_ul">
            <vue-scroll>
              <li>
                <p>湘A12345</p>
                <div class="video_box">
                  <img src="../../../../../assets/img/null-content.png" alt="">
                  <div class="video_time">
                    <span>2018-12-12 12:12:12</span>
                    <i class="vl_icon vl_icon_control_09"></i>
                  </div>
                </div>
              </li>
              <li>
                <p>湘A12345</p>
                <div class="video_box">
                  <img src="../../../../../assets/img/null-content.png" alt="">
                  <div class="video_time">
                    <span>2018-12-12 12:12:12</span>
                    <i class="vl_icon vl_icon_control_09"></i>
                  </div>
                </div>
              </li>
              <li>
                <p>湘A12345</p>
                <div class="video_box">
                  <img src="../../../../../assets/img/null-content.png" alt="">
                  <div class="video_time">
                    <span>2018-12-12 12:12:12</span>
                    <i class="vl_icon vl_icon_control_09"></i>
                  </div>
                </div>
              </li>
              <li>
                <p>湘A12345</p>
                <div class="video_box">
                  <img src="../../../../../assets/img/null-content.png" alt="">
                  <div class="video_time">
                    <span>2018-12-12 12:12:12</span>
                    <i class="vl_icon vl_icon_control_09"></i>
                  </div>
                </div>
              </li>
              <li>
                <p>湘A12345</p>
                <div class="video_box">
                  <img src="../../../../../assets/img/null-content.png" alt="">
                  <div class="video_time">
                    <span>2018-12-12 12:12:12</span>
                    <i class="vl_icon vl_icon_control_09"></i>
                  </div>
                </div>
              </li>
              <li>
                <p>湘A12345</p>
                <div class="video_box">
                  <img src="../../../../../assets/img/null-content.png" alt="">
                  <div class="video_time">
                    <span>2018-12-12 12:12:12</span>
                    <i class="vl_icon vl_icon_control_09"></i>
                  </div>
                </div>
              </li>
              <li>
                <p>湘A12345</p>
                <div class="video_box">
                  <img src="../../../../../assets/img/null-content.png" alt="">
                  <div class="video_time">
                    <span>2018-12-12 12:12:12</span>
                    <i class="vl_icon vl_icon_control_09"></i>
                  </div>
                </div>
              </li>
            </vue-scroll>
          </ul>
        </div>
      </div>
    </div>
    <!-- <div class="icon_box">
      <span class="vl_icon vl_icon_map_mark1 mark_span"></span>
      <span class="vl_icon vl_icon_map_hover_mark1 mark__hover_span"></span>
    </div> -->
  </div>
</template>
<script>
import { testData } from './ws/testData.js';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import { formatDate } from "@/utils/util.js";
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
      polylineObj: {}
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
    this.dataList = testData;
    this.initMap();
    console.log(testData)
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
    /**
     * 弹框地图初始化
     */
    initMap (obj) {
      let map = new window.AMap.Map('mapContainer', {
        zoom: 15, // 级别
        center: [110.595111, 27.90289], // 中心点坐标
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.map = map;

      if (testData.length > 0) {
        testData.map((item, index) => {
          this.drawPoint(item.arrList, item.vehicleNumber, testData[0].vehicleNumber);
        })
      }
    },
    /**
     * 地图描点
     */
    drawPoint (data, number, firstNumber) {
      if (data && data.length > 0) {
        let _this = this, hoverWindow = null, path= [];
        for (let i = 0; i < data.length; i++) {
          
          let obj = data[i];

          if (obj.bayonetLongitude > 0 && obj.bayonetLatitude > 0) {
            let offSet = [-20.5, -55], deviceType;
           let className = null;
           if (obj.isAllPassed) { // 全部车辆经过该设备
             if (obj.bayonetId) { // 设备为卡口
               deviceType = 1;
             } else {
               deviceType = 2;
             }
           } else {
             if (obj.bayonetId) { // 设备为卡口
               deviceType = 3;
             } else {
               deviceType = 0;
             }
           }


            let marker = new window.AMap.Marker({
              map: _this.map,
              position: [obj.bayonetLongitude, obj.bayonetLatitude],
              offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: '', // 用户自定义属性
              // 自定义点标记覆盖物内容
              // content: '<div id="vehicle' + obj.bayonetId + '"  title="'+ obj.bayonetName +'" class="vl_icon vl_icon_map_mark' + deviceType + '"></div>'
              content: '<div class="icon_box" id="vehicle '+ obj.bayonetId +'"><span class="vl_icon mark_span vl_icon_map_mark '+ deviceType +'"></span><span class="vl_icon mark__hover_span vl_icon_map_hover_mark '+ deviceType +'"></span></div>'
            });


            path.push(new window.AMap.LngLat(obj.bayonetLongitude, obj.bayonetLatitude));

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
              strokeColor: '#41D459',
            })
          });
          polyline.on('mouseout', function () {
            polyline.setOptions({
              strokeWeight: 8,
              strokeColor: '#D3D3D3',
            })
          });


          _this.polylineObj[number] = polyline;

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
      let arr = [];
      this.filterObj.vehicleNumberList.forEach(item => {
        if (!reg.test(item.vehicleNumber)) {
          this.hasError = true;
        }
        arr.push(item.vehicleNumber)
      });

      if (this.hasError) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('请输入正确的车牌号码');
        }
        return;
      }

      this.filterObj.vehicleNumbers = arr.join('-');

      this.searchLoading = true;

      const params = {
        startDate: formatDate(this.filterObj.startDate),
        endDate: formatDate(this.filterObj.endDate),
        vehicleNumbers: this.filterObj.vehicleNumbers,
        order:"asc",
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      };

      getMultiVehicleList(params)
        .then(res => {
          if (res && res.data) {
            this.pagination.total = res.data.total;
            this.dataList = res.data.list;
            this.searchLoading = false;
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
    }
  }
}
</script>
<style lang="scss" scoped>
// .icon_box {
//   position: relative;
//   .mark_span {
//     position: relative;
//   }
//   .mark__hover_span {
//     position: absolute;
//     left: 0px;
//     top: 0;
//     display: none;
//   }
//   &:hover {
//     .mark_span {
//       display: none;
//     }
//     .mark__hover_span {
//       display: block;
//     }
//   }
// }
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
      width: calc(100% - 285px);  
      height: 100%;
      position: relative;
      #mapContainer {
        height: 100%;
        width: 100%;
      }
      .top_ul {
        background-color: #FFFFFF;
        box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
        position: absolute;
        top: 15px;
        left: 25%;
        display: flex;
        padding: 0 10px;
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
        width:258px;
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
            color: #0869EB;
          }
        }
        .result_ul {
          height: calc(100% - 60px);
          li {
            margin-bottom: 10px;
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
  .reset_btn, .select_btn {
    width: 110px;
  }
}
/deep/.__view {
  padding-right: 10px;
}
</style>


<style lang="scss">
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
