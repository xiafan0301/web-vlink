<template>
  <div class="restrict_snap_detail">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" :breadcrumbData="
        [{name: '车辆侦查', routerName: 'vehicle'}, 
        {name: '车辆限行', routerName: 'vehicle_restrict_driving'},
        {name: '限行详情', routerName: 'vehicle_restrict_detail', query: { queryObj: $route.query.queryObj }},
        {name: '抓拍详情'}]">
      </div>
    </div>
    <div class="content_snap_box">
      <template v-if="dataList.length > 0">
        <div class="vehicle_info">
          <span>车牌号{{$route.query.plateNo}}</span>
          <span>限行区域内共有<span class="number">{{pagination.total}}</span>条抓拍信息</span>
        </div>
        <div class="result_sort">
          <div class="sort">
            <div class="sort_item" :class="{ 'active_sort': sortType === 1 }" @click="clickTime">
              时间排序
              <i
                :class="{'el-icon-arrow-down': timeSortType, 'el-icon-arrow-up': !timeSortType }"
                v-show="sortType === 1"
              ></i>
            </div>
            <div class="sort_item" :class="{ 'active_sort': sortType === 2 }" @click="clickCamera">
              监控排序
              <i
                :class="{'el-icon-arrow-down': cameraSortType, 'el-icon-arrow-up': !cameraSortType }"
                v-show="sortType === 2"
              ></i>
            </div>
          </div>
        </div>
        <div class="result_list">
          <vue-scroll>
            <ul class="result_list_ul">
              <li v-for="(item, index) in dataList" :key="index" @click="onOpenDetail(item, index)">
                <div class="img_box">
                  <img :src="item.StorageUrl1" alt="">
                </div>
                <div class="snap_detail">
                  <p class="time">{{item.shotTime}}</p>
                  <p class="device_name">{{item.deviceName}}</p>
                  <p class="address">{{item.address}}</p>
                </div>
              </li>
            </ul>
            <el-pagination
              class="cum_pagination"
              style="text-align:center;"
              @current-change="handleCurrentChange"
              :current-page.sync="pagination.pageNum"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="pagination.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="pagination.total"
            ></el-pagination>
          </vue-scroll>
        </div>
      </template>
      <template v-else>
        <div is="noResult" :isInitPage="isInitPage"></div>
      </template>
    </div>
    <div is="vlDialog" :detailData="detailData"></div>
  </div>
</template>
<script>
import vlDialog from '../common/vl-dialog.vue';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import { getLimitShotRecord } from "@/views/index/api/api.judge.js";
import noResult from '@/components/common/noResult.vue';
export default {
  components: { vlBreadcrumb, noResult, vlDialog },
  data () {
    return {
      isInitPage: false, // 是否是初始化页面
      sortType: 1, // 1---时间排序 2--监控排序
      timeSortType: true, // true为时间降序， false为时间升序
      cameraSortType: true, // true为监控降序， false为监控升序
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
        order: 'desc',
        orderBy: 'shotTime' // 默认抓拍时间降序
      },
      dataList: [],
      queryObj: {},
      detailData: {}
    }
  },
  mounted () {
    this.queryObj = JSON.parse(this.$route.query.queryObj);
    if (this.queryObj.uid && this.$route.query.plateNo) {
      this.getList();
    }
  },
  methods: {
    getList () {
      const params = {
        'where.taskId': this.queryObj.uid,
        'where.plateNo': this.$route.query.plateNo,
        pageNum: this.pagination.pageNum,
        // pageSize: this.pagination.pageSize,
        order: this.pagination.order,
        orderBy: this.pagination.orderBy
      };
      getLimitShotRecord(params)
        .then(res => {
          if (res) {
            this.dataList = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
    },
    /*sort排序方法*/
    clickTime() {
      if (this.sortType === 1) {
        this.timeSortType = !this.timeSortType;
        if (this.timeSortType) {
          this.pagination.order = 'desc';
        } else {
          this.pagination.order = 'asc';
        }
      } else if (this.sortType === 2) {
        this.sortType = 1;
      }
      // this.pagination.order = type;
      this.pagination.orderBy = 'shotTime';

      this.$nextTick(() => {
        this.getList();
      })
    },
    // 点击监控排序
    clickCamera() {
      if (this.sortType === 2) {
        this.cameraSortType = !this.cameraSortType;
        if (this.cameraSortType) {
          this.pagination.order = 'desc';
        } else {
          this.pagination.order = 'asc';
        }
      } else if (this.sortType === 1) {
        this.sortType = 2;
      }

      // this.pagination.order = type;
      this.pagination.orderBy = 'deviceName';

      this.$nextTick(() => {
        this.getList();
      })
    },
    // 分页
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getList();
    },
    /**
     * 打开抓拍弹框
     */
    onOpenDetail (obj, index) {
      this.detailData = {
        index: index,
        pageNum: this.pagination.pageNum,
        list: this.dataList
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.restrict_snap_detail {
  width: 100%;
  height: 100%;
  .vc_gcck_bd {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 50px; line-height: 50px;
  }
  .content_snap_box {
    width: 100%;
    height: 100%;
    padding-top: 50px;
    overflow: hidden;
    // position: relative;
    .vehicle_info {
      color: #333333;
      position: absolute;
      height: 40px;
      line-height: 40px;
      left: 20px;
      >span {
        margin-right: 10px;
        .number {
          // color: #2580fc;
        }
      }
      span:first-child {
        color: #333333;
      }
      span:last-child {
        color: #999999;
      }
    }
    // 检索结果与排序
    .result_sort {
      overflow: hidden;
      height: 40px;
      line-height: 40px;
      .result {
        font-size: 14px;
        color: #666;
        float: left;
      }
      .sort {
        font-size: 14px;
        width: 260px;
        height: 100%;
        margin: 0 auto;
        .sort_item {
          text-align: center;
          width: 80px;
          margin-right: 20px;
          height: 100%;
          float: left;
          color: #999;
          cursor: pointer;
        }
        .active_sort {
          color: #2580fc;
          border-bottom: 2px solid #2580fc;
          i {
            color: #2580fc;
          }
        }
      }
    }
    .result_list {
      width: 100%;
      height: calc(100% - 40px);
      .result_list_ul {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        >li {
          cursor: pointer;
          width: 19%;
          height: 438px;
          margin: 10px 0 10px 10px;
          // margin: 10px 0 10px 10px;
          background-color: #ffffff;
          box-shadow: 0px 5px 16px 0px rgba(169,169,169,0.2);
          .img_box {
            width: 90%;
            margin: 10px 5%;
            height: calc(438px - 118px);
            img {
              width: 100%;
              height: 100%;
            }
          }
          .snap_detail {
            margin: 0 0 20px 20px;
            >p {
              margin-bottom: 5px;
            }
            .time, .device_name {
              color: #999999;
            }
            .address {
              color: #333333;
              font-size: 12px;
              overflow: hidden;
              // cursor: pointer;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
}
</style>