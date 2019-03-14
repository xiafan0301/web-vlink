<template>
  <div class="vl_se_hi">
    <div class="se_hi_main">
      <h2>检索历史</h2>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column prop="type" label="操作类型" min-width="180" align="center">
        </el-table-column>
        <el-table-column prop="oper" label="操作人员" min-width="180">
        </el-table-column>
        <el-table-column prop="dept" label="所属部门" min-width="180">
        </el-table-column>
        <el-table-column prop="time" label="操作时间" min-width="180">
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="seeRow(scope.row)"
              type="text"
              size="small">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="se_hi_pa"
        background
        layout="prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 1000
      }
    }
  },
  mounted () {
    let testData = [];
    for (let i = 0; i < 10; i++) {
      testData.push({
        type: i % 2 === 0 ? '抓拍检索' : '人像检索',
        oper: '管理员——' + i,
        dept: '管理部',
        time: '2019-01-07 12:12:12'
      });
    }
    this.tableData = testData;
  },
  methods: {
    seeRow (row) {
      console.log('row', row);
      let _router = 'search_capture';
      if (row.type === '人像检索') {
        _router = 'search_portrait';
      }
      this.$router.push({name: _router});
    },
    handleSizeChange (val) {
        console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
    }
  }
}
</script>
<style lang="scss" scoped>
  .vl_se_hi {
    padding: 20px;
    width: 100%; height: 100%;
    > .se_hi_main {
      width: 100%; height: 100%;
      box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
      background-color: #fff;
      > h2 {
        font-weight: bold;
        font-size: 16px;
        color: #333;
        padding: 30px 0 30px 30px;
      }
      .se_hi_pa {
        text-align: center;
      }
    }
  }
</style>
