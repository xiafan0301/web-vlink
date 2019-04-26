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
        @change="searchSubmit"
        :picker-options="pickerOptions2">
      </el-date-picker>
    </div>
    <div class="dl_vt_c" v-loading="searchLoading" v-if="videoRecordList && videoRecordList.length > 0">
      <ul>
        <li v-for="(item, index) in videoRecordList" :key="'vrl_' + index">
          <div v-if="item">
            <div class="vt_ct">
              <h3 title="录像时间 2018-12-25 10:25 - 2018-12-25 10:25">
                录像时间&nbsp;{{item.video.playBackStartTime | fmTimestamp('yyyy-MM-dd HH:mm')}}&nbsp;-&nbsp;{{item.video.playBackEndTime | fmTimestamp('yyyy-MM-dd HH:mm')}}
              </h3>
              <div>
                <span class="vl_icon vl_icon_v31" @click="del(item)" title="删除"></span>
                <span class="vl_icon vl_icon_v32" title="下载"></span>
              </div>
            </div>
            <div is="flvplayer" :index="index" :oData="item"
              :oConfig="{close: false, pause: true}">
            </div>
            <div class="vt_cv"></div>
            <div class="vt_cb"></div>
          </div>
        </li>
      </ul>
    </div>
    <div class="dl_vt_c" v-else>
      <p style="padding: 0 0 0 20px; color: #999;">暂无录像记录</p>
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
import flvplayer from '@/components/common/flvplayer.vue';
import { apiVideoRecordPageList, apiDelVideoRecord } from "@/views/index/api/api.video.js";
import { formatDate } from "@/utils/util.js";
export default {
  components: {flvplayer},
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
      time: [new Date(new Date() - 3600 * 1000 * 24 * 7), new Date()],
      searchLoading: false,
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
      this.searchLoading = true;
      // 播放类型 1:视频巡逻 2:视频回放 3:录像记录
      console.log('this.time', this.time);
      apiVideoRecordPageList({
        'where.playType': 3,
        'where.startDate': (this.time && this.time[0]) ? formatDate(this.time[0], 'yyyy-MM-dd 00:00:00') : '',
        'where.endDate': (this.time && this.time[1]) ? formatDate(this.time[1], 'yyyy-MM-dd 23:59:59') : '',
        'pageNum': this.pagination.currentPage,
        'pageSize': this.pagination.pageSize
      }).then(res => {
        if (res && res.data) {
          this.pagination.total = res.data.total;
          let objs = [];
          for (let i = 0; i < res.data.list.length; i++) {
            let o = res.data.list[i];
            objs.push({
              type: 3,
              title: o.deviceName,
              startTime: o.playBackStartTime,
              endTime: o.playBackEndTime,
              video: Object.assign({}, o)
            });
          }
          this.videoRecordList = objs;
          this.searchLoading = false;
        }
      }).catch(error => {
        this.searchLoading = false;
        console.log("apiVideoRecordPageList error：", error);
      });
    },
    del (item) {
      this.$confirm('是否确定删除该条录像记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiDelVideoRecord(item.video.uid).then(() => {
          this.getVideoRecordList();
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
        }).catch(error => {
          this.$message.error('删除失败！');
          console.log("apiDelVideoRecord error：", error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
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
          > .vt_ct {
            position: absolute; top: 0; left: 0; z-index: 20;
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
              > span { 
                margin-right: 10px; cursor: pointer;
                &.vl_icon_v32 {
                  cursor: not-allowed;
                }
              }
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
