<template>
  <div class="con_dev">
    <div class="dev_box" v-if="pageType === 1">
      <div class="tab">
        <span>布控设备</span>
        <!-- 公务车辆监管不允许修改设备 -->
        <el-button v-if="model !== 'gwcl'" type="info" plain @click="changePageType">修改布控设备</el-button>
      </div>
      <div class="sel_dev">
        <div class="title">
          <span>已选设备（{{devIdList.length + bayIdList.length}}）</span>
          <i class="el-icon-arrow-up" v-show="isShowTree" @click="isShowTree = false"></i>
          <i class="el-icon-arrow-down" v-show="!isShowTree" @click="isShowTree = true"></i>
        </div>
        <div :class="{'active': isShowTree}">
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
    <template v-if="pageType === 2" >
      <div 
        is="mapSelector" 
        ref="mapSelector" 
        :isNotDialog="false"
        showTypes="DB"
        :activeDeviceList="activeDeviceList"
        >
      </div>
      <div class="footer_btn">
        <el-button class="btn_100" type="primary" @click="updateControlDev">确定</el-button>
        <el-button class="btn_100" @click="cancelUpdateControlDev">返回</el-button>
      </div>
    </template>
  </div>
</template>
<script>
import {mapXupuxian} from '@/config/config.js';
import {random14, addCluster} from '@/utils/util.js';
import mapSelector from '@/components/common/mapSelector.vue';
import { setTimeout } from 'timers';
import {getAllMonitorList, getBayonetList} from '@/views/index/api/api.base.js';
import { Promise } from 'q';
export default {
  components: {mapSelector},
  props: ['model', 'addressObj', 'addressObjTwo', 'modelType', 'lostTime', 'devIdListFive', 'bayIdListFive', 'devs', 'bays'],
  data () {
    return {
      pageType: null,//页面类型，1为布控设备展示页面，2为修改布控设备页面
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
      loading: false,
      activeDeviceList: null,
      selDevs: [],
      selBays: []
    }
  },
  mounted () {
    this.pageType = 1;
    this.selDevs = this.devs;
    this.selBays = this.bays;
    this.$nextTick(() => {
      this.resetMap();
      this.getDevAndBayList();
    })
  },
  watch: {
    pageType (val) {
      if (val === 1) {
        this.Bus.$emit('sendIsShowOperateBtn', true);
      } else {  
        this.Bus.$emit('sendIsShowOperateBtn', false);
      }
    }
  },
  methods: {
    // 确定选择布控设备
    updateControlDev () {
      this.devIdList = [];
      this.bayIdList = [];
      this.toLeftDevList = [];
      this.toLeftBayList = [];
      const devData = this.$refs['mapSelector'].getCheckedIds();
      this.selDevs = devData.deviceList;
      this.selBays = devData.bayonetList;
      this.pageType = 1;
      this.$nextTick(() => {
        this.resetMap();
        this.operateModel();
      })
    },
    // 取消选择布控设备
    cancelUpdateControlDev () {
      this.pageType = 1;
      this.devIdList = [];
      this.bayIdList = [];
      this.$nextTick(() => {
        this.resetMap();
        this.operateModel();
      })
    },
    // 进入修改已选择的设备页面
    changePageType () {
      if (this.map) {
        this.map.destroy();
        this.map = null;
      }
      this.removeObj = {1: [],2: []};
      this.markerList = [];
    
      this.pageType = 2;
      this.$nextTick(() => {
        this.activeDeviceList = [...this.devIdList.map(m => m.uid), ...this.bayIdList.map(m => m.uid)];
      })
    },
    // 传给父组件 
    sendParent () {
      if (this.devIdList.length > 0 || this.bayIdList.length > 0) {
        const devList = this.devIdList.map(m => {return {deviceId: m.uid}})
        const bayonetList = this.bayIdList.map(m => {return {bayonetId: m.uid}})
        this.$emit('getChildModel', {devList, bayonetList});
      } else {
        this.$message.info('请先选择布控设备');
      }
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
        getBayonetList  ({ 
          "where.areaId": mapXupuxian.adcode,
          'where.subAreaFlag': true,
          pageSize: 9999,
        })
      ])
      .then(res => {
        if (res) {
          const [{data: devList}, {data: {list: bayList}}] = res;
          devList.forEach(f => {f.dataType = 1;f.name = f.deviceName})
          bayList.forEach(f => {f.dataType = 2;f.name = f.bayonetName})
          this.allBayList = bayList.filter(f => f.isEnterPoint === 1 || f.isEnterPoint === 2);//筛选出入城卡口
          this.devList = [...devList, ...bayList];
          this.operateModel();
        }
      })
    },
    // 点标记和一键布控对应操作
    operateModel () {
      this.mapMark(this.devList);
      // 第1个布控模型的一键布控时所执行的
      this.addressObj && this.addressMark();
      // 第2个布控模型的一键布控时所执行的
      this.addressObjTwo && this.mapCircleTwo();
      // 第3个布控模型的一键布控时所执行的
      this.modelType === 3 && this.getAllBay();
      // 第5个布控模型的一键布控时所执行的
      // 编辑时
      if (this.selDevs.length > 0) {
        this.changeColorAndGetTreeData(this.selDevs, 1);
        this.positionMap(this.selDevs);
        if (this.selBays.length > 0) {
          this.changeColorAndGetTreeData(this.selBays, 2);
          this.positionMap(this.selBays);
        }
      // 新增时
      } else {
        if (this.devIdListFive && this.devIdListFive.length > 0) {
          this.changeColorAndGetTreeData(this.devIdListFive, 1);
          this.positionMap(this.devIdListFive);
        }          
        if (this.bayIdListFive && this.bayIdListFive.length > 0) {
          this.changeColorAndGetTreeData(this.bayIdListFive, 2);
          this.positionMap(this.bayIdListFive);
        }   
      }    
    },
    // 地图设备和卡口标记 data:摄像头数据/卡口数据
    mapMark (data) {
      let _this = this, _hoverWindow = null;
      // 遍历列表，摄像头 或者卡口
      for (let i = 0; i < data.length; i++) {
        let offSet = [-23, -70];
        let obj = data[i];
        if (obj.longitude > 0 && obj.latitude > 0) {
          let _marker = new window.AMap.Marker({ // 添加自定义点标记
            map: _this.map,
            position: [obj.longitude, obj.latitude],
            offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: this.setMarkContent(obj)
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
      // 编辑时
      if (this.selDevs.length > 0 || this.selBays.length > 0) {
        if (this.selDevs.length > 0) {
          this.changeColorAndGetTreeData(this.selDevs, 1);
          this.positionMap(this.selDevs);
        }
        if (this.selBays.length > 0) {
          this.changeColorAndGetTreeData(this.selBays, 2);
          this.positionMap(this.selBays);
        }
      // 新增时
      } else {
        let circle = new window.AMap.Circle({
          center: new window.AMap.LngLat(lngLat[0], lngLat[1]), // 圆心位置
          radius: this.scopeRadius(type),  //半径
          strokeColor: "#F33",  //线颜色
          strokeOpacity: 1,  //线透明度
          strokeWeight: 3,  //线粗细度
          fillColor: "#ee2200",  //填充颜色
          fillOpacity: 0.35 //填充透明度
        })
        circle.setMap(this.map);
        this.removeObj[type].push(circle);
        this.getCircleDev(circle, index);
      }
    },
    // 圆形覆盖物
    mapCircleTwo () {
      // 编辑时
      if (this.selDevs.length > 0 || this.selBays.length > 0) {
        if (this.selDevs.length > 0) {
          this.changeColorAndGetTreeData(this.selDevs, 1);
          this.positionMap(this.selDevs);
        }
        if (this.selBays.length > 0) {
          this.changeColorAndGetTreeData(this.selBays, 2);
          this.positionMap(this.selBays);
        }
      // 新增时
      } else {  
        const lngLat = this.addressObjTwo.lnglat;
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
        circle.setMap(this.map);
        this.setViewingArea(circle.getCenter());
        this.getCircleDev(circle);
      }
    },
    // 把地图的可视区域设置在选中设备或卡口的区域
    setViewingArea (obj) {
      this.map.setZoomAndCenter(14, obj);
    },
    // 把地图定位到已选设备位置
    positionMap (array) {
      for (let item of this.markerList) {
        const obj = item.getExtData();
        let key = null;
        array[0].hasOwnProperty('uid') && (key = 'uid');  
        array[0].hasOwnProperty('deviceId') && (key = 'deviceId');
        array[0].hasOwnProperty('bayonetId') && (key = 'bayonetId');
        if (array.some(s => s[key] === obj.uid)) {
          this.setViewingArea(item.getPosition());
          break;
        }
      }
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
            let uContent = this.setMarkContent(f.getExtData(), 'change')
            f.setContent(uContent);
          }
        }
      })
      this.devIdList = [...this.devIdList, ..._devList];
      this.bayIdList = [...this.bayIdList, ..._bayList];
      if (this.addressObj && this.addressObj.length === 2 && index === 0) return;//人员失踪有两个范围，两个范围内的设备和卡口累加完后再一次性添加到左边树      
      this.getTreeData(this.devIdList, 1);//获得设备树数据
      this.getTreeData(this.bayIdList, 2);//获得卡口树数据
    },
    // 新增或编辑时，点标记变色和变为树结构数据公共方法,array-数据,type-设备/卡口
    changeColorAndGetTreeData (array, type) {
      let list = [];
      this.markerList.forEach(f => {
        const obj = f.getExtData();
        let key = null;
        array[0].hasOwnProperty('deviceId') && (key = 'deviceId');
        array[0].hasOwnProperty('bayonetId') && (key = 'bayonetId');
        array[0].hasOwnProperty('uid') && (key = 'uid');
        if (array.some(s => s[key] === obj.uid && obj.dataType === type)) {
          list.push(obj);
          const uContent = this.setMarkContent(obj, 'change')
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
    setMarkContent (obj, operate) {  
      let sDataType, uContent;
      if (obj.dataType === 1 && obj.deviceStatus !== 1) {
        sDataType = 6;
      } else if (obj.dataType === 2 && !obj.isEnabled) {
        sDataType = 9
      } else {
        sDataType = obj.dataType === 1 ? 0 : 1;
      }
      uContent = '<div id="' + obj.uid + '" class="map_icons vl_icon vl_icon_map_mark' + sDataType + '"></div>'
      if (operate === 'change') {
        sDataType = obj.dataType === 1 ? 0 : 1;
        let sClass = 'vl_icon_map_sxt_in_area' + sDataType;
        uContent = '<div id="' + obj.uid + '" class="map_icons vl_icon ' + sClass +'"></div>';
      }
      return uContent;
    },
    // 获取城内所有卡口
    getAllBay () {
      // 编辑时
      if (this.selBays.length > 0) {
        this.changeColorAndGetTreeData(this.selBays, 2);
        this.positionMap(this.selBays);
      // 新增时
      } else {
        this.getTreeData(this.allBayList, 2);//获得卡口树数据
        this.bayIdList = this.allBayList;//赋值显示卡口数量
        // 让选中的卡口变色
        this.markerList.forEach(f => {
          if (this.allBayList.some(s => s.uid === f.getExtData().uid)) {
            let uContent = this.setMarkContent(f.getExtData(), 'change')
            f.setContent(uContent);
          }
        })
        this.positionMap(this.allBayList);
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
        height: 0;
        background:rgba(255,255,255,1);
        transition: all .3s linear;
        overflow: hidden;
        &.active{
          height: 420px;
          padding-bottom: 20px;
        }
        .sel_tab{
          display: flex;
          width:220px;
          height:28px;
          margin-left: 20px;
          margin-top: 20px;
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
  .footer_btn{
    text-align: center;
    padding-top: 20px;
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