<template>
  <header class="vl_header clearfix">
    <div class="hd_log" @click="goBack">
    </div>
    <!-- <div class="hd_log vl_icon vl_icon_logo" @click="goBack">
    </div> -->
    <!-- <div class="hd_log vl_ymx_logo" @click="goBack">
    </div> -->
  </header>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'login' });
    }
  }
}
</script>
<style lang="scss" scoped>
.vl_header {
  position: absolute; top: 0; left: 0; z-index: 100;
  width: 100%; height: 100px; min-width: 1200px;
  background-color: #0C70F8;
  background: -webkit-linear-gradient(to bottom, #0C70F8, #0466DE);
  background: -moz-linear-gradient(to bottom, #0C70F8, #0466DE);
  background: linear-gradient(to bottom, #0C70F8, #0466DE);
  animation: fadeInDown .4s ease-out .2s both;
  > .hd_log {
    display: block;
    float: left;
    width: 170px; height:  48px;
    margin: 26px 20px 0 20px;
    cursor: pointer;
    background: url(../assets/img/logo_ysd.png) center center no-repeat;
  }
}
.vl_ymx_logo {
  background: url(../assets/img/ymx/ymx_logo.png) no-repeat;
  background-size: 100% auto;
  position: relative; top: 7px;
}
</style>
