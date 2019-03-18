<template>
  <div>
    <div class="mes_system" v-if="pageType === 1">
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
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="content">
              <el-input v-model="systemForm.titleOrPublisher" placeholder="输入标题或发布者"></el-input>
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
            </el-table>
          </div>
          <el-pagination
            @size-change="handleSizeChange"
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
import {getMsgNoteList} from '@/views/index/api/api.js';
export default {
  components: {systemAdd, systemDetail},
  data () {
    return {
      pageType: 1,//页面类型 1-列表，2-新增，3-详情
      // 顶部筛选参数
      systemForm: {
        systemDate: null,
        titleOrPublisher: null
      },
      // 表格参数
      systemList: [{eventType: 'xxx'}],
      systemId: null,//消息id
      // 翻页参数
      pageSize: 10,
      pageNum: 1,
      currentPage: 1
    }
  },
  mounted () {
    this.getMsgNoteList();
  },
  methods: {
    // 获取系统消息列表
    getMsgNoteList () {
      this.pageType = 1;
      const params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        orderBy: null,
        order: null,
        'where.startDateStr': this.systemForm.systemDate && this.systemForm.systemDate[0],
        'where.endDateStr': this.systemForm.systemDate && this.systemForm.systemDate[1],
        'where.titleOrPublisher': this.systemForm.titleOrPublisher,
      }
      getMsgNoteList(params).then(res => {
        if (res && res.data) {
          this.systemList = res.data;
        }
      })
    },
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    handleSizeChange (size) {
      this.pageSize = size;
      this.getMsgNoteList();
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
