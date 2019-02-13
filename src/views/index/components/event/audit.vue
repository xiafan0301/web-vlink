<template>
  <div class="audit">
    <div class="search_box">
      <el-form :inline="true" :model="auditForm" class="event_form">
        <el-form-item style="width: 240px;">
          <el-date-picker
            style="width: 240px;"
            v-model="auditForm.dateTime"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="auditForm.eventType" style="width: 240px;">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="auditForm.eventStatus" style="width: 240px;">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="auditForm.userName" style="width: 240px;">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input style="width: 240px;" type="text" placeholder="请输入提交者手机号或事件编号" v-model="auditForm.phoneOrNumber" />
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn">查询</el-button>
          <el-button class="reset_btn">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="divide"></div>
    </div>
    <div class="content-box">
      <div class="select-checkbox">
        <span>自动审核政务人员的</span>
        <el-switch v-model="isOpen"></el-switch>
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
                : scope.row.status === '审核通过' ? 'treating_event' : 'end_event']">
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
            <span class="operation_btn" @click="skipDetailPage">查看</span>
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
      auditForm: {
        dateTime: null, // 日期
        eventType: null, // 事件类型
        eventStatus: null, // 事件状态
        userName: null, // 上报者
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
          status: '审核通过',
          eventType: '治安事件',
          reportUser: '18216061865',
          idCard: '市民',
          time: '2019-01-16',
          eventAddress: '长沙市芙蓉区远大二路208号',
          content: '创谷工业园门口有人聚众斗殴，这是一段描述，关于上报的描述文字内容…',
          isPicture: '是'
        },
        {
          status: '审核不通过',
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
      ]
    }
  },
  methods: {
    handleSizeChange () {

    },
    handleCurrentChange () {},
    skipDetailPage () { // 跳转至事件审核详情页
      this.$router.push({name: 'unaudit_event'});
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
    .select-checkbox {
      text-align: right;
      padding: 5px 0;
      span {
        color: #333333;
        margin-right: 5px;
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