<template>
  <div class="bayonet_manage_list">
    <el-form :inline="true" ref="queryForm" :model="queryForm" class="query_form">
      <el-form-item prop="organ">
        <el-select v-model="queryForm.organ" value-key="uid">
          <el-option label="全部机构" :value="null"></el-option>
          <el-option
            v-for="item in organList"
            :key="item.uid"
            :label="item.organName"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="bayonetType">
        <el-select v-model="queryForm.bayonetType" placeholder="请选择出入城卡口">
          <el-option
            v-for="item in bayonetTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="use">
        <el-select v-model="queryForm.use" placeholder="请选择卡口用途">
          <el-option
            v-for="item in useList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="isStartUsing">
        <el-select v-model="queryForm.isStartUsing" placeholder="请选择是否启用">
          <el-option
            v-for="item in isStartUsingList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="state">
        <el-select v-model="queryForm.state" placeholder="请选择在线状态">
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
    </el-form>
    <div class="query_btn">
      <el-button class="select_btn" type="primary">查询</el-button>
      <el-button class="reset_btn">重置</el-button>
    </div>
    <div class="operate_btn">
      <el-button class="select_btn" type="primary" icon="el-icon-plus" @click="skipIsAdd(1)">新增</el-button>
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
          label="卡口IP"
          :show-overflow-tooltip="true"
          >
        </el-table-column>
        <el-table-column
          label="出入城卡口"
          :show-overflow-tooltip="true"
          >
        </el-table-column>
        <el-table-column
          label="卡口用途"
          prop="eventCode"
          show-overflow-tooltip
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
          label="是否启用"
          prop="updateTime"
          show-overflow-tooltip
          width="100"
          >
          <template slot-scope="scope">
            <el-switch
              @change="getBayonetManageList"
              v-model="scope.row.value"
              active-color="#2F54EB"
              inactive-color="#D3D3D3">
            </el-switch>
            <span style="margin-left: 10px;">{{scope.row.value ? '启用' : '停用' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="在线状态"
          prop="alarmLevel"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <span :class="['table_state', {'blue': scope.row.state === 1, 'gray': scope.row.state === 2}]">{{scope.row.state === 1 ? '在线' : '离线'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
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
      <el-pagination
        class="cum_pagination"
        v-if="bayonetManageList && bayonetManageList.length > 0"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="30">
      </el-pagination>
    </div>
    <el-dialog
      :visible.sync="delBayonetDialog"
      :close-on-click-modal="false"
      width="482px"
      top="40vh">
      <h4>是否确定删除该卡口及相关信息？</h4>
      <div slot="footer">
        <el-button @click="delBayonetDialog = false" class="btn_140">取消</el-button>
        <el-button :loading="loadingBtn" class="btn_140" type="primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDepartmentList} from '@/views/index/api/api.manage.js';
export default {
  data () {
    return {
      userInfo: null,
      // 搜索参数
      queryForm: {
        organ: null,
        use: null,
        bayonetType: null,
        isStartUsing: null,
        state: null,
        bayonetName: null
      },
      // 搜索参数列表
      organList: [],
      useList: [
        {label: '人脸抓拍', value: 1},
        {label: '车辆抓拍', value: 2},
        {label: '全结构化', value: 3},
        {label: '其他用途', value: 4}
      ],
      stateList: [
        {label: '在线', value: 1},
        {label: '离线', value: 2}
      ],
      bayonetTypeList: [
        {value: 1, label: '出城卡口'},
        {value: 2, label: '入城卡口'},
        {value: 3, label: '其他'}
      ],
      isStartUsingList: [
        {label: '启用', value: 1},
        {label: '停用', value: 2}
      ],
      loading: false,
      // 卡口列表参数
      bayonetManageList: [{value: true, state: 1}, {value: false, state: 2}],
      // 翻页数据
      currentPage: 1,
      pageSize: 10,
      pageNum: 1,
      // 删除弹出框参数
      loadingBtn: false,
      delBayonetDialog: false,
    }
  },
  mounted () {
    this.userInfo = this.$store.state.loginUser;
    this.getDepartList();
  },
  methods: {
    // 获取所有的机构单位
    getDepartList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0,
      };
      getDepartmentList(params)
        .then(res => {
          if (res && res.data.list) {
            this.organList = res.data.list;
          }
        })
    },
    getBayonetManageList () {
      console.log(this.bayonetManageList)
    },
    // 翻页
    handleCurrentChange (page) {
      this.pageNum = page;
      this.currentPage = page;
    },
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
  margin: 20px;
  padding: 20px;
  height: calc(100% - 40px);
  background: #ffffff;
  box-shadow: 4px 0px 10px 0px rgba(131,131,131,0.28);
  .query_form{
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    > .el-form-item{
      width: 16.66%;
      margin-right: 10px!important;
      margin-bottom: 20px!important;
      &:last-child{
        margin-right: 0!important;
      }
    }
  }
  .query_btn{
    width: 100%;
    text-align: right;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #F2F2F2;
  }
  .table_box{
    margin-top: 20px;
  }
}
</style>
<style lang="scss">
.bayonet_manage_list{
  .query_form{
    .el-form-item__content{
      width: 100%;
      .el-select{
        width: 100%;
        .el-input__inner{
          width: 100%;
        }
      }
    }
  }
  .operate_btn{
    > .el-button:first-child{
      > span{
        margin-left: 0;
      }
      .el-icon-plus{
        position: relative;
        right: 8px;
      }
    }
  }
  .table_box{
    .table_state::before{
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 8px;
      margin-bottom: 2px;
    }
    .blue::before{
      background: #0C70F8;
    }
    .gray::before{
      background: #BFBFBF;
    }
  }
}
</style>

