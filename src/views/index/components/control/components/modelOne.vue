<template>
  <el-form ref="modelOne" :model="modelOneForm" class="model_one">
    <!-- 失踪人员信息上传 -->
    <el-form-item label="失踪人员信息:" :rules="{ required: true, message: '', trigger: 'blur'}" style="margin-bottom: 0;">
      <div class="pic_format" style="left: 110px;top: -40px;">
        <div @click="popSel(1)">从布控库中选择</div>
      </div>
      <div is="uploadPic" :fileList="fileListOne" @uploadPicDel="uploadPicDelOne" @uploadPicFileList="uploadPicFileListOne" :maxSize="1"></div>
    </el-form-item>
    <el-form-item label="人员姓名:" prop="name" :rules="[{ required: true, message: '请输入人员姓名', trigger: 'blur'}, {validator: validName, trigger: 'blur'}]">
      <el-input v-model="modelOneForm.name"></el-input>
    </el-form-item>
    <el-form-item label="性别:" prop="sex" :rules="{ required: true, message: '请选择人员性别', trigger: 'change'}">
      <el-select value-key="uid" v-model="modelOneForm.sex" filterable placeholder="请选择">
        <el-option
          v-for="item in sexList"
          :key="item.uid"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>  
    </el-form-item>
    <el-form-item label="失踪时间:" prop="lostTime" :rules="{ required: true, message: '请选择失踪时间', trigger: 'blur'}">
      <el-date-picker
        v-model="modelOneForm.lostTime"
        type="datetime"
        placeholder="请选择失踪时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="失踪地址:" prop="address" :rules="{ required: true, message: '请输入地名的关键词', trigger: 'blur'}">
       <el-autocomplete
        style="width: 100%;"
        v-model="modelOneForm.address"
        :trigger-on-focus="false"
        :fetch-suggestions="autoAdress"
        value-key="name"
        @select="chooseAddress($event, 1)"
        placeholder="请输入地名的关键词">
      </el-autocomplete>
    </el-form-item>
    <el-form-item label="家庭地址:">
      <el-autocomplete
        style="width: 100%;"
        v-model="modelOneForm.homeAddress"
        :trigger-on-focus="false"
        :fetch-suggestions="autoAdress"
        value-key="name"
        @select="chooseAddress($event, 2)"
        placeholder="请输入地名的关键词">
      </el-autocomplete>
    </el-form-item>
    <!-- 嫌疑人照片上传 -->
    <el-form-item label="嫌疑人照片:">
      <div class="pic_format" style="left: 96px;top: -40px;">
        <div @click="popSel(2)">从布控库中选择</div>
      </div>
      <div is="uploadPic" :fileList="fileListTwo" @uploadPicDel="uploadPicDelTwo" @uploadPicFileList="uploadPicFileListTwo"></div>
    </el-form-item>
    <el-form-item class="plate_num_box">
      <div class="pic_format" style="left: 80px;top: -20px;cursor: pointer;">
        <div @click="popSel(3)">从布控库中选择</div>
      </div>
      <div v-for="(item, index) in modelOneForm.carNumberInfo" :key="index" style="position: relative;" class="plate_num">
        <el-form-item :label="index === 0 ? '嫌疑车辆:' : ''" :prop="'carNumberInfo.' + index + '.vehicleNumber'" :rules="{validator: validPlateNumber, trigger: 'blur'}">
          <el-input v-model="item.vehicleNumber" placeholder="请输入车辆车牌号"></el-input>
        </el-form-item>
      </div>
      <el-form-item class="plate_num_btn_box">
        <div class="period_time_btn" @click="addLicensePlateNum()"><i class="vl_icon vl_icon_control_22"></i><span>添加车牌号码</span></div>
        <div v-if="modelOneForm.carNumberInfo.length > 1" class="period_time_btn" @click="removeLicensePlateNum()"><i class="vl_icon vl_icon_control_28"></i><span>删除车牌号码</span></div>
      </el-form-item>
    </el-form-item>
    <el-form-item style="margin-top: 20px;" v-if="!isShowControlDev">
      <el-button type="primary" @click="selControl('modelOne')">一键布控</el-button>
    </el-form-item>
    <div is="controlDev" ref="controlDev" @getChildModel="getChildModel" :lostTime="modelOneForm.lostTime" :addressObj="addressObj_" v-if="isShowControlDev"></div>
    <div is="portraitLib" ref="portraitLibDialogOne" :fileListOne="fileListOne" :imgNum="true" @getPortraitData="getPortraitDataOne"></div>
    <div is="portraitLib" ref="portraitLibDialogTwo" :fileListTwo="fileListTwo" @getPortraitData="getPortraitDataTwo"></div>
    <div is="vehicleLib" ref="vehicleLibDialog" @getVehicleData="getVehicleData" :carNumberInfo="modelOneForm.carNumberInfo"></div>
  </el-form>
</template>
<script>
import uploadPic from './uploadPic.vue';
import controlDev from './controlDev.vue';
import vehicleLib from './vehicleLib.vue';
import portraitLib from './portraitLib.vue';
import {random14, objDeepCopy, imgUrls, unique, formatDate} from '@/utils/util.js';
import {checkName, checkPlateNumber} from '@/utils/validator.js';
export default {
  components: {uploadPic, controlDev, vehicleLib, portraitLib},
  data () {
    return {
      map: null,
      modelOneForm: {
        lostTime: new Date('2019-9-10 11:00'),
        name: null,
        sex: null,
        address: null,
        homeAddress: null,
        carNumberInfo: [{vehicleNumber: null}],
        radius: null,
        // stayTime: null,
        url: null,
        longitude: null,
        latitude: null,
        bayonetList: [],
        devList: []
      },
      validPlateNumber: checkPlateNumber,
      validName: checkName,
      sexList: [
        {value: 1, label: '男'},
        {value: 2, label: '女'},
        {value: 3, label: '性别不限'}
      ],
      autoComplete: null,
      addressObj: [],
      addressObj_: [],
      fileListOne: [],//上传的失踪人员信息数据
      fileListTwo: [],//上传的嫌疑人照片数据
      isShowControlDev: false,//是否显示布控设备选择部分
      devData: {},
    }
  },
  mounted () {
    this.resetMap();
  },
  methods: {
    // 计算布控范围半径
    scopeRadius () {
      const minute10 = 10*60*1000;
      const minute30 = 30*60*1000;
      const time = new Date().getTime() - this.modelOneForm.lostTime.getTime();
      if (time === minute10) {
        return 10;
      } else if (time > minute10 && time < minute30) {
        return 60;
      } else if (time > minute30) {
        return 60;
      } else {
        return 10;
      }
    },
    // 从布控库中获取失踪人像
    getPortraitDataOne (data) {
      this.fileListOne = data;
      console.log(this.fileListOne, 'this.fileListOne')
    },
    // 从布控库中获取嫌疑人像
    getPortraitDataTwo (data) {
      this.fileListTwo = this.fileListTwo.concat(data);
      this.fileListTwo = unique(this.fileListTwo, 'objId');
      console.log(this.fileListTwo, 'this.fileListTwo')
    },
    // 从布控库中获取车像
    getVehicleData (data) {
      data.forEach((f, i) => {
        if (this.modelOneForm.carNumberInfo[i] === undefined) {
          this.modelOneForm.carNumberInfo.push({vehicleNumber: f.vehicleNumber});
        } else if (this.modelOneForm.carNumberInfo[i].vehicleNumber === null) {
          this.modelOneForm.carNumberInfo[i].vehicleNumber = f.vehicleNumber;
        }
      })
    },
    // 一键布控
    selControl (formName) {
      if (this.fileListOne.length === 0) {
        return this.$message.warning('请上传失踪人员图片');
      } 
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isShowControlDev = true;
          this.addressObj_ = objDeepCopy(this.addressObj);
        } else {
          return false;
        }
      });
    },
    // 向父组件传值
    sendParent () {
      if (this.fileListOne.length === 0) {
        return this.$message.warning('请上传失踪人员图片');
      } 
      this.$refs['modelOne'].validate((valid) => {
        if (valid) {
          if (this.$refs['controlDev']) {
            this.$refs['controlDev'].sendParent();

            const _modelOneForm = objDeepCopy(this.modelOneForm);

            _modelOneForm.carNumberInfo = _modelOneForm.carNumberInfo.map(m => m.vehicleNumber).join(',');
            _modelOneForm.radius = this.scopeRadius();
            _modelOneForm.url = this.fileListOne[0].photoUrl;
            _modelOneForm.lostTime = formatDate(_modelOneForm.lostTime);
            _modelOneForm.longitude = this.addressObj_.map(m => m.lngLat[0]).join(',');
            _modelOneForm.latitude = this.addressObj_.map(m => m.lngLat[1]).join(',');
            _modelOneForm.bayonetList = this.devData.bayonetList;
            _modelOneForm.devList = this.devData.devList;
            const surveillanceObjectDtoList = this.fileListOne.concat(this.fileListTwo);
            this.$emit('getModel', {carNumberInfo: _modelOneForm.carNumberInfo, modelType: 1,  pointDtoList: [_modelOneForm], surveillanceObjectDtoList});
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
    // 失踪人员信息的上传方法
    uploadPicDelOne (fileList) {
      this.fileListOne = fileList;
      console.log(this.fileListOne)
    },
    // 失踪人员信息的上传方法
    uploadPicFileListOne (fileList) {
      console.log(fileList, 'fileList')
      this.fileListOne = imgUrls(fileList);
      console.log(this.fileListOne)
    },

    // 嫌疑人照片的上传方法
    uploadPicDelTwo (fileList) {
      this.fileListTwo = fileList;
    },
    // 嫌疑人照片的上传方法
    uploadPicFileListTwo (fileList) {
      console.log(fileList, 'fileList')
      const _list = imgUrls(fileList);
      this.fileListTwo = this.fileListTwo.concat(_list);
      this.fileListTwo = unique(this.fileListTwo, 'objId');
      console.log(this.fileListTwo)
    },
    // 从库中选择
    popSel (type) {
      if (type === 1) {
        this.$refs['portraitLibDialogOne'].portraitLibDialog = true;
        this.$refs['portraitLibDialogOne'].reset();
      } else if (type === 2) {
        this.$refs['portraitLibDialogTwo'].portraitLibDialog = true;
        this.$refs['portraitLibDialogTwo'].reset();
      } else {
        this.$refs['vehicleLibDialog'].vehicleLibDialog = true;
        this.$refs['vehicleLibDialog'].reset();
      }
    },
    // 添加车牌号码
    addLicensePlateNum () {
      this.modelOneForm.carNumberInfo.push({vehicleNumber: null});
    },
    // 删除车牌号码
    removeLicensePlateNum () {
      this.modelOneForm.carNumberInfo.pop();
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
      if (type === 1) {
        if (this.addressObj.some(s => s.type === 1)) this.addressObj = this.addressObj.filter(f => f.type !== 1);
        this.addressObj.push({
          lngLat: [e.location.lng, e.location.lat],
          address: this.modelOneForm.address,
          type: 1
        });
      } else {
        if (this.addressObj.some(s => s.type === 2)) this.addressObj = this.addressObj.filter(f => f.type !== 2);
        this.addressObj.push({
          lngLat: [e.location.lng, e.location.lat],
          address: this.modelOneForm.homeAddress,
          type: 2
        });
      }
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
.model_one{
  padding: 0 20px;
  .el-form-item{
    margin-bottom: 10px;
  }
  .pic_format{
    position: absolute;
    z-index: 99;
    > div{
      color: #0C70F8;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.model_one{
  > .el-form-item{
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6){
      width: 50%;
      .el-date-editor{
        width: 100%;
      }
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
    .plate_num_btn_box{ 
      margin-bottom: 0!important;
      padding-right: 38px!important;
      padding-top: 20px;
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