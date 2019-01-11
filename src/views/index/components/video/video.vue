<template>
  <div class="vl_video clearfix">
    <ul class="vl_smenu">
      <li>
        <router-link :to="{name: 'video_patrol'}">视频巡逻</router-link>
      </li>
      <li>
        <router-link :to="{name: 'video_playback'}">录像回放</router-link>
      </li>
      <li>
        <router-link :to="{name: 'video_query'}">智能查看</router-link>
      </li>
      <li>
        <router-link :to="{name: 'video_signList'}">标记列表</router-link>
      </li>
      <li>
        <router-link :to="{name: 'video_download'}">下载记录</router-link>
      </li>
      <!-- <li>
        <router-link :to="{name: 'video_setting'}">视频设置</router-link>
      </li> -->
      <li>
        <router-link :to="{name: 'video_statistics'}">设备概览</router-link>
      </li>
    </ul>
    <div class="vi_content">
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
.vl_video {
  position: relative;
  height: 100%;
  > .vi_content {
    height: 100%;
    padding-left: 200px;
    overflow: auto;
  }
}
</style>
