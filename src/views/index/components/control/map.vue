<template>
  <div class="control_map">
    <!-- 侧边栏搜索框 -->
    <div class="search_box">
      <p>选择一个或多个条件进行搜索</p>
      <el-form :model="mapForm" class="map_form" ref="mapForm">
        <el-form-item style="width: 192px;" prop="name">
          <el-input v-model="mapForm.name" placeholder="请输入布控名称"></el-input>
        </el-form-item>
        <el-form-item style="width: 192px;" prop="event">
          <el-select
            v-model="mapForm.event"
            filterable
            remote
            clearable
            value-key="value"
            placeholder="请输入事件编号"
            :remote-method="getEventList"
            :loading="loading">
            <el-option
              v-for="item in eventList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 192px;" prop="obj">
          <el-select
            v-model="mapForm.obj"
            filterable
            remote
            clearable
            value-key="value"
            placeholder="请输入布控对象"
            :remote-method="getControlObject"
            :loading="loading">
            <el-option
              v-for="item in controlObjDropdownList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 192px;" prop="state">
          <el-select v-model="mapForm.state" placeholder="布控状态">
            <el-option
              v-for="item in stateList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 192px;" prop="type">
          <el-select v-model="mapForm.type" placeholder="设备类型">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 192px;" prop="rank">
          <el-select v-model="mapForm.rank" placeholder="告警级别">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="item in rankList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="time" class="time">
          <el-date-picker
            style="width: 192px;"
            v-model="mapForm.time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-button class="reset_btn" type="primary" plain @click="resetForm()">重置</el-button>
          <el-button class="select_btn" type="primary" :loading="loadingBtn" @click="getControlMap">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="map_box">
      <!-- 地图 -->
      <div id="mapBox"></div>
      <!-- 抓拍列表 -->
      <div class="snap_box" v-if="!isShowFullScreen && isShowSnapList && snapTotal > 0">
        <div class="snap_box_one">
          <el-card shadow="hover" class="more">
            <p>今日抓拍</p>
            <div>{{snapTotal}}</div>
            <el-button size="small" @click="sikpISalarmToday">查看更多</el-button>
          </el-card>
        </div>
        <div class="snap_box_two" v-for="item in snapList" :key="item.deviceId">
          <el-card class="pic" shadow="hover">
            <div class="img">
              <img :src="item.snapPhoto" alt="" width="130" height="130">
            </div>
            <ul>
              <li>
                <i class="vl_icon vl_icon_control_26"></i>
                <span>{{item.objName}}</span>
              </li>
              <li>
                <i class="vl_icon vl_icon_control_27"></i>
                <span>{{item.snapTime}}</span>
              </li>
              <li>
                <i class="vl_icon vl_icon_control_05"></i>
                <span>{{item.deviceName}}</span>
              </li>
            </ul>
          </el-card>
        </div>
      </div>
      <!-- 布控进行中页面 -->
      <div class="underway_box" v-if="isShowFullScreen">
        <div class="video_box" :style="{'height': videoHeight + 'px'}">
          <div class="video">
            <div>
              <div is="flvplayer" @playerClose="playerClose" :oData="videoObj" 
                :oConfig="{sign: true}">
              </div>
              <div class="vl_map_state" :class="{'vl_map_state_ab': true}">进行中</div>
            </div>
          </div>
        </div>
        <div class="control_box">
          <div v-if="controlObjList.objectList && controlObjList.objectList.length > 0" class="control_obj_list">
            <el-card class="more" shadow="hover">
              <p>布控对象</p>
              <div>{{controlObjList.objectList.length}}</div>
            </el-card>
           

            <swiper :options="swiperOption" ref="mySwiper" style="width: calc(100% - 176px);" @mouseover.native="isShowSwiperBtn = true;" @mouseleave.native="isShowSwiperBtn = false;" :class="{'is_show_btn': isShowSwiperBtn}">
              <!-- slides -->
              <swiper-slide v-for="item in controlObjList.objectList" :key="item.id">
                <el-card class="pic" shadow="hover" :key="item.name">
                  <img :src="item.photoUrl" alt="" width="130" height="130">
                  <p>{{item.name}}</p>
                </el-card>
              </swiper-slide>
              <div class="swiper-button-prev" slot="button-prev"></div>
              <div class="swiper-button-next" slot="button-next"></div>
            </swiper>

          </div>
          <div class="control_info">
            <div class="control_info_list">
              <div><span>布控名称：</span><span>{{controlObjList.list[0].surveillanceName}}</span></div>
              <div v-if="controlObjList.list[0].surveillanceType === 1"><span>布控日期：</span><span>{{controlObjList.list[0].surveillanceDateStart}}至{{controlObjList.list[0].surveillanceDateEnd}}</span></div>
              <div v-if="controlObjList.list[0].eventDetail"><span>事件预览：</span><span>{{controlObjList.list[0].eventDetail}}</span></div>
            </div>
            <el-button type="primary" size="small" @click="skipIsVideo(videoObj.video.uid, videoObj.video.deviceName)">视频回放</el-button>
          </div>
        </div>
      </div>
    </div>
    <div is="controlVideo" v-if="isShowVideo" :class="{'is_show_video': isShowV}" style="display: none;" id="controlVideo" @showScreen="showScreen" @playerClose="playerClose" :oData="videoObj" 
      :oConfig="{sign: true}">
    </div>
  </div>
</template>
<script>
import controlVideo from './components/controlVideo.vue';
import flvplayer from '@/components/common/flvplayer.vue';
import {random14} from '@/utils/util.js';
import {getControlObject, getControlMap, getControlMapByDevice, getAlarmListByDev, getAllAlarmSnapListByDev} from '@/views/index/api/api.control.js';
import {getDiciData} from '@/views/index/api/api.js';
import {getEventList} from '@/views/index/api/api.event.js';
export default {
  components: {flvplayer, controlVideo},
  data () {
    return {
      swiperOption: {
        slidesPerView: null,
        spaceBetween: 10,
        slidesPerGroup: 1,
        loop: false,
        slideToClickedSlide: true,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      isShowSwiperBtn: false,
      loading: false,
      loadingBtn: false,
      // 左侧搜索参数
      mapForm: {
        name: null,
        event: null,
        obj: null,
        state: 1,
        type: null,
        rank: null,
        time: null
      },
      eventList: [],
      controlObjDropdownList: [],
      stateList: [
        {label: '待开始', value: 2},
        {label: '进行中', value: 1},
        {label: '已结束', value: 3}
      ],
      typeList: [
        {label: '全部', value: null},
        {label: '枪机', value: 1},
        {label: '球机', value: 2},
        {label: '半球机', value: 3},
        {label: '红外', value: 4}
      ],
      rankList: [],
      // 地图参数
      map: null,
      devicesList: null, // 布控数据列表
      markerAlarmList: [],//告警列表
      timer: null,
      videoObj: null,
      isShowVideo: false,
      isShowV: false,
      clickWindow: null,
      markerList: [],
      // 抓拍列表参数
      isShowSnapList: true,
      snapList: [],
      snapTotal: null,//抓拍总数
      // 布控对象列表参数
      controlObjList: [],
      isShowFullScreen: false, // 是否显示全屏播放页面
      videoHeight: null,
      scrollWidth: null
    }
  },
  created () {
    this.getDiciData();
  },
  mounted () {
    this.getControlMap();
    let map = new window.AMap.Map('mapBox', {
      zoom: 12, // 级别
      center: [112.980377, 28.100175], // 中心点坐标112.980377,28.100175
      // viewMode: '3D' // 使用3D视图
    });
    map.setMapStyle('amap://styles/whitesmoke');
    this.map = map;
    this.videoHeight = document.body.clientHeight - 336;
    this.scrollWidth = window.screen.width;
    console.log(this.scrollWidth)
    if (this.scrollWidth <= 1440) {
      this.swiperOption.slidesPerView = 2;
    } else {
      this.swiperOption.slidesPerView = 5;
    }
  },
  methods: {
    // 获取关联事件列表
    getEventList (query) {
      const params = {
        'where.keyword': query,
        pageSize: 1000000
      }
      getEventList(params).then(res => {
        if (res && res.data) {
          this.eventList = res.data.list.map(m => {
            return {
              label: m.eventCode,
              value: m.uid
            }
          });
        }
      })
    },
    // 获取所有布控对象
    getControlObject (query) {
      const params = {
        name: query
      }
      getControlObject(params).then(res => {
        if (res && res.data) {
          this.controlObjDropdownList = res.data.map(m => {
            return {
              value: m.uid,
              label: m.name
            }
          });
        }
      })
    },
    sikpISalarmToday () {
      this.$router.push({ name: 'today_alarm' });
    },
    // 显示大屏
    showScreen () {
      if (this.clickWindow) {
        $('.control_map').append($('#controlVideo'));
        this.isShowVideo = false;
        this.isShowV = false; 
        this.clickWindow.close();
        this.isShowFullScreen = true;
      }
    },
    // 关闭播放器
    playerClose (index, sid) {
      console.log('sid', sid);
      this.isShowFullScreen = false;
    },
    // 获得设备报警列表
    getAlarmListByDev () {
      const params = {
        deviceIds: this.devicesList.map(m => m.uid).join(','),
        surveillanceIds: this.devicesList.map(m => m.surveillanceIds).join(',')
      }
      getAlarmListByDev(params).then(res => {
        if (res && res.data) {
          this.markerAlarmList = res.data;
          this.markerAlarmList.forEach(dev => {
            const timeDifference = res.timestamp - new Date(dev.snapTime).getTime();
            if (timeDifference > 10000 || timeDifference <= 0) return;// 抓拍时间与请求时间之差在10s之内的数据才闪烁
            const childDiv = '<div class="vl_icon_warning">发现可疑目标</div>';
            // 给有警情的点标记追加class
            this.$nextTick(() => {
              $('#mapBox #' + dev.deviceId).append(childDiv);
              $('#mapBox #' + dev.deviceId).addClass("vl_icon_alarm");
              $('#mapBox #' + dev.deviceId).addClass("vl_icon_control_02");
              $('#mapBox #' + dev.deviceId).removeClass("vl_icon_control_01");
            })
            // 让有警情的点标记的class 10s后移除
            setTimeout(() => {
              $('#mapBox .vl_icon_control_02').removeClass("vl_icon_alarm");
              $('#mapBox .vl_icon_warning').remove();
              $('#mapBox #' + dev.deviceId).removeClass("vl_icon_control_02");
              $('#mapBox #' + dev.deviceId).addClass("vl_icon_control_01");
            }, 10000);
          })
        }
      })
    },
    // 获取告警级别字段
    getDiciData () {
      getDiciData(11).then(res => {
        if (res && res.data) {
          this.rankList = res.data.map(m => {
            return {
              value: parseInt(m.enumField),
              label: m.enumValue
            }
          })
        }
      })
    },
    // 获取实时监控的布控设备
    getControlMap () {
      if (this.mapForm.state !== 1) {
        this.isShowSnapList = false;
      } else {
        this.isShowSnapList = true;
      }
      const params = {
        deviceType: this.mapForm.type,//设备类型
        surveillanceStatus: this.mapForm.state,//布控状态
        alarmLevel: this.mapForm.rank,//告警级别
        surveillanceDateStart: this.mapForm.time && this.mapForm.time[0],//布控开始时间
        surveillanceDateEnd: this.mapForm.time && this.mapForm.time[1],//布控结束时间
        surveillanceName: this.mapForm.name,//布控名称
        eventId: this.mapForm.event,//事件Id
        surveillanceObjectId: this.mapForm.obj//布控对象id
      }
      this.loadingBtn = true;
      getControlMap(params).then(res => {
        if (res && res.data) {
          if (res.data.length === 0) {
            this.devicesList = [];
            if (this.map) {
              this.map.remove(this.markerList);
            }
            this.$message.error('无设备匹配');
            return;
          }
          let data = [];
          res.data.forEach(f => {
            f.devList.forEach(d => {
              data.push(d);
            })
          })
          this.devicesList = data;
        }
      }).then(() => {
        // 没有获取到布控设备时，清除之前保存的定时器，并return
        if (this.devicesList.length === 0) {
          clearInterval(this.timer);
          return;
        }
        this.mapMark();
        this.getAllAlarmSnapListByDev();
      }).finally(() => {
        this.loadingBtn = false;
      })
    },
    // 获取设备下布控列表
    getControlMapByDevice (obj) {
      console.log(obj, 'obj')
      const params = {
        deviceName: obj.deviceName,
        uid: obj.uid,
        surveillanceIds: obj.surveillanceIds,
        surveillanceStatus: obj.surveillanceStatus
      }
      getControlMapByDevice(params).then(res => {
        if (res && res.data) {
          let _this = this;
          _this.controlObjList = res.data;
          // this.swiperOption.slidesPerView = this.controlObjList.objectList.length;
          let sContent = '', clickWindow = null, vlMapVideo = '', vlMapObj = '', vlMapObjList = '', domId = obj.uid + '_' + random14();
          if (obj.surveillanceStatus === 1) {
            vlMapVideo = `
              <div class="vl_map_close vl_icon vl_icon_control_04"></div>
              <div class="vl_map_click_main">
              <div class="vl_map_img">
                <div id="${domId}" style="width: 300px;height: 150px;background: #000;"></div>
                <div class="vl_map_state">进行中</div>
               
              </div>`;
          }
          if (_this.controlObjList.num === 1) {
            vlMapObj = `
              <div class="vl_map_info">
                <div class="vl_map_name" id="${_this.controlObjList.list[0].uid}"><span>布控名称：</span><span title="${_this.controlObjList.list[0].surveillanceName}">${_this.controlObjList.list[0].surveillanceName}</span></div>`;
              if (_this.controlObjList.list[0].surveillanceType === 1) {
                vlMapObj += `<div><span>布控日期：</span><span>${_this.controlObjList.list[0].surveillanceDateStart}至${_this.controlObjList.list[0].surveillanceDateEnd}</span></div>`;
              }
              if (_this.controlObjList.list[0].eventDetail) {
                vlMapObj += `<div><span>事件预览：</span><span>${_this.controlObjList.list[0].eventDetail}</span></div>`;
              }
              if (obj.surveillanceStatus === 3) {
                vlMapObj += `<div><span>布控结果：</span><span>${_this.controlObjList.list[0].snapNum}张抓拍图片</span></div>`;
              }
              vlMapObj += `
              </div>
              <div class="vl_map_obj">
                <div class="vl_map_obj_num">
                  <div><span>布控对象：</span><span>${_this.controlObjList.objectList.length}</span></div>
                  <div class="vl_map_slide">
                    <i class="el-icon-arrow-left"></i>
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
                <div class="vl_map_obj_img">
                  <div class="vl_map_obj_box">`;
                  for (let item of _this.controlObjList.objectList) {
                    vlMapObj += `<div><img src="${item.photoUrl}">`;
                    if (item.name) {
                      vlMapObj += `<p title="${item.name}">${item.name}</p>`;
                    }
                    vlMapObj += `</div>`;
                  }
                  vlMapObj += `</div>
                </div>
              </div>`;
          }
          if (_this.controlObjList.num > 1) {
            for (let item of _this.controlObjList.list) {
              vlMapObjList += 
              `<div class="vl_map_info">
                <div class="vl_map_name" id="${item.uid}"><span>布控名称：</span><span title="${item.surveillanceName}">${item.surveillanceName}</span></div>`;
                if (item.surveillanceType === 1) {
                  vlMapObjList += `<div><span>布控日期：</span><span>${item.surveillanceDateStart}至${item.surveillanceDateEnd}</span></div>`;
                }
                if (item.eventDetail) {
                  vlMapObjList += `<div><span>事件预览：</span><span>${item.eventDetail}</span></div>`;
                }
                if (obj.surveillanceStatus === 3) {
                  vlMapObjList += `<div><span>布控结果：</span><span>${item.snapNum}张抓拍图片</span></div>`;
                }
              vlMapObjList += `</div>`;
            }
          }

          // 布控进行中
          if (obj.surveillanceStatus === 1) {
            // 一个摄像头只有一个布控时
            if (_this.controlObjList.num === 1) {
              sContent = `
                <div class="vl_map_click">`;
                  sContent += vlMapVideo;
                  sContent += vlMapObj;
                  sContent += `<div class="vl_map_btn">视频回放</div>
                  </div>
                  <div class="vl_map_triangle"></div>
                </div>
                `;
            // 一个摄像头有多个布控时
            } else if (_this.controlObjList.num > 1) {
              sContent = 
                `<div class="vl_map_click">`;
                  sContent += vlMapVideo;
                  sContent += vlMapObjList;
                sContent +=  `</div>
                  <div class="vl_map_triangle"></div>
                </div>`;
            }
          }
          // 布控待开始
          if (obj.surveillanceStatus === 2) {
            // 一个摄像头只有一个布控时
            if (_this.controlObjList.num === 1) {
              sContent = `
                <div class="vl_map_click">
                  <div class="vl_map_close vl_icon vl_icon_control_04"></div>
                  <div class="vl_map_click_main">
                    <div class="vl_map_start">
                      <div class="vl_map_state">待开始</div>
                      <span>${obj.deviceName}</span>
                    </div>`;
                  sContent += vlMapObj;
                  sContent += `</div>
                  <div class="vl_map_triangle"></div>
                </div>
                `;
            // 一个摄像头有多个布控时
            } else if (_this.controlObjList.num > 1) {
              sContent = 
                `<div class="vl_map_click">
                  <div class="vl_map_close vl_icon vl_icon_control_04"></div>
                  <div class="vl_map_click_main">
                    <div class="vl_map_start">
                      <div class="vl_map_state">待开始</div>
                      <span>${obj.deviceName}</span>
                    </div>`;
                sContent += vlMapObjList;
                sContent += `</div>
                  <div class="vl_map_triangle"></div>
                </div>`;
            }
          }
          // 布控已结束
          if (obj.surveillanceStatus === 3) {
            // 一个摄像头只有一个布控时
            if (_this.controlObjList.num === 1) {
              sContent = `
                <div class="vl_map_click">
                  <div class="vl_map_close vl_icon vl_icon_control_04"></div>
                  <div class="vl_map_click_main">
                    <div class="vl_map_start">
                      <div class="vl_map_state" style="background: #999999;">已结束</div>
                      <span>${obj.deviceName}</span>
                    </div>`;
                   sContent += vlMapObj;
                  sContent += `</div>
                  <div class="vl_map_triangle"></div>
                </div>
                `;
            // 一个摄像头有多个布控时
            } else if (_this.controlObjList.num > 1) {
              sContent = 
                `<div class="vl_map_click">
                  <div class="vl_map_close vl_icon vl_icon_control_04"></div>
                  <div class="vl_map_click_main">
                    <div class="vl_map_start">
                      <div class="vl_map_state" style="background: #999999;">已结束</div>
                      <span>${obj.deviceName}</span>
                    </div>`;
                sContent += vlMapObjList;
                sContent += `</div>
                  <div class="vl_map_triangle"></div>
                </div>`;
            }
          }
          clickWindow = new window.AMap.InfoWindow({
            isCustom: true,
            closeWhenClickMap: false,
            offset: new window.AMap.Pixel(-2, -60), // 相对于基点的偏移位置
            content: sContent
          });
          // 打开弹窗
          clickWindow.open(_this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
          // 防止重复绑定点击事件，先解绑
          $("#mapBox").unbind('click');
          // 利用事件冒泡,绑定关闭弹框的点击事件
          $('#mapBox').on('click', '.vl_map_close', function () {
            // 关闭弹窗
            if (clickWindow) {$('.control_map').append($('#controlVideo'));_this.isShowVideo = false; _this.isShowV = false; clickWindow.close(); }
          })
          this.clickWindow = clickWindow;
          // 跳转至布控详情页
          $('#mapBox').on('click', '.vl_map_name', function (e) {
            console.log(e)
            const { href } = _this.$router.resolve({
              name: 'control_manage',
              query: {pageType: 2, state: obj.surveillanceStatus, controlId: e.currentTarget.id }
            })
            window.open(href, '_blank', 'toolbar=no,location=no,width=1300,height=900')
          })
          // 跳转至视频回放页面
          $('#mapBox').on('click', '.vl_map_btn', function () {
            _this.skipIsVideo(obj.uid, obj.deviceName);
          })
          // 向右滑动
          let offbtnStatusLfet = false;
          $('#mapBox').on('click', '.vl_map_slide > .el-icon-arrow-right', function () {
            if(offbtnStatusLfet){
              return;
            }
            offbtnStatusLfet = true;
            const slide = $('#mapBox .vl_map_obj_box');
            const slideMarginLeft = parseInt(slide.css('margin-left').slice(0, -2));
            if ((slide.width() + slideMarginLeft) >= 380) {
              slide.animate({marginLeft: '-=80px'}, 300, function () {
                offbtnStatusLfet = false;
              });
            } else {
              setTimeout(() => {
                offbtnStatusLfet = false;
              }, 1000)
            }
          })
          // 向左滑动
          let offbtnStatusRight = false;
          $('#mapBox').on('click', '.vl_map_slide > .el-icon-arrow-left', function () {
            if(offbtnStatusRight){
              return;
            }
            offbtnStatusRight = true;
            const slide = $('#mapBox .vl_map_obj_box');
            const slideMarginLeft = parseInt(slide.css('margin-left').slice(0, -2));
            if (slideMarginLeft < 0) {
              slide.animate({marginLeft: '+=80px'}, 300,function () {
                offbtnStatusRight = false;
              });
            } else {
              setTimeout(() => {
                offbtnStatusRight = false;
              }, 1000)
            }
          })
          if (obj.surveillanceStatus === 1) {
            // let deviceSip = Math.random() > 0.5 ? 'rtmp://live.hkstv.hk.lxdns.com/live/hks1' : 'rtmp://10.16.1.139/live/livestream';
            // let deviceSip = 'rtmp://live.hkstv.hk.lxdns.com/live/hks1';
            // obj.title = obj.deviceName;
            // obj.video = {
            //   deviceSip: deviceSip
            // }
            _this.videoObj = {
              type: 1,
              title: obj.deviceName,
              video: Object.assign({}, obj)
            };
            console.log(_this.videoObj, '_this.videoObj')
            _this.isShowVideo = true;
            setTimeout(() => {
              $('#' + domId).append($('#controlVideo'));
              _this.isShowV = true;
            }, 100)
            console.log($('#controlVideo'))
          }
        }
      })
    },
    // 获取布控抓拍结果列表
    getAllAlarmSnapListByDev () {
      const params = {
        pageSize: 10,
        pageNum: 1,
        'where.deviceIds': this.devicesList.map(m => m.uid).join(','),
        'where.surveillanceIds': this.devicesList.map(m => m.surveillanceIds).join(',')
      }
      getAllAlarmSnapListByDev(params).then(res => {
        if (res && res.data) {
          this.snapList = res.data.list;
          this.snapTotal = res.data.total;
        }
      })
    },
    // 地图标记
    mapMark () {
      let _this = this;
      let data = _this.devicesList;
      if (_this.map) {
        _this.map.clearMap();
      }
      // new Promise((resolve) => { 
        for (let i = 0; i < data.length; i++) {
          let obj = data[i];
          let content = '';
          content = '<div id="' + obj.uid + '" class="vl_icon vl_icon_control_01"></div>';
          if (obj.longitude > 0 && obj.latitude > 0) {
            let offSet = [-20.5, -48];
            let marker = new window.AMap.Marker({ // 添加自定义点标记
              map: _this.map,
              position: [obj.longitude, obj.latitude],
              offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: obj,
              // 自定义点标记覆盖物内容
              content: content
            });
            // 点标记点击事件
            marker.on('click', function(e) {
              // 点击切换告警闪烁图标
              if (_this.markerAlarmList.some(s => s.deviceId === e.target.C.extData.uid)) {
                if (!$('#' + e.target.C.extData.uid).hasClass('vl_icon_control_02')) {
                  $('#mapBox .vl_icon_control_03').addClass("vl_icon_control_01");
                  $('#mapBox .vl_icon_control_03').removeClass(" vl_icon_control_03");
                  $('#' + e.target.C.extData.uid).addClass("vl_icon_control_03");
                } else {
                  $('#' + e.target.C.extData.uid).removeClass("vl_icon_alarm");
                  $('#' + e.target.C.extData.uid + '> .vl_icon_warning').remove();
                  $('#' + e.target.C.extData.uid).removeClass("vl_icon_control_02");
                  $('#' + e.target.C.extData.uid).addClass("vl_icon_control_03");
                  $(`#mapBox .vl_icon_control_03:not(#${e.target.C.extData.uid})`).addClass("vl_icon_control_01");
                  $(`#mapBox .vl_icon_control_03:not(#${e.target.C.extData.uid})`).removeClass("vl_icon_control_03");
                }
              } else {
                // 点击切换普通点标记图标
                $('#mapBox .vl_icon_control_03').addClass("vl_icon_control_01");
                $('#mapBox .vl_icon_control_03').removeClass("vl_icon_control_03");
                $('#' + e.target.C.extData.uid).addClass("vl_icon_control_03");
                $('#' + e.target.C.extData.uid).removeClass("vl_icon_control_01");
              }
              _this.getControlMapByDevice(e.target.C.extData);
            })
            marker.setMap(_this.map);
            _this.markerList.push(marker);
          }
        }
        // resolve();
      // }).then(() => {
        // _this.map.setFitView();// 自动适配到合适视野范围

        // 当布控状态不是进行中时，清除之前保存的定时器，并return
        clearInterval(_this.timer);
        if (this.mapForm.state !== 1) {
          return;
        }
        _this.getAlarmListByDev();
        // 12s重新加载一次
        _this.timer = setInterval(() => {
          _this.getAlarmListByDev();
        }, 12000);
        // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
        _this.$once('hook:beforeDestroy', () => {
          clearInterval(_this.timer);
        })
      // })
    },
    // 跳转至视频回放页面
    skipIsVideo (uid, deviceName) {
      const { href } = this.$router.resolve({
        name: 'video_playback',
        query: {uid, deviceName}
      })
      window.open(href, '_blank', 'toolbar=no,location=no,width=1300,height=900')
    },
    // 重置表单
    resetForm () {
      this.$refs['mapForm'].resetFields();
    }
  },
  // destroyed () {
  //   if (this.map) {
  //     console.log(this.map, '1111')
  //     this.map.destroy( );
  //     console.log(this.map, '2222')
  //   }
  // }
}
</script>
<style lang="scss" scoped>
  .control_map{
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    .search_box{
      position: absolute;
      left: 20px;
      top: 0;
      z-index: 99;
      height: 100%;
      width: 232px;
      background: #fff;
      box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
      animation: fadeInLeft .4s ease-out .3s both;
      p{
        line-height: 60px;
        text-align: center;
        color: #999;
        border-bottom: 1px solid #d3d3d3;
      }
      .map_form{
        padding: 20px;
        .reset_btn, .select_btn{
          width: 90px;
        }
      }
    }
    .map_box{
      height: 100%;
      width: calc(100% - 252px);
      margin-left: 252px;
      position: relative;
      #mapBox{
        height: 100%;
        width: 100%;
      }
      .snap_box{
        height: 245px;
        overflow: hidden;
        position: absolute;
        bottom: 20px;
        left: 0;
        display: flex;
        flex-wrap: wrap;
        .snap_box_one{
          width: 166px;
          height: 265px;
          padding: 0 0.5% 20px 1%;
          .more.el-card{
            width: 100%;
            height: 100%;
            text-align: center;
            padding: 78px 0 87px 0;
            box-shadow:0px -4px 10px 0px rgba(131,131,131,0.28);
            p{
              line-height: 24px;
            }
            div{
              font-size: 24px;
              line-height: 24px;
              margin-bottom: 5px;
              color: #0769E7;
            }
            .el-button{
              width: 90px;
              height: 30px;
            }
          }
        }
        .snap_box_two{
          width: 176px;
          height: 265px;
          padding: 0 0.5% 20px 0.5%;
          .pic.el-card{
            width: 100%;
            height: 100%;
            padding: 15px 0;
            box-shadow:0px -4px 10px 0px rgba(131,131,131,0.28);
            ul{
              padding: 16px 0 0 16px;
              li i{
                vertical-align: middle;
                margin-bottom: 2px;
              }
              li:nth-child(1) span{
                color: #333333;
              }
              li:not(:nth-child(1)) span{
                color: #999999;
                font-size: 12px;
              }
            } 
            .img{
              width: 100%;
              text-align: center;
            }          
          }          
        }
      }
      .underway_box{
        width: 100%;
        height: 100%;
        padding: 18px;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 99;
        .video_box{
          width: 100%;
          // height: 602px;
          padding: 20px 80px;
          background:rgba(0,0,0,0.67);
          box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
          border-radius:3px;
          .video{
            width: 100%;
            height: 100%;
            > div{
              width: 100%;
              height: 100%;
              position: relative;
              background: #000;
              .vl_map_state{
                left: 0;
                top: 0;
                z-index: 9999;
                padding: 0 6px;
                border-radius: 0 10px 10px 0;
                line-height: 20px;
                margin-right: 10px;
                text-align: center;
                background: #0567E2;
                color: #fff;
                font-size: 12px;
              }
              .vl_map_state_ab{
                position: absolute;
              }
              .vl_map_state_fi{
                position: fixed;
              }
            }
          }
        }
        .control_box{
          width: 100%;
          height: 200px;
          overflow: hidden;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          .control_obj_list{
            width: calc(100% - 344px);
            height: 200px;
            padding-right: 20px;
            overflow: hidden;
            display: flex;
            flex-wrap: wrap;
            .el-card{
              height: 182px;
              margin-top: 18px;
              text-align: center;
              box-shadow:0px -4px 10px 0px rgba(131,131,131,0.28);
            }
            .more.el-card{
              width: 152px;
              padding: 40px 0;
              margin-right: 1%;
              p{
                line-height: 24px;
                margin-bottom: 10px;
              }
              div{
                font-size: 24px;
                line-height: 24px;
                color: #0769E7;
              }
              .el-button{
                width: 90px;
                height: 30px;
              }
            }
            .pic.el-card{
              width: 100%;
              padding-top: 10px;
              margin-right: 1%;
              p{
                line-height: 30px;
                color: #333;
              }
            }
          }
          .control_info{
            width: 344px;
            height: 180px;
            padding: 10px;
            margin-top: 19px;
            background: #fff;
            .control_info_list{
              padding: 10px 0;
              height: 110px;
              overflow: hidden;
              & > div:nth-child(1){
                font-size: 16px;
                color: #333;
                line-height:24px;
              }
              & > div:not(:nth-child(1)){
                font-size: 12px;
                color: #999999;
                line-height:22px;
              }
              & > div:nth-child(3){
                display: flex;
                flex-wrap: nowrap;
                > span:nth-child(2){
                  flex: 1;
                }
              }
            }
          }
        }
      }
    }
    .is_show_video{
      display: block !important;
    }
  }
</style>
<style lang="scss">
.control_map{
  .map_form{
    .el-form-item{
      margin-bottom: 10px!important;
    }
    .time input{
      width: 70px;
      font-size: 12px;
    }
  }
  .map_box{
    .el-card__body{
      padding: 0!important;
    }
    .swiper-container{
      .swiper-button-next, .swiper-button-prev{
        display: none;
      }
    }
    .swiper-container.is_show_btn{
      .swiper-button-next, .swiper-button-prev{
        display: block;
      }
    }
  }
  #mapBox{
    .vl_map_click{
      width: 340px;
      position: relative;
      background: #fff;
      .vl_map_close{
        position: absolute;
        right: -12px;
        top: -12px;
        cursor: pointer;
      }
      .vl_map_click_main{
        padding: 20px;
        .vl_map_img{
          position: relative;
          .vl_map_state{
            position: absolute;
            left: 0;
            top: 0;
            padding: 0 6px;
            border-radius: 0 10px 10px 0;
            line-height: 20px;
            text-align: center;
            background: #0567E2;
            color: #fff;
            font-size: 12px;
          }
          // > i{
          //   position: absolute;
          //   right: 15px;bottom: -22px;
          //   cursor: pointer;
          //   transition: bottom 0.4s ease-out!important;
          // }
          // > i.show_operate_screen{
          //   bottom: 15px!important;
          // }
        }
        .vl_map_operate{
          width: 100%;
          height: 30px;
          position: absolute;
          left: 0;
          bottom: 0;
          padding: 0 10px;
          line-height: 30px;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          background: #000000;
          & > div{
            color: #fff;
            i{
              display: inline-block;
              margin-top: 3px;
              cursor: pointer;
            }
            i:not(:last-child){
              margin-right: 10px;
            }
          }
        }
        .vl_map_info{
          padding: 10px 0;
          &:not(:last-child){
            border-bottom: 1px solid #F2F2F2;
          }
          & > div:nth-child(1){
            font-size: 16px;
            color: #0567E1;
            line-height:24px;
            cursor: pointer;
          }
          & > div:not(:nth-child(1)){
            font-size: 12px;
            color: #999999;
            line-height:22px;
          }
          & > div:nth-child(3){
            display: flex;
            flex-wrap: nowrap;
            > span:nth-child(2){
              flex: 1;
            }
          }
          .vl_map_name{
            width: 60%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis; 
          }
        }
        .vl_map_obj{
          .vl_map_obj_num{
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            line-height: 40px;
            font-size: 12px;
            > div:nth-child(1){
              > span:nth-child(1){
                color: #999999;
              }
              > span:nth-child(2){
                color: #666666;
              }
            }
            .vl_map_slide{
              > i{
                padding: 4px;
                border: 1px solid #E2E2E2;
                border-radius: 4px;
                background: #fff;
                color: #0567E1;
                cursor: pointer;
                &:hover, &.active{
                  color: #fff;
                  border-radius: 4px;
                  background: #0769E7;
                }
              }
            }
          }
          .vl_map_obj_img{
            width: 300px;
            height: 90px;
            overflow: hidden;
            position: relative;
            .vl_map_obj_box{
              display: flex;
              flex-wrap: nowrap;
              position: absolute;
              left: 0;
              top: 0;
              & > div{
                text-align: center;
                &:not(:last-child){
                  margin-right: 20px;
                }
                >img{
                  width: 60px;
                  height: 60px;
                }
                > p{
                  width: 60px;
                  line-height: 30px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                > p:hover{
                  // cursor: pointer;
                  // color: #0567E1;
                }
              }
            }
          }
        }
        .vl_map_btn{
          width: 80px;
          height: 30px;
          background: #3a8ee6;
          border-radius: 5px;
          margin-top: 10px;
          line-height: 30px;
          text-align: center;
          color: #fff;
          cursor: pointer;
        }
        .vl_map_btn:hover{
          background: #66b1ff;
        }
        .vl_map_start{
          display: flex;
          .vl_map_state{
            padding: 0 6px;
            border-radius: 0 10px 10px 0;
            line-height: 20px;
            margin-right: 10px;
            text-align: center;
            background: #50CC62;
            color: #fff;
            font-size: 12px;
          }
          > span{
            margin-top: 2px;
            color: #999999;
          }
        }
      }
      .vl_map_triangle{
        border: 15px solid transparent;
        border-top-color: #fff;
        position: absolute;
        left: 50%;
        margin-left: -10px;
        bottom: -26px;
      }
    }
    .vl_icon{
      transition: none !important;
      position: relative;
      .vl_icon_warning{
        width: 115px;
        padding: 5px 0;
        border-radius: 15px;
        position: absolute;
        bottom: -6px;
        left: 40px;
        box-shadow:0px 8px 9px 0px rgba(39,40,40,0.2);
        text-align: center;
        background: #FA453A;
        color: #fff;
      }
    }
    .vl_icon_alarm{
      animation: twinkle 1s linear infinite both;
    }
  }
}
</style>
