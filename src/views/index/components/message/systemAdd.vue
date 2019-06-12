<template>
  <div class="mes_system_add">
    <!-- 面包屑 -->
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item @click.native="skip(1)" class="mes_back">系统消息</el-breadcrumb-item>
        <el-breadcrumb-item>新增系统消息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="system_add_box">
      <div class="add_form">
        <el-form :rules="addRules" ref="addForm" label-position="right" :model="addForm" label-width="82px">
          <el-form-item label="消息标题:" prop="title" style="width: 754px;">
            <el-input v-model="addForm.title" filterable placeholder="请输入标题，文字限制20字" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="消息内容:" prop="content" style="width: 754px;">
            <el-input
              maxlength="200"
              type="textarea"
              :rows="5"
              placeholder="请对事发情况进行描述，文字限制200字"
              v-model="addForm.content">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="add_footer">
        <el-button :loading="loadingBtn" class="select_btn btn_100" @click="addMsgNote('addForm')">发布</el-button>
        <el-button @click.native="skip(1)" class="reset_btn btn_100">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {addMsgNote} from '@/views/index/api/api.message.js';
export default {
  data () {
    return {
      addForm: {
        title: null,
        content: null,
      },
      addRules: {
        title: [
          {required: true, message: '请输入消息标题', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入消息内容', trigger: 'blur'}
        ]
      },
      loadingBtn: false,
    }
  },
  mounted () {
   
  },
  methods: {
    skip (pageType) {
      this.$emit('changePage', pageType)
    },
    // 新增系统消息
    addMsgNote (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('通过验证')
          const data = {
            messageType: 1,
            title: this.addForm.title,
            details: this.addForm.content
          }
          this.loadingBtn = true;
          addMsgNote(data).then(res => {
            if (res && res.data) {
              this.$message.success('发布成功');
              this.$emit('getMsgNoteList');
            }
          }).finally(() => {
            this.loadingBtn = false;
          })
        } else {
          return false;
        }
      });
    },
  }
}
</script>
<style lang="scss" scoped>
.mes_system_add{
  width: 100%;
  position: relative;
  .system_add_box{
    margin: 0 20px 20px 20px;
    padding: 20px 40px;
    min-height:680px;
    background:rgba(255,255,255,1);
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
  }
}
</style>
