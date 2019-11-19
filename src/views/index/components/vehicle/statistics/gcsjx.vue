<template>
  <div class="gcsj_container">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{name: 'vehicle'}">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>过车数据统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="gcsj_box">
      <div class="gcsj_box_top">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" size="medium">
          <el-form-item label="选择设备">
            <el-select v-model="formInline.region" placeholder="选择设备">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择时间">
            <el-date-picker
                v-model="formInline.region"
                type="daterange"
                range-separator="至"
                :editable="false"
                :clearable="false"
                time-arrow-control
                class="vl_date"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="过车归属地">
            <el-select v-model="formInline.region" placeholder="活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">统计</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="gcsj_box_top_2">
        <ul>
          <li>
            <div>
              <i class="vl_icon vl_icon_vehicle_gcsj_01"></i>
              <div>
                <span>419</span>
                <span>设备数(个)</span>
              </div>
            </div>
          </li>
          <li>
            <div>
              <i class="vl_icon vl_icon_vehicle_gcsj_02"></i>
              <div>
                <span>419</span>
                <span>过车总数（万次）</span>
              </div>
            </div>
          </li>
          <li>
            <div>
              <i class="vl_icon vl_icon_vehicle_gcsj_03"></i>
              <div>
                <span>419</span>
                <span>车辆总数（辆）</span>
              </div>
            </div>
          </li>
          <li>
            <div>
              <i class="vl_icon vl_icon_vehicle_gcsj_04"></i>
              <div>
                <span>419</span>
                <span>外地车数（辆）</span>
              </div>
            </div>
          </li>
          <li>
            <div>
              <i class="vl_icon_vehicle_gcsj_05"></i>
              <div>
                <span>419</span>
                <span>初次入城车数(辆)</span>
              </div>
            </div>
          </li>
          <li>
            <div>
              <i class="vl_icon_vehicle_gcsj_06"></i>
              <div>
                <span>419</span>
                <span>行为异常（次）</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="gcsj_box_cot">
        <div class="gcsj_box_cot_1">
          <div style="padding-right: 10px">
            <div>
              <h1>车辆归属地情况</h1>
              <div style="display: flex; border-bottom: 1px solid #F2F2F2; justify-content: center">
                <div id="province" style="min-height: 370px; width: 60%; max-width: 450px;"></div>
                <div class="gcsj_box_cot_1_toop">
                  <ul>
                    <li></li>
                    <li>
                      <div class="point">2</div>
                      <div class="text">
                        <span>湖北</span>
                        <span>1987辆</span>
                      </div></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                  </ul>
                </div>
              </div>
              <ul class="gcsj_box_cot_1_toop_bot">
                <li><div></div><div>3501以上</div></li>
                <li><div style="background-color: #AB88E0"></div><div>3001-3500</div></li>
                <li><div style="background-color: #A09AF3"></div><div>2501-3000</div></li>
                <li><div style="background-color: #A0AEFF"></div><div>2001-2500</div></li>
                <li><div style="background-color: #AEC8FF"></div><div>1501-2000</div></li>
                <li><div style="background-color: #C3DEFF"></div><div>1001-1500</div></li>
                <li><div style="background-color: #D4F1FF"></div><div>501-1000</div></li>
                <li><div style="background-color: #EFFAFF"></div><div>0-500</div></li>
              </ul>
            </div>
          </div>
          <div>
            <div>
              <h1>车辆分类情况</h1>
              <div style="display: flex;  justify-content: center">
                <div id="mountNode1" style="min-height: 450px; width: 50%;"></div>
                <div class="gcsj_box_cot_1_toop_b">
                  <ul class="gcsj_box_cot_1_toop_b_r">
                    <li v-for="(item, index) in item1" :key="index"><span :style="'background'+ ':' + item.color"></span><span>{{item.text}}</span><span>2217辆</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="gcsj_box_cot_2">
          <div>
            <h1>各时间段的过车数</h1>
            <p>过车次数 (万次)</p>
            <div id="mountNode2" style="height: 300px; width: 100%; padding-left: 36px"></div>
          </div>
          <div>
            <h1>车辆品牌排名 (Top5)</h1>
            <p>数量 (辆)</p>
            <div id="mountNode3" style="height: 300px; width: 100%; padding-left: 36px"></div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import G2 from '@antv/g2';
  import {DataSet} from '@antv/data-set';
  export default {
    name: "gcsjx",
    data() {
      return {
        formInline: {
          user: '',
          region: '',
          colors:["#FFF", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"],
          currentAreaNode: void 0,
        },
        item1: [
          {color: '#AC76DA', text: 'SUV/MPv'},
          {color: '#A8D8FF', text: '其他类型'},
          {color: '#ECAFFE', text: '面包车'},
          {color: '#91F3D3', text: '消防车'},
          {color: '#94E6F0', text: '客车'},
          {color: '#8EEF98', text: '大型货车'},
          {color: '#A6A9FF', text: '小轿车'},
          {color: '#62C2FF', text: '小货车'},
          {color: '#DAAFFE', text: '货车'},
          {color: '#83AEFE', text: '救护车'},
          {color: '#C9AFFE', text: '中型客车'},
          {color: '#81F1EF', text: '渣土车'},
          {color: '#83AEFE', text: '小型客车'},
          {color: '#81D8F1', text: '摩托车'},
          {color: '#83C2FE', text: '中型货车'},
          {color: '#62C2FF', text: '非机动车'},
          ],
        data1:[{
          item: '事例一',
          count: 40,
          percent: 0.4
        }, {
          item: '事例二',
          count: 21,
          percent: 0.21
        }, {
          item: '事例三',
          count: 17,
          percent: 0.17
        }, {
          item: '事例四',
          count: 13,
          percent: 0.13
        }, {
          item: '事例五',
          count: 9,
          percent: 0.09
        }],
        data:[{
          month: 'Jan',
          value: 51
        }, {
          month: 'Feb',
          value: 91
        }, {
          month: 'Mar',
          value: 34
        }, {
          month: 'Apr',
          value: 47
        }, {
          month: 'May',
          value: 63
        }, {
          month: 'June',
          value: 58
        }, {
          month: 'July',
          value: 56
        }, {
          month: 'Aug',
          value: 77
        }, {
          month: 'Sep',
          value: 99
        }, {
          month: 'Oct',
          value: 106
        }, {
          month: 'Nov',
          value: 88
        }, {
          month: 'Dec',
          value: 56
        }],
        data2:[{
          time: '本田',
          value: 30
        }, {
          time: '10:00-11:00',
          value: 90
        }, {
          time: '11:00-12:00',
          value: 50
        }, {
          time: '12:00-13:00',
          value: 30
        }, {
          time: '13:00-14:00',
          value: 70
        }]
      }
    },
    mounted () {
      let _this = this
      window.AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], function(DistrictExplorer) {
        // 创建一个实例
        var districtExplorer = window.districtExplorer = new DistrictExplorer({
          eventSupport: true, //打开事件支持
          // map: map
        });

        // feature被点击
        districtExplorer.on('featureClick', function(e, feature) {
          var props = feature.properties;
          //如果存在子节点
          if (props.childrenNum > 0) {
            //切换聚焦区域
            switch2AreaNode(props.adcode);
          }
        });

        //外部区域被点击
        districtExplorer.on('outsideClick', function(e) {
          districtExplorer.locatePosition(e.originalEvent.lnglat, function() {
            switch2AreaNode(100000);
          }, {
            evelLimit: 2
          });
        });
        //切换区域
        function switch2AreaNode(adcode, callback) {
          if (_this.currentAreaNode && '' + _this.currentAreaNode.getAdcode() === '' + adcode) {
            return;
          }

          loadAreaNode(adcode, function(error, areaNode) {
            if (error) {
              if (callback) {
                callback(error);
              }
              return;
            }
            _this.currentAreaNode = window.currentAreaNode = areaNode;
            if (callback) {
              callback(null, areaNode);
            }
          });
        }

        //加载区域
        function loadAreaNode(adcode, callback) {
          console.log(adcode)
          districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
            if (error) {
              if (callback) {
                callback(error);
              }
              return;
            }
            console.dir(areaNode)
            _this.renderG2Map(areaNode); // 使用 G2 绘制地图

            if (callback) {
              callback(null, areaNode);
            }
          });
        }

        // 浙江
        switch2AreaNode(100000);
      });
      this.mountNode1()
      this.mountNode2 ()
      this.mountNode3()
    },
    methods: {
      renderG2Map(areaNode) {
        var provinceChart = void 0;
        console.log(areaNode)
        var adcode = areaNode.getAdcode();
        var geoJSON = areaNode.getSubFeatures(); // 获取 geoJSON 数据

        provinceChart && provinceChart.destroy();
        provinceChart = null;
        if (!geoJSON || this.currentAreaNode && '' + this.currentAreaNode.getAdcode() === '' + adcode) {
          return;
        }
        var dv = this.processData(geoJSON);
        let temp = document.getElementById('province');
        // end: 计算地图的最佳宽高
        provinceChart = new G2.Chart({
          container: 'province',
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp),
          padding: 0,
          forceFit: true,
        });
        provinceChart.source(dv);
        provinceChart.axis(false);
        provinceChart.tooltip({
          showTitle: false
        });
        provinceChart.polygon().position('longitude*latitude').style({
          stroke: '#fff',
          lineWidth: 1,
      }).color('value*name', (value, name) => {
          if (name === "内蒙古自治区") {
            return '#04E38A';
          }
          if (value >=  3501){
            return '#AC76DA';
          }else if(value <  3501&& value >=  3001){
            return '#AB88E0';
          }else if (value <  3000&& value >=  2501) {
            return '#A09AF3';
          }else if(value <  2500&& value >=  2001) {
            return '#A0AEFF';
          }else if (value <  2000&& value >=  1501){
            return '#AEC8FF';
          }else if (value <  1500&& value >=  1001){
            return '#C3DEFF';
          }else if (value <  1000&& value >=  500){
            return '#D4F1FF';
          }else {
            return '#EFFAFF';
          }
        }).label('name*value', (name, value)=>{
          if (name === '内蒙古自治区') {
            return {
              htmlTemplate: () => {
                return `<div class="cap_info_win"><p style="color: #999999; font-size: 14px">${name}</p><p>${value}辆</p></div>`;
              }
            }
          }
        })
        provinceChart.render();
      },
      processData(geoJSON) {
        console.log(geoJSON)
        var mapData = {
          type: 'FeatureCollection',
          features: geoJSON
        };
        // 构造虚拟数据
        var userData = [];
        for (var i = 0; i < geoJSON.length; i++) {
          var name = geoJSON[i].properties.name;
          userData.push({
            name: name,
            value: Math.round(Math.random() * 10000)
          });
        }
        var ds = new DataSet();
        var geoDataView = ds.createView().source(mapData, {
          type: 'GeoJSON'
        }); // geoJSON 经纬度数据

        // 用户数据s
        var dvData = ds.createView().source(userData);
        dvData.transform({
          type: 'geo.region',
          field: 'name',
          geoDataView: geoDataView,
          as: ['longitude', 'latitude']
        });

        return dvData;
      },
      mountNode1 () {
        let temp = document.getElementById('mountNode1');
        var chart = new G2.Chart({
          container: 'mountNode1',
          forceFit: true,
          padding: [ 0, 0, 0, 0 ],
          height: G2.DomUtil.getHeight(temp),
          width: G2.DomUtil.getWidth(temp),
        });
        chart.source(this.data1, {
          percent: {
            formatter: function formatter(val) {
              val = val * 100 + '%';
              return val;
            }
          }
        });
        chart.coord('theta', {
          radius: 0.65,
          innerRadius: 0.4
        });
        chart.tooltip({
          showTitle: false,
          itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        });
        // 辅助文本
        chart.guide().html({
          position: ['50%', '50%'],
          html: '<div style="color:#8c8c8c;font-size: 14px;text-align: center;width: 10em;">主机<br><span style="color:#8c8c8c;font-size:20px">200</span>台</div>',
          alignX: 'middle',
          alignY: 'middle'
        });
        chart.legend(false);
        var interval = chart.intervalStack().position('percent').color('item',["red", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6"]).label('percent', {
          formatter: function formatter(val) {
            return val;
          }
        }).tooltip('item*percent', function(item, percent) {
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
        interval.setSelected(this.data1[0]);
      },
      mountNode2 () {
        let temp = document.getElementById('mountNode2');
        var chart = new G2.Chart({
          container: 'mountNode2',
          forceFit: true,
          height: G2.DomUtil.getHeight(temp),
          width: G2.DomUtil.getWidth(temp),
          padding: [ 20, 80, 50, 30 ]
        });
        chart.source(this.data, {
          month: {
            range: [0, 1]
          }
        });
        chart.area().position('month*value');
        chart.line().position('month*value').shape('hv');
        chart.render();
      },
      mountNode3 () {
        let temp = document.getElementById('mountNode3');
        var chart = new G2.Chart({
          container: 'mountNode3',
          forceFit: true,
          height: G2.DomUtil.getHeight(temp),
          width: G2.DomUtil.getWidth(temp),
          padding: [ 20, 80, 50, 30 ]
        });
        chart.tooltip({
          showTitle: false
        });
        chart.source(this.data2);
        chart.scale('value', {
          alias: '销售额(万)'
        });
        chart.legend(false);
        chart.axis('time', {
          label: {
            textStyle: {
              fill: '#666666'
            }
          },
          tickLine: {
            alignWithLabel: false,
            length: 0
          }
        });

        chart.axis('value', {
          label: {
            textStyle: {
              fill: '#666666'
            }
          },
        });

        chart.tooltip({
          share: true
        });
        chart.interval().position('time*value').shape('cylinder').size(20).color('time', ['#3751FE','#43A2FF', '#5F73FE','#9D74FD','#04E38A']);
        chart.render();
      }
    }
  }
</script>

<style scoped lang="scss">
  .gcsj_container{
    width: 100%;
    height: 100%;
    .breadcrumb_heaer{
      background: #FFFFFF;
      border-bottom: 1px solid #D3D3D3;
    }
    .gcsj_box{
      padding: 15px;
      height: calc(100% - 55px);
      overflow: auto;
      .gcsj_box_top{
        padding: 10px;
        box-shadow:0px 3px 8px 0px rgba(169,169,169,0.2);
        background:rgba(255,255,255,1);
        .el-form-item{
          margin-bottom: 0;
        }
      }
      .gcsj_box_top_2{
        padding: 10px;
        box-shadow:0px 3px 8px 0px rgba(169,169,169,0.2);
        background:rgba(255,255,255,1);
        margin-top: 15px;
        ul{
          display: flex;
          justify-content:space-between;
          li:nth-of-type(1){
            background:rgba(67,162,255,1);
          }
          li:nth-of-type(2){
            background:#0C70F8;
          }
          li:nth-of-type(3){
            background:#3751FE;
          }
          li:nth-of-type(4){
            background:#5F73FE;
          }
          li:nth-of-type(5){
            background:#9D74FD;
          }
          li:nth-of-type(6){
            background:#04E38A;
          }
          li{
            height:110px;
            width:15.8%;
            box-shadow:0px 3px 8px 0px rgba(169,169,169,0.2);
            border-radius:3px;
            display: flex;
            align-items:center;
            >div{
              display: flex;
              align-items:center;
              >div{
                display: flex;
                flex-direction:column;
                justify-content:center;
                margin-left: 10px;
                span:nth-of-type(1){
                  font-size:20px;
                  font-family:PingFang SC;
                  font-weight:bold;
                  color:rgba(255,255,255,1);
                }
                span:nth-of-type(2){
                  color:rgba(255,255,255,1);
                }
              }
            }
          }
        }
      }
      .gcsj_box_cot{
        margin-top: 15px;
        .gcsj_box_cot_1{
          display: flex;
          >div{
            width: 50%;
            >div{
              background:rgba(255,255,255,1);
              box-shadow:0px 3px 8px 0px rgba(169,169,169,0.2);
              min-height: 550px;
              h1{
                font-weight:bold;
                color:rgba(51,51,51,1);
                font-size: 16px;
                padding: 15px;
              }
            }
          }
          .gcsj_box_cot_1_toop{
            width: 40%;
            padding-right: 15px;
            ul{
              display: flex;
              flex-wrap: wrap;
              justify-content:space-between;
              margin-top: 15px;
              li{
                width:49%;
                height:75px;
                background:rgba(255,255,255,1);
                box-shadow:0px 1px 6px 0px rgba(114,114,114,0.1);
                border-radius:2px;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                justify-content:center;
                .point{
                  width: 25px;
                  height: 25px;
                  border-radius: 50%;
                  background-color: #0C70F8;
                  text-align: center;
                  color: white;
                  margin-right: 10px;
                  line-height: 25px;
                  box-shadow: 0px 0px 14px 2px #0C70F8;
                }
                .text{
                  display: flex;
                  flex-direction: column;
                  span:first-child{
                    font-weight: bold;
                    color: #333333;
                    font-size: 20px;
                  }
                  span:last-child{
                    color: #666666;
                  }
                }
              }
            }
          }
          .gcsj_box_cot_1_toop_b{
            width: 50%;
            .gcsj_box_cot_1_toop_b_r{
              display: flex;
              flex-wrap: wrap;
              justify-content:space-between;
              margin-right: 10px;
              li{
                width: 48%;
                display: flex;
                align-items: center;
                text-align: left;
                background:rgba(255,255,255,1);
                box-shadow:0px 3px 8px 0px rgba(169,169,169,0.2);
                margin-bottom: 10px;
                padding: 15px 0;
                padding-left: 5px;
                span:nth-of-type(1){
                  width: 8px;
                  height: 8px;
                  background-color: #AC76DA;
                  border-radius: 50%;
                }
                span:nth-of-type(2){
                  padding: 0 5px;
                  color: #333333;
                  font-weight: bold;
                  font-size: 16px;
                }
                span:nth-of-type(3){
                  color: #666666;
                  font-size: 12px;
                }
              }
            }
          }
          .gcsj_box_cot_1_toop_bot{
            display: flex;
            flex-wrap: wrap;
            margin-top: 15px;
            justify-content: center;
            li{
              width:24%;
              display: flex;
              justify-content:center;
              align-items: center;
              margin-bottom: 18px;
              div:first-child{
                height:4px;
                width: 30%;
                background:rgba(172,118,218,1);
                border-radius:2px;
                margin-right: 10px;
              }
              div:last-child{
                width: 70%;
              }
            }
          }
        }
        .gcsj_box_cot_2{
          display: flex;
          justify-content:space-between;
          margin-top: 15px;
          >div{
            width: 33%;
            background:rgba(255,255,255,1);
            box-shadow:0px 3px 8px 0px rgba(169,169,169,0.2);
            min-height: 300px;
            h1{
              font-weight:bold;
              color:rgba(51,51,51,1);
              font-size: 16px;
              padding: 15px;
            }
            p{
              color: #A9A9A9;
              padding-left: 15px;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .cap_info_win {
    background: #FFFFFF;
    padding: 10px;
    font-size: 14px;
    color: #666666;
    position: relative;
    white-space: nowrap;
    left: 55px;
    top: 44px;
    z-index: 0;
    box-shadow:0px 3px 4px 0px rgba(114,114,114,0.12);
    border-radius:2px;
    p{
      text-align: left;
    }
    p:last-child{
      text-align: left;
      padding-top: 10px;
      color: #333333;
      font-weight: bold;
      font-size: 16px;
    }
    &:after {
      display: block;
      content: '';
      border: .1rem solid red;
      border-color: transparent #04E38A transparent transparent;
      position: absolute;
      top: .2rem;
      left:  -.2rem;
    }
    &:hover{
      background-color: #0C70F8;
      color: white;
    }
  }
</style>