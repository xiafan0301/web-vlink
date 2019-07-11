<template>
  <div class="vid_relay">
    <div class="vid_relay_menu" :class="{'vid_relay_menu_ss': !showMenuActive}">
      <h2>行动轨迹</h2>
      <div>
        <ul>
          <li v-for="(item, index) in listData" :key="'vrm_' + index" @click="selData(item)"
            :class="{'relay_mli_sed': item.uid === sedData.uid}">
            <div>
              <div :class="{'relay_mli_last': index >= (listData.length - 1)}">
                <span></span>
                <i v-if="index < (listData.length - 1)"></i>
              </div>
            </div>
            <ul>
              <li>{{item.name}}</li>
              <li>18-11-25 09:12</li>
            </ul>
          </li>
        </ul>
      </div>
      <span @click="showMenuActive = !showMenuActive;" class="vl_icon vid_icon_ssz" :class="{'vid_icon_sss': showMenuActive}"></span>
    </div>
    <div class="vid_relay_map" id="video_relay_map"></div>
  </div>
</template>
<script>
import {formatDate} from '@/utils/util.js';
import {mapXupuxian} from '@/config/config.js';
export default {
  data () {
    return {
      showMenuActive: true,
      sedData: {},
      listData: []
    }
  },
  created () {
    for (let i = 0; i < 20; i++) {
      this.listData.push({
        uid: i + 1,
        name: '测试接力地图数据-' + (i + 1),
        longitude: 110.594280 + (0.02 * i),
        latitude: 27.908490 + (0.0005 * i)
      });
    }
  },
  mounted () {
    $('title').text('接力地图');
    this.initMap();
  },
  methods: {
    initMap () {
      let _this = this;
      let _config = Object.assign({}, {
        zoom: 11,
        center: mapXupuxian.center,
        zooms: [2, 18]
      });
      // console.log('_config', _config)
      // 初始化地图
      let map = new window.AMap.Map('video_relay_map', _config);
      map.setMapStyle('amap://styles/light');
      // map.setMapStyle('amap://styles/a00b8c5653a6454dd8a6ec3b604ec50c');
      // console.log('_config', _config)
      _this.amap = map;
      this.setMarks();
    },
    selData (data) {
      this.sedData = data;
    },
    setMarks () {
      for (let i = 0; i < this.listData.length; i++) {
        let _d = this.listData[i];
        let sC = 'vl_icon_sxt';
        this.doMark([_d.longitude, _d.latitude],
          _d.deviceName, 'vl_icon ' + sC);
      }
    },
    doMark (lnglat, title, sClass) {
      // console.log('doMark', obj);
      let marker = new window.AMap.Marker({ // 添加自定义点标记
        map: this.amap,
        position: lnglat, // 基点位置 [116.397428, 39.90923]
        offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // extData: obj,
        // 自定义点标记覆盖物内容
        content: '<div title="' + title + '" class="map_icons ' + sClass + '"></div>'
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.vid_relay {
  position: relative;
  width: 100%; height: 100%;
  overflow: hidden;
}
.vid_relay_map {
  width: 100%; height: 100%;
}
.vid_relay_menu {
  position: absolute; left: 0; top: 0; z-index: 1000;
  height: 100%; width: 272px;
  background:rgba(255,255,255,1);
  box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
  transition: left .3s ease-out;
  > span {
    position: absolute; top: 50%; right: -30px;
    margin-top: -80px;
  }
  > h2 {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 50px; line-height: 50px;
    padding-left: 20px;
    font-size: 16px; font-weight: bold;
    border-bottom: 1px solid #D3D3D3;
  }
  > div {
    height: 100%;
    padding-top: 51px;
    > ul {
      height: 100%;
      padding: 15px 0 20px 0;
      overflow: auto;
      overflow-x: hidden;
      overflow-y: auto;
      > li {
        position: relative;
        height: 75px;
        > div {
          position: absolute; top: 0; left: 0;
          width: 56px; height: 100%;
          > div {
            position: absolute; top: 15px; left: 32px;
            width: 2px; height: 40px;
            background-color: #D3D3D3;
            transition: all .4s ease-out;
            &.relay_mli_last { background-color: #fff !important; }
            > span {
              position: absolute; top: -12px; left: -7px;
              width: 16px; height: 16px;
              border-radius:50%;
              background-color: #D3D3D3;
              transition: all .4s ease-out;
            }
            > i {
              position: absolute; bottom: -4px; left: -3px;
              height: 0; width: 4px;
              border-top: 4px solid #D3D3D3;
              border-left: 4px solid transparent;
              border-right: 4px solid transparent;
              border-bottom: 0;
              transition: all .4s ease-out;
            }
          }
        }
        > ul {
          padding-left: 60px; padding-right: 10px;
          > li {
            line-height: 20px;
            color: #999;
            cursor: default;
            &:last-child { padding-top: 2px; font-size: 12px; }
          }
        }
        &:hover {
          > ul {
            > li:first-child { color: #0C70F8; }
          }
        }
        &.relay_mli_sed {
          > div {
            > div {
              background-color: #0C70F8;
              > span {
                background-color: #0C70F8;
              }
              > i {
                border-top-color: #0C70F8;
              }
            }
          }
          > ul {
            > li:first-child { color: #0C70F8; }
          }
        }
      }
    }
  }
  &.vid_relay_menu_ss { left: -272px; }
}
</style>