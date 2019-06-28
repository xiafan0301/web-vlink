<template>
  <div class="vehicle_content">
    <div class="vc_gcck_bd" is="vehicleBreadcrumb" :oData="[{name: '过车查看'}]"></div>
    <div class="vc_gcck">
      <div class="vc_gcck_con">
        <div class="vc_gcck_l">
          <ul>
            <li :class="{'vc_gcck_lt_sed': showType === 1}" @click="changeShowType(1)">实时过车</li>
            <li :class="{'vc_gcck_lt_sed': showType === 2}" @click="changeShowType(2)">历史过车</li>
            <div :class="{'vc_gcck_lt_l2': showType === 2}"></div>
          </ul>
          <div v-show="showType === 1">
            <div class="gcck_ll_s">
              <el-input
                placeholder="搜索"
                size="small"
                @keyup.enter.native="getTreeList1()"
                v-model="searchVal1">
                <i slot="suffix" @click="getTreeList1()" class="el-input__icon el-icon-search" style="font-size: 20px;"></i>
              </el-input>
            </div>
            <div class="gcck_ll_l">
              <div>
                <div is="dbTree" @selectItem="selectItem" :likeKey="searchVal1" :doSearch="doSearch1"></div>
              </div>
            </div>
          </div>
          <div v-show="showType === 2">
            <div class="gcck_ll_s">
              <el-input
                placeholder="搜索"
                size="small"
                @keyup.enter.native="getTreeList2()"
                v-model="searchVal2">
                <i slot="suffix" @click="getTreeList2()" class="el-input__icon el-icon-search" style="font-size: 20px;"></i>
              </el-input>
            </div>
            <div class="gcck_ll_l">
              <div>
                <div is="dbTree" @selectItem="selectItem" :likeKey="searchVal2" :doSearch="doSearch2"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="vc_gcck_r">
          <ul v-if="videoTotal > 0" class="vc_gcck_rt" :class="'video_list_' + videoTotal">
            <li v-for="item in videoTotal" :key="'video_list_' + item">
              <div v-if="videoList[item - 1]">
                <div is="flvplayer" :oData="videoList[item - 1]" :bResize="bResize"
                  :oConfig="{sign: true, close: false}">
                </div>
              </div>
              <div v-else>
              </div>
            </li>
          </ul>
          <ul class="vc_gcck_rb">
            <li >
              <div class="vc_gcck_rbc">
                <p>今日告警</p>
                <h2>2354</h2>
                <el-button size="small" @click="goToZP">查看更多</el-button>
              </div>
            </li>
            <li v-for="item in 10" :key="item">
              <div class="vc_gcck_rbl">
                <img src="../../../../../assets/img/temp/video_pic.png" alt="">
                <div><i class="vl_icon gcck_sj"></i>18-12-24 14:12:17</div>
                <div><i class="vl_icon gcck_sxt"></i>环保路摄像头002</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vehicleBreadcrumb from '../breadcrumb.vue';
import flvplayer from '@/components/common/flvplayer.vue';
import dbTree from '@/components/common/dbTree.vue';
import {MapGETmonitorList} from '../../../api/api.map.js';
export default {
  components: {vehicleBreadcrumb, flvplayer, dbTree},
  data () {
    return {
      showType: 1, // 1实时过车  2历史过车
      videoTotal: 0, // 1 / 2 / 8
      videoList: [],
      searchVal1: '',
      searchVal2: '',
      doSearch1: {},
      doSearch2: {},
      treeList1: [],
      treeList2: [],
      bResize: {}
    }
  },
  mounted () {
  },
  methods: {
    goToZP () {
      this.$router.push({name: 'vehicle_search_gcck_zp'});
    },
    changeShowType (type) {
      if (type !== this.showType) {
        this.showType = type;
      }
    },

    selectItem (type, item) {
      console.log(type, item);
      if (type === 1) { // deviceName
        this.videoTotal = 1;
        this.videoList = [
          {
            type: 1,
            title: item.deviceName,
            record: false,
            video: Object.assign({}, item)
          }
        ]
      } else if (type === 2) {

      }
    },
    getTreeList1 () {
      this.doSearch1 = {};
    },
    getTreeList2 () {
      this.doSearch2 = {};
    },
  }
}
</script>
<style lang="scss" scoped>
.vc_gcck {
  height: 100%;
  padding-top: 50px;
  > .vc_gcck_con {
    height: 100%;
    position: relative;
    > .vc_gcck_l { 
      position: absolute; top: 0; left: 0;
      height: 100%; width: 272px;
      border-right: 1px solid #f6f6f6;
      box-shadow: 0 0 5px #ddd;
      background-color: #fff;
      > ul {
        position: absolute; top: 0; left: 0; z-index: 2;
        width: 100%;
        overflow: hidden;
        border-bottom: 1px solid #ddd;
        > li {
          width: 50%; height: 49px; line-height: 49px;
          float: left;
          text-align: center; color: #666;
          cursor: pointer;
          &.vc_gcck_lt_sed {
            cursor: default;
            color: #0C70F8;
          }
        }
        > div {
          position: absolute; left: 0; bottom: 0px;
          height: 2px; width: 50%;
          background-color: #0C70F8;
          transition: all .2s ease-out;
          &.vc_gcck_lt_l2 {
            left: 50%;
          }
        }
      }
      > div {
        position: relative;
        padding-top: 50px;
        height: 100%;
        overflow: hidden;
        > .gcck_ll_s {
          position: absolute; top: 50px; left: 0;
          width: 100%; height: 65px;
          padding: 15px 20px 0 15px;
        }
        > .gcck_ll_l {
          height: 100%;
          padding-top: 65px;
          > div {
            height: 100%;
            overflow: auto;
          }
        }
      }
    }
    > .vc_gcck_r {
      position: relative;
      height: 100%;
      margin-left: 273px; padding-bottom: 238px;
      > .vc_gcck_rt {
        height: 100%;
        padding: 5px 5px 0 5px;
        overflow: hidden;
        > li { 
          padding: 5px;
          > div { width: 100%; height: 100%; }
        }
        &.video_list_1 {
          > li { width: 60%; height: 100%; margin: 0 auto; }
        }
        &.video_list_2 {
          > li { float: left; width: 50%; height: 100%; }
        }
        &.video_list_8 {
          > li { float: left; width: 25%; height: 50%; }
        }
        &.video_list_32 {
          > li { float: left; width: 12.5%; height: 25%; }
        }
      }
      > .vc_gcck_rb {
        position: absolute; bottom: 0; left: 0;
        width: 100%; height: 238px;
        overflow: hidden;
        padding: 5px;
        > li {
          float: left;
          height: 228px;
          padding: 5px;
          > div {
            width: 152px; height: 218px;
            background-color: #fff;
            box-shadow:0px -2px 5px 0px rgba(131,131,131,0.28);
            text-align: center;
            &.vc_gcck_rbc {
              > p {
                color: #666;
                padding: 50px 0 10px 0;
              }
              > h2 {
                color: #0C70F8; font-size: 24px; font-weight: bold;
                padding-bottom: 20px;
              }
            }
            &.vc_gcck_rbl {
              width: 162px;
              padding: 10px;
              > img {
                width: 142px; height: 142px;
                margin-bottom: 5px;
              }
              > div {
                position: relative;
                text-align: left;
                padding-left: 18px;
                color: #999; font-size: 12px;
                height: 22px; line-height: 22px;
                > i {
                  position: absolute; top: 3px; left: 0;
                  width: 12px; height: 15px;
                  &.gcck_sxt { background-position: -325px -377px; }
                  &.gcck_sj { background-position: -787px -376px; }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>