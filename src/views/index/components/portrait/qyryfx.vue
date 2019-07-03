<template>
  <div class="qyryfx_wrap">
    <!-- 面包屑通用样式 -->
    <div class="link_bread" @click="infoRightShow = !infoRightShow">
      <el-breadcrumb separator=">" class="bread_common">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">侦查</el-breadcrumb-item>
        <el-breadcrumb-item>模糊搜车</el-breadcrumb-item>
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
                @focus="isSearchResult = true;"
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
            <div class="sd_opts">
              <ul>
                <li>
                  <div
                    :class="{'sd_opts_sed': drawTypes.rectangle != null }"
                    @click="selDrawType(1)"
                  >
                    <span class="sd_opts_icon sd_opts_icon1"></span>
                  </div>
                </li>
                <li>
                  <div :class="{'sd_opts_sed': drawTypes.circle != null }" @click="selDrawType(2)">
                    <span class="sd_opts_icon sd_opts_icon2"></span>
                  </div>
                </li>
                <li>
                  <div
                    :class="{'sd_opts_sed': drawTypes.polyline != null }"
                    @click="selDrawType(3)"
                  >
                    <span class="sd_opts_icon sd_opts_icon3"></span>
                  </div>
                </li>
                <li>
                  <div :class="{'sd_opts_sed': drawTypes.polygon != null }" @click="selDrawType(4)">
                    <span class="sd_opts_icon sd_opts_icon4"></span>
                  </div>
                </li>
                <li>
                  <div
                    style="cursor: not-allowed;"
                    :class="{'sd_opts_sed': drawTypes.circle10km != null }"
                    @click="selDrawType(5)"
                  >
                    <span class="sd_opts_icon sd_opts_icon5"></span>
                  </div>
                </li>
              </ul>
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
        @click="openMenu"
      >
        <i class="vl_icon vl_icon_vehicle_03"></i>
      </div>
      <!-- 页面的中部 -->
      <div class="info_center">
        <!-- 关闭按钮 -->
        <div
          class="close-menu-c"
          title="关闭菜单"
          v-show="videoMenuStatus"
          @click="closeMenu"
        >
          <i class="vl_icon vl_icon_vehicle_02"></i>
        </div>
        <!-- 地图信息 -->
        <div class="gis_content" id="gis_content">
          <div class="map_rm" id="mapSelector_container"></div>
        </div>
      </div>
      <!-- 页面的右边 -->
      <div class="info_right" v-show="infoRightShow">
        <div class="danger_people_wrap">
          <vue-scroll>
            <h3 class="camera_name">摄像头名称（50次）</h3>
            <div class="danger_people_list">
              <div
                class="people_item"
                v-for="(item, index) in cameraPhotoList"
                :key="'people_item' + index"
              >
                <!-- 上一张 -->
                <div class="change_img pre_btn" @click="preImg(index)"></div>
                <!-- 下一张 -->
                <div class="change_img next_btn" @click="nextImg(index)"></div>
                <!-- 第一张图 -->
                <div class="img_warp">
                  <img src alt />
                </div>
                <!-- 相似度 -->
                <div class="similarity">
                  <p class="similarity_count">98.15</p>
                  <p class="similarity_title">相似度 {{item.currentPeople.index}}</p>
                  <!-- 选择摄像头的时间 -->
                  <div class="select_time">
                    <el-select v-model="searchCamera" placeholder="请选择">
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
                  <img src alt />
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
          </vue-scroll>
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
      cameraPhotoList: [
        {
          currentPeople: {
            index: 0
          },
          imgArr: [0, 1, 2, 3]
        },
        {
          currentPeople: {
            index: 0
          },
          imgArr: [0, 1, 2, 3]
        },
        {
          currentPeople: {
            index: 0
          },
          imgArr: [0, 1, 2, 3]
        },
        {
          currentPeople: {
            index: 0
          },
          imgArr: [0, 1, 2, 3]
        }
      ],
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
      isSearchResult: false, // 搜索框是否打开
      searchResultList: [1, 2, 3, 4, 5, 6, 7, 8], // 搜索结果的列表
      infoRightShow: false, // 右边菜单状态
      videoMenuStatus: true, // 左边菜单状态
      // 选择地图
      treeList: [],
      // selectorId: 'db_tree_' + random14(),
      amap: null,
      config: {
        _name: "",
        zoom: 11,
        center: [110.596015, 27.907662],
        zooms: [2, 18]
      },
      searchVal: "",
      listDevice: [], // 设备
      listBayonet: [], // 卡口
      drawType: 0,
      drawTypes: {
        rectangle: null, // 1
        circle: null, // 2
        polyline: null, // 3
        polygon: null, // 4
        circle10km: null // 5
      },
      submitLoading: false
    };
  },
  mounted() {
    //加载地图
    this.initMap();
  },
  methods: {
    openMenu() {
      this.videoMenuStatus = true;
    },
    closeMenu() {
      this.videoMenuStatus = false;
    },
    enters() {
      this.isSearchResult = true;
    },
    play() {
    },
    resetSearch() {},
    getVehicleDetail() {},
    /* 切换危险人图片方法 */
    preImg(index) {
      // 上一张
      const cameraObj = this.cameraPhotoList[index];
      const len = this.cameraPhotoList[index].imgArr.length - 1;
      if (len <= 0) {
        return;
      }
      if (cameraObj.currentPeople.index === 0) {
        this.$set(this.cameraPhotoList[index].currentPeople, "index", len);
      } else {
        this.$set(
          this.cameraPhotoList[index].currentPeople,
          "index",
          cameraObj.currentPeople.index - 1
        );
      }
    },
    nextImg(index) {
      // 下一张
      const cameraObj = this.cameraPhotoList[index];
      const len = this.cameraPhotoList[index].imgArr.length - 1;
      if (len <= 0) {
        return;
      }
      if (cameraObj.currentPeople.index === len) {
        this.$set(this.cameraPhotoList[index].currentPeople, "index", 0);
      } else {
        this.$set(
          this.cameraPhotoList[index].currentPeople,
          "index",
          cameraObj.currentPeople.index + 1
        );
      }
    },
    /** 选择地图的方法 */
    initMap() {
      if (this.amap) {
        return;
      }
      let _this = this;
      let map = new window.AMap.Map(
        "mapSelector_container",
        Object.assign({}, _this.config)
      );
      map.setMapStyle("amap://styles/light");
      // map.setMapStyle('amap://styles/a00b8c5653a6454dd8a6ec3b604ec50c');
      // console.log('_config', _config)
      _this.amap = map;
      /* _this.$nextTick(() => {
        _this.setMap(_config);
      }); */
      // 注册监听，当选中某条记录时会触发
      // let auto = new window.AMap.Autocomplete({
      //   input: "map_sd_search_input"
      // });
      // window.AMap.event.addListener(auto, "select", _this.selectArea);
      // _this.setMarks();
      //输入提示
      // window.AMap.plugin('AMap.Autocomplete', function () {
      //   var auto = new AMap.Autocomplete({
      //     input: "map_sd_search_input"
      //   });
      //   // AMap.event.addListener(auto, 'select', _this.selectArea);
      // });
    },
    selectArea(e) {
      console.log(e);
      if (e.poi && e.poi.location) {
        this.amap.setZoom(15);
        this.amap.setCenter(e.poi.location);
      }
    },
    selDrawType(drawType) {
      this.drawType = drawType;
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
      }
    },
    // 圆形
    drawCircle() {
      if (this.drawTypes.circle !== null) {
        this.closeDraw(2);
      } else {
        let circle = new AMap.Circle({
          center: this.amap.getCenter(),
          radius: 1000, //半径
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
          zIndex: 50
        });
        circle.setMap(this.amap);
        // 缩放地图到合适的视野级别
        this.amap.setFitView([circle]);
        let circleEditor = new window.AMap.CircleEditor(this.amap, circle);
        circleEditor.on("end", function(event) {
          console.log("触发事件： end");
          // event.target 即为编辑后的圆形对象
        });
        circleEditor.open();
        this.drawTypes.circle = {
          obj: circle,
          editor: circleEditor
        };
      }
    },
    // 矩形
    drawRectangle() {
      if (this.drawTypes.rectangle !== null) {
        this.closeDraw(1);
      } else {
        let oCneter = this.amap.getCenter();
        var southWest = new AMap.LngLat(
          oCneter.lng - 0.008,
          oCneter.lat - 0.005
        );
        var northEast = new AMap.LngLat(
          oCneter.lng + 0.008,
          oCneter.lat + 0.005
        );
        var bounds = new window.AMap.Bounds(southWest, northEast);
        var rectangle = new window.AMap.Rectangle({
          bounds: bounds,
          strokeColor: "#FA453A",
          strokeOpacity: 1,
          strokeWeight: 1,
          // strokeOpacity: 0.2,
          fillOpacity: 0.2,
          // strokeStyle: 'dashed',
          // strokeDasharray: [10, 10],
          // 线样式还支持 'dashed'
          fillColor: "#FA453A",
          cursor: "pointer",
          zIndex: 50
        });
        rectangle.setMap(this.amap);
        // 缩放地图到合适的视野级别
        this.amap.setFitView([rectangle]);
        var rectangleEditor = new window.AMap.RectangleEditor(
          this.amap,
          rectangle
        );
        rectangleEditor.on("end", function(event) {
          // log.info('触发事件： end')
          // event.target 即为编辑后的矩形对象
        });
        rectangleEditor.open();
        this.drawTypes.rectangle = {
          obj: rectangle,
          editor: rectangleEditor
        };
      }
    },
    // 折线
    drawPolyline() {
      if (this.drawTypes.polyline !== null) {
        this.closeDraw(3);
      } else {
        let oCneter = this.amap.getCenter();
        var path = [
          [oCneter.lng - 0.008, oCneter.lat],
          [oCneter.lng + 0.008, oCneter.lat]
        ];
        var polyline = new window.AMap.Polyline({
          path: path,
          isOutline: true,
          outlineColor: "#ffeeff",
          borderWeight: 3,
          strokeColor: "#3366FF",
          strokeOpacity: 1,
          strokeWeight: 3,
          // 折线样式还支持 'dashed'
          strokeStyle: "solid",
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 5],
          lineJoin: "round",
          lineCap: "round",
          zIndex: 50
        });
        polyline.setMap(this.amap);
        // 缩放地图到合适的视野级别
        this.amap.setFitView([polyline]);
        var polyEditor = new window.AMap.PolyEditor(this.amap, polyline);
        polyEditor.on("end", function(event) {
          // log.info('触发事件： end')
          // event.target 即为编辑后的折线对象
        });
        polyEditor.open();
        this.drawTypes.polyline = {
          obj: polyline,
          editor: polyEditor
        };
      }
    },
    // 多边形
    drawPolygon() {
      if (this.drawTypes.polygon !== null) {
        this.closeDraw(4);
      } else {
        let oCneter = this.amap.getCenter();
        var path = [
          [oCneter.lng - 0.005, oCneter.lat - 0.005],
          [oCneter.lng + 0.005, oCneter.lat - 0.005],
          [oCneter.lng + 0.005, oCneter.lat + 0.005],
          [oCneter.lng - 0.005, oCneter.lat + 0.005]
        ];
        let polygon = new window.AMap.Polygon({
          path: path,
          strokeColor: "#FA453A",
          strokeOpacity: 1,
          strokeWeight: 1,
          // strokeOpacity: 0.2,
          fillOpacity: 0.2,
          // strokeStyle: 'dashed',
          // strokeDasharray: [10, 10],
          // 线样式还支持 'dashed'
          fillColor: "#FA453A",
          zIndex: 50
        });
        this.amap.add(polygon);
        // 缩放地图到合适的视野级别
        this.amap.setFitView([polygon]);

        var polyEditor = new window.AMap.PolyEditor(this.amap, polygon);
        polyEditor.on("end", function(event) {
          // log.info('触发事件： end')
          // event.target 即为编辑后的多边形对象
        });
        polyEditor.open();
        this.drawTypes.polygon = {
          obj: polygon,
          editor: polyEditor
        };
      }
    },
    closeDraw(drawType) {
      if (drawType === 1 && this.drawTypes.rectangle !== null) {
        if (this.drawTypes.rectangle.editor) {
          this.drawTypes.rectangle.editor.close();
        }
        this.amap.remove(this.drawTypes.rectangle.obj);
        this.drawTypes.rectangle = null;
      } else if (drawType === 2 && this.drawTypes.circle !== null) {
        if (this.drawTypes.circle.editor) {
          this.drawTypes.circle.editor.close();
        }
        this.amap.remove(this.drawTypes.circle.obj);
        this.drawTypes.circle = null;
      } else if (drawType === 3 && this.drawTypes.polyline !== null) {
        if (this.drawTypes.polyline.editor) {
          this.drawTypes.polyline.editor.close();
        }
        this.amap.remove(this.drawTypes.polyline.obj);
        this.drawTypes.polyline = null;
      } else if (drawType === 4 && this.drawTypes.polygon !== null) {
        if (this.drawTypes.polygon.editor) {
          this.drawTypes.polygon.editor.close();
        }
        this.amap.remove(this.drawTypes.polygon.obj);
        this.drawTypes.polygon = null;
      } else if (drawType === 5 && this.drawTypes.pocircle10kmlygon !== null) {
        if (this.drawTypes.pocircle10kmlygon.editor) {
          this.drawTypes.pocircle10kmlygon.editor.close();
        }
        this.amap.remove(this.drawTypes.circle10km.obj);
        this.drawTypes.circle10km = null;
      }
    },

    selSubmit() {
      this.submitLoading = true;
      let dObj = {},
        bObj = {};
      if (this.listDevice && this.listDevice.length > 0) {
        for (let i = 0; i < this.listDevice.length; i++) {
          let o = this.listDevice[i];
          if (this.drawTypes.rectangle && this.drawTypes.rectangle.obj) {
            if (
              this.drawTypes.rectangle.obj.contains(
                new window.AMap.LngLat(o.longitude, o.latitude)
              )
            ) {
              dObj[o.uid] = o;
            }
          }
          if (this.drawTypes.circle && this.drawTypes.circle.obj) {
            if (
              this.drawTypes.circle.obj.contains(
                new window.AMap.LngLat(o.longitude, o.latitude)
              )
            ) {
              dObj[o.uid] = o;
            }
          }
          if (this.drawTypes.polyline && this.drawTypes.polyline.obj) {
            // distanceToLine closestOnLine
            var closestPositionOnLine = window.AMap.GeometryUtil.distanceToLine(
              new window.AMap.LngLat(o.longitude, o.latitude),
              this.drawTypes.polyline.obj.getPath()
            );
            console.log(closestPositionOnLine);
            if (closestPositionOnLine < 200) {
              dObj[o.uid] = o;
            }
          }
          if (this.drawTypes.polygon && this.drawTypes.polygon.obj) {
            if (
              this.drawTypes.polygon.obj.contains(
                new window.AMap.LngLat(o.longitude, o.latitude)
              )
            ) {
              dObj[o.uid] = o;
            }
          }
          if (this.drawTypes.circle10km && this.drawTypes.circle10km.obj) {
            if (
              this.drawTypes.circle10km.obj.contains(
                new window.AMap.LngLat(o.longitude, o.latitude)
              )
            ) {
              dObj[o.uid] = o;
            }
          }
        }
      }
      if (this.listBayonet && this.listBayonet.length > 0) {
        for (let i = 0; i < this.listBayonet.length; i++) {
          let o = this.listBayonet[i];
          if (this.drawTypes.rectangle && this.drawTypes.rectangle.obj) {
            if (
              this.drawTypes.rectangle.obj.contains(
                new window.AMap.LngLat(o.longitude, o.latitude)
              )
            ) {
              bObj[o.uid] = o;
            }
          }
          if (this.drawTypes.circle && this.drawTypes.circle.obj) {
            if (
              this.drawTypes.circle.obj.contains(
                new window.AMap.LngLat(o.longitude, o.latitude)
              )
            ) {
              bObj[o.uid] = o;
            }
          }
          if (this.drawTypes.polyline && this.drawTypes.polyline.obj) {
            var closestPositionOnLine = window.AMap.GeometryUtil.distanceToLine(
              new window.AMap.LngLat(o.longitude, o.latitude),
              this.drawTypes.polyline.obj.getPath()
            );
            if (closestPositionOnLine < 200) {
              bObj[o.uid] = o;
            }
          }
          if (this.drawTypes.polygon && this.drawTypes.polygon.obj) {
            if (
              this.drawTypes.polygon.obj.contains(
                new window.AMap.LngLat(o.longitude, o.latitude)
              )
            ) {
              bObj[o.uid] = o;
            }
          }
          if (this.drawTypes.circle10km && this.drawTypes.circle10km.obj) {
            if (
              this.drawTypes.circle10km.obj.contains(
                new window.AMap.LngLat(o.longitude, o.latitude)
              )
            ) {
              bObj[o.uid] = o;
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
      console.log("设备 ad", ad);
      console.log("卡口 ab", ab);
      this.$emit("mapSelectorEmit", {
        deviceList: dObj,
        bayonetList: bObj
      });
      this.dialogVisible = false;
      window.setTimeout(() => {
        this.submitLoading = false;
        this.closeDraw(1);
        this.closeDraw(2);
        this.closeDraw(3);
        this.closeDraw(4);
        this.closeDraw(5);
      }, 200);
    },

    getTreeList() {
      if (this.showTypes.indexOf("D") >= 0) {
        this.getListDevice();
      }
      if (this.showTypes.indexOf("B") >= 0) {
        this.getListBayonet();
      }
    },
    // 设备
    getListDevice() {
      getAllMonitorList({ ccode: mapXupuxian.adcode }).then(res => {
        if (res) {
          this.listDevice = res.data;
        }
      });
    },
    // 卡口
    getListBayonet() {
      getAllBayonetList({ areaId: mapXupuxian.adcode }).then(res => {
        if (res) {
          this.listBayonet = res.data;
        }
      });
    },
    // D设备 B卡口
    setMarks() {
      if (this.showTypes.indexOf("D") >= 0) {
        for (let i = 0; i < this.listDevice.length; i++) {
          this.doMark(this.listDevice[i], "vl_icon vl_icon_sxt");
        }
      }
      if (this.showTypes.indexOf("B") >= 0) {
        for (let i = 0; i < this.listBayonet.length; i++) {
          this.doMark(this.listBayonet[i], "vl_icon vl_icon_kk");
        }
      }
    },
    //
    doMark(obj, sClass) {
      // console.log('doMark', obj);
      let marker = new window.AMap.Marker({
        // 添加自定义点标记
        map: this.amap,
        position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
        offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // extData: obj,
        // 自定义点标记覆盖物内容
        content: '<div class="map_icons ' + sClass + '"></div>'
      });
    },
    setMapStatus(status) {
      if (this.amap) {
        if (status === 1) {
          this.amap.setZoom(this.amap.getZoom() + 1);
        } else if (status === 2) {
          this.amap.setZoom(this.amap.getZoom() - 1);
        }
      }
    }
  },
  beforeDestroy() {
    if (this.amap) {
      this.amap.destroy();
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
        background: #fafafa;
        position: relative;
        // 标题
        .add_area_title {
          color: #0c70f8;
          line-height: 46px;
          text-indent: 28px;
        }
        .sd_opts {
          > ul {
            padding: 0 5px 5px 5px;
            overflow: hidden;
            > li {
              padding: 5px;
              float: left;
              > div {
                // padding: 5px;
                &.sd_opts_sed {
                  background-color: #f2f9ff;
                  > .sd_opts_icon1 {
                    background-image: url("../../../../assets/img/vehicle/cut1m.png");
                  }
                  > .sd_opts_icon2 {
                    background-image: url(../../../../assets/img/vehicle/cut2m.png);
                  }
                  > .sd_opts_icon3 {
                    background-image: url(../../../../assets/img/vehicle/cut3m.png);
                  }
                  > .sd_opts_icon4 {
                    background-image: url(../../../../assets/img/vehicle/cut4m.png);
                  }
                  > .sd_opts_icon5 {
                    background-image: url(../../../../assets/img/vehicle/cut5m.png);
                  }
                }
              }
            }
          }
        }
        .sd_opts_icon {
          display: inline-block;
          width: 38px;
          height: 44px;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: 100% 100%;
          &.sd_opts_icon1 {
            background-image: url(../../../../assets/img/vehicle/cut1.png);
            &:hover {
              background-image: url(../../../../assets/img/vehicle/cut1m.png);
            }
          }
          &.sd_opts_icon2 {
            background-image: url(../../../../assets/img/vehicle/cut2.png);
            &:hover {
              background-image: url(../../../../assets/img/vehicle/cut2m.png);
            }
          }
          &.sd_opts_icon3 {
            background-image: url(../../../../assets/img/vehicle/cut3.png);
            &:hover {
              background-image: url(../../../../assets/img/vehicle/cut3m.png);
            }
          }
          &.sd_opts_icon4 {
            background-image: url(../../../../assets/img/vehicle/cut4.png);
            &:hover {
              background-image: url(../../../../assets/img/vehicle/cut4m.png);
            }
          }
          &.sd_opts_icon5 {
            background-image: url(../../../../assets/img/vehicle/cut5.png);
            &:hover {
              background-image: url(../../../../assets/img/vehicle/cut5m.png);
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
        }
        .danger_people_list {
          padding-top: 28px;
          // 人员记录列表
          .people_item {
            width: 428px;
            position: relative;
            background: #fff;
            box-shadow: 0px 5px 16px 0px rgba(169, 169, 169, 0.2);
            padding: 30px 0 30px 50px;
            overflow: hidden;
            margin-bottom: 25px;
            .change_img {
              position: absolute;
              top: 55px;
              width: 12px;
              height: 26px;
              background: url("../../../../assets/img/icons.png") no-repeat;
              cursor: pointer;
            }
            // 点击变成上一张
            .pre_btn {
              left: 22px;
              background-position: -990px -133px;
              &:hover {
                background-position: -972px -133px;
              }
            }
            // 点击下一张
            .next_btn {
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