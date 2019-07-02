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
          <el-radio :label="3">按卡口</el-radio>
          <el-radio :label="6">按单位</el-radio>
        </el-radio-group>
        <el-select
          v-model="queryForm.devIdData"
          multiple
          filterable
          popper-class="statistics_select_list"
          @remove-tag="removeSeletedDev"
          @click.native="showChange"
          collapse-tags
          placeholder="请选择卡口">
          <el-option :value="queryForm.devIdData[0]" :label="queryForm.devIdData[0] && queryForm.devIdData[0].label"></el-option>
        </el-select>
        <div class="search_item" :style="{'height': isShowSelectList ? '120px' : '0px'}">
          <vue-scroll style="height: 90px;">
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
        <el-select v-model="queryForm.carType" placeholder="选择车辆类型">
          <el-option
            v-for="item in carTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
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
        <el-select v-model="queryForm.statementType" placeholder="选择报表类型">
          <el-option
            v-for="item in statementTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="queryForm.warningNum" placeholder="请输入大于0的警戒数值"></el-input>
        <div class="left_btn">
          <el-button class="reset_btn" @click="resetQueryForm">重置</el-button>
          <el-button class="select_btn" @click="getCarTrafficSta">统计</el-button>
        </div>
      </div>
      <div class="con_right">
        <div class="right_box">
          <div class="tab_box">
            <div>
              <i class="vl_icon vl_icon_vehicle_cll_01" @click="tabIndex = 1" :class="{'active': tabIndex === 1}"></i>
              <i class="vl_icon vl_icon_vehicle_cll_02" @click="changeTwo" :class="{'active': tabIndex === 2}"></i>
              <i class="vl_icon vl_icon_vehicle_cll_03" @click="tabIndex = 3" :class="{'active': tabIndex === 3}"></i>
            </div>
            <h1>(年)车流量统计</h1>
            <el-button class="select_btn btn_100">导出</el-button>
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
            <el-table
              v-loading="loading"
              :data="chartData"
              >
              <el-table-column
                label="卡口名称"
                prop="date"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="12点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="13点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="14点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="15点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="16点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="17点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="18点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="19点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="20点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="21点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="22点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="23点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="24点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="1点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="2点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="3点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="4点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="5点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="6点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="7点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="8点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="9点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="10点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="11点"
                prop=""
                show-overflow-tooltip
                >
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import G2 from '@antv/g2';
import { View } from '@antv/data-set';
export default {
  data () {
    return {
      queryForm: {
        radio: null,
        carType: null,
        devIdData: [],
        lane: null,
        statementType: null,
        warningNum: null
      },
      carTypeList: [],
      laneList: [],
      statementTypeList: [],
      isShowSelectList: false,
      tabIndex: 1, // select 下拉 tab 切换下标
      data1: [{
        id: 1,
        label: '一级 1',
        children: [{
            id: 4,
            label: '二级 1-1'
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
      loading: false,
      bkclccList: [{name: 'xxxxxxx'}],
      // 翻页数据
      currentPage: 1,
      pageSize: 10,
      // 图表参数
      chartData: [
        { date: '1月份', '车流量': 10, '车流量1': 1 },
        { date: '2月份', '车流量': 20, '车流量1': 1 },
        { date: '3月份', '车流量': 40, '车流量1': 1 },
        { date: '4月份', '车流量': 30, '车流量1': 1 },
        { date: '5月份', '车流量': 25, '车流量1': 1 },
        { date: '6月份', '车流量': 35, '车流量1': 1 },
        { date: '7月份', '车流量': 30, '车流量1': 1 },
        { date: '8月份', '车流量': 30, '车流量1': 1 },
        { date: '9月份', '车流量': 30, '车流量1': 1 },
        { date: '10月份', '车流量': 30, '车流量1': 1 },
        { date: '11月份', '车流量': 30, '车流量1': 1 },
        { date: '12月份', '车流量': 30, '车流量1': 1 }
      ],
      // 保存生成的图表用来删除
      charts: {
        chart1: null,
        chart2: null  
      }
    }
  },
  mounted () {
    this.drawChart1();
  },
  methods: {
    // 是否显示下拉列表
    showChange () {
      this.isShowSelectList = !this.isShowSelectList;
    },
    // 移除已选择的下拉列表项
    removeSeletedDev (data) {
      this.$refs.selectTree1.setChecked(data, false);
    },
    // 数组去重
    unique (array) {
      let obj = {}, resultArray = [];
      resultArray = array.reduce((item, next) => {
        if (!obj[next.id]) {
          obj[next.id] = true;
          item.push(next);
        }
        return item;
      }, []);
      return resultArray;
    },
    // 切换下拉列表的选中状态并关联到select上
    changeSeletedStatus () {
      let data = [], obj = null;
      this.$refs.selectTree1.getCheckedNodes().forEach(f => {
        data.push(f);
      })
      data = this.unique(data);
      data = data.filter(f => !f.children);
      this.queryForm.devIdData = data;
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
      let view2 = chart.view();
      view2.source(dv);
      view2.tooltip(false);
      view2.axis(false);
      chart.interval()
      .position('date*车流量1') 
      .color('车流量', '#F2F2F2')
      .size(30);

      chart.source(dv, {});
      // 坐标轴刻度
      chart.scale('车流量', {
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
      chart.interval()
      .position('date*value')
      .color('type', [ 'l(270) 0:#0C70F8 1:#0D9DF4' ])
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
        radio: null,
        carType: null,
        devIdData: [],
        lane: null,
        statementType: null,
        warningNum: null
      };
    },
    // 获取车流量统计数据
    getCarTrafficSta () {

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
      .left_type{
        display: flex;
        justify-content: space-between;
        padding-bottom: 20px;
      }
      .search_item {
        height: 0;
        width: 232px;
        overflow: hidden;
        transition: all .3s linear;
        .select_tree {
          border: 1px solid #e4e7ed;
          border-radius: 4px;
          background-color: #fff;
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        }
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
      color: #333 
    }
  }
}
.statistics_select_list {
  display: none!important;
}
</style>