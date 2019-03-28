<template>
  <div class="vl_se_hi">
    <div class="se_hi_main">
      <h2>检索历史</h2>
      <div class="se_hi_box">
        <vue-scroll>
          <el-table
            :data="tableData"
            stripe
            style="width: 100%;">
            <el-table-column label="操作类型" min-width="180" align="center">
              <template slot-scope="scope">待查字典</template>
            </el-table-column>
            <el-table-column prop="opUserName" label="操作人员" min-width="180">
            </el-table-column>
            <el-table-column prop="opDeptName" label="所属部门" min-width="180">
            </el-table-column>
            <el-table-column prop="createTime" label="操作时间" min-width="180">
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
            v-show="pagination.total > 10"
            class="se_hi_pa"
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page="pagination.currentPage"
            :page-size="pagination.pageSize"
            :total="pagination.total">
          </el-pagination>
        </vue-scroll>
      </div>
    </div>
  </div>
</template>
<script>
import {ScpGETretrievalHisList} from '../../api/api.js';
export default {
  data () {
    return {
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted () {
    this.getHisList();
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
    handleCurrentChange (val) {
      this.pagination.currentPage = val;
      this.getHisList();
    },
    getHisList () {
      this.$_showLoading({
        target: '.se_hi_box'
      })
      let params = {
        'where.userId': 1,
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      ScpGETretrievalHisList(params)
        .then(res => {
          this.$_hideLoading();
          this.tableData = res.data.list;
          this.pagination.pageNum = res.data.pageNum;
          this.pagination.total = res.data.total;
        })
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
        font-size: .16rem;
        color: #333;
        height: .76rem;
        line-height: .76rem;
        text-indent: .4rem;
      }
      .se_hi_box {
        width: 100%;
        height: calc(100% - .76rem);
        /deep/.el-table {
          table {
            td {
              padding: 0!important;
              height: .54rem;
              line-height: .54rem;
            }
            th {
              padding: 0;
              height: .54rem;
              line-height: .54rem;
            }
          }
        }
      }
      .se_hi_pa {
        text-align: center;
      }
    }
  }
</style>
