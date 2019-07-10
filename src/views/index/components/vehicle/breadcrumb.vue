<template>
  <div class="vc_breadcrumb">
    <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ name: 'vehicle' }">车辆侦查</el-breadcrumb-item>
        <template v-for="(item, index) in oData">
          <el-breadcrumb-item :key="'vc_db_' + index" v-if="item.routerName" :to="{ name: item.routerName, query: item.query && item.query }">{{item.name}}</el-breadcrumb-item>
          <el-breadcrumb-item :key="'vc_db_' + index" v-else>{{item.name}}</el-breadcrumb-item>
        </template>
      </el-breadcrumb>
  </div>
</template>
<script>
export default {
  // [{name: '车辆侦查', routerName: 'vehicle'}, {name: '过车查看'}]
  props: ['oData'],
  data () {
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
.vc_breadcrumb {
  position: absolute; top: 0; left: 0; z-index: 100;
  height: 50px; width: 100%;
  padding-left: 20px; padding-top: 17px;
  border-bottom: 1px solid #D3D3D3;
  box-shadow: 0 0 5px #ddd;
  background-color: #fff;
}
</style>