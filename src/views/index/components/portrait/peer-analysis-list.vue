<template>
  <vue-scroll>
    <div class="frequent-appearances">
      <div class="th-breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/portrait/menu' }">人像侦查</el-breadcrumb-item>
          <el-breadcrumb-item>同行分析</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="vl_j_left">
        <!--<div class="ytsr_left_radio">-->
          <!--<span>查询方式：</span>-->
          <!--<span>-->
            <!--<el-radio v-model="taskType" label="1">在线查询</el-radio>-->
            <!--<el-radio v-model="taskType" label="2">离线任务</el-radio>-->
          <!--</span> -->
        <!--</div>-->
        <div  class="ytsr_left_radio">
          <span>任务名称：</span>
          <span style="padding-right: 20px">
          <el-input v-model="taskName" placeholder="请输入任务名称" maxlength="20"></el-input>
        </span>
        </div>
        <div class="vl_jtc_img_box">
          <div style="margin-left: 17px;" class="vl_judge_tc_c_item"  @drop="drop($event)" @dragover="allowDrop($event)">
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
              <img v-else-if="curImageUrl" :src="curImageUrl">
              <div v-else>
                <i
                        style="width: 100px;height: 85px;opacity: .5; position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto;"
                        class="vl_icon vl_icon_vehicle_01"
                ></i>
                <span>点击上传图片</span>
              </div>
            </el-upload>
            <div v-show="curImageUrl" class="del_icon">
              <i class="el-icon-delete" @click="delPic()"></i>
            </div>
            <p @click="showHistoryPic">从上传记录中选择</p>
          </div>
        </div>
        <div class="per_semblance_ytsr"><span>同行次数：</span><el-input oninput="value=value.replace(/[^0-9.]/g,''); if(value >= 100)value = 100; if(value&&value <2)value = 2;" placeholder="填写同行次数" v-model="searchData.minSemblance"></el-input>(2-100)</div>
        <!--查询范围-->
        <div class="ytsr_left_search">
          <div class="left_time">
            <el-date-picker
                    v-model="searchData.startTime"
                    style="width: 100%;margin-bottom: 20px;"
                    class="vl_date"
                    type="datetime"
                    :time-arrow-control="true"
                    @change="chooseStartTime"
                    value-format="timestamp"
                    placeholder="选择日期时间">
            </el-date-picker>
            <el-date-picker
                    style="width: 100%;"
                    class="vl_date vl_date_end"
                    v-model="searchData.endTime"
                    @change="chooseEndTime"
                    :time-arrow-control="true"
                    value-format="timestamp"
                    type="datetime"
                    placeholder="选择日期时间">
            </el-date-picker>
          </div>
          <!-- 设备搜索 -->
          <div class="device-comp">
            <div class="selected_device_comp" v-if="treeTabShow" @click="chooseDevice"></div>
            <div class="selected_device" @click="treeTabShow = true;">
              <i class="el-icon-arrow-down"></i>
              <!-- <i class="el-icon-arrow-up"></i> -->
              <div class="device_list" v-if="selectDeviceArr.length > 0">
                <template v-if="checkAllTree">
                  <span>全部设备</span>
                </template>
                <template v-else>
                  <span>{{ selectDeviceArr[0].label }}</span>
                  <span
                          v-show="selectDeviceArr.length > 1"
                          title="展开选中的设备"
                          class="device_count"
                  >+{{ selectDeviceArr.length - 1 }}</span>
                </template>
              </div>
              <div class="no_device" v-else>选择设备</div>
              <!-- 树tab页面 -->
              <div class="device_tree_tab" v-show="treeTabShow">
                <div style="overflow: hidden;">
                </div>
                <!-- 摄像头树 -->
                <div class="tree_content">
                  <vue-scroll>
                    <div class="checked_all">
                      <el-checkbox
                              :indeterminate="isIndeterminate"
                              v-model="checkAllTree"
                              @change="handleCheckedAll"
                      >全选</el-checkbox>
                    </div>
                    <el-tree
                            @check="listenChecked"
                            :data="cameraTree"
                            show-checkbox
                            default-expand-all
                            node-key="label"
                            ref="cameraTree"
                            highlight-current
                            :props="defaultProps"
                    ></el-tree>
                  </vue-scroll>
                </div>
              </div>
            </div>
            <p class="error-tip" :class="{'is-show': isDeviceTrue}">{{messageDevTip}}</p>
          </div>
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
                <el-table-column label="同行次数" prop="taskWebParam.number" show-overflow-tooltip></el-table-column>
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
      </div>
      <!--历史记录弹窗-->
      <el-dialog
              :visible.sync="historyPicDialog"
              class="history-pic-dialog"
              :close-on-click-modal="false"
              top="4vh"
              title="最近上传的图片">
        <div style="text-align: center;font-size: 20px;" v-if="loadingHis"><i class="el-icon-loading"></i></div>
        <vue-scroll class="his-pic-box" v-else-if="historyPicList.length">
          <div class="his-pic-item" :class="{'active': item.checked}" v-for="item in historyPicList" :key="item.id" @click="chooseHisPic(item)">
            <img :src="item.path" alt="">
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
    </div>
  </vue-scroll>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { getTaskInfosPage, putAnalysisTask, putTaskInfosResume, postPeopleTask } from '@/views/index/api/api.analysis.js';
import {JtcPUTAppendixsOrder, JtcPOSTAppendixInfo, JtcGETAppendixInfoList,  getShotDevice, getTailBehindList } from '../../api/api.judge'
import { ajaxCtx, mapXupuxian } from '@/config/config.js';
import { MapGETmonitorList } from "@/views/index/api/api.map.js";
import { objDeepCopy, formatDate } from "@/utils/util.js";
import vlUpload from "@/components/common/upload.vue";
export default {
  components: { vlUpload },
  data() {
    return {
      messageDevTip: "",
      cameraTree: [],
      isDeviceTrue: false,
      taskName: '', // 左侧输入任务名称
      uploading: false,
      uploadAcion: ajaxCtx.base + '/new',
      searching: false,
      curImageUrl: '', // 当前上传的图片
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
      addTaskDialog: false,
      isAddLoading: false,
      fileList: [], // 图片上传列表
      dialogImageUrl: null,
      curImageUrl: null,
      uploadUrl: ajaxCtx.base + '/new', // 图片上传地址
      addData: {
        taskName: null,
        deviceId: null,
        startTime: null,
        endTime: null,
        number: 5,
        targetPicUrl: null
      },
      taskTime: [new Date((new Date() - (24 * 60 * 60 * 1000))), new Date()],
      // 选择设备的数据
      isIndeterminate: false, // 是否处于全选与全不选之间
      checkAllTree: false, // 树是否全选
      isIndeterminateBayonet: false, // 是否处于全选与全不选之间
      checkAllTreeBayonet: false, // 树是否全选
      bayonetTree: [], // 卡口树
      cameraTree: [],
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
  computed: {
    choosedHisPic () {
      return this.historyPicList.filter(x => x.checked)
    }
  },
  mounted() {
    //获取摄像头卡口数据
    this.setDTime();
    this.getDataList();
    this.getMonitorList();
  },
  methods: {
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
    handleError () {
      this.uploading = false;
      this.$message.error('上传失败')
    },
    showHistoryPic () {
      this.loadingHis = true;
      this.historyPicDialog = true;
      let params = {
        userId: this.$store.state.loginUser.uid,
        fileType: 1
      }
      JtcGETAppendixInfoList(params).then(res => {
        if (res) {
          this.loadingHis = false;
          res.data.forEach(x => x.checked = false);
          this.historyPicList = res.data;
        }
      }).catch(() => {
        this.historyPicDialog = false;
      })
    },
    chooseHisPic (item) {
      this.historyPicList.forEach(x => x.checked = false)
      item.checked = true;
    },
    addHisToImg () {
      this.historyPicDialog = false;
      let _ids = [];
      this.choosedHisPic.forEach(x => {
        _ids.push(x.uid)
        this.imgList = x;
        this.curImageUrl = x.path;
      })
      let _obj = {
        appendixInfoIds: _ids.join(',')
      }
      JtcPUTAppendixsOrder(_obj);
    },
    // 上传图片
    uploadPicExceed () {
      this.$message.warning('当前限制选择 3 个文件，请删除后再上传！');
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
          this.imgList = x;
          this.curImageUrl = x.path;
        }
      }
      console.log(fileList)
    },
    //获取摄像头卡口信息列表
    getMonitorList() {
      let params = {
        areaUid: mapXupuxian.adcode
      };
      MapGETmonitorList(params).then(res => {
        if (res && res.data) {
          let camera = objDeepCopy(res.data.areaTreeList);
          /* let bayonet = objDeepCopy(res.data.areaTreeList); */
          this.cameraTree = this.getTreeList(camera);
          /* this.bayonetTree = this.getBayTreeList(bayonet); */
          this.getLeafCountTree(this.cameraTree);
          /* this.getLeafCountTree(this.cameraTree, 'camera');
          this.getLeafCountTree(this.bayonetTree, 'bayonet'); */
          this.$nextTick(() => {
            this.checkAllTree = true;
            this.handleCheckedAll(true);
          });
        }
      });
    },
    //获取摄像头数据
    getTreeList(data) {
      for (let item of data) {
        item["id"] = item.areaId;
        item["label"] = item.areaName;
        let children = [],
            deviceBasic = [],
            bayonet = [];
        if (item.deviceBasicList && item.deviceBasicList.length > 0) {
          deviceBasic = item.deviceBasicList;
          for (let key of deviceBasic) {
            key["label"] = key.deviceName;
            key["id"] = key.uid;
            key["treeType"] = 1;
          }
          delete item.deviceBasicList;
        }
        if (item.bayonetList && item.bayonetList.length > 0) {
          bayonet = item.bayonetList;
          for (let key of bayonet) {
            key["label"] = key.bayonetName;
            key["id"] = key.uid;
            key["treeType"] = 2;
          }
          delete item.bayonetList;
        }
        children.push(...deviceBasic, ...bayonet);
        item["children"] = children;
      }
      return data;
    },
    //获取卡口数据
    // tab的方法
    chooseDevice() {
      // 选择了树的设备
      this.treeTabShow = false;
      if(this.selectDeviceArr &&
          this.selectDeviceArr.length > 0) {
        this.isDeviceTrue = false;
        this.messageDevTip = "";
      }else {
        this.isDeviceTrue = true;
        this.messageDevTip = "请选择设备";
      }
    },
    // 处理摄像头树全选时间
    handleCheckedAll(val) {
      this.isIndeterminate = false;
      if (val) {
        this.$refs.cameraTree.setCheckedNodes(this.cameraTree);
      } else {
        this.$refs.cameraTree.setCheckedNodes([]);
      }
      this.selectDeviceArr = this.$refs.cameraTree.getCheckedNodes(true);
      this.handleData();
    },
    getLeafCountTree(json) {
      // 获取树节点的数量
      for (let i = 0; i < json.length; i++) {
        if (json[i].hasOwnProperty("id")) {
          this.videoTreeNodeCount++;
        }
        if (json[i].hasOwnProperty("children")) {
          this.getLeafCountTree(json[i].children);
        } else {
          continue;
        }
      }
      console.log('videoTreeNodeCount', this.videoTreeNodeCount)
    },
    //摄像头
    listenChecked(val, val1) {
      this.selectDeviceArr = this.$refs.cameraTree.getCheckedNodes(true);
      this.handleData();
      if (val1.checkedNodes.length === this.videoTreeNodeCount) {
        this.isIndeterminate = false;
        this.checkAllTree = true;
      } else if (
          val1.checkedNodes.length < this.videoTreeNodeCount &&
          val1.checkedNodes.length > 0
      ) {
        this.checkAllTree = false;
        this.isIndeterminate = true;
      } else if (val1.checkedNodes.length === 0) {
        this.checkAllTree = false;
        this.isIndeterminate = false;
      }
    },
    // 选中的设备数量处理
    handleData() {
      /* this.selectDeviceArr = [...this.selectCameraArr, ...this.selectBayonetArr].filter(key => key.treeType); */
      this.selectDeviceArr = [...this.selectDeviceArr].filter(
          key => key.treeType
      );
      this.selectCameraArr = [...this.selectDeviceArr].filter(
          key => key.treeType === 1
      );
      this.selectBayonetArr = [...this.selectDeviceArr].filter(
          key => key.treeType === 2
      );
      console.log(
          "选中的数据",
          this.selectDeviceArr,
          this.selectBayonetArr,
          this.selectCameraArr
      );
    },
    resetSearch () {
      this.taskName = '';
      this.searchData.minSemblance = 5;
      this.imgList = '';
      this.curImageUrl = '';
      this.$nextTick(() => {
        this.checkAllTree = true;
        this.handleCheckedAll(true);
      });
      this.setDTime();
    },
    tcDiscuss (boolean) {
      let params = {
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
      params['deviceId'] = this.selectCameraArr.map(res => res.id).join(',');
      params['bayonetIds'] = this.selectBayonetArr.map(res => res.id).join(',');
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
            this.getDataList()
            console.log(res.data)
          }
        })
      }
    },
    // 时间选择change
    handleDateTime (val) {
      if (val) {
        if ( (new Date(val[1]).getTime() - new Date(val[0]).getTime()) >= 3* 24 * 3600 * 1000) {
          this.$message.warning('最多选择3天')
          this.taskTime = [new Date((new Date() - (24 * 60 * 60 * 1000))), new Date()]
        }
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
      this.getDataList();
    },
    skipResultPage (obj) {
      this.$router.push({name: 'peer_analysis_result', query: {uid: obj.uid}})
    },
    // 删除图片
    // eslint-disable-next-line no-unused-vars
    handleRemove (file, fileList) {
      this.dialogImageUrl = null
    },
    uploadEmit(data) {
      if (data && data.path) {
        this.curImageUrl = data.path;
      } else {
        this.curImageUrl = "";
      }
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
  }
};
</script>
<style lang="scss" scoped>
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
  .vl_j_left {
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
      border-bottom: 1px solid #D3D3D3;
      padding-bottom: 30px;
      margin-bottom: 30px;
      .vl_judge_tc_c_item {
        width: 238px;
        height: 238px;
        display: inline-block;
        position: relative;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        cursor: pointer;
        background: #f2f2f2;
        span {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin-top: 119px;
          line-height: 119px;
          color: #999;
        }
        &:hover span {
          color: #fff;
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
            background: none;
            line-height: 238px;
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
    .vl_jtc_search {
      width: 100%;
      height: auto;
      padding: 30px 0 20px 0;
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
      padding-left: 20px;
      margin: 20px 0;
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
    .ytsr_left_search {
      margin-left: 20px;
      width: 232px;
      .el-select {
        width: 100%;
      }
      .left_time {
        width: 100%;
        margin: 20px 0;
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
        width: 185px;
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

