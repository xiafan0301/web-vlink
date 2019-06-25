<template>
<vue-scroll>
  <div class="member_detail">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manage/archivesManage/memberFile'}">档案管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/archivesManage/memberFile'}">一员一档</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="basic_info">
      <div class="header member_header">
        <span>基本信息</span>
        <p>
          创建于{{detailInfo.createTime | fmTimestamp}}；
          最近更新于{{detailInfo.updateTime | fmTimestamp}}
        </p>
      </div>
      <div class="divide"></div>
      <!-- <div class="detail_info"> -->
        <ul class="detail_info clearfix">
          <li>
            <span>成员编号:</span>
            <span>{{detailInfo.memberNo ? detailInfo.memberNo : '无'}}</span>
          </li>
          <li>
            <span>成员姓名:</span>
            <span>{{detailInfo.userName}}</span>
          </li>
          <li>
            <span>性别:</span>
            <span>{{detailInfo.userSex == 1 ? '男' : detailInfo.userSex == 2 ? '女' : '未知'}}</span>
          </li>
          <li>
            <span>手机号码:</span>
            <span>{{detailInfo.userMobile}}</span>
          </li>
          <li>
            <span>所属单位:</span>
            <span>{{detailInfo.organName}}</span>
          </li>
          <li>
            <span>职位:</span>
            <span>{{detailInfo.position ? detailInfo.positionName : '无'}}</span>
          </li>
          <li>
            <span>邮箱:</span>
            <span>{{detailInfo.userEmail ? detailInfo.userEmail : '无'}}</span>
          </li>
        </ul>
      <!-- </div> -->
    </div>
    <div class="relate_job">
      <div class="header">
        <span>相关工作</span>
      </div>
      <div class="divide"></div>
      <div class="table_box">
        <el-table
          class="detail_table"
          :data="dataList"
          >
          <el-table-column
            fixed
            label="序号"
            type="index"
            width="60"
            >
          </el-table-column>
          <el-table-column
            label="事件编号"
            prop="eventCode"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="类型"
            prop="eventTypeName"
            >
          </el-table-column>
          <el-table-column
            label="上报者"
            prop="reporterPhone"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <span v-if='scope.row.reporterPhone'>{{scope.row.reporterPhone}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            label="身份"
            prop="reporterRole"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <span v-if='scope.row.reporterUserRole'>{{scope.row.reporterUserRole}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            label="上报时间"
            prop="reportTime"
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
            label="上报内容"
            prop="eventDetail"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="状态"
            prop="eventStatusName"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <span class="data_status" :class="[scope.row.eventStatus === 1 ? 'untreated_event' : scope.row.eventStatus === 2 ? 'treating_event' : 'end_event']">{{scope.row.eventStatusName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <span class="operation_btn" @click="skipSelectDetail(scope.row)">查看详情</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="cum_pagination"
        @current-change="handleCurrentChange"
        :current-page.sync="pagination.pageNum"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="pagination.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn function_btn"  @click="skipEditInfoPage">编辑信息</el-button>
      <el-button class="operation_btn back_btn"  @click="showDeleteDialog">删除</el-button>
      <el-button class="operation_btn back_btn" @click="back">返回</el-button>
    </div>
    <!--删除弹出框-->
    <el-dialog
      title="是否删除该成员？"
      :visible.sync="deleteDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <el-checkbox v-model="isDelete">同步删除成员账户，删除后该成员将无法登录本系统</el-checkbox>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="sureDelete">确认</el-button>
      </div>
    </el-dialog>
  </div>
</vue-scroll>
</template>
<script>
import { getUserDetail, delUser } from '@/views/index/api/api.user.js';
import { getEventList } from '@/views/index/api/api.event.js';
import { getDiciData } from '@/views/index/api/api.js';
import {dataList } from '@/utils/data.js';
export default {
  data () {
    return {
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      deleteDialog: false, // 删除弹出框
      isDelete: false, // 是否勾选删除成员账户
      isDeleteLoading: false, // 删除加载中
      detailInfo: {}, // 用户详情
      dataList: [],
      memberJobList: [], // 成员职位
    }
  },
  mounted () {
    this.getMemberJobList();
    setTimeout(() => {
      this.getDetail();
    }, 500)
  },
  methods: {
    // 获取成员职位数据
    getMemberJobList () {
      const memberJob = dataList.memberJob;
      getDiciData(memberJob)
        .then(res => {
          if (res) {
            this.memberJobList = res.data;
          }
        })
        .catch(() => {})
    },
    // 获取用户详情
    getDetail () {
      const userId = this.$route.query.id;
      if (userId) {
        getUserDetail(userId)
          .then(res => {
            if (res) {
              this.detailInfo = res.data;
              this.getEventData();

              this.memberJobList.map(val => {
                if (this.detailInfo.position == val.enumField) {
                  this.detailInfo.positionName = val.enumValue;
                }
              });
            }
          })
      }
    },
    // 获取事件列表数据
    getEventData () {
      const params = {
        'where.eventFlag': 1, // 是否是事件  1--是 0-否
        'where.keyword': this.detailInfo.userMobile,
        'where.acceptFlag': 2, // 审核通过
        pageNum: this.pagination.pageNum,
        orderBy: 'report_time',
        order: 'asc'
      }
      getEventList(params)
        .then(res => {
          if (res && res.data.list) {
            this.dataList = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    // 跳至编辑信息页面
    skipEditInfoPage () {
      this.$router.push({name: 'member_edit', query: { id: this.$route.query.id }});
    },
    // 显示删除弹出框
    showDeleteDialog () {
      this.deleteDialog = true;
    },
    // 返回
    back () {
      this.$router.back(-1);
    },
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getEventData();
    },
    // 确认删除
    sureDelete () {
      if (this.$route.query.id) {
        const params = {
          uid: this.$route.query.id,
          flag: this.isDelete ? 2 : 1 // 1--仅删除用户与机构之间的联系  2--删除用户
        }
        this.isDeleteLoading = true;
        delUser(params)
          .then (res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              });
              this.isDeleteLoading = false;
              this.deleteDialog = false;
              this.$router.push({name: 'member_file'});
            } else {
              this.isDeleteLoading = false;
            }
          })
          .catch(() => {this.isDeleteLoading = false;})
      }
    },
    // 跳至事件详情页
    skipSelectDetail (obj) {
      if (obj.eventStatus === 1) {
        this.$router.push({name: 'untreat_event_detail', query: {status: 'unhandle', eventId: obj.uid}});
      }
      if (obj.eventStatus === 2) {
        this.$router.push({name: 'treating_event_detail', query: {status: 'handling', eventId: obj.uid}});
      }
      if (obj.eventStatus === 3) {
        this.$router.push({name: 'treating_event_detail', query: {status: 'ending', eventId: obj.uid}});
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.member_detail {
  .basic_info, .relate_job {
    margin: 10px;
    background-color: #ffffff;
    margin-bottom: 20px;
    box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    .header {
      > span {
        display: inline-block;
        padding: 10px;
        color: #333333;
        font-weight: 600;
        font-size: 16px;
      }
    }
    .member_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      >p {
        margin-right: 10px;
        color:#999999;
      }
    }
    .divide {
      width: 100%;
      height: 1px;
      background-color: #F2F2F2;
    }
    .detail_info {
      width: 100%;
      clear: both;
      padding: 10px 0;
      >li {
        width: 25%;
        float: left;
        height: 30px;
        line-height: 30px;
        span:first-child {
          display: inline-block;
          color: #666666;
          width: 70px;
          text-align: right;
          margin-right: 10px;
        }
        span:last-child {
          color: #333333;
        }
      }
    }
    .table_box {
      padding: 10px;
      .detail_table {
        margin-top: 8px;
        .data_status {
          &:before {
            content: '.';
            font-size: 30px;
            position: absolute;
            left: 0;
            top: 3px;
          }
        }
        .untreated_event {
          &:before {
            color: #0C70F8;
          }
        }
        .treating_event {
          &:before {
            color: #63C751;
          }
        }
        .end_event {
          &:before {
            color: #B8B8B8;
          }
        }
        .operation_btn {
          color: #0C70F8;
          cursor: pointer;
          padding: 0 10px;
          display: inline-block;
        }
        .default_btn {
          padding: 0 10px;
          display: inline-block;
          color: #B2B2B2;
        }
      }
    }
  }

  .operation-footer {
    border-left: 1px solid #F2F2F2;
    width: 100%;
    height: 65px;
    line-height: 65px;
    position: fixed;
    bottom: 0;
    background: #ffffff;
    padding-left: 20px;
    .operation_btn {
      padding: 0;
      width: 100px;
      height: 40px;
      text-align: center;
    }
    .function_btn {
      background: #0C70F8;
      color: #ffffff;
    }
    .back_btn {
      background: #ffffff;
      border: 1px solid #DDDDDD;
      color: #666666;
    }
  }
}
</style>

