<template>
  <div class="th-driving-night">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle'}, {name: '夜间行车分析'}]"></div>
    </div>
    <!-- <Breadcrumb :oData="[{name: '夜间行车分析'}]"></Breadcrumb> -->
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

          <div class="left_time date-comp">
            <el-date-picker
              placeholder="请选择日期"
              v-model="queryDate"
              :clearable="false"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="left_time">
            <el-select v-model="queryForm.startTime" placeholder="开始时间" style="width: 216px;" @change="handleChangeStartTime">
              <el-option 
                v-for="(item, index) in startTimeOptions" 
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
            <span class="left_time_separator">-</span>
            <el-select v-model="queryForm.endTime" placeholder="结束时间" style="width: 216px;">
              <el-option 
                v-for="(item, index) in endTimeOptions" 
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </div>
          <div class="left_num">
            <el-input class="left-none-border" v-model="queryForm.minShotTimes" @blur="handleBlurShotTimes">
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
          <el-select v-model="queryForm.surveillanceIds" placeholder="请选择布控车辆" style="width: 100%;" clearable multiple>
            <el-option
              v-for="item in controlVehicleList"
              :key="item.uid"
              :label="item.groupName"
              :value="item.uid">
            </el-option>
          </el-select>
          <div class="left_btn">
            <el-button class="reset_btn" :loading="resetLoading" @click="onReset">重置</el-button>
            <el-button class="select_btn" type="primary" :loading="searchLoading" @click="onSearch">查询</el-button>
          </div>
        </div>
      </div>
      <div class="the-right-result">
        <template v-if="dataList.length > 0">
          <el-button :loading="exportLoadingbtn" type="primary" @click="onExport" class="th-button-export">导出</el-button>
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
          <div is="noResult" :isInitPage="isInitPage"></div>
        </template>
      </div>
    </div> 
  </div>
</template>
<script>
import { mapXupuxian } from "@/config/config";
import { MapGETmonitorList } from "@/views/index/api/api.map.js";
import { getNightVehicleList, exportNightVehicle } from "@/views/index/api/api.judge.js";
import { getGroupListIsVehicle } from '@/views/index/api/api.control.js';
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
import { objDeepCopy, formatDate, autoDownloadUrl } from "@/utils/util.js";
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import noResult from '@/components/common/noResult.vue';
export default {
  components: { vlBreadcrumb, noResult },
  data () {
    return {
      isInitPage: false, // 是否是初始化页面  因为初始化的时候就调了接口
      startTimeOptions: [
        {
          label: '19:00',
          value: 19,
          disabled: false
        },
        {
          label: '20:00',
          value: 20,
          disabled: false
        },
        {
          label: '21:00',
          value: 21,
          disabled: false
        },
        {
          label: '22:00',
          value: 22,
          disabled: false
        },
        {
          label: '23:00',
          value: 23,
          disabled: false
        },
        {
          label: '24:00',
          value: 24,
          disabled: false
        },
        {
          label: '次日01:00',
          value: 1,
          disabled: false
        },
        {
          label: '次日02:00',
          value: 2,
          disabled: false
        },
        {
          label: '次日03:00',
          value: 3,
          disabled: false
        },
        {
          label: '次日04:00',
          value: 4,
          disabled: false
        },
        {
          label: '次日05:00',
          value: 5,
          disabled: false
        },
        {
          label: '次日06:00',
          value: 6,
          disabled: false
        }
      ],
      endTimeOptions: [
        {
          label: '20:00',
          value: 20,
          disabled: false
        },
        {
          label: '21:00',
          value: 21,
          disabled: false
        },
        {
          label: '22:00',
          value: 22,
          disabled: false
        },
        {
          label: '23:00',
          value: 23,
          disabled: false
        },
        {
          label: '24:00',
          value: 24,
          disabled: false
        },
        {
          label: '次日01:00',
          value: 1,
          disabled: false
        },
        {
          label: '次日02:00',
          value: 2,
          disabled: false
        },
        {
          label: '次日03:00',
          value: 3,
          disabled: false
        },
        {
          label: '次日04:00',
          value: 4,
          disabled: false
        },
        {
          label: '次日05:00',
          value: 5,
          disabled: false
        },
        {
          label: '次日06:00',
          value: 6,
          disabled: false
        },
        {
          label: '次日07:00',
          value: 7,
          disabled: false
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
        surveillanceIds: []
      },
      queryDate: [(new Date() - (24 * 60 * 60 * 1000)), (new Date() - (24 * 60 * 60 * 1000))],
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
      resetLoading: false,
      searchLoading: false,
      treeTabShow: false,
      dataList: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      exportLoadingbtn: false, // 导出按钮loading
      carTypeList: [], // 车辆类型列表
      controlVehicleList: [], // 布控车辆列表
      searchStr: {}, // 传到抓拍记录页面的数据
    }
  },
  created () {
    if (this.$route.params.startDate) {
      this.handleQueryData();
    }
  },
  mounted() {
    this.getVehicleTypeList();
    this.getControlVehicleList();
    //获取摄像头卡口数据
    this.getMonitorList();

    setTimeout(() => {
      this.handleSubmitData();
    }, 1000)
  },
  watch: {
    queryDate: {
      handler (val) {
        if (val && val[1] - val[0] > 2 * 24 * 60 *60 *1000) {
          this.$message.error("最多选择3天")
          this.$set(val, 1, val[0] + 2 * 24 * 60 *60 *1000)
        }
      },
      deep: true
    }
  },
  methods: {
    handleQueryData () {
      // const cameraIds = this.$route.params.cameraIds.split(',');
      // const bayonetIds = this.$route.params.bayonetIds.split(',');
      const startDate = this.$route.params.startDate.split(' ');
      const endDate = this.$route.params.endDate.split(' ');

      const startTime = this.$route.params.startHour;
      const endTime = this.$route.params.endhour;
      const minShotTimes = this.$route.params.minShotTimes;
      const surveillanceIds = this.$route.params.surveillanceIds && this.$route.params.surveillanceIds.split(',');
      const vehicleTypes =  this.$route.params.vehicleTypes && this.$route.params.vehicleTypes.split(',');

      this.queryForm.startDate = startDate;
      this.queryForm.endDate = endDate;
      this.queryForm.startTime = startTime;
      this.queryForm.endTime = endTime;
      this.queryForm.minShotTimes = minShotTimes;
      this.queryForm.surveillanceIds = surveillanceIds;
      this.queryForm.vehicleTypes = vehicleTypes;

    },
    // 获取布控车辆
    getControlVehicleList () {
      getGroupListIsVehicle()
        .then(res => {
          if (res && res.data) {
            res.data.map(item => {
              if (item.uid) {
                this.controlVehicleList.push(item);
              }
            });
          }
        })
    },
    // 获取车辆类型列表
    getVehicleTypeList () {
      const type = dataList.vehicleType;
      getDiciData(type)
        .then(res => {
          if (res && res.data) {
            this.carTypeList = res.data;
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

          console.log('mmmm', this.$route.params.cameraIds)
          if (this.$route.params.cameraIds || this.$route.params.bayonetIds) {
            console.log('asdasdasdasddddddddddddddddddddddds')
            const cameraIds = this.$route.params.cameraIds.split(',');
            const bayonetIds = this.$route.params.bayonetIds.split(',');

            let arr = [], arrNodes = [];

            this.cameraTree.map((item, index) => {
              item.children.length > 0 && item.children.map((val, idx) => {
                if (val.treeType === 1) {
                  for(let i = 0; i < cameraIds.length; i ++) {
                    if (val.id === cameraIds[i]) {
                      arr.push(val.label);
                      this.$refs.cameraTree.setCheckedKeys(arr);
                      this.$refs.cameraTree.setCheckedNodes(arr);
                    }
                  }
                }
                if (val.treeType === 2) {
                  for(let i = 0; i < bayonetIds.length; i ++) {
                    if (val.id === bayonetIds[i]) {
                      arr.push(val.label);
                      this.$refs.cameraTree.setCheckedKeys(arr);
                      this.$refs.cameraTree.setCheckedNodes(arr);
                    }
                  }
                }
              })
            })

            setTimeout(() => {
              let checkedKeys = this.$refs.cameraTree.getCheckedKeys(true);
              this.selectDeviceArr = this.$refs.cameraTree.getCheckedNodes(true);

              this.handleData();

              if (this.selectDeviceArr.length === this.videoTreeNodeCount) {
                this.checkAllTree = true;
                this.isIndeterminate = false;
              } else if (this.selectDeviceArr.length > 0 && this.selectDeviceArr.length < this.videoTreeNodeCount) {
                this.checkAllTree = false;
                this.isIndeterminate = true;
              } else if (this.selectDeviceArr.length === 0) {
                this.checkAllTree = false;
                this.isIndeterminate = false;
              }
            }, 500)

          } else {
            
            this.$nextTick(() => {
              this.checkAllTree = true;
              this.handleCheckedAll(true);
            });
          }
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
        surveillanceIds: []
      })
      
      this.$route.params == {};

      this.queryDate = [(new Date() - (24 * 60 * 60 * 1000)), (new Date() - (24 * 60 * 60 * 1000))];
      this.resetLoading = false;

      this.$nextTick(() => {
        this.checkAllTree = true;
        this.handleCheckedAll(true);

        this.handleSubmitData();
      });

    },
    onSearch () {
      this.searchLoading = true;
      this.handleSubmitData();
    },
    handleSubmitData () {
      this.queryForm.bayonetIds = null;
      this.queryForm.cameraIds = null;

      if (this.selectCameraArr && this.selectCameraArr.length > 0) {
        let cameraIds = this.selectCameraArr.map(res => res.id);
        this.queryForm.cameraIds = cameraIds.join(",");
      }
      if (this.selectBayonetArr && this.selectBayonetArr.length > 0) {
        let bayonentIds = this.selectBayonetArr.map(res => res.id);
        this.queryForm.bayonetIds = bayonentIds.join(",");
      }

      this.queryForm.startDate = this.queryDate && this.queryDate.length > 0 && formatDate(this.queryDate[0], 'yyyy-MM-dd')
      this.queryForm.endDate = this.queryDate && this.queryDate.length > 0 && formatDate(this.queryDate[1], 'yyyy-MM-dd')

      if (!this.validatorShotTimes(this.queryForm.minShotTimes)) {
        this.searchLoading = false;
        return false;
      }

      let isNextDay;
      if (this.queryForm.startTime < 7) {
        isNextDay = false;
      } else {
        if (this.queryForm.endTime <= 7) {
          isNextDay = true;
        }
      }
      const params = {
        bayonetIds: this.queryForm.bayonetIds,
        cameraIds: this.queryForm.cameraIds,
        endDate: this.queryForm.endDate + ' 23:59:59',
        endhour: this.queryForm.endTime,
        startDate: this.queryForm.startDate + ' 00:00:00',
        startHour: this.queryForm.startTime,
        minShotTimes: parseInt(this.queryForm.minShotTimes),
        vehicleTypes: this.queryForm.vehicleTypes.length > 0 ? this.queryForm.vehicleTypes.join(',') : null,
        surveillanceIds: this.queryForm.surveillanceIds.length > 0 ? this.queryForm.surveillanceIds.join(',') : null,
        isNextDay: isNextDay,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        order: 'desc',
        orderBy: 'shotTimes'
      };

      this.searchStr = JSON.parse(JSON.stringify(params));
      
      getNightVehicleList(params)
        .then(res => {
          console.log('res',res)
          if (res && res.data) {
            this.dataList = res.data.list;
            this.pagination.total = res.data.total;
            this.searchLoading = false;
          } else {
            this.searchLoading = false;
          }
        })
        .catch(() => {this.searchLoading = false;})
    },
    /**
     * 导出按钮
     */
    onExport () {
      this.exportLoadingbtn = true;

      this.queryForm.bayonetIds = null;
      this.queryForm.cameraIds = null;

      if (this.selectCameraArr && this.selectCameraArr.length > 0) {
        let cameraIds = this.selectCameraArr.map(res => res.id);
        this.queryForm.cameraIds = cameraIds.join(",");
      }
      if (this.selectBayonetArr && this.selectBayonetArr.length > 0) {
        let bayonentIds = this.selectBayonetArr.map(res => res.id);
        this.queryForm.bayonetIds = bayonentIds.join(",");
      }

      this.queryForm.startDate = this.queryDate && this.queryDate.length > 0 && formatDate(this.queryDate[0], 'yyyy-MM-dd')
      this.queryForm.endDate = this.queryDate && this.queryDate.length > 0 && formatDate(this.queryDate[1], 'yyyy-MM-dd')

      const data = {
        bayonetIds: this.queryForm.bayonetIds,
        cameraIds: this.queryForm.cameraIds,
        endDate: this.queryForm.endDate + ' 23:59:59',
        endhour: this.queryForm.endTime,
        startDate: this.queryForm.startDate + ' 00:00:00',
        startHour: this.queryForm.startTime,
        minShotTimes: parseInt(this.queryForm.minShotTimes),
        vehicleTypes: this.queryForm.vehicleTypes.length > 0 ? this.queryForm.vehicleTypes.join(':') : null,
        surveillanceIds: this.queryForm.surveillanceIds.length > 0 ? this.queryForm.surveillanceIds.join(',') : null,
        isNextDay: this.queryForm.endTime && this.queryForm.endTime > 7 ? false : true,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        order: 'desc',
        orderBy: 'shotTimes'
      };
      const params = {
        viewType: 1, // 1--夜间行车
        nightDrivingQueryDto: {
          ...data
        }
      }
      exportNightVehicle(params)
        .then(res => {
          if (res && res.data) {
            autoDownloadUrl(res.data.fileUrl);
           
            this.exportLoadingbtn = false;
          } else {
            this.exportLoadingbtn = false;
          }
        })
        .catch(() => {this.exportLoadingbtn = false;})
    },
    /**
     * 查看抓拍记录
     */
    onOpenRecord (obj) {
      this.searchStr['vehicleNumber'] = obj.vehicleNumber;
      this.$router.push({name: 'vehicle_search_ycxc_record', params: {
        ...this.searchStr
      }});
    },
    /**
     * 查看车辆信息
     */
    onOpenVehicleInfo (obj) {
      this.searchStr['vehicleNumber'] = obj.vehicleNumber;
      this.$store.commit('setBreadcrumbData', {
        breadcrumbData: [
          {name: '车辆侦查', routerName: 'vehicle'},
          {name: '夜间行车分析', routerName: 'vehicle_search_ycxc', params: { ...this.searchStr }},
          { name: '车辆详情' }
        ]
      });
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
    // 开始时间change
    handleChangeStartTime (val) {
      this.endTimeOptions.map((item) => {item.disabled = false;})
      if (val) {
        this.endTimeOptions.map(item => {
          if (val < 19) { // 开始时间选择的次日
            if (item.value > 7 || item.value <= val) { // 结束时间不是次日的不能选
              item.disabled = true;
            }
          } else { // 开始时间选择的当日
            if (item.value > 7 && item.value <= val) { // 结束时间不是当日的不能选
              item.disabled = true;
            }
          }
        })
      }
    },
    // 过车次数 blur
    handleBlurShotTimes () {
      const time = this.queryForm.minShotTimes;
      this.validatorShotTimes(time);
    },
    validatorShotTimes (val) {
      let reg = /^[0-9]+$/;
      if (!reg.test(val) || parseInt(val) < 2 || parseInt(val) > 100) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('请输入2-100之间的整数');
        }
        return false;
      } else {
       return true;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.vc_gcck_bd {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 50px; line-height: 50px;
}
.th-driving-night {
  width: 100%; height: 100%;
  padding-top: 50px;
  .the-bottom {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    .the-left-search {
      width: 285px;height: 100%;
      background: #fff;
      box-shadow: 5px 0 10px #E5E7E7;
      animation: fadeInLeft .4s ease-out .3s both;
      .con_left{
        width: 285px;
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
            width: 145px;
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
        }
        // 选择设备下拉
        .selected_device {
          margin-bottom: 10px;
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
        // background:rgba(12,112,248,1);
        // border-radius:4px;
        // color: #ffffff;
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
    /* .el-input__inner {
      padding-left: 15px;
    } */
    /* .el-range__icon {
      position: absolute;
      right: 3px;
      top: 2px;
    }
    .el-range__close-icon {
      position: absolute;
      right: 3px;
      top: 2px;
    } */
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