<template>
  <div class="cll_container">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{name: 'vehicle'}">侦查</el-breadcrumb-item>
        <el-breadcrumb-item>车流量统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="con_box">
      <div class="con_left">
        <el-radio-group v-model="queryForm.radio" class="left_type">
          <el-radio :label="1">按卡口</el-radio>
          <!-- <el-radio :label="6">按单位</el-radio> -->
        </el-radio-group>
        <el-select
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
        <el-select v-model="queryForm.carType" placeholder="选择车辆类型">
          <el-option
            v-for="item in carTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.label">
          </el-option>
        </el-select>
        <!-- <el-select v-model="queryForm.lane" placeholder="选择车道">
          <el-option
            v-for="item in laneList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
        <el-select v-model="queryForm.statementType" placeholder="选择报表类型" @change="clearDate">
          <el-option
            v-for="item in statementTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="queryForm.warningNum" placeholder="请输入大于0的警戒数值"></el-input>
        <!-- 自定义报表类型 -->
        <div class="left_start" v-show="queryForm.statementType === 5">
          <span>开始</span>
          <el-date-picker
            v-model="queryForm.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择开始时间">
          </el-date-picker>
        </div>
        <div class="left_end" v-show="queryForm.statementType === 5">
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
        <div class="left_btn">
          <el-button class="reset_btn" @click="resetQueryForm">重置</el-button>
          <el-button class="select_btn" @click="getCarTrafficSta" :disabled="!queryForm.bayonet.value" :loading="loadingBtn">统计</el-button>
        </div>
      </div>
      <div class="con_right">
        <div class="right_box" v-if="isShowChart">
          <div class="tab_box">
            <div>
              <i class="vl_icon vl_icon_vehicle_cll_01" @click="tabIndex = 1" :class="{'active': tabIndex === 1}"></i>
              <i class="vl_icon vl_icon_vehicle_cll_02" @click="changeTwo" :class="{'active': tabIndex === 2}"></i>
              <i class="vl_icon vl_icon_vehicle_cll_03" @click="tabIndex = 3" :class="{'active': tabIndex === 3}"></i>
            </div>
            <h1>({{dateTitle}})车流量统计</h1>
            <div></div>
            <!-- <el-button class="select_btn btn_100">导出</el-button> -->
          </div>
          <div class="main_box" v-show="tabIndex === 1">
            <p>车流量（辆）</p>
            <div id="chartContainer1"></div>
          </div>
          <div class="main_box" v-show="tabIndex === 2">
            <p>车流量（辆）</p>
            <div id="chartContainer2"></div>
          </div>
          <div class="main_box" v-show="tabIndex === 3">
            <el-table :data="bodyList">
              <el-table-column :label="name" v-for="(name, key) in headerList" :key="name">
                <template>
                  <span :style="{'color': parseInt(bodyList[0][key]) > parseInt(queryForm.warningNum) ? 'red' : '#555'}">{{bodyList[0][key]}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="not_content" v-else>如需进行车流量统计请先选择卡口</div>
      </div>
    </div>
  </div>
</template>
<script>
import G2 from '@antv/g2';
import { View } from '@antv/data-set';
import {apiCarFlow} from '@/views/index/api/api.vehicle.js';
import {getAllBayonetListByName} from '@/views/index/api/api.vehicle.js';
import {formatDate} from '@/utils/util.js';
export default {
  data () {
    return {
      queryForm: {
        radio: 1,
        carType: '轿车',
        bayonet: {value: ''},
        // lane: null,
        statementType: 5,
        warningNum: null,
        startTime: formatDate(new Date().getTime() - 24*60*60*1000, 'yyyy-MM-dd'), //默认开始时间为当前时间前一天
        endTime: formatDate(new Date().getTime() + 1 * 3600 * 24 * 1000, 'yyyy-MM-dd'),//默认结束时间为开始时间后第三天
      },
      pickerOptions1: [],
      listBayonet: [],
      tabIndex: 1,
      carTypeList: [
        {label: '全部类型', value: null},
        {label: '轿车', value: 1},
        {label: '卡车', value: 2},
        {label: 'SUV', value: 3},
        {label: '摩托车', value: 4}
      ],
      // laneList: [],
      statementTypeList: [
        {label: '日报表', value: 1},
        {label: '周报表', value: 2},
        {label: '月报表', value: 3},
        {label: '年报表', value: 4},
        {label: '自定义时间段', value: 5}
      ],
      loading: false,
      loadingBtn: false,
      bkclccList: [{name: 'xxxxxxx'}],
      // 翻页数据
      currentPage: 1,
      pageSize: 10,
      // 图表参数
      chartData: [],
      // 保存生成的图表用来删除
      charts: {
        chart1: null,
        chart2: null  
      },
      isShowChart: false, // 选择卡口，点统计按钮后，显示右边统计图表
      headerList: [], // 表格头部数据
      bodyList: [], // 表格主体数据
    }
  },
  computed: {
    dateTitle () {
      const type = this.queryForm.statementType;
      if (type === 1) {
        return '日报表';
      } else if (type === 2) {
        return '周报表';
      } else if (type === 3) {
        return '月报表';
      } else if (type === 4) {
        return '年报表';
      } else if (type === 5) {
        const startTime = new Date(this.queryForm.startTime).getTime();
        const endTime = new Date(this.queryForm.endTime).getTime();
        const threeDays = 3 * 3600 * 24 * 1000;
        if (endTime - startTime >= threeDays) return '周报表';
        return '日报表';
      }
    }
  },
  watch: {
    'queryForm.startTime' () {
      const threeDays = 2 * 3600 * 24 * 1000;
      const endTime = new Date(this.queryForm.startTime).getTime() + threeDays;
      this.queryForm.endTime = formatDate(endTime, 'yyyy-MM-dd');
    }
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
    // 清除已选择的自定义时间
    clearDate () {
      this.queryForm.startTime = null;
      this.queryForm.endTime = null;
    },
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    handleCurrentChange (page) {
      
    },
    // 画图表
    drawChart1 () {
      let chart = null;
      if (this.charts.chart1) {
        this.charts.chart1.clear();
        chart = this.charts.chart1;
      } else {
        let temp = document.getElementById('chartContainer1');
        chart = new G2.Chart({
          container: 'chartContainer1',
          forceFit: true,
          padding: [ 20, 0, 60, 30 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      let dv = new View().source(this.chartData);
      dv.transform({
        type: 'fold',
        fields: ['车流量'], // 展开字段集
        key: 'type', // key字段
        value: 'value', // value字段
        retains: ['date']
      });

      // impute 补全列/补全字段
      dv.transform({
        type: 'impute',
        field: '车流量1',       // 待补全字段
        // groupBy: [ 'value' ], // 分组字段集（传空则不分组）
        method: 'value',  // 补全常量
        value: 120     // 补全字段值时执行的规则
      });
      console.log(dv.rows, 'dv.rows')
      let view2 = chart.view();
      view2.source(dv);
      view2.tooltip(false);
      view2.axis(false);
      chart.interval()
      .position('date*车流量1') 
      .color('#F2F2F2')
      .size(30);

      chart.source(dv, {});
      // 坐标轴刻度
      chart.scale('value', {
        max: 120,
        min: 0,
        tickCount: 7,
        title: {
          offset: 50
        }
      });
      chart.axis('date', {
        label: {
          textStyle: {
            fill: '#999999',
            fontSize: 12
          }
        },
        tickLine: {
          alignWithLabel: false,
          length: 0
        },
        line: {
          lineWidth: 0
        }
      });
      chart.tooltip({
        useHtml: true,
        htmlContent: function (title, items) {
          return `<div class="my_tooltip">
            <h1>${title}</h1>
            <span><span>${items[1].name}：</span><span>${items[1].value}辆</span></span></div>`;
        }
      });
      chart.legend(false);
      chart.interval()
      .position('date*value')
      .color('type', ['l(270) 0:#0C70F8 1:#0D9DF4'])
      .size(30)
      chart.render();
      this.charts.chart1 = chart;
    },
    drawChart2 () {
      let chart = null;
      if (this.charts.chart2) {
        this.charts.chart2.clear();
        chart = this.charts.chart2;
      } else {
        let temp = document.getElementById('chartContainer2');
        chart = new G2.Chart({
          container: 'chartContainer2',
          forceFit: true,
          padding: [ 20, 20, 60, 30 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      let dv = new View().source(this.chartData);
      dv.transform({
        type: 'fold',
        fields: ['车流量'], // 展开字段集
        key: 'type', // key字段
        value: 'value', // value字段
        retains: ['date']
      });
      chart.source(dv, {});
      // 坐标轴刻度
      chart.scale('value', {
        max: 120,
        min: 0,
        tickCount: 7,
        title: {
          offset: 50
        }
      });
      chart.axis('date', {
        label: {
          textStyle: {
            fill: '#999999',
            fontSize: 12
          }
        },
        tickLine: {
          alignWithLabel: false,
          length: 0
        },
        line: {
          lineWidth: 0
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
      chart.area().position('date*value').color('type', ['#007EFF']).shape('smooth').opacity(0.6);
      chart.line().position('date*value').color('type', ['#207BF1']).size(1).shape('smooth');
      chart.point().position('date*value').color('type', ['#207BF1']).size(2).shape('smooth');
      chart.render();
      this.charts.chart2 = chart;
    },
    // tab切换
    changeTwo () {
      this.tabIndex = 2;
      this.$nextTick(() => {
        this.drawChart2();
      })
    },
    // 重置查询表单
    resetQueryForm () {
      this.queryForm = {
        radio: 1,
        carType: null,
        bayonet: {value: ''},
        // lane: null,
        statementType: 1,
        warningNum: null,
        startTime: formatDate(new Date().getTime() - 24*60*60*1000, 'yyyy-MM-dd'), //默认开始时间为当前时间前一天
        endTime: formatDate(new Date().getTime() + 1 * 3600 * 24 * 1000, 'yyyy-MM-dd'),//默认结束时间为开始时间后第三天
      };
    },
    // 获取车流量统计数据
    getCarTrafficSta () {
      let params = {
        bayonetIds: this.queryForm.bayonet.value,
        startTime: this.queryForm.startTime,
        endTime: this.queryForm.endTime + ' 00:00:00',
        carType: this.queryForm.carType + ' 23:59:59'  
      }
      this.queryForm.statementType !== 5 && (params.reportType = this.queryForm.statementType);
      this.loadingBtn = true;
      apiCarFlow(params).then(res => {
        if (res) {
          this.headerList = res.data.map(m => m.name);
          this.headerList.unshift('卡口名称');
          this.bodyList[0] = res.data.map(m => m.total);
          this.bodyList[0].unshift(this.queryForm.bayonet.label);
          this.chartData = res.data.map(m => {
            return {
              date: m.name, '车流量': m.total, '车流量1': 1
            }
          });
          if (this.chartData.length > 0) {
            this.isShowChart = true;
            this.$nextTick(() => {
              this.drawChart1();
            })
          } else {
            this.charts = {
              chart1: null,
              chart2: null  
            };
            this.tabIndex = 1;
            this.isShowChart = false;
            this.$message.warning('没有相关卡口的统计数据');
          } 
          
        }
      }).finally(() => {
        this.loadingBtn = false;
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.cll_container{
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
        display: flex;
        padding-bottom: 10px; 
        > span{
          color: #999999;
        }
      }
      .left_start{
        margin-top: 10px;
      }
      .left_type{
        display: flex;
        justify-content: space-between;
        padding-bottom: 20px;
      }
      .left_btn{
        padding-top: 10px;
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
              &.active.vl_icon_vehicle_cll_02{
                background-position: -1142px -192px;
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
          #chartContainer1, #chartContainer2{
            width: 100%;
            height: 70%;
          }
          .el-table{
            margin-top: 20px;
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
.cll_container{
  .left_type{
    .el-radio__label{
      color: #999999;
    }
    .is-checked .el-radio__label{
      color: #0C70F8;
    }
  }
  // 重置按钮样式
  .select_btn, .reset_btn {
    width: 110px;
  }
  .btn_100{
    width: 100px!important;
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