<template>
<vue-scroll>
  <div class="mark_manage">
    <div class="search_box">
      <el-form :inline="true" :model="searchForm" class="search_form" ref="searchForm">
        <el-form-item prop="reportTime">
          <el-date-picker
            style="width: 260px;"
            v-model="searchForm.reportTime"
            type="daterange"
            :picker-options="pickerOptions0"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="deptId">
          <el-select  style="width: 240px;" v-model="searchForm.deptId" placeholder="操作部门">
            <el-option
              v-for="(item, index) in allDepartmentData"
              :key="index"
              :label="item.organName"
              :value="item.uid"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="userId">
          <el-select style="width: 240px;" v-model="searchForm.userId" placeholder="操作用户">
            <el-option
              v-for="(item, index) in usersList"
              :key="index"
              :label="item.userRealName"
              :value="item.uid"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn" @click="selectDataList">查询</el-button>
          <el-button class="reset_btn" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="divide"></div>
    </div>
    <div class="table_box">
      <div class="add_mark_btn" @click="showAddMarkDialog">
        <span>+</span>
        <span>新增标记</span>
      </div>
      <el-table
        class="mark_table"
        :data="dataList"
        >
        <el-table-column
          fixed
          label="序号"
          type="index"
          >
        </el-table-column>
        <el-table-column
          label="标记内容"
          prop="content"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="操作部门"
          prop="deptName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="操作用户"
          prop="userName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          show-overflow-tooltip
          align="center"
          >
          <template slot-scope="scope">
            <span>{{scope.row.createTime | fmTimestamp}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
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
    <!--新增标记弹出框-->
    <el-dialog
      title="新增标记"
      :visible.sync="createMarkDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div style="margin-top: 15px;">
        <el-form :model="markForm" :rules="rules" ref="markForm" label-width="15px">
          <el-form-item prop="markName" label=" " class="mark_name">
            <el-input v-model="markForm.markName" placeholder="请输入标记名称" maxlength="20"></el-input>
            <p class="mark_error_tip" v-show="isShowError">该标记已存在</p>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('markForm')">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="addMark('markForm')">确定</el-button>
      </div>
    </el-dialog>
    <!--编辑标记弹出框-->
    <el-dialog
      title="编辑标记"
      :visible.sync="editMarkDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div style="margin-top: 15px;">
        <el-form :model="markForm" :rules="rules" ref="markForm" label-width="15px">
          <el-form-item prop="markName" label=" " class="mark_name">
            <el-input v-model="markForm.markName" placeholder="请输入标记名称" maxlength="20"></el-input>
            <p class="mark_error_tip" v-show="isShowError">该标记已存在</p>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit('markForm')">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isEditLoading" @click="editMark('markForm')">确定</el-button>
      </div>
    </el-dialog>
    <!--删除标记弹出框-->
    <el-dialog
      title="是否确定删除该标记?"
      :visible.sync="delMarkDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">删除后数据不可恢复。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delMarkDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="deleteMark">确认</el-button>
      </div>
    </el-dialog>
  </div>
</vue-scroll>
</template>
<script>
import { getDepartmentList, getUserList } from '@/views/index/api/api.manage.js';
import { apiVideoSignContent, apiGetVideoRecords, deleteVideoRecords, updateVideoRecords } from '@/views/index/api/api.video.js';
export default {
  data () {
    return {
      isShowError: false,
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() > (new Date().getTime());
        }
      },
      searchForm: {
        reportTime: [],
        userId: null,
        deptId: null,
      },
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      dataList: [],
      markForm: {
        markName: null,
      },
      rules: {
        markName: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
          { max: 20, message: '最多输入20个字', trigger: 'blur' }
        ]
      },
      createMarkDialog: false, // 新增标记弹出框
      editMarkDialog: false, // 编辑标记弹出框
      delMarkDialog: false, // 删除标记弹出框
      markId: null, // 要编辑或删除的id
      isAddLoading: false, // 新增标记弹出框
      isEditLoading: false, // 编辑标记弹出框
      isDeleteLoading: false, // 删除标记弹出框
      userInfo: {}, // 用户信息
      allDepartmentData: [], // 部门列表
      usersList: [], // 用户列表
      originMarkName: null
    }
  },
  mounted () {
    this.userInfo = this.$store.state.loginUser;

    this.getUsersList();
    this.getAllDepartList();
    this.getList();
  },
  methods: {
    // 获取部门列表
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
    // 获取所有的用户
    getUsersList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0
      }
      getUserList(params)
        .then(res => {
          if (res) {
            this.usersList = res.data.list;
          }
        })
        .catch(() => {})
    },
    // 获取标记内容列表
    getList () {
      if (this.searchForm.reportTime === null) {
        this.searchForm.reportTime = [];
      }
      const params = {
        'where.startDate': this.searchForm.reportTime[0],
        'where.endDate': this.searchForm.reportTime[1],
        'where.userId': this.searchForm.userId,
        'where.deptId': this.searchForm.deptId,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        orderBy: 'create_time',
        order: 'desc'
      }
      apiGetVideoRecords(params)
        .then(res => {
          if (res) {
            this.dataList = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    // 搜索数据
    selectDataList () {
      this.getList();
    },
    // 重置查询条件
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getList();
    },
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getList();
    },
    // 显示新增标记弹出框
    showAddMarkDialog () {
      this.isShowError = false;
      this.markForm.markName = null;
      this.createMarkDialog = true;
    },
    // 新增标记
    addMark (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
           const params = {
            content: this.markForm.markName,
            uid: 0
          };
          this.isAddLoading = true;
          apiVideoSignContent(params)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '新增成功',
                  customClass: 'request_tip'
                })
                this.createMarkDialog = false;
                this.getList();
                this.isAddLoading = false;
              } else {
                this.isAddLoading = false;
              }
            })
            .catch(() => {this.isAddLoading = false;})
        }
      })
    },
    // 取消新增
    cancelAdd (form) {
      this.isShowError = false;
      this.markForm.markName = null;
      this.createMarkDialog = false;
      this.$refs[form].resetFields();
    },
    // 显示编辑弹出框
    showEditDialog (obj) {
      this.isShowError = false;
      this.markId = obj.uid;
      this.markForm.markName = obj.content;
      this.originMarkName = obj.content; // 保存还未修改的标记名称，最后判断是否修改
      this.editMarkDialog = true;
    },
    // 编辑标记
    editMark (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          const params = {
            uid: this.markId,
            content: this.markForm.markName
          };
          if (this.originMarkName === this.markForm.markName) { // 若没有修改标记名称，则直接关闭弹框
            this.editMarkDialog = false;
            return;
          }
          this.isEditLoading = true;
          updateVideoRecords(params)
            .then(res => {
              if (res) {
                 this.$message({
                  type: 'success',
                  message: '修改成功',
                  customClass: 'request_tip'
                })
                this.editMarkDialog = false;
                this.getList();
                this.isEditLoading = false;
              } else {
                this.isEditLoading = false;
              }
            })
            .catch(() => {this.isEditLoading = false;})
        }
      })
    },
    // 取消编辑
    cancelEdit (form) {
      this.isShowError = false;
      this.markForm.markName = null;
      this.editMarkDialog = false;
      this.$refs[form].resetFields();
    },
    // 显示删除标记弹出框
    showDeleteDialog (obj) {
      this.markId = obj.uid;
      this.delMarkDialog = true;
    },
    // 删除标记
    deleteMark () {
      if (this.markId) {
        const params = {
          id: this.markId
        };
        this.isDeleteLoading = true;
        deleteVideoRecords(params)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              })
              this.getList();
              this.isDeleteLoading =  false;
            } else {
              this.isDeleteLoading =  false;
            }
            this.delMarkDialog = false;
          })
          .catch(() => {
            this.isDeleteLoading =  false;
            this.delMarkDialog = false;
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mark_manage {
  background-color: #ffffff;
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
  .table_box {
    padding: 0 10px;
    .add_mark_btn {
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
    .mark_table {
      margin-top: 10px;
      .operation_btn {
        color: #0C70F8;
        cursor: pointer;
        padding: 0 10px;
        display: inline-block;
      }
    }
  }
  .dialog_comp {
    .mark_name {
      position: relative;
      .mark_error_tip {
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
