<template>
  <div style="height: 100%;position: relative;">
    <div class="control_manage" v-if="pageType === 1">
      <!-- 顶部搜索栏 -->
      <div class="control_manage_box">
        <div class="search_box">
          <el-form :inline="true" ref="manageForm" :model="manageForm" class="manage_form">
            <el-form-item prop="type">
              <el-select v-model="manageForm.type" placeholder="布控类型">
                <el-option label="全部类型" :value="null"></el-option>
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="state">
              <el-select v-model="manageForm.state" placeholder="布控状态">
                <el-option label="全部状态" :value="null"></el-option>
                <el-option
                  v-for="item in stateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="alarmId">
              <el-select v-model="manageForm.alarmId" placeholder="告警级别">
                <el-option label="全部告警等级" :value="null"></el-option>
                <el-option
                  v-for="item in alarmLevelList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="time">
              <el-date-picker
                placeholder="创建时间"
                v-model="manageForm.time"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="controlObj">
              <el-select
                @clear="controlObjList = []"
                v-model="manageForm.controlObj"
                filterable
                remote
                clearable
                value-key="value"
                placeholder="请输入对象搜索"
                :remote-method="getControlObject"
                :loading="loading">
                <el-option
                  v-for="item in controlObjList"
                  :key="item.value"
                  :label="item.label"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="deviceId">
              <el-select
                @clear="facilityNameList = []"
                v-model="manageForm.deviceId"
                filterable
                remote
                value-key="value"
                clearable
                placeholder="请输入设备名搜索"
                :remote-method="getControlDevice"
                :loading="loading">
                <el-option
                  v-for="item in facilityNameList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="select_btn" @click="getControlList">查询</el-button>
              <el-button class="reset_btn" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table_box">
          <el-table
            v-loading="loading"
            :data="manageList.list"
            >
            <el-table-column
              fixed
              label="布控编号"
              prop="surveillanceNo"
              :show-overflow-tooltip='true'
              >
            </el-table-column>
            <el-table-column
              label="布控名称"
              prop="surveillanceName"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="目标数量"
              prop="num"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="布控日期"
              :show-overflow-tooltip="true"
              >
              <template slot-scope="scope">
                <template v-if="scope.row.surveillanceType === 1">
                  {{scope.row.surveillanceDateStart}}至{{scope.row.surveillanceDateEnd}}
                </template>
                <template v-else>
                  --
                </template>
              </template>
            </el-table-column>
            <el-table-column
              label="布控时间"
              prop="time"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="布控状态"
              show-overflow-tooltip
              >
              <template slot-scope="scope">
                <span :class="['manage_state', {'blue': scope.row.surveillanceStatus === '待开始', 'green': scope.row.surveillanceStatus === '进行中', 'gray': scope.row.surveillanceStatus === '已结束' }]"></span>
                {{scope.row.surveillanceStatus}}
              </template>
            </el-table-column>
            <el-table-column
              label="关联事件编号"
              prop="eventCode"
              show-overflow-tooltip
              min-width="100px"
              >
              <template slot-scope="scope">
                {{scope.row.eventCode ? scope.row.eventCode : '--'}}
              </template>
            </el-table-column>
            <el-table-column
              label="告警级别"
              prop="alarmLevel"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="最近更新"
              prop="updateTime"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column label="操作" width="140">
              <template slot-scope="scope">
                <span class="operation_btn" @click="skipIsDetail(scope.row.uid)">查看</span>
                <!-- 待开始 -->
                <template v-if="scope.row.surveillanceStatus === '待开始'">
                  <span class="operation_wire">|</span>
                  <span class="operation_btn" @click="skipIsEditor(scope.row.uid)">编辑</span>
                  <span class="operation_wire">|</span>
                  <span class="operation_btn" @click="showDialog('delDialog', scope.row.uid)">删除</span>
                </template>
                <!-- 进行中 -->
                <template v-if="scope.row.surveillanceStatus === '进行中'">
                  <span class="operation_wire">|</span>
                  <span class="operation_btn" @click="showDialog('stopDialog', scope.row.uid)">终止</span>
                </template>
                <!-- 已结束 -->
                <template v-if="scope.row.surveillanceStatus === '已结束'">
                  <span class="operation_wire">|</span>
                  <span class="operation_btn" @click="skipIsCreate(scope.row.uid)">复用</span>
                  <span class="operation_wire">|</span>
                  <span class="operation_btn" @click="showDialog('delDialog', scope.row.uid)">删除</span>
                </template>
              </template>
            </el-table-column>
            <div class="not_content" slot="empty">
              <img src="../../../../assets/img/not-content.png" alt="">
              <p>暂无相关数据</p>
            </div>
          </el-table>
        </div>
        <el-pagination
          class="cum_pagination"
          v-if="manageList && manageList.list && manageList.list.length > 0"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="manageList.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="manageList.total">
        </el-pagination>
      </div>
      <div is="delDialog" ref="delDialog" :controlId="controlId" @getControlList="getControlList"></div>
      <div is="stopDialog" ref="stopDialog" :controlId="controlId" @getControlList="getControlList"></div>
    </div>
    <div v-if="pageType === 2" is="manageDetail" @changePageType="changePageType" :controlId="controlId" @getControlList="getControlList"></div>
    <div v-if="pageType === 3" is="create" @changePageType="changePageType" :createType="2" :controlId="controlId" @getControlList="getControlList"></div>
  </div>
</template>
<script>
import manageDetail from './components/manageDetail.vue';
import create from './create.vue';
import delDialog from './components/delDialog.vue';
import stopDialog from './components/stopDialog.vue';
import {getControlList, getControlObject, getControlDevice} from '@/views/index/api/api.control.js';
import {dataList} from '@/utils/data.js';
export default {
  components: {manageDetail, create, delDialog, stopDialog},
  data () {
    return {
      pageType: 1,//页面类型：1-列表页，2-详情页，3-修改页
      // state: null,//布控详情状态，0-待开始 1-进行中 2-已结束                                                           
      // 顶部搜索参数
      manageForm: {
        type: null,
        state: null,
        alarmId: null,
        time: null,
        controlObj: null,
        deviceId: null
      },
      lastManageForm: {
        type: null,
        state: null,
        alarmId: null,
        time: null,
        controlObj: null,
        deviceId: null
      },//用来记录之前的搜索参数，对比是否需要置为第一页
      loading: false,
      controlObjList: [],//布控对象列表
      facilityNameList: [],//设备列表
      stateList: [
        {label: '待开始', value: 2},
        {label: '进行中', value: 1},
        {label: '已结束', value: 3}
      ],
      typeList: [
        {label: '短期布控', value: 1},
        {label: '长期布控', value: 2}
      ],
      alarmLevelList: this.dicFormater(dataList.alarmLevel)[0].dictList.map(m => {
        return {
          value: parseInt(m.enumField),
          label: m.enumValue
        }
      }),
      // 布控管理列表数据
      manageList: [],
      // 翻页数据
      currentPage: 1,
      pageSize: 10,
      pageNum: 1,
      controlId: null,//布控id
    }
  },
  created () {
    this.getControlList();
    const data = this.$route.query;
    // 外部跳转到详情页
    if (data.pageType && data.controlId) {
      this.$nextTick(() => {
        this.pageType = parseInt(data.pageType);
        this.controlId = data.controlId;
      })
    }
    // 外部跳转到列表页
    if (data.deviceId && data.state) {
      this.$nextTick(() => {
        this.getControlDevice();
        this.manageForm.state = parseInt(data.state);
        this.manageForm.deviceId = data.deviceId;
        this.getControlList();
      })
    }
  },
  methods: {
    handleCurrentChange (page) {
      this.pageNum = page;
      this.currentPage = page;
      this.getControlList();
    },
    // 显示弹出框
    showDialog (formName, uid) {
      if (this.$refs[formName]) {
        this.$refs[formName].reset();
      }
      this.controlId = uid;
    },
    // 跳转至布控详情
    skipIsDetail (uid) {
      this.controlId = uid;
      this.pageType = 2;
    },
    // 跳转至布控编辑页
    skipIsEditor (uid) {
      this.pageType = 3;
      this.controlId = uid;
    },
    // 跳转至列表
    changePageType (pageType) {
      this.pageType = pageType;
    },
    // 跳转至新建布控页-复用
    skipIsCreate (uid) {
      this.$router.push({ name: 'control_create', query: {controlId: uid, createType: 3} });
    },
    resetForm () {
      for (let key in this.manageForm) {
        this.manageForm[key] = null;
      }
      this.controlObjList = [];
      this.facilityNameList = [];
      this.getControlList();
    },
    // 获取所有布控对象
    getControlObject (query) {
      const _query = this.Trim(query, 'g');
      if (_query) {
        const params = {
          name: query
        }
        getControlObject(params).then(res => {
          if (res && res.data) {
            this.controlObjList = res.data.map(m => {
              return {
                value: m.objId,
                label: m.name,
                type: m.objType
              }
            });
          }
        })
      }
    },
    // 获取所有布控设备
    getControlDevice (query) {
      const _query = this.Trim(query, 'g');
      if (_query) {
        const params = {
          name: query
        }
        getControlDevice(params).then(res => {
          if (res && res.data) {
            this.facilityNameList = res.data.map(m => {
              return {
                value: m.uid,
                label: m.name
              }
            });
          }
        })
      }
    },
    // 获取布控列表
    getControlList () {
      console.log(11111)
      this.pageType = 1;//在布控详情页里删除布控，需要跳转到布控列表页
      // 筛选参数有变化时，当前置为第一页
      const arr = Object.values(this.manageForm);
      const lastArr = Object.values(this.lastManageForm);
      let isReset = false;
      for (let i = 0; i < arr.length ; i++) {
        if (arr[i] !== lastArr[i]) {
          isReset = true;
          break;
        }
      }
      if (isReset) {
        this.pageNum = 1;
        this.currentPage = 1;
      }
      this.lastManageForm = Object.assign({}, this.manageForm);
      const params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        orderBy: null,
        order: null,
        'where.surveillanceType': this.manageForm.type,//布控类型
        'where.status': this.manageForm.state,//布控状态
        'where.level': this.manageForm.alarmId,//告警级别
        'where.dateStart': this.manageForm.time && this.manageForm.time[0],//布控开始时间
        'where.dateEnd': this.manageForm.time && this.manageForm.time[1],//布控结束时间
        'where.surveillanceObjectId': this.manageForm.controlObj && this.manageForm.controlObj.value,//布控对象id
        'where.objType': this.manageForm.controlObj && this.manageForm.controlObj.type,//布控对象类型【当布控对象id传了则必传】 1人像 2车辆
        'where.deviceId': this.manageForm.deviceId//布控设备id
      }
      this.loading = true;
      getControlList(params).then(res => {
        if (res && res.data) {
          this.manageList = res.data;
        }
      }).finally(() => {
        this.loading = false;
      })
    },
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
  .manage_form .el-form-item{
    width: 24%;
    .el-form-item__content{
      width: 100%;
      .el-select{
        width: 100%;
      }
      .el-date-editor{
        width: 100%;
      }
    }
  }
}
</style>
