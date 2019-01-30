<template>
  <div class="basic-info">
    <div class="header">
      <i class="vl_icon vl_icon_event_4"></i>
      <span>事件编号：XPZ180724001</span>
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
          <span class='content' style="width: 50%;display:inline-block;">园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火事件情况文字达到140字的行数。</span>
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
</template>
<style lang="scss">
.basic-info{
  width: 100%;
  margin-bottom: 20px;
  background-color: #ffffff;
  box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
  border-radius:4px;
  .header {
    display: flex;
    padding: 10px 20px 0 20px;
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
          display: inline-block;
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
}
</style>

