<template>
  <el-breadcrumb separator=">" class="vl_breadcrumb">
    <template v-for="(item, index) in bdData">
      <el-breadcrumb-item :key="'vl_db_' + index" v-if="item.routerName" 
        :to="{ name: item.routerName, query: item.query, params: item.params }">{{item.name}}</el-breadcrumb-item>
      <el-breadcrumb-item :key="'vl_db_' + index" v-else>{{item.name}}</el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>
<script>
/* 
 * breadcrumbData {arrayObject} 面包屑数据
 *    name        {string} 面包屑名称/显示的标题
 *    routerName  {string} 需要跳转的路由名称
 *    query       {object} query 参数
 * e.g.
 *  [{name: '车辆侦查', routerName: 'vehicle', query: {plateNo: '001'}}, {name: '过车查看'}]
 */
export default {
  props: ['breadcrumbData'],
  data () {
    return {
      bdData: []
    }
  },
  created () {
    /* 存在参数breadcrumb的时候，状态管理的权重大于父组件传值 */
    if (this.$route.query.breadcrumb && this.$store.state.breadcrumbData) {
      // 存在参数breadcrumb，则从vuex中拿面包屑数据
      this.bdData = this.$store.state.breadcrumbData;
      console.log('store.state.breadcrumbData', this.bdData);
    } else {
      // 不存在参数breadcrumb，则从父组件传递的breadcrumbData中拿面包屑数据
      this.bdData = this.breadcrumbData;
      console.log(this.bdData)
    }
  }
}
</script>
<style lang="scss" scoped>
.vl_breadcrumb {
  height: 49px; line-height: 49px;
  padding-left: 20px;
  border-bottom: 1px solid #d3d3d3;
  background-color: #fff;
}
</style>