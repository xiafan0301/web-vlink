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
            <div class="gcck_ll_s" style="height: 100px;">
              <el-date-picker style="width: 236px;" size="small"
                v-model="searchTime2"
                type="daterange"
                align="left"
                unlink-panels
                :editable="false"
                :clearable="false"
                range-separator="至"
                start-placeholder="开始日期"
                :picker-options="pickerOptions"
                end-placeholder="结束日期">
              </el-date-picker>
              <el-input
                style="margin-top: 10px"
                placeholder="搜索"
                size="small"
                @keyup.enter.native="getTreeList2()"
                v-model="searchVal2">
                <i slot="suffix" @click="getTreeList2()" class="el-input__icon el-icon-search" style="font-size: 20px;"></i>
              </el-input>
            </div>
            <div class="gcck_ll_l" style="padding-top: 100px;">
              <div>
                <div is="dbTree" @selectItem="selectItem2" :likeKey="searchVal2" :doSearch="doSearch2"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="vc_gcck_r_C" v-show="showType === 1">
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
            <p class="vc_gcck_r_empty">暂无设备，您可以选择查看其它摄像头或卡口</p>
          </div>
          <div class="vc_gcck_r" v-else>
            <p class="vc_gcck_r_empty">选择左侧的摄像头或卡口进行查看</p>
          </div>
        </div>
        <div class="vc_gcck_r_C" v-show="showType === 2">
          <!-- <div class="vc_gcck_r">
            <p class="vc_gcck_r_empty">选择左侧的摄像头或卡口进行查看</p>
          </div> -->
          <div class="gcck_rh" v-if="zpDeviceIdsHis">
            <div>
              <div class="gcck_rh_tos">
                <el-input-number size="small" :disabled="picAutoPlayActive" v-model="picPlayTime" @change="picPlayChange" :min="3" :max="30" label="描述文字"></el-input-number>&nbsp;秒/张&nbsp;&nbsp;&nbsp;&nbsp;
                <el-button size="small" type="primary" @click="picAutoPlay">
                  <template v-if="picAutoPlayActive">
                    停止自动播放
                  </template>
                  <template v-else>
                    自动播放
                  </template>
                </el-button>
              </div>
              <div class="gcck_rh_list" :class="{'gcck_rh_list': picShowType === 2}">
                <ul :style="{'margin-left': (-500 * ((picIndex % 10) - 1) + 'px')}">
                  <li v-for="(item, index) in picList" :key="'p_l_' + index">
                    <div>
                      <p>
                        <img :title="item.plateNo" :alt="item.plateNo" :src="item.imagePath">
                      </p>
                      <div class="gcck_rh_ft"><i class="vl_icon gcck_sxt"></i>{{item.deviceName}}</div>
                      <div><i class="vl_icon gcck_sxt"></i>{{item.plateNo}}</div>
                      <div><i class="vl_icon gcck_sj"></i>{{item.snapTime}}</div>
                    </div>
                  </li>
                </ul>
              </div>
              <i @click="picPrep" class="el-icon-arrow-left"></i>
              <i @click="picNext" class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="vc_gcck_r" v-else>
            <p class="vc_gcck_r_empty">选择左侧的摄像头或卡口进行查看</p>
          </div>
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
    let nDate = new Date();
    return {
      showType: 1, // 1实时过车  2历史过车
      videoTotal: null, // 1 / 2 / 8
      videoList: [],
      searchVal1: '',
      searchVal2: '',
      doSearch1: {},
      doSearch2: {},
      searchTime2: [new Date(nDate.getTime() - 2 * 24 * 60 * 60 * 1000), nDate],
      treeList1: [],
      treeList2: [],
      bResize: {},

      zpTotal: 0,
      zpList: [],
      zpDeviceIds: '',


      picShowType: null, // 1 / 2 / 8
      picList: [],
      picListAll: [],
      zpDeviceIdsHis: '',

      picTotal: 0,
      picIndex: 1,
      picPlayTime: 5,
      picPageSize: 10,
      picPageNum: 1,
      picPages: 0,
      picAutoPlayActive: false,
      picAntoPlayInval: null,

      pickerOptions: {
        disabledDate (d) {
          return d > new Date();
        }
      }
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
                ids += dList[i].uid + '-';
              }
              if (ids && ids.length > 0) { ids = ids.substring(0, ids.length - 1); }
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
        'where.startTime': formatDate(new Date(), 'yyyy-MM-dd'),
        'where.endTime': formatDate(new Date(), 'yyyy-MM-dd'),
        pageNum: 1,
        pageSize: 10
      }).then(res => {
        if (res && res.data) {
          this.zpList = res.data.list;
        }
      });
    },

    selectItem2 (type, item) {
      console.log(type, item);
      let ids = '';
      if (type === 1) { // deviceName
        this.picShowType = 1;
        ids = item.uid;
        // this.getDeviceSnapSum(ids);
        this.zpDeviceIdsHis = ids;
        this.getDeviceSnapPage2();
      } else if (type === 2) {
        getDeviceByBayonetUid({
          bayonetUid: item.uid
        }).then(res => {
          if (res && res.data) {
            let dList = res.data;
            let iLen = dList.length;
            if (iLen <= 0) {
             /*  this.videoTotal = 0;
              this.videoList = [];
              this.zpTotal = 0;
              this.zpList = []; */
            } else {
              // if (iLen > 2) { iLen = 8; }
              // this.videoTotal = iLen;
              for (let i = 0; i < dList.length; i++) {
                ids += dList[i].uid + '-';
              }
              if (ids && ids.length > 0) { ids = ids.substring(0, ids.length - 1); }
              this.zpDeviceIdsHis = ids;
              this.getDeviceSnapPage2();
            }
            // this.zpTotal = res.data[0].snapImagesCount;
            // this.zpList = res.data.slice(0, 10);
            // console.log(this.zpList);
          }
        });
      }
    },
    getDeviceSnapPage2 (pageNum) {
      if (!pageNum) { pageNum = 1; }
      // this.picTotal = 0;
      getDeviceSnapImagesPage({
        'where.deviceIds': this.zpDeviceIdsHis,
        'where.startTime': formatDate(this.searchTime2[0], 'yyyy-MM-dd'),
        'where.endTime': formatDate(this.searchTime2[1], 'yyyy-MM-dd'),
        pageNum: pageNum,
        pageSize: this.picPageSize
      }).then(res => {
        if (res && res.data) {
          let rData = res.data;
          if (rData.list) {
            this.picList = [];
            this.$nextTick(() => {
              this.picIndex = 1;
              this.picList = res.data.list;
              this.picTotal = this.picList.length;
            });
          }
          this.picPages = rData.pages;
          this.picPageNum = rData.pageNum;
        } 
      });
    },

    picPrep () {
      if (this.picIndex > 1) {
        this.picIndex = this.picIndex - 1;
      }
    },
    picNext () {
      if (this.picIndex < this.picTotal) {
        this.picIndex = this.picIndex + 1;
      } else {
        if (this.picPageNum < this.picPages) {
          this.getDeviceSnapPage2(this.picPageNum + 1);
        } else {
          if (this.picAntoPlayInval) {
            window.clearInterval(this.picAntoPlayInval);
          }
        }
      }
    },

    picAutoPlay () {
      if (this.picAntoPlayInval) {
        window.clearInterval(this.picAntoPlayInval);
      }
      if (!this.picAutoPlayActive) {
        this.picAntoPlayInval =  window.setInterval(() => {
          this.picNext();
        }, this.picPlayTime * 1000);
      }
      this.picAutoPlayActive = !this.picAutoPlayActive;
    },

    picPlayChange (val) {
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
    > .vc_gcck_r_C {
      height: 100%;
      margin-left: 273px;
      > .vc_gcck_r {
        position: relative;
        height: 100%;
        padding-bottom: 238px;
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
  
  .gcck_sxt { width: 12px; height: 15px; background-position: -325px -377px; }
  .gcck_sj { width: 12px; height: 15px; background-position: -787px -376px; }
}
.gcck_rh {
  width: 100%; height: 100%;
  padding: 20px;
  > div {
    position: relative;
    width: 100%; height: 100%;
    background:rgba(255,255,255,1);
    box-shadow:0px -4px 10px 0px rgba(131,131,131,0.28);
    border-radius:3px;
    > .gcck_rh_tos {
      position: absolute; left: 10px; top: 10px;
    }
    > .gcck_rh_list {
      position: absolute; top: 50%; left: 50%;
      margin-left: -280px; margin-top: -260px;
      width: 520px; overflow: hidden;
      > ul {
        padding: 0 20px;
        width: 10000px;
        overflow: hidden;
        transition: all .4s ease-in;
        > li {
          float: left;
          height: 520px;
          padding: 10px 40px;
          > div {
            height: 500px;
            padding: 20px;
            box-shadow:0px -4px 10px 0px rgba(131,131,131,0.28);
            border-radius:3px;
            > p {
              width: 380px; height: 380px;
              margin-bottom: 10px;
              > img {
                width: 100%; height: 100%;
              }
            }
            > div {
              position: relative;
              padding-left: 20px; padding-bottom: 5px;
              color: #999;
              > i {
                position: absolute; left: 0; top: 2px;
              }
              &.gcck_rh_ft {
                color: #333;
                padding-bottom: 12px;
              }
            }
          }
        }
      }
    }
    > i {
      position: absolute; top: 50%;
      font-size: 40px; font-weight: bold;
      margin-top: -20px;
      cursor: pointer;
      color: #0C70F8;
    }
    > .el-icon-arrow-left {
      left: 50%;
      margin-left: -290px;
    }
    > .el-icon-arrow-right {
      right: 50%;
      margin-right: -270px;
    }
  }
}
</style>