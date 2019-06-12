<template>
  <div class="room_stall">
    <div class="search_box">
      <el-form :inline="true" :model="searchForm" class="search_form" ref="searchForm">
        <el-form-item prop="organId">
          <el-select  style="width: 240px;" v-model="searchForm.organId" placeholder="所属单位">
            <el-option
              v-for="(item, index) in departmentList"
              :key="index"
              :label="item.organName"
              :value="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="isEnable">
          <el-select style="width: 240px;" v-model="searchForm.isEnable" placeholder="使用状况">
            <el-option label="启用" :value='1'></el-option>
            <el-option label="停用" :value='2'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn" @click="selectDataList">查询</el-button>
          <el-button class="reset_btn" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="divide"></div>
    </div>
    <div class="header">
      <el-button class="add-btn" icon="el-icon-plus" @click="skipAddPage">新增点室</el-button>
      <el-button class="import-btn">导入</el-button>
      <el-button class="export-btn">导出</el-button>
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
          label="点室编号"
          prop="roomNumber"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="名称"
          prop="roomName"
          >
        </el-table-column>
        <el-table-column
          label="地址"
          prop="address"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="所属单位"
          prop="organName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="责任人"
          prop="dutyUserName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="电话"
          prop="userMobile"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="使用状况"
          prop="isEnable"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <span>{{scope.row.isEnable === 1 ? '启用' : '停用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template slot-scope="scope">
            <span class="operation_btn" @click="skipSelectDetail(scope.row)">查看档案</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="skipEditPage(scope.row)">编辑档案</span>
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
      title="是否确定删除相关信息？"
      :visible.sync="deleteDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;font-size: 12px;">删除后信息不可恢复</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="sureDelete">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getRoomData, delRoom } from '@/views/index/api/api.archives.js';
import { getDepartmentList } from '@/views/index/api/api.manage.js';
export default {
  data () {
    // const oragnId = this.userInfo.organList[0].uid;
    return {
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      deleteDialog: false, // 删除弹出框
      isDeleteLoading: false, // 删除加载中
      searchForm: {
        organId: null,
        isEnable: null,
      },
      dataList: [], // 列表数据
      userInfo: {}, // 用户信息
      departmentList: [], // 部门列表
      deleteId: null, // 要删除的点室id
    }
  },
  watch: {
    currentOrganId () {
      this.getList();
    }
  },
  computed: {
    currentOrganId () {
      return this.$store.state.currentOrganId;
    }
  },
  mounted () {
    this.userInfo = this.$store.state.loginUser;

    this.getDepartList();
    this.getList();
  },
  methods: {
    // 获取当前部门及子级部门
    getDepartList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        'where.organPid': this.userInfo.organList[0].uid,
        pageSize: 0
      };
      getDepartmentList(params)
        .then(res => {
          if (res) {
            this.departmentList.push(this.userInfo.organList[0]);
            res.data.list.map(item => {
              this.departmentList.push(item);
            });
          }
        })
    },
    // 获取列表数据
    getList () {
      const params = {
        'where.organId': this.$store.state.currentOrganId,
        'where.isEnable': this.searchForm.isEnable,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        orderBy: 'create_time',
        order: 'desc'
      };
      getRoomData(params)
        .then(res => {
          if (res) {
            this.pagination.total = res.data.total;
            this.dataList = res.data.list;
          }
        })
    },
    // 搜索
    selectDataList () {
      this.getList();
    },
    // 重置搜索条件
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getList();
    },
    // 跳至详情页
    skipSelectDetail (obj) {
      this.$router.push({name: 'room_detail', query: { id: obj.uid }});
    },
    // 跳至新增点室页面
    skipAddPage () {
      this.$router.push({name: 'room_add'});
    },
    // 跳至编辑页面
    skipEditPage (obj) {
      this.$router.push({name: 'room_edit', query: { id: obj.uid }});
    },
    // 显示删除弹出框
    showDeleteDialog (obj) {
      this.deleteDialog = true;
      this.deleteId = obj.uid;
    },
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getList();
    },
    // 确认删除
    sureDelete () {
      if (this.deleteId) {
        this.isDeleteLoading = true;
        delRoom(this.deleteId)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              });
              this.isDeleteLoading = false;
              this.deleteDialog = false;
              this.getList();
            } else {
              this.isDeleteLoading = false;
            }
          })
          .catch(() => {this.isDeleteLoading = false;})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.room_stall {
  padding: 10px;
  // height: calc(100% - 70px);
  .search_box {
    width: 100%;
    padding: 10px;
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
  .header {
    padding: 10px;
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

