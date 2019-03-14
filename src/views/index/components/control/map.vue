<template>
  <div class="control_map">
    <!-- 侧边栏搜索框 -->
    <div class="search_box">
      <p>选择一个或多个条件进行搜索</p>
      <el-form :model="mapForm" class="map_form" ref="mapForm">
        <el-form-item style="width: 192px;" prop="name">
          <el-input v-model="mapForm.name" placeholder="请输入布控名称"></el-input>
        </el-form-item>
        <el-form-item style="width: 192px;" prop="num">
          <el-input v-model="mapForm.num" placeholder="请输入事件编号"></el-input>
        </el-form-item>
        <el-form-item style="width: 192px;" prop="obj">
          <el-input v-model="mapForm.obj" placeholder="请输入布控对象"></el-input>
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
            <el-option
              v-for="item in rankList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="time">
          <el-date-picker
            style="width: 192px;"
            v-model="mapForm.time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-button class="reset_btn" type="primary" plain @click="resetForm()">重置</el-button>
          <el-button class="select_btn" type="primary" @click="getControlMap">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="map_box">
      <!-- 地图 -->
      <div id="mapBox"></div>
      <!-- 抓拍列表 -->
      <div class="snap_box" v-if="!isShowFullScreen">
        <el-card shadow="hover" class="more">
          <p>今日抓拍</p>
          <div>{{snapTotal}}</div>
          <el-button size="small">查看更多</el-button>
        </el-card>
        <el-card class="pic" shadow="hover" v-for="item in snapList" :key="item.deviceId">
          <div class="img">
            <img :src="item.snapPhoto" alt="" width="130" height="130">
          </div>
          <ul>
            <li>
              <i class="vl_icon vl_icon_control_26"></i>
              <span>{{item.featureName}}</span>
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
      <!-- 布控进行中页面 -->
      <div class="underway_box" v-if="isShowFullScreen">
        <div class="video_box" :style="{'height': videoHeight + 'px'}">
          <div class="video">
            <div>
              <video src="../../../../assets/video/video.mp4" autoplay loop controls></video>
              <div class="toolbar">
                <div>{{controlObjList.deviceName}}</div>
                <div>
                  <i class="vl_icon vl_icon_control_09"></i>
                  <i class="vl_icon vl_icon_control_10"></i>
                  <i class="vl_icon vl_icon_control_06"></i>
                  <i class="vl_icon vl_icon_control_11"></i>
                  <i class="vl_icon vl_icon_control_07"></i>
                  <i class="vl_icon vl_icon_control_08"></i>
                  <i class="vl_icon vl_icon_control_12"></i>
                </div>
              </div>
              <div class="vl_map_state">进行中</div>
              <div class="vl_icon vl_icon_control_13" @click="isShowFullScreen = !isShowFullScreen"></div>
            </div>
          </div>
        </div>
        <div class="control_box">
          <div>
            <el-card class="more" shadow="hover">
              <p>布控对象</p>
              <div>{{controlObjList.objectList.length}}</div>
              <el-button size="small">查看更多</el-button>
            </el-card>
            <el-card class="pic" shadow="hover" v-for="item in controlObjList.objectList" :key="item.name">
              <img :src="item.photoUrl" alt="" width="130" height="130">
              <p>{{item.name}}</p>
            </el-card>
          </div>
          <div class="control_info">
            <div class="control_info_list">
              <div><span>布控名称：</span><span>{{controlObjList.list[0].surveillanceName}}</span></div>
              <div><span>布控日期：</span><span>{{controlObjList.list[0].surveillanceDateStart}}-{{controlObjList.list[0].surveillanceDateEnd}}</span></div>
              <div><span>事件预览：</span><span>{{controlObjList.list[0].eventDetail}}</span></div>
            </div>
            <el-button type="primary" size="small" @click="skipIsVideo">视频回放</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {random14} from '../../../../utils/util.js';
import {getControlMap, getControlMapByDevice, getAlarmSnap} from '@/views/index/api/api.js';
export default {
  data () {
    return {
      // 左侧搜索参数
      mapForm: {
        name: null,
        num: null,
        obj: null,
        state: 1,
        type: null,
        rank: null,
        time: null
      },
      stateList: [
        {label: '待开始', value: 2},
        {label: '进行中', value: 1},
        {label: '已结束', value: 3}
      ],
      typeList: [
        {label: '全部', value: 0},
        {label: '球机', value: 1},
        {label: '枪机', value: 2}
      ],
      rankList: [
        {label: '全部', value: 0},
        {label: '一级', value: 1},
        {label: '二级', value: 2},
        {label: '三级', value: 3},
        {label: '四级', value: 4},
        {label: '五级', value: 5}
      ],
      // 地图参数
      map: null,
      controlList: null, // 布控数据列表
      // 抓拍列表参数
      snapList: [
        {url: '//via.placeholder.com/130x130', name: '冯晓宁1', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},
        {url: '//via.placeholder.com/130x130', name: '冯晓宁2', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},
        {url: '//via.placeholder.com/130x130', name: '冯晓宁3', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},
        {url: '//via.placeholder.com/130x130', name: '冯晓宁4', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},
        {url: '//via.placeholder.com/130x130', name: '冯晓宁5', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},
        {url: '//via.placeholder.com/130x130', name: '冯晓宁6', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},
        {url: '//via.placeholder.com/130x130', name: '冯晓宁7', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'}
      ],
      snapTotal: null,//抓拍总数
      // 布控对象列表参数
      controlObjList: [
        {url: '//via.placeholder.com/130x130', name: '冯晓宁1', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},
        {url: '//via.placeholder.com/130x130', name: '冯晓宁2', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},
        {url: '//via.placeholder.com/130x130', name: '冯晓宁3', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},     
        {url: '//via.placeholder.com/130x130', name: '冯晓宁3', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},      
        {url: '//via.placeholder.com/130x130', name: '冯晓宁3', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},      
        {url: '//via.placeholder.com/130x130', name: '冯晓宁3', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'}      
      ],
      isShowFullScreen: false, // 是否显示全屏播放页面
      videoHeight: null
    }
  },
  mounted () {
    let _this = this;
    _this.getControlMap();
    _this.getAlarmSnap();
    let map = new window.AMap.Map('mapBox', {
      zoom: 16, // 级别
      center: [112.980377, 28.100175], // 中心点坐标112.980377,28.100175
      // viewMode: '3D' // 使用3D视图
    });
    map.setMapStyle('amap://styles/whitesmoke');
    this.map = map;
    
    _this.videoHeight = document.body.clientHeight - 336;
  },
  methods: {
    // 获取实时监控的布控设备
    getControlMap () {
      const params = {
        deviceType: this.mapForm.type,//设备类型
        surveillanceStatus: this.mapForm.state,//布控状态
        alarmLevel: this.mapForm.rank,//告警级别
        surveillanceDateStart: this.mapForm.time && this.mapForm.time[0],//布控开始时间
        surveillanceDateEnd: this.mapForm.time && this.mapForm.time[1],//布控结束时间
        surveillanceName: this.mapForm.name,//布控名称
        eventId: this.mapForm.num,//事件Id
        surveillanceObjectId: this.mapForm.obj//布控对象id
      }
      getControlMap(params).then(res => {
        if (res && res.data) {
          this.controlList = res.data;
          this.changeState();
        }
      })
    },
    // 获取设备下布控列表查询接口
    getControlMapByDevice (obj) {
      const params = {
        deviceName: 1,//obj.deviceName
        uid: 1,//obj.uid
        surveillanceIds: 11,//obj.surveillanceIds
        surveillanceStatus: 1//obj.surveillanceStatus
      }
      getControlMapByDevice(params).then(res => {
        if (res && res.data) {
          let _this = this;
          _this.controlObjList = res.data;
          let sContent = '', clickWindow;
          // 布控进行中
          if (_this.mapForm.state === 1) {
            // 一个摄像头只有一个布控时
            if (_this.controlObjList.num === 1) {
              sContent = `
                <div class="vl_map_click">
                  <div class="vl_map_close vl_icon vl_icon_control_04"></div>
                  <div class="vl_map_click_main">
                    <div class="vl_map_img">
                      <video src="${require('../../../../assets/video/video.mp4')}" autoplay loop controls width="100%"></video>
                      <div class="vl_map_state">进行中</div>
                      <div class="vl_map_operate">
                        <div>${_this.controlObjList.deviceName}</div>
                        <div>
                          <i class="vl_icon vl_icon_control_06"></i>
                          <i class="vl_icon vl_icon_control_07"></i>
                          <i class="vl_icon vl_icon_control_08 vl_map_full_screen"></i>
                        </div>
                      </div>
                    </div>
                    <div class="vl_map_info">
                      <div class="vl_map_name"><span>布控名称：</span><span>${_this.controlObjList.list[0].surveillanceName}</span></div>
                      <div><span>布控日期：</span><span>${_this.controlObjList.list[0].surveillanceDateStart}-${_this.controlObjList.list[0].surveillanceDateEnd}</span></div>
                      <div><span>事件预览：</span><span>${_this.controlObjList.list[0].eventDetail}</span></div>
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
                          sContent += `<div><img src="${item.photoUrl}"><p>${item.name}</p></div>`;
                        }
                        sContent += `</div>
                      </div>
                    </div>
                    <div class="vl_map_btn">视频回放</div>
                  </div>
                  <div class="vl_map_triangle"></div>
                </div>
                `;
            // 一个摄像头有多个布控时
            } else if (_this.controlObjList.num > 1) {
              sContent = 
                `<div class="vl_map_click">
                  <div class="vl_map_close vl_icon vl_icon_control_04"></div>
                  <div class="vl_map_click_main">
                    <div class="vl_map_img">
                      <video src="${require('../../../../assets/video/video.mp4')}" autoplay loop controls width="100%"></video>
                      <div class="vl_map_state">进行中</div>
                      <div class="vl_map_operate">
                        <div>${_this.controlObjList.deviceName} </div>
                        <div>
                          <i class="vl_icon vl_icon_control_06"></i>
                          <i class="vl_icon vl_icon_control_07"></i>
                          <i class="vl_icon vl_icon_control_08 vl_map_full_screen"></i>
                        </div>
                      </div>
                    </div>`
                    for (let item of _this.controlObjList.list) {
                      sContent += 
                      `<div class="vl_map_info">
                        <div class="vl_map_name"><span>布控名称：</span><span>${item.surveillanceName}</span></div>
                        <div><span>布控日期：</span><span>${item.surveillanceDateStart}-${item.surveillanceDateEnd}</span></div>
                        <div><span>事件预览：</span><span>${item.eventDetail}</span></div>
                      </div>`
                    }
                    
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
                      <span>${_this.controlObjList.deviceName}</span>
                    </div>
                    <div class="vl_map_info">
                      <div class="vl_map_name"><span>布控名称：</span><span>${_this.controlObjList.list[0].surveillanceName}</span></div>
                      <div><span>布控日期：</span><span>${_this.controlObjList.list[0].surveillanceDateStart}-${_this.controlObjList.list[0].surveillanceDateEnd}</span></div>
                      <div><span>事件预览：</span><span>${_this.controlObjList.list[0].eventDetail}</span></div>
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
                          sContent += `<div><img src="${item.photoUrl}"><p>${item.name}</p></div>`;
                        }
                      sContent += `</div>
                      </div>
                    </div>
                  </div>
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
                      <span>${_this.controlObjList.deviceName}</span>
                    </div>`;
                    for (let item of _this.controlObjList.list) {
                      sContent += 
                      `<div class="vl_map_info">
                        <div class="vl_map_name"><span>布控名称：</span><span>${item.surveillanceName}</span></div>
                        <div><span>布控日期：</span><span>${item.surveillanceDateStart}-${item.surveillanceDateEnd}</span></div>
                        <div><span>事件预览：</span><span>${item.eventDetail}</span></div>
                      </div>`
                    }
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
                      <span>${_this.controlObjList.deviceName}</span>
                    </div>
                    <div class="vl_map_info">
                      <div class="vl_map_name"><span>布控名称：</span><span>${_this.controlObjList.list[0].surveillanceName}</span></div>
                      <div><span>布控日期：</span><span>${_this.controlObjList.list[0].surveillanceDateStart}-${_this.controlObjList.list[0].surveillanceDateEnd}</span></div>
                      <div><span>事件预览：</span><span>${_this.controlObjList.list[0].eventDetail}</span></div>
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
                            sContent += `<div><img src="${item.photoUrl}"><p>${item.name}</p></div>`;
                          }
                        sContent += `</div>
                      </div>
                    </div>
                  </div>
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
                      <span>${_this.controlObjList.deviceName}</span>
                    </div>`;
                    for (let item of _this.controlObjList.list) {
                      sContent += 
                      `<div class="vl_map_info">
                        <div class="vl_map_name"><span>布控名称：</span><span>${item.surveillanceName}</span></div>
                        <div><span>布控日期：</span><span>${item.surveillanceDateStart}-${item.surveillanceDateEnd}</span></div>
                        <div><span>事件预览：</span><span>${item.eventDetail}</span></div>
                      </div>`
                    }
                sContent += `</div>
                  <div class="vl_map_triangle"></div>
                </div>`;
            }
          }
          clickWindow = new window.AMap.InfoWindow({
            isCustom: true,
            closeWhenClickMap: true,
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
            if (clickWindow) { clickWindow.close(); }
          })
          // 利用事件冒泡,绑定视频全屏按钮的点击事件
          $('#mapBox').on('click', '.vl_map_full_screen', function () {
            // 关闭弹窗
            if (clickWindow) { clickWindow.close(); }
            // 显示视频回放页面
            _this.isShowFullScreen = true;
          })
          $('#mapBox').on('click', '.vl_map_name > span', function () {
            // 跳转至布控详情页
            const { href } = _this.$router.resolve({
              name: 'control_manage',
              query: {pageType: 2, state: _this.mapForm.state}
            })
            window.open(href, '_blank', 'toolbar=no,location=no,width=1300,height=900')
          })
          $('#mapBox').on('click', '.vl_map_btn', function () {
            // 跳转至视频回放页面
            _this.skipIsVideo();
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
              slide.animate({marginLeft: '-=80px'}, 1000, function () {
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
              slide.animate({marginLeft: '+=80px'}, 1000,function () {
                offbtnStatusRight = false;
              });
            } else {
              setTimeout(() => {
                offbtnStatusRight = false;
              }, 1000)
            }
          })
        }
      })
    },
    // 获取布控抓拍结果列表
    getAlarmSnap () {
      const params = {
        pageNum: 1,
        pageSzie: 10,
        'where.surveillanceId': 11,
        'where.dateStart': '2019-03-01',//formatDate(new Date(), 'yyyy-MM-dd'),
        'where.dateEnd': '2019-03-14'//formatDate(new Date(), 'yyyy-MM-dd'),
      }
      getAlarmSnap(params).then(res => {
        if (res && res.data) {
          this.snapList = res.data.list;
          this.snapTotal = res.data.total;
        }
      })
    },
    // 地图标记
    mapMark () {
      let _this = this;
      let data = _this.controlList;
      console.log(data, 'data')
      _this.map.clearMap();
      for (let i = 0; i < data.length; i++) {
        let obj = data[i];
        obj.sid = obj.deviceName + '_' + i + '_' + random14();
        let content = '';
        // 暂时默认告警级别为五级时出现告警闪烁
        if (obj.uid === 1) {
          content = '<div id="' + obj.sid + '" class="vl_icon vl_icon_control_02 vl_icon_alarm"><div class="vl_icon_warning">发现可疑目标</div></div>';
        } else {
          content = '<div id="' + obj.sid + '" class="vl_icon vl_icon_control_01"></div>';
        }
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
          marker.setMap(_this.map);
          // 让告警闪烁图标10s后自动消失
          if (obj.uid === 1) {
            setTimeout(() => {
              $('#mapBox .vl_icon_control_02').removeClass("vl_icon_alarm");
              $('#mapBox .vl_icon_warning').remove();
              $('#' + obj.sid).removeClass("vl_icon_control_02");
              $('#' + obj.sid).addClass("vl_icon_control_01");
            }, 10000);
          }
          marker.on('click', function(e) {
            console.log(e.target.C.extData, 'e')
            // 点击切换告警闪烁图标
            if (e.target.C.extData.uid === 1) {
              if (!$('#' + e.target.C.extData.sid).hasClass('vl_icon_control_02')) {
                $('#mapBox .vl_icon_control_03').addClass("vl_icon_control_01");
                $('#mapBox .vl_icon_control_03').removeClass(" vl_icon_control_03");
                $('#' + e.target.C.extData.sid).addClass("vl_icon_control_03");
              } else {
                $('#mapBox .vl_icon_control_02').removeClass("vl_icon_alarm");
                $('#mapBox .vl_icon_warning').remove();
                $('#' + e.target.C.extData.sid).removeClass("vl_icon_control_02");
                $('#' + e.target.C.extData.sid).addClass("vl_icon_control_03");
                $(`#mapBox .vl_icon_control_03:not(#${e.target.C.extData.sid})`).addClass("vl_icon_control_01");
                $(`#mapBox .vl_icon_control_03:not(#${e.target.C.extData.sid})`).removeClass("vl_icon_control_03");
              }
            } else {
              // 点击切换普通点标记图标
              $('#mapBox .vl_icon_control_03').addClass("vl_icon_control_01");
              $('#mapBox .vl_icon_control_03').removeClass("vl_icon_control_03");
              $('#' + e.target.C.extData.sid).addClass("vl_icon_control_03");
              $('#' + e.target.C.extData.sid).removeClass("vl_icon_control_01");
            }
            _this.getControlMapByDevice(obj);
            // if (_this.controlObjList.num === undefined) {
            //   return false;
            // }
            
          });
        }
      }
    },
    // 跳转至视频回放页面
    skipIsVideo () {
      const { href } = this.$router.resolve({
        name: 'video_playback'
      })
      window.open(href, '_blank', 'toolbar=no,location=no,width=1300,height=900')
    },
    // 按布控状态来筛选地图标记
    changeState () {
      // this.controlList = objDeepCopy(testData);
      this.controlList = this.controlList.filter(f => f.surveillanceStatus === this.mapForm.state);
      // this.controlList = this.controlList.filter(f => f.controlList.length > 0);
      console.log(this.controlList)
      this.controlList.forEach((f, i) => {
        f.latitude = '28.10' + i + '253';
        f.longitude = '112.9' + i + '1563';
        f.deviceName = i;
      });
      this.mapMark();
    },
    // 重置表单
    resetForm () {
      this.$refs['mapForm'].resetFields();
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
      z-index: 999;
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
        width: 100%;
        height: 245px;
        overflow: hidden;
        position: absolute;
        bottom: 20px;
        left: 0;
        display: flex;
        flex-wrap: wrap;
        padding: 0 20px;
        .more.el-card{
          width: 152px;
          height: 245px;
          margin-bottom: 20px;
          margin-right: 1%;
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
        .pic.el-card{
          width: 174px;
          height: 245px;
          padding: 15px 0;
          margin-bottom: 20px;
          margin-right: 1%;
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
              video{
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top:0;
                z-index: 999;
              }
              .toolbar{
                width: 100%;
                height: 48px;
                line-height: 48px;
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                position: absolute;
                left: 0;
                bottom: 0;
                z-index: 999;
                padding-left: 15px;
                background:rgba(34,34,34,0.65);
                border-radius:0px 0px 3px 3px;
                > div{
                  color: #fff;
                  i{
                    margin-top: 12px;
                    cursor: pointer;
                  }
                }
                > div:not(:nth-child(1), :last-child) i{
                  margin-right: 15px;
                }
              }
              .vl_map_state{
                position: absolute;
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
              .vl_icon_control_13{
                position: absolute;
                right: 10px;
                top: 10px;
                z-index: 9999;
                cursor: pointer;
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
          > div:nth-child(1){
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
            .pic.el-card{
              width: 162px;
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
  }
</style>
<style lang="scss">
.control_map{
  .map_form{
    .el-form-item{
      margin-bottom: 10px!important;
    }
  }
  .map_box{
    .el-card__body{
      padding: 0!important;
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
            > span{
              cursor: pointer;
            }
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
                  line-height: 30px;
                }
                > p:hover{
                  cursor: pointer;
                  color: #0567E1;
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
