<template>
  <div class="vl_manage clearfix">
    <ul class="vl_smenu">
      <li>
        <router-link :to="{name: 'event_audit'}">视频设置</router-link>
      </li>
      <li>
        <router-link :to="{name: 'event_manage'}">基础信息库</router-link>
      </li>
      <li>
        <router-link :to="{name: 'manage_department'}">部门架构</router-link>
      </li>
      <li>
        <router-link :to="{name: 'user'}">用户管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'event_statistics'}">角色管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'event_statistics'}">权限管理</router-link>
      </li>
    </ul>
    <div class="manage_content">
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
.vl_manage {
  position: relative;
  height: 100%;
  > .manage_content {
    height: 100%;
    padding-left: 200px;
  }
}
</style>