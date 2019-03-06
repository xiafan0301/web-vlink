<template>
  <vue-scroll>
    <div class="enable-plan">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/event/treatingEventDetail' }">事件详情</el-breadcrumb-item>
          <el-breadcrumb-item>启用预案</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <EventBasic></EventBasic>
        <div class="ctc-plan-box">
          <div class="plan-box">
            <div class="plan-list" v-for="(item, index) in taskList" :key="index">
              <div class="main-content">
                <div class="title">
                  <span>调度指挥方案</span>
                  <i class="vl_icon vl_icon_event_7" @click="deletePlanBox(index)" v-show="taskList.length > 1"></i>
                </div>
                <div class="divide"></div>
                <div class="plan-form-box">
                  <el-form class="plan-form" label-width="90px" :model="item"  size="middle" >
                    <el-form-item label="执行部门:" :rules ="[{ required: true, message: '请选择执行部门', trigger: 'blur' }]">
                      <el-select v-model="item.departmentId" placeholder="请选择执行部门">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="任务名称:"  :rules ="[{ required: true, message: '请输入任务名称', trigger: 'blur' }]">
                      <el-input v-model="item.taskName"></el-input>
                    </el-form-item>
                    <el-form-item label="任务内容:"  :rules ="[{ required: true, message: '请输入任务内容', trigger: 'blur' }]">
                      <el-input type="textarea" rows="9" v-model="item.taskContent"></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <template v-if="!isInitial">
                <div class="add-ctc" @click="addTask" v-if="taskList.length === (index + 1)">
                  <i class="vl_icon vl_icon_event_8"></i>
                  <span>调度指挥任务添加</span>
                </div>
              </template>
            </div>
            <template v-if="isInitial">
              <div class="plan_add_box">
                <div class="add-ctc" @click="initAddTask">
                  <i class="vl_icon vl_icon_event_8"></i>
                  <span>调度指挥任务添加</span>
                </div>
              </div>
            </template>
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
export default {
  components: { EventBasic },
  data () {
    return {
      isInitial: true, //  页面初始化进来
      planForm: {
        department: null,
        taskName: null,
        taskContent: null
      },
      taskList: [
        {
          departmentName: null,
          taskName: null,
          taskContent: null,
          departmentId: null
        }
      ]
    }
  },
  methods: {
    // 第一次添加
    initAddTask () {
      this.isInitial = false;
      const value = {
        departmentName: null,
        taskName: null,
        taskContent: null,
        departmentId: null
      }
      this.taskList.push(value);
    },
    addTask () {
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
    onSubmit () { // 提交-启用预案
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
    // 返回
    back () {
      this.$router.back(-1);
    }
  }
}
</script>
<style lang="scss" scoped>
.enable-plan {
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 100px;
    .ctc-plan-box {
      width: 100%;
      margin-bottom: 50px;
      .plan-box {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
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
        .plan_add_box {
          width: 49%;
          height: 480px;
          background-color: #ffffff;
          .add-ctc {
            text-align: center;
            margin-top: 30%;
            i {
              vertical-align: middle;
              margin-right: 5px;
              cursor: pointer;
            }
            > span {
              color: #0C70F8;
              vertical-align: middle;
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


