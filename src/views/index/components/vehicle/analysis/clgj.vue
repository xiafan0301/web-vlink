<template>
  <div class="ljd point">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>车辆轨迹</el-breadcrumb-item>
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
          <el-form-item class="firstItem" prop="data1">
            <el-date-picker
                    v-model="ruleForm.data1"
                    type="daterange"
                    class="full data_range"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

          <el-form-item prop="input3">
            <el-input placeholder="请输入车牌号" v-model="ruleForm.input3" class="input-with-select">
            </el-input>
          </el-form-item>
          <el-form-item label="区域：" label-width="60px" prop="input5">
            <el-radio-group v-model="ruleForm.input5">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-radio label="1">列表选择</el-radio>
                </el-col>
                <el-col :span="12">
                  <div @click="clickTabCh">
                    <el-radio label="2">地图选择</el-radio>
                  </div>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="ruleForm.input5=='1'" prop="value1">
            <el-select v-model="ruleForm.value1" multiple collapse-tags placeholder="请选择" class="full">
              <el-option-group
                v-for="group in options"
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
          <el-form-item v-if="ruleForm.input5=='2'" >
            <el-input  v-model="'已选设备'+ pointData.length + '个'" :disabled="true">
            </el-input>
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
    <div :class="['right',{hide:!hideleft}]" id="rightMap"></div>
    <div class="reselt" v-if="reselt">
      <div class="plane insetPadding">
          <h3 class="title">分析结果</h3>
          <div class="sup_title">
            <div  @click="timeOrderS">时间排序 <span><i class="el-icon-caret-top" :class="{'active': !timeOrder}"></i><i :class="{'active': timeOrder}" class="el-icon-caret-bottom"></i></span></div>
            <div>抓拍地址</div>
          </div>
          <div class="plane_main_box">
            <vue-scroll>
              <div class="plane_main">
                <!--可以展开列表-->
                <div class="p_main_list"  :class="{'is_open': item.isOpen}" v-for="item in leftEvData" :key="item.id">
                  <div class="p_main_head" @click="item.isOpen = !item.isOpen"><i :class="{'el-icon-caret-right': !item.isOpen, 'el-icon-caret-bottom': item.isOpen}"></i>{{item.label}}</div>
                  <div class="p_main_item" v-for="sItem in item.list" :key="sItem.id" @click="showStrucInfo(sItem, evData.findIndex(function (u) {return u === sItem}))">
                    <div>{{sItem.shotTime.slice(-8)}}</div>
                    <div :title="sItem.address">{{sItem.address ? sItem.address : '无'}}</div>
                  </div>
                </div>
                <el-pagination
                  v-show="pagination.total > 10"
                  class="cum_pagination th-center-pagination"
                  @current-change="onPageChange"
                  :current-page.sync="pagination.pageNum"
                  :page-size="pagination.pageSize"
                  layout="prev, pager, next"
                  :total="pagination.total">
                </el-pagination>
              </div>
            </vue-scroll>
          </div>
          <div class="insetLeft2" @click="hideResult"></div>
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
        <i class="el-icon-close" @click="strucDetailDialog = false"></i>
      </div>
      <div class="struc_main">
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.subStoragePath" alt="">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img">
              <img :src="sturcDetail.storagePath" alt="">
              <span>全景图</span>
            </div>
            <div class="struc_c_d_info">
              <h2>抓拍信息</h2>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.shotTime}} <font>抓拍时间</font></span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.deviceName}} <font>抓拍设备</font></span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.address}} <font>抓拍地址</font></span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.plateNo}} <font>车牌号</font></span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.vehicleColor}} {{sturcDetail.vehicleClass}} {{sturcDetail.vehicleBrand}} {{sturcDetail.vehicleStyles}} <font>特征</font></span>
              </div>
              <div class="struc_cdi_line"></div>
            </div>
          </div>
        </div>
        <div v-show="strucCurTab === 2" class="struc_c_address"></div>
        <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.subStoragePath" alt="">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <video id="capVideo" :src="sturcDetail.videoPath"></video>
            <div class="play_btn" @click="videoTap" v-show="!playing">
              <i class="vl_icon vl_icon_judge_01" v-if="playing"></i>
              <i class="vl_icon vl_icon_control_09" v-else></i>
            </div>
          </div>
          <div class="download_btn"><a download="视频" :href="videoUrl"></a>下载视频</div>
        </div>
      </div>
      <div class="struc-list">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in evData" :key="item.id">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
              <img style="width: 100%; height: .88rem;" :src="item.subStoragePath" alt="">
              <!--<div class="vl_jfo_sim" ><i class="vl_icon vl_icon_retrieval_05" :class="{'vl_icon_retrieval_06':  index === curImgIndex}"></i>{{item.semblance ? item.semblance : 92}}<span style="font-size: 12px;">%</span></div>-->
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
    </el-dialog>
    <!-- 地图选择 -->
    <el-dialog class="map_select" :show-close="false" :visible.sync="dialogVisible" width="80%">
      <div class="mapbox">
        <div class="mapbox map_select_box"></div>
        <div class="bottomBox">
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelMap">取 消</el-button>
            <el-button class="select_btn" type="primary" @click="confirmMap">确 认</el-button>
          </span>
        </div>
        <div class="setPost">
          <div>
            <el-autocomplete
                class="inline-input"
                v-model="input3"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                value-key="name"
                :trigger-on-focus="false"
                @select="handleSelect"
            ></el-autocomplete>
            <el-button slot="append" icon="el-icon-search" class="select_btn" @click="setCenter()"></el-button>
            <!-- </el-input> -->
          </div>
          <div class="drawBox">
            <p>请选择框选图形</p>
            <div class="items">
              <span @click="clickTab('cut1')" :class="['cut1',{'hover':hover=='cut1'}]"></span>
              <span @click="clickTab('cut2')" :class="['cut2',{'hover':hover=='cut2'}]"></span>
              <span @click="clickTab('cut3')" :class="['cut3',{'hover':hover=='cut3'}]"></span>
              <span @click="clickTab('cut4')" :class="['cut4',{'hover':hover=='cut4'}]"></span>
              <span @click="clickTab('cut5')" :class="['cut5',{'hover':hover=='cut5'}]"></span>
            </div>
          </div>
        </div>
        <div class="shrink">
          <span class="el-icon-plus" @click="mapZoomSet(1)"></span>
          <span class="el-icon-minus" @click="mapZoomSet(-1)"></span>
        </div>
      </div>
    </el-dialog>
    <div id="capMap"></div>
    <div id="contentMap"></div>
  </div>
</template>
<script>
  import { mapXupuxian } from "@/config/config.js";
  import { objDeepCopy, random14 } from "@/utils/util.js";
  import { cityCode } from "@/utils/data.js";
  import { getAllDevice,InvestigateGetTrace } from "@/views/index/api/api.judge.js";
  import { MapGETmonitorList } from "@/views/index/api/api.map.js";
  import { getAllBayonetList } from "@/views/index/api/api.base.js";
  export default {
    data() {
      return {
        hover:null,
        input3: null,
        mouseTool: null,
        drawArea: null,
        swiperOption: {
          slidesPerView: 10,
          spaceBetween: 10,
          slidesPerGroup: 9,
          loop: false,
          slideToClickedSlide: true,
          loopFillGroupWithBlank: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        },
        pagination: { total: 0, pageSize: 10, pageNum: 1 },
        dialogVisible: false,
        amap: null,
        map: null,
        contentMap: null,
        pointData: [],
        reselt: false,
        hideleft: false,
        timeOrder: false,
        ruleForm: {
          data1:null,
          input3: '',
          input5: "1",
          value1: null,
        },
        pricecode:cityCode,
        storeParam: {}, // 暂存上一次搜索的入参
        options: [],
        pickerOptions: {
          disabledDate (time) {
            let date = new Date();
            let y = date.getFullYear();
            let m = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
            let d = date.getDate();
            let threeMonths = '';
            let start = '';
            if (parseFloat(m) >= 4) {
              start = y + '-' + (m - 1) + '-' + d;
            } else {
              start = (y - 1) + '-' + (m - 1 + 12) + '-' + d;
            }
            threeMonths = new Date(start).getTime();
            return time.getTime() > Date.now() || time.getTime() < threeMonths;
          }
        },
        evData: [],
        leftEvData: [],
        marks: [[], []],
        markerLine: [], // 地图线集合
        markerPoint: [], // 地图点集合
        supMarkerPoint: null,
        curStrucList: [],
        strucCurTab: 1,
        curImgIndex: 0,
        sturcDetail: {},
        playing: false, // 视频播放是否
        strucDetailDialog: false,
        videoUrl: '' // 弹窗视频回放里的视频
      };
    },
    mounted() {
      this.getMapGETmonitorList()//查询行政区域
      this.renderMap();
      this.getAllDevice() //查询所有的设备
      this.setDTime();
    },
    methods: {
      setDTime () {
        let date = new Date();
        let curDate = date.getTime();
        let curS = 1 * 24 * 3600 * 1000;
        let _s = new Date(curDate - curS).getFullYear() + '-' + (new Date(curDate - curS).getMonth() + 1) + '-' + new Date(curDate - curS).getDate();
//        let _e = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() - 1;
        this.ruleForm.data1 = [_s, _s];
      },
      onPageChange (page) {
        this.pagination.pageNum = page;
        this.operData();
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
      clickTabCh() {
        if (!this.dialogVisible) {
          this.dialogVisible = true;
          this.$nextTick(() => {
            $('.map_select_box').append($('#contentMap'))
            this.contentMap.setFitView();
          })
        }
      },
      clickTab(val){
        this.hover = this.hover==val?'':val
        if(!this.hover){
          this.map.setDefaultCursor();
          this.mouseTool.close(false);
        }else{
          this.selArea(val)
        }

      },
      selArea (v) {
        this.map.setDefaultCursor('crosshair');
        switch (v){
          case 'cut1' :
            this.mouseTool.rectangle({
              strokeColor:'#FA453A',
              strokeWeight: 1,
              fillColor:'#FA453A',
              fillOpacity:0.2,
              strokeStyle: 'solid',
            })
            break ;
          case 'cut2' :
            this.mouseTool.circle({
              strokeColor: "#FA453A",
              strokeOpacity: 1,
              strokeWeight: 1,
              strokeOpacity: 0.2,
              fillColor: '#FA453A',
              fillOpacity: 0.2,
              strokeStyle: 'solid',
              // 线样式还支持 'dashed'
              // strokeDasharray: [30,10],
            })
            break ;
          case 'cut3' :
            this.mouseTool.polyline({
              strokeColor: "#FA453A",
              strokeOpacity: 1,
              strokeWeight: 2,
              // 线样式还支持 'dashed'
              strokeStyle: "solid",
              // strokeStyle是dashed时有效
              // strokeDasharray: [10, 5],
            })

            break ;
          case 'cut4' :
            this.mouseTool.polygon({
              zIndex: 13,
              strokeColor: '#FA453A',
              strokeOpacity: 1,
              bubble: true,
              strokeWeight: 1,
              fillColor: '#FA453A',
              fillOpacity: 0.2,
              isRing: false
            });
            break ;
          case 'cut5' :
            break ;
        }
      },
      hideMap(){
        this.dialogVisible=false
      },
      submitForm(v) {
        if(this.ruleForm && this.ruleForm.data1 && this.ruleForm.data1.length>0 && this.ruleForm.input3){
          let pg = {
            pageSize: 9999,
            where: {}
          }
          pg.where['startTime'] = this.ruleForm.data1[0]+" 00:00:00";
          pg.where['endTime'] = this.ruleForm.data1[1]+" 23:59:59";
          pg.where['vehicleNumber'] = this.ruleForm.input3;
          if(this.ruleForm.input5==1 && this.ruleForm.value1.length!=0){
            pg.where['areaUid']=this.ruleForm.value1.join(",")
          }
          if(this.ruleForm.input5==2){
            pg.where['bayonetIds'] = this.pointData.filter(x => x.dataType === 1).map(y => {return y.uid}).join(',');
            pg.where['deviceUid'] = this.pointData.filter(x => x.dataType === 0).map(y => {return y.uid}).join(',');
          }
          this.storeParam = objDeepCopy(pg);
          this.getVehicleShot(pg);
        }else{
          this.$message.info("请输入开始时间和车牌号码。");
        }
      },
      resetForm(){
        this.ruleForm= {
          data1:null,
          input3: null,
          input5: "1",
          value1: null,
        }
        //this.$refs[v].resetFields();
      },
      mapZoomSet(val) {
        if (this.contentMap) {
          this.contentMap.setZoom(this.contentMap.getZoom() + val);
        }
      },
      setCenter() {
        var _this = this;
        // console.log(this.input3);
        let placeSearch = new AMap.PlaceSearch({
          // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
          city: "021"
        });
        placeSearch.search(this.input3, function(status, result) {
          // 查询成功时，result即对应匹配的POI信息
          //  console.log(result)
          let pois = result.poiList.pois;
          if (pois.length > 0) {
            let new_center = pois[0].location;
            _this.contentMap.setZoomAndCenter(16, new_center);
          }

          // for(var i = 0; i < pois.length; i++){
          //     var poi = pois[i];
          //     var marker = [];
          //     marker[i] = new AMap.Marker({
          //         position: poi.location,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          //         title: poi.name
          //     });
          //     // 将创建的点标记添加到已有的地图实例：
          //     _this.amap.add(marker[i]);
          // }
          // _this.amap.setFitView();
        });
      },
      confirmMap(){
        this.dialogVisible = false;
      },
      cancelMap(){
        this.dialogVisible = false;
        this.pointData = [];
        if (this.drawArea) {
          this.contentMap.remove(this.drawArea)
        }
      },
      //查询行政区域
      getMapGETmonitorList(){
        let d={
          areaUid:mapXupuxian.adcode
        }
        MapGETmonitorList(d).then(res=>{
          if(res && res.data){
            res.data.areaTreeList.forEach(x => {
              this.ruleForm.value1.push(x.areaId)
            })
            this.options.push(res.data)
          }
        })
      },
      querySearch(queryString, cb) {
        //this.seacher(queryString)

        this.$nextTick(() => {
          this.seacher(queryString).then(v => {
            //console.log(v);
            var restaurants = v;
            //  console.log(restaurants)
            var results = queryString
                ? restaurants.filter(this.createFilter(queryString))
                : restaurants;
            // console.log(results)
            cb(results);
            // 调用 callback 返回建议列表的数据
            // clearTimeout(this.timeout);
            //   this.timeout = setTimeout(() => {
            //     cb(results);
            //   }, 3000 * Math.random());
            // cb(results);
          });
        });
      },
      handleSelect(item) {
        // console.log(item);
        let new_center = item.location;
        this.contentMap.setZoomAndCenter(16, new_center);
      },
      createFilter(queryString) {
        return restaurant => {
          // console.log(restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()));

          return (
              restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) > -1
          );
        };
      },
      seacher(v) {
        var placeSearch = new AMap.PlaceSearch({
          // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
          city: "湖南"
        });

        if (!!v) {
          let _this = this;
          return new Promise((resolve, reject) => {
            placeSearch.search(v, (status, result) => {
              // 查询成功时，result即对应匹配的POI信息
              let pois = result.poiList.pois;
              _this.restaurants = pois;
              resolve(pois);
            });
          });
        }
        //return pois
      },
      renderMap() {
        let map = new window.AMap.Map("rightMap", {
          zoom: 10,
          center: mapXupuxian.center
        });
        map.setMapStyle("amap://styles/whitesmoke");
        this.amap = map;
        // 弹窗地图
        let supMap = new AMap.Map('capMap', {
          center: mapXupuxian.center,
          zoom: 16
        });
        supMap.setMapStyle('amap://styles/whitesmoke');
        this.map = supMap;
        // 弹窗地图
        let supMap1 = new AMap.Map('contentMap', {
          center: mapXupuxian.center,
          zoom: 16
        });
        supMap1.setMapStyle('amap://styles/whitesmoke');
        this.contentMap = supMap1;
        // 在地图中添加MouseTool插件
        this.mouseTool = new window.AMap.MouseTool(supMap1);
        let _this=this
        this.contentMap.on( 'click',   function (e) {
          //lnglatInput.value = e.lnglat.toString();
          if(_this.hover=='cut5'){
            _this.mouseTool.close(true);
            if (_this.drawArea) {
              _this.contentMap.remove(_this.drawArea)
            }
            _this.circle = new AMap.Circle({
              center:e.lnglat,
              radius: 5000, //半径
              borderWeight: 3,
              strokeColor: "#FF33FF",
              strokeWeight: 1,
              strokeOpacity: 0.2,
              fillOpacity: 0.4,
              strokeStyle: 'solid',
              // strokeDasharray: [10, 10],
              // 线样式还支持 'dashed'
              fillColor: '#1791fc',
              zIndex: 50,
            })
            _this.circle.setMap(_this.contentMap);
            _this.drawArea = _this.circle;
            _this.checkout(_this.circle,'AMap.circle')
          }

        });
        window.AMap.event.addListener(this.mouseTool, 'draw', function (e) {
          if (_this.drawArea) {_this.contentMap.remove(_this.drawArea);}
          _this.drawArea = e.obj;
          let a=e.obj
          let t=e.obj.CLASS_NAME
          _this.checkout(a,t)
        });
      },
      checkout(obj , type){
        if(type!="AMap.Polyline"){
          this.mapTreeData.forEach(el=>{
            let myLngLat=new AMap.LngLat(el.longitude,el.latitude);
            //  var isPointInRing = window.AMap.GeometryUtil.isPointInRing(myLngLat,obj.C.path);
            let isPointInRing = obj.contains(myLngLat);
            // console.log(marker.getPosition());
            if(isPointInRing){//如果点在圆内则输出
              let id = this.pointData.findIndex(item=>item.uid==el.uid)
              if(id == -1){
                this.pointData.push(el)
              }
            }
          })
        }else{
          this.mapTreeData.forEach(el=>{
            let myLngLat=new AMap.LngLat(el.longitude,el.latitude);
            // let  closestPositionOnLine  = AMap.GeometryUtil.closestOnLine(myLngLat,obj.C.path);
            // console.log(closestPositionOnLine);

            let distance =  Math.round(window.AMap.GeometryUtil.distanceToLine(myLngLat,obj.B.path));
            // console.log(distance);
            let id = this.pointData.findIndex(item=>item.uid==el.uid)
            if(id==-1 && distance <=1000){
              this.pointData.push(el)
            }
          })
        }
      },
      
      compare  (prop, bool) {
        return function (obj1, obj2) {
          var val1 = obj1[prop];
          var val2 = obj2[prop];
          if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
          }
          if (val1 < val2) {
            if (bool) {
              return -1;
            } else {
              return 1;
            }
          } else if (val1 > val2) {
            if (bool) {
              return 1;
            } else {
              return -1;
            }
          } else {
            return 0;
          }
        }
      },
      getVehicleShot(d) {
        this.$_showLoading('.right');
        InvestigateGetTrace(d).then(res => {
          if (res) {
            // console.log(res);
            this.$_hideLoading();
            if (!res.data || res.data.length === 0) {
              this.$message.info("抱歉，没有找到匹配结果");
              this.amap.clearMap();
              //this.searching = false;
              return false;
            }
            this.reselt = true;
            this.evData = res.data.list;
            this.evData.sort(this.compare("shotTime", this.timeOrder ? false : true));
            this.pagination.total = res.data.total;
            //  重组数据，给左边列表使用
            this.operData();
            this.amap.clearMap();
            this.drawMapMarker(this.evData);
            //this.showEventList();
          }
        }).catch(() => {
          this.$_hideLoading();
        });
      },
      operData () {
        this.leftEvData = [];
        let keyArr = [];
        this.evData.forEach((x, index) => {
          if ((index + 1) <= this.pagination.pageNum * (this.pagination.pageSize) && (index + 1) > (this.pagination.pageNum - 1) * (this.pagination.pageSize)) {
            let key = x.shotTime.slice(0, 10);
            if (!keyArr.includes(key)) {
              keyArr.push(key);
              let obj = {label: key,isOpen: true};
              obj.list = [];
              obj.list.push(x);
              this.leftEvData.push(obj);
            } else {
              this.leftEvData.find(y => y.label === key).list.push(x);
            }
          }
        })
      },
      //查询所有的设备
      getAllDevice(){
        getAllDevice().then(res=>{
          if(res.data && res.data.length>0){
            console.log(res.data)
            this.objSetItem(res.data, {infoName: 'deviceName', dataType: 0});
          }
          getAllBayonetList({
            areaId: mapXupuxian.adcode
          }).then(resBon => {
            console.log(resBon.data);
            if(resBon.data && resBon.data.length>0){
              this.objSetItem(resBon.data, {infoName: 'bayonetName', dataType: 1});
            }
            this.mapTreeData = res.data.concat(resBon.data)
            console.log(this.mapTreeData)
            this.mapMark(this.mapTreeData)
          })
        })
      },
      objSetItem (list, obj) {
        list.map(z => {
          for (let key in obj) {
            z[key] = z[obj[key]] ? z[obj[key]] : obj[key]
          }
          // 都加上markSid , 方便处理移动端发起的通话
          if (!z['markSid']) {
            z['markSid'] = 'mapMark' + z['dataType'] + z['uid'];
          }
          return z;
        })
        return list;
      },
      //查询所有的卡口设备
      timeOrderS () {
        this.timeOrder = !this.timeOrder;
        this.getVehicleShot(this.storeParam)
      },
      // 地图标记
      mapHoverInfo (data) {
        let str = '<div class="vl_map_hover_main"><ul>';
        if (data.dataType === 0) {
          str += '<li><span>设备名称：</span><p>' + data.infoName + '</p></li>';
          str += '<li><span>设备地址：</span><p>' + data.address + '</p></li>';
          str += '</ul></div>'
        } else if (data.dataType === 1) {
          str += '<li><span>卡口名称：</span><p>' + data.infoName + '</p></li>';
          str += '<li><span>卡口编号：</span><p>' + data.bayonetNo + '</p></li>';
          str += '<li><span>地理位置：</span><p>' + data.bayonetAddress + '</p></li>';
//          str += '<li><span>设备数量：</span><p>' + data.devNum + '</p></li>';
          str += '</ul></div>'
        }
        return str;
      },
      mapMark (data) {
        if (data && data.length > 0) {
          let _this = this;
          data.forEach(obj => {
            if (obj.longitude > 0 && obj.latitude > 0) {
              let offSet = {0: [-15, -16],1: [-15, -16],2: [-15, -60],3: [-15, -16], 4: [-15, -16],5: [-15, -16]}, sDataType;
              if (obj.dataType === 0 && obj.deviceStatus !== 1) {
                sDataType = 6;
              }else if (obj.dataType === 2) {
                sDataType = '2' + obj.vehicleType
              } else {
                sDataType = obj.dataType;
              }
              let uContent = '<div id="' + obj.markSid + '" class="map_icons vl_icon vl_icon_map_mark' + sDataType + '"></div>'
              if (obj.dataType === 2 && !_this.constObj[obj.dataType].supTypeList.includes(obj.vehicleType - 1)) {
                uContent = '<div id="' + obj.markSid + '" class="map_icons vl_icon vl_icon_map_mark' + sDataType + ' '+ _this.hideClass +'"></div>'
              }
              let marker = new window.AMap.Marker({ // 添加自定义点标记
                map: _this.contentMap,
                position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
                offset: new window.AMap.Pixel(offSet[obj.dataType][0], offSet[obj.dataType][1]), // 相对于基点的偏移位置
                draggable: false, // 是否可拖动
                extData: obj,
                // 自定义点标记覆盖物内容
                content: uContent,
                bubble: true
              });
              _this.marks[obj.dataType].push(marker);
              // hover
              marker.on('mouseover', function () {
//                  $('#' + obj.markSid).addClass('vl_icon_map_hover_mark' + obj.dataType)
                let curP = marker.getPosition();
                let sContent = '<div class="vl_map_hover" >' + _this.mapHoverInfo(obj) + '</div>';
                _this.hoverWindow = new window.AMap.InfoWindow({
                  isCustom: true,
                  closeWhenClickMap: true,
                  offset: new window.AMap.Pixel(9, 34), // 相对于基点的偏移位置
                  content: sContent,
                  bubble: true
                });
                _this.hoverWindow.open(_this.contentMap, new window.AMap.LngLat(curP.lng, curP.lat));

              });
              marker.on('mouseout', function () {
//                  $('#' + obj.markSid).removeClass('vl_icon_map_hover_mark' + obj.dataType)
              })
            }
          })
        }
      },
      drawMapMarker (data) {
        console.log(data)
        let path = [];
        for (let  i = 0; i < data.length; i++) {
          let obj = data[i];
          let _path = [obj.shotPlaceLongitude, obj.shotPlaceLatitude];
          if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
            let _sContent = `
            <div class="vl_jtc_mk">
              <img src="${obj.subStoragePath}"/>
              <p>${obj.shotTime}</p>
            </div>`;
            // 窗体
            let winInfo = new AMap.Marker({ // 添加自定义点标记
              map: this.amap,
              position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
              offset: new AMap.Pixel(20, -80), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: obj,
              content: _sContent
            });
            winInfo.on('click', () => {
              this.showStrucInfo(obj, i)
            })
            path.push(_path);
            let _content = `<div class="vl_icon vl_icon_sxt"></div>`
            let point = new AMap.Marker({ // 添加自定义点标记
              map: this.amap,
              position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
              offset: new AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              // 自定义点标记覆盖物内容
              content: _content
            });
            this.markerPoint[i] = point;
          }
        }
        this.amap.setFitView()
        this.drawLine(path);
      }, // 覆盖物（窗体和checkbox
      drawLine (path) {
        var polyline = new AMap.Polyline({
          path: path,
          showDir: true,
          strokeColor: '#61C772',
          strokeWeight: 6
        });
        this.markerLine.push(polyline);
        this.amap.add([polyline]);
      }, // 画线
      videoTap () {
        let vDom = document.getElementById('capVideo')
        if (this.playing) {
          vDom.pause();
        } else {
          vDom.play();
        }
        vDom.addEventListener('ended', (e) => {
          e.target.currentTime = 0;
          this.playing = false;
        })
        this.playing = !this.playing;
      },
      showStrucInfo (data, index) {
        this.amap.setZoomAndCenter(16, [data.shotPlaceLongitude, data.shotPlaceLatitude])
        this.curImgIndex = index;
        this.strucDetailDialog = true;
        this.sturcDetail = data;
        this.strucCurTab = 1;
        this.drawPoint(data);
      },
      drawPoint (data) {
        this.$nextTick(() => {
          $('.struc_c_address').append($('#capMap'))
        })
        if (this.supMarkerPoint) {
          this.map.remove(this.supMarkerPoint)
        }
        let _content = '<div class="vl_icon vl_icon_judge_02"></div>'
        this.supMarkerPoint = new AMap.Marker({ // 添加自定义点标记
          map: this.map,
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
          offset: new AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: _content
        });
        this.map.setZoomAndCenter(16, [data.shotPlaceLongitude, data.shotPlaceLatitude]); // 自适应点位置
        let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`
        new AMap.InfoWindow({
          map: this.map,
          isCustom: true,
          closeWhenClickMap: false,
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude],
          offset: new AMap.Pixel(0, -70),
          content: sConent
        })
      },
      imgListTap (data, index) {
        this.curImgIndex = index;
        this.sturcDetail = data;
        this.drawPoint(data);
      }
    }
  };
</script>
<style lang="scss" scoped>
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
    height: 100%;
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
      font-size: 16px;
      font-weight: bold;
      padding-top: 10px;
      padding-bottom: 19px;
      color: #333333;
    }
    .sup_title {
      height: 40px;
      line-height: 40px;
      background: #F6F6F6;
      color: #333333;
      > div {
        display: inline-block;
        width: 50%;
        text-align: center;
        &:first-child {
          cursor: pointer;
          >span {
            display: inline-block;
            height: 25px;
            vertical-align: middle;
            i {
              display: block;
              height: 10px;
            }
            .active {
              color: #2580FC;
            }
          }
        }
      }
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
    background-image: url(../../../../../assets/img/icons.png);
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
    background-image: url(../../../../../assets/img/icons.png);
    background-position: -318px -1269px;
    cursor: pointer;
  }
  .select_btn {
    background-color: #0c70f8;
    color: #ffffff;
  }
  .plane_main_box {
    height: calc(100% - 100px);
    padding-top: 10px;
  }
  .map_select_box {
    #contentMap {
      width: 100%;
      height: 100%;
    }
  }
  .plane_main {
    .p_main_list {
      height: 40px;
      overflow: hidden;
      -webkit-transition: all .3s;
      -moz-transition: all .3s;
      -ms-transition: all .3s;
      -o-transition: all .3s;
      transition: all .3s;
      .p_main_head {
        height: 40px;
        line-height: 40px;
        background: #F6F6F6;
        cursor: pointer;
        text-indent: 6px;
        border-bottom: 1px solid #F2F2F2;
        i{
          color: #999999;
        }
      }
      .p_main_item {
        width: 100%;
        height: 39px;
        cursor: pointer;
        &:hover{
          background: #E0F3FF;
          color: #0C70F8;
        }
        >div {
          display: inline-block;
          width: 50%;
          text-align: center;
          line-height: 39px;
          color: #666666;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          border-bottom: 1px solid #F2F2F2;
        }
      }
    }
    .is_open {
      height: auto;
    }
    .th-center-pagination {
      text-align: center;
    }
  }
  .mapbox {
    width: 100%;
    height: 500px;
    .shrink {
      background: #ffffff;
      padding: 1px;
      position: absolute;
      right: 20px;
      bottom: 90px;
      box-shadow: 3px 4px 5px -5px #666666;
      span {
        display: block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        font-size: 28px;
        font-weight: normal;
        cursor: pointer;
        &:first-child {
          border-bottom: solid 1px #dddddd;
        }
      }
      span:hover {
        color: #0c70f8;
      }
    }
    .select_btn {
      background-color: #0c70f8;
      color: #ffffff;
    }
  }
  .bottomBox{
    background: #ffffff;
    width: 100%;
    padding: 10px 10px;
    text-align: center;
  }
  .setPost {
    position: absolute;
    left: 20px;
    top: 20px;
    width: 300px;
    .drawBox {
      margin-top: 20px;
      background: #ffffff;
      padding: 10px;
      .items {
        padding-top: 20px;
        span {
          display: inline-block;
          width: 55px;
          height: 55px;
          text-align: center;
          line-height: 55px;
          border-right: solid 1px #eeeeee;
          cursor: pointer;
          &:last-child {
            border-right: none;
          }
        }
        .cut1 {
          background: url(../../../../../assets/img/vehicle/cut1.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut1.hover {
          background: #f2f9ff url(../../../../../assets/img/vehicle/cut1m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut2 {
          background: url(../../../../../assets/img/vehicle/cut2.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut2.hover {
          background: #f2f9ff url(../../../../../assets/img/vehicle/cut2m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut3 {
          background: url(../../../../../assets/img/vehicle/cut3.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut4 {
          background: url(../../../../../assets/img/vehicle/cut4.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut5 {
          background: url(../../../../../assets/img/vehicle/cut5.png) center
          no-repeat;
          background-size: 80% 80%;
        }
        .cut3.hover {
          background: #f2f9ff url(../../../../../assets/img/vehicle/cut3m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut4.hover {
          background: #f2f9ff url(../../../../../assets/img/vehicle/cut4m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut5.hover {
          background: #f2f9ff url(../../../../../assets/img/vehicle/cut5m.png) center
          no-repeat;
          background-size: 80% 80%;
        }
      }
    }
  }
</style>
<style lang="scss">
  .data_range {
    .el-range__close-icon {
      display: none;
    }
  }
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
      width: 11.46rem;
      height: 4.4rem;
      margin: 0 auto;
      border-bottom: 1px solid #F2F2F2;
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
          margin-right: .3rem;
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
          box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
          border-radius:1px;
          position: relative;
          overflow: hidden;
          >div {
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
              .vl_jfo_sim {
                color: #0C70F8;
                font-weight: bold;
                font-size: .24rem;
                float: right;
                i {
                  vertical-align: text-bottom;
                  margin-right: .1rem;
                }
                span {
                  font-weight: normal;
                }
              }
            }
            .struc_cdi_line {
              >span {
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
                padding: 0 .1rem;
                margin-right: .08rem;
                > i {
                  vertical-align: middle;
                  margin-left: .1rem;
                }
                font {
                  color: #999999;
                  margin-left: 20px;
                }
              }
              p {
                color: #999999;
              }
            }
          }
          &:after {
            display: block;
            content: '';
            position: absolute;
            top: -.4rem;
            right: -.4rem;
            transform: rotate(-45deg);
            border: .4rem solid #FFFFFF;
            border-color: transparent transparent transparent #FFFFFF;
          }
          >span {
            display: block;
            position: absolute;
            top: .19rem;
            right: .19rem;
            width: 1rem;
            height: 1rem;
            text-align: center;
            color: #FFFFFF;
            font-size: .12rem;
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            transform: rotate(45deg);
            z-index: 99;
          }
        }
      }
      .struc_c_address {
        height: 100%;
        #capMap {
          width:  100%;
          height: 100%;
        }
      }
      .struc_c_video {
        .struc_c_d_box {
          background: #E9E7E8;
          height: 100%;
          text-align: center;
          &:hover {
            .play_btn {
              display: block!important;
            }
          }
          .play_btn {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            background: rgba(0, 0, 0, .4);
            width: 1rem;
            height: 1rem;
            text-align: center;
            line-height: 1rem;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            border-radius: 50%;
            cursor: pointer;
            i {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
              height: 22px!important;
            }
          }
          >video {
            width: auto;
            height: 100%;
          }
          &:after {
            content: none!important;
          }
          &:before {
            content: none!important;
          }
          -webkit-box-shadow: 0 0 0!important;
          -moz-box-shadow: 0 0 0!important;
          box-shadow: 0 0 0!important;
        }
        .download_btn {
          text-align: center;
          width: 1.1rem;
          height: .4rem;
          float: right!important;
          margin-top: .2rem;
          background: rgba(246,248,249,1);
          border: 1px solid rgba(211,211,211,1);
          border-radius: 4px;
          line-height: .4rem;
          cursor: pointer;
          color: #666666;
          position: relative;
          &:hover {
            color: #FFFFFF;
            background: #0C70F8;
            border-color: #0C70F8;
          }
          a {
            display: block;
            position: absolute;
            width: 100%;
            height: 100%;
          }
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
            img {
              width: 100%;
              height: 100%;
            }
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
  .vl_jtc_mk {
    width: 218px;
    height: 122px;
    position: relative;
    > img {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    > p {
      width: 100%;
      position: absolute;
      color: #FFFFFF;
      bottom: 8px;
      font-size: 12px;
      padding: 0 6px;
      line-height: 20px;
      > i {
        height: 20px;
        float: right;
        vertical-align: middle;
      }
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
  .map_select {
    /deep/.el-dialog__body,.el-dialog__header {
      padding: 0px;
    }
    .el-dialog__headerbtn {
      z-index: 1;
    }
  }
</style>
