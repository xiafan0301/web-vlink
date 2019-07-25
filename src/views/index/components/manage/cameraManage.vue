<template>
  <vue-scroll>
    <div class="camera_manage">
      <div class="search_box">
        <el-form :inline="true" :model="searchForm" class="search_form" ref="searchForm">
          <el-form-item prop="dateTime">
            <el-date-picker
              style="width: 380px"
              class="vl_date"
              v-model="searchForm.dateTime"
              range-separator="至"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="dutyUnitId">
            <el-select v-model="searchForm.dutyUnitId" placeholder="请选择">
              <el-option value="全部机构"></el-option>
              <el-option
                v-for="item in departmentList"
                :key="item.uid"
                :label="item.organName"
                :value="item.uid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="type">
            <el-select v-model="searchForm.type" placeholder="请选择">
              <el-option value="全部类型"></el-option>
              <el-option
                v-for="item in cameraTypeList"
                :key="item.enumField"
                :label="item.enumValue"
                :value="item.enumField">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="deviceStatus">
            <el-select v-model="searchForm.deviceStatus" placeholder="请选择">
              <el-option value="全部状态"></el-option>
              <el-option
                v-for="item in deviceStatusList"
                :key="item.enumField"
                :label="item.enumValue"
                :value="item.enumField">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="intelligentCharac">
            <el-select v-model="searchForm.intelligentCharac" placeholder="请选择">
              <el-option value="全部特性"></el-option>
              <el-option
                v-for="item in intelligentCharacList"
                :key="item.enumField"
                :label="item.enumValue"
                :value="item.enumField">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="importantLevel">
            <el-select v-model="searchForm.importantLevel" placeholder="请选择">
              <el-option value="全部级别"></el-option>
              <el-option
                v-for="item in importLevelList"
                :key="item.enumField"
                :label="item.enumValue"
                :value="item.enumField">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="manufacturer">
            <el-select v-model="searchForm.manufacturer" placeholder="请选择">
              <el-option value="全部厂家"></el-option>
              <el-option
                v-for="item in manufacturerList"
                :key="item.enumField"
                :label="item.enumValue"
                :value="item.enumField">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="keyword">
            <el-input placeholder="请输入摄像头名称/IP搜索" style="width: 240px" v-model="searchForm.keyword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="select_btn" type="primary" :loading="isSearchLoading" @click="selectDataList">查询</el-button>
            <el-button class="reset_btn" @click="resetForm('searchForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="divide"></div>
      </div>
      <div class="content-box">
        <div class="button_box">
          <el-button type="primary" @click="skipAddCameraPage">新增摄像头</el-button>
          <el-button>导入</el-button>
          <el-button>导出</el-button>
        </div>
        <el-table
          class="data_table"
          :data="dataList"
          >
          <el-table-column
            label="摄像头名称"
            prop="deviceName"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="摄像头编号"
            prop="deviceCode"
            width="150"
            sortable
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="IP"
            prop="ipAddress"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="类型"
            prop="typeStr"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="所属机构"
            prop="dutyUnitName"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="智能特性"
            prop="intelligentCharac"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="重要级别"
            prop="importantLevelStr"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="厂家"
            prop="importantLevelStr"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="状态"
            prop="deviceStatusStr"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="160">
            <template slot-scope="scope">
              <span class="operation_btn" @click="skipDetailPage(scope.row)">查看</span>
              <span style="color: #f2f2f2">|</span>
              <span class="operation_btn" @click="skipAddCameraPage(scope.row)" >编辑</span>
              <span style="color: #f2f2f2">|</span>
              <span class="operation_btn" @click="showDeleteDialog(scope.row)">删除</span>
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
      <!--删除摄像头弹出框-->
      <el-dialog
        title="是否确定删除该摄像头信息?"
        :visible.sync="delCameraDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
        >
        <!-- <span style="color: #999999;">删除后数据不可恢复。</span> -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="delCameraDialog = false">取消</el-button>
          <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="deleteCamera">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </vue-scroll>
</template>
<script>
import { getDepartmentList} from '@/views/index/api/api.manage.js';
import { getDeviceList, delDevice } from '@/views/index/api/api.base.js';
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      searchForm: {
        dateTime: [], // 日期
        dutyUnitId: '全部机构', // 机构单位
        type: '全部类型', // 类型
        deviceStatus: '全部状态', // 状态
        intelligentCharac: '全部特性', // 特性
        importantLevel: '全部级别', // 级别
        manufacturer: '全部厂家', // 厂家
        keyword: null, // 名称/ip
      },
      operationId: null, // 要操作的摄像头id
      dataList: [],
      isDeleteLoading: false,
      isSearchLoading: false,
      delCameraDialog: false, // 删除摄像头弹出框
      userInfo: {}, // 用户信息
      departmentList: [], // 机构单位
      intelligentCharacList: [], // 智能特性
      cameraTypeList: [], // 摄像头类型
      deviceStatusList: [], // 摄像头状态
      importLevelList: [], // 级别
      manufacturerList: [], // 厂家
    }
  },
  created () {
    this.userInfo = this.$store.state.loginUser;
    this.getDepartList();
    this.getIntelligentCharacList();
    this.getDeviceStatusList();
    this.getCameraTypeList();
    this.getImportLevelList();
    this.getManufacturerList();
  },
  mounted () {
    setTimeout(() => {
      this.selectDataList();
    }, 1000)
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
            this.departmentList = res.data.list;
          }
        })
    },
    // 获取所有的智能特性
    getIntelligentCharacList () {
      const obj = dataList.intelCharac;
      getDiciData(obj)
        .then(res => {
          if (res) {
            this.intelligentCharacList = res.data;
          }
        })
    },
    // 获取所有的设备状态
    getDeviceStatusList () {
      const obj = dataList.deviceStatus;
      getDiciData(obj)
        .then(res => {
          if (res) {
            this.deviceStatusList = res.data;
          }
        })
    },
    // 获取所有的摄像头类型
    getCameraTypeList () {
      const obj = dataList.cameraType;
      getDiciData(obj)
        .then(res => {
          if (res) {
            this.cameraTypeList = res.data;
          }
        })
    },
    // 获取所有的重要级别
    getImportLevelList () {
      const obj = dataList.importantLevel;
      getDiciData(obj)
        .then(res => {
          if (res) {
            this.importLevelList = res.data;
          }
        })
    },
    // 获取所有的厂家
    getManufacturerList () {
      const obj = dataList.manufacturer;
      getDiciData(obj)
        .then(res => {
          if (res) {
            this.manufacturerList = res.data;
          }
        })
    },
    // 获取摄像头列表数据
    selectDataList () {
      let dutyUnitId, deviceStatus, intelligentCharac, importantLevel, manufacturer, type;
      if (this.searchForm.dutyUnitId === '全部机构') {
        dutyUnitId = null;
      } else {
        dutyUnitId = this.searchForm.dutyUnitId;
      }
      if (this.searchForm.type === '全部类型') {
        type = null;
      } else {
        type = this.searchForm.type;
      }
      if (this.searchForm.deviceStatus === '全部状态') {
        deviceStatus = null;
      } else {
        deviceStatus = this.searchForm.deviceStatus;
      }
      if (this.searchForm.intelligentCharac === '全部特性') {
        intelligentCharac = null;
      } else {
        intelligentCharac = this.searchForm.intelligentCharac;
      }
      if (this.searchForm.importantLevel === '全部级别') {
        importantLevel = null;
      } else {
        importantLevel = this.searchForm.importantLevel;
      }
      if (this.searchForm.manufacturer === '全部厂家') {
        manufacturer = null;
      } else {
        manufacturer = this.searchForm.manufacturer;
      }
      const params = {
        'where.onlineStartDate': this.searchForm.dateTime[0],
        'where.onlineEndDate': this.searchForm.dateTime[1],
        'where.dutyUnitId': dutyUnitId,
        'where.intelligentCharac': intelligentCharac,
        'where.deviceStatus': deviceStatus,
        'where.importantLevel': importantLevel,
        'where.type': type,
        'where.manufacturer': manufacturer,
        'where.keyword': this.searchForm.keyword,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        order: 'desc',
        orderBy: 'create_time'
      };
      console.log('params', params)
      this.isSearchLoading = true;
      getDeviceList(params)
        .then(res => {
          if (res && res.data) {
            this.isSearchLoading = false;
            this.pagination.total = res.data.total;

            this.dataList = res.data.list;
            this.dataList.map(val => {
              let dutyUnitName = '';
              this.departmentList.map(item => {
                if (item.uid == val.dutyUnitId) {
                  val.dutyUnitName = item.organName;
                }
              });
              // this.cameraTypeList.map(item => {
              //   if (item.enumField == val.type) {
              //     val.cameraTypeName = item.enumValue;
              //   }
              // });
              // this.intelligentCharacList.map(item => {
              //   if (item.enumField == val.intelligentCharac) {
              //     val.intelligentCharacName = item.enumValue;
              //   }
              // });
              // this.importLevelList.map(item => {
              //   if (item.enumField == val.importantLevel) {
              //     val.importantLevelName = item.enumValue;
              //   }
              // });
              // this.manufacturerList.map(item => {
              //   if (item.enumField == val.manufacturer) {
              //     val.manufacturerName = item.enumValue;
              //   }
              // });
              // this.deviceStatusList.map(item => {
              //   if (item.enumField == val.deviceStatus) {
              //     val.deviceStatusName = item.enumValue;
              //   }
              // });
            })
          } else {
            this.isSearchLoading = false;
          }
        })
        .catch(() => {this.isSearchLoading = false;})
    },
    resetForm (form) {
      this.$refs[form].resetFields();
      this.selectDataList();
    },
    handleCurrentChange (val) {
      this.pagination.pageNum = val;
      this.selectDataList();
    },
    // 跳至新增摄像头页面
    skipAddCameraPage (obj) {
      let id;
      if (obj) {
        id = obj.uid;
      }
      this.$router.push({name: 'add_camera', query: { id: id }});
    },
    // 跳至查看详情页面
    skipDetailPage (obj) {
      this.$router.push({name: 'camera_detail', query:{ id: obj.uid }});
    },
    // 显示删除弹出框
    showDeleteDialog (obj) {
      this.delCameraDialog = true;
      this.operationId = obj.uid;
    },
    // 删除摄像头
    deleteCamera () {
      if (this.operationId) {
        this.isDeleteLoading = true;
        delDevice(this.operationId)
          .then(res => {
            if (res && res.data) {
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              });
              this.delCameraDialog = false;
              this.isDeleteLoading = false;
              this.selectDataList();
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
.camera_manage{
  width: 98%;
  position: relative;
  top: 20px;
  left: 1%;
  background: #ffffff;
  box-shadow: 4px 0px 10px 0px rgba(131,131,131,0.28);
  .search_box {
    width: 100%;
    padding: 20px;
    .search_form {
      width: 100%;
      .select_btn, .reset_btn {
        width: 80px;
      }
    }
    .divide {
      border: 1px dashed #fafafa;
    }
  }
  .content-box {
    padding: 0 20px;
    .data_table {
      margin-top: 8px;
      .operation_btn {
        color: #0C70F8;
        cursor: pointer;
        padding: 0 5px;
        display: inline-block;
      }
    }
  }
}
</style>

