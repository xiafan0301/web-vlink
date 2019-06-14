<template>
  <div class="vl_flvplayer" :class="{'flvplayer_fullscreen': fullScreen}">
    <div class="flvplayer_player" :id="flvplayerId + '_container'">
      <!-- poster="videojs/eguidlogo.png" -->
      <div class="flvplayer_player_c" :id="flvplayerId + '_c'">
        <video :id="flvplayerId" style="width: 100%; height: 100%; object-fit: fill;" autoplay="autoplay" muted>
        </video>
      </div>
    </div>
    <!-- loading -->
    <div class="player_loading com_trans50_lt" v-show="videoLoading">
      <div v-if="videoLoadingFailed">
        <p>视频加载失败</p>
        <el-button round size="small" @click="relaodPlayer">重新获取</el-button>
      </div>
      <div v-else>视频加载中，请稍后...</div>
    </div>
    <span v-show="fullScreen" class="vl_icon player_out_fullscreen vl_icon_v30" @click="playerFullScreen(false)" title="退出全屏"></span>
    <span v-if="config.close && !fullScreen && !optionsDis" class="vl_icon vl_icon_close" @click="playerClose" title="关闭"></span>
    <!-- <span v-else class="vl_icon vl_icon_close" @click="playerClose" title="关闭"></span> -->
    <!-- 暂停按钮（遮盖） -->
    <span class="vl_icon vl_icon_v51" v-show="!playActive" @click="playerPlay(true)"></span>
    <!-- 录像提示 -->
    <span class="flvplayer_lux" v-if="tape.active" @click="tapeEnd" title="点击停止录像">{{tape.tapeTime | transSeconds}}</span>
    <!-- 右下操作合集 -->
    <div class="flvplayer_bot" :class="{'flvplayer_bot_dis': videoLoading}">
      <div class="flvplayer_bot_t com_ellipsis">{{oData.title}}</div>
      <div v-show="!optionsDis" class="flvplayer_bot_o">
        <span>
          <!-- 播放/暂停 -->
          <span class="flvplayer_opt vl_icon vl_icon_v21" v-show="playActive" title="暂停" @click="playerPlay(false)"></span>
          <span class="flvplayer_opt vl_icon vl_icon_v22" v-show="!playActive" title="播放" @click="playerPlay(true)"></span>
          <!-- 音量 声音大小（0-1之间） myPlayer.volume(0.5); -->
          <!-- <span class="flvplayer_opt player_volume">
            <div>
              <el-slider
                v-model="volume"
                :min="0"
                :max="1"
                :step="0.001"
                vertical
                height="120px">
              </el-slider>
            </div>
            <span class="vl_icon" :class="{
                'vl_icon_v23': volumeAble && volume > 0,
                'vl_icon_v232': !volumeAble || volume <= 0
              }" title="音量" @click="playerVolumeAble">
            </span>
          </span> -->
        </span>
        <span class="flvplayer_bot_om" :class="{'flvplayer_bot_om_h': mini && !fullScreen}">
          <span class="flvplayer_bot_omh">
            <!-- 标记 (更新需求：取消所有回放画面（录像回放、智能查看-视频回放）的标记功能 2019.05.05)-->
            <span v-if="config.sign && oData.type === 1" class="flvplayer_opt vl_icon vl_icon_v24 player_sign" title="标记" @click="addSign"></span>
            <!-- 录视频 回放无此功能 -->
            <template v-if="config.tape && oData.type === 1">
              <span v-if="!tape.active" @click="tapeStart" class="flvplayer_opt vl_icon vl_icon_v25 player_tran" title="录像"></span>
              <span v-else @click="tapeEnd" class="flvplayer_opt vl_icon vl_icon_v25_2 player_tran" title="停止录像"></span>
            </template>
            <!-- 下载 (回放才有) -->
            <span v-if="oData.type === 2 && config.download" @click="playerDownload" class="flvplayer_opt vl_icon vl_icon_v32 player_download" title="下载"></span>
            <!-- 截屏 -->
            <span v-if="config.cut" @click="playerCut" class="flvplayer_opt vl_icon vl_icon_v26 player_cut" title="截屏"></span>
            <!-- 全屏 -->
            <span v-show="!fullScreen && config.fullscreen && !showFullScreen" class="flvplayer_opt vl_icon vl_icon_v27 player_fullscreen" title="全屏" @click="playerFullScreen(true)"></span>
            <!-- 全屏 -->
            <span v-show="config.fullscreen2" class="flvplayer_opt vl_icon vl_icon_v27 player_fullscreen" title="全屏" @click="playerFullScreenTwo"></span>
            <!-- 局部放大 -->
            <template v-if="fullScreen || showFullScreen">
              <span v-if="!enlarge" class="flvplayer_opt vl_icon vl_icon_v29" @click="playerEnlarge(true)" title="局部放大"></span>
              <span v-else class="flvplayer_opt vl_icon vl_icon_v292" @click="playerEnlarge(false)" title="取消局部放大"></span>
              <!-- 退出全屏 -->
              <span v-if="fullScreen && !showFullScreen" class="flvplayer_opt vl_icon vl_icon_v30" @click="playerFullScreen(false)" title="退出全屏"></span>
            </template>
          </span>
          <!-- 更多 -->
          <span v-if="!fullScreen && !showFullScreen" class="flvpayer_opt vl_icon vl_icon_v28" title="更多" @click="playerFullScreen(true)"></span>
        </span>
      </div>
    </div>
    <!-- 添加标记 dialog -->
    <el-dialog v-if="config.sign" title="添加标记" :visible.sync="signDialogVisible" :center="false" :append-to-body="true" width="500px">
      <div style="padding: 30px 0 20px 30px; text-align: left; color: #666; font-size: 15px;">当前监控：{{oData.title}}</div>
      <el-form :model="signForm" :rules="signFormRules" ref="signForm" style="padding-left: 30px;">
        <el-form-item prop="content">
          <el-select v-model="signForm.content" placeholder="请选择标记内容" style="width: 200px;">
            <el-option v-for="(item, index) in signContentList" :label="item.content" :value="item.uid" :key="'sign_content_list' + index"></el-option>
          </el-select>
          <a href="javascript: void(0);" @click="signForm.addSign = true" class="player_add_sign">点击添加新的标记内容</a>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="padding: 0 0 20px 0;">
        <el-button @click="signDialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="!signForm.content" :loading="signSubmitLoading" @click="signSubmit('signForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="config.sign"
      :visible.sync="signForm.addSign"
      :append-to-body="true"
      width="500px">
      <el-form :model="signForm" :rules="signFormRules" ref="signForm" style="padding: 10px 0 0 30px;">
        <el-form-item prop="addSignContent">
          <el-input size="small" maxlength="20" :clearable="true" v-model="signForm.addSignContent" placeholder="请输入标记内容" style="width: 220px;"></el-input>
          <el-button type="primary" :disabled="addSignSubmitAble" @click="addSignSubmit('signForm')" size="small" style="margin-left: 15px;">确定</el-button>
          <el-button size="small" @click="signForm.addSign = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 截屏 dialog -->
    <el-dialog v-if="config.cut" title="" :visible.sync="cutDialogVisible" :center="false" :append-to-body="true" width="1000px">
      <div style="text-align: center; padding-top: 30px;">
        <canvas :id="flvplayerId + '_cut_canvas'"></canvas>
      </div>
      <div slot="footer" class="dialog-footer" style="padding: 0 0 20px 0;">
        <el-button @click="cutDialogVisible = false">取 消</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="primary" @click="playerCutSave">保 存</el-button>
        <a :id="flvplayerId + '_cut_a'" style="display: none;">保存</a>
      </div>
    </el-dialog>
    <!-- 录像 dialog -->
    <el-dialog v-if="config.tape && oData.type === 1" :title="tape.loading ? '正在完成录制' : '录像完成'" 
      :visible.sync="tape.tapeEndDialogVisible" :center="false" :append-to-body="true" @closed="tapeClosed" width="800px">
      <div style="text-align: center; width: 100%; padding: 20px 20px 0 20px;">
        <div v-if="tape.loading" style="padding: 50px 0;">
          正在完成录制，请稍后...
        </div>
        <video :src="tape.downloadUrl" controls style="width: 100%; max-width: 100%;" v-else></video>
      </div>
      <div slot="footer" class="dialog-footer" style="padding: 0 0 20px 0;">
        <el-button @click="tape.tapeEndDialogVisible = false">取 消</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <!-- <el-button :disabled="tape.loading" type="primary" @click="tapeDownload">下 载</el-button> -->
        <!-- http://10.16.1.142:3550/file-down-stream.do?id=f234cf41-042f-4e15-ad53-15181566ecb0 -->
        <a v-if="!tape.loading" class="vid_dowload_btn" :href="tape.downloadUrl" download>下 载</a>
        <el-button v-else :disabled="true" type="primary">下 载</el-button>
      </div>
    </el-dialog>
    <!-- 下载 dialog -->
    <el-dialog v-if="oData.type === 2 && config.download" :title="download.nextStep ? '视频获取' : '下载'" @closed="downloadClosed"
      :visible.sync="download.downloadDialogVisible" :append-to-body="true" width="600px">
      <div style="text-align: left; width: 100%; padding: 20px 50px 0px 50px;">
        <div v-show="!download.nextStep">
          <div style="padding: 0 0 15px 0;">
            <span style="display: inline-block; width: 85px; margin-left: 50px; text-align: left;">开始时间：</span>
            <el-date-picker
              v-model="download.startTime"
              time-arrow-control
              type="datetime"
              :editable="false" :clearable="false"
              :picker-options="download.startTimeOptions"
              @change="downloadStartTimeChanged"
              placeholder="选择开始时间">
            </el-date-picker>
          </div>
          <!-- <p style="padding: 5px 0 15px 135px; color: #999;">最小开始时间为：{{download.allStartTime | fmTimestamp}}</p> -->
          <div>
            <span style="display: inline-block; width: 85px; margin-left: 50px; text-align: left;">下载时长：</span>
            <!-- @change="handleChange" -->
            <el-input-number v-model="download.currentM" controls-position="right" :min="download.minM" :max="download.maxM"></el-input-number>
            <span>&nbsp;&nbsp;分钟</span>
          </div>
          <!-- <p  style="padding-left: 135px;"><span style="color: red;">*</span>最大时间间隔为30分钟<br/>
          </p> -->
          <div style="text-align: center; padding-top: 30px; padding-bottom: 14px;">
            <el-button style="width: 100px;" @click="download.downloadDialogVisible = false">取 消</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button :loading="download.nextStepLaoding" :title="'确定'" style="width: 100px;" type="primary" @click="playerDownloadSubmit">
              确定
            </el-button>
          </div>
          <!-- <p style="text-align: center;"><span style="color: red;">*</span>最大时间间隔为30分钟</p> -->
        </div>
        <div v-show="download.nextStep">
          <p style="text-align: center; font-size: 16px; padding-bottom: 10px;">视频文件数量 <span style="color: #0C70F8; font-size: 18px;">{{download.recordDataSize}}</span> 个</p>
          <ul style="padding-top: 0px; padding-bottom: 30px;">
            <li v-for="(item, key, index) in download.recordData" :key="key"  style="padding-top: 20px;">
              <div style="padding-bottom: 5px;">
                <span>视频&nbsp;{{index + 1}}&nbsp;
                  <span v-if="download.progressFailed">获取失败</span>
                  <span v-else-if="item.progress < 100">获取中...</span>
                  <span v-else>获取完毕</span>
                </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <el-button size="small" :disabled="item.progress < 100" @click="downloadFile(item)">下载文件</el-button>
              </div>
              <el-progress :text-inside="false" :stroke-width="10" :percentage="item.progress"></el-progress>
            </li>
          </ul>
          <div v-show="download.progressFailed" style="text-align: center; padding-bottom: 20px;">
            <el-button @click="playerDownloadGetProgress">获取失败，点击重新获取</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {random14, formatDate, getDate} from '@/utils/util.js';
import { apiSignContentList, apiVideoSignContent, apiVideoSign, apiVideoRecord,
  apiVideoPlay, apiVideoPlayBack, getVideoPlayRecordStart, getVideoPlayRecordEnd,
  getVideoFileDownProgressBatch, videoFileDownStartTime, addVideoDownload } from "@/views/index/api/api.video.js";
// import { getTestLive } from "@/views/index/api/api.js";
export default {
  /** 
   * index: 视频序号（在列表页面的位置）
   * oData：视频信息 object {
   *    type: 1, // 1直播 2回放 3录像
   *    title: '设备名称',
   *    startTime: Date 回放开始时间
   *    endTime: Date 回放结束时间
   *    video: 设备信息（uid、）
   *    record: 为true时 则生成放历史记录
   *  },
   * oConfig: { 播放配置信息
   *    pause: 开始是否暂停，默认为false
   *    sign: 是否可标记，默认为true
   *    signEmit: 标记成功后是否需要emit，默认为false
   *    close: 是否可删除，默认为true
   *    fullscreen: 是否可全屏，默认为true
   *    fullscreen2: 否可全屏，默认为false, for 布控
   *    cut: 是否可截屏，默认为true,
   *    tape: 是否可录像，默认为true
   *    download: 是否可下载(回放)，默认为true
   * },
   * optDis: 是否隐藏所有的操作按钮
   * bResize: 播放容器尺寸变化
   */
  props: ['index', 'oData', 'oConfig', 'optDis', 'bResize', 'showFullScreen'],
  data () {
    return {
      optionsDis: false,
      mini: false, // 主要控制播放器操作栏显示方式

      videoLoading: true,
      videoLoadingFailed: false,
      videoLoadingTimeout: 20 * 1000,

      playBackList: [], // 回放资源LIST
      playBackIndex: 0, // 回放资源索引

      playActive: true,
      player: null,
      video: null,
      flvplayerId: 'flv_' + random14(),
      // 默认播放配置信息
      config: {
        pause: false, // 开始是否暂停，默认为false(播放)
        sign: true, // 是否可标记
        signEmit: false, // 标记成功后是否需要emit
        close: true, // 是否可删除
        fullscreen: true, // 是否可全屏
        fullscreen2: false,
        cut: true, // 是否可截屏
        tape: true, // 是否可录像
        download: true // 是否可下载(回放)
      },

      startPlayTime: null,

      fullScreen: false,
      enlarge: false,
      volume: 0.5,
      volumeAble: true,

      signContentList: [],
      signDialogVisible: false,
      signContentDialogVisible: true,
      signForm: {
        signTime: '',
        content: '',
        addSign: false,
        addSignContent: ''
      },
      signFormRules: {
        addSignContent: [
          { required: true, message: '请填写标记内容', trigger: 'blur' }
        ]
      },
      signSubmitLoading: false,

      cutDialogVisible: false,
      cutTime: 0,
      // 录像对象
      tape: {
        active: false, // 录像激活状态，激活了不一定在录像（ajax）
        loading: false, // 正在开始/结束录像，此时，重复点击按钮不会触发事件
        tapeTime: 0, // 录像时间（秒）
        // tapeTip: '',
        tapeTimeInval: null, // 录像时间定时器
        recordId: null,
        downloadUrl: '',
        tapeEndDialogVisible: false
      },
      // 下载对象
      download: {
        downloadDialogVisible: false,
        durationTime: '',
        startTime: '',
        endTime: '',
        allStartTime: '',
        allEndTime: '',
        currentM: 30,
        minM: 1,
        maxM: 30,
        startTimeOptions: {
          disabledDate: (d) => {
            d = d.getTime();
            if (d > this.download.allEndTime || d < this.download.allStartTime - 24 * 60 * 60 * 1000) {
              return true;
            } else {
              return false;
            }
          }
        },

        recordData: {},
        recordDataSize: 1,
        // downloadUrl: '',
        progressVal: 0,
        downlaodMaxVal: 1800,
        nextStep: false,
        nextStepLaoding: false,
        progressFailed: false,
        downlaodInval: null // 下载进度定时器
      }
    }
  },
  filters: {
  },
  watch: {
    oData (newData, oldData) {
      console.log('watch oData', newData);
      // 去掉暂停按钮
      this.playActive = true;
      // 取消录像
      this.tapeClosed();
      this.relaodPlayer();
      if (oldData && oldData.record) {
        this.saveVideoRecord(oldData);
      }
    },
    oConfig () {
      if (this.oConfig) {
        this.config = Object.assign(this.config, this.oConfig);
      }
    },
    optDis () {
      this.optionsDis = this.optDis;
    },
    volume () {
      if (this.volume <= 0) {
        this.volumeAble = false;
      } else {
        this.volumeAble = true;
      }
      if (this.video) {
        this.video.volume = this.volume;
      }
    },
    bResize () {
      window.setTimeout(() => {
        this.sizeHandler();
      }, 500);
    }
  },
  computed: {
    // 标记内容是否重复控制
    addSignSubmitAble: function () {
      let flag = true;
      if (this.signForm.addSignContent) {
        flag = false;
        for (let i = 0; i < this.signContentList.length; i++) {
          if (this.signContentList[i].content === this.signForm.addSignContent) {
            flag = true;
            break;
          }
        }
      }
      return flag;
    }
  },
  mounted () {
    console.log('mounted oData', this.oData);
    this.optionsDis = this.optDis;
    if (this.oConfig) {
      this.config = Object.assign(this.config, this.oConfig);
    }
    this.initPlayer();
    // $(window).on('unload', this.videoUnloadSave);
    this.sizeHandler();
  },
  methods: {
    // sizeHandler
    sizeHandler () {
      // console.log('miniHandler_' + this.index + '_' + $('#' + this.flvplayerId + '_container').width());
      if ($('#' + this.flvplayerId + '_container').width() < 500) {
        this.mini = true;
      } else {
        this.mini = false;
      }
    },

    // 视频播放
    initPlayer () {
      this.videoLoadingFailed = false;
      let obj = {deviceId: this.oData.video.uid};
      if (this.oData.type === 1) {
        // 直播
        apiVideoPlay(obj).then(res => {
          if (res && res.data) {
            this.initPlayerDo(res.data.liveFlvUrl);
          } else {
            // 未获取到视频
            console.log('未获取到视频');
            this.videoLoadingFailed = true;
          }
        }).catch(error => {
          console.log("apiVideoPlay error：", error);
        });
      } else if (this.oData.type === 2) {
        // 回放
        if (this.oData.startTime) {
          obj.startTime = formatDate(this.oData.startTime, 'yyyy-MM-dd HH:mm:ss');
        }
        if (this.oData.endTime) {
          obj.endTime = formatDate(this.oData.endTime, 'yyyy-MM-dd HH:mm:ss');
        }
        apiVideoPlayBack(obj).then(res => {
          if (res && res.data && res.data.length > 0) {
            // 为一个LIST
            if (res.data.length >= (this.playBackIndex + 1)) {
              console.log('回放第' + (this.playBackIndex + 1) + '段视频，URL：', res.data[this.playBackIndex].liveFlvUrl);
              this.initPlayerDo(res.data[this.playBackIndex].liveFlvUrl);
              this.playBackList = res.data;
            } else {
              // 播放结束处理
            }
          } else {
            // 未获取到视频
            console.log('未获取到视频');
            this.videoLoadingFailed = true;
          }
        }).catch(error => {
          console.log("apiVideoPlayBack error：", error);
        });
      } else if (this.oData.type === 3) {
        // 录像
        this.initPlayerDoForNormal(this.oData.video.downUrl);
      }
      
    },
    // 直播播放（播放/回放）
    initPlayerDo (surl) {
      if (window.flvjs.isSupported()) {
        this.videoLoading = true;
        var videoElement = document.getElementById(this.flvplayerId);
        var flvPlayer = window.flvjs.createPlayer({
          type: 'flv',
          url: surl,
          isLive: true
        }, {
          enableWorker: true,
          enableStashBuffer: false,
          stashInitialSize: 128
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        /* flvPlayer.play().then(() => {
          console.log('>>>>>>>>>>>>>>>>>>>>>>> flvPlayer.play then');
          this.videoLoading = false;
          this.videoLoadingFailed = false;
          if (this.config.pause) {
            this.playActive = false;
            flvPlayer.pause();
          }
          this.startPlayTime = new Date().getTime();
        }); */
        flvPlayer.play();
        // 加载失败
        let failedOut = window.setTimeout(() => {
          this.videoLoadingFailed = true;
        }, this.videoLoadingTimeout);
        // 真正处于播放的状态，这个时候我们才是真正的在观看视频。
        videoElement.onplaying = () => {
          if (failedOut) { window.clearTimeout(failedOut); }
          this.videoLoading = false;
          this.videoLoadingFailed = false;
          if (this.config.pause) {
            this.playActive = false;
            flvPlayer.pause();
          }
          this.startPlayTime = new Date().getTime();
        };
        videoElement.onerror = () => {
          this.videoLoadingFailed = true;
          console.log('player video error: ', videoElement.error);
        };
        /* videoElement.oncanplay = function () {
          console.log('视频播放器已经可以开始播放视频了，但是只是预期可以正常播放，不保证之后的播放不会出现缓冲等待');
        } */
        // onloadstart  客户端开始请求数据
        // onratechange  //播放速率改变
        // onseeked 寻找完毕
        // onplay 开始播放时触发
        // onwaiting 播放由于下一帧数据未获取到导致播放停止，但是播放器没有主动预期其停止，仍然在努力的获取数据，简单的说就是在等待下一帧视频数据，暂时还无法播放。
        // onplaying 真正处于播放的状态，这个时候我们才是真正的在观看视频。 
        // oncanplay 视频播放器已经可以开始播放视频了，但是只是预期可以正常播放，不保证之后的播放不会出现缓冲等待。
        // onpause 暂停播放时触发
        // onended 播放结束 loop 的情况下不会触发
        // onloadedmetadata 获取视频meta信息完毕，这个时候播放器已经获取到了视频时长和视频资源的文件大小。 
        // onloadeddata 视频播放器第一次完成了当前播放位置的视频渲染。
        // onabort 客户端主动终止下载（不是因为错误引起）
        // onerror 请求数据时遇到错误
        // 1.用户终止 2.网络错误 3.解码错误 4.URL无效
        // alert(myVid.error.code);
        //客户端请求数据
       /*  myVid.onprogress=function(){

          console.log(`客户端正在请求数据 触发多次，是分段请求的`);
          console.log(myVid.buffered);
          //0.此元素未初始化  1.正常但没有使用网络  2.正在下载数据  3.没有找到资源
          console.log(`networkState ${myVid.networkState}`);
          //  //当前播放的位置，赋值可改变位置 myVid.currentTime = 11 从11秒位置开始播放
          console.log(myVid.currentTime);
          // //返回当前资源的URL
          console.log(myVid.currentSrc);

          console.log(myVid.videoWidth);
          //播放结束 返回true 或 false
          console.log(myVid.ended);
          //音量大小 为0-1 之间的值
          console.log(myVid.volume);
          //当前资源长度
          console.log(myVid.duration);
          console.log(myVid.startDate)
          // myVid.currentTime = 11 */

        this.player = flvPlayer;
        this.video = videoElement;

        if (this.oData.type === 2) {
          // 回放 的时候需要添加ended事件
          videoElement.addEventListener('ended', this.playNext, false);
        }
      }
    },
    // 普通播放（录像）
    initPlayerDoForNormal (surl) {
      this.videoLoading = true;
      var videoElement = document.getElementById(this.flvplayerId);
      videoElement.src = this.oData.video.downUrl;
      // 真正处于播放的状态，这个时候我们才是真正的在观看视频。
      // 暂停后再播放也会触发 this.config.pause影响
      videoElement.onplaying = () => {
        this.videoLoading = false;
        this.videoLoadingFailed = false;
        if (this.config.pause) {
          this.playActive = false;
          videoElement.pause();
        }
      };
      videoElement.onended = () => {
        console.log('播放结束');
        this.playActive = false;
        videoElement.pause();
      };
      videoElement.onerror = () => {
        this.videoLoadingFailed = true;
        console.log('player video error: ', videoElement.error);
      };
      this.video = videoElement;
    },
    // 回放/录像 播放下一个视频
    playNext () {
      if (this.playBackList.length > (this.playBackIndex + 1)) {
        this.playBackIndex += 1;
        /* this.destroyPlayer();
        let _su = this.playBackList[this.playBackIndex].liveFlvUrl;
        console.log('播放第' + (this.playBackIndex + 1) + '段视频，URL：', _su);
        this.initPlayerDo(_su); */
        this.relaodPlayer();
      } else {
        //  播放结束处理
      }
    },
    destroyPlayer () {
      if (this.download.downlaodInval) {
        window.clearInterval(this.download.downlaodInval);
      }
      if (this.tape.tapeTimeInval) {
        window.clearInterval(this.tape.tapeTimeInval);
      }
      if (this.player) {
        this.player.unload();
        this.player.destroy();
        this.player.detachMediaElement();
        this.player = null;
        // 回放/录像的时候需要清除ended事件
        if (this.oData.type === 1) {
          this.video.removeEventListener('ended', this.playNext);
        }
      }
    },
    relaodPlayer () {
      this.destroyPlayer();
      this.initPlayer();
    },
    /***** 视频事件 *****/
    /* 录像函数 */
    tapeStart () {
      if (this.tape.active) { return; }
      this.tape.active = true;
      this.tape.loading  = true;
      this.$message('开始录像。');
      this.tape.tapeTime = 0;
      this.tape.tapeTimeInval = window.setInterval(() => {
        this.tape.tapeTime += 1;
      }, 1000);
      getVideoPlayRecordStart({
        deviceId: this.oData.video.uid
      }).then(res => {
        if (res && res.data) {
          // console.log(res.data);
          this.tape.recordId = res.data.recordId;
          this.tape.loading  = false; // 此时才可以触发结束事件
        } else {
          if (this.tape.tapeTimeInval) {
            window.clearInterval(this.tape.tapeTimeInval);
          }
        }
      }).catch(error => {
        this.tape.active = false;
        this.tape.loading  = false;
        if (this.tape.tapeTimeInval) {
          window.clearInterval(this.tape.tapeTimeInval);
        }
        console.log("getVideoPlayRecordStart error：", error);
      });
    },
    tapeEnd () {
      if (this.tape.loading) { return; }
      this.tape.tapeEndDialogVisible = true;
      this.tape.loading = true;
      if (this.tape.tapeTimeInval) {
        window.clearInterval(this.tape.tapeTimeInval);
      }
      getVideoPlayRecordEnd({
        deviceId: this.oData.video.uid,
        recordId: this.tape.recordId
      }).then(res => {
        if (res && res.data && this.tape.active) {
          this.tape.downloadUrl = res.data.downUrl;
          this.tape.active = false;
          this.tape.loading = false;
        }
        this.tape.active = false;
        this.tape.loading = false;
      }).catch(error => {
        console.log("getVideoPlayRecordEnd error：", error);
        this.tape.active = false;
        this.tape.loading = false;
      });
    },
    tapeClosed () {
      this.tape.active = false;
      this.tape.loading = false;
      this.tape.downloadUrl = '';
    },
    /* 下载 */
    playerDownload () {
      this.downloadClosed();
      this.download.nextStepLaoding = false;
      this.download.downloadDialogVisible = true;
      this.download.maxM = 30;
      this.download.currentM = 30;
      let sT = this.playBackList[0].startTime;
      let eT = this.playBackList[this.playBackList.length - 1].endTime;
      this.download.startTime = getDate(sT);
      this.download.allStartTime = getDate(sT).getTime();
      this.download.allEndTime = getDate(eT).getTime();
      // this.download.file = this.playBackList[this.playBackIndex];
      if ((this.download.allEndTime - this.download.allStartTime) / 1000 < this.download.downlaodMaxVal) {
        let iM = Math.floor(((this.download.allEndTime - this.download.allStartTime) / 1000) / 60);
        if (iM <= 0) { iM = 1; } 
        this.download.maxM = iM;
      }
      this.downloadTimeRule();
      // this.download.downlaodMaxVal = (getDate(this.download.file.endTime).getTime() - getDate(this.download.file.startTime).getTime()) / 1000
    },
    downloadStartTimeChanged (val) {
      // console.log('downloadStartTimeChanged');
      if (val) {
        val = val.getTime();
        let _mint = this.download.allEndTime - 60 * 1000;
        if (val > _mint) {
          if (_mint < this.download.allStartTime) {
            this.download.startTime = new Date(this.download.allStartTime);
          } else {
            this.download.startTime = new Date(_mint);
          }
        } else if ( val < this.download.allStartTime) {
          this.download.startTime = new Date(this.download.allStartTime);
        }
        this.downloadTimeRule();
      }
    },
    downloadTimeRule () {
      // this.download.startTime   this.download.allEndTime
      let _ids = this.download.allEndTime - this.download.startTime.getTime();
      if (_ids > this.download.downlaodMaxVal * 1000) {
        this.download.maxM = 30;
      } else {
        let _o = Math.floor(_ids / (60 * 1000));
        if (_o <= 0) { _o = 1; }
        this.download.maxM = _o;
        if (this.download.currentM > _o) { this.download.currentM = _o; }
      }
    },
    playerDownloadSubmit () {
      this.download.nextStepLaoding = true;
      videoFileDownStartTime({
        deviceId: this.oData.video.uid,
        startTime: formatDate(this.download.startTime),
        endTime: formatDate(this.download.startTime.getTime() + this.download.currentM * 60 * 1000)
      }).then(res => {
        if (res && res.data) {
          let params = [], rData = {}, rDataSize = 0;
          this.download.recordDataSize = res.data.length;
          for (let i = 0; i < res.data.length; i++) {
            let _obj = res.data[i];
            rData[_obj.recordId] = {
              recordId: _obj.recordId,
              deviceId: this.oData.video.uid,
              progress: 0,
              downUrl: '',
              startTime: _obj.startTime,
              endTime: _obj.endTime
              // startTime: formatDate();
            }
          }
          this.download.recordData = rData;
          this.$nextTick(() => {
            this.download.nextStep = true;
            this.playerDownloadGetProgress();
          });
        }
        this.download.nextStepLaoding = false;
      }).catch(error => {
        this.download.nextStepLaoding = false;
        console.log("videoFileDownStartTime error：", error);
      });
    },
    playerDownloadGetProgress () {
      this.download.progressFailed = false;
      if (this.download.downlaodInval) {
        window.clearInterval(this.download.downlaodInval);
      }
      let ti = (Math.floor((this.download.currentM / 30) * 5) + 2) * 1000;
      console.log(ti);
      this.download.downlaodInval = window.setInterval(() => {
        this.playerDownloadProgress();
      }, ti);
    },
    playerDownloadProgress () {
      let sparam = '?';
      sparam += 'deviceId=' + this.oData.video.uid;
      for(let i in this.download.recordData) {
        sparam += '&recordId=' + this.download.recordData[i].recordId;
      }
      getVideoFileDownProgressBatch(sparam).then(res => {
        if (res && res.data && res.data.batchCamRealRecordDto) {
          let rd = res.data.batchCamRealRecordDto;
          let flag = true;
          for(let j in rd) {
            for(let k in this.download.recordData) {
              if (j === this.download.recordData[k].recordId) {
                this.download.recordData[k].progress = rd[j].progress;
                if (this.download.recordData[k].progress >= 100) {
                  this.download.recordData[k].progress = 100;
                  this.download.recordData[k].downUrl = rd[j].downUrl;
                } else {
                  flag = false;
                }
              }
            }
          }
          if (flag) { // 下载完毕
            window.clearInterval(this.download.downlaodInval);
          }
        } else {
          window.clearInterval(this.download.downlaodInval);
          this.download.progressFailed = true;
        }
      }).catch(error => {
        console.log("getVideoFileDownProgressBatch error：", error);
        window.clearInterval(this.download.downlaodInval);
        this.download.progressFailed = true;
      });
    },
    downloadFile (item) {
      console.log(item);
      /* 下载记录 */
      let oUser = this.$store.state.loginUser;
      let dept = (oUser && oUser.organList && oUser.organList[0]) ? oUser.organList[0] : {};
      addVideoDownload({
        deviceId: this.oData.video.uid,
        startTime: item.startTime ? formatDate(item.startTime) : '',
        endTime: item.endTime ? formatDate(item.endTime) : '',
        oprDeptId: dept.uid,
        oprDeptName: dept.organName,
        ptUserId: oUser ? oUser.uid : '',
        ptUserName: oUser ? oUser.userName : ''
      }).then(() => {
      }).catch(error => {
        console.log("addVideoDownload error：", error);
      });
      /* 下载 */
      let $iframe = $('<iframe id="down-file-iframe" />');
			let $form = $('<form target="down-file-iframe" method="post" />');
			$form.attr('action', item.downUrl);
			/* for (var key in config.data) {
			  $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
			} */
			$iframe.append($form);
			$(document.body).append($iframe);
      $form[0].submit();
      $iframe.remove();
    },
    downloadClosed () {
      this.download.nextStep = false;
      this.download.progressVal = 0;
      if (this.download.downlaodInval) {
        window.clearInterval(this.download.downlaodInval);
      }
    },
    downlaodFormatTooltip (val) {
      return formatDate(getDate(this.download.startTime).getTime() + val * 1000, 'yyyy-MM-dd HH:mm:ss');
    },
    // 播放/暂停
    playerPlay (flag) {
      this.playActive = flag;
      console.log('playerPlay', flag)
      if (this.oData.type === 1) {
        if (flag) {
          // 直播 播放的时候需要重新加载
          this.destroyPlayer();
          this.playActive = true; // 去掉暂停按钮
          this.config.pause = false;
          this.initPlayer();
        } else {
          this.player.pause();
        }
      } else if (this.oData.type === 2 || this.oData.type === 3) {
        // 回放/录像
        if (flag) {
          this.config.pause = false;
          this.video.play();
        } else {
          this.video.pause();
        }
      }
    },
    playerVolumeAble () {
      let _vo = 0;
      if (this.volumeAble && this.volume > 0) {
        this.volumeAble = false;
      } else if (!this.volumeAble && this.volume > 0) {
        this.volumeAble = true;
        _vo = this.volume;
      } else if (this.volume <= 0) {
        this.volumeAble = false;
      }
      if (this.video) {
        this.video.volume = _vo;
      }
    },
    // 局部放大
    playerEnlarge (flag) {
      // flvplayerId + '_container'
      let nTarget = $('#' + this.flvplayerId + '_container');
      let $c = $('#' + this.flvplayerId + '_c');
      if (flag) {
        this.enlarge = true;
        let startX, startY;
        let boxId = this.flvplayerId + '_box';
        // e.target.offsetLeft
        nTarget.on('mousedown', function (e) {
          // e.pageX/e.pageY 相对于窗口左上角
          startX = Math.floor(e.pageX);
          startY = Math.floor(e.pageY);
          // console.log('startX:', startX);
          // console.log('startY:', startY);
          // 在页面创建 box
          let nBox = $('<div>', {
            id: boxId,
            class: 'player_box',
            style: 'left: ' + startX + 'px; top: ' + startY + 'px;'
          });
          nTarget.append(nBox);
          nBox = null;
        });
        // 鼠标移动
        nTarget.on('mousemove', function (e) {
          // 更新 box 尺寸
          let box = $('#' + boxId);
          if(box && box.length > 0) {
            // e.pageX/e.pageY 相对于窗口左上角
            box.width(Math.floor(e.pageX - startX));
            box.height(Math.floor(e.pageY - startY));
          }
        });
        // 鼠标抬起
        nTarget.on('mouseup', function () {
          let box = $('#' + boxId);
          if(box && box.length > 0) {
            // 如果长宽均小于 3px，移除 box
            if(box.width() < 10 || box.height() < 10) {
              // 太小则移除 box
              box.remove();
            } else {
              // 放大
              // 可视窗口大小
              let ow = nTarget.width(), oh = nTarget.height();
              // 画的BOX的大小
              let bw = box.width(), bh = box.height();
              // 视频大小(可能已经被放大了)
              let cw = $c.width(); // ch = $c.height();
              // 调整BOX的大小，使其与可视窗口大小保持一致
              if (bw / bh > ow / oh) {
                bh = Math.floor(bw * oh / ow);
                bw = Math.floor(bw);
              } else {
                bw = Math.floor(ow / oh * bh);
                bh = Math.floor(bh);
              }
              // console.log('转换后的 bw:' + bw + '--bh:' + bh);
              let inDO = cw / ow; // 之前放大的倍数
              let inD = ow / bw * inDO; // 现在放大的倍数
              // if (inD > 4) { inD = 4; } // 最大放大到4倍
              // 设置视频大小
              $c.width(Math.floor(ow * inD));
              $c.height(Math.floor(oh * inD));
              let iML = $c.css('margin-left').replace(/px/, '');
              let iMT = $c.css('margin-top').replace(/px/, '');
              $c.css({
                'margin-left': -Math.floor(startX / inDO * inD - iML / inDO * inD ) + 'px',
                'margin-top': -Math.floor(startY / inDO * inD - iMT / inDO * inD) + 'px'
              });
              box.remove();
            }
          }
        });
      } else {
        this.enlarge = false;
        nTarget.off('mousedown');
        nTarget.off('mousemove');
        nTarget.off('mouseup');
        $c.width('100%');
        $c.height('100%');
        $c.css({'margin-left': '0px', 'margin-top': '0px'});
      }
    },
    // 全屏/取消全屏
    playerFullScreen (flag) {
      if (this.config.fullscreen2) {
        this.playerFullScreenTwo();
      } else {
        this.fullScreen = flag;
        this.playerEnlarge(false);
      }
    },
    playerFullScreenTwo () {
      this.$emit('playerFullScreenTwo');
    },
    // 截屏
    playerCut () {
      this.cutDialogVisible = true;
      this.$nextTick(() => {
        let $video = $('#' + this.flvplayerId);
        let $canvas = $('#' + this.flvplayerId + '_cut_canvas');
        // console.log($video.width(), $video.height());
        if ($canvas && $canvas.length > 0) {
          // let w = 920, h = 540;
          let w = $video.width(), h = $video.height();
          if (w > 920) {
            h = Math.floor(920 / w * h);
            w = 920;
          }
          $canvas.attr({
              width: w,
              height: h,
          });
          // $video[0].crossOrigin = 'anonymous';
          // video canvas 必须为原生对象
          let ctx = $canvas[0].getContext('2d');
          this.cutTime = new Date().getTime();
          ctx.drawImage($video[0], 0, 0, w, h);
        }
      });
    },
    // 截屏 保存
    playerCutSave () {
      let $canvas = $('#' + this.flvplayerId + '_cut_canvas');
      if ($canvas && $canvas.length > 0) {
        let img = $canvas[0].toDataURL('image/png');
        let filename = 'image_' + this.cutTime + '.png';
        if('msSaveOrOpenBlob' in navigator){
          // 兼容EDGE
          let arr = img.split(',');
          let mime = arr[0].match(/:(.*?);/)[1];
          let bstr = atob(arr[1]);
          let n = bstr.length;
          let u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          let blob = new Blob([u8arr], {type:mime});
          window.navigator.msSaveOrOpenBlob(blob, filename);
          return;
        }
        img.replace('image/png', 'image/octet-stream');
        let saveLink = $('#' + this.flvplayerId + '_cut_a')[0];
        saveLink.href = img;
        saveLink.download = filename;
        saveLink.click();
        // console.log(base64);
      }
    },
    // 视频关闭事件
    playerClose () {
      this.$emit('playerClose', this.index, 123123);
    },
    /* 标记 */
    addSign () {
      this.getSignContent();
      this.signForm.content = '';
      if (this.$refs.signForm) {
        this.$refs.signForm.resetFields();
      }
      this.signForm.signTime = new Date().getTime();
      this.signDialogVisible = true;
    },
    getSignContent () {
      apiSignContentList({}).then(res => {
        if (res && res.data) {
          this.signContentList = res.data;
        }
      }).catch(error => {
        console.log("apiSignContentList error：", error);
      });
    },
    signSubmit (formName) {
      // this.$refs[formName].validateField("content", (errorMessage) => {
      //   // errorMessage 为空就是验证成功了
      //   if (!errorMessage) {
          this.signSubmitLoading = true;
          apiVideoSign({
            contentId: this.signForm.content,
            deviceId: this.oData.video.uid,
            signTime: formatDate(this.signForm.signTime),
          }).then((data) => {
            if (data) {
              this.signSubmitLoading = false;
              this.signDialogVisible = false;
              this.$message({
                message: '标记成功！',
                type: 'success'
              });
              if (this.config.signEmit) {
                this.$emit('signEmit');
              }
            }
          }).catch(error => {
            console.log("apiSignContentList error：", error);
            this.signSubmitLoading = false;
          });
      //   } else {
      //     // console.log('error submit!!');
      //     return false;
      //   }
      // });
    },
    addSignSubmit (formName) {
      this.$refs[formName].validateField("addSignContent", (errorMessage) => {
        // errorMessage 为空就是验证成功了
        if (!errorMessage) {
          // this.signSubmitLoading = true;
          apiVideoSignContent({
            content: this.signForm.addSignContent,
            uid: '0'
          }).then((data) => {
            if (data) {
              this.getSignContent();
              this.$message({
                message: '添加标记内容成功！',
                type: 'success'
              });
              this.signForm.addSignContent = '';
            }
            this.signForm.addSign = false;
          }).catch(error => {
            console.log("apiSignContentList error：", error);
            // this.signSubmitLoading = false;
          });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },

    // 播放记录 只有type=1 / 2 才记录
    saveVideoRecord (_data) {
      if (!_data) { _data = this.oData; }
      if ((_data.type === 2 || _data.type === 1) && _data.record) {
        let playBack = {};
        if (_data.type === 1) {
          playBack.playBackStartTime = formatDate(this.startPlayTime ? this.startPlayTime : new Date()); // 回放开始时间
          playBack.playBackEndTime = formatDate(new Date().getTime()); // 回放结束时间
        }
        if (_data.type === 2) {
          playBack.playBackStartTime =formatDate( _data.startTime); // 回放开始时间
          playBack.playBackEndTime = formatDate(_data.endTime); // 回放结束时间
        }
        apiVideoRecord(Object.assign({
          deviceId: _data.video.uid, // 设备id
          playTime: formatDate(this.startPlayTime ? this.startPlayTime : new Date()), // 播放结束时间
          // 播放类型 1:视频巡逻 2:视频回放
          playType: _data.type
        }, playBack)).then(() => {
        }).catch(error => {
          console.log("apiVideoRecord error：", error);
        });
      }
    },
    // 浏览器unload事件
    videoUnloadSave () {
      this.saveVideoRecord();
    }
  },
  beforeDestroy () {
    if (this.player) {
      // 销毁
      this.player.unload();
      this.player.detachMediaElement();
      this.player.destroy();
      this.player = null;
      this.video = null;
    }
    this.saveVideoRecord();

    if (this.download.downlaodInval) {
      window.clearInterval(this.download.downlaodInval);
    }
    if (this.tape.tapeTimeInval) {
      window.clearInterval(this.tape.tapeTimeInval);
    }
    // $(window).off('unload', this.videoUnloadSave);
  }
}
</script>
<style lang="scss" scoped>
.vl_flvplayer {
  position: relative;
  width: 100%; height: 100%;
  overflow: hidden;
  &.flvplayer_fullscreen {
    position: fixed; z-index: 100; top: 0; left: 0;
  }
  > .flvplayer_player {
    position: relative;
    width: 100%; height: 100%;
    overflow: hidden;
    background: #000;
    > .flvplayer_player_c {
      width: 100%; height: 100%;
    }
  }
  > .player_out_fullscreen {
    position: absolute; top: 10px; right: 10px; z-index: 10;
    cursor: pointer;
  }
  > .player_loading {
    position: absolute; top: 50%; left: 50%; z-index: 10;
    color: #fff;
    text-align: center;
    > div {
      > p { padding-bottom: 10px; }
    }
  }
  > .vl_icon_close {
    position: absolute; top: 10px; right: 10px; z-index: 10;
    cursor: pointer;
  }
  > .vl_icon_v51 {
    position: absolute; top: 50%; right: 50%; z-index: 10;
    margin: -40px; margin-top: -40px;
    cursor: pointer;
  }
  > .flvplayer_bot {
    /* position: absolute; left: 0; bottom: -48px; */
    position: absolute; left: 0; bottom: -48px;
    width: 100%; height: 48px;
    background-color: #000;
    background-color: rgba(34, 34, 34, 0.65);
    transition: bottom 0.4s ease-out;
    &.flvplayer_bot_dis {
      bottom: -48px !important;
    }
    > .flvplayer_bot_t {
      float: left;
      height: 48px; line-height: 48px; max-width: 40%;
      padding-left: 20px;
      color: #fff; font-size: 16px;
      overflow: hidden;
    }
    > .flvplayer_bot_o {
      float: right;
      padding-top: 12px; padding-right: 20px;
    }
  }
  &:hover {
    > .flvplayer_bot { bottom: 0; }
  }
}
.flvplayer_bot_o {
  > span {
    display: inline-block;
    > .player_volume {
      position: relative;
      width: 24px; height: 24px;
      > div {
        display: none;
        position: absolute; left: -7px; bottom: 24px;
        width: 38px;
        padding: 20px 0 20px 0;
        text-align: center;
        background-color: #000;
        background-color: rgba(0, 0, 0, .7);
        border-radius: 4px;
      }
      > .vl_icon {
        transition: none;
      }
      &:hover {
        > div { display: block; }
      }
    }
  }
}
.flvplayer_opt {
  display: inline-block;
  margin: 0 8px;
  width: 24px; height: 24px;
}
.flvplayer_bot_om {
  position: relative;
}
.flvplayer_bot_omh {
  display: inline-block;
}
.flvplayer_bot_om.flvplayer_bot_om_h .flvplayer_bot_omh {
  display: none;
  position: absolute; left: -10px; bottom: 100%;
  background-color: #000;
  background-color: rgba(0, 0, 0, .7);
  padding: 10px 10px;
  border-radius: 4px;
  .flvplayer_opt {
    margin: 5px 8px;
  }
}
.flvplayer_bot_om_h:hover .flvplayer_bot_omh{
  display: block;
}
.player_cut { cursor: default; }
.player_tran { cursor: default; }
.player_add_sign {
  display: inline-block;
  position: relative; bottom: -3px; left: 10px;
  cursor: pointer;
  color: #999;
  &:hover {
    text-decoration: none;
  }
}
.player_download {
  transform: scale(0.85)
}
.flvplayer_dl_tl {
  float: left;
  -webkit-transform: translate3d(-50%, 0, 0);
  -moz-transform: translate3d(-50%, 0, 0);
  -ms-transform: translate3d(-50%, 0, 0);
  -o-transform: translate3d(-50%, 0, 0);
  transform: translate3d(-50%, 0, 0);
}
.flvplayer_dl_tr {
  float: right;
  -webkit-transform: translate3d(50%, 0, 0);
  -moz-transform: translate3d(50%, 0, 0);
  -ms-transform: translate3d(50%, 0, 0);
  -o-transform: translate3d(50%, 0, 0);
  transform: translate3d(50%, 0, 0);
}
.flvplayer_lux {
  position: absolute; left: 15px; top: 15px;
  width: 99px; height: 24px; line-height: 24px;
  background: url(../../assets/img/video/vi_110.png);
  color: #0C70F8; text-align: center; font-size: 14px;
  padding-left: 20px;
  cursor: default;
}
</style>
<style>
.player_box {
  position: absolute;
  border: 1px solid red;
}
.el-slider__marks-text {
  word-break:keep-all; white-space:nowrap;
}
</style>