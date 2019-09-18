<template>
  <div class="model_four">
    <h1>布控信息：</h1>
    <div class="sel_lib"><span>禁入人员：</span><span @click="popSel(1)">从布控库中选择</span></div>
    <div class="sel_img_box">
      <div class="img_box" v-for="(item, index) in protraitList" :key="index">
        <img :src="item.photoUrl" alt="">
        <i class="el-icon-error" @click="delPortrait(index)"></i>
        <span :title="item.name">{{item.name | strCutWithLen(12)}}</span>
      </div>
    </div>
    <div class="sel_lib"><span>禁入车辆：</span><span @click="popSel(2)">从布控库中选择</span></div>
    <div class="sel_img_box">
      <div class="img_box" v-for="(item, index) in vehicleList" :key="index">
        <img :src="item.photoUrl" alt="">
        <i class="el-icon-error" @click="delVehicle(index)"></i>
        <span>{{item.vehicleNumber}}</span>
      </div>
    </div>
    <div is="portraitLib" ref="portraitLibDialog" :fileListOne="protraitList" @getPortraitData="getPortraitData"></div>
    <div is="vehicleLib" ref="vehicleLibDialog" :fileList="vehicleList" @getVehicleData="getVehicleData"></div>
    <div is="controlDevUpdate" :modelType="4" @getControlDevUpdate="getControlDevUpdate"></div>
  </div>  
</template>
<script>
import controlDevUpdate from './controlDevUpdate.vue';
import vehicleLib from './vehicleLib.vue';
import portraitLib from './portraitLib.vue';
import {random14, objDeepCopy, unique} from '@/utils/util.js';
export default {
  components: {controlDevUpdate, vehicleLib, portraitLib},
  data () {
    return {
      protraitList: [],
      vehicleList: [],
      devUpdateData: {}
    }
  },
  methods: {
     // 从布控库中获取禁入人员
    getPortraitData (data) {
      this.protraitList = data;
    },
    // 从布控库中获取禁入车辆
    getVehicleData (data) {
      this.vehicleList = data;
    },
    // 删除从布控库中已选择的人员
    delPortrait (index) {
      this.protraitList.splice(index, 1);
    },
    // 删除从布控库中已选择的车辆
    delVehicle (index) {
      this.vehicleList.splice(index, 1);
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
      this.$emit('getModel', {modelType: 4,  pointDtoList: [this.devUpdateData], surveillanceObjectDtoList: [...this.protraitList, ...this.vehicleList]});
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