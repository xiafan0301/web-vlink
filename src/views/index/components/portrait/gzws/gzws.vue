<template>
  <div class="gzws_container">
    <div class="pt_breadcrumb">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ name: 'portrait' }">人像检索</el-breadcrumb-item>
        <el-breadcrumb-item>跟踪尾随</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add_btn" @click="showAddTaskDialog('add')">新建任务</el-button>
    </div>
    <div class="content_box">
      <ul class="tab-menu">
        <li
          v-for="(item,index) in tabList"
          :key="index"
          :class="{'is-active': selectIndex === item.value}"
          @click="selectTab(item.value)"
        >{{item.label}}</li>
      </ul>
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
              v-model="searchForm.reportTime"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button class="select_btn" @click="selectDataList">查询</el-button>
            <el-button class="reset_btn" @click="resetForm('searchForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="divide"></div>
      </div>
      <div class="table_box">
        <el-table :data="list">
          <el-table-column label="序号" type="index" width="100"></el-table-column>
          <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip></el-table-column>
          <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
          <el-table-column label="分析时间范围" prop="taskName" show-overflow-tooltip></el-table-column>
          <el-table-column label="尾随间隔" prop="taskName" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" v-if="selectIndex === 0" prop="taskStatus" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.taskStatus && scope.row.taskStatus === 1 ? '进行中' : scope.row.taskStatus === 3 ? '失败' : '已中断'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <span
                class="operation_btn"
                @click="skipResultPage(scope.row)"
                v-if="selectIndex === 1"
              >查看</span>
              <span
                class="operation_btn"
                @click="showInterruptDialog(scope.row)"
                v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus === 1"
              >中断任务</span>
              <span
                class="operation_btn"
                @click="recoveryTask(scope.row)"
                v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus === 4"
              >恢复任务</span>
              <span
                class="operation_btn"
                @click="showAddTaskDialog('edit', scope.row)"
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
    <el-dialog
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
    </el-dialog>
    <!--新建任务弹出框-->
    <el-dialog
      :title="isAddTaskTitle === true ? '新增分析任务' : '重启分析任务'"
      :visible.sync="addTaskDialog"
      width="720px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp dialog_comp_add"
      >
      <div class="content_body">
        <div class="left">
          <div :class="['upload_box', {'hidden': dialogImageUrl}]">
            <el-upload
              ref="uploadPic"
              accept="image/*"
              :limit="1"
              :action="uploadUrl"
              list-type="picture-card"
              :on-success="uploadPicSuccess"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
              :file-list="fileList">
              <i class="vl_icon vl_icon_vehicle_01"></i>
              <p class="upload_text" v-show="!dialogImageUrl">点击上传图片</p>
            </el-upload>
          </div>
        </div>
        <div class="right">
          <el-form class="left_form" :model="addForm" ref="addForm" :rules="rules">
            <el-form-item prop="taskName">
              <el-input placeholder="请输入任务名称，最多20字" maxlength="20" v-model="addForm.taskName"></el-input>
            </el-form-item>
            <el-form-item  prop="dateTime">
              <el-date-picker
                v-model="addForm.dateTime"
                style="width: 100%"
                :clearable="false"
                @change="handleDateTime"
                :picker-options="pickerDateTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="deviceCode">
              <el-select placeholder="请选择起点设备" style="width: 100%" v-model="addForm.deviceCode" @change="handleChangeDeviceCode">
                <el-option
                  v-for="(item, index) in deviceList"
                  :key="index"
                  :label="item.deviceName"
                  :value="item.deviceID"
                ></el-option>
              </el-select>
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
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetData('addForm')">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="searchData('addForm')">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from '../breadcrumb.vue';
import { ajaxCtx } from '@/config/config.js';
import { checkPlateNumber } from '@/utils/validator.js';
import { getShotDevice, getTailBehindList } from '@/views/index/api/api.judge.js';
import { getPersonShotDev, getPersonFollowing } from '@/views/index/api/api.portrait.js';
import { getTaskInfosPage, putAnalysisTask, putTaskInfosResume } from '@/views/index/api/api.analysis.js';
// import { dataList } from '@/utils/data.js';
// import { getDiciData } from '@/views/index/api/api.js';
import { formatDate } from '@/utils/util.js';
export default {
  components: { Breadcrumb },
  data () {
    const startTime = new Date() - 24 * 60 * 60 *1000;
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
      isAddTaskTitle: true, // 是否是新增任务
      selectIndex: 1, // 默认选中已完成的任务
      taskId: null, // 要操作的任务id
      deleteDialog: false, // 删除任务弹出框
      interruptDialog: false, // 中断任务弹出框
      addTaskDialog: false, // 新建任务弹出框
      isAddLoading: false, // 新建-恢复任务加载中
      isDeleteLoading: false, // 删除任务弹出框
      isInterruptLoading: false, // 中断任务弹出框
      fileList: [], // 图片上传列表
      dialogImageUrl: null,
      uploadUrl: ajaxCtx.base + '/new', // 图片上传地址
      deviceStartTime: null, // 起点设备抓拍时间
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      searchForm: {
        reportTime: [], // 日期
        taskName: null // 任务名称
      },
      addForm: {
        taskName: null, // 任务名称
        deviceCode: null, // 起点设备编号
        dateTime: [new Date((new Date() - (24 * 60 * 60 * 1000))), new Date()],
        // shotTime: new Date(startTime), // 开始时间
        // dateEnd: new Date(), // 结束时间
        // vehicleClass: [], // 车辆类型
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
      curImgNum: 0, // 图片数量
      curImageUrl: null,
      uploading: false
    }
  },
  created () {
    // this.getVehicleTypeList();
    this.getDataList();
  },
  methods: {
    // 时间选择change
    handleDateTime (val) {
      if (val) {
        if ( (new Date(val[1]).getTime() - new Date(val[0]).getTime()) >= 3* 24 * 3600 * 1000) {
          this.$message.warning('最多选择3天');
          this.addForm.dateTime = [new Date((new Date() - (24 * 60 * 60 * 1000))), new Date()];
        } else {
          if (this.dialogImageUrl) {
            this.getDeviceList();
          }
        }
      }
    },
    // 获取离线任务
    getDataList () {
      const params = {
        'where.taskName': this.searchForm.taskName,
        'where.taskType': 3, // 3：人员跟踪尾随分析
        'where.dateStart': this.searchForm.reportTime[0],
        'where.dateEnd': this.searchForm.reportTime[1],
        'where.isFinish': this.selectIndex,   //是否完成 0:未完成(包含处理中、处理失败、处理中断) 1：已完成(处理成功)
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        order: 'desc',
        orderBy: 'create_time'
      };
      getTaskInfosPage(params)
        .then(res => {
          if (res) {
            this.list = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    //tab切换
    selectTab(val) {
      this.selectIndex = val;
      this.getDataList();
    },
    // 删除图片
    handleRemove (file, fileList) {
      this.dialogImageUrl = null;
    },
    // 上传成功
    uploadPicSuccess (res) {
      if (res && res.data) {
        this.dialogImageUrl = res.data.fileFullPath;
        if (this.addForm.dateTime && this.addForm.dateTime.length !== 0) {
          this.getDeviceList();
        }
      }
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
    // 获取抓拍设备列表
    getDeviceList () {
      this.deviceList = [];
      const params = {
        targetPicUrl : this.dialogImageUrl,
        startTime : formatDate(this.addForm.dateTime[0]),
        endTime: formatDate(this.addForm.dateTime[1])
      };
      console.log('params', params)
      getPersonShotDev(params)
        .then(res => {
          if (res) {
            this.deviceList = res.data;
          }
        })
    },
    // 起点设备change
    handleChangeDeviceCode (obj) {
      // if (obj) {
      //   this.deviceList.map(item => {
      //     if (item.deviceID === obj) {
      //       // this.deviceStartTime = item.shotTime;
      //     }
      //   })
      // }
    },
    // 跳至尾随记录页面
    skipWsReocrdPage (obj) {
      this.$router.push({name: 'gzws_detail'})
      // this.$router.push({name: 'gzws_detail', query: { 
      //   plateNo: this.addForm.plateNo,
      //   dateStart: this.deviceStartTime,
      //   dateEnd: this.addForm.dateEnd,
      //   plateNoTb: obj.plateNo,
      //   dateStartTb: obj.shotTime
      //  }});
    },
    // 重置查询条件
    resetData (form) {
      this.$refs[form].resetFields();
      this.addTaskDialog = false;
      this.dialogImageUrl = null;
    },
    // 搜索数据
    searchData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (!this.dialogImageUrl) {
             this.$message({
              type: 'warning',
              message: '请先上传目标人员全身照',
              customClass: 'request_tip'
            });
            return;
          }
          if (this.dialogImageUrl && !this.addForm.deviceCode) {
            this.$message({
              type: 'warning',
              message: '请设置分析起点',
              customClass: 'request_tip'
            });
            return;
          };
          // const vehicleType = this.addForm.vehicleClass.join(':');
          const params = {
            targetPicUrl: this.dialogImageUrl,
            deviceId: this.addForm.deviceCode,
            startTime: formatDate(this.addForm.dateTime[0]),
            endTime: formatDate(this.addForm.dateTime[1]),
            taskName: this.addForm.plateNo,
            interval: this.addForm.interval
          };
          this.isAddLoading = true;
          getPersonFollowing(params)
            .then(res => {
              if (res && res.data) {
                this.$message({
                  type: 'success',
                  message: '新建成功',
                  customClass: 'request_tip'
                });
                // this.dataList = res.data;
                this.isAddLoading = false;
                this.addTaskDialog = false;
                this.getDataList();
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
    showAddTaskDialog (type, obj) {
      if (type === 'add') {
        this.isAddTaskTitle = true;
      } else {
        this.isAddTaskTitle = false;
      }
      this.addTaskDialog = true;
    },
    // 显示中断任务弹出框
    showInterruptDialog (obj) {
      this.interruptDialog = true;
      this.taskId = obj.uid;
    },
    // 显示删除任务弹出框
    showDeleteDialog (obj) {
      this.deleteDialog = true;
      this.taskId = obj.uid;
    },
    // 确认中断任务
    sureInterruptTask () {
      if (this.taskId) {
        const params = {
          uid: this.taskId,
          taskType: 3, // 1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析
          taskStatus: 4 // 1：处理中 2：处理成功 3：处理失败 4：处理中断
        };
        this.isInterruptLoading = true;
        putAnalysisTask(params)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '中断任务成功',
                customClass: 'request_tip'
              });
              this.interruptDialog = false;
              this.isInterruptLoading = false;
              this.getDataList();
            } else {
              this.isInterruptLoading = false;
            }
          })
          .catch(() => {this.isInterruptLoading = false;})
      }
    },
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
    // 恢复任务
    recoveryTask (obj) {
      if (obj.uid) {
        const params = {
          uid: obj.uid,
          taskType: 3
        };
        putTaskInfosResume(params)
          .then(res => {
            if (res) {
              this.getDataList();
            }
          })
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
.gzws_container {
  height: 100%;
  .pt_breadcrumb {
    display: flex;
    justify-content: space-between;
    height: 50px; width: 100%;
    padding-left: 20px;
    align-items: center;
    border-bottom: 1px solid #f6f6f6;
    box-shadow: 0 0 5px #ddd;
    background-color: #fff;
    .add_btn {
      background-color: #0C70F8;
      color: #ffffff;
      border-radius: 4px;
      margin-right: 10px;
    }
  }
  .content_box {
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
      .operation_btn {
        display: inline-block;
        padding: 0 10px;
        border-right: 1px solid #f2f2f2;
        &:last-child {
          border-right: none;
        }
      }
    }
  }
  .reset_btn {
    // width: 110px;
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
    // width: 110px;
    background-color: #0C70F8;
    color: #ffffff;
    border-radius: 4px;
  }
}
.dialog_comp_add {
  .content_body {
    display: flex;
    .left {
      border-right: 1px dashed #F2F2F2;
      width: 400px;
      .upload_box {
        text-align: center;
        margin-left: 10px;
        width: 225px;
        height: 225px;
        overflow: hidden;
        margin-top: 30px;
        // margin-bottom: 25px;
        /deep/ .el-upload {
          width: 225px;
          height: 225px;
          
          i {
            width: 120px;
            height: 110px;
            margin-top: 40px;
            margin-left: 15px;
          }
          .upload_text {
            line-height: 0;
            color: #999999;
            margin-top: -50px;
          }
          &:hover{
            background: #0C70F8;
            // i.vl_icon_control_14 {
            //   background-position: -228px -570px;
            // }
            .upload_text {
              color: #ffffff;
            }
          }
        }
        &.hidden /deep/ .el-upload--picture-card{
          display: none!important;
        }
        /deep/ .el-upload-list__item {
          width: 225px;
          height: 225px;
        }
      }
      // .upload_box {
      //   padding: 15px 20px;
      //   //  .img_list {
      //   //    display: flex;
      //   //    margin-top: 10px;
      //   //    .img_box {
      //   //     width: 70px;
      //   //     height: 70px;
      //   //     background:rgba(255,255,255,1);
      //   //     border:1px dashed rgba(211,211,211,1);
      //   //     border-radius:1px;
      //   //     position: relative;
      //   //     &:hover {
      //   //       .delete_box {
      //   //         display: block;
      //   //       }
      //   //     }
      //   //     .delete_box {
      //   //       display: none;
      //   //       position: absolute;
      //   //       left: 0;
      //   //       top: 0;
      //   //       width: 100%;
      //   //       height: 100%;
      //   //       background-color: #000;
      //   //       opacity: 0.7;
      //   //       text-align: center;
      //   //       i {
      //   //         margin-top: 35%;
      //   //         cursor: pointer; 
      //   //       }
      //   //     }
      //   //     &:not(:last-child) {
      //   //       margin-right: 5px;
      //   //     }
      //   //     img {
      //   //       width: 100%;
      //   //       height: 100%;
      //   //     }
      //   //    }
      //   //  }
      //    /deep/ .el-upload {
      //     width: 225px;
      //     height: 225px;
      //     position: relative;
      //     .upload_text {
      //       line-height: 0;
      //       color: #999999;
      //       margin-top: -60px;
      //     }
      //     // >img {
      //     //   width: 100%;
      //     //   height: 100%;
      //     // }
      //     i {
      //       margin-top: 40px;
      //       margin-left: 15px;
      //       width: 120px;
      //       height: 120px;
      //     }
      //     &:hover {
      //       background: #2981F8;
      //       // i.vl_icon_control_14{
      //       //   background-position: -228px -570px;
      //       // }
      //       .upload_text {
      //         color: #ffffff;
      //       }
      //     }
      //   }
      //   &.hidden /deep/ .el-upload--picture-card {
      //     display: none!important;
      //   }
      //   /deep/ .el-upload-list__item {
      //     width: 225px;
      //     height: 225px;
      //   }
      // }
    }
    .right {
      width: 100%;
      .left_form {
        width: 100%;
        padding: 50px 20px 0;
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
  }
}
</style>