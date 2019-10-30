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
        <div class="left_start">
          <el-date-picker
            :clearable="false"
            class="vl_date"
            style="width: 100%"
            :time-arrow-control="true"
            v-model="queryForm.startTime"
            :picker-options="pickerOptions"
            type="datetime"
            placeholder="请选择开始时间">
          </el-date-picker>
        </div>
        <div class="left_end">
          <el-date-picker
            :clearable="false"
            class="vl_date vl_date_end"
            style="width: 100%"
            :time-arrow-control="true"
            :picker-options="pickerOptions1"
            v-model="queryForm.endTime"
            type="datetime"
            placeholder="请选择结束时间">
          </el-date-picker>
        </div>
        <el-select v-model="queryForm.bayonetIds" multiple collapse-tags filterable placeholder="请选择卡口" style="width: 100%;">
          <el-option
            v-for="item in listBayonet"
            :key="item.value"
            :label="item.label"
            :value="item">
          </el-option>
        </el-select>
        <el-select v-model="queryForm.carType" placeholder="选择车辆类型">
          <el-option :value="null" label="全部类型"></el-option>
          <el-option
            v-for="item in carTypeList"
            :key="item.enumField"
            :label="item.enumValue"
            :value="item.enumField">
          </el-option>
        </el-select>
        <el-select v-model="queryForm.lane" placeholder="选择车道" style="padding-bottom: 0;">
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
              <i class="vl_icon vl_icon_vehicle_cll_01" :class="{'active': tabIndex === 1}" @click="drawChart"></i>
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
            <el-table :data="tableData">
              <el-table-column show-overflow-tooltip :prop="item.key" :label="item.title" v-for="(item, index) in headerList" :key="index">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div is="noResult" v-else :isInitPage="isInitPage" :tipMessage="tipMessage"></div>
      </div>
    </div>
  </div>
</template>
<script>
import G2 from '@antv/g2';
import {exportExcel} from '@/views/index/api/api.vehicle.js';
import {getAllBayonetListByName} from '@/views/index/api/api.vehicle.js';
import {formatDate, dateOrigin} from '@/utils/util.js';
import {dataList} from '@/utils/data.js';
import noResult from '@/components/common/noResult.vue';
import {apiCarFlowCompa} from '@/views/index/api/api.portrait.js';
export default {
  components: {noResult},
  data () {
    return {
      isInitPage: true,
      tipMessage: '选择多个卡口，对比所选卡口在指定时间段的过车数量',
      queryForm: {
        carType: null,
        bayonetIds: [],
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
      carTypeList: this.dicFormater(dataList.vehicleType)[0].dictList,
      laneList: [
        {value: null, label: '全部车道'},
        {value: 1, label: '1'},
        {value: 2, label: '2'},
        {value: 3, label: '3'},
        {value: 4, label: '4'},
        {value: 5, label: '5'},
        {value: 6, label: '6'},
        {value: 7, label: '7'},
        {value: 8, label: '8'},
        {value: 9, label: '9'},
        {value: 10, label: '10'},
        {value: 11, label: '11'},
        {value: 12, label: '12'},
        {value: 13, label: '13'},
        {value: 14, label: '14'}
      ],
      loading: false,
      loadingBtn: false,
      loadingBtnExport: false,
      // 翻页数据
      currentPage: 1,
      pageSize: 10,
      // 图表参数
      chartData: [],
      tableData: [],
      // 保存生成的图表用来删除
      chart: null,
      isShowChart: false, // 选择卡口，点统计按钮后，显示右边统计图表
      headerList: [], // 表格头部数据
      //当时间间隔超过30天时，X轴 只取第一个，和最后一个现实
      // beforeDate: null,
      // afterDate: null
    }
  },
  mounted () {
    this.getListBayonet();
  },
  methods: {
    // 重置查询表单
    resetQueryForm () {
      this.queryForm = {
        carType: null,
        bayonetIds: [],
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
    async getCarComparison () {
      if (this.queryForm.bayonetIds.length === 0) {
        return this.$message.info('请先选择卡口');
      } else if (this.queryForm.bayonetIds.length > 10) {
        return this.$message.info('一次最多选择10个卡口进行统计分析');
      }
      try {
        this.loadingBtn = true;
        const {
          data: {
            carFlowResultList: _chartData, 
            carFlowCompaList: _tableData
          }
        } = await apiCarFlowCompa({
          bayonetIds: this.queryForm.bayonetIds.map(m => m.value).join(','),
          startTime: formatDate(this.queryForm.startTime),
          endTime: formatDate(this.queryForm.endTime),
          laneNo: this.queryForm.lane,
          vehicleTypes: this.queryForm.carType
        })
        this.chartData = _chartData;
        this.tableData = _tableData;
        this.loadingBtn = false;
        this.isShowChart = true;
        this.chartData = this.chartData.map(m => {
          return {
            name: m.name, '车流量': m.total
          }
        });
        this.drawChart();
        this.headerList = [];
        Object.keys(this.tableData[0]).forEach((f, i) => {
          this.headerList.push({
            title: i === 0 ? '卡口名称' : ((f.slice(1)).startsWith('0') ? f.slice(2) + '点' : f.slice(1) + '点'),
            key: f
          })
        })
      }catch(err){
        console.log(err)
      }
    },
    // 导出
    async exportExcel () {
      try {
        this.loadingBtnExport = true;
        const {data} = await exportExcel({
          carFlowCompaQueryDto: {
            bayonetIds: this.queryForm.bayonetIds.map(m => m.value).join(','),
            startTime: formatDate(this.queryForm.startTime),
            endTime: formatDate(this.queryForm.endTime),
            laneNo: this.queryForm.lane,
            vehicleTypes: this.queryForm.carType
          },
          viewType: 7
        });
        this.loadingBtnExport = false;
        const eleA = document.getElementById('export_id');
        if (eleA) {
          document.body.removeChild(eleA);
        }
        let a = document.createElement('a');
        a.setAttribute('href', data.fileUrl);
        a.setAttribute('target', '_self');
        a.setAttribute('id', 'export_id');
        document.body.appendChild(a);
        a.click();
      }catch(err){
        console.log(err)
      }
    },
    // 画图表
    drawChart () {
      this.tabIndex = 1;
      this.$nextTick(() => {
        if (this.chart) {
          this.chart.destroy();
          this.chart = null;
        }
        let temp = document.getElementById('chartContainer');
        let chart = new G2.Chart({
          container: 'chartContainer',
          forceFit: true,
          padding: [ 20, 40, 60, 40 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
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
      })
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