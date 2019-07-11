<template>
  <div class="vid_relay">
    <div class="vid_relay_menu">
      <h2>行动轨迹</h2>
      <div>
        <ul>
          <li v-for="item in 100" :key="item" @click="selData(item)"
            :class="{'relay_mli_sed': item === sedData}">
            <div>
              <div>
                <span v-if="item < 100"></span>
                <i v-if="item < 100"></i>
              </div>
            </div>
            <ul>
              <li>设备名称设备名称设备名称设备名称设备名称</li>
              <li>18-11-25 09:12</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import {formatDate} from '@/utils/util.js';
export default {
  data () {
    return {
      sedData: null
    }
  },
  mounted () {
    $('title').text('接力地图');
  },
  methods: {
    selData (data) {
      this.sedData = data;
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
.vid_relay_menu {
  position: absolute; left: 0; top: 0;
  height: 100%; width: 272px;
  background:rgba(255,255,255,1);
  box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
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
      padding: 10px 0 20px 0;
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
            > span {
              position: absolute; top: -12px; left: -7px;
              width: 16px; height: 16px;
              border-radius:50%;
              background-color: #D3D3D3;
            }
            > i {
              position: absolute; bottom: -6px; left: -5px;
              height: 0; width: 6px;
              border-top: 6px solid #D3D3D3;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-bottom: 0;
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
          &:first-child { color: #0C70F8; }
        }
      }
    }
  }
}
</style>