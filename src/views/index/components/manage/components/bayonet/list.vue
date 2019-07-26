<template>
  <div class="bayonet_manage_list">
    <div class="query_box">
      <el-form :inline="true" ref="queryForm" :model="queryForm" class="query_form">
        <el-form-item prop="organ">
          <el-select v-model="queryForm.organ">
            <el-option label="全部机构" :value="null"></el-option>
            <el-option
              v-for="item in organList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="use">
          <el-select v-model="queryForm.use">
            <el-option label="全部用途" :value="null"></el-option>
            <el-option
              v-for="item in useList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="state">
          <el-select v-model="queryForm.state">
            <el-option label="全部状态" :value="null"></el-option>
            <el-option
              v-for="item in stateList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="bayonetName">
          <el-input v-model="queryForm.bayonetName" placeholder="请输入卡口名称搜索"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="reset_btn">重置</el-button>
          <el-button class="select_btn">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="operate_btn">
      <el-button class="select_btn" @click="skipIsAdd(1)">新增</el-button>
      <el-button class="reset_btn">导入</el-button>
      <el-button class="reset_btn">导出</el-button>
    </div>
    <div class="table_box">
      <el-table
        v-loading="loading"
        :data="bayonetManageList"
        >
        <el-table-column
          label="卡口名称"
          prop="surveillanceName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="卡口编号"
          prop="num"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="所属机构"
          :show-overflow-tooltip="true"
          >
        </el-table-column>
        <el-table-column
          label="卡口地址"
          prop="time"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="设备数量"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="用途"
          prop="eventCode"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="描述"
          prop="alarmLevel"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="使用状况"
          prop="updateTime"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="operation_btn" @click="skipIsDetail(scope.row)">查看</span>
            <span class="operation_wire">|</span>
            <span class="operation_btn" @click="skipIsAdd(2)">编辑</span>
            <span class="operation_wire">|</span>
            <span class="operation_btn" @click="deleteBayonet()">删除</span>
          </template>
        </el-table-column>
        <div class="not_content" slot="empty">
          <img src="../../../../../../assets/img/not-content.png" alt="">
          <p>暂无相关数据</p>
        </div>
      </el-table>
    </div>
    <el-dialog
      :visible.sync="delBayonetDialog"
      :close-on-click-modal="false"
      width="482px"
      top="40vh">
      <h4>是否确定删除该卡口及相关信息？</h4>
      <div slot="footer">
        <el-button @click="delBayonetDialog = false" class="reset_btn btn_140">取消</el-button>
        <el-button :loading="loadingBtn" class="select_btn btn_140">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 搜索参数
      queryForm: {
        organ: null,
        use: null,
        state: null,
        bayonetName: null
      },
      // 搜索参数列表
      organList: [],
      useList: [],
      stateList: [],
      bayonetManageList: [{}],//卡口列表
      loading: false,
      // 删除弹出框参数
      loadingBtn: false,
      delBayonetDialog: false,
    }
  },
  methods: {
    // 跳转至详情页
    skipIsDetail () {
      this.$router.push({name: 'bayonet_manage_detail'});
    },
    // 跳转至编辑页
    skipIsAdd (type) {
      this.$router.push({name: 'bayonet_manage_add', query: {type}});
    },
    // 删除卡口
    deleteBayonet () {
      this.delBayonetDialog = true;
    },
  }
}
</script>
<style lang="scss" scoped>
.bayonet_manage_list{
  padding: 20px;
  background: #fff;
  .operate_btn{
    
  }
  .table_box{
    margin-top: 20px;
  }
  // 重置按钮样式
  .select_btn, .reset_btn {
    width: 110px;
  }
  .btn_100{
    width: 100px!important;
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
</style>
