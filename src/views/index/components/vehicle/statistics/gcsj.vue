<template>
  <div class="gcsj_container">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{name: 'vehicle'}">侦查</el-breadcrumb-item>
        <el-breadcrumb-item>过车数据统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="con_box">
      <div class="con_left">
        <el-select
          style="width: 100%;"
          v-model="queryForm.devIdData"
          multiple
          popper-class="statistics_select_list"
          @remove-tag="removeSeletedDev"
          @click.native="showChange"
          collapse-tags
          placeholder="请选择设备">
          <el-option :value="queryForm.devIdData[0]" :label="queryForm.devIdData[0] && queryForm.devIdData[0].label"></el-option>
        </el-select>
        <div class="search_item" :style="{'height': isShowSelectList ? '120px' : '0px'}">
          <div class="tab_box">
            <div @click="changeTab(1)" :class="{'active': tabIndex === 1}">摄像头</div>
            <div @click="changeTab(2)" :class="{'active': tabIndex === 2}">卡口</div>
          </div>
          <vue-scroll style="height: 90px;">
            <el-tree
              v-show="tabIndex === 1"
              :data="data1"
              class="select_tree"
              ref="selectTree1"
              @check-change="changeSeletedStatus1"
              show-checkbox
              node-key="label">
            </el-tree>
            <el-tree
              v-show="tabIndex === 2" 
              :data="data2"
              class="select_tree"
              ref="selectTree2"
              @check-change="changeSeletedStatus2"
              show-checkbox
              node-key="label">
            </el-tree>
          </vue-scroll>
        </div>
        <div class="left_start">
          <span>开始</span>
          <el-date-picker
            v-model="queryForm.startTime"
            type="datetime"
            placeholder="请选择开始时间">
          </el-date-picker>
        </div>
        <div class="left_end">
          <span>结束</span>
          <el-date-picker
            v-model="queryForm.endTime"
            type="datetime"
            placeholder="请选择结束时间">
          </el-date-picker>
        </div>
        <div class="left_btn">
          <el-button class="reset_btn">重置</el-button>
          <el-button class="select_btn">查询</el-button>
        </div>
      </div>
      <div class="con_right">
        <div class="chart_top">
          <div>
            <div>
              <i class="el-icon-camera-solid"></i>
              <span>设备数</span>
            </div>
            <span>19个</span>
          </div>
          <div>
            <div>
              <i class="el-icon-camera-solid"></i>
              <span>过车总数</span>
            </div>
            <span>19万次</span>
          </div>
          <div>
            <div>
              <i class="el-icon-camera-solid"></i>
              <span>车辆总数</span>
            </div>
            <span>19辆</span>
          </div>
          <div>
            <div>
              <i class="el-icon-camera-solid"></i>
              <span>外地车数</span>
            </div>
            <span>19辆</span>
          </div>
        </div>
        <div class="chart_bottom">
          <div class="chart_item">
            <h1>设备过车数（Top5）</h1>
            <p>数量（万次）</p>
            <div id="chartContainer1"></div>
          </div>
          <div class="chart_item">
            <h1>车辆的品牌排名（Top5）</h1>
            <div id="chartContainer2"></div>
          </div>
          <div class="chart_item">
            <h1>各时间段的车数</h1>
            <p>设备数量（辆）</p>
            <div id="chartContainer3"></div>
          </div>
          <div class="chart_item">
            <h1>各车辆类型过车情况</h1>
            <p>数量（辆）</p>
            <div id="chartContainer4"></div>
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
        startTime: null,
        endTime: null,
        devIdData: [],
        provinceId: null,
        provinceName: null,
        radio: null
      },
      currentNode: null,
      isShowSelectList: false,
      selSelectedData1: [],
      selSelectedData2: [],
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
      data2: [{
        id: 9,
        label: '一级 3',
        children: [{
            id: 12,
            label: '二级 1-1'
        }]
        }, {
        id: 10,
        label: '一级 4',
        children: [{
            id: 13,
            label: '二级 2-1'
        }, {
            id: 14,
            label: '二级 2-2'
        }]
        }, {
        id: 11,
        label: '一级 5',
        children: [{
            id: 15,
            label: '二级 3-1'
        }, {
            id: 16,
            label: '二级 3-2'
        }]
      }],
      provinceList: [],
      loading: false,
      bkclccList: [{name: 'xxxxxxx'}],
      // 翻页数据
      currentPage: 1,
      pageSize: 10,
      // 图表参数
      chartData1: [
        { devName: '设备1', '过车数': 10, '过车数1': 1},
        { devName: '设备2', '过车数': 20, '过车数1': 1},
        { devName: '设备3', '过车数': 40, '过车数1': 1},
        { devName: '设备4', '过车数': 30, '过车数1': 1},
        { devName: '设备5', '过车数': 25, '过车数1': 1}
      ],
      chartData2: [
        { item: '大众', count: 12352 },
        { item: '本田', count: 45285 },
        { item: '马自达', count: 52452 },
        { item: '红旗', count: 22452 },
        { item: '北京现代', count: 9857 }
      ],
      chartData3: [
        { time: '0点', count: 12352 },
        { time: '2点', count: 45285 },
        { time: '4点', count: 2452 },
        { time: '6点', count: 22452 },
        { time: '8点', count: 9857 },
        { time: '10点', count: 19857 },
        { time: '12点', count: 18557 },
        { time: '14点', count: 29857 },
        { time: '16点', count: 39857 },
        { time: '18点', count: 49857 },
        { time: '20点', count: 35857 },
        { time: '22点', count: 5857 },
        { time: '24点', count: 8857 }
      ],
      chartData4: [
        { carType: '货车', count: 1987, count1: 1 },
        { carType: '客车', count: 9857, count1: 1 },
        { carType: '公交车', count: 2252, count1: 1 },
        { carType: '面包车', count: 5252, count1: 1 },
        { carType: '摩托车', count: 4525, count1: 1 },
        { carType: '轿车', count: 1235, count1: 1 }
      ]
    }
  },
  mounted () {
    this.drawChart1();
    this.drawChart2();
    this.drawChart3();
    this.drawChart4();
  },
  methods: {
    // 是否显示下拉列表
    showChange () {
      this.isShowSelectList = !this.isShowSelectList;
    },
    // 下拉列表的tab切换
    changeTab (tabIndex) {
      this.tabIndex = tabIndex;
    },
    // 移除已选择的下拉列表项
    removeSeletedDev (data) {
      // 判断是否是删除的第一个数中的数据
      if (this.selSelectedData1.some(s => s.id === data.id)) {
        this.$refs.selectTree1.setChecked(data, false);
      // 判断是否是删除的第二个树中的数据  
      } else if (this.selSelectedData2.some(s => s.id === data.id)) {
        this.$refs.selectTree2.setChecked(data, false);
      }
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
    changeSeletedStatus1 () {
      let data = [], obj = null;
      this.$refs.selectTree1.getCheckedNodes().forEach(f => {
        data.push(f);
      })
      data = this.unique(data);
      data = data.filter(f => !f.children);
      this.selSelectedData1 = data;
      this.queryForm.devIdData = [...this.selSelectedData2, ...data];
    },
    // 切换下拉列表的选中状态并关联到select上
    changeSeletedStatus2 () {
      let data = [], obj = null;
      this.$refs.selectTree2.getCheckedNodes().forEach(f => {
        data.push(f);
      })
      data = this.unique(data);
      data = data.filter(f => !f.children);
      this.selSelectedData2 = data;
      this.queryForm.devIdData = [...this.selSelectedData1, ...data];
    },
   
    indexMethod (index) {
      return index + 1 + this.pageSize * (this.pageNum - 1);
    },
    handleCurrentChange (page) {
      
    },
    // 画图表
    drawChart1 () {
      let temp = document.getElementById('chartContainer1');
      let chart = new G2.Chart({
        container: 'chartContainer1',
        forceFit: true,
        padding: [ 20, 0, 25, 25 ],
        width: G2.DomUtil.getWidth(temp),
        height: G2.DomUtil.getHeight(temp)
      });
      let dv = new View().source(this.chartData1);
      dv.transform({
        type: 'fold',
        fields: ['过车数'], // 展开字段集
        key: 'type', // key字段
        value: 'value', // value字段
        retains: ['devName']
      });

      // impute 补全列/补全字段
      dv.transform({
        type: 'impute',
        field: '过车数1',       // 待补全字段
        // groupBy: [ 'value' ], // 分组字段集（传空则不分组）
        method: 'value',  // 补全常量
        value: 40     // 补全字段值时执行的规则
      });
      let view2 = chart.view();
      view2.source(dv);
      view2.tooltip(false);
      view2.axis(false);
      chart.interval()
      .position('devName*过车数1')
      .color('devName', '#F2F2F2')
      .size(34)
      .shape('cylinder');
    

      chart.source(dv);
      // 坐标轴刻度
      chart.scale('过车数1', {
        max: 40,
        min: 0,
        tickCount: 6,
        title: {
          offset: 50
        }
      });
      chart.axis('devName', {
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
      chart.tooltip(false);
      chart.legend(false);
      chart.interval()
      .position('devName*value')
      .color('devName', [ 'l(270) 0:#0D9DF4 1:#0C70F8' ])
      .size(34)
      .shape('cylinder')
      .label('value', {
        offset: 10,
        textStyle: {
          fill: '#0080FE', 
          fontSize: 16,
          shadowBlur: 2,
          shadowColor: 'rgba(0, 0, 0, .45)'
        },
      });
      chart.render();
    },
    drawChart2 () {
      let _this = this;
      let temp = document.getElementById('chartContainer2');
      let chart = new G2.Chart({
        container: 'chartContainer2',
        forceFit: true,
        padding: [ 20, 0, 20, 0 ],
        width: G2.DomUtil.getWidth(temp),
        height: G2.DomUtil.getHeight(temp)
      });
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
    },
    drawChart3 () {
      let _this = this;
      let temp = document.getElementById('chartContainer3');
      let chart = new G2.Chart({
        container: 'chartContainer3',
        forceFit: true,
        padding: [ 20, 24, 80, 60 ],
        width: G2.DomUtil.getWidth(temp),
        height: G2.DomUtil.getHeight(temp)
      });
      let dv = new View().source(this.chartData3);
      dv.transform({
        type: 'fold',
        fields: ['count'], // 展开字段集
        key: 'type', // key字段
        value: 'value', // value字段
        retains: ['time']
      });
      chart.source(dv, {});
      // 坐标轴刻度
      chart.scale('value', {
        max: 50000,
        min: 0,
        tickCount: 7,
        title: {
          offset: 50
        }
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
          return `<div class="my_tooltip"><h1>${_this.transformTime(title)}-${title}</h1>
            <span><span>${items[0].value}</span><span>辆</span></span></div>`;
        }
      });
      chart.legend(false);
      chart.line().position('time*value').color('type', [ '#00C4FC']).size(4).shape('smooth');
      chart.area().position('time*value').color([ 'l(270) 0:#ffffff 1:#00C4FC' ]).shape('smooth');
      chart.render();
    },
    drawChart4 () {
      let temp = document.getElementById('chartContainer4');
      let chart = new G2.Chart({
        container: 'chartContainer4',
        forceFit: true,
        padding: [ 0, 40, 20, 60 ],
        width: G2.DomUtil.getWidth(temp),
        height: G2.DomUtil.getHeight(temp)
      });
      let dv = new View().source(this.chartData4);
      dv.transform({
        type: 'fold',
        fields: ['count'], // 展开字段集
        key: 'type', // key字段
        value: 'value', // value字段
        retains: ['carType']
      });
      chart.source(dv, {});

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
      chart.interval().position('carType*count1').color('carType', '#F2F2F2').size(18);
      
      chart.axis('carType', {
        label: {
          textStyle: {
            fill: '#8d8d8d',
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
      chart.axis('count1', false);
      chart.axis('value', false);
      chart.tooltip(false); 
      chart.legend(false);
      chart.coord().transpose();
      chart.interval().position('carType*value').color('carType', ['#00F3DF','#00F3DF','#0FB1FF','#088BFD','#6262FF','#00C888']).size(18).label('value', {
      textStyle: {
          fill: '#333',
          fontWeight: 'bold'
        },
        offset: 10
      });
      chart.render();
    },
    // 转换时间间隔
    transformTime (title) {
      return title.length === 2 ? parseInt(title.slice(0, 1)) - 2 : parseInt(title.slice(0, 2)) - 2;
    }
  }
}
</script>
<style lang="scss" scoped>
.gcsj_container{
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
      .search_item {
        width: 232px;
        height: 0;
        overflow: hidden;
        transition: all .3s linear;
        .tab_box{
          width: 100%;
          height: 30px;
          display: flex;
          > div{
            width: 50%;
            line-height: 30px;
            text-align: center;
            border:1px solid #D3D3D3;
            border-radius:3px 0px 0px 3px;
            cursor: pointer;
            &:hover, &.active{
              background:#E0F2FF;
              color: #0C70F8;
            }
          }
        }
        .select_tree {
          border: 1px solid #e4e7ed;
          border-radius: 4px;
          background-color: #fff;
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
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
      width: calc(100% - 2.72rem);
      height: 100%;
      padding: .2rem .2rem .2rem .25rem;
      background: #F7F9F9;
      .chart_top{
        width: 100%;
        height: 1.3rem;
        padding-bottom: .2rem;
        display: flex;
        > div:not(:nth-child(1)){
          margin-left: .2rem;
        }
        > div{
          width: 24.1%;
          height: 1.1rem;
          box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
          line-height: 1.1rem!important;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          padding: 0 35px;
          > div{
            display: flex;
            flex-wrap: nowrap;
            > i{
              line-height: 1.1rem!important;
              font-size: .5rem;
            }
            > span{
              margin-left: 10px;
              color: #fff;
            }
          }
          > span:nth-child(2){
            font-size: 34px;
            font-family:Adobe Heiti Std R;
            font-weight:normal;
            color: #fff;
          }
        }
        > div:nth-child(1){
          background: #0C70F8;
        }
        > div:nth-child(2){
          background: #00C4FC;
        }
        > div:nth-child(3){
          background: #8E62FF;
        }
        > div:nth-child(4){
          background: #00C888;
        }
      }
      .chart_bottom{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        flex-flow: row wrap;
        .chart_item{
          width: 49.3%;
          height: 3.78rem;
          padding: 30px;
          margin-bottom: .2rem;
          background: #fff;
          box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
          &:nth-child(2), &:nth-child(4){
            margin-left: .1rem;
          }
          &:nth-child(1), &:nth-child(3){
            margin-right: .1rem;
          }
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
            height: calc(100% - 50px);
          }
          #chartContainer2{
            width: 50%;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.statistics_select_list {
  display: none!important;
}
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
    padding-bottom: 10px;
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
html {
  font-size: 100px;
}
@media screen and (min-width: 960px) and (max-width: 1119px) {html {font-size: 60px !important;}}
@media screen and (min-width: 1200px) and (max-width: 1439px) {html {font-size: 70px !important;}}
@media screen and (min-width: 1440px) and (max-width: 1679px) {html {font-size: 80px !important;}}
@media screen and (min-width: 1680px) and (max-width: 1919px) {html {font-size: 90px !important;}}
@media screen and (min-width: 1920px) {html {font-size: 100px !important;}}
</style>