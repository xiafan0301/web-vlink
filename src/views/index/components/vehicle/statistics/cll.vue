<template>
  <div class="cll_container">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{name: 'vehicle'}">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>车流量统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="con_box">
      <div class="con_left">
        <!-- <el-radio-group v-model="queryForm.radio" class="left_type">
          <el-radio :label="1">按卡口</el-radio> -->
          <!-- <el-radio :label="6">按单位</el-radio> -->
        <!-- </el-radio-group> -->
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
        <!-- <el-select v-model="queryForm.lane" placeholder="选择车道">
          <el-option
            v-for="item in laneList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
        <el-select v-model="queryForm.statementType" placeholder="选择报表类型">
          <el-option
            v-for="item in statementTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="queryForm.warningNum" placeholder="请输入大于0的警戒数值" @blur="validationWarningNum"></el-input>
        <!-- 自定义报表类型 -->
        <div class="left_start" v-show="queryForm.statementType === 5">
          <el-date-picker
            :clearable="false"
            style="width: 100%;"
            :picker-options="pickerOptions"
            v-model="queryForm.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择开始时间"
            class="vl_date">
          </el-date-picker>
        </div>
        <div class="left_end" v-show="queryForm.statementType === 5" style="padding-bottom: 0;">
          <el-date-picker
            :clearable="false"
            style="width: 100%;"
            :picker-options="pickerOptions1"
            v-model="queryForm.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择结束时间"
            class="vl_date vl_date_end">
          </el-date-picker>
        </div>
        <div class="left_btn">
          <el-button class="reset_btn" @click="resetQueryForm">重置</el-button>
          <el-button class="select_btn" type="primary" @click="getCarTrafficSta" :disabled="!queryForm.bayonet.value" :loading="loadingBtn">统计</el-button>
        </div>
      </div>
      <div class="con_right">
        <div class="right_box" v-if="isShowChart">
          <div class="tab_box">
            <div>
              <i class="vl_icon vl_icon_vehicle_cll_01" @click="changeTab(1)" :class="{'active': tabIndex === 1}" v-show="queryForm.statementType !== 5"></i>
              <i class="vl_icon vl_icon_vehicle_cll_02" @click="changeTab(2)" :class="{'active': tabIndex === 2}" ></i>
              <i class="vl_icon vl_icon_vehicle_cll_03" @click="tabIndex = 3" :class="{'active': tabIndex === 3}" v-show="queryForm.statementType !== 5"></i>
            </div>
            <h1>({{dateTitle}})车流量统计</h1>
            <el-button class="btn_100" type="primary" @click="exportExcel" :loading="loadingBtnExport">导出</el-button>
          </div>
          <div class="main_box" v-show="tabIndex === 1">
            <p>车流量（辆）</p>
            <div id="chartContainer1"></div>
          </div>
          <div class="main_box" v-show="tabIndex === 2">
            <p>车流量（辆）</p>
            <div id="chartContainer2"></div>
            <div v-if="this.chartData && this.chartData.length > 30" class="chart_time">
              <span>{{beforeDate}}</span>
              <span>{{afterDate}}</span>
            </div>
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
        <div is="noResult" v-else :isInitPage="isInitPage"></div>
      </div>
    </div>
  </div>
</template>
<script>
let startTime = formatDate(new Date(new Date(new Date().toLocaleDateString())).getTime() - 24*60*60*1000, 'yyyy-MM-dd HH:mm:ss');
let endTime = formatDate(new Date(new Date(new Date().toLocaleDateString())).getTime() - 1, 'yyyy-MM-dd HH:mm:ss');
import G2 from '@antv/g2';
import { View } from '@antv/data-set';
import {apiCarFlow, exportExcel} from '@/views/index/api/api.vehicle.js';
import {getAllBayonetListByName} from '@/views/index/api/api.vehicle.js';
import {formatDate} from '@/utils/util.js';
import {dataList} from '@/utils/data.js';
import noResult from '@/components/common/noResult.vue';
export default {
  components: {noResult},
  data () {
    return {
      isInitPage: true,
      queryForm: {
        // radio: 1,
        carType: "",
        bayonet: {value: ''},
        // lane: null,
        statementType: 1,
        warningNum: '',
        startTime: startTime,
        endTime: endTime
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
      tabIndex: 2,
      carTypeList: this.dicFormater(dataList.vehicleType)[0].dictList.map(m => {
        return {
          value: parseInt(m.enumField),
          label: m.enumValue
        }
      }),
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
      loadingBtnExport: false,
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
      //当时间间隔超过30天时，X轴 只取第一个，和最后一个现实
      beforeDate: null,
      afterDate: null
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
        return '自定义时间段'
      }
    }
  },
  mounted () {
    this.getListBayonet();
  },
  methods: {
    // 验证输入的警戒值
    validationWarningNum () {
      const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
      if (this.queryForm.warningNum !== '' && !reg.test(this.queryForm.warningNum)) {
        this.$message.warning('输入的警戒数值必须大于0');
        this.queryForm.warningNum = '';
      }
    },
    // 导出
    exportExcel () {
      let data = {
        carFlowQueryDto: {
          bayonetIds: this.queryForm.bayonet.value,
          /* carType: this.queryForm.carType */
        },
        viewType: 6
      }
      if(this.queryForm.carType) {
        data.carFlowQueryDto['carType'] = this.queryForm.carType
      }
      if (this.queryForm.statementType !== 5) {
        data.carFlowQueryDto['reportType'] = this.queryForm.statementType
      } else {
        data.carFlowQueryDto['startTime'] = this.queryForm.startTime;
        data.carFlowQueryDto['endTime'] = this.queryForm.endTime;
      }
      this.loadingBtnExport = true;
      exportExcel(data).then(res => {
        if (res && res.data) {
          const eleA = document.getElementById('export_id');
          if (eleA) {
            document.body.removeChild(eleA);
          }
          let a = document.createElement('a');
          a.setAttribute('href', res.data.fileUrl);
          a.setAttribute('target', '_self');
          a.setAttribute('id', 'export_id');
          document.body.appendChild(a);
          a.click();
        }
      }).finally(() => {
        this.loadingBtnExport = false;
      })
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
    // 画图表
    drawChart1 () {
      let temp = document.getElementById('chartContainer1');
      let chart = new G2.Chart({
        container: 'chartContainer1',
        forceFit: true,
        padding: [ 20, 40, 60, 40 ],
        width: G2.DomUtil.getWidth(temp),
        height: G2.DomUtil.getHeight(temp)
      });
      let dv = new View().source(this.chartData);
      dv.transform({
        type: 'fold',
        fields: ['车流量'], // 展开字段集
        key: 'type', // key字段
        value: 'value', // value字段
      });
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
      // .position('date*车流量1') 
      // .color('#F2F2F2')
      // .size(30);
      chart.source(dv, {
        'value': {
          min: 0
        }
      });
      chart.axis('value', {
        title: null,
        position: 'left'
      });
      // 坐标轴刻度
      chart.scale('value', {
        alias: '车流量',
        title: {
          offset: 50
        }
      });

      // chart.axis('车流量1', false);
      chart.axis('date', {
        label: {
          textStyle: {
            fill: '#999999',
            fontSize: 12
          }
        },
        tickLine: {
          alignWithLabel: true,
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
      chart.interval()
      .position('date*value')
      .color('l(270) 0:#0C70F8 1:#0D9DF4')
      .size(30);

      if (this.queryForm.warningNum > 0) {
        chart.guide().line({
          top: true,
          start: [dv.rows[0].date, this.queryForm.warningNum],
          end: [dv.rows[dv.rows.length - 1].date, this.queryForm.warningNum],
          lineStyle: {
            stroke: '#ef5555',
            lineWidth: 2,
            lineDash: [3, 3]
          },
        });
      }

      chart.render();
      this.charts.chart1 = chart;
    },
    drawChart2 () {
      let temp = document.getElementById('chartContainer2');
      let chart = new G2.Chart({
        container: 'chartContainer2',
        forceFit: true,
        padding: [ 20, 40, 60, 40 ],
        width: G2.DomUtil.getWidth(temp),
        height: G2.DomUtil.getHeight(temp)
      });
      let dv = new View().source(this.chartData);
      dv.transform({
        type: 'fold',
        fields: ['车流量'], // 展开字段集
        key: 'type', // key字段
        value: 'value', // value字段
      });
      chart.source(dv, {
        'value': {
          min: 0
        }
      });
       
      // 坐标轴刻度
      chart.scale('value', {
        title: {
          offset: 50
        }
      });
      if (this.chartData && this.chartData.length > 30) {
        chart.axis('date', false);
      } else {
        chart.axis('date', {
          label: {
            textStyle: {
              fill: '#999999',
              fontSize: 12
            }
          },
          tickLine: {
            alignWithLabel: true,
            length: 0
          },
          line: {
            lineWidth: 0
          }
        });
      }
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
      if (this.queryForm.warningNum > 0) {
        chart.guide().line({
          top: true,
          start: [dv.rows[0].date, this.queryForm.warningNum],
          end: [dv.rows[dv.rows.length -1].date, this.queryForm.warningNum],
          lineStyle: {
            stroke: '#ef5555',
            lineWidth: 2,
            lineDash: [3, 3]
          },
        });
      }
      chart.render();
      this.charts.chart2 = chart;
    },
    // tab切换
    changeTab (index) {
      this.tabIndex = index;
      this.$nextTick(() => {
        if (this.tabIndex === 1) {
          if (this.charts.chart1) {
            this.charts.chart1.destroy();
          }
          this.charts.chart1 = null;
          this.drawChart1();
        } else {
          if (this.charts.chart2) {
            this.charts.chart2.destroy();
          }
          this.charts.chart2 = null;
          this.drawChart2();
        }
      })
    },
    // 重置查询表单
    resetQueryForm () {
      this.queryForm = {
        // radio: 1,
        carType: '',
        bayonet: {value: ''},
        // lane: null,
        statementType: 1,
        warningNum: '',
        startTime: startTime,
        endTime: endTime
      };
      this.charts = {
        chart1: null,
        chart2: null  
      };
      this.isShowChart = false;
    },
    // 获取车流量统计数据
    getCarTrafficSta () {
      this.chartData = [];
      this.headerList = [];
      this.bodyList = [];
      let params = {
        bayonetIds: this.queryForm.bayonet.value,
        /* carType: this.queryForm.carType */
      }
      if(this.queryForm.carType) {
        params['carType'] = this.queryForm.carType
      }
      if (this.queryForm.statementType !== 5) {
        params.reportType = this.queryForm.statementType
      } else {
        params.startTime = this.queryForm.startTime;
        params.endTime = this.queryForm.endTime;
      }
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
          if(this.queryForm.warningNum) {
            for(let key of this.chartData) {
              key['warnNum'] = this.queryForm.warningNum
            }
          }
          const _startTime = new Date(this.queryForm.startTime).getTime();
          const _endTime = new Date(this.queryForm.endTime).getTime();
          const threeDays = 259199000;
          if(this.queryForm.statementType === 3 || this.queryForm.statementType === 2 || (this.queryForm.statementType === 5 && (_endTime - _startTime) > threeDays)) {
            for(let item of this.chartData) {
              item['date'] = formatDate(item.date,'yy-MM-dd')
            }
          }
          if (this.chartData.length > 0) {
            this.tabIndex = 2;
            this.isShowChart = true;
            this.$nextTick(() => {
              if (this.charts.chart2) {
                this.charts.chart2.destroy();
              }
              this.charts.chart2 = null;
              this.drawChart2();
              this.beforeDate = this.chartData[0].date;
              this.afterDate = this.chartData[this.chartData.length - 1].date;
            })
          } else {
            this.charts = {
              chart1: null,
              chart2: null  
            };
            this.tabIndex = 2;
            this.isShowChart = false;
            this.isInitPage = false;
            // this.$message.warning('没有相关卡口的统计数据');
          } 
          
        }
      }).finally(() => {
        this.loadingBtn = false;
      })
    },
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
        padding-bottom: 10px; 
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