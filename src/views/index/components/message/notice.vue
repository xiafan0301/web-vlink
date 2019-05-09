<template>
  <div>
    <div class="mes_notice" v-show="pageType === 1">
      <div class="notice_box">
        <div class="notice_form">
          <el-form ref="noticeForm" :model="noticeForm" class="notice_form">
            <el-form-item prop="noticeDate">
              <el-date-picker
                style="width: 260px;"
                v-model="noticeForm.noticeDate"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="titleOrPublisher">
              <el-input v-model="noticeForm.titleOrPublisher" placeholder="请输入标题或者发布者"></el-input>
            </el-form-item>
            <el-form-item prop="noticeState">
              <el-select value-key="uid" v-model="noticeForm.noticeState" filterable placeholder="请选择">
                <el-option
                  v-for="item in noticeStateList"
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
        <div class="notice_content">
          <el-button type="primary" icon="el-icon-plus" @click.native="skip(2)">新增公告消息</el-button>
            <div class="table_box">
            <el-table
              v-loading="loading"
              :data="noticeList.list"
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
                label="置顶状态"
                prop="reportTime"
                show-overflow-tooltip
                >
                <template slot-scope="scope">
                  {{scope.row.isTop ? '已置顶' : '未置顶' }}
                </template>
              </el-table-column>
              <el-table-column
                label="发布时间"
                prop="publishTime"
                show-overflow-tooltip
                >
                <template slot-scope="scope">
                  {{scope.row.publishTime | fmTimestamp('yyyy-MM-dd HH:mm')}}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                  <span class="operation_btn" @click="skip(3, scope.row.uid)">查看</span>
                  <template v-if="scope.row.publishState !== 2 && scope.row.messageType !== 1">
                    <span class="operation_wire">|</span>
                    <span class="operation_btn" @click="skip(4, scope.row.uid)">修改</span>
                  </template>
                  <template v-if="scope.row.publishState === 2">
                    <span class="operation_wire">|</span>
                    <span class="operation_btn" @click="putMsgNote(scope.row.uid, scope.row.isTop)">{{scope.row.isTop ? '取消置顶' : '置顶'}}</span>
                  </template>
                </template>
              </el-table-column>
              <div class="not_content" slot="empty">
                <img src="../../../../assets/img/not-content.png" alt="">
                <p>暂无相关数据</p>
              </div>
            </el-table>
          </div>
          <el-pagination
            v-if="noticeList && noticeList.list && noticeList.list.length > 0"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="noticeList.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="noticeList.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div is="noticeAdd" v-if="pageType === 2 || pageType === 4" :msgNoteId="msgNoteId" :pageType="pageType" @getMsgNoteList="getMsgNoteList" @changePage="skip"></div>
    <div is="noticeDetail" v-if="pageType === 3" @changePage="skip" :msgNoteId="msgNoteId"></div>
  </div>
</template>
<script>
import noticeAdd from './noticeAdd.vue';
import noticeDetail from './noticeDetail.vue';
import {getMsgNoteList, putMsgNote} from '@/views/index/api/api.message.js';
export default {
  components: {noticeAdd, noticeDetail},
  data () {
    return {
      pageType: 1,//页面类型 1-列表，2-新增，3-详情，4-修改
      // 顶部筛选参数
      noticeForm: {
        noticeDate: null,
        titleOrPublisher: null,
        noticeState: null
      },
      lastNoticeForm: {
        noticeDate: null,
        titleOrPublisher: null,
        noticeState: null
      },
      noticeStateList: [
        {value: '0', label: '未置顶'},
        {value: '1', label: '已置顶'}
      ],
      // 表格参数
      noticeList: [{name: 'xxx'}],
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
    // 获取公告消息列表
    getMsgNoteList () {
      this.pageType = 1;
      // 筛选参数有变化时，当前置为第一页
      const arr = Object.values(this.noticeForm);
      const lastArr = Object.values(this.lastNoticeForm);
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
      this.lastNoticeForm = Object.assign({}, this.noticeForm);
      const params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        orderBy: null,
        order: null,
        'where.messageType': 2,
        'where.startDateStr': this.noticeForm.noticeDate && this.noticeForm.noticeDate[0],
        'where.endDateStr': this.noticeForm.noticeDate && this.noticeForm.noticeDate[1],
        'where.titleOrPublisher': this.noticeForm.titleOrPublisher,
        'where.isTop': this.noticeForm.noticeState
      }
      this.loading = true;
      getMsgNoteList(params).then(res => {
        if (res && res.data) {
          this.noticeList = res.data;
        }
      }).finally(() => {
        this.loading = false;
      })
    },
    // 修改公告消息
    putMsgNote (uid, isTop) {
      const data = {
        uid: uid,
        isTop: !isTop,
      }
      putMsgNote(data).then(res => {
        if (res && res.data) {
          this.$message.success(isTop ? '取消置顶成功' : '置顶成功');
          this.noticeList.list.forEach(f => {
            if (f.uid === uid) {
              f.isTop = !isTop;
            }
          })
        }
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
      this.msgNoteId = uid;
    },
    resetForm () {
      this.$refs['noticeForm'].resetFields();
      this.getMsgNoteList();
    }
  }
}
</script>
<style lang="scss" scoped>
.mes_notice{
  width: 100%;
  height: 100%;
  padding: 20px;
  .notice_box{
    height: 100%;
    width: 100%;
    padding: 20px;
    min-height: 780px;
    background:rgba(255,255,255,1);
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    .notice_form{
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
