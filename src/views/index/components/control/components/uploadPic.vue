<template>
  <div class="upload_pic_components" :class="{hidden: maxSize === picNum}">
    <el-upload
      ref="uploadPic"
      multiple
      accept="image/*"
      :limit="maxSize"
      action="http://apidev.aorise.org/vlink-base/appendix"
      :on-exceed="uploadPicExceed"
      :data="{projectType: 2}"
      list-type="picture-card"
      :file-list="fileList"
      :on-success="uploadPicSucess"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-error="uploadPicError"
      :before-upload="beforeAvatarUpload">
      <i class="el-icon-plus"></i>
      <p>添加</p>
    </el-upload>
    <div class="dialog_pic" v-show="dialogVisible" @click="dialogVisible = false">
      <img :src="dialogImageUrl" alt="" :style="{'max-height': picHeight + 'px'}">
    </div>
  </div>
</template>
<script>
export default {
  name: 'uploadPic',
  props: ['maxSize', 'fileList'],
  data () {
    return {
      // 插入图片
      dialogImageUrl: '',
      dialogVisible: false,
      imgToPlaceDialogVisible: false,
      imgSelectedList: {},
      picNum: null,
      picHeight: null
    }
  },
  mounted () {
    this.picHeight = window.screenHeight + 180;
  },
  methods: {
    handleRemove (file, fileList) {
      this.$emit('uploadPicDel', fileList);
      this.picNum = fileList && fileList.length;
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadPicSucess (response, file, fileList) {
      this.$emit('uploadPicSubmit', file);
      this.$emit('uploadPicFileList', fileList);
      this.picNum = fileList && fileList.length;
    },
    uploadPicError () {
      this.$emit('uploadPicError', true);
      this.$message.error('上传失败！');
    },
    uploadPicExceed () {
      this.$message.warning('最多一次可上传' + this.maxSize + '张图片,不能上传非图片文件');
    },
    beforeAvatarUpload (file) {
      this.$emit('uploadPicBefore', true);
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 jpeg、jpg、png 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>
<style lang="scss">
  .upload_pic_components{
    .el-upload-list__item{
      width:104px !important;
      height:104px !important;
    }
    &.hidden .el-upload--picture-card{
      display: none;
    }
    .dialog_pic{
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      overflow: auto;
      margin: 0;
      z-index: 2002;
      background: rgba(0, 0, 0, 0.4);
      img{
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 2003;
        margin: 0 !important;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        border-radius: 4px;
      }
    }
    .el-upload{
      width:104px;
      height:104px;
      background:rgba(246,246,246,1);
      border-radius:4px;
      border:1px solid rgba(211,211,211,1);
    }
    .el-upload p{
      position: absolute;
      left: 50%;
      margin-left: -12px;
      top: 16px;
    }
    .el-upload:hover{
      i{
        color: #0C70F8;
      }
    }
  }
</style>
