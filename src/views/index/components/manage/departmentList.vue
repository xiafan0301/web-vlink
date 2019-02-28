<template>
  <div class="department-manage">
    <div class="header">
      <el-button class="add-btn" icon="el-icon-plus" @click="showNewDepartment">新增部门</el-button>
      <el-input  placeholder="请输入部门名称" style="width: 240px;">
        <i
        class="search_icon vl_icon vl_icon_manage_1"
        slot="suffix"
        @click="handleIconClick">
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
          prop="departmentName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="上级部门"
          prop="parentDepartment"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="部门负责人"
          prop="departmentCharge"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="负责人联系方式"
          prop="userMobile"
          >
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <span class="operation_btn" @click="skipSelectDetail(scope)">查看</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showeditDialog(scope)">编辑</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showdeleteDialog(scope)">删除</span>
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
        <el-form :model="addDepartment">
          <el-form-item label="">
            <el-input v-model="addDepartment.departmentName" placeholder="请输入部门名称"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select style="width: 100%" v-model="addDepartment.parentDepartment" placeholder="请选择上级部门">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select style="width: 100%" filterable v-model="addDepartment.departmentCharge" placeholder="请搜索部门负责人姓名">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newDepartmentDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="newDepartmentDialog = false">确认</el-button>
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
        <el-form :model="editDepartment">
          <el-form-item label="">
            <el-input v-model="editDepartment.departmentName" placeholder="请输入部门名称"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-select style="width: 100%" v-model="editDepartment.parentDepartment" placeholder="请选择上级部门">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select style="width: 100%" filterable v-model="editDepartment.departmentCharge" placeholder="请搜索部门负责人姓名">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDepartmentDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="editDepartmentDialog = false">确认</el-button>
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
        <el-button class="operation_btn function_btn" @click="delDepartmentDialog = false">确认</el-button>
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
        <el-button class="operation_btn function_btn" @click="delChildDepartmentDialog = false">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      departmentData: [
        {
          departmentName: '县政法委',
          parentDepartment: '溆浦县政法委',
          departmentCharge: '金子康',
          userMobile: '13970041234'
        },
        {
          departmentName: '县政法委',
          parentDepartment: '溆浦县政法委',
          departmentCharge: '金子康',
          userMobile: '13970041234'
        },
        {
          departmentName: '县政法委',
          parentDepartment: '溆浦县政法委',
          departmentCharge: '金子康',
          userMobile: '13970041234'
        },
        {
          departmentName: '县政法委',
          parentDepartment: '溆浦县政法委',
          departmentCharge: '金子康',
          userMobile: '13970041234'
        },
        {
          departmentName: '县政法委',
          parentDepartment: '溆浦县政法委',
          departmentCharge: '金子康',
          userMobile: '13970041234'
        },
        {
          departmentName: '县政法委',
          parentDepartment: '溆浦县政法委',
          departmentCharge: '金子康',
          userMobile: '13970041234'
        },
        {
          departmentName: '县政法委',
          parentDepartment: '溆浦县政法委',
          departmentCharge: '金子康',
          userMobile: '13970041234'
        }
      ],
      currentPage4: 1,
      newDepartmentDialog: false, // 新建部门弹出框
      delDepartmentDialog: false, // 删除部门弹出框
      delChildDepartmentDialog: false, // 删除下级部门弹出框
      editDepartmentDialog: false, // 编辑部门弹出框
      addDepartment: {
        departmentName: null,
        parentDepartment: null,
        departmentCharge: null
      },
      editDepartment: {
        departmentName: null,
        parentDepartment: null,
        departmentCharge: null
      }
    }
  },
  methods: {
    handleIconClick () {},
    handleSizeChange () {
    },
    handleCurrentChange () {},
    // 跳至部门详情页
    skipSelectDetail (obj) {
      console.log(obj);
      this.$router.push({name: 'department_detail'});
    },
    // 显示新增部门弹出框
    showNewDepartment () {
      this.newDepartmentDialog = true;
    },
    // 显示编辑部门弹出框
    showeditDialog (obj) {
      console.log(obj)
      this.editDepartmentDialog = true;
    },
    // 显示删除部门的弹出框
    showdeleteDialog (obj) {
      console.log(obj)
      // this.delDepartmentDialog = true;
      this.delChildDepartmentDialog = true;
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
      // /deep/ .el-table__row:hover {
      //   cursor: pointer;
      // }
    }
  }
}
</style>

