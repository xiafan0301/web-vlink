<template>
  <!-- 新建布控、编辑布控、复用布控公用页面 -->
  <div class="control_add">
    <!-- 面包屑 -->
    <!-- 编辑布控时出现 -->
    <!-- <div class="breadcrumb_heaer" v-if="pageType === 2">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>布控</el-breadcrumb-item>
        <el-breadcrumb-item  @click.native="skipIsList" class="con_back">布控管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑布控</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <div :class="['create_box', {'editor': pageType !== 2}]">
      <!-- 编辑布控时出现 -->
      <!-- <div v-if="pageType === 2" class="create_num"><span class="vl_f_666">布控编号：</span><span class="vl_f_333">{{controlDetail.surveillanceNo}}</span></div> -->
      <div class="create_content">
        <el-form ref="createForm" :label-position="labelPosition" :model="createForm" class="create_form">
          <el-form-item class="create_form_one" style="margin-bottom: 0;">
            <el-form-item label="布控名称:" prop="controlName" style="width: 25%;" :rules="{required: true, message: '请输入布控名称', trigger: 'blur'}">
              <el-input v-model="createForm.controlName" maxlength="20" @blur="getControlInfoByName"></el-input>
            </el-form-item>
            <el-form-item label="关联事件:" prop="event" style="width: 25%;">
              <el-select 
                v-model="createForm.event"
                filterable 
                placeholder="请输入关联事件编号"
                :disabled="($route.query.eventId ? true : false) || (controlDetail.eventId && pageType === 2)"
                >
                <el-option
                  v-for="item in eventList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="布控类型:" style="width: 25%;" prop="controlType" :rules="{required: true, message: '请选择布控类型', trigger: 'change'}">
              <el-select value-key="uid" v-model="createForm.controlType" filterable placeholder="请选择">
                <el-option
                  v-for="item in controlTypeList"
                  :key="item.uid"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="createForm.controlType === 1" label="布控日期:" prop="controlDate" style="width: 25%;" :rules="{required: true, message: '请选择布控日期', trigger: 'blur'}">
              <el-date-picker
                style="width: 192px;"
                class="vl_date"
                :clearable="false"
                v-model="createForm.controlDate"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="告警级别:" prop="controlAlarmId" style="width: 25%;margin-bottom: 10px;" :rules="{required: true, message: '请选择告警级别', trigger: 'change'}">
              <el-select value-key="uid" v-model="createForm.controlAlarmId" filterable placeholder="请选择">
                <el-option
                  v-for="item in controAlarmList"
                  :key="item.uid"
                  :label="item.enumValue"
                  :value="item.enumField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item class="period_time_box" style="margin-bottom: 26px;">
            <div v-for="(item, index) in createForm.periodTime" :key="index" style="position: relative;" class="period_time">
              <el-form-item style="margin-bottom: 0;" :label="index === 0 ? '布控时间段（最多可设置5个时间段）:' : ''" :prop="'periodTime.' + index + '.startTime'" :rules="{ required: true, message: '请选择起始时间', trigger: 'blur'}" >
                <el-time-picker
                  placeholder="起始时间"
                  v-model="item.startTime"
                  :picker-options="{
                    start: '00:00:00',
                    step: '00:01:00',
                    end: '23:59:59'
                  }">
                </el-time-picker>
              </el-form-item>
              <span class="vl_f_666">-</span>
              <el-form-item style="margin-bottom: 0;" :prop="'periodTime.' + index + '.endTime'" :rules="{ required: true, message: '请选择结束时间', trigger: 'blur'}" >
                <el-time-picker
                  placeholder="结束时间"
                  v-model="item.endTime"
                  :picker-options="{
                    start: '00:00:00',
                    step: '00:01:00',
                    end: '23:59:59',
                    minTime: item.startTime
                  }">
                </el-time-picker>
              </el-form-item>
            </div>
            <el-form-item class="period_time_btn_box">
              <div class="period_time_btn" @click="addPeriodTime()"><i class="vl_icon vl_icon_control_22"></i><span>添加布控时间段</span></div>
              <div v-if="createForm.periodTime.length > 1" class="period_time_btn" @click="removePeriodTime()"><i class="vl_icon vl_icon_control_28"></i><span>删除布控时间段</span></div>
            </el-form-item>
          </el-form-item>
          <el-form-item class="period_time_box" style="margin-bottom: 6px;">
            <div v-for="(item, index) in createForm.cellphoneMessages" :key="index" style="position: relative;" class="period_time">
              <el-form-item style="margin-bottom: 0;" :label="index === 0 ? '短信联动:' : ''" :prop="'cellphoneMessages.' + index + '.recipient'" :rules="{ required: true, message: '请输入短信接收人', trigger: 'blur'}" >
                <el-input v-model="item.recipient" placeholder="短信接收人"></el-input>
              </el-form-item>
              <span class="vl_f_666">-</span>
              <el-form-item style="margin-bottom: 0;" :prop="'cellphoneMessages.' + index + '.phone'" :rules="{ required: true, message: '请输入手机号码', trigger: 'blur'}" >
                <el-input v-model="item.phone" placeholder="手机号码"></el-input>
              </el-form-item>
            </div>
            <el-form-item class="period_time_btn_box">
              <div class="period_time_btn" @click="addCellphoneMessages()"><i class="vl_icon vl_icon_control_22"></i><span>添加短信联动</span></div>
              <div v-if="createForm.cellphoneMessages.length > 1" class="period_time_btn" @click="removeCellphoneMessages()"><i class="vl_icon vl_icon_control_28"></i><span>删除短信联动</span></div>
            </el-form-item>
          </el-form-item>
          <el-form-item class="bl_box">
            <el-form-item label="是否级联:">
              <el-select value-key="uid" v-model="createForm.cascade" filterable placeholder="请选择">
                <el-option
                  v-for="item in cascadeList"
                  :key="item.uid"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="共享布控:">
              <el-select value-key="uid" v-model="createForm.sharedControl" filterable placeholder="请选择">
                <el-option
                  v-for="item in sharedControlList"
                  :key="item.uid"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="布控原因:" class="control_reason">
            <el-input v-model="createForm.controlReason" type="textarea" placeholder="请输入布控原因"></el-input>
          </el-form-item>
          <div class="create_model">
            <span class="vl_f_666">分析模型：</span>
            <div class="create_model_box">
              <div class="model_checkbox">
                <el-radio-group v-model="modelType">
                  <el-radio :label="1">人员失踪</el-radio>
                  <el-radio :label="2">重大活动布控</el-radio>
                  <el-radio :label="3">上访人员拦截</el-radio>
                  <el-radio :label="4">重点区域布控</el-radio>
                  <el-radio :label="5">公务车辆监管</el-radio>
                  <el-radio :label="6">自定义</el-radio>
                </el-radio-group>
              </div>
              <div is="modelOne" v-if="modelType === 1"></div>
              <div is="modelTwo" v-if="modelType === 2"></div>
              <div is="modelThree" v-if="modelType === 3"></div>
              <div is="modelFour" v-if="modelType === 4"></div>
              <div is="modelFive" v-if="modelType === 5"></div>
              <div is="modelSix" v-if="modelType === 6"></div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog
      :visible.sync="toGiveUpDialog"
      :close-on-click-modal="false"
      width="482px"
      top="40vh">
      <h4>是否放弃本次操作？</h4>
      <div slot="footer">
        <el-button :loading="loadingBtn" @click="skipIsList" class="btn_140" type="primary">放弃</el-button>
        <el-button class="btn_140" @click="toGiveUpDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {modelOne,modelTwo,modelThree,modelFour,modelFive,modelSix} from './components/modelType.js';
import {getAllMonitorList, getControlInfoByName, addControl, getControlDetailIsEditor, putControl} from '@/views/index/api/api.control.js';
import {getEventList, getEventDetail, updateEvent} from '@/views/index/api/api.event.js';
import {formatDate} from '@/utils/util.js';
import {mapXupuxian} from '@/config/config.js';
import {dataList} from '@/utils/data.js';
export default {
  components: {
    modelOne,
    modelTwo,
    modelThree,
    modelFour,
    modelFive,
    modelSix
  },
  data () {
    return {
      pageType: null,//页面类型
      // 表单参数
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      labelPosition: 'top',
      // 布控类型
      controlTypeList: [
        {label: '短期布控', value: 1},
        {label: '长期布控', value: 2}
      ],
      //告警类型
      controAlarmList: this.dicFormater(dataList.alarmLevel)[0].dictList,
      // 布控表单参数
      createForm: {
        controlName: null,
        event: null,
        controlType: 1,
        controlDate: [],
        controlAlarmId: null,
        periodTime: [
          {
            startTime: new Date(2019, 4, 10, 0, 0, 0),
            endTime:  new Date(2019, 4, 10, 23, 59, 59)
          }
        ],
        cellphoneMessages: [
          {
            recipient: null,
            phone:  null
          }
        ],
        cascade: null,
        sharedControl: null,
        controlReason: null
      },
      eventList: [],//关联事件下拉列表
      cascadeList: [],//是否级联下拉列表
      sharedControlList: [],//是否共享布控下拉列表
      modelType: 1,//布控模型类型
      // 弹出框参数
      toGiveUpDialog: false,
      loading: false,
      loadingBtn: false,
      // 布控编辑参数
      controlDetail: {},
    }
  },
  created () {

  },
  mounted () {
    
  },
  methods: {
    // 获取关联事件列表
    getEventList () {
      const params = {
        'where.isSurveillance': false,//没有关联布控的事件
        pageSize: 1000000,
        orderBy: 'report_time',
        order: 'desc'
      }
      getEventList(params).then(res => {
        if (res && res.data) {
          // 过滤掉事件状态为已结束的关联事件和eventCode为null的
          this.eventList = res.data.list.reduce((arr, item) => {
            if (item.eventStatus !== 3 && item.eventCode) {
              const _item = {
                label: item.eventCode,
                value: item.uid,
                eventStatus: item.eventStatus
              }
              arr = [...arr, _item];
              return arr;
            } else {
              return arr;
            }
          }, [])
        }
      })
    },
  
    // 新增时间段
    addPeriodTime() {
      if (this.createForm.periodTime.length === 5) {
        this.$message.error('布控时间段不能超过5个');
        return false;
      }
      this.createForm.periodTime.push({
        startTime: null,
        endTime: null
      });
    },
    // 删除时间段
    removePeriodTime() {
      this.createForm.periodTime.pop();
    },
    // 添加短信联动
    addCellphoneMessages () {
      this.createForm.cellphoneMessages.push(
        {
          recipient: null,
          phone:  null
        }
      );
    },
    // 删除短信联动
    removeCellphoneMessages () {
      this.createForm.cellphoneMessages.pop();
    },
    skipIsList () {
    
    },
    // 通过布控名称获取布控信息，异步查询布控是否存在
    getControlInfoByName () {
      // 编辑布控时，只有布控名称做出改动以后才会异步判断是否存在
      if (this.controlDetail.surveillanceName) {
        if (this.createForm.controlName === this.controlDetail.surveillanceName) {
          return false;
        }
      }
      const name = this.Trim(this.createForm.controlName, 'g');
      if (name) {
        getControlInfoByName({name}).then(res => {
          if (res && res.data) {
            this.$message.error('布控名称已存在');
          }
        })
      }
    },
    // 保存布控任务
    saveControl (formName) {
    
    },
    // 对比布控时间段是否重叠的方法
    isOverlap () {
      let startTimeArr = this.createForm.periodTime.map(m => m.startTime);
      let endTimeArr = this.createForm.periodTime.map(m => m.endTime);
      let begin = startTimeArr.sort();
      let over = endTimeArr.sort();
      if (this.createForm.periodTime.length === 1) {
        return true;
      } else {
        for (let k = 1; k < begin.length; k++) {
          if (begin[k] < over[k-1]) {
            this.$message.error('所选的时间段出现重叠现象，请重新选取！');
            return false;
          } else if (k === begin.length - 1) {
            return true;
          }
        }
      }
    },

   
    // 根据布控id获取布控详情，用于回填数据
    getControlDetailIsEditor (controlId) {
      getControlDetailIsEditor(controlId).then(res => {
    
      })
    },
    // 编辑布控任务
    putControl (formName) {
    
    }
  }
}
</script>
<style lang="scss" scoped>
.control_add{
  width: 100%;
  position: relative;
  .create_box{
    min-height: 738px;
    margin: 0 20px;
    padding: 0 20px 20px;
    background: #fff;
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    .create_num{
      line-height: 40px;
    }
    .create_model{
      .create_model_box{
        padding-bottom: 20px;
        margin-top: 10px;
        border-radius:4px 4px 0px 0px;
        border:1px solid rgba(211,211,211,1);
        .model_checkbox{
          width: 100%;
          height: 44px;
          line-height: 44px;
          padding-left: 15px;
          background:rgba(250,250,250,1);
          border-radius:5px 5px 0px 0px;
          border:1px solid rgba(242,242,242,1);
        }
        .model_height{
          height: 0!important;
          overflow: hidden;
        }
      }
    }
    &.editor{
      margin: 20px 20px;
    }
  }
  .create_f_box{
    position: absolute;
    left: 0;
    bottom: -80px;
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    background: #fff;
    box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03);
    .el-button{
      width: 100px;
      height: 40px;
    }
  }
}
</style>
<style lang="scss">
.control_add{
  .create_form {
    .create_form_one{
      .el-form-item__content{
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 10px;
        .el-form-item{
          padding-right: 10px;
          .el-input__inner, .el-select{
            width: 100%!important;
          }
          .el-form-item__label{
            padding-bottom: 0!important;
          }
          .el-date-editor--time .el-input__inner{
            width: 100%!important;
            padding-right: 0;
          }
        }
      }
    }
    .el-form-item{
      &:nth-child(4){
        padding-right: 0!important;
      }
      .el-input__inner, .el-select{
        width: 100%!important;
      }
      .el-form-item__label{
        padding-bottom: 0!important;
      }
    }
    .model_checkbox label.is_checked{
      border-bottom: 2px solid #0C70F8;
      .el-checkbox__label{
        color: #409EFF;
      }
    }
    .period_time_box .el-form-item__content{
      display: flex;
      flex-wrap: wrap;
      .period_time{
        width: 25%;
        display: flex;
        margin-top: 20px;
        padding-right: 10px;
        > span{
          margin: 0 3px;
        }
        > .el-form-item{
          padding-right: 0!important;
          & > .el-form-item__label:nth-child(1){
            width: 330px;
            position: absolute;
            left: 0;
            top: -40px;
          }
        }
        .el-form-item__content{
          .el-date-editor{
            width: 100%!important;
          }
        }
        &:nth-child(4){
          padding-right: 0!important;
        }
      }
      .period_time_btn_box{ 
        margin-bottom: 0!important;
        padding-right: 38px!important;
        padding-top: 20px;
        &.top{
          padding-top: 20px;
        }
        .el-form-item__content{
          display: flex;
          .period_time_btn{
            width: 164px;
            height:40px;
            line-height:40px;
            text-align: center;
            border-radius:4px;
            border:1px dashed rgba(217,217,217,1);
            cursor: pointer;
            &:nth-child(1){
              color: #0C70F8;
              margin-right: 10px;
            }
            &:nth-child(2){
              color: #F94539;
            }
            .vl_icon_control_22{
              vertical-align: middle;
              margin-bottom: 5px;
              margin-right: 5px;
            }
            .vl_icon_control_28{
              vertical-align: middle;
              margin-bottom: 7px;
              margin-right: 5px;
            }
          }
        }
      }
    }
    .bl_box{
      margin-bottom: 6px;
      .el-form-item__content{
        display: flex;
        .el-form-item{
          width: 25%;
          padding-right: 10px;
        }
      }
    }
    .control_reason{
      width: 50%;
      padding-right: 10px;
    }
  }
}
</style>
