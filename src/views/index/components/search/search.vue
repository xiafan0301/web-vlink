<template>
  <div class="vl_sear clearfix">
    <ul class="vl_smenu">
      <li>
        <router-link :to="{name: 'search_capture'}">抓拍检索</router-link>
      </li>
      <li>
        <router-link :to="{name: 'search_portrait'}">人像检索</router-link>
      </li>
      <li>
        <router-link :to="{name: 'search_contrast'}">人像对比</router-link>
      </li>
      <li>
        <router-link :to="{name: 'search_history'}">检索历史</router-link>
      </li>
    </ul>
    <div class="sear_content">
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
.vl_sear {
  position: relative;
  height: 100%;
  > .sear_content {
    height: 100%;
    padding-left: 200px;
  }
}
</style>
