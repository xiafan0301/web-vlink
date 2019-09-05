<template>
  <div class="restrict_detail">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" :breadcrumbData="[
      {name: '车辆侦查', routerName: 'vehicle'}, 
      {name: '车辆限行', routerName: 'vehicle_restrict_driving'},
      {name: '限行详情'}]"></div>
    </div>
    <div class="content_box">
      <div class="left">
        <vue-scroll>
          <ul class="result_ul">
            <li>
              <span>任务名称：</span>
              <p>{{taskDetail.taskName}}</p>
            </li>
            <li>
              <span>任务状态：</span>
              <p>{{taskDetail.taskStatus && taskDetail.taskStatus === 1 ? '进行中' : taskDetail.taskStatus === 4 ? '待开始' :  taskDetail.taskStatus === 2 ? '已结束' : '-'}}</p>
            </li>
            <li class="time_li">
              <span>分析时间：</span>
              <p>
                <span>{{taskDetail.startTime}}</span>
                <span>{{taskDetail.endTime}}</span>
              </p>
            </li>
            <li>
              <span>限行车牌尾号：</span>
              <span>{{taskDetail.tailNumbers ? taskDetail.tailNumbers : '无'}}</span>
            </li>
            <li class="different_li">
              <span>限行车辆类型：</span>
              <p>{{taskDetail.vehicleTypes ? taskDetail.vehicleTypes : '无'}}</p>
            </li>
            <li class="different_li">
              <span>所选区域设备：</span>
              <p>{{taskDetail.devNames}}</p>
            </li>
          </ul>
        </vue-scroll>
      </div>
      <div class="right">
        <template v-if="dataList.length > 0">
          <div class="result_container">
            <vue-scroll>
              <div class="table_box">
                <el-table :data="dataList" @sort-change="sortPlateNoOrTimes">
                  <el-table-column label="序号" type="index" width="100"></el-table-column>
                  <el-table-column label="车牌号" prop="plateNo" show-overflow-tooltip sortable="custom" :sort-by="sortBy" :sort-orders="sortOrders"></el-table-column>
                  <el-table-column label="车辆颜色" prop="plateColor" show-overflow-tooltip></el-table-column>
                  <el-table-column label="车辆类型" prop="vehicleType" show-overflow-tooltip></el-table-column>
                  <el-table-column label="抓拍次数" prop="shotTimes" show-overflow-tooltip sortable="custom" :sort-by="sortBy" :sort-orders="sortOrders"></el-table-column>
                  <el-table-column label="操作" fixed="right" width="200px">
                    <template slot-scope="scope">
                      <span
                        class="operation_btn"
                        @click="skipDetailPage(scope.row)"
                      >查看</span>
                    </template>
                  </el-table-column>
                </el-table>
                <template v-if="pagination.total > 0">
                  <el-pagination
                    class="cum_pagination"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pagination.pageNum"
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size="pagination.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="pagination.total"
                  ></el-pagination>
                </template>
              </div>
            </vue-scroll>
          </div>
        </template>
        <template v-else>
          <div is="noResult" :isInitPage="isInitPage"></div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import { getLimitTaskDetail } from "@/views/index/api/api.judge.js";
import noResult from '@/components/common/noResult.vue';
export default {
  components: { vlBreadcrumb, noResult },
  data () {
    return {
      isInitPage: false, // 是否是初始化页面
      sortBy: 'shotTimes',
      sortOrders: ['descending'],
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
        order: 'desc',
        orderBy: 'shotTimes' // 默认按抓拍时间降序排序
      },
      dataList: [],
      taskDetail: {},
    }
  },
  mounted () {
    this.taskDetail = JSON.parse(this.$route.query.queryObj);
    if (this.taskDetail.uid) {
      this.getDetailList();
    }
  },
  methods: {
    // 车牌号和抓拍次数排序
    sortPlateNoOrTimes () {
      if (column.order) {
        if (column.order === 'ascending') {
          this.pagination.order = 'asc';
        }
        if (column.order === 'descending') {
          this.pagination.order = 'desc';
        }
        this.pagination.orderBy = 'device_seq';
      } else {
        this.pagination.order = 'desc';
        this.pagination.orderBy = 'create_time';
      }

      this.getDetailList();
    },
    getDetailList () {
      const params = {
        taskId: this.taskDetail.uid,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        order: this.pagination.order,
        orderBy: this.pagination.orderBy
      };
      getLimitTaskDetail (params)
        .then(res => {
          if (res) {
            this.dataList = res.data.list;
            thia.pagination.total = res.data.total;
          }
        })
    },
    // 跳至抓拍详情页面
    skipDetailPage (obj) {
      this.$router.push({name: 'vehicle_restrict_snap_detail', query: { taskId: this.taskDetail.uid, plateNo: obj.plateNo }});
    },
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getDetailList();
    }
  }
}
</script>
<style lang="scss" scoped>
.restrict_detail {
  width: 100%;
  height: 100%;
  .vc_gcck_bd {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 50px; line-height: 50px;
  }
  .content_box {
    width: 100%;
    height: 100%;
    padding-top: 50px;
    display: flex;
    .left {
      width: 272px;
      height: 100%;
      background-color: #ffffff;
      box-shadow: 2px 3px 10px 0px rgba(131,131,131,0.28);
      .result_ul {
        width: 100%;
        padding-top: 10px;
        padding-left: 20px;
        padding-right: 10px;
        >li {
          width: 100%;
          line-height: 30px;
          display: flex;
          flex-wrap: wrap;
          >span:first-child {
            color: #666666;
          }
          >span:last-child {
            color: #222222;
          }
        }
        .different_li {
          >span {
            width: 100px;
          }
          >p {
            width: calc(100% - 100px);
          }
        }
        .time_li {
          >span {
            width: 80px;
          }
          >p {
            width: calc(100% - 80px);
            >span {
              display: inline-block;
            }
          }
        }
      }
    }
    .right {
      width: calc(100% - 272px);
      height: calc(100% - 50px);
      .result_container {
        margin: 20px;
        background: #ffffff;
        box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
        .table_box {
          margin: 20px;
          .add_btn {
            margin-bottom: 10px;
          }
          .operation_btn {
            display: inline-block;
            padding: 0 10px;
            border-right: 1px solid #f2f2f2;
            &:last-child {
              border-right: none;
            }
          }
        }
      }
    }
  }
}
</style>