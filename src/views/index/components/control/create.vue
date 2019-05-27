<template>
  <!-- 新建布控、编辑布控、复用布控公用页面 -->
  <div class="control_create">
    <!-- 面包屑 -->
    <!-- 编辑布控时出现 -->
    <div class="breadcrumb_heaer" v-if="pageType === 2">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>布控</el-breadcrumb-item>
        <el-breadcrumb-item  @click.native="skipIsList" class="con_back">布控管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑布控</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div :class="['create_box', {'editor': pageType !== 2}]">
      <!-- 编辑布控时出现 -->
      <div v-if="pageType === 2" class="create_num"><span class="vl_f_666">布控编号：</span><span class="vl_f_333">{{controlDetail.surveillanceNo}}</span></div>
      <div class="create_content">
        <el-form ref="createForm" :label-position="labelPosition" :model="createForm" class="create_form">
          <el-form-item class="create_form_one" style="margin-bottom: 0;">
            <el-form-item label="布控名称:" prop="controlName" style="width: 25%;margin-bottom: 22px;" :rules="{required: true, message: '请输入布控名称', trigger: 'blur'}">
              <el-input v-model="createForm.controlName" maxlength="20" @blur="getControlInfoByName"></el-input>
            </el-form-item>
            <el-form-item label="关联事件:" prop="event" style="width: 25%;">
              <el-select
                :disabled="($route.query.eventId ? true : false) || pageType === 2"
                v-model="createForm.event"
                filterable
                remote
                clearable
                value-key="value"
                placeholder="请输入关联事件编号"
                :remote-method="getEventList"
                :loading="loading">
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
                v-model="createForm.controlDate"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
            <div v-for="(item, index) in createForm.periodTime" :key="index" style="width: 25%;position: relative;" :class="['period_time', {'top': index === 4}, {'one': index === 0 && (createForm.controlType === 2 || createForm.controlType === null)}]">
              <el-form-item style="width: 48%;margin-bottom: 0;" :label="index === 0 ? '布控时间段（最多可设置5个时间段）' : ''" :prop="'periodTime.' + index + '.startTime'" :rules="{ required: true, message: '请选择起始时间', trigger: 'blur'}" >
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
              <el-form-item style="width: 48%;margin-bottom: 0;" :prop="'periodTime.' + index + '.endTime'" :rules="{ required: true, message: '请选择结束时间', trigger: 'blur'}" >
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
            <el-form-item class="period_time_btn_box" :class="{'top': (createForm.periodTime.length === 4 || createForm.periodTime.length === 5)}">
              <div class="period_time_btn" @click="addPeriodTime()"><i class="vl_icon vl_icon_control_22"></i><span>添加布控时间段</span></div>
              <div v-if="createForm.periodTime.length > 1" class="period_time_btn" @click="removePeriodTime()"><i class="vl_icon vl_icon_control_28"></i><span>删除布控时间段</span></div>
            </el-form-item>
          </el-form-item>
          <el-form-item label="告警级别（在地图上显示颜色 ）:" prop="controlAlarmId" style="width: 25%;margin-bottom: 22px;" :rules="{required: true, message: '请选择告警级别', trigger: 'change'}">
            <el-select value-key="uid" v-model="createForm.controlAlarmId" filterable placeholder="请选择">
              <el-option
                v-for="item in controAlarmList"
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
                  <el-checkbox label="人员追踪" @change="modelType = '1';modelDOne = modelDOne ? modelDOne : 1" :class="{'is_checked': modelType === '1'}"></el-checkbox>
                  <el-checkbox label="车辆追踪" @change="modelType = '2';modelDTwo = modelDTwo ? modelDTwo : 1" :class="{'is_checked': modelType === '2'}"></el-checkbox>
                  <el-checkbox label="越界分析" @change="modelType = '3';modelDThree = modelDThree ? modelDThree : 1" :class="{'is_checked': modelType === '3'}"></el-checkbox>
                  <el-checkbox label="范围分析" @change="modelType = '4';modelDFour = modelDFour ? modelDFour : 1" :class="{'is_checked': modelType === '4'}"></el-checkbox>
                </el-checkbox-group>
              </div>
              <template v-if="allDevData && allDevData.length > 0">
                <!-- 人员追踪 -->
                <div v-if="pageType === 1 || ((pageType === 2 || pageType === 3) && modelDOne)" is="model" ref="mapOne" :class="{'model_height': modelType !== '1'}" :allDevData="allDevData" mapId="mapOne" :modelType="'1'" :checkList="checkList" @sendModelDataOne="getModelDataOne" :modelDataOne="modelDOne" :operateType="pageType"></div>
                <!-- 车辆追踪 -->
                <div v-if="pageType === 1 || ((pageType === 2 || pageType === 3) && modelDTwo)" is="model" ref="mapTwo" :class="{'model_height': modelType !== '2'}" :allDevData="allDevData" mapId="mapTwo" :modelType="'2'" :checkList="checkList" @sendModelDataTwo="getModelDataTwo" :modelDataTwo="modelDTwo" :operateType="pageType"></div>
                <!-- 范围分析 -->
                <div v-if="pageType === 1 || ((pageType === 2 || pageType === 3) && modelDFour)" is="model" ref="mapFour" :class="{'model_height': modelType !== '4'}" :allDevData="allDevData" mapId="mapFour" :modelType="'4'" :checkList="checkList" @sendModelDataFour="getModelDataFour" :modelDataFour="modelDFour" :operateType="pageType"></div>
              </template>
              <!-- 越界分析 -->
              <div v-if="pageType === 1 || ((pageType === 2 || pageType === 3) && modelDThree)" is="model" ref="mapThree" :class="{'model_height': modelType !== '3'}" mapId="mapThree" :modelType="'3'" :checkList="checkList" @sendModelDataThree="getModelDataThree" :modelDataThree="modelDThree" :operateType="pageType" ></div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="create_f_box">
      <!-- 新增布控 -->
      <el-button v-if=" pageType !== 2" type="primary" :loadingBtn="loadingBtn" @click="saveControl('createForm')">保存</el-button>
      <!-- 编辑布控 -->
      <el-button v-if="pageType === 2" type="primary" :loadingBtn="loadingBtn" @click="putControl('createForm')">保存</el-button>
      <el-button  @click="toGiveUpDialog = true">取消</el-button>
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
import {getAllMonitorList, getControlInfoByName, addControl, getControlDetailIsEditor, putControl} from '@/views/index/api/api.control.js';
import {getEventList, getEventDetail, updateEvent} from '@/views/index/api/api.event.js';
import {formatDate} from '@/utils/util.js';
import {mapXupuxian} from '@/config/config.js';
import {dataList} from '@/utils/data.js';
export default {
  components: {model},
  props: ['createType', 'controlId'],
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
      controlTypeList: [
        {label: '短期布控', value: 1},
        {label: '长期布控', value: 2}
      ],//布控类型
      controAlarmList: this.dicFormater(dataList.alarmLevel)[0].dictList.map(m => {
        return {
          value: parseInt(m.enumField),
          label: m.enumValue
        }
      }),//告警类型
      createForm: {
        controlName: null,
        event: null,
        controlType: null,
        controlDate: [],
        controlAlarmId: null,
        periodTime: [
          {
            startTime: new Date(2019, 4, 10, 0, 0, 0),
            endTime:  new Date(2019, 4, 10, 23, 59, 59)
          }
        ],
      },
      eventList: [],
      // 分析模型数据
      allDevData: [],//传给分析模型的所有设备点位
      checkList: [],//多选
      modelType: null,//模型类型序号
      modelDataOne: null,// 人员追踪数据
      modelDataTwo: null,// 车辆追踪数据
      modelDataThree: null,// 越界分析数据
      modelDataFour: null,// 范围分析数据
      // 弹出框参数
      toGiveUpDialog: false,
      loading: false,
      loadingBtn: false,
      // 布控编辑参数
      controlDetail: {},
      modelDOne: null,//传给子组件的回填数据-人员追踪
      modelDTwo: null,//传给子组件的回填数据-车辆追踪
      modelDThree: null,//传给子组件的回填数据-越界分析
      modelDFour: null,//传给子组件的回填数据-范围分析
      // 事件模块新增布控参数
      eventDetail: null,
    }
  },
  created () {
    // this.getDiciData();
    this.getAllMonitorList();
    // 编辑页-2
    if (this.createType) {
      this.pageType = parseInt(this.createType);
      if (this.pageType === 2) {
        this.getControlDetailIsEditor(this.controlId);
      }
      this.getEventList();
    // 新增页-1
    } else {
      this.pageType = 1;
    }
    // 复用页-3
    if (this.$route.query.createType) {
      this.pageType = parseInt(this.$route.query.createType);
      this.getControlDetailIsEditor(this.$route.query.controlId);
      this.getEventList();
    }
    // 事件管理模块通过路由跳转过来
    if (this.$route.query.eventId) {
      this.getEventDetail(this.$route.query.eventId);
    }
  },
  mounted () {
    this.getTimeAfter();
  },
  methods: {
    // 获取事件详情
    getEventDetail (eventId) {
      getEventDetail(eventId).then(res => {
        if (res && res.data) {
          this.eventDetail = res.data;
          this.createForm.event = res.data.uid;
          this.getEventList();
        }
      })
    },
    // 获取下个月的今天
    getTimeAfter() { 
      var dd = new Date();
      function checkT(s) {
          return s < 10 ? '0' + s: s;
      }
      dd.setDate(dd.getDate() + 30);//获取AddDayCount天后的日期 
      var y = dd.getFullYear(); 
      var m = dd.getMonth()+1;//获取当前月份的日期 
      var d = dd.getDate();
      const date = y+"-"+checkT(m)+"-"+checkT(d);
      this.createForm.controlDate = [formatDate(new Date(), 'yyyy-MM-dd'), date];
    },
    // 获取关联事件列表
    getEventList (query) {
      const params = {
        'where.eventCode': query,
        'where.isSurveillance': false,//没有关联布控的事件
        pageSize: 1000000,
        orderBy: 'report_time',
        order: 'desc'
      }
      getEventList(params).then(res => {
        if (res && res.data) {
          // 过滤掉事件状态为已结束的关联事件
          this.eventList = res.data.list.filter(f => f.eventStatus !== 3).map(m => {
            return {
              label: m.eventCode,
              value: m.uid,
              eventStatus: m.eventStatus
            }
          });
        }
      })
    },
    // 获取所有监控设备列表
    getAllMonitorList () {
      const params = {ccode: mapXupuxian.adcode}
      getAllMonitorList(params).then(res => {
        if (res && res.data) {
          this.allDevData = res.data;
          this.allDevData.forEach(f => {
            this.$set(f, 'isSelected', false);
            this.$set(f, 'type', 1);
          });
          console.log(this.allDevData)
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
      this.createForm.periodTime.splice(this.createForm.periodTime.length - 1, 1);
    },
    skipIsList () {
      // 编辑布控任务时
      if (this.pageType === 2) {
        this.$emit('changePageType', 1);
      // 新建、复用布控任务时
      } else {
        this.$router.push({ name: 'control_manage' });
      }
      this.toGiveUpDialog = false;
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
              alarmLevel: this.createForm.controlAlarmId,// 告警级别
              eventId: this.createForm.event,// 事件id
              surveillanceName: this.createForm.controlName,// 布控名称
              surveillanceType: this.createForm.controlType,// 布控类型
              modelList: modelList,// 布控分析模型
              surveillancTimeList: time// 布控时间段
            }
            // 为短期布控时才需要传布控日期
            if (this.createForm.controlType === 1) {
              data.surveillanceDateStart = this.createForm.controlDate && this.createForm.controlDate[0];// 布控开始时间
              data.surveillanceDateEnd = this.createForm.controlDate && this.createForm.controlDate[1];// 布控结束时间
            }
            console.log(JSON.stringify(data) )
            this.loadingBtn = true;
            addControl(data).then(res => {
              if (res && res.data) {
                this.$message.success(this.pageType === 3 ? '复用成功' : '新增成功');
                this.$router.push({ name: 'control_manage' });
              }
            }).finally(() => {
              // 新增布控后，状态为待开始的事件，改为进行中
              const obj = this.eventList.find(f => f.value === this.createForm.event);
              if (obj && obj.eventStatus === 1) {
                updateEvent({uid: obj.value, type: 6});
              }
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
          if (begin[k] < over[k-1]) {
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
      this.modelDataOne  = data;
    },
    // 获得子组件传过来的车辆追踪的数据
    getModelDataTwo (data) {
      this.modelDataTwo  = data;
    },
    // 获得子组件传过来的越界分析的数据
    getModelDataThree (data) {
      this.modelDataThree  = data;
    },
    // 获得子组件传过来的范围分析的数据
    getModelDataFour (data) {
      this.modelDataFour  = data;
    },
    // 根据布控id获取布控详情，用于回填数据
    getControlDetailIsEditor (controlId) {
      getControlDetailIsEditor(controlId).then(res => {
        if (res && res.data) {
          this.controlDetail = res.data;
          this.createForm.controlName = this.pageType === 3 ? '复用' + this.controlDetail.surveillanceName : this.controlDetail.surveillanceName;
          this.createForm.event = this.controlDetail.eventId;
          this.createForm.controlType = this.controlDetail.surveillanceType;
          this.createForm.controlDate = this.pageType === 3 ? [] : [this.controlDetail.surveillanceDateStart, this.controlDetail.surveillanceDateEnd]
          this.createForm.controlAlarmId = this.controlDetail.alarmLevel;
          this.createForm.periodTime = this.controlDetail.surveillancTimeList.map(m => {
            return {
              startTime: new Date(2019, 9, 10, m.startTime.split(':')[0], m.startTime.split(':')[1]),
              endTime: new Date(2019, 9, 10, m.endTime.split(':')[0], m.endTime.split(':')[1])
            }
          });
          this.checkList = [];
          if (!this.controlDetail.modelList) return;
          // 勾选分析模型
          this.controlDetail.modelList.forEach(f => {
            if (f.modelType === 1) {
              this.checkList.push('人员追踪');
            } else if (f.modelType === 2) {
              this.checkList.push('车辆追踪');
            } else if (f.modelType === 3) {
              this.checkList.push('越界分析');
            } else if (f.modelType === 4) {
              this.checkList.push('范围分析');
            }
          })
          // 高亮第一个有数据的模型
          if (this.checkList.length > 0) {
            if (this.checkList[0] === '人员追踪') {
              this.modelType = '1';
            } else if (this.checkList[0] === '车辆追踪') {
              this.modelType = '2';
            } else if (this.checkList[0] === '越界分析') {
              this.modelType = '3';
            } else if (this.checkList[0] === '范围分析') {
              this.modelType = '4';
            }
          }
          this.modelList = this.controlDetail.modelList;
          this.modelDOne = this.modelList.find(f => f.modelType === 1);
          this.modelDTwo = this.modelList.find(f => f.modelType === 2);
          this.modelDThree = this.modelList.find(f => f.modelType === 3);
          this.modelDFour = this.modelList.find(f => f.modelType === 4);
          console.log(this.modelDOne, this.modelDTwo, this.modelDThree, this.modelDFour);
        }
      })
    },
    // 编辑布控
    putControl (formName) {
      // 点击保存按钮时清除没勾选的模型类别的验证结果
      if (!this.checkList.some(s => s === '人员追踪')) {
        if (this.$refs.mapOne) {
          this.$refs.mapOne.reset();
        }
      } else if (!this.checkList.some(s => s === '车辆追踪')) {
        if (this.$refs.mapTwo) {
          this.$refs.mapTwo.reset();
        }
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
                console.log(1111)
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
            this.controlDetail.alarmLevel = this.createForm.controlAlarmId;
            this.controlDetail.eventId = this.createForm.event;
            this.controlDetail.surveillanceName = this.createForm.controlName;
            this.controlDetail.surveillanceType = this.createForm.controlType;
            this.controlDetail.modelList = modelList;
            this.controlDetail.surveillancTimeList = time;
            // 为短期布控时才需要传布控日期
            if (this.createForm.controlType === 1) {
              this.controlDetail.surveillanceDateStart = this.createForm.controlDate && this.createForm.controlDate[0];// 布控开始时间
              this.controlDetail.surveillanceDateEnd = this.createForm.controlDate && this.createForm.controlDate[1];// 布控结束时间
            } else {
              this.controlDetail.surveillanceDateStart = null;
              this.controlDetail.surveillanceDateEnd = null;
            }
            console.log(JSON.stringify(this.controlDetail) )
            this.loadingBtn = true;
            putControl(this.controlDetail).then((res) => {
              if (res) {
                this.$message.success('编辑成功');
                this.$emit('getControlList');
              }
            }).finally(() => {
              this.loadingBtn = false;
            })
          }
        } else {
          return false;
        }
      })
    }
  },
  destroyed () {
    this.$refs['mapOne'].isDestroyed();
    this.$refs['mapTwo'].isDestroyed();
    this.$refs['mapThree'].isDestroyed();
    this.$refs['mapFour'].isDestroyed();
  }
}
</script>
<style lang="scss" scoped>
.control_create{
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
.control_create{
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
        .period_time{
          display: flex;
          margin-top: 20px;
          padding-right: 10px;
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
        .period_time.one{
          margin-top: 41px!important;
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
