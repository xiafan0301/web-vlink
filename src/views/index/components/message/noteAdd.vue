<template>
  <div class="mes_note_add">
    <!-- 面包屑 -->
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item @click.native="skip(1)">短信通知</el-breadcrumb-item>
        <el-breadcrumb-item>新增短信</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="note_add_box">
      <div class="add_form">
        <el-form :rules="addRules" ref="addForm" label-position="right" :model="addForm" label-width="82px">
          <el-form-item label="收件人:" prop="recipient">
            <!-- <el-input v-model="addForm.recipient" filterable placeholder="请选择接收人"></el-input> -->
            <div class="recipient clearfix">
              <div class="rec_list" v-for="item in '123456'" :key="item.id">
                <span>王益&lt;13324922333&gt;</span>
                <i class="el-icon-close"></i>
              </div>
              <i class="el-icon-circle-plus" @click="recDialog = true"></i>
            </div>
          </el-form-item>
          <el-form-item label="短信模板:" prop="template" class="template">
            <el-select value-key="uid" v-model="addForm.template" filterable placeholder="请选择短信模板">
              <el-option
                v-for="item in templateList"
                :key="item.uid"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主题:" prop="theme" style="width: 754px;">
            <el-input v-model="addForm.theme" filterable placeholder="请输入主题"></el-input>
          </el-form-item>
          <el-form-item label="时间:" prop="time" class="template">
            <el-date-picker
              v-model="addForm.time"
              type="datetime"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="地点:" prop="site" style="width: 754px;">
            <el-input v-model="addForm.site" filterable placeholder="请输入地点"></el-input>
          </el-form-item>
          <el-form-item label="短信内容:" style="width: 754px;" class="content">
            <div class="con_box">
              <el-input
                resize="none"
                type="textarea"
                :rows="4"
                placeholder="请输入短信内容"
                v-model="addForm.content">
              </el-input>
              <ul class="con_list">
                <li>主题：评审会</li>
                <li>时间：2018-07-16 08:46</li>
                <li>地点：大会议室</li>
              </ul>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="add_footer">
        <el-button type="primary">发送</el-button>
        <el-button>返回</el-button>
      </div>
    </div>
    <div class="rec_dialog">
      <el-dialog
        :visible.sync="recDialog"
        :close-on-click-modal="false"
        width="482px"
        top="20vh">
        <h1 class="vl_f_16 vl_f_333" style="margin-bottom: 10px;">选择接收人（已选2人/共1000人）</h1>
        <div class="rec_box">
          <div class="rec_l">
            
          </div>
          <div class="rec-r">

          </div>
        </div>
        <div slot="footer">
          <el-button @click="recDialog = false">取消</el-button>
          <el-button :loading="loadingBtn" type="primary">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      addForm: {
        recipient: null,
        template: null,
        theme: null,
        time: null,
        site: null,
        content: null
      },
      templateList: [],
      addRules: {
        recipient: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        template: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        theme: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        time: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        site: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ]
      },
      // 弹窗参数
      recDialog: false,
      loadingBtn: false,
    }
  },
  mounted () {
   
  },
  methods: {
    skip (pageType) {
      this.$emit('changePage', pageType)
    },
  
  }
}
</script>
<style lang="scss" scoped>
.mes_note_add{
  width: 100%;
  position: relative;
  .note_add_box{
    margin: 0 20px 20px 20px;
    padding: 20px 40px;
    position: relative;
    min-height:820px;
    background:rgba(255,255,255,1);
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    .add_footer{
      width: 100%;
      height: 64px;
      line-height: 64px;
      position: absolute;
      left: -20px;
      bottom: -104px;
      padding-left: 20px;
      background:rgba(255,255,255,1);
      box-shadow:0px -1px 2px 0px rgba(0,0,0,0.03);
      filter:blur(0px);
      > .el-button{
        width: 100px;
      }
    }
  }
  .rec_dialog{
    .rec_box{
      width: 100%;
      border-top: 1px solid #F2F2F2;
    }
  }
}
</style>
<style lang="scss">
.mes_note_add{
  .template .el-input__inner{
    width: 672px;
  }
  .recipient{
    width: 672px;
    padding: 4px 4px 0;
    border: 1px solid #dcdfe6;
    border-radius:4px;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    > i{
      position: absolute;
      right: 10px;
      top: 12px;
      cursor: pointer;
    }
    .rec_list{
      width: 31%;
      height:32px;
      line-height: 30px;
      margin-right: 4px;
      margin-bottom: 4px;
      text-align: center;
      background:rgba(243,243,243,1);
      border-radius:2px;
      border:1px solid rgba(217,217,217,1);
      > i{
        cursor: pointer;
        color: #B2B2B2;
      }
    }
  }
  .content{
    .el-textarea__inner{
      border: none;
    }
    .con_box{
      border: 1px solid #dcdfe6;
      border-radius:4px;
      .con_list{
        width: 226px;
        margin-left: 20px;
        padding: 10px 0;
        border-top: 1px solid #dcdfe6;
        li{
          height: 30px;
          color: #B2B2B2;
        }
      }
    }
  }
} 
</style>
