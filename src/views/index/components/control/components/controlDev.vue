<template>
  <div class="con_dev">
    <div class="dev_box" v-if="pageType === 1">
      <div class="tab">
        <span>布控设备</span>
        <el-button type="info" plain @click="pageType = 2">修改布控设备</el-button>
      </div>
      <div class="sel_dev">
        <div class="title">
          <span>已选设备（{{bayOrdev === 1 ? devIdList.length : bayIdList.length}}）</span>
          <i class="el-icon-arrow-up" v-show="isShowTree" @click="isShowTree = false"></i>
          <i class="el-icon-arrow-down" v-show="!isShowTree" @click="isShowTree = true"></i>
        </div>
        <div v-show="isShowTree">
          <div class="sel_tab">
            <div @click="bayOrdev = 1" :class="{'active': bayOrdev === 1}">摄像头</div>
            <div @click="bayOrdev = 2" :class="{'active': bayOrdev === 2}">卡口</div>
          </div>
          <vue-scroll style="height: 352px;">
            <div class="tree_box">
              <el-tree
                v-show="bayOrdev === 1"
                ref="to-tree1" 
                icon-class="el-icon-arrow-right"
                :data="self_to_data1"
                :node-key="node_key"
                :props="defaultProps"
                :default-expanded-keys="to_expanded_keys"
                :default-expand-all="true"
              >
              </el-tree>
              <el-tree
                v-show="bayOrdev === 2"
                ref="to-tree2" 
                icon-class="el-icon-arrow-right"
                :data="self_to_data2"
                :node-key="node_key"
                :props="defaultProps"
                :default-expanded-keys="to_expanded_keys"
                :default-expand-all="true"
              >
              </el-tree>


              <!-- 不显示在页面上，作为已选设备树的参照 -->
              <el-tree
                v-show="false"
                slot="to"
                ref="from-tree1" 
                :data="devFromData"
                show-checkbox
                :node-key="node_key"
                :props="defaultProps"
                :default-expand-all="true"
              >
              </el-tree>  
              <el-tree
                v-show="false"
                slot="to"
                ref="from-tree2" 
                :data="bayFromData"
                show-checkbox
                :node-key="node_key"
                :props="defaultProps"
                :default-expand-all="true"
              >
              </el-tree>  
            </div>
          </vue-scroll>
        </div>
      </div>
      <div class="dev_map" id="devMap"></div>
      <div class="map_zoom">
        <div class="top"><i class="el-icon-aim" @click="resetZoom()"></i></div>
        <ul class="bottom">
          <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
          <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
        </ul>
      </div>
    </div>
    <div v-if="pageType === 2" 
      is="controlDevUpdate" 
      :devFromDataUp="devFromData"
      :bayFromDataUp="bayFromData"
      :self_to_data1Up="self_to_data1"
      :self_to_data2Up="self_to_data2"
      :addressObj="addressObj"
      :devIdListUp="devIdList"
      :bayIdListUp="bayIdList"
      :modelType="modelType"
      @getControlDevUpdate="getControlDevUpdate"
    ></div>
  </div>
</template>
<script>
import {mapXupuxian} from '@/config/config.js';
import {MapGETmonitorList} from '@/views/index/api/api.map.js';
import {random14, objDeepCopy, addCluster} from '@/utils/util.js';
import controlDevUpdate from './controlDevUpdate.vue';
import { setTimeout } from 'timers';
export default {
  components: {controlDevUpdate},
  props: ['addressObj', 'addressObjTwo', 'modelType', 'lostTime', 'devIdListSel', 'bayIdListSel'],
  data () {
    return {
      pageType: 1,//页面类型，1为布控设备展示页面，2为修改布控设备页面
      // 地图参数
      zoomLevel: 12,
      map: null,
      autoComplete: null,
      devList: [],
      defaultProps: { label: 'areaName', children: 'areaTreeList' },
      self_to_data1: [],
      self_to_data2: [],
      to_expanded_keys: [],
      bayOrdev: 1,
      devIdList: [],
      bayIdList: [],
      bayFromData: [],
      devFromData: [],
      // bayFromData_: [],
      // devFromData_: [],
      node_key: 'areaId',
      pid: 'areaParentUid',
      removeObj: {1: [],2: []},
      isShowTree: false,
      markerList: [],
      devUpdateData: {},
      loading: false,
    }
  },
  mounted () {
    this.resetMap();
    this.getDevList();
    console.log(this.addressObj, 'addressObj')
  },
  methods: {
    // 传给父组件 
    sendParent () {
      if (this.pageType === 1) {
        const devList = this.devIdList.map(m => {return {deviceId: m}})
        const bayonetList = this.bayIdList.map(m => {return {bayonetId: m}})
        this.$emit('getChildModel', {devList, bayonetList});
      } else {
        this.$emit('getChildModel', this.devUpdateData);
      }
    },
    getControlDevUpdate (data) {
      this.devUpdateData = data;
    },
    // 初始化地图
    resetMap () {
      // 共有部分
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
    },
    // 获取地图上的设备和卡口数据
    getDevList () {
      this.loading = true;
      let params = {
        areaUid: '431224'
      }
      MapGETmonitorList(params).then(res => {
        if (res) {
         this.bayFromData = this.commonFn1(objDeepCopy([res.data]));
         this.devFromData = this.commonFn2(objDeepCopy([res.data]));

          this.devList = this.flatDev([res.data]);
          this.mapMark(this.devList);
          // 第1个布控模型的一键布控时所执行的
          this.addressObj && this.addressMark();
          // 第2个布控模型的一键布控时所执行的
          this.addressObjTwo && this.mapCircleTwo();
          // 第3个布控模型的一键布控时所执行的
          this.modelType === 3 && this.getAllBay();
          // 第5个布控模型的一键布控时所执行的,暂时这样写
          if (this.devIdListSel) {
            this.devIdList = this.devIdListSel;
            this.bayIdList = this.bayIdListSel;
            console.log(this.devIdList, 'this.devIdList')
          }          
        }
      });
    },
    // 扁平设备和卡口数据
    flatDev (arr) {
      let res = [];
      let fn = (array) => {
        array.forEach(f => {
          f.deviceBasicList.forEach(b => b.type = 1);
          f.bayonetList.forEach(b => b.type = 2);
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
          if (!('areaTreeList' in f)) {
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
            _content = '<div id="' + obj.uid + '_sxt' + '" class="vl_icon vl_icon_sxt"></div>';
          // 卡口
          } else {
            _content = '<div id="' + obj.uid + '_kk' + '" class="vl_icon vl_icon_kk"></div>';
          }
          let _marker = new window.AMap.Marker({ // 添加自定义点标记
            map: _this.map,
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
          // // click
          // _marker.on('click', function () {
          
          // })
          _this.markerList.push(_marker);
        }
      }
      _this.map.setFitView();
      addCluster(_this.map, _this.markerList);
    },
    // 人员失踪位置和家庭位置标记
    addressMark () {
      // 追踪点标记
      let offSet = [-20.5, -70], _this = this;
      this.addressObj.forEach(obj => {
        if (this.removeObj[obj.type].length > 0) {
          this.map.remove(this.removeObj[obj.type]);
        }
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
                <li><span>${obj.type === 1 ? '失踪' : '家庭'}地址：</span><span>${obj.address}</span></li>
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
          this.removeObj[obj.type].push(marker);
        }
        this.mapCircle(obj.lngLat, obj.type);
      })
    },
    // 计算布控范围半径
    scopeRadius (type) {
      if (type === 2 ) return 3*1000;
      const minute10 = 10*60*1000;
      const minute30 = 30*60*1000;
      const time = new Date().getTime() - this.lostTime.getTime();
      console.log(time, 'time')
      if (time === minute10) {
        return 10*1000;
      } else if (time > minute10 && time < minute30) {
        return 60*1000;
      } else if (time > minute30) {
        return 200*1000;
      } else {
        return 10*1000;
      }
    },
    // 圆形覆盖物
    mapCircle (lngLat, type) {
      let _this = this;
      let circle = new window.AMap.Circle({
        center: new window.AMap.LngLat(lngLat[0], lngLat[1]), // 圆心位置
        radius: _this.scopeRadius(type),  //半径
        strokeColor: "#F33",  //线颜色
        strokeOpacity: 1,  //线透明度
        strokeWeight: 3,  //线粗细度
        fillColor: "#ee2200",  //填充颜色
        fillOpacity: 0.35 //填充透明度
      })
      circle.setMap(_this.map);
      // this.setViewingArea(circle);
      this.removeObj[type].push(circle);
      this.getCircleDev(circle);
    },
    // 圆形覆盖物
    mapCircleTwo () {
      let _this = this;
      const lngLat = this.addressObjTwo.lnglat;
      let circle = new window.AMap.Circle({
        center: new window.AMap.LngLat(lngLat[0], lngLat[1]), // 圆心位置
        radius: this.addressObjTwo.radius * 1000,  //半径
        strokeColor: "#F33",  //线颜色
        strokeOpacity: 1,  //线透明度
        strokeWeight: 3,  //线粗细度
        fillColor: "#ee2200",  //填充颜色
        fillOpacity: 0.35 //填充透明度
      })
      circle.setMap(_this.map);
      // this.setViewingArea(circle);
      this.getCircleDev(circle);
    },
    // 把地图的可视区域设置在选中设备或卡口的区域
    setViewingArea (obj) {
      this.map.setCenter(obj.getCenter());
    },
    // 获取圆形覆盖物内的设备和卡口
    getCircleDev (polygon) {
      let res = [];
      this.markerList.forEach(f => {
        const obj = f.getExtData();
        // 把在圆形覆盖物范围之内的追踪点添加进来
        if (obj.longitude > 0 && obj.latitude > 0) {
          if (polygon && polygon.contains(new window.AMap.LngLat(obj.longitude, obj.latitude))) {
            // 在圆形之中
            res.push(obj);
            this.map.cluster.removeMarkers(f);
            let uContent = this.setMarkContent(f.getExtData())
            f.setContent(uContent);
            this.map.add(f);
          }
        }
      })
      const _devIdList = res.reduce((pre, cur) => {
        if (cur.type === 1) {
          pre = [...pre, cur.uid];
        }
        return pre;
      },[]);
      this.devIdList = [...this.devIdList, ..._devIdList];
      const _bayIdList = res.reduce((pre, cur) => {
        if (cur.type === 2) {
          pre = [...pre, cur.uid];
        }
        return pre;
      },[]);
      this.bayIdList = [...this.bayIdList, ..._bayIdList];
      // 为了生成设备和卡口左边的树数据，重复调取2次
      if (this.devIdList.length > 0) {
        setTimeout(() => {
          this.addDevIsLeft(this.devIdList, this.self_to_data1, 'from-tree1', 'to-tree1');
        })
      }
      if (this.bayIdList.length > 0) {
        setTimeout(() => {
          this.addDevIsLeft(this.bayIdList, this.self_to_data2, 'from-tree2', 'to-tree2');
        }, 5000)
      }
    },
    // 设置marker的显示图标
    setMarkContent (obj) {
      const type = obj.type === 1 ? 0 : 1;
      return '<div id="' + obj.uid + '" class="map_icons vl_icon vl_icon_map_sxt_in_area' + type + '"></div>'
    },
    // 获取城内所有卡口
    getAllBay () {
      let _this = this, res = [];
      this.bayIdList = this.devList.reduce((pre, cur) => {
        if (cur.type === 2) {
          pre = [...pre, cur.uid];
        }
        return pre;
      },[]);
      // 让选中的卡口变色
      _this.markerList.forEach(f => {
        if (this.bayIdList.some(s => s === f.getExtData().uid)) {
          _this.map.cluster.removeMarkers(f);
          let uContent = _this.setMarkContent(f.getExtData())
          f.setContent(uContent);
          _this.map.add(f);
        }
      })
      this.bayOrdev = 2;
      this.$nextTick(() => {
        this.addDevIsLeft(this.bayIdList, this.self_to_data2, 'from-tree2', 'to-tree2');
      })
    },
    // 添加按钮
    addDevIsLeft(data, selfToData, fromTree, toTree) {
      
      this.$refs[fromTree].setCheckedKeys(data);

      // 获取选中通过穿梭框的keys - 仅用于传送纯净的id数组到父组件同后台通信
      let keys = this.$refs[fromTree].getCheckedKeys();
      // 获取半选通过穿梭框的keys - 仅用于传送纯净的id数组到父组件同后台通信
      // let harfKeys = this.$refs[fromTree].getHalfCheckedKeys();
      // 选中节点数据
      let arrayCheckedNodes = this.$refs[fromTree].getCheckedNodes();
      // 获取选中通过穿梭框的nodes - 仅用于传送选中节点数组到父组件同后台通信需求
      let nodes = objDeepCopy(arrayCheckedNodes);
      console.log(nodes, 'nodes')
      // 半选中节点数据
      let arrayHalfCheckedNodes = this.$refs[fromTree].getHalfCheckedNodes();
      // 获取半选通过穿梭框的nodes - 仅用于传送选中节点数组到父组件同后台通信需求
      // let halfNodes = objDeepCopy(arrayHalfCheckedNodes);

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
      let self_to_data = JSON.stringify(selfToData);
      // 第一步
      let skeletonHalfCheckedNodes = objDeepCopy(arrayHalfCheckedNodes);// 深拷贝数据 - 半选节点
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
          ? this.$refs[toTree].append(item)
          : this.$refs[toTree].append(item, item[pid__]);
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
            ? this.$refs[toTree].append(item)
            : this.$refs[toTree].append(item, item[pid__]);
        }
      });

      // 第三步 处理末端叶子元素 - 声明新盒子筛选出所有末端叶子节点
      let leafCheckedNodes = arrayCheckedNodes.filter(
        item => !item[children__] || item[children__].length == 0
      );
      // 末端叶子插入目标树
      leafCheckedNodes.forEach(item => {
        if (!inquireIsExist(item)) {
          this.$refs[toTree].append(item, item[pid__]);
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

      // 右侧删掉选中数据
      arrayCheckedNodes.map(item => this.$refs[fromTree].remove(item));

      // 处理完毕按钮恢复禁用状态
      // this.from_check_keys = [];

      // 目标数据节点展开
      if (this.transferOpenNode) {
        this.to_expanded_keys = keys;
      }

      // 处理完毕取消选中
      this.$refs[fromTree].setCheckedKeys([]);
      this.loading = false;
    },
    // 改造卡口和摄像头数据  成-- areaTreeList  下的数据 的公共方法
    commonFn1(array) {
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
          }
        }
      }
      fn(array);
      return array;
    },
    commonFn2(array) {
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
          }
        }
      }
      fn(array);
      return array;
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
    },
  },
  computed: {
    // 右侧数据
    // self_from_data() {
      // if (this.bayOrdev === 2) {
      //   return this.bayFromData;
      // } else {
      //   return this.devFromData;
      // }
    // },
    // selDevNum () {
      // if (this.bayOrdev === 2) {
      //   const data = this.flatDev_(this.self_to_data2);
      //   return data.length;
      // } else {
      //   const data = this.flatDev_(this.self_to_data1);
      //   return data.length;
      // }
    // },
  },
  // 销毁地图实例
  isDestroyed () {
    if (this.map) {
      this.map.destroy();
    }
  }
}
</script>
<style lang="scss" scoped>
.con_dev{
  .dev_box{
    border-radius:4px 4px 0px 0px;
    border:1px solid #D3D3D3;
    position: relative;
    .tab{
      width: 100%;
      height: 42px;
      line-height: 42px;
      padding-left: 20px;
      background: #F2F2F2;
      border-bottom: 1px solid #D3D3D3;
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
    .sel_dev{
      position: absolute;
      z-index: 999;
      left: 20px;
      top: 62px;
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
        .tree_box{
          width: 100%;
          padding: 12px;
          height: 352px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.con_dev{
  .dev_box .tab{
    .el-button{
      width:100px;
      height:32px;
      padding: 0;
      margin-left: 10px;
      background:#FFFFFF;
      border-radius:4px;
      border:1px solid #D3D3D3;
      > span{
        font-size: 12px;
        color: #333;
      }
    }
  }
}
</style>