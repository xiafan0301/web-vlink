<template>
  <div class="vl_task clearfix">
    <ul class="vl_smenu">
      <li>
        <router-link :to="{name: 'task_list'}">全部任务</router-link>
      </li>
    </ul>
    <div class="task_content">
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
.vl_task {
  position: relative;
  height: 100%;
  > .task_content {
    height: 100%;
    padding-left: 200px;
    overflow: auto;
  }
}
</style>