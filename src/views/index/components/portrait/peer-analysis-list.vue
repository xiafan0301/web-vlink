<template>
  <vue-scroll>
    <div class="frequent-appearances">
      <div class="th-breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/portrait/menu' }">人像检索</el-breadcrumb-item>
          <el-breadcrumb-item>同行分析</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button @click="skipAddTaskPage" class="th-button-export-color">新建任务</el-button>
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
                format="yyyy-MM-dd HH:mm"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
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
          <div class="table_box">
            <el-table :data="list">
              <el-table-column label="序号" type="index" width="100"></el-table-column>
              <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip></el-table-column>
              <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
              <el-table-column label="分析时间范围" prop="createTime" show-overflow-tooltip></el-table-column>
              <el-table-column label="同行次数" prop="createTime" show-overflow-tooltip></el-table-column>
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
                    @click="recoveryTask(scope.row)"
                    v-if="selectIndex === 0 && scope.row.taskStatus && scope.row.taskStatus === 4"
                  >恢复任务</span>
                  <span
                    class="operation_btn"
                    @click="showAddTaskDialog('edit', scope.row)"
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
          <el-button class="operation_btn function_btn" @click="deleteDialog = false">确认</el-button>
        </div>
      </el-dialog>
      <!--新建任务弹出框-->
      <el-dialog
        title="新增分析任务"
        :visible.sync="addTaskDialog"
        width="720px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp dialog_comp_add"
        >
        <div class="content_body">
          <div class="left">
            <div :class="['upload_box', {'hidden': dialogImageUrl}]">
              <el-upload
                ref="uploadPic"
                accept="image/*"
                :limit="1"
                :action="uploadUrl"
                list-type="picture-card"
                :on-success="uploadPicSuccess"
                :on-remove="handleRemove"
                :before-upload="beforeAvatarUpload"
                :file-list="fileList">
                <i class="vl_icon vl_icon_th_01"></i>
                <!-- <p class="upload_text" v-show="!dialogImageUrl">点击上传图片</p> -->
              </el-upload>
            </div>
            <p style="color: #999999;margin-top: 8px;padding-left: 40px;">请上传目标对象</p>
            <p style="color: #999999;padding-left: 34px;">全身照搜索更精确</p>
          </div>
          <div class="right">
            <div class="line-box"><el-input v-model="addData.taskName" placeholder="请设置任务名称，最多20字" maxlength="20"></el-input></div>
            <!-- 选择设备 -->
            <!-- treeTabShow 为展开 -->
            <div class="selected_device_comp" v-if="treeTabShow" @click="chooseDevice"></div>
            <div class="selected_device" @click="treeTabShow = true;">
              <i v-if="treeTabShow" class="el-icon-arrow-up"></i>
              <i v-else class="el-icon-arrow-down"></i>
              <div class="device_list" v-if="selectDeviceArr.length > 0">
                <span>{{ selectDeviceArr[0].label }}</span>
                <span v-show="selectDeviceArr.length > 1" title="展开选中的设备" class="device_count">+{{ selectDeviceArr.length - 1 }}</span>
              </div>
              <!-- placeholder -->
              <div class="no_device" v-else>请选择设备</div>
              <!-- 树tab页面 -->
              <div class="device_tree_tab" v-show="treeTabShow">
                <div style="overflow: hidden;">
                  <div
                    class="tab_title"
                    :class="{ 'current_title': index === selectedTreeTab }"
                    @click="selectedTreeTab = index;"
                    v-for="(item, index) in treeTabArr"
                    :key="'tab_title' + index"
                  >{{ item.name }}</div>
                </div>
                <!-- 视频树 -->
                <div class="tree_content" v-show="selectedTreeTab === 0">
                  <vue-scroll>
                    <div class="checked_all">
                      <el-checkbox
                        :indeterminate="isIndeterminate"
                        v-model="checkAllTree"
                        @change="handleCheckedAllVideo"
                      >全选</el-checkbox>
                    </div>
                    <el-tree
                      @check="listenCheckedVideo"
                      :data="videoTree"
                      show-checkbox
                      default-expand-all
                      node-key="id"
                      ref="videotree"
                      highlight-current
                      :props="defaultProps"
                    ></el-tree>
                  </vue-scroll>
                </div>
                <div class="tree_content" v-show="selectedTreeTab === 1">
                  <vue-scroll>
                    <div class="checked_all">
                      <el-checkbox
                        :indeterminate="isIndeterminateBayonet"
                        v-model="checkAllTreeBayonet"
                        @change="handleCheckedAllBayonet"
                      >全选</el-checkbox>
                    </div>
                    <el-tree
                      @check="listenCheckedBayonet"
                      :data="bayonetTree"
                      show-checkbox
                      default-expand-all
                      node-key="id"
                      ref="bayonetTree"
                      highlight-current
                      :props="defaultProps"
                    ></el-tree>
                  </vue-scroll>
                </div>
              </div>
            </div>

            <div class="line-box">
              <el-date-picker
                v-model="addData.taskTime"
                style="width:100%;"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
            <div class="line-box left_num">
              <el-input class="left-none-border" v-model="addData.number">
                <template slot="prepend">同行次数<b style="font-weight: normal;color: #D3D3D3;padding-left: 10px;">不少于</b></template>
              </el-input>
              <span class="th-span"><b style="font-weight: normal;color: #333;">次</b>（输入范围：2-100）</span>
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
import { getShotDevice, getTailBehindList } from '@/views/index/api/api.judge.js';
import { getTaskInfosPage, putAnalysisTask, putTaskInfosResume, postPeopleTask } from '@/views/index/api/api.analysis.js';
import { ajaxCtx, mapXupuxian } from '@/config/config.js';
import { MapGETmonitorList } from "@/views/index/api/api.map.js";
import { objDeepCopy, formatDate } from "@/utils/util.js";
export default {
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
      selectIndex: 1, // 默认已完成的任务
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      taskForm: {
        reportTime: [], // 日期
        taskName: null // 任务名称
      },
      list: [], //已完成列表
      taskId: null, // 任务id
      deleteDialog: false,
      interruptDialog: false, //中断任务
      addTaskDialog: false,
      isAddLoading: false,
      fileList: [], // 图片上传列表
      dialogImageUrl: null,
      uploadUrl: ajaxCtx.base + '/new', // 图片上传地址
      addData: {
        taskName: null,
        deviceId: null,
        taskTime: null,
        startTime: null,
        endTime: null,
        number: null,
        targetPicUrl: null
      },
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
    //获取摄像头卡口数据
    this.getMonitorList()
    this.getDataList();
  },
  methods: {
    // 获取离线任务
    getDataList () {
      const params = {
        'where.taskName': this.taskForm.taskName,
        'where.taskType': 2, // 2：人员同行分析
        'where.dateStart': this.taskForm.reportTime[0],
        'where.dateEnd': this.taskForm.reportTime[1],
        'where.isFinish': this.selectIndex,   //是否完成 0:未完成(包含处理中、处理失败、处理中断) 1：已完成(处理成功)
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        order: 'desc',
        orderBy: 'create_time'
      };
      getTaskInfosPage(params)
        .then(res => {
          if (res) {
            this.list = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    //tab切换
    selectTab (val) {
      this.selectIndex = val;
      this.getDataList();
    },
    // 跳到新增任务页面
    skipAddTaskPage() {
      this.addTaskDialog = true
    },
    // 删除图片
    // eslint-disable-next-line no-unused-vars
    handleRemove (file, fileList) {
      this.dialogImageUrl = null;
    },
    // 上传成功
    uploadPicSuccess (res) {
      if (res && res.data) {
        this.dialogImageUrl = res.data.fileFullPath
        this.addData.targetPicUrl = res.data.fileFullPath
      }
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      const isLt4M = file.size / 1024 / 1024 < 4;
      if (!isJPG) {
        this.$message.error('上传图片只能是 jpeg、jpg、png 格式!');
      }
      if (!isLt4M) {
        this.$message.error('上传图片大小不能超过 4MB!');
      }
      return isJPG && isLt4M;
    },
    onConfirmAddTask () {
      this.addTaskDialog = false
      let arr = []
      this.selectDeviceArr.forEach(item => {arr.push(item.uid)})
      this.addData.deviceId = arr.join(',')
      this.addData.startTime =  formatDate(this.addData.taskTime[0])
      this.addData.endTime =  formatDate(this.addData.taskTime[1])
      console.log(this.addData)
      postPeopleTask(this.addData).then(res => {
        if (res && res.data) {
          console.log(res.data)
        }
      })
      
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
    // 恢复任务
    recoveryTask (obj) {
      if (obj.uid) {
        // const params = {
        //   uid: obj.uid
        //   // taskType: 3
        // };
        putTaskInfosResume(obj.uid)
          .then(res => {
            if (res) {
              this.getDataList();
            }
          })
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
    /**
     * 获取摄像头卡口信息列表
     */
    getMonitorList() {
      let params = {
        areaUid: mapXupuxian.adcode
      };
      MapGETmonitorList(params).then(res => {
        if (res && res.data) {
          let camera = objDeepCopy(res.data.areaTreeList);
          let bayonet = objDeepCopy(res.data.areaTreeList);
          this.videoTree = this.getTreeList(camera);
          this.bayonetTree = this.getBayTreeList(bayonet);
          this.getLeafCountTree(this.videoTree, 'camera');
          this.getLeafCountTree(this.bayonetTree, 'bayonet');
        }
      });
    },
    /**
     * 获取摄像头数据
     */
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
            key['treeType'] = 1
          }
        }
      }
      return data;
    },
    /**
     * 获取卡口数据
     */
    getBayTreeList(data) {
      for(let item of data) {
        item['id'] = item.areaId
        item['label'] = item.areaName
        if(item.bayonetList && item.bayonetList.length > 0) {
          item['children'] = item.bayonetList
          delete(item.bayonetList)
          for(let key of item['children']) {
            key['label'] = key.bayonetName
            key['id'] = key.uid
            key['treeType'] = 2
          }
        }
      }
      return data;
    },
    /**
     * 摄像头树全选按钮点击
     */
    handleCheckedAllVideo(val) {
      this.isIndeterminate = false;
      if (val) {
        this.$refs.videotree.setCheckedNodes(this.videoTree);
      } else {
        this.$refs.videotree.setCheckedNodes([]);
      }
      this.selectVedioArr = this.$refs.videotree.getCheckedNodes(true);
      this.handleData();
    },
    /**
     * 处理摄像头树全选按钮
     */
    listenCheckedVideo(val, val1) {
      console.log(val)
      // console.log(val1)
      this.selectVedioArr = this.$refs.videotree.getCheckedNodes(true);
      this.handleData();
      if (val1.checkedNodes.length === this.videoTreeNodeCount) {
        this.isIndeterminate = false;
        this.checkAllTree = true;
      } else if (val1.checkedNodes.length < this.videoTreeNodeCount && val1.checkedNodes.length > 0) {
        this.checkAllTree = false;
        this.isIndeterminate = true;
      } else if (val1.checkedNodes.length === 0) {
        this.checkAllTree = false;
        this.isIndeterminate = false;
      }
    },
    /**
     * 卡口树全选按钮点击
     */
    handleCheckedAllBayonet(val) {
      this.isIndeterminateBayonet = false;
      if (val) {
        this.$refs.bayonetTree.setCheckedNodes(this.bayonetTree);
      } else {
        this.$refs.bayonetTree.setCheckedNodes([]);
      }
      this.selectBayonetArr = this.$refs.bayonetTree.getCheckedNodes(true);
      this.handleData();
    },
    /**
     * 处理卡口树全选按钮
     */
    listenCheckedBayonet(val, val1) {
      this.selectBayonetArr = this.$refs.bayonetTree.getCheckedNodes(true);
      this.handleData();
      if (val1.checkedNodes.length === this.bayonetTreeNodeCount) {
        this.isIndeterminateBayonet = false;
        this.checkAllTreeBayonet = true;
      } else if (val1.checkedNodes.length < this.bayonetTreeNodeCount && val1.checkedNodes.length > 0) {
        this.checkAllTreeBayonet = false;
        this.isIndeterminateBayonet = true;
      } else if (val1.checkedNodes.length === 0) {
        this.checkAllTreeBayonet = false;
        this.isIndeterminateBayonet = false;
      }
    },
    /**
     * 获取摄像头树节点的数量
     */
    getLeafCountTree(json, type) {
      // 获取树节点的数量
      for (let i = 0; i < json.length; i++) {
        if (json[i].hasOwnProperty("id")) {
          if (type === "camera") {
            this.videoTreeNodeCount++;
          } else {
            this.bayonetTreeNodeCount++;
          }
        }
        if (json[i].hasOwnProperty("children")) {
          this.getLeafCountTree(json[i].children, type);
        } else {
          continue;
        }
      }
    },
    /**
     * 获取卡口树节点的数量
     */
    getLeafCountTreeBayonet(json) {
      for (let i = 0; i < json.length; i++) {
        if (json[i].hasOwnProperty("id")) {
          this.bayonetTreeNodeCount++;
        }
        if (json[i].hasOwnProperty("children")) {
          this.getLeafCountTreeBayonet(json[i].children);
        } else {
          continue;
        }
      }
    },
    // 选中的设备数量处理
    handleData() {
      this.selectDeviceArr = [...this.selectVedioArr, ...this.selectBayonetArr].filter(key => key.treeType);
      // console.log('选中的数据', this.selectDeviceArr);
    },
    /**
     * 树选择框关闭
     */
    chooseDevice() {
      this.treeTabShow = false
      console.log('选中的数据', this.selectDeviceArr)
    },
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
      
      .upload_box {
        text-align: center;
        margin-left: 10px;
        width: 160px;
        height: 160px;
        overflow: hidden;
        margin-top: 30px;
        // margin-bottom: 25px;
        /deep/ .el-upload {
          width: 160px;
          height: 160px;
          i {
            width: 120px;
            height: 110px;
            margin-top: 22px;
            margin-left: 6px;
          }
          .upload_text {
            line-height: 0;
            color: #999999;
            margin-top: -50px;
          }
          &:hover{
            background: #0C70F8;
            i {
              background-position: -228px -587px;
            }
            .upload_text {
              color: #ffffff;
            }
          }
        }
        &.hidden /deep/ .el-upload--picture-card{
          display: none!important;
        }
        /deep/ .el-upload-list__item {
          width: 160px;
          height: 160px;
        }
      }
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

