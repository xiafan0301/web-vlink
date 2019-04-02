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
            <div><span class="vl_f_666">布控类型：</span><span class="vl_f_333">{{controlDetail.surveillanceType}}</span></div>
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
          <div class="vl_f_333" style="padding-right: 120px;">{{controlDetail.eventDetail}}<span @click="getEventDetail">详情</span></div>
        </div>
        <div class="manage_d_c_o">
          <div><span class="vl_f_333">布控对象</span><span class="vl_f_333">（{{controlDetail.objectNum}}个）</span></div>
          <div>
            <div class="manage_d_c_o_i" v-for="item in controlDetail.objectList" :key="item.id">
              <img :src="item.photoUrl" alt="" v-if="item.photoUrl">
              <div v-else class="manage_not_img">
                <i class="vl_icon vl_icon_control_33"></i>
                <p>暂无相关图片</p>
              </div>
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
                <div class="manage_b" style="margin-top: 0;">
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
                                <li :key="equ.uid"><span>{{equ.deviceName}}</span><i class="vl_icon vl_icon_control_05"></i></li>
                              </template>
                            </ul>
                            <ul v-if="type === '1' && trackPoint.bayonetList && trackPoint.bayonetList.length > 0" style="max-height: 280px;">
                              <template v-for="equ in trackPoint.bayonetList">
                                <li :key="equ.uid"><span>{{equ.bayonetName}}</span><i class="vl_icon vl_icon_control_05"></i></li>
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
                            v-if="item.surveillanceIds"
                            :key="item.uid"
                            @dragstart="dragstart($event, index, item)"
                            @dragover="dragover"
                            :draggable="true"
                          >
                            <span>{{item.deviceName}}</span><i class="vl_icon vl_icon_control_05"></i>
                          </li>
                        </template>
                      </ul>
                    </vue-scroll>
                  </div>
                <div class="situ_right">
                  <div class="situ_r_video" v-for="(item, index) in rightVideoList" :key="item.uid"
                    @dragend="dragend"
                    @dragenter="dragenter"
                    @dragleave="dragleave"
                    @dragover="dragover"
                    @drop="drop($event, index)"
                    >
                    <div class="situ_r_img" v-if="!item.isShowVideo">
                      <div>从左边点击或拖拽设备播放</div>
                    </div>
                    <div v-else is="rtmpplayer" @playerClose="playerClose" :index="index" :oData="item" :signAble="true"></div>
                  </div>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </div>
        <!-- 布控结果 -->
        <div class="manage_d_c_result" v-if="controlState !== '0'">
          <div class="result_title">
            <div>布控结果（{{controlResList && controlResList.list && controlResList.list.length}}个）</div>
            <div>
              <el-date-picker
                style="width: 230px;margin: 6px 10px 0 0;"
                @change="getAlarmSnap"
                placeholder="请选择起止时间"
                v-model="controlTimeIsKey"
                type="daterange"
                size="small"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
              <el-select
                v-model="devNameIsKey"
                filterable
                remote
                reserve-keyword
                placeholder="请输入设备名搜索"
                size="small"
                @change="getAlarmSnap"
                :remote-method="getControlDevice"
                :loading="loading">
                <el-option
                  v-for="item in devListIsKey"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="result_content" v-if="controlResList">
            <div>
              <div class="result_img_box" v-for="(item, index) in controlResList.list" :key="index">
                <div @mouseenter="item.curVideoTool = true;" @mouseleave="item.curVideoTool = false;">
                  <video :id='"controlResult" + index' src="../../../../../assets/video/video.mp4" width="100%" @click="showLargeVideo(item)"></video>
                  <div class="result_tool" v-show="item.curVideoTool">
                    <div>{{item.deviceName}}</div>
                    <div>
                      <i class="vl_icon vl_icon_judge_01" v-if="item.curVideoPlay" @click="pauseVideo(item, index)"></i>
                      <i class="vl_icon vl_icon_control_09" v-else @click="playVideo(item, index)"></i>
                    </div>
                  </div>
                </div>
                <div>
                  <p><i class="vl_icon vl_icon_control_26" style="margin-top: -4px;"></i><span class="vl_f_333">{{item.featureName}}</span></p>
                  <p><i class="vl_icon vl_icon_control_27" style="margin-top: -4px;"></i><span class="vl_f_999">{{item.snapTime}}</span></p>
                </div>
              </div>
            </div>
            <el-pagination
              style="align-self: flex-start;"
              @size-change="handleSizeChangeRes"
              @current-change="handleCurrentChangeRes"
              :current-page="currentPage"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="controlResList.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="controlResList.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 0; height: 0;" v-show="showLarge" :class="{vl_j_fullscreen: showLarge}">
      <video id="controlResultLarge" src="../../../../../assets/video/video.mp4"></video>
      <div @click="closeLargeVideo" class="close_btn el-icon-error"></div>
      <div class="control_bottom">
        <div>{{videoObj.deviceName}}</div>
        <div>
          <span @click="pauseLargeVideo" class="vl_icon vl_icon_judge_01" v-if="largeVideoPlay"></span>
          <span @click="playLargeVideo" class="vl_icon vl_icon_control_09" v-else></span>
          <span><a download="视频" href="../../../../../assets/video/video.mp4" class="el-icon-download"></a></span>
          <span @click="cutScreen" class="vl_icon vl_icon_control_07"></span>
        </div>
      </div>
    </div>
    <div style="width: 0; height: 0;" v-show="showCut"  :class="{vl_j_cutscreen: showCut}">
      <img :src="demoImg" alt="">
      <i @click="showCut = false" class="close_btn el-icon-error"></i>
      <a download="截图" :href="demoImg" id="controlResultCutImg" ></a>
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
    <div class="event_detail_dialog" v-if="eventDetail">
      <el-dialog
        :visible.sync="eventDetailDialog"
        :close-on-click-modal="false"
        width="800px"
        title="事件详情"
        top="20vh">
        <div class="detail_list">
          <div>
            <div><span class="vl_f_666">事件编号：</span><span class="vl_f_333">{{eventDetail.eventCode}}</span></div>
            <div style="padding-left: 14px;"><span class="vl_f_666">报案人：</span><span class="vl_f_333">{{eventDetail.dealOrgId}}</span></div>
          </div>
          <div>
            <div><span class="vl_f_666">事件状态：</span><span class="vl_f_333">{{eventDetail.eventStatus}}</span></div>
            <div><span class="vl_f_666">报案时间：</span><span class="vl_f_333">{{eventDetail.reportTime}}</span></div>
          </div>
          <div>
            <div><span class="vl_f_666">事件类型：</span><span class="vl_f_333">{{eventDetail.eventType}}</span></div>
            <div><span class="vl_f_666">事件等级：</span><span class="vl_f_333">{{eventDetail.eventLevel}}</span></div>
          </div>
        </div>
        <div class="detail_list">
          <span class="vl_f_666">人员伤亡：</span><span class="vl_f_333">{{eventDetail.casualties === -1 ? '不确定' : eventDetail.casualties === 0 ? '无' : eventDetail.casualties > 0 ? eventDetail.casualties : ''}}</span>
        </div>
        <div class="detail_list">
          <span class="vl_f_666">事发地点：</span><span class="vl_f_333">{{eventDetail.eventAddress}}</span>
        </div>
        <div class="detail_list">
          <span class="vl_f_666">事件情况：</span><span class="vl_f_333">{{eventDetail.eventDetail}}</span>
        </div>
        <vue-scroll>
          <div class="detail_img_box">
            <img :src="item.path !== 'string' ? item.path : '//via.placeholder.com/117x117'" alt="" v-for="item in eventDetail.closeAttachmentList" :key="item.id">
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
import {conDetail} from '../testData.js';
import rtmpplayer from '@/components/common/rtmpplayer.vue';
import {getControlDetail, getControlObjList, controlArea, getControlMap, getControlDevice, getAlarmSnap, getEventDetail} from '@/views/index/api/api.js';
export default {
  components: {delDialog, stopDialog, rtmpplayer},
  props: ['state', 'controlId'],
  data () {
    return {
      controlState: null,//布控详情状态
      controlDetail: conDetail,//布控详情
      eventDetail: null,//事件详情
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
      situList: [],
      // rVList: [{},{},{},{}],//用于操作的右边视频列表
      rightVideoList: [
        {isShowVideo: false}, 
        {isShowVideo: false}, 
        {isShowVideo: false}, 
        {isShowVideo: false}
      ],//右边已拖过去的视频,默认展示4个
      dragstartIndex: null,//左边列表下标
      eventDetailDialog: false,//事件详情弹窗
      lastIndex: null,
      dragActiveObj: null,
      // 布控结果筛选参数
      controlTimeIsKey: null,//布控时间
      devListIsKey: null,//设备列表
      devNameIsKey: null,//设备名称
      // 布控结果视频参数
      loading: false,
      controlResList: null,//布控抓拍结果列表
      showLarge: false,
      showCut: false,
      demoImg: null,
      largeVideoPlay: false,
      videoObj: {},
      curVideoUrl: null,
    }
  },
  created () {
    this.$nextTick(() => {
      this.controlState = this.state;
    })
  },
  mounted () {
    this.resetMap();
    this.getControlDetail();
    this.getControlMap();
    this.getAlarmSnap();
  },
  methods: {
    /* ************布控结果********* */
    // 停止播放
    pauseVideo (item, index) {
      item.curVideoPlay = false;
      document.getElementById('controlResult' + index).pause();
    } ,
    // 开始播放
    playVideo (item, index) {
      item.curVideoPlay = true;
      document.getElementById('controlResult' + index).play();
    },
    // 显示大屏
    showLargeVideo (item) {
      this.videoObj = item;
      this.showLarge = true;
      this.playLargeVideo();
    },
    // 关闭大屏
    closeLargeVideo () {
      this.showLarge = false;
      this.pauseLargeVideo();
    },
    // 大屏播放
    playLargeVideo () {
      this.largeVideoPlay = true;
      document.getElementById('controlResultLarge').play();
    },
    // 停止大屏播放
    pauseLargeVideo () {
      this.largeVideoPlay = false;
      document.getElementById('controlResultLarge').pause();
    },
    // 截屏
    cutScreen () {
      this.showCut = true;
      let _canvas = document.createElement('canvas');
      _canvas.setAttribute('width', document.documentElement.clientWidth);
      _canvas.setAttribute('height', document.documentElement.clientHeight);
      let cxt = _canvas.getContext('2d');
      cxt.drawImage(document.getElementById('controlResultLarge'), 0, 0, _canvas.width, _canvas.height);
      this.demoImg = _canvas.toDataURL();
      setTimeout(() => {
        document.getElementById('controlResultCutImg').click();
      }, 200)
    },
    skip (type) {
      this.$emit('changePageType', type);
    },
    // 跳转至新建布控页-复用
    skipIsCreate () {
      this.$router.push({ name: 'control_create', query: {controlId: this.controlId, createType: 3} });
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
    // 获取布控详情
    getControlDetail () {
      getControlDetail(this.controlId).then(res => {
        if (res && res.data) {
          this.controlDetail = res.data;
        }
      })
    },
    // 获取事件详情
    getEventDetail () {
      this.eventDetailDialog = true;
      getEventDetail(1).then(res => {
        if (res && res.data) {
          this.eventDetail = res.data;
        }
      })
    },
    // 获取布控范围
    controlArea () {
      this.dpType = '布控范围';
      controlArea(this.controlId).then(res => {
        if (res && res.data) {
          this.devNum = res.data.devNum;
          this.bayonetNum = res.data.bayonetNum;
          this.trackPointList = res.data.trackingPointList;
          this.trackPointList && this.trackPointList.map(f => {
            this.$set(f, 'isDropdown', false);
          });
          this.mapMark();
        }
        
      })
    },
    // 切换设备类型获得设备列表数据
    getEquList (type, data) {
      this.type = type;
      this.devId = data.uid;
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
    // 获取实时监控的布控设备
    getControlMap() {
      const params = {
        deviceType: null,//设备类型
        surveillanceStatus: null,//布控状态
        alarmLevel: null,//告警级别
        surveillanceDateStart: null,//布控开始时间
        surveillanceDateEnd: null,//布控结束时间
        surveillanceName: null,//布控名称
        eventId: null,//事件Id
        surveillanceObjectId: null//布控对象id
      }
      getControlMap(params).then(res => {
        if (res && res.data) {
          let data = [];
          res.data.forEach(f => {
            f.devList.forEach(d => {
              data.push(d);
            })
          })
          this.situList = data;
        }
      })
    },
    // 获取所有布控设备
    getControlDevice () {
      const params = {
        name: this.devNameIsKey
      }
      getControlDevice(params).then(res => {
        if (res && res.data) {
          this.devListIsKey = res.data.map(m => {
            return {
              value: m.uid,
              label: m.name
            }
          });
        }
      })
    },
    // 获取布控抓拍结果列表
    getAlarmSnap () {
      const params = {
        pageNum: this.pageNumObjRes,
        pageSzie: this.pageSzieRes,
        'where.surveillanceId': this.controlId,
        'where.dateStart': this.controlTimeIsKey && this.controlTimeIsKey[0],
        'where.dateEnd': this.controlTimeIsKey && this.controlTimeIsKey[1],
        'where.deviceName': this.devNameIsKey
      }
      getAlarmSnap(params).then(res => {
        if (res && res.data) {
          this.controlResList = res.data;
          this.controlResList.list.forEach(f => {
            this.$set(f, 'curVideoPlay', false);
            this.$set(f, 'curVideoTool', false);
          })
        }
      })
    },
    // 布控结果列表分页
    handleSizeChangeRes (size) {
      this.pageSzieRes = size;
      this.getAlarmSnap();
    },
    // 布控结果列表分页
    handleCurrentChangeRes (page) {
      this.pageNumObjRes = page;
      this.getAlarmSnap();
    },
    /* ************运行情况********* */
    // 关闭播放器
    playerClose (index, sid) {
      console.log('sid', sid);
      this.rightVideoList.splice(index, 1, {isShowVideo: false});

      // let _div = document.createElement('div');
      // _div.className = 'situ_r_img';
      // _div.innerHTML = '<div></div>'
      // e.target.parentNode.parentNode.replaceChild( _div, e.target.parentNode);
      // let _video = this.rVList.splice(index, 1, {})[0];
      // let _index = _video.index;
      // this.situList.splice(_index, 1, _video);
    },
    // 拖拽
    dragstart (e, index, item) {
      // 使其半透明
      // e.target.style.opacity = .5;
      this.dragstartIndex = index;
      console.log(this.dragstartIndex, 'dragstartIndex')

      this.dragActiveObj = item;
    },
  
    dragend (e) {
      // 重置透明度
      // e.target.style.opacity = "";

      this.dragActiveObj = null;
    },
    dragenter (e) {
      // 当可拖动的元素进入可放置的目标高亮目标节点
      if ( e.target.parentNode.parentNode.className == "situ_r_video" ) {
          // e.target.style.background = "#E0F3FF";
      }
    },
    dragleave (e) {
      // 当拖动元素离开可放置目标节点，重置其背景
      if ( e.target.parentNode.parentNode.className == "situ_r_video" ) {
          // e.target.style.background = "";
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
      console.log(this.rightVideoList, 'rightVideoList')
      if (this.dragActiveObj) {
        // let deviceSip = Math.random() > 0.5 ? 'rtmp://live.hkstv.hk.lxdns.com/live/hks1' : 'rtmp://10.16.1.139/live/livestream';
        let deviceSip = 'rtmp://live.hkstv.hk.lxdns.com/live/hks1';
        console.log('deviceSip', deviceSip);
        this.rightVideoList.splice(index, 1, {
          isShowVideo: true,
          title: this.dragActiveObj.deviceName,
          video: Object.assign({}, this.dragActiveObj, {
            deviceSip: deviceSip
          })
        });
      }
      // 移动拖动的元素到所选择的放置目标节点
      // console.log(e.target)
      // if ( e.target.parentNode.parentNode.className === "situ_r_video" ) {
      //     e.target.style.background = "";
      //     let sid = this.situList[this.dragstartIndex].uid;
      //     let div = document.createElement('div');
      //     let video = `<video src="${require('../../../../../assets/video/video.mp4')}" autoplay loop controls></video>
      //       <div>
      //         <i class="vl_icon vl_icon_control_06"></i>
      //         <i class="vl_icon vl_icon_control_11"></i>
      //         <i class="vl_icon vl_icon_control_07"></i>
      //       </div>
      //       <i class="vl_icon vl_icon_control_13" id="${sid}"></i>
      //     `;
      //     div.innerHTML = video;
      //     e.target.parentNode.parentNode.replaceChild( div, e.target.parentNode);
      //     // 从左往右边拖拽逻辑
      //     const rVList = [{},{},{},{}]
      //     let delVideo = this.situList.splice(this.dragstartIndex, 1, {});
      //     delVideo[0]['index'] = this.dragstartIndex;
      //     if (rVList[index].uid) {
      //       let _video = rVList.splice(index, 1)[0];
      //       let _index = _video.index;
      //       this.situList.splice(_index, 1 , _video);
      //       rVList.splice(index, 1, {});
      //     } else {
      //       rVList.splice(index, 1, ...delVideo);
      //     }
      //     console.log(delVideo) 
      //     // 防止重复绑定点击事件，先解绑
      //     $(`.situ_right > :nth-child(${index + 1})`).unbind('click');
      //     // 利用事件冒泡,绑定关闭按钮的点击事件，关闭后，从右边回到左边列表
      //     let _this = this;
      //     $(`.situ_right > :nth-child(${index + 1})`).on('click', '#' + sid, function (e) {
      //       let _div = document.createElement('div');
      //       _div.className = 'situ_r_img';
      //       _div.innerHTML = '<div></div>'
      //       e.target.parentNode.parentNode.replaceChild( _div, e.target.parentNode);
      //       let _video = rVList.splice(index, 1, {})[0];
      //       let _index = _video.index;
            
      //       _this.situList.splice(_index, 1, _video);
      //     })
      // }
    },
    
    
    mapMark () {
      let _this = this, hoverWindow = null, data = null;
      if (!_this.trackPointList) {
        return false;
      }
      // 组装右边点标记数据
      let devList = [];
      _this.trackPointList.forEach(f => {
        if (f.devList && f.devList.length > 0) {
          devList = [...devList, ...f.devList];
        }
      })
      devList.forEach(f => f.type = 1);//设置属性type:1为摄像头，2为卡口
      let bayonetList = [];
      _this.trackPointList.forEach(f => {
        if (f.bayonetList && f.bayonetList.length > 0) {
          bayonetList = [...bayonetList, ...f.bayonetList];
        }
      })
      bayonetList.forEach(f => f.type = 2);//设置属性type:1为摄像头，2为卡口
      data = [...devList, ...bayonetList];
      console.log(data, 'data')
      _this.map.clearMap();
      for (let i = 0; i < data.length; i++) {
        let obj = data[i];
        if (obj.longitude > 0 && obj.latitude > 0) {
          let offSet = [-20.5, -48];
          let _content = null;
          if (obj.type === 1) {
            // if (obj.isNormal && obj.isSelected) {
            //   _content = '<div id="' + obj.uid + '" class="vl_icon vl_icon_sxt"></div>';
            // } else if (obj.isNormal && !obj.isSelected) {
            //   _content = '<div id="' + obj.uid + '" class="vl_icon vl_icon_sxt_uncheck"></div>';
            // } else if (!obj.isNormal) {
            //   _content = '<div id="' + obj.uid + '" class="vl_icon vl_icon_sxt_not_choose"></div>';
            // }
             _content = '<div id="' + obj.uid + '" class="vl_icon vl_icon_sxt"></div>';
          } else {
            // if (obj.isNormal && obj.isSelected) {
              _content = '<div id="' + obj.uid + '" class="vl_icon vl_icon_kk"></div>';
            // } else if (obj.isNormal && !obj.isSelected) {
              // _content = '<div id="' + obj.uid + '" class="vl_icon vl_icon_kk_uncheck"></div>';
            // } else if (!obj.isNormal) {
              // _content = '';
            // }
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
          marker.on('click', function () {
            let sContent = '<div class="vl_map_hover">' +
              '<div class="vl_map_hover_main"><ul>' + 
                '<li><span>设备名称：</span>' + obj.deviceName + '</li>' + 
                '<li><span>设备地址：</span>' + obj.address + '</li>' + 
              '</ul></div>';
            hoverWindow = new window.AMap.InfoWindow({
              isCustom: true,
              closeWhenClickMap: true,
              offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
              content: sContent
            });
            hoverWindow.open(_this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
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
    }
  }
}
</script>
<style lang="scss" scoped>
.control_manage_d{
  width: 100%;
  min-height: 100%;
  position: absolute;
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
      padding-bottom: 20px;
      margin-bottom: 80px;
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
            > p{
              padding-left: 10px;
              margin-top: 4px;
              i{
                vertical-align: middle;
                margin-bottom: 2px;
              }
            }
            > img{
              width: 100%;
              height: 160px;
            }
            .manage_not_img{
              width: 100%;
              height: 160px;
              padding-top: 50px;
              border-radius: 4px 4px 0 0;
              text-align: center;
              background: #E6E6E6;
              font-size: 16px;
              color: #999;
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
              min-width: 258px;
              height: 600px;
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
                  cursor: move;
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
              display: flex;
              flex-flow: row wrap;
              align-content: flex-start;
              padding-top: 20px;
              padding-right: 1%;
              .situ_r_video{
                flex: 0 0 49%;
                height: 49%;
                position: relative;
                overflow: hidden;
                margin-bottom: 20px;
                margin-left: 1%;
                .situ_r_img{
                  width: 100%;
                  height: 100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background: #e6e6e6;
                }
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
                bottom: 52px;
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
              > div:nth-child(1){
                cursor: pointer;
              }
              > div:nth-child(2){
                p{
                  padding-left: 10px;
                  line-height: 24px;
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
      > div {
        width: 100%;
        video{
          width: 100%;
        }
      }
    }
  }
}
</style>
