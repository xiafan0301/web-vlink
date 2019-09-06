<template>
  <div class="model_four">
    <h1>布控信息：</h1>
    <div class="sel_lib"><span>禁入人员：</span><span>从布控库中选择</span></div>
    <div class="sel_img_box">
      <div class="img_box" v-for="item in '113'" :key="item.id">
        <img src="http://temp.im/104x104" alt="">
        <i class="el-icon-error"></i>
        <span>汪诗诗</span>
      </div>
    </div>
    <div class="sel_lib"><span>禁入车辆：</span><span>从布控库中选择</span></div>
    <div class="sel_img_box">
      <div class="img_box" v-for="item in '123'" :key="item.id">
        <img src="http://temp.im/104x104" alt="">
        <i class="el-icon-error"></i>
        <span>汪诗诗</span>
      </div>
    </div>
    <el-button type="primary" @click="selControl">一键布控</el-button>
    <div is="controlDevUpdate" v-if="isShowControlDev"></div>
  </div>  
</template>
<script>
import controlDevUpdate from './controlDevUpdate.vue';
export default {
  components: {controlDevUpdate},
  data () {
    return {
      isShowControlDev: false,
    }
  },
  methods: {
    // 一键布控
    selControl () {
      this.isShowControlDev = true;
    }
  }
}
</script>
<style lang="scss" scoped>
.model_four{
  padding: 0 20px;
  > h1{
    padding: 10px 0;
  }
  .sel_lib{
    padding-bottom: 10px;
    > span:nth-child(2){
      color: #0C70F8;
      cursor: pointer;
    }
  }
  .sel_img_box{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .img_box{
      width: 104px;
      height: 104px;
      position: relative;
      margin: 0 20px 20px 0;
      > img{
        width: 100%;
        height: 100%;
      }
      > i{
        font-size: 6px;
        position: absolute;
        right: 5px;
        top: 5px;
        cursor: pointer;
      }
      > span{
        position: absolute;
        left: 5px;
        bottom: 5px;
        color: #fff;
      }
    }
  }
  .el-button{
    margin-bottom: 20px;
  }
}
</style>