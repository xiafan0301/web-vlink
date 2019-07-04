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
            <div class="img-box">
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
    </vue-scroll>
  </div>
</template>

<script>
import { getTaskInfosDetail } from "../../api/api.analysis.js";
export default {
  data() {
    return {
      uid: '',
      pagination: { total: 50, pageSize: 24, pageNum: 1 },
      list: []
    };
  },
  mounted() {
    this.uid = this.$route.query.uid
    for(let i=0; i<50; i++) {
      this.list.push({
        "appearTotal": i,
        "personDetailList": [{
          "subStoragePath": "http://file.aorise.org/vlink/image/f93bdaff-e12c-4a08-a596-402fcdd1a10d.png",
        }]
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



