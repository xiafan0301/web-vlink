<template>
  <header class="vl_header clearfix">
    <div class="hd_log">LOGO</div>
    <ul class="hd_menu">
      <li>
        <router-link :to="{name: 'video'}">
          <i class="vl_icon vl_icon_001"></i>
          <span>视频</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'map'}">
          <i class="vl_icon vl_icon_002"></i>
          <span>地图</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'event'}">
          <i class="vl_icon vl_icon_003"></i>
          <span>事件</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'judge'}">
          <i class="vl_icon vl_icon_004"></i>
          <span>研判</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'search'}">
          <i class="vl_icon vl_icon_005"></i>
          <span>检索</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'control'}">
          <i class="vl_icon vl_icon_006"></i>
          <span>布控</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'message'}">
          <i class="vl_icon vl_icon_007"></i>
          <span>消息</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'manage'}">
          <i class="vl_icon vl_icon_008"></i>
          <span>管理</span>
        </router-link>
      </li>
    </ul>
    <div class="hd_user">
    </div>
  </header>
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
.vl_header {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100px;
  background-color: #0C70F8;
  background: -webkit-linear-gradient(to bottom, #0C70F8, #0466DE);
  background: -moz-linear-gradient(to bottom, #0C70F8, #0466DE);
  background: linear-gradient(to bottom, #0C70F8, #0466DE);
  > .hd_log {
    float: left;
  }
  > .hd_menu {
    float: left;
    overflow: hidden;
    padding-top: 10px;
    height: 100%;
    > li {
      float: left;
      height: 100%;
      > a {
        display: block;
        width: 110px; height: 90px;
        font-size: 16px; color: #fff;
        border-radius: 8px 8px 0 0;
        text-decoration: none !important;
        text-align: center;
        transition: all .4s ease-out;
        overflow: hidden;
        > i {
          display: block;
          margin: 15px auto 0 auto;
        }
        > span {
          display: block;
          padding-top: 4px;
        }
        &:hover {
          background-color: #2682FF;
        }
        &.router-link-active {
          background-color: #2682FF;
          cursor: default;
        }
      }
    }
  }
  > .hd_user {
    float: right;
  }
}
</style>
