<template>
<vue-scroll>
  <div class="frequent-appearances">
    <ul class="tab-menu">
        <li v-for="(item,index) in tabList" :key="index" :class="{'is-active': selectIndex === item.value}" @click="selectTab(item.value)">{{item.label}}</li>
    </ul>
    <div class="search_box">
      <el-form :inline="true" :model="taskForm" class="event_form" ref="taskForm">
        <el-form-item prop="taskName">
          <el-input style="width: 240px;" type="text" placeholder="请输入任务名称" v-model="taskForm.taskName" />
        </el-form-item>
        <el-form-item prop="reportTime" class="time">
            <el-date-picker
                v-model="taskForm.reportTime"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn" @click="selectDataList">查询</el-button>
          <el-button class="reset_btn" @click="resetForm('taskForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="divide"></div>
    </div>
    <div class="content-box">
      <div class="button_box">
        <div class="add_event_btn" @click="skipAddTaskPage">
          <span>+</span>
          <span>新增分析任务</span>
        </div>
      </div>
      <div class="table_box">
      <el-table
        :data="list"
        >
        <el-table-column
                  label="序号"
                  type="index"
                  width="100"
                  >
        </el-table-column>
        <el-table-column
          label="任务名称"
          prop="name"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="date"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="相似度"
          prop="name"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="频次阈值"
          prop="name"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <span class="operation_btn" @click="skipDetailPage(scope.row)" v-if="selectIndex === 0">查看</span>
            <span class="operation_btn" @click="interruptDialog = true" v-if="selectIndex === 1 && scope.row.status">中断任务</span>
            <span class="operation_btn" @click="skipDetailPage(scope.row)" v-if="selectIndex === 1 && !scope.row.status">恢复任务</span>
            <span class="operation_btn" @click="deleteDialog = true" v-if="selectIndex === 1 && !scope.row.status">删除任务</span>
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
      :total="pagination.total">
    </el-pagination>
    </template>

    <!--中断任务弹出框-->
    <el-dialog
      title="中断任务确认?"
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
      <span style="color: #999999;">任务删除，任务的数据处理进程将被清理，人物不在可以恢复</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="deleteDialog = false">确认</el-button>
      </div>
    </el-dialog>
  </div>
</vue-scroll>
</template>
<script>
import { formatDate } from '@/utils/util.js';
import { dataList } from '@/utils/data.js';
import { getEventList } from '@/views/index/api/api.event.js';
import { getDepartmentList } from '@/views/index/api/api.manage.js';
import { getDiciData } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      tabList: [{
          label: '已完成任务',
          value: 0,
      },{
          label: '未完成任务',
          value: 1,
      }],
      selectIndex: 0,
      pagination: { total: 20, pageSize: 10, pageNum: 1 },
      taskForm: {
        reportTime: '', // 日期
        taskName: '' // 任务名称
      },
      list: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
            status: true,
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄',
            status: false,
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄',
            status: false,
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
            status: true,
      }],      //已完成列表
      userInfo: {}, // 存储的用户信息
      deleteDialog: false,
      interruptDialog: false,    //中断任务
    }
  },
  created () {
    this.userInfo =  this.$store.state.loginUser;
  },
  mounted () {
    
  },
  methods: {
    //tab切换
    selectTab(val) {
        this.selectIndex = val;
    },
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
    },
    // 根据搜索条件查询
    selectDataList () {
    },
    // 重置查询条件
    resetForm (form) {
      this.$refs[form].resetFields();
    },
    skipAddTaskPage () { // 跳到新增任务页面
      this.$router.push({name: 'portrait_xjpfcm'});
    },
    // 跳至详情页面
    skipDetailPage (obj) {
      this.$router.push({name: 'portrait_xjpfcm'});
    },
  }
}
</script>
<style lang="scss" scoped>
.frequent-appearances {
  width: 98%;
  position: relative;
  top: 20px;
  left: 1%;
  background: #ffffff;
  box-shadow: 4px 0px 10px 0px rgba(131,131,131,0.28);
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
        color: #0C70F8;
        border-bottom: 1px solid #0C70F8;
    }
  }
  .search_box {
    width: 100%;
    padding: 20px;
    .event_form {
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
  .content-box {
    padding: 0 20px;
    .button_box {
      display: flex;
      justify-content: space-between;
      .add_event_btn {
        height: 40px;
        background-color: #0C70F8;
        color: #ffffff;
        font-size: 14px;
        line-height: 40px;
        text-align: center;
        border-radius: 3px;
        padding: 0 16px;
        cursor: pointer;
        span:nth-child(1) {
          font-size: 16px;
        }
        span:nth-child(2) {
          margin-left: 5px;
        }
      }
      .select-checkbox {
        padding: 5px 0;
        span {
          color: #333333;
          margin-right: 5px;
        }
      }
    }
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
</style>
