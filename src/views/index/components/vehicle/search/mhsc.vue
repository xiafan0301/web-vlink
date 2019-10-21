<template>
  <!-- 模糊搜车 -->
  <div class="mhsc_wrap">
    <!-- 面包屑通用样式 -->
    <div
      is="vlBreadcrumb"
      :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle_menu'},
          {name: '模糊搜车'}]"
    ></div>
    <div class="sc_content">
      <!-- 通用的左边菜单 -->
      <div class="left_menu">
        <!-- 菜单表单 -->
        <vue-scroll>
          <div style="padding: 20px;">
            <!-- 表单 -->
            <div class="form_warp">
              <el-form :model="mhscMenuForm" ref="mhscMenuForm" :rules="rules">
                <div class="date-comp">
                  <el-form-item label prop="startTime">
                    <el-date-picker
                      v-model="mhscMenuForm.startTime"
                      type="datetime"
                      :clearable="false"
                      :picker-options="startDateOpt"
                      :time-arrow-control="true"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="开始时间"
                      class="width232 vl_date"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label prop="endTime">
                    <el-date-picker
                      v-model="mhscMenuForm.endTime"
                      type="datetime"
                      :clearable="false"
                      :picker-options="endDateOpt"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :time-arrow-control="true"
                      placeholder="结束时间"
                      class="width232 vl_date vl_date_end"
                    ></el-date-picker>
                  </el-form-item>
                </div>
                <!-- 选择设备 -->
                <div class="mhsc_xzsb_s"  v-show="selectAreaType === 0" @click="areaTypeChanged">
                  <span>选择设备</span>
                  <span class="el-icon-arrow-down"></span>
                </div>
                <div class="mhsc_dtxz_rst"  v-show="selectAreaType === 2">
                  已选<span>{{dSum}}</span>个设备<a href="javascript: void(0);" @click="openMap={}">重选</a>
                </div>
                <el-form-item label prop="carType">
                  <el-select
                    v-model="mhscMenuForm.carType"
                    multiple
                    collapse-tags
                    class="width232"
                    clearable
                    placeholder="全部车辆类别"
                  >
                    <el-option
                      v-for="item in vehicleClassOptions"
                      :key="item.enumField"
                      :label="item.enumValue"
                      :value="item.enumField"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车牌：" style="margin: 0;" label-width="55px" prop="isNegate">
                  <el-checkbox v-model="mhscMenuForm.isNegate" style="float: right;">排除</el-checkbox>
                </el-form-item>
                <el-form-item label prop="carNumber">
                  <el-input
                    placeholder
                    v-model="mhscMenuForm.carNumber"
                    class="input-with-select width232"
                  >
                    <el-select
                      clearable
                      v-model="mhscMenuForm.provice"
                      style="width: 70px;"
                      slot="prepend"
                      placeholder
                    >
                      <el-option
                        v-for="item in vehicleBelongOptions"
                        :key="item.enumField"
                        :label="item.enumValue"
                        :value="item.enumValue"
                      ></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
            <!-- 按钮样式 -->
            <div class="btn_warp">
              <el-button class="reset_btn" @click="resetMenu">重置</el-button>
              <el-button
                class="select_btn"
                :loading="getStrucInfoLoading"
                @click="getStrucInfo(true)"
              >确定</el-button>
            </div>
          </div>
        </vue-scroll>
      </div>
      <!-- 通用的右边列表 -->
      <div class="right_img_list" v-if="strucInfoList.length > 0">
        <!-- 排序和结果 -->
        <div class="result_sort">
          <h3 class="result">检索结果（{{ total }}）</h3>
          <div class="sort">
            <div class="sort_item" :class="{ 'active_sort': sortType === 1 }" @click="clickTime">
              时间排序
              <i
                :class="{'el-icon-arrow-down': timeSortType, 'el-icon-arrow-up': !timeSortType }"
                v-show="sortType === 1"
              ></i>
            </div>
            <div class="sort_item" :class="{ 'active_sort': sortType === 2 }" @click="clickCamera">
              监控排序
              <i
                :class="{'el-icon-arrow-down': cameraSortType, 'el-icon-arrow-up': !cameraSortType }"
                v-show="sortType === 2"
              ></i>
            </div>
          </div>
        </div>
        <!-- 图片列表 -->
        <div class="img_list">
          <vue-scroll>
            <div style="overflow: hidden;">
              <div
                class="img_item"
                v-for="(item, index) in strucInfoList"
                :key="'img_list' + index"
                @click="showStrucInfo(item, index)"
              >
                <div class="img_wrap">
                  <img :src="item.subStoragePath" />
                </div>
                <div class="text_wrap">
                  <div class="text_message" :title="item.deviceName">
                    <i class="vl_icon vl_icon_retrieval_02"></i>
                    {{item.deviceName}}
                  </div>
                  <div class="text_message" :title="item.shotTime">
                    <i class="vl_icon vl_icon_retrieval_01"></i>
                    {{item.shotTime}}
                  </div>
                  <div class="text_message">
                    车牌号码：{{item.plateNo ? item.plateNo : "未识别"}}
                  </div>
                </div>
              </div>
            </div>
            <!-- 分页器 -->
            <template v-if="total > 0">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="onPageChange"
                :current-page.sync="pageNum"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="total"
                class="cum_pagination"
              ></el-pagination>
            </template>
          </vue-scroll>
        </div>
      </div>
      <!-- 没有数据的情况 -->
      <div v-else class="fnull">
        <div v-if="isInit">
          <img src="../../../../../assets/img/null-content.png" alt />
          <span>请在左侧输入查询条件</span>
        </div>
        <div v-else>
          <img src="../../../../../assets/img/not-content.png" alt />
          <span>抱歉，没有相关的结果!</span>
        </div>
      </div>
    </div>
    <!--检索详情弹窗-->
    <div is="vehicleDetail" :detailData="detailData"></div>
    <!-- D设备 B卡口  这里是设备和卡口 -->
    <div
            is="mapSelector"
            :open="openMap"
            :clear="msClear"
            :showTypes="'DB'"
            @mapSelectorEmit="mapSelectorEmit">
    </div>
  </div>
</template>
<script>
import vlBreadcrumb from "@/components/common/breadcrumb.vue";

import { ajaxCtx, mapXupuxian } from "@/config/config"; // 引入一个地图的地址
import { formatDate, dateOrigin } from "@/utils/util.js";

import { getGroupsByType } from "@/views/index/api/api.js";
import { getVagueSearch } from "../../../api/api.analysis.js"; // 根据图检索接口
import { objDeepCopy } from "../../../../../utils/util.js"; // 深拷贝方法
import mapSelector from '@/components/common/mapSelector.vue';
import { dataList } from "@/utils/data.js";
import vehicleDetail from "../common/vehicleDetail.vue";
export default {
  components: { vehicleDetail, vlBreadcrumb, mapSelector },
  data() {
    return {
      dSum: 0, // 设备总数
      openMap: false,
      msClear: {},
      selectAreaType: 0,
      selectCameraArr: [], // 选中的摄像头数组
      selectBayonetArr: [], // 选中的卡口数组

      detailData: null,
      selectType: 1,
      sortType: 1, // 1为时间排序， 2为监控排序
      timeSortType: true, // true为时间降序， false为时间升序
      cameraSortType: true, // true为监控降序， false为监控升序
      // 菜单表单变量
      mhscMenuForm: {
        startTime: "",
        endTime: "",
        carType: "", // 车辆类别
        isNegate: false, // 是否取反
        provice: "", // 省简称
        carNumber: ""
      },
      rules: {},
      startDateOpt: {
        disabledDate: time => {
          if (this.mhscMenuForm.endTime) {
            return (
              time.getTime() > new Date(this.mhscMenuForm.endTime).getTime()
            );
          } else {
            return time.getTime() > new Date().getTime();
          }
        }
      },
      endDateOpt: {
        disabledDate: time => {
          if (this.mhscMenuForm.startTime) {
            return (
              time.getTime() <
                new Date(this.mhscMenuForm.startTime).getTime() ||
              time.getTime() > new Date().getTime()
            );
          } else {
            return time.getTime() > new Date().getTime();
          }
        }
      },
      getStrucInfoLoading: false, // 查询按钮加载
      vehicleClassOptions: [
        // 车辆类别下拉
        {
          enumField: "无牌车",
          enumValue: "无牌车"
        },
        {
          enumField: "布控库车辆",
          enumValue: "布控库车辆"
        }
      ],
      vehicleBelongOptions: [], // 车辆归属地下拉
      pickerOptions: {
        disabledDate(time) {
          let date = new Date();
          let y = date.getFullYear();
          let m =
            date.getMonth() + 1 < 10
              ? "0" + (date.getMonth() + 1)
              : date.getMonth() + 1;
          let d = date.getDate();
          let threeMonths = "";
          let start = "";
          if (parseFloat(m) >= 4) {
            start = y + "-" + (m - 1) + "-" + d;
          } else {
            start = y - 1 + "-" + (m - 1 + 12) + "-" + d;
          }
          threeMonths = new Date(start).getTime();
          let treeDays = time.getTime() - 3600 * 1000 * 24 * 3;
          return time.getTime() > Date.now() || time.getTime() < threeMonths;
        }
      },
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        }
      ],
      stucOrder: 2, // 1升序，2降序，3监控，4相似度
      /* 检索结果变量 */
      strucInfoList: [],
      strucInfoListAll: [],
      isInit: true, // 是否是页面初始化状态
      pageNum: 1,
      pageSize: 20,
      total: 0
      /* 检索详情弹窗变量 */
    };
  },
  mounted() {
    this.setDTime();
    this.vehicleBelongOptions = this.dicFormater(dataList.ownership)[0].dictList; // 获取车辆归属地
    // 获取到车辆类别
    getGroupsByType({ groupType: 9 }).then(res => {
      if (res.data) {
        this.vehicleClassOptions = [
          ...this.vehicleClassOptions,
          ...res.data.map(item => {
            return {
              enumField: item.groupName,
              enumValue: item.groupName // uid
            };
          })
        ];
      }
    });
  },
  methods: {
    areaTypeChanged () {
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
//        if (result.bayonetDeviceList && result.bayonetDeviceList.length > 0) {
//          this.dSum += result.bayonetDeviceList.length;
//          for (let i = 0; i < result.bayonetDeviceList.length; i++) {
//            this.dIds.push(result.bayonetDeviceList[i].uid);
//          }
//        }
      }
    },

    getStrucInfo(isClick = false) {
      // 根据特征数组来获取到检索的结果
      this.$refs.mhscMenuForm.validate(valid => {
        if (isClick) {
          this.getStrucInfoLoading = true; // 打开加载效果
          this.pageNum = 1;
        }
        if (valid) {
          if (this.selectCameraArr.length <= 0 && this.selectBayonetArr <= 0) {
            this.$message.warning("请选择至少一个卡口与摄像头");
            this.getStrucInfoLoading = false; // 关闭加载效果
            return;
          }
          // 处理设备UID
          let deviceUidArr = this.selectCameraArr;
          let bayonetUidArr = this.selectBayonetArr;
          // if (
          //   (!this.mhscMenuForm.provice && this.mhscMenuForm.carNumber) ||
          //   (this.mhscMenuForm.provice && !this.mhscMenuForm.carNumber)
          // ) {
          //   this.$message.warning("请您填写完整的车牌号码");
          // }
          const queryParams = {
            startTime: this.mhscMenuForm.startTime || null, // 开始时间
            endTime: this.mhscMenuForm.endTime || null, // 结束时间
            deviceUid: deviceUidArr.join(), // 摄像头标识
            bayonetUid: bayonetUidArr.join(), // 卡口标识
            vehicleType: this.mhscMenuForm.carType.join() || null, // 车辆类型
            vehicleNumber:
              this.mhscMenuForm.provice + this.mhscMenuForm.carNumber || null, // 车牌号码
            unvehicleFlag: this.mhscMenuForm.isNegate // 非车辆标志
          };
          // 处理排序字段
          if (this.sortType === 1) {
            // 时间排序
            queryParams.orderBy = "shotTime";
            if (this.timeSortType) {
              queryParams.order = "desc";
            } else {
              queryParams.order = "asc";
            }
          } else if (this.sortType === 2) {
            // 监控排序
            queryParams.orderBy = "deviceNamePinyin";
            if (this.cameraSortType) {
              queryParams.order = "desc";
            } else {
              queryParams.order = "asc";
            }
          }
          getVagueSearch(queryParams)
            .then(res => {
              this.getStrucInfoLoading = false; // 关闭加载效果
              this.isInit = false; // 页面初始化状态改变
              if (res.data) {
                if (res.data.length > 0) {
                  // this.strucInfoList = res.data;
                  this.strucInfoListAll = res.data;
                  this.total = this.strucInfoListAll.length;
                  this.onPageChange(1);
                  /* if (this.total > this.pageSize) {
                    this.strucInfoList = this.strucInfoListAll.slice(0, this.pageSize);
                  } else {
                    this.strucInfoList = this.strucInfoListAll;
                  } */
                } else {
                  this.strucInfoList = []; // 清空搜索结果
                  this.total = 0;
                }
              } else {
                this.strucInfoList = []; // 清空搜索结果
                this.total = 0;
              }
            })
            .catch(err => {
              this.getStrucInfoLoading = false; // 关闭加载效果
              this.strucInfoList = []; // 清空搜索结果
              this.total = 0;
              this.isInit = false; // 页面初始化状态改变
            });
        } else {
          return false;
        }
      });
    },
    onPageChange(page) {
      this.pageNum = page;
      let ips = (this.pageNum - 1) * this.pageSize;
      let ipe = ips + this.pageSize;
      if (ipe > this.total) {
        ipe = this.total;
      }
      this.strucInfoList = this.strucInfoListAll.slice(ips, ipe);
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.getStrucInfo();
    },
    /*重置菜单的数据 */
    resetMenu() {
      // 置空数据数量
      this.total = 0;
      this.dSum = 0;
      this.msClear = {};
      this.selectCameraArr = []; // 清空选中的摄像头与卡口列表
      this.selectBayonetArr = [];
      this.strucInfoList = []; // 清空检索结果数据
      if (this.$refs.mhscMenuForm) {
        this.$refs.mhscMenuForm.resetFields();
      }
      this.setDTime(); // 重置时间
    },
    /*选择日期的方法 */
    setDTime() {
      //设置默认时间
      this.mhscMenuForm.startTime = formatDate(
        dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000))
      );
      this.mhscMenuForm.endTime = formatDate(new Date());
    },
    /*sort排序方法*/
    clickTime() {
      if (this.sortType === 1) {
        this.timeSortType = !this.timeSortType;
      } else if (this.sortType === 2) {
        this.sortType = 1;
      }
      if (this.strucInfoList.length) {
        this.getStrucInfo();
      }
    },
    clickCamera() {
      // 点击监控排序
      if (this.sortType === 2) {
        this.cameraSortType = !this.cameraSortType;
      } else if (this.sortType === 1) {
        this.sortType = 2;
      }
      if (this.strucInfoList.length) {
        this.getStrucInfo();
      }
    },
    showStrucInfo(data, index) {
      this.detailData = {
        type: 6, // 6模糊搜车
        params: {}, // 查询参数
        list: this.strucInfoList, // 列表
        index: index, // 第几个
        pageSize: this.strucInfoList.length,
        total: this.strucInfoList.length,
        pageNum: 1
      };
    }
  }
};
</script>
<style lang="scss" scoped>
  .mhsc_xzsb_s {
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
  .mhsc_dtxz_rst {
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
  
.mhsc_wrap {
  height: 100%;
  position: relative;
  // 面包屑样式
  // .link_bread {
  //   height: 60px;
  //   background: #fff;
  //   .bread_common {
  //     padding: 23px 0 0 20px;
  //   }
  // }
  // 搜车主体页面
  .sc_content {
    height: calc(100% - 49px);
    overflow: hidden;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    // 左边菜单样式
    .left_menu {
      width: 272px;
      position: relative;
      background: #fff;
      box-shadow: 2px 3px 10px 0px rgba(131, 131, 131, 0.28);
      height: 100%;
      // 表单选项间隔
      .el-form-item {
        margin-bottom: 10px;
      }
      // 菜单的表单
      .width232 {
        width: 232px;
      }
      .width132 {
        width: 132px;
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
          height: 330px;
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
            height: 320px;
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
      // 按钮
      .btn_warp {
        padding-top: 10px;
        .select_btn {
          background: #0c70f8;
          color: #ffffff;
          width: 110px;
        }
        .reset_btn {
          background: #ffffff;
          border: 1px solid #dddddd;
          color: #666666;
          width: 110px;
        }
      }
      // 上传
      .upload_warp {
        position: relative;
        height: 232px;
        cursor: pointer;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        margin-bottom: 38px;
        &:hover {
          background: #2981f8;
          > p {
            display: block;
          }
          .del_icon {
            display: block;
          }
        }
        .vl_jtc_upload {
          width: 100%;
          height: 100%;
          background: none;
        }
        > p {
          display: none;
          position: absolute;
          bottom: 0;
          text-align: center;
          width: 100%;
          color: #ffffff;
          height: 40px;
          line-height: 40px;
          -webkit-border-radius: 0 0 10px 10px;
          -moz-border-radius: 0 0 10px 10px;
          border-radius: 0 0 10px 10px;
          background: #0c70f8;
        }
        .vl_jtc_ic_input {
          position: absolute;
          top: 0.2rem;
          width: 3rem;
          height: 0.26rem;
          left: 0.2rem;
          border: 1px solid #d3d3d3;
          -webkit-border-radius: 0.13rem;
          -moz-border-radius: 0.13rem;
          border-radius: 0.13rem;
          padding: 0 0.02rem;
          background: #ffffff;
          .el-form-item__content {
            height: 0.23rem;
            line-height: 0.23rem;
          }
          input {
            border: none !important;
            height: 0.23rem;
            line-height: 0.23rem;
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
          background: rgba(0, 0, 0, 0.4);
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          color: #ffffff;
        }
      }
    }
    // 没有数据的样式
    .fnull {
      text-align: center;
      line-height: 48px;
      font-size: 16px;
      color: #666666;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      height: 100%;
      background: #fff;
      margin: 24px 20px 20px 20px;
      position: relative;
      > div {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%); /* IE 9 */
        -webkit-transform: translate(-50%, -50%); /* Safari and Chrome */
        img {
          display: block;
          margin: auto;
          padding-bottom: 10px;
        }
      }
    }
    // 右边图片列表
    .right_img_list {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      overflow: hidden;
      position: relative;
      height: 100%;
      padding: 24px 20px 20px 20px;
      // 检索结果与排序
      .result_sort {
        overflow: hidden;
        .result {
          font-size: 14px;
          color: #666;
          float: left;
        }
        .sort {
          font-size: 14px;
          width: 220px;
          height: 14px;
          margin: 0 auto;
          .sort_item {
            text-align: center;
            width: 110px;
            float: left;
            color: #999;
            cursor: pointer;
          }
          .active_sort {
            color: #2580fc;
            i {
              color: #2580fc;
            }
          }
        }
      }
      // 图片列表
      .img_list {
        height: calc(100% - 19px);
        .img_item {
          cursor: pointer;
          width: 346px;
          padding: 11px;
          margin: 2px 2px 0 0;
          background: #fff;
          overflow: hidden;
          float: left;
          // 图片包裹
          .img_wrap {
            width: 138px;
            height: 80px;
            float: left;
            position: relative;
            background: #f2f2f2;
            overflow: hidden;
            img {
              width: 100%;
              height: auto;
              display: block;
              cursor: move;
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              margin: auto;
            }
          }
          // 文字的包裹
          .text_wrap {
            padding-left: 10px;
            float: left;
            // 标题
            .text_name {
              font-size: 14px;
              color: #999;
              padding-bottom: 5px;
            }
            // 检索的资料信息
            .text_message {
              width: 166px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              margin-top: 8px;
              padding: 0 12px;
              font-size: 12px;
              background: #fafafa;
              border: 1px solid #f2f2f2;
              border-radius: 3px;
              > i {
                margin-top: 3px;
                float: left;
              }
              line-height: 26px;
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
//弹窗
.mhsc_wrap {
  .el-input-group__append,
  .el-input-group__prepend {
    background: #fff;
  }
  // 上传
  .upload_warp .vl_jtc_upload {
    .el-upload {
      width: 100%;
      height: 100%;
      background: #f2f2f2;
      border: none;
      span {
        color: #999;
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
  // 弹窗
  .history-pic-dialog {
    .el-dialog {
      max-width: 12.6rem;
      width: 100% !important;
    }
    .el-dialog__title {
      font-size: 0.16rem;
      color: #333333;
    }
    .el-dialog__body {
      padding: 0 0.76rem 0.3rem;
    }
    .his-pic-box {
      width: 100%;
      height: 4.6rem !important;
      .his-pic-item {
        float: left;
        width: 1.38rem;
        height: 1.38rem;
        border: 0.02rem solid #ffffff;
        margin-right: 0.2rem;
        margin-bottom: 0.2rem;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .active {
        border-color: #0c70f8;
      }
    }
    .el-dialog__footer {
      button {
        width: 1.4rem !important;
        height: 0.4rem;
        line-height: 0.4rem;
        padding: 0;
      }
    }
  }
}
</style>
