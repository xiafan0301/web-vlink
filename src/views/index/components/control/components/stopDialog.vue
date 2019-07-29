  <template>
  <div class="stop_manage_dialog">
    <el-dialog
      :visible.sync="stopManageDialog"
      :close-on-click-modal="false"
      width="482px"
      title="终止布控"
      top="40vh">
      <el-form :model="stopForm" ref="stopForm" :rules="ruleStopForm">
        <el-form-item prop="stopReason">
          <el-input
            placeholder="请补充提前结束布控的原因"
            maxlength="140"
            type="textarea"
            :rows="4"
            v-model="stopForm.stopReason">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="controlStop('stopForm')" class="btn_140" type="primary">确定终止</el-button>
        <el-button :loading="loadingBtn" class="btn_140" @click="skipIsList">暂不终止</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {controlStop} from '@/views/index/api/api.control.js';
export default {
  props: ['controlId'],
  data () {
    return {
      stopManageDialog: false,
      stopForm: {
        stopReason: null, // 终止原因
      },
      ruleStopForm: {
        stopReason: [{required: true, message: '请输入终止原因', trigger: 'blur'}]
      },
      loadingBtn: false, // 加载状态
    }
  },
  methods: {
    reset () {
      this.stopForm.stopReason = null;
      this.stopManageDialog = true;
    },
    // 终止布控
    controlStop (formName) {
      const data = {
        terminationReason: this.stopForm.stopReason,
        uid: this.controlId
      }
      this.$refs[formName].validate((vali) => {
        if (vali) {
          controlStop(data).then((res) => {
            if (res) {
              this.stopManageDialog = false;
              this.$message.success('终止成功');
              this.$emit('getControlList');
            }
          })
        } else {
          return false;
        }
      })
    },
    skipIsList () {
      this.stopManageDialog = false;
      this.$emit('getControlList');
    }
  }
}
</script>
<style lang="scss" scoped>

</style>


