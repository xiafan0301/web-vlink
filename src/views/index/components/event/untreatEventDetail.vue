<template>
  <vue-scroll>
    <div class="untreat-detail">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/manage' }">事件处理</el-breadcrumb-item>
          <el-breadcrumb-item>事件详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <EventBasic :status="$route.query.status" :basicInfo="basicInfo" @emitHandleImg="emitHandleImg"></EventBasic>
        <div class="event-handle">
          <div class="event-handle-header">
            <span>{{$route.query.type && $route.query.type === 'again' ? '再次处理事件' : '处理事件'}}</span>
          </div>
          <div class="divide"></div>
          <div class="handle-content">
            <div class="mutual">
              <p class="title">是否发布民众互助:</p>
              <el-radio-group v-model="isMutual" :disabled="basicInfo.mutualFlag && basicInfo.mutualFlag ? true : false">
                <el-radio :label="false">不发布</el-radio>
                <el-radio :label="true">发布</el-radio>
              </el-radio-group>
              <div v-show="isMutual && isShowMutual">
                <span>是否推送消息给附近的用户：</span>
                <el-select  placeholder="请选择推送距离" size="mini" style='width: 200px' v-model="radiusNumber">
                  <el-option
                    v-for="item in distanceList"
                    :key="item.uid"
                    :label="item.enumValue"
                    :value="item.enumField"
                  >
                  </el-option>
                </el-select>
                <p v-show="isShowError" style="color:#F56C6C;font-size:12px;">请选择推送距离</p>
              </div>
            </div>
            <div class="handle-type">
              <p class="title">请选择处理方式:</p>
              <el-radio-group v-model="handleType">
                <el-radio :label="1">
                  <span class="content">智能布控</span>
                  <span class="tip">（在监控设备上做布控，发现情况会自动告警提醒）</span>
                </el-radio>
                <el-radio :label="2">
                  <span class="content">调度指挥</span>
                  <span class="tip">（调度协调其他部门协调解决）</span>
                </el-radio>
                <el-radio :label="3">
                  <span class="content">呈报上级</span>
                  <span class="tip">（处理不了的事件可以向上级呈报）</span>
                </el-radio>
                <el-radio :label="4">
                  <span class="content">转到其他单位</span>
                  <span class="tip">（不属于本单位处理的事件可以转到其它单位处理）</span>
                </el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </div>
      <div class="operation-footer">
        <el-button class="operation_btn function_btn" :disabled="isDisabled" @click="skipEachPage">确定</el-button>
        <el-button class="operation_btn function_btn" @click="skipEventEndPage">结束事件</el-button>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
      <BigImg :imgList="imgList1" :imgIndex='imgIndex' :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
    </div>
  </vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
import { getEventDetail, updateEvent } from '@/views/index/api/api.event.js';
import { getDiciData } from '@/views/index/api/api.js';
import BigImg from '@/components/common/bigImg.vue';
import { dataList, operationType } from '@/utils/data.js';
export default {
  components: { EventBasic, BigImg },
  data () {
    return {
      status: null, // 
      isMutual: false, // 是否发布民众互助
      handleType: null, // 选择处理的方式
      imgIndex: 0, // 点击的图片索引
      isShowImg: false, // 是否放大图片
      imgList1: [],
      basicInfo: {}, // 事件详情
      radiusNumber: null, // 推送距离
      isDisabled: true, 
      isShowMutual: true, // 是否显示推送距离，，如果是已经发布过的则不显示
      isDisabledMutual: false, // 是否禁用民众互助选择
      isShowError: false,
      distanceList: [], // 推送距离
    }
  },
  watch: {
    handleType (val) {
      if (!val && !this.isMutual) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
    },
    isMutual (val) {
      if (!val) {
        this.radiusNumber = null;
      }
      if (!val && !this.handleType) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
    }
  },
  mounted () {
    this.getDetail();
    this.getDistanceList();
  },
  methods: {
    // 获取推送距离
    getDistanceList () {
      const distanceId = dataList.distanceId;
      getDiciData(distanceId)
        .then(res => {
          if (res) {
            this.distanceList = res.data;
          }
        });
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
           if (this.basicInfo.mutualFlag) {
             this.isMutual = true;
             this.isShowMutual = false;
           }
          }
        })
        .catch(() => {})
    },
    // 跳至结束事件页面
    skipEventEndPage () {
      this.$router.push({name: 'event_end', query:{ id: this.$route.query.eventId, status: this.$route.query.status }});
    },
    // 确定---跳页面
    skipEachPage () {
      const type = this.handleType;
      const eventId = this.$route.query.eventId;
      if (!this.basicInfo.mutualFlag) {
        if (this.isMutual && !this.radiusNumber) {
          this.isShowError= true;
          return;
        }
      }
      const params = {
        uid: eventId,
        type: type === 4 ? operationType.sendOtherUint : operationType.changeEvent, // 操作类型
        mutualFlag: this.isMutual,
        dealType: this.handleType || null, // 处理方式
        radius: this.radiusNumber || null
      }
      updateEvent(params)
        .then(res => {
          if (res) {
            if (this.isMutual && !this.handleType) {
              this.$router.push({name: 'treating_event_detail', query: {status: 'handling', eventId: eventId}});
            } else {
               if (type) {
                  if (type === 1) {
                    if (this.basicInfo.surveillanceId) { // surveillanceStatus：布控状态  1--进行中 2--待开始  3--已结束
                      if (this.basicInfo.surveillanceStatus === 2 || this.basicInfo.surveillanceStatus === 1) {
                        // 跳至布控详情页面
                        this.$router.push({path: '/control/manage', query: { pageType: 2, controlId: this.basicInfo.surveillanceId }});
                      } else {
                        // 跳至新增布控页面
                        this.$router.push({name: 'control_add', query: { eventId: eventId }});
                      }
                    } else {
                      // 跳至新增布控页面
                      this.$router.push({name: 'control_add', query: { eventId: eventId }});
                    }
                    
                  }
                  if (type === 2) {
                    // 跳至事件管理调度指挥页面
                    this.$router.push({name: 'ctc_operation', query: {eventId: eventId, eventType: this.basicInfo.eventType}});
                  }
                  if (type === 3) {
                    // 跳至呈报上级页面
                    this.$router.push({name: 'event_report', query: {eventId: eventId, status: this.$route.query.status}});
                  }
                  if (type === 4) {
                    // 跳至转到其他单位页面
                    this.$router.push({name: 'send_other_units', query: {eventId: eventId, status: this.$route.query.status}});
                  }
                }
            }
          }
        }) 
    },
    // 返回
    back () {
      this.$router.back(-1);
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
.untreat-detail {
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 100px;
    .event-handle {
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
      .header {
        padding: 10px 20px 0 20px;
        > p {
          color: #333333;
          font-size: 16px;
          font-weight: 600;
        }
      }
      .event-handle-header {
        > span {
          display: inline-block;
          padding: 10px 20px;
          color: #333333;
          font-weight: 600;
          font-size: 16px;
        }
      }
      .handle-content {
        width: 100%;
        padding: 10px 20px;
        .mutual, .handle-type {
          margin-bottom: 10px;
          .title {
            color: #333333;
            font-weight: bold;
          }
          /deep/ .el-radio-group {
            display: flex;
            flex-direction: column;
          }
          /deep/ .el-radio+.el-radio {
            margin-left: 0;
          }
          /deep/ .el-radio {
            color: #333333;
            line-height: 30px;
          }
          .content {
            color: #333333;
          }
          .tip {
            color: #999999;
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


