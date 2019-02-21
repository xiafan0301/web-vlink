<template>
  <div>
    <div class="mes_help" v-if="pageType === 1">
      <div class="help_box">
        <div class="help_form">
          <el-form ref="helpForm" :model="helpForm" class="help_form">
            <el-form-item prop="helpDate">
              <el-date-picker
                style="width: 260px;"
                v-model="helpForm.helpDate"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item style="width: 260px;" prop="content">
              <el-input v-model="helpForm.content" placeholder="请输入预案名称筛选查找"></el-input>
            </el-form-item>
            <el-form-item prop="helpState">
              <el-select value-key="uid" v-model="helpForm.helpState" filterable placeholder="请选择">
                <el-option
                  v-for="item in helpStateList"
                  :key="item.uid"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 25%;">
              <el-button type="primary">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="help_content">
          <el-button type="primary" icon="el-icon-plus" @click.native="skip(2)">新增民众互助</el-button>
            <div class="table_box">
            <el-table
              :data="helpList"
              >
              <el-table-column
                type="index"
                label="序号"
                width="80"
                :index="indexMethod">
              </el-table-column>
              <el-table-column
                label="事件情况"
                prop="eventType"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="事件地点"
                prop="reportUser"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="发布者"
                prop="idCard"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="APP是否推送"
                prop="reportTime"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="发布时间"
                prop="eventAddress"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                  <span class="operation_btn" @click="skip(3)">查看</span>
                  <span class="operation_wire">|</span>
                  <span class="operation_btn" @click="skip(4)">修改</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, prev, pager, next, jumper"
            :total="400">
          </el-pagination>
        </div>
      </div>
    </div>
    <div is="helpAdd" v-if="pageType === 2 || pageType === 4" :pageType="pageType" @changePage="skip"></div>
    <div is="helpDetail" v-if="pageType === 3" @changePage="skip"></div>
  </div>
</template>
<script>
import helpAdd from './helpAdd.vue';
import helpDetail from './helpDetail.vue';
export default {
  components: {helpAdd, helpDetail},
  data () {
    return {
      pageType: 1,//页面类型 1-列表，2-新增，3-详情,4-修改
      // 顶部筛选参数
      helpForm: {
        helpDate: null,
        content: null,
        helpState: null
      },
      helpStateList: [
        {value: '0', label: '未发布'},
        {value: '1', label: '处理中'},
        {value: '2', label: '已结束'}
      ],
      // 表格参数
      helpList: [{name: 'xxx'}],
      // 翻页参数
      pageSize: 10,
      pageNum: 1,
      currentPage: 1
    }
  },
  methods: {
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    handleSizeChange () {

    },
    handleCurrentChange () {

    },
    skip (pageType) {
      this.pageType = pageType;
    },
    resetForm () {
      this.$refs['helpForm'].resetFields();
    }
  }
}
</script>
<style lang="scss" scoped>
.mes_help{
  width: 100%;
  height: 100%;
  padding: 20px;
  .help_box{
    height: 100%;
    width: 100%;
    padding: 20px;
    min-height: 780px;
    background:rgba(255,255,255,1);
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    .help_form{
      width: 100%;
      display: flex;
      .el-form-item{
        padding-right: 40px;
      }
    }
    .table_box{
      padding-top: 10px;
    }
  }
  
}
</style>
