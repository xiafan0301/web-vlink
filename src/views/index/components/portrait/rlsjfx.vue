<template>
  <div class="portrait_rlsjfx">
    <div class="vc_gcck_bd" is="vehicleBreadcrumb" :oData="[{name: '人脸数据分析'}]"></div>
    <div class="rlsjfx_box" id="rlsjfxBox">
      <div>
        <div class="box">
          <div class="title">
            <h1>布控库数据统计</h1>
            <span @click="skipControlLibrary">查看更多></span>
          </div>
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
                <h1>{{rlsjfxDetail.malePerInSur}}&nbsp;:&nbsp;{{rlsjfxDetail.femalePerInSur}}</h1>
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
          <div class="title">
            <h1>基础信息库数据统计</h1>
            <span @click="skipInfoLibrary">查看更多></span>
          </div>
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
                <h1>{{rlsjfxDetail.malePerInBase}}&nbsp;:&nbsp;{{rlsjfxDetail.femalePerInBase}}</h1>
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
            <span @click="skipPortraitSearch">查看更多></span>
          </div>
          <div class="face_snap_form">
            <!-- @change="validationDate(faceSnapForm)" -->
            <el-date-picker
              class="vl_date"
              :clearable="false"
              v-model="faceSnapForm.queryDate"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
            <div class="rlcx_xzsb_s" @click="areaTypeChanged" v-show="faceSnapForm.type === 0">
              <span>选择设备</span>
              <span class="el-icon-arrow-down"></span>
            </div>
            <div class="rlcx_dtxz_rst" v-show="faceSnapForm.type === 2">
              已选<span>{{dSum}}</span>个设备<a href="javascript: void(0);" @click="openMap={}">重选</a>
            </div>
            <div>
              <el-button class="reset_btn" @click="resetFaceSnapForm">重置</el-button>
              <el-button class="select_btn" type="primary" @click="getFaceSnapSta" :loading="loadingBtn1">统计</el-button>
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
                  <h1>抓拍人脸数<span>TOP5</span></h1>
                  <ul>
                    <li v-for="(item,index) in faceSnapSta.device" :key="index"><span :title="item.name">{{item.name | strCutWithLen(15)}}</span><span>{{item.total}}张</span></li>
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
            <span @click="skipHistoryAlarm">查看更多></span>
          </div>
          <!-- @change="validationDate(faceControlQueryDate)" -->
          <div class="face_control_form">
            <el-date-picker
              :clearable="false"
              class="vl_date"
              :picker-options="pickerOptions"
              v-model="faceControlQueryDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
            <div>
              <el-button class="reset_btn" @click="resetFaceControlDate">重置</el-button>
              <el-button class="select_btn" type="primary" @click="getFaceControlSta" :loading="loadingBtn2">统计</el-button>
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
          <p v-if="chartData1.length > 0">人脸抓拍数(张)</p>
          <div id="faceNumContainer">
            <span v-if="chartData1.length === 0">暂无数据</span>
          </div>
        </div>
      </div>
      <div>
        <div class="box chart_box">
          <h1>各时间段人脸布控的告警次数</h1>
          <p v-if="chartData2.length > 0">告警次数(次)</p>
          <div id="alarmNumContainer">
            <span v-if="chartData2.length === 0">暂无数据</span>
          </div>
        </div>
      </div>
    </div>
    <div is="mapSelector" ref="mapSelector" :open="openMap" :clear="msClear" :showTypes="'DB'" @mapSelectorEmit="mapSelectorEmit"></div>
  </div>
</template>
<script>
import {formatDate, dateOrigin} from '@/utils/util.js';
// let startTime = formatDate(new Date(new Date(new Date().toLocaleDateString())).getTime() - 24*60*60*1000, 'yyyy-MM-dd HH:mm:ss');
// let endTime = formatDate(new Date(new Date(new Date().toLocaleDateString())).getTime() - 1, 'yyyy-MM-dd HH:mm:ss');
let startTime = formatDate(dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)), 'yyyy-MM-dd');
let endTime = formatDate(dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)), 'yyyy-MM-dd');
import vehicleBreadcrumb from './breadcrumb.vue';
import G2 from '@antv/g2';
import { View } from '@antv/data-set';
import mapSelector from '@/components/common/mapSelector.vue';
import {apiFaceTotal, apiFaceSnap, apiFaceWarning} from '@/views/index/api/api.portrait.js';
export default {
  components: {vehicleBreadcrumb, mapSelector},
  data () {
    return {
      faceSnapForm: {
        type: 0,
        queryDate: [startTime, endTime]
      },
      dSum: 0,
      dIds: [],
      bIds: [],
      msClear: {},
      openMap: {},

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
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      loadingBtn1: false,
      loadingBtn2: false,
      selectLength: null
    }
  },
  mounted () {
    this.getFaceTotal();
    this.getFaceControlSta();
    this.drawChart2();
    // 进入页面滚动条保持在最顶部
    document.getElementById('rlsjfxBox').scrollTop = 0;
  },
  methods: {
    // 查看更多
    skipControlLibrary () {
      this.$router.push({name: 'control_library'});
    },
    skipInfoLibrary () {
      this.$router.push({name: 'person_info'});
    },
    skipPortraitSearch () {
      this.$router.push({name: 'portrait_rlcx'});
    },
    skipHistoryAlarm () {
      this.$router.push({name: 'history_alarm'});
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
    areaTypeChanged () {
      this.faceSnapForm.type = 2;
      this.openMap = !this.openMap;
    },
    // 选择设备弹窗点击确定方法
    mapSelectorEmit (result) {
       if (result) {
        console.log(result, 'result');
        this.dSum = 0;
        this.dIds = [];
        this.bIds = [];
        if (result.deviceList) {
          this.dSum = result.deviceList.length;
          for (let i = 0; i < result.deviceList.length; i++) {
            this.dIds.push(result.deviceList[i].uid);
          }
        }
        if (result.bayonetList && result.bayonetList.length > 0) {
          this.dSum += result.bayonetList.length;
          for (let i = 0; i < result.bayonetList.length; i++) {
            this.bIds.push(result.bayonetList[i].uid);
          }
        }
      }
    },
    // 重置人脸抓拍统计表单
    resetFaceSnapForm () {     
      this.faceSnapForm.queryDate = [startTime, endTime];
      this.msClear = {};
      this.dSum = 0;      
      this.dIds = [];
      this.bIds = [];
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
      const params = {
        deviceIds: this.dIds.join(','),
        bayonetIds: this.bIds.join(','),
        startTime: this.faceSnapForm.queryDate[0] + ' 00:00:00',
        endTime: this.faceSnapForm.queryDate[1] + ' 23:59:59'
      }
      this.loadingBtn1 = true;
      apiFaceSnap(params).then(res => {
        if (res) {
          this.faceSnapSta = res.data;
          let timeDto = this.faceSnapSta.timeDto
          if(timeDto && timeDto.length > 0) {
            this.chartData1 = timeDto;
            this.drawChart1();
          } else {
            this.chartData1 = [];
            if (this.charts.chart1) {
              this.charts.chart1.destroy();
            }
            this.charts.chart1 = null;
          }
        }
      }).finally(() => {
        this.loadingBtn1 = false;
      })
    },
    // 获取人脸布控告警数据分析
    getFaceControlSta () {
      const params = {
        startTime: this.faceControlQueryDate[0] + ' 00:00:00',
        endTime: this.faceControlQueryDate[1] + ' 23:59:59',
      }
      this.loadingBtn2 = true;
      apiFaceWarning(params).then(res => {
        if (res) {
          this.faceControlSta = res.data;
          let timeDto = this.faceControlSta.timeDto
          if(timeDto && timeDto.length > 0) {
            this.chartData2 = timeDto;
            this.drawChart2();
          } else {
            this.chartData2 = [];
            if (this.charts.chart2) {
              this.charts.chart2.destroy();
            }
            this.charts.chart2 = null;
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
      let chart = null,_this = this;
      if (this.charts.chart1) {
        this.charts.chart1.clear();
        chart = this.charts.chart1;
      } else {
        let temp = document.getElementById('faceNumContainer');
        chart = new G2.Chart({
          container: 'faceNumContainer',
          forceFit: true,
          padding: [ 40, 20, 60, 60 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      chart.source(this.chartData1, {
        'total': {
          min: 0
        }
      });
      chart.axis('name', {
        label: {
          textStyle: {
            fill: '#999999',
            fontSize: 12
          }
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
          str += `<span><span>${items[0].value}</span><span>张</span></span></div>`;
          return str;
          // return`<div class="my_tooltip"><h1>${title}</h1><span><span>${items[0].value}</span><span>张</span></span></div>`;
        }
      });
      chart.legend(false);
      chart.line().position('name*total').shape('hv').color('#088BFD').size(2);
      // chart.area().position('time*value').color([ 'l(270) 0:#ffffff 1:#00C4FC' ]).shape('smooth');
      chart.render();
      this.charts.chart1 = chart;
    },
    // 画布控告警次数图表
    drawChart2 () {
      let chart = null,_this = this;
      if (this.charts.chart2) {
        this.charts.chart2.clear();
        chart = this.charts.chart2;
      } else {
        let temp = document.getElementById('alarmNumContainer');
        chart = new G2.Chart({
          container: 'alarmNumContainer',
          forceFit: true,
          padding: [ 40, 0, 60, 60 ],
          width: G2.DomUtil.getWidth(temp),
          height: G2.DomUtil.getHeight(temp)
        });
      }
      chart.source(this.chartData2, {
        'total': {
          min: 0
        }
      });
      chart.axis('name', {
        label: {
          textStyle: {
            fill: '#999999',
            fontSize: 12
          }
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
          str += `<span><span>${items[0].value}</span><span>次</span></span></div>`;
          return str;
          // return`<div class="my_tooltip"><h1>${title}</h1><span><span>${items[0].value}</span><span>张</span></span></div>`;
        }
      });
      chart.legend(false);
      chart.line().position('name*total').shape('hv').color('#088BFD').size(2);
      // chart.area().position('time*value').color([ 'l(270) 0:#ffffff 1:#00C4FC' ]).shape('smooth');
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
    overflow-y: auto;
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
            justify-content: space-around;
            padding: 10px;
            > div{
              text-align: center;
              > p{
                margin-top: 16px;
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
          .rlcx_xzsb_s {
            height: 40px;
            width: 33%;
            line-height:40px;
            border-radius: 4px;
            border: 1px solid #DCDFE6;
            cursor: pointer;
            color: #999999;
            padding: 0 6px;
            > span {
              display: inline-block;
              width: 50%;
              &:last-child {
                text-align: right;
              }
            }
          }
          .rlcx_dtxz_rst {
            width: 33%;
            height: 40px;
            line-height: 40px;
            padding: 0 15px;
            background-color: #F5F7FA;
            color: #C0C4CC;
            border: 1px solid #DCDFE6;
            border-radius: 4px;
            > span {
              display: inline-block;
              padding: 0 3px;
              color: #333;
            }
            > a {
              display: inline-block;
              padding-left: 5px;
              color: #2580FC !important;
              text-decoration: none !important;
              /*font-style: italic;*/
              cursor: pointer;
            }
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
              padding: 2px 5px;
              display: inline-block;
              line-height: 12px;
              text-align: center;
              margin-left: 10px;
              background: #FA453A;
              font-size: 12px;
              color: #fff;
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
          display: flex;
          justify-content: center;
          align-items: center;
          > span{
            color: #999;
          }
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
  .el-date-editor{
    .el-range-input{
      width: 42%!important;
    }
    .el-range-separator{
      width: 22px!important;
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
      >span{
        font-weight: bold;
      }
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
