<template>
  <vue-scroll>
    <div class="frequent-appearances">
      <div class="">
        <div
                is="vlBreadcrumb"
                :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
          {name: '以图搜人'}]"
        ></div>
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
          <el-button @click="skipAddTaskPage" class="th-button-export-color">新建任务</el-button>
        </div>
        <div class="content-box">
          <div class="table_box">
            <el-table :data="list">
              <el-table-column label="序号" type="index" width="100"></el-table-column>
              <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip></el-table-column>
              <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
              <el-table-column label="相似度" show-overflow-tooltip>
                <template slot-scope="scope">
                  ≥{{scope.row.taskWebParam.minSemblance ? scope.row.taskWebParam.minSemblance : 0}}%
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
      <!--新建任务弹出框-->
      <el-dialog
              title="新增搜索任务"
              :visible.sync="addTaskDialog"
              width="720px"
              :close-on-click-modal="false"
              :close-on-press-escape="false"
              class="dialog_comp dialog_comp_add"
      >
        <div class="content_body">
          <div class="left">
            <div class="vl_jtc_img_box">
              <div class="vl_judge_tc_c_item">
                <el-upload
                    :class="{'vl_jtc_upload_ytsr': true}"
                    :show-file-list="false"
                    accept="image/*"
                    :action="uploadAcion"
                    list-type="picture-card"
                    @drop="drop($event)"
                    :before-upload="beforeAvatarUpload"
                    :on-success="uploadSucess"
                    :on-error="handleError">
                  <i v-if="uploading" class="el-icon-loading"></i>
                  <img v-else-if="curImageUrl" :src="curImageUrl" />
                  <div v-else>
                    <i
                      style="width: 100px;height: 85px;opacity: .5; position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto;"
                      class="vl_icon vl_icon_vehicle_01"
                    ></i>
                    <span>正脸照搜索更精确</span>
                  </div>
                </el-upload>
                <div v-show="curImageUrl" class="del_icon">
                  <i class="el-icon-delete" @click="delPic"></i>
                </div>
              </div>
            </div>
            <!--<p style="color: #999999;margin-top: 8px;padding-left: 40px;">请上传目标对象</p>-->
            <!--<p style="color: #999999;padding-left: 34px;">全身照搜索更精确</p>-->
          </div>
          <div class="right">
            <div class="line-box"><el-input v-model="addData.taskName" placeholder="请设置任务名称，最多20字" maxlength="20"></el-input></div>
            <div class="line-box left_num">
              <div class="per_semblance"><span>相似度</span><el-input oninput="value=value.replace(/[^0-9.]/g,''); if(value >= 100)value = 100" v-model="addData.minSemblance"></el-input> <i></i> 100</div>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer" style="padding-left: 208px;">
          <el-button @click="addTaskDialog = false">取消</el-button>
          <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="onConfirmAddTask">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </vue-scroll>
</template>
<script>
  // eslint-disable-next-line no-unused-vars
  import vlBreadcrumb from "@/components/common/breadcrumb.vue";
  import { getShotDevice, getTailBehindList, JtcPOSTAppendixInfo } from '@/views/index/api/api.judge.js';
  import { PortraitPostByphotoTask } from '@/views/index/api/api.portrait.js';
  import { getTaskInfosPage, putAnalysisTask, putTaskInfosResume } from '@/views/index/api/api.analysis.js';
  import { ajaxCtx, mapXupuxian } from '@/config/config.js';
  import { MapGETmonitorList } from "@/views/index/api/api.map.js";
  import { objDeepCopy, formatDate } from "@/utils/util.js";
  export default {
    components: {vlBreadcrumb},
    data() {
      return {
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
        addTaskDialog: false,
        isAddLoading: false,
        uploading: false,
        uploadAcion: ajaxCtx.base + '/new', // 图片上传地址
        curImageUrl: '',
        imgList: '',
        portraitGroupList: [],
        addData: {
          taskName: '',
          minSemblance: 85
        },
        taskTime: [new Date((new Date() - (24 * 60 * 60 * 1000))), new Date()],
        // 选择设备的数据
        isIndeterminate: false, // 是否处于全选与全不选之间
        checkAllTree: false, // 树是否全选
        isIndeterminateBayonet: false, // 是否处于全选与全不选之间
        checkAllTreeBayonet: false, // 树是否全选
        bayonetTree: [], // 卡口树
        videoTree: [],
        videoTreeNodeCount: 0, // 摄像头节点数量
        bayonetTreeNodeCount: 0, // 卡口节点数量
        defaultProps: {
          children: "children",
          label: "label"
        },
        selectDeviceArr: [], // 选中的设备数组
        selectVedioArr: [], // 选中的摄像头数组
        selectBayonetArr: [], // 选中的卡口数组
        selectedTreeTab: 0, // 当前选中的
        treeTabArr: [
          {
            name: "摄像头"
          },
          {
            name: "卡口"
          }
        ],
        treeTabShow: false,
        // 选择设备的数据
      };
    },
    mounted() {
      if (this.$route.query.imgurl) {
        this.addTaskDialog = true;
        this.curImageUrl = this.$route.query.imgurl;
        let x = {
          contentUid: this.$store.state.loginUser.uid,
          cname: '带图' + Math.random(),
          filePathName: '带图' + Math.random(),
          path: this.$route.query.imgurl
        }
        JtcPOSTAppendixInfo(x).then(jRes => {
          if (jRes) {
            x['uid'] = jRes.data;
            console.log(x);
          }
        })
        this.imgList = x;
      }
      this.getDataList();
    },
    methods: {
      // 获取离线任务
      getDataList () {
        const params = {
          'where.taskName': this.taskForm.taskName,
          'where.taskType': 4, //  1：频繁出没人像分析 2：人员同行分析 3：人员跟踪尾随分析 4:以图搜人 9：人员侦查报告
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
      beforeAvatarUpload (file) {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
        const isLt = file.size / 1024 / 1024 < 100;
        if (!isJPG) {
          this.$message.error('只能上传 JPG / PNG 格式图片!');
        }
        if (!isLt) {
          this.$message.error('上传图片大小不能超过 100MB!');
        }
        this.uploading = true;
        return isJPG && isLt;
      },
      uploadSucess (response, file, fileList) {
        this.uploading = false;
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
                x['uid'] = jRes.data;
                console.log(x);
              }
            })
            this.imgList = x;
            this.curImageUrl = x.path;
          }
        }
        console.log(fileList)
      },
      handleError () {
        this.uploading = false;
        this.$message.error('上传失败')
      },
      //tab切换
      selectTab (val) {
        this.selectIndex = val;
        this.getDataList();
      },
      skipResultPage (obj) {
        this.$router.push({name: 'portrait_ytsr', query: {uid: obj.uid}})
      },
      // 打开新增任务弹框
      skipAddTaskPage() {
        this.addData.taskName = '';
        this.addData.minSemblance = 85;
        this.addTaskDialog = true
      },
      // 删除图片
      onConfirmAddTask () {
        let params = {
          taskType: 1
        };
        if (!this.imgList) {
          if (!document.querySelector('.el-message--info')) {
            this.$message.info('请上传图片')
          }
          return false;
        } else {
          params['appendixIds'] = this.imgList.uid;
          params['uploadImgUrls'] = this.imgList.path;
        }
        if (!this.addData.taskName) {
          if (!document.querySelector('.el-message--info')) {
            this.$message.info('请输入任务名称')
          }
          return false;
        } else {
          params['taskName'] = this.addData.taskName;
        }
        params['minSemblance'] = this.addData.minSemblance ? this.addData.minSemblance : 0;
        this.isAddLoading = true;
        PortraitPostByphotoTask(params).then(res => {
          if (res && res.data) {
            this.$message({
              type: 'success',
              message: '新建成功',
              customClass: 'request_tip'
            })
            this.isAddLoading = false
            this.addTaskDialog = false
            this.getDataList()
            console.log(res.data)
          } else {
            this.isAddLoading = false;
          }
        })
            .catch(() => {this.isAddLoading = false})
      },
      // 跳至详情页面
      // eslint-disable-next-line no-unused-vars
      skipDetailPage(obj) {
        this.$router.push({ name: "peer_analysis_result" });
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
      delPic () {
        this.curImageUrl = '';
      }
    }
  };
</script>
<style lang="scss" scoped>
  .frequent-appearances {
    width: 100%;
    height: calc(100% - 54px);
    .breadcrumb_heaer {
      background: #fff;
      border-bottom: 1px solid #D3D3D3;
    }
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
  .dialog_comp_add {
    .content_body {
      display: flex;
      .left {
        border-right: 1px dashed #F2F2F2;
        width: 320px;

      }
      .right {
        width: 100%;
        padding: 15px 0 0 30px;
        .line-box {
          padding-bottom: 18px;
          /deep/ .el-input__inner::placeholder {
            color: #999;
          }
          /deep/ .el-range-editor {
            .el-input__icon {
              position: absolute;
              right: 8px;
              top: 2px;
            }
          }
        }
        .left_num {
          display: flex;
          padding-bottom: 10px;
          .th-span {
            margin-left: 4px;
            line-height: 40px;
            color: #999;
            font-size: 12px;
          }
        }
        // 选择设备下拉
        .selected_device {
          margin-bottom: 18px;
          position: relative;
          width: 100%;
          height: 40px;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          padding-left: 15px;
          > i {
            position: absolute;
            right: 12px;
            top: 13px;
          }
          &:hover,
          &:focus {
            // border-color: #0c70f8;
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
            color: #999;
          }
          // 树tab
          .device_tree_tab {
            position: absolute;
            top: 50px;
            left: -1px;
            z-index: 100;
            background: #fff;
            width: 100%;
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
        .input-box-line {
          display: flex;
          padding-bottom: 12px;
          padding-right: 15px;
          .title {
            display: flex;
            flex-direction: column;
            color: #909399;
            width: 20px;
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  .vl_jtc_img_box {
    width: 100%;
    height: auto;
    padding-bottom: 20px;
    text-align: center;
    .vl_judge_tc_c_item {
      width: 160px;
      height: 160px;
      display: inline-block;
      position: relative;
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      border-radius: 10px;
      cursor: pointer;
      &:first-child {
        margin-right: .15rem;
      }
      &:last-child {
        margin-left: .15rem;
      }
      &:hover {
        background: #2981F8;
        >p {
          display: block;
        }
        .del_icon {
          display: block;
        }
      }
      .vl_jtc_upload_ytsr {
        width: 100%;
        height: 100%;
        background: none;
        .el-upload--picture-card {
          border: none;
        }
        .el-upload {
          width: 100%;
          height: 100%;
          background: #f2f2f2;
          border: none;
          span {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin-top: 90px;
            color: #999;
          }
          &:hover {
            background: #2981f8;
            border: none;
          }
          &:hover span {
            color: #fff;
          }
          img {
            width: 100%;
            height: 100%;
            -webkit-border-radius: 10px;
            -moz-border-radius: 10px;
            border-radius: 10px;
          }
        }
      }
      >p {
        display: none;
        position: absolute;
        bottom: 0;
        text-align: center;
        width: 100%;
        color: #FFFFFF;
        height: 40px;
        line-height: 40px;
        -webkit-border-radius: 0 0 10px 10px;
        -moz-border-radius: 0 0 10px 10px;
        border-radius: 0 0 10px 10px;
        background: #0C70F8;
      }
      .vl_jtc_ic_input {
        position: absolute;
        top: .2rem;
        width: 3rem;
        height: .26rem;
        left: .2rem;
        border: 1px solid #D3D3D3;
        -webkit-border-radius: .13rem;
        -moz-border-radius: .13rem;
        border-radius: .13rem;
        padding: 0 .02rem;
        background: #FFFFFF;
        .el-form-item__content {
          height: .23rem;
          line-height: .23rem;
        }
        input {
          border: none!important;
          height: .23rem;
          line-height: .23rem;
        }
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
        background: rgba(0, 0, 0, .4);
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        color: #FFFFFF;
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
  .per_semblance {
    position: relative;
    >span {
      position: absolute;
      left: 20px;
      display: block;
      height: 40px;
      line-height: 40px;
      z-index: 9;
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
      width: 148px;
      input{
        text-indent: 60px;
      }
    }
  }
  .frequent-appearances {
    .__view {
      width: 100% !important; // vue-scroll样式重置
    }
  }
  .dialog_comp_add {
    .line-box {
      .el-range-input::placeholder {
        color: #999;
      }
      .el-range-editor.is-active,
      .el-range-editor.is-active:hover {
        border-color: #DCDFE6;
      }
      .el-input__inner::placeholder {
        color: #999999;
      }
      .el-input__inner:hover,
      .el-input__inner:focus {
        border-color: #DCDFE6;
      }
      .el-input-group__prepend {
        background: #fff;
        padding: 0 5px;
      }
    }
  }
  .left_num {
    .el-input__inner .el-range-input::placeholder {
      color: #999;
    }
    .el-input__inner:hover,
    .el-input__inner:focus {
      border-color: #DCDFE6 !important;
    }
    .left-none-border {
      width: calc(100% - 135px);
      .el-input__inner {
        border-left: none;
      }
      .el-input-group__prepend {
        background-color: #fff;
        color: #999;
        padding: 0 5px 0 10px;
      }
    }
  }
</style>