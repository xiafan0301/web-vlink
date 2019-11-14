<template>
  <div class="vl_side_nav">
    <el-menu
            :default-active="activeMenu"
            :router="true"
            class="el-menu-vertical-demo">
      <el-menu-item v-for="(item, index) in sideList" :key="'vl_side_nav' + index" :index="item.path" >
        <span slot="title">{{item.routerName}}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
  export default {
    props: {
      sideList: {
        type: Array,
        default: () => {
          return []
        }
      },
    },
    data() {
      return {
        activeMenu: ''
      }
    },
    methods: {},
    watch: {}
  }
</script>
<style scoped="scoped" lang="scss">
  .vl_side_nav {
    width: 2rem;
    box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
    display: inline-block;
    height: 100%;
    background: #ffffff;
    .el-menu {
      border-right: none;
      text-align: center;
    }
  }
</style>
