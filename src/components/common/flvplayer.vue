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
    <span v-if="config.close && !fullScreen" class="vl_icon vl_icon_close" @click="playerClose" title="关闭"></span>
    <!-- <span v-else class="vl_icon vl_icon_close" @click="playerClose" title="关闭"></span> -->
    <!-- 暂停按钮 -->
    <span class="vl_icon vl_icon_v51" v-show="!playActive" @click="playerPlay(true)"></span>
    <div class="flvplayer_bot" :class="{'flvplayer_bot_dis': videoLoading}">
      <div class="flvplayer_bot_t com_ellipsis">{{oData.title}}</div>
      <div class="flvplayer_bot_o">
        <span>
          <!-- 播放/暂停 -->
          <span class="flvplayer_opt vl_icon vl_icon_v21" v-show="playActive" title="暂停" @click="playerPlay(false)"></span>
          <span class="flvplayer_opt vl_icon vl_icon_v22" v-show="!playActive" title="播放" @click="playerPlay(true)"></span>
          <!-- 音量 声音大小（0-1之间） myPlayer.volume(0.5); -->
          <span class="flvplayer_opt player_volume">
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
          </span>
        </span>
        <span class="flvplayer_bot_om" :class="{'flvplayer_bot_om_h': mini && !fullScreen}">
          <span class="flvplayer_bot_omh">
            <!-- 标记 -->
            <span v-if="config.sign" class="flvplayer_opt vl_icon vl_icon_v24 player_sign" title="标记" @click="addSign"></span>
            <!-- 录视频 -->
            <span class="flvplayer_opt vl_icon vl_icon_v25 player_tran" title="录视频"></span>
            <!-- 截屏 -->
            <span v-if="config.cut" class="flvplayer_opt vl_icon vl_icon_v26 player_cut" title="截屏"></span>
            <!-- 全屏 -->
            <span v-show="!fullScreen" class="flvplayer_opt vl_icon vl_icon_v27 player_fullscreen" title="全屏" @click="playerFullScreen(true)"></span>
            <!-- 局部放大 -->
            <template v-if="fullScreen">
              <span v-if="!enlarge" class="flvplayer_opt vl_icon vl_icon_v29" @click="playerEnlarge(true)" title="局部放大"></span>
              <span v-else class="flvplayer_opt vl_icon vl_icon_v292" @click="playerEnlarge(false)" title="取消局部放大"></span>
              <!-- 退出全屏 -->
              <span v-if="fullScreen" class="flvplayer_opt vl_icon vl_icon_v30" @click="playerFullScreen(false)" title="退出全屏"></span>
            </template>
          </span>
          <!-- 更多 -->
          <span v-if="!fullScreen" class="flvplayer_opt vl_icon vl_icon_v28" title="更多" @click="playerFullScreen(true)"></span>
        </span>
      </div>
    </div>
    <el-dialog v-if="config.sign" title="添加标记" :visible.sync="signDialogVisible" :center="false" :append-to-body="true" width="500px">
      <div style="padding: 30px 0 20px 30px; text-align: left; color: #666; font-size: 15px;">当前监控：{{oData.title}}</div>
      <el-form :model="signForm" :rules="signFormRules" ref="signForm" style="padding-left: 30px;">
        <el-form-item prop="content">
          <el-select v-model="signForm.content" placeholder="请选择标记内容" style="width: 200px;">
            <el-option v-for="(item, index) in signContentList" :label="item.content" :value="item.uid" :key="'sign_content_list' + index"></el-option>
          </el-select>
          <a href="javascript: void(0);" @click="signForm.addSign = true" class="player_add_sign"><span class="el-icon-plus"></span>新建标记内容</a>
        </el-form-item>
        <el-form-item prop="addSignContent" v-show="signForm.addSign">
          <el-input maxlength="20" :clearable="true" v-model="signForm.addSignContent" placeholder="新建标记内容" style="width: 200px;"></el-input>
          <el-button type="primary" :disabled="addSignSubmitAble" @click="addSignSubmit('signForm')" size="mini" style="margin-left: 15px;">确定</el-button>
          <el-button size="mini" @click="signForm.addSign = false">取消</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="padding: 0 0 20px 0;">
        <el-button @click="signDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="signSubmitLoading" @click="signSubmit('signForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {random14, formatDate} from '@/utils/util.js';
import { apiSignContentList, apiVideoSignContent, apiVideoSign, apiVideoRecord, apiVideoPlay, apiVideoPlayBack } from "@/views/index/api/api.video.js";
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
   *  }
   * oConfig: 播放配置信息
   *    pause: 开始是否暂停，默认为false
   *    sign: 是否可标记，默认为true
   *    signEmit: 标记成功后是否需要emit，默认为false
   *    close: 是否可删除，默认为true
   *    fullscreen: 是否可全屏，默认为true
   *    cut: 是否可截屏，默认为true
   * bResize: 播放容器尺寸变化
   */
  props: ['index', 'oData', 'oConfig', 'bResize'],
  data () {
    return {
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
        cut: true
      },

      startPlayTime: null,

      fullScreen: false,
      enlarge: false,
      volume: 0.5,
      volumeAble: true,

      signContentList: [],
      signDialogVisible: false,
      signForm: {
        signTime: '',
        content: '',
        addSign: false,
        addSignContent: ''
      },
      signFormRules: {
        content: [
          { required: true, message: '请选择标记内容', trigger: 'change' }
        ],
        addSignContent: [
          { required: true, message: '请填写标记内容', trigger: 'change' }
        ]
      },
      signSubmitLoading: false
    }
  },
  watch: {
    oData () {
      console.log('watch oData', this.oData);
      // 去掉暂停按钮
      this.playActive = true;
      this.relaodPlayer();
    },
    oConfig () {
      if (this.oConfig) {
        this.config = Object.assign(this.config, this.oConfig);
      }
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
      } else if (this.oData.type === 2 || this.oData.type === 3) {
        if (this.oData.startTime) {
          obj.startTime = formatDate(this.oData.startTime, 'yyyyMMddHHmmss');
        }
        if (this.oData.endTime) {
          obj.endTime = formatDate(this.oData.endTime, 'yyyyMMddHHmmss');
        }
        apiVideoPlayBack(obj).then(res => {
          if (res && res.data && res.data.length > 0) {
            // 为一个LIST
            if (res.data.length >= (this.playBackIndex + 1)) {
              console.log('回放第' + (this.playBackIndex + 1) + '段视频，URL：', _su);
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
      }
      
    },
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
        flvPlayer.play().then(() => {
          this.videoLoading = false;
          this.videoLoadingFailed = false;
          if (this.config.pause) {
            this.playActive = false;
            flvPlayer.pause();
          }
          this.startPlayTime = new Date().getTime();
        });
        this.player = flvPlayer;
        this.video = videoElement;
        if (this.oData.type != 1) {
          // 回放/录像的时候需要添加ended事件
          videoElement.addEventListener('ended', this.playNext, false);
        }
        // 加载失败
        window.setTimeout(() => {
          this.videoLoadingFailed = true;
        }, this.videoLoadingTimeout);
      }
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
      if (this.player) {
        this.player.unload();
        this.player.destroy();
        this.player.detachMediaElement();
        this.player = null;
        // 回放/录像的时候需要清除ended事件
        if (this.oData.type != 1) {
          this.video.removeEventListener('ended', this.playNext);
        }
      }
    },
    relaodPlayer () {
      this.destroyPlayer();
      this.initPlayer();
    },
    /***** 视频事件 *****/
    // 播放/暂停
    playerPlay (flag) {
      this.playActive = flag;
      if (this.player) {
        if (flag) {
          if (this.oData.type === 1) {
            // 直播 播放的时候需要重新加载
            this.destroyPlayer();
            this.playActive = true; // 去掉暂停按钮
            this.config.pause = false;
            this.initPlayer();
          } else {
            // 回放/录像 播放的时候直接play
            this.player.play();
          }
        } else {
          this.player.pause();
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
          console.log('startX:', startX);
          console.log('startY:', startY);
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
      this.fullScreen = flag;
      this.playerEnlarge(false);
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
      this.$refs[formName].validateField("content", (errorMessage) => {
        // errorMessage 为空就是验证成功了
        if (!errorMessage) {
          this.signSubmitLoading = true;
          apiVideoSign({
            contentId: this.signForm.content,
            deviceId: this.oData.video.uid,
            signTime: formatDate(this.signForm.signTime - 1000 * 60 * 60 * 24),
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
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    /* addSignSubmitAble () {
      let flag = false;
      if (!this.signForm.addSignContent) {

      }
      return flag;
    }, */
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
                message: '新建标记内容成功！',
                type: 'success'
              });
              this.signForm.addSignContent = '';
            }
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
    saveVideoRecord () {
      if ((this.oData.type === 2 || this.oData.type === 1) && this.oData.record) {
        let playBack = {};
        // if (this.oData.type === 2) {
        playBack.playBackStartTime = formatDate(this.startPlayTime ? this.startPlayTime : new Date()); // 回放开始时间
        playBack.playBackEndTime = formatDate(new Date().getTime()); // 回放结束时间
        // }
        apiVideoRecord(Object.assign({
          deviceId: this.oData.video.uid, // 设备id
          playTime: formatDate(this.startPlayTime ? this.startPlayTime : new Date()), // 播放结束时间
          // 播放类型 1:视频巡逻 2:视频回放
          playType: this.oData.type
        }, playBack)).then(() => {
        }).catch(error => {
          console.log("apiVideoRecord error：", error);
        });
      }
    },
    // 浏览器unload事件
    videoUnloadSave () {
      this.saveVideoRecord();
    },
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
.player_cut { cursor: not-allowed; }
.player_tran { cursor: not-allowed; }
.player_add_sign {
  display: inline-block;
  position: relative; bottom: -3px; left: 10px;
  cursor: pointer;
  &:hover {
    text-decoration: none;
  }
}
</style>
<style>
.player_box {
  position: absolute;
  border: 1px solid red;
}
</style>

