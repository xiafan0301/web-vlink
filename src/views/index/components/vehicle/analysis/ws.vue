<template>
  <div class="tail_analysis">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle'}, {name: '尾随分析'}]"></div>
    </div>
    <div class="content_box">
      <div class="left">
        <el-form class="left_form" :model="searchForm" ref="searchForm" :rules="rules">
          <el-form-item  class="date_time" prop="shotTime">
            <el-date-picker
              v-model="searchForm.shotTime"
              class="vl_date"
              type="datetime"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :time-arrow-control="true"
              style="width: 100%"
              @blur="blurStartTime"
              :picker-options="pickerStart"
              placeholder="开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="date_time" prop="dateEnd">
            <el-date-picker
              v-model="searchForm.dateEnd"
              class="vl_date vl_date_end"
              style="width: 100%"
              :clearable="false"
              @blur="blurEndTime"
              @focus="handleEndTime"
              :picker-options="pickerEnd"
              :time-arrow-control="true"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="结束时间"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="plateNo">
            <el-input type="text" v-model="searchForm.plateNo" placeholder="请输入车牌号" style="width: 100%" @blur="handlePlateNo('searchForm')"></el-input>
          </el-form-item>
          <el-form-item prop="deviceCode" class="device_code">
            <el-select placeholder="请选择起点设备" style="width: 100%" v-model="searchForm.deviceCode" @change="handleChangeDeviceCode">
              <el-option
                v-for="(item, index) in deviceList"
                :key="index"
                :label="item.deviceName"
                :value="item.deviceName"
              ></el-option>
            </el-select>
            <span class="span_tips" v-show="isShowDeviceTip">该车辆在该时间内无抓拍设备</span>
          </el-form-item>
          <el-form-item prop="vehicleClass">
            <el-select placeholder="请选择尾随车辆类型" style="width: 100%" v-model="searchForm.vehicleClass" multiple clearable>
              <el-option
                v-for="(item, index) in vehicleTypeList"
                :key="index"
                :label="item.enumValue"
                :value="item.enumValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="interval">
            <el-select placeholder="请选择尾随时间间隔" style="width: 100%" v-model="searchForm.interval">
              <el-option
                v-for="(item, index) in intervalList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="operation_button">
            <el-button class="reset_btn" @click="resetData('searchForm')">重置</el-button>
            <el-button class="select_btn" type="primary" :loading="isSearchLoading" @click="searchData('searchForm')">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <template v-if="dataRecordList && dataRecordList.length > 0">
          <div class="content_top">
            <p>
              <span>查询结果</span>
              <span>（{{dataRecordList.length}}）</span>
            </p>
          </div>
          <div class="result_detail">
            <ul class="clearfix">
              <li v-for="(item, index) in dataRecordList" :key="index">
                <div class="de_left">
                  <img :src="item.StorageUrl1" alt="">
                </div>
                <div class="de_right">
                  <span class="title">查询资料</span>
                  <p>
                    <span>
                      <i class="vl_icon_tail_2 vl_icon"></i>
                      {{item.PlateNo}}
                    </span>
                    <span class="vehicle_type">{{item.vehicleClassDesc}}</span>
                  </p>
                  <p>
                    <i class="vl_icon_tail_1 vl_icon"></i>
                    <span :title="item.shotTime">{{item.shotTime}}</span>
                  </p>
                  <div class="record_btn" @click="skipWsReocrdPage(item)">尾随记录</div>
                </div>
              </li>
            </ul>
          </div>
        </template>
        <template v-else>
          <div is="noResult" :isInitPage="isInitPage" :tipMessage="initPageMessage"></div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import noResult from '@/components/common/noResult.vue';
import { checkPlateNumber } from '@/utils/validator.js';
import { getShotDevice, getTailBehindList } from '@/views/index/api/api.judge.js'
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
import { formatDate, dateOrigin } from '@/utils/util.js';
export default {
  components: { vlBreadcrumb, noResult },
  data () {
    const startTime = new Date() - 24 * 60 * 60 *1000;
    return {
      isSearchLoading: false,
      isInitPage: true, // 是否是初始化页面
      initPageMessage: '输入完整车牌并选择尾随起点，查询所选时间内一直尾随该车的车辆',
      isShowDeviceTip: false, // 显示设备列表无数据提示
      deviceStartTime: null, // 起点设备抓拍时间
      searchForm: {
        plateNo: null, // 车牌号码
        deviceCode: null, // 起点设备编号
        shotTime: dateOrigin(false, new Date(startTime)), // 开始时间
        dateEnd: new Date(), // 结束时间
        vehicleClass: [], // 车辆类型
        interval: 3 // 尾随间隔
      },
      intervalList: [
        { label: '1分钟', value: 1 },
        { label: '2分钟', value: 2 },
        { label: '3分钟', value: 3 },
        { label: '5分钟', value: 5 },
        { label: '10分钟', value: 10 }
      ],
      rules: {
        plateNo: [
          { required: true, message: '请输入正确的车牌号码', trigger: 'blur' },
          { validator: checkPlateNumber, trigger: 'blur' }
        ]
      },
      pickerStart: {
        disabledDate (time) {
          return time.getTime() > (new Date().getTime());
        }
      },
      pickerEnd: {
        disabledDate (time) {
          return time.getTime() > (new Date().getTime());
        }
      },
      deviceList: [], // 抓拍设备列表
      vehicleTypeList: [], // 车辆类型列表
      dataRecordList: [], // 查询的抓拍结果列表
      searchTimer: null
    }
  },
  mounted () {
    this.getVehicleTypeList();
    const plateNo = this.$route.query.plateNo;
    const dateStart = this.$route.query.searchStartTime;
    const dateEnd = this.$route.query.dateEnd;
    if (plateNo) { // 从其他模块跳转过来的
      this.searchForm.plateNo = plateNo;
    }
    if (plateNo && dateStart && dateEnd) { // 从分析结果页面跳过来的
      this.searchForm.plateNo = plateNo;
      this.searchForm.shotTime = dateStart;
      this.searchForm.dateEnd = dateEnd;
      this.searchForm.interval = parseInt(this.$route.query.interval);
      this.searchForm.deviceCode = this.$route.query.deviceCode;
      if (this.$route.query.vehicleClass) {
        this.searchForm.vehicleClass = this.$route.query.vehicleClass.join(',');
      }
      this.getDeviceList();
      this.searchTimer = setTimeout(() => {
        this.searchData('searchForm');
      }, 1000)
    }
  },
  beforeDestroy () {
    if (this.searchTimer) {
      window.clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }
  },
  methods: {
    // 获取车辆类型列表
    getVehicleTypeList () {
      const type = dataList.vehicleType;
      getDiciData(type)
        .then(res => {
          if (res) {
            this.vehicleTypeList = res.data;
          }
        })
    },
    // 车牌号码change
    handlePlateNo (form) {
      this.$refs[form].validateField('plateNo', (error) => {

        if (!error) {
          if (this.searchForm.shotTime && this.searchForm.dateEnd) {
            this.getDeviceList();
          }
        }
      })
    },
    // 开始时间blur
    blurStartTime () {
      let _this = this;
      if (_this.searchForm.shotTime) {
        if (_this.searchForm.plateNo && _this.searchForm.dateEnd) {
          _this.getDeviceList();
        }
      }
    },
    // 结束时间blur
    blurEndTime () {
      let _this = this;
      if (_this.searchForm.dateEnd) {
        if (_this.searchForm.shotTime && _this.searchForm.plateNo) {
          _this.getDeviceList();
        }
      }
    },
    // 结束时间focus
    handleEndTime () {
      // let _this = this;
      // const startDate = new Date(_this.searchForm.shotTime).getTime();
      // _this.pickerEnd = {
      //   disabledDate (time) {
      //    return time.getTime() < (startDate - 8.64e7) || time.getTime() > ((startDate + 2 * 3600 * 24 * 1000) - 8.64e6);
      //   }
      // }
    },
    // 获取抓拍设备列表
    getDeviceList () {
      this.deviceList = [];
      this.searchForm.deviceCode = null;
      this.deviceStartTime = null;
      const params = {
        plateNo: this.searchForm.plateNo.trim(),
        startTime: formatDate(this.searchForm.shotTime),
        endTime: formatDate(this.searchForm.dateEnd)
      };
      getShotDevice(params)
        .then(res => {
          if (res && res.code === '00000000') {
            if (res.data) {
              this.deviceList = res.data;

              // 初始化页面时默认选中第一个设备
              this.searchForm.deviceCode = this.deviceList[0].deviceName;
              this.deviceStartTime = this.deviceList[0].shotTime;
              this.isShowDeviceTip = false;

              if (this.$route.query.deviceCode) {
                this.deviceList.map(item => {
                  if (item.deviceName === this.$route.query.deviceCode) {
                    this.deviceStartTime = item.shotTime;
                  }
                })
              }

            } else {
              this.isShowDeviceTip = true;
            }
          }
        })
    },
    // 起点设备change
    handleChangeDeviceCode (obj) {
      if (obj) {
        this.deviceList.map(item => {
          if (item.deviceName === obj) {
            // this.searchForm.deviceCode = item.deviceID;
            this.deviceStartTime = item.shotTime;
          }
        })
      }
    },
    // 跳至尾随记录页面
    skipWsReocrdPage (obj) {
      this.$router.push({name: 'ws_record', query: {
        plateNo: this.searchForm.plateNo,
        dateStart: formatDate(this.deviceStartTime),
        dateEnd: formatDate(this.searchForm.dateEnd),
        searchStartTime: formatDate(this.searchForm.shotTime),
        plateNoTb: obj.PlateNo,
        vehicleClass: this.searchForm.vehicleClass.join(',') || null,
        interval: this.searchForm.interval,
        deviceCode: this.searchForm.deviceCode,
        dateStartTb: formatDate(obj.shotTime)
       }});
    },
    // 重置查询条件
    resetData (form) {
      this.isInitPage = false;
      this.isShowDeviceTip = false;
      this.$refs[form].resetFields();
      this.dataRecordList = [];
    },
    // 搜索数据
    searchData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (!this.searchForm.plateNo) {
            if (!document.querySelector('.el-message--info')) {
              this.$message.info('请先设置目标车辆');
            }
            return;
          }
          if (!this.searchForm.deviceCode) {
            if (!document.querySelector('.el-message--info')) {
              this.$message.info('请设置分析起点');
            }
            return;
          }
          let deviceCode, vehicleType;
          this.deviceList.map(item => {
            if (item.deviceName === this.searchForm.deviceCode) {
              deviceCode = item.deviceID;
            }
          })
          if (this.searchForm.vehicleClass.length > 0) {
            vehicleType = this.searchForm.vehicleClass.join(',');
          }
          const params = {
            deviceCode: deviceCode,
            startTime: formatDate(this.searchForm.shotTime),
            shotTime: formatDate(this.deviceStartTime),
            plateNo: this.searchForm.plateNo.trim(),
            endTime: formatDate(this.searchForm.dateEnd),
            vehicleClass: vehicleType,
            interval: this.searchForm.interval
          };
          this.isSearchLoading = true;
          getTailBehindList(params)
            .then(res => {
              if (res && res.data ) {
                if (res.data.length > 0) {
                  this.dataRecordList = res.data;
                  this.isSearchLoading = false;
                }
              } else {
                this.dataRecordList = [];
                this.isInitPage = false;
                this.isSearchLoading = false;
              }
            })
            .catch(() => {this.isSearchLoading = false;})
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-form-item__error {
  position: static;
  line-height: 20px;
  padding-top: 0;
  margin-bottom: -10px;
}
.vc_gcck_bd {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 50px; line-height: 50px;
}
.tail_analysis {
  height: 100%;
  .content_box {
    width: 100%;
    height: 100%;
    padding-top: 50px;
    // height: calc(100% - 55px);
    display: flex;
    .left {
      width: 272px;
      height: 100%;
      background-color: #ffffff;
      box-shadow:2px 3px 10px 0px rgba(131,131,131,0.28);
      .left_form {
        width: 100%;
        padding: 15px 20px;
        font-size: 12px !important;
        .device_code {
          /deep/ .el-form-item__content {
            line-height: 20px;
            .span_tips {
              color: #F56C6C;
              font-size: 12px;
              // line-height: 1;
              // padding-top: 4px;
              position: static;
              // top: 100%;
              // left: 0;
            }
          }
        }
        /deep/ .el-form-item {
          margin-bottom: 10px;
        }
        .date_time {
          /deep/ .el-form-item__label {
            line-height: 20px;
            color: #999999;
          }
        }
        .operation_button {
          margin-top: 20px;
        }
      }
    }
    .right {
      width: calc(100% - 272px);
      padding: 10px 15px;
      .content_top {
        display: flex;
        justify-content: space-between;
        >p {
          span:first-child {
            color: #333333;
          }
          span:last-child {
            color: #666666;
          }
        }
      }
      .result_detail {
        width: 100%;
        >ul {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          margin-top: 15px;
          >li {
            background-color: #ffffff;
            height: 180px;
            width: 375px;
            max-width: 32%;
            display: flex;
            justify-content: space-between;
            padding: 20px;
            margin-right: 8px;
            margin-bottom: 20px;
            box-shadow: 0px 5px 16px 0px #A9A9A9;
            .de_left {
              width: 50%;
              img {
                width: 140px;
                height: 140px;
              }
            }
            .de_right {
              width: 50%;
              line-height: 30px;
              .title {
                color: #999999;
              }
              > p {
                // width:186px;
                // height:26px;
                margin-bottom: 10px;
                padding-left: 5px;
                background:rgba(250,250,250,1);
                border:1px solid rgba(242,242,242,1);
                border-radius:3px;
                color: #333333;
                font-size: 12px;
                overflow:hidden; /*内容超出宽度时隐藏超出部分的内容 */
                text-overflow:ellipsis;/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
                white-space:nowrap; /*不换行 */
                i {
                  margin-right: 5px;
                }
                .vehicle_type {
                  margin-left: 10px;
                }
              }
              .record_btn {
                width:80px;
                height:30px;
                background:rgba(246,248,249,1);
                border:1px solid rgba(211,211,211,1);
                border-radius:4px;
                text-align: center;
                cursor: pointer;
                &:hover {
                  background-color: #ffffff;
                  color: #0C70F8;
                  border-color: #0C70F8;
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
</style>