<template>
  <div class="vehicle_content">
    <div class="vc_rep_bd" is="vehicleBreadcrumb" :oData="[{name: '人员侦察报告'}]"></div>
    <div style="height: 50px"></div>
    <div class="vehicle_content_box_left">
      <div style="padding: 20px; padding-bottom: 0">
        <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" :rules="rules">
          <el-form-item prop="taskName">
            <el-input v-model="ruleForm.taskName"  placeholder="请输入任务名称"></el-input>
          </el-form-item>
          <el-form-item prop="value1">
            <el-date-picker
                v-model="ruleForm.value1"
                type="datetime"
                class="full vl_date"
                style="width: 100%"
                :picker-options="pickerOptions"
                placeholder="开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="value2">
            <el-date-picker
                v-model="ruleForm.value2"
                type="datetime"
                style="width: 100%"
                class="vl_date vl_date_end"
                :picker-options="pickerOptions"
                placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <div :class="['upload_pic',{'hidden': dialogImageUrl}]">
              <el-upload
                  ref="uploadPic"
                  accept="image/*"
                  :action="uploadUrl"
                  :before-upload="befupload"
                  :on-success="uploadPicSuccess"
                  :limit="1"
                  :on-remove="handleRemove"
                  :data="{projectType: 2}"
                  list-type="picture-card">
                <i class="vl_icon vl_icon_control_14"></i>
              </el-upload>
            </div>
            <div style="color:rgba(153,153,153,1); margin-top: 10px; text-align: center">请上传全身照片</div>
          </el-form-item>
          <el-form-item>
            <el-button class="reset_btn" style="width: 110px" @click="skipAddTaskPage('ruleForm')">重置</el-button>
            <el-button type="primary" style="width: 110px" @click="addnewtask('ruleForm')" :loading="addloading">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="vehicle_content_box">
      <div class="vehicle_content_out">
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
                  v-model="taskForm.reportTime"
                  type="datetimerange"
                  style="width: 374px"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  range-separator="-"
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
<!--          <div class="button_box">-->
<!--            <div class="add_event_btn" @click="skipAddTaskPage('ruleForm')">-->
<!--              <span>+</span>-->
<!--              <span>新增分析任务</span>-->
<!--            </div>-->
<!--          </div>-->
          <div class="table_box" v-loading="isLoading">
            <el-table :data="list">
              <el-table-column label="序号" type="index" width="100"></el-table-column>
              <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip></el-table-column>
              <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
              <el-table-column label="分析时间范围" prop="taskName" show-overflow-tooltip min-width="150px">
                <template slot-scope="scope">
<!--                  {{scope.row.taskWebParam.startTime}} - {{scope.row.taskWebParam.endTime}}-->
                  {{JSON.parse(scope.row.taskWebParam).startTime}}-
                  {{JSON.parse(scope.row.taskWebParam).endTime}}
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
          <span style="color: #999999;">任务删除，任务的数据处理进程将被清理，人物不在可以恢复</span>
          <div slot="footer" class="dialog-footer">
            <el-button @click="deleteDialog = false">取消</el-button>
            <el-button class="operation_btn function_btn" @click="interruptConfirm(2)">确认</el-button>
          </div>
        </el-dialog>
        <!--新建任务弹出框-->
        <el-dialog
            title="新建分析任务"
            :visible.sync="newTaskeDialog"
            width="482px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            class="dialog_comp"
        >
          <div :class="['upload_pic',{'hidden': dialogImageUrl}]">
            <el-upload
                ref="uploadPic"
                accept="image/*"
                :action="uploadUrl"
                :before-upload="befupload"
                :on-success="uploadPicSuccess"
                :limit="1"
                :on-remove="handleRemove"
                :data="{projectType: 2}"
                list-type="picture-card">
              <i class="vl_icon vl_icon_control_14"></i>
            </el-upload>
          </div>
          <div style="color:rgba(153,153,153,1); margin-top: 10px; text-align: center">请上传全身照片</div>
          <div style="padding: 20px; padding-bottom: 0">
            <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm" >
              <el-form-item prop="taskName">
                <el-input v-model="ruleForm.taskName"  placeholder="请输入任务名称"></el-input>
              </el-form-item>
            <el-form-item prop="value1">
              <el-date-picker
                  v-model="ruleForm.value1"
                  type="datetimerange"
                  class="full vl_date"
                  range-separator="至"
                  :default-time="['00:00:00', '23:59:59']"
                  :picker-options="pickerOptions"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="newTaskeDialog = false">取消</el-button>
            <el-button class="operation_btn function_btn" @click="addnewtask" :loading="addloading">确认</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import vehicleBreadcrumb from './breadcrumb.vue';
import { postTaskInfosPage, putAnalysisTask, putTaskInfosResume, newTaskInfos} from "../../api/api.analysis.js";
import { formatDate, dateOrigin} from '@/utils/util.js';
import { ajaxCtx } from '@/config/config.js';
// import {mapXupuxian} from '@/config/config.js';
export default {
  components: {vehicleBreadcrumb},
  data () {
    return {
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
        ]
      },
      uploadUrl: ajaxCtx.base + '/new', // 图片上传地址
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
        reportTime: [], // 日期
        taskName: "" // 任务名称
      },
      list: [], //已完成列表
      userInfo: {}, // 存储的用户信息
      deleteDialog: false,
      interruptDialog: false,    //中断任务
      newTaskeDialog: false,
      isLoading: false,
      taskObj: '',     //单个列表任务
      ruleForm: {
        value1: '',
        taskName: '',
        value2: ''
      },
      dialogImageUrl: null,
      addloading: false,
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > (new Date().getTime());
        }
      }
    }
  },
  created() {
    this.userInfo = this.$store.state.loginUser;
  },
  mounted () {
    this.selectDataList();
    this.settime()
  },
  methods: {
    settime () {
      let _s = dateOrigin(false, new Date(new Date().getTime() - 3600 * 1000 * 24 * 1));
      /* let _e = new Date(dateOrigin(true).getTime() - 3600 * 1000 * 24 * 1); */
      let _e = new Date();
      this.ruleForm.value1 = _s;
      this.ruleForm.value2 = _e;
    },
    handleRemove () {
      this.dialogImageUrl = null
      this.$nextTick(() => {
        this.$refs['uploadPic'].clearFiles()
      })
    },
    uploadPicSuccess (res) {
      this.dialogImageUrl = res.data.fileFullPath
      this.$message.success('上传成功！');
    },
    befupload () {
      console.log('kdfnsdfkdskjfsdf')
    },
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
        'where.taskType': 9,    //任务类型 1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析
        'where.isFinish': this.selectIndex,   //是否完成 0:未完成(包含处理中、处理失败、处理中断) 1：已完成(处理成功)
      }
      this.taskForm.taskName && (params['where.taskName'] = this.taskForm.taskName);
      if(this.taskForm.reportTime && this.taskForm.reportTime.length > 0) {
        params["where.startTime"] = formatDate(this.taskForm.reportTime[0]);
        params["where.endTime"] = formatDate(this.taskForm.reportTime[1]);
      }
      console.log("---------params-----------",JSON.stringify(params))
      this.isLoading = true;
      postTaskInfosPage(params).then(res => {
        console.log("--------getTaskInfosPage--------",res)
        if(res.data) {
          this.list = res.data.list;
          this.pagination.total = res.data.total;
          console.log(this.list)
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
      this.ruleForm.taskName = ''
      this.dialogImageUrl = null
      this.settime()
      this.$nextTick(() => {
        this.$refs['uploadPic'].clearFiles()
      })
      // $('.el-upload-list').css({"display":"none"})
    },
    // 跳至详情页面
    skipDetailPage(obj) {
      let data = JSON.parse(obj.taskWebParam)
      this.$router.push({ name: "portrait_nr" , query: {uid: obj.uid, targetUrl: data.targetPicUrl, startTime: data.startTime, endTime: data.endTime}});
    },
    // 新见任务
    addnewtask (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            taskName: this.ruleForm.taskName,
            startTime: formatDate(this.ruleForm.value1),
            endTime: formatDate(this.ruleForm.value2),
            targetPicUrl: this.dialogImageUrl
          }
          this.addloading = true
          newTaskInfos(params).then(res => {
            if(res.data){
              console.log(res.data)
              this.newTaskeDialog = false
              this.selectDataList();
            }
            this.$nextTick(() => {
              this.addloading = false
            })
          }).catch(error => {
            console.log(error)
            this.addloading = false
          })
        }
      });
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
}
</script>
<style lang="scss" scoped>
  .vehicle_content{
    height: 100%;
    .vehicle_content_box_left{
      width: 272px;
      height: calc(100% - 50px);
      float: left;
      background-color: white;
      box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
      .el-form-item{
        margin-bottom: 13px;
      }
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
    .vehicle_content_box{
      height: calc(100% - 50px);
      overflow: auto;
      padding: 20px;
      .vehicle_content_out{
        background: #ffffff;
        min-height: 100%;
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
    .upload_pic{
      text-align: center;
      height: 160px;
      margin: 0 auto;
      width: 160px;
      overflow: hidden;
      .el-upload{
        img{
          width: 158px;
          height: 158px;
          border-radius: 6px;
        }
      }
      .dialog_pic{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: auto;
        margin: 0;
        z-index: 2002;
        background: rgba(0, 0, 0, 0.4);
        img{
          position: fixed;
          top: 50%;
          left: 50%;
          z-index: 2003;
          margin: 0 !important;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          border-radius: 4px;
        }
      }
    }
  }
</style>
<style lang="scss">
  .upload_pic{
  .el-upload--picture-card{
    width: 160px;
    height: 160px;
    background: #F2F2F2;
    border-radius: 20px;
  i{
    width: 120px;
    height: 110px;
  }
  &:hover{
     background: #0C70F8;
  i.vl_icon_control_14{
    background-position: -228px -570px;
  }
  }
  }
  &.hidden .el-upload--picture-card{
     display: none!important;
   }
  .el-upload-list__item{
    width: 160px;
    height: 160px;
  }
  }
</style>