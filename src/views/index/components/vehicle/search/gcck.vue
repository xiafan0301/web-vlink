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
                <div is="dbTree" @selectItem="selectItem" :likeKey="searchVal1" :doSearch="doSearch1" :showTypes="showTypes"></div>
              </div>
            </div>
          </div>
          <div v-show="showType === 2">
            <div class="gcck_ll_s" style="height: 165px;">
              <el-date-picker style="width: 236px;"
                class="vl_date"
                v-model="searchTime2[0]"
                type="datetime" time-arrow-control
                align="left"
                :editable="false"
                :clearable="false"
                placeholder="请选择开始时间"
                :picker-options="pickerOptions">
              </el-date-picker>
              <el-date-picker style="width: 236px; margin-top: 10px"
                class="vl_date vl_date_end"
                v-model="searchTime2[1]"
                type="datetime" time-arrow-control
                align="left"
                :editable="false"
                :clearable="false"
                placeholder="请选择结束时间"
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
                <div is="dbTree" @selectItem="selectItem2" :likeKey="searchVal2" :doSearch="doSearch2" :showTypes="showTypes"></div>
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
                      <img :title="item.deviceName" :alt="item.deviceName" :src="item.StorageUrl1">
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
                <p>选择抓拍设备，查看该设备的实时过车和历史过车情况</p>
              </div>
            </div>
          </div>
        </div>
        <div class="vc_gcck_r_C" v-show="showType === 2">
          <div class="gcck_rh" style="overflow: auto;" v-if="zpDeviceIdsHis">
            <ul class="gcck_l">
              <li v-for="(item, index) in aDay" :class="{'gcck_l_sed': daysList[item] && daysList[item].slider === 2}" :key="'day_list_' + index">
                <div class="gcck_lt" @click="selRow(item)"><i class="el-icon-caret-right gcck_lt_op"></i>{{item | dayFormat}}&nbsp;<span>({{daysList[item] ? daysList[item].total : ' - '}}张)</span></div>
                <div class="gcck_l_con">
                  <ul class="gcck_ll" v-if="daysList[item] && daysList[item].list">
                    <li v-for="(sitem, sindex) in daysList[item].list" :key="'dlf_' + sindex">
                      <div class="vc_gcck_rbl">
                        <div class="gcck_rbl_i">
                          <div>
                            <div @click="goToDetailHis(item, sindex)">
                              <img :title="sitem.deviceName" :alt="sitem.deviceName" :src="sitem.StorageUrl1">
                            </div>
                          </div>
                        </div>
                        <div class="gcck_rbl_t com_ellipsis" :title="sitem.PlateNo" style="color: #333;"><i class="vl_icon vl_icon_sm_cl"></i>{{sitem.PlateNo ? sitem.PlateNo : '未知车牌'}}</div>
                        <div class="gcck_rbl_t com_ellipsis" :title="sitem.shotTime"><i class="vl_icon vl_icon_sm_sj"></i>{{sitem.shotTime}}</div>
                      </div>
                    </li>
                  </ul>
                  <div class="gcck_ld" v-if="!daysList[item] || daysList[item].state === 1">
                    <div><i class="el-icon-loading"></i>正在加载中，请稍后...</div>
                  </div>
                  <div class="gcck_ld" v-if="daysList[item] && daysList[item].state === 2 && (!daysList[item].list || daysList[item].list.length <= 0)">
                    <div>暂无数据</div>
                  </div>
                  <div class="gcck_lb" v-if="daysList[item] && daysList[item].pageNum < daysList[item].pages">
                    <span @click="doSearch(item, daysList[item].pageNum + 1)">加载更多</span>
                  </div>
                </div>
              </li>
              <!-- <li>
                <div class="gcck_lt"><i class="el-icon-caret-right"></i>昨天&nbsp;2019-6-26&nbsp;<span>(31231张)</span></div>
                <ul class="gcck_ll gcck_ll_hide">
                  <li v-for="item in 10" :key="item">
                    <div class="vc_gcck_rbl">
                      <img src="../../../../../assets/img/temp/video_pic.png" alt="">
                      <div><i class="vl_icon gcck_sxt"></i>环保路摄像头002</div>
                      <div><i class="vl_icon gcck_sj"></i>18-12-24 14:12:17</div>
                    </div>
                  </li>
                </ul>
              </li> -->
            </ul>
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
import {formatDate, dateOrigin} from '@/utils/util.js';
export default {
  components: {vlBreadcrumb, flvplayer, dbTree, vehicleDetail},
  data () {
    return {
      showTypes: 'DB',
      detailData: null,
      showType: 1, // 1实时过车  2历史过车
      videoTotal: null, // 1 / 2 / 8
      videoList: [],
      searchVal1: '',
      searchVal2: '',
      doSearch1: {},
      doSearch2: {},
      searchTime2: [dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)), new Date()],
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
      },

      aDay: [],
      daysList: {
        // state 1 未查询 2 查询中  3
        // '2019-1-1': {state: 1, list: [], pageSize: 10, pageNum: 1, pages: 1, total: 100 }
      },
    }
  },
  filters: {
    dayFormat (val) {
      if (val === formatDate(new Date(), 'yyyy-MM-dd')) {
        val = '今日';
      } else if (val === formatDate(new Date() - 1000 * 60 * 60 * 24, 'yyyy-MM-dd')) {
        val = '昨日';
      }
      return val;
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
    goToDetailHis (sday, index) {
      if (this.daysList[sday]) {
        let _o = this.daysList[sday];
        let dId = this.zpDeviceIdsHis;
        this.detailData = {
          type: 1, // 1过车查看
          params: {
            where: {
              deviceIds: dId,
              startTime: sday + ' 00:00:00',
              endTime: sday + ' 23:59:59',
            }
          }, // 查询参数
          list: _o.list, // 列表
          index: index, // 第几个
          pageSize: _o.pageSize,
          total: _o.total,
          pageNum: _o.pageNum
        }
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
//      this.picAutoPlay(true);
      let ids = '';
      if (type === 1) { // deviceName
        this.picShowType = 1;
        ids = item.uid;
        // this.getDeviceSnapSum(ids);
        this.zpDeviceIdsHis = ids;
        // this.getDeviceSnapPage2();
        this.searchSubmit();
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
//            this.getDeviceSnapPage2();
            this.searchSubmit();
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

    // 历史过车改成实时一样列表
    selRow (item) {
      if (this.daysList[item]) {
        if (this.daysList[item].slider === 2) {
          this.daysList[item].slider = 1;
        } else {
          this.daysList[item].slider = 2;
          if (this.daysList[item].state === 1) {
            this.doSearch (item, 1);
          }
        }
      }
    },

    searchSubmit () {
      let sT = this.searchTime2[0].getTime(), eT = this.searchTime2[1].getTime();
      let ii = eT - sT;
      let iD = Math.floor(ii / (1000 * 60 * 60 * 24)) + 1;
      let aDay = [], oDayList = {};
      for (let i = iD - 1; i >= 0; i--) {
        let _SD = formatDate(sT + i * (1000 * 60 * 60 * 24), 'yyyy-MM-dd');
        aDay.push(_SD);
        oDayList[_SD] = {
          state: 1, // 1 加载中，2加载完毕
          slider: 1, // 1 slideUp 2 slideDown
          list: null,
          pageSize: 16,
          pageNum: 0,
          pages: 0,
          total: 0
        };
      }
      this.aDay = aDay;
      this.daysList = oDayList;
      console.log('this.daysList', this.daysList);
      this.$set(this.daysList);
      // console.log('aDay', aDay);
      this.$nextTick(() => {
        this.getDeviceSnapSumHis();
        this.selRow(aDay[0]);
        // $('.gcck_ll').first().show(300);
      });
    },
    getDeviceSnapSumHis (dId) {
      getDeviceSnapImagesSum({
        deviceIds: this.zpDeviceIdsHis,
        startTime: formatDate(this.searchTime2[0], 'yyyy-MM-dd 00:00:00'),
        endTime: formatDate(this.searchTime2[1], 'yyyy-MM-dd 23:59:59'),
      }).then(res => {
        if (res && res.data && res.data.length > 0) {
          for (let key in this.daysList) {
            for (let i = 0; i < res.data.length; i++) {
              if (key === res.data[i].snapImagesDate) {
                this.daysList[key].total = res.data[i].snapImagesCount;
                break;
              }
            }
          }
        }
      });
    },
    doSearch (sDay, pageNum) {
      if (!this.daysList[sDay]) {
        this.daysList[sDay] = {
          state: 1
        };
        this.$set(this.daysList);
      }
      let dId = this.zpDeviceIdsHis;
      if (!pageNum) { pageNum = 1; }
      getDeviceSnapImagesPage({
        where: {
          deviceIds: dId,
          startTime: sDay + ' 00:00:00',
          endTime: sDay + ' 23:59:59',
        },
        pageNum: pageNum,
        pageSize: 16
      }).then(res => {
        this.daysList[sDay].state = 2;
        if (res && res.data && res.data.list && res.data.list.length > 0) {
          this.daysList[sDay].total = res.data.total;
          this.daysList[sDay].pageNum = pageNum; // 当前页数
          this.daysList[sDay].pages = res.data.pages; // 总页数
          if (!this.daysList[sDay].list) {
            this.daysList[sDay].list = [];
          }
          this.daysList[sDay].list = this.daysList[sDay].list.concat(res.data.list);
          console.log('this.daysList', this.daysList);
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
          width: 100%; height: 70px;
          padding: 20px 20px 0 20px;
        }
        > .gcck_ll_l {
          height: 100%;
          padding-top: 70px;
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
.gcck_lt {
  position: relative;
  height: 40px; line-height: 40px;
  padding-left: 44px; margin: 5px 10px 0 10px;
  color: #333;
  background-color: #fff;
  box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
  cursor: pointer;
  transition: all .4s ease-out;
  > i {
    position: absolute; top: 10px; left: 20px;
    font-size: 20px; color: #666; cursor: pointer;
    transition: all .4s ease-out;
    &.gcck_lt_op {
      top: 10px;
    }
  }
  > span { color: #999; }
  &:hover {
    color: #0C70F8;
    > i {
      color: #0C70F8;
    }
  }
}
.gcck_l {
  > li {
    &.gcck_l_sed {
      > .gcck_l_con {
        display: block;
      }
      .gcck_lt_op {
        transform: rotate(90deg);
        top: 8px;
      }
    }
  }
}
.gcck_l_con {
  display: none;
  .gcck_ll {
    display: block;
    overflow: hidden;
    padding: 5px;
    > li {
      width: 12.5%;
      float: left;
      padding: 5px;
      > div {
        width: 100%;
        padding: 10px;
        background-color: #fff;
        box-shadow:0px 2px 10px 0px rgba(131,131,131,0.12);
        > .gcck_rbl_i {
          position: relative;
          width: 100%; height: 0;
          padding-top: 52%; margin-bottom: 5px;
          > div {
            position: absolute; top: 0; right: 0; bottom: 0; left: 0;
            > div {
              width: 100%; height: 100%;
              display: flex; justify-content: center; align-items: center;
              position: relative;
              cursor: pointer;
              overflow: hidden;
              > img {
                visibility: visible;
                width: 100%; height: auto;
              }
            }
          }
        }
        > .gcck_rbl_t {
          position: relative;
          text-align: left;
          padding-left: 18px;
          color: #999; font-size: 12px;
          height: 22px; line-height: 22px;
          > i {
            position: absolute; top: 4px; left: 0;
          }
        }
      }
    }
    &.gcck_ll_hide { display: none; }
  }
  .gcck_lb {
    text-align: center;
    padding-bottom: 5px;
    > span {
      display: inline-block;
      background-color: #eee;
      color: #666;
      cursor: pointer;
      padding: 3px 50px 5px 50px;
      border-radius: 2px;
    }
  }
  .gcck_ld {
    position: relative;
    height: 40px; width: 100%;
    > div {
      position: absolute; left: 50%; top: 0;
      height: 40px;
      color: #666;
      padding-left: 25px; padding-top: 10px; margin-left: -85px;
      > i {
        position: absolute; top: 10px; left: 0px;
        font-size: 20px;
      }
    }
  }
}
</style>