<template>
  <div class="restrict_detail">
    <div class="vc_gcck_bd">
      <div is="vlBreadcrumb" :breadcrumbData="[
      {name: '车辆侦查', routerName: 'vehicle'}, 
      {name: '车辆限行', routerName: 'vehicle_restrict_driving'},
      {name: '限行详情'}]"></div>
    </div>
    <div class="content_box">
      <div class="left">
        <vue-scroll>
          <ul class="result_ul">
            <li class="person_list">
              <span>任务名称：</span>
              <p>我创建的任务1</p>
            </li>
            <li class="person_list">
              <span>任务状态：</span>
              <p>已结束</p>
            </li>
            <li>
              <span>分析时间：</span>
              <span>2019-06-30 12:12:12</span>
            </li>
            <li>
              <span>限行车牌尾号：</span>
              <span>1、3、5、7、9</span>
            </li>
            <li>
              <span>限行车辆类型：</span>
              <span>无</span>
            </li>
            <li>
              <span>所选区域设备：</span>
              <span>摄像头名称1、摄像头名称1、摄像头名称1、摄像头名称1、摄像头名称1、摄像头名称1</span>
            </li>
          </ul>
        </vue-scroll>
      </div>
      <div class="right">
        <vue-scroll>
          <div class="table_box">
            <el-table :data="dataList">
              <el-table-column label="序号" type="index" width="100"></el-table-column>
              <el-table-column label="车牌号" prop="taskName" show-overflow-tooltip></el-table-column>
              <el-table-column label="车辆颜色" prop="createTime" show-overflow-tooltip></el-table-column>
              <el-table-column label="车辆类型" prop="taskWebParam" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.taskWebParam.startTime}} - {{scope.row.taskWebParam.endTime}}</span>
                </template>
              </el-table-column>
              <el-table-column label="抓拍次数" prop="taskStatus" show-overflow-tooltip>
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
export default {
  components: { vlBreadcrumb },
  data () {
    return {
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
    // 跳至抓拍详情页面
    skipDetailPage () {
      this.$router.push({name: 'vehicle_restrict_snap_detail'});
    },
    handleCurrentChange () {}
  }
}
</script>
<style lang="scss" scoped>
.restrict_detail {
  width: 100%;
  height: 100%;
  .vc_gcck_bd {
    position: absolute; top: 0; left: 0;
    width: 100%; height: 50px; line-height: 50px;
  }
  .content_box {
    width: 100%;
    height: 100%;
    padding-top: 50px;
    display: flex;
    .left {
      width: 272px;
      height: 100%;
      background-color: #ffffff;
      box-shadow: 2px 3px 10px 0px rgba(131,131,131,0.28);
      .result_ul {
        width: 100%;
        margin-top: 10px;
        padding-left: 20px;
        padding-right: 10px;
        >li {
          width: 100%;
          line-height: 30px;
          display: flex;
          flex-wrap: wrap;
          span:first-child {
            color: #666666;
          }
          span:last-child {
            color: #222222;
          }
        }
      }
    }
    .right {
      width: calc(100% - 272px);
      height: calc(100% - 50px);
      margin: 20px;
      background: #ffffff;
      box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
      .table_box {
        margin: 20px;
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