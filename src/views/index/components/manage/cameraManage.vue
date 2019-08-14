<template>
  <vue-scroll>
    <div class="camera_manage">
      <div class="search_box">
        <el-form :inline="true" :model="searchForm" class="search_form" ref="searchForm">
          <el-form-item prop="dateTime">
            <el-date-picker
              style="width: 250px"
              class="vl_date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="searchForm.dateTime"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="dutyUnitId">
            <el-select v-model="searchForm.dutyUnitId" placeholder="请选择" style="width: 250px">
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
            <el-select v-model="searchForm.type" placeholder="请选择" style="width: 250px">
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
            <el-select v-model="searchForm.deviceStatus" placeholder="请选择" style="width: 250px">
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
            <el-select v-model="searchForm.intelligentCharac" placeholder="请选择" style="width: 250px">
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
            <el-select v-model="searchForm.importantLevel" placeholder="请选择" style="width: 250px">
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
            <el-select v-model="searchForm.manufacturer" placeholder="请选择" style="width: 250px">
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
            <el-input placeholder="请输入摄像头名称/IP搜索" style="width: 250px" v-model="searchForm.keyword"></el-input>
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
          <el-button @click="showImportDialog">导入</el-button>
          <el-button @click="exportFile">导出</el-button>
        </div>
        <el-table
          class="data_table"
          :data="dataList"
          @sort-change="sortDeviceSeq"
          >
          <el-table-column
            label="摄像头名称"
            prop="deviceName"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <span>{{scope.row.deviceName ? scope.row.deviceName : '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="摄像头编号"
            prop="deviceSeq"
            width="150"
            sortable="custom"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <span>{{scope.row.deviceSeq ? scope.row.deviceSeq : '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="IP"
            prop="ipAddress"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <span>{{scope.row.ipAddress ? scope.row.ipAddress : '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            prop="typeStr"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <span>{{scope.row.typeStr ? scope.row.typeStr : '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="所属机构"
            prop="dutyUnitName"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <span>{{scope.row.dutyUnitName ? scope.row.dutyUnitName : '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="智能特性"
            prop="intelligentCharac"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <span>{{scope.row.intelligentCharac ? scope.row.intelligentCharac : '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="重要级别"
            prop="importantLevelStr"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <span>{{scope.row.importantLevelStr ? scope.row.importantLevelStr : '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="厂家"
            prop="manufacturerStr"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <span>{{scope.row.manufacturerStr ? scope.row.manufacturerStr : '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            prop="deviceStatusStr"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <span>{{scope.row.deviceStatusStr ? scope.row.deviceStatusStr : '--'}}</span>
            </template>
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
      <!--导入弹出框-->
      <el-dialog
        title="导入设备"
        :visible.sync="importDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp dialog_comp_import"
        >
        <div class="content_body">
          <p>请先下载模板文件并按要求填写相关信息，再上传进行批量新增</p>
            <ul class="upload_box">
              <li>
                <p class="header">1、请下载导入模板，填写设备信息。</p>
                <div class="main_content download_box" @click="downloadModel">
                  <i class="vl_icon_manage_17 vl_icon"></i>
                  <span>下载模板</span>
                </div>
              </li>
              <li>
                <p class="header">2、上传已填写的设备信息表。</p>
                <div class="main_content">
                  <el-upload
                    ref="deviceImport"
                    accept=".xls,.xlsx"
                    :auto-upload="false"
                    :action="importUrl"
                    :on-change="handleChange"
                    :on-success="handleSuccess"
                    :file-list="fileList"
                    :limit="1"
                    >
                    <el-button size="small" class="upload-btn" icon="vl_icon_manage_18 vl_icon">上传文件</el-button>
                  </el-upload>
                </div>
              </li>
            </ul>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="importDialog = false">取消</el-button>
          <el-button class="operation_btn function_btn" :loading="isImportLoading" @click="sureImportFile">导入</el-button>
        </div>
      </el-dialog>
      <!-- 导入完成弹框 -->
      <el-dialog
        class="dialog_comp dialog_comp_import"
        title="导入完成"
        width="392px"
        :visible.sync="importFinishDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <div class="import-box">
          <p>本次成功导入：<span style="color: #2888FF">{{successNumber}}</span>条数据</p>
          <p>本次失败导入：<span style="color: #DC4C4F">{{failNumber}}</span>条数据</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <div v-show="showFailFile" class="down-fail-btn" @click="downloadErrorFile">下载失败列表</div>
        </span>
      </el-dialog>
    </div>
  </vue-scroll>
</template>
<script>
import { autoDownloadUrl } from '@/utils/util.js';
import { getDepartmentList, vehicleExport } from '@/views/index/api/api.manage.js';
import { getDeviceList, delDevice, downloadCameraModel } from '@/views/index/api/api.base.js';
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
import { ajaxCtx } from '@/config/config.js';
export default {
  data () {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime());
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      pagination: { total: 0, pageSize: 10, pageNum: 1, order: 'desc', orderBy: 'create_time' },
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
      fileList: [],
      importUrl: ajaxCtx.base + '/device-service/import', // 导入请求地址
      successNumber: 0, // 成功导入多少条数据
      failNumber: 0, // 导入失败多少条数据
      showFailFile: false, // 是否显示错误文件
      errorFile: null, // 错误文件地址
      importFinishDialog: false, // 导入完成弹出框
      isImportLoading: false, // 导入加载中
      importDialog: false, // 导入弹出框
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
    // 监听摄像头编号的排序
    sortDeviceSeq (column) {
      if (column.order) {
        if (column.order === 'ascending') {
          this.pagination.order = 'asc';
        }
        if (column.order === 'descending') {
          this.pagination.order = 'desc';
        }
        this.pagination.orderBy = 'device_seq';
      } else {
        this.pagination.order = 'desc';
        this.pagination.orderBy = 'create_time';
      }

      this.selectDataList();
    },
    // 导出文件
    exportFile () {
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
        viewType: 2, // 设备导出
        deviceBasicParamPageDto: {
          onlineStartDate: this.searchForm.dateTime[0] && (this.searchForm.dateTime[0] + ' 00:00:00'),
          onlineEndDate: this.searchForm.dateTime[1] && (this.searchForm.dateTime[1] + ' 23:59:59'),
          dutyUnitId: dutyUnitId,
          intelligentCharac: intelligentCharac,
          deviceStatus: deviceStatus,
          importantLevel: importantLevel,
          type: type,
          isBayonet: false,
          manufacturer: manufacturer,
          keyword: this.searchForm.keyword,
          order: this.pagination.order,
          orderBy: this.pagination.orderBy
        }
      };
      vehicleExport(params)
        .then(res => {
          if (res && res.data) {
            autoDownloadUrl(res.data.fileUrl);
          }
        })
    },
    // 下载错误文件
    downloadErrorFile () {
      if (this.errorFile) {
        this.importFinishDialog = false;
        autoDownloadUrl(this.errorFile);
      }
    },
    // 显示导入弹出框
    showImportDialog () {
      this.importDialog = true;
      this.fileList = [];
    },
    handleChange (file, fileList) {
      if (file && fileList) {
        this.fileList = fileList;
      }
    },
    // 上传成功
    handleSuccess (res) {
      this.isImportLoading = false;
      if (res && res.data.code === 0) {
        this.importDialog = false;
        this.successNumber = res.data.result.successSize;
        this.failNumber = res.data.result.failSize;
        this.showFailFile = false;
        this.importFinishDialog = true;
        this.errorFile = null;

        this.selectDataList();

      } else if (res.data.code === 1) {
        this.importDialog = false;
        this.successNumber = res.data.result.successSize;
        this.failNumber = res.data.result.failSize;
        this.showFailFile = true;

        if (res.data.result.errorFileUrl) {
          this.errorFile = res.data.result.errorFileUrl;
        }
        this.importFinishDialog = true;
      }
    },
    // 导入
    sureImportFile () {
      if (this.fileList.length > 0) {
        this.isImportLoading = true;
        // this.importUrl = ajaxCtx.base + '/special-vehicle/import?groupId=' +  this.activeId;
        this.$nextTick(() => {
          this.$refs.deviceImport.submit();
        })
      } else {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info('请先选择要导入的文件');
        }
      }
    },
    // 下载模板
    downloadModel () {
      downloadCameraModel()
        .then((res, result) => {
          if (res) {
            const content = res;
            const blob = new Blob([content]);
            const fileName = '摄像头导入模板.xlsx';
            if ('download' in document.createElement('a')) { // 非IE下载
              const elink = document.createElement('a');
              elink.download = fileName;
              elink.style.display = 'none';
              elink.href = URL.createObjectURL(blob);
              document.body.appendChild(elink);
              elink.click();
              URL.revokeObjectURL(elink.href); // 释放URL 对象
              document.body.removeChild(elink);
            } else { // IE10+下载
              navigator.msSaveBlob(blob, fileName);
            }
          }
        })
    },
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
      console.log(this.searchForm.dateTime)

      const params = {
        'where.onlineStartDate': this.searchForm.dateTime[0] && (this.searchForm.dateTime[0] + ' 00:00:00'),
        'where.onlineEndDate': this.searchForm.dateTime[1] && (this.searchForm.dateTime[1] + ' 23:59:59'),
        'where.dutyUnitId': dutyUnitId,
        'where.intelligentCharac': intelligentCharac,
        'where.deviceStatus': deviceStatus,
        'where.importantLevel': importantLevel,
        'where.type': type,
        'where.manufacturer': manufacturer,
        'where.keyword': this.searchForm.keyword,
        'where.isBayonet': false, // 是否是卡口
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        order: this.pagination.order,
        orderBy: this.pagination.orderBy
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
/deep/ .el-picker-panel {
  margin-left: 300px !important;
}
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
.dialog_comp_import {
  .content_body {
    >p {
        color: #999999;
        margin-bottom: 20px;
      }
      .upload_box {
        > li {
          line-height: 40px;
          .header {
            color: #333333;
          }
          .main_content {
            width: 250px;
            margin-left: 30px;
            .upload-btn {
              color: #333333;
              border:1px solid #D3D3D3;
              display: flex;
              align-items: center;
            }
          }
          .download_box {
            cursor: pointer;
            text-align: center;
            width: 98px;
            height: 32px;
            line-height: 32px;
            color: #333333;
            border-radius:4px;
            border:1px solid #D3D3D3;
            i {
              vertical-align: middle;
            }
          }
          &:last-child {
            margin-top: 20px;
          }
        }
      }
  }
  .import-box {
    text-align: center;
    // color: $dialog-color5;
    p {
      margin-bottom: 10px;
    }
  }
  .down-fail-btn {
    cursor: pointer;
    margin: 0 auto;
    background-color: #0C70F8;
    color: #fff;
    width: 110px;
    height: 32px;
    line-height: 32px;
    border-radius: 5px;
  }
}
</style>

