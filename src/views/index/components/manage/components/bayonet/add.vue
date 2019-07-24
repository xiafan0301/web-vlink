<template>
  <div class="bayonet_manage_add">
    <div is="vlBreadcrumb" :breadcrumbData="breadcrumbData"></div>
  </div>
</template>
<script>
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
export default {
  components: {vlBreadcrumb},
  data () {
    return {
      breadcrumbData: [{name: '系统管理', routerName: 'manage'}, {name: '卡口管理', routerName: 'bayonet_manage'}],
      pageType: null,// 1为新增，2为编辑
    }
  },
  created () {
    this.pageType = parseInt(this.$route.query.type);
    if (this.pageType === 1) {
      this.breadcrumbData.push({name: '新增卡口'});
    } else {
      this.breadcrumbData.push({name: '编辑卡口'});
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
