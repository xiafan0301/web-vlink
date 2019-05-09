<template>
<vue-scroll>
  <div class="audit">
    <div class="search_box">
      <el-form :inline="true" :model="auditForm" class="event_form" ref="auditForm">
        <el-form-item prop="reportTime">
          <el-date-picker
            style="width: 260px;"
            v-model="auditForm.reportTime"
            type="daterange"
            :clearable="false"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="eventStatus">
          <el-select v-model="auditForm.eventStatus" style="width: 240px;" placeholder="审核状态">
            <!-- <el-option value='全部状态'></el-option> -->
            <el-option
              v-for="(item, index) in auditStatusList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="eventType">
          <el-select v-model="auditForm.eventType" style="width: 240px;" placeholder="事件类型">
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
        <el-form-item prop="userName">
          <el-select v-model="auditForm.userName" style="width: 240px;" placeholder="上报者身份">
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
          <el-input style="width: 240px;" type="text" placeholder="请输入上报者手机号" v-model="auditForm.phoneOrNumber" />
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn" @click="selectDataList">查询</el-button>
          <el-button class="reset_btn" @click="resetForm('auditForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="divide"></div>
    </div>
    <div class="content-box">
      <div class="button_box">
        <div class="add_event_btn" @click="skipAddEventPage">
          <span>+</span>
          <span>新增事件</span>
        </div>
        <div class="select-checkbox">
          <span>自动审核政务人员的</span>
          <el-switch v-model="isOpen" @change="isAutoCheck"></el-switch>
        </div>
      </div>
      <el-table
        class="audit_table"
        :data="auditList"
        >
        <el-table-column
          label="审核状态"
          prop="acceptFlagName"
          :show-overflow-tooltip='true'
          >
          <template slot-scope="scope">
            <span class="event_status"
              :class="[scope.row.acceptFlagName === '待审核' ? 'untreated_event'
                : scope.row.acceptFlagName === '通过' ? 'treating_event' : 'end_event']">
                {{scope.row.acceptFlagName}}
            </span>
          </template>
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
          width="250"
          prop="eventAddress"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="上报内容"
          width="250"
          prop="eventDetail"
          :show-overflow-tooltip='true'
        >
        </el-table-column>
        <el-table-column
          label="是否有图或视频"
          prop="hasImageOrVideo"
          align="center"
          >
          <template slot-scope="scope">
            <span>{{scope.row.hasImageOrVideo ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <span class="operation_btn" @click="skipDetailPage(scope.row)">查看</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="onSizeChange"
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
import { getEventList, openAutoCheck } from '@/views/index/api/api.event.js';
import { getDepartmentList } from '@/views/index/api/api.manage.js';
import { getDiciData } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      auditForm: {
        reportTime: [], // 日期
        // eventSource: 16, // 事件来源 app端
        eventType: '全部类型', // 事件类型
        eventStatus: '1', // 事件状态--默认待审核
        userName: '全部上报者', // 上报者
        phoneOrNumber: null // 手机号或事件编号
      },
      isOpen: false, // 自动审核政务人员
      auditList: [],
      auditStatusList: [], // 审核状态
      eventTypeList: [], // 事件类型
      identityList: [], // 上报者身份
      autoCheckList: [], // 自动审核政务人员
      userInfo: {}, // 存储的用户信息
    }
  },
  created () {
    this.userInfo =  this.$store.state.loginUser;
  },
  mounted () {
    const status = window.localStorage.getItem('iaAutoCheck');
    if (status !== null) {
      if (status) {
        this.isOpen = true;
      } else {
        this.isOpen = false;
      }
    }
    this.getOneMonth();
    this.getAutoCheck();
    this.getAuditStatusList();
    this.getEventTypeList();
    this.getIdentityList();
    this.getAuditData();
  },
  methods: {
    // 获取事件列表数据
    getAuditData () {
      let eventType, userName;
      if (this.auditForm.eventType === '全部类型') {
        eventType = null;
      } else {
        eventType = this.auditForm.eventType;
      }
      if (this.auditForm.userName === '全部上报者') {
        userName = null;
      } else {
        userName = this.auditForm.userName;
      }
      const params = {
        'where.reportTimeStart': this.auditForm.reportTime[0],
        'where.reportTimeEnd': this.auditForm.reportTime[1],
        'where.acceptFlag': this.auditForm.eventStatus,
        'where.eventFlag': 1, // 是否是事件  1--是 0-否
        'where.eventType': eventType,
        'where.reporterUserRole': userName,
        'where.keyword': this.auditForm.phoneOrNumber,
        'where.eventSource': this.auditForm.eventSource,
        pageNum: this.pagination.pageNum,
        orderBy: 'report_time',
        order: 'asc'
      }
      getEventList(params)
        .then(res => {
          if (res && res.data.list) {
            this.auditList = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    // 获取自动审核政务人员
    getAutoCheck () {
      const id = dataList.autoCheck;
      getDiciData(id)
        .then(res => {
          if (res) {
            this.autoCheckList = res.data;
          }
        })
        .catch(() => {})
    },
    // 获取审核状态数据
    getAuditStatusList () {
      const status = dataList.auditStatus;
      getDiciData(status)
        .then(res => {
          if (res) {
            this.auditStatusList = res.data;
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
    // 获取上报者身份---部门列表
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
    onSizeChange (val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getAuditData();
    },
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getAuditData();
    },
    skipAddEventPage () { // 跳到新增事件页面
      this.$router.push({name: 'add_event'});
    },
    skipDetailPage (obj) { // 跳转至事件审核详情页
      if (obj.acceptFlagName === '待审核') {
        this.$router.push({name: 'unaudit_event', query: {eventId: obj.uid}});
      }
      if (obj.acceptFlagName === '通过') {
        this.$router.push({name: 'audit_event_detail', query: {status: 'pass', eventId: obj.uid}});
      }
      if (obj.acceptFlagName === '驳回') {
        this.$router.push({name: 'audit_event_detail', query: {status: 'reject', eventId: obj.uid}});
      }
    },
    getOneMonth () { // 设置默认一个月
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      const startDate = formatDate(start, 'yyyy-MM-dd');
      const endDate = formatDate(end, 'yyyy-MM-dd');
      this.auditForm.reportTime.push(startDate);
      this.auditForm.reportTime.push(endDate);
    },
    // 根据搜索条件查询
    selectDataList () {
      this.getAuditData();
    },
    // 重置查询条件
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getOneMonth();
      this.getAuditData();
    },
    // 自动审核政务人员
    isAutoCheck (val) {
      window.localStorage.setItem('iaAutoCheck', val); // 记住自动审核的状态
      let value  = '';
      if (val) {
        value = '1';
      } else {
        value = '0'
      }
      const params = {
        uid: this.autoCheckList[0].uid,
        desci: value,
        typeKey: dataList.autoCheck
      };
      openAutoCheck(params)
        .then(res => {
          if (res) {
            this.getAuditData();
          }
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.audit {
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
  .content-box {
    padding: 0 20px;
    .button_box {
      display: flex;
      justify-content: space-between;
      .add_event_btn {
        width: 108px;
        height: 40px;
        background-color: #0C70F8;
        color: #ffffff;
        font-size: 14px;
        line-height: 40px;
        text-align: center;
        border-radius: 3px;
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
    .audit_table {
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
          color: #F94539;
        }
      }
      .operation_btn {
        color: #0C70F8;
        cursor: pointer;
      }
    }
  }
}
</style>