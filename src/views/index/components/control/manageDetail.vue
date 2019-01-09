<template>
  <div class="control_manage_d">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>布控</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'control_manage' }">布控管理</el-breadcrumb-item>
        <el-breadcrumb-item>布控详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="manage_d_box">
      <div>fdssssssssssssss</div>
    </div>
    <div class="manage_f_box">
      <el-button type="primary">编辑</el-button>
      <el-button>删除</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.control_manage_d{
  width: 100%;
  position: relative;
  .manage_d_box{
    width: calc(100% - 40px);
    min-height: 783px;
    margin-left: 20px;
    padding: 20px;
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    background: #fff;
    border-radius:4px;
  }
  .manage_f_box{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height:60px;
    line-height: 60px;
    padding: 0 20px;
    background:rgba(255,255,255,1);
    box-shadow:0px -1px 2px 0px rgba(0,0,0,0.03);
    filter:blur(0px);
    .el-button{
      width: 100px;
      height: 40px;
    }
  }
}
</style>