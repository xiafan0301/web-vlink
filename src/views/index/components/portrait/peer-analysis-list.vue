<template>
  <vue-scroll>
    <div class="frequent-appearances">
      <div is="vlBreadcrumb"
           :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
            {name: '同行分析'}]">
      </div>
      <div class="vl_p_peer_left">
        <!--查询范围-->
        <div class="per_left_time">
          <div class="left_time">
            <el-date-picker
              v-model="searchData.startTime"
              style="width: 100%;margin-bottom: 10px;"
              class="vl_date"
              type="datetime"
              :clearable="false"
              :time-arrow-control="true"
              @change="chooseStartTime"
              value-format="timestamp"
              placeholder="选择日期时间">
            </el-date-picker>
            <el-date-picker
              style="width: 100%;"
              :clearable="false"
              class="vl_date vl_date_end"
              v-model="searchData.endTime"
              @change="chooseEndTime"
              :time-arrow-control="true"
              value-format="timestamp"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </div>
        </div>
        <div class="vl_jtc_img_box">
          <div style="padding: 0 25px; height: 210px;">
            <div is="vlUpload" :clear="uploadClear" @uploadEmit="uploadEmit"></div>
          </div>
        </div>
        <div class="per_semblance_ytsr">
          <span>同行次数≥：</span>
          <el-input
            oninput="value=value.replace(/[^0-9.]/g,''); if(value >= 100)value = 100; if(value&&value <2)value = 2;"
            placeholder="填写同行次数" v-model="searchData.minSemblance">
          </el-input>(2-100)
        </div>
        <div class="ytsr_left_radio">
          <!-- <span>任务名称：</span> -->
          <!-- <span style="padding-right: 20px"> -->
          <el-input v-model="taskName" placeholder="请输入任务名称" maxlength="20"></el-input>
        <!-- </span> -->
        </div>
        <div class="peer_xzsb_s" @click="areaTypeChanged" v-if="chooseType === 1">
          <span>选择设备</span>
          <span class="el-icon-arrow-down"></span>
        </div>
        <div class="peer_dtxz_rst" v-else>
          已选<span>{{dSum}}</span>个设备<a href="javascript: void(0);" @click="openMap={}">重选</a>
        </div>
        <div class="vl_jtc_search">
          <div style="text-align: center;margin-bottom: 0px;">
            <el-button @click="resetSearch">重置</el-button>
            <el-button type="primary" :loading="searching" @click="tcDiscuss(false)">确定</el-button>
          </div>
        </div>
      </div>
      <div class="vl_s_right">
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
                  class="vl_date"
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
            <!--<div class="divide"></div>-->
            <!--<el-button @click="skipAddTaskPage" class="th-button-export-color">新建任务</el-button>-->
          </div>
          <div class="content-box">
            <div class="table_box">
              <el-table :data="list">
                <el-table-column label="序号" type="index" width="100"></el-table-column>
                <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="分析时间范围" prop="taskWebParam" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{scope.row.taskWebParam.startTime}} - {{scope.row.taskWebParam.endTime}}
                  </template>
                </el-table-column>
                <el-table-column label="同行次数" prop="taskWebParam.number" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{scope.row.taskWebParam.number && scope.row.taskWebParam.number > 0 ? '≥' + scope.row.taskWebParam.number : scope.row.taskWebParam.number}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="结果数" prop="resultNum" show-overflow-tooltip v-if="selectIndex === 1"></el-table-column>
                <el-table-column label="状态" v-if="selectIndex === 0" prop="taskStatus" show-overflow-tooltip>
                  <template slot-scope="scope" v-if="scope.row.taskStatus !== 2">
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
        </div>
      </div>
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
      <!-- D设备 B卡口  这里是设备和卡口 -->
      <div
        is="mapSelector"
        :open="openMap"
        :clear="msClear"
        :showTypes="'DB'"
        @mapSelectorEmit="mapSelectorEmit">
      </div>
    </div>
  </vue-scroll>
</template>
<script>
import { getTaskInfosPage, putAnalysisTask, postPeopleTask } from '@/views/index/api/api.analysis.js';
import { formatDate } from "@/utils/util.js";
import vlUpload from "@/components/common/upload.vue";
import mapSelector from '@/components/common/mapSelector.vue';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
export default {
  components: { vlUpload ,mapSelector, vlBreadcrumb },
  data() {
    return {
      openMap: false,
      dSum: 0,
      chooseType: 1,
      msClear: {},
      selectCameraArr: [],
      selectBayonetArr: [],


      taskName: '', // 左侧输入任务名称
      searching: false,
      imgList: '',
      historyPicDialog: false,
      historyPicList: [], // 上传历史记录
      loadingHis: false,
      searchData: {
        minSemblance: 5, // 最小相似度
        portraitGroupId: [],
        startTime: '',
        endTime: ''
      },
      uploadClear: {},
      pickerDateTime: {
        disabledDate (time) {
          return time.getTime() > (new Date().getTime());
        }
      },
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
      selectIndex: 1, // 默认已完成的任务
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      taskForm: {
        reportTime: [], // 日期
        taskName: null // 任务名称
      },
      list: [], //已完成列表
      taskId: null, // 任务id
      deleteDialog: false,
      isDeleteLoading: false,
      interruptDialog: false, //中断任务
    };
  },
  computed: {
    choosedHisPic () {
      return this.historyPicList.filter(x => x.checked)
    }
  },
  mounted() {
    //获取摄像头卡口数据
    this.setDTime();
    this.getDataList();
  },
  methods: {
    areaTypeChanged () {
      this.chooseType = 2;
      this.openMap = {};
    },
    mapSelectorEmit (result) {
      if (result) {
        // bayonetList deviceList
        this.dSum = 0;
        if (result.deviceList && result.deviceList.length > 0) {
          this.dSum = result.deviceList.length;
          for (let i = 0; i < result.deviceList.length; i++) {
            this.selectCameraArr.push(result.deviceList[i].uid);
          }
        } else {
          this.selectCameraArr = [];
        }
        if (result.bayonetList && result.bayonetList.length > 0) {
          for (let i = 0; i < result.bayonetList.length; i++) {
            this.selectBayonetArr.push(result.bayonetList[i].uid);
          }
          this.dSum += result.bayonetList.length;
        } else {
          this.selectBayonetArr = [];
        }
      }
    },

    setDTime() {
      let date = new Date();
      let curDate = date.getTime();
      let curS = 1 * 24 * 3600 * 1000;
      let _sDate = new Date(curDate - curS);
      let _s = _sDate.getFullYear()+ '-' + (_sDate.getMonth() + 1) + '-' + _sDate.getDate() + ' 00:00:00' ;
      this.searchData.startTime = new Date(_s).getTime();
      this.searchData.endTime = curDate;
    },
    chooseEndTime (e) {
      if (e < this.searchData.startTime) {
        this.$message.info('结束时间必须大于开始时间才会有结果')
      }
    },
    chooseStartTime (e) {
      if (e > this.searchData.endTime) {
        this.$message.info('结束时间必须大于开始时间才会有结果')
      }
    },
    resetSearch () {
      this.taskName = '';
      this.searchData.minSemblance = 5;
      this.uploadClear = {};
      this.msClear = {};
      this.dSum = 0;
      this.chooseType = 1;
      this.setDTime();
    },
    tcDiscuss (boolean) {
      let params = {};
      if (this.dSum === 0) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('请先选择设备')
        }
        return false;
      }
      if (!this.imgList) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('请上传图片')
        }
        return false;
      } else {
        params['targetPicUrl'] = this.imgList.path;
      }
      if (this.searchData.minSemblance) {
        params['number'] = this.searchData.minSemblance;
      } else {
        params['number'] = 2;
      }
      params['deviceId'] = this.selectCameraArr.join(',');
      params['bayonetIds'] = this.selectBayonetArr.join(',');
      params['startTime'] = formatDate(this.searchData.startTime, 'yyyy-MM-dd HH:mm:ss');
      params['endTime'] = formatDate(this.searchData.endTime, 'yyyy-MM-dd HH:mm:ss');
      if (!boolean) {
        this.searching = true;
      }
      if (!this.taskName.replace(/\s+|\s+$/g, '')) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('任务名称不能为空');
          this.searching = false;
          return false;
        }
      } else {
        params.taskName = this.taskName;
        postPeopleTask(params).then(res => {
          this.searching = false;
          this.resetSearch();
          if (res && res.data) {
            this.$message({
              type: 'success',
              message: '新建成功',
              customClass: 'request_tip'
            })
            this.getDataList();
          }
        })
      }
    },
    // 获取离线任务
    getDataList () {
      const params = {
        'where.taskName': this.taskForm.taskName,
        'where.taskType': 2, // 2：人员同行分析
        'where.startTime': this.taskForm.reportTime[0],
        'where.endTime': this.taskForm.reportTime[1],
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
      this.pagination.pageNum = 1;
      this.getDataList();
    },
    skipResultPage (obj) {
      this.$router.push({name: 'peer_analysis_result', query: {uid: obj.uid}})
    },
    uploadEmit(data) {
      if (data && data.path) {
        this.imgList = data;
      } else {
        this.imgList = null;
      }
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
          taskType: 2, // 1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析
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
          taskType: 2, // 1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析
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
      const webParam = obj.taskWebParam;
      if (obj.uid) {
        const params = {
          uid: obj.uid,
          taskName: obj.taskName,
          ...webParam
        };
        postPeopleTask(params)
          .then(res => {
            if (res && res.code === '00000000') {
              this.getDataList();
            }
          })
          .catch(() =>{})
      }
    },
    // 查询任务列表数据
    selectDataList () {
      this.getDataList();
    },
    // 重置查询条件
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getDataList();
    },
    // 分页
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getDataList();
    },
  }
};
</script>
<style lang="scss" scoped>
  .peer_xzsb_s {
    height: 40px;
    line-height: 40px;
    width: calc(100% - 40px);
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    cursor: pointer;
    color: #999999;
    padding: 0 6px;
    margin-left: 20px;
    > span {
      display: inline-block;
      width: 50%;
      &:last-child {
        text-align: right;
      }
    }
  }
  .peer_dtxz_rst {
    width: calc(100% - 40px);
    line-height: 40px;
    padding: 0px 15px; margin-top: 5px;
    margin-left: 20px;
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
  // 关闭设备tab
  .selected_device_comp {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    opacity: 0;
    z-index: 10;
  }
  .device-comp {
    .error-tip {
      margin-top: -10px;
      margin-bottom: 10px;
    }
  }
  // 选择设备下拉
  .selected_device {
    margin-bottom: 10px;
    position: relative;
    width: 232px;
    height: 40px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding-left: 12px;
    > i {
      position: absolute;
      right: 12px;
      top: 13px;
    }
    &:hover,
    &:focus {
      border-color: #0c70f8;
      cursor: pointer;
    }
    .device_list {
      line-height: 40px;
      font-size: 14px;
      color: #333;
      .device_count {
        color: #0c70f8;
        margin-left: 20px;
      }
    }
    .no_device {
      line-height: 40px;
      color: #999999;
    }
    // 树tab
    .device_tree_tab {
      position: absolute;
      top: 50px;
      left: -1px;
      z-index: 100;
      background: #fff;
      width: 232px;
      height: 350px;
      border-radius: 4px;
      border: 1px solid #d3d3d3;
      .tab_title {
        width: 50%;
        float: left;
        background: #f2f2f2;
        text-align: center;
        color: #666666;
        line-height: 30px;
        font-size: 12px;
      }
      .current_title {
        background: #fff;
      }
      // 树
      .tree_content {
        height: 310px;
        padding-top: 10px;
        .checked_all {
          padding: 0 0 8px 23px;
        }
      }
    }
  }
.frequent-appearances {
  width: 100%;
  height: calc(100% - 54px);
  .breadcrumb_heaer {
    background: #fff;
    border-bottom: 1px solid #D3D3D3;
  }
}
</style>

<style lang="scss">
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
.frequent-appearances {
  .__view {
    width: 100% !important; // vue-scroll样式重置
  }
  .vl_p_peer_left {
    float: left;
    width: 272px;
    /*padding-top: 20px;*/
    height: calc(100% - 50px);
    min-height: 790px;
    background: #ffffff;
    box-shadow: 2px 3px 10px 0px rgba(131, 131, 131, 0.28);
    animation: fadeInLeft .4s ease-out .3s both;
    .vl_jtc_img_box {
      width: 100%;
      height: auto;
      // border-bottom: 1px solid #D3D3D3;
      // padding-bottom: 10px;
      margin-bottom: 10px;
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
      padding: 20px 0 20px 0;
      .el-input__inner {
        height: 40px!important;
        line-height: 40px!important;
      }
      .el-input__icon {
        height: 40px!important;
        line-height: 40px!important;
      }
      .el-range-editor {
        width: 100%;
        /*padding: 0;*/
        > .el-range__close-icon {
          display: none;
        }
        > input {
          width: 50%;
        }
        /*.el-range-separator {*/
        /*height: 40px;*/
        /*line-height: 40px;*/
        /*width: 10px;*/
        /*padding: 0;*/
        /*}*/
      }
      button {
        width: 110px;
        height: 40px;
        line-height: 40px;
        padding: 0 12px;
      }
      .el-select {
        margin-bottom: 10px;
      }
      > div {
        margin-bottom: 10px;
      }
      .vl_jtc_search_item {
        height: 217px;
        .camera-tree {
          border: 1px solid #e4e7ed;
          border-radius: 4px;
          background-color: #fff;
          -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
          -webkit-box-sizing: border-box;
        }
      }
    }
    .ytsr_left_radio {
      width: calc(100% - 20px);
      padding-left: 20px;
      margin: 10px 0;
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
    .per_left_time {
      margin-left: 20px;
      width: 232px;
      .el-select {
        width: 100%;
      }
      .left_time {
        width: 100%;
        margin: 10px 0;
        .el-date-editor {
          width: 100%;
        }
        .el-range__close-icon {
          display: none;
        }
      }
    }
    .per_semblance_ytsr {
      position: relative;
      padding-left: 20px;
      >span {
        position: absolute;
        left: 20px;
        display: block;
        height: 40px;
        line-height: 40px;
        z-index: 9;
        color: #999999;
        width: 95px;
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
        width: 180px;
        margin-right: 10px;
        input{
          text-indent: 69px;
        }
      }
    }
  }
  .vl_s_right {
    display: inline-block;
    width: calc(100% - 272px);
    height: calc(100% - 60px);
    position: relative;
    .frequent-a-content {
      margin: 20px;
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
    }
  }
}
</style>

