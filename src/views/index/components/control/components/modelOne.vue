<template>
  <el-form ref="modelOne" :model="modelOneForm" class="model_one">
    <!-- 失踪人员信息上传 -->
    <el-form-item label="失踪人员信息:" :rules="{ required: true, message: '', trigger: 'blur'}" style="margin-bottom: 0;">
      <div class="pic_format" style="left: 105px;top: -40px;">
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
          :key="item.enumField"
          :label="item.enumValue"
          :value="item.enumField">
        </el-option>
      </el-select>  
    </el-form-item>
    <el-form-item label="失踪时间:" prop="lostTime" :rules="[{ required: true, message: '请选择失踪时间', trigger: 'change'},{ validator: validateDate, trigger: 'change' }]">
      <el-date-picker
        v-model="modelOneForm.lostTime"
        type="datetime"
        :time-arrow-control="true"
        :picker-options="expireTimeOption"
        placeholder="请选择失踪时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="失踪地址:" prop="address" :rules="{ required: true, message: '请输入地名的关键词', trigger: 'blur'}">
       <el-autocomplete
        style="width: 100%;"
        v-model="modelOneForm.address"
        :trigger-on-focus="false"
        :fetch-suggestions="querySearch"
        value-key="name"
        @select="getAddress($event, 1)"
        placeholder="请输入地名的关键词">
      </el-autocomplete>
    </el-form-item>
    <el-form-item label="家庭地址:">
      <el-autocomplete
        style="width: 100%;"
        v-model="modelOneForm.homeAddress"
        :trigger-on-focus="false"
        :fetch-suggestions="querySearch"
        value-key="name"
        @select="getAddress($event, 2)"
        placeholder="请输入地名的关键词">
      </el-autocomplete>
    </el-form-item>
    <!-- 嫌疑人照片上传 -->
    <el-form-item label="嫌疑人照片:" style="margin-bottom: 0px">
      <div class="pic_format" style="left: 80px;top: -40px;">
        <div @click="popSel(2)">从布控库中选择</div>
      </div>
      <div is="uploadPic" :fileList="fileListTwo" @uploadPicDel="uploadPicDelTwo" @uploadPicFileList="uploadPicFileListTwo"></div>
    </el-form-item>
    <el-form-item>
      <div class="sel_car"><span>嫌疑车辆：</span><span @click="popSel(3)">从布控库中选择</span></div>
    </el-form-item>
    <el-form-item class="plate_num_box">
      <div class="plate_num" v-for="(item, index) in fileListThree" :key="index + item.vehicleNumber">
        <el-input v-model="item.vehicleNumber" :disabled="true"></el-input>
        <i class="el-icon-remove" @click="removeVehicleNumber(index)"></i>
      </div>
      <div v-for="(item, index) in modelOneForm.carNumberInfo" :key="index" style="position: relative;" class="plate_num">
        <el-form-item :prop="'carNumberInfo.' + index + '.vehicleNumber'" :rules="{validator: validPlateNumber, trigger: 'blur'}">
          <el-input v-model="item.vehicleNumber" placeholder="请输入车辆车牌号"></el-input>
          <i class="el-icon-remove" @click="removeLicensePlateNum(index)"></i>
        </el-form-item>
      </div>
      <el-form-item class="plate_num_btn_box">
        <div class="period_time_btn" @click="addLicensePlateNum()"><i class="vl_icon vl_icon_control_22"></i><span>添加车牌号码</span></div>
      </el-form-item>
    </el-form-item>
    <el-form-item style="margin-top: 20px;" v-if="!isShowControlDev">
      <el-button type="primary" @click="selControl('modelOne')">一键布控</el-button>
    </el-form-item>
    <div is="controlDev" ref="controlDev" @getChildModel="getChildModel" :lostTime="modelOneForm.lostTime" :addressObj="addressObj_" :devs="devs" :bays="bays" v-if="isShowControlDev"></div>
    <div is="portraitLib" ref="portraitLibDialogOne" :fileListOne="fileListOne" :imgNum="true" @getPortraitData="getPortraitDataOne"></div>
    <div is="portraitLib" ref="portraitLibDialogTwo" :fileListTwo="fileListTwo" @getPortraitData="getPortraitDataTwo"></div>
    <div is="vehicleLib" ref="vehicleLibDialog" @getVehicleData="getVehicleData" :fileList="fileListThree"></div>
  </el-form>
</template>
<script>
import uploadPic from './uploadPic.vue';
import controlDev from './controlDev.vue';
import vehicleLib from './vehicleLib.vue';
import portraitLib from './portraitLib.vue';
import {objDeepCopy, imgUrls, unique, formatDate} from '@/utils/util.js';
import {checkName, checkPlateNumber} from '@/utils/validator.js';
import {dataList} from '@/utils/data.js';
const validateDate_ = (rule, value, callback) => {
  if (value) {
    let timestamp = new Date().getTime()// 当前的时间戳
    if (value >= timestamp) {
      callback(new Error('不能选择大于当前的时间'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
export default {
  components: {uploadPic, controlDev, vehicleLib, portraitLib},
  props: ['modelList'],
  data () {
    return {
      modelOneForm: {
        lostTime: null,
        name: null,
        sex: null,
        address: null,
        homeAddress: null,
        carNumberInfo: [{vehicleNumber: null}],
        radius: null,
        url: null,
        longitude: null,
        latitude: null
      },
      expireTimeOption: {
        disabledDate(date) {
            return date.getTime() > Date.now();
        }
      },
      validateDate: validateDate_,
      validPlateNumber: checkPlateNumber,
      validName: checkName,
      sexList: this.dicFormater(dataList.sexType)[0].dictList,
      addressObj: [],
      addressObj_: [],
      fileListOne: [],//上传的失踪人员信息数据
      fileListTwo: [],//上传的嫌疑人照片数据
      fileListThree: [],//从布控库中选择的车辆
      isShowControlDev: false,//是否显示布控设备选择部分
      devData: {},//地图或列表中选择的设备和卡口
      devs: [],//编辑时用来回填的设备列表
      bays: []//编辑时用来回填的卡口列表
    }
  },
  mounted () {
    // 修改时回填数据
    if (this.modelList) {
      // 回填嫌疑车牌
      let [{carNumberInfo, pointDtoList: [{bayonetList, devList, longitude, latitude, url, ...other}], surveillanceObjectDtoList}] = this.modelList;
      carNumberInfo = carNumberInfo.split(',');
      other.carNumberInfo = [];
      carNumberInfo.forEach(f => {
        other.carNumberInfo.push({vehicleNumber: f});
      })
      other.lostTime = new Date(other.lostTime);
      this.modelOneForm = other;//回填表单数据
      this.devs = devList;//回填设备
      this.bays = bayonetList;//回填卡口

      this.fileListOne = [surveillanceObjectDtoList.find(m => (m.objType === 1 || m.objType === 3) && url === m.photoUrl)];//回填失踪人员照片
      this.fileListTwo = surveillanceObjectDtoList.filter(m => (m.objType === 1 || m.objType === 3) && url !== m.photoUrl);//回填嫌疑人照片
      this.fileListThree = surveillanceObjectDtoList.filter(m => m.objType === 2);//回填嫌疑车辆
      // 回填选择范围的经纬度、地址
      longitude = longitude.split(',');
      latitude = latitude.split(',');
      longitude.forEach((f, i) => {
        this.addressObj_.push({
          lngLat: [longitude[i], latitude[i]],
          address: i === 0 ? this.modelOneForm.address : this.modelOneForm.homeAddress,
          type: i + 1
        });
      })
      this.isShowControlDev = true;
    }
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
      // 从布控库中选择人像时，姓名、性别自动带入
      this.modelOneForm.name = this.fileListOne[0].name;
      const strs = ['未知', '男', '女', '未说明'];
      const nums = ['0', '1', '2' ,'9'];
      const index = strs.findIndex(item => this.fileListOne[0].sex.includes(item));
      this.modelOneForm.sex = nums[index];
    },
    // 从布控库中获取嫌疑人像
    getPortraitDataTwo (data) {
      this.fileListTwo = this.fileListTwo.concat(data);
      this.fileListTwo = unique(this.fileListTwo, 'objId');
    },
    // 从布控库中获取车像
    getVehicleData (data) {
      this.fileListThree = this.fileListThree.concat(data);
      this.fileListThree = unique(this.fileListThree, 'objId');
    },
    // 一键布控
    selControl (formName) {
      if (this.fileListOne.length === 0) {
        return this.$message.info('请上传失踪人员图片');
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
        return this.$message.info('请上传失踪人员图片');
      } 
      this.$refs['modelOne'].validate((valid) => {
        if (valid) {
          if (this.$refs['controlDev']) {
            this.$refs['controlDev'].sendParent();
            if (this.devData.devList.length === 0 && this.devData.bayonetList.length === 0) return this.$message.info('请先选择布控设备');
            
            let _modelOneForm = objDeepCopy(this.modelOneForm);

            _modelOneForm.carNumberInfo = _modelOneForm.carNumberInfo.map(m => m.vehicleNumber).join(',');
            _modelOneForm.radius = this.scopeRadius();
            _modelOneForm.url = this.fileListOne[0].photoUrl;
            _modelOneForm.lostTime = formatDate(_modelOneForm.lostTime);
            _modelOneForm.longitude = this.addressObj_.map(m => m.lngLat[0]).join(',');
            _modelOneForm.latitude = this.addressObj_.map(m => m.lngLat[1]).join(',');
            _modelOneForm = {..._modelOneForm, ...this.devData}
            this.$emit('getModel', {carNumberInfo: _modelOneForm.carNumberInfo, modelType: 1,  pointDtoList: [_modelOneForm], surveillanceObjectDtoList: [...imgUrls(this.fileListOne), ...imgUrls(this.fileListTwo), ...this.fileListThree]});
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
    // 失踪人员信息的上传方法
    uploadPicDelOne (fileList) {
      this.fileListOne = fileList;
      // 本地上传时，把自动带入的姓名、性别清空
      this.modelOneForm.name = null;
      this.modelOneForm.sex = null;
      this.$nextTick(() => {
        this.$refs['modelOne'].clearValidate('sex');
      })
    },
    // 失踪人员信息的上传方法
    uploadPicFileListOne (fileList) {
      this.fileListOne = fileList;
      // 本地上传时，把自动带入的姓名、性别清空
      this.modelOneForm.name = null;
      this.modelOneForm.sex = null;
      this.$nextTick(() => {
        this.$refs['modelOne'].clearValidate('sex');
      })
    },

    // 嫌疑人照片的上传方法
    uploadPicDelTwo (fileList) {
      this.fileListTwo = fileList;
      
    },
    // 嫌疑人照片的上传方法
    uploadPicFileListTwo (fileList) {
      fileList.forEach(f => !f.objId && (f.objId = f.name));//上传时，手动添加objId，用来去重
      this.fileListTwo = this.fileListTwo.concat(fileList);
      this.fileListTwo = unique(this.fileListTwo, 'objId');
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
    removeLicensePlateNum (index) {
      if (this.modelOneForm.carNumberInfo.length === 1) return this.$message.info('只剩一个不允许删除');
      this.modelOneForm.carNumberInfo.splice(index, 1);
    },
    // 删除从布控库中选择的车牌
    removeVehicleNumber (index) {
      this.fileListThree.splice(index, 1);
    },
    /* 地址下拉搜索相关方法 */
    // 获取追踪点
    getAddress (e, type) {
      if (!e.location) {
        this.$message.info('无法获取到经纬度！');
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
  .sel_car{
    height: 26px;
    > span:nth-child(2){
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
      padding-right: 10px;
      padding-bottom: 10px;
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
      .el-form-item{
        width: 100%;
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
}
</style>