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
          <template v-if="eventFile && eventFile.length > 0">
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
          <template v-if="ctcFile && ctcFile.length > 0">
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
      <div class="control-result" v-show="isAllShowControl || controlList.length > 0">
        <div class="control-header">
          <div class="left">
            <span>布控结果 ({{controlList.length}}个)</span>
          </div>
          <div class="right">
            <el-date-picker
              v-model="dateTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleChangeTime"
            >
            </el-date-picker>
            <el-select v-model="devicesSearch" placeholder="请选择设备" clearable @change="handleChangeDevice">
              <el-option
                v-for="item in controlDeviceList"
                :key="item.uid"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="divide"></div>
        <template v-if="controlList && controlList.length > 0">
          <div class="control-content">
            <ul class="clearfix">
              <li v-for="(item, index) in controlList" :key="'item' + index">
                <div class="control-main">
                  <img :src="item.snapPhoto">
                  <div class="control-btn">
                    <div>{{item.deviceName}}</div>
                    <i class="vl_icon_event_15 vl_icon" @click="openVideo(item)"></i>
                  </div>
                </div>
                <div class="control-text">
                  <p>
                    <i class="vl_icon vl_icon_event_2"></i>
                    <span class="name">{{item.objName}}</span>
                  </p>
                  <p>
                    <i class="vl_icon vl_icon_event_3"></i>
                    <span class="time">{{item.snapTime}}</span>
                  </p>
                </div>
              </li>
            </ul>
            <el-pagination
              class="cum_pagination"
              @current-change="onPageChange"
              :current-page="pagination.pageNum"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="pagination.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="pagination.total">
            </el-pagination>
          </div>
        </template>
        <template v-else>
          <div class="judge_result_content">
            <div class="no_result">
              <i class="vl_icon vl_icon_event_16"></i>
              <span>暂无数据</span>
            </div>
          </div>
        </template>
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
      <el-button class="operation_btn function_btn" v-show="$route.query.status === 'handling'" @click="skipAgainHandlePage">再次处理</el-button>
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
    <!-- 视频全屏放大 -->
    <div style="width: 0; height: 0;" v-show="showLarge" :class="{vl_j_fullscreen: showLarge}">
      <video id="controlVideo" :src="videoDetail.snapVideo"></video>
      <div @click="closeVideo" class="vl_icon vl_icon_event_23 close_icon"></div>
      <div class="control_bottom">
        <div>{{videoDetail.deviceName}}</div>
        <div>
          <span @click="playLargeVideo(false)" class="vl_icon vl_icon_judge_01" v-show="isPlaying"></span>
          <span @click="playLargeVideo(true)" class="vl_icon vl_icon_control_09" v-show="!isPlaying"></span>
          <span @click="cutScreen" class="vl_icon vl_icon_control_07"></span>
          <span><a download="视频" :href="videoDetail.snapVideo" class="vl_icon vl_icon_event_26"></a></span>
        </div>
      </div>
    </div>
    <BigImg :imgList="imgList1" :imgIndex='imgIndex' :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
  </div>
</vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
import BigImg from '@/components/common/bigImg.vue';
import { getEventDetail } from '@/views/index/api/api.event.js';
import { getControlDevice, getEventControlResult } from '@/views/index/api/api.control.js';
export default {
  components: { EventBasic, BigImg },
  data () {
    return {
      isAllShowControl: false, // 是否显示布控结果列表
      controlList: [], // 布控结果列表
      pagination: { total: 0, pageSize: 8, pageNum: 1 },
      dateTime: [], // 搜索布控结果的起止时间
      devicesSearch: null, // 布控设备名称
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
      dispatchSummaryLength: 0,
      showLarge: false, // 全屏显示
      videoDetail: {}, // 播放视频的信息
      isPlaying: false, // 是否播放视频
      controlDeviceList: [], // 布控设备列表
    }
  },
  mounted () {
    this.getDevices();
    this.getControlResult();
    this.getDetail();
  },
  methods: {
    // 获取所有的布控设备
    getDevices () {
      getControlDevice()
        .then(res => {
          if (res) {
            this.controlDeviceList = res.data;
          }
        })
    },
    // 获取布控结果
    getControlResult () {
      if (this.dateTime === null) {
        this.dateTime = [];
      }
      if (this.devicesSearch === '') {
        this.devicesSearch = null;
      }
      const params = {
        'where.dateStart': this.dateTime[0],
        'where.dateEnd': this.dateTime[1],
        'where.deviceName': this.devicesSearch,
        eventId: this.$route.query.eventId,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      };
      getEventControlResult(params)
        .then(res => {
          if (res) {
            this.controlList = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    // change 布控设备
    handleChangeDevice () {
      this.isAllShowControl = true;
      this.getControlResult();
    },
    // change 起止时间
    handleChangeTime () {
      this.isAllShowControl = true;
      this.getControlResult();
    },
    // 点击视频播放按钮全屏播放视频
    openVideo (obj) {
      this.videoDetail = obj;
      this.showLarge = true;
    },
    // 关闭视频
    closeVideo () {
      this.showLarge = false;
      document.getElementById('controlVideo').pause();
    },
    // 播放视频
    playLargeVideo (val) {
       if (val) {
        this.isPlaying = true;
        document.getElementById('controlVideo').play();
        this.handleVideoEnd();
      } else {
        this.isPlaying = false;
        document.getElementById('controlVideo').pause();
      }
    },
    // 监听视频是否已经播放结束
    handleVideoEnd () {
      let _this = this;
      const obj = document.getElementById('controlVideo');
      if (obj) {
        obj.addEventListener('ended', () => { // 当视频播放结束后触发
          _this.isPlaying = false;
        });
      }
    },
    // 截屏
    cutScreen () {

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
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.getControlResult();
    },
    // 跳至结束事件页面
    skipEventEndPage () {
      this.$router.push({name: 'event_end', query: {id: this.$route.query.eventId}});
    },
    // 跳至查看互助页面
    skipCommentPage () {
      this.$router.push({path: '/message/help', query: {helpId: this.$route.query.eventId, pageType: 3}});
    },
    // 跳至查看布控详情页面
    skipControlPage () {
      this.$router.push({path: '/control/manage', query: { pageType: 2, state: 1, controlId: 1 }});
    },
    // 跳至查看调度指挥页面
    skipEventCtcDetailPage () {
      this.$router.push({name: 'event_ctc_detail', query: {status: this.$route.query.status, eventId: this.$route.query.eventId}});
    },
    // 跳至查看呈报内容
    skipReportDetailPage () {
      this.$router.push({name: 'report_detail', query: {eventId: this.$route.query.eventId}});
    },
    // 跳至再次处理页面
    skipAgainHandlePage () {
      this.$router.push({name: 'untreat_event_detail', query: {eventId: this.$route.query.eventId, status: this.$route.query.status, type: 'again'}});
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
      .judge_result_content {
        width: 100%;
        .no_result {
          height: 100px;
          line-height: 100px;
          display: flex;
          align-items: center;
          margin-left: 45%;
          >span {
            margin-left: 10px;
            color: #999999;
            font-size: 16px;
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
.vl_j_fullscreen {
  position: fixed;
  width: 100% !important;
  height: 100% !important;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #000000;
  z-index: 9999;
  -webkit-transition: all .4s;
  -moz-transition: all .4s;
  -ms-transition: all .4s;
  -o-transition: all .4s;
  transition: all .4s;
  > video {
    width: 100%;
    height: 100%;
  }
  > .control_bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 48px;
    background: rgba(0, 0, 0, .65);
    > div {
      float: left;
      width: 50%;
      height: 100%;
      line-height: 48px;
      text-align: right;
      padding-right: 20px;
      color: #FFFFFF;
      &:first-child {
        text-align: left;
        padding-left: 20px;
      }
      > span {
        display: inline-block;
        height: 22px;
        margin-left: 10px;
        vertical-align: middle;
        cursor: pointer;
        a {
          font-size: 25px;
          text-decoration: none;
          color: #ffffff;
          vertical-align: top;
        }
      }
    }
  }
}
.close_icon {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 1000;
  cursor: pointer;
}
</style>


