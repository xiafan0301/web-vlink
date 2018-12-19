<template>
  <div class="vl_video clearfix">
    <ul class="vi_menu">
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
      <li>
        <router-link :to="{name: 'video_setting'}">视频设置</router-link>
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
  > .vi_menu {
    position: absolute; top: 0; left: 0;
    width: 200px; height: 100%;
    box-shadow:4px 0px 10px 0px #838383;
    box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
    > li {
      height: 60px; line-height: 60px;
      text-align: center;
      > a {
        display: block;
        width: 100%; height: 100%;
        padding-right: 10px;
        color: #282D44; font-size: 14px;
        text-decoration: none !important;
        border-left: 4px solid #fff;
        transition: all .4s ease-out;
        &.router-link-active {
          color: #0C70F8;
          border-color: #0C70F8;
          background-color: #E0F3FF;
          cursor: default;
        }
      }
    }
  }
  > .vi_content {
    height: 100%;
    padding-left: 200px;
  }
}
</style>
