  <template>
  <div class="stop_manage_dialog">
    <el-dialog
      :visible.sync="stopManageDialog"
      :close-on-click-modal="false"
      width="482px"
      title="终止布控"
      top="40vh">
      <el-input
        placeholder="请补充提前结束布控的原因"
        maxlength="140"
        type="textarea"
        :rows="4"
        v-model="stopReason">
      </el-input>
      <div slot="footer">
        <el-button @click="stopManageDialog = false">确定终止</el-button>
        <el-button :loading="loadingBtn" type="primary" @click="stopManageDialog = false">暂不终止</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      stopManageDialog: false,
      stopReason: null, // 终止原因
      loadingBtn: false, // 加载状态
    }
  },
  methods: {
    reset () {
      this.stopReason = null;
      this.stopManageDialog = true;
    }
  }
}
</script>
<style lang="scss" scoped>

</style>


