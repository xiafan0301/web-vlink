<template>
  <div class="new-analysis-task">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/portrait/menu' }">检索</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/portrait/pfcm' }">频繁出没</el-breadcrumb-item>
        <el-breadcrumb-item>新建分析任务</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="new-a-t-content">
      <!-- 搜索条件 -->
      <div class="info-left" v-show="videoMenuStatus">
        <vue-scroll>
          <el-form :model="searchData" ref="searchForm" :rules="rules" :hide-required-asterisk="true">
            <!-- 搜索 -->
            <el-form-item prop="address">
              <div class="search-wrap">
                <el-input
                  class="width232"
                  v-model="searchData.address"
                  suffix-icon="el-icon-search"
                  placeholder="搜索地点"
                  id="map-sd-search-input"
                ></el-input>
              </div>
            </el-form-item>
            <!-- 下划线 -->
            <el-form-item class="under-line">
              <div class="line"></div>
            </el-form-item>
            <!-- 任务名称 -->
            <el-form-item prop="taskName">
              <div class="task-name">
                <el-input v-model="searchData.taskName" placeholder="请输入任务名称"></el-input>
              </div>
            </el-form-item>
            <!-- 区域选择 -->
            <el-form-item>
              <div class="sd-opts">
                <div class="sd-opts-title">
                  <h4>区域选择</h4>
                  <i class="vl_icon vl_icon_portrait_02"></i>
                </div>
                <ul>
                  <li>
                    <div
                      :class="{'sd-opts-sed': drawTypes.rectangle != null }"
                      @click="selDrawType(1)"
                    >
                      <span class="sd-opts-icon sd-opts-icon1"></span>
                    </div>
                  </li>
                  <li>
                    <div
                      :class="{'sd-opts-sed': drawTypes.circle != null }"
                      @click="selDrawType(2)"
                    >
                      <span class="sd-opts-icon sd-opts-icon2"></span>
                    </div>
                  </li>
                  <li>
                    <div
                      :class="{'sd-opts-sed': drawTypes.polyline != null }"
                      @click="selDrawType(3)"
                    >
                      <span class="sd-opts-icon sd-opts-icon3"></span>
                    </div>
                  </li>
                  <li>
                    <div
                      :class="{'sd-opts-sed': drawTypes.polygon != null }"
                      @click="selDrawType(4)"
                    >
                      <span class="sd-opts-icon sd-opts-icon4"></span>
                    </div>
                  </li>
                  <li>
                    <div
                      style="cursor: not-allowed;"
                      :class="{'sd-opts-sed': drawTypes.circle10km != null }"
                      @click="selDrawType(5)"
                    >
                      <span class="sd-opts-icon sd-opts-icon5"></span>
                    </div>
                  </li>
                </ul>
              </div>
            </el-form-item>
            <!-- 时间 -->
            <el-form-item prop="startTime">
              <div class="time-search">
                <p>开始</p>
                <el-date-picker
                  v-model="searchData.startTime"
                  type="datetime"
                  :clearable="false"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="startDateOpt"
                  placeholder="开始时间"
                ></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item prop="endTime">
              <div class="time-search">
                <p>结束</p>
                <el-date-picker
                  v-model="searchData.endTime"
                  :clearable="false"
                  :picker-options="endDateOpt"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  default-time="23:59:59"
                  placeholder="结束时间"
                ></el-date-picker>
              </div>
            </el-form-item>
            <!-- 相似度搜索 -->
            <el-form-item prop="similarity">
              <div class="similarity">
                相似度&nbsp;>
                <el-input v-model="searchData.similarity" placeholder></el-input>&nbsp;算为同一个人
              </div>
            </el-form-item>
            <!-- 频次搜索 -->
            <el-form-item prop="frequency">
              <div class="frequency">
                期间频次不少于&nbsp;
                <el-input v-model="searchData.frequency" placeholder></el-input>&nbsp;次
              </div>
            </el-form-item>
            <el-form-item>
              <div class="search-btn">
                <el-button @click="resetSearch('searchForm')">重置</el-button>
                <el-button type="primary" @click="submitForm('searchForm')" :loading="searching">新建任务</el-button>
              </div>
            </el-form-item>
          </el-form>
        </vue-scroll>
      </div>
      <!-- 关闭按钮 -->
      <div
        class="close-menu-c"
        title="关闭菜单"
        @click="videoMenuStatus = false;"
        v-show="videoMenuStatus"
      >
        <i class="vl_icon vl_icon_vehicle_02"></i>
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
      <!-- 地图信息 -->
      <div class="info-right" :class="{ 'video-menu-close': !videoMenuStatus }">
        <!-- 地图信息 -->
        <div class="gis_content" id="gis_content">
          <div class="map_rm" id="mapMap"></div>
          <!-- 地图控制按钮（放大，缩小，定位） -->
          <div class="map_control">
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
  </div>
</template>
<script>
import { mapXupuxian } from "@/config/config";
import {
  getAllMonitorList,
  getAllBayonetList
} from "@/views/index/api/api.base.js";
import { validatePersonNum, validateInteger } from '@/utils/validator.js';
import { postTaskAnalysis } from "../../api/api.analysis.js";
export default {
  data() {
    return {
      searchData: {
        //搜索参数
        address: "",
        taskName: "",
        startTime: "",
        endTime: "",
        similarity: '', // 相似度
        frequency: '', //频次
      },
      rules: {
        taskName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" },
          { min: 0, max: 20, message: "最大长度为20个字符", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" },
        ],
        similarity: [
          { required: true, message: "相似度不能为空", trigger: "blur" },
          { validator: validatePersonNum, trigger: 'blur' }
        ],
        frequency: [
          { required: true, message: "频次不能为空", trigger: "blur" },
          { validator: validateInteger, trigger: "blur"}
        ]
      },
      startDateOpt: {
        disabledDate: time => {
          if (this.searchData.endTime) {
            return (
              time.getTime() > new Date(this.searchData.endTime).getTime() ||
              time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90
            );
          } else {
            return (
              time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90 ||
              time.getTime() > new Date().getTime()
            );
          }
        }
      },
      endDateOpt: {
        disabledDate: time => {
          if (this.searchData.startTime) {
            return (
              time.getTime() < new Date(this.searchData.startTime).getTime() ||
              time.getTime() > new Date().getTime()
            );
          } else {
            return (
              time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90 ||
              time.getTime() > new Date().getTime()
            );
          }
        }
      },
      searching: false,
      /* 区域选择 */
      drawType: 0,
      drawTypes: {
        rectangle: null, // 1
        circle: null, // 2
        polyline: null, // 3
        polygon: null, // 4
        circle10km: null // 5
      },
      amap: null, // 地图对象
      mapCenter: [110.594419, 27.908869], //地图中心位
      videoMenuStatus: true, // 菜单状态
      cameraMapMarkers: [], // 地图标记
      selAreaPolygon: null,
      listDevice: [], // 设备
      listBayonet: [], // 卡口
      showTypes: "DB", //设备类型
      cameraIds: [],    //摄像头
      bayonetIds: [],    //卡口
    };
  },
  computed: {},
  mounted() {
    //获取数据
    this.getTreeList();
    //加载地图
    this.initMap();
  },
  methods: {
    //重置
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.resetZoom();
      this.closeDraw(1);
      this.closeDraw(2);
      this.closeDraw(3);
      this.closeDraw(4);
      /* this.closeDraw(5); */
    },
    //新建
    submitForm(formName) {
      this.selSubmit();
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              jobName: this.searchData.taskName,
              startDate: this.searchData.startTime,
              endDate: this.searchData.endTime,
              semblance: this.searchData.similarity,
              frequency: this.searchData.frequency,
            };
            if((this.cameraIds && this.cameraIds.length > 0) || (this.bayonetIds && this.bayonetIds.length > 0)) {
              (this.cameraIds && this.cameraIds.length > 0) && (params['deviceIds'] = this.cameraIds.join(","));
              (this.bayonetIds && this.bayonetIds.length > 0) && (params['bayonetIds'] = this.bayonetIds.join(","));
            }else {
              this.$message.error("请选择区域")
              return false;
            }
            console.log("-------submitForm-------",params)
            this.searching = true;
            postTaskAnalysis(params).then(res => {
              console.log(res)
              if(res) {
                window.setTimeout(() => {
                this.closeDraw(1);
                this.closeDraw(2);
                this.closeDraw(3);
                this.closeDraw(4);
                /* this.closeDraw(5); */
              }, 200);
              }
              this.$nextTick(() => {
                this.searching = false;
              })
            }).catch(error => {
              console.log(error)
              this.searching = false
            }) 
          } else {
            console.log('error submit!!');
            return false;
          }
      });
    },
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
      console.log("===========", map);
      this.amap = map;

      // 注册监听，当选中某条记录时会触发
      let auto = new window.AMap.Autocomplete({
        input: "map-sd-search-input"
      });
      window.AMap.event.addListener(auto, "select", _this.selectArea);
    },
    selectArea(e) {
      console.log(e);
      if (e.poi && e.poi.location) {
        this.amap.setZoom(15);
        this.amap.setCenter(e.poi.location);
      }
    },
    //选择类型
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
        let circle = new window.AMap.Circle({
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
          console.log("触发事件： end", event);
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
        let southWest = new window.AMap.LngLat(
          oCneter.lng - 0.008,
          oCneter.lat - 0.005
        );
        let northEast = new window.AMap.LngLat(
          oCneter.lng + 0.008,
          oCneter.lat + 0.005
        );
        let bounds = new window.AMap.Bounds(southWest, northEast);
        let rectangle = new window.AMap.Rectangle({
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
        let rectangleEditor = new window.AMap.RectangleEditor(
          this.amap,
          rectangle
        );
        rectangleEditor.on("end", function(event) {
          console.log(event);
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
        let path = [
          [oCneter.lng - 0.008, oCneter.lat],
          [oCneter.lng + 0.008, oCneter.lat]
        ];
        let polyline = new window.AMap.Polyline({
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
        let polyEditor = new window.AMap.PolyEditor(this.amap, polyline);
        polyEditor.on("end", function(event) {
          console.log(event);
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
        let path = [
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

        let polyEditor = new window.AMap.PolyEditor(this.amap, polygon);
        polyEditor.on("end", function(event) {
          console.log(event);
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
    //关闭
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
    //获取框选的摄像头，卡口
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
            let closestPositionOnLine = window.AMap.GeometryUtil.distanceToLine(
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
            let closestPositionOnLine = window.AMap.GeometryUtil.distanceToLine(
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
        ad.push(k);
      }
      for (let k in bObj) {
        ab.push(k);
      }
      console.log("设备 ad", ad, dObj, bObj);
      console.log("卡口 ab", ab);
      this.cameraIds = ad;
      this.bayonetIds = ab;
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
          this.setMarks();
        }
      });
    },
    // 卡口
    getListBayonet() {
      getAllBayonetList({ areaId: mapXupuxian.adcode }).then(res => {
        if (res) {
          this.listBayonet = res.data;
          this.setMarks();
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
      this.amap.setFitView();
    },
    // 地图标记
    doMark(obj, sClass) {
      console.log('doMark', obj, sClass);
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
.new-analysis-task {
  height: calc(100% - 54px);
  .breadcrumb_heaer {
    background: #fff;
  }
  .new-a-t-content {
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
      position: relative;
      width: 272px;
      padding: 20px 0 20px 20px;
      color: #999;
      background: #fff;
      box-shadow: 5px 0px 16px 0px rgba(169, 169, 169, 0.2);
      animation: fadeInLeft 0.4s ease-out 0.3s both;
      .time-search {
        display: flex;
        p {
          width: 20px;
        }
      }
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
      //下划线
      .line {
        width: 232px;
        height: 1px;
        background-color: #d3d3d3;
        margin: 6px 0;
      }
      //相似度,频次,任务名称搜索
      .similarity,
      .frequency,
      .task-name {
        width: 232px;
      }
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
      .width232 {
        width: 232px;
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
          bottom: 0.3rem;
          right: 0.2rem;
          transition: right 0.3s ease-out;
          animation: fadeInRight 0.4s ease-out 0.4s both;
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
    //关闭按钮
    .close-menu-c {
      @include close_menu;
      left: 272px;
      animation: fadeInLeft 0.4s ease-out 0.3s both;
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
.new-analysis-task {
  // 搜索框
  .search-wrap {
    .el-input__inner {
      background: #f2f2f2;
      border-width: 0;
      border-radius: 20px;
    }
  }
  //相似度搜索
  .similarity {
    .el-input {
      width: 80px;
    }
  }
  //频次
  .frequency {
    .el-input {
      width: 104px;
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
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 212px;
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
  .info-left {
    .el-form-item__content {
      line-height: 1.5;
    }
    .under-line {
      .el-form-item__content {
        line-height: 1;
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