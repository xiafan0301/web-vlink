<template>
<vue-scroll>
  <div class="audit">
    <div class="search_box">
      <el-form :inline="true" :model="auditForm" class="event_form" ref="auditForm">
        <el-form-item>
          <el-date-picker
            style="width: 260px;"
            v-model="auditForm.reportTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="auditForm.eventStatus" style="width: 240px;" placeholder="审核状态">
            <el-option value='全部状态'></el-option>
            <el-option
              v-for="(item, index) in auditStatusList"
              :key="index"
              :label="item.enumValue"
              :value="item.uid"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="auditForm.eventType" style="width: 240px;" placeholder="事件类型">
            <el-option value='全部类型'></el-option>
            <el-option
              v-for="(item, index) in eventTypeList"
              :key="index"
              :label="item.enumValue"
              :value="item.uid"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="auditForm.userName" style="width: 240px;" placeholder="上报者身份">
            <el-option value='全部上报者'></el-option>
            <el-option
              v-for="(item, index) in identityList"
              :key="index"
              :label="item.enumValue"
              :value="item.uid"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input style="width: 240px;" type="text" placeholder="请输入上报者手机号" v-model="auditForm.phoneOrNumber" />
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn" @click="selectDataList('auditForm')">查询</el-button>
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
        :data="dataList"
        >
        <el-table-column
          fixed
          label="审核状态"
          prop="status"
          :show-overflow-tooltip='true'
          >
          <template slot-scope="scope">
            <span class="event_status"
              :class="[scope.row.status === '待审核' ? 'untreated_event'
                : scope.row.status === '通过' ? 'treating_event' : 'end_event']">
                {{scope.row.status}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="类型"
          prop="eventType"
          show-overflow-tooltip
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
          label="上报时间"
          prop="time"
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
          label="上报内容"
          prop="content"
          :show-overflow-tooltip='true'
        >
        </el-table-column>
        <el-table-column
          label="是否有图或视频"
          width="150"
          prop="isPicture"
          align="center"
          >
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <span class="operation_btn" @click="skipDetailPage(scope.row)">查看</span>
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
</vue-scroll>
</template>
<script>
import { formatDate } from '@/utils/util.js';
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      auditForm: {
        reportTime: [], // 日期
        eventType: '全部类型', // 事件类型
        eventStatus: '全部状态', // 事件状态
        userName: '全部上报者', // 上报者
        phoneOrNumber: null // 手机号或事件编号
      },
      isOpen: true, // 自动审核政务人员
      dataList: [
        {
          status: '待审核',
          eventType: '治安事件',
          reportUser: '18216061865',
          idCard: '市民',
          time: '2019-01-16',
          eventAddress: '长沙市芙蓉区远大二路208号',
          content: '创谷工业园门口有人聚众斗殴，这是一段描述，关于上报的描述文字内容…',
          isPicture: '是'
        },
        {
          status: '通过',
          eventType: '治安事件',
          reportUser: '18216061865',
          idCard: '市民',
          time: '2019-01-16',
          eventAddress: '长沙市芙蓉区远大二路208号',
          content: '创谷工业园门口有人聚众斗殴，这是一段描述，关于上报的描述文字内容…',
          isPicture: '是'
        },
        {
          status: '驳回',
          eventType: '治安事件',
          reportUser: '18216061865',
          idCard: '市民',
          time: '2019-01-16',
          eventAddress: '长沙市芙蓉区远大二路208号',
          content: '创谷工业园门口有人聚众斗殴，这是一段描述，关于上报的描述文字内容…',
          isPicture: '是'
        },
        {
          status: '待审核',
          eventType: '治安事件',
          reportUser: '18216061865',
          idCard: '市民',
          time: '2019-01-16',
          eventAddress: '长沙市芙蓉区远大二路208号',
          content: '创谷工业园门口有人聚众斗殴，这是一段描述，关于上报的描述文字内容…',
          isPicture: '是'
        },
        {
          status: '待审核',
          eventType: '治安事件',
          reportUser: '18216061865',
          idCard: '城管',
          time: '2019-01-16',
          eventAddress: '长沙市芙蓉区远大二路208号',
          content: '创谷工业园门口有人聚众斗殴，这是一段描述，关于上报的描述文字内容…',
          isPicture: '是'
        }
      ],
      auditStatusList: [], // 审核状态
      eventTypeList: [], // 事件类型
      identityList: [], // 上报者身份
    }
  },
  mounted () {
    this.getOneMonth();
    this.getAuditStatusList();
    this.getEventTypeList();
    this.getIdentityList();
  },
  methods: {
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
    // 获取上报者身份
    getIdentityList () {
      const identity = dataList.identity;
      getDiciData(identity)
        .then(res => {
          if (res) {
            this.identityList = res.data;
          }
        })
        .catch(() => {})
    },
    handleSizeChange () {

    },
    handleCurrentChange () {},
    skipAddEventPage () { // 跳到新增事件页面
      this.$router.push({name: 'add_event'});
    },
    skipDetailPage (obj) { // 跳转至事件审核详情页
      if (obj.status === '待审核') {
        this.$router.push({name: 'unaudit_event'});
      }
      if (obj.status === '通过') {
        this.$router.push({name: 'audit_event_detail', query: {status: 'pass'}});
      }
      if (obj.status === '驳回') {
        this.$router.push({name: 'audit_event_detail', query: {status: 'reject'}});
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
    selectDataList (form) {
      this.$refs[form].validator(valid => {
        if (valid) {
          console.log(valid);
        }
      })
    },
    // 重置查询条件
    resetForm (form) {
      this.eventForm.reportTime = [];
      this.$refs[form].resetFields();
      this.getOneMonth();
    },
    // 自动审核政务人员
    isAutoCheck (val) {
      console.log(val);
      
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