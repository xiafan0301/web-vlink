<template>
  <el-form ref="modelThree" :model="modelThreeForm" class="model_three">
    <!-- 上访人员照片上传 -->
    <el-form-item label="上访人员照片:" style="margin-bottom: 0;">
      <div class="pic_format" style="top: -40px;">
        <div @click="popSel(1)">从布控库中选择</div>
      </div>
      <div is="uploadPic" :fileList="fileListOne" @uploadPicDel="uploadPicDel" @uploadPicFileList="uploadPicFileList"></div>
    </el-form-item>
    <el-form-item style="margin-bottom: 10px;">
      <div class="sel_car"><span>上访车辆信息：</span><span @click="popSel(2)">从布控库中选择</span></div>
    </el-form-item>
    <el-form-item class="plate_num_box">
      <div class="plate_num" v-for="(item, index) in fileListTwo" :key="item.uid">
        <el-input v-model="item.vehicleNumber" :disabled="true"></el-input>
        <i class="el-icon-remove" @click="removeVehicleNumber(index)"></i>
      </div>
      <div v-for="(item, index) in modelThreeForm.carNumberInfo" :key="index" style="position: relative;" class="plate_num">
        <el-form-item :prop="'carNumberInfo.' + index + '.vehicleNumber'" :rules="{validator: validPlateNumber, trigger: 'blur'}" >
          <el-input v-model="item.vehicleNumber" placeholder="请输入车辆车牌号"></el-input>
          <i class="el-icon-remove" @click="removeLicensePlateNum(index)"></i>
        </el-form-item>
      </div>
      <el-form-item class="plate_num_btn_box">
        <div class="period_time_btn" @click="addLicensePlateNum()"><i class="vl_icon vl_icon_control_22"></i><span>添加车牌号码</span></div>
      </el-form-item>
    </el-form-item>
    <el-form-item style="margin-top: 20px;" v-if="!isShowControlDev">
      <el-button type="primary" @click="selControl('modelThree')">一键布控</el-button>
    </el-form-item>
    <div is="controlDev" ref="controlDev" v-if="isShowControlDev" :modelType="3" :devs="devs" :bays="bays" @getChildModel="getChildModel"></div>
    <div is="portraitLib" ref="portraitLibDialog" :fileListOne="fileListOne" @getPortraitData="getPortraitData"></div>
    <div is="vehicleLib" ref="vehicleLibDialog" :fileList="fileListTwo" @getVehicleData="getVehicleData"></div>
  </el-form>
</template>
<script>
import uploadPic from './uploadPic.vue';
import controlDev from './controlDev.vue';
import vehicleLib from './vehicleLib.vue';
import portraitLib from './portraitLib.vue';
import {unique, imgUrls} from '@/utils/util.js';
import {checkPlateNumber} from '@/utils/validator.js';
export default {
  components: {uploadPic, controlDev, vehicleLib, portraitLib},
  props: ['modelList'],
  data () {
    return {
      modelThreeForm: {
        carNumberInfo: [{vehicleNumber: null}]
      },
      validPlateNumber: checkPlateNumber,
      fileListOne: [],
      fileListTwo: [],
      createSelDialog: false,
      isShowControlDev: false,
      devs: [],
      bays: []
    }
  },
  mounted () {
    // 修改时回填数据
    if (this.modelList) {
      // 回填嫌疑车牌
      let [{carNumberInfo, pointDtoList: [{bayonetList, devList}], surveillanceObjectDtoList}] = this.modelList;
      carNumberInfo = carNumberInfo.split(',');
      this.modelThreeForm.carNumberInfo = [];
      carNumberInfo.forEach(f => {
        this.modelThreeForm.carNumberInfo.push({vehicleNumber: f});
      })
      this.devs = devList;
      this.bays = bayonetList;
      this.fileListOne = surveillanceObjectDtoList.filter(m => m.objType === 1 || m.objType === 3);//回填上访人员照片
      this.fileListTwo = surveillanceObjectDtoList.filter(m => m.objType === 2);//回填上访车辆信息
      this.isShowControlDev = true;
    }
  },
  methods: {
    // 从布控库中获取人像
    getPortraitData (data) {
      this.fileListOne = this.fileListOne.concat(data); 
      this.fileListOne = unique(this.fileListOne, 'objId');
    },
    // 从布控库中获取车像
    getVehicleData (data) {    
      this.fileListTwo = this.fileListTwo.concat(data);
      this.fileListTwo = unique(this.fileListTwo, 'objId');
    },
    // 上访人员信息的上传方法
    uploadPicDel (fileList) {
      this.fileListOne = fileList;
    },
    // 上访人员信息的上传方法
    uploadPicFileList (fileList) {
      fileList.forEach(f => !f.objId && (f.objId = f.name));//上传时，手动添加objId，用来去重
      this.fileListOne = this.fileListOne.concat(fileList);
      this.fileListOne = unique(this.fileListOne, 'objId');
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
    // 添加车牌号码
    addLicensePlateNum () {
      this.modelThreeForm.carNumberInfo.push({vehicleNumber: null});
    },
    // 删除车牌号码
    removeLicensePlateNum (index) {
      if (this.modelThreeForm.carNumberInfo.length === 1) return this.$message.info('只剩一个不允许删除');
      this.modelThreeForm.carNumberInfo.splice(index, 1);
    },
    // 删除从布控库中选择的车牌
    removeVehicleNumber (index) {
      this.fileListTwo.splice(index, 1);
    },
    // 向父组件传值
    sendParent () {
      if (this.fileListOne.length === 0 && !this.modelThreeForm.carNumberInfo[0].vehicleNumber) {
        return this.$message.info('请选择布控人员或者车辆');
      } 
      this.$refs['modelThree'].validate((valid) => {
        if (valid) {
          if (this.$refs['controlDev']) {
            this.$refs['controlDev'].sendParent();
            if (this.devData.devList.length === 0 && this.devData.bayonetList.length === 0) return this.$message.info('请先选择布控设备');
            const _carNumberInfo = this.modelThreeForm.carNumberInfo.map(m => m.vehicleNumber).join(',');
            this.$emit('getModel', {carNumberInfo: _carNumberInfo, modelType: 3,  pointDtoList: [this.devData], surveillanceObjectDtoList: [...imgUrls(this.fileListOne), ...this.fileListTwo]});
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
    // 一键布控
    selControl (formName) {
      if (this.fileListOne.length === 0 && !this.modelThreeForm.carNumberInfo[0].vehicleNumber) {
        return this.$message.info('请选择布控人员或者车辆');
      } 
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isShowControlDev = true;
        } else {
          return false;
        }
      });
      this.isShowControlDev = true;
    }
  }
}
</script>
<style lang="scss">
.model_three{
  padding: 0 20px;
  .plate_num_box .el-form-item__content{
    display: flex;
    flex-wrap: wrap;
    .plate_num{
      width: 25%;
      display: flex;
      padding-right: 10px;
      padding-bottom: 10px;
      .el-form-item{
        width: 100%;
      }
      .el-input{
        width: calc(100% - 40px);
        .el-input__inner{
          border-radius: 4px 0 0 4px;
        }
      }
      i{
        width: 40px;
        height:40px;
        background:rgba(246,246,246,1);
        border-radius:0px 4px 4px 0px;
        border:1px solid rgba(211,211,211,1);
        line-height: 40px;
        text-align: center;
        font-size: 18px;
        color: #F94539;
        cursor: pointer;
      }
      .el-form-item__content{
        display: flex;
      }
    }
    .plate_num_btn_box{ 
      width: 25%;
      margin-bottom: 0!important;
      padding-right: 10px;
      .el-form-item__content{
        display: flex;
        .period_time_btn{
          width: 100%;
          height:40px;
          line-height:40px;
          text-align: center;
          border-radius:4px;
          border:1px dashed rgba(217,217,217,1);
          vertical-align: middle;
          margin-bottom: 5px;
          cursor: pointer;
          color: #0C70F8;
          .vl_icon_control_22{
            vertical-align: middle;
            margin-bottom: 5px;
            margin-right: 5px;
          }
        }
      }
    }
  }
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
}
</style>