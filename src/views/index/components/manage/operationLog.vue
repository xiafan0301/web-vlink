<template>
  <div class="operation_log">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{name: 'vehicle'}">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>操作日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="list_table">
      <div class="list_table_serch">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="medium" ref="ruleForm" :rules="rules">
          <el-form-item  prop="user">
            <el-input v-model="formInline.user" placeholder="输入操作用户手机号码"></el-input>
          </el-form-item>
          <el-form-item  prop="value1">
            <el-date-picker
                v-model="formInline.value1"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                class="vl_date"
                :editable="false"
                :clearable="false"
                time-arrow-control
                :default-time="['00:00:00','23:59:59']"
                range-separator="至"
                :picker-options="pickerOptions"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="opsModuleVal">
            <el-select v-model="formInline.opsModuleVal" placeholder="选择操作模块" clearable>
              <el-option
                  v-for="item in opsModule"
                  :key="item.enumField"
                  :label="item.enumValue"
                  :value="item.enumField">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('ruleForm')" :loading="showloading">查询</el-button>
            <el-button  @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="list_table_tab">
        <el-table
            :data="tableData"
            v-loading="showloading"
            style="width: 100%">
          <el-table-column
              label="序号"
              type="index"
              width="50">
          </el-table-column>
          <el-table-column
              prop="userMobile"
              label="操作用户">
          </el-table-column>
          <el-table-column
              prop="requestClientIp"
              label="用户IP">
          </el-table-column>
          <el-table-column
              label="操作模块">
            <template slot-scope="scope">
              <span>{{formdatax(scope.row.opModule)}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="opType"
              label="操作类型">
            <template slot-scope="scope">
              <span>{{dicFormater(dataType,scope.row.opType)}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="opContent"
              label="操作内容">
          </el-table-column>
          <el-table-column
              prop="requestTime"
              label="操作日期">
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
            class="cum_pagination"
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.pageNum"
            :page-size="pagination.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { dataList } from  '@/utils/data.js';
import {operationPostlog } from '@/views/index/api/api.base.js';
import {validatePhone} from '@/utils/validator.js';
export default {
  name: "operationLog",
  data() {
    return {
      opsModule: [],
      formInline: {
        user: null,
        value1: [],
        opsModuleVal: null,
      },
      dataType: dataList.opsType,
      tableData: [],
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      showloading: false,
      rules: {
        user: [
          {validator: validatePhone, trigger: 'blur'},
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    }
  },
  created () {
    this.opsModule = this.dicFormater(dataList.opsModule)[0].dictList;
    this.getlist()
  },
  methods: {
    formdatax (val) {
      let arr =this.opsModule.filter((val1)=> val1.enumField == val);
      return arr[0] ? arr[0].enumValue : '';
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getlist()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleCurrentChange (val) {
      this.pagination.pageNum = val
      this.getlist()
    },
    getlist () {
      this.showloading = true
      let params = {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        'where.startTime': this.formInline.value1[0],
        'where.endTime': this.formInline.value1[1]
      }
      if (this.formInline.user) {
        params['where.userMobile'] = this.formInline.user
      }
      if (this.formInline.opsModuleVal) {
        params['where.opModule'] = this.formInline.opsModuleVal
      }
      operationPostlog (params)
        .then(res => {
          if (res) {
            this.pagination.total = res.data.total
            this.tableData = res.data.list
          }
          this.showloading = false
        })
    },
  }
}
</script>

<style scoped lang="scss">
  .operation_log{
    height: 100%;
    padding: 20px;
    overflow: auto;
    .breadcrumb_heaer{
      padding-left: 0;
      padding-top: 0;
    }
    .list_table{
      min-height: calc(100% - 34px);
      background:rgba(255,255,255,1);
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
      padding: 15px;
    }
  }

</style>