<template>
  <div class="analysis-results">
    <div class="">
      <!-- <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/portrait/menu' }">检索</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/portrait/pfcm' }">频繁出没</el-breadcrumb-item>
        <el-breadcrumb-item>分析结果</el-breadcrumb-item>
      </el-breadcrumb> -->
      <div is="vlBreadcrumb" 
          :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
            {name: '频繁出没', routerName: 'portrait_pfcm'},
            {name: '分析结果'}]">
        </div>
    </div>
    <vue-scroll>
      <div v-loading="loading">
      <div class="analysis-rc-info" v-if="list && list.length > 0">
        <div class="analysis-r-content">
          <div class="img-item" v-for="(item,index) of list.slice((pagination.pageNum-1)*pagination.pageSize,pagination.pageNum*pagination.pageSize)" :key="index">
            <div class="img-box" @click="toSnapDetail(item)">
              <img alt="头像" :src="item.personDetailList[0].subStoragePath">
              <i class="vl_icon vl_icon_portrait_01"></i>
              <p class="num">
                <span>{{item.appearTotal}}</span>
                <span class="text">次</span>
              </p>
            </div>
          </div>
        </div>
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
      <div class="no-data" v-if="isShow && (!list || list.length <= 0) ">
        <div class="content">
        <img src="../../../../assets/img/not-content.png" alt="">
        <p style="color: #666666; margin-top: 30px;">抱歉，没有相关的结果!</p>
        </div>
      </div>
      </div>
      <snapDialog ref="snapDialogComp" :snapObj="snapObj"></snapDialog>
    </vue-scroll>  
  </div>
</template>

<script>
import { getTaskInfosDetail } from "../../api/api.analysis.js";
import snapDialog from './components/snapDetail';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
export default {
  components: { snapDialog , vlBreadcrumb},
  data() {
    return {
      uid: '',
      pagination: { total: 0, pageSize: 24, pageNum: 1 },
      list: [],
      snapObj: {},
      isShow: false,
      loading: false,
    };
  },
  mounted() {
    this.uid = this.$route.query.uid
    /* for(let i=0; i<50; i++) {
      let personDetailList = []
      for(let k=0; k<4;k++) {
        personDetailList.push({
            "feature": "青年，女性",
            "deviceName": "摄像头k"+k,
            "deviceNamePinyin": "摄像头3",
            "address": "长沙市天心区上街广发银行北门003_"+k,
            "videoPath": "http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4",
            "shotPlaceLongitude": 110.594419,
            "shotPlaceLatitude": 27.908869,
            "subStoragePath": "http://file.aorise.org/vlink/image/f93bdaff-e12c-4a08-a596-402fcdd1a10d.png",
            "shotTime": "2018-11-12 13:14:16",
            "personStoragePath": "http://file.aorise.org/vlink/image/9fcfc0db-c70e-4cfa-adbe-4f0f6b9ecee8.png",
            "bussId": "1111111111111111111111111111111",
        })
      personDetailList.push({
            "feature": "少年，女性",
            "deviceName": "人像摄像"+k,
            "deviceNamePinyin": "摄像头3",
            "address": "湖南省长沙市天心区黑石铺街道九峰路九峰安置小区——"+k,
            "videoPath": "http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4",
            "shotPlaceLongitude": 112.973613,
            "shotPlaceLatitude": 28.095893,
            "subStoragePath": "http://file.aorise.org/vlink/image/9fcfc0db-c70e-4cfa-adbe-4f0f6b9ecee8.png",
            "shotTime": "2019-11-12 13:14:16",
            "personStoragePath": "http://file.aorise.org/vlink/image/40946e56-3292-4c3b-bd34-199f647ac8b8.png",
            "bussId": "2222222222222222222222222222222",
        })
        personDetailList.push({
            "feature": "少年，男性",
            "deviceName": "哈哈哈"+k,
            "deviceNamePinyin": "摄像头3",
            "address": "湖南省长沙市天心区黑石铺街道黑石铺路——"+k,
            "videoPath": "http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4",
            "shotPlaceLongitude": 112.973334,
            "shotPlaceLatitude": 28.097071,
            "subStoragePath": "http://file.aorise.org/vlink/image/40946e56-3292-4c3b-bd34-199f647ac8b8.png",
            "shotTime": "2019-11-12 13:14:16",
            "personStoragePath": "http://file.aorise.org/vlink/image/f93bdaff-e12c-4a08-a596-402fcdd1a10d.png",
            "bussId": "33333333333333333333333333333333",
        })
    }
    this.list.push({
        "appearTotal": i,
        "personDetailList": [...personDetailList]
      })
    }
    this.list.sort(this.sortVal) */
    this.getDetail();
  },
  methods: {
    handleCurrentChange(page) {
      this.pagination.pageNum = page;
    },
    //分析结果
    getDetail() {
      this.loading = true
      getTaskInfosDetail(this.uid).then(res => {
        console.log("------getTaskInfosDetail-------",res,JSON.parse(res.data.taskResult))
        if(res && res.data) {
          let taskResult = JSON.parse(res.data.taskResult)
          this.list = taskResult.resultList
          if(this.list && this.list.length > 0) {
            this.list.sort(this.sortVal)
            this.pagination.total = this.list.length
          }else {
            this.$nextTick(() => {
              this.isShow = true
            })
          }
        }
        this.$nextTick(() => {
          this.loading = false
        })
      }).catch(error => {
        this.isShow = true
        this.loading = false
        console.log(error)
      })
    },
    //排序
    sortVal(a, b) {
      console.log(a,b)
      return b.appearTotal - a.appearTotal;
    },
    //详情弹窗
    toSnapDetail(obj) {
      console.log("obj",obj)
      this.snapObj = obj;
      this.$refs["snapDialogComp"].toogleVisiable(true);
    },
  }
};
</script>

<style lang="scss" scoped>
.analysis-results {
  width: 100%;
  height: calc(100% - 50px);
  .breadcrumb_heaer {
    background: #fff;
    border-bottom: 1px solid #d3d3d3;
  }
  .analysis-rc-info {
    height: 100%;
    .analysis-r-content {
      padding: .3rem 0 0 0;
      display: flex;
      flex-wrap: wrap;
      .img-item {
        width: 2.17rem;
        height: 2.17rem;
        margin: 0 0 .2rem .2rem;
        background-color: #fff;
        box-shadow: 0px 2px 10px 0px rgba(131, 131, 131, 0.12);
        .img-box {
          position: relative;
          width: 1.85rem;
          height: 1.85rem;
          background-color: #999;
          margin: .16rem;
          >img {
            width: 1.85rem;
            height: 1.85rem;
          }
          i {
            position: absolute;
            top: -0.01rem;
            right: -0.01rem;
          }
          .num {
            display: block;
            position: absolute;
            top: -3px;
            right: -5px;
            width: 100px;
            height: 100px;
            text-align: center;
            font-size: .2rem;
            font-weight: 600;
            color: #fff;
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            transform: rotate(45deg);
            z-index: 99;
          }
          .text {
            font-weight: 500;
            font-size: 12px;  
          }
        }
      }
    }
    .cum_pagination {
      padding: .3rem 0 .4rem 0;
      text-align: center;
    }
  }
  .no-data {
    position: fixed;
    top: 1.5rem;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: center;
    font-size: 0;
    white-space: nowrap;
    overflow: auto;
    &:after {
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
      margin-top: -.3rem;
    }
    .content {
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      font-size: 14px;
      white-space: normal;
      margin-top: -.3rem;
    }
  }
}
</style>
<style lang="scss">
html {font-size: 100px;}
  @media screen and (min-width: 960px) and (max-width: 1119px) {html {font-size: 60px !important;}}
  @media screen and (min-width: 1200px) and (max-width: 1439px) {html {font-size: 70px !important;}}
  @media screen and (min-width: 1440px) and (max-width: 1679px) {html {font-size: 80px !important;}}
  @media screen and (min-width: 1680px) and (max-width: 1919px) {html {font-size: 90px !important;}}
  @media screen and (min-width: 1920px) {html {font-size: 100px !important;} }
.analysis-results {
  .__view {
    width: 100% !important; // vue-scroll样式重置
  }
}
</style>



