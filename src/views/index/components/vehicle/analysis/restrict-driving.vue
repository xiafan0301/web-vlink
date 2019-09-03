<template>
  <div class="restrict_driving">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle'}, {name: '车辆限行'}]"></div>
    </div>
    <div class="content_box">
      <div class="left">
        <el-form class="search_restrict_form" :model="addForm" ref="addForm">
          <el-form-item prop="startTime">
            <el-date-picker
              class="vl_date"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
              :picker-options="pickerDateTime"
              v-model="addForm.startTime"
              :time-arrow-control="true"
              type="datetime"
              placeholder="选择日期"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="endTime">
            <el-date-picker
              class="vl_date vl_date_end"
              v-model="addForm.endTime"
              :clearable="false"
              :time-arrow-control="true"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
              :picker-options="pickerDateTime"
              type="datetime" 
              placeholder="选择日期" 
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="限行区域：" label-width="85px">
            <el-radio-group v-model="selectAreaType">
              <!-- <el-row :gutter="10">
                <el-col :span="12">
                  <el-radio :label="1">列表选择</el-radio>
                </el-col>
                <el-col :span="12" >
                  <div @click="clickTab"><el-radio :label="2">地图选择</el-radio></div>
                  
                </el-col>
              </el-row> -->
               
              <el-radio :label="1">列表选择</el-radio>
              <el-radio :label="2">地图选择</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            
          </el-form-item>
          <el-form-item>
            <el-input placeholder="请输入任务名称"></el-input>
          </el-form-item>
          <el-form-item class="operation_button">
            <el-button class="reset_btn" @click="resetData">重置</el-button>
            <el-button class="select_btn" type="primary" :loading="isSearchLoading" @click="searchData">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <vue-scroll>
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
                  class="vl_date"
                  v-model="searchForm.reportTime"
                  type="datetimerange"
                  :time-arrow-control="true"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['00:00:00', '23:59:59']"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="selectDataList">查询</el-button>
                <el-button @click="resetForm('searchForm')">重置</el-button>
              </el-form-item>
            </el-form>
            <div class="divide"></div>
          </div>
          <div class="table_box">
            <el-table :data="dataList">
              <el-table-column label="序号" type="index" width="100"></el-table-column>
              <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip></el-table-column>
              <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
              <el-table-column label="分析时间范围" prop="taskWebParam" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.taskWebParam.startTime}} - {{scope.row.taskWebParam.endTime}}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column label="尾随间隔" prop="taskWebParam" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.taskWebParam.interval ? scope.row.taskWebParam.interval + '分钟' : '-'}}</span>
                </template>
              </el-table-column> -->
              <el-table-column label="状态" prop="taskStatus" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.taskStatus && scope.row.taskStatus === 1 ? '进行中' : scope.row.taskStatus === 3 ? '失败' : '已中断'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="200px">
                <template slot-scope="scope">
                  <span
                    class="operation_btn"
                    @click="skipDetailPage(scope.row)"
                  >查看</span>
                  <span
                    class="operation_btn"
                    @click="showCancelDialog(scope.row)"
                  >取消</span>
                  <span
                    class="operation_btn"
                    @click="showEndTaskDialog(scope.row)"
                  >结束</span>
                </template>
              </el-table-column>
            </el-table>
            <template v-if="pagination.total === 0">
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
        </vue-scroll>
      </div>
    </div>
  </div>
</template>
<script>
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import { formatDate, dateOrigin } from "@/utils/util.js";
const overStartTime = new Date().getTime() + 24 * 60 * 60 * 1000;
export default {
  components: { vlBreadcrumb },
  data () {
    return {
      selectAreaType: 1, // 限行区域选择方式
      isSearchLoading: false,
      addForm: {
        startTime: new Date(), // 开始时间
        endTime: dateOrigin(true, new Date(overStartTime)), // 结束时间
      },
      pickerDateTime: {
        disabledDate (time) {
          return time.getTime() < (new Date().getTime() - 24 * 3600 * 1000);
        }
      },
      searchForm: {
        reportTime: [], // 日期
        taskName: null // 任务名称
      },
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      dataList: [
        {
          taskName: '任务1',
          createTime: '2019-12-12 12:12:12',
          taskWebParam: {
            startTime: '2019-07-12 12:12:12',
            endTime: '2019-07-12 12:12:12'
          },
          taskStatus: 1
        },
        {
          taskName: '任务2',
          createTime: '2019-12-12 12:12:12',
          taskWebParam: {
            startTime: '2019-07-12 12:12:12',
            endTime: '2019-07-12 12:12:12'
          },
          taskStatus: 2
        },
        {
          taskName: '任务3',
          createTime: '2019-12-12 12:12:12',
          taskWebParam: {
            startTime: '2019-07-12 12:12:12',
            endTime: '2019-07-12 12:12:12'
          },
          taskStatus: 3
        },
        {
          taskName: '任务3',
          createTime: '2019-12-12 12:12:12',
          taskWebParam: {
            startTime: '2019-07-12 12:12:12',
            endTime: '2019-07-12 12:12:12'
          },
          taskStatus: 3
        },
        {
          taskName: '任务3',
          createTime: '2019-12-12 12:12:12',
          taskWebParam: {
            startTime: '2019-07-12 12:12:12',
            endTime: '2019-07-12 12:12:12'
          },
          taskStatus: 3
        },
        {
          taskName: '任务3',
          createTime: '2019-12-12 12:12:12',
          taskWebParam: {
            startTime: '2019-07-12 12:12:12',
            endTime: '2019-07-12 12:12:12'
          },
          taskStatus: 3
        },
        {
          taskName: '任务3',
          createTime: '2019-12-12 12:12:12',
          taskWebParam: {
            startTime: '2019-07-12 12:12:12',
            endTime: '2019-07-12 12:12:12'
          },
          taskStatus: 3
        },
        {
          taskName: '任务3',
          createTime: '2019-12-12 12:12:12',
          taskWebParam: {
            startTime: '2019-07-12 12:12:12',
            endTime: '2019-07-12 12:12:12'
          },
          taskStatus: 3
        }
      ]
    }
  },
  methods: {
    clickTab () {},
    // 重置查询条件
    resetData () {

    },
    // 左侧查询
    searchData () {},
    // 获取离线任务
    getDataList () {
      // if (!this.searchForm.reportTime) {
      //   this.searchForm.reportTime = [];
      // }
      // const params = {
      //   'where.taskName': this.searchForm.taskName,
      //   'where.taskType': 3, // 3：人员跟踪尾随分析
      //   'where.startTime': this.searchForm.reportTime[0],
      //   'where.endTime': this.searchForm.reportTime[1],
      //   'where.isFinish': this.selectIndex,   //是否完成 0:未完成(包含处理中、处理失败、处理中断) 1：已完成(处理成功)
      //   pageNum: this.pagination.pageNum,
      //   pageSize: this.pagination.pageSize,
      //   order: 'desc',
      //   orderBy: 'create_time'
      // };
      // getTaskInfosPage(params)
      //   .then(res => {
      //     if (res && res.data) {
      //       this.dataList = res.data.list;
      //       this.pagination.total = res.data.total;
      //       this.dataList.map(item => {
      //         item.taskWebParam = JSON.parse(item.taskWebParam);
      //       })
      //     }
      //   })
      //   .catch(() => {})
    },
    // 跳至限制详情页
    skipDetailPage (obj) {
      this.$router.push({name: 'vehicle_restrict_detail'});
    },
    showCancelDialog (obj) {},
    showEndTaskDialog (obj) {},
    // 查询任务列表数据
    selectDataList () {
      this.getDataList();
    },
    // 重置查询条件
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getDataList();
    },
    // 分页
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getDataList();
    }
  }
}
</script>
<style lang="scss" scoped>
.restrict_driving {
  width: 100%;
  height: 100%;
  padding-top: 50px;
  .vc_gcck_bd {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 50px; line-height: 50px;
  }
  .content_box {
    display: flex;
    width: 100%;
    height: 100%;
    .left {
      width: 272px;
      height: 100%;
      background: #fff;
      box-shadow: 5px 0 10px #E5E7E7;
      animation: fadeInLeft .4s ease-out .3s both;
      padding: 20px 15px; 
    }
    .right {
      width: calc(100% - 272px);
      height: calc(100% - 50px);
      margin: 20px;
      background: #ffffff;
      box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
      .search_box {
        margin: 20px;
        .divide {
          border: 1px dashed #fafafa;
        }
      }
      .table_box {
        margin: 0 20px;
        .add_btn {
          margin-bottom: 10px;
        }
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
  }
}
</style>
<style lang="scss">
.search_restrict_form {
  .el-form-item {
    margin-bottom: 10px;
  }
  .operation_button {
    margin-top: 20px;
  }
  .reset_btn, .select_btn {
    width: 110px;
  }
}
</style>