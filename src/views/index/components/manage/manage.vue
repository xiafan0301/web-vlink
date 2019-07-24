<template>
  <div class="vl_manage clearfix">
    <ul class="vl_smenu">
      <li>
        <router-link :to="{name: 'set_video'}">视频设置</router-link>
      </li>
      <li>
        <router-link :to="{name: 'basic_info'}">基础信息库</router-link>
      </li>
      <li>
        <router-link :to="{name: 'special_ehicle'}">特殊车辆管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'bayonet_manage'}">卡口管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'archives_manage'}">档案管理</router-link>
      </li>
       <li>
        <router-link :to="{name: 'camera_manage'}">摄像头管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'user'}">用户管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'role_manage'}">角色管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'authority_info'}">权限管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'service_blacklist'}">服务黑名单</router-link>
      </li>
      <li>
        <router-link :to="{name: 'version_manage'}">APP版本管理</router-link>
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
  overflow: hidden;
  > .manage_content {
    height: 100%;
    padding-left: 200px;
  }
}
</style>