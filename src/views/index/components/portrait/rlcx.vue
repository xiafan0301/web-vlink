<template>
  <div class="portrait_content">
    <div class="vc_gcck_bd" is="vehicleBreadcrumb" :oData="[{name: '特征搜人'}]"></div>
    <div class="rlcx_main clearfix">
      <div class="rlcx_l">
        <el-form ref="form" class="pt_rlcx_fm" :model="searchForm" size="small">
          <el-form-item>
            <el-date-picker
              style="width: 240px;"
              v-model="searchForm.time"
              type="daterange"
              :editable="false" :clearable="false"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="抓拍区域：" label-width="80px">
            <el-radio-group v-model="searchForm.type" @change="areaTypeChanged">
              <el-radio :label="1">列表选择</el-radio>
              <el-radio :label="2" @click="alert(1)">地图选择</el-radio>
            </el-radio-group>
          </el-form-item>
            <el-form-item v-show="searchForm.type === 1">
              <el-select style="width: 100%;" v-model="searchForm.area" multiple collapse-tags placeholder="请选择区域" class="full">
                <el-option-group
                  v-for="group in areaList"
                  :key="group.areaName"
                  :label="group.areaName">
                  <el-option
                    v-for="item in group.areaTreeList"
                    :key="item.areaId"
                    :label="item.areaName"
                    :value="item.areaId">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item v-show="searchForm.type === 1">
              <el-select style="width: 100%;" v-model="searchForm.sex" placeholder="选择性别">
                <el-option :label="'不限'" :value="'不限'"></el-option>
                <el-option :label="'男'" :value="'男'"></el-option>
                <el-option :label="'女'" :value="'女'"></el-option>
                <el-option :label="'未知'" :value="'未知'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="searchForm.type === 1">
              <el-select style="width: 100%;" v-model="searchForm.age" placeholder="选择年龄段">
                <el-option :label="'不限'" :value="'不限'"></el-option>
                <el-option :label="'儿童'" :value="'儿童'"></el-option>
                <el-option :label="'少年'" :value="'少年'"></el-option>
                <el-option :label="'青年'" :value="'青年'"></el-option>
                <el-option :label="'中年'" :value="'中年'"></el-option>
                <el-option :label="'老年'" :value="'老年'"></el-option>
                <el-option :label="'未知'" :value="'未知'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="searchForm.type === 1">
              <el-select style="width: 100%;" v-model="searchForm.eyeglass" placeholder="选择眼镜">
                <el-option :label="'不限'" :value="'不限'"></el-option>
                <el-option :label="'戴眼镜'" :value="'戴眼镜'"></el-option>
                <el-option :label="'无眼镜'" :value="'无眼镜'"></el-option>
                <el-option :label="'未知'" :value="'未知'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="searchForm.type === 1">
              <el-select style="width: 100%;" v-model="searchForm.hat" placeholder="选择帽子">
                <el-option :label="'不限'" :value="'不限'"></el-option>
                <el-option :label="'戴帽子'" :value="'戴帽子'"></el-option>
                <el-option :label="'未戴帽子'" :value="'未戴帽子'"></el-option>
                <el-option :label="'未知'" :value="'未知'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="searchForm.type === 2">
              <div class="rlcx_dtxz_rst">
                已选<span>{{dSum}}</span>个设备<a href="javascript: void(0);" @click="openMap={}">重选</a>
              </div>
            </el-form-item>
          <el-form-item>
            <div style="text-align: center; padding-top: 10px;">
              <el-button @click="searchReset">&nbsp;&nbsp;重&nbsp;&nbsp;置&nbsp;&nbsp;</el-button>
              <el-button type="primary" @click="searchSubmit" :loading="searchLoading"
                :disabled="(searchForm.type === 2 && dSum <= 0) || (!searchForm.area || searchForm.area.length <= 0)">&nbsp;&nbsp;确&nbsp;&nbsp;定&nbsp;&nbsp;</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="rlcx_r" :class="{'rlcx_r_list_empty': pagination.total <= 0}">
        <span class="rlcx_r_msg">检索结果<span>（{{pagination.total}}）</span></span>
        <div class="rlcx_r_order">
          <ul>
            <li @click="orderHandler(1)" :class="{'rlcx_r_order_sed': orderType === 1}">时间排序&nbsp;<i class="el-icon-arrow-down" :class="{'rlcx_r_order_up': order === 2}"></i></li>
            <li @click="orderHandler(2)" :class="{'rlcx_r_order_sed': orderType === 2}">监控排序&nbsp;<i class="el-icon-arrow-down" :class="{'rlcx_r_order_up': order === 2}"></i></li>
            <span :class="{'rlcx_r_order_line2': orderType === 2}"></span>
          </ul>
        </div>
        <ul class="rlcx_r_list clearfix" v-if="dataList && dataList.length > 0">
          <li v-for="(item, index) in dataList" :key="'tzsr_list_' + index" @click="goToDetail(item)">
            <div>
              <img :src="item.subStoragePath" :alt="item.deviceName">
              <div>
                <h4>检索资料</h4>
                <div><i class="vl_icon rlcx_sj"></i>{{item.shotTime}}</div>
                <div class="com_ellipsis"><i class="vl_icon rlcx_sxt"></i>{{item.deviceName}}</div>
              </div>
            </div>
          </li>
        </ul>
        <ul class="rlcx_r_list clearfix" v-else>
          <li style="padding: 30px 0 0 0; width: auto; float: none; text-align: center; color: #999;">
            暂无数据
          </li>
        </ul>
        <div v-show="pagination.total > 0" style="text-align: center; padding: 10px 0 20px 0;">
          <el-pagination
            class="dl_hi_pa"
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 详情 -->
    <portraitDetail :open="showDetail" @closeDialog="onCloseDetail" :detailData="deData" :scrollData="seData" ></portraitDetail>
    <!-- D设备 B卡口  这里是设备和卡口 -->
    <div is="mapSelector" :open="openMap" :clear="msClear" :showTypes="'DB'" @mapSelectorEmit="mapSelectorEmit"></div>
  </div>
</template>
<script>
import { mapXupuxian } from "@/config/config.js";
import vehicleBreadcrumb from './breadcrumb.vue';
import mapSelector from '@/components/common/mapSelector.vue';
import {getFaceRetrieval, getFaceRetrievalPerson} from '../../api/api.judge.js';
import { getDeviceByBayonetUids } from "@/views/index/api/api.base.js";
import { MapGETmonitorList } from "@/views/index/api/api.map.js";
import {formatDate} from '@/utils/util.js';
import portraitDetail from '@/components/common/portraitDetail.vue';
export default {
  components: {vehicleBreadcrumb, mapSelector,portraitDetail},
  data () {
    return {
      showDetail:false,
       deData:null,
      seData:null,
      searchForm: {
        time: [new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), new Date()],
        type: 1, // 列表选择 地图选择
        area: [],
        sex: '',
        age: '',
        eyeglass: '',
        hat: '',
      },
      areaList: [],
      areaSData: [],
      searchLoading: false,
      dataList: [],
      orderType: 1, // 1时间排序 2监控排序
      order: 1, // 1desc 2asc
      pagination: {
        currentPage: 1,
        pageSize: 12,
        total: 0
      },

      dSum: 0, // 设备总数
      dIds: [], // 设备IDS

      openMap: false,
      msClear: {},

      pickerOptions: {
        disabledDate (d) {
          return d > new Date() || d < new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
        }
      }
    }
  },
  created () {
    this.getMapGETmonitorList();
  },
  methods: {
    onCloseDetail () {
      this.showDetail=false
    },
    goToDetail(v){
      // console.log(v);
      this.showDetail=true;
      this.deData = v
      this.seData = this.dataList
      
    },
    //查询行政区域
    getMapGETmonitorList(){
      let d={
        areaUid: mapXupuxian.adcode
      }
      MapGETmonitorList(d).then(res=>{
        if(res && res.data){
          res.data.areaTreeList.forEach(x => {
            this.areaSData.push(x.areaId);
          })
          this.searchForm.area = this.areaSData;
          this.areaList.push(res.data);
          this.$nextTick(() => {
            this.searchSubmit();
          });
        }
      })
    },
    mapSelectorEmit (result) {
      console.log('mapSelectorEmit', result);
      if (result) {
        // bayonetList deviceList
        this.dSum = 0;
        this.dIds = [];
        if (result.deviceList) {
          this.dSum = result.deviceList.length;
          for (let i = 0; i < result.deviceList.length; i++) {
            this.dIds.push(result.deviceList[i].uid);
          }
        }
        if (result.bayonetList && result.bayonetList.length > 0) {
          this.dSum += result.bayonetList.length;
        }
        if (result.bayonetDeviceList && result.bayonetDeviceList.length > 0) {
          this.dSum += result.bayonetDeviceList.length;
          for (let i = 0; i < result.bayonetDeviceList.length; i++) {
            this.dIds.push(result.bayonetDeviceList[i].uid);
          }
        }
      }
    },

    areaTypeChanged (val) {
      if (val === 2) {
        this.openMap = !this.openMap;
      }
    },
    searchSubmit () {
      this.searchLoading = true;
      let params = {
        where: {
          startDate: formatDate(this.searchForm.time[0], 'yyyy-MM-dd 00:00:00'),
          endDate: formatDate(this.searchForm.time[1], 'yyyy-MM-dd 23:59:59')
        },
        orderBy: this.orderType === 1 ? 'shotTime' : 'deviceNamePinyin',
        order: this.order === 1 ? 'desc' : 'asc',
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      }
      if (this.searchForm.type === 1) {
        params.where = Object.assign(params.where, {
          areaUid: this.searchForm.area.join(',')
        });
        if (this.searchForm.sex !== '不限') {
          params.where.sex = this.searchForm.sex;
        }
        if (this.searchForm.eyeglass !== '不限') {
          params.where.glasses = this.searchForm.eyeglass;
        }
        if (this.searchForm.age !== '不限') {
          params.where.age = this.searchForm.age;
        }
        if (this.searchForm.hat !== '不限') {
          params.where.hat = this.searchForm.hat;
        }
      } else if (this.searchForm.type === 2) {
        params.where = Object.assign(params.where, {
          deviceIds: this.dIds.join(',')
        });
      }
      // getFaceRetrieval getFaceRetrievalPerson
      getFaceRetrievalPerson(params).then(res => {
        if (res && res.data) {
          this.dataList = res.data.list;
          this.pagination.total = res.data.total;
        }
        this.searchLoading = false;
      }).catch(() => {
        this.searchLoading = false;
      });
    },
    searchReset () {
      if (this.searchForm.type === 1) {
        this.searchForm  = Object.assign(this.searchForm, {
          time: [new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), new Date()],
          area: this.areaSData,
          sex: '',
          age: '',
          eyeglass: '',
          hat: '',
        });
      } else {
        this.msClear = {};
        this.dSum = 0;
        this.dIds = [];
      }
      
    },
    orderHandler (type) {
      if (type === this.orderType) {
        if (this.order === 1) {
          this.order = 2;
        } else {
          this.order = 1;
        }
      } else {
        this.orderType = type;
      }
      this.searchSubmit();
    },
    handleCurrentChange (val) {
      this.pagination.pageNum = val;
      this.searchSubmit();
    }
  }
}
</script>
<style lang="scss" scoped>
.rlcx_dtxz_rst {
  width: 100%;
  padding: 2px 15px; margin-top: 5px;
  background-color: #F5F7FA;
  color: #C0C4CC;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  > span {
    display: inline-block;
    padding: 0 3px;
    color: #333;
  }
  > a {
    display: inline-block;
    padding-left: 5px;
    color: #2580FC !important;
    text-decoration: none !important;
    font-style: italic;
    cursor: pointer;
  }
}
.rlcx_r_list_empty {
  background: url(../../../../assets/img/null-content.png) center center no-repeat;
}
.rlcx_main {
  height: 100%;
  padding-top: 50px;
}
.rlcx_l {
  float: left;
  width: 272px; height: 100%;
  padding: 20px 15px;
  background-color: #fff;
  border-right: 1px solid #ddd;
  box-shadow:2px 3px 10px 0px rgba(131,131,131,0.28);
}
.rlcx_r {
  position: relative;
  height: 100%;
  margin-left: 273px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
  > .rlcx_r_list {
    padding: 5px;
    margin: 0 auto;
    > li {
      padding: 5px; 
      float: left;
      > div {
        position: relative;
        width: 336px; height: 166px;
        padding: 10px;
        background-color: #fff;
        box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
        > img {
          position: absolute; top: 10px; left: 10px;
          width: 146px; height: 146px;
        }
        > div {
          height: 100%;
          margin-left: 156px;
          > h4 {
            color: #999;
            margin-bottom: 10px;
          }
          > div {
            position: relative;
            height: 30px; line-height: 30px;
            margin-bottom: 10px; padding-left: 30px;
            overflow: hidden;
            font-size: 12px;
            background:rgba(250,250,250,1);
            border:1px solid rgba(242,242,242,1);
            border-radius:3px;
            > i {
              position: absolute; top: 7px; left: 10px;
              width: 12px; height: 15px;
              &.rlcx_sxt { background-position: -325px -377px; }
              &.rlcx_sj { background-position: -787px -376px; }
            }
          }
        }
      }
    }
  }
  > .rlcx_r_msg {
    position: absolute; top: 20px; left: 20px;
    color: #333;
    > span { color: #666; }
  }
  > .rlcx_r_order {
    padding-top: 20px; padding-bottom: 10px;
    > ul {
      position: relative;
      margin: 0 auto;
      width: 200px;
      overflow: hidden;
      > li {
        width: 100px; height: 40px;
        float: left;
        text-align: center;
        cursor: pointer;
        font-size: 15px;
        transition: all .3s ease-out;
        > i {
          opacity: 0;
          transition: all .3s ease-out;
          &.rlcx_r_order_up {
            transform: rotate(180deg);
          } 
        }
        &.rlcx_r_order_sed {
          cursor: default;
          color: #2580FC;
          > i {
            opacity: 1;
            cursor: pointer;
          }
        }
      }
      > span {
        position: absolute; bottom: 5px; left: 8px;
        width: 80px; height: 2px;
        overflow: hidden;
        background-color: #2580FC;
        transition: all .3s ease-out;
        &.rlcx_r_order_line2 {
          left: 108px;
        }
      }
    }
  }
}
@media screen and (max-width: 1000px ){ .rlcx_r_list { width: 700px; } }
@media screen and (min-width: 1001px) and (max-width: 1800px){.rlcx_r_list { width: 1050px; }}
@media screen and (min-width: 1801px) {.rlcx_r_list { width: 1400px; }}
</style>
<style lang="scss">
.pt_rlcx_fm {
  .el-form-item{
    margin-bottom: 6px;
  }
  .el-form-item__label {
    padding-right: 5px;
  }
  .el-radio {
    margin-right: 5px;
  }
  .el-radio__label {
    padding-left: 0px;
  }
}
</style>
