<template>
<vue-scroll>
  <div class="event-manage">
    <div class="search_box">
      <el-form :inline="true" :model="eventForm" class="event_form" ref="eventForm">
        <el-form-item>
          <el-date-picker
            style="width: 260px;"
            v-model="eventForm.reportTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select  style="width: 240px;" v-model="eventForm.eventType" placeholder="事件类型">
            <el-option value='全部类型'></el-option>
            <!-- <el-option
              v-for="item in eventStatusList"
              :key="item.dictId"
              :label="item.dictContent"
              :value="item.dictId"
            ></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select style="width: 240px;" v-model="eventForm.eventStatus" placeholder="事件状态">
            <el-option value='全部状态'></el-option>
            <!-- <el-option
              v-for="item in eventStatusList"
              :key="item.dictId"
              :label="item.dictContent"
              :value="item.dictId"
            ></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select style="width: 240px;" v-model="eventForm.phoneOrNumber" placeholder="上报者身份">
            <el-option value='全部上报者'></el-option>
            <!-- <el-option
              v-for="item in eventStatusList"
              :key="item.dictId"
              :label="item.dictContent"
              :value="item.dictId"
            ></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input style="width: 240px;" type="text" placeholder="请输入上报者手机号或事件编号" v-model="eventForm.phoneOrNumber" />
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn" @click="selectDataList('eventForm')">查询</el-button>
          <el-button class="reset_btn" @click="resetForm('eventForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="divide"></div>
    </div>
    <div class="table_box">
      <!-- <div class="add_event_btn" @click="skipAddEventPage">
        <span>+</span>
        <span>新增事件</span>
      </div> -->
      <el-table
        class="event_table"
        :data="eventList"
        >
        <el-table-column
          fixed
          label="事件编号"
          prop="eventCode"
          :show-overflow-tooltip='true'
          >
        </el-table-column>
        <el-table-column
          label="类型"
          prop="eventType"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="上报者"
          prop="reporterPhone"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <span v-if='scope.row.reporterPhone'>{{scope.row.reporterPhone}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column
          label="身份"
          prop="idCard"
          show-overflow-tooltip
          >
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
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="状态"
          prop="eventStatus"
          >
          <template slot-scope="scope">
            <span class="event_status" :class="[scope.row.eventStatus === '待处理' ? 'untreated_event' : scope.row.eventStatus === '处理中' ? 'treating_event' : 'end_event']">{{scope.row.eventStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="上报内容"
          prop="reportContent"
          :show-overflow-tooltip='true'
        >
        </el-table-column>
        <el-table-column
          label="是否有研判结果"
          width="150"
          prop="isResult"
          show-overflow-tooltip
          align="center"
          >
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <span class="operation_btn" @click="skipEventDetailPage(scope.row)">查看</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="skipAddControlPage(scope.row)">布控</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="onPageChange"
      :current-page="pagination.pageNum"
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
import { getEventList } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      eventForm: {
        reportTime: [], // 日期
        eventType: '全部类型', // 事件类型
        eventStatus: '全部状态', // 事件状态
        phoneOrNumber: null // 手机号或事件编号
      },
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      eventList: [
        {
          eventNumber: 'XP1000000000000',
          eventType: '治安事件',
          userName: '17899999999',
          idCard: '市民',
          createTime: '2018-05-15 18：40',
          eventAddress: '湖南省长沙市天心区创谷工业园',
          eventStatus: '待处理',
          reportContent: '创谷工业园门口有人聚众斗殴，这是一段关于斗殴字内容…',
          isResult: '是'
        },
        {
          eventCode: 'XP1000000000000',
          eventType: '治安事件',
          reportUser: '17899999999',
          idCard: '城管',
          reportTime: '2018-05-15 18：40',
          eventAddress: '湖南省长沙市天心区创谷工业园',
          eventStatus: '处理中',
          reportContent: '创谷工业园门口有人聚众斗殴，这是一段关于斗殴字内容…',
          isResult: '否'
        },
        {
          eventCode: 'XP1000000000000',
          eventType: '治安事件',
          reportUser: '17899999999',
          idCard: '接警员',
          reportTime: '2018-05-15 18：40',
          eventAddress: '湖南省长沙市天心区创谷工业园',
          eventStatus: '已结束',
          reportContent: '创谷工业园门口有人聚众斗殴，这是一段关于斗殴字内容…',
          isResult: '-'
        },
        {
          eventCode: 'XP1000000000000',
          eventType: '治安事件',
          reportUser: '17899999999',
          idCard: '市民',
          reportTime: '2018-05-15 18：40',
          eventAddress: '湖南省长沙市天心区创谷工业园',
          eventStatus: '待处理',
          reportContent: '创谷工业园门口有人聚众斗殴，这是一段关于斗殴字内容…',
          isResult: '是'
        },
        {
          eventCode: 'XP1000000000000',
          eventType: '治安事件',
          reportUser: '17899999999',
          idCard: '市民',
          reportTime: '2018-05-15 18：40',
          eventAddress: '湖南省长沙市天心区创谷工业园',
          eventStatus: '待处理',
          reportContent: '创谷工业园门口有人聚众斗殴，这是一段关于斗殴字内容…',
          isResult: '是'
        }
      ] // 表格数据
    }
  },
  mounted () {
    this.getOneMonth();
  },
  methods: {
    // 获取事件列表数据
    getEventData () {
      let eventType, eventStatus;
      if (this.eventForm.eventSource === '全部类型') {
        eventType = '';
      } else {
        eventType = this.eventForm.eventType;
      }
      if (this.eventForm.eventStatus === '全部状态') {
        eventStatus = '';
      } else {
        eventStatus = this.eventForm.eventStatus;
      }
      const params = {
        'where.eventFlag': true,
        'where.reportTimeStart': this.eventForm.reportTime[0],
        'where.reportTimeEnd': this.eventForm.reportTime[1],
        'where.eventStatus': eventStatus,
        'where.eventType': eventType,
        'where.otherQuery': this.eventForm.phoneOrNumber,
        pageNum: this.pagination.pageNum
      }
      getEventList(params)
        .then(res => {
          console.log(res);
          if (res && res.data.list) {
            this.eventList = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      // this.getCtcDataList();
    },
    handleSizeChange (val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      // this.getEventData();
    },
    // skipAddEventPage () { // 跳到新增事件页面
    //   this.$router.push({name: 'add_event'});
    // },
    // 跳至事件详情页
    skipEventDetailPage (obj) {
      if (obj.eventStatus === '待处理') {
        this.$router.push({name: 'untreat_event_detail', query: {status: 'unhandle'}});
      }
      if (obj.eventStatus === '处理中') {
        this.$router.push({name: 'treating_event_detail', query: {status: 'handling'}});
      }
      if (obj.eventStatus === '已结束') {
        this.$router.push({name: 'treating_event_detail', query: {status: 'ending'}});
      }
    },
    // 跳至新增布控页面
    skipAddControlPage (obj) {
      console.log(obj);
      this.$router.push({path: '/control/create'});
    },
    getOneMonth () { // 设置默认一个月
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      const startDate = formatDate(start, 'yyyy-MM-dd');
      const endDate = formatDate(end, 'yyyy-MM-dd');
      this.eventForm.reportTime.push(startDate);
      this.eventForm.reportTime.push(endDate);
    },
    // 根据搜索条件查询
    selectDataList (form) {
      console.log(form);
      // this.getEventData();
    },
    // 重置查询条件
    resetForm (form) {
      this.eventForm.reportTime = [];
      this.$refs[form].resetFields();
      this.getOneMonth();
      // this.getEventData();
    }
  }
}
</script>
<style lang="scss" scoped>
.event-manage {
  width: 98%;
  position: relative;
  top: 20px;
  left: 1%;
  background: #ffffff;
  box-shadow: 4px 0px 10px 0px rgba(131,131,131,0.28);
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
  .table_box {
    padding: 0 20px;
    // .add_event_btn {
    //   width: 108px;
    //   height: 40px;
    //   background-color: #0C70F8;
    //   color: #ffffff;
    //   font-size: 14px;
    //   line-height: 40px;
    //   text-align: center;
    //   border-radius: 3px;
    //   cursor: pointer;
    //   span:nth-child(1) {
    //     font-size: 16px;
    //   }
    //   span:nth-child(2) {
    //     margin-left: 5px;
    //   }
    // }
    .event_table {
      margin-top: 8px;
      // padding-bottom: 20px;
      // width: 100%;
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