<template>
  <el-form ref="modelSix" :model="modelSixForm" class="model_six">
    <!-- 上访人员照片上传 -->
    <el-form-item label="布控人员信息:" style="margin-bottom: 0;">
      <div class="pic_format" style="top: -40px;">
        <div @click="popSel(1)">从布控库中选择</div>
      </div>
      <div is="uploadPic" :fileList="fileList" @uploadPicDel="uploadPicDel" @uploadPicFileList="uploadPicFileList"></div>
    </el-form-item>
    <el-form-item class="plate_num_box">
      <div class="pic_format">
        <div @click="popSel(2)">从布控库中选择</div>
      </div>
      <div v-for="(item, index) in modelSixForm.licensePlateNumList" :key="index" style="position: relative;" class="license_plate_num">
        <el-form-item :label="index === 0 ? '布控车辆信息:' : ''" :prop="'licensePlateNumList.' + index + '.licensePlateNum'" :rules="{validator: validPlateNumber, trigger: 'blur'}">
          <el-input v-model="item.licensePlateNum" placeholder="请输入车辆车牌号"></el-input>
        </el-form-item>
      </div>
      <el-form-item class="plate_num_btn_box">
        <div class="period_time_btn" @click="addLicensePlateNum()"><i class="vl_icon vl_icon_control_22"></i><span>添加车牌号码</span></div>
        <div v-if="modelSixForm.licensePlateNumList.length > 1" class="period_time_btn" @click="removeLicensePlateNum()"><i class="vl_icon vl_icon_control_28"></i><span>删除车牌号码</span></div>
      </el-form-item>
    </el-form-item>
    <div is="controlDevUpdate" :modelType="6" @getControlDevUpdate="getControlDevUpdate"></div>
    <div is="vehicleLib" ref="vehicleLibDialog" @getVehicleData="getVehicleData"></div>
    <div is="portraitLib" ref="portraitLibDialog" @getPortraitData="getPortraitData"></div>
  </el-form>
</template>
<script>
import uploadPic from './uploadPic.vue';
import vehicleLib from './vehicleLib.vue';
import portraitLib from './portraitLib.vue';
import controlDevUpdate from './controlDevUpdate.vue';
import {checkPlateNumber} from '@/utils/validator.js';
export default {
  components: {uploadPic, controlDevUpdate, vehicleLib, portraitLib},
  data () {
    return {
      modelSixForm: {
        licensePlateNumList: [{licensePlateNum: null}]
      },
      fileList: [],
      validPlateNumber: checkPlateNumber,
      createSelDialog: false,
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
    // 失踪人员信息的上传方法
    uploadPicDel (fileList) {
      this.fileList = fileList;
    },
    // 失踪人员信息的上传方法
    uploadPicFileList (fileList) {
      this.fileList = fileList;
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
      this.$emit('getModel', {fileList: this.fileList,modelSixForm: this.modelSixForm, ...this.devUpdateData});
    },
    getControlDevUpdate (data) {
      this.devUpdateData = data;
    },
    // 添加车牌号码
    addLicensePlateNum () {
      this.modelSixForm.licensePlateNumList.push({licensePlateNum: null});
    },
    // 删除车牌号码
    removeLicensePlateNum () {
      this.modelSixForm.licensePlateNumList.pop();
    },
  }
}
</script>
<style lang="scss">
.model_six{
  padding: 0 20px;
  .pic_format{
    position: absolute;
    top: 0;
    left: 110px;
    z-index: 99;
    cursor: pointer;
    > div{
      color: #0C70F8;
    }
  }
  .plate_num_box .el-form-item__content{
    display: flex;
    flex-wrap: wrap;
    .plate_num{
      width: 25%;
      display: flex;
      margin-top: 20px;
      padding-right: 10px;
      > span{
        margin: 0 3px;
      }
      > .el-form-item{
        width: 100%;
        margin-bottom: 0;
        padding-right: 0!important;
        & > .el-form-item__label:nth-child(1){
          width: 330px;
          position: absolute;
          left: 0;
          top: -40px;
        }
      }
      .el-form-item__content{
        .el-date-editor{
          width: 100%!important;
        }
      }
      &:nth-child(5){
        padding-right: 0!important;
      }
    }
    .license_plate_num:not(:nth-child(2)){
      margin-top: 40px;
    }
    .license_plate_num{
      padding-right: 10px;
    }
    .plate_num_btn_box{ 
      margin-bottom: 0!important;
      padding: 40px 38px 0 0;
      &.top{
        padding-top: 20px;
      }
      .el-form-item__content{ 
        display: flex;
        .period_time_btn{
          width: 164px;
          height:40px;
          line-height:40px;
          text-align: center;
          border-radius:4px;
          border:1px dashed rgba(217,217,217,1);
          cursor: pointer;
          &:nth-child(1){
            color: #0C70F8;
            margin-right: 10px;
          }
          &:nth-child(2){
            color: #F94539;
          }
          .vl_icon_control_22{
            vertical-align: middle;
            margin-bottom: 5px;
            margin-right: 5px;
          }
          .vl_icon_control_28{
            vertical-align: middle;
            margin-bottom: 7px;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>