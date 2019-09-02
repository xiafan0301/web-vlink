<template>
  <el-form ref="modelSix" :model="modelSixForm" class="model_six">
    <!-- 上访人员照片上传 -->
    <el-form-item label="布控人员信息:" :rules="{ required: true, message: '请上传失踪人员信息', trigger: 'blur'}" style="margin-bottom: 0;">
      <div class="pic_format" style="left: 110px;top: -40px;">
        <div @click="popSel">从布控库中选择</div>
      </div>
      <div is="uploadPic" :fileList="fileList" @uploadPicDel="uploadPicDel" @uploadPicFileList="uploadPicFileList"></div>
    </el-form-item>
    <el-form-item class="plate_num_box">
      <div class="pic_format" style="left: 80px;top: -20px;cursor: pointer;">
        <div @click="popSel">从布控库中选择</div>
      </div>
      <div v-for="(item, index) in modelSixForm.licensePlateNumList" :key="index" style="position: relative;" class="license_plate_num">
        <el-form-item :label="index === 0 ? '车库车辆信息:' : ''" :prop="'licensePlateNumList.' + index + '.recipient'" :rules="{ required: true, message: '请输入车辆车牌号', trigger: 'blur'}" >
          <el-input v-model="item.licensePlateNum" placeholder="请输入车辆车牌号"></el-input>
        </el-form-item>
      </div>
      <el-form-item class="plate_num_btn_box">
        <div class="period_time_btn" @click="addLicensePlateNum()"><i class="vl_icon vl_icon_control_22"></i><span>添加车牌号码</span></div>
        <div v-if="modelSixForm.licensePlateNumList.length > 1" class="period_time_btn" @click="removeLicensePlateNum()"><i class="vl_icon vl_icon_control_28"></i><span>删除车牌号码</span></div>
      </el-form-item>
    </el-form-item>
    <el-form-item style="margin-top: 20px;">
      <el-button type="primary" @click="selControl">一键布控</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import uploadPic from './uploadPic.vue';
export default {
  components: {uploadPic},
  data () {
    return {
      modelSixForm: {
        licensePlateNumList: [{licensePlateNum: null}]
      },
      fileList: [],
      createSelDialog: false
    }
  },
  methods: {
    // 失踪人员信息的上传方法
    uploadPicDel (fileList) {
      this.fileListOne = fileList;
    },
    // 失踪人员信息的上传方法
    uploadPicFileList (fileList) {
      this.fileListOne = fileList;
    },
    // 从库中选择
    popSel () {
      this.createSelDialog = true;
    },
    // 添加车牌号码
    addLicensePlateNum () {
      this.modelSixForm.licensePlateNumList.push({licensePlateNum: null});
    },
    // 删除车牌号码
    removeLicensePlateNum () {
      this.modelSixForm.licensePlateNumList.pop();
    },
    // 一键布控
    selControl () {

    }
  }
}
</script>
<style lang="scss" scoped>
.model_six{
  padding: 0 20px;
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