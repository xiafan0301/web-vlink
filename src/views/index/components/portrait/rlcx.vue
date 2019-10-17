<template>
  <div class="portrait_content">
    <div class="vc_gcck_bd">
      <div is="vehicleBreadcrumb" :breadcrumbData="[{name: '人像侦查', routerName: 'portrait'}, {name: '特征搜人'}]"></div>
    </div>
    <div class="rlcx_main clearfix">
      <div class="rlcx_l">
        <el-form ref="form" class="pt_rlcx_fm" :model="searchForm">
          <el-form-item>
            <el-date-picker
              class="vl_date"
              style="width: 100%;"
              v-model="searchForm.time[0]"
              type="datetime"
              time-arrow-control
              :editable="false" :clearable="false"
              :picker-options="startTimeOptions"
              range-separator="至"
              placeholder="开始日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              class="vl_date vl_date_end"
              style="width: 100%;"
              v-model="searchForm.time[1]"
              type="datetime"
              time-arrow-control
              :editable="false" :clearable="false"
              :picker-options="endTimeOptions"
              range-separator="至"
              placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-show="searchForm.type === 0">
            <div class="rlcx_xzsb_s" @click="areaTypeChanged">
              <span>选择设备</span>
              <span class="el-icon-arrow-down"></span>
            </div>
          </el-form-item>
            <el-form-item v-show="searchForm.type === 2">
              <div class="rlcx_dtxz_rst">
                已选<span>{{dSum}}</span>个设备<a href="javascript: void(0);" @click="openMap={}">重选</a>
              </div>
            </el-form-item>

            <el-form-item>
              <el-radio-group v-model="searchForm.type2" @change="areaTypeChanged2">
                <el-radio style="margin-left: 20px;" :label="1">从图片提取</el-radio>
                <el-radio style="margin-left: 20px;" :label="2">自定义特征</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item v-show="searchForm.type2 === 1" style="text-align: center;">
              <div style="padding: 0 15px; height: 210px;">
                <div is="vlUpload" :clear="uploadClear" @uploadEmit="uploadEmit" :imgData="imgData"></div>
              </div>
            </el-form-item>
            <el-form-item v-show="searchForm.type2 === 1" style="text-align: center; padding: 10px 15px 0 15px;">
              <el-button style="width: 100%;" :type="curImageUrl ? 'primary' : ''" :disabled="!curImageUrl" @click="fnHqtz" :loading="hqtzLoading">&nbsp;&nbsp;获取特征&nbsp;&nbsp;</el-button>
              <ul class="up_tz_list" v-if="uploadTZObj">
                <li v-if="uploadTZObj.sex" @click="uploadTZObj.sex.active = !uploadTZObj.sex.active" :class="{'up_tz_list_sed': uploadTZObj.sex.active}">{{uploadTZObj.sex.value}}</li>
                <li v-if="uploadTZObj.age" @click="uploadTZObj.age.active = !uploadTZObj.age.active" :class="{'up_tz_list_sed': uploadTZObj.age.active}">{{uploadTZObj.age.value}}</li>
                <li v-if="uploadTZObj.hair" @click="uploadTZObj.hair.active = !uploadTZObj.hair.active" :class="{'up_tz_list_sed': uploadTZObj.hair.active}">{{uploadTZObj.hair.value}}</li>
                <li v-if="uploadTZObj.glasses" @click="uploadTZObj.glasses.active = !uploadTZObj.glasses.active" :class="{'up_tz_list_sed': uploadTZObj.glasses.active}">{{uploadTZObj.glasses.value}}</li>
                <li v-if="uploadTZObj.hat" @click="uploadTZObj.hat.active = !uploadTZObj.hat.active" :class="{'up_tz_list_sed': uploadTZObj.hat.active}">{{uploadTZObj.hat.value}}</li>
                <li v-if="uploadTZObj.mask" @click="uploadTZObj.mask.active = !uploadTZObj.mask.active" :class="{'up_tz_list_sed': uploadTZObj.mask.active}">{{uploadTZObj.mask.value}}</li>
                <li v-if="uploadTZObj.baby" @click="uploadTZObj.baby.active = !uploadTZObj.baby.active" :class="{'up_tz_list_sed': uploadTZObj.baby.active}">{{uploadTZObj.baby.value}}</li>
                <li v-if="uploadTZObj.bag" @click="uploadTZObj.bag.active = !uploadTZObj.bag.active" :class="{'up_tz_list_sed': uploadTZObj.bag.active}">{{uploadTZObj.bag.value}}</li>
                <li v-if="uploadTZObj.upperType" @click="uploadTZObj.upperType.active = !uploadTZObj.upperType.active" :class="{'up_tz_list_sed': uploadTZObj.upperType.active}">{{uploadTZObj.upperType.value}}</li>
                <li v-if="uploadTZObj.upperColor" @click="uploadTZObj.upperColor.active = !uploadTZObj.upperColor.active" :class="{'up_tz_list_sed': uploadTZObj.upperColor.active}">{{'上身颜色：' + uploadTZObj.upperColor.value}}</li>
                <li v-if="uploadTZObj.bottomType" @click="uploadTZObj.bottomType.active = !uploadTZObj.bottomType.active" :class="{'up_tz_list_sed': uploadTZObj.bottomType.active}">{{uploadTZObj.bottomType.value}}</li>
                <li v-if="uploadTZObj.bottomColor" @click="uploadTZObj.bottomColor.active = !uploadTZObj.bottomColor.active" :class="{'up_tz_list_sed': uploadTZObj.bottomColor.active}">{{'下身颜色：' + uploadTZObj.bottomColor.value}}</li>
              </ul>
            </el-form-item>

            <el-form-item v-show="searchForm.type2 === 2">
              <el-select style="width: 100%;" v-model="searchForm.sex" placeholder="选择性别">
                <el-option :label="'不限'" :value="'不限'"></el-option>
                <el-option :label="'男'" :value="'男'"></el-option>
                <el-option :label="'女'" :value="'女'"></el-option>
                <el-option :label="'未知'" :value="'未知'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="searchForm.type2 === 2">
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
            <el-form-item v-show="searchForm.type2 === 2">
              <el-select style="width: 100%;" v-model="searchForm.hair" placeholder="选择发型">
                <el-option :label="'不限'" :value="'不限'"></el-option>
                <el-option :label="'长发'" :value="'长发'"></el-option>
                <el-option :label="'短发'" :value="'短发'"></el-option>
                <el-option :label="'平头'" :value="'平头'"></el-option>
                <el-option :label="'光头'" :value="'光头'"></el-option>
                <el-option :label="'未知'" :value="'未知'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="searchForm.type2 === 2">
              <el-select style="width: 100%;" v-model="searchForm.eyeglass" placeholder="选择眼镜">
                <el-option :label="'不限'" :value="'不限'"></el-option>
                <el-option :label="'戴眼镜'" :value="'戴眼镜'"></el-option>
                <el-option :label="'无眼镜'" :value="'无眼镜'"></el-option>
                <el-option :label="'未知'" :value="'未知'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="searchForm.type2 === 2">
              <el-select style="width: 100%;" v-model="searchForm.hat" placeholder="选择帽子">
                <el-option :label="'不限'" :value="'不限'"></el-option>
                <el-option :label="'戴帽子'" :value="'戴帽子'"></el-option>
                <el-option :label="'未戴帽子'" :value="'未戴帽子'"></el-option>
                <el-option :label="'未知'" :value="'未知'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="searchForm.type2 === 2">
              <el-select style="width: 100%;" v-model="searchForm.mask" placeholder="选择口罩">
                <el-option :label="'不限'" :value="'不限'"></el-option>
                <el-option :label="'戴口罩'" :value="'戴口罩'"></el-option>
                <el-option :label="'未戴口罩'" :value="'未戴口罩'"></el-option>
                <el-option :label="'未知'" :value="'未知'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="searchForm.type2 === 2">
              <el-select style="width: 100%;" v-model="searchForm.baby" placeholder="选择抱小孩">
                <el-option :label="'不限'" :value="'不限'"></el-option>
                <el-option :label="'抱小孩'" :value="'抱小孩'"></el-option>
                <el-option :label="'未抱小孩'" :value="'未抱小孩'"></el-option>
                <el-option :label="'未知'" :value="'未知'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="searchForm.type2 === 2">
              <el-select style="width: 100%;" v-model="searchForm.bag" placeholder="选择拎东西">
                <el-option :label="'不限'" :value="'不限'"></el-option>
                <el-option :label="'拎东西'" :value="'拎东西'"></el-option>
                <el-option :label="'未拎东西'" :value="'未拎东西'"></el-option>
                <el-option :label="'未知'" :value="'未知'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="searchForm.type2 === 2">
              <el-select style="width: 100%;" v-model="searchForm.upperType" placeholder="选择上身款式">
                <el-option :label="'不限'" :value="'不限'"></el-option>
                <el-option :label="'长袖'" :value="'长袖'"></el-option>
                <el-option :label="'短袖'" :value="'短袖'"></el-option>
                <el-option :label="'未知'" :value="'未知'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="searchForm.type2 === 2">
              <el-select style="width: 100%;" v-model="searchForm.upperColor" placeholder="选择上身颜色">
                <el-option :label="'不限'" :value="'不限'"></el-option>
                <el-option :label="'红'" :value="'红'"></el-option>
                <el-option :label="'黑'" :value="'黑'"></el-option>
                <el-option :label="'灰'" :value="'灰'"></el-option>
                <el-option :label="'白'" :value="'白'"></el-option>
                <el-option :label="'绿'" :value="'绿'"></el-option>
                <el-option :label="'未知'" :value="'未知'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="searchForm.type2 === 2">
              <el-select style="width: 100%;" v-model="searchForm.bottomType" placeholder="选择下身款式">
                <el-option :label="'不限'" :value="'不限'"></el-option>
                <el-option :label="'裙子'" :value="'裙子'"></el-option>
                <el-option :label="'长裤'" :value="'长裤'"></el-option>
                <el-option :label="'未知'" :value="'未知'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="searchForm.type2 === 2">
              <el-select style="width: 100%;" v-model="searchForm.bottomColor" placeholder="选择下身颜色">
                <el-option :label="'不限'" :value="'不限'"></el-option>
                <el-option :label="'红'" :value="'红'"></el-option>
                <el-option :label="'黑'" :value="'黑'"></el-option>
                <el-option :label="'灰'" :value="'灰'"></el-option>
                <el-option :label="'白'" :value="'白'"></el-option>
                <el-option :label="'绿'" :value="'绿'"></el-option>
                <el-option :label="'未知'" :value="'未知'"></el-option>
              </el-select>
            </el-form-item>
          <el-form-item>
            <div style="text-align: center; padding-top: 10px;">
              <el-button @click="searchReset">&nbsp;&nbsp;重&nbsp;&nbsp;置&nbsp;&nbsp;</el-button>
              <el-button type="primary" @click="searchSubmit(1)" :loading="searchLoading">&nbsp;&nbsp;确&nbsp;&nbsp;定&nbsp;&nbsp;</el-button>
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
          <li v-for="(item, index) in dataList" :key="'tzsr_list_' + index" @click="goToDetail(item, index)">
            <div>
              <img :src="item.subStoragePath" :alt="item.deviceName"
                @dragstart="dragStart($event, item)" @dragend="dragEnd"
                draggable="true" style="cursor: move;">
              <div>
                <h4>检索资料</h4>
                <div><i class="vl_icon rlcx_sj"></i>{{item.shotTime}}</div>
                <div class="com_ellipsis"><i class="vl_icon rlcx_sxt"></i>{{item.deviceName}}</div>
              </div>
            </div>
          </li>
        </ul>
        <div style="height: calc(100% - 100px);" is="noResult" :isInitPage="isInitPage" v-else></div>
        <!-- <ul class="rlcx_r_list clearfix" v-else>
          <li style="padding: 30px 0 0 0; width: auto; float: none; text-align: center; color: #999;">
            暂无数据
          </li>
        </ul> -->
        <div v-show="pagination.total > 0" style="text-align: center; padding: 10px 0 20px 0;">
          <el-pagination
            class="dl_hi_pa"
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page="pagination.pageNum"
            :page-size="pagination.pageSize"
            :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 详情 -->
    <portraitDetail :detailData="detailData"></portraitDetail>
    <!-- D设备 B卡口  这里是设备和卡口 -->
    <div
      is="mapSelector"
      :open="openMap"
      :clear="msClear"
      :showTypes="'DB'"
      @mapSelectorEmit="mapSelectorEmit">
    </div>
    <!-- 框选搜索主体弹框 -->
    <div is="imgSelect" :open="isOpenImgDialog" @emitImgData="emitImgData"></div>
  </div>
</template>
<script>
import noResult from '@/components/common/noResult.vue';
import imgSelect from '@/components/common/imgSelect.vue';
import { mapXupuxian } from "@/config/config.js";
import vehicleBreadcrumb from '@/components/common/breadcrumb.vue';
import mapSelector from '@/components/common/mapSelector.vue';
import vlUpload from '@/components/common/upload.vue';
import {getFaceRetrievalPerson, JtcGETAppendixInfoList} from '../../api/api.judge.js';
import {getPicRecognize} from '../../api/api.structuring.js';
import { MapGETmonitorList } from "@/views/index/api/api.map.js";
import {formatDate, dateOrigin} from '@/utils/util.js';
import portraitDetail from './common/portraitDetail.vue';
import {ajaxCtx} from '@/config/config';
export default {
  components: { vehicleBreadcrumb, mapSelector, vlUpload, portraitDetail, noResult, imgSelect },
  data () {
    return {

      isOpenImgDialog: false, // 是否显示框选弹框

      isInitPage: true,

      curImageUrl: '', // 当前上传的图片
      uploadClear: {},
      hqtzLoading: false,

      uploadTZObj: {
        sex: null,
        age: null,
        glasses: null,
        hat: null,
        mask: null,
        hair: null,
        upperType: null,
        upperColor: null,
        bottomType: null,
        bottomColor: null,
        baby: null,
        bag: null
      },

      checkAll: true,
      isIndeterminate: false,

      showDetail:false,
      deData:null,
      seData:null,
      searchForm: {
        time: [dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)), new Date()],
        type: 0, // 1列表选择 2地图选择
        type2: 1, // 1图片  2自定义
        area: [],
        sex: '',
        age: '',
        eyeglass: '',
        hat: '',
        mask: '',
        hair: '',
        upperType: '',
        upperColor: '',
        bottomType: '',
        bottomColor: '',
        baby: '',
        bag: ''
      },
      areaList: [],
      areaSData: [],
      searchLoading: false,
      dataList: [],
      orderType: 1, // 1时间排序 2监控排序
      order: 1, // 1desc 2asc
      pagination: {
        pageNum: 1,
        pageSize: 12,
        total: 0
      },

      dSum: 0, // 设备总数
      dIds: [], // 设备IDS

      openMap: false,
      msClear: {},

      startTimeOptions: {
        disabledDate: (d) => {
          // console.log(d);
          // d > new Date() || d > this.endTime
          if (d > new Date()) {
            return true;
          } else {
            return false;
          }
        }
      },
      endTimeOptions: {
        disabledDate: (d) => {
          if (d > new Date() || d.getTime() < (this.searchForm.time[0].getTime() - 24 * 60 * 60 * 1000 + 2000)) {
            return true;
          } else {
            return false;
          }
        }
      },

      pickerOptions: {
        disabledDate (d) {
          return d > new Date() || d < new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
        }
      },
      condition:{},

      detailData: null,

      imgData: {}
    }
  },
  created () {
    this.getMapGETmonitorList();

  },
  methods: {
    emitImgData (obj) {
      this.isOpenImgDialog = obj.open;
      if (obj.imgPath) {
        this.curImageUrl = obj.imgPath;
        this.imgData = {
          path: obj.imgPath
        }
      }
    },
    // 拖拽开始
    dragStart (ev, item) {
      if (item && item.subStoragePath) {
         if (!ev) { ev = window.event; }
        ev.dataTransfer.setData('upload_pic_url', item.subStoragePath); // 设置属性dataTransfer   两个参数   1：key   2：value
      }
    },
    dragEnd () {
      // console.log('drag end')
      // this.dragActiveObj = null;
    },

    uploadEmit (data) {
      console.log('uploadEmit data', data);
      if (data && data.path) {
        this.curImageUrl = data.path;
      } else {
        this.curImageUrl = null;
        this.hqtzLoading = false;
        this.uploadTZObj = {};
      }
    },
    // 获取特征
    fnHqtz () {
      this.hqtzLoading = true;
      this.uploadTZObj = {
        sex: null,
        age: null,
        glasses: null,
        hat: null,
        mask: null,
        hair: null,
        upperType: null,
        upperColor: null,
        bottomType: null,
        bottomColor: null,
        baby: null,
        bag: null
      }
      getPicRecognize({
        bussType: 'person', // vehicle机动车、face人脸、person人体
        url: this.curImageUrl
      }).then(jRes => {
        if (jRes && jRes.data && this.curImageUrl) {
          this.uploadTZObj = {
            sex: {active: true, value: jRes.data.sex},
            age: {active: true, value: jRes.data.age},
            glasses: {active: true, value: jRes.data.glasses},
            hat: {active: true, value: jRes.data.hat},
            mask: {active: true, value: jRes.data.mask},
            hair: {active: true, value: jRes.data.hair},
            upperType: {active: true, value: jRes.data.upperType},
            upperColor: {active: true, value: jRes.data.upperColor},
            bottomType: {active: true, value: jRes.data.bottomType},
            bottomColor: {active: true, value: jRes.data.bottomColor},
            baby: {active: true, value: jRes.data.baby},
            bag: {active: true, value: jRes.data.bag}
          }
        }
        this.hqtzLoading = false;
      }).catch(() => {
        this.hqtzLoading = false;
      })
    },

    handleCheckAllChange (val) {
      this.searchForm.area = val ? this.areaSData : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.areaSData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.areaSData.length;
    },
    onCloseDetail () {
      this.showDetail=false
    },
    goToDetail(v, index){
      // console.log(v);
      /* type: 1, // 1特征搜人 2

      params: {}, // 查询参数
      list: // 列表
      index: // 第几个
      pageSize: //
      total: // 
      pageNum: // */
      this.detailData = {
        type: 1, // 1特征搜人 2
        params: this.searchParams(), // 查询参数
        list: this.dataList, // 列表
        index: index, // 第几个
        pageSize: this.pagination.pageSize,
        total: this.pagination.total,
        pageNum: this.pagination.pageNum
      }
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
          /* this.$nextTick(() => {
            this.searchSubmit();
          }); */
        }
      })
    },
    mapSelectorEmit (result) {
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
//        if (result.bayonetDeviceList && result.bayonetDeviceList.length > 0) {
//          this.dSum += result.bayonetDeviceList.length;
//          for (let i = 0; i < result.bayonetDeviceList.length; i++) {
//            this.dIds.push(result.bayonetDeviceList[i].uid);
//          }
//        }
      }
    },

    areaTypeChanged () {
      this.searchForm.type = 2;
      this.openMap = !this.openMap;
    },
    areaTypeChanged2 (val) {
    },
    searchAble () {
      let flag = false, msg = '';
      if (this.dSum <= 0) {
        return '请选择设备';
      }
      if (this.searchForm.type2 === 1) {
        let f = false;
        for (let _key in this.uploadTZObj) {
          if (this.uploadTZObj[_key] && this.uploadTZObj[_key].active) {
            f = true;
            break;
          }
        }
        if (!f) { return '请选择特征'; }
      }
      if (this.searchForm.type2 === 2) {
        let f = false;
        if (this.searchForm.sex) { f = true; }
        if (this.searchForm.age) { f = true; }
        if (this.searchForm.eyeglass) { f = true; }
        if (this.searchForm.hat) { f = true; }
        if (this.searchForm.mask) { f = true; }
        if (this.searchForm.hair) { f = true; }
        if (this.searchForm.upperType) { f = true; }
        if (this.searchForm.upperColor) { f = true; }
        if (this.searchForm.bottomType) { f = true; }
        if (this.searchForm.bottomColor) { f = true; }
        if (this.searchForm.baby) { f = true; }
        if (this.searchForm.bag) { f = true; }
        if (!f) { return '请选择特征'; }
      }
      return false;
    },
    searchParams () {
      let params = {
        where: {
          startDate: formatDate(this.searchForm.time[0]),
          endDate: formatDate(this.searchForm.time[1])
        },
        orderBy: this.orderType === 1 ? 'shotTime' : 'deviceNamePinyin',
        order: this.order === 1 ? 'desc' : 'asc'
      };
      if (this.searchForm.type === 1) {
        params.where = Object.assign(params.where, {
          areaUid: this.searchForm.area.join(',')
        });
      } else if (this.searchForm.type === 2) {
        params.where = Object.assign(params.where, {
          deviceIds: this.dIds.join(',')
        });
      }
      if (this.searchForm.type2 === 1) {
        let _o = {};
        for (let _key in this.uploadTZObj) {
          if (this.uploadTZObj[_key] && this.uploadTZObj[_key].active) {
            _o[_key] = this.uploadTZObj[_key].value;
          }
          params.where = Object.assign(params.where, _o);
        }
      } else {
        if (this.searchForm.sex && this.searchForm.sex !== '不限') {
          params.where.sex = this.searchForm.sex;
        }
        if (this.searchForm.age && this.searchForm.age !== '不限') {
          params.where.age = this.searchForm.age;
        }
        if (this.searchForm.eyeglass && this.searchForm.eyeglass !== '不限') {
          params.where.glasses = this.searchForm.eyeglass;
        }
        if (this.searchForm.hat && this.searchForm.hat !== '不限') {
          params.where.hat = this.searchForm.hat;
        }
        if (this.searchForm.mask && this.searchForm.mask !== '不限') {
          params.where.mask = this.searchForm.mask;
        }
        if (this.searchForm.hair && this.searchForm.hair !== '不限') {
          params.where.hair = this.searchForm.hair;
        }
        if (this.searchForm.upperType && this.searchForm.upperType !== '不限') {
          params.where.upperType = this.searchForm.upperType;
        }
        if (this.searchForm.upperColor && this.searchForm.upperColor !== '不限') {
          params.where.upperColor = this.searchForm.upperColor;
        }
        if (this.searchForm.bottomType && this.searchForm.bottomType !== '不限') {
          params.where.bottomType = this.searchForm.bottomType;
        }
        if (this.searchForm.bottomColor && this.searchForm.bottomColor !== '不限') {
          params.where.bottomColor = this.searchForm.bottomColor;
        }
        if (this.searchForm.baby && this.searchForm.baby !== '不限') {
          params.where.baby = this.searchForm.baby;
        }
        if (this.searchForm.bag && this.searchForm.bag !== '不限') {
          params.where.bag = this.searchForm.bag;
        }
      }
      return params;
    },
    searchSubmit (pageNum) {
      let smsg = this.searchAble();
      if (smsg) {
        let nMsg = $('.el-message--info');
        if (nMsg && nMsg.length > 0) {
          nMsg.find('.el-message__content').text(smsg);
        } else {
          this.$message({
            message: smsg,
            type: 'info'
          });
        }
        return false;
      }

      if (pageNum > 0) {
        this.pagination.pageNum = pageNum;
      }
      this.searchLoading = true;
      let params = Object.assign(this.searchParams(), {
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      });
      // this.condition=params
      getFaceRetrievalPerson(params).then(res => {
        this.isInitPage = false;
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
      this.searchForm.time = [new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), new Date()];
      if (this.searchForm.type === 1) { // 列表选择
        this.isIndeterminate = false;
        this.checkAll = true;
        this.searchForm.area = this.areaSData;
      } else { // 地图选择
        this.msClear = {};
        this.dSum = 0;
        this.dIds = [];
      }
      if (this.searchForm.type2 === 1) {
        this.curImageUrl = '';
        this.uploadClear = {};
        this.uploadTZObj = {
          sex: null,
          age: null,
          glasses: null,
          hat: null,
          mask: null,
          hair: null,
          upperType: null,
          upperColor: null,
          bottomType: null,
          bottomColor: null,
          baby: null,
          bag: null
        }
      } else {
        this.searchForm  = Object.assign(this.searchForm, {
          sex: '',
          age: '',
          eyeglass: '',
          hat: '',
          mask: '',
          hair: '',
          upperType: '',
          upperColor: '',
          bottomType: '',
          bottomColor: '',
          baby: '',
          bag: ''
        });
      }
      this.dataList = [];
      this.isInitPage = true;
      this.pagination.pageNum = 1;
      this.pagination.total = 0;
      // this.searchSubmit();
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
.rlcx_xzsb_s {
  height: 40px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  cursor: pointer;
  color: #999999;
  padding: 0 6px;
  > span {
    display: inline-block;
    width: 50%;
    &:last-child {
      text-align: right;
    }
  }
}
.vc_gcck_bd {
  position: absolute; top: 0; left: 0;
  width: 100%;
}
.up_tz_list {
  padding-top: 5px;
  overflow: hidden;
  > li {
    float: left;
    padding: 0 10px; margin: 4px 5px;
    height: 26px; line-height: 24px;
    background-color:#F2F2F2;
    border:1px solid rgba(242,242,242,1);
    border-radius:3px;
    font-size: 12px;
    cursor: pointer;
    &.up_tz_list_sed {
      background-color: #0C70F8; color: #fff;
    }
  }
}
.rlcx_dtxz_rst {
  width: 100%;
  padding: 0px 15px; margin-top: 5px;
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
    /*font-style: italic;*/
    cursor: pointer;
  }
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
  overflow: auto;
  overflow-x: hidden; overflow-y: auto;
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
    margin-bottom: 10px;
  }
  .el-form-item__label {
    text-align: left;
    padding-right: 0;
  }
  .el-radio {
    margin-right: 5px;
  }
  .el-radio__label {
    padding-left: 0px;
  }
}
</style>
