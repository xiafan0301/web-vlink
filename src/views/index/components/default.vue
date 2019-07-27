<template>
  <div class="vl_main">
    <div is="vlinkHeader"></div>
    <div class="vl_content">
      <router-view></router-view>
    </div>
    <!--视频通话-->
    <div is="webrtc"></div>
    <div is="imgZoom"></div>
  </div>
</template>
<script>
import webrtc from '@/components/common/webrtc.vue';
import vlinkHeader from '../../../components/header.vue';
import imgZoom from '@/components/common/imgZoom.vue';
export default {
  components: {vlinkHeader, webrtc, imgZoom},
  data () {
    return {
    }
  },
  computed: {
    unLogin () {
      return this.$store.state.loginToken;
    }
  },
  watch: {
    unLogin () {
      if (!this.$store.state.loginToken) {
        this.reLogin();
      }
    }
  },
  mounted () {
  },
  methods: {
    reLogin () {
      console.log('reLogin');
      localStorage.setItem('as_vlink_user_info', '');
      this.$router.push({name: 'login'});
    }
  }
}
</script>
<style lang="scss" scoped>
.vl_main {
  height: 100%;
  min-width: 1200px;
  min-height: 575px;
  > .vl_content {
    padding-top: 100px;
    height: 100%;
    background-color: #fafafa;
  }
}
</style>
