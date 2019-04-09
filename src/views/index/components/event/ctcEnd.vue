<template>
  <vue-scroll>
    <div class="ctc_end">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/ctc' }">调度指挥</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/event/ctcDetailInfo' }">调度详情</el-breadcrumb-item>
          <el-breadcrumb-item>结束调度</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content_box">
        <el-form class="end_form" :model="endForm" :rules="rules" ref="endForm" label-width="100px">
          <el-form-item label="关闭事件:" prop="isCloseEvent">
            <el-radio-group v-model="endForm.isCloseEvent" @change="handleEventChange">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="endForm.isCloseEvent">
            <el-form-item label="事件等级:" prop="eventLevel">
              <el-select v-model="endForm.eventLevel" style="width: 100%;">
                <el-option
                  v-for="(item, index) in eventLevelList"
                  :key="index"
                  :label="item.enumValue"
                  :value="item.uid"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="总结内容:" prop="summary">
            <el-input :placeholder="[!isEventLevel ? '请输入调度指挥总结' : '请输入事件总结']" v-model="endForm.summary" type="textarea" rows="7"></el-input>
          </el-form-item>
        </el-form>
        <div class="end-upload">
          <el-upload
            :action="uploadUrl"
            accept=".doc,.docx,.pdf,.txt, .png, .jpg, .jpeg"
            :show-file-list='true'
            :before-upload='handleBeforeUpload'
            :on-success='handleSuccess'
          >
            <el-button size="small" class="upload-btn" icon="el-icon-upload2">上传文件</el-button>
            <div slot="tip" class="el-upload__tip end-upload-tip">（支持扩展名：.doc .docx .pdf .txt .png .jpg .jpeg）</div>
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
        <el-button class="operation_btn function_btn" @click="submitData('endForm')">确定</el-button>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
    </div>
  </vue-scroll>
</template>
<script>
import { dataList } from '@/utils/data.js';
import { ajaxCtx } from '@/config/config.js';
import { getDiciData, endEvent } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      uploadUrl: ajaxCtx.base + '/new', // 图片上传地址
      isEventLevel: false, // 是否显示事件等级
      endForm: {
        isCloseEvent: 0, // 1--是  0---否
        eventLevel: null,
        summary: null
      },
      rules: {
        eventLevel: [
          { required: true, message: '请选择事件等级', trigger: 'blur' }
        ],
        summary: [
          { max: 1000, message: '最多输入1000字' }
        ]
      },
      imgList2: [],
      fileList: [], // 文件列表
      eventLevelList: [], // 事件等级列表
    }
  },
  mounted () {
    this.getEventLevelList();
  },
  methods: {
    // 获取事件等级
    getEventLevelList () {
      const level = dataList.eventLevel;
      getDiciData(level)
        .then(res => {
          if (res) {
            this.eventLevelList = res.data;
          }
        })
        .catch(() => {})
    },
    // 关闭事件change
    handleEventChange (val) {
      if (val) {
        this.isEventLevel = true;
      } else {
        this.isEventLevel = false;
      }
    },
    handleBeforeUpload (file) { // 图片上传之前
      // this.isImgDisabled = true;
      // const isImg = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLtTenM = file.size / 1024 / 1024 < 10;
      // if (!isImg) {
      //   this.$message.error('上传的图片只能是jpeg、jpg、png格式!');
      //   this.isImgDisabled = false;
      // }
      if (!isLtTenM) {
        this.$message.error('上传的图片大小不能超过10M');
        this.isImgDisabled = false;
      }
      return isLtTenM;
    },
    // 文件上传成功
    handleSuccess (res, file) {
      if (res && res.data) {
        const fileName = res.data.fileName;
        let type;
        if (fileName) {
          type = fileName.substring(fileName.lastIndexOf('.'));
          let data;
          res.fileName = file.name;
          if (type === '.png' || type === '.jpg' || type === '.bmp') {
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
            this.imgList2.push(data);
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
          // this.endForm.attachmentList.push(data);
          this.isImgDisabled = false;
        }
      }
    },
    // 结束调度
    submitData (form) {
      this.$refs[form].validate(valid => {
        let params, attachmentList = [];
        if (valid) {
          this.fileList && this.fileList.map(item => {
            attachmentList.push(item);
          });
          this.imgList2 && this.imgList2.map(item => {
            attachmentList.push(item);
          })
          if (this.endForm.isCloseEvent) { // 关闭事件
            params = {
              eventId: this.$route.query.eventId,
              isCloseEvent: this.endForm.isCloseEvent,
              eventLevel: this.endForm.eventLevel,
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
          endEvent(params, this.$route.query.eventId)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '结束成功',
                  customClass: 'request_tip'
                })
                this.$router.push({name: 'event_ctc'});
              }
            })
            .catch(() => {})
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


