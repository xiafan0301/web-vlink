<template>
  <div class="gzws_container">
    <div class="pt_breadcrumb">
      <div class="vc_gcck_bd">
        <div is="vlBreadcrumb" 
          :breadcrumbData="[
            {name: '人像侦查', routerName: 'portrait_menu'},
            {name: '跟踪尾随'}]">
        </div>
      </div>
    </div>
    <div class="gzws_content_box">
      <div class="content_left">
        <vue-scroll>
          <el-form class="left_form" :model="addForm" ref="addForm" :rules="rules">
            <!-- <el-form-item label="查询方式：">
              <el-radio-group v-model="selectType" style="width: 100%">
                <el-radio :label="1">在线查询</el-radio>
                <el-radio :label="2">离线任务</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item  prop="startTime">
              <el-date-picker
                class="vl_date"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
                @change="handleStartTime"
                :picker-options="pickerDateTime"
                v-model="addForm.startTime"
                :time-arrow-control="true"
                type="datetime"
                placeholder="选择日期"
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime">
              <el-date-picker
                class="vl_date vl_date_end"
                v-model="addForm.endTime"
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
                <div is="vlUpload" :clear="uploadClear" @uploadEmit="uploadEmit"></div>
              </div>
            </el-form-item>
            <el-form-item prop="deviceName" class="device_code">
              <el-select placeholder="请选择起点设备" style="width: 100%" v-model="addForm.deviceName" @change="handleChangeDeviceCode">
                <el-option
                  v-for="(item, index) in deviceList"
                  :key="index"
                  :label="item.deviceName"
                  :value="item.deviceName"
                ></el-option>
              </el-select>
              <span class="span_tips" v-show="isShowDeviceTip">该人像在该时间内无抓拍设备</span>
            </el-form-item>
            <el-form-item prop="taskName" :rules="[{ required: true, message: '该项内容不能为空', trigger: 'blur' }]">
              <el-input placeholder="请输入任务名称，最多20字" maxlength="20" v-model="addForm.taskName" @change="changeTaskName"></el-input>
            </el-form-item>
            <el-form-item prop="interval">
              <el-select placeholder="请选择尾随时间间隔" style="width: 100%" v-model="addForm.interval">
                <el-option
                  v-for="(item, index) in intervalList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="operation_button">
              <el-button class="reset_btn" @click="cancelAdd('addForm')">重置</el-button>
              <el-button class="select_btn" type="primary" :loading="isAddLoading" @click="submitData('addForm')">确定</el-button>
            </el-form-item>
          </el-form>
        </vue-scroll>
      </div>
      <div class="content_box">
        <vue-scroll>
          <ul class="tab-menu">
            <li
              v-for="(item,index) in tabList"
              :key="index"
              :class="{'is-active': selectIndex === item.value}"
              @click="selectTab(item.value)"
            >{{item.label}}</li>
          </ul>
          <!-- <template v-if="selectIndex === 1 || selectIndex === 0"> -->
            <div class="search_box">
              <el-form :inline="true" :model="searchForm" class="event_form" ref="searchForm">
                <el-form-item label="任务名称:" prop="taskName">
                  <el-input
                    style="width: 230px;"
                    type="text"
                    placeholder="请输入任务名称"
                    v-model="searchForm.taskName"
                  />
                </el-form-item>
                <el-form-item label="创建时间:" prop="reportTime">
                  <el-date-picker
                    class="vl_date"
                    v-model="searchForm.reportTime"
                    type="datetimerange"
                    :time-arrow-control="true"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="selectDataList">查询</el-button>
                  <el-button @click="resetForm('searchForm')">重置</el-button>
                </el-form-item>
              </el-form>
              <div class="divide"></div>
            </div>
            <div class="table_box">
              <!-- <el-button class="add_btn" type="primary" @click="showAddTaskDialog">新建任务</el-button> -->
              <el-table :data="list">
                <el-table-column label="序号" type="index" width="100"></el-table-column>
                <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="分析时间范围" prop="taskWebParam" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.taskWebParam.startTime}} - {{scope.row.taskWebParam.endTime}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="尾随间隔" prop="taskWebParam" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.taskWebParam.interval ? scope.row.taskWebParam.interval + '分钟' : '-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="结果数" prop="resultNum" show-overflow-tooltip v-if="selectIndex === 1"></el-table-column>
                <el-table-column label="状态" v-if="selectIndex === 0" prop="taskStatus" show-overflow-tooltip>
                  <template slot-scope="scope" v-if="scope.row.taskStatus !== 2">
                    <span>{{scope.row.taskStatus && scope.row.taskStatus === 1 ? '进行中' : scope.row.taskStatus === 3 ? '失败' : '已中断'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="200px">
                  <template slot-scope="scope">
                    <span
                      class="operation_btn"
                      @click="skipResultPage(scope.row)"
                      v-if="selectIndex === 1"
                    >查看</span>
                    <!--<span-->
                      <!--class="operation_btn"-->
                      <!--@click="showInterruptDialog(scope.row)"-->
                      <!--v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus === 1"-->
                    <!--&gt;中断任务</span>-->
                    <!--<span-->
                      <!--class="operation_btn"-->
                      <!--@click="recoveryTask(scope.row)"-->
                      <!--v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus === 4"-->
                    <!--&gt;恢复任务</span>-->
                    <span
                      class="operation_btn"
                      @click="recoveryTask(scope.row)"  
                      v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus === 3"
                    >重启任务</span>
                    <span
                      class="operation_btn"
                      @click="showDeleteDialog(scope.row)"
                      v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus !== 4"
                    >删除任务</span>
                  </template>
                </el-table-column>
              </el-table>
              <template v-if="pagination.total > 0">
                <el-pagination
                  class="cum_pagination"
                  @current-change="handleCurrentChange"
                  :current-page.sync="pagination.pageNum"
                  :page-sizes="[100, 200, 300, 400]"
                  :page-size="pagination.pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="pagination.total"
                ></el-pagination>
              </template>
            </div>
        </vue-scroll>
      </div>
    </div>
    <!--删除任务弹出框-->
    <el-dialog
      title="删除任务确认"
      :visible.sync="deleteDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">任务删除，任务的数据处理进程将被清除，任务不再可以恢复</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="sureDeleteTask">确认</el-button>
      </div>
    </el-dialog>
    <!--中断任务弹出框-->
    <!-- <el-dialog
      title="中断任务确认"
      :visible.sync="interruptDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">任务中断，任务的数据处理进程将中止，可以在列表中恢复任务的数据处理</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interruptDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isInterruptLoading" @click="sureInterruptTask">确认</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>

import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import { checkPlateNumber } from '@/utils/validator.js';
import { getPersonShotDev, getPersonFollowing } from '@/views/index/api/api.portrait.js';
import { getTaskInfosPage, putAnalysisTask } from '@/views/index/api/api.analysis.js';
import { formatDate, dateOrigin } from '@/utils/util.js';
import vlUpload from '@/components/common/upload.vue';
import noResult from '@/components/common/noResult.vue';
export default {
  components: { vlBreadcrumb, vlUpload, noResult },
  data () {
    // const startTime = new Date() - 24 * 60 * 60 *1000;
    return {
      tabList: [
        {
          label: "已完成任务",
          value: 1
        },
        {
          label: "未完成任务",
          value: 0
        }
      ],
      isInitPage: true,
      selectType: 1, // 左侧选择查询方式  1---实时  2---离线
      isShowDeviceTip: false, // 是否显示设备有否提示
      selectIndex: 1, // 默认选中已完成的任务
      taskId: null, // 要操作的任务id
      deleteDialog: false, // 删除任务弹出框
      interruptDialog: false, // 中断任务弹出框
      addTaskDialog: false, // 新建任务弹出框
      isAddLoading: false, // 新建任务加载中
      isDeleteLoading: false, // 删除任务弹出框
      // isInterruptLoading: false, // 中断任务弹出框
      // fileList: [], // 图片上传列表
      dialogImageUrl: null,
      // uploadUrl: ajaxCtx.base + '/new', // 图片上传地址
      deviceStartTime: null, // 起点设备抓拍时间
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      searchForm: {
        reportTime: [], // 日期
        taskName: null // 任务名称
      },
      addForm: {
        taskName: null, // 任务名称
        // deviceCode: null, // 起点设备编号
        deviceName: null, // 起点设备名称
        startTime: dateOrigin(false, new Date(new Date() - 24 * 60 * 60 * 1000)), // 开始时间
        endTime: new Date(), // 结束时间
        // dateTime: [dateOrigin(false, new Date(new Date() - 24 * 60 * 60 * 1000)), new Date()],
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
      pickerDateTime: {
        disabledDate (time) {
          return time.getTime() > (new Date().getTime());
        }
      },
      list: [], // 离线任务列表
      deviceList: [], // 抓拍设备列表
      vehicleTypeList: [], // 车辆类型列表
      dataList: [], // 查询的抓拍结果列表
      uploadClear: {},
      shotTimes: null, // 选中设备的抓拍时间
      skipStartTime: null, // 选择的开始时间
    }
  },
  created () {
    this.getDataList();
  },
  methods: {
    changeTaskName (val) {
      this.addForm.taskName = val.trim();
    },
    uploadEmit (data) {
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
      if (val) {
        // if ( (new Date(val[1]).getTime() - new Date(val[0]).getTime()) >= 3* 24 * 3600 * 1000) {
        //   if (!document.querySelector('.el-message--info')) {
        //     this.$message.info('最多选择3天');
        //   }
        //   this.addForm.dateTime = [new Date((new Date() - (24 * 60 * 60 * 1000))), new Date()];
        // } else {
          if (this.dialogImageUrl && this.addForm.endTime) {
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
          if (this.dialogImageUrl && this.addForm.startTime) {
            this.getDeviceList();
          }
        // }
      }
    },
    // 获取离线任务
    getDataList () {
      if (!this.searchForm.reportTime) {
        this.searchForm.reportTime = [];
      }
      const params = {
        'where.taskName': this.searchForm.taskName,
        'where.taskType': 3, // 3：人员跟踪尾随分析
        'where.startTime': this.searchForm.reportTime[0],
        'where.endTime': this.searchForm.reportTime[1],
        'where.isFinish': this.selectIndex,   //是否完成 0:未完成(包含处理中、处理失败、处理中断) 1：已完成(处理成功)
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        order: 'desc',
        orderBy: 'create_time'
      };
      getTaskInfosPage(params)
        .then(res => {
          if (res && res.data) {
            this.list = res.data.list;
            this.pagination.total = res.data.total;
            this.list.map(item => {
              item.taskWebParam = JSON.parse(item.taskWebParam);
            })
          }
        })
        .catch(() => {})
    },
    //tab切换
    selectTab(val) {
      this.selectIndex = val;
      this.getDataList();
    },
    // 获取抓拍设备列表
    getDeviceList () {
      this.deviceList = [];
      const params = {
        targetPicUrl : this.dialogImageUrl,
        startTime : formatDate(this.addForm.startTime),
        endTime: formatDate(this.addForm.endTime)
      };
      getPersonShotDev(params)
        .then(res => {
          if (res && res.code === '00000000') {
            if (res.data) {
              this.deviceList = res.data;
              // 初始化页面时默认选中第一个设备
              // this.addForm.deviceCode = this.deviceList[0].deviceName;
              this.addForm.deviceName = this.deviceList[0].deviceName;

              this.shotTimes = this.deviceList[0].shotTime;
              
              this.isShowDeviceTip = false;
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
            this.addForm.deviceName = item.deviceName;
            this.shotTimes = item.shotTime;
          }
        })
      }
    },
    // 取消新建
    cancelAdd (form) {
      this.$refs[form].resetFields();
      this.addTaskDialog = false;
      this.dialogImageUrl = null;
      this.uploadClear = {};
    },
    // 新建任务
    submitData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (!this.dialogImageUrl) {
            if (!document.querySelector('.el-message--info')) {
              this.$message.info('请先上传目标人员全身照');
            }
            return;
          }
          if (this.dialogImageUrl && !this.addForm.deviceName) {
            if (!document.querySelector('.el-message--info')) {
              this.$message.info('请设置分析起点');
            }
            return;
          }
          let deviceIds = [];
          let shotTimes = new Date(this.shotTimes).getTime();
          
          this.deviceList.map(item => {
            let val = new Date(item.shotTime).getTime();
            if (val >= shotTimes) {
              deviceIds.push(item.deviceID);
            }
          });
          const params = {
            targetPicUrl: this.dialogImageUrl,
            deviceId: deviceIds.join(','),
            deviceName: this.addForm.deviceName,
            startTime: formatDate(this.addForm.startTime),
            endTime: formatDate(this.addForm.endTime),
            taskName: this.addForm.taskName,
            interval: this.addForm.interval
          };

          this.isAddLoading = true;
          getPersonFollowing(params)
            .then(res => {
              if (res && res.code === '00000000') {
                this.$message({
                  type: 'success',
                  message: '新建成功',
                  customClass: 'request_tip'
                });
                this.isAddLoading = false;

                this.getDataList();
                this.cancelAdd('addForm');
              } else {
                this.isAddLoading = false;
              }
            })
            .catch(() => {this.isAddLoading = false;})
        }
      });
    },
    // 跳至分析结果页面
    skipResultPage (obj) {
      this.$router.push({name: 'gzws_result', query: { id: obj.uid }});
    },
    // 显示新建任务弹出框
    showAddTaskDialog () {
      this.addTaskDialog = true;

      this.addForm = {
        taskName: null, // 任务名称
        deviceCode: null, // 起点设备编号
        deviceName: null, // 起点设备名称
        dateTime: [dateOrigin(false, new Date(new Date() - 24 * 60 * 60 * 1000)), new Date()],
        interval: 3 // 尾随间隔
      };
      this.dialogImageUrl = null;
      this.uploadClear = {};
      
    },
    // 显示中断任务弹出框
    // showInterruptDialog (obj) {
    //   this.interruptDialog = true;
    //   this.taskId = obj.uid;
    // },
    // 显示删除任务弹出框
    showDeleteDialog (obj) {
      this.deleteDialog = true;
      this.taskId = obj.uid;
    },
    // 确认中断任务
    // sureInterruptTask () {
    //   if (this.taskId) {
    //     const params = {
    //       uid: this.taskId,
    //       taskType: 3, // 1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析
    //       taskStatus: 4 // 1：处理中 2：处理成功 3：处理失败 4：处理中断
    //     };
    //     this.isInterruptLoading = true;
    //     putAnalysisTask(params)
    //       .then(res => {
    //         if (res) {
    //           this.$message({
    //             type: 'success',
    //             message: '中断任务成功',
    //             customClass: 'request_tip'
    //           });
    //           this.interruptDialog = false;
    //           this.isInterruptLoading = false;
    //           this.getDataList();
    //         } else {
    //           this.isInterruptLoading = false;
    //         }
    //       })
    //       .catch(() => {this.isInterruptLoading = false;})
    //   }
    // },
    // 确认删除任务
    sureDeleteTask () {
      if (this.taskId) {
        const params = {
          uid: this.taskId,
          taskType: 3, // 1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析
          delFlag: true
        };
        this.isDeleteLoading = true;
        putAnalysisTask(params)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除任务成功',
                customClass: 'request_tip'
              });
              this.deleteDialog = false;
              this.isDeleteLoading = false;
              this.getDataList();
            } else {
              this.isDeleteLoading = false;
            }
          })
          .catch(() => {this.isDeleteLoading = false;})
      }
    },
    // 重启任务
    recoveryTask (obj) {
      // console.log('obj', obj);
      const webParam = obj.taskWebParam;
      if (obj.uid) {
        const params = {
          taskName: obj.taskName,
          ...webParam,
          uid: obj.uid,
        };
        getPersonFollowing(params)
          .then(res => {
            if (res && res.code === '00000000') {
              this.getDataList();
            }
          })
          .catch(() =>{})
      }
    },
    // 查询任务列表数据
    selectDataList () {
      this.getDataList();
    },
    // 重置查询条件
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getDataList();
    },
    // 分页
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getDataList();
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
.gzws_container {
  height: 100%;
  overflow: hidden;
  // .pt_breadcrumb {
  //   .vc_gcck_bd {
  //     width: 100%;
  //   }
  // }
  .gzws_content_box {
    display: flex;
    height: 100%;
    .content_left {
      width: 272px;
      height: 100%;
      padding-bottom: 50px;
      box-shadow: 2px 3px 10px 0px rgba(131, 131, 131, 0.28);
      background-color: #ffffff;
      .left_form {
        width: 100%;
        padding: 10px 10px 0 10px;
        font-size: 12px !important;
        .reset_btn, .select_btn {
          width: 110px;
        }
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
    .content_box {
      width: calc(100% - 272px);
      height: calc(100% - 100px);
      margin: 20px;
      background: #ffffff;
      box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
      .tab-menu {
        background-color: #fff;
        padding-top: 8px;
        overflow: hidden;
        border-bottom: 1px solid #f2f2f2;
        li {
          float: left;
          width: auto;
          font-size: 16px;
          margin: 0 20px;
          height: 44px;
          line-height: 44px;
          text-align: center;
          color: #333;
          cursor: pointer;
        }
        .is-active {
          color: #0c70f8;
          border-bottom: 2px solid #0c70f8;
        }
      }
      .search_box {
        margin: 20px;
        .divide {
          border: 1px dashed #fafafa;
        }
      }
      .table_box {
        margin: 0 20px;
        .add_btn {
          margin-bottom: 10px;
        }
        .operation_btn {
          display: inline-block;
          padding: 0 10px;
          border-right: 1px solid #f2f2f2;
          &:last-child {
            border-right: none;
          }
        }
      }
      .result_gzws_list {
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

  }
}
</style>
<style lang="scss">
.__view {
  height: 100%;
  .result_gzws_list {
    height: calc(100% - 53px);
  }
}
.gzws_container {
  .el-form-item {
    margin-bottom: 10px;
  }
  .operation_button {
    margin-top: 20px;
  }
}
</style>
