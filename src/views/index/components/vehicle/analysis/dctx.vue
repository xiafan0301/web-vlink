<template>
  <div class="th-many-peers">
    <div class="th-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">侦查</el-breadcrumb-item>
        <el-breadcrumb-item>多车同行</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="the-bottom">
      <div class="the-left-search">
        <div class="input-box">
          <vue-scroll>
            <div class="input-box-line">
              <p class="title"><span>开</span><span>始</span></p>
              <el-date-picker align="right" :picker-options="pickerOptions1" v-model="startDate" type="date" placeholder="选择日期" value-format="timestamp"></el-date-picker>
            </div>
            <div class="input-box-line">
              <p class="title"><span>结</span><span>束</span></p>
              <el-date-picker v-model="endDate" :picker-options="pickerOptions2" :disabled="isSelect" type="date" placeholder="选择日期" value-format="timestamp"></el-date-picker>
            </div>
            <div class="input-box-line" v-for="(item, index) in filterObj.vehicleNumberList" :key="index + 'ssd'">
              <!-- <span class="vehicle-index">车辆1</span> -->
              <el-input class="left-none-border" v-model="item.vehicleNumber" placeholder="请输入车牌号码">
                <template slot="prepend">车辆{{ index + 1 }}:</template>
                <i v-if="index > 1" slot="suffix" class="el-input__icon el-icon-remove" @click="onDeleteVehicleNumber(index)"></i>
              </el-input>
            </div>
            <p v-if="filterObj.vehicleNumberList.length < 8" class="add-vehicle-number" @click="onAddVehicleNumber">
              <i class="el-icon-circle-plus"></i>
              添加车辆
            </p>
          </vue-scroll>
        </div>
        <div class="btn-box">
          <el-button class="th-btn-no-color" @click="onReset" :loading="resetLoading">重置</el-button>
          <el-button class="th-btn-color" @click="onSearch" :loading="searchLoading">查询</el-button>
        </div>
      </div>
      <div class="the-right-result">
        <div class="the-result-box-dctx">
          <vue-scroll>
            <div class="list-box">
              <div class="list-item" v-for="item in '123123123123123'" :key="item.id" @click="onOpenDetail(item)">
                <img src="../../../../../assets/img/666.jpg" alt="">
                <p class="time"><i></i>2018.-11-12  13:14:15</p>
                <p class="address"><i></i>抓拍设备:抓拍名称京广高速</p>
              </div>
              <el-pagination
                class="cum_pagination th-center-pagination"
                @current-change="onPageChange"
                :current-page.sync="currentPage"
                :page-size="pagination.pageSize"
                layout="prev, pager, next"
                :total="32">
              </el-pagination>
            </div>
          </vue-scroll>
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
            <img :src="sturcDetail.panoramaPath" alt="">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_qii struc_c_d_img">
              <img :src="sturcDetail.panoramaPath" alt="">
              <span>全景图</span>
            </div>
            <div class="struc_c_d_info" style="padding-left: 14px;">
              <div class="th-dctx-tab">
                <p class="line">
                  <span>卡口名称：</span>
                  <span>{{ sturcDetail.deviceName }}</span>
                </p>
                <p class="line">
                  <span>同行车辆（{{ vehicleList.length }}）</span>
                </p>
              </div>
              <div class="struc_cdi_box">
                <vue-scroll>
                  <div v-for="(item, index) in vehicleList" :key="index + 'tjj'" class="vehicle-info-box">
                    <div class="left">车辆{{ index + 1 }}</div>
                    <div class="right">
                      <p>{{ item.vehicleNumber }}</p>
                      <p><span>{{ item.feature }}<b>特征</b></span></p>
                    </div>
                  </div>
                </vue-scroll>
                <!-- <span>{{sturcDetail.shotTime}}<b>抓拍时间</b></span> -->
              </div>
              <!-- <div class="struc_cdi_line">
                <span>{{sturcDetail.deviceName}}<b>抓拍设备</b></span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.address}}<b>抓拍地址</b></span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.vehicleNumber}}<b>车牌号</b></span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.feature}}<b>特征</b></span>
              </div>
              <div class="struc_cdi_line"></div> -->
            </div>
          </div>
        </div>
        <div v-show="strucCurTab === 2" class="struc_c_address">
          <div id="container"></div>
        </div>
        <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.photoPath" alt="">
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
          <swiper-slide v-for="(item, index) in strucInfoList" :key="index + 'isgm'">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
              <img style="display: block; width: 100%; height: .88rem;" :src="item.photoPath" alt="">
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
  import flvplayer from '@/components/common/flvplayer.vue';
  import { formatDate } from "@/utils/util.js";
  export default {
  components: {
    flvplayer
  },
  data () {
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      isSelect: false,
      pagination: {
        pageNum: 1,
        pageSize: 15
      },
      currentPage: 1,
      /* 抓拍记录页面参数 */
      strucDetailDialog: false, // 抓拍记录弹窗
      strucCurTab: 1, // 抓拍记录弹窗tab
      curImgIndex: 0, // 当前选择的图片index
      strucInfoList: [{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县兴隆路5号154(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-03 16:12:44","panoramaPath":"http://10.116.126.13/parastor300s/public/PRH259/f00000.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县兴隆路5号","longitude":110.595111,"latitude":27.90289,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"龙潭镇神龙大酒店","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":94,"shotTime":"2019-06-09 01:29:16","panoramaPath":"http://10.116.126.13/parastor300s/public/PJH119/f00007.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县龙潭镇神龙大酒店","longitude":110.542891,"latitude":27.411462,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"长沙创谷广告园44","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-10 11:41:04","panoramaPath":"http://10.116.126.13/parastor300s/public/PRH259/f00008.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"长沙市创谷广告软件园","longitude":112.973795,"latitude":28.094549,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县第一中学48","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-07 13:25:00","panoramaPath":"http://10.116.126.13/parastor300s/public/PYR682/f00026.jpg","feature":"粤P8A566；轿车；绿色；大众-捷达-2015","deviceId":null,"address":"溆浦县第一中学","longitude":110.612834,"latitude":27.910003,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县张家湾路口(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":94,"shotTime":"2019-06-06 09:28:55","panoramaPath":"http://10.116.126.13/parastor300s/public/PCS113/f00021.jpg","feature":"粤P8A566；轿车；绿色；大众-捷达-2015","deviceId":null,"address":"溆浦县张家湾路口","longitude":110.587558,"latitude":27.930365,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县气象局(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","feature":"粤P8A566；轿车；绿色；大众-捷达-2015","deviceId":null,"address":"溆浦县气象局","longitude":110.604443,"latitude":27.908643,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县张家湾路口(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":93,"shotTime":"2019-06-07 14:22:36","panoramaPath":"http://10.116.126.13/parastor300s/public/PHD376/f00039.jpg","feature":"粤P9E163；轿车；白色；现代-瑞纳-2016","deviceId":null,"address":"溆浦县张家湾路口","longitude":110.587558,"latitude":27.930365,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县兴隆路5号154(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":93,"shotTime":"2019-06-10 14:24:28","panoramaPath":"http://10.116.126.13/parastor300s/public/PHD376/f00042.jpg","feature":"粤P9E163；轿车；白色；现代-瑞纳-2016","deviceId":null,"address":"溆浦县兴隆路5号","longitude":110.595111,"latitude":27.90289,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县龙潭镇汽车站(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":93,"shotTime":"2019-06-03 04:30:08","panoramaPath":"http://10.116.126.13/parastor300s/public/PYR682/f00033.jpg","feature":"粤P9E163；轿车；白色；现代-瑞纳-2016","deviceId":null,"address":"溆浦县龙潭镇汽车站","longitude":110.539961,"latitude":27.411443,"cname":null,"uploadPath":null}],
      sturcDetail: {"id":null,"vehicleNumber": "粤PRH259","deviceCode":null,"structureType":null,"deviceName":"溆浦县政府41","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-10 19:29:55","panoramaPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县警予东路169号","longitude":110.597638,"latitude":27.910355,"cname":null,"uploadPath":'http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg'},
      vehicleList: [{"id":null,"vehicleNumber": "粤PRH259","deviceCode":null,"structureType":null,"deviceName":"溆浦县政府41","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-10 19:29:55","panoramaPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县警予东路169号","longitude":110.597638,"latitude":27.910355,"cname":null,"uploadPath":'http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg'},{"id":null,"vehicleNumber": "粤PRH259","deviceCode":null,"structureType":null,"deviceName":"溆浦县政府41","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-10 19:29:55","panoramaPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县警予东路169号","longitude":110.597638,"latitude":27.910355,"cname":null,"uploadPath":'http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg'},{"id":null,"vehicleNumber": "粤PRH259","deviceCode":null,"structureType":null,"deviceName":"溆浦县政府41","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-10 19:29:55","panoramaPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县警予东路169号","longitude":110.597638,"latitude":27.910355,"cname":null,"uploadPath":'http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg'},{"id":null,"vehicleNumber": "粤PRH259","deviceCode":null,"structureType":null,"deviceName":"溆浦县政府41","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-10 19:29:55","panoramaPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县警予东路169号","longitude":110.597638,"latitude":27.910355,"cname":null,"uploadPath":'http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg'},{"id":null,"vehicleNumber": "粤PRH259","deviceCode":null,"structureType":null,"deviceName":"溆浦县政府41","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-10 19:29:55","panoramaPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县警予东路169号","longitude":110.597638,"latitude":27.910355,"cname":null,"uploadPath":'http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg'}],
      bResize: {},
      markerPoint: null, // 地图icon
      playUrl: {},
      videoUrl: null, // 下载地址
      map: null,
      filterObj: {
        startDate: null,
        endDate: null,
        vehicleNumberList: [
          {vehicleNumber: ''},
          {vehicleNumber: ''},
        ],
        vehicleNumbers: null
      },
      startDate: new Date() - (24 * 60 * 60 * 1000),
      endDate: new Date() - (24 * 60 * 60 * 1000),
      resetLoading: false,
      searchLoading: false,
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
  watch: {
    startDate: {
      handler (val) {
        if (val) {
          this.isSelect = false
        } else {
          this.isSelect = true
        }
      },
      deep: true
    },
    endDate: {
      handler (val) {
        if (val && val - this.startDate > 2 * 24 * 60 *60 *1000) {
          this.$message.error("最大时间段为3天，超过开始时间3天（72小时）后的时间不可选择!")
          this.endDate = this.startDate + 2 * 24 * 60 *60 *1000
        }
        if (val && val - this.startDate < 0) {
          this.$message.error("结束时间必须大于开始时间！")
          this.endDate = this.startDate
        }
      },
      deep: true
    }
  },
  methods: {
    /**
     * 弹框地图初始化
     */
    initMap () {
      // this.map.setZoomAndCenter(iZoom, aCenter);
      let map = new window.AMap.Map('container', {
        zoom: 14, // 级别
        center: [110.595111, 27.90289], // 中心点坐标
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.map = map;
      this.drawPoint(this.strucInfoList[0])
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
        position: [data.longitude, data.latitude], // 基点位置 [116.397428, 39.90923]
        offset: new window.AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // 自定义点标记覆盖物内容
        content: _content
      });
      this.map.setZoomAndCenter(16, [data.longitude, data.latitude]); // 自适应点位置
      let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`
      this.infoWindow = new window.AMap.InfoWindow({
        map: this.map,
        isCustom: true,
        closeWhenClickMap: false,
        position: [data.longitude, data.latitude],
        offset: new window.AMap.Pixel(0, -70),
        content: sConent
      })
    },
    /**
     * 新增车牌
     */
    onAddVehicleNumber () {
      this.$set(this.filterObj.vehicleNumberList, this.filterObj.vehicleNumberList.length, {vehicleNumber: ''})
    },
    /**
     * 删除车牌
     */
    onDeleteVehicleNumber (i) {
      this.filterObj.vehicleNumberList.splice(i, 1)
    },
    /**
     * 重置按钮
     */
    onReset () {
      this.resetLoading = true
      this.isSelect = true
      this.startDate = null
      this.endDate = null
      let obj = {
        startDate: null,
        endDate: null,
        vehicleNumberList: [
          {vehicleNumber: ''},
          {vehicleNumber: ''},
        ],
        vehicleNumbers: null
      }
      this.filterObj = Object.assign({}, obj)
      this.resetLoading = false
    },
    /**
     * 查询按钮
     */
    onSearch () {
      this.searchLoading = true
      let arr = []
      this.filterObj.startDate = formatDate(this.startDate, 'yyyy-MM-dd')
      this.filterObj.endDate = formatDate(this.endDate, 'yyyy-MM-dd')
      this.filterObj.vehicleNumberList.forEach(item => {arr.push(item.vehicleNumber)})
      this.filterObj.vehicleNumbers = arr.join(',')
      console.log(this.filterObj)
      this.searchLoading = false
    },
    /**
     * 打开抓拍弹框
     */
    onOpenDetail (obj) {
      this.$_showLoading({text: '加载中...'})
      console.log(obj)
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
    },
    /**
     * 分页赋值
     */
    onPageChange (page) {
      this.pagination.pageNum = page;
    },
  }
}
</script>
<style lang="scss" scoped>
.th-many-peers {
  width: 100%; height: 100%;
  .the-bottom {
    width: 100%;height: calc(100% - 60px);
    display: flex;
    position: relative;
    .the-left-search {
      width: 272px;height: 100%;
      background: #fff;
      box-shadow: 5px 0 10px #E5E7E7;
      animation: fadeInLeft .4s ease-out .3s both;
      padding: 20px 0 20px 15px;
      position: relative;
      .input-box {
        width: 100%;
        height: calc(100% - 50px);
        overflow: hidden;
        .input-box-line {
          display: flex;
          padding-bottom: 12px;
          padding-right: 15px;
          .title {
            display: flex;
            flex-direction: column;
            color: #909399;
            width: 20px;
          }
        }
        .add-vehicle-number {
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #909399;
          cursor: pointer;
          i {
            font-size: 20px;
            vertical-align: text-top;
          }
        }
      }
    }
    .the-right-result {
      width: calc(100% - 285px); height: 100%;
      margin-left: 13px;
      background: #F7F9F9;
      padding: 15px 12px 25px 0;
      overflow-y: hidden;
      .the-result-box-dctx {
        width: 100%; height: 100%;
        background: #F6F8F9;
        .list-box {
          display: flex;
          flex-wrap: wrap;
          // justify-content: space-between;
          flex-flow: row wrap;
          // height: calc(100% - 45px);
          .list-item {
            width: 24%;
            height: 344px;
            padding: 15px;
            margin-bottom: 15px;
            background: #fff;
            margin-left: 1.3%;
            &:nth-child(4n - 3) {
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
              display: flex;
              align-items: center;
              padding: 10px 0 5px 0;
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
          .th-dctx-tab {
            padding: 8px 0 5px 0;
            .line {
              padding: 2px 0;
              span {
                display: inline-block;
                &:nth-child(1) {
                  color: #333;
                  font-weight: 600;
                }
                &:nth-child(2) {
                  color: #999;
                }
              }
            }
          }
          .struc_cdi_box {
            height: calc(100% - 75px);
            .vehicle-info-box {
              display: flex;
              // width: 100%;
              height: 60px;
              background: #FAFAFA;
              border: 1px solid #F2F2F2;
              margin-top: 10px;
              margin-right: .14rem;
              &:nth-child(1) {
                margin-top: 0;
              }
              .left {
                width: 71px;
                height: 60px;
                line-height: 60px;
                text-align: center;
                border-right: 1px solid #F2F2F2;
              }
              .right {
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 0 8px;
                color: #333;
                p:nth-child(2) {
                  padding-top: 2px;
                  b {
                    padding-left: 10px;
                    color: #999;
                    font-weight: normal;
                  }
                }
              }
            }
            // span {
            //   max-width: 100%;
            //   display: inline-block;
            //   height: .3rem;
            //   line-height: .3rem;
            //   margin-bottom: .08rem;
            //   border: 1px solid #F2F2F2;
            //   background: #FAFAFA;
            //   color: #333333;
            //   white-space: nowrap;
            //   text-overflow: ellipsis;
            //   border-radius:3px;
            //   font-size: 12px;
            //   overflow: hidden;
            //   padding: 0 .3rem 0 .1rem;
            //   margin-right: .08rem;
            //   > b {
            //     color: #999;
            //     font-weight: normal;
            //     padding-left: 18px;
            //   }
            // }
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
.input-box-line {
  .el-input__inner:hover,
  .el-input__inner:focus {
    border-color: #DCDFE6;
  }
  .el-input-group__prepend {
    background: #fff;
    padding: 0 5px;
  }
  .left-none-border {
    .el-input__inner {
      border-left: none;
    }
  }
  .el-date-editor {
    .el-input__inner {
      padding-left: 15px;
    }
    .el-input__prefix {right: 5px;left: auto;}
  }
}
.the-left-search {
  .btn-box {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    position: fixed;
    bottom: 15px;
    left: 0;
    .el-button {
      width: 110px;height: 40px;
    }
    .el-button.th-btn-color {
      background: #0C70F8;
      color: #fff;
      border: none;
    }
  }
}
</style>
