<template>
  <div class="th-ycxc-record">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle'},
        {name: '夜间行车分析', routerName: 'vehicle_search_ycxc', query: {
          ... this.queryObj
        }}, {name: '抓拍记录'}]"></div>
    </div>
    <div class="th-ycxc-record-list">
      <template v-if="dataList && dataList.length > 0">
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
        <div class="list-box">
          <div class="list-item" v-for="(item, index) in dataList" :key="item.uid" @click="onOpenDetail(item, index)">
            <img :src="item.subStoragePath" alt="">
            <p class="time"><i></i>{{item.shotTime}}</p>
            <p class="address"><i></i>抓拍设备:{{item.deviceName}}</p>
          </div>
          <el-pagination
            class="cum_pagination th-center-pagination"
            @current-change="onPageChange"
            :current-page.sync="currentPage"
            :page-size="pagination.pageSize"
            layout="prev, pager, next"
            :total="pagination.total">
          </el-pagination>
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
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
import noResult from '@/components/common/noResult.vue';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import { getNightVehicleRecordList, getSnapDetail  }from "@/views/index/api/api.judge.js";
export default {
  components: {
    noResult,
    vlDialog,
    vlBreadcrumb
  },
  data () {
    return {
      isInitPage: false,
      sortType: 1, // 1为时间排序， 2为监控排序
      timeSortType: false, // true为时间降序， false为时间升序
      cameraSortType: true, // true为监控降序， false为监控升序
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        order: 'asc',
        orderBy: 'shotTime' // 默认抓拍时间升序
      },
      currentPage: 1,
      sortTimeType: 'asc', // 时间排序active  默认升序
      sortMonitoryType: null, // 监控排序active
      // /* 抓拍记录页面参数 */
      // strucDetailDialog: false, // 抓拍记录弹窗
      // strucCurTab: 1, // 抓拍记录弹窗tab
      // curImgIndex: 0, // 当前选择的图片index
      // strucInfoList: [],
      // sturcDetail: {},
      // bResize: {},
      // markerPoint: null, // 地图icon
      // newMarker: null,
      // playUrl: {},
      // videoUrl: null, // 下载地址
      // map: null,
      detailData: null,
      // swiperOption: {
      //   initialSlide: 5,
      //   slidesPerView: 10,
      //   spaceBetween: 18,
      //   slidesPerGroup: 10,
      //   loop: false,
      //   slideToClickedSlide: true,
      //   loopFillGroupWithBlank: true,
      //   navigation: {
      //     nextEl: '.swiper-button-next',
      //     prevEl: '.swiper-button-prev',
      //   },
      // },
      dataList: [], // 分页抓拍记录
      allDataList: [], // 所有的抓拍记录
      // playing: false, // 视频播放是否
      queryObj: {},
      numberTypeList: [], // 号牌种类列表
    }
  },
  created () {
    // console.log('aaa', this.$route.params)
    this.queryObj = {
      bayonetIds: this.$route.query.bayonetIds,
      cameraIds: this.$route.query.cameraIds,
      endDate: this.$route.query.endDate,
      endhour: this.$route.query.endhour,
      startDate: this.$route.query.startDate,
      startHour: this.$route.query.startHour,
      minShotTimes: this.$route.query.minShotTimes,
      vehicleTypes: this.$route.query.vehicleTypes,
      surveillanceIds: this.$route.query.surveillanceIds,
      isNextDay: this.$route.query.isNextDay,
      pageSize: this.$route.query.pageSize,
      pageNum: this.$route.query.pageNum,
    }
  },
  mounted () {
    this.getNumberTypeList();
    this.getList();
    this.getAllList();
  },
  methods: {
    // 获取号牌种类列表
    getNumberTypeList () {
      const type = dataList.numberType;
      getDiciData(type)
        .then(res => {
          if (res) {
            this.numberTypeList = res.data;
          }
        })
    },
    // 获取所有的抓拍记录
    getAllList () {
    
      this.queryObj['vehicleNumber'] = this.$route.query.vehicleNumber;
      this.queryObj['order'] = this.pagination.order;
      this.queryObj['orderBy'] = this.pagination.orderBy;

      const params = {
        ...this.queryObj,
        pageSize: 0
      }
      getNightVehicleRecordList(params)
        .then(res => {
          if (res && res.data) {
            this.allDataList = res.data.list;
          }
        })
        .catch(() => {})
    },
    // 获取抓拍记录
    getList () {
      this.queryObj['vehicleNumber'] = this.$route.query.vehicleNumber;
      this.queryObj['pageNum'] = this.pagination.pageNum;
      this.queryObj['order'] = this.pagination.order;
      this.queryObj['orderBy'] = this.pagination.orderBy;
      const params = {
        ...this.queryObj,
        pageSize: this.pagination.pageSize
      }
      getNightVehicleRecordList(params)
        .then(res => {
          if (res && res.data) {
            this.dataList = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
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
    /**
     * 分页赋值
     */
    onPageChange (page) {
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
        list: this.allDataList
      }
     
    },
  }
}
</script>
<style lang="scss" scoped>
.vc_gcck_bd {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 50px; line-height: 50px;
}
.th-ycxc-record {
  width: 100%;
  height: 100%;
  padding-top: 50px;
  .th-ycxc-record-list {
    width: 100%;
    height: 100%;
    // height: calc(100% - 55px);
    padding: 0 20px;
    background: #f7f9f9;
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
    .list-box {
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      flex-flow: row wrap;
      // height: calc(100% - 45px);
      .list-item {
        width: 19%;
        height: 320px;
        padding: 15px;
        margin-bottom: 15px;
        cursor: pointer;
        background: #fff;
        margin-left: 1.25%;
        &:nth-child(5n - 4) {
          margin-left: 0;
        }
        img {
          display: inline-block;
          width: 100%;
          height: calc(100% - 70px);
        }
        p {
          font-size: 14px;
          font-family: 'MicrosoftYaHei';
          font-weight: 500;
          color: #333;
          i {
            color: #999;
            margin-right: 3px;
            display: block;
            width: 15px;
            height: 15px;
          }
        }
        .time {
          padding: 10px 0 5px 0;
          display: flex;
          align-items: center;
          i {
            background: url("../../../../../assets/img/the-time.png") no-repeat;
            background-size: 15px 15px;
          }
        }
        .address {
          display: flex;
          align-items: center;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          i {
            background: url("../../../../../assets/img/the-daynoint.png") no-repeat;
            background-size: 15px 15px;
          }
        }
      }
    }
    .th-center-pagination {
      width: 100%;
      text-align: center;
      padding: 0 0 20px 0;
    }
  }
}
</style>

  