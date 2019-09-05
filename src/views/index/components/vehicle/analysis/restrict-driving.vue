<template>
  <div class="restrict_driving">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle'}, {name: '车辆限行'}]"></div>
    </div>
    <div class="content_box">
      <div class="left">
        <el-form class="search_restrict_form" :model="addForm" ref="addForm">
          <el-form-item prop="startTime">
            <el-date-picker
              class="vl_date"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
              :picker-options="pickerDateTime"
              v-model="addForm.startTime"
              :time-arrow-control="true"
              type="datetime"
              placeholder="选择日期"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="endTime" style="margin-bottom:0">
            <el-date-picker
              class="vl_date vl_date_end"
              v-model="addForm.endTime"
              :clearable="false"
              :time-arrow-control="true"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
              :picker-options="pickerDateTime"
              type="datetime" 
              placeholder="选择日期" 
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="限行区域：" label-width="72px" class="restrict_area" style="margin-bottom:0">
            <el-radio-group v-model="selectAreaType">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-radio :label="1">列表选择</el-radio>
                </el-col>
                <el-col :span="12">
                  <el-radio :label="2">地图选择</el-radio>
                </el-col>
              </el-row> 
            </el-radio-group>
          </el-form-item>
          <!-- 选择设备 -->
          <!-- treeTabShow 为展开 -->
          <div class="selected_device_comp" v-if="treeTabShow" @click="chooseDevice"></div>
          <div class="selected_device" @click="treeTabShow = true;">
            <i v-if="treeTabShow" class="el-icon-arrow-up"></i>
            <i v-else class="el-icon-arrow-down"></i>
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
              <!-- <span>{{ selectDeviceArr[0].label }}</span>
              <span v-show="selectDeviceArr.length > 1" title="展开选中的设备" class="device_count">+{{ selectDeviceArr.length - 1 }}</span> -->
            </div>
            <!-- placeholder -->
            <div class="no_device" v-else>选择设备</div>
            <!-- 树tab页面 -->
            <div class="device_tree_tab" v-show="treeTabShow">
              <div style="overflow: hidden;"></div>
              <!-- 视频树 -->
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
          <el-form-item style="margin-bottom:0" prop="tailNumbers">
            <el-checkbox v-model="addForm.isTailNumberLimit">按照车牌尾号限行</el-checkbox>
            <el-select v-model="addForm.tailNumbers" placeholder="请选择" style="width: 100%;" multiple clearable collapse-tags>
              <el-option
                v-for="item in tailNumberOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
           <el-form-item prop="vehicleTypes">
            <el-checkbox v-model="addForm.isVehicleTypeLimit">按照车辆类型限行</el-checkbox>
            <el-select v-model="addForm.vehicleTypes" placeholder="请选择车辆类型" style="width: 100%" multiple clearable collapse-tags>
              <el-option
                v-for="(item, index) in vehicleTypeList"
                :key="index"
                :label="item.enumValue"
                :value="item.enumValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="taskName">
            <el-input placeholder="请输入任务名称" v-model="addForm.taskName" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item class="operation_button">
            <el-button class="reset_btn" @click="resetData('addForm')">重置</el-button>
            <el-button class="select_btn" type="primary" :loading="isSearchLoading" @click="searchData('addForm')">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <vue-scroll>
          <div class="search_box">
            <el-form :inline="true" :model="searchForm" class="event_form" ref="searchForm">
              <el-form-item label="任务名称:" prop="taskName">
                <el-input
                  style="width: 230px;"
                  type="text"
                  placeholder="请输入任务名称"
                  v-model="searchForm.taskName"
                />
              </el-form-item>
              <el-form-item label="创建时间:" prop="reportTime">
                <el-date-picker
                  class="vl_date"
                  v-model="searchForm.reportTime"
                  type="datetimerange"
                  :time-arrow-control="true"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="selectDataList">查询</el-button>
                <el-button @click="resetForm('searchForm')">重置</el-button>
              </el-form-item>
            </el-form>
            <div class="divide"></div>
          </div>
          <div class="table_box">
            <el-table :data="dataList">
              <el-table-column label="序号" type="index" width="100"></el-table-column>
              <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip></el-table-column>
              <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
              <el-table-column label="分析时间范围" prop="startTime" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.startTime}} - {{scope.row.endTime}}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" prop="taskStatus" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.taskStatus && scope.row.taskStatus === 1 ? '进行中' : scope.row.taskStatus === 4 ? '待开始' :  scope.row.taskStatus === 2 ? '已结束' : '-'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="200px">
                <template slot-scope="scope">
                  <span
                    class="operation_btn"
                    v-if="scope.row.taskStatus !== 4"
                    @click="skipDetailPage(scope.row)"
                  >查看</span>
                  <span
                    class="operation_btn"
                    v-if="scope.row.taskStatus === 4"
                    @click="showCancelDialog(scope.row)"
                  >取消</span>
                  <span
                    class="operation_btn"
                    v-if="scope.row.taskStatus === 1"
                    @click="showEndTaskDialog(scope.row)"
                  >结束</span>
                </template>
              </el-table-column>
            </el-table>
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
        </vue-scroll>
      </div>
    </div>
    <!--取消任务弹出框-->
    <el-dialog
      title="取消任务确认"
      :visible.sync="cancelDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">确定取消后，该任务将从列表中消失，不会被执行。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isChangeStatusLoading" @click="changeTaskStatus(3)">确认</el-button>
      </div>
    </el-dialog>
    <!--结束任务弹出框-->
    <el-dialog
      title="结束任务确认"
      :visible.sync="endDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">确定结束后，进行中的车辆限号抓拍任务将立即结束。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="endDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isChangeStatusLoading" @click="changeTaskStatus(2)">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDiciData } from '@/views/index/api/api.js';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import { formatDate, dateOrigin, objDeepCopy } from "@/utils/util.js";
import { mapXupuxian } from "@/config/config";
import { dataList } from '@/utils/data.js';
import { MapGETmonitorList } from "@/views/index/api/api.map.js";
import { addLimitTask, getLimitTaskList, updateLimitTaskStatus } from "@/views/index/api/api.judge.js";
const overStartTime = new Date().getTime() + 24 * 60 * 60 * 1000;
export default {
  components: { vlBreadcrumb },
  data () {
    return {
      cancelDialog: false, // 取消任务弹出框
      isChangeStatusLoading: false, // 取消--结束任务加载中
      endDialog: false, // 结束任务弹出框
      tailNumberOptions: [0,1,2,3,4,5,6,7,8,9], // 车辆尾号列表
      // 选择设备的数据
      isIndeterminate: false, // 是否处于全选与全不选之间
      checkAllTree: false, // 树是否全选
      // isIndeterminateBayonet: false, // 是否处于全选与全不选之间
      checkAllTreeBayonet: false, // 树是否全选
      cameraTree: [],
      videoTreeNodeCount: 0, // 摄像头节点数量
      defaultProps: {
        children: "children",
        label: "label"
      },
      selectDeviceArr: [], // 选中的设备数组
      selectVedioArr: [], // 选中的摄像头数组
      selectBayonetArr: [], // 选中的卡口数组
      selectedTreeTab: 0, // 当前选中的
      treeTabShow: false,
      selectAreaType: 1, // 限行区域选择方式
      isSearchLoading: false,
      addForm: {
        startTime: new Date(), // 开始时间
        endTime: dateOrigin(true, new Date(overStartTime)), // 结束时间
        bayonetIds: null, // 卡口
        devIds: null, // 摄像头
        isTailNumberLimit: false, // 是否按车牌尾号限行
        isVehicleTypeLimit: false, // 是否按车辆类型限行
        tailNumbers: [], // 车牌尾号
        taskName: null, // 任务名
        vehicleTypes: [], // 车辆类型
      },
      pickerDateTime: {
        disabledDate (time) {
          return time.getTime() < (new Date().getTime() - 24 * 3600 * 1000);
        }
      },
      searchForm: {
        reportTime: [], // 日期
        taskName: null // 任务名称
      },
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      dataList: [],
      vehicleTypeList: [], // 车辆类型列表
      operateTaskId: null, // 要操作的任务id
    }
  },
  mounted () {
    this.getVehicleTypeList();
    this.getMonitorList();

    // 获取离线任务
    this.getDataList();
  },
  methods: {
    // 获取车辆类型列表
    getVehicleTypeList () {
      const type = dataList.vehicleType;
      getDiciData(type)
        .then(res => {
          if (res) {
            this.vehicleTypeList = res.data;
          }
        })
    },
    //获取摄像头卡口信息列表
    getMonitorList() {
      let params = {
        areaUid: mapXupuxian.adcode
      };
      this.videoTreeNodeCount = 0;
      this.selectDeviceArr = [];
      this.selectCameraArr = [];
      this.selectBayonetArr = [];

      MapGETmonitorList(params).then(res => {
        if (res && res.data) {
          let camera = objDeepCopy(res.data.areaTreeList);
          this.cameraTree = this.getTreeList(camera);
          this.getLeafCountTree(this.cameraTree);

            
          this.$nextTick(() => {
            this.checkAllTree = true;
            this.handleCheckedAll(true);
          });
        }
      });
    },
    getLeafCountTree(json) {
      // console.log('json', json)
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
      // console.log('videoTreeNodeCount', this.videoTreeNodeCount)
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
    // tab的方法
    chooseDevice() {
      // 选择了树的设备
      this.treeTabShow = false;
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
    //摄像头
    listenChecked(val, val1) {
      console.log('val1', val1);
      
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
    // 重置查询条件
    resetData (form) {
      this.$refs[form].resetFields();

      this.addForm.isVehicleTypeLimit = false;
      this.addForm.isTailNumberLimit = false;

      this.$nextTick(() => {
        this.checkAllTree = true;
        this.handleCheckedAll(true);

      });
    },
    // 左侧查询
    searchData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          console.log(this.addForm)
           if (this.selectCameraArr && this.selectCameraArr.length > 0) {
            let cameraIds = this.selectCameraArr.map(res => res.id);
            this.addForm.devIds = cameraIds.join(",");
          }
          if (this.selectBayonetArr && this.selectBayonetArr.length > 0) {
            let bayonentIds = this.selectBayonetArr.map(res => res.id);
            this.addForm.bayonetIds = bayonentIds.join(",");
          }

          const params = {
            startTime: formatDate(this.addForm.startTime),
            endTime: formatDate(this.addForm.endTime),
            bayonetIds: this.addForm.bayonetIds,
            devIds: this.addForm.devIds,
            vehicleTypes: this.addForm.vehicleTypes.join(','),
            tailNumbers: this.addForm.tailNumbers.join(','),
            taskName: this.addForm.taskName,
            isTailNumberLimit: this.addForm.isTailNumberLimit,
            isVehicleTypeLimit: this.addForm.isVehicleTypeLimit
          };

          this.isSearchLoading = true;
          addLimitTask(this.addForm)
            .then(res => {
              if (res && res.data) {
                this.$message({
                  type: 'success',
                  message: '新建任务成功',
                  customClass: 'request_tip'
                });
                this.getDataList();
                this.isSearchLoading = false;
              } else {
                this.isSearchLoading = false;
              }
            })
            .catch(() => {this.isSearchLoading = false;})
        }
      })
    },
    // 获取离线任务
    getDataList () {
      if (!this.searchForm.reportTime) {
        this.searchForm.reportTime = [];
      }
      const params = {
        'where.taskName': this.searchForm.taskName,
        'where.taskType': 10, // 10：车辆限行
        'where.startTime': this.searchForm.reportTime[0],
        'where.endTime': this.searchForm.reportTime[1],
        // 'where.isFinish': this.selectIndex,   //是否完成 0:未完成(包含处理中、处理失败、处理中断) 1：已完成(处理成功)
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        order: 'desc',
        orderBy: 'create_time'
      };
      getLimitTaskList(params)
        .then(res => {
          if (res && res.data) {
            this.dataList = res.data.list;
            this.pagination.total = res.data.total;
            // this.dataList.map(item => {
            //   item.taskWebParam = JSON.parse(item.taskWebParam);
            // })
          }
        })
        .catch(() => {})
    },
    // 跳至限制详情页
    skipDetailPage (obj) {
      console.log(obj)
      let queryObj = JSON.stringify(obj);
      this.$router.push({name: 'vehicle_restrict_detail', query: {queryObj: queryObj}});
    },
    // 显示取消任务弹出框
    showCancelDialog (obj) {
      this.cancelDialog = true;
      this.operateTaskId = obj.uid;
    },
    // 显示结束任务弹出框
    showEndTaskDialog (obj) {
      this.endDialog = true;
      this.operateTaskId = obj.uid;
    },
    // 改变任务状态
    changeTaskStatus (status) {
      if (this.operateTaskId) {
        const params = {
          uid: this.operateTaskId,
          taskStatus: status  // 1--进行中  2--已结束 3-- 删除（取消）4---待开始
        };
        this.isChangeStatusLoading = true;
        updateLimitTaskStatus(params)
          .then(res => {
            if (res.data) {
              let message = status === 3 ? '取消成功': '结束成功';
              this.$message({
                type: 'success',
                message,
                customClass: 'request_tip'
              });
              this.getDataList();
              this.isChangeStatusLoading = false;
              if (status === 3) {
                this.cancelDialog = false;
              } else {
                this.endDialog = false;
              }
            } else {
              this.isChangeStatusLoading = false;
            }
          })
          .catch(() => {this.isChangeStatusLoading = false;})
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
    }
  }
}
</script>
<style lang="scss" scoped>
.restrict_driving {
  width: 100%;
  height: 100%;
  padding-top: 50px;
  .vc_gcck_bd {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 50px; line-height: 50px;
  }
  .content_box {
    display: flex;
    width: 100%;
    height: 100%;
    .left {
      width: 272px;
      height: 100%;
      background: #fff;
      box-shadow: 5px 0 10px #E5E7E7;
      animation: fadeInLeft .4s ease-out .3s both;
      padding: 20px 15px; 
    }
    .right {
      width: calc(100% - 272px);
      height: calc(100% - 50px);
      margin: 20px;
      background: #ffffff;
      box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
      .search_box {
        margin: 20px;
        .divide {
          border: 1px dashed #fafafa;
        }
      }
      .table_box {
        margin: 0 20px;
        .add_btn {
          margin-bottom: 10px;
        }
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
</style>
<style lang="scss">
.search_restrict_form {
  // 选择设备下拉
  .selected_device {
    // margin-bottom: 10px;
    position: relative;
    width: 245px;
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
      color: #999999;
    }
    // 树tab
    .device_tree_tab {
      position: absolute;
      top: 50px;
      left: -1px;
      z-index: 100;
      background: #fff;
      width: 245px;
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
  .el-checkbox__label {
    color: #999999;
    font-size: 12px;
  }
  .el-radio__label {
    padding-left: 5px;
  }
  .restrict_area {
    .el-form-item__label {
      padding: 0;
      text-align: left;
    }
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .operation_button {
    margin-top: 20px;
  }
  .reset_btn, .select_btn {
    width: 110px;
  }
}
</style>