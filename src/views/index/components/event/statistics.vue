<template>
  <vue-scroll>
    <div class="stat-box">
      <div class="search-box">
         <el-date-picker
          style="width: 250px;"
          v-model="dateTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-select v-model="value" placeholder="请选择" style="margin-left: 10px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button class="operation_btn">查询</el-button>
      </div>
      <div class="stat-content">
        <!--    综合统计    -->
        <ul class="stat-zt">
          <li>
            <div class="stat-zt-box">
              <div class="left-icon-number"><i class="vl_icon vl_icon_statistics_8"></i></div>
              <div class="stat-zt-value">
                <h3>208</h3>
                <p>事件数量</p>
              </div>
              <div class="right-icon">
                <i class="vl_icon vl_icon_statistics_4"></i>
              </div>
            </div>
          </li>
          <li>
            <div class="stat-zt-box">
              <div class="left-icon-finish">
                <i class="vl_icon vl_icon_statistics_7"></i>
              </div>
              <div class="stat-zt-value">
                <h3>208</h3>
                <p>处理完成</p>
              </div>
              <div class="right-icon"><i class="vl_icon vl_icon_statistics_3"></i></div>
            </div>
          </li>
          <li>
            <div class="stat-zt-box">
              <div class="left-icon-ing">
                <i class="vl_icon vl_icon_statistics_6"></i>
              </div>
              <div class="stat-zt-value">
                <h3>208</h3>
                <p>处理中</p>
              </div>
              <div class="right-icon"><i class="vl_icon vl_icon_statistics_2"></i></div>
            </div>
          </li>
          <li>
            <div class="stat-zt-box">
              <div class="left-icon-unhandle">
                <i class="vl_icon vl_icon_statistics_5"></i>
              </div>
              <div class="stat-zt-value">
                <h3>208</h3>
                <p>待处理</p>
              </div>
              <div class="right-icon"><i class="vl_icon vl_icon_statistics_1"></i></div>
            </div>
          </li>
        </ul>
        <!--   统计图表    --->
        <ul class="stat-tt">
          <li>
            <div>
              <h4 class="stat_title">事件等级分析</h4>
              <div class="stat_tt_item" id="stat_1"></div>
            </div>
          </li>
          <li>
            <div>
              <h4 class="stat_title">事件类型分析</h4>
              <div class="stat_tt_item" id="stat_2"></div>
            </div>
          </li>
          <li>
            <div>
              <h4 class="stat_title">事件数量趋势</h4>
              <div class="stat_tt_item" id="stat_3"></div>
            </div>
          </li>
          <li>
            <div>
              <h4 class="stat_title">事件布控统计</h4>
              <div class="stat_tt_item" id="stat_4"></div>
            </div>
          </li>
        </ul>
        <!-- 地图统计 -->
        <div class="e_stat_map">
          <!-- <div class="stat_map_c">
            <div class="stat_map_cl">
              <h4 class="stat_title">事件高发地点分析</h4>
              <ul class="stat_map_cl_ul">
                <template v-if="polygons && polygons.length > 0">
                  <li v-if="polygons.length > 0">
                    <span></span>
                    <h5>{{polygons[0].areaName}}</h5>
                    <div><span>{{polygons[0].eventCount}}</span>&nbsp;件</div>
                  </li>
                  <li v-if="polygons.length > 1">
                    <span></span>
                    <h5>{{polygons[1].areaName}}</h5>
                    <div><span>{{polygons[1].eventCount}}</span>&nbsp;件</div>
                  </li>
                  <li v-if="polygons.length > 2">
                    <span></span>
                    <h5>{{polygons[2].areaName}}</h5>
                    <div><span>{{polygons[2].eventCount}}</span>&nbsp;件</div>
                  </li>
                  <li v-if="polygons.length > 3">
                    <span></span>
                    <h5>{{polygons[3].areaName}}</h5>
                    <div><span>{{polygons[3].eventCount}}</span>&nbsp;件</div>
                  </li>
                  <li v-if="polygons.length > 4">
                    <span></span>
                    <h5>{{polygons[4].areaName}}</h5>
                    <div><span>{{polygons[4].eventCount}}</span>&nbsp;件</div>
                  </li>
                </template>
              </ul>
            </div>
            <div class="stat_map_cr" id="drawEdge"></div>
            <div class="de-close-btn">
              <span class="de-btn-r" @click="setMapStatus('1')"></span>
              <span class="de-btn-fd" @click="setMapStatus('2')" :class="{'de-btn-dis': mapScale.fd}"></span>
              <span class="de-btn-sx" @click="setMapStatus('3')" :class="{'de-btn-dis': mapScale.sx}"></span>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </vue-scroll>
</template>
<script>
import G2 from '@antv/g2';
import { View } from '@antv/data-set';
export default {
  data () {
    return {
      dateTime: null,
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      charts: {
        chart1: null,
        chart2: null,
        chart3: null,
        chart4: null
      },
      chart1Data: [
        {
          item: '1级事件(件)',
          count: 40,
          percent: 0.4
        }, {
          item: '2级事件(件)',
          count: 21,
          percent: 0.21
        }, {
          item: '3级事件(件)',
          count: 17,
          percent: 0.17
        }, {
          item: '4级事件(件)',
          count: 13,
          percent: 0.13
        }, {
          item: '5级事件(件)',
          count: 9,
          percent: 0.09
        }
      ],
      chart2Data: [
        {
          sales: 56,
          year: '自然灾害'
        },
        {
          sales: 20,
          year: '事故灾难'
        },
        {
          sales: 46,
          year: '公共卫生'
        },
        {
          sales: 90,
          year: '社会安全'
        },
        {
          sales: 80,
          year: '其他'
        }
      ],
      chart3Data: [
        {
          value: 12,
          year: '2018-12-09'
        },
        {
          value: 45,
          year: '2018-12-12'
        },
        {
          value: 34,
          year: '2018-12-29'
        },
        {
          value: 78,
          year: '2019-1-19'
        },
        {
          value: 124,
          year: '2019-2-19'
        },
        {
          value: 100,
          year: '2019-3-19'
        },
        {
          value: 89,
          year: '2019-4-19'
        }
      ],
      chart4Data: [
        {
          value: 105,
          name: '已布控事件'
        },
        {
          value: 180,
          name: '未布控事件'
        }
      ],
      colors: [
        ['#0D9DF4', '#6262FF', '#8949F3', '#115BFA', '#0C70F8'],
        [
          [17, 91, 250],
          [12, 112, 248],
          [13, 157, 244],
          [98, 98, 255],
          [137, 73, 243]
        ]
      ],
    }
  },
  mounted () {
    this.intitReportSize();
    this.setStats1(this.chart1Data);
    this.setStats2(this.chart2Data);
    this.setStats3(this.chart3Data);
    this.setStats4(this.chart4Data);
  },
  methods: {
    intitReportSize () {
      let $list = $('.stat_tt_item');
      if ($list && $list.length > 0) {
        let iw = $list.width();
        $list.height(iw * 0.4);
      }
    },
    setStats1 (data) {
      let chart = null;
      if (this.charts.chart1) {
        this.charts.chart1.clear();
        chart = this.charts.chart1;
      } else {
        let temp = document.getElementById('stat_1');
        chart = new G2.Chart({
          container: 'stat_1',
          forceFit: true,
          padding: [ 12, 12 * 14, 12, 0 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      let _this = this;
      chart.source(data, {
        percent: {
          formatter: function formatter (val) {
            val = (val * 100).toFixed(2) + '%';
            return val;
          }
        }
      });
      chart.coord('theta');
      chart.tooltip({
        showTitle: false
      });
      chart.legend({
        position: 'right',
        title: null,
        textStyle: {
          fill: '#f1f1f1', // 文本的颜色
          fontSize: 12
        },
        offsetY: 0, // -G2.DomUtil.getHeight(temp005) / 2 + 4 * intRem,
        offsetX: -11 * 12,
        // itemGap: 20, // 图例项之间的间距
        useHtml: true,
        containerTpl: '<div class="g2-legend e_stat_tb_ld1 as-trans50-t" style="position:absolute;top:20px;right:60px;width:auto;">' +
        '<ul class="g2-legend-list" style="list-style-type:none;margin:0;padding:0;"></ul>' +
        '</div>',
        itemTpl: (value, color, checked, index) => {
          if (index > 4) {
            return value;
          }
          return '<li class="g2-legend-list-item item-' + index + ' ' + checked +
            '" data-value="' + value + '" data-color=' + color + '>' +
            '<div>' +
              '<div><i style="background-color: rgba(' + _this.colors[1][index][0] + ', ' + _this.colors[1][index][1] + ', ' + _this.colors[1][index][2] + ', 0.4)">' +
              '<i style="background-color: rgba(' + _this.colors[1][index][0] + ', ' + _this.colors[1][index][1] + ', ' + _this.colors[1][index][2] + ', 1)"></i></i>' + data[index].count + '</div>' +
              '<p>' + value + '' + '</p>' +
            '</div>' +
          '</li>';
        }
      });
      chart.intervalStack().position('percent')
        .color('item', _this.colors[0])
        .label('percent', {
          offset: -40,
          // autoRotate: false,
          textStyle: {
            rotate: 0,
            textAlign: 'center',
            shadowBlur: 2,
            shadowColor: 'rgba(0, 0, 0, .45)'
          }
        }).tooltip('item*percent', function (item, percent) {
          percent = percent * 100 + '%';
          return {
            name: item,
            value: percent
          };
        }).style({
          lineWidth: 1,
          stroke: '#fff'
        });
      chart.render();
      this.charts.chart1 = chart;
    },
    setStats2 (data) {
      let chart = null;
      if (this.charts.chart2) {
        this.charts.chart2.clear();
        chart = this.charts.chart2;
      } else {
        let temp = document.getElementById('stat_2');
        chart = new G2.Chart({
          container: 'stat_2',
          forceFit: true,
          padding: [ 12 * 2, 12 * 3, 12 * 4.5, 12 * 6 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp),
        });
      }
      const Shape = G2.Shape;
      /*  圆柱（圆角柱状图） */
      Shape.registerShape('interval', 'cylinder', {
        draw (cfg, group) {
          let points = cfg.points;
          // const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
          let path = [];
          path.push(['M', points[0].x, points[0].y]);
          path.push(['L', points[1].x, points[1].y]);
          path.push(['L', points[2].x, points[2].y]);
          path.push(['L', points[3].x, points[3].y]);
          path.push('Z');
          path = this.parsePath(path); // 将 0 - 1 转化为画布坐标
          let iRadius = (path[2][1] - path[1][1]) / 2;
          let iY = (path[0][2] - path[1][2]) / 2;
          if (iRadius > iY) { iRadius = iY }
          return group.addShape('rect', {
            attrs: {
              x: path[1][1], // 矩形起始点为左上角
              y: path[1][2],
              width: path[2][1] - path[1][1],
              height: path[0][2] - path[1][2],
              fill: cfg.color,
              radius: iRadius
            }
          });
        }
      });
      // let _this = this;
      // let temp = document.getElementById('stat_2');
      chart.source(data);
      chart.scale('sales', {
        range: [ 0, 1 ],
        min: 0
      });
      chart.legend(false);
      chart.tooltip({
        showTitle: false
      });
      chart.interval()
        .position('year*sales')
        .size(20)
        .color('year', [ 'l(90) 0:#0C70F8 1:#0D9DF4' ])
        .shape('cylinder');
      chart.render();
      this.charts.chart2 = chart;
    },
    setStats3 (data) {
      let chart = null;
      if (this.charts.chart3) {
        this.charts.chart3.clear();
        chart = this.charts.chart3;
      } else {
        let temp = document.getElementById('stat_3');
        chart = new G2.Chart({
          container: 'stat_3',
          forceFit: true,
          padding: [ 12 * 2, 12 * 3, 12 * 4.5, 12 * 6 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      // let _this = this;
      chart.source(data);
      chart.tooltip({
        showTitle: false,
        itemTpl: '<li><p style="color: #999">{year}</p><p style="color: #333333"><span style="font-weight:bold;font-size: 20px;">{value}</span><span>&nbsp;件</span></p></li>',
        crosshairs: {
          type: 'y'
        }
      });
      chart.scale('value', {
        range: [ 0, 1 ],
        min: 0
      });
      chart.legend(false);
      chart.area().position('year*value')
        .opacity(1)
        .tooltip(false)
        // .color(['#33C8FF'])
        .color(['l(270) 0:#0D9DF4 1:#0D9DF4'])
        .shape('smooth');
      chart.line().position('year*value')
        .tooltip('year*value', function (year, value) {
          return {
            year: year,
            value: value
          };
        })
        .color('value', ['#33C8FF'])
        .shape('smooth')
        .size(1);
      chart.render();
      this.charts.chart3 = chart;
    },
    setStats4 (data) {
      let chart = null;
      if (this.charts.chart4) {
        this.charts.chart4.clear();
        chart = this.charts.chart4;
      } else {
        let temp = document.getElementById('stat_4');
        chart = new G2.Chart({
          container: 'stat_4',
          forceFit: true,
          padding: [ 12 * 1, 12 * 14, 12 * 1, 12 * 1 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      // let _this = this;
      // chart
      chart.legend({
        position: 'right',
        title: null,
        textStyle: {
          fill: '#f1f1f1', // 文本的颜色
          fontSize: 12
        },
        offsetY: 0, // -G2.DomUtil.getHeight(temp005) / 2 + 4 * intRem,
        offsetX: -11 * 11,
        // itemGap: 20, // 图例项之间的间距
        useHtml: true,
        containerTpl: '<div class="g2-legend e_stat_tb_ld4 as-trans50-t" style="position:absolute;top:20px;right:30px;width:auto;left: auto;">' +
        '<ul class="g2-legend-list" style="list-style-type:none;margin:0;padding:0;"></ul>' +
        '</div>',
        itemTpl: (value, color, checked, index) => {
          if (index > 4) {
            return value;
          }
          return '<li class="g2-legend-list-item item-' + index + ' ' + checked +
            '" data-value="' + value + '" data-color=' + color + '>' +
            '<div>' +
              '<span style="background-color: ' + color + ';"></span>' +
              '<div><p>' + data[index].value + '</p><div>' + data[index].name + '(件)</div>' +
              '</div>' +
              '<i class="vl_icon vl_icon_statistics_control_' + index + '"></i>' +
            '</div>' +
          '</li>';
        }
      });
      // 通过 DataSet 计算百分比
      let dv = new View();
      dv.source(data).transform({
        type: 'percent',
        field: 'value',
        dimension: 'name',
        as: 'percent'
      });
      let outterView = chart.view();
      outterView.source(dv, {
        percent: {
          formatter: function formatter (val) {
            val = (val * 100).toFixed(2) + '%';
            return val;
          }
        }
      });
      outterView.coord('theta', {
        innerRadius: 0.8,
        radius: 0.8
      });
      chart.tooltip({
        showTitle: false
      });
      outterView.intervalStack()
        .position('percent')
        .color('name', ['#bf2cfe', '#1774f2', '#228ed6'])
        .label('name')
        .tooltip('name*percent', function (item, percent) {
          percent = (percent * 100).toFixed(2) + '%';
          return {
            name: item,
            value: percent
          };
        }).select(false).style({
          lineWidth: 1,
          stroke: '#fff'
        });

      let middleView = chart.view();
      middleView.source(dv, {
        percent: {
          formatter: function formatter (val) {
            val = (val * 100).toFixed(2) + '%';
            return val;
          }
        }
      });
      middleView.coord('theta', {
        innerRadius: 0.8,
        radius: 0.65
      });
      middleView.intervalStack()
        .position('percent')
        .color('name', ['#d98ff9', '#85b3f3', '#8ac2e5'])
        // .label('name')
        .tooltip('name*percent', function (item, percent) {
          percent = (percent * 100).toFixed(2) + '%';
          return {
            name: item,
            value: percent
          };
        }).select(false).style({
          lineWidth: 1,
          stroke: '#fff'
        });

      let innerView = chart.view();
      innerView.source(dv, {
        percent: {
          formatter: function formatter (val) {
            val = (val * 100).toFixed(2) + '%';
            return val;
          }
        }
      });
      innerView.coord('theta', {
        innerRadius: 0.7,
        radius: 0.52
      });
      innerView.intervalStack()
        .position('percent')
        .color('name', ['#efd2fc', '#cee1fa', '#d0e6f4'])
        // .label('name')
        .tooltip('name*percent', function (item, percent) {
          percent = (percent * 100).toFixed(2) + '%';
          return {
            name: item,
            value: percent
          };
        }).select(false).style({
          lineWidth: 1,
          stroke: '#fff'
        });
      // render
      chart.render();
      this.charts.chart4 = chart;
    },
  }
}
</script>
<style lang="scss" scoped>
.stat-box {
  width: 100%;
  padding: 15px;
  .search-box {
    padding: 10px;
    width: 100%;
    background-color: #ffffff;
    .operation_btn {
      padding: 0;
      width: 100px;
      height: 40px;
      text-align: center;
      background: #0C70F8;
      color: #ffffff;
      margin-left: 10px;
    }
  }
  .stat-content {
    width: 100%;
    margin-top: 20px;
    .stat-zt {
      width: 100%;
      li {
        width: 24.25%;
        margin-right: 1%;
        box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
        float: left;
        &:last-child {
          margin-right: 0px;
        }
        .stat-zt-box {
          background-color: #ffffff;
          display: flex;
          justify-content: space-between;
          >div {
            &:first-child {
              width: 110px;
              text-align: center;
              padding: 20px 0;
              box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
            }
          }
          .left-icon-number {
            background-color: #0C70F8;
          }
          .left-icon-finish {
            background-color: #0D9DF4;
          }
          .left-icon-ing {
            background-color: #6262FF;
          }
          .left-icon-unhandle {
            background-color: #8949F3;
          }
          .stat-zt-value {
            width: 40%;
            display: flex;
            padding-top: 25px;
            padding-left: 15px;
            flex-direction: column;
            color: #666666;
            h3 {
              font-size: 20px;
              font-weight: bold;
            }
            span:first-child {
              font-size:32px;
              font-weight:bold;
            }
          }
          .right-icon {
            margin-right: 10px;
            i {
              margin-top: 28px;
            }
          }
        }
      }
    }
    .stat-tt {
      > li {
        width: 49.5%;
        margin-top: 20px;
        float: left;
        &:nth-child(odd){
          margin-right: 1%;
        }
        > div {
          padding: 20px 0 10px 0;
          background-color: #fff;

        }
      }
    }
    .stat_title {
      color: #333333;
      font-weight: bold;
      padding: 0 0 0 20px;
    }
  }
  .e_stat_map {
    padding: 10px 20px 20px 20px;
    > .stat_map_c {
      position: relative;
      width: 100%; height: 1000px;
      background-color: #fff;
      > .stat_map_cl {
        width: 300px; height: 100%;
        background-color: #fff;
        float: left;
        padding-top: 20px;
        border: 1px solid #E9F7FF;
        border-left: 0;
      }
      > .stat_map_cr {
        margin-left: 300px;
        height: 100%;
        border: 1px solid #ddd;
      }
    }
  }
}
</style>