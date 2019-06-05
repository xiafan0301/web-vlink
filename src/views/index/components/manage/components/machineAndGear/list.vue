<template>
  <div class="machine_gear">
    <div class="search_box">
      <el-form :inline="true" :model="searchForm" class="search_form" ref="searchForm">
        <el-form-item prop="companyName">
          <el-select  style="width: 240px;" v-model="searchForm.companyName" placeholder="所属单位">
            <!-- <el-option value='全部车辆类型'></el-option> -->
            <!-- <el-option
              v-for="(item, index) in eventTypeList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item prop="vehicleType">
          <el-select style="width: 240px;" v-model="searchForm.vehicleType" placeholder="类型">
            <el-option value='全部类型'></el-option>
            <!-- <el-option
              v-for="(item, index) in eventStatusList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item prop="character">
          <el-select  style="width: 240px;" v-model="searchForm.character" placeholder="特性">
            <el-option value='全部特性'></el-option>
            <!-- <el-option
              v-for="(item, index) in eventTypeList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item prop="level">
          <el-select style="width: 240px;" v-model="searchForm.level" placeholder="级别">
            <el-option value='全部级别'></el-option>
            <!-- <el-option
              v-for="(item, index) in eventStatusList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item prop="status">
          <el-select  style="width: 240px;" v-model="searchForm.status" placeholder="状态">
            <el-option value='全部状态'></el-option>
            <!-- <el-option
              v-for="(item, index) in eventTypeList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item prop="factory">
          <el-select style="width: 240px;" v-model="searchForm.factory" placeholder="厂家">
            <el-option value='全部厂家'></el-option>
            <!-- <el-option
              v-for="(item, index) in eventStatusList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item prop="name">
          <el-input style="width: 240px;" type="text" placeholder="请输入摄像头名称查找" v-model="searchForm.name" />
        </el-form-item>
        <el-form-item>
          <el-button class="select_btn" @click="selectDataList">查询</el-button>
          <el-button class="reset_btn" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="divide"></div>
    </div>
    <div class="header">
      <el-button class="export-btn">导出</el-button>
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
          label="编号"
          prop="number"
          >
        </el-table-column>
        <el-table-column
          label="摄像头名称"
          prop="monitorName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="类型"
          prop="vechileNo"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="所属单位"
          prop="type"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="智能特性"
          prop="vechileType"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="重要级别"
          prop="personNum"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="厂家"
          prop="company"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="状态"
          prop="status"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <span class="list_status" :class="[scope.row.status === '正常' ? 'normal_status' : scope.row.status === '告警' ? 'alarm_status' : 'offline_status']">{{scope.row.status}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <span class="operation_btn" @click="skipSelectDetail(scope.row)">查看档案</span>
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
</template>
<script>
export default {
  data () {
    return {
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      searchForm: {
        vehicleType: null,
        companyName: null,
        character: null,
        level: null,
        status: null,
        factory: null,
        name: null
      },
      dataList: [
        {
          number: '1',
          vechileNo: 'XXXX路口治安亭',
          type: '湖南省怀化市溆浦县城中路1号',
          vechileType: '县公安局',
          personNum: '张三',
          company: '13912345678',
          status: '正常',
          monitorName: 'IPC100102'
        },
        {
          number: '2',
          vechileNo: 'XXXX路口治安亭',
          type: '湖南省怀化市溆浦县城中路1号',
          vechileType: '县公安局',
          personNum: '张三',
          company: '13912345678',
          status: '告警',
          monitorName: 'IPC100102'
        },
        {
          number: '3',
          vechileNo: 'XXXX路口治安亭',
          type: '湖南省怀化市溆浦县城中路1号',
          vechileType: '县公安局',
          personNum: '张三',
          company: '13912345678',
          status: '离线',
          monitorName: 'IPC100102'
        },
        {
          number: '4',
          vechileNo: 'XXXX路口治安亭',
          type: '湖南省怀化市溆浦县城中路1号',
          vechileType: '县公安局',
          personNum: '张三',
          company: '13912345678',
          status: '离线',
          monitorName: 'IPC100102'
        },
      ]
    }
  },
  methods: {
    selectDataList () {},
    resetForm (form) {},
    // 跳至查看档案页面
    skipSelectDetail () {
      this.$router.push({name: 'machine_detail'});
    },
    handleCurrentChange () {}
  }
}
</script>

<style lang="scss" scoped>
.machine_gear {
  padding: 10px;
  .search_box {
    width: 100%;
    padding: 10px;
    .search_form {
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
  .header {
    padding: 10px;
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
      .list_status {
        &:before {
          content: '.';
          font-size: 30px;
          position: absolute;
          left: 0;
          top: 3px;
        }
      }
      .normal_status {
        &:before {
          color: #4FCB61;
        }
      }
      .alarm_status {
        &:before {
          color: #FF5500;
        }
      }
      .offline_status {
        &:before {
          color: #BFBFBF;
        }
      }
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

