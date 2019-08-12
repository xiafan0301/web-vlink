<template>
  <!-- 特征搜车 -->
  <div class="tzsc_wrap">
    <!-- 面包屑通用样式 -->
    <div
      is="vlBreadcrumb"
      :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle_menu'},
          {name: '特征搜车'}]"
    ></div>
    <div class="sc_content">
      <!-- 通用的左边菜单 -->
      <div class="left_menu">
        <!-- 菜单表单 -->
        <vue-scroll>
          <div style="padding: 20px;">
            <!-- 表单 -->
            <el-form :model="tzscMenuForm" ref="tzscMenuForm" :rules="rules">
              <div class="selectDate date-comp">
                <el-form-item label prop="startTime">
                  <el-date-picker
                    v-model="tzscMenuForm.startTime"
                    type="datetime"
                    :clearable="false"
                    :picker-options="startDateOpt"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :time-arrow-control="true"
                    placeholder="开始时间"
                    class="width232 vl_date"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label prop="endTime">
                  <el-date-picker
                    v-model="tzscMenuForm.endTime"
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
              <div class="selected_device_comp" v-if="treeTabShow" @click="chooseDevice"></div>
              <div class="selected_device" @click="treeTabShow = true;">
                <i class="el-icon-arrow-down" v-show="!treeTabShow"></i>
                <i class="el-icon-arrow-up" v-show="treeTabShow"></i>
                <div class="device_list" v-if="selectDeviceArr.length > 0 && !checkAllTree">
                  <span>{{ selectDeviceArr[0]['label'] }}</span>
                  <span
                    v-show="selectDeviceArr.length > 1"
                    title="展开选中的设备"
                    class="device_count"
                  >+{{ selectDeviceArr.length - 1 }}</span>
                </div>
                <div class="no_device" v-else-if="selectDeviceArr.length > 0 && checkAllTree">全部设备</div>
                <div class="no_device" v-else>选择设备</div>
                <!-- 树tab页面 -->
                <div class="device_tree_tab" v-show="treeTabShow">
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
              <!-- 选择搜车的类型 -->
              <div class="select_type">
                <el-radio-group v-model="selectType">
                  <el-radio :label="1">从图片提取</el-radio>
                  <el-radio :label="2">自定义特征</el-radio>
                </el-radio-group>
              </div>
              <div v-show="selectType === 1">
                <!-- 上传车像图片 -->
                <div style="padding: 0 15px; height: 210px;">
                  <div is="vlUpload" :clear="uploadClear" @uploadEmit="uploadEmit"></div>
                </div>
                <!-- 检索结果 -->
                <div class="characteristic">
                  <el-button
                    class="get_character_btn"
                    :class="{ have_character: this.curImageUrl !== '' }"
                    @click.stop="getCharacter"
                    :loading="getCharacterLoading"
                  >获取特征</el-button>
                  <div class="characteristic_list" v-if="characteristicList.length > 0">
                    <div
                      class="characteristic_item"
                      :title="item.checked ? '取消选择此特征': '选择此特征'"
                      :class="{ color_blue: item.checked }"
                      v-for="(item, index) in characteristicList"
                      :key="'characteristic_list' + index"
                      @click="item.checked = !item.checked"
                    >
                      <!-- 车牌号码 -->
                      <span v-if="item.plateNo">{{ '车牌号码:' + item.name }}</span>
                      <!-- 车牌颜色 -->
                      <span v-else-if="item.plateColor">{{ '车牌颜色:' + item.name }}</span>
                      <!-- 车辆型号 -->
                      <span v-else-if="item.vehicleModel">{{ '车辆型号:' + item.name}}</span>
                      <!-- 车辆颜色 -->
                      <span v-else-if="item.vehicleColor">{{ '车辆颜色:' + item.name }}</span>
                      <!-- 车辆类型 -->
                      <span v-else-if="item.vehicleClass">{{ '车辆类型:' + item.name }}</span>
                      <!-- 号牌类型 -->
                      <span
                        v-else-if="item.plateClass || item.plateClass === 0"
                      >{{ '号牌类型:' + dicFormater(45, item.name) }}</span>
                      <!-- <span v-else>{{item.name}}</span> -->
                    </div>
                    <!-- 没有特征 -->
                  </div>
                </div>
              </div>
              <!-- 自定义特征 -->
              <div v-show="selectType === 2">
                <el-form-item prop="licenseColor">
                  <el-select
                    v-model="tzscMenuForm.licenseColor"
                    class="width232"
                    placeholder="选择号牌颜色"
                    clearable
                  >
                    <el-option
                      v-for="item in plateColorOptions"
                      :key="item.enumField"
                      :label="item.enumValue"
                      :value="item.enumValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="carModel">
                  <el-cascader
                    class="width232"
                    clearable
                    separator="-"
                    placeholder="选择车辆型号"
                    v-model="tzscMenuForm.carModel"
                    :options="carModelOptions"
                  ></el-cascader>
                </el-form-item>
                <el-form-item prop="carColor">
                  <el-select
                    v-model="tzscMenuForm.carColor"
                    clearable
                    class="width232"
                    placeholder="选择车辆颜色"
                  >
                    <el-option
                      v-for="item in vehicleColorOptions"
                      :key="item.enumField"
                      :label="item.enumValue"
                      :value="item.enumValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="carType">
                  <el-select
                    v-model="tzscMenuForm.carType"
                    class="width232"
                    clearable
                    placeholder="选择车辆类型"
                  >
                    <el-option
                      v-for="item in vehicleClassOptions"
                      :key="item.enumField"
                      :label="item.enumValue"
                      :value="item.enumValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="licenseType">
                  <el-select
                    v-model="tzscMenuForm.licenseType"
                    class="width232"
                    placeholder="选择号牌类型"
                    clearable
                  >
                    <el-option
                      v-for="item in plateClassOptions"
                      :key="'licenseType' + item.enumField"
                      :label="item.enumValue"
                      :value="item.enumValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item prop="sunVisor">
                  <el-select
                    v-model="tzscMenuForm.sunVisor"
                    clearable
                    class="width232"
                    placeholder="选择遮阳板"
                  >
                    <el-option
                      v-for="item in sunvisorOptions"
                      :key="item.enumField"
                      :label="item.enumValue"
                      :value="item.enumValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="inspectionCount">
                  <el-select
                    v-model="tzscMenuForm.inspectionCount"
                    class="width232"
                    placeholder="选择年检标数量"
                    clearable
                  >
                    <el-option
                      v-for="item in descOfRearItemOptions"
                      :key="item.enumField"
                      :label="item.enumValue"
                      :value="item.enumValue"
                    ></el-option>
                  </el-select>
                </el-form-item>-->
              </div>
            </el-form>
            <!-- 按钮样式 -->
            <div class="btn_warp">
              <el-button class="reset_btn" @click="resetMenu">重置</el-button>
              <el-button
                class="select_btn"
                :loading="getStrucInfoLoading"
                :disabled="characteristicAble"
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
                  <img
                    :alt="item.deviceName"
                    @dragstart="dragStart($event, item)"
                    @dragend="dragEnd"
                    draggable="true"
                    style="cursor: move;"
                    :src="item.storagePath"
                  />
                </div>
                <div class="text_wrap">
                  <h3 class="text_name">检索资料</h3>
                  <div class="text_message" :title="item.shotTime">
                    <i class="vl_icon vl_icon_retrieval_01"></i>
                    {{item.shotTime}}
                  </div>
                  <div class="text_message" :title="item.deviceName">
                    <i class="vl_icon vl_icon_retrieval_02"></i>
                    {{item.deviceName}}
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
        <div>
          <img src="../../../../../assets/img/null-content.png" alt />
          {{noDataTips}}
        </div>
      </div>
    </div>
    <!--检索详情弹窗-->
    <div id="capMap"></div>
    <div is="vehicleDetail" :detailData="detailData"></div>
  </div>
</template>
<script>
import vlUpload from "@/components/common/upload.vue";
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
import vehicleDetail from "../common/vehicleDetail.vue";

import { ajaxCtx, mapXupuxian } from "@/config/config"; // 引入溆浦县地图
import { formatDate, dateOrigin } from "@/utils/util.js";

import {
  JtcPOSTAppendixInfo,
  JtcGETAppendixInfoList
} from "../../../api/api.judge.js"; // 图片上传接口

import { getVehicleList } from "../../../api/api.base.js";

import {
  getFeatureSearch,
  getPhotoAnalysis
} from "../../../api/api.analysis.js"; // 车辆特征检索接口

import { MapGETmonitorList } from "../../../api/api.map.js"; // 获取设备树接口
import { objDeepCopy } from "../../../../../utils/util.js"; // 深拷贝方法
import { constants } from "crypto";

export default {
  components: { vehicleDetail, vlBreadcrumb, vlUpload },
  data() {
    return {
      uploadClear: {},
      detailData: null,
      selectType: 1, // 图片提取或者自定义提取
      sortType: 1, // 1为时间排序， 2为监控排序
      timeSortType: true, // true为时间降序， false为时间升序
      cameraSortType: true, // true为监控降序， false为监控升序
      characteristicList: [
        // {
        //   checked: false
        // }
      ], // 车辆特征数组
      getCharacterLoading: false, // 获取车辆特征加载效果
      // 菜单表单变量
      tzscMenuForm: {
        startTime: "",
        endTime: "",
        selectDevice: "",
        licenseType: "",
        licenseColor: "",
        carType: "",
        carColor: "",
        carModel: [],
        sunVisor: "",
        inspectionCount: ""
      },
      rules: {},
      startDateOpt: {
        disabledDate: time => {
          if (this.tzscMenuForm.endTime) {
            return (
              time.getTime() > new Date(this.tzscMenuForm.endTime).getTime()
            );
          } else {
            return time.getTime() > new Date().getTime();
          }
        }
      },
      endDateOpt: {
        disabledDate: time => {
          if (this.tzscMenuForm.startTime) {
            return (
              time.getTime() <
                new Date(this.tzscMenuForm.startTime).getTime() ||
              time.getTime() > new Date().getTime()
            );
          } else {
            return time.getTime() > new Date().getTime();
          }
        }
      },
      getStrucInfoLoading: false, // 查询按钮加载
      pickerOptions: {
        disabledDate(time) {
          let date = new Date();
          let y = date.getFullYear();
          let m =
            date.getMonth() + 1 < 10
              ? "0" + (date.getMonth() + 1)
              : date.getMonth() + 1;
          let d = date.getDate();
          let oneMonths = "";
          let start = "";
          if (parseFloat(m) >= 4) {
            start = y + "-" + (m - 1) + "-" + d;
          } else {
            start = y - 1 + "-" + (m - 1 + 12) + "-" + d;
          }
          oneMonths = new Date(start).getTime();
          return time.getTime() > Date.now() || time.getTime() < oneMonths;
        }
      },
      /* 自定义特征下拉框数组 */
      plateClassOptions: [], // 号牌类型
      plateColorOptions: [], // 号牌颜色
      vehicleClassOptions: [], // 车辆类型
      vehicleColorOptions: [], // 车辆颜色
      carModelOptions: [], // 车辆型号
      carModelProps: {
        checkStrictly: true
      },
      // sunvisorOptions: [ // 遮阳板
      //   {
      //     enumField: "打开",
      //     enumValue: "打开"
      //   },
      //   {
      //     enumField: "收起",
      //     enumValue: "收起"
      //   }
      // ],
      characterTypes: [
        "plateNo", // 车牌号
        "plateColor", // 车牌颜色
        "vehicleModel", // 汽车的型号(vehicleStyles)
        "vehicleColor", // 汽车颜色
        "vehicleClass", // 汽车类型（越野啥的）
        "plateClass" // 号牌类型
      ],
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
      /* 上传图片变量 */
      uploadAcion: ajaxCtx.base + "/new", //上传路径
      uploading: false, // 是否上传中
      curImageUrl: "", // 当前上传的图片
      /* 选择设备变量 */
      treeTabShow: false,
      selectDeviceArr: [], // 选中的设备数组
      selectCameraArr: [], // 选中的摄像头数组
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
      isIndeterminate: false, // 是否处于全选与全不选之间
      isIndeterminateBay: false, //卡口
      checkAllTree: false, // 树是否全选
      checkAllTreeBay: false,
      bayonetTree: [], // 卡口树
      cameraTree: [],
      videoTreeNodeCount: 0, // 摄像头节点数量
      bayonetTreeNodeCount: 0, // 卡口节点数量
      defaultProps: {
        children: "children",
        label: "label"
      },
      /* 检索结果变量 */
      strucInfoList: [],
      noDataTips: "请在左侧输入查询条件",
      pageNum: 1,
      pageSize: 10,
      total: 0
      /* 检索详情弹窗变量 */
    };
  },
  computed: {
    characteristicAble() {
      if (this.selectType === 1) {
        return (
          this.characteristicList.filter(item => {
            return item.checked;
          }).length <= 0
        );
      } else {
        // 自定义
        const form = objDeepCopy(this.tzscMenuForm);
        delete form.selectDate;
        delete form.selectDevice;
        for (let key in form) {
          if (form[key]) {
            return false;
          }
        }
        return true;
      }
    }
  },
  mounted() {
    // 初始化地图
    let map = new AMap.Map("capMap", {
      center: [112.974691, 28.093846],
      zoom: 16
    });
    map.setMapStyle("amap://styles/whitesmoke");
    this.amap = map;
    // 选择一个默认的日期
    this.setDTime();
    //获取摄像头卡口数据
    this.getMonitorList();
    // 从字典中取出自定义的特征数组
    this.getSelectOption();
    // 一进入页面就全选设备
    this.$nextTick(() => {
      this.checkAllTree = true;
      this.handleCheckedAll(true);
    });
  },
  methods: {
    getSelectOption() {
      // 获取到自定义特征的下拉框列表数据
      this.plateClassOptions = this.dicFormater(45)[0].dictList;
      this.plateColorOptions = this.dicFormater(46)[0].dictList;
      this.vehicleClassOptions = this.dicFormater(44)[0].dictList;
      this.vehicleColorOptions = this.dicFormater(47)[0].dictList;
      getVehicleList().then(res => {
        // console.log("联动数据", res);
        this.carModelOptions = res.data.map(item => {
          item.value = item.brand;
          item.label = item.brand;
          item.children = [];
          for (let i = 0; i < item.typeList.length; i++) {
            item.children.push({
              value: item.typeList[i],
              label: item.typeList[i]
            });
          }
          delete item.typeList;
          return item;
        });
      });
    },
    getStrucParams() {
      // 处理设备UID
      let deviceUidArr = this.selectCameraArr.map(item => {
        return item.id;
      });
      let bayonetUidArr = this.selectBayonetArr.map(item => {
        return item.id;
      });
      let queryParams;
      if (this.selectType === 2) {
        queryParams = {
          where: {
            startTime: this.tzscMenuForm.startTime, // 开始时间
            endTime: this.tzscMenuForm.endTime, // 结束时间
            deviceUid: deviceUidArr.length > 0 ? deviceUidArr.join() : null, // 摄像头标识
            bayonetUid: bayonetUidArr.length > 0 ? bayonetUidArr.join() : null, // 卡口标识
            plateClass: this.tzscMenuForm.licenseType || null, // 号牌类型
            plateColor: this.tzscMenuForm.licenseColor || null, // 号牌颜色
            vehicleClass: this.tzscMenuForm.carType || null, // 车辆类型
            vehicleColor: this.tzscMenuForm.carColor || null, // 车辆颜色
            // "sunvisor": this.tzscMenuForm.sunVisor || null, // 遮阳板
            // "descOfRearItem": this.tzscMenuForm.inspectionCount || null, // 年检标数量
            vehicleNumber: null, // 车牌号码
            vehicleModel:
              this.tzscMenuForm.carModel.length > 0
                ? this.tzscMenuForm.carModel.join("-")
                : null // 车辆型号
          }
        };
      } else {
        // 从图片提取
        queryParams = {
          where: {
            startTime: this.tzscMenuForm.startTime, // 开始时间
            endTime: this.tzscMenuForm.endTime, // 结束时间
            deviceUid: deviceUidArr.length > 0 ? deviceUidArr.join() : null, // 摄像头标识
            bayonetUid: bayonetUidArr.length > 0 ? bayonetUidArr.join() : null // 卡口标识
          }
        };
        const selectedArr = this.characteristicList.filter(item => {
          return item.checked;
        });
        for (let i = 0; i < selectedArr.length; i++) {
          if (selectedArr[i].plateClass) {
            // 号牌类型
            queryParams["where"].plateClass = selectedArr[i].plateClass;
          }
          if (selectedArr[i].plateColor) {
            queryParams["where"].plateColor = selectedArr[i].plateColor;
          }
          if (selectedArr[i].vehicleClass) {
            queryParams["where"].vehicleClass = selectedArr[i].vehicleClass;
          }
          if (selectedArr[i].vehicleColor) {
            queryParams["where"].vehicleColor = selectedArr[i].vehicleColor;
          }
          // if (selectedArr[i].sunvisor) { // 遮阳板
          //   queryParams['where'].sunvisor = selectedArr[i].sunvisor;
          // }
          // if (selectedArr[i].descOfFrontItem) { // 年检标数量
          //   queryParams['where'].descOfRearItem = selectedArr[i].descOfFrontItem;
          // }
          if (selectedArr[i].plateNo) {
            // 车牌
            queryParams["where"].vehicleNumber = selectedArr[i].plateNo;
          }
          if (selectedArr[i].vehicleModel) {
            // 车辆型号
            queryParams["where"].vehicleModel = selectedArr[i].vehicleModel;
          }
        }
      }
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
      return queryParams;
    },
    getStrucInfo(isClick = false) {
      // 根据特征数组来获取到检索的结果
      this.$refs.tzscMenuForm.validate(valid => {
        if (valid) {
          // console.log('表单数据', this.tzscMenuForm);
          if (isClick) {
            this.getStrucInfoLoading = true; // 打开加载效果
            this.pageNum = 1;
          }
          if (this.selectCameraArr.length <= 0 && this.selectBayonetArr <= 0) {
            this.$message.warning("请选择至少一个卡口与摄像头");
            this.getStrucInfoLoading = false; // 关闭加载效果
            return;
          }
          let queryParams = Object.assign(this.getStrucParams(), {
            pageNum: this.pageNum,
            pageSize: this.pageSize
          });
          getFeatureSearch(queryParams)
            .then(res => {
              this.getStrucInfoLoading = false; // 关闭加载效果
              this.noDataTips = "暂无搜索结果";
              if (res.data && res.data.list) {
                if (res.data.list.length > 0) {
                  this.strucInfoList = res.data.list;
                  this.total = res.data.total;
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
              this.noDataTips = "暂无搜索结果";
            });
        } else {
          return false;
        }
      });
    },
    onPageChange(page) {
      this.pageNum = page;
      this.getStrucInfo();
    },
    handleSizeChange(val) {
      this.pageNum = 1;
      this.pageSize = val;
      this.getStrucInfo();
    },
    getCharacter() {
      // 获取特征
      if (this.curImageUrl) {
        // 调用获取特征的后台接口
        this.getCharacterLoading = true;
        getPhotoAnalysis(this.curImageUrl)
          .then(res => {
            this.getCharacterLoading = false;
            if (res.data) {
              const data = res.data[0];
              if (data.descOfFrontItem) {
                // 过滤分号
                data.descOfFrontItem = data.descOfFrontItem.replace(";", "");
              }
              this.characteristicList = [];
              for (let i = 0; i < this.characterTypes.length; i++) {
                for (let key in data) {
                  if (key === this.characterTypes[i]) {
                    let obj = {
                      checked: true
                    };
                    obj[key] = data[key];
                    obj["name"] = data[key];
                    if (obj[key]) {
                      // 如果特征值有数据
                      this.characteristicList = [
                        ...this.characteristicList,
                        obj
                      ];
                    }
                  }
                }
              }
            } else {
              this.characteristicList = [];
            }
          })
          .catch(err => {
            this.getCharacterLoading = false;
          });
      } else {
        this.$message.warning("请先上传车辆图片再获取特征");
      }
    },
    /*重置菜单的数据 */
    resetMenu() {
      this.uploadClear = {};
      // 置空数据数量
      this.total = 0;
      this.pageNum = 1;
      this.selectDeviceArr = []; // 清空选中的设备列表
      this.selectCameraArr = []; // 清空选中的摄像头与卡口列表
      this.selectBayonetArr = [];
      this.strucInfoList = []; // 清空检索结果数据
      this.characteristicList = []; // 清空车辆特征列表数据
      this.curImageUrl = ""; // 清空上传的图片
      if (this.$refs.tzscMenuForm) {
        this.$refs.tzscMenuForm.resetFields();
      }
      this.initCheckTree(); // 初始化全选树节点
      this.$nextTick(() => {
        this.setDTime(); // 重置时间
      });
    },
    /*sort排序方法*/
    clickTime() {
      // 点击时间排序
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
    /*选择日期的方法 */
    setDTime() {
      //设置默认时间
      this.tzscMenuForm.startTime = formatDate(dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)));
      this.tzscMenuForm.endTime = formatDate(new Date());
    },
    /*选择设备的方法*/
    initCheckTree() {
      // 一进入页面就全选设备
      this.$nextTick(() => {
        this.checkAllTree = true;
        this.handleCheckedAll(true);
      });
    },
    getMonitorList() {
      let params = {
        areaUid: mapXupuxian.adcode
      };
      MapGETmonitorList(params).then(res => {
        if (res && res.data) {
          let camera = objDeepCopy(res.data.areaTreeList);
          let bayonet = objDeepCopy(res.data.areaTreeList);
          this.cameraTree = this.getTreeList(camera);
          /* this.bayonetTree = this.getBayTreeList(bayonet); */
          this.getLeafCountTree(this.cameraTree);
          /* this.getLeafCountTree(this.cameraTree, 'camera');
          this.getLeafCountTree(this.bayonetTree, 'bayonet'); */
          this.initCheckTree(); // 初始化全选树节点
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
    /* getBayTreeList(data) {
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
    }, */
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
      this.selectDeviceArr = [...this.selectDeviceArr].filter(
        key => key.treeType
      );
      this.selectCameraArr = [...this.selectDeviceArr].filter(
        key => key.treeType === 1
      );
      this.selectBayonetArr = [...this.selectDeviceArr].filter(
        key => key.treeType === 2
      );
    },
    // 绘制地图
    drawPoint(data) {
      this.$nextTick(() => {
        $(".struc_c_address").append($("#capMap"));
      });
      if (this.markerPoint) {
        this.amap.remove(this.markerPoint);
      }
      let _content = '<div class="vl_icon vl_icon_judge_02"></div>';
      this.markerPoint = new AMap.Marker({
        // 添加自定义点标记
        map: this.amap,
        position: [data.shotPlaceLongitude, data.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
        offset: new AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // 自定义点标记覆盖物内容
        content: _content
      });
      this.amap.setZoomAndCenter(16, [
        data.shotPlaceLongitude,
        data.shotPlaceLatitude
      ]); // 自适应点位置
      let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`;
      this.infoWindow = new AMap.InfoWindow({
        map: this.amap,
        isCustom: true,
        closeWhenClickMap: false,
        position: [data.shotPlaceLongitude, data.shotPlaceLatitude],
        offset: new AMap.Pixel(0, -70),
        content: sConent
      });
    },
    videoTap() {
      // 播放视频
      let vDom = document.getElementById("capVideo");
      if (this.playing) {
        vDom.pause();
      } else {
        vDom.play();
      }
      vDom.addEventListener("ended", e => {
        e.target.currentTime = 0;
        this.playing = false;
      });
      this.playing = !this.playing;
    },
    showStrucInfo(data, index) {
      // strucInfoList
      this.detailData = {
        type: 2, // 2特征搜车
        params: this.getStrucParams(), // 查询参数
        list: this.strucInfoList, // 列表
        index: index, // 第几个
        pageSize: this.pageSize,
        total: this.total,
        pageNum: this.pageNum
      };
    },
    /* showStrucInfo(data, index) {
      // 打开抓拍详情
      this.$nextTick(() => {
        console.log("swiper", this.$refs.mySwiper);
      });
      this.sturcDetail = null;
      this.curImgIndex = index;
      this.strucDetailDialog = true;
      this.sturcDetail = data;
      this.drawPoint(data);
    }, */
    imgListTap(data, index) {
      // 点击swiper图片
      this.curImgIndex = index;
      this.sturcDetail = data;
      this.drawPoint(data); // 重新绘制地图
    },
    uploadEmit(data) {
      if (data && data.path) {
        this.curImageUrl = data.path;
      } else {
        this.curImageUrl = "";
      }
    },
    // 拖拽开始
    dragStart(ev, item) {
      if (item && item.subStoragePath) {
        if (!ev) {
          ev = window.event;
        }
        ev.dataTransfer.setData("upload_pic_url", item.subStoragePath); // 设置属性dataTransfer   两个参数   1：key   2：value
      }
    },
    dragEnd() {
      // console.log('drag end')
      // this.dragActiveObj = null;
    }
  },
  watch: {
    curImageUrl(e) {
      if (e === "") {
        this.characteristicList = [];
      }
    },
    strucCurTab(e) {
      if (e === 2) {
        this.drawPoint(this.sturcDetail);
      } else if (e === 3) {
        this.videoUrl = document.getElementById("capVideo").src;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.tzsc_wrap {
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
      // 菜单的表单
      .width232 {
        width: 232px;
      }
      .el-form-item {
        margin-bottom: 10px;
      }
      // 选择搜车类型
      .select_type {
        padding-bottom: 20px;
      }
      // 特征
      .characteristic {
        padding: 10px 15px 20px 15px;
        .btn {
          line-height: 30px;
          height: 30px;
          background: #f2f2f2;
          border: 1px solid #d3d3d3;
          border-radius: 4px;
          text-align: center;
          color: #666666;
          cursor: pointer;
        }
        .characteristic_list {
          min-height: 40px;
          overflow: hidden;
          .characteristic_item {
            float: left;
            padding: 7px 10px;
            font-size: 12px;
            background: #fafafa;
            border: 1px solid #f2f2f2;
            border-radius: 3px;
            margin: 10px 10px 0 0;
            cursor: pointer;
            color: #999;
          }
          .no_characteristic_list {
            line-height: 40px;
            text-align: center;
            font-size: 16px;
            color: #999;
          }
          .color_blue {
            color: #fff;
            background: #0c70f8;
          }
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
      padding: 24px 20px 20px 20px;
      height: 100%;
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
          width: 380px;
          padding: 20px;
          margin: 20px 20px 0 0;
          background: #fff;
          overflow: hidden;
          float: left;
          // 图片包裹
          .img_wrap {
            width: 138px;
            height: 138px;
            float: left;
            position: relative;
            img {
              width: 100%;
              height: 100%;
              display: block;
              cursor: move;
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
              width: 184px;
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
.tzsc_wrap {
  .characteristic {
    .get_character_btn {
      width: 202px;
      line-height: 1;
      height: 30px;
      background: #f2f2f2;
      border: 1px solid #d3d3d3;
      border-radius: 4px;
      text-align: center;
      color: #666666;
      cursor: pointer;
      padding: 0;
    }
    .have_character {
      background: #0c70f8;
      color: #fff;
    }
  }
  // 历史图片弹窗
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
