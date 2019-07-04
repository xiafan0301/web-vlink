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
                <p>男性：女性</p>
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
                <p>男性：女性</p>
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
            <span>查看更多></span>
          </div>
          <div class="face_snap_form">
            <div ref="devSelect" is="devSelect" :type="2" @sendSelectData="getSelectData"></div>
            <el-date-picker
              v-model="faceSnapForm.queryDate"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
            <div>
              <el-button class="reset_btn" @click="resetFaceSnapForm">重置</el-button>
              <el-button class="select_btn" @click="getFaceSnapSta">统计</el-button>
            </div>
          </div>
          <div class="snap_snap">
            <span>
              <span>设备总数：20234 个</span>
              <el-popover
                placement="right"
                popper-class="five_info"
                trigger="hover">
                <div>
                  <h1>抓拍人脸数TOP5</h1>
                  <ul>
                    <li><span>设备1</span><span>25,156张</span></li>
                    <li><span>设备2</span><span>25,156张</span></li>
                    <li><span>设备3</span><span>25,156张</span></li>
                    <li><span>设备4</span><span>25,156张</span></li>
                    <li><span>设备5</span><span>25,156张</span></li>
                  </ul>
                </div>
                <span slot="reference" class="five">TOP5</span>
              </el-popover>
            </span>
            <span>抓拍人脸：2484  个</span>
            <span>抓拍峰值：124 张</span>
          </div>
        </div>
      </div>
      <div>
        <div class="box">
          <div class="title">
            <h1>人脸布控告警数据分析</h1>
            <span>查看更多></span>
          </div>
          <div class="face_control_form">
            <el-date-picker
              v-model="faceControlQueryDate"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
            <div>
              <el-button class="reset_btn" @click="resetFaceControlDate">重置</el-button>
              <el-button class="select_btn" @click="getFaceControlSta">统计</el-button>
            </div>
          </div>
          <div class="face_control_info">
            <span>告警总数：20234 个</span> 
            <span>人脸数量：2484 个</span> 
            <span>告警峰值：124 张</span> 
          </div>
        </div>
      </div>
      <div>
        <div class="box">
          <h1>各时间段的抓拍人脸数</h1>
          <p>人脸抓拍数(张)</p>
          <div id="faceNumContainer"></div>
        </div>
      </div>
      <div>
        <div class="box">
          <h1>各时间人脸布控的告警次数</h1>
          <p>告警次数(次)</p>
          <div id="alarmNumContainer"> </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vehicleBreadcrumb from './breadcrumb.vue';
import devSelect from '@/components/common/devSelect.vue';
import G2 from '@antv/g2';
import { View } from '@antv/data-set';
import {apiFaceTotal, apiFaceSnap, apiFaceWarning} from '@/views/index/api/api.portrait.js';
export default {
  components: {vehicleBreadcrumb, devSelect},
  data () {
    return {
      faceSnapForm: {
        devIdData:  {
          selSelectedData1: [],
          selSelectedData2: []
        },
        queryDate: null
      },
      faceControlQueryDate: null,
      devList: [],//人脸抓拍统计设备列表
      // 图表参数
      chartData1: [
        { time: '0点', count: 12352, cout1: 1 },
        { time: '2点', count: 45285, cout1: 1 },
        { time: '4点', count: 2452, cout1: 1 },
        { time: '6点', count: 22452, cout1: 1 },
        { time: '8点', count: 9857, cout1: 1 },
        { time: '10点', count: 19857, cout1: 1 },
        { time: '12点', count: 18557, cout1: 1 },
        { time: '14点', count: 29857, cout1: 1 },
        { time: '16点', count: 39857, cout1: 1 },
        { time: '18点', count: 49857, cout1: 1 },
        { time: '20点', count: 35857, cout1: 1 },
        { time: '22点', count: 5857, cout1: 1 },
        { time: '24点', count: 8857, cout1: 1 }
      ],
      chartData2: [
         { time: '0点', count: 12352, cout1: 1 },
        { time: '2点', count: 45285, cout1: 1 },
        { time: '4点', count: 2452, cout1: 1 },
        { time: '6点', count: 22452, cout1: 1 },
        { time: '8点', count: 9857, cout1: 1 },
        { time: '10点', count: 19857, cout1: 1 },
        { time: '12点', count: 18557, cout1: 1 },
        { time: '14点', count: 29857, cout1: 1 },
        { time: '16点', count: 39857, cout1: 1 },
        { time: '18点', count: 49857, cout1: 1 },
        { time: '20点', count: 35857, cout1: 1 },
        { time: '22点', count: 5857, cout1: 1 },
        { time: '24点', count: 8857, cout1: 1 }
      ],
      // 保存生成的图表用来删除
      charts: {
        chart1: null,
        chart2: null
      },
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
      }
    }
  },
  mounted () {
    this.getFaceTotal();
    this.drawChart1();
    this.drawChart2();
  },
  methods: {
    // 获得选择设备组件传过来的数据
    getSelectData (data) {
      console.log(data, 'data');
      this.faceSnapForm.devIdData = data;
    },
    // 重置人脸抓拍统计表单
    resetFaceSnapForm () {
      this.$refs.devSelect.resetSelect();
      this.faceSnapForm = {
        devIdData: {
          selSelectedData1: [],
          selSelectedData2: []
        },
        queryDate: null
      }
    },
    // 重置人脸布控告警数据分析表单
    resetFaceControlDate () {
      this.faceControlQueryDate = null;
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
        // deviceIds: ,
        // bayonetIds: ,
        // startTime: ,
        // endTime: 
      }
      apiFaceSnap().then(res => {
        if (res) {

        }
      })
    },
    // 获取人脸布控告警数据分析
    getFaceControlSta () {
      apiFaceWarning().then(res => {
        if (res) {

        }
      })
    },
    // 画抓拍人脸数图表
    drawChart1 () {
      let chart = null;
      if (this.charts.chart1) {
        this.charts.chart1.clear();
        chart = this.charts.chart1;
      } else {
        let temp = document.getElementById('faceNumContainer');
        chart = new G2.Chart({
          container: 'faceNumContainer',
          forceFit: true,
          padding: [ 40, 0, 20, 60 ],
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

      // impute 补全列/补全字段
      dv.transform({
        type: 'impute',
        field: 'count1',       // 待补全字段
        // groupBy: [ 'value' ], // 分组字段集（传空则不分组）
        method: 'value',  // 补全常量
        value: 50000    // 补全字段值时执行的规则
      });
      let view2 = chart.view();
      view2.source(dv);
      view2.tooltip(false);
      view2.axis(false);
      chart.interval()
      .position('time*count1') 
      .color('count', '#F2F2F2')
      .size(20);

      chart.source(dv, {});
      // 坐标轴刻度
      chart.scale('count', {
        max: 50000,
        min: 0,
        tickCount: 5,
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
          return `<div class="my_tooltip">
            <h1>${title}</h1>
            <span>${items[0].value}</span><span>张</span></div>`;
        }
      });
      chart.legend(false);
      chart.interval()
      .position('time*value')
      .color('type', [ 'l(270) 0:#0C70F8 1:#0D9DF4' ])
      .size(20)
      chart.render();
      this.charts.chart1 = chart;
    },
    // 画布控告警次数图表
    drawChart2 () {
      let chart = null;
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

      // impute 补全列/补全字段
      dv.transform({
        type: 'impute',
        field: 'count1',       // 待补全字段
        // groupBy: [ 'value' ], // 分组字段集（传空则不分组）
        method: 'value',  // 补全常量
        value: 50000    // 补全字段值时执行的规则
      });
      let view2 = chart.view();
      view2.source(dv);
      view2.tooltip(false);
      view2.axis(false);
      chart.interval()
      .position('time*count1') 
      .color('count', '#F2F2F2')
      .size(20);

      chart.source(dv, {});
      // 坐标轴刻度
      chart.scale('count', {
        max: 50000,
        min: 0,
        tickCount: 5,
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
          return `<div class="my_tooltip">
            <h1>${title}</h1>
            <span>${items[0].value}</span><span>次</span></div>`;
        }
      });
      chart.legend(false);
      chart.interval()
      .position('time*value')
      .color('type', [ 'l(270) 0:#0C70F8 1:#0D9DF4' ])
      .size(20)
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
          height: calc(100% - 50px);
          min-height: 350px;
        }
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
