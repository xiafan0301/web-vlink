<template>
  <vue-scroll>
    <div class="enable-plan">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <template v-if="$route.query.type === 'ctc'">
            <el-breadcrumb-item :to="{ path: '/event/ctc' }">调度指挥</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/event/ctcDetailInfo', query: {id: $route.query.eventId, status: $route.query.status} }">调度详情</el-breadcrumb-item>
          </template>
          <template v-else>
            <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/event/treatingEventDetail', query: {eventId: $route.query.eventId, status: $route.query.status} }">事件详情</el-breadcrumb-item>
          </template>
          <el-breadcrumb-item>启用预案</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <EventBasic :basicInfo="basicInfo" @emitHandleImg="emitHandleImg"></EventBasic>
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
                        <el-option
                          v-for="(item, index) in departmentData"
                          :key="index"
                          :label="item.organName"
                          :value="item.uid"
                        >
                        </el-option>
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
        <el-button class="operation_btn function_btn" :loading="isEnableLoading" @click="onSubmit">确定</el-button>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
      <BigImg :imgList="imgList1" :imgIndex='imgIndex' :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
    </div>
  </vue-scroll>
</template>
<script>
import BigImg from '@/components/common/bigImg.vue';
import EventBasic from './components/eventBasic';
import { getPlanDetail, ctcTasks, getEventDetail } from '@/views/index/api/api.event.js';
import { getDepartmentList } from '@/views/index/api/api.manage.js';
export default {
  components: { EventBasic, BigImg },
  data () {
    return {
      isInitial: true, //  页面初始化进来
      imgList1: [],
      imgIndex: 0, // 点击的图片索引
      isShowImg: false, // 是否放大图片
      taskList: [
        {
          departmentName: null,
          taskName: null,
          taskContent: null,
          departmentId: null
        }
      ],
      basicInfo: {}, // 事件详情
      userInfo: {},
      departmentData: [], // 执行部门数据
      isEnableLoading: false, // 启用预案加载中
    }
  },
  created () {
    this.userInfo = this.$store.state.loginUser;
  },
  mounted () {
    this.getDepartList();
    this.getDetail();
    this.getPlanDetailInfo();
  },
  methods: {
    // 获取协同部门
    getDepartList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0,
      };
      getDepartmentList(params)
        .then(res => {
          if (res && res.data.list) {
            this.departmentData = res.data.list;
            this.departmentData.map((item, index) => {
              if (item.uid === this.userInfo.organList[0].uid) {
                this.departmentData.splice(index, 1);
              }
            });
          }
        })
    },
    // 获取事件详情
    getDetail () {
      const eventId = this.$route.query.eventId;
      if (eventId) {
        getEventDetail(eventId)
          .then(res => {
            if (res) {
              this.basicInfo = res.data;
            }
          })
          .catch(() => {})
      }
    },
    // 获取预案详情
    getPlanDetailInfo() {
      const planId = this.$route.query.planId;
      if (planId) {
        getPlanDetail(planId)
          .then(res => {
            if (res) {
              this.taskList = JSON.parse(JSON.stringify(res.data.taskList));
              if (this.taskList.length > 0) {
                this.isInitial = false;
              } else {
                this.isInitial = true;
              }
            }
          })
      }
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
      if (this.taskList.length === 1) {
        this.isInitial = true;
      }
    },
    // 判断taskList是否都填写完
    judgeData () {
      let _this = this;
      return new Promise((resolve) => {
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
      const eventId = _this.$route.query.eventId;
      _this.judgeData().then(result => {
        if (result === false) {
          this.$message({
            type: 'error',
            message: '请先填写完信息',
            customClass: 'request_tip'
          })
        } else {
          _this.taskList.map((item, index) => {
            item.uid = null;
            _this.departmentData.map(itm => {
              if (item.departmentId === itm.uid) {
                _this.taskList[index].departmentName = itm.organName;
              }
            });
          });
          this.isEnableLoading = true;
          ctcTasks(_this.taskList, eventId)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '启用成功',
                  customClass: 'request_tip'
                });
                this.$router.back(-1);
                this.isEnableLoading = false;
              } else {
                this.$message({
                  type: 'error',
                  message: '启用失败',
                  customClass: 'request_tip'
                });
                this.isEnableLoading = false;
              }
            })
            .catch(() => {this.isEnableLoading = false;})
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


