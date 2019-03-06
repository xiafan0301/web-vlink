<template>
  <vue-scroll>
    <div class="event-ctc-detail">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/event/treatingEventDetail' }">事件详情</el-breadcrumb-item>
          <el-breadcrumb-item>查看调度指挥</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <EventBasic :status="$route.query.status" :basicInfo="basicInfo"></EventBasic>
        <div class="event-ctc-content">
          <div class="header">
            <p class="ctc-title">调度指挥方案</p>
          </div>
          <div class="divide"></div>
          <ul class="content-list">
            <li>
              <div>
                <span>调度部门：</span>
                <span>消防部</span>
              </div>
              <div>
                <span>任务名称：</span>
                <span>灭火</span>
              </div>
              <div class="ctc-content">
                <span>任务内容：</span>
                <span>园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火
                  园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园
                  区门口有电动车起火园区门口有电动
                  车起火园区门口有电动车起火园区门口有电动车起火事件情况文字达到140字的行数。
                </span>
              </div>
            </li>
            <div class="divide-list"></div>
            <li>
              <div>
                <span>调度部门：</span>
                <span>消防部</span>
              </div>
              <div>
                <span>任务名称：</span>
                <span>灭火</span>
              </div>
              <div class="ctc-content">
                <span>任务内容：</span>
                <span>园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火
                  园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园
                  区门口有电动车起火园区门口有电动
                  车起火园区门口有电动车起火园区门口有电动车起火事件情况文字达到140字的行数。
                </span>
              </div>
            </li>
            <div class="divide-list"></div>
            <li>
              <div>
                <span>调度部门：</span>
                <span>消防部</span>
              </div>
              <div>
                <span>任务名称：</span>
                <span>灭火</span>
              </div>
              <div class="ctc-content">
                <span>任务内容：</span>
                <span>园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火
                  园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园
                  区门口有电动车起火园区门口有电动
                  车起火园区门口有电动车起火园区门口有电动车起火事件情况文字达到140字的行数。
                </span>
              </div>
            </li>
            <div class="divide-list"></div>
            <li>
              <div>
                <span>调度部门：</span>
                <span>消防部</span>
              </div>
              <div>
                <span>任务名称：</span>
                <span>灭火</span>
              </div>
              <div class="ctc-content">
                <span>任务内容：</span>
                <span>园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火
                  园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园
                  区门口有电动车起火园区门口有电动
                  车起火园区门口有电动车起火园区门口有电动车起火事件情况文字达到140字的行数。
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="operation-footer">
        <template v-if="$route.query.status !== 'ending'">
          <el-button class="operation_btn function_btn">再次调度</el-button>
          <el-button class="operation_btn back_btn">结束调度</el-button>
        </template>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
    </div>
  </vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
import { getEventDetail } from '@/views/index/api/api.js';
export default {
  components: { EventBasic },
  data () {
    return {
      basicInfo: {
        eventCode: 'XD111111111111111',
        eventTypeName: '自然灾害',
        eventLevelName: 'V级',
        reportTime: '2019-03-12',
        reporterPhone: '18076543210',
        eventAddress: '湖南省长沙市天心区创谷产业工业园',
        casualties: -1,
        eventDetail: '爱丽丝的煎熬了就爱上邓丽君爱上了的就爱上了大家看ask啦撒赖扩大就阿斯顿卢卡斯爱上了卡盎司伦敦快乐打卡是卡拉卡斯底库；啊撒扩大；扩大卡的可撒赖打开撒爱上了打开奥昇卡是；啊撒扩大；爱上了底库；案例的伤口看了',
      }, // 事件详情
    }
  },
  methods: {
    // 返回
    back () {
      this.$router.back(-1);
    },
    // 获取事件详情
    getDetail () {
      const eventId = '';
      getEventDetail(eventId)
        .then(res => {
          if (res) {
            this.basicInfo = res.data;
          }
        })
        .catch(() => {})
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
    .event-ctc-content {
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
        }
        .divide-list {
          width: 100%;
          height: 1px;
          margin: 10px 0;
          border-bottom: 1px dashed #F2F2F2;
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


