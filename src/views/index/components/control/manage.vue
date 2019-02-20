<template>
  <div>
    <div class="control_manage" v-if="pageType === 1">
      <!-- 顶部搜索栏 -->
      <div class="control_manage_box">
        <div class="search_box">
          <el-form :inline="true" :model="manageForm" class="manage_form">
            <el-form-item>
              <el-select v-model="manageForm.type" placeholder="布控类型">
                <el-option label="全部" :value="null"></el-option>
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="manageForm.state" placeholder="布控状态">
                <el-option label="全部" :value="null"></el-option>
                <el-option
                  v-for="item in stateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="manageForm.rank" placeholder="告警级别">
                <el-option label="全部" :value="null"></el-option>
                <el-option
                  v-for="item in rankList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                placeholder="创建时间"
                v-model="manageForm.time"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-input v-model="manageForm.controlObj" placeholder="请输入布控对象搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="manageForm.facilityName" placeholder="请输入设备名称搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="select_btn" type="primary">查询</el-button>
              <el-button class="reset_btn" type="primary" plain>重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table_box">
          <el-table
            :data="manageList"
            >
            <el-table-column
              fixed
              label="布控编号"
              prop="eventCode"
              :show-overflow-tooltip='true'
              >
            </el-table-column>
            <el-table-column
              label="布控名称"
              prop="eventType"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="目标数量"
              prop="reportUser"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="布控日期"
              prop="idCard"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="布控时间"
              prop="reportTime"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="布控状态"
              prop="state"
              show-overflow-tooltip
              >
              <template slot-scope="scope">
                <span :class="['manage_state', {'blue': scope.row.state === '0', 'green': scope.row.state === '1', 'gray': scope.row.state === '2' }]"></span>
                {{scope.row.state === '0' ? '待开始' : scope.row.state === '1' ? '进行中' : scope.row.state === '2' ? '已结束' : ''}}
              </template>
            </el-table-column>
            <el-table-column
              label="关联事件编号"
              prop="eventAddress"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="告警级别"
              prop="eventAddress"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="最近更新"
              prop="eventAddress"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column label="操作" width="140">
              <template slot-scope="scope">
                <span class="operation_btn" @click="skipIsDetail(scope.row.state)">查看</span>
                <!-- 待开始 -->
                <template v-if="scope.row.state === '0'">
                  <span class="operation_wire">|</span>
                  <span class="operation_btn">编辑</span>
                  <span class="operation_wire">|</span>
                  <span class="operation_btn" @click="delManageDialog = true">删除</span>
                </template>
                <!-- 进行中 -->
                <template v-if="scope.row.state === '1'">
                  <span class="operation_wire">|</span>
                  <span class="operation_btn" @click="stopManageDialog = true">终止</span>
                </template>
                <!-- 已结束 -->
                <template v-if="scope.row.state === '2'">
                  <span class="operation_wire">|</span>
                  <span class="operation_btn">复用</span>
                  <span class="operation_wire">|</span>
                  <span class="operation_btn" @click="delManageDialog = true">删除</span>
                </template>
              </template>
            
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>
      <div class="del_manage_dialog">
        <el-dialog
          :visible.sync="delManageDialog"
          :close-on-click-modal="false"
          width="482px"
          top="40vh">
          <h4>是否确定删除本次布控任务？</h4>
          <p>删除后该组将找不到。</p>
          <div slot="footer">
            <el-button @click="delManageDialog = false">取消</el-button>
            <el-button :loading="loadingBtn" type="primary">确认</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="stop_manage_dialog">
        <el-dialog
          :visible.sync="stopManageDialog"
          :close-on-click-modal="false"
          width="482px"
          title="终止布控"
          top="40vh">
          <el-input
            placeholder="请补充提前结束布控的原因"
            type="textarea"
            :rows="4"
            v-model="stopReason">
          </el-input>
          <div slot="footer">
            <el-button @click="stopManageDialog = false">确定终止</el-button>
            <el-button :loading="loadingBtn" type="primary">暂不终止</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div v-else is="manageDetail" :state="state" @changePageType="changePageType"></div>
  </div>
</template>
<script>
import manageDetail from './manageDetail.vue';
export default {
  components: {manageDetail},
  data () {
    return {
      pageType: 1,//页面类型：1-列表页，2-详情页
      state: null,//布控详情状态，0-待开始 1-进行中 2-                                                            
      // 顶部搜索参数
      manageForm: {
        type: null,
        state: null,
        rank: null,
        time: null,
        controlObj: null,
        facilityName: null
      },
      stateList: [
        {label: '待开始', value: '0'},
        {label: '进行中', value: '1'},
        {label: '已结束', value: '2'}
      ],
      typeList: [
        {label: '全部', value: 0},
        {label: '球机', value: 1},
        {label: '枪机', value: 2}
      ],
      rankList: [
        {label: '全部', value: 0},
        {label: '一级', value: 1},
        {label: '二级', value: 2},
        {label: '三级', value: 3},
        {label: '四级', value: 4},
        {label: '五级', value: 5}
      ],
      // 布控管理列表数据
      manageList: [
        {state: '0'},
        {state: '1'},
        {state: '2'}
      ],
      // 翻页数据
      currentPage: 1,
      pageSzie: 10,
      pageNum: 1,
      // 弹窗参数
      delManageDialog: false,
      stopManageDialog: false,
      loadingBtn: false, // 加载状态
      stopReason: null // 终止原因
    }
  },
  methods: {
    handleSizeChange () {

    },
    handleCurrentChange () {

    },
    // 跳转至布控详情
    skipIsDetail (state) {
      // this.$router.push({name: 'control_manage_detail', query: {state: state}});
      this.pageType = 2;
      this.state = state;
    },
    // 跳转至列表
    changePageType (pageType) {
      this.pageType = pageType;
    }
  }
}
</script>
<style lang="scss" scoped>
.control_manage{
  width: 100%;
  height: 100%;
  padding: 20px;
  .control_manage_box{
    width: 100%;
    height: 100%;
    padding: 20px;
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    background: #fff;
    .table_box{
      .manage_state{
        display: inline-block;
        width:6px;
        height:6px;
        border-radius: 50%;
        margin-bottom: 2px;
        &.green{
          background: #4FCB61;
        }
        &.blue{
          background: #0C70F8;
        }
        &.gray{
          background: #A9A9A9;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.control_manage{
  .manage_form .el-input__inner{
    width: 380px;
  }
  .del_manage_dialog{
    h3{
      font-size: 16px;
      color: #333333;
    }
    p{
      line-height: 30px;
      color: #999999;
    }
  }
}
</style>
