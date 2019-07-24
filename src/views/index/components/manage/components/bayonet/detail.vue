<template>
  <div class="bayonet_manage_detail">
    <div is="vlBreadcrumb" :breadcrumbData="[{name: '系统管理', routerName: 'manage'}, {name: '卡口管理', routerName: 'bayonet_manage'}, {name: '查看详情'}]"></div>
  </div>
</template>
<script>
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
export default {
  components: {vlBreadcrumb},
  data () {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>

</style>
