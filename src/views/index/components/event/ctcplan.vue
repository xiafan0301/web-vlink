<template>
<vue-scroll>
  <div class="plan-list">
    <div class="search_box">
      <el-form :inline="true" :model="planForm" class="ctc_form" ref="planForm">
        <el-form-item prop="planType">
          <el-select v-model="planForm.planType" style="width: 240px;" placeholder="预案类型">
            <el-option value='全部类型'></el-option>
            <el-option
              v-for="(item, index) in planTypeList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="planLevel">
          <el-select v-model="planForm.planLevel" style="width: 240px;" placeholder="适用等级">
            <el-option value='全部等级'></el-option>
            <el-option
                v-for="(item, index) in planLevelList"
                :key="index"
                :label="item.enumValue"
                :value="item.enumField"
              >
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="planName">
          <el-input style="width: 240px;" type="text" placeholder="请输入预案名称" v-model="planForm.planName" />
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn" @click="selectDataList">查询</el-button>
          <el-button class="reset_btn" @click="resetForm('planForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="divide"></div>
    </div>
    <div class="table_box">
      <div class="add_plan_btn" @click="skipAddPlanPage">
        <span>+</span>
        <span>新增预案</span>
      </div>
      <el-table
        class="plan_table"
        :data="planList"
        >
        <el-table-column
          fixed
          label="序号"
          type="index"
          >
        </el-table-column>
        <el-table-column
          label="预案名称"
          prop="planName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="预案类型"
          prop="eventTypeName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="适用事件等级"
          prop="levelNameList"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <span>{{scope.row.levelNameList.join()}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="创建用户"
          prop="createUserName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <span class="operation_btn" @click="skipDetailPage(scope.row)">查看</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="skipEditPage(scope.row)">修改</span>
            <span style="color: #f2f2f2">|</span>
            <span class="operation_btn" @click="showDeleteDialog(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @current-change="onPageChange"
      :current-page.sync="pagination.pageNum"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
    <!--删除预案弹出框-->
    <el-dialog
      title="是否确定删除该条预案数据?"
      :visible.sync="delPlanDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">删除后调度指挥时将不能再执行此预案。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delPlanDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="deletePlan">确认</el-button>
      </div>
    </el-dialog>
  </div>
</vue-scroll>
</template>
<script>
import { dataList } from '@/utils/data.js';
import { getPlanData, delPlan } from '@/views/index/api/api.event.js';
import { getDiciData } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      planForm: {
        planLevel: '全部等级', // 适用等级
        planType: '全部类型', // 预案类型
        planName: null // 预案名称
      },
      planList: [], // 表格数据
      delPlanDialog: false, // 删除预案弹出框
      planLevelList: [], // 适用等级
      planTypeList: [], // 预案类型
      dePlanId: null, // 要删除的预案id
    }
  },
  created () {
    this.getPlanTypeList();
    this.getPlanLevelList();
    this.getPlanList();
  },
  methods: {
    // 获取预案类型
    getPlanTypeList () {
      const type = dataList.planType;
      getDiciData(type)
        .then(res => {
          if (res) {
            this.planTypeList = res.data;
          }
        })
        .catch(() => {})
    },
    // 获取适用等级
    getPlanLevelList () {
      const level = dataList.eventLevel;
      getDiciData(level)
        .then(res => {
          if (res) {
            this.planLevelList = res.data;
          }
        })
        .catch(() => {})
    },
    // 获取预案列表数据
    getPlanList () {
      let planType, planLevel;
      if (this.planForm.planType === '全部类型') {
        planType = null;
      } else {
        planType = this.planForm.planType;
      }
      if (this.planForm.planLevel === '全部等级') {
        planLevel = null;
      } else {
        planLevel = this.planForm.planLevel;
      }
      const params = {
        'where.planType': planType,
        'where.planLevel': planLevel,
        'where.planName': this.planForm.planName,
        pageNum: this.pagination.pageNum
      }
      getPlanData(params)
        .then(res => {
          if (res) {
            this.planList = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.getPlanList();
    },
    skipAddPlanPage () { // 跳到新增预案页面
      this.$router.push({name: 'add_plan'});
    },
    // 根据搜索条件查询
    selectDataList () {
      this.getPlanList();
    },
    // 重置查询条件
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getPlanList();
    },
    // 显示删除预案弹出框
    showDeleteDialog (obj) {
      this.dePlanId = obj.uid;
      this.delPlanDialog = true;
    },
    // 跳至修改预案页面
    skipEditPage (obj) {
      console.log(obj);
      this.$router.push({name: 'edit_plan', query:{planId: obj.uid}});
    },
    // 跳至预案详情页面
    skipDetailPage (obj) {
      console.log(obj);
      this.$router.push({name: 'ctc_plan_detail', query:{planId: obj.uid}});
    },
    // 确认删除
    deletePlan () {
      if (this.dePlanId) {
        delPlan(this.dePlanId)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              })
              this.getPlanList();
              this.delPlanDialog = false;
            } else {
              this.$message({
                type: 'error',
                message: '删除失败',
                customClass: 'request_tip'
              })
            }
          })
          .catch(() => {})
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.plan-list {
  width: 98%;
  position: relative;
  top: 20px;
  left: 1%;
  background: #ffffff;
  box-shadow: 4px 0px 10px 0px rgba(131,131,131,0.28);
  .search_box {
    width: 100%;
    padding: 20px;
    .ctc_form {
      width: 100%;
      .select_btn, .reset_btn {
        width: 80px;
      }
      .select_btn {
        background-color: #0C70F8;
        color: #ffffff;
      }
      .reset_btn {
        background-color: #ffffff;
        color: #666666;
        border-color: #DDDDDD;
      }
    }
    .divide {
      border: 1px dashed #fafafa;
    }
  }
  .table_box {
    padding: 0 20px;
    .add_plan_btn {
      width: 108px;
      height: 40px;
      background-color: #0C70F8;
      color: #ffffff;
      font-size: 14px;
      line-height: 40px;
      text-align: center;
      border-radius: 3px;
      cursor: pointer;
      span:nth-child(1) {
        font-size: 16px;
      }
      span:nth-child(2) {
        margin-left: 5px;
      }
    }
    .plan_table {
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