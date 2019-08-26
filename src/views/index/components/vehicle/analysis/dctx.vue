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
              :time-arrow-control="true"
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
              :time-arrow-control="true"
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
          <el-form-item class="operation_button">
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
                  <span>{{scope.row.peerPercent * 100 }}%</span>
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
              <span class="vehicle_span" :class="{'is_checked': isCheckedVehicle === 0}" @click="handleChangeVeNumber(0)">{{mapLocationList.length > 0 && mapLocationList[0].number}}</span>
              与
              <span class="vehicle_span" :class="{'is_checked': isCheckedVehicle === 1}" @click="handleChangeVeNumber(1)">{{mapLocationList.length > 0 && mapLocationList[1].number}}</span>
            </div>
            <div class="peer_possiable">
              <span>{{mapPeerPercent * 100}}%</span>同行
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import noResult from '@/components/common/noResult.vue';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import { mapXupuxian } from "@/config/config.js";
import { formatDate, objDeepCopy, dateOrigin } from "@/utils/util.js";
// import { checkPlateNumber } from '@/utils/validator.js';
import { getMultiVehicleList, getBaseVehicleList } from '@/views/index/api/api.judge.js';
const overStartTime = new Date() - 24 * 60 * 60 * 1000;
let reg = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/;
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
      map: null, // 地图对象
      searchForm: {
        startTime: dateOrigin(false, new Date(overStartTime)),
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
      isCheckedVehicle: 0, //选中的车牌号
      vehicleNumberList: [], // 添加的同行车列表
      polylineObj: {}, // 所有的折线对象
      mapPeerPercent: 0, // 地图上显示的同行比例
      mapPeerVehicleNumber: null, // 地图上显示的同行车牌号
      shotTimesObj: {}, // 抓拍时间对象
      mapLocationList: [], /// 地图上要显示轨迹路线数据
      peerVehicleList: [], // 同行车辆轨迹数据
      baseVehicleList: [], // 基准车辆的轨迹数据
    }
  },
  mounted () {
    // this.initMap();
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
        startTime: formatDate(this.searchForm.startTime),
        endTime: formatDate(this.searchForm.endTime),
        baseNumber: this.searchForm.basicVehicleNumber,
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
        if (this.searchForm.peerVehicleNumber) {
          this.onAddVehicleNumber();
        }
      }
    },
    // 添加同行车辆
    onAddVehicleNumber () {
      const vehicleNumber = this.searchForm.peerVehicleNumber.trim();
      if (!reg.test(vehicleNumber)) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('请输入正确的车牌号码');
        }
      } else {
        if (vehicleNumber) {
          this.searchForm.peerVehicleNumber = null;
          this.vehicleNumberList.push(vehicleNumber);
          if (this.vehicleNumberList.length >= 7) {
            this.isDisabled = true;
            return;
          } else {
            this.isDisabled = false;
          }
        }
      }
    },
    // 删除添加的同行车辆
    removeVehicle (index) {
      this.isDisabled = false;
      this.vehicleNumberList.splice(index, 1);
    },
    // 显示轨迹地图弹出框
    showMapDialog (obj) {
      this.mapLocationList = [];

      this.mapDialog = true;

      this.mapPeerVehicleNumber = obj.peerNumber;
      this.mapPeerPercent = obj.peerPercent;
      // this.isCheckedVehicle = obj.peerNumber; // 默认选中同行车辆车牌号

      const peerObj = {
        number: obj.peerNumber,
        pathRecords: obj.pathRecords && obj.pathRecords.length > 0 ?  obj.pathRecords : []
      };
      this.mapLocationList.push(peerObj);

      const baseObj = {
        number: this.resultList.baseNumber,
        pathRecords: this.resultList.basePathRecords && this.resultList.basePathRecords.length > 0 ? this.resultList.basePathRecords : []
      };
      this.mapLocationList.push(baseObj);

      this.mapLocationList = objDeepCopy(this.mapLocationList);

      this.$nextTick(() => {
        this.initMap();
      });

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
    initMap () {
      let map = new window.AMap.Map('mapContainer', {
        zoom: 18, // 级别
        center: mapXupuxian.center, // 中心点坐标
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.map = map;

      this.filterData();

    },
    filterData () {
      let _arr = [];
      let deviceList = objDeepCopy(this.mapLocationList);
      if (deviceList.length > 0) {
        // console.log('mapLocationList', this.mapLocationList)
        deviceList.forEach((item, index) => {
          if (item.pathRecords && item.pathRecords.length > 0) {
            item.pathRecords.forEach(a => {
              // console.log('aaaa', a)
              // 判断同一个卡口是否出现多次，，若出现，则只显示一个卡口
              if (a.bayonetName) {
                a.deviceID = a.bayonetName;
              }
              // 是否显示抓拍时间
              if (index === this.isCheckedVehicle) {
                a['showTime'] = true;
              } else {
                a['showTime'] = false;
              }
  
              if (a.isPeer) { // 全部车辆经过该设备
                a['deviceType'] = 17;
              } else {
                if (a.bayonetId) { // 设备为卡口
                  a['deviceType'] = 8;
                } else {
                  a['deviceType'] = 0;
                }
              }
  
              if (a.bayonetId) { // 设备为卡口
  
                a['detailDeviceName'] = a.bayonetName;
                a['detailShotAddress'] = a.bayonetAddress;
  
              } else { // 设备为摄像头
  
                a['detailDeviceName'] = a.deviceName;
                a['detailShotAddress'] = a.address;
  
              }
  
              let _i = _arr.findIndex(y => y.deviceID === a.deviceID);
              if (_i === -1) {
                _arr.push(a);
              } else {
                if (this.isCheckedVehicle === index) { // 选中的轨迹
                  // 判断是否重复出现在同一个设备点
                  if (a.peerNumber === _arr[_i].plateNo) {
                    _arr[_i]['shotTime'] += ',' + a.shotTime;
                  } else {
                    a['simLength'] += 1;
                    _arr.splice(_i, 1, a);
                  }
                } else {
                  if (a.plateNo === _arr[_i].plateNo) {
                    _arr[_i]['shotTime'] += ',' + a.shotTime;
                  } else {
                    _arr[_i]['simLength'] += 1;
                  }
                }
              }
            });
          }
        });
        let currArr = _arr;
        this.drawPoint(currArr);
      }
    },
    /**
     * 地图描点
     */
    drawPoint (data) {
      // console.log('data', data)
      if (data && data.length > 0) {

        let _this = this;

        for (let i = 0; i < data.length; i++) {
          let obj = data[i];

          if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {

            let offSet = [-20.5, -50];

            let $id = 'mapMark' + obj.deviceType + obj.uid;
            let _time = '', isStartEnd = false;
            if (obj.showTime) {
              _time = '<p class="shot_time_p">';
              obj.shotTime.split(',').forEach(j => {
                _time += `<span>抓拍时间:${j}</span>`
              })
              _time += '</p>';
            }


            let  content = `<div id="${$id}" class="icon_box vl_icon vl_icon_map_mark`+ obj.deviceType + `">`+
                `<div class="device_box"><p>设备名称：`+ obj.detailDeviceName +`</p>`+
                `<p>设备地址：`+ obj.detailShotAddress +`</p></div>`+ _time +`</div>`;

            // 判断是不是起止点

            let curList = _this.mapLocationList[_this.isCheckedVehicle].pathRecords;
            if (curList.length > 0) {
              if (obj.deviceID === curList[curList.length - 1].deviceID) {
  
                 content = '<div id="'+ $id +'" class="icon_box vl_icon vl_icon_map_mark_start">'+
                    '<div class="device_box"><p>设备名称：'+ obj.detailDeviceName +'</p>'+
                    '<p>设备地址：'+ obj.detailShotAddress +'</p></div>'+ _time +'</div>';
  
                isStartEnd = true;
              }
              if (obj.deviceID === curList[0].deviceID) {
  
                content = '<div id="'+ $id +'" class="icon_box vl_icon mark_span vl_icon_map_mark_end">'+
                    '<div class="device_box"><p>设备名称：'+ obj.detailDeviceName +'</p>'+
                    '<p>设备地址：'+ obj.detailShotAddress +'</p></div>'+ _time +'</div>';
                    
                isStartEnd = true;
              }
            }
            let marker = new window.AMap.Marker({
              map: _this.map,
              position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude],
              zIndex: obj.isAllPassed ? 100 : 50,
              offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: '', // 用户自定义属性
              // 自定义点标记覆盖物内容
              content: content
            });
            marker.on('mouseover', function () {
              if (!isStartEnd) {
                $('#' + $id).addClass('vl_icon_map_hover_mark' + obj.deviceType);
              }
              $('#' + $id).addClass('is_hover');
            })
            marker.on('mouseout', function () {
              if (!isStartEnd) {
                $('#' + $id).removeClass('vl_icon_map_hover_mark' + obj.deviceType);
              }
              $('#' + $id).removeClass('is_hover');
            })

          }
        }

        _this.drawLine();

        _this.map.setFitView();
      }
    },
    drawLine () {
      this.mapLocationList.forEach((x, index)  => {
        let path = [];
        if (x.pathRecords.length > 0) {
          x.pathRecords.forEach(y => {
            let _path = [y.shotPlaceLongitude, y.shotPlaceLatitude];
            path.push(_path);
          })
          var polyline = new window.AMap.Polyline({
            map: this.map,
            path: path,
            zIndex: this.isCheckedVehicle === index ? 999 : 50,
            showDir: true,
            strokeWeight: this.isCheckedVehicle === index ? 10 : 4,
            strokeColor: this.isCheckedVehicle === index ? '#41D459' : '#9CC5E7',
            strokeStyle: this.isCheckedVehicle === index ? 'solid' : 'dashed',
            extData: index
          });
  
          this.map.add([polyline]);
          }
        })
       
    }, // 画线
    // 关闭地图
    closeMap () {
      this.mapDialog = false;
      this.map.clearMap();
    },
    // 点击车牌号码高亮显示相对应的轨迹
    handleChangeVeNumber (index) {
      this.map.clearMap();

      this.isCheckedVehicle = index;

      this.filterData();
      this.drawLine();

    },
    // 查询数据
    searchData () {
      let vehicleNumberList = JSON.parse(JSON.stringify(this.vehicleNumberList));
      if (!this.searchForm.basicVehicleNumber) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('请输入基准车辆的车牌号码');
        }
        return;
      }
      if (this.isShowTip) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('该基准车辆在该时间内无抓拍数据');
        }
        return;
      }
      if (this.vehicleNumberList.length === 0 && !this.searchForm.peerVehicleNumber) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('请输入同行车辆车牌号码');
        }
        return;
      }
      
      if (this.searchForm.peerVehicleNumber) {
        vehicleNumberList.push(this.searchForm.peerVehicleNumber.trim());
      }
      vehicleNumberList.map(item => {
        if (item === this.searchForm.basicVehicleNumber) {
          if (!document.querySelector('.el-message--info')) {
            this.$message.info('同行车辆车牌号不能和基准车辆车牌号一致');
          }
          return;
        }
      });
      const params = {
        startTime: formatDate(this.searchForm.startTime),
        endTime: formatDate(this.searchForm.endTime),
        baseNumber: this.searchForm.basicVehicleNumber.trim(),
        peerNumbers: vehicleNumberList.join(','),
        //  baseNumber: '湘A5Y79T',
        // peerNumbers: '湘A754MY, 粤TQE512',
        timeSlot: this.searchForm.timeSlot
      };
      this.isSearchLoading = true;
      getMultiVehicleList(params)
        .then(res => {
          if (res && res.data) {
            this.resultList = res.data;
            this.isSearchLoading = false;

          } else {
            this.resultList = null;
            this.isSearchLoading = false;
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
      this.isShowTip = false;

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
  .el-form-item {
    margin-bottom: 10px;
  }
  .operation_button {
    margin-top: 20px;
  }
  .device_code {
    /deep/.el-form-item__content {
      line-height: 20px;
      .span_tips {
        color: #F56C6C;
        font-size: 12px;
        line-height: 10px;
        // padding-top: 4px;
        position: static;
        // top: 100%;
        // left: 0;
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
        .is_hover {
          .device_box {
            display: block !important;
          }
          .shot_time_p {
            display: none !important;
          }
        }
        .icon_box {
          // width: 47px;
          position: relative;
          .device_box {
            background-color: #ffffff;
            color: #666666;
            padding: 10px;
            position: absolute;
            min-width: 200px;
            top: 0;
            left: 70px;
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
            position: absolute;
            top: 10px;
            left: 98%;
            width: 190px;
            word-break: keep-all;
            font-size: 12px;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.4);
            border-radius: 2px;
            padding: 5px;
          }
          // .is_show_time {
          //   display: none;
          // }
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



