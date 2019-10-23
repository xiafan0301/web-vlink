<template>
  <div class="th-driving-night">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle'}, {name: '夜间行车分析'}]"></div>
    </div>
    <div class="the-bottom">
      <div class="the-left-search">
        <div class="con_left">
          <div class="left_time date-comp">
            <el-date-picker
              class="vl_date"
              v-model="queryForm.startDate"
              :clearable="false"
              type="date"
              placeholder="开始日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="left_time date-comp">
            <el-date-picker
              class="vl_date vl_date_end"
              placeholder="结束日期"
              v-model="queryForm.endDate"
              :clearable="false"
              type="date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              @change="dateChange"
              :picker-options="pickerOptions"
            >
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
          <!-- 选择设备 -->
          <div class="tzsc_xzsb_s"  v-show="selectAreaType === 0" @click="areaTypeChanged">
            <span>选择设备</span>
            <span class="el-icon-arrow-down"></span>
          </div>
          <div class="tzsc_dtxz_rst"  v-show="selectAreaType === 2">
            已选<span>{{dSum}}</span>个设备<a href="javascript: void(0);" @click="openMap={}">重选</a>
          </div>
         
          <div class="left_num">
            <el-input class="left-none-border" v-model="queryForm.minShotTimes" @blur="handleBlurShotTimes">
              <template slot="prepend">过车次数≥</template>
            </el-input>
            <span>次（范围2-100）</span>
          </div>
          
          <el-select v-model="queryForm.vehicleTypes" collapse-tags placeholder="请选择车辆类型" style="width: 100%;" clearable multiple>
            <el-option
              v-for="item in carTypeList"
              :key="item.enumField"
              :label="item.enumValue"
              :value="item.enumValue">
            </el-option>
          </el-select>
          <el-select v-model="queryForm.surveillanceIds" collapse-tags placeholder="请选择布控车辆" style="width: 100%;" clearable multiple>
            <el-option
              v-for="item in controlVehicleList"
              :key="item.uid"
              :label="item.groupName"
              :value="item.uid">
            </el-option>
          </el-select>
          <div class="left_btn">
            <el-button class="reset_btn" @click="onReset">重置</el-button>
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
                    <span>{{ scope.row.vehicleType ? scope.row.vehicleType : '-' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="过车次数" prop="shotTimes"></el-table-column>
                <el-table-column label="布控库车辆" prop="isServeilled">
                  <template slot-scope="scope">
                    <span>{{ scope.row.isServeilled ? '是' : '否' }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <span class="operation_btn" @click="onOpenRecord(scope.row)">抓拍记录</span>
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
          <div is="noResult" :isInitPage="isInitPage" :tipMessage="initPageMessage"></div>
        </template>
      </div>
    </div> 
    <!-- D设备 B卡口  这里是设备和卡口 -->
    <div
      is="mapSelector"
      :open="openMap"
      :clear="msClear"
      :activeDeviceList="activeDeviceList"
      :showTypes="'DB'"
      @mapSelectorEmit="mapSelectorEmit">
    </div>
  </div>
</template>
<script>
import { getNightVehicleList, exportNightVehicle } from "@/views/index/api/api.judge.js";
import { getGroupListIsVehicle } from '@/views/index/api/api.control.js';
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
import { formatDate, autoDownloadUrl, dateOrigin } from "@/utils/util.js";
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import noResult from '@/components/common/noResult.vue';
import mapSelector from '@/components/common/mapSelector.vue';
export default {
  components: { vlBreadcrumb, noResult, mapSelector },
  data () {
    return {
      selectAreaType: 0, // 弹框 1--列表选择 2--地图选择
      dSum: 0, // 设备总数
      dIds: [], // 设备IDS

      openMap: false,
      msClear: {},
      activeDeviceList: [], // 传入弹框之前已经选择的设备

      isInitPage: true, // 是否是初始化页面
      initPageMessage: '输入夜间时间段，查询有频繁夜出情况的车辆',
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
        endDate:  null,
        cameraIds: null,
        bayonetIds: null,
        startTime: 19,
        endTime: 7,
        minShotTimes: 5,
        vehicleTypes: [],
        surveillanceIds: []
      },
      queryDate: null,
      selectBayonetArr: [], // 选中的卡口数组
      selectCameraArr: [], // 选中的摄像头数组
      searchLoading: false,
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
  watch: {
    // 'queryForm.startDate' () {
    //   let _this = this;
    //   const threeDays = 2 * 3600 * 24 * 1000;
    //   const endTime = new Date(_this.queryForm.startDate).getTime() + threeDays;
    //   _this.queryForm.endDate = formatDate(endTime);
    // }
  },
  created () {
    if (this.$route.query.startDate) {
      this.handleQueryData();
    } else {
      this.setDTime();
    }
  },
  mounted() {
    this.getVehicleTypeList();
    this.getControlVehicleList();
    
    if (this.$route.query.startDate) {
      setTimeout(() => {
        this.handleSubmitData();
      }, 2000)

    }
  },
  methods: {
    areaTypeChanged () {
      this.selectBayonetArr = [];
      this.selectCameraArr = [];
      this.selectAreaType = 2;
      this.openMap = !this.openMap;
    },
    mapSelectorEmit (result) {
      console.log(result)
      if (result) {
        // bayonetList deviceList
        this.dSum = 0;
        if (result.deviceList) {
          this.dSum = result.deviceList.length;
          for (let i = 0; i < result.deviceList.length; i++) {
            this.selectCameraArr.push(result.deviceList[i].uid);
          }
        }
        if (result.bayonetList && result.bayonetList.length > 0) {
          for (let i = 0; i < result.bayonetList.length; i++) {
            this.selectBayonetArr.push(result.bayonetList[i].uid);
          }
          this.dSum += result.bayonetList.length;
        }
      }
    },
    //设置默认时间
    setDTime() {
      let date = new Date();
      let curDate = date.getTime();
      // let curS = 1 * 24 * 3600 * 1000;
      
      let year = new Date(curDate).getFullYear();

      let month = new Date(curDate).getMonth() + 1;// 月
      if (month < 10) { month = '0' + month; }
      
      let day = new Date(curDate).getDate();// 日
      if (day < 10) { day = '0' + day; }
      let _s = year + '-' + month + '-' + day;

      this.queryForm.startDate = _s;
      this.queryForm.endDate = _s;
      // this.queryDate = [_s, _s];
    },
    //日期选择
    dateChange() {
      // let _this = this;
      // if (
      //   new Date(_this.queryForm.endDate).getTime() - new Date(_this.queryForm.startDate).getTime() >=
      //   3 * 24 * 3600 * 1000
      // ) {
      //   if (!document.querySelector(".el-message")) {
      //     this.$message.info(
      //       "最大时间段为3天，超过开始时间3天（72小时）后的时间不可选择!"
      //     );
      //   }
      //   this.setDTime();
      //   return false;
      // } else {
      //   return true;
      // }
    },
    handleQueryData () {
      const startDate = this.$route.query.startDate.split(' ')[0];
      const endDate = this.$route.query.endDate.split(' ')[0];

      const startTime = this.$route.query.startHour;
      const endTime = this.$route.query.endhour;
      const minShotTimes = this.$route.query.minShotTimes;
      const surveillanceIds = this.$route.query.surveillanceIds && this.$route.query.surveillanceIds.split(',');
      const vehicleTypes =  this.$route.query.vehicleTypes && this.$route.query.vehicleTypes.split(',');


      this.queryForm.startDate = startDate;
      this.queryForm.endDate = endDate;
      this.queryForm.startTime = startTime;
      this.queryForm.endTime = endTime;
      this.queryForm.minShotTimes = minShotTimes;
      this.queryForm.surveillanceIds = surveillanceIds;
      this.queryForm.vehicleTypes = vehicleTypes;

      this.pagination.pageNum = this.$route.query.pageNum;
      this.pagination.pageSize = this.$route.query.pageSize;

      this.activeDeviceList = [
        ...this.$route.query.bayonetIds.split(','),
        ...this.$route.query.cameraIds.split(','),
      ];

      this.selectBayonetArr = this.$route.query.bayonetIds.split(',');
      this.selectCameraArr = this.$route.query.cameraIds.split(',');
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
    onReset () {
      // this.resetLoading = true
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
      this.selectCameraArr = []; // 清空选中的摄像头与卡口列表
      this.selectBayonetArr = [];
      this.dSum = 0;
      this.msClear = {};
      this.selectAreaType = 0;

      this.setDTime();

      // this.resetLoading = false;

    },
    onSearch () {
      this.searchLoading = true;
      this.handleSubmitData();
    },
    handleSubmitData () {
      
      if (this.selectCameraArr && this.selectCameraArr.length > 0) {
        this.queryForm.cameraIds = this.selectCameraArr.join(",");
      }
      if (this.selectBayonetArr && this.selectBayonetArr.length > 0) {
        this.queryForm.bayonetIds = this.selectBayonetArr.join(",");
      }
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
          if (res && res.data) {
            if (res.data.list.length <= 0) {
              this.isInitPage = false;
            }
            this.dataList = res.data.list;
            this.pagination.total = res.data.total;
            this.searchLoading = false;
          } else {
            this.searchLoading = false;
            this.isInitPage = false;
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
        // let cameraIds = this.selectCameraArr.map(res => res.uid);
        this.queryForm.cameraIds = this.selectCameraArr.join(",");
      }
      if (this.selectBayonetArr && this.selectBayonetArr.length > 0) {
        // let bayonentIds = this.selectBayonetArr.map(res => res.uid);
        this.queryForm.bayonetIds = this.selectBayonetArr.join(",");
      }

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
      this.$router.push({name: 'vehicle_search_ycxc_record', query: {
        ...this.searchStr
      }});
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
.tzsc_xzsb_s {
  height: 40px;
  line-height: 40px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  cursor: pointer;
  color: #999999;
  padding: 0 6px;
  margin-bottom: 10px;
  > span {
    display: inline-block;
    width: 50%;
    &:last-child {
      text-align: right;
    }
  }
}
.tzsc_dtxz_rst {
  width: 100%;
  line-height: 40px;
  padding: 0px 15px; margin-top: 5px;
  background-color: #F5F7FA;
  color: #C0C4CC;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  margin-bottom: 10px;
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
        .date-comp {
         margin-bottom: 10px;
        }
        > .left_time{
          // padding-bottom: 10px;
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
          margin-bottom: 10px;
        }
        .left_num{
          display: flex;
          margin-bottom: 10px;
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
    box-shadow: 5px 0px 16px 0px rgba(169,169,169,0.2);
  }
}
.con_left {
  .el-input__inner:hover,
  .el-input__inner:focus {
    border-color: #DCDFE6 !important;
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