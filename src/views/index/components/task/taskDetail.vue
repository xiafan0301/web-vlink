<template>
  <vue-scroll>
    <div class="ctc-detail-info" v-loading="isLoading">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/task/list' }">全部任务</el-breadcrumb-item>
          <el-breadcrumb-item>{{ dicFormater( taskType, processType)}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box" v-if="basicInfo">
        <EventBasic :status="$route.query.status" :basicInfo="basicInfo" @emitHandleImg="emitHandleImg"></EventBasic>
        <div class="event-ctc-content">
          <div class="header">
            <p class="ctc-title">{{processType == 2 ? '任务内容' : processType == 3 ? '呈报内容' : '调度方案'}}</p>
          </div>
          <div class="divide"></div>
          <ul class="content-list" v-if="(basicInfo.taskList && basicInfo.taskList.length > 0) || (basicInfo.processingList && basicInfo.processingList.length > 0)">
            <template v-if="(processType == 2 || processType == 3) && (basicInfo.processingList && basicInfo.processingList.length > 0)">
              <li class="task-row">{{processContent}}</li>
            </template>
            <template v-else>
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
            </template>
          </ul>
          <div class="judge_result_content" v-else>
            <div class="no_result">
              <i class="vl_icon vl_icon_event_16"></i>
              <span>暂无数据</span>
            </div>
          </div>
        </div>
        <div class="event-process">
          <div class="header">
            <p class="ctc-title">事件进展</p>
          </div>
          <div class="divide"></div>
          <div class="process-box" v-if="(basicInfo.taskList && basicInfo.taskList.length > 0) || (basicInfo.processingList && basicInfo.processingList.length > 0)">
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
                        v-for="(itm, index) in item.sysAppendixInfoList"
                        :key="'item' + index"
                        :src="itm.thumbnailPath"
                        @click="openBigImg(index, item.sysAppendixInfoList)"
                      >
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="judge_result_content" v-else>
            <div class="no_result">
              <i class="vl_icon vl_icon_event_16"></i>
              <span>暂无数据</span>
            </div>
          </div>
        </div>
      </div>
      <div class="operation-footer">
        <el-button class="operation_btn back_btn" @click="skipCtcEndPage">
            {{processType == 2 ? '去处理' : processType == 3 ? '去处理': '反馈情况'}}
        </el-button>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
      <BigImg :imgList="imgList1" :imgIndex='imgIndex' :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
    </div>
  </vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
import { getEventDetail, updateProcess } from '@/views/index/api/api.event.js';
import BigImg from '@/components/common/bigImg.vue';
import { dataList } from '@/utils/data.js';
export default {
  components: { EventBasic, BigImg },
  data () {
    return {
      imgIndex: 0, // 点击的图片索引
      isShowImg: false, // 是否放大图片
      imgList1: [],
      basicInfo: {}, // 事件详情
      isLoading: false,
      processType: null,
      taskType: dataList.taskType,
      processContent: '',
      opUserId: null,
    }
  },
  mounted () {
    this.processType = this.$route.query.processType
    this.getDetail();
    this.editProcessStatus();
  },
  methods: {
    // 跳至反馈情况页面
    skipCtcEndPage () {
      this.$router.push({name: 'task_handle', query: { eventId: this.$route.query.id, processType: this.$route.query.processType, opUserId: this.opUserId, dispatchType:this.$route.query.dispatchType }});
    },
    //修改事件处理过程状态
    editProcessStatus() {
      const uid = this.$route.query.uid;
      updateProcess(uid).then((res)=>{
        console.log(res)
      }).catch(()=>{})
    },
    // 获取事件详情
    getDetail () {
      const eventId = this.$route.query.id;
      this.isLoading = true;
      getEventDetail(eventId)
        .then(res => {
          if (res.data) {
            this.basicInfo = res.data;
            if(this.basicInfo.processingList && this.basicInfo.processingList.length > 0) {
              for(let item of this.basicInfo.processingList) {
                if(item.uid == this.$route.query.uid) {
                  this.opUserId = item.opUserId
                  this.processContent = item.processContent
                  break;
                }
              }
            }
          }
          this.$nextTick(() => {
              this.isLoading = false
          })
        })
        .catch(() => {
            this.isLoading = false
        })
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
    // 返回
    back () {
      this.$router.back(-1);
    }
  }
}
</script>
<style lang="scss" scoped>
.ctc-detail-info {
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 100px;
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
        .task-row {
          margin: 10px 0;
        }
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


