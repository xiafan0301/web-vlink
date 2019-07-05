<template>
  <div class="analysis-results">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/portrait/menu' }">检索</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/portrait/pfcm' }">频繁出没</el-breadcrumb-item>
        <el-breadcrumb-item>分析结果</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <vue-scroll>
      <div class="analysis-rc-info">
        <div class="analysis-r-content">
          <div class="img-item" v-for="(item,index) of list.slice((pagination.pageNum-1)*pagination.pageSize,pagination.pageNum*pagination.pageSize)" :key="index">
            <div class="img-box" @click="toSnapDetail(item)">
              <img alt="头像" :src="item.personDetailList[0].subStoragePath">
              <i class="vl_icon vl_icon_portrait_01"></i>
              <span class="num">
                {{item.appearTotal}}
                <span class="text">次</span>
              </span>
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
      <snapDialog ref="snapDialogComp" :snapObj="snapObj"></snapDialog>
    </vue-scroll>  
  </div>
</template>

<script>
import { getTaskInfosDetail } from "../../api/api.analysis.js";
import snapDialog from './components/snapDetail'
export default {
  components: { snapDialog },
  data() {
    return {
      uid: '',
      pagination: { total: 50, pageSize: 24, pageNum: 1 },
      list: [],
      snapObj: {},
    };
  },
  mounted() {
    this.uid = this.$route.query.uid
    for(let i=0; i<50; i++) {
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
    this.list.sort(this.sortVal)
    this.getDetail();
  },
  methods: {
    handleCurrentChange(page) {
      this.pagination.pageNum = page;
    },
    //分析结果
    getDetail() {
      getTaskInfosDetail(this.uid).then(res => {
        console.log("------getTaskInfosDetail-------",res)
      }).catch(error => {
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
    showLoading(data) {
      console.log("---00000------",data)
      if(data) {
        this.getAlarm()
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.analysis-results {
  width: 100%;
  height: calc(100% - 55px);
  .breadcrumb_heaer {
    background: #fff;
    border-bottom: 1px solid #d3d3d3;
  }
  .analysis-rc-info {
    height: 100%;
    .analysis-r-content {
      padding: 30px 0 0 0;
      display: flex;
      flex-wrap: wrap;
      .img-item {
        width: 217px;
        height: 217px;
        margin: 0 0 20px 20px;
        background-color: #fff;
        box-shadow: 0px 2px 10px 0px rgba(131, 131, 131, 0.12);
        .img-box {
          position: relative;
          width: 185px;
          height: 185px;
          background-color: #999;
          margin: 16px;
          >img {
            width: 185px;
            height: 185px;
          }
          i {
            position: absolute;
            top: -1px;
            right: -1px;
          }
          .num {
            display: block;
            position: absolute;
            top: -7px;
            right: -6px;
            width: 100px;
            height: 100px;
            text-align: center;
            font-size: 20px;
            font-weight: 600;
            color: #fff;
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            transform: rotate(45deg);
            z-index: 99;
            .text {
              position: absolute;
              top: 8px;
              right: 24px;
              font-weight: 500;
              font-size: 12px;
            }
          }
        }
      }
    }
    .cum_pagination {
      padding: 30px 0 40px 0;
      text-align: center;
    }
  }
}
</style>
<style lang="scss">
.analysis-results {
  .__view {
    width: 100% !important; // vue-scroll样式重置
  }
}
</style>



