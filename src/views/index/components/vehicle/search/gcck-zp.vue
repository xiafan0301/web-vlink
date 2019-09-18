<template>
  <div class="vehicle_content">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" 
        :breadcrumbData="[
          {name: '车辆侦查', routerName: 'vehicle'},
          {name: '过车查看', routerName: 'vehicle_search_gcck', query: {'deviceIds': $route.query.deviceIds, bId: $route.query.bId}},
          {name: '全部抓拍'}]">
      </div>
    </div>
    <div class="vc_gcck">
      <div class="vc_gcck_con">
        <div class="gcck_s">
          <el-form :inline="true" :model="formInline" ref="formInline" class="dl_hi_sf">
            <el-form-item>
              <el-date-picker style="width: 250px;"
                class="vl_date"
                v-model="formInline.time"
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
            </el-form-item>
            <el-form-item>
              <el-select v-model="formInline.lb" :clearable="true" placeholder="请选择车辆分组" style="width: 150px;">
                <el-option :label="'布控车辆'" :value="2"></el-option>
                <el-option :label="'无牌车'" :value="1"></el-option>
                <el-option v-for="(item, index) in lbList" :label="item.enumValue" :key="'dept-list-' + index" :value="item.uid"></el-option>
                <el-option v-for="(item, index) in lbtsList" :label="item.name" :key="'dept-list-ts-' + index" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="formInline.lx" :clearable="true" placeholder="请选择车辆类型" style="width: 150px;">
                <el-option v-for="(item, index) in lxList" :label="item.enumValue" :key="'user-list-' + index" :value="item.enumValue"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-right: 2px;">
              <el-checkbox class="gcck_ck_f" v-model="formInline.no">排除</el-checkbox>
            </el-form-item>
            <el-form-item class="ntmd_fm">
              <el-input placeholder="请输入车牌号" style="width: 200px;" v-model="formInline.cp">
                <el-select style="width: 70px;" :clearable="true" v-model="formInline.cpp" slot="prepend" placeholder="">
                  <el-option v-for="(item, index) in cppList" :label="item.enumValue" :key="'afawe-list-' + index" :value="item.enumValue"></el-option>
                  <el-option :label="''" :value="''"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button :loading="searchLoading" type="primary" @click="searchSubmit">查询</el-button>
              <el-button @click="searchReset('formInline')">重置</el-button>
            </el-form-item>
          </el-form>
          <!-- <el-button class="gcck_s_dc" size="small" type="primary" :disabled="true">导出</el-button> -->
        </div>
        <ul class="gcck_l">
          <li v-for="(item, index) in aDay" :class="{'gcck_l_sed': daysList[item] && daysList[item].slider === 2}" :key="'day_list_' + index">
            <div class="gcck_lt" @click="selRow(item)"><i class="el-icon-caret-right gcck_lt_op"></i>{{item | dayFormat}}&nbsp;<span>({{daysList[item] ? daysList[item].total : ' - '}}张)</span></div>
            <div class="gcck_l_con">
              <ul class="gcck_ll" v-if="daysList[item] && daysList[item].list">
                <li v-for="(sitem, sindex) in daysList[item].list" :key="'dlf_' + sindex">
                  <div class="vc_gcck_rbl">
                    <div class="gcck_rbl_i">
                      <div>
                        <div @click="goToDetail(item, sindex)">
                          <img :title="sitem.deviceName" :alt="sitem.deviceName" :src="sitem.subStoragePath">
                        </div>
                      </div>
                    </div>
                    <div class="gcck_rbl_t com_ellipsis" :title="sitem.plateNo" style="color: #333;"><i class="vl_icon vl_icon_sm_cl"></i>{{sitem.plateNo ? sitem.plateNo : '未知车牌'}}</div>
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
    </div>
    <div is="vehicleDetail" :detailData="detailData"></div>
  </div>
</template>
<script>
import vehicleDetail from '../common/vehicleDetail.vue';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import flvplayer from '@/components/common/flvplayer.vue';
import {formatDate, getDate} from '@/utils/util.js';
import {getDeviceSnapImagesSum, getDeviceSnapImagesPage} from '../../../api/api.judge.js';
import {getDiciData} from '../../../api/api.js';
import {getSpecialGroup} from '../../../api/api.manage.js';
import { constants } from 'crypto';
export default {
  components: {vlBreadcrumb, flvplayer, vehicleDetail},
  data () {
    let nDate = new Date();
    return {
      detailData: null,
      formInline: {
        time: [nDate, nDate],
        lb: '',
        lx: '',
        no: false,
        cpp: '',
        cp: ''
      },
      searchLoading: false,
      lbList: [],
      lbtsList: [],
      lxList: [],
      cppList: [],
      aDay: [],
      daysList: {
        // state 1 未查询 2 查询中  3
        // '2019-1-1': {state: 1, list: [], pageSize: 10, pageNum: 1, pages: 1, total: 100 }
      },
      pickerOptions: {
        disabledDate (d) {
          return d > new Date();
        }
      }
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
  created () {
    // this.queryData = {this.$route.query.deviceIds{};
    if (this.$route.query.st && this.$route.query.et) {
      this.formInline.time = [getDate(this.$route.query.st), getDate(this.$route.query.et)]
    }
    if (this.$route.query.lb) { this.formInline.lb = this.$route.query.lb; }
    if (this.$route.query.lx) { this.formInline.lb = this.$route.query.lx; }
    if (this.$route.query.no) { this.formInline.no = this.$route.query.no == 1 ? true : false; }
    if (this.$route.query.cpp) { this.formInline.cpp = this.$route.query.cpp; }
    if (this.$route.query.cp) { this.formInline.cp = this.$route.query.cp; }
  },
  mounted () {
    this.searchSubmit();
    this.getLxList();
    // this.getLbList();
    this.getLbtsList();
    this.getCppList();
  },
  methods: {
    goToDetail (sday, index) {
      /* let _o = Object.assign({}, this.daysList[sday], {
        day: sday,
        index: index
      });
      this.detailData = _o; */
      // console.log('daysList[item]', this.daysList[sday]);
      // console.log('sday', sday);
      if (this.daysList[sday]) {
        let _o = this.daysList[sday];
        let dId = this.$route.query.deviceIds;
        this.detailData = {
          type: 1, // 1过车查看
          params: {
            where: {
              deviceIds: dId,
              startTime: sday + ' 00:00:00',
              endTime: sday + ' 23:59:59',
              vehicleClass: this.formInline.lx,
              vehicleGroupUid: this.formInline.lb,
              isPlateNo: this.formInline.no ? 2 : 1,
              plateNo: this.formInline.cpp + this.formInline.cp
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
    getLxList () {
      getDiciData(44).then(res => {
        if (res && res.data) {
          this.lxList = res.data;
        }
      });
    },
    getLbtsList () {
      getSpecialGroup().then(res => {
        if (res && res.data) {
          this.lbtsList = res.data;
        }
      });
    },
    getLbList () {
      getDiciData(31).then(res => {
        if (res && res.data) {
          this.lbList = res.data;
        }
      });
    },
    getCppList () {
      getDiciData(48).then(res => {
        if (res && res.data && res.data.length > 0) {
          this.cppList = res.data;
        }
      });
    },

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
      let sT = this.formInline.time[0].getTime(), eT = this.formInline.time[1].getTime();
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
        this.getDeviceSnapSum();
        this.selRow(aDay[0]);
        // $('.gcck_ll').first().show(300);
      });
    },
    getDeviceSnapSum (dId) {
      getDeviceSnapImagesSum({
        deviceIds: this.$route.query.deviceIds,
        startTime: formatDate(this.formInline.time[0], 'yyyy-MM-dd 00:00:00'),
        endTime: formatDate(this.formInline.time[1], 'yyyy-MM-dd 23:59:59'),
        vehicleClass: this.formInline.lx,
        vehicleGroupUid: this.formInline.lb,
        isPlateNo: this.formInline.no ? 2 : 1,
        plateNo: this.formInline.cpp + this.formInline.cp
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
      let dId = this.$route.query.deviceIds;
      if (!pageNum) { pageNum = 1; }
      getDeviceSnapImagesPage({
        where: {
          deviceIds: dId,
          startTime: sDay + ' 00:00:00',
          endTime: sDay + ' 23:59:59',
          vehicleClass: this.formInline.lx,
          vehicleGroupUid: this.formInline.lb,
          isPlateNo: this.formInline.no ? 2 : 1,
          plateNo: this.formInline.cpp + this.formInline.cp
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
    searchReset () {
      let nDate = new Date();
      this.formInline = {
        time: [nDate, nDate],
        lb: '',
        lx: '',
        no: false,
        cpp: '',
        cp: ''
      }
      this.searchSubmit();
    }
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
    position: relative;
    padding-top: 10px; padding-bottom: 20px;
    overflow: auto;
    height: 100%;
  }
}
.gcck_s {
  position: relative;
  background-color: #fff;
  box-shadow: 0px 5px 16px 0px rgba(169,169,169,0.2);
  padding: 18px 10px 0 20px;
  margin: 5px 10px 10px 10px;
  .gcck_s_dc {
    position: absolute; top: 20px; right: 10px;
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
<style lang="scss">
.gcck_ck_f {
  padding-left: 5px;
  color: #000;
  .el-checkbox__label { padding-left: 1px; }
}
.ntmd_fm {
  .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>