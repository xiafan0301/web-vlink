<template>
  <div class="vi_list_empty">
    <div class="com_trans50_lt">
      <video id="my-video" class="video-js vjs-default-skin vjs-big-play-centered"  
        poster="videojs/eguidlogo.png" width="800" height="600">  
          <!--  
            <source src="../output.mp4" type='video/mp4'>  mp4格式  
            <source src='rtmp://127.0.0.1/hls/test' type='rtmp/flv'/> rtmp格式  
            <source src='http://127.0.0.1/hls/test.m3u8' type='application/x-mpegURL'/>  m3u8格式  
            <source src='http://live.hkstv.hk.lxdns.com/live/hks/playlist.m3u8' type='application/x-mpegURL'/> m3u8格式，可用  
          -->  
          <video class="" type='rtmp/flv' src="rtmp://10.16.1.139/live/livestream" autoplay loop controls></video>  
      </video>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    addVideoEvent () {
      this.$emit('showListEvent');
    }
  }
}
</script>
<style lang="scss" scoped>
.vi_list_empty {
  position: relative;
  width: 100%; height: 100%;
  > div {
    position: absolute; top: 50%; left: 50%;
    max-width: 80%;
    > img { width: 100%; }
    > p { text-align: center; color: #999; font-size: 12px; }
    > div { padding-top: 10px; text-align: center; }
  }
}
</style>
