<template>
  <vue-scroll>
    <div class="untreat-detail">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
          <el-breadcrumb-item>事件详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content-box">
        <div class="basic-info">
          <div class="header">
            <i></i>
            <p>事件编号：XPZ180724001</p>
          </div>
          <div class="event-status-img"></div>
          <div class='basic-detail'>
            <div class='basic-list'>
              <div>
                <span class='title'>事件类型：</span>
                <span class='content'>火灾</span>
                <!-- <span class='content'>{{eventDetailObj.eventTypeName}}</span> -->
              </div>
              <div>
                <span class='title'>事件等级：</span>
                <span class='content'>I级（特大）</span>
                <!-- <span class='content'>{{eventDetailObj.eventLevelName}}</span> -->
              </div>
              <div>
                <span class='title'>报案时间：</span>
                <span class='content'>2018-06-07 15:00</span>
                <!-- <span class='content'>{{eventDetailObj.reportTime}}</span> -->
              </div>
            </div>
            <div class='basic-list'>
              <div style='display:flex;align-items: center;'>
                <span class='title'>上报人：</span>
                <span class='content reportUser' style='margin-right:20px;'>13890809908</span>
                <!-- <span class='content' style='margin-right:20px;'>{{eventDetailObj.reporterPhone}}</span> -->
                <!-- <a :href="urlDetail + '?eventId=' + this.$route.query.eventId + '&' + userInfoParam()" target="_blank"><div class="relation-person"><i class="el-icon-phone"></i>联系上报人</div></a> -->
              </div>
              <div style='width: 65%'>
                <span class='title'>事发地点：</span>
                <span class='content'>长沙市创谷工业园，地址如果文字过多，可以多行显示</span>
                <!-- <span class='content'>{{eventDetailObj.eventAddress}}</span> -->
              </div>
            </div>
            <div class='basic-list'>
              <div>
                <span class='title'>人员伤亡：</span>
                <span class='content'>不确定</span>
                <!-- <template v-if='eventDetailObj.casualties == -1'>
                  <span class='content'>不确定</span>
                </template>
                <template v-else-if='eventDetailObj.casualties == 0'>
                  <span class='content'>无</span>
                </template>
                <template v-if='eventDetailObj.casualties > 0'>
                  <span class='content'>{{eventDetailObj.casualties}}</span>
                </template> -->
              </div>
            </div>
            <div class='basic-list'>
              <div style='width: 100%'>
                <span class='title'>事件情况：</span>
                <span class='content'>园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火事件情况文字达到140字的行数。</span>
                <!-- <span class='content'>{{eventDetailObj.eventDetail}}</span> -->
              </div>
            </div>
            <div class='basic-list img-content'>
              <!-- <div style="width:100%;">
                <div class='img-list' style="width:auto" id="imgs" v-show="imgList && imgList.length > 0"></div>
                <div class='video-list' style="width:auto" v-show="videoList && videoList.length > 0">
                  <video id="my-video" class="video-js" controls preload="auto" width="100" height="100"
                  data-setup="{}" v-for="(item, index) in videoList" :key="'item'+index">
                    <source :src="item.url" type="video/mp4">
                    <source :src="item.url" type="video/webm">
                    <source :src="item.url" type="video/ogg">
                    <p class="vjs-no-js"> 您的浏览器不支持 video 标签。</p>
                  </video>
                </div>
              </div> -->
            </div>
          </div>
        </div>
        <div class="event-handle">
          <div class="event-handle-header">
            <span>处理事件</span>
          </div>
          <div class="divide"></div>
          <div class="handle-content">
            <div class="mutual">
              <p class="title">是否发布民众互助:</p>
              <el-radio-group v-model="isMutual">
                <el-radio :label="3">不发布</el-radio>
                <el-radio :label="6">发布</el-radio>
              </el-radio-group>
            </div>
            <div class="handle-type">
              <p class="title">请选择处理方式:</p>
              <el-radio-group v-model="handleType">
                <el-radio :label="3">
                  <span class="content">智能布控</span>
                  <span class="tip">（在监控设备上做布控，发现情况会自动告警提醒）</span>
                </el-radio>
                <el-radio :label="6">
                  <span class="content">调度指挥</span>
                  <span class="tip">（调度协调其他部门协调解决）</span>
                </el-radio>
                <el-radio :label="9">
                  <span class="content">呈报上级</span>
                  <span class="tip">（处理不了的事件可以向上级呈报）</span>
                </el-radio>
                <el-radio :label="9">
                  <span class="content">转到其他单位</span>
                  <span class="tip">（不属于本单位处理的事件可以转到其它单位处理）</span>
                </el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </div>
      <div class="operation-footer">
        <el-button class="operation_btn function_btn">确定</el-button>
        <el-button class="operation_btn function_btn">结束事件</el-button>
        <el-button class="operation_btn back_btn">返回</el-button>
      </div>
    </div>
  </vue-scroll>
</template>
<script>
export default {
  data () {
    return {
      isMutual: null, // 是否发布民众互助
      handleType: null, // 选择处理的方式
    }
  }
}
</script>
<style lang="scss" scoped>
.untreat-detail {
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 20px;
    margin-bottom: 100px;
    .basic-info, .event-handle {
      width: 100%;
      margin-bottom: 20px;
      background-color: #ffffff;
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
      .divide {
        width: 100%;
        height: 1px;
        background-color: #F2F2F2;
      }
      .header {
        padding: 10px 20px 0 20px;
        > p {
          color: #333333;
          font-size: 16px;
          font-weight: 600;
        }
      }
      .event-handle-header {
        > span {
          display: inline-block;
          padding: 10px 20px;
          color: #333333;
          font-weight: 600;
          font-size: 16px;
        }
      }
      .basic-detail {
        width: 100%;
        display:flex;
        padding: 10px 20px;
        flex-direction: column;
        .basic-list {
          display: flex;
          flex-wrap: wrap;
          div {
            width:33.3%;
            line-height:27px;
            .title {
              color: #666666;
              font-size: 14px;
              width: 80px;
              display: inline-block;
              text-align: right;
            }
            .content {
              color: #333333;
              font-size: 14px;
              margin-left: 1%;
            }
            .reportUser {
              color: #0C70F8;
              cursor: pointer;
            }
          }
        }
        .img-content {
          width: 100%;
          padding-left: 80px;
        }
      }
      .handle-content {
        width: 100%;
        padding: 10px 20px;
        .mutual, .handle-type {
          margin-bottom: 10px;
          .title {
            color: #333333;
            font-weight: bold;
          }
          /deep/ .el-radio-group {
            display: flex;
            flex-direction: column;
          }
          /deep/ .el-radio+.el-radio {
            margin-left: 0;
          }
          /deep/ .el-radio {
            color: #333333;
            line-height: 30px;
          }
          /deep/ .el-radio__input.is-checked .el-radio__inner {
            border-color: #0C70F8;
            background: #0C70F8;
          }
          /deep/ .el-radio__input.is-checked+.el-radio__label {
            color: #333333;
          }
          .content {
            color: #333333;
          }
          .tip {
            color: #999999;
          }
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


