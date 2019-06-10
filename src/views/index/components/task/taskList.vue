<template>
<vue-scroll>
  <div class="task-manage">
    <div class="search_box">
      <el-form :inline="true" :model="taskForm" class="task_form" ref="taskForm">
        <el-form-item prop="reportTime">
          <el-date-picker
            style="width: 260px;"
            v-model="taskForm.reportTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="taskType">
          <el-select  style="width: 240px;" v-model="taskForm.taskType" placeholder="事件类型">
            <el-option value='全部类型'></el-option>
            <el-option
              v-for="(item, index) in taskTypeList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="taskStatus">
          <el-select style="width: 240px;" v-model="taskForm.taskStatus" placeholder="事件状态">
            <el-option value='全部状态'></el-option>
            <el-option
              v-for="(item, index) in taskStatusList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn" @click="selectDataList">查询</el-button>
          <el-button class="reset_btn" @click="resetForm('taskForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="divide"></div>
    </div>
    <div class="table_box">
      <el-table
        class="task_table"
        :data="taskList"
        v-loading="isLoading"
        >
        <el-table-column
          label="状态"
          prop="readFlag"
          >
          <template slot-scope="scope">
            <span :class="scope.row.readFlag == 1 ? 'dot bg_blue' : 'dot bg_white'"></span>
            {{ dicFormater( taskStatus, scope.row.readFlag)}}
          </template>
        </el-table-column>
        <el-table-column
          label="类型"
          prop="processType"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            {{ dicFormater( taskType, scope.row.processType)}}
          </template>
        </el-table-column>
        <el-table-column
          label="发送者账号"
          prop="senderPhone"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="发送者部门"
          prop="senderDepartmentName"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <span v-if='scope.row.senderDepartmentName'>{{scope.row.senderDepartmentName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="发送者姓名"
          prop="senderName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="发送时间"
          prop="createTime"
          width="200"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template slot-scope="scope">
            <span class="operation_btn" @click="skipTaskDetailPage(scope.row)">查看</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template v-if="pagination.total > 0">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="onPageChange"
      :current-page.sync="pagination.pageNum"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pagination.total"
      class="cum_pagination">
    </el-pagination>
    </template>
  </div>
</vue-scroll>
</template>
<script>
import { formatDate } from '@/utils/util.js';
import { dataList } from '@/utils/data.js';
import { getTasks } from '@/views/index/api/api.event.js';
export default {
  data () {
    return {
      taskForm: {
        reportTime: [], // 日期
        taskType: '全部类型', // 事件类型
        taskStatus: '全部状态', // 事件状态
      },
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      taskList: [], // 表格数据
      taskStatusList: [], // 任务状态数据
      taskTypeList: [], // 任务类型
      identityList: [], // 上报者身份
      userInfo: {},
      isLoading: false,
      taskType: dataList.taskType,
      taskStatus: dataList.taskStatus,
    }
  },
  created () {
    this.userInfo =  this.$store.state.loginUser;
  },
  mounted () {
    let taskTypeL = this.dicFormater(dataList.taskType)
    let taskStatusL = this.dicFormater(dataList.taskStatus)
    this.taskTypeList = taskTypeL[0].dictList.filter(res => !(res.enumField == 4 || res.enumField == 6))
    this.taskStatusList = taskStatusL[0].dictList
    this.getOneMonth();
    this.getTaskData();
  },
  methods: {
    // 获取任务列表数据
    getTaskData () {
      this.isLoading = true;
      this.taskList = [];
      let taskType, taskStatus;
      if (this.taskForm.taskType === '全部类型') {
        taskType = null;
      } else {
        taskType = this.taskForm.taskType;
      }
      if (this.taskForm.taskStatus === '全部状态') {
        taskStatus = null;
      } else {
        taskStatus = this.taskForm.taskStatus;
      }
      let params = {
        'where.processType': taskType,
        'where.isRead': taskStatus,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        orderBy: 'create_time',
        order: 'desc',
      }
      if(this.taskForm.reportTime) {
        params['where.startTime'] = this.taskForm.reportTime[0];
        params['where.endTime'] = this.taskForm.reportTime[1];
      }
      getTasks(params)
        .then(res => {
          if (res && res.data.list) {
            this.taskList = res.data.list;
            this.pagination.total = res.data.total;
          }
          this.$nextTick(()=> {
            this.isLoading = false;
          })
        })
        .catch(() => {
          this.isLoading = false;
        })
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.getTaskData();
    },
    handleSizeChange (val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getTaskData();
    },
    // 跳至事件详情页
    skipTaskDetailPage (obj) {
      if(obj.dispatchType == 2) {
        this.$router.push({name: 'task_alarm_detail', query: { id: obj.eventId, processType: obj.processType,uid: obj.uid, dispatchType:obj.dispatchType, objType: obj.objType}});
      }else {
        this.$router.push({name: 'task_detail', query: { id: obj.eventId, processType: obj.processType,uid: obj.uid, dispatchType:obj.dispatchType}});
      }
    },
    getOneMonth () { // 设置默认一个月
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      const startDate = formatDate(start, 'yyyy-MM-dd');
      const endDate = formatDate(end, 'yyyy-MM-dd');
      this.taskForm.reportTime.push(startDate);
      this.taskForm.reportTime.push(endDate);
    },
    // 根据搜索条件查询
    selectDataList () {
      this.getTaskData();
    },
    // 重置查询条件
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getOneMonth();
      this.getTaskData();
    }
  }
}
</script>
<style lang="scss" scoped>
.task-manage {
  width: 98%;
  position: relative;
  top: 20px;
  left: 1%;
  background: #ffffff;
  box-shadow: 4px 0px 10px 0px rgba(131,131,131,0.28);
  .search_box {
    width: 100%;
    padding: 20px;
    .task_form {
      width: 100%;
      .select_btn, .reset_btn {
        width: 80px;
      }
      .select_btn {
        background-color: #0C70F8;
        color: #ffffff;
      }
      .reset_btn {
        background-color: #ffffff;
        color: #666666;
        border-color: #DDDDDD;
      }
    }
    .divide {
      border: 1px dashed #fafafa;
    }
  }
  .table_box {
    padding: 0 20px;
    .task_table {
      margin-top: 8px;
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: inline-block;
      }
      .bg_blue {
        background: #0C70F8;
      }
      .bg_white {
        background: #fff;
      }
      .hover-row {
        &:hover {
          .bg_white {
            background: #E6F7FF!important;
          }
        }
      }
      .task_status {
        &:before {
          content: '.';
          font-size: 30px;
          position: absolute;
          left: 0;
          top: 3px;
        }
      }
      .untreated_task {
        &:before {
          color: #0C70F8;
        }
      }
      .treating_task {
        &:before {
          color: #63C751;
        }
      }
      .end_task {
        &:before {
          color: #B8B8B8;
        }
      }
      .operation_btn {
        color: #0C70F8;
        cursor: pointer;
        padding: 0 10px;
        display: inline-block;
      }
      .default_btn {
        padding: 0 10px;
        display: inline-block;
        color: #B2B2B2;
      }
    }
  }
  
}
</style>