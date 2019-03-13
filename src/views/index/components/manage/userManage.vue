<template>
  <div class="user-manage">
    <div class="header">
      <el-button class="add-btn" icon="el-icon-plus" @click="showAddUser">新增用户</el-button>
      <div class="right-search">
        <el-select v-model="groupId" style="margin-right: 15px;" clearable placeholder="请选择用户组" @change="handleChangeGroup">
          <el-option
            v-for="item in userGroupList"
            :key="item.uid"
            :label="item.groupName"
            :value="item.uid">
          </el-option>
        </el-select>
        <el-input  placeholder="请输入用户名/姓名搜索" v-model="keyWord" style="width: 240px;">
          <i v-show="closeShow" slot="suffix" @click="onClear" class="search_icon el-icon-close" style="font-size: 20px;"></i>
          <i
            v-show="!closeShow"
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
          <template slot-scope="scope">
            <span v-show="scope.row.isForce">禁用</span>
            <span v-show="!scope.row.isForce">启用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <span class="operation_btn" @click="showEditDialog(scope.row)">编辑信息</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showEditGroupDialog(scope.row)">修改所属组</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showConfigRoleDialog(scope.row)">配置角色</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showResetPassword(scope.row)">重置密码</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" v-show="!scope.row.isForce" @click="forbiddenUser(scope.row)">禁用账户</span>
            <span class="operation_btn" v-show="scope.row.isForce" @click="enableUser(scope.row)">启用账户</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showDeleteDialog(scope.row)">删除用户</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pagination.pageNum"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
    <!--重置密码弹出框-->
    <el-dialog
      title="是否重置密码?"
      :visible.sync="resetPasswordDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
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
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">删除后数据不可恢复。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delUserDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="deleteUser">确认</el-button>
      </div>
    </el-dialog>
    <!--编辑信息弹出框-->
    <el-dialog
      title="编辑信息"
      :visible.sync="editUserInfoDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div style="margin-top: 15px;">
        <el-form :model="editUser" ref="editUser" :rules="editRules">
          <div style="margin-bottom: 15px;">
            <span>用户名:</span>
            <span>{{editUser.userMobile}}</span>
          </div>
          <el-form-item label="" prop="userName">
            <el-input v-model="editUser.userName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <div class="sex_box">
            <span :class="[editUser.userSex === 1 ? 'active' : '']" @click="editUser.userSex = 1">男</span>
            <span :class="[editUser.userSex === 2 ? 'active' : '']" @click="editUser.userSex = 2">女</span>
          </div>
          <el-form-item label=" " prop="userIdcard">
            <el-input v-model="editUser.userIdcard" placeholder="请输入用户身份证号码"></el-input>
          </el-form-item>
          <el-form-item label=" " prop="userEmail">
            <el-input v-model="editUser.userEmail" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label=" ">
            <el-select style="width: 100%" v-model="editUser.province" placeholder="请选择上级部门">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit('editUser')">取消</el-button>
        <el-button class="operation_btn function_btn" @click="editUserInfo('editUser')">保存</el-button>
      </div>
    </el-dialog>
    <!--修改所属组弹出框-->
    <el-dialog
      title="修改所属组"
      :visible.sync="editUserGroupDialog"
      width="521px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp_group"
      >
      <div class="userGroup_body">
        <div class="group_left clearfix">
          <p class="group_number">当前所属组 (50个)</p>
          <div class="checkbox_box_left">
            <vue-scroll>
              <el-checkbox-group v-model="checkedCities">
                <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
              </el-checkbox-group>
            </vue-scroll>
          </div>
          <div class="group_btn group_btn_left">移除所选组</div>
        </div>
        <div class="group_right">
          <p class="group_number">可选组 (已选1个/共51个)</p>
          <el-input placeholder="请输入组名搜索" size="small" style="width: 220px;border-radius: 50%;">
            <i
              class="search_icon vl_icon vl_icon_manage_1"
              slot="suffix"
              @click="searchGroup">
            </i>
          </el-input>
           <div class="checkbox_box_right">
            <vue-scroll>
              <el-checkbox-group v-model="checkedCities">
                <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
              </el-checkbox-group>
            </vue-scroll>
          </div>
          <div class="group_btn group_btn_right">加入所选组</div>
        </div>
      </div>
    </el-dialog>
    <!--配置角色弹出框-->
    <el-dialog
      title="配置角色"
      :visible.sync="configRoleDialog"
      width="521px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp_group"
      >
      <div class="userGroup_body">
        <div class="group_left clearfix">
          <p class="group_number">已配角色 (50个)</p>
          <div class="checkbox_box_left">
            <vue-scroll>
              <el-checkbox-group v-model="checkedCities">
                <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
              </el-checkbox-group>
            </vue-scroll>
          </div>
          <div class="group_btn group_btn_left">移除所选角色</div>
        </div>
        <div class="group_right">
          <p class="group_number">可选角色 (已选1个/共51个)</p>
          <el-input placeholder="请输入角色名搜索" size="small" style="width: 220px;">
            <i
              class="search_icon vl_icon vl_icon_manage_1"
              slot="suffix"
              @click="searchRole">
            </i>
          </el-input>
           <div class="checkbox_box_right">
            <vue-scroll>
              <el-checkbox-group v-model="checkedCities">
                <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
              </el-checkbox-group>
            </vue-scroll>
          </div>
          <div class="group_btn group_btn_right">添加所选角色</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { validatePhone, checkIdCard } from '@/utils/validator.js';
import { getUserList, getUserGroup, delUser, isForceUser, updateUser } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      groupId: null, // 搜索的用户组
      keyWord: null, // 用户名/姓名搜索
      closeShow: false, // 清空搜索框
      checkedCities: ['上海', '北京'],
      cities: ['上海', '北京', '广州', '深圳','上海', '北京', '广州', '深圳','上海', '北京', '广州', '深圳','上海', '北京', '广州', '深圳','上海', '北京', '广州', '深圳','上海', '北京', '广州', '深圳','上海', '北京', '广州', '深圳'],
      userListData: [
        {
          userMobile: '13599999999',
          userName: '张三',
          userSex: '男',
          userEmail: '1136787777@qq.com',
          lastLoginTime: '2018-12-34 10:00:00',
          sysUserGroupInfos: [],
          sysUserRoleInfos: [],
          force: true,
          isForce: true
        },
        {
          userMobile: '13599999999',
          userName: '张三',
          userSex: '男',
          userEmail: '1136787777@qq.com',
          lastLoginTime: '2018-12-34 10:00:00',
          sysUserGroupInfos: [],
          sysUserRoleInfos: [],
          force: false,
          isForce: false
        }
      ],
      editUser: {
        uid: null,
        proKey: null,
        userMobile: '13599999999',
        userName: null,
        userSex: 1,
        userIdcard: null,
        userEmail: null,
        province: null,
        city: null
      },
      editRules: {
        userName: [
          { required: true, message: '该项内容不能为空', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur'}
        ],
        userIdcard: [
          { validator: checkIdCard, trigger: 'blur' }
        ],
        userEmail: [
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      userGroupList: [], // 所有的用户组
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      resetPasswordDialog: false, // 重置密码弹出框
      delUserDialog: false, // 删除用户弹出框
      editUserInfoDialog: false, // 编辑信息弹出框
      editUserGroupDialog: false, // 修改所属组弹出框
      configRoleDialog: false, // 配置角色弹出框
      deleteId: null, // 要删除的用户id
    }
  },
  methods: {
    // 获取列表数据
    getList () {
      const params = {
        'where.proKey': 'qqqq',
        'where.groupId' : this.groupId,
        'where.keyWord': this.keyWord,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      }
      getUserList(params)
        .then(res => {
          if (res) {
            this.userListData = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    // 获取用户组
    getAllUserGroup () {
      const params = {
        'where.uid': 'this.$store.state.proKey'
      };
      getUserGroup(params)
        .then(res => {
          if (res) {
            this.userGroupList = res.data.list;
          }
        })
    },
    // change用户组
    handleChangeGroup (val) {
      this.getList();
    },
    // 搜索用户名/姓名
    searchData () {
      this.closeShow = true;
      this.getList();
    },
    // 搜索组
    searchGroup () {
      // this.closeShow = true;
      // this.getList();
    },
    // 搜索角色
    searchRole () {
      // this.closeShow = true;
      // this.getList();
    },
    // 清空搜索框
    onClear () {
      this.closeShow = false;
      this.keyWord = null;
      this.getList();
    },
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getList();
    },
    // 跳至新增用户页面
    showAddUser () {
      this.$router.push({name: 'add_user'});
    },
    // 显示重置密码弹出框
    showResetPassword (obj) {
      console.log(obj);
      this.resetPasswordDialog = true;
    },
    // 显示编辑信息弹出框
    showEditDialog (obj) {
      console.log(obj);
      this.editUser.uid = obj.uid;
      this.editUser.userMobile = obj.userMobile;
      this.editUser.userName = obj.userName;
      this.editUser.userIdcard = obj.userIdcard;
      this.editUser.userSex = obj.userSex;
      this.editUser.userEmail = obj.userEmail;
      this.editUser.userSex = obj.userSex;
      this.editUserInfoDialog = true;
    },
    // 编辑信息
    editUserInfo (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          updateUser(this.editUser)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '修改成功',
                  customClass: 'request_tip'
                })
                this.editUserInfoDialog = false;
                this.getList();
              } else {
                this.$message({
                  type: 'error',
                  message: '修改失败',
                  customClass: 'request_tip'
                })
              }
            })
            .catch(() => {})
        }
      })
    },
    // 取消编辑
    cancelEdit (form) {
      this.$refs[form].resetFields();
      this.editUserInfoDialog = false;
    },
    // 显示删除用户弹出框
    showDeleteDialog (obj) {
      console.log(obj);
      this.deleteId = obj.uid;
      this.delUserDialog = true;
    },
    // 删除用户
    deleteUser () {
      if (this.deleteId) {
        delUser(this.deleteId)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              })
              this.newDepartmentDialog = false;
              this.getList();
            } else {
              this.$message({
                type: 'error',
                message: '删除失败',
                customClass: 'request_tip'
              })
            }
          })
          .catch(() => {})
      }
    },
    // 显示修改所属组弹出框
    showEditGroupDialog (obj) {
      console.log(obj);
      this.editUserGroupDialog = true;
    },
    // 显示配置角色弹出框
    showConfigRoleDialog (obj) {
      console.log(obj);
      this.configRoleDialog = true;
    },
    // 禁用用户
    forbiddenUser (obj) {
      const params = {
        uid: obj.uid,
        isForce: true
      }
      isForceUser(params)
        .then(res => {
          if (res) {
            this.$notify({
              title: '提示通知',
              message: obj.userMobile + '已禁用',
              iconClass: 'vl_icon vl_icon_event_16'
            });
          } else {
            this.$message({
              type: 'error',
              message: '禁用失败',
              customClass: 'request_tip'
            })
          }
        })
        .catch(() => {})
    },
    // 启用用户
    enableUser (obj) {
      const params = {
        uid: obj.uid,
        isForce: false
      }
      isForceUser(params)
        .then(res => {
          if (res) {
            this.$notify({
              title: '提示通知',
              message: obj.userMobile + '已启用',
              iconClass: 'vl_icon vl_icon_event_18'
            });
          } else {
            this.$message({
              type: 'error',
              message: '禁用失败',
              customClass: 'request_tip'
            })
          }
        })
        .catch(() => {})
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
  .dialog_comp {
    .sex_box {
      margin-bottom: 15px;
      span {
        display: inline-block;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        margin-right: 20px;
        border: 1px solid #D3D3D3;
        border-radius: 4px;
        cursor: pointer;
        &.active {
          border-color: #0B6FF7;
          color: #0B6FF7;
        }
      }
    }
  }
  .dialog_comp_group {
    /deep/ .el-dialog__body {
      padding: 0 0 30px 0;
      .userGroup_body {
        width: 100%;
        clear: both;
        height: 577px;
        border-top: 1px solid #F2F2F2;
        .group_left {
          padding-top: 8px;
          width: 50%;
          height: 100%;
          border-right: 1px solid #F2F2F2;
          float: left;
          padding-left: 20px;
          .checkbox_box_left {
            height: calc(577px - 25px - 40px - 20px);
            margin-bottom: 20px;
            margin-top: 15px;
          }
          .group_btn_left {
            border: 1px solid #D3D3D3;
            color: #666666;
          }
        }
        .group_right {
          padding-top: 8px;
          width: 50%;
          height: 100%;
          padding-left: 20px;
          float: left;
          .checkbox_box_right {
            height: calc(577px - 25px - 40px - 20px - 42px);
            margin-bottom: 20px;
            margin-top: 15px;
          }
          /deep/ .el-input__inner {
            border-radius: 30px;
            background-color: #F2F2F2;
            color: #999999;
            border-color: #F2F2F2;
            margin-top: 10px;
          }
          .search_icon{
            margin-top: 17px;
            cursor: pointer;
          }
          .group_btn_right {
            background-color: #0C70F8;
            color: #ffffff;
          }
        }
        .group_btn {
          text-align: center;
          line-height: 40px;
          width: 220px;
          height: 40px;
          border-radius: 4px;
          cursor: pointer;
        }
        .group_number {
          color: #999999;
          font-size: 12px;
        }
        /deep/ .el-checkbox-group {
          display: flex;
          flex-wrap: wrap;
          flex-direction: column;
        }
        /deep/ .el-checkbox {
          padding-right: 20px;
          height: 25px;
        }
        /deep/ .el-checkbox+.el-checkbox {
          margin-left: 0;
        }
        /deep/ .el-checkbox__label {
          float: left;
        }
        /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: #0C70F8;
          border-color: #0C70F8;
        }
        /deep/ .el-checkbox__input.is-checked+.el-checkbox__label{
          color: #666666;
        }
        /deep/ .el-checkbox__input {
          float: right;
        }
      }
    }
  }
}
</style>


