<template>
  <div class="bkclcc_container">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{name: 'vehicle'}">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>布控车辆出城统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="con_box">
      <div class="con_left">
        <div class="left_start">
          <span>开始</span>
          <el-date-picker
            v-model="queryForm.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始时间">
          </el-date-picker>
        </div>
        <div class="left_end">
          <span>结束</span>
          <el-date-picker
            :picker-options="pickerOptions1"
            v-model="queryForm.endTime"
            type="date"
            @focus="getEndTime"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间">
          </el-date-picker>
        </div>
        <el-select
          style="width: 100%;"
          @clear="listBayonet = []"
          v-model="queryForm.bayonet"
          filterable
          remote
          value-key="value"
          clearable
          placeholder="请输入关键字搜索选择卡口"
          :remote-method="getListBayonet"
          :loading="loading">
          <el-option
            v-for="item in listBayonet"
            :key="item.value"
            :label="item.label"
            :value="item">
          </el-option>
        </el-select>
        <div class="left_radio"><span>车牌：</span><el-radio v-model="queryForm.radio" :label="true">非</el-radio></div>
        <div class="left_province">
          <el-select v-model="queryForm.province">
            <el-option
              v-for="item in provinceList"
              :key="item.value"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
          <el-input v-model="queryForm.provinceName"></el-input>
        </div>
        <div class="left_btn">
          <el-button class="reset_btn" @click="resetQueryForm">重置</el-button>
          <el-button class="select_btn" @click="getControlCarSta" :loading="loadingBtn">统计</el-button>
        </div>
      </div>
      <div class="con_right">
        <div class="right_box table_box">
          <el-table
            v-loading="loading"
            :data="bkclccList && bkclccList.list"
            >
            <el-table-column
              type="index"
              label="序号"
              :index="indexMethod">
            </el-table-column>
            <el-table-column
              label="车牌号码"
              prop="plateNo"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="卡口名称"
              prop="bayonetName"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="抓拍时间"
              prop="shotTime"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="车道"
              prop=""
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="车牌颜色"
              prop="vehicleColor"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="布控库"
              prop=""
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="车辆类型"
              prop="vehicleClass"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="车速"
              prop=""
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="操作"
              show-overflow-tooltip
              >
              <template>
                <span class="operation_btn" @click="skip">查看</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="cum_pagination"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="bkclccList.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {getAllBayonetListByName, apiOutCityStatistics} from '@/views/index/api/api.vehicle.js';
import {dataList} from '@/utils/data.js';
import {formatDate} from '@/utils/util.js';
export default {
  data () {
    return {
      queryForm: {
        startTime: formatDate(new Date().getTime() - 24*60*60*1000, 'yyyy-MM-dd'), //默认开始时间为当前时间前一天
        endTime: formatDate(new Date().getTime() + 1 * 3600 * 24 * 1000, 'yyyy-MM-dd'),//默认结束时间为开始时间后第三天
        bayonet: {value: ''},
        province: {label: ''},
        provinceName: '',
        radio: false
      },
      pickerOptions1: {},
      listBayonet: [],
      provinceList: this.dicFormater(dataList.ownership)[0].dictList.map(m => {
        return {
          value: parseInt(m.enumField),
          label: m.enumValue
        }
      }),
      loading: false,
      loadingBtn: false,
      bkclccList: [],
      // 翻页数据
      currentPage: 1,
      pageSize: 10,
      pageNum: 1
    }
  },
  watch: {
    'queryForm.startTime' () {
      const threeDays = 2 * 3600 * 24 * 1000;
      const endTime = new Date(this.queryForm.startTime).getTime() + threeDays;
      this.queryForm.endTime = formatDate(endTime, 'yyyy-MM-dd');
    }
  },
  mounted () {
    this.getControlCarSta();
  },
  methods: { 
    getEndTime(time) {
      let startTime = new Date(this.queryForm.startTime).getTime()
      this.pickerOptions1 = {
        disabledDate(time) {
          return time.getTime() < (startTime - 8.64e7) || time.getTime() > ((startTime + 2 * 3600 * 24 * 1000) - 8.64e6);
        },
      }
    },
    skip () {
      this.$router.push({name: 'vehicle_search_clxx'});
    },
    // 模糊搜索卡口
    getListBayonet (query) {
      const _query = this.Trim(query, 'g');
      if (!_query) return;
      const params = {
        name: query
      }
      getAllBayonetListByName(params).then(res => {
        if (res) {
          this.listBayonet = res.data.map(m => {
            return {
              value: m.uid,
              label: m.bayonetName
            }
          });
        }
      });
    },  
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    handleCurrentChange (page) {
      this.pageNum = page;
      this.currentPage = page;
      this.getControlCarSta();
    },
    // 重置表单
    resetQueryForm () {
      this.pageNum = 1;
      this.currentPage = 1;
      this.queryForm = {
        startTime: formatDate(new Date().getTime() - 24*60*60*1000, 'yyyy-MM-dd'), //默认开始时间为当前时间前一天
        endTime: formatDate(new Date().getTime() + 1 * 3600 * 24 * 1000, 'yyyy-MM-dd'),//默认结束时间为开始时间后第三天
        bayonet: {value: ''},
        province: {label: ''},
        provinceName: '',
        radio: false
      };
      this.getControlCarSta();
    },
    // 获取布控车辆出城统计
    getControlCarSta () {
      const params = {
        'where.startTime': this.queryForm.startTime + ' 00:00:00',
        'where.endTime': this.queryForm.endTime + ' 23:59:59',
        'where.bayonetUid': this.queryForm.bayonet.value,
        'where.vehicleNumber': this.queryForm.province.label + this.queryForm.provinceName,
        'where.unvehicleFlag': this.queryForm.radio,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderBy: 'shotTime',
        order: 'desc',
      }
      this.loadingBtn = true;
      apiOutCityStatistics(params).then(res => {
        if (res) {
          this.bkclccList = res.data;
        }
      }).finally(() => {
        this.loadingBtn = false;
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.bkclcc_container{
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  .breadcrumb_heaer{
    border-bottom: 1px solid #D3D3D3;
  }
  .con_box{
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    height: calc(100% - 55px);
    .con_left{
      width: 272px;
      height: 100%;
      padding: 20px;
      > .left_start, .left_end{
        display: flex;
        padding-bottom: 10px; 
        > span{
          color: #999999;
        }
      }
      .left_radio{
        padding: 40px 0 10px 0;
        > span{
          color: #999999;
        }
      }
      .left_province{
        display: flex;
        .el-select{
          width: 82px;
        }
      }
      .left_btn{
        padding-top: 10px;
        .select_btn, .reset_btn {
          width: 110px;
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
    }
    .con_right{
      width: calc(100% - 272px);
      height: 100%;
      background: #F7F9F9;
      .right_box{
        height: calc(100% - 40px);
        margin: 20px;
        padding: 20px;
        background: #fff;
      }
    }
  }
}
</style>
<style lang="scss">
.bkclcc_container{
  .left_radio .el-radio__label{
    color: #999999;
  }
  .left_province{
    .el-input .el-input__inner{
      border-radius: 0 4px 4px 0!important;
    }
    .el-select .el-input--suffix .el-input__inner{
      border-radius: 4px 0 0 4px!important;
      border-right: none;
    }
  }
}
</style>