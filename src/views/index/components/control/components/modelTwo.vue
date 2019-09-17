<template>
  <el-form ref="modelTwo" :model="modelTwoForm" :label-position="labelPosition" class="model_two">
    <h1>布控信息:</h1>
    <el-form-item class="form_item">
      <el-form-item label="布防地址:" prop="address" :rules="{ required: true, message: '请输入地名的关键字', trigger: 'blur'}">
        <el-autocomplete
          style="width: 100%;"
          v-model="modelTwoForm.address"
          :trigger-on-focus="false"
          :fetch-suggestions="autoAdress"
          value-key="name"
          @select="chooseAddress($event, 1)"
          placeholder="请输入地名的关键词">
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="布防范围:">
        <el-select value-key="uid" v-model="modelTwoForm.radius" filterable placeholder="请选择">
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
    <div is="controlDev" ref="controlDev" v-if="isShowControlDev" :addressObjTwo="addressObjTwo" @getChildModel="getChildModel"></div>
    <div is="portraitLib" ref="portraitLibDialog" @getPortraitData="getPortraitData"></div>
    <div is="vehicleLib" ref="vehicleLibDialog" @getVehicleData="getVehicleData"></div>
  </el-form>
</template>
<script>
import controlDev from './controlDev.vue';
import vehicleLib from './vehicleLib.vue';
import portraitLib from './portraitLib.vue';
import {mapXupuxian} from '@/config/config.js';
import {random14, objDeepCopy, unique} from '@/utils/util.js';
export default {
  components: {controlDev, vehicleLib, portraitLib},
  data () {
    return {
      labelPosition: 'top',
      modelTwoForm: {
        address: null,
        radius: 3
      },
      autoComplete: null,
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
      devData: {}
    }
  },
  mounted () {
    this.resetMap();
  },
  methods: {
    // 从布控库中获取失踪人像
    getPortraitData (data) { 
      console.log(data, 'datadata')
      const _list = data.map(m => {
        return {
          objId: m.uid,
          objType: 1,
          photoUrl: m.photoUrl,
          name: m.name
        }
      });
      this.protraitList = this.protraitList.concat(_list);
      this.protraitList = unique(this.protraitList, 'photoUrl');
    },
    // 从布控库中获取禁入车辆
    getVehicleData (data) {
      console.log(data, 'datadata')
      const _list = data.map(m => {
        return {
          objId: m.uid,
          objType: 2,
          photoUrl: m.photoUrl,
          vehicleNumber: m.vehicleNumber
        }
      });
      this.vehicleList = this.vehicleList.concat(_list);
      this.vehicleList = unique(this.vehicleList, 'photoUrl');
    },
    // 向父组件传值
    sendParent () {
      if (!this.protraitList && !this.vehicleList) {
        return this.$message.warning('禁入人员、禁入车辆至少选一种');
      }
      this.$refs['modelTwo'].validate((valid) => {
        if (valid) {
          if (this.$refs['controlDev']) {
            this.$refs['controlDev'].sendParent();

            const _carNumberInfo = this.vehicleList.map(m => m.vehicleNumber).join(',');
            this.modelTwoForm.bayonetList = this.devData.bayonetList;
            this.modelTwoForm.devList = this.devData.devList;
            this.$emit('getModel', {carNumberInfo: _carNumberInfo, modelType: 2,  pointDtoList: [this.modelTwoForm], surveillanceObjectDtoList: this.protraitList});
          } else {
            this.$message.warning('请先选择布控设备');
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
          if (!this.protraitList && !this.vehicleList) {
            return this.$message.warning('禁入人员、禁入车辆至少选一种');
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
    // 拿到地图实列
    resetMap () {
      let _this = this;
      _this.map = new window.AMap.Map(
        'xxx', {
          zoom: null,
          center: null
        }
      );
      _this.map.plugin('AMap.Autocomplete', () => {
        let autoOptions = {
          city: '溆浦县'
        }
        _this.autoComplete = new window.AMap.Autocomplete(autoOptions);
      })
    },
    autoAdress (queryString, cb) {
      if (queryString === '') {
        cb([])
      } else {
        this.autoComplete.search(queryString, (status, result) => {
          if (status === 'complete') {
            result.tips.forEach(f => {
              f.name = `${f.name}(${f.district})`;
            })
            cb(result.tips);
          } else {
            cb([]);
          }
        })
      }
    },
    // 获取追踪点
    chooseAddress (e, type) {
      console.log(e, 'eee')
      if (!e.location) {
        this.$message.error('无法获取到经纬度！');
        return;
      }
      this.addressObjTwo.lnglat = [e.location.lng, e.location.lat];
      this.addressObjTwo.radius = this.modelTwoForm.radius;
    },
  },
  // 销毁地图实例
  isDestroyed () {
    if (this.map) {
      this.map.destroy();
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