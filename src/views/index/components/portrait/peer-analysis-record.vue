<template>
  <div style="height: 100%;">
    <div class="th-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/portrait/menu' }">人像侦查</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/portrait/peer-analysis-result?uid=' + $route.query.uid }">同行分析</el-breadcrumb-item>
        <el-breadcrumb-item>同行记录</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- <el-button :loading="exportLoadingbtn" @click="onExport" class="th-button-export-color">导出</el-button> -->
    </div>
    <div class="rlcx_r">
      <template v-if="pagination.total !== 0">
        <div class="rlcx_r_order">
          <ul>
            <li @click="orderHandler(1)" :class="{'rlcx_r_order_sed': orderType === 1}">时间排序&nbsp;<i class="el-icon-arrow-down" :class="{'rlcx_r_order_up': order === 2}"></i></li>
            <li @click="orderHandler(2)" :class="{'rlcx_r_order_sed': orderType === 2}">监控排序&nbsp;<i class="el-icon-arrow-down" :class="{'rlcx_r_order_up': order === 2}"></i></li>
            <span :class="{'rlcx_r_order_line2': orderType === 2}"></span>
          </ul>
        </div>
        <ul class="rlcx_r_list clearfix">
          <li v-for="(item, index) in list" :key="index + 'pp'" @click="onOpenCompair(item)">
            <div class="box">
              <div class="top">
                <img :src="item.targetStoragePath" alt="">
                <!-- <img src="../../../../assets/img/666.jpg" alt=""> -->
                <img style="padding-left: 12px;" :src="item.peerStoragePath" alt="">
                <div class="left-float">目标对象</div>
                <div class="right-float">同行对象</div>
                <div class="left-time">{{item.targetShotTime ? item.targetShotTime : '无'}}</div>
                <div class="right-time">{{item.shotTime ? item.shotTime : '无'}}</div>
              </div>
              <div class="bottom">
                <p>{{item.deviceName ? item.deviceName : '无'}}</p>
                <p>{{item.address ? item.address : '无'}}</p>
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
          :total="pagination.total">
        </el-pagination>
      </template>
      <template v-else>
        <div class="not_content">
          <img src="../../../../assets/img/not-content.png" alt="">
          <p>暂无相关数据</p>
        </div>
      </template>
    </div>
    <el-dialog
      :visible.sync="compairDialog"
      width="920px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp dialog_comp_compair">
        <div class="box">
          <div class="top">
            <img :src="dialogObj.targetStoragePath" alt="">
            <img style="padding-left: 24px;" :src="dialogObj.peerStoragePath" alt="">
            <div class="left-float">目标对象</div>
            <div class="right-float">同行对象</div>
            <div class="left-time">{{dialogObj.targetShotTime ? dialogObj.targetShotTime : '无'}}</div>
            <div class="right-time">{{dialogObj.shotTime ? dialogObj.shotTime : '无'}}</div>
          </div>
          <div class="bottom">
            <div class="text left-text">
              <p>详细资料</p>
              <p>
                <!-- <span>王英南</span> -->
                <span>{{dialogObj.targetSex ? dialogObj.targetSex : '无'}}</span>
                <span>{{dialogObj.targetAge ? dialogObj.targetAge : '无'}}</span>
                <!-- <span>失踪儿童</span> -->
                <!-- <span>分组2</span> -->
                <!-- <br/> -->
                <!-- <span>43068419970215013X <b>身份证</b> </span> -->
              </p>
            </div>
            <div class="text right-text">
              <p>详细资料</p>
              <p>
                <!-- <span>王英南</span> -->
                <span>{{dialogObj.sex}}</span>
                <span>{{dialogObj.age}}</span>
                <!-- <span>失踪儿童</span> -->
                <!-- <span>分组2</span> -->
                <!-- <br/> -->
                <!-- <span>43068419970215013X <b>身份证</b> </span> -->
              </p>
            </div>
          </div>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import vehicleBreadcrumb from './breadcrumb.vue';
import { getPeopleTaskDetail } from '@/views/index/api/api.analysis.js';
export default {
  components: {vehicleBreadcrumb},
  data () {
    return {
      orderType: 1, // 1时间排序 2监控排序
      order: 1, // 1desc 2asc
      pagination: {
        total: 0,
        pageSize: 12,
        currentPage: 1
      },
      compairDialog: false,
      listbox: [],
      list: [],
      retireObj: {},
      dialogObj: {}
    }
  },
  mounted () {
    this.getDetail()
  },
  methods: {
    // 获取离线任务详情
    getDetail () {
      const id = this.$route.query.uid
      if (id) {
        getPeopleTaskDetail(id)
          .then(res => {
            if (res) {
              this.$set(res.data, 'taskResult', JSON.parse(res.data.taskResult))
              this.$set(res.data, 'taskWebParam', JSON.parse(res.data.taskWebParam))
              let o = null
              if (this.$route.query.id) {
                o = res.data.taskResult.find(item => {return item.uid + '' === this.$route.query.id + ''})
              }
              if (o && o.personRetrieveDetailDtoList) {
                this.retireObj = Object.assign({}, o)
                this.listbox = [...o.personRetrieveDetailDtoList]
                this.list = [...o.personRetrieveDetailDtoList.slice(0, 12)]
                this.list.sort((a, b) => {return new Date(a.shotTime).getTime() - new Date(b.shotTime).getTime()})
              }
              this.pagination.total = this.listbox.length
            }
          })
      }
    },
    orderHandler (type) {
      if (type === 1) {
        this.orderType = 1
        if (this.order === 1) {
          this.list.sort((a, b) => {return new Date(b.shotTime).getTime() - new Date(a.shotTime).getTime()})
          this.order = 2
        } else {
          this.list.sort((a, b) => {return new Date(a.shotTime).getTime() - new Date(b.shotTime).getTime()})
          this.order = 1
        }
      } else if (type === 2) {
        this.orderType = 2
        if (this.order === 1) {
          this.order = 2
          if (!this.list.find(x => {return !x.deviceName}))
            this.list.sort((b, a) => {return a.deviceName.localeCompare(b.deviceName, 'zh-CN')})
        } else {
          this.order = 1
          if (!this.list.find(x => {return !x.deviceName}))
            this.list.sort((a, b) => {return a.deviceName.localeCompare(b.deviceName, 'zh-CN')})
        }
      }
    },
    onOpenCompair (obj) {
      this.dialogObj = Object.assign({}, obj)
      this.compairDialog = true
    },
    onPageChange (page) {
      this.list.splice(0, this.list.length)
      this.list = [...this.listbox.slice((page - 1) * 12, 12 + (page - 1) * 12)]
    },
  }
}
</script>

<style lang="scss" scoped>
.rlcx_r {
  position: relative;
  height: calc(100% - 50px);
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
        width: 320px;
        height: 30px;
        line-height: 30px;
        text-align: left;
        background:rgba(0,0,0,.52);
        color: #fff;
        padding-left: 15px;
      }
      .right-time {
        position: absolute;
        bottom: 10px;left: 355px;
        width: 315px;
        height: 30px;
        line-height: 30px;
        text-align: left;
        background:rgba(0,0,0,.52);
        color: #fff;
        padding-left: 15px;
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
