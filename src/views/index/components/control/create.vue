<template>
<!-- 新建布控、编辑布控、复用布控公用页面 -->
  <div class="control_create">
    <!-- 面包屑 -->
    <!-- 编辑布控时出现 -->
    <div class="breadcrumb_heaer" v-if="type === 2">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>布控</el-breadcrumb-item>
        <el-breadcrumb-item  @click.native="skipIsList" class="con_back">布控管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑布控</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div :class="['create_box', {'editor': type !== 2}]">
      <!-- 编辑布控时出现 -->
      <div v-if="type === 2" class="create_num"><span class="vl_f_666">布控编号：</span><span class="vl_f_333">b19344985</span></div>
      <div class="create_content">
        <el-form ref="createForm" :label-position="labelPosition" :model="createForm" class="create_form">
          <el-form-item class="create_form_one">
            <el-form-item label="布控名称:" prop="controlName" style="width: 25%;" :rules="{required: true, message: '请输入布控名称', trigger: 'blur'}">
              <el-input v-model="createForm.controlName" maxlength="20" @blur="getControlInfoByName"></el-input>
            </el-form-item>
            <el-form-item label="关联事件:" prop="event" style="width: 25%;">
              <el-input v-model="createForm.event"></el-input>
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
                v-model="createForm.controlDate"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
            <div v-for="(item, index) in createForm.periodTime" :key="index" style="width: 25%;position: relative;" :class="['period_time', {'top': index === 4}]">
              <el-form-item :label="index === 0 ? '布控时间段（可分时段布控,最多可设置5个时间段）' : ''" :prop="'periodTime.' + index + '.startTime'" :rules="{ required: true, message: '请选择起始时间', trigger: 'blur'}" >
                <el-time-picker
                  placeholder="起始时间"
                  v-model="item.startTime"
                  :picker-options="{
                    start: '00:00:00',
                    step: '00:01:00',
                    end: '23:00:00'
                  }">
                </el-time-picker>
              </el-form-item>
              <span class="vl_f_666">-</span>
              <el-form-item :prop="'periodTime.' + index + '.endTime'" :rules="{ required: true, message: '请选择结束时间', trigger: 'blur'}" >
                <el-time-picker
                  placeholder="结束时间"
                  v-model="item.endTime"
                  :picker-options="{
                    start: '00:00:00',
                    step: '00:01:00',
                    end: '23:00:00',
                    minTime: item.startTime
                  }">
                </el-time-picker>
              </el-form-item>
            </div>
            <el-form-item class="period_time_btn_box" :class="{'top': (createForm.periodTime.length === 4 || createForm.periodTime.length === 5)}">
              <div class="period_time_btn" @click="addPeriodTime()"><i class="vl_icon vl_icon_control_22"></i><span>添加布控时间段</span></div>
              <div class="period_time_btn" @click="removePeriodTime()"><i class="vl_icon vl_icon_control_28"></i><span>删除布控时间段</span></div>
            </el-form-item>
          </el-form-item>
          <el-form-item label="告警级别（在地图上显示颜色 ）:" prop="controlRank" style="width: 25%;" :rules="{required: true, message: '请选择告警级别', trigger: 'change'}">
            <el-select value-key="uid" v-model="createForm.controlRank" filterable placeholder="请选择">
              <el-option
                v-for="item in controlRankList"
                :key="item.uid"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="create_model">
            <span class="vl_f_666">分析模型：</span>
            <div class="create_model_box">
              <div class="model_checkbox">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox label="人员追踪" @click.native="modelType = '1'" :class="{'is_checked': modelType === '1'}"></el-checkbox>
                  <el-checkbox label="车辆追踪" @click.native="modelType = '2'" :class="{'is_checked': modelType === '2'}"></el-checkbox>
                  <el-checkbox label="越界分析" @click.native="modelType = '3'" :class="{'is_checked': modelType === '3'}"></el-checkbox>
                  <el-checkbox label="范围分析" @click.native="modelType = '4'" :class="{'is_checked': modelType === '4'}"></el-checkbox>
                </el-checkbox-group>
              </div>
              <!-- 人员追踪 -->
              <div is="model" ref="mapOne" v-show="modelType === '1'" mapId="mapOne" :modelType="modelType" :checkList="checkList" @sendModelDataOne="getModelDataOne"></div>
              <!-- 车辆追踪 -->
              <div is="model" ref="mapTwo" v-show="modelType === '2'" mapId="mapTwo" :modelType="modelType" :checkList="checkList" @sendModelDataTwo="getModelDataTwo"></div>
              <!-- 越界分析 -->
              <div is="model" ref="mapThree" v-show="modelType === '3'" mapId="mapThree" :modelType="modelType" :checkList="checkList" @sendModelDataThree="getModelDataThree"></div>
              <!-- 范围分析 -->
              <div is="model" ref="mapFour" v-show="modelType === '4'" mapId="mapFour" :modelType="modelType" :checkList="checkList" @sendModelDataFour="getModelDataFour"></div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="create_f_box">
      <el-button type="primary" @click="toGiveUpDialog = true">返回</el-button>
      <el-button :loadingBtn="loadingBtn" @click="saveControl('createForm')">保存</el-button>
    </div>
    <el-dialog
      :visible.sync="toGiveUpDialog"
      :close-on-click-modal="false"
      width="482px"
      top="40vh">
      <h4>是否放弃本次操作？</h4>
      <div slot="footer">
        <el-button :loading="loadingBtn" @click="skipIsList">放弃</el-button>
        <el-button  type="primary" @click="toGiveUpDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import model from './components/model.vue';
import {getControlInfoByName, addControl} from '@/views/index/api/api.js';
import {formatDate} from '@/utils/util.js';
export default {
  components: {model},
  props: ['createType'],
  data () {
    return {
      type: null,//页面类型
      // 表单参数
      labelPosition: 'top',
      controlTypeList: [
        {label: '短期布控', value: 1},
        {label: '长期布控', value: 2}
      ],//布控类型
      controlRankList: [
        {label: '一级', value: 0},
        {label: '二级', value: 1},
        {label: '三级', value: 2},
        {label: '四级', value: 3},
        {label: '五级', value: 4}
      ],//告警类型
      createForm: {
        controlName: null,
        event: null,
        controlType: null,
        controlDate: null,
        controlRank: null,
        periodTime: [
          {
            startTime: null,
            endTime: null
          }
        ],
      },
      // 分析模型数据
      checkList: ['人员追踪'],
      modelType: '1',//模型类型序号
      modelDataOne: null,// 人员追踪数据
      modelDataTwo: null,// 车辆追踪数据
      modelDataThree: null,// 越界分析数据
      modelDataFour: null,// 范围分析数据
      // 弹出框参数
      toGiveUpDialog: false,
      loadingBtn: false
    }
  },
  created () {
    // 编辑页-2
    if (this.createType) {
      this.type = this.createType;
    }
    // 复用页-3
    if (this.$route.query.createType) {
      this.type = parseInt(this.$route.query.createType);
    }
  },
  methods: {
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
      if (this.createForm.periodTime.length === 1) {
        this.$message.error('至少要有一个布控时间段');
        return false;
      }
      this.createForm.periodTime.splice(this.createForm.periodTime.length - 1, 1);
    },
    skipIsList () {
      // 编辑布控任务时
      if (this.type === 2) {
        this.$emit('changePageType', 1);
      // 新建、复用布控任务时
      } else {
        this.$router.push({ name: 'control_manage' });
      }
      this.toGiveUpDialog = false;
    },
    // 通过布控名称获取布控信息，异步查询布控是否存在
    getControlInfoByName () {
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
      // 点击保存按钮时清除没勾选的模型类别的验证结果
      if (!this.checkList.some(s => s === '人员追踪')) {
        this.$refs.mapOne.reset();
      } else if (!this.checkList.some(s => s === '车辆追踪')) {
        this.$refs.mapTwo.reset();
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //验证所选时间段是否出现重叠
          const isThrough = this.isOverlap();
          if (!isThrough) {
            return false;
          } else {
            console.log('验证通过');
            const modelList = [];
            this.checkList.forEach(f => {
              if (f === '人员追踪') {
                this.$refs.mapOne.validateModelOne();
                modelList.push(this.modelDataOne);
              } else if (f === '车辆追踪') {
                this.$refs.mapTwo.validateModelTwo();
                modelList.push(this.modelDataTwo);
              } else if (f === '越界分析') {
                this.$refs.mapThree.validateModelThree();
                modelList.push(this.modelDataThree);
              } else if (f === '范围分析') {
                this.$refs.mapFour.validateModelFour();
                modelList.push(this.modelDataFour);
              }
            })
            if (this.checkList.some(s => s === '人员追踪') && !this.modelDataOne) {
              return false;
            } else if (this.checkList.some(s => s === '车辆追踪') && !this.modelDataTwo) {
              return false;
            } else if (this.checkList.some(s => s === '越界分析') && !this.modelDataThree) {
              return false;
            } else if (this.checkList.some(s => s === '范围分析') && !this.modelDataFour) {
              return false;
            }
            const time = this.createForm.periodTime.map(m => {
              return {
                startTime: formatDate(m.startTime, 'HH:mm:ss'),
                endTime: formatDate(m.endTime, 'HH:mm:ss')
              }
            })
            let data = {
              alarmLevel: this.createForm.controlRank,// 告警级别
              eventId: parseInt(this.createForm.event),// 事件id
              surveillanceDateStart: this.createForm.controlDate && this.createForm.controlDate[0],// 布控开始时间
              surveillanceDateEnd: this.createForm.controlDate && this.createForm.controlDate[1],// 布控结束时间
              surveillanceName: this.createForm.controlName,// 布控名称
              surveillanceType: this.createForm.controlType,// 布控类型
              modelList: modelList,// 布控分析模型
              surveillancTimeList: time// 布控时间段
            }
            console.log(JSON.stringify(data) )
            this.loadingBtn = true;
            addControl(data).then(res => {
              if (res && res.data) {
                this.$message.success('新增成功');
                this.$router.push({ name: 'control_manage' });
              }
            }).finally(() => {
              this.loadingBtn = false;
            })
          }
        } else {
          return false;
        }
      })
    },
    // 对比布控时间段是否重叠的方法
    isOverlap () {
      console.log(this.createForm.periodTime);
      let startTimeArr = this.createForm.periodTime.map(m => m.startTime);
      let endTimeArr = this.createForm.periodTime.map(m => m.endTime);
      let begin = startTimeArr.sort();
      let over = endTimeArr.sort();
      if (this.createForm.periodTime.length === 1) {
        return true;
      } else {
        for (let k = 1; k < begin.length; k++) {
          if (begin[k] <= over[k-1]) {
            this.$message.error('所选的时间段出现重叠现象，请重新选取！');
            return false;
          } else if (k === begin.length - 1) {
            return true;
          }
        }
      }
    },
    // 获得子组件传过来的人员追踪的数据
    getModelDataOne (data) {
      console.table(data);
      this.modelDataOne  = data;
    },
    // 获得子组件传过来的车辆追踪的数据
    getModelDataTwo (data) {
      console.table(data);
      this.modelDataTwo  = data;
    },
    // 获得子组件传过来的越界分析的数据
    getModelDataThree (data) {
      console.table(data);
      this.modelDataThree  = data;
    },
    // 获得子组件传过来的范围分析的数据
    getModelDataFour (data) {
      console.table(data);
      this.modelDataFour  = data;
    },
  }
}
</script>
<style lang="scss" scoped>
.control_create{
  width: 100%;
  position: relative;
  .create_box{
    min-height: 875px;
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
.control_create{
  .create_form {
    .create_form_one{
      .el-form-item__content{
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 10px;
        .el-form-item{
          padding-right: 40px;
          .el-input__inner, .el-select{
            width: 100%!important;
          }
          .el-form-item__label{
            padding-bottom: 0!important;
          }
        }
        .period_time{
          display: flex;
          margin-top: 40px;
          padding-right: 40px;
          > span{
            margin: 0 9px;
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
        }
        .period_time.top{
          margin-top: 20px!important;
        }
      }
      .period_time_btn_box{ 
        margin-bottom: 0!important;
        padding-right: 38px!important;
        padding-top: 40px;
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
              margin-right: 25px;
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
    .el-form-item{
      padding-right: 20px;
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
  }
}
</style>
