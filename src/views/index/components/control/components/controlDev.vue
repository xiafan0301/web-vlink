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
                :data="toLeftDevList"
                :node-key="node_key"
                :props="defaultProps"
              >
              </el-tree>
              <el-tree
                v-show="bayOrdev === 2"
                ref="to-tree2" 
                icon-class="el-icon-arrow-right"
                :data="toLeftBayList"
                :node-key="node_key"
                :props="defaultProps"
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
import {getAllMonitorList, getAllBayonetList} from '@/views/index/api/api.base.js';
import { Promise } from 'q';
export default {
  components: {controlDevUpdate},
  props: ['addressObj', 'addressObjTwo', 'modelType', 'lostTime', 'devIdListFive', 'bayIdListFive', 'devs', 'bays'],
  data () {
    return {
      pageType: 1,//页面类型，1为布控设备展示页面，2为修改布控设备页面
      // 地图参数
      zoomLevel: 12,
      map: null,
      autoComplete: null,
      devList: [],
      defaultProps: { label: 'name', children: 'areaTreeList' },
    
      bayOrdev: 1,
      toLeftDevList: [],
      toLeftBayList: [],

      devIdList: [],
      bayIdList: [],
      allBayList: [],
      node_key: 'uid',
      pid: 'areaUid',
      removeObj: {1: [],2: []},
      isShowTree: false,
      markerList: [],
      devUpdateData: {},
      loading: false,
    }
  },
  mounted () {
    this.resetMap();
    this.getDevAndBayList();
  },
  methods: {
    // 传给父组件 
    sendParent () {
      if (this.pageType === 1) {
        const devList = this.devIdList.map(m => {return {deviceId: m.uid}})
        const bayonetList = this.bayIdList.map(m => {return {bayonetId: m.uid}})
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
      map.setMapStyle('amap://styles/light'); 
      map.plugin('AMap.Autocomplete', () => {
        let autoOptions = {
          city: '溆浦县'
        }
        _this.autoComplete = new window.AMap.Autocomplete(autoOptions);
      })
      _this.map = map;
    },
    // 获取地图上的设备和卡口数据
    getDevAndBayList () {
      Promise.all([getAllMonitorList({ccode: mapXupuxian.adcode}), 
        getAllBayonetList({areaId: mapXupuxian.adcode})])
        .then(res => {
          if (res) {
             console.log(res, 'res')
            const [{data: devList}, {data: bayList}] = res;
            devList.forEach(f => {f.dataType = 1;f.name = f.deviceName})
            bayList.forEach(f => {f.dataType = 2;f.name = f.bayonetName})
            this.allBayList = bayList;
            this.devList = [...devList, ...bayList];
            this.mapMark(this.devList);
            // 第1个布控模型的一键布控时所执行的
            this.addressObj && this.addressMark();
            // 第2个布控模型的一键布控时所执行的
            this.addressObjTwo && this.mapCircleTwo();
            // 第3个布控模型的一键布控时所执行的
            this.modelType === 3 && this.getAllBay();
            // 第5个布控模型的一键布控时所执行的
            // 编辑时
            if (this.devs.length > 0) {
              this.changeColorAndGetTreeData(this.devs, 1);
              if (this.bays.length > 0) {
                this.changeColorAndGetTreeData(this.bays, 2);
              }
            // 新增时
            } else {
              if (this.devIdListFive.length > 0) {
                this.changeColorAndGetTreeData(this.devIdListFive, 1);
              }          
              if (this.bayIdListFive.length > 0) {
                this.changeColorAndGetTreeData(this.bayIdListFive, 2);
              }   
            }       
          }
        })
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
          if (obj.dataType === 1) {
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
              if (obj.dataType === 1) {
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
      this.addressObj.forEach((obj, index) => {
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
        this.mapCircle(obj.lngLat, obj.type, index);
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
    mapCircle (lngLat, type, index) {
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
      // 编辑时
      // 设备
      if (this.devs.length > 0) {
        this.changeColorAndGetTreeData(this.devs, 1);
        // 卡口
        if (this.bays.length > 0) {
          this.changeColorAndGetTreeData(this.bays, 2);
        }
      // 新增时
      } else {
        this.getCircleDev(circle, index);
      }
    },
    // 圆形覆盖物
    mapCircleTwo () {
      let _this = this;
      const lngLat = this.addressObjTwo.lnglat;
      console.log(this.addressObjTwo.radius, 'this.addressObjTwo.radius')
      if (lngLat[0] === null) return;
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
      // 编辑时
      // 设备
      if (this.devs.length > 0) {
        this.changeColorAndGetTreeData(this.devs, 1);
        // 卡口
        if (this.bays.length > 0) {
          this.changeColorAndGetTreeData(this.bays, 2);
        }
      // 新增时
      } else {
        
        this.getCircleDev(circle);
      }
    },
    // 把地图的可视区域设置在选中设备或卡口的区域
    setViewingArea (obj) {
      this.map.setCenter(obj.getCenter());
    },
    // 获取圆形覆盖物内的设备和卡口
    getCircleDev (polygon, index) {
      let _devList = [], _bayList = [];
      this.markerList.forEach(f => {
        const obj = f.getExtData();
        // 把在圆形覆盖物范围之内的追踪点添加进来
        if (obj.longitude > 0 && obj.latitude > 0) {
          if (polygon && polygon.contains(new window.AMap.LngLat(obj.longitude, obj.latitude))) {
            // 在圆形之中
            if (obj.dataType === 1) {
              _devList.push(obj);
            } else {
              _bayList.push(obj);
            }
            let uContent = this.setMarkContent(f.getExtData())
            f.setContent(uContent);
          }
        }
      })
      this.devIdList = [...this.devIdList, ..._devList];
      this.bayIdList = [...this.bayIdList, ..._bayList];

      if (index === 0) return;//人员失踪有两个范围，两个范围内的设备和卡口累加完后再一次性添加到左边树
      this.getTreeData(this.devIdList, 1);//获得设备树数据
      this.getTreeData(this.bayIdList, 2);//获得卡口树数据
    },
    // 新增或编辑时，点标记变色和变为树结构数据公共方法
    changeColorAndGetTreeData (array, type) {
      let list = [];
      this.markerList.forEach(f => {
        const obj = f.getExtData();
        const key = type === 1 ? 'deviceId' : 'bayonetId';
        if (array.some(s => s[key] === obj.uid && obj.dataType === type)) {
          list.push(obj);
          const uContent = this.setMarkContent(obj)
          f.setContent(uContent);
        }
      })
      type === 1 ? (this.devIdList = list) : (this.bayIdList = list);
      this.getTreeData(list, type);
    },
    // 改造数据成树结构公共方法
    getTreeData (data, type) {
      const hash = {};
      data.forEach(f => {
        if (!hash[f.areaName]) {
          hash[f.areaName] = [];
          hash[f.areaName].push(f);
        } else {
          hash[f.areaName].push(f);
        }
      })
      const areaList = [];
      for (let key in hash) {
        areaList.push({name: key, uid: hash[key][0].areaUid, areaUid: 1, areaTreeList: hash[key]});
      }
      if (type === 1) {
        this.toLeftDevList = areaList;
      } else {
        this.toLeftBayList = areaList;
      }
    },

    // 设置marker的显示图标
    setMarkContent (obj) {
      const type = obj.dataType === 1 ? 0 : 1;
      return '<div id="' + obj.uid + '" class="map_icons vl_icon vl_icon_map_sxt_in_area' + type + '"></div>'
    },
    // 获取城内所有卡口
    getAllBay () {
      // 编辑时
      if (this.bays.length > 0) {
        this.changeColorAndGetTreeData(this.bays, 2);
      // 新增时
      } else {
        this.getTreeData(this.allBayList, 2);//获得卡口树数据
        this.bayIdList = this.allBayList;//赋值显示卡口数量
        // 让选中的卡口变色
        this.markerList.forEach(f => {
          if (this.allBayList.some(s => s.uid === f.getExtData().uid)) {
            let uContent = this.setMarkContent(f.getExtData())
            f.setContent(uContent);
          }
        })
      }
      this.bayOrdev = 2;
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