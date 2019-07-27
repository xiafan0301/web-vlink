<template>
  <div class="gcsj_container">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{name: 'vehicle'}">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>过车数据统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="con_box">
      <div class="con_left">
        <div ref="devSelect" is="devSelect" @sendSelectData="getSelectData" @allSelectLength="allSelectLength"></div>
        <div class="left_start">
          <el-date-picker
            :clearable="false"
            class="vl_date"
            style="width: 100%"
            :picker-options="pickerOptions"
            v-model="queryForm.startTime"
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
        <div class="left_btn">
          <el-button class="reset_btn" @click="resetQueryForm">重置</el-button>
          <el-button class="select_btn" type="primary" @click="search" :loading="loadingBtn">统计</el-button>
        </div>
      </div>
      <div class="con_right">
        <ul class="chart_top">
          <li>
            <div>
              <div>
                <i class="vl_icon vl_icon_vehicle_gcsj_01"></i>
                <span>设备数(个)</span>
              </div>
              <span>{{gcsjDetail.deviceNums | fmTenThousand}}</span>
            </div>
          </li>
          <li>
            <div>
              <div>
                <i class="vl_icon vl_icon_vehicle_gcsj_02"></i>
                <span>过车总数(次)</span>
              </div>
              <span>{{gcsjDetail.passingCarNums | fmTenThousand}}</span>
            </div>
          </li>
          <li>
            <div>
              <div>
                <i class="vl_icon vl_icon_vehicle_gcsj_03"></i>
                <span>车辆总数(辆)</span>
              </div>
              <span>{{gcsjDetail.carNums | fmTenThousand}}</span>
            </div>
          </li>
          <li>
            <div>
              <div>
                <i class="vl_icon vl_icon_vehicle_gcsj_04"></i>
                <span>外地车数(辆)</span>
              </div>
              <span>{{gcsjDetail.fieldCarNums | fmTenThousand}}</span>
            </div>
          </li>
        </ul>
        <div class="chart_bottom">
          <div>
            <div class="chart_item">
              <h1>设备过车数（Top5）</h1>
              <!-- <p>数量（次）</p> -->
              <div id="chartContainer1">
                <div class="chart_table">
                  <el-table :data="chartData1" height="192">
                    <el-table-column label="设备名称" prop="name" show-overflow-tooltip></el-table-column>
                    <el-table-column label="过车数" prop="total" width="100" show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="chart_item">
              <h1>车辆的品牌排名（Top5）</h1>
              <div id="chartContainer2"></div>
            </div>
          </div>
          <div>
            <div class="chart_item">
              <h1>各时间段的车数</h1>
              <p>设备数量（辆）</p>
              <div id="chartContainer3"></div>
            </div>
          </div>
          <div>
            <div class="chart_item">
              <h1>各车辆类型过车情况</h1>
              <p>数量（辆）</p>
              <div id="chartContainer4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let startTime = formatDate(new Date(new Date(new Date().toLocaleDateString())).getTime() - 24*60*60*1000, 'yyyy-MM-dd HH:mm:ss');
let endTime = formatDate(new Date(new Date(new Date().toLocaleDateString())).getTime() - 1, 'yyyy-MM-dd HH:mm:ss');
import G2 from '@antv/g2';
import { View } from '@antv/data-set';
import {apiPassingCarSta} from '@/views/index/api/api.vehicle.js';
import devSelect from '@/components/common/devSelect.vue';
import {formatDate} from '@/utils/util.js';
export default {
  components: {devSelect},
  data () {
    return {
      queryForm: {
        startTime: startTime,
        endTime: endTime,
        devIdData: {
          selSelectedData1: [],
          selSelectedData2: []
        }
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
      provinceList: [],
      loading: false,
      loadingBtn: false,
      bkclccList: [{name: 'xxxxxxx'}],
      // 翻页数据
      currentPage: 1,
      pageSize: 10,
      // 图表参数
      chartData1: [],
      chartData2: [],
      chartData3: [],
      chartData4: [],
      // 保存生成的图表用来删除
      charts: {
        chart1: null,
        chart2: null,
        chart3: null,
        chart4: null  
      },
      gcsjDetail: {
        deviceNums: '',
        passingCarNums: '',
        carNums: '',
        fieldCarNums: ''
      },
      selectLength: null
    }
  },
  watch: {
    // 'queryForm.startTime' () {
    //   const threeDays = 2 * 3600 * 24 * 1000;
    //   const endTime = new Date(this.queryForm.startTime).getTime() + threeDays;
    //   this.queryForm.endTime = formatDate(endTime, 'yyyy-MM-dd');
    // },
    selectLength () {
      // 设备和卡口全选后才获取过车数据统计
      if (this.selectLength === (this.queryForm.devIdData.selSelectedData1.length + this.queryForm.devIdData.selSelectedData2.length)) {
        this.getCarBeforeSta();
      }
    }
  },
  methods: {
    // getEndTime(time) {
    //   let startTime = new Date(this.queryForm.startTime).getTime();
    //   this.pickerOptions1 = {
    //     disabledDate(time) {
    //       return time.getTime() < (startTime - 8.64e7) || time.getTime() > ((startTime + 2 * 3600 * 24 * 1000) - 8.64e6);
    //     },
    //   }
    // },
    // 获取子组件传过来的设备和卡口总是
    allSelectLength (num) {
      this.selectLength = num;
    },
    // 获得选择设备组件传过来的数据
    getSelectData (data) {
      this.queryForm.devIdData = data;
    },
    drawChart2 () {
      let _this = this, chart = null;
      if (this.charts.chart2) {
        this.charts.chart2.clear();
        chart = this.charts.chart2;
      } else {
        let temp = document.getElementById('chartContainer2');
        chart = new G2.Chart({
          container: 'chartContainer2',
          forceFit: true,
          padding: [ 20, 0, 20, 0 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      let dv = new View().source(this.chartData2);
      dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'item',
        as: 'percent'
      });
      chart.source(dv, {
        percent: {
          formatter: function formatter(val) {
            val = (val * 100).toFixed(2) + '%';
            return val;
          }
        }
      });
      chart.legend({
        position: 'right-center',
        title: null,
        useHtml: true,
        hoverable: false,
        containerTpl: '<div class="g2-legend vi_stat11_leg"><div class="g2-legend-list"></div></div>',
        itemTpl: function itemTpl(value, color, checked, index) {
          console.log(value, color, checked, index)
          var markerDom = '<div class="stat11_leg_marker" style="background-color:' + color + '"></div>';
          var markerDom2 = '<i class="stat11_leg_marker2" style="background-color:' + color + '"></i>';
          var percentDom = '<div class="stat11_leg_percent">' + _this.chartData2[index].count + '辆</div>';
          var nameDom = '<div class="stat11_leg_name com_keepall">' + value + '</div>';
          return '<div class="g2-legend-list-item">' + markerDom + markerDom2 + nameDom + percentDom + '</div>';
        }
      });
      chart.coord('theta', {
        radius: 1,
        innerRadius: 0.5
      });
      chart.tooltip({
        showTitle: false,
        itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      });
      chart.intervalStack().position('percent')
        .color('item', ['#00C888', '#8949F3', '#115BFA', '#CC00FF', '#0D9DF4'])
        .tooltip('item*percent', function(item, percent) {
        percent = (percent * 100).toFixed(2) + '%';
        return {
          name: item,
          value: percent
        };
      }).style({
        lineWidth: 2,
        stroke: '#fff'
      }).label('percent', {
        offset: -20,
        textStyle: {
          fill: '#fff',
          textAlign: 'center',
          fontSize: 12,
          shadowBlur: 2,
          shadowColor: 'rgba(0, 0, 0, .45)'
        },
        rotate: 0,
        autoRotate: false,
        formatter: function formatter(text, item) {
          return String(parseInt(item.point.percent * 100)) + '%';
        }
      });
      chart.render();
      this.charts.chart2 = chart;
    },
    drawChart3 () {
      // if (this.chartData3.length === 0) return;
      let _this = this, chart = null;
      if (this.charts.chart3) {
        this.charts.chart3.clear();
        chart = this.charts.chart3;
      } else {
        let temp = document.getElementById('chartContainer3');
        chart = new G2.Chart({
          container: 'chartContainer3',
          forceFit: true,
          padding: [ 20, 20, 60, 30 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      let dv = new View().source(this.chartData3);
      dv.transform({
        type: 'fold',
        fields: ['count'], // 展开字段集
        key: 'type', // key字段
        value: 'value', // value字段
        retains: ['time']
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
      chart.axis('value', {
        title: null
      });
      chart.axis('time', {
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
          let str = `<div class="my_tooltip">`;
          str += `<h1>${title}</h1><span><span>${items[0].value}</span><span>辆</span></span></div>`;
          return str;
        }
      });
      chart.legend(false);
      chart.line().position('time*value').color('type', [ '#00C4FC']).size(2).shape('smooth');
      chart.area().position('time*value').color([ 'l(270) 0:#ffffff 1:#00C4FC' ]).shape('smooth');
      chart.render();
      this.charts.chart3 = chart;
    },
    drawChart4 () {
      // if (this.chartData4.length === 0) return;
      let chart = null;
      if (this.charts.chart4) {
        this.charts.chart4.clear();
        chart = this.charts.chart4;
      } else {
        let temp = document.getElementById('chartContainer4');
        chart = new G2.Chart({
          container: 'chartContainer4',
          forceFit: true,
          padding: [ 20, 20, 60, 30 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      let dv = new View().source(this.chartData4);
      dv.transform({
        type: 'fold',
        fields: ['count'], // 展开字段集
        key: 'type', // key字段
        value: 'value', // value字段
        retains: ['carType']
      });
       // impute 补全列/补全字段
      dv.transform({
        type: 'impute',
        field: 'count1',       // 待补全字段
        // groupBy: [ 'value' ], // 分组字段集（传空则不分组）
        method: 'value',  // 补全常量
        value: 1     // 补全字段值时执行的规则
      });
      let view2 = chart.view();
      view2.source(dv);
      view2.tooltip(false);
      view2.axis(false);
      chart.interval()
      .position('carType*count1') 
      .color('#F2F2F2')
      .size(30);

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
      chart.axis('value', {
        title: null,
        position: 'left'
      });
      chart.axis('count1', false);
      chart.axis('carType', {
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
            <span><span>${items[1].value}辆</span></span></div>`;
        }
      });
      chart.legend(false);
      chart.interval()
      .position('carType*value')
      .color('type', ['l(270) 0:#0C70F8 1:#0D9DF4'])
      .size(30)

      chart.render();
      this.charts.chart4 = chart;
    },
    // 转换时间间隔
    // transformTime (title) {
    //   if (title === '0点') return 0;
    //   return title.length === 2 ? parseInt(title.slice(0, 1)) - 1 : parseInt(title.slice(0, 2)) - 1;
    // },
    // 重置表单
    resetQueryForm () {
      this.queryForm.startTime = startTime;
      this.queryForm.endTime = endTime;
      // 设备全选
      this.$refs['devSelect'].checkedAll();
    },
    //查询
    search() {
      this.loadingBtn = true;
      this.getCarBeforeSta();
    },
    // 获取过车数据统计
    getCarBeforeSta () {
      const params = {  
        deviceIds: this.queryForm.devIdData.selSelectedData1.map(m => m.id).join(','),
        bayonetIds: this.queryForm.devIdData.selSelectedData2.map(m => m.id).join(','),
        startTime: this.queryForm.startTime,
        endTime: this.queryForm.endTime
      }
      apiPassingCarSta(params).then(res => {
        if (res) {
          this.gcsjDetail = res.data;
          this.chartData1 = res.data.device;
          this.chartData2 = res.data.brandDto.map(m => {
            return { item: m.name, count: m.total };
          })
          this.chartData3 = res.data.timeDto.map(m => {
            return { time: m.name, count: m.total };
          })
          this.chartData4 = res.data.carTypeDto.map(m => {
            return { carType: m.name, count: m.total, count1: 1 };
          })
          this.drawChart2();
          this.drawChart3();
          this.drawChart4();
        }
      }).finally(() => {
        this.loadingBtn = false;
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.gcsj_container{
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
    height: calc(100% - .55rem);
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
      > .left_start{
        padding-top: 10px; 
      }
      .left_btn{
        display: flex;
        justify-content: space-between;
        padding-top: 10px;
        .select_btn, .reset_btn {
          width: 110px;
        }
      }
    }
    .con_right{
      width: 100%;
      height: 100%;
      overflow-y: auto;
      background: #F7F9F9;
      .chart_top{
        width: 100%;
        display: flex;
        padding: 5px;
        li{
          width: 25%;
          height: 110px;
          padding: 5px;
          > div{
            width: 100%;
            height: 100%;
            padding: 10px;
            box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
            line-height: 80px!important;
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            > div{
              display: flex;
              flex-wrap: nowrap;
              > span{
                color: #fff;
              }
              > i{
                flex: 0 1 83px;
              }
            }
            > span:nth-child(2){
              font-size: 22px;
              font-family:Adobe Heiti Std R;
              font-weight:normal;
              color: #fff;
            }
          }
          &:nth-child(1) >div{
              background: #0C70F8;
            }
            &:nth-child(2) >div{
              background: #489CED;
            }
            &:nth-child(3) >div{
              background: #6166F6;
            }
            &:nth-child(4) >div{
              background: #7F51EA;
            }
        }
      }
      .chart_bottom{
        width: 100%;
        height: calc(100% - 120px);
        display: flex;
        flex-wrap: wrap;
        padding: 0 5px 5px;
        > div{
          width: 50%;
          height: 50%;
          min-height: 300px;
          padding: 5px;
          &:nth-child(1), &:nth-child(2){
            padding: 0 5px 5px;
          }
          .chart_item{
            width: 100%;
            height: 100%;
            padding: 20px;
            background: #fff;
            box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
            > h1{
              color: #333;
              font-size: 16px;
              font-family:MicrosoftYaHei-Bold;
              font-weight:bold;
              padding-bottom: 12px;
            }
            > p{
              color: #999;
              font-size: 12px;
            }
            > div{
              width: 100%;
              height: calc(100% - 49px);
            }
            #chartContainer2{
              width: 50%;
            }
            .chart_table {
              padding: 8px 0 0;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
// 车辆品牌排名样式
.vi_stat11_leg{
  max-width: 3.34rem!important;
  width: 3.34rem!important;
  padding: 0 .2rem;
}
.vi_stat11_leg, .vi_stat11_leg .g2-legend-list { 
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow: hidden; 
}
.vi_stat11_leg .g2-legend-list-item {
  width: 1.42rem;
  height: .76rem;
  position: relative;
  margin-right: 0!important;
  margin-bottom: .1rem!important;
  background:rgba(255,255,255,1);
  border:1px solid rgba(242,242,242,1);
  box-shadow:0px 1px 12px 0px rgba(114,114,114,0.1);
  border-radius:3px;
}
.vi_stat11_leg .stat11_leg_marker {
  position: absolute; top: .12rem; left: .12rem;
  width: .2rem; height: .2rem;
  border-radius: 50%;
  opacity: .4;
}
.vi_stat11_leg .stat11_leg_marker2 {
  position: absolute; top: .17rem; left: .17rem;
  width: .1rem; height: .1rem;
  border-radius: 50%;
}
.vi_stat11_leg .stat11_leg_percent {
  color: #666;font-size:.16rem;
  font-family:Adobe Heiti Std R;
  padding-left: .4rem;
}
.vi_stat11_leg .stat11_leg_name {
  color: #333; font-weight: bold; font-size: .2rem;
  line-height: .45rem;
  padding-left: .4rem;
}
// 各时间段的过车数
.my_tooltip{
  > h1{
    color: #999;
  }
  > span{
    color: #333;
    > span:nth-child(1){
      font-weight: bold;
      font-size: 22px;
    }
  }
}
.chart_table {
  .el-table th {
    background-color: #0567E2;
    color: #fff;
  }
}
</style>