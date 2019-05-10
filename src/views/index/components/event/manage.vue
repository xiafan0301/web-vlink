<template>
<vue-scroll>
  <div class="event-manage">
    <div class="search_box">
      <el-form :inline="true" :model="eventForm" class="event_form" ref="eventForm">
        <el-form-item prop="reportTime">
          <el-date-picker
            style="width: 260px;"
            v-model="eventForm.reportTime"
            type="daterange"
            :clearable="false"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="eventType">
          <el-select  style="width: 240px;" v-model="eventForm.eventType" placeholder="事件类型">
            <el-option value='全部类型'></el-option>
            <el-option
              v-for="(item, index) in eventTypeList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="eventStatus">
          <el-select style="width: 240px;" v-model="eventForm.eventStatus" placeholder="事件状态">
            <el-option value='全部状态'></el-option>
            <el-option
              v-for="(item, index) in eventStatusList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="userName">
          <el-select style="width: 240px;" v-model="eventForm.userName" placeholder="上报者身份">
            <el-option value='全部上报者'></el-option>
            <el-option
              v-for="(item, index) in identityList"
              :key="index"
              :label="item.organName"
              :value="item.uid"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="phoneOrNumber">
          <el-input style="width: 240px;" type="text" placeholder="请输入上报者手机号或事件编号" v-model="eventForm.phoneOrNumber" />
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn" @click="selectDataList">查询</el-button>
          <el-button class="reset_btn" @click="resetForm('eventForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="divide"></div>
    </div>
    <div class="table_box">
      <el-table
        class="event_table"
        :data="eventList"
        >
        <el-table-column
          label="事件编号"
          prop="eventCode"
          :show-overflow-tooltip='true'
          >
        </el-table-column>
        <el-table-column
          label="类型"
          prop="eventTypeName"
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
          label="上报时间"
          prop="reportTime"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="事件地点"
          prop="eventAddress"
          width="200"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="状态"
          prop="eventStatusName"
          >
          <template slot-scope="scope">
            <span class="event_status" :class="[scope.row.eventStatus === 1 ? 'untreated_event' : scope.row.eventStatus === 2 ? 'treating_event' : 'end_event']">{{scope.row.eventStatusName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="上报内容"
          prop="eventDetail"
          width="200"
          :show-overflow-tooltip='true'
        >
        </el-table-column>
        <el-table-column
          label="是否有布控结果"
          prop="surveillanceResult"
          show-overflow-tooltip
          align="center"
          >
          <template slot-scope="scope">
            <span>{{scope.row.surveillanceResult ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template slot-scope="scope">
            <span class="operation_btn" @click="skipEventDetailPage(scope.row)">查看</span>
            <span style="color: #f2f2f2">|</span>
            <template v-if="scope.row.eventStatusName === '已结束'">
              <span class="default_btn">布控</span>
            </template>
            <template v-else>
              <span class="operation_btn" @click="skipAddControlPage(scope.row)">布控</span>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="cum_pagination"
      @size-change="handleSizeChange"
      @current-change="onPageChange"
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
import { getEventList } from '@/views/index/api/api.event.js';
import { getDepartmentList } from '@/views/index/api/api.manage.js';
import { getDiciData } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      eventForm: {
        reportTime: [], // 日期
        eventType: '全部类型', // 事件类型
        eventStatus: '全部状态', // 事件状态
        userName: '全部上报者', // 上报者
        phoneOrNumber: null // 手机号或事件编号
      },
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      eventList: [], // 表格数据
      eventStatusList: [], // 事件状态数据
      eventTypeList: [], // 事件类型
      identityList: [], // 上报者身份
      userInfo: {}
    }
  },
  created () {
    this.userInfo =  this.$store.state.loginUser;
  },
  mounted () {
    this.getOneMonth();
    this.getEventStatusList();
    this.getEventTypeList();
    this.getIdentityList();
    this.getEventData();
  },
  methods: {
    // 获取事件状态数据
    getEventStatusList () {
      const status = dataList.eventStatus;
      getDiciData(status)
        .then(res => {
          if (res) {
            this.eventStatusList = res.data;
          }
        })
        .catch(() => {})
    },
    // 获取事件类型
    getEventTypeList () {
      const type = dataList.eventType;
      getDiciData(type)
        .then(res => {
          if (res) {
            this.eventTypeList = res.data;
          }
        })
        .catch(() => {})
    },
    // 获取上报者身份
    getIdentityList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0,
      };
      getDepartmentList(params)
        .then(res => {
          if (res && res.data.list) {
            this.identityList = res.data.list;
          }
        })
    },
    // 获取事件列表数据
    getEventData () {
      let eventType, eventStatus, userName;
      if (this.eventForm.eventType === '全部类型') {
        eventType = null;
      } else {
        eventType = this.eventForm.eventType;
      }
      if (this.eventForm.eventStatus === '全部状态') {
        eventStatus = null;
      } else {
        eventStatus = this.eventForm.eventStatus;
      }
      if (this.eventForm.userName === '全部上报者') {
        userName = null;
      } else {
        userName = this.eventForm.userName;
      }
      const params = {
        'where.reportTimeStart': this.eventForm.reportTime[0],
        'where.reportTimeEnd': this.eventForm.reportTime[1],
        'where.eventStatus': eventStatus,
        'where.eventFlag': 1, // 是否是事件  1--是 0-否
        'where.eventType': eventType,
        'where.reporterUserRole': userName,
        'where.keyword': this.eventForm.phoneOrNumber,
        'where.acceptFlag': 2, // 审核通过
        pageNum: this.pagination.pageNum,
        orderBy: 'report_time',
        order: 'asc'
      }
      getEventList(params)
        .then(res => {
          if (res && res.data.list) {
            this.eventList = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.getEventData();
    },
    handleSizeChange (val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getEventData();
    },
    // 跳至事件详情页
    skipEventDetailPage (obj) {
      if (obj.eventStatus === 1) {
        this.$router.push({name: 'untreat_event_detail', query: {status: 'unhandle', eventId: obj.uid}});
      }
      if (obj.eventStatus === 2) {
        this.$router.push({name: 'treating_event_detail', query: {status: 'handling', eventId: obj.uid}});
      }
      if (obj.eventStatus === 3) {
        this.$router.push({name: 'treating_event_detail', query: {status: 'ending', eventId: obj.uid}});
      }
    },
    // 跳至新增布控页面
    skipAddControlPage (obj) {
      if (obj.eventStatus === 1) {
        this.$router.push({path: '/control/create', query: {eventId: obj.uid}});
      } 
      if (obj.eventStatus === 2) {
        this.$router.push({path: '/control/manage', query: {controlId: obj.uid, pageType: 2, state: 1}});
      }
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
    selectDataList () {
      this.getEventData();
    },
    // 重置查询条件
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getOneMonth();
      this.getEventData();
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
      .default_btn {
        padding: 0 10px;
        display: inline-block;
        color: #B2B2B2;
      }
    }
  }
  
}
</style>