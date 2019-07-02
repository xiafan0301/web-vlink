<template>
  <vue-scroll>
    <div class="plan-detail">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
         <template v-if="$route.query.type === 'ctc'">
            <el-breadcrumb-item :to="{ path: '/event/ctc' }">调度指挥</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/event/ctcDetailInfo', query: {id: $route.query.eventId, status: $route.query.status} }">调度详情</el-breadcrumb-item>
          </template>
          <template v-else-if="$route.query.type === 'alarm_ctc'">
            <el-breadcrumb-item :to="{ path: '/event/ctc' }">调度指挥</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/event/alarmCtcDetailInfo', query: { id: $route.query.alarmId, status: $route.query.status, objType: $route.query.objType }}">调度详情</el-breadcrumb-item>
          </template>
          <template v-else>
            <el-breadcrumb-item :to="{ path: '/event/manage' }">事件处理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/event/treatingEventDetail', query: {eventId: $route.query.eventId, status: $route.query.status} }">事件详情</el-breadcrumb-item>
          </template>
          <el-breadcrumb-item>预案详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <ul>
          <li>
            <span>预案名称:</span>
            <span>{{planDetailInfo.planName}}</span>
          </li>
          <li>
            <span>预案类型:</span>
            <span>{{planDetailInfo.eventTypeName}}</span>
          </li>
          <li>
            <span>适用事件等级:</span>
            <span>
              <template v-if='planDetailInfo.levelList'>
                <span v-for="(item, index) in planDetailInfo.levelList" :key="index">
                  {{item.planLevelName + ' '}}
                </span>
              </template>
            </span>
          </li>
          <li>
            <span>预案正文:</span>
            <span>{{planDetailInfo.planDetail}}</span>
          </li>
          <li>
            <span>附件:</span>
            <span style="display:flex;align-items:center;">
              <template v-if="planDetailInfo.sysAppendixInfo">
                <i class="vl_icon vl_icon_event_5"></i>
                {{planDetailInfo.sysAppendixInfo.cname}}
                <i class="vl_icon vl_icon_event_6" @click="downloadFile(planDetailInfo.sysAppendixInfo.path)" style="margin-left:5px;cursor:pointer;"></i>
              </template>
              <template v-else>
                无
              </template>
            </span>
          </li>
          <li>
            <span>响应处置:</span>
            <div class="res-list">
              <div class="list-detail" v-for="(item, index) in planDetailInfo.taskList" :key="index">
                <div>
                  <span>协同部门：</span>
                  <span>{{item.departmentName}}</span>
                </div>
                <div>
                  <span>任务名称：</span>
                  <span>{{item.taskName}}</span>
                </div>
                <div>
                  <span>任务内容：</span>
                  <span>{{item.taskContent}}</span>
                </div>
              </div>
            </div>
          </li>
          <li>
            <span>创建用户:</span>
            <span>{{planDetailInfo.createUserName}}</span>
          </li>
          <li>
            <span>创建时间:</span>
            <span>{{planDetailInfo.createTime}}</span>
          </li>
        </ul>
      </div>
      <div class="operation-footer">
        <el-button class="operation_btn function_btn" @click="skipReplanPage">启用</el-button>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
    </div>
  </vue-scroll>
</template>
<script>
import { getPlanDetail } from '@/views/index/api/api.event.js';
export default {
  data () {
    return {
      planDetailInfo: {} // 预案详情
    }
  },
  mounted () {
    this.getPlanDetailInfo();
  },
  methods: {
    // 获取预案详情
    getPlanDetailInfo () {
      const planId = this.$route.query.planId;
      if (planId) {
        getPlanDetail(planId)
          .then(res => {
            if (res && res.data) {
              this.planDetailInfo = res.data;
            }
          })
          .catch(() => {})
      }
    },
    // 下载文件
    downloadFile (url) {
      if (url) {
        window.open(url);
      }
    },
    // 跳至启用预案页面
    skipReplanPage () {
      this.$router.push({name: 'enable_plan', query: {alarmId: this.$route.query.alarmId, eventId: this.$route.query.eventId, planId: this.$route.query.planId, type: 'alarm_ctc', status: this.$route.query.status, objType: this.$route.query.objType}});
    },
    // 返回
    back () {
      this.$router.back(-1);
    }
  }
}
</script>
<style lang="scss" scoped>
.plan-detail {
  width: 100%;
  .content-box {
    width: 98%;
    margin: 0 20px;
    margin-bottom: 100px;
    box-shadow: 5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius: 4px;
    background-color: #ffffff;
    > ul {
      padding: 20px;
      width: 100%;
      > li {
        line-height: 35px;
        display: flex;
        > span:nth-child(1) {
          width: 100px;
          text-align: right;
          color: #666666;
          display: inline-block;
          margin-right: 10px;
        }
        > span:nth-child(2) {
          width: 50%;
          display: inline-block;
          color: #333333;
        }
        .res-list {
          width: 50%;
          .list-detail {
            width: 100%;
            background-color: #FAFAFA;
            padding: 10px;
            color: #333333;
            margin-bottom: 10px;
            > div {
              color: #333333;
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

