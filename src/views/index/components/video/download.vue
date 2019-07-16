<template>
  <div class="vl_dl_hi">
    <div class="dl_hi_main">
      <el-form :inline="true" :model="formInline" ref="formInline" class="dl_hi_sf" size="small">
        <el-form-item>
          <span style="color: #666;">视频时间：&nbsp;</span>
          <el-date-picker
            class="vl_date"
            v-model="formInline.time"
            type="daterange"
            align="left"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- deptList -->
          <el-select v-model="formInline.region" placeholder="操作部门">
            <el-option v-for="(item, index) in deptList" :label="item.organName" :key="'dept-list-' + index" :value="item.uid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.user" placeholder="操作用户">
            <el-option v-for="(item, index) in userList" :label="item.userName" :key="'user-list-' + index" :value="item.uid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="searchLoading" type="primary" @click="searchSubmit">查询</el-button>
          <el-button @click="searchReset('formInline')">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column type="index" width="120" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="createTime" :formatter="tableFnDateTime" label="下载时间" min-width="180">
        </el-table-column>
        <el-table-column prop="depName" label="操作部门" min-width="180" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="userName" label="操作用户" min-width="180">
        </el-table-column>
        <el-table-column prop="devName" label="设备名称" min-width="180" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="startTime" :formatter="tableFnDateTime" label="视频开始时间" min-width="180">
        </el-table-column>
        <el-table-column prop="endTime" :formatter="tableFnDateTime" label="视频结束时间" min-width="180">
        </el-table-column>
      </el-table>
      <el-pagination
        class="dl_hi_pa"
        background
        layout="prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { apiVideoDownloadList } from "@/views/index/api/api.video.js";
import { getUserList, getDepartmentList } from "@/views/index/api/api.manage.js";
import { formatDate } from "@/utils/util.js";
export default {
  data () {78 
    return {
      pickerOptions2: {
        shortcuts: [{
          text: '最近一天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      searchLoading: false,
      formInline: {
        time: [new Date(new Date() - 3600 * 1000 * 24 * 7), new Date()],
        user: '',
        region: ''
      },

      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      userList: [],
      deptList: []
    }
  },
  mounted () {
    this.getAllUserList();
    this.getAllDeptList();
    this.searchSubmit();
  },
  methods: {
    getAllDeptList () {
      getDepartmentList({
        'where.proKey': this.$store.state.loginUser.proKey
      }).then(res => {
        if (res && res.data) {
          this.deptList = res.data.list;
        }
      }).catch(error => {
        console.log("getDepartmentList error：", error);
      });
    },
    getAllUserList () {
      getUserList({
        'where.proKey': this.$store.state.loginUser.proKey
      }).then(res => {
        if (res && res.data) {
          this.userList = res.data.list;
        }
      }).catch(error => {
        console.log("getUserList error：", error);
      });
    },
    searchReset (formName) {
      this.$refs[formName].resetFields();
      this.formInline = {
        time: [new Date(new Date() - 3600 * 1000 * 24 * 7), new Date()],
        user: '',
        region: ''
      }
    },
    searchSubmit () {
      this.getData();
    },
    getData () {
      this.searchLoading = true;
      apiVideoDownloadList({
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        // orderBy: '',
        // order: '',
        'where.startTime': formatDate(this.formInline.time[0], 'yyyy-MM-dd 00:00:00'),
        'where.endTime': formatDate(this.formInline.time[1], 'yyyy-MM-dd 23:59:59'),
        'where.oprUserId': this.formInline.user,
        'where.oprDeptId': this.formInline.region
      }).then(res => {
        if (res && res.data) {
          this.pagination.total = res.data.total;
          this.tableData = res.data.list;
        }
        this.searchLoading = false;
      }).catch(error => {
        this.searchLoading = false;
        console.log("apiVideoDownloadList error：", error);
      });
    },
    tableFnDateTime (row, column, cellValue) {
      // console.log(cellValue);
      return formatDate(cellValue);
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.pagination.currentPage = val;
      this.searchSubmit();
    }
  }
}
</script>
<style lang="scss" scoped>
  .vl_dl_hi {
    padding: 10px;
    width: 100%; height: 100%;
    > .dl_hi_main {
      width: 100%; height: 100%;
      box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
      background-color: #fff;
      .dl_hi_sf {
        padding: 20px 0 0 20px;
      }
      > h2 {
        font-weight: bold;
        font-size: 16px;
        color: #333;
        padding: 30px 0 30px 30px;
      }
      .dl_hi_pa {
        text-align: center;
      }
    }
  }
</style>
