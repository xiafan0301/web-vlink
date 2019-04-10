<template>
  <vue-scroll>
    <div class="more-plan">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/event/untreatEventDetail' }">事件详情</el-breadcrumb-item>
          <el-breadcrumb-item>查询预案</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <div class="search_box">
          <el-form :inline="true" :model="planForm" class="ctc_form" ref="planForm">
            <el-form-item prop="planType">
              <el-select v-model="planForm.planType" style="width: 240px;">
                <el-option value="全部类型"></el-option>
                <el-option
                  v-for="(item, index) in eventTypeList"
                  :key="index"
                  :label="item.enumValue"
                  :value="item.uid"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="planLevel">
              <el-select v-model="planForm.planLevel" style="width: 240px;">
                <el-option value="全部等级"></el-option>
                <el-option
                  v-for="(item, index) in eventLevelList"
                  :key="index"
                  :label="item.enumValue"
                  :value="item.uid"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="planName">
              <el-input style="width: 240px;" type="text" placeholder="请输入预案名称" v-model="planForm.planName" />
            </el-form-item>
            <el-form-item>
              <el-button class="select_btn" @click="selectData">查询</el-button>
              <el-button class="reset_btn" @click="resetForm('planForm')">重置</el-button>
            </el-form-item>
          </el-form>
          <div class="divide"></div>
        </div>
        <div class="table_box">
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
              <template slot-scope='scope'>
                <span>{{scope.row.levelNameList.join('、')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <span class="operation_btn" @click="skipDetailInfo(scope.row)">查看</span>
                <span style="color: #f2f2f2">|</span>
                <span class="operation_btn" @click="skipEnablePlanPage(scope.row)">启用</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          @current-change="onPageChange"
          :current-page="pagination.pageNum"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="pagination.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
      </div>
    </div>
  </vue-scroll>
</template>
<script>
import { dataList } from '@/utils/data.js';
import { getPlanData, getDiciData } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      planForm: {
        planLevel: '全部等级',
        planType: '全部类型',
        planName: null // 预案名称
      },
       planList: [], // 表格数据
      eventTypeList: [], // 事件类型
      eventLevelList: [], // 事件等级
    }
  },
  created () {
    this.getEventTypeList();
    this.getEventLevelList();
    this.getPlanList();
  },
  methods: {
    // 获取事件类型
    getEventTypeList () {
      const type = dataList.planType;
      getDiciData(type)
        .then(res => {
          if (res) {
            this.eventTypeList = res.data;
          }
        })
        .catch(() => {})
    },
    // 获取事件等级
    getEventLevelList () {
      const level = dataList.eventLevel;
      getDiciData(level)
        .then(res => {
          if (res) {
            this.eventLevelList = res.data;
          }
        })
        .catch(() => {})
    },
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.getPlanList();
    },
    // 跳至查看详情页面
    skipDetailInfo (obj) {
      console.log(obj);
      this.$router.push({name: 'plan_detail', query: {planId: obj.uid, eventId: this.$route.query.eventId}});
    },
    // 跳至启用预案页面
    skipEnablePlanPage (obj) {
      console.log(obj);
      this.$router.push({name: 'enable_plan', query: {eventId: this.$route.query.eventId, planId: obj.uid}});
    },
    // 获取列表数据
    getPlanList () {
      let planLevel, planType;
      if (this.planForm.planLevel === '全部等级') {
        planLevel = '';
      } else {
        planLevel = this.planForm.planLevel;
      }
      if (this.planForm.planType === '全部类型') {
        planType = '';
      } else {
        planType = this.planForm.planType;
      }
      const params = {
        'where.planType': planType,
        'where.planLevel': planLevel,
        'where.planName': this.planForm.planName,
        pageNum: this.pagination.pageNum
      }
      getPlanData(params)
        .then(res => {
          if (res && res.data.list) {
            this.planList = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    // 根据查询条件查询
    selectData () {
      this.getPlanList();
    },
    // 重置查询表单
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getPlanList();
    }
  }
}
</script>
<style lang="scss" scoped>
.more-plan {
  width: 98%;
  .content-box {
    margin-left: 20px;
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
}
</style>

