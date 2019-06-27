<template>
  <div class="th-many-peers">
    <div class="th-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">侦查</el-breadcrumb-item>
        <el-breadcrumb-item>多车同行</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="the-bottom">
      <div class="the-left-search"></div>
      <div class="the-right-result">
        <div class="the-result-box">
          <vue-scroll>
            
          </vue-scroll>
        </div>
      </div>
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
.th-many-peers {
  width: 100%; height: 100%;
  .the-bottom {
    width: 100%;height: calc(100% - 60px);
    display: flex;
    position: relative;
    .the-left-search {
      width: 272px;height: 100%;
      background: #fff;
      box-shadow: 5px 0 10px #E5E7E7;
      animation: fadeInLeft .4s ease-out .3s both;
    }
    .the-right-result {
      width: calc(100% - 285px); height: 100%;
      margin-left: 13px;
      background: #F7F9F9;
      padding: 15px 12px 25px 0;
      overflow-y: hidden;
      .the-result-box {
        width: 100%; height: 100%;
        background: green;
      }
    }
  }
}
</style>