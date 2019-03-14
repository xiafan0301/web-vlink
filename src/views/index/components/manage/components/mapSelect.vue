<template>
  <div class="select_map_area" :class="{'vl_map_selarea_ctl': selAreaAble}">
    <div class="select_map_left">
      <div class="select_top">
        <span>已有设备 (12)</span>
        <p>移除设备</p>
      </div>
      <div class="detail_list">
        <vue-scroll>
          <ul class="temp_detail_info">
            <li>
              <div class="parent_temp_li" :class="{'temp_active': arrowActiveTemp === true}" @click="arrowActiveTemp = !arrowActiveTemp">
                <el-checkbox style="margin-right: 10px;"></el-checkbox>
                <i :class="[arrowActiveTemp === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                <span>重点场所</span>
                <i class="del_btn operation_btn vl_icon vl_icon_manage_8"></i>
                <i class="edit_btn operation_btn vl_icon vl_icon_manage_7"></i>
              </div>
              <div class="child_temp" v-show="arrowActiveTemp">
                <div class="temp_tab">
                  <span class="active_span">摄像头</span>
                  <span>卡口</span>
                </div>
                <ul class="child_temp_detail">
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div class="parent_temp_li" :class="{'temp_active': arrowActiveTemp === true}" @click="arrowActiveTemp = !arrowActiveTemp">
                <el-checkbox style="margin-right: 10px;"></el-checkbox>
                <i :class="[arrowActiveTemp === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                <span>重点场所</span>
                <i class="del_btn operation_btn vl_icon vl_icon_manage_8"></i>
                <i class="edit_btn operation_btn vl_icon vl_icon_manage_7"></i>
              </div>
              <div class="child_temp" v-show="arrowActiveTemp">
                <div class="temp_tab">
                  <span class="active_span">摄像头</span>
                  <span>卡口</span>
                </div>
                <ul class="child_temp_detail">
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div class="parent_temp_li" :class="{'temp_active': arrowActiveTemp === true}" @click="arrowActiveTemp = !arrowActiveTemp">
                <el-checkbox style="margin-right: 10px;"></el-checkbox>
                <i :class="[arrowActiveTemp === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                <span>重点场所</span>
                <i class="del_btn operation_btn vl_icon vl_icon_manage_8"></i>
                <i class="edit_btn operation_btn vl_icon vl_icon_manage_7"></i>
              </div>
              <div class="child_temp" v-show="arrowActiveTemp">
                <div class="temp_tab">
                  <span class="active_span">摄像头</span>
                  <span>卡口</span>
                </div>
                <ul class="child_temp_detail">
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </vue-scroll>
      </div>
    </div>
    <div class="select_map_right">
      <div id="mapMap"></div>
      <div class="right-flag">
        <ul class="map-rrt map_rrt_u1">
          <li :class="{'vl_icon_sed': selAreaAcitve}" @click="selArea">
            <i class="vl_icon vl_icon_041"></i>
            <span>选择区域</span>
          </li>
        </ul>
        <ul class="map-rrt">
          <li><i class="vl_icon vl_icon_control_23" @click="mapZoomSet(1)"></i></li>
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
import { testData } from './testData.js';
import { random14 } from '@/utils/util.js';
export default {
  data () {
    return {
      arrowActiveTemp: false,
      map: null, // 地图对象
      // 选择区域
      selAreaAcitve: false,
      mouseTool: null,
      selAreaAble: false,
      mapTypeList: ['sxt', 'kk', 'cl', 'ry'],
      mapTypeListAll: ['sxt', 'kk', 'cl', 'ry'],

      sxtList: [], // 摄像头
      sxtMapMarkers: [],
      kkList: [], // 卡口
      kkMapMarkers: [],
      clList: [], // 车辆
      clMapMarkers: [],
      ryList: [],  // 人员
      ryMapMarkers: [],
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
    window.AMap.event.addListener(mouseTool, 'draw', function (e) { // 画
      console.log('e', e)
      // _this.drawPaths = e.obj.getPath();
      console.log('drawPaths e', e); // 获取路径/范围
      console.log('drawPaths', e.obj.getPath()); // 获取路径/范围
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
        console.log(polygon);
        _this.selAreaPolygon = polygon;
        _this.selAreaAble = true;
        _this.mapMarkHandler();
      }, 100);
    });

    _this.getMapData();
  },
  methods: {
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    // 获取地图数据
    getMapData () {
      setTimeout(() => {
        this.sxtList = testData.sxt;
        this.kkList = testData.kakou;
        this.clList = testData.cheliang;
        this.ryList = testData.renyuan;
        this.mapMarkHandler();
      }, 200);
    },
    // 地图标记处理
    mapMarkHandler () {
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
      // 车辆
      this.mapClearMarkers(this.clMapMarkers);
      if (this.mapTypeList.indexOf('cl') >= 0) {
        this.mapMark(this.clList, this.clMapMarkers, 'cl');
      }
      // 人员
      this.mapClearMarkers(this.ryMapMarkers);
      if (this.mapTypeList.indexOf('ry') >= 0) {
        this.mapMark(this.ryList, this.ryMapMarkers, 'ry');
      }
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
              extData: obj, // 用户自定义属性
              // 自定义点标记覆盖物内容
              content: '<div id="' + obj.sid + '" class="vl_icon vl_icon_' + keyWord + ' ' + selClass + '"></div>'
            });
            console.log('marker', marker);
            // myAMap.hoverMarkerHandler(map, marker, obj);
            if (!aMarkers) { aMarkers = []; }
            aMarkers.push(marker);

            // 点击地图上的摄像头/卡口播放视频
            if (keyWord === 'sxt' || keyWord === 'kk') {
              marker.on('click', function () {
                _this.testAddSxt();
              });
            }
            // hover
            marker.on('mouseover', function () {
              let sContent = '<div class="vl_map_hover">' +
                '<div class="vl_map_hover_main">' + _this.mapHoverInfo(obj, keyWord) + '</div>';
              hoverWindow = new window.AMap.InfoWindow({ // 创建一个信息窗体对象
                isCustom: true, // 是否可以自定义内容
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
      if (type === 'sxt') {
        str += '<li><span>设备名称：</span>' + data.name + '</li>';
        str += '<li><span>设备地址：</span>' + data.addr + '</li>';
      } else if (type === 'kk') {
        str += '<li><span>卡口名称：</span>' + data.name + '</li>';
        str += '<li><span>设备地址：</span>' + data.addr + '</li>';
      } else if (type === 'cl') {
        str += '<li><span>车辆名称：</span>' + data.name + '</li>';
        str += '<li><span>设备地址：</span>' + data.addr + '</li>';
      } else if (type === 'ry') {
        str += '<li><span>人员名称：</span>' + data.name + '</li>';
        str += '<li><span>设备地址：</span>' + data.addr + '</li>';
        str += '<li style="text-align: center;">' +
            '<i class="vl_map_hover_btn hover_btn_voice">语音通话</i>' +
            '<i class="vl_map_hover_btn hover_btn_video">视频通话</i>' +
          '</li>';
      } else {
        str += '<li>未知数据</li>';
      }
      str += '</ul>';
      return str;
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
                  margin: 0 80px 0 15px;
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
    #mapMap {
      width: 100%;
      height: 100%;
    }
    .right-flag {
      position: absolute;
      right: 60px;
      bottom: 100px;
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
}
</style>


