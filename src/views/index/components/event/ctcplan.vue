<template>
  <div class="plan-list">
    <div class="search_box">
      <el-form :inline="true" :model="planForm" class="ctc_form">
        <el-form-item>
          <el-select v-model="planForm.eventType" style="width: 240px;">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="planForm.eventLevel" style="width: 240px;">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-input style="width: 240px;" type="text" placeholder="请输入预案名称筛选查找" v-model="planForm.phoneOrNumber" />
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn" type="primary">查询</el-button>
          <el-button class="reset_btn" type="primary">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="divide"></div>
    </div>
    <div class="table_box">
      <div class="add_plan_btn" @click="skipAddPlanPage">
        <span>+</span>
        <span>新增预案</span>
      </div>
      <el-table
        class="plan_table"
        :data="planList"
        >
        <el-table-column
          fixed
          label="序号"
          type="index"
          >
        </el-table-column>
        <el-table-column
          label="预案名称"
          prop="planName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="预案类型"
          prop="planType"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="适用事件等级"
          prop="eventLevel"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="创建用户"
          prop="createUser"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <span class="operation_btn">查看</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn">修改</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn">删除</span>
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
      planForm: {
        dateTime: null, // 日期
        eventLevel: null,
        planType: null,
        phoneOrNumber: null // 手机号或事件编号
      },
       planList: [
        {
          planName: '公共区域消防安全应急预案公共区域消防安全应急预案',
          planType: '事故灾难',
          eventLevel: 'IV级（一般）、V级（较大）',
          createUser: 'admin',
          createTime: '2019-01-21 13:57:33'
        },
        {
          planName: '公共区域消防安全应急预案公共区域消防安全应急预案',
          planType: '事故灾难',
          eventLevel: 'IV级（一般）、V级（较大）',
          createUser: 'admin',
          createTime: '2019-01-21 13:57:33'
        },
        {
          planName: '公共区域消防安全应急预案公共区域消防安全应急预案',
          planType: '事故灾难',
          eventLevel: 'IV级（一般）、V级（较大）',
          createUser: 'admin',
          createTime: '2019-01-21 13:57:33'
        },
        {
          planName: '公共区域消防安全应急预案公共区域消防安全应急预案',
          planType: '事故灾难',
          eventLevel: 'IV级（一般）、V级（较大）',
          createUser: 'admin',
          createTime: '2019-01-21 13:57:33'
        },
        {
          planName: '公共区域消防安全应急预案公共区域消防安全应急预案',
          planType: '事故灾难',
          eventLevel: 'IV级（一般）、V级（较大）',
          createUser: 'admin',
          createTime: '2019-01-21 13:57:33'
        }
      ] // 表格数据
    }
  },
  methods: {
    handleSizeChange () {

    },
    handleCurrentChange () {},
    skipAddPlanPage () { // 跳到新增预案页面
      this.$router.push({name: 'add_plan'});
    }
  }
}
</script>
<style lang="scss" scoped>
.plan-list {
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
    .add_plan_btn {
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
    .plan_table {
      margin-top: 8px;
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