<template>
  <div class="version_box">
    <div class="search_box">
      <el-form :inline="true" :model="searchForm" class="search_form" ref="searchForm">
        <el-form-item prop="phoneOrNumber">
          <el-input style="width: 240px;" type="text" placeholder="请输入版本号" v-model="searchForm.phoneOrNumber" />
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn" @click="selectDataList">查询</el-button>
          <el-button class="reset_btn" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="divide"></div>
    </div>
    <div class="content-box">
      <div class="button_box">
        <div class="add_version_btn" @click="showAddDialog">
          <span>+</span>
          <span>新增版本</span>
        </div>
      </div>
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
          label="版本号"
          prop="versionNum"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="上传时间"
          prop="time"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="新功能"
          prop="newFunction"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="强制更新"
          prop="forceUpdate"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="提示更新"
          prop="tipUpdate"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <span class="operation_btn" @click="showUpdateDialog(scope.row)">修改</span>
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
  </div>
</template>
<script>
export default {
  data () {
    return {
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      searchForm: {
        phoneOrNumber: null
      },
      dataList: [
        {
          versionNum: 'v3.0.1',
          time: '2018-12-12 12:12:12',
          newFunction: '语音通话：两人、多人语音通话，高清畅聊。',
          forceUpdate: '是',
          tipUpdate: '否'
        },
        {
          versionNum: 'v3.0.1',
          time: '2018-12-12 12:12:12',
          newFunction: '语音通话：两人、多人语音通话，高清畅聊。',
          forceUpdate: '是',
          tipUpdate: '否'
        },
        {
          versionNum: 'v3.0.1',
          time: '2018-12-12 12:12:12',
          newFunction: '语音通话：两人、多人语音通话，高清畅聊。',
          forceUpdate: '是',
          tipUpdate: '否'
        },{
          versionNum: 'v3.0.1',
          time: '2018-12-12 12:12:12',
          newFunction: '语音通话：两人、多人语音通话，高清畅聊。',
          forceUpdate: '是',
          tipUpdate: '否'
        }
      ]
    }
  },
  methods: {
    selectDataList () {

    },
    resetForm (form) {
      this.$refs[form].resetFields();
      this.selectDataList();
    },
    handleCurrentChange (val) {
      this.pagination.pageNum = val;
      this.selectDataList();
    },
    // 显示修改版本弹出框
    showUpdateDialog (obj) {

    },
    // 显示新增版本弹出框
    showAddDialog () {

    }
  }
}
</script>

<style lang="scss" scoped>
.version_box {
  width: 98%;
  position: relative;
  top: 20px;
  left: 1%;
  background: #ffffff;
  box-shadow: 4px 0px 10px 0px rgba(131,131,131,0.28);
  .search_box {
    width: 100%;
    padding: 20px;
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
  .content-box {
    padding: 0 20px;
    .button_box {
      display: flex;
      justify-content: space-between;
      .add_version_btn {
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

