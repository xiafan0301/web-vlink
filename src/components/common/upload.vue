<template>
  <div class="um_vl_upload" :style="{width: width ? width : '100%', height: height ? height : '100%'}">
    <div class="vl_upload_con" @drop="dragDrop($event)" @dragover.prevent="dragOver">
      <el-upload class="vl_upload_upd"
        :show-file-list="false"
        ref="publicImgUpload"
        accept="image/*"
        :action="uploadAcion"
        list-type="picture-card"
        :before-upload="beforeAvatarUpload"
        :on-success="uploadSuccess"
        :on-error="uploadError">
        <span v-if="uploading" class="el-icon-loading"></span>
        <img v-show="!uploading" :style="{'transform': 'rotate(' + rotateNum * 90 + 'deg)'}" class="vl_upload_img" v-else-if="currentImg" :src="currentImg.path">
        <div class="vl_upload_tip" v-else>
          <span class="vl_icon"></span>
          <div>支持jpg,png,bmp格式</div>
          <p>点击上传图片</p>
        </div>
      </el-upload>
      <p @click="showHistoryPic">从上传记录中选择</p>
      <span class="upload_rotate" v-show="currentImg && currentImg.path" @click="rotateImg" title="旋转"><i class="el-icon-refresh-right"></i></span>
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
    <!--等待旋转的图片放入canvas-->
    <canvas style="display: none;" id="uploadImageCanvas"></canvas>
  </div>
</template>
<script>
import {ajaxCtx} from '@/config/config';
import { handUpload} from '@/views/index/api/api.base.js';
import {JtcPOSTAppendixInfo, JtcGETAppendixInfoList} from '@/views/index/api/api.judge.js';
export default {
  /**
   * emit事件说明
   * uploadEmit(data) 上传成功/选择上传历史的时候的emit事件
   */
  /** 
   * 拖拽说明
   * 拖拽dataTransfer key => upload_pic_url
   * dataTransfer.setData('upload_pic_url', IMG_URL);
   */
   /**
    * props参数说明
    * imgData 图片的默认或prop对象 {path: '', ...}，图片URL字段（path）为必须。
    * clear: 改变clear即可清空上传信息
    * width/height 宽高带单位，如 320px，默认都是100%
    */
   /**
    * 删除/清空说明
    * 删除/清空也会触发emit事件, 不过传递的参数为空，请注意！ uploadEmit(data) data为空
    */
  props: ['clear', 'width', 'height', 'imgData'],
  data () {
    return {
      rotateNum: 0, // 当前旋转基数
      uploadAcion: ajaxCtx.base + '/new',
      currentImg: null,
      uploading: false, // 是否上传中
      historyPicList: [], // 上传历史记录
      loadingHis: false,
      historyPicDialog: false,
      choosedHisPic: null,
      uploadTimer: null
    }
  },
  created () {
    if (this.imgData && this.imgData.path) {
      console.log('asasd', this.imgData);
      
      this.currentImg = Object.assign({}, this.imgData);
      this.picSubmit();
    }
  },
  watch: {
    imgData (val) {
      console.log('imgData', val);
      if (val && val.path) {
        this.choosedHisPic = null;
        this.currentImg = Object.assign({}, val);
      } else {
        this.uploadClear();
      }
    },
    clear () {
      this.uploadClear();
    },
    currentImg () {
      this.rotateNum = 0;
    }
  },
  methods: {
    // 图片旋转
    rotateImg () {
      if (this.currentImg && this.currentImg.path) {
        this.rotateNum++;
        let degree = 0;
        let rotateInput = this.rotateNum * 90;
        degree += parseInt(rotateInput);
        degree %= 360;
        let img = new Image();
        img.setAttribute("crossOrigin",'Anonymous');
        img.src = this.currentImg.path;
        img.onload = () => {
          let $w = img.width, $h = img.height, $c = document.getElementById("uploadImageCanvas");
          let ctx = $c.getContext("2d");
          if (degree === 90) {
            $c.width = $h;
            $c.height = $w;
            ctx.clearRect(0, 0, $h, $w);
            ctx.rotate(degree / 180 * Math.PI);
            ctx.translate(0, -$h);
            ctx.drawImage(img, 0, 0);
          } else if (degree === 270) {
            $c.width = $h;
            $c.height = $w;
            ctx.clearRect(0, 0, $h, $w);
            ctx.rotate(degree / 180 * Math.PI);
            ctx.translate(-$w, 0);
            ctx.drawImage(img, 0, 0);
          } else {
            $c.width = $w;
            $c.height = $h;
            ctx.clearRect(0, 0, $w, $h);
            ctx.translate($w / 2, $h / 2);
            ctx.rotate(degree / 180 * Math.PI);
            ctx.translate(-$w / 2, -$h / 2);
            ctx.drawImage(img, $w / 2 - $w / 2, $h / 2 - $h / 2);
          }
          $c.toBlob((blob) => {
            let fd = new FormData();
            let fileBlob = new File([blob], new Date().getTime() + '.png')
            fd.append("file", fileBlob);
            handUpload(fd).then((response) => {
              if (response && response.data) {
                let oRes = response.data;
                if (oRes) {
                  this.setImgUid(oRes);
                }
              }
            })
          });
        }
      } else {
        this.rotateNum = 0;
      }
    },
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
    uploadSuccess (response) {
      if (response && response.data) {
        let oRes = response.data;
        if (oRes) {
          this.setImgUid(oRes);
        }
      }
    },
    setImgUid (oRes) {
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
      // this.curImageUrl = x.path;
      if (this.$store.state.loginUser && this.$store.state.loginUser.uid) {
        this.currentImg.contentUid = this.$store.state.loginUser.uid;
        JtcPOSTAppendixInfo(this.currentImg).then(jRes => {
          if (jRes) {
            this.currentImg['uid'] = jRes.data;
            this.picSubmit();
          } else {
            this.uploading = false;
          }
        })
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
      if (this.uploadTimer) {
        window.clearTimeout(this.uploadTimer);
      }
      this.uploadTimer = setTimeout(() => {
        this.uploading = false;
      }, 1000)
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
        > div {
          color: #CCCCCC;
          position: absolute;
          bottom: 0px;
          width: 100%;
          height: 50%;
        }
      }
    }
    > p {
      display: none;
      position: absolute; bottom: 0; left: 0;
      width: 100%; height: 26px; line-height: 26px;
      cursor: pointer;
      background: #000;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
      border-radius: 0 0 6px 6px;
      text-align: center;
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
    > .upload_rotate {
      right: 33px;
    }
    &:hover {
      .el-upload--picture-card {
        background-color: #2981F8;
      }
      .vl_upload_tip {
        > p { display: none; }
        > div {
          color: #ABCFFF;
        }
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


