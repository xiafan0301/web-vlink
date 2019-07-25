<template>
  <router-view class="bayonet_manage"></router-view>
</template>
<script>
export default {
  data () {
    return {

    }
  }
}
</script>
<style lang="scss">
// 重置按钮样式
.bayonet_manage{
  .select_btn, .reset_btn {
    width: 80px;
  }
  .btn_90{
    width: 90px!important;
  }
  .btn_100{
    width: 100px!important;
  }
  .btn_140{
    width: 140px!important;
  }
  .select_btn {
    background-color: #0C70F8;
    color: #ffffff;
  }
  .reset_btn {
    background-color: #ffffff;
    color: #666666;
    border-color: #DDDDDD;
  }
}
</style>
