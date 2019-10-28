<template>
 <el-form ref="modelFive" :model="modelFiveForm" class="model_five">
    <h1>布控信息：</h1>
    <el-form-item label="布防场所:" prop="locations" :rules="{ required: true, message: '请选择布防场所', trigger: 'change'}" style="margin-bottom: 10px;">
      <el-select value-key="uid" v-model="modelFiveForm.locations" multiple collapse-tags filterable placeholder="请选择布防场所（可多选）">
        <el-option
          v-for="item in locationList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="停留时长:" prop="stayTime" :rules="{ required: true, message: '请输入停留时长', trigger: 'blur'}" style="margin-bottom: 10px;">
      <el-input class="time" v-model="modelFiveForm.stayTime" filterable placeholder="请输入停留时长" @blur="validationStayTime"></el-input>
    </el-form-item>
    <el-form-item label="布控车辆：" style="margin-bottom: 0;width: 100%;" :rules="{ required: true, message: '', trigger: 'blur'}">
      <div class="sel_lib"><span @click="popSel">从公务车辆中选择</span></div>
      <div class="sel_img_box">
        <div class="img_box" v-for="(item, index) in vehicleList" :key="index">
          <img :src="item.photoUrl" alt="">
          <i class="el-icon-error" @click="delVehicle(index)"></i>
          <span>{{item.vehicleNumber}}</span>
        </div>
      </div>
    </el-form-item>
    <el-form-item style="margin-top: 20px;" v-if="!isShowControlDev">
      <el-button type="primary" @click="selControl('modelFive')">一键布控</el-button>
    </el-form-item>
    <div is="controlDev" ref="controlDev" v-if="isShowControlDev" :devs="devs" :bays="bays" @getChildModel="getChildModel" :devIdListFive="devIdList" :bayIdListFive="bayIdList"></div>
    <div is="vehicleLib" ref="vehicleLibDialog" :fileList="vehicleList" @getVehicleData="getVehicleData" model="gwcl"></div>
  </el-form>
</template>
<script>
import controlDev from './controlDev.vue';
import vehicleLib from './vehicleLib.vue';
import {mapXupuxian} from '@/config/config.js';
import {random14, objDeepCopy, unique} from '@/utils/util.js';
import {getGroupsDevices} from '@/views/index/api/api.base.js';
export default {
  components: {controlDev, vehicleLib},
  props: ['modelList'],
  data () {
    return {
      modelFiveForm: {
        locations: [],
        stayTime: 30
      },
      vehicleList: [],
      locationList: [
        // {value: '1', label: '布防场所1'},
        // {value: '2', label: '布防场所2'},
        // {value: '3', label: '布防场所3'}
      ],
      isShowControlDev: false,
      devData: {},
      devIdList: [],
      bayIdList: [],
      devs: [],
      bays: []
    }
  },
  mounted () {
    this.getTheirPlacesList();
    // 修改时回填数据
    if (this.modelList) {
      // 回填嫌疑车牌
      let [{pointDtoList: [{bayonetList, devList, locations, stayTime}], surveillanceObjectDtoList}] = this.modelList;
      this.modelFiveForm.locations = locations;
      this.modelFiveForm.stayTime = stayTime;
      this.vehicleList = surveillanceObjectDtoList;//回填布控车辆
      this.devs = devList;
      this.bays = bayonetList;

      this.isShowControlDev = true;
    }
  },
  methods: {
    // 验证停留时长
    validationStayTime () {
      if (this.modelFiveForm.stayTime && this.modelFiveForm.stayTime <= 0) {
        this.$message.info('不能输入小于0的数');
        this.modelFiveForm.stayTime = null;
      }
    },
    // 从布控库中获取嫌疑车辆
    getVehicleData (data) {
      this.vehicleList = this.vehicleList.concat(data);
      this.vehicleList = unique(this.vehicleList, 'objId');
      console.log(this.vehicleList, 'this.vehicleList');
      
    },
    // 删除从布控库中已选择的车辆
    delVehicle (index) {
      this.vehicleList.splice(index, 1);
    },
    // 一键布控
    selControl (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.vehicleList.length === 0) {
            return this.$message.info('请选择布控车辆');
          }
          // 拿到布防场所下拉列表里对应的设备和卡口列表，传到地图上，作为已选中的
          let res = [];
          this.locationList.forEach(f => {
            if (this.modelFiveForm.locations.some(s => s === f.value)) {
              res.push(f);
            }
          }) 
          res.forEach(f => {
            f.deviceList && this.devIdList.push(...f.deviceList);
          })
          res.forEach(f => {
            f.bayonetList && this.bayIdList.push(...f.bayonetList);
          })
          
          this.isShowControlDev = true;
        } else {
          return false;
        }
      });
    },
    // 向父组件传值
    sendParent () {
      this.$refs['modelFive'].validate((valid) => {
        if (valid) {
          if (this.vehicleList.length === 0) {
            return this.$message.wraning('请选择布控车辆');
          }
          if (this.$refs['controlDev']) {
            this.$refs['controlDev'].sendParent();
            if (this.devData.devList.length === 0 && this.devData.bayonetList.length === 0) return this.$message.warning('请先选择布控设备');
            let _modelFiveForm = {};
            const _locations = this.modelFiveForm.locations;
            _modelFiveForm = {locations: _locations, stayTime: this.modelFiveForm.stayTime, ...this.devData}
            this.$emit('getModel', {modelType: 5,  pointDtoList: [_modelFiveForm], surveillanceObjectDtoList: this.vehicleList});
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
      this.$refs['vehicleLibDialog'].vehicleLibDialog = true;
      this.$refs['vehicleLibDialog'].reset();
    },
    // 获取布防场所组列表
    getTheirPlacesList () {
      getGroupsDevices().then(res => {
        if (res) {
          this.locationList = res.data.map(m => {
            return {
              value: m.uid,
              label: m.groupName,
              deviceList: m.deviceList,
              bayonetList: m.bayonetList
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.model_five{
  padding: 0 20px;
  > h1{
    padding-top: 10px;
  }
  .el-form-item{
    width: 25%;
  }
  .sel_lib{
    position: absolute;
    top: -40px;
    left: 80px;
    > span{
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
        line-height: 20px;
      }
    }
  }
}
</style>
<style lang="scss">
.model_five{
  .time{
    position: relative;
    .el-input__inner{
      padding-left: 30px;
      padding-right: 40px;
    }
    &:before{
      content: '>';
      position: absolute;
      color: #999999;
      left: 10px;
    }
    &:after{
      content: '分钟';
      position: absolute;
      color: #999999;
      right: 10px;
    }
  } 
}
</style>