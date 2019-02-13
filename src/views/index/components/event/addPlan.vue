<template>
  <vue-scroll>
    <div class="add-plan">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/ctcplan' }">调度预案</el-breadcrumb-item>
          <el-breadcrumb-item>新增预案</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <el-form :model="addPlanForm" ref="addPlanForm" class="add-plan-form" size="small">
          <el-form-item label="预案名称:" prop="planName" label-width="120px">
            <el-input v-model="addPlanForm.planName" placeholder="请输入预案名称" style="width: 40%;"></el-input>
          </el-form-item>
          <el-form-item label="预案类型:" label-width="120px">
          <el-select v-model="addPlanForm.planType" placeholder="请选择预案类型" style="width: 40%;">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="适用事件等级:" label-width="120px">
            <el-select v-model="addPlanForm.eventLevel" placeholder="请选择适用事件等级" style="width: 40%;">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预案正文:" label-width="120px">
            <el-input type="textarea" rows="7" style="width: 40%;" v-model="addPlanForm.planContent" placeholder="请输入预案正文"></el-input>
          </el-form-item>
          <el-form-item label="附件：" label-width="120px">
            <el-upload
              style="width: 40%;"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button size="small" icon="el-icon-upload2">上传文件</el-button>
              <div slot="tip" class="el-upload__tip plan-upload-tip">（支持：PDF、word、txt文档）</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="响应处置:" label-width="120px">
            <el-input type="textarea" rows="7" style="width: 40%;" v-model="addPlanForm.planContent" placeholder="请输入预案正文"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="operation-footer">
        <el-button class="operation_btn function_btn">保存</el-button>
        <el-button class="operation_btn back_btn">返回</el-button>
      </div>
    </div>
  </vue-scroll>
</template>
<script>
export default {
  data () {
    return {
      addPlanForm: {
        planName: null, // 预案名称
        planType: null, // 预案类型
        eventLevel: null, // 事件等级
        planContent: null, // 预案正文
      },
      fileList: []
    }
  },
  methods: {
    handlePreview () {},
    handleRemove () {},
    beforeRemove () {},
    handleExceed () {}
  }
}
</script>
<style lang="scss" scoped>
.add-plan {
  width: 100%;
  .content-box {
    width: 98%;
    margin: 10px 20px 0 20px;
    background: #ffffff;
    .add-plan-form {
      width: 100%;
      padding: 20px 0;
      /deep/ .el-form-item__label {
        color: #666666;
      }
      .plan-upload-tip {
        color: #999999;
      }
      /deep/ .el-upload-list {
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


