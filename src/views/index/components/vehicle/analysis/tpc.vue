<template>
  <div class="tpc">
    <div class="ccrc_breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }"><span style="color: #999999">车辆侦查</span></el-breadcrumb-item>
        <el-breadcrumb-item>套牌车分析</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="ccrc_content">
      <div class="ccrc_content_left">
        <div>
          <el-input v-model="searchData.licensePlateNum" placeholder="请输入车牌号码搜索" clearable></el-input>
        </div>
        <div class="kaishi">
<!--          <el-date-picker-->
<!--              v-model="searchData.time"-->
<!--              type="daterange"-->
<!--              style="width: 232px"-->
<!--              range-separator="-"-->
<!--              value-format="yyyy-MM-dd HH:mm:ss"-->
<!--              format="yy/MM/dd"-->
<!--              start-placeholder="开始日期"-->
<!--              end-placeholder="结束日期"-->
<!--              :default-time="['00:00:00', '23:59:59']">-->
<!--          </el-date-picker>-->
          <span style="display: inline-block; width: 14px; margin-right: 4px; color: #999999">开 始</span>
          <el-date-picker
              v-model="value1"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm:ss"
              @change="changval1"
              style="width: 212px; vertical-align: top"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="jiesu">
          <span style="display: inline-block; width: 14px; margin-right: 4px; color: #999999">结 束</span>
          <el-date-picker
              v-model="value2"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 212px; vertical-align: top"
              type="datetime"
              :picker-options="pickerOptions"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="kaishi">
          <el-button style="width: 110px" @click="rester">重置</el-button>
          <el-button type="primary" style="width: 110px" @click="search">统计</el-button>
        </div>
      </div>
      <div class="ccrc_content_right" v-if="regulationsList.length > 0">
        <div class="clearfix">
          <div style="padding: 10px 0; float: right">
            <el-button type="primary" style="width: 110px">导出</el-button>
          </div>
        </div>
        <div class="ccrc_content_right_content">
          <div class="title">车辆登记信息</div>
          <div class="ccrc_content_right_table">
            <div>
              <div style="width: 70px" class="smalltitle">
                号牌号码：
              </div>
              <div class="ttt-1">{{vehicleArch.plateno}}</div>
            </div>
            <div>
              <div style="width: 80px; white-space:nowrap;" class="smalltitle">
                车辆所有人：
              </div>
              <div class="ttt-2">{{vehicleArch.owner}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                中文品牌：
              </div>
              <div class="ttt-2">{{vehicleArch.vehicleBrand}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                车身颜色：
              </div>
              <div class="ttt-2">{{vehicleArch.vehicleColor}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                车身形式：
              </div>
              <div class="ttt-2">{{vehicleArch.bodyform}}</div>
            </div>
            <div>
              <div style="width: 86px; white-space:nowrap" class="smalltitle">
                车门数：
              </div>
              <div class="ttt-2">{{vehicleArch.doornumber}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                发动机号：
              </div>
              <div class="ttt-2">{{vehicleArch.engineno}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                车辆类型：
              </div>
              <div class="ttt-2">{{vehicleArch.platetype}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                年款：
              </div>
              <div class="ttt-2">{{vehicleArch.model}}</div>
            </div>
            <div>
              <div style="width: 86px; white-space:nowrap" class="smalltitle">
                座位数：
              </div>
              <div class="ttt-2">{{vehicleArch.seatnumber}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                车辆状态：
              </div>
              <div class="ttt-2">{{vehicleArch.status}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                使用性质：
              </div>
              <div class="ttt-2">{{vehicleArch.usecharacter}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                车型：
              </div>
              <div class="ttt-2">{{vehicleArch.vehicletype}}</div>
            </div>
            <div>
              <div style="width: 86px; white-space:nowrap" class="smalltitle">
                厂商名称：
              </div>
              <div class="ttt-2">{{vehicleArch.vendor}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                有效期止：
              </div>
              <div class="ttt-2">{{vehicleArch.validuntil}}</div>
            </div>
          </div>
        </div>
        <div class="ccrc_content_right_content" style="margin-top: 20px">
          <div class="title">套牌车抓拍信息</div>
          <div class="th-ycxc-record">
            <div class="th-ycxc-record-list">
              <div class="list-box">
                <div class="list-item" v-for="item in regulationsList" :key="item.vehicleDto.uid" @click="onOpenDetail(item)">
                  <img :src="item.vehicleDto.subStoragePath" alt="">
                  <p class="time"><i></i>{{item.vehicleDto.shotTime}}</p>
                  <p class="address"><i></i>{{item.vehicleDto.address}}</p>
                </div>
                <el-pagination
                    class="cum_pagination th-center-pagination"
                    v-if ="pagination.total"
                    @current-change="onPageChange"
                    :current-page.sync="currentPage"
                    :page-size="pagination.pageSize"
                    layout="total, prev, pager, next"
                    :total="pagination.total">
                </el-pagination>
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
                    <img :src="sturcDetail.vehicleDto.subStoragePath" alt="">
                    <span>抓拍图</span>
                  </div>
                  <div class="struc_c_d_box">
                    <div class="struc_c_d_qii struc_c_d_img">
                      <img :src="sturcDetail.vehicleDto.subStoragePath" alt="">
                      <span>全景图</span>
                    </div>
                    <div class="struc_c_d_info">
                      <h2>抓拍信息</h2>
                      <div class="struc_cdi_line">
                        <span>{{sturcDetail.vehicleDto.shotTime}}<b>抓拍时间</b></span>
                      </div>
                      <div class="struc_cdi_line">
                        <span>{{sturcDetail.vehicleDto.deviceName}}<b>抓拍设备</b></span>
                      </div>
                      <div class="struc_cdi_line">
                        <span>{{sturcDetail.vehicleDto.address}}<b>抓拍地址</b></span>
                      </div>
                      <div class="struc_cdi_line">
                        <span>{{sturcDetail.vehicleDto.plateNo}}<b>车牌号</b></span>
                      </div>
                      <div class="struc_cdi_line">
                        <span>{{sturcDetail.vehicleDto.vehicleColor + sturcDetail.vehicleDto.vehicleClass + sturcDetail.vehicleDto.vehicleStyles}}<b>特征</b></span>
                      </div>
                      <div class="struc_cdi_line"></div>
                    </div>
                  </div>
                </div>
                <div v-show="strucCurTab === 2" class="struc_c_address">
                  <div id="container"></div>
                </div>
                <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
                  <div class="struc_c_d_qj struc_c_d_img">
                    <img :src="sturcDetail.vehicleDto.subStoragePath" alt="">
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
                      <img style="display: block; width: 100%; height: .88rem;" :src="item.vehicleDto.subStoragePath" alt="">
                    </div>
                  </swiper-slide>
                  <div class="swiper-button-prev" slot="button-prev"></div>
                  <div class="swiper-button-next" slot="button-next"></div>
                </swiper>
              </div>
            </el-dialog>
          </div>
        </div>
      </div>
      <div class="not_content" v-else>
        <img src="../../../../../assets/img/not-content.png" alt="">
        <p style="color: #666666; margin-top: 30px;">抱歉，没有相关的结果!</p>
      </div>
    </div>
  </div>
</template>
<script>
import { formatDate } from "@/utils/util.js";
import flvplayer from '@/components/common/flvplayer.vue';
import {getArchives} from '../../../api/api.analysis.js';
import {JtcPOSTAppendtpInfo} from '../../../api/api.judge.js';
export default {
  components: {
    flvplayer
  },
  data () {
    return {
      value1: '',
      pickerOptions: {
      },
      searchData: {               //搜索参数
        time: [new Date(new Date().getTime() - 24*60*60*1000), new Date(new Date().getTime() - 24*60*60*1000)],
        licensePlateNum: null, // 车牌号
      },
      vehicleArch: {},      //车辆档案
      regulationsList: [],
      value2: '',
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      currentPage: 1,
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
    this.pickerOptions.disabledDate = this.disabledDate;
  },
  mounted() {
    this.setDTime();
    this.pickerOptions.disabledDate = this.disabledDate;
  },
  watch:{
    value1 (val) {
      if (val !== new Date().getTime() - 86400000) {
        this.pickerOptions.disabledDate = this.disabledDate;
      }
    }
  },
  methods: {
    changval1 (val) {
      this.value2 = formatDate(val + 3*24*60*60*1000)
    },
    disabledDate(time) {
      return  time.getTime() > this.value1 + 3*24*60*60*1000 || time.getTime() < this.value1 - 24*60*60*1000
    },
    setDTime () {
      let _s = new Date().getTime() - 86400000;
      let _e = formatDate(Date.now())
      // let _e = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + " 00:00:00";
      // let _e = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + " 23:59:59";
      // this.ruleForm.data1 = [_s, _e];
      this.value1 = _s
      this.value2 = _e
    },
    //查询
    search() {
      if(this.searchData.licensePlateNum) {
        this.getSearchData();
      }else {
        this.$message.error("请输入车牌号码");
        return false;
      }
    },
    getSearchData() {
      let params = {};
      if(this.value1 && this.value2) {
        params['startDate'] = formatDate(this.value1);
        params['endDate'] = this.value2;
        params['pageNum'] = this.pagination.pageNum;
        params['pageSize'] =this.pagination.pageSize;
      }
      if(this.searchData.licensePlateNum) {
        params['vehicleNumber'] = this.searchData.licensePlateNum
        params['plateNo'] = this.searchData.licensePlateNum
      }else {
        return false;
      }
      console.log("======getSearchData=====", this.searchData,params);
      this.getVehicle(params);
      this.getViolationList(params);
    },
    //获取车辆档案
    getVehicle(params) {
      const query = {
        plateNo: params.plateNo
      }
      this.searching = true;
      getArchives(query).then( res => {
        console.log("0000000000",res)
        if(res && res.data) {
          this.vehicleArch = res.data
        }
      }).catch(error => {
        console.log(error);
      })
    },
    getViolationList(params) {
      delete(params.plateNo)
      JtcPOSTAppendtpInfo(params).then(res => {
        console.log("----getViolation----", params)
        if(res && res.data) {
          this.regulationsList = res.data.list
          this. pagination.total = res.data.total
          console.log(this.regulationsList)
        }
      }).catch( error => {
        console.log(error);
      })
    },
    /**
     * 弹框地图初始化
     */
    initMap () {
      // this.map.setZoomAndCenter(iZoom, aCenter);
      let map = new window.AMap.Map('container', {
        zoom: 14, // 级别
        center: [this.sturcDetail.vehicleDto.shotPlaceLongitude, this.sturcDetail.vehicleDto.shotPlaceLatitude,], // 中心点坐标
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.map = map;
      this.drawPoint(this.sturcDetail.vehicleDto)
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
     * 按照时间排序
     */
    onSortByTime (type) {
      this.sortTimeType = type
    },
    /**
     * 按照监控排序
     */
    onSortByMonitory (type) {
      this.sortMonitoryType = type
    },
    /**
     * 分页赋值
     */
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.search()
    },
    rester() {
      this.setDTime();
      this.searchData.licensePlateNum = null
    },
    /**
     * 打开抓拍弹框
     */
    onOpenDetail (obj) {
      this.$_showLoading({text: '加载中...'})
      console.log(obj)
      this.sturcDetail = obj
      console.log(this.sturcDetail.videoPath)
      this.videoUrl = this.sturcDetail.vehicleDto.videoPath
      this.playUrl = {
        type: 3,
        title: '',
        video: {
          uid: 1,
          downUrl: this.sturcDetail.vehicleDto.videoPath
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
  .tpc{
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
        .kaishi{
          padding-top: 10px;
        }
        .jiesu{
          padding-top: 10px;
        }
      }
      .ccrc_content_right{
        height: 100%;
        background-color: #F7F9F9;
        width: calc(100% - 282px);
        margin-left: 10px;
        padding: 20px;
        overflow: auto;
        padding-top: 0;
        .ccrc_content_right_content{
          background-color: white;
          box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
          .title{
            border-bottom: 1px solid #F2F2F2;
            padding: 20px;
            font-size:16px;
            color: #333333;
            font-weight:bold;
          }
          .ccrc_content_right_table{
            flex-wrap:wrap;
            display: flex;
            padding: 20px;
            >div{
              width: 25%;
              padding-bottom: 20px;
              display: flex;
              .smalltitle{
                text-align: right;
                color: #666666;
              }
              .ttt-1{
                width: calc(100% - 70px);
                word-wrap: break-word
              }
              .ttt-2{
                width: calc(100% - 80px);
                word-wrap: break-word
              }
            }
          }
          .cum_pagination{
            padding-right: 0;
          }
        }
      }
    }
    .not_content{
      width: calc(100% - 282px)!important;
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
  html {font-size: 100px;}
  @media screen and (min-width: 960px) and (max-width: 1119px) {html {font-size: 60px !important;}}
  @media screen and (min-width: 1200px) and (max-width: 1439px) {html {font-size: 70px !important;}}
  @media screen and (min-width: 1440px) and (max-width: 1679px) {html {font-size: 80px !important;}}
  @media screen and (min-width: 1680px) and (max-width: 1919px) {html {font-size: 90px !important;}}
  @media screen and (min-width: 1920px) {html {font-size: 100px !important;} }
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
                  padding-left: 18px;
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