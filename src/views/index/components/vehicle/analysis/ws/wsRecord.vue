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
    <!-- <div class="tip_box">
      <div class="select_target">
        <p class="select_p">查询目标</p>
          <img src="../../../../../../assets/img/temp/vis-eg.png" alt="">
          <div class="mongolia">
            <span>2018-12-12: 12:32:12</span>
            <i class="vl_icon vl_icon_control_09"></i>
          </div>
      </div>
      <div class="tail_vehicle">
        <p class="tail_p">尾随车辆</p>
          <img src="../../../../../../assets/img/temp/vis-eg.png" alt="">
        <div class="mongolia">
          <span>2018-12-12: 12:32:12</span>
          <i class="vl_icon vl_icon_control_09"></i>
        </div>
      </div>
      <div class="divide"></div>
      <div class="device_name">抓拍设备名称抓拍设备名称设备名称设备名称设备名称1214</div>
    </div> -->
  </div>
</template>
<script>
import { testData } from './testData.js';
export default {
  data () {
    return {
      map: null,
      testData: testData,
      marker: {},
    }
  },
  mounted () {
    this.initMap();
  },
  methods: {
    // 初始化地图
    initMap () {
      let _this = this;
      let map = new window.AMap.Map('rightMap', {
        zoom: 18, // 级别
        center: [110.596015, 27.907662], // 中心点坐标[110.596015, 27.907662]
      });
      map.setMapStyle('amap://styles/whitesmoke');

      _this.map = map;
      
      setTimeout(() => {

        _this.mapMark(this.testData)
      }, 1000)
    },
    mapMark (data) {
      if (data && data.length > 0) {
        let _this = this, hoverWindow = null, path= [];
        for (let i = 0; i < data.length; i++) {
          let obj = data[i];
          if (obj.longitude > 0 && obj.latitude > 0) {
            let offSet = [-20.5, -55];
            let marker = new window.AMap.Marker({
              map: _this.map,
              position: [obj.longitude, obj.latitude],
              offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: '', // 用户自定义属性
              // 自定义点标记覆盖物内容
              content: '<div id="vehicle' + obj.id + '"  title="'+ obj.deviceName +'" class="vl_icon vl_icon_sxt"></div>'
            });
  
           path.push(new window.AMap.LngLat(obj.longitude, obj.latitude));

           marker.on('mouseover', function () {
             $('#vehicle' + obj.id).addClass('vl_icon_map_hover_mark0');

             let sContent = "<div class='tip_box'><div class='select_target'><p class='select_p'>查询目标</p>"
                  +"<img src='../../../../../../assets/img/temp/vis-eg.png' /><div class='mongolia'>"
                  +"<span>2018-12-12: 12:32:12</span><i class='vl_icon vl_icon_control_09'></i></div></div>"
                  +"<div class='tail_vehicle'><p class='tail_p'>尾随车辆</p><img src='../../../../../../assets/img/temp/vis-eg.png' />"
                  +"<div class='mongolia'><span>2018-12-12: 12:32:12</span><i class='vl_icon vl_icon_control_09'></i></div></div>"
                  +"<div class='divide'></div><div class='device_name'>抓拍设备名称抓拍设备名称设备名称设备名称设备名称1214</div></div>";

              hoverWindow = new window.AMap.InfoWindow({
                isCustom: true,
                closeWhenClickMap: true,
                offset: new window.AMap.Pixel(180, 180), // 相对于基点的偏移位置
                content: sContent
              });
              hoverWindow.open(_this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
           });
            marker.on('mouseout', function () {
              $('#vehicle' + obj.id).removeClass('vl_icon_map_hover_mark0');
              // if (hoverWindow) { hoverWindow.close(); }
            });
          }
        }
        // 绘制线条
        let polyline = new window.AMap.Polyline({
          path: path,
          strokeWeight: 4,
          strokeColor: '#61C772',
          strokeStyle: 'dashed'
        });

        _this.map.add(polyline);

      }
    },
  }
}
</script>
<style lang="scss">
.tip_box {
  // position: absolute;

  width: 258px;
  height: 361px;
  padding: 20px;
  background:rgba(255,255,255,1);
  box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
  .select_target, .tail_vehicle {
    width:218px;
    height:122px;
    margin-bottom: 15px;
    position: relative;
    >p {
      left: 0;
      top: 0;
      position: absolute;
      width:68px;
      height:20px;
      border-radius:0px 10px 10px 0px;
      color: #ffffff;
    }
    .select_p {
      background:rgba(12,112,248,1);
    }
    .tail_p {
      background-color: #50CC62;
    }
    .mongolia {
      width: 100%;
      // height: 26px;
      padding: 5px 0;
      display: flex;
      justify-content: space-between;
      position: absolute;
      background:rgba(0,0,0,1);
      opacity:0.7;
      bottom: 0;
      left: 0;
      align-items: center;
      font-size: 12px;
      color: #fff;
      >span {
        margin-left: 5px;
      }
      > i {
        margin-right: 5px;
        cursor: pointer;
      }
    }
    // .img_box {
      >img {
        width: 100%;
        height: 100%;
      }
    // }
  }
  .divide {
    height:1px;
    margin-bottom: 15px;
    border-bottom: 1px solid #F2F2F2;
    box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
  }
  .device_name {
    color: #666666;
  }
}
</style>

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
// .tip_box {
//   z-index: 4444;
//   position: absolute;
//   left: 500px;
//   top: 300px;
//   width:258px;
//   height:361px;
//   padding: 20px;
//   background:rgba(255,255,255,1);
//   box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
//   .select_target, .tail_vehicle {
//     width:218px;
//     height:122px;
//     margin-bottom: 15px;
//     position: relative;
//     >p {
//       left: 0;
//       top: 0;
//       position: absolute;
//       width:68px;
//       height:20px;
//       border-radius:0px 10px 10px 0px;
//       color: #ffffff;
//     }
//     .select_p {
//       background:rgba(12,112,248,1);
//     }
//     .tail_p {
//       background-color: #50CC62;
//     }
//     .mongolia {
//       width: 100%;
//       // height: 26px;
//       padding: 5px 0;
//       display: flex;
//       justify-content: space-between;
//       position: absolute;
//       background:rgba(0,0,0,1);
//       opacity:0.7;
//       bottom: 0;
//       left: 0;
//       align-items: center;
//       font-size: 12px;
//       color: #fff;
//       >span {
//         margin-left: 5px;
//       }
//       > i {
//         margin-right: 5px;
//         cursor: pointer;
//       }
//     }
//     // .img_box {
//       >img {
//         width: 100%;
//         height: 100%;
//       }
//     // }
//   }
//   .divide {
//     height:1px;
//     margin-bottom: 15px;
//     border-bottom: 1px solid #F2F2F2;
//     box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
//   }
//   .device_name {
//     color: #666666;
//   }
// }
</style>
