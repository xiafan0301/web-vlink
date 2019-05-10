<template>
  <vue-scroll>
    <div class="department-manage">
      <div class="header">
        <el-button class="add-btn" icon="el-icon-plus" @click="showNewDepartment">新增部门</el-button>
        <el-input  placeholder="请输入部门名称" style="width: 240px;" v-model="organName">
          <i v-show="closeShow" slot="suffix" @click="onClear()" class="search_icon el-icon-close" style="font-size: 20px;"></i>
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
          class="department_table"
          :data="departmentData"
          >
          <el-table-column
            fixed
            label="序号"
            type="index"
            :show-overflow-tooltip='true'
            >
          </el-table-column>
          <el-table-column
            label="部门名称"
            prop="organName"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="上级部门"
            prop="parentOrganName"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="部门负责人"
            prop="chargeUserNameStr"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="负责人联系方式"
            prop="chargeUserMobile"
            >
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <span class="operation_btn" @click="skipSelectDetail(scope.row)">查看</span>
              <span style="color: #f2f2f2">|</span>
              <span class="operation_btn" @click="showEditDialog(scope.row)">编辑</span>
              <span style="color: #f2f2f2">|</span>
              <span class="operation_btn" @click="showDeleteDialog(scope.row)">删除</span>
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
      <!--新增部门弹框-->
      <el-dialog
        title="新增部门"
        :visible.sync="newDepartmentDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
        >
        <div style="margin-top: 10px;">
          <el-form :model="addDepartment" :rules="addRules" ref="addDepartment" label-width="10px">
            <el-form-item label=" " prop="organName" class="organ_name">
              <el-input v-model="addDepartment.organName" @change="handleChangeOrganName" style="width: 95%;" placeholder="请输入部门名称"></el-input>
              <p class="organ_error_tip" v-show="isShowOrganError">部门已存在</p>
            </el-form-item>
            <el-form-item label=" " prop="organPid">
              <el-select style="width: 95%;" v-model="addDepartment.organPid" placeholder="请选择上级部门">
                <el-option
                  v-for="(item, index) in allDepartmentData"
                  :key="'item' + index"
                  :label="item.organName"
                  :value="item.uid"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label=" " prop="chargeUserName">
              <el-select style="width: 95%" filterable clearable v-model="addDepartment.chargeUserName" placeholder="请搜索部门负责人姓名">
                <el-option
                  v-for="(item, index) in userList"
                  :key="'item' + index"
                  :label="item.userName"
                  :value="item.uid"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAdd('addDepartment')">取消</el-button>
          <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="addDepartmentInfo('addDepartment')">确认</el-button>
        </div>
      </el-dialog>
      <!--编辑部门弹框-->
      <el-dialog
        title="编辑部门"
        :visible.sync="editDepartmentDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
        >
        <div style="margin-top: 10px;">
          <el-form :model="editDepartment" ref="editDepartment" :rules="editRules" label-width="10px">
            <el-form-item label=" " prop="organName" class="organ_name">
              <el-input v-model="editDepartment.organName" @change="handleChangeOrganName" style="width: 95%;" placeholder="请输入部门名称"></el-input>
              <p class="organ_error_tip" v-show="isShowOrganError">部门已存在</p>
            </el-form-item>
            <el-form-item label="" prop="pid">
              <el-select style="width: 95%;" v-model="editDepartment.pid" placeholder="请选择上级部门" disabled>
                <el-option
                  v-for="(item, index) in allDepartmentData"
                  :key="'item' + index"
                  :label="item.organName"
                  :value="item.uid"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label=" " prop="chargeUserName">
              <el-select style="width: 95%;" filterable v-model="editDepartment.chargeUserName" placeholder="请搜索部门负责人姓名">
                <el-option
                  v-for="(item, index) in userList"
                  :key="'item' + index"
                  :label="item.userName"
                  :value="item.uid"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEdit('editDepartment')">取消</el-button>
          <el-button class="operation_btn function_btn" :loading="isEditLoading" @click="editDepartmentInfo('editDepartment')">确认</el-button>
        </div>
      </el-dialog>
      <!--删除部门弹出框-->
      <el-dialog
        title="是否确认删除部门？"
        :visible.sync="delDepartmentDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
        >
        <span style="color: #999999;">删除后数据不可恢复。</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="delDepartmentDialog = false">取消</el-button>
          <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="deleteDepartment">确认</el-button>
        </div>
      </el-dialog>
      <!--删除下级部门弹出框-->
      <el-dialog
        title="删除时将删除部门及其下级部门，是否确认删除？"
        :visible.sync="delChildDepartmentDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
        >
        <span style="color: #999999;">删除后数据不可恢复。</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="delChildDepartmentDialog = false">取消</el-button>
          <el-button class="operation_btn function_btn" :loading="isDeleteChildLoading" @click="delChildDepart">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </vue-scroll>
</template>
<script>
import { judgeDepart, getDepartmentList, updateDepart, delDepart, addDepart, getUserList } from '@/views/index/api/api.manage.js';
export default {
  data () {
    return {
      isShowOrganError: false, // 部门机构错误提示
      closeShow: false, // 清空搜索框
      organName: null, // 搜索的部门名称
      departmentData: [], // 分页列表数据
      allDepartmentData: [], // 所有的部门列表数据
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      newDepartmentDialog: false, // 新建部门弹出框
      delDepartmentDialog: false, // 删除部门弹出框
      delChildDepartmentDialog: false, // 删除下级部门弹出框
      editDepartmentDialog: false, // 编辑部门弹出框
      addDepartment: {
        proKey: null,
        organName: null,
        organPid: null,
        chargeUserName: null
      },
      editDepartment: {
        proKey: null,
        uid: null,
        organName: null,
        pid: null,
        chargeUserName: null
      },
      addRules: {
        organName: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
          { max: 10, message: '最多输入10个字', trigger: 'blur' }
        ],
        organPid: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ]
      },
      editRules: {
        organName: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
          { max: 10, message: '最多输入10个字', trigger: 'blur' }
        ]
      },
      deleteId: null, // 要删除的部门id
      userList: [], // 用户列表
      userInfo: {}, // 存储的用户信息
      isAddLoading: false, // 新增部门加载中
      isEditLoading: false, // 编辑部门加载中
      isDeleteLoading: false, // 删除部门加载中
      isDeleteChildLoading: false, // 删除子级部门加载中
    }
  },
  created () {
    this.userInfo = this.$store.state.loginUser;
  },
  mounted () {
    this.addDepartment.proKey = this.userInfo.proKey;
    this.editDepartment.proKey= this.userInfo.proKey;
    this.getList();
  },
  methods: {
    // 分页获取列表数据
    getList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        'where.organName': this.organName,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      };
      getDepartmentList(params)
        .then(res => {
          if (res && res.data.list) {
            this.departmentData = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
    },
    getAllDepartList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0,
      };
      getDepartmentList(params)
        .then(res => {
          if (res && res.data.list) {
            this.allDepartmentData = res.data.list;
          }
        })
    },
    // 获取用户数据
    getUsersData () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0,
      };
      getUserList(params)
        .then(res => {
          if (res && res.data.list) {
            this.userList = res.data.list;
          }
        })
        .catch(() => {})
    },
    // 根据部门名称搜索
    searchData () {
      this.getList();
      this.closeShow = true;
    },
    // 清空搜索框
    onClear () {
      this.closeShow = false;
      this.organName = null;
      this.getList();
    },
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getList();
    },
    // 跳至部门详情页
    skipSelectDetail (obj) {
      this.$router.push({name: 'department_detail', query: {id: obj.uid}});
    },
    // 部门名称change
    handleChangeOrganName (val) {
      if (!val) {
        this.isShowOrganError = false;
      } 
    },
    // 显示新增部门弹出框
    showNewDepartment () {
      this.getAllDepartList();
      this.getUsersData();
      this.isShowOrganError = false;
      this.addDepartment.organName = null;
      this.addDepartment.organPid = null;
      this.addDepartment.chargeUserName = null;
      this.newDepartmentDialog = true;
    },
    // 显示编辑部门弹出框
    showEditDialog (obj) {
      this.getAllDepartList();
      this.getUsersData();
      this.isShowOrganError = false;
      this.editDepartment.uid = obj.uid;
      this.editDepartment.organName = obj.organName;
      this.editDepartment.pid = obj.organPid;
      this.editDepartment.chargeUserName = obj.chargeUserName;
      this.editDepartmentDialog = true;
    },
    // 显示删除部门的弹出框
    showDeleteDialog (obj) {
      this.deleteId = obj.uid;
      if ((obj.organRight - obj.organLeft) > 1) {
        this.delChildDepartmentDialog = true;
      } else {
        this.delDepartmentDialog = true;
      }
    },
    // 删除部门
    deleteDepartment () {
      const params = {
        deleteId: this.deleteId,
        proKey: this.userInfo.proKey
      };
      this.isDeleteLoading = true;
      delDepart(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功',
              customClass: 'request_tip'
            });
            this.getList();
            this.delDepartmentDialog = false;
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
    },
    // 删除下级部门
    delChildDepart () {
      const params = {
        deleteId: this.deleteId,
        proKey: this.userInfo.proKey
      };
      this.isDeleteChildLoading = true;
      delDepart(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功',
              customClass: 'request_tip'
            });
            this.getList();
            this.delChildDepartmentDialog = false;
            this.isDeleteChildLoading = false;
          } else {
            this.$message({
              type: 'error',
              message: '删除失败',
              customClass: 'request_tip'
            });
            this.isDeleteChildLoading = false;
          }
        })
        .catch(() => {this.isDeleteChildLoading = false;})
    },
    // 添加部门
    addDepartmentInfo (form) {
      this.$refs[form].validate(valid => {
        this.isShowOrganError = false;
        if (valid) {
          const params = {
            proKey: this.userInfo.proKey,
            organName: this.addDepartment.organName
          }
          judgeDepart(params)
            .then(res => {
              if (res.data) {
                this.isShowOrganError = true;
              } else {
                this.isShowOrganError = false;
                this.handleAddDepartment();
              }
            })
            .catch(() => {})
        }
      })
    },
    handleAddDepartment () {
      this.isAddLoading = true;
      addDepart(this.addDepartment)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '添加成功',
              customClass: 'request_tip'
            });
            this.newDepartmentDialog = false;
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
    // 编辑部门
    editDepartmentInfo (form) {
      this.$refs[form].validate(valid => {
        this.isShowOrganError = false;
        if (valid) {
          const params = {
            proKey: this.userInfo.proKey,
            organName: this.editDepartment.organName
          }
          judgeDepart(params)
            .then(res => {
              if (res.data) {
                this.isShowOrganError = true;
              } else {
                this.isShowOrganError = false;
                this.handleEditDepartment();
              }
            })
            .catch(() => {})
        } 
      })
    },
    handleEditDepartment () {
      this.isEditLoading = true;
      updateDepart(this.editDepartment)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '修改成功',
              customClass: 'request_tip'
            });
            this.editDepartmentDialog = false;
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
    },
    // 取消编辑
    cancelEdit (form) {
      this.$refs[form].resetFields();
      this.isShowOrganError = false;
      this.editDepartmentDialog = false;
    },
    // 取消添加
    cancelAdd (form) {
      this.$refs[form].resetFields();
      this.isShowOrganError = false;
      this.newDepartmentDialog = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.department-manage {
  padding: 20px;
  .header {
    padding: 10px;
    display: flex;
    justify-content: space-between;
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
    .department_table {
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
    .organ_name {
      position: relative;
      .organ_error_tip {
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

