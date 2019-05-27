<template>
  <div class="select_map_area" :class="{'vl_map_selarea_ctl': selAreaAble}">
    <div class="select_map_left">
      <div class="select_top">
        <span>已有设备 ({{leftDeviceNumber}})</span>
        <p @click="removeDevice">移除设备</p>
      </div>
      <div class="detail_list">
        <vue-scroll>
          <ul class="temp_detail_info">
            <li v-for="(item, index) in currentDeviceList" :key="'item' + index">
                <div style="display: flex; padding: 0 10px;">
                  <el-checkbox v-model="item.isChecked" style="margin-right: 10px;" @change="handleLeftParentChecked(index, item.isChecked)"></el-checkbox>
                  <div class="parent_temp_li" :class="{'temp_active': item.isOpenArrow === true}" @click="openLeftArrow(index)">
                    <i :class="[item.isOpenArrow === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                    <span>{{item.cname}}</span>
                  </div>
                </div>
                <div class="child_temp" v-show="item.isOpenArrow === true">
                  <div class="temp_tab">
                    <span :class="[item.isSXT ? 'active_span' : '']" @click="changeLDeviceType(index, true)">摄像头</span>
                    <span :class="[!item.isSXT ? 'active_span' : '']" @click="changeLDeviceType(index, false)">卡口</span>
                  </div>
                  <ul class="child_temp_detail" v-show="item.isSXT">
                    <li v-for="(itm, idx) in item.deviceList" :key="'itm' + idx">
                      <el-checkbox v-model="itm.isChildChecked" @change="handleLeftChildChecked(index, idx, itm.isChildChecked, item.isSXT)"></el-checkbox>
                      <span>{{itm.deviceName}}</span>
                    </li>
                  </ul>
                  <ul class="child_temp_detail" v-show="!item.isSXT">
                    <li v-for="(itm, idx) in item.bayonetList" :key="'itm' + idx">
                      <el-checkbox v-model="itm.isChildChecked" @change="handleLeftChildChecked(index, idx, itm.isChildChecked, item.isSXT)"></el-checkbox>
                      <span>{{itm.deviceName}}</span>
                    </li>
                  </ul>
                </div>
              </li>
          </ul>
        </vue-scroll>
      </div>
    </div>
    <div class="select_map_right">
      <div class="select_map_right_title">
        <span>可选设备</span>
        <span>({{selectDeviceNumber}})</span>
      </div>
      <div id="mapMap"></div>
      <div class="right-flag">
        <ul class="map-rrt map_rrt_u1">
          <li :class="{'vl_icon_sed': selAreaAcitve}" @click="selArea">
            <i class="vl_icon vl_icon_041"></i>
            <span>选择区域</span>
          </li>
        </ul>
        <ul class="map-rrt">
          <li><i class="vl_icon vl_icon_control_23" @click="resetMap"></i></li>
        </ul>
        <ul class="map-rrt map_rrt_u2">
          <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
          <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
// import { testData } from './testData.js';
import { random14 } from '@/utils/util.js';
export default {
  props: [ 'selectDeviceList', 'selectDeviceNumber', 'leftDeviceNumber', 'currentDeviceList' ],
  data () {
    return {
      arrowActiveTemp: false,
      map: null, // 地图对象
      // 选择区域
      selAreaAcitve: false,
      mouseTool: null,
      selAreaAble: false,
      mapTypeList: ['sxt', 'kk'],
      mapTypeListAll: ['sxt', 'kk'],

      sxtList: [], // 摄像头
      sxtMapMarkers: [],
      kkList: [], // 卡口
      kkMapMarkers: [],

      finalDeviceList: [], // 最终选择的设备

      unCheckDeviceList: [] // 没有在多边形中的设备--没有选中的设备
    }
  },
  watch: {
    finalDeviceList (val) {
      console.log('val', val)
      let checkedDeviceList = [], // 选中的设备
        currentDeviceList = [], // 选中的设备经过处理后
        deviceList = [], bayonetList = [];

      let unCheckedDeviceList = [], // 没有选中的设备
        willRemoveDeviceList = [], // 没有选中的设备经过处理后
        unselectDeviceList = [], unselectBayonetList = [];

      let selectDeviceNumber = this.unCheckDeviceList.length;
      let checkedDeviceNumber = val.length;

      if (val && val.length > 0) {  // 多边形存在且在多边形中的设备
        val.map(item => {
          if (item.isSxt) { // 摄像头
            deviceList.push(item);
          } else {
            bayonetList.push(item);
          }
        });
        deviceList.map(item => {
          const params = {
            cname: item.parentName,
            uid: item.parentId,
            deviceList: [
              {
                uid: item.uid,
                deviceName: item.deviceName,
                isChildChecked: false,
                latitude: item.latitude,
                longitude: item.longitude
              }
            ]
          };
          checkedDeviceList.push(params);
        });
        bayonetList.map(item => {
          const params = {
            cname: item.parentName,
            uid: item.parentId,
            bayonetList: [
              {
                uid: item.uid,
                deviceName: item.deviceName,
                isChildChecked: false,
                latitude: item.latitude,
                longitude: item.longitude
              }
            ]
          };
          checkedDeviceList.push(params);
        });
        let deviceObj = {}, params = {};
        checkedDeviceList.forEach(item => {
          let a = checkedDeviceList.filter(c => {
            return item.uid === c.uid;
          })
          if (!deviceObj.hasOwnProperty(a[0].cname)) {
            deviceObj[a[0].cname] = a;
          }
        })
        for (let i in deviceObj) {
          let params = {
            cname: i,
            uid: deviceObj[i][0].uid,
            isOpenArrow: false,
            isChecked: false,
            isSXT: true,
            deviceList: [],
            bayonetList: []
          }
          deviceObj[i].forEach(item => {
            if (item.deviceList) {
              item.deviceList.map(val => {
                params.deviceList.push(val);
              })
            }
            if (item.bayonetList) {
              item.bayonetList.map(val => {
                params.bayonetList.push(val);
              })
            }
          })
          currentDeviceList.push(params);
        }
      }
      // 多边形存在但不在多边形中的设备
      if (this.unCheckDeviceList.length > 0) {
        this.unCheckDeviceList.map(item => {
          if (item.isSxt) { // 摄像头
            unselectDeviceList.push(item);
          } else {
            unselectBayonetList.push(item);
          }
        });
        unselectDeviceList.map(item => {
          const params = {
            cname: item.parentName,
            uid: item.parentId,
            deviceList: [
              {
                uid: item.uid,
                deviceName: item.deviceName,
                isChildChecked: false,
                latitude: item.latitude,
                longitude: item.longitude
              }
            ]
          };
          unCheckedDeviceList.push(params);
        });
        unselectBayonetList.map(item => {
          const params = {
            cname: item.parentName,
            uid: item.parentId,
            bayonetList: [
              {
                uid: item.uid,
                deviceName: item.deviceName,
                isChildChecked: false,
                latitude: item.latitude,
                longitude: item.longitude
              }
            ]
          };
          unCheckedDeviceList.push(params);
        });
        let deviceObj = {}, params = {};
        unCheckedDeviceList.forEach(item => {
          let a = unCheckedDeviceList.filter(c => {
            return item.uid === c.uid;
          })
          if (!deviceObj.hasOwnProperty(a[0].cname)) {
            deviceObj[a[0].cname] = a;
          }
        })
        for (let i in deviceObj) {
          let params = {
            cname: i,
            uid: deviceObj[i][0].uid,
            isOpenArrow: false,
            isSXT: true,
            isChecked: false,
            deviceList: [],
            bayonetList: []
          }
          deviceObj[i].forEach(item => {
            if (item.deviceList) {
              item.deviceList.map(val => {
                params.deviceList.push(val);
              })
            }
            if (item.bayonetList) {
              item.bayonetList.map(val => {
                params.bayonetList.push(val);
              })
            }
          })
          willRemoveDeviceList.push(params);
        }
      }
      this.$emit('emitFinalDevice', currentDeviceList, checkedDeviceNumber, willRemoveDeviceList, selectDeviceNumber);
    }
  },
  mounted () {
    this.initMap();
    this.getMapData();
  },
  methods: {
    initMap () {
      let _this = this;
      let map = new window.AMap.Map('mapMap', {
        zoom: 18, // 级别
        // center: [112.974691, 28.093846], // 中心点坐标
        center: [110.596015, 27.907662], // 中心点坐标
        // viewMode: '3D' // 使用3D视图
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.map = map;
      // 在地图中添加MouseTool插件
      let mouseTool = new window.AMap.MouseTool(map);
      _this.mouseTool = mouseTool;
      // 添加事件
      window.AMap.event.addListener(mouseTool, 'draw', function (e) { // 画
        setTimeout(() => {
          _this.selAreaRest(true);
          let polygon = new window.AMap.Polygon({ // 构造多边形对象
            map: map, // 地图对象
            strokeColor: '#FA453A', // 线条颜色
            strokeOpacity: 1, // 轮廓线透明度 [0,1]
            strokeWeight: 1, // 轮廓线宽度
            fillColor: '#FA453A', //多边形填充颜色
            fillOpacity: 0.2, // 多边形填充透明度
            path: e.obj.getPath(), // 多边形轮廓线的节点坐标数组
            zIndex: 12 // 多边形覆盖物的叠加顺序,级别高的在上层显示
          });
          _this.selAreaPolygon = polygon;
          _this.selAreaAble = true;
          _this.mapMarkHandler();
        }, 100);
      });
    },
    // 获取地图数据
    getMapData (obj) {
      setTimeout(() => {
        let selectDeviceList = [];
        if (obj && obj.length > 0) {
          selectDeviceList = obj;
        } else {
          selectDeviceList = this.selectDeviceList;
        }
        if (selectDeviceList && selectDeviceList.length > 0) {
          selectDeviceList.map(item => {
            item.deviceList.map(itm => {
              const params = {
                parentName: item.cname,
                parentId: item.uid,
                uid: itm.uid,
                isSxt: true, // 摄像头
                deviceName: itm.deviceName,
                isChildChecked: false,
                latitude: itm.latitude,
                longitude: itm.longitude
              }
              this.sxtList.push(params);
            });
            item.bayonetList.map(itm => {
              const params = {
                parentName: item.cname,
                parentId: item.uid,
                uid: itm.uid,
                isSxt: false, // 卡口
                deviceName: itm.deviceName,
                isChildChecked: false,
                latitude: itm.latitude,
                longitude: itm.longitude
              }
              this.kkList.push(params);
            })
          })
        }
        this.mapMarkHandler();
      }, 200);
    },
    // 地图标记处理
    mapMarkHandler () {
      // console.log(this.sxtList)
      // 摄像头
      this.mapClearMarkers(this.sxtMapMarkers);
      if (this.mapTypeList.indexOf('sxt') >= 0) {
        this.mapMark(this.sxtList, this.sxtMapMarkers, 'sxt');
      }
      // 卡口
      this.mapClearMarkers(this.kkMapMarkers);
      if (this.mapTypeList.indexOf('kk') >= 0) {
        this.mapMark(this.kkList, this.kkMapMarkers, 'kk');
      }
    },
    // 地图标记
    mapMark (data, aMarkers, keyWord) {
      if (data && data.length > 0) {
        let _this = this;
        for (let i = 0; i < data.length; i++) {
          let obj = data[i];
          obj.sid = keyWord + '_' + i + '_' + random14();
          if (obj.longitude > 0 && obj.latitude > 0) {
            let offSet = [-20.5, -48], selClass = '';
            if (_this.selAreaPolygon && !_this.selAreaPolygon.contains(new window.AMap.LngLat(obj.longitude, obj.latitude))) {
              // 多边形存在且不在多边形之中
              selClass = "vl_map_selarea_hide";
              this.unCheckDeviceList.push(obj); // 没有选中的设备
            }
            if (_this.selAreaPolygon && _this.selAreaPolygon.contains(new window.AMap.LngLat(obj.longitude, obj.latitude))) {
              _this.finalDeviceList.push(obj);
              console.log('obj', obj)
            }
            let marker = new window.AMap.Marker({ // 添加自定义点标记
              map: _this.map,
              // 110.601394, 27.909162
              position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
              // position: [110.601394, 27.909162], // 基点位置 [116.397428, 39.90923]
              offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: obj, // 用户自定义属性
              // 自定义点标记覆盖物内容
              content: '<div id="' + obj.sid + '" class="vl_icon vl_icon_' + keyWord + ' ' + selClass + '"></div>'
            });
            // myAMap.hoverMarkerHandler(map, marker, obj);
            if (!aMarkers) { aMarkers = []; }
            aMarkers.push(marker);
          }
        }
      }
    },
    // 清除所有
    resetTools () {
      this.selAreaRest();
      // this.markRest();
      // this.rangingRest();
    },
    // 清除地图标记
    mapClearMarkers (aMarkers) {
      if (this.map && aMarkers && aMarkers.length > 0) {
        this.map.remove(aMarkers);
        aMarkers = [];
      }
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
     // 重置地图
    resetMap () {
      this.initMap();
    },
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    // 左侧---子级多选框change
    handleLeftChildChecked (index, idx, val, isSxt) {
      this.$emit('emitLeftChildChecked', index, idx, val, isSxt);
    },
    // 左侧---展开左侧列表
    openLeftArrow (index) {
      this.$emit('emitOpenLeftArrow', index);
    },
    // 左侧--父级多选框
    handleLeftParentChecked (index, val) {
      this.$emit('emitLeftParentChecked', index, val);
    },
    // 切换摄像头和卡口----left
    changeLDeviceType (index, val) {
      this.$emit('emitChangeLDeviceType', index, val);
    },
    // 移除设备
    removeDevice () {
      let currDeviceList = JSON.parse(JSON.stringify(this.currentDeviceList));
      console.log('currDeviceList', currDeviceList)
      let checkedDeviceNumber = 0, selectDeviceNumber = 0, checkedDeviceList = [], params;
      if (currDeviceList && currDeviceList.length > 0) {
        for (let len = currDeviceList.length, i = len - 1; i >= 0; i --) {
           if (currDeviceList[i].isChecked === true) {
              checkedDeviceList.push(currDeviceList[i]);
              currDeviceList.splice(i, 1);
            } else {
              params = {
                cname: currDeviceList[i].cname,
                uid: currDeviceList[i].uid,
                isSXT: true,
                deviceList: [],
                bayonetList: []
              }
              for (let length = currDeviceList[i].deviceList.length, j = length - 1; j >= 0; j --) {
                if (currDeviceList[i].deviceList[j].isChildChecked == true) {
                  params.deviceList.push(currDeviceList[i].deviceList[j]);
                  currDeviceList[i].deviceList.splice(j, 1);
                }
              }
              for (let length = currDeviceList[i].bayonetList.length, j = length - 1; j >= 0; j --) {
                if (currDeviceList[i].bayonetList[j].isChildChecked == true) {
                  params.bayonetList.push(currDeviceList[i].bayonetList[j]);
                  currDeviceList[i].bayonetList.splice(j, 1);

                }
              }
              if (params.deviceList.length !== 0 || params.bayonetList.length !== 0) {
                checkedDeviceList.push(params);
              }
            }
        }
        if (currDeviceList && currDeviceList.length > 0) {
          currDeviceList.map(item => {
            checkedDeviceNumber += item.deviceList.length;
            checkedDeviceNumber += item.bayonetList.length;
            item.isChecked = false;
            item.isOpenArrow = false;
            item.deviceList.map(itm => {
              itm.isChildChecked = false;
            });
            item.bayonetList.map(itm => {
              itm.isChildChecked = false;
            });
          });
        }
        if (checkedDeviceList && checkedDeviceList.length > 0) {
          checkedDeviceList.map(item => {
            selectDeviceNumber += item.deviceList.length;
            selectDeviceNumber += item.bayonetList.length;
            item.isChecked = false;
            item.isOpenArrow = false;
            item.deviceList.map(itm => {
              itm.isChildChecked = false;
            });
             item.bayonetList.map(itm => {
              itm.isChildChecked = false;
            });
          });
        }
        // console.log('checkedDeviceList', this.checkedDeviceList)
        this.$emit('emitRemoveFinalDevice', currDeviceList, checkedDeviceNumber, checkedDeviceList, selectDeviceNumber);
        // this.getMapData(this.selectDeviceList);
      }
    },
  }
}
</script>
<style lang="scss">
.select_map_area{
  width: 100%;
  display: flex;
  height: 490px;
  .select_map_left{
    width: 300px;
    height: 100%;
    .select_top {
      display: flex;
      justify-content: space-between;
      height: 45px;
      line-height: 45px;
      padding: 0 10px;
      border-top: 1px solid #F2F2F2;
      border-bottom: 1px solid #F2F2F2;
      border-right: 1px solid #F2F2F2;
      >span {
        color: #333333;
      }
      >p {
        color: #B2B2B2;
        cursor: pointer;
      }
    }
    .detail_list {
      margin: 10px 10px;
      height: calc(100% - 60px);
      z-index: 0;
      .temp_detail_info {
        height: 100%;
        > li {
          width: auto;
          cursor: pointer;
          font-size: 14px;
          line-height: 26px;
          color: #333333;
          .parent_temp_li {
            width: 100%;
            padding: 0 10px;
            >span {
              margin-left: 5px;
            }
            .operation_btn {
              display: none;
              float: right;
              margin: 5px 5px 0;
            }
            .del_btn {
              &:hover {
                background-position: -694px -350px !important;
              }
            }
            .edit_btn {
              &:hover {
                background-position: -584px -350px !important;
              }
            }
            &.temp_active {
              &:hover {
                background-color: #E0F2FF;
                .operation_btn {
                  display: block;
                }
              }
              i, span {
                color: #0C70F8;
              }
            }
          }
          .child_temp {
            width: 100%;
            .temp_tab {
              color: #666666;
              margin: 10px 0 10px 20px;
              font-size: 12px;
              width: 220px;
              height: 26px;
              border: 1px solid #D3D3D3;
              border-radius:4px;
              > span {
                width: 50%;
                text-align: center;
                display: inline-block;
                line-height: 26px;
                height: 100%;
                &.active_span {
                  color: #0C70F8;
                  background-color: #E0F2FF;
                }
              }
              span:first-child {
                border-right: 1px solid #D3D3D3;
              }
            }
            .child_temp_detail {
              padding-left: 30px;
              padding-right: 10px;
              >li {
                padding-bottom: 10px;
                font-size: 14px;
                color: #666666;
                display: flex;
                align-items: center;
                >span {
                  margin: 0 80px 0 0;
                }
              }
            }
          }
        }
      }
    }
  } 
  .select_map_right {
    width: calc(100% - 300px);
    height: 100%;
    position: relative;
    .select_map_right_title {
      width: 100%;
      left: 0;
      top: 0;
      z-index: 1;
      background-color: #ffffff;
      position: absolute;
      color: #333333;
      height: 45px;
      line-height: 45px;
      padding: 0 5px;
      border-top: 1px solid #f2f2f2;
    }
    #mapMap {
      width: 100%;
      height: 100%;
    }
    .right-flag {
      position: absolute;
      right: 30px;
      bottom: 10px;
      transition: right .3s ease-out;
      animation: fadeInRight .4s ease-out .4s both;
      .map-rrt {
        margin-bottom: 20px;
        box-shadow: 0 0 10px rgba(148,148,148,0.24);
        >li {
          padding: 12px 5px;
          background-color: #ffffff;
          cursor: pointer;
          border-bottom: 1px solid #eee;
          text-align: center;
          >i {
            font-size: 20px;
            color: #0B6FF7;
          }
          >span {
            font-size: 12px;
          }
           &:last-child { border-bottom: 0; }
        }
      }
      .map_rrt_u1 {
        >li {
          display: flex;
          flex-direction: column;
          align-items: center;
          i {
            text-align: center;
            display: block;
          }
          span {
            text-align: center;
            display: block;
          }
        }
      }
    }
  }
  .el-checkbox {
    margin-right: 10px;
  }
}
</style>


