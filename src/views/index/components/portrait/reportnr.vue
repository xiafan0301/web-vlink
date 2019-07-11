<template>
  <div class="vehicle_content_nr">
    <div class="vc_rep_bd" is="vehicleBreadcrumb" :oData="[{name: '人员侦察报告内容'}]"></div>
    <div style="height: 50px"></div>
    <div class="vehicle_content_nr_box">
      <div class="vehicle_content_nr_box_left">

      </div>
      <div class="vehicle_content_nr_box_right">
        <div class="vehicle_content_nr_box_right_top">
          <ul class="tab-menu">
            <li
                v-for="(item,index) in tabList"
                :key="index"
                :class="{'is-active': selectIndex === item.value}"
                @click="selectTab(item.value)"
            >{{item.label}}</li>
          </ul>
        </div>
        <div class="vehicle_content_nr_box_right_bot">
          <div class="cont">
            <div class="top">
              最相似人员档案
            </div>
            <div class="message">
              <div class="text">1：基本信息</div>
              <div class="message_cont">
                <img src="../../../../../public/static/img/vis-eg.png" height="200" width="200"/>
                <div style="padding-left: 20px; width: 320px">
                  <div class="subdata">
                    <i class="vl_icon vl_icon_retrieval_03" style="height: 24px"></i>
                    <b>99.12</b>%
                  </div>
                  <ul class="mes_cot">
                    <li><span>姓名：</span><p>冉金敏</p></li>
                    <li><span>证件类型：</span><p>冉金敏</p></li>
                    <li><span>证件号码：</span><p>432501199111110011</p></li>
                    <li><span>性别：</span><p>冉金敏</p></li>
                    <li><span>民族：</span><p>冉金敏</p></li>
                  </ul>
                </div>
                <div class="mes_cot_1">
                  <p>备注：</p>
                  <div>
                    人物简介，简单介绍先进集体中的每个先进人物，或单个英雄、模范人物时，运用的一种应用文样式。目的在于激励先进，促使人们互相学习，互相鼓励，共同前进。正文内容，通常包括被介绍人的姓名、性别、年龄、职业、突出贡献、获得的荣誉称号等。在介绍完人物的上述情况之后，必要的可以写一句半句歌颂、赞扬的话。对其贡献作出评价，以表明作者态度。
                  </div>
                </div>
              </div>
            </div>
            <div class="message_1 message">
              <div class="text">1：基本信息</div>
              <p>底库信息：底库1，底库2</p>
              <p>分组信息：分组1，分组2</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vehicleBreadcrumb from './breadcrumb.vue';
export default {
  components: {vehicleBreadcrumb},
  data () {
    return {
      tabList: [
        {
          label: "人员档案",
          value: 1
        },
        {
          label: "同行分析",
          value: 0
        },
        {
          label: "落脚点分析",
          value: 2
        },
        {
          label: "轨迹分析",
          value: 3
        }
      ],
      selectIndex: 1,
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      taskForm: {
        reportTime: "", // 日期
        taskName: "" // 任务名称
      },
      list: [], //已完成列表
      userInfo: {}, // 存储的用户信息
      deleteDialog: false,
      interruptDialog: false,    //中断任务
      isLoading: false,
      taskObj: '',     //单个列表任务
    }
  },
  created() {
    this.userInfo = this.$store.state.loginUser;
  },
  mounted () {
  },
  methods: {
    //tab切换
    selectTab(val) {
      this.selectIndex = val;
    },
  }
}
</script>
<style lang="scss" scoped>
  .vehicle_content_nr{
    height: 100%;
    .vehicle_content_nr_box{
      height: calc(100% - 50px);
      display: flex;
      .vehicle_content_nr_box_left{
        height: 100%;
        width: 272px;
        /*margin-right: 10px;*/
        background-color: white;
        box-shadow:2px 3px 10px 0px rgba(131,131,131,0.28);
      }
      .vehicle_content_nr_box_right{
        height: 100%;
        width: calc(100% - 272px);
        .vehicle_content_nr_box_right_top{
          width: 100%;
          box-shadow:2px 3px 10px 0px rgba(131,131,131,0.28);
          .tab-menu {
            background-color: #fff;
            padding-top: 8px;
            overflow: hidden;
            border-bottom: 1px solid #f2f2f2;
            li {
              float: left;
              width: auto;
              font-size: 16px;
              margin: 0 20px;
              height: 44px;
              line-height: 44px;
              text-align: center;
              color: #999999;
              cursor: pointer;
            }
            .is-active {
              color: #0c70f8;
              border-bottom: 2px solid #0c70f8;
              font-weight:bold;
            }
          }
        }
        .vehicle_content_nr_box_right_bot{
          padding: 20px;
          height: calc(100% - 53px);
          overflow: auto;
          .cont{
            background: #ffffff;
            min-height: 100%;
            box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
            .top{
              color: #333333;
              font-weight: bold;
              padding: 20px;
              border-bottom: 1px solid #F2F2F2;
              font-size: 16px;
            }
            .message{
              padding-top: 10px;
              padding-left: 20px;
              padding-bottom: 15px;
              border-bottom: 1px solid #F2F2F2;
              .text{
                color: #333333;
                font-size: 14px;
                font-weight:bold;
                padding-bottom: 5px;
              }
              .message_cont{
                display: flex;
                .subdata{
                  color: #0c70f8;
                  line-height: 36px;
                  b{
                    padding-left: 5px;
                    font-size: 28px;

                  }
                }
                .mes_cot{
                  flex: 0;
                  p{
                    white-space: nowrap;
                  }
                  li{
                    padding-bottom: 15px;
                    color: #666666;
                  }
                  span{
                    float: left;
                    padding-right: 10px;
                    text-align: right;
                    width: 85px;
                  }
                }
                .mes_cot_1{
                  width: 490px;
                  color: #666666;
                  p{
                    padding-bottom: 5px;
                  }
                }
              }
            }
            .message_1{
              border: none !important;
              color: #666666;
              p{
                padding-bottom: 10px;
              }
            }
          }
        }
      }
    }
  }

</style>