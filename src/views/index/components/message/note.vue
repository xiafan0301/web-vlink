<template>
  <div>
    <div class="mes_note" v-show="pageType === 1">
      <div class="note_box">
        <div class="note_form">
          <el-form ref="noteForm" :model="noteForm" class="note_form">
            <el-form-item prop="noteDate">
              <el-date-picker
                style="width: 260px;"
                v-model="noteForm.noteDate"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="content">
              <el-input v-model="noteForm.content" placeholder="请输入发送对象或者发送内容筛选查找"></el-input>
            </el-form-item>
            <el-form-item prop="noteState">
              <el-select value-key="value" v-model="noteForm.noteState" filterable placeholder="请选择短信模板查找">
                <el-option
                  v-for="item in noteStateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 25%;">
              <el-button type="primary" @click="getSmsList">查询</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="help_content">
          <el-button type="primary" icon="el-icon-plus" @click.native="skip(2)">新增短信</el-button>
            <div class="table_box">
            <el-table
              v-loading="loading"
              :data="noteList.list"
              >
              <el-table-column
                label="发布时间"
                prop="createTime"
                show-overflow-tooltip
                >
                <!-- <template slot-scope="scope">
                  {{scope.row.createTime | fmTimestamp('yyyy-MM-dd HH:mm')}}
                </template> -->
              </el-table-column>
              <el-table-column
                label="短信类型"
                prop="title"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="短信内容"
                prop="msgContent"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="送达状态"
                prop="reportTime"
                show-overflow-tooltip
                >
                <template slot-scope="scope">
                  {{scope.row.sendSuccCount}}/{{scope.row.sendTotal}}
                </template>
              </el-table-column>
              <div class="not_content" slot="empty">
                <img src="../../../../assets/img/not-content.png" alt="">
                <p>暂无相关数据</p>
              </div>
            </el-table>
          </div>
          <el-pagination
            v-if="noteList && noteList.list && noteList.list.length > 0"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="noteList.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="noteList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div is="noteAdd" v-if="pageType === 2" @changePage="skip" @getSmsList="getSmsList"></div>
  </div>
</template>
<script>
import noteAdd from './noteAdd.vue';
import {getSmsList, getSmsTemplate} from '@/views/index/api/api.message.js';
export default {
  components: {noteAdd},
  data () {
    return {
      pageType: 1,//页面类型 1-列表，2-新增
      // 顶部筛选参数
      noteForm: {
        noteDate: null,
        content: null,
        noteState: null
      },
      lastNoteForm: {
        noteDate: null,
        content: null,
        noteState: null
      },
      noteStateList: [],
      // 表格参数
      noteList: [{eventType: 'xxx'}],
      // 翻页参数
      pageSize: 10,
      pageNum: 1,
      currentPage: 1,
      loading: false,
    }
  },
  mounted () {
    this.getSmsTemplate();
    this.getSmsList();
  },
  methods: {
    // 获取短信列表
    getSmsList () {
      this.pageType = 1;
      // 筛选参数有变化时，当前置为第一页
      const arr = Object.values(this.noteForm);
      const lastArr = Object.values(this.lastNoteForm);
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
      this.lastNoteForm = Object.assign({}, this.noteForm);
      const params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        orderBy: null,
        order: null,
        'where.tempType': 1,
        'where.startTime': this.noteForm.noteDate && this.noteForm.noteDate[0],
        'where.endTime': this.noteForm.noteDate && this.noteForm.noteDate[1],
        'where.keyWord': this.noteForm.content,
        'where.tempId': this.noteForm.noteState && this.noteForm.noteState.value,
      }
      this.loading = true;
      getSmsList(params).then(res => {
        if (res && res.data) {
          this.noteList = res.data;
        }
      }).finally(() => {
        this.loading = false;
      })
    },
    // 获取短信模板
    getSmsTemplate () {
      const params = {
        'where.tempType': 1
      }
      getSmsTemplate(params).then(res => {
        if (res && res.data) {
          this.noteStateList = res.data.map(m => {
            return {
              label: m.title,
              value: m.tempId,
              tempContent: m.tempContent
            }
          });

        }
      })
    },
    handleCurrentChange (page) {
      this.pageNum = page;
      this.currentPage = page;
      this.getSmsList();
    },
    skip (pageType) {
      this.pageType = pageType;
    },
    resetForm () {
      this.$refs['noteForm'].resetFields();
      this.getSmsList();
    }
  }
}
</script>
<style lang="scss" scoped>
.mes_note{
  width: 100%;
  height: 100%;
  padding: 20px;
  .note_box{
    height: 100%;
    width: 100%;
    padding: 20px;
    min-height: 780px;
    background:rgba(255,255,255,1);
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    .note_form{
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
