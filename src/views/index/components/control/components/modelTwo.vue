<template>
  <el-form ref="modelTwo" :model="modelTwoForm" :label-position="labelPosition" class="model_two">
    <h1>布控信息:</h1>
    <el-form-item class="form_item">
      <el-form-item label="布防地址:" prop="address" :rules="{ required: true, message: '请输入地名的关键字', trigger: 'blur'}">
        <el-autocomplete
          style="width: 100%;"
          v-model="modelTwoForm.address"
          :trigger-on-focus="false"
          :fetch-suggestions="querySearch"
          value-key="name"
          @select="getAddress"
          placeholder="请输入地名的关键词">
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="布防范围:">
        <el-select value-key="uid" v-model="modelTwoForm.radius" filterable placeholder="请选择" @change="changeRadius">
          <el-option
            v-for="item in radiusList"
            :key="item.uid"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form-item>
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
    <el-form-item style="margin-top: 20px;" v-if="!isShowControlDev">
      <el-button type="primary" @click="selControl('modelTwo')">一键布控</el-button>
    </el-form-item>
    <div is="controlDev" ref="controlDev" v-if="isShowControlDev" :addressObjTwo="addressObjTwo" :devs="devs" :bays="bays" @getChildModel="getChildModel"></div>
    <div is="portraitLib" ref="portraitLibDialog" :fileListOne="protraitList" @getPortraitData="getPortraitData"></div>
    <div is="vehicleLib" ref="vehicleLibDialog" :fileList="vehicleList" @getVehicleData="getVehicleData"></div>
  </el-form>
</template>
<script>
import controlDev from './controlDev.vue';
import vehicleLib from './vehicleLib.vue';
import portraitLib from './portraitLib.vue';
import {unique} from '@/utils/util.js';
export default {
  components: {controlDev, vehicleLib, portraitLib},
  props: ['modelList'],
  data () {
    return {
      labelPosition: 'top',
      modelTwoForm: {
        address: null,
        radius: 3
      },
      radiusList: [
        {value: 3, label: '周边3公里'},
        {value: 5, label: '周边5公里'},
        {value: 10, label: '周边10公里'},
        {value: 15, label: '周边15公里'},
        {value: 20, label: '周边20公里'},
        {value: 50, label: '全城'},
      ],
      protraitList: [],
      vehicleList: [],
      isShowControlDev: false,
      addressObjTwo: {
        lnglat: [],
        radius: null
      },
      devData: {},
      devs: [],
      bays: []
    }
  },
  mounted () {
    // 修改时回填数据
    if (this.modelList) {
      // 回填嫌疑车牌
      let [{pointDtoList: [{bayonetList, devList, address, longitude, latitude, radius}], surveillanceObjectDtoList}] = this.modelList;
      this.modelTwoForm.address = address;
      this.addressObjTwo.radius = this.modelTwoForm.radius = radius;
      this.addressObjTwo.lnglat = [longitude, latitude];
      this.devs = devList;
      this.bays = bayonetList;
      this.protraitList = surveillanceObjectDtoList.filter(m => m.objType === 1);//回填禁入人员
      this.vehicleList = surveillanceObjectDtoList.filter(m => m.objType === 2);//回填禁入车辆
      this.isShowControlDev = true;
    }
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
    // 向父组件传值
    sendParent () {
      this.$refs['modelTwo'].validate((valid) => {
        if (valid) {
          if (this.protraitList.length === 0 && this.vehicleList.length === 0) {
            return this.$message.info('禁入人员、禁入车辆至少选一种');
          }
          if (this.$refs['controlDev']) {
            this.$refs['controlDev'].sendParent();
            if (this.devData.devList.length === 0 && this.devData.bayonetList.length === 0) return this.$message.info('请先选择布控设备');
            const longitude = this.addressObjTwo.lnglat[0];
            const latitude = this.addressObjTwo.lnglat[1];

            const _modelTwoForm = {...this.modelTwoForm, ...this.devData, longitude, latitude}
            this.$emit('getModel', {modelType: 2,  pointDtoList: [_modelTwoForm], surveillanceObjectDtoList: [...this.protraitList, ...this.vehicleList]});
          } else {
            this.$message.info('请先选择布控设备');
          }
        } else {
          return false;
        }
      });
    },
    getChildModel (data) {
      this.devData = data;
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
    // 一键布控
    selControl (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.protraitList.length === 0 && this.vehicleList.length === 0) {
            return this.$message.info('禁入人员、禁入车辆至少选一种');
          }
          this.isShowControlDev = true;
        } else {
          return false;
        }
      });
    },
    // 删除从布控库中已选择的人员
    delPortrait (index) {
      this.protraitList.splice(index, 1);
    },
    // 删除从布控库中已选择的车辆
    delVehicle (index) {
      this.vehicleList.splice(index, 1);
    },
    changeRadius () {
      this.addressObjTwo.radius = this.modelTwoForm.radius;
    },
    /* 地址下拉搜索相关方法 */
    // 获取追踪点
    getAddress (e) {
      if (!e.location) {
        this.$message.info('无法获取到经纬度！');
        return;
      }
      this.addressObjTwo.lnglat = [e.location.lng, e.location.lat];
      this.addressObjTwo.radius = this.modelTwoForm.radius;
    },
    // 地图搜索选择
    querySearch(queryString, cb) {
      this.$nextTick(() => {
        this.seacher(queryString).then(v => {
          let results = queryString
              ? v.filter(f => f.name.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
              : v;
          cb(results);
        });
      });
    },
    seacher(v) {
      const placeSearch = new window.AMap.PlaceSearch({
        // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
        city: "湖南"
      });
      if (v) {
        return new Promise((resolve) => {
          placeSearch.search(v, (status, result) => {
            // 查询成功时，result即对应匹配的POI信息
            let pois = result.poiList.pois;
            resolve(pois);
          });
        });
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.model_two{
  width: 100%;
  padding: 0 20px;
  > h1{
    padding-top: 10px;
  }
  .form_item{
    width: 50%;
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
}
</style>
<style lang="scss">
.model_two{
  .form_item{
    .el-form-item__content{
      width: 100%;
      display: flex;
      .el-form-item{
        width: 50%;
        padding-right: 10px;
      }
    }
  }
}
</style>