<template>
  <div class="bkclcc_container">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{name: 'vehicle'}">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>出城统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="con_box">
      <div class="con_left">
        <div class="left_start">
          <el-date-picker
            :clearable="false"
            class="vl_date"
            style="width: 100%"
            v-model="queryForm.startTime"
            :picker-options="pickerOptions"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择开始时间">
          </el-date-picker>
        </div>
        <div class="left_end">
          <el-date-picker
            :clearable="false"
            class="vl_date vl_date_end"
            style="width: 100%"
            :picker-options="pickerOptions1"
            v-model="queryForm.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择结束时间">
          </el-date-picker>
        </div>
        <el-select class="bayonet_select" v-model="queryForm.bayonet" filterable multiple collapse-tags placeholder="请选择出城卡口" style="width: 100%;">
          <el-option
            v-for="item in listBayonet"
            :key="item.value"
            :label="item.label"
            :value="item">
          </el-option>
        </el-select>
        <el-select
            v-model="queryForm.carType"
            multiple
            collapse-tags
            clearable
            placeholder="全部车辆分组"
            style="width: 100%;margin-top: 10px;"
          >
            <el-option
              v-for="item in vehicleClassOptions"
              :key="item.enumField"
              :label="item.enumValue"
              :value="item.enumField"
            ></el-option>
          </el-select>
        <div class="left_radio" style="overflow: hidden;"><span>车牌：</span><el-checkbox style="float: right;" v-model="queryForm.radio" :label="true">排除</el-checkbox></div>
        <div class="left_province">
          <el-select v-model="queryForm.province">
            <el-option
              v-for="item in provinceList"
              :key="item.value"
              :label="item.label"
              :value="item">
            </el-option>
          </el-select>
          <el-input v-model="queryForm.provinceName" placeholder="请输入车牌号"></el-input>
        </div>
        <div class="left_btn">
          <el-button class="reset_btn" @click="resetQueryForm">重置</el-button>
          <el-button class="select_btn" type="primary" @click="getControlCarSta" :loading="loadingBtn">查询</el-button>
        </div>
      </div>
      <div class="con_right">
        <div class="right_box table_box" v-if="bkclccList && bkclccList.list && bkclccList.list.length > 0">
          <el-table
            v-loading="loading"
            :data="bkclccList.list "
            >
            <el-table-column
              type="index"
              label="序号"
              width="60"
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
              label="出城时间"
              prop="shotTime"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="车辆分组"
              prop="shotTime"
              show-overflow-tooltip
              >
              <template slot-scope="scope">
                {{scope.row.vehicleType && scope.row.vehicleType.join(',')}}
              </template>
            </el-table-column>
            <el-table-column
              label="车辆类型"
              prop="vehicleClass"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="操作"
              show-overflow-tooltip
              >
              <template slot-scope="scope">
                <span class="operation_btn" @click="showStrucInfo(scope.row, indexMethod(scope.$index))">查看</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="cum_pagination"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="bkclccList.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="bkclccList.total">
          </el-pagination>
        </div>
        <div is="noResult" v-else :isInitPage="isInitPage"></div>
      </div>
    </div>
    <!-- 抓拍详情弹窗 -->
    <div is="vehicleDetail" :detailData="detailData"></div>
  </div>
</template>
<script>
// let startTime = formatDate(new Date().getTime() - 1 * 3600 * 24 * 1000, 'yyyy-MM-dd HH:mm:ss');
// let endTime = formatDate(new Date().getTime() + (24 * 60 * 60 * 1000 - 1) - 1 * 3600 * 24 * 1000, 'yyyy-MM-dd HH:mm:ss');
let startTime = formatDate(new Date(new Date(new Date().toLocaleDateString('zh-Hans-CN').replace(/日/g, '').replace(/\/|年|月/g, '/').replace(/[^\d/]/g,''))).getTime() - 24*60*60*1000, 'yyyy-MM-dd HH:mm:ss');
let endTime = formatDate(new Date(new Date(new Date().toLocaleDateString('zh-Hans-CN').replace(/日/g, '').replace(/\/|年|月/g, '/').replace(/[^\d/]/g,''))).getTime() - 1, 'yyyy-MM-dd HH:mm:ss');
import {getOutCityBayonet, apiOutCityStatistics} from '@/views/index/api/api.vehicle.js';
import {dataList} from '@/utils/data.js';
import {formatDate} from '@/utils/util.js';
import { getGroupsByType } from "@/views/index/api/api.js";
import noResult from '@/components/common/noResult.vue';
import vehicleDetail from '../common/vehicleDetail.vue';
export default {
  components: {noResult, vehicleDetail},
  data () {
    return {
      isInitPage: false,
      queryForm: {
        startTime: startTime,
        endTime: endTime,
        bayonet: '',
        carType: '',
        province: {label: '湘', value: 9},
        provinceName: '',
        radio: false
      },
      listBayonet: [],
      vehicleClassOptions: [
        // 车辆类别下拉
        {
          enumField: "无牌车",
          enumValue: "无牌车"
        },
        {
          enumField: "布控库车辆",
          enumValue: "布控库车辆"
        }
      ],
      provinceList: this.dicFormater(dataList.ownership)[0].dictList.map(m => {
        return {
          value: parseInt(m.enumField),
          label: m.enumValue
        }
      }),
      loading: false,
      loadingBtn: false,
      bkclccList: {},
      resList: [],
      // 翻页数据
      currentPage: 1,
      pickerOptions: {
        disabledDate: time => {
          if (this.queryForm.endTime) {
            return (
              time.getTime() > new Date(this.queryForm.endTime).getTime() ||
              time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90
            );
          } else {
            return (
              time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 90 ||
              time.getTime() > new Date().getTime()
            );
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          if (this.queryForm.startTime) {
            return (
              time.getTime() < new Date(this.queryForm.startTime).getTime() ||
              time.getTime() > new Date().getTime()
            );
          } else {
            return (
              time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 30 ||
              time.getTime() > new Date().getTime()
            );
          }
        }
      },
      // 
      detailData: {},// 抓拍详情数据
    }
  },
  mounted () {
    this.getListBayonet();
    this.getGroupsByType();
    this.getControlCarSta();
  },
  methods: { 
    // 获取到车辆类别
    getGroupsByType () {
      getGroupsByType({ groupType: 9 }).then(res => {
        if (res.data) {
          this.vehicleClassOptions = [
            ...this.vehicleClassOptions,
            ...res.data.map(item => {
              return {
                enumField: item.groupName,
                enumValue: item.groupName // uid
              };
            })
          ];
        }
      })
    },
    // 模糊搜索卡口
    getListBayonet () {
      getOutCityBayonet().then(res => {
        if (res) {
          let data = res.data;
          let bayonetList = [];
          if(data && data.length > 0) {
            for(let item of data) {
              bayonetList.push(...item.bayonetList)
            }
            this.listBayonet = bayonetList.map(m => {
              return {
                value: m.uid,
                label: m.bayonetName
              }
            });
          }
        }
      })
    },  
    indexMethod (index) {
      return index + 1 + this.bkclccList.pageSize * (this.bkclccList.pageNum - 1);
    },
    handleCurrentChange (page) {
      this.bkclccList.pageNum = page;
      this.currentPage = page;
      this.bkclccList.list = this.resList.slice((this.bkclccList.pageNum - 1)*10, this.bkclccList.pageNum*10);
    },
    // 重置表单
    resetQueryForm () {
      this.currentPage = 1;
      this.queryForm = {
        startTime: startTime,
        endTime: endTime,
        bayonet: '',
        carType: '',
        province: {label: '湘', value: 9},
        provinceName: '',
        radio: false
      };
      this.getControlCarSta();
    },
    // 获取布控车辆出城统计
    getControlCarSta () {
      this.currentPage = 1;
      const data = {
        'startTime': this.queryForm.startTime,
        'endTime': this.queryForm.endTime,
        'vehicleNumber': this.queryForm.province.label + this.queryForm.provinceName,
        'unvehicleFlag': this.queryForm.radio
      }
      if(this.queryForm.bayonet && this.queryForm.bayonet.length > 0) {
        let bayonet = this.queryForm.bayonet.map(r => r.value)
        data['bayonetUid'] = bayonet.join(',')
      }
      if(this.queryForm.carType && this.queryForm.carType.length > 0) {
        data['vehicleType'] = this.queryForm.carType.join(',')
      }
      console.log(JSON.stringify(data))
      this.loadingBtn = true;
      apiOutCityStatistics(data).then(res => {
        if (res) {
          this.resList = res.data;
          this.bkclccList = {
            list: this.resList ? this.resList.slice(0, 10) : [],
            total: res.data.length,
            pageSize: 10,
            pageNum: 1
          }
        }
      }).finally(() => {
        this.loadingBtn = false;
      })
    },
    showStrucInfo(data, index) {
      this.detailData = {
        type: 4, // 4出城统计
        params: {}, // 查询参数
        list: this.resList, // 列表
        index: index - 1, // 第几个
        pageSize: this.bkclccList.total,
        total: this.bkclccList.total,
        pageNum: 1
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.bkclcc_container{
  width: 100%;
  height: 100%;
  overflow: hidden;
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
        padding: 20px 0 10px 0;
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
        display: flex;
        justify-content: space-between;
        padding-top: 20px;
        .select_btn, .reset_btn {
          width: 110px;
        }
      }
    }
    .con_right{
      width: calc(100% - 272px);
      height: 100%;
      overflow-y: auto;
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
  .bayonet_select{
    .el-tag--info:nth-child(1){
      .el-select__tags-text{
        max-width: 96px;
        display: inline-block;
        overflow: hidden;
      }
      .el-tag__close{
        top: -6px;
      }
    }
  }
}
</style>