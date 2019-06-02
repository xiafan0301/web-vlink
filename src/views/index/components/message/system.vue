<template>
  <div>
    <div class="mes_system" v-show="pageType === 1">
      <div class="system_box">
        <div class="system_form">
          <el-form ref="systemForm" :model="systemForm" class="system_form">
            <el-form-item prop="systemDate">
              <el-date-picker
                style="width: 260px;"
                v-model="systemForm.systemDate"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="titleOrPublisher">
              <el-input v-model="systemForm.titleOrPublisher" placeholder="输入标题或发布者"></el-input>
            </el-form-item>
            <el-form-item prop="department">
              <el-select value-key="uid" v-model="systemForm.department" filterable placeholder="请选择发布部门">
                <el-option
                  v-for="item in departmentList"
                  :key="item.uid"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 25%;">
              <el-button type="primary" @click="getMsgNoteList">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="help_content">
          <el-button type="primary" icon="el-icon-plus" @click.native="skip(2)">新增系统消息</el-button>
          <div class="table_box">
            <el-table
              v-loading="loading"
              :data="systemList.list"
              >  
              <el-table-column
                type="index"
                label="序号"
                width="80"
                :index="indexMethod">
              </el-table-column>
              <el-table-column
                label="消息标题"
                prop="title"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="内容预览"
                prop="details"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="发布部门"
                prop="publishUnitName"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="发布者"
                prop="publishUserName"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="发布时间"
                prop="publishTime"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column label="操作" width="140">
                <template slot-scope="scope">
                  <span class="operation_btn" @click="skip(3, scope.row.uid)">查看</span>
                </template>
              </el-table-column>
              <div class="not_content" slot="empty">
                <img src="../../../../assets/img/not-content.png" alt="">
                <p>暂无相关数据</p>
              </div>
            </el-table>
          </div>
          <el-pagination
            class="cum_pagination"
            v-if="systemList && systemList.list && systemList.list.length > 0"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="systemList.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="systemList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div is="systemAdd" v-if="pageType === 2" @changePage="skip" @getMsgNoteList="getMsgNoteList"></div>
    <div is="systemDetail" v-if="pageType === 3" @changePage="skip" :systemId="systemId"></div>
  </div>
</template>
<script>
import systemAdd from './systemAdd.vue';
import systemDetail from './systemDetail.vue';
import {getMsgNoteList} from '@/views/index/api/api.message.js';
export default {
  components: {systemAdd, systemDetail},
  data () {
    return {
      pageType: 1,//页面类型 1-列表，2-新增，3-详情
      // 顶部筛选参数
      systemForm: {
        systemDate: null,
        department: null,
        titleOrPublisher: null
      },
      lastSystemForm: {
        systemDate: null,
        department: null,
        titleOrPublisher: null
      },
      // 表格参数
      departmentList: [],
      systemList: [],
      systemId: null,//消息id
      // 翻页参数
      pageSize: 10,
      pageNum: 1,
      currentPage: 1,
      loading: false
    }
  },
  mounted () {
    this.getMsgNoteList();
  },
  methods: {
    // 获取系统消息列表
    getMsgNoteList () {
      this.pageType = 1;
      // 筛选参数有变化时，当前置为第一页
      const arr = Object.values(this.systemForm);
      const lastArr = Object.values(this.lastSystemForm);
      let isReset = false;
      for (let i = 0; i < arr.length ; i++) {
        if (arr[i] !== lastArr[i]) {
          isReset = true;
          break;
        }
      }
      if (isReset) {
        this.pageNum = 1;
        this.currentPage = 1;
      }
      this.lastSystemForm = Object.assign({}, this.systemForm);
      const params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        orderBy: null,
        order: null,
        'where.messageType': 1,
        'where.startDateStr': this.systemForm.systemDate && this.systemForm.systemDate[0],
        'where.endDateStr': this.systemForm.systemDate && this.systemForm.systemDate[1],
        'where.titleOrPublisher': this.systemForm.titleOrPublisher,
      }
      this.loading = true;
      getMsgNoteList(params).then(res => {
        if (res && res.data) {
          this.systemList = res.data;
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
      this.getMsgNoteList();
    },
    skip (pageType, uid) {
      this.pageType = pageType;
      this.systemId = uid;
    },
    resetForm () {
      this.$refs['systemForm'].resetFields();
      this.getMsgNoteList();
    }
  }
}
</script>
<style lang="scss" scoped>
.mes_system{
  width: 100%;
  height: 100%;
  padding: 20px;
  .system_box{
    height: 100%;
    width: 100%;
    padding: 20px;
    min-height: 780px;
    background:rgba(255,255,255,1);
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    .system_form{
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
