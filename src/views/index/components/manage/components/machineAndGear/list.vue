<template>
  <div class="machine_gear">
    <div class="search_box">
      <el-form :inline="true" :model="searchForm" class="search_form" ref="searchForm">
        <el-form-item prop="vehicleType">
          <el-select style="width: 240px;" v-model="searchForm.vehicleType" placeholder="类型">
            <el-option value='全部类型'></el-option>
            <el-option
              v-for="(item, index) in cameraTypeList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="character">
          <el-select  style="width: 240px;" v-model="searchForm.character" placeholder="特性">
            <el-option value='全部特性'></el-option>
            <el-option
              v-for="(item, index) in cameraFeatureList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="level">
          <el-select style="width: 240px;" v-model="searchForm.level" placeholder="级别">
            <el-option value='全部级别'></el-option>
            <el-option
              v-for="(item, index) in cameraLevelList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status">
          <el-select  style="width: 240px;" v-model="searchForm.status" placeholder="状态">
            <el-option value='全部状态'></el-option>
            <el-option
              v-for="(item, index) in cameraStatusList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="factory">
          <el-select style="width: 240px;" v-model="searchForm.factory" placeholder="厂家">
            <el-option value='全部厂家'></el-option>
            <el-option
              v-for="(item, index) in cameraUnitList"
              :key="index"
              :label="item.enumValue"
              :value="item.enumField"
            >
            </el-option>
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
          prop="cameraType"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="所属单位"
          prop="organName"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="智能特性"
          prop="character"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          label="重要级别"
          prop="importLevel"
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
// import { getDepartmentList } from '@/views/index/api/api.manage.js';
export default {
  data () {
    return {
      pagination: { total: 3, pageSize: 10, pageNum: 1 },
      searchForm: {
        vehicleType: '全部类型', // 类型
        character: '全部特性', // 特性
        level: '全部级别', // 级别
        status: '全部状态', // 状态
        factory: '全部厂家', // 厂家
        name: null // 摄像头名称
      },
      dataList: [
        {
          number: '3',
          monitorName: 'IPC100102',
          cameraType: '球机',
          organName: '溆浦县公安局',
          character: '人脸识别、红外感应',
          importLevel: '关键点位',
          company: '大华',
          status: '正常',
        },
        {
          number: '25',
          monitorName: 'IPC122104',
          cameraType: '半球机',
          organName: '卢峰镇公安局',
          character: '人脸识别',
          importLevel: '重要点位',
          company: '大华',
          status: '告警',
        },
        {
          number: '2466',
          monitorName: 'IPC100115',
          cameraType: '枪机',
          organName: '卢峰镇城管队',
          character: '人脸识别、车牌抓拍',
          importLevel: '一般点位',
          company: '海康威视',
          status: '离线',
        },
      ],
      cameraTypeList: [
        {
          enumValue: '球机',
          enumField: '1'
        },
        {
          enumValue: '半球机',
          enumField: '2'
        },
        {
          enumValue: '枪机',
          enumField: '3'
        }
      ], // 摄像头类型列表
      cameraFeatureList: [
        {
          enumValue: '人脸识别',
          enumField: '1'
        },
        {
          enumValue: '车辆抓拍',
          enumField: '2'
        },
        {
          enumValue: '红外感应',
          enumField: '3'
        }
      ], // 摄像头特性
      cameraLevelList: [
        {
          enumValue: '关键点位',
          enumField: '1'
        },
        {
          enumValue: '重要点位',
          enumField: '2'
        },
        {
          enumValue: '一般点位',
          enumField: '3'
        },
        {
          enumValue: '次要点位',
          enumField: '4'
        }
      ], // 摄像头级别列表
      cameraStatusList: [
        {
          enumValue: '正常',
          enumField: '1'
        },
        {
          enumValue: '告警',
          enumField: '2'
        },
        {
          enumValue: '离线',
          enumField: '3'
        }
      ], // 车辆状态列表
      cameraUnitList: [
        {
          enumValue: '大华',
          enumField: '1'
        },
        {
          enumValue: '海康威视',
          enumField: '2'
        }
      ] // 摄像头厂家列表
    }
  },
  methods: {
    // 获取当前部门及子级部门
    getDepartList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        'where.organPid': this.userInfo.organList[0].uid,
        pageSize: 0
      };
      getDepartmentList(params)
        .then(res => {
          if (res) {
            this.departmentList.push(this.userInfo.organList[0]);
            res.data.list.map(item => {
              this.departmentList.push(item);
            });
          }
        })
    },
    selectDataList () {},
    resetForm (form) {},
    // 跳至查看档案页面
    skipSelectDetail (obj) {
      this.$router.push({name: 'machine_detail', query: { status: obj.status }});
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

