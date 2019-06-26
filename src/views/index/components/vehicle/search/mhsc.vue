<template>
<!-- 模糊搜车 -->
  <div class="mhsc_wrap">
      <!-- 面包屑通用样式 -->
      <div class="link_bread">
        <el-breadcrumb separator=">" class="bread_common">
          <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">侦查</el-breadcrumb-item>
          <el-breadcrumb-item>模糊搜车</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 通用的左边菜单 -->
      <div class="left_menu">

      </div>
      <!-- 通用的右边列表 -->
      <div class="right_img_list">

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
.mhsc_wrap {
  height: 100%;
  position: relative;
  .link_bread {
    height: 60px;
    background: #fff;
    .bread_common {
      padding: 23px 0 0 20px;
    }
    // line-height: 60px; 
  }
}
</style>