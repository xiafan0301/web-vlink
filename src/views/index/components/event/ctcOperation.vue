<template>
<vue-scroll>
  <div class="ctc-operation">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/event/treatingEventDetail' }">事件详情</el-breadcrumb-item>
        <el-breadcrumb-item>调度指挥</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-box">
      <EventBasic :basicInfo="basicInfo"></EventBasic>
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
      <div class="ctc-plan-box">
        <div class="plan-box">
          <div class="plan-operation-box">
            <div class="plan-title">
              <span>推荐预案</span>
              <span @click="skipMorePlan">更多预案</span>
            </div>
            <div class="divide"></div>
            <div class="table_box">
              <vue-scroll>
                <el-table
                  class="plan_table"
                  :data="planList"
                  >
                  <el-table-column
                    label="序号"
                    type="index"
                    >
                  </el-table-column>
                  <el-table-column
                    label="预案名称"
                    prop="planName"
                    show-overflow-tooltip
                    >
                  </el-table-column>
                  <el-table-column
                    label="预案类型"
                    prop="planType"
                    show-overflow-tooltip
                    >
                  </el-table-column>
                  <el-table-column
                    label="适用事件等级"
                    prop="eventLevel"
                    show-overflow-tooltip
                    >
                  </el-table-column>
                  <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                      <span class="operation_btn" @click="skipSelectPlanPage(scope.row)">查看</span>
                      <span style="color: #f2f2f2">|</span>
                      <span class="operation_btn" @click="skipReplanPage(scope.row)">启用</span>
                    </template>
                  </el-table-column>
                </el-table>
              </vue-scroll>
            </div>
          </div>
          <div class="plan-list" v-for="(item, index) in taskList" :key="index">
            <div class="main-content">
              <div class="title">
                <span>调度指挥方案</span>
                <i class="vl_icon vl_icon_event_7" @click="deletePlanBox(index)" v-show="taskList.length > 1"></i>
              </div>
              <div class="divide"></div>
              <div class="plan-form-box">
                <el-form class="plan-form" label-width="90px" :model="item"  size="middle">
                  <el-form-item label="执行部门:"  :rules ="[{ required: true, message: '请选择执行部门', trigger: 'blur' }]">
                    <el-select v-model="item.departmentId" placeholder="请选择执行部门">
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="任务名称:" :rules ="[{ required: true, message: '请输入任务名称', trigger: 'blur' }]">
                    <el-input v-model="item.taskName"></el-input>
                  </el-form-item>
                  <el-form-item label="任务内容:" :rules ="[{ required: true, message: '请输入任务内容', trigger: 'blur' }]">
                    <el-input type="textarea" rows="8" v-model="item.taskContent"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <template v-if="taskList.length === (index + 1)">
              <div class="add-ctc" @click="addTask('form' + index)">
                <i class="vl_icon vl_icon_event_8"></i>
                <span>调度指挥任务添加</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn function_btn" @click="onSubmit">确定</el-button>
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
      taskList: [
        {
          departmentName: null,
          taskName: null,
          taskContent: null,
          departmentId: null
        }
      ],
       planList: [
        {
          planName: '公共区域消防安全应急预案公共区域消防安全应急预案',
          planType: '事故灾难',
          eventLevel: 'IV级（一般）、V级（较大）'
        },
        {
          planName: '公共区域消防安全应急预案公共区域消防安全应急预案',
          planType: '事故灾难',
          eventLevel: 'IV级（一般）、V级（较大）'
        },
        {
          planName: '公共区域消防安全应急预案公共区域消防安全应急预案',
          planType: '事故灾难',
          eventLevel: 'IV级（一般）、V级（较大）'
        },
        {
          planName: '公共区域消防安全应急预案公共区域消防安全应急预案',
          planType: '事故灾难',
          eventLevel: 'IV级（一般）、V级（较大）'
        },
        {
          planName: '公共区域消防安全应急预案公共区域消防安全应急预案',
          planType: '事故灾难',
          eventLevel: 'IV级（一般）、V级（较大）'
        },
        {
          planName: '公共区域消防安全应急预案公共区域消防安全应急预案',
          planType: '事故灾难',
          eventLevel: 'IV级（一般）、V级（较大）'
        },
        {
          planName: '公共区域消防安全应急预案公共区域消防安全应急预案',
          planType: '事故灾难',
          eventLevel: 'IV级（一般）、V级（较大）'
        },
        {
          planName: '公共区域消防安全应急预案公共区域消防安全应急预案',
          planType: '事故灾难',
          eventLevel: 'IV级（一般）、V级（较大）'
        },
        {
          planName: '公共区域消防安全应急预案公共区域消防安全应急预案',
          planType: '事故灾难',
          eventLevel: 'IV级（一般）、V级（较大）'
        }
      ] // 表格数据
    }
  },
  methods: {
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
    // 判断taskList是否都填写完
    judgeData () {
      let _this = this;
      return new Promise((resolve, reject) => {
        let arr = [];
        _this.taskList.map((item, index) => {
          if (!item.departmentId || !item.taskName || !item.taskContent) {
            arr.push(index); // 将没有填写完的内容的item存到一个数组中
            this.$message({
              type:'warning',
              message: '请先填写完内容',
              customClass: 'request_tip'
            })
          }
        })
        if (arr.length > 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      })
    },
    // 提交数据
    onSubmit () {
      let _this = this;
      _this.judgeData().then(result => {
        console.log(result);
        if (result === false) {
          console.log('未填完')
        } else {
          console.log('已填完');
        }
      })
    },
    addTask (form) {
      const value = {
        departmentName: null,
        taskName: null,
        taskContent: null,
        departmentId: null
      }
      this.taskList.push(value);
    },
    deletePlanBox (index) { // 删除调度方法输入框
      this.taskList.splice(index, 1);
    },
    skipMorePlan () { // 跳转至更多预案页面
      this.$router.push({name: 'more_plan'});
    },
    // 跳至查看预案页面
    skipSelectPlanPage (obj) {
      console.log(obj);
      this.$router.push({name: 'plan_detail'});
    },
    // 跳至启用预案页面
    skipReplanPage (obj) {
      console.log(obj);
      this.$router.push({name: 'enable_plan'});
    },
    // 返回
    back () {
      this.$router.back(-1);
    }
  }
}
</script>
<style lang="scss" scoped>
.ctc-operation {
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 100px;
    .ctc-plan-box, {
      width: 100%;
      margin-bottom: 50px;
      .plan-box {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .plan-operation-box {
          width: 49%;
          background: #ffffff;
          height: 480px;
          .plan-title {
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            span:nth-child(1) {
              font-size: 16px;
              color: #333333;
              font-weight: 600;
            }
            span:nth-child(2) {
              color: #0C70F8;
              cursor: pointer;
            }
          }
          .divide {
            width: 100%;
            height: 1px;
            margin-bottom: 10px;
            background:rgba(242,242,242,1);
          }
          .table_box {
            padding: 0 20px;
            height: calc(480px - 80px);
            .plan_table {
              height: 100%;
              margin-top: 8px;
              .operation_btn {
                color: #0C70F8;
                cursor: pointer;
                padding: 0 10px;
                display: inline-block;
              }
            }
          }
        }
        .plan-list {
          width: 49%;
          height: 480px;
          margin-bottom: 10px;
          &:last-child {
            height: 100%;
            .main-content {
              height: calc(480px - 65px);
            }
          }
          .main-content {
            box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
            border-radius:4px;
            background-color: #ffffff;
            height: 100%;
            .title {
              padding: 10px 20px;
              display: flex;
              justify-content: space-between;
              > span {
                color: #333333;
                font-size: 16px;
                font-weight: 600;
              }
              i {
                cursor: pointer;
              }
            }
            .divide {
              width: 100%;
              height: 1px;
              margin-bottom: 10px;
              background:rgba(242,242,242,1);
            }
            .plan-form-box {
              margin-top: 20px;
              .plan-form {
                width: 94%;
                margin-left: 2%;
                .el-select {
                  width: 100%;
                }
              }
            }

          }
          .add-ctc {
            width: 100%;
            height: 50px;
            line-height: 50px;
            margin-top: 15px;
            text-align: center;
            background-color: #ffffff;
            box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
            border-radius:4px;
            border:1px dashed rgba(211,211,211,1);
            cursor: pointer;
            i {
              vertical-align: middle;
              margin-right: 5px;
            }
            > span {
              color: #0C70F8;
              vertical-align: middle;
            }
          }
        }
      }
    }
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
    z-index: 1;
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


