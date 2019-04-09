<template>
<vue-scroll>
  <div class="treating-detail">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
        <el-breadcrumb-item>事件详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-box">
      <EventBasic :status="$route.query.status" :basicInfo="basicInfo" @emitHandleImg="emitHandleImg"></EventBasic>
      <div class="summary" v-show="basicInfo.eventSummary">
        <div class="summary-header">
          <span>事件总结</span>
        </div>
        <div class="divide"></div>
        <div class="summary-content">
          <p>事件总结附件</p>
          <div class="content-icon">
            <ul>
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
            <img v-for="(item, index) in eventImg" :src="item.path" :key="index">
          </div>
          <div class="divide"></div>
          <p style="margin-top: 5px;">事件总结内容</p>
          <div class="content_detail">
             <p>
               {{basicInfo.eventSummary}}
               <span v-show="eventSummaryLength > 3000" class="look_more" @click="showSummaryDialog('event', basicInfo.eventSummary)">更多...</span>
            </p>
          </div>
        </div>
      </div>
      <div class="summary" v-show="basicInfo.dispatchSummary">
        <div class="summary-header">
          <span>调度总结</span>
        </div>
        <div class="divide"></div>
        <div class="summary-content">
          <p>调度总结附件</p>
          <div class="content-icon">
            <ul>
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
            <img v-for="(item, index) in ctcImg" :src="item.path" :key="index">
          </div>
          <div class="divide"></div>
          <p style="margin-top: 5px;">调度总结内容</p>
          <div class="content_detail">
             <p>
               {{basicInfo.dispatchSummary}}
               <span v-show="dispatchSummaryLength > 3000" class="look_more" @click="showSummaryDialog('ctc', basicInfo.dispatchSummary)">更多...</span>
            </p>
          </div>
        </div>
      </div>
      <div class="control-result">
        <div class="control-header">
          <div class="left">
            <span>布控结果 (200个)</span>
          </div>
          <div class="right">
            <el-date-picker
              v-model="dateTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-select v-model="devicesSearch" placeholder="请选择设备">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="divide"></div>
        <div class="control-content">
          <ul class="clearfix">
            <li>
              <div class="control-main">
                <img src="../../../../assets/img/temp/vis-eg.png" alt="">
                <div class="control-btn">
                  <div>抓拍设备</div>
                  <!-- <div> -->
                   <i class="vl_icon_event_15 vl_icon"></i>
                  <!-- </div> -->
                </div>
              </div>
              <div class="control-text">
                <p>
                  <i class="vl_icon vl_icon_event_2"></i>
                  <span class="name">匹配名称</span>
                </p>
                <p>
                  <i class="vl_icon vl_icon_event_3"></i>
                  <span class="time">2018-12-2414:12:17</span>
                </p>
              </div>
            </li>
            <li>
              <div class="control-main">
                <img src="../../../../assets/img/temp/vis-eg.png" alt="">
                <div class="control-btn">
                  <div>抓拍设备</div>
                  <i class="vl_icon_event_15 vl_icon"></i>
                </div>
              </div>
              <div class="control-text">
                <p>
                  <i></i>
                  <span class="name">匹配名称</span>
                </p>
                <p>
                  <i></i>
                  <span class="time">2018-12-2414:12:17</span>
                </p>
              </div>
            </li>
            <li>
              <div class="control-main">
                <img src="../../../../assets/img/temp/vis-eg.png" alt="">
                <div class="control-btn">
                  <div>抓拍设备</div>
                  <i class="vl_icon_event_15 vl_icon"></i>
                </div>
              </div>
              <div class="control-text">
                <p>
                  <i></i>
                  <span class="name">匹配名称</span>
                </p>
                <p>
                  <i></i>
                  <span class="time">2018-12-2414:12:17</span>
                </p>
              </div>
            </li>
            <li>
              <div class="control-main">
                <img src="../../../../assets/img/temp/vis-eg.png" alt="">
                <div class="control-btn">
                  <div>抓拍设备</div>
                  <div>
                    <i class="vl_icon_event_15 vl_icon"></i>
                  </div>
                </div>
              </div>
              <div class="control-text">
                <p>
                  <i></i>
                  <span class="name">匹配名称</span>
                </p>
                <p>
                  <i></i>
                  <span class="time">2018-12-2414:12:17</span>
                </p>
              </div>
            </li>
            <li>
              <div class="control-main">
                <img src="../../../../assets/img/temp/vis-eg.png" alt="">
                <div class="control-btn">
                  <div>抓拍设备</div>
                  <div>
                    <!-- <i></i>
                    <i></i> -->
                    <span>asdasd</span>
                    <span>asdsdasd</span>
                  </div>
                </div>
              </div>
              <div class="control-text">
                <p>
                  <i></i>
                  <span class="name">匹配名称</span>
                </p>
                <p>
                  <i></i>
                  <span class="time">2018-12-2414:12:17</span>
                </p>
              </div>
            </li>
            <li>
              <div class="control-main">
                <img src="../../../../assets/img/temp/vis-eg.png" alt="">
                <div class="control-btn">
                  <div>抓拍设备</div>
                  <div>
                    <!-- <i></i>
                    <i></i> -->
                    <span>asdasd</span>
                    <span>asdsdasd</span>
                  </div>
                </div>
              </div>
              <div class="control-text">
                <p>
                  <i></i>
                  <span class="name">匹配名称</span>
                </p>
                <p>
                  <i></i>
                  <span class="time">2018-12-2414:12:17</span>
                </p>
              </div>
            </li>
            <li>
              <div class="control-main">
                <img src="../../../../assets/img/temp/vis-eg.png" alt="">
                <div class="control-btn">
                  <div>抓拍设备</div>
                  <div>
                    <!-- <i></i>
                    <i></i> -->
                    <span>asdasd</span>
                    <span>asdsdasd</span>
                  </div>
                </div>
              </div>
              <div class="control-text">
                <p>
                  <i></i>
                  <span class="name">匹配名称</span>
                </p>
                <p>
                  <i></i>
                  <span class="time">2018-12-2414:12:17</span>
                </p>
              </div>
            </li>
            <li>
              <div class="control-main">
                <img src="../../../../assets/img/temp/vis-eg.png" alt="">
                <div class="control-btn">
                  <div>抓拍设备</div>
                  <div>
                    <!-- <i></i>
                    <i></i> -->
                    <span>asdasd</span>
                    <span>asdsdasd</span>
                  </div>
                </div>
              </div>
              <div class="control-text">
                <p>
                  <i></i>
                  <span class="name">匹配名称</span>
                </p>
                <p>
                  <i></i>
                  <span class="time">2018-12-2414:12:17</span>
                </p>
              </div>
            </li>
          </ul>
          <el-pagination
            @current-change="onPageChange"
            :current-page="pagination.pageNum"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="pagination.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pagination.total">
          </el-pagination>
        </div>
      </div>
      <div class="event-process" v-show="(basicInfo.taskList && basicInfo.taskList.length > 0) || (basicInfo.processingList && basicInfo.processingList.length > 0)">
        <div class="process-header">
          <span>事件进展</span>
        </div>
        <div class="divide"></div>
        <div class="process-box">
          <div class="department">
            <p>参与部门</p>
            <ul>
              <li v-for="(item, index) in basicInfo.taskList" :key="'item' + index">
                <span>{{item.departmentName}}</span>
                <span>{{item.createTime}}</span>
                <span>{{item.taskStatusName}}</span>
              </li>
            </ul>
          </div>
          <div class="process-list">
            <p>事件过程</p>
            <ul>
              <li v-for="(item, index) in basicInfo.processingList" :key="index">
                  <div class='circle-left'>
                    <div class='big-circle'>
                      <div class='small-circle'></div>
                    </div>
                  </div>
                  <div class='line'></div>
                  <div class="content-right">
                    <div class='content'>{{item.processContent}}（操作人：{{item.opUserName}}）</div>
                    <div class='time'>{{item.createTime}}</div>
                    <div style="width:100%;margin-top:10px;">
                      <img
                        style="width: 80px;height: 80px;border-radius: 4px;margin-right: 5px;cursor:pointer;"
                        v-for="(itm, index) in item.attachmentList"
                        :key="'item' + index"
                        :src="itm.src"
                        @click="openBigImg(index, item.attachmentList)"
                      >
                    </div>
                  </div>
                </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="event-handle event-end">
        <div class="handle-header">
          <span>事件处理</span>
        </div>
        <div class="divide"></div>
        <div class="handle-content">
          <ul class="clearfix">
            <li>
              <div>
                <span class="title">民众互助：</span>
                <span class="content" @click="skipCommentPage">5条评论</span>
                <span class="status">（已发布）</span>
              </div>
            </li>
            <li>
              <div>
                <span class="title">智能布控：</span>
                <span class="content" @click="skipControlPage">查看布控方案</span>
                <span class="status">（已设置）</span>
              </div>
            </li>
            <li>
              <div>
                <span class="title">调度指挥：</span>
                <span class="content" @click="skipEventCtcDetailPage">查看调度方案</span>
                <span class="status">（已发布）</span>
              </div>
            </li>
            <li>
              <div>
                <span class="title">向上呈报：</span>
                <span class="content" @click="skipReportDetailPage">查看呈报的内容和上级指示</span>
                <span class="status">（已呈报）</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn function_btn" v-show="$route.query.status === 'handling'" @click="skipEventEndPage">结束事件</el-button>
      <el-button class="operation_btn back_btn" @click="back">返回</el-button>
    </div>
    <BigImg :imgList="imgList1" :imgIndex='imgIndex' :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
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
  </div>
</vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
import BigImg from './components/bigImg.vue';
import { getEventDetail } from '@/views/index/api/api.js';
export default {
  components: { EventBasic, BigImg },
  data () {
    return {
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      dateTime: null, // 搜索布控结果的起止时间
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      devicesSearch: '',
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
    // 图片放大传参
    emitHandleImg (isShow, index) {
      this.openBigImg(index, this.basicInfo.attachmentList);
    },
    // 关闭图片放大
    emitCloseImgDialog(data){
      this.imgList1 = [];
      this.isShowImg = data;
    },
    // 获取事件详情
    getDetail () {
      const eventId = this.$route.query.eventId;
      getEventDetail(eventId)
        .then(res => {
          if (res) {
            if (res.data.closeAttachmentList.length > 0) {
              res.data.closeAttachmentList.map(item => {
                if (item.cname.endsWith('.jpg') || item.cname.endsWith('.png') || item.cname.endsWith('.jpeg')) {
                  this.eventImg.push(item);
                } else {
                  this.eventFile.push(item);
                }
              })
            }
            if (res.data.dispatchAttachmentList.length > 0) {
              res.data.dispatchAttachmentList.map(item => {
                if (item.cname.endsWith('.jpg') || item.cname.endsWith('.png') || item.cname.endsWith('.jpeg')) {
                  this.ctcImg.push(item);
                } else {
                  this.ctcFile.push(item);
                }
              })
            }
            this.basicInfo = res.data;
            this.eventSummaryLength = this.basicInfo.eventSummary.length;
            this.dispatchSummaryLength = this.basicInfo.dispatchSummary.length;
          }
        })
        .catch(() => {})
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      // this.getCtcDataList();
    },
    // 跳至结束事件页面
    skipEventEndPage () {
      this.$router.push({name: 'event_end', query: {status: this.$route.query.status}});
    },
    // 跳至查看互助页面
    skipCommentPage () {
      this.$router.push({path: '/message/help', query: {helpId: this.$route.query.eventId}});
    },
    // 跳至查看布控详情页面
    skipControlPage () {
      this.$router.push({path: '/control/manage'});
    },
    // 跳至查看调度指挥页面
    skipEventCtcDetailPage () {
      this.$router.push({name: 'event_ctc_detail', query: {status: this.$route.query.status, eventId: this.$route.query.eventId}});
    },
    // 跳至查看呈报内容
    skipReportDetailPage () {
      this.$router.push({name: 'report_detail', query: {status: this.$route.query.status}});
    },
    // 放大图片
    openBigImg (index, data) {
      this.isShowImg = true;
      this.imgIndex = index;
      this.imgList1 = JSON.parse(JSON.stringify(data));
    },
    // 返回
    back () {
      this.$router.back(-1);
    }
  }
}
</script>
<style lang="scss" scoped>
.treating-detail {
  width: 100%;
  // margin-bottom: 20px;
  .content-box {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 100px;
    .summary, .control-result, .event-process, .event-handle {
      width: 100%;
      margin-bottom: 20px;
      background-color: #ffffff;
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
      .divide {
        width: 100%;
        height: 1px;
        background-color: #F2F2F2;
      }
      .control-header {
        width: 100%;
        display: flex;
        padding: 10px 20px;
        justify-content: space-between;
        > div {
          &:nth-child(2) {
            width: 80%;
            text-align: right;
            > div {
              margin-right: 10px;
            }
          }
          > span {
            color: #333333;
            font-size: 16px;
            font-weight: 600;
          }
        }
        /deep/ .el-input__inner {
          height: 32px;
          line-height: 32px;
        }
        /deep/ .el-range-editor.el-input__inner {
          padding: 0px 10px;
        }
      }
      .control-content {
        width: 100%;
        padding: 20px;
        > ul {
          width: 100%;
          margin-bottom: 20px;
          > li {
            width: 395px;
            height: 301px;
            float: left;
            border-radius:4px;
            border:1px solid #D3D3D3;
            margin-right: 10px;
            margin-bottom: 10px;
            .control-main {
              height: 239px;
              width: 100%;
              position: relative;
              cursor: pointer;
              img {
                width: 100%;
                height: 100%;
                z-index: -1;
              }
              &:hover {
                .control-btn {
                  visibility: visible;
                  animation: fadeInUpControl .7s ease-out .2s both;
                }
              }
              .control-btn {
                width: 100%;
                height:36px;
                visibility: hidden;
                padding: 0 10px;
                line-height: 36px;
                background: #212121;
                z-index: 1;
                position: absolute;
                display: flex;
                align-items: center;
                justify-content: space-between;
                bottom: 0;
                left: 0;
                > div {
                  color: #ffffff;
                  font-weight: 500;
                }
                i {
                  cursor: pointer;
                }
              }
            }
            .control-text {
              height: calc(301px - 239px);
              > p {
                display: flex;
                padding: 5px 10px;
                i {
                  color: #D3D3D3;
                  margin-right: 5px;
                }
                .name {
                  color: #333333
                }
                .time {
                  color:#999999;
                }
              }
            }
          }
        }
        .control-page {
          padding: 5px 20px !important;
        }
      }
      .summary-header, .process-header, .handle-header {
        > span {
          display: inline-block;
          padding: 10px 20px;
          color: #333333;
          font-weight: 600;
          font-size: 16px;
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
      .handle-content {
        width: 100%;
        padding: 20px;
        > ul {
          > li {
            float: left;
            height: 30px;
            line-height: 30px;
            > div {
              .title {
                color: #666666;
              }
              .content {
                color: #0C70F8;
                cursor: pointer;
              }
              .status {
                color: #333333;
              }
            }
            &:nth-child(odd) {
              width: 30%;
            }
            &:nth-child(even) {
              width: 70%;
            }
          }
        }
      }
      .process-box {
        width: 100%;
        padding: 20px;
        .department{
          > p {
            color: #333333;
            font-weight: bold;
          }
          > ul {
            margin: 10px 0;
            li {
              color: #333333;
              height: 23px;
              line-height: 23px;
              span {
                margin-right: 8px;
              }
            }
          }
        }
        .process-list {
          > p {
            color: #333333;
            font-weight: bold;
          }
          > ul {
            margin: 10px 0;
            > li {
              display: flex;
              height: 100%;
              position: relative;
              .circle-left {
                margin-top: 3px;
                .big-circle {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  border: 1px solid #0C70F8;
                  .small-circle {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #0C70F8;
                    margin: 3px auto 0 auto;
                  }
                }
              }
              .line {
                width: 1px;
                height: calc(100% - 33px);
                position: absolute;
                left: 12px;
                top: 30px;
                bottom: 10px;
                background: #0C70F8;
              }
              .content-right {
                margin-left: 1%;
                font-size: 13px;
                .time {
                  color:#9D9D9D;
                  margin-bottom: 5px;
                }
                .content {
                  color: #333333;
                  margin-bottom: 5px;
                }
              }
              &:last-child .line {
                display: none;
              }
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
    height: 100%;;
    /deep/ .el-dialog {
      height: 100%;
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


