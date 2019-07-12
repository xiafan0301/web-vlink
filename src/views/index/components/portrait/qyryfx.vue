<template>
  <div class="qyryfx_wrap">
    <!-- 面包屑通用样式 -->
    <div class="link_bread">
      <el-breadcrumb separator=">" class="bread_common">
        <el-breadcrumb-item :to="{ path: '/portrait/menu' }">人像检索</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/portrait/pfcm' }">区域人员分析</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="qyryfx_content">
      <!-- 页面的左边 -->
      <div class="info_left" v-show="videoMenuStatus">
        <vue-scroll>
          <div class="left_top">
            <!-- 搜索 -->
            <div class="search_wrap">
              <el-input
                class="width232"
                v-model="searchCamera"
                suffix-icon="el-icon-search"
                placeholder="搜索地点名称"
                @focus="isSearchResult = true;"
                id="map-sd-search-input"
              ></el-input>
            </div>
            <!-- 搜索条件 -->
            <div class="search_condition">
              <div class="condition_title">设定分析条件</div>
              <div class="condition">
                <el-select
                  class="width232"
                  v-model="qyryfxFrom.personGroupId"
                  placeholder="选择分析人群"
                  multiple
                  collapse-tags
                >
                  <el-option
                    v-for="item in peopleGroupOptions"
                    :key="item.uid"
                    :label="item.groupName"
                    :value="item.uid"
                  ></el-option>
                </el-select>
              </div>
              <div class="condition">
                <el-select class="width232" v-model="qyryfxFrom.sex" placeholder="选择性别">
                  <el-option
                    v-for="item in peopleSexOptions"
                    :key="item.enumField"
                    :label="item.enumValue"
                    :value="item.enumField"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="condition">
              <el-select
                class="width232"
                v-model="qyryfxFrom.age"
                placeholder="选择年龄段"
                multiple
                collapse-tags
              >
                <el-option
                  v-for="item in peopleAgeOptions"
                  :key="item.enumField"
                  :label="item.enumValue"
                  :value="item.enumField"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="left_bottom">
            <!-- 增加时间区域 -->
            <div class="add_area_title" @click="addArea">
              <span>+&nbsp;增加时间区域</span>
              <i></i>
            </div>
            <!-- 多个时间区域 -->
            <div class="area_item" v-for="(item, index) in drawObj" :key="'area_item' + index">
              <!-- 删除的图标 -->
              <div class="del_icon" v-show="index !== 0">
                <i class="icon" @click="delArea(index, false)" title="删除"></i>
              </div>
              <div class="sd-opts">
                <div class="sd-opts-title">
                  <h4>区域选择</h4>
                  <i class="vl_icon vl_icon_portrait_02" title="定位当前选中区域" @click="setFitV(index)"></i>
                </div>
                <ul>
                  <li>
                    <div
                      :class="{'sd-opts-sed': item.drawActiveType === 1 }"
                      @click="selDrawType(1, index)"
                    >
                      <span class="sd-opts-icon sd-opts-icon1"></span>
                    </div>
                  </li>
                  <li>
                    <div
                      :class="{'sd-opts-sed': item.drawActiveType === 2 }"
                      @click="selDrawType(2, index)"
                    >
                      <span class="sd-opts-icon sd-opts-icon2"></span>
                    </div>
                  </li>
                  <li>
                    <div
                      :class="{'sd-opts-sed': item.drawActiveType === 3 }"
                      @click="selDrawType(3, index)"
                    >
                      <span class="sd-opts-icon sd-opts-icon3"></span>
                    </div>
                  </li>
                  <li>
                    <div
                      :class="{'sd-opts-sed': item.drawActiveType === 4 }"
                      @click="selDrawType(4, index)"
                    >
                      <span class="sd-opts-icon sd-opts-icon4"></span>
                    </div>
                  </li>
                  <li>
                    <div
                      :class="{'sd-opts-sed': item.drawActiveType === 5 }"
                      @click="selDrawType(5, index)"
                    >
                      <span class="sd-opts-icon sd-opts-icon5"></span>
                    </div>
                  </li>
                </ul>
              </div>
              <!-- 选择时间 -->
              <div class="select_date">
                <div class="time-search">
                  <p>开始</p>
                  <el-date-picker
                    v-model="item.startTime"
                    type="datetime"
                    :clearable="false"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="startDateOptArr[index]"
                    placeholder="开始时间"
                    class="width212px"
                    @change="timeChange(index)"
                  ></el-date-picker>
                </div>
                <div class="time-search">
                  <p>结束</p>
                  <el-date-picker
                    v-model="item.endTime"
                    :clearable="false"
                    :picker-options="endDateOptArr[index]"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    default-time="23:59:59"
                    placeholder="结束时间"
                    class="width212px"
                    @change="timeChange(index, 'end')"
                  ></el-date-picker>
                </div>
              </div>
            </div>
          </div>
          <!-- 按钮 -->
          <div class="search_btn">
            <el-button @click="resetLeftMenu">重置</el-button>
            <el-button type="primary" @click="submitData">确定</el-button>
          </div>
        </vue-scroll>
      </div>
      <!-- 展开按钮 -->
      <div v-show="!videoMenuStatus" class="close-menu-o" title="展开菜单" @click="openMenu">
        <i class="vl_icon vl_icon_vehicle_03"></i>
      </div>
      <!-- 页面的中部 -->
      <div class="info_center">
        <!-- 关闭按钮 -->
        <div class="close-menu-c" title="关闭菜单" v-show="videoMenuStatus" @click="closeMenu">
          <i class="vl_icon vl_icon_vehicle_02"></i>
        </div>
        <!-- 地图信息 -->
        <div class="gis_content" id="gis_content">
          <div class="map_rm" id="mapMap"></div>
          <!-- 地图控制按钮（放大，缩小，定位） -->
          <div class="map_control">
            <!-- 摄像头拍摄数量 -->
            <div class="photo_count_level">
              <div class="colors">
                <div></div>
                <p>&gt;500</p>
              </div>
              <div class="colors">
                <div></div>
                <p>201-500</p>
              </div>
              <div class="colors">
                <div></div>
                <p>101-200</p>
              </div>
              <div class="colors">
                <div></div>
                <p>51-100</p>
              </div>
              <div class="colors">
                <div></div>
                <p>20-50</p>
              </div>
              <div class="colors">
                <div></div>
                <p>&lt;20</p>
              </div>
            </div>
            <ul class="map_rrt_u2">
              <li @click="resetZoom">
                <i class="el-icon-aim"></i>
              </li>
              <li>
                <i class="el-icon-plus" @click="mapZoomSet(1)"></i>
              </li>
              <li>
                <i class="el-icon-minus" @click="mapZoomSet(-1)"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- 页面的右边 -->
      <div class="info_right" v-show="infoRightShow">
        <div class="danger_people_wrap">
          <vue-scroll>
            <h3 class="camera_name">
              <span>{{ selectedDevice.deviceName }}</span>
              &nbsp;
              <span>{{'(' + currentClickDevice.shotNum + '次)'}}</span>
              <i class="el-icon-close" @click="infoRightShow = false;" title="关闭"></i>
            </h3>
            <div class="danger_people_list">
              <div
                class="people_item"
                v-for="(item, index) in cameraPhotoList"
                :key="'people_item' + index"
              >
                <div v-for="(sItem, sIndex) in item.detailList" :key="'my_swiper' + sIndex">
                  <div class="swiper_contents" v-if="item.currentIndex === sIndex">
                    <div class="img_warp">
                      <img :src="sItem.upPhotoUrl" alt />
                    </div>
                    <div class="similarity">
                      <p class="similarity_count">{{sItem.semblance}}</p>
                      <p class="similarity_title">相似度</p>
                      <div class="select_time">
                        <el-select
                          v-model="item.currentIndex"
                          @change="slideToIndex(item.currentIndex, index)"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="(gItem, gIndex) in item.detailList"
                            :key="gIndex"
                            :label="item.shotTimes[gIndex]"
                            :value="gIndex"
                          ></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="img_warp">
                      <img :src="sItem.subStoragePath" alt />
                    </div>
                    <div class="people_message">
                      <h2 class="name">{{item.name}}</h2>
                      <div class="tips_wrap">
                        <p class="tip">{{item.sex}}</p>
                        <p class="tip">{{item.age}}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div @click="prev(index)" class="swiper-button-prev change_img"></div>
                <div @click="next(index)" class="swiper-button-next change_img"></div>
                <!-- <swiper :options="swiperOption" :ref="'mySwiper' + index" :id="'mySwiper' + index">
                  <swiper-slide
                    v-for="(sItem, sIndex) in item.detailList"
                    :key="index + 'my_swiper' + sIndex"
                  >
                    <div class="swiper_contents">
                      <div class="img_warp">
                        <img :src="sItem.upPhotoUrl" alt />
                      </div>
                      <div class="similarity">
                        <p class="similarity_count">{{sItem.semblance}}</p>
                        <p class="similarity_title">相似度</p>
                        <div class="select_time">
                          <el-select
                            v-model="searchCamera"
                            @change="slideToIndex(index, searchCamera)"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="(gItem, gIndex) in item.detailList"
                              :key="gIndex"
                              :label="gIndex + 1"
                              :value="gIndex"
                            ></el-option>
                          </el-select>
                        </div>
                      </div>
                      <div class="img_warp">
                        <img :src="sItem.subStoragePath" alt />
                      </div>
                      <div class="people_message">
                        <h2 class="name">{{item.name}}</h2>
                        <div class="tips_wrap">
                          <p class="tip">{{item.sex}}</p>
                          <p class="tip">{{item.age}}</p>
                        </div>
                      </div>
                    </div>
                  </swiper-slide>
                  <div class="swiper-button-prev change_img" slot="button-prev"></div>
                  <div class="swiper-button-next change_img" slot="button-next"></div>
                </swiper>-->
              </div>
            </div>
          </vue-scroll>
        </div>
        <div class="right_black"></div>
      </div>
    </div>
  </div>
</template>
<script>
import swiper from "vue-awesome-swiper";
import { mapXupuxian } from "@/config/config.js";
import { formatDate } from "@/utils/util.js";
import {
  getAllMonitorList,
  getAllBayonetList
} from "@/views/index/api/api.base.js";
import {
  postShotNumArea,
  getShotNumAreaDetail
} from "@/views/index/api/api.analysis.js";
import { getGroupAllList } from "@/views/index/api/api.control.js";
import { validatePersonNum, validateInteger } from "@/utils/validator.js";
import { random14, objDeepCopy } from "@/utils/util.js";
import { constants } from "crypto";

export default {
  data() {
    return {
      swiperOption: {
        loop: false,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      /*左边搜索表单变量 */
      searchCamera: "",
      qyryfxFrom: {
        personGroupId: null,
        sex: null,
        age: null
      },
      cameraPhotoList: [],
      startDateOptArr: [
        {
          disabledDate: time => {
            if (this.drawObj[0].endTime) {
              return (
                time.getTime() > new Date(this.drawObj[0].endTime).getTime()
                // ||
                // time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 3
              );
            } else {
              return (
                // time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 3
                // ||
                time.getTime() > new Date().getTime()
              );
            }
          }
        }
      ],
      endDateOptArr: [
        {
          disabledDate: time => {
            if (this.drawObj[0].startTime) {
              return (
                time.getTime() <
                  new Date(this.drawObj[0].startTime).getTime() ||
                time.getTime() > new Date().getTime()
              );
            } else {
              return (
                // time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 3 ||
                time.getTime() > new Date().getTime()
              );
            }
          }
        }
      ],
      // searchData: {
      //   endTime: "",
      //   startTime: ""
      // },
      // startDateOpt: {
      //   disabledDate: time => {
      //     if (this.searchData.endTime) {
      //       return (
      //         time.getTime() > new Date(this.searchData.endTime).getTime() ||
      //         time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90
      //       );
      //     } else {
      //       return (
      //         time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90 ||
      //         time.getTime() > new Date().getTime()
      //       );
      //     }
      //   }
      // },
      // endDateOpt: {
      //   disabledDate: time => {
      //     if (this.searchData.startTime) {
      //       return (
      //         time.getTime() < new Date(this.searchData.startTime).getTime() ||
      //         time.getTime() > new Date().getTime()
      //       );
      //     } else {
      //       return (
      //         time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90 ||
      //         time.getTime() > new Date().getTime()
      //       );
      //     }
      //   }
      // },
      peopleGroupOptions: [], // 分析人群下拉
      peopleSexOptions: [
        {
          enumField: null,
          enumValue: "全部"
        },
        {
          enumField: "男",
          enumValue: "男"
        },
        {
          enumField: "女",
          enumValue: "女"
        }
      ], // 性别下拉
      peopleAgeOptions: [
        {
          enumField: "儿童",
          enumValue: "儿童"
        },
        {
          enumField: "少年",
          enumValue: "少年"
        },
        {
          enumField: "青年",
          enumValue: "青年"
        },
        {
          enumField: "中年",
          enumValue: "中年"
        },
        {
          enumField: "老年",
          enumValue: "老年"
        }
      ], // 年龄段下拉
      isSearchResult: false, // 搜索框是否打开
      searchResultList: [1, 2, 3, 4, 5, 6, 7, 8], // 搜索结果的列表
      infoRightShow: false, // 右边菜单状态
      videoMenuStatus: true, // 左边菜单状态
      // 选择地图
      drawType: 0,
      amap: null, // 地图对象
      markerList: [], // 设备卡口标记的数组
      areaList: [], // 点击定位的数组
      mouseTool: null,
      drawType: 0,
      currenDrawobj: 0, // 当前的时间区域
      drawObj: [
        {
          rectangle: {
            /* 'id': {
            marker: null, // 标记对象 (编辑、完成、删除等)
            obj: null // 矩形图层对象
            edtor: null // 编辑对象
          } */
          },
          circle: {},
          polyline: {},
          polygon: {},
          circle10km: {},
          startTime:
            formatDate(new Date().getTime() - 3600 * 1000 * 24, "yyyy-MM-dd") +
            " 00:00:00",
          endTime:
            formatDate(new Date().getTime() - 3600 * 1000 * 24, "yyyy-MM-dd") +
            " 23:59:59",
          drawActiveType: 0 // 当前活跃的选中区域
        }
      ],
      zIndex: 50,
      mapCenter: [110.594419, 27.908869], //地图中心位
      videoMenuStatus: true, // 菜单状态
      cameraMapMarkers: [], // 地图标记
      selAreaPolygon: null,
      listDevice: [], // 设备
      listBayonet: [], // 卡口
      showTypes: "DB", //设备类型
      totalData: [],
      selectedDevice: {}, // 当前选中的设备信息
      currentClickDevice: {},
      swiper: null
    };
  },
  mounted() {
    //获取数据
    this.getTreeList();
    // this.mapEvents();
    //加载地图
    this.initMap();
    // 获取到监控人群分组
    getGroupAllList().then(res => {
      if (res) {
        this.peopleGroupOptions = [
          ...res.data.filter(item => item.uid !== null)
        ];
      }
    });
  },
  methods: {
    // 日期控制
    timeChange(ind, type = "start") {
      this.$nextTick(() => {
        if (this.drawObj[ind].startTime && this.drawObj[ind].endTime) {
          if (
            new Date(this.drawObj[ind].endTime).getTime() -
              new Date(this.drawObj[ind].startTime).getTime() >
            3 * 24 * 3600 * 1000
          ) {
            this.$message.warning("最大选择时间段为三天");
            if (type === "start") {
              this.drawObj[ind].endTime = formatDate(
                new Date(this.drawObj[ind].startTime).getTime() +
                  3600 * 1000 * 24 * 3
              );
            } else {
              this.drawObj[ind].startTime = formatDate(
                new Date(this.drawObj[ind].endTime).getTime() -
                  3600 * 1000 * 24 * 3
              );
            }
          }
        }
      });
    },
    // 切换照片
    prev(val) {
      const ind = this.cameraPhotoList[val].detailList.length - 1;
      if (this.cameraPhotoList[val].currentIndex === 0) {
        const obj = objDeepCopy(this.cameraPhotoList[val]);
        obj.currentIndex = ind;
        this.$set(this.cameraPhotoList, val, obj);
      } else {
        const obj = objDeepCopy(this.cameraPhotoList[val]);
        obj.currentIndex = obj.currentIndex - 1;
        this.$set(this.cameraPhotoList, val, obj);
      }
    },
    next(val) {
      const ind = this.cameraPhotoList[val].detailList.length - 1;
      if (this.cameraPhotoList[val].currentIndex === ind) {
        const obj = objDeepCopy(this.cameraPhotoList[val]);
        obj.currentIndex = 0;
        this.$set(this.cameraPhotoList, val, obj);
      } else {
        const obj = objDeepCopy(this.cameraPhotoList[val]);
        obj.currentIndex = obj.currentIndex + 1;
        this.$set(this.cameraPhotoList, val, obj);
      }
    },
    slideToIndex(val, ind) {
      const obj = objDeepCopy(this.cameraPhotoList[ind]);
      obj.currentIndex = val;
      this.$set(this.cameraPhotoList, ind, obj);
    },
    /**重置左边菜单的方法 */
    resetLeftMenu() {
      this.searchCamera = "";
      // 清空表单
      this.qyryfxFrom = {
        personGroupId: null,
        sex: null,
        age: null
      };
      // 清空选中的区域
      for (let i = 0; i < this.drawObj.length; i++) {
        this.delArea(i, true);
      }
      // 初始化时间区域数组
      this.drawObj = [
        {
          rectangle: {
            /* 'id': {
            marker: null, // 标记对象 (编辑、完成、删除等)
            obj: null // 矩形图层对象
            edtor: null // 编辑对象
          } */
          },
          circle: {},
          polyline: {},
          polygon: {},
          circle10km: {},
          startTime:
            formatDate(new Date().getTime() - 3600 * 1000 * 24, "yyyy-MM-dd") +
            " 00:00:00",
          endTime:
            formatDate(new Date().getTime() - 3600 * 1000 * 24, "yyyy-MM-dd") +
            " 23:59:59",
          drawActiveType: 0 // 当前活跃的选中区域
        }
      ];
      this.startDateOptArr = [
        {
          disabledDate: time => {
            if (this.drawObj[0].endTime) {
              return (
                time.getTime() > new Date(this.drawObj[0].endTime).getTime()
                // ||
                // time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 3
              );
            } else {
              return (
                // time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 3
                // ||
                time.getTime() > new Date().getTime()
              );
            }
          }
        }
      ];
      this.endDateOptArr = [
        {
          disabledDate: time => {
            if (this.drawObj[0].startTime) {
              return (
                time.getTime() <
                  new Date(this.drawObj[0].startTime).getTime() ||
                time.getTime() > new Date().getTime()
              );
            } else {
              return (
                // time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 3 ||
                time.getTime() > new Date().getTime()
              );
            }
          }
        }
      ];
      this.totalData = [];
      this.infoRightShow = false; // 关闭右边的菜单数据
    },
    /** 操作左边菜单方法 */
    openMenu() {
      this.videoMenuStatus = true;
    },
    closeMenu() {
      this.videoMenuStatus = false;
    },
    /** 提交搜索摄像头抓拍记录 */
    submitData() {
      this.totalData = []; // 先清空数据
      for (let i = 0; i < this.drawObj.length; i++) {
        this.selSubmit(i);
      }
      let deviceAndTimeList = [];
      // 校验每一个时间区域中是否都有设备存在
      for (let j = 0; j < this.totalData.length; j++) {
        const area = this.totalData[j];
        if (area.ab.length <= 0 && area.ad.length <= 0) {
          this.$message.warning(
            `您在第${j + 1}个选择区域未选中设备，请您重新选择`
          );
          return;
        } else {
          deviceAndTimeList = [
            ...deviceAndTimeList,
            {
              deviceIds: area.ad.map(item => item.uid).join(),
              // deviceIds: "5",
              bayonetIds: area.ab.map(item => item.uid).join(),
              startTime: this.drawObj[j].startTime,
              endTime: this.drawObj[j].endTime
            }
          ];
        }
      }
      // 处理下拉框
      if (this.qyryfxFrom.personGroupId) {
        this.qyryfxFrom.personGroupId = this.qyryfxFrom.personGroupId.join();
      }
      if (this.qyryfxFrom.age) {
        this.qyryfxFrom.age = this.qyryfxFrom.age.join();
      }
      const queryParams = {
        ...this.qyryfxFrom,
        deviceAndTimeList: deviceAndTimeList
      };
      postShotNumArea(queryParams)
        .then(res => {
          if (res && res.data) {
            if (res.data.length) {
              this.clearMarkList(); // 清除地图标记
              this.setMarks(res.data, false);
            } else {
              this.clearMarkList(); // 清除地图标记
              this.setMarks();
            }
          } else {
            this.clearMarkList(); // 清除地图标记
            this.setMarks();
          }
        })
        .catch(() => {
          this.clearMarkList(); // 清除地图标记
          this.setMarks();
        });
    },
    /** 点击摄像头查看此摄像头抓拍详情信息 */
    clickGetCameraData(device) {
      // console.log("总的摄像头数据", this.totalData);
      // console.log("设备详情", device);
      // 处理下拉框
      if (this.qyryfxFrom.personGroupId) {
        this.qyryfxFrom.personGroupId = this.qyryfxFrom.personGroupId.join();
      }
      if (this.qyryfxFrom.age) {
        this.qyryfxFrom.age = this.qyryfxFrom.age.join();
      }
      // 点击设备获取到人员的信息
      let queryParams;
      if (this.drawObj.length === 1) {
        // 只有一个时间区域
        queryParams = {
          ...this.qyryfxFrom,
          deviceCode: device.viewClassCode,
          startTime: this.drawObj[0].startTime,
          endTime: this.drawObj[0].endTime
        };
      } else {
        // 根据设备的不同来查找时间段
        const timeArr = [];
        for (let i = 0; i < this.totalData.length; i++) {
          const dataItem = this.totalData[i];
          let isAd = false;
          if (dataItem.ad.length > 0) {
            for (let j = 0; j < dataItem.ad.length; j++) {
              if (dataItem.ad[j].viewClassCode === device.viewClassCode) {
                timeArr.push(i);
                isAd = true;
                break;
              }
            }
          }
          if (!isAd) {
            for (let j = 0; j < dataItem.ab.length; j++) {
              if (dataItem.ab[j].viewClassCode === device.viewClassCode) {
                timeArr.push(i);
                break;
              }
            }
          }
        }
        queryParams = {
          ...this.qyryfxFrom,
          deviceCode: device.viewClassCode,
          startTime: timeArr
            .map(item => {
              return this.drawObj[item].startTime;
            })
            .join(),
          endTime: timeArr
            .map(item => {
              return this.drawObj[item].endTime;
            })
            .join()
        };
      }
      getShotNumAreaDetail(queryParams)
        .then(res => {
          if (res && res.data) {
            this.infoRightShow = true;
            this.cameraPhotoList = res.data;
            for (let i = 0; i < this.cameraPhotoList.length; i++) {
              const item = this.cameraPhotoList[i];
              if (item.detailList.length) {
                item.currentIndex = item.detailList.length - 1;
              } else {
                item.currentIndex = 0;
              }
            }
          } else {
            this.cameraPhotoList = [];
          }
        })
        .catch(() => {
          this.cameraPhotoList = [];
        });
    },
    /*处理删除或者添加一个时间区域*/
    addArea() {
      if (this.drawObj.length === 5) {
        this.$message.warning("监控时间区域不能超过5个");
        return;
      }
      const index = this.drawObj.length - 1;
      this.startDateOptArr = [
        ...this.startDateOptArr,
        {
          disabledDate: time => {
            if (this.drawObj[index].endTime) {
              return (
                time.getTime() > new Date(this.drawObj[index].endTime).getTime()
                //   ||
                // time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 3
              );
            } else {
              return (
                // time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 3
                // ||
                time.getTime() > new Date().getTime()
              );
            }
          }
        }
      ];
      this.endDateOptArr = [
        ...this.endDateOptArr,
        {
          disabledDate: time => {
            if (this.drawObj[index].startTime) {
              return (
                time.getTime() <
                  new Date(this.drawObj[index].startTime).getTime() ||
                time.getTime() > new Date().getTime()
              );
            } else {
              return (
                // time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 3 ||
                time.getTime() > new Date().getTime()
              );
            }
          }
        }
      ];
      this.drawObj = [
        ...this.drawObj,
        {
          rectangle: {
            /* 'id': {
            marker: null, // 标记对象 (编辑、完成、删除等)
            obj: null // 矩形图层对象
            edtor: null // 编辑对象
          } */
          },
          circle: {},
          polyline: {},
          polygon: {},
          circle10km: {},
          startTime:
            formatDate(new Date().getTime() - 3600 * 1000 * 24, "yyyy-MM-dd") +
            " 00:00:00",
          endTime:
            formatDate(new Date().getTime() - 3600 * 1000 * 24, "yyyy-MM-dd") +
            " 23:59:59",
          drawActiveType: 0 // 当前活跃的选中区域
        }
      ];
    },
    delArea(val, clearAll) {
      for (let item in this.drawObj[val]) {
        switch (item) {
          case "rectangle":
            this.removeMarkers(1, this.drawObj[val][item].sid);
            break;
          case "circle":
            this.removeMarkers(2, this.drawObj[val][item].sid);
            break;
          case "polyline":
            this.removeMarkers(3, this.drawObj[val][item].sid);
            break;
          case "polygon":
            this.removeMarkers(4, this.drawObj[val][item].sid);
            break;
          case "circle10km":
            this.removeMarkers(5, this.drawObj[val][item].sid);
            break;
          default:
            break;
        }
      }
      if (!clearAll) {
        // 是否全部清除地图标记
        this.drawObj.splice(val, 1);
        this.endDateOptArr.splice(val, 1);
        this.startDateOptArr.splice(val, 1);
      }
    },
    /** 选择地图的方法 */
    // 地图定位
    resetZoom() {
      if (this.amap) {
        this.amap.setZoomAndCenter(14, this.mapCenter);
      }
    },
    // 地图缩放
    mapZoomSet(val) {
      if (this.amap) {
        this.amap.setZoom(this.amap.getZoom() + val);
      }
    },
    // 初始化地图
    initMap() {
      let _this = this;
      let map = new window.AMap.Map("mapMap", {
        zoom: 14, // 级别
        resizeEnable: true,
        center: _this.mapCenter // 中心点坐标
      });
      map.setMapStyle("amap://styles/whitesmoke");
      this.amap = map;
      // 注册监听，当选中某条记录时会触发
      let auto = new window.AMap.Autocomplete({
        input: "map-sd-search-input"
      });
      window.AMap.event.addListener(auto, "select", _this.selectArea);
      // 在地图中添加MouseTool插件
      this.mouseTool = new window.AMap.MouseTool(map);
      this.mouseTool.on("draw", event => {
        // event.obj 为绘制出来的覆盖物对象
        let _sid = random14();
        this.drawClear(this.currenDrawobj);
        // console.log('监听鼠标');
        //  return
        let drawActive = this.drawObj[this.currenDrawobj].drawActiveType; // 获取到当前要画的图形
        if (drawActive === 1) {
          this.drawObj[this.currenDrawobj].rectangle[_sid] = {};
          this.drawObj[this.currenDrawobj].rectangle[_sid].obj = event.obj;
          this.drawObj[this.currenDrawobj].rectangle["sid"] = _sid;
          // this.drawRectangleMark(_sid, event.obj);
        } else if (drawActive === 2) {
          this.drawObj[this.currenDrawobj].circle[_sid] = {};
          this.drawObj[this.currenDrawobj].circle[_sid].obj = event.obj;
          this.drawObj[this.currenDrawobj].circle["sid"] = _sid;
          // this.drawCircleMark(_sid, event.obj);
        } else if (drawActive === 3) {
          this.drawObj[this.currenDrawobj].polyline[_sid] = {};
          this.drawObj[this.currenDrawobj].polyline[_sid].obj = event.obj;
          this.drawObj[this.currenDrawobj].polyline["sid"] = _sid;
          // this.drawPolylineMark(_sid, event.obj);
        } else if (drawActive === 4) {
          this.drawObj[this.currenDrawobj].polygon[_sid] = {};
          this.drawObj[this.currenDrawobj].polygon[_sid].obj = event.obj;
          this.drawObj[this.currenDrawobj].polygon["sid"] = _sid;
          // this.drawPolygonMark(_sid, event.obj);
        } else if (drawActive === 5) {
          // this.drawObj[this.currenDrawobj].circle10km[_sid] = {};
          // this.drawObj[this.currenDrawobj].circle10km[_sid].obj = event.obj;
          // this.drawObj[this.currenDrawobj].circle10km["sid"] = _sid;
        }
        // this.mouseTool.close(false);
        // this.amap.setDefaultCursor();
      });
    },
    drawClear(ind) {
      // 矩形
      if (this.drawObj[ind].rectangle) {
        for (let k in this.drawObj[ind].rectangle) {
          this.drawClearDo(this.drawObj[ind].rectangle[k]);
        }
        this.drawObj[ind].rectangle = {};
      }
      // 圆形
      if (this.drawObj[ind].circle) {
        for (let k in this.drawObj[ind].circle) {
          this.drawClearDo(this.drawObj[ind].circle[k]);
        }
        this.drawObj[ind].circle = {};
      }
      // 线
      if (this.drawObj[ind].polyline) {
        for (let k in this.drawObj[ind].polyline) {
          this.drawClearDo(this.drawObj[ind].polyline[k]);
        }
        this.drawObj[ind].polyline = {};
      }
      // 多边形
      if (this.drawObj[ind].polygon) {
        for (let k in this.drawObj[ind].polygon) {
          this.drawClearDo(this.drawObj[ind].polygon[k]);
        }
        this.drawObj[ind].polygon = {};
      }
      if (this.drawObj[ind].circle10km) {
        for (let k in this.drawObj[ind].circle10km) {
          this.drawClearDo(this.drawObj[ind].circle10km[k]);
        }
        this.drawObj[ind].circle10km = {};
      }
    },
    drawClearDo(obj) {
      if (obj.obj) {
        this.amap.remove(obj.obj);
        obj.obj = null;
      }
      if (obj.marker) {
        this.amap.remove(obj.marker);
        obj.marker = null;
      }
      if (obj.editor) {
        obj.editor.close();
        this.amap.remove(obj.editor);
        obj.editor = null;
      }
      obj = null;
    },
    setFitV(ind) {
      this.getArea(ind);
      this.$nextTick(() => {
        this.amap.setFitView(this.areaList[ind]);        
      });
    },
    getArea(ind) {
      // 矩形
      const curInd = this.drawObj[ind].drawActiveType;
      if (curInd === 1) {
        if (this.areaList.length < ind + 1) {
          this.areaList[ind] = (
            this.drawObj[ind].rectangle[this.drawObj[ind].rectangle.sid].obj
          );
        } else {
          this.areaList.splice(
            ind,
            1,
            this.drawObj[ind].rectangle[this.drawObj[ind].rectangle.sid].obj
          );
        }
      }
      // 圆形
      if (curInd === 2) {
        if (this.areaList.length < ind + 1) {
          this.areaList[ind] = (
            this.drawObj[ind].circle[this.drawObj[ind].circle.sid].obj
          );
        } else {
          this.areaList.splice(
            ind,
            1,
            this.drawObj[ind].circle[this.drawObj[ind].circle.sid].obj
          );
        }
      }
      // 线
      if (curInd === 3) {
        if (this.areaList.length < ind + 1) {
          this.areaList[ind] = (
            this.drawObj[ind].polyline[this.drawObj[ind].polyline.sid].obj
          );
        } else {
          this.areaList.splice(
            ind,
            1,
            this.drawObj[ind].polyline[this.drawObj[ind].polyline.sid].obj
          );
        }
      }
      // 多边形
      if (curInd === 4) {
        if (this.areaList.length < ind + 1) {
          this.areaList[ind] = (
            this.drawObj[ind].polygon[this.drawObj[ind].polygon.sid].obj
          );
        } else {
          this.areaList.splice(
            ind,
            1,
            this.drawObj[ind].polygon[this.drawObj[ind].polygon.sid].obj
          );
        }
      }
      if (curInd === 5) {
        if (this.areaList.length < ind + 1) {
          this.areaList[ind] = (
            this.drawObj[ind].circle10km[this.drawObj[ind].circle10km.sid].obj
          );
        } else {
          this.areaList.splice(
            ind,
            1,
            this.drawObj[ind].circle10km[this.drawObj[ind].circle10km.sid].obj
          );
        }
      }
    },
    mapEvents() {
      let _this = this,
        nContent = $("body");
      // el-icon-edit el-icon-close el-icon-check
      nContent
        .on("click", ".el-icon-close", function() {
          // 删除
          let nOpt = $(this).closest(".ms_marker_opt");
          let _sid = nOpt.attr("_sid"),
            _type = Number(nOpt.attr("_type"));
          _this.removeMarkers(_type, _sid);
        })
        .on("click", ".el-icon-edit", function() {
          // 编辑
          let nOpt = $(this).closest(".ms_marker_opt");
          let _sid = nOpt.attr("_sid"),
            _type = Number(nOpt.attr("_type"));
          nOpt.find(".el-icon-edit").hide();
          nOpt.find(".el-icon-check").show();
          _this.editMarkers(_type, _sid);
        })
        .on("click", ".el-icon-check", function() {
          // 完成
          let nOpt = $(this).closest(".ms_marker_opt");
          let _sid = nOpt.attr("_sid"),
            _type = Number(nOpt.attr("_type"));
          nOpt.find(".el-icon-check").hide();
          nOpt.find(".el-icon-edit").show();
          _this.checkMarkers(_type, _sid);
        });
    },
    removeMarkers(drawType, sid) {
      let obj = null;
      if (drawType === 1) {
        // 矩形
        for (let i = 0; i < this.drawObj.length; i++) {
          if (this.drawObj[i].rectangle.hasOwnProperty(sid)) {
            obj = this.drawObj[i].rectangle[sid];
            break;
          }
        }
      } else if (drawType === 2) {
        // 圆形
        for (let i = 0; i < this.drawObj.length; i++) {
          if (this.drawObj[i].circle.hasOwnProperty(sid)) {
            obj = this.drawObj[i].circle[sid];
            break;
          }
        }
      } else if (drawType === 3) {
        // 折线
        for (let i = 0; i < this.drawObj.length; i++) {
          if (this.drawObj[i].polyline.hasOwnProperty(sid)) {
            obj = this.drawObj[i].polyline[sid];
            break;
          }
        }
      } else if (drawType === 4) {
        // 多边形
        for (let i = 0; i < this.drawObj.length; i++) {
          if (this.drawObj[i].polygon.hasOwnProperty(sid)) {
            obj = this.drawObj[i].polygon[sid];
            break;
          }
        }
      } else if (drawType === 5) {
        for (let i = 0; i < this.drawObj.length; i++) {
          if (this.drawObj[i].circle10km.hasOwnProperty(sid)) {
            obj = this.drawObj[i].circle10km[sid];
            break;
          }
        }
      }
      if (obj) {
        if (obj.obj) {
          this.amap.remove(obj.obj);
          obj.obj = null;
        }
        if (obj.marker) {
          this.amap.remove(obj.marker);
          obj.marker = null;
        }
        if (obj.editor) {
          obj.editor.close();
          this.amap.remove(obj.editor);
          obj.editor = null;
        }
        obj = null;
      }
    },
    editMarkers(drawType, sid) {
      if (drawType === 1) {
        // 矩形
        this.drawRectangleEditor(sid);
      } else if (drawType === 2) {
        this.drawCircleEditor(sid);
      } else if (drawType === 3) {
        this.drawPolylineEditor(sid);
      } else if (drawType === 4) {
        this.drawPolygonEditor(sid);
      } else if (drawType === 5) {
        this.drawCircle10kmEditor(sid);
      }
    },
    checkMarkers(drawType, sid) {
      if (drawType === 1) {
        // 矩形
        for (let i = 0; i < this.drawObj.length; i++) {
          if (
            this.drawObj[i].rectangle[sid] &&
            this.drawObj[i].rectangle[sid].editor
          ) {
            this.drawObj[i].rectangle[sid].editor.close();
            return;
          }
        }
      } else if (drawType === 2) {
        // 圆形
        for (let i = 0; i < this.drawObj.length; i++) {
          if (
            this.drawObj[i].circle[sid] &&
            this.drawObj[i].circle[sid].editor
          ) {
            this.drawObj[i].circle[sid].editor.close();
            return;
          }
        }
      } else if (drawType === 3) {
        // 折线
        for (let i = 0; i < this.drawObj.length; i++) {
          if (
            this.drawObj[i].polyline[sid] &&
            this.drawObj[i].polyline[sid].editor
          ) {
            this.drawObj[i].polyline[sid].editor.close();
            return;
          }
        }
      } else if (drawType === 4) {
        for (let i = 0; i < this.drawObj.length; i++) {
          if (
            this.drawObj[i].polygon[sid] &&
            this.drawObj[i].polygon[sid].editor
          ) {
            this.drawObj[i].polygon[sid].editor.close();
            return;
          }
        }
      } else if (drawType === 5) {
        for (let i = 0; i < this.drawObj.length; i++) {
          if (
            this.drawObj[i].circle10km[sid] &&
            this.drawObj[i].circle10km[sid].editor
          ) {
            this.drawObj[i].circle10km[sid].editor.close();
            return;
          }
        }
      }
    },
    selectArea(e) {
      console.log(e);
      if (e.poi && e.poi.location) {
        this.amap.setZoom(15);
        this.amap.setCenter(e.poi.location);
      }
    },
    selDrawType(drawType, index) {
      // const old = this.drawObj[index].drawActiveType;
      if (this.drawObj[index].drawActiveType === drawType) {
        this.drawObj[index].drawActiveType = 0;
        this.mouseTool.close(false);
        this.amap.setDefaultCursor();
        return;
      } else {
        this.drawObj[index].drawActiveType = drawType; // 当前要画的图形类别
        this.currenDrawobj = index; // 确定当前的时间区域
      }
      // console.log("点击干掉", this.drawObj[this.currenDrawobj].drawActiveType);
      if (drawType === 1) {
        // 矩形
        this.drawRectangle();
      } else if (drawType === 2) {
        // 圆形
        this.drawCircle();
      } else if (drawType === 3) {
        // 折线
        this.drawPolyline();
      } else if (drawType === 4) {
        // 多边形
        this.drawPolygon();
      } else if (drawType === 5) {
        // 多边形
        // if (old === 3) {
        //   console.log("点击干掉", 123);
        // }
        this.drawCircle10km();
      }
    },
    // 矩形
    drawRectangle() {
      this.amap.setDefaultCursor("crosshair");
      this.mouseTool.rectangle({
        strokeColor: "#FA453A",
        strokeOpacity: 1,
        strokeWeight: 1,
        fillOpacity: 0.2,
        fillColor: "#FA453A",
        cursor: "pointer",
        strokeStyle: "solid",
        zIndex: this.zIndex
      });
      this.zIndex += 1;
    },
    drawRectangleEditor(sid) {
      for (let i = 0; i < this.drawObj.length; i++) {
        if (this.drawObj[i].rectangle[sid]) {
          let _this = this,
            obj = this.drawObj[i].rectangle[sid];
          if (obj.editor) {
            obj.editor.open();
          } else {
            let ps = obj.obj.getPath();
            let southWest = ps[3];
            let northEast = ps[1];
            let bounds = new window.AMap.Bounds(southWest, northEast);
            // 删除原来的矩形
            this.amap.remove(obj.obj);
            // 新建可编辑的矩形
            let rectangle = new window.AMap.Rectangle({
              bounds: bounds,
              strokeColor: "#FA453A",
              strokeOpacity: 1,
              strokeWeight: 1,
              fillOpacity: 0.2,
              fillColor: "#FA453A",
              cursor: "pointer",
              zIndex: this.zIndex
            });
            this.zIndex += 1;
            rectangle.setMap(this.amap);
            obj.obj = rectangle;
            let rectangleEditor = new window.AMap.RectangleEditor(
              this.amap,
              rectangle
            );
            /* rectangleEditor.on('end', function(event) {
            // event.target 即为编辑后的矩形对象
          }); */
            rectangleEditor.on("adjust", function(event) {
              // event.target 即为编辑后的矩形对象
              // console.log('event.target.getPath()', event.target.getPath());
              // 需要重新定位marker
              if (obj.marker) {
                obj.marker.setPosition(event.target.getPath()[3]);
              }
            });
            obj.editor = rectangleEditor;
            rectangleEditor.open();
          }
          break;
        }
      }
    },
    drawRectangleMark(sid, obj) {
      // console.log('drawRectangleMark getRadius', obj.getBounds());
      let ap = [obj.getBounds().southwest.Q, obj.getBounds().northeast.P];
      let marker = new window.AMap.Marker({
        // 添加自定义点标记
        map: this.amap,
        // position: obj.B.path[0], // 基点位置 矩形的右上点
        position: ap, // 基点位置 矩形的右上点
        offset: new window.AMap.Pixel(-1, -23), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        zIndex: this.zIndex,
        // extData: obj,
        // 自定义点标记覆盖物内容
        content:
          '<div _sid="' +
          sid +
          '" _type="1" class="ms_marker_opt ms_marker_rectang"><div>' +
          '<i class="el-icon-close" title="删除"></i>' +
          '<i class="el-icon-edit" title="编辑"></i>' +
          '<i class="el-icon-check" title="完成"></i>' +
          "</div></div>"
      });
      this.zIndex += 1;
      for (let i = 0; i < this.drawObj.length; i++) {
        if (this.drawObj[i].rectangle[sid]) {
          this.drawObj[i].rectangle[sid].marker = marker;
          break;
        }
      }
    },
    // 圆形
    drawCircle() {
      this.amap.setDefaultCursor("crosshair");
      this.mouseTool.circle({
        borderWeight: 3,
        strokeColor: "#FA453A",
        strokeOpacity: 1,
        strokeWeight: 1,
        // strokeOpacity: 0.2,
        fillOpacity: 0.2,
        // strokeStyle: 'dashed',
        // strokeDasharray: [10, 10],
        // 线样式还支持 'dashed'
        fillColor: "#FA453A",
        zIndex: this.zIndex
      });
      this.zIndex += 1;
    },
    drawCircleEditor(sid) {
      for (let i = 0; i < this.drawObj.length; i++) {
        if (this.drawObj[i].circle[sid]) {
          let _this = this,
            obj = this.drawObj[i].circle[sid];
          if (obj.editor) {
            obj.editor.open();
          } else {
            // 新建可编辑的矩形
            let circle = new AMap.Circle({
              center: obj.obj.getCenter(),
              radius: obj.obj.getRadius(), //半径
              borderWeight: 3,
              strokeColor: "#FA453A",
              strokeOpacity: 1,
              strokeWeight: 1,
              // strokeOpacity: 0.2,
              fillOpacity: 0.2,
              // strokeStyle: 'dashed',
              // strokeDasharray: [10, 10],
              // 线样式还支持 'dashed'
              fillColor: "#FA453A",
              zIndex: this.zIndex
            });
            this.zIndex += 1;
            // 删除原来的矩形
            this.amap.remove(obj.obj);
            circle.setMap(this.amap);
            obj.obj = circle;
            let circleEditor = new window.AMap.CircleEditor(_this.amap, circle);
            circleEditor.on("adjust", function(event) {
              // event.target 即为编辑后的矩形对象
              // console.log('event.target.getPath()', event.target.getBounds().getSouthWest());
              // 需要重新定位marker
              if (obj.marker) {
                let ne = event.target.getBounds().getSouthWest();
                let c = event.target.getCenter();
                let _q = c.Q + (ne.Q - c.Q) * 0.705;
                let _p = c.P + (ne.P - c.P) * 0.705;
                obj.marker.setPosition([_q, _p]);
              }
            });
            circleEditor.on("move", function(event) {
              // 拖拽圆心调整圆形位置时触发此事件
              // event.target 即为编辑后的矩形对象
              // console.log('event.target.getPath()', event.target.getBounds().getSouthWest());
              // 需要重新定位marker
              if (obj.marker) {
                let ne = event.target.getBounds().getSouthWest();
                let c = event.target.getCenter();
                let _q = c.Q + (ne.Q - c.Q) * 0.705;
                let _p = c.P + (ne.P - c.P) * 0.705;
                obj.marker.setPosition([_q, _p]);
              }
            });
            obj.editor = circleEditor;
            circleEditor.open();
          }
          break;
        }
      }
    },
    drawCircleMark(sid, obj) {
      let ne = obj.getBounds().getSouthWest();
      let c = obj.getCenter();
      let _q = c.Q + (ne.Q - c.Q) * 0.705;
      let _p = c.P + (ne.P - c.P) * 0.705;
      let marker = new window.AMap.Marker({
        // 添加自定义点标记
        map: this.amap,
        position: [_q, _p], // 基点位置 矩形的右上点
        offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        zIndex: this.zIndex,
        // extData: obj,
        // 自定义点标记覆盖物内容
        content:
          '<div _sid="' +
          sid +
          '" _type="2" class="ms_marker_opt ms_marker_circle"><div>' +
          '<i class="el-icon-close" title="删除"></i>' +
          '<i class="el-icon-edit" title="编辑"></i>' +
          '<i class="el-icon-check" title="完成"></i>' +
          "</div></div>"
      });
      this.zIndex += 1;
      for (let i = 0; i < this.drawObj.length; i++) {
        if (this.drawObj[i].circle[sid]) {
          this.drawObj[i].circle[sid].marker = marker;
        }
      }
    },
    // 折线
    drawPolyline() {
      this.amap.setDefaultCursor("crosshair");
      this.mouseTool.polyline({
        strokeColor: "#FA453A",
        strokeOpacity: 1,
        strokeWeight: 2,
        // 线样式还支持 'dashed'
        strokeStyle: "solid",
        zIndex: this.zIndex
        // strokeStyle是dashed时有效
        // strokeDasharray: [10, 5],
      });
      this.zIndex += 1;
    },
    drawPolylineEditor(sid) {
      for (let i = 0; i < this.drawObj.length; i++) {
        if (this.drawObj[i].polyline[sid]) {
          let _this = this,
            obj = this.drawObj[i].polyline[sid];
          if (obj.editor) {
            obj.editor.open();
          } else {
            let polyEditor = new window.AMap.PolyEditor(this.amap, obj.obj);
            polyEditor.on("adjust", function(event) {
              // event.target 即为编辑后的对象
              // 需要重新定位marker
              if (obj.marker) {
                obj.marker.setPosition(
                  event.target.getPath()[event.target.getPath().length - 1]
                );
              }
            });
            obj.editor = polyEditor;
            polyEditor.open();
          }
          break;
        }
      }
    },
    drawPolylineMark(sid, obj) {
      // console.log('drawRectangleMark getRadius', obj.getBounds());
      let p = obj.getPath()[obj.getPath().length - 1];
      let marker = new window.AMap.Marker({
        // 添加自定义点标记
        map: this.amap,
        // position: obj.B.path[0], // 基点位置 矩形的右上点
        position: p, // 基点位置 矩形的右上点
        offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        zIndex: this.zIndex,
        // extData: obj,
        // 自定义点标记覆盖物内容
        content:
          '<div _sid="' +
          sid +
          '" _type="3" class="ms_marker_opt ms_marker_polyline"><div>' +
          '<i class="el-icon-close" title="删除"></i>' +
          '<i class="el-icon-edit" title="编辑"></i>' +
          '<i class="el-icon-check" title="完成"></i>' +
          "</div></div>"
      });
      this.zIndex += 1;
      for (let i = 0; i < this.drawObj.length; i++) {
        if (this.drawObj[i].polyline[sid]) {
          this.drawObj[i].polyline[sid].marker = marker;
          break;
        }
      }
    },
    // 多边形
    drawPolygon() {
      this.amap.setDefaultCursor("crosshair");
      this.mouseTool.polygon({
        strokeColor: "#FA453A",
        strokeOpacity: 1,
        bubble: true,
        strokeWeight: 1,
        fillColor: "#FA453A",
        fillOpacity: 0.2,
        isRing: false,
        zIndex: this.zIndex
      });
      this.zIndex += 1;
    },
    drawPolygonEditor(sid) {
      for (let i = 0; i < this.drawObj.length; i++) {
        if (this.drawObj[i].polygon[sid]) {
          let _this = this,
            obj = this.drawObj[i].polygon[sid];
          if (obj.editor) {
            obj.editor.open();
          } else {
            var polyEditor = new window.AMap.PolyEditor(this.amap, obj.obj);
            polyEditor.on("adjust", function(event) {
              // event.target 即为编辑后的对象
              // 需要重新定位marker
              if (obj.marker) {
                obj.marker.setPosition(
                  event.target.getPath()[event.target.getPath().length - 1]
                );
              }
            });
            obj.editor = polyEditor;
            polyEditor.open();
          }
          break;
        }
      }
    },
    drawPolygonMark(sid, obj) {
      let p = obj.getPath()[obj.getPath().length - 1];
      let marker = new window.AMap.Marker({
        // 添加自定义点标记
        map: this.amap,
        // position: obj.B.path[0], // 基点位置 矩形的右上点
        position: p, // 基点位置 矩形的右上点
        offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        zIndex: this.zIndex,
        // extData: obj,
        // 自定义点标记覆盖物内容
        content:
          '<div _sid="' +
          sid +
          '" _type="4" class="ms_marker_opt ms_marker_polygon"><div>' +
          '<i class="el-icon-close" title="删除"></i>' +
          '<i class="el-icon-edit" title="编辑"></i>' +
          '<i class="el-icon-check" title="完成"></i>' +
          "</div></div>"
      });
      this.zIndex += 1;
      for (let i = 0; i < this.drawObj.length; i++) {
        if (this.drawObj[i].polygon[sid]) {
          this.drawObj[i].polygon[sid].marker = marker;
        }
      }
    },
    drawCircle10km() {
      this.amap.setDefaultCursor("crosshair");
      this.amap.on("click", this.drawCircle10kmClick);
    },
    drawCircle10kmClick(e) {
      this.drawClear(this.currenDrawobj);
      this.mouseTool.close(false);
      let circle = new AMap.Circle({
        center: e.lnglat,
        radius: 1000 * 10, //半径
        borderWeight: 3,
        strokeColor: "#FA453A",
        strokeOpacity: 1,
        strokeWeight: 1,
        // strokeOpacity: 0.2,
        fillOpacity: 0.2,
        fillColor: "#FA453A",
        zIndex: this.zIndex
      });
      this.zIndex += 1;
      circle.setMap(this.amap);
      // 缩放地图到合适的视野级别
      this.amap.setFitView([circle]);
      let _sid = random14();
      this.drawObj[this.currenDrawobj].circle10km[_sid] = {};
      this.drawObj[this.currenDrawobj].circle10km[_sid].obj = circle;
      this.drawObj[this.currenDrawobj].circle10km["sid"] = _sid;
      this.amap.off("click", this.drawCircle10kmClick);
    },
    drawCircle10kmEditor(sid) {
      if (this.drawObj.circle10km[sid]) {
        let _this = this,
          obj = this.drawObj.circle10km[sid];
        if (obj.editor) {
          obj.editor.open();
        } else {
          let circleEditor = new window.AMap.CircleEditor(this.amap, obj.obj);
          circleEditor.on("adjust", function(event) {
            // event.target 即为编辑后的矩形对象
            // console.log('event.target.getPath()', event.target.getBounds().getSouthWest());
            // 需要重新定位marker
            if (obj.marker) {
              let ne = event.target.getBounds().getSouthWest();
              let c = event.target.getCenter();
              let _q = c.Q + (ne.Q - c.Q) * 0.705;
              let _p = c.P + (ne.P - c.P) * 0.705;
              obj.marker.setPosition([_q, _p]);
            }
          });
          circleEditor.on("move", function(event) {
            // 拖拽圆心调整圆形位置时触发此事件
            // event.target 即为编辑后的矩形对象
            // console.log('event.target.getPath()', event.target.getBounds().getSouthWest());
            // 需要重新定位marker
            if (obj.marker) {
              let ne = event.target.getBounds().getSouthWest();
              let c = event.target.getCenter();
              let _q = c.Q + (ne.Q - c.Q) * 0.705;
              let _p = c.P + (ne.P - c.P) * 0.705;
              obj.marker.setPosition([_q, _p]);
            }
          });
          obj.editor = circleEditor;
          circleEditor.open();
        }
      }
    },
    drawCircle10kmMark(sid, obj) {
      let ne = obj.getBounds().getSouthWest();
      let c = obj.getCenter();
      let _q = c.Q + (ne.Q - c.Q) * 0.705;
      let _p = c.P + (ne.P - c.P) * 0.705;
      let marker = new window.AMap.Marker({
        // 添加自定义点标记
        map: this.amap,
        position: [_q, _p], // 基点位置 矩形的右上点
        offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        zIndex: this.zIndex,
        // extData: obj,
        // 自定义点标记覆盖物内容
        content:
          '<div _sid="' +
          sid +
          '" _type="5" class="ms_marker_opt ms_marker_circle"><div>' +
          '<i class="el-icon-close" title="删除"></i>' +
          '<i class="el-icon-edit" title="编辑"></i>' +
          '<i class="el-icon-check" title="完成"></i>' +
          "</div></div>"
      });
      this.zIndex += 1;
      for (let i = 0; i < this.drawObj.length; i++) {
        if (this.drawObj[i].circle10km[sid]) {
          this.drawObj[i].circle10km[sid].marker = marker;
        }
      }
    },
    selSubmit(index) {
      this.submitLoading = true;
      let dObj = {},
        bObj = {};
      if (this.listDevice && this.listDevice.length > 0) {
        for (let i = 0; i < this.listDevice.length; i++) {
          let o = this.listDevice[i];
          // 矩形
          if (this.drawObj[index].rectangle) {
            for (let k in this.drawObj[index].rectangle) {
              let so = this.drawObj[index].rectangle[k];
              if (
                so.obj &&
                so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))
              ) {
                dObj[o.uid] = o;
              }
            }
          }
          // 圆形
          if (this.drawObj[index].circle) {
            for (let k in this.drawObj[index].circle) {
              let so = this.drawObj[index].circle[k];
              if (
                so.obj &&
                so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))
              ) {
                dObj[o.uid] = o;
              }
            }
          }
          // 线
          if (this.drawObj[index].polyline) {
            for (let k in this.drawObj[index].polyline) {
              let so = this.drawObj[index].polyline[k];
              console.log("线", so);
              if (
                window.AMap.GeometryUtil.distanceToLine(
                  new window.AMap.LngLat(o.longitude, o.latitude),
                  so.obj.getPath()
                ) < 200
              ) {
                dObj[o.uid] = o;
              }
            }
          }
          // 多边形
          if (this.drawObj[index].polygon) {
            for (let k in this.drawObj[index].polygon) {
              let so = this.drawObj[index].polygon[k];
              if (
                so.obj &&
                so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))
              ) {
                dObj[o.uid] = o;
              }
            }
          }
          if (this.drawObj[index].circle10km) {
            for (let k in this.drawObj[index].circle10km) {
              let so = this.drawObj[index].circle10km[k];
              if (
                so.obj &&
                so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))
              ) {
                dObj[o.uid] = o;
              }
            }
          }
        }
      }
      if (this.listBayonet && this.listBayonet.length > 0) {
        for (let i = 0; i < this.listBayonet.length; i++) {
          let o = this.listBayonet[i];
          // 矩形
          if (this.drawObj[index].rectangle) {
            for (let k in this.drawObj[index].rectangle) {
              let so = this.drawObj[index].rectangle[k];
              if (
                so.obj &&
                so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))
              ) {
                bObj[o.uid] = o;
              }
            }
          }
          // 圆形
          if (this.drawObj[index].circle) {
            for (let k in this.drawObj[index].circle) {
              let so = this.drawObj[index].circle[k];
              if (
                so.obj &&
                so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))
              ) {
                bObj[o.uid] = o;
              }
            }
          }
          // 线
          if (this.drawObj[index].polyline) {
            for (let k in this.drawObj[index].polyline) {
              let so = this.drawObj[index].polyline[k];
              if (
                window.AMap.GeometryUtil.distanceToLine(
                  new window.AMap.LngLat(o.longitude, o.latitude),
                  so.obj.getPath()
                ) < 200
              ) {
                bObj[o.uid] = o;
              }
            }
          }
          // 多边形
          if (this.drawObj[index].polygon) {
            for (let k in this.drawObj[index].polygon) {
              let so = this.drawObj[index].polygon[k];
              if (
                so.obj &&
                so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))
              ) {
                bObj[o.uid] = o;
              }
            }
          }
          if (this.drawObj[index].circle10km) {
            for (let k in this.drawObj[index].circle10km) {
              let so = this.drawObj[index].circle10km[k];
              if (
                so.obj &&
                so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))
              ) {
                bObj[o.uid] = o;
              }
            }
          }
        }
      }
      let ad = [],
        ab = [];
      for (let k in dObj) {
        ad.push(dObj[k]);
      }
      for (let k in bObj) {
        ab.push(bObj[k]);
      }
      this.totalData.push({
        ad: ad,
        ab: ab
      });
    },
    getTreeList() {
      if (this.showTypes.indexOf("D") >= 0) {
        this.getListDevice();
      }
      if (this.showTypes.indexOf("B") >= 0) {
        this.getListBayonet();
      }
    },
    // 获取到设备数据
    getListDevice() {
      getAllMonitorList({ ccode: mapXupuxian.adcode }).then(res => {
        if (res) {
          this.listDevice = res.data;
          this.setMarks(); // 初始化设备
        }
      });
    },
    // 获取到卡口数据
    getListBayonet() {
      getAllBayonetList({ areaId: mapXupuxian.adcode }).then(res => {
        if (res) {
          this.listBayonet = res.data;
          this.setMarks(); // 初始化卡口
        }
      });
    },
    // D设备 B卡口
    setMarks(deviceList = null, init = true) {
      // 展示设备和卡口
      if (init) {
        // 初始化的时候展示所有的设备
        for (let i = 0; i < this.listDevice.length; i++) {
          this.doMark(this.listDevice[i], deviceList, "vl_icon vl_icon_sxt");
        }
        for (let i = 0; i < this.listBayonet.length; i++) {
          this.doMark(this.listBayonet[i], deviceList, "vl_icon vl_icon_kk");
        }
        this.amap.setFitView();
      } else {
        for (let i = 0; i < this.listDevice.length; i++) {
          const listItem = this.listDevice[i];
          let flag = false;
          for (let j = 0; j < deviceList.length; j++) {
            const deviceItem = deviceList[j];
            if (deviceItem.groupName === listItem.viewClassCode) {
              this.doMark(listItem, deviceItem, "vl_icon vl_icon_sxt", false);
              flag = true;
              break;
            }
          }
          if (!flag) {
            this.doMark(this.listDevice[i], null, "vl_icon vl_icon_sxt");
          }
        }
        for (let i = 0; i < this.listBayonet.length; i++) {
          const listItem = this.listBayonet[i];
          let flag = false;
          for (let j = 0; j < deviceList.length; j++) {
            const deviceItem = deviceList[j];
            if (deviceItem.groupName === listItem.viewClassCode) {
              this.doMark(listItem, deviceItem, "vl_icon vl_icon_kk", false);
              flag = true;
              break;
            }
          }
          if (!flag) {
            this.doMark(this.listBayonet[i], null, "vl_icon vl_icon_kk");
          }
        }
      }
    },
    // 地图标记
    doMark(obj, device, sClass, init = true) {
      let marker;
      if (!init) {
        // 非初始化的状态
        let level;
        if (device.shotNum < 20) {
          level = "level6";
        } else if (device.shotNum <= 50 && device.shotNum >= 20) {
          level = "level5";
        } else if (device.shotNum <= 100 && device.shotNum >= 51) {
          level = "level4";
        } else if (device.shotNum <= 200 && device.shotNum >= 101) {
          level = "level3";
        } else if (device.shotNum <= 500 && device.shotNum >= 201) {
          level = "level2";
        } else if (device.shotNum > 500) {
          level = "level1";
        }
        marker = new window.AMap.Marker({
          // 添加自定义点标记
          map: this.amap,
          position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
          offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // extData: obj,
          // 自定义点标记覆盖物内容
          content: `<div class='qyryfx_vl_icon_wrap'> <div class="map_icons ${sClass}"></div> <div class='people_counts_l1 ${level}'> ${device.shotNum}人次 </div> </div>`
        });
        this.currentClickDevice = device;
        let _this = this;
        // 给标记绑定一个点击事件
        marker.on("click", function() {
          _this.selectedDevice = obj;
          _this.clickGetCameraData(obj);
        });
        this.markerList = [...this.markerList, marker];
      } else {
        marker = new window.AMap.Marker({
          // 添加自定义点标记
          map: this.amap,
          position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
          offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // extData: obj,
          // 自定义点标记覆盖物内容
          content: `<div class="map_icons ${sClass}"></div>`
        });
        this.markerList = [...this.markerList, marker];
      }
    },
    clearMarkList() {
      for (let i = 0; i < this.markerList.length; i++) {
        this.amap.remove(this.markerList[i]);
      }
    }
  },
  beforeDestroy() {
    if (this.amap) {
      this.amap.destroy();
    }
  },
  watch: {
    cameraPhotoList: {
      handler(newName, oldName) {
        // console.log("obj.a changed");
      },
      immediate: true,
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
@mixin close_menu {
  position: absolute;
  top: calc(50% - 81px);
  font-size: 24px;
  box-shadow: 0px 0px 4px 0px rgba (0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 99;
}

.qyryfx_wrap {
  position: relative;
  height: calc(100% - 60px);
  font-size: 14px;
  // 面包屑样式
  .link_bread {
    height: 60px;
    background: #fff;
    .bread_common {
      padding: 23px 0 0 20px;
    }
  }
  // 搜索结果展示
  .search_result {
    position: absolute;
    left: 26px;
    top: 123px;
    z-index: 100;
    width: 368px;
    height: 390px;
    background: #fff;
    box-shadow: 0px 5px 20px 0px rgba(169, 169, 169, 0.3);
    padding: 13px 0 13px 13px;
    font-size: 14px;
    .result_item {
      width: 341px;
      padding: 16px 12px 16px 39px;
      height: 120px;
      position: relative;
      &:hover {
        background: #f6f6f6;
      }
      .index_icon {
        position: absolute;
        top: 12px;
        left: 12px;
        width: 20px;
        height: 26px;
        background: red;
      }
      .camera_icon {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 12px;
        height: 16px;
        background: red;
      }
      // 地址详情
      .address_content {
        overflow: hidden;
        .left {
          float: left;
          width: 206px;
          .add_name {
            color: #0c70f8;
            padding-bottom: 12px;
          }
          .add_detail {
            line-height: 20px;
            color: #999999;
          }
          .add_tel {
            padding-top: 12px;
            .key {
              color: #999999;
            }
            .value {
              color: #666666;
            }
          }
        }
        .add_img {
          float: left;
          width: 70px;
          height: 58px;
          margin-top: 18px;
          background: yellow;
          position: relative;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  // 搜索遮罩
  .search_comp {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
    margin: 0;
    opacity: 0;
    z-index: 1;
  }
  .breadcrumb_heaer {
    background: #fff;
  }
  .qyryfx_content {
    position: relative;
    border-top: 1px solid #d3d3d3;
    height: 100%;
    // height: calc(100% - 60px);
    overflow: hidden;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    // 关闭展开菜单按钮
    // 页面左边
    .info_left {
      position: relative;
      height: 100%;
      width: 272px;
      color: #999;
      background: #fff;
      box-shadow: 5px 0px 16px 0px rgba(169, 169, 169, 0.2);
      animation: fadeInLeft 0.4s ease-out 0.3s both;
      z-index: 100;
      .left_top {
        width: 232px;
        margin: 0 20px;
        padding: 20px 0;
        // 搜索框
        .search_wrap {
          position: relative;
          padding-bottom: 28px;
          border-bottom: 1px solid #d3d3d3;
        }
        // 搜索条件
        .search_condition {
          .condition_title {
            line-height: 50px;
            color: #666666;
            text-indent: 8px;
          }
          .condition {
            padding-bottom: 12px;
          }
        }
      }
      .left_bottom {
        padding-left: 20px;
        background: #fafafa;
        position: relative;
        // 标题
        .add_area_title {
          color: #0c70f8;
          line-height: 46px;
          text-indent: 8px;
          cursor: pointer;
        }
        // 时间选择区域
        .area_item {
          // 删除按钮
          .del_icon {
            height: 38px;
            position: relative;
            > i {
              display: block;
              width: 14px;
              height: 16px;
              position: absolute;
              right: 30px;
              top: 10px;
              cursor: pointer;
              background: url("../../../../assets/img/icons.png") no-repeat;
              background-position: -695px -376px;
              &:hover {
                background-position: -695px -349px;
              }
            }
          }
          // 地图选择器
          .sd-opts {
            width: 232px;
            border: 1px solid #d3d3d3;
            .sd-opts-title {
              display: flex;
              justify-content: space-between;
              padding: 10px;
              color: #333;
              background-color: #fafafa;
              border-bottom: 1px solid #d3d3d3;
              >i {
                cursor: pointer;
              }
            }
            > ul {
              padding: 22px 0 18px 0;
              overflow: hidden;
              > li {
                padding: 5px 0 5px 5px;
                float: left;
                > div {
                  &.sd-opts-sed {
                    background-color: #f2f9ff;
                    > .sd-opts-icon1 {
                      background-image: url(../../../../assets/img/vehicle/cut1m.png);
                    }
                    > .sd-opts-icon2 {
                      background-image: url(../../../../assets/img/vehicle/cut2m.png);
                    }
                    > .sd-opts-icon3 {
                      background-image: url(../../../../assets/img/vehicle/cut3m.png);
                    }
                    > .sd-opts-icon4 {
                      background-image: url(../../../../assets/img/vehicle/cut4m.png);
                    }
                    > .sd-opts-icon5 {
                      background-image: url(../../../../assets/img/vehicle/cut5m.png);
                    }
                  }
                }
              }
            }
          }
          .sd-opts-icon {
            display: inline-block;
            width: 40px;
            height: 40px;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 100% 100%;
            &.sd-opts-icon1 {
              background-image: url(../../../../assets/img/vehicle/cut1.png);
              &:hover {
                background-image: url(../../../../assets/img/vehicle/cut1m.png);
              }
            }
            &.sd-opts-icon2 {
              background-image: url(../../../../assets/img/vehicle/cut2.png);
              &:hover {
                background-image: url(../../../../assets/img/vehicle/cut2m.png);
              }
            }
            &.sd-opts-icon3 {
              background-image: url(../../../../assets/img/vehicle/cut3.png);
              &:hover {
                background-image: url(../../../../assets/img/vehicle/cut3m.png);
              }
            }
            &.sd-opts-icon4 {
              background-image: url(../../../../assets/img/vehicle/cut4.png);
              &:hover {
                background-image: url(../../../../assets/img/vehicle/cut4m.png);
              }
            }
            &.sd-opts-icon5 {
              background-image: url(../../../../assets/img/vehicle/cut5.png);
              &:hover {
                background-image: url(../../../../assets/img/vehicle/cut5m.png);
              }
            }
          }

          .select_date {
            margin-top: 10px;
            .time-search {
              padding-bottom: 10px;
              display: flex;
              p {
                width: 20px;
              }
              .width212px {
                width: 212px;
              }
            }
          }
        }
      }
      .width232 {
        width: 232px;
      }
    }
    // 页面中部
    .info_center {
      position: relative;
      overflow: hidden;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      height: 100%;
      //关闭按钮
      .close-menu-c {
        @include close_menu;
        left: 0px;
      }
      //地图样式
      .gis_content {
        height: 100%;
        position: relative;
        overflow: hidden;
        .map_rm {
          width: 100%;
          height: 100%;
        }
        //定位
        .map_control {
          position: absolute;
          bottom: 0.3rem;
          right: 0.2rem;
          transition: right 0.3s ease-out;
          animation: fadeInRight 0.4s ease-out 0.4s both;
          .photo_count_level {
            background: #fff;
            width: 0.68rem;
            padding: 0.1rem;
            font-size: 12px;
            text-align: center;
            margin-bottom: 0.2rem;
            .colors {
              padding-bottom: 0.1rem;
              > p {
                color: #999999;
              }
              > div {
                width: 0.48rem;
                height: 0.1rem;
                border-radius: 0.05rem;
              }
            }
            .colors:nth-of-type(1) > div {
              background: #fa453a;
            }
            .colors:nth-of-type(2) > div {
              background: #f4ba18;
            }
            .colors:nth-of-type(3) > div {
              background: #8949f3;
            }
            .colors:nth-of-type(4) > div {
              background: #6262ff;
            }
            .colors:nth-of-type(5) > div {
              background: #0c70f8;
            }
            .colors:nth-of-type(6) > div {
              background: #0d9df4;
            }
          }
          // 地图控制按钮
          .map_rrt_u2 {
            width: 0.68rem;
            text-align: center;
            padding: 0 0.1rem;
            font-size: 0.2rem;
            color: #1264f8;
            background-color: #fff;
            > li {
              line-height: 0.5rem;
              border-bottom: 1px solid #eee;
              padding: 0.1rem 0;
              cursor: pointer;
              &:last-child {
                border-bottom: none;
              }
              > i {
                margin-top: 0;
                display: inline-block;
              }
            }
          }
        }
      }
    }
    // .right_show {
    //   width: calc(100% - 496px);
    // }
    // .both_show {
    //   width: calc(100% - 768px);
    // }
    // .none_show {
    //   width: 100%;
    // }
    // .left_show {
    //   width: calc(100% - 272px);
    // }
    .info_right {
      // 页面右边
      width: 496px;
      height: 100%;
      position: relative;
      background: white;
      > div {
        position: relative;
        height: 100%;
        float: left;
      }
      // 危险人物列表
      .danger_people_wrap {
        width: 476px;
        // margin-right: 28px;
        padding: 0 0px 20px 20px;
        // 摄像头名称
        .camera_name {
          font-size: 14px;
          line-height: 56px;
          height: 56px;
          color: #333333;
          border-bottom: 1px solid #d3d3d3;
          width: 428px;
          position: relative;
          > i {
            position: absolute;
            z-index: 10;
            right: 0;
            font-size: 16px;
            top: 20px;
            color: #999;
            cursor: pointer;
          }
        }
        .danger_people_list {
          padding-top: 28px;
          // 人员记录列表
          .people_item {
            width: 428px;
            position: relative;
            background: #fff;
            box-shadow: 0px 5px 16px 0px rgba(169, 169, 169, 0.2);
            padding: 30px 0 30px 0px;
            overflow: hidden;
            margin-bottom: 25px;
            .swiper_contents {
              padding-left: 50px;
            }
            .change_img {
              position: absolute;
              width: 12px;
              height: 26px;
              top: 80px;
              background: url("../../../../assets/img/icons.png") no-repeat;
              cursor: pointer;
            }
            // 点击变成上一张
            .swiper-button-prev {
              left: 22px;
              background-position: -990px -133px;
              &:hover {
                background-position: -972px -133px;
              }
            }
            // 点击下一张
            .swiper-button-next {
              right: 18px;
              background-position: -1038px -133px;
              &:hover {
                background-position: -1019px -133px;
              }
            }
            .img_warp {
              position: relative;
              width: 76px;
              height: 76px;
              float: left;
              border-radius: 3px;
              background: red;
              > img {
                width: 100%;
                height: 100%;
                display: block;
                border-radius: 3px;
              }
            }
            // 相似度
            .similarity {
              width: 88px;
              float: left;
              text-align: center;
              .similarity_count {
                font-size: 26px;
                line-height: 32px;
                // font-family:AuroraBT-BoldCondensed;
                color: #0c70f8;
              }
              .similarity_title {
                color: #333333;
                font-size: 12px;
                line-height: 18px;
                padding-bottom: 2px;
              }
            }
            // 人物信息
            .people_message {
              float: left;
              padding-left: 12px;
              .name {
                font-size: 18px;
                font-weight: bold;
                color: #333;
                line-height: 38px;
              }
              .tips_wrap {
                overflow: hidden;
                .tip {
                  float: left;
                  padding: 0 8px;
                  line-height: 30px;
                  background: #f2f2f2;
                  border: 1px solid #f2f2f2;
                  border-radius: 3px;
                }
                .tip + .tip {
                  margin-left: 8px;
                }
              }
            }
          }
        }
      }
      .right_black {
        width: 20px;
        background: #eaebed;
      }
    }
    .close-menu-o {
      @include close_menu;
      left: 0;
    }
  }
}
</style>

<style lang="scss">
.ms_marker_opt {
  > div {
    word-break: keep-all;
    white-space: nowrap;
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 0 2px;
    > span {
      display: inline-block;
    }
    > i {
      display: inline-block;
      padding: 0 2px;
      font-size: 18px;
    }
    > .el-icon-check {
      display: none;
      color: #67c23a;
    }
    > .el-icon-close {
      color: #fa453a;
    }
    > .el-icon-edit {
      color: #e6a23c;
      font-size: 18px;
    }
  }
  &.ms_marker_rectang {
    left: 0px;
    bottom: 0px;
  }
  &.ms_marker_circle {
    left: 0;
    top: -10px;
  }
  &.ms_marker_polyline {
    left: -10px;
    top: -10px;
  }
  &.ms_marker_polygon {
    left: -10px;
    top: -10px;
  }
}
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
.qyryfx_wrap {
  // 搜索框
  .search_wrap {
    .el-input__inner {
      background: #f2f2f2;
      border-width: 0;
      border-radius: 20px;
    }
  }
  //查询按钮
  .search_btn {
    padding-top: 10px;
    text-align: center;
    padding-bottom: 20px;
    .el-button {
      width: 110px;
    }
  }
  // 右边菜单
  .info_right {
    .similarity {
      .select_time {
        // position: relative;
        .el-input__inner {
          position: relative;
          height: 24px;
          border-radius: 12px;
          // width: 98px;
          // z-index: 10;
          // left: -5px;
        }
        .el-input__icon {
          line-height: normal;
        }
      }
    }
  }
  //弹窗
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
  .__view {
    width: 100% !important; // vue-scroll样式重置
  }
  /* 地图标记 hover */
  .vl_map_hover {
    .vl_map_hover_main {
      width: 178px;
      text-align: center;
      padding: 20px 0;
      .name {
        color: #666;
        padding-bottom: 4px;
      }
      .num {
        color: #333;
        font-size: 20px;
        font-weight: 600;
      }
    }
  }
}
</style>