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
    <ul class="vid_relay_list">
      <li class="relay_list_fst">
        <div class="relay_list_fst">
          <p class="relay_list_fst_t">目标对象</p>
          <div class="relay_list_fst_i">
            <img src="../../../../assets/img/666.jpg" alt="">
          </div>
          <div class="relay_list_fst_b">抓拍图片<span>{{123123 | fmTenThousand}}</span></div>
        </div>
      </li>
      <li v-for="item in 10" :key="item">
        <div class="relay_list_li">
          <div class="relay_list_li_i">
            <img src="../../../../assets/img/666.jpg" alt="">
          </div>
          <div class="relay_list_li_d"><i class="vl_icon vl_icon_sm_sj"></i>18-12-24 14:12:17</div>
          <div class="relay_list_li_d"><i class="vl_icon vl_icon_sm_sxt"></i>环保路摄像头002</div>
        </div>
      </li>
    </ul>
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
        longitude: 110.394280 + (0.03 * i),
        latitude: 27.708490 + (0.02 * i)
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
      $('.vid_relay_marker_mk').removeClass('relay_marker_mk_sed');
      $('#relay_marker_' + data.uid).addClass('relay_marker_mk_sed');
    },
    setMarks () {
      let gjPath = [];
      for (let i = 0; i < this.listData.length; i++) {
        let _d = this.listData[i];
        let marker = new window.AMap.Marker({ // 添加自定义点标记
          map: this.amap,
          position: [_d.longitude, _d.latitude], // 基点位置 [116.397428, 39.90923]
          offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          extData: _d,
          // 自定义点标记覆盖物内容 vl_icon_map_car0 vl_icon_sxt_dis
          content: '<div id="relay_marker_' + _d.uid + '" title="' + _d.name + '"' +
            ' class="vid_relay_marker_mk">' +
            '<span class="vl_icon vl_icon_sxt_dis"></span>' +
            '<span class="vl_icon vl_icon_map_hover_mark0"></span>' +
            '</div>'
        });
        gjPath.push([_d.longitude, _d.latitude]);
      }
      // 绘制轨迹
      var polyline = new window.AMap.Polyline({
        map: this.amap,
        showDir: true,
        path: gjPath,
        strokeColor: "#61c772",  // 线颜色
        strokeOpacity: 1,     // 线透明度
        strokeWeight: 10,      // 线宽
        strokeStyle: "solid"  // 线样式 dashed solid
      });
      this.amap.setFitView();
    },
    doMark (obj, sClass) {
      // console.log('doMark', obj);
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
.vid_relay_list {
  position: absolute; bottom: 0px; left: 265px;
  padding: 5px;
  overflow: hidden;
  height: 238px; overflow: hidden;
  > li {
    float: left;
    padding: 5px;
    > div {
      width:153px; height:218px;
      background-color: #fff;
      box-shadow:0px -4px 10px 0px rgba(131,131,131,0.28);
      &.relay_list_fst {
        > .relay_list_fst_t {
          padding: 15px 0 10px 20px;
          font-size: 14px; color: #666;
        }
        > .relay_list_fst_i {
          width: 100px; height: 100px;
          margin: 0 auto;
          > img  { width: 100%; height: 100%; }
        }
        > .relay_list_fst_b {
          border-top: 1px solid #D3D3D3;
          padding-top: 10px; margin-top: 20px;
          text-align: center;
          font-size: 14px; color: #666;
          > span { font-size: 20px; color: #0769E7; font-weight: bold; }
        }
      }
      &.relay_list_li {
        > .relay_list_li_i {
          width: 130px; height: 147px;
          margin: 0 auto; padding-top: 12px; padding-bottom: 5px;
          > img  { width: 100%; height: 100%; }
        }
        > .relay_list_li_d {
          font-size: 12px; color: #999;
          padding-left: 10px; margin-top: 7px;
          height: 20px; line-height: 20px;
          > i { position: relative; top: 2px; margin-right: 5px; }
        }
      }
    }
  }
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
<style lang="scss">
.vid_relay_marker_mk {
  position: relative;
  width: 41px; height: 48px;
  > .vl_icon_sxt_dis {
    width: 100%; height: 100%;
  }
  > .vl_icon_map_hover_mark0 {
    display: none;
    position: absolute; bottom: 0; left: -2px;
  }
  &.relay_marker_mk_sed {
    > .vl_icon_sxt_dis {
      display: none;
    }
    > .vl_icon_map_hover_mark0 {
      display: block;
    }
  }
}
</style>