<template>
  <div class="portrait_rlsjfx">
    <div class="vc_gcck_bd" is="vehicleBreadcrumb" :oData="[{name: '人脸数据分析'}]"></div>
    <div class="rlsjfx_box">
      <div>
        <div class="box">
          <h1>布控库数据统计</h1>
          <div class="info_list_box">
            <div class="item">
              <i class="vl_icon vl_icon_portrait_rlsjfx_01"></i>
              <div>
                <p>人像总数</p>
                <h1>{{rlsjfxDetail.portraitNumsInSur}}</h1>
              </div>
            </div>
            <div class="item">
              <i class="vl_icon vl_icon_portrait_rlsjfx_02"></i>
              <div>
                <p>已认证数</p>
                <h1>{{rlsjfxDetail.authNumsInSur}}</h1>
              </div>
            </div>
            <div class="item">
              <i class="vl_icon vl_icon_portrait_rlsjfx_03"></i>
              <div>
                <p>男性:女性</p>
                <h1>{{rlsjfxDetail.malePerInSur}}:{{rlsjfxDetail.femalePerInSur}}</h1>
              </div>
            </div>
            <div class="item">
              <i class="vl_icon vl_icon_portrait_rlsjfx_04"></i>
              <div>
                <p>布控组数</p>
                <h1>{{rlsjfxDetail.surGroups}}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="box">
          <h1>基础信息库数据统计</h1>
          <div class="info_list_box">
            <div class="item">
              <i class="vl_icon vl_icon_portrait_rlsjfx_05"></i>
              <div>
                <p>库总数</p>
                <h1>{{rlsjfxDetail.baseGroups}}</h1>
              </div>
            </div>
            <div class="item">
              <i class="vl_icon vl_icon_portrait_rlsjfx_01"></i>
              <div>
                <p>人像总数</p>
                <h1>{{rlsjfxDetail.portraitNumsInBase}}</h1>
              </div>
            </div>
            <div class="item">
              <i class="vl_icon vl_icon_portrait_rlsjfx_03"></i>
              <div>
                <p>男性:女性</p>
                <h1>{{rlsjfxDetail.malePerInBase}}:{{rlsjfxDetail.femalePerInBase}}</h1>
              </div>
            </div>
            <div class="item">
              <i class="vl_icon vl_icon_portrait_rlsjfx_06"></i>
              <div>
                <p>业务组数</p>
                <h1>{{rlsjfxDetail.businessGroups}}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="box">
          <div class="title">
            <h1>人脸抓拍统计</h1>
            <span @click="skip">查看更多></span>
          </div>
          <div class="face_snap_form">
            <div ref="devSelect" is="devSelect" @sendSelectData="getSelectData"></div>
            <el-date-picker
              v-model="faceSnapForm.queryDate"
              @change="validationDate(faceSnapForm)"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
            <div>
              <el-button class="reset_btn" @click="resetFaceSnapForm">重置</el-button>
              <el-button class="select_btn" @click="getFaceSnapSta" :loading="loadingBtn1">统计</el-button>
            </div>
          </div>
          <div class="snap_snap">
            <span>
              <span>设备总数：{{faceSnapSta.total}} 个</span>
              <el-popover
                placement="right"
                popper-class="five_info"
                trigger="hover">
                <div>
                  <h1>抓拍人脸数TOP5</h1>
                  <ul>
                    <li v-for="(item,index) in faceSnapSta.device" :key="index"><span>{{item.name}}</span><span>{{item.total}}张</span></li>
                  </ul>
                </div>
                <span slot="reference" class="five">TOP5</span>
              </el-popover>
            </span>
            <span>抓拍人脸：{{faceSnapSta.faceNums}} 个</span>
            <span>抓拍峰值：{{faceSnapSta.peakValues}} 张</span>
          </div>
        </div>
      </div>
      <div>
        <div class="box">
          <div class="title">
            <h1>人脸布控告警数据分析</h1>
            <span @click="skip">查看更多></span>
          </div>
          <div class="face_control_form">
            <el-date-picker
              v-model="faceControlQueryDate"
              @change="validationDate(faceControlQueryDate)"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
            <div>
              <el-button class="reset_btn" @click="resetFaceControlDate">重置</el-button>
              <el-button class="select_btn" @click="getFaceControlSta" :loading="loadingBtn2">统计</el-button>
            </div>
          </div>
          <div class="face_control_info">
            <span>告警总数：{{faceControlSta.total}} 个</span> 
            <span>人脸数量：{{faceControlSta.faceNums}} 个</span> 
            <span>告警峰值：{{faceControlSta.peakValues}} 张</span> 
          </div>
        </div>
      </div>
      <div>
        <div class="box chart_box">
          <h1>各时间段的抓拍人脸数</h1>
          <p>人脸抓拍数(张)</p>
          <div id="faceNumContainer"></div>
        </div>
      </div>
      <div>
        <div class="box chart_box">
          <h1>各时间段人脸布控的告警次数</h1>
          <p>告警次数(次)</p>
          <div id="alarmNumContainer"> </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let startTime = formatDate(new Date(new Date().toLocaleDateString()).getTime() - 1 * 3600 * 24 * 1000, 'yyyy-MM-dd HH:mm:ss'); //默认开始时间为当前时间前一天
let endTime = formatDate(new Date(new Date().toLocaleDateString()).getTime() + (24 * 60 * 60 * 1000 - 1) + 1 * 3600 * 24 * 1000, 'yyyy-MM-dd HH:mm:ss');//默认结束时间为开始时间后第三天
import vehicleBreadcrumb from './breadcrumb.vue';
import devSelect from '@/components/common/devSelect.vue';
import G2 from '@antv/g2';
import { View } from '@antv/data-set';
import {apiFaceTotal, apiFaceSnap, apiFaceWarning} from '@/views/index/api/api.portrait.js';
import {formatDate} from '@/utils/util.js';
export default {
  components: {vehicleBreadcrumb, devSelect},
  data () {
    return {
      faceSnapForm: {
        devIdData:  {
          selSelectedData1: [],
          selSelectedData2: []
        },
        queryDate: [startTime, endTime]
      },
      faceControlQueryDate: [startTime, endTime],
      devList: [],//人脸抓拍统计设备列表
      // 图表参数
      chartData1: [],
      chartData2: [],
      // 保存生成的图表用来删除
      charts: {
        chart1: null,
        chart2: null
      },
      // 布控和基础数据统计
      rlsjfxDetail: {
        authNumsInSur: null,
        baseGroups: null,
        businessGroups: null,
        femalePerInBase: null,
        femalePerInSur: null,
        malePerInBase: null,
        malePerInSur: null,
        portraitNumsInBase: null,
        portraitNumsInSur: null,
        surGroups: null
      },
      // 人脸抓拍统计和各时间段的抓拍人脸数统计数据
      faceSnapSta: {
        total: '',
        faceNums: '',
        peakValues: '',
        device: []
      },
      // 人脸布控告警数据分析和各时间的人脸布控告警次数统计
      faceControlSta: {
        total: '',
        faceNums: '',
        peakValues: '',
        timeDto: []
      },
      loadingBtn1: false,
      loadingBtn2: false
    }
  },
  mounted () {
    this.getFaceTotal();
    this.getFaceControlSta();
    setTimeout(() => {
      this.getFaceSnapSta();
    }, 1500)

    this.drawChart2();
  },
  methods: {
    // 查看更多
    skip () {
      this.$router.push({name: ''});
    },
    // 验证所选时间是否符合要求
    validationDate (obj) {
      let _startTime, _endTime;
      if ('queryDate' in obj) {
        _startTime = new Date(obj.queryDate[0]).getTime();
        _endTime = new Date(obj.queryDate[1]).getTime();
      } else {
        _startTime = new Date(obj[0]).getTime();
        _endTime = new Date(obj[1]).getTime();
      }
      if ((_endTime - _startTime) > 3 * 3600 * 24 * 1000) {
        this.$message.warning('所选时间间隔不能超过三天');
        if ('queryDate' in obj) {
          obj.queryDate = [startTime, endTime];
        } else {
          this.faceControlQueryDate = [startTime, endTime];
        }
      }
    },
    // 获得选择设备组件传过来的数据
    getSelectData (data) {
      console.log(data, 'data');
      this.faceSnapForm.devIdData = data;
    },
    // 重置人脸抓拍统计表单
    resetFaceSnapForm () {     
      this.faceSnapForm.queryDate = [startTime, endTime]
      // this.getFaceSnapSta();
    },
    // 重置人脸布控告警数据分析表单
    resetFaceControlDate () {
      this.faceControlQueryDate = [startTime, endTime];
      // this.getFaceControlSta();
    },
    // 获取人脸数据汇总分析
    getFaceTotal () {
      apiFaceTotal().then(res => {
        if (res) {
          this.rlsjfxDetail = res.data;
        }
      })
    },
    // 获取人脸抓拍统计
    getFaceSnapSta () {
      // const params = {
      //   deviceIds: '9',
      //   bayonetIds: null,
      //   startTime: this.faceSnapForm.queryDate[0],
      //   endTime: this.faceSnapForm.queryDate[1]
      // }
      this.chartData1 = [];
      const params = {
        deviceIds: this.faceSnapForm.devIdData.selSelectedData1.map(m => m.id).join(','),
        bayonetIds: this.faceSnapForm.devIdData.selSelectedData2.map(m => m.id).join(','),
        startTime: this.faceSnapForm.queryDate[0],
        endTime: this.faceSnapForm.queryDate[1]
      }
      console.log(params)
      this.loadingBtn1 = true;
      apiFaceSnap(params).then(res => {
        if (res) {
          this.faceSnapSta = res.data;
          let timeDto = this.faceSnapSta.timeDto
          if(timeDto && timeDto.length > 0) {
            this.chartData1 = timeDto.map(m => {
              return { time: m.name, count: m.total };
            })
            this.drawChart1();
          }
        }
      }).finally(() => {
        this.loadingBtn1 = false;
      })
    },
    // 获取人脸布控告警数据分析
    getFaceControlSta () {
      this.chartData2 = []
      const params = {
        startTime: this.faceControlQueryDate[0],
        endTime: this.faceControlQueryDate[1],
      }
      this.loadingBtn2 = true;
      apiFaceWarning(params).then(res => {
        if (res) {
          this.faceControlSta = res.data;
          let timeDto = this.faceControlSta.timeDto
          if(timeDto && timeDto.length > 0) {
            this.chartData2 = timeDto.map(m => {
              return { time: m.name, count: m.total };
            })
            console.log(this.chartData2, 'this.chartData2')
            this.drawChart2();
          }
        }
      }).finally(() => {
        this.loadingBtn2 = false;
      })
    },
    // 转换时间间隔
    transformTime (title) {
      if (title === '0点') return 0;
      return title.length === 2 ? parseInt(title.slice(0, 1)) - 1 : parseInt(title.slice(0, 2)) - 1;
    },
    // 画抓拍人脸数图表
    drawChart1 () {
      if (this.chartData1.length === 0) return;
      let chart = null,_this = this;
      if (this.charts.chart1) {
        this.charts.chart1.clear();
        chart = this.charts.chart1;
      } else {
        let temp = document.getElementById('faceNumContainer');
        chart = new G2.Chart({
          container: 'faceNumContainer',
          forceFit: true,
          padding: [ 40, 20, 20, 60 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      let dv = new View().source(this.chartData1);
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
        tickCount: 5,
      });
      chart.axis('value', {
        title: null
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
      chart.axis('count1', false)
      chart.tooltip({
        useHtml: true,
        htmlContent: function (title, items) {
          let str = `<div class="my_tooltip">`;
          if (title === '0点') {
            str += `<h1>${title}</h1>`;
          } else {
            str += `<h1>${_this.transformTime(title)}-${title}</h1>`;
          }
          str += `<span><span>${items[0].value}</span><span>辆</span></span></div>`;
          return str;
        }
      });
      chart.legend(false);
      chart.line().position('time*value').color('type', [ '#00C4FC']).size(2).shape('smooth');
      chart.area().position('time*value').color([ 'l(270) 0:#ffffff 1:#00C4FC' ]).shape('smooth');
      chart.render();
      this.charts.chart1 = chart;
    },
    // 画布控告警次数图表
    drawChart2 () {
      if (this.chartData2.length === 0) return;
      let chart = null,_this = this;
      if (this.charts.chart2) {
        this.charts.chart2.clear();
        chart = this.charts.chart2;
      } else {
        let temp = document.getElementById('alarmNumContainer');
        chart = new G2.Chart({
          container: 'alarmNumContainer',
          forceFit: true,
          padding: [ 40, 0, 20, 60 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      let dv = new View().source(this.chartData2);
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
        min: 0,
        tickCount: 5,
      });
      chart.axis('value', {
        title: null
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
          let str = `<div class="my_tooltip">`;
          if (title === '0点') {
            str += `<h1>${title}</h1>`;
          } else {
            str += `<h1>${_this.transformTime(title)}-${title}</h1>`;
          }
          str += `<span><span>${items[0].value}</span><span>辆</span></span></div>`;
          return str;
        }
      });
      chart.legend(false);
      chart.line().position('time*value').color('type', [ '#00C4FC']).size(2).shape('smooth');
      chart.area().position('time*value').color([ 'l(270) 0:#ffffff 1:#00C4FC' ]).shape('smooth');
      chart.render();
      this.charts.chart2 = chart;
    }
  }
}
</script>
<style lang="scss" scoped>
.portrait_rlsjfx {
  height: 100%;
  width: 100%;
  padding-top: 50px;
  .rlsjfx_box{
    width: 100%;
    height: 100%;
    padding: 5px;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    > div{
      width: 50%;
      padding: 5px;
      &:nth-child(1), &:nth-child(2){
        height: 160px;
      }
      &:nth-child(3), &:nth-child(4){
        height: 150px;
      }
      &:nth-child(5), &:nth-child(6){
        height: calc(100% - 310px);
      }
      .box{
        width: 100;
        height: 100%;
        background: #fff;
        padding: 15px;
        > h1{
          padding-bottom: 12px;
          color: #333;
          font-weight: bold;
        }
        .info_list_box{
          width: 100%;
          height: 90px;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          .item{
            flex: 0 1 23.8%;
            height: 100%;
            background: #0C70F8;
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            padding: 10px;
            > div{
              text-align: center;
              line-height: 30px;
              > p{
                color: #FFFFFF;
                font-size: 12px;
              }
              > h1{
                color: #FFFFFF;
                font-size: 20px;
              }
            }
            &:nth-child(1){
              background: #0C70F8;
            }
            &:nth-child(2){
              background: #0D9DF4;
            }
            &:nth-child(3){
              background: #6262FF;
            }
            &:nth-child(4){
              background: #8949F3;
            }
          }
        }
        .face_snap_form{
          width: 100%;
          display: flex;
          justify-content: space-between;
          .el-date-editor{
            width: 33%;
          }
          > div:nth-child(1){
            width: 33%;
            position: relative;
          }
        }
        .title{
          display: flex;
          justify-content: space-between;
          > h1{
            color: #333333;
            font-weight: bold;
            padding-bottom: 12px;
          }
          > span{
            color: #666666;
            cursor: pointer;
          }
        }
        .face_control_form{
          display: flex;
          justify-content: space-between;
          .el-date-editor{
            width: 33%;
          }
        }
        .snap_snap, .face_control_info{
          width: 100%;
          line-height: 30px;
          padding: 0 6px;
          margin-top: 10px;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          background: #F6F8F9;
          > span{
            width: 33.33%;
            color: #333333;
            .five{
              font-size: 12px;
              color: #fff;
              display: inline-block;
              line-height: 12px;
              text-align: center;
              margin-left: 10px;
              background: #FA453A;
            }
          }
        }
        > p{
          color: #999999;
          font-size: 12px;
        }
        #faceNumContainer, #alarmNumContainer{
          width: 100%;
          height: 350px;
          min-height: 350px;
        }
      }
      .chart_box {
        height: 430px;
      }
    }
  }
}

</style>
<style lang="scss">
.portrait_rlsjfx{
  // 重置按钮样式
  .select_btn, .reset_btn {
    width: 90px;
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
  .el-date-editor{
    .el-range-input{
      width: 42%!important;
    }
    .el-input__icon{
      display: none;
    }
    .el-range-separator{
      width: 16px!important;
    }
  } 
  .my_tooltip{
    > h1{
      color: #999;
      font-size: 12px;
    }
    > span:nth-child(2){
      color: #333;
      font-size: 18px;
    }
    > span:nth-child(3){
      color: #333;
      font-size: 12px;
    }
  }
}
// 重置弹出框里内容样式
.five_info{
  width: 82px;
  > div{
    > h1{
      color: #FA453A;
    }
    > ul > li{
      line-height: 25px;
      font-size: 12px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      > span:nth-child(1){
        color: #999999;
      }
      > span:nth-child(2){
        color: #333333;
      }
    }
  }
}
</style>
