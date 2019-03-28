<template>
  <div class="vl_rtmpplayer">
    <div>
      <!-- poster="videojs/eguidlogo.png" -->
      <!-- :id="rtmpplayerId" -->
      <video :id="rtmpplayerId"
        class="video-js vjs-fluid" style="width: 100%; height: 100%;">
        <!--  
          <source src="../output.mp4" type='video/mp4'>  mp4格式  
          <source src='rtmp://127.0.0.1/hls/test' type='rtmp/flv'/> rtmp格式  
          <source src='http://127.0.0.1/hls/test.m3u8' type='application/x-mpegURL'/>  m3u8格式  
          <source src='http://live.hkstv.hk.lxdns.com/live/hks/playlist.m3u8' type='application/x-mpegURL'/> m3u8格式，可用  
        -->
        <source src='rtmp://10.16.1.139/live/livestream' type='rtmp/flv'/>
        <!-- <source src="../../assets/video/video.mp4" type='video/mp4'> -->
        <!-- 香港卫视 -->
        <!-- <source src='rtmp://live.hkstv.hk.lxdns.com/live/hks1' type='rtmp/flv'/> -->
        <!-- <source src='rtmp://live.hkstv.hk.lxdns.com/live/hks1' type='rtmp/flv'/> -->
      </video>
    </div>
  </div>
</template>
<script>
import {random14} from '@/utils/util.js';
export default {
  data () {
    return {
      player: null,
      rtmpplayerId: 'rtmp_' + random14()
    }
  },
  mounted () {
    // flash路径，有一些html播放不了的视频，就需要用到flash播放。这一句话要加在在videojs.js引入之后使用
    // window.videojs.options.flash.swf = "/static/lib/videojs7.4.1/video-js.swf";
    // window.videojs.options.flash.swf = "https://cdn.bootcss.com/videojs-swf/5.4.2/video-js.swf";
    let player = window.videojs(this.rtmpplayerId, {
      autoplay: false, // 自动播放：true/false
      controls: false, // 是否显示底部控制栏：true/false
      // width: 600, // 视频播放器显示的宽度 例如：200 or "200px"
      // height: 400, // 视频播放器显示的高度
      // aspectRatio: '1:1', // 将播放器置于流体模式下，计算播放器动态大小时使用该值。如“16:9”或“4:3”
      loop: false, // 否循环播放:true/false
      muted: false, // 设置默认播放音频：true/false
      preload: 'metadata', // 预加载:preload auto即加载视频 metadata只加载视频的元数据
      poster: '', // 视频开始播放前显示的图像的URL。
      src: '', // 要嵌入的视频资源url
      fluid: true, // 是否自适应布局 播放器将会有流体体积。换句话说，它将缩放以适应容器
                  // 如果<video>标签有“vjs-fluid”样式时，这个选项会自动设置为true
      inactivityTimeout: 0, // 闲置超时  值为0表示没有
      live: true,
    });
    player.play();
    this.player = player;
  },
  methods: {
  },
  beforeDestroy () {
    if (this.player) {
      console.log('beforeDestroy----', this.rtmpplayerId);
      // this.player.pause();
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
  > div {
    width: 100%; height: 100%;
    /* position: absolute; top: 50%; left: 50%;
    -webkit-transform: translate3d(-50%, -50%, 0);
    -moz-transform: translate3d(-50%, -50%, 0);
    -ms-transform: translate3d(-50%, -50%, 0);
    -o-transform: translate3d(-50%, -50%, 0);
    transform: translate3d(-50%, -50%, 0); */
  }
}
</style>
