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
.portrait_content { height: 100%; }
.my_tooltip{
  position: absolute;
  background:rgba(255,255,255,1);
  box-shadow:0px 7px 16px 0px rgba(13,32,81,0.1);
  border-radius:4px;
  color: #030852;
  transition: visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s;
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif;
  line-height: 20px;
  padding: 10px 10px 6px;
}
</style>
