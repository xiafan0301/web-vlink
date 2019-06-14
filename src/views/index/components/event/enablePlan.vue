<template>
  <vue-scroll>
    <div class="enable-plan">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <template v-if="$route.query.type === 'ctc'">
            <el-breadcrumb-item :to="{ path: '/event/ctc' }">调度指挥</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/event/ctcDetailInfo', query: {id: $route.query.eventId, status: $route.query.status} }">调度详情</el-breadcrumb-item>
          </template>
           <template v-else-if="$route.query.type === 'alarm_ctc'">
            <el-breadcrumb-item :to="{ path: '/event/ctc' }">调度指挥</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/event/alarmCtcDetailInfo', query: { id: $route.query.eventId, status: $route.query.status, objType: $route.query.objType }}">调度详情</el-breadcrumb-item>
          </template>
          <template v-else>
            <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/event/treatingEventDetail', query: {eventId: $route.query.eventId, status: $route.query.status} }">事件详情</el-breadcrumb-item>
          </template>
          <el-breadcrumb-item>启用预案</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <template v-if="$route.query.type === 'alarm_ctc'">
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
        </template>
        <template v-else>
          <EventBasic :basicInfo="basicInfo" @emitHandleImg="emitHandleImg"></EventBasic>
        </template>
        <div class="ctc-plan-box">
          <div class="plan-box">
            <div class="plan-list" v-for="(item, index) in taskList" :key="index">
              <div class="main-content">
                <div class="title">
                  <span>调度方案</span>
                  <i class="vl_icon vl_icon_event_7" @click="deletePlanBox(index)" v-show="taskList.length > 1"></i>
                </div>
                <div class="divide"></div>
                <div class="plan-form-box">
                  <el-form class="plan-form" label-width="90px" :model="item"  size="middle" >
                    <el-form-item label="调度部门:" :rules ="[{ required: true, message: '请选择调度部门', trigger: 'blur' }]">
                      <el-select v-model="item.departmentId" placeholder="请选择调度部门">
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
                      <el-input v-model="item.taskName" maxlength="140"></el-input>
                    </el-form-item>
                    <el-form-item label="任务内容:"  :rules ="[{ required: true, message: '请输入任务内容', trigger: 'blur' }]">
                      <el-input type="textarea" rows="9" v-model="item.taskContent" maxlength="1000"></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <template v-if="!isInitial">
                <div class="add-ctc" @click="addTask" v-if="taskList.length === (index + 1)">
                  <i class="vl_icon vl_icon_event_8"></i>
                  <span>添加调度任务</span>
                </div>
              </template>
            </div>
            <template v-if="isInitial">
              <div class="plan_add_box">
                <div class="add-ctc" @click="initAddTask">
                  <i class="vl_icon vl_icon_event_8"></i>
                  <span>添加调度任务</span>
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
import { getAlarmDetail } from "@/views/index/api/api.control.js";
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
      sturcDetail: {}, // 告警详情
      userInfo: {},
      departmentData: [], // 调度部门数据
      isEnableLoading: false, // 启用预案加载中
    }
  },
  created () {
    this.userInfo = this.$store.state.loginUser;
  },
  mounted () {
    this.getDepartList();
    if (this.$route.query.type === 'alarm_ctc') {
      this.toAlarmDetail();
    } else {
      this.getDetail();
    }
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
    // 获取告警详情
    toAlarmDetail() {
      const eventId = this.$route.query.eventId;
      getAlarmDetail(eventId)
        .then(res => {
          if (res) {
            this.sturcDetail = res.data;
            this.sturcDetail['objType'] = this.$route.query.objType;
          }
        })
        .catch(() => {})
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
                if (this.$route.query.type === 'ctc') {
                  this.$router.push({name: 'ctc_detail_info', query: {id: this.$route.query.eventId, status: this.$route.query.status}});
                } else if (this.$route.query.type === 'alarm_ctc') {
                  this.$router.push({name: 'alarm_ctc_detail_info', query: { id: this.$route.query.eventId, status: this.$route.query.status, objType: this.$route.query.objType }});
                } else {
                  this.$router.push({name: 'treating_event_detail', query: {eventId: this.$route.query.eventId, status: this.$route.query.status}});
                }
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


