<template>
  <div class="vi_stat">
    <ul>
      <li>
        <div class="vi_stat_li vi_stat_lih1 clearfix">
          <!-- 设备只能化 -->
          <div class="vi_stat_lis vi_stat_lil">
            <div class="stat_bd_style" id="charContainer11">
            </div>
          </div>
          <!-- 设备总数 -->
          <div class="vi_stat_lis vi_stat_lir">
            <div class="stat_bd_style">
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
      </li>
      <!-- 运行状况（实时） -->
      <li>
        <div class="vi_stat_li vi_stat_lih1 stat_bd_style">
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
export default {
  data () {
    return {
      contentHeight1: 200,
      videoSum: {
        gq: 123310,
        bq: 30420
      },
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
        chart3: null,
        chart4: null,
        chart5: null,
        chart6: null
      }
    }
  },
  mounted () {
    this.initContentSize();
    this.getChar11Data();
    this.getChar2Data();
    this.searchForm3Submit();
    this.searchForm4Submit();
    this.searchForm5Submit();
    this.searchForm6Submit();
  },
  methods: {
    // 
    initContentSize () {
      let itemW = ($(window).width() - 200 - 20 * 3) / 2;
      let _contentHeight1 = itemW * 378 / 830;
      this.contentHeight1 = _contentHeight1;
      $('.vi_stat_lih1').height(_contentHeight1);
      $('.vi_stat_lih2').height(itemW * 468 / 830);
    },

    setChar12Heigt (val) {
      if (isNaN(val)) { return 20; }
      let _h = this.contentHeight1 - 180;
      if (_h < 0) { _h = 0; }
      let _th = (val / (this.videoSum.gq + this.videoSum.bq) + 0) * _h;
      return _th;
    },

    getChar11Data () {
      const data = [
        { item: '人脸识别', count: 275 },
        { item: '结构分析', count: 115 },
        { item: '智能监控', count: 120 },
        { item: '结构分析2', count: 350 }
      ];
      this.statistics11(data);
    },
    statistics11 (data) {
      let chart = null;
      if (this.charts.chart11) {
        this.charts.chart11.clear();
        chart = this.charts.chart11;
      } else {
        let temp = document.getElementById('charContainer11');
        chart = new G2.Chart({
          container: 'charContainer11',
          forceFit: true,
          padding: [ 12, 120, 12, 6 ],
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
        itemTpl: function itemTpl(value, color) {
          var markerDom = '<div class="stat11_leg_marker" style="background-color:' + color + '"></div>';
          var markerDom2 = '<i class="stat11_leg_marker2" style="background-color:' + color + '"></i>';
          var percentDom = '<div class="stat11_leg_percent">30%</div>';
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
          '<div style="font-size: 20px;font-weight: bold;">' + 123123 + '</div>' +
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
            .stat_sbzs {
              overflow: hidden;
              width: 100%; height: 100%;
              padding: 30px 20px;
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
  .stat_sel_w {
    width: 130px;
  }
  .stat_bd_style {
    background-color: #fff;
    box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
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
