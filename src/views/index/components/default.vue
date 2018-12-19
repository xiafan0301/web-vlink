<template>
  <div class="vl_main">
    <div is="vlinkHeader"></div>
    <div class="vl_content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import vlinkHeader from '../../../components/header.vue';
export default {
  components: {vlinkHeader},
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.vl_main {
  height: 100%;
  > .vl_content {
    padding-top: 100px;
    height: 100%;
  }
}
</style>
