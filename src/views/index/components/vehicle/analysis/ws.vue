<template>
  <div class="tail_analysis">
    <Breadcrumb :oData="[{name: '尾随分析'}]"></Breadcrumb>
    <div class="content_box">
      <div class="left">
        <el-form class="left_form" :model="searchForm" ref="searchForm" :rules="rules">
          <el-form-item prop="plateNo">
            <el-input type="text" v-model="searchForm.plateNo" placeholder="请输入车牌号" style="width: 100%" @blur="handlePlateNo"></el-input>
          </el-form-item>
          <el-form-item label="开始" label-width="20px" class="date_time" prop="shotTime">
            <el-date-picker
              v-model="searchForm.shotTime"
              type="datetime"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
              @blur="handleStartTime"
              :picker-options="pickerStart"
              placeholder="开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束" label-width="20px" class="date_time" prop="dateEnd">
            <el-date-picker
              v-model="searchForm.dateEnd"
              style="width: 100%"
              :clearable="false"
              @blur="handleEndTime"
              :picker-options="pickerEnd"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="结束时间"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="deviceCode">
            <el-select placeholder="请选择起点设备" style="width: 100%" v-model="searchForm.deviceCode" @change="handleChangeDeviceCode">
              <el-option
                v-for="(item, index) in deviceList"
                :key="index"
                :label="item.deviceName"
                :value="item.deviceID"
              ></el-option>
            </el-select>
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
          <el-form-item>
            <el-button class="reset_btn" @click="resetData('searchForm')">重置</el-button>
            <el-button class="select_btn" @click="searchData('searchForm')">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <template v-if="dataList && dataList.length > 0">
          <div class="content_top">
            <p>
              <span>查询结果</span>
              <span>（{{dataList.length}}）</span>
            </p>
          </div>
          <div class="result_detail">
            <ul class="clearfix">
              <li v-for="(item, index) in dataList" :key="index">
                <div class="de_left">
                  <img :src="item.subStoragePath" alt="">
                </div>
                <div class="de_right">
                  <span class="title">查询资料</span>
                  <p>
                    <span>
                      <i class="vl_icon_tail_2 vl_icon"></i>
                      {{item.plateNo}}
                    </span>
                    <span class="vehicle_type">{{item.vehicleClass}}</span>
                  </p>
                  <p>
                    <i class="vl_icon_tail_1 vl_icon"></i>
                    <span>{{item.shotTime}}</span>
                  </p>
                  <div class="record_btn" @click="skipWsReocrdPage(item)">尾随记录</div>
                </div>
              </li>
            </ul>
          </div>
        </template>
        <template v-else>
          <div class="not_content">
            <img src="../../../../../assets/img/not-content.png" alt="">
            <p style="color: #666666; margin-top: 30px;">抱歉，没有相关的结果!</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import Breadcrumb from '../breadcrumb.vue';
import { checkPlateNumber } from '@/utils/validator.js';
import { getShotDevice, getTailBehindList } from '@/views/index/api/api.judge.js'
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
import { formatDate } from '@/utils/util.js';
export default {
  components: { Breadcrumb },
  data () {
    const startTime = new Date() - 24 * 60 * 60 *1000;
    return {
      deviceStartTime: null, // 起点设备抓拍时间
      searchForm: {
        plateNo: null, // 车牌号码
        deviceCode: null, // 起点设备编号
        shotTime: new Date(startTime), // 开始时间
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
      dataList: [], // 查询的抓拍结果列表
    }
  },
  created () {
    this.getVehicleTypeList();

    const plateNo = this.$route.query.plateNo;
    const dateStart = this.$route.query.dateStart;
    const dateEnd = this.$route.query.dateEnd;
    if (plateNo && dateStart && dateEnd) {
      this.searchForm.plateNo = plateNo;
      this.searchForm.shotTime = dateStart;
      this.searchForm.dateEnd = dateEnd;
      this.searchForm.interval = this.$route.query.interval;
      this.searchForm.deviceCode = this.$route.query.deviceCode;
      this.searchForm.vehicleClass = this.$route.query.vehicleClass && this.$route.query.vehicleClass.join(',');
      this.getDeviceList();
    }
  },
  mounted () {
    setTimeout(() => {
      this.searchData('searchForm');
    }, 1000)
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
    handlePlateNo () {
      if (this.searchForm.plateNo && this.searchForm.shotTime && this.searchForm.dateEnd) {
        this.getDeviceList();
      }
    },
    // 开始时间change
    handleStartTime () {
      let _this = this;
      if (_this.searchForm.shotTime) {
        _this.pickerEnd.disabledDate = function (time) {
          return time.getTime() > new Date(_this.searchForm.shotTime).getTime() + 3 * 24 * 3600 * 1000;
        }
        if (_this.searchForm.plateNo && _this.searchForm.dateEnd) {
          _this.getDeviceList();
        }
      }
    },
    // 结束时间change
    handleEndTime () {
      let _this = this;
      if (_this.searchForm.dateEnd) {
        _this.pickerStart.disabledDate = function (time) {
          return time.getTime() > new Date(_this.searchForm.dateEnd).getTime();
        }
        if (_this.searchForm.shotTime && _this.searchForm.plateNo) {
          _this.getDeviceList();
        }
      }
    },
    // 获取抓拍设备列表
    getDeviceList () {
      this.deviceList = [];
      const params = {
        plateNo: this.searchForm.plateNo,
        startTime: formatDate(this.searchForm.shotTime),
        endTime: formatDate(this.searchForm.dateEnd)
      };
      getShotDevice(params)
        .then(res => {
          if (res) {
            this.deviceList = res.data;
            if (this.$route.query.deviceCode) {
              this.deviceList.map(item => {
                if (item.deviceID === this.$route.query.deviceCode) {
                  console.log('asdasdasd')
                  this.deviceStartTime = item.shotTime;
                }
              })
            }
          }
        })
    },
    // 起点设备change
    handleChangeDeviceCode (obj) {
      if (obj) {
        this.deviceList.map(item => {
          if (item.deviceID === obj) {
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
        plateNoTb: obj.plateNo,
        vehicleClass: this.searchForm.vehicleClass.join(',') || null,
        interval: this.searchForm.interval,
        deviceCode: this.searchForm.deviceCode,
        dateStartTb: formatDate(obj.shotTime)
       }});
    },
    // 重置查询条件
    resetData (form) {
      this.$refs[form].resetFields();
    },
    // 搜索数据
    searchData (form) {
      this.dataList = [];
      this.$refs[form].validate(valid => {
        if (valid) {
          if (!this.searchForm.plateNo) {
            this.$message({
              type: 'warning',
              message: '请先设置目标车辆',
              customClass: 'request_tip'
            });
            return;
          };
          if (!this.searchForm.deviceCode) {
            this.$message({
              type: 'warning',
              message: '请设置分析起点',
              customClass: 'request_tip'
            });
            return;
          };
          const vehicleType = this.searchForm.vehicleClass.join(',');
          const params = {
            deviceCode: this.searchForm.deviceCode,
            startTime: formatDate(this.searchForm.shotTime),
            shotTime: formatDate(this.deviceStartTime),
            plateNo: this.searchForm.plateNo,
            endTime: formatDate(this.searchForm.dateEnd),
            vehicleClass: vehicleType,
            interval: this.searchForm.interval
          };
          getTailBehindList(params)
            .then(res => {
              if (res && res.data) {
                this.dataList = res.data;
              }
            })
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
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
        /deep/ .el-form-item {
          margin-bottom: 20px;
        }
        .date_time {
          /deep/ .el-form-item__label {
            line-height: 20px;
            color: #999999;
          }
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
  .reset_btn {
    width: 110px;
    background-color: #D3D3D3;
    color: #666666;
    border-radius: 4px;
    &:hover {
      background-color: #ffffff;
      color: #0C70F8;
      border-color: #0C70F8;
    }
  }
  .select_btn {
    width: 110px;
    background-color: #0C70F8;
    color: #ffffff;
    border-radius: 4px;
  }
}
</style>