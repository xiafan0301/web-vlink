<template>
  <div class="con_dev_up">
    <div class="up_tab">
      <div @click="tabIndex = 1" :class="{'active': tabIndex === 1}">地图选择</div>
      <div @click="tabIndex = 2" :class="{'active': tabIndex === 2}">列表选择</div>
    </div>
    <div class="up_map" v-show="tabIndex === 1">
      <div class="sel_dev">
        <div class="title">
          <span>已选设备（{{selDevMapNum}}）</span>
          <i class="el-icon-arrow-up" v-show="isShowTree" @click="isShowTree = false"></i>
          <i class="el-icon-arrow-down" v-show="!isShowTree" @click="isShowTree = true"></i>
        </div>
        <div v-show="isShowTree">
          <div class="sel_tab">
            <div @click="tabLeftClick(1)" :class="{'active': bayOrdev === 1}">摄像头</div>
            <div @click="tabLeftClick(2)" :class="{'active': bayOrdev === 2}">卡口</div>
          </div>
        <!-- 内容区 -->
        <vue-scroll style="height: 350px;" v-if="tabIndex === 1">
          <div class="transfer_main not_checked">
            <el-tree
              slot="to"
              ref="to-tree"
              icon-class="el-icon-arrow-right"
              show-checkbox
              :data="bayOrdev === 1 ? self_to_data1 : self_to_data2"
              :node-key="node_key"
              :default-expanded-keys="to_expanded_keys"
              :props="defaultProps"
              :default-expand-all="true"
            >
            <span class="custom_tree_node" slot-scope="{ node, data }">
              <span :title="node.label">{{ node.label | strCutWithLen(20)}}</span>
              <i class="el-icon-delete" @click="removeSelDev(node, data)"></i>
            </span>
            </el-tree>
          </div>
        </vue-scroll>
        </div>
      </div>
      <el-input placeholder="请输入设备名称" v-model="devName" class="search">
        <el-button slot="append" icon="el-icon-search" @click="searchDev"></el-button>
      </el-input>
      <div class="sel_type">
        <div @click="selArea(1)" :class="{'active': selAreaAcitve && selType === 1}"><i class="el-icon-setting"></i><span>框选</span></div>
        <div @click="selPoint(4)" :class="{'active': selAreaAcitve && selType === 4}"><i class="el-icon-setting"></i><span>点选</span></div>
        <div @click="selArea(2)" :class="{'active': selAreaAcitve && selType === 2}"><i class="el-icon-setting"></i><span>圈选</span></div>
        <div @click="selArea(3)" :class="{'active': selAreaAcitve && selType === 3}"><i class="el-icon-setting"></i><span>自定义</span></div>
        <div @click="clearPolygon"><i class="el-icon-setting"></i><span>清除</span></div>
      </div>
      <div class="sel_checkbox">
        <el-checkbox @change="changeShowType" v-model="isCheckedDev">摄像头 <span class="num">100</span></el-checkbox>
        <el-checkbox @change="changeShowType" v-model="isCheckedBay">卡口 <span class="num">100</span></el-checkbox>
      </div>
      <div id="devMap" class="dev_map"></div>
      <div class="map_zoom">
        <div class="top"><i class="el-icon-aim" @click="resetZoom()"></i></div>
        <ul class="bottom">
          <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
          <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
        </ul>
      </div>
    </div>
    <div class="up_list" v-show="tabIndex === 2">
      <!-- 右侧穿梭框 目标框 -->
      <div class="transfer_left">
        <div>已选设备（{{selDevListLeftNum}}）</div>
        <h3 class="transfer_title">
          <el-checkbox
            :indeterminate="to_is_indeterminate"
            v-model="to_check_all"
            @change="toAllBoxChange"
          ></el-checkbox>
          <span>全选</span>
        </h3>
        <div class="sel_tab">
          <div @click="tabLeftClick(1)" :class="{'active': bayOrdev === 1}">摄像头</div>
          <div @click="tabLeftClick(2)" :class="{'active': bayOrdev === 2}">卡口</div>
        </div>
        <!-- 内容区 -->
        <vue-scroll style="height: 380px;" v-if="tabIndex === 2">
          <div class="transfer_main">
            <el-tree
              slot="to"
              ref="to-tree"
              icon-class="el-icon-arrow-right"
              :data="bayOrdev === 1 ? self_to_data1 : self_to_data2"
              show-checkbox
              :node-key="node_key"
              @check="toTreeChecked"
              :default-expanded-keys="to_expanded_keys"
              :props="defaultProps"
              :filter-node-method="filterNodeTo"
              :default-expand-all="true"
            >
            </el-tree>
          </div>
        </vue-scroll>
      </div>
      <!-- 穿梭区 按钮框 -->
      <div class="transfer_center">
        <p class="transfer_center_item">
          <el-button
            type="primary"
            @click="addToAims"
            :disabled="from_disabled"
            icon="el-icon-arrow-left"
            >添加</el-button
          >
        </p>
        <p class="transfer_center_item">
          <el-button
            type="primary"
            @click="removeToSource"
            :disabled="to_disabled"
          >
            移出<i class="el-icon-arrow-right"></i>
          </el-button>
        </p>
      </div>
      <!-- 右侧穿梭框 原始框 -->
      <div class="transfer_right">
        <div>已选设备（{{selDevListRightNum}}）</div>
        <el-input
          placeholder="请输入设备名称"
          v-model="filterFrom"
          suffix-icon="el-icon-search"
          size="small"
          class="filter_tree"
        ></el-input>
        <h3 class="transfer_title">
          <el-checkbox
            :indeterminate="from_is_indeterminate"
            v-model="from_check_all"
            @change="fromAllBoxChange"
          ></el-checkbox>
          <span>全选</span>
        </h3>
        <div class="sel_tab">
          <div @click="tabRightClick(1)" :class="{'active': bayOrdev === 1}">摄像头</div>
          <div @click="tabRightClick(2)" :class="{'active': bayOrdev === 2}">卡口</div>
        </div>
        <!-- 内容区 -->
        <vue-scroll style="height: 333px;">
          <div class="transfer_main">
            <el-tree
              ref="from-tree"
              :data="self_from_data"
              icon-class="el-icon-arrow-right"
              show-checkbox
              :node-key="node_key"
              @check="fromTreeChecked"
              :default-expanded-keys="from_expanded_keys"
              :props="defaultProps"
              :filter-node-method="filterNodeFrom"
              :default-expand-all="true"
            >
            </el-tree>
          </div>
        </vue-scroll>
      </div>
    </div>
  </div>
</template>
<script>
import {MapGETmonitorList} from '@/views/index/api/api.map.js';
import {mapXupuxian} from '@/config/config.js';
import {random14, objDeepCopy} from '@/utils/util.js';
import { setTimeout } from 'timers';
export default {
  props: [
    'devFromDataUp',
    'bayFromDataUp',
    'self_to_data1Up',
    'self_to_data2Up',
    'addressObj',
    'modelType'
  ],
  data () {
    return {
      tabIndex: 1,//设备选择tab
      devName: null,
      bayOrdev: 1,
      isShowTree: false,
      isCheckedDev: true,//选中摄像头
      isCheckedBay: true,//选中卡口
      zoomLevel: 15,
      autoComplete: null,
      map: null,
      devList: [],
      markerList: [],
      mouseTool: null,
      polygon: null,
      selAreaAcitve: false,
      selType: null,
      devIdList: [],
      bayIdList: [],
      selDevListLeftNum: 0,
      selDevListRightNum: 0,
      bayFromData: [],
      devFromData: [],
      self_to_data1: [],
      self_to_data2: [],
      bayFromData_: [],
      devFromData_: [],

      from_is_indeterminate: false, // 源数据是否半选
      from_check_all: false, // 源数据是否全选
      to_is_indeterminate: false, // 目标数据是否半选
      to_check_all: false, // 目标数据是否全选
      from_expanded_keys: [], // 源数据展开节点
      to_expanded_keys: [], // 目标数据展开节点
      from_disabled: true, // 添加按钮是否禁用
      to_disabled: true, // 移除按钮是否禁用
      from_check_keys: [], // 源数据选中key数组 以此属性关联穿梭按钮，总全选、半选状态
      to_check_keys: [], // 目标数据选中key数组 以此属性关联穿梭按钮，总全选、半选状态
      filterFrom: "", // 源数据筛选
      from_data: [],
      to_data: [],
      defaultProps: { label: 'areaName', children: 'areaTreeList' },
      node_key: 'areaId',
      pid: "areaParentUid",
     
    }
  },
  created () {
    this.bayFromData = this.bayFromDataUp;
    this.devFromData = this.devFromDataUp;
    this.self_to_data1 = this.self_to_data1Up || [];
    this.self_to_data2 = this.self_to_data2Up || [];
  },
  mounted () {
    this.resetMap();
    this.getDevList();
  },
  methods: {
    // 初始化地图
    resetMap () {
      let _this = this;
      let map = new window.AMap.Map('devMap', { 
        zoom: this.zoomLevel,
        center: mapXupuxian.center
      });
      map.setMapStyle('amap://styles/whitesmoke');
      map.plugin('AMap.Autocomplete', () => {
        let autoOptions = {
          city: '溆浦县'
        }
        _this.autoComplete = new window.AMap.Autocomplete(autoOptions);
      })
      _this.map = map;
      // 在地图中添加MouseTool插件
      let mouseTool = new window.AMap.MouseTool(_this.map);
      _this.mouseTool = mouseTool;
      // 添加事件
      _this.mouseTool.on('draw', function (e) {
        if (_this.mouseTool) {
          _this.selAreaRest();
        }
        if(_this.polygon) _this.map.remove(_this.polygon);
        _this.polygon = new window.AMap.Polygon({
          map: _this.map,
          strokeColor: '#FA453A',
          strokeOpacity: 1,
          strokeWeight: 1,
          fillColor: '#FA453A',
          fillOpacity: 0.2, 
          path: e.obj.getPath(),
          zIndex: 12
        });
        // 获取覆盖物内的设备和卡口
        _this.getPolygonDev(_this.polygon);
      })
    },
    // 获取地图上的设备和卡口数据
    getDevList () {
      let params = {
        areaUid: '431224'
      }
      MapGETmonitorList(params).then(res => {
        if (res) {
          this.bayFromData_ = this.commonFn1(objDeepCopy([res.data]));
          this.devFromData_ = this.commonFn2(objDeepCopy([res.data]));
          if (this.modelType === 4 || this.modelType === 6) {
            this.bayFromData = objDeepCopy(this.bayFromData_);
            this.devFromData = objDeepCopy(this.devFromData_);
          }
          this.devList = this.flatDev([res.data]);
          this.mapMark(this.devList);
          this.addressObj && this.addressMark();
        }
      });
    },
    // 点标记失踪人员位置
    addressMark () {
      const obj = this.addressObj.find(f => f.type === 1);
      if (obj) {
        let offSet = [-20.5, -70], _this = this;
        const lng = obj.lngLat[0], lat = obj.lngLat[1];
        if (lng > 0 && lat > 0) {
          let marker = new window.AMap.Marker({ // 添加自定义点标记
            position: [lng, lat],
            offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: '',
            // 自定义点标记覆盖物内容
            content: `<div id="${random14()}" class="vl_icon vl_icon_zzd"></div>`
          });
          // mouseover
          marker.on('mouseover', function () {
            let _hoverWindow = null;
            let _sContent = `<div class="vl_map_hover">
              <div class="vl_map_hover_main"><ul>
                <li><span>失踪地址：</span><span>${obj.address}</span></li>
              </ul></div>`;
            _hoverWindow = new window.AMap.InfoWindow({
              isCustom: true,
              closeWhenClickMap: true,
              offset: new window.AMap.Pixel(0, -20), // 相对于基点的偏移位置
              content: _sContent
            });
            _hoverWindow.open(_this.map, new window.AMap.LngLat(lng, lat));
          });
          marker.setMap(_this.map);
        }
      }
    },
    // 扁平设备和卡口数据
    flatDev (arr) {
      let res = [];
      let fn = (array) => {
        array.forEach(f => {
          f.deviceBasicList.forEach(b => {b.type = 1;b.isShow = true});
          f.bayonetList.forEach(b => {b.type = 2;b.isShow = true});
          res.push(...f.bayonetList, ...f.deviceBasicList);
          if (f.areaTreeList.length > 0) {
            fn(f.areaTreeList);
          }
        })
      }
      fn(arr);
      return res;
    },
    // 扁平已选设备的树数据，用来获取已选设备的数量
    flatDev_ (arr) {
      let res = [];
      let fn = (array) => {
        array.forEach(f => {
          if (!f.hasOwnProperty('areaTreeList')) {
            res.push(f);
          } else if (f.areaTreeList.length > 0) {
            fn(f.areaTreeList);
          }
        })
      }
      fn(arr);
      return res;
    },
    // 地图设备和卡口标记 data:摄像头数据/卡口数据
    mapMark (data) {
      let _this = this, _hoverWindow = null;
      // 遍历列表，摄像头 或者卡口
      for (let i = 0; i < data.length; i++) {
        let offSet = [-20.5, -70];
        let obj = data[i];
        if (obj.longitude > 0 && obj.latitude > 0) {
          let _content = null;
          // 摄像头
          if (obj.type === 1) {
            _content = '<div id="' + obj.uid + '_sxt' + '" class="vl_icon vl_icon_sxt vl_icon_click"></div>';
          // 卡口
          } else {
            _content = '<div id="' + obj.uid + '_kk' + '" class="vl_icon vl_icon_kk vl_icon_click"></div>';
          }
          let _marker = new window.AMap.Marker({ // 添加自定义点标记
            position: [obj.longitude, obj.latitude],
            offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: _content
          });
          // mouseover
          _marker.on('mouseover', function () {
            let _sContent = `<div class="vl_map_hover">
              <div class="vl_map_hover_main"><ul>`;
              if (obj.type === 1) {
                _sContent += `<li><span>设备名称：</span><span>${obj.deviceName}</span></li>
                <li><span>设备地址：</span><span>${obj.address}</span></li>`;
              } else {
                _sContent += `<li><span>卡口名称：</span><span>${obj.bayonetName}</span></li>
                <li><span>卡口编号：</span><span>${obj.bayonetNo}</span></li>
                <li><span>地理位置：</span><span>${obj.bayonetAddress}</span></li>
                <li><span>设备数量：</span><span>${obj.devNum}</span></li>`;
              }
              _sContent += '</ul></div>';
            _hoverWindow = new window.AMap.InfoWindow({
              isCustom: true,
              closeWhenClickMap: true,
              offset: new window.AMap.Pixel(0, -20), // 相对于基点的偏移位置
              content: _sContent
            });
            _hoverWindow.open(_this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
          });
          // click
          // _marker.on('click', function () {
          
          // })
      
          _this.markerList.push(_marker);
        }
      }
      _this.map.add(_this.markerList);
      // _this.map.setFitView();
    },
    // 获取覆盖物内的设备和卡口
    getPolygonDev (polygon) {
      let res = [];
      this.markerList.forEach(f => {
        const obj = f.B.extData;
        // 把在圆形覆盖物范围之内的追踪点添加进来
        if (obj.longitude > 0 && obj.latitude > 0) {
          if (polygon && polygon.contains(new window.AMap.LngLat(obj.longitude, obj.latitude))) {
            // 在圆形之中
            obj.isShow && res.push(obj);
          }
        }
      })
      this.devIdList = res.reduce((pre, cur) => {
        console.log(cur,'cur')
        if (cur.type === 1) {
          pre = [...pre, cur.uid];
        }
        return pre;
      },[]);
      this.bayIdList = res.reduce((pre, cur) => {
        if (cur.type === 2) {
          pre = [...pre, cur.uid];
        }
        return pre;
      },[]);
      this.tabLeftClick(this.bayOrdev);
    },
    // 目标树tab
    tabLeftClick (type) {
      this.bayOrdev = type;
      this.to_check_all = false;// 清空全选的状态
      this.to_is_indeterminate = false;// 清空全选的状态
      this.getSelDevListLeftNum();// 重新获取已选设备数量
      this.to_check_keys = [];
      if (!this.polygon) return;//没有选择范围时，停止执行下去
      if (type === 2) {
        this.self_to_data2 = [];
        this.bayFromData = objDeepCopy(this.bayFromData_);
      } else {
        this.self_to_data1 = [];
        this.devFromData = objDeepCopy(this.devFromData_);
      }
      const data = type === 1 ? this.devIdList : this.bayIdList;
      this.$refs["from-tree"].setCheckedKeys(data);
      this.$nextTick(() => {
        this.addToAims();
      })
    },
    // 源树tab
    tabRightClick (type) {
      this.bayOrdev = type;
      this.from_check_all = false;// 清空全选的状态
      this.from_is_indeterminate = false;// 清空全选的状态
      this.getSelDevListRightNum();//重新获取已选设备数量
      this.from_check_keys = [];
    },
    // 重置选择区域
    selAreaRest () {
      this.selAreaAcitve = false;
      this.mouseTool.close(true);
      // this.mouseTool = null;
      this.map.setDefaultCursor('');
    },
    // 选择区域
    selArea (type) {
      if (this.map && this.mouseTool) {
        this.selType = type;
        this.selAreaAcitve = true;
        this.mouseTool.close(true);
        this.map.setDefaultCursor('crosshair');
        if (type === 1) {
          this.mouseTool.rectangle({
            zIndex: 13,
            strokeColor: '#FA453A',
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: '#FA453A',
            fillOpacity: 0.2
          });
        } else if (type === 2) {
          this.mouseTool.circle({
            zIndex: 13,
            strokeColor: '#FA453A',
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: '#FA453A',
            fillOpacity: 0.2
          });
        } else {
          this.mouseTool.polygon({
            zIndex: 13,
            strokeColor: '#FA453A',
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: '#FA453A',
            fillOpacity: 0.2
          });
        } 
       
      }
    },
    // 点选
    selPoint (type) {
      this.selAreaAcitve = !this.selAreaAcitve;
      if (this.selAreaAcitve) {
        this.selType = type;
        $('#devMap').on('click', '.vl_icon_click', (e) => {
          const objId = e.target.getAttribute('id');
          if (objId.endsWith('_sxt')) {
            this.bayOrdev = 1;
            this.$refs["from-tree"].setCheckedKeys([objId.replace('_sxt', '')]);
          } else if (objId.endsWith('_kk')) {
            this.bayOrdev = 2;
            this.$refs["from-tree"].setCheckedKeys([objId.replace('_kk', '')]);
          }
          this.$nextTick(() => {
            this.addToAims();
          })
        })
      } else {
        this.selType = null;
        $('#devMap').unbind('click');
      }
    },
    // 清除覆盖物和所选的设备和卡口
    clearPolygon () {
      if(this.polygon) this.map.remove(this.polygon);
      this.polygon = null;
      this.devIdList = [];
      this.bayIdList = [];
      this.self_to_data2 = [];
      this.bayFromData = objDeepCopy(this.bayFromData_);
      this.self_to_data1 = [];
      this.devFromData = objDeepCopy(this.devFromData_);
      this.selAreaAcitve = !this.selAreaAcitve;
      this.selType = null;
      $('#devMap').unbind('click');
    },
    // 根据设备名称搜索设备或卡口
    searchDev () {
      for (let item of this.markerList) {
        const obj = item.B.extData;
        const name = obj.type === 1 ? obj.deviceName : obj.bayonetName;
        if (name.includes(this.devName)) {
          console.log(item);
          let _hoverWindow = null;
          let _sContent = `<div class="vl_map_hover">
            <div class="vl_map_hover_main"><ul>`;
            if (obj.type === 1) {
              _sContent += `<li><span>设备名称：</span><span>${obj.deviceName}</span></li>
              <li><span>设备地址：</span><span>${obj.address}</span></li>`;
            } else {
              _sContent += `<li><span>卡口名称：</span><span>${obj.bayonetName}</span></li>
              <li><span>卡口地址：</span><span>${obj.bayonetAddress}</span></li>`;
            }
            _sContent += '</ul></div>';
          _hoverWindow = new window.AMap.InfoWindow({
            isCustom: true,
            closeWhenClickMap: true,
            offset: new window.AMap.Pixel(0, -20), // 相对于基点的偏移位置
            content: _sContent
          });
          _hoverWindow.open(this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
          return;
        }
      }
    },
    // 切换当前显示的设备和卡口
    changeShowType () {
      for (let obj of this.markerList) {
        const _obj = obj.B.extData;
        const type = _obj.type;
        if (type === 1) {
          if (this.isCheckedDev) {
            obj.show();
            _obj.isShow = true;
          } else {
            obj.hide();
            _obj.isShow = false;
          }
        }
        if (type === 2) {
          if (this.isCheckedBay) {
            obj.show();
            _obj.isShow = true;
          } else {
            obj.hide();
            _obj.isShow = false;
          }
        }
      }
    },
    // 删除左侧已选设备和卡口
    removeSelDev (node, data) {     
      // 把选取的所有节点的checked改为true
      // let fn = (node) => {
      //   for (let key in node) {
      //     if (node instanceof Array) {
      //       node[key]['checked'] = true;
      //       if (node[key] && node[key]['childNodes'].length > 0) fn(node[key]['childNodes']);
      //     } else {
      //       node['checked'] = true;
      //       if (node['childNodes'].length > 0) fn(node['childNodes']);
      //     }
      //   }
      // }
      // fn(node);
      this.$refs["to-tree"].setCheckedKeys([data.areaId]);
      this.$nextTick(() => {
        this.removeToSource()
      })
    },
    // 获取列表选择的右边已选设备数量
    getSelDevListRightNum() {
      this.$nextTick(() => {
        this.selDevListRightNum = 0;
        const data = this.$refs["from-tree"].getCheckedNodes().filter(f => !f.hasOwnProperty('areaTreeList'));
        this.selDevListRightNum = data.length;
      })
    },
    // 获取列表选择的左边已选设备数量
    getSelDevListLeftNum() {
      this.$nextTick(() => {
        this.selDevListLeftNum = 0;
        const data = this.$refs["to-tree"].getCheckedNodes().filter(f => !f.hasOwnProperty('areaTreeList'));
        this.selDevListLeftNum = data.length;
      })
    },
     // 添加按钮
    addToAims() {
      // 获取选中通过穿梭框的keys - 仅用于传送纯净的id数组到父组件同后台通信
      let keys = this.$refs["from-tree"].getCheckedKeys();
      // 获取半选通过穿梭框的keys - 仅用于传送纯净的id数组到父组件同后台通信
      let harfKeys = this.$refs["from-tree"].getHalfCheckedKeys();
      // 选中节点数据
      let arrayCheckedNodes = this.$refs["from-tree"].getCheckedNodes();
      // 获取选中通过穿梭框的nodes - 仅用于传送选中节点数组到父组件同后台通信需求
      let nodes = objDeepCopy(arrayCheckedNodes);
      console.log(nodes, 'nodes')
      // 半选中节点数据
      let arrayHalfCheckedNodes = this.$refs["from-tree"].getHalfCheckedNodes();
      // 获取半选通过穿梭框的nodes - 仅用于传送选中节点数组到父组件同后台通信需求
      let halfNodes = objDeepCopy(arrayHalfCheckedNodes);

      // 自定义参数读取设置
      let children__ = this.defaultProps.children || "children";
      let pid__ = this.pid || "pid";
      let id__ = this["node_key"] || "id";

      /*
       * 先整合目标树没有父节点的叶子节点选中，需要整理出来此叶子节点的父节点直到根节点路径 - 此时所有骨架节点已有
       * 再将所有末端叶子节点根据pid直接推入目标树即可
       * 声明新盒子将所有半选节点的子节点清除 - 只保留骨架 因为排序是先父后子 因此不存在子元素处理好插入时父元素还没处理的情况
       * 下面一二步是为了搭建出来目标树没有根节点躯干节点时的叶子选中，给此叶子搭建出根节点和躯干节点
       */

      // let不存在状态提升 因此在函数调用之前赋值 并递归为以为数组！
      let self_to_data = JSON.stringify(this.bayOrdev === 1 ? this.self_to_data1 : this.self_to_data2);
      // 第一步
      let skeletonHalfCheckedNodes = objDeepCopy(arrayHalfCheckedNodes);// 深拷贝数据 - 半选节点
      // 筛选目标树不存在的骨架节点 - 半选内的节点
      let newSkeletonHalfCheckedNodes = [];
      skeletonHalfCheckedNodes.forEach(item => {
        console.log(item, 'item')
        if (!inquireIsExist(item)) {
          newSkeletonHalfCheckedNodes.push(item);
        }
      });
      // 筛选到目标树不存在的骨架后在处理每个骨架节点-非末端叶子节点 - 半选节点
      newSkeletonHalfCheckedNodes.forEach(item => {
        item[children__] = [];
        [0, "0"].includes(item[pid__])
          ? this.$refs["to-tree"].append(item)
          : this.$refs["to-tree"].append(item, item[pid__]);
      });

      // 第二步
      // 筛选目标树不存在的骨架节点 - 全选内的节点
      let newSkeletonCheckedNodes = [];
      nodes.forEach(item => {
        if (!inquireIsExist(item)) {
          newSkeletonCheckedNodes.push(item);
        }
      });
      // 筛选到目标树不存在的骨架后在处理每个骨架节点-非末端叶子节点 - 全选节点
      newSkeletonCheckedNodes.forEach(item => {
        if (item[children__] && item[children__].length > 0) {
          item[children__] = [];
          [0, "0"].includes(item[pid__])
            ? this.$refs["to-tree"].append(item)
            : this.$refs["to-tree"].append(item, item[pid__]);
        }
      });

      // 第三步 处理末端叶子元素 - 声明新盒子筛选出所有末端叶子节点
      let leafCheckedNodes = arrayCheckedNodes.filter(
        item => !item[children__] || item[children__].length == 0
      );
      // 末端叶子插入目标树
      leafCheckedNodes.forEach(item => {
        if (!inquireIsExist(item)) {
          this.$refs["to-tree"].append(item, item[pid__]);
        }
      });

      // 递归查询data内是否存在item函数
      function inquireIsExist(item, strData = self_to_data) {
        // 将树形数据格式化成一维字符串 然后通过匹配来判断是否已存在
        let strItem =
          typeof item[id__] == "number"
            ? `"${id__}":${item[id__]},`
            : `"${id__}":"${item[id__]}"`;
        let reg = RegExp(strItem);
        let existed = reg.test(strData);
        return existed;
      }

      // 左侧删掉选中数据
      arrayCheckedNodes.map(item => this.$refs["from-tree"].remove(item));

      // 处理完毕按钮恢复禁用状态
      this.from_check_keys = [];

      // 目标数据节点展开
      if (this.transferOpenNode) {
        this.to_expanded_keys = keys;
      }

      // 传递信息给父组件
      // this.$emit("addBtn", this.self_from_data, this.self_to_data, {
      //   keys,
      //   nodes,
      //   harfKeys,
      //   halfNodes
      // });

      // 处理完毕取消选中
      this.$refs["from-tree"].setCheckedKeys([]);
    },
    // 移除按钮
    removeToSource() {
      // 获取选中通过穿梭框的keys - 仅用于传送纯净的id数组到父组件同后台通信
      let keys = this.$refs["to-tree"].getCheckedKeys();
      // 获取半选通过穿梭框的keys - 仅用于传送纯净的id数组到父组件同后台通信
      let harfKeys = this.$refs["to-tree"].getHalfCheckedKeys();
      // 获取选中通过穿梭框的nodes 选中节点数据
      let arrayCheckedNodes = this.$refs["to-tree"].getCheckedNodes();
      // 获取选中通过穿梭框的nodes - 仅用于传送选中节点数组到父组件同后台通信需求
      let nodes = objDeepCopy(arrayCheckedNodes);
      // 半选中节点数据
      let arrayHalfCheckedNodes = this.$refs["to-tree"].getHalfCheckedNodes();
      // 获取半选通过穿梭框的nodes - 仅用于传送选中节点数组到父组件同后台通信需求
      let halfNodes = objDeepCopy(arrayHalfCheckedNodes);

      // 自定义参数读取设置
      let children__ = this.defaultProps.children || "children";
      let pid__ = this.pid || "pid";
      let id__ = this["node_key"] || "id";

      /*
       * 先整合目标树没有父节点的叶子节点选中，需要整理出来此叶子节点的父节点直到根节点路径 - 此时所有骨架节点已有
       * 再将所有末端叶子节点根据pid直接推入目标树即可
       * 声明新盒子将所有半选节点的子节点清除 - 只保留骨架 因为排序是先父后子 因此不存在子元素处理好插入时父元素还没处理的情况
       * 下面一二步是为了搭建出来目标树没有根节点躯干节点时的叶子选中，给此叶子搭建出根节点和躯干节点
       */

      // let不存在状态提升 因此在函数调用之前赋值 并递归为以为数组！
      let self_from_data = JSON.stringify(this.self_from_data);
      // 第一步
      let skeletonHalfCheckedNodes = objDeepCopy(arrayHalfCheckedNodes); // 深拷贝数据 - 半选节点
      // 筛选目标树不存在的骨架节点 - 半选内的节点
      let newSkeletonHalfCheckedNodes = [];
      skeletonHalfCheckedNodes.forEach(item => {
        if (!inquireIsExist(item)) {
          newSkeletonHalfCheckedNodes.push(item);
        }
      });
      // 筛选到目标树不存在的骨架后在处理每个骨架节点-非末端叶子节点 - 半选节点
      newSkeletonHalfCheckedNodes.forEach(item => {
        item[children__] = [];
        [0, "0"].includes(item[pid__])
          ? this.$refs["from-tree"].append(item)
          : this.$refs["from-tree"].append(item, item[pid__]);
      });

      // 第二步
      // 筛选目标树不存在的骨架节点 - 全选内的节点
      let newSkeletonCheckedNodes = [];
      nodes.forEach(item => {
        if (!inquireIsExist(item)) {
          newSkeletonCheckedNodes.push(item);
        }
      });
      // 筛选到目标树不存在的骨架后在处理每个骨架节点-非末端叶子节点 - 全选节点
      newSkeletonCheckedNodes.forEach(item => {
        if (item[children__] && item[children__].length > 0) {
          item[children__] = [];
          [0, "0"].includes(item[pid__])
            ? this.$refs["from-tree"].append(item)
            : this.$refs["from-tree"].append(item, item[pid__]);
        }
      });

      // 第三步 处理末端叶子元素 - 声明新盒子筛选出所有末端叶子节点
      let leafCheckedNodes = arrayCheckedNodes.filter(
        item => !item[children__] || item[children__].length == 0
      );
      // 末端叶子插入目标树
      leafCheckedNodes.forEach(item => {
        if (!inquireIsExist(item)) {
          this.$refs["from-tree"].append(item, item[pid__]);
        }
      });

      // 递归查询data内是否存在item函数
      function inquireIsExist(item, strData = self_from_data) {
        // 将树形数据格式化成一维字符串 然后通过匹配来判断是否已存在
        let strItem =
          typeof item[id__] == "number"
            ? `"${id__}":${item[id__]},`
            : `"${id__}":"${item[id__]}"`;
        let reg = RegExp(strItem);
        let existed = reg.test(strData);
        return existed;
      }

      // 右侧删掉选中数据
      arrayCheckedNodes.map(item => this.$refs["to-tree"].remove(item));

      // 处理完毕按钮恢复禁用状态
      this.to_check_keys = [];

      // 目标数据节点展开
      if (this.transferOpenNode) {
        this.from_expanded_keys = keys;
      }

      // 传递信息给父组件
      // this.$emit("removeBtn", this.self_from_data, this.self_to_data, {
      //   keys,
      //   nodes,
      //   harfKeys,
      //   halfNodes
      // });
      // 处理完毕取消选中
      this.$refs["to-tree"].setCheckedKeys([]);
    },
    // 源树选中事件 - 是否禁用穿梭按钮
    fromTreeChecked(nodeObj, treeObj) {
      this.getSelDevListRightNum();
      this.from_check_keys = treeObj.checkedNodes;
      this.$emit("right-check-change", nodeObj, treeObj);
    },
    // 目标树选中事件 - 是否禁用穿梭按钮
    toTreeChecked(nodeObj, treeObj) {
      this.getSelDevListLeftNum();
      this.to_check_keys = treeObj.checkedNodes;
      this.$emit("left-check-change", nodeObj, treeObj);
    },
    // 源数据 总全选checkbox
    fromAllBoxChange(val) {
      if (this.self_from_data.length == 0) {
        return;
      }
      if (val) {
        this.from_check_keys = this.self_from_data;
        this.$refs["from-tree"].setCheckedNodes(this.self_from_data);
      } else {
        this.$refs["from-tree"].setCheckedNodes([]);
        this.from_check_keys = [];
      }
      this.getSelDevListRightNum();
    },
    // 目标数据 总全选checkbox
    toAllBoxChange(val) {
      const data = this.bayOrdev === 1 ? this.self_to_data1 : this.self_to_data2;
      if (data.length == 0) {
        return;
      }
      if (val) {
        this.to_check_keys = data;
        this.$refs["to-tree"].setCheckedNodes(data);
      } else {
        this.$refs["to-tree"].setCheckedNodes([]);
        this.to_check_keys = [];
      }
      this.getSelDevListLeftNum();
    },
    // 源数据 筛选
    filterNodeFrom(value, data) {
      if (!value) return true;
      return data[this.defaultProps.label].indexOf(value) !== -1;
    },
    // 目标数据筛选
    filterNodeTo(value, data) {
      if (!value) return true;
      return data[this.defaultProps.label].indexOf(value) !== -1;
    },
    // 改造卡口和摄像头数据  成-- areaTreeList  下的数据 的公共方法
    commonFn1(array) {
      if (!this.arrayToTree) {
        array.forEach(item => {
          item[this.pid] = 0;
        });
        const fn = (arr) => {
          for (let item of arr) {
            if (item.areaTreeList.length > 0) {
              fn(item.areaTreeList);
            } else {
              if (item.bayonetList.length > 0) {
                // 卡口
                item.areaTreeList = item.bayonetList.map(m => {
                  return {
                    ...m,
                    areaParentUid: item.areaId,
                    areaName: m.bayonetName,
                    areaId: m.uid
                  }
                })
              }
              // item.areaTreeList = [
              //   {areaName: '卡口', areaId: areaId1, areaParentUid: item.areaId, areaTreeList: bayonetList},
              //   {areaName: '摄像头', areaId: areaId2, areaParentUid: item.areaId, areaTreeList: deviceBasicList}
              // ]
            }
          }
        }
        fn(array);
        console.log(array, 'array')
        return array;
      } else {
        return arrayToTree(array, {
          id: this.node_key,
          pid: this.pid,
          children: this.defaultProps.children
        });
      }

    },
    commonFn2(array) {
      if (!this.arrayToTree) {
        array.forEach(item => {
          item[this.pid] = 0;
        });
        const fn = (arr) => {
          for (let item of arr) {
            if (item.areaTreeList.length > 0) {
              fn(item.areaTreeList);
            } else {
              if (item.deviceBasicList.length > 0) {
                // 摄像头
                item.areaTreeList = item.deviceBasicList.map(m => {
                  return {
                    ...m,
                    areaName: m.deviceName,
                    areaId: m.uid,
                    areaParentUid: item.areaId,
                  }
                })
              }
              // item.areaTreeList = [
              //   {areaName: '卡口', areaId: areaId1, areaParentUid: item.areaId, areaTreeList: bayonetList},
              //   {areaName: '摄像头', areaId: areaId2, areaParentUid: item.areaId, areaTreeList: deviceBasicList}
              // ]
            }
          }
        }
        fn(array);
        console.log(array, 'array')
        return array;
      } else {
        return arrayToTree(array, {
          id: this.node_key,
          pid: this.pid,
          children: this.defaultProps.children
        });
      }

    },
    // 初始化缩放等级
    resetZoom () {
      if (this.map) {
        this.map.setZoom(this.zoomLevel);
      }
    },
    // 地图缩放
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    }
  },
  watch: {
    // 左侧 状态监测
    from_check_keys(val) {
      if (val.length > 0) {
        // 穿梭按钮是否禁用
        this.from_disabled = false;
        // 总半选是否开启
        this.from_is_indeterminate = true;

        // 总全选是否开启 - 根据选中节点中为根节点的数量是否和源数据长度相等
        let allCheck = val.filter(item => item[this.pid] == 0);
        if (allCheck.length == this.self_from_data.length) {
          // 关闭半选 开启全选
          this.from_is_indeterminate = false;
          this.from_check_all = true;
        } else {
          this.from_is_indeterminate = true;
          this.from_check_all = false;
        }
      } else {
        this.from_disabled = true;
        this.from_is_indeterminate = false;
        this.from_check_all = false;
      }
    },
    // 右侧 状态监测
    to_check_keys(val) {
      if (val.length > 0) {
        // 穿梭按钮是否禁用
        this.to_disabled = false;
        // 总半选是否开启
        this.to_is_indeterminate = true;

        // 总全选是否开启 - 根据选中节点中为根节点的数量是否和源数据长度相等
        let allCheck = val.filter(item => item[this.pid] == 0);
        const data = this.bayOrdev === 1 ? this.self_to_data1 : this.self_to_data2;
        if (allCheck.length == data.length) {
          // 关闭半选 开启全选
          this.to_is_indeterminate = false;
          this.to_check_all = true;
        } else {
          this.to_is_indeterminate = true;
          this.to_check_all = false;
        }
      } else {
        this.to_disabled = true;
        this.to_is_indeterminate = false;
        this.to_check_all = false;
      }
    },
    // 左侧 数据筛选
    filterFrom(val) {
      this.$refs["from-tree"].filter(val);
    }
  },
  computed: {
    // 左侧数据
    self_from_data() {
      if (this.bayOrdev === 2) {
        return this.bayFromData;
      } else {
        return this.devFromData;
      }
    },
    selDevMapNum () {
      if (this.bayOrdev === 2) {
        const data = this.flatDev_(this.self_to_data2);
        return data.length;
      } else {
        const data = this.flatDev_(this.self_to_data1);
        return data.length;
      }
    },
    // selDevNumUp () {
    //   if (this.bayOrdev === 2) {
    //     return this.self_to_data2.length;
    //   } else {
    //     return this.self_to_data1.length;
    //   }
    // }
  },
  // 销毁地图实例
  isDestroyed () {
    if (this.map) {
      this.map.destroy();
    }
    $('#devMap').unbind('click');
  }
}
</script>
<style lang="scss" scoped>
.con_dev_up{
  border-radius:4px 4px 0px 0px;
  border:1px solid rgba(211,211,211,1);
  .up_tab{
    display: flex;
    width: 100;
    height:42px;
    background:rgba(250,250,250,1);
    border-radius:5px 5px 0px 0px;
    border-bottom:1px solid rgba(242,242,242,1);
    > div{
      height: 100%;
      margin: 0 10px;
      line-height: 42px;
      cursor: pointer;
      &:hover, &.active{
        color: #0C70F8;
        border-bottom: 2px solid #0C70F8;
      }
    }
  }
  .up_map{
    width: 100%;
    height: 500px;
    position: relative;
    .sel_dev{
      position: absolute;
      z-index: 999;
      left: 10px;
      top: 10px;
      width:260px;
      box-shadow:0px 3px 10px 0px rgba(99,99,99,0.39),0px 0px 9px 0px rgba(255,255,255,0.55); 
      .title{
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        border-bottom: 1px solid #F2F2F2;
        display: flex;
        justify-content: space-between;
        background: #fff;
        > span{
          color: #0C70F8;
          font-size: 16px;
        }
        > i{
          margin-top: 12px;
          color: #0C70F8;
          cursor: pointer;
        }
      }
      > div:nth-child(2){
        width: 100%;
        height:420px;
        padding: 20px 0;
        background:rgba(255,255,255,1);
        .tree_box{
          width: 100%;
          padding: 12px;
          height: 352px;
        }
      }
    }
    .search{
      position: absolute;
      z-index: 999;
      top:10px;
      left: 280px;
      width: 220px;
      box-shadow:0px 3px 10px 0px rgba(99,99,99,0.39),0px 0px 9px 0px rgba(255,255,255,0.55);
    }
    .sel_type{
      position: absolute;
      z-index: 999;
      top:10px;
      left: 510px;
      width: 300px;
      height: 40px;
      line-height: 40px;
      display: flex;
      justify-content: space-between;
      background: #fff;
      box-shadow:0px 3px 10px 0px rgba(99,99,99,0.39),0px 0px 9px 0px rgba(255,255,255,0.55);
      > div{
        width: 25%;
        text-align: center;
        cursor: pointer;
        > i{
          margin-right: 4px;
        }
        &:hover, &.active{
          i, span{
            color: #0C70F8;
          }
        }
      }
    }
    .sel_checkbox{
      padding: 0 5px;
      position: absolute;
      z-index: 999;
      height: 40px;
      line-height: 40px;
      top:10px;
      left: 820px;
      background: #fff;
      box-shadow:0px 3px 10px 0px rgba(99,99,99,0.39),0px 0px 9px 0px rgba(255,255,255,0.55);
      .num{
        font-size: 12px;
        color: #999;
      }
    }
    .dev_map{
      width: 100%;
      height: 500px;
    }
    .map_zoom{
      position: absolute;
      right: 20px;
      bottom: 20px;
      .top, .bottom > li{
        width: 78px;
        height: 70px;
        line-height: 70px;
        background: #fff;
        text-align: center;
        cursor: pointer;
        i{
          margin-top: 16px;
          font-size: 20px;
          color: #999999;
        }
        &:hover{
          i{
            color: #0C70F8;
          }
        }
      }
      .top{
        margin-bottom: 10px;
        p.active{
          color: #0C70F8;
        }
      }
      .top, .bottom{
        box-shadow:4px 0px 15px 0px rgba(131,131,131,0.23),0px 0px 13px 0px rgba(255,255,255,0.55);
      }
      .bottom > li:nth-child(1){
        border-bottom: 1px solid #F1F1F1;
      }
    }
  }
  .up_list{
    width: 100%;
    height: 500px;
    display: flex;
    .transfer_left, .transfer_right{
      width: 260px;
      border-right: 1px solid #F2F2F2;
      > div:nth-child(1){
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #f2f2f2;
        padding-left: 10px;
      }
      .transfer_title{
        padding: 10px 20px;
        .el-checkbox{
          margin-right: 10px;
        }
      }
    }
    .transfer_right{
      border-left: 1px solid #f2f2f2;
      .el-input{
        padding: 10px;
        
      }
      .transfer_title{
        padding-top: 0;
      }
    }
    .transfer_center{
      padding: 0 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .transfer_center_item{
        width:52px;
        height:24px;
        background:rgba(12,112,248,1);
        border-radius:4px;
        margin-bottom: 10px;
        .el-button{
          width: 100%;
          height:100%;
          padding: 0!important;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.con_dev_up{
  .transfer_right{
    .el-input__inner{
      border-radius: 20px;
    }
    .el-input__icon{
      margin-right: 20px;
      font-size: 16px;
    }
  } 
  .sel_tab{
    display: flex;
    width:220px;
    height:28px;
    margin-left: 20px;
    border-radius:4px;
    border:1px solid rgba(211,211,211,1);
    > div{
      width: 50%;
      text-align: center;
      line-height: 28px;
      &.active, &:hover{
        background: #E0F2FF;
        color: #0C70F8;
        cursor: pointer;
      }
    
    }
  }
  .transfer_center .transfer_center_item{
    .el-button{
      i, span{
        font-size: 12px!important;
      }
    }
  }
  .transfer_main{
    padding: 10px;
  }
  .custom_tree_node{
    width: 100%;
    display: flex;
    justify-content: space-between;
    > i{
      margin-top: 2px;
      display: none;
    }
    &:hover{
      > i{
        display: inline-block;
        &:hover{
          color: #0C70F8;
        }
      }
    }
  }
  .not_checked{
    .el-checkbox{
      display: none;
    }
  }
  .sel_checkbox{
    .el-checkbox{
      margin-right: 8px!important;
      .el-checkbox__label{
        padding-left: 2px;
      }
    }
  }
} 
</style>