<template>
  <div class="member_file">
    <div class="header">
      <el-button class="add-btn" icon="el-icon-plus" @click="skipAddPage">新增成员</el-button>
      <el-button class="export-btn">导出</el-button>
      <el-input placeholder="请输入姓名查找" style="width: 240px; float:right;" v-model="searchUserName">
        <i v-show="closeShow" slot="suffix" @click="onClear" class="search_icon el-icon-close" style="font-size: 20px;"></i>
        <i
          v-show="!closeShow"
          class="search_icon vl_icon vl_icon_manage_1"
          slot="suffix"
          @click="searchData">
        </i>
      </el-input>
    </div>
    <div class="table_box">
      <el-table
        class="list_table"
        :data="dataList"
        >
        <el-table-column
          fixed
          label="序号"
          type="index"
          width="60"
          >
        </el-table-column>
        <el-table-column
          label="姓名"
          prop="userName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="性别"
          prop="userSex"
          >
        </el-table-column>
        <el-table-column
          label="职位"
          prop="job"
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
          label="邮箱"
          prop="email"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <span class="operation_btn" @click="skipSelectDetail(scope.row)">查看档案</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showEditDialog(scope.row)">编辑档案</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showDeleteDialog(scope.row)">删除档案</span>
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
    <!--删除弹出框-->
    <el-dialog
      title="是否删除该成员？"
      :visible.sync="deleteDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <el-checkbox v-model="isDelete">同步删除成员账户，删除后该成员将无法登录本系统</el-checkbox>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="sureDelete">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      searchUserName: null, // 根据姓名查找
      closeShow: false,
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      isDelete: false, // 是否勾选删除成员账户
      deleteDialog: false, // 删除弹出框
      isDeleteLoading: false, // 删除加载中
      dataList: [
        {
          userName: '账单',
          userSex: '女',
          job: '主任',
          phone: '18999999999',
          email: '1136386227@qq.com'
        },
        {
          userName: '账单',
          userSex: '女',
          job: '主任',
          phone: '18999999999',
          email: '1136386227@qq.com'
        },
        {
          userName: '账单',
          userSex: '女',
          job: '主任',
          phone: '18999999999',
          email: '1136386227@qq.com'
        }
      ]
    }
  },
  methods: {
    searchData () {},
    onClear () {},
    // 跳至查看档案页面
    skipSelectDetail (obj) {
      this.$router.push({name: 'member_detail'});
    },
    // 跳至新增成员页面
    skipAddPage () {
      this.$router.push({name: 'member_add'});
    },
    // 跳至编辑页面
    showEditDialog () {
      this.$router.push({name: 'member_edit'});
    },
    // 显示删除弹出框
    showDeleteDialog () {
      this.deleteDialog = true;
    },
    handleCurrentChange () {},
    // 确认删除
    sureDelete () {}
  }
}
</script>

<style lang="scss" scoped>
.member_file {
  padding: 10px;
  .header {
    padding: 10px;
    // display: flex;
    // justify-content: space-between;
    background-color: #ffffff;
    .add-btn {
      background-color: #0C70F8;
      color: #fff;
    }
    .search_icon{
      margin-top: 10px;
      cursor: pointer;
    }
  }
  .table_box {
    padding: 0 10px;
    background-color: #ffffff;
    .list_table {
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

