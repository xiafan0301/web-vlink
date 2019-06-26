<template>
  <div class="vl_vehicle clearfix">
    <div class="vc_content">
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
.vl_vehicle {
  position: relative;
  height: 100%;
  > .vc_content {
    height: 100%;
    overflow: auto;
  }
}
</style>

<!-- 车辆侦察公用CSS -->
<style lang="scss">
.vehicle_content {
  position: relative;
  height: 100%;
}
</style>
