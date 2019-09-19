<template>
  <el-form ref="modelSix" :model="modelSixForm" class="model_six">
    <!-- 上访人员照片上传 -->
    <el-form-item label="布控人员信息:" style="margin-bottom: 0;">
      <div class="pic_format" style="top: -40px;">
        <div @click="popSel(1)">从布控库中选择</div>
      </div>
      <div is="uploadPic" :fileList="fileListOne" @uploadPicDel="uploadPicDel" @uploadPicFileList="uploadPicFileList"></div>
    </el-form-item>
    <el-form-item style="margin-bottom: 10px;">
      <div class="sel_car"><span>布控车辆信息：</span><span @click="popSel(2)">从布控库中选择</span></div>
    </el-form-item>
    <el-form-item class="plate_num_box">
      <div class="plate_num" v-for="item in fileListTwo" :key="item.uid">
        <el-input v-model="item.vehicleNumber" :disabled="true"></el-input>
      </div>
      <div v-for="(item, index) in modelSixForm.carNumberInfo" :key="index" style="position: relative;" class="license_plate_num">
        <el-form-item :prop="'carNumberInfo.' + index + '.vehicleNumber'" :rules="{validator: validPlateNumber, trigger: 'blur'}">
          <el-input v-model="item.vehicleNumber" placeholder="请输入车辆车牌号"></el-input>
        </el-form-item>
      </div>
      <el-form-item class="plate_num_btn_box">
        <div class="period_time_btn" @click="addLicensePlateNum()"><i class="vl_icon vl_icon_control_22"></i><span>添加车牌号码</span></div>
        <div v-if="modelSixForm.carNumberInfo.length > 1" class="period_time_btn" @click="removeLicensePlateNum()"><i class="vl_icon vl_icon_control_28"></i><span>删除车牌号码</span></div>
      </el-form-item>
    </el-form-item>
    <div is="controlDevUpdate" :modelType="6" @getControlDevUpdate="getControlDevUpdate"></div>
    <div is="portraitLib" ref="portraitLibDialog" :fileListOne="fileListOne" @getPortraitData="getPortraitData"></div>
    <div is="vehicleLib" ref="vehicleLibDialog" :fileList="fileListTwo" @getVehicleData="getVehicleData"></div>
  </el-form>
</template>
<script>
import uploadPic from './uploadPic.vue';
import vehicleLib from './vehicleLib.vue';
import portraitLib from './portraitLib.vue';
import controlDevUpdate from './controlDevUpdate.vue';
import {checkPlateNumber} from '@/utils/validator.js';
import {random14, objDeepCopy, unique, imgUrls} from '@/utils/util.js';
export default {
  components: {uploadPic, controlDevUpdate, vehicleLib, portraitLib},
  props: ['modelList'],
  data () {
    return {
      modelSixForm: {
        carNumberInfo: [{vehicleNumber: null}]
      },
      fileListOne: [],
      fileListTwo: [],
      validPlateNumber: checkPlateNumber,
      createSelDialog: false,
      devUpdateData: {}
    }
  },
  mounted () {
    // 修改时回填数据
    if (this.modelList) {
      console.log(this.modelList, 'this.modelList')
      // 回填嫌疑车牌
      let [{carNumberInfo, pointDtoList: [{bayonetList, devList}], surveillanceObjectDtoList}] = this.modelList;
      carNumberInfo = carNumberInfo.split(',');
      this.modelSixForm.carNumberInfo = [];
      carNumberInfo.forEach(f => {
        this.modelSixForm.carNumberInfo.push({vehicleNumber: f});
      })
      
      let one = surveillanceObjectDtoList.filter(m => m.objType === 1);//回填上访人员照片
      let two = surveillanceObjectDtoList.filter(m => m.objType === 2);//回填上访车辆信息
      this.fileListOne = one;
      this.fileListTwo = two;

     
      this.isShowControlDev = true;
    }
  },
  methods: {
    // 从布控库中获取布控人员信息
    getPortraitData (data) {
      console.log(data, 'datadata')
      const _list = this.fileListOne.concat(data);
      this.fileListOne = unique(_list, 'objId');
    },
    // 从布控库中获取车辆
    getVehicleData (data) {
      this.fileListTwo = data;
    },
   // 布控人员信息的上传方法
    uploadPicDel (fileListOne) {
      this.fileListOne = fileListOne;
    },
    // 布控人员信息的上传方法
    uploadPicFileList (fileListOne) {
      const _list = imgUrls(fileListOne);
      this.fileListOne = this.fileListOne.concat(_list);
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
        const _carNumberInfo = this.modelSixForm.carNumberInfo.map(m => m.vehicleNumber).join(',');
        this.$emit('getModel', {carNumberInfo: _carNumberInfo, modelType: 6,  pointDtoList: [this.devUpdateData], surveillanceObjectDtoList: [...this.fileListOne, ...this.fileListTwo]});
    },
    getControlDevUpdate (data) {
      this.devUpdateData = data;
    },
    // 添加车牌号码
    addLicensePlateNum () {
      this.modelSixForm.carNumberInfo.push({vehicleNumber: null});
    },
    // 删除车牌号码
    removeLicensePlateNum () {
      this.modelSixForm.carNumberInfo.pop();
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
  .sel_car{
    height: 26px;
    > span:nth-child(2){
      color: #0C70F8;
      cursor: pointer;
    }
  }
  .plate_num_box .el-form-item__content{
    display: flex;
    flex-wrap: wrap;
    .plate_num{
      width: 25%;
      display: flex;
      padding-right: 10px;
      padding-bottom: 10px;
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
    .license_plate_num{
      padding-right: 10px;
      padding-bottom: 10px;
    }
    .plate_num_btn_box{ 
      margin-bottom: 0!important;
      padding: 0 38px 0 0;
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