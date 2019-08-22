<template>
  <div class="new-analysis-task">
    <div class>
      <div
        is="vlBreadcrumb"
        :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
            {name: '频繁出没'}]"
      ></div>
    </div>
    <div class="new-a-t-content">
      <!-- 搜索条件 -->
      <div class="info-left" v-show="videoMenuStatus">
        <vue-scroll>
          <el-form
            :model="searchData"
            ref="searchForm"
            :rules="rules"
            :hide-required-asterisk="true"
          >
            <!-- 时间 -->
            <el-form-item prop="startTime">
              <div class="time-search">
                <!-- <p>开始</p> -->
                <el-date-picker
                  class="vl_date"
                  v-model="searchData.startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="startDateOpt"
                  placeholder="开始时间"
                  :clearable="false"
                  :time-arrow-control="true"
                  default-time="00:00:00"
                ></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item prop="endTime">
              <div class="time-search">
                <!-- <p>结束</p> -->
                <el-date-picker
                  class="vl_date vl_date_end"
                  v-model="searchData.endTime"
                  :picker-options="endDateOpt"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  default-time="23:59:59"
                  placeholder="结束时间"
                  :time-arrow-control="true"
                  :clearable="false"
                ></el-date-picker>
              </div>
            </el-form-item>
            <!-- 区域选择 -->
            <el-form-item>
                <div class="select_map"><span>区域：</span><span @click="selectMap" class="select_map_color">地图框选区域</span></div>
            </el-form-item>
            
            <!-- 相似度搜索 -->
            <el-form-item prop="similarity">
              <div class="similarity">
                <ul class="similarity-input">
                  <li class="input-name">
                    <el-input placeholder="相似度" readonly v-model="searchData.similarityName"></el-input>
                  </li>
                  <li class="input-value">
                    <el-input v-model="searchData.similarity" placeholder></el-input>
                  </li>
                </ul>
                <p class="symbol"></p>
                <p class="max-value">100</p>
              </div>
            </el-form-item>
            <!-- 频次搜索 -->
            <el-form-item prop="frequency">
              <div class="frequency">
                <ul class="frequency-input">
                  <li class="input-name">
                    <el-input placeholder="频次不少于" readonly v-model="searchData.frequencyName"></el-input>
                  </li>
                  <li class="input-value">
                    <el-input v-model="searchData.frequency" placeholder></el-input>
                  </li>
                </ul>
                <p class="another-value">次</p>
              </div>
            </el-form-item>
            <!-- 任务名称 -->
            <el-form-item prop="taskName">
              <div class="task-name">
                <el-input v-model="searchData.taskName" placeholder="请输入任务名称"></el-input>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="search-btn">
                <el-button @click="resetSearch('searchForm')">重置</el-button>
                <el-button
                  type="primary"
                  @click="submitForm('searchForm')"
                  :loading="searching"
                >确定</el-button>
              </div>
            </el-form-item>
          </el-form>
        </vue-scroll>
      </div>
      <!-- tab列表信息 -->
      <div class="info-right">
          <div class="frequent-a-content">
        <ul class="tab-menu">
          <li
            v-for="(item,index) in tabList"
            :key="index"
            :class="{'is-active': selectIndex === item.value}"
            @click="selectTab(item.value)"
          >{{item.label}}</li>
        </ul>
        <div class="search_box">
          <el-form :inline="true" :model="taskForm" class="event_form" ref="taskForm">
            <el-form-item prop="taskName" label="任务名称：">
              <el-input
                style="width: 232px;"
                type="text"
                placeholder="请输入任务名称"
                v-model="taskForm.taskName"
              />
            </el-form-item>
            <el-form-item prop="reportTime" label="创建时间：">
              <el-date-picker
                class="vl_date time"
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
        </div>
        <div class="content-box">
          <div class="table_box" v-loading="isLoading">
            <el-table :data="list">
              <el-table-column label="序号" type="index" width="100"></el-table-column>
              <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip></el-table-column>
              <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
              <el-table-column label="相似度" show-overflow-tooltip>
                <template  slot-scope="scope">
                  {{scope.row.taskWebParamObj.semblance}}
                </template>
              </el-table-column>
              <el-table-column label="频次阈值" show-overflow-tooltip>
                <template  slot-scope="scope">
                  {{scope.row.taskWebParamObj.frequency}}
                </template>
              </el-table-column>
              <el-table-column label="状态" v-if="selectIndex === 0" show-overflow-tooltip>
                  <template slot-scope="scope">
                      {{scope.row.taskStatus === 1 ? '进行中' : scope.row.taskStatus === 2 ? '成功' : scope.row.taskStatus === 3 ? '失败' : scope.row.taskStatus === 4 ? '已中断' : ''}}
                  </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right">
                <template slot-scope="scope">
                  <span
                    class="operation_btn"
                    @click="skipDetailPage(scope.row)"
                    v-if="selectIndex === 1"
                  >查看</span>
                  <span
                    class="operation_btn"
                    @click="interrupt(scope.row)"
                    v-if="selectIndex === 0 && scope.row.taskStatus === 1"
                  >中断任务</span>
                  <span
                    class="operation_btn"
                    @click="recoveryOrRestart(scope.row,'recovery')"
                    v-if="selectIndex === 0 && scope.row.taskStatus === 4"
                  >恢复任务</span>
                  <span
                    class="operation_btn"
                    @click="recoveryOrRestart(scope.row,'restart')"
                    v-if="selectIndex === 0 && scope.row.taskStatus === 3"
                  >重启任务</span>
                  <span
                    class="operation_btn"
                    @click="cancel(scope.row)"
                    v-if="selectIndex === 0 && (scope.row.taskStatus === 3 || scope.row.taskStatus === 4)"
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
      </div>

      <!--中断任务弹出框-->
      <el-dialog
        title="中断任务确认?"
        :visible.sync="interruptDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
      >
        <span style="color: #999999;">任务中断，任务的数据处理进程将中止，可以在列表中恢复任务的数据处理</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="interruptDialog = false">取消</el-button>
          <el-button class="operation_btn function_btn" @click="interruptConfirm(1)">确认</el-button>
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
        <span style="color: #999999;">任务删除，任务的数据处理进程将被清理，任务不再可以恢复</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="deleteDialog = false">取消</el-button>
          <el-button class="operation_btn function_btn" @click="interruptConfirm(2)">确认</el-button>
        </div>
      </el-dialog>
      </div>
    </div>

    <!-- 地图框选 -->
    <el-dialog
        :visible.sync="dialogVisible"
        :append-to-body="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        width="1180px"
        class="map_selector_dialog">
        <div class="map_sd_content" id="mapMap">
        <div class="sd_search">
            <input type="text" placeholder="请输入地名，快速定位地址" autocomplete="off" class="sd_search_input" id="map_sd_search_input">
            <span @click="searchBtn"><i class="el-icon-search"></i></span>
        </div>
        <div class="sd_opts">
            <h4>请选择框选图形</h4>
            <ul>
            <li>
                <div title="选择矩形范围内的设备" :class="{'sd_opts_sed': drawActiveType === 1 }" @click="selDrawType(1)"><span class="sd_opts_icon sd_opts_icon1"></span></div>
            </li>
            <li>
                <div title="选择圆形范围内的设备" :class="{'sd_opts_sed': drawActiveType === 2 }" @click="selDrawType(2)"><span class="sd_opts_icon sd_opts_icon2"></span></div>
            </li>
            <li>
                <div title="选择折线200米范围内的设备" :class="{'sd_opts_sed': drawActiveType === 3 }" @click="selDrawType(3)"><span class="sd_opts_icon sd_opts_icon3"></span></div>
            </li>
            <li>
                <div title="选择多边形范围内的设备" :class="{'sd_opts_sed': drawActiveType === 4 }" @click="selDrawType(4)"><span class="sd_opts_icon sd_opts_icon4"></span></div>
            </li>
            <li>
                <div title="选择10公里圆形范围内的设备" :class="{'sd_opts_sed': drawActiveType === 5 }" @click="selDrawType(5)"><span class="sd_opts_icon sd_opts_icon5"></span></div>
            </li>
            </ul>
            <p>
            <span v-if="drawActiveType === 1">在地图上按住鼠标左键拖动鼠标框选，松开鼠标完成选择</span>
            <span v-else-if="drawActiveType === 2">在地图上按住鼠标左键选择圆心，拖动鼠标作为半径，松开鼠标完成选择</span>
            <span v-else-if="drawActiveType === 3">在地图上鼠标左键选择两个或两个以上点形成折线，双击或右键完成选择</span>
            <span v-else-if="drawActiveType === 4">在地图上鼠标左键选择三个或三个以上点形成封闭区域，双击或右键完成选择</span>
            <span v-else-if="drawActiveType === 5">在地图上鼠标左键选择圆心，形成10公里大小的圆形区域</span>
            </p>
        </div>
        <ul class="sd_fs">
            <li @click="resetZoom"><i class="el-icon-aim"></i></li>
            <li @click="mapZoomSet(1)"><i class="el-icon-plus"></i></li>
            <li @click="mapZoomSet(2)"><i class="el-icon-minus"></i></li>
        </ul>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button :loading="submitLoading" type="primary" @click="selSubmit" size="small">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapXupuxian } from "@/config/config";
import {
  getAllMonitorList,
  getAllBayonetList
} from "@/views/index/api/api.base.js";
import { validateSimilarity, validateFrequency } from "@/utils/validator.js";
import { postTaskAnalysis, getTaskInfosPage, putAnalysisTask, putTaskInfosResume } from "../../api/api.analysis.js";
import { formatDate, random14, dateOrigin } from "@/utils/util.js";
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
export default {
  components: { vlBreadcrumb },
  data() {
    return {
      searchData: {
        //搜索参数
        address: "",
        taskName: "",
        startTime: "",
        endTime: "",
        similarityName: "相似度",
        similarity: "85", // 相似度
        frequency: "3", //频次
        frequencyName: "频次不少于"
      },
      rules: {
        taskName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" },
          { min: 0, max: 20, message: "最大长度为20个字符", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ],
        similarity: [
          { required: true, message: "相似度不能为空", trigger: "blur" },
          { validator: validateSimilarity, trigger: "blur" }
        ],
        frequency: [
          { required: true, message: "频次不能为空", trigger: "blur" },
          { validator: validateFrequency, trigger: "blur" }
        ]
      },
      startDateOpt: {
        disabledDate: time => {
          if (this.searchData.endTime) {
            return (
              time.getTime() > new Date(this.searchData.endTime).getTime()
              /*  || time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 30 */
            );
          } else {
            return (
              /* time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 30 || */
              time.getTime() > new Date().getTime()
            );
          }
        }
      },
      endDateOpt: {
        disabledDate: time => {
          if (this.searchData.startTime) {
            return (
              time.getTime() < new Date(this.searchData.startTime).getTime() ||
              time.getTime() > new Date().getTime()
            );
          } else {
            return (
              /* time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 30 || */
              time.getTime() > new Date().getTime()
            );
          }
        }
      },
      searching: false,
      /* 区域选择 */
      drawType: 0,
      drawTypes: {
        rectangle: null, // 1
        circle: null, // 2
        polyline: null, // 3
        polygon: null, // 4
        circle10km: null // 5
      },
      drawActiveType: null, //
      drawObj: {
        rectangle: {},
        circle: {},
        polyline: {},
        polygon: {},
        circle10km: {}
      },
      zIndex: 50,
      amap: null, // 地图对象
      mapCenter: mapXupuxian.center, //地图中心位
      videoMenuStatus: true, // 菜单状态
      cameraMapMarkers: [], // 地图标记
      selAreaPolygon: null,
      listDevice: [], // 设备
      listBayonet: [], // 卡口
      showTypes: "DB", //设备类型
      cameraIds: [], //摄像头
      bayonetIds: [], //卡口
      area: [],
      searchTip: {},      //地图搜索选择数据
      dialogVisible: false,
      submitLoading: false,
      /* 列表 */
      tabList: [
        {
          label: "已完成任务",
          value: 1
        },
        {
          label: "未完成任务",
          value: 0
        }
      ],
      selectIndex: 1,
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      taskForm: {
        reportTime: "", // 日期
        taskName: "" // 任务名称
      },
      list: [], //已完成列表
      userInfo: {}, // 存储的用户信息
      deleteDialog: false,
      interruptDialog: false,    //中断任务
      isLoading: false,
      taskObj: '',     //单个列表任务
    };
  },
  computed: {},
  created() {
    this.userInfo = this.$store.state.loginUser;
  },
  mounted() {
    //获取数据
    this.setDate();
    this.selectDataList();
    // this.mapEvents();
  },
  methods: {
    /* 列表start */
    //tab切换
    selectTab(val) {
      this.selectIndex = val;
      this.pagination.pageNum = 1;
      this.taskForm.taskName = "";
      this.taskForm.reportTime = "";
      this.selectDataList();
    },
    handleCurrentChange(page) {
      this.pagination.pageNum = page;
      this.selectDataList();
    },
    // 根据搜索条件查询
    selectDataList() {
        this.list = [];
        this.pagination.total = 0;
        let params = {
            pageNum: this.pagination.pageNum,
            pageSize: this.pagination.pageSize,
            orderBy: 'create_time',
            order: 'desc',
            'where.taskType': 1,    //任务类型 1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析
            'where.isFinish': this.selectIndex,   //是否完成 0:未完成(包含处理中、处理失败、处理中断) 1：已完成(处理成功)
        }
        this.taskForm.taskName && (params['where.taskName'] = this.taskForm.taskName);
        if(this.taskForm.reportTime && this.taskForm.reportTime.length > 0) {
            params["where.startTime"] = formatDate(this.taskForm.reportTime[0]);
            params["where.endTime"] = formatDate(this.taskForm.reportTime[1]);
        }
        console.log("---------params-----------",JSON.stringify(params))
        this.isLoading = true;
        getTaskInfosPage(params).then(res => {
            console.log("--------getTaskInfosPage--------",res)
            if(res.data) {
                this.list = res.data.list;
                this.pagination.total = res.data.total;
                for(let item of this.list) {
                  item['taskWebParamObj'] = JSON.parse(item.taskWebParam)
                }
            }
            this.$nextTick(() => {
                this.isLoading = false;
            })
        }).catch(error => {
            console.log(error);
            this.isLoading = false;
        })
    },
    // 重置查询条件
    resetForm(form) {
      this.$refs[form].resetFields();
      this.selectDataList();
    },
    skipAddTaskPage() {
      // 跳到新增任务页面
      this.$router.push({ name: "portrait_xjpfcm" });
    },
    // 跳至详情页面
    skipDetailPage(obj) {
      this.$router.push({ name: "portrait_fxjg" , query: {uid: obj.uid}});
    },
    //中断
    interrupt(obj) {
        this.taskObj = obj;
        this.interruptDialog = true;
    },
    //删除
    cancel(obj) {
        this.taskObj = obj;
        this.deleteDialog = true;
    },
    //确认中断或者删除
    interruptConfirm(val) {
        let params = {};
        if(val === 1) {    //中断
            this.interruptDialog = false;
            params = {
                taskStatus: 4,
                uid: this.taskObj.uid,
            }
        }else if(val === 2) {     //删除
            this.deleteDialog = false;
            params = {
                delFlag: true,
                uid: this.taskObj.uid,
            }
        }
        putAnalysisTask(params).then(res => {
            console.log(res);
            if(res) {
                if(val === 1) {
                    this.$MyMessage("中断任务成功", "success")
                }else if(val === 2) {
                    this.$MyMessage("删除任务成功", "success")
                }
                this.selectDataList();
            }
        }).catch(() => {})
    },
    //恢复任务,重启任务
    recoveryOrRestart(obj,type) {
        putTaskInfosResume(obj.uid).then(res => {
            console.log(res)
            if(res) {
                if(type === 'recovery') {
                    this.$MyMessage("恢复任务成功","success")
                }else if(type === 'restart') {
                    this.$MyMessage("重启任务成功","success")
                }
                this.selectDataList();
            }
        }).catch(() => {})
    },
    /* 列表end */
    //选择区域
    selectMap() {
        this.dialogVisible = true
        this.$nextTick(() => {
            //加载地图
            this.initMap();
            this.getTreeList();
            //定位
            this.setFitV()
        })
    },
    //设置时间
    setDate() {
      /* let curDate = new Date(new Date().toLocaleDateString()).getTime()
      let curS = 1 * 24 * 3600 * 1000;
      let startTime = curDate - curS;
      let endTime = curDate - 1
      this.searchData.startTime = formatDate(startTime);
      this.searchData.endTime = formatDate(endTime); */
      let _s = dateOrigin(false, new Date(new Date().getTime() - 3600 * 1000 * 24 * 1));
      /* let _e = new Date(dateOrigin(true).getTime() - 3600 * 1000 * 24 * 1); */
      let _e = new Date();
      this.searchData.startTime = _s;
      this.searchData.endTime = _e;
    },
    //重置
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.setDate();
      this.drawClear();
      /* this.resetZoom(); */
    },
    //新建
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            jobName: this.searchData.taskName,
            startDate: formatDate(this.searchData.startTime),
            endDate: formatDate(this.searchData.endTime),
            semblance: this.searchData.similarity,
            frequency: this.searchData.frequency
          };
          if (
            (this.cameraIds && this.cameraIds.length > 0) ||
            (this.bayonetIds && this.bayonetIds.length > 0)
          ) {
            this.cameraIds &&
              this.cameraIds.length > 0 &&
              (params["deviceIds"] = this.cameraIds.join(","));
            this.bayonetIds &&
              this.bayonetIds.length > 0 &&
              (params["bayonetIds"] = this.bayonetIds.join(","));
          } else {
            /* console.log("11111111111111",document.querySelector('.el-message--info')) */
            if (!document.querySelector(".el-message")) {
              this.$message.info("请选择区域");
            }
            return false;
          }
          console.log("-------submitForm-------", params);
          this.searching = true;
          postTaskAnalysis(params)
            .then(res => {
              console.log(res);
              if (res && res.data) {
                /* this.$router.push({
                  name: "portrait_pfcm"
                }); */
                this.$MyMessage("新建离线分析任务成功！", 'success');
                this.selectDataList()
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                    this.setDate();
                    this.drawClear();
                });
              }
              this.$nextTick(() => {
                this.searching = false;
              });
            })
            .catch(error => {
              console.log(error);
              this.searching = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    setFitV() {
      this.getArea();
      console.log(this.area);
      if(this.area && this.area.length > 0) {
          this.amap.setFitView(this.area);
      }else {
          this.resetZoom()
      }
    },
    getArea() {
      this.area = [];
      // 矩形
      if (this.drawObj.rectangle) {
        for (let k in this.drawObj.rectangle) {
          console.log("------------------", this.drawObj.rectangle[k]);
          this.area.push(this.drawObj.rectangle[k].obj);
        }
      }
      // 圆形
      if (this.drawObj.circle) {
        for (let k in this.drawObj.circle) {
          this.area.push(this.drawObj.circle[k].obj);
        }
      }
      // 线
      if (this.drawObj.polyline) {
        for (let k in this.drawObj.polyline) {
          this.area.push(this.drawObj.polyline[k].obj);
        }
      }
      // 多边形
      if (this.drawObj.polygon) {
        for (let k in this.drawObj.polygon) {
          this.area.push(this.drawObj.polygon[k].obj);
        }
      }
      if (this.drawObj.circle10km) {
        for (let k in this.drawObj.circle10km) {
          this.area.push(this.drawObj.circle10km[k].obj);
        }
      }
    },
    drawClear() {
      // 矩形
      if (this.drawObj.rectangle) {
        for (let k in this.drawObj.rectangle) {
          this.drawClearDo(this.drawObj.rectangle[k]);
        }
        this.drawObj.rectangle = {};
      }
      // 圆形
      if (this.drawObj.circle) {
        for (let k in this.drawObj.circle) {
          this.drawClearDo(this.drawObj.circle[k]);
        }
        this.drawObj.circle = {};
      }
      // 线
      if (this.drawObj.polyline) {
        for (let k in this.drawObj.polyline) {
          this.drawClearDo(this.drawObj.polyline[k]);
        }
        this.drawObj.polyline = {};
      }
      // 多边形
      if (this.drawObj.polygon) {
        for (let k in this.drawObj.polygon) {
          this.drawClearDo(this.drawObj.polygon[k]);
        }
        this.drawObj.polygon = {};
      }
      if (this.drawObj.circle10km) {
        for (let k in this.drawObj.circle10km) {
          this.drawClearDo(this.drawObj.circle10km[k]);
        }
        this.drawObj.circle10km = {};
      }
    },
    drawClearDo(obj) {
      if (obj.obj) {
        this.amap.remove(obj.obj);
        obj.obj = null;
      }
      if (obj.marker) {
        this.amap.remove(obj.marker);
        obj.marker = null;
      }
      if (obj.editor) {
        obj.editor.close();
        this.amap.remove(obj.editor);
        obj.editor = null;
      }
      obj = null;
    },
    // 地图定位
    resetZoom() {
      if (this.amap) {
        this.amap.setZoomAndCenter(14, this.mapCenter);
      }
    },
    // 地图缩放
    mapZoomSet(val) {
      if (this.amap) {
        this.amap.setZoom(this.amap.getZoom() + val);
      }
    },
    // 初始化地图
    initMap() {
      if (this.amap) {
        return;
      }
      let _this = this;
      console.log(_this.mapCenter)
      let map = new window.AMap.Map("mapMap", {
        zoom: 14, // 级别
        resizeEnable: true,
        center: _this.mapCenter // 中心点坐标
      });

      map.setMapStyle("amap://styles/light");
      console.log("===========", map);
      this.amap = map;

      // 注册监听，当选中某条记录时会触发
      let auto = new window.AMap.Autocomplete({
        input: "map_sd_search_input"
      });
      window.AMap.event.addListener(auto, "select", _this.selectArea);

      // 在地图中添加MouseTool插件
      this.mouseTool = new window.AMap.MouseTool(map);
      this.amap.on("click", event => {
        if(this.drawActiveType === 5) {
          this.mouseTool.close(true);
          this.drawClear();
          this.drawCircle10kmClick(event)
        }
      });
      this.mouseTool.on("draw", event => {
        // event.obj 为绘制出来的覆盖物对象
        // console.log('draw event', event);
        let _sid = random14();
        _this.drawClear();
        //  return
        if (this.drawActiveType === 1) {
          this.drawObj.rectangle[_sid] = {};
          this.drawObj.rectangle[_sid].obj = event.obj;
          // this.drawRectangleMark(_sid, event.obj);
        } else if (this.drawActiveType === 2) {
          this.drawObj.circle[_sid] = {};
          this.drawObj.circle[_sid].obj = event.obj;
          // this.drawCircleMark(_sid, event.obj);
        } else if (this.drawActiveType === 3) {
          this.drawObj.polyline[_sid] = {};
          this.drawObj.polyline[_sid].obj = event.obj;
          // this.drawPolylineMark(_sid, event.obj);
        } else if (this.drawActiveType === 4) {
          this.drawObj.polygon[_sid] = {};
          this.drawObj.polygon[_sid].obj = event.obj;
          // this.drawPolygonMark(_sid, event.obj);
        } else if (this.drawActiveType === 5) {
          this.drawObj.circle10km[_sid] = {};
          this.drawObj.circle10km[_sid].obj = event.obj;
        }
        /* this.mouseTool.close(false);
        this.amap.setDefaultCursor(); */
        /* this.drawActiveType = 0; */
      });
    },
    selectArea(e) {
      console.log(e);
      this.searchTip = e;
      if (e.poi && e.poi.location) {
        this.amap.setZoom(15);
        this.amap.setCenter(e.poi.location);
      }
    },
    searchBtn() {
      if(this.searchTip.poi && this.searchTip.poi.location) {
        this.selectArea(this.searchTip)
      }   
    },
    mapEvents() {
      let _this = this,
        nContent = $("body");
      // el-icon-edit el-icon-close el-icon-check
      nContent
        .on("click", ".el-icon-close", function() {
          // 删除
          let nOpt = $(this).closest(".ms_marker_opt");
          let _sid = nOpt.attr("_sid"),
            _type = Number(nOpt.attr("_type"));
          _this.removeMarkers(_type, _sid);
        })
        .on("click", ".el-icon-edit", function() {
          // 编辑
          let nOpt = $(this).closest(".ms_marker_opt");
          let _sid = nOpt.attr("_sid"),
            _type = Number(nOpt.attr("_type"));
          nOpt.find(".el-icon-edit").hide();
          nOpt.find(".el-icon-check").show();
          _this.editMarkers(_type, _sid, 1);
        })
        .on("click", ".el-icon-check", function() {
          // 完成
          let nOpt = $(this).closest(".ms_marker_opt");
          let _sid = nOpt.attr("_sid"),
            _type = Number(nOpt.attr("_type"));
          nOpt.find(".el-icon-check").hide();
          nOpt.find(".el-icon-edit").show();
          _this.checkMarkers(_type, _sid);
        });
    },
    removeMarkers(drawType, sid) {
      console.log("---------------", drawType, sid);
      let obj = null;
      if (drawType === 1) {
        // 矩形
        obj = this.drawObj.rectangle[sid];
      } else if (drawType === 2) {
        // 圆形
        obj = this.drawObj.circle[sid];
      } else if (drawType === 3) {
        // 折线
        obj = this.drawObj.polyline[sid];
      } else if (drawType === 4) {
        // 多边形
        obj = this.drawObj.polygon[sid];
      } else if (drawType === 5) {
        obj = this.drawObj.circle10km[sid];
      }
      if (obj) {
        if (obj.obj) {
          this.amap.remove(obj.obj);
          obj.obj = null;
        }
        if (obj.marker) {
          this.amap.remove(obj.marker);
          obj.marker = null;
        }
        if (obj.editor) {
          obj.editor.close();
          this.amap.remove(obj.editor);
          obj.editor = null;
        }
        obj = null;
      }
    },
    editMarkers(drawType, sid, i) {
      this.type = i;
      if (drawType === 1) {
        // 矩形
        this.drawRectangleEditor(sid);
      } else if (drawType === 2) {
        this.drawCircleEditor(sid);
      } else if (drawType === 3) {
        this.drawPolylineEditor(sid);
      } else if (drawType === 4) {
        this.drawPolygonEditor(sid);
      } else if (drawType === 5) {
        this.drawCircle10kmEditor(sid);
      }
    },
    checkMarkers(drawType, sid) {
      if (drawType === 1) {
        // 矩形
        if (this.drawObj.rectangle[sid] && this.drawObj.rectangle[sid].editor) {
          this.drawObj.rectangle[sid].editor.close();
        }
      } else if (drawType === 2) {
        // 圆形
        if (this.drawObj.circle[sid] && this.drawObj.circle[sid].editor) {
          this.drawObj.circle[sid].editor.close();
        }
      } else if (drawType === 3) {
        // 折线
        if (this.drawObj.polyline[sid] && this.drawObj.polyline[sid].editor) {
          this.drawObj.polyline[sid].editor.close();
        }
      } else if (drawType === 4) {
        if (this.drawObj.polygon[sid] && this.drawObj.polygon[sid].editor) {
          this.drawObj.polygon[sid].editor.close();
        }
      } else if (drawType === 5) {
        if (
          this.drawObj.circle10km[sid] &&
          this.drawObj.circle10km[sid].editor
        ) {
          this.drawObj.circle10km[sid].editor.close();
        }
      }
    },
    //选择类型
    selDrawType(drawType) {
      this.drawType = drawType;
      if (this.drawActiveType !== drawType) {
        /* this.drawClear(); */
      } else {
        this.drawType = "";
      }
      this.drawActiveType = drawType;
      if (!this.drawType) {
        this.mouseTool.close(false);
        this.amap.setDefaultCursor();
        this.drawActiveType = 0;
      } else {
        if (drawType === 1) {
          // 矩形
          this.drawRectangle();
        } else if (drawType === 2) {
          // 圆形
          this.drawCircle();
        } else if (drawType === 3) {
          // 折线
          this.drawPolyline();
        } else if (drawType === 4) {
          // 多边形
          this.drawPolygon();
        } else if (drawType === 5) {
          // 多边形
          // this.drawCircle10km();
        }
      }
    },
    // 矩形
    drawRectangle() {
      this.amap.setDefaultCursor("crosshair");
      this.mouseTool.rectangle({
        strokeColor: "#FA453A",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillOpacity: 0.2,
        fillColor: "#FA453A",
        cursor: "pointer",
        strokeStyle: "solid",
        zIndex: this.zIndex
      });
      this.zIndex += 1;
    },
    drawRectangleEditor(sid) {
      if (this.drawObj.rectangle[sid]) {
        let obj = this.drawObj.rectangle[sid];
        if (obj.editor) {
          obj.editor.open();
        } else {
          let ps = obj.obj.getPath();
          let southWest = ps[3];
          let northEast = ps[1];
          let bounds = new window.AMap.Bounds(southWest, northEast);
          // 删除原来的矩形
          this.amap.remove(obj.obj);
          // 新建可编辑的矩形
          let rectangle = new window.AMap.Rectangle({
            bounds: bounds,
            strokeColor: "#FA453A",
            strokeOpacity: 1,
            strokeWeight: 1,
            fillOpacity: 0.2,
            fillColor: "#FA453A",
            cursor: "pointer",
            zIndex: this.zIndex
          });
          this.zIndex += 1;
          rectangle.setMap(this.amap);
          obj.obj = rectangle;
          let rectangleEditor = new window.AMap.RectangleEditor(
            this.amap,
            rectangle
          );
          /* rectangleEditor.on('end', function(event) {
            // event.target 即为编辑后的矩形对象
          }); */
          rectangleEditor.on("adjust", function(event) {
            // event.target 即为编辑后的矩形对象
            // console.log('event.target.getPath()', event.target.getPath());
            // 需要重新定位marker
            if (obj.marker) {
              obj.marker.setPosition(event.target.getPath()[3]);
            }
          });
          obj.editor = rectangleEditor;
          rectangleEditor.open();
        }
      }
    },
    drawRectangleMark(sid, obj) {
      // console.log('drawRectangleMark getRadius', obj.getBounds());
      let ap = [obj.getBounds().southwest.Q, obj.getBounds().northeast.P];
      let marker = new window.AMap.Marker({
        // 添加自定义点标记
        map: this.amap,
        // position: obj.B.path[0], // 基点位置 矩形的右上点
        position: ap, // 基点位置 矩形的右上点
        offset: new window.AMap.Pixel(-1, -23), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        zIndex: this.zIndex,
        // extData: obj,
        // 自定义点标记覆盖物内容
        content:
          '<div _sid="' +
          sid +
          '" _type="1" class="ms_marker_opt ms_marker_rectang"><div>' +
          '<i class="el-icon-close" title="删除"></i>' +
          '<i class="el-icon-edit" title="编辑"></i>' +
          '<i class="el-icon-check" title="完成"></i>' +
          "</div></div>"
      });
      this.zIndex += 1;
      if (this.drawObj.rectangle[sid]) {
        this.drawObj.rectangle[sid].marker = marker;
      }
    },
    // 圆形
    drawCircle() {
      this.amap.setDefaultCursor("crosshair");
      this.mouseTool.circle({
        borderWeight: 3,
        strokeColor: "#FA453A",
        strokeOpacity: 1,
        strokeWeight: 1,
        // strokeOpacity: 0.2,
        fillOpacity: 0.2,
        // strokeStyle: 'dashed',
        // strokeDasharray: [10, 10],
        // 线样式还支持 'dashed'
        fillColor: "#FA453A",
        zIndex: this.zIndex
      });
      this.zIndex += 1;
    },
    drawCircleEditor(sid) {
      if (this.drawObj.circle[sid]) {
        let _this = this,
          obj = this.drawObj.circle[sid];
        if (obj.editor) {
          obj.editor.open();
        } else {
          // 新建可编辑的矩形
          let circle = new window.AMap.Circle({
            center: obj.obj.getCenter(),
            radius: obj.obj.getRadius(), //半径
            borderWeight: 3,
            strokeColor: "#FA453A",
            strokeOpacity: 1,
            strokeWeight: 1,
            // strokeOpacity: 0.2,
            fillOpacity: 0.2,
            // strokeStyle: 'dashed',
            // strokeDasharray: [10, 10],
            // 线样式还支持 'dashed'
            fillColor: "#FA453A",
            zIndex: this.zIndex
          });
          this.zIndex += 1;
          // 删除原来的矩形
          this.amap.remove(obj.obj);
          circle.setMap(this.amap);
          obj.obj = circle;
          let circleEditor = new window.AMap.CircleEditor(_this.amap, circle);
          circleEditor.on("adjust", function(event) {
            // event.target 即为编辑后的矩形对象
            // console.log('event.target.getPath()', event.target.getBounds().getSouthWest());
            // 需要重新定位marker
            if (obj.marker) {
              let ne = event.target.getBounds().getSouthWest();
              let c = event.target.getCenter();
              let _q = c.Q + (ne.Q - c.Q) * 0.705;
              let _p = c.P + (ne.P - c.P) * 0.705;
              obj.marker.setPosition([_q, _p]);
            }
          });
          circleEditor.on("move", function(event) {
            // 拖拽圆心调整圆形位置时触发此事件
            // event.target 即为编辑后的矩形对象
            // console.log('event.target.getPath()', event.target.getBounds().getSouthWest());
            // 需要重新定位marker
            if (obj.marker) {
              let ne = event.target.getBounds().getSouthWest();
              let c = event.target.getCenter();
              let _q = c.Q + (ne.Q - c.Q) * 0.705;
              let _p = c.P + (ne.P - c.P) * 0.705;
              obj.marker.setPosition([_q, _p]);
            }
          });
          obj.editor = circleEditor;
          circleEditor.open();
        }
      }
    },
    drawCircleMark(sid, obj) {
      let ne = obj.getBounds().getSouthWest();
      let c = obj.getCenter();
      let _q = c.Q + (ne.Q - c.Q) * 0.705;
      let _p = c.P + (ne.P - c.P) * 0.705;
      let marker = new window.AMap.Marker({
        // 添加自定义点标记
        map: this.amap,
        position: [_q, _p], // 基点位置 矩形的右上点
        offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        zIndex: this.zIndex,
        // extData: obj,
        // 自定义点标记覆盖物内容
        content:
          '<div _sid="' +
          sid +
          '" _type="2" class="ms_marker_opt ms_marker_circle"><div>' +
          '<i class="el-icon-close" title="删除"></i>' +
          '<i class="el-icon-edit" title="编辑"></i>' +
          '<i class="el-icon-check" title="完成"></i>' +
          "</div></div>"
      });
      this.zIndex += 1;
      if (this.drawObj.circle[sid]) {
        this.drawObj.circle[sid].marker = marker;
      }
    },
    // 折线
    drawPolyline() {
      this.amap.setDefaultCursor("crosshair");
      this.mouseTool.polyline({
        strokeColor: "#FA453A",
        strokeOpacity: 1,
        strokeWeight: 2,
        // 线样式还支持 'dashed'
        strokeStyle: "solid",
        zIndex: this.zIndex
        // strokeStyle是dashed时有效
        // strokeDasharray: [10, 5],
      });
      this.zIndex += 1;
    },
    drawPolylineEditor(sid) {
      if (this.drawObj.polyline[sid]) {
        let obj = this.drawObj.polyline[sid];
        if (obj.editor) {
          obj.editor.open();
        } else {
          let polyEditor = new window.AMap.PolyEditor(this.amap, obj.obj);
          polyEditor.on("adjust", function(event) {
            // event.target 即为编辑后的对象
            // 需要重新定位marker
            if (obj.marker) {
              obj.marker.setPosition(
                event.target.getPath()[event.target.getPath().length - 1]
              );
            }
          });
          obj.editor = polyEditor;
          polyEditor.open();
        }
      }
    },
    drawPolylineMark(sid, obj) {
      // console.log('drawRectangleMark getRadius', obj.getBounds());
      let p = obj.getPath()[obj.getPath().length - 1];
      let marker = new window.AMap.Marker({
        // 添加自定义点标记
        map: this.amap,
        // position: obj.B.path[0], // 基点位置 矩形的右上点
        position: p, // 基点位置 矩形的右上点
        offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        zIndex: this.zIndex,
        // extData: obj,
        // 自定义点标记覆盖物内容
        content:
          '<div _sid="' +
          sid +
          '" _type="3" class="ms_marker_opt ms_marker_polyline"><div>' +
          '<i class="el-icon-close" title="删除"></i>' +
          '<i class="el-icon-edit" title="编辑"></i>' +
          '<i class="el-icon-check" title="完成"></i>' +
          "</div></div>"
      });
      this.zIndex += 1;
      if (this.drawObj.polyline[sid]) {
        this.drawObj.polyline[sid].marker = marker;
      }
    },
    // 多边形
    drawPolygon() {
      this.amap.setDefaultCursor("crosshair");
      this.mouseTool.polygon({
        strokeColor: "#FA453A",
        strokeOpacity: 1,
        bubble: true,
        strokeWeight: 1,
        fillColor: "#FA453A",
        fillOpacity: 0.2,
        isRing: false,
        zIndex: this.zIndex
      });
      this.zIndex += 1;
    },
    drawPolygonEditor(sid) {
      if (this.drawObj.polygon[sid]) {
        let obj = this.drawObj.polygon[sid];
        if (obj.editor) {
          obj.editor.open();
        } else {
          var polyEditor = new window.AMap.PolyEditor(this.amap, obj.obj);
          polyEditor.on("adjust", function(event) {
            // event.target 即为编辑后的对象
            // 需要重新定位marker
            if (obj.marker) {
              obj.marker.setPosition(
                event.target.getPath()[event.target.getPath().length - 1]
              );
            }
          });
          obj.editor = polyEditor;
          polyEditor.open();
        }
      }
    },
    drawPolygonMark(sid, obj) {
      let p = obj.getPath()[obj.getPath().length - 1];
      let marker = new window.AMap.Marker({
        // 添加自定义点标记
        map: this.amap,
        // position: obj.B.path[0], // 基点位置 矩形的右上点
        position: p, // 基点位置 矩形的右上点
        offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        zIndex: this.zIndex,
        // extData: obj,
        // 自定义点标记覆盖物内容
        content:
          '<div _sid="' +
          sid +
          '" _type="4" class="ms_marker_opt ms_marker_polygon"><div>' +
          '<i class="el-icon-close" title="删除"></i>' +
          '<i class="el-icon-edit" title="编辑"></i>' +
          '<i class="el-icon-check" title="完成"></i>' +
          "</div></div>"
      });
      this.zIndex += 1;
      if (this.drawObj.polygon[sid]) {
        this.drawObj.polygon[sid].marker = marker;
      }
    },
    drawCircle10km() {
      this.amap.setDefaultCursor("crosshair");
      this.amap.on("click", event => {
        this.mouseTool.close(false);
        this.drawClear();
        this.drawCircle10kmClick(event)
      });
    },
    drawCircle10kmClick(e) {
      // e.lnglat.getLng()+','+e.lnglat.getLat()
      this.amap.setDefaultCursor("crosshair");
      let circle = new window.AMap.Circle({
        center: e.lnglat,
        radius: 1000 * 10, //半径
        borderWeight: 3,
        strokeColor: "#FA453A",
        strokeOpacity: 1,
        strokeWeight: 1,
        // strokeOpacity: 0.2,
        fillOpacity: 0.2,
        fillColor: "#FA453A",
        zIndex: this.zIndex
      });
      this.zIndex += 1;
      circle.setMap(this.amap);
      // 缩放地图到合适的视野级别
      // this.amap.setFitView([circle]);
      let _sid = random14();
      this.drawObj.circle10km[_sid] = {};
      this.drawObj.circle10km[_sid].obj = circle;
      /* this.map.setDefaultCursor(); */
      /* this.drawActiveType = 0; */
      this.amap.off("click", this.drawCircle10kmClick);
      // this.drawCircle10kmMark(_sid, circle);
      /* this.checkout(this.circle,'AMap.circle') */
    },
    drawCircle10kmEditor(sid) {
      if (this.drawObj.circle10km[sid]) {
        let obj = this.drawObj.circle10km[sid];
        if (obj.editor) {
          obj.editor.open();
        } else {
          let circleEditor = new window.AMap.CircleEditor(this.amap, obj.obj);
          circleEditor.on("adjust", function(event) {
            // event.target 即为编辑后的矩形对象
            // console.log('event.target.getPath()', event.target.getBounds().getSouthWest());
            // 需要重新定位marker
            if (obj.marker) {
              let ne = event.target.getBounds().getSouthWest();
              let c = event.target.getCenter();
              let _q = c.Q + (ne.Q - c.Q) * 0.705;
              let _p = c.P + (ne.P - c.P) * 0.705;
              obj.marker.setPosition([_q, _p]);
            }
          });
          circleEditor.on("move", function(event) {
            // 拖拽圆心调整圆形位置时触发此事件
            // event.target 即为编辑后的矩形对象
            // console.log('event.target.getPath()', event.target.getBounds().getSouthWest());
            // 需要重新定位marker
            if (obj.marker) {
              let ne = event.target.getBounds().getSouthWest();
              let c = event.target.getCenter();
              let _q = c.Q + (ne.Q - c.Q) * 0.705;
              let _p = c.P + (ne.P - c.P) * 0.705;
              obj.marker.setPosition([_q, _p]);
            }
          });
          obj.editor = circleEditor;
          circleEditor.open();
        }
      }
    },
    drawCircle10kmMark(sid, obj) {
      let ne = obj.getBounds().getSouthWest();
      let c = obj.getCenter();
      let _q = c.Q + (ne.Q - c.Q) * 0.705;
      let _p = c.P + (ne.P - c.P) * 0.705;
      let marker = new window.AMap.Marker({
        // 添加自定义点标记
        map: this.amap,
        position: [_q, _p], // 基点位置 矩形的右上点
        offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        zIndex: this.zIndex,
        // extData: obj,
        // 自定义点标记覆盖物内容
        content:
          '<div _sid="' +
          sid +
          '" _type="5" class="ms_marker_opt ms_marker_circle"><div>' +
          '<i class="el-icon-close" title="删除"></i>' +
          '<i class="el-icon-edit" title="编辑"></i>' +
          '<i class="el-icon-check" title="完成"></i>' +
          "</div></div>"
      });
      this.zIndex += 1;
      if (this.drawObj.circle10km[sid]) {
        this.drawObj.circle10km[sid].marker = marker;
      }
    },
    //关闭
    closeDraw(drawType) {
      if (drawType === 1 && this.drawTypes.rectangle !== null) {
        console.log("1111111111", this.drawTypes.rectangle.obj);
        /* if (this.drawTypes.rectangle.editor) { this.drawTypes.rectangle.editor.close(); } */
        this.amap.remove(this.drawTypes.rectangle.obj);
        this.drawTypes.rectangle = null;
      } else if (drawType === 2 && this.drawTypes.circle !== null) {
        /* if (this.drawTypes.circle.editor) { this.drawTypes.circle.editor.close(); } */
        this.amap.remove(this.drawTypes.circle.obj);
        this.drawTypes.circle = null;
      } else if (drawType === 3 && this.drawTypes.polyline !== null) {
        /* if (this.drawTypes.polyline.editor) { this.drawTypes.polyline.editor.close(); } */
        this.amap.remove(this.drawTypes.polyline.obj);
        this.drawTypes.polyline = null;
      } else if (drawType === 4 && this.drawTypes.polygon !== null) {
        /* if (this.drawTypes.polygon.editor) { this.drawTypes.polygon.editor.close(); } */
        this.amap.remove(this.drawTypes.polygon.obj);
        this.drawTypes.polygon = null;
      } else if (drawType === 5 && this.drawTypes.pocircle10kmlygon !== null) {
        /* if (this.drawTypes.pocircle10kmlygon.editor) { this.drawTypes.pocircle10kmlygon.editor.close(); } */
        this.amap.remove(this.drawTypes.circle10km.obj);
        this.drawTypes.circle10km = null;
      }
    },
    //获取框选的摄像头，卡口
    selSubmit() {
      // this.drawObj.circle10km
      // rectangle circle polyline polygon circle10km
      let dObj = {},
        bObj = {};
      if (this.listDevice && this.listDevice.length > 0) {
        for (let i = 0; i < this.listDevice.length; i++) {
          let o = this.listDevice[i];
          // 矩形
          if (this.drawObj.rectangle) {
            for (let k in this.drawObj.rectangle) {
              let so = this.drawObj.rectangle[k];
              if (
                so.obj &&
                so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))
              ) {
                dObj[o.uid] = o;
              }
            }
          }
          // 圆形
          if (this.drawObj.circle) {
            for (let k in this.drawObj.circle) {
              let so = this.drawObj.circle[k];
              if (
                so.obj &&
                so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))
              ) {
                dObj[o.uid] = o;
              }
            }
          }
          // 线
          if (this.drawObj.polyline) {
            for (let k in this.drawObj.polyline) {
              let so = this.drawObj.polyline[k];
              if (
                window.AMap.GeometryUtil.distanceToLine(
                  new window.AMap.LngLat(o.longitude, o.latitude),
                  so.obj.getPath()
                ) < 200
              ) {
                dObj[o.uid] = o;
              }
            }
          }
          // 多边形
          if (this.drawObj.polygon) {
            for (let k in this.drawObj.polygon) {
              let so = this.drawObj.polygon[k];
              if (
                so.obj &&
                so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))
              ) {
                dObj[o.uid] = o;
              }
            }
          }
          if (this.drawObj.circle10km) {
            for (let k in this.drawObj.circle10km) {
              let so = this.drawObj.circle10km[k];
              if (
                so.obj &&
                so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))
              ) {
                dObj[o.uid] = o;
              }
            }
          }
        }
      }
      if (this.listBayonet && this.listBayonet.length > 0) {
        for (let i = 0; i < this.listBayonet.length; i++) {
          let o = this.listBayonet[i];
          // 矩形
          if (this.drawObj.rectangle) {
            for (let k in this.drawObj.rectangle) {
              let so = this.drawObj.rectangle[k];
              if (
                so.obj &&
                so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))
              ) {
                bObj[o.uid] = o;
              }
            }
          }
          // 圆形
          if (this.drawObj.circle) {
            for (let k in this.drawObj.circle) {
              let so = this.drawObj.circle[k];
              if (
                so.obj &&
                so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))
              ) {
                bObj[o.uid] = o;
              }
            }
          }
          // 线
          if (this.drawObj.polyline) {
            for (let k in this.drawObj.polyline) {
              let so = this.drawObj.polyline[k];
              if (
                window.AMap.GeometryUtil.distanceToLine(
                  new window.AMap.LngLat(o.longitude, o.latitude),
                  so.obj.getPath()
                ) < 200
              ) {
                bObj[o.uid] = o;
              }
            }
          }
          // 多边形
          if (this.drawObj.polygon) {
            for (let k in this.drawObj.polygon) {
              let so = this.drawObj.polygon[k];
              if (
                so.obj &&
                so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))
              ) {
                bObj[o.uid] = o;
              }
            }
          }
          if (this.drawObj.circle10km) {
            for (let k in this.drawObj.circle10km) {
              let so = this.drawObj.circle10km[k];
              if (
                so.obj &&
                so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))
              ) {
                bObj[o.uid] = o;
              }
            }
          }
        }
      }
      let ad = [],
        ab = [];
      for (let k in dObj) {
        ad.push(k);
      }
      for (let k in bObj) {
        ab.push(k);
      }
      console.log("设备 ad", ad);
      console.log("卡口 ab", ab);
      this.cameraIds = ad;
      this.bayonetIds = ab;
      if((this.cameraIds && this.cameraIds.length > 0 ) || (this.bayonetIds && this.bayonetIds.length > 0)) {
          this.dialogVisible = false
      }else {
          this.$MyMessage("请选择区域", 'info');
      }
    },
    getTreeList() {
      if (this.showTypes.indexOf("D") >= 0) {
        this.getListDevice();
      }
      if (this.showTypes.indexOf("B") >= 0) {
        this.getListBayonet();
      }
    },
    // 设备
    getListDevice() {
      getAllMonitorList({ ccode: mapXupuxian.adcode }).then(res => {
        if (res) {
          this.listDevice = res.data;
          this.setMarks();
        }
      });
    },
    // 卡口
    getListBayonet() {
      getAllBayonetList({ areaId: mapXupuxian.adcode }).then(res => {
        if (res) {
          this.listBayonet = res.data;
          this.setMarks();
        }
      });
    },
    // D设备 B卡口
    setMarks() {
      if (this.showTypes.indexOf("D") >= 0) {
        for (let i = 0; i < this.listDevice.length; i++) {
          this.doMark(this.listDevice[i], "vl_icon vl_icon_sxt");
        }
      }
      if (this.showTypes.indexOf("B") >= 0) {
        for (let i = 0; i < this.listBayonet.length; i++) {
          this.doMark(this.listBayonet[i], "vl_icon vl_icon_kk");
        }
      }
      /* this.amap.setFitView(); */
    },
    // 地图标记
    doMark(obj, sClass) {
      console.log("doMark", obj, sClass);
      let marker = new window.AMap.Marker({
        // 添加自定义点标记
        map: this.amap,
        position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
        offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // extData: obj,
        // 自定义点标记覆盖物内容
        content: '<div class="map_icons ' + sClass + '"></div>'
      });
    }
  },
  beforeDestroy() {
    if (this.amap) {
      this.amap.destroy();
    }
  }
};
</script>
<style lang="scss" scoped>
.new-analysis-task {
  height: calc(100% - 50px);
  .breadcrumb_heaer {
    background: #fff;
  }
  .new-a-t-content {
    height: 100%;
    display: flex;
    // 关闭展开菜单按钮
    @mixin close_menu {
      position: absolute;
      top: calc(50% - 81px);
      font-size: 24px;
      cursor: pointer;
      z-index: 999;
    }
    .info-left {
      position: relative;
      width: 272px;
      padding: 20px 0 20px 20px;
      color: #999;
      background: #fff;
      box-shadow: 2px 3px 10px 0px rgba(131, 131, 131, 0.28);
      /* animation: fadeInLeft 0.4s ease-out 0.3s both; */
      .time-search {
        display: flex;
        p {
          width: 20px;
        }
      }
      .select_map {
          .select_map_color {
              color: #0C70F8;
              cursor: pointer;
          }
      }
      .vl_judge_tc_c_item {
        width: 232px;
        height: 232px;
        display: inline-block;
        position: relative;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        cursor: pointer;
        &:hover {
          background: #2981f8;
          > p {
            display: block;
          }
          .del_icon {
            display: block;
          }
        }
        .vl_jtc_upload {
          width: 100%;
          height: 100%;
          background: none;
        }
        > p {
          display: none;
          position: absolute;
          bottom: 0;
          text-align: center;
          width: 100%;
          color: #ffffff;
          height: 40px;
          line-height: 40px;
          -webkit-border-radius: 0 0 10px 10px;
          -moz-border-radius: 0 0 10px 10px;
          border-radius: 0 0 10px 10px;
          background: #0c70f8;
        }
        .del_icon {
          display: none;
          position: absolute;
          top: 10px;
          right: 10px;
          width: 24px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          background: rgba(0, 0, 0, 0.4);
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          color: #ffffff;
        }
      }
      //下划线
      .line {
        width: 232px;
        height: 1px;
        background-color: #d3d3d3;
        margin: 6px 0;
      }
      //相似度,频次,任务名称搜索
      .task-name {
        width: 232px;
      }
      .similarity {
        width: 232px;
        display: flex;
        .similarity-input {
          display: flex;
          border: 1px solid #dcdfe6;
          width: 148px;
          height: 40px;
          border-radius: 4px;
          &:hover,
          &:focus {
            border-color: #0c70f8;
          }
          .input-name {
            width: 60px;
          }
          .input-value {
            width: 88px;
          }
        }
        .symbol {
          margin: 19px 16px;
          width: 20px;
          height: 1px;
          background: #999;
        }
        .max-value {
          color: #333;
          line-height: 40px;
        }
      }
      .frequency {
        width: 232px;
        display: flex;
        .frequency-input {
          display: flex;
          border: 1px solid #dcdfe6;
          width: 202px;
          height: 40px;
          border-radius: 4px;
          &:hover,
          &:focus {
            border-color: #0c70f8;
          }
          .input-name {
            width: 88px;
          }
          .input-value {
            width: 112px;
          }
        }
        .another-value {
          color: #333;
          line-height: 40px;
          margin-left: 8px;
        }
      }
      .width232 {
        width: 232px;
      }
    }
    .info-right {
      position: relative;
      width: calc(100% - 272px);
      height: 100%;
      padding: 20px;
      //列表
      .frequent-a-content {
        background: #ffffff;
        box-shadow: 0px 5px 16px 0px rgba(169,169,169,0.2);
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
            border-bottom: 1px solid #0c70f8;
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
            .time {
                width: 374px;
            }
        }
        .divide {
            border: 1px dashed #fafafa;
        }
        }
        .content-box {
        padding: 0 20px;
        .button_box {
            display: flex;
            justify-content: space-between;
            .add_event_btn {
            height: 40px;
            background-color: #0c70f8;
            color: #ffffff;
            font-size: 14px;
            line-height: 40px;
            text-align: center;
            border-radius: 3px;
            padding: 0 16px;
            cursor: pointer;
            span:nth-child(1) {
                font-size: 16px;
            }
            span:nth-child(2) {
                margin-left: 5px;
            }
            }
        }
        .table_box {
            .operation_btn {
            display: inline-block;
            padding: 0 10px;
            border-right: 1px solid #f2f2f2;
            &:first-child {
                padding: 0 10px 0 0;
            }
            &:last-child {
                border-right: none;
            }
            }
        }
        }
    }

    }
  }
}
 .map_selector_dialog {
     .sd_opts {
        > h4 {
            padding: 10px 0 0 10px;
            color: #333;
        }
        > ul {
            padding: 0 5px 0 5px;
            overflow: hidden;
            > li {
            padding: 5px;
            float: left;
            > div {
                padding: 5px;
                &.sd_opts_sed {
                background-color: #F2F9FF;
                > .sd_opts_icon1 { background-image: url(../../../../assets/img/vehicle/cut1m.png); }
                > .sd_opts_icon2 { background-image: url(../../../../assets/img/vehicle/cut2m.png); }
                > .sd_opts_icon3 { background-image: url(../../../../assets/img/vehicle/cut3m.png); }
                > .sd_opts_icon4 { background-image: url(../../../../assets/img/vehicle/cut4m.png); }
                > .sd_opts_icon5 { background-image: url(../../../../assets/img/vehicle/cut5m.png); }
                }
            }
            }
        }
        > p {
            max-width: 320px;
            padding: 0 10px 10px 10px;
            margin: 0 auto;
            > span {
            color: #999; font-size: 12px;
            }
        }
        }
        .sd_opts_icon {
            display: inline-block;
            width: 44px; height: 44px;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 100% 100%;
            &.sd_opts_icon1 { 
                background-image: url(../../../../assets/img/vehicle/cut1.png);
                &:hover { background-image: url(../../../../assets/img/vehicle/cut1m.png); }
            }
            &.sd_opts_icon2 {
                background-image: url(../../../../assets/img/vehicle/cut2.png);
                &:hover { background-image: url(../../../../assets/img/vehicle/cut2m.png); }
            }
            &.sd_opts_icon3 {
                background-image: url(../../../../assets/img/vehicle/cut3.png);
                &:hover { background-image: url(../../../../assets/img/vehicle/cut3m.png); }
            }
            &.sd_opts_icon4 {
                background-image: url(../../../../assets/img/vehicle/cut4.png);
                &:hover { background-image: url(../../../../assets/img/vehicle/cut4m.png); }
            }
            &.sd_opts_icon5 {
                background-image: url(../../../../assets/img/vehicle/cut5.png);
                &:hover { background-image: url(../../../../assets/img/vehicle/cut5m.png); }
            }
        }
        .ms_marker_opt {
            > div {
                word-break:keep-all; white-space:nowrap;
                background-color: #fff;
                border: 1px solid #ddd;
                padding: 0 2px;
                > span { display: inline-block; }
                > i {
                display: inline-block;
                padding: 0 2px;
                font-size: 18px;
                }
                > .el-icon-check {
                display: none;
                color: #67C23A;
                }
                > .el-icon-close {
                color: #FA453A;
                }
                > .el-icon-edit {
                color: #E6A23C; font-size: 18px;
                }
            }
            &.ms_marker_rectang { left: 0px; bottom: 0px; }
            &.ms_marker_circle { left: 0; top: -10px; }
            &.ms_marker_polyline { left: -10px; top: -10px; }
            &.ms_marker_polygon { left: -10px; top: -10px; }
        }
 }
</style>

<style lang="scss">
.new-analysis-task {
  // 搜索框
  .search-wrap {
    .el-input__inner {
      background: #f2f2f2;
      border-width: 0;
      border-radius: 20px;
    }
  }
  .search_box {
      .el-form-item {
          margin-bottom: 20px;
      }
  }
  //相似度搜索
  .similarity,.frequency {
    .el-input__inner {
      border: none;
      height: 38px;
    }
    .input-name {
      .el-input__inner {
        padding: 0 0 0 15px;
      }
    }
  }
  //频次
  /* .frequency {
    .el-input {
      width: 126px;
    }
  } */
  //车牌颜色
  .license-plate-color {
    .el-select {
      width: 232px;
    }
  }
  //时间搜索
  .time-search {
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 232px;
    }
  }
  //搜索按钮
  .search-btn {
    width: 232px;
    text-align: center;
    margin-top: 10px;
    .el-button {
      width: 110px;
    }
    .el-button--primary {
      background-color: #0c70f8;
      border-color: #0c70f8;
    }
    .el-button+.el-button {
      margin-left: 12px;
    }
  }
  .info-left {
    .el-form-item {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .el-form-item__content {
      line-height: 1.5;
    }
    .under-line {
      .el-form-item__content {
        line-height: 1;
      }
    }
  }
  .__view {
    width: 100% !important; // vue-scroll样式重置
  }
  /* 地图标记 hover */
  .vl_map_hover {
    .vl_map_hover_main {
      width: 178px;
      text-align: center;
      padding: 20px 0;
      .name {
        color: #666;
        padding-bottom: 4px;
      }
      .num {
        color: #333;
        font-size: 20px;
        font-weight: 600;
      }
    }
  }
  /* .el-form-item {
    margin-bottom: 10px;
  } */
  /* 表单错误提示 */
  .el-form-item__error {
    position: static;
    padding-top: 0;
    margin-bottom: -10px;
    line-height: 20px;
  }
}
.map_selector_dialog {
    .el-dialog__header { display: none; }
    .el-dialog__body { padding: 0; }
    .map_sd_content {
      position: relative;
      width: 100%; height: 600px;
      > .sd_search {
        position: absolute; top: 10px; left: 10px; z-index: 1000;
        background-color: #fff;
        overflow: hidden;
        > .sd_search_input {
          float: left;
          width: 270px; height: 36px; line-height: 36px;
          background:rgba(255,255,255,1);
          box-shadow:0px 3px 10px 0px rgba(99,99,99,0.39);
          border: 0;
          padding: 0 15px;
        }
        > span {
          float: left;
          width: 60px; height: 36px; line-height: 36px;
          background-color: #0C70F8;
          cursor: pointer;
          text-align: center;
          > i {
            position: relative; top: 2px;
            color: #fff; font-size: 20px;
          }
        }
      }
      > .sd_opts {
        position: absolute; top: 55px; left: 10px; z-index: 1000;
        background-color: #fff;
      }
      > .sd_fs {
        position: absolute; bottom: 20px; right: 20px; z-index: 1000;
        background-color: #fff;
        padding: 10px 5px;
        box-shadow:-12px 0px 14px 0px rgba(148,148,148,0.24);
        > li {
          padding: 10px;
          cursor: pointer;
          > i { font-size: 20px; color: #0C70F8; }
        }
      }
    }
    .el-dialog__footer { 
        padding: 10px 0; 
        .el-button--primary:focus, .el-button--primary:hover {
            background: #0C70F8;
            border-color: #0C70F8;
            color: #FFF;
        }
    }
  }
  .amap-sug-result { z-index: 3000; display: none; }
</style>