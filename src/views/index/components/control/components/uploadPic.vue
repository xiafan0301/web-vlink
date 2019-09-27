<template>
  <vue-scroll>
    <div :class="['upload_pic_components', {'hidden': maxSize === picNum || isShow, 'is_disabled': isDisabled}]">
      <el-upload
        :style="{'display': isShow ? 'none' : 'block'}"
        ref="uploadPic"
        :disabled="isDisabled"
        multiple
        :accept="flag ? '.png,.jpg,.jpeg,.mp4,.bmp' : '.png,.jpg,.jpeg'"
        :limit="maxSize"
        :action="uploadUrl"
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
      <div v-if="isShow" class="video_box" @mouseenter="eventVideoTool = true;" @mouseleave="eventVideoTool = false;">
        <video id="eventVideo" :src="videoUrl"></video>
        <div class="result_tool" v-show="eventVideoTool">
          <div>
            <i class="vl_icon vl_icon_judge_01" v-if="curVideoPlay" @click="_pauseVideo()"></i>
            <i class="vl_icon vl_icon_control_09" v-else @click="_playVideo()"></i>
          </div>
        </div>
        <i class="vl_icon vl_icon_event_24" v-show="eventVideoTool" @click="removeVideo"></i>
      </div>
    </div>
  </vue-scroll>
</template>
<script>
import { ajaxCtx } from '@/config/config.js';
export default {
  name: 'uploadPic',
  /**
   * flag: 图片视频/图片
   * isDisabled: 是否禁止上传
   * maxSize: 最大上传个数
   * mode: 模块类型，布控/消息模块
  */
  props: ['flag', 'maxSize', 'fileList', 'isDisabled', 'mode'],
  data () {
    return {
      // 插入图片
      uploadUrl: ajaxCtx.base + '/appendix', // 图片上传地址
      dialogImageUrl: '',
      dialogVisible: false,
      picHeight: null,
      isShow: false,
      videoUrl: null,
      // 视频参数
      eventVideoTool: false,
      curVideoPlay: false
    }
  },
  computed: {
    picNum: {
      get () {
        return this.fileList && this.fileList.length;
      },
      set () {
        return this.fileList && this.fileList.length;
      }
    }
  },
  watch: {
    fileList () {
      if (this.mode !== 'message') {
        this.fileList.forEach(f => f.url = f.photoUrl);
      }
      if (this.fileList.some(s => s.fileType === 2)) {
        this.isShow = true;
        this.videoUrl = this.fileList[0].url;
      }
    }
  },
  mounted () {
    this.picHeight = window.screenHeight + 180;
  },
  methods: {
    // 移除上传的视频
    removeVideo () {
      this.isShow = false;
      this.eventVideoTool = false;
      this.$emit('uploadPicDel', []);
      this.picNum = this.fileList && this.fileList.length;      
    },
    // 开始播放
    _playVideo () {
      this.curVideoPlay = true;
      document.getElementById('eventVideo').play();
    },
    // 停止播放
    _pauseVideo () {
      this.curVideoPlay = false;
      document.getElementById('eventVideo').pause();
    },
    handleRemove (file, fileList) {
      this.isShow = false;
      this.$emit('uploadPicDel', fileList);
      this.picNum = fileList && fileList.length;
    },
    handlePictureCardPreview (file) {
      console.log(file, 'file')
      this.dialogImageUrl = file.photoUrl;
      this.dialogVisible = true;
      console.log(this.dialogImageUrl, 'this.dialogImageUrl')
    },
    uploadPicSucess (response, file, fileList) {
      console.log(file.raw.type, 'file')
      this.videoUrl = file.response.data.sysCommonImageInfo.fileFullPath;
      if (file.raw.type === 'video/mp4' || file.raw.type === 'video/bmp') this.isShow = true;
      this.$emit('uploadPicSubmit', file);
      this.$emit('uploadPicFileList', fileList);
      this.picNum = fileList && fileList.length;
    },
    uploadPicError () {
      this.$emit('uploadPicError', true);
      this.$message.error('上传失败！');
    },
    uploadPicExceed () {
      this.$message.warning(`最多一次可上传${this.maxSize}张图片${this.flag ? ',只能上传一个视频' : ''}`);
    },
    beforeAvatarUpload (file) {
      // 当前传的文件数如果大于1，就需要判断接下来上传的文件的是不是视频，是视频的话就返回false
      if (this.flag && this.picNum > 0 && (file.type === 'video/mp4' || file.type === 'video/bmp')) {
        this.$message.error('图片和视频只能上传一种!');
        return false;
      }

      let isJPG, isLt4M;
      if (this.flag) {
        isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'video/mp4' || file.type === 'video/bmp';
        isLt4M = file.size / 1024 / 1024 < 10;
      } else {
        isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
        isLt4M = file.size / 1024 / 1024 < 4;
      }

      if (this.flag && !isJPG) {
        this.$message.error('上传文件只能是 jpeg、jpg、png、mp4、bmp 格式!');
      } else if (!isJPG) {
        this.$message.error('上传图片只能是 jpeg、jpg、png 格式!');
      }
      if (this.flag && !isLt4M) {
        this.$message.error('上传文件大小不能超过 10MB!');
      } else if (!isJPG) {
        this.$message.error('上传图片大小不能超过 4MB!');
      }
      return isJPG && isLt4M;
    }
  }
}
</script>
<style lang="scss">
  .upload_pic_components{
    height: 117px;
    > div:first-child{
      height: 100%;
    }
    .el-upload-list__item{
      width:104px !important;
      height:104px !important;
    }
    &.hidden .el-upload--picture-card{
      display: none;
    }
    &.is_disabled .el-upload--picture-card:hover, &.is_disabled .el-upload--picture-card:focus{
      cursor: default;
      color: #333333;
      > i{
        color: #9F9F9F;
      }
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
    .video_box{
      width: 104px;
      height:104px;
      position: relative;
      border: 1px solid #cccccc;
      border-radius: 6px;
      > video{
        width: 100%;
        height: 100%;
        object-fit: fill;
        border-radius: 6px;
      }
      .result_tool{
        width: 50px;
        height: 50px;
        background: rgba(0,0,0,.4);
        border-radius: 50%;
        position: absolute;
        bottom: 50%;
        left: 50%;
        margin-left: -25px;
        margin-bottom: -25px;
        cursor: pointer;
        > div{
          width: 100%;
          height:100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      > i{
        position: absolute;
        right: 0;
        top: 4px;
        cursor: pointer;
      }
    }
  }
</style>
