<template>
<vue-scroll>
  <div class="ctc-list">
    <div class="search_box">
      <el-form :inline="true" :model="ctcForm" class="ctc_form" ref="ctcForm">
        <el-form-item prop="reportTime">
          <el-date-picker
            style="width: 260px;"
            v-model="ctcForm.reportTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="eventStatus">
          <el-select v-model="ctcForm.eventStatus" style="width: 240px;" placeholder="事件状态">
            <el-option value='全部状态'></el-option>
            <el-option
              v-for="(item, index) in ctcStatusList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="phoneOrNumber">
          <el-input style="width: 240px;" type="text" placeholder="请输入提交者手机号或编号" v-model="ctcForm.phoneOrNumber" />
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn" @click="selectDataList">查询</el-button>
          <el-button class="reset_btn" @click="resetForm('ctcForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="divide"></div>
    </div>
    <div class="table_box">
      <el-table
        class="ctc_table"
        :data="ctcList"
        >
        <el-table-column
          fixed
          label="编号"
          prop="eventCode"
          :show-overflow-tooltip='true'
          >
        </el-table-column>
        <el-table-column
          label="手机号"
          prop="reporterPhone"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="身份"
          prop="reporterRole"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <span v-if='scope.row.reporterRole'>{{scope.row.reporterRole}}</span>
            <span v-else-if='!scope.row.reporterUser'>市民</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          label="类型"
          prop="eventTypeName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="状态"
          prop="dispatchStatusName"
          >
          <template slot-scope="scope">
            <span class="event_status" :class="[scope.row.dispatchStatusName === '进行中' ? 'treating_event' : 'end_event']">{{scope.row.dispatchStatusName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="调度时间"
          prop="acceptTime"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="地点"
          prop="eventAddress"
          width="250"
          :show-overflow-tooltip='true'
          >
        </el-table-column>
        <el-table-column
          label="新反馈数量"
          prop="feedbackNumber"
          align="center"
        >
        <template slot-scope="scope">
          <span :style="[scope.row.feedbackNumber > 0 ? blueStyle : cusStyle]">{{scope.row.feedbackNumber}}</span>
        </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <span class="operation_btn" @click="skipCtcDetailPage(scope.row)">查看</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="pagination.pageNum"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
  </div>
</vue-scroll>
</template>
<script>
import { formatDate } from '@/utils/util.js';
import { dataList } from '@/utils/data.js';
import { getEventList, updateProcess } from '@/views/index/api/api.event.js';
import { getDiciData } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      blueStyle: {
        'color': '#6262FF'
      },
      cusStyle: {
        'color': '#666666'
      },
      ctcForm: {
        eventFlag: 1, // 1--true 0--false
        mutualFlag: 0,
        reportTime: [], // 日期
        eventStatus: '28', // 事件状态--默认进行中
        phoneOrNumber: null // 手机号或事件编号
      },
      ctcList: [], // 表格数据
      ctcStatusList: [], // 调度事件状态
    }
  },
  mounted () {
    this.getOneMonth();
    this.getCtcStatusList();
    this.getCtcList();
  },
  methods: {
    // 获取调度事件状态数据
    getCtcStatusList () {
      const status = dataList.ctcStatus;
      getDiciData(status)
        .then(res => {
          if (res) {
            res.data.map(item => {
              if (item.uid !== 27) {
                this.ctcStatusList.push(item);
              }
            })
          }
        })
        .catch(() => {})
    },
    // 获取调度指挥列表数据
    getCtcList () {
      let eventStatus;
      if (this.ctcForm.eventStatus === '全部状态') {
        eventStatus = null;
      } else {
        eventStatus = this.ctcForm.eventStatus;
      }
      const params = {
        'where.eventFlag': this.ctcForm.eventFlag,
        'where.mutualFlag': this.ctcForm.mutualFlag,
        'where.reportTimeStart': this.ctcForm.reportTime[0],
        'where.reportTimeEnd': this.ctcForm.reportTime[1],
        'where.otherQuery': this.ctcForm.phoneOrNumber,
        'where.dispatchStatus': eventStatus,
        pageNum: this.pagination.pageNum,
        orderBy: 'create_time',
        order: 'desc'
      }
      getEventList(params)
        .then(res => {
          if(res) {
            this.ctcList = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getCtcList();
    },
    getOneMonth () { // 设置默认一个月
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      const startDate = formatDate(start, 'yyyy-MM-dd');
      const endDate = formatDate(end, 'yyyy-MM-dd');
      this.ctcForm.reportTime.push(startDate);
      this.ctcForm.reportTime.push(endDate);
    },
    // 根据搜索条件查询
    selectDataList () {
      this.getCtcList();
    },
    // 重置查询条件
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getOneMonth();
      this.getCtcList();
    },
    // 跳至调度指挥详情页
    skipCtcDetailPage (obj) {
      // 在点击查看的时候将新反馈数量清零
      if (obj.reportContent > 0) {
        const params = {
          'read_flag': true
        }
        updateProcess(obj.uid, params)
          .then(res => {console.log(res);})
          .catch(() => {})
      }
      if (obj.dispatchStatusName === '进行中') {
        this.$router.push({name: 'ctc_detail_info', query: {status: 'ctc_ing', id: obj.eventId }});
      }
      if (obj.dispatchStatusName === '已结束') {
        this.$router.push({name: 'ctc_detail_info', query: {status: 'ctc_end', id: obj.eventId }});
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ctc-list {
  width: 98%;
  position: relative;
  top: 20px;
  left: 1%;
  background: #ffffff;
  box-shadow: 4px 0px 10px 0px rgba(131,131,131,0.28);
  .search_box {
    width: 100%;
    padding: 20px;
    .ctc_form {
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
    .ctc_table {
      margin-top: 8px;
      .event_status {
        &:before {
          content: '.';
          font-size: 30px;
          position: absolute;
          left: 0;
          top: 3px;
        }
      }
      .untreated_event {
        &:before {
          color: #0C70F8;
        }
      }
      .treating_event {
        &:before {
          color: #63C751;
        }
      }
      .end_event {
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
    }
  }
}
</style>