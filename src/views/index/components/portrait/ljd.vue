<template>
  <div class="ljd point">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">人像</el-breadcrumb-item>
        <el-breadcrumb-item>落脚点分析</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div :class="['left',{hide:hideleft}]">
      <div class="plane">
        <el-form
          :model="ruleForm"
          status-icon
          ref="ruleForm"
          label-width="0px"
          class="demo-ruleForm"
        >
          <el-form-item>
            <div class="upload_warp" @drop="drop($event)" @dragover="allowDrop($event)">
              <el-upload
                @drop="drop($event)"
                :class="{'vl_jtc_upload': true}"
                :show-file-list="false"
                accept="image/*"
                :action="uploadAcion"
                list-type="picture-card"
                :before-upload="beforeAvatarUpload"
                :on-success="uploadSucess"
                :on-error="handleError"
              >
                <i v-if="uploading" class="el-icon-loading"></i>
                <img v-else-if="curImageUrl" :src="curImageUrl">
                <div v-else>
                  <i
                    style="width: 100px;height: 85px;opacity: .5; position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto;"
                    class="vl_icon vl_icon_vehicle_01"
                  ></i>
                  <span>点击上传图片</span>
                </div>
              </el-upload>
              <!-- <p @click="showHistoryPic">从上传记录中选择</p> -->
              <div v-show="curImageUrl" class="del_icon">
                <i class="el-icon-delete" @click="delPic"></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item prop="data1">
            <el-date-picker
              v-model="ruleForm.data1"
              type="daterange"
              class="full"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="minFootholdTimes" class="firstItem">
            <el-row :gutter="5">
              <el-col :span="22">
                <div>
                  <el-input placeholder="不小于" v-model="ruleForm.minFootholdTimes" class="insetIput">
                    <i slot="prefix" class="inset">落脚点次数</i>
                  </el-input>
                </div>
              </el-col>
              <el-col :span="2">
                <div class="line40">次</div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item class="firstItem" label="区域：" label-width="60px" prop="input5">
            <!-- <el-radio-group v-model="input5" @change="changeTab"> -->
            <el-radio-group v-model="ruleForm.input5" @change="changeTab">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-radio label="1">列表选择</el-radio>
                </el-col>
                <el-col :span="12">
                  <div @click.stop="clickTab">
                    <el-radio label="2">地图选择</el-radio>
                  </div>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="ruleForm.input5=='1'" prop="value1">
            <el-select
              v-model="ruleForm.value1"
              multiple
              collapse-tags
              placeholder="请选择"
              class="full"
            >
              <el-option-group
                v-for="group in options"
                :key="group.areaName"
                :label="group.areaName"
              >
                <el-option
                  v-for="item in group.areaTreeList"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                ></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item v-if="ruleForm.input5=='2'">
            <el-input v-model="selectValue" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-button @click="resetForm('ruleForm')" class="full">重置</el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" @click="submitForm('ruleForm')" class="select_btn full">分析</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div class="insetLeft" @click="hideLeft"></div>
      </div>
    </div>
    <div :class="['right',{hide:!hideleft}]" id="mapBox"></div>
    <div class="reselt" v-if="reselt">
      <div class="plane insetPadding">
        <h3 class="title">分析结果</h3>
        <div class="limitBox">
          <vue-scroll>
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="创谷广告园(2次)" name="1">
              <div class="itembox" @click="onOpenDetail">
                <div class="imgInfo">
                   <img src="../../../../assets/img/share/logo.png" class="img">
                  <p class="timedata"><i class="el-icon-time"></i>2018-12-27  15:46:07</p>
                  <span class="subdata">
                    <i class="vl_icon vl_icon_retrieval_03"></i>
                    <b>99.12</b>%
                  </span>
                </div>
                <p class="fz12"><i class="el-icon-location-outline"></i>长沙市天心区雀园路与君逸路交汇口</p>
              </div>
              <div class="itembox"  @click="onOpenDetail">
                <div class="imgInfo">
                   <img src="../../../../assets/img/share/logo.png" class="img">
                  <p class="timedata"><i class="el-icon-time"></i>2018-12-27  15:46:07</p>
                  <span class="subdata">
                    <i class="vl_icon vl_icon_retrieval_03"></i>
                    <b>99.12</b>%
                  </span>
                </div>
                <p class="fz12"><i class="el-icon-location-outline"></i>长沙市天心区雀园路与君逸路交汇口</p>
              </div>
            </el-collapse-item>
            <el-collapse-item title="反馈 Feedback" name="2">
              <div class="itembox">
                <div class="imgInfo">
                   <img src="../../../../assets/img/share/logo.png" class="img">
                  <p class="timedata"><i class="el-icon-time"></i>2018-12-27  15:46:07</p>
                  <span class="subdata">
                    <i class="vl_icon vl_icon_retrieval_03"></i>
                    <b>99.12</b>%
                  </span>
                </div>
                <p class="fz12"><i class="el-icon-location-outline"></i>长沙市天心区雀园路与君逸路交汇口</p>
              </div>
              <div class="itembox">
                <div class="imgInfo">
                   <img src="../../../../assets/img/share/logo.png" class="img">
                  <p class="timedata"><i class="el-icon-time"></i>2018-12-27  15:46:07</p>
                  <span class="subdata">
                    <i class="vl_icon vl_icon_retrieval_03"></i>
                    <b>99.12</b>%
                  </span>
                </div>
                <p class="fz12"><i class="el-icon-location-outline"></i>长沙市天心区雀园路与君逸路交汇口</p>
              </div>
            </el-collapse-item>
            
          </el-collapse>
          </vue-scroll>
        </div>
        <div class="insetLeft2" @click="hideResult"></div>
      </div>
    </div>

    <!-- 地图选择 -->
    <!-- D设备 B卡口  这里是设备和卡口 -->
    <div is="mapSelector" :open="dialogVisible" :showTypes="'DB'" @mapSelectorEmit="mapPoint"></div>
    <!-- <el-dialog :visible.sync="dialogVisible" width="80%">
      <mapselect
        @selectMap="mapPoint"
        @closeMap="hideMap"
        :allPoints="allDevice"
        :allBayonets="allBayonet"
      ></mapselect>
    </el-dialog> -->
    <!-- 人工筛选 -->
    <el-dialog
      title="人工筛选"
      :visible.sync="dialogChoose"
      width="68%">
      <div class="choose">
        <div class="limitBox">
          <vue-scroll>
          <el-collapse v-model="activeChoose" @change="handleChange">
            <el-collapse-item title="创谷广告园(2次)" name="1">
              <div class="itembox">
                <div class="imgInfo">
                   <img src="../../../../assets/img/share/logo.png" class="img">
                   <div>
                     <p class="timedata"><i class="el-icon-time"></i>2018-12-27  15:46:07</p>
                    <span class="subdata">
                      <i class="vl_icon vl_icon_retrieval_03"></i>
                      <b>99.12</b>%
                    </span>
                   </div>
                  <i class="del el-icon-delete"></i>
                </div>
              </div>
              <div class="itembox">
                <div class="imgInfo">
                   <img src="../../../../assets/img/share/logo.png" class="img">
                   <div>
                     <p class="timedata"><i class="el-icon-time"></i>2018-12-27  15:46:07</p>
                    <span class="subdata">
                      <i class="vl_icon vl_icon_retrieval_03"></i>
                      <b>99.12</b>%
                    </span>
                   </div>
                  <i class="del el-icon-delete"></i>
                </div>
              </div>
              <div class="itembox">
                <div class="imgInfo">
                   <img src="../../../../assets/img/share/logo.png" class="img">
                  <div>
                     <p class="timedata"><i class="el-icon-time"></i>2018-12-27  15:46:07</p>
                    <span class="subdata">
                      <i class="vl_icon vl_icon_retrieval_03"></i>
                      <b>99.12</b>%
                    </span>
                   </div>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="反馈 Feedback" name="2">
              <div class="itembox">
                <div class="imgInfo">
                   <img src="../../../../assets/img/share/logo.png" class="img">
                  <div>
                     <p class="timedata"><i class="el-icon-time"></i>2018-12-27  15:46:07</p>
                    <span class="subdata">
                      <i class="vl_icon vl_icon_retrieval_03"></i>
                      <b>99.12</b>%
                    </span>
                   </div>
                </div>
              </div>
              <div class="itembox">
                <div class="imgInfo">
                   <img src="../../../../assets/img/share/logo.png" class="img">
                  <div>
                     <p class="timedata"><i class="el-icon-time"></i>2018-12-27  15:46:07</p>
                    <span class="subdata">
                      <i class="vl_icon vl_icon_retrieval_03"></i>
                      <b>99.12</b>%
                    </span>
                   </div>
                </div>
              </div>
            </el-collapse-item>
            
          </el-collapse>
          </vue-scroll>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChoose = false">取 消</el-button>
        <el-button type="primary" @click="dialogChoose = false">确 定</el-button>
      </span>
    </el-dialog>
<!-- 抓拍信息 -->
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
                <i class="el-icon-close"  @click="onCloseDetail"></i>
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
                    <div class="struc_c_d_info">
                      <h2>抓拍信息</h2>
                      <div class="struc_cdi_line">
                        <span>{{sturcDetail.shotTime}}<b>抓拍时间</b></span>
                      </div>
                      <div class="struc_cdi_line">
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
                      <div class="struc_cdi_line"></div>
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
import { ajaxCtx, mapXupuxian } from "@/config/config.js";
import { cityCode } from "@/utils/data.js";
import flvplayer from '@/components/common/flvplayer.vue';
import {
  getVehicleShot,
  getAllDevice,
  JtcPOSTAppendixInfo,getFoothold
} from "@/views/index/api/api.judge.js";
import { getAllBayonetList } from "@/views/index/api/api.base.js";
import { MapGETmonitorList } from "@/views/index/api/api.map.js";
// import mapselect from "@/views/index/components/common/mapSelect";
import mapSelector from '@/components/common/mapSelector.vue';
import { log } from 'util';
export default {
  components: {
    mapSelector,
    flvplayer
  },
  data() {
    return {
      dialogChoose:false,
      strucDetailDialog:false, // 抓拍记录弹窗
      strucCurTab: 1, // 抓拍记录弹窗tab
      curImgIndex: 0, // 当前选择的图片index
      strucInfoList: [{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县兴隆路5号154(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-03 16:12:44","panoramaPath":"http://10.116.126.13/parastor300s/public/PRH259/f00000.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县兴隆路5号","longitude":110.595111,"latitude":27.90289,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"龙潭镇神龙大酒店","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":94,"shotTime":"2019-06-09 01:29:16","panoramaPath":"http://10.116.126.13/parastor300s/public/PJH119/f00007.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县龙潭镇神龙大酒店","longitude":110.542891,"latitude":27.411462,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"长沙创谷广告园44","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-10 11:41:04","panoramaPath":"http://10.116.126.13/parastor300s/public/PRH259/f00008.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"长沙市创谷广告软件园","longitude":112.973795,"latitude":28.094549,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县第一中学48","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-07 13:25:00","panoramaPath":"http://10.116.126.13/parastor300s/public/PYR682/f00026.jpg","feature":"粤P8A566；轿车；绿色；大众-捷达-2015","deviceId":null,"address":"溆浦县第一中学","longitude":110.612834,"latitude":27.910003,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县张家湾路口(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":94,"shotTime":"2019-06-06 09:28:55","panoramaPath":"http://10.116.126.13/parastor300s/public/PCS113/f00021.jpg","feature":"粤P8A566；轿车；绿色；大众-捷达-2015","deviceId":null,"address":"溆浦县张家湾路口","longitude":110.587558,"latitude":27.930365,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县气象局(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","feature":"粤P8A566；轿车；绿色；大众-捷达-2015","deviceId":null,"address":"溆浦县气象局","longitude":110.604443,"latitude":27.908643,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县张家湾路口(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":93,"shotTime":"2019-06-07 14:22:36","panoramaPath":"http://10.116.126.13/parastor300s/public/PHD376/f00039.jpg","feature":"粤P9E163；轿车；白色；现代-瑞纳-2016","deviceId":null,"address":"溆浦县张家湾路口","longitude":110.587558,"latitude":27.930365,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县兴隆路5号154(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":93,"shotTime":"2019-06-10 14:24:28","panoramaPath":"http://10.116.126.13/parastor300s/public/PHD376/f00042.jpg","feature":"粤P9E163；轿车；白色；现代-瑞纳-2016","deviceId":null,"address":"溆浦县兴隆路5号","longitude":110.595111,"latitude":27.90289,"cname":null,"uploadPath":null},{"id":null,"deviceCode":null,"structureType":null,"deviceName":"溆浦县龙潭镇汽车站(故障)","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":93,"shotTime":"2019-06-03 04:30:08","panoramaPath":"http://10.116.126.13/parastor300s/public/PYR682/f00033.jpg","feature":"粤P9E163；轿车；白色；现代-瑞纳-2016","deviceId":null,"address":"溆浦县龙潭镇汽车站","longitude":110.539961,"latitude":27.411443,"cname":null,"uploadPath":null}],
      sturcDetail: {"id":null,"vehicleNumber": "粤PRH259","deviceCode":null,"structureType":null,"deviceName":"溆浦县政府41","photoPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","videoPath":"http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4","semblance":90,"shotTime":"2019-06-10 19:29:55","panoramaPath":"http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg","feature":"粤PRH259；轿车；橘色；福特-福睿斯-2012","deviceId":null,"address":"溆浦县警予东路169号","longitude":110.597638,"latitude":27.910355,"cname":null,"uploadPath":'http://n.sinaimg.cn/news/1_img/upload/cf3881ab/762/w1000h562/20190624/0739-hyvnhqq3896792.jpg'},
      bResize: {},
      markerPoint: null, // 地图icon
      playUrl: {},
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
      videoUrl: null, // 下载地址
      map: null,
      /* 上传图片变量 */
      uploadAcion: ajaxCtx.base + "/new", //上传路径
      uploading: false, // 是否上传中
      curImageUrl: "", // 当前上传的图片
      historyPicList: [], // 上传历史记录
      selectedHistoryPic: null, // 当前选中的历史图片
      historyPicDialog: false,
      loadingHis: false, // 加载效果
      imgData: null,
      dialogVisible: false,
      amap: null,
      allDevice: [],
      allBayonet: [],
      selectDevice: [],
      selectBayonet: [],
      selectValue: "已选设备0个",
      // select: "",
      reselt: true,
      hideleft: false,
      ruleForm: {
        data1: null,
        input3: null,
        minFootholdTimes: null,
        input5: "1",
        value1: null
      },
       activeNames: ['1','2'],
       activeChoose: ['1','2'],
      pricecode: cityCode,
      
      options: [],
      evData: []
    };
  },
  mounted() {
    //this.getControlMap(1);
    this.setDTime()
    let map = new window.AMap.Map("mapBox", {
      zoom: 10,
      center: mapXupuxian.center
    });
    map.setMapStyle("amap://styles/whitesmoke");
    this.amap = map;
    this.getMapGETmonitorList(); //查询行政区域
    // this.getAllDevice(); //查询所有的设备
    // this.getAllBayonetList(); //查询所有的卡口
  },
  methods: {

    setDTime () {
      let date = new Date();
      let curDate = date.getTime();
      let curS = 3 * 24 * 3600 * 1000;
        let _sm =(new Date(curDate - curS).getMonth() + 1)>9?(new Date(curDate - curS).getMonth() + 1):("0"+(new Date(curDate - curS).getMonth() + 1))
      let _sd = new Date(curDate - curS).getDate()>9? new Date(curDate - curS).getDate() : ("0"+ new Date(curDate - curS).getDate())
      let _em = (date.getMonth() + 1)>9?(date.getMonth() + 1):("0"+(date.getMonth() + 1))
      let _ed =  date.getDate()>9?date.getDate():("0"+ date.getDate())
      
      let _s = new Date(curDate - curS).getFullYear() +
        "-" + _sm + "-" +_sd;
      let _e = date.getFullYear() + "-" + _em + "-" + _ed;
      this.ruleForm.data1 = [_s, _e]
    },
    /**
     * 弹框地图初始化
     */
    initMap () {
      // this.map.setZoomAndCenter(iZoom, aCenter);
      let map = new window.AMap.Map('container', {
        zoom: 14, // 级别
        center: [this.strucInfoList[0].longitude, this.strucInfoList[0].latitude], // 中心点坐标
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
    handleChange(val) {
        console.log(val);
      },
    hideResult() {
      this.reselt = false;
      this.hideLeft();
    },
    hideLeft() {
      this.hideleft = !this.hideleft;
      if (!this.hideleft && this.evData.length > 0) {
        this.reselt = true;
      }
    },
    clickTab() {
      //  console.log(12,this.dialogVisibles);
      this.dialogVisible = !this.dialogVisible;
      // if (!this.dialogVisible) {
      //   this.dialogVisible = true;
      //   this.dialogVisibles = !this.dialogVisibles;
      // }
    },
    // hideMap() {
    //   this.dialogVisibles = false;
    // },
    mapPoint(data) {
      let v = data.deviceList;
      let p = data.bayonetList;
      //this.dialogVisible = false;
      this.selectDevice = [];
      this.selectBayonet = [];
      //返回有效点集合
      if (v && v.length > 0) {
        v.forEach(element => {
          this.selectDevice.push(element.uid);
        });
      }
      if (p && p.length > 0) {
        p.forEach(element => {
          this.selectBayonet.push(element.uid);
        });
      }
      this.selectValue =
        "已选设备" +
        (this.selectDevice.length + this.selectBayonet.length) +
        "个";
      //this.selectDevice=v

      // console.log(this.selectDevice);
    },
    changeTab(v) {
      //console.log(v);
      if (v == "2") {
        //this.dialogVisibles = !this.dialogVisibles;
        //this.dialogVisibles = true;
      } else{
        //this.dialogVisible=false
      }
    },
    submitForm(v) {
      if (
        this.ruleForm &&
        this.ruleForm.data1 &&
        this.ruleForm.data1.length > 0 &&
        this.curImageUrl
      ) {
        let pg = {
          //shotTime:+"_"+this.ruleForm.data1[1]+" 23:59:59",
          startDate: this.ruleForm.data1[0] + " 00:00:00",
          endDate: this.ruleForm.data1[1] + " 23:59:59",
          //shotTime:this.ruleForm.data1[0]+"_"+this.ruleForm.data1[1],
          minFootholdTimes: this.ruleForm.minFootholdTimes || 0,
        };
        if (this.ruleForm.input5 == 1 && this.ruleForm.value1.length != 0) {
          pg.areaIds = this.ruleForm.value1.join(",");
        }
        if (this.ruleForm.input5 == 2) {
          pg.cameraIds = this.selectDevice.join(",");
          pg.bayonetIds = this.selectBayonet.join(",");
        }
        pg.personPicUrl = this.curImageUrl
        this.getFoothold(pg);
      } else {
        this.$message.info("请上传图片。");
      }
    },
    resetForm(v) {
      this.curImageUrl = "";
      this.ruleForm = {
        data1: null,
        minFootholdTimes: null,
        input5: "1",
        value1: null
      };
      //this.$refs[v].resetFields();
    },
    //查询行政区域
    getMapGETmonitorList() {
      let d = {
        areaUid: mapXupuxian.adcode
      };
      MapGETmonitorList(d).then(res => {
        if (res && res.data) {
          this.options.push(res.data);
        }
      });
    },
    compare(prop) {
      return function(obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
          val1 = Number(val1);
          val2 = Number(val2);
        }
        if (val1 < val2) {
          return 1;
        } else if (val1 > val2) {
          return -1;
        } else {
          return 0;
        }
      };
    },
    getFoothold(d) {
      getFoothold(d).then(res => {
        if (res) {
          // console.log(res);
          this.reselt = true;
          if (!res.data || res.data.length === 0) {
            this.$message.info("抱歉，没有找到匹配结果");
            this.amap.clearMap();
            //this.searching = false;
            return false;
          }
          this.evData = res.data.map(x => {
            x.checked = false;
            return x;
          });
          //  console.log(this.evData);

          this.amap.clearMap();
          this.evData.sort(this.compare("shotNum"));
          this.drawMarkers(this.evData);
          //this.showEventList();
        }
      });
    },
    //查询所有的设备
    getAllDevice() {
      getAllDevice().then(res => {
        // console.log(res);
        if (res.data && res.data.length > 0) {
          this.allDevice = res.data;
        }
      });
    },
    //查询所有的卡口设备
    getAllBayonetList() {
      getAllBayonetList({
        areaId: mapXupuxian.adcode
      }).then(res => {
        if (res.data && res.data.length > 0) {
          this.allBayonet = res.data;
        }
      });
    },
    drawMarkers(data) {
      //console.log(data);
      let limit = 0;
      if (data.length > 3) {
        limit = data[2].shotNum;
      }

      for (let i = 0; i < data.length; i++) {
        let obj = data[i];
        let _idWin = "vlJfoImg" + i;
        let isBig = obj.shotNum >= limit ? true : false;
        if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
          if (isBig) {
            let _sContent = `<div id="${_idWin}" class="vl_jig_mk_p"><p>${
              obj.deviceName
            }</p><p class="big">${obj.shotNum}次</p></div>`;
            // 窗体
            new AMap.Marker({
              // 添加自定义点标记
              map: this.amap,
              position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
              offset: new AMap.Pixel(-90, -124), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: obj,
              // 自定义点标记覆盖物内容
              content: _sContent
            });
          }
          // 摄像头
          let _id = "vlJfoSxt" + i;
          let _content =
            "<div id=" +
            _id +
            ' class="vl_icon vl_jfo_sxt vl_icon_judge_04"></div>';
          new AMap.Marker({
            // 添加自定义点标记
            map: this.amap,
            position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
            offset: new AMap.Pixel(-28.5, -50), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: _content
          });
          setTimeout(() => {
            this.addListen($("#" + _id), "mouseover", i);
            this.addListen($("#" + _id), "mouseout", i, obj);
            this.addListen($("#" + _id), "click", i, obj);
          }, 300);
        }
      }
      this.amap.setFitView();
    },
    addListen(el, evType, key, obj = {}) {
      let self = this;
      let _key;
      el.bind(evType, function() {
        switch (evType) {
          case "mouseover":
            $("#vlJfoImg" + key).addClass("vl_jig_mk_img_hover");
            $("#vlJfoSxt" + key).addClass("vl_icon_judge_02");
            break;
          case "mouseout":
            if (!obj.checked) {
              $("#vlJfoImg" + key).removeClass("vl_jig_mk_img_hover");
              $("#vlJfoSxt" + key).removeClass("vl_icon_judge_02");
            }
            break;
          // case "click":
          //   _key = self.curVideo.indexNum;
          //   self.evData.forEach(z => {
          //     z.checked = false;
          //   });
          //   obj.checked = true;
          //   if (_key !== null) {
          //     $("#vlJfoImg" + _key).removeClass("vl_jig_mk_img_hover");
          //     $("#vlJfoSxt" + _key).removeClass("vl_icon_judge_02");
          //   }
          //   $("#vlJfoImg" + key).addClass("vl_jig_mk_img_hover");
          //   $("#vlJfoSxt" + key).addClass("vl_icon_judge_02");
          //   self.showVideo(obj);
          //   break;
        }
      });
    },
    /* 上传图片方法 */
    beforeAvatarUpload(file) {
      // 上传图片控制
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt = file.size / 1024 / 1024 < 100;
      if (!isJPG) {
        this.$message.error("只能上传 JPG / PNG 格式图片!");
      }
      if (!isLt) {
        this.$message.error("上传图片大小不能超过 100MB!");
      }
      this.uploading = true;
      return isJPG && isLt;
    },
    uploadSucess(response, file) {
      //上传成功
      this.uploading = false;
      console.log(file);
      if (response && response.data) {
        let oRes = response.data;
        if (oRes) {
          let x = {
            cname: oRes.fileName, // 附件名称 ,
            contentUid: this.$store.state.loginUser.uid,
            // desci: '', // 备注 ,
            filePathName: oRes.fileName, // 附件保存名称 ,
            fileType: 1, // 文件类型 ,
            imgHeight: oRes.fileHeight, // 图片高存储的单位位px ,
            imgSize: oRes.fileSize, // 图片大小存储的单位位byte ,
            imgWidth: oRes.fileWidth, //  图片宽存储的单位位px ,
            // otherFlag: '', // 其他标识 ,
            path: oRes.fileFullPath, // 附件路径 ,
            // path: oRes.path,
            thumbnailName: oRes.thumbnailFileName, // 缩略图名称 ,
            thumbnailPath: oRes.thumbnailFileFullPath // 缩略图路径 ,
            // uid: '' //  附件标识
          };
          JtcPOSTAppendixInfo(x).then(jRes => {
            if (jRes) {
              x["uid"] = jRes.data;
              console.log(x);
            }
          });
          this.imgData = x;
          this.curImageUrl = x.path;
        }
      }
    },
    /* 拖拽图片上传的方法 */
    drag(ev) {
      ev.dataTransfer.setData("Text", ev.target.currentSrc);
    },
    drop(e) {
      this.curImageUrl = e.dataTransfer.getData("Text");
      let x = {
        contentUid: this.$store.state.loginUser.uid,
        cname: "拖拽图片" + Math.random(),
        filePathName: "拖拽图片" + Math.random(),
        path: e.dataTransfer.getData("Text")
      };
      JtcPOSTAppendixInfo(x).then(jRes => {
        if (jRes) {
          x["uid"] = jRes.data;
          console.log(x);
        }
      });
    },
    allowDrop(e) {
      e.preventDefault();
    },
    handleError() {
      //上传失败
      this.uploading = false;
      this.$message.error("上传失败");
    },
    delPic() {
      //删除图片
      this.curImageUrl = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.fz12{
  font-size: 12px;
}
.point {
  width: 100%;
  height: 100%;
}
.breadcrumb_heaer {
  background: #ffffff;
}
.full {
  width: 100%;
}
.insetPadding {
  padding: 10px;
}
.right.hide {
  width: calc(100% - 272px);
  height: calc(100% - 54px);
  float: right;
}
.right {
  width: 100%;
  height: calc(100% - 54px);
  float: right;
}
.reselt {
  width: 272px;
  height: calc(100% - 54px);
  background-color: #ffffff;
  position: absolute;
  left: 275px;
  z-index: 2;
  box-shadow: 4px 0px 10px 0px #838383;
  box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
  animation: fadeInLeft 0.4s ease-out 0.3s both;
  .title {
    font-size: 14px;
    font-weight: bold;
    padding-bottom: 12px;
  }
}
.left.hide {
  margin-left: -272px;
  transition: marginLeft 0.3s ease-in;
  position: relative;
  z-index: 2;
  // animation: fadeOutLeft 0.4s ease-out 0.3s both;
}
.left {
  position: relative;
  width: 272px;
  height: calc(100% - 54px);
  background-color: #ffffff;
  float: left;
  z-index: 1;
  margin-left: 0px;
  box-shadow: 4px 0px 10px 0px #838383;
  box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
  animation: fadeInLeft 0.4s ease-out 0.3s both;
  transition: marginLeft 0.3s ease-in;
  .plane {
    padding: 10px;
    position: relative;
    height: 100%;
  }
  .line40 {
    line-height: 40px;
  }
  .inset {
    display: inline-block;
    line-height: 40px;
    font-style: normal;
  }
  .firstItem {
    margin-bottom: 5px;
  }
}
.insetLeft {
  position: absolute;
  right: -28px;
  width: 25px;
  height: 178px;
  top: 50%;
  margin-top: -89px;
  display: inline-block;
  background-repeat: no-repeat;
  transform: rotate(180deg);
  background-image: url(../../../../assets/img/icons.png);
  background-position: -380px -1269px;
  cursor: pointer;
}
.hide {
  .insetLeft {
    transform: rotate(180deg);
    background-position: -504px -1269px;
  }
}
.insetLeft2 {
  position: absolute;
  right: -28px;
  width: 28px;
  height: 178px;
  top: 50%;
  margin-top: -89px;
  display: inline-block;
  background-repeat: no-repeat;
  transform: rotate(180deg);
  background-image: url(../../../../assets/img/icons.png);
  background-position: -318px -1269px;
  cursor: pointer;
}
.select_btn {
  background-color: #0c70f8;
  color: #ffffff;
}
.select_btn:hover{
   background-color: #0466de;
}
// 上传
.upload_warp {
  position: relative;
  height: 232px;
  max-height: 232px;
  overflow: hidden;
  cursor: pointer;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  &:hover {
    background: #2981f8;
    > p {
      display: block;
    }
    .del_icon {
      display: block;
    }
  }
  .vl_jtc_upload {
    width: 100%;
    height: 100%;
    background: none;
  }
  > p {
    display: none;
    position: absolute;
    bottom: 0;
    text-align: center;
    width: 100%;
    color: #ffffff;
    height: 40px;
    line-height: 40px;
    -webkit-border-radius: 0 0 10px 10px;
    -moz-border-radius: 0 0 10px 10px;
    border-radius: 0 0 10px 10px;
    background: #0c70f8;
  }
  .vl_jtc_ic_input {
    position: absolute;
    top: 0.2rem;
    width: 3rem;
    height: 0.26rem;
    left: 0.2rem;
    border: 1px solid #d3d3d3;
    -webkit-border-radius: 0.13rem;
    -moz-border-radius: 0.13rem;
    border-radius: 0.13rem;
    padding: 0 0.02rem;
    background: #ffffff;
    .el-form-item__content {
      height: 0.23rem;
      line-height: 0.23rem;
    }
    input {
      border: none !important;
      height: 0.23rem;
      line-height: 0.23rem;
    }
  }
  .del_icon {
    display: none;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background: rgba(0, 0, 0, 0.4);
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    color: #ffffff;
  }
}
.choose{
  height: 350px;
  padding: 0px 15px;
  overflow: hidden;
  .limitBox{
    .el-collapse-item{
    border: none;
    margin-top: 10px;
    box-shadow: 5px 5px 5px -5px #dddddd;
  }
    .itembox{
      
        width: 33%;
        margin-right: 1%;
        border: solid 1px rgba(211,211,211,1);
        padding: 10px 5px; 
        .imgInfo{
          display: flex;
          position: relative;
          .subdata{
            line-height: 28px;
          }
          img{
            flex: 1;
          }
          .del{
            position: absolute;
            bottom: -10px;
            right: -5px;
            background: #999;
            color: #ffffff;
            padding: 4px;
            cursor: pointer;
          }
        }
      }
      .itembox:last-child{
   border: solid 1px rgba(211,211,211,1);
  }
  }
}
.limitBox{
  height: 96%;
  .el-collapse-item{
    border: solid 1px rgba(211,211,211,1);
    margin-top: 10px;
  }
  .itembox:last-child{
  border: none;
  }
  
}

.plane{
  height: 100%;
}
.imgInfo{
  .timedata{
    padding: 2px 6px;
    display: inline-block;
    background:rgba(250,250,250,1);
    border:1px solid rgba(242,242,242,1);
    border-radius:2px;
    i{
      margin-right: 2px;
      color: #999999;
    }
  }
  .subdata{
    color: #0c70f8;
    line-height: 36px;
    b{
      padding-left: 5px;
      font-size: 28px;
      
    }
  }
    .img{
      float: left;
      width: 62px;
      height: 62px;
      margin-right: 8px;
      // margin-bottom: 8px;
    }
    &:after{
      display: block;
      content: "";
      clear: both;
    }
  }
  .itembox{
    margin-bottom: 10px;
    padding-bottom: 10px;
    margin-top: 10px;
    border-bottom: solid 1px #f2f2f2;
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
      padding: .3rem 0.3rem;
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
        right: 0.3rem;
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
.choose{
  .el-collapse-item__content{
    display: flex;
  }
}
.limitBox{
  height: 96%;

  .el-collapse-item{
    .el-collapse-item__header{
      background: #F6F6F6;
      padding-left: 10px;
      height: 40px;
      line-height: 40px;
    }
  }
  .el-collapse-item__content{
    padding: 10px;
  }
}
.vl_jig_mk_p {
  width: 180px;
  height: auto;
  background: #ffffff;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  box-shadow: 4px 0px 10px 0px #838383;
  box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
  .big {
    font-size: 16px;
    font-weight: bold;
  }
  &:after {
    border-bottom-color: rgba(0, 0, 0, 1);
    content: "";
    display: inline-block;
    position: absolute;
    left: 50%;
    margin-left: -10px;
    bottom: -10px;
    border-top: 10px solid #fff;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
  }
  &.vl_jig_mk_img_hover {
    &:after {
      border-bottom-color: rgba(0, 0, 0, 1);
      content: "";
      display: inline-block;
      position: absolute;
      left: 50%;
      margin-left: -10px;
      bottom: -10px;
      border-top: 10px solid #0c70f8;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
    }
    background: rgba(12, 112, 248, 1);
    position: relative;
    border: 0.04rem solid #0c70f8;
    > p {
      color: #ffffff;
    }
  }
}
.ljd {
  .insetIput.el-input--prefix .el-input__inner {
    padding-left: 90px;
  }
  .el-dialog__wrapper .el-dialog__body {
    padding: 0px;
  }
  .el-dialog__header {
    padding: 0px 20px 3px;
  }
  .el-dialog__headerbtn {
    z-index: 1;
  }
  .el-dialog__title{
    line-height: 48px;
  }
  // 上传
  .upload_warp .vl_jtc_upload {
    .el-upload {
      width: 100%;
      height: 100%;
      background: #f2f2f2;
      border: none;
      span {
        color: #999;
      }
      img {
        width: 100%;
        height: 100%;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
      }
    }
  }
}
</style>
