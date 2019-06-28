<template>
  <div class="identy_container">
    <Breadcrumb :oData="[{name: '身份确认'}]"></Breadcrumb>
    <div class="content_box">
      <div class="left">
        <div class="upload_img"></div>
        <div class="search_box"></div>
      </div>
      <div class="right"></div>
    </div>
  </div>
</template>
<script>
import Breadcrumb from '../breadcrumb.vue';
export default {
  components: { Breadcrumb },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.identy_container {
  width: 100%;
  .content_box {
    display: flex;
    .left {
      width: 136px;
      box-shadow:2px 0px 5px 0px rgba(131,131,131,0.28);
      background-color: #ffffff;
    }
    .right {
      width: calc(100% - 136px);
    }
  }
}
</style>

