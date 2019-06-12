<template>
  <vue-scroll>
    <div class="ctc-detail-info">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/ctc' }">调度指挥</el-breadcrumb-item>
          <el-breadcrumb-item>调度详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <div class="basic_info">
          <div class="card-info">
            <div class="struc_c_d_qj struc_c_d_img">
              <img :src="sturcDetail.basePortraitInfo.photoUrl" alt="布控图" v-if="sturcDetail.objType == 1">
              <img :src="sturcDetail.vehicleInfo.vehicleImagePath" alt="布控图" v-if="sturcDetail.objType == 2">
              <img :src="sturcDetail.appendixInfo.path" alt="布控图" v-if="sturcDetail.objType == 3">
              <span>布控图</span>
            </div>
            <div class="struc_c_d_info">
              <h2>布控信息</h2>
              <template v-if="sturcDetail.objType == 1">
                <div class="struc_cdi_line control_line" v-if="sturcDetail.basePortraitInfo">
                  <span>{{sturcDetail.basePortraitInfo.name}}</span>
                  <span>{{sturcDetail.basePortraitInfo.sexStr}}</span>
                  <span>{{sturcDetail.basePortraitInfo.nationStr}}</span>
                </div>
                <div v-if="sturcDetail.basePortraitInfo.birthDate">
                  <div class="struc_cdu_line control_line">
                    <span>{{sturcDetail.basePortraitInfo.birthDate | fmTimestamp('yyyy-MM-dd')}}</span><span>出生日期</span>
                  </div>
                </div>
                <div v-if="sturcDetail.basePortraitInfo.idNo">
                  <div class="struc_cdu_line control_line">
                    <span>{{sturcDetail.basePortraitInfo.idNo}}</span><span>身份证号</span>
                  </div>
                </div>
                <div v-if="sturcDetail.basePortraitInfo.remarks">
                  <div class="struc_cdu_line control_line">
                    <span>{{sturcDetail.basePortraitInfo.remarks}}</span><span>备注信息</span>
                  </div>
                </div>
              </template>
              <template v-if="sturcDetail.objType == 2">
                <div class="struc_cdi_line control_line" v-if="sturcDetail.vehicleInfo">
                  <span>{{sturcDetail.vehicleInfo.vehicleNumber}}</span>
                  <span>{{sturcDetail.vehicleInfo.vehicleTypeStr}}</span>
                  <span v-if="sturcDetail.vehicleInfo.ownerName">{{sturcDetail.vehicleInfo.ownerName}}</span>
                </div>
                <div v-if="sturcDetail.vehicleInfo.ownerBirth">
                  <div class="struc_cdu_line control_line">
                    <span>{{sturcDetail.vehicleInfo.ownerBirth | fmTimestamp('yyyy-MM-dd')}}</span><span>出生日期</span>
                  </div>
                </div>
                <div v-if="sturcDetail.vehicleInfo.ownerIdCard">
                  <div class="struc_cdu_line control_line">
                    <span>{{sturcDetail.vehicleInfo.ownerIdCard}}</span><span>身份证号</span>
                  </div>
                </div>
                <div v-if="sturcDetail.vehicleInfo.desci">
                  <div class="struc_cdu_line control_line">
                    <span>{{sturcDetail.vehicleInfo.desci}}</span><span>备注信息</span>
                  </div>
                </div>
              </template>
              <template v-if="sturcDetail.surveillanceInfo">
                <div class="control_line"><span class="left">布控编号：</span><span class="right">{{sturcDetail.surveillanceInfo.surveillanceNo || '无'}}</span></div>
                <div class="control_line"><span class="left">布控名称：</span><span class="right">{{sturcDetail.surveillanceInfo.surveillanceName || '无'}}</span></div>
              </template>
              <template v-if="sturcDetail.eventInfo">
                <div class="control_line"><span class="left">事件编号：</span><span class="right">{{sturcDetail.eventInfo.eventCode || '无'}}</span></div>
                <div class="control_line"><span class="left">事件类型：</span><span class="right">{{ sturcDetail.eventInfo.eventType ? dicFormater( eventType, sturcDetail.eventInfo.eventType) :'无'}}</span></div>
                <div class="control_line"><span class="left">事件等级：</span><span class="right">{{ sturcDetail.eventInfo.eventLevel ? dicFormater( eventLevel, sturcDetail.eventInfo.eventLevel) : '无'}}</span></div>
                <div class="control_line"><span class="left">事件情况：</span><span class="right">{{sturcDetail.eventInfo.eventDetail || '无'}}</span></div>
              </template>
              <template v-if="!sturcDetail.eventInfo">
                <div class="control_line"><span class="left">事件编号：</span><span class="right">无</span></div>
                <div class="control_line"><span class="left">事件类型：</span><span class="right">无</span></div>
                <div class="control_line"><span class="left">事件等级：</span><span class="right">无</span></div>
                <div class="control_line"><span class="left">事件情况：</span><span class="right">无</span></div>
              </template>
            </div>
            <!-- <div class="event-status-img">
              <template v-if="sturcDetail.surveillanceInfo && sturcDetail.surveillanceInfo.surveillanceStatus === 3">
                <i class="vl_icon vl_icon_event_11"></i>
              </template>
              <template v-if="sturcDetail.surveillanceInfo && sturcDetail.surveillanceInfo.surveillanceStatus === 1">
                <i class="vl_icon vl_icon_event_13"></i>
              </template>
              <template v-if="sturcDetail.surveillanceInfo && sturcDetail.surveillanceInfo.surveillanceStatus === 2">
                <i class="vl_icon vl_icon_event_12"></i>
              </template>
            </div> -->
          </div>
          <div class="card-info right-info">
            <div class="struc_c_d_qj struc_c_d_img struc_mr">
              <img :src="sturcDetail.snapPhoto" alt="抓拍图">
              <span>抓拍图</span>
            </div>
            <div class="struc_c_d_info">
              <h2>抓拍信息
                <div class="box_grade_info"> 
                  <i class="vl_icon vl_icon_alarm_2" v-if="sturcDetail.alarmLevel == 1"></i>
                  <i class="vl_icon vl_icon_alarm_3" v-if="sturcDetail.alarmLevel == 2"></i>
                  <i class="vl_icon vl_icon_alarm_4" v-if="sturcDetail.alarmLevel == 3"></i>
                  <i class="vl_icon vl_icon_alarm_5" v-if="sturcDetail.alarmLevel == 4"></i>
                  <i class="vl_icon vl_icon_alarm_6" v-if="sturcDetail.alarmLevel == 5"></i>
                </div>
              </h2>
              <div class="struc_cdi_line" v-if="sturcDetail.alarmFeature">
                <span>{{sturcDetail.alarmFeature.featureName}}</span>
              </div>
              <div v-if="sturcDetail.snapTime">
                <div class="struc_cdu_line">
                  <span>{{sturcDetail.snapTime | fmTimestamp('yyyy-MM-dd HH:mm:ss')}}</span><span>抓拍时间</span>
                </div>
              </div>
              <div v-if="sturcDetail.devInfo">
                <div class="struc_cdu_line">
                  <span>{{sturcDetail.devInfo.deviceName}}</span><span>抓拍设备</span>
                </div>
              </div>
              <div v-if="sturcDetail.addressDesc">
                <div class="struc_cdu_line">
                  <span>{{sturcDetail.addressDesc}}</span><span>抓拍地址</span>
                </div>
              </div>
              <div v-if="sturcDetail.areaInfo">
                <div class="struc_cdu_line">
                  <span>{{sturcDetail.areaInfo.cname}}</span><span>区域名称</span>
                </div>
              </div>
              <div v-if="sturcDetail.eventInfo">
                <div class="struc_cdu_line">
                  <span>{{sturcDetail.eventInfo.eventCode}}</span><span>关联事件</span>
                </div>
              </div>
            </div>
            <span>相似度</span>
            <span>{{sturcDetail.semblance ? (sturcDetail.semblance).toFixed(2) : 0.00}}<span style="font-size: 12px;">%</span></span>
          </div>
        </div>
        <div class="event-ctc-content" v-if="sturcDetail.taskList && sturcDetail.taskList.length > 0">
          <div class="header">
            <p class="ctc-title">调度方案</p>
          </div>
          <div class="divide"></div>
          <ul class="content-list">
            <li v-for="(item, index) in sturcDetail.taskList" :key="'item' + index">
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
        <div class="summary" v-if="sturcDetail.eventInfo && sturcDetail.eventInfo.eventSummary">
          <div class="summary-header">
            <span>事件总结</span>
          </div>
          <div class="divide"></div>
          <div class="summary-content">
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
              <img v-for="(item, index) in eventImg" :src="item.path" :key="index">
            </div>
            <div class="divide"></div>
            <p style="margin-top: 5px;">事件总结内容</p>
            <div class="content_detail">
              <p>
                {{!!sturcDetail.eventInfo.eventSummary && sturcDetail.eventInfo.eventSummary}}
                <span v-show="eventSummaryLength > 3000" class="look_more" @click="showSummaryDialog('event', !!sturcDetail.eventInfo.eventSummary && sturcDetail.eventInfo.eventSummary)">更多...</span>
              </p>
            </div>
          </div>
        </div>
        <div class="summary" v-if="sturcDetail.eventInfo && sturcDetail.eventInfo.dispatchSummary">
          <div class="summary-header">
            <span>调度总结</span>
          </div>
          <div class="divide"></div>
          <div class="summary-content">
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
              <img v-for="(item, index) in ctcImg" :src="item.path" :key="index">
            </div>
            <div class="divide"></div>
            <p style="margin-top: 5px;">调度总结内容</p>
            <div class="content_detail">
              <p>
                {{sturcDetail.eventInfo.dispatchSummary}}
                <span v-show="dispatchSummaryLength > 3000" class="look_more" @click="showSummaryDialog('ctc', sturcDetail.eventInfo.dispatchSummary)">更多...</span>
              </p>
            </div>
          </div>
        </div>
        <div class="event-process" v-if="(sturcDetail.taskList && sturcDetail.taskList.length > 0) || (sturcDetail && sturcDetail.processingList && sturcDetail.processingList.length > 0)">
          <div class="header">
            <p class="ctc-title">事件进展</p>
          </div>
          <div class="divide"></div>
          <div class="process-box">
            <div class="department" v-show="sturcDetail.taskList && sturcDetail.taskList.length > 0">
              <p>参与部门</p>
              <ul>
                <li v-for="(item, index) in sturcDetail.taskList" :key="'item' + index">
                  <span>{{item.departmentName}}</span>
                  <span>{{item.createTime}}</span>
                  <span>{{item.taskStatusName}}</span>
                </li>
              </ul>
            </div>
            <div class="process-list" v-show="sturcDetail.processingList && sturcDetail.processingList.length > 0">
              <p>事件过程</p>
              <ul>
                <li v-for="(item, index) in sturcDetail.processingList" :key="index">
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
                        v-for="(itm, index) in item.sysAppendixInfoList"
                        :key="'item' + index"
                        :src="itm.src"
                        @click="openBigImg(index, item.sysAppendixInfoList)"
                      >
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="operation-footer">
        <template v-if="$route.query.status === 'ctc_ing'">
          <el-button class="operation_btn function_btn" @click="skipAgainCtcPage">再次调度</el-button>
          <el-button class="operation_btn back_btn" @click="skipCtcEndPage">结束调度</el-button>
        </template>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
      <BigImg :imgList="imgList1" :imgIndex='imgIndex' :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
    </div>
  </vue-scroll>
</template>
<script>
// import { getEventDetail } from '@/views/index/api/api.event.js';
import { getAlarmDetail } from "@/views/index/api/api.control.js";
import { updateProcess } from '@/views/index/api/api.event.js';
import BigImg from '@/components/common/bigImg.vue';
import { dataList } from '@/utils/data.js';
export default {
  components: { BigImg },
  data () {
    return {
      imgIndex: 0, // 点击的图片索引
      isShowImg: false, // 是否放大图片
      imgList1: [],
      // basicInfo: {}, // 事件详情
      eventImg: [], // 事件总结图片列表
      eventFile: [], // 事件总结文件列表
      ctcImg: [], // 调度总结图片列表
      ctcFile: [], // 调度总结文件列表
      summaryDetailDialog: false, // 查看总结详情弹出框
      summaryTitle: null, // 总结标题
      summaryContent: null, // 总结内容
      eventSummaryLength: 0,
      dispatchSummaryLength: 0,
      eventType: dataList.eventType,
      eventLevel: dataList.eventLevel,
      sturcDetail: {},
      isLoading: false
    }
  },
  mounted () {
    // this.getDetail();
    this.toAlarmDetail();
    if(this.$route.query.uid) {
      this.editProcessStatus();
    }
  },
  methods: {
    //修改事件处理过程状态
    editProcessStatus() {
      const uid = this.$route.query.uid;
      updateProcess(uid).then((res)=>{
        console.log(res)
      }).catch(()=>{})
    },
    // 跳至结束调度页面
    skipCtcEndPage () {
      let isRelationEvent;
      if (this.sturcDetail.eventInfo && this.sturcDetail.eventInfo.uid) {
        isRelationEvent = 1;
      } else {
        isRelationEvent = 0;
      }
      this.$router.push({name: 'ctc_end', query: { eventId: this.sturcDetail.eventInfo && this.sturcDetail.eventInfo.uid, type: 'alarm_ctc', isRelation: isRelationEvent, status: this.$route.query.status, objType: this.$route.query.objType}});
    },
    // 跳至再次调度页面
    skipAgainCtcPage () {
      this.$router.push({name: 'alarm_ctc_operation', query: { eventId: this.$route.query.id, status: this.$route.query.status, eventType: this.sturcDetail.eventInfo && this.sturcDetail.eventInfo.eventType, objType: this.$route.query.objType }});
    },
    //告警详情
    toAlarmDetail() {
      this.isLoading = true;
      const eventId = this.$route.query.id;
      getAlarmDetail(eventId).then( res => {
        this.sturcDetail = res.data;
        this.sturcDetail['objType'] = this.$route.query.objType;
        
        this.eventSummaryLength = !!this.sturcDetail.eventInfo.eventSummary && this.sturcDetail.eventInfo.eventSummary.length;
        this.dispatchSummaryLength = !!this.sturcDetail.eventInfo.dispatchSummary && this.sturcDetail.eventInfo.dispatchSummary.length;

        if (this.sturcDetail.eventInfo.closeAttachmentList && this.sturcDetail.eventInfo.closeAttachmentList.length > 0) {
          this.sturcDetail.eventInfo.closeAttachmentList.map(item => {
            if (item.cname.endsWith('.jpg') || item.cname.endsWith('.png') || item.cname.endsWith('.jpeg')) {
              this.eventImg.push(item);
            } else {
              this.eventFile.push(item);
            }
          })
        }
        if (this.sturcDetail.eventInfo.dispatchAttachmentList && this.sturcDetail.eventInfo.dispatchAttachmentList.length > 0) {
          this.sturcDetail.eventInfo.dispatchAttachmentList.map(item => {
            if (item.cname.endsWith('.jpg') || item.cname.endsWith('.png') || item.cname.endsWith('.jpeg')) {
              this.ctcImg.push(item);
            } else {
              this.ctcFile.push(item);
            }
          })
        }
        this.$nextTick(()=> {
          this.isLoading = false;
        })
      }).catch(() => {
        this.isLoading = false;
      })
    },
    // 图片放大传参
    // emitHandleImg (isShow, index) {
    //   this.openBigImg(index, this.sturcDetail.eventInfo.attachmentList);
    // },
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
    // 返回
    back () {
      this.$router.back(-1);
    }
  }
}
</script>
<style lang="scss">
@media screen and (min-width: 960px) and (max-width: 1119px) {html {font-size: 60px !important;}}
@media screen and (min-width: 1200px) and (max-width: 1439px) {html {font-size: 70px !important;}}
@media screen and (min-width: 1440px) and (max-width: 1679px) {html {font-size: 80px !important;}}
@media screen and (min-width: 1680px) and (max-width: 1919px) {html {font-size: 90px !important;}}
@media screen and (min-width: 1920px) {html {font-size: 100px !important;} }
</style>
<style lang="scss" scoped>
.ctc-detail-info {
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 100px;
    .basic_info {
      width: 100%;
      display: flex;
      .card-info {
        width: 49%;
        height: 4.4rem;
        background: #fff;
        box-shadow:12px 0px 27px 0px rgba(141,142,142,0.19);
        border-radius:1px;
        padding: .2rem .18rem;
        display: flex;
        margin-bottom: .2rem;
        position: relative;
        .event-status-img {
          position: absolute;
          right: 0;
          top: 0;
        }
        .struc_c_d_img {
          width: 4rem;
          height: 4rem;
          background: #EAEAEA;
          position: relative;
          img {
            width: 100%;
            height: auto;
            max-height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
          }
        }
        .struc_c_d_qj {
          &:before {
            display: block;
            content: '';
            position: absolute;
            top: -.5rem;
            left: -.5rem;
            transform: rotate(-45deg);
            border: .5rem solid #0c70f8;
            border-color: transparent transparent #0C70F8;
            z-index: 9;
          }
          span {
            display: block;
            position: absolute;
            top: .1rem;
            left: .1rem;
            width: .6rem;
            height: .6rem;
            text-align: center;
            color: #FFFFFF;
            font-size: .12rem;
            -webkit-transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            transform: rotate(-45deg);
            z-index: 99;
          }
        }
        .struc_mr {
          &:before {
            border: .5rem solid #50CC62;
            border-color: transparent transparent #50CC62;
          }
        }
        .struc_c_d_info {
          width: calc(100% - 4rem);
          padding-left: .4rem;
          color: #333333;
          h2 {
            font-weight: bold;
            padding-right: 1rem;
            font-size: .18rem;
            margin: .08rem 0 .28rem 0;
            position: relative;
            .vl_jfo_sim {
              color: #0C70F8;
              font-weight: bold;
              font-size: .24rem;
              float: right;
              i {
                vertical-align: text-bottom;
                margin-right: .1rem;
              }
              span {
                font-weight: normal;
              }
            }
            .box_grade_info {
              position: absolute;
              top: .02rem;
              left: .8rem;
            }
          }
          .struc_cdu_line {
            border: 1px solid #F2F2F2;
            border-radius: 3px;
            background-color: #FAFAFA;
            margin: 0 .1rem .1rem 0;
            display: inline-block;
            height: .34rem;
            line-height: .34rem;
            padding-left: .12rem;
            padding-right: .12rem;
            font-size: 12px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            span:nth-child(1) {
              padding-right: .12rem;
              border-right: 1px solid#F2F2F2;
            }
            span:nth-child(2) {
              padding-left: .12rem;
              color: #666;
            }
          }
          .struc_cdi_line {
            margin-bottom: .1rem;
            span {
              position: relative;
              max-width: 100%;
              display: inline-block;
              height: .34rem;
              line-height: .34rem;
              border: 1px solid #F2F2F2;
              background: #FAFAFA;
              color: #333333;
              border-radius:3px;
              font-size: 12px;
              padding: 0 .12rem;
              margin-right: .1rem;
              > i {
                vertical-align: middle;
                margin-left: .1rem;
              }
            }
          }
          .control_line {
            font-size: .12rem;
            height: .26rem;
            line-height: .26rem;
            span {
              height: .26rem;
              line-height: .26rem;
            }
            .left {
              color: #666;
              margin-right: .1rem;
            }
            .right {
              color: #222;
            }
          }
          .show_detail {
            position: relative;
            width: 3.38rem;
            display: flex;
            flex: 1;
            min-width: 0;
            .right {
              width: 48%;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1; //行数
              -webkit-box-orient: vertical;
            }
            .show_all {
              color: #0C70F8;
              cursor: pointer;
            }
            .show_detail_box {
              width:3.3rem;
              max-height:2.62rem;
              box-shadow:0px 1px 21px 0px rgba(97,97,97,0.2);
              border-radius:5px;
              position: absolute;
              color: #222222;
              padding: .2rem;
              bottom: 0;
              right: .1rem;
              background: #fff;
              span:nth-child(2) {
                color: #0C70F8;
                margin-left: .1rem;
              }
            }
          }
        }
      }
      .right-info {
        position: relative;
        margin-left: 2%;
        &:before {
          display: block;
          content: '';
          position: absolute;
          top: -.8rem;
          right: -.8rem;
          transform: rotate(-45deg);
          border: .8rem solid #0c70f8;
          border-color: transparent transparent transparent #0C70F8;
        }
        &:after {
          display: block;
          content: '';
          position: absolute;
          top: -.3rem;
          right: -.3rem;
          transform: rotate(-45deg);
          border: .3rem solid #FFFFFF;
          border-color: transparent transparent transparent #FFFFFF;
        }
        >span {
          display: block;
          position: absolute;
          top: .1rem;
          right: .1rem;
          width: 1rem;
          height: 1rem;
          text-align: center;
          color: #FFFFFF;
          font-size: .12rem;
          -webkit-transform: rotate(45deg);
          -moz-transform: rotate(45deg);
          -ms-transform: rotate(45deg);
          -o-transform: rotate(45deg);
          transform: rotate(45deg);
          z-index: 99;
          &:last-child {
            font-size: .24rem;
            top: .2rem;
            right: .2rem;
            font-weight: bold;
          }
        }
      }
    }
    .event-ctc-content, .judge_result, .event-process, .summary {
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
          .divide-list {
            width: 100%;
            height: 1px;
            margin: 10px 0;
            border-bottom: 1px dashed #F2F2F2;
            
          }
          &:last-child {
            .divide-list {
              display: none;
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
      .summary-content {
        padding: 10px 20px;
        >p:nth-child(2) {
          color: #000000;
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


