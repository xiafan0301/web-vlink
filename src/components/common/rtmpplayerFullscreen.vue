<template>
  <div class="vl_rtmpplayer_fs" :id="rtmpplayerId + '_container'">
    <div class="rtmpplayer_player">
      <!-- poster="videojs/eguidlogo.png" -->
      <video :id="rtmpplayerId"
        class="video-js vjs-fluid" style="width: 100%; height: 100%;" autoplay="autoplay" muted type='rtmp/flv'>
        <!-- <source src='rtmp://10.16.1.139/live/livestream' type='rtmp/flv'/> -->
        <!-- <source src='rtmp://live.hkstv.hk.lxdns.com/live/hks1' type='rtmp/flv'/> -->
      </video>
    </div>
    <span class="vl_icon vl_icon_close" @click="playerClose"></span>
    <span class="vl_icon vl_icon_v51" v-show="!playActive" @click="playerPlay(true)"></span>
    <div class="rtmpplayer_bot">
      <div class="rtmpplayer_bot_t">{{oData.title}}</div>
      <div class="rtmpplayer_bot_o">
        <!-- 播放/暂停 -->
        <span class="vl_icon vl_icon_v21" v-show="playActive" title="暂停" @click="playerPlay(false)"></span>
        <span class="vl_icon vl_icon_v22" v-show="!playActive" title="播放" @click="playerPlay(true)"></span>
        <!-- 音量 声音大小（0-1之间） myPlayer.volume(0.5); -->
        <span class="vl_icon vl_icon_v23 player_voice" title="音量"></span>
        <!-- 标记 -->
        <span v-if="signAble" class="vl_icon vl_icon_v24 player_sign" title="标记" @click="addSign"></span>
        <!-- 录视频 -->
        <span class="vl_icon vl_icon_v25 player_tran" title="录视频"></span>
        <!-- 截屏 -->
        <span class="vl_icon vl_icon_v26 player_cut" title="截屏"></span>
        <!-- 全屏 -->
        <span class="vl_icon vl_icon_v27 player_fullscreen" title="全屏" @click="playerFullScreen(true)"></span>
        <!-- 更多 -->
        <span class="vl_icon vl_icon_v28" title="更多"></span>
      </div>
    </div>
    <el-dialog v-if="signAble" title="添加标记" :visible.sync="signDialogVisible" :center="false" width="500px">
      <div style="padding: 30px 0 20px 30px; text-align: left; color: #666;">当前监控：{{oData.title}}</div>
      <el-form :model="signForm" :rules="signFormRules" ref="signForm" style="padding-left: 30px;">
        <el-form-item prop="content">
          <el-select v-model="signForm.content" placeholder="请选择标记内容">
            <el-option v-for="(item, index) in signContentList" :label="item" :value="item" :key="'sign_content_list' + index"></el-option>
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
import {random14, drawBorder} from '@/utils/util.js';
import { apiSignContentList, apiVideoSign } from "@/views/index/api/api.video.js";
export default {
  props: ['index', 'oData', 'signAble'],
  data () {
    return {
      playActive: true,
      player: null,
      rtmpplayerId: 'rtmp_' + random14(),

      signContentList: [],
      signDialogVisible: false,
      signForm: {
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
    }
  },
  mounted () {
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
      muted: true, // 设置默认播放音频：true/false
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
    });
    player.play();
    this.player = player;

    // rtmpplayerId + '_container'
    drawBorder.init(this.rtmpplayerId + '_container');
  },
  methods: {
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
    playerFullScreen (flag) {
      if (this.player) {
        console.log('this.player', this.player);
        if (flag) {
          this.player.requestFullscreen();
        } else {
          this.player.exitFullscreen();
        }
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
            content: this.signForm.content,
            deviceId: '213213',
            signTime: '',
          }).then(res => {
            if (res && res.data) {
              this.signContentList = res.data;
            }
            this.signSubmitLoading = false;
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
  position: fixed;
  width: 100%; height: 100%;
  > .rtmpplayer_player {
    width: 100%; height: 100%;
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
    overflow: hidden;
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
      }
      > .player_cut { cursor: not-allowed; }
      > .player_voice { cursor: not-allowed; }
      > .player_tran { cursor: not-allowed; }
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

