<template>
 <div class="clldb_container">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{name: 'vehicle'}">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>车流量对比</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="con_box">
      <div class="con_left">
        <el-select v-model="queryForm.bayonet" filterable placeholder="请选择卡口" style="width: 100%;">
          <el-option
            v-for="item in listBayonet"
            :key="item.value"
            :label="item.label"
            :value="item">
          </el-option>
        </el-select>
        <el-select v-model="queryForm.carType" placeholder="选择车辆类型">
          <el-option value="" label="全部类型"></el-option>
          <el-option
            v-for="item in carTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.label">
          </el-option>
        </el-select>
        <el-select v-model="queryForm.lane" placeholder="选择车道">
          <el-option
            v-for="item in laneList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="left_btn">
          <el-button class="reset_btn" @click="resetQueryForm">重置</el-button>
          <el-button class="select_btn" type="primary" :loading="loadingBtn" @click="getCarComparison">统计</el-button>
        </div>
      </div>
      <div class="con_right">
        <div class="right_box" v-if="isShowChart">
          <div class="tab_box">
            <div>
              <i class="vl_icon vl_icon_vehicle_cll_01" :class="{'active': tabIndex === 1}" @click="tabIndex = 1"></i>
              <i class="vl_icon vl_icon_vehicle_cll_03" :class="{'active': tabIndex === 2}" @click="tabIndex = 2"></i>
            </div>
            <h1>各卡口车流量统计</h1>
            <el-button class="btn_100" type="primary" @click="exportExcel" :loading="loadingBtnExport">导出</el-button>
          </div>
          <div class="main_box" v-show="tabIndex === 1">
            <p>车流量（辆）</p>
            <div id="chartContainer"></div>
          </div>
          <div class="main_box" v-show="tabIndex === 2">
            <el-table :data="bodyList">
              <el-table-column :label="name" v-for="(name, key) in headerList" :key="name">
                <template>
                  <span>{{bodyList[0][key]}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div is="noResult" v-else :isInitPage="isInitPage"></div>
      </div>
    </div>
  </div>
</template>
<script>
import G2 from '@antv/g2';
import { View } from '@antv/data-set';
import {apiCarFlow, exportExcel} from '@/views/index/api/api.vehicle.js';
import {getAllBayonetListByName} from '@/views/index/api/api.vehicle.js';
import {formatDate, dateOrigin} from '@/utils/util.js';
import {dataList} from '@/utils/data.js';
import noResult from '@/components/common/noResult.vue';
export default {
  components: {noResult},
  data () {
    return {
      isInitPage: true,
      queryForm: {
        carType: "",
        bayonet: {value: ''},
        lane: null,
        statementType: 1,
        startTime: dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)),
        endTime: new Date(),
      },
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
      listBayonet: [],
      tabIndex: 1,
      carTypeList: this.dicFormater(dataList.vehicleType)[0].dictList.map(m => {
        return {
          value: parseInt(m.enumField),
          label: m.enumValue
        }
      }),
      laneList: [],
      loading: false,
      loadingBtn: false,
      loadingBtnExport: false,
      // 翻页数据
      currentPage: 1,
      pageSize: 10,
      // 图表参数
      chartData: [
        {name: '卡口1', total: 50},
        {name: '卡口2', total: 70},
        {name: '卡口3', total: 80},
        {name: '卡口4', total: 50},
        {name: '卡口5', total: 60},
        {name: '卡口6', total: 40},
        {name: '卡口7', total: 50}
      ],
      // 保存生成的图表用来删除
      chart: null,
      isShowChart: false, // 选择卡口，点统计按钮后，显示右边统计图表
      headerList: [], // 表格头部数据
      bodyList: [], // 表格主体数据
      //当时间间隔超过30天时，X轴 只取第一个，和最后一个现实
      beforeDate: null,
      afterDate: null
    }
  },
  mounted () {
    this.getListBayonet();
  },
  methods: {
    // 重置查询表单
    resetQueryForm () {
      this.queryForm = {
        carType: '',
        bayonet: {value: ''},
        lane: null,
        statementType: 1,
        warningNum: '',
        startTime: dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)),
        endTime: new Date(),
      };
      this.chart = null;
      this.isShowChart = false;
    },
    // 模糊搜索卡口
    getListBayonet () {
      getAllBayonetListByName().then(res => {
        if (res) {
          this.listBayonet = res.data.map(m => {
            return {
              value: m.uid,
              label: m.bayonetName
            }
          });
        }
      })
    },
    // 获取车流量对比数据
    getCarComparison () {
      this.isShowChart = true;
      this.$nextTick(() => {
        this.headerList = this.chartData.map(m => m.name);
        this.headerList.unshift('卡口名称');
        this.bodyList[0] = this.chartData.map(m => m.total);
        this.bodyList[0].unshift('车流量');
        this.chartData = this.chartData.map(m => {
          return {
            name: m.name, '车流量': m.total, '车流量1': 1
          }
        });
        this.drawChart();
      })
    },
    // 导出
    exportExcel () {
     
    },
    // 画图表
    drawChart () {
      let temp = document.getElementById('chartContainer');
      let chart = new G2.Chart({
        container: 'chartContainer',
        forceFit: true,
        padding: [ 20, 40, 60, 40 ],
        width: G2.DomUtil.getWidth(temp),
        height: G2.DomUtil.getHeight(temp)
      });
      // let dv = new View().source(this.chartData);
      // dv.transform({
      //   type: 'fold',
      //   fields: ['车流量'], // 展开字段集
      //   key: 'type', // key字段
      //   value: 'value', // value字段
      // });
      // impute 补全列/补全字段
      // dv.transform({
      //   type: 'impute',
      //   field: '车流量1',       // 待补全字段
      //   // groupBy: [ 'value' ], // 分组字段集（传空则不分组）
      //   method: 'value',  // 补全常量
      //   value: 1     // 补全字段值时执行的规则
      // });

      // let view2 = chart.view();
      // view2.source(dv, {});
      
      // chart.interval()
      // .position('name*车流量1') 
      // .color('#F2F2F2')
      // .size(30);
      chart.source(this.chartData, {
        '车流量': {
          min: 0
        }
      });
      // 坐标轴刻度
      chart.scale('车流量', {
        title: {
          offset: 50  
        }
      });

      // chart.axis('车流量', false);
      chart.axis('name', {
        label: {
          textStyle: {
            fill: '#999999',
            fontSize: 12
          }
        }
      });
      chart.tooltip({
        useHtml: true,
        htmlContent: function (title, items) {
          return `<div class="my_tooltip">
            <h1>${title}</h1>
            <span><span>${items[0].name}：</span><span>${items[0].value}辆</span></span></div>`;
        }
      });
      chart.legend(false);
      chart.interval()
      .position('name*车流量')
      .color('l(270) 0:#0C70F8 1:#0D9DF4')
      .size(30);
      chart.render();
      this.chart = chart;
    },
  }
}
</script>
<style lang="scss" scoped>
.clldb_container{
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
      .left_start, .left_end{
        padding-bottom: 10px; 
      }
      .left_start{
        margin-top: 10px;
      }
      .left_btn{
        display: flex;
        justify-content: space-between;
        padding-top: 20px;
      }
      .el-select{
        width: 100%;
        padding-bottom: 10px;
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
        .tab_box{
          display: flex;
          justify-content: space-between;
          > div{
            font-size: 20px;
            > i{
              margin-right: 10px;
              cursor: pointer;
              &.active.vl_icon_vehicle_cll_01{
                background-position: -1095px -192px;
              }
              &.active.vl_icon_vehicle_cll_03{
                background-position: -1190px -192px;
              }
            }
          }
          > h1{
            font-weight: bold;
            font-size: 16px;
            color: #333;
          }
        }
        .main_box{
          width: 100%;
          height: calc(100% - 58px);
          > p{
            margin-top: 20px;
            color: #999999;
            font-size: 12px;
          }
          #chartContainer{
            width: 100%;
            height: 70%;
          }
          .el-table{
            margin-top: 20px;
          }
          .chart_time{
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            position: relative;
            bottom: 50px;
            > span{
              font-size: 12px;
              color: #999999;
            }
          }
        }
      }
      .not_content{
        display: flex;
        justify-content: center;
        align-items: center;
        color: #999;
        font-size: 16px;
      }
    }
  }
}
</style>
<style lang="scss">
.clldb_container{
  // 重置按钮样式
  .select_btn, .reset_btn {
    width: 110px;
  }
  .btn_100{
    width: 100px!important;
  }
  .my_tooltip{
    > h1{
      color: #999;
    }
    span{
      color: #333!important;
      font-size: 14px!important;
    }
  }
}
</style>