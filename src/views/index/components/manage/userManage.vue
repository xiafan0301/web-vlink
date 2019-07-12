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
        <el-input  placeholder="请输入账户名/姓名搜索" v-model="keyWord" style="width: 240px;">
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
          <template slot-scope="scope">
            <span>{{scope.row.userSex === 1 ? '男' : scope.row.userSex === 2 ? '女' : '未知'}}</span>
          </template>
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
          width="200"
          >
          <template slot-scope="scope">
            <template v-if="!scope.row.lastLoginTime">
              <span>未登录</span>
            </template>
            <template v-else>
              <span>{{scope.row.lastLoginTime | fmTimestamp}}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="所属组"
          prop="sysUserGroupInfos"
          >
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.sysUserGroupInfos" :key="index">
              <template v-if="index < minGroupLength">
                {{item.groupName}}
              </template>
            </p>
            <p style="color: #0C70F8;cursor:pointer;" v-show="!isGroupOpen && scope.row.sysUserGroupInfos.length > 3" @click="openAllGroup(scope.row, true)">
              <span>展开全部</span>
              <i class="el-icon-arrow-down"></i>
            </p>
            <p style="color: #0C70F8;cursor:pointer;" v-show="isGroupOpen && scope.row.sysUserGroupInfos.length > 3" @click="openAllGroup(scope.row, false)">
              <span>收起</span>
              <i class="el-icon-arrow-up"></i>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="角色配置"
          prop="sysUserRoleInfos"
          >
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.sysUserRoleInfos" :key="index">
              <template v-if="index < minRoleLength">
                {{item.roleName}}
              </template>
            </p>
            <p style="color: #0C70F8;cursor:pointer;" v-show="!isRoleOpen && scope.row.sysUserRoleInfos.length > 3" @click="openAllRole(scope.row, true)">
              <span>展开全部</span>
              <i class="el-icon-arrow-down"></i>
            </p>
            <p style="color: #0C70F8;cursor:pointer;" v-show="isRoleOpen && scope.row.sysUserRoleInfos.length > 3" @click="openAllRole(scope.row, false)">
              <span>收起</span>
              <i class="el-icon-arrow-up"></i>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="isForce"
          >
          <template slot-scope="scope">
            <span v-show="scope.row.isForce">禁用</span>
            <span v-show="!scope.row.isForce">启用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" fixed="right">
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
      class="cum_pagination"
      @current-change="handleCurrentChange"
      :current-page.sync="pagination.pageNum"
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
        <el-button class="operation_btn function_btn" @click="sureResetPassword">确认</el-button>
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
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="deleteUser">确认</el-button>
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
            <el-select style="width: 100%" v-model="editUser.organId" placeholder="请选择上级部门">
              <el-option
                v-for="(item, index) in departmentData"
                :key="index"
                :label="item.organName"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit('editUser')">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isEditLoading" @click="editUserInfo('editUser')">保存</el-button>
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
          <p class="group_number">当前所属组 (已选{{checkCurrGroups.length > 0 ? checkCurrGroups.length : 0}}个/共{{currentGroups.length > 0 ? currentGroups.length : 0}}个)</p>
          <div class="checkbox_box_left">
            <vue-scroll>
              <el-checkbox-group v-model="checkCurrGroups">
                <el-checkbox v-for="item in currentGroups" :label="item" :key="item.uid">{{item.groupName}}</el-checkbox>
              </el-checkbox-group>
            </vue-scroll>
          </div>
          <el-button class="group_btn group_btn_left" :loading="isRemoveGroupLoading" @click="removeCurrGroup">移除所选组</el-button>
        </div>
        <div class="group_right">
          <p class="group_number">可选组 (已选{{checkSelectGroups.length > 0 ? checkSelectGroups.length : 0}}个/共{{searchSelectGroups.length > 0 ? searchSelectGroups.length : 0}}个)</p>
          <el-input placeholder="请输入组名搜索" v-model="userGroupName" size="small" style="width: 220px;border-radius: 50%;">
            <i v-show="closeShowGroup" slot="suffix" @click="onClearGroup" class="search_icon el-icon-close" style="font-size: 20px;"></i>
            <i
              v-show="!closeShowGroup"
              class="search_icon vl_icon vl_icon_manage_1"
              slot="suffix"
              @click="searchGroup">
            </i>
          </el-input>
           <div class="checkbox_box_right">
            <vue-scroll>
              <el-checkbox-group v-model="checkSelectGroups">
                <el-checkbox v-for="item in searchSelectGroups" :label="item" :key="item.uid">{{item.groupName}}</el-checkbox>
              </el-checkbox-group>
            </vue-scroll>
          </div>
          <el-button class="group_btn group_btn_right" :loading="isAddGroupLoading" @click="addSelectGroup">加入所选组</el-button>
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
          <p class="group_number">已配角色 (已选{{checkCurrRoles.length > 0 ? checkCurrRoles.length : 0}}个/共{{currentRoles.length > 0 ? currentRoles.length : 0}}个)</p>
          <div class="checkbox_box_left">
            <vue-scroll>
              <el-checkbox-group v-model="checkCurrRoles">
                <el-checkbox v-for="item in currentRoles" :label="item" :key="item.uid">{{item.roleName}}</el-checkbox>
              </el-checkbox-group>
            </vue-scroll>
          </div>
          <el-button class="group_btn group_btn_left" :loading="isRemoveRoleLoading" @click="removeRolesData">移除所选角色</el-button>
        </div>
        <div class="group_right">
          <p class="group_number">可选角色 (已选{{checkSelectRoles.length > 0 ? checkSelectRoles.length : 0}}个/共{{searchSelectRoles.length > 0 ? searchSelectRoles.length : 0}}个)</p>
          <el-input placeholder="请输入角色名搜索" size="small" v-model="userRoleName" style="width: 220px;">
            <i v-show="closeShowRole" slot="suffix" @click="onClearRole" class="search_icon el-icon-close" style="font-size: 20px;"></i>
            <i
              v-show="!closeShowRole"
              class="search_icon vl_icon vl_icon_manage_1"
              slot="suffix"
              @click="searchRole">
            </i>
          </el-input>
           <div class="checkbox_box_right">
            <vue-scroll>
              <el-checkbox-group v-model="checkSelectRoles">
                <el-checkbox v-for="item in searchSelectRoles" :label="item" :key="item.uid">{{item.roleName}}</el-checkbox>
              </el-checkbox-group>
            </vue-scroll>
          </div>
          <el-button class="group_btn group_btn_right" :loading="isAddRoleLoading" @click="addRolesData">添加所选角色</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { checkIdCard, checkEmail } from '@/utils/validator.js';
import { getUserList, delUser, isForceUser, updateUser,
  getDepartmentList, getUserGroups, addUserBatchGroups,
  delUserBatchGroups, getRoleList, addUserBatchRoles, delUserBatchRoles,
  resetPwd
} from '@/views/index/api/api.manage.js';
export default {
  data () {
    return {
      minGroupLength: 3, // 所属组最多显示3个
      minRoleLength: 3, // 所属角色最多显示3个
      isGroupOpen: false, // 所属组是否展开
      isRoleOpen: false, // 所属角色是否展开
      groupId: null, // 搜索的用户组
      keyWord: null, // 用户名/姓名搜索
      closeShow: false, // 清空搜索框
      closeShowGroup: false, // 清空搜索组搜索框
      closeShowRole: false, // 清空搜索角色搜索框
      currentGroups: [], // 当前所属组
      selectGroups: [], // 全部可选组
      searchSelectGroups: [], // 搜索出的可选组
      allGroupList: [], // 所有的用户组
      checkCurrGroups: [], // 勾选上的当前组
      checkSelectGroups: [], // 勾选上的可选组
      currentRoles: [], // 当前角色
      selectRoles: [], // 全部可选角色
      searchSelectRoles: [], // 搜索出的可选角色
      checkCurrRoles: [], // 勾选中的当前角色
      checkSelectRoles: [], // 勾选中的可选角色
      allRoles: [], // 所有角色
      userListData: [],
      userGroupName: null, // 修改所属组名
      userRoleName: null, // 配置角色名
      editUser: {
        uid: null,
        proKey: null,
        userMobile: null,
        userName: null,
        userSex: 0,
        userIdcard: null,
        userEmail: null,
        organId: null
      },
      editRules: {
        userName: [
          { required: true, message: '该项内容不能为空', trigger: 'blur' },
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
      userInfo: {}, // 存储的用户信息
      departmentData: [],
      groupUserId: null, // 用户组id
      roleUserId: null, // 角色组id
      resetPwdInfo: {}, // 重置密码所需要的信息
      isEditLoading: false, // 编辑用户加载中
      isDeleteLoading: false, // 删除用户加载中
      isRemoveRoleLoading: false, // 移除角色加载中
      isAddRoleLoading: false, // 添加角色加载中
      isRemoveGroupLoading: false, // 移除所属组加载中
      isAddGroupLoading: false, // 加入所属组加载中
    }
  },
  watch: {
    keyWord (val) {
      if (val) {
        this.closeShow = false;
      } else {
        this.getList();
      }
    },
    userGroupName (val) {
      if (val) {
        this.closeShowGroup = false;
      } else {
        this.searchGroup();
      }
    },
    userRoleName (val) {
      if (val) {
        this.closeShowRole = false;
      } else {
        this.searchRole();
      }
    }
  },
  created () {
    this.userInfo = this.$store.state.loginUser;
  },
  mounted () {
    this.editUser.proKey = this.userInfo.proKey;
    this.getList();
    this.getAllUserGroup();
  },
  methods: {
    // 获取列表数据
    getDepartList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageNum: 1,
        pageSize: 0,
      };
      getDepartmentList(params)
        .then(res => {
          if (res && res.data.list) {
            this.departmentData = res.data.list;
          }
        })
    },
    // 获取列表数据
    getList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
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
      this.selectGroups = [];
      this.searchSelectGroups = [];
      this.allGroupList = [];
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0
      };
      getUserGroups(params)
        .then(res => {
          if (res) {
            this.userGroupList = res.data.list;
            this.allGroupList = JSON.parse(JSON.stringify(res.data.list));
            if (this.currentGroups.length > 0) {
              this.currentGroups.map(item => {
                this.allGroupList.map((itm, idx) => {
                  if (item.groupName === itm.groupName) {
                    this.allGroupList.splice(idx, 1);
                  }
                })
              })
            }
            this.selectGroups = JSON.parse(JSON.stringify(this.allGroupList));
            this.searchSelectGroups = JSON.parse(JSON.stringify(this.allGroupList));
          }
        })
    },
    // 筛选用户组
    handleChangeGroup () {
      this.getList();
    },
    // 搜索用户名/姓名
    searchData () {
      if (this.keyWord) {
        this.closeShow = true;
      }
      this.getList();
    },
    // 搜索组
    searchGroup () {
      if (this.userGroupName) {
        this.closeShowGroup = true;
        let reg = new RegExp(this.userGroupName);
        let arr = [];
        this.searchSelectGroups.map((item) => {
          let name = item.groupName;
          if (name.match(reg)) {
            arr.push(item);
          }
        })
        this.searchSelectGroups = JSON.parse(JSON.stringify(arr));
      } else {
        this.searchSelectGroups = JSON.parse(JSON.stringify(this.selectGroups));
      }
      // if ()
    },
    // 清空搜索组搜索框
    onClearGroup () {
      this.userGroupName = null;
      this.searchSelectGroups = JSON.parse(JSON.stringify(this.selectGroups));
      this.closeShowGroup = false;
    },
    // 搜索角色
    searchRole () {
      if (this.userRoleName) {
        let reg = new RegExp(this.userRoleName);
        let arr = [];
        this.searchSelectRoles.map((item) => {
          let name = item.roleName;
          if (name.match(reg)) {
            arr.push(item);
          }
        })
        this.searchSelectRoles = JSON.parse(JSON.stringify(arr));
        this.closeShowRole = true;
      } else {
        this.searchSelectRoles = JSON.parse(JSON.stringify(this.selectRoles));
      }
    },
    // 清空搜索角色搜索框
    onClearRole () {
      this.userRoleName = null;
      this.searchSelectRoles = JSON.parse(JSON.stringify(this.selectRoles));
      this.closeShowRole = false;
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
      this.resetPwdInfo = obj;
      this.resetPasswordDialog = true;
    },
    // 重置密码
    sureResetPassword () {
      const params = {
        uid: this.resetPwdInfo.uid,
        proKey: this.userInfo.proKey,
        userMobile: this.resetPwdInfo.userMobile
      }
      resetPwd(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '重置密码成功',
              customClass: 'request_tip'
            })
            this.resetPasswordDialog = false;
          }
        })
        .catch(() => {});
    },
    // 显示编辑信息弹出框
    showEditDialog (obj) {
      this.editUser.uid = obj.uid;
      this.editUser.userMobile = obj.userMobile;
      this.editUser.userName = obj.userName;
      this.editUser.userIdcard = obj.userIdcard;
      this.editUser.userSex = obj.userSex;
      this.editUser.userEmail = obj.userEmail;
      this.editUser.userSex = obj.userSex;
      this.editUser.organId = obj.organId;
      this.editUserInfoDialog = true;
      this.getDepartList();
    },
    // 编辑信息
    editUserInfo (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.isEditLoading = true;
          updateUser(this.editUser)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '修改成功',
                  customClass: 'request_tip'
                });
                this.editUserInfoDialog = false;
                this.getList();
                this.isEditLoading = false;
              } else {
                this.$message({
                  type: 'error',
                  message: '修改失败',
                  customClass: 'request_tip'
                });
                this.isEditLoading = false;
              }
            })
            .catch(() => {this.isEditLoading = false;})
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
      this.deleteId = obj.uid;
      this.delUserDialog = true;
    },
    // 删除用户
    deleteUser () {
      if (this.deleteId) {
        this.isDeleteLoading = true;
        const params = {
          proKey: this.userInfo.proKey,
          uid: this.deleteId
        };
        delUser(params)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              });
              this.delUserDialog = false;
              this.getList();
              this.isDeleteLoading = false;
            } else {
              this.$message({
                type: 'error',
                message: '删除失败',
                customClass: 'request_tip'
              });
              this.isDeleteLoading = false;
            }
          })
          .catch(() => {this.isDeleteLoading = false;})
      }
    },
    // 显示修改所属组弹出框
    showEditGroupDialog (obj) {
      this.checkSelectGroups = [];
      this.checkCurrGroups = [];
      this.currentGroups = [];
      this.groupUserId = obj.uid;
      this.editUserGroupDialog = true;
      if (obj.sysUserGroupInfos.length > 0) {
        obj.sysUserGroupInfos.map(item => {
          this.currentGroups.push({
            uid: item.uid,
            groupName: item.groupName
          });
        });
      }
      this.getAllUserGroup();
    },
    // 加入所选组
    addSelectGroup () {
      if (this.checkSelectGroups.length > 0) {
        let params = {
          proKey: this.userInfo.proKey,
          uid: this.groupUserId,
          uids: []
        };
        this.checkSelectGroups.map(item => {
          params.uids.push(item.uid);
        });
        this.isAddGroupLoading = true;
        addUserBatchGroups(params)
          .then(res => {
            if (res) {
              this.checkSelectGroups.map(item => {
                this.searchSelectGroups.map((itm, idx) => {
                  if (item.groupName === itm.groupName) {
                    this.selectGroups.splice(idx, 1);
                    this.currentGroups.push({
                      uid: item.uid,
                      groupName: item.groupName
                    });
                  }
                });
              });
              this.getList();
              this.checkSelectRoles = [];
              this.editUserGroupDialog = false;
              this.isAddGroupLoading = false;
            } else {
              this.isAddGroupLoading = false;
            }
          })
          .catch(() => {this.isAddGroupLoading = false;})
      }
    },
    // 移除所选组
    removeCurrGroup () {
      if (this.checkCurrGroups.length > 0) {
        let params = {
          proKey: this.userInfo.proKey,
          uid: this.groupUserId,
          uids: []
        };
        this.checkCurrGroups.map(item => {
          params.uids.push(item.uid);
        });
        this.isRemoveGroupLoading = true;
        delUserBatchGroups(params)
          .then(res => {
            if (res) {
              this.checkCurrGroups.map(item => {
                this.currentGroups.map((itm, idx) => {
                  if (item.groupName === itm.groupName) {
                    this.currentGroups.splice(idx, 1);
                    this.selectGroups.push({
                      uid: item.uid,
                      groupName: item.groupName
                    });
                  }
                });
              });
              this.getList();
              this.checkCurrRoles = [];
              this.editUserGroupDialog = false;
              this.isRemoveGroupLoading = false;
            } else {
              this.isRemoveGroupLoading = false;
            }
          })
          .catch(() => {this.isRemoveGroupLoading = false;})
      }
    },
    // 显示配置角色弹出框
    showConfigRoleDialog (obj) {
      this.roleUserId = obj.uid;
      this.currentRoles = [];
      this.checkCurrRoles = [];
      this.checkSelectRoles = [];
      this.configRoleDialog = true;
      if (obj.sysUserRoleInfos.length > 0) {
        obj.sysUserRoleInfos.map(item => {
          this.currentRoles.push({
            uid: item.uid,
            roleName: item.roleName
          });
        });
      }
      this.getAllRole();
    },
    // 获取所有角色
    getAllRole () {
      this.allRoles = [];
      this.selectRoles = [];
      this.searchSelectRoles = [];
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0,
      }
      getRoleList(params)
        .then(res => {
          if (res) {
            this.allRoles = JSON.parse(JSON.stringify(res.data.list));
            if (this.currentRoles.length > 0) {
              this.currentRoles.map(item => {
                this.allRoles.map((itm, index) => {
                  if (item.roleName === itm.roleName) {
                    this.allRoles.splice(index, 1);
                  }
                });
              });
            }
            this.selectRoles = JSON.parse(JSON.stringify(this.allRoles));
            this.searchSelectRoles = JSON.parse(JSON.stringify(this.allRoles));
          }
        });
    },
    // 移除所选角色
    removeRolesData () {
      if (this.checkCurrRoles.length > 0) {
        let params = {
          proKey: this.userInfo.proKey,
          userId: this.roleUserId,
          roleIdList: []
        };
        this.checkCurrRoles.map(item => {
          params.roleIdList.push(item.uid);
        });
        this.isRemoveRoleLoading = true;
        delUserBatchRoles(params)
          .then(res => {
            if (res) {
              this.checkCurrRoles.map(item => {
                this.currentRoles.map((itm, idx) => {
                  if (item.roleName === itm.roleName) {
                    this.currentRoles.splice(idx, 1);
                    this.searchSelectRoles.push({
                      uid: item.uid,
                      roleName: item.roleName
                    });
                  }
                });
              });
              this.getList();
              this.checkCurrRoles = [];
              this.configRoleDialog = false;
              this.isRemoveRoleLoading = false;
            } else {
              this.isRemoveRoleLoading = false;
            }
          })
          .catch(() => {this.isRemoveRoleLoading = false;})
      }
    },
    // 加入所选角色
    addRolesData () {
      if (this.checkSelectRoles.length > 0) {
        let params = {
          proKey: this.userInfo.proKey,
          userId: this.roleUserId,
          roleIdList: []
        };
        this.checkSelectRoles.map(item => {
          params.roleIdList.push(item.uid);
        });
        this.isAddRoleLoading = true;
        addUserBatchRoles(params)
          .then(res => {
            if (res) {
              this.checkSelectRoles.map(item => {
                this.searchSelectRoles.map((itm, idx) => {
                  if (item.roleName === itm.roleName) {
                    this.searchSelectRoles.splice(idx, 1);
                    this.currentRoles.push({
                      uid: item.uid,
                      roleName: item.roleName
                    });
                  }
                });
              });
              this.getList();
              this.checkSelectRoles = [];
              this.configRoleDialog = false;
              this.isAddRoleLoading = false;
            } else {
              this.isAddRoleLoading = false;
            }
          })
          .catch(() => {this.isAddRoleLoading = false;})
      }
    },
    // 禁用用户
    forbiddenUser (obj) {
      const params = {
        proKey: this.userInfo.proKey,
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
            this.getList();
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
        proKey: this.userInfo.proKey,
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
            this.getList();
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
    // 所属组--展开收起
    openAllGroup (obj, val) {
      if (val) {
        this.minGroupLength = obj.sysUserGroupInfos.length;
      } else {
        this.minGroupLength = 3;
      }
      this.isGroupOpen = val;
    },
    // 所属角色--展开收起
    openAllRole (obj, val) {
      if (val) {
        this.minRoleLength = obj.sysUserRoleInfos.length;
      } else {
        this.minRoleLength = 3;
      }
      this.isRoleOpen = val;
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
}

</style>
<style lang="scss">
.dialog_comp_group {
  .el-dialog__body {
    padding: 0 0 30px 0;
    .userGroup_body {
      width: 100%;
      // clear: both;
      height: 577px;
      display: flex;
      border-top: 1px solid #F2F2F2;
      .group_left {
        padding-top: 8px;
        width: 50%;
        height: 100%;
        border-right: 1px solid #F2F2F2;
        // float: left;
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
        // float: left;
        .checkbox_box_right {
          height: calc(577px - 25px - 40px - 20px - 42px);
          margin-bottom: 20px;
          margin-top: 15px;
        }
        .el-input__inner {
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
          border: 1px solid #0C70F8;
          background-color: #0C70F8;
          color: #ffffff;
        }
      }
      .group_btn {
        // text-align: center;
        // line-height: 40px;
        width: 220px;
        height: 40px;
        // border-radius: 4px;
        // cursor: pointer;
      }
      .group_number {
        color: #999999;
        font-size: 12px;
      }
      .el-checkbox-group {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
      }
      .el-checkbox {
        padding-right: 20px;
        height: 25px;
      }
      .el-checkbox+.el-checkbox {
        margin-left: 0;
      }
      .el-checkbox:last-child {
        margin-right: 30px;
      }
     .el-checkbox__label {
        float: left;
      }
      .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #0C70F8;
        border-color: #0C70F8;
      }
      .el-checkbox__input.is-checked+.el-checkbox__label{
        color: #666666;
      }
     .el-checkbox__input {
        float: right;
      }
    }
  }
}
</style>



