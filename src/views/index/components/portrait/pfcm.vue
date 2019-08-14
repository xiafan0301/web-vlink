<template>
<div class="frequent-appearances">
  <vue-scroll>
    <div>
      <div class="">
        <!-- <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/portrait/menu' }">检索</el-breadcrumb-item>
          <el-breadcrumb-item>频繁出没</el-breadcrumb-item>
        </el-breadcrumb> -->
        <div is="vlBreadcrumb" 
          :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
            {name: '频繁出没'}]">
        </div>
      </div>
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
                style="width: 240px;"
                type="text"
                placeholder="请输入任务名称"
                v-model="taskForm.taskName"
              />
            </el-form-item>
            <el-form-item prop="reportTime" class="time" label="创建时间：">
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
          <div class="divide"></div>
        </div>
        <div class="content-box">
          <div class="button_box">
            <div class="add_event_btn" @click="skipAddTaskPage">
              <span>+</span>
              <span>新增分析任务</span>
            </div>
          </div>
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
                    @click="recoveryOrRestart(scope.row)"
                    v-if="selectIndex === 0 && scope.row.taskStatus === 4"
                  >恢复任务</span>
                  <span
                    class="operation_btn"
                    @click="recoveryOrRestart(scope.row)"
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
  </vue-scroll>
</div>
</template>
<script>
import { getTaskInfosPage, putAnalysisTask, putTaskInfosResume } from "../../api/api.analysis.js";
import { formatDate} from '@/utils/util.js';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
export default {
  components: {vlBreadcrumb},
  data() {
    return {
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
  created() {
    this.userInfo = this.$store.state.loginUser;
    if(this.$route.query.selectIndex == 0) {
      this.selectIndex = 0
    }else {
      this.selectIndex = 1
    }
  },
  mounted() {
    this.selectDataList();
  },
  methods: {
    //tab切换
    selectTab(val) {
      this.selectIndex = val;
      this.pagination.pageNum = 1;
      this.taskForm.taskName = "";
      this.taskForm.reportTime = "";
      this.$router.push({ name: "portrait_pfcm", query: {selectIndex: val} });
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
                this.selectDataList();
            }
        }).catch(() => {})
    },
    //恢复任务,重启任务
    recoveryOrRestart(obj) {
        putTaskInfosResume(obj.uid).then(res => {
            console.log(res)
            if(res) {
                this.selectDataList();
            }
        }).catch(() => {})
    },
  }
};
</script>
<style lang="scss" scoped>
.frequent-appearances {
  width: 100%;
  height: 100%;
  padding-bottom: 20px;
  .breadcrumb_heaer {
    background: #fff;
    border-bottom: 1px solid #D3D3D3;
  }
  .frequent-a-content {
    margin: 20px 20px 0;
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
        margin-top: 10px;
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
</style>

<style lang="scss">
.frequent-appearances {
    .__view {
      width: 100% !important; // vue-scroll样式重置
    }
}
</style>

