<template>
  <div class="group-manage">
    <div class="header">
      <el-button class="add-btn" icon="el-icon-plus" @click="showAddUserGroup">新增组</el-button>
      <div class="right-search">
        <el-input  placeholder="请输入组名搜索查找" style="width: 240px;" v-model="groupName">
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
        class="group_table"
        :data="groupListData"
        >
        <el-table-column
          fixed
          label="序号"
          type="index"
          :show-overflow-tooltip='true'
          >
        </el-table-column>
        <el-table-column
          label="组名"
          prop="groupName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="创建者"
          prop="opUserName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          width="200"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="成员数"
          prop="userCount"
          width="200"
          >
        </el-table-column>
        <el-table-column
          label="角色配置"
          prop="roleList"
          >
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.roleList" :key="index">
              <template v-if="index < minRoleLength">
                {{item.roleName}}
              </template>
            </p>
            <p style="color: #0C70F8;cursor:pointer;" v-show="!isRoleOpen && scope.row.roleList.length > 3" @click="openAllRole(scope.row, true)">
              <span>展开全部</span>
              <i class="el-icon-arrow-down"></i>
            </p>
            <p style="color: #0C70F8;cursor:pointer;" v-show="isRoleOpen && scope.row.roleList.length > 3" @click="openAllRole(scope.row, false)">
              <span>收起</span>
              <i class="el-icon-arrow-up"></i>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="500" fixed="right">
          <template slot-scope="scope">
            <span class="operation_btn" @click="showSelectGroupDialog(scope.row)">查看组成员</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showEditDialog(scope.row)">编辑信息</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showAdminMember(scope.row)">管理成员</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showConfigRoleDialog(scope.row)">配置角色</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showDeleteDialog(scope.row)">删除用户组</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="pagination.pageNum"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
    <!--删除用户组弹出框-->
    <el-dialog
      title="是否确定删除该用户组及相关信息?"
      :visible.sync="delUserGroupDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">删除后数据不可恢复。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delUserGroupDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="deleteUserGroup">确认</el-button>
      </div>
    </el-dialog>
    <!--新增用户组弹出框-->
    <el-dialog
      title="创建用户组"
      :visible.sync="addUserGroupDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <el-form :model="userForm" ref="userForm" :rules="rules">
        <el-form-item label="" prop="groupName" class="group_name">
          <el-input placeholder="请输入用户组名称2-20位，中英文皆可，但不可重复" @change="changeGroupName" style="width: 90%;" v-model="userForm.groupName"></el-input>
          <p class="group_error_tip" v-show="isShowOrganError">用户组已存在</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('userForm')">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="addUserGroup('userForm')">保存</el-button>
      </div>
    </el-dialog>
    <!--编辑用户组弹出框-->
    <el-dialog
      title="编辑用户组"
      :visible.sync="editUserGroupDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <el-form :model="userForm" ref="userForm" :rules="rules">
        <el-form-item label="" prop="groupName" class="group_name">
          <el-input placeholder="请输入用户组名称2-20位，中英文皆可，但不可重复" @change="changeGroupName" style="width: 90%;" v-model="userForm.groupName"></el-input>
          <p class="group_error_tip" v-show="isShowOrganError">用户组已存在</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit('userForm')">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isEditLoading" @click="editUserGroups('userForm')">确认</el-button>
      </div>
    </el-dialog>
    <!--管理成员弹出框-->
    <el-dialog
      title="管理成员"
      :visible.sync="adminMemberDialog"
      width="521px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp_group"
      >
      <div class="userGroup_body">
        <div class="group_left clearfix">
          <p class="group_number">当前成员 (已选{{checkCurrMember.length > 0 ? checkCurrMember.length : 0}}个/共{{currentMembers.length > 0 ? currentMembers.length : 0}}个)</p>
          <div class="checkbox_box_left">
            <vue-scroll>
              <el-checkbox-group v-model="checkCurrMember">
                <el-checkbox v-for="(item, index) in currentMembers" :label="item" :key="index">{{item.userName}}</el-checkbox>
              </el-checkbox-group>
            </vue-scroll>
          </div>
          <div class="group_btn group_btn_left" @click="removeMembers">移除所选成员</div>
        </div>
        <div class="group_right">
          <p class="group_number">
            <span>可选成员</span>
            <span>(已选{{checkSelectMember.length > 0 ? checkSelectMember.length : 0}}个/共{{searchSelectMembers.length > 0 ? searchSelectMembers.length : 0}}个)</span>
          </p>
          <el-input placeholder="请输入成员姓名搜索" v-model="memberName" size="small" style="width: 220px;">
            <i v-show="closeShowMember" slot="suffix" @click="onClearMember" class="search_icon el-icon-close" style="font-size: 20px;"></i>
            <i
              v-show="!closeShowMember"
              class="search_icon vl_icon vl_icon_manage_1"
              slot="suffix"
              @click="searchMember">
            </i>
          </el-input>
           <div class="checkbox_box_right">
            <vue-scroll>
              <el-checkbox-group v-model="checkSelectMember">
                <el-checkbox v-for="(item ,index) in searchSelectMembers" :label="item" :key="index">{{item.userName}}</el-checkbox>
              </el-checkbox-group>
            </vue-scroll>
          </div>
          <div class="group_btn group_btn_right" @click="addMembers">添加所选成员</div>
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
          <div class="group_btn group_btn_left" @click="removeRoles">移除所选角色</div>
        </div>
        <div class="group_right">
          <p class="group_number">可选角色 (已选{{checkSelectRoles.length > 0 ? checkSelectRoles.length : 0}}个/共{{searchSelectRoles.length > 0 ? searchSelectRoles.length : 0}}个)</p>
          <el-input placeholder="请输入角色名搜索" v-model="userRoleName" size="small" style="width: 220px;">
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
          <div class="group_btn group_btn_right" @click="addSelectRoles">添加所选角色</div>
        </div>
      </div>
    </el-dialog>
    <!--查看组成员弹出框-->
    <el-dialog
      title="查看组成员"
      :visible.sync="selectGroupPersonDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div class="group-content">
        <p>{{selectGroupData.groupName}}</p>
        <div class="content-detail">
          <vue-scroll>
            <ul class="detail-ul">
              <li v-for="(item, index) in selectGroupData.userList" :key="index">{{item.userName}}</li>
            </ul>
          </vue-scroll>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { checkUserName } from '@/utils/validator.js';
import { getUserGroups, createUserGroups, updateUserGroups, delUserGroup, getUserList, getRoleList,
 addMemberInfo, delMemberInfo, addUserGroupRoles, delUserGroupRoles, judgeUserGroup } from '@/views/index/api/api.manage.js';
export default {
  data () {
    return {
      isShowOrganError: false,
      minRoleLength: 3, // 所属角色最多显示3个
      isRoleOpen: false, // 所属角色是否展开
      groupName: null, // 根据组名搜索
      isShowError: false, // 是否显示错误提示信息
      addTips: null, // 添加用户组的提示语
      closeShow: false,
      closeShowMember: false, // 清空搜索成员搜索框
      closeShowRole: false, // 清空搜索角色搜索框
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      currentMembers: [], // 当前成员
      selectMembers: [], // 所有可选成员
      searchSelectMembers: [], // 搜索出的可选成员
      checkSelectMember: [], // 勾选种的可选成员
      checkCurrMember: [], // 勾选中的当前成员
      currentRoles: [], // 当前角色
      selectRoles: [], // 可选角色
      searchSelectRoles: [], // 搜索出的可选角色
      checkSelectRoles: [], // 勾选种的可选角色
      checkCurrRoles: [], // 勾选中的当前角色
      currentGroupId: null, // 当前用户组id
      memberName: null, // 修改所属组名
      userRoleName: null, // 配置角色名
      currRoleId: null,
      groupListData: [],
      userForm: {
        groupName: null,
      },
      rules: {
        groupName: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
          { min: 2, message: '长度2-20位', trigger:'blur' },
          { max: 20, message: '长度2-20位', trigger:'blur' }
        ]
      },
      delUserGroupDialog: false, // 删除用户组弹出框
      addUserGroupDialog: false, // 创建用户组弹出框
      adminMemberDialog: false, // 管理成员弹出框
      configRoleDialog: false, // 配置角色弹出框
      editUserGroupDialog: false, // 编辑信息弹出框
      selectGroupPersonDialog: false, // 查看组成员弹出框
      editGroupId: null, // 要编辑用户组的id
      delGroupId: null, // 要删除用户组的id
      selectGroupData: {}, // 要查看的组成员数据
      storageInfo: {}, // 存储的用户信息
      isAddLoading: false, // 新增组加载中
      isEditLoading: false, // 编辑组加载中
      isDeleteLoading: false, // 删除组加载中
    }
  },
  created () {
    this.storageInfo = this.$store.state.loginUser;
  },
  mounted () {
    this.getList();
  },
  methods: {
    // 获取列表数据
    getList () {
      const params = {
        order: 'desc',
        orderBy: 'create_time',
        'where.groupName': this.groupName,
        pageNum: this.pagination.pageNum,
        'where.proKey': this.storageInfo.proKey
      };
      getUserGroups(params)
        .then(res => {
          if (res) {
            this.groupListData = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    // 搜索角色
    searchRole () {
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
    },
    // 清空搜索角色搜索框
    onClearRole () {
      this.userRoleName = null;
      this.searchSelectRoles = JSON.parse(JSON.stringify(this.selectRoles));
      this.closeShowRole = false;
    },
    // 搜索成员
    searchMember () {
      let reg = new RegExp(this.memberName);
      let arr = [];
      this.searchSelectMembers.map((item) => {
        let name = item.userName;
        if (name.match(reg)) {
          arr.push(item);
        }
      })
      this.searchSelectMembers = JSON.parse(JSON.stringify(arr));
      this.closeShowMember = true;
    },
    // 清空搜索成员搜索框
    onClearMember () {
      this.memberName = null;
      this.searchSelectMembers = JSON.parse(JSON.stringify(this.selectMembers));
      this.closeShowMember = false;
    },
    // 清除搜索框
    onClear () {
      this.groupName = null;
      this.closeShow = false;
      this.getList();
    },
    // 搜索
    searchData () {
      if (this.groupName) {
        this.closeShow = true;
        this.getList();
      }
    },
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getList();
    },
    changeGroupName (val) {
      if (!val) {
        this.isShowOrganError = false;
      }
    },
    // 显示创建用户组弹出框
    showAddUserGroup () {
      this.isShowOrganError = false;
      this.userForm.groupName = null;
      this.addUserGroupDialog = true;
    },
    // 创建用户组
    addUserGroup (form) {
      let _this = this;
      this.$refs[form].validate(valid => {
        if (valid) {
           const params = {
            proKey: _this.storageInfo.proKey,
            groupName: _this.userForm.groupName,
          }
          judgeUserGroup(params)
            .then(res => {
              if (res.data) {
                _this.isShowOrganError = true;
              } else {
                _this.isShowOrganError = false;
                _this.handleAddGroup(params);
              }
            })
            .catch(() => {})
        }
      })
    },
    handleAddGroup (obj) {
      this.isAddLoading = true;
      createUserGroups(obj)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '添加成功',
              customClass: 'request_tip'
            });
            this.addUserGroupDialog = false;
            this.getList();
            this.isAddLoading = false;
          } else {
            this.$message({
              type: 'error',
              message: '添加失败',
              customClass: 'request_tip'
            });
            this.isAddLoading = false;
          }
        })
        .catch(() => {this.isAddLoading = false;})
    },
    // 取消添加
    cancelAdd (form) {
      this.$refs[form].resetFields();
      this.isShowOrganError = false;
      this.addUserGroupDialog = false;
    },
    // 显示删除用户组弹出框
    showDeleteDialog (obj) {
      this.delGroupId = obj.uid;
      this.delUserGroupDialog = true;
    },
    // 删除用户组
    deleteUserGroup () {
      if (this.delGroupId) {
        this.isDeleteLoading = true;
        const params = {
          uid: this.delGroupId,
          proKey: this.storageInfo.proKey
        };
        delUserGroup(params)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              });
              this.delUserGroupDialog = false;
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
    // 显示管理成员弹出框
    showAdminMember (obj) {
      console.log(obj);
      this.currentMembers = [];
      this.searchSelectMembers = [];
      this.selectMembers = [];
      this.adminMemberDialog = true;
      this.currentGroupId = obj.uid;
      let allMembers; // 所有的用户
      if (obj.userList.length > 0) {
        obj.userList.map(item => {
          this.currentMembers.push({
            uid: item.uid,
            userName: item.userName
          });
        });
      }
      const params = {
        pageSize: 0,
        'where.proKey': this.storageInfo.proKey
      }
      getUserList(params)
        .then(res => {
          if (res) {
            allMembers = JSON.parse(JSON.stringify(res.data.list));
            if (this.currentMembers.length > 0) {
              this.currentMembers.map(item => {
                allMembers.map((itm, idx) => {
                  if (itm.userName === item.userName) {
                    allMembers.splice(idx, 1);
                  }
                });
              });
            }
            this.selectMembers = JSON.parse(JSON.stringify(allMembers));
            this.searchSelectMembers = JSON.parse(JSON.stringify(allMembers));
          }
        })
        .catch(() => {})
      
    },
    // 移出所选成员
    removeMembers () {
      if (this.checkCurrMember.length > 0) {
        let params = {
          proKey: this.storageInfo.proKey,
          groupId: this.currentGroupId,
          userIdList: []
        };
        this.checkCurrMember.map(item => {
          params.userIdList.push(item.uid);
        });
        delMemberInfo(params)
          .then(res => {
            if (res) {
              this.checkCurrMember.map(item => {
                this.currentMembers.map((itm, idx) => {
                  if (item.userName === itm.userName) {
                    this.currentMembers.splice(idx, 1);
                    this.searchSelectMembers.push({
                      uid: item.uid,
                      userName: item.userName
                    });
                  }
                });
              });
              this.getList();
              this.checkCurrMember = [];
            }
          })
          .catch(() => {})
      }
    },
    // 添加所选成员
    addMembers () {
      if (this.checkSelectMember.length > 0) {
        let params = {
          proKey: this.storageInfo.proKey,
          uid: this.currentGroupId,
          uids: []
        };
        this.checkSelectMember.map(item => {
          params.uids.push(item.uid);
        });
        addMemberInfo(params)
          .then(res => {
            if (res) {
              this.checkSelectMember.map(item => {
                this.searchSelectMembers.map((itm, idx) => {
                  if (item.userName === itm.userName) {
                    this.searchSelectMembers.splice(idx, 1);
                    this.currentMembers.push({
                      uid: item.uid,
                      userName: item.userName
                    });
                  }
                });
              });
              this.getList();
              this.checkSelectMember = [];
            }
          })
          .catch(() => {})
      }
    },
    // 显示配置角色弹出框
    showConfigRoleDialog (obj) {
      this.currRoleId = obj.uid;
      let allRoles = []; // 所有角色
      this.currentRoles = [];
      this.selectRoles = [];
      this.searchSelectRoles = [];
      this.configRoleDialog = true;
      if (obj.roleList.length > 0) {
        obj.roleList.map(item => {
          this.currentRoles.push({
            uid: item.uid,
            roleName: item.roleName
          });
        });
      }
      const params = {
        'where.proKey': this.storageInfo.proKey,
        pageSize: 0,
      }
      getRoleList(params)
        .then(res => {
          if (res) {
            allRoles = JSON.parse(JSON.stringify(res.data.list));
            if (this.currentRoles.length > 0) {
              this.currentRoles.map(item => {
                allRoles.map((itm, index) => {
                  if (item.roleName === itm.roleName) {
                    allRoles.splice(index, 1);
                  }
                });
              });
            }
            this.selectRoles = JSON.parse(JSON.stringify(allRoles));
            this.searchSelectRoles = JSON.parse(JSON.stringify(allRoles));
          }
        });
    },
    // 添加所选角色
    addSelectRoles () {
      if (this.checkSelectRoles.length > 0) {
        let params = {
          proKey: this.storageInfo.proKey,
          groupId: this.currRoleId,
          roleIdList: []
        };
        this.checkSelectRoles.map(item => {
          params.roleIdList.push(item.uid);
        });
        addUserGroupRoles(params)
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
            }
          })
          .catch(() => {})
      }
    },
    // 移除所选角色
    removeRoles () {
      if (this.checkCurrRoles.length > 0) {
        let params = {
          proKey: this.storageInfo.proKey,
          groupId: this.currRoleId,
          roleIdList: []
        };
        this.checkCurrRoles.map(item => {
          params.roleIdList.push(item.uid);
        });
        delUserGroupRoles(params)
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
            }
          })
          .catch(() => {})
      }
    },
    // 显示查看组成员弹出框
    showSelectGroupDialog (obj) {
      this.selectGroupData = obj;
      this.selectGroupPersonDialog = true;
    },
    // 显示编辑信息弹出框
    showEditDialog (obj) {
      console.log(obj);
      this.editGroupId = obj.uid;
      this.isShowOrganError = false;
      this.userForm.groupName = obj.groupName;
      this.editUserGroupDialog = true;
    },
    // 编辑信息
    editUserGroups (form) {
      let _this = this;
      this.$refs[form].validate(valid => {
        if(valid) {
          const params = {
            proKey: _this.storageInfo.proKey,
            groupName: _this.userForm.groupName,
          }
          judgeUserGroup(params)
            .then(res => {
              if (res.data) {
                _this.isShowOrganError = true;
              } else {
                _this.isShowOrganError = false;
                _this.handleEditGroups();
              }
            })
            .catch(() => {})
        }
      })
    },
    handleEditGroups () {
      this.isEditLoading = true;
      const params = {
        proKey: this.storageInfo.proKey,
        uid: this.editGroupId,
        groupName: this.userForm.groupName
      };
      updateUserGroups(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '修改成功',
              customClass: 'request_tip'
            });
            this.editUserGroupDialog = false;
            this.isEditLoading = false;
            this.getList();
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
    },
    // 取消编辑
    cancelEdit (form) {
      this.editUserGroupDialog = false;
      this.isShowOrganError = false;
      this.$refs[form].resetFields();
    },
    // 所属角色--展开收起
    openAllRole (obj, val) {
      if (val) {
        this.minRoleLength = obj.roleList.length;
      } else {
        this.minRoleLength = 3;
      }
      this.isRoleOpen = val;
    }
  }
}
</script>
<style lang="scss" scoped>
.group-manage {
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
    .group_table {
      margin-top: 8px;
      .operation_btn {
        color: #0C70F8;
        cursor: pointer;
        padding: 0 10px;
        display: inline-block;
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
        /deep/ .el-checkbox:last-child {
          margin-right: 30px;
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
  .dialog_comp {
    .group_name {
      position: relative;
      .group_error_tip {
        position: absolute;
        height: 10px;
        line-height: 10px;
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
      }
    }
    .group-content {
      >p {
        color: #999999;
      }
      .content-detail {
        border: 1px solid #D3D3D3;
        border-radius: 4px;
        margin-top: 10px;
        height: 370px;
        color: #666666;
        .detail-ul {
          > li {
            padding: 7px 15px;
          }
        }
      }
    }
    .error_tip {
      color: #f56c6c;
      margin: 3px 5px;
    }
  }
}
</style>

