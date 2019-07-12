<template>
  <div>
    <div class="th-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/portrait/menu' }">人像检索</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/portrait/peer-analysis-result?uid=' + $route.query.uid }">同行分析</el-breadcrumb-item>
        <el-breadcrumb-item>同行记录</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- <el-button :loading="exportLoadingbtn" @click="onExport" class="th-button-export-color">导出</el-button> -->
    </div>
    <div class="rlcx_r">
      <div class="rlcx_r_order">
        <ul>
          <li @click="orderHandler(1)" :class="{'rlcx_r_order_sed': orderType === 1}">时间排序&nbsp;<i class="el-icon-arrow-down" :class="{'rlcx_r_order_up': order === 2}"></i></li>
          <li @click="orderHandler(2)" :class="{'rlcx_r_order_sed': orderType === 2}">监控排序&nbsp;<i class="el-icon-arrow-down" :class="{'rlcx_r_order_up': order === 2}"></i></li>
          <span :class="{'rlcx_r_order_line2': orderType === 2}"></span>
        </ul>
      </div>
      <ul class="rlcx_r_list clearfix">
        <li v-for="item in 7" :key="item" @click="onOpenCompair(item)">
          <div class="box">
            <div class="top">
              <img src="../../../../assets/img/666.jpg" alt="">
              <img style="padding-left: 12px;" src="../../../../assets/img/666.jpg" alt="">
              <div class="left-float">目标对象</div>
              <div class="right-float">同行对象</div>
              <div class="left-time">2018-11-12 13:14:52  </div>
              <div class="right-time">2018-11-12 13:14:52  </div>
            </div>
            <div class="bottom">
              <p>抓拍设备名称123</p>
              <p>湖南省长沙市天心区桂花坪社区雀园路与君逸路交叉口</p>
            </div>
          </div>
        </li>
      </ul>
      <el-pagination
        class="cum_pagination th-center-pagination"
        @current-change="onPageChange"
        :current-page.sync="pagination.currentPage"
        :page-size="pagination.pageSize"
        layout="prev, pager, next"
        :total="32">
      </el-pagination>
    </div>
    <el-dialog
      :visible.sync="compairDialog"
      width="920px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp dialog_comp_compair">
        <div class="box">
          <div class="top">
            <img src="../../../../assets/img/666.jpg" alt="">
            <img style="padding-left: 24px;" src="../../../../assets/img/666.jpg" alt="">
            <div class="left-float">目标对象</div>
            <div class="right-float">同行对象</div>
            <div class="left-time">2018-11-12 13:14:52  </div>
            <div class="right-time">2018-11-12 13:14:52  </div>
          </div>
          <div class="bottom">
            <div class="text left-text">
              <p>详细资料</p>
              <p>
                <span>王英南</span>
                <span>男</span>
                <span>汉族</span>
                <span>失踪儿童</span>
                <span>分组2</span>
                <br/>
                <span>43068419970215013X <b>身份证</b> </span>
              </p>
            </div>
            <div class="text right-text">
              <p>详细资料</p>
              <p>
                <span>王英南</span>
                <span>男</span>
                <span>汉族</span>
                <span>失踪儿童</span>
                <span>分组2</span>
                <br/>
                <span>43068419970215013X <b>身份证</b> </span>
              </p>
            </div>
          </div>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import vehicleBreadcrumb from './breadcrumb.vue';
export default {
  components: {vehicleBreadcrumb},
  data () {
    return {
      orderType: 1, // 1时间排序 2监控排序
      order: 1, // 1desc 2asc
      pagination: {
        pageNum: 1,
        pageSize: 9,
        currentPage: 1
      },
      compairDialog: false
    }
  },
  methods: {
    orderHandler (type) {
      if (type === this.orderType) {
        if (this.order === 1) {
          this.order = 2;
        } else {
          this.order = 1;
        }
      } else {
        this.orderType = type;
      }
    },
    onOpenCompair (obj) {
      console.log(obj)
      this.compairDialog = true
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
    },
  }
}
</script>

<style lang="scss" scoped>
.rlcx_r {
  position: relative;
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
  > .rlcx_r_list {
    padding: 5px;
    > li {
      padding: 5px;
      float: left;
      .box {
        background-color: #fff;
        box-shadow: 0px 5px 16px 0px rgba(169,169,169,0.2);
        cursor: pointer;
        .top {
          position: relative;
          width: 460px;
          padding: 10px;
          display: flex;
          > img {
            width: 219px; height: 219px;
          }
          .left-float {
            position: absolute;
            left: 10px;top: 10px;
            width: 100px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background: #0C70F8;
            color: #fff;
            border-radius: 0 20px 20px 0;
          }
          .right-float {
            position: absolute;
            left: 241px;top: 10px;
            width: 100px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background: #50CC62;
            color: #fff;
            border-radius: 0 20px 20px 0;
          }
          .left-time {
            position: absolute;
            bottom: 10px;left: 10px;
            width: 219px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background:rgba(0,0,0,.52);
            color: #fff;
          }
          .right-time {
            position: absolute;
            bottom: 10px;left: 241px;
            width: 207px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background:rgba(0,0,0,.52);
            color: #fff;
          }
        }
        .bottom {
          p {
            padding: 0 0 0 10px;
          }
          p:nth-child(1) {
            font-size: 14px;
            color: #333;
          }
          p:nth-child(2) {
            padding-bottom: 10px;
            font-size: 12px;
            color: #999;
          }
        }
      }
      
    }
  }
  > .rlcx_r_msg {
    position: absolute; top: 20px; left: 20px;
    color: #333;
    > span { color: #666; }
  }
  > .rlcx_r_order {
    padding-top: 20px; padding-bottom: 10px;
    > ul {
      position: relative;
      margin: 0 auto;
      width: 200px;
      overflow: hidden;
      > li {
        width: 100px; height: 40px;
        float: left;
        text-align: center;
        cursor: pointer;
        font-size: 15px;
        transition: all .3s ease-out;
        > i {
          opacity: 0;
          transition: all .3s ease-out;
          &.rlcx_r_order_up {
            transform: rotate(180deg);
          } 
        }
        &.rlcx_r_order_sed {
          cursor: default;
          color: #2580FC;
          > i {
            opacity: 1;
            cursor: pointer;
          }
        }
      }
      > span {
        position: absolute; bottom: 5px; left: 8px;
        width: 80px; height: 2px;
        overflow: hidden;
        background-color: #2580FC;
        transition: all .3s ease-out;
        &.rlcx_r_order_line2 {
          left: 108px;
        }
      }
    }
  }
  .th-center-pagination {
    width: 100%;
    text-align: center;
    padding: 20px 0;
  }
}
</style>

<style lang="scss">
.dialog_comp_compair {
  .box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0 0 0;
    .top {
      position: relative;
      width: 680px;
      padding: 10px;
      display: flex;
      > img {
        width: 340px; height: 340px;
      }
      .left-float {
        position: absolute;
        left: 10px;top: 10px;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: #0C70F8;
        color: #fff;
        border-radius: 0 20px 20px 0;
      }
      .right-float {
        position: absolute;
        left: 374px;top: 10px;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: #50CC62;
        color: #fff;
        border-radius: 0 20px 20px 0;
      }
      .left-time {
        position: absolute;
        bottom: 10px;left: 10px;
        width: 340px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background:rgba(0,0,0,.52);
        color: #fff;
      }
      .right-time {
        position: absolute;
        bottom: 10px;left: 374px;
        width: 316px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background:rgba(0,0,0,.52);
        color: #fff;
      }
    }
    .bottom {
      width: 100%;
      display: flex;
      padding: 0 90px 0 111px;
      .text {
        p:nth-child(1) {
          color: #999;
          padding: 6px 0 10px 0;
        }
        p:nth-child(2) {
          span {
            display: inline-block;
            padding: 0 5px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border: 1px solid #F2F2F2;
            background: #FAFAFA;
            margin-right: 15px;
            margin-bottom: 10px;
            b {
              font-weight: normal;
              color: #999;
              padding-left: 15px;
            }
          }
        }
      }
      .left-text {
        width: 340px;
      }
      .right-text {
        width: 340px;
        padding-left: 24px;
      }
    }
  }
}
</style>
