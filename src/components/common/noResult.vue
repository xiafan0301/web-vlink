<template>
  <div class="not_content">
    <template v-if="isInitPage">
      <img src="../../assets/img/null-content.png" alt="">
    </template>
    <template v-else>
      <img src="../../assets/img/not-content.png" alt="">
    </template>
    <p>{{isInitPage ? '请在左侧输入查询条件！' : '抱歉，没有相关的结果!'}}</p>
  </div>
</template>
<script>
export default {
  props: [ 'isInitPage' ] // isInitPage为true代表初始化页面
}
</script>

<style lang="scss">
.not_content {
 >p {
   margin-top: 80px;
   color: #666666;
 }
}
</style>

