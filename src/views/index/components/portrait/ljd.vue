<template>
  <div class="ljd point">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/portrait/menu' }">人像侦查</el-breadcrumb-item>
        <el-breadcrumb-item>落脚点分析</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div :class="['left',{hide:hideleft}]">
      <div class="plane">
        <div class="ljd_left_search_type">
          <span :class="{'active': taskType === '1'}" @click="taskType = '1'">在线查询</span>
          <span :class="{'active': taskType === '2'}" @click="taskType = '2'">离线任务</span>
        </div>
        <div v-show="taskType === '2'" class="ljd_left_radio">
          <span>任务名称：</span>
          <span>
            <el-input v-model="taskName" placeholder="请输入任务名称" maxlength="20"></el-input>
          </span>
        </div>
        <el-form
            :model="ruleForm"
            status-icon
            ref="ruleForm"
            label-width="0px"
            class="demo-ruleForm"
          >
          <el-form-item  prop="data1">
            <el-date-picker
              v-model="ruleForm.data1"
              type="datetime"
              time-arrow-control
              :clearable="false"
              placeholder="开始时间"
              :picker-options="pickerOptions"
              class="full vl_date"
            ></el-date-picker>
          </el-form-item>
          <el-form-item  prop="data2">
            <el-date-picker
              v-model="ruleForm.data2"
              type="datetime"
              time-arrow-control
              :clearable="false"
              :picker-options="pickerOptions"
              placeholder="结束时间"
              class="full vl_date vl_date_end"
            ></el-date-picker>
          </el-form-item>
          <el-form-item style="text-align: center;">
            <div style="padding: 0 15px; height: 210px;">
              <div is="vlUpload" :clear="uploadClear" @uploadEmit="uploadEmit" :imgData="imgData"></div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-button @click="resetForm('ruleForm')" class="full">重置</el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" :loading="isload" @click="submitForm('ruleForm')" class="select_btn full">分析</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div :class="['vl_ljd_right']">
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
            <div class="reselt" v-if="reselt">
              <div class="plane insetPadding">
                <h3 class="title">分析结果</h3>
                <div class="limitBoxs">
                  <vue-scroll>
                    <el-collapse v-model="activeNames">
                      <el-collapse-item  v-for="(item,index) in evData" :key="index" :name="index">
                        <template slot="title">
                          <span class="result_device_name" :title="item.groupName">{{item.groupName}}</span>
                          <span>({{item.totalNum}}次)</span>
                          <!-- <i class="header-icon el-icon-info"></i> -->
                        </template>
                        <div class="itembox" v-for="(v,d) in item.personDetailList" :key="d">
                          <div class="imgInfo"  @click.stop="onOpenDetail(v, d, item)">
                            <img :src="v.subStoragePath" class="img">
                            <div>
                              <p class="timedata"><i class="el-icon-time"></i>{{v.shotTime}}</p>
                              <span class="subdata">
                        <i class="vl_icon vl_icon_retrieval_03"></i>
                        <b v-if="v.semblance">{{(v.semblance*1).toFixed(2)}}</b>%
                      </span>
                            </div>
                            <i class="del_list_icon el-icon-delete" @click.stop="delItems(d,index)"></i>
                          </div>
                        </div>

                      </el-collapse-item>

                    </el-collapse>
                  </vue-scroll>
                </div>
                <div class="insetLeft2" @click="hideResult"></div>
              </div>
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
                <el-button class="reset_btn" @click="resetTaskForm('taskForm')">重置</el-button>
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
                            @click="recoveryOrRestart(scope.row)"
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
    <div id="mapBox"></div>

    <!-- 人工筛选 -->
    <el-dialog
      title="人工筛选"
      :visible.sync="dialogChoose"
      width="900px">
      <div class="choose">
        <div class="limitBox">
          <vue-scroll>
          <el-collapse v-model="activeChoose">
            <el-collapse-item  v-for="(item,index) in chooseData" :key="index" :title="item.groupName+'（'+item.totalNum+'次）'" :name="index">
              <div class="itembox" v-for="(v,d) in item.personDetailList" :key="d">
                <div class="imgInfo">
                   <img :src="v.subStoragePath" class="img">
                   <div>
                     <p class="timedata"><i class="el-icon-time"></i>{{v.shotTime}}</p>
                    <span class="subdata">
                      <i class="vl_icon vl_icon_retrieval_03"></i>
                      <b v-if="v.semblance">{{(v.semblance*1).toFixed(2)}}</b>%
                    </span>
                   </div>
                  <i class="del del_list_icon el-icon-delete" @click="delItem(d,index)"></i>
                </div>
              </div>
              
            </el-collapse-item>
            
            
          </el-collapse>
          </vue-scroll>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChoose = false">取 消</el-button>
        <el-button type="primary" @click="chooseOk">确 定</el-button>
      </span>
    </el-dialog>

    <!--上传记录弹窗-->
    <el-dialog
      :visible.sync="historyPicDialog"
      class="history-pic-dialog"
      :close-on-click-modal="false"
      top="4vh"
      title="最近上传的图片"
    >
      <div style="text-align: center;font-size: 20px;" v-if="loadingHis">
        <i class="el-icon-loading"></i>
      </div>
      <vue-scroll class="his-pic-box" v-else-if="historyPicList.length">
        <div
          class="his-pic-item"
          :class="{'active': item.checked}"
          v-for="item in historyPicList"
          :key="item.uid"
          @click="chooseHisPic(item)"
        >
          <img :src="item.path" alt>
        </div>
        <div style="clear: both;"></div>
      </vue-scroll>
      <p v-else>暂无历史记录</p>
      <div slot="footer">
        <el-button @click="historyPicDialog = false">取消</el-button>
        <el-button type="primary" @click="addHisToImg" :disabled="choosedHisPic.length === 0">确认</el-button>
      </div>
    </el-dialog>

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

<!-- 抓拍信息 -->

    <portraitDetail :detailData="detailData"></portraitDetail>
  </div>
</template>
<script>
import { ajaxCtx, mapXupuxian } from "@/config/config.js";
import { cityCode } from "@/utils/data.js";
import {
  JtcPUTAppendixsOrder,
  JtcPOSTAppendixInfo,getFoothold,JtcGETAppendixInfoList
} from "@/views/index/api/api.judge.js";
import {
  PortraitPostStayPointRealtime,
  PortraitPostStayPointTask,
  PortraitPutStayPointTaskUpDate,
  PortraitGetStayPointTaskByUid,
  PortraitGetStayPointTasks
} from '@/views/index/api/api.portrait.js'
import portraitDetail from './common/portraitDetail.vue';
import { log } from 'util';
import {formatDate, dateOrigin} from '@/utils/util.js';
import vlUpload from '@/components/common/upload.vue';
export default {
  components: {
    vlUpload,
    portraitDetail
  },
  data() {
    return {
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


      taskName: '', // 左侧输入任务名称
      taskType: "1", // 左侧任务类型，1 实时，2离线
      uploadClear: {},
      detailData:null,
      seData:null,
      isload:false,
      dialogChoose:false,
      showDetail:false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
    
      /* 上传图片变量 */
      uploadAcion: ajaxCtx.base + "/new", //上传路径
      uploading: false, // 是否上传中
      curImageUrl: "", // 当前上传的图片
      historyPicList: [], // 上传历史记录
      selectedHistoryPic: null, // 当前选中的历史图片
      historyPicDialog: false,
      loadingHis: false, // 加载效果
      imgData: null,
      amap: null,
      // select: "",
      reselt: false,
      hideleft: false,
      ruleForm: {
        data1: dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)),
        data2: new Date()
      },
      activeNames: [],
      activeChoose: [],
      pricecode: cityCode,
      chooseData:[],
      options: [],
      evData: []
    };
  },
  mounted() {
    if( this.$route.query.imgurl || this.$route.query.path){
      let a =  this.$route.query.imgurl || this.$route.query.path ;

      this.imgData = Object.assign({}, {path: a});

      this.curImageUrl= a;
    }

    let map = new window.AMap.Map("mapBox", {
      zoom: 10,
      center: mapXupuxian.center
    });
    map.setMapStyle("amap://styles/whitesmoke");
    this.amap = map;

    this.getDataList();
  },
   computed: {
    choosedHisPic() {
      return this.historyPicList.filter(x => x.checked);
    }
  },
  watch: {
    selectIndex (e) {
      if (e === 2) {
        this.randerMap();
      }
    }
  },
  methods: {
  // 离线任务相关
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
    //恢复任务,重启任务
    recoveryOrRestart(obj) {
      putTaskInfosResume(obj.uid).then(res => {
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
    // 获取离线任务
    getDataList () {
      const params = {
        'where.taskName': this.taskForm.taskName,
        'where.taskType': 11, //  1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析 4:以图搜人 9：人员侦查报告,6重点关注, 11人像落脚点
        'where.startTime': this.taskForm.reportTime ? this.taskForm.reportTime[0] : null,
        'where.endTime': this.taskForm.reportTime ? this.taskForm.reportTime[1] : null,
        'where.isFinish': this.selectIndex,   //是否完成 0:未完成(包含处理中、处理失败、处理中断) 1：已完成(处理成功)
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        order: 'desc',
        orderBy: 'create_time'
      };
      PortraitGetStayPointTasks(params)
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


    randerMap () {
      this.$nextTick(() => {
        $('.vl_jig_right').append($('#mapBox'))
        this.amap.clearMap();
        this.drawMarkers(this.evData);
      })
    },
    uploadEmit (data) {
      console.log('uploadEmit data', data);
      if (data && data.path) {
        this.curImageUrl = data.path;
      }
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
    /**
     * 地图描点
     */
    drawPoint (data) {
      console.log(data)
      if (this.markerPoint) {
        this.map.remove(this.markerPoint)
      }
      let _content = '<div class="vl_icon vl_icon_judge_02"></div>'
      this.markerPoint = new window.AMap.Marker({ // 添加自定义点标记
        map: this.map,
        position: [data.longitude, data.latitude], // 基点位置 [116.397428, 39.90923]
        offset: new window.AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // 自定义点标记覆盖物内容
        content: _content
      });
      this.map.setZoomAndCenter(16, [data.longitude, data.latitude]); // 自适应点位置
      let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`
      this.infoWindow = new window.AMap.InfoWindow({
        map: this.map,
        isCustom: true,
        closeWhenClickMap: false,
        position: [data.longitude, data.latitude],
        offset: new window.AMap.Pixel(0, -70),
        content: sConent
      })
    },
     /**
     * 打开抓拍弹框
     */
    onOpenDetail (obj, index, list) {

      this.detailData = {
        type: 3, // 3落脚点分析
        // params: this.searchParams(), // 查询参数
        list: list.personDetailList, // 列表
        index: index, // 第几个
        pageSize: list.totalNum,
        total: list.totalNum,
        pageNum: 1
      }
    },
    hideResult() {
      this.reselt = false;
      this.hideLeft();
    },
    hideLeft() {
      this.hideleft = !this.hideleft;
      if (!this.hideleft && this.evData.length > 0) {
        this.reselt = true;
      }
    },
    submitForm(v) {
      if (
        this.ruleForm &&
        this.ruleForm.data1 &&
        this.ruleForm.data2  &&
        this.curImageUrl
      ) {
        let params = {
          startTime: formatDate(this.ruleForm.data1),
          endTime: formatDate(this.ruleForm.data2),
          faceUrl: this.curImageUrl
        };
        this.isload = true;
        // 判断选择的是实时还是离线 taskType 1为实时，2为离线.
        if (this.taskType === "1") {
          PortraitPostStayPointRealtime(params).then(res => {
            this.isload = false;
            if (res) {
              this.$set(res.data, 'taskResult', JSON.parse(res.data.taskResult));
              console.log(res);
              this.selectIndex = 2;
              this.randerMap();
              if (!res.data || res.data.length === 0) {
                this.$message.info("抱歉，没有找到匹配结果");
                this.chooseData=[]
                this.evData=[]
                //this.searching = false;
                return false;
              }else{
                this.dialogChoose=true
                for(let i=0; i<res.data.length;i++){
                  this.activeChoose.push(i)
                }
                this.chooseData=res.data
              }
            }
          })
        } else {
          if (!this.taskName.replace(/\s+|\s+$/g, '')) {
            this.isload = false;
            if (!document.querySelector('.el-message--info')) {
              this.$message.info('任务名称不能为空');
              return false;
            }
          } else {
            params.taskName = this.taskName;
            PortraitPostFocusTask(params).then(res => {
              this.isload = false;
              if (res && res.data) {
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
      } else {
        this.$message.info("请上传图片。");
      }
    },
    resetForm(v) {
      this.curImageUrl = "";
      this.ruleForm.data1 = dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000));
      this.ruleForm.data2 = new Date();
      this.uploadClear = {};
    },
    // 重置查询条件
    resetTaskForm (form) {
      this.$refs[form].resetFields();
      this.getDataList();
    },
    compare(prop) {
      return function(obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
          val1 = Number(val1);
          val2 = Number(val2);
        }
        if (val1 < val2) {
          return 1;
        } else if (val1 > val2) {
          return -1;
        } else {
          return 0;
        }
      };
    },
    //分析结果删除
    delItems(d,index){ 
      //this.chooseData.
      let arr=this.evData[index].personDetailList
      arr.splice(d, 1)
      this.evData[index].totalNum -=1;
      if(this.evData[index].totalNum==0){
        this.evData.splice(index,1)
      }
      this.amap.clearMap();
      this.drawMarkers(this.evData);
    },
    //人工筛选删除
    delItem(d,index){ 
      //this.chooseData.
      let arr=this.chooseData[index].personDetailList
      arr.splice(d, 1)
      this.chooseData[index].totalNum -=1;
      if(this.chooseData[index].totalNum==0){
        this.chooseData.splice(index,1)
      }
    },
    chooseOk(){
      this.reselt = true;

      this.dialogChoose = false
     // this.evData = this.chooseData
      this.evData = this.chooseData.map(x => {
            x.checked = false;
            return x;
          });
      for(let i=0; i<this.evData.length;i++){
          this.activeNames.push(i)
          this.evData[i].shotPlaceLongitude = this.evData[i].personDetailList[0].shotPlaceLongitude
          this.evData[i].shotPlaceLatitude = this.evData[i].personDetailList[0].shotPlaceLatitude
          //obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude
        }
        this.evData.sort(this.compare("totalNum"));
        this.drawMarkers(this.evData);
        //this.showEventList();
         //console.log();
          
    },
    getFoothold(d) {
      getFoothold(d).then(res => {
        if (res) {
          this.isload=false
          // this.dialogChoose=true
          // console.log(res);
          
          if (!res.data || res.data.length === 0) {
            this.$message.info("抱歉，没有找到匹配结果");
            this.amap.clearMap();
            this.chooseData=[]
            this.evData=[]
            //this.searching = false;
            return false;
          }else{
            this.dialogChoose=true
            for(let i=0; i<res.data.length;i++){
              this.activeChoose.push(i)
            }
             this.chooseData=res.data
          }
          this.amap.clearMap();
        }else{
          this.isload=false
        }
      });
    },
    drawMarkers(data) {
      //console.log(data);
      let limit = 0;
      if (data.length > 3) {
        limit = data[2].totalNum;
      }

      for (let i = 0; i < data.length; i++) {
        let obj = data[i];
        let _idWin = "vlJfoImg" + i;
        let isBig = obj.totalNum >= limit ? true : false;
        if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
          if (isBig) {
            let _sContent = `<div id="${_idWin}" class="vl_jig_mk_p"><p>${
              obj.groupName
            }</p><p class="big">${obj.totalNum}次</p></div>`;
            // 窗体
            new AMap.Marker({
              // 添加自定义点标记
              map: this.amap,
              position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
              offset: new AMap.Pixel(-90, -124), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: obj,
              // 自定义点标记覆盖物内容
              content: _sContent
            });
          }
          // 摄像头
          let _id = "vlJfoSxt" + i;
          let _content =
            "<div id=" +
            _id +
            ' class="vl_icon vl_jfo_sxt vl_icon_judge_04"></div>';
          new AMap.Marker({
            // 添加自定义点标记
            map: this.amap,
            position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
            offset: new AMap.Pixel(-28.5, -50), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: _content
          });
          setTimeout(() => {
            this.addListen($("#" + _id), "mouseover", i);
            this.addListen($("#" + _id), "mouseout", i, obj);
            this.addListen($("#" + _id), "click", i, obj);
          }, 300);
        }
      }
      this.amap.setFitView();
    },
    addListen(el, evType, key, obj = {}) {
      let self = this;
      let _key;
      el.bind(evType, function() {
        switch (evType) {
          case "mouseover":
            $("#vlJfoImg" + key).addClass("vl_jig_mk_img_hover");
            $("#vlJfoSxt" + key).addClass("vl_icon_judge_02");
            break;
          case "mouseout":
            if (!obj.checked) {
              $("#vlJfoImg" + key).removeClass("vl_jig_mk_img_hover");
              $("#vlJfoSxt" + key).removeClass("vl_icon_judge_02");
            }
            break;
          // case "click":
          //   _key = self.curVideo.indexNum;
          //   self.evData.forEach(z => {
          //     z.checked = false;
          //   });
          //   obj.checked = true;
          //   if (_key !== null) {
          //     $("#vlJfoImg" + _key).removeClass("vl_jig_mk_img_hover");
          //     $("#vlJfoSxt" + _key).removeClass("vl_icon_judge_02");
          //   }
          //   $("#vlJfoImg" + key).addClass("vl_jig_mk_img_hover");
          //   $("#vlJfoSxt" + key).addClass("vl_icon_judge_02");
          //   self.showVideo(obj);
          //   break;
        }
      });
    },
    /* 上传图片方法 */
    beforeAvatarUpload(file) {
      // 上传图片控制
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt = file.size / 1024 / 1024 < 100;
      if (!isJPG) {
        this.$message.error("只能上传 JPG / PNG 格式图片!");
      }
      if (!isLt) {
        this.$message.error("上传图片大小不能超过 100MB!");
      }
      this.uploading = true;
      return isJPG && isLt;
    },
    uploadSucess(response, file) {
      //上传成功
      this.uploading = false;
      console.log(file);
      if (response && response.data) {
        let oRes = response.data;
        if (oRes) {
          let x = {
            cname: oRes.fileName, // 附件名称 ,
            contentUid: this.$store.state.loginUser.uid,
            // desci: '', // 备注 ,
            filePathName: oRes.fileName, // 附件保存名称 ,
            fileType: 1, // 文件类型 ,
            imgHeight: oRes.fileHeight, // 图片高存储的单位位px ,
            imgSize: oRes.fileSize, // 图片大小存储的单位位byte ,
            imgWidth: oRes.fileWidth, //  图片宽存储的单位位px ,
            // otherFlag: '', // 其他标识 ,
            path: oRes.fileFullPath, // 附件路径 ,
            // path: oRes.path,
            thumbnailName: oRes.thumbnailFileName, // 缩略图名称 ,
            thumbnailPath: oRes.thumbnailFileFullPath // 缩略图路径 ,
            // uid: '' //  附件标识
          };
          JtcPOSTAppendixInfo(x).then(jRes => {
            if (jRes) {
              x["uid"] = jRes.data;
              console.log(x);
            }
          });
          this.imgData = x;
          this.curImageUrl = x.path;
        }
      }
    },
    /* 拖拽图片上传的方法 */
    drag(ev) {
      ev.dataTransfer.setData("Text", ev.target.currentSrc);
    },
    drop(e) {
      this.curImageUrl = e.dataTransfer.getData("Text");
      let x = {
        contentUid: this.$store.state.loginUser.uid,
        cname: "拖拽图片" + Math.random(),
        filePathName: "拖拽图片" + Math.random(),
        path: e.dataTransfer.getData("Text")
      };
      JtcPOSTAppendixInfo(x).then(jRes => {
        if (jRes) {
          x["uid"] = jRes.data;
          console.log(x);
        }
      });
    },
    allowDrop(e) {
      e.preventDefault();
    },
    handleError() {
      //上传失败
      this.uploading = false;
      this.$message.error("上传失败");
    },
     //选择最近上传的图片
    chooseHisPic(item) {
      this.historyPicList.forEach(x => {
        x.checked = false;
      });
      item.checked = true;
    },
    //获取上传记录
    showHistoryPic() {
      this.loadingHis = true;
      this.historyPicDialog = true;
      let params = {
        userId: this.$store.state.loginUser.uid,
        fileType: 1
      };
      JtcGETAppendixInfoList(params)
        .then(res => {
          if (res) {
            this.loadingHis = false;
            res.data.forEach(x => (x.checked = false));
            this.historyPicList = res.data;
          }
        })
        .catch(() => {
          this.historyPicDialog = false;
        });
    },
    //从历史上传图片中上传
    addHisToImg() {
      this.historyPicDialog = false;
      let _ids = [];
      this.choosedHisPic.forEach(x => {
        _ids.push(x.uid);
        this.curImageUrl = x.path;
        this.disab = false;
        this.imgData = x;
      });
      let _obj = {
        appendixInfoIds: _ids.join(",")
      };
      JtcPUTAppendixsOrder(_obj);
    },
    delPic() {
      //删除图片
      this.curImageUrl = "";
    }
  }
};
</script>
<style lang="scss" scoped>
  .vl_ljd_right {
    display: inline-block;
    width: calc(100% - 272px);
    height: calc(100% - 59px);
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
        #mapBox {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

.ljd_left_search_type {
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
.ljd_left_radio {
  margin: 20px 0;
  display: flex;
  height: 40px;
  >span {
    display: block;
    &:first-child {
      width: 108px;
      line-height: 40px;
    }
  }
}
.el-radio__label { padding-left: 0; }
.fz12{
  font-size: 12px;
}
.point {
  width: 100%;
  height: 100%;
  // overflow: hidden;
}
.breadcrumb_heaer {
  background: #ffffff;
}
.full {
  width: 100%;
}
.insetPadding {
  padding: 10px;
}
.right.hide {
  width: calc(100% - 272px);
  height: calc(100% - 54px);
  float: right;
}
.right {
  width: 100%;
  height: calc(100% - 54px);
  float: right;
}
.reselt {
  width: 272px;
  height: calc(100% - 54px);
  background-color: #ffffff;
  position: absolute;
  left: 275px;
  z-index: 2;
  // overflow: hidden;
  box-shadow: 4px 0px 10px 0px #838383;
  box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
  animation: fadeInLeft 0.4s ease-out 0.3s both;
  .title {
    font-size: 14px;
    font-weight: bold;
    padding-bottom: 12px;
  }
}
.left {
  position: relative;
  width: 272px;
  height: calc(100% - 54px);
  min-height: 763px;
  background-color: #ffffff;
  float: left;
  z-index: 1;
  margin-left: 0px;
  box-shadow: 4px 0px 10px 0px #838383;
  box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
  animation: fadeInLeft 0.4s ease-out 0.3s both;
  transition: marginLeft 0.3s ease-in;
  .plane {
    // padding: 20px;
    // position: relative;
    // height: 100%;
    // overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 20px;
    position: relative;
    height: 100%;
  }
  .line40 {
    line-height: 40px;
  }
  .inset {
    display: inline-block;
    line-height: 40px;
    font-style: normal;
  }
  .firstItem {
    margin-bottom: 5px;
  }
}
.insetLeft ,.insetLeft2{
  position: absolute;
  right: -28px;
  width: 25px;
  height: 178px;
  top: 50%;
  margin-top: -89px;
  display: inline-block;
  background-repeat: no-repeat;
  transform: rotate(180deg);
  background-image: url(../../../../assets/img/icons.png);
  background-position: -380px -1269px;
  cursor: pointer;
}
.insetLeft:hover,.insetLeft2:hover{
  position: absolute;
  right: -28px;
  width: 28px;
  height: 178px;
  top: 50%;
  margin-top: -89px;
  display: inline-block;
  background-repeat: no-repeat;
  transform: rotate(180deg);
  background-image: url(../../../../assets/img/icons.png);
  background-position: -318px -1269px;
  cursor: pointer;
}
.hide {
  .insetLeft {
    transform: rotate(180deg);
    background-position: -504px -1269px;
  }
  .insetLeft:hover{
    transform: rotate(180deg);
    background-position: -440px -1269px;
  }
}
.select_btn {
  background-color: #0c70f8;
  color: #ffffff;
}
.select_btn:hover{
   background-color: #0466de;
}
/*人工帅选*/
.choose{
  height: 350px;
  padding: 0px 15px;
  overflow: hidden;
  .limitBox{
    
    .el-collapse-item{
      border: none;
      margin-top: 10px;
      box-shadow: 5px 5px 5px -5px #dddddd;
    }
    .itembox{
      width: 32.3%;
      margin-right: 1%;
      border: solid 1px rgba(211,211,211,1);
      padding: 10px 5px; 
      .imgInfo{
        display: flex;
        position: relative;
        .subdata{
          display: block;
          line-height: 28px;
        }
        
        .del{
          position: absolute;
          right: 5px;
          bottom: 0;
          // bottom: -10px;
          // right: -5px;
          background: #999;
          color: #ffffff;
          padding: 4px;
          cursor: pointer;
        }
      }
    }
    .itembox:last-child{
      border: solid 1px rgba(211,211,211,1);
    }
  }
}
.del{
  position: absolute;
  bottom: -10px;
  right: -5px;
  background: #999;
  color: #ffffff;
  padding: 4px;
  cursor: pointer;
}
.limitBox{
  height: 96%;
  .el-collapse-item{
    border: solid 1px rgba(211,211,211,1);
    margin-top: 10px;
  }
  .itembox:last-child{
  border: none;
  }
  
}

.plane{
  height: 100%;
}
.imgInfo{
  position: relative;
  .timedata{
    padding: 2px 6px;
    display: inline-block;
    background:rgba(250,250,250,1);
    border:1px solid rgba(242,242,242,1);
    border-radius:2px;
    i{
      margin-right: 2px;
      color: #999999;
    }
  }
  .subdata{
    color: #0c70f8;
    line-height: 36px;
    b{
      padding-left: 5px;
      font-size: 28px;
      
    }
  }
    .img{
      float: left;
      width: 62px;
      height: 62px;
      margin-right: 8px;
      // margin-bottom: 8px
      display: block;
    }
    &:after{
      display: block;
      content: "";
      clear: both;
    }
  }
  .itembox{
    margin-bottom: 10px;
    padding-bottom: 10px;
    padding-top: 10px;
    border-bottom: solid 1px #f2f2f2;
    .del_list_icon {
      display: none;
    }
    &:hover {
      background-color: #E0F1FF;
      .timedata {
        border-color: transparent;
        background-color: transparent;
      }
      .del_list_icon {
        display: block;
      }
    }
  }
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
  .result_device_name {
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
<style lang="scss">
.choose{
  .el-collapse-item__content{
    display: flex;
        flex-direction: row;
    flex-wrap: wrap;
  }
}
.limitBox{
  height: 96%;

  .el-collapse-item{
    .el-collapse-item__header{
      background: #F6F6F6;
      padding-left: 10px;
      height: 40px;
      line-height: 40px;
    }
  }
  .el-collapse-item__content{
    padding: 10px;
  }
}
.limitBoxs{
  height: 95%;

  .el-collapse-item{
    .el-collapse-item__header{
      background: #F6F6F6;
      padding-left: 10px;
      height: 40px;
      line-height: 40px;
    }
  }
  .el-collapse-item__content{
    // padding: 10px;
  }
  .itembox{
    cursor: pointer;
    margin-bottom: 10px;
    padding: 10px;
    border-bottom: solid 1px #f2f2f2;
    // .del{
    //       position: absolute;
    //       right: 5px;
    //       bottom: 0;
    //       // bottom: -10px;
    //       // right: -5px;
    //       background: #999;
    //       color: #ffffff;
    //       padding: 4px;
    //       cursor: pointer;
    //     }
    .del_list_icon {
      position: absolute;
      right: 5px;
      bottom: 0;
      // bottom: -10px;
      // right: -5px;
      background: #999;
      color: #ffffff;
      padding: 4px;
      cursor: pointer;
      display: none;
    }
    &:hover {
      background-color: #E0F1FF;
      .timedata {
        border-color: transparent;
        background-color: transparent;
      }
      .del_list_icon {
        display: block;
      }
    }
  }
}
.vl_jig_mk_p {
  width: 180px;
  height: auto;
  background: #ffffff;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  box-shadow: 4px 0px 10px 0px #838383;
  box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
  .big {
    font-size: 16px;
    font-weight: bold;
  }
  &:after {
    border-bottom-color: rgba(0, 0, 0, 1);
    content: "";
    display: inline-block;
    position: absolute;
    left: 50%;
    margin-left: -10px;
    bottom: -10px;
    border-top: 10px solid #fff;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
  }
  &.vl_jig_mk_img_hover {
    &:after {
      border-bottom-color: rgba(0, 0, 0, 1);
      content: "";
      display: inline-block;
      position: absolute;
      left: 50%;
      margin-left: -10px;
      bottom: -10px;
      border-top: 10px solid #0c70f8;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
    }
    background: rgba(12, 112, 248, 1);
    position: relative;
    border: 0.04rem solid #0c70f8;
    > p {
      color: #ffffff;
    }
  }
}
.ljd {
  .el-date-editor .el-range-input{
    font-size: 13px;
  }
  .insetIput.el-input--prefix .el-input__inner {
    padding-left: 90px;
  }
  .el-dialog__wrapper .el-dialog__body {
    padding: 0px;
  }
  .el-dialog__header {
    padding: 0px 20px 3px;
  }
  .el-dialog__headerbtn {
    z-index: 1;
  }
  .el-dialog__title{
    line-height: 48px;
  }
  // 上传
  .upload_warp .vl_jtc_upload {
    .el-upload {
      width: 100%;
      height: 100%;
      background: #f2f2f2;
      border: none;
      span {
        color: #999;
      }
      img {
        width: 100%;
        height: 100%;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
      }
    }
    .el-upload:hover{
      background: #0c70f8;
      span{
        color: #ffffff;
      }
    }
  }
  .el-form-item__label{
  padding-right: 0px;
}
.history-pic-dialog {
    .el-dialog {
      max-width: 12.6rem;
      width: 100% !important;
    }
    .el-dialog__title {
      font-size: 0.16rem;
      color: #333333;
    }
    .el-dialog__body {
      padding: 0 0.76rem 0.3rem;
    }
    .his-pic-box {
      width: 100%;
      height: 4.6rem !important;
      .his-pic-item {
        float: left;
        width: 1.38rem;
        height: 1.38rem;
        border: 0.02rem solid #ffffff;
        margin-right: 0.2rem;
        margin-bottom: 0.2rem;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .active {
        border-color: #0c70f8;
      }
    }
    .el-dialog__footer {
      button {
        width: 1.4rem !important;
        height: 0.4rem;
        line-height: 0.4rem;
        padding: 0;
      }
    }
  }
}
</style>
<style>
.ljd .demo-ruleForm .el-radio__label { padding-left: 0; }
</style>
