<template>
  <div class="gzws_container">
    <div class="pt_breadcrumb">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ name: 'portrait' }">人像检索</el-breadcrumb-item>
        <el-breadcrumb-item>跟踪尾随</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add_btn" @click="showAddTaskDialog">新建任务</el-button>
    </div>
    <div class="content_box">
      <ul class="tab-menu">
        <li
          v-for="(item,index) in tabList"
          :key="index"
          :class="{'is-active': selectIndex === item.value}"
          @click="selectTab(item.value)"
        >{{item.label}}</li>
      </ul>
      <div class="search_box">
        <el-form :inline="true" :model="searchForm" class="event_form" ref="searchForm">
          <el-form-item label="任务名称:" prop="taskName">
            <el-input
              style="width: 230px;"
              type="text"
              placeholder="请输入任务名称"
              v-model="searchForm.taskName"
            />
          </el-form-item>
          <el-form-item label="创建时间:" prop="reportTime">
            <el-date-picker
              style="width: 340px;"
              v-model="searchForm.reportTime"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button class="select_btn" @click="selectDataList">查询</el-button>
            <el-button class="reset_btn" @click="resetForm('searchForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="divide"></div>
      </div>
      <div class="table_box">
        <el-table :data="list">
          <el-table-column label="序号" type="index" width="100"></el-table-column>
          <el-table-column label="任务名称" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="创建时间" prop="date" show-overflow-tooltip></el-table-column>
          <el-table-column label="分析时间范围" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="尾随间隔" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" v-if="selectIndex === 1" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <span
                class="operation_btn"
                @click="skipResultPage(scope.row)"
                v-if="selectIndex === 0"
              >查看</span>
              <span
                class="operation_btn"
                @click="interruptDialog = true"
                v-if="selectIndex === 1 && scope.row.status"
              >中断任务</span>
              <span
                class="operation_btn"
                @click="skipDetailPage(scope.row)"
                v-if="selectIndex === 1 && !scope.row.status"
              >恢复任务</span>
              <span
                class="operation_btn"
                @click="deleteDialog = true"
                v-if="selectIndex === 1 && !scope.row.status"
              >删除任务</span>
            </template>
          </el-table-column>
        </el-table>
        <template v-if="pagination.total > 0">
          <el-pagination
            class="cum_pagination"
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.pageNum"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="pagination.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pagination.total"
          ></el-pagination>
        </template>
      </div>
    </div>
    <!--删除任务弹出框-->
    <el-dialog
      title="删除任务确认"
      :visible.sync="deleteDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
    >
      <span style="color: #999999;">任务删除，任务的数据处理进程将被清除，任务不再可以恢复</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="deleteDialog = false">确认</el-button>
      </div>
    </el-dialog>
    <!--中断任务弹出框-->
    <el-dialog
      title="中断任务确认"
      :visible.sync="interruptDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
    >
      <span style="color: #999999;">任务中断，任务的数据处理进程将中止，可以在列表中恢复任务的数据处理</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="interruptDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="interruptDialog = false">确认</el-button>
      </div>
    </el-dialog>
    <!--新建任务弹出框-->
    <el-dialog
      title="新建分析任务"
      :visible.sync="addTaskDialog"
      width="720px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp dialog_comp_add"
    >
      <div class="content_body">
        <div class="left">
          <div class="upload_box">
            <el-upload
              :disabled="isAddImgDisabled"
              ref="uploadPic"
              accept="image/*"
              :action="uploadUrl"
              :show-file-list="false"
              :limit="3"
              list-type="picture-card"
              :on-success="uploadPicSuccess"
              :on-exceed="uploadPicExceed"
              :before-upload="beforeAvatarUpload"
              >
              <i v-if="uploading" class="el-icon-loading"></i>
              <img v-else-if="curImageUrl" :src="curImageUrl">
              <i v-else class="vl_icon vl_icon_vehicle_01"></i>
              <p class="upload_text" v-show="!curImageUrl">点击上传图片</p>
            </el-upload>
            <div class="img_list">
              <div class="img_box" v-for="(item, index) in fileList" :key="index">
                <img :src="item.path ? item.path : ''" alt="">
                <div class="delete_box" v-show="item.path">
                  <i class="vl_icon vl_icon_manage_8" @click="deleteImg(index)"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <el-form class="left_form" :model="addForm" ref="addForm" :rules="rules">
            <el-form-item>
              <el-input placeholder="请输入任务名称，最多20字" maxlength="20"></el-input>
            </el-form-item>
            <!-- <el-form-item  prop="shotTime">
              <el-date-picker
                v-model="addForm.shotTime"
                type="datetime"
                :clearable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%"
                @blur="handleStartTime"
                :picker-options="pickerStart"
                placeholder="开始时间">
              </el-date-picker>
            </el-form-item> -->
            <el-form-item  prop="dateEnd">
              <el-date-picker
                v-model="addForm.dateEnd"
                style="width: 100%"
                :clearable="false"
                @blur="handleEndTime"
                :picker-options="pickerEnd"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="deviceCode">
              <el-select placeholder="请选择起点设备" style="width: 100%" v-model="addForm.deviceCode" @change="handleChangeDeviceCode">
                <el-option
                  v-for="(item, index) in deviceList"
                  :key="index"
                  :label="item.deviceName"
                  :value="item.deviceID"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="interval">
              <el-select placeholder="请选择尾随时间间隔" style="width: 100%" v-model="addForm.interval">
                <el-option
                  v-for="(item, index) in intervalList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetData('addForm')">取消</el-button>
        <el-button class="operation_btn function_btn" @click="searchData('addForm')">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Breadcrumb from '../breadcrumb.vue';
import { ajaxCtx } from '@/config/config.js';
import { checkPlateNumber } from '@/utils/validator.js';
import { getShotDevice, getTailBehindList } from '@/views/index/api/api.judge.js'
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
import { formatESDate } from '@/utils/util.js';
export default {
  components: { Breadcrumb },
  data () {
    const startTime = new Date() - 24 * 60 * 60 *1000;
    return {
      tabList: [
        {
          label: "已完成任务",
          value: 0
        },
        {
          label: "未完成任务",
          value: 1
        }
      ],
      selectIndex: 0,
      dialogImageUrl: null,
      deleteDialog: false, // 删除任务弹出框
      interruptDialog: false, // 中断任务弹出框
      addTaskDialog: false, // 新建任务弹出框
      fileList: [],
      isAddImgDisabled: false, // 图片上传禁用
      uploadUrl: ajaxCtx.base + '/new', // 图片上传地址
      deviceStartTime: null, // 起点设备抓拍时间
      pagination: { total: 20, pageSize: 10, pageNum: 1 },
      searchForm: {
        reportTime: [], // 日期
        taskName: null // 任务名称
      },
      addForm: {
        plateNo: null, // 车牌号码
        deviceCode: null, // 起点设备编号
        shotTime: new Date(startTime), // 开始时间
        dateEnd: new Date(), // 结束时间
        vehicleClass: [], // 车辆类型
        interval: 3 // 尾随间隔
      },
      intervalList: [
        { label: '1分钟', value: 1 },
        { label: '2分钟', value: 2 },
        { label: '3分钟', value: 3 },
        { label: '5分钟', value: 5 },
        { label: '10分钟', value: 10 }
      ],
      rules: {
        plateNo: [
          { validator: checkPlateNumber, trigger: 'blur' }
        ]
      },
      pickerStart: {
        // disabledDate (time) {
        //   return time.getTime() > (new Date().getTime());
        // }
      },
      pickerEnd: {
        // disabledDate (time) {
        //   return time.getTime() > (new Date().getTime());
        // }
      },
      list: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          status: true
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
          status: false
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
          status: false
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
          status: true
        }
      ], //已完成列表
      deviceList: [], // 抓拍设备列表
      vehicleTypeList: [], // 车辆类型列表
      dataList: [], // 查询的抓拍结果列表
      curImgNum: 0, // 图片数量
      curImageUrl: null,
      uploading: false
    }
  },
  created () {
    this.getVehicleTypeList();
  },
  methods: {
    //tab切换
    selectTab(val) {
      this.selectIndex = val;
    },
    // 删除图片
    deleteImg (index) {
      this.curImgNum --;
      this.fileList.splice(index, 1);
      this.curImageUrl = null;
    },
     // 上传图片
    uploadPicExceed () {
      this.$message.warning('当前限制选择 3 个文件，请删除后再上传！');
    },
    uploadPicSuccess (res) {
      this.uploading = true;
      if (res && res.data) {
        let oRes = res.data;

        if (this.curImgNum >= 3) {
          this.$message.error('最多上传3张，请先删掉再上传');
          return;
        }
        this.curImgNum ++;

        this.uploading = false;

        this.curImageUrl = oRes.fileFullPath;

        // if (oRes) {
        let x = {
          cname: oRes.fileName, // 附件名称 ,
          contentUid: this.$store.state.loginUser.uid,
          // desci: '', // 备注 ,
          filePathName: oRes.fileName, // 附件保存名称 ,
          fileType: 1, // 文件类型 ,
          imgHeight: oRes.fileHeight, // 图片高存储的单位位px ,
          imgSize: oRes.fileSize, // 图片大小存储的单位位byte ,
          imgWidth: oRes.fileWidth, //  图片宽存储的单位位px ,
          // otherFlag: '', // 其他标识 ,
          path: oRes.fileFullPath, // 附件路径 ,
          // path: oRes.path,
          thumbnailName: oRes.thumbnailFileName, // 缩略图名称 ,
          thumbnailPath: oRes.thumbnailFileFullPath // 缩略图路径 ,
          // uid: '' //  附件标识
        };
        // JtcPOSTAppendixInfo(x).then(jRes => {
        //   if (jRes) {
        //     x['uid'] = jRes.data;
        //   }
        // })
        this.fileList.push(x);
      }
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      const isLt4M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        this.$message.error('上传图片只能是 jpeg、jpg、png 格式!');
      }
      if (!isLt4M) {
        this.$message.error('上传图片大小不能超过 4MB!');
      }
      return isJPG && isLt4M;
    },
    // 获取车辆类型列表
    getVehicleTypeList () {
      const type = dataList.vehicleType;
      getDiciData(type)
        .then(res => {
          if (res) {
            this.vehicleTypeList = res.data;
          }
        })
    },
    // 车牌号码change
    handlePlateNo () {
      if (this.addForm.plateNo && this.addForm.shotTime && this.addForm.dateEnd) {
        this.getDeviceList();
      }
    },
    // 开始时间change
    handleStartTime () {
      if (this.addForm.shotTime) {
        // this.pickerEnd.disabledDate = function (time) {
        //   return time.getTime() > new Date(val).getTime() + 3 * 24 * 3600 * 1000;
        // }
        if (this.addForm.plateNo && this.addForm.dateEnd) {
          this.getDeviceList();
        }
      }
    },
    // 结束时间change
    handleEndTime () {
      if (this.addForm.dateEnd) {
        // this.pickerStart.disabledDate = function (time) {
        //   return time.getTime() > new Date(val).getTime();
        // }
        if (this.addForm.shotTime && this.addForm.plateNo) {
          this.getDeviceList();
        }
      }
    },
    // 获取抓拍设备列表
    getDeviceList () {
      this.deviceList = [];
      const shotTime = formatESDate(this.addForm.shotTime) + '-' + formatESDate(this.addForm.dateEnd);
      const params = {
        plateNo: this.addForm.plateNo,
        shotTime: shotTime
      };
      console.log('params', params)
      getShotDevice(params)
        .then(res => {
          if (res) {
            this.deviceList = res.data;
          }
        })
    },
    // 起点设备change
    handleChangeDeviceCode (obj) {
      if (obj) {
        this.deviceList.map(item => {
          if (item.deviceID === obj) {
            this.deviceStartTime = item.shotTime;
          }
        })
      }
    },
    // 跳至尾随记录页面
    skipWsReocrdPage (obj) {
      this.$router.push({name: 'gzws_detail'})
      // this.$router.push({name: 'gzws_detail', query: { 
      //   plateNo: this.addForm.plateNo,
      //   dateStart: this.deviceStartTime,
      //   dateEnd: this.addForm.dateEnd,
      //   plateNoTb: obj.plateNo,
      //   dateStartTb: obj.shotTime
      //  }});
    },
    // 重置查询条件
    resetData (form) {
      this.$refs[form].resetFields();
    },
    // 搜索数据
    searchData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (!this.addForm.deviceCode) {
            this.$message({
              type: 'warning',
              message: '请先选择起点设备',
              customClass: 'request_tip'
            });
            return;
          };
          const vehicleType = this.addForm.vehicleClass.join(':');
          const params = {
            deviceCode: this.addForm.deviceCode,
            dateStart: formatESDate(this.addForm.shotTime),
            shotTime: formatESDate(this.deviceStartTime),
            plateNo: this.addForm.plateNo,
            dateEnd: formatESDate(this.addForm.dateEnd),
            vehicleClass: vehicleType,
            interval: this.addForm.interval
          };
          getTailBehindList(params)
            .then(res => {
              if (res && res.data) {
                this.dataList = res.data;
              }
            })
        }
      });
    },
    // 跳至分析结果页面
    skipResultPage (obj) {
      this.$router.push({name: 'gzws_result'});
    },
    // 显示新建任务弹出框
    showAddTaskDialog () {
      this.addTaskDialog = true;
    },
    // 查询任务列表数据
    selectDataList () {},
    // 重置查询条件
    resetForm (form) {
      this.$refs[form].resetFields();
    },
    // 分页
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
    }
  }
}
</script>
<style lang="scss" scoped>
.gzws_container {
  height: 100%;
  .pt_breadcrumb {
    display: flex;
    justify-content: space-between;
    height: 50px; width: 100%;
    padding-left: 20px;
    align-items: center;
    border-bottom: 1px solid #f6f6f6;
    box-shadow: 0 0 5px #ddd;
    background-color: #fff;
    .add_btn {
      background-color: #0C70F8;
      color: #ffffff;
      border-radius: 4px;
      margin-right: 10px;
    }
  }
  .content_box {
    height: calc(100% - 100px);
    margin: 20px;
    background: #ffffff;
    box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
    .tab-menu {
      background-color: #fff;
      padding-top: 8px;
      overflow: hidden;
      border-bottom: 1px solid #f2f2f2;
      li {
        float: left;
        width: auto;
        font-size: 16px;
        margin: 0 20px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        color: #333;
        cursor: pointer;
      }
      .is-active {
        color: #0c70f8;
        border-bottom: 2px solid #0c70f8;
      }
    }
    .search_box {
      margin: 20px;
      .divide {
        border: 1px dashed #fafafa;
      }
    }
    .table_box {
      margin: 0 20px;
      .operation_btn {
        display: inline-block;
        padding: 0 10px;
        border-right: 1px solid #f2f2f2;
        &:last-child {
          border-right: none;
        }
      }
    }
  }
  .reset_btn {
    // width: 110px;
    background-color: #D3D3D3;
    color: #666666;
    border-radius: 4px;
    &:hover {
      background-color: #ffffff;
      color: #0C70F8;
      border-color: #0C70F8;
    }
  }
  .select_btn {
    // width: 110px;
    background-color: #0C70F8;
    color: #ffffff;
    border-radius: 4px;
  }
}
.dialog_comp_add {
  .content_body {
    display: flex;
    .left {
      border-right: 1px dashed #F2F2F2;
      .upload_box {
        padding: 15px 20px;
         .img_list {
           display: flex;
           margin-top: 10px;
           .img_box {
            width: 70px;
            height: 70px;
            background:rgba(255,255,255,1);
            border:1px dashed rgba(211,211,211,1);
            border-radius:1px;
            position: relative;
            &:hover {
              .delete_box {
                display: block;
              }
            }
            .delete_box {
              display: none;
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background-color: #000;
              opacity: 0.7;
              text-align: center;
              i {
                margin-top: 35%;
                cursor: pointer; 
              }
            }
            &:not(:last-child) {
              margin-right: 5px;
            }
            img {
              width: 100%;
              height: 100%;
            }
           }
         }
         /deep/ .el-upload {
          width: 225px;
          height: 225px;
          position: relative;
          .upload_text {
            line-height: 0;
            color: #999999;
            margin-top: -60px;
          }
          >img {
            width: 100%;
            height: 100%;
          }
          i {
            margin-top: 40px;
            margin-left: 15px;
            width: 120px;
            height: 120px;
          }
          &:hover {
            background: #2981F8;
            // i.vl_icon_control_14{
            //   background-position: -228px -570px;
            // }
            .upload_text {
              color: #ffffff;
            }
          }
        }
        &.hidden /deep/ .el-upload--picture-card {
          display: none!important;
        }
      }
    }
    .right {
      width: 100%;
      .left_form {
        width: 100%;
        padding: 50px 20px 0;
        font-size: 12px !important;
        /deep/ .el-form-item {
          margin-bottom: 20px;
        }
        .date_time {
          /deep/ .el-form-item__label {
            line-height: 20px;
            color: #999999;
          }
        }
      }

    }
  }
}
</style>