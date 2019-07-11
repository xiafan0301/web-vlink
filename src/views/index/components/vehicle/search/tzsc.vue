<template>
  <!-- 特征搜车 -->
  <div class="tzsc_wrap">
    <!-- 面包屑通用样式 -->
    <div class="link_bread">
      <el-breadcrumb separator=">" class="bread_common">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>特征搜车</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="sc_content">
      <!-- 通用的左边菜单 -->
      <div class="left_menu">
        <!-- 菜单表单 -->
        <vue-scroll>
          <div style="padding: 20px;">
            <!-- 选择设备 -->
            <div class="selected_device_comp" v-if="treeTabShow" @click="chooseDevice"></div>
            <div class="selected_device" @click="treeTabShow = true;">
              <i class="el-icon-arrow-down"></i>
              <!-- <i class="el-icon-arrow-up"></i> -->
              <div class="device_list" v-if="selectDeviceArr.length > 0">
                <span>{{ selectDeviceArr[0]['label'] }}</span>
                <span
                  v-show="selectDeviceArr.length > 1"
                  title="展开选中的设备"
                  class="device_count"
                >+{{ selectDeviceArr.length - 1 }}</span>
              </div>
              <div class="no_device" v-else>选择设备</div>
              <!-- 树tab页面 -->
              <div class="device_tree_tab" v-show="treeTabShow">
                <!-- <div style="overflow: hidden;">
                  <div
                    class="tab_title"
                    :class="{ 'current_title': index === selectedTreeTab }"
                    @click="selectedTreeTab = index;"
                    v-for="(item, index) in treeTabArr"
                    :key="'tab_title' + index"
                  >{{ item.name }}</div>
                </div>-->
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
                <!-- <div class="tree_content" v-show="selectedTreeTab === 1">
                  <vue-scroll>
                    <div class="checked_all">
                      <el-checkbox
                        :indeterminate="isIndeterminateBay"
                        v-model="checkAllTreeBay"
                        @change="handleCheckedAllBay"
                      >全选</el-checkbox>
                    </div>
                    <el-tree
                        @check="listenCheckedBay"
                        :data="bayonetTree"
                        show-checkbox
                        default-expand-all
                        node-key="id"
                        ref="bayonetTree"
                        highlight-current
                        :props="defaultProps"
                      ></el-tree>
                  </vue-scroll>
                </div>-->
              </div>
            </div>
            <!-- 表单 -->
            <el-form :model="tzscMenuForm" ref="tzscMenuForm" :rules="rules">
              <div class="selectDate">
                <el-form-item label prop="selectDate">
                  <el-date-picker
                    class="width232"
                    v-model="tzscMenuForm.selectDate"
                    type="daterange"
                    range-separator="-"
                    value-format="yyyy-MM-dd"
                    format="yy/MM/dd"
                    :picker-options="pickerOptions"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :clearable="false"
                  ></el-date-picker>
                </el-form-item>
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
                <div class="upload_warp" @drop="drop($event)" @dragover="allowDrop($event)">
                  <el-upload
                    @drop="drop($event)"
                    :class="{'vl_jtc_upload': true}"
                    :show-file-list="false"
                    accept="image/*"
                    :action="uploadAcion"
                    list-type="picture-card"
                    :before-upload="beforeAvatarUpload"
                    :on-success="uploadSucess"
                    :on-error="handleError"
                  >
                    <i v-if="uploading" class="el-icon-loading"></i>
                    <img v-else-if="curImageUrl" :src="curImageUrl" />
                    <div v-else>
                      <i
                        style="width: 100px;height: 85px;opacity: .5; position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto;"
                        class="vl_icon vl_icon_vehicle_01"
                      ></i>
                      <span>点击上传图片</span>
                    </div>
                  </el-upload>
                  <p @click="showHistoryPic">从上传记录中选择</p>
                  <div v-show="curImageUrl" class="del_icon">
                    <i class="el-icon-delete" @click="delPic"></i>
                  </div>
                </div>
                <!-- 检索结果 -->
                <div class="characteristic">
                  <el-button
                    class="get_character_btn"
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
                      <span v-if="item.plateClass">{{ dicFormater(45, item.name) }}</span>
                      <span v-else-if="item.plateColor">{{ '车牌颜色:' + item.name }}</span>
                      <span v-else-if="item.sunvisor">{{ '遮阳板:' + item.name }}</span>
                      <span v-else-if="item.vehicleColor">{{ '车辆颜色:' + item.name }}</span>
                      <span v-else>{{item.name}}</span>
                    </div>
                    <!-- 没有特征 -->
                  </div>
                </div>
              </div>
              <!-- 自定义特征 -->
              <div v-show="selectType === 2">
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
                <el-form-item prop="carModel">
                  <el-select
                    v-model="tzscMenuForm.carModel"
                    clearable
                    class="width232"
                    placeholder="选择车辆型号"
                  >
                    <el-option
                      v-for="item in carModelOptions"
                      :key="item.enumField"
                      :label="item.enumValue"
                      :value="item.enumValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="sunVisor">
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
                </el-form-item>
              </div>
            </el-form>
            <!-- 按钮样式 -->
            <div class="btn_warp">
              <el-button class="reset_btn" @click="resetMenu">重置</el-button>
              <el-button class="select_btn" :loading="getStrucInfoLoading" :disabled="characteristicAble" @click="getStrucInfo(true)">确定</el-button>
            </div>
          </div>
        </vue-scroll>
      </div>
      <!-- 通用的右边列表 -->
      <div class="right_img_list">
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
                    @dragstart="drag($event)"
                    title="拖动图片上传"
                    draggable="true"
                    :src="item.storagePath"
                  />
                </div>
                <div class="text_wrap">
                  <h3 class="text_name">检索资料</h3>
                  <div class="text_message">
                    <i class="vl_icon vl_icon_retrieval_01"></i>
                    <span>{{item.shotTime}}</span>
                  </div>
                  <div class="text_message">
                    <i class="vl_icon vl_icon_retrieval_02"></i>
                    <span>{{item.deviceName}}</span>
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
                :page-sizes="[100, 200, 300, 400]"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="total"
                class="cum_pagination"
              ></el-pagination>
            </template>
          </vue-scroll>
        </div>
      </div>
    </div>
    <!--上传记录弹窗-->
    <el-dialog
      :visible.sync="historyPicDialog"
      class="history-pic-dialog"
      :close-on-click-modal="false"
      top="4vh"
      title="最近上传的图片"
    >
      <div style="text-align: center;font-size: 20px;" v-if="loadingHis">
        <i class="el-icon-loading"></i>
      </div>
      <vue-scroll class="his-pic-box" v-else-if="historyPicList.length">
        <div
          class="his-pic-item"
          :class="{'active': item.checked}"
          v-for="item in historyPicList"
          :key="item.uid"
          @click="chooseHisPic(item)"
        >
          <img :src="item.path" alt />
        </div>
        <div style="clear: both;"></div>
      </vue-scroll>
      <p v-else>暂无历史记录</p>
      <div slot="footer">
        <el-button @click="historyPicDialog = false">取消</el-button>
        <el-button type="primary" @click="addHisToImg" :disabled="choosedHisPic.length === 0">确认</el-button>
      </div>
    </el-dialog>

    <!--检索详情弹窗-->
    <el-dialog
      :visible.sync="strucDetailDialog"
      class="struc_detail_dialog"
      :close-on-click-modal="false"
      top="4vh"
      :show-close="false"
    >
      <div class="struc_tab">
        <span :class="{'active': strucCurTab === 1}" @click="strucCurTab = 1">抓拍详情</span>
        <span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>
        <span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>
        <i class="el-icon-close" @click="strucDetailDialog = false"></i>
      </div>
      <div class="struc_main">
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.storagePath" alt />
            <span>全景图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img struc_c_d_img_green">
              <img :src="sturcDetail.subStoragePath" alt />
              <span>抓拍图</span>
            </div>
            <div class="struc_c_d_info">
              <h2>
                抓拍信息
                <!-- <div class="vl_jfo_sim" v-show="showSim">
                  <i class="vl_icon vl_icon_retrieval_03"></i>
                  {{sturcDetail.semblance ? sturcDetail.semblance : 98.32}}
                  <span
                    style="font-size: 12px;"
                  >%</span>
                </div>-->
              </h2>
              <!-- 特征展示框 -->
              <div class="struc_cdi_box">
                <div class="item" v-if="sturcDetail.plateColor">{{ '车牌颜色：' + sturcDetail.plateColor}}</div>
                <div class="item" v-if="sturcDetail.plateNo">{{ sturcDetail.plateNo}}</div>
                <!-- <div
                  class="item"
                  v-if="sturcDetail.plateReliability"
                >{{sturcDetail.plateReliability}}</div> -->
                <div class="item" v-if="sturcDetail.vehicleBrand">{{ sturcDetail.vehicleBrand}}</div>
                <div class="item" v-if="sturcDetail.vehicleClass">{{ sturcDetail.vehicleClass}}</div>
                <div class="item" v-if="sturcDetail.vehicleColor">{{ '车辆颜色：' + sturcDetail.vehicleColor}}</div>
                <div class="item" v-if="sturcDetail.vehicleModel">{{sturcDetail.vehicleModel}}</div>
                <div class="item" v-if="sturcDetail.vehicleRoof">{{ '车顶(天窗)：' + sturcDetail.vehicleRoof}}</div>
                <div class="item" v-if="sturcDetail.sunvisor">{{ '遮阳板：' + sturcDetail.sunvisor}}</div>
              </div>
              <!-- 车辆的信息栏 -->
              <div class="struc_cdi_line">
                <p>
                  <span class="val">{{sturcDetail.vehicleStyles}}</span>
                  <span class="key">车辆型号</span>
                </p>
              </div>
              <div class="struc_cdi_line">
                <p>
                  <span class="val">{{sturcDetail.shotTime}}</span>
                  <span class="key">抓拍时间</span>
                </p>
              </div>
              <div class="struc_cdi_line">
                <p>
                  <span class="val">{{sturcDetail.deviceName}}</span>
                  <span class="key">抓拍设备</span>
                </p>
              </div>
              <div class="struc_cdi_line">
                <p>
                  <span class="val">{{sturcDetail.address}}</span>
                  <span class="key" title="抓拍地点">抓拍地点</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-show="strucCurTab === 2" class="struc_c_address">
          <!-- <div style="width: 100%; height: 100%;" id="capMap"></div> -->
        </div>
        <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.subStoragePath" alt />
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <video id="capVideo" :src="sturcDetail.videoPath"></video>
            <div class="play_btn" @click="videoTap" v-show="!playing">
              <i class="vl_icon vl_icon_judge_01" v-if="playing"></i>
              <i class="vl_icon vl_icon_control_09" v-else></i>
            </div>
          </div>
          <div class="download_btn">
            <a download="视频" :href="videoUrl"></a>下载视频
          </div>
        </div>
      </div>
      <div class="struc-list" v-show="strucInfoList.length > 1">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in strucInfoList" :key="'my_swiper' + index">
            <div
              class="swiper_img_item"
              :class="{'active': index === curImgIndex}"
              @click="imgListTap(item, index)"
            >
              <img style="width: 100%; height: .88rem;" :src="item.subStoragePath" alt />
              <!-- <div class="vl_jfo_sim" v-show="showSim">
                <i
                  class="vl_icon vl_icon_retrieval_05"
                  :class="{'vl_icon_retrieval_06':  index === curImgIndex}"
                ></i>
                {{item.semblance ? item.semblance : 92}}
                <span
                  style="font-size: 12px;"
                >%</span>
              </div>-->
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
    </el-dialog>
    <div id="capMap"></div>
  </div>
</template>
<script>
import { ajaxCtx, mapXupuxian } from "@/config/config"; // 引入溆浦县地图
import { formatDate } from "@/utils/util.js";

import {
  JtcPOSTAppendixInfo,
  JtcGETAppendixInfoList
} from "../../../api/api.judge.js"; // 图片上传接口

import {
  getFeatureSearch,
  getPhotoAnalysis
} from "../../../api/api.analysis.js"; // 车辆特征检索接口

import { MapGETmonitorList } from "../../../api/api.map.js"; // 获取设备树接口
import { objDeepCopy } from "../../../../../utils/util.js"; // 深拷贝方法
import { constants } from "crypto";

export default {
  data() {
    return {
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
        selectDate: "",
        selectDevice: "",
        licenseType: "",
        licenseColor: "",
        carType: "",
        carColor: "",
        carModel: "",
        sunVisor: "",
        inspectionCount: ""
      },
      rules: {
        selectDate: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ]
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
      sunvisorOptions: [
        // 遮阳板
        {
          enumField: "打开",
          enumValue: "打开"
        },
        {
          enumField: "收起",
          enumValue: "收起"
        }
      ],
      descOfRearItemOptions: [
        {
          enumField: "年检标数量0个",
          enumValue: "年检标数量0个"
        },
        {
          enumField: "年检标数量1个",
          enumValue: "年检标数量1个"
        },
        {
          enumField: "年检标数量2个",
          enumValue: "年检标数量2个"
        },
        {
          enumField: "年检标数量3个",
          enumValue: "年检标数量3个"
        },
        {
          enumField: "年检标数量4个",
          enumValue: "年检标数量4个"
        },
        {
          enumField: "年检标数量5个",
          enumValue: "年检标数量5个"
        },
        {
          enumField: "年检标数量6个",
          enumValue: "年检标数量6个"
        },
        {
          enumField: "年检标数量7个",
          enumValue: "年检标数量7个"
        },
        {
          enumField: "年检标数量8个",
          enumValue: "年检标数量8个"
        },
        {
          enumField: "年检标数量9个",
          enumValue: "年检标数量9个"
        },
        {
          enumField: "年检标数量10个",
          enumValue: "年检标数量10个"
        }
      ], // 年检标数量
      characterTypes: [
        "plateClass", // 号牌类型
        "plateColor", // 车牌颜色
        "plateNo", // 车牌号
        "vehicleClass", // 汽车类型（越野啥的）
        "vehicleBrand", // 汽车型号
        "vehicleStyles", // 汽车的型号
        "vehicleColor", // 汽车颜色
        "sunvisor", // 遮阳板
        "descOfFrontItem", // 年检标数量
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
      historyPicList: [], // 上传历史记录
      selectedHistoryPic: null, // 当前选中的历史图片
      historyPicDialog: false,
      loadingHis: false, // 加载效果
      imgData: null,
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
      pageNum: 1,
      pageSize: 10,
      total: 0,
      /* 检索详情弹窗变量 */
      swiperOption: {
        // swiper配置
        slidesPerView: 10,
        spaceBetween: 18,
        slidesPerGroup: 10,
        loop: false,
        slideToClickedSlide: true,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      amap: null, // 地图实例
      markerPoint: null, // 地图点集合
      InfoWindow: null,
      strucDetailDialog: false, // 弹窗是否展示
      playing: false, // 视频播放是否
      strucCurTab: 1,
      showSim: false, // 展示相似度排序
      curImgIndex: 0, // 当前图片index
      sturcDetail: {},
      videoUrl: "" // 弹窗视频回放里的视频
    };
  },
  computed: {
    choosedHisPic() {
      return this.historyPicList.filter(x => x.checked);
    },
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
    // 选择一个默认的日期
    this.setDTime();
    //获取摄像头卡口数据
    this.getMonitorList();
    // 从字典中取出自定义的特征数组
    this.getSelectOption();
    // console.log("字典数据", this.dicObj);
    // 一进入页面就全选设备
    this.$nextTick(() => {
      this.checkAllTree = true;
      this.handleCheckedAll(true);
    });
    // 初始化地图
    let map = new AMap.Map("capMap", {
      center: [112.974691, 28.093846],
      zoom: 16
    });
    map.setMapStyle("amap://styles/whitesmoke");
    this.amap = map;
  },
  methods: {
    getSelectOption() {
      // 获取到自定义特征的下拉框列表数据
      // this.dicFormater(); // 取字典数据
      // plateClassOptions: [], // 号牌类型
      // plateColorOptions: [], // 号牌颜色
      // vehicleClassOptions: [], // 车辆类型
      // vehicleColorOptions: [], // 车辆颜色
      // carModelOptions: [], // 车辆型号
      // sunvisorOptions: [], // 遮阳板
      this.plateClassOptions = this.dicFormater(45)[0].dictList;
      this.plateColorOptions = this.dicFormater(46)[0].dictList;

      this.vehicleClassOptions = this.dicFormater(44)[0].dictList;
      this.vehicleColorOptions = this.dicFormater(17)[0].dictList;
    },
    getStrucInfo(isClick=false) {
      // 根据特征数组来获取到检索的结果
      this.$refs.tzscMenuForm.validate(valid => {
        if (valid) {
          if (isClick) {
          this.getStrucInfoLoading = true; // 打开加载效果
          }
          if (this.selectCameraArr.length <= 0 && this.selectBayonetArr <= 0) {
            this.$message.warning("请选择至少一个卡口与摄像头");
            this.getStrucInfoLoading = false; // 关闭加载效果
            return;
          }
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
              "where.startTime":
                formatDate(this.tzscMenuForm.selectDate[0], "yyyy-MM-dd") +
                " 00:00:00", // 开始时间
              "where.endTime":
                formatDate(this.tzscMenuForm.selectDate[1], "yyyy-MM-dd") +
                " 23:59:59", // 结束时间
              "where.deviceUid":
                deviceUidArr.length > 0 ? deviceUidArr.join() : null, // 摄像头标识
              "where.bayonetUid":
                bayonetUidArr.length > 0 ? bayonetUidArr.join() : null, // 卡口标识
              "where.plateClass": this.tzscMenuForm.licenseType || null, // 号牌类型
              "where.plateColor": this.tzscMenuForm.licenseColor || null, // 号牌颜色
              "where.vehicleClass": this.tzscMenuForm.carType || null, // 车辆类型
              "where.vehicleColor": this.tzscMenuForm.carColor || null, // 车辆颜色
              "where.sunvisor": this.tzscMenuForm.sunVisor || null, // 遮阳板
              "where.descOfRearItem": this.tzscMenuForm.inspectionCount || null, // 年检标数量
              "where.vehicleNumber": null, // 车牌号码
              "where.vehicleModel": null, // 车辆型号
              pageNum: this.pageNum,
              pageSize: this.pageSize
            };
          } else {
            // 自定义的特征
            queryParams = {
              "where.startTime":
                formatDate(this.tzscMenuForm.selectDate[0], "yyyy-MM-dd") +
                " 00:00:00", // 开始时间
              "where.endTime":
                formatDate(this.tzscMenuForm.selectDate[1], "yyyy-MM-dd") +
                " 23:59:59", // 结束时间
              "where.deviceUid":
                deviceUidArr.length > 0 ? deviceUidArr.join() : null, // 摄像头标识
              "where.bayonetUid":
                bayonetUidArr.length > 0 ? bayonetUidArr.join() : null, // 卡口标识
              pageNum: this.pageNum,
              pageSize: this.pageSize
            };
            const selectedArr = this.characteristicList.filter(item => {
              return item.checked;
            });
            
            for (let i = 0; i < selectedArr.length; i++) {
              if (selectedArr[i].plateClass) { // 号牌类型
                queryParams['where.plateClass'] = selectedArr[i].plateClass;
              }
              if (selectedArr[i].plateColor) {
                queryParams['where.plateColor'] = selectedArr[i].plateColor;
              }
              if (selectedArr[i].vehicleClass) {
                queryParams['where.vehicleClass'] = selectedArr[i].vehicleClass;
              }
              if (selectedArr[i].vehicleColor) {
                queryParams['where.vehicleColor'] = selectedArr[i].vehicleColor;
              }
              if (selectedArr[i].sunvisor) {
                queryParams['where.sunvisor'] = selectedArr[i].sunvisor;
              }
              if (selectedArr[i].descOfFrontItem) { // 年检标数量
                queryParams['where.descOfRearItem'] = selectedArr[i].descOfFrontItem;
              }
              if (selectedArr[i].plateNo) { // 车牌
                queryParams['where.vehicleNumber'] = selectedArr[i].plateNo;
              }
              if (selectedArr[i].vehicleBrand) { // 车辆型号
                queryParams['where.vehicleModel'] = selectedArr[i].vehicleBrand;
              }
              if (selectedArr[i].vehicleStyles) { // 车辆型号
                queryParams['where.vehicleModel'] = selectedArr[i].vehicleStyles;
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
          getFeatureSearch(queryParams)
            .then(res => {
              this.getStrucInfoLoading = false; // 关闭加载效果
              if (res.data && res.data.list) {
                if (res.data.list.length > 0) {
                  this.strucInfoList = res.data.list;
                  this.total = res.data.total;
                } else {
                  this.strucInfoList = []; // 清空搜索结果
                }
              } else {
                this.strucInfoList = []; // 清空搜索结果
              }
            })
            .catch(err => {
              this.getStrucInfoLoading = false; // 关闭加载效果
              this.strucInfoList = []; // 清空搜索结果
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
              if (data.descOfFrontItem) { // 过滤分号
                data.descOfFrontItem = data.descOfFrontItem.replace(";","")
              };
              this.characteristicList = [];
              for (let key in data) {
                for (let i = 0; i < this.characterTypes.length; i++) {
                  if (key === this.characterTypes[i]) {
                    let obj = {
                      checked: true
                    };
                    obj[key] = data[key];
                    obj["name"] = data[key];
                    if (obj[key]) {
                      // 如果特征值有数据
                      this.characteristicList = [
                        obj,
                        ...this.characteristicList
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
      this.tzscMenuForm.selectDate = [
        formatDate(new Date().getTime() - 3600 * 1000 * 24 * 2, "yyyy-MM-dd"),
        formatDate(new Date(), "yyyy-MM-dd")
      ];
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
    // 处理卡口树全选时间
    /* handleCheckedAllBay(val) {
      this.isIndeterminateBay = false;
      if (val) {
        this.$refs.bayonetTree.setCheckedNodes(this.bayonetTree);
      } else {
        this.$refs.bayonetTree.setCheckedNodes([]);
      }
      this.selectBayonetArr = this.$refs.bayonetTree.getCheckedNodes(true);
      this.handleData();
    },
    //卡口
    listenCheckedBay(val, val1) {
      this.selectBayonetArr = this.$refs.bayonetTree.getCheckedNodes(true);
      this.handleData();
      if (val1.checkedNodes.length === this.videoTreeNodeCount) {
        this.isIndeterminateBay = false;
        this.checkAllTreeBay = true;
      } else if (val1.checkedNodes.length < this.videoTreeNodeCount && val1.checkedNodes.length > 0) {
        this.checkAllTreeBay = false;
        this.isIndeterminateBay = true;
      } else if (val1.checkedNodes.length === 0) {
        this.checkAllTreeBay = false;
        this.isIndeterminateBay = false;
      }
    }, */
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
      // 打开抓拍详情
      this.$nextTick(() => {
        console.log("swiper", this.$refs.mySwiper);
      });
      this.sturcDetail = null;
      this.curImgIndex = index;
      this.strucDetailDialog = true;
      this.sturcDetail = data;
      this.drawPoint(data);
    },
    imgListTap(data, index) {
      // 点击swiper图片
      this.curImgIndex = index;
      this.sturcDetail = data;
      this.drawPoint(data); // 重新绘制地图
    },
    /* 上传图片方法 */
    beforeAvatarUpload(file) {
      // 上传图片控制
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt = file.size / 1024 / 1024 < 100;
      if (!isJPG) {
        this.$message.error("只能上传 JPG / PNG 格式图片!");
      }
      if (!isLt) {
        this.$message.error("上传图片大小不能超过 100MB!");
      }
      this.uploading = true;
      return isJPG && isLt;
    },
    uploadSucess(response, file) {
      //上传成功
      this.uploading = false;
      console.log(file);
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
              x["uid"] = jRes.data;
              console.log(x);
            }
          });
          this.imgData = x;
          this.curImageUrl = x.path;
        }
      }
    },
    handleError() {
      //上传失败
      this.uploading = false;
      this.$message.error("上传失败");
    },
    /**从历史记录中上传图片 */
    showHistoryPic() {
      //获取上传记录
      this.loadingHis = true;
      this.historyPicDialog = true; // 打开加载效果
      let params = {
        userId: this.$store.state.loginUser.uid,
        fileType: 1
      };
      JtcGETAppendixInfoList(params)
        .then(res => {
          if (res) {
            this.loadingHis = false; // 关闭加载效果
            res.data.forEach(x => (x.checked = false));
            this.historyPicList = res.data;
          }
        })
        .catch(() => {
          this.historyPicDialog = false; // 关闭加载效果
        });
    },
    delPic() {
      //删除图片
      this.curImageUrl = "";
    },
    chooseHisPic(item) {
      //选择最近上传的图片
      item.checked = true;
      this.selectedHistoryPic = item;
    },
    addHisToImg() {
      this.curImageUrl = this.selectedHistoryPic.path;
      this.historyPicDialog = false; // 关闭模态框
    },
    /* 拖拽图片上传的方法 */
    drag(ev) {
      ev.dataTransfer.setData("Text", ev.target.currentSrc);
    },
    drop(e) {
      this.curImageUrl = e.dataTransfer.getData("Text");
      let x = {
        contentUid: this.$store.state.loginUser.uid,
        cname: "拖拽图片" + Math.random(),
        filePathName: "拖拽图片" + Math.random(),
        path: e.dataTransfer.getData("Text")
      };
      JtcPOSTAppendixInfo(x).then(jRes => {
        if (jRes) {
          x["uid"] = jRes.data;
          console.log(x);
        }
      });
    },
    allowDrop(e) {
      e.preventDefault();
    }
  },
  watch: {
    // stucOrder () {
    //   this.tcDiscuss(true);
    // },
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
  .link_bread {
    height: 60px;
    background: #fff;
    .bread_common {
      padding: 23px 0 0 20px;
    }
  }
  // 搜车主体页面
  .sc_content {
    height: calc(100% - 60px);
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
        margin-bottom: 12px;
      }
      .selectDate .el-form-item {
        margin-bottom: 20px;
      }
      // 选择搜车类型
      .select_type {
        padding-bottom: 20px;
      }
      // 特征
      .characteristic {
        margin: 10px 0 38px 0;
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
          padding-bottom: 20px;
          overflow: hidden;
          border-bottom: 1px solid #d3d3d3;
          .characteristic_item {
            float: left;
            padding: 8px 16px;
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
            color: #0c70f8;
          }
        }
      }
      // 选择设备下拉
      .selected_device {
        margin-bottom: 12px;
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
            height: 340px;
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
      // 上传
      .upload_warp {
        position: relative;
        height: 232px;
        max-height: 232px;
        overflow: hidden;
        cursor: pointer;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
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
              margin-top: 8px;
              padding: 0 12px;
              font-size: 12px;
              background: #fafafa;
              border: 1px solid #f2f2f2;
              border-radius: 3px;
              overflow: hidden;
              > i {
                margin-top: 3px;
                float: left;
              }
              > span {
                line-height: 26px;
                float: left;
              }
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
html {
  font-size: 100px;
}
@media screen and (min-width: 960px) and (max-width: 1119px) {
  html {
    font-size: 60px !important;
  }
}
@media screen and (min-width: 1200px) and (max-width: 1439px) {
  html {
    font-size: 70px !important;
  }
}
@media screen and (min-width: 1440px) and (max-width: 1679px) {
  html {
    font-size: 80px !important;
  }
}
@media screen and (min-width: 1680px) and (max-width: 1919px) {
  html {
    font-size: 90px !important;
  }
}
@media screen and (min-width: 1920px) {
  html {
    font-size: 100px !important;
  }
}
.tzsc_wrap {
  .characteristic {
    .get_character_btn {
      width: 232px;
      // line-height: 30px;
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
  // 抓拍详情弹窗
  .struc_detail_dialog {
    .el-dialog {
      max-width: 13.06rem;
      width: 100% !important;
    }
    .el-dialog__header {
      display: none;
    }
    .struc_tab {
      height: 1.16rem;
      padding: 0.3rem 0;
      position: relative;
      color: #999999;
      span {
        display: inline-block;
        margin-right: 0.55rem;
        padding-bottom: 0.1rem;
        cursor: pointer;
      }
      .active {
        color: #0c70f8;
        border-bottom: 2px solid #0c70f8;
      }
      i {
        display: block;
        position: absolute;
        top: 0.3rem;
        right: 0px;
        cursor: pointer;
      }
    }
    .struc_main {
      width: 11.46rem;
      height: 4.4rem;
      margin: 0 auto;
      border-bottom: 1px solid #f2f2f2;
      .struc_c_detail {
        width: 100%;
        height: 3.6rem;
        > div {
          float: left;
        }
        // 默认为蓝色
        .struc_c_d_img {
          width: 3.6rem;
          height: 3.6rem;
          background: #eaeaea;
          position: relative;
          img {
            width: 100%;
            height: auto;
            max-height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
          }
          i {
            display: block;
            position: absolute;
            top: 0.1rem;
            right: 0.1rem;
            line-height: 0.26rem;
            height: 0.26rem;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 0.13rem;
            font-style: normal;
            color: #0c70f8;
            font-size: 12px;
            padding: 0 0.1rem;
          }
        }
        // 绿色标签
        .struc_c_d_img_green {
          &:before {
            display: block;
            content: "";
            position: absolute;
            top: -0.5rem;
            left: -0.5rem;
            transform: rotate(-45deg);
            border: 0.5rem solid #50cc62;
            border-color: transparent transparent #50cc62;
            z-index: 9;
          }
          span {
            display: block;
            position: absolute;
            top: 0.1rem;
            left: 0.1rem;
            width: 0.6rem;
            height: 0.6rem;
            text-align: center;
            color: #ffffff;
            font-size: 0.12rem;
            -webkit-transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            transform: rotate(-45deg);
            z-index: 99;
          }
          i {
            color: #50cc62;
          }
        }
        .struc_c_d_qj {
          margin-right: 0.3rem;
          &:before {
            display: block;
            content: "";
            position: absolute;
            top: -0.5rem;
            left: -0.5rem;
            transform: rotate(-45deg);
            border: 0.5rem solid #0c70f8;
            border-color: transparent transparent #0c70f8;
            z-index: 9;
          }
          span {
            display: block;
            position: absolute;
            top: 0.1rem;
            left: 0.1rem;
            width: 0.6rem;
            height: 0.6rem;
            text-align: center;
            color: #ffffff;
            font-size: 0.12rem;
            -webkit-transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            transform: rotate(-45deg);
            z-index: 99;
          }
        }
        .struc_c_d_box {
          width: calc(100% - 3.9rem);
          box-shadow: 0px 5px 16px 0px rgba(169, 169, 169, 0.2);
          border-radius: 1px;
          position: relative;
          overflow: hidden;
          > div {
            float: left;
          }
          .struc_c_d_info {
            width: calc(100% - 3.6rem);
            padding-left: 0.24rem;
            color: #333333;
            h2 {
              font-weight: bold;
              line-height: 0.74rem;
              padding-right: 1rem;
              .vl_jfo_sim {
                color: #0c70f8;
                font-weight: bold;
                font-size: 0.24rem;
                float: right;
                i {
                  vertical-align: text-bottom;
                  margin-right: 0.1rem;
                }
                span {
                  font-weight: normal;
                }
              }
            }
            // 特征展示框
            .struc_cdi_box {
              overflow: hidden;
              margin-bottom: 0.08rem;
              .item {
                float: left;
                padding: 0 0.1rem;
                border: 1px solid #f2f2f2;
                background: #fafafa;
                color: #333333;
                font-size: 12px;
                line-height: 0.3rem;
                margin-top: 0.08rem;
              }
              .item + .item {
                margin-left: 0.1rem;
              }
            }
            .struc_cdi_line {
              p {
                max-width: 100%;
                display: inline-block;
                height: 0.3rem;
                line-height: 0.3rem;
                margin-bottom: 0.08rem;
                border: 1px solid #f2f2f2;
                background: #fafafa;
                color: #333333;
                white-space: nowrap;
                text-overflow: ellipsis;
                border-radius: 3px;
                font-size: 12px;
                overflow: hidden;
                padding: 0 0.1rem;
                margin-right: 0.08rem;
                .key {
                  color: #999999;
                  padding-left: 10px;
                }
                .val {
                  padding-right: 9px;
                  position: relative;
                  &::before {
                    content: "";
                    width: 1px;
                    height: 14px;
                    position: absolute;
                    right: 0px;
                    top: 1px;
                    background: #f2f2f2;
                  }
                }
              }
            }
          }
          // &:before {
          //   display: block;
          //   content: "";
          //   position: absolute;
          //   top: -0.7rem;
          //   right: -0.7rem;
          //   transform: rotate(-46deg);
          //   border: 0.7rem solid #0c70f8;
          //   border-color: transparent transparent transparent #0c70f8;
          // }
          // &:after {
          //   display: block;
          //   content: "";
          //   position: absolute;
          //   top: -0.4rem;
          //   right: -0.4rem;
          //   transform: rotate(-45deg);
          //   border: 0.4rem solid #ffffff;
          //   border-color: transparent transparent transparent #ffffff;
          // }
          // > span {
          //   display: block;
          //   position: absolute;
          //   top: 0.19rem;
          //   right: 0.19rem;
          //   width: 1rem;
          //   height: 1rem;
          //   text-align: center;
          //   color: #ffffff;
          //   font-size: 0.12rem;
          //   -webkit-transform: rotate(45deg);
          //   -moz-transform: rotate(45deg);
          //   -ms-transform: rotate(45deg);
          //   -o-transform: rotate(45deg);
          //   transform: rotate(45deg);
          //   z-index: 99;
          // }
        }
      }
      // 抓拍视频
      .struc_c_video {
        .struc_c_d_box {
          background: #e9e7e8;
          height: 100%;
          text-align: center;
          &:hover {
            .play_btn {
              display: block !important;
            }
          }
          .play_btn {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            background: rgba(0, 0, 0, 0.4);
            width: 1rem;
            height: 1rem;
            text-align: center;
            line-height: 1rem;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            cursor: pointer;
            i {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
              height: 22px !important;
            }
          }
          > video {
            width: auto;
            height: 100%;
          }
          &:after {
            content: none !important;
          }
          &:before {
            content: none !important;
          }
          -webkit-box-shadow: 0 0 0 !important;
          -moz-box-shadow: 0 0 0 !important;
          box-shadow: 0 0 0 !important;
        }
        .download_btn {
          text-align: center;
          width: 1.1rem;
          height: 0.4rem;
          float: right !important;
          margin-top: 0.2rem;
          background: rgba(246, 248, 249, 1);
          border: 1px solid rgba(211, 211, 211, 1);
          border-radius: 4px;
          line-height: 0.4rem;
          cursor: pointer;
          color: #666666;
          position: relative;
          &:hover {
            color: #ffffff;
            background: #0c70f8;
            border-color: #0c70f8;
          }
          a {
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
          }
        }
      }
      .struc_c_address {
        height: 100%;
        #capMap {
          width: 100%;
          height: 100%;
        }
      }
    }
    .struc-list {
      width: 12.46rem;
      margin: 0 auto;
      padding: 0.44rem 0 0.34rem 0;
      .swiper-container {
        padding: 0.02rem 0.5rem;
        &:before {
          display: block;
          content: "";
          width: 0.5rem;
          height: 110%;
          background: #ffffff;
          position: absolute;
          left: 0;
          z-index: 9;
          border: 1px solid #ffffff;
        }
        &:after {
          display: block;
          content: "";
          width: 0.5rem;
          height: 110%;
          background: #ffffff;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 9;
          border: 1px solid #ffffff;
        }
        .swiper-button-next {
          right: 0;
        }
        .swiper-button-prev {
          left: 0;
        }
        .swiper-slide {
          .swiper_img_item {
            cursor: pointer;
            border: 1px solid #ffffff;
            padding: 2px;
            .vl_jfo_sim {
              font-size: 0.14rem;
              height: 0.3rem;
              margin-top: 0;
              /*display: inline-block;*/
              white-space: nowrap;
              text-align: center;
              color: #999999;
              i {
                margin-right: 0;
              }
            }
          }
          .active {
            border-color: #0c70f8;
            .vl_jfo_sim {
              color: #0c70f8;
            }
          }
        }
      }
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
