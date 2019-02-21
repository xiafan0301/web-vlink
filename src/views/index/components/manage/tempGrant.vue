<template>
  <div class="temp_grant">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manage/videoSetting'}">视频设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/deviceAuthorize'}">设备授权</el-breadcrumb-item>
        <el-breadcrumb-item>临时授权</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_box">
      <el-alert class="alert_tip" show-icon :closable="false" title="授权对象必须为本系统的用户，否则无法临时授权！"></el-alert>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn function_btn">保存</el-button>
      <el-button class="operation_btn back_btn">取消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
.temp_grant {
  height: 100%;
  .content_box {
    width: 98%;
    margin: 0 20px;
    padding: 15px;
    height: calc(100% - 145px);
    background-color: #ffffff;
    .alert_tip {
      color: #333333;
      background:rgba(230,247,255,1);
      border-radius:4px;
      border:1px solid rgba(186,231,255,1);
      /deep/ .el-icon-info:before {
        color: #0C70F8;
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


