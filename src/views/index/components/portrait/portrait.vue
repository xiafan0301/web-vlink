<template>
  <div class="vl_portrait clearfix">
    <div class="ptt_content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.vl_portrait {
  position: relative;
  height: 100%;
  > .ptt_content {
    height: 100%;
    overflow: auto;
  }
}
</style>
<!-- 人像检索公用CSS -->
<style lang="scss">
</style>
