<template>
  <div class="model_four">
    <p>布控信息：</p>
    <div><span>禁入人员：</span><span>从布控库中选择</span></div>
    <div><span>禁入车辆：</span><span>从布控库中选择</span></div>
    <el-button type="primary" @click="selControl">一键布控</el-button>
  </div>  
</template>
<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    // 一键布控
    selControl () {

    }
  }
}
</script>
<style lang="scss" scoped>
.model_four{
  padding: 0 20px;
}
</style>