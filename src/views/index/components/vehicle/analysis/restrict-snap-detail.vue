<template>
  <div class="restrict_snap_detail">
    <div class="vc_gcck_bd">
       <!-- <div is="vlBreadcrumb" :breadcrumbData="[
        {name: '车辆侦查', routerName: 'vehicle'}, 
        {name: '车辆限行', routerName: 'vehicle_restrict_driving'},
        {name: '限行详情'}]"></div> -->
      <div is="vlBreadcrumb" :breadcrumbData="
        [{name: '车辆侦查', routerName: 'vehicle'}, 
        {name: '车辆限行', routerName: 'vehicle_restrict_driving'},
        {name: '限行详情', routerName: 'vehicle_restrict_detail'},
        {name: '抓拍详情'}]">
      </div>
    </div>
    <div class="content_box">
      <div class="vehicle_info">
        <span>车牌号：湘A12346</span>
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
  }
}
</script>
<style lang="scss" scoped>
.restrict_snap_detail{
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
    position: relative;
    .vehicle_info {
      color: #333333;
      position: absolute;
      height: 40px;
      line-height: 40px;
      left: 20px;
      >span {
        margin-right: 20px;
        .number {
          color: #2580fc;
        }
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
        width: 220px;
        height: 14px;
        margin: 0 auto;
        .sort_item {
          text-align: center;
          width: 110px;
          float: left;
          color: #999;
          cursor: pointer;
        }
        .active_sort {
          color: #2580fc;
          i {
            color: #2580fc;
          }
        }
      }
    }
  }
}
</style>