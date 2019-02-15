<template>
  <div class="user-manage">
    <div class="header">
      <el-button class="add-btn" icon="el-icon-plus" @click="showNewDepartment">新增用户</el-button>
      <div class="right-search">
        <el-select v-model="value4" style="margin-right: 15px;" placeholder="请选择用户组">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input  placeholder="请输入用户名/姓名搜索查找" style="width: 240px;">
          <i
          class="search_icon vl_icon vl_icon_manage_1"
          slot="suffix"
          @click="searchData">
        </i>
        </el-input>
      </div>
    </div>
    <div class="table_box">
      <el-table
        class="user_table"
        :data="userListData"
        >
        <el-table-column
          fixed
          label="序号"
          type="index"
          :show-overflow-tooltip='true'
          >
        </el-table-column>
        <el-table-column
          label="账户名"
          prop="userMobile"
          show-overflow-tooltip
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
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="邮箱"
          prop="userEmail"
          width="200"
          >
        </el-table-column>
        <el-table-column
          label="最后登录时间"
          prop="lastLoginTime"
          >
        </el-table-column>
        <el-table-column
          label="所属组"
          prop="sysUserGroupInfos"
          >
        </el-table-column>
        <el-table-column
          label="角色配置"
          prop="sysUserRoleInfos"
          >
        </el-table-column>
        <el-table-column
          label="状态"
          prop="force"
          >
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <span class="operation_btn" @click="showEditDialog(scope)">编辑信息</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showDeleteDialog(scope)">修改所属组</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showDeleteDialog(scope)">配置角色</span>
            <span class="operation_btn" @click="showResetPassword(scope)">重置密码</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showeditDialog(scope)">禁用账户</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showDeleteDialog(scope)">删除用户</span>
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
    <!--重置密码弹出框-->
    <el-dialog
      title="是否重置密码?"
      :visible.sync="resetPasswordDialog"
      width="482px"
      class="dialog_comp"
      >
      <span style="color: #999999;">重置后，新密码将以短信形式发送给用户。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetPasswordDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="resetPasswordDialog = false">确认</el-button>
      </div>
    </el-dialog>
    <!--删除用户弹出框-->
    <el-dialog
      title="是否确定删除该用户及相关信息?"
      :visible.sync="delUserDialog"
      width="482px"
      class="dialog_comp"
      >
      <span style="color: #999999;">删除后数据不可恢复。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delUserDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="delUserDialog = false">确认</el-button>
      </div>
    </el-dialog>
    <!--编辑信息弹出框-->
    <el-dialog
      title="编辑信息"
      :visible.sync="editUserInfoDialog"
      width="482px"
      class="dialog_comp"
      >
      <div>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserInfoDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="editUserInfoDialog = false">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      userListData: [
        {
          userMobile: '13599999999',
          userName: '张三',
          userSex: '男',
          userEmail: '1136787777@qq.com',
          lastLoginTime: '2018-12-34 10:00:00',
          sysUserGroupInfos: [],
          sysUserRoleInfos: [],
          force: '禁用'
        }
      ],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value4: '',
      currentPage4: 1,
      resetPasswordDialog: false, // 重置密码弹出框
      delUserDialog: false, // 删除用户弹出框
      editUserInfoDialog: false, // 编辑信息弹出框
    }
  },
  methods: {
    // 搜索
    searchData () {},
    handleSizeChange () {

    },
    handleCurrentChange () {},
    // 显示重置密码弹出框
    showResetPassword (obj) {
      console.log(obj);
      this.resetPasswordDialog = true;
    },
    // 显示编辑信息弹出框
    showEditDialog (obj) {
      console.log(obj);
      this.editUserInfoDialog = true;
    },
    // 显示删除用户弹出框
    showDeleteDialog (obj) {
      console.log(obj);
      this.delUserDialog = true;
    }
  }
}
</script>
<style lang="scss" scoped>
.user-manage {
  background-color: #ffffff;
  .header {
    padding: 10px;
    display: flex;
    justify-content: space-between;
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
    .user_table {
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


