<template>
  <div class="wrt_main">
    <h1 style="text-align: center;font-size: 40px;color: #0C70F8;">冉毅测试下载PDF</h1>
    <el-table
            :data="testList"
            style="width: 100%">
      <el-table-column
              prop="constructTime"
              label="日期"
              width="180">
      </el-table-column>
      <el-table-column
              prop="deviceName"
              label="姓名"
              width="180">
      </el-table-column>
      <el-table-column
              prop="address"
              label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {getAllDevice} from '../api/api.judge'
export default {
  data () {
    return {
      testList: [],
      oAdd: {},
      oDel: {},
      form: {
        val1: '',
        val2: ''
      },
      aData: [{}, {}, {}]
    }
  },
  mounted () {
    getAllDevice().then(res => {
      if (res) {
        this.testList = res.data;
      }
    })
  },
  methods: {
    add () {
      this.oAdd = {
        type: 1,
        remoteId: this.form.val1,
        remoteName: this.form.val1
      };
    },
    del () {
      this.oDel = {
        type: 1,
        remoteId: this.form.val2,
        remoteName: this.form.val2
      };
    },

    wrStateEmit (oData) {
      console.log('状态EMIT oData: ', oData);
    }
  }
}
</script>
<style lang="scss" scoped>
.wrt_main {
  position: relative;
  width: 100%; height: 100%;
}
</style>
