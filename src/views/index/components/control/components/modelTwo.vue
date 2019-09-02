<template>
  <el-form ref="modelTwo" :model="modelTwoForm" class="model_two">
    <el-form-item label="布防地址:">
      <el-input v-model="modelTwoForm.address" placeholder="请输入地名的关键字"></el-input>
    </el-form-item>
    <el-form-item label="布防范围:">
      <el-select value-key="uid" v-model="modelTwoForm.scope" filterable placeholder="请选择">
        <el-option
          v-for="item in scopeList"
          :key="item.uid"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <div><span>禁入人员</span><span>从布控库中选择</span></div>
    <div><span>禁入车辆</span><span>从布控库中选择</span></div>
    <el-form-item style="margin-top: 20px;">
      <el-button type="primary" @click="selControl">一键布控</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data () {
    return {
      modelTwoForm: {
        address: null,
        scope: null,
      },
      scopeList: []
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
.model_two{
  padding: 0 20px;
}
</style>