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
        <div class="vc_gcck_r" v-if="videoTotal !== null && videoTotal > 0">
          <ul class="vc_gcck_rt" :class="'video_list_' + videoTotal">
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
                <p>今日抓拍</p>
                <h2>{{zpTotal}}</h2>
                <el-button size="small" @click="goToZP">查看更多</el-button>
              </div>
            </li>
            <li v-for="(item, index) in zpList" :key="'jrzp_' + index">
              <div class="vc_gcck_rbl">
                <p>
                  <img :title="item.deviceName" :alt="item.deviceName" :src="item.imagePath">
                </p>
                <div class="com_ellipsis"><i class="vl_icon gcck_sj"></i>{{item.snapTime}}</div>
                <div class="com_ellipsis"><i class="vl_icon gcck_sxt"></i>{{item.deviceName}}</div>
              </div>
            </li>
          </ul>
        </div>
        <div class="vc_gcck_r" v-else-if="videoTotal === 0">
          <p class="vc_gcck_r_empty">暂无设备，请更换摄像头或卡口</p>
        </div>
        <div class="vc_gcck_r" v-else>
          <p class="vc_gcck_r_empty">选择左侧的摄像头或卡口进行查看</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vehicleBreadcrumb from '../breadcrumb.vue';
import flvplayer from '@/components/common/flvplayer.vue';
import dbTree from '@/components/common/dbTree.vue';
import {getDeviceByBayonetUid} from '../../../api/api.base.js';
import {MapGETmonitorList} from '../../../api/api.map.js';
import {getDeviceSnapImagesSum, getDeviceSnapImagesPage} from '../../../api/api.judge.js';
import {formatDate} from '@/utils/util.js';
export default {
  components: {vehicleBreadcrumb, flvplayer, dbTree},
  data () {
    return {
      showType: 1, // 1实时过车  2历史过车
      videoTotal: null, // 1 / 2 / 8
      videoList: [],
      searchVal1: '',
      searchVal2: '',
      doSearch1: {},
      doSearch2: {},
      treeList1: [],
      treeList2: [],
      bResize: {},

      zpTotal: 0,
      zpList: [],
      zpDeviceIds: ''
    }
  },
  mounted () {
  },
  methods: {
    goToZP () {
      this.$router.push({name: 'vehicle_search_gcck_zp', query: { deviceIds: this.zpDeviceIds }});
    },
    changeShowType (type) {
      if (type !== this.showType) {
        this.showType = type;
      }
    },

    selectItem (type, item) {
      console.log(type, item);
      let ids = '';
      if (type === 1) { // deviceName
        this.videoTotal = 1;
        this.videoList = [
          {
            type: 1,
            title: item.deviceName,
            record: false,
            video: Object.assign({}, item)
          }
        ];
        ids = item.uid;
        this.getDeviceSnapSum(ids);
        this.getDeviceSnapPage(ids);
        this.zpDeviceIds = ids;
      } else if (type === 2) {
        getDeviceByBayonetUid({
          bayonetUid: item.uid
        }).then(res => {
          if (res && res.data) {
            let dList = res.data;
            let iLen = dList.length;
            if (iLen <= 0) {
              this.videoTotal = 0;
              this.videoList = [];
              this.zpTotal = 0;
              this.zpList = [];
            } else {
              if (iLen > 2) { iLen = 8; }
              this.videoTotal = iLen;
              let vList = [];
              for (let i = 0; i < dList.length; i++) {
                vList.push({
                  type: 1,
                  title: dList[i].deviceName,
                  record: false,
                  video: Object.assign({}, dList[i])
                });
                ids += dList[i].uid + ',';
              }
              this.videoList = vList;
              this.getDeviceSnapSum(ids);
              this.getDeviceSnapPage(ids);
              this.zpDeviceIds = ids;
            }
            // this.zpTotal = res.data[0].snapImagesCount;
            // this.zpList = res.data.slice(0, 10);
            // console.log(this.zpList);
          }
        });
      }
    },

    getDeviceSnapSum (dId) {
      getDeviceSnapImagesSum({
        deviceIds: dId,
        startTime: formatDate(new Date(), 'yyyy-MM-dd'),
        endTime: formatDate(new Date(), 'yyyy-MM-dd'),
      }).then(res => {
        if (res && res.data && res.data.length > 0) {
          this.zpTotal = res.data[0].snapImagesCount;
          // this.zpList = res.data.slice(0, 10);
          // console.log(this.zpList);
        }
      });
    },

    getDeviceSnapPage (dId) {
      getDeviceSnapImagesPage({
        'where.deviceIds': dId,
        'where.startTime': formatDate(new Date() - 1000 * 60 * 60 * 24, 'yyyy-MM-dd'),
        'where.endTime': formatDate(new Date(), 'yyyy-MM-dd'),
        pageNum: 1,
        pageSize: 10
      }).then(res => {
        if (res && res.data) {
          this.zpList = res.data.list;
        }
      });
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
              > p {
                width: 142px; height: 142px;
                margin-bottom: 5px;
                > img {
                  width: 100%; height: 100%;
                }
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
      > .vc_gcck_r_empty {
        padding-top: 20px;
        text-align: center;
        color: #999;
      }
    }
  }
}
</style>