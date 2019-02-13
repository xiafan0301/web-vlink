<template>
  <div class="vl_map" :class="{'vl_map_selarea_ctl': selAreaAble}">
    <!-- 左侧导航 -->
    <div class="map_l">
      <div>
        <div class="map_lt">
          <ul>
            <li :class="{'map_lt_ul_sed': tabType === 1}" @click="tabType = 1">人员列表</li>
            <li :class="{'map_lt_ul_sed': tabType === 2}" @click="tabType = 2">通话记录</li>
          </ul>
          <div :style="{'left': tabType === 1 ? 0 : '50%'}"></div>
        </div>
        <div class="map_lc">
          <!-- 人员列表 -->
          <div class="map_lc_d" v-show="tabType === 1">
            <div class="map_lc_dt">
                <el-input
                  class="vl_map_lc_dt_inp"
                  size="small"
                  placeholder="请输入内容"
                  v-model="mapInfoVal">
                </el-input>
                <i class="el-icon-search"></i>
            </div>
            <div class="map_lc_dc">
              <div>
                <el-tree :data="mapTreeData" :props="mapTreeProps"></el-tree>
              </div>
            </div>
          </div>
          <!-- 通话记录 -->
          <div class="map_lc_b" v-show="tabType === 2">通话记录</div>
        </div>
      </div>
    </div>
    <!-- 右侧地图 -->
    <div class="map_r">
      <!-- 地图容器 -->
      <div class="map_rm" id="mapMap"></div>
      <!-- 右侧工具栏 -->
      <div class="map_rrt">
        <ul class="map_rrt_u1">
          <li :class="{'vl_icon_sed': selAreaAcitve}" @click="selArea">
            <i class="vl_icon vl_icon_041"></i>
            <span>选择区域</span>
          </li>
          <li :class="{'vl_icon_sed': rangingAcitve}" @click="ranging">
            <i class="vl_icon vl_icon_042"></i>
            <span>测距</span>
          </li>
          <li style="cursor: not-allowed;">
            <i class="vl_icon vl_icon_043"></i>
            <span>截屏</span>
          </li>
          <li :class="{'vl_icon_sed': markAcitve}" @click="mark">
            <i class="vl_icon vl_icon_044"></i>
            <span>标注</span>
          </li>
          <li @click="resetTools">
            <i class="vl_icon vl_icon_045"></i>
            <span>恢复默认</span>
          </li>
        </ul>
        <ul class="map_rrt_u2">
          <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
          <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
        </ul>
      </div>
    </div>
    <!-- 视频通话窗口LIST -->
    <ul class="com_list">
      <li v-for="(value, key) in comList" :key="'com_list_' + key">
        <div :id="'comDialog_' + key">
          <video src="" width="254px" height="400px" autoplay="zautoplay"></video>
          <div class="com_li_user" @click="testChangeState(key, value.state)">
            <i></i>
            <div>
              <h3>{{value.userName}}</h3>
              <p v-html="comStateHtmlComDialog(key, value.type, value.state)"></p>
            </div>
          </div>
          <i class="com_li_full vl_icon vl_icon_vc_011"></i>
          <div class="com_li_time">
            <div v-if="value.state === 2 || value.state === 3">{{value.changer | fmDisTime(value.time, 'HH:mm:ss')}}</div>
          </div>
          <div class="com_li_opt">
            <span v-if="value.state === 3 || value.state === 4">
              <i class="vl_icon vl_icon_vc_023"></i>
              <p>切到语音</p>
            </span>
            <span>
              <i class="vl_icon vl_icon_vc_021"></i>
              <p>取消</p>
            </span>
            <span v-if="value.state === 3 || value.state === 4">
              <i class="vl_icon vl_icon_vc_022"></i>
              <p>静音</p>
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import {random14} from '../../../../utils/util.js';
export default {
  data () {
    return {
      map: null, // 地图对象
      ryList: [],  // 人员
      ryMapMarkers: [],

      // 通讯列表 {sid: {state, type, ...}}
      /* 
       * time: 连接开始时间或通话开始时间
       * timer: 定时器对象
       * changer: 触发更新数据的业务字段
       */
      comList: {
        // '001': { userName: '张三', type: 1, state: 1, time: new Date().getTime(), timer: null, changer: 0 },
      },

      // 选择区域
      mouseTool: null,
      selAreaAcitve: false,
      selAreaAble: false,
      selAreaPolygon: null,

      // 标注
      marksList: [],
      marksMarkers: [],
      markListener: null,
      markAcitve: false,
      markEditMarker: null,
      markEditWindow: null,

      // 测距
      rangingAcitve: false,
      rangingObj: null,

      isIndeterminate: true,
      mapTypeCheckAll: false,
      mapTypeList: ['ry'],
      // mapTypeListAll: ['sxt', 'kk', 'cl', 'ry'],

      tabType: 1, // 1地图信息 2标注历史
      mapInfoVal: '', // 地图信息查询值
      mapTreeData: [
        {
          label: '溆浦县',
          children: [{
            label: '桥江镇',
            userList: [
              { id: '001', userName: '张三' },
              { id: '002', userName: '李四' }
            ]
          }, {
            label: '小江口乡',
          }, {
            label: '新田乡',
          }, {
            label: '观音阁镇',
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }
      ],
      mapTreeProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  filters: {
    /*
     * 根据起始时间得出时分秒
     * @param {string} format 格式，默认 HH:mm:ss
     * */
    fmDisTime: function(val, lTime, sFormat) {
      let _h = 0, _m = 0, _s = 0;
      if (lTime > 0) {
        let time = new Date().getTime() - lTime;
        let _ts = parseInt(time / 1000);
        _s = parseInt(_ts % 60); // 秒取余，得到秒数
        _m = parseInt(_ts / 60); // 秒取整，得到分钟数
        if (_m >= 60) {
          _h = parseInt(_m / 60); // 分取整，得到小时数
          _m = parseInt(_m % 60); // 分取余，得到分钟数
        }
        //  $('#cntList_' + sid).find('.cnt-an-ctime').html(_m + ' : ' + _s);
      }
      if (_h < 10) { _h = '0' + _h; }
      if (_m < 10) { _m = '0' + _m; }
      if (_s < 10) { _s = '0' + _s; }
      if (sFormat.indexOf('HH') >= 0) { sFormat = sFormat.replace('HH', _h + ''); }
      if (sFormat.indexOf('mm') >= 0) { sFormat = sFormat.replace('mm', _m + ''); }
      if (sFormat.indexOf('ss') >= 0) { sFormat = sFormat.replace('ss', _s + ''); }
      return sFormat;
    }
  },
  mounted () {
    let _this = this;
    let map = new window.AMap.Map('mapMap', {
      zoom: 18, // 级别
      center: [112.974691, 28.093846], // 中心点坐标
      // viewMode: '3D' // 使用3D视图
    });
    map.setMapStyle('amap://styles/whitesmoke');
    this.map = map;
    // 在地图中添加MouseTool插件
    let mouseTool = new window.AMap.MouseTool(map);
    _this.mouseTool = mouseTool;
    // 添加事件
    window.AMap.event.addListener(mouseTool, 'draw', function (e) {
      // _this.drawPaths = e.obj.getPath();
      console.log('drawPaths e', e); // 获取路径/范围
      console.log('drawPaths', e.obj.getPath()); // 获取路径/范围
      setTimeout(() => {
        // _this.editForm.areaData = null;
        // _this.dialogVisible = true;
        // _this.amap.setDefaultCursor(_this.defaultCursor);
        _this.selAreaRest(true);
        let polygon = new window.AMap.Polygon({
          map: map,
          strokeColor: '#FA453A',
          strokeOpacity: 1,
          strokeWeight: 1,
          fillColor: '#FA453A',
          fillOpacity: 0.2,
          path: e.obj.getPath(),
          zIndex: 12
        });
        _this.selAreaPolygon = polygon;
        _this.selAreaAble = true;
        _this.mapMarkHandler();
      }, 100);
    });

    _this.getMapData();
    // 地图标记事件
    _this.mapMarkerEvents();

    // 参数处理
    let _userId = _this.$route.params.userId;
    let _type = _this.$route.params.type;
    console.log('userId:', _userId);
    console.log('type:', _type);
    if (_userId) {
      if (!_type || isNaN(_type)) { _type = 2; }
      _this.comInit({userId: _userId, userName: '张三'}, Number(_type)); // 通讯
    }
  },
  methods: {
    testChangeState (sid, state) {
      if (state < 6) {
        state += 1;
      } else {
        state = 0;
      }
      let obj = this.comList[sid];
      obj.state = state;
      if (obj.timer) { clearInterval(obj.timer); }
      console.log('state', state);
      if (state === 2 || state === 3) {
        obj.time = new Date().getTime();
        obj.timer = setInterval(() => {
          // console.log('setInterval: ' + sid + ', state:' + state);
          obj.changer = obj.changer + 1;
        }, 1000);
      }
    },
    // 获取地图数据
    getMapData () {
      setTimeout(() => {
        this.ryList = [
          { userId: '001', userName: '张三', addr: '长沙市天心区', latitude: 28.09466, longitude: 112.974315 },
          { userId: '002', userName: '张三1', addr: '长沙市天心区', latitude: 28.09366, longitude: 112.974315 },
          { userId: '003', userName: '张三2', addr: '长沙市天心区', latitude: 28.09566, longitude: 112.974315 },
          { userId: '004', userName: '张三3', addr: '长沙市天心区', latitude: 28.09466, longitude: 112.973315 },
          { userId: '005', userName: '张三4', addr: '长沙市天心区', latitude: 28.09466, longitude: 112.975315 }
        ];
        this.mapMarkHandler();
      }, 200);
    },
    // 地图标记处理
    mapMarkHandler () {
      // 人员
      this.mapClearMarkers(this.ryMapMarkers);
      this.mapMark(this.ryList, this.ryMapMarkers, 'ry');
    },
    // 地图标记
    mapMark (data, aMarkers, keyWord) {
      if (data && data.length > 0) {
        let hoverWindow = null;
        let _this = this;
        for (let i = 0; i < data.length; i++) {
          let obj = data[i];
          obj.sid = keyWord + '_' + i + '_' + random14();
          if (obj.longitude > 0 && obj.latitude > 0) {
            let offSet = [-20.5, -48], selClass = '';
            if (_this.selAreaPolygon && !_this.selAreaPolygon.contains(new window.AMap.LngLat(obj.longitude, obj.latitude))) {
              // 多边形存在且不在多边形之中
              selClass = "vl_map_selarea_hide";
            }
            let marker = new window.AMap.Marker({ // 添加自定义点标记
              map: _this.map,
              // 110.601394, 27.909162
              position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
              // position: [110.601394, 27.909162], // 基点位置 [116.397428, 39.90923]
              offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: obj,
              // 自定义点标记覆盖物内容
              content: '<div id="' + obj.sid + '" class="vl_icon vl_icon_' + keyWord + ' ' + selClass + '"></div>'
            });
            // myAMap.hoverMarkerHandler(map, marker, obj);
            if (!aMarkers) { aMarkers = []; }
            aMarkers.push(marker);

            // hover
            marker.on('mouseover', function () {
              // let iW = Math.round($(window).width() * 0.15);
              // console.log('mEvent', mEvent);
              // let extD = mEvent.target.C.extData;
              let sContent = '<div class="vl_map_hover">' +
                '<div class="vl_map_hover_main" _userId="' + obj.userId + '" _userName="' + obj.userName + '">' + _this.mapHoverInfo(obj, keyWord) + '</div>';
              hoverWindow = new window.AMap.InfoWindow({
                isCustom: true,
                closeWhenClickMap: true,
                offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
                content: sContent
              });
              // aCenter = mEvent.target.F.position
              hoverWindow.open(_this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
              hoverWindow.on('close', function () {
                // console.log('infoWindow close')
              });
            });
            marker.on('mouseout', function () {
              // if (hoverWindow) { hoverWindow.close(); }
            });
          }
        }
      }
    },
    mapHoverInfo (data, type) {
      let str = '<ul>';
      if (type === 'ry') {
        str += '<li><span>姓名：</span>' + data.userName + '</li>';
        str += '<li><span>电话：</span>' + '15899999999' + '</li>';
        str += '<li><span>单位：</span>' + '县交通局' + '</li>';
        str += '<li><span>职称：</span>' + '科员' + '</li>';
        str += '<li><span>未完成：</span>' + '3件' + '</li>';
        str += '<li style="text-align: center;" id="comState_markerHover_' + data.userId + '">';
        // 视频通话状态
        let _type = 2, _state = 0;
        if (this.comList[data.userId]) {
          let _o = this.comList[data.userId];
          _type = _o.type;
          _state = _o.state;
        }
        str += this.comStateHtmlMarkerHover(_type, _state);
        str += '</li>';
      } else {
        str += '<li>未知数据</li>';
      }
      str += '</ul>';
      return str;
    },
    // 地图标记事件
    mapMarkerEvents () {
      let _this = this;
      // 1语音/2视频通话
      $('body').on('click', '.hover_btn_voice', function () {
        _this.comInit({
          userId: $(this).closest('.vl_map_hover_main').attr('_userId'),
          userName: $(this).closest('.vl_map_hover_main').attr('_userName')
        }, 1);
      }).on('click', '.hover_btn_video', function () {
        _this.comInit({
          userId: $(this).closest('.vl_map_hover_main').attr('_userId'),
          userName: $(this).closest('.vl_map_hover_main').attr('_userName')
        }, 2);
      });
    },
    // 清除地图标记
    mapClearMarkers (aMarkers) {
      if (this.map && aMarkers && aMarkers.length > 0) {
        this.map.remove(aMarkers);
        aMarkers = [];
      }
    },

    /********** 1语音/2视频通讯 **********/
    /**
     * 通讯
     * @param {object} obj 标识
     *  userId / 
     * @param {int} type 1语音/2视频
     */
    comInit (obj, type) {
      // 创建通话窗口
      let nObj = {};
      nObj[obj.userId] = { 
        userName: obj.userName,
        type: type,
        state: 1,
        time: new Date().getTime(),
        timer: null,
        changer: 0
      }
      this.comList = Object.assign({}, this.comList, nObj);
      this.$nextTick(() => {
        this.comStateHandler(obj.userId, type, 1); // 创建连接的信息提示
      });
    },
    /**
     * 通讯状态信息提示
     * @param {string} sid 标识
     * @param {int} type 1语音/2视频
     * @param {int} state 连接状态
        0: 无连接（未发起通讯）
        1: new 创建连接
        2: connecting 连接中
        3: connected 已连接
        4: disconnected 断开连接
        5: failed 连接失败
        6: closed 已关闭
     */
    comStateHandler (sid, type, state) {
      let $mh = $('#comState_markerHover_' + sid);
      $mh.html(this.comStateHtmlMarkerHover(type, state));
    },
    /**
     * 地图标记浮层状态信息
     * @param {string} sid 标识
     * @param {int} type 1语音/2视频
     * @param {int} state 连接状态
     */
    comStateHtmlMarkerHover (type, state) {
      let sType = '视频';
      if (type === 1) { sType = '语音'; }
      let smh = ''; 
      if (state === 0) {
        smh = '<i class="vl_map_hover_btn hover_btn_voice">发送语音</i>' +
          '<i class="vl_map hover_btn hover_btn_video">发送视频</i>';
      } else if (state === 1) {
        smh = '<p class="map_hover_comState">正在进行' + sType + '连接...</p>';
      } else if (state === 2) {
        smh = '<p class="map_hover_comState">' + sType + '连接中...</p>';
      } else if (state === 3) {
        smh = '<p class="map_hover_comState">' + sType + '通话中</p>';
      } else if (state === 4) {
        smh = '<p class="map_hover_comState">' + sType + '断开连接</p>';
      } else if (state === 5) {
        smh = '<p class="map_hover_comState">' + sType + '连接失败</p>';
      } else if (state === 6) {
        smh = '<p class="map_hover_comState">' + sType + '已关闭</p>';
      }
      return smh;
    },
    /**
     * 通话窗口状态信息
     * @param {string} sid 标识
     * @param {int} type 1语音/2视频
     * @param {int} state 连接状态
     */
    comStateHtmlComDialog (sid, type, state) {
      let sType = '视频';
      if (type === 1) { sType = '语音'; }
      let smh = '';
      if (state === 0) {
        smh = '<span style="">未连接</span>';
      } else if (state === 1) {
        smh = '<span style="">正在连接...</span>';
      } else if (state === 2) {
        smh = '<span style="">等待对方接听...</span>';
      } else if (state === 3) {
        smh = '<span style="">' + sType + '通话中</span>';
      } else if (state === 4) {
        smh = '<span style="">' + sType + '断开连接</span>';
      } else if (state === 5) {
        smh = '<span style="">' + sType + '连接失败</span>';
      } else if (state === 6) {
        smh = '<span style="">' + sType + '已关闭</span>';
      }
      return smh;
    },

    // 清除所有
    resetTools () {
      this.selAreaRest();
      this.markRest();
      this.rangingRest();
    },

    // 选择区域
    selArea () {
      if (this.selAreaAcitve) {
        this.resetTools();
        return false;
      }
      this.resetTools();
      if (this.map && this.mouseTool) {
        this.selAreaAcitve = true;
        this.mouseTool.close(true);
        this.map.setDefaultCursor('crosshair');
        this.mouseTool.polygon({
          zIndex: 13,
          strokeColor: '#FA453A',
          strokeOpacity: 1,
          strokeWeight: 1,
          fillColor: '#FA453A',
          fillOpacity: 0.2
        });
      }
    },
    // 重置选择区域
    selAreaRest (notClearPolygon) {
      this.selAreaAcitve = false;
      this.mouseTool.close(true);
      this.map.setDefaultCursor('');
      if (!notClearPolygon && this.selAreaPolygon) {
        this.map.remove(this.selAreaPolygon);
        this.selAreaPolygon = null;
        this.selAreaAble = false;
      }
    },

    // 标注
    mark () {
      if (this.markAcitve) {
        this.resetTools();
        return false;
      }
      this.resetTools();
      this.markAcitve = true;
      this.map.setDefaultCursor('crosshair');
      let _this = this;
      this.markListener = window.AMap.event.addListener(this.map, 'click', function (e) {
        if (_this.markEditMarker) {
          // 表示存在编辑中的标记，则需先完成编辑中的标记
          return false;
        }
        // console.log('mark event', e);
        let marker = new window.AMap.Marker({ // 添加自定义点标记
          map: _this.map,
          position: e.lnglat,
          offset: new window.AMap.Pixel(-15, -16), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: '<div class="vl_icon vl_icon_051"></div>'
        });
        _this.markEditMarker = marker;
        let sid = 'mk_' + random14();
        let infoWindow = new window.AMap.Marker({
          map: _this.map,
          position: e.lnglat,
          zIndex: 111,
          offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
          content: '<div class="vl_map_mk" id="' + sid + '"><div class="vl_map_mk_main">' +
            '<textarea placeholder="标注内容" rows="4"></textarea>' +
            '<div>' +
              '<p></p>' +
              '<input type="button" value="取消" class="vl_map_mk_btn vl_map_mk_btn1"></input>&nbsp;&nbsp;&nbsp;&nbsp;' +
              '<input type="button" value="确认" class="vl_map_mk_btn vl_map_mk_btn2"></input></div>' +
            '</div></div>'
        });
        // aCenter = mEvent.target.F.position
        // infoWindow.open(_this.map, e.lnglat);
        _this.markEditWindow = infoWindow;
        setTimeout(() => {
          let $iw = $('#' + sid);
          let $btn1 = $iw.find('.vl_map_mk_btn1'), $btn2 = $iw.find('.vl_map_mk_btn2'), $msg = $iw.find('p');
          $btn1.on('click', function () {
            _this.markRest(true);
          });
          $btn2.on('click', function () {
            let sval = $iw.find('textarea').val();
            if (!sval || sval.length <= 0) {
              $msg.text('请输入标注内容').show();
            } else {
              $msg.hide();
              $btn1.attr('disabled', true);
              $btn2.val('提交中...');
              $btn2.attr('disabled', true);
              setTimeout(() => {
                _this.$message({
                  message: '标注添加成功',
                  type: 'success'
                });
                _this.markRest(true);
                console.log('e', e);
                _this.markMark({
                  author: '管理员',
                  time: new Date().getTime(),
                  content: sval,
                  latitude: e.lnglat.lat,
                  longitude: e.lnglat.lng
                });
              }, 2000);
            }
          });
        }, 400);
      });
    },
    markMark (data) {
      let _this = this;
      let marker = new window.AMap.Marker({ // 添加自定义点标记
        map: _this.map,
        position: new window.AMap.LngLat(data.longitude, data.latitude),
        offset: new window.AMap.Pixel(-15, -16), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // 自定义点标记覆盖物内容
        content: '<div class="vl_icon vl_icon_051"></div>'
      });
      console.log(marker);
    },
    markRest (isEditing) {
      // flag 控制是否在编辑中
      if (!isEditing) {
        this.markAcitve = false;
        this.map.setDefaultCursor('');
        if (this.markListener) {
          window.AMap.event.removeListener(this.markListener); // 移除事件，以绑定时返回的对象作为参数
        }
      }
      if (this.markEditMarker) {
        this.map.remove([this.markEditMarker]);
        this.markEditMarker = null;
      }
      if (this.markEditWindow) {
        this.map.remove([this.markEditWindow]);
        this.markEditWindow = null;
      }
    },

    // 测距
    ranging () {
      if (this.rangingAcitve) {
        this.rangingRest();
        return false;
      }
      this.resetTools();
      this.rangingAcitve = true;
      // 自定义样式
      let startMarkerOptions= {
        content: '<div class="vl_map_ranging vl_map_ranging_s"><div></div></div>',
        offset: new window.AMap.Pixel(-12, -12)
      };
      let endMarkerOptions = {
        content: '<div class="vl_map_ranging vl_map_ranging_e"><div>终</div></div>',
        offset: new window.AMap.Pixel(-17, -17)
      };
      let midMarkerOptions = {
        content: '<div class="vl_map_ranging vl_map_ranging_m"><div></div></div>',
        offset: new window.AMap.Pixel(-12, -12)
      };
      let lineOptions = {
          strokeStyle: "solid",
          strokeColor: "#61C772",
          strokeOpacity: 1,
          strokeWeight: 8
      };
      let rulerOptions = {
        startMarkerOptions: startMarkerOptions,
        midMarkerOptions:midMarkerOptions,
        endMarkerOptions: endMarkerOptions,
        lineOptions: lineOptions
      };
      let ruler2 = new window.AMap.RangingTool(this.map, rulerOptions);
      ruler2.turnOn();
      this.rangingObj = ruler2;
    },
    rangingRest () {
      this.rangingAcitve = false;
      if (this.rangingObj) {
        this.rangingObj.turnOff();
      }
    },

    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    mapTypeCheckAllChange (val) {
      this.isIndeterminate = false;
      if (val) {
        this.mapTypeList = this.mapTypeListAll;
      } else {
        this.mapTypeList = [];
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.com_list {
  position: absolute; left: 300px; bottom: 20px; z-index: 2;
  > li {
    width: 274px; height: 400px;
    padding: 0 10px;
    float: left;
    > div { 
      position: relative;
      width: 100%; height: 100%;
      background-color: #333;
      color: #fff;
      > .com_li_user {
        opacity: 0.8;
        position: absolute; top: 20px; left: 20px;
        transition: opacity .4s ease-out;
        > div {
          > h3 { font-size: 20px; }
          > p { font-size: 12px; }
        }
      }
      > .com_li_full {
        opacity: 0;
        position: absolute; top: 20px; right: 10px;
        cursor: pointer;
        transition: opacity .4s ease-out;
      }
      > .com_li_time {
        opacity: 0.8;
        position: absolute; bottom: 100px; left: 0;
        width: 100%; height: 30px;
        text-align: center;
        transition: opacity .4s ease-out;
      }
      > .com_li_opt {
        opacity: 0.8;
        position: absolute; bottom: 10px; left: 0;
        width: 100%; height: 80px;
        padding: 0 10px;
        text-align: center;
        transition: opacity .4s ease-out;
        > span {
          display: inline-block;
          width: 33.33%; height: 100%;
          text-align: center;
          > span {
            cursor: pointer;
          }
          > p {
            height: 30px; line-height: 30px;
          }
        }
      }
      &:hover {
        > .com_li_user { opacity: 1; }
        > .com_li_time { opacity: 1; }
        > .com_li_full { opacity: 0.8; }
        > .com_li_opt { opacity: 1; }
      }
    }
  }
}
</style>
