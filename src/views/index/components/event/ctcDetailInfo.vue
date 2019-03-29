<template>
  <vue-scroll>
    <div class="ctc-detail-info">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/ctc' }">调度指挥</el-breadcrumb-item>
          <el-breadcrumb-item>调度详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <EventBasic :status="$route.query.status" :basicInfo="basicInfo" @emitHandleImg="emitHandleImg"></EventBasic>
        <div class="event-ctc-content" v-show="basicInfo.taskList && basicInfo.taskList.length > 0">
          <div class="header">
            <p class="ctc-title">调度指挥方案</p>
          </div>
          <div class="divide"></div>
          <ul class="content-list">
            <li v-for="(item, index) in basicInfo.taskList" :key="'item' + index">
              <div>
                <span>调度部门：</span>
                <span>{{item.departmentName}}</span>
              </div>
              <div>
                <span>任务名称：</span>
                <span>{{item.taskName}}</span>
              </div>
              <div class="ctc-content">
                <span>任务内容：</span>
                <span>{{item.taskContent}}</span>
              </div>
              <div class="divide-list"></div>
            </li>
          </ul>
        </div>
        <div class="judge_result">
          <div class="header">
            <p class="ctc-title">研判结果</p>
          </div>
          <div class="divide"></div>
          <div class="judge_result_content">
            <div class="no_result">
              <i class="vl_icon vl_icon_event_16"></i>
              <span>暂无数据</span>
            </div>
          </div>
        </div>
        <div class="summary" v-show="basicInfo.eventSummary">
          <div class="header">
            <p class="ctc-title">调度总结</p>
          </div>
          <div class="divide"></div>
          <div class="summary-content">
            <p class="content-icon"><i class="vl_icon vl_icon_event_1"></i></p>
            <p>{{basicInfo.eventSummary}}</p>
          </div>
        </div>
        <div class="event-process" v-show="(basicInfo.taskList && basicInfo.taskList.length > 0) || (basicInfo.processingList && basicInfo.processingList.length > 0)">
          <div class="header">
            <p class="ctc-title">事件进展</p>
          </div>
          <div class="divide"></div>
          <div class="process-box">
            <div class="department">
              <p>参与部门</p>
              <ul>
                <li v-for="(item, index) in basicInfo.taskList" :key="'item' + index">
                  <span>{{item.departmentName}}</span>
                  <span>{{item.createTime}}</span>
                  <span>{{item.taskStatusName}}</span>
                </li>
              </ul>
            </div>
            <div class="process-list">
              <p>事件过程</p>
              <ul>
                <li v-for="(item, index) in basicInfo.processingList" :key="index">
                  <div class='circle-left'>
                    <div class='big-circle'>
                      <div class='small-circle'></div>
                    </div>
                  </div>
                  <div class='line'></div>
                  <div class="content-right">
                    <div class='content'>{{item.processContent}}（操作人：{{item.opUserName}}）</div>
                    <div class='time'>{{item.createTime}}</div>
                    <div style="width:100%;margin-top:10px;">
                      <img
                        style="width: 80px;height: 80px;border-radius: 4px;margin-right: 5px;cursor:pointer;"
                        v-for="(itm, index) in item.attachmentList"
                        :key="'item' + index"
                        :src="itm.src"
                        @click="openBigImg(index, item.attachmentList)"
                      >
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="operation-footer">
        <template v-if="$route.query.status === 'ctc_ing'">
          <el-button class="operation_btn function_btn" @click="skipAgainCtcPage">再次调度</el-button>
          <el-button class="operation_btn back_btn" @click="skipCtcEndPage">结束调度</el-button>
        </template>
        <el-button class="operation_btn back_btn" @click="back">返回</el-button>
      </div>
      <BigImg :imgList="imgList1" :imgIndex='imgIndex' :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
    </div>
  </vue-scroll>
</template>
<script>
import EventBasic from './components/eventBasic';
import { getEventDetail } from '@/views/index/api/api.js';
import BigImg from './components/bigImg.vue';
export default {
  components: { EventBasic, BigImg },
  data () {
    return {
      imgIndex: 0, // 点击的图片索引
      isShowImg: false, // 是否放大图片
      imgList1: [],
      basicInfo: {
        // eventCode: 'XD111111111111111',
        // eventTypeName: '自然灾害',
        // eventLevelName: 'V级',
        // reportTime: '2019-03-12',
        // reporterPhone: '18076543210',
        // eventAddress: '湖南省长沙市天心区创谷产业工业园',
        // casualties: -1,
        // imgList: [
        //   {
        //     uid: '001',
        //     src: require('./img/1.jpg')
        //   },
        //   {
        //     uid: '002',
        //     src: require('./img/2.jpg')
        //   },
        //   {
        //     uid: '003',
        //     src: require('./img/3.jpg')
        //   },
        //   {
        //     uid: '004',
        //     src: require('./img/4.jpg')
        //   }
        // ],
        // taskList: [
        //   {
        //     departmentName: '公安部',
        //     taskName: '救火',
        //     taskContent: '起火了起火了了啦啦啦啦啦啦啦',
        //     createTime: '2019-03-12 12:12:12',
        //     taskStatusName: '未查看'
        //   },
        //   {
        //     departmentName: '消防部',
        //     taskName: '救火',
        //     taskContent: '起火了起火了了啦啦啦啦啦啦啦',
        //     createTime: '2019-03-12 12:12:24',
        //     taskStatusName: '已查看'
        //   },
        //   {
        //     departmentName: '就业部',
        //     taskName: '救火',
        //     taskContent: '起火了起火了了啦啦啦啦啦啦啦',
        //     createTime: '2019-03-12 19:12:24',
        //     taskStatusName: '已完成'
        //   }
        // ],
        // processingList: [
        //   {
        //     createTime: '2019-03-12 12:12:12',
        //     processContent: '阿三打撒看大家爱上了大家啊是了看静安寺大撒可怜见的',
        //     opUserName: '张三',
        //     attachmentList: [
        //       {
        //         uid: '001',
        //         src: require('./img/1.jpg')
        //       },
        //       {
        //         uid: '002',
        //         src: require('./img/2.jpg')
        //       },
        //       {
        //         uid: '003',
        //         src: require('./img/3.jpg')
        //       },
        //       {
        //         uid: '004',
        //         src: require('./img/4.jpg')
        //       }
        //     ]
        //   },
        //   {
        //     createTime: '2019-03-12 12:12:12',
        //     processContent: '阿三打撒看大家爱上了大家啊是了看静安寺大撒可怜见的',
        //     opUserName: '张三'
        //   },
        //   {
        //     createTime: '2019-03-12 12:12:12',
        //     processContent: '阿三打撒看大家爱上了大家啊是了看静安寺大撒可怜见的',
        //     opUserName: '张三',
        //     attachmentList: [
        //       {
        //         uid: '001',
        //         src: require('./img/1.jpg')
        //       },
        //       {
        //         uid: '002',
        //         src: require('./img/2.jpg')
        //       },
        //       {
        //         uid: '003',
        //         src: require('./img/3.jpg')
        //       },
        //       {
        //         uid: '004',
        //         src: require('./img/4.jpg')
        //       }
        //     ]
        //   }
        // ],
        // eventSummary: '啊杀掉了空间阿斯卡里的时间看来撒就看到了啊数据利空打击爱上了大家爱上了大家卡是垃圾的爱神的箭卡萨拉大家爱上了大家阿拉斯加的看拉萨就对啦洒家扩大撒娇的撒垃圾大安静多了家啊大家爱神的箭爱上了大家安静的拉开觉得觉得安静的爱了就的阿加大家的克拉克大家案例大家啊是多久啊空间', // 事件总结
        // eventDetail: '爱丽丝的煎熬了就爱上邓丽君爱上了的就爱上了大家看ask啦撒赖扩大就阿斯顿卢卡斯爱上了卡盎司伦敦快乐打卡是卡拉卡斯底库；啊撒扩大；扩大卡的可撒赖打开撒爱上了打开奥昇卡是；啊撒扩大；爱上了底库；案例的伤口看了',
      }, // 事件详情
    }
  },
  mounted () {
    this.getDetail();
  },
  methods: {
    // 跳至结束调度页面
    skipCtcEndPage () {
      this.$router.push({name: 'ctc_end', query: { eventId: this.$route.query.id }});
    },
    // 跳至再次调度页面
    skipAgainCtcPage () {
      this.$router.push({name: 'ctc_operation', query: { eventId: this.$route.query.id }});
    },
    // 获取事件详情
    getDetail () {
      const eventId = this.$route.query.id;
      getEventDetail(eventId)
        .then(res => {
          if (res) {
            this.basicInfo = res.data;
          }
        })
        .catch(() => {})
    },
    // 图片放大传参
    emitHandleImg (isShow, index) {
      this.openBigImg(index, this.basicInfo.attachmentList);
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
    // 返回
    back () {
      this.$router.back(-1);
    }
  }
}
</script>
<style lang="scss" scoped>
.ctc-detail-info {
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 100px;
    .event-ctc-content, .judge_result, .event-process, .summary {
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
        .ctc-title {
          margin-bottom: 10px;
        }
      }
      .divide {
        width: 100%;
        height: 1px;
        background-color: #F2F2F2;
      }
      .content-list {
        padding: 10px 20px 10px 20px;
        > li {
          display: flex;
          flex-wrap: wrap;
          > div {
            // height: 30px;
            line-height: 30px;
            span:nth-child(1) {
              color: #666666;
            }
            span:nth-child(2) {
              color: #333333;
            }
            &:nth-child(1) {
              width: 25%;
            }
            &:nth-child(2) {
              width: 60%;
            }
            &:nth-child(3) {
              display: flex;
              span:nth-child(2) {
                width: 750px;
                display: inline-block;
              }
            }
          }
          .divide-list {
            width: 100%;
            height: 1px;
            margin: 10px 0;
            border-bottom: 1px dashed #F2F2F2;
            
          }
          &:last-child {
            .divide-list {
              display: none;
            }
          }
        }
        
      }
      .judge_result_content {
        width: 100%;
        .no_result {
          height: 100px;
          line-height: 100px;
          display: flex;
          align-items: center;
          margin-left: 45%;
          >span {
            margin-left: 10px;
            color: #999999;
            font-size: 16px;
          }
        }
      }
      .process-box {
        width: 100%;
        padding: 20px;
        .department{
          > p {
            color: #333333;
            font-weight: bold;
          }
          > ul {
            margin: 10px 0;
            li {
              color: #333333;
              height: 23px;
              line-height: 23px;
              span {
                margin-right: 8px;
              }
            }
          }
        }
        .process-list {
          > p {
            color: #333333;
            font-weight: bold;
          }
          > ul {
            margin: 10px 0;
            > li {
              display: flex;
              height: 100%;
              position: relative;
              .circle-left {
                margin-top: 3px;
                .big-circle {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  border: 1px solid #0C70F8;
                  .small-circle {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #0C70F8;
                    margin: 3px auto 0 auto;
                  }
                }
              }
              .line {
                width: 1px;
                height: calc(100% - 33px);
                position: absolute;
                left: 12px;
                top: 30px;
                bottom: 10px;
                background: #0C70F8;
              }
              .content-right {
                margin-left: 1%;
                font-size: 13px;
                .time {
                  color:#9D9D9D;
                  margin-bottom: 5px;
                }
                .content {
                  color: #333333;
                  margin-bottom: 5px;
                }
              }
              &:last-child .line {
                display: none;
              }
            }
          }
        }
      }
      .summary-content {
        padding: 10px 20px;
        >p:nth-child(2) {
          color: #000000;
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


