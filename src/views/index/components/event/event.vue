<template>
  <div class="vl_event clearfix">
    <ul class="vl_smenu">
      <li>
        <router-link :to="{name: 'event_audit'}">受理核实</router-link>
      </li>
      <li>
        <router-link :to="{name: 'event_manage'}">事件管理</router-link>
      </li>
      <li>
        <router-link :to="{name: 'event_ctc'}">调度指挥</router-link>
      </li>
      <li>
        <router-link :to="{name: 'event_ctcplan'}">调度预案</router-link>
      </li>
      <li>
        <router-link :to="{name: 'event_statistics'}">统计分析</router-link>
      </li>
    </ul>
    <div class="eve_content">
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
.vl_event {
  position: relative;
  height: 100%;
  > .eve_content {
    height: 100%;
    padding-left: 200px;
  }
}
</style>