<template>
  <div class="event-manage">
    <div class="search_box">
      <el-form :inline="true" :model="eventForm" class="event_form">
        <el-form-item style="width: 240px;">
          <el-date-picker
            style="width: 240px;"
            v-model="eventForm.dateTime"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="width: 120px;">
          <el-select v-model="eventForm.eventType">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 120px;">
          <el-select v-model="eventForm.eventStatus">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 120px;">
          <el-select v-model="eventForm.userName">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 240px;">
          <el-input style="width: 240px;" type="text" placeholder="请输入提交者手机号或事件编号" v-model="eventForm.phoneOrNumber" />
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn" type="primary">查询</el-button>
          <el-button class="reset_btn" type="primary">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="divide"></div>
    </div>
    <div class="table_box">
      <div class="add_event_btn" @click="skipAddEventPage">
        <span>+</span>
        <span>新增事件</span>
      </div>
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
            <span class="operation_btn">查看</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn">布控</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
  </div>
</template>
<script>
export default {
  data () {
    return {
      currentPage4: 1,
      eventForm: {
        dateTime: null, // 日期
        eventType: null, // 事件类型
        eventStatus: null, // 事件状态
        userName: null, // 上报者
        phoneOrNumber: null // 手机号或事件编号
      },
      eventList: [
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
  methods: {
    handleSizeChange () {

    },
    handleCurrentChange () {},
    skipAddEventPage () { // 跳到新增事件页面
      this.$router.push({name: 'add_event'});
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