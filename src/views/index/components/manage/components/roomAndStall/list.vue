<template>
  <div class="room_stall">
    <div class="search_box">
      <el-form :inline="true" :model="searchForm" class="search_form" ref="searchForm">
        <el-form-item prop="vehicleType">
          <el-select  style="width: 240px;" v-model="searchForm.vehicleType" placeholder="所属单位">
            <!-- <el-option value='全部车辆类型'></el-option> -->
            <!-- <el-option
              v-for="(item, index) in eventTypeList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item prop="companyName">
          <el-select style="width: 240px;" v-model="searchForm.companyName" placeholder="使用状况">
            <!-- <el-option value='全部单位'></el-option> -->
            <!-- <el-option
              v-for="(item, index) in eventStatusList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option> -->
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
          prop="number"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="名称"
          prop="vechileNo"
          >
        </el-table-column>
        <el-table-column
          label="地址"
          prop="type"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="所属单位"
          prop="vechileType"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="责任人"
          prop="personNum"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="电话"
          prop="company"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="使用状况"
          prop="status"
          show-overflow-tooltip
          >
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
export default {
  data () {
    return {
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      deleteDialog: false, // 删除弹出框
      isDeleteLoading: false, // 删除加载中
      searchForm: {
        vehicleType: null,
        companyName: null,
      },
      dataList: [
        {
          number: '1',
          vechileNo: 'XXXX路口治安亭',
          type: '湖南省怀化市溆浦县城中路1号',
          vechileType: '县公安局',
          personNum: '张三',
          company: '13912345678',
          status: '停用'
        },
        {
          number: '2',
          vechileNo: 'XXXX路口治安亭',
          type: '湖南省怀化市溆浦县城中路1号',
          vechileType: '县公安局',
          personNum: '张三',
          company: '13912345678',
          status: '停用'
        },
        {
          number: '3',
          vechileNo: 'XXXX路口治安亭',
          type: '湖南省怀化市溆浦县城中路1号',
          vechileType: '县公安局',
          personNum: '张三',
          company: '13912345678',
          status: '停用'
        },
        {
          number: '4',
          vechileNo: 'XXXX路口治安亭',
          type: '湖南省怀化市溆浦县城中路1号',
          vechileType: '县公安局',
          personNum: '张三',
          company: '13912345678',
          status: '停用'
        },
      ]
    }
  },
  methods: {
    selectDataList () {},
    resetForm (form) {},
    // 跳至详情页
    skipSelectDetail () {
      this.$router.push({name: 'room_detail'});
    },
    // 跳至新增点室页面
    skipAddPage () {
      this.$router.push({name: 'room_add'});
    },
    // 跳至编辑页面
    skipEditPage () {
      this.$router.push({name: 'room_edit'});
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

