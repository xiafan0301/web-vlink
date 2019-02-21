<template>
  <div class="vl_judge_main clearfix">
    <ul class="vl_smenu">
      <li>
        <router-link :to="{name: 'trajectory_collide'}">轨迹碰撞</router-link>
      </li>
      <li>
        <router-link :to="{name: 'investigation'}">事件侦查</router-link>
      </li>
      <li>
        <router-link :to="{name: 'focus_on'}">重点关注</router-link>
      </li>
      <li>
        <router-link :to="{name: 'high_area'}">高危区域</router-link>
      </li>
    </ul>
    <div class="judge_content">
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
  .vl_judge_main {
    position: relative;
    height: 100%;
    > .judge_content {
      height: 100%;
      padding-left: 200px;
    }
  }
</style>
<style lang="scss">
  html {
    font-size: 100px;
  }
  @media screen and (min-width: 960px) and (max-width: 1119px) {html {font-size: 60px !important;}}
  @media screen and (min-width: 1200px) and (max-width: 1439px) {html {font-size: 70px !important;}}
  @media screen and (min-width: 1440px) and (max-width: 1679px) {html {font-size: 80px !important;}}
  @media screen and (min-width: 1680px) and (max-width: 1919px) {html {font-size: 90px !important;}}
  @media screen and (min-width: 1920px) {html {font-size: 100px !important;} }
  .vl_judge_tc {
    width: 100%;
    height: 100%;
    .vl_j_left {
      float: left;
      width: 2.32rem;
      padding-top: 24px;
      height: 100%;
      margin-left: 0.2rem;
      background: #ffffff;
      box-shadow:4px 0px 10px 0px #838383;
      box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
      animation: fadeInLeft .4s ease-out .3s both;
    }
    .vl_j_right {
      display: inline-block;
      width: calc(100% - 2.52rem);
      height: 100%;
      #tcMap {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>