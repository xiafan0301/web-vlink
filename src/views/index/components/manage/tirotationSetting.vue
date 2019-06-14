<template>
  <vue-scroll>
    <div class="tirotation_setting">
      <div class="search_box">
        <el-form :inline="true" :model="searchForm" class="search_form" ref="searchForm">
          <el-form-item prop="dateTime">
            <el-date-picker
              style="width: 260px;"
              v-model="searchForm.dateTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="status">
            <el-select v-model="searchForm.status" style="width: 240px;" placeholder="轮巡状态">
              <el-option value="全部状态"></el-option>
              <el-option label="待开始" :value="1"></el-option>
              <el-option label="进行中" :value="2"></el-option>
              <el-option label="已结束" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="select_btn" @click="searchData">查询</el-button>
            <el-button class="reset_btn" @click="resetForm('searchForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="divide"></div>
      </div>
      <div class="table_box">
        <div class="add_ratation_btn" @click="skipAddRatotionPage">
          <span>+</span>
          <span>新增轮巡</span>
        </div>
        <el-table
          class="ratation_table"
          :data="dataList"
          >
          <el-table-column
            fixed="left"
            label="预案编号"
            prop="roundNo"
            :show-overflow-tooltip='true'
            >
          </el-table-column>
          <el-table-column
            label="预案名称"
            prop="roundName"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="开始时间"
            prop="startTime"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <span>{{scope.row.startTime | fmTimestamp}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="结束时间"
            prop="endTime"
            show-overflow-tooltip
            >
            <template slot-scope="scope">
              <span>{{scope.row.endTime | fmTimestamp}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="轮巡状态"
            prop="roundStatus"
            >
            <template slot-scope="scope">
              <span class="event_status" :class="[scope.row.roundStatus === 1 ? 'untreated_event' 
                : scope.row.roundStatus === 2 ? 'treating_event' : 'end_event']">
                {{scope.row.roundStatus === 1 ? '待开始' : scope.row.roundStatus === 2 ? '进行中' : '已结束'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="轮巡间隔(秒)"
            prop="interval"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="画面数"
            prop="frameNumber"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="轮巡设备"
            prop="deviceNumber"
            class-name="device_num"
            :show-overflow-tooltip='true'
          >
          <template slot-scope="scope">
            <template v-if="scope.row.deviceNumber > 0">
              <span class="active_span" :style="[scope.row.deviceNumber && scope.row.deviceNumber > 0 ? styleObj : '']" @click="handleSelectDevice(scope.row)">{{scope.row.deviceNumber}}</span>
            </template>
            <template v-else>
              <span>{{scope.row.deviceNumber}}</span>
            </template>
          </template>
          </el-table-column>
          <el-table-column
            label="更新时间"
            prop="updateTime"
            show-overflow-tooltip
            align="center"
            >
            <template slot-scope="scope">
              <span>{{scope.row.updateTime | fmTimestamp}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
            <template slot-scope="scope">
              <template v-if="scope.row.roundStatus === 2">
                <span class="operation_btn" @click="skipVideoPatrolPage">查看</span>
                <span style="color: #f2f2f2">|</span>
                <span class="operation_btn" @click="showCloseDialog(scope.row)">关闭</span>
              </template>
              <template v-if="scope.row.roundStatus === 1">
                <span class="operation_btn" @click="skipAddRatotionPage(scope.row)">编辑</span>
                <span style="color: #f2f2f2">|</span>
                <span class="operation_btn" @click="showDeleteDialog(scope.row)">删除</span>
              </template>
              <template v-if="scope.row.roundStatus === 3">
                <span class="operation_btn" @click="showDeleteDialog(scope.row)">删除</span>
              </template>
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
      <!--关闭轮巡弹出框-->
      <el-dialog
        title="是否关闭该轮巡任务?"
        :visible.sync="closeRatationDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
        >
        <span style="color: #999999;">关闭后不可恢复。</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeRatationDialog = false">取消</el-button>
          <el-button class="operation_btn function_btn" @click="sureCloseRatation">确认</el-button>
        </div>
      </el-dialog>
      <!--删除弹出框-->
      <el-dialog
        title="是否确定删除该轮巡任务?"
        :visible.sync="delRotationDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
        >
        <span style="color: #999999;">删除后数据不可恢复。</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="delRotationDialog = false">取消</el-button>
          <el-button class="operation_btn function_btn" @click="delRotationInfo">确认</el-button>
        </div>
      </el-dialog>
      <!--查看轮巡设备出框-->
      <el-dialog
        title="轮巡设备"
        :visible.sync="selectDeviceDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_device_comp dialog_comp"
        >
        <div class="content_body">
          <vue-scroll>
            <ul class="temp_detail_info">
              <li v-for="(item, index) in allDeviceList" :key="'item' + index">
                <div style="display: flex; padding: 0 10px;">
                  <div class="parent_temp_li" :class="{'temp_active': item.isOpenArrow === true}" @click="openArrow(index)">
                    <i :class="[item.isOpenArrow === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                    <span>{{item.areaName}}</span>
                  </div>
                </div>
                <div class="child_temp" v-show="item.isOpenArrow === true">
                  <div class="temp_tab">
                    <span :class="[item.isSXT ? 'active_span' : '']" @click="changeLDeviceType(index, true)">摄像头</span>
                    <span :class="[!item.isSXT ? 'active_span' : '']" @click="changeLDeviceType(index, false)">卡口</span>
                  </div>
                  <template v-if="item.deviceList">
                    <ul class="child_temp_detail" v-show="item.isSXT">
                      <li v-for="(itm, idx) in item.deviceList" :key="'itm' + idx">
                        <el-checkbox v-model="itm.isChildChecked" @change="handleLeftChildChecked(index, idx, itm.isChildChecked, item.isSXT)"></el-checkbox>
                        <span>{{itm.deviceName}}</span>
                      </li>
                    </ul>
                  </template>
                  <template v-if="item.bayonetList">
                    <ul class="child_temp_detail" v-show="!item.isSXT">
                      <li v-for="(itm, idx) in item.bayonetList" :key="'itm' + idx">
                        <el-checkbox v-model="itm.isChildChecked" @change="handleLeftChildChecked(index, idx, itm.isChildChecked, item.isSXT)"></el-checkbox>
                        <span>{{itm.deviceName}}</span>
                      </li>
                    </ul>
                  </template>
                </div>
              </li>
            </ul>
          </vue-scroll>
        </div>
      </el-dialog>
    </div>
  </vue-scroll>
</template>
<script>
import { formatDate } from '@/utils/util.js';
import { apiVideoRoundList, apiDelVideoRoundList, closeVideoRound, getVideoRoundDetail } from '@/views/index/api/api.video.js';
export default {
  data () {
    return {
      styleObj: {
        'color': '#0C70F8',
        'cursor': 'pointer'
      },
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      searchForm: {
        dateTime: [],
        status: '全部状态'
      },
      dataList: [],
      closeRatationDialog: false, // 关闭轮巡弹出框
      delRotationDialog: false, // 删除轮巡弹出框
      deleteId: null, // 要删除--关闭的轮巡id
      allDeviceList: [],
      selectDeviceDialog: false, // 查看轮巡设备弹出框
    }
  },
  mounted () {
    this.getOneMonth();
    this.getList();
  },
  methods: {
    // 获取轮巡列表
    getList () {
      let status;
      if (this.searchForm.status === '全部状态') {
        status = null;
      } else {
        status = this.searchForm.status;
      }
      const params = {
        'where.startTime': this.searchForm.dateTime[0] + ' 00:00:00',
        'where.endTime': this.searchForm.dateTime[1] + ' 23:59:59',
        'where.status': status,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        orderBy: 'create_time',
        order: 'desc'
      };
      apiVideoRoundList(params)
        .then(res => {
          if (res) {
            this.dataList = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    // 根据条件搜索
    searchData () {
      this.getList();
    },
    // 重置搜索条件
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getOneMonth();
      this.getList();
    },
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getList();
    },
    // 跳至视频轮巡页面---查看
    skipVideoPatrolPage () {
      this.$router.push({name: 'video_patrol'});
    },
    // 跳至新增轮巡页面
    skipAddRatotionPage (obj) {
      let patrolId;
      if (obj) {
        patrolId = obj.id;
      }
      this.$router.push({name: 'add_patrol', query: { id: patrolId}});
    },
    // 显示关闭轮巡弹出框
    showCloseDialog (obj) {
      this.deleteId = obj.id;
      this.closeRatationDialog = true;
    },
    // 关闭轮巡
    sureCloseRatation () {
      const params = {
        id: this.deleteId,
        status: 3 // 0-待开始 1-进行中 2-已结束
      }
      closeVideoRound(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '关闭成功',
              customClass: 'request_tip'
            });
            this.closeRatationDialog = false;
            this.getList();
          }
        })
        .catch(() => {})
    },
    // 显示删除轮巡弹出框
    showDeleteDialog (obj) {
      this.deleteId = obj.id;
      this.delRotationDialog = true;
    },
    // 删除轮巡数据
    delRotationInfo () {
      if (this.deleteId) {
        const params = {
          id: this.deleteId
        }
        apiDelVideoRoundList(params)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              });
              this.delRotationDialog = false;
              this.getList();
            }
          })
          .catch(() => {})
      }
    },
    getOneMonth () { // 设置默认一个月
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      const startDate = formatDate(start, 'yyyy-MM-dd');
      const endDate = formatDate(end, 'yyyy-MM-dd');
      this.searchForm.dateTime.push(startDate);
      this.searchForm.dateTime.push(endDate);
    },
    // 查看所有的轮巡设备
    handleSelectDevice (obj) {
      if (obj.id) {
        getVideoRoundDetail(obj.id)
          .then(res => {
            if (res.data) {
              this.allDeviceList = res.data.areaGroupList;
              this.selectDeviceDialog = true;
              this.allDeviceList.map(item => {
                item.isOpenArrow = true;
                item.isSXT = true; // 默认选中摄像头

                item.deviceList && item.deviceList.map(itm => {
                  itm.isChildChecked = false; // 子级是否选中
                });
                item.bayonetList && item.bayonetList.map(itm => {
                  itm.isChildChecked = false; // 子级是否选中
                });
              });
            }
          })
          .catch(() => {})
      }
    },
    // 展开箭头
    openArrow (index) {
      this.allDeviceList[index].isOpenArrow = !this.allDeviceList[index].isOpenArrow;
      this.allDeviceList = JSON.parse(JSON.stringify(this.allDeviceList));
    },
    changeLDeviceType (index, val) {
      this.allDeviceList[index].isSXT = val;
      this.allDeviceList = JSON.parse(JSON.stringify(this.allDeviceList));
    }
  }
}
</script>
<style lang="scss" scoped>
.tirotation_setting {
  width: 100%;
  background-color: #ffffff;
  padding: 20px;
  .search_box {
    width: 100%;
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
  .table_box {
    padding: 10px 0;
    .add_ratation_btn {
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
    .ratation_table {
      margin-top: 8px;
      /deep/.el-table__row {
        .device_num {
          // color: #0C70F8;
          .active_span:hover {
            text-decoration: underline;
          }
        }
      }
      .event_status {
        &:before {
          content: '.';
          font-size: 30px;
          position: absolute;
          left: 0;
          top: 3px;
        }
      }
      .untreated_event {
        &:before {
          color: #0C70F8;
        }
      }
      .treating_event {
        &:before {
          color: #63C751;
        }
      }
      .end_event {
        &:before {
          color: #B8B8B8;
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
  .dialog_device_comp {
    .content_body {
      height: 500px;
      .temp_detail_info {
        // height: 20%;
        > li {
          width: auto;
          cursor: pointer;
          font-size: 14px;
          line-height: 26px;
          color: #333333;
          .parent_temp_li {
            width: 100%;
            // padding: 0 10px;
            >span {
              margin-left: 5px;
            }
            .operation_btn {
              display: none;
              float: right;
              margin: 5px 5px 0;
            }
            .del_btn {
              &:hover {
                background-position: -694px -350px !important;
              }
            }
            .edit_btn {
              &:hover {
                background-position: -584px -350px !important;
              }
            }
            &.temp_active {
              &:hover {
                background-color: #E0F2FF;
                .operation_btn {
                  display: block;
                }
              }
              i, span {
                color: #0C70F8;
              }
            }
          }
          .child_temp {
            width: 100%;
            .temp_tab {
              color: #666666;
              margin: 10px 0 10px 20px;
              font-size: 12px;
              width: 220px;
              height: 26px;
              border: 1px solid #D3D3D3;
              border-radius:4px;
              > span {
                width: 50%;
                text-align: center;
                display: inline-block;
                line-height: 26px;
                height: 100%;
                &.active_span {
                  color: #0C70F8;
                  background-color: #E0F2FF;
                }
              }
              span:first-child {
                border-right: 1px solid #D3D3D3;
              }
            }
            .child_temp_detail {
              padding-left: 30px;
              padding-right: 10px;
              >li {
                padding-bottom: 10px;
                font-size: 14px;
                color: #666666;
                display: flex;
                align-items: center;
                /deep/ .el-checkbox {
                  margin-right: 7px;
                }
                >span {
                  margin: 0 80px 0 0;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

