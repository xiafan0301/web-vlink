<template>
<vue-scroll>
  <div class="machine_detail">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manage/archivesManage/machineGear'}">档案管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/archivesManage/machineGear'}">一机一档</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="basic_info">
      <div class="status_img">
        <i class="vl_icon vl_icon_archives_1"></i>
      </div>
      <div class="header member_header">
        <span>基本信息</span>
        <p>
          创建于2018-12-12 12:12:12；
          最近更新于2018-12-12 12:12:12
        </p>
      </div>
      <div class="divide"></div>
      <ul class="detail_info">
        <li>
          <span>摄像头编码:</span>
          <span>2018121212121</span>
        </li>
        <li>
          <span>所属单位:</span>
          <span>见风使舵看风景</span>
        </li>
        <li>
          <span>摄像头编号:</span>
          <span>123</span>
        </li>
        <li>
          <span>摄像头类型:</span>
          <span>球机</span>
        </li>
        <li>
          <span>厂商:</span>
          <span>XXXXXXXXXXXX单位</span>
        </li>
        <li>
          <span>摄像头序列号:</span>
          <span>ASJIF20190422192849</span>
        </li>
        <li>
          <span>最大像素:</span>
          <span>2000万</span>
        </li>
        <li>
          <span>智能特性:</span>
          <span>人脸识别；红外感光；人脸识别；红外感光；人脸识别；红外感光</span>
        </li>
        <li>
          <span>IP:</span>
          <span>201.120.12.34</span>
        </li>
        <li>
          <span>重要级别:</span>
          <span>关键点位</span>
        </li>
      </ul>
    </div>
    <div class="location_info">
      <div class="header">
        <span>地理位置</span>
      </div>
      <div class="divide"></div>
      <div class="map_content">
        <div id="mapBox"></div>
        <div class="right-flag">
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
    <div class="operation-footer">
      <el-button class="operation_btn function_btn"  @click="skipSelectPage">查看监控</el-button>
      <el-button class="operation_btn back_btn" @click="back">返回</el-button>
    </div>
  </div>
</vue-scroll>
</template>
<script>
export default {
  data () {
    return {
      map: null, // 地图对象
      detailInfo: {
        eventAddress: '溆浦县第一中学',
        latitude: 27.906875,
        longitude: 110.609392
      }
    }
  },
  mounted () {
    this.initMap();
  },
  methods: {
    // 重置地图
    resetMap () {
      this.initMap();
    },
    // 地图放大缩小
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    // 初始化地图
    initMap () {
      let _this = this;
      // _this.resetMap();
      let map = new window.AMap.Map('mapBox', {
        zoom: 16, // 级别
        center: [110.596015, 27.907662], // 中心点坐标[110.596015, 27.907662]
      });
      map.setMapStyle('amap://styles/whitesmoke');
      _this.map = map;

      _this.mapMark( _this.detailInfo);
      // map.on('click', function(e) {
        
      //   new window.AMap.service('AMap.Geocoder', function () { // 回调函数
      //     let geocoder = null;
      //     geocoder = new window.AMap.Geocoder({});
      //     const lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];//地图上所标点的坐标

      //     geocoder.getAddress(lnglatXY, function (status, result) {
      //       console.log('result', result)
      //       if (status === 'complete' && result.info === 'OK') {
      //         _this.mapMark( _this.detailInfo);
      //       }
      //     });
      //   });
      // });
    },
    // 地图标记
    mapMark (obj) {
      console.log(obj)
      let _this = this;
      
      // _this.map.clearMap();
      let hoverWindow = null;
      if (obj.longitude > 0 && obj.latitude > 0) {
        console.log('nnnnnn')
        let offSet = [-20.5, -48];
        let marker = new window.AMap.Marker({ // 添加自定义点标记
          map: _this.map,
          position: [obj.longitude, obj.latitude],
          offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: '<div class="vl_icon vl_icon_control_30"></div>'
        });
        marker.setMap(_this.map);
        _this.newMarker = marker;
        // hover
        marker.on('mouseover', function () {
          let sContent = '<div class="vl_map_hover machine_map_hover" >' +
            '<div class="vl_main_hover_address" style="min-width: 380px;padding: 10px 70px 10px 10px">'
            +'<p class="vl_map_hover_main_p">事发地点： ' + obj.eventAddress + '</p><p class="vl_map_hover_main_p">经纬度：经度' + obj.longitude + '；纬度：' + obj.latitude +'</p></div></div>';
          hoverWindow = new window.AMap.InfoWindow({
            isCustom: true,
            closeWhenClickMap: true,
            offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
            content: sContent
          });
          // aCenter = mEvent.target.F.position
          hoverWindow.open(_this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
        });
        marker.on('mouseout', function () {
          if (hoverWindow) { hoverWindow.close(); }
        });
        _this.map.setCenter([obj.longitude, obj.latitude]); // 根据经纬度重新设置地图中心点

      }
    },
    // 跳至查看监控页面
    skipSelectPage () {},
    // 返回
    back () {
      this.$router.back(-1);
    }
  }
}
</script>

<style lang="scss" scoped>
.machine_detail {
  margin-bottom: 80px;
  .location_info {
    height: 550px;
    // margin-bottom: 100px;
    padding-bottom: 60px;
    .map_content {
      border:1px solid rgba(211,211,211,1);
      border-radius:4px 4px 0px 0px;
      width: 98%;
      height: 98%;
      margin: 1%;
      #mapBox {
        width: 100%;
        height: 100%;
      }
      .right-flag {
        position: absolute; right: 40px; bottom: 40px;
        height: 220px;
        transition: right .3s ease-out;
        animation: fadeInRight .4s ease-out .4s both;
        .map-rrt {
          padding: 0 10px;
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
        .map_rrt_u2 {
          margin-top: 20px;
        }
      }
    }
  }
  .basic_info, .location_info {
    margin: 10px;
    position: relative;
    background-color: #ffffff;
    margin-bottom: 20px;
    box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    .status_img {
      position: absolute;
      right: 0;
      top: 40px;
    }
    .header {
      > span {
        display: inline-block;
        padding: 10px;
        color: #333333;
        font-weight: 600;
        font-size: 16px;
      }
    }
    .member_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      >p {
        margin-right: 10px;
        color:#999999;
      }
    }
    .divide {
      width: 100%;
      height: 1px;
      background-color: #F2F2F2;
    }
    .detail_info {
      width: 100%;
      // clear: both;
      display: flex;
      padding: 10px 90px 0 0;
      flex-wrap: wrap;
      >li {
        width: 25%;
        // float: left;
        height: 33px;
        // line-height: 30px;
        display: flex;
        span:first-child {
          display: inline-block;
          color: #666666;
          width: 100px;
          text-align: right;
          margin-right: 10px;
        }
        span:last-child {
          width: calc(100% - 90px);
          color: #333333;
        }
      }
    }
    
  }
  .operation-footer {
    border-left: 1px solid #F2F2F2;
    width: 100%;
    height: 65px;
    line-height: 65px;
    position: fixed;
    bottom: 0;
    background: #ffffff;
    padding-left: 20px;
    .operation_btn {
      padding: 0;
      width: 100px;
      height: 40px;
      text-align: center;
    }
    .function_btn {
      background: #0C70F8;
      color: #ffffff;
    }
    .back_btn {
      background: #ffffff;
      border: 1px solid #DDDDDD;
      color: #666666;
    }
  }
}
</style>

