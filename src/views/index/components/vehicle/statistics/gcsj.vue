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
        <div class="left_start" style="padding-top: 0;">
          <el-date-picker
            :clearable="false"
            class="vl_date"
            style="width: 100%"
            :picker-options="pickerOptions"
            v-model="queryForm.startTime"
            type="datetime"
            :time-arrow-control="true"
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
            :time-arrow-control="true"
            placeholder="请选择结束时间">
          </el-date-picker>
        </div>
        <div class="rlcx_xzsb_s" @click="areaTypeChanged" v-show="queryForm.type === 0">
          <span>选择设备</span>
          <span class="el-icon-arrow-down"></span>
        </div>
        <div class="rlcx_dtxz_rst" v-show="queryForm.type === 2">
          已选<span>{{dSum}}</span>个设备<a href="javascript: void(0);" @click="openMap={}">重选</a>
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
              <div id="chartContainer1" :style="{'display' : chartData1.length === 0 ? 'flex' : 'block'}">
                <div class="chart_table" v-if="chartData1.length > 0">
                  <el-table :data="chartData1">
                    <el-table-column label="设备名称" prop="name" show-overflow-tooltip></el-table-column>
                    <el-table-column label="过车数" prop="total" width="100" show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
                <span v-if="chartData1.length === 0">暂无数据</span>
              </div>
            </div>
          </div>
          <div>
            <div class="chart_item car_brand">
              <h1>车辆的品牌排名（Top5）</h1>
              <div id="chartContainer2"></div>
              <span v-if="chartData2.length === 0">暂无数据</span>
            </div>
          </div>
          <div>
            <div class="chart_item">
              <h1>各时间段的车数</h1>
              <p v-if="chartData3.length > 0">设备数量（辆）</p>
              <div id="chartContainer3">
                <span v-if="chartData3.length === 0">暂无数据</span>
              </div>
            </div>
          </div>
          <div>
            <div class="chart_item">
              <h1>各车辆类型过车情况</h1>
              <p v-if="chartData4.length > 0">数量（辆）</p>
              <div id="chartContainer4">
                <span v-if="chartData4.length === 0">暂无数据</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div is="mapSelector" ref="mapSelector" :open="openMap" :clear="msClear" :showTypes="'DB'" @mapSelectorEmit="mapSelectorEmit"></div>
  </div>
</template>
<script>
// let startTime = formatDate(new Date(new Date(new Date().toLocaleDateString('zh-Hans-CN').replace(/日/g, '').replace(/\/|年|月/g, '/').replace(/[^\d/]/g,''))).getTime() - 24*60*60*1000, 'yyyy-MM-dd HH:mm:ss');
// let endTime = formatDate(new Date(new Date(new Date().toLocaleDateString('zh-Hans-CN').replace(/日/g, '').replace(/\/|年|月/g, '/').replace(/[^\d/]/g,''))).getTime() - 1, 'yyyy-MM-dd HH:mm:ss');
import G2 from '@antv/g2';
import { View } from '@antv/data-set';
import {apiPassingCarSta} from '@/views/index/api/api.vehicle.js';
import mapSelector from '@/components/common/mapSelector.vue';
import {formatDate, dateOrigin} from '@/utils/util.js';
import {dataList} from '@/utils/data.js';
export default {
  components: {mapSelector},
  data () {
    return {
      queryForm: {
        startTime: dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)),
        endTime: new Date(),
        type: 0
      },
      dSum: 0,
      dIds: [],
      bIds: [],
      msClear: {},
      openMap: {},
      pickerOptions: {
        disabledDate: time => {
          return time > new Date();
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          return time > new Date();
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
    
      // selectLength: null
    }
  },
  watch: {
    // 'queryForm.startTime' () {
    //   const threeDays = 2 * 3600 * 24 * 1000;
    //   const endTime = new Date(this.queryForm.startTime).getTime() + threeDays;
    //   this.queryForm.endTime = formatDate(endTime, 'yyyy-MM-dd');
    // },
    // selectLength () {
    //   // 设备和卡口全选后才获取过车数据统计
    //   if (this.selectLength === (this.queryForm.devData.selSelectedData1.length + this.queryForm.devData.selSelectedData2.length)) {
    //     this.getCarBeforeSta();
    //   }
    // }
  },
  mounted () {
    this.getCarBeforeSta();
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
    // allSelectLength (num) {
    //   this.selectLength = num;
    // },
    // 获得选择设备组件传过来的数据
    // getSelectData (data) {
    //   this.queryForm.devData = data;
    // },
    areaTypeChanged () {
      this.queryForm.type = 2;
      this.openMap = !this.openMap;
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
        field: 'total',
        dimension: 'name',
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
          var percentDom = '<div class="stat11_leg_percent">' + _this.chartData2[index].total + '辆</div>';
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
        .color('name', ['#00C888', '#8949F3', '#115BFA', '#CC00FF', '#0D9DF4'])
        .tooltip('name*percent', function(item, percent) {
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
      chart.source(this.chartData3, {
        'total': {
          min: 0
        }
      });
      // 坐标轴刻度
      chart.scale('total', {
        title: {
          offset: 50
        }
      });
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
          let str = `<div class="my_tooltip">`;
          if (title === '0点') {
            str += `<h1>${title}</h1>`;
          } else {
            str += `<h1>${_this.transformTime(title)}-${title}</h1>`;
          }
          str += `<span><span>${items[0].value}</span><span>辆</span></span></div>`;
          return str;
        }
      });
      chart.legend(false);
      chart.line().position('name*total').shape('hv').color('#489CED').size(2);
      chart.render();
      this.charts.chart3 = chart;
    },
    drawChart4 () {
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
      chart.source(this.chartData4, {
        'total': {
          min: 0
        }
      });
      // 坐标轴刻度
      chart.scale('total', {
        title: {
          offset: 50
        }
      });
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
            <span><span>${items[0].value}辆</span></span></div>`;
        }
      });
      chart.legend(false);
      chart.interval()
      .position('name*total')
      .color('l(270) 0:#0C70F8 1:#0D9DF4')
      .size(30)
      chart.render();
      this.charts.chart4 = chart;
    },
    // 转换时间间隔
    transformTime (title) {
      if (title === '0点') return 0;
      return title.length === 2 ? parseInt(title.slice(0, 1)) - 1 : parseInt(title.slice(0, 2)) - 1;
    },
    // 重置表单
    resetQueryForm () {
      this.queryForm.startTime = dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000));
      this.queryForm.endTime = new Date();
      this.msClear = {};
      this.dSum = 0;      
      this.dIds = [];
      this.bIds = [];
    },
    //查询
    search() {
      this.loadingBtn = true;
      this.getCarBeforeSta();
    },
    // 选择设备弹窗点击确定方法
    mapSelectorEmit (result) {
       if (result) {
        console.log(result, 'result');
        this.dSum = 0;
        this.dIds = [];
        this.bIds = [];
        if (result.deviceList) {
          this.dSum = result.deviceList.length;
          for (let i = 0; i < result.deviceList.length; i++) {
            this.dIds.push(result.deviceList[i].uid);
          }
        }
        if (result.bayonetList && result.bayonetList.length > 0) {
          this.dSum += result.bayonetList.length;
          for (let i = 0; i < result.bayonetList.length; i++) {
            this.bIds.push(result.bayonetList[i].uid);
          }
        }
      }
    },
    // 获取过车数据统计
    getCarBeforeSta () {
      const params = {  
        startTime: formatDate(this.queryForm.startTime),
        endTime: formatDate(this.queryForm.endTime)
      }
      this.dIds.length > 0 && (params.deviceIds = this.dIds.join(','));
      this.bIds.length > 0 && (params.bayonetIds = this.bIds.join(','));
      apiPassingCarSta(params).then(res => {
        if (res && res.data) {
          this.gcsjDetail = res.data;
          this.chartData1 = res.data.device;
          this.chartData2 = res.data.brandDto;
          this.chartData3 = res.data.timeDto;
          // 对车辆类型转码
          this.chartData4 = res.data.carTypeDto && res.data.carTypeDto.map(m => {
            const obj = this.dicFormater(dataList.vehicleType)[0].dictList.find(f => f.enumField === m.name);
            let name = null;
            if (obj) name = obj.enumValue;
            return {
              total: m.total,
              name
            }
          });
        } else {
          this.gcsjDetail = {};
          this.chartData1 = [];
          this.chartData2 = [];
          this.chartData3 = [];
          this.chartData4 = [];
        }
      }).finally(() => {
        this.loadingBtn = false;
        if (this.chartData2.length === 0) {
          if (this.charts.chart2) {
            this.charts.chart2.destroy();
          }
          this.charts.chart2 = null;
        } else {
          this.drawChart2();
        }
        if (this.chartData3.length === 0) {
          if (this.charts.chart3) {
            this.charts.chart3.destroy();
          }
          this.charts.chart3 = null;
        } else {
          this.drawChart3();
        }
        if (this.chartData4.length === 0) {
          if (this.charts.chart4) {
            this.charts.chart4.destroy();
          }
          this.charts.chart4 = null;
        } else {
          this.drawChart4();
        }
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
      > .left_start{
        padding-top: 10px; 
      }
      .left_btn{
        display: flex;
        justify-content: space-between;
        padding-top: 20px;
        .select_btn, .reset_btn {
          width: 110px;
        }
      }
      .rlcx_xzsb_s {
        height: 40px;
        width: 100%;
        line-height:40px;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        cursor: pointer;
        color: #999999;
        padding: 0 6px;
        > span {
          display: inline-block;
          width: 50%;
          &:last-child {
            text-align: right;
          }
        }
      }
      .rlcx_dtxz_rst {
        width: 100%;
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        background-color: #F5F7FA;
        color: #C0C4CC;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        > span {
          display: inline-block;
          padding: 0 3px;
          color: #333;
        }
        > a {
          display: inline-block;
          padding-left: 5px;
          color: #2580FC !important;
          text-decoration: none !important;
          /*font-style: italic;*/
          cursor: pointer;
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
          // height: 50%;
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
            #chartContainer3, #chartContainer4{
              display: flex;
            }
            #chartContainer1, #chartContainer3, #chartContainer4{
              justify-content: center;
              align-items: center;
              > span{
                color: #999;
              }
            }
           
            .chart_table {
              padding: 8px 0 0;
            }
          }
          .car_brand{
            position: relative;
            > span{
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              color: #999;
            }
          }
        }
        > div:nth-child(3), > div:nth-child(4){
          padding-bottom: 10px;
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