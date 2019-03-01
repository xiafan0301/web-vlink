<template>
  <div class="ctc-list">
    <div class="search_box">
      <el-form :inline="true" :model="ctcForm" class="ctc_form" ref="ctcForm">
        <el-form-item>
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
        <el-form-item>
          <el-select v-model="ctcForm.eventStatus" style="width: 240px;" placeholder="事件状态">
            <el-option value='全部状态'></el-option>
            <!-- <el-option
              v-for="item in eventStatusList"
              :key="item.dictId"
              :label="item.dictContent"
              :value="item.dictId"
            ></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-input style="width: 240px;" type="text" placeholder="请输入提交者手机号或事件编号" v-model="ctcForm.phoneOrNumber" />
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn" @click="selectDataList('ctcForm')">查询</el-button>
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
          label="事件编号"
          prop="eventCode"
          :show-overflow-tooltip='true'
          >
        </el-table-column>
        <el-table-column
          label="上报者"
          prop="reportUser"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="身份"
          prop="idCard"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="类型"
          prop="eventType"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="状态"
          prop="eventStatus"
          >
          <template slot-scope="scope">
            <span class="event_status" :class="[scope.row.eventStatus === '待开始' ? 'untreated_event' : scope.row.eventStatus === '进行中' ? 'treating_event' : 'end_event']">{{scope.row.eventStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="上报时间"
          prop="reportTime"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="事件地点"
          prop="eventAddress"
          :show-overflow-tooltip='true'
          >
        </el-table-column>
        <el-table-column
          label="新反馈数量"
          prop="reportContent"
          align="center"
        >
        <template slot-scope="scope">
          <span :style="[scope.row.reportContent > 0 ? blueStyle : cusStyle]">{{scope.row.reportContent}}</span>
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
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.pageNum"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
  </div>
</template>
<script>
import { formatDate } from '@/utils/util.js';
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
        reportTime: [], // 日期
        eventStatus: null, // 事件状态
        phoneOrNumber: null // 手机号或事件编号
      },
       ctcList: [
        {
          eventCode: 'XP1000000000000',
          eventType: '治安事件',
          reportUser: '17899999999',
          idCard: '市民',
          reportTime: '2018-05-15 18：40',
          eventAddress: '湖南省长沙市天心区创谷工业园',
          eventStatus: '待开始',
          reportContent: 0,
        },
        {
          eventCode: 'XP1000000000000',
          eventType: '治安事件',
          reportUser: '17899999999',
          idCard: '城管',
          reportTime: '2018-05-15 18：40',
          eventAddress: '湖南省长沙市天心区创谷工业园',
          eventStatus: '进行中',
          reportContent: 1
        },
        {
          eventCode: 'XP1000000000000',
          eventType: '治安事件',
          reportUser: '17899999999',
          idCard: '接警员',
          reportTime: '2018-05-15 18：40',
          eventAddress: '湖南省长沙市天心区创谷工业园',
          eventStatus: '已结束',
          reportContent: 1
        },
        {
          eventCode: 'XP1000000000000',
          eventType: '治安事件',
          reportUser: '17899999999',
          idCard: '市民',
          reportTime: '2018-05-15 18：40',
          eventAddress: '湖南省长沙市天心区创谷工业园',
          eventStatus: '进行中',
          reportContent: 1
        },
        {
          eventCode: 'XP1000000000000',
          eventType: '治安事件',
          reportUser: '17899999999',
          idCard: '市民',
          reportTime: '2018-05-15 18：40',
          eventAddress: '湖南省长沙市天心区创谷工业园',
          eventStatus: '进行中',
          reportContent: 1
        }
      ] // 表格数据
    }
  },
  mounted () {
    this.getOneMonth();
  },
  methods: {
    handleSizeChange () {

    },
    handleCurrentChange () {},
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
    selectDataList (form) {
      this.$refs[form].validator(valid => {
        if (valid) {
          console.log(valid)
        }
      })
    },
    // 重置查询条件
    resetForm (form) {
      this.eventForm.reportTime = [];
      this.$refs[form].resetFields();
      this.getOneMonth();
    },
    // 跳至调度指挥详情页
    skipCtcDetailPage (obj) {
      if (obj.eventStatus === '进行中') {
        this.$router.push({name: 'ctc_detail_info', query: {status: 'ctc_ing'}});
      }
      if (obj.eventStatus === '已结束') {
        this.$router.push({name: 'ctc_detail_info', query: {status: 'ctc_end'}});
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