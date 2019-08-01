<template>
  <div class="vehicle_content">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle'}, {name: '过车查看'}]">
      </div>
    </div>
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
                placeholder="搜索设备"
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
            <div class="gcck_ll_s" style="height: 165px;">
              <el-date-picker style="width: 236px;"
                class="vl_date"
                v-model="searchTime2[0]"
                type="datetime"
                align="left"
                :editable="false"
                :clearable="false"
                :picker-options="pickerOptions">
              </el-date-picker>
              <el-date-picker style="width: 236px; margin-top: 10px"
                class="vl_date vl_date_end"
                v-model="searchTime2[1]"
                type="datetime"
                align="left"
                :editable="false"
                :clearable="false"
                :picker-options="pickerOptions">
              </el-date-picker>
              <el-input
                style="margin-top: 10px"
                placeholder="搜索设备"
                @keyup.enter.native="getTreeList2()"
                v-model="searchVal2">
                <i slot="suffix" @click="getTreeList2()" class="el-input__icon el-icon-search" style="font-size: 20px;"></i>
              </el-input>
            </div>
            <div class="gcck_ll_l" style="padding-top: 165px;">
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
              <template v-if="zpList && zpList.length > 0">
                <li v-for="(item, index) in zpList" :key="'jrzp_' + index">
                  <div class="vc_gcck_rbl">
                    <p @click="goToDetail(index)">
                      <img :title="item.deviceName" :alt="item.deviceName" :src="item.subStoragePath">
                    </p>
                    <div class="com_ellipsis"><i class="vl_icon vl_icon_sm_sj"></i>{{item.shotTime}}</div>
                    <div class="com_ellipsis"><i class="vl_icon vl_icon_sm_sxt"></i>{{item.deviceName}}</div>
                  </div>
                </li>
              </template>
              <template v-else>
                <li class="vc_gcck_rb_empty">
                  暂无数据
                </li>
              </template>
            </ul>
          </div>
          <div class="vc_gcck_r" v-else-if="videoTotal === 0">
            <div class="vc_gcck_r_empty">
              <div class="com_trans50_lt">
                <img src="../../../../../assets/img/null-content.png" alt="">
                <p>暂无设备，您可以选择查看其它摄像头或卡口</p>
              </div>
            </div>
          </div>
          <div class="vc_gcck_r" v-else>
            <div class="vc_gcck_r_empty">
              <div class="com_trans50_lt">
                <img src="../../../../../assets/img/null-content.png" alt="">
                <p>选择左侧的摄像头或卡口进行查看</p>
              </div>
            </div>
          </div>
        </div>
        <div class="vc_gcck_r_C" v-show="showType === 2">
          <div class="gcck_rh" style="overflow: auto;" v-if="zpDeviceIdsHis && picList.length > 0">
            <div>
              <div class="gcck_rh_tos">
                <el-input-number size="small" :disabled="picAutoPlayActive" v-model="picPlayTime" @change="picPlayChange" :min="1" :max="60"></el-input-number>&nbsp;秒/张&nbsp;&nbsp;&nbsp;&nbsp;
                <el-button size="small" :disabled="picIndex === ((picPageNum - 1) * picPages + picTotal)" type="primary" @click="picAutoPlay(false)">
                  <template v-if="picAutoPlayActive">
                    暂停播放
                  </template>
                  <template v-else>
                    自动播放
                  </template>
                </el-button>
              </div>
              <div class="gcck_rh_list" :class="{'gcck_rh_list': picShowType === 2}">
                <ul :style="{'margin-left': (-500 * ((picIndex - 1) % picPageSize) + 'px')}">
                  <li v-for="(item, index) in picList" :key="'p_l_' + index">
                    <div>
                      <p>
                        <img class="bigImg" :title="item.plateNo" :alt="item.plateNo" :src="item.storagePath">
                      </p>
                      <div class="gcck_rh_ft"><i class="vl_icon vl_icon_sm_sxt"></i>{{item.deviceName}}</div>
                      <div><i class="vl_icon vl_icon_sm_cl"></i>{{item.plateNo}} </div>
                      <div><i class="vl_icon vl_icon_sm_sj"></i>{{item.shotTime}} </div>
                    </div>
                  </li>
                </ul>
              </div>
              <i @click="picPrep(true)" class="el-icon-arrow-left" :class="{'el-icon-arrow-dis': picIndex === 1}"></i>
              <i @click="picNext(true)" class="el-icon-arrow-right" :class="{'el-icon-arrow-dis': picIndex === ((picPageNum - 1) * picPages + picTotal)}"></i>
            </div>
          </div>
          <div class="vc_gcck_r" v-else-if="zpDeviceIdsHis && picList.length <= 0">
            <div class="vc_gcck_r_empty">
              <div class="com_trans50_lt">
                <img src="../../../../../assets/img/null-content.png" alt="">
                <p>暂无数据</p>
              </div>
            </div>
          </div>
          <div class="vc_gcck_r" v-else-if="!zpDeviceIdsHis && picCKEmpty">
            <div class="vc_gcck_r_empty">
              <div class="com_trans50_lt">
                <img src="../../../../../assets/img/null-content.png" alt="">
                <p>该卡口没有摄像头</p>
              </div>
            </div>
          </div>
          <div class="vc_gcck_r" v-else>
            <div class="vc_gcck_r_empty">
              <div class="com_trans50_lt">
                <img src="../../../../../assets/img/null-content.png" alt="">
                <p>选择左侧的摄像头或卡口进行查看</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div is="vehicleDetail" :detailData="detailData"></div>
  </div>
</template>
<script>
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import vehicleDetail from '../common/vehicleDetail.vue';
import flvplayer from '@/components/common/flvplayer.vue';
import dbTree from '@/components/common/dbTree.vue';
import {getDeviceByBayonetUid, getDeviceDetailById} from '../../../api/api.base.js';
import {MapGETmonitorList} from '../../../api/api.map.js';
import {getDeviceSnapImagesSum, getDeviceSnapImagesPage} from '../../../api/api.judge.js';
import {formatDate} from '@/utils/util.js';
export default {
  components: {vlBreadcrumb, flvplayer, dbTree, vehicleDetail},
  data () {
    return {
      detailData: null,
      showType: 1, // 1实时过车  2历史过车
      videoTotal: null, // 1 / 2 / 8
      videoList: [],
      searchVal1: '',
      searchVal2: '',
      doSearch1: {},
      doSearch2: {},
      searchTime2: [new Date(new Date(new Date().toLocaleDateString()).getTime() - 1 * 24 * 60 * 60 * 1000), 
        new Date(new Date(new Date().toLocaleDateString()).getTime() - 1)],
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
      zpBId: '',
      jrZpIntval: null,

      picTotal: 0,
      picIndex: 1,
      picPlayTime: 3,
      picPageSize: 30,
      picPageNum: 1,
      picPages: 0,
      
      picAutoPlayActive: false,
      picAntoPlayInval: null,
      picCKEmpty: false,

      pickerOptions: {
        disabledDate (d) {
          return d > new Date();
        }
      }
    }
  },
  mounted () {
    let did = this.$route.query.deviceIds;
    let bid = this.$route.query.bId;
    if (bid) {
      this.selectItem(2, {
        uid: bid
      });
    } else if (did) {
      getDeviceDetailById({
        id: did
      }).then(res => {
        if (res && res.data) {
          this.selectItem(1, {
            uid: res.data.uid,
            deviceName: res.data.deviceName
          });
        }
      });
    }
  },
  methods: {
    goToDetail (index) {
      this.detailData = {
        type: 1, // 1过车查看
        params: this.getSearchParams(), // 查询参数
        list: this.zpList, // 列表
        index: index, // 第几个
        pageSize: 8,
        total: this.zpTotal,
        pageNum: 1
      }
    },

    goToZP () {
      this.$router.push({name: 'vehicle_search_gcck_zp', query: { deviceIds: this.zpDeviceIds, bId: this.zpBId }});
    },
    changeShowType (type) {
      if (type !== this.showType) {
        this.showType = type;
      }
    },
    selectItem (type, item) {
      console.log(type, item);
      this.jrZpIntvalFn();
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
        this.zpDeviceIds = ids;
        this.zpBId = '';
        this.getDeviceSnapSum(ids);
        this.getDeviceSnapPage(ids);
        this.jrZpIntvalFn(ids);
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
              if (iLen > 8) { iLen = 8; }
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
              vList.push({
                type: 1,
                title: dList[0].deviceName,
                record: false,
                video: Object.assign({}, dList[0])
              });
              vList.push({
                type: 1,
                title: dList[0].deviceName,
                record: false,
                video: Object.assign({}, dList[0])
              });
              vList.push({
                type: 1,
                title: dList[0].deviceName,
                record: false,
                video: Object.assign({}, dList[0])
              });
              vList.push({
                type: 1,
                title: dList[0].deviceName,
                record: false,
                video: Object.assign({}, dList[0])
              });
              if (ids && ids.length > 0) { ids = ids.substring(0, ids.length - 1); }
              this.videoList = vList;
              this.zpDeviceIds = ids;
              this.zpBId = item.uid;
              this.getDeviceSnapSum(ids);
              this.getDeviceSnapPage(ids);
              this.jrZpIntvalFn(ids);
            }
            // this.zpTotal = res.data[0].snapImagesCount;
            // this.zpList = res.data.slice(0, 10);
            // console.log(this.zpList);
          }
        });
      }
    },

    jrZpIntvalFn (dId) {
      if (this.jrZpIntval) {
        window.clearInterval(this.jrZpIntval);
      }
      if (dId) {
        this.jrZpIntval = window.setInterval(() => {
          this.getDeviceSnapSum (dId);
          this.getDeviceSnapPage (dId);
        }, 5 * 1000);
      }
    },


    getSearchParams () {
      return {
        where: {
          deviceIds: this.zpDeviceIds,
          startTime: formatDate(new Date(), 'yyyy-MM-dd 00:00:00'),
          endTime: formatDate(new Date(), 'yyyy-MM-dd 23:59:59')
        }
      }
    },

    getDeviceSnapSum () {
      /* let params = this.getSearchParams();
      getDeviceSnapImagesSum({
        deviceIds: this.zpDeviceIds,
        startTime: formatDate(new Date(), 'yyyy-MM-dd 00:00:00'),
        endTime: formatDate(new Date(), 'yyyy-MM-dd 23:59:59'),
      }).then(res => {
        if (res && res.data && res.data.length > 0) {
          this.zpTotal = res.data[0].snapImagesCount;
          // this.zpList = res.data.slice(0, 10);
          // console.log(this.zpList);
        } else {
          this.zpTotal = 0;
        }
      }); */
    },

    getDeviceSnapPage () {
      let params = Object.assign(this.getSearchParams(), {
        pageNum: 1,
        pageSize: 8
      });
      getDeviceSnapImagesPage(params).then(res => {
        if (res && res.data) {
          this.zpList = res.data.list;
          this.zpTotal = res.data.total;
        } else {
          this.zpList = [];
          this.zpTotal = 0;
        }
      });
    },

    selectItem2 (type, item) {
      console.log(type, item);
      this.picAutoPlay(true);
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
          if (res && res.data && res.data.length > 0) {
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
            }
            // this.zpTotal = res.data[0].snapImagesCount;
            // this.zpList = res.data.slice(0, 10);
            // console.log(this.zpList);
          } else {
            this.picCKEmpty = true;
          }
          this.zpDeviceIdsHis = ids;
          if (this.zpDeviceIdsHis) {
            this.getDeviceSnapPage2();
          }
        });
      }
    },
    getDeviceSnapPage2 (pageNum, bPrep) {
      if (!pageNum) { pageNum = 1; }
      // this.picTotal = 0;
      getDeviceSnapImagesPage({
        where: {
          deviceIds: this.zpDeviceIdsHis,
          startTime: formatDate(this.searchTime2[0], 'yyyy-MM-dd 00:00:00'),
          endTime: formatDate(this.searchTime2[1], 'yyyy-MM-dd 23:59:59')
        },
        pageNum: pageNum,
        pageSize: this.picPageSize
      }).then(res => {
        if (res && res.data && res.data.list && res.data.list.length > 0) {
          let rlist = res.data.list;
          if (!bPrep) {
            this.picList =rlist[0];
            this.$nextTick(() => {
              // this.picIndex = (pageNum - 1) * this.picPageSize + 1;
              this.picIndex = pageNum === 1 ? 1 : (this.picIndex + 1);
              this.picList = rlist;
              this.picTotal = this.picList.length;
            });
          } else {
            this.picList =rlist[rlist.length - 1];
            this.$nextTick(() => {
              this.picIndex = this.picIndex - 1;
              this.picList = rlist;
              this.picTotal = this.picList.length;
            });
          }
          this.picPages = res.data.pages;
          // this.picPages = 100;
          this.picPageNum = pageNum;
          // console.log('this.picIndex', this.picIndex);
          // this.picPageNum = rData.pageNum;
        } else {
          if (pageNum > 1) {
            this.picAutoPlay(true);
          } else {
            this.picIndex = 1;
            this.picList = [];
            this.picPages = 0;
            this.picPageNum = 1;
          }
        }
      });
    },

    picPrep (bStopAni) {
      // bStopAni: true 关闭动画
      if (bStopAni) { this.picAutoPlay(true); }
      // console.log(this.picIndex);
      // console.log(this.picPageSize * (this.picPageNum - 1) + this.picTotal);
      if ((this.picIndex % this.picPageSize) > 1 || (this.picIndex % this.picPageSize) === 0) {
        this.picIndex = this.picIndex - 1;
      } else if ((this.picIndex % this.picPageSize) === 1) {
        if (this.picPageNum > 1) {
          this.getDeviceSnapPage2(this.picPageNum - 1, true);
        }
      }
    },
    picNext (bStopAni) {
      // bStopAni: true 关闭动画
      if (bStopAni) { this.picAutoPlay(true); }
      // console.log(this.picIndex);
      // console.log(this.picPageSize * (this.picPageNum - 1) + this.picTotal);
      if (this.picIndex < (this.picPageSize * (this.picPageNum - 1) + this.picTotal)) {
        this.picIndex = this.picIndex + 1;
      } else {
        if (this.picPageNum < this.picPages) {
          this.getDeviceSnapPage2(this.picPageNum + 1);
        } else {
          this.picAutoPlay(true);
        }
      }
    },
    picAutoPlay (bStop) {
      if (this.picAntoPlayInval) {
        window.clearInterval(this.picAntoPlayInval);
      }
      if (this.picAutoPlayActive || bStop) {
        this.picAutoPlayActive = false;
      } else {
        this.picAutoPlayActive = true;
        this.picAntoPlayInval =  window.setInterval(() => {
          this.picNext();
        }, this.picPlayTime * 1000);
      }
    },

    picPlayChange (val) {
    },

    getTreeList1 () {
      this.doSearch1 = {};
    },
    getTreeList2 () {
      this.doSearch2 = {};
    },
    /* pickerChanged () {
      if ((this.searchTime2[1].getTime() - this.searchTime2[0].getTime()) > 2 * 24 * 60 * 60 * 1000) {
        this.searchTime2[1] = new Date(this.searchTime2[0].getTime() + 2 * 24 * 60 * 60 * 1000);
        this.$message('最多不能超过72小时.');
      }
    } */
  },
  beforeDestroy () {
    if (this.picAntoPlayInval) {
      window.clearInterval(this.picAntoPlayInval);
    }
    this.jrZpIntvalFn();
  }
}
</script>
<style lang="scss" scoped>
.vc_gcck_bd {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 50px; line-height: 50px;
}
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
          &.video_list_3 {
            > li { float: left; width: 33.33%; height: 100%; }
          }
          &.video_list_4 {
            > li { 
              float: left; width: 30%; height: 50%;
              &:nth-child(1) { margin-left: 15%; }
              &:nth-child(2) { margin-right: 15%; }
              &:nth-child(3) { margin-left: 15%; }
              &:nth-child(4) { margin-right: 15%; }
            }
          }
          &.video_list_5 {
            > li { 
              float: left; width: 33.33%; height: 50%;
              &:nth-child(1) { margin-left: 15%; }
              &:nth-child(2) { margin-right: 15%; }
            }
          }
          &.video_list_6 {
            > li { float: left; width: 33.33%; height: 50%; }
          }
          &.video_list_7 {
            > li { 
              float: left; width: 25%; height: 50%;
              &:nth-child(5) { margin-left: 12%; }
            }
          }
          &.video_list_8 {
            > li { 
              float: left; width: 25%; height: 50%;
            }
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
                  cursor: pointer;
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
            &.vc_gcck_rb_empty {
              float: none !important;
              margin-left: 170px; padding-right: 50px !important; padding-top: 20px;
              width: auto;
              text-align: center;
              color: #999;
            }
          }
        }
        > .vc_gcck_r_empty {
          text-align: center;
          color: #999;
          height: 100%;
          position: relative;
          > div {
            position: absolute;
          }
        }
      }
    }
  }
}
.gcck_rh {
  width: 100%; height: 100%;
  padding: 20px;
  > div {
    position: relative;
    width: 100%; height: 100%; min-height: 520px;
    background:rgba(255,255,255,1);
    box-shadow:0px -4px 10px 0px rgba(131,131,131,0.28);
    border-radius:3px;
    > .gcck_rh_tos {
      position: absolute; left: 10px; top: 10px; z-index: 2;
    }
    > .gcck_rh_list {
      position: absolute; top: 50%; left: 50%;
      margin-left: -280px; margin-top: -260px;
      width: 520px; height: 520px; overflow: hidden;
      > ul {
        padding: 0 20px;
        width: 60000px;
        overflow: hidden;
        transition: all .4s ease-in;
        > li {
          float: left;
          width: 500px; height: 520px;
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
              padding-left: 20px;
              color: #999;
              height: 20px; line-height: 20px;
              margin-bottom: 5px;
              > i {
                position: absolute; left: 0; top: 2px;
              }
              &.gcck_rh_ft {
                color: #333;
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
      &.el-icon-arrow-dis { color: #999; cursor: default; }
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