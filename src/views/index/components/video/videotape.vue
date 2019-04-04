<template>
  <div class="vl_dl_vt">
    <div class="dl_vt_t">
      <el-date-picker
        v-model="time"
        type="daterange"
        align="left"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions2">
      </el-date-picker>
    </div>
    <div class="dl_vt_c">
      <ul>
        <li v-for="item in 6" :key="item">
          a {{item}}
        </li>
      </ul>
    </div>
    <div class="dl_vt_b">
      <el-pagination
        style="text-align: center;"
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
      time: [new Date(new Date() - 3600 * 1000 * 24 * 7), new Date()],
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted () {
    this.searchSubmit();
  },
  methods: {
    searchSubmit () {
      // this.getData();
    },
    getData () {
      apiVideoDownloadList({
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        // orderBy: '',
        // order: '',
        'where.startTime': formatDate(this.formInline.time[0], 'yyyy-MM-dd 00:00:00'),
        'where.endTime': formatDate(this.formInline.time[1], 'yyyy-MM-dd 23:59:59'),
        'where.oprUserId': '1',
        'where.oprDeptId': '1'
      }).then(res => {
        if (res && res.data) {
          this.pagination.total = res.data.total;
          this.tableData = res.data.list;
        }
      }).catch(error => {
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
  .vl_dl_vt {
    position: relative;
    width: 100%; height: 100%;
    padding: 80px 0 80px 0;
  }
  .dl_vt_t {
    position: absolute; top: 20px; left: 0;
    width: 100%;
    padding-left: 20px;
  }
  .dl_vt_c {
    width: 100%; height: 100%;
    > ul {
      width: 100%; height: 100%;
      overflow: hidden;
      padding: 0 20px;
      > li {
        float: left;
        width: 33.33%; height: 50%;
      }
    }
  }
  .dl_vt_b {
    position: absolute; bottom: 0; left: 0;
    width: 100%; height: 80px;
    padding-left: 20px;
    text-align: center;
  }
</style>
