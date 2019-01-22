<template>
  <div>
    <div class="mes_note" v-if="pageType === 1">
      <div class="note_box">
        <div class="note_form">
          <el-form ref="noteForm" :model="noteForm" class="note_form">
            <el-form-item>
              <el-date-picker
                style="width: 240px;"
                v-model="noteForm.noteDate"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-input v-model="noteForm.content" placeholder="请输入预案名称筛选查找"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select value-key="uid" v-model="noteForm.noteState" filterable placeholder="请选择">
                <el-option
                  v-for="item in noteStateList"
                  :key="item.uid"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="width: 25%;">
              <el-button type="primary">查询</el-button>
              <el-button>重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="help_content">
          <el-button type="primary" icon="el-icon-plus" @click.native="skip(2)">新增短信</el-button>
            <div class="table_box">
            <el-table
              :data="noteList"
              >
              <el-table-column
                label="发布时间"
                prop="eventType"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="短信类型"
                prop="reportUser"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="短信内容"
                prop="idCard"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="送达状态"
                prop="reportTime"
                show-overflow-tooltip
                >
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
    <div is="noteAdd" v-if="pageType === 2" @changePage="skip"></div>
  </div>
</template>
<script>
import noteAdd from './noteAdd.vue';
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
      noteStateList: [
        {value: '0', label: '事件调度'},
        {value: '1', label: '普通通知'}
      ],
      // 表格参数
      noteList: [{eventType: 'xxx'}],
      // 翻页参数
      pageSize: 10,
      pageNum: 1,
      currentPage: 1
    }
  },
  methods: {
    handleSizeChange () {

    },
    handleCurrentChange () {

    },
    skip (pageType) {
      this.pageType = pageType;
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
