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
          <div>
            <div class="vt_ct">
              <h3 title="录像时间 2018-12-25 10:25 - 2018-12-25 10:25">录像时间 2018-12-25 10:25 - 2018-12-25 10:25</h3>
              <div>
                <span class="vl_icon vl_icon_v31" title="删除"></span>
                <span class="vl_icon vl_icon_v32" title="下载"></span>
              </div>
            </div>
            <div class="vt_cv"></div>
            <div class="vt_cb"></div>
          </div>
        </li>
      </ul>
    </div>
    <div class="dl_vt_b">
      <el-pagination
        style="text-align: center;"
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { apiVideoRecordList } from "@/views/index/api/api.video.js";
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
      videoRecordList: [],
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
      this.getVideoRecordList();
    },
    /* 播放记录 */
    getVideoRecordList () {
      // 播放类型 1:视频巡逻 2:视频回放 3:录像记录
      apiVideoRecordList({
        playType: 3
      }).then(res => {
        if (res && res.data) {
          this.videoRecordList = res.data;
        }
      }).catch(error => {
        console.log("apiVideoRecordList error：", error);
      });
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
      padding: 0 10px;
      > li {
        float: left;
        width: 33.33%; height: 50%;
        padding: 10px;
        > div {
          position: relative;
          width: 100%; height: 100%;
          background-color: #000;
          > .vt_ct {
            position: absolute; top: 0; left: 0;
            width: 100%;
            overflow: hidden;
            background-color: #333;
            background-color: rgba(51, 51, 51, 0.7);
            > h3 {
              padding-left: 20px; padding-right: 70px;
              height: 34px; line-height: 34px;
              color: #fff;
            }
            > div {
              position: absolute; top: 5px; right: 0;
              > span { margin-right: 10px; cursor: pointer; }
            }
          }
          > .vt_cv { width: 100%; height: 100%; }
          > .vt_cb {
          }
        }
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
