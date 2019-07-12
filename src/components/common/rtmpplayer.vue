<template>
  <div class="vl_rtmpplayer" :class="{'rtmpplayer_fullscreen': fullScreen}">
    <div class="rtmpplayer_player" :id="rtmpplayerId + '_container'">
      <!-- poster="videojs/eguidlogo.png" -->
      <div class="rtmpplayer_player_c" :id="rtmpplayerId + '_c'">
        <video :id="rtmpplayerId"
          class="video-js vjs-fluid" style="width: 100%; height: 100%;" autoplay="autoplay" muted type='rtmp/flv'>
          <!-- <source src='rtmp://10.16.1.139/live/livestream' type='rtmp/flv'/> -->
          <!-- <source src='rtmp://live.hkstv.hk.lxdns.com/live/hks1' type='rtmp/flv'/> -->
        </video>
      </div>
    </div>
    <span v-if="fullScreen" class="vl_icon player_out_fullscreen vl_icon_v30" @click="playerFullScreen(false)" title="退出全屏"></span>
    <span v-else class="vl_icon vl_icon_close" @click="playerClose" title="关闭"></span>
    <span class="vl_icon vl_icon_v51" v-show="!playActive" @click="playerPlay(true)"></span>
    <div class="rtmpplayer_bot">
      <div class="rtmpplayer_bot_t">{{oData.title}}</div>
      <div class="rtmpplayer_bot_o">
        <!-- 播放/暂停 -->
        <span class="vl_icon vl_icon_v21" v-show="playActive" title="暂停" @click="playerPlay(false)"></span>
        <span class="vl_icon vl_icon_v22" v-show="!playActive" title="播放" @click="playerPlay(true)"></span>
        <!-- 音量 声音大小（0-1之间） myPlayer.volume(0.5); -->
        <span class="player_volume">
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
        <!-- 标记 -->
        <span v-if="signAble" class="vl_icon vl_icon_v24 player_sign" title="标记" @click="addSign"></span>
        <!-- 录视频 -->
        <span class="vl_icon vl_icon_v25 player_tran" title="录视频"></span>
        <!-- 截屏 -->
        <span class="vl_icon vl_icon_v26 player_cut" title="截屏"></span>
        <!-- 全屏 -->
        <span v-show="!fullScreen" class="vl_icon vl_icon_v27 player_fullscreen" title="全屏" @click="playerFullScreen(true)"></span>
        <!-- 局部放大 -->
        <template v-if="fullScreen">
          <span v-if="!enlarge" class="vl_icon vl_icon_v29" @click="playerEnlarge(true)" title="局部放大"></span>
          <span v-else class="vl_icon vl_icon_v292" @click="playerEnlarge(false)" title="取消局部放大"></span>
        </template>
        <!-- 更多 -->
        <span class="vl_icon vl_icon_v28" title="更多"></span>
        <span v-if="fullScreen" class="vl_icon vl_icon_v30" @click="playerFullScreen(false)" title="退出全屏"></span>
      </div>
    </div>
    <el-dialog v-if="signAble" title="添加标记" :visible.sync="signDialogVisible" :center="false" width="500px">
      <div style="padding: 30px 0 20px 30px; text-align: left; color: #666;">当前监控：{{oData.title}}</div>
      <el-form :model="signForm" :rules="signFormRules" ref="signForm" style="padding-left: 30px;">
        <el-form-item prop="content">
          <el-select v-model="signForm.content" placeholder="请选择标记内容">
            <el-option v-for="(item, index) in signContentList" :label="item.content" :value="item.uid" :key="'sign_content_list' + index"></el-option>
          </el-select>
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
import { apiSignContentList, apiVideoSign } from "@/views/index/api/api.video.js";
export default {
  props: ['index', 'oData', 'signAble'],
  data () {
    return {
      playActive: true,
      player: null,
      rtmpplayerId: 'rtmp_' + random14(),

      fullScreen: false,
      enlarge: false,
      volume: 0.5,
      volumeAble: true,

      signContentList: [],
      signDialogVisible: false,
      signForm: {
        signTime: '',
        content: ''
      },
      signFormRules: {
        content: [
          { required: true, message: '请选择标记内容', trigger: 'change' }
        ]
      },
      signSubmitLoading: false
    }
  },
  watch: {
    oData () {
      if (this.player) {
        // console.log('watch oData', this.oData);
        this.player.src(this.oData.video.deviceSip); /*动态设置video.js播放的地址。*/
        this.player.autoplay();
      }
    },
    volume () {
      if (this.volume <= 0) {
        this.volumeAble = false;
      } else {
        this.volumeAble = true;
      }
      if (this.player) {
        this.player.volume(this.volume);
      }
    }
  },
  mounted () {
    let _this = this;
    // console.log('this.rtmpplayerId', this.rtmpplayerId);
    // console.log('player oData:', this.oData);
    // flash路径，有一些html播放不了的视频，就需要用到flash播放。这一句话要加在在videojs.js引入之后使用
    // window.videojs.options.flash.swf = "/static/lib/videojs7.4.1/video-js.swf";
    // window.videojs.options.flash.swf = "https://cdn.bootcss.com/videojs-swf/5.4.2/video-js.swf";
    let player = window.videojs(this.rtmpplayerId, {
      autoplay: true, // 自动播放：true/false
      controls: false, // 是否显示底部控制栏：true/false
      // width: 600, // 视频播放器显示的宽度 例如：200 or "200px"
      // height: 400, // 视频播放器显示的高度
      // aspectRatio: '1:1', // 将播放器置于流体模式下，计算播放器动态大小时使用该值。如“16:9”或“4:3”
      loop: false, // 否循环播放:true/false
      muted: false, // 设置默认播放音频：true/false
      preload: 'metadata', // 预加载:preload auto即加载视频 metadata只加载视频的元数据
      poster: '', // 视频开始播放前显示的图像的URL。
      // src: this.oData.video.url, // 要嵌入的视频资源url
      fluid: true, // 是否自适应布局 播放器将会有流体体积。换句话说，它将缩放以适应容器
                  // 如果<video>标签有“vjs-fluid”样式时，这个选项会自动设置为true
      inactivityTimeout: 0, // 闲置超时  值为0表示没有
      live: true,
      sources: [{
        src: this.oData.video.deviceSip,
        type: 'rtmp/flv'
      }],
      flash: {
        swf: './static/lib/videojs7.4.1/video-js.swf'
      }
    }, function () {
      player.play();
      player.volume(_this.volume);
      _this.player = player;
    });
  },
  methods: {
    /***** 视频事件 *****/
    // 播放/暂停
    playerPlay (flag) {
      this.playActive = flag;
      if (this.player) {
        if (flag) {
          this.player.play();
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
      if (this.player) {
        this.player.volume(_vo);
      }
    },
    // 局部放大
    playerEnlarge (flag) {
      // rtmpplayerId + '_container'
      let nTarget = $('#' + this.rtmpplayerId + '_container');
      let $c = $('#' + this.rtmpplayerId + '_c');
      if (flag) {
        this.enlarge = true;
        let startX, startY;
        let boxId = this.rtmpplayerId + '_box';
        let _this = this;
        // e.target.offsetLeft
        nTarget.on('mousedown', function (e) {
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
            box.width(Math.floor(e.pageX - startX));
            box.height(Math.floor(e.pageY - startY));
          }
        });
        // 鼠标抬起
        nTarget.on('mouseup', function (e) {
          let box = $('#' + boxId);
          if(box && box.length > 0) {
            // 如果长宽均小于 3px，移除 box
            if(box.width() < 10 || box.height() < 10) {
                box.remove();
                // 可以继续
            } else {
              /* nTarget.off('mousedown');
              nTarget.off('mousemove');
              nTarget.off('mouseup'); */

              let ow = nTarget.width(), oh = nTarget.height();
              let bw = box.width(), bh = box.height();
              let cw = $c.width(), ch = $c.height();
              console.log('ow:' + ow + '--oh:' + oh);
              console.log('cw:' + ow + '--cw:' + oh);
              console.log('bw:' + ow + '--bw:' + oh);
              // 视频分辨率 1920 * 1080
              if (bw / bh > ow / oh) {
                bh = Math.floor(bw * oh / ow);
              } else {
                bw = Math.floor(ow / oh * bh);
              }
              console.log('bw:' + bw + '--bh:' + bh);
              let inDO = cw / ow; // 之前放大的倍数
              let inD = ow / bw * (cw / ow); // 放大的倍数
              console.log('inDO:' + inDO);
              console.log('inD:' + inD);
              // if (inD > 4) { inD = 4; } // 最大放大到4倍
              // startX startY
              $c.width(Math.floor(ow * inD));
              $c.height(Math.floor(oh * inD));
              console.log('$c.width:' + $c.width());
              let iML = $c.css('margin-left').replace(/px/, '');
              let iMT = $c.css('margin-top').replace(/px/, '');
              console.log('iML:', iML);
              console.log('iMT:', iMT);
              $c.css({
                'margin-left': -Math.floor((inD - inDO + 1) * startX - inDO * iML) + 'px',
                'margin-top': -Math.floor((inD - inDO + 1) * startY - inDO * iMT) + 'px'
              });
              console.log('margin-left:', $c.css('margin-left'));
              console.log('margin-top:', $c.css('margin-top'));
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
      /* if (this.player) {
        console.log('this.player', this.player);
        if (flag) {
          this.player.requestFullscreen();
        } else {
          this.player.exitFullscreen();
        }
      } */
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.signSubmitLoading = true;
          apiVideoSign({
            contentId: this.signForm.content,
            deviceId: this.oData.video.uid,
            signTime: formatDate(this.signForm.signTime),
          }).then(res => {
            this.signSubmitLoading = false;
            this.signDialogVisible = false;
            this.$message({
              message: '标记成功！',
              type: 'success'
            });
          }).catch(error => {
            console.log("apiSignContentList error：", error);
            this.signSubmitLoading = false;
          });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    }
  },
  beforeDestroy () {
    if (this.player) {
      // 销毁
      this.player.dispose();
      this.player = null;
    }
    $('#' + this.rtmpplayerId).html('&nbsp;');
    // $('#' + this.rtmpplayerId + '_Flash_api').remove();
  }
}
</script>
<style lang="scss" scoped>
.vl_rtmpplayer {
  position: relative;
  width: 100%; height: 100%;
  overflow: hidden;
  &.rtmpplayer_fullscreen {
    position: fixed; z-index: 100; top: 0; left: 0;
  }
  > .rtmpplayer_player {
    position: relative;
    width: 100%; height: 100%;
    overflow: hidden;
    background: #000;
    > .rtmpplayer_player_c {
      width: 100%; height: 100%;
    }
  }
  > .player_out_fullscreen {
    position: absolute; top: 10px; right: 10px; z-index: 10;
    cursor: pointer;
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
  > .rtmpplayer_bot {
    position: absolute; left: 0; bottom: -48px;
    width: 100%; height: 48px;
    background-color: #000;
    background-color: rgba(34, 34, 34, 0.65);
    transition: bottom 0.4s ease-out;
    > .rtmpplayer_bot_t {
      float: left;
      height: 48px; line-height: 48px; max-width: 40%;
      padding-left: 20px;
      color: #fff; font-size: 16px;
      overflow: hidden;
    }
    > .rtmpplayer_bot_o {
      float: right;
      padding-top: 12px; padding-right: 20px;
      > span {
        display: inline-block;
        margin: 0 8px;
        width: 24px; height: 24px;
      }
      > .player_cut { cursor: not-allowed; }
      > .player_tran { cursor: not-allowed; }
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
  &:hover {
    > .rtmpplayer_bot { bottom: 0; }
  }
}
</style>
<style>
.player_box {
  position: absolute;
  border: 1px solid red;
}
</style>

