<template>
  <div class="main">
    <div class="ar-tab-nav">
      <div><router-link :to="{ name: 'person_info'}" @click.native = "state = 1">人员信息库</router-link></div>
      <div><router-link :to="{ name: 'vehicle_info'}" @click.native = "state = 2">车辆信息库</router-link></div>
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
.main {
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
