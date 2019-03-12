<template>
  <div class="control_manage_d">
    <!-- 面包屑 -->
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>布控</el-breadcrumb-item>
        <el-breadcrumb-item @click.native="skip(1)" class="con_back">布控管理</el-breadcrumb-item>
        <el-breadcrumb-item>布控详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 详情 -->
    <div class="manage_d_box">
      <div class="manage_d_title">
        <div class="vl_f_16 vl_f_333">基本信息</div>
        <div class="vl_f_12 vl_f_666">创建于{{controlDetail.createTime}} ；更新于{{controlDetail.updateTime}}</div>
      </div>
      <div class="manage_d_content">
        <!-- 布控信息 -->
        <ul>
          <li>
            <div><span class="vl_f_666">布控编号：</span><span class="vl_f_333">{{controlDetail.surveillanceNo}}</span></div>
            <div><span class="vl_f_666">布控类型：</span><span class="vl_f_333">{{controlDetail.type === 1 ? '短期布控' : controlDetail.type === 2 ? '长期布控' : '' }}</span></div>
          </li>
          <li>
            <div><span class="vl_f_666">布控名称：</span><span class="vl_f_333">{{controlDetail.surveillanceName}}</span></div>
            <div><span class="vl_f_666">布控日期：</span><span class="vl_f_333">{{controlDetail.surveillanceDateStart}} - {{controlDetail.surveillanceDateEnd}}</span></div>
          </li>
          <li>
            <div><span class="vl_f_666">告警级别：</span><span class="vl_f_333">{{controlDetail.alarmLevel}}</span></div>
            <div><span class="vl_f_666">布控时间：</span><span class="vl_f_333">{{controlDetail.time}}</span></div>
          </li>
        </ul>
        <div class="manage_d_c_e">
          <div class="vl_f_666">事件内容：</div>
          <div class="vl_f_333" style="padding-right: 120px;">{{controlDetail.eventDetail}}<span @click="eventDetailDialog = true;">详情</span></div>
        </div>
        <div class="manage_d_c_o">
          <div><span class="vl_f_333">布控对象</span><span class="vl_f_333">（{{controlDetail.objectNum}}个）</span></div>
          <div>
            <div class="manage_d_c_o_i" v-for="item in controlDetail.objectList" :key="item.id">
              <img :src="item.photoUrl" alt="">
              <p><i class="vl_icon vl_icon_control_17"></i><span class="vl_f_333">{{item.name}}</span></p>
              <p><i class="vl_icon vl_icon_control_17"></i><span class="vl_f_666">{{item.controlReason}}</span></p>
            </div>
          </div>
          <el-pagination
            style="align-self: flex-start;"
            @size-change="handleSizeChangeObj"
            @current-change="handleCurrentChangeObj"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="18"
            layout="total, prev, pager, next, jumper"
            :total="controlDetail.objectNum">
          </el-pagination>
        </div>
        <div :class="['vl_control_state', controlState === '0' ? 'vl_control_s' : controlState === '1' ? 'vl_control_o' : 'vl_control_e']"></div>
        <!-- 布控范围 -->
        <div class="manage_d_c_scope">
          <div class="manage_d_s_t" @click="controlArea">
            <div>布控范围</div>
            <i class="el-icon-arrow-up" v-show="dpType !== '布控范围'"></i>
            <i class="el-icon-arrow-down" v-show="dpType === '布控范围'"></i>
          </div>
          <el-collapse-transition>
            <div class="manage_d_s_m" v-show="dpType === '布控范围'">
              <div id="mapBox"></div>
              <div class="manage_d_s_m_l">
                <div>
                  <p><span class="vl_f_666">设备组：</span><span class="vl_f_333">自定义组1</span></p>
                  <p><span class="vl_f_666">设备特性：</span><span class="vl_f_333">人脸识别</span></p>
                </div>
                <div>
                  <div class="vl_f_333 top">布控设备（12）</div>
                  <div class="dp_box">
                    <div v-for="trackPoint in trackPointList" :key="trackPoint.uid">
                      <div class="track_t" @click="dropdown(trackPoint)" :class="{'active': trackPoint.isDropdown}">
                        <i class="el-icon-arrow-down" v-show="trackPoint.isDropdown"></i><i class="el-icon-arrow-right" v-show="!trackPoint.isDropdown"></i><span>{{trackPoint.address}}</span>
                      </div>
                      <el-collapse-transition>
                        <div v-show="trackPoint.isDropdown">
                          <div class="equ_m">
                            <div @click="getEquList('0', trackPoint)" :class="{'active': devId === trackPoint.uid && type === '0'}">摄像头（{{devNum}}）</div>
                            <div @click="getEquList('1', trackPoint)" :class="{'active': devId === trackPoint.uid && type === '1'}">卡口（{{bayonetNum}}）</div>
                          </div>
                          <vue-scroll>
                            <ul v-if="type === '0' && trackPoint.devList && trackPoint.devList.length > 0" style="max-height: 280px;">
                              <template v-for="equ in trackPoint.devList">
                                <li :key="equ.uid"><span>{{equ.uid}}</span><i class="vl_icon vl_icon_control_05"></i></li>
                                <!-- <li :key="equ.uid"><span style="color: #b2b2b2;">{{equ.equName}}</span><i class="vl_icon vl_icon_control_32"></i></li> -->
                              </template>
                            </ul>
                            <ul v-if="type === '1' && trackPoint.bayonetList && trackPoint.bayonetList.length > 0" style="max-height: 280px;">
                              <template v-for="equ in trackPoint.bayonetList">
                                <li :key="equ.uid"><span>{{equ.uid}}</span><i class="vl_icon vl_icon_control_05"></i></li>
                                <!-- <li :key="equ.uid"><span style="color: #b2b2b2;">{{equ.equName}}</span><i class="vl_icon vl_icon_control_32"></i></li> -->
                              </template>
                            </ul>
                          </vue-scroll>
                        </div>
                      </el-collapse-transition>
                    </div>
                  </div>
                </div>
              </div>
              <div class="manage_d_s_m_r">
                <div class="top"><i class="vl_icon vl_icon_control_23" @click="resetMap()"></i></div>
                <ul class="bottom">
                  <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
                  <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
                </ul>
              </div>
            </div>
          </el-collapse-transition>
        </div>
        <!-- 运行情况 -->
        <div class="manage_d_c_situ" v-if="controlState !== '0'">
          <div class="situ_title">运行情况</div>
          <div class="situ_time">
            <div><span>开始时间：</span><span>{{controlDetail.runningStartTime}}</span></div>
            <div v-if="controlState === '2'"><span>结束时间：</span><span>{{controlDetail.runningEndTime}}</span></div>
            <div><span>持续时间：</span><span>{{controlDetail.duration}}</span></div>
          </div>
          <div class="situ_box" v-if="controlState === '1'">
            <div class="situ_top" @click="dpType = '运行情况'">
              <div>实时监控</div>
              <i class="el-icon-arrow-down" v-show="dpType === '运行情况'"></i>
              <i class="el-icon-arrow-up" v-show="dpType !== '运行情况'"></i>
            </div>
            <el-collapse-transition>
              <div class="situ_content">
                  <div class="situ_left">
                    <div>布控设备（12）</div>
                    <vue-scroll>
                      <ul style="width: 100%;max-height: 736px;">
                        <template v-for="(item, index) in situList">
                          <li
                            v-if="item.name"
                            :key="'item' + index"
                            @dragstart="dragstart($event, index)"
                            @drag="drag"
                            @dragend="dragend"
                            @dragenter="dragenter"
                            @dragleave="dragleave"
                            @dragover="dragover"
                            @drop="drop($event, index)"
                            :draggable="true"
                          >
                            <span>{{item.name}}</span><i class="vl_icon vl_icon_control_05"></i>
                          </li>
                        </template>
                      </ul>
                    </vue-scroll>
                  </div>
                <div class="situ_right">
                  <div class="situ_r_video" v-for="(item, index) in rightVideoList" :key="'item' + index"
                    @dragstart="dragstart($event, index)"
                    @drag="drag"
                    @dragend="dragend"
                    @dragenter="dragenter"
                    @dragleave="dragleave"
                    @dragover="dragover"
                    @drop="drop($event, index)"
                    >
                    <div class="situ_r_img">
                      <div></div>
                    </div>
                      <!-- <video src="../../../../assets/video/video.mp4" autoplay loop></video>
                      <div>
                        <i class="vl_icon vl_icon_control_06"></i>
                        <i class="vl_icon vl_icon_control_11"></i>
                        <i class="vl_icon vl_icon_control_07"></i>
                      </div>
                      <i class="vl_icon vl_icon_control_13"></i> -->
                  </div>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </div>
        <!-- 布控结果 -->
        <div class="manage_d_c_result" v-if="controlState !== '0'">
          <div class="result_title">
            <div>布控结果（200个）</div>
            <div>
              <el-input size="small" placeholder="请选择起止时间"></el-input>
              <el-input size="small">请搜索或选择设备</el-input>
            </div>
          </div>
          <div class="result_content">
            <div>
              <div class="result_img_box" v-for="item in '12345678'" :key="item.id">
                <img src="//via.placeholder.com/395x239" alt="">
                <div class="result_tool">
                  <div>抓拍设备</div>
                  <div>
                    <i class="vl_icon vl_icon_control_06"></i>
                    <i class="vl_icon vl_icon_control_11"></i>
                  </div>
                </div>
                <div>
                  <p><i class="vl_icon vl_icon_control_26" style="margin-top: -4px;"></i><span class="vl_f_333">匹配名称</span></p>
                  <p><i class="vl_icon vl_icon_control_27" style="margin-top: -4px;"></i><span class="vl_f_999">抓拍时间</span></p>
                </div>
              </div>
            </div>
            <el-pagination
              style="align-self: flex-start;"
              @size-change="handleSizeChangeRes"
              @current-change="handleCurrentChangeRes"
              :current-page="currentPage"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, prev, pager, next, jumper"
              :total="400">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部操作按钮 -->
    <!-- 待开始 -->
    <div class="manage_f_box" v-if="controlState === '0'">
      <el-button type="primary" @click="skip(3)">编辑</el-button>
      <el-button @click="showDialog('delDialog')">删除</el-button>
    </div>
    <!-- 进行中 -->
    <div class="manage_f_box" v-if="controlState === '1'">
      <el-button type="primary" @click="showDialog('stopDialog')">终止</el-button>
    </div>
    <!-- 已结束 -->
    <div class="manage_f_box" v-if="controlState === '2'">
      <el-button type="primary" @click="skipIsCreate">复用</el-button>
      <el-button @click="showDialog('delDialog')">删除</el-button>
    </div>
    <div class="event_detail_dialog">
      <el-dialog
        :visible.sync="eventDetailDialog"
        :close-on-click-modal="false"
        width="800px"
        title="事件详情"
        top="20vh">
        <div class="detail_list">
          <div>
            <div><span class="vl_f_666">事件编号：</span><span class="vl_f_333">XPZ180724001</span></div>
            <div style="padding-left: 14px;"><span class="vl_f_666">报案人：</span><span class="vl_f_333">XPZ180724001</span></div>
          </div>
          <div>
            <div><span class="vl_f_666">事件状态：</span><span class="vl_f_333">XPZ180724001</span></div>
            <div><span class="vl_f_666">报案时间：</span><span class="vl_f_333">XPZ180724001</span></div>
          </div>
          <div>
            <div><span class="vl_f_666">事件类型：</span><span class="vl_f_333">XPZ180724001</span></div>
            <div><span class="vl_f_666">事件等级：</span><span class="vl_f_333">XPZ180724001</span></div>
          </div>
        </div>
        <div class="detail_list">
          <span class="vl_f_666">人员伤亡：</span><span class="vl_f_333">未知</span>
        </div>
        <div class="detail_list">
          <span class="vl_f_666">事发地点：</span><span class="vl_f_333">长沙市创谷广告产业园</span>
        </div>
        <div class="detail_list">
          <span class="vl_f_666">事件情况：</span><span class="vl_f_333">园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火事件情况文字达到140字的行数。</span>
        </div>
        <vue-scroll>
          <div class="detail_img_box">
            <img src="//via.placeholder.com/117x117" alt="" v-for="item in '111111111'" :key="item.id">
          </div>
        </vue-scroll>
      </el-dialog>
    </div>
    <div is="delDialog" ref="delDialog" :controlId="controlId" @getControlList="getControlList"></div>
    <div is="stopDialog" ref="stopDialog" :controlId="controlId" @getControlList="getControlList"></div>
  </div>
</template>
<script>
import delDialog from './delDialog.vue';
import stopDialog from './stopDialog.vue';
import {conData, conDetail} from '../testData.js';
import {random14} from '../../../../../utils/util.js';
import {getControlDetail, getControlObjList, controlArea} from '@/views/index/api/api.js';
export default {
  components: {delDialog, stopDialog},
  props: ['state', 'controlId'],
  data () {
    return {
      controlState: null,//布控详情状态
      controlDetail: conDetail,//布控详情
      // 地图参数
      map: null,
      // 追踪点列表数据
      trackPointList: [],
      devNum: null,//摄像头数量
      bayonetNum: null,//卡口数量
      devList: [], //设备列表
      type: '0',// 设备类型
      devId: null,//设备id
      dpType: null,//展开类型
       // 翻页数据
      currentPage: 1,
      pageSzieObj: 18,
      pageNumObj: 1,
      pageSzieRes: 8,
      pageNumObjRes: 1,
      // 实时监控设备列表
      situList: [
        {name: '设备1', id: '01', src: require('../../../../../assets/video/video.mp4'), index: 0},
        {name: '设备2', id: '02', src: require('../../../../../assets/video/video.mp4'), index: 1},
        {name: '设备3', id: '03', src: require('../../../../../assets/video/video.mp4'), index: 2},
        {name: '设备4', id: '04', src: require('../../../../../assets/video/video.mp4'), index: 3}
      ],
      rightVideoList: [{}, {}, {}, {}],//右边已拖过去的视频,默认展示4个
      dragstartIndex: null,//左边列表下标
      eventDetailDialog: false,//事件详情弹窗
    }
  },
  created () {
    this.$nextTick(() => {
      this.controlState = this.state;
      // this.trackPointList = conData;
    })
  },
  mounted () {
    this.resetMap();
    // this.reset();
    this.getControlDetail();
  },
  methods: {
    // 获取布控详情
    getControlDetail () {
      getControlDetail(this.controlId).then(res => {
        if (res && res.data) {
          this.controlDetail = res.data;
        }
      })
    },
    skip (type) {
      this.$emit('changePageType', type);
    },
    // 跳转至新建布控页-复用
    skipIsCreate () {
      this.$router.push({ name: 'control_create', query: {createType: 3} });
    },
    // 显示弹出框
    showDialog (formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].reset();
      }
    },
    getControlList () {
      this.$emit('getControlList');
    },
    dragstart (e, index) {
      // 使其半透明
      e.target.style.opacity = .5;
      this.dragstartIndex = index;
      console.log(this.dragstartIndex, 'dragstartIndex')
    },
    drag (e) {
      console.log(e);
    },
    dragend (e) {
      // 重置透明度
      e.target.style.opacity = "";
    },
    dragenter (e) {
      // 当可拖动的元素进入可放置的目标高亮目标节点
      if ( e.target.parentNode.parentNode.className == "situ_r_video" ) {
          e.target.style.background = "purple";
      }
    },
    dragleave (e) {
      // 当拖动元素离开可放置目标节点，重置其背景
      if ( e.target.parentNode.parentNode.className == "situ_r_video" ) {
          e.target.style.background = "";
      }
    },
    dragover (e) {
      // 阻止默认动作
      e.preventDefault();
    },
    drop (e, index) {
      // 阻止默认动作（如打开一些元素的链接）
      e.preventDefault();
      e.stopPropagation();
      // 移动拖动的元素到所选择的放置目标节点
      console.log(e.target)
      if ( e.target.parentNode.parentNode.className === "situ_r_video" ) {
          e.target.style.background = "";
          let videoSrc = this.situList[this.dragstartIndex].src;
          let sid = this.situList[this.dragstartIndex].id + '_' + random14();
          let div = document.createElement('div');
          let video = `<video src="${videoSrc}" autoplay loop controls></video>
            <div>
              <i class="vl_icon vl_icon_control_06"></i>
              <i class="vl_icon vl_icon_control_11"></i>
              <i class="vl_icon vl_icon_control_07"></i>
            </div>
            <i class="vl_icon vl_icon_control_13" id="${sid}"></i>
          `;
          div.innerHTML = video;
          e.target.parentNode.parentNode.replaceChild( div, e.target.parentNode);
          // 从左往右边拖拽逻辑
          let delVideo = this.situList.splice(this.dragstartIndex, 1, {});
          if (this.rightVideoList[index].id) {
            let _video = this.rightVideoList.splice(index, 1)[0];
            let _index = _video.index;
            this.situList.splice(_index, 1 , _video);
            this.rightVideoList.splice(index, 1, ...delVideo);
          } else {
            this.rightVideoList.splice(index, 1, ...delVideo);
          }
          console.log(this.rightVideoList) 
          // 防止重复绑定点击事件，先解绑
          // $('.situ_right').unbind('click');
          // 利用事件冒泡,绑定关闭按钮的点击事件，关闭后，从右边回到左边列表
          let _this = this;
          $('.situ_right').on('click', '#' + sid, function (e) {
            let _div = document.createElement('div');
            _div.className = 'situ_r_img';
            _div.innerHTML = '<div></div>'
            e.target.parentNode.parentNode.replaceChild( _div, e.target.parentNode);
            let _video = _this.rightVideoList.splice(index, 1, {})[0];
            let _index = _video.index;
            _this.situList.splice(_index, 1, _video);
          })
      }
    },

    // 切换设备类型获得设备列表数据
    getEquList (type, data) {
      this.type = type;
      this.devId = data.uid;
      // if (type === '1') {
      //   this.devList = data.kk;
      // }
    },
    // 展开或者闭合设备列表
    dropdown (data) {
      this.trackPointList.map(f => {
        if (data.uid === f.uid) {
          f.isDropdown = !f.isDropdown;
        } else {
          f.isDropdown = false;
        }
        this.getEquList('0', data);
      })
    },
    mapMark () {
      let _this = this, hoverWindow = null//, data;
      // // 组装右边点标记数据
      // let devList = [];
      // _this.trackPointList.forEach(f => {
      //   if (f.devList && f.devList.length > 0) {
      //     devList = [...devList, ...f.devList];
      //   }
      // })
      // devList.forEach(f => f.type = 1);//设置属性type:1为摄像头，2为卡口
      // let bayonetList = [];
      // _this.trackPointList.forEach(f => {
      //   if (f.bayonetList && f.bayonetList.length > 0) {
      //     bayonetList = [...bayonetList, ...f.bayonetList];
      //   }
      // })
      // bayonetList.forEach(f => f.type = 2);//设置属性type:1为摄像头，2为卡口
      // data = [...devList, ...bayonetList];
      let data = conData;
      _this.map.clearMap();
      for (let i = 0; i < data.devList.length; i++) {
        let obj = data.devList[i];
        obj.sid = obj.name + '_' + i + '_' + random14();
        if (obj.longitude > 0 && obj.latitude > 0) {
          let offSet = [-20.5, -48];
          let _content = null;
          if (obj.type === 'sxt') {
            if (obj.isNormal && obj.isSelected) {
              _content = '<div id="' + obj.sid + '" class="vl_icon vl_icon_sxt"></div>';
            } else if (obj.isNormal && !obj.isSelected) {
              _content = '<div id="' + obj.sid + '" class="vl_icon vl_icon_sxt_uncheck"></div>';
            } else if (!obj.isNormal) {
              _content = '<div id="' + obj.sid + '" class="vl_icon vl_icon_sxt_not_choose"></div>';
            }
          } else {
            if (obj.isNormal && obj.isSelected) {
              _content = '<div id="' + obj.sid + '" class="vl_icon vl_icon_kk"></div>';
            } else if (obj.isNormal && !obj.isSelected) {
              _content = '<div id="' + obj.sid + '" class="vl_icon vl_icon_kk_uncheck"></div>';
            } else if (!obj.isNormal) {
              _content = '';
            }
          }
          let marker = new window.AMap.Marker({ // 添加自定义点标记
            map: _this.map,
            position: [obj.longitude, obj.latitude],
            offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: _content
          });
          // hover
          marker.on('mouseover', function () {
            let sContent = '<div class="vl_map_hover">' +
              '<div class="vl_map_hover_main"><ul>' + 
                '<li><span>设备名称：</span>' + obj.equName + '</li>' + 
                '<li><span>设备地址：</span>' + obj.addr + '</li>' + 
              '</ul></div>';
            hoverWindow = new window.AMap.InfoWindow({
              isCustom: true,
              closeWhenClickMap: true,
              offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
              content: sContent
            });
            hoverWindow.open(_this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
            hoverWindow.on('close', function () {
              // console.log('infoWindow close')
            });
          });
          marker.on('mouseout', function () {
            if (hoverWindow) { hoverWindow.close(); }
          });
          marker.setMap(_this.map);
        }
      }
    },
    // 地图缩放
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    // 初始化地图
    resetMap () {
      let _this = this;
      _this.controlState = _this.$route.query.state;
      let map = new window.AMap.Map('mapBox', {
        zoom: 16, // 级别
        center: [112.97503, 28.09358], // 中心点坐标112.980377,28.100175
      });
      map.setMapStyle('amap://styles/whitesmoke');
      _this.map = map;
      _this.mapMark();
    },
    // 获取布控范围
    controlArea () {
      this.dpType = '布控范围';
      controlArea(this.controlId).then(res => {
        if (res && res.data) {
          this.devNum = res.data.devNum;
          this.bayonetNum = res.data.bayonetNum;
          this.trackPointList = res.data.trackingPointList;
          this.trackPointList.map(f => {
            this.$set(f, 'isDropdown', false);
          });
          this.mapMark();
        }
        
      })
    },
    // 布控对象列表分页查询
    getControlObjList () {
      const params = {
        pageNum: this.pageNumObj,
        pageSzie: this.pageSzieObj,
        orderBy: null,
        order: null,
        'where.surveillanceId': this.controlId
      }
      getControlObjList(params).then(res => {
        if (res && res.data) {
          this.controlDetail.objectList = res.data.list;
        }
      })
    },
    // 布控对象列表分页
    handleSizeChangeObj (size) {
      this.pageSzieObj = size;
      this.getControlObjList();
    },
    // 布控对象列表分页
    handleCurrentChangeObj (page) {
      this.pageNumObj = page;
      this.getControlObjList();
    },
    // 布控结果列表分页
    handleSizeChangeRes () {

    },
    // 布控结果列表分页
    handleCurrentChangeRes () {

    },
  }
}
</script>
<style lang="scss" scoped>
.control_manage_d{
  width: 100%;
  position: relative;
  .manage_d_box{
    width: calc(100% - 40px);
    // min-height: 783px;
    margin-left: 20px;
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    background: #fff;
    border-radius:4px;
    .manage_d_title{
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      line-height: 50px;
    }
    .manage_d_content{
      padding-left: 20px;
      padding-bottom: 80px;
      border-top: 1px solid #F2F2F2;
      position: relative;
      > ul{
        display: flex;
        flex-wrap: nowrap;
        li{
          width: 28%;
          div{
            margin-top: 15px;
          }
        }
      }
      .manage_d_c_e{
        display: flex;
        flex-wrap: nowrap;
        margin-top: 15px;
        line-height: 20px;
        div:nth-child(2){
          flex: 0 0 58%;
          span{
            color: #0C70F8;
            cursor: pointer;
          }
        }
      }
      .manage_d_c_o{
        margin-right: 20px;
        margin-top: 20px;
        border:1px solid rgba(242,242,242,1);
        border-radius:4px 4px 0px 0px;
        >div:nth-child(1){
          height:44px;
          line-height: 44px;
          padding-left: 20px;
          background:rgba(250,250,250,1);
          border-radius:4px 4px 0px 0px;
        }
        >div:nth-child(2){
          display: flex;
          flex-flow: row wrap;
          align-content: flex-start;
          padding: 0 0.5% 20px 0.5%;
          .manage_d_c_o_i{
            height: 222px;
            border-radius:4px;
            border:1px solid rgba(211,211,211,1);
            flex: 0 0 162px;
            margin: 0 0.5%;
            margin-top: 15px;
            p{
              padding-left: 10px;
              margin-top: 4px;
              i{
                vertical-align: middle;
                margin-bottom: 2px;
              }
            }
            img{
              width: 100%;
              height: 160px;
            }
          }
        }
      }
      .vl_control_state{
        position: absolute;
        right: 0;
        top: 0;
      }
      .manage_d_c_scope{
        width:calc(100% - 20px);
        // height:848px;
        border-radius:4px 4px 0px 0px;
        border:1px solid #f2f2f2;
        margin-top: 20px;
        .manage_d_s_t{
          display: flex;
          justify-content: space-between;
          line-height: 44px;
          padding: 0 15px;
          background:rgba(250,250,250,1);
          cursor: pointer;
          > i{
            vertical-align: middle;
            margin-top: 10px;
            font-size: 18px;
          }
        }
      }
      .manage_d_c_situ{
        width: calc(100% - 20px);
        margin-top: 20px;
        padding-bottom: 1px;
        background:rgba(255,255,255,1);
        box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
        border-radius:4px;
        .situ_title{
          line-height: 44px;
          padding-left: 15px;
          border-bottom: 1px solid #F2F2F2;
        }
        .situ_time{
          line-height: 44px;
          padding-left: 15px;
          display: flex;
          > div{
            width: 20%;
          }
        }
        .situ_box{
          margin: 0 20px 20px 20px;
          border-radius:4px 4px 0px 0px;
          border:1px solid #F2F2F2;
          .situ_top{
            display: flex;
            justify-content: space-between;
            line-height: 44px;
            padding: 0 15px;
            background:rgba(250,250,250,1);
            cursor: pointer;
            i{
              vertical-align: middle;
              margin-top: 10px;
              font-size: 18px;
            }
          }
          .situ_content{
            display: flex;
            flex-wrap: nowrap;
            .situ_left{
              width: 258px;
              border-right: 1px solid #F2F2F2;
              > div{
                width: 100%;
                padding: 0 10px;
                height: 50px;
                line-height: 50px;
              }
              ul{
                margin-top: 10px;
                li{
                  width: 100%;
                  height: 36px;
                  line-height: 36px;
                  display: flex;
                  flex-wrap: nowrap;
                  justify-content: space-between;
                  padding: 0 15px 0 40px;
                  color: #666666;
                  cursor: pointer;
                  i{
                    vertical-align: middle;
                    margin-top: 10px;
                  }
                  &:hover{
                    color: #B2B2B2;
                  }
                  &:active{
                    background:rgba(250,250,250,1);
                    color: #666666;
                  }
                }
              }
            }
            .situ_right{
              width: calc(100% - 258px);
              height: 100%;
              display: flex;
              flex-flow: row wrap;
              align-content: flex-start;
              padding-top: 20px;
              padding-right: 1%;
              .situ_r_video{
                width: 100%;
                flex: 0 0 49%;
                position: relative;
                overflow: hidden;
                margin-bottom: 20px;
                margin-left: 1%;
              }
            }
          }
         
        }
      }
      .manage_d_c_result{
        height: 100%;
        margin: 20px 20px 20px 0;
        background:rgba(255,255,255,1);
        box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
        border-radius:4px;
        .result_title{
          line-height: 44px;
          padding: 0 15px;
          border-bottom: 1px solid #F2F2F2;
          display: flex;
          justify-content: space-between;
          > div:nth-child(2){
            display: flex;
            .el-input{
              margin-left: 50px;
            }
          }
        }
        .result_content{
          width: 100%;
          height: 100%;
          > div:nth-child(1){
            width: 100%;
            height: 100%;
            display: flex;
            flex-flow: row wrap;
            align-content: flex-start;
            padding-top: 20px;
            padding-right: 1%;
            .result_img_box{
              flex: 0 0 24%;
              height: 100%;
              margin-left: 1%;
              margin-bottom: 20px;
              position: relative;
              overflow: hidden;
              background:rgba(255,255,255,1);
              border-radius:4px;
              border:1px solid rgba(211,211,211,1);
              img{
                width: 100%;
              }
              .result_tool{
                width: 100%;
                height: 36px;
                line-height: 36px;
                background: rgba(0,0,0,.4);
                display: flex;
                justify-content: space-between;
                padding-left: 15px;
                position: absolute;
                bottom: 58px;
                left: 0;
                > div{
                  color: #fff;
                }
                i{
                  margin-top: 6px;
                  margin-right: 10px;
                  cursor: pointer;
                }
              }
              > div:nth-child(3){
                p{
                  margin-top: 8px;
                  padding-left: 10px;
                  i{
                    vertical-align: middle;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .manage_f_box{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height:60px;
    line-height: 60px;
    padding: 0 20px;
    background:rgba(255,255,255,1);
    box-shadow:0px -1px 2px 0px rgba(0,0,0,0.03);
    .el-button{
      width: 100px;
      height: 40px;
    }
  }
  .event_detail_dialog{
    .detail_list{
      line-height: 30px;
    }
    .detail_list:nth-child(1){
      display: flex;
      justify-content: flex-start;
      > div{
        width: 33%;
        > div{
          line-height: 30px;
        }
      }
    }
    .detail_list:nth-child(4){
      display: flex;
      > span:nth-child(2){
        flex: 1;
        line-height: 20px;
        margin-top: 5px;
      }
    }
    .detail_img_box{
      width: 64%;
      height: 274px;
      padding: 20px 0 0 70px;
      display: flex;
      flex-flow: row wrap;
      align-content: flex-start;
      img{
        flex: 0 0 117px;
        margin-right: 20px;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
<style lang="scss">
.control_manage_d{
  .situ_right{
    .situ_r_video{
      .situ_r_img{
          width: 100%;
          height: 200px;
        > div{
          width: 100%;
          height: 100%;
          background: #e6e6e6;
        }
      }
      > div {
        width: 100%;
        video{
          width: 100%;
        }
        > div{
          width: 100%;
          height: 44px;
          padding-right: 10px;
          position: absolute;
          left: 0;
          bottom: 4px;
          background: rgba(0,0,0,.4);
          opacity: .4;
          text-align: right;
          i{
            margin-right: 15px;
            margin-top: 10px;
            cursor: pointer;
            &:last-child{
              margin-right: 0;
            }
          }
        }
        > .vl_icon_control_13{
          position: absolute;
          right: 8px;
          top: 8px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
