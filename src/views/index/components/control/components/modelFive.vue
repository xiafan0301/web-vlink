<template>
 <el-form ref="modelFive" :model="modelFiveForm" class="model_five">
    <el-form-item label="布防场所:" :rules="{ required: true, message: '请选择布防场所', trigger: 'blur'}" style="margin-bottom: 0;">
      <el-select value-key="uid" v-model="modelFiveForm.site" filterable placeholder="请选择布防场所（可多选）">
        <el-option
          v-for="item in siteList"
          :key="item.uid"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="停留时长:" :rules="{ required: true, message: '请输入停留时长', trigger: 'blur'}" style="margin-bottom: 0;">
      <el-input v-model="modelFiveForm.duration" filterable placeholder="请输入停留时长"></el-input>
    </el-form-item>
    <el-form-item label="布控车辆:" :rules="{ required: true, message: '请选择布控车辆', trigger: 'blur'}" style="margin-bottom: 0;">
      <div>从公务车辆中选择</div>
    </el-form-item>
    <el-form-item style="margin-top: 20px;">
      <el-button type="primary" @click="selControl">一键布控</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data () {
    return {
      modelFiveForm: {
        site: null,
        duration: null
      },
      siteList: []
    }
  },
  methods: {
    // 一键布控
    selControl () {

    }
  }
}
</script>
<style lang="scss" scoped>
.model_five{
  padding: 0 20px;
}
</style>