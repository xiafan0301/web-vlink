<template>
  <div class="car_gear">
    <div class="search_box">
      <el-form :inline="true" :model="searchForm" class="search_form" ref="searchForm">
        <el-form-item prop="vehicleType">
          <el-select  style="width: 240px;" v-model="searchForm.vehicleType" placeholder="车辆类型">
            <el-option value='全部车辆类型'></el-option>
            <el-option
              v-for="(item, index) in vehicleTypeList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="brandNo">
          <el-select style="width: 240px;" v-model="searchForm.brandNo" placeholder="单位">
            <el-option value='全部运营公司'></el-option>
            <el-option
              v-for="(item, index) in operateCompanyList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="vehicleNumber">
          <el-input style="width: 240px;" type="text" placeholder="请输入车牌号码查找" v-model="searchForm.vehicleNumber" />
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn" @click="selectDataList">查询</el-button>
          <el-button class="reset_btn" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="divide"></div>
    </div>
    <div class="header">
      <el-button class="add-btn" icon="el-icon-plus" @click="skipAddPage">新增车辆</el-button>
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
          label="车辆编号"
          prop="transportNo"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <span>{{scope.row.transportNo && scope.row.transportNo ? scope.row.transportNo : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="车辆号码"
          prop="vehicleNumber"
          >
          <template slot-scope="scope">
            <span>{{scope.row.vehicleNumber && scope.row.vehicleNumber ? scope.row.vehicleNumber : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="车辆类型"
          prop="vehicleTypeName"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <span>{{scope.row.vehicleType && scope.row.vehicleType ? scope.row.vehicleTypeName : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="号牌种类"
          prop="numberTypeName"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <span>{{scope.row.numberType && scope.row.numberType ? scope.row.numberTypeName : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="核载人数"
          prop="capacityPeople"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <span>{{scope.row.capacityPeople && scope.row.capacityPeople ? scope.row.capacityPeople : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="运营公司"
          prop="brandName"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <span>{{scope.row.brandNo && scope.row.brandNo ? scope.row.brandName : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="出车状态"
          prop="onlineState"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <span>{{scope.row.onlineState === 1 ? '出车': '在库'}}</span>
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
      title="是否删除该车辆及其档案信息？"
      :visible.sync="deleteDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;font-size: 12px;">删除后，本系统不能实时监管该车辆</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="sureDelete">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getVehicleList, delVehicle } from '@/views/index/api/api.archives.js';
import { dataList } from '@/utils/data.js';
import { getDepartmentList } from '@/views/index/api/api.manage.js';
import { getDiciData } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      deleteDialog: false, // 删除弹出框
      isDeleteLoading: false, // 删除加载中
      searchForm: {
        vehicleType: '全部车辆类型', // 车辆类型
        brandNo: '全部运营公司', // 运营公司
        vehicleNumber: null // 车牌号码
      },
      dataList: [],
      vehicleTypeList: [], // 车辆类型
      numberTypeList: [], // 号牌种类
      userInfo: {}, // 用户信息
      departmentList: [], // 部门列表
      deleteId: null, // 要删除的车辆id
      operateCompanyList: [], // 运营公司列表
    }
  },
  watch: {
    currentOrganObj () {
     if (this.$store.state.currentOrganObj) {
        this.getList();
      }
    }
  },
  computed: {
    currentOrganObj () {
      return this.$store.state.currentOrganObj;
    }
  },
  mounted () {
    this.userInfo = this.$store.state.loginUser;

    this.getOperateCompanyList();
    this.getVehicleTypeList();
    this.getNumberTypeList();
    setTimeout(() => {
      this.getList();
    }, 500)
  },
  methods: {
    // 获取运营公司列表
    getOperateCompanyList () {
      const operate = dataList.operateCompany;
      getDiciData(operate)
        .then(res => {
          if (res) {
            this.operateCompanyList = res.data;
          }
        })
    },
    // 获取号牌种类列表
    getNumberTypeList () {
      const type = dataList.numberType;
      getDiciData(type)
        .then(res => {
          if (res) {
            this.numberTypeList = res.data;
          }
        })
    },
    // 获取车辆类型列表
    getVehicleTypeList () {
      const type = dataList.vehicleType;
      getDiciData(type)
        .then(res => {
          if (res) {
            this.vehicleTypeList = res.data;
          }
        })
    },
    // 获取车辆列表
    getList () {
      let vehicleType, organId, brandNo;
      if (this.searchForm.vehicleType === '全部车辆类型') {
        vehicleType = null;
      } else {
        vehicleType = this.searchForm.vehicleType;
      }
      if (this.searchForm.brandNo === '全部运营公司') {
        brandNo = null;
      } else {
        brandNo = this.searchForm.brandNo;
      }
    //  let organId = null;
      if (this.$store.state.currentOrganObj) {
        organId = this.$store.state.currentOrganObj.uid;
      } else {
        organId = this.userInfo.organList[0].uid;
      }
      const params = {
        'where.vehicleNumber': this.searchForm.vehicleNumber,
        'where.vehicleType': vehicleType,
        'where.organId': organId,
        'where.brandNo': brandNo,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        orderBy: 'create_time',
        order: 'desc'
      };
      getVehicleList(params)
        .then(res => {
          if (res) {
            this.pagination.total = res.data.total;
            this.dataList = res.data.list;

            this.dataList.map(item => {
              item.vehicleTypeName = '';
              item.numberTypeName = '';
              item.brandName = '';

              this.vehicleTypeList.map(val => {
                if (item.vehicleType == val.enumField) {
                  item.vehicleTypeName = val.enumValue;
                }
              });
              this.numberTypeList.map(val => {
                if (item.numberType == val.enumField) {
                  item.numberTypeName = val.enumValue;
                }
              });
              this.operateCompanyList.map(val => {
                if (item.brandNo == val.enumField) {
                  item.brandName = val.enumValue;
                }
              });
            });
          }
        })
    },
    // 根据搜索条件进行搜索
    selectDataList () {
      this.getList();
    },
    // 重置搜索条件
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getList();
    },
    // 分页change
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getList();
    },
    // 跳至查看详情页面
    skipSelectDetail (obj) {
      let organObj = {};
      if (this.$store.state.currentOrganObj) {
        organObj = this.$store.state.currentOrganObj;
      } else {
        organObj = this.userInfo.organList[0];
      }
      this.$router.push({name: 'car_detail', query: { id: obj.uid, organObj: JSON.stringify(organObj) }});
    },
    // 跳至新增车辆页面
    skipAddPage () {
      let organObj = {};
      if (this.$store.state.currentOrganObj) {
        organObj = this.$store.state.currentOrganObj;
      } else {
        organObj = this.userInfo.organList[0];
      }
      console.log('currentOrganObj', this.$store.state.currentOrganObj)
      this.$router.push({name: 'car_add', query: { organObj: JSON.stringify(organObj)}});
    },
    // 跳至编辑页面
    skipEditPage (obj) {
      let organObj = {};
      if (this.$store.state.currentOrganObj) {
        organObj = this.$store.state.currentOrganObj;
      } else {
        organObj = this.userInfo.organList[0];
      }
      this.$router.push({name: 'car_edit', query: { id: obj.uid, organObj: JSON.stringify(organObj) }});
    },
    // 显示删除弹出框
    showDeleteDialog (obj) {
      this.deleteId = obj.uid;
      this.deleteDialog = true;
    },
    // 确认删除
    sureDelete () {
      if (this.deleteId) {
        this.isDeleteLoading = true;
        delVehicle(this.deleteId)
          .then(res => {
            if (res) {
              this.isDeleteLoading = false;
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              });
              this.getList();
              this.isDeleteLoading = false;
              this.deleteDialog = false;
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
.car_gear {
  padding: 10px;
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

