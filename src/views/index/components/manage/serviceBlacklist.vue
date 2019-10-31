<template>
  <div class="service_blacklist">
    <div class="search_box">
      <el-form :inline="true" :model="searchForm" class="event_form" ref="searchForm">
        <el-form-item prop="phoneOrNumber">
          <el-input style="width: 240px;" type="text" placeholder="请输入用户姓名或手机号" v-model="searchForm.phoneOrNumber" />
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn" @click="selectDataList">查询</el-button>
          <el-button class="reset_btn" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="divide"></div>
    </div>
    <div class="content-box">
      <p style="color: #F56C6C;">服务黑名单用户不能在APP端操作一键报警和上报事件</p>
      <el-table
        class="data_table"
        :data="dataList"
        >
        <el-table-column
          label="序号"
          type="index"
          >
        </el-table-column>
        <el-table-column
          label="用户姓名"
          prop="userName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="手机号"
          prop="phone"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="屏蔽时间"
          prop="reportTime"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="备注"
          prop="remark"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <span class="operation_btn" @click="showRemoveDialog()">解除黑名单</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="cum_pagination"
      @current-change="handleCurrentChange"
      :current-page.sync="pagination.pageNum"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
    <!--解除黑名单弹出框-->
    <el-dialog
      title="解除黑名单"
      :visible.sync="removeDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">解除黑名单后，用户可在APP端上报事件和一键报警</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="removeDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="sureRemove">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      removeDialog: false, // 解除黑名单弹出框
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      searchForm: {
        phoneOrNumber: null
      },
      dataList: [
         {
           userName: '张安',
           phone: '18766666666',
           reportTime: '2019-12-12 12:12:12',
           remark: '阿三撒开了多久啊是看得见啊卡里的骄傲撒开了多久啊上课了觉得ask就的拉萨空间的立刻就拉萨的'
         },
         {
           userName: '张安',
           phone: '18766666666',
           reportTime: '2019-12-12 12:12:12',
           remark: '阿三撒开了多久啊是看得见啊卡里的骄傲撒开了多久啊上课了觉得ask就的拉萨空间的立刻就拉萨的'
         },
         {
           userName: '张安',
           phone: '18766666666',
           reportTime: '2019-12-12 12:12:12',
           remark: '阿三撒开了多久啊是看得见啊卡里的骄傲撒开了多久啊上课了觉得ask就的拉萨空间的立刻就拉萨的'
         },
         {
           userName: '张安',
           phone: '18766666666',
           reportTime: '2019-12-12 12:12:12',
           remark: '阿三撒开了多久啊是看得见啊卡里的骄傲撒开了多久啊上课了觉得ask就的拉萨空间的立刻就拉萨的'
         },
         {
           userName: '张安',
           phone: '18766666666',
           reportTime: '2019-12-12 12:12:12',
           remark: '阿三撒开了多久啊是看得见啊卡里的骄傲撒开了多久啊上课了觉得ask就的拉萨空间的立刻就拉萨的'
         }
      ]
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.pagination.pageNum = val;
      this.selectDataList();
    },
    // 显示解除黑名单的弹出框
    showRemoveDialog () {
      this.removeDialog = true;
    },
    selectDataList () {
      
    },
    // 重置表单
    resetForm (form) {
      this.$refs[form].resetFields();
      this.selectDataList();
    },
    // 确认解除黑名单
    sureRemove () {
      
    }
  }
}
</script>

<style lang="scss" scoped>
.service_blacklist {
  width: 98%;
  position: relative;
  top: 20px;
  left: 1%;
  background: #ffffff;
  box-shadow: 4px 0px 10px 0px rgba(131,131,131,0.28);
  border-radius: 4px;
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
    .data_table {
      margin-top: 8px;
      .operation_btn {
        color: #0C70F8;
        cursor: pointer;
      }
    }
  }
}
</style>

