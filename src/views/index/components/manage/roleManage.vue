<template>
<vue-scroll>
  <div class="role-manage">
    <div class="header">
      <el-button class="add-btn" icon="el-icon-plus" @click="showAddRole">创建角色</el-button>
      <div class="right-search">
        <el-input  placeholder="请输入角色名搜索查找" style="width: 240px;" v-model="roleName">
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
        class="role_table"
        :data="roleListData"
        >
        <el-table-column
          fixed
          label="序号"
          type="index"
          :show-overflow-tooltip='true'
          >
        </el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="描述"
          prop="roleDesc"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <span>{{scope.row.createTime | fmTimestamp}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350">
          <template slot-scope="scope">
            <span class="operation_btn" @click="showSelectAuthorityDialog(scope.row)">查看权限</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showEditDialog(scope.row)">编辑角色</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showConfigRoleDialog(scope.row)">配置权限</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showDeleteDialog(scope.row)">删除角色</span>
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
    <!--删除角色弹出框-->
    <el-dialog
      title="是否确定删除该角色及关联信息?"
      :visible.sync="delRoleDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">删除后数据不可恢复。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delRoleDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="deleteRole">确认</el-button>
      </div>
    </el-dialog>
    <!--创建角色弹出框-->
    <el-dialog
      title="创建角色"
      :visible.sync="createRoleDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div style="margin-top: 15px;">
        <el-form :model="addRole" :rules="rules" ref="addRole" label-width="15px">
          <el-form-item prop="roleName" label=" " class="role_name">
            <el-input v-model="addRole.roleName" placeholder="请输入角色名字2-20位，中英文皆可，但不可重复"></el-input>
            <p class="group_error_tip" v-show="isShowOrganError">角色已存在</p>
          </el-form-item>
          <el-form-item prop="roleDesc">
            <el-input type="textarea" rows="6" v-model="addRole.roleDesc" placeholder="请简要描述角色，文字限制50字。"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('addRole')">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="addUser('addRole')">保存</el-button>
      </div>
    </el-dialog>
    <!--编辑角色弹出框-->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div style="margin-top: 15px;">
        <el-form :model="editRole" :rules="rules" ref="editRole" label-width="15px">
          <el-form-item prop="roleName" label=" " class="role_name">
            <el-input v-model="editRole.roleName" placeholder="请输入角色名字2-20位，中英文皆可，但不可重复"></el-input>
            <p class="group_error_tip" v-show="isShowOrganError">角色已存在</p>
          </el-form-item>
          <el-form-item prop="roleDesc">
            <el-input type="textarea" rows="6" v-model="editRole.roleDesc" placeholder="请简要描述角色，文字限制50字。"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit('editRole')">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isEditLoading" @click="editRoleInfo('editRole')">确认</el-button>
      </div>
    </el-dialog>
    <!--查看权限弹出框-->
    <el-dialog
      title="查看权限"
      :visible.sync="selectAuthorityDialog"
      width="524px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp_select"
      >
      <div class="role_select_body">
        <div class="role_select_left">
          <p>权限组</p>
          <ul>
            <li>组1</li>
            <li>组2</li>
            <li>组3</li>
            <li>组4</li>
            <li>组5</li>
            <li>组6</li>
            <li>组7</li>
            <li>组8</li>
          </ul>
        </div>
        <div class="role_select_right">
          <p>角色名称</p>
          <div class="tree_list_right">
            <vue-scroll>
              <el-tree icon-class="el-icon-arrow-right" :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </vue-scroll>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:right;">
        <el-button class="select_function_btn" @click="selectAuthorityDialog = false">配置权限</el-button>
      </div>
    </el-dialog>
    <!--配置权限弹出框-->
    <el-dialog
      title="配置权限"
      :visible.sync="configAuthorityDialog"
      width="524px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp dialog_comp_select dialog_comp_config"
      >
      <div class="role_select_body">
        <div class="role_select_left">
          <p>权限组</p>
          <ul>
            <li>组1</li>
            <li>组2</li>
            <li>组3</li>
            <li>组4</li>
            <li>组5</li>
            <li>组6</li>
            <li>组7</li>
            <li>组8</li>
          </ul>
        </div>
        <div class="role_select_right">
          <p>角色名称</p>
          <div class="tree_list_right">
            <vue-scroll>
              <el-tree icon-class="el-icon-arrow-right" :data="data" show-checkbox :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </vue-scroll>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="configAuthorityDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="configAuthorityDialog = false">确认</el-button>
      </div>
    </el-dialog>
  </div>
</vue-scroll>
</template>
<script>
import { getRoleList, createRole, delRole, updateRole, judgeRoleName } from '@/views/index/api/api.manage.js';
export default {
  data () {
    return {
      isShowOrganError: false,
      closeShow: false, //是否显示清空搜索框
      roleName: null, // 角色名搜索
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1',
            children: [{
              label: '四级 1-1-1',
              children: [{
                label: '五级 1-1-1'
              }]
            }]
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      addRole: {
        proKey: null,
        roleName: null,
        roleDesc: null
      },
      editRole: {
        proKey: null,
        uid: null,
        roleName: null,
        roleDesc: null
      },
      rules: {
        roleName: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
          { min: 2, message: '最少输入2个字符' },
          { max: 20, message: '最多输入20个字符' }
        ],
        roleDesc: [
          { max: 50, message: '最多输入50个字符' }
        ]
      },
      roleListData: [],
      delRoleDialog: false, // 删除角色弹出框
      createRoleDialog: false, // 创建角色弹出框
      editRoleDialog: false, // 编辑角色弹出框
      selectAuthorityDialog: false, // 查看权限弹出框
      configAuthorityDialog: false, // 配置权限弹出框
      userInfo: {},
      deleteRoleId: null, // 要删除的角色id
      isAddLoading: false, // 新增角色加载中
      isEditLoading: false, // 编辑角色加载中
      isDeleteLoading: false, // 删除角色加载中
    }
  },
  created () {
    this.userInfo = this.$store.state.loginUser;
    this.addRole.proKey = this.userInfo.proKey;
    this.editRole.proKey = this.userInfo.proKey;
  },
  mounted () {
    this.getList();
  },
  methods: {
    // 获取角色列表
    getList () {
      const params = {
        'where.roleName': this.roleName,
        'where.proKey': this.userInfo.proKey,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        order: 'desc',
        orderBy: 'create_time'
      }
      getRoleList(params)
        .then(res => {
          if (res) {
            this.roleListData = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
    },
    // 清空搜索框
    onClear () {
      this.roleName = null;
      this.closeShow = false;
      this.getList();
    },
    // 搜索
    searchData () {
      if (this.roleName) {
        this.closeShow = true;
        this.getList();
      }
    },
    handleNodeClick () {},
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getList();
    },
    // 显示创建角色弹出框
    showAddRole () {
      this.isShowOrganError = false;
      this.createRoleDialog = true;
    },
    // 创建用户
    addUser (form) {
      this.$refs[form].validate(valid => {
        this.isShowOrganError = false;
        if (valid) {
          const params = {
            proKey: this.userInfo.proKey,
            roleName: this.addRole.roleName
          }
          judgeRoleName(params)
            .then(res => {
              if (res.data) {
                this.isShowOrganError = true;
              } else {
                this.isShowOrganError = false;
                this.handleAddRole();
              }
            })
            .catch(() => {})
          
        }
      })
    },
    handleAddRole () {
      this.isAddLoading = true;
      createRole(this.addRole)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '添加成功',
              customClass: 'request_tip'
            });
            this.createRoleDialog = false;
            this.isAddLoading = false;
            this.getList();
            // this.$refs[form].resetFields();
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
    // 取消添加用户
    cancelAdd (form) {
      this.$refs[form].resetFields();
      this.isShowOrganError = false;
      this.createRoleDialog = false;
    },
    // 显示删除角色弹出框
    showDeleteDialog (obj) {
      this.deleteRoleId = obj.uid;
      this.delRoleDialog = true;
    },
    // 删除角色
    deleteRole () {
      if (this.deleteRoleId) {
        this.isDeleteLoading = true;
        const data = {
          uid: this.deleteRoleId,
          proKey: this.userInfo.proKey
        };
        delRole(data)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              });
              this.delRoleDialog = false;
              this.isDeleteLoading = false;
              this.getList();
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
    // 显示编辑角色弹出框
    showEditDialog (obj) {
      this.isShowOrganError = false;
      this.editRole.uid = obj.uid;
      this.editRole.proKey = this.userInfo.proKey;
      this.editRole.roleName = obj.roleName;
      this.editRole.roleDesc = obj.roleDesc;
      this.editRoleDialog = true;
    },
    // 编辑角色 
    editRoleInfo (form) {
      this.$refs[form].validate(valid => {
        this.isShowOrganError = false;
        if (valid) {
          const params = {
            proKey: this.userInfo.proKey,
            roleName: this.editRole.roleName
          };
          judgeRoleName(params)
            .then(res => {
              if (res.data) {
                this.isShowOrganError = true;
              } else {
                this.isShowOrganError = false;
                this.handleEditRoleInfo();
              }
            })
            .catch(() => {})
        }
      })
    },
    handleEditRoleInfo () {
      this.isEditLoading = true;
      updateRole(this.editRole)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '修改成功',
              customClass: 'request_tip'
            });
            this.editRoleDialog = false;
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
      this.isShowOrganError = false;
      this.$refs[form].resetFields();
      this.editRoleDialog = false;
    },
    // 显示查看权限弹出框
    showSelectAuthorityDialog (obj) {
      console.log(obj);
      this.selectAuthorityDialog = true;
    },
    // 显示配置权限弹出框
    showConfigRoleDialog (obj) {
      console.log(obj);
      this.configAuthorityDialog = true;
    }
  }
}
</script>
<style lang="scss" scoped>
.role-manage {
  padding: 20px;
  .header {
    background-color: #ffffff;
    padding: 20px 10px;
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
    background-color: #ffffff;
    padding: 0 10px;
    .role_table {
      .operation_btn {
        color: #0C70F8;
        cursor: pointer;
        padding: 0 10px;
        display: inline-block;
      }
    }
  }
  .el-pagination {
    background-color: #ffffff;
  }
  .dialog_comp_select {
    /deep/ .el-dialog__body {
      padding: 0 0 10px 0;
      .role_select_body {
        width: 100%;
        clear: both;
        height: 500px;
        border-top: 1px solid #F2F2F2;
        .role_select_left {
          padding-top: 8px;
          width: 50%;
          height: 100%;
          border-right: 1px solid #F2F2F2;
          float: left;
          > p {
            padding-left: 20px;
            color: #999999;
            font-size: 12px;
          }
          >ul {
            margin-top: 10px;
            >li {
              height: 36px;
              line-height: 36px;
              padding-left: 20px;
              color: #333333;
              &:hover {
                background-color: #E0F2FF;
                cursor: pointer;
              }
            }
          }
        }
        .role_select_right {
          padding-top: 8px;
          width: 50%;
          height: 100%;
          padding-left: 20px;
          float: left;
          >p {
            color: #999999;
            font-size: 12px;
          }
          .tree_list_right {
            height: calc(500px - 25px);
            margin-bottom: 20px;
            margin-top: 10px;
            /deep/ .el-tree-node:focus>.el-tree-node__content {
              background-color: #ffffff;
              color: #0C70F8;
              >span {
                color: #0C70F8;
              }
            }
            /deep/ .el-tree-node:hover>.el-tree-node__content {
              background-color: #ffffff;
            }
          }
        }
      }
    }
    .select_function_btn {
      color: #ffffff;
      background-color: #0C70F8;
      border-color: #0C70F8;
    }
  }
  .dialog_comp_config {
    /deep/ .el-tree-node__content {
      display: inherit;
      padding-right: 15px;
      /deep/ .el-checkbox {
        float: right;
      }
      /deep/.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #0C70F8;
        border-color: #0C70F8;
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
  }
}
</style>


