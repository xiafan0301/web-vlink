<template>
  <div class="select_map_area">
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
                <i class="operation_btn vl_icon vl_icon_manage_8"></i>
                <i class="operation_btn vl_icon vl_icon_manage_7"></i>
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
                <i class="operation_btn vl_icon vl_icon_manage_8"></i>
                <i class="operation_btn vl_icon vl_icon_manage_7"></i>
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
                <i class="operation_btn vl_icon vl_icon_manage_8"></i>
                <i class="operation_btn vl_icon vl_icon_manage_7"></i>
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
export default {
  data () {
    return {
      arrowActiveTemp: false,
      selAreaAcitve: false,
      map: null, // 地图对象
      // 选择区域
      mouseTool: null,
    }
  },
  mounted () {
    let _this = this;
    let map = new window.AMap.Map('mapMap', {
      zoom: 16, // 级别
      center: [112.974691, 28.093846], // 中心点坐标
      // viewMode: '3D' // 使用3D视图
    });
    map.setMapStyle('amap://styles/whitesmoke');
    _this.map = map;
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
        /* for (let j = 0; j < _this.sxtList.length; j++) {
          let _o = _this.sxtList[j];
          if (_o.longitude > 0 && _o.latitude > 0) {
            if (polygon.contains(new window.AMap.LngLat(_o.longitude, _o.latitude))) {
              console.log('============' + _o.sid);
            }

          }
        } */
      }, 100);
    });
    this.mapMark();
  },
  methods: {
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    // 地图标记
    mapMark () {
      let _this = this;
      _this.map.clearMap();
      let content = '';
      let hoverWindow = null;
      // for (let i = 0; i < data.length; i++) {
        // let obj = data[i];
        // obj.sid = obj.name + '_' + i + '_' + random14();
        // let content = '';
        // if (obj.controlList[0].alarmRank === '五级') {
        //   content = '<div id="' + obj.sid + '" class="vl_icon vl_icon_target"><div class="vl_icon_warning">发现可疑目标</div></div>';
        // } else {
          content = '<div class="vl_icon vl_icon_click"></div>';
        // }
        // if (obj.longitude > 0 && obj.latitude > 0) {
          let offSet = [-20.5, -48];
          let marker = new window.AMap.Marker({ // 添加自定义点标记
            map: _this.map,
            position: [112.980377, 28.100175],
            offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            // 自定义点标记覆盖物内容
            content: content
          });
          marker.setMap(_this.map);
          // hover
          marker.on('mouseover', function () {
            let sContent = '<div class="vl_map_hover">' +
              '<div class="vl_map_hover_main"><p class="vl_map_hover_main_p">事发地点：阿萨大</p></div>';
            hoverWindow = new window.AMap.InfoWindow({
              isCustom: true,
              closeWhenClickMap: true,
              offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
              content: sContent
            });
            // aCenter = mEvent.target.F.position
            hoverWindow.open(_this.map, new window.AMap.LngLat(112.980377, 28.100175));
            hoverWindow.on('close', function () {
              // console.log('infoWindow close')
            });
          });
          marker.on('mouseout', function () {
            if (hoverWindow) { hoverWindow.close(); }
          });
        // }
      // }
    },
    // 选择区域
    selArea () {
      if (this.selAreaAcitve) {
        // this.resetTools();
        return false;
      }
      // this.resetTools();
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
      bottom: 130px;
      transition: right .3s ease-out;
      animation: fadeInRight .4s ease-out .4s both;
      .map-rrt {
        background-color: #fff;
        box-shadow: 0 0 10px rgba(148,148,148,0.24);
        >li {
          padding: 15px 5px;
          cursor: pointer;
          border-bottom: 1px solid #eee;
          text-align: center;
          >i {
            font-size: 20px;
            color: #0B6FF7;
          }
          &:last-child { border-bottom: 0; }
        }
      }
      .map_rrt_u1 {
        margin-bottom: 20px;
        >li {
          cursor: pointer;
          text-align: center;
          i {
            margin: 6px auto 0 auto;
            text-align: center;
            display: block;
          }
          span {
            text-align: center;
            display: block;
          }
        }
      }
      .map_rrt_u2 {
        margin-top: 20px;
      }
    }
  }
}
</style>


