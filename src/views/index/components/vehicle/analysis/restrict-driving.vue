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
                  <div @click="clickMapSelect"><el-radio :label="2">地图选择</el-radio></div>
                </el-col>
              </el-row> 
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="areaId" v-if="selectAreaType === 1" style="margin-bottom:0">
            <el-select v-model="addForm.areaId" placeholder="请选择限行区域" style="width: 100%" multiple collapse-tags>
              <el-option-group
                v-for="group in areaDataList"
                :key="group.areaName"
                :label="group.areaName">
                <el-option
                  v-for="item in group.areaTreeList"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item v-if="selectAreaType === 2" style="margin-bottom:0" prop="selectDeviceNumber">
            <el-input v-model="selectDeviceNumber" :disabled="true">
            </el-input>
          </el-form-item>
          <el-form-item style="margin-bottom:0" prop="tailNumbers">
            <el-checkbox v-model="addForm.isTailNumberLimit" @change="handleTailNumber">按照车牌尾号限行</el-checkbox>
            <el-select v-model="addForm.tailNumbers" placeholder="请选择车牌尾号" style="width: 100%;" multiple clearable collapse-tags :disabled="disabledTailNumber">
              <el-option
                v-for="item in tailNumberOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="vehicleTypes">
            <el-checkbox v-model="addForm.isVehicleTypeLimit" @change="handleVehicleType">按照车辆类型限行</el-checkbox>
            <el-select v-model="addForm.vehicleTypes" placeholder="请选择车辆类型" style="width: 100%" multiple clearable collapse-tags :disabled="disabledVehicleType">
              <el-option
                v-for="(item, index) in vehicleTypeList"
                :key="index"
                :label="item.enumValue"
                :value="item.enumValue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="taskName" :rules="[{ required: true, message: '该项内容不可为空', trigger: 'blur' }]">
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

    <div is="mapSelector" :open="mapDialogVisible" :showTypes="'DB'" :clear="clearMapSelect" @mapSelectorEmit="mapPoint"></div>
  </div>
</template>
<script>
import { getDiciData } from '@/views/index/api/api.js';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import mapSelector from '@/components/common/mapSelector.vue';
import { formatDate, dateOrigin, objDeepCopy } from "@/utils/util.js";
import { mapXupuxian } from "@/config/config";
import { dataList } from '@/utils/data.js';
import { MapGETmonitorList } from "@/views/index/api/api.map.js";
import { addLimitTask, getLimitTaskList, updateLimitTaskStatus } from "@/views/index/api/api.judge.js";
const overStartTime = new Date().getTime() + 24 * 60 * 60 * 1000;
export default {
  components: { vlBreadcrumb, mapSelector },
  data () {
    return {
      mapDialogVisible: false,
      clearMapSelect: {},
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
      selectDeviceNumber: '已选设备0个', // 地图选择选择的设备数量
      addForm: {
        startTime: new Date(), // 开始时间
        endTime: dateOrigin(true, new Date(overStartTime)), // 结束时间
        bayonetIds: null, // 卡口
        devIds: null, // 摄像头
        areaId: [], // 区域id
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
      areaDataList: [], // 行政区域列表
      disabledTailNumber: true, // 是否禁止选择车辆尾号
      disabledVehicleType: true, // 是否禁止选择车辆类型
    }
  },
  mounted () {
    this.getVehicleTypeList();
    this.getMapGETmonitorList();

    // 获取离线任务
    this.getDataList();
  },
  methods: {
    //查询行政区域
    getMapGETmonitorList () {
      let d = {
        areaUid: mapXupuxian.adcode
      }
      MapGETmonitorList(d).then(res=>{
        if (res && res.data) {
          this.areaDataList.push(res.data);
          res.data.areaTreeList.forEach(el=>{
            this.addForm.areaId.push(el.areaId);
          })
        }
      })
    },
    // 限行区域change
    clickMapSelect () {
      this.mapDialogVisible = !this.mapDialogVisible;
    },
    // 获取地图选择的数据
    mapPoint (data) {
      console.log('data', data)
      if (data) {
        this.selectDeviceNumber = '已选设备' + (data.bayonetList.length + data.deviceList.length) + '个';
        if (data.bayonetList.length > 0) {
          this.selectBayonetArr = data.bayonetList;
        }
        if (data.deviceList.length > 0) {
          this.selectCameraArr = data.deviceList;
        }
      }
    },
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
    // 车牌尾号change
    handleTailNumber (val) {
      if (!val) {
        this.addForm.tailNumbers = [];
        this.disabledTailNumber = true;
      } else {
        this.disabledTailNumber = false;
      }
    },
    // 车牌类型change
    handleVehicleType (val) {
      if (!val) {
        this.addForm.vehicleTypes = [];
        this.disabledVehicleType = true;
      } else {
        this.disabledVehicleType = false;
      }
    },
    
    // 重置查询条件
    resetData (form) {
      this.$refs[form].resetFields();

      this.selectAreaType = 1;

      this.selectDeviceNumber = '已选设备0个';
      this.selectCameraArr = [];
      this.selectBayonetArr = [];
      this.clearMapSelect = {};

      this.addForm.isVehicleTypeLimit = false;
      this.addForm.isTailNumberLimit = false;

      this.disabledVehicleType = true;
      this.disabledTailNumber = true;

      this.$nextTick(() => {
        this.areaDataList.forEach(val => {
          val.areaTreeList.forEach(el=>{
            this.addForm.areaId.push(el.areaId);
          });
        });
      });
    },
    // 左侧查询
    searchData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {

          if (this.addForm.isTailNumberLimit) {
            if (this.addForm.tailNumbers.length <= 0) {
              if (!document.querySelector('.el-message--info')) {
                this.$message.info('请选择车牌尾号');
              }
              return;
            }
          }
          if (this.addForm.isVehicleTypeLimit) {
            if (this.addForm.vehicleTypes.length <= 0) {
              if (!document.querySelector('.el-message--info')) {
                this.$message.info('请选择车牌类型');
              }
              return;
            }
          }

          if (this.selectCameraArr && this.selectCameraArr.length > 0) {
            let cameraIds = this.selectCameraArr.map(res => res.uid);
            this.addForm.devIds = cameraIds.join(",");
          }
          if (this.selectBayonetArr && this.selectBayonetArr.length > 0) {
            let bayonentIds = this.selectBayonetArr.map(res => res.uid);
            this.addForm.bayonetIds = bayonentIds.join(",");
          }

          if (this.selectAreaType === 2) {
            if ((this.selectCameraArr && this.selectCameraArr.length <= 0) && (this.selectBayonetArr && this.selectCameraArr.length <= 0)) {
              if (!document.querySelector('.el-message--info')) {
                this.$message.info('请选择限行区域');
              }
              return;
            }
          } else {
            if (this.addForm.areaId <= 0) {
              if (!document.querySelector('.el-message--info')) {
                this.$message.info('请选择限行区域');
              }
              return;
            }
          }

          const params = {
            startTime: formatDate(this.addForm.startTime),
            endTime: formatDate(this.addForm.endTime),
            areaId: this.selectAreaType === 1 ? this.addForm.areaId.join(',') : [],
            bayonetIds: this.selectAreaType === 2 ? this.addForm.bayonetIds : null,
            devIds: this.selectAreaType === 2 ? this.addForm.devIds : null,
            vehicleTypes: this.addForm.vehicleTypes.join(','),
            tailNumbers: this.addForm.tailNumbers.join(','),
            taskName: this.addForm.taskName,
            isTailNumberLimit: this.addForm.isTailNumberLimit,
            isVehicleTypeLimit: this.addForm.isVehicleTypeLimit
          };
          console.log('params', params)
          this.isSearchLoading = true;
          addLimitTask(params)
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
          }
        })
        .catch(() => {})
    },
    // 跳至限制详情页
    skipDetailPage (obj) {
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