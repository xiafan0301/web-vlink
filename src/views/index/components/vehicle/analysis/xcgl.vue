<template>
  <div class="driving-rules">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>行车规律分析</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="driving-rules-content">
      <!-- 搜索条件 -->
      <div class="info-left" v-show="videoMenuStatus">
        <vue-scroll>
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
              <img v-else-if="curImageUrl" :src="curImageUrl">
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
                  :value="item.enumField"
                ></el-option>
              </el-select>
            </div>
          </div>
          <!-- 切换查询条件 -->
          <div class="tab-switching" v-show="selectIndex === 0" @click="selectTab(1)">使用车牌号</div>
          <div class="tab-switching" v-show="selectIndex === 1" @click="selectTab(0)">使用图片</div>
          <!-- 下划线 -->
          <div class="line"></div>
          <!-- 车牌号搜索 -->
          <div class="license-plate-search">
            <el-input v-model="searchData.licensePlateNum" placeholder="请输入车牌号码搜索" clearable></el-input>
          </div>
          <!-- 时间 -->
          <div class="time-search">
            <el-date-picker
              v-model="searchData.time"
              type="daterange"
              range-separator="-"
              value-format="yyyy-MM-dd"
              format="yy/MM/dd"
              :picker-options="pickerOptions"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
          <div class="search-btn">
            <el-button @click="resetSearch">重置</el-button>
            <el-button type="primary" :loading="searching" @click="getVehicleDetail">确定</el-button>
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
        <i :class="isHover ? 'vl_icon vl_icon_vehicle_05' : 'vl_icon vl_icon_vehicle_04'" @mouseenter="isHover = true;" @mouseleave="isHover = false;"></i>
      </div>
      <!-- 车辆信息 -->
      <div class="info-right" v-loading="searching" :class="{ 'video-menu-close': !videoMenuStatus }">
        <!-- 行车记录列表 -->
        <div class="driving-record" v-show="videoMenuStatus">
          <vue-scroll>
            <div class="title">
              <p>该车行驶时经过X个设备</p>
              <div>
                <el-button type="primary">导出</el-button>
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
            <i :class="isHover ? 'vl_icon vl_icon_vehicle_03' : 'vl_icon vl_icon_vehicle_02'" @mouseenter="isHover = true;" @mouseleave="isHover = false;"></i>
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
          <img :src="item.path" alt>
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
import { ajaxCtx } from "@/config/config";
import { dataList } from "@/utils/data.js";
import {
  JtcPOSTAppendixInfo,
  JtcGETAppendixInfoList,
  JtcPUTAppendixsOrder
} from "../../../api/api.judge.js";
export default {
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
            start = y + "-" + (m - 3) + "-" + d;
          } else {
            start = y - 1 + "-" + (m - 3 + 12) + "-" + d;
          }
          threeMonths = new Date(start).getTime();
          return time.getTime() > Date.now() || time.getTime() < threeMonths;
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
          checked: true
        },
        {
          label: "00:00 - 04:00",
          value: 1,
          checked: false
        },
        {
          label: "04:00 - 08:00",
          value: 2,
          checked: false
        },
        {
          label: "08:00 - 12:00",
          value: 3,
          checked: false
        },
        {
          label: "12:00 - 16:00",
          value: 4,
          checked: false
        },
        {
          label: "16:00 - 20:00",
          value: 5,
          checked: false
        },
        {
          label: "20:00 - 24:00",
          value: 6,
          checked: false
        }
      ],
      selectTimeList: [], //选中的时间段
      deviceList: [],
      list: {
        allRecords: [{
              deviceName: "设备1",
              shotTime: "2019-6-20 00:08",
              timeSlot: "1小时10分钟",
              refTime: "1小时",
              deviceId: 1,
              longitude: 110.594972,
              latitude: 27.908316,
            },{
              deviceName: "设备2",
              shotTime: "2019-6-20 01:18",
              timeSlot: "1小时10分钟",
              refTime: "1小时",
              deviceId: 2,
              longitude: 110.595908,
              latitude: 27.909847,
            },{
              deviceName: "设备3",
              shotTime: "2019-6-20 01:48",
              timeSlot: "30分钟",
              refTime: "30分钟",
              deviceId: 3,
              longitude: 110.585509,
              latitude: 27.911629,
            },{
              deviceName: "设备1",
              shotTime: "2019-6-20 04:10",
              timeSlot: "2小时10分钟",
              refTime: "2小时",
              deviceId: 1,
              longitude: 110.594972,
              latitude: 27.908316,
            },{
              deviceName: "设备4",
              shotTime: "2019-6-20 05:10",
              timeSlot: "1小时",
              refTime: "1小时",
              deviceId: 4,
              longitude: 110.586619,
              latitude: 27.917929,
            },
            {
              deviceName: "设备5",
              shotTime: "2019-6-20 07:48",
              timeSlot: "2小时38分钟",
              refTime: "2.5小时",
              deviceId: 5,
              longitude: 110.585404,
              latitude: 27.920138,
            },{
              deviceName: "设备3",
              shotTime: "2019-6-20 08:00",
              timeSlot: "12分钟",
              refTime: "12分钟",
              deviceId: 3,
              longitude: 110.585509,
              latitude: 27.911629,
            },
            {
              deviceName: "设备5",
              shotTime: "2019-6-20 10:00",
              timeSlot: "2小时",
              refTime: "2小时",
              deviceId: 5,
              longitude: 110.585404,
              latitude: 27.920138,
            },
            {
              deviceName: "设备6",
              shotTime: "2019-6-20 11:00",
              timeSlot: "1小时",
              refTime: "1小时",
              deviceId: 6,
              longitude: 110.587003,
              latitude: 27.916535,
            },
            {
              deviceName: "设备7",
              shotTime: "2019-6-20 12:30",
              timeSlot: "1小时30分钟",
              refTime: "1.5小时",
              uid: 7,
              longitude: 110.583937,
              latitude: 27.921475,
            },
            {
              deviceName: "设备8",
              shotTime: "2019-6-20 13:00",
              timeSlot: "0.5小时",
              refTime: "0.5小时",
              uid: 8,
              longitude: 110.584734,
              latitude: 27.922959,
            },
            {
              deviceName: "设备2",
              shotTime: "2019-6-20 15:48",
              timeSlot: "2小时48分钟",
              refTime: "3小时",
              uid: 2,
              longitude: 110.595908,
              latitude: 27.909847,
            }],
        period0_4Records: [{
              deviceName: "设备1",
              shotTime: "2019-6-20 00:08",
              timeSlot: "1小时10分钟",
              refTime: "1小时",
              deviceId: 1,
              longitude: 110.594972,
              latitude: 27.908316,
            },{
              deviceName: "设备2",
              shotTime: "2019-6-20 01:18",
              timeSlot: "1小时10分钟",
              refTime: "1小时",
              deviceId: 2,
              longitude: 110.595908,
              latitude: 27.909847,
            },{
              deviceName: "设备3",
              shotTime: "2019-6-20 01:48",
              timeSlot: "30分钟",
              refTime: "30分钟",
              deviceId: 3,
              longitude: 110.585509,
              latitude: 27.911629,
            }],
        period4_8Records: [{
              deviceName: "设备1",
              shotTime: "2019-6-20 04:10",
              timeSlot: "2小时10分钟",
              refTime: "2小时",
              deviceId: 1,
              longitude: 110.587003,
              latitude: 27.916535,
            },{
              deviceName: "设备4",
              shotTime: "2019-6-20 05:10",
              timeSlot: "1小时",
              refTime: "1小时",
              deviceId: 4,
              longitude: 110.586619,
              latitude: 27.917929,
            },
            {
              deviceName: "设备5",
              shotTime: "2019-6-20 07:48",
              timeSlot: "2小时38分钟",
              refTime: "2.5小时",
              deviceId: 5,
              longitude: 110.585404,
              latitude: 27.920138,
            }],
        period8_12Records: [{
              deviceName: "设备3",
              shotTime: "2019-6-20 08:00",
              timeSlot: "12分钟",
              refTime: "12分钟",
              deviceId: 3,
              longitude: 110.585509,
              latitude: 27.911629,
            },
            {
              deviceName: "设备5",
              shotTime: "2019-6-20 10:00",
              timeSlot: "2小时",
              refTime: "2小时",
              deviceId: 5,
              longitude: 110.585404,
              latitude: 27.920138,
            },
            {
              deviceName: "设备6",
              shotTime: "2019-6-20 11:00",
              timeSlot: "1小时",
              refTime: "1小时",
              deviceId: 6,
              longitude: 110.587003,
              latitude: 27.916535,
            }],
        period12_16Records: [{
              deviceName: "设备7",
              shotTime: "2019-6-20 12:30",
              timeSlot: "1小时30分钟",
              refTime: "1.5小时",
              uid: 7,
              longitude: 110.583937,
              latitude: 27.921475,
            },
            {
              deviceName: "设备8",
              shotTime: "2019-6-20 13:00",
              timeSlot: "0.5小时",
              refTime: "0.5小时",
              uid: 8,
              longitude: 110.584734,
              latitude: 27.922959,
            },
            {
              deviceName: "设备2",
              shotTime: "2019-6-20 15:48",
              timeSlot: "2小时48分钟",
              refTime: "3小时",
              uid: 2,
              longitude: 110.595908,
              latitude: 27.909847,
            }]
      },
      videoMenuStatus: true, // 菜单状态
      isHover: false,
    };
  },
  computed: {
    choosedHisPic() {
      return this.historyPicList.filter(x => x.checked);
    }
  },
  mounted() {
    this.setDTime();
    let colorL = this.dicFormater(dataList.licensePlateColor);
    this.colorList = [...colorL[0].dictList];
    console.log("-------colorList------", this.colorList);

    //加载地图
    this.initMap();
    //获取数据
    this.getList();
  },
  methods: {
    // 上传图片
    beforeAvatarUpload(file) {
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
      this.$message.error("上传失败");
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
      let curS = 30 * 24 * 3600 * 1000;
      let _s =
        new Date(curDate - curS).getFullYear() +
        "-" +
        (new Date(curDate - curS).getMonth() + 1) +
        "-" +
        new Date(curDate - curS).getDate();
      let _e =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      this.searchData.time = [_s, _e];
    },
    //重置
    resetSearch() {
      this.searchData.licensePlateNum = null;
      this.uploadFileList.splice(0, this.uploadFileList.length);
      this.imgData = null;
      this.curImageUrl = "";
      this.setDTime();
      this.getVehicleDetail();
    },
    //查询
    getVehicleDetail() {
      this.searching = true;
      console.log("======getVehicleDetail=====", this.searchData, this.imgData);
      let params = {};
      setTimeout(() => {
        this.searching = false;
      }, 3000);
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

      map.setMapStyle("amap://styles/whitesmoke");
      console.log("===========", map);
      this.map = map;
    },
    //选择时间段
    selectTime(val, index) {
      this.$set(this.timeSlot[index], "checked", !val.checked);
      if (val.value !== 0) {
        this.$set(this.timeSlot[0], "checked", false);
        //去掉全部时刻的选择项
        this.selectTimeList = this.selectTimeList.filter(key => key !== 0);
        if (this.timeSlot[index].checked) {
          this.selectTimeList.push(this.timeSlot[index].value);
        } else {
          this.selectTimeList = this.selectTimeList.filter(
            key => key !== val.value
          );
        }
      } else {
        //全部时刻
        this.$set(this.timeSlot[0], "checked", true);
        this.selectTimeList = [];
        this.selectTimeList.push(val.value);
        for (let i = 0; i < this.timeSlot.length; i++) {
          if (this.timeSlot[i].value !== 0) {
            this.$set(this.timeSlot[i], "checked", false);
          }
        }
      }
      console.log(val, this.timeSlot, this.selectTimeList);
    },
    //获取数据
    getList() {
      this.deviceList = [];
      this.deviceList = [...this.list.allRecords];
      /* for (let item of this.list) {
        this.deviceList.push(...item.childen);
      } */
    },
  }
};
</script>
<style lang="scss" scoped>
.driving-rules {
  height: calc(100% - 54px);
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
      box-shadow: 0px 0px 4px 0px rgba (0, 0, 0, 0.1);
      cursor: pointer;
      z-index: 999;
    }
    .info-left {
      width: 272px;
      padding: 20px 0 20px 20px;
      color: #999;
      background: #fff;
      box-shadow: 5px 0px 16px 0px rgba(169, 169, 169, 0.2);
      .vl_judge_tc_c_item {
        width: 232px;
        height: 232px;
        display: inline-block;
        position: relative;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
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
.driving-rules {
  .vl_judge_tc_c_item {
    .vl_jtc_upload {
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
}
</style>