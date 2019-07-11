<template>
  <div class="vid_relay">
    接力地图
  </div>
</template>
<script>
import {formatDate} from '@/utils/util.js';
export default {
  data () {
    return {
    }
  },
  mounted () {
    $('title').text('接力地图');
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.vid_relay {
  position: relative;
  width: 100%; height: 100%;
  overflow: hidden;
}
.vid_relay_menu {
  position: absolute; left: 0; top: 0;
}
</style>