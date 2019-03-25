<template>
  <div class="main">
    <div class="ar-tab-nav">
      <div><router-link :to="{ name: 'user_manage'}" @click.native = "state = 1">用户</router-link></div>
      <div><router-link :to="{ name: 'group_manage'}" @click.native = "state = 2">组</router-link></div>
    </div>
    <div>
      <router-view></router-view>
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
.main {
  padding: 20px;
  height: 100%;
  overflow: scroll;
  > .ar-tab-nav {
    background-color: #ffffff;
    padding-top: 8px;
    overflow: hidden;
    border-bottom: 1px solid #F2F2F2;
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
}
</style>
