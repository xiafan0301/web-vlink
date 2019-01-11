<template>
  <div class="vl_dl_hi">
    <div class="dl_hi_main">
      <el-form :inline="true" :model="formInline" class="dl_hi_sf" size="small">
        <el-form-item>
          <el-date-picker
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
          <el-select v-model="formInline.user" placeholder="操作部门">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.region" placeholder="操作用户">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchSubmit">查询</el-button>
          <el-button @click="searchSubmit">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column type="index" width="120" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="time" label="下载时间" min-width="180">
        </el-table-column>
        <el-table-column prop="dept" label="操作部门" min-width="180" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="user" label="操作用户" min-width="180">
        </el-table-column>
        <el-table-column prop="name" label="设备名称" min-width="180" :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column prop="startTime" label="视频开始时间" min-width="180">
        </el-table-column>
        <el-table-column prop="endTime" label="视频结束时间" min-width="180">
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
export default {
  data () {
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
      formInline: {
        time: '',
        user: '',
        region: ''
      },

      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 1000
      }
    }
  },
  mounted () {
    let testData = [];
    for (let i = 0; i < 10; i++) {
      testData.push({
        time: '2019-01-11 11:11:11',
        user: '管理员——' + i,
        dept: '管理部',
        name: '上街镇甫发大街广发银行东门-0' + i,
        startTime: '00:00:00',
        endTime: '00:00:51'
      });
    }
    this.tableData = testData;
  },
  methods: {
    searchSubmit () {
    },
    handleSizeChange (val) {
        console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
    }
  }
}
</script>
<style lang="scss" scoped>
  .vl_dl_hi {
    padding: 20px;
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
