<template>
  <div class="vl_alarm clearfix">
    <ul class="vl_smenu">
      <li>
        <router-link :to="{name: 'today_alarm'}">今日告警</router-link>
      </li>
      <li>
        <router-link :to="{name: 'history_alarm'}">历史告警</router-link>
      </li>
      <li>
        <router-link :to="{name: 'alarm_statistics'}">告警统计</router-link>
      </li>
    </ul>
    <div class="alarm_content">
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
.vl_alarm {
  position: relative;
  height: 100%;
  > .alarm_content {
    height: 100%;
    padding-left: 200px;
    overflow: auto;
  }
}
</style>