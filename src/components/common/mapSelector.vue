<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    width="1180px"
    class="map_selector_dialog">
    <div class="map_sd_content" :id="sid">
      <div class="sd_search">
        <input type="text" placeholder="请输入关键字" class="sd_search_input" id="map_sd_search_input">
        <span><i class="el-icon-search"></i></span>
      </div>
      <div class="sd_opts">
        <h4>请选择框选图形</h4>
        <ul>
          <li>
            <div :class="{'sd_opts_sed': drawActiveType === 1 }" @click="selDrawType(1)"><span class="sd_opts_icon sd_opts_icon1"></span></div>
          </li>
          <li>
            <div :class="{'sd_opts_sed': drawActiveType === 2 }" @click="selDrawType(2)"><span class="sd_opts_icon sd_opts_icon2"></span></div>
          </li>
          <li>
            <div :class="{'sd_opts_sed': drawActiveType === 3 }" @click="selDrawType(3)"><span class="sd_opts_icon sd_opts_icon3"></span></div>
          </li>
          <li>
            <div :class="{'sd_opts_sed': drawActiveType === 4 }" @click="selDrawType(4)"><span class="sd_opts_icon sd_opts_icon4"></span></div>
          </li>
          <li>
            <div :class="{'sd_opts_sed': drawActiveType === 5 }" @click="selDrawType(5)"><span class="sd_opts_icon sd_opts_icon5"></span></div>
          </li>
        </ul>
      </div>
      <ul class="sd_fs">
        <li @click="setMapStatus(1)"><i class="el-icon-plus"></i></li>
        <li @click="setMapStatus(2)"><i class="el-icon-minus"></i></li>
      </ul>
      <div style="width: 100%; height: 100%;" :id="sid + '_container'"></div>
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
import {random14} from '@/utils/util.js';
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
      sid: 'map_selector_' + random14(),
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

      mouseTool: null,
      drawType: 0,
      drawTypes: {
        rectangle: null, // 1
        circle: null, // 2
        polyline: null, // 3
        polygon: null, // 4
        circle10km: null, // 5
      },

      drawActiveType: null, // 
      drawObj: {
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
        circle10km: {}
      },
      zIndex: 50,

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
    this.mapEvents();
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
      let map = new window.AMap.Map(this.sid + '_container', Object.assign({}, _config));
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

      // 在地图中添加MouseTool插件
      this.mouseTool = new window.AMap.MouseTool(map);
      this.mouseTool.on("draw", (event) => {
        // event.obj 为绘制出来的覆盖物对象
        console.log('draw event', event);
        let _sid = random14();
        //  return
        if (this.drawActiveType === 1) {
          this.drawObj.rectangle[_sid] = {};
          this.drawObj.rectangle[_sid].obj = event.obj;
          this.drawRectangleMark(_sid, event.obj);
        } else if (this.drawActiveType === 2) {
          this.drawObj.circle[_sid] = {};
          this.drawObj.circle[_sid].obj = event.obj;
          this.drawCircleMark(_sid, event.obj);
        } else if (this.drawActiveType === 3) {
          this.drawObj.polyline[_sid] = {};
          this.drawObj.polyline[_sid].obj = event.obj;
          this.drawPolylineMark(_sid, event.obj);
        } else if (this.drawActiveType === 4) {
          this.drawObj.polygon[_sid] = {};
          this.drawObj.polygon[_sid].obj = event.obj;
          this.drawPolygonMark(_sid, event.obj);
        } else if (this.drawActiveType === 5) {
          this.drawObj.circle10km[_sid] = {};
          this.drawObj.circle10km[_sid].obj = event.obj;
        }
        this.mouseTool.close(false);
        this.amap.setDefaultCursor();
        this.drawActiveType = 0;
        console.log("覆盖物对象绘制完成");
        // log.info('覆盖物对象绘制完成')
      });

      _this.setMarks();
    },
    mapEvents () {
      let _this = this, nContent = $('body');
      nContent.on('click', '.el-icon-close', function () {
        let nOpt = $(this).closest('.ms_marker_opt');
        let _sid = nOpt.attr('_sid'), _type = Number(nOpt.attr('_type'));
        // console.log('mapEvents', _sid);
        // console.log(_this.drawObj);
        _this.removeMarkers(_type, _sid);
        // if (_this.drawObj.rectangle[_sid]) {
        //   _this.removeMarkers(_this.drawObj.rectangle[_sid]);
        //   delete _this.drawObj.rectangle[_sid];
        // }
      });
    },
    removeMarkers (drawType, sid) {
      let obj = null;
      if (drawType === 1) { // 矩形
        obj =  this.drawObj.rectangle[sid];
      } else if (drawType === 2) { // 圆形
        obj =  this.drawObj.circle[sid];
      } else if (drawType === 3) { // 折线
        obj =  this.drawObj.polyline[sid];
      } else if (drawType === 4) { // 多边形
        obj =  this.drawObj.polygon[sid];
      } else if (drawType === 5) {
        obj =  this.drawObj.circle10km[sid];
      }
      if (obj) {
        if (obj.obj) { this.amap.remove(obj.obj); }
        if (obj.marker) { this.amap.remove(obj.marker); }
        if (obj.editor) { this.amap.remove(obj.editor); }
      }
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
      this.drawActiveType = drawType;
      if (drawType === 1) { // 矩形
        this.drawRectangle();
      } else if (drawType === 2) { // 圆形
        this.drawCircle();
      } else if (drawType === 3) { // 折线
        this.drawPolyline(); 
      } else if (drawType === 4) { // 多边形
        this.drawPolygon(); 
      } else if (drawType === 5) { // 多边形
        this.drawCircle10km(); 
      }
    },
    // 圆形
    drawCircle () {
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
        fillColor: '#FA453A',
        zIndex: this.zIndex
      });
    },
    drawCircleMark (sid, obj) {
      // console.log('circle', obj);
      // console.log('circle getRadius', obj.getBounds());
      // console.log('circle getRadius', obj.getBounds().getNorthEast());
      // console.log('circle center', obj.getCenter());
      let ne = obj.getBounds().getNorthEast();
      let c = obj.getCenter()
      let _q = c.Q + (ne.Q - c.Q) * 0.66667;
      let _p = c.P + (ne.P - c.P) * 0.7444444;
      let marker = new window.AMap.Marker({ // 添加自定义点标记
        map: this.amap,
        position: [_q, _p], // 基点位置 矩形的右上点
        offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        zIndex: this.zIndex,
        // extData: obj,
        // 自定义点标记覆盖物内容
        content: '<div _sid="' + sid + '" _type="2" class="ms_marker_opt ms_marker_circle"><div>' +
          '<i class="el-icon-close" title="删除"></i>' +
          // '<i class="el-icon-edit ms_marker_rectang" title="编辑"></i>' +
          // '<i class="el-icon-check ms_marker_rectang" title="完成"></i>' +
          '</div></div>'
      });
      if (this.drawObj.circle[sid]) {
        this.drawObj.circle[sid].marker = marker;
      }
    },
    // 矩形
    drawRectangle () {
      this.amap.setDefaultCursor("crosshair");
      this.mouseTool.rectangle({
        strokeColor: "#FA453A", 
        strokeOpacity: 1,
        strokeWeight: 1,
        fillOpacity: 0.2,
        fillColor: '#FA453A',
        cursor:'pointer',
        strokeStyle: "solid",
        zIndex: this.zIndex
      });
    },
    drawRectangleEditor (sid) {
      if (this.drawObj.rectangle[sid] && this.drawObj.rectangle[sid].obj) {
        let rectangleEditor = new window.AMap.RectangleEditor(this.amap, this.drawObj.rectangle[sid].obj);
        rectangleEditor.on('end', function(event) {
          // log.info('触发事件： end')
          // event.target 即为编辑后的矩形对象
        });
        rectangleEditor.open();
        this.drawObj.rectangle[sid].editor = rectangleEditor;
      }
    },
    drawRectangleMark (sid, obj) {
      // console.log('drawRectangleMark getRadius', obj.getBounds());
      let marker = new window.AMap.Marker({ // 添加自定义点标记
        map: this.amap,
        // position: obj.B.path[0], // 基点位置 矩形的右上点
        position: obj.getBounds().northeast, // 基点位置 矩形的右上点
        offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        zIndex: this.zIndex,
        // extData: obj,
        // 自定义点标记覆盖物内容
        content: '<div _sid="' + sid + '" _type="1" class="ms_marker_opt ms_marker_rectang"><div>' +
          '<i class="el-icon-close" title="删除"></i>' +
          // '<i class="el-icon-edit ms_marker_rectang" title="编辑"></i>' +
          // '<i class="el-icon-check ms_marker_rectang" title="完成"></i>' +
          '</div></div>'
      });
      if (this.drawObj.rectangle[sid]) {
        this.drawObj.rectangle[sid].marker = marker;
      }
    },
    // 折线
    drawPolyline () {
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
    },
    drawPolylineMark (sid, obj) {
      // console.log('drawRectangleMark getRadius', obj.getBounds());
      let p = obj.getPath()[obj.getPath().length - 1];
      let marker = new window.AMap.Marker({ // 添加自定义点标记
        map: this.amap,
        // position: obj.B.path[0], // 基点位置 矩形的右上点
        position: p, // 基点位置 矩形的右上点
        offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        zIndex: this.zIndex,
        // extData: obj,
        // 自定义点标记覆盖物内容
        content: '<div _sid="' + sid + '" _type="3" class="ms_marker_opt ms_marker_polyline"><div>' +
          '<i class="el-icon-close" title="删除"></i>' +
          // '<i class="el-icon-edit ms_marker_rectang" title="编辑"></i>' +
          // '<i class="el-icon-check ms_marker_rectang" title="完成"></i>' +
          '</div></div>'
      });
      if (this.drawObj.polyline[sid]) {
        this.drawObj.polyline[sid].marker = marker;
      }
    },
    // 多边形
    drawPolygon () {
      this.amap.setDefaultCursor("crosshair");
      this.mouseTool.polygon({
        strokeColor: "#FA453A",
        strokeOpacity: 1,
        bubble: true,
        strokeWeight: 1,
        fillColor: "#FA453A",
        fillOpacity: 0.2,
        isRing: false,
        zIndex: this.zIndex,
      });
    },
    drawPolygonMark (sid, obj) {
      console.log('drawPolygonMark getPath', obj.getPath());
      let p = obj.getPath()[obj.getPath().length - 1];
      let marker = new window.AMap.Marker({ // 添加自定义点标记
        map: this.amap,
        // position: obj.B.path[0], // 基点位置 矩形的右上点
        position: p, // 基点位置 矩形的右上点
        offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        zIndex: this.zIndex,
        // extData: obj,
        // 自定义点标记覆盖物内容
        content: '<div _sid="' + sid + '" _type="4" class="ms_marker_opt ms_marker_polygon"><div>' +
          '<i class="el-icon-close" title="删除"></i>' +
          // '<i class="el-icon-edit ms_marker_rectang" title="编辑"></i>' +
          // '<i class="el-icon-check ms_marker_rectang" title="完成"></i>' +
          '</div></div>'
      });
      if (this.drawObj.polygon[sid]) {
        this.drawObj.polygon[sid].marker = marker;
      }
    },

    drawCircle10km () {
      this.amap.setDefaultCursor("crosshair");
      this.amap.on('click', this.drawCircle10kmClick);
    },
    drawCircle10kmClick (e) {
      console.log('drawCircle10kmClick', e);
      // e.lnglat.getLng()+','+e.lnglat.getLat()
      let circle = new AMap.Circle({
        center: e.lnglat,
        radius: 1000 * 10, //半径
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
      let _sid = random14();
      this.drawObj.circle10km[_sid] = {};
      this.drawObj.circle10km[_sid].obj = circle;
      this.amap.setDefaultCursor();
      this.drawActiveType = 0;
      this.amap.off('click', this.drawCircle10kmClick);
      this.drawCircle10kmMark(_sid, circle);
    },
    drawCircle10kmMark (sid, obj) {
      // console.log('circle', obj);
      // console.log('circle getRadius', obj.getBounds());
      // console.log('circle getRadius', obj.getBounds().getNorthEast());
      // console.log('circle center', obj.getCenter());
      let ne = obj.getBounds().getNorthEast();
      let c = obj.getCenter()
      let _q = c.Q + (ne.Q - c.Q) * 0.66667;
      let _p = c.P + (ne.P - c.P) * 0.7444444;
      let marker = new window.AMap.Marker({ // 添加自定义点标记
        map: this.amap,
        position: [_q, _p], // 基点位置 矩形的右上点
        offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        zIndex: this.zIndex,
        // extData: obj,
        // 自定义点标记覆盖物内容
        content: '<div _sid="' + sid + '" _type="5" class="ms_marker_opt ms_marker_circle"><div>' +
          '<i class="el-icon-close" title="删除"></i>' +
          // '<i class="el-icon-edit ms_marker_rectang" title="编辑"></i>' +
          // '<i class="el-icon-check ms_marker_rectang" title="完成"></i>' +
          '</div></div>'
      });
      if (this.drawObj.circle10km[sid]) {
        this.drawObj.circle10km[sid].marker = marker;
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
.ms_marker_opt {
  position: relative; width: 0; height: 0;
  > div {
    position: absolute;
    padding: 0;
    word-break:keep-all; white-space:nowrap;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 50%;
    > span { display: inline-block; }
    > i {
      display: inline-block;
      padding: 0 2px;
      font-size: 16px;
    }
    > .el-icon-check {
      color: #67C23A;
    }
    > .el-icon-close {
      color: #FA453A;
    }
    > .el-icon-edit {
      color: #E6A23C; font-size: 19px;
    }
  }
  &.ms_marker_rectang { right: 10px; top: -10px; }
  &.ms_marker_circle { left: 0; top: -10px; }
  &.ms_marker_polyline { left: -10px; top: -10px; }
  &.ms_marker_polygon { left: -10px; top: -10px; }
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
    .el-dialog__footer { padding: 10px 0; }
  }
  .amap-sug-result { z-index: 3000; display: none; }
</style>


