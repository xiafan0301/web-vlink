<template>
  <div class="ljd point">
    <div is="vlBreadcrumb"
     :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
        {name: '落脚点分析'}]">
    </div>
    <div class="left">
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
                <el-button @click="resetForm()" class="full">重置</el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" :loading="isload" @click="submitForm()" class="select_btn full">分析</el-button>
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
          <div class="vl_jig_right" :class="{'hide': !reselt}">
            <ul class="map_rrt_u2">
              <li  @click="resemt"><i class="el-icon-aim"></i></li>
              <li @click="mapZoomSet(1)"><i class="el-icon-plus"></i></li>
              <li @click="mapZoomSet(-1)"><i class="el-icon-minus"></i></li>
            </ul>
            <div class="reselt" v-if="reselt">
              <div class="plane insetPadding">
                <h3 class="title">分析结果</h3>
                <el-table :data="chooseData" style="width: 100%;" :height="tableHeight" @row-click="createInfoWindow($event)">
                  <el-table-column  type="index" width="24px" label="序号"></el-table-column>
                  <el-table-column  prop="address" :show-overflow-tooltip="true" label="落脚点位置"></el-table-column>
                  <el-table-column prop="stopOverTime" width="120px" sortable label="停留时长">
                    <template slot-scope="scope">
                      <span>{{ scope.row.stopOverTime | transMinute }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="insetLeft2" @click="reselt = false"></div>
              </div>
            </div>
            <div class="insetLeft" v-show="!reselt" @click="reselt = true"></div>
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
                <el-table-column label="序号" type="index" width="50"></el-table-column>
                <el-table-column label="任务名称" width="150" prop="taskName" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" width="150" prop="createTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="分析时间范围" width="360" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.startTime}}至{{scope.row.endTime}}
                  </template>
                </el-table-column>
                <el-table-column label="结果数" width="100" v-if="selectIndex === 1">
                  <template slot-scope="scope">
                    {{scope.row.pointNum}}
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="100" v-if="selectIndex === 0">
                  <template slot-scope="scope">
                    <span>{{scope.row.taskStatus && scope.row.taskStatus === 1 ? '进行中' : scope.row.taskStatus === 3 ? '失败' : '已中断'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="180">
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
      :close-on-click-modal="false"
      width="900px">
      <div style="height: 350px;">
        <div style="height: 96%">
          <vue-scroll>
            <div class="ljd_plane_main">
              <!--可以展开列表-->
              <div class="infinite-list-wrapper">
                <ul>
                  <li class="p_main_list" :class="{'is_open': !item.isClose}" v-for="item in curAllLeftEvData" :key="item.id">
                    <div class="p_main_head" @click="item.isClose = !item.isClose">
                      <i :class="{'el-icon-caret-right': item.isClose, 'el-icon-caret-bottom': !item.isClose}"></i>{{item.time}}({{item.count}}次)
                      <span class="del_icon el-icon-delete" @click.stop="delOneDay(item)"></span>
                    </div>
                    <div class="p_main_item p_main_dialog_item" v-for="(sItem, sIndex) in item.records" :key="sItem.id">
                      <div class="info">
                        <div class="info_left">
                          <img :src="sItem.subStoragePath" alt="">
                        </div>
                        <div class="info_right">
                          <p class="time"><i class="vl_icon vl_icon_retrieval_01"></i>{{sItem.shotTime.slice(-8)}}</p>
                          <div><i class="vl_icon vl_icon_retrieval_03"></i>{{sItem.semblance ? (sItem.semblance * 1).toFixed(2) : '0.00'}}%</div>
                        </div>
                      </div>
                      <div class="address"><i class="el-icon-location-outline"></i>{{sItem.bayonetAddress ? sItem.bayonetAddress : sItem.address}}</div>
                      <div class="del_icon el-icon-delete" @click.stop="delSitem(item, sItem, sIndex)"></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </vue-scroll>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="chooseCancel">取 消</el-button>
        <el-button type="primary" @click="chooseOk">确 定</el-button>
      </span>
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

    <!-- 视频播放 -->
    <div is="mapVideoPlay" :oData="mapVideoData"></div>
  </div>
</template>
<script>
import { mapXupuxian } from "@/config/config.js";
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import { putAnalysisTask, putTaskInfosResume } from '@/views/index/api/api.analysis.js';
import mapVideoPlay from '@/components/common/mapVideoPlay.vue';
import {
  PortraitPostStayPointRealtime,
  PortraitPostStayPointTask,
  PortraitGetStayPointTasks
} from '@/views/index/api/api.portrait.js'
import {formatDate, dateOrigin, transMinute} from '@/utils/util.js';
import vlUpload from '@/components/common/upload.vue';
export default {
  components: {
    vlBreadcrumb,
    vlUpload,
    mapVideoPlay
  },
  data() {
    return {
      hoverWindow: null,
      tableHeight: 400,
      curInfoWinVideoPath: '',
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
      mapVideoData: null,

      taskName: '', // 左侧输入任务名称
      taskType: "1", // 左侧任务类型，1 实时，2离线
      uploadClear: {},
      seData:null,
      isload:false,
      dialogChoose:false,
      showDetail:false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },

      imgData: null,
      amap: null,
      // select: "",
      reselt: false,
      ruleForm: {
        data1: dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)),
        data2: new Date()
      },
      activeChoose: [],
      chooseData:[],
      evData: []
    };
  },
  mounted() {
    if( this.$route.query.imgurl || this.$route.query.path){
      let a =  this.$route.query.imgurl || this.$route.query.path ;
      this.imgData = Object.assign({}, {path: a});
      this.curImageUrl= a;
    }
    this.tableHeight = $('#mapBox').height() - 41;

    let map = new window.AMap.Map("mapBox", {
      zoom: 10,
      center: mapXupuxian.center
    });
    map.setMapStyle("amap://styles/whitesmoke");
    this.amap = map;

    this.getDataList();
    // 监听地图信息窗体点击事件
    $('body').on('click', '.vl_vehicle_ljd_mk_p', () => {
      this.showVideo(this.curInfoWinVideoPath);
    })
  },
  computed: {
    choosedHisPic() {
      return this.historyPicList.filter(x => x.checked);
    },
    // 过滤allLeftEvData里面list为空的数据，人工筛选的时候全部删除自动去除一列
    curAllLeftEvData () {
      return this.evData.filter(x => x.records.length)
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
    createInfoWindow (obj) {
      let _sContent = `<div class="vl_vehicle_ljd_mk_p"><img class="igm" src="${obj.storagePath}"><p class='addres'>${obj.address} <i class='el-icon-caret-right'></i></p><p class='times'>${transMinute(obj.stopOverTime)}</p></div>`;
      this.hoverWindow = new window.AMap.InfoWindow({
        isCustom: true,
        closeWhenClickMap: true,
        offset: new window.AMap.Pixel(-2, -50), // 相对于基点的偏移位置
        content: _sContent
      });
      this.hoverWindow.open(this.amap, new window.AMap.LngLat(obj.shotPlaceLongitude, obj.shotPlaceLatitude));
      this.curInfoWinVideoPath = obj.videoPath;
      this.amap.setCenter([obj.shotPlaceLongitude, obj.shotPlaceLatitude])
    },
    handleCurrentChange (e) {
      this.pagination.pageNum = e;
      this.getDataList();
    },
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
//        'where.taskType': 11, //  1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析 4:以图搜人 9：人员侦查报告,6重点关注, 11人像落脚点
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
//              res.data.list.forEach(item => {
//                this.$set(item, 'taskWebParam', JSON.parse(item.taskWebParam))
//              })
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
// 跳至分析结果页面
    skipResultPage (obj) {
      this.$router.push({name: 'portrait_ljd_jg', query: { uid: obj.uid }});
    },

    randerMap () {
      this.$nextTick(() => {
        $('.vl_jig_right').append($('#mapBox'))
//        this.amap.clearMap();
//        this.drawMarkers(this.chooseData);
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
    submitForm() {
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
              console.log(res);
              this.selectIndex = 2;
              this.randerMap();
              if (!res.data || res.data.length === 0) {
                this.$message.info("抱歉，没有找到匹配结果");
                this.chooseData = [];
                this.evData = [];
                //this.searching = false;
                return false;
              }else{
                this.dialogChoose = true;
                res.data.forEach(x => {
                  x.isClose = false;
                });
                this.evData = res.data;
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
            PortraitPostStayPointTask(params).then(res => {
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
    resetForm() {
      this.curImageUrl = "";
      this.ruleForm.data1 = dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000));
      this.ruleForm.data2 = new Date();
      this.uploadClear = {};
      this.evData = [];
      this.chooseData = [];
      this.reselt = false;
      this.amap.clearMap();
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
    delOneDay (item) {
      item.records.forEach((x, index) => {
        this.delSitem(item, x, index)
      })
    },
    delSitem (item, sItem, index) {
      item.records.splice(index, 1);
      item.times--;
      this.evData.splice(this.evData.findIndex(x => x === sItem), 1);
    },
    chooseCancel () {
      this.dialogChoose = false;
      this.evData = [];
      this.chooseData = [];
      this.reselt = false;
      this.amap.clearMap();
    },
    chooseOk(){
      this.reselt = true;
      this.dialogChoose = false
      this.chooseData = [];
      this.evData.forEach(x => {
        x.records.forEach(y => {
          this.chooseData.push(y)
        })
      })
      this.drawMarkers(this.chooseData);
    },
    drawMarkers(data) {
      let _this = this
      for (let i = 0; i < data.length; i++) {
        let obj = data[i];
        // 摄像头
        let _id = "vlPortraitLjdSxt" + i;
        let _content =
            "<div id=" +
            _id +
            ' class="vl_icon vl_jfo_sxt vl_icon_judge_04"></div>';
        let marker = new window.AMap.Marker({
          // 添加自定义点标记
          map: this.amap,
          position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
          offset: new window.AMap.Pixel(-28.5, -50), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          extData: obj,
          // 自定义点标记覆盖物内容
          content: _content,
          zIndex: 100
        });
        marker.on('mouseover', function () {
          $("#" + _id).addClass("vl_icon_judge_02");
          _this.createInfoWindow(obj)
        })
        marker.on('mouseout', function () {
          $("#" + _id).removeClass("vl_icon_judge_02");
        })
      }
      this.amap.setFitView();
    },
    showVideo(path){
      this.mapVideoData = {
        name: Math.random(),
        url: path
      }
    }
  },
  beforeDestroy () {
    if (this.amap) {
      this.amap.destroy();
    }
    $('body').unbind('click');
  }
};
</script>
<style lang="scss" scoped>
  .ljd_plane_main {
    min-height: 700px;
    .p_main_list {
      height: 40px;
      overflow: hidden;
      -webkit-transition: all .3s;
      -moz-transition: all .3s;
      -ms-transition: all .3s;
      -o-transition: all .3s;
      transition: all .3s;
      border: 1px solid #D3D3D3;
      margin-bottom: 10px;
      .p_main_head {
        height: 40px;
        line-height: 40px;
        background: #F6F6F6;
        cursor: pointer;
        text-indent: 6px;
        border-bottom: 1px solid #F2F2F2;
        i{
          color: #999999;
        }
        span {
          margin-left: 30px;
          font-size: 20px;
          color: #999999;
          vertical-align: middle;
          &:hover {
            color: #0C70F8;
          }
        }
      }
      .p_main_item {
        width: 100%;
        cursor: pointer;
        position: relative;
        &:hover{
          background: #E0F3FF;
          .del_icon{
            display: block;
          }
          .info {
            .info_right{
              .time {
                background: #E0F3FF;
              }
            }
          }
        }
        .info {
          width: 100%;
          padding: 10px;
          .info_left {
            display: inline-block;
            width: 100px;
            height: 100px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .info_right {
            display: inline-block;
            width: 130px;
            height: 46px;
            padding-left: 10px;
            float: right;
            >div {
              font-size: 20px;
              color: #0C70F8;
              font-weight: bold;
              margin-top: 10px;
              i {
                margin: 0 4px;
                vertical-align: text-bottom;
              }
            }
            .time {
              color: #333333;
              vertical-align: bottom;
              background: #FAFAFA;
              border: 1px solid #F2F2F2;
              height: 24px;
              line-height: 24px;
              i{
                color: #999999;
                vertical-align: middle;
                margin: 0 4px;
              }
            }
          }
        }
        .address {
          line-height: 39px;
          color: #666666;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          /*border-bottom: 1px solid #F2F2F2;*/
          padding: 0 30px 0 10px;
        }
        .del_icon {
          font-size: 20px;
          position: absolute;
          bottom: 10px;
          right: 4px;
          display: none;
          color: #999999;
          &:hover {
            color: #0C70F8;
          }
        }
      }
      .p_main_dialog_item {
        width: 33%;
        display: inline-block;
        border: 1px solid #D3D3D3;
        margin: 5px;
      }
    }
    .is_open {
      height: auto;
    }
    .th-center-pagination {
      text-align: center;
    }
  }
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
  left: 0px;
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
  /*box-shadow: 4px 0px 10px 0px #838383;*/
  /*box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);*/
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
.insetLeft2{
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
.insetLeft {
  position: absolute;
  left: 0px;
  z-index: 3;
  width: 25px;
  height: 178px;
  top: 50%;
  margin-top: -128px;
  display: inline-block;
  background-repeat: no-repeat;
  transform: rotate(180deg);
  background-image: url(../../../../assets/img/icons.png);
  background-position: -380px -1269px;
  cursor: pointer;
}
.insetLeft2:hover{
  transform: rotate(180deg);
  background-position: -318px -1269px;
}
.hide {
  .insetLeft,.insetLeft2 {
    transform: rotate(180deg);
    background-position: -504px -1269px;
  }
  .insetLeft,.insetLeft2:hover{
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
  .vl_vehicle_ljd_mk_p {
    /*display: none;*/
    position: relative;
    width: 180px;
    height: auto;
    background: #ffffff;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    box-shadow: 4px 0px 10px 0px #838383;
    box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
    .times{
      position: absolute;
      left: 10px;
      top: 10px;
      background: #50CC62;
      padding: 0px 8px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      color: #ffffff;
    }
    .addres{
      right: 10px;
      text-align: left;
      position: absolute;
      left: 10px;
      bottom: 10px;
      color: #ffffff;
      i{
        float: right;
        font-size: 24px;;
      }
    }
    .igm{
      width: 100%;
      height: 100px;
      background: #666666;
    }
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
    &.vl_jig_mk_img_show{
      display: block;
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
