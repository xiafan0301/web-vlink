<template>
  <div class="identy_container">
    <Breadcrumb :oData="[{name: '身份确认'}]"></Breadcrumb>
    <div class="content_box">
      <div class="left">
        <div class="upload_img">
          <el-upload
            :disabled="isAddDisabled"
            ref="uploadPic"
            accept="image/*"
            :limit="1"
            :action="uploadUrl"
            list-type="picture-card"
            :on-success="uploadPicSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList">
            <i class="vl_icon vl_icon_control_14"></i>
          </el-upload>
        </div>
        <div class="search_box">
          
        </div>
      </div>
      <div class="right"></div>
    </div>
  </div>
</template>
<script>
import Breadcrumb from '../breadcrumb.vue';
export default {
  components: { Breadcrumb },
  data () {
    return {
      dialogImageUrl: null,
    }
  },
  methods: {
    handleRemove () {
      this.dialogImageUrl = null;
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      // this.dialogVisible = true;
    },
    uploadPicSuccess (file) {
      this.dialogImageUrl = file.data.fileFullPath;
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      const isLt4M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        this.$message.error('上传图片只能是 jpeg、jpg、png 格式!');
      }
      if (!isLt4M) {
        this.$message.error('上传图片大小不能超过 4MB!');
      }
      return isJPG && isLt4M;
    },
  }
}
</script>

<style lang="scss" scoped>
.identy_container {
  width: 100%;
  .content_box {
    display: flex;
    .left {
      width: 136px;
      box-shadow:2px 0px 5px 0px rgba(131,131,131,0.28);
      background-color: #ffffff;
    }
    .right {
      width: calc(100% - 136px);
    }
  }
}
</style>

