<template>
  <div class="member_file">
    <div class="header">
      <el-button class="add-btn" icon="el-icon-plus" @click="skipAddPage">新增成员</el-button>
      <el-button class="export-btn">导出</el-button>
      <el-input placeholder="请输入姓名查找" style="width: 240px; float:right;" v-model="searchUserName">
        <i v-show="closeShow" slot="suffix" @click="onClear" class="search_icon el-icon-close" style="font-size: 20px;"></i>
        <i
          v-show="!closeShow"
          class="search_icon vl_icon vl_icon_manage_1"
          slot="suffix"
          @click="searchData">
        </i>
      </el-input>
    </div>
    <div class="table_box">
      <el-table
        class="list_table"
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
          label="姓名"
          prop="userName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="性别"
          prop="userSex"
          >
          <template slot-scope="scope">
            <span>{{scope.row.userSex == 1 ? '男' : scope.row.userSex == 2 ? '女' : '未知'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="职位"
          prop="positionName"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <span>{{scope.row.position ? scope.row.positionName : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="手机号"
          prop="userMobile"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="邮箱"
          prop="userEmail"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <span>{{scope.row.userEmail ? scope.row.userEmail : '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <span class="operation_btn" @click="skipSelectDetail(scope.row)">查看档案</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showEditDialog(scope.row)">编辑档案</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showDeleteDialog(scope.row)">删除档案</span>
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
</template>
<script>
import { getUserList, delUser } from '@/views/index/api/api.user.js';
import { getDiciData } from '@/views/index/api/api.js';
import {dataList } from '@/utils/data.js';
export default {
  data () {
    return {
      searchUserName: null, // 根据姓名查找
      closeShow: false,
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      isDelete: false, // 是否勾选删除成员账户
      deleteDialog: false, // 删除弹出框
      isDeleteLoading: false, // 删除加载中
      dataList: [],
      userInfo: {}, // 存储的用户信息
      memberJobList: [], // 成员职位
      deleteId: null, // 要删除的id
    }
  },
  watch: {
    currentOrganObj () {
      if (this.$store.state.currentOrganObj) {
        this.getList();
      }
    },
    searchUserName (val) {
      if (val) {
        this.closeShow = false;
      } else {
        this.getList();
      }
    }
  },
  computed: {
    currentOrganObj () {
      return this.$store.state.currentOrganObj;
    }
  },
  mounted () {
    this.userInfo = this.$store.state.loginUser;

    this.$store.commit('setCurrentOrgan', {
      currentOrganObj: this.userInfo.organList[0]
    });

    this.getMemberJobList();
    setTimeout(() => {
      this.getList();
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
    // 获取列表数据
    getList () {
      let organId = null;
      if (this.$store.state.currentOrganObj) {
        organId = this.$store.state.currentOrganObj.uid;
      } else {
        organId = this.userInfo.organList[0].uid;
      }
      const params = {
        'where.userName': this.searchUserName,
        'where.organId': organId,
        pageNum: this.pagination.pageNum,
        order: 'asc',
        orderBy: 'user_name'
      }
      getUserList(params)
        .then(res => {
          if (res) {
            this.dataList = res.data.list;
            this.pagination.total = res.data.total;

            this.dataList.map(item => {
              item.positionName = '';
              this.memberJobList.map(val => {
                if (item.position == val.enumField) {
                  item.positionName = val.enumValue;
                }
              });
            });
          }
        })
        .catch(() => {})
    },
    // 根据搜索条件进行搜索
    searchData () {
      if (this.searchUserName) {
        this.closeShow = true;
      }
      this.getList();
    },
    // 清除
    onClear () {
      this.closeShow = false;
      this.searchUserName = null;
      this.getList();
    },
    // 跳至查看档案页面
    skipSelectDetail (obj) {
      let organObj = {};
      if (this.$store.state.currentOrganObj) {
        organObj = this.$store.state.currentOrganObj;
      } else {
        organObj = this.userInfo.organList[0];
      }
      this.$router.push({name: 'member_detail', query: { id: obj.uid, organObj: JSON.stringify(organObj) }});
    },
    // 跳至新增成员页面
    skipAddPage () {
      let organObj = {};
      if (this.$store.state.currentOrganObj) {
        organObj = this.$store.state.currentOrganObj;
      } else {
        organObj = this.userInfo.organList[0];
      }
      this.$router.push({name: 'member_add', query: { organObj: JSON.stringify(organObj) }});
    },
    // 跳至编辑页面
    showEditDialog (obj) {
      let organObj = {};
      if (this.$store.state.currentOrganObj) {
        organObj = this.$store.state.currentOrganObj;
      } else {
        organObj = this.userInfo.organList[0];
      }
      this.$router.push({name: 'member_edit', query: { id: obj.uid, organObj: JSON.stringify(organObj) }});
    },
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getList();
    },
    // 显示删除弹出框
    showDeleteDialog (obj) {
      this.deleteDialog = true;
      this.deleteId = obj.uid;
    },
    // 确认删除
    sureDelete () {
      if (this.deleteId) {
        const params = {
          uid: this.deleteId,
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
              this.getList();
            } else {
              this.isDeleteLoading = false;
            }
          })
          .catch(() => {this.isDeleteLoading = false;})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.member_file {
  padding: 10px;
  .header {
    padding: 10px;
    // display: flex;
    // justify-content: space-between;
    background-color: #ffffff;
    .add-btn {
      background-color: #0C70F8;
      color: #fff;
    }
    .search_icon{
      margin-top: 10px;
      cursor: pointer;
    }
  }
  .table_box {
    padding: 0 10px;
    background-color: #ffffff;
    .list_table {
      margin-top: 8px;
      .operation_btn {
        color: #0C70F8;
        cursor: pointer;
        padding: 0 10px;
        display: inline-block;
      }
    }
  }
}
</style>

