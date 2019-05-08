<template>
  <div class="vl_vid" id="videoPatrol">
    <div class="vid_show_menu" :class="{'vid_show_menu_active': showMenuActive}">
      <div class="show_menu_t" @click="showMenuActive = !showMenuActive">{{ showMenuActive ? '收起监控列表' : '展开监控列表' }}<i class="el-icon-caret-bottom"></i></div>
      <div class="show_menu_b">
        <div>
          <ul class="show_title">
            <li class="show_title_li" :class="{'show_title_active': showConTitle === 3}" @click="showConTitle = 3">监控列表</li>
            <li class="show_title_li" :class="{'show_title_active': showConTitle === 1}" @click="showConTitle = 1">监控分组</li>
            <li class="show_title_li" :class="{'show_title_active': showConTitle === 2}" @click="showConTitle = 2">播放历史</li>
            <li class="show_title_line" :class="{'show_title_line2': showConTitle === 1, 'show_title_line3': showConTitle === 2}"></li>
          </ul>
          <div class="show_content" v-show="showConTitle === 3">
            <div class="show_search">
              <div style="margin-left: 7%; width: 86%; padding-bottom: 15px;">
                <el-input
                  placeholder="请输入设备或区域名称"
                  size="small"
                  @keyup.enter.native="getDeviceList3()"
                  v-model="searchVal3">
                  <i slot="suffix" @click="getDeviceList3()" class="el-input__icon el-icon-search" style="font-size: 20px;"></i>
                </el-input>
              </div>
            </div>
            <div class="show_list">
              <ul class="show_list_c show_tree" id="videoList3Tree">
                <template v-if="deviceList3 && deviceList3.areaTreeList && deviceList3.areaTreeList.length > 0">
                  <li v-for="(item, index) in deviceList3.areaTreeList" :key="'tree3_' + index">
                    <div>
                      <div class="tree_title">
                        <i class="show_list_pi el-icon-arrow-right"></i>{{item.areaName}}
                      </div>
                    </div>
                    <ul class="tree_sli" v-if="item.deviceBasicList && item.deviceBasicList.length > 0">
                      <li v-for="(sitem, sindex) in item.deviceBasicList" :title="sitem.deviceName" :key="'dev_list3_' + sindex">
                        <div v-if="patrolActive === 1" class="tree_li_dis" 
                          @click="dragEndDis"
                          @dragend="dragEndDis"
                          draggable="true">
                          {{sitem.deviceName}}
                          <span class="vl_icon vl_icon_v11"></span>
                        </div>
                        <div class="com_ellipsis"
                          v-else-if="!deviceIsPlaying(sitem)"
                          @dragstart="dragStart($event, sitem, 1)" @dragend="dragEnd"
                          draggable="true" style="cursor: move;">
                          {{sitem.deviceName}}
                          <span class="vl_icon vl_icon_v11"></span>
                        </div>
                        <div class="tree_li_dis" v-else>
                          {{sitem.deviceName}}
                          <span class="vl_icon vl_icon_v11"></span>
                        </div>
                      </li>
                    </ul>
                    <ul class="tree_sli" v-else>
                      <li class="tree_sli_empty">暂无</li>
                    </ul>
                  </li>
                </template>
                <template v-else>
                  <li class="show_list_empty">
                    暂无记录
                  </li>
                </template>
              </ul>
            </div>
          </div>
          <div class="show_content" v-show="showConTitle === 1">
            <div class="show_search">
              <div style="margin-left: 8%; width: 84%;">
                <el-input
                  placeholder="请输入设备或分组名称"
                  size="small"
                  @keyup.enter.native="getDeviceList()"
                  v-model="searchVal">
                  <i slot="suffix" @click="getDeviceList()" class="el-input__icon el-icon-search" style="font-size: 20px;"></i>
                </el-input>
              </div>
            </div>
            <div class="show_list">
              <ul class="show_list_c show_tree" id="videoListTree">
                <template v-if="deviceList && deviceList.length > 0">
                  <li v-for="(item, index) in deviceList" :key="'tree_' + index">
                    <div>
                      <div class="tree_title">
                        <i class="show_list_pi el-icon-arrow-right"></i>{{item.groupName}}
                      </div>
                    </div>
                    <ul class="tree_sli" v-if="item.deviceBasicList && item.deviceBasicList.length > 0">
                      <li v-for="(sitem, sindex) in item.deviceBasicList" :title="sitem.deviceName" :key="'dev_list_' + sindex">
                        <!-- patrolParseDialogVisible -->
                        <div v-if="patrolActive === 1" class="tree_li_dis" 
                          @click="dragEndDis"
                          @dragend="dragEndDis"
                          draggable="true">
                          {{sitem.deviceName}}
                          <span class="vl_icon vl_icon_v11"></span>
                        </div>
                        <div class="com_ellipsis"
                          v-else-if="!deviceIsPlaying(sitem)"
                          @dragstart="dragStart($event, sitem, 1)" @dragend="dragEnd"
                          draggable="true" style="cursor: move;">
                          {{sitem.deviceName}}
                          <span class="vl_icon vl_icon_v11"></span>
                        </div>
                        <div class="tree_li_dis" v-else>
                          {{sitem.deviceName}}
                          <span class="vl_icon vl_icon_v11"></span>
                        </div>
                      </li>
                    </ul>
                    <ul class="tree_sli" v-else>
                      <li class="tree_sli_empty">暂无</li>
                    </ul>
                  </li>
                </template>
                <template v-else>
                  <li class="show_list_empty">
                    暂无记录
                  </li>
                </template>
              </ul>
            </div>
          </div>
          <div class="show_content" v-show="showConTitle === 2">
            <div class="show_his_c">
              <div class="show_his_btn" @click="delAllVideoRecords" v-if="videoRecordList && videoRecordList.length > 0">清空记录</div>
              <div class="show_his_empty" v-else>暂无记录</div>
              <ul class="show_his">
                <li v-for="(item, index) in videoRecordList" :key="'hty_' + index">
                  <!-- 过期 -->
                  <div v-if="patrolActive === 1" class="show_his_dis" 
                    @click="dragEndDis"
                    @dragend="dragEndDis"
                    draggable="true">
                    <h3 class="com_ellipsis">{{item.deviceName}}</h3>
                    <p>{{item.playBackStartTime | fmTimestamp}}</p>
                    <i class="el-icon-delete" @click="delVideoRecord(item)"></i>
                  </div>
                  <div class="show_his_dis" v-else-if="item.expireFlag">
                    <h3 class="com_ellipsis">{{item.deviceName}}</h3>
                    <p>{{item.playBackStartTime | fmTimestamp}}</p>
                    <i class="el-icon-delete" @click="delVideoRecord(item)"></i>
                  </div>
                  <!-- 视频巡逻，播放历史，拖动一条记录播放，应该是直接播放该设备的直播，不是回放 -->
                  <div @dragstart="dragStart2($event, item, 1)" @dragend="dragEnd"
                    draggable="true" style="cursor: move;" v-else>
                    <h3 class="com_ellipsis">{{item.deviceName}}</h3>
                    <p>{{item.playBackStartTime | fmTimestamp}}</p>
                    <i class="el-icon-delete" @click="delVideoRecord(item)"></i>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="vid_title">
      <ul class="vid_show_type" :class="{'vid_show_type_dis': patrolActive === 1}">
        <li class="vl_icon vl_icon_061" :class="{'vl_icon_sed': showVideoTotal === 1}" @click="changeShowType(1)"></li>
        <li class="vl_icon vl_icon_062" :class="{'vl_icon_sed': showVideoTotal === 4}" @click="changeShowType(4)"></li>
        <li class="vl_icon vl_icon_063" :class="{'vl_icon_sed': showVideoTotal === 5}" @click="changeShowType(5)"></li>
        <li class="vl_icon vl_icon_064" :class="{'vl_icon_sed': showVideoTotal === 9}" @click="changeShowType(9)"></li>
       <!--  <li class="vl_icon vl_icon_065" :class="{'vl_icon_sed': showType === 5}" @click="showType = 5"></li> -->
      </ul>
    </div>
    <div class="vid_opes">
      <el-button v-if="patrolActive === 1" @click="patrolParse" type="primary">暂停轮巡</el-button>
      <el-button v-else-if="patrolActive === 2" @click="patrolContinue" type="primary">继续轮巡</el-button>
      <el-button v-if="patrolActive === 1 || patrolActive === 2" @click="patrolCloseDialogVisible = true">关闭轮巡</el-button>
    </div>
    <div class="vid_content">
      <ul class="vid_show_list" :class="'vid_list_st' + showVideoTotal">
        <li v-for="(item, index) in videoList" :key="'video_list_' + index"
          @drop="dragDrop(item, index)" @dragover.prevent="dragOver">
          <div v-if="item && item.video">
            <div is="flvplayer" @playerClose="playerClose" :index="index" :oData="item" :bResize="bResize"
              :oConfig="{sign: true}">
            </div>
          </div>
          <div class="vid_show_empty" v-else>
            <div is="videoEmpty" @btnEvent="showListEvent" :btn="true"></div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 轮巡提示 dialog -->
    <el-dialog :title="patrolHandlerData.nextRound.roundName" :visible.sync="patrolTipDialogVisible" :center="false" :show-close="false" :close-on-click-modal="false" :append-to-body="true" width="400px">
      <div style="padding: 20px 0 20px 0; text-align: center; color: #666;">
        <el-progress type="circle" 
          :width="200" 
          :stroke-width="16"
          :percentage="patrolStartPercentage" 
          color="#1073F8"
          status="text">
          <p style="color: #000; text-align: center; font-size: 50px; font-weight: bold;">
            {{Math.ceil(patrolStartSecond / 10)}}
          </p>
          <P style="color: #666; text-align: center; font-size: 16px; padding: 10px 0 0 0;">秒</P>
        </el-progress>
      </div>
      <h3 style="color: #000; text-align: center; font-size: 18px; padding: 0 0 20px 0;">轮巡即将开始</h3>
      <p style="color: #666; text-align: center; font-size: 14px; padding: 0 20px 10px 20px;">打开轮巡后，您可查看固定地方的视频播放画面，还可以关闭轮巡。</p>
      <div slot="footer" class="dialog-footer" style="padding: 0 0 30px 0;">
        <el-button @click="patrolNextClose" :disabled="patrolNextCloseDis">关闭轮巡</el-button>
        <el-button type="primary" @click="patrolNextImm">执行轮巡</el-button>
      </div>
    </el-dialog>
    <!-- 轮巡暂停提示 dialog -->
    <el-dialog title="是否暂停轮巡？" :visible.sync="patrolParseDialogVisible" :center="false" :append-to-body="true" width="500px">
      <div style="padding: 30px 0 20px 30px; text-align: left; color: #666;">轮巡正在进行中，如需要查看其它通路，请先暂停轮巡。</div>
      <div slot="footer" class="dialog-footer" style="padding: 0 0 20px 0;">
        <el-button @click="patrolParseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="patrolParse">确定暂停轮巡</el-button>
      </div>
    </el-dialog>
    <!-- 轮巡关闭提示 dialog -->
    <el-dialog title="确定关闭轮巡？" :visible.sync="patrolCloseDialogVisible" :center="false" :append-to-body="true" width="500px">
      <div style="padding: 30px 0 20px 30px; text-align: left; color: #666;">关闭轮巡后将不播放该地区的视频。</div>
      <div slot="footer" class="dialog-footer" style="padding: 0 0 20px 0;">
        <el-button @click="patrolCloseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="patrolClose">确定关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {mapXupuxian} from '@/config/config.js';
import {videoTree} from '@/utils/video.tree.js';
import videoEmpty from './videoEmpty.vue';
import flvplayer from '@/components/common/flvplayer.vue';
import { apiAreaServiceDeviceList } from "@/views/index/api/api.base.js";
import { apiDeviceList, apiVideoRecordList, apiDelVideoRecord, apiDelVideoRecords, getVideoCurrentRound, mdfVideoRoundState } from "@/views/index/api/api.video.js";
export default {
  components: {videoEmpty, flvplayer},
  data () {
    return {
      // 0 未进行  1进行中  2暂停
      patrolActive: 0, // 轮巡状态
      patrolTipDialogVisible: false, // 轮巡即将开始窗口
      patrolParseDialogVisible: false, // 暂停提示窗口
      patrolCloseDialogVisible: false, // 关闭提示窗口
      patrolStartSecond: 600,
      patrolStartPercentage: 100,
      patrolInval: null,

      patrolNextCloseDis: false,
      // 设备列表
      deviceList: [], // 监控分组
      deviceList3: null, // 监控列表

      // {video: {}, title: ''},
      videoList: [{}, {}, {}, {}],
      showVideoTotal: 4,
      bResize: {},
      showMenuActive: false,
      showConTitle: 3,
      searchVal: '',
      searchVal3: '',
      dragActiveObj: null,
      dragVideoType: 1,

      videoRecordList: [],

      patrolHandlerData: {
        currentRound: {},
        currentRoundVal: null, // 当前轮巡间隔定时器
        currentRoundRemain: 25, // 当前轮巡倒计时(秒)
        currentRoundRemainTimeout: null, // 当前轮巡倒计时定时器
        nextRound: {},
        nextRoundCountDownDefault: 60,
        nextRoundCountDown: 65, // 下一个轮巡倒计时(秒)
        nextRoundCountDownTimeoutPre: null, // 下一个轮巡倒计时前置定时器
        nextRoundCountDownTimeout: null, // 下一个轮巡倒计时定时器
      },
      patrolDataVal: null
    }
  },
  watch: {
    patrolStartSecond () {
      this.patrolStartPercentage = this.patrolStartSecond / 600 * 100;
    },
    showVideoTotal () {
      this.playersHandler(this.showVideoTotal);
      this.bResize = {};
    },
    showConTitle (newVal) {
      if (newVal === 2) {
        this.getVideoRecordList();
      }
    }
  },
  created () {
    // 监控列表
    this.getDeviceList3();
    // 监控分组
    this.getDeviceList();

    // 获取轮巡数据 页面初始化时候的调用
    this.patrolGetData(true);
    this.patrolSetDataVal();
  },
  mounted () {
    videoTree('videoListTree');
    videoTree('videoList3Tree');
    $(window).on('unload', this.unloadSave);
  },
  methods: {
    /* 轮巡控制事件 begin */
    // 获取轮巡数据定时器
    patrolSetDataVal () {
      this.patrolDataVal = window.setInterval(() => {
        this.patrolGetData();
      }, 10 * 1000);
    },
    patrolClearDataVal () {
      if (this.patrolDataVal) {
        window.clearInterval(this.patrolDataVal);
      }
    },
    // 获取轮巡数据 bInit: 是否是页面初始化时候的调用
    patrolGetData (bInit) {
      getVideoCurrentRound().then(res => {
        if (res && res.data) {
          // let patrolData = res.data;
          let patrolData = res.data;
          /* let patrolData =
          {
            currentRound: {
              uid: '111', // 轮巡记录标识
              roundNo: '111', // 轮巡编号
              roundName: '轮巡预案名称111', // 轮巡名称
              frameNum: 4, // 画面数
              roundInterval: 20, // 轮巡间隔(秒)
              deviceNum: 5, // 轮巡设备数
              startTime: null, // 开始时间
              endTime: null, // 结束时间
              roundStatus: 1, // 轮巡状态
              deviceList: [{uid: 3}, {uid: 2}, {uid: 6}, {uid: 4}, {uid: 5}]
            },
            currentDeviceList: null,
            currentRoundRemain: 111145, // 当前轮巡倒计时(秒)
            nextRound: {
              uid: '222', // 轮巡记录标识
              roundNo: '222', // 轮巡编号
              roundName: '轮巡预案名称222', // 轮巡名称
              frameNum: 4, // 画面数
              roundInterval: 10, // 轮巡间隔(秒)
              deviceNum: 5, // 轮巡设备数
              startTime: new Date().getTime() - 10 * 60 * 1000, // 开始时间
              endTime: new Date().getTime(), // 结束时间
              roundStatus: 1, // 轮巡状态
              deviceList: [{uid: 5}, {uid: 3}, {uid: 4}, {uid: 2}, {uid: 6}]
            },
            nextDeviceList: null,
            nextRoundCountDown: 65 // 下条轮巡倒计时(秒)
          } */
          if (patrolData.currentRound && patrolData.currentDeviceList) {
            patrolData.currentRound.deviceList = patrolData.currentDeviceList;
          }
          if (patrolData.nextRound && patrolData.nextDeviceList) {
            patrolData.nextRound.deviceList = patrolData.nextDeviceList;
          }
          if (bInit) {
            if (!patrolData.currentRound || patrolData.currentRoundRemain <= 0) {
              // 不存在当前轮巡，则需要从本地存储中看看是否有数据
              this.getLocalStorageVideoData();
            }
          }
          this.patrolHandler(patrolData);
        } else {
          if (bInit) {
            // 从本地存储中看看是否有数据
            this.getLocalStorageVideoData();
          }
        }
      }).catch(error => {
        console.log("getVideoCurrentRound error：", error);
      });
    },
    // 轮巡处理
    patrolHandler (pData) {
      // 数据中有当前轮巡
      if (pData && pData.currentRound && pData.currentRoundRemain > 0) {
        if (!this.patrolHandlerData.currentRound || this.patrolHandlerData.currentRound.roundNo != pData.currentRound.roundNo) {
          // 不存在正在执行的轮巡 或者 正在执行的轮巡和当前轮巡 不是同一个 ==> 直接执行当前轮巡
          this.patrolClearCurrent(); // 清除正在执行的轮巡
          this.patrolStart(pData); // 开始轮巡
        }
        // 存在正在执行的轮巡 并且 正在执行的轮巡和当前轮巡 是同一个 ==> 废弃，不需要处理
      }
      // 当前有下一个轮巡
      if (pData && pData.nextRound && pData.nextRoundCountDown > 0) {
        if (!this.patrolHandlerData.nextRound || this.patrolHandlerData.nextRound.roundNo != pData.nextRound.roundNo) {
          // 下一个轮巡不存在 或 下一个轮巡和已储备的下一个轮巡 不是同一个 ==> 则执行下一个轮巡逻辑
          this.patrolClearNext(); // 清除下一个的轮巡信息
          this.patrolNext(pData); // 下一个
        }
        // 当前下一个轮巡 和 已储备的下一个轮巡 是同一个 ==> 废弃，不需要处理
      }
    },
    // 下一个轮巡
    patrolNext (pData) {
      // console.log('>>>>>>>>>> patrolNext 下一个轮巡');
      this.patrolHandlerData.nextRound = pData.nextRound;
      if (pData.nextRoundCountDown > this.patrolHandlerData.nextRoundCountDownDefault) {
        // 下一个轮巡时间大于默认等待时间
        this.patrolHandlerData.nextRoundCountDownTimeoutPre = window.setTimeout(() => {
          this.patrolNextTip(this.patrolHandlerData.nextRoundCountDownDefault);
        }, (pData.nextRoundCountDown - this.patrolHandlerData.nextRoundCountDownDefault) * 1000);
      } else if (pData.nextRoundCountDown > 0 && pData.nextRoundCountDown <= this.patrolHandlerData.nextRoundCountDownDefault) {
        this.patrolNextTip(pData.nextRoundCountDown);
      }
    },
    // 下一个轮巡提示（倒计时窗口）
    patrolNextTip (nextRoundCountDown) {
      this.patrolStartSecond = nextRoundCountDown * 10;
      this.patrolTipDialogVisible = true;
      this.patrolInval = window.setInterval(() => {
        if (this.patrolStartSecond <= 0) {
          if (this.patrolInval) {
            window.clearInterval(this.patrolInval);
          }
          this.patrolNextStart();
        } else {
          this.patrolStartSecond = Math.round(this.patrolStartSecond - 1);
        }
      }, 100);
    },
    // 立即执行下一个轮巡 状态（1.待开始 2.进行中 3.已结束 4.关闭）
    patrolNextImm () {
      this.patrolNextCloseDis = true;
      this.patrolClearDataVal();
      mdfVideoRoundState({
        id: this.patrolHandlerData.nextRound.uid,
        status: 2
      }).then(() => {
        // 开始执行下一个轮巡
        this.patrolNextStart();
        // 获取轮巡数据
        this.patrolSetDataVal();
      }).catch(error => {
        this.patrolSetDataVal();
        console.log("mdfVideoRoundState error：", error);
      });
    },
    // 开始执行下一个轮巡
    patrolNextStart () {
      this.patrolClearCurrent();
      let iT = this.patrolHandlerData.nextRound.endTime - this.patrolHandlerData.nextRound.startTime;
      if (iT > 0) {
        iT = Math.round(iT / 1000);
      }
      let op = {
        currentRound: this.patrolHandlerData.nextRound,
        currentRoundRemain: iT
      }
      this.patrolClearNext();
      this.patrolStart(op);
    },
    // 关闭下一个轮巡
    patrolNextClose () {
      this.patrolTipDialogVisible = false;
      if (this.patrolInval) {
        window.clearInterval(this.patrolInval);
      }
      if (this.patrolHandlerData.nextRoundCountDownTimeoutPre) {
        window.clearTimeout(this.patrolHandlerData.nextRoundCountDownTimeoutPre);
        this.patrolHandlerData.nextRoundCountDownTimeoutPre = null;
      }
      // 将下一个轮巡状态设为 关闭 4
      this.patrolClearDataVal();
      mdfVideoRoundState({
        id: this.patrolHandlerData.nextRound.uid,
        status: 4
      }).then(() => {
        this.patrolSetDataVal();
      }).catch(error => {
        this.patrolSetDataVal();
        console.log("mdfVideoRoundState error：", error);
      });
    },
    // 清除下一个的轮巡信息
    patrolClearNext () {
      this.patrolNextCloseDis = false;
      this.patrolHandlerData.nextRound = {};
      this.patrolHandlerData.nextRoundCountDown = 0;
      if (this.patrolHandlerData.nextRoundCountDownTimeoutPre) {
        window.clearTimeout(this.patrolHandlerData.nextRoundCountDownTimeoutPre);
        this.patrolHandlerData.nextRoundCountDownTimeoutPre = null;
      }
      this.patrolTipDialogVisible = false;
      if (this.patrolInval) {
        window.clearInterval(this.patrolInval);
      }
    },
    // 开始轮巡
    patrolStart (pData) {
      // console.log('>>>>>>>>>> patrolStart 开始轮巡');
      this.patrolActive = 1;
      this.patrolHandlerData.currentRound = pData.currentRound;
      // 当前轮巡的索引
      this.patrolHandlerData.currentRound.roundIndex = 0;
      // 轮巡执行本地开始时间，用于暂停
      this.patrolHandlerData.currentRound.excuteStartTime = new Date().getTime();
      this.patrolHandlerData.currentRoundRemain = pData.currentRoundRemain;
      // 轮巡设备数deviceNum   画面数frameNum
      if (this.patrolHandlerData.currentRound.deviceList && this.patrolHandlerData.currentRound.deviceList.length > this.showVideoTotal) {
        this.patrolCurrentGoOn();
        this.patrolHandlerData.currentRoundVal = window.setInterval(() => {
          this.patrolCurrentGoOn();
        }, this.patrolHandlerData.currentRound.roundInterval * 1000);
        this.patrolHandlerData.currentRoundRemainTimeout = window.setTimeout(() => {
          this.patrolClearCurrent();
        }, this.patrolHandlerData.currentRoundRemain * 1000);
      } else {
        // 当设备数小于等于 画面数 的时候，则相当于不需要轮巡
        this.patrolSetVideoList(this.patrolHandlerData.currentRound.deviceList);
      }
      this.$message('轮巡已开始。');
    },
    // 当前轮巡 轮
    patrolCurrentGoOn () {
      // console.log('>>>>>>>>>> patrolCurrentGoOn 当前轮巡 轮');
      if (this.showVideoTotal !== this.patrolHandlerData.currentRound.frameNum) {
        // 改变布局
        this.showVideoTotal = this.patrolHandlerData.currentRound.frameNum;
        this.bResize = {};
      }
      let pList = null;
      // 每轮设备数量可执行的轮巡次数 设备数量/画面数 向上取整 至少是2
       console.log('当前轮巡的轮巡次数 roundIndex:', this.patrolHandlerData.currentRound.roundIndex + 1);
      let excuteNum = Math.ceil(this.patrolHandlerData.currentRound.deviceList.length / this.showVideoTotal);
      let excuteIndex = this.patrolHandlerData.currentRound.roundIndex % excuteNum;
      let iStart = excuteIndex * this.showVideoTotal;
      let iEnd = (excuteIndex + 1) * this.showVideoTotal;
      if (iEnd > this.patrolHandlerData.currentRound.deviceList.length) { iEnd = this.patrolHandlerData.currentRound.deviceList.length; }
      // slice(start,end)表示从下标start开始到下标end（不包括end）进行截取，得到的是一个新数组，不改变原数组。
      pList = this.patrolHandlerData.currentRound.deviceList.slice(iStart, iEnd);
      this.patrolSetVideoList(pList);
      this.patrolHandlerData.currentRound.roundIndex += 1; // 当前轮巡的索引
    },
    // 轮巡的时候给VideoList赋值
    patrolSetVideoList (list) {
      if (list && list.length > 0) {
        let _list = [];
        for (let i = 0; i < list.length; i++) {
          _list.push({
            type: 1,
            title: list[i].deviceName,
            record: false,
            video: Object.assign({}, list[i])
          });
        }
        let _il = _list.length;
        if (_il < this.showVideoTotal) {
          for (let j = 0; j < (this.showVideoTotal - _il); j++) {
            _list.push({});
          }
        }
        this.videoList = _list;
      }
    },
    // 清除正在执行的轮巡
    patrolClearCurrent () {
      // console.log('>>>>>>>>>> patrolClearCurrent 清除正在执行的轮巡');
      // 当前轮巡间隔定时器
      if (this.patrolHandlerData.currentRoundVal) {
        window.clearInterval(this.patrolHandlerData.currentRoundVal);
        this.patrolHandlerData.currentRoundVal = null;
      }
      // 当前轮巡倒计时定时器
      if (this.patrolHandlerData.currentRoundRemainTimeout) {
        window.clearInterval(this.patrolHandlerData.currentRoundRemainTimeout);
        this.patrolHandlerData.currentRoundRemainTimeout = null;
      }
      // 可能是主动停止的轮巡 还要让其存在
      // this.patrolHandlerData.currentRound = null;
      this.patrolHandlerData.currentRoundRemain = 0;
      this.patrolActive = 0;
    },
    // 暂停轮巡
    patrolParse () {
      this.patrolParseDialogVisible = false;
      this.patrolActive = 2;
      // 当前轮巡间隔定时器
      if (this.patrolHandlerData.currentRoundVal) {
        window.clearInterval(this.patrolHandlerData.currentRoundVal);
        this.patrolHandlerData.currentRoundVal = null;
      }
      this.$message('轮巡已暂停。');
    },
    // 继续轮巡
    patrolContinue () {
      this.patrolActive = 1; // 设置轮巡状态 1正在执行
      if (this.patrolHandlerData.currentRound.roundIndex > 0) {
        this.patrolHandlerData.currentRound.roundIndex -= 1;
      } else {
        this.patrolHandlerData.currentRound.roundIndex = 0;
      }
      this.patrolCurrentGoOn();
      this.patrolHandlerData.currentRoundVal = window.setInterval(() => {
        this.patrolCurrentGoOn();
      }, this.patrolHandlerData.currentRound.roundInterval * 1000);
      this.$message('轮巡已继续。');
    },
    // 关闭当前轮巡
    patrolClose () {
      this.patrolClearCurrent();
      this.patrolParseDialogVisible = false;
      this.patrolCloseDialogVisible = false;
      this.patrolActive = 0;
      this.$message('轮巡已关闭。');
    },
    /* 轮巡控制事件 end */

    // 从本地存储中获取播放记录
    getLocalStorageVideoData () {
      // window.localStorage.getItem(name);
      let sType = window.localStorage.getItem('vlink_video_patrol_type');
      let sList = window.localStorage.getItem('vlink_video_patrol_list');
      if (sType && sType.length > 0) {
        this.showVideoTotal = Number(sType);
        if (sList && sList.length > 0) {
          this.$nextTick(() => {
            sList = JSON.parse(sList);
            // console.log(sList);
            for (let i = 0; i < sList.length; i++) {
              sList[i].record = false;
            }
            this.videoList = sList;
          });
        }
      } else {
        // 第一次打开
        this.showMenuActive = true;
      }
    },

    dragEndDis () {
      this.patrolParseDialogVisible = true;
    },
    changeShowType (type) {
      if (this.showVideoTotal != type) {
        if (this.patrolActive === 1) {
          this.patrolParseDialogVisible = true;
        } else {
          this.showVideoTotal = type;
        }
      }
      console.log(this.videoList)
    },

    /* 播放记录 */
    getVideoRecordList () {
      // 播放类型 1:视频巡逻 2:视频回放
      apiVideoRecordList({
        playType: 1
      }).then(res => {
        if (res && res.data) {
          this.videoRecordList = res.data;
        }
      }).catch(error => {
        console.log("apiVideoRecordList error：", error);
      });
    },
    delVideoRecord (item) {
      apiDelVideoRecord(item.uid).then(() => {
        this.getVideoRecordList();
        this.$message({
          message: '删除成功！',
          type: 'success'
        });
      }).catch(error => {
        this.$message.error('删除失败！');
        console.log("apiDelVideoRecord error：", error);
      });
    },
    delAllVideoRecords () {
      // apiDelVideoRecords
      this.$confirm('确定删除所有的播放历史吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiDelVideoRecords({playType: 1}).then(() => {
          this.getVideoRecordList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(error => {
          this.$message.error('删除失败！');
          console.log("apiDelVideoRecords error：", error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },

    /* 监控列表 */
    getDeviceList3 () {
      apiAreaServiceDeviceList({
        areaUid: mapXupuxian.adcode,
        likeKey: this.searchVal3
      }).then(res => {
        if (res && res.data) {
          this.deviceList3 = res.data;
        }
      }).catch(error => {
        console.log("apiAreaServiceDeviceList error：", error);
      });
    },
    /* 监控分组 */
    getDeviceList () {
      // let sui = window.localStorage.getItem('userInfo');
      // if (sui) { sui = JSON.parse(sui); }
      apiDeviceList({
        // id: sui.uid,
        likeKey: this.searchVal
      }).then(res => {
        if (res && res.data) {
          this.deviceList = res.data;
        }
      }).catch(error => {
        console.log("apiSignContentList error：", error);
      });
    },
    deviceIsPlaying (item) {
      let flag = false;
      for (let i = 0; i < this.videoList.length; i++) {
        if (this.videoList[i].video && this.videoList[i].video.uid === item.uid) {
          flag = true;
          break;
        }
      }
      return flag;
    },

    playersHandler (sum) {
      // videoList
      let na = [], ii = 0;
      for (let i = 0; i < this.videoList.length; i++) {
        if (ii < sum) {
          if (this.videoList[i] && this.videoList[i].video) {
            na.push(this.videoList[i]);
            ii++;
          }
        } else {
          break;
        }
      }
      let il = sum - na.length;
      if (il > 0) {
        for (let j = 0; j < il; j++) {
          na.push({});
        }
      }
      this.videoList = na;
    },
    // 缓存播放列表
    saveVideoList () {
      window.localStorage.setItem('vlink_video_patrol_type', JSON.stringify(this.showVideoTotal));
      window.localStorage.setItem('vlink_video_patrol_list', JSON.stringify(this.videoList));
    },
    unloadSave () {
      this.saveVideoList();
    },

    // 拖拽开始
    dragStart (ev, item, type) {
      // console.log('drag start', item)
      this.dragActiveObj = item;
      this.dragVideoType = type;
      // 设置属性dataTransfer   两个参数   1：key   2：value
      if (!ev) { ev = window.event; }
      ev.dataTransfer.setData('name', 'ouyang');
    },
    // 拖拽开始
    dragStart2 (ev, item, type) {
      // console.log('drag start', item)
      this.dragActiveObj = Object.assign({}, item, {
        uid: item.deviceUid
      });
      this.dragVideoType = type;
      // 设置属性dataTransfer   两个参数   1：key   2：value
      if (!ev) { ev = window.event; }
      ev.dataTransfer.setData('name', 'ouyang2');
    },
    dragOver () {
      // console.log('drag over')
    },
    dragDrop (item, index) {
      if (this.dragActiveObj) {
        let op = {};
        if (this.dragVideoType === 2) {
          op = {
            startTime: this.dragActiveObj.playBackStartTime,
            endTime: this.dragActiveObj.playBackEndTime,
          }
        }
        this.videoList.splice(index, 1, Object.assign({
          type: this.dragVideoType,
          title: this.dragActiveObj.deviceName,
          record: true,
          video: Object.assign({}, this.dragActiveObj)
        }, op));
      }
    },
    dragEnd () {
      // console.log('drag end')
      this.dragActiveObj = null;
    },
    /* 播放器事件 begin */
    /**
     * 关闭播放器
     * @param {string} sid 视频ID
     */
    playerClose (iIndex) {
      this.videoList.splice(iIndex, 1, {});
    },
    /* 播放器事件 end */

    showListEvent () {
      this.showMenuActive = true;
      this.showConTitle = 3;
    }
  },
  destroyed () {
    if (this.patrolInval) {
      window.clearInterval(this.patrolInval);
    }
    $(window).off('unload', this.unloadSave);
    this.saveVideoList();

    // 清除当前轮巡
    this.patrolClearCurrent();
    this.patrolClearNext();
    if (this.patrolDataVal) {
      window.clearInterval(this.patrolDataVal);
      this.patrolDataVal = null;
    }
  }
}
</script>
<style lang="scss" scoped>
.vl_vid {
  height: 100%;
  position: relative;
  > .vid_title {
    position: absolute; top: 0; left: 270px;
    height: 60px;
    padding: 20px 0 0 0;
  }
  > .vid_opes {
    position: absolute; top: 2px; right: 20px;
    height: 60px;
    padding: 20px 0 0 0;
  }
  > .vid_content {
    height: 100%;
    padding-top: 60px;
    overflow: hidden;
  }
}
</style>
