<template>
  <div class="th-driving-night">
    <Breadcrumb :oData="[{name: '夜间行车分析'}]"></Breadcrumb>
    <div class="the-bottom">
      <div class="the-left-search">
        <div class="con_left">

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
            <div class="no_device" v-else>选择设备</div>
            <!-- 树tab页面 -->
            <div class="device_tree_tab" v-show="treeTabShow">
              <div style="overflow: hidden;">
                <!-- <div
                  class="tab_title"
                  :class="{ 'current_title': index === selectedTreeTab }"
                  @click="selectedTreeTab = index;"
                  v-for="(item, index) in treeTabArr"
                  :key="'tab_title' + index"
                >{{ item.name }}</div> -->
              </div>
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

          <div class="left_time">
            <el-date-picker
              placeholder="请选择日期"
              v-model="queryDate"
              :clearable="false"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
              align="right"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="left_time">
            <el-select v-model="queryForm.startTime" placeholder="开始时间" style="width: 200px;">
              <el-option 
                v-for="(item, index) in startTimeOptions" 
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
              <!-- <i class="el-icon-time"></i> -->
            </el-select>
              <!-- <el-time-select
              style="width: 208px;"
                placeholder="起始时间"
                v-model="startTime"
                :picker-options="{
                  start: '19:00',
                  step: '01:00',
                  end: '24:00'
                }">
              </el-time-select> -->
            <span class="left_time_separator">-</span>
            <el-select v-model="queryForm.endTime" placeholder="结束时间" style="width: 216px;">
              <el-option 
                v-for="(item, index) in endTimeOptions" 
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <!-- <el-time-select
              placeholder="结束时间"
              class="end_time_select"
              v-model="endTime"
              :picker-options="{
                start: '01:00',
                step: '01:00',
                end: '07:00'
              }">
            </el-time-select> -->
          </div>
          <div class="left_num">
            <el-input class="left-none-border" v-model="queryForm.minShotTimes">
              <template slot="prepend">过车次数</template>
            </el-input>
            <span>次（范围2-100）</span>
          </div>
          <el-select v-model="queryForm.vehicleTypes" placeholder="请选择车辆类型" style="width: 100%;" clearable multiple>
            <el-option
              v-for="item in carTypeList"
              :key="item.enumField"
              :label="item.enumValue"
              :value="item.enumValue">
            </el-option>
          </el-select>
          <el-select v-model="queryForm.surveillanceId" placeholder="请选择布控车辆" style="width: 100%;" clearable>
            <el-option
              v-for="item in controlCarList"
              :key="item.uid"
              :label="item.name"
              :value="item.uid">
            </el-option>
          </el-select>
          <div class="left_btn">
            <el-button class="reset_btn" :loading="resetLoading" @click="onReset">重置</el-button>
            <el-button class="select_btn" :loading="searchLoading" @click="onSearch">查询</el-button>
          </div>
        </div>
      </div>
      <div class="the-right-result">
        <template v-if="dataList.length > 0">
          <el-button :loading="exportLoadingbtn" @click="onExport" class="th-button-export">导出</el-button>
          <vue-scroll>
            <div class="the-table">
              <el-table
                class="data_table" :data="dataList">
                <el-table-column label="序号" width="150px" type="index" :index="indexMethod"></el-table-column>
                <el-table-column label="车牌号码" prop="vehicleNumber" show-overflow-tooltip></el-table-column>
                <el-table-column label="车辆类型" prop="vehicleType">
                  <template slot-scope="scope">
                    <span>{{ scope.row.vehicleType }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="过车次数" prop="shotTimes"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <span class="operation_btn th-separator" @click="onOpenRecord(scope.row)">抓拍记录</span>
                    <span class="operation_btn" @click="onOpenVehicleInfo(scope.row)">车辆信息</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                class="cum_pagination"
                @current-change="onPageChange"
                :current-page.sync="pagination.pageNum"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="pagination.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="pagination.total">
              </el-pagination>
            </div>
          </vue-scroll>
        </template>
        <template v-else>
          <div class="not_content">
            <img src="../../../../../assets/img/not-content.png" alt="">
            <p style="color: #666666; margin-top: 30px;">抱歉，没有相关的结果!</p>
          </div>
        </template>
      </div>
    </div> 
  </div>
</template>
<script>
import { mapXupuxian } from "@/config/config";
import { MapGETmonitorList } from "@/views/index/api/api.map.js";
import { getNightVehicleList  }from "@/views/index/api/api.judge.js";
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
import { objDeepCopy, formatDate } from "@/utils/util.js";
import Breadcrumb from '../breadcrumb.vue';
// formatDate
export default {
  components: { Breadcrumb },
  data () {
    return {
      startTimeOptions: [
        {
          label: '19:00',
          value: 19
        },
        {
          label: '20:00',
          value: 20
        },
        {
          label: '21:00',
          value: 21
        },
        {
          label: '22:00',
          value: 22
        },
        {
          label: '23:00',
          value: 23
        },
        {
          label: '24:00',
          value: 24
        }
      ],
      endTimeOptions: [
        {
          label: '20:00',
          value: 20
        },
        {
          label: '21:00',
          value: 21
        },
        {
          label: '22:00',
          value: 22
        },
        {
          label: '23:00',
          value: 23
        },
        {
          label: '24:00',
          value: 24
        },
        {
          label: '次日01:00',
          value: 1
        },
        {
          label: '次日02:00',
          value: 2
        },
        {
          label: '次日03:00',
          value: 3
        },
        {
          label: '次日04:00',
          value: 4
        },
        {
          label: '次日05:00',
          value: 5
        },
        {
          label: '次日06:00',
          value: 6
        },
        {
          label: '次日07:00',
          value: 7
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      queryForm: {
        startDate: null,
        endDate: null,
        cameraIds: null,
        bayonetIds: null,
        startTime: 19,
        endTime: 7,
        minShotTimes: 5,
        vehicleTypes: [],
        surveillanceId: null
      },
      queryDate: [(new Date() - (24 * 60 * 60 * 1000)), (new Date() - (24 * 60 * 60 * 1000))],
      // startTime: '19:00',
      // endTime: '07:00',
      // carTypeList: [],
      controlCarList: [
        {
          uid: 0,
          name: '不限'
        }, {
          uid: 1,
          name: '布控库全部车像'
        }, {
          uid: 2,
          name: '各自定义的布控组名'
        }, {
          uid: 3,
          name: '非布控库数据'
        },
      ],
      // 选择设备的数据
      isIndeterminate: false, // 是否处于全选与全不选之间
      checkAllTree: false, // 树是否全选
      isIndeterminateBayonet: false, // 是否处于全选与全不选之间
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
      resetLoading: false,
      searchLoading: false,
      treeTabArr: [
        {
          name: "摄像头"
        },
        {
          name: "卡口"
        }
      ],
      treeTabShow: false,
      dataList: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      // currentPage: 1,
      exportLoadingbtn: false, // 导出按钮loading
      carTypeList: [], // 车辆类型列表
      searchStr: '', // 传到抓拍记录页面的数据
    }
  },
  mounted() {
    this.getVehicleTypeList();
    //获取摄像头卡口数据
    this.getMonitorList()
  },
  watch: {
    queryDate: {
      handler (val) {
        if (val && val[1] - val[0] > 2 * 24 * 60 *60 *1000) {
          this.$message.error("最大时间段为3天，超过开始时间3天（72小时）后的时间不可选择!")
          this.$set(val, 1, val[0] + 2 * 24 * 60 *60 *1000)
        }
      },
      deep: true
    }
  },
  methods: {
    // 获取车辆类型列表
    getVehicleTypeList () {
      const type = dataList.vehicleType;
      getDiciData(type)
        .then(res => {
          if (res) {
            this.carTypeList = res.data;
          }
        })
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
          // this.$nextTick(() => {
          //   this.checkAllTree = true;
          //   this.handleCheckedAll(true);
          // });
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
    onReset () {
      this.resetLoading = true
      this.queryForm = Object.assign({
        startDate: null,
        endDate: null,
        cameraIds: null,
        bayonetIds: null,
        startTime: 19,
        endTime: 7,
        minShotTimes: 5,
        vehicleTypes: [],
        surveillanceId: null
      })
      this.selectDeviceArr.splice(0, this.selectDeviceArr.length)
      this.$refs.cameraTree.setCheckedNodes([]);
      this.isIndeterminate = false
      this.isIndeterminateBayonet = false
      this.queryDate = [(new Date() - (24 * 60 * 60 * 1000)), (new Date() - (24 * 60 * 60 * 1000))];
      // this.startTime = null
      // this.endTime = null
      this.resetLoading = false
    },
    onSearch () {
      this.searchLoading = true;
      let arr = [], arr1 = [];
      this.queryForm.bayonetIds = null;
      this.queryForm.cameraIds = null;
      // if (!this.checkAllTree) {
        if (this.selectCameraArr && this.selectCameraArr.length > 0) {
          let cameraIds = this.selectCameraArr.map(res => res.id);
         this.queryForm.cameraIds = cameraIds.join(",");
        }
        if (this.selectBayonetArr && this.selectBayonetArr.length > 0) {
          let bayonentIds = this.selectBayonetArr.map(res => res.id);
          this.queryForm.bayonetIds = bayonentIds.join(",");
        }
      // }
      // this.queryForm.startTime = this.startTime && parseInt(this.startTime.substr(0, 2))
      // this.queryForm.endTime = this.endTime && parseInt(this.endTime.substr(0, 2))
      this.queryForm.startDate = this.queryDate && this.queryDate.length > 0 && formatDate(this.queryDate[0], 'yyyy-MM-dd')
      this.queryForm.endDate = this.queryDate && this.queryDate.length > 0 && formatDate(this.queryDate[1], 'yyyy-MM-dd')

      // if (this.queryForm.endTime > 7) {
      //   this.isNextDay = true;
      // }

      const params = {
        bayonetIds: this.queryForm.bayonetIds,
        cameraIds: this.queryForm.cameraIds,
        endDate: this.queryForm.endDate + ' 23:59:59',
        endhour: this.queryForm.endTime,
        startDate: this.queryForm.startDate + ' 00:00:00',
        startHour: this.queryForm.startTime,
        minShotTimes: parseInt(this.queryForm.minShotTimes),
        vehicleTypes: this.queryForm.vehicleTypes.join(':'),
        surveillanceId: this.queryForm.surveillanceId,
        isNextDay: this.queryForm.endTime && this.queryForm.endTime > 7 ? false : true,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        order: 'desc',
        // orderBy: 'shotTime'
      };

      this.searchStr = JSON.stringify(params);

      getNightVehicleList(params)
        .then(res => {
          if (res && res.data) {
            this.dataList = res.data.list;
            this.pagination.total = res.data.total;
            this.searchLoading = false;
          } else {}
          this.searchLoading = false;
        })
        .catch(() => {this.searchLoading = false;})
    },
    /**
     * 树选择框关闭
     */
    chooseDevice() {
      this.treeTabShow = false
    },
    /**
     * 导出按钮
     */
    onExport () {
      this.exportLoadingbtn = true;
    },
    /**
     * 查看抓拍记录
     */
    onOpenRecord (obj) {
      this.$router.push({name: 'vehicle_search_ycxc_record', query: {obj: this.searchStr, number: obj.vehicleNumber}});
    },
    /**
     * 查看车辆信息
     */
    onOpenVehicleInfo (obj) {
       this.$router.push({name: 'vehicle_search_clxx', query: {plateNo: obj.vehicleNumber}});
    },
    /**
     * 分页赋值
     */
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.onSearch();
    },
    /**
     * 序号数字翻页递增
     */
    indexMethod (index) {
      return index + 1 + 10 * (this.pagination.pageNum - 1);
    },
  }
}
</script>
<style lang="scss" scoped>
.th-driving-night {
  width: 100%; height: 100%;
  padding-top: 50px;
  .the-bottom {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    .the-left-search {
      width: 272px;height: 100%;
      background: #fff;
      box-shadow: 5px 0 10px #E5E7E7;
      animation: fadeInLeft .4s ease-out .3s both;
      .con_left{
        width: 272px;
        height: 100%;
        padding: 20px;
        > .left_time{
          padding-bottom: 10px;
          display: flex;
          align-items: center;
          position: relative;
          /deep/ .el-input__suffix {
            display: none;
          }
          .left_time_separator {
            color: #999;
            padding: 0 5px;
          }
          .left_time_tomorrow {
            position: absolute;
            left: 120px;
            line-height: 40px;
            z-index: 99;
            color: #333;
          }
          .el-date-editor{
            width: 100%;
          }
        }
        .el-select{
          padding-bottom: 10px;
        }
        .left_num{
          display: flex;
          padding-bottom: 10px;
          .el-input{
            width: 133px;
          }
          > span{
            margin-left: 4px;
            line-height: 40px;
            color: #999;
            font-size: 12px;
          }
        }
        .left_btn{
          padding-top: 10px;
          .select_btn, .reset_btn {
            width: 110px;
          }
          .select_btn {
            background-color: #0C70F8;
            color: #ffffff;
          }
          .reset_btn {
            background-color: #ffffff;
            color: #666666;
            border-color: #DDDDDD;
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
      }
    }
    .the-right-result {
      width: calc(100% - 285px); height: 100%;
      margin-left: 13px;
      background: #F7F9F9;
      padding: 15px 12px 25px 0;
      overflow-y: hidden;
      .th-button-export {
        float: right;
        margin-bottom: 10px;
        background:rgba(12,112,248,1);
        border-radius:4px;
        color: #ffffff;
      }
      .the-table {
        width: 100%; height: 100%;
        background: #fff;
        border-radius: 4px;
        padding: 18px 15px;
        .operation_btn {
          color: #0C70F8;
          cursor: pointer;
        }
        .th-separator:after {
          content: '丨';
          color: #F2F2F2;
          display: inline-block;
          padding: 0 2px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.the-right-result {
  .__view {
    // background: #fff;
    box-shadow: 5px 0px 16px 0px rgba(169,169,169,0.2);
  }
}
.con_left {
  .el-input__inner:hover,
  .el-input__inner:focus {
    border-color: #DCDFE6 !important;
  } 
}
.left_time {
  // .el-range-editor {
  //   padding-left: 0px;
  // }
  .el-date-editor {
    .el-input__inner {
      padding-left: 15px;
    }
    .el-range__icon {
      position: absolute;
      right: 3px;
      top: 2px;
    }
    .el-range__close-icon {
      position: absolute;
      right: 3px;
      top: 2px;
    }
  }
  .el-input__prefix {
    right: 5px;
    left: auto;
  }
  .end_time_select {
    .el-input__inner {
      padding-left: 30px;
      padding-right: 25px;
    }
  }
}
.left_num {
  .left-none-border {
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