<template>
  <vue-scroll>
    <div class="frequent-appearances">
      <div class="th-breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/portrait/menu' }">人像检索</el-breadcrumb-item>
          <el-breadcrumb-item>同行分析</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button :loading="addLoadingbtn" @click="skipAddTaskPage" class="th-button-export-color">新建任务</el-button>
      </div>
      <div class="frequent-a-content">
        <ul class="tab-menu">
          <li
            v-for="(item,index) in tabList"
            :key="index"
            :class="{'is-active': selectIndex === item.value}"
            @click="selectTab(item.value)"
          >{{item.label}}</li>
        </ul>
        <div class="search_box">
          <el-form :inline="true" :model="taskForm" class="event_form" ref="taskForm">
            <el-form-item label="任务名称：" prop="taskName">
              <el-input
                style="width: 200px;"
                type="text"
                placeholder="请输入任务名称"
                v-model="taskForm.taskName"
              />
            </el-form-item>
            <el-form-item label="创建时间：" prop="reportTime">
              <el-date-picker
                v-model="taskForm.reportTime"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button class="select_btn" @click="selectDataList">查询</el-button>
              <el-button class="reset_btn" @click="resetForm('taskForm')">重置</el-button>
            </el-form-item>
          </el-form>
          <div class="divide"></div>
        </div>
        <div class="content-box">
          <div class="table_box">
            <el-table :data="list">
              <el-table-column label="序号" type="index" width="100"></el-table-column>
              <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip></el-table-column>
              <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
              <el-table-column label="分析时间范围" prop="createTime" show-overflow-tooltip></el-table-column>
              <el-table-column label="同行次数" prop="createTime" show-overflow-tooltip></el-table-column>
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
          </div>
        </div>
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
          <el-button class="operation_btn function_btn" @click="interruptDialog = false">确认</el-button>
        </div>
      </el-dialog>

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
          <el-button class="operation_btn function_btn" @click="deleteDialog = false">确认</el-button>
        </div>
      </el-dialog>
      <!--新建任务弹出框-->
      <!-- <el-dialog
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
                  range-separator="至"
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
      </el-dialog> -->
    </div>
  </vue-scroll>
</template>
<script>
import { getShotDevice, getTailBehindList } from '@/views/index/api/api.judge.js';
import { getTaskInfosPage, putAnalysisTask, putTaskInfosResume } from '@/views/index/api/api.analysis.js';
export default {
  data() {
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
      selectIndex: 1, // 默认已完成的任务
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      taskForm: {
        reportTime: [], // 日期
        taskName: null // 任务名称
      },
      list: [], //已完成列表
      taskId: null, // 任务id
      deleteDialog: false,
      interruptDialog: false, //中断任务
      addLoadingbtn: false
    };
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    // 获取离线任务
    getDataList () {
      const params = {
        'where.taskName': this.taskForm.taskName,
        'where.taskType': 2, // 2：人员同行分析
        'where.dateStart': this.taskForm.reportTime[0],
        'where.dateEnd': this.taskForm.reportTime[1],
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
    selectTab (val) {
      this.selectIndex = val;
      this.getDataList();
    },
    skipAddTaskPage() {
      // 跳到新增任务页面
      this.addLoadingbtn = true
    },
    // 跳至详情页面
    skipDetailPage(obj) {
      this.$router.push({ name: "peer_analysis_result" });
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
          taskType: 2, // 1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析
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
          taskType: 2, // 1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析
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
          uid: obj.uid
          // taskType: 3
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
};
</script>
<style lang="scss" scoped>
.frequent-appearances {
  width: 100%;
  height: calc(100% - 54px);
  .breadcrumb_heaer {
    background: #fff;
    border-bottom: 1px solid #D3D3D3;
  }
  .frequent-a-content {
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
      width: 100%;
      padding: 20px;
      .event_form {
        width: 100%;
        .select_btn,
        .reset_btn {
          width: 80px;
        }
        .select_btn {
          background-color: #0c70f8;
          color: #ffffff;
        }
        .reset_btn {
          background-color: #ffffff;
          color: #666666;
          border-color: #dddddd;
        }
      }
      .divide {
        border: 1px dashed #fafafa;
      }
    }
    .content-box {
      padding: 0 20px;
      .table_box {
        margin-top: 10px;
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
  }
}
</style>

<style lang="scss">
.frequent-appearances {
  .__view {
    width: 100% !important; // vue-scroll样式重置
  }
}
</style>

