<template>
  <div class="driving-rules">
    <div class>
      <div
        is="vlBreadcrumb"
        :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle_menu'},
          {name: '行车规律分析'}]"
      ></div>
      <!-- <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>行车规律分析</el-breadcrumb-item>
      </el-breadcrumb>-->
    </div>
    <div class="driving-rules-content">
      <!-- 搜索条件 -->
      <div class="info-left" v-show="videoMenuStatus">
        <vue-scroll>
          <!-- 设备搜索 -->
          <div class="selected_device_comp" v-if="treeTabShow" @click="chooseDevice"></div>
          <div class="selected_device" @click="treeTabShow = true;">
            <i class="el-icon-arrow-down"></i>
            <!-- <i class="el-icon-arrow-up"></i> -->
            <div class="device_list" v-if="selectDeviceArr.length > 0">
              <span>{{ selectDeviceArr[0].label }}</span>
              <span
                v-show="selectDeviceArr.length > 1"
                title="展开选中的设备"
                class="device_count"
              >+{{ selectDeviceArr.length - 1 }}</span>
            </div>
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
                >{{ item.name }}</div>-->
              </div>
              <!-- 摄像头树 -->
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
          <!-- 时间 -->
          <div class="time-search date-comp">
            <el-date-picker
              v-model="searchData.time"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="dateChange"
              :clearable="false"
            ></el-date-picker>
          </div>
          <!-- 下划线 -->
          <div class="line"></div>
          <!-- 上传 -->
          <div class="vl_judge_tc_c_item" v-show="selectIndex === 0">
            <el-upload
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
          <div v-show="selectIndex === 1">
            <!-- 车牌号搜索 -->
            <div class="license-plate-search">
              <el-input v-model="searchData.licensePlateNum" placeholder="请输入车牌号码搜索" clearable></el-input>
            </div>
            <!-- 车牌颜色搜索 -->
            <div class="license-plate-color">
              <el-select v-model="searchData.licensePlateColor" clearable placeholder="全部车牌颜色">
                <el-option
                  v-for="item in colorList"
                  :key="item.enumField"
                  :label="item.enumValue"
                  :value="item.enumValue"
                ></el-option>
              </el-select>
            </div>
          </div>
          <!-- 切换查询条件 -->
          <div class="tab-switching" v-show="selectIndex === 0" @click="selectTab(1)">使用车牌号</div>
          <div class="tab-switching" v-show="selectIndex === 1" @click="selectTab(0)">使用图片</div>

          <div class="search-btn">
            <el-button @click="resetSearch">重置</el-button>
            <el-button type="primary" :loading="searching" @click="search">查询</el-button>
          </div>
        </vue-scroll>
      </div>
      <!-- 展开按钮 -->
      <div
        v-show="!videoMenuStatus"
        class="close-menu-o"
        title="展开菜单"
        @click="videoMenuStatus = true;"
      >
        <i class="vl_icon vl_icon_vehicle_03"></i>
      </div>
      <!-- 车辆信息 -->
      <div
        class="info-right"
        v-loading="searching"
        :class="{ 'video-menu-close': !videoMenuStatus }"
      >
        <!-- 行车记录列表 -->
        <div class="driving-record" v-if="videoMenuStatus && deviceList && deviceList.length > 0">
          <vue-scroll>
            <div class="title">
              <p>该车行驶时经过{{nDeviceList.length}}个设备</p>
              <div class="export">
                <el-button type="primary" @click="exportExcel()" :loading="exportLoading">导出</el-button>
              </div>
            </div>
            <div class="table_box">
              <el-table :data="deviceList">
                <el-table-column label="设备名称" prop="deviceName" show-overflow-tooltip></el-table-column>
                <el-table-column label="过车时间" prop="shotTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="时间间隔" prop="timeSlot" show-overflow-tooltip></el-table-column>
                <el-table-column label="参考时间" prop="refTime" show-overflow-tooltip></el-table-column>
              </el-table>
            </div>
          </vue-scroll>
          <!-- 关闭按钮 -->
          <div class="close-menu-c" title="关闭菜单" @click="videoMenuStatus = false;">
            <i class="vl_icon vl_icon_vehicle_02"></i>
          </div>
        </div>
        <!-- 地图信息 -->
        <div class="gis_content" id="gis_content">
          <div class="map_rm" id="mapMap"></div>
          <!-- 地图控制按钮（放大，缩小，定位） -->
          <div class="map_control">
            <ul class="map_rrt_u1">
              <li
                v-for="(item,index) in timeSlot"
                :key="index"
                @click="selectTime(item,index)"
                :class="{'is-active': item.checked}"
              >{{item.label}}</li>
            </ul>
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
  </div>
</template>
<script>
import { ajaxCtx, mapXupuxian } from "@/config/config";
import { dataList } from "@/utils/data.js";
import {
  JtcPOSTAppendixInfo,
  JtcGETAppendixInfoList,
  JtcPUTAppendixsOrder
} from "../../../api/api.judge.js";
import { MapGETmonitorList } from "../../../api/api.map.js";
import { getDrivingAnalysis, postExport } from "../../../api/api.analysis.js";
import {
  random14,
  objDeepCopy,
  formatDate,
  autoDownloadUrl
} from "../../../../../utils/util.js";
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
export default {
  components: { vlBreadcrumb },
  data() {
    return {
      uploadAcion: ajaxCtx.base + "/new", //上传路径
      uploading: false, // 是否上传中
      uploadFileList: [],
      curImageUrl: "", // 当前上传的图片
      historyPicList: [], // 上传历史记录
      historyPicDialog: false,
      loadingHis: false,
      imgData: null,
      searchData: {
        //搜索参数
        time: null,
        licensePlateNum: null, // 车牌号
        licensePlateColor: "" //车牌颜色
      },
      pickerOptions: {
        disabledDate(time) {
          /* let date = new Date();
          let y = date.getFullYear();
          let m =
            date.getMonth() + 1 < 10
              ? "0" + (date.getMonth() + 1)
              : date.getMonth() + 1;
          let d = date.getDate();
          let threeMonths = "";
          let start = "";
          if (parseFloat(m) >= 4) {
            start = y + "-" + (m - 3) + "-" + d;
          } else {
            start = y - 1 + "-" + (m - 3 + 12) + "-" + d;
          }
          threeMonths = new Date(start).getTime(); */
          return time.getTime() > Date.now();
        }
      },
      searching: false,
      selectIndex: 0, //选中，0图片,1车牌号
      colorList: [], //车牌颜色
      map: null, // 地图对象
      mapCenter: [110.594419, 27.908869], //地图中心位
      timeSlot: [
        {
          label: "全部时刻",
          value: 0,
          checked: true,
          key: "allRecords",
          timeQuantums: null
        },
        {
          label: "00:00 - 04:00",
          value: 1,
          checked: false,
          key: "period0_4Records",
          timeQuantums: "00:00-04:00"
        },
        {
          label: "04:00 - 08:00",
          value: 2,
          checked: false,
          key: "period4_8Records",
          timeQuantums: "04:00-08:00"
        },
        {
          label: "08:00 - 12:00",
          value: 3,
          checked: false,
          key: "period8_12Records",
          timeQuantums: "08:00-12:00"
        },
        {
          label: "12:00 - 16:00",
          value: 4,
          checked: false,
          key: "period12_16Records",
          timeQuantums: "12:00-16:00"
        },
        {
          label: "16:00 - 20:00",
          value: 5,
          checked: false,
          key: "period16_20Records",
          timeQuantums: "16:00-20:00"
        },
        {
          label: "20:00 - 24:00",
          value: 6,
          checked: false,
          key: "period20_24Records",
          timeQuantums: "20:00-24:00"
        }
      ],
      selectTimeList: [], //选中的时间段
      deviceList: [],
      nDeviceList: [], //设备列表
      list: {
        allRecords: [],
        period0_4Records: [],
        period4_8Records: [],
        period8_12Records: [],
        period12_16Records: [],
        period16_20Records: [],
        period20_24Records: []
      },
      doubleDeviceList: {},
      videoMenuStatus: true, // 菜单状态
      cameraMapMarkers: [], // 地图标记
      selAreaPolygon: null,
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
      checkAllTree: true, // 树是否全选
      checkAllTreeBay: false,
      bayonetTree: [], // 卡口树
      cameraTree: [],
      videoTreeNodeCount: 0, // 摄像头节点数量
      bayonetTreeNodeCount: 0, // 卡口节点数量
      defaultProps: {
        children: "children",
        label: "label"
      },
      exportLoading: false,
      messageInfo: null,
      hoverActive: false,
    };
  },
  computed: {
    choosedHisPic() {
      return this.historyPicList.filter(x => x.checked);
    }
  },
  mounted() {
    this.setDTime();
    let colorL = this.dicFormater(dataList.plateColor);
    this.colorList = [...colorL[0].dictList];
    console.log("-------colorList------", this.colorList);

    //加载地图
    this.initMap();
    //获取摄像头卡口数据
    this.getMonitorList();
    //获取数据
    /* this.getSearchData(); */
  },
  methods: {
    // 上传图片
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt = file.size / 1024 / 1024 < 100;
      if (!isJPG) {
        if (!document.querySelector(".el-message")) {
          this.$message.error("只能上传 JPG / PNG 格式图片!");
        }
      }
      if (!isLt) {
        if (!document.querySelector(".el-message")) {
          this.$message.error("上传图片大小不能超过 100MB!");
        }
      }
      this.uploading = true;
      return isJPG && isLt;
    },
    //上传成功
    uploadSucess(response, file, fileList) {
      this.uploading = false;
      /* this.compSim = '';
      this.compSimWord = ''; */
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
      this.uploadFileList = fileList;
    },
    //上传失败
    handleError() {
      this.uploading = false;
      if (!document.querySelector(".el-message")) {
        this.$message.error("上传失败");
      }
    },
    //获取上传记录
    showHistoryPic() {
      this.loadingHis = true;
      this.historyPicDialog = true;
      let params = {
        userId: this.$store.state.loginUser.uid,
        fileType: 1
      };
      JtcGETAppendixInfoList(params)
        .then(res => {
          if (res) {
            this.loadingHis = false;
            res.data.forEach(x => (x.checked = false));
            this.historyPicList = res.data;
          }
        })
        .catch(() => {
          this.historyPicDialog = false;
        });
    },
    //删除图片
    delPic() {
      this.uploadFileList.splice(0, 1);
      this.curImageUrl = "";
    },
    //选择最近上传的图片
    chooseHisPic(item) {
      this.historyPicList.forEach(x => {
        x.checked = false;
      });
      item.checked = true;
    },
    //从历史上传图片中上传
    addHisToImg() {
      this.historyPicDialog = false;
      let _ids = [];
      this.choosedHisPic.forEach(x => {
        _ids.push(x.uid);
        this.curImageUrl = x.path;
        this.imgData = x;
      });
      let _obj = {
        appendixInfoIds: _ids.join(",")
      };
      JtcPUTAppendixsOrder(_obj);
    },
    //设置默认时间
    setDTime() {
      let date = new Date();
      let curDate = date.getTime();
      let curS = 1 * 24 * 3600 * 1000;
      let _s =
        new Date(curDate - curS).getFullYear() +
        "-" +
        (new Date(curDate - curS).getMonth() + 1) +
        "-" +
        new Date(curDate - curS).getDate();
      /* let _e =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(); */
      this.searchData.time = [_s, _s];
    },
    //日期选择
    dateChange(val) {
      console.log("-------------val-----------", typeof new Date(val[1]));
      if (
        new Date(val[1]).getTime() - new Date(val[0]).getTime() >=
        3 * 24 * 3600 * 1000
      ) {
        if (!document.querySelector(".el-message")) {
          this.$message.info(
            "最大时间段为3天，超过开始时间3天（72小时）后的时间不可选择!"
          );
        }
        this.setDTime();
      }
    },
    //重置
    resetSearch() {
      this.searchData.licensePlateNum = null;
      this.searchData.licensePlateColor = "";
      this.uploadFileList.splice(0, this.uploadFileList.length);
      this.imgData = null;
      this.curImageUrl = "";
      this.emptyData(1);
      this.$nextTick(() => {
        this.checkAllTree = true;
        this.handleCheckedAll(true);
      });
      this.setDTime();
    },
    //查询
    search() {
      console.log("==================", this.searchData);
      /* this.emptyData(1); */
      let reg = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/;

      if (this.selectIndex === 1) {
        if (
          this.searchData.licensePlateNum &&
          reg.test(this.searchData.licensePlateNum) &&
          this.selectDeviceArr &&
          this.selectDeviceArr.length > 0
        ) {
          this.getSearchData();
        } else if (!this.searchData.licensePlateNum) {
          if (!document.querySelector(".el-message")) {
            this.$message.info("请输入车牌号码");
          }
          return false;
        } else if (!reg.test(this.searchData.licensePlateNum)) {
          if (!document.querySelector(".el-message")) {
            this.$message.info("请正确输入车牌号码");
          }
          return false;
        } else {
          if (!document.querySelector(".el-message")) {
            this.$message.info("请选择设备");
          }
          return false;
        }
      } else if (this.selectIndex === 0) {
        if (
          this.imgData &&
          this.selectDeviceArr &&
          this.selectDeviceArr.length > 0
        ) {
          this.getSearchData();
        } else if (!this.imgData) {
          if (!document.querySelector(".el-message")) {
            this.$message.info("请上传带车牌的清晰图片");
          }
          return false;
        } else {
          if (!document.querySelector(".el-message")) {
            this.$message.info("请选择设备");
          }
          return false;
        }
      }
    },
    //置空数据
    emptyData(val) {
      if (val === 1) {
        this.list = {};
        this.doubleDeviceList = {};
        this.selectTimeList = [
          {
            label: "全部时刻",
            value: 0,
            checked: true,
            key: "allRecords",
            timeQuantums: null
          }
        ];
        this.$set(this.timeSlot[0], "checked", true);
        for (let i = 0; i < this.timeSlot.length; i++) {
          if (this.timeSlot[i].value !== 0) {
            this.$set(this.timeSlot[i], "checked", false);
          }
        }
      }
      this.deviceList = [];
      this.nDeviceList = [];
      this.mapClearMarkers(this.cameraMapMarkers);
    },
    //查询
    getSearchData() {
      let params = {};
      if (this.searchData.time && this.searchData.time.length > 0) {
        params["startDate"] =
          formatDate(this.searchData.time[0], "yyyy-MM-dd") + " 00:00:00";
        params["endDate"] =
          formatDate(this.searchData.time[1], "yyyy-MM-dd") + " 23:59:59";
      }
      if (!this.checkAllTree) {
        if (this.selectCameraArr && this.selectCameraArr.length > 0) {
          let cameraIds = this.selectCameraArr.map(res => res.id);
          params["cameraIds"] = cameraIds.join("-");
        }
        if (this.selectBayonetArr && this.selectBayonetArr.length > 0) {
          let bayonentIds = this.selectBayonetArr.map(res => res.id);
          params["bayonentIds"] = bayonentIds.join("-");
        }
      }
      if (this.selectIndex === 0) {
        if (this.imgData) {
          params["vehicleNumberPic"] = this.imgData.path;
        }
      } else if (this.selectIndex === 1) {
        if (this.searchData.licensePlateNum) {
          params["vehicleNumber"] = this.searchData.licensePlateNum;
        }
        this.searchData.licensePlateColor &&
          (params["plateColor"] = this.searchData.licensePlateColor);
      }
      this.searching = true;
      console.log(
        "======getSearchData=====",
        this.searchData,
        this.imgData,
        JSON.stringify(params)
      );
      getDrivingAnalysis(params)
        .then(res => {
          console.log("-------getDrivingAnalysis------", res);
          if (res && res.data) {
            let data = res.data;
            this.list = data;
            this.doubleDeviceList = objDeepCopy(data);
            if (!this.list.allRecords || this.list.allRecords.length <= 0) {
              this.$message.info("搜索无结果");
            }
            //获取全部时刻
            this.getData();
          }
          this.$nextTick(() => {
            this.searching = false;
          });
        })
        .catch(error => {
          this.searching = false;
          console.log(error);
        });
    },
    //导出
    exportExcel() {
      let params = {},
        drivingDiscipline = {};
      if (this.searchData.time && this.searchData.time.length > 0) {
        drivingDiscipline["startDate"] =
          formatDate(this.searchData.time[0], "yyyy-MM-dd") + " 00:00:00";
        drivingDiscipline["endDate"] =
          formatDate(this.searchData.time[1], "yyyy-MM-dd") + " 23:59:59";
      }
      if (!this.checkAllTree) {
        if (this.selectCameraArr && this.selectCameraArr.length > 0) {
          let cameraIds = this.selectCameraArr.map(res => res.id);
          drivingDiscipline["cameraIds"] = cameraIds.join("-");
        }
        if (this.selectBayonetArr && this.selectBayonetArr.length > 0) {
          let bayonentIds = this.selectBayonetArr.map(res => res.id);
          drivingDiscipline["bayonentIds"] = bayonentIds.join("-");
        }
      }
      if (this.selectTimeList && this.selectTimeList.length > 0) {
        let timeQuantums = this.selectTimeList.map(res => res.timeQuantums);
        drivingDiscipline["timeQuantums"] = timeQuantums.join(",");
      }
      if (this.selectIndex === 0) {
        if (this.imgData) {
          drivingDiscipline["vehicleNumberPic"] = this.imgData.path;
        }
      } else if (this.selectIndex === 1) {
        if (this.searchData.licensePlateNum) {
          drivingDiscipline["vehicleNumber"] = this.searchData.licensePlateNum;
        }
        this.searchData.licensePlateColor &&
          (drivingDiscipline["plateColor"] = this.searchData.licensePlateColor);
      }
      params = {
        drivingDisciplineAnalysisQueryDto: drivingDiscipline,
        viewType: 5 //导出类型：1夜间行车；2车辆查询-抓拍次数；3连续违章-次数；4连续违章-详情；5-行车规律
      };
      this.exportLoading = true;
      console.log("======export=====", JSON.stringify(params));
      postExport(params)
        .then(res => {
          console.log("-------postExport------", res);
          if (res && res.data) {
            autoDownloadUrl(res.data.fileUrl);
          }
          this.$nextTick(() => {
            this.exportLoading = false;
          });
        })
        .catch(error => {
          this.exportLoading = false;
          console.log(error);
        });
    },
    //图片&车牌号条件切换
    selectTab(val) {
      this.selectIndex = val;
    },
    // 地图定位
    resetZoom() {
      if (this.map) {
        this.map.setZoomAndCenter(14, this.mapCenter);
      }
    },
    // 地图缩放
    mapZoomSet(val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
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

      map.setMapStyle("amap://styles/light");
      console.log("===========", map);
      this.map = map;
    },
    //选择时间段
    selectTime(val, index) {
      if(this.messageInfo) {
        this.messageInfo.close()
      }
      this.$set(this.timeSlot[index], "checked", !val.checked);
      if (val.value !== 0) {
        this.$set(this.timeSlot[0], "checked", false);
        //去掉全部时刻的选择项
        this.selectTimeList = this.selectTimeList.filter(
          key => key.value !== 0
        );
        if (this.timeSlot[index].checked) {
          this.selectTimeList.push(this.timeSlot[index]);
        } else {
          this.selectTimeList = this.selectTimeList.filter(
            key => key.value !== val.value
          );
        }
      } else {
        //全部时刻
        this.$set(this.timeSlot[0], "checked", true);
        this.selectTimeList = [];
        this.selectTimeList.push(val);
        for (let i = 0; i < this.timeSlot.length; i++) {
          if (this.timeSlot[i].value !== 0) {
            this.$set(this.timeSlot[i], "checked", false);
          }
        }
      }
      this.selectTimeList.sort(this.sortVal);
      console.log(val, this.timeSlot, this.selectTimeList);
      this.getList();
    },
    //排序
    sortVal(a, b) {
      return a.value - b.value;
    },
    //获取全部时刻
    getData() {
      this.selectTimeList = [
        {
          label: "全部时刻",
          value: 0,
          checked: true,
          key: "allRecords",
          timeQuantums: null
        }
      ];
      //全部时刻
      this.$set(this.timeSlot[0], "checked", true);
      for (let i = 0; i < this.timeSlot.length; i++) {
        if (this.timeSlot[i].value !== 0) {
          this.$set(this.timeSlot[i], "checked", false);
        }
      }
      this.getList();
    },
    //获取数据
    getList() {
      this.emptyData(2);
      let result = [];
      this.list = objDeepCopy(this.doubleDeviceList);
      if (this.list.allRecords) {
        for (let i = 0; i < this.selectTimeList.length; i++) {
          let item = this.selectTimeList[i];
          let temp = result[result.length - 1];
          if (!i) {
            result.push([item]);
            /* if (this.list[item.key] && this.list[item.key].length > 0) {
              this.$set(this.list[item.key][0], "timeSlot", "——");
              this.$set(this.list[item.key][0], "refTime", "——");
            } */
          } else if (
            item.value % 1 === 0 &&
            item.value - temp[temp.length - 1].value == 1
          ) {
            temp.push(item);
          } else {
            result.push([item]);
            /* if (this.list[item.key] && this.list[item.key].length > 0) {
              this.$set(this.list[item.key][0], "timeSlot", "——");
              this.$set(this.list[item.key][0], "refTime", "——");
            } */
          }
          this.deviceList.push(...this.list[item.key]);
        }
        console.log(
          "=====deviceList=====",
          result,
          this.deviceList,
          this.doubleDeviceList
        );
        if(this.deviceList && this.deviceList.length > 0) {
          for(let item of this.deviceList){
            item['shotDate'] = new Date(item.shotTime).getTime()
          }
          this.deviceList.sort(this.sortTime)
          this.$set(this.deviceList[0], "timeSlot", "——");
          this.$set(this.deviceList[0], "refTime", "——");
        }else {
          this.messageInfo =this.$message.info("搜索无数据")
        }
        this.getNDeviceList();
        
        let devArr = objDeepCopy(this.nDeviceList);
        devArr.sort(this.sortLength)
        let maxDev = devArr[devArr.length -1]
        /* this.nDeviceList.sort(this.sortLength)
        this.maxDev = Math.max.apply(Math, this.nDeviceList.map((o) => {return o.data.length})) */
        console.log("------------22222----------",this.nDeviceList)
        this.mapMark(this.nDeviceList, this.cameraMapMarkers,maxDev);
      }
    },
    //排序
    sortTime(a, b) {
      return a.shotDate - b.shotDate;
    },
    //排序
    sortLength(a, b) {
      return a.data.length - b.data.length;
    },
    //获取设备列表
    getNDeviceList() {
      let map = {},
        dest = [];
      for (let i = 0; i < this.deviceList.length; i++) {
        let ai = this.deviceList[i];
        if (!map[ai.deviceId]) {
          dest.push({
            deviceId: ai.deviceId,
            deviceName: ai.deviceName,
            longitude: ai.longitude,
            latitude: ai.latitude,
            data: [ai]
          });
          map[ai.deviceId] = ai;
        } else {
          for (let j = 0; j < dest.length; j++) {
            let dj = dest[j];
            if (dj.deviceId == ai.deviceId) {
              dj.data.push(ai);
              break;
            }
          }
        }
      }
      console.log(dest);
      this.nDeviceList = [...dest];
    },
    // 地图标记
    mapMark(data, aMarkers, maxDev) {
      if (data && data.length > 0) {
        let hoverWindow = null, maxInfoWindow = null;
        let _this = this;
        for (let i = 0; i < data.length; i++) {
          let obj = data[i];
          obj.sid = i + "_" + random14();
          /* let selClass = ""; */
          if (obj.longitude > 0 && obj.latitude > 0) {
            let offSet = [-20, -50];
            if (
              _this.selAreaPolygon &&
              !_this.selAreaPolygon.contains(
                new window.AMap.LngLat(obj.longitude, obj.latitude)
              )
            ) {
              // 多边形存在且不在多边形之中
              /*  selClass = "vl_close"; */
            }
            /* console.log("9999999999",obj.data.length,maxDev.data.length) */
            if(obj.data.length == maxDev.data.length) {
              obj['st'] = 'style="display:block!important"'
            }else {
              obj['st'] = ''
            }
            let content = '<div class="vl_icon vl_icon_vehicle_04 info-window">'+
            '<div ' +obj.st+'  class="vl_map_hover">' +
                '<div class="vl_map_hover_main">' +
                _this.cameraInfo(obj) +
                "</div></div>";
            let marker = new window.AMap.Marker({
              // 添加自定义点标记
              map: _this.map,
              position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
              offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: obj,
              // 自定义点标记覆盖物内容
              content: content
            });
            // myAMap.hoverMarkerHandler(map, marker, obj);
            if (!aMarkers) {
              aMarkers = [];
            }
            aMarkers.push(marker);

            // hover
            /* marker.on("mouseover", function() {   
              let sContent =
                '<div class="vl_map_hover">' +
                '<div class="vl_map_hover_main">' +
                _this.cameraInfo(obj) +
                "</div>";
              hoverWindow = new window.AMap.InfoWindow({
                isCustom: true,
                closeWhenClickMap: true,
                offset: new window.AMap.Pixel(7, -24), // 相对于基点的偏移位置
                content: sContent
              });
              // aCenter = mEvent.target.F.position
              if(obj.data.length < maxDev.data.length) {
                hoverWindow.open(
                  _this.map,
                  new window.AMap.LngLat(obj.longitude, obj.latitude)
                );
              }
              hoverWindow.on("close", function() {
                  console.log("infoWindow close");
                });
            });
            marker.on("mouseout", function() {
              if (hoverWindow) {
                hoverWindow.close();
              }
            }); */
          }
        }

        _this.map.setFitView(); // 执行定位
      }
    },
    /* maxInfoWin(obj) {
      console.log("999999999999",obj)
      let sContent =
                '<div class="vl_map_hover">' +
                '<div class="vl_map_hover_main">' +
                this.cameraInfo(obj) +
                "</div>";
      let infoWindow = new window.AMap.InfoWindow({
                isCustom: true,
                closeWhenClickMap: true,
                offset: new window.AMap.Pixel(7, -24), // 相对于基点的偏移位置
                content: sContent
              });
      // 打开弹窗
      infoWindow.open(this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
    }, */
    // 清除地图标记
    mapClearMarkers(aMarkers) {
      if (this.map && aMarkers && aMarkers.length > 0) {
        this.map.remove(aMarkers);
        aMarkers = [];
      }
    },
    //摄像头信息
    cameraInfo(val) {
      let str = `<p class="name">${val.deviceName}</p>
                 <p class="num">${val.data.length}次</p>
            `;
      return str;
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
          this.$nextTick(() => {
            this.checkAllTree = true;
            this.handleCheckedAll(true);
          });
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
      console.log(
        "选中的数据",
        this.selectDeviceArr,
        this.selectBayonetArr,
        this.selectCameraArr
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.driving-rules {
  height: calc(100% - 50px);
  .breadcrumb_heaer {
    background: #fff;
  }
  .driving-rules-content {
    height: 100%;
    display: flex;
    border-top: 1px solid #d3d3d3;
    // 关闭展开菜单按钮
    @mixin close_menu {
      position: absolute;
      top: calc(50% - 81px);
      font-size: 24px;
      cursor: pointer;
      z-index: 999;
    }
    .info-left {
      width: 272px;
      padding: 20px 0 20px 20px;
      color: #999;
      background: #fff;
      box-shadow: 5px 0px 16px 0px rgba(169, 169, 169, 0.2);
      animation: fadeInLeft 0.4s ease-out 0.3s both;
      .vl_judge_tc_c_item {
        width: 232px;
        height: 232px;
        display: inline-block;
        position: relative;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        overflow: hidden;
        cursor: pointer;
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
      //条件切换
      .tab-switching {
        width: 232px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-top: 10px;
        color: #666;
        background-color: #f2f2f2;
        border: 1px solid #d3d3d3;
        border-radius: 4px;
        margin-bottom: 10px;
        cursor: pointer;
        &:hover {
          color: #0c70f8;
        }
      }
      //下划线
      .line {
        width: 232px;
        height: 1px;
        background-color: #d3d3d3;
        margin: 40px 0;
      }
      //车牌号搜索
      .license-plate-search {
        width: 232px;
        margin-bottom: 10px;
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
    }
    .info-right {
      position: relative;
      width: calc(100% - 272px);
      height: 100%;
      //行车记录
      .driving-record {
        width: 480px;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: #fff;
        padding-left: 20px;
        z-index: 999;
        box-shadow: 2px 3px 10px 0px rgba(131, 131, 131, 0.28);
        animation: fadeInLeft 0.6s ease-out 0.3s both;
        .title {
          display: flex;
          justify-content: space-between;
          padding-right: 20px;
          height: 78px;
          line-height: 78px;
          color: #333;
          font-weight: 600;
          font-size: 16px;
        }
        .table_box {
          padding-right: 20px;
          padding-bottom: 20px;
        }
      }
      //关闭按钮
      .close-menu-c {
        @include close_menu;
        left: 480px;
      }
      //地图样式
      .gis_content {
        height: 100%;
        position: relative;
        .map_rm {
          width: 100%;
          height: 100%;
        }
        //定位
        .map_control {
          position: absolute;
          top: 0.56rem;
          right: 0;
          transition: right 0.3s ease-out;
          animation: fadeInRight 0.4s ease-out 0.4s both;
          .map_rrt_u1 {
            margin-bottom: 0.4rem;
            > li {
              width: 102px;
              height: 0.4rem;
              line-height: 0.4rem;
              background: #fff;
              border: 1px solid #d3d3d3;
              border-radius: 4px;
              margin-bottom: 0.1rem;
              color: #666;
              text-align: center;
              cursor: pointer;
              &.is-active {
                background: linear-gradient(
                  90deg,
                  rgba(8, 106, 234, 1) 0%,
                  rgba(4, 102, 222, 1) 100%
                );
                border: none;
                color: #fff;
              }
            }
          }
          .map_rrt_u2 {
            position: absolute;
            right: 0.16rem;
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
    .close-menu-o {
      @include close_menu;
      left: 0;
    }
    .video-menu-close {
      width: 100%;
    }
  }
}
</style>

<style lang="scss">
.driving-rules {
  .vl_judge_tc_c_item {
    .vl_jtc_upload {
      .el-upload {
        width: 100%;
        height: 100%;
        background: #f2f2f2;
        border: none;
        &:hover {
          background: #2981f8;
          border: none;
        }
        &:hover span {
          color: #fff;
        }
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
  }
  //车牌颜色
  .license-plate-color {
    .el-select {
      width: 232px;
    }
  }
  //时间搜索
  .time-search {
    margin-bottom: 10px;
    .el-date-editor--daterange.el-input,
    .el-date-editor--daterange.el-input__inner,
    .el-date-editor--timerange.el-input,
    .el-date-editor--timerange.el-input__inner {
      width: 232px;
    }
  }
  //搜索按钮
  .search-btn {
    width: 232px;
    text-align: center;
    .el-button {
      width: 45%;
    }
    .el-button--primary {
      background-color: #0c70f8;
      border-color: #0c70f8;
    }
  }
  //导出
  .export {
    .el-button--primary {
      background-color: #0c70f8;
      border-color: #0c70f8;
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
  .info-window {
    position: relative;
    &:hover .vl_map_hover{
      display: block!important;
    }
  }
  .vl_map_hover {
    display: none;
    position: absolute;
    top: 24px;
    right: 12px;
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