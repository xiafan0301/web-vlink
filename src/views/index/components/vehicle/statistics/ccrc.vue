<template>
  <div class="ccrc">
    <div class="ccrc_breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/vehicle/menu' }"><span style="color: #999999">车辆侦查</span></el-breadcrumb-item>
          <el-breadcrumb-item>入城统计</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="ccrc_content">
      <div class="ccrc_content_left">
        <div class="kaishi">
          <el-date-picker
              v-model="value1"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
              style="width: 230px; vertical-align: top"
              class="full vl_date"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="jiesu">
          <el-date-picker
              v-model="value2"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions1"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="full vl_date vl_date_end"
              style="width: 230px; vertical-align: top"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="kakou">
          <el-select v-model="lll" placeholder="请选择卡口" style="width: 230px" multiple collapse-tags @change="selchange">
            <el-option key="全选" lable="全选" value="全选"  :class="{selected: showselected}"></el-option>
            <el-option
                v-for="item in kakou"
                :key="item.uid"
                :label="item.bayonetName"
                :value="item.uid">
            </el-option>
          </el-select>
<!--          <div class="search_item" v-show="isShowSelectList">-->
<!--            <vue-scroll>-->
<!--              <el-checkbox-->
<!--                  :indeterminate="isIndeterminateBayonet"-->
<!--                  v-model="checkAllTreeBayonet"-->
<!--                  @change="handleCheckedAllBayonet"-->
<!--              >全选</el-checkbox>-->
<!--              <el-tree-->
<!--                  @check="listenCheckedBayonet"-->
<!--                  :data="bayonetTree"-->
<!--                  show-checkbox-->
<!--                  default-expand-all-->
<!--                  node-key="id"-->
<!--                  ref="bayonetTree"-->
<!--                  highlight-current-->
<!--                  :props="defaultProps">-->
<!--              </el-tree>-->
<!--            </vue-scroll>-->
<!--          </div>-->
        </div>
        <div class="kakou">
          <el-select
              v-model="carType"
              multiple
              collapse-tags
              class="width232"
              clearable
              placeholder="全部车辆分组"
              style="width: 230px"
          >
            <el-option
                v-for="item in vehicleClassOptions"
                :key="item.enumField"
                :label="item.enumValue"
                :value="item.enumField"
            ></el-option>
          </el-select>
        </div>
        <div class="cpai">
          <span style="display: inline-block; width: 42px;color: #999999">车牌：</span>
          <el-checkbox v-model="unvehicleFlag" style="float: right; margin-right: 3px"><span style="color: #999999;">排除</span></el-checkbox>
        </div>
        <div class="kakou">
          <el-input placeholder="请输入内容" v-model="vehicleNumber" class="input-with-select">
            <el-select v-model="v" slot="prepend" style="width: 62px;" class="selectet" :placeholder="null">
              <el-option
                  v-for="item in cityCode"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-input>
        </div>
        <div style="padding-top: 10px">
          <el-checkbox v-model="onlySurveillance"><span style="color: #999999">只查看初次入城记录</span></el-checkbox>
        </div>
        <div class="kakou">
          <el-button style="width: 110px" @click="reset">重置</el-button>
          <el-button type="primary" style="width: 110px" @click="tongji" :loading="searchLoading">查询</el-button>
        </div>
      </div>
      <div class="ccrc_content_right">
        <div class="ccrc_content_right_content">
          <div class="ccrc_content_right_table" v-loading = "searchLoading">
            <el-table
                :data="tableData"
                style="width: 100%">
              <el-table-column
                  type="index"
                  prop="date"
                  width="80px"
                  label="序号">
              </el-table-column>
              <el-table-column
                  prop="plateNo"
                  label="车牌号码">
              </el-table-column>
              <el-table-column
                  prop="bayonetName"
                  label="卡口名称"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  prop="shotTime"
                  width="240"
                  label="抓拍时间">
              </el-table-column>
              <el-table-column
                  prop="vehicleColor"
                  label="车牌颜色"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  prop="isSurveillance"
                  label="布控库"
                  show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.isSurveillance">是</span>
                  <span v-else>否</span>
                </template>
              </el-table-column>
              <el-table-column
                  prop="vehicleClass"
                  label="车辆类型"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  label="操作">
                <template slot-scope="scope">
                  <span class="operation_btn" @click="onOpenDetail(scope.row)">查看</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
              class="cum_pagination"
              @current-change="handleCurrentChange"
              :current-page.sync="pagination.pageNum"
              :page-size="pagination.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="pagination.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog
        :visible.sync="strucDetailDialog"
        class="struc_detail_dialog"
        :close-on-click-modal="false"
        top="4vh"
        :show-close="false">
      <div class="struc_tab">
        <span :class="{'active': strucCurTab === 1}" @click="strucCurTab = 1">抓拍详情</span>
        <span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>
        <span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>
        <i class="el-icon-close" @click="onCloseDetail"></i>
      </div>
      <div class="struc_main">
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.subStoragePath" alt="" class="bigImg">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_qii struc_c_d_img">
              <img :src="sturcDetail.storagePath" alt="" class="bigImg">
              <span>全景图</span>
            </div>
            <div class="struc_c_d_info">
              <vue-scroll>
                <h2>抓拍信息</h2>
                <div class="struc_cdi_line">
                  <span><b>入城时间</b>{{sturcDetail.shotTime}}</span>
                </div>
                <div class="struc_cdi_line">
                  <span><b>入城卡口</b>{{sturcDetail.bayonetName}}</span>
                </div>
                <div class="struc_cdi_line">
                  <span><b>车牌号码</b>{{sturcDetail.plateNo}}</span>
                </div>
                <div class="struc_cdi_line">
                  <span><b>初次入城</b>{{sturcDetail.firstEnterFlag}}</span>
                </div>
                <div class="struc_cdi_line">
                  <span><b>号牌类型</b>{{sturcDetail.plateClass}}</span>
                </div>
                <div class="struc_cdi_line">
                  <span><b>号牌颜色</b>{{sturcDetail.plateColor}}</span>
                </div>
                <div class="struc_cdi_line">
                  <span><b>车辆类型</b>{{sturcDetail.vehicleClass}}</span>
                </div>
                <div class="struc_cdi_line">
                  <span><b>车辆型号</b>{{sturcDetail.vehicleBrand}}</span>
                </div>
                <div class="struc_cdi_line">
                  <span><b>车辆颜色</b>{{sturcDetail.vehicleColor}}</span>
                </div>
                <div class="struc_cdi_line">
                  <span><b>车辆分组</b>{{sturcDetail.vehicleStyles}}</span>
                </div>
              </vue-scroll>
            </div>
          </div>
        </div>
        <div v-show="strucCurTab === 2" class="struc_c_address">
          <div id="container"></div>
        </div>
        <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.subStoragePath" alt="" class="bigImg">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <span class="th-video-text">视频回放</span>
            <div is="flvplayer" :index="1" :oData="playUrl" :bResize="bResize" :oConfig="{sign: false, close: false, pause: true}" ></div>
          </div>
          <a class="download_btn" target="_blank" download="视频" :href="videoUrl">下载视频</a>
        </div>
      </div>
      <div class="struc-list">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in regulationsList" :key="index + 'isgm'">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
              <img style="display: block; width: 100%; height: .88rem;" :src="item.subStoragePath" alt="">
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapXupuxian } from "@/config/config";
import { MapGETmonitorList } from "@/views/index/api/api.map.js";
import { objDeepCopy, formatDate } from "@/utils/util.js";
import { JfoGETCity , getbayonet} from '../../../api/api.judge.js';
import { cityCode } from "@/utils/data.js";
import { getGroupsByType } from "@/views/index/api/api.js";
import flvplayer from '@/components/common/flvplayer.vue';
export default {
  components: {
    flvplayer
  },
  data () {
    return {
      pickerOptions: {
        disabledDate: time => {
          if (this.value2) {
            return (
              time.getTime() > new Date(this.value2).getTime() ||
              time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90
            );
          } else {
            return (
              time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90 ||
              time.getTime() > new Date().getTime()
            );
          }
        }
          // return  time.getTime() < new Date(new Date().getTime() - 90*86400000) || time.getTime() > new Date(new Date().getTime())
      },
      pickerOptions1: {
        disabledDate: time => {
          if (this.value1) {
            return (
              time.getTime() < new Date(this.value1).getTime() ||
              time.getTime() > new Date().getTime()
            );
          } else {
            return (
              time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 30 ||
              time.getTime() > new Date().getTime()
            );
          }
        }
      },
      searchLoading: false,
      kakou: [],
      v: '湘',
      lll: [],
      value1: '',
      value2: '',
      cityCode: [],
      bayonetTree: [],
      vehicleNumber: '',
      isIndeterminateBayonet: false,
      checkAllTreeBayonet: false,
      selectBayonetArr: [], // 选中的卡口数组
      selectVedioArr: [], // 选中的摄像头数组
      bayonetTreeNodeCount: 0, // 卡口节点数量
      selectDeviceArr: [], // 选中的设备数组
      unvehicleFlag: false,
      onlySurveillance: false,
      isShowSelectList: false,
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      tableData: [],
      tableDataAll: [],
      cities: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      showselected: true,
      vehicleClassOptions: [
        // 车辆类别下拉
        {
          enumField: "无牌车",
          enumValue: "无牌车"
        },
        {
          enumField: "布控库车辆",
          enumValue: "布控库车辆"
        }
      ],
      carType: [],
      regulationsList: [],
      sortTimeType: null, // 时间排序active
      sortMonitoryType: null, // 监控排序active
      /* 抓拍记录页面参数 */
      strucDetailDialog: false, // 抓拍记录弹窗
      strucCurTab: 1, // 抓拍记录弹窗tab
      curImgIndex: 0, // 当前选择的图片index
      strucInfoList: [{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县兴隆路5号154(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-03 16:12:44","panoramaPath":"http://10.116.126.13/parastor300s/public/PRH259/f00000.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县兴隆路5号","longitude":110.595111,"latitude":27.90289,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"龙潭镇神龙大酒店","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":94,"shotTime":"2019-06-09 01:29:16","panoramaPath":"http://10.116.126.13/parastor300s/public/PJH119/f00007.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县龙潭镇神龙大酒店","longitude":110.542891,"latitude":27.411462,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"长沙创谷广告园44","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-10 11:41:04","panoramaPath":"http://10.116.126.13/parastor300s/public/PRH259/f00008.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"长沙市创谷广告软件园","longitude":112.973795,"latitude":28.094549,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县第一中学48","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-07 13:25:00","panoramaPath":"http://10.116.126.13/parastor300s/public/PYR682/f00026.jpg","feature":"粤P8A566；轿车；绿色；大众-捷达-2015","deviceId":null,"address":"溆浦县第一中学","longitude":110.612834,"latitude":27.910003,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县张家湾路口(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":94,"shotTime":"2019-06-06 09:28:55","panoramaPath":"http://10.116.126.13/parastor300s/public/PCS113/f00021.jpg","feature":"粤P8A566；轿车；绿色；大众-捷达-2015","deviceId":null,"address":"溆浦县张家湾路口","longitude":110.587558,"latitude":27.930365,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县气象局(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","feature":"粤P8A566；轿车；绿色；大众-捷达-2015","deviceId":null,"address":"溆浦县气象局","longitude":110.604443,"latitude":27.908643,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县张家湾路口(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":93,"shotTime":"2019-06-07 14:22:36","panoramaPath":"http://10.116.126.13/parastor300s/public/PHD376/f00039.jpg","feature":"粤P9E163；轿车；白色；现代-瑞纳-2016","deviceId":null,"address":"溆浦县张家湾路口","longitude":110.587558,"latitude":27.930365,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县兴隆路5号154(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":93,"shotTime":"2019-06-10 14:24:28","panoramaPath":"http://10.116.126.13/parastor300s/public/PHD376/f00042.jpg","feature":"粤P9E163；轿车；白色；现代-瑞纳-2016","deviceId":null,"address":"溆浦县兴隆路5号","longitude":110.595111,"latitude":27.90289,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县龙潭镇汽车站(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":93,"shotTime":"2019-06-03 04:30:08","panoramaPath":"http://10.116.126.13/parastor300s/public/PYR682/f00033.jpg","feature":"粤P9E163；轿车；白色；现代-瑞纳-2016","deviceId":null,"address":"溆浦县龙潭镇汽车站","longitude":110.539961,"latitude":27.411443,"cname":null,"uploadPath":null}],
      sturcDetail: {vehicleDto:{},"id":null,"vehicleNumber": "粤PRH259","deviceCode":null,"structureType":null,"deviceName":"溆浦县政府41","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-10 19:29:55","panoramaPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县警予东路169号","longitude":110.597638,"latitude":27.910355,"cname":null,"uploadPath":'http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg'},
      bResize: {},
      markerPoint: null, // 地图icon
      playUrl: {},
      videoUrl: null, // 下载地址
      map: null,
      swiperOption: {
        slidesPerView: 10,
        spaceBetween: 18,
        slidesPerGroup: 10,
        loop: false,
        slideToClickedSlide: true,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
    }
  },
  created () {
    this.setDTime();
    this.cityCode = cityCode
  },
  mounted() {
    getbayonet().then(res=>{
      if (res.data) {
        this.kakou = res.data.map((item)=>{
          return item.bayonetList
        })
      }
      this.kakou = this.kakou.flat(6)
      this.lll = this.kakou.map((item)=> {
        return item.uid
      })
    })
    this.setDTime();
    // 获取到车辆类别
    getGroupsByType({ groupType: 9 }).then(res => {
      if (res.data) {
        this.vehicleClassOptions = [
          ...this.vehicleClassOptions,
          ...res.data.map(item => {
            return {
              enumField: item.groupName,
              enumValue: item.groupName // uid
            };
          })
        ];
      }
    });
  },
  methods: {
    selchange (val) {
      console.log(val)
      if (val.indexOf("全选") !== -1 && this.lll.length - 1 < this.kakou.length) {
        this.showselected = true
        this.lll = this.kakou.map((item)=> {
          return item.uid
        })
      }else if (val.indexOf("全选") !== -1 && this.lll.length === this.kakou.length + 1) {
        this.lll = []
        this.showselected = false
      }
      if (this.lll.length !== this.kakou.length) {
        console.log(23423523525)
        this.showselected = false
      }else {
        this.showselected = true
      }
    },
    changval1 (val) {
      let time = val.replace(/-/g, '/');
      let time1 = new Date(time)
      let time2 = time1.getTime()
      this.value2 = formatDate(time2 + 24*60*60*1000)
    },
    setDTime () {
      let date = new Date();
      let curDate = date.getTime();
      let curS = 1 * 24 * 3600 * 1000;
      let sM = '', sD = '';
      if ((new Date(curDate - curS).getMonth() + 1) < 10 ) {
        sM = '0' + (new Date(curDate - curS).getMonth() + 1);
      } else {
        sM = (new Date(curDate - curS).getMonth() + 1)
      }
      if ( new Date(curDate - curS).getDate() < 10 ) {
        sD = '0' +  new Date(curDate - curS).getDate();
      } else {
        sD =  new Date(curDate - curS).getDate()
      }
      let _s = new Date(curDate - curS).getFullYear() + '-' + sM + '-' + sD + ' 00:00:00';
      let _e = new Date(curDate - curS).getFullYear() + '-' + sM + '-' + sD + ' 23:59:59';
      this.value1 = _s
      this.value2 = _e
    },
    oo () {
      console.log(this.selectDeviceArr)
    },
    tongji () {
      this.JfoGETCity()
    },
    reset () {
      this.setDTime();
      this.unvehicleFlag = false
      this.v = '湘'
      this.vehicleNumber = ''
      this.lll = []
      this.onlySurveillance = false
      getbayonet().then(res=>{
        if (res.data) {
          this.kakou = res.data.map((item)=>{
            return item.bayonetList
          })
        }
        this.kakou = this.kakou.flat(6)
        this.lll = this.kakou.map((item)=> {
          return item.uid
        })
      })
      this.carType = []
      this.JfoGETCity()
    },
    hhh (val) {
      console.log(val)
    },
    showChange () {
      this.isShowSelectList = !this.isShowSelectList;
    },
    handleCurrentChange (page) {
      /* this.pagination.pageNum = page;
      this.JfoGETCity() */
      this.pagination.pageNum = page;
      let ips = (this.pagination.pageNum - 1) * this.pagination.pageSize;
      let ipe = ips + this.pagination.pageSize;
      if (ipe > this.pagination.total) { ipe = this.pagination.total; }
      this.tableData = this.tableDataAll.slice(ips, ipe);
    },
    JfoGETCity () {
      this.searchLoading = true;
      const params = {
        startTime: this.value1,
        endTime: this.value2,
        unvehicleFlag: this.unvehicleFlag,
        onlyFirstEnterCity: this.onlySurveillance,
        vehicleNumber: this.v
      }
      if (this.lll&& this.lll.length > 0) {
        params['bayonetUid'] = this.lll.join(',')
      }
      if (this.carType&& this.carType.length > 0) {
        params['vehicleType'] = this.carType.join(',')
      }
      if (this.vehicleNumber) {
        params.vehicleNumber = this.v + this.vehicleNumber
      }
      JfoGETCity(params).then(res => {
        if (res.data == null) {
          this.tableData = []
          this.pagination.total = 0
        }
        if (res && res.data) {
          // this.tableData = res.data;
          this.regulationsList = res.data
          this.pagination.pageNum = 1;
          this.tableDataAll = res.data;
          this.pagination.total = this.tableDataAll.length;
          this.handleCurrentChange(1);
        }
        this.searchLoading = false;
      }).catch(error => {
        console.log(error );
        this.searchLoading = false;
      });
    },
    /**
     * 弹框地图初始化
     */
    initMap () {
      // this.map.setZoomAndCenter(iZoom, aCenter);
      let map = new window.AMap.Map('container', {
        zoom: 14, // 级别
        center: [this.sturcDetail.shotPlaceLongitude, this.sturcDetail.shotPlaceLatitude,], // 中心点坐标
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.map = map;
      this.drawPoint(this.sturcDetail)
    },
    /**
     * 地图描点
     */
    drawPoint (data) {
      console.log(data)
      if (this.markerPoint) {
        this.map.remove(this.markerPoint)
      }
      let _content = '<div class="vl_icon vl_icon_judge_02"></div>'
      this.markerPoint = new window.AMap.Marker({ // 添加自定义点标记
        map: this.map,
        position: [data.shotPlaceLongitude, data.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
        offset: new window.AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // 自定义点标记覆盖物内容
        content: _content
      });
      this.map.setZoomAndCenter(16, [data.shotPlaceLongitude, data.shotPlaceLatitude]); // 自适应点位置
      let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`
      this.infoWindow = new window.AMap.InfoWindow({
        map: this.map,
        isCustom: true,
        closeWhenClickMap: false,
        position: [data.shotPlaceLongitude, data.shotPlaceLatitude],
        offset: new window.AMap.Pixel(0, -70),
        content: sConent
      })
    },
    /**
     * 打开抓拍弹框
     */
    onOpenDetail (obj) {
      this.$_showLoading({text: '加载中...'})
      console.log(obj)
      this.sturcDetail = obj
      console.log(this.sturcDetail.videoPath)
      this.videoUrl = this.sturcDetail.videoPath
      this.playUrl = {
        type: 3,
        title: '',
        video: {
          uid: 1,
          downUrl: this.sturcDetail.videoPath
        }
      }
      this.strucDetailDialog = true
      this.$nextTick(() => {
        this.initMap()
      })
      this.$_hideLoading()
    },
    /**
     * 关闭抓拍弹框
     */
    onCloseDetail () {
      this.strucCurTab = 1
      this.strucDetailDialog = false
    },
    /**
     * 图片切换
     */
    imgListTap (obj, i) {
      this.curImgIndex = i
      this.sturcDetail = obj
    }
  }
}
</script>
<style lang="scss" scoped>
  .ccrc{
    height: 100%;
    .ccrc_breadcrumb{
      background-color: white;
      padding: 23px 20px;
      border-bottom: 2px solid #F7F9F9;
    }
    .ccrc_content{
      display: flex;
      height: calc(100% - 62px);
      .ccrc_content_left{
        height: 100%;
        background-color: white;
        width: 272px;
        padding: 20px;
        box-shadow: 5px 0 10px #E5E7E7;
        .jiesu{
          padding-top: 10px;
        }
        .kakou{
          padding-top: 10px;
          .search_item {
            height: 120px;
            width: 230px;
            padding-top: 10px;
            .select_tree {
              border: 1px solid #e4e7ed;
              border-radius: 4px;
              background-color: #fff;
              box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
              padding: 10px 0;
            }
          }
        }
        .cpai{
          padding-top: 20px;
        }
        .selectet{
          /deep/ .el-input__inner{
            background-color: white;
            border: 1px solid #DCDFE6;
            border-left: 0;
            border-right: 0;
          }
        }
      }
      .ccrc_content_right{
        height: 100%;
        background-color: #F7F9F9;
        width: calc(100% - 282px);
        margin-left: 10px;
        padding: 20px;
        overflow: auto;
        .ccrc_content_right_content{
          min-height: 100%;
          background-color: white;
          box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
          padding: 20px;
          .cum_pagination{
            padding-right: 0;
          }
        }
      }
    }
    .operation_btn {
      color: #0C70F8;
      cursor: pointer;
    }
    .statistics_select_list{
      display: none !important;
    }
  }
  .th-ycxc-record {
    width: 100%;
    height: 100%;
    .th-ycxc-record-list {
      width: 100%;
      // height: calc(100% - 55px);
      padding: 0 20px;
      background: white;
      .list-box {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        flex-flow: row wrap;
        // height: calc(100% - 45px);
        .list-item {
          width: 19%;
          height: 320px;
          padding: 10px;
          margin-bottom: 15px;
          background: #fff;
          margin-left: 1.25%;
          &:nth-child(5n - 4) {
            margin-left: 0;
          }
          img {
            display: inline-block;
            width: 100%;
            height: calc(100% - 70px);
          }
          p {
            font-size: 14px;
            font-family: 'MicrosoftYaHei';
            font-weight: 500;
            color: #333;
            i {
              color: #999;
              margin-right: 3px;
              display: block;
              width: 15px;
              height: 15px;
            }
          }
          .time {
            padding: 10px 0 5px 0;
            display: flex;
            font-size: 0.14rem;
            align-items: center;
            i {
              background: url("../../../../../assets/img/the-time.png") no-repeat;
              background-size: 15px 15px;
            }
          }
          .address {
            display: flex;
            align-items: center;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 0.14rem;
            i {
              background: url("../../../../../assets/img/the-daynoint.png") no-repeat;
              background-size: 15px 15px;
            }
          }
          .address1 {
            display: flex;
            align-items: center;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 0.14rem;
            i {
              width: 15px;
              height: 15px;
            }
          }
        }
      }
      .th-center-pagination {
        width: 100%;
        text-align: center;
        padding: 0 0 20px 0;
      }
    }
  }
</style>
<style lang="scss">
  .struc_detail_dialog {
    .el-dialog {
      max-width: 13.06rem;
      width: 100%!important;
    }
    .el-dialog__header {
      display: none;
    }
    .struc_tab {
      height: 1.16rem;
      padding: .3rem 0;
      position: relative;
      color: #999999;
      span {
        display: inline-block;
        margin-right: .55rem;
        padding-bottom: .1rem;
        cursor: pointer;
      }
      .active {
        color: #0C70F8;
        border-bottom: 2px solid #0C70F8;
      }
      i {
        display: block;
        position: absolute;
        top: .3rem;
        right: 0px;
        cursor: pointer;
      }
    }
    .struc_main {
      width: 11.86rem;
      height: 4.4rem;
      margin: 0 auto;
      border-bottom: 1px solid #F2F2F2;
      .download_btn {
        display: inline-block;
        width:160px;height:40px;
        background:rgba(246,248,249,1);
        border:1px solid rgba(211,211,211,1);
        border-radius:4px;
        text-align: center;
        line-height: 40px;
        position: absolute;
        top: 4.9rem;
        right: 0.68rem;
        text-decoration: none;
        color: #B2B2B2;
        cursor: pointer;
      }
      .struc_c_detail {
        width:  100%;
        height: 3.6rem;
        >div {
          float: left;
        }
        .struc_c_d_img {
          width: 3.6rem;
          height: 3.6rem;
          background: #EAEAEA;
          position: relative;
          img {
            width: 100%;
            height: auto;
            max-height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
          }
          i {
            display: block;
            position: absolute;
            top: .1rem;
            right: .1rem;
            line-height: .26rem;
            height: .26rem;
            background: rgba(255, 255, 255, .8);
            border-radius: .13rem;
            font-style: normal;
            color: #0C70F8;
            font-size: 12px;
            padding: 0 .1rem;
          }
        }
        .struc_c_d_qj {
          margin-right: .2rem;
          &:before {
            display: block;
            content: '';
            position: absolute;
            top: -.5rem;
            left: -.5rem;
            transform: rotate(-45deg);
            border: .5rem solid #50CC62;
            border-color: transparent transparent #50CC62;
            z-index: 9;
          }
          span {
            display: block;
            position: absolute;
            top: .1rem;
            left: .1rem;
            width: .6rem;
            height: .6rem;
            text-align: center;
            color: #FFFFFF;
            font-size: .12rem;
            -webkit-transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            transform: rotate(-45deg);
            z-index: 99;
          }
        }
        .struc_c_d_qii {
          // margin-right: .3rem;
          &:before {
            display: block;
            content: '';
            position: absolute;
            top: -.5rem;
            left: -.5rem;
            transform: rotate(-45deg);
            border: .5rem solid #0c70f8;
            border-color: transparent transparent #0C70F8;
            z-index: 9;
          }
          span {
            display: block;
            position: absolute;
            top: .1rem;
            left: .1rem;
            width: .6rem;
            height: .6rem;
            text-align: center;
            color: #FFFFFF;
            font-size: .12rem;
            -webkit-transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            transform: rotate(-45deg);
            z-index: 99;
          }
        }
        .struc_c_d_box {
          width: calc(100% - 3.9rem);
          display: flex;
          height: 3.6rem;
          box-shadow: 0px 5px 16px 0px rgba(169,169,169,0.2);
          border-radius: 1px;
          position: relative;
          overflow: hidden;
          &:before {
            display: block;
            content: '';
            position: absolute;
            top: -.5rem;
            left: -.5rem;
            -webkit-transform: rotate(-45deg);
            transform: rotate(-45deg);
            border: .5rem solid #0c70f8;
            border-color: transparent transparent #0C70F8;
            z-index: 9;
          }
          .th-video-text {
            display: block;
            position: absolute;
            top: .08rem;
            left: .08rem;
            width: 0.8rem;
            height: 0.8rem;
            text-align: center;
            color: #FFFFFF;
            font-size: .12rem;
            -webkit-transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            transform: rotate(-45deg);
            z-index: 99;
          }
          > div {
            float: left;
          }
          .struc_c_d_info {
            width: calc(100% - 3.6rem);
            padding-left: .24rem;
            color: #333333;
            h2 {
              font-weight: bold;
              line-height: .74rem;
              padding-right: 1rem;
            }
            .struc_cdi_line {
              span {
                /*position: relative;*/
                max-width: 100%;
                display: inline-block;
                height: .3rem;
                line-height: .3rem;
                margin-bottom: .08rem;
                border: 1px solid #F2F2F2;
                background: #FAFAFA;
                color: #333333;
                white-space: nowrap;
                text-overflow: ellipsis;
                border-radius:3px;
                font-size: 12px;
                overflow: hidden;
                padding: 0 .3rem 0 .1rem;
                margin-right: .08rem;
                > b {
                  color: #999;
                  font-weight: normal;
                  padding-right: 18px;
                }
              }
            }
          }
        }
      }
      .struc_c_address {
        width:  100%;
        height: 100%;
        #container {
          width:  100%;
          height: 100%;
        }
      }
    }
    .struc-list {
      width: 12.46rem;
      margin: 0 auto;
      padding: .44rem 0 .34rem 0;
      .swiper-container {
        padding: .02rem .5rem;
        &:before {
          display: block;
          content: '';
          width: .5rem;
          height: 110%;
          background: #FFFFFF;
          position: absolute;
          left: 0;
          z-index: 9;
          border: 1px solid #FFFFFF;
        }
        &:after {
          display: block;
          content: '';
          width: .5rem;
          height: 110%;
          background: #FFFFFF;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 9;
          border: 1px solid #FFFFFF;
        }
        .swiper-button-next {
          right:  0;
        }
        .swiper-button-prev {
          left: 0;
        }
        .swiper-slide {
          .swiper_img_item {
            cursor: pointer;
            border: 1px solid #FFFFFF;
            padding: 2px;
            .vl_jfo_sim {
              font-size: .14rem;
              height: .3rem;
              margin-top: 0;
              /*display: inline-block;*/
              white-space: nowrap;
              text-align: center;
              color: #999999;
              i {
                margin-right: 0;
              }
            }
          }
          .active {
            border-color: #0C70F8;
            box-shadow: inset 0px 3px 3px #c8c8c8;
            .vl_jfo_sim {
              color: #0C70F8;
            }
          }
        }
      }
    }
  }
  .cap_info_win {
    background: #FFFFFF;
    padding: .18rem;
    font-size: .14rem;
    color: #666666;
    position: relative;
    &:after {
      display: block;
      content: '';
      border: .1rem solid #FFFFFF;
      border-color: #FFFFFF transparent transparent;
      position: absolute;
      bottom: -.2rem;
      left: calc(50% - .05rem);
    }
  }
</style>