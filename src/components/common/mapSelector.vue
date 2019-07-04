<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    width="1180px"
    class="map_selector_dialog">
    <div class="map_sd_content">
      <div class="sd_search">
        <input type="text" placeholder="请输入关键字" class="sd_search_input" id="map_sd_search_input">
        <span><i class="el-icon-search"></i></span>
      </div>
      <div class="sd_opts">
        <h4>请选择框选图形</h4>
        <ul>
          <li>
            <div :class="{'sd_opts_sed': drawTypes.rectangle != null }" @click="selDrawType(1)"><span class="sd_opts_icon sd_opts_icon1"></span></div>
          </li>
          <li>
            <div :class="{'sd_opts_sed': drawTypes.circle != null }" @click="selDrawType(2)"><span class="sd_opts_icon sd_opts_icon2"></span></div>
          </li>
          <li>
            <div :class="{'sd_opts_sed': drawTypes.polyline != null }" @click="selDrawType(3)"><span class="sd_opts_icon sd_opts_icon3"></span></div>
          </li>
          <li>
            <div :class="{'sd_opts_sed': drawTypes.polygon != null }" @click="selDrawType(4)"><span class="sd_opts_icon sd_opts_icon4"></span></div>
          </li>
          <li>
            <div style="cursor: not-allowed;" :class="{'sd_opts_sed': drawTypes.circle10km != null }" @click="selDrawType(5)"><span class="sd_opts_icon sd_opts_icon5"></span></div>
          </li>
        </ul>
      </div>
      <ul class="sd_fs">
        <li @click="setMapStatus(1)"><i class="el-icon-plus"></i></li>
        <li @click="setMapStatus(2)"><i class="el-icon-minus"></i></li>
      </ul>
      <div style="width: 100%; height: 100%;" id="mapSelector_container"></div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
      <el-button :loading="submitLoading" type="primary" @click="selSubmit" size="small">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {getAllMonitorList, getAllBayonetList} from '@/views/index/api/api.base.js';
import {mapXupuxian} from '@/config/config.js';
export default {
  /* 提交成功后通过在父组件 emit mapSelectorEmit 事件获取所框选的东西 */
  /* 
    open  改变open值则打开窗口
    showTypes  需要操作的东西 D设备 B卡口
    oConfig   初始化地图配置参数
  */
  props: ['open', 'showTypes', 'oConfig'],
  data () {
    return {
      treeList: [],
      // selectorId: 'db_tree_' + random14(),
      amap: null,
      config: {
        _name: '',
        zoom: 11,
        center: [110.596015, 27.907662],
        zooms: [2, 18]
      },
      searchVal: '',

      listDevice: [], // 设备
      listBayonet: [], // 卡口

      drawType: 0,
      drawTypes: {
        rectangle: null, // 1
        circle: null, // 2
        polyline: null, // 3
        polygon: null, // 4
        circle10km: null, // 5
      },

      dialogVisible: false,
      submitLoading: false
    }
  },
  watch: {
    open () {
      this.dialogVisible = true;
      if (this.amap) {
      } else {
        setTimeout(() => {
          this.initMap();
        }, 200)
      }
    },
    oConfig () {
      // console.log('oConfig', this.oConfig)
      setTimeout(() => {
        // this.setMap(this.oConfig);
      }, 300)
    }
  },
  mounted () {
    this.getTreeList();
  },
  methods: {
    initMap () {
      if (this.amap) { return; }
      let _this = this;
      let _config = this.oConfig;
      if (!_config) { _config = {}; }
      _config = Object.assign({}, _config, _this.config);
      // console.log('_config', _config)
      // 初始化地图
      let map = new window.AMap.Map('mapSelector_container', Object.assign({}, _config));
      map.setMapStyle('amap://styles/light');
      // map.setMapStyle('amap://styles/a00b8c5653a6454dd8a6ec3b604ec50c');
      // console.log('_config', _config)
      _this.amap = map;
      /* _this.$nextTick(() => {
        _this.setMap(_config);
      }); */
      // 注册监听，当选中某条记录时会触发
      let auto = new window.AMap.Autocomplete({
        input: 'map_sd_search_input'
      });
      window.AMap.event.addListener(auto, 'select', _this.selectArea);

      _this.setMarks();
      //输入提示
      // window.AMap.plugin('AMap.Autocomplete', function () {
      //   var auto = new AMap.Autocomplete({
      //     input: "map_sd_search_input"
      //   });
      //   // AMap.event.addListener(auto, 'select', _this.selectArea);
      // });
    },
    selectArea (e) {
      console.log(e);
      if (e.poi && e.poi.location) {
        this.amap.setZoom(15);
        this.amap.setCenter(e.poi.location);
      }
    },

    selDrawType (drawType) {
      this.drawType = drawType;
      if (drawType === 1) { // 矩形
        this.drawRectangle();
      } else if (drawType === 2) { // 圆形
        this.drawCircle();
      } else if (drawType === 3) { // 折线
        this.drawPolyline(); 
      }else if (drawType === 4) { // 多边形
        this.drawPolygon(); 
      }
    },
    // 圆形
    drawCircle () {
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
          fillColor: '#FA453A',
          zIndex: 50,
        });
        circle.setMap(this.amap);
        // 缩放地图到合适的视野级别
        this.amap.setFitView([ circle ]);
        let circleEditor = new window.AMap.CircleEditor(this.amap, circle);
        circleEditor.on('end', function(event) {
          console.log('触发事件： end')
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
    drawRectangle () {
      if (this.drawTypes.rectangle !== null) {
        this.closeDraw(1);
      } else {
        let oCneter = this.amap.getCenter();
        var southWest = new AMap.LngLat(oCneter.lng - 0.008, oCneter.lat - 0.005)
        var northEast = new AMap.LngLat(oCneter.lng + 0.008, oCneter.lat + 0.005)
        var bounds = new window.AMap.Bounds(southWest, northEast)
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
          fillColor: '#FA453A',
          cursor:'pointer',
          zIndex:50,
        });
        rectangle.setMap(this.amap);
        // 缩放地图到合适的视野级别
        this.amap.setFitView([ rectangle ]);
        var rectangleEditor = new window.AMap.RectangleEditor(this.amap, rectangle);
        rectangleEditor.on('end', function(event) {
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
    drawPolyline () {
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
          outlineColor: '#ffeeff',
          borderWeight: 3,
          strokeColor: "#3366FF", 
          strokeOpacity: 1,
          strokeWeight: 3,
          // 折线样式还支持 'dashed'
          strokeStyle: "solid",
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 5],
          lineJoin: 'round',
          lineCap: 'round',
          zIndex: 50,
        });
        polyline.setMap(this.amap);
        // 缩放地图到合适的视野级别
        this.amap.setFitView([ polyline ]);
        var polyEditor = new window.AMap.PolyEditor(this.amap, polyline);
        polyEditor.on('end', function(event) {
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
    drawPolygon () {
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
          fillColor: '#FA453A',
          zIndex: 50,
        });
        this.amap.add(polygon);
        // 缩放地图到合适的视野级别
        this.amap.setFitView([ polygon ]);

        var polyEditor = new window.AMap.PolyEditor(this.amap, polygon);
        polyEditor.on('end', function(event) {
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
    closeDraw (drawType) {
      if (drawType === 1 && this.drawTypes.rectangle !== null) {
        if (this.drawTypes.rectangle.editor) { this.drawTypes.rectangle.editor.close(); }
        this.amap.remove(this.drawTypes.rectangle.obj);
        this.drawTypes.rectangle = null;
      } else if (drawType === 2 && this.drawTypes.circle !== null) {
        if (this.drawTypes.circle.editor) { this.drawTypes.circle.editor.close(); }
        this.amap.remove(this.drawTypes.circle.obj);
        this.drawTypes.circle = null;
      } else if (drawType === 3 && this.drawTypes.polyline !== null) {
        if (this.drawTypes.polyline.editor) { this.drawTypes.polyline.editor.close(); }
        this.amap.remove(this.drawTypes.polyline.obj);
        this.drawTypes.polyline = null;
      } else if (drawType === 4 && this.drawTypes.polygon !== null) {
        if (this.drawTypes.polygon.editor) { this.drawTypes.polygon.editor.close(); }
        this.amap.remove(this.drawTypes.polygon.obj);
        this.drawTypes.polygon = null;
      } else if (drawType === 5 && this.drawTypes.pocircle10kmlygon !== null) {
        if (this.drawTypes.pocircle10kmlygon.editor) { this.drawTypes.pocircle10kmlygon.editor.close(); }
        this.amap.remove(this.drawTypes.circle10km.obj);
        this.drawTypes.circle10km = null;
      }
    },

    selSubmit () {
      this.submitLoading = true;
      let dObj = {}, bObj = {};
      if (this.listDevice && this.listDevice.length > 0) {
        for (let i = 0; i < this.listDevice.length; i++) {
          let o = this.listDevice[i];
          if (this.drawTypes.rectangle && this.drawTypes.rectangle.obj) {
            if (this.drawTypes.rectangle.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))) {
              dObj[o.uid] = o;
            }
          }
          if (this.drawTypes.circle && this.drawTypes.circle.obj) {
            if (this.drawTypes.circle.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))) {
              dObj[o.uid] = o;
            }
          }
          if (this.drawTypes.polyline && this.drawTypes.polyline.obj) {
            // distanceToLine closestOnLine
            var closestPositionOnLine  = window.AMap.GeometryUtil.distanceToLine(new window.AMap.LngLat(o.longitude, o.latitude), 
              this.drawTypes.polyline.obj.getPath());
            console.log(closestPositionOnLine);
            if (closestPositionOnLine < 200) {
              dObj[o.uid] = o;
            }
          }
          if (this.drawTypes.polygon && this.drawTypes.polygon.obj) {
            if (this.drawTypes.polygon.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))) {
              dObj[o.uid] = o;
            }
          }
          if (this.drawTypes.circle10km && this.drawTypes.circle10km.obj) {
            if (this.drawTypes.circle10km.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))) {
              dObj[o.uid] = o;
            }
          }
        }
      }
      if (this.listBayonet && this.listBayonet.length > 0) {
        for (let i = 0; i < this.listBayonet.length; i++) {
          let o = this.listBayonet[i];
          if (this.drawTypes.rectangle && this.drawTypes.rectangle.obj) {
            if (this.drawTypes.rectangle.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))) {
              bObj[o.uid] = o;
            }
          }
          if (this.drawTypes.circle && this.drawTypes.circle.obj) {
            if (this.drawTypes.circle.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))) {
              bObj[o.uid] = o;
            }
          }
          if (this.drawTypes.polyline && this.drawTypes.polyline.obj) {
            var closestPositionOnLine  = window.AMap.GeometryUtil.distanceToLine(new window.AMap.LngLat(o.longitude, o.latitude), 
              this.drawTypes.polyline.obj.getPath());
            if (closestPositionOnLine < 200) {
              bObj[o.uid] = o;
            }
          }
          if (this.drawTypes.polygon && this.drawTypes.polygon.obj) {
            if (this.drawTypes.polygon.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))) {
              bObj[o.uid] = o;
            }
          }
          if (this.drawTypes.circle10km && this.drawTypes.circle10km.obj) {
            if (this.drawTypes.circle10km.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))) {
              bObj[o.uid] = o;
            }
          }
        }
      }
      let ad = [], ab = [];
      for (let k in dObj) { ad.push(dObj[k]); }
      for (let k in bObj) { ab.push(bObj[k]); }
      console.log('设备 ad', ad);
      console.log('卡口 ab', ab);
      this.$emit('mapSelectorEmit', {
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

    getTreeList () {
      if (this.showTypes.indexOf('D') >= 0) {
        this.getListDevice();
      }
      if (this.showTypes.indexOf('B') >= 0) {
        this.getListBayonet();
      }                                                                                                                                                                                                                                        
    },
    // 设备
    getListDevice () {
      getAllMonitorList({ccode: mapXupuxian.adcode}).then(res => {
        if (res) {
          this.listDevice = res.data;
        }
      });
    },
    // 卡口
    getListBayonet () {
      getAllBayonetList({areaId: mapXupuxian.adcode}).then(res => {
        if (res) {
          this.listBayonet = res.data;
        }
      });
    },
    // D设备 B卡口
    setMarks () {
      if (this.showTypes.indexOf('D') >= 0) {
        for (let i = 0; i < this.listDevice.length; i++) {
          this.doMark(this.listDevice[i], 'vl_icon vl_icon_sxt');
        }
      }
      if (this.showTypes.indexOf('B') >= 0) {
        for (let i = 0; i < this.listBayonet.length; i++) {
          this.doMark(this.listBayonet[i], 'vl_icon vl_icon_kk');
        }
      }
    },
    // 
    doMark (obj, sClass) {
      // console.log('doMark', obj);
      let marker = new window.AMap.Marker({ // 添加自定义点标记
        map: this.amap,
        position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
        offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // extData: obj,
        // 自定义点标记覆盖物内容
        content: '<div class="map_icons ' + sClass + '"></div>'
      });
    },

    setMapStatus (status) {
      if (this.amap) {
        if (status === 1) {
          this.amap.setZoom(this.amap.getZoom() + 1);
        } else if (status === 2) {
          this.amap.setZoom(this.amap.getZoom() - 1);
        }
      }
    }
  },
  beforeDestroy () {
    if (this.amap) {
      this.amap.destroy();
    }
  }
}
</script>
<style lang="scss" paged>
.sd_opts {
  > h4 {
    padding: 10px 0 0 10px;
    color: #333;
  }
  > ul {
    padding: 0 5px 5px 5px;
    overflow: hidden;
    > li {
      padding: 5px;
      float: left;
      > div {
        padding: 5px;
        &.sd_opts_sed {
          background-color: #F2F9FF;
          > .sd_opts_icon1 { background-image: url(../../assets/img/vehicle/cut1m.png); }
          > .sd_opts_icon2 { background-image: url(../../assets/img/vehicle/cut2m.png); }
          > .sd_opts_icon3 { background-image: url(../../assets/img/vehicle/cut3m.png); }
          > .sd_opts_icon4 { background-image: url(../../assets/img/vehicle/cut4m.png); }
          > .sd_opts_icon5 { background-image: url(../../assets/img/vehicle/cut5m.png); }
        }
      }
    }
  }
}
.sd_opts_icon {
  display: inline-block;
  width: 44px; height: 44px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  &.sd_opts_icon1 { 
    background-image: url(../../assets/img/vehicle/cut1.png);
    &:hover { background-image: url(../../assets/img/vehicle/cut1m.png); }
  }
  &.sd_opts_icon2 {
    background-image: url(../../assets/img/vehicle/cut2.png);
    &:hover { background-image: url(../../assets/img/vehicle/cut2m.png); }
  }
  &.sd_opts_icon3 {
    background-image: url(../../assets/img/vehicle/cut3.png);
    &:hover { background-image: url(../../assets/img/vehicle/cut3m.png); }
  }
  &.sd_opts_icon4 {
    background-image: url(../../assets/img/vehicle/cut4.png);
    &:hover { background-image: url(../../assets/img/vehicle/cut4m.png); }
  }
  &.sd_opts_icon5 {
    background-image: url(../../assets/img/vehicle/cut5.png);
    &:hover { background-image: url(../../assets/img/vehicle/cut5m.png); }
  }
}
</style>
<style lang="scss">
  .map_selector_dialog {
    .el-dialog__header { display: none; }
    .el-dialog__body { padding: 0; }
    .map_sd_content {
      position: relative;
      width: 100%; height: 600px;
      > .sd_search {
        position: absolute; top: 20px; left: 20px; z-index: 1000;
        background-color: #fff;
        overflow: hidden;
        > .sd_search_input {
          float: left;
          width: 270px; height: 36px; line-height: 36px;
          background:rgba(255,255,255,1);
          box-shadow:0px 3px 10px 0px rgba(99,99,99,0.39);
          border: 0;
          padding: 0 15px;
        }
        > span {
          float: left;
          width: 60px; height: 36px; line-height: 36px;
          background-color: #0C70F8;
          cursor: pointer;
          text-align: center;
          > i {
            position: relative; top: 2px;
            color: #fff; font-size: 20px;
          }
        }
      }
      > .sd_opts {
        position: absolute; top: 70px; left: 20px; z-index: 1000;
        background-color: #fff;
      }
      > .sd_fs {
        position: absolute; bottom: 20px; right: 20px; z-index: 1000;
        background-color: #fff;
        padding: 10px 5px;
        box-shadow:-12px 0px 14px 0px rgba(148,148,148,0.24);
        > li {
          padding: 10px;
          cursor: pointer;
          > i { font-size: 20px; color: #0C70F8; }
        }
      }
    }
    .el-dialog__footer { padding: 20px 0; }
  }
  .amap-sug-result { z-index: 3000; display: none; }
</style>


