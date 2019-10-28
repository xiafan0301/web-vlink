<template>
<div class="judge_zdgz_content">
  <div class="vl_judge_tc">
    <div class="Breadc">
      <div is="vlBreadcrumb" 
        :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
          {name: '重点人群关注'}]">
      </div>
    </div>
    
    
    <div :class="['vl_j_left']">
      <div class="vl_jtc_search" style="padding-top: 0;">
        <div class="zdgz_left_search_type">
          <span :class="{'active': taskType === '1'}" @click="taskType = '1'">在线查询</span>
          <span :class="{'active': taskType === '2'}" @click="taskType = '2'">离线任务</span>
        </div>
        <div v-show="taskType === '2'" class="zdgz_left_radio">
          <span>任务名称：</span>
          <span>
          <el-input v-model="taskName" placeholder="请输入任务名称" maxlength="20"></el-input>
        </span>
        </div>
        <el-date-picker
          v-model="searchData.time1"
          type="datetime"
          placeholder="开始时间"
          :time-arrow-control="true"
          class="full vl_date"
          :clearable="false"
          value-format="timestamp"
        ></el-date-picker>
        <el-date-picker
          v-model="searchData.time2"
          type="datetime"
          :clearable="false"
          :time-arrow-control="true"
          placeholder="结束时间"
          class="full vl_date vl_date_end"
          value-format="timestamp"
        ></el-date-picker>
        <el-select class="full" v-model="searchData.portraitGroupId" placeholder="关注人群">
          <el-option
            v-for="item in portraitGroupList"
            :key="item.id"
            :label="item.groupName"
            :value="item.uid">
          </el-option>
        </el-select>
        <el-select class="full" v-model="searchData.sex" placeholder="请选择性别" clearable>
          <el-option
            v-for="item in sexList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select class="full" v-model="searchData.ageGroup" placeholder="请选择年龄段" clearable>
          <el-option
            v-for="item in ageGroupList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="zdgz_xzsb_s" @click="clickTab" v-if="mapSelectType === 0">
          <span>选择设备</span>
          <span class="el-icon-arrow-down"></span>
        </div>
        <div class="zdgz_dtxz_rst" v-else>
          已选<span>{{dSum}}</span>个设备<a href="javascript: void(0);" @click="dialogVisible={}">重选</a>
        </div>
        <div>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-button  @click="resetSearch" class="full">重置</el-button>
            </el-col>
            <el-col :span="12">
              <el-button  :loading="searching" type="primary" @click="beginSearch"
                class="select_btn full"
              >搜索</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div :class="['vl_j_right']">
      <div class="frequent-a-content">
        <ul class="tab-menu">
          <li
                  v-for="(item,index) in tabList"
                  :key="index"
                  :class="{'is-active': selectIndex === item.value}"
                  @click="selectTab(item.value)"
          >{{item.label}}</li>
        </ul>
        <template v-if="selectIndex === 2">
          <div class="vl_jig_right">
            <ul class="map_rrt_u2">
              <li  @click="resemt"><i class="el-icon-aim"></i></li>
              <li @click="mapZoomSet(1)"><i class="el-icon-plus"></i></li>
              <li @click="mapZoomSet(-1)"><i class="el-icon-minus"></i></li>
            </ul>
            <div class="vl_jfo_right" v-show="showVideoList">
              <div class="vl_jig_right_title">
                <p><i class="vl_icon vl_icon_v11"></i><span>{{curSXT.bayonetName ? curSXT.bayonetName : curSXT.deviceName}}</span></p>
                <p><i class="vl_icon vl_icon_position_1"></i><span :title="curSXT.address">{{curSXT.address}}</span></p>
                <!-- < span>抓拍{{curSXT.shotNum}}次</span> -->
              </div>
              <div class="video_container">
                <vue-scroll>
                  <div class="vl_jtc_mk" v-for="item in curVideoList" :key="item.id">
                    <p>{{item.shotTime}}</p>
                    <div is="flvplayer" :oData="item.playerData"
                         :oConfig="{fit: false, sign: false, pause: true, close: false, tape: false, download: false}">
                    </div>
                  </div>
                </vue-scroll>
              </div>
              <div class="vl_jig_right_close"><i class="el-icon-error" @click="hideVideoList"></i></div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="search_box">
            <el-form :inline="true" :model="taskForm" class="event_form" ref="taskForm">
              <el-form-item label="任务名称：" prop="taskName">
                <el-input
                        style="width: 200px;"
                        type="text"
                        placeholder="请输入任务名称"
                        v-model="taskForm.taskName"
                />
              </el-form-item>
              <el-form-item label="创建时间：" prop="reportTime">
                <el-date-picker
                        v-model="taskForm.reportTime"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button class="select_btn" @click="selectDataList">查询</el-button>
                <el-button class="reset_btn" @click="resetForm('taskForm')">重置</el-button>
              </el-form-item>
            </el-form>
            <div class="divide"></div>
            <!--<el-button @click="skipAddTaskPage" class="th-button-export-color">新建任务</el-button>-->
          </div>
          <div class="content-box">
            <div class="table_box">
              <el-table :data="list">
                <el-table-column label="序号" type="index" width="100"></el-table-column>
                <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="分析时间范围" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.taskWebParam.startTime}}-{{scope.row.taskWebParam.endTime}}
                  </template>
                </el-table-column>
                <el-table-column label="人群" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.taskWebParam.portraitGroupName ? scope.row.taskWebParam.portraitGroupName : '不限'}}
                  </template>
                </el-table-column>
                <el-table-column label="性别" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.taskWebParam.sex ? scope.row.taskWebParam.sex : '不限'}}
                  </template>
                </el-table-column>
                <el-table-column label="年龄段" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.taskWebParam.age ? scope.row.taskWebParam.age : '不限'}}
                  </template>
                </el-table-column>
                <el-table-column label="状态" v-if="selectIndex === 0" prop="taskStatus" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.taskStatus && scope.row.taskStatus === 1 ? '进行中' : scope.row.taskStatus === 3 ? '失败' : '已中断'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                  <template slot-scope="scope">
                  <span
                          class="operation_btn"
                          @click="skipResultPage(scope.row)"
                          v-if="selectIndex === 1"
                  >查看</span>
                    <span
                            class="operation_btn"
                            @click="showInterruptDialog(scope.row)"
                            v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus === 1"
                    >中断任务</span>
                    <span
                            class="operation_btn"
                            @click="recoveryOrRestart(scope.row)"
                            v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus === 4"
                    >恢复任务</span>
                    <span
                            class="operation_btn"
                            @click="restartTask(scope.row)"
                            v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus === 3"
                    >重启任务</span>
                    <span
                            class="operation_btn"
                            @click="showDeleteDialog(scope.row)"
                            v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus !== 4"
                    >删除任务</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <template v-if="pagination.total > 0">
            <el-pagination
                    class="cum_pagination"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pagination.pageNum"
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size="pagination.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="pagination.total"
            ></el-pagination>
          </template>
        </template>
      </div>
    </div>
  </div>
  <div id="tcMap"></div>
  <!-- 地图选择 -->
   <!-- D设备 B卡口  这里是设备和卡口 -->
    <div is="mapSelector" :open="dialogVisible" :showTypes="'DB'" :clear="clearMapSelect" @mapSelectorEmit="mapPoint"></div>
    <!--中断任务弹出框-->
    <el-dialog
            title="中断任务确认"
            :visible.sync="interruptDialog"
            width="482px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            class="dialog_comp"
    >
      <span style="color: #999999;">任务中断，任务的数据处理进程将中止，可以在列表中恢复任务的数据处理</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interruptDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="sureInterruptTask">确认</el-button>
      </div>
    </el-dialog>

    <!--删除任务弹出框-->
    <el-dialog
            title="删除任务确认"
            :visible.sync="deleteDialog"
            width="482px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            class="dialog_comp"
    >
      <span style="color: #999999;">任务删除，任务的数据处理进程将被清除，任务不再可以恢复</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="sureDeleteTask">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let AMap = window.AMap;
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import {PortraitPostFocusRealTime, PortraitPostFocusTask } from "@/views/index/api/api.judge.js";
import {getGroupListIsPortrait} from '../../api/api.control.js';
import { getTaskInfosPage, putAnalysisTask, putTaskInfosResume } from '@/views/index/api/api.analysis.js';
import {FocusPostReloadtask} from '@/views/index/api/api.portrait.js';
import mapSelector from '@/components/common/mapSelector.vue';
import flvplayer from '@/components/common/flvplayer.vue';
import { random14, formatDate } from '@/utils/util.js';
import { mapXupuxian, onlineOutTime } from "@/config/config.js";
export default {
   components: {
    mapSelector,
    vlBreadcrumb,
     flvplayer
  },
  data() {
    return {
      dSum: 0, // 设备总数
      mapSelectType: 0,
      taskName: '', // 左侧输入任务名称
      taskType: "1", // 左侧任务类型，1 实时，2离线
      flvplayerId: 'flv_' + random14(),
      clearMapSelect: false, // 清除地图选择
      evData: [],
      searchData: {
        portraitGroupId: null,  // 人员组
        sex: null, // 1男，2女
        ageGroup: null, // 年龄段
        time1: null,
        time2: null
      },
      sexList: [
        {value: '男', label: '男'},
        {value: '女', label: '女'}
      ],
      portraitGroupList: [],
      ageGroupList: [
        // {value: null, label: '不限'},
        {value: '儿童', label: '儿童'},
        {value: '少年', label: '少年'},
        {value: '青年', label: '青年'},
        {value: '中年', label: '中年'},
        {value: '老年', label: '老年'},
        // {value: 6, label: '50-70'},
        // {value: 7, label: '70-'}
      ],
      
      pickerOptions: {
        disabledDate (time) {
          let date = new Date();
          let curDate = date.getTime();
          let curS = 3 * 24 * 3600 * 1000;
            let _sm =(new Date(curDate - curS).getMonth() + 1)>9?(new Date(curDate - curS).getMonth() + 1):("0"+(new Date(curDate - curS).getMonth() + 1))
          let _sd = new Date(curDate - curS).getDate()>9? new Date(curDate - curS).getDate() : ("0"+ new Date(curDate - curS).getDate())
          let start = new Date(curDate - curS).getFullYear() +
        "-" + _sm + "-" +_sd;
          return time.getTime() > Date.now();
        }
      },
      amap: null, // 地图实例
      searching: false,
      curVideo: {
        id: '',
        indexNum: null, // 当前展示的摄像头索引
        playNum: null, // 当前摄像头里正在大屏播放的索引
        videoList: []
      }, // 当前被放大播放的video
      curVideoList: [],
      showVideoList: false,
      curSXT: {
        deviceName: '',
        shotNum: '',
        // snapTime: ''
      }, // 显示的摄像头数据
      demoImg: '',
      surveillanceIds: [], // 布控ids.
      eventList: [],
      dialogVisible:false,
      selectDevice:[],
      selectBayonet:[],
      // 任务
      tabList: [
        {
          label: "已完成任务",
          value: 1
        },
        {
          label: "未完成任务",
          value: 0
        },
        {
          label: "查询结果",
          value: 2
        }
      ],
      selectIndex: 1, // 默认已完成的任务
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      taskForm: {
        startTime: '',
        endTime: '',
        taskName: null // 任务名称
      },
      list: [], //已完成列表
      taskId: null, // 任务id
      deleteDialog: false,
      isDeleteLoading: false,
      interruptDialog: false, //中断任务
    }
  },
  mounted () {
    this.setDTime();
    this.getDataList();
    let map = new AMap.Map('tcMap', {
      center: mapXupuxian.center,
      zoom: 16
    });
    map.setMapStyle('amap://styles/whitesmoke');
    this.amap = map;
    // 获取人员组，跟车辆组列表
    getGroupListIsPortrait().then(res => {
      if (res) {
        this.portraitGroupList = res.data;
        this.portraitGroupList.map(item => {
          if (!item.uid) {
            this.searchData.portraitGroupId = item.uid;
          }
        })
      }
    })
  },
  methods: {
    // 重置查询条件
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getDataList();
    },
    randerMap () {
      this.$nextTick(() => {
        $('.vl_jig_right').append($('#tcMap'))
        this.amap.clearMap();
        this.drawMarkers(this.evData);
      })
    },
    // 获取离线任务
    getDataList () {
      const params = {
        'where.taskName': this.taskForm.taskName,
        'where.taskType': 6, //  1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析 4:以图搜人 9：人员侦查报告,6重点关注
        'where.startTime': this.taskForm.reportTime ? this.taskForm.reportTime[0] : null,
        'where.endTime': this.taskForm.reportTime ? this.taskForm.reportTime[1] : null,
        'where.isFinish': this.selectIndex,   //是否完成 0:未完成(包含处理中、处理失败、处理中断) 1：已完成(处理成功)
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        order: 'desc',
        orderBy: 'create_time'
      };
      getTaskInfosPage(params)
          .then(res => {
            if (res) {
              res.data.list.forEach(item => {
                this.$set(item, 'taskWebParam', JSON.parse(item.taskWebParam))
              })
              this.list = res.data.list;
              this.pagination.total = res.data.total;
            }
          })
          .catch(() => {})
    },
    //tab切换
    selectTab (val) {
      this.selectIndex = val;
      if(parseFloat(val) < 2) {
        this.getDataList();
      }
    },
    skipResultPage (obj) {
      this.$router.push({name: 'portrait_zdgz_jg', query: {uid: obj.uid}})
    },
    // 显示中断任务弹出框
    showInterruptDialog (obj) {
      this.interruptDialog = true;
      this.taskId = obj.uid;
    },
    // 显示删除任务弹出框
    showDeleteDialog (obj) {
      this.deleteDialog = true;
      this.taskId = obj.uid;
    },
    // 确认中断任务
    sureInterruptTask () {
      if (this.taskId) {
        const params = {
          uid: this.taskId,
          taskType: 6, // 1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析
          taskStatus: 4 // 1：处理中 2：处理成功 3：处理失败 4：处理中断
        };
        this.isInterruptLoading = true;
        putAnalysisTask(params)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '中断任务成功',
                  customClass: 'request_tip'
                });
                this.interruptDialog = false;
                this.isInterruptLoading = false;
                this.getDataList();
              } else {
                this.isInterruptLoading = false;
              }
            })
            .catch(() => {this.isInterruptLoading = false;})
      }
    },
    // 确认删除任务
    sureDeleteTask () {
      if (this.taskId) {
        const params = {
          uid: this.taskId,
          taskType: 6, // 1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析
          delFlag: true
        };
        this.isDeleteLoading = true;
        putAnalysisTask(params)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '删除任务成功',
                  customClass: 'request_tip'
                });
                this.deleteDialog = false;
                this.isDeleteLoading = false;
                this.getDataList();
              } else {
                this.isDeleteLoading = false;
              }
            })
            .catch(() => {this.isDeleteLoading = false;})
      }
    },
    //恢复任务,
    recoveryOrRestart(obj) {
      putTaskInfosResume(obj.uid).then(res => {
        console.log(res)
        if(res) {
          this.getDataList();
        }
      }).catch(() => {})
    },
    // 重启任务
    restartTask (obj) {
      let params = {
        taskId: obj.uid,
        taskOperationType: '3'
      }
      FocusPostReloadtask(params).then(res => {
        console.log(res)
        if(res) {
          this.getDataList();
        }
      }).catch(() => {})
    },
    // 查询任务列表数据
    selectDataList () {
      this.getDataList();
    },
    handleCurrentChange (e) {
      this.pagination.pageNum = e;
      this.getDataList();
    },
    mapZoomSet(val) {
      if (this.amap) {
        this.amap.setZoom(this.amap.getZoom() + val);
      }
    },
    resemt(){
      if (this.amap) {
        this.amap.setZoomAndCenter(14, mapXupuxian.center);
      }
    },
    clickTab() {
        this.dialogVisible = !this.dialogVisible;
        this.mapSelectType = 1;
    },
    mapPoint(data){
      this.selectDevice = data.deviceList;
      this.selectBayonet = data.bayonetList;
      this.dSum = 0;
      this.dSum = data.bayonetList.length + data.deviceList.length;
    },
    setDTime () {
      let date = new Date();
      let curDate = date.getTime();
      let curS = 1 * 24 * 3600 * 1000;
      let _sDate = new Date(curDate - curS);
      let _s = _sDate.getFullYear()+ '-' + (_sDate.getMonth() + 1) + '-' + _sDate.getDate() + ' 00:00:00' ;
      this.searchData.time1 = new Date(_s).getTime();
      this.searchData.time2 = curDate;
    },
    resetSearch () {
      this.setDTime()
      this.taskName = '';
      this.searchData.portraitGroupId = null;
      this.searchData.sex = null;
      this.searchData.ageGroup = null;
      this.selectDevice = [];
      this.selectBayonet = [];
      this.dSum = 0;

      this.clearMapSelect = !this.clearMapSelect; // 清除地图选择

    },
    beginSearch () {
      let _todo = false;
      if(this.selectBayonet.length === 0 && this.selectDevice.length === 0) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('请至少选择一个设备')
        }
        return false;
      }
      for (let key in this.searchData) {
        if (this.searchData[key] && key !== 'time1') {
          _todo = true;
        }
      }
      if (!_todo) {
        this.$message.warning('请至少输入一个搜索条件');
        return false;
      }
      this.searching = true;
      this.surveillanceIds = [];
      let params = {
        startTime: formatDate(this.searchData.time1, 'yyyy-MM-dd HH:mm:ss'),
        endTime: formatDate(this.searchData.time2, 'yyyy-MM-dd HH:mm:ss'),
        personGroupId: this.searchData.portraitGroupId || "" ,
//        personGroupId: '1lwx3mJIbdF4c4vEgpyLk0' ,
        // sex: this.searchData.sex || "",
        // age: this.searchData.ageGroup || "" ,
      }
      console.log(this.searchData.ageGroup);
      
      if(this.searchData.sex){
          params.sex=this.searchData.sex
      }
      if(this.searchData.ageGroup){
           params.age=this.searchData.ageGroup
      }
      let dNameList = [];
      let dList = this.selectDevice.map(res =>  res.deviceName);
      let bList = this.selectBayonet.map(res => res.bayonetName);
      dNameList = dList.concat(bList);
      console.log(dNameList, this.selectDevice)
      if (dNameList.length > 3) {
        params['deviceNames'] = dNameList.splice(0, 2);
        params['deviceNames'].push('等' + dNameList.length + '个设备');
        params['deviceNames'] =  params['deviceNames'].join(',')
      } else {
        params['deviceNames'] = dNameList.join(',')
      }
      if (this.selectBayonet.length) {
        params['bayonetIds'] = this.selectBayonet.map(res => res.uid).join(',');
      }
      if (this.selectDevice.length) {
        params['deviceIds'] = this.selectDevice.map(res => res.uid).join(',');
      }
      params['portraitGroupName'] = this.portraitGroupList.find(y => y.uid === this.searchData.portraitGroupId).groupName;
      // 判断选择的是实时还是离线 taskType 1为实时，2为离线.
      if (this.taskType === "1") {
        PortraitPostFocusRealTime(params, {
          errorMsg: '因数据量过大导致查询超时，建议进行离线分析',
          timeout: onlineOutTime
        }).then(res => {
              this.searching = false;
              if (res) {
                this.$set(res.data, 'taskResult', JSON.parse(res.data.taskResult));
                console.log(res);
                if (res.data.taskResult) {
                  this.evData = res.data.taskResult.map(x => {
                    x.checked = false;
                    return x;
                  })
                } else {
                  this.evData = []
                }
                this.selectIndex = 2;
                this.randerMap();
              }
            })
      } else {
        if (!this.taskName.replace(/\s+|\s+$/g, '')) {
          this.searching = false;
          if (!document.querySelector('.el-message--info')) {
            this.$message.info('任务名称不能为空');
            return false;
          }
        } else {
          params.taskName = this.taskName;
          params.taskOperationType = '1';
          PortraitPostFocusTask(params).then(res => {
            this.searching = false;
            if (res && res.data) {
              this.resetSearch();
              this.$message({
                type: 'success',
                message: '新建成功',
                customClass: 'request_tip'
              })
              this.getDataList()
              console.log(res.data)
            }
          })
        }
      }
    },
    drawMarkers (data) {
      console.log(data);
      for (let  i = 0; i < data.length; i++) {
        let obj = data[i];
        let _idWin = 'vlJfoImg' + i;
        if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
          let name = '', className = 'vl_icon_map_mark0';
          if (obj.bayonetName) {
            name = obj.bayonetName;
            className = 'vl_icon_map_mark1'
          } else {
            name = obj.deviceName
          }
          let _sContent = `<div id="${_idWin}" class="vl_jig_mk_img"><img src="${obj.subStoragePath}"><div><p>${name}</p><p>抓拍${obj.shotNum}次</p></div></div>`;
          // 窗体
          new AMap.Marker({ // 添加自定义点标记
            map: this.amap,
            position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
            offset: new AMap.Pixel(-50, -144), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: _sContent
          });
          // 摄像头
          let _id = 'vlJfoSxt' + i;
          let _content = '<div id=' + _id + ' class="vl_icon ' + className + ' "></div>'
          new AMap.Marker({ // 添加自定义点标记
            map: this.amap,
            position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
            offset: new AMap.Pixel(-28.5, -50), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: _content
          });
          setTimeout(() => {
            this.addListen($('#' + _id), 'mouseover', i, obj);
            this.addListen($('#' + _id), 'mouseout', i, obj);
            this.addListen($('#' + _id), 'click', i, obj);
          }, 300)
        }
      }
      this.amap.setFitView();
    },
    addListen (el, evType,key ,obj = {}) {
      let self = this;
      let _key;
      el.bind(evType, function () {
        switch (evType) {
          case 'mouseover':
            $('#vlJfoImg' + key).addClass('vl_jig_mk_img_hover');
            if (obj.bayonetName) {
              $('#vlJfoSxt' + key).addClass('vl_icon_map_hover_mark1');
            } else {
              $('#vlJfoSxt' + key).addClass('vl_icon_judge_02');
            }
            break;
          case 'mouseout':
            if (!obj.checked) {
              $('#vlJfoImg' + key).removeClass('vl_jig_mk_img_hover')
              if (obj.bayonetName) {
                $('#vlJfoSxt' + key).removeClass('vl_icon_map_hover_mark1');
              } else {
                $('#vlJfoSxt' + key).removeClass('vl_icon_judge_02');
              }
            }
            break;
          case 'click':
            _key  = self.curVideo.indexNum;
            self.evData.forEach(z => {
              z.checked = false;
            })
            obj.checked = true;
            if (_key !== null) {
              $('#vlJfoImg' + _key).removeClass('vl_jig_mk_img_hover')
              if (obj.bayonetName) {
                $('#vlJfoSxt' + _key).removeClass('vl_icon_map_hover_mark1');
              } else {
                $('#vlJfoSxt' + _key).removeClass('vl_icon_judge_02');
              }
            }
            $('#vlJfoImg' + key).addClass('vl_jig_mk_img_hover')
            if (obj.bayonetName) {
              $('#vlJfoSxt' + key).addClass('vl_icon_map_hover_mark1');
            } else {
              $('#vlJfoSxt' + key).addClass('vl_icon_judge_02');
            }
            self.showVideo(obj);
            break;
        }
      })
    },
    showVideo (data) {
      console.log(data)
      this.curVideo.indexNum = this.evData.indexOf(data);
      this.curSXT = data;
      this.showVideoList = true;
      let arr = data.focusList.map(x => {
        this.setPlayerData(x);
        return x;
      });
      this.curVideoList = arr;
    },
    setPlayerData (obj) {
      if (obj.videoPath) {
        obj.playerData = {
          type: 3,
          title: obj.deviceName,
          video: {
            uid: new Date().getTime() + '',
            downUrl: obj.videoPath
          }
        }
      } else {
        obj.playerData = null;
      }
    },
    hideVideoList () {
      this.evData.forEach(x => x.checked = false);
      const _key = this.curVideo.indexNum;
      $('#vlJfoImg' + _key).removeClass('vl_jig_mk_img_hover')
      if (document.getElementById('vlJfoSxt' + _key).classList.contains('vl_icon_map_hover_mark1')) {
        $('#vlJfoSxt' + _key).removeClass('vl_icon_map_hover_mark1')
      } else {
        $('#vlJfoSxt' + _key).removeClass('vl_icon_judge_02')
      }
      this.curVideo.indexNum = null;
      this.showVideoList = false;
    }
  },
  watch: {
    selectIndex (e) {
      if (e === 2) {
        this.randerMap();
      }
    }
  }
}
</script>
<style lang="scss">
  .zdgz_xzsb_s {
    height: 40px;
    line-height: 40px;
    width: 100%;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    cursor: pointer;
    color: #999999;
    padding: 0 6px;
    > span {
      display: inline-block;
      width: 50%;
      &:last-child {
        text-align: right;
      }
    }
  }
  .zdgz_dtxz_rst {
    width: 100%;
    line-height: 40px;
    padding: 0px 15px; margin-top: 5px;
    background-color: #F5F7FA;
    color: #C0C4CC;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    > span {
      display: inline-block;
      padding: 0 3px;
      color: #333;
    }
    > a {
      display: inline-block;
      padding-left: 5px;
      color: #2580FC !important;
      text-decoration: none !important;
      /*font-style: italic;*/
      cursor: pointer;
    }
  }

  .vl_jtc_mk_img {
    width: 98px;
    height: 98px;
    border: .04rem solid #FFFFFF;
    img {
      width: 100%;
      height: 100%;
    }
    p {
      display: none;
    }
  }
  .vl_jtc_mk_img_hover {
    position: relative;
    border: .04rem solid #0C70F8;
    > div {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: .4rem;
      background: rgba(12, 112, 248, .8);
      p {
        display: block;
        color: #FFFFFF;
        font-size: .12rem;
        line-height: .2rem;
        text-indent: .08rem;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
 
 
  .vl_judge_tc {
    .Breadc{
      position: absolute;
      top: 0px;
      width: 100%;
      height: 50px;
      left: 0px;
    }
    position: relative;
   
    width: 100%;
    height: 100%;
    .camera-select {
      .el-select-dropdown {
        display: none;
      }
      .el-select__tags {
        >span {
          white-space: nowrap;
          display: block;
          width: 100%;
          overflow: hidden;
        }
      }
    }
    .vl_j_left {
      position: relative;
      /*z-index: 11;*/
      float: left;
      width: 272px;
      min-height: 763px;
      padding-top: 24px;
      height: 100%;
      // margin-left: 0.2rem;
      background: #ffffff;
      box-shadow:4px 0px 10px 0px #838383;
      box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
      animation: fadeInLeft .4s ease-out .3s both;
      .vl_jtc_img_box {
        width: 100%;
        height: auto;
        padding: 0 .2rem;
        border-bottom: 1px dashed #D3D3D3;
        padding-bottom: .44rem;
        .vl_jtc_upload_img {
          position: relative;
          .vl_jtc_upload {
            .el-upload--picture-card {
              width: 100%!important;
              padding-top: 100%!important;
              position: relative!important;
              > i {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
              }
              > img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                -webkit-border-radius: 6px;
                -moz-border-radius: 6px;
                border-radius: 6px;
              }
            }
          }
          > p {
            position: absolute;
            bottom: 7px;
            text-align: center;
            font-size: 0.14rem;
            width: 100%;
            &:hover {
              text-decoration: underline;
            }
          }
        }
        .vl_jtc_img_list {
          width: 100%;
          margin-top: 10px;
          text-align: center;
          .middle_img {
            display: inline-block;
          }
          > div {
            width: 30%;
            padding-top: 30%;
            border: 1px dashed #D3D3D3;
            position: relative;
            &:hover {
              .del_mask {
                display: block;
              }
            }
            &:last-child {
              float: right;
            }
            &:first-child {
              float: left;
            }
            .del_mask {
              display: none;
              position: absolute;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, .2);
              top: 0;
              > i {
                cursor: pointer;
                display: block;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                color: #ffffff;
                width: 16px;
                height: 16px;
                text-align: center;
              }
            }
            > img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .vl_jtc_search {
        width: 100%;
        height: auto;
        padding: 0 20px;
        padding-top: .4rem;
        .zdgz_left_radio {
          display: flex;
          height: 40px;
          >span {
            display: block;
            &:first-child {
              width: 90px;
              line-height: 40px;
            }
          }
        }
        .zdgz_left_search_type {
          display: flex;
          color: #666666;
          margin: 10px 0px;
          span {
            display: block;
            width: 50%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border: 1px solid #D3D3D3;
            cursor: pointer;
            &:first-child {
              border-right: none;
              -webkit-border-radius: 4px 0px 0px 4px;
              -moz-border-radius: 4px 0px 0px 4px;
              border-radius: 4px 0px 0px 4px;
            }
            &:last-child {
              border-left: none;
              -webkit-border-radius: 0px 4px 4px 0px;
              -moz-border-radius: 0px 4px 4px 0px;
              border-radius: 0px 4px 4px 0px;
            }
          }
          .active {
            background: #0C70F8;
            color: #ffffff;
            border-color: #0C70F8;
          }
        }
        .el-range-editor {
          > input {
            width: 50%;
          }
        }
        button {
          height: .5rem;
          line-height: .5rem;
          padding: 0 .12rem;
          margin-top: .14rem;
        }
        .el-select {
          margin-bottom: .2rem;
        }
        > div {
          margin-bottom: .2rem;
        }
      }
    }
    .vl_j_right {
      display: inline-block;
      width: calc(100% - 272px);
      height: calc(100% - 5px);
      position: relative;
      .frequent-a-content {
        height: calc(100% - 20px);
        min-height: 760px;
        margin: 20px;
        margin-bottom: 0px;
        background: #ffffff;
        box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
        .tab-menu {
          background-color: #fff;
          padding-top: 8px;
          overflow: hidden;
          border-bottom: 1px solid #f2f2f2;
          li {
            float: left;
            width: auto;
            font-size: 16px;
            margin: 0 20px;
            height: 44px;
            line-height: 44px;
            text-align: center;
            color: #333;
            cursor: pointer;
          }
          .is-active {
            color: #0c70f8;
            border-bottom: 2px solid #0c70f8;
          }
        }
        .search_box {
          width: 100%;
          padding: 20px;
          .event_form {
            width: 100%;
            .select_btn,
            .reset_btn {
              width: 80px;
            }
            .select_btn {
              background-color: #0c70f8;
              color: #ffffff;
            }
            .reset_btn {
              background-color: #ffffff;
              color: #666666;
              border-color: #dddddd;
            }
          }
          .divide {
            border: 1px dashed #fafafa;
          }
        }
        .content-box {
          padding: 0 20px;
          .table_box {
            margin-top: 10px;
            .operation_btn {
              display: inline-block;
              padding: 0 10px;
              border-right: 1px solid #f2f2f2;
              &:last-child {
                border-right: none;
              }
            }
          }
        }
        .vl_jig_right {
          width: 100%;
          height: calc(100% - 53px);
          position: relative;
          #tcMap {
            width: 100%;
            height: 100%;
          }
          .vl_jfo_right {
            position: absolute;
            right: 0;
            top: 0;
            width: 2.6rem;
            height: 100%;
            z-index: 1;
            padding: 0.08rem .2rem .2rem .2rem;
            box-shadow: 0px 10px 12px 0px rgba(4,24,54,0.2);
            background: #ffffff;
            &:hover {
              .vl_jig_right_close {
                display: block;
              }
            }
            .video_container {
              height: calc(100% - 30px);
              .vl_jtc_mk {
                margin-top: .2rem;
                .vl_jig_right_btn {
                  position: absolute;
                  bottom: 0;
                  right: 0;
                  height: 28px;
                  padding-top: 2px;
                  span {
                    cursor: pointer;
                  }
                }
              }
            }
            .vl_jig_right_title {
              width: 2.2rem;
              color: #333333;
              >p {
                width: 100%;
                display: flex;
                align-items: center;
                i {
                  margin-right: 5px;
                }
                span {
                  width: calc(100% - 17px);
                  display: inline-block;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
              }
            }

            .vl_jig_right_close {
              display: none;
              position: absolute;
              width: .28rem;
              height: .5rem;
              line-height: .5rem;
              text-align: center;
              background: #FFFFFF;
              top: 50%;
              right: 100%;
              -webkit-border-radius: .14rem 0 0 .14rem;
              -moz-border-radius: .14rem 0 0 .14rem;
              border-radius: .14rem 0 0 .14rem;
              animation: fadeInRight .2s ease-out .2s both;
              > i {
                cursor: pointer;
                &:hover {
                  color: #409EFF;
                }
              }
            }
          }
        }
      }
    }
    .close_btn {
      position: absolute;
      top: 30px;
      right: 30px;
      font-size: .3rem;
      cursor: pointer;
      &:hover {
        color: #409EFF;
      }
    }
    .vl_jtc_mk {
      width: 2.18rem;
      height: 1.22rem;
      position: relative;
      > video {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }
      > p {
        width: 100%;
        position: absolute;
        color: #FFFFFF;
        bottom: .08rem;
        font-size: .12rem;
        padding: 0 .06rem;
        line-height: 20px;
        > i {
          height: 20px;
          float: right;
          vertical-align: middle;
        }
      }
    }
    .vl_jtc_mk_check {
      > input {
        position: absolute;
        top: 0;
        right: 0;
        &:after {
          position: absolute;
          width: 14px;
          height: 14px;
          top: 0;
          content: '';
          background-color: #FFFFFF;
          color: #fff;
          display: block;
          border: 1px solid #409EFF;
          line-height: 11px;
          text-align: center;
          border-radius: 3px;
        }
      }
      > input:checked {
        &:after {
          background-color: #409EFF;
          content: '✓';
          font-size: 10px;
        }
      }
    }
    .history-pic-dialog {
      .el-dialog {
        max-width: 12.6rem;
        width: 100%!important;
      }
      .el-dialog__title {
        font-size: .16rem;
        color: #333333;
      }
      .el-dialog__body {
        padding: 0 .76rem .3rem;
      }
      .his-pic-box {
        width: 100%;
        height: 4.6rem!important;
        .his-pic-item {
          float: left;
          width: 1.38rem;
          height: 1.38rem;
          border: .02rem solid #FFFFFF;
          margin-right: .2rem;
          margin-bottom: .2rem;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .active {
          border-color: #0C70F8;
        }
      }
      .el-dialog__footer {
        button {
          width: 1.4rem!important;
          height: .4rem;
          line-height: .4rem;
          padding: 0;
        }
      }
    }
    .vl_jig_mk_img {
      width: 98px;
      height: 98px;
      border: .04rem solid #FFFFFF;
      img {
        width: 100%;
        height: 100%;
      }
      p {
        display: none;
      }
    }
    .vl_jig_mk_img_hover {
      position: relative;
      border: .04rem solid #0C70F8;
      > div {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: .4rem;
        background: rgba(12, 112, 248, .8);
        p {
          display: block;
          color: #FFFFFF;
          font-size: .12rem;
          line-height: .2rem;
          text-indent: .08rem;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
    .vl_jfo_sxt {
      -webkit-transition: 0s all!important;
      -moz-transition: 0s all!important;
      -ms-transition: 0s all!important;
      -o-transition: 0s all!important;
      transition: 0s all!important;
    }
  }
</style>
<style lang="scss" scoped="scoped">
.map_rrt_u2 {
  position: absolute; right: 30px;
  bottom: 30px;
  margin-top: .2rem;
  font-size: 26px;
  background: #ffffff;
  width: 78px;
  padding: 0 10px;
  > li {
    line-height: 70px;
    text-align: center;
    cursor: pointer;
    border-bottom: 1px solid #F2F2F2;
    > i {
      margin-top: 0;
      display: inline-block;
    }
    color: #999999;
    &:hover {
      color: #0C70F8;
    }
  }
}
 .vl_judge_tc{
    padding-top: 50px;
  }
.full {
  width: 100%;
}
.select_btn {
  background-color: #0c70f8;
  color: #ffffff;
}
.select_btn:hover {
   background-color: #0466de;
}
.judge_zdgz_content {
      height: 100%;
     
    }
  .se_hi_box {
    width: 100%;
    height: 100%;
    /deep/.el-table {
      table {
        td {
          padding: 0!important;
          height: .98rem;
          line-height: .98rem;
        }
        th {
          padding: 0;
          height: .98rem;
          line-height: .98rem;
        }
      }
      table {
        thead {
          td {
            height: .54rem;
            line-height: .54rem;
          }
          th {
            height: .54rem;
            line-height: .54rem;
          }
        }
      }
    }
    .tt_img {
      width: .76rem;
      height: .76rem;
      position: relative;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
      margin: 0 auto;
      img {
        width:  100%;
        height: 100%;
      }
      > span {
        color: #FFFFFF;
        display: block;
        position: absolute;
        bottom: 5px;
        right: 5px;
        background: rgba(0, 0, 0, .6);
        width: .20rem;
        height: .20rem;
        line-height: .20rem;
        text-align: center;
        -webkit-border-radius: .1rem;
        -moz-border-radius: .1rem;
        border-radius: .1rem;
        font-size: .14rem;
      }
    }
  }
  .se_hi_pa {
    text-align: center;
  }
  .event_status {
    &:before {
      content: '.';
      font-size: 30px;
      margin-right: 4px;
      vertical-align: super;
    }
  }
  .untreated_event {
    &:before {
      color: #0C70F8;
    }
  }
  .treating_event {
    &:before {
      color: #63C751;
    }
  }
  .end_event {
    &:before {
      color: #B8B8B8;
    }
  }
</style>