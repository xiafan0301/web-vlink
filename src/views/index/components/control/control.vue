<template>
  <div class="vl_control clearfix">
    <ul class="vl_smenu">
      <li>
        <router-link :to="{name: 'control_map'}">布控地图</router-link>
      </li>
      <li>
        <router-link :to="{name: 'control_manage'}">布控管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'control_create'}">新建布控</router-link>
      </li>
      <li>
        <router-link :to="{name: 'control_library'}">布控库</router-link>
      </li>
    </ul>
    <div class="con_content">
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
.vl_control {
  position: relative;
  height: 100%;
  > .con_content {
    height: 100%;
    padding-left: 200px;
  }
}
</style>