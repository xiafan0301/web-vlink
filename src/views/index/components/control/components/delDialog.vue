<template>
  <div class="del_manage_dialog">
    <el-dialog
      :visible.sync="delManageDialog"
      :close-on-click-modal="false"
      width="482px"
      top="40vh">
      <h4>是否确定删除本次布控任务？</h4>
      <p>删除后该组将找不到。</p>
      <div slot="footer">
        <el-button @click="delManageDialog = false">取消</el-button>
        <el-button :loading="loadingBtn" type="primary" @click="delManageDialog = false">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      delManageDialog: false,
      loadingBtn: false, // 加载状态
    }
  },
  methods: {
    reset () {
      this.delManageDialog = true;
    }
  }
}
</script>
<style lang="scss">
.del_manage_dialog{
  h3{
    font-size: 16px;
    color: #333333;
  }
  p{
    line-height: 30px;
    color: #999999;
  }
}
</style>


