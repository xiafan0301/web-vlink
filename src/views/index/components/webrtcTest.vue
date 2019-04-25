<template>
  <div class="wrt_main">
    <div is="webrtc"></div>
  </div>
</template>
<script>
import webrtc from '@/components/common/webrtc.vue';
export default {
  components: {webrtc},
  data () {
    return {
      aData: [{}, {}, {}]
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.wrt_main {
  position: relative;
  width: 100%; height: 100%;
}
</style>
