<template>
  <vue-scroll>
    <div class="ctc_end">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/task/list' }">全部任务</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: detailUrl }">{{ dicFormater( taskType, processType)}}</el-breadcrumb-item>
          <el-breadcrumb-item>
            {{processType == 2 ? '反馈' : processType == 3 ? '处理': '反馈情况'}}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content_box">
        <el-form class="end_form" :model="endForm" :rules="rules" ref="endForm" label-width="100px">
          <el-form-item label="处理人:" label-width="100px" prop="reportUser" class="report_user" v-if="processType == 3">
              <el-select
                style="width: 100%;"
                v-model="endForm.reportUser"
                multiple
                filterable
                reserve-keyword
                :multiple-limit="50"
                placeholder="请选择处理人">
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          <el-form-item :label="processType == 2 ? '处理内容' : processType == 3 ? '任务内容': '事件反馈'" prop="summary">
            <el-input :placeholder="[processType == 2 ? '请输入处理内容' : processType == 3 ? '请输入任务内容': '请输入事件反馈']" v-model="endForm.summary" type="textarea" rows="7"></el-input>
          </el-form-item>
        </el-form>
        <div class="end-upload">
          <el-upload
            :action="uploadUrl"
            multiple
            accept=".doc,.docx, .png, .jpg, .jpeg"
            :show-file-list='true'
            :on-remove="handleRemove"
            :before-upload='handleBeforeUpload'
            :on-success='handleSuccess'
          >
            <el-button size="small" class="upload-btn" icon="el-icon-upload2">上传文件</el-button>
            <div slot="tip" class="el-upload__tip end-upload-tip">（支持扩展名：.doc .docx .png .jpg .jpeg，最多上传3张图片）</div>
          </el-upload>
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
import { taskProcess } from '@/views/index/api/api.event.js';
import { getUserList } from '@/views/index/api/api.manage.js';
export default {
  data () {
    return {
      uploadUrl: ajaxCtx.base + '/new', // 图片上传地址
      endForm: {
        reportUser: null,
        summary: null,
      },
      rules: {
        summary: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { max: 1000, message: '最多输入1000字' }
        ]
      },
      uploadImgList: [], // 要上传的图片列表
      fileList: [], // 要上传文件列表
      isEndLoading: false,
      processType: null,
      detailUrl: '',
      taskType: dataList.taskType,
      userList: [],
      userInfo: {},
    }
  },
  mounted () {
      this.userInfo =  this.$store.state.loginUser;
      this.processType = this.$route.query.processType
      this.detailUrl = '/task/detail?id='+ this.$route.query.eventId +'&processType=' + this.processType
      if(this.processType == 3) {
          this.rules['reportUser'] = [
          { required: true, message: '请选择处理人', trigger: 'change' }]
          this.getList()
      }
  },
  methods: {
    // 关闭事件change
    handleEventChange () {
    },
    handleBeforeUpload (file) { // 图片上传之前
      const isLtTenM = file.size / 1024 / 1024 < 10;
      if (!isLtTenM) {
        this.$message.error('上传的图片大小不能超过10M');
      }
      return isLtTenM;
    },
    // 移除文件
    handleRemove (file) {
      const fileName = file.response.data.fileName;
      let type;
      if (fileName) {
        type = fileName.substring(fileName.lastIndexOf('.'));
        if (type === '.png' || type === '.jpg' || type === '.bmp') {
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
    // 获取所有的用户
    getList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0
      }
      getUserList(params)
        .then(res => {
          if (res) {
            res.data.list.map(item => {
              const params = {
                id: item.uid,
                name: item.userName
              }
              this.userList.push(params);
            })
          }
        })
        .catch(() => {})
    },
    // 提交
    submitData (form) {
      this.$refs[form].validate(valid => {
        let params, attachmentList = [], taskProcessDto = {};
        if (valid) {
          if (this.uploadImgList.length > 3) {
            this.$message({
              type: 'warning',
              message: '最多上传3张图片',
              customClass: 'request_tip'
            });
            return false;
          }
          this.fileList && this.fileList.map(item => {
            attachmentList.push(item);
          });
          this.uploadImgList && this.uploadImgList.map(item => {
            attachmentList.push(item);
          })
          taskProcessDto = {
              processContent: this.endForm.summary,
              processType: this.processType 
          }
          if(attachmentList && attachmentList.length > 0) {
              taskProcessDto['attachmentList'] = attachmentList
          }
          if(this.processType == 3) {
              taskProcessDto['uid'] = this.endForm.reportUser
          }
          params = {
              eventId: this.$route.query.eventId,
              taskProcessDto: taskProcessDto
            }
          this.isEndLoading = true;
          taskProcess(params)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '提交成功',
                  customClass: 'request_tip'
                })
                this.$router.push({name: 'task_list'});
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


