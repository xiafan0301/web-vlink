<template>
  <vue-scroll>
    <div class="ctc_end">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <template v-if="$route.query.type === 'ctc'">
            <el-breadcrumb-item :to="{ path: '/event/ctc' }">调度指挥</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/event/ctcDetailInfo', query: {id: $route.query.eventId, status: $route.query.status} }">调度详情</el-breadcrumb-item>
          </template>
           <template v-else-if="$route.query.type === 'alarm_ctc'">
            <el-breadcrumb-item :to="{ path: '/event/ctc' }">调度指挥</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/event/alarmCtcDetailInfo', query: {id: $route.query.eventId, status: $route.query.status} }">调度详情</el-breadcrumb-item>
          </template>
          <template v-else>
            <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/event/treatingEventDetail', query: {eventId: $route.query.eventId, status: $route.query.status} }">事件详情</el-breadcrumb-item>
          </template>
          <el-breadcrumb-item>结束调度</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content_box">
        <el-form class="end_form" :model="endForm" :rules="rules" ref="endForm" label-width="100px">
          <el-form-item label="关闭事件:" prop="isCloseEvent">
            <el-radio-group v-model="endForm.isCloseEvent">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="总结内容:" prop="summary">
            <el-input :placeholder="[endForm.isCloseEvent === 2 ? '请输入调度指挥总结' : '请输入事件总结']" v-model="endForm.summary" type="textarea" rows="7"></el-input>
          </el-form-item>
        </el-form>
        <div class="end-upload">
          <el-upload
            :action="uploadUrl"
            multiple
            accept=".doc,.docx, .png, .jpg, .jpeg,.bmp"
            :show-file-list='true'
            :on-remove="handleRemove"
            :before-upload='handleBeforeUpload'
            :on-success='handleSuccess'
          >
            <el-button size="small" class="upload-btn" icon="el-icon-upload2">上传文件</el-button>
            <div slot="tip" class="el-upload__tip end-upload-tip">（支持扩展名：.doc .docx .png .jpg .jpeg，最多上传3张图片）</div>
            <div slot="tip" class="el-upload__tip number-upload-tip" v-show="isNumberTip">最多上传3张图片</div>
          </el-upload>
          <!-- <div class="img_list">
            <div v-for="(item, index) in imgList2" :key="'item' + index">
              <img
                :src="item.path"
                @click="openBigImg(index, imgList2)"
              >
              <i class="vl_icon vl_icon_event_24 close_btn" @click="closeImgList(index, item)"></i>
            </div>
          </div>
          <div class="file_list">
            <div class='show-file-div-list' v-for="(item, index) in fileList" :key="'item'+index">
              <i class="vl_icon vl_icon_event_5"></i>
              <span>{{item.cname}}</span>
              <i class='el-icon-close' @click="deleteFile(index, item)"></i>
            </div>
          </div> -->
        </div>
      </div>
      <div class="operation-footer">
        <el-button class="operation_btn function_btn" :loading="isEndLoading" @click="submitData('endForm')">确定</el-button>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
    </div>
  </vue-scroll>
</template>
<script>
import { dataList } from '@/utils/data.js';
import { ajaxCtx } from '@/config/config.js';
import { endEvent } from '@/views/index/api/api.event.js';
export default {
  data () {
    return {
      uploadUrl: ajaxCtx.base + '/new', // 图片上传地址
      endForm: {
        isCloseEvent: 2, // 1--结束事件  2---结束调度
        summary: null,
      },
      rules: {
        summary: [
          { max: 1000, message: '最多输入1000字' }
        ]
      },
      uploadImgList: [], // 要上传的图片列表
      fileList: [], // 要上传文件列表
      isEndLoading: false,
      isNumberTip: false // 图片上传错误提示
    }
  },
  watch: {
    uploadImgList () { // 监听上传图片列表
      if (this.uploadImgList.length > 3) {
        this.isNumberTip = true;
      } else {
        this.isNumberTip = false;
      }
    }
  },
  methods: {
    handleBeforeUpload (file) { // 图片上传之前
      const isLtTenM = file.size / 1024 / 1024 < 10;
      const isWord = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp' || file.type === 'application/msword' 
        || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (!isWord) {
        this.$message({
          type: 'warning',
          message: '上传文件只能是png、jpg、jpeg、doc、docx格式',
          customClass: 'upload_file_tip'
        });
      }
      if (!isLtTenM) {
        this.$message({
          type: 'warning',
          message: '上传的图片大小不能超过10M',
          customClass: 'upload_file_tip'
        });
      }
      if (this.isNumberTip) {
        return false;
      }
      return isLtTenM && isWord;
    },
    // 移除文件
    handleRemove (file) {
      const fileName = file.response.data.fileName;
      let type;
      if (fileName) {
        type = fileName.substring(fileName.lastIndexOf('.'));
        if (type === '.png' || type === '.jpg' || type === '.bmp' || type === '.jpeg') {
          this.uploadImgList.map((item, index) => {
            if (item.cname === fileName) {
              this.uploadImgList.splice(index, 1);
            }
          });
        } else {
          this.fileList.map((item, index) => {
            if (item.cname === fileName) {
              this.fileList.splice(index, 1);
            }
          });
        }
      }
    },
    // 文件上传成功
    handleSuccess (res) {
      if (res && res.data) {
        const fileName = res.data.fileName;
        let type, data;
        if (fileName) {
          type = fileName.substring(fileName.lastIndexOf('.'));
          if (type === '.png' || type === '.jpg' || type === '.bmp' || type === '.jpeg') {
            data = {
              contentUid: 0,
              fileType: dataList.imgId,
              path: res.data.fileFullPath,
              filePathName: res.data.filePath,
              cname: res.data.fileName,
              imgSize: res.data.fileSize,
              imgWidth: res.data.fileWidth,
              imgHeight: res.data.fileHeight,
              thumbnailPath: res.data.thumbnailFileFullPath,
            }
            this.uploadImgList.push(data);
          } else {
            data = {
              contentUid: 0,
              fileType: dataList.fileId,
              path: res.data.fileFullPath,
              filePathName: res.data.filePath,
              cname: res.data.fileName,
              imgSize: res.data.fileSize,
              imgWidth: res.data.fileWidth,
              imgHeight: res.data.fileHeight,
              thumbnailPath: res.data.thumbnailFileFullPath,
            }
            this.fileList.push(data);
          }
        }
      }
    },
    // 结束调度
    submitData (form) {
      this.$refs[form].validate(valid => {
        let params, attachmentList = [];
        if (valid) {
          // if (this.uploadImgList.length > 3) {
          //   this.$message({
          //     type: 'warning',
          //     message: '最多上传3张图片',
          //     customClass: 'request_tip'
          //   });
          //   return false;
          // }
          if (this.isNumberTip) {
            return;
          }
          this.fileList && this.fileList.map(item => {
            attachmentList.push(item);
          });
          this.uploadImgList && this.uploadImgList.map(item => {
            attachmentList.push(item);
          })
          if (this.endForm.isCloseEvent === 1) { // 关闭事件
            params = {
              eventId: this.$route.query.eventId,
              isCloseEvent: this.endForm.isCloseEvent,
              eventSummary: this.endForm.summary,
              attachmentList: attachmentList
            }
          } else { // 不关闭事件
            params = {
              eventId: this.$route.query.eventId,
              isCloseEvent: this.endForm.isCloseEvent,
              dispatchSummary: this.endForm.summary,
              dispatchAttachmentList: attachmentList
            }
          }
          this.isEndLoading = true;
          endEvent(params)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '结束成功',
                  customClass: 'request_tip'
                })
                this.$router.push({name: 'event_ctc'});
                this.isEndLoading = false;
              } else {
                this.isEndLoading = false;
              }
            })
            .catch(() => {this.isEndLoading = false;})
        }
      })
    },
    // 返回
    back () {
      this.$router.back(-1);
    }
  }
}
</script>
<style lang="scss" scoped>
.ctc_end {
  width: 100%;
  height: 100%;
  .content_box {
    width: 98%;
    margin: 0 20px;
    margin-bottom: 80px;
    box-shadow: 5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius: 4px;
    background-color: #ffffff;
    .end_form {
      padding: 20px 0 0;
      width: 50%;
    }
    .end-upload {
      margin-left: 100px;
      width: 40%;
      padding-bottom: 20px;
      .upload-btn {
        border: 1px solid #D3D3D3;
        background-color: #ffffff;
        color: #333333;
      }
      .end-upload-tip {
        color: #999999;
        margin: 10px 0;
        font-size: 14px;
      }
      .number-upload-tip {
        color: #F94539;
        margin: 10px 0;
        font-size: 14px;
      }
      /deep/ .el-upload-list__item {
        width: 80%;
      }
      .img_list {
          display: flex;
          >div {
            position: relative;
            width: 80px;
            height: 80px;
            margin: 0 5px 5px 0;
            cursor: pointer;
            img {
              border-radius: 4px;
              margin-right: 5px;
              width: 100%;
              height:100%;
            }
            .close_btn {
              position: absolute;
              right: 0;
              top: 0;
              cursor: pointer;
            }
          }
        }
        .file_list {
          .show-file-div-list {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            margin-top: 10px;
            span {
              // color: #0785FD;
              font-size: 14px;
              margin: 0 5px;
            }
            i {
              font-size: 18px;
              color: #5D5D5D;
              cursor: pointer;
            }
          }
        }
    }
  }
  .operation-footer {
    border-left: 1px solid #F2F2F2;
    width: 100%;
    height: 65px;
    line-height: 65px;
    position: fixed;
    bottom: 0;
    background: #ffffff;
    padding-left: 20px;
    .operation_btn {
      padding: 0;
      width: 100px;
      height: 40px;
      text-align: center;
    }
    .function_btn {
      background: #0C70F8;
      color: #ffffff;
    }
    .back_btn {
      background: #ffffff;
      border: 1px solid #DDDDDD;
      color: #666666;
    }
  }
}
</style>


