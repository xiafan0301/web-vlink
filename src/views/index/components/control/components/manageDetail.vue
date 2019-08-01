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
          <li style="width: 34%;">
            <div><span class="vl_f_666">布控名称：</span><span class="vl_f_333">{{controlDetail.surveillanceName}}</span></div>
            <div v-if="controlDetail.surveillanceType === '短期布控'"><span class="vl_f_666">布控日期：</span><span class="vl_f_333">{{controlDetail.surveillanceDateStart}} 至 {{controlDetail.surveillanceDateEnd}}</span></div>
            <div v-else class="control_time"><span class="vl_f_666">布控时间：</span><span class="vl_f_333">{{controlDetail.time}}</span></div>
          </li>
          <li style="width: 34%;">
            <div><span class="vl_f_666">告警级别：</span><span class="vl_f_333">{{controlDetail.alarmLevel}}</span></div>
            <div v-if="controlDetail.surveillanceType === '短期布控'" class="control_time"><span class="vl_f_666">布控时间：</span><span class="vl_f_333">{{controlDetail.time}}</span></div>
          </li>
        </ul>
        <div class="manage_d_c_e" v-if="controlDetail.eventDetail">
          <div class="vl_f_666">事件内容：</div>
          <div class="vl_f_333">{{controlDetail.eventDetail}}<span @click="getEventDetail">详情</span></div>
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
              <p><i class="vl_icon vl_icon_control_40"></i><span class="vl_f_333">{{item.name}}</span></p>
            </div>
          </div>
          <el-pagination
            class="cum_pagination"
            style="align-self: flex-start;"
            @current-change="handleCurrentChangeObj"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="18"
            layout="total, prev, pager, next, jumper"
            :total="controlDetail.objectNum">
          </el-pagination>
        </div>
        <div :class="['vl_icon con_state', controlState === 2 ? 'vl_control_s' : controlState === 1 ? 'vl_control_o' : 'vl_control_e']"></div>
        <!-- 布控范围 -->
        <div class="manage_d_c_scope">
          <div class="manage_d_s_t" @click="controlArea(1)">
            <div>布控范围</div>
            <i class="el-icon-arrow-up" v-show="dpOne"></i>
            <i class="el-icon-arrow-down" v-show="!dpOne"></i>
          </div>
          <el-collapse-transition>
            <div class="manage_d_s_m" v-show="dpOne">
              <div id="mapBox"></div>
              <div class="manage_d_s_m_l">
                <div class="manage_b" style="margin-top: 0;">
                  <div class="vl_f_333 top">布控设备</div>
                  <div class="dp_box">
                    <div v-for="trackPoint in trackPointList" :key="trackPoint.uid">
                      <div class="track_t" @click="dropdown(trackPoint)" :class="{'active': trackPoint.isDropdown}">
                        <i class="el-icon-arrow-down" v-show="trackPoint.isDropdown"></i><i class="el-icon-arrow-right" v-show="!trackPoint.isDropdown"></i><span>{{trackPoint.address}}</span>
                      </div>
                      <el-collapse-transition>
                        <div v-show="trackPoint.isDropdown">
                          <div class="equ_m">
                            <div @click="getEquList('0', trackPoint)" :class="{'active': trackPointId === trackPoint.uid && tabTypeByScope === '0'}">摄像头（{{trackPoint.devList ? trackPoint.devList.length : 0}}）</div>
                            <div @click="getEquList('1', trackPoint)" :class="{'active': trackPointId === trackPoint.uid && tabTypeByScope === '1'}">卡口（{{trackPoint.bayonetList ? trackPoint.bayonetList.length : 0}}）</div>
                          </div>
                          <vue-scroll>
                            <!-- 摄像头 -->
                            <ul v-if="tabTypeByScope === '0' && trackPoint.devList && trackPoint.devList.length > 0" style="max-height: 280px;">
                              <template v-for="equ in trackPoint.devList">
                                <li @click="selDev(equ)" class="highlight" :class="{'active': devIdOrBayId === equ.uid}" :key="equ.uid"><span :title="equ.deviceName">{{equ.deviceName | strCutWithLen(25)}}</span><i class="vl_icon vl_icon_control_05"></i></li>
                              </template>
                            </ul>
                            <ul v-if="tabTypeByScope === '0' && (!trackPoint.devList || trackPoint.devList.length === 0)">
                              <li>范围内无设备</li>
                            </ul>
                            <!-- 卡口 -->
                            <ul v-if="tabTypeByScope === '1' && trackPoint.bayonetList && trackPoint.bayonetList.length > 0" style="max-height: 280px;" class="bayonet_list">
                              <li v-for="bayonet in trackPoint.bayonetList" :key="bayonet.uid + bayonet.bayonetName" style="padding: 0;">
                                <div class="bayone_name highlight"  @click="dropdownBayonet(trackPoint, bayonet)" :class="{'active': bayonet.isDropdown || devIdOrBayId === bayonet.uid}" style="padding: 10px 34px;">
                                  <i class="el-icon-arrow-down" v-show="bayonet.isDropdown"></i><i class="el-icon-arrow-right" v-show="!bayonet.isDropdown"></i><span :title="bayonet.bayonetName">{{bayonet.bayonetName | strCutWithLen(25)}}</span>
                                </div>
                                <el-collapse-transition>
                                  <ul v-if="bayonet.isDropdown && bayonet.devList.length > 0">
                                    <template v-for="(equ, index) in bayonet.devList">
                                      <li :key="equ.uid + equ.deviceName + index">
                                        <span style="color: #999;">{{equ.deviceName}}</span><i class="vl_icon vl_icon_control_05" style="color: #999;"></i>
                                      </li>
                                    </template>
                                  </ul>
                                  <ul v-if="bayonet.isDropdown && (!bayonet.devList || bayonet.devList.length === 0)">
                                    <li>范围内无设备</li>
                                  </ul>
                                </el-collapse-transition>
                              </li>
                            </ul>
                            <ul v-if="tabTypeByScope === '1' && (!trackPoint.bayonetList || trackPoint.bayonetList.length === 0)">
                              <li>范围内无卡口</li>
                            </ul>
                          </vue-scroll>
                        </div>
                      </el-collapse-transition>
                    </div>
                  </div>
                </div>
              </div>
              <div class="manage_d_s_m_r">
                <div class="top"><i class="vl_icon vl_icon_control_23" @click="resetZoom"></i></div>
                <ul class="bottom">
                  <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
                  <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
                </ul>
              </div>
            </div>
          </el-collapse-transition>
        </div>
        <!-- 运行情况 -->
        <div class="manage_d_c_situ" v-if="controlState !== 2">
          <div class="situ_title">运行情况</div>
          <div class="situ_time">
            <div><span>开始时间：</span><span>{{controlDetail.runningStartTime}}</span></div>
            <div v-if="controlState === 3"><span>结束时间：</span><span>{{controlDetail.runningEndTime}}</span></div>
            <div><span>持续时间：</span><span>{{controlDetail.duration}}</span></div>
            <div v-if="controlDetail.terminationReason" class="termination_reason"><span>终止原因：</span><span>{{controlDetail.terminationReason}}</span></div>
          </div>
          <div class="situ_box" v-if="controlState === 1">
            <div class="situ_top" @click="controlArea(2)">
              <div>实时监控</div>
              <i class="el-icon-arrow-down" v-show="!dpTwo"></i>
              <i class="el-icon-arrow-up" v-show="dpTwo"></i>
            </div>
            <el-collapse-transition>
              <div class="situ_content" v-show="dpTwo">
                  <div class="situ_left">
                    <div style="padding-left: 20px;">布控设备</div>
                    <div class="equ_m">
                      <div @click="tabTypeBySituation = '0'" :class="{'active': tabTypeBySituation === '0'}">摄像头（{{devNum}}）</div>
                      <div @click="tabTypeBySituation = '1'" :class="{'active': tabTypeBySituation === '1'}">卡口（{{bayonetNum}}）</div>
                    </div>
                    <!-- 摄像头 -->
                    <el-collapse-transition>
                      <ul v-if="tabTypeBySituation === '0' && situList.length > 0">
                        <vue-scroll>
                          <li
                            v-for="(item, index) in situList"
                            :key="item.uid"
                            @dragstart="dragstart($event, index, item)"
                            @dragover="dragover"
                            :draggable="true"
                          >
                            <span :title="item.deviceName">{{item.deviceName | strCutWithLen(25)}}</span><i class="vl_icon vl_icon_control_05"></i>
                          </li>
                        </vue-scroll>
                      </ul>
                      <ul v-if="tabTypeBySituation === '0' && situList.length === 0">
                        <li>范围内无设备</li>
                      </ul>
                    </el-collapse-transition>
                    <!-- 卡口 -->
                    <el-collapse-transition>
                      <div v-if="tabTypeBySituation === '1' && bayList.length > 0" class="bayone_list">
                        <vue-scroll>
                          <div v-for="bay in bayList" :key="bay.uid">
                            <div class="bayone_name" :class="{'active': bay.isDropdown}" @click="dropdownBay(bay)">
                              <i class="el-icon-arrow-down" v-show="bay.isDropdown"></i><i class="el-icon-arrow-right" v-show="!bay.isDropdown"></i><span :title="bay.bayonetName">{{bay.bayonetName | strCutWithLen(25)}}</span>
                            </div>
                            <el-collapse-transition>
                              <ul style="max-height: 346px;" v-show="bay.isDropdown && bay.devList.length > 0">
                                <li
                                  v-for="(dev, index) in bay.devList"
                                  :key="dev.uid"
                                  @dragstart="dragstart($event, index, dev)"
                                  @dragover="dragover"
                                  :draggable="true"
                                >
                                  <span :title="dev.deviceName">{{dev.deviceName | strCutWithLen(25)}}</span><i class="vl_icon vl_icon_control_05"></i>
                                </li>
                              </ul>
                              <ul v-show="bay.devList.length === 0">
                                <li>卡口内无设备</li>
                              </ul>
                            </el-collapse-transition>
                          </div>
                        </vue-scroll>
                      </div>
                      <div v-if="tabTypeBySituation === '1' && bayList.length === 0" class="bayone_list">
                        <ul>
                          <li>范围内无卡口</li>
                        </ul>
                      </div>
                    </el-collapse-transition>
                  </div>
                <div class="situ_right">
                  <div class="situ_r_video" v-for="(item, index) in rightVideoList" :key="item.uid"
                    @dragend="dragend"
                    @dragover="dragover"
                    @drop="drop($event, index)"
                    >
                    <div class="situ_r_box" v-if="!item.isShowVideo">
                      <img src="../../../../../assets/img/video/vi_101.png" alt="">
                      <div>拖拽设备列表图标至此</div>
                    </div>
                    <div v-if="item.isShowVideo" is="flvplayer" @playerClose="playerClose" :index="index" :oData="item" :bResize="bResize"
                      :oConfig="{sign: true}">
                    </div>
                  </div>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </div>
        <!-- 布控结果 -->
        <div class="manage_d_c_result" v-if="controlState !== 2 ">
          <div class="result_title">
            <div>布控结果（{{controlResList && controlResList.total}}个）</div>
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
                class="select_box"
                value-key="value"
                v-model="devNameIsKey"
                filterable
                remote
                placeholder="请输入设备名搜索"
                size="small"
                clearable
                @clear="devListIsKey = []"
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
                  <img :src="item.path" alt="" v-show="!item.isShowCurImg" @click="openBigImg(index, controlResList.list)">
                  <video  v-show="item.isShowCurImg" :id='"controlResult" + index' :src="item.snapVideo" style="object-fit: fill;" width="100%" height="239px" @click="showLargeVideo(item, 1)"></video>
                  <div class="result_tool" v-show="item.curVideoTool">
                    <div>{{item.deviceName}}</div>
                    <div>
                      <i class="vl_icon vl_icon_judge_01" v-if="item.curVideoPlay" @click="pauseVideo(item, index)"></i>
                      <i class="vl_icon vl_icon_control_09" v-else @click="playVideo(item, index)"></i>
                      <a download="视频" :href="item.snapVideo" class="el-icon-download download"></a>
                    </div>
                  </div>
                </div>
                <div>
                  <p><i class="vl_icon vl_icon_control_26" style="margin-top: -4px;"></i><span class="vl_f_333">疑似目标：{{item.objName}}</span></p>
                  <p><i class="vl_icon vl_icon_control_27" style="margin-top: -4px;"></i><span class="vl_f_999">{{item.snapTime}}</span></p>
                </div>
              </div>
            </div>
            <el-pagination
              class="cum_pagination"
              style="align-self: flex-start;"
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
      <video id="controlResultLarge" style="object-fit: fill;" :src="videoObj.snapVideo"></video>
      <div @click="closeLargeVideo" class="close_btn el-icon-error"></div>
      <div class="control_bottom">
        <div>{{videoObj.deviceName}}</div>
        <div>
          <span @click="pauseLargeVideo" class="vl_icon vl_icon_judge_01" v-if="largeVideoPlay"></span>
          <span @click="playLargeVideo" class="vl_icon vl_icon_control_09" v-else></span>
          <span><a download="视频" :href="videoObj.snapVideo" class="el-icon-download"></a></span>
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
    <div class="manage_f_box" v-if="controlState === 2">
      <el-button class="btn_100" type="primary" @click="skip(3)">编辑</el-button>
      <el-button class="btn_100" @click="showDialog('delDialog')">删除</el-button>
    </div>
    <!-- 进行中 -->
    <div class="manage_f_box" v-if="controlState === 1">
      <el-button class="btn_100" type="primary" @click="showDialog('stopDialog')">终止</el-button>
    </div>
    <!-- 已结束 -->
    <div class="manage_f_box" v-if="controlState === 3">
      <el-button class="btn_100" type="primary" @click="skipIsCreate">复用</el-button>
      <el-button class="btn_100" @click="showDialog('delDialog')">删除</el-button>
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
            <div style="padding-left: 14px;"><span class="vl_f_666">报案人：</span><span class="vl_f_333">{{eventDetail.reporterPhone}}</span></div>
          </div>
          <div>
            <div><span class="vl_f_666">事件状态：</span><span class="vl_f_333">{{eventDetail.eventStatusName}}</span></div>
            <div><span class="vl_f_666">报案时间：</span><span class="vl_f_333">{{eventDetail.reportTime}}</span></div>
          </div>
          <div>
            <div><span class="vl_f_666">事件类型：</span><span class="vl_f_333">{{eventDetail.eventTypeName}}</span></div>
            <div><span class="vl_f_666">事件等级：</span><span class="vl_f_333">{{eventDetail.eventLevelName}}</span></div>
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
            <div v-for="(item, index) in eventDetail.attachmentList" :key="item.id">
              <img v-if="item.fileType === 1" @click="openBigImg(index, eventDetail.attachmentList)" :src="item.path" alt="">
              <div v-else @mouseenter="eventVideoTool = true;" @mouseleave="eventVideoTool = false;">
                <video id="eventVideo" :src="item.path" width="117px" height="117px" style="object-fit: fill;" @click="showLargeVideo(item, 2)"></video>
                <div class="result_tool" v-show="eventVideoTool">
                  <div>
                    <i class="vl_icon vl_icon_judge_01" v-if="item.curVideoPlay" @click="_pauseVideo(item)"></i>
                    <i class="vl_icon vl_icon_control_09" v-else @click="_playVideo(item)"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </vue-scroll>
      </el-dialog>
    </div>
    <div is="delDialog" ref="delDialog" :controlId="controlId" @getControlList="getControlList"></div>
    <div is="stopDialog" ref="stopDialog" :controlId="controlId" @getControlList="getControlList"></div>
    <BigImg :imgList="imgList" :imgIndex='imgIndex' :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
  </div>
</template>
<script>
import {unique} from '@/utils/util.js';
import delDialog from './delDialog.vue';
import stopDialog from './stopDialog.vue';
import {conDetail} from '../testData.js';
import flvplayer from '@/components/common/flvplayer.vue';
import {getControlDetail, getControlObjList, controlArea, getControlDevice, getAlarmSnap} from '@/views/index/api/api.control.js';
import {getEventDetail} from '@/views/index/api/api.event.js';
import {mapXupuxian} from '@/config/config.js';
import BigImg from '@/components/common/bigImg.vue';
export default {
  components: {delDialog, stopDialog, flvplayer, BigImg},
  props: ['controlId'],
  data () {
    return {
      controlState: null,//布控详情状态
      controlDetail: conDetail,//布控详情
      eventDetail: null,//事件详情
      eventVideoTool: false,
      imgList: [],
      imgIndex: null,
      isShowImg: false,
      // 地图参数
      map: null,
      zoomLevel: 10,
      // 追踪点列表数据
      trackPointList: [],
      devNum: null,//摄像头数量
      bayonetNum: null,//卡口数量
      devList: [], //设备列表
      tabTypeByScope : '0',// 设备类型-布控范围
      tabTypeBySituation : '0',// 设备类型-运行情况
      devIdOrBayId: null,//设备或者卡口id
      trackPointId: null,//追踪点id
      dpOne: false,//展开布控范围
      dpTwo: false,//展开实时监控
       // 翻页数据
      currentPage: 1,
      pageSizeObj: 18,
      pageNumObj: 1,
      pageSizeRes: 8,
      pageNumObjRes: 1,
      
      bResize: {},
      situList: [],// 实时监控设备列表
      bayList: [],// 实时监控卡口列表
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
  mounted () {
    this.getControlDetail();
  },
  methods: {
    // 关闭图片放大
    emitCloseImgDialog(value){
      this.isShowImg = value;
      this.imgList = [];
    },
    // 放大图片
    openBigImg (index, data) {
      this.isShowImg = true;
      this.imgIndex = index;
      this.imgList = data;
    },
    /* ************布控结果********* */
    // 停止播放
    pauseVideo (item, index) {
      item.curVideoPlay = false;
      document.getElementById('controlResult' + index).pause();
    } ,
    // 开始播放
    playVideo (item, index) {
      item.curVideoPlay = true;
      for (let f of this.controlResList.list) {
        if (item.uid === f.uid && !f.isShowCurImg) {
          f.isShowCurImg = true;
          break;
        }
      }
      document.getElementById('controlResult' + index).play();
    },
    // 开始播放
    _playVideo (item) {
      item.curVideoPlay = true;
      document.getElementById('eventVideo').play();
    },
    // 停止播放
    _pauseVideo (item) {
      item.curVideoPlay = false;
      document.getElementById('eventVideo').pause();
    } ,
    // 显示大屏
    showLargeVideo (item, type) {
      this.videoObj = {};
      if (type === 1) {
        this.videoObj = item;
      } else {
        const {path} = item;
        this.videoObj.snapVideo = path;
        this.videoObj.curVideoPlay = false;
      }
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
      this.$nextTick(() => {
        document.getElementById('controlResultLarge').play();
      })
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
      console.log(this.controlId, 'this.controlId')
      getControlDetail(this.controlId).then(res => {
        if (res && res.data) {
          this.controlDetail = res.data;
          this.controlState = this.controlDetail.surveillanceStatus === '待开始' ? 2 : this.controlDetail.surveillanceStatus === '进行中' ? 1 : 3;
          this.$nextTick(() => {
            this.resetMap();
          })
          if (this.controlState !== 2) {
            this.getAlarmSnap();
          }
        }
      })
    },
    // 获取事件详情
    getEventDetail () {
      this.eventDetailDialog = true;
      getEventDetail(this.controlDetail.eventId).then(res => {
        if (res && res.data) {
          this.eventDetail = res.data;
        }
      })
    },
    // 获取布控范围
    controlArea (isShowType) {
      // 展开关闭布控范围
      if (isShowType === 1) {
        this.dpOne = !this.dpOne;
      // 展开关闭运行情况
      } else {
        this.dpTwo = !this.dpTwo;
      }
      if (this.dpOne || this.dpTwo) {
        controlArea(this.controlId).then(res => {
          if (res && res.data) {
            this.devNum = res.data.devNum;
            this.bayonetNum = res.data.bayonetNum;
            // 布控范围
            if (isShowType === 1) {
              this.trackPointList = res.data.trackingPointList;
              this.trackPointList && this.trackPointList.forEach(f => {
                this.$set(f, 'isDropdown', false);
                if (f.bayonetList) {
                  f.bayonetList.forEach(b => {
                    this.$set(b, 'isDropdown', false);
                  })
                }
              });
              this.mapMark();
            // 运行情况
            } else {
              // 组装摄像头列表数据
              let devList = [];
              res.data.trackingPointList.forEach(f => {
                if (f.devList) {
                  devList = devList.concat(f.devList);
                }
              })
              this.situList = unique(devList, 'uid');//去重
              console.log(this.situList, 'situList')
              // 组装卡口列表数据
              let bayList = [];
              res.data.trackingPointList.forEach(f => {
                if (f.bayonetList) {
                  bayList = bayList.concat(f.bayonetList);
                }
              })
              this.bayList = bayList;
              this.bayList.forEach(f => {
                this.$set(f, 'isDropdown', false);
              })
              console.log(this.bayList, 'bayList')
            }
           
          }
          
        })
      }
    },
    // 切换设备类型获得设备列表数据
    getEquList (type, data) {
      this.tabTypeByScope = type;
      this.trackPointId = data.uid;
    },
    // 展开或者闭合设备列表
    dropdown (data) {
      this.trackPointList.forEach(f => {
        if (data.uid === f.uid) {
          f.isDropdown = !f.isDropdown;
        } else {
          f.isDropdown = false;
        }
        this.getEquList('0', data);
      })
    },
    // 点击左侧设备列表，地图marker高亮
    selDev (obj) {
      let _this = this;
      _this.devIdOrBayId = obj.uid;
      $(`#mapBox .vl_icon_control_34`).removeClass('vl_icon_control_34');
      $(`#mapBox .vl_icon_control_35`).removeClass('vl_icon_control_35');
      $(`#mapBox #${obj.uid}_sxt`).addClass('vl_icon_control_34');
      let sContent = null, hoverWindow = null;
      sContent = `<div class="vl_map_hover">
        <div class="vl_map_hover_main"><ul>
          <li><span>设备名称：</span><span>${obj.deviceName}</span></li>
          <li><span>设备地址：</span><span>${obj.address}</span></li>
        </ul></div>`;
      hoverWindow = new window.AMap.InfoWindow({
        isCustom: true,
        closeWhenClickMap: true,
        offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
        content: sContent
      });
      hoverWindow.open(_this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));    
    },
    // 展开或者闭合卡口列表
    dropdownBayonet (parentData, childData) {
      this.devIdOrBayId = childData.uid;
      let _this = this, sContent = null, hoverWindow = null;
      _this.trackPointList.forEach(f => {
        if (parentData.uid === f.uid) {
          f.bayonetList.forEach(b => {
            if (childData.uid === b.uid) {
              b.isDropdown = !b.isDropdown;
              // 点击左侧设备列表，地图marker高亮
              $(`#mapBox .vl_icon_control_35`).removeClass('vl_icon_control_35');
              $(`#mapBox .vl_icon_control_34`).removeClass('vl_icon_control_34');
              $(`#mapBox #${childData.uid}_kk`).addClass('vl_icon_control_35');
              sContent = `<div class="vl_map_hover">
                <div class="vl_map_hover_main"><ul>
                  <li><span>卡口名称：</span><span>${childData.bayonetName}</span></li>
                </ul></div>`;
              hoverWindow = new window.AMap.InfoWindow({
                isCustom: true,
                closeWhenClickMap: true,
                offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
                content: sContent
              });
              hoverWindow.open(_this.map, new window.AMap.LngLat(childData.longitude, childData.latitude));
            } else {
              b.isDropdown = false;
            }
          })
        }
      })
    },
    dropdownBay (data) {
      this.bayList.forEach(f => {
        if (f.uid === data.uid) {
          f.isDropdown = !f.isDropdown;
        } else {
          f.isDropdown = false;
        }
      })
    },
    // 布控对象列表分页查询
    getControlObjList () {
      const params = {
        pageNum: this.pageNumObj,
        pageSize: this.pageSizeObj,
        orderBy: null,
        order: null
      }
      getControlObjList(params, this.controlId).then(res => {
        if (res && res.data) {
          this.controlDetail.objectList = res.data.list;
        }
      })
    },
    // 布控对象列表分页
    handleCurrentChangeObj (page) {
      this.pageNumObj = page;
      this.getControlObjList();
    },
    // 获取所有布控设备
    getControlDevice (query) {
      const _query = this.Trim(query, 'g');
      if (_query) {
        const params = {
          name: _query,
          uid: this.controlId
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
      }
    },
    // 获取布控抓拍结果列表
    getAlarmSnap () {
      let params = {
        pageNum: this.pageNumObjRes,
        pageSize: this.pageSizeRes,
        'where.surveillanceId': this.controlId,
        'where.dateStart': this.controlTimeIsKey && this.controlTimeIsKey[0],
        'where.dateEnd': this.controlTimeIsKey && this.controlTimeIsKey[1]
      }
      this.devNameIsKey && (params['where.deviceName'] = this.devNameIsKey);
      getAlarmSnap(params).then(res => {
        if (res && res.data) {
          this.controlResList = res.data;
          this.controlResList.list.forEach(f => {
            this.$set(f, 'curVideoPlay', false);
            this.$set(f, 'curVideoTool', false);
            this.$set(f, 'isShowCurImg', false);
            f.path = f.snapPhoto;
            delete f.snapPhoto;
          })
        }
      })
    },
    // 布控结果列表分页
    handleCurrentChangeRes (page) {
      this.pageNumObjRes = page;
      this.getAlarmSnap();
    },
    /* ************运行情况********* */
    // 关闭播放器
    playerClose (index) {
      this.rightVideoList.splice(index, 1, {isShowVideo: false});
    },
    // 拖拽
    dragstart (e, index, item) {
      this.dragstartIndex = index;
      this.dragActiveObj = item;
       // 设置属性dataTransfer   两个参数   1：key   2：value
      if (!e) { e = window.event; }
      e.dataTransfer.setData('name', 'ouyang');
    },
  
    dragend () {
      this.dragActiveObj = null;
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
        this.rightVideoList.splice(index, 1, {
          isShowVideo: true,
          type: 1,
          title: this.dragActiveObj.deviceName,
          video: Object.assign({}, this.dragActiveObj)
        });
      }
    }, 
    mapMark () {
      let _this = this, hoverWindow = null, data = null, markerList = [];
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
             _content = '<div id="' + obj.uid + '_sxt' + '" class="vl_icon vl_icon_sxt"></div>';
          } else {
            // if (obj.isNormal && obj.isSelected) {
              _content = '<div id="' + obj.uid + '_kk' + '" class="vl_icon vl_icon_kk"></div>';
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
          marker.on('mouseover', function () {
            let sContent = '';
            // 摄像头
            if (obj.type === 1) {
              sContent = `<div class="vl_map_hover">
                <div class="vl_map_hover_main"><ul>
                  <li><span>设备名称：</span><span>${obj.deviceName}</span></li>
                  <li><span>设备地址：</span><span>${obj.address}</span></li>
                </ul></div>`;
            // 卡口
            } else {
              sContent = `<div class="vl_map_hover">
              <div class="vl_map_hover_main"><ul>
                <li><span>卡口名称：</span><span>${obj.bayonetName}</span></li>
              </ul></div>`;
            }
            hoverWindow = new window.AMap.InfoWindow({
              isCustom: true,
              closeWhenClickMap: true,
              offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
              content: sContent
            });
            hoverWindow.open(_this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
            // 摄像头
            if (obj.type === 1) {
              $(`#mapBox .vl_icon_control_34`).removeClass('vl_icon_control_34');
              $(`#mapBox .vl_icon_control_35`).removeClass('vl_icon_control_35');
              $(`#mapBox #${obj.uid}_sxt`).addClass('vl_icon_control_34');
            // 卡口
            } else {
              $(`#mapBox .vl_icon_control_35`).removeClass('vl_icon_control_35');
              $(`#mapBox .vl_icon_control_34`).removeClass('vl_icon_control_34');
              $(`#mapBox #${obj.uid}_kk`).addClass('vl_icon_control_35');
            }
            _this.devIdOrBayId = obj.uid;//左侧列表高亮
          });
          markerList.push(marker);
        }
      }
      _this.map.add(markerList);
      _this.map.setFitView();
    },
    resetZoom () {
      if (this.map) {
        this.map.setZoom(this.zoomLevel);
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
      let map = new window.AMap.Map('mapBox', {
        zoom: this.zoomLevel,
        center: mapXupuxian.center
      });
      map.setMapStyle('amap://styles/whitesmoke');
      _this.map = map;
      // _this.mapMark();
      _this.controlArea(1);
    }
  },
  destroyed () {
    if (this.map) {
      this.map.destroy();
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
          .control_time{
            display: flex;
            > span:nth-child(2){
              flex: 1;
            }
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
          padding-right: 120px;
          word-break: break-all;
          span{
            white-space: nowrap;
            color: #0C70F8;
            cursor: pointer;
          }
        }
      }
      .manage_d_c_o{
        margin-right: 20px;
        margin-top: 30px;
        border:1px solid rgba(242,242,242,1);
        border-radius:4px 4px 0px 0px;
        >div:nth-child(1){
          height:44px;
          line-height: 44px;
          padding-left: 20px;
          padding-top: 10px;
          background:rgba(250,250,250,1);
          border-radius:4px 4px 0px 0px;
        }
        >div:nth-child(2){
          display: flex;
          flex-flow: row wrap;
          align-content: flex-start;
          padding: 0 0.5% 20px 0.5%;
          .manage_d_c_o_i{
            height: 200px;
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
      .con_state{
        position: absolute;
        right: -1px;
        top: -2px;
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
          padding-bottom: 10px;
          display: flex;
          flex-wrap: wrap;
          > div{
            width: 33%;
          }
          .termination_reason{
            width: 100%;
            line-height: 20px;
            display: flex;
            > span:nth-child(2){
              flex: 1;
            }
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
            border-bottom: 1px solid #f2f2f2;
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
            height: 812px;
            .situ_left{
              width: 258px;
              min-width: 258px;
              height: 100%;
              border-right: 1px solid #F2F2F2;
              > div{
                height: 50px;
                line-height: 50px;
              }
              .equ_m{
                margin: 0 20px;
                height: 28px;
                line-height: 28px;
                border-radius:4px;
                border:1px solid rgba(211,211,211,1);
                display: flex;
                overflow: hidden;
                >div{
                  width: 50%;
                  height: 100%;
                  text-align: center;
                  background: #fff;
                  color: #666;
                  cursor: pointer;
                  &.active{
                    background: rgba(235,239,242,1);
                    color: #0C70F8;
                  }
                  &:hover{
                    background: rgba(235,239,242,1);
                    color: #0C70F8;
                  }
                }
              }
              ul{
                margin-top: 6px;
                width: 100%;
                height: calc(100% - 82px);
                li{
                  width: 100%;
                  height: 36px;
                  line-height: 36px;
                  display: flex;
                  flex-wrap: nowrap;
                  justify-content: space-between;
                  padding: 0 15px 0 35px;
                  color: #666666;
                  cursor: move;
                  > i{
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
              .bayone_list{
                height: calc(100% - 82px);
                > li{
                  display: block!important;
                  > div{
                    cursor: pointer;
                  }
                }
                .bayone_name{
                  line-height: 30px;
                  padding-left: 22px;
                  padding-top: 6px;
                  cursor: pointer;
                  &.active{
                    i, span{
                      color: #0C70F8;
                    }
                  }
                  i{
                    margin-right: 10px;
                  }
                  i, span{
                    color: #666;
                  } 
                  &~ul{
                   margin-top: 0px; 
                  }
                }
              }
            }
            .situ_right{
              width: calc(100% - 258px);
              height: 100%;
              display: flex;
              flex-flow: row wrap;
              align-content: space-between;
              justify-content: space-between;
              padding: 0.8%;
              background: #fafafa;
              .situ_r_video{
                width: 49.5%;
                height: 49.2%;
                position: relative;
                overflow: hidden;
                .situ_r_box{
                  width: 100%;
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  background: #fff;
                  > img{
                    width: 50%;
                  }
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
                height: 239px;
              }
              video{
                object-fit: fill;
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
                bottom: 48px;
                left: 0;
                > div{
                  color: #fff;
                }
                i{
                  margin-top: 6px;
                  margin-right: 5px;
                  cursor: pointer;
                }
                .download{
                  margin-top: 6px;
                  margin-right: 10px;
                  text-decoration: none;
                  color: #fff;
                  font-size: 20px;
                  vertical-align: top;
                }
              }
              > div:nth-child(1){
                width: 100%;
                height: 239px;
                cursor: pointer;
                background: #000;
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
      height: 276px;
      padding: 20px 0 0 70px;
      display: flex;
      flex-flow: row wrap;
      align-content: flex-start;
      > div{
        width: 117px;
        height: 117px;
        position: relative;
        margin-right: 20px;
        margin-bottom: 20px;
        img{
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        > div{
          width: 100%;
          height: 100%;
          .result_tool{
            width: 50px;
            height: 50px;
            background: rgba(0,0,0,.4);
            border-radius: 50%;
            position: absolute;
            bottom: 50%;
            left: 50%;
            margin-left: -25px;
            margin-bottom: -25px;
            cursor: pointer;
            > div{
              width: 100%;
              height:100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
    }
  }
  .close_btn{
    font-size: 1.3rem;
  }
  .vl_icon{
    transition: none;
  }
}
@media (max-width: 1400px) {
  .control_manage_d{
    .situ_content{
      height: 500px!important;
    }
    .result_img_box{
      height: 208px!important;
      >div{
        height: 160px!important;
        >img{
          height: 160px!important;
        }
        >video{
          height: 160px!important;
        }
        .result_tool{
          bottom: 46px!important;
        }
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
  .vl_map_hover_main{
    li{
      display: flex;
      > span{
        width: auto;
        text-align: left;
        &:nth-child(2){
          flex: 1;
        }
      }
     
    }
  }
  .select_box .el-input__suffix-inner{
    position: relative;
    bottom: 3px;
  }
}
</style>
