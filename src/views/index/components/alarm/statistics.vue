<template>
<vue-scroll>
  <div class="statistics_info">
    <!-- 查询条件 -->
    <div class="e_stat_s search-box">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-date-picker
            class="e_stat_dp vl_date"
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
        <!-- <el-form-item>
          <el-cascader
            expand-trigger="hover"
            :options="options"
            v-model="searchForm.areaId"
            @change="handleChange"
            placeholder="请选择省 / 市 / 县 / 乡">
          </el-cascader>
        </el-form-item> -->
        <el-form-item>
          <el-button class="operation_btn blue_btn" :loading="searchLoading" @click="searchData">筛选</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="operation_btn" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-loading = "searchLoading">
    <!-- 统计图表 -->
    <ul class="e_stat_tt">
      <li>
          <div>
            <h4 class="stat_title">告警总量</h4>
            <div class="stat_tt_item" id="stat_1">
            </div>
          </div>
        </li>
        <li>
          <div>
            <h4 class="stat_title">告警等级分布</h4>
            <div class="stat_tt_item" id="stat_2">
            </div>
          </div>
        </li>
    </ul>
    <!-- 区域分布列表 -->
    <div class="alarm_area">
      <h4>告警区域分布</h4>
      <el-table :data="almAreaList">
        <el-table-column prop="areaName" label="区域" align="center"></el-table-column>
        <el-table-column prop="levelTotal" label="总告警" align="center"></el-table-column>
        <el-table-column prop="level1Count" label="一级告警" align="center"></el-table-column>
        <el-table-column prop="level2Count" label="二级告警" align="center"></el-table-column>
        <el-table-column prop="level3Count" label="三级告警" align="center"></el-table-column>
        <el-table-column prop="level4Count" label="四级告警" align="center"></el-table-column>
        <el-table-column prop="level5Count" label="五级告警" align="center"></el-table-column>
      </el-table>
    </div>
  </div>
  </div>
</vue-scroll>
</template>
<script>
import G2 from '@antv/g2';
import {formatDate} from '@/utils/util';
import {getStatistics} from '@/views/index/api/api.control.js';
import {getAreaList} from '@/views/index/api/api.manage.js';
export default {
  data () {
    return {
      searchForm: {
        dateTime: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 30), new Date()],
        areaId: []
      },
      options: [], 
      searchLoading: false,
      pickerOptions2: {
        disabledDate: (time) => {
          console.log("-------------",time.getTime(),new Date().getTime())
          return time.getTime() > new Date().getTime()
        },
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
        ],
      },
      charts: {
        chart1: null,
        chart2: null,
      },
      almAreaList: null,
      colors: [
        ['#33B5FF', '#03E38A', '#F7DA6D', '#0668E4', '#7BF55B', '#6262FF'],
        [
          [51,181,255],
          [3,227,138],
          [247,218,109],
          [6,104,228],
          [123,245,91]
        ]
      ],
    }
  },
  mounted () {
    this.intitReportSize();
    this.getAreas();
    this.searchData();
  },
  destroyed () {
    if (this.charts.chart1) {
      this.charts.chart1.destroy();
    }
    if (this.charts.chart2) {
      this.charts.chart2.destroy();
    }
  },
  methods: {
    intitReportSize () {
      let $list = $('.stat_tt_item');
      if ($list && $list.length > 0) {
        let iw = $list.width();
        $list.height(iw * 0.45);
      }
    },
    // 搜索数据
    searchData () {
      this.initDatas();
    },
    //重置
    reset() {
      this. searchForm = {
        dateTime: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 30), new Date()],
        areaId: []
      }
      this.searchData();
    },
    //获取省市区数据
    getAreas() {
      const pid = 1
      getAreaList(pid).then(res => {
        this.options = this.getNormalList(...res.data.childList);
        console.log("================",this.options)
      })
    },
    getNormalList(...data) {
      for(let item of data) {
        item['label'] = item.cname;
        item['value'] = item.uid;
        if(item.childList && item.childList.length > 0 ) {
           item['children'] = item.childList;
           delete item.childList;
           this.getNormalList(...item.children)
        }
      }
      return data;
    },
    //获取告警数据
    initDatas() {
      this.searchLoading = true;
      this.$showD
      let params = this.getSearchParams();
      getStatistics(params).then( res => {
        if(res.data) {
          let _statsData1 = []
          let _statsData2 = []
          this.almAreaList = res.data.almAreaList
          if(res.data.almCountList && res.data.almCountList.length > 0) {
            for (let item of res.data.almCountList) {
                _statsData1.push({
                  year: item.date,
                  value: Number(item.totalCount)
                })
            }
          }
          if(res.data.almLevelList && res.data.almLevelList.length > 0) {
            let total = 0
            res.data.almLevelList.forEach(data => {
              total += data.count
            });
            for (let item of res.data.almLevelList) {
               _statsData2.push({
                 item: item.level,
                 count: item.count,
                 percent: item.count/total
               })
            }
          }
          if(res.data.almAreaList && res.data.almAreaList.length > 0) {
            let tLevel1Count = 0, tLevel2Count = 0,tLevel3Count = 0,tLevel4Count = 0,tLevel5Count = 0,tLevelTotal = 0
            for (let item of res.data.almAreaList) {
               tLevel1Count += item.level1Count
               tLevel2Count += item.level2Count
               tLevel3Count += item.level3Count
               tLevel4Count += item.level4Count
               tLevel5Count += item.level5Count
               tLevelTotal += item.levelTotal
            }
            this.almAreaList.unshift({
              areaName: '总计',
              level1Count: tLevel1Count,
              level2Count: tLevel2Count,
              level3Count: tLevel3Count,
              level4Count: tLevel4Count,
              level5Count: tLevel5Count,
              levelTotal: tLevelTotal,
            })
            console.log("-------------",this.almAreaList)
          }
          console.log("=======",_statsData2)
          this.setStats1(_statsData1);
          this.setStats2(_statsData2);
        }
        console.log("-----------",res)
        this.$nextTick(() => {
          this.searchLoading = false
        })
      }).catch( ()=> {
        this.searchLoading = false
      })
    },
    handleChange(value) {
      console.log(value);
    },
    // 查询参数
    getSearchParams () {
      let areaId =  [];
      if(this.searchForm.areaId && this.searchForm.areaId.length > 0) {
        areaId = this.searchForm.areaId[this.searchForm.areaId.length -1]
      }
      return {
        'startTime': formatDate(this.searchForm.dateTime[0], 'yyyy-MM-dd'),
        'endTime': formatDate(this.searchForm.dateTime[1], 'yyyy-MM-dd'),
        'areaId': areaId
      }
    },
    //告警总量面积图
    setStats1 (data) {
      let chart = null;
      if (this.charts.chart1) {
        this.charts.chart1.clear();
        chart = this.charts.chart1;
      } else {
        let temp = document.getElementById('stat_1');
        console.log(G2.DomUtil.getWidth(temp),G2.DomUtil.getHeight(temp))
        chart = new G2.Chart({
          container: 'stat_1',
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
      chart.scale({
        value: {
          range: [ 0, 1 ],
          min: 0,
        },
        year: {
          tickCount: 4,
        }
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
      this.charts.chart1 = chart;
    },
    //环图
    setStats2 (data) {
      let chart = null;
      if (this.charts.chart2) {
        this.charts.chart2.clear();
        chart = this.charts.chart2;
      } else {
        // 可以通过调整这个数值控制分割空白处的间距，0-1 之间的数值
        let sliceNumber = 0.001;

        // 自定义 other 的图形，增加两条线
        G2.Shape.registerShape('interval', 'sliceShape', {
          draw: function draw(cfg, container) {
            if (cfg.origin._origin.percent > 0) {
              let points = cfg.points;
              console.log("-----======------",points)
              let path = [];
              path.push(['M', points[0].x, points[0].y]);
              path.push(['L', points[1].x, points[1].y - sliceNumber]);
              path.push(['L', points[2].x, points[2].y - sliceNumber]);
              path.push(['L', points[3].x, points[3].y]);
              path.push('Z');
              path = this.parsePath(path);
              console.log("123243444444444444444",path)
              return container.addShape('path', {
                attrs: {
                  fill: cfg.color,
                  path: path
                }
              });
            }
          }
        });

        let temp = document.getElementById('stat_2');
        chart = new G2.Chart({
          container: 'stat_2',
          forceFit: true,
          padding: [ 3 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      let _this = this;
      chart.source(data);
      chart.coord('theta', {
        radius: 0.7,
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
          offset: 40,
          htmlTemplate: (text, item, index) => {
            if (item.point.percent > 0) {
              let levelName = null;
              console.log("============",item)
              if (item.point.item === '一级报警') {
                levelName = '1级告警';
              } else if (item.point.item === '二级报警') {
                levelName = '2级告警';
              } else if (item.point.item === '三级报警') {
                levelName = '3级告警';
              } else if (item.point.item == '四级报警') {
                levelName = '4级告警';
              } else if (item.point.item == '五级报警') {
                levelName = '5级告警';
              } else {
                levelName = '其他告警';
              }
              return '<div class="tab_one"><div class="icon_number"><i class="parent_i" style="background-color: rgba(' + _this.colors[1][index][0] + ', ' + _this.colors[1][index][1] + ', ' + _this.colors[1][index][2] + ', 0.14)">'+
                      '<i class="child_i" style="background-color: rgba(' + _this.colors[1][index][0] + ', ' + _this.colors[1][index][1] + ', ' + _this.colors[1][index][2] + ', 1)"></i></i><span>'+ item.point.count +'件</span></div>'+
                      '<div class="level_percent"><span>'+ levelName +'</span><span>'+ (item.point.percent * 100).toFixed(2) +'%</span></div></div>';
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
      this.charts.chart2 = chart;
    },
  }
}
</script>
<style lang="scss" scoped>
.statistics_info {
  width: 100%;
  height: 100%;
  padding: 20px;
  .e_stat_s {
    background-color: #fff;
    .el-form {
      padding: 15px 20px;
      .el-form-item {
        margin-bottom: 0;
        margin-right: 20px;
        .el-cascader {
          width: 350px;
        }
      }
    }
    .operation_btn {
      padding: 0;
      width: 100px;
      height: 40px;
      text-align: center;
      color: #666;
      margin-left: 10px;
    }   
    .blue_btn {
      background: #0C70F8;
      color: #ffffff;
    }
  }
  .e_stat_tt {
    overflow: hidden;
    > li {
      float: left;
      padding: 20px 20px 0 0;
      &:nth-child(1) {
        width: 50%;
      }
      &:nth-child(2) {
        width: 50%;
        padding-right: 0;
      }
      > div {
        box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
        border-radius:4px;
        padding: 20px 0 10px 0;
        background-color: #fff;
      }
      h4 {
        color: #333333;
        font-weight: bold;
        font-size: 17px;
        padding: 0 0 20px 40px;
      }
    }
  }
  .alarm_area {
    margin: 20px 0 30px 0;
    box-shadow: 0px 5px 16px 0px rgba(169,169,169,0.2);
    border-radius: 4px;
    >h4 {
      color: #333;
      font-size: 17px;
      font-weight: bold;
      padding: 30px 0 27px 40px;
      background: #fff;
    }
  }
}
</style>
<style lang="scss">
.e_stat_tb_ld_alarm {
  left: 83% !important;
  right: auto !important;
}
.tab_one {
  box-shadow: 0px 5px 16px 0px rgba(169,169,169,0.2);
  background-color: #ffffff;
  padding: 10px;
  min-width: 126px;
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
#stat_2 {
  .g-label {
    &:hover {
      z-index: 999;
      cursor: pointer;
    }
  }
}
.alarm_content {
  .__view {
    width: 100% !important;
  }
}

</style>


