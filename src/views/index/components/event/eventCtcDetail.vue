<template>
  <vue-scroll>
    <div class="event-ctc-detail">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/manage' }">事件处理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/event/treatingEventDetail', query: { eventId: $route.query.eventId, status: $route.query.evt_status } }">事件详情</el-breadcrumb-item>
          <el-breadcrumb-item>查看调度指挥</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <EventBasic :status="$route.query.status" :basicInfo="basicInfo" @emitHandleImg="emitHandleImg"></EventBasic>
        <div class="event-ctc-content" v-show="basicInfo.taskList && basicInfo.taskList.length > 0">
          <div class="header">
            <p class="ctc-title">调度方案</p>
          </div>
          <div class="divide"></div>
          <ul class="content-list">
            <li v-for="(item, index) in basicInfo.taskList" :key="'item' + index">
              <div>
                <span>调度部门：</span>
                <span>{{item.departmentName}}</span>
              </div>
              <div>
                <span>任务名称：</span>
                <span>{{item.taskName}}</span>
              </div>
              <div class="ctc-content">
                <span>任务内容：</span>
                <span>{{item.taskContent}}</span>
              </div>
              <div class="divide-list"></div>
            </li>
          </ul>
        </div>
        <div class="summary" v-show="basicInfo.eventSummary">
          <div class="summary-header">
            <span>事件总结</span>
          </div>
          <div class="divide"></div>
          <div class="summary-content">
            <template v-if="(eventFile && eventFile.length > 0) || (eventImg && eventImg.length > 0)">
              <p>事件总结附件</p>
              <div class="content-icon">
                <ul class="clearfix" style="clear:both">
                  <li v-for="(item, index) in eventFile" :key="'item' + index">
                    <i class="vl_icon vl_icon_event_1"></i>
                    <div class="operation_btn">
                      <div class="arrow"></div>
                      <p>
                        <i class="vl_icon vl_icon_manage_17"></i>
                        <a :href="item.path">下载</a>
                      </p>
                      <p>
                        <i class="vl_icon vl_icon_event_25"></i>
                        <a>预览</a>
                      </p>
                    </div>
                  </li>
                </ul>
                <img v-for="(item, index) in eventImg" :src="item.path" :key="index" @click="openBigImg(index, eventImg)" />
              </div>
              <div class="divide"></div>
            </template>
            <template v-if="basicInfo.eventSummary">
              <p style="margin-top: 5px;">事件总结内容</p>
              <div class="content_detail">
                <p>
                  {{basicInfo.eventSummary}}
                  <span v-show="eventSummaryLength > 800" class="look_more" @click="showSummaryDialog('event', basicInfo.eventSummary)">更多...</span>
                </p>
              </div>
            </template>
          </div>
        </div>
        <div class="summary" v-show="basicInfo.dispatchSummary">
          <div class="summary-header">
            <span>调度总结</span>
          </div>
          <div class="divide"></div>
          <div class="summary-content">
            <template v-if="(ctcFile && ctcFile.length > 0) || (ctcImg && ctcImg.length > 0)">
              <p>调度总结附件</p>
              <div class="content-icon">
                <ul class="clearfix" style="clear:both">
                  <li v-for="(item, index) in ctcFile" :key="'item' + index">
                    <i class="vl_icon vl_icon_event_1"></i>
                    <div class="operation_btn">
                      <div class="arrow"></div>
                      <p>
                        <i class="vl_icon vl_icon_manage_17"></i>
                        <a :href="item.path">下载</a>
                      </p>
                      <p>
                        <i class="vl_icon vl_icon_event_25"></i>
                        <a>预览</a>
                      </p>
                    </div>
                  </li>
                </ul>
                <img v-for="(item, index) in ctcImg" :src="item.path" :key="index" @click="openBigImg(index, ctcImg)" />
              </div>
              <div class="divide"></div>
            </template>
            <template v-if="basicInfo.dispatchSummary">
              <p style="margin-top: 5px;">调度总结内容</p>
              <div class="content_detail">
                <p>
                  {{basicInfo.dispatchSummary}}
                  <span v-show="dispatchSummaryLength > 800" class="look_more" @click="showSummaryDialog('ctc', basicInfo.dispatchSummary)">更多...</span>
                </p>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="operation-footer">
        <template v-if="$route.query.status !== 'ctc_end'">
          <el-button class="operation_btn function_btn" @click="skipAgainCtcPage">再次调度</el-button>
          <el-button class="operation_btn back_btn" @click="skipCtcEndPage">结束调度</el-button>
        </template>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
       <!--查看总结详情弹出框-->
      <el-dialog
        title=""
        :visible.sync="summaryDetailDialog"
        width="794px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
        >
        <div class="content_body">
          <p class="title">{{summaryTitle}}</p>
          <p class="content">{{summaryContent}}</p>
        </div>
      </el-dialog>
      <BigImg :imgList="imgList1" :imgIndex='imgIndex' :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
    </div>
  </vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
import { getEventDetail } from '@/views/index/api/api.event.js';
import BigImg from '@/components/common/bigImg.vue';
export default {
  components: { EventBasic, BigImg },
  data () {
    return {
      imgIndex: 0, // 点击的图片索引
      isShowImg: false, // 是否放大图片
      imgList1: [],
      basicInfo: {}, // 事件详情
      eventImg: [], // 事件总结图片列表
      eventFile: [], // 事件总结文件列表
      ctcImg: [], // 调度总结图片列表
      ctcFile: [], // 调度总结文件列表
      summaryDetailDialog: false, // 查看总结详情弹出框
      summaryTitle: null, // 总结标题
      summaryContent: null, // 总结内容
      eventSummaryLength: 0,
      dispatchSummaryLength: 0
    }
  },
  mounted () {
    this.getDetail();
  },
  methods: {
    // 返回
    back () {
      this.$router.back(-1);
    },
    // 跳至结束调度页面
    skipCtcEndPage () {
      this.$router.push({name: 'ctc_end', query: {eventId: this.$route.query.eventId, status: this.$route.query.status}});
    },
    // 跳至再次调度页面
    skipAgainCtcPage () {
      this.$router.push({name: 'ctc_operation', query: { eventId: this.$route.query.eventId, eventType: this.basicInfo.eventType, status: this.$route.query.status }});
    },
    // 获取事件详情
    getDetail () {
      const eventId = this.$route.query.eventId;
      getEventDetail(eventId)
        .then(res => {
          if (res) {
            this.basicInfo = res.data;
            if (res.data.eventCloseAttachmentList.length > 0) {
              res.data.eventCloseAttachmentList.map(item => {
                if (item.cname.endsWith('.jpg') || item.cname.endsWith('.png') || item.cname.endsWith('.jpeg')) {
                  this.eventImg.push(item);
                } else {
                  this.eventFile.push(item);
                }
              })
            }
            if (res.data.dispatchCloseAttachmentList.length > 0) {
              res.data.dispatchCloseAttachmentList.map(item => {
                if (item.cname.endsWith('.jpg') || item.cname.endsWith('.png') || item.cname.endsWith('.jpeg')) {
                  this.ctcImg.push(item);
                } else {
                  this.ctcFile.push(item);
                }
              })
            }
            this.eventSummaryLength = this.basicInfo.eventSummary.length;
            this.dispatchSummaryLength = this.basicInfo.dispatchSummary.length;
          }
        })
        .catch(() => {})
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
    // 显示查看总结详情弹出框
    showSummaryDialog (type, content) {
      if (type === 'event') {
        this.summaryTitle = '事件总结报告';
      } else {
        this.summaryTitle = '调度总结报告';
      }
      this.summaryContent = content;
      this.summaryDetailDialog = true;
    },
  }
}
</script>
<style lang="scss" scoped>
.event-ctc-detail {
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 100px;
    .event-ctc-content, .summary {
      width: 100%;
      margin-bottom: 20px;
      background-color: #ffffff;
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
      .summary-header{
        > span {
          display: inline-block;
          padding: 10px 20px;
          color: #333333;
          font-weight: 600;
          font-size: 16px;
        }
        
      }
      .header {
        padding: 10px 20px 0 20px;
        > p {
          color: #333333;
          font-size: 16px;
          font-weight: 600;
        }
        .ctc-title {
          margin-bottom: 10px;
        }
      }
      .divide {
        width: 100%;
        height: 1px;
        background-color: #F2F2F2;
      }
      .content-list {
        padding: 10px 20px 10px 20px;
        > li {
          display: flex;
          flex-wrap: wrap;
          > div {
            // height: 30px;
            line-height: 30px;
            span:nth-child(1) {
              color: #666666;
            }
            span:nth-child(2) {
              color: #333333;
            }
            &:nth-child(1) {
              width: 25%;
            }
            &:nth-child(2) {
              width: 60%;
            }
            &:nth-child(3) {
              display: flex;
              span:nth-child(2) {
                width: 750px;
                display: inline-block;
              }
            }
          }
          &:last-child {
            .divide-list {
              display: none;
            }
          }
          .divide-list {
            width: 100%;
            height: 1px;
            margin: 10px 0;
            border-bottom: 1px dashed #F2F2F2;
          }
        }
      }
      .summary-content {
        padding: 10px 20px;
        >p {
          color: #333333;
          font-weight:600;
          margin-bottom: 5px;
        }
        .content-icon {
          margin: 5px 0;
          display: flex;
          flex-wrap: wrap;
          >ul {
            >li {
              position: relative;
              float: left;
              i {
                margin: 0 5px;
                cursor: pointer;
              }
              .operation_btn {
                display: none;
                background-color: #ffffff;
                box-shadow:0px 2px 8px 0px rgba(0,0,0,0.15);
                position: absolute;
                right: 0;
                top: -55px;
                z-index: 1;
                padding: 3px 5px;
                color: #333333;
                font-size: 12px;
                // position: relative;
                .arrow {
                  position: absolute;
                  bottom: -5px;
                  left: 40%;
                  width: 0;
                  height: 0;
                  border-left: 6px solid transparent;
                  border-right: 6px solid transparent;
                  border-top: 6px solid #ffffff;
                }
                > p {
                  padding: 3px;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  a {
                    text-decoration: none;
                  }
                  a:hover {
                    color: #0C70F8;
                  }
                }
              }
              &:hover {
                .operation_btn {
                  display: block;
                }
              }
            }
          }
          img {
            width: 72px;
            height: 72px;
            border-radius: 4px;
            margin: 0 5px;
            cursor: pointer;
          }
        }
        .content_detail {
          >p{
            text-indent: 20px;
            .look_more {
              color: #0C70F8;
              cursor: pointer;
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
  .dialog_comp {
    /deep/ .el-dialog {
      top: 53%;
      .content_body {
        color: #000000;
        .title {
          font-size: 22px;
          text-align: center;
          margin: 40px 0;
        }
        .content {
          text-indent: 20px;
          padding: 0 40px;
        }
      }
    }
  }
}
</style>


