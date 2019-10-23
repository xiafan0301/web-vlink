<template>
  <div class="video_setting_main">
    <div class="ar-tab-nav">
      <div><router-link :to="{ name: 'custom_group'}" @click.native = "state = 1">自定义组</router-link></div>
      <div><router-link :to="{ name: 'tirotation_setting'}" @click.native = "state = 2">轮巡设置</router-link></div>
      <div><router-link :to="{ name: 'device_authorize'}" @click.native = "state = 3">设备授权</router-link></div>
      <div><router-link :to="{ name: 'mark_manage'}" @click.native = "state = 4">标记管理</router-link></div>
    </div>
    <div>
      <!-- <transition enter-active-class="fade-in" leave-active-class="leave-immediately"
                  :duration="{ enter: 300, leave: 100 }"> -->
        <router-view></router-view>
      <!-- </transition> -->
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      state: 1
    }
  }
}
</script>
<style lang="scss" scoped>
.video_setting_main {
  padding: 20px;
  height: 100%;
  > .ar-tab-nav {
    background-color: #ffffff;
    padding-top: 8px;
    overflow: hidden;
    border-bottom: 1px solid #F2F2F2;
    border-radius: 4px;
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    > div {
        float: left;
        width: auto;
        font-size: 16px;
        margin: 0 20px;
      > a {
        display: block;
        height: 44px;
        line-height: 44px;
        text-align: center;
        cursor: pointer;
        color: #333333;
        text-decoration: none !important;
        &.router-link-exact-active {
          color: #0C70F8;
          cursor: default;
          border-bottom: 2px solid #0C70F8;
        }
      }
    }
  }
  div:last-child {
    height: calc(100% - 30px);
  }
}
</style>
