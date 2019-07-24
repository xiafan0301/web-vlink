<template>
  <div class="dctx_box">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle'}, {name: '多车同行'}]"></div>
    </div>
    <div class="content_box">
      <div class="left">
        <el-form class="search_dctx_form" :model="searchForm" ref="searchForm">
          <el-form-item prop="startTime">
            <el-date-picker
              class="vl_date"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
              :picker-options="pickerStart"
              v-model="searchForm.startTime"
              type="datetime"
              @blur="judgeBaseVehicle"
              placeholder="选择日期"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="endTime">
            <el-date-picker
              class="vl_date vl_date_end"
              v-model="searchForm.endTime"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
              @blur="judgeBaseVehicle"
              :picker-options="pickerStart"
              type="datetime" 
              placeholder="选择日期" 
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="timeSlot">
            <el-select v-model="searchForm.timeSlot" placeholder="请选择抓拍间隔" style="width: 100%">
              <el-option
                v-for="item in timeSlotList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="basicVehicleNumber" class="device_code">
            <el-input v-model="searchForm.basicVehicleNumber" placeholder="请输入基准车辆车牌号" @blur="judgeBaseVehicle"></el-input>
            <span class="span_tips" v-show="isShowTip">该基准车辆在该时间内无抓拍数据</span>
          </el-form-item>
          <el-form-item prop="basicVehicleNumber" class="time_slot_input">
            <el-input class="peer_vehicle_number" v-model="searchForm.peerVehicleNumber" :placeholder="[isDisabled ? '已添加7辆车' : '请输入车牌号码']" @keydown.enter.native="keyDownVehicle" :disabled="isDisabled"></el-input>
            <i class="el-icon-circle-plus add-vehicle-number" :style="{color: isDisabled ? '#D3D3D3' : '#0B6FF8'}" @click="onAddVehicleNumber"></i>
          </el-form-item>
          <ul class="peer_ul" v-show="vehicleNumberList.length > 0">
            <li v-for="(item, index) in vehicleNumberList" :key="index">
              <span class="title">同行车{{index + 1}}:</span>
              <span class="number">{{item}}</span>
              <i class="remove_vehicle el-icon-remove" @click="removeVehicle(index)"></i>
            </li>
          </ul>
          <el-form-item>
            <el-button class="reset_btn" @click="resetData">重置</el-button>
            <el-button class="select_btn" type="primary" :loading="isSearchLoading" @click="searchData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <template v-if="resultList && resultList">
          <div class="vehicle_table">
            <div class="basic_vehicle">
              <p>基准车辆：{{resultList && resultList.baseNumber}}</p>
              <p>通过的抓拍设备数：{{resultList && resultList.devNum}}个</p>
            </div>
            <el-table
              :data="resultList && resultList.peerVehiclesInfos"
              >
              <el-table-column
                label="车牌号"
                prop="peerNumber"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="共同通过的设备数（个）"
                prop="peerDevNum"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="同行比例"
                prop="peerPercent"
                show-overflow-tooltip
                >
                <template slot-scope="scope">
                  <span>{{scope.row.peerPercent}}%</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <span class="operation_btn" @click="showMapDialog(scope.row)">查看</span>
                </template>
              </el-table-column>
            </el-table>
          </div>

        </template>
         <template v-else>
          <div is="noResult" :isInitPage="isInitPage"></div>
        </template>
      </div>
    </div>
    <el-dialog
      :visible.sync="mapDialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      class="map_detail_dialog"
      width="1200px"
      >
      <div class="content_map_box">
        <div class="title">
          <span class="el-icon-close" @click="closeMap"></span>
        </div>
        <div class="map_box">
          <div id="mapContainer"></div>
          <!--地图操作按钮-->
          <ul class="map_rrt_u2">
            <li @click="resetZoom"><i class="el-icon-aim"></i></li>
            <li @click="mapZoomSet(1)"><i class="el-icon-plus"></i></li>
            <li @click="mapZoomSet(-1)"><i class="el-icon-minus"></i></li>
          </ul>
          <div class="peer_and_basic_vehicle">
            <div class="vehicle_box">
              <span class="vehicle_span" :class="[isCheckedVehicle === mapPeerVehicleNumber ? 'is_checked' : '']" @click="handleChangeVeNumber(mapPeerVehicleNumber)">{{mapPeerVehicleNumber}}</span>
              与
              <span class="vehicle_span" :class="[isCheckedVehicle === resultList && resultList.baseNumber ? 'is_checked' : '']" @click="handleChangeVeNumber(resultList.baseNumber)">{{resultList && resultList.baseNumber}}</span>
            </div>
            <div class="peer_possiable">
              <span>{{mapPeerPercent}}%</span>同行
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    
  </div>
</template>
<script>
// import { testData } from './ws/testData.js';
import noResult from '@/components/common/noResult.vue';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import { mapXupuxian } from "@/config/config.js";
import { formatDate } from "@/utils/util.js";
import { checkPlateNumber } from '@/utils/validator.js';
import { getMultiVehicleList, getBaseVehicleList } from '@/views/index/api/api.judge.js';
const overStartTime = new Date() - 24 * 60 * 60 * 1000;
// const reg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
export default {
  components: { vlBreadcrumb, noResult },
  data () {
    return {
      isInitPage: true, // 是否是初始化页面
      isShowTip: false,
      isSearchLoading: false,
      isDisabled: false,
      mapDialog: false, // 轨迹地图弹出框
      timeSlotList: [
        {
          label: '1分钟',
          value: 1
        },
        {
          label: '2分钟',
          value: 2
        },
        {
          label: '3分钟',
          value: 3
        },
        {
          label: '5分钟',
          value: 5
        },
        {
          label: '10分钟',
          value: 10
        }
      ], // 抓拍时间间隔数据
      resultList: null,
      // resultList: {
        // baseNumber: '湘S22222',
        // devNum: 300,
        // basePathRecords: [
        //   {
        //     bayonetId: 422,
        //     isAllPassed: false,
        //     bayonetName: '金路大厦',
        //     bayonetAddress: '金路大厦',
        //     bayonetLongitude: 110.596817,
        //     bayonetLatitude: 27.907682,
        //     deviceId: 422,
        //     shotPlaceLongitude: 110.596817,
        //     shotPlaceLatitude: 27.907682,
        //     shotTime: '2019-07-12 12:43:23'
        //   },
        //   {
        //     bayonetId: null,
        //     isAllPassed: false,
        //     bayonetName: '湘运公司小区',
        //     bayonetAddress: '湘运公司小区',
        //     bayonetLongitude: 110.59907,
        //     bayonetLatitude: 27.909275,
        //     deviceId: 43333,
        //     shotPlaceLongitude: 110.59907,
        //     shotPlaceLatitude: 27.909275,
        //     deviceName: '湘运公司小区',
        //     address: '湖南省长沙市天心区创谷产业园湘运公司小区',
        //     shotTime: '2019-05-12 12:43:23'
        //   },
        //   {
        //     bayonetId: null,
        //     isAllPassed: true,
        //     bayonetName: '撒打撒打撒',
        //     bayonetAddress: '撒打撒打撒',
        //     bayonetLongitude: 110.601033,
        //     bayonetLatitude: 27.908337,
        //     deviceId: 4123,
        //     shotPlaceLongitude: 110.601033,
        //     shotPlaceLatitude: 27.908337,
        //     deviceName: '设备1111111',
        //     address: '湖南省长沙市天心区创谷产业园',
        //     shotTime: '2019-03-12 12:43:23'
        //   },
        // ],
        // peerVehicleInfos: [
        //   {
        //     peerNumber: '湘S54321',
        //     peerDevNum: 240,
        //     peerPercent: 80,
        //     ExtendVehicleInfoDto: [
        //       {
        //         uid: 1,
        //         bayonetId: 22,
        //         isAllPassed: false,
        //         bayonetName: '金路大厦',
        //         bayonetAddress: '金路大厦',
        //         bayonetLongitude: 110.593464,
        //         bayonetLatitude: 27.908029,
        //         deviceId: 122,
        //         shotPlaceLongitude: 110.593464,
        //         shotPlaceLatitude: 27.908029,
        //         shotTime: '2019-07-12 23:43:23'
        //       },
        //       {
        //         uid: 2,
        //         bayonetId: 22,
        //         isAllPassed: false,
        //         bayonetName: '金路大厦',
        //         bayonetAddress: '金路大厦',
        //         bayonetLongitude: 110.593464,
        //         bayonetLatitude: 27.908029,
        //         deviceId: 122,
        //         shotPlaceLongitude: 110.593464,
        //         shotPlaceLatitude: 27.908029,
        //         shotTime: '2019-07-24 23:43:23'
        //       },
        //       {
        //         uid: 3,
        //         bayonetId: 22,
        //         isAllPassed: false,
        //         bayonetName: '金路大厦',
        //         bayonetAddress: '金路大厦',
        //         bayonetLongitude: 110.593464,
        //         bayonetLatitude: 27.908029,
        //         deviceId: 122,
        //         shotPlaceLongitude: 110.593464,
        //         shotPlaceLatitude: 27.908029,
        //         shotTime: '2019-01-12 23:43:23'
        //       },
        //       {
        //         uid: 4,
        //         bayonetId: null,
        //         isAllPassed: false,
        //         bayonetName: '湘运公司小区',
        //         bayonetAddress: '湘运公司小区',
        //         bayonetLongitude: 110.590981,
        //         bayonetLatitude: 27.907475,
        //         deviceId: 23333,
        //         shotPlaceLongitude: 110.590981,
        //         shotPlaceLatitude: 27.907475,
        //         deviceName: '湘运公司小区',
        //         address: '湖南省长沙市天心区创谷产业园湘运公司小区',
        //         shotTime: '2019-07-12 19:43:23'
        //       },
        //       {
        //         uid: 5,
        //         bayonetId: null,
        //         isAllPassed: true,
        //         bayonetName: '撒打撒打撒',
        //         bayonetAddress: '撒打撒打撒',
        //         bayonetLongitude: 110.591496,
        //         bayonetLatitude: 27.90901,
        //         deviceId: 123,
        //         shotPlaceLongitude: 110.591496,
        //         shotPlaceLatitude: 27.908029,
        //         deviceName: '设备1111111',
        //         address: '湖南省长沙市天心区创谷产业园',
        //         shotTime: '2019-02-12 12:43:23'
        //       },
        //       {
        //         uid: 6,
        //         bayonetId: 24,
        //         isAllPassed: true,
        //         bayonetName: '趣味请问',
        //         bayonetAddress: '趣味请问',
        //         bayonetLongitude: 110.590165,
        //         bayonetLatitude: 27.909133,
        //         deviceId: 124,
        //         shotPlaceLongitude: 110.590165,
        //         shotPlaceLatitude: 27.909133,
        //         deviceName: '设备2222',
        //         address: '湖南省长沙市天心区创谷产业园22222',
        //         shotTime: '2018-07-12 12:43:23'
        //       }
        //     ]
        //   }
        // ]
      // }, // 结果列表
      map: null, // 地图对象
      searchForm: {
        startTime: new Date(overStartTime),
        endTime: new Date(),
        basicVehicleNumber: null,
        peerVehicleNumber: null,
        timeSlot: 3,
      },
      pickerStart: {
        disabledDate (time) {
          return time.getTime() > (new Date().getTime());
        }
      },
      isCheckedVehicle: -1, //选中的车牌号
      vehicleNumberList: [], // 添加的同行车列表
      polylineObj: {}, // 所有的折线对象
      mapPeerPercent: 0, // 地图上显示的同行比例
      mapPeerVehicleNumber: null, // 地图上显示的同行车牌号
      shotTimesObj: {} // 抓拍时间对象
    }
  },
  mounted () {
  },
  methods: {
    // 基准车辆失焦
    judgeBaseVehicle () {
      if (this.searchForm.basicVehicleNumber) {
        this.getVehicleList();
      }
    },
    // 获取基准车辆的抓拍数据
    getVehicleList () {
      const params = {
        // startTime: formatDate(this.searchForm.startTime),
        // endTime: formatDate(this.searchForm.endTime),
        // baseNumber: this.searchForm.basicVehicleNumber,
        startTime: '2019-07-13 00:54:29',
        endTime: '2019-07-13 23:54:59',
        baseNumber: '湘LYV366',
      };
      getBaseVehicleList(params)
        .then(res => {
          if (res) {
            if (res.data === true) {
              this.isShowTip = false;
            } else  {
              this.isShowTip = true;
            }
          }
        })
    },
    // 按回车添加同行车辆
    keyDownVehicle (e) {
      if (e.keyCode === 13) {
        this.onAddVehicleNumber();
      }
    },
    // 添加同行车辆
    onAddVehicleNumber () {
      const vehicleNumber = this.searchForm.peerVehicleNumber;
      // if (!reg.test(vehicleNumber)) {
      //   if (!document.querySelector('.el-message--info')) {
      //     this.$message.info('请输入正确的车牌号码');
      //   }
      // } else {
        this.searchForm.peerVehicleNumber = null;
        this.vehicleNumberList.push(vehicleNumber);
        if (this.vehicleNumberList.length >= 7) {
          this.isDisabled = true;
          return;
        } else {
          this.isDisabled = false;
        }
      // }
    },
    // 删除添加的同行车辆
    removeVehicle (index) {
      this.isDisabled = false;
      this.vehicleNumberList.splice(index, 1);
    },
    // 显示轨迹地图弹出框
    showMapDialog (obj) {
      this.mapDialog = true;
      this.$nextTick(() => {
        this.initMap(obj);
      })
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
    initMap (obj) {
      let map = new window.AMap.Map('mapContainer', {
        zoom: 18, // 级别
        center: mapXupuxian.center, // 中心点坐标
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.map = map;

      this.$nextTick(() => {
        this.mapPeerVehicleNumber = obj.peerNumber;
        this.mapPeerPercent = obj.peerPercent;
        this.isCheckedVehicle = obj.peerNumber; // 默认选中同行车辆车牌号
        this.drawPoint(obj.pathRecords, obj.peerNumber);
        this.drawPoint(this.resultList.basePathRecords, this.resultList.baseNumber);
      })
    },
    /**
     * 地图描点
     */
    drawPoint (data, number) {
      console.log('data', data)
      if (data && data.length > 0) {
        let _this = this, hoverWindow = null, path= [], shotTime = [], idName;

        for (let i = 0; i < data.length; i++) {

          let obj = data[i];

          if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {

            let offSet = [-20.5, -55], deviceType;

            let longitude = null, latitude = null, detailDeviceName, detailShotAddress;

            if (obj.isAllPassed) { // 全部车辆经过该设备
              deviceType = 17;
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
            
            let idName = obj.deviceId + '_' + number;
            let content;

            if (_this.isCheckedVehicle === number) {
              content = '<div id="'+ idName +'" class="icon_box"><span class="vl_icon mark_span vl_icon_map_mark'+ deviceType +'"></span><span class="vl_icon mark_hover_span vl_icon_map_hover_mark'+ deviceType +'"></span><div class="device_box"><p>设备名称：'+ detailDeviceName +'</p><p>设备地址：'+ detailShotAddress +'</p></div><div class="shot_time_p shot_time_p_'+ number +'"><p>抓拍时间：'+ obj.shotTime +'</p></div></div>';

            } else {
              content = '<div id="'+ idName +'" class="icon_box"><span class="vl_icon mark_span vl_icon_map_mark'+ deviceType +'"></span><span class="vl_icon mark_hover_span vl_icon_map_hover_mark'+ deviceType +'"></span><div class="device_box"><p>设备名称：'+ detailDeviceName +'</p><p>设备地址：'+ detailShotAddress +'</p></div><div class="shot_time_p is_show_time shot_time_p_'+ number +'"><p>抓拍时间：'+ obj.shotTime +'</p></div></div>';
            }
       
            let marker = new window.AMap.Marker({
              map: _this.map,
              position: [longitude, latitude],
              zIndex: obj.isAllPassed ? 100 : 50,
              offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: '', // 用户自定义属性
              // 自定义点标记覆盖物内容
              content: content
            });

            path.push([longitude, latitude]);

          }

        }
        // 绘制线条
        let polyline = new window.AMap.Polyline({
          map: _this.map,
          path: path,
          zIndex: 50,
          showDir: true,
          strokeWeight: 4,
          strokeColor: '#9CC5E7',
          strokeStyle: 'dashed'
        });

        _this.polylineObj[number] = polyline; // 将折线都存储起来

        _this.polylineObj[_this.isCheckedVehicle].setOptions({ //默认高亮显示同行车辆轨迹
          zIndex: 999,
          strokeWeight: 10,
          showDir: true,
          strokeColor: '#41D459',
          strokeStyle: 'solid'
        })


        _this.map.setFitView();
      }
    },
    // 关闭地图
    closeMap () {
      this.mapDialog = false;
      this.map.clearMap();
    },
    // 点击车牌号码高亮显示相对应的轨迹
    handleChangeVeNumber (number) {
      this.isCheckedVehicle = number;
      for(let i in this.polylineObj) {
        if (i === number) {
          $('.shot_time_p_'+ number).css('display', 'block !important');
          $('.shot_time_p_'+ number).removeClass('is_show_time');
          this.polylineObj[i].setOptions({
            zIndex: 999,
            strokeWeight: 10,
            showDir: true,
            strokeColor: '#41D459',
            strokeStyle: 'solid'
          })
        } else {
          $('.shot_time_p_'+ i).css('display', 'none !important');
          $('.shot_time_p_'+ i).addClass('is_show_time');
          this.polylineObj[i].setOptions({
            strokeWeight: 4,
            zIndex: 50,
            strokeColor: '#9CC5E7',
            strokeStyle: 'dashed'
          })
        }
      }
      // }
    },
    // 查询数据
    searchData () {
      this.resultList = null;
      // if (!reg.test(this.searchForm.basicVehicleNumber)) {
      //   if (!document.querySelector('.el-message--info')) {
      //     this.$message.info('请输入正确的车牌号码');
      //   }
      // }
      if (this.vehicleNumberList.length === 0) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('请输入同行车辆车牌号码');
        }
      }
      // console.log(this.searchForm)
      if (this.isShowTip) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('该基准车辆在该时间内无抓拍数据');
        }
      }
      const params = {
        // startTime: '2019-07-13 00:54:29',
        // endTime: '2019-07-13 23:54:59',
        // baseNumber: '湘LYV366',
        // peerNumbers: '湘NF8988,湘NJM910',
        startTime: formatDate(this.searchForm.startTime),
        endTime: formatDate(this.searchForm.endTime),
        baseNumber: this.searchForm.basicVehicleNumber,
        peerNumbers: this.vehicleNumberList.join(','),
        timeSlot: this.searchForm.timeSlot
      };
      // console.log(params)
      getMultiVehicleList(params)
        .then(res => {
          if (res && res.data) {
            this.resultList = res.data;
          } else {
            this.isInitPage = false;
          }
        })
    },
    // 重置数据
    resetData () {
      this.searchForm = {
        startTime: new Date(overStartTime),
        endTime: new Date(),
        basicVehicleNumber: null,
        peerVehicleNumber: null,
        timeSlot: 3,
      };
      this.isDisabled = false;
      this.isInitPage = false;

      this.resultList = null;
      this.vehicleNumberList = [];
    }
  }
}
</script>
<style lang="scss" scoped>
.dctx_box {
  width: 100%;
  height: 100%;
  padding-top: 50px;
  .vc_gcck_bd {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 50px; line-height: 50px;
  }
  .content_box {
    display: flex;
    width: 100%;
    height: 100%;
    .left {
      width: 272px;
      height: 100%;
      background: #fff;
      box-shadow: 5px 0 10px #E5E7E7;
      animation: fadeInLeft .4s ease-out .3s both;
      padding: 20px 15px;
      
    }
    .right {
      width: calc(100% - 287px);
      padding: 20px;
      .vehicle_table {
        box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
        background-color: #fff;
        padding: 20px;
        .basic_vehicle {
          display: flex;
          color: #333333;
          margin-bottom: 20px;
          >p {
            margin-right: 20px;
          }
        }
        .el-table {
          .operation_btn {
            color: #0C70F8;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.search_dctx_form {
  // .el-input__inner:hover,
  // .el-input__inner:focus, .time_slot.is-focus {
  //   border-color: #DCDFE6 !important;
  // }
  // .el-input-group__prepend {
  //   background: #fff;
  //   padding: 0 0 0 5px;
  // }
  // .left-none-border {
  //   .el-input__inner {
  //     border-left: none;
  //   }
  // }
  .device_code {
    .el-form-item__content {
      .span_tips {
        color: #F56C6C;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 100%;
        left: 0;
      }
    }
  }
  .reset_btn, .select_btn {
    width: 110px;
  }
  .time_slot_input {
    width:100%;
    .el-form-item__content {
      .peer_vehicle_number {
        width: 90%;
      }
    }
    .add-vehicle-number {
      position: absolute;
      right: 0;
      top: 10px;
      color: #0B6FF8;
      cursor: pointer;
      vertical-align: text-top;
      font-size: 20px;
    }
  }
  .peer_ul {
    margin-top: -10px;
    padding-left: 10px;
    >li {
      line-height: 30px;
      height: 30px;
      display: flex;
      justify-content: space-between;
      .title {
        color: #999999;
        margin-right: 10px;
        width: 30%;
      }
      .number {
        display: inline-block;
        width: 60%;
        color: #606266;
      }
      .remove_vehicle {
        width: 10%;
        color: #D3D3D3;
        line-height: 30px;
        font-size: 20px;
        cursor: pointer;
        &:hover {
          color: #FF0000;
        }
      }
      &:last-child {
        margin-bottom: 10px;
      }
    }
  }
}
.map_detail_dialog {
  .el-dialog__header {
    height: 30px;
    line-height: 30px;
    padding: 0;
  }
  .el-dialog__body {
    height: 600px;
    padding: 0;
  }
  .el-dialog__header {
    display: none;
  }
  .content_map_box {
    width: 100%;
    height: 600px;
    .title {
      width: 100%;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid rgba(234,234,234,1);
      >span {
        float: right;
        margin-top: 15px;
        margin-right: 15px;
        font-size: 25px;
        cursor: pointer;
      }
    }
    .map_box {
      width: 100%;
      // padding-top: 30px;
      height: calc(100% - 50px);
      position: relative;
      #mapContainer {
        width: 100%;
        height: 100%;
        .icon_box {
          position: relative;
          .device_box {
            background-color: #ffffff;
            color: #666666;
            padding: 10px;
            position: absolute;
            min-width: 200px;
            top: 0;
            left: 55px;
            display: none;
            &:before {
              content: '';
              position: absolute;
              right: 100%;
              bottom: 50%;
              width: 0;
              height: 0;
              border-width: 7px;
              border-style: solid;
              border-color: transparent;
              border-right-width: 10px;
              border-right-color: #fff;
              color: #fff;
            }
          }
          .shot_time_p {
            background-color: #ffffff;
            color: #666666;
            padding: 5px 0 5px 5px;
            top: 15px;
            left: 55px;
            // display: none;
            position: absolute;
            min-width: 230px;
            &:before {
              content: '';
              position: absolute;
              right: 100%;
              bottom: 25%;
              width: 0;
              height: 0;
              /* border-radius: 2%; */
              border-width: 7px;
              border-style: solid;
              border-color: transparent;
              border-right-width: 10px;
              border-right-color: #fff;
              color: #fff;
            }
          }
          .is_show_time {
            display: none;
          }
          .mark_hover_span {
            position: absolute;
            left: 0px;
            top: 0;
            display: none;
          }
          &:hover {
            .mark_span {
              display: none;
            }
            .mark_hover_span, .device_box {
              display: block;
            }
            .shot_time_p {
              display: none;
            }
          }
        }
        .is_vehicle_checked {
          .shot_time_p {
            display: block;
          }
        }
        .not_vehicle_checked {
          .shot_time_p {
            display: none;
          }
        }
      }
      .map_rrt_u2 {
        position: absolute; right: 30px;
        bottom: 20px;
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
      .peer_and_basic_vehicle {
        position: absolute;
        left: 15px;
        top: 15px;
        background:#ffffff;
        padding: 20px;
        box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
        display: flex;
        .vehicle_box {
          color: #666666;
          .vehicle_span {
            display: inline-block;
            width: 92px;
            height: 28px;
            text-align: center;
            line-height: 28px;
            background:rgba(246,248,249,1);
            border:1px solid rgba(211,211,211,1);
            border-radius:4px;
            cursor: pointer;
          }
          .is_checked {
            background:linear-gradient(90deg,rgba(8,106,234,1) 0%,rgba(4,102,222,1) 100%);
            color: #ffffff;
          }
        }
        .peer_possiable {
          margin-left: 10px;
          color: #999999;
          >span {
            margin-right: 5px;
            color: #086AEA;
            font-size: 24px;
            font-weight: bold;
          }
        }
      }
    }
  } 
}
</style>



