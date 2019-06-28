<template>
  <div class="qyryfx_wrap">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/portrait/menu' }">检索</el-breadcrumb-item>
        <el-breadcrumb-item>区域人员分析</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="qyryfx_content">
      <!-- 页面的左边 -->
      <div class="info_left" v-show="videoMenuStatus">
        <vue-scroll>
          <!-- 上传 -->
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
        <i class="vl_icon vl_icon_vehicle_03"></i>
      </div>
      <!-- 页面的中部 -->
      <div
        class="info_center"
        v-loading="searching"
        :class="{ both_show: infoRightShow && videoMenuStatus, none_show: !infoRightShow && !videoMenuStatus, right_show: infoRightShow && !videoMenuStatus}"
      >
        <!-- 关闭按钮 -->
        <div
          class="close-menu-c"
          v-show="videoMenuStatus"
          title="关闭菜单"
          @click="videoMenuStatus = false;"
        >
          <i class="vl_icon vl_icon_vehicle_02"></i>
        </div>
        <!-- 地图信息 -->
        <div class="gis_content" id="gis_content">
          <div class="map_rm" id="mapMap"></div>
          <!-- 地图控制按钮（放大，缩小，定位） -->
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
        <div class="danger_people_list"></div>
        <div class="right_black"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { ajaxCtx, mapXupuxian } from "@/config/config";
import { dataList } from "@/utils/data.js";
import {
  JtcPOSTAppendixInfo,
  JtcGETAppendixInfoList,
  JtcPUTAppendixsOrder
} from "../../api/api.judge.js";
import { MapGETmonitorList } from "../../api/api.map.js";
import { random14, objDeepCopy } from "../../../../utils/util.js";
export default {
  data() {
    return {
      infoRightShow: true,
      colorList: [], //车牌颜色
      map: null, // 地图对象
      mapCenter: [110.594419, 27.908869], //地图中心位
      videoMenuStatus: true, // 菜单状态
      cameraMapMarkers: [], // 地图标记
      selAreaPolygon: null
    };
  },
  mounted() {
    //加载地图
    this.initMap();
  },
  methods: {
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
    // 地图标记
    mapMark(data, aMarkers) {
      if (data && data.length > 0) {
        let hoverWindow = null;
        let _this = this;
        for (let i = 0; i < data.length; i++) {
          let obj = data[i];
          obj.sid = i + "_" + random14();
          if (obj.longitude > 0 && obj.latitude > 0) {
            let offSet = [-20, -50],
              selClass = "";
            if (
              _this.selAreaPolygon &&
              !_this.selAreaPolygon.contains(
                new window.AMap.LngLat(obj.longitude, obj.latitude)
              )
            ) {
              // 多边形存在且不在多边形之中
              selClass = "vl_close";
            }
            let content = '<i class="vl_icon vl_icon_vehicle_04"></i>';
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
            marker.on("mouseover", function() {
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
              hoverWindow.open(
                _this.map,
                new window.AMap.LngLat(obj.longitude, obj.latitude)
              );
              hoverWindow.on("close", function() {
                console.log("infoWindow close");
              });
            });
            marker.on("mouseout", function() {
              if (hoverWindow) {
                hoverWindow.close();
              }
            });
          }
        }
      }
    },
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
    }
  }
};
</script>
<style lang="scss" scoped>
.qyryfx_wrap {
  height: calc(100% - 54px);
  .breadcrumb_heaer {
    background: #fff;
  }
  .qyryfx_content {
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
    // 页面左边
    .info_left {
      width: 272px;
      padding: 20px 0 20px 20px;
      color: #999;
      background: #fff;
      box-shadow: 5px 0px 16px 0px rgba(169, 169, 169, 0.2);
      animation: fadeInLeft 0.4s ease-out 0.3s both;
      //下划线
      .line {
        width: 232px;
        height: 1px;
        background-color: #d3d3d3;
        margin: 40px 0;
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
    // 页面中部
    .info_center {
      position: relative;
      width: calc(100% - 272px);
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
        .map_rm {
          width: 100%;
          height: 100%;
        }
        //定位
        .map_rrt_u2 {
          position: absolute;
          right: 0.16rem;
          bottom: 160px;
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
    .right_show {
      width: calc(100% - 496px);
    }
    .both_show {
      width: calc(100% - 768px);
    }
    .none_show {
      width: 100%;
    }
    .info_right {
      // 页面右边
      width: 496px;
      height: 100%;
      position: relative;
    }
    .close-menu-o {
      @include close_menu;
      left: 0;
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
.qyryfx_wrap {
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