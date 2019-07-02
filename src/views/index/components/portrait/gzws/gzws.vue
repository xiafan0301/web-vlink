<template>
  <div class="gzws_container">
    <Breadcrumb :oData="[{name: '跟踪尾随'}]"></Breadcrumb>
    <div class="content_box">
      <div class="left">
        <vue-scroll>
          <div class="upload_box">
            <el-upload
              :disabled="isAddImgDisabled"
              ref="uploadPic"
              accept="image/*"
              :action="uploadUrl"
              :show-file-list="false"
              list-type="picture-card"
              :on-success="uploadPicSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
              :file-list="fileList">
              <i class="vl_icon vl_icon_control_14"></i>
              <p class="upload_text">点击上传图片</p>
            </el-upload>
            <div class="img_list">
              <div class="img_box"></div>
              <div class="img_box"></div>
              <div class="img_box"></div>
            </div>
            <div class="divide"></div>
          </div>
          <el-form class="left_form" :model="searchForm" ref="searchForm" :rules="rules">
            <el-form-item label="开始" label-width="20px" class="date_time" prop="shotTime">
              <el-date-picker
                v-model="searchForm.shotTime"
                type="datetime"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
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
              <el-button class="reset_btn" style="width: 100px;" @click="resetData('searchForm')">重置</el-button>
              <el-button class="select_btn" style="width: 100px;" @click="searchData('searchForm')">查询</el-button>
            </el-form-item>
          </el-form>
        </vue-scroll>
      </div>
      <div class="right">
        <template v-if="dataList && dataList.length === 0">
          <div class="content_top">
            <p>
              <span>检索结果</span>
              <span>（{{dataList.length}}）</span>
            </p>
          </div>
          <div class="result_detail">
            <ul class="clearfix">
              <li>
                <div class="de_left">
                  <img src="" alt="">
                </div>
                <div class="de_right">
                  <span class="title">检索资料</span>
                  <p class="time">
                    <i class="vl_icon_tail_1 vl_icon"></i>
                    <span>2018-12-12 12:12:12</span>
                  </p>
                  <p class="detail_info">
                    <span>男性</span>
                    <span>青年</span>
                    <span>带有帽子阿萨达萨达</span>
                  </p>
                  <div class="record_btn" @click="skipWsReocrdPage(item)">查看尾随记录</div>
                </div>
              </li>
              <li>
                <div class="de_left">
                  <img src="" alt="">
                </div>
                <div class="de_right">
                  <span class="title">检索资料</span>
                  <p class="time">
                    <i class="vl_icon_tail_1 vl_icon"></i>
                    <span>2018-12-12 12:12:12</span>
                  </p>
                  <p class="detail_info">
                    <span>男性</span>
                    <span>青年</span>
                    <span>带有帽子阿萨达萨达</span>
                  </p>
                  <div class="record_btn" @click="skipWsReocrdPage(item)">尾随记录</div>
                </div>
              </li>
              <li>
                <div class="de_left">
                  <img src="" alt="">
                </div>
                <div class="de_right">
                  <span class="title">检索资料</span>
                  <p class="time">
                    <i class="vl_icon_tail_1 vl_icon"></i>
                    <span>2018-12-12 12:12:12</span>
                  </p>
                  <p class="detail_info">
                    <span>男性</span>
                    <span>青年</span>
                    <span>带有帽子阿萨达萨达</span>
                  </p>
                  <div class="record_btn" @click="skipWsReocrdPage(item)">尾随记录</div>
                </div>
              </li>
              <li>
                <div class="de_left">
                  <img src="" alt="">
                </div>
                <div class="de_right">
                  <span class="title">检索资料</span>
                  <p class="time">
                    <i class="vl_icon_tail_1 vl_icon"></i>
                    <span>2018-12-12 12:12:12</span>
                  </p>
                  <p class="detail_info">
                    <span>男性</span>
                    <span>青年</span>
                    <span>带有帽子阿萨达萨达</span>
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
            <p>暂无相关数据</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import Breadcrumb from '../breadcrumb.vue';
import { ajaxCtx } from '@/config/config.js';
import { checkPlateNumber } from '@/utils/validator.js';
import { getShotDevice, getTailBehindList } from '@/views/index/api/api.judge.js'
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
import { formatESDate } from '@/utils/util.js';
export default {
  components: { Breadcrumb },
  data () {
    const startTime = new Date() - 24 * 60 * 60 *1000;
    return {
      dialogImageUrl: null,
      fileList: [],
      isAddImgDisabled: false, // 图片上传禁用
      uploadUrl: ajaxCtx.base + '/new', // 图片上传地址
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
        // disabledDate (time) {
        //   return time.getTime() > (new Date().getTime());
        // }
      },
      pickerEnd: {
        // disabledDate (time) {
        //   return time.getTime() > (new Date().getTime());
        // }
      },
      deviceList: [], // 抓拍设备列表
      vehicleTypeList: [], // 车辆类型列表
      dataList: [], // 查询的抓拍结果列表
    }
  },
  created () {
    this.getVehicleTypeList();
  },
  methods: {
    handleRemove () {
      this.dialogImageUrl = null;
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      // this.dialogVisible = true;
    },
    uploadPicSuccess (file) {
      this.dialogImageUrl = file.data.fileFullPath;
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      const isLt4M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        this.$message.error('上传图片只能是 jpeg、jpg、png 格式!');
      }
      if (!isLt4M) {
        this.$message.error('上传图片大小不能超过 4MB!');
      }
      return isJPG && isLt4M;
    },
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
      if (this.searchForm.shotTime) {
        // this.pickerEnd.disabledDate = function (time) {
        //   return time.getTime() > new Date(val).getTime() + 3 * 24 * 3600 * 1000;
        // }
        if (this.searchForm.plateNo && this.searchForm.dateEnd) {
          this.getDeviceList();
        }
      }
    },
    // 结束时间change
    handleEndTime () {
      if (this.searchForm.dateEnd) {
        // this.pickerStart.disabledDate = function (time) {
        //   return time.getTime() > new Date(val).getTime();
        // }
        if (this.searchForm.shotTime && this.searchForm.plateNo) {
          this.getDeviceList();
        }
      }
    },
    // 获取抓拍设备列表
    getDeviceList () {
      this.deviceList = [];
      const shotTime = formatESDate(this.searchForm.shotTime) + '-' + formatESDate(this.searchForm.dateEnd);
      const params = {
        plateNo: this.searchForm.plateNo,
        shotTime: shotTime
      };
      console.log('params', params)
      getShotDevice(params)
        .then(res => {
          if (res) {
            this.deviceList = res.data;
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
      this.$router.push({name: 'gzws_detail'})
      // this.$router.push({name: 'gzws_detail', query: { 
      //   plateNo: this.searchForm.plateNo,
      //   dateStart: this.deviceStartTime,
      //   dateEnd: this.searchForm.dateEnd,
      //   plateNoTb: obj.plateNo,
      //   dateStartTb: obj.shotTime
      //  }});
    },
    // 重置查询条件
    resetData (form) {
      this.$refs[form].resetFields();
    },
    // 搜索数据
    searchData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (!this.searchForm.deviceCode) {
            this.$message({
              type: 'warning',
              message: '请先选择起点设备',
              customClass: 'request_tip'
            });
            return;
          };
          const vehicleType = this.searchForm.vehicleClass.join(':');
          const params = {
            deviceCode: this.searchForm.deviceCode,
            dateStart: formatESDate(this.searchForm.shotTime),
            shotTime: formatESDate(this.deviceStartTime),
            plateNo: this.searchForm.plateNo,
            dateEnd: formatESDate(this.searchForm.dateEnd),
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
.gzws_container {
  height: 100%;
  .content_box {
    width: 100%;
    height: 100%;
    padding-top: 50px;
    display: flex;
    .left {
      width: 265px;
      height: 100%;
      background-color: #ffffff;
      box-shadow: 2px 3px 10px 0px rgba(131,131,131,0.28);
        //  padding: 15px 20px;
      .upload_box {
        padding: 15px 20px;
         .img_list {
           display: flex;
           margin-top: 10px;
           .img_box {
            width: 70px;
            height: 70px;
            background:rgba(255,255,255,1);
            border:1px dashed rgba(211,211,211,1);
            border-radius:1px;
            &:not(:last-child) {
              margin-right: 5px;
            }
           }
         }
         .divide {
           height: 1px;
           border-bottom: 1px solid #D3D3D3;
           margin-top: 20px;
         }
         /deep/ .el-upload {
          width: 225px;
          height: 225px;
          .upload_text {
            line-height: 0;
            color: #999999;
            margin-top: -30px;
          }
          i {
            margin-top: 20px;
            width: 120px;
            height: 120px;
          }
          &:hover {
            background: #0C70F8;
            i.vl_icon_control_14{
              background-position: -228px -570px;
            }
            .upload_text {
              color: #ffffff;
            }
          }
        }
        &.hidden /deep/ .el-upload--picture-card {
          display: none!important;
        }
      }
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
      width: calc(100% - 265px);
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
              .time {
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
              }
              .detail_info {
                >span {
                  background-color: #FAFAFA;
                  color: #333333;
                  font-size: 12px;
                  margin-right: 5px;
                  border-radius:3px;
                  // padding: 5px 8px;
                  padding: 0 3px;
                  max-width: 50px;
                  cursor: pointer;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  border: 1px solid #F2F2F2;
                  display: inline-block;
                }
              }
              .record_btn {
                width:100px;
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