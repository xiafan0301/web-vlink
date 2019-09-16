<template>
 <el-form ref="modelFive" :model="modelFiveForm" class="model_five">
    <h1>布控信息：</h1>
    <el-form-item label="布防场所:" :rules="{ required: true, message: '请选择布防场所', trigger: 'blur'}" style="margin-bottom: 0;">
      <el-select value-key="uid" v-model="modelFiveForm.site" filterable placeholder="请选择布防场所（可多选）">
        <el-option
          v-for="item in siteList"
          :key="item.uid"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="停留时长:" prop="duration" :rules="{ required: true, message: '请输入停留时长', trigger: 'blur'}" style="margin-bottom: 0;">
      <el-input class="time" v-model="modelFiveForm.duration" filterable placeholder="请输入停留时长"></el-input>
    </el-form-item>
    <el-form-item style="margin-bottom: 0;width: 100%;">
      <div class="sel_lib"><span>布控车辆：</span><span @click="popSel">从公务车辆中选择</span></div>
      <div class="sel_img_box">
        <div class="img_box" v-for="item in vehicleList" :key="item.id">
          <img src="http://temp.im/104x104" alt="">
          <i class="el-icon-error"></i>
          <span>汪诗诗</span>
        </div>
      </div>
    </el-form-item>
    <el-form-item style="margin-top: 20px;" v-if="!isShowControlDev">
      <el-button type="primary" @click="selControl('modelFive')">一键布控</el-button>
    </el-form-item>
    <div is="controlDev" ref="controlDev" v-if="isShowControlDev" @getChildModel="getChildModel"></div>
    <div is="vehicleLib" ref="vehicleLibDialog" @getVehicleData="getVehicleData"></div>
  </el-form>
</template>
<script>
import controlDev from './controlDev.vue';
import vehicleLib from './vehicleLib.vue';
import {mapXupuxian} from '@/config/config.js';
import {random14, objDeepCopy} from '@/utils/util.js';
export default {
  components: {controlDev, vehicleLib},
  data () {
    return {
      modelFiveForm: {
        site: null,
        duration: 30
      },
      vehicleList: '123',
      siteList: [],
      isShowControlDev: false,
      devData: {}
    }
  },
  methods: {
    // 从布控库中获取车像
    getVehicleData (data) {
      console.log(data, 'datadata')
    },
    // 一键布控
    selControl (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.vehicleList) {
            return this.$message.wraning('请选择布控车辆');
          }
          this.isShowControlDev = true;
        } else {
          return false;
        }
      });
    },
    // 向父组件传值
    sendParent () {
      if (!this.vehicleList) {
        return this.$message.wraning('请选择布控车辆');
      }
      this.$refs['modelFive'].validate((valid) => {
        if (valid) {
          if (this.$refs['controlDev']) {
            this.$refs['controlDev'].sendParent();
            this.$emit('getModel', {modelFiveForm: this.modelFiveForm, vehicleList: this.vehicleList, ...this.devData});
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