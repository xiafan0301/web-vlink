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
      <div class="info-left">
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
             <el-form-item>
              <div class="select_db">
                <template v-if="dSum > 0">
                  已选<span>{{dSum}}</span>个设备
                </template>
                <template v-else>
                  尚未框选设备
                </template>
              </div>
            </el-form-item>
            <!-- 相似度搜索 -->
            <el-form-item prop="similarity">
              <div class="similarity">
                <div class="per_semblance_pfcm"><span>相似度：≥</span><el-input oninput="value=value.replace(/[^0-9.]/g,''); if(value >= 100)value = 100" placeholder="填写相似度数字" v-model="searchData.similarity"></el-input>%</div>
                <!-- <ul class="similarity-input">
                  <li class="input-name">
                    <el-input placeholder="相似度" readonly v-model="searchData.similarityName"></el-input>
                  </li>
                  <li class="input-value">
                    <el-input v-model="searchData.similarity" placeholder></el-input>
                  </li>
                </ul> -->
                <!-- <p class="symbol"></p>
                <p class="max-value">100</p> -->
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
              <el-table-column label="结果数" prop="resultNum" show-overflow-tooltip></el-table-column>
              <el-table-column label="状态" v-if="selectIndex === 0" show-overflow-tooltip>
                  <template slot-scope="scope">
                      {{scope.row.taskStatus === 1 ? '进行中' : scope.row.taskStatus === 2 ? '成功' : scope.row.taskStatus === 3 ? '失败' : scope.row.taskStatus === 4 ? '已中断' : ''}}
                  </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="168">
                <template slot-scope="scope">
                  <span
                    class="operation_btn"
                    @click="skipDetailPage(scope.row)"
                    v-if="selectIndex === 1"
                  >查看</span>
                  <!--<span-->
                    <!--class="operation_btn"-->
                    <!--@click="interrupt(scope.row)"-->
                    <!--v-if="selectIndex === 0 && scope.row.taskStatus === 1"-->
                  <!--&gt;中断任务</span>-->
                  <!--<span-->
                    <!--class="operation_btn"-->
                    <!--@click="recoveryOrRestart(scope.row,'recovery')"-->
                    <!--v-if="selectIndex === 0 && scope.row.taskStatus === 4"-->
                  <!--&gt;恢复任务</span>-->
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
    <div is="mapSelector" singleArea  :editAble="editAble" hideDBlist :open="openMap" :clear="msClear" :showTypes="'DB'" @mapSelectorEmit="mapSelectorEmit"></div>
  </div>
</template>
<script>
import { validateSimilarity, validateFrequency } from "@/utils/validator.js";
import { postTaskAnalysis, getTaskInfosPage, putAnalysisTask, putTaskInfosResume } from "../../api/api.analysis.js";
import { formatDate, dateOrigin } from "@/utils/util.js";
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
import mapSelector from '@/components/common/mapSelector.vue';
export default {
  components: { vlBreadcrumb, mapSelector },
  data() {
    return {
      searchData: {
        //搜索参数
        address: "",
        taskName: "",
        startTime: "",
        endTime: "",
        similarityName: "相似度：≥",
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
      openMap: false,
      editAble: true,
      hideDBlist: false,
      showTypes: "DB", //设备类型
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
      msClear: null,
      dSum: 0, // 设备总数
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
    mapSelectorEmit (result) {
      if (result) {
        console.log("------------",result)
        this.dSum = 0;
        this.cameraIds = []
        this.bayonetIds = []
        this.cameraIds = result.deviceList.map(item => item.uid)
        this.bayonetIds = result.bayonetList.map(item => item.uid)
        this.dSum = this.cameraIds.length + this.bayonetIds.length;
      }
    },
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
      this.openMap = !this.openMap;
      this.editAble = true;
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
      this.msClear = !this.msClear; // 清除地图选择
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
              if (res) {
                /* this.$router.push({
                  name: "portrait_pfcm"
                }); */
                this.$MyMessage("新建离线分析任务成功！", 'success');
                this.selectDataList()
                this.$nextTick(() => {
                    this.$refs[formName].resetFields();
                    this.setDate();
                    this.msClear = !this.msClear; // 清除地图选择
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
      /* this.getArea(); */
      console.log(this.area);
      if(this.area && this.area.length > 0) {
          this.amap.setFitView(this.area);
      }else {
          /* THIS.RESETZOOM() */
      }
    },
  },
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
      .select_db {
        width: 232px;
        padding: 2px 15px;
        background-color: #F5F7FA;
        color: #C0C4CC;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        > span {
          display: inline-block;
          padding: 0 3px;
          color: #333;
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
      /* .similarity {
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
            width: 78px;
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
      } */
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
  .similarity {
    .per_semblance_pfcm {
      color: #555;
      position: relative;
      >span {
        position: absolute;
        left: 0;
        display: block;
        height: 40px;
        line-height: 40px;
        z-index: 9;
        color: #606266;
        width: 82px;
        padding-left: 12px;
      }
      >i {
        display: inline-block;
        width: 20px;
        height: 1px;
        background: #999;
        margin: 19px 16px;
        vertical-align: middle;
      }
      .el-input {
        width: 202px;
        margin-right: 10px;
        input{
          text-indent: 69px;
        }
      }
    }
  }
  .frequency {
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