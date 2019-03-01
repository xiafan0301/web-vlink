<template>
  <!-- 新建/修改自定义组 -->
  <div class="group_dialog">
    <el-dialog
      :visible.sync="groupDialog"
      :close-on-click-modal="false"
      width="482px"
      top="40vh">
      <h4>{{operateType === '1' ? '新增' : '修改'}}组</h4>
      <el-form :model="group" ref="group">
        <el-form-item prop="groupName" :rules="{ required: true, message: '请输入组名', trigger: 'blur'}">
          <el-input v-model="group.groupName" placeholder="请输入组名称，最多6字，不可重复" maxlength="6" style="padding-top: 20px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="groupDialog = false">取消</el-button>
        <el-button :loading="loadingBtn" type="primary" @click="operateGroup('group')">{{operateType === '1' ? '新增' : '确认'}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ['operateType'],
  data () {
    return {
      groupDialog: false,
      group: {groupName: null},
      loadingBtn: false
    }
  },
  methods: {
    // 新增/修改组
    operateGroup (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('验证通过');
        } else {
          return false;
        }
      })
    },
    reset () {
      this.groupDialog = true;
      if (this.$refs['group']) {
        this.$refs['group'].resetFields();
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
