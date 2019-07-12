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
            <div title="选择矩形范围内的设备" :class="{'sd_opts_sed': drawActiveType === 1 }" @click="selDrawType(1)"><span class="sd_opts_icon sd_opts_icon1"></span></div>
          </li>
          <li>
            <div title="选择圆形范围内的设备" :class="{'sd_opts_sed': drawActiveType === 2 }" @click="selDrawType(2)"><span class="sd_opts_icon sd_opts_icon2"></span></div>
          </li>
          <li>
            <div title="选择折线100米范围内的设备" :class="{'sd_opts_sed': drawActiveType === 3 }" @click="selDrawType(3)"><span class="sd_opts_icon sd_opts_icon3"></span></div>
          </li>
          <li>
            <div title="选择多边形范围内的设备" :class="{'sd_opts_sed': drawActiveType === 4 }" @click="selDrawType(4)"><span class="sd_opts_icon sd_opts_icon4"></span></div>
          </li>
          <li>
            <div title="选择10公里圆形范围内的设备" :class="{'sd_opts_sed': drawActiveType === 5 }" @click="selDrawType(5)"><span class="sd_opts_icon sd_opts_icon5"></span></div>
          </li>
        </ul>
        <p>
          <span v-if="drawActiveType === 1">在地图上按住鼠标左键拖动鼠标框选，松开鼠标完成选择</span>
          <span v-else-if="drawActiveType === 2">在地图上按住鼠标左键选择圆心，拖动鼠标作为半径，松开鼠标完成选择</span>
          <span v-else-if="drawActiveType === 3">在地图上鼠标左键选择两个或两个以上点形成折线，双击或右键完成选择</span>
          <span v-else-if="drawActiveType === 4">在地图上鼠标左键选择三个或三个以上点形成封闭区域，双击或右键完成选择</span>
          <span v-else-if="drawActiveType === 5">在地图上鼠标左键选择圆心，形成10公里大小的圆形区域</span>
        </p>
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
import {getAllMonitorList, getAllBayonetList, getDeviceByBayonetUids} from '@/views/index/api/api.base.js';
import {mapXupuxian} from '@/config/config.js';
import {random14} from '@/utils/util.js';
export default {
  /* 提交成功后通过在父组件 emit mapSelectorEmit 事件获取所框选的东西 */
  /* 
    open  改变open值则打开窗口
    showTypes  需要操作的东西 D设备 B卡口
    oConfig   初始化地图配置参数
    clear  改变clear值则会清空已绘制的图形
  */
  props: ['open', 'clear', 'showTypes', 'oConfig'],
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

      mapEventActive: false,

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
        this.$nextTick(() => {
          setTimeout(() => {
            this.initMap();
            if (!this.mapEventActive) {
              this.mapEvents();
            }
          }, 100);
        });
      }
    },
    clear () {
      console.log('watch clear');
      this.drawClear();
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
        // console.log('draw event', event);
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
      });

      _this.setMarks();
    },
    // 编辑 删除 完成事件
    mapEvents () {
      let _this = this, nContent = $('#' + this.sid);
      // el-icon-edit el-icon-close el-icon-check
      nContent.on('click', '.el-icon-close', function () {
        // 删除
        let nOpt = $(this).closest('.ms_marker_opt');
        let _sid = nOpt.attr('_sid'), _type = Number(nOpt.attr('_type'));
        _this.removeMarkers(_type, _sid);
      }).on('click', '.el-icon-edit', function () {
        // 编辑
        let nOpt = $(this).closest('.ms_marker_opt');
        let _sid = nOpt.attr('_sid'), _type = Number(nOpt.attr('_type'));
        nOpt.find('.el-icon-edit').hide();
        nOpt.find('.el-icon-check').show();
        _this.editMarkers(_type, _sid);
      }).on('click', '.el-icon-check', function () {
        // 完成
        let nOpt = $(this).closest('.ms_marker_opt');
        let _sid = nOpt.attr('_sid'), _type = Number(nOpt.attr('_type'));
        nOpt.find('.el-icon-check').hide();
        nOpt.find('.el-icon-edit').show();
        _this.checkMarkers(_type, _sid);
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
        this.drawClearDo(obj);
      }
    },
    editMarkers (drawType, sid) {
      if (drawType === 1) { // 矩形
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
    checkMarkers (drawType, sid) {
      if (drawType === 1) { // 矩形
        if (this.drawObj.rectangle[sid] && this.drawObj.rectangle[sid].editor) {
          this.drawObj.rectangle[sid].editor.close();
        }
      } else if (drawType === 2) { // 圆形
        if (this.drawObj.circle[sid] && this.drawObj.circle[sid].editor) {
          this.drawObj.circle[sid].editor.close();
        }
      } else if (drawType === 3) { // 折线
        if (this.drawObj.polyline[sid] && this.drawObj.polyline[sid].editor) {
          this.drawObj.polyline[sid].editor.close();
        }
      } else if (drawType === 4) {
        if (this.drawObj.polygon[sid] && this.drawObj.polygon[sid].editor) {
          this.drawObj.polygon[sid].editor.close();
        }
      } else if (drawType === 5) {
        if (this.drawObj.circle10km[sid] && this.drawObj.circle10km[sid].editor) {
          this.drawObj.circle10km[sid].editor.close();
        }
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
      this.zIndex += 1;
    },
    drawRectangleEditor (sid) {
      if (this.drawObj.rectangle[sid]) {
        let _this = this, obj = this.drawObj.rectangle[sid];
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
            fillColor: '#FA453A',
            cursor:'pointer',
            zIndex: this.zIndex
          });
          this.zIndex += 1;
          rectangle.setMap(this.amap);
          obj.obj = rectangle;
          let rectangleEditor = new window.AMap.RectangleEditor(this.amap, rectangle);
          /* rectangleEditor.on('end', function(event) {
            // event.target 即为编辑后的矩形对象
          }); */
          rectangleEditor.on('adjust', function(event) {
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
      }
    },
    drawRectangleMark (sid, obj) {
      // console.log('drawRectangleMark getRadius', obj.getBounds());
      let ap = [obj.getBounds().southwest.Q, obj.getBounds().northeast.P];
      let marker = new window.AMap.Marker({ // 添加自定义点标记
        map: this.amap,
        // position: obj.B.path[0], // 基点位置 矩形的右上点
        position: ap, // 基点位置 矩形的右上点
        offset: new window.AMap.Pixel(-1, -23), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        zIndex: this.zIndex,
        // extData: obj,
        // 自定义点标记覆盖物内容
        content: '<div _sid="' + sid + '" _type="1" class="ms_marker_opt ms_marker_rectang"><div>' +
          '<i class="el-icon-close" title="删除"></i>' +
          '<i class="el-icon-edit" title="编辑"></i>' +
          '<i class="el-icon-check" title="完成"></i>' +
          '</div></div>'
      });
      this.zIndex += 1;
      if (this.drawObj.rectangle[sid]) {
        this.drawObj.rectangle[sid].marker = marker;
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
      this.zIndex += 1;
    },
    drawCircleEditor (sid) {
      if (this.drawObj.circle[sid]) {
        let _this = this, obj = this.drawObj.circle[sid];
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
            fillColor: '#FA453A',
            zIndex: this.zIndex
          });
          this.zIndex += 1;
          // 删除原来的矩形
          this.amap.remove(obj.obj);
          circle.setMap(this.amap);
          obj.obj = circle;
          let circleEditor = new window.AMap.CircleEditor(_this.amap, circle);
          circleEditor.on('adjust', function(event) {
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
          circleEditor.on('move', function(event) { // 拖拽圆心调整圆形位置时触发此事件
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
    drawCircleMark (sid, obj) {
      let ne = obj.getBounds().getSouthWest();
      let c = obj.getCenter()
      let _q = c.Q + (ne.Q - c.Q) * 0.705;
      let _p = c.P + (ne.P - c.P) * 0.705;
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
          '<i class="el-icon-edit" title="编辑"></i>' +
          '<i class="el-icon-check" title="完成"></i>' +
          '</div></div>'
      });
      this.zIndex += 1;
      if (this.drawObj.circle[sid]) {
        this.drawObj.circle[sid].marker = marker;
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
      this.zIndex += 1;
    },
    drawPolylineEditor (sid) {
      if (this.drawObj.polyline[sid]) {
        let _this = this, obj = this.drawObj.polyline[sid];
        if (obj.editor) {
          obj.editor.open();
        } else {
          let polyEditor = new window.AMap.PolyEditor(this.amap, obj.obj);
          polyEditor.on('adjust', function(event) {
            // event.target 即为编辑后的对象
            // 需要重新定位marker
            if (obj.marker) {
              obj.marker.setPosition(event.target.getPath()[event.target.getPath().length - 1]);
            }
          });
          obj.editor = polyEditor;
          polyEditor.open();
        }
      }
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
          '<i class="el-icon-edit" title="编辑"></i>' +
          '<i class="el-icon-check" title="完成"></i>' +
          '</div></div>'
      });
      this.zIndex += 1;
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
      this.zIndex += 1;
    },
    drawPolygonEditor (sid) {
      if (this.drawObj.polygon[sid]) {
        let _this = this, obj = this.drawObj.polygon[sid];
        if (obj.editor) {
          obj.editor.open();
        } else {
          var polyEditor = new window.AMap.PolyEditor(this.amap, obj.obj);
          polyEditor.on('adjust', function(event) {
            // event.target 即为编辑后的对象
            // 需要重新定位marker
            if (obj.marker) {
              obj.marker.setPosition(event.target.getPath()[event.target.getPath().length - 1]);
            }
          });
          obj.editor = polyEditor;
          polyEditor.open();
        }
      }
    },
    drawPolygonMark (sid, obj) {
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
          '<i class="el-icon-edit" title="编辑"></i>' +
          '<i class="el-icon-check" title="完成"></i>' +
          '</div></div>'
      });
      this.zIndex += 1;
      if (this.drawObj.polygon[sid]) {
        this.drawObj.polygon[sid].marker = marker;
      }
    },
    drawCircle10km () {
      this.amap.setDefaultCursor("crosshair");
      this.amap.on('click', this.drawCircle10kmClick);
    },
    drawCircle10kmClick (e) {
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
        fillColor: '#FA453A',
        zIndex: this.zIndex
      });
      this.zIndex += 1;
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
    drawCircle10kmEditor (sid) {
      if (this.drawObj.circle10km[sid]) {
        let _this = this, obj = this.drawObj.circle10km[sid];
        if (obj.editor) {
          obj.editor.open();
        } else {
          let circleEditor = new window.AMap.CircleEditor(this.amap, obj.obj);
          circleEditor.on('adjust', function(event) {
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
          circleEditor.on('move', function(event) { // 拖拽圆心调整圆形位置时触发此事件
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
    drawCircle10kmMark (sid, obj) {
      let ne = obj.getBounds().getSouthWest();
      let c = obj.getCenter();
      let _q = c.Q + (ne.Q - c.Q) * 0.705;
      let _p = c.P + (ne.P - c.P) * 0.705;
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
          '<i class="el-icon-edit" title="编辑"></i>' +
          '<i class="el-icon-check" title="完成"></i>' +
          '</div></div>'
      });
      this.zIndex += 1;
      if (this.drawObj.circle10km[sid]) {
        this.drawObj.circle10km[sid].marker = marker;
      }
    },
    selSubmit () {
      // this.drawObj.circle10km 
      // rectangle circle polyline polygon circle10km
      this.submitLoading = true;
      let dObj = {}, bObj = {};
      if (this.listDevice && this.listDevice.length > 0) {
        for (let i = 0; i < this.listDevice.length; i++) {
          let o = this.listDevice[i];
          // 矩形
          if (this.drawObj.rectangle) {
            for (let k in this.drawObj.rectangle) {
              let so = this.drawObj.rectangle[k];
              if (so.obj && so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))) {
                dObj[o.uid] = o;
              }
            }
          }
          // 圆形
          if (this.drawObj.circle) {
            for (let k in this.drawObj.circle) {
              let so = this.drawObj.circle[k];
              if (so.obj && so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))) {
                dObj[o.uid] = o;
              }
            }
          }
          // 线
          if (this.drawObj.polyline) {
            for (let k in this.drawObj.polyline) {
              let so = this.drawObj.polyline[k];
              if (so && so.obj && window.AMap.GeometryUtil.distanceToLine(new window.AMap.LngLat(o.longitude, o.latitude), 
                so.obj.getPath()) < 200) {
                dObj[o.uid] = o;
              }
            }
          }
          // 多边形
          if (this.drawObj.polygon) {
            for (let k in this.drawObj.polygon) {
              let so = this.drawObj.polygon[k];
              if (so.obj && so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))) {
                dObj[o.uid] = o;
              }
            }
          }
          if (this.drawObj.circle10km) {
            for (let k in this.drawObj.circle10km) {
              let so = this.drawObj.circle10km[k];
              if (so.obj && so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))) {
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
          if (this.drawObj.rectangle) {
            for (let k in this.drawObj.rectangle) {
              let so = this.drawObj.rectangle[k];
              if (so.obj && so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))) {
                bObj[o.uid] = o;
              }
            }
          }
          // 圆形
          if (this.drawObj.circle) {
            for (let k in this.drawObj.circle) {
              let so = this.drawObj.circle[k];
              if (so.obj && so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))) {
                bObj[o.uid] = o;
              }
            }
          }
          // 线
          if (this.drawObj.polyline) {
            for (let k in this.drawObj.polyline) {
              let so = this.drawObj.polyline[k];
              if (so && so.obj && window.AMap.GeometryUtil.distanceToLine(new window.AMap.LngLat(o.longitude, o.latitude), 
                so.obj.getPath()) < 200) {
                bObj[o.uid] = o;
              }
            }
          }
          // 多边形
          if (this.drawObj.polygon) {
            for (let k in this.drawObj.polygon) {
              let so = this.drawObj.polygon[k];
              if (so.obj && so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))) {
                bObj[o.uid] = o;
              }
            }
          }
          if (this.drawObj.circle10km) {
            for (let k in this.drawObj.circle10km) {
              let so = this.drawObj.circle10km[k];
              if (so.obj && so.obj.contains(new window.AMap.LngLat(o.longitude, o.latitude))) {
                bObj[o.uid] = o;
              }
            }
          }
        }
      }
      let ad = [], ab = [], abIds = [];
      for (let k in dObj) { ad.push(dObj[k]); }
      for (let k in bObj) { 
        ab.push(bObj[k]);
        abIds.push(k);
      }
      if (abIds && abIds.length > 0) {
        getDeviceByBayonetUids(abIds).then(res => {
          let bayonetDeviceList = [];
          if (res && res.data) {
            bayonetDeviceList = res.data;
          }
          this.$emit('mapSelectorEmit', {
            deviceList: ad,
            bayonetList: ab,
            bayonetDeviceList: bayonetDeviceList
          });
          this.submitLoading = false;
          this.dialogVisible = false;
        }).catch(() => {
          this.submitLoading = false;
        });
      } else {
        this.$emit('mapSelectorEmit', {
          deviceList: ad,
          bayonetList: ab,
          bayonetDeviceList: []
        });
        this.submitLoading = false;
        this.dialogVisible = false;
      }
      console.log('设备 ad', ad);
      console.log('卡口 ab', ab);
    },
    drawClear () {
      // 矩形
      if (this.drawObj.rectangle) {
        for (let k in this.drawObj.rectangle) {
          this.drawClearDo(this.drawObj.rectangle[k]);
        }
        this.drawObj.rectangle = {};
      }
      // 圆形
      if (this.drawObj.circle) {
        for (let k in this.drawObj.circle) {
          this.drawClearDo(this.drawObj.circle[k]);
        }
        this.drawObj.circle = {};
      }
      // 线
      if (this.drawObj.polyline) {
        for (let k in this.drawObj.polyline) {
          this.drawClearDo(this.drawObj.polyline[k]);
        }
        this.drawObj.polyline = {};
      }
      // 多边形
      if (this.drawObj.polygon) {
        for (let k in this.drawObj.polygon) {
          this.drawClearDo(this.drawObj.polygon[k]);
        }
        this.drawObj.polygon = {};
      }
      if (this.drawObj.circle10km) {
        for (let k in this.drawObj.circle10km) {
          this.drawClearDo(this.drawObj.circle10km[k]);
        }
        this.drawObj.circle10km = {};
      }
    },
    drawClearDo (obj) {
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
          let _d = this.listDevice[i];
          let sC = 'vl_icon_sxt';
          if (_d.deviceStatus !== 1) { sC = 'vl_icon_sxt_dis'; }
          this.doMark([_d.longitude, _d.latitude],
            _d.deviceName, 'vl_icon ' + sC);
        }
      }
      if (this.showTypes.indexOf('B') >= 0) {
        for (let i = 0; i < this.listBayonet.length; i++) {
          let _d = this.listBayonet[i];
          let sC = 'vl_icon_kk';
          if (!_d.isEnabled) { sC = 'vl_icon_kk_dis'; }
          this.doMark([_d.longitude, _d.latitude],
            _d.bayonetName, 'vl_icon ' + sC);
        }
      }
    },
    // 
    doMark (lnglat, title, sClass) {
      // console.log('doMark', obj);
      let marker = new window.AMap.Marker({ // 添加自定义点标记
        map: this.amap,
        position: lnglat, // 基点位置 [116.397428, 39.90923]
        offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // extData: obj,
        // 自定义点标记覆盖物内容
        content: '<div title="' + title + '" class="map_icons ' + sClass + '"></div>'
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
    padding: 0 5px 0 5px;
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
  > p {
    max-width: 320px;
    padding: 0 10px 10px 10px;
    margin: 0 auto;
    > span {
      color: #999; font-size: 12px;
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
  > div {
    word-break:keep-all; white-space:nowrap;
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 0 2px;
    > span { display: inline-block; }
    > i {
      display: inline-block;
      padding: 0 2px;
      font-size: 18px;
    }
    > .el-icon-check {
      display: none;
      color: #67C23A;
    }
    > .el-icon-close {
      color: #FA453A;
    }
    > .el-icon-edit {
      color: #E6A23C; font-size: 18px;
    }
  }
  &.ms_marker_rectang { left: 0px; bottom: 0px; }
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
        position: absolute; top: 10px; left: 10px; z-index: 1000;
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
        position: absolute; top: 55px; left: 10px; z-index: 1000;
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


