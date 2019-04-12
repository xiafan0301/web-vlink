<template>
  <vue-scroll>
    <div class="report-detail">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/event/treatingEventDetail' }">事件详情</el-breadcrumb-item>
          <el-breadcrumb-item>查看上级呈报</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <EventBasic :basicInfo="basicInfo" @emitHandleImg="emitHandleImg"></EventBasic>
        <div class="receive_box">
          <div class="divide"></div>
          <ul>
            <li>
              <span>接收者:</span>
              <span>王冬冬、李沁</span>
            </li>
            <li>
              <span>情况说明:</span>
              <span>由于情况复杂，已无法控制影响范围，请上级指示！由于情况复杂，已无法控制影响范围，
                请上级指示！由于情况复杂，已无法控制影响范围，请上级指示！
                由于情况复杂，已无法控制影响范围，请上级指示！由于情况复杂，已无法控制影响范围，请上级指示！</span>
            </li>
          </ul>
        </div>
        <div class="report-content">
          <div class="header">
            <p class="ctc-title">上级指示</p>
          </div>
          <div class="divide"></div>
          <ul class="report-list">
            <li>
              <div>
                <span>wang东东</span>
                <span>2018-11-21 17:15</span>
              </div>
              <div>
                增大支援队伍，调度城管一起协同解决增大支援队伍，调度城管一起协同解决增大支援队伍，
                调度城管一起协同解决增大支援队伍，
                调度城管一起协同解决增大支援队伍，调度城管一起协同解决增大支援队伍，调度城管一起协同解决
              </div>
            </li>
            <div class="content-divide"></div>
            <li>
              <div>
                <span>wang东东</span>
                <span>2018-11-21 17:15</span>
              </div>
              <div>
                增大支援队伍，调度城管一起协同解决增大支援队伍，调度城管一起协同解决增大支援队伍，
                调度城管一起协同解决增大支援队伍，
                调度城管一起协同解决增大支援队伍，调度城管一起协同解决增大支援队伍，调度城管一起协同解决
              </div>
            </li>
            <div class="content-divide"></div>
            <li>
              <div>
                <span>wang东东</span>
                <span>2018-11-21 17:15</span>
              </div>
              <div>
                增大支援队伍，调度城管一起协同解决增大支援队伍，调度城管一起协同解决增大支援队伍，
                调度城管一起协同解决增大支援队伍，
                调度城管一起协同解决增大支援队伍，调度城管一起协同解决增大支援队伍，调度城管一起协同解决
              </div>
            </li>
            <div class="content-divide"></div>
            <li>
              <div>
                <span>wang东东</span>
                <span>2018-11-21 17:15</span>
              </div>
              <div>
                增大支援队伍，调度城管一起协同解决增大支援队伍，调度城管一起协同解决增大支援队伍，
                调度城管一起协同解决增大支援队伍，
                调度城管一起协同解决增大支援队伍，调度城管一起协同解决增大支援队伍，调度城管一起协同解决
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="operation-footer">
        <template v-if="$route.query.status !== 'ending'">
          <el-button class="operation_btn function_btn" @click="skipReportPage">再次呈报</el-button>
        </template>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
      <BigImg :imgList="imgList1" :imgIndex='imgIndex' :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
    </div>
  </vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
import { getEventDetail } from '@/views/index/api/api.event.js';
import BigImg from './components/bigImg.vue';
export default {
  components: { EventBasic, BigImg },
  data () {
    return {
      imgIndex: 0, // 点击的图片索引
      isShowImg: false, // 是否放大图片
      imgList1: [],
      basicInfo: {
        eventCode: 'XD111111111111111',
        eventTypeName: '自然灾害',
        eventLevelName: 'V级',
        reportTime: '2019-03-12',
        reporterPhone: '18076543210',
        eventAddress: '湖南省长沙市天心区创谷产业工业园',
        casualties: -1,
        imgList: [
          {
            uid: '001',
            src: require('./img/1.jpg')
          },
          {
            uid: '002',
            src: require('./img/2.jpg')
          },
          {
            uid: '003',
            src: require('./img/3.jpg')
          },
          {
            uid: '004',
            src: require('./img/4.jpg')
          }
        ],
        eventDetail: '爱丽丝的煎熬了就爱上邓丽君爱上了的就爱上了大家看ask啦撒赖扩大就阿斯顿卢卡斯爱上了卡盎司伦敦快乐打卡是卡拉卡斯底库；啊撒扩大；扩大卡的可撒赖打开撒爱上了打开奥昇卡是；啊撒扩大；爱上了底库；案例的伤口看了',
      }, // 事件详情
    }
  },
  methods: {
    // 获取事件详情
    getDetail () {
      const eventId = '';
      getEventDetail(eventId)
        .then(res => {
          if (res) {
            this.basicInfo = res.data;
          }
        })
        .catch(() => {})
    },
    // 跳至向上级呈报页面
    skipReportPage () {
      this.$router.push({name: 'event_report'});
    },
    // 返回
    back () {
      this.$router.back(-1);
    },
    // 图片放大传参
    emitHandleImg (isShow, index) {
      console.log(isShow);
      console.log(index);
      this.openBigImg(index, this.basicInfo.imgList);
    },
    // 关闭图片放大
    emitCloseImgDialog(data){
      this.imgList1 = [];
      this.isShowImg = data;
    },
    // 放大图片
    openBigImg (index, data) {
      this.isShowImg = true;
      this.imgIndex = index;
      this.imgList1 = JSON.parse(JSON.stringify(data));
    },
  }
}
</script>
<style lang="scss" scoped>
.report-detail {
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 100px;
    .receive_box {
      width: 100%;
      margin-top: -20px;
      margin-bottom: 20px;
      background: #ffffff;
      .divide {
        border: 1px dashed #F2F2F2;
      }
      >ul {
        padding: 10px 20px;
        width: 700px;
        >li {
          display: flex;
          width: 100%;
          margin-bottom: 10px;
          span:first-child {
            display: inline-block;
            text-align: right;
            width: 70px;
            color: #666666;
            margin-right: 10px;
          }
          span:last-child {
            width: calc(700px - 70px);
            color: #333333;
          }
        }
      }
    }
    .report-content {
      width: 100%;
      margin-bottom: 20px;
      background-color: #ffffff;
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
      .header {
        padding: 10px 20px 0 20px;
        > p {
          color: #333333;
          font-size: 16px;
          font-weight: 600;
        }
      }
      .divide {
        width: 100%;
        height: 1px;
        margin-top: 10px;
        background-color: #F2F2F2;
      }
      .report-list {
        padding: 10px 20px;
        > li {
          > div {
            line-height: 25px;
            color: #333333;
            &:nth-child(1) {
              span:nth-child(1) {
                color: #333333;
                margin-right: 10px;
              }
              span:nth-child(2) {
                color: #666666;
              }
            }
            &:nth-child(2) {
              width: 50%;
            }
          }
        }
        .content-divide {
          width: 100%;
          height: 1px;
          margin: 5px 0;
          border-bottom: 1px dashed #F2F2F2;
        }
      }
    }
  }
  .operation-footer {
    border-left: 1px solid #F2F2F2;
    width: 100%;
    height: 65px;
    line-height: 65px;
    position: fixed;
    bottom: 0;
    background: #ffffff;
    padding-left: 20px;
    .operation_btn {
      padding: 0;
      width: 100px;
      height: 40px;
      text-align: center;
    }
    .function_btn {
      background: #0C70F8;
      color: #ffffff;
    }
    .back_btn {
      background: #ffffff;
      border: 1px solid #DDDDDD;
      color: #666666;
    }
  }
}
</style>


