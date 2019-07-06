<template>
<vue-scroll>
  <div class="ctc-operation">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/alarm/today' }" v-if="type === 'today'">今日告警</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/alarm/history' }" v-if="type === 'history'">历史告警</el-breadcrumb-item>
        <el-breadcrumb-item :to="detailUrl">告警详情</el-breadcrumb-item>
        <el-breadcrumb-item>调度指挥</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-box" v-loading="isLoading">
      <div class="content-left-box">
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
                <div class="control_line show_detail">
                  <span class="left">事件情况：</span>
                  <span class="right">{{sturcDetail.eventInfo.eventDetail || '无'}}</span>
                  <div class="show_all" v-if="sturcDetail.eventInfo.eventDetail">
                    <span v-if="sturcDetail.eventInfo.eventDetail.length > 9" @click="showBox">[查看全部]</span>
                    <div class="show_detail_box" v-if="isShowBox"><span>{{sturcDetail.eventInfo.eventDetail }}</span><span @click="showBox">[收起]</span></div>
                  </div>
                </div>
              </template>
              <template v-if="!sturcDetail.eventInfo">
                <div class="control_line"><span class="left">事件编号：</span><span class="right">无</span></div>
                <div class="control_line"><span class="left">事件类型：</span><span class="right">无</span></div>
                <div class="control_line"><span class="left">事件等级：</span><span class="right">无</span></div>
                <div class="control_line"><span class="left">事件情况：</span><span class="right">无</span></div>
              </template>
            </div>
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
      <div class="content-right-box">
        <template v-if="sturcDetail.taskList && sturcDetail.taskList.length > 0">
        <div class="event-ctc-content" >
          <div class="header">
            <p class="ctc-title">调度方案</p>
          </div>
          <ul class="content-list">
            <li v-for="(item, index) in sturcDetail.taskList" :key="'item' + index">
              <div>
                <span>{{item.departmentName}}</span>
              </div>
              <div>
                <span>{{item.taskContent}}</span>
              </div>
              <div class="ctc-content">
                <span>任务名称：</span>
                <span>{{item.taskName}}</span>
              </div>
            </li>
          </ul>
        </div>
        </template>
        <div class="ctc-plan-box">
          <div class="plan-box">
            <div class="plan-list" v-for="(item, index) in taskList" :key="index">
              <div class="main-content">
                <div class="title">
                  <template v-if="sturcDetail.eventInfo">
                    <template v-if="sturcDetail.eventInfo.taskList">
                      <span>再次调度方案</span>
                    </template>
                    <template v-else>
                      <span>调度方案</span>
                    </template>
                  </template>
                  <template v-else>
                    <span>调度方案</span>
                  </template>
                  <i class="vl_icon vl_icon_event_7" @click="deletePlanBox(index)" v-show="taskList.length > 1"></i>
                </div>
                <div class="plan-form-box">
                  <el-form class="plan-form" label-width="90px" :model="item"  size="middle">
                    <el-form-item label="调度部门:"  :rules ="[{ required: true, message: '请选择调度部门', trigger: 'blur' }]">
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
                    <el-form-item label="任务名称:" :rules ="[{ required: true, message: '请输入任务名称', trigger: 'blur' }]">
                      <el-input v-model="item.taskName"></el-input>
                    </el-form-item>
                    <el-form-item label="任务内容:" :rules ="[{ required: true, message: '请输入任务内容', trigger: 'blur' }]">
                      <el-input type="textarea" rows="6" v-model="item.taskContent"></el-input>
                    </el-form-item>
                    <el-form-item label="" v-if="taskList.length === (index + 1)">
                      <div class="add-ctc" @click="addTask('form' + index)">
                        <i class="vl_icon vl_icon_event_8"></i>
                        <span>添加调度任务</span>
                      </div>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </div>
            <div class="plan-operation-box">
              <div class="plan-title">
                <span>推荐预案</span>
                <span @click="skipMorePlan">更多预案</span>
              </div>
              <div class="table_box">
                  <el-table
                    class="plan_table"
                    :data="planList"
                    >
                    <el-table-column
                      label="序号"
                      type="index"
                      align="center"
                      >
                    </el-table-column>
                    <el-table-column
                      label="预案名称"
                      prop="planName"
                      show-overflow-tooltip
                      align="center"
                      >
                    </el-table-column>
                    <el-table-column
                      label="预案类型"
                      prop="eventTypeName"
                      show-overflow-tooltip
                      align="center"
                      >
                    </el-table-column>
                    <el-table-column
                      label="适用事件等级"
                      prop="levelNameList"
                      show-overflow-tooltip
                      align="center"
                      >
                      <template slot-scope="scope">
                        <span>{{scope.row.levelNameList.join('、')}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150" align="center">
                      <template slot-scope="scope">
                        <span class="operation_btn" @click="skipSelectPlanPage(scope.row)">查看</span>
                        <span style="color: #f2f2f2">|</span>
                        <span class="operation_btn" @click="skipReplanPage(scope.row)">启用</span>
                      </template>
                    </el-table-column>
                  </el-table>
              </div>
            </div>
          </div>
        </div>
        <div class="operation-footer">
          <el-button class="operation_btn back_btn" @click="back">返回</el-button>
          <el-button class="operation_btn function_btn" @click="onSubmit">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</vue-scroll>
</template>
<script>
import { addTaskInfo, getPlanData } from '@/views/index/api/api.event.js';
import { getDepartmentList } from '@/views/index/api/api.manage.js';
import { getAlarmDetail } from "@/views/index/api/api.control.js";
import { dataList } from '@/utils/data.js';
export default {
  data () {
    return {
        imgIndex: 0, // 点击的图片索引
        isShowImg: false, // 是否放大图片
        imgList1: [],
        basicInfo: {}, // 事件详情
        taskList: [
          {
            departmentName: null,
            taskName: null,
            taskContent: null,
            departmentId: null
          }
        ],
        planList: [], // 表格数据
        userInfo: {},
        departmentData: [],
        type: '',     //今日告警或历史告警
        detailUrl: '',    //告警详情地址
        sturcDetail: {},
        isLoading: false,
        eventType: dataList.eventType,
        eventLevel: dataList.eventLevel,
        isShowBox: false,
    }
  },
  created () {
    this.userInfo = this.$store.state.loginUser;
  },
  mounted () {
    this.type = this.$route.query.type
    this.detailUrl = '/alarm/detail?uid=' + this.$route.query.eventId + '&objType=' + this.$route.query.objType + '&type=' + this.type
    if(this.type === 'today') {
      this.detailUrl = this.detailUrl
    }else {
      this.detailUrl = this.detailUrl + '&startTime=' + this.$route.query.startTime + '&endTime=' + this.$route.query.endTime
    }
    this.getDepartList();
    this.toAlarmDetail();
    if(this.$route.query.eventType) {
       this.getReplanList();
    }
  },
  methods: {
    getReplanList () { // 获取预案列表
      const params = {
        pageNum: -1,
        'where.planType': this.$route.query.eventType
      }
      getPlanData(params)
        .then((res) => {
          if (res && res.data.list) {
            this.planList = res.data.list;
            for(let item of this.planList) {
              let planLevelName = []
              let levelList = [...item.levelList]
              if(levelList && levelList.length > 0) {
                planLevelName = levelList.map(data => data.planLevelName)
              }
              item['levelNameList'] = planLevelName
            }
          }
        })
        .catch(() => {});
    },
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
          }
        })
    },
    //告警详情
    toAlarmDetail() {
      this.isLoading = true
      const eventId = this.$route.query.eventId;
      getAlarmDetail(eventId).then( res => {
        this.sturcDetail = res.data
        this.sturcDetail['objType'] = this.$route.query.objType
        this.$nextTick(()=> {
          this.isLoading = false
        })
      }).catch(() => {
        this.isLoading = false
      })
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
    // 提交数据
    onSubmit () {
      let _this = this;
      _this.judgeData().then(result => {
        if (result === true) {
          this.taskList.map((item, index) => {
            this.departmentData.map(itm => {
              if (item.departmentId === itm.uid) {
                this.taskList[index].departmentName = itm.organName;
              }
            })
          })
          const params = {
            dispatchType: 2, // 1--事件 2--告警
            eventId: this.$route.query.eventId
          }
          addTaskInfo(this.taskList, params)
            .then(res => {
              if (res) {
                this.$message({
                  type:'success',
                  message: '添加任务成功',
                  customClass: 'request_tip'
                })
                this.$nextTick(()=>{
                  this.$router.push({name: 'event_ctc'});
                })
              } else {
                this.$message({
                  type:'error',
                  message: '添加任务失败',
                  customClass: 'request_tip'
                })
              }
            })
            .catch(() => {})
        }
      })
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
    skipMorePlan () { // 跳转至更多预案页面
      this.$router.push({name: 'more_plan', query: {eventId: this.$route.query.id}});
    },
    // 跳至查看预案页面
    skipSelectPlanPage (obj) {
      let status = '';
      if (this.sturcDetail.dispatchStatus == 1) {
        status = 'ctc_ing'
      }else if (this.sturcDetail.dispatchStatus == 2) {
        status = 'ctc_end'
      }
      this.$router.push({name: 'plan_detail', query: {alarmId: this.$route.query.eventId, eventId: this.$route.query.id, planId: obj.uid, type: 'alarm_ctc', status: status, objType: this.$route.query.objType}});
    },
    // 跳至启用预案页面
    skipReplanPage (obj) {
      let status = '';
      if (this.sturcDetail.dispatchStatus == 1) {
        status = 'ctc_ing'
      }else if (this.sturcDetail.dispatchStatus == 2) {
        status = 'ctc_end'
      }
      this.$router.push({name: 'enable_plan', query: {alarmId: this.$route.query.eventId, eventId: this.$route.query.id, planId: obj.uid, type: 'alarm_ctc', status: status, objType: this.$route.query.objType}});
    },
    /* // 跳至查看预案页面
    skipSelectPlanPage (obj) {
      this.$router.push({name: 'plan_detail', query: {eventId: this.$route.query.id, planId: obj.uid}});
    },
    // 跳至启用预案页面
    skipReplanPage (obj) {
      this.$router.push({name: 'enable_plan', query: {eventId: this.$route.query.id, planId: obj.uid}});
    }, */
    // 返回
    back () {
      this.$router.back(-1);
    },
    //展示事件情况
    showBox() {
      this.isShowBox = !this.isShowBox
    },
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
.ctc-operation {
  width: 100%;
  padding: 0 .2rem;
  .breadcrumb_heaer {
    padding-left: 0;
  }
  .content-box {
    display: flex;
    .content-left-box {
      width: 49.5%;
      .card-info {
        width: 98%;
        height: 4.4rem;
        background: #fff;
        box-shadow:12px 0px 27px 0px rgba(141,142,142,0.19);
        border-radius:1px;
        padding: .2rem .18rem;
        display: flex;
        margin-bottom: .2rem;
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
    .content-right-box {
      width: 50.5%;
      box-shadow:-5px 0px 16px 0px rgba(169,169,169,0.3);
      border-radius:1px;
      padding: .26rem .5rem 0 0.5rem;
      height: calc(100% - .2rem);
      margin-bottom: .2rem;
      background: #fff;
      .ctc-plan-box, {
        width: 100%;
        clear: both;
        .plan-box {
          .plan-operation-box {
            background: #ffffff;
            .plan-title {
              display: flex;
              justify-content: space-between;
              margin-bottom: .2rem;
              span:nth-child(1) {
                font-size: .18rem;
                color: #333333;
                font-weight: 600;
              }
              span:nth-child(2) {
                color: #0C70F8;
                cursor: pointer;
              }
            }
            .table_box {
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
            margin-bottom: .3rem;
            .main-content {
              border-radius:4px;
              background-color: #ffffff;
              height: 100%;
              .title {
                display: flex;
                justify-content: space-between;
                > span {
                  color: #333333;
                  font-size: .18rem;
                  font-weight: 600;
                }
                i {
                  cursor: pointer;
                }
              }
              .plan-form-box {
                margin-top: .26rem;
                .plan-form {
                  width: 94%;
                  .el-select {
                    width: 100%;
                  }
                }
              }

            }
            .add-ctc {
              width: 100%;
              height: .5rem;
              line-height: .5rem;
              text-align: center;
              background-color: #ffffff;
              border-radius:4px;
              border:1px dashed #0C70F8;
              cursor: pointer;
              i {
                vertical-align: middle;
                margin-right: .05rem;
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
        background-color: #ffffff;
        .header {
          margin-bottom: .26rem;
          > p {
            color: #333333;
            font-size: .18rem;
            font-weight: 600;
          }
        }
        .content-list {
          > li {
            float: left;
            width: 48.5%;
            height: 1.82rem;
            box-shadow: 0px 0px 24px 0px rgba(121,120,120,0.16);
            border-radius: 5px;
            margin-bottom: .3rem;
            padding: .2rem .3rem;
            color: #222;
            &:nth-child(even) {
              margin-left: .2rem;
            }
            > div {
              line-height: .24rem;
              margin-bottom: .14rem;
              max-height: .48rem;
              overflow: hidden;
              &:nth-child(1){
                color: #2F78FF;
              }
              &:nth-child(2){
                 max-height: .48rem;
                 display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                 /* position:relative;
                 &::after {
                    content:"...";
                    font-weight:bold;
                    position:absolute;
                    bottom:0;
                    right:0;
                    padding-left:24px;
                    background: -webkit-linear-gradient(left, transparent, #fff 55%);
                    background: -o-linear-gradient(right, transparent, #fff 55%);
                    background: -moz-linear-gradient(right, transparent, #fff 55%);
                    background: linear-gradient(to right, transparent, #fff 55%);
                 } */
              }
              &:nth-child(3){
                color: #666666;
                margin-bottom: 0;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
              }
            }
          }
        }
      }
    }
  }
  .operation-footer {
    width: 100%;
    height: .7rem;
    z-index: 1;
    line-height: .7rem;
    background: #ffffff;
    text-align: center;
    .operation_btn {
      padding: 0;
      width: 1.6rem;
      height: .4rem;
      text-align: center;
      border-radius:4px;
    }
    .function_btn {
      background: #0C70F8;
      color: #ffffff;
      margin-left: .4rem;
    }
    .back_btn {
      background: #ffffff;
      border: 1px solid #DDDDDD;
      color: #666666;
    }
  }
}
</style>