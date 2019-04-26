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
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
            <el-form-item style="width: 260px;" prop="content">
              <el-input v-model="helpForm.content" placeholder="输入情况或发布者或地点"></el-input>
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
              <el-button type="primary" @click="getMutualHelpList">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="help_content">
          <el-button type="primary" icon="el-icon-plus" @click.native="skip(2)">新增民众互助</el-button>
            <div class="table_box">
            <el-table
              v-loading="loading"
              :data="helpList.list"
              >
              <el-table-column
                type="index"
                label="序号"
                width="80"
                :index="indexMethod">
              </el-table-column>
              <el-table-column
                label="事件情况"
                prop="eventDetail"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="事件地点"
                prop="eventAddress"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="发布者"
                prop="reporterUserName"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="APP是否推送"
                prop="radius"
                show-overflow-tooltip
                >
                <template slot-scope="scope">
                  {{scope.row.radius === -1 ? '不推送' : scope.row.radius === 0 ? '全部推送' : scope.row.radius > 0 ? (scope.row.radius + '公里以内') : ''}}
                </template>
              </el-table-column>
              <el-table-column  
                label="事发时间"
                prop="reportTime"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                  <span class="operation_btn" @click="skip(3, scope.row.uid)">查看</span>
                  <span class="operation_wire">|</span>
                  <span class="operation_btn" @click="skip(4, scope.row.uid)">修改</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="helpList.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="helpList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div is="helpAdd" v-if="pageType === 2 || pageType === 4" :helpId="helpId" :pageType="pageType" @changePage="skip" @getMutualHelpList="getMutualHelpList"></div>
    <div is="helpDetail" v-if="pageType === 3" :helpId="helpId" @changePage="skip"></div>
  </div>
</template>
<script>
import helpAdd from './helpAdd.vue';
import helpDetail from './helpDetail.vue';  
import {getMutualHelpList} from '@/views/index/api/api.message.js';
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
        {value: -1, label: '不推送'},
        {value: 0, label: '全部推送'},
        {value: 10, label: '10公里以内的'},
        {value: 20, label: '20公里以内的'},
        {value: 30, label: '30公里以内的'},
        {value: 40, label: '40公里以内的'}
      ],
      // 表格参数
      helpList: [{name: 'xxx'}],
      // 翻页参数
      pageSize: 10,
      pageNum: 1,
      currentPage: 1,
      loading: false
    }
  },
  mounted () {
    this.getMutualHelpList();
  },
  methods: {
    // 获取民众互助列表
    getMutualHelpList () {
      this.pageType = 1;
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderBy: 'report_time',
        order: 'desc',
        'where.startDateStr': this.helpForm.helpDate && this.helpForm.helpDate[0],
        'where.endDateStr': this.helpForm.helpDate && this.helpForm.helpDate[1],
        'where.keyWord': this.helpForm.content,
        'where.radius': this.helpForm.helpState
      }
      this.loading = true;
      getMutualHelpList(params).then(res => {
        if (res && res.data) {
          this.helpList = res.data;
        }
      }).finally(() => {
        this.loading = false;
      })
    },
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    handleCurrentChange (page) {
      this.pageNum = page;
      this.currentPage = page;
      this.getMutualHelpList();
    },
    skip (pageType, uid) {
      this.pageType = pageType;
      this.helpId = uid;
    },
    resetForm () {
      this.$refs['helpForm'].resetFields();
      this.getMutualHelpList();
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
