<template>
  <vue-scroll>
    <div class="stat-box">
      <div class="search-box">
         <el-date-picker
          style="width: 250px;"
          v-model="dateTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button class="operation_btn">查询</el-button>
      </div>
      div.
    </div>
  </vue-scroll>
</template>
<script>
export default {
  data () {
    return {
      dateTime: null,
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.stat-box {
  width: 98%;
  margin: 15px 20px;
  .search-box {
    padding: 10px;
    width: 100%;
    background-color: #ffffff;
    .operation_btn {
      padding: 0;
      width: 100px;
      height: 40px;
      text-align: center;
      background: #0C70F8;
      color: #ffffff;
      margin-left: 10px;
    }
  }
}
</style>