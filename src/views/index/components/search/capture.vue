<template>
  <div class="vl_se_ca">
    <div class="se_ca_l">
      <div class="se_ca_lu">
        <!-- <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->
      </div>
    </div>
    <div class="se_ca_r"></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      imageUrl: ''
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
}
</script>
<style lang="scss" scoped>
  .vl_se_ca {
    width: 100%; height: 100%;
    position: relative;
    > .se_ca_l {
      position: absolute; top: 0; left: 20px;
      width: 230px; height: 100%;
      background-color: #fff;
      box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
      > .se_ca_lu {
        padding: 20px;
        width: 230px;
        height: 230px;
      }
    }
    > .se_ca_r {
      padding-left: 270px; height: 100%;
    }
  }
</style>
<style lang="scss">
  .se_ca_lu {
    text-align: center;
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
</style>
