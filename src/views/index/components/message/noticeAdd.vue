<template>
  <div class="mes_notice_add">
    <!-- 面包屑 -->
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item @click.native="skip(1)" class="mes_back">公共管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageType === 2 ? '新增': '修改' }}公告</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="notice_add_box">
      <div class="add_form">
        <el-form :rules="addRules" ref="addForm" label-position="right" :model="addForm" label-width="82px">
          <el-form-item label="消息标题:" prop="title" style="width: 754px;">
            <el-input v-model="addForm.title" filterable placeholder="请输入标题，文字限制20字" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="消息内容:" prop="content" style="width: 754px;">
            <el-input
              maxlength="200"
              type="textarea"
              :rows="4"
              placeholder="请对事发情况进行描述，文字限制200字"
              v-model="addForm.content">
            </el-input>
          </el-form-item>
          <el-form-item style="width: 736px;">
            <div is="uploadPic" :fileList="fileList" @uploadPicDel="uploadPicDel" @uploadPicSubmit="uploadPicSubmit" @uploadPicFileList="uploadPicFileList" :maxSize="9"></div>
            <p class="vl_f_999">(最多传9张 支持JPEG、JPG、PNG，大小不超过2M)</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="add_footer">
        <!-- 新增 -->
        <el-button type="primary" v-if="pageType === 2" @click="addMsgNote('addForm', 2)">发布</el-button>
        <el-button v-if="pageType === 2" @click="addMsgNote('addForm', 1)">保存</el-button>
        <!-- 修改 -->
        <el-button type="primary" v-if="pageType === 4" @click="putMsgNote('addForm', 2)">发布</el-button>
        <el-button v-if="pageType === 4" @click="putMsgNote('addForm', 1)">保存</el-button>

        <el-button @click.native="skip(1)">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import uploadPic from '../control/components/uploadPic';
import {addMsgNote, getMsgNoteDetail, putMsgNote} from '@/views/index/api/api.message.js';
export default {
  components: {uploadPic},
  props: ['pageType', 'msgNoteId'],
  data () {
    return {
      addForm: {
        title: null,
        content: null,
      },
      fileList: [],//上传图片数
      addRules: {
        title: [
          {required: true, message: '请输入消息标题', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入消息内容', trigger: 'blur'}
        ]
      },
      detail: null,//公告管理详情
      loadingBtn: false,
    }
  },
  mounted () {
    // 修改，回填数据
    if (this.pageType === 4) {
      this.getMsgNoteDetail();
    }
  },
  methods: {
    skip (pageType) {
      this.$emit('changePage', pageType)
    },
    uploadPicDel (fileList) {
      this.fileList = fileList;
      console.log(fileList)
    },
    // 接收 到上传组件传过来的图片数据
    uploadPicSubmit () {
      
    },
    uploadPicFileList (fileList) {
      this.fileList = fileList;
    },
    // 新增公告消息
    addMsgNote (formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('通过验证')
          const data = {
            messageType: 2,
            publishState: type,
            title: this.addForm.title,
            details: this.addForm.content,
            sysAppendixList: this.fileList.map(m => m.response.data.sysAppendixInfo),//附件信息列表
          }
          addMsgNote(data).then(res => {
            if (res && res.data) {
              this.$message.success(type === 1 ? '保存成功' : '发布成功');
              this.$emit('getMsgNoteList');
            }
          })
        } else {
          return false;
        }
      });
    },
    // 获取公告消息详情，用于修改回填数据
    getMsgNoteDetail () {
      getMsgNoteDetail(this.msgNoteId).then(res => {
        if (res && res.data) {
          this.detail = res.data;
          this.addForm.title = this.detail.title;
          this.addForm.content = this.detail.details;
          this.fileList = this.detail.sysAppendixList.map(m => {
            return {
              cname: m.cname,
              contentUid: m.contentUid,
              createTime: m.createTime,
              delFlag: m.delFlag,
              desci: m.desci,
              filePathName: m.filePathName,
              fileType: m.fileType,
              imgHeight: m.imgHeight,
              imgSize: m.imgSize,
              imgWidth: m.imgWidth,
              opUserId: m.opUserId,
              url: m.path,
              sort: m.sort,
              thumbnailName: m.thumbnailName,
              thumbnailPath: m.thumbnailPath,
              uid: m.uid,
              updateTime: m.updateTime,
              updateUserId: m.updateUserId
            }
          })
        }
      })
    },
    // 修改公告消息
    putMsgNote (formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            messageType: 2,
            publishState: type,
            uid: this.detail.uid,
            title: this.addForm.title,
            details: this.addForm.content,
            sysAppendixList: this.fileList.map(m => {
              if (m.response) {
                return m.response.data.sysAppendixInfo;
              } else {
                return {
                  cname: m.cname,
                  contentUid: m.contentUid,
                  createTime: m.createTime,
                  delFlag: m.delFlag,
                  desci: m.desci,
                  filePathName: m.filePathName,
                  fileType: m.fileType,
                  imgHeight: m.imgHeight,
                  imgSize: m.imgSize,
                  imgWidth: m.imgWidth,
                  opUserId: m.opUserId,
                  path: m.url,
                  sort: m.sort,
                  thumbnailName: m.thumbnailName,
                  thumbnailPath: m.thumbnailPath,
                  uid: m.uid,
                  updateTime: m.updateTime,
                  updateUserId: m.updateUserId
                }
              }
            }),//附件信息列表
          }
          putMsgNote(data).then(res => {
            if (res && res.data) {
              this.$message.success(type === 1 ? '保存成功' : '发布成功');
              this.$emit('getMsgNoteList');
            }
          }).finally(() => {
            this.loadingBtn = false;
          })
        } else {
          return false;
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.mes_notice_add{
  width: 100%;
  position: relative;
  .notice_add_box{
    margin: 0 20px 20px 20px;
    padding: 20px 40px;
    min-height:680px;
    background:rgba(255,255,255,1);
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
  }
}
</style>
