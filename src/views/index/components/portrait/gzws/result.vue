<template>
  <div class="por_gzws_result_container">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" 
        :breadcrumbData="[
          {name: '人像侦查', routerName: 'portrait_menu'},
          {name: '跟踪尾随', routerName: 'gzws_portrait'},{name: '分析结果'}]">
      </div>
    </div>
    <div class="content_box">
      <div class="left">
        <template v-if="!isUpdateTask">
          <ul>
            <li>
              <img :src="taskDetail.taskWebParam && taskDetail.taskWebParam.targetPicUrl" alt="" class="bigImg">
            </li>
            <li>
              <span>任务名称：</span>
              <span>{{taskDetail.taskName ? taskDetail.taskName : '无'}}</span>
            </li>
            <li>
              <span>分析时间：</span>
              <span>{{taskDetail.taskWebParam && taskDetail.taskWebParam.startTime && taskDetail.taskWebParam.endTime ? taskDetail.taskWebParam.startTime + '-' + taskDetail.taskWebParam.endTime : '无'}}</span>
            </li>
            <li>
              <span>起点设备：</span>
              <span>{{taskDetail.taskWebParam&& taskDetail.taskWebParam.deviceName ? taskDetail.taskWebParam.deviceName : '无'}}</span>
            </li>
            <li>
              <span>尾随间隔：</span>
              <span>{{taskDetail.taskWebParam && taskDetail.taskWebParam.interval ? taskDetail.taskWebParam.interval + '分钟' : '无'}}</span>
            </li>
            <li>
              <span>创建时间：</span>
              <span>{{taskDetail.createTime ? taskDetail.createTime : '无'}}</span>
            </li>
          </ul>
          <div class="update_task" @click="showUpdateTask">修改任务</div>
        </template>
        <template v-else>
          <el-form class="left_form" :model="editForm" ref="editForm" :rules="rules">
            <p class="task_name">
              <span>任务名称：</span>
              <span>{{editForm.taskName}}</span>
            </p>
            <el-form-item  prop="startTime">
              <el-date-picker
                class="vl_date"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
                @change="handleStartTime"
                :picker-options="pickerDateTime"
                v-model="editForm.startTime"
                :time-arrow-control="true"
                type="datetime"
                placeholder="选择日期"
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime">
              <el-date-picker
                class="vl_date vl_date_end"
                v-model="editForm.endTime"
                :clearable="false"
                :time-arrow-control="true"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
                @change="handleEndTime"
                :picker-options="pickerDateTime"
                type="datetime" 
                placeholder="选择日期" 
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <div style="padding: 0 15px; height: 210px; text-align:center;  ">
                <div is="vlUpload" :clear="uploadClear" @uploadEmit="uploadEmit" :imgData="imgData"></div>
              </div>
            </el-form-item>
            <el-form-item prop="deviceCode" class="device_code">
              <el-select placeholder="请选择起点设备" style="width: 100%" v-model="editForm.deviceCode">
                <el-option
                  v-for="(item, index) in deviceList"
                  :key="index"
                  :label="item.deviceName"
                  :value="item.deviceName"
                ></el-option>
              </el-select>
              <span class="span_tips" v-show="isShowDeviceTip">该人像在该时间内无抓拍设备</span>
            </el-form-item>
            <el-form-item prop="interval">
              <el-select placeholder="请选择尾随时间间隔" style="width: 100%" v-model="editForm.interval">
                <el-option
                  v-for="(item, index) in intervalList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="operation_button">
              <el-button style="width: 110px;" @click="cancelEdit('editForm')">取消</el-button>
              <el-button style="width: 110px;" type="primary" :loading="isEditLoading" @click="submitData('editForm')">确定</el-button>
            </el-form-item>
          </el-form>
        </template>
      </div>
      <div class="right">
        <template v-if="taskDetail.taskResult && taskDetail.taskResult.length > 0">
          <div class="content_top">
            <p>
              <span>检索结果</span>
              <span>（{{taskDetail.taskResult.length}}）</span>
            </p>
          </div>
          <div class="result_detail">
            <ul class="clearfix">
              <li v-for="(item, index) in taskDetail.taskResult" :key="index">
                <div class="de_left">
                  <img :src="item.subStoragePath" alt="">
                </div>
                <div class="de_right">
                  <span class="title">检索资料</span>
                  <p class="time">
                    <i class="vl_icon_tail_1 vl_icon"></i>
                    <span>{{item.shotTime}}</span>
                  </p>
                  <p class="detail_info">
                    <span v-show="item.sex">{{item.sex}}性</span>
                    <span v-show="item.age">{{item.age}}</span>
                    <span v-show="item.hat" :title="item.hat">{{item.hat}}</span>
                    <span v-show="item.mask" :title="item.mask">{{item.mask}}</span>
                  </p>
                  <div class="record_btn" @click="skipWsReocrdPage(item)">查看尾随记录</div>
                </div>
              </li>
            </ul>
          </div>
        </template>
        <template v-else>
          <div is="noResult" :isInitPage="isInitPage"></div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import noResult from '@/components/common/noResult.vue';
import { getTaskInfosDetail } from '@/views/index/api/api.analysis.js';
import { checkPlateNumber } from '@/utils/validator.js';
import vlUpload from '@/components/common/upload.vue';
import { formatDate } from '@/utils/util.js';
import { getPersonShotDev, getPersonFollowing } from '@/views/index/api/api.portrait.js';
export default {
  components: { vlBreadcrumb, noResult, vlUpload },
  data () {
    return {
      isUpdateTask: false, // 是否修改任务
      isInitPage: false,
      dataList: [], // 查询的抓拍结果列表
      taskDetail: {}, // 离线任务详情
      isEditLoading: false,
      editForm: {},
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
      pickerDateTime: {
        disabledDate (time) {
          return time.getTime() > (new Date().getTime());
        }
      },
      dialogImageUrl: null,
      deviceList: [],
      uploadClear: {},
      imgData: null,
      isShowDeviceTip: false,
      shotTimes: null, // 选中设备的抓拍时间
    }
  },
  mounted () {
    this.getDetail();
  },
  methods: {
    // 获取离线任务详情
    getDetail () {
      const id = this.$route.query.id;
      if (id) {
        getTaskInfosDetail(id)
          .then(res => {
            if (res && res.data) {
              this.taskDetail = res.data;
              this.taskDetail.taskResult = JSON.parse(this.taskDetail.taskResult);
              this.taskDetail.taskWebParam = JSON.parse(this.taskDetail.taskWebParam);
              console.log('taskWebParam', this.taskDetail.taskWebParam)  
            }
          })
      }
    },
    // 跳至尾随记录页面
    skipWsReocrdPage (obj) {
      let queryObj = JSON.stringify(obj);
      this.$router.push({name: 'gzws_detail', query: {obj: queryObj, id: this.$route.query.id}})
    },
    // 起点设备change
    handleChangeDeviceCode (obj) {
      if (obj) {
        this.deviceList.map(item => {
          if (item.deviceName === obj) {
            this.editForm.deviceName = item.deviceName;
          }
        })
      }
    },
    // 获取抓拍设备列表
    getDeviceList () {
      this.deviceList = [];
      const params = {
        targetPicUrl : this.dialogImageUrl,
        startTime : formatDate(this.editForm.startTime),
        endTime: formatDate(this.editForm.endTime)
      };
      console.log('params', params)
      getPersonShotDev(params)
        .then(res => {
          if (res && res.code === '00000000') {
            if (res.data) {
              this.deviceList = res.data;

              this.deviceList.map(item => {
                if (item.uid === this.editForm.deviceId) {
                  this.shotTimes = item.shotTime;
                }
              })
              
              this.isShowDeviceTip = false;
            } else {
              this.isShowDeviceTip = true;
            }
          }
        })
    },
    uploadEmit (data) {
      console.log('uploadEmit data', data);
      if (data && data.path) {
        this.dialogImageUrl = data.path;
        this.$nextTick(() => {
          this.getDeviceList();
        })
      } else {
        this.dialogImageUrl = null;
      }
    },
    // 开始时间选择change
    handleStartTime (val) {
      console.log(val)
      if (val) {
        // if ( (new Date(val[1]).getTime() - new Date(val[0]).getTime()) >= 3* 24 * 3600 * 1000) {
        //   if (!document.querySelector('.el-message--info')) {
        //     this.$message.info('最多选择3天');
        //   }
        //   this.addForm.dateTime = [new Date((new Date() - (24 * 60 * 60 * 1000))), new Date()];
        // } else {
          if (this.dialogImageUrl && this.editForm.endTime) {
            this.getDeviceList();
          }
        // }
      }
    },
    // 结束时间change
    handleEndTime (val) {
      if (val) {
        // if ( (new Date(val[1]).getTime() - new Date(val[0]).getTime()) >= 3* 24 * 3600 * 1000) {
        //   if (!document.querySelector('.el-message--info')) {
        //     this.$message.info('最多选择3天');
        //   }
        //   this.addForm.dateTime = [new Date((new Date() - (24 * 60 * 60 * 1000))), new Date()];
        // } else {
          if (this.dialogImageUrl && this.editForm.startTime) {
            this.getDeviceList();
          }
        // }
      }
    },
    // 显示修改任务表单输入框
    showUpdateTask () {
      this.isUpdateTask = true;

      this.dialogImageUrl = this.taskDetail.taskWebParam.targetPicUrl;
      this.imgData = Object.assign({}, {path: this.taskDetail.taskWebParam.targetPicUrl});

      this.editForm = {...this.taskDetail.taskWebParam};
      this.editForm.deviceCode = this.taskDetail.taskWebParam.deviceName;
      this.editForm.deviceName = this.taskDetail.taskWebParam.deviceName;


      this.$nextTick(() => {
        this.getDeviceList();
      })
    },
    // 取消修改
    cancelEdit () {
      this.isUpdateTask = false;
      this.dialogImageUrl = null;
      this.uploadClear = {};
    },
    // 确定修改
    submitData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (!this.dialogImageUrl) {
            if (!document.querySelector('.el-message--info')) {
              this.$message.info('请先上传目标人员全身照');
            }
            return;
          }
          if (this.dialogImageUrl && !this.editForm.deviceCode) {
            if (!document.querySelector('.el-message--info')) {
              this.$message.info('请设置分析起点');
            }
            return;
          }
          let deviceCode;
          this.deviceList.map(item => {
            if (item.deviceName === this.editForm.deviceCode) {
              deviceCode = item.deviceID;
            }
          })
          const params = {
            uid: this.$route.query.id,
            targetPicUrl: this.dialogImageUrl,
            deviceId: deviceCode,
            deviceName: this.editForm.deviceName,
            startTime: formatDate(this.shotTimes),
            endTime: formatDate(this.editForm.endTime),
            taskName: this.editForm.taskName,
            interval: this.editForm.interval
          };
          this.isEditLoading = true;
          getPersonFollowing(params)
            .then(res => {
              if (res && res.code === '00000000') {
                this.$message({
                  type: 'success',
                  message: '修改成功',
                  customClass: 'request_tip'
                });
                this.isEditLoading = false;
                this.$router.push({name: 'gzws_portrait'});
              } else {
                this.isEditLoading = false;
              }
            })
            .catch(() => {this.isEditLoading = false;})
        }
      })
    }
  }
}
</script>
<style lang="scss">
.por_gzws_result_container {
  .el-form-item {
    margin-bottom: 10px;
  }
  .operation_button {
    margin-top: 20px;
  }
}
</style>
<style lang="scss" scoped>
.vc_gcck_bd {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 50px; line-height: 50px;
}
.por_gzws_result_container {
  height: 100%;
  .content_box {
    width: 100%;
    height: 100%;
    padding-top: 50px;
    display: flex;
    .left {
      width: 272px;
      height: 100%;
      background-color: #ffffff;
      padding: 20px;
      box-shadow: 2px 3px 10px 0px rgba(131,131,131,0.28);
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
      .update_task {
        text-align: center;
        color: #ffffff;
        background-color: #0C70F8;
        border-radius: 4px;
        height: 40px;
        width: 110px;
        line-height: 40px;
        margin: 20px auto;
        cursor: pointer;
      }
      .left_form {
        width: 100%;
        // padding: 10px 10px 0 10px;
        font-size: 12px !important;
        .task_name {
          font-size: 14px;
          margin-bottom: 10px;
          span:first-child {
            color: #999999;
          }
          span:last-child {
            color: #333333;
          }
        }
        // .reset_btn, .select_btn {
        //   width: 110px;
        // }
        .device_code {
          /deep/ .el-form-item__content {
            line-height: 20px;
            .span_tips {
              color: #F56C6C;
              font-size: 12px;
              position: static;
            }
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
              width: 45%;
              img {
                width: 130px;
                height: 130px;
              }
            }
            .de_right {
              width: 55%;
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
                  margin-right: 3px;
                  border-radius:3px;
                  // padding: 5px 8px;
                  padding: 0 2px;
                  max-width: 43px;
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