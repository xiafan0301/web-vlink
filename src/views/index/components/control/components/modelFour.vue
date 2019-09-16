<template>
  <div class="model_four">
    <h1>布控信息：</h1>
    <div class="sel_lib"><span>禁入人员：</span><span @click="popSel(1)">从布控库中选择</span></div>
    <div class="sel_img_box">
      <div class="img_box" v-for="item in protraitList" :key="item.id">
        <img src="http://temp.im/104x104" alt="">
        <i class="el-icon-error"></i>
        <span>汪诗诗</span>
      </div>
    </div>
    <div class="sel_lib"><span>禁入车辆：</span><span @click="popSel(2)">从布控库中选择</span></div>
    <div class="sel_img_box">
      <div class="img_box" v-for="item in vehicleList" :key="item.id">
        <img src="http://temp.im/104x104" alt="">
        <i class="el-icon-error"></i>
        <span>汪诗诗</span>
      </div>
    </div>
    <div is="controlDevUpdate" :modelType="4" @getControlDevUpdate="getControlDevUpdate"></div>
    <div is="vehicleLib" ref="vehicleLibDialog" @getVehicleData="getVehicleData"></div>
    <div is="portraitLib" ref="portraitLibDialog" @getPortraitData="getPortraitData"></div>
  </div>  
</template>
<script>
import controlDevUpdate from './controlDevUpdate.vue';
import vehicleLib from './vehicleLib.vue';
import portraitLib from './portraitLib.vue';
export default {
  components: {controlDevUpdate, vehicleLib, portraitLib},
  data () {
    return {
      protraitList: '123',
      vehicleList: '123',
      devUpdateData: {}
    }
  },
  methods: {
    // 从布控库中获取人像
    getPortraitData (data) {
      console.log(data, 'datadata')
    },
    // 从布控库中获取车像
    getVehicleData (data) {
      console.log(data, 'datadata')
    },
    // 从库中选择
    popSel (type) {
      if (type === 1) {
        this.$refs['portraitLibDialog'].portraitLibDialog = true;
        this.$refs['portraitLibDialog'].reset();
      } else {
        this.$refs['vehicleLibDialog'].vehicleLibDialog = true;
        this.$refs['vehicleLibDialog'].reset();
      }
    },
    // 向父组件传值
    sendParent () {
      this.$emit('getModel', {protraitList: this.protraitList,vehicleList: this.vehicleList, ...this.devUpdateData});
    },
    getControlDevUpdate (data) {
      this.devUpdateData = data;
    },
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