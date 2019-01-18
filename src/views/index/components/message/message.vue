<template>
  <div class="vl_message clearfix">
    <ul class="vl_smenu">
      <li>
        <router-link :to="{name: 'message_help'}">民众互动</router-link>
      </li>
      <li>
        <router-link :to="{name: 'message_notice'}">公告管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'message_note'}">短信通知</router-link>
      </li>
      <li>
        <router-link :to="{name: 'message_system'}">系统消息</router-link>
      </li>
    </ul>
    <div class="mes_content">
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
<style lang="scss">
.vl_message {
  position: relative;
  height: 100%;
  > .mes_content {
    height: 100%;
    padding-left: 200px;
  }
}
</style>