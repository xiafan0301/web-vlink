<template>
  <el-form ref="modelSix" :model="modelSixForm" class="model_six">
    <!-- 上访人员照片上传 -->
    <el-form-item label="布控人员信息:" style="margin-bottom: 0;">
      <div class="pic_format" style="top: -40px;">
        <div @click="popSel(1)">从布控库中选择</div>
      </div>
      <div is="uploadPic" :fileList="fileListOne" @uploadPicDel="uploadPicDel" @uploadPicFileList="uploadPicFileList"></div>
    </el-form-item>
    <div class="control_tab">
      <h1>车辆布控信息：</h1>
      <ul>
        <li :class="{'active': vehicleControlType === 1}" @click="changeVehicleTab(1)">按车牌布控</li>
        <li :class="{'active': vehicleControlType === 2}" @click="changeVehicleTab(2)">按特征布控</li>
        <span v-show="vehicleControlType === 2">（至少选择三种车辆特征）</span>
      </ul>
    </div>
    <div v-if="vehicleControlType === 1" class="plate_box">
      <el-form-item style="margin-bottom: 10px;">
        <div class="sel_car"><span>布控车辆信息：</span><span @click="popSel(2)">从布控库中选择</span></div>
      </el-form-item>
      <el-form-item class="plate_num_box">
        <div class="plate_num" v-for="(item, index) in fileListTwo" :key="item.uid">
          <el-input v-model="item.vehicleNumber" :disabled="true"></el-input>
          <i class="el-icon-remove" @click="removeVehicleNumber(index)"></i>
        </div>
        <div v-for="(item, index) in modelSixForm.carNumberInfo" :key="index" style="position: relative;" class="plate_num">
          <el-form-item :prop="'carNumberInfo.' + index + '.vehicleNumber'" :rules="{validator: validPlateNumber, trigger: 'blur'}">
            <el-input v-model="item.vehicleNumber" placeholder="请输入车辆车牌号"></el-input>
            <i class="el-icon-remove" @click="removeLicensePlateNum(index)"></i>
          </el-form-item>
        </div>
        <el-form-item class="plate_num_btn_box">
          <div class="period_time_btn" @click="addLicensePlateNum()"><i class="vl_icon vl_icon_control_22"></i><span>添加车牌号码</span></div>
        </el-form-item>
      </el-form-item>
    </div>
    <div v-if="vehicleControlType === 2" class="feature_box">
      <el-form-item label="号牌类型：">
        <el-select value-key="uid" v-model="modelSixForm.feature.numberType" placeholder="请选择">
          <el-option
            v-for="item in numberTypeList"
            :key="item.enumField"
            :label="item.enumValue"
            :value="item.enumField">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="号牌颜色：">
        <el-select v-model="modelSixForm.feature.numberColor" placeholder="请选择">
          <el-option
            v-for="item in numberColorList"
            :key="item.enumField"
            :label="item.enumValue"
            :value="item.enumField">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车辆类型：">
        <el-select v-model="modelSixForm.feature.vehicleType" placeholder="请选择">
          <el-option
            v-for="item in vehicleTypeList"
            :key="item.enumField"
            :label="item.enumValue"
            :value="item.enumField">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车辆颜色：">
        <el-select v-model="modelSixForm.feature.vehicleColor" placeholder="请选择">
          <el-option
            v-for="item in vehicleColorList"
            :key="item.enumField"
            :label="item.enumValue"
            :value="item.enumField">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车辆品牌：">
        <el-select v-model="modelSixForm.feature.vehicleBrand" placeholder="请选择">
          <el-option
            v-for="item in vehicleBrandList"
            :key="item.enumField"
            :label="item.enumValue"
            :value="item.enumField">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="车辆型号：">
        <el-input v-model="modelSixForm.feature.vehicleModel" placeholder="请输入车辆型号"></el-input>
      </el-form-item>
    </div>
    <div 
      is="mapSelector" 
      ref="mapSelector" 
      :isNotDialog="false"
      showTypes="DB"
      :activeDeviceList="activeDeviceList"
      >
    </div>
    <div is="portraitLib" ref="portraitLibDialog" :fileListOne="fileListOne" @getPortraitData="getPortraitData"></div>
    <div is="vehicleLib" ref="vehicleLibDialog" :fileList="fileListTwo" @getVehicleData="getVehicleData"></div>
  </el-form>
</template>
<script>
import uploadPic from './uploadPic.vue';
import vehicleLib from './vehicleLib.vue';
import portraitLib from './portraitLib.vue';
import mapSelector from '@/components/common/mapSelector.vue';
import {checkPlateNumber} from '@/utils/validator.js';
import {unique, imgUrls} from '@/utils/util.js';
import {dataList} from '@/utils/data.js';
export default {
  components: {uploadPic, mapSelector, vehicleLib, portraitLib},
  props: ['modelList', 'deviceId', 'plateNo', 'imgurl'],
  data () {
    return {
      modelSixForm: {
        carNumberInfo: [{vehicleNumber: null}],
        feature: {
          numberType: null,
          numberColor: null,
          vehicleType: null,
          vehicleColor: null,
          vehicleBrand: null,
          vehicleModel: null
        }
      },
      vehicleColorList: this.dicFormater(dataList.carColor)[0].dictList,
      vehicleTypeList: this.dicFormater(dataList.vehicleType)[0].dictList,
      numberTypeList: this.dicFormater(dataList.plateType)[0].dictList,
      numberColorList: this.dicFormater(dataList.plateColor)[0].dictList,
      vehicleBrandList: this.dicFormater(dataList.vehicleBrand)[0].dictList,
      fileListOne: [],
      fileListTwo: [],
      validPlateNumber: checkPlateNumber,
      createSelDialog: false,
      activeDeviceList: null,
      vehicleControlType: 1,//车辆布控类型
    }
  },
  mounted () {
    // 修改时回填数据
    if (this.modelList) {
      // 回填嫌疑车牌
      let [{carNumberInfo, pointDtoList: [{bayonetList, devList}], surveillanceObjectDtoList}] = this.modelList;
      carNumberInfo = carNumberInfo.split(',');
      this.modelSixForm.carNumberInfo = [];
      carNumberInfo.forEach(f => {
        this.modelSixForm.carNumberInfo.push({vehicleNumber: f});
      })
      this.fileListOne = surveillanceObjectDtoList.filter(m => m.objType === 1 || m.objType === 3);//回填上访人员照片
      this.fileListTwo = surveillanceObjectDtoList.filter(m => m.objType === 2);//回填上访车辆信息
      this.isShowControlDev = true;

      this.$nextTick(() => {
        this.activeDeviceList = [...devList.map(m => m.deviceId), ...bayonetList.map(m => m.bayonetId)];
      })
    }
    // 布控地图新增布控传入设备
    if (this.deviceId) {
      this.$nextTick(() => {
        this.activeDeviceList = [this.deviceId];
      })
    }

    if (this.imgurl) {
      this.fileListOne.push({
        photoUrl: this.imgurl,
        name: random14(),
        uid: random14(),//必须要文件uid，暂时用的随机数
        objId: random14(),
        objType: 1
      });
    }
    
    if (this.plateNo) {
      this.fileListTwo.push({
        vehicleNumber: this.plateNo,
        photoUrl: null,
        objType: 2,
        objId: random14()
      });
    }
  },
  methods: {
    changeVehicleTab (type) {
      this.vehicleControlType = type;
      // 每次切换tab清空数据
      this.fileListTwo = [];
      this.modelSixForm = {
        carNumberInfo: [{vehicleNumber: null}],
        feature: {
          numberType: null,
          numberColor: null,
          vehicleType: null,
          vehicleColor: null,
          vehicleBrand: null,
          vehicleModel: null
        }
      };
    },
    // 从布控库中获取布控人员信息
    getPortraitData (data) {
      this.fileListOne = this.fileListOne.concat(data);
      this.fileListOne = unique(this.fileListOne, 'objId');
      console.log(this.fileListOne, 'this.fileListOne');
      
    },
    // 从布控库中获取车辆
    getVehicleData (data) {
      this.fileListTwo = this.fileListTwo.concat(data);
      this.fileListTwo = unique(this.fileListTwo, 'objId');
      console.log(this.fileListTwo, 'this.fileListTwo');
      
    },
   // 布控人员信息的上传方法
    uploadPicDel (fileListOne) {
      this.fileListOne = fileListOne;
      console.log(this.fileListOne, 'this.fileListOne');
    },
    // 布控人员信息的上传方法
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
    // 向父组件传值
    sendParent () {
      if (this.fileListOne.length === 0 && this.fileListTwo.length === 0) {
        return this.$message.info('请选择布控人员或者车辆');
      } 
      const devData = this.$refs['mapSelector'].getCheckedIds();
      if (devData.deviceList.length > 0 || devData.bayonetList.length > 0) {
        let {deviceList: devList, bayonetList} = devData;
        devList = devList.map(m => {
          return {deviceId: m.uid}
        })
        bayonetList = bayonetList.map(m => {
          return {bayonetId: m.uid}
        })
        const _carNumberInfo = this.modelSixForm.carNumberInfo.map(m => m.vehicleNumber).join(',');
        this.$emit('getModel', {carNumberInfo: _carNumberInfo, modelType: 9,  pointDtoList: [{devList, bayonetList}], surveillanceObjectDtoList: [...imgUrls(this.fileListOne), ...this.fileListTwo]});
      } else {
        this.$message.info('请先选择布控设备');
      }
       
    },
    getControlDevUpdate (data) {
      this.devUpdateData = data;
    },
    // 添加车牌号码
    addLicensePlateNum () {
      this.modelSixForm.carNumberInfo.push({vehicleNumber: null});
    },
    // 删除车牌号码
    removeLicensePlateNum (index) {
      if (this.modelSixForm.carNumberInfo.length === 1) return this.$message.info('只剩一个不允许删除');
      this.modelSixForm.carNumberInfo.splice(index, 1);
    },
    // 移除从布控库中选择的车牌
    removeVehicleNumber (index) {
      this.fileListTwo.splice(index, 1);
    }
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
  .control_tab{
    padding-bottom: 10px;
    > h1{
      margin-bottom: 6px;
    }
    > ul{
      display: flex;
      > li{
        width: 102px;
        height:32px;
        line-height: 32px;
        text-align: center;
        border:1px solid #D3D3D3;
        color: #666666;
        cursor: pointer;
        &:hover{
          background:#E0F2FF;
          color: #0C70F8;
        }
        &:nth-child(1){
          border-radius:4px 0px 0px 4px;
        }
        &:nth-child(2){
          border-left: none;
          border-radius:0px 4px 4px 0px;
        }
      }
      .active{
        background:#E0F2FF;
        color: #0C70F8;
      }
      > span{
        padding-top: 6px;
        color: #999999;
      }
    }
  }
  .plate_box{
    animation: fadeIn .4s ease-out both;
  }
  .feature_box{
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 20px;
    animation: fadeIn .4s ease-out both;
    .el-form-item{
      width: 25%;
      margin-bottom: 0;
    }
    .el-form-item:not(:nth-child(4)){
      padding-right: 10px;
    }
  }
}
</style>