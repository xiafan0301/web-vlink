<template>
  <div class="ccrc">
    <div class="ccrc_breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>车辆侦查</el-breadcrumb-item>
          <el-breadcrumb-item>初次入城</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="ccrc_content">
      <div class="ccrc_content_left">
        <div class="kaishi">
          <span style="display: inline-block; width: 14px; margin-right: 4px; color: #999999">开 始</span>
          <el-date-picker
              v-model="value1"
              value-format="timestamp"
              @change="hhh"
              style="width: 212px; vertical-align: top"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="jiesu">
          <span style="display: inline-block; width: 14px; margin-right: 4px; color: #999999">结 束</span>
          <el-date-picker
              v-model="value2"
              value-format="timestamp"
              style="width: 212px; vertical-align: top"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="kakou">
          <el-select v-model="lll" placeholder="请选择" style="width: 230px"  popper-class="statistics_select_list" @click.native="showChange">
              <el-option
                  v-for="item in cities"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
          </el-select>
          <div class="search_item" v-show="isShowSelectList">
            <vue-scroll>
              <el-tree
                  :data="data1"
                  class="select_tree"
                  ref="selectTree1"
                  @check-change="changeSeletedStatus"
                  show-checkbox
                  node-key="label">
              </el-tree>
            </vue-scroll>
          </div>
        </div>
        <div class="cpai">
          <span style="display: inline-block; width: 42px;color: #999999">车牌：</span>
          <el-checkbox v-model="unvehicleFlag"><span style="color: #999999">非</span></el-checkbox>
        </div>
        <div class="kakou">
          <el-input placeholder="请输入内容" v-model="lll" class="input-with-select">
            <el-select v-model="v" slot="prepend" style="width: 62px;" class="selectet" :placeholder="null">
              <el-option label="箱" value="1"></el-option>
              <el-option label="订单号" value="2"></el-option>
              <el-option label="用户电话" value="3"></el-option>
            </el-select>
          </el-input>
        </div>
        <div class="kakou">
          <el-button style="width: 110px">重置</el-button>
          <el-button type="primary" style="width: 110px" @click="tongji">统计</el-button>
        </div>
      </div>
      <div class="ccrc_content_right">
        <div class="ccrc_content_right_content">
          <div class="ccrc_content_right_table">
            <el-table
                :data="tableData"
                style="width: 100%">
              <el-table-column
                  type="index"
                  prop="date"
                  width="80px"
                  label="序号">
              </el-table-column>
              <el-table-column
                  prop="plateNo"
                  label="车牌号码">
              </el-table-column>
              <el-table-column
                  prop="deviceName"
                  label="卡口名称"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  prop="shotTime"
                  width="240"
                  label="抓拍时间">
              </el-table-column>
              <el-table-column
                  prop="vehicleColor"
                  label="车牌颜色"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  prop="address"
                  label="布控库"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  prop="vehicleClass"
                  label="车辆类型"
                  show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                  label="操作">
                <template slot-scope="scope">
                  <span class="operation_btn">查看</span>
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { JfoGETCity } from '../../../api/api.judge.js';
export default {
  data () {
    return {
      v: '',
      lll: '',
      value1: '',
      value2: '',
      unvehicleFlag: false,
      isShowSelectList: false,
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      tableData: [],
      cities: [],
      data1: [{
        id: 1,
        label: '观音阁',
        children: [{
          id: 4,
          label: '电卡'
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created () {
    this.JfoGETCity()
  },
  methods: {
    oo (val) {
      console.log(val)
    },
    tongji () {
      this.JfoGETCity()
      console.log(1)
    },
    hhh (val) {
      console.log(val)
    },
    changeSeletedStatus (data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    showChange () {
      this.isShowSelectList = !this.isShowSelectList;
    },
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
    },
    JfoGETCity () {
      const params = {
        'where.startTime': this.value1,
        'where.endTime': this.value2,
        'where.unvehicleFlag': this.unvehicleFlag,
        // 'where.eventFlag': 1, // 是否是事件  1--是 0-否
        // 'where.eventType': eventType,
        // 'where.reporterUserRole': userName,
        // 'where.keyword': this.auditForm.phoneOrNumber,
        // 'where.eventSource': this.auditForm.eventSource,
        pageNum: this.pagination.pageNum,
        // orderBy: 'report_time',
        // order: 'asc'
      }
      JfoGETCity(params).then(res => {
        if (res) {
          this.tableData = res.data.list;
          this.pagination.total = res.data.total;
          console.log('llllllllllllllllllll', res)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .ccrc{
    height: 100%;
    .ccrc_breadcrumb{
      background-color: white;
      padding: 23px 20px;
      border-bottom: 2px solid #F7F9F9;
    }
    .ccrc_content{
      display: flex;
      height: calc(100% - 62px);
      .ccrc_content_left{
        height: 100%;
        background-color: white;
        width: 272px;
        padding: 20px;
        box-shadow: 5px 0 10px #E5E7E7;
        .jiesu{
          padding-top: 10px;
        }
        .kakou{
          padding-top: 10px;
          .search_item {
            height: 120px;
            width: 230px;
            padding-top: 10px;
            .select_tree {
              border: 1px solid #e4e7ed;
              border-radius: 4px;
              background-color: #fff;
              box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
              padding: 10px 0;
            }
          }
        }
        .cpai{
          padding-top: 20px;
        }
        .selectet{
          /deep/ .el-input__inner{
            background-color: white;
            border: 1px solid #DCDFE6;
            border-left: 0;
            border-right: 0;
          }
        }
      }
      .ccrc_content_right{
        height: 100%;
        background-color: #F7F9F9;
        width: calc(100% - 282px);
        margin-left: 10px;
        padding: 20px;
        overflow: auto;
        .ccrc_content_right_content{
          min-height: 100%;
          background-color: white;
          box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
          padding: 20px;
          .cum_pagination{
            padding-right: 0;
          }
        }
      }
    }
    .operation_btn {
      color: #0C70F8;
      cursor: pointer;
    }
    .statistics_select_list{
      display: none !important;
    }
  }
</style>
<style lang="scss">
.statistics_select_list {
  display: none!important;
}
</style>