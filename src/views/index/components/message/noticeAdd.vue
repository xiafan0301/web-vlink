<template>
  <div class="mes_notice_add">
    <!-- 面包屑 -->
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item @click.native="skip(1)" class="mes_back">公共管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增公告</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="notice_add_box">
      <div class="add_form">
        <el-form :rules="addRules" ref="addForm" label-position="right" :model="addForm" label-width="82px">
          <el-form-item label="消息标题:" prop="title" style="width: 754px;">
            <el-input v-model="addForm.title" filterable placeholder="请输入标题，文字限制20字"></el-input>
          </el-form-item>
          <el-form-item label="消息内容:" prop="content" style="width: 754px;">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请对事发情况进行描述，文字限制140字"
              v-model="addForm.content">
            </el-input>
          </el-form-item>
          <el-form-item style="width: 736px;">
            <div is="uploadPic" @uploadPicSubmit="uploadPicSubmit" :maxSize="9"></div>
            <p class="vl_f_999">(最多传9张 支持JPEG、JPG、PNG、文件，大小不超过2M)</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="add_footer">
        <el-button type="primary">发布</el-button>
        <el-button>保存</el-button>
        <el-button>返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import uploadPic from '../control/uploadPic';
export default {
  components: {uploadPic},
  data () {
    return {
      addForm: {
        title: null,
        content: null,
      },
      addRules: {
        title: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ]
      },
    }
  },
  mounted () {
   
  },
  methods: {
    skip (pageType) {
      this.$emit('changePage', pageType)
    },
    // 接收 到上传组件传过来的图片数据
    uploadPicSubmit () {
      
    },
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
