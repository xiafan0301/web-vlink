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
        <el-button @click="groupDialog = false" class="btn_140">取消</el-button>
        <el-button v-if="operateType === '1'" :loading="loadingBtn" class="btn_140" type="primary" @click="addGroup('group')">新增</el-button>
        <el-button v-else :loading="loadingBtn" class="btn_140" type="primary" @click="putGroup('group')">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getGroupsById, putGroup} from '@/views/index/api/api.control.js';
import {addGroup} from '@/views/index/api/api.manage.js';
export default {
  props: ['operateType', 'tabType', 'groupId'],
  data () {
    return {
      groupDialog: false,
      group: {groupName: null},
      loadingBtn: false
    }
  },
  watch: {
    operateType (val) {
      if (val === '2') {
        this.getGroupsById();
      }
    }
  },
  mounted () {
    if (this.operateType === '2') {
      this.getGroupsById();
    }
  },
  methods: {
    // 新增分组
    addGroup (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('验证通过');
          const data = {
            groupName: this.group.groupName,
            groupType: this.tabType === '1' ? 6 : 7
          }
          this.loadingBtn = true;
          addGroup(data).then(res => {
            if (res && res.data) {
              this.$message.success('新增成功');
              this.groupDialog = false;
              this.$emit('getGroupList', res.data);
            }
          }).finally(() => {
            this.loadingBtn = false;
          })
        } else {
          return false;
        }
      })
    },
    // 获取分组信息
    getGroupsById () {
      getGroupsById(this.groupId).then(res => {
        if (res && res.data) {
          this.group = res.data;
        }
      })
    },
    // 修改分组名称
    putGroup () {
      const data = this.group;
      this.loadingBtn = true;
      putGroup(data).then((res) => {
        if (res) {
          this.groupDialog = false;
          this.$message.success('修改成功');
          this.$emit('sendChildren', this.group.groupName);
        }
      }).finally(() => {
        this.loadingBtn = false;
      })
    },
    reset () {
      this.groupDialog = true;
      if (this.$refs['group'] && this.operateType === '1') {
        this.$refs['group'].resetFields();
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
