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
      <el-input v-model="modelFiveForm.duration" filterable placeholder="请输入停留时长"></el-input>
    </el-form-item>
    <el-form-item style="margin-bottom: 0;width: 100%;">
      <div class="sel_lib"><span>布控车辆：</span><span>从公务车辆中选择</span></div>
      <div class="sel_img_box">
        <div class="img_box" v-for="item in vehicleList" :key="item.id">
          <img src="http://temp.im/104x104" alt="">
          <i class="el-icon-error"></i>
          <span>汪诗诗</span>
        </div>
      </div>
    </el-form-item>
    <el-form-item style="margin-top: 20px;">
      <el-button type="primary" @click="selControl('modelFive')">一键布控</el-button>
    </el-form-item>
    <div is="controlDev" v-if="isShowControlDev"></div>
  </el-form>
</template>
<script>
import controlDev from './controlDev.vue';
import {mapXupuxian} from '@/config/config.js';
import {random14, objDeepCopy} from '@/utils/util.js';
export default {
  components: {controlDev},
  data () {
    return {
      modelFiveForm: {
        site: null,
        duration: 30
      },
      vehicleList: '123',
      siteList: [],
      isShowControlDev: false
    }
  },
  methods: {
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