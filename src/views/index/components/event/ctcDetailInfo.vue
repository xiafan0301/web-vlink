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
        <EventBasic :status="$route.query.status"></EventBasic>
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
        <div class="judge_result">
          <div class="header">
            <p class="ctc-title">研判结果</p>
          </div>
          <div class="divide"></div>
          <div class="judge_result_content">
            <div class="no_result">
              <i class="vl_icon vl_icon_event_16"></i>
              <span>暂无数据</span>
            </div>
          </div>
        </div>
        <div class="summary">
          <div class="header">
            <p class="ctc-title">调度总结</p>
          </div>
          <div class="divide"></div>
          <div class="summary-content">
            <p class="content-icon"><i class="vl_icon vl_icon_event_1"></i></p>
            <p>调度总结报告</p>
          </div>
        </div>
        <div class="event-process">
          <div class="header">
            <p class="ctc-title">事件进展</p>
          </div>
          <div class="divide"></div>
          <div class="process-box">
            <div class="department">
              <p>参与部门</p>
              <ul>
                <li>
                  <span>消防部</span>
                  <span>06-25 13:00</span>
                  <span>未处理</span>
                </li>
                <li>
                  <span>公安部</span>
                  <span>06-25 13:00</span>
                  <span>处理中</span>
                </li>
                <li>
                  <span>应急指挥部</span>
                  <span>06-25 13:00</span>
                  <span>处理完毕</span>
                </li>
              </ul>
            </div>
            <div class="process-list">
              <p>事件过程</p>
              <ul>
                <li>
                  <div class='circle-left'>
                    <div class='big-circle'>
                      <div class='small-circle'></div>
                    </div>
                  </div>
                  <div class='line'></div>
                  <div class="content-right">
                    <div class='content'>应急指挥中心派单给消防办（操作人：张东）</div>
                    <div class='time'>2019-01-17 11:57</div>
                    <div style="width:100%;margin-top:10px;">
                      <img style="margin-right: 5px;" src="../../../../assets/img/temp/vis-eg.png" alt="">
                      <img style="margin-right: 5px;" src="../../../../assets/img/temp/vis-eg.png" alt="">
                      <img style="margin-right: 5px;" src="../../../../assets/img/temp/vis-eg.png" alt="">
                      <img style="margin-right: 5px;" src="../../../../assets/img/temp/vis-eg.png" alt="">
                      <img style="margin-right: 5px;" src="../../../../assets/img/temp/vis-eg.png" alt="">
                      <img style="margin-right: 5px;" src="../../../../assets/img/temp/vis-eg.png" alt="">
                      <img style="margin-right: 5px;" src="../../../../assets/img/temp/vis-eg.png" alt="">
                      <img style="margin-right: 5px;" src="../../../../assets/img/temp/vis-eg.png" alt="">
                      <img style="margin-right: 5px;" src="../../../../assets/img/temp/vis-eg.png" alt="">
                      <img style="margin-right: 5px;" src="../../../../assets/img/temp/vis-eg.png" alt="">
                      <!-- <div class='img-list' style="width:auto" :id="'proImgs'+ index"></div> -->
                    </div>
                  </div>
                </li>
                <li>
                  <div class='circle-left'>
                    <div class='big-circle'>
                      <div class='small-circle'></div>
                    </div>
                  </div>
                  <div class='line'></div>
                  <div class="content-right">
                    <div class='content'>应急指挥中心派单给消防办（操作人：张东）</div>
                    <div class='time'>2019-01-17 11:57</div>
                    <div style="width:100%;margin-top:10px;">
                      <img src="../../../../assets/img/temp/vis-eg.png" alt="">
                      <img src="../../../../assets/img/temp/vis-eg.png" alt="">
                      <img src="../../../../assets/img/temp/vis-eg.png" alt="">
                      <img src="../../../../assets/img/temp/vis-eg.png" alt="">
                      <img src="../../../../assets/img/temp/vis-eg.png" alt="">
                      <!-- <div class='img-list' style="width:auto" :id="'proImgs'+ index"></div> -->
                    </div>
                  </div>
                </li>
                <li>
                  <div class='circle-left'>
                    <div class='big-circle'>
                      <div class='small-circle'></div>
                    </div>
                  </div>
                  <div class='line'></div>
                  <div class="content-right">
                    <div class='content'>应急指挥中心派单给消防办（操作人：张东）</div>
                    <div class='time'>2019-01-17 11:57</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="operation-footer">
        <el-button class="operation_btn function_btn">再次调度</el-button>
        <el-button class="operation_btn back_btn" @click="skipCtcEndPage">结束调度</el-button>
        <el-button class="operation_btn back_btn">返回</el-button>
      </div>
    </div>
  </vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
export default {
  components: { EventBasic },
  data () {
    return {

    }
  },
  methods: {
    // 跳至结束调度页面
    skipCtcEndPage () {
      this.$router.push({name: 'ctc_end'});
    },
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


