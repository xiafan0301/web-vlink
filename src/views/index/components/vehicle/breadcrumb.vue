<template>
  <div class="vc_breadcrumb">
    <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ name: 'vehicle' }">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
      </el-breadcrumb>
  </div>
</template>
<script>
export default {
  props: ['title'],
  data () {
    return {
    }
  }
}
</script>
<style lang="scss" scoped>
.vc_breadcrumb {
  height: 50px;
  padding-left: 20px; padding-top: 17px;
  border-bottom: 1px solid #f6f6f6;
  box-shadow: 0 0 5px #ddd;
}
</style>