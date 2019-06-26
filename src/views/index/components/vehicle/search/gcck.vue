<template>
  <div class="vc_gcck">
    <div is="vehicleBreadcrumb" :title="'过车查看'"></div>
  </div>
</template>
<script>
import vehicleBreadcrumb from '../breadcrumb.vue';
export default {
  components: {vehicleBreadcrumb},
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.vc_gcck {
  height: 100%;
}
</style>