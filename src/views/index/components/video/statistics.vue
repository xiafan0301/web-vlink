<template>
  <div class="vi_stat">
    <div class="vi_stat_ul vi_stat_ul1">
      <div>
        <!-- 设备智能化 -->
        <div class="stat_bd_style">
          <div class="vi_stat_ul_t">设备智能化</div>
          <div class="vi_stat_ul_c">
            <div class="stat_bd_size" id="charContainer11">
            </div>
          </div>
        </div>
      </div>
      <div>
        <!-- 设备总数 -->
        <div class="stat_bd_style">
          <div class="vi_stat_ul_t">设备总数</div>
          <div class="vi_stat_ul_c">
            <ul class="stat_sbzs">
              <li>
                <div>
                  <div class="stat_sbzs_t">
                    <div>
                      <h2>{{(videoSum.gq + videoSum.bq) | fmTenThousand}}</h2>
                      <p>设备总数</p>
                    </div>
                    <i></i>
                  </div>
                </div>
              </li>
              <li>
                <div class="stat_sbzs_li">
                  <ul>
                    <li></li>
                    <li :style="{'height': setChar12Heigt(videoSum.gq) + 'px'}"><span>{{videoSum.gq | fnPercent(videoSum.gq + videoSum.bq)}}</span></li>
                    <li></li>
                  </ul>
                  <div>
                    <div>高清</div>
                    <p>{{videoSum.gq | fmTenThousand}}</p>
                  </div>
                </div>
              </li>
              <li>
                <div class="stat_sbzs_li">
                  <ul>
                    <li class="stat_sbzs_sf2"></li>
                    <li :style="{'height': setChar12Heigt(videoSum.bq) + 'px'}" class="stat_sbzs_sf2"><span>{{videoSum.bq | fnPercent(videoSum.gq + videoSum.bq)}}</span></li>
                    <li class="stat_sbzs_sf2"></li>
                  </ul>
                  <div>
                    <div>标清</div>
                    <p>{{videoSum.bq | fmTenThousand}}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <!-- 设备类型 -->
        <div class="stat_bd_style">
          <div class="vi_stat_ul_t">设备类型</div>
          <div class="vi_stat_ul_c">
            <div style="width: 100%; height: 100%; position: relative;">
              <div class="stat_bd_size" id="charContainer13">
              </div>
              <div class="stat_13_legend">
                <div><span>{{typeTotal}}</span>设备（个）</div>
                <ul>
                  <li v-for="(item, index) in typeData" :key="'wf_' + index">
                    <i :style="typeIconColorFn(index)"></i>{{item.amount}}<span>{{item.item}}(个)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ul>
      <!-- 运行状况（实时） -->
      <li>
        <div class="vi_stat_li vi_stat_lih2 stat_bd_style">
          <div class="stat_li_t stat_li_t2">
            <h2>运行状况（实时）</h2>
          </div>
          <div class="stat_li_c stat_li_c2">
            <ul class="stat_c2">
              <li>
                <div id="charContainer21"></div>
                <p>在线率</p>
                <i>{{runingStates[0] * 100 + '%'}}</i>
              </li>
              <li>
                <div id="charContainer22"></div>
                <p>完好率</p>
                <i>{{runingStates[1] * 100 + '%'}}</i>
              </li>
              <li>
                <div id="charContainer23"></div>
                <p>视频达标率</p>
                <i>{{runingStates[2] * 100 + '%'}}</i>
              </li>
            </ul>
          </div>
        </div>
      </li>
      <!-- 设备建设区域分布 -->
      <li>
        <div class="vi_stat_li vi_stat_lih2 stat_bd_style">
          <div class="stat_li_t">
            <h2>设备建设区域分布</h2>
            <el-form :inline="true" :model="searchForm3" class="stat_li_tf" size="small">
              <el-form-item>
                <el-select class="stat_sel_w" v-model="searchForm3.area" placeholder="选择行政范围">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select class="stat_sel_w" v-model="searchForm3.year" placeholder="选择建设年份">
                  <el-option label="2019" value="2019"></el-option>
                  <el-option label="2018" value="2018"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchForm3Submit">统计</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="stat_li_c">
            <div class="stat_li_cc" id="charContainer3"></div>
          </div>
        </div>
      </li>
      <!-- 各单位的设备在线情况 -->
      <li>
        <div class="vi_stat_li vi_stat_lih2 stat_bd_style">
          <div class="stat_li_t">
            <h2>各单位的设备在线情况</h2>
            <el-form :inline="true" :model="searchForm4" class="stat_li_tf" size="small">
              <el-form-item>
                <el-select class="stat_sel_w" v-model="searchForm4.dept" placeholder="选择上级单位">
                  <el-option label="2019" value="2019"></el-option>
                  <el-option label="2018" value="2018"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchForm4Submit">统计</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="stat_li_c">
            <div class="stat_li_cc" id="charContainer4"></div>
          </div>
        </div>
      </li>
      <!-- 设备报修区域统计 -->
      <li>
        <div class="vi_stat_li vi_stat_lih2 stat_bd_style">
          <div class="stat_li_t">
            <h2>设备报修区域统计</h2>
            <el-form :inline="true" :model="searchForm5" class="stat_li_tf" size="small">
              <el-form-item>
                <el-select class="stat_sel_w" v-model="searchForm5.area" placeholder="选择行政范围">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select class="stat_sel_w" v-model="searchForm5.year" placeholder="选择建设年份">
                  <el-option label="2019" value="2019"></el-option>
                  <el-option label="2018" value="2018"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchForm5Submit">统计</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="stat_li_c">
            <div class="stat_li_cc" id="charContainer5"></div>
          </div>
        </div>
      </li>
      <!-- 设备状态变化趋势 -->
      <li>
        <div class="vi_stat_li vi_stat_lih2 stat_bd_style">
          <div class="stat_li_t">
            <h2>设备状态变化趋势</h2>
            <el-form :inline="true" :model="searchForm6" class="stat_li_tf" size="small">
              <el-form-item>
                <el-select class="stat_sel_w" v-model="searchForm6.area" placeholder="选择行政范围">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select class="stat_sel_w" v-model="searchForm6.year" placeholder="选择建设年份">
                  <el-option label="2019" value="2019"></el-option>
                  <el-option label="2018" value="2018"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="searchForm6Submit">统计</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="stat_li_c">
            <div class="stat_li_cc" id="charContainer6"></div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import G2 from '@antv/g2';
import { View } from '@antv/data-set';
import { apiDeviceTotalList } from "@/views/index/api/api.base.js";
export default {
  data () {
    return {
      contentHeight1: 200,
      videoSum: {
        gq: 0,
        bq: 0
      },
      typeData: [],
      typeTotal: 0,
      typeColors: ['#0FB1FF', '#088BFD', '#6363FE', '#8949F3'],

      runingStates: [0, 0, 0],
      searchForm3: {
        area: '',
        year: ''
      },
      searchForm4: {
        dept: ''
      },
      searchForm5: {
        area: '',
        year: ''
      },
      searchForm6: {
        area: '',
        year: ''
      },
      // 图标集合
      charts: {
        chart11: null,
        chart13: null,
        chart3: null,
        chart4: null,
        chart5: null,
        chart6: null
      }
    }
  },
  mounted () {
    this.getDeviceTotalList();

    this.initContentSize();
    // this.getChar11Data(); // 设备智能化
    // this.getChar13Data(); // 设备类型
    this.getChar2Data(); // 运行状况
    this.searchForm3Submit();
    this.searchForm4Submit();
    this.searchForm5Submit();
    this.searchForm6Submit();
  },
  methods: {
    typeIconColorFn (index) {
      let _i = index;
      if (index > (this.typeColors.length - 1)) {
        _i = index % this.typeColors.length;
      }
      return {
        'background-color': this.typeColors.concat([]).reverse()[_i]
      }
    },
    // 
    initContentSize () {
      let itemW = ($(window).width() - 200 - 20 * 3) / 2;
      let _contentHeight1 = itemW * 378 / 830;
      this.contentHeight1 = _contentHeight1;
      $('.vi_stat_lih1').height(_contentHeight1);
      $('.vi_stat_lih2').height(itemW * 468 / 830);
    },
    
    getDeviceTotalList () {
      apiDeviceTotalList().then(res => {
        if (res && res.data) {
          let d = res.data;
          // 设备总数
          this.videoSum.gq = d.deviceHDCount;
          this.videoSum.bq = d.deviceSDCount;
          // 设备智能化
          this.getChar11Data([
            { item: '人脸识别', count: d.deviceFaceRecognitionCount },
            { item: '结构分析', count: d.deviceStructuralAnalysisCount },
            { item: '智能监控', count: d.deviceCyberMonitorCount },
            { item: '车辆识别', count: d.deviceVehicleRecognitionCount }
          ], d.deviceTotalCount);
          // 设备类型
          this.getChar13Data([
            { item: '其它', amount: d.deviceOtherCount},
            { item: '半球机', amount: d.deviceDomeCameraCount},
            { item: '枪机', amount: d.deviceGunCount},
            { item: '球机', amount: d.deviceDomeCount}
          ], d.deviceTotalCount);
        }
      }).catch(error => {
        console.log("apiDeviceTotalList error：", error);
      });
    },

    setChar12Heigt (val) {
      if (isNaN(val)) { return 20; }
      let _h = this.contentHeight1 - 180;
      if (_h < 0) { _h = 0; }
      let _th = (val / (this.videoSum.gq + this.videoSum.bq) + 0) * _h;
      return _th;
    },

    getChar11Data (data, total) {
      /* const data = [
        { item: '人脸识别', count: 275 },
        { item: '结构分析', count: 115 },
        { item: '智能监控', count: 120 },
        { item: '结构分析2', count: 350 }
      ]; */
      this.statistics11(data, total);
    },
    statistics11 (data, total) {
      let chart = null;
      if (this.charts.chart11) {
        this.charts.chart11.clear();
        chart = this.charts.chart11;
      } else {
        let temp = document.getElementById('charContainer11');
        chart = new G2.Chart({
          container: 'charContainer11',
          forceFit: true,
          padding: [ 0, 120, 0, 0 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      let dv = new View().source(data);
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
          var markerDom = '<div class="stat11_leg_marker" style="background-color:' + color + '"></div>';
          var markerDom2 = '<i class="stat11_leg_marker2" style="background-color:' + color + '"></i>';
          var percentDom = '<div class="stat11_leg_percent">' + (dv.rows[index].percent * 100).toFixed(0) + '%' + '</div>';
          var nameDom = '<div class="stat11_leg_name com_keepall">' + value + '</div>';
          return '<div class="g2-legend-list-item">' + markerDom + markerDom2 + percentDom + nameDom + '</div>';
        }
      });
      chart.coord('theta', {
        radius: 0.75,
        innerRadius: 0.6
      });
      chart.tooltip({
        showTitle: false,
        itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
      });
      // 辅助文本
      chart.guide().html({
        position: ['50%', '50%'],
        html: '<div style="color:#0C70F8;text-align: center;width: 10em;">' +
          '<div style="font-size: 20px;font-weight: bold;">' + total + '</div>' +
          '<div style="font-size: 14px;">设备智能化</div></div>',
        alignX: 'middle',
        alignY: 'middle'
      });
      // console.log('1111', chart.intervalStack().position('percent').color());
      chart.intervalStack().position('percent')
        .color('item', ['#0FB1FF', '#0C70F8', '#6262FF', '#0C70F8'])
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
        offset: -10,
        textStyle: {
          fill: '#fff',
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

      this.charts.chart11 = chart;
    },
    getChar13Data (data, total) {
      /* let data = [
        { item: '其它', amount: 1000, percent: 0.15, percent2: 1},
        { item: '半球机', amount: 1500, percent: 0.25, percent2: 1},
        { item: '枪机', amount: 3000, percent: 0.3, percent2: 1},
        { item: '球机', amount: 5000, percent: 0.5, percent2: 1}
      ];
      this.typeData = data.concat([]).reverse(); */
      this.statistics13(data, total);
    },
    statistics13 (data, total) {
      let chart = null;
      if (this.charts.chart13) {
        this.charts.chart13.clear();
        chart = this.charts.chart13;
      } else {
        let temp = document.getElementById('charContainer13');
        chart = new G2.Chart({
          container: 'charContainer13',
          forceFit: true,
          padding: [ 24, 200, 24, 24 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }

      let dv = new View().source(data);
      // 百分比
      dv.transform({
        type: 'percent',
        field: 'amount',
        dimension: 'item',
        as: 'percent'
      });
      // 排序依据，和原生js的排序callback一致
      /* dv.transform({
        type: 'sort',
        callback(a, b) {
          return a.percent - b.percent;
        }
      }); */
      dv.transform({
        type: 'sort-by',
        fields: [ 'percent' ], // 根据指定的字段集进行排序，与lodash的sortBy行为一致
        order: 'ASC'        // 默认为 ASC，DESC 则为逆序
      });
      // impute 补全列/补全字段
      dv.transform({
        type: 'impute',
        field: 'percent2',       // 待补全字段
        // groupBy: [ 'value' ], // 分组字段集（传空则不分组）
        method: 'value',  // 补全常量
        value: 1     // 补全字段值时执行的规则
      });

      /* dv.transform({
        type: 'aggregate', // 别名summary
        fields: ['amount'],        // 统计字段集
        operations: ['count'],    // 统计操作集
        as: ['total'],            // 存储字段集
        groupBy: []        // 分组字段集
      }) */
      // console.log('13 dv:', dv);
      this.typeData = dv.rows.concat([]).reverse();
      total = 0;
      for (let i = 0; i < this.typeData.length; i++) {
        total += this.typeData[i].amount;
      }
      this.typeTotal = total;

      let view2 = chart.view();
      view2.source(dv, {
        'percent2': {
          min: 0,
          max: 1
        }
      });
      view2.tooltip(false);
      // view2.legend(false);
      view2.axis(false);
      view2.coord('polar', {
        innerRadius: 0.1
      }).transpose();
      view2.interval().position('item*percent2').color('percent2', '#F2F2F2');

      chart.source(dv, {
        'percent': {
          min: 0,
          max: 1
        }
      });
      chart.tooltip({
        title: 'item'
      });
      chart.legend(false);
      chart.coord('polar', {
        innerRadius: 0.1
      }).transpose();
      chart.interval().position('item*percent')
        .color('percent', this.typeColors)
        .tooltip('percent', function(val) {
          return {
            name: '占比',
            value: (val * 100).toFixed(0) + '%'
          };
        }).label('percent', {
          offset: -5,
          formatter: (text) => {
            return (text * 100).toFixed(0) + '%';
          },
          textStyle: {
            rotate: 0,
            fill: '#ffffff'
          }
        });
      data.map(function(obj) {
        chart.guide().text({
          position: [obj.item, 0],
          content: obj.item + ' ',
          style: {
            textAlign: 'right',
            stroke: '#666666'
          }
        });
      });
      chart.render();
      this.charts.chart13 = chart;
    },

    getChar2Data () {
      let data = [0.8, 0.64, 0.95];
      this.runingStates = data;
      this.statistics2(data);
    },
    statistics2 (data) {
      let colors = [
        'l(270) 0:#1990F5 1:#2DCAFF',
        'l(270) 0:#0576EC 1:#1AAAFF',
        'l(270) 0:#8949F3 1:#AE7DFE'
      ];
      for (let i = 0; i < data.length; i++) {
        let sid = 'charContainer2' + (i + 1);
        let temp1 = document.getElementById(sid);
        let chart = new G2.Chart({
          container: sid,
          forceFit: true,
          padding: [ 0, 0, 0, 0 ],
          width: G2.DomUtil.getWidth(temp1),
          height: G2.DomUtil.getHeight(temp1)
        });
        let sdata = [], iT = 0, iF = 1, idi = data[i];
        if (!isNaN(idi)) {
          iT = Number(idi);
          iF = 1 - iT;
          if (iT > 1) { iT = 1; }
          if (iT < 0) { iT = 0; }
          if (iF > 1) { iF = 1; }
          if (iF < 0) { iF = 0; }
        }
        sdata.push({ type: 'f', value: iF });
        sdata.push({ type: 'T', value: iT });
        chart.source(sdata);
        chart.tooltip(false);
        chart.legend(false);
        chart.coord('theta', {
          radius: 0.9,
          innerRadius: 0.82
        });
        chart.intervalStack().position('value').color('type', ['#eceef1', colors[i]]).opacity(1);
        chart.render();
      }
    },

    searchForm3Submit () {
      const data = [
        { genre: '卢峰镇', sold: 275 },
        { genre: '桥江镇', sold: 115 },
        { genre: '江口镇', sold: 120 },
        { genre: '大华镇', sold: 350 },
        { genre: '新田乡', sold: 150 },
        { genre: '卢峰镇2', sold: 190 },
        { genre: '外埠镇', sold: 220 }
      ]; // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。 
      this.statistics3(data);
    },
    statistics3 (data) {
      let chart = null;
      if (this.charts.chart3) {
        this.charts.chart3.clear();
        chart = this.charts.chart3;
      } else {
        let temp = document.getElementById('charContainer3');
        chart = new G2.Chart({
          container: 'charContainer3',
          forceFit: true,
          padding: [ 12, 24, 60, 60 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      // Step 2: 载入数据源
      chart.source(data, {
        'sold': {
          min: 0
        }
      });
      chart.legend(false);
      // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
      chart.interval()
        .position('genre*sold')
        .color('genre', [ 'l(270) 0:#00A2FF 1:#0C70F8' ])
        .size(20)
        .shape('cylinder');
      // Step 4: 渲染图表
      chart.render();
      this.charts.chart3 = chart;
    },
    searchForm4Submit () {
      const data = [
        { name: '卢峰镇', '总数': 275, '在线': 140 },
        { name: '桥江镇', '总数': 250, '在线': 192 },
        { name: '江口镇', '总数': 360, '在线': 50 },
        { name: '大华镇', '总数': 180, '在线': 100 },
        { name: '新田乡', '总数': 255, '在线': 200 },
        { name: '卢峰镇2', '总数': 332, '在线': 90 },
        { name: '外埠镇', '总数': 180, '在线': 170 }
      ]; // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。 
      this.statistics4(data);
    },
    statistics4 (data) {
      let chart = null;
      if (this.charts.chart4) {
        this.charts.chart4.clear();
        chart = this.charts.chart4;
      } else {
        let temp = document.getElementById('charContainer4');
        chart = new G2.Chart({
          container: 'charContainer4',
          forceFit: true,
          padding: [ 36, 24, 60, 60 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      let dv = new View().source(data);
      dv.transform({
        type: 'fold',
        fields: ['总数', '在线'], // 展开字段集
        key: 'type', // key字段
        value: 'value' // value字段
      });
      // Step 2: 载入数据源
      chart.source(dv, {
        name: {
          range: [0, 1]
        },
        'value': {
          min: 0
        }
      });
      chart.legend({
        position: 'top',
        title: null
      });
      chart.tooltip({
        crosshairs: {
          type: 'line'
        }
      });
      // Step 3：创建图形语法，绘制柱状图，由 genre 和 sold 两个属性决定图形位置，genre 映射至 x 轴，sold 映射至 y 轴
      chart.area().position('name*value').color('type', ['#8949f3', '#0c70f8']).shape('smooth').opacity(0.6);
      chart.line().position('name*value').color('type', ['#8949f3', '#0c70f8']).size(2).shape('smooth');
      chart.render();
      this.charts.chart4 = chart;
    },
    searchForm5Submit () {
      const data = [
        {area: '卢峰镇', '信号丢失': 38, '图像模糊': 23, '其他': 41},
        {area: '桥江镇', '信号丢失': 21, '图像模糊': 12, '其他': 2},
        {area: '江口镇', '信号丢失': 17, '图像模糊': 23, '其他': 3},
        {area: '大华镇', '信号丢失': 22, '图像模糊': 11, '其他': 42},
        {area: '新田乡', '信号丢失': 40, '图像模糊': 32, '其他': 21},
        {area: '卢峰镇2', '信号丢失': 9, '图像模糊': 13, '其他': 13},
        {area: '外埠镇', '信号丢失': 30, '图像模糊': 23, '其他': 19}
      ]; // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。 
      this.statistics5(data);
    },
    statistics5 (data) {
      let chart = null;
      if (this.charts.chart5) {
        this.charts.chart5.clear();
        chart = this.charts.chart5;
      } else {
        let temp = document.getElementById('charContainer5');
        chart = new G2.Chart({
          container: 'charContainer5',
          forceFit: true,
          padding: [ 36, 24, 60, 60 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      let dv = new View().source(data);
      dv.transform({
        type: 'fold',
        fields: ['信号丢失', '图像模糊', '其他'], // 展开字段集
        key: '报修原因', // key字段
        value: '报修次数', // value字段
        retains: ['area'] // 保留字段集，默认为除fields以外的所有字段
      });
      // Step 2: 载入数据源
      chart.source(dv, {
        '报修次数': {
          min: 0
        }
      });
      chart.legend({
        position: 'top',
        title: null
      });
      chart.coord();
      chart.axis('area', {
        label: {
          offset: 12
        }
      });
      chart.intervalStack().position('area*报修次数').color('报修原因', ['#6262FF', '#50CC62', '#0C70F8']).size(20);
      chart.render();
      this.charts.chart5 = chart;
    },
    searchForm6Submit () {
      const data = [
        {month: '一月', '正常': 11, '报修': 23, '异常': 41},
        {month: '二月', '正常': 23, '报修': 23, '异常': 41},
        {month: '三月', '正常': 15, '报修': 23, '异常': 41},
        {month: '四月', '正常': 32, '报修': 23, '异常': 41},
        {month: '五月', '正常': 21, '报修': 23, '异常': 41},
        {month: '六月', '正常': 13, '报修': 23, '异常': 41},
        {month: '七月', '正常': 45, '报修': 23, '异常': 41},
        {month: '八月', '正常': 23, '报修': 23, '异常': 41},
        {month: '九月', '正常': 39, '报修': 23, '异常': 41},
        {month: '十月', '正常': 12, '报修': 23, '异常': 41},
        {month: '十一月', '正常': 31, '报修': 23, '异常': 41},
        {month: '十二月', '正常': 22, '报修': 23, '异常': 41}
      ]; // G2 对数据源格式的要求，仅仅是 JSON 数组，数组的每个元素是一个标准 JSON 对象。 
      this.statistics6(data);
    },
    statistics6 (data) {
      let chart = null;
      if (this.charts.chart6) {
        this.charts.chart6.clear();
        chart = this.charts.chart6;
      } else {
        let temp = document.getElementById('charContainer6');
        chart = new G2.Chart({
          container: 'charContainer6',
          forceFit: true,
          padding: [ 36, 24, 60, 60 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      let dv = new View().source(data);
      dv.transform({
        type: 'fold',
        fields: ['正常', '报修', '异常'], // 展开字段集
        key: '状态', // key字段
        value: '数量' // value字段
        // retains: ['area'] // 保留字段集，默认为除fields以外的所有字段
      });
      // Step 2: 载入数据源
      chart.source(dv, {
        month: {
          range: [0, 1]
        },
        '数量': {
          min: 0
        }
      });
      chart.tooltip({
        crosshairs: {
          type: 'line'
        }
      });
      chart.axis('数量', {
        label: {
          formatter: function formatter(val) {
            return val;
          }
        }
      });
      chart.legend({
        position: 'top',
        title: null
      });
      chart.line().position('month*数量').color('状态').shape('smooth');
      chart.point().position('month*数量').color('状态').size(4).shape('circle').style({
        stroke: '#fff',
        lineWidth: 1
      });
      chart.render();
      this.charts.chart6 = chart;
    }

  },
  destroyed () {
    /* 销毁所有的图标对象 */
    for (let i in this.charts) {
      if (this.charts[i]) {
        this.charts[i].destroy();
      }
    }
  }
}
</script>
<style>
  .vi_stat11_leg, .vi_stat11_leg .g2-legend-list { overflow: hidden; }
  .vi_stat11_leg .g2-legend-list-item {
    position: relative;
    margin: 0 !important;
    padding-left: 35px; padding-bottom: 10px;
  }
  .vi_stat11_leg .stat11_leg_marker {
    position: absolute; top: 10px; left: 5px;
    width: 20px; height: 20px;
    border-radius: 50%;
    opacity: .4;
  }
  .vi_stat11_leg .stat11_leg_marker2 {
    position: absolute; top: 15px; left: 10px;
    width: 10px; height: 10px;
    border-radius: 50%;
  }
  .vi_stat11_leg .stat11_leg_percent {
    color: #333; font-weight: bold; font-size: 20px;
  }
  .vi_stat11_leg .stat11_leg_name {
    color: #666; font-size: 14px;
    overflow: hidden;
  }
</style>
<style lang="scss" scoped>
  .vi_stat {
    padding: 10px;
    > ul {
      overflow: hidden;
      > li {
        padding: 10px;
        width: 50%;
        float: left;
        > div.vi_stat_li {
          position: relative;
          width: 100%; height: 200px;
          border-radius:4px;
          > .vi_stat_lis {
            float: left;
            width: 50%; height: 100%;
            > div {
              width: 100%; height: 100%;
            }
          }
          > .vi_stat_lil { padding-right: 10px; }
          > .vi_stat_lir { 
            padding-left: 10px;
          }
          > .stat_li_t {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 80px;
            overflow: hidden;
            > h2 {
              float: left;
              font-weight: bold; font-size: 16px; color: #333;
              height: 80px; line-height: 80px;
              padding-left: 30px;
            }
            > .stat_li_tf {
              float: right;
              padding-right: 10px; padding-top: 25px;
            }
            &.stat_li_t2 {
              height: 60px;
              > h2 {
                height: 60px; line-height: 60px;
              }
            }
          }
          > .stat_li_c {
            padding-top: 80px;
            height: 100%;
            > .stat_li_cc {
              width: 100%; height: 100%;
            }
            &.stat_li_c2 {
              padding-top: 60px;
            }
          }
        }
      }
    }
  }
  .vi_stat_ul.vi_stat_ul1 {
    padding: 0;
    overflow: hidden;
    > div {
      width: 33.33%;
      float: left;
      padding: 10px;
      > div {
        position: relative;
        width: 100%; height: 360px;
        > .vi_stat_ul_t {
          position: absolute; top: 10px; left: 0;
          padding-left: 20px;
          width: 100%; height: 40px; line-height: 40px;
          font-size: 16px; color: #333; font-weight: bold;
        }
        > .vi_stat_ul_c {
          padding-top: 50px;
          width: 100%; height: 100%;
          position: relative;
        }
      }
    }
  }
  .stat_13_legend {
    position: absolute; top: 20px; right: 10px;
    min-width: 180px;
    > div {
      background-color: #fff;
      box-shadow:2px 1px 20px 0px rgba(29,168,249,0.12);
      border-radius:3px;
      padding: 10px 10px;
      color: #1E92FC;
      font-size: 12px;
      > span {
        display: inline-block;
        padding-right: 10px;
        font-size: 20px; font-weight: bold;
      }
    }
    > ul {
      padding: 0 10px 0 10px;
      overflow: hidden;
      > li {
        position: relative;
        height: 40px; line-height: 40px;
        padding-left: 20px;
        font-size: 18px; font-weight: bold; color: #333;
        overflow: hidden;
        > i {
          position: absolute; top: 12px; left: 10px;
          width: 3px; height: 16px;
          background-color: #000;
        }
        > span {
          float: right;
          font-size: 12px; font-weight: normal; color: #666;
        }
      }
    }
  }
  .stat_sbzs {
    overflow: hidden;
    width: 100%; height: 100%;
    padding: 10px 20px 30px 20px;
    > li {
      position: relative;
      float: left;
      width: 30%; height: 100%;
      padding: 0 10px;
      &:first-child {
        width: 40%;
      }
      > div {
        position: relative;
        width: 100%; height: 100%;
      }
      > .stat_sbzs_li {
        position: absolute; left: 50%; bottom: 0;
        width: 56px; height: 100%;
        margin-left: -28px;
        > ul {
          position: absolute; bottom: 50px; left: 0;
          width: 100%;
          overflow: hidden;
          > li {
            width: 100%;
            &:nth-child(1) {
              height: 16px;
              background: url(../../../../assets/img/video/vi_023.png) center center no-repeat;
              background-size: 100% 100%;
              &.stat_sbzs_sf2 {
                background: url(../../../../assets/img/video/vi_033.png) center center no-repeat;
                background-size: 100% 100%;
              }
            }
            &:nth-child(2) {
              position: relative;
              background: url(../../../../assets/img/video/vi_022.png) center center repeat-y;
              background-size: 100% auto;
              transition: height .4s ease-out .2s;
              > span {
                display: block;
                text-align: center;
                color: #fff; font-size: 14px; font-weight: bold;
                width: 100%; height: 20px; line-height: 20px;
                position: absolute; top: 50%; left: 0; z-index: 2;
                margin-top: -5px;
              }
              &.stat_sbzs_sf2 {
                background: url(../../../../assets/img/video/vi_032.png) center center repeat-y;
                background-size: 100% auto;
              }
            }
            &:nth-child(3) {
              height: 50px;
              background: url(../../../../assets/img/video/vi_021.png) center center no-repeat;
              background-size: 100% 100%;
              &.stat_sbzs_sf2 {
                background: url(../../../../assets/img/video/vi_031.png) center center no-repeat;
              background-size: 100% 100%;
              }
            }
          }
        }
        > div {
          position: absolute; bottom: 0; left: -12px;
          width: 80px;
          text-align: center;
          > div {
            color: #666; font-size: 12px;
            padding-bottom: 5px;
          }
          > p {
            color: #333; font-weight: bold; font-size: 16px;
          }
        }
      }
    }
    .stat_sbzs_t {
      position: relative;
      width: 100%; height: 100%;
      background:rgba(255,255,255,1);
      box-shadow: 2px 1px 20px 0px rgba(29,168,249,0.12);
      border-radius: 3px;
      > div {
        position: absolute; top: 20%; left: 0;
        text-align: center;
        color: #0C70F8; 
        width: 100%;
        > h2 {
          font-weight: bold; font-size: 22px;
          padding-bottom: 5px;
        }
        > p {
          font-size: 14px;
        }
      }
      > i {
        display: block;
        position: absolute; left: 50%; bottom: 20%;
        width: 64px; height: 30px;
        margin-left: -32px;
        background: url(../../../../assets/img/video/vi_011.png) center center no-repeat;
        background-size: 100% 100%;
        animation: fadeIn .6s ease-out .2s both;
      }
    }
  }

  .stat_sel_w {
    width: 130px;
  }
  .stat_bd_style {
    background-color: #fff;
    box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
  }
  .stat_bd_size {
    width: 100%; height: 100%;
  }

  .stat_c2 {
    overflow: hidden;
    height: 100%;
    padding: 0 20px 20px 20px;
    > li {
      float: left;
      width: 33.33%; height: 100%;
      padding: 0 10px 30px 10px;
      position: relative;
      > div {
        width: 100%; height: 100%;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 60% auto;
      }
      > p {
        position: absolute; bottom: 0; left: 0;
        width: 100%; height: 30px; line-height: 30px;
        text-align: center;
        color: #666; font-size: 14px;
      }
      > i {
        font-style: normal;
        position: absolute; top: 30%; left: 0;
        width: 100%;
        text-align: center;
        color: #333; font-weight: bold; font-size: 20px;
      }
      &:nth-child(1) {
        > div { background-image: url(../../../../assets/img/video/vi_041.png); }
      }
      &:nth-child(2) {
        > div { background-image: url(../../../../assets/img/video/vi_042.png); }
      }
      &:nth-child(3) {
        > div { background-image: url(../../../../assets/img/video/vi_043.png); }
      }
    }
  }
</style>
