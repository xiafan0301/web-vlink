<template>
  <div class="restrict_snap_detail">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" :breadcrumbData="
        [{name: '车辆侦查', routerName: 'vehicle'}, 
        {name: '车辆限行', routerName: 'vehicle_restrict_driving'},
        {name: '限行详情', routerName: 'vehicle_restrict_detail'},
        {name: '抓拍详情'}]">
      </div>
    </div>
    <div class="content_snap_box">
      <div class="vehicle_info">
        <span>车牌号湘A12346</span>
        <span>限行区域内共有<span class="number">111111</span>条抓拍信息</span>
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
            <li>
              <div class="img_box">
                <img src="../../../../../assets/img/666.jpg" alt="">
              </div>
              <div class="snap_detail">
                <p class="time">2018-12-12 12:12:12</p>
                <p class="device_name">抓拍设备2</p>
                <p class="address">湖南省长沙市天心区桂花坪社区雀园路与君逸路交叉口</p>
              </div>
            </li>
            <li>
              <div class="img_box">
                <img src="../../../../../assets/img/666.jpg" alt="">
              </div>
              <div class="snap_detail">
                <p class="time">2018-12-12 12:12:12</p>
                <p class="device_name">抓拍设备2</p>
                <p class="address">湖南省长沙市天心区桂花坪社区雀园路与君逸路交叉口</p>
              </div>
            </li>
            <li>
              <div class="img_box">
                <img src="../../../../../assets/img/666.jpg" alt="">
              </div>
              <div class="snap_detail">
                <p class="time">2018-12-12 12:12:12</p>
                <p class="device_name">抓拍设备2</p>
                <p class="address">湖南省长沙市天心区桂花坪社区雀园路与君逸路交叉口</p>
              </div>
            </li>
            <li>
              <div class="img_box">
                <img src="../../../../../assets/img/666.jpg" alt="">
              </div>
              <div class="snap_detail">
                <p class="time">2018-12-12 12:12:12</p>
                <p class="device_name">抓拍设备2</p>
                <p class="address">湖南省长沙市天心区桂花坪社区雀园路与君逸路交叉口</p>
              </div>
            </li>
            <li>
              <div class="img_box">
                <img src="../../../../../assets/img/666.jpg" alt="">
              </div>
              <div class="snap_detail">
                <p class="time">2018-12-12 12:12:12</p>
                <p class="device_name">抓拍设备2</p>
                <p class="address">湖南省长沙市天心区桂花坪社区雀园路与君逸路交叉口</p>
              </div>
            </li>
            <li>
              <div class="img_box">
                <img src="../../../../../assets/img/666.jpg" alt="">
              </div>
              <div class="snap_detail">
                <p class="time">2018-12-12 12:12:12</p>
                <p class="device_name">抓拍设备2</p>
                <p class="address">湖南省长沙市天心区桂花坪社区雀园路与君逸路交叉口</p>
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
    </div>
  </div>
</template>
<script>
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
export default {
  components: { vlBreadcrumb },
  data () {
    return {
      sortType: 1, // 1---时间排序 2--监控排序
      timeSortType: false, // true为时间降序， false为时间升序
      cameraSortType: true, // true为监控降序， false为监控升序
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
        order: 'asc',
        orderBy: 'shotTime' // 默认抓拍时间升序 
      },
    }
  },
  methods: {
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
        // this.getList();
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
        // this.getList();
      })
    },
    // 分页
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
    }
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
            img {
              width: 100%;
              height: calc(438px - 118px);
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