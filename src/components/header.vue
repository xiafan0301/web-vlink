<template>
  <div class="vl_header">
    <div class="hd_log vl_icon vl_icon_logo">
    </div>
    <div class="hd_user">
      <img src="../assets/img/temp/vl_photo.png" alt="">
      <el-popover
        popper-class="person_info"
        placement="bottom"
        trigger="click">
        <ul class="hd_user_pl">
          <li class="user_pl_dis">个人设置</li>
          <li @click="showUpdatePwdDialog">修改密码</li>
          <li @click="showLoginOutDialog">退出登录</li>
        </ul>
        <span slot="reference">{{ userInfo && userInfo.userRealName}}&nbsp;<i class="el-icon-arrow-down"></i></span>
      </el-popover>
      <ul>
        <li>
          <el-popover
            ref="popoverTask"
            placement="bottom"
            width="378"
            trigger="click"
            :popper-class="popoverClass"
            v-model="taskVisible"
            >
            <div class="vl_task_box" v-if="alarmList && alarmList.length > 0">
            <div class="vl_info vl_t_b_header">
              <p v-for="(item,index) in taskStatusList" :key="index" :class="{active: type == item.enumField}" @click="changeTab(item.enumField)" class="h_menu">
                {{item.enumValue}}<span>({{item.enumField == 1 ? taskCount.unread : taskCount.haveRead}})</span>
              </p>
              <!-- <p :class="{active: type === 1}" @click="changeTab(1)" class="h_menu">未读<span>(15)</span></p>
              <p :class="{active: type === 2}" @click="changeTab(2)" class="h_menu">已读<span>(15)</span></p> -->
              <p class="h_menu"><span @click="mark">全部标记为已读</span></p>
            </div>
            <vue-scroll>
            <ul class="vl_t_b_content">
              <li class="vl_info vl_t_b_list" v-for="(item,index) in taskList" :key="'t_'+index" @click="goSkipTaskDetail(item)">
                  <div class="col_content">
                    <i :class="item.processType == 2 ? 'vl_icon vl_icon_task_3' : item.processType == 3 ? 'vl_icon vl_icon_task_2': 'vl_icon vl_icon_task_1'"></i>
                  </div>
                  <div class="col_content">
                    <h2>{{ dicFormater( taskType, item.processType)}}</h2>
                    <p>您收到一个{{ dicFormater( taskType, item.processType)}}</p>
                  </div>
                  <div class="col_content">{{item.createTime | fmTimestamp('yyyy-MM-dd HH:mm')}}</div>
              </li>
              <li class="no_data" v-if="!taskList || taskList.length <= 0">暂无数据</li>
            </ul>
            </vue-scroll>
            <div style="width: 100%;text-align: center;padding: 10px 0;">
              <a style="color: #666;" @click="goToTaskList">查看更多</a>
            </div>
            </div>
            
            <el-badge :value="sums.msg" class="item" :max="99" slot="reference">
              <i class="vl_icon vl_icon_011" @click="getTaskCount"></i>
            </el-badge>
          </el-popover>
        </li>
        <li>
          <el-popover
            ref="popover"
            placement="bottom"
            width="397"
            trigger="click"
            :popper-class="alarmPopoverClass"
            v-model="alarmVisible">
            
            <div class="vl_hd_box" v-if="alarmList && alarmList.length > 0">
            <vue-scroll>
            <div class="vl_hd_alarm" v-for="(item,index) in alarmList" :key="index" @click="goSkipDetail(item)">
              <div class="hd_alarm_t">
                <div>
                  <h1>{{item.surveillanceName}}</h1>
                  <p>{{item.devName}}</p>
                  <p>{{item.snapTime}}</p>
                </div>
                <div><img :src="item.snapPhoto" alt="抓拍照片"></div>
                <div>
                  <span>{{item.semblance}}</span>
                  <p>匹配度</p>
                  <el-progress :percentage="item.semblance" color="#0C70F8"></el-progress>
                </div>
                <div><img :src="item.surveillancePhoto" alt="布防照片"></div>
              </div>
              <div class="hd_alarm_b">
                <template v-if="item.objType == 1">
                  <div class="alarm_b_list">{{item.name}}</div>
                  <div class="alarm_b_list">{{item.sex}}</div>
                  <div class="alarm_b_list">{{item.nation}}</div>
                </template>
                <template v-if="item.objType == 2">
                  <div class="alarm_b_list">{{item.vehicleNumber}}</div>
                  <div class="alarm_b_list">{{item.numberColor}}</div>
                  <div class="alarm_b_list">{{item.vehicleType}}</div>
                </template>
                <div class="alarm_b_list">{{item.eventCode || '无'}}<span>|</span><span>关联事件</span></div>
              </div>
            </div>
            </vue-scroll>
            <div style="width: 100%;text-align: center;padding: 10px 0;">
              <a style="color: #666;" @click="goToAlarmList">查看更多</a>
            </div>
            </div>
            
            <el-badge :value="sums.events" class="item" :max="99" slot="reference">
              <i class="vl_icon vl_icon_012" :class="{'hd_user_is': sums.events > 0}" @click="getAlarm"></i>
            </el-badge>
          </el-popover>
        </li>
      </ul>
    </div>
    <ul class="hd_menu">
      <li>
        <router-link :to="{name: 'video'}">
          <i class="vl_icon vl_icon_001"></i>
          <span>视频</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'map'}">
          <i class="vl_icon vl_icon_002"></i>
          <span>GIS</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'event'}">
          <i class="vl_icon vl_icon_003"></i>
          <span>事件</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'control'}">
          <i class="vl_icon vl_icon_006"></i>
          <span>布控</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'judge'}">
          <i class="vl_icon vl_icon_004"></i>
          <span>研判</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'search'}">
          <i class="vl_icon vl_icon_005"></i>
          <span>检索</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'message'}">
          <i class="vl_icon vl_icon_007"></i>
          <span>消息</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'manage'}">
          <i class="vl_icon vl_icon_008"></i>
          <span>管理</span>
        </router-link>
      </li>
    </ul>
    <!--退出登录弹出框-->
    <el-dialog
      title="退出登录"
      :visible.sync="loginoutDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">您确定退出登录吗?</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="loginoutDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="loginOut">确认</el-button>
      </div>
    </el-dialog>
    <!--修改密码弹出框-->
    <el-dialog
      title="修改密码"
      :visible.sync="updatePwdDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div class="content_body">
        <p>如果忘记旧密码，请在登录页使用“忘记密码”功能重设密码。</p>
        <el-form :model="updateForm" ref="updateForm" :rules="rules" label-width="20px">
          <el-form-item label=" " prop="oldPwd">
            <el-input :type="inputType.oldType" placeholder="请输入旧密码" v-model="updateForm.oldPwd" @focus="changeFocus(1)"></el-input>
          </el-form-item>
          <el-form-item label=" " prop="newPwd">
            <el-input :type="inputType.newType" placeholder="请设置新密码" v-model="updateForm.newPwd" @focus="changeFocus(2)"></el-input>
          </el-form-item>
          <el-form-item label=" " prop="sureNewPwd">
            <el-input :type="inputType.sureType" placeholder="请确认密码" v-model="updateForm.sureNewPwd" @focus="changeFocus(3)"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdate('updateForm')">取消</el-button>
        <el-button class="operation_btn function_btn" @click="updatePassword('updateForm')">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { logout, updatePwd } from '@/views/index/api/api.user.js';
import { getAlarmList } from "@/views/index/api/api.control.js";
import { getTasks, markTask, getCount } from '@/views/index/api/api.event.js';
import {formatDate} from '@/utils/util';
import { dataList } from '@/utils/data.js';
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9]{6,16}$/;
      if (!reg.test(value)) {
        callback(new Error('密码为6-16个数字或英文字母组合'));
      } else {
        if (this.updateForm.sureNewPwd !== '') {
          this.$refs.updateForm.validateField('sureNewPwd');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
     if (value !== this.updateForm.newPwd) {
        callback(new Error('两次密码不一致'));
      } else {
        callback();
      }
    };
    return {
      sums: {
        msg: 0,
        events: 0
      },
      updateForm: {
        newPwd: null,
        sureNewPwd: null,
        oldPwd: null
      },
      rules: {
        oldPwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        sureNewPwd: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      userInfo: null,
      loginoutDialog: false, // 退出登录弹出框
      updatePwdDialog: false, // 修改密码弹出框
      pageNum: 1,
      pageSize: 10,
      alarmList: [],
      type: 1,
      taskList: [], // 任务数据
      taskStatusList: [], // 任务状态数据
      taskType: dataList.taskType,
      taskListAll: [],
      inputType: {
        oldType: 'text',
        newType: 'text',
        sureType: 'text'
      }, // 输入框类型
      taskCount: {},
      popoverClass: 'task_popover',
      alarmPopoverClass: 'alarm_popover',
      taskVisible: false,
      alarmVisible: false,
    }
  },
  mounted () {
    this.userInfo = this.$store.state.loginUser;
    let taskStatusL = this.dicFormater(dataList.taskStatus)
    this.taskStatusList = taskStatusL[0].dictList
    this.getAlarm()
    this.getTaskCount();
    this.getTaskData();
  },
  methods: {
    // 将输入框的type改为password
    changeFocus (val) {
      if (val === 1) {
        this.inputType.oldType = 'password';
      }
      if (val === 2) {
        this.inputType.newType = 'password';
      }
      if (val === 3) {
        this.inputType.sureType = 'password';
      }
    },
    // 显示退出登录弹出框
    showLoginOutDialog () {
      this.loginoutDialog = true;
    },
    // 退出登录
    loginOut () {
      const params = {
        userMobile: this.userInfo.userMobile
      }
      logout(params)
        .then(res => {
          if (res) {
            this.loginoutDialog = false;
            this.$router.push({name: 'login'});
          } else {
            this.$message({
              type: 'error',
              message: '退出登录失败',
              customClass: 'request_tip'
            })
          }
        })
    },
    // 显示修改密码弹出框
    showUpdatePwdDialog () {
      this.updatePwdDialog = true;
    },
    // 取消修改密码
    cancelUpdate (form) {
      this.$refs[form].resetFields();
      this.updatePwdDialog = false;
    },
    // 修改密码
    updatePassword (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          const params = {
            newPwd: this.updateForm.newPwd,
            oldPwd: this.updateForm.oldPwd
          };
          updatePwd(params)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '修改密码成功',
                  customClass: 'request_tip'
                })
                this.updatePwdDialog = false;
                this.$router.push({name: 'login'});
              }
            })
            .catch(() => {})
        }
      })
    },
    //任务数量统计
    getTaskCount() {
      let params = {
        userId: this.userInfo.uid
      }
      getCount(params).then(res => {
        if(res.data) {
          this.taskCount = res.data;
          if(!this.taskCount.haveRead) {
            this.taskCount['haveRead'] = 0
          }
          if(!this.taskCount.unread) {
            this.taskCount['unread'] = 0
          }
          this.sums.msg = res.data.total;
          //是否展示任务盒子
          this.$nextTick(()=>{
            if(this.sums.msg <= 0 ) {
              this.popoverClass = 'task_popover show_box'
            }
          })
        }
      }).catch(()=>{})
    },
    //告警
    getAlarm() {
      this.alarmList = [];
      let params = {
        "where.startTime": formatDate(new Date().getTime() - 3600 * 1000 * 24 * 90, 'yyyy-MM-dd'),
        "where.endTime": formatDate(new Date(), 'yyyy-MM-dd'),
        "where.sortType": 2,
        "pageNum": this.pageNum,
        "pageSize": this.pageSize
      };
      getAlarmList(params).then( res => {
        if(res.data.list && res.data.list.length > 0) {
          this.alarmList = [...res.data.list]
          for(let item of this.alarmList) {
            let alarmTimeD = formatDate(item.alarmTime, 'yyyy-MM-dd')
            item['alarmTimeD'] = new Date(alarmTimeD).getTime()
          }
          this.sums.events = res.data.total;
          //是否展示告警盒子
          this.$nextTick(()=>{
            if(this.sums.events <= 0 ) {
              this.alarmPopoverClass = 'alarm_popover show_box'
            }
          })
        }
      })
    },
    changeTab(type) {
      this.type = type
      this.taskList = []
      this.getTaskData()
      /* this.taskList = this.taskListAll.filter(key => this.type == key.readFlag).filter((item,index) => index < 10) */
    },
    goSkipDetail(item) {
      console.log("----------",item)
      let nowTime = formatDate(new Date(), 'yyyy-MM-dd')
      let newTime = new Date(nowTime).getTime()
      if(item.alarmTimeD == newTime) {
        this.$router.push({name: 'alarm_default', query: {uid: item.uid, objType: item.objType, type: 'today'}});
      }else {
        this.$router.push({name: 'alarm_default', query: {uid: item.uid, objType: item.objType, type: 'history'}});
      }
      this.alarmVisible = false;
    },
    goToAlarmList() {
      this.$router.push({name: 'alarm'});
      this.alarmVisible = false;
    },
    goToTaskList() {
      this.$router.push({name: 'task'});
      this.taskVisible = false;
    },
    goSkipTaskDetail(item) {
      this.$router.push({name: 'task_default', query: {id: item.eventId, processType: item.processType, uid: item.uid,dispatchType: item.dispatchType, objType: item.objType, dispatchStatus: item.dispatchStatus}});
      this.taskVisible = false;
    },
    // 获取任务列表数据
    getTaskData () {
      this.taskList = [];
      let params = {
        pageNum: 1,
        pageSize: 10,
        'where.isRead': this.type,
        orderBy: 'create_time',
        order: 'desc',
      }
      getTasks(params)
        .then(res => {
          if (res && res.data.list) {
            this.taskListAll = res.data.list;
            /* this.sums.msg = res.data.total; */
            this.taskList = res.data.list;
            /* this.taskList  = res.data.list.filter(key=> this.type == key.readFlag).filter((item,index) => index < 10) */
          }
          // for(let item of this.taskStatusList) {
          //   item['total'] = this.taskList.filter(key => item.enumField == key.readFlag).length
          //   /* item['total'] = this.taskListAll.filter(key => item.enumField == key.readFlag).length */
          // }
        })
        .catch(() => {})
    },
    //标记全部已读
    mark() {
      let params = {
        userId: this.userInfo.uid,
      }
      markTask(params).then(res => {
        console.log(res)
        this.$message.success('全部标记为已读成功')
        this.getTaskData();
      }).catch(()=>{})
    }
  }
}
</script>
<style lang="scss" scoped>
.vl_header {
  position: absolute; top: 0; left: 0;
  // z-index: 100;
  width: 100%;
  height: 100px;
  min-width: 1200px;
  background-color: #0C70F8;
  background: -webkit-linear-gradient(to bottom, #0C70F8, #0466DE);
  background: -moz-linear-gradient(to bottom, #0C70F8, #0466DE);
  background: linear-gradient(to bottom, #0C70F8, #0466DE);
  // animation: fadeInDown .4s ease-out .2s both;
  > .hd_log {
    display: block;
    float: left;
    width: 170px; height:  48px;
    margin: 26px 20px 0 20px;
  }
  > .hd_menu {
    overflow: hidden;
    padding-top: 10px;
    height: 100%;
    margin: 0 320px 0 210px;
    > li {
      float: left;
      height: 100%;
      width: 12.5%; max-width: 110px;
      > a {
        display: block;
        width: 100%; height: 90px;
        font-size: 16px; color: #fff;
        border-radius: 8px 8px 0 0;
        text-decoration: none !important;
        text-align: center;
        transition: all .4s ease-out;
        overflow: hidden;
        > i {
          display: block;
          margin: 15px auto 0 auto;
        }
        > span {
          display: block;
          padding-top: 4px;
        }
        &:hover {
          background-color: #1979fc;
        }
        &.router-link-active {
          background-color: #2682FF;
          cursor: default;
        }
      }
    }
  }
  > .hd_user {
    float: right;
    padding-right: 20px;
    height: 100%;
    > img {
      float: right;
      width: 50px; height: 50%;
      border-radius: 50%;
      margin-top: 25px;
    }
    > span {
      display: block;
      float: right;
      height: 20px; line-height: 20px;
      cursor: pointer;
      font-size: 16px; color: #fff;
      margin-top: 45px; padding: 0 10px 0 20px;
      border-left: 1px solid #ddd;
    }
    > ul {
      float: right;
      height: 100%;
      > li {
        float: left;
        padding: 30px 20px 0 0;
        cursor: pointer;
      }
    }
  }
}
.hd_user_pl {
  > li {
    height: 30px; line-height: 30px;
    text-align: center;
    cursor: pointer;
    color: #666;
    &:hover {
      background-color: #f6f6f6;
    }
    &.user_pl_dis {
      background-color: #fff;
      cursor: not-allowed;
      color: #999;
    }
  }
}
.hd_user_is {
  animation: twinkle 0.6s linear infinite both;
}
.dialog_comp {
  .content_body {
    >p {
      color: #F94539;
      margin-bottom: 20px;
    }
  }
}

</style>
<style lang="scss">
.vl_hd_box {
  max-height: calc(100% - 40px);
  height: calc(100% - 40px);
  .vl_hd_alarm{
    padding: 10px 22px;
    border-bottom: 1px solid #F2F2F2;
    cursor: pointer;
    .hd_alarm_t{
      display: flex;
      justify-content: space-between;
      > div{
        flex: 0 0 25%;
      }
      > div:nth-child(1){
        > div{
          margin-bottom: 10px;
          color: #333333;
          font-size: 16px;
        }
        > p{
          font-size: 12px;
          color: #999999;
        }
      }
      > div:nth-child(3){
        text-align: center;
        padding-top: 15px;
        > span{
          color: #0C70F8;
          font-size: 24px;
          font-weight:bold;
        }
        > p{
          color: #333333;
          font-size: 12px;
        }
        .el-progress{
          text-align: left;
          .el-progress-bar{
            padding-right: 5px!important;
            padding-left: 5px;
          }
          .el-progress__text{
            display: none;
          }
        }
      }
      > div:nth-child(2), > div:nth-child(4){
        text-align: center;
        > img{
          width: 70px;
          height: 70px;
        }
      }
    }
    .hd_alarm_b{
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      > div{
        padding: 5px;
        font-size: 12px;
        background:rgba(250,250,250,1);
        border:1px solid rgba(242,242,242,1);
        border-radius:3px;
        color: #666;
      }
      .alarm_b_list {
        span {
          padding-left: 9px;
          color: #999;
          &:first-of-type {
            color: #F2F2F2;
          }
        }
      }
    }
  }
  a {
    cursor: pointer;
  }
}
.vl_task_box {
  max-height: calc(100% - 85px);
  height: calc(100% - 85px);
  .vl_t_b_header {
    height: 48px;
    line-height: 48px;
    padding: 0 30px;
  }
  .vl_t_b_content {
    padding: 0 30px;
  }
  .vl_info {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    border-bottom: 1px solid #F2F2F2;
    cursor: pointer;
    .h_menu {
      color: #333333;
      font-size: 16px;
      cursor: pointer;
      span {
        color: #999999;  
      }
      &:nth-child(2-n) {
        width: 30%;
      }
      &:nth-child(3) {
        width: 40%;
        text-align: right;
        font-size: 12px;
      }
    }
    .active {
      color: #0C70F8;
      border-bottom: 2px solid #0C70F8;
      span {
        color: #0C70F8;
      }
    }
    .col_content {
        &:nth-child(1) {
          width: 15%;
        }
        &:nth-child(2) {
          padding-left: 8px;
          padding-right: 10px;
          width: 52%;
          h2 {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1; //行数
            -webkit-box-orient: vertical;
            color: #333;
            font-size: 14px;
            line-height: 24px;
            margin-bottom: 4px;
          }
          p {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2; //行数
            -webkit-box-orient: vertical;
            color: #999;
            font-size: 12px;
          }
        }
        &:nth-child(3) {
          font-size: 10px;
          color: #656565;
          text-align: right;
          line-height: 24px;
        }
      }
  }
  .vl_t_b_list {
      padding-top: 18px;
      height: 85px;
  }
  .no_data {
    width: 100%;
    text-align: center;
    padding: 20px 0;
    border-bottom: 1px solid #F2F2F2;
  }
  a {
    cursor: pointer;
  }
}
.task_popover {
  max-height: calc(100% - 100px);
  height: calc(100% - 100px);
  padding: 12px 0;
}
.alarm_popover {
  max-height: calc(100% - 100px);
  height: calc(100% - 100px);
  padding: 12px 0;
}
.show_box {
  display: none!important;
}
.person_info {
  height: auto !important;
}
/* .el-popover {
  max-height: 476px;
  padding: 12px 0;
} */
</style>

