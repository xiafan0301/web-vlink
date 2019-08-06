<template>
<vue-scroll>
  <div class="stat-box">
    
    <!-- 查询条件 -->
    <div class="e_stat_s search-box">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-date-picker
            class="e_stat_dp"
            v-model="searchForm.dateTime"
            type="daterange"
            align="left"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :editable="false"
            :clearable="false"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.dealOrgId" clearable placeholder="请选择" style="margin-left: 10px;">
            <el-option
            v-for="(item, index) in departmentData"
            :key="index"
            :label="item.organName"
            :value="item.uid"
          ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="operation_btn" :loading="searchLoading" @click="searchData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="e_stat_content" v-loading="searchLoading">
      <!-- 综合统计 -->
      <ul class="stat-zt">
        <li>
          <div class="stat-zt-box" style="background: #0C70F8">
            <div class="left-icon-number">
              <i class="vl_icon vl_icon_statistics_8"></i>
            </div>
            <!-- <div class="stat-zt-value"> -->
            <p class="event_num_title">事件数量(件)</p>
            <h3 class="event_number">{{generalData.totalCount}}</h3>
            <!-- </div> -->
            <!-- <div class="right-icon">
              <i class="vl_icon vl_icon_statistics_4"></i>
            </div> -->
          </div>
        </li>
        <li>
          <div class="stat-zt-box" style="background: #0D9DF4">
            <div class="left-icon-finish">
              <i class="vl_icon vl_icon_statistics_7"></i>
            </div>
            <!-- <div class="stat-zt-value"> -->
            <p class="event_num_title">处理完成(件)</p>
            <h3 class="event_number">{{generalData.finishCount}}</h3>
            <!-- </div> -->
            <!-- <div class="right-icon"><i class="vl_icon vl_icon_statistics_3"></i></div> -->
          </div>
        </li>
        <li>
          <div class="stat-zt-box" style="background: #6262FF">
            <div class="left-icon-ing">
              <i class="vl_icon vl_icon_statistics_6"></i>
            </div>
            <!-- <div class="stat-zt-value"> -->
            <p class="event_num_title">处理中(件)</p>
            <h3 class="event_number">{{generalData.processingCount}}</h3>
            <!-- </div> -->
            <!-- <div class="right-icon"><i class="vl_icon vl_icon_statistics_2"></i></div> -->
          </div>
        </li>
        <li>
          <div class="stat-zt-box" style="background: #1DD98E">
            <div class="left-icon-unhandle">
              <i class="vl_icon vl_icon_statistics_5"></i>
            </div>
            <!-- <div class="stat-zt-value"> -->
            <p class="event_num_title">待处理(件)</p>
            <h3 class="event_number">{{generalData.pendingCount}}</h3>
            <!-- </div> -->
            <!-- <div class="right-icon"><i class="vl_icon vl_icon_statistics_1"></i></div> -->
          </div>
        </li>
      </ul>
      <!-- 统计图表 -->
      <ul class="e_stat_tt">
        <li>
          <div>
            <h4 class="stat_title">事件等级分析</h4>
            <div class="stat_tt_item" id="stat_1">
            </div>
          </div>
        </li>
        <li>
          <div>
            <h4 class="stat_title">事件类型分析</h4>
            <div class="stat_tt_item" id="stat_2">
            </div>
          </div>
        </li>
        <li>
          <div>
            <h4 class="stat_title">事件数量趋势</h4>
            <div class="stat_tt_item" id="stat_3">
            </div>
          </div>
        </li>
        <li>
          <div>
            <h4 class="stat_title">事件布控统计</h4>
            <div class="stat_tt_item" id="stat_4">
            </div>
          </div>
        </li>
      </ul>
      <!-- 地图统计 -->
      <div class="e_stat_map">
        <div class="stat_map_c">
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
          <!--地图操作按钮-->
          <ul class="map_rrt_u2">
            <li @click="resetZoom"><i class="el-icon-aim"></i></li>
            <li @click="mapZoomSet(1)"><i class="el-icon-plus"></i></li>
            <li @click="mapZoomSet(-1)"><i class="el-icon-minus"></i></li>
          </ul>
          <!-- <div class="de-close-btn">
            <ul class="first_ul">
              <li>
                <i class="vl_icon vl_icon_control_23" @click="setMapStatus('1')"></i>
              </li>
            </ul>
            <ul class="second_ul">
              <li>
                <i class="el-icon-plus" @click="setMapStatus('2')" :class="{'de-btn-dis': mapScale.fd}"></i>
                <span class="divide"></span>
              </li>
              <li>
                <i class="el-icon-minus" @click="setMapStatus('3')" :class="{'de-btn-dis': mapScale.sx}"></i>
              </li>
            </ul>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</vue-scroll>
</template>
<script>
import G2 from '@antv/g2';
import { View } from '@antv/data-set';
import { getQuantitativeTrend, getTypeAnalysis, getRankAnalysis, getGeneralcondition,
getHotLocation, getSurveillance } from '@/views/index/api/api.event.js';
import { getDepartmentList } from '@/views/index/api/api.manage.js';
import {formatDate} from '@/utils/util.js';
import {mapXupuxian} from '@/config/config.js';

export default {
  data () {
    return {
      searchForm: {
        dateTime: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 30), new Date()],
        dealOrgId: null
      },
      pickerOptions2: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一年',
            onClick (picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      charts: {
        chart1: null,
        chart2: null,
        chart3: null,
        chart4: null
      },
      chart1Data: [],
      chart2Data: [],
      chart3Data: [],
      chart4Data: [],
      colors: [
        ['#33B5FF', '#03E38A', '#8DF771', '#F7DA6D', '#0C70F8'],
        [
          [51,181,255],
          [3,227,138],
          [141,247,113],
          [247,218,109],
          [12,112,248]
        ]
      ],
       // 事件总体情况统计数据
      generalData: {
        finishCount: 0,
        pendingCount: 0,
        processingCount: 0,
        totalCount: 0
      },
      searchLoading: false,
      loadingHandler: true,
      polygons: null,
      amap: null,
      zoom: 10,
      zooms: [9, 17],
      sonPolygons: null,
      textMarkers: null,
      mapScale: {
        fd: false,
        sx: false
      },
      userInfo: {},
      departmentData: []
    }
  },
  created () {
    this.userInfo = this.$store.state.loginUser;
    this.searchForm.dealOrgId = this.userInfo.organList[0].uid;
  },
  mounted () {
    this.getDepartList();
    this.intitReportSize();
    this.searchData();
    this.initMap();
  },
  destroyed () {
    if (this.charts.chart1) {
      this.charts.chart1.destroyed();
    }
    if (this.charts.chart2) {
      this.charts.chart2.destroyed();
    }
    if (this.charts.chart3) {
      this.charts.chart3.destroyed();
    }
    if (this.charts.chart4) {
      this.charts.chart4.destroyed();
    }
  },
  methods: {

    mapZoomSet (val) {
      if (this.amap) {
        this.amap.setZoom(this.amap.getZoom() + val);
      }
    },
    resetZoom () {
      if (this.amap) {
        this.amap.setZoomAndCenter(this.zoom, mapXupuxian.center);
        this.amap.setFitView();
      }
    },
    // 地图
    initMap () {
      // let _this = this;
      let map = new window.AMap.Map('drawEdge', {
        // defaultCursor: 'point',
        resizeEnable: true,
        center: mapXupuxian.center, // e.g. 溆浦县中心点
        zoom: this.zoom,
        zooms: this.zooms
      });
      map.setMapStyle('amap://styles/light');
      this.amap = map;
    },
    setMapStatus (status) {
      if (this.amap) {
        if (status === '1') {
          this.amap.setZoomAndCenter(this.zoom, mapXupuxian.center);
        } else if (status === '2') {
          let iZoom = this.amap.getZoom() + 1;
          if (iZoom <= this.zooms[1]) {
            this.amap.setZoom(iZoom);
          }
        } else if (status === '3') {
          let iZoom = this.amap.getZoom() - 1;
          if (iZoom >= this.zooms[0]) {
            this.amap.setZoom(iZoom);
          }
        }
      }
    },
    // 行政边界
    getSonBoundary () {
      let _this = this;
      window.AMap.service('AMap.DistrictSearch', function () { // 回调函数
        // 实例化DistrictSearch
        let districtSearch = new window.AMap.DistrictSearch({
          level: 'biz_area', // country、province、city、district、biz_area
          subdistrict: 0, // 返回下一级行政区
          showbiz: true, // 最后一级返回街道信息
          extensions: 'all' // 返回行政区边界坐标组等具体信息
        });
        // 使用districtSearch对象调用行政区查询的功能
        districtSearch.search(mapXupuxian.adcode, function (status, result) {
          // console.log('result', result)
          if (result && result.districtList && result.districtList[0]) {
            let oDis = result.districtList[0];
            let bounds = oDis.boundaries;
            // 行政区边界渲染，使用多边形覆盖物实现
            let polygon = new window.AMap.Polygon({
              map: _this.amap,
              strokeWeight: 2,
              path: bounds,
              fillOpacity: 0, // 0.95
              fillColor: '#02269e', // 0b21a0 032488
              strokeColor: '#0dd8ff',
              strokeOpacity: 0.5,
              zIndex: 10
            });
            polygon.on('click', function () {
            });
            polygon.on('dblclick', function () {
              _this.amap.setZoom(_this.amap.getZoom() + 1);
            });
          }
          // map.setFitView();
        })
        // map.setZooms(9.8);
      });
    },
    // 获取列表数据
    getDepartList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0,
      };
      getDepartmentList(params)
        .then(res => {
          if (res && res.data.list) {
            this.departmentData = res.data.list;
            this.departmentData.map((item) => {
              if (item.uid === this.userInfo.organList[0].uid) {
                this.searchForm.dealOrgId = item.uid;
              }
            });
          }
        })
    },
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
        // 可以通过调整这个数值控制分割空白处的间距，0-1 之间的数值
        let sliceNumber = 0.001;

        // 自定义 other 的图形，增加两条线
        G2.Shape.registerShape('interval', 'sliceShape', {
          draw: function draw(cfg, container) {
            if (cfg.origin._origin.percent > 0) {
              let points = cfg.points;
              let path = [];
              path.push(['M', points[0].x, points[0].y]);
              path.push(['L', points[1].x, points[1].y - sliceNumber]);
              path.push(['L', points[2].x, points[2].y - sliceNumber]);
              path.push(['L', points[3].x, points[3].y]);
              path.push('Z');
              path = this.parsePath(path);
              return container.addShape('path', {
                attrs: {
                  fill: cfg.color,
                  path: path
                }
              });
            }
          }
        });

        let temp = document.getElementById('stat_1');
        chart = new G2.Chart({
          container: 'stat_1',
          forceFit: true,
          padding: [3],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      let _this = this;
      chart.source(data);
      chart.coord('theta', {
        innerRadius: 0.75
      });
      chart.tooltip({
        showTitle: false
      });
      chart.legend(false); // 不显示图例
      chart.intervalStack().position('percent')
        .color('item', _this.colors[0])
        .shape('sliceShape')
        .label('percent', {
          offset: 20,
          htmlTemplate: (text, item, index) => {
            if (item.point.percent > 0) {
              let levelName = null;
              if (item.point.item === 'Ⅰ级') {
                levelName = '1级';
              } else if (item.point.item === 'Ⅱ级') {
                levelName = '2级';
              } else if (item.point.item === 'Ⅲ级') {
                levelName = '3级';
              } else if (item.point.item == 'Ⅳ级') {
                levelName = '4级';
              } else {
                levelName = '其他';
              }
              return '<div class="tab_one"><div class="icon_number"><i class="parent_i" style="background-color: rgba(' + _this.colors[1][index][0] + ', ' + _this.colors[1][index][1] + ', ' + _this.colors[1][index][2] + ', 0.14)">'+
                      '<i class="child_i" style="background-color: rgba(' + _this.colors[1][index][0] + ', ' + _this.colors[1][index][1] + ', ' + _this.colors[1][index][2] + ', 1)"></i></i><span>'+ item.point.count +'件</span></div>'+
                      '<div class="level_percent"><span>'+ levelName +'事件</span><span>'+ (item.point.percent * 100).toFixed(2) +'%</span></div></div>';
            } else {
              return '';
            }
          }
        })
        .tooltip('item*percent', function (item, percent) {
          percent = (percent * 100).toFixed(2) + '%';
          return {
            name: item,
            value: percent
          };
        })
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
        .color('year', ['l(90) 0:#0D9DF4 1:#0C70F8'])
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
        hoverable: false,
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
        .color('name', ['#0C70F8', '#8949F3'])
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
        .color('name', ['#0C70F8', '#8949F3'])
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
        .color('name', ['#efd2fc', '#cee1fa'])
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
    // 搜索数据
    searchData () {
      this.searchLoading = true;
      this.loadingHandler = true;
      this.initDatas();
    },
    initDatas () {
      // 事件总体情况统计
      this.getGeneralData();
      // 事件数量趋势分析
      this.getQuantitativetyData();
      // 事件等级分析
      this.getRankAnalysisData();
      // 事件类型分析
      this.getTypeAnalysisData();
      // 事件高发地点分析
      this.getHotLocationData();
      // 事件布控统计分析
      this.getSurveillanceData();
    },
    // 事件总体情况统计
    getGeneralData () {
      let params = this.getSearchParams();
      getGeneralcondition(params)
        .then(res => {
          if (res && res.data) {
            this.generalData = res.data;
            this.loadHandler();
          }
        })
        .catch(() => { this.loadHandler(); })
    },
    // 事件等级分析
    getRankAnalysisData () {
      let params = this.getSearchParams();
     getRankAnalysis(params)
        .then((res) => {
          if (res && res.data) {
            let _data = [];
            for (let i = 0; i < res.data.length; i++) {
              _data.push({
                item: res.data[i].level,
                count: res.data[i].count,
                percent: isNaN(res.data[i].proportion) ? 0 : (Number(res.data[i].proportion) / 100)
              });
            }
            this.setStats1(_data);
            this.loadHandler();
          }
        })
        .catch(() => { 
          this.loadHandler(); 
        })
    },
    // 事件类型分析
    getTypeAnalysisData () {
      let params = this.getSearchParams();
      getTypeAnalysis(params)
        .then((res) => {
          // console.log('事件类型分析', res);
          if (res && res.data) {
            let _data = [];
            for (let i = 0; i < res.data.length; i++) {
              _data.push({
                year: res.data[i].type,
                sales: Number(res.data[i].count)
              });
            }
            this.setStats2(_data);
            this.loadHandler();
          }
        })
        .catch(() => { 
          this.loadHandler(); 
        })
    },
    // 事件数量趋势分析
    getQuantitativetyData () {
      let params = this.getSearchParams();
      getQuantitativeTrend(params)
        .then((res) => {
          if (res) {
            // console.log('事件数量趋势分析', res);
            let _data = [];
            for (let i = 0; i < res.data.length; i++) {
              _data.push({
                year: res.data[i].time,
                value: Number(res.data[i].count)
              });
            }
            this.setStats3(_data);
            this.loadHandler();
          }
        })
        .catch(() => { 
          this.loadHandler(); 
        })
    },
    // 事件高发地点分析
    getHotLocationData () {
      let params = this.getSearchParams();
      getHotLocation(params)
        .then((res) => {
          if (res && res.data) {
            // console.log('事件高发地点分析', res);
            this.polygons = res.data;
            // console.log('polygons', this.polygons)
            this.setsonPolygons(res.data);
          }
        })
        .catch(() => { this.loadHandler(); })
    },
    // 事件布控统计
    getSurveillanceData () {
      let params = this.getSearchParams();
     getSurveillance(params)
        .then((res) => {
          if (res && res.data) {
            let _data = [];
            res.data.map(item => {
              let name = '';
              if (item.isSurv === 1) {
                name = '已布控事件';
              } else {
                name = '未布控事件';
              }
              const params = {
                value: Number(item.evtCount),
                name: name
              }
              _data.push(params);
            })
            this.setStats4(_data);
            this.loadHandler();
          }
        })
        .catch(() => { this.loadHandler(); })
    },
    setsonPolygons (data) {
      // let _this = this;
      if (this.amap && this.sonPolygons) {
        this.amap.remove(this.sonPolygons);
        this.sonPolygons = null;
      }
      if (this.amap && this.textMarkers) {
        this.amap.remove(this.textMarkers);
        this.textMarkers = null;
      }
      for (let i = 0; i < data.length; i++) {
        if (data[i] && data[i].borderList) {
          // let oDis = result.districtList[0];
          // console.log('this.tableData[i]', this.tableData[i]);
          let borderList = data[i].borderList;
          let bounds = [];
          for (let j = 0; j < borderList.length; j++) {
            if (borderList[j].longitude > 0 && borderList[j].latitude > 0) {
              bounds.push(new window.AMap.LngLat(borderList[j].longitude, borderList[j].latitude));
            }
          }
          // console.log('setsonPolygons bounds', bounds);
          // 行政区边界渲染，使用多边形覆盖物实现
          // let _name = data[i].areaName;
          // let polygonStyles = {
          //   n: {
          //     fillOpacity: 1, // 0.95
          //     strokeColor: '#fff',
          //     fillColor: '#088bfd'
          //   },
          //   s: {
          //     fillOpacity: 1, // 0.95
          //     strokeColor: '#fff',
          //     fillColor: '#f9783f'
          //   }
          // };
          let polygon = new window.AMap.Polygon(Object.assign({
            map: this.amap,
            path: [bounds],
            bubble: false, // 是否将覆盖物的鼠标或touch等事件冒泡到地图上
            zIndex: 12,
            extData: {
              // areaName: _name
            }
          }, this.getPolygonStyles(i)));
          if (!this.sonPolygons) {
            this.sonPolygons = [];
          }
          this.sonPolygons.push(polygon);
        }
        if (data[i] && data[i].nameLocation) {
          if (data[i].nameLocation.latitude > 0 && data[i].nameLocation.longitude > 0) {
            let textMarker = new window.AMap.Text({
              text: data[i].areaName,
              map: this.amap,
              style: {
                'background': 'inherit',
                color: '#fff',
                border: 0
              },
              bubble: false, // 是否将覆盖物的鼠标或touch等事件冒泡到地图上
              position: new window.AMap.LngLat(data[i].nameLocation.longitude, data[i].nameLocation.latitude),
              zIndex: 12
            });
            if (!this.textMarkers) {
              this.textMarkers = [];
            }
            this.textMarkers.push(textMarker);
          }
        }
      }
      // console.log('this.sonPolygons', this.sonPolygons)
    },
    getPolygonStyles (_index) {
      let _o = {
        fillOpacity: 1,
        strokeColor: '#fff'
      };
      let fillColors = ['#00A2FF', '#0F70C4', '#0054FE', '#4E2DF6', '#BF2CFE'];
      if (_index < 5) {
        _o.strokeWeight = 3;
        _o.fillColor = fillColors[_index];
      } else {
        _o.fillColor = '#088bfd';
        _o.strokeWeight = 1;
      }
      return _o;
    },
    // 查询参数
    getSearchParams () {
      return {
        'where.reportTimeStart': formatDate(this.searchForm.dateTime[0], 'yyyy-MM-dd'),
        'where.reportTimeEnd': formatDate(this.searchForm.dateTime[1], 'yyyy-MM-dd'),
        'where.dealOrgId': this.searchForm.dealOrgId,
        'where.eventFlag': 1 // 1--是  0--否  是否为事件
      }
    },
    loadHandler () {
      if (this.loadingHandler) {
        setTimeout(() => {
          this.searchLoading = false;
        }, 500);
        this.loadingHandler = false;
      }
    },
  }
}
</script>
<style lang="scss" scoped>
  
  .stat-box {
    padding: 10px 0 0 ;
  }
  .e_stat_s {
    padding: 20px 0 0 20px;
    margin: 0 20px 0 20px;
    background-color: #fff;
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
  .e_stat_content {
    overflow: hidden;
    // margin-top: 20px;
  }
  .stat-zt {
    padding: 10px 10px 0 10px;
    overflow: hidden;
    li {
      width: 25%;
      float: left;
      padding: 10px;
      box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
      // float: left;
      &:last-child {
        margin-right: 0px;
      }
      .stat-zt-box {
        background-color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        >div {
          &:first-child {
            width: 110px;
            text-align: center;
            padding: 20px 0;
            // box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
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
          background-color: #1DD98E;
        }
          .event_num_title {
            width: calc(100% - 110px);
            color: #ffffff;
          }
          .event_number {
            margin-right: 20px;
            // width: calc((100% - 110px) / 2);
            font-size:32px;
            font-weight:bold;
            color: #ffffff;
          }
        // }
        // .right-icon {
        //   margin-right: 10px;
        //   i {
        //     margin-top: 28px;
        //   }
        // }
      }
    }
  }
  .e_stat_tt {
    padding: 0 10px 0 10px;
    overflow: hidden;
    > li {
      width: 50%;
      float: left;
      padding: 10px;
      > div {
        padding: 20px 0 10px 0;
        background-color: #fff;
      }
    }
  }
  .e_stat_map {
    padding: 10px 20px 20px 20px;
    > .stat_map_c {
      position: relative;
      width: 100%; height: 1000px;
      background-color: #fff;
      .map_rrt_u2 {
        position: absolute; right: 30px;
        bottom: 20px;
        margin-top: .2rem;
        font-size: 26px;
        background: #ffffff;
        width: 78px;
        padding: 0 10px;
        > li {
          line-height: 70px;
          text-align: center;
          cursor: pointer;
          border-bottom: 1px solid #F2F2F2;
          > i {
            margin-top: 0;
            display: inline-block;
          }
          color: #999999;
          &:hover {
            color: #0C70F8;
          }
        }
      }
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
  .stat_title {
    // border-left: 3px solid #0785FD;
    color: #333333; font-weight: bold;
    padding: 0 0 0 40px;
  }
  .stat_map_cl_ul {
    padding-top: 20px;
    
    > li {
      position: relative;
      border-top: 1px solid #E9F7FF;
      border-bottom: 1px solid #E9F7FF;
      height: 80px;
      background-image: url(../../../../assets/img/stat/stat_031.png);
      background-repeat: no-repeat;
      background-position: -10px center;
      background-size: auto 120%;
      color: #00A2FF;
      > span {
        position: absolute; top: 30px; left: 20px;
        width: 20px; height: 20px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100% 100%;
        background-image: url(../../../../assets/img/stat/stat-041.png);
      }
      > h5 {
        padding: 30px 0 0 45px;
      }
      > div {
        position: absolute; top: 30px; right: 20px;
        color: #666; font-size: 12px;
        > span {
          font-weight: bold;
          font-size: 20px;
        }
      }
      &:nth-child(2) {
        color: #0F70C4;
        background-position: -22px center;
        > span { background-image: url(../../../../assets/img/stat/stat-043.png); }
      }
      &:nth-child(3) {
        color: #0054FE;
        background-position: -34px center;
        > span { background-image: url(../../../../assets/img/stat/stat-042.png); }
      }
      &:nth-child(4) {
        color: #4E2DF6;
        background-position: -46px center;
        > span { background-image: url(../../../../assets/img/stat/stat-044.png); }
      }
      &:nth-child(5) {
        color: #BF2CFE;
        background-position: -58px center;
        > span { background-image: url(../../../../assets/img/stat/stat-045.png); }
      }
    }
  }
  .stat_tt_item {
    position: relative;
  }

  .de-close-btn {
    position: absolute; top: 20px; right: 10px; z-index:11;
    > ul {
      float: left;
      display: inline-block;
      background-color: #ffffff;
      margin-right: 20px;
      cursor: pointer;
      > li {
        width: 70px;
        height: 70px;
        line-height: 70px;
        text-align: center;
        position: relative;
        i {
          display: inline-block;
          vertical-align: middle;
        }
        .divide {
          display: inline-block;
          right: 0;
          top: 25%;
          position: absolute;
          width: 1px;
          height: 40px;
          background-color: #F2F2F2;
        }
      }
    }
    .second_ul {
      >li {
        float: left;
        i {
          font-size: 25px;
          color: #0C70F8;
        }
        de-btn-dis {
          color: #999999;
          cursor: default;
        }
      }
    }
  }
</style>
<style lang="scss">
// @media screen and (max-width: 1440px) {.tab_one { max-width: 150px; width: auto; }}
// @media screen and (min-width: 1441px) {.tab_one { min-width: 150px;}}
.tab_one {
  box-shadow: 0px 5px 16px 0px rgba(169,169,169,0.2);
  background-color: #ffffff;
  padding: 10px;
  min-width: 150px;
  .icon_number {
    display: flex;
    align-items: center;
    .parent_i {
      position: relative;
      display: inline-block;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      .child_i {
        position: absolute;
        left: 5px;
        top: 5px;
        display: inline-block;
        border-radius: 50%;
        width: 10px;
        height: 10px;
      }
    }
    >span {
      margin-left: 5px;
      font-weight: bold;
      color: #333333;
      font-size: 22px;
    }
  }
  .level_percent {
    color: #666666;
    span:first-child {
      margin-right: 5px;
    }
  }
}
</style>

