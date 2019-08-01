<template>
  <div class="um_vl_upload" :style="{width: width ? width : '100%', height: height ? height : '100%'}">
    <div class="vl_upload_con" @drop="dragDrop($event)" @dragover.prevent="dragOver">
      <el-upload class="vl_upload_upd"
        :show-file-list="false"
        accept="image/*"
        :action="uploadAcion"
        list-type="picture-card"
        :before-upload="beforeAvatarUpload"
        :on-success="uploadSucess"
        :on-error="uploadError">
        <span v-if="uploading" class="el-icon-loading"></span>
        <img class="vl_upload_img" v-else-if="currentImg" :src="currentImg.path">
        <div class="vl_upload_tip" v-else>
          <span class="vl_icon"></span>
          <p>点击上传图片</p>
        </div>
      </el-upload>
      <p @click="showHistoryPic">从上传记录中选择</p>
      <span v-show="currentImg && currentImg.path" title="清空" @click="uploadClear(true)"><i class="el-icon-delete"></i></span>
    </div>
    <!--历史记录弹窗 :close-on-click-modal="false" -->
    <el-dialog
      :visible.sync="historyPicDialog"
      class="vl_upload_his_dialog"
      :append-to-body="true"
      title="最近上传的图片">
      <div style="text-align: center;font-size: 20px;" v-if="loadingHis">
        <i class="el-icon-loading"></i>
      </div>
      <vue-scroll class="his_pic_box" v-else-if="historyPicList.length">
        <div class="his_pic_item" v-for="item in historyPicList" :key="item.id" @click="chooseHisPic(item)">
          <div :class="{'his_pic_active': item.checked}">
            <div class="com_width_to_height">
              <div>
                <div>
                  <img :src="item.path" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="clear: both;"></div>
      </vue-scroll>
      <p style="text-align: center; padding-top: 10px;" v-else>暂无历史记录</p>
      <div slot="footer">
        <el-button @click="historyPicDialog = false">取消</el-button>
        <el-button type="primary" @click="addHisToImg" :disabled="!choosedHisPic">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {ajaxCtx} from '@/config/config';
import {JtcGETAppendixInfoList} from '@/views/index/api/api.judge.js';
export default {
  /** 
   * @uploadEmit 上传成功/选择上传历史的时候的emit事件
   */
  /** 
   * 拖拽dataTransfer key => upload_pic_url
   * dataTransfer.setData('upload_pic_url', IMG_URL);
   */
   /** 
   * clear: 改变clear即可清空上传信息
   * width/height 宽高带单位，如 320px，默认都是100%
   */
  props: ['clear', 'width', 'height'],
  data () {
    return {
      uploadAcion: ajaxCtx.base + '/new',
      currentImg: null,
      uploading: false, // 是否上传中
      historyPicList: [], // 上传历史记录
      loadingHis: false,
      historyPicDialog: false,
      choosedHisPic: null
    }
  },
  watch: {
    clear () {
      this.uploadClear();
    }
  },
  methods: {
    // drag over
    dragOver () {
      // console.log('drag over')
    },
    // 接收拖拽
    dragDrop (ev) {
      if (!ev) { ev = window.event; }
      let url = ev.dataTransfer.getData('upload_pic_url');
      if (url && url.length > 0) {
        this.choosedHisPic = null;
        this.currentImg = {
          path: url
        };
        this.picSubmit();
      }
    },
    // flag
    uploadClear (flag) {
      this.currentImg = null;
      this.choosedHisPic = null;
      if (flag) {
        this.picSubmit();
      }
    },
    // 上传图片
    beforeAvatarUpload (file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
      const isLt = file.size / 1024 / 1024 < 100;
      if (!isJPG) {
        this.$message.error('只能上传 JPG / PNG 格式图片!');
      }
      if (!isLt) {
        this.$message.error('上传图片大小不能超过 100MB!');
      }
      if (isJPG && isLt) {
        this.uploading = true;
        return true;
      } else {
        return false;
      }
    },
    uploadSucess (response, file, fileList) {
      this.uploading = false;
      if (response && response.data) {
        let oRes = response.data;
        if (oRes) {
          this.currentImg = {
            cname: oRes.fileName, // 附件名称 ,
            // contentUid: this.$store.state.loginUser.uid,
            // desci: '', // 备注 ,
            filePathName: oRes.fileName, // 附件保存名称 ,
            fileType: 1, // 文件类型 ,
            imgHeight: oRes.fileHeight, // 图片高存储的单位位px ,
            imgSize: oRes.fileSize, // 图片大小存储的单位位byte ,
            imgWidth: oRes.fileWidth, //  图片宽存储的单位位px ,
            // otherFlag: '', // 其他标识 ,
            path: oRes.fileFullPath, // 附件路径 ,
            // path: oRes.path,
            thumbnailName: oRes.thumbnailFileName, // 缩略图名称 ,
            thumbnailPath: oRes.thumbnailFileFullPath // 缩略图路径 ,
            // uid: '' //  附件标识
          };
          this.picSubmit();
          // this.curImageUrl = x.path;
        }
      }
    },
    uploadError () {
      this.uploading = false;
      this.$message.error('上传失败')
    },
    showHistoryPic () {
      this.choosedHisPic = null;
      this.loadingHis = true;
      this.historyPicDialog = true;
      let params = {
        userId: this.$store.state.loginUser.uid,
        fileType: 1
      }
      JtcGETAppendixInfoList(params).then(res => {
        if (res) {
          res.data.forEach(x => x.checked = false);
          this.historyPicList = res.data;
        }
        this.loadingHis = false;
      }).catch(() => {
        this.loadingHis = false;
      })
    },
    chooseHisPic (item) {
      this.historyPicList.forEach(x => x.checked = false)
      item.checked = true;
      this.choosedHisPic = item;
    },
    addHisToImg () {
      this.historyPicDialog = false;
      this.currentImg = Object.assign({}, this.choosedHisPic);
      this.picSubmit();
    },
    picSubmit () {
      this.$emit('uploadEmit', this.currentImg);
    }
  }
}
</script>
<style lang="scss">
.um_vl_upload {
  width: 100%; height: 100%;
  overflow: hidden;
  .vl_upload_con {
    width: 100%; height: 100%;
    position: relative;
    overflow: hidden;
    border-width: 0 !important;
    .vl_upload_upd {
      width: 100%; height: 100%;
      overflow: hidden;
      border-width: 0 !important;
      .vl_upload_img {
        width: 100%; height: 100%;
        border-radius: 6px;
      }
      .el-upload--picture-card {
        width: 100%; height: 100%;
        border-width: 0 !important;
        overflow: hidden;
      }
      .el-icon-loading {
        position: absolute; top: 50%; left: 50%;
        margin-top: -25px; margin-left: -15px;
        width: auto; height: auto;
        font-size: 30px; color: #8c939d;
      }
      .vl_upload_tip {
        position: relative;
        width: 100%;
        height: 100%;
        > span {
          position: absolute; top: 50%; left: 50%;
          margin-top: -45px; margin-left: -50px;
          width: 100px; height: 85px;
          background-position: -916px -1476px;
        }
        > p {
          position: absolute; bottom: 6px; left: 0;
          width: 100%; line-height: normal;
          text-align: center;
          color: #999;
        }
      }
    }
    > p {
      display: none;
      position: absolute; bottom: 0; left: 0;
      width: 100%; height: 40px; line-height: 40px;
      cursor: pointer;
      background: #000;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      border-radius: 0 0 6px 6px;
    }
    > span {
      display: none;
      position: absolute; top: 5px; right: 5px;
      line-height: normal;
      background-color: #999;
      background-color: rgba(0, 0, 0, 0.4);
      padding: 2px 3px;
      border-radius: 4px;
      cursor: pointer;
      > i {
        font-size: 16px;
        color: #fff;
      }
    }
    &:hover {
      .el-upload--picture-card {
        background-color: #2981F8;
      }
      .vl_upload_tip {
        > p { display: none; }
      }
      > p { display: block; }
      > span { display: block; }
    }
  }
}
.vl_upload_his_dialog {
  .el-dialog { width: 940px; }
  .el-dialog__title { color: #333; font-size: 16px; }
  .el-dialog__body { padding: 10px 30px 10px 30px; height: 355px; }
  .his_pic_box {
    width: 100%;
    .his_pic_item {
      float: left;
      width: 12.5%;
      padding-bottom: 10px; padding-right: 10px;
      cursor: pointer;
      > div {
        border: 3px solid #fff;
        width: 100%; height: 100%;
        box-shadow: 0 0 4px #eee;
        &.his_pic_active {
          border-color: #0C70F8;
        }
      }
    }
  }
}
</style>


