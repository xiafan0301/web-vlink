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
          <div class="left_top">
            <!-- 搜索 -->
            <div class="search_wrap">
              <el-input
                class="width232"
                v-model="searchCamera"
                suffix-icon="el-icon-search"
                placeholder="请输入内容"
              ></el-input>
            </div>
            <!-- 搜索条件 -->
            <div class="search_condition">
              <div class="condition_title">设定分析条件</div>
              <div class="condition">
                <el-select class="width232" v-model="searchCamera" placeholder="选择分析人群">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div class="condition">
                <el-select class="width232" v-model="searchCamera" placeholder="选择性别">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="condition">
              <el-select class="width232" v-model="searchCamera" placeholder="选择年龄段">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <!-- 增加时间区域 -->
          <div class="left_bottom">
            <div class="add_area_title">
              <span>+&nbsp;增加时间区域</span>
              <i></i>
            </div>
            <!-- 选择地图区域 -->
            <div class="drawBox">
              <div class="items">
                <span @click="clickTab('cut1')" :class="['cut1',{'hover':hover=='cut1'}]"></span>
                <span @click="clickTab('cut2')" :class="['cut2',{'hover':hover=='cut2'}]"></span>
                <span @click="clickTab('cut3')" :class="['cut3',{'hover':hover=='cut3'}]"></span>
                <span @click="clickTab('cut4')" :class="['cut4',{'hover':hover=='cut4'}]"></span>
                <span @click="clickTab('cut5')" :class="['cut5',{'hover':hover=='cut5'}]"></span>
              </div>
            </div>
          </div>
          <!-- 按钮 -->
          <div class="search_btn">
            <el-button @click="resetSearch">重置</el-button>
            <el-button type="primary" @click="getVehicleDetail">确定</el-button>
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
          <div class="map_rm" id="mapSelect"></div>
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
      <div class="info_right" v-show="infoRightShow" @click="infoRightShow = false;">
        <div class="danger_people_wrap">
          <h3 class="camera_name">摄像头名称（50次）</h3>
          <div class="danger_people_list">
            <div class="people_item">
              <!-- 上一张 -->
              <div class="pre_btn"></div>
              <!-- 下一张 -->
              <div class="next_btn"></div>
              <!-- 第一张图 -->
              <div class="img_warp">
                <img src alt>
              </div>
              <!-- 相似度 -->
              <div class="similarity">
                <p class="similarity_count">98.15</p>
                <p class="similarity_title">相似度</p>
                <!-- 选择摄像头的时间 -->
                <div class="select_time">
                  <el-select v-model="value" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <!-- 第二张图 -->
              <div class="img_warp">
                <img src alt>
              </div>
              <!-- 危险人物照片信息 -->
              <div class="people_message">
                <h2 class="name">范冰冰</h2>
                <div class="tips_wrap">
                  <p class="tip">男</p>
                  <p class="tip">青年</p>
                </div>
              </div>
            </div>

            <div class="people_item">
              <!-- 上一张 -->
              <div class="pre_btn"></div>
              <!-- 下一张 -->
              <div class="next_btn"></div>
              <!-- 第一张图 -->
              <div class="img_warp">
                <img src alt>
              </div>
              <!-- 相似度 -->
              <div class="similarity">
                <p class="similarity_count">98.15</p>
                <p class="similarity_title">相似度</p>
                <!-- 选择摄像头的时间 -->
                <div class="select_time">
                  <el-select v-model="value" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <!-- 第二张图 -->
              <div class="img_warp">
                <img src alt>
              </div>
              <!-- 危险人物照片信息 -->
              <div class="people_message">
                <h2 class="name">范冰冰</h2>
                <div class="tips_wrap">
                  <p class="tip">男</p>
                  <p class="tip">青年</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right_black"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapXupuxian } from "@/config/config.js";
// import { JfoGETSurveillanceObject } from "@/views/index/api/api.judge.js";
export default {
  data() {
    return {
      /*左边搜索表单变量 */
      searchCamera: "",
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      infoRightShow: true, // 右边菜单状态
      videoMenuStatus: true, // 左边菜单状态
      // 选择地图
      amap: null,
      input3: null,
      hover: null,
      mouseTool: null,
      selAreaPolygon: null,
      delSelAreaIcon: null,
      lnglat: null
    };
  },
  mounted() {
    //加载地图
    this.renderMap();
  },
  methods: {
    resetSearch() {},
    getVehicleDetail() {},
    // 选择地图的方法
    clickTab(val) {
      this.hover = this.hover == val ? "" : val;
      if (!this.hover) {
        this.amap.setDefaultCursor();
        this.mouseTool.close(false);
      } else {
        this.selArea(val);
      }
    },
    // 选择区域
    selArea(v) {
      this.amap.setDefaultCursor("crosshair");
      switch (v) {
        case "cut1":
          this.mouseTool.rectangle({
            strokeColor: "#FA453A",
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: "#FA453A",
            fillOpacity: 0.2,
            strokeStyle: "solid"
          });
          break;
        case "cut2":
          this.mouseTool.circle({
            strokeColor: "#FA453A",
            // strokeOpacity: 1,
            strokeWeight: 1,
            strokeOpacity: 0.2,
            fillColor: "#FA453A",
            fillOpacity: 0.2,
            strokeStyle: "solid"
            // 线样式还支持 'dashed'
            // strokeDasharray: [30,10],
          });
          break;
        case "cut3":
          this.mouseTool.polyline({
            strokeColor: "#FA453A",
            strokeOpacity: 1,
            strokeWeight: 2,
            // 线样式还支持 'dashed'
            strokeStyle: "solid"
            // strokeStyle是dashed时有效
            // strokeDasharray: [10, 5],
          });
          break;
        case "cut4":
          this.mouseTool.polygon({
            zIndex: 13,
            strokeColor: "#FA453A",
            strokeOpacity: 1,
            bubble: true,
            strokeWeight: 1,
            fillColor: "#FA453A",
            fillOpacity: 0.2,
            isRing: false
          });
          break;
        case "cut5":
          break;
      }
    },
    setCenter() {
      var _this = this;
      var placeSearch = new window.AMap.PlaceSearch({
        // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
        city: "021"
      });
      placeSearch.search(this.input3, function(status, result) {
        // 查询成功时，result即对应匹配的POI信息
        //  console.log(result)
        var pois = result.poiList.pois;
        if (pois.length > 0) {
          let new_center = pois[0].location;
          _this.amap.setZoomAndCenter(16, new_center);
        }
        // for(var i = 0; i < pois.length; i++){
        //     var poi = pois[i];
        //     var marker = [];
        //     marker[i] = new AMap.Marker({
        //         position: poi.location,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        //         title: poi.name
        //     });
        //     // 将创建的点标记添加到已有的地图实例：
        //     _this.amap.add(marker[i]);
        // }
        // _this.amap.setFitView();
      });
    },
    // 地图定位
    resetZoom() {
      if (this.amap) {
        this.amap.setZoomAndCenter(14, this.mapCenter);
      }
    },
    mapZoomSet(val) {
      if (this.amap) {
        this.amap.setZoom(this.amap.getZoom() + val);
      }
    },
    renderMap() {
      let map = new window.AMap.Map("mapSelect", {
        zoom: 10,
        center: mapXupuxian.center
      });
      map.setMapStyle("amap://styles/whitesmoke");
      this.amap = map;
      // 在地图中添加MouseTool插件
      this.mouseTool = new window.AMap.MouseTool(map);
      let _this = this;
      this.amap.on("click", function(e) {
        //lnglatInput.value = e.lnglat.toString();
        if (_this.hover == "cut5") {
          var circle = new window.AMap.Circle({
            center: e.lnglat,
            radius: 5000, //半径
            borderWeight: 3,
            strokeColor: "#FF33FF",
            // strokeOpacity: 1,
            strokeWeight: 1,
            strokeOpacity: 0.2,
            fillOpacity: 0.4,
            strokeStyle: "solid",
            // strokeDasharray: [10, 10],
            // 线样式还支持 'dashed'
            fillColor: "#1791fc",
            zIndex: 50
          });
          circle.setMap(_this.amap);
        }
      });
    },
    // 关闭图片放大弹出框
    closeImgDialog() {
      this.$emit("emitCloseImgDialog", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.qyryfx_wrap {
  height: calc(100% - 54px);
  font-size: 14px;
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
      color: #999;
      background: #fff;
      box-shadow: 5px 0px 16px 0px rgba(169, 169, 169, 0.2);
      animation: fadeInLeft 0.4s ease-out 0.3s both;
      .left_top {
        width: 232px;
        margin: 0 20px;
        padding: 20px 0;
        // 搜索框
        .search_wrap {
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
        background: #fafafa;
        position: relative;
        // 标题
        .add_area_title {
          color: #0c70f8;
          line-height: 46px;
          text-indent: 28px;
        }
        // .select_place {
        //   width: 230px;
        //   background: red;
        //   height: 100px;
        //   margin: 0 auto;
        //   border: 1px solid #d3d3d3;
        // }

        .drawBox {
          width: 230px;
          height: 100px;
          margin: 0 auto;
          border: 1px solid #d3d3d3;
          .items {
            padding-top: 20px;
            span {
              display: inline-block;
              width: 45px;
              height: 46px;
              text-align: center;
              line-height: 46px;
              cursor: pointer;
            }
            .cut1 {
              background: url(../../../../assets/img/vehicle/cut1.png) center
                no-repeat;
              background-size: 100% 100%;
            }
            .cut1.hover {
              background: #f2f9ff url(../../../../assets/img/vehicle/cut1m.png)
                center no-repeat;
              background-size: 100% 100%;
            }
            .cut2 {
              background: url(../../../../assets/img/vehicle/cut2.png) center
                no-repeat;
              background-size: 100% 100%;
            }
            .cut2.hover {
              background: #f2f9ff url(../../../../assets/img/vehicle/cut2m.png)
                center no-repeat;
              background-size: 100% 100%;
            }
            .cut3 {
              background: url(../../../../assets/img/vehicle/cut3.png) center
                no-repeat;
              background-size: 100% 100%;
            }
            .cut4 {
              background: url(../../../../assets/img/vehicle/cut4.png) center
                no-repeat;
              background-size: 100% 100%;
            }
            .cut5 {
              background: url(../../../../assets/img/vehicle/cut5.png) center
                no-repeat;
              background-size: 80% 80%;
            }
            .cut3.hover {
              background: #f2f9ff url(../../../../assets/img/vehicle/cut3m.png)
                center no-repeat;
              background-size: 100% 100%;
            }
            .cut4.hover {
              background: #f2f9ff url(../../../../assets/img/vehicle/cut4m.png)
                center no-repeat;
              background-size: 100% 100%;
            }
            .cut5.hover {
              background: #f2f9ff url(../../../../assets/img/vehicle/cut5m.png)
                center no-repeat;
              background-size: 80% 80%;
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
      background: white;
      > div {
        height: 100%;
        float: left;
      }
      // 危险人物列表
      .danger_people_wrap {
        width: 476px;
        padding: 0 28px 20px 20px;
        // 摄像头名称
        .camera_name {
          font-size: 14px;
          line-height: 56px;
          height: 56px;
          color: #333333;
          border-bottom: 1px solid #d3d3d3;
        }
        .danger_people_list {
          height: calc(100% -56px);
          padding-top: 28px;

          // 人员记录列表
          .people_item {
            position: relative;
            background: #fff;
            box-shadow: 0px 5px 16px 0px rgba(169, 169, 169, 0.2);
            padding: 30px 0 30px 50px;
            overflow: hidden;
            margin-bottom: 25px;
            // 点击变成上一张
            .pre_btn {
              position: absolute;
              top: 55px;
              left: 22px;
              width: 12px;
              height: 26px;
              background: url("../../../../assets/img/icons.png") no-repeat;
              background-position: -477px -1520px;
              &:hover {
                background-position: -497px -1520px;
              }
            }
            // 点击下一张
            .next_btn {
              position: absolute;
              top: 55px;
              right: 18px;
              width: 12px;
              height: 26px;
              background: url("../../../../assets/img/icons.png") no-repeat;
              background-position: -529px -1520px;
              &:hover {
                background-position: -548px -1520px;
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
          width: 98px;
          z-index: 10;
          left: -5px;
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