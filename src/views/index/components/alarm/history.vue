<template>
<!-- <vue-scroll> -->
  <div class="alarm_today">
    <!-- 侧边栏搜索框 -->
    <div class="search_box">
      <div class="date_search">
        <div class="date_search_info">
          <!-- <label>开始</label> -->
          <el-date-picker
                class="vl_date"
                v-model="startTime"
                type="date"
                :picker-options="startDateOpt"
                placeholder="选择日期">
            </el-date-picker>
        </div>
        <div class="date_search_info">
          <!-- <label>结束</label> -->
          <el-date-picker
                class="vl_date vl_date_end"
                v-model="endTime"
                type="date"
                :picker-options="endDateOpt"
                placeholder="选择日期">
            </el-date-picker>
        </div>
      </div>
      <div class="search_tab">
        <div class="tab_lt">
          <ul>
            <li :class="{'tab_lt_ul_sed': tabType === '1'}" @click="changeTab('1')">监控列表</li>
            <li :class="{'tab_lt_ul_sed': tabType === '2'}" @click="changeTab('2')">布防库</li>
          </ul>
          <div :style="{'left': tabType === '1' ? 0 : '50%'}"></div>
        </div>
      </div>
      <!-- 监控列表 -->
      <div v-show="tabType === '1'" class="device_list">
      <div class="group_input">
        <el-input v-model="groupName" size="small" placeholder="请输入设备名称查找">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <vue-scroll>
        <div class="add_group">
          <el-tree
            icon-class="el-icon-arrow-right"
            :data="deviceList"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[]"
            :default-checked-keys="[]"
            :props="defaultProps"
            ref="tree"
            :filter-node-method="filterNode">
          </el-tree>
        </div>
      </vue-scroll>
      </div>
      <!-- 布防库 -->
      <div v-show="tabType === '2'" class="device_list">
      <div class="group_input">
        <el-input v-model="controlName" size="small" placeholder="请输入组名查找">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <vue-scroll>
        <div class="add_group">
          <el-tree
            icon-class="el-icon-arrow-right"
            :data="groups"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[]"
            :default-checked-keys="[]"
            :props="defaultProps"
            ref="gTree"
            :filter-node-method="filterNode">
          </el-tree>
        </div>
      </vue-scroll>
      </div>
      <div style="width: 192px;text-align: center;position: absolute;bottom: 20px;margin-left: 20px;">
          <el-button style="width: 45%;" type="primary" @click="getCheckedKeys">确定</el-button>
          <el-button style="width: 45%;" @click="resetDevice()">重置</el-button>
      </div>
    </div>
    <vue-scroll>
    <div class="alarm_list" v-loading="isLoading">
      <!-- 组合搜索 -->
      <div class="combination_search">
      <el-form :model="todayAlarmForm" ref="todayAlarmForm" :inline="true">
        <el-form-item prop="targetType" label="告警类型:" >
          <el-select v-model="todayAlarmForm.targetType" placeholder="选择告警类型" clearable style="width: 112px;">
            <el-option
              v-for="item in targetTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
           <!-- <el-radio-group v-model="todayAlarmForm.targetType">
            <el-radio v-for="(item,index) in targetTypeList" :key="index" :label="item.value">{{item.label}}</el-radio>
           </el-radio-group> -->
        </el-form-item>
        <template v-if="todayAlarmForm.targetType === 1">
        <el-form-item style="width: 192px;" prop="name">
          <el-input v-model="todayAlarmForm.name" placeholder="输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item prop="sex" style="width: 112px;">
          <el-select v-model="todayAlarmForm.sex" placeholder="选择性别" clearable >
            <el-option
              v-for="item in sexList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="age" style="width: 112px;">
          <el-select v-model="todayAlarmForm.age" placeholder="选择年龄" clearable >
            <el-option
              v-for="item in ageList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        </template>
        <template v-if="todayAlarmForm.targetType === 2">
          <el-form-item style="width: 192px;" prop="vehicleNumber">
          <el-input v-model="todayAlarmForm.vehicleNumber" placeholder="输入车牌号码" clearable></el-input>
        </el-form-item>
        </template>
        <el-form-item>
          <el-button style="width: 80px;" type="primary" @click="getCheckedKeys">确定</el-button>
          <el-button style="width: 80px;" @click="resetForm('todayAlarmForm')">重置</el-button>
        </el-form-item>
      </el-form>
      </div>
      <div class="list_top">检索结果<span v-if="alarmList">({{alarmList.length}})</span></div>
      <div class="alarm_grade">
        <div class="alarm_grade_info">
          <p :class="{'active': sortType === sort.type}" v-for="(sort,i) in sortList" :key="i"><span @click="changeSort(sort.type)">{{sort.name}}</span>
          <template v-if="sortType === sort.type && sortType !== 3">
            <i class="el-icon-arrow-down" v-if="sort.order === 'desc'" @click="changeOrder(sort)"></i>
            <i class="el-icon-arrow-up" v-if="sort.order === 'asc'" @click="changeOrder(sort)"></i>
          </template>
          </p>
        </div>
      </div>
      <template v-if="allAlarmList">
      <div class="list_accordion" v-for="(key,inx) in allAlarmList" :key="inx">
        <div class="list_time" @click="changeExpand(key)">
          <span class="solid_angle" v-show="key.isExpand"></span>
          <div class="border_right" v-show="!key.isExpand"><span></span></div>
          <span>{{key.label}}</span>
        </div>
        <!-- <vue-scroll> -->
        <div class="list_content" v-show="key.isExpand">
          <div class="list_box" v-for="(item,index) in key.value" :key="index" @mouseenter="onMouseOver(item)" @mouseleave="onMouseOut(item)">
            <div class="list_img">
              <img :src="item.snapPhoto" alt="抓拍照片">
              <img :src="item.surveillancePhoto" alt="布防照片">
              <div class="list_sim">
                <i class="vl_icon vl_icon_alarm_1"></i>
                <div>
                  相似<strong>{{item.semblance}}</strong><span>%</span>
                </div>
              </div>
            </div>
            <div class="list_con_info">
              <div>布控名：{{item.surveillanceName}}</div>
              <div>
                <span class="small_text">抓拍设备：{{item.devName}}</span>
              </div>
              <div>
                <span class="small_text">抓拍时间：{{item.snapTime}}</span>
              </div>
            </div>
            <div v-if="item.isSeen" @click="toAlarmDetail(item.uid, item.objType)">
              <div class="hover_info">
                <p class="name_info" v-if="item.objType == 1">
                  <span>{{item.name}}</span>
                  <span v-if="item.sex && item.sex != '未知'">{{item.sex}}</span>
                  <span v-if="item.nation && item.nation != '未知'">{{item.nation}}</span>
                </p>
                <p class="name_info" v-if="item.objType == 2">
                  <span>{{item.vehicleNumber}}</span>
                  <span>{{item.numberColor}}</span>
                  <span>{{item.vehicleType}}</span>
                </p>
                <p class="name_info" v-if="item.objType == 3 || item.objType == 4">
                  
                </p>
                <p class="correlated_info" v-if="item.eventCode">
                  <span>{{item.eventCode}}</span>
                  <span>关联事件</span>
                </p>
                <p class="correlated_info">
                  <span>{{item.addressDesc}}</span>
                  <span>抓拍地址</span>
                </p>
                <p class="correlated_info">
                  <span>{{item.cname}}</span>
                  <span>区域名称</span>
                </p>
                <p class="box_grade_info"> 
                  <i class="vl_icon vl_icon_alarm_2" v-if="item.alarmLevel == 1"></i>
                  <i class="vl_icon vl_icon_alarm_3" v-if="item.alarmLevel == 2"></i>
                  <i class="vl_icon vl_icon_alarm_4" v-if="item.alarmLevel == 3"></i>
                  <i class="vl_icon vl_icon_alarm_5" v-if="item.alarmLevel == 4"></i>
                  <i class="vl_icon vl_icon_alarm_6" v-if="item.alarmLevel == 5"></i>
                </p>
              </div>
              <div class="sanjiao"></div>
            </div>
          </div>
        </div>
        <!-- </vue-scroll> -->
      </div>
      </template>
    </div>
    </vue-scroll>
    <!-- <alarmDialog ref="alarmDialogComp" :strucInfoList="alarmList" :alarmObj="alarmObj" @isLoading="showLoading"></alarmDialog> -->
  </div>
  <!-- </vue-scroll> -->
</template>
<script>
import { getGroupsByType } from '@/views/index/api/api'
import { getAlarmList } from "@/views/index/api/api.control.js";
import { apiAreaServiceDeviceList } from "@/views/index/api/api.base.js";
/* import alarmDialog from './components/alarmDetail' */
import {formatDate} from '@/utils/util';
import {mapXupuxian} from '@/config/config.js';
export default {
  data () {
    return {
      tabType: '1',
      groupName: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      deviceList: [],
      todayAlarmForm: {
        targetType: '',
        name: '',
        sex: '',
        age: '',
        vehicleNumber: '',
      },
      sexList: [{
        label: '男',
        value: 1
      },{
        label: '女',
        value: 2
      }],
      ageList: [{
        label: '0-10',
        value: 1
      },{
        label: '10-20',
        value: 2
      },{
        label: '20-30',
        value: 3
      },{
        label: '30-40',
        value: 4
      },{
        label: '40-50',
        value: 5
      },{
        label: '50-70',
        value: 6
      },{
        label: '70以上',
        value: 7
      }],
      isSeen: false,     //是否展示信息
      alarmList: null,    //告警数据
      mAlarmList: [], 
      allAlarmList: [],  
      selectDevice: [],    //选中的监控数据
      groups: [],        //布控库数据
      controlName: '',     //布控库搜索
      selectControl: [],    //选中的布控数据
      alarmObj: {},
      startTime: new Date().getTime() - 3600 * 1000 * 24,
      endTime: new Date().getTime() - 3600 * 1000 * 24,
      startDateOpt: {
        disabledDate: (time) => {
          if(this.endTime) {
            return time.getTime() > this.endTime || time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90
          }else {
            return time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90 || time.getTime() > new Date().getTime()
          } 
        }
      },
      endDateOpt: {
        disabledDate: (time) => {
          if(this.startTime) {
            return time.getTime() < this.startTime || time.getTime() > new Date().getTime()
          }else {
            return time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90 || time.getTime() > new Date().getTime()
          }
        }
      },  
      sortType: 2,     //排序类型
      sortList: [{
        type: 1,
        name: '相似度',
        order: 'desc',
      },{
        type: 2,
        name: '时间顺序',
        order: 'desc',
      },{
        type: 3,
        name: '视频顺序',
        order: 'asc',
      }],
      targetTypeList: [{
        label: '不限',
        value: ''
      },{
        label: '布控人像',
        value: 1
      },{
        label: '布控车像',
        value: 2
      }],
      sortOrderS: 'desc',
      sortOrderT: 'desc',
      isLoading: false,
    }
  },
  watch: {
    groupName(val) {
      this.$refs.tree.filter(val)
    },
    controlName(val) {
      this.$refs.gTree.filter(val)
    },
  },
  mounted () {
    if(this.$route.query.startTime && this.$route.query.endTime) {
      this.startTime = this.$route.query.startTime;
      this.endTime = this.$route.query.endTime;
    }
    this.getDeviceList()
    this.getGroups()
    this.getAlarm();
  },
  methods: {
    filterNode(value, data, node) {
      if (!value) return true;
      /* let level = node.level; */
      let _array = [];//这里使用数组存储 只是为了存储值。
      this.getReturnNode(node,_array,value);
      let result = false;
      _array.forEach((item)=>{
        result = result || item;
      });
      return result;
    },
    getReturnNode(node,_array,value){
      let isPass = node.data &&  node.data.label && node.data.label.indexOf(value) !== -1;
      isPass?_array.push(isPass):'';
      if(!isPass && node.level!=1 && node.parent){
        this.getReturnNode(node.parent,_array,value);
      }
    },
    changeTab (type) {
      this.tabType = type;
      this.selectDevice = []
      this.selectControl = []
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.gTree.setCheckedKeys([]);
    },
    //切换排序方式
    changeSort(type) {
      this.sortType = type
      this.mAlarmList = []
      this.allAlarmList = []
      this.getAlarm()
    },
    //切换升降序
    changeOrder(sort) {
      this.mAlarmList = []
      this.allAlarmList = []
      if(sort.type === 1) {
        if(sort.order === 'desc') {
          sort['order'] = 'asc'
          this.sortOrderS = 'asc'
        }else {
          sort['order'] = 'desc'
          this.sortOrderS = 'desc'
        }
      }else {
        if(sort.order === 'desc') {
          sort['order'] = 'asc'
          this.sortOrderT = 'asc'
        }else {
          sort['order'] = 'desc'
          this.sortOrderT = 'desc'
        }
      }
      this.getNormalAlarm()
    },
    getCheckedKeys() {
      this.allAlarmList = []
      this.selectDevice = this.$refs.tree.getCheckedKeys(true);
      this.selectControl = this.$refs.gTree.getCheckedKeys(true);
      this.getAlarm()
    },
    // 重置设备列表
    resetDevice() {
      this.startTime = new Date().getTime() - 3600 * 1000 * 24
      this.endTime = new Date().getTime() - 3600 * 1000 * 24
      this.selectDevice = []
      this.selectControl = []
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.gTree.setCheckedKeys([]);
      this.getAlarm();
    },
    // 重置查询条件
    resetForm (form) {
      this.$refs[form].resetFields();
      /* this.startTime = new Date().getTime() - 3600 * 1000 * 24
      this.endTime = new Date().getTime() - 3600 * 1000 * 24 */
      /* this.selectDevice = []
      this.selectControl = []
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.gTree.setCheckedKeys([]); */
      this.getAlarm();
    },
    onMouseOver (data) {
      this.isSeen = true
      data['isSeen'] = true
      for(let i=0; i< this.allAlarmList.length; i++) {
        for(let k=0; k< this.allAlarmList[i].value.length; k++) {
          let key = this.allAlarmList[i].value[k]
          if(key.uid === data.uid) {
            this.$set(this.allAlarmList[i].value, k, data)
          }
        }
      }
    },
    onMouseOut (data) {
      this.isSeen = false
      data['isSeen'] = false
      for(let i=0; i< this.allAlarmList.length; i++) {
        for(let k=0; k< this.allAlarmList[i].value.length; k++) {
          let key = this.allAlarmList[i].value[k]
          if(key.uid === data.uid) {
            this.$set(this.allAlarmList[i].value, k, data)
          }
        }
      }
    },
    //获取监控列表
    getDeviceList() {
      apiAreaServiceDeviceList({
        areaUid: mapXupuxian.adcode,
        likeKey: this.groupName
      }).then(res => {
        if (res && res.data) {
          this.deviceList = this.getTreeList(res.data.areaTreeList);
        }
      }).catch(error => {
        console.log("apiAreaServiceDeviceList error：", error);
      });
    },
    getTreeList(data) {
      for(let item of data) {
        item['id'] = item.areaId
        item['label'] = item.areaName
        if(item.deviceBasicList && item.deviceBasicList.length > 0) {
          item['children'] = item.deviceBasicList
          delete(item.deviceBasicList)
          for(let key of item['children']) {
            key['label'] = key.deviceName
            key['id'] = key.uid
          }
        }
      }
      return data;
    },
    //获取布控库
    getGroups() {
      this.groups = []
      //布控库人像
      getGroupsByType({groupType: 6}).then(res => {
        if(res.data && res.data.length > 0) {
          for(let item of res.data) {
            item['id'] = item.uid
            item['label'] = item.groupName
          }
          this.groups.push({
            label: '人像组',
            id: 1,
            children: [...res.data]
          })
        }
      }).catch(()=> {})
      //布控库车辆
      getGroupsByType({groupType: 7}).then(res => {
        if(res.data && res.data.length > 0) {
          for(let item of res.data) {
            item['id'] = item.uid
            item['label'] = item.groupName
          }
          this.groups.push({
            label: '车辆组',
            id: 2,
            children: [...res.data]
          })
        }
      }).catch(()=> {})
    },
    //告警
    getAlarm() {
      this.alarmList = [];
      this.allAlarmList = [];
      this.mAlarmList = []
      this.isLoading = true
      let params = {
        "where.startTime": formatDate(this.startTime, 'yyyy-MM-dd'),
        "where.endTime": formatDate(this.endTime, 'yyyy-MM-dd'),
        "where.sortType": this.sortType,
        pageNum: -1,
        pageSize: 0,
      };
      (this.selectDevice && this.selectDevice.length > 0) && (params['where.devIds'] = this.selectDevice.join());
      (this.selectControl && this.selectControl.length > 0) && (params['where.groupIds'] = this.selectControl.join());
      if(this.todayAlarmForm.targetType) {
        params['where.targetType'] = this.todayAlarmForm.targetType
        if(this.todayAlarmForm.targetType === 1) {
        this.todayAlarmForm.name && (params['where.username'] = this.todayAlarmForm.name);
        this.todayAlarmForm.sex && (params['where.sex'] = this.todayAlarmForm.sex);
        this.todayAlarmForm.age && (params['where.ageGroup'] = this.todayAlarmForm.age);
        }else {
          this.todayAlarmForm.vehicleNumber && (params['where.vehicleNumber'] = this.todayAlarmForm.vehicleNumber);
        }
      }
      console.log("---------3333---------",params);
      getAlarmList(params).then( res => {
        if(res.data.list && res.data.list.length > 0) {
          this.alarmList = [...res.data.list]
          for(let i=0; i< this.alarmList.length; i++) {
            let item = this.alarmList[i]
            item['semblance'] = +(item.semblance).toFixed(2)
            let alarmTimeD = formatDate(item.alarmTime, 'yyyy-MM-dd')
            item['alarmTimeD'] = new Date(alarmTimeD).getTime()
            let alarmTime = formatDate(item.alarmTime, 'yyyy-MM-dd HH:mm:ss')
            item['alarmTime'] = new Date(alarmTime).getTime()
            item['isSeen'] = false
            if(this.sortType === 3) {
              item['devHeadChar'] = item.devHeadChar.toUpperCase()
            }
          }
          this.getNormalAlarm()
        }
        this.$nextTick(()=> {
          this.isLoading = false
        })
      }).catch(()=> {
        this.isLoading = false
      })
    },
    //降序
    compareDown(propertyName) {
      return function(a, b) { // 属性值为数字
        let value1 = a[propertyName];
        let value2 = b[propertyName];
        return value2 - value1;    
      }
    },
    //升序
    compareUp(propertyName) {
      return function(a, b) { // 属性值为数字
        let value1 = a[propertyName];
        let value2 = b[propertyName];
        return value1 - value2;
      }
    },
    //告警数据转成时间格式
    getNormalAlarm() {
      if(this.sortType === 1) {
        if(this.sortOrderS === 'desc') {
          this.alarmList.sort(this.compareDown("semblance"))
        }else {
          this.alarmList.sort(this.compareUp("semblance"))
        }
        let newArr = [
          {lSemblance: 90, rSemblance: 100},
          {lSemblance: 80, rSemblance: 90},
          {lSemblance: 70, rSemblance: 80},
          {lSemblance: 60, rSemblance: 70},
          {lSemblance: 50, rSemblance: 60},
          {lSemblance: 40, rSemblance: 50},
          {lSemblance: 30, rSemblance: 40},
          {lSemblance: 20, rSemblance: 30},
          {lSemblance: 10, rSemblance: 20},
          {lSemblance: 0, rSemblance: 10}]
        for(let key of newArr) {
          /* params = { lSemblance: (10-i-1)*10, rSemblance: 10*(10-i) } */
          console.log(key)
          this.filterList(key)  
        }
      }else if(this.sortType === 2 ) {
        let arr = [{ upTime: 0,time: 7, label: '' }, 
                   { upTime: 8,time: 14, label: '一周之前' },
                   { upTime: 15,time: 21, label: '二周之前' },
                   { upTime: 22,time: 28, label: '三周之前' },
                   { upTime: 29,time: 60, label: '一个月之前' },
                   { upTime: 61,time: 90, label: '两个月之前' }]
        if(this.sortOrderT === 'desc') {
          this.alarmList.sort(this.compareDown("alarmTime"))
        }else {
          this.alarmList.sort(this.compareUp("alarmTime"))
        }
        for(let item of arr) {
          this.filterList(item)
        }
      }else if(this.sortType === 3 ) {
        this.filterList()
      }
    },
    filterList(params) {
      for(let i = 0; i < this.alarmList.length; i++) {
        let item = this.alarmList[i]
        if(this.sortType === 1) { 
          if( params.rSemblance === 100  && params.lSemblance <= item.semblance && item.semblance <= params.rSemblance) {
            this.mAlarmList.push({
              label: '相似度90以上',
              value: item
            }) 
          }else if(params.lSemblance <= item.semblance && item.semblance < params.rSemblance){
            this.mAlarmList.push({
              label: '相似度' + params.lSemblance + '-' + params.rSemblance,
              value: item
            }) 
          }
        }else if(this.sortType === 2){
          let nowTime = formatDate(new Date(), 'yyyy-MM-dd')
          let newTime = new Date(nowTime).getTime()
          if(params.time === 7 && item.alarmTimeD <= newTime && item.alarmTimeD >= newTime- 3600 * 1000 * 24 * 7) {
            if(item.alarmTimeD === newTime) {
              this.mAlarmList.push({
                label: '今天',
                value: item
              })
            }else if(item.alarmTimeD === newTime- 3600 * 1000 * 24) {
              this.mAlarmList.push({
                label: '昨天',
                value: item
              })
            }else {
              this.mAlarmList.push({
                label: formatDate(item.alarmTimeD, 'yyyy-MM-dd'),
                value: item
              })
            }
          }else if( item.alarmTimeD <= newTime- 3600 * 1000 * 24 * params.upTime && item.alarmTimeD >= newTime- 3600 * 1000 * 24 * params.time ) {
            this.mAlarmList.push({
              label: params.label,
              value: item
            })
          }
        }else {
          this.mAlarmList.push({
            label: item.devHeadChar,
            value: item
          })
        }
      }
      this.allAlarmList = this.getNAlarmList(this.mAlarmList)
      if(this.allAlarmList && this.allAlarmList.length > 0) {
        this.$set(this.allAlarmList[0],"isExpand", true)
      }
    },
    getNAlarmList(arr) {
      console.log("------------",arr)
      let map = {}, dest = []
      for(let item of arr) {
        if(!map[item.label]) {
          dest.push({label: item.label, value: [item.value], isExpand: false})
          map[item.label] = item.value
        }else {
          for(let key of dest) {
            if(key.label == item.label) {
              key.value.push(item.value)
              break;
            }
          }
        }
      }
      return dest
    },
    //点击展开告警
    changeExpand(key) {
      key['isExpand'] = !key.isExpand
    },
    //告警详情
    toAlarmDetail(uid,objType) {
      this.$router.push({name: 'alarm_detail', query: {uid: uid, objType: objType, type: 'history', startTime: formatDate(this.startTime, 'yyyy-MM-dd'), endTime: formatDate(this.endTime, 'yyyy-MM-dd')}});
    },
    showLoading(data) {
      console.log("---00000------",data)
      if(data) {
        this.getAlarm()
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.alarm_today{
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  .search_box{
    height: 100%;
    position: absolute;
    left: 20px;
    top: 0;
    z-index: 999;
    width: 232px;
    background: #fff;
    box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
    animation: fadeInLeft .4s ease-out .3s both;
    .date_search {
      margin: 0 20px 20px;
      .date_search_info {
        margin-top: 10px;
        label {
          margin-right: 2px;
        }
        .el-date-editor.el-input {
          width: 192px;
        }
      }
    }
    .search_tab{
      position: relative;
      width: 100%; height: 50px;
      box-shadow:4px 0px 10px 0px #838383;
      box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
      background-color: #fff;
      .tab_lt{
        position: absolute; top: 0; left: 0;
        width: 100%;
        border-bottom: 1px solid #F2F2F2;
        > ul {
          overflow: hidden;
          > li {
            float: left;
            width: 50%; height: 50px; line-height: 50px;
            text-align: center;
            font-size: 14px; color: #666666;
            cursor: pointer;
            transition: color .4s ease-out;
            &.tab_lt_ul_sed {
              cursor: default;
              color: #0C70F8;
            }
          }
        }
        > div {
          position: absolute; left: 0; bottom: 0;
          width: 50%; height: 2px;
          background-color: #0C70F8;
          transition: left .3s ease-out;
        }
      }
    }
    .device_list {
      height: calc(100% - 302px);
      padding-bottom: 20px;
    }
    .add_group{
      padding: 0 10px 10px;
    }
    .lib_form{
      margin-top: 30px;
      padding: 40px 20px 0;
      border-top: 1px dotted rgba(211,211,211,1);
    }
  }
  .alarm_list{
    height: 100%;
    width: calc(100% - 252px);
    margin-left: 252px;
    position: relative;
    padding: 0 0 20px 20px;
    .combination_search {
      background-color: #fff;
      padding: 15px 20px;
      box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
      margin-bottom: 24px;
    }
    .list_top{
      color: #333;
      > span{
        color: #666;
      }
    }
    .alarm_grade {
      height: 30px;
      .alarm_grade_info {
        text-align: center;
        color: #999;
        >p {
          display: inline-block;
          margin-right: 48px;
          padding-bottom: 5px;
          cursor: pointer;
          &:hover {
            color: #2580FC;
            border-bottom: 1px solid #2580FC;
          }
          >i {
            margin-left: 10px;
          }
        }
        .active {
          color: #2580FC;
          border-bottom: 1px solid #2580FC;
        }
      }
    }
    .list_accordion {
      .list_time {
        height: 50px;
        line-height: 50px;
        background: #fff;
        box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
        margin-bottom: 20px;
        padding: 0 20px;
        &:hover {
          background: #E0F3FF;
        }
        .solid_angle {
          width: 0;
          height: 0;
          border-bottom: 8px solid #666666;
          border-left: 8px solid transparent;
          display: inline-block;
          margin-right: 10px;
        }
        .border_right {
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-left: 8px solid #999;
          position: relative;
          display: inline-block;
          margin-right: 10px;
          >span {
            display: block;
            width: 0;
            height: 0;
            border-left: 4px solid #fff;
            border-bottom: 4px solid transparent;
            border-top: 4px solid transparent;
            position: absolute;
            left: -7px;
            top: -4px;
          }
        }
      }
      .list_content{
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        .list_box{
          margin-right: 1%;
          max-width: 342px;
          width: 32%;
          height: 286px;
          padding: 30px 20px 0;
          margin-bottom: 20px;
          background:rgba(255,255,255,1);
          box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
          overflow: hidden;
          position: relative;
          .list_img{
            width: 100%;
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            position: relative;
            padding-bottom: 20px;
            border-bottom: 1px solid #F2F2F2;
            img {
              width: 140px;
              height: 140px;
            }
            .list_sim{
              position: absolute;
              bottom: 8px;
              left: 50%;
              margin-left: -57px;
              > div{
                position: absolute;
                left: 50%;
                bottom: 8px;
                margin-left: -43px;
                color: #fff;
                font-size:10px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                > strong{
                  font-size:18px;
                  font-family:AuroraBT-BoldCondensed;
                  font-weight:bold;
                  color:rgba(255,255,255,1);
                }
                > span{
                  font-size:16px;
                  font-family:AuroraBT-BoldCondensed;
                  font-weight:bold;
                  color:rgba(255,255,255,1);
                }
              }
            }
          }
          .list_con_info{
            /* display: flex;
            justify-content: space-between;
            line-height: 50px; */
            padding-top: 16px;
            padding-bottom: 16px;
            > div:nth-child(1){
              color: #333;
              margin-bottom: 6px;
            }
            .small_text {
              color: #999;
              font-size: 12px;
            }
          }
        }
        .hover_info {
          width: 88%;
          height: 176px;
          box-shadow:0px 5px 18px 0px rgba(169,169,169,0.39);
          background-color: #fff;
          position: absolute;
          top:15px;
          left: 0;
          padding: 24px 20px;
          cursor: pointer;
          p {
            font-size: 12px;
            color: #666;
            &.name_info {
              span {
                border: 1px solid #F2F2F2;
                border-radius: 3px;
                background-color: #FAFAFA;
                margin: 0 8px 8px 0;
                display: inline-block;
                height: 26px;
                line-height: 26px;
                padding-left: 8px;
                padding-right: 8px;
                &:nth-child(1) {
                  padding-left: 12px;
                  padding-right: 12px;
                }
              }
            }
            &.correlated_info {
              border: 1px solid #F2F2F2;
              border-radius: 3px;
              background-color: #FAFAFA;
              margin: 0 8px 8px 0;
              display: inline-block;
              height: 26px;
              line-height: 26px;
              padding-left: 12px;
              padding-right: 12px;
              span:nth-child(1) {
                padding-right: 12px;
                border-right: 1px solid#F2F2F2;
              }
              span:nth-child(2) {
                padding-left: 12px;
              }
            }
          }
          &:before, &:after {
            width: 0;
            height: 0;
            content: "";
            position: absolute;
            border: solid transparent;
            top: 100%;
          }
          &:before {
            border-width: 0;
            border-top-color: #F2F2F2;
            left: 20px;
          }
          &:after {
            border-width: 8px;
            border-top-color: #fff;
            left: 22px;
          }
          .box_grade_info {
            display: inline-block;
            position: absolute;
            top: 20px;
            right: 20px;
          }
        }
        .sanjiao {
          width: 0;
          height: 0;
          border: 50px solid transparent;
          border-top-color: #fff;
        }
      }
    }
  }
}
@media (max-width: 1400px) {
  .alarm_today .list_content .list_box{
    width: 49%!important;
  }
}
</style>
<style lang="scss">
.alarm_today{
  .search_box{
    .group_input{
      padding: 20px 10px;
      .el-input__inner{
        width: 212px;
        border-radius: 15px!important;
        background:rgba(242,242,242,1)!important;
        border: none;
      }
    }
    .lib_form .el-form-item{
      margin-bottom: 10px!important;
      .el-range-input{
        width: 62px;
      }
    }
  }
  .__rail-is-horizontal {
    position: static!important;
  }
  .combination_search {
    .el-form-item {
      margin-bottom: 0;
    }
  }
}

</style>
