<template>
  <!-- 新建布控、编辑布控、复用布控公用页面 -->
  <div class="control_add">
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
      <div v-if="pageType === 2" class="create_num"><span class="vl_f_666">布控编号：</span><span class="vl_f_333">{{detail.surveillanceNo}}</span></div>
      <div class="create_content">
        <el-form ref="createForm" :label-position="labelPosition" :model="createForm" class="create_form">
          <el-form-item class="create_form_one" style="margin-bottom: 0;">
            <el-form-item label="布控名称:" prop="surveillanceName" style="width: 25%;margin-bottom: 10px;" :rules="{required: true, message: '请输入布控名称', trigger: 'blur'}">
              <el-input v-model="createForm.surveillanceName" maxlength="20" @blur="getControlInfoByName"></el-input>
            </el-form-item>
            <el-form-item label="关联事件:" prop="eventId" style="width: 25%;">
              <el-select 
                v-model="createForm.eventId"
                filterable 
                placeholder="请输入关联事件编号"
                :disabled="($route.query.eventId ? true : false) || (detail.eventId && pageType === 2)"
                >
                <el-option
                  v-for="item in eventList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="布控类型:" style="width: 25%;" prop="surveillanceType" :rules="{required: true, message: '请选择布控类型', trigger: 'change'}">
              <el-select value-key="uid" v-model="createForm.surveillanceType" filterable placeholder="请选择">
                <el-option
                  v-for="item in controlTypeList"
                  :key="item.uid"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="createForm.surveillanceType === 1" label="布控日期:" prop="controlDate" style="width: 25%;" :rules="{required: true, message: '请选择布控日期', trigger: 'blur'}">
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
            <el-form-item label="告警级别:" prop="alarmLevel" style="width: 25%;margin-bottom: 10px;" :rules="{required: true, message: '请选择告警级别', trigger: 'change'}">
              <el-select value-key="uid" v-model="createForm.alarmLevel" filterable placeholder="请选择">
                <el-option
                  v-for="item in controAlarmList"
                  :key="item.enumField"
                  :label="item.enumValue"
                  :value="item.enumField">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item class="period_time_box" style="margin-bottom: 0;" label="布控时间段（最多可设置5个时间段）" :rules="{ required: true, message: null, trigger: 'blur'}">
            <el-form-item  v-for="(item, index) in createForm.surveillancTimeList" :key="index" :prop="'surveillancTimeList.' + index + '.times'" :rules="{ required: true, message: '请选择布控时间段', trigger: 'blur'}" >
              <el-time-picker
                is-range
                arrow-control
                :clearable="false"
                v-model="item.times"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围">
              </el-time-picker>
              <i class="el-icon-remove" @click="removePeriodTime(index)"></i> 
            </el-form-item>
            <el-form-item class="period_time_btn_box">
              <div v-if="createForm.surveillancTimeList.length < 5" class="period_time_btn" @click="addPeriodTime()"><i class="vl_icon vl_icon_control_22"></i><span>添加布控时间段</span></div>
            </el-form-item>
          </el-form-item>
          <el-form-item class="period_time_box" style="margin-bottom: 0px;" label="短信联动:">
            <div class="contact_list" v-for="(item, index) in createForm.contactList" :key="index">
              <div class="contact">
                <el-form-item style="margin-bottom: 0;" :prop="'contactList.' + index + '.contact'" :rules="{validator: validName, trigger: 'blur'}">
                  <el-input v-model="item.contact" placeholder="短信接收人" maxlength="5"></el-input>
                </el-form-item>
                <span class="vl_f_666">与</span>
                <el-form-item style="margin-bottom: 0;" :prop="'contactList.' + index + '.mobile'" :rules="{validator: validPhone, trigger: 'blur'}">
                  <el-input v-model="item.mobile" placeholder="手机号码"></el-input>
                </el-form-item>
              </div>
              <i class="el-icon-remove" @click="removeCellphoneMessages(index)"></i>
            </div>
            <el-form-item class="period_time_btn_box">
              <div v-if="createForm.contactList.length < 5" class="period_time_btn" @click="addCellphoneMessages()"><i class="vl_icon vl_icon_control_22"></i><span>添加短信联动</span></div>
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
            <el-form-item v-if="createForm.cascade === 1" label="请选择下级平台:">
              <el-select value-key="uid" multiple collapse-tags v-model="createForm.cascadePlatform" filterable placeholder="请选择">
                <el-option
                  v-for="item in cascadePlatformList"
                  :key="item.uid"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item class="bl_box">
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
            <el-form-item v-if="createForm.sharedControl === 1" label="请选择共享对象:">
              <el-select value-key="uid" multiple collapse-tags v-model="createForm.shareDept" filterable placeholder="请选择">
                <el-option
                  v-for="item in shareDeptList"
                  :key="item.uid"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="布控原因:" class="control_reason">
            <el-input v-model="createForm.surveillanceReason" type="textarea" placeholder="请输入布控原因"  maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <div class="create_model">
            <span class="vl_f_666">分析模型：</span>
            <div class="create_model_box">
              <div class="model_checkbox">
                <el-radio-group v-model="modelType_" @change="changeModel">
                  <el-radio :label="1">人员失踪</el-radio>
                  <el-radio :label="2">重大活动布防</el-radio>
                  <el-radio :label="3">上访人员拦截</el-radio>
                  <el-radio :label="4">重点区域布防</el-radio>
                  <el-radio :label="5">公务车辆监管</el-radio>
                  <el-radio :label="6">自定义</el-radio>
                </el-radio-group>
              </div>
              <div is="modelOne" v-if="modelType === 1" ref="model" @getModel="getModel" :modelList="modelList"></div>
              <div is="modelTwo" v-if="modelType === 2" ref="model" @getModel="getModel" :modelList="modelList"></div>
              <div is="modelThree" v-if="modelType === 3" ref="model" @getModel="getModel" :modelList="modelList"></div>
              <div is="modelFour" v-if="modelType === 4" ref="model" @getModel="getModel" :modelList="modelList"></div>
              <div is="modelFive" v-if="modelType === 5" ref="model" @getModel="getModel" :modelList="modelList"></div>
              <div is="modelSix" v-if="modelType === 6" ref="model" @getModel="getModel" :modelList="modelList"></div>
            </div>
          </div>
        </el-form>
      </div>
      <div class="footer_btn" v-if="isShowOperateBtn">
        <el-button class="btn_100" v-if=" pageType !== 2" type="primary" :loading="loadingBtn" @click="saveControl('createForm')">保存</el-button>
        <el-button class="btn_100" v-if=" pageType === 2" type="primary" :loading="loadingBtn" @click="putControl('createForm')">保存</el-button>
        <el-button  @click="toGiveUpDialog = true" class="btn_100">取消</el-button>
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
import {getOrganInfos} from '@/views/index/api/api.message.js';
import {getCascadeTypeList} from '@/views/index/api/api.base.js';
import {formatDate, objDeepCopy, unique} from '@/utils/util.js';
import {mapXupuxian} from '@/config/config.js';
import {dataList} from '@/utils/data.js';
import {checkName, validatePhone} from '@/utils/validator.js';
export default {
  components: {
    modelOne,
    modelTwo,
    modelThree,
    modelFour,
    modelFive,
    modelSix
  },
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
      validName: checkName,
      validPhone: validatePhone,
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
        surveillanceName: null,
        eventId: null,
        surveillanceType: 1,
        controlDate: [],
        alarmLevel: '3',
        surveillancTimeList: [
          {
            times: [new Date(2019, 4, 10, 0, 0, 0), new Date(2019, 4, 10, 23, 59, 59)]
          }
        ],
        contactList: [
          {
            contact: null,
            mobile:  null
          }
        ],
        cascade: null,
        cascadePlatform: [],
        sharedControl: null,
        shareDept: [],
        surveillanceReason: null
      },
      eventList: [],//关联事件下拉列表

      cascadeList: [
        {value: 1, label: '是'},
        {value: 0, label: '否'}
      ],//是否级联下拉列表
      cascadePlatformList: [],

      sharedControlList: [
        {value: 1, label: '是'},
        {value: 0, label: '否'}
      ],//是否共享布控下拉列表
      shareDeptList: [],
      
      modelType_: null,//radio单选时，选中的布控模型类型（在布控编辑时，在切换之前需要先将modelList在方法changeModel里置为null，所以使用此变量）
      modelType: null,//布控模型类型
      // 弹出框参数
      toGiveUpDialog: false,
      loading: false,
      loadingBtn: false,
      detail: {},//布控回填对象
      // 布控模型传过来的数据
      modelData: {},
      eventDetail: {},
      modelList: null,
      isShowOperateBtn: true,
    }
  },
  created () {
    // 编辑页-2
    if (this.createType === 2) {
      this.pageType = parseInt(this.createType);
      if (this.pageType === 2) {
        this.getControlDetailIsEditor(this.controlId);
      }
    // 复用页-3
    } else if (this.$route.query.createType) {
      this.pageType = parseInt(this.$route.query.createType);
      this.getControlDetailIsEditor(this.$route.query.controlId);
    // 新增页-1
    } else {
      this.pageType = 1;
      this.modelType = 1;
      this.modelType_ = 1;
      // 从车辆侦查或者人像侦查跳转过来新建布控
      // const {imgurl, modelName, plateNo} = this.$route.query;
      // this.imgurl = imgurl;
      // this.plateNo = plateNo;
      // 事件管理模块通过路由跳转过来新增布控时
      if (this.$route.query.eventId) {
        this.getEventDetail(this.$route.query.eventId);
      }
    }
  },
  mounted () {
    this.getEventList();
    this.getCascadeTypeList();
    this.getOrganInfos();
    this.getTimeAfter();
    this.Bus.$on('sendIsShowOperateBtn', bl => {
      this.isShowOperateBtn = bl;
    })
  },
  methods: {
    // 切换布控模型类型
    changeModel (value) {
      this.modelList = null;
      this.modelType = value;
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
    getEventList () {
      const params = {
        'where.isSurveillance': false,//没有关联布控的事件
        pageSize: 100,
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
    // 获取事件详情
    getEventDetail (eventId) {
      getEventDetail(eventId).then(res => {
        if (res && res.data) {
          this.eventDetail = res.data;
          this.eventList = [{
            label: this.eventDetail.eventCode,
            value: this.eventDetail.uid
          }]
          this.createForm.eventId = this.eventDetail.uid;
        }
      })
    },
    // 获取下级平台列表
    getCascadeTypeList () {
      getCascadeTypeList(2).then(res => {
        if (res && res.data) {
          this.cascadePlatformList = res.data.map(m => {
            return {
              value: m.uid,
              label: m.cascadeName
            }
          });
        }
      })
    },
    // 获取组织机构
    getOrganInfos () {
      const params = {
        pageNum: 1,
        pageSize: 10,
        orderBy: null,
        order: null,
        'where.organName': null,
        'where.proKey': 'd32b803de585906c0ee2f1ac81588a70',
        'where.organLayer': null,
        'where.organPid': null
      }
      getOrganInfos(params).then(res => {
        if (res && res.data) {
          this.shareDeptList = res.data.list;
          this.shareDeptList = this.shareDeptList.map(m => {
            return {
              value: m.uid,
              label: m.organName
            }
          })
        }
      })
    },
    // 新增时间段
    addPeriodTime() {
      this.createForm.surveillancTimeList.push({
        times: [new Date(2019, 4, 10, 0, 0, 0), new Date(2019, 4, 10, 23, 59, 59)]
      });
    },
    // 删除时间段
    removePeriodTime(index) {
      if (this.createForm.surveillancTimeList.length === 1) return this.$message.warning('只剩一个不允许删除');
      this.createForm.surveillancTimeList.splice(index, 1);
    },
    // 添加短信联动
    addCellphoneMessages () {
      this.createForm.contactList.push(
        {
          contact: null,
          mobile:  null
        }
      );
    },
    // 删除短信联动
    removeCellphoneMessages (index) {
      if (this.createForm.contactList.length === 1) return this.$message.warning('只剩一个不允许删除');
      this.createForm.contactList.splice(index, 1);
    },
    // 通过布控名称获取布控信息，异步查询布控是否存在
    getControlInfoByName () {
      // 编辑布控时，只有布控名称做出改动以后才会异步判断是否存在
      if (this.detail.surveillanceName) {
        if (this.createForm.surveillanceName === this.detail.surveillanceName) {
          return false;
        }
      }
      const name = this.Trim(this.createForm.surveillanceName, 'g');
      if (name) {
        getControlInfoByName({name}).then(res => {
          if (res && res.data) {
            this.$message.error('布控名称已存在');
          }
        })
      }
    },
    getModel (data) {
      this.modelData = data;
    },
  
    // 保存布控任务
    saveControl (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //验证所选时间段是否出现重叠
          if (!this.isOverlap()) {
            return false;
          } else {
            const _createForm = objDeepCopy(this.createForm);
            if (_createForm.controlDate.length > 0) {
              _createForm.surveillanceDateStart = _createForm.controlDate[0];
              _createForm.surveillanceDateEnd = _createForm.controlDate[1];
            }
            delete _createForm.controlDate;
            _createForm.surveillancTimeList = _createForm.surveillancTimeList.map(m => {
              return {
                startTime: formatDate(m.times[0], 'HH:mm:ss'),
                endTime: formatDate(m.times[1], 'HH:mm:ss')
              }
            })
            // _createForm.contactList
            _createForm.shareDept = _createForm.shareDept && _createForm.shareDept.join(',');
            _createForm.cascadePlatform = _createForm.cascadePlatform && _createForm.cascadePlatform.join(',');
            this.modelData = null;
            this.$refs['model'].sendParent();
            if (!this.modelData) return;
            console.log(this.modelData, 'this.modelData');
            let data  = {
              ..._createForm,
              modelList: [this.modelData]
            }
            this.loadingBtn = true;
            addControl(data).then(res => {
              if (res) {
                this.$message.success(this.pageType === 3 ? '复用成功' : '新增成功');
                this.$router.push({ name: 'control_manage' });
                // // 新增布控后，状态为待开始的事件，改为进行中
                const obj = this.eventList.find(f => f.value === this.createForm.eventId);
                if (obj && obj.eventStatus === 1) {
                  updateEvent({uid: obj.value, type: 6});
                }
              }
            }).finally(() => {
              this.loadingBtn = false;
            })
          }
        } else {
          return false;
        }
      });
    },
    // 对比布控时间段是否重叠的方法
    isOverlap () {
      let startTimeArr = this.createForm.surveillancTimeList.map(m => m.times[0]);
      let endTimeArr = this.createForm.surveillancTimeList.map(m => m.times[1]);
      let begin = startTimeArr.sort();
      let over = endTimeArr.sort();
      if (this.createForm.surveillancTimeList.length === 1) {
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

    skipIsList () {
      // 编辑布控任务时
      if (this.pageType === 2) {
        this.$emit('changePageType', 1);
      // 新建、复用布控任务时
      } else {
        // 从事件模块跳转过来的
        if (this.$route.query.eventId) {
          this.$router.push({ name: 'event_manage' });
        } else {
          this.$router.push({ name: 'control_manage' });
        }
      }
      this.toGiveUpDialog = false;
    },
    // 根据布控id获取布控详情，用于回填数据
    getControlDetailIsEditor (controlId) {
      getControlDetailIsEditor(controlId).then(res => {
        if (res && res.data) {
          const detail = this.detail = res.data;
          // 复用布控时
          if (this.pageType === 3) {
            detail.surveillanceName = '复用' + detail.surveillanceName;
            this.$set(detail, 'controlDate', []);
            detail.eventId = null;
          // 编辑布控时
          } else {
            this.eventList = [{
              label: detail.eventCode,
              value: detail.eventId
            }]
            const {surveillanceDateStart, surveillanceDateEnd} = detail;
            this.$set(detail, 'controlDate', [surveillanceDateStart, surveillanceDateEnd]);
          }
          detail.surveillancTimeList = detail.surveillancTimeList.map(m => {
            return {
              times: [new Date('2016, 9,' + m.startTime), new Date('2016, 9,' + m.endTime)]
            }
          })
          detail.contactList.length === 0 && (detail.contactList = [{
            contact: null,
            mobile:  null
          }]);
          if (detail.shareDept) {
            this.$set(detail, 'sharedControl', 1);
            detail.shareDept = detail.shareDept.split(',');
          } else {
            this.$set(detail, 'sharedControl', 0);
          }
          if (detail.cascadePlatform) {
            this.$set(detail, 'cascade', 1);
            detail.cascadePlatform = detail.cascadePlatform.split(',');
          } else {
            this.$set(detail, 'cascade', 0);
          }
          const {modelList} = detail;
          delete detail.modelList;
          detail.alarmLevel = String(detail.alarmLevel);
          this.createForm = objDeepCopy(detail);
          const [{modelType}] = modelList;
          this.modelList = modelList;
          this.modelType_ = this.modelType = modelType;
          console.log(this.modelList, 'modelList')
        }
      })
    },
    // 编辑布控任务
    putControl (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //验证所选时间段是否出现重叠
          if (!this.isOverlap()) {
            return false;
          } else {
            const _createForm = objDeepCopy(this.createForm);
            if (_createForm.controlDate.length > 0) {
              _createForm.surveillanceDateStart = _createForm.controlDate[0];
              _createForm.surveillanceDateEnd = _createForm.controlDate[1];
            }
            delete _createForm.controlDate;
            _createForm.surveillancTimeList = _createForm.surveillancTimeList.map(m => {
              return {
                startTime: formatDate(m.times[0], 'HH:mm:ss'),
                endTime: formatDate(m.times[1], 'HH:mm:ss')
              }
            })
            _createForm.shareDept =  _createForm.shareDept && _createForm.shareDept.join(',');
            _createForm.cascadePlatform = _createForm.cascadePlatform && _createForm.cascadePlatform.join(',');
            this.modelData = null;
            this.$refs['model'].sendParent();
            if (!this.modelData) return;
            console.log(this.modelData, 'this.modelData');
            let data  = {
              ..._createForm,
              modelList: [this.modelData]
            }
            this.loadingBtn = true;
            putControl(data).then(res => {
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
      });
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
  .footer_btn{
    padding-top: 20px;
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
        margin-bottom: 0;
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
      .period_time_btn_box{ 
        width: 25%;
        margin-bottom: 0!important;
        padding-right: 10px;
        .el-form-item__content{
          display: flex;
          .period_time_btn{
            width: 100%;
            height:40px;
            line-height:40px;
            text-align: center;
            border-radius:4px;
            border:1px dashed rgba(217,217,217,1);
            vertical-align: middle;
            margin-bottom: 5px;
            cursor: pointer;
            color: #0C70F8;
            .vl_icon_control_22{
              vertical-align: middle;
              margin-bottom: 5px;
              margin-right: 5px;
            }
          }
        }
      }
      > .el-form-item{
        width: 25%;
        margin-bottom: 10px;
        padding-right: 10px;
        .el-form-item__content{
          display: flex;
          .el-date-editor{
            width: calc(100% - 40px)!important;
            border-radius: 4px 0 0 4px;
          }
          > i{
            width: 40px;
            height:40px;
            background:rgba(246,246,246,1);
            border-radius:0px 4px 4px 0px;
            border:1px solid rgba(211,211,211,1);
            line-height: 40px;
            text-align: center;
            font-size: 18px;
            color: #F94539;
            cursor: pointer;
          }
        }
      }
      .contact_list{
        display: flex;
        width: 25%;
        padding-right: 10px;
        margin-bottom:  10px;
        .contact{
          width: calc(100% - 40px);
          height: 40px;
          display: flex;
          border: 1px solid #D3D3D3;
          border-radius: 4px 0 0 4px;
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
            .el-input__inner{
              border: none!important;
              height: 36px;
              padding: 0 0 0 4px!important;
            }
          }
        }
        > i{
          width: 40px;
          height:40px;
          background:rgba(246,246,246,1);
          border-radius:0px 4px 4px 0px;
          border:1px solid rgba(211,211,211,1);
          line-height: 40px;
          text-align: center;
          font-size: 18px;
          color: #F94539;
          cursor: pointer;
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
