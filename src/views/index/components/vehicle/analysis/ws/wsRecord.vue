<template>
  <div class="ws_record">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/vehicle/ws' }">尾随分析</el-breadcrumb-item>
        <el-breadcrumb-item>尾随记录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_box">
      <div class="left">
        <h2>湘A10987</h2>
        <ul>
          <li>
            <span>归属地：</span>
            <span>长沙</span>
          </li>
          <li>
            <span>中文品牌：</span>
            <span>雪佛兰科鲁兹</span>
          </li>
          <li>
            <span>车身颜色：</span>
            <span>红色</span>
          </li>
          <li>
            <span>机动车状态：</span>
            <span>正常</span>
          </li>
          <li>
            <span>所有人：</span>
            <span>你猜咯</span>
          </li>
          <li>
            <span>身份证号：</span>
            <span>430322199709831112</span>
          </li>
          <li>
            <span>核定载客：</span>
            <span>123人</span>
          </li>
          <li>
            <span>有效期：</span>
            <span>2020-12-12</span>
          </li>
          <li>
            <span>车辆登记照片：</span>
            <span>
              <img src="../../../../../../assets/img/temp/vis-eg.png" alt="">
            </span>
          </li>
        </ul>
      </div>
      <div class="right">
        <div class="operation_box">
          <p>查看违章记录</p>
          <p>车辆布控</p>
          <p>轨迹分析</p>
          <p>落脚点分析</p>
          <p>一车搜车</p>
        </div>
        <div id="rightMap"></div>
      </div>
    </div>
  </div>
</template>
<script>
import testData from './testData.js';
export default {
  data () {
    return {
      map: null
    }
  },
  mounted () {
    this.initMap();
  },
  methods: {
    // 初始化地图
    initMap () {
      let _this = this;
      _this.isShowMap = true;
      let map = new window.AMap.Map('rightMap', {
        zoom: 16, // 级别
        center: [110.596015, 27.907662], // 中心点坐标[110.596015, 27.907662]
      });
      map.setMapStyle('amap://styles/whitesmoke');

      // map.on('click', function(e) {
        
      //   new window.AMap.service('AMap.Geocoder', function () { // 回调函数
      //     let geocoder = null;
      //     geocoder = new window.AMap.Geocoder({});

      //     const lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];//地图上所标点的坐标

      //     geocoder.getAddress(lnglatXY, function (status, result) {
      //       if (status === 'complete' && result.info === 'OK') {
            
      //       }
      //     });
      //   });
      // });
      _this.map = map;

    },
    mapMark (data) {
      for (let i = 0; i < data.length; i++) {
        let obj = data[i];
        if (obj.longitude > 0 && obj.latitude > 0) {
          
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.ws_record {
  height: 100%;
  .breadcrumb_heaer {
    background-color: #ffffff;
    border-bottom:1px solid #D3D3D3;
  }
  .content_box {
    display: flex;
    height: calc(100% - 55px);
    .left {
      width: 272px;
      background-color: #ffffff;
      box-shadow:2px 3px 10px 0px rgba(131,131,131,0.28);
      padding: 20px;
      >h2 {
        color: #222222;
        font-weight: bold;
        font-size: 18px;
      }
      >ul {
        margin-top: 15px;
        >li {
          line-height: 30px;
          span:first-child {
            color: #666666;
          }
          span:last-child {
            color: #222222;
            img {
              width:60px;
              height:60px;
              border-radius:2px;
              vertical-align: text-top;
            }
          }
        }
      }
    }
    .right {
      width: calc(100% - 272px);
      height: 100%;
      position: relative;
      .operation_box {
        width: 100%;
        top: 0;
        left: 0;
        position: absolute;
        height: 60px;
        box-shadow:2px 3px 10px 0px rgba(131,131,131,0.28);
        background-color: #ffffff;
        display: flex;
        align-items: center;
        padding-left:15px;
        z-index: 1111;
        >p {
          width:130px;
          height:40px;
          line-height: 40px;
          margin-right: 15px;
          cursor: pointer;
          background:rgba(246,248,249,1);
          border:1px solid rgba(211,211,211,1);
          border-radius:4px;
          color: #666666;
          font-size: 16px;
          text-align: center;
          &:hover {
            background:linear-gradient(90deg,rgba(8,106,234,1) 0%,rgba(4,102,222,1) 100%);
            color: #ffffff;
          }
        }
      }
      #rightMap {
        z-index: 1000;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
