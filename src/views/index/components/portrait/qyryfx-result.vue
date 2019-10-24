<template>
  <div class="qyryfx_result">
    <!-- 面包屑通用样式 -->
    <div class="vc_gcck_bd">
      <div
        is="vlBreadcrumb"
        :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
            {name: '区域人员分析', routerName: 'portrait_qyryfx' }, { name: '分析结果'}]"
      ></div>
    </div>
    <div class="content_box">
      <div class="left">
        <vue-scroll>
          <template v-if="!isUpdateTask">
            <ul class="result_ul">
              <li class="person_list">
                <span>任务名称：</span>
                <p>{{taskDetail && taskDetail.taskName}}</p>
              </li>
              <li class="person_list">
                <span>关注人群：</span>
                <p>{{taskDetail.taskWebParam && taskDetail.taskWebParam.personGroupNames}}</p>
              </li>
              <li>
                <span>性别：</span>
                <span>{{taskDetail.taskWebParam && taskDetail.taskWebParam.sex ? taskDetail.taskWebParam.sex : '不限'}}</span>
              </li>
              <li>
                <span>年龄段：</span>
                <span>{{taskDetail.taskWebParam && taskDetail.taskWebParam.age ? taskDetail.taskWebParam.age : '不限'}}</span>
              </li>
              <li class="area_list" v-for="(item, index) in taskDetail.taskWebParam && taskDetail.taskWebParam.deviceAndTimeList" :key="index">
                <div>
                  <span>区域1时间：</span>
                  <div class="time_box">
                    <p>{{item.startTime}}</p>
                    <p>{{item.endTime}}</p>
                  </div>
                </div>
                <div>
                  <span>区域1设备：</span>
                  <p>{{item.deviceNames && item.deviceNames ? item.deviceNames : '无'}}</p>
                </div>
              </li>
            </ul>
            <div class="update_task" @click="showUpdateTask">修改任务</div>
          </template>
          <template v-else>
            <el-form :model="qyryfxFrom" ref="qyryfxFrom" class="qyryfx_form">
              <p class="task_name">
                <span>任务名称：</span>
                <span>{{qyryfxFrom.taskName}}</span>
              </p>
              <el-form-item prop="personGroupId" :rules="[{ required: true, message: '该项内容不能为空', trigger: 'blur' }]">
                <el-select
                  ref="personSelect"
                  class="width232"
                  v-model="qyryfxFrom.personGroupId"
                  placeholder="请选择分析人群"
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
              </el-form-item>
              <el-form-item prop="sex">
                <el-select class="width232" v-model="qyryfxFrom.sex" placeholder="请选择性别" clearable>
                  <el-option
                    v-for="item in peopleSexOptions"
                    :key="item.enumField"
                    :label="item.enumValue"
                    :value="item.enumField"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="age">
                <el-select
                  class="width232"
                  v-model="qyryfxFrom.age"
                  placeholder="请选择年龄段"
                  clearable
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
              </el-form-item>
              <el-form-item class="area_time" prop="startTime">
                <span>抓拍时间:</span>
                <el-date-picker
                  v-model="qyryfxFrom.startTime"
                  type="datetime"
                  :clearable="false"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="startDateOptArr"
                  :time-arrow-control="true"
                  placeholder="开始时间"
                  class="width232 vl_date"
                ></el-date-picker>
                <el-date-picker
                  v-model="qyryfxFrom.endTime"
                  :clearable="false"
                  :picker-options="endDateOptArr"
                  :time-arrow-control="true"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="结束时间"
                  class="width232 vl_date vl_date_end"
                ></el-date-picker>
              </el-form-item>
              <el-form-item class="area_select">
                <span class="area_title">抓拍区域:</span>
                <template v-if="isDisabledSelect">
                  <span class="area_map_select area_map_disabled_select">地图区域选择</span>
                </template>
                <template v-else>
                  <span class="area_map_select" @click="showMapDialog" >地图区域选择</span>
                </template>
                <div class="divide"></div>
              </el-form-item>
              <div class="area_list">
                <ul>
                  <li v-for="(item, index) in selectAreaDataList" :key="index">
                    <div class="area_list_title">
                      <span>区域{{index + 1}}</span>
                      <div class="area_list_btn">
                        <i class="vl_icon vl_icon_position_1" @click="showCurrentMapArea(item)"></i>
                        <i class="vl_icon vl_icon_manage_8" @click="deleteSelectArea(index, item.index)"></i>
                      </div>
                    </div>
                    <div class="area_list_time">
                      <span>时间：</span>
                      <div>
                        <p>{{item.startTime}}</p>
                        <p>{{item.endTime}}</p>
                      </div>
                    </div>
                    <div class="area_list_device">
                      <span>设备：</span>
                      <div>{{item.allDeviceNameList && item.allDeviceNameList.join('、') }}</div>
                    </div>
                    <div class="divide"></div>
                  </li>
                </ul>
              </div>
              <el-form-item class="function_form_btn">
                <el-button style="width: 110px;" @click="cancelEdit('qyryfxFrom')">取消</el-button>
                <el-button type="primary" style="width: 110px;" :loading="submitLoading" @click="submitData('qyryfxFrom')">确定</el-button>
              </el-form-item>
            </el-form>
          </template>
        </vue-scroll>
      </div>
      <div class="right">
        <div class="gis_content" id="gis_content">
          <div class="map_rm" id="mapMap"></div>
          <div class="map_control">
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
        <!-- 页面的右边 -->
        <div class="info_right" v-show="infoRightShow">
          <div class="danger_people_wrap">
            <vue-scroll>
              <h3 class="camera_name">
                <span>{{ selectedDevice.deviceName }}</span>
                &nbsp;
                <span>{{'(' + selectedDevice.shotNum + '次)'}}</span>
                <i class="el-icon-close" @click="infoRightShow = false;" title="关闭"></i>
              </h3>
              <div class="danger_people_list">
                <div
                  class="people_item"
                  v-for="(item, index) in currentClickDevice"
                  :key="'people_item' + index"
                >
                  <div v-for="(sItem, sIndex) in item.detailList" :key="'my_swiper' + sIndex">
                    <div class="swiper_contents" v-if="item.currentIndex === sIndex">
                      <div class="shot_times">
                        <p>{{ item.detailList.length + '次'}}</p>
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
                        <img :src="sItem.upPhotoUrl" title="点击放大图片" class="bigImg" alt />
                      </div>
                      <div class="similarity">
                        <p class="similarity_count">{{sItem.semblance}}<span style="font-size:16px">%</span></p>
                        <p class="similarity_title">相似度</p>
                      </div>
                      <div class="img_warp">
                        <img :src="sItem.subStoragePath" title="点击放大图片" class="bigImg" alt />
                      </div>
                      <div class="people_message">
                        <h2 class="name">{{item.name}}</h2>
                        <div class="tips_wrap">
                          <p class="tip" v-show="item.sex">{{item.sex}}</p>
                          <p class="tip" v-show="item.age">{{item.age}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div @click="prev(index)" class="swiper-button-prev change_img"></div>
                  <div @click="next(index)" class="swiper-button-next change_img"></div>
                </div>
              </div>
            </vue-scroll>
          </div>
          <!-- <div class="right_black"></div> -->
        </div>
      </div>
    </div>
    <div is="mapSelector" :activeDeviceList="activeDeviceList1" :hideDBlist='false' :pointChoose="false" :singleArea="true" :editAble="isEditMap" v-show="selectMapType === 1 && (isShowMapAreaDialog === true)" :open="mapDialogVisible1" :showTypes="'DB'" :clear="clearMapSelect1" @mapSelectorEmit="mapPoint"></div>
    <div is="mapSelector" :activeDeviceList="activeDeviceList2" :hideDBlist='false' :pointChoose="false" :singleArea="true" :editAble="isEditMap" v-show="selectMapType === 2 && (isShowMapAreaDialog === true)" :open="mapDialogVisible2" :showTypes="'DB'" :clear="clearMapSelect2" @mapSelectorEmit="mapPoint"></div>
    <div is="mapSelector" :activeDeviceList="activeDeviceList3" :hideDBlist='false' :pointChoose="false" :singleArea="true" :editAble="isEditMap" v-show="selectMapType === 3 && (isShowMapAreaDialog === true)" :open="mapDialogVisible3" :showTypes="'DB'" :clear="clearMapSelect3" @mapSelectorEmit="mapPoint"></div>
    <div is="mapSelector" :activeDeviceList="activeDeviceList4" :hideDBlist='false' :pointChoose="false" :singleArea="true" :editAble="isEditMap" v-show="selectMapType === 4 && (isShowMapAreaDialog === true)" :open="mapDialogVisible4" :showTypes="'DB'" :clear="clearMapSelect4" @mapSelectorEmit="mapPoint"></div>
    <div is="mapSelector" :activeDeviceList="activeDeviceList5" :hideDBlist='false' :pointChoose="false" :singleArea="true" :editAble="isEditMap" v-show="selectMapType === 5 && (isShowMapAreaDialog === true)" :open="mapDialogVisible5" :showTypes="'DB'" :clear="clearMapSelect5" @mapSelectorEmit="mapPoint"></div>
  </div>
</template>
<script>
import mapSelector from '@/components/common/mapSelector.vue';
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
import { mapXupuxian } from "@/config/config.js";
import { getGroupAllList } from "@/views/index/api/api.control.js";
import { getTaskInfosDetail } from '@/views/index/api/api.analysis.js';
import { updateAreaPersonTask } from "@/views/index/api/api.judge.js";
import { objDeepCopy, formatDate, dateOrigin } from "@/utils/util.js";
export default {
  components: { vlBreadcrumb, mapSelector },
  data () {
    return {
      taskDetail: {},
      amap: null, // 地图对象
      infoRightShow: false, // 右边菜单状态
      showTypes: "DB", //设备类型
      selectedDevice: {}, // 当前选中的设备信息
      currentClickDevice: [],
      markerList: [],
      swiper: null,
      isUpdateTask: false, // 是否修改任务
      submitLoading: false,
      startDateOptArr: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      endDateOptArr: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      peopleGroupOptions: [], // 分析人群下拉
      peopleSexOptions: [
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
      qyryfxFrom: {
        taskName: null, // 任务名称
        personGroupId: [], //分析人群
        sex: null, // 性别
        age: "", // 年龄段
        startTime: dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)), // 开始时间
        endTime: new Date(), // 结束时间
      },
      isDisabledSelect: false, // 是否还能区域选择
      selectAreaDataList: [], // 左侧选中的区域信息
      deleteIndexArr: [], // 删除了的索引
      isShowMapAreaDialog: true, // 是否显示地图弹出框
      mapDialogVisible1: false, // 地图选择弹出框
      mapDialogVisible2: false, // 地图选择弹出框
      mapDialogVisible3: false, // 地图选择弹出框
      mapDialogVisible4: false, // 地图选择弹出框
      mapDialogVisible5: false, // 地图选择弹出框
      clearMapSelect1: null, // 清除地图选择
      clearMapSelect2: null, // 清除地图选择
      clearMapSelect3: null, // 清除地图选择
      clearMapSelect4: null, // 清除地图选择
      clearMapSelect5: null, // 清除地图选择
      activeDeviceList1: [], // 已有的设备
      activeDeviceList2: [], // 已有的设备
      activeDeviceList3: [], // 已有的设备
      activeDeviceList4: [], // 已有的设备
      activeDeviceList5: [], // 已有的设备
      selectMapType: 0, // 选择的第几个地图区域
      isEditMap: true, // 地图区域选择是否可以编辑
    }
  },
  created () {
    // 获取到监控人群分组
    getGroupAllList().then(res => {
      if (res) {
        this.peopleGroupOptions = [
          ...res.data.filter(item => item.uid !== null)
        ];
      }
    });
  },
  mounted () {
    if (this.$route.query.taskId) {
      setTimeout(() => {
        this.getDetail();
      }, 1000)
    } else {
      this.initMap();
    }
  },
  methods: {
    // 获取离线任务详情
    getDetail () {
      const id = this.$route.query.taskId;
      if (id) {
        getTaskInfosDetail(id)
          .then(res => {
            if (res && res.data) {
              this.taskDetail = res.data;
              this.taskDetail.taskResult = JSON.parse(this.taskDetail.taskResult);
              this.taskDetail.taskWebParam = JSON.parse(this.taskDetail.taskWebParam);
              let personGroupIdName = []; 
              this.taskDetail.taskWebParam.personGroupId && this.taskDetail.taskWebParam.personGroupId.split(',').map(val => {
                this.peopleGroupOptions.map(item => {
                  if (item.uid === val) {
                    personGroupIdName.push(item.groupName);
                  }
                });
              });
              if (personGroupIdName.length > 0) {
                if (personGroupIdName.length === this.peopleGroupOptions.length) {
                  this.taskDetail.taskWebParam.personGroupNames = '全部人群';
                } else {
                  this.taskDetail.taskWebParam.personGroupNames = personGroupIdName.join('、');
                }
              }
              this.initMap(this.taskDetail.taskResult);

              console.log('taskWebParam', this.taskDetail.taskWebParam)
            }
          })
      }
    },
    // 切换照片
    prev(val) {
      const ind = this.currentClickDevice[val].detailList.length - 1;
      if (this.currentClickDevice[val].currentIndex === 0) {
        const obj = objDeepCopy(this.currentClickDevice[val]);
        obj.currentIndex = ind;
        this.$set(this.currentClickDevice, val, obj);
      } else {
        const obj = objDeepCopy(this.currentClickDevice[val]);
        obj.currentIndex = obj.currentIndex - 1;
        this.$set(this.currentClickDevice, val, obj);
      }
    },
    next(val) {
      const ind = this.currentClickDevice[val].detailList.length - 1;
      if (this.currentClickDevice[val].currentIndex === ind) {
        const obj = objDeepCopy(this.currentClickDevice[val]);
        obj.currentIndex = 0;
        this.$set(this.currentClickDevice, val, obj);
      } else {
        const obj = objDeepCopy(this.currentClickDevice[val]);
        obj.currentIndex = obj.currentIndex + 1;
        this.$set(this.currentClickDevice, val, obj);
      }
    },
    slideToIndex(val, ind) {
      const obj = objDeepCopy(this.currentClickDevice[ind]);
      obj.currentIndex = val;
      this.$set(this.currentClickDevice, ind, obj);
    },
    mapZoomSet (val) {
      if (this.amap) {
        this.amap.setZoom(this.amap.getZoom() + val);
      }
    },
    resetZoom () {
      if (this.amap) {
        this.amap.setZoomAndCenter(15, mapXupuxian.center);
        this.amap.setFitView();
      }
    },
    // 初始化地图
    initMap (data) {
      let _this = this;
      let map = new window.AMap.Map('mapMap', {
        zoom: 15, // 级别
        center: mapXupuxian.center, // 中心点坐标[110.596015, 27.907662]
      });
      map.setMapStyle('amap://styles/whitesmoke');

      _this.amap = map;
      
      if (data) {
        _this.setMarks(data);
      }
    },
    
    /** 点击摄像头查看此摄像头抓拍详情信息 */
    clickGetCameraData(device) {
      this.infoRightShow = true;
      this.currentClickDevice = device;
      for (let i = 0; i < this.currentClickDevice.length; i++) {
        const item = this.currentClickDevice[i];
        if (item.detailList.length) {
          item.currentIndex = item.detailList.length - 1;
          item.detailList = item.detailList.map(item => {
            item.semblance = Number(item.semblance).toFixed(2); // 保留2位小数点
            return item;
          });
        } else {
          item.currentIndex = 0;
        }
      }
    },
    // D设备 B卡口
    setMarks(deviceList = null) {
      for (let j = 0; j < deviceList.length; j++) {
        const deviceItem = deviceList[j];
        if (deviceItem.bayonetName) {
          // const deviceName = deviceItem.deviceName.split('Bayonet_');
          // deviceItem.deviceName = deviceName[1];
          this.doMark(deviceItem, "vl_icon vl_icon_kk");
          break;
        } else {
          this.doMark( deviceItem, "vl_icon vl_icon_sxt");
          break;
        }
      }
    },
    // 地图标记
    doMark(device, sClass) {
      let marker;
      if (device.shotNum > 0) {
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
          position: [device.shotPlaceLongitude, device.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
          offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // extData: obj,
          // 自定义点标记覆盖物内容
          content: `<div class='qyryfx_vl_icon_wrap' title="点击查询设备抓拍照片"> <div class="map_icons ${sClass}"></div> <div class='people_counts_l1 ${level}'> ${device.shotNum}人次 </div> </div>`
        });
        let _this = this;
        // 给标记绑定一个点击事件
        marker.on("click", function() {
          // _this.currentClickDevice = device.areaListWeb;
          _this.clickGetCameraData(device.areaListWeb);
          _this.selectedDevice = device;
        });
        this.markerList = [...this.markerList, marker];
      }
      this.amap.setFitView();
    },
    // 显示地图区域选择弹出框
    showMapDialog () {
      this.isEditMap = true; // 是否可以编辑地图区域

      if (this.deleteIndexArr.length > 0) { // 判断是否删除过区域，，如果删除过，则将删除数组中的一个值赋值给selectMapType
        this.selectMapType = this.deleteIndexArr[0];
      } else {
        this.selectMapType = this.selectAreaDataList.length + 1;
      }

      this.handleSelectType(this.selectMapType);
    },
    // 显示相对应的地图框选区域
    showCurrentMapArea (obj) {
      this.isEditMap = false;
      this.isShowMapAreaDialog = true;
      let zIndex;
      if (this.selectMapType === obj.index) { // 这个因为删除过区域，所以显示的是之前删除过的区域
        zIndex = this.selectMapType;
      } else {
        zIndex = obj.index;
      }
      let activeDeviceList = [];
      if (!obj.isNew) {
        activeDeviceList = [
          ...obj.bayonetList,
          ...obj.deviceList
        ]; // 将已有的设备传到地图选择组件高亮显示
      }
      if (this.isShowMapAreaDialog) {
        switch (zIndex) {
          case 1:
            this.selectMapType = 1;
            this.mapDialogVisible1 = !this.mapDialogVisible1;
            if (!obj.isNew) {
              this.activeDeviceList1 = activeDeviceList;
            } else {
              this.activeDeviceList1 = [];
            }
            break;
          case 2:
            this.selectMapType = 2;
            this.mapDialogVisible2 = !this.mapDialogVisible2;
            if (!obj.isNew) {
              this.activeDeviceList2 = activeDeviceList;
            } else {
              this.activeDeviceList2 = [];
            }
            break;
          case 3:
            this.selectMapType = 3;
            this.mapDialogVisible3 = !this.mapDialogVisible3;
            if (!obj.isNew) {
              this.activeDeviceList3 = activeDeviceList;
            } else {
              this.activeDeviceList3 = [];
            }
            break;
          case 4:
            this.selectMapType = 4;
            this.mapDialogVisible4 = !this.mapDialogVisible4;
            if (!obj.isNew) {
              this.activeDeviceList4 = activeDeviceList;
            } else {
              this.activeDeviceList4 = [];
            }
            break;
          case 5:
            this.selectMapType = 5;
            this.mapDialogVisible5 = !this.mapDialogVisible5;
            if (!obj.isNew) {
              this.activeDeviceList5 = activeDeviceList;
            } else {
              this.activeDeviceList5 = [];
            }
            break;
          default:
            this.selectMapType = 0;
            break;
        }
      }
    },
    handleSelectType (index) {
      switch (index) {
        case 1:
          this.mapDialogVisible1 = !this.mapDialogVisible1;
          break;
        case 2:
          this.mapDialogVisible2 = !this.mapDialogVisible2;
          break;
        case 3:
          this.mapDialogVisible3 = !this.mapDialogVisible3;
          break;
        case 4:
          this.mapDialogVisible4 = !this.mapDialogVisible4;
          break;
        case 5:
          this.mapDialogVisible5 = !this.mapDialogVisible5;
          break;
        default:
          break;
      }
    },
    // 删除某个选中的区域
    deleteSelectArea (idx, index) {
      this.selectAreaDataList.splice(idx, 1);

      this.deleteIndexArr.push(index);

      this.handleClearMap(index);

      this.isShowMapAreaDialog = false;

    },
    handleClearMap (index) {
      switch (index) {
        case 1:
          this.clearMapSelect1 = !this.clearMapSelect1;
          break;
        case 2:
          this.clearMapSelect2 = !this.clearMapSelect2;
          break;
        case 3:
          this.clearMapSelect3 = !this.clearMapSelect3;
          break;
        case 4:
          this.clearMapSelect4 = !this.clearMapSelect4;
          break;
        case 5:
          this.clearMapSelect5 = !this.clearMapSelect5;
          break;
        default:
          break;
      }
    },
    // 获取地图选择的数据
    mapPoint (data) {
      if (data) {

        let allDeviceNameList = [], deviceList = [], bayonetList = [];
        if (data.deviceList.length > 0) {
          data.deviceList.map(item => {
            allDeviceNameList.push(item.deviceName);
            deviceList.push(item.uid);
          })
        }
        if (data.bayonetList.length > 0) {
          data.bayonetList.map(item => {
            allDeviceNameList.push(item.bayonetName);
            bayonetList.push(item.uid);
          })
        }
        const obj = { 
          index: this.deleteIndexArr.length > 0 ? this.selectMapType : this.selectAreaDataList.length + 1,
          startTime: formatDate(this.qyryfxFrom.startTime),
          endTime: formatDate(this.qyryfxFrom.endTime),
          isNew: true,
          deviceList,
          bayonetList,
          allDeviceNameList: allDeviceNameList.length > 0 ? allDeviceNameList : null
        };

        if (this.deleteIndexArr.length > 0) { // 如果之前删除过，则将之前删除的值删除
          this.deleteIndexArr.splice(0, 1);
        }
        this.selectAreaDataList.push(obj);
      }
    },
    // 显示修改任务表单
    showUpdateTask () {
      this.isUpdateTask = true;
      
      const detail = this.taskDetail.taskWebParam;

      this.qyryfxFrom.taskName = detail.taskName;
      this.qyryfxFrom.sex = detail.sex;
      this.qyryfxFrom.age = detail.age && detail.age ? detail.age.split(',') : '';
      this.qyryfxFrom.personGroupId = detail.personGroupId.split(',');

      detail.deviceAndTimeList.map((item, index) => {
        const obj = {
          index: index + 1,
          startTime: item.startTime,
          endTime: item.endTime,
          deviceList: item.deviceIds.split(','),
          bayonetList: item.bayonetIds.split(','),
          isNew: false, // 是否是新增的区域
          allDeviceNameList: item.deviceNames && item.deviceNames ? item.deviceNames.split('、'): ''
        };
        this.selectAreaDataList.push(obj);
      })
    },
    // 取消修改
    cancelEdit () {
      this.isUpdateTask = false;
      this.selectAreaDataList = [];
    },
    // 确认修改任务
    submitData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let deviceAndTimeList = [];
          
          this.selectAreaDataList.map((item, index) => {
            if (item.deviceList.length <= 0 && item.bayonetList.length <= 0) {
               this.$message.warning(
                `您在第${index + 1}个选择区域未选中设备，请您重新选择`
              );
              return;
            } else {
              deviceAndTimeList = [
                ...deviceAndTimeList,
                {
                  deviceIds: item.deviceList.join(),
                  bayonetIds: item.bayonetList.join(),
                  deviceNames: item.allDeviceNameList.join('、'),
                  startTime: item.startTime,
                  endTime: item.endTime
                }
              ];
            }
          });
          const queryParams = {
            uid: this.$route.query.taskId,
            sex: this.qyryfxFrom.sex,
            age: this.qyryfxFrom.age !== "" ? this.qyryfxFrom.age.join() : "",
            personGroupId:
              this.qyryfxFrom.personGroupId !== ""
                ? this.qyryfxFrom.personGroupId.join()
                : "",
            deviceAndTimeList: deviceAndTimeList,
            taskName: this.qyryfxFrom.taskName,
            taskOperationType: 2 // 2--修改
          };

          this.submitLoading = true; // 打开加载效果
          updateAreaPersonTask(queryParams)
            .then(res => {
              if (res.data) {
                this.$message({
                  type: 'success',
                  message: '修改成功',
                  customClass: 'request_tip'
                });
                this.submitLoading = false;
                this.$router.push({name: 'portrait_qyryfx'});
              } else {
                this.submitLoading = false;
              }
            })
            .catch(() => {this.submitLoading = false;})
        }
      })
    }
  }
}
</script>
<style lang="scss">
// 右边菜单
.info_right {
  .select_time {
    // position: relative;
    .el-input__inner {
      position: relative;
      height: 24px;
      border-radius: 12px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      // width: 98px;
      // z-index: 10;
      // left: -5px;
      &:hover {
        border-color: transparent;
      }
    }
    .el-input__icon {
      line-height: normal;
    }
  }
}
</style>
<style lang="scss" scoped>
.__view {
  width: 100%;
}
.width232 {
  width: 100%;
}
.vc_gcck_bd {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 50px; line-height: 50px;
}
.qyryfx_result {
  height: 100%;
  .content_box {
    width: 100%;
    height: 100%;
    padding-top: 50px;
    display: flex;
    overflow: hidden;
    .left {
      width: 272px;
      height: 100%;
      background-color: #ffffff;
      box-shadow: 2px 3px 10px 0px rgba(131,131,131,0.28);
      .result_ul {
        width: 100%;  
        padding-top: 10px;
        padding-left: 20px;
        padding-right: 10px;
        >li {
          width: 100%;
          line-height: 30px;
          display: flex;
          flex-wrap: wrap;
          span:first-child {
            color: #666666;
          }
          span:last-child {
            color: #222222;
          }
        }
        .person_list {
          >span {
            width: 70px;
            display: inline-block;
          }
          >p {
            width: calc(100% - 70px);
            overflow-wrap: break-word;
          }
        }
        .area_list{
          width: 100%;
          display: inherit;
          >div {
            display: flex;
            >span {
              width: 80px;
              display: inline-block;
            }
            >p {
              width: calc(100% - 80px);
            }
          }
        }
        
      }
      .update_task {
        text-align: center;
        color: #ffffff;
        background-color: #0C70F8;
        border-radius: 4px;
        height: 40px;
        width: 110px;
        line-height: 40px;
        margin: 20px auto;
        cursor: pointer;
      }
      .qyryfx_form {
        padding: 10px 20px 0 20px;
        .task_name {
          margin-bottom: 10px;
          span:first-child {
            color: #999999;
          }
          span:last-child {
            color: #333333;
          }
        }
        .area_list {
          >ul {
            margin-bottom: 20px;
            >li {
              margin-top: 20px;
              .divide {
                width: 100%;
                height: 1px;
                border: 1px solid #f2f2f2;
              }
              .area_list_title, .area_list_time, .area_list_device {
                margin-bottom: 10px;
                display: flex;
                // align-items: center;
              }
              .area_list_title {
                justify-content: space-between;
                >span {
                  color: #333333;
                }
                >div {
                  display: flex;
                  align-items: center;
                  i {
                    margin: 0 5px;
                    cursor: pointer;
                  }
                }
              }
              .area_list_time, .area_list_device {
                >span {
                  width: 45px;
                }
                >div {
                  width: calc(100% - 45px);
                  color: #333333;
                }
              }
            }
          }
        }
        /deep/ .el-form-item {
          margin-bottom: 10px;
        }
        .function_form_btn {
          margin-top: 20px;
        }
        .select_type {
          // margin-bottom: 0 !important;
          .select_type_box {
            width: 100%;
            border-radius: 4px;
            color: #666666;
            border: 1px solid #D3D3D3;
            >span {
              text-align: center;
              display: inline-block;
              width: 50%;
              cursor: pointer;
            }
            .active_span {
              color: #ffffff;
              background:rgba(12,112,248,1);
            }
          }
        }
        .area_select {
          // margin-bottom: 0;
          /deep/ .el-form-item__content {
            line-height: 20px !important;
          }
          .area_map_select {
            color: #0C70F8;
            margin-left: 5px;
            cursor: pointer;
          }
          .area_map_disabled_select {
            cursor: auto;
            color: #999999;
          }
          .divide {
            width: 100%;
            height: 1px;
            margin-top: 10px;
            border: 1px dashed #F2F2F2;
          }
        }
        .area_time {
          margin-top: -10px;
          /deep/ .el-form-item__content {
            display: flex;
            flex-wrap: wrap;
            .width232 {
              margin-bottom: 10px;
              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
      }
    }
    .right {
      width: calc(100% - 272px);
      height: 100%;
      // display: flex;
      position: relative;
      //  overflow: hidden;
      // display: -webkit-box;
      // display: -ms-flexbox;
      .info_right {
        // 页面右边
        width: 496px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        background: white;
        box-shadow: 0px 10px 12px 0px rgba(4,24,54,0.2);
        // opacity:0.8;
        > div {
          position: relative;
          height: 100%;
          float: left;
        }
        // 危险人物列表
        .danger_people_wrap {
          width: 100%;
          // margin-right: 28px;
          padding: 0 0px 20px 20px;
          // 摄像头名称
          .camera_name {
            font-size: 14px;
            line-height: 56px;
            height: 56px;
            color: #333333;
            border-bottom: 1px solid #d3d3d3;
            width: 95%;
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
              width: 95%;
              position: relative;
              background: #fff;
              box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
              padding: 20px 0 30px 0px;
              overflow: hidden;
              margin-bottom: 25px;
              .swiper_contents {
                padding-left: 50px;
                position: relative;
                .shot_times {
                  display: flex;
                  height: 24px;
                  line-height: 24px;
                  margin-bottom: 20px;
                  >p {
                    width: 86px;
                    background-color: #E9E9E9;
                    color: #555555;
                    font-size: 12px;
                    border-radius: 12px;
                    text-align: center;
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                  }
                  // position: absolute;
                  // right: 0;
                  // top: -30px;
                  // padding: 0 16px;
                  // line-height: 20px;
                  // border-radius: 10px 0px 0px 10px;
                  // background: #e9e9e9;
                  // font-size: 12px;
                  // color: #555;
                  // text-align: center;
                }
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
                // background: red;
                > img {
                  width: 100%;
                  height: 100%;
                  display: block;
                  border-radius: 3px;
                }
              }
              // 相似度
              .similarity {
                width: 110px;
                float: left;
                text-align: center;
                .similarity_count {
                  font-size: 26px;
                  line-height: 32px;
                  font-weight: bold;
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
        // .right_black {
        //   width: 20px;
        //   background: #eaebed;
        // }
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
        // 地图搜索
        .sd_search {
          position: absolute;
          top: 0.3rem;
          left: 0.3rem;
          z-index: 1000;
          background-color: #fff;
          overflow: hidden;

          > .sd_search_input {
            float: left;
            width: 360px;
            height: 36px;
            line-height: 36px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 3px 10px 0px rgba(99, 99, 99, 0.39);
            border: 0;
            padding: 0 15px;
            border: none;
          }
          > span {
            float: left;
            width: 60px;
            height: 36px;
            line-height: 36px;
            background-color: #0c70f8;
            cursor: pointer;
            text-align: center;
            > i {
              position: relative;
              top: 2px;
              color: #fff;
              font-size: 20px;
            }
          }
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
    
  }
}
</style>