<template>
  <div class="tirotation_setting">
    <div class="search_box">
      <el-form :inline="true" :model="searchForm" class="search_form">
        <el-form-item>
          <el-date-picker
            style="width: 260px;"
            v-model="searchForm.dateTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.eventType" style="width: 240px;" placeholder="全部状态">
            <!-- <option label="全部状态" value="全部状态"></option> -->
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn">查询</el-button>
          <el-button class="reset_btn">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="divide"></div>
    </div>
    <div class="table_box">
      <div class="add_ratation_btn" @click="skipAddRatotionPage">
        <span>+</span>
        <span>新增轮训</span>
      </div>
      <el-table
        class="ratation_table"
        :data="dataList"
        >
        <el-table-column
          fixed
          label="预案编号"
          prop="planCode"
          :show-overflow-tooltip='true'
          >
        </el-table-column>
        <el-table-column
          label="预案名称"
          prop="planName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="开始时间"
          prop="startTime"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="结束时间"
          prop="endTime"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="轮巡状态"
          prop="eventStatus"
          >
          <template slot-scope="scope">
            <span class="event_status" :class="[scope.row.eventStatus === '待开始' ? 'untreated_event' : scope.row.eventStatus === '进行中' ? 'treating_event' : 'end_event']">{{scope.row.eventStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="轮巡间隔(秒)"
          prop="duration"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="画面数"
          prop="number"
          show-overflow-tooltip
          >
        </el-table-column>
        
        <el-table-column
          label="轮巡设备"
          prop="deviceNumber"
          :show-overflow-tooltip='true'
        >
        </el-table-column>
        <el-table-column
          label="更新时间"
          width="150"
          prop="updateTime"
          show-overflow-tooltip
          align="center"
          >
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <span class="operation_btn">查看</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn">编辑</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showDeleteDialog(scope)">删除</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showCloseDialog(scope)">关闭</span>
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
    <!--关闭轮巡弹出框-->
    <el-dialog
      title="是否关闭该轮巡任务?"
      :visible.sync="closeRatationDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">关闭后不可恢复。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeRatationDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="closeRatationDialog = false">确认</el-button>
      </div>
    </el-dialog>
    <!--删除弹出框-->
    <el-dialog
      title="是否确定删除该轮巡任务?"
      :visible.sync="delRotationDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">删除后数据不可恢复。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delRotationDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="delRotationDialog = false">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      currentPage4: 1,
      searchForm: {
        dateTime: null,
        eventType: null
      },
      dataList: [
        {
          planCode: '2018110601220181106012',
          planName: '预案名称1预案名称1',
          startTime: '2018-12-12 12:12:12',
          endTime: '2018-12-12 12:12:12',
          eventStatus: '待开始',
          duration: 100,
          number: 12,
          deviceNumber: 123,
          updateTime: '2018-12-12 12:12:12'
        },
        {
          planCode: '2018110601220181106012',
          planName: '预案名称1预案名称1',
          startTime: '2018-12-12 12:12:12',
          endTime: '2018-12-12 12:12:12',
          eventStatus: '进行中',
          duration: 100,
          number: 12,
          deviceNumber: 123,
          updateTime: '2018-12-12 12:12:12'
        },
        {
          planCode: '2018110601220181106012',
          planName: '预案名称1预案名称1',
          startTime: '2018-12-12 12:12:12',
          endTime: '2018-12-12 12:12:12',
          eventStatus: '已结束',
          duration: 100,
          number: 12,
          deviceNumber: 123,
          updateTime: '2018-12-12 12:12:12'
        }
      ],
      closeRatationDialog: false, // 关闭轮巡弹出框
      delRotationDialog: false, // 删除轮巡弹出框
    }
  },
  methods: {
    handleSizeChange () {
    },
    handleCurrentChange () {},
    // 跳至新增轮巡页面
    skipAddRatotionPage () {
      this.$router.push({name: 'add_patrol'});
    },
    // 显示关闭轮巡弹出框
    showCloseDialog (obj) {
      console.log(obj);
      this.closeRatationDialog = true;
    },
    // 显示删除轮巡弹出框
    showDeleteDialog (obj) {
      console.log(obj);
      this.delRotationDialog = true;
    },
  }
}
</script>
<style lang="scss" scoped>
.tirotation_setting {
  background-color: #ffffff;
  padding: 20px;
  .search_box {
    width: 100%;
    .search_form {
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
    padding: 10px 0;
    .add_ratation_btn {
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
    .ratation_table {
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

