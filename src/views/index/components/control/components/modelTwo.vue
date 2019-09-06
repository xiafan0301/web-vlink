<template>
  <el-form ref="modelTwo" :model="modelTwoForm" :label-position="labelPosition" class="model_two">
    <h1>布控信息:</h1>
    <el-form-item class="form_item">
      <el-form-item label="布防地址:" prop="address" :rules="{ required: true, message: '请输入地名的关键字', trigger: 'blur'}">
        <el-input v-model="modelTwoForm.address" placeholder="请输入地名的关键字"></el-input>
      </el-form-item>
      <el-form-item label="布防范围:">
        <el-select value-key="uid" v-model="modelTwoForm.scope" filterable placeholder="请选择">
          <el-option
            v-for="item in scopeList"
            :key="item.uid"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form-item>
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
    <el-form-item style="margin-top: 20px;">
      <el-button type="primary" @click="selControl">一键布控</el-button>
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
      labelPosition: 'top',
      modelTwoForm: {
        address: null,
        scope: null,
      },
      scopeList: [],
      isShowControlDev: true,
    }
  },
  methods: {
    // 一键布控
    selControl () {
      this.isShowControlDev = true;
      // this.addressObj_ = objDeepCopy(this.addressObj);
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