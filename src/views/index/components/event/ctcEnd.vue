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
          <el-form-item label="关闭事件:">
            <el-radio-group v-model="endForm.isCloseEvent" @change="handleEventChange">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="isEventLevel">
            <el-form-item label="事件等级:" prop="eventLevel">
              <el-select v-model="endForm.eventLevel" style="width: 100%;">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="总结内容:" prop="content">
            <el-input :placeholder="[!isEventLevel ? '请输入调度指挥总结' : '请输入事件总结']" v-model="endForm.content" type="textarea" rows="7"></el-input>
          </el-form-item>
        </el-form>
        <div class="end-upload">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleChange"
            :file-list="fileList"
          >
            <el-button size="small" class="upload-btn" icon="el-icon-upload2">上传文件</el-button>
            <div slot="tip" class="el-upload__tip end-upload-tip">（支持扩展名：.rar .zip .doc .docx .pdf .jpg…）</div>
          </el-upload>
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
export default {
  data () {
    return {
      isEventLevel: false, // 是否显示事件等级
      endForm: {
        isCloseEvent: false,
        eventLevel: null,
        content: null
      },
      rules: {
        eventLevel: [
          { required: true, message: '请选择事件等级', trigger: 'blur' }
        ],
        content: [
          { max: 1000, message: '最多输入1000字' }
        ]
      },
      fileList: []
    }
  },
  methods: {
    // 关闭事件change
    handleEventChange (val) {
      console.log(val)
      if (val) {
        this.isEventLevel = true;
      } else {
        this.isEventLevel = false;
      }
    },
    handleChange () {},
    // 结束调度
    submitData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
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
        width: 40%;
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


