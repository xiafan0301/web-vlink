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
    <div is="portraitLib" v-if="portraitLibDialog" ref="portraitLibDialog" :fileListOne="protraitList" @getPortraitData="getPortraitData"></div>
    <div is="vehicleLib" ref="vehicleLibDialog" :fileList="vehicleList" @getVehicleData="getVehicleData"></div>
    <div 
      is="mapSelector" 
      ref="mapSelector" 
      :isNotDialog="false"
      showTypes="DB"
      :activeDeviceList="activeDeviceList"
      >
    </div>
  </div>  
</template>
<script>
import vehicleLib from './vehicleLib.vue';
import portraitLib from './portraitLib.vue';
import mapSelector from '@/components/common/mapSelector.vue';
import {unique} from '@/utils/util.js';
export default {
  components: {mapSelector, vehicleLib, portraitLib},
  props: ['modelList'],
  data () {
    return {
      protraitList: [],
      vehicleList: [],
      portraitLibDialog: false,
      activeDeviceList: null
    }
  },
  mounted () {
    this.$_showLoading();
    setTimeout(() => {
      // 修改时回填数据
      if (this.modelList) {
        console.log(this.modelList, 'this.modelList')
        // 回填嫌疑车牌
        let [{pointDtoList: [{bayonetList, devList}], surveillanceObjectDtoList}] = this.modelList;
        this.protraitList = surveillanceObjectDtoList.filter(m => m.objType === 1);//回填禁入人员
        this.vehicleList = surveillanceObjectDtoList.filter(m => m.objType === 2);//回填禁入车辆
        this.isShowControlDev = true;

        this.$nextTick(() => {
          this.activeDeviceList = [...devList.map(m => m.deviceId), ...bayonetList.map(m => m.bayonetId)];
        })
      }
      this.$_hideLoading();
    }, 1500);
  },
  methods: {
     // 从布控库中获取禁入人员
    getPortraitData (data) {
      this.protraitList = this.protraitList.concat(data);
      this.protraitList = unique(this.protraitList, 'objId');
    },
    // 从布控库中获取禁入车辆
    getVehicleData (data) {
      this.vehicleList = this.vehicleList.concat(data);
      this.vehicleList = unique(this.vehicleList, 'objId');
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
        this.portraitLibDialog = true;
        this.$nextTick(() => {
        this.$refs['portraitLibDialog'].portraitLibDialog = true;
        this.$refs['portraitLibDialog'].reset();
        })
      } else {
        this.$refs['vehicleLibDialog'].vehicleLibDialog = true;
        this.$refs['vehicleLibDialog'].reset();
      }
    },
    // 向父组件传值
    sendParent () {
      if (this.protraitList.length === 0 && this.vehicleList.length === 0) {
        return this.$message.info('请选择布控人员或者车辆');
      } 
      const devData = this.$refs['mapSelector'].getCheckedIds();
      if (devData.deviceList.length > 0 || devData.bayonetList.length > 0) {
        let {deviceList: devList, bayonetList} = devData;
        devList = devList.map(m => {
          return {deviceId: m.uid}
        })
        bayonetList = bayonetList.map(m => {
          return {bayonetId: m.uid}
        })
        this.$emit('getModel', {modelType: 4,  pointDtoList: [{devList, bayonetList}], surveillanceObjectDtoList: [...this.protraitList, ...this.vehicleList]});
      } else {
        this.$message.info('请先选择布控设备');
      }
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