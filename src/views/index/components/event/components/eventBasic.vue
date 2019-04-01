<template>
  <div class="basic-info">
    <div class="header">
      <i class="vl_icon vl_icon_event_4"></i>
      <span>事件编号：{{basicInfo.eventCode}}</span>
    </div>
    <div class="event-status-img">
      <template v-if="status === 'unhandle'">
        <i class="vl_icon vl_icon_event_9"></i>
      </template>
      <template v-if="status === 'handling'">
        <i class="vl_icon vl_icon_event_10"></i>
      </template>
      <template v-if="status === 'ending' || status === 'ctc_end'">
        <i class="vl_icon vl_icon_event_11"></i>
      </template>
      <template v-if="status === 'ctc_ing'">
        <i class="vl_icon vl_icon_event_13"></i>
      </template>     
    </div>
    <div class='basic-detail'>
      <div class='basic-list'>
        <div>
          <span class='title'>事件类型：</span>
          <!-- <span class='content'>火灾阿萨达萨达萨达萨达</span> -->
          <span class='content'>{{basicInfo.eventTypeName}}</span>
        </div>
        <div>
          <span class='title'>事件等级：</span>
          <!-- <span class='content'>I级（特大）</span> -->
          <span class='content'>{{basicInfo.eventLevelName}}</span>
        </div>
        <div>
          <span class='title'>报案时间：</span>
          <!-- <span class='content'>2018-06-07 15:00</span> -->
          <span class='content'>{{basicInfo.reportTime}}</span>
        </div>
      </div>
      <div class='basic-list'>
        <div style='display:flex;align-items: center;'>
          <span class='title'>上报人：</span>
          <div class="content phone_box" style='margin-right:20px;'>
            <template v-if="status === 'ending' || status === 'ctc_end' || !status">
              <span class='content'>{{basicInfo.reporterPhone}}</span>
            </template>
            <template v-else>
              <span class='reportUser'>{{basicInfo.reporterPhone}}</span>
              <div class="phone_dialog">
                <div>
                  <i class="vl_icon vl_icon_event_14"></i>
                  <span>语音通话</span>
                </div>
                <div>
                  <i class="vl_icon vl_icon_event_17"></i>
                  <span>视频通话</span>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div style='width: 65%'>
          <span class='title'>事发地点：</span>
          <!-- <span class='content'>长沙市创谷工业园，地址如果文字过多，可以多行显示</span> -->
          <span class='content'>{{basicInfo.eventAddress}}</span>
        </div>
      </div>
      <div class='basic-list'>
        <div>
          <span class='title'>人员伤亡：</span>
          <!-- <span class='content'>不确定</span> -->
          <template v-if='basicInfo.casualties == -1'>
            <span class='content'>不确定</span>
          </template>
          <template v-else-if='basicInfo.casualties == 0'>
            <span class='content'>无</span>
          </template>
          <template v-if='basicInfo.casualties > 0'>
            <span class='content'>{{basicInfo.casualties}}</span>
          </template>
        </div>
      </div>
      <div class='basic-list'>
        <div style='width: 100%'>
          <span class='title'>事件情况：</span>
          <span class='content' style="width: 50%;display:inline-block;">{{basicInfo.eventDetail}}</span>
        </div>
      </div>
      <div class='basic-list img-content'>
        <img
          v-for="(item, index) in basicInfo.attachmentList"
          :key="index"
          :src="item.path"
          @click="handleBigImg(index)"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: [ 'status', 'basicInfo' ],
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    // 图片放大
    handleBigImg (index) {
      const isShowImg = true;
      const imgIndex = index;
      this.$emit('emitHandleImg', isShowImg, imgIndex);
    }
  }
}
</script>

<style lang="scss">
.basic-info{
  width: 100%;
  margin-bottom: 20px;
  background-color: #ffffff;
  box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
  border-radius:4px;
  position: relative;
  .event-status-img {
    position: absolute;
    right: 0;
    top: 0;
  }
  .header {
    display: flex;
    padding: 10px 20px 15px 20px;
    align-items: center;
    > span {
      margin-left: 5px;
      color: #333333;
      font-size: 16px;
      font-weight: 600;
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
      > div {
        width:33.3%;
        display: flex;
        line-height: 30px;
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
          display: inline-block;
        }
        .reportUser {
          color: #0C70F8;
          cursor: pointer;
        }
        .phone_box {
          position: relative;
          padding-right: 10px;
          &:hover {
            .phone_dialog {
              display: block;
            }
          }
          .phone_dialog {
            display: none;
            position: absolute;
            background-color: #ffffff;
            right: -30px;
            bottom: 30px;
            box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.15);
            >div {
              padding: 0 10px;
              display: flex;
              align-items: center;
              cursor: pointer;
              >span {
                color: #333333;
                font-size: 12px;
              }
              &:hover {
                >span {
                  color: #0C70F8;
                }
              }
            }
          }
        }
      }
    }
    .img-content {
      width: 100%;
      padding-left: 80px;
      img {
        width: 80px;
        height: 80px;
        border-radius: 4px;
        margin: 0 5px 5px 0;
        cursor: pointer;
      }
    }
  }
}
</style>

