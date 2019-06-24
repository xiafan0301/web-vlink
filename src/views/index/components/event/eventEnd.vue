<template>
  <vue-scroll>
    <div class="event-end">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
          <template v-if="$route.query.status === 'handling'">
            <el-breadcrumb-item :to="{ path: '/event/treatingEventDetail', query: { eventId: $route.query.id, status: $route.query.status } }">事件详情</el-breadcrumb-item>
          </template>
          <template v-else>
            <el-breadcrumb-item :to="{ path: '/event/untreatEventDetail', query: { eventId: $route.query.id, status: $route.query.status } }">事件详情</el-breadcrumb-item>
          </template>
          <el-breadcrumb-item>结束事件</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <EventBasic :basicInfo="basicInfo" @emitHandleImg="emitHandleImg"></EventBasic>
        <div class="end-body">
          <el-form class="end-content" :model="endForm">
            <el-form-item class="limit_parent" label="事件总结:" label-width="100px;" prop="eventSummary">
              <el-input type="textarea" rows="7" style="width: 50%;" v-model="endForm.eventSummary" size="small" placeholder="请填写或者上传事件总结" maxlength="1000"></el-input>
            </el-form-item> 
          </el-form>
          <div class="end-upload">
            <el-upload
              :action="uploadUrl"
              multiple
              accept='.png,.jpg,.jpeg,.doc,.docx,.bmp'
              :before-upload='handleBeforeUpload'
              :on-success="handleSuccess"
              :on-remove="handleRemove"
              :show-file-list='true'
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
      </div>
      <div class="operation-footer">
        <el-button class="operation_btn function_btn" :loading="isEndLoading" @click="submitData">确定</el-button>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
      <BigImg :imgList="imgList1" :imgIndex='imgIndex' :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
    </div>
  </vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
import { getEventDetail, updateEvent } from '@/views/index/api/api.event.js';
import BigImg from '@/components/common/bigImg.vue';
import { ajaxCtx } from '@/config/config.js';
import { dataList, operationType } from '@/utils/data.js';
export default {
  components: { EventBasic, BigImg },
  data () {
    return {
      uploadUrl: ajaxCtx.base + '/new', // 图片上传地址
      endForm: {
        type: operationType.endEvent,
        eventSummary: null, // 事件总结
        addList: []
      },
      imgIndex: 0, // 点击的图片索引
      isShowImg: false, // 是否放大图片
      // isImgDisabled: false,
      imgList1: [], // 要放大的图片数据
      basicInfo: {}, // 事件详情
      fileList: [], // 要上传的文件列表
      uploadImgList: [], //要上传的图片列表
      isEndLoading: false, // 结束事件加载中
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
  mounted () {
    this.endForm.uid = this.$route.query.id;
    this.getDetail();
  },
  methods: {
    // 获取事件详情
    getDetail () {
      const eventId = this.$route.query.id;
      getEventDetail(eventId)
        .then(res => {
          if (res) {
            this.basicInfo = res.data;
          }
        })
        .catch(() => {})
    },
    // 删除文件
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
        this.endForm.addList.map((item, index) => {
          if (item.cname === fileName) {
            this.endForm.addList.splice(index, 1);
          }
        });
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
          this.endForm.addList.push(data);
        }
      }
    },
    handleBeforeUpload (file) { // 附件上传之前
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
    // 返回
    back () {
      this.$router.back(-1);
    },
    // 图片放大传参
    emitHandleImg (isShow, index) {
      this.openBigImg(index, this.basicInfo.attachmentList);
    },
    // 关闭图片放大
    emitCloseImgDialog(data){
      this.imgList1 = [];
      this.isShowImg = data;
    },
    // 放大图片
    openBigImg (index, data) {
      this.isShowImg = true;
      this.imgIndex = index;
      this.imgList1 = JSON.parse(JSON.stringify(data));
    },
    // 结束事件
    submitData () {
      if (!this.endForm.eventSummary && this.endForm.addList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请先上传或输入事件总结',
          customClass: 'request_tip'
        })
      } else {
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
        this.isEndLoading = true;
        updateEvent(this.endForm)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '结束成功',
                customClass: 'request_tip'
              })
              this.$router.push({name: 'event_manage'});
              this.isEndLoading = false;
            } else {
              this.isEndLoading = false;
            }
          })
          .catch(() => {this.isEndLoading = false;})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.event-end {
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 100px;
    .end-body {
      width: 100%;
      margin-bottom: 20px;
      background-color: #ffffff;
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
      .end-content {
        padding: 20px 20px 10px;
        .limit_parent {
          position: relative;
          .limit_number {
            position: absolute;
            left: -70px;
            top: 25px;
          }
        }
      }
      .error_tip {
        margin-left: 110px;
        margin-bottom: 10px;
        color: #F94539;
      }
      .end-upload {
        margin-left: 100px;
        width: 60%;
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
          width: 40%;
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

