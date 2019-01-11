<template>
  <div class="vi_stat">
    <ul>
      <li>
        <div class="vi_stat_li vi_stat_lih1"></div>
      </li>
      <li>
         <div class="vi_stat_li vi_stat_lih1"></div>
      </li>
      <!-- 设备建设区域分布 -->
      <li>
        <div class="vi_stat_li vi_stat_lih2">
          <div class="stat_li_t">
            <h2>设备建设区域分布</h2>
            <el-form :inline="true" :model="searchForm3" class="stat_li_tf" size="small">
              <el-form-item>
                <el-select style="width: 150px;" v-model="searchForm3.area" placeholder="选择行政范围">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select style="width: 150px;" v-model="searchForm3.year" placeholder="选择建设年份">
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
        <div class="vi_stat_li vi_stat_lih2">
          <div class="stat_li_t">
            <h2>各单位的设备在线情况</h2>
            <el-form :inline="true" :model="searchForm4" class="stat_li_tf" size="small">
              <el-form-item>
                <el-select style="width: 150px;" v-model="searchForm4.dept" placeholder="选择上级单位">
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
      <li>
        <div class="vi_stat_li vi_stat_lih2"></div>
      </li>
      <li>
        <div class="vi_stat_li vi_stat_lih2"></div>
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
      searchForm3: {
        area: '',
        year: ''
      },
      searchForm4: {
        dept: ''
      },
      // 图标集合
      charts: {
        chart3: null,
        chart4: null,
        chart5: null,
        chart6: null
      }
    }
  },
  mounted () {
    this.initContentSize();
    this.searchForm3Submit();
    this.searchForm4Submit();
  },
  methods: {
    // 
    initContentSize () {
      let itemW = ($(window).width() - 200 - 20 * 3) / 2;
      $('.vi_stat_lih1').height(itemW * 378 / 830);
      $('.vi_stat_lih2').height(itemW * 468 / 830);
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
      chart.source(data);
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
      chart.area().position('name*value').color('type').shape('smooth');
      chart.line().position('name*value').color('type').size(2).shape('smooth');
      chart.render();
      this.charts.chart4 = chart;
    },

  }
}
</script>
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
          background-color: #fff;
          box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
          border-radius:4px;
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
          }
          > .stat_li_c {
            padding-top: 80px;
            height: 100%;
            > .stat_li_cc {
              width: 100%; height: 100%;
            }
          }
        }
      }
    }
  }
</style>
