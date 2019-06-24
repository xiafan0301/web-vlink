<template>
  <vue-scroll>
    <div class="report-detail">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/event/treatingEventDetail', query: {eventId: this.$route.query.eventId, status: this.$route.query.status}}">事件详情</el-breadcrumb-item>
          <el-breadcrumb-item>查看上级呈报</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <EventBasic :basicInfo="basicInfo" @emitHandleImg="emitHandleImg"></EventBasic>
        <div class="receive_box" v-show="lowerlevelReportList && lowerlevelReportList.length > 0">
          <div class="divide"></div>
          <ul v-for="(item, index) in lowerlevelReportList" :key="index">
            <li>
              <span>接收者:</span>
              <span>{{item.receiverName}}</span>
            </li>
            <li>
              <span>情况说明:</span>
              <span>{{item.processContent}}</span>
            </li>
            <div class="divide" style="width: 250%"></div>
          </ul>
        </div>
        <div class="report-content" v-show="superPointList && superPointList.length > 0">
          <div class="header">
            <p class="ctc-title">上级指示</p>
          </div>
          <div class="divide"></div>
          <ul class="report-list">
            <li v-for="(item, index) in superPointList" :key="'item' + index">
              <div>
                <span>{{item.opUserName}}</span>
                <span>{{item.createTime}}</span>
              </div>
              <div>{{item.processContent}}</div>
              <div style="width:100%;margin-top:10px;">
                <img
                  style="width: 80px;height: 80px;border-radius: 4px;margin-right: 5px;cursor:pointer;border:1px solid #ccc;"
                  v-for="(itm, index) in item.attachmentList"
                  :key="'item' + index"
                  :src="itm.path"
                  @click="openBigImg(index, item.attachmentList)"
                >
              </div>
              <div class="content-divide"></div>
            </li>
          </ul>
        </div>
      </div>
      <div class="operation-footer">
        <template v-if="$route.query.status !== 'ending'">
          <el-button class="operation_btn function_btn" @click="skipReportPage">再次呈报</el-button>
        </template>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
      <BigImg :imgList="imgList1" :imgIndex='imgIndex' :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
    </div>
  </vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
import { getEventDetail, getEventProcess } from '@/views/index/api/api.event.js';
import { proccessEventType } from '@/utils/data.js';
import BigImg from '@/components/common/bigImg.vue';
export default {
  components: { EventBasic, BigImg },
  data () {
    return {
      imgIndex: 0, // 点击的图片索引
      isShowImg: false, // 是否放大图片
      imgList1: [],
      basicInfo: {}, // 事件详情
      superPointList: [], // 上级指示列表
      lowerlevelReportList: [] // 下级呈报列表
    }
  },
  mounted () {
    this.getDetail();
    this.getSuperPointList();
    this.getLowerlevelReportList();
  },
  methods: {
    // 获取事件详情
    getDetail () {
      const eventId = this.$route.query.eventId;
      getEventDetail(eventId)
        .then(res => {
          if (res) {
            this.basicInfo = res.data;
          }
        })
        .catch(() => {})
    },
    // 获取上级指示列表
    getSuperPointList () {
      const params= {
        processType: proccessEventType.directiveId,
        dispatchType: 1 // 1--事件  2--告警
      }
      getEventProcess(params, this.$route.query.eventId) 
        .then(res => {
          if (res) {
            this.superPointList = res.data;
          }
        })
    },
    // 获取下级呈报列表
    getLowerlevelReportList () {
      const params= {
        processType: proccessEventType.reportSuperId,
        dispatchType: 1 // 1--事件  2--告警
      }
      getEventProcess(params, this.$route.query.eventId) 
        .then(res => {
          if (res) {
            this.lowerlevelReportList = res.data;
          }
        })
    },
    // 跳至向上级呈报页面
    skipReportPage () {
      this.$router.push({name: 'event_report', query: { eventId: this.$route.query.eventId }});
    },
    // 返回
    back () {
      this.$router.back(-1);
    },
    // 图片放大传参
    emitHandleImg (isShow, index) {
      this.openBigImg(index, this.basicInfo.attachmentList);
    },
    // 关闭图片放大
    emitCloseImgDialog(data){
      this.imgList1 = [];
      this.isShowImg = data;
    },
    // 放大图片
    openBigImg (index, data) {
      this.isShowImg = true;
      this.imgIndex = index;
      this.imgList1 = JSON.parse(JSON.stringify(data));
    },
  }
}
</script>
<style lang="scss" scoped>
.report-detail {
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 100px;
    .receive_box {
      width: 100%;
      margin-top: -20px;
      margin-bottom: 20px;
      background: #fff;
      box-shadow: 5px 0px 16px 0px rgba(169, 169, 169, 0.2);
      .divide {
        border: 1px dashed #F2F2F2;
       
      }
      >ul {
        padding: 10px 20px;
        width: 700px;
        &:last-child {
          .divide {
            display: none;
          }
        }
        
        >li {
          display: flex;
          width: 100%;
          margin-bottom: 10px;
          span:first-child {
            display: inline-block;
            text-align: right;
            width: 70px;
            color: #666666;
            margin-right: 10px;
          }
          span:last-child {
            width: calc(700px - 70px);
            color: #333333;
          }
        }
      }
    }
    .report-content {
      width: 100%;
      margin-bottom: 20px;
      background-color: #ffffff;
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
      .header {
        padding: 10px 20px 0 20px;
        > p {
          color: #333333;
          font-size: 16px;
          font-weight: 600;
        }
      }
      .divide {
        width: 100%;
        height: 1px;
        margin-top: 10px;
        background-color: #F2F2F2;
      }
      .report-list {
        padding: 10px 20px;
        > li {
          > div {
            line-height: 25px;
            color: #333333;
            &:nth-child(1) {
              span:nth-child(1) {
                color: #333333;
                margin-right: 10px;
              }
              span:nth-child(2) {
                color: #666666;
              }
            }
            &:nth-child(2) {
              width: 50%;
            }
          }
          .content-divide {
            width: 100%;
            height: 1px;
            margin: 5px 0;
            border-bottom: 1px dashed #F2F2F2;
          }
          &:last-child { 
            .content-divide {
              display: none;
            }
          }
        }
        
      }
    }
  }
  .operation-footer {
    border-left: 1px solid #F2F2F2;
    width: 100%;
    height: 65px;
    line-height: 65px;
    position: fixed;
    bottom: 0;
    background: #ffffff;
    padding-left: 20px;
    .operation_btn {
      padding: 0;
      width: 100px;
      height: 40px;
      text-align: center;
    }
    .function_btn {
      background: #0C70F8;
      color: #ffffff;
    }
    .back_btn {
      background: #ffffff;
      border: 1px solid #DDDDDD;
      color: #666666;
    }
  }
}
</style>


