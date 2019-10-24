<template>
  <div class="control_map">
    <!-- 侧边栏搜索框 -->
    <div class="search_box" :style="{'width': hideleft ? '232px' : '0'}">
      <p>选择一个或多个条件进行搜索</p>
      <el-form :model="mapForm" class="map_form" ref="mapForm">
        <el-form-item style="width: 192px;" prop="state">
          <el-select v-model="mapForm.state" placeholder="布控状态" @change="changeControlState(null)">
            <el-option
              v-for="item in stateList"
              :key="item.value"
              :label="item.label" 
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 192px;" prop="name">
          <el-select v-model="mapForm.name" filterable placeholder="请输入布控名称">
            <el-option
              v-for="item in controlNameList"
              :key="item.value"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 192px;" prop="event">
          <el-select v-model="mapForm.event" filterable placeholder="请输入事件编号">
            <el-option
              v-for="item in eventList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 192px;" prop="obj">
          <el-select v-model="mapForm.obj" value-key="uid" filterable placeholder="请输入布控对象">
            <el-option
              v-for="item in controlObjDropdownList"
              :key="item.uid"
              :label="item.name"
              :value="item">  
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
        <el-form-item style="width: 192px;" prop="alarmId">
          <el-select v-model="mapForm.alarmId" multiple collapse-tags placeholder="告警级别">
            <el-option
              v-for="item in alarmLevelList"
              :key="item.enumField"
              :label="item.enumValue"
              :value="item.enumField">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="startTime" class="time">
          <el-date-picker
            style="width: 192px;"
            :clearable="false"
            :picker-options="pickerOptions"
            v-model="mapForm.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
            class="vl_date">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="endTime" class="time">
          <el-date-picker
            style="width: 192px;"
            :clearable="false"
            :picker-options="pickerOptions1"
            v-model="mapForm.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
            class="vl_date vl_date_end">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-button class="btn_90" @click="resetForm()">重置</el-button>
          <el-button class="btn_90" type="primary" :loading="loadingBtn" @click="getControlMap">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="insetLeft vl_icon vl_icon_map_shrinkage_01" @click="hideLeft" v-show="hideleft"></div>
    <div class="insetLeft vl_icon vl_icon_map_shrinkage_02" @click="hideLeft" v-show="!hideleft"></div>
    <div class="map_box" :style="{'width': hideleft ? 'calc(100% - 252px)' : '100%', 'margin-left': hideleft ? '252px' : '0'}">
      <!-- 地图 -->
      <div id="mapBox"></div>
      <!-- 抓拍列表 -->
      <div class="snap_box" v-if="!isShowFullScreen && isShowSnapList && snapTotal > 0">
        <div class="snap_box_one">
          <el-card shadow="hover" class="more">
            <div>{{snapTotal}}</div>
            <p>今日抓拍</p>
            <el-button size="small" @click="sikpISalarmToday">查看更多</el-button>
          </el-card>
        </div>
        <div class="snap_box_two" v-for="item in snapList" :key="item.deviceId">
          <el-card class="pic" shadow="hover" @click.native="skipIsalarmDel(item)">
            <div class="obj_name">疑似目标：{{item.objName}}</div>
            <div class="img">
              <img :src="item.snapPhoto" alt="" width="130" height="130">
            </div>
            <ul>
              <!-- <li>
                <i class="vl_icon vl_icon_control_26"></i>
                <span>{{item.objName}}</span>
              </li> -->
              <li>
                <i class="vl_icon vl_icon_control_27"></i>
                <span>{{item.snapTime}}</span>
              </li>
              <li>
                <i class="vl_icon vl_icon_control_05"></i>
                <span :title="item.deviceName">{{item.deviceName | strCutWithLen(20)}}</span>
              </li>
            </ul>
          </el-card>
        </div>
      </div>
      <!-- 布控进行中页面 -->
      <div class="underway_box" v-if="isShowFullScreen">
        <div class="video_box" :style="{'height': controlObjList.objectList && controlObjList.objectList.length ? '75%' : '100%'}">
          <div class="video">
            <div>
              <div is="flvplayer" @playerClose="playerClose" :oData="videoObj" 
                :oConfig="{sign: true}">
              </div>
              <div class="vl_map_state" :class="{'vl_map_state_ab': true}">进行中</div>
            </div>
          </div>
        </div>
        <div class="control_box" v-if="controlObjList.objectList && controlObjList.objectList.length > 0" @mouseover="isShowSwiperBtn = true;" @mouseleave="isShowSwiperBtn = false;">
            <el-card class="more" shadow="hover">
              <p>布控对象</p>
              <div>{{controlObjList.objectList.length}}</div>
            </el-card>
           

            <swiper :options="swiperOption" ref="mySwiper" style="width: 89%;" :class="{'is_show_btn': isShowSwiperBtn}">
              <!-- slides -->
              <swiper-slide v-for="item in controlObjList.objectList" :key="item.id">
                <el-card class="pic" shadow="hover" :key="item.name">
                  <img :src="item.photoUrl" alt="" width="90%" height="55%">
                  <p>{{item.name}}</p>
                </el-card>
              </swiper-slide>
              <div class="swiper-button-prev" slot="button-prev"><i class="vl_icon vl_icon_control_38"></i></div>
              <div class="swiper-button-next" slot="button-next"><i class="vl_icon vl_icon_control_39"></i></div>
            </swiper>

        </div>
      </div>
    </div>
    <div is="flvplayer" v-if="isShowVideo" :class="{'is_show_video': isShowV}" style="display: none;" id="controlVideo" @playerFullScreenTwo="showScreen" :oData="videoObj" :bResize="bResize"
      :oConfig="{sign: true, fullscreen: false, fullscreen2: true }">
    </div>
    <el-dialog
      class="create_control_dialog"
      :visible.sync="isShowCreateControlDialog"
      :close-on-click-modal="false"
      width="530px">
      <div class="create_control">
        <img src="../../../../assets/img/video/vi_101.png" alt="">
        <p>没有进行中的布控</p>
        <el-button @click="skipIsCreateControl" class="btn_100">新建布控</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import flvplayer from '@/components/common/flvplayer.vue';
import {random14, unique, addCluster} from '@/utils/util.js';
import {getControlNameBySelect, getControlEventBySelect, getControlObjBySelect, getControlMap, getControlMapByDevice, getAlarmListByDev, getAllAlarmSnapListByDev} from '@/views/index/api/api.control.js';
import {dataList} from '@/utils/data.js';
import {mapXupuxian} from '@/config/config.js';
import { Promise } from 'q';
export default {
  components: {flvplayer},
  data () {
    return {
      hideleft: false,
      swiperOption: {
        slidesPerView: 8,
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
      isShowCreateControlDialog: false,
      // 左侧搜索参数
      mapForm: {
        name: null,
        event: null,
        obj: {
          objId: null,
          objType: null,
          name: null
        },
        state: 1,
        type: null,
        alarmId: [],
        startTime: null,
        endTime: null
      },
      pickerOptions: {
        disabledDate: time => {
          if (this.mapForm.endTime) {
            return (
              time.getTime() > new Date(this.mapForm.endTime).getTime() ||
              time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90
            );
          } else {
            return (
              time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90 ||
              time.getTime() > new Date().getTime()
            );
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          if (this.mapForm.startTime) {
            return (
              time.getTime() < new Date(this.mapForm.startTime).getTime() ||
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
      controlNameList: [],
      eventList: [],
      controlObjDropdownList: [],
      stateList: [
        {label: '进行中', value: 1},
        {label: '待开始', value: 2},
        {label: '已结束', value: 3}
      ],
      typeList: [
        {label: '全部设备类型', value: null},
        {label: '枪机', value: 1},
        {label: '球机', value: 2},
        {label: '半球机', value: 3},
        {label: '红外', value: 4}
      ],
      alarmLevelList: this.dicFormater(dataList.alarmLevel)[0].dictList,
      // 地图参数
      map: null,
      devicesList: [], // 布控数据列表
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
      domId: null,
      bResize: {}
    }
  },
  mounted () {
    new Promise((resolve) => {
      this.changeControlState(resolve);
    }).then(() => {
      this.getControlMap(1);
    })
    let map = new window.AMap.Map('mapBox', {
      zoom: 10,
      center: mapXupuxian.center
    });
    map.setMapStyle('amap://styles/light');
    this.map = map;
    this.getAlarmListByDev();
  },
  methods: {
    // 跳转到告警详情页
    skipIsalarmDel (item) {
      this.$router.push({name: 'alarm_default', query: {uid: item.uid, objType: item.objType, type: 'today'}});
    },
    hideLeft() {
      this.hideleft = !this.hideleft;
    },
    skipIsCreateControl () {
      this.$router.push({name: 'control_create'});
    },
    sikpISalarmToday () {
      this.$router.push({ name: 'today_alarm' });
    },
    // 显示大屏
    showScreen () {
      $('.control_map').append($('#controlVideo'));
      this.isShowVideo = false;
      this.isShowV = false; 
      this.isShowFullScreen = true;
    },
    // 关闭大屏播放器
    playerClose () {
      this.isShowVideo = true;
        setTimeout(() => {
          $('#' + this.domId).append($('#controlVideo'));
          this.isShowV = true;
      }, 100)
      this.isShowFullScreen = false;
    },
    // 获取布控名称下拉列表
    getControlNameBySelect () {
      getControlNameBySelect({surveillanceStatus: this.mapForm.state}).then(res => {
        if (res) {
          this.controlNameList = res.data.map(m => {
            return {label: m.surveillanceName, value: m.uid}
          });
        }
      })
    },
    // 获取事件编号下拉列表
    getControlEventBySelect () {
      getControlEventBySelect({surveillanceStatus: this.mapForm.state}).then(res => {
        if (res) {
          this.eventList = res.data.filter(f => f !== null);
          this.eventList = this.eventList.map(m => {
            return {label: m.eventNumber, value: m.eventId}
          });
        }
      })
    },
    // 获取布控对象下拉列表
    getControlObjBySelect () {
      getControlObjBySelect({surveillanceStatus: this.mapForm.state}).then(res => {
        if (res) {
          this.controlObjDropdownList = res.data.filter(f => f.name);
        }
      })
    },
    // 切换布控状态后，重新获取布控名称列表、事件列表、布控对象列表数据
    changeControlState (resolve) {
      this.controlNameList = [];
      this.eventList = [];
      this.controlObjDropdownList = [];
      this.mapForm.name = null;
      this.mapForm.event = null;
      this.mapForm.obj = {
        objId: null,
        objType: null,
        name: null
      };
      this.getControlNameBySelect();
      this.getControlEventBySelect();
      this.getControlObjBySelect();
      if (resolve) resolve();
    },
    // 获得设备报警列表
    getAlarmListByDev () {
      let devList = this.devicesList.map(m => m.uid);
      devList = Array.from(new Set(devList));
      let surveillanceList = this.devicesList.map(m => m.surveillanceIds);
      surveillanceList = surveillanceList.length > 0 ? surveillanceList.join(',').split(',') : [];
      surveillanceList = Array.from(new Set(surveillanceList));
      let data = {
        interval: 30
      } 
      devList.length > 0 && (data.deviceIds = devList.join(','));
      surveillanceList.length > 0 && (data.surveillanceIds = surveillanceList.join(','));
      getAlarmListByDev(data).then(res => {
        if (res && res.data) {
          this.markerAlarmList = res.data;
          if (this.markerAlarmList.length > 0 && this.devicesList.length > 0) {
            this.getAllAlarmSnapListByDev();
          }
          this.markerAlarmList.forEach(dev => {
            // const childDiv = '<div class="vl_icon_warning">发现可疑目标</div>';
            // 给有警情的点标记追加class
            // this.$nextTick(() => {
              
            //   $('#mapBox #' + dev.deviceId).append(childDiv);
            //   $('#mapBox #' + dev.deviceId).addClass("vl_icon_alarm");
            //   $('#mapBox #' + dev.deviceId).addClass("vl_icon_control_02");
            // })


              this.markerList.forEach(f => {
                const obj = f.getExtData();
                if (dev.deviceId === obj.uid) {
                  this.map.cluster.removeMarker(f);
                  const uContent = this.setMarkContent(obj, 1)
                  f.setContent(uContent);
                }
              })
          })
          this.timer = setTimeout(() => {
            // 让有警情的点标记的class 12s后移除  
            // $('#mapBox .vl_icon_control_02').removeClass("vl_icon_alarm");
            // $('#mapBox .vl_icon_control_02').removeClass("vl_icon_control_02");
            // $('#mapBox .vl_icon_warning').remove();
            this.markerList.forEach(f => {
              const obj = f.getExtData();
              if (this.markerAlarmList.some(s => s.deviceId === obj.uid)) {
                const uContent = this.setMarkContent(obj, 2)
                f.setContent(uContent);
                this.map.cluster.addMarker(f);
              }
            })
            this.getAlarmListByDev();
          }, 12000)
        }
      })
    },
    // 设置marker的显示图标
    setMarkContent (obj, type) {
      if (type === 1) {
        return '<div id="' + obj.uid + '" class="vl_icon vl_icon_control_01 vl_icon_control_02 vl_icon_alarm"><div class="vl_icon_warning">发现可疑目标</div></div>'
      } else {
        return '<div id="' + obj.uid + '" class="vl_icon vl_icon_control_01"></div>'
      }
    },
    // 获取实时监控的布控设备
    getControlMap (flag) {
      this.$_showLoading();
      if (this.mapForm.state !== 1) {
        this.isShowSnapList = false;
      } else {
        this.isShowSnapList = true;
      }
      const params = {
        deviceType: this.mapForm.type,//设备类型
        surveillanceStatus: this.mapForm.state,//布控状态
        alarmLevel: this.mapForm.alarmId.length > 0 ? this.mapForm.alarmId.join(',') : null,//告警级别
        surveillanceDateStart: this.mapForm.startTime,//布控开始时间
        surveillanceDateEnd: this.mapForm.endTime,//布控结束时间
        surveillanceName: this.mapForm.name,//布控名称
        eventId: this.mapForm.event,//事件Id
        surveillanceObjectId: this.mapForm.obj.objId,//布控对象id
        surveillanceObjectType: this.mapForm.obj.objType,//布控对象类型
        surveillanceObjectName: this.mapForm.obj.name//布控对象名称
      }
      this.loadingBtn = true;
      getControlMap(params).then(res => {
        if (res && res.data) {
          if (res.data.devList.length === 0) {
            this.devicesList = [];
            if (this.map) {
              this.map.remove(this.markerList);
            }
            // 第一次进入页面,无进行中的布控设备数据时，弹出新建布控的跳转弹窗
            if (flag === 1) {
              this.isShowCreateControlDialog = true;
            } else {
              this.$message({
                customClass: 'control_map_message',
                iconClass: 'xxxx',
                showClose: true,
                message: '搜索无相关数据'
              }); 
            }
            return;
          }
          this.devicesList = res.data.devList;
        }
      }).then(() => {
        // 没有获取到布控设备时，清除之前保存的定时器，并return
        if (this.devicesList.length === 0) {
          clearTimeout(this.timer);
          return;
        }
        this.mapMark();
        if (this.mapForm.state === 1) this.getAllAlarmSnapListByDev();
      }).finally(() => {
        this.loadingBtn = false;
      })
    },
    // 获取设备下布控列表
    getControlMapByDevice (obj) {
      const params = {
        deviceName: obj.deviceName,
        uid: obj.uid,
        surveillanceIds: obj.surveillanceIds,
        surveillanceStatus: this.mapForm.state
      }
      getControlMapByDevice(params).then(res => {
        if (res && res.data) {
          let _this = this;

          $('.control_map').append($('#controlVideo'));_this.isShowVideo = false; _this.isShowV = false;

          _this.controlObjList = res.data;
          let sContent = '', clickWindow = null, vlMapVideo = '', vlMapObj = '', vlMapObjList = '';
          _this.domId = obj.uid + '_' + random14()
          if (_this.mapForm.state === 1) {
            vlMapVideo = `
              <div class="vl_map_close vl_icon vl_icon_control_04"></div>
              <div class="vl_map_click_main">
              <div class="vl_map_img">`;
              if (obj.deviceStatus === 1) {
                vlMapVideo += `<div id="${_this.domId}" style="width: 300px;height: 150px;background: #000;"></div>`;
              } else {
                vlMapVideo += `<div style="width: 300px;height: 150px;background: #000;display: flex;align-items: center;justify-content: center;color: #fff;">设备故障，暂时无法获取视频</div>`;
              }
               vlMapVideo += `<div class="vl_map_state">进行中</div></div>`;
          }
          if (_this.controlObjList.num === 1) {
            vlMapObj = `
              <div class="vl_map_info">
                <div class="vl_map_name" id="${_this.controlObjList.list[0].uid}"><span title="${_this.controlObjList.list[0].surveillanceName}">${_this.controlObjList.list[0].surveillanceName}</span></div>`;
              if (_this.controlObjList.list[0].surveillanceType === 1) {
                vlMapObj += `<div><span>布控日期：</span><span>${_this.controlObjList.list[0].surveillanceDateStart}至${_this.controlObjList.list[0].surveillanceDateEnd}</span></div>`;
              }
              if (_this.controlObjList.list[0].eventDetail) {
                vlMapObj += `<div><span>事件预览：</span><span title="${_this.controlObjList.list[0].eventDetail}">${_this.strCutWithLen(_this.controlObjList.list[0].eventDetail, 120)}</span></div>`;
              }
              if (_this.mapForm.state === 3) {
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
            for (let i = 0; i < _this.controlObjList.list.length ; i++) {
              if (i === 10) {
                vlMapObjList += `<div class="control_more"><span>查看更多</span></div>`
                break; 
              }
              let item = _this.controlObjList.list[i];
              vlMapObjList += 
              `<div class="vl_map_info">
                <div class="vl_map_name" id="${item.uid}"><span title="${item.surveillanceName}">${item.surveillanceName}</span></div>`;
                if (item.surveillanceType === 1) {
                  vlMapObjList += `<div><span>布控日期：</span><span>${item.surveillanceDateStart}至${item.surveillanceDateEnd}</span></div>`;
                }
                if (item.eventDetail) {
                  vlMapObjList += `<div><span>事件预览：</span><span title="${item.eventDetail}">${_this.strCutWithLen(item.eventDetail, 120)}</span></div>`;
                }
                if (_this.mapForm.state === 3) {
                  vlMapObjList += `<div><span>布控结果：</span><span>${item.snapNum}张抓拍图片</span></div>`;
                }
              vlMapObjList += `</div>`;
            }
          }

          // 布控进行中
          if (_this.mapForm.state === 1) {
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
                  sContent += `<div class="vl_map_btn">视频回放</div>`;
                sContent +=  `</div>
                  <div class="vl_map_triangle"></div>
                </div>`;
            }
          }
          // 布控待开始
          if (_this.mapForm.state === 2) {
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
          if (_this.mapForm.state === 3) {
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
            offset: new window.AMap.Pixel(-2, -80), // 相对于基点的偏移位置
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
            $('#' + obj.uid).removeClass("vl_icon_control_03");
          })
          this.clickWindow = clickWindow;
          // 跳转至布控详情页
          $('#mapBox').on('click', '.vl_map_name', function (e) {
            // const { href } = _this.$router.resolve({
            //   name: 'control_manage',
            //   query: {pageType: 2, state: this.mapForm.state, controlId: e.currentTarget.id }
            // })
            // window.open(href, '_blank', 'toolbar=no,location=no,width=1300,height=900')
            _this.$router.push({name: 'control_manage', query: {pageType: 2, state: _this.mapForm.state, controlId: e.currentTarget.id }});
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
          // 获得布控进行中直播视频
          if (_this.mapForm.state === 1) {
            _this.videoObj = {
              type: 1,
              title: obj.deviceName,
              video: Object.assign({}, obj)
            };
            if (obj.deviceStatus === 1) {
              _this.isShowVideo = true;
              setTimeout(() => {
                $('#' + _this.domId).append($('#controlVideo'));
                _this.isShowV = true;
              }, 100)
            }
          }
          // 当布控列表数据超过10条时，点击查看更多跳转到布控列表
          $('#mapBox').on('click', '.control_more', function () {
            _this.$router.push({ name: 'control_manage', query: {state: _this.mapForm.state} })
          })
        }
      })
    },
    // 获取布控抓拍结果列表
    getAllAlarmSnapListByDev () {
      const data = {
        pageSize: 10,
        pageNum: 1,
        where: {
          deviceIds: this.devicesList.map(m => m.uid).join(','),
          surveillanceIds: this.devicesList.map(m => m.surveillanceIds).join(',')
        }
      }
      getAllAlarmSnapListByDev(data).then(res => {
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
      _this.markerList = [];
      for (let i = 0; i < data.length; i++) {
        let obj = data[i];
        let content = '';
        if (obj.deviceStatus === 1) {
          // 设备正常
          content = '<div id="' + obj.uid + '" class="vl_icon vl_icon_control_01"></div>';
        } else {
          // 设备不正常
          content = '<div id="' + obj.uid + '" class="vl_icon vl_icon_sxt_not_choose"></div>';
        }
        if (obj.longitude > 0 && obj.latitude > 0) {
          let offSet = [-20.5, -70];
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
            if (_this.markerAlarmList.some(s => s.deviceId === marker.getExtData().uid)) {
              if (!$('#' + marker.getExtData().uid).hasClass('vl_icon_control_02')) {
                // $('#mapBox .vl_icon_control_03').addClass("vl_icon_control_01");
                $('#mapBox .vl_icon_control_03').removeClass(" vl_icon_control_03");
                $('#' + marker.getExtData().uid).addClass("vl_icon_control_03");
              } else {
                $('#' + marker.getExtData().uid).removeClass("vl_icon_alarm");
                $('#' + marker.getExtData().uid + '> .vl_icon_warning').remove();
                $('#' + marker.getExtData().uid).removeClass("vl_icon_control_02");
                $('#' + marker.getExtData().uid).addClass("vl_icon_control_03");
                // $(`#mapBox .vl_icon_control_03:not(#${e.target.C.extData.uid})`).addClass("vl_icon_control_01");
                $(`#mapBox .vl_icon_control_03:not(#${marker.getExtData().uid})`).removeClass("vl_icon_control_03");
              }
            } else {
              // 点击切换普通点标记图标
              // $('#mapBox .vl_icon_control_03').addClass("vl_icon_control_01");
              $('#mapBox .vl_icon_control_03').removeClass("vl_icon_control_03");
              $('#' + marker.getExtData().uid).addClass("vl_icon_control_03");
              // $('#' + e.target.C.extData.uid).removeClass("vl_icon_control_01");
            }
            _this.getControlMapByDevice(marker.getExtData());
          })
          _this.markerList.push(marker);
        }
      }
      _this.map.setFitView();// 自动适配到合适视野范围
      addCluster(_this.map, _this.markerList);
      this.$_hideLoading();
    },
    // 跳转至视频回放页面
    skipIsVideo (uid, deviceName) {
      // const { href } = this.$router.resolve({
      //   name: 'video_playback',
      //   query: {uid, deviceName}
      // })
      // window.open(href, '_blank', 'toolbar=no,location=no,width=1300,height=900')
      this.$router.push({name: 'video_playback', query: {uid, deviceName}});
    },
    // 重置表单
    resetForm () {
      this.$refs['mapForm'].resetFields();
    }
  },
  beforeDestroy () {
    if (this.map) {
      this.map.destroy();
    }
    if(this.timer) { //如果定时器还在运行 或者直接关闭，不用判断
      clearTimeout(this.timer); //关闭
    }
  }
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
      background: #fff;
      overflow: hidden;
      box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
      transition: all .1s linear;
      p{
        line-height: 60px;
        text-align: center;
        color: #999;
        border-bottom: 1px solid #d3d3d3;
      }
      .map_form{
        padding: 20px;
      }
    }
    .insetLeft {
      position: absolute;
      top: 50%;
      margin-top: -89px;
      z-index: 999;
      display: inline-block;
      cursor: pointer;
      &.vl_icon_map_shrinkage_01{
        left: 252px;
      }
      &.vl_icon_map_shrinkage_02{
        left: 0;
      }
      &.vl_icon_map_shrinkage_01:hover{
        background-position: -1036px -1269px!important;
      }
      &.vl_icon_map_shrinkage_02:hover{
        background-position: -1156px -1269px!important;
      }
    }
    .map_box{
      height: 100%;
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
            padding: 70px 0;
            box-shadow:0px -4px 10px 0px rgba(131,131,131,0.28);
            background:linear-gradient(180deg,rgba(55,181,253,1),rgba(12,112,248,1));
            p{
              margin-bottom: 10px;
              line-height: 24px;
              color: #fff;
            }
            div{
              font-size: 38px;
              line-height: 24px;
              margin-bottom: 6px;
              color: #fff;
              font-family:Arial-BoldMT;
              font-weight:bold;
            }
            .el-button{
              width: 120px;
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
            padding-bottom: 15px;
            box-shadow:0px -4px 10px 0px rgba(131,131,131,0.28);
            cursor: pointer;
            .obj_name{
              width: 100%;
              height:32px;
              line-height: 32px;
              text-align: center;
              background:rgba(12,112,248,1);
              box-shadow:0px -4px 10px 0px rgba(131,131,131,0.28);
              color: #fff;
            }
            ul{
              padding: 6px 0 0 16px;
              li i{
                vertical-align: middle;
              }
              li:nth-child(1) span{
                color: #333333;
                font-size: 12px;
              }
              li:not(:nth-child(1)) span{
                color: #999999;
                font-size: 12px;
              }
            } 
            .img{
              width: 100%;
              margin-top: 15px;
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
        z-index: 999;
        .video_box{
          width: 100%;
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
          height: 25%;
          overflow: hidden;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
            .el-card{
              margin-top: 18px;
              text-align: center;
              box-shadow:0px -4px 10px 0px rgba(131,131,131,0.28);
            }
            .more.el-card{
              width: 11%;
              margin-right: 1%;
              display: flex;
              flex-flow: column;
              justify-content: center;
              align-items: center;
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
              height: 100%;
              padding-top: 10px;
              margin-right: 1%;
              p{
                line-height: 30px;
                color: #333;
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
      width: 100%;
    }
  }
  .map_box{
    .el-card__body{
      padding: 0!important;
    }
    .swiper-container{
      .swiper-button-next, .swiper-button-prev{
        display: none;
        background-image: none;
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
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis; 
          }
        }
        .control_more{
          padding-top: 10px;
          text-align: center;
          > span{
            color: #0567E1;
            cursor: pointer;
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
  .pic.el-card .el-card__body{
    height: 100%
  }
}
// 重置布控地图模块提示消息样式
.control_map_message{
  width: 300px;
  > p, > i{
    color: #000;
  }
  > i{
    font-weight: bold;
  }
}
.create_control_dialog .create_control{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > img{
    width: 50%;
  }
  > p{
    padding: 10px 0;
  }
  > .reset_btn{
    background:rgba(242,242,242,1);
    border:1px solid rgba(211,211,211,1);
    border-radius:4px;
  }
}
</style>
