<template>
  <div class="del_manage_dialog">
    <el-dialog
      :visible.sync="delManageDialog"
      :close-on-click-modal="false"
      width="482px"
      top="40vh">
      <h4>是否确定删除本次布控任务？</h4>
      <div slot="footer">
        <el-button @click="delManageDialog = false" class="reset_btn btn_140">取消</el-button>
        <el-button :loading="loadingBtn" class="select_btn btn_140" @click="delControl">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {delControl} from '@/views/index/api/api.control.js';
export default {
  props: ['controlId'],
  data () {
    return {
      delManageDialog: false,
      loadingBtn: false, // 加载状态
    }
  },
  methods: {
    reset () {
      this.delManageDialog = true;
    },
    // 删除布控
    delControl () {
      delControl(this.controlId).then((res) => {
        if (res) {
          this.delManageDialog = false;
          this.$message.success('删除成功');
          this.$emit('getControlList');
        }
      })
    }
  }
}
</script>
<style lang="scss">
.del_manage_dialog{
  h4{
    font-size: 16px;
    color: #333333;
  }
  p{
    line-height: 30px;
    color: #999999;
  }
}
</style>


