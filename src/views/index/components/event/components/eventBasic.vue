<template>
  <div class="basic-info">
    <div class="header">
      <i class="vl_icon vl_icon_event_4"></i>
      <span>事件编号：{{basicInfo.eventCode ? basicInfo.eventCode : '无'}}</span>
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
          <span class='content'>{{basicInfo.eventTypeName ? basicInfo.eventTypeName : '无'}}</span>
        </div>
        <div>
          <span class='title'>事件等级：</span>
          <span class='content'>{{basicInfo.eventLevelName ? basicInfo.eventLevelName : '无'}}</span>
        </div>
        <div>
          <span class='title'>报案时间：</span>
          <span class='content'>{{basicInfo.reportTime ? basicInfo.reportTime : '无'}}</span>
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
              <div class="phone_dialog" v-show="basicInfo.reporterUserId">
                <div  @click="addCalling('2')">
                  <i class="vl_icon vl_icon_event_14"></i>
                  <span>语音通话</span>
                </div>
                <div  @click="addCalling('1')">
                  <i class="vl_icon vl_icon_event_17"></i>
                  <span>视频通话</span>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div style='width: 65%'>
          <span class='title'>事发地点：</span>
          <span class='content'>{{basicInfo.eventAddress ? basicInfo.eventAddress : '无'}}</span>
        </div>
      </div>
      <div class='basic-list'>
        <div>
          <span class='title'>人员伤亡：</span>
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
          <span class='content' style="width: 50%;display:inline-block;">{{basicInfo.eventDetail ? basicInfo.eventDetail : '无'}}</span>
        </div>
      </div>
      <div class='upload_box'>
        <div class="img-box" v-for="(item, index) in uploadImgList" :key="index">
          <img
            :src="item.path"
            @click="handleBigImg(index)"
          />
        </div>
        <div class='video-box' v-for="(item, index) in uplaodVideoList" :key="index">
          <video
            :src="item.path"
          />
          <div class="play_icon">
            <i v-show="!isSmallPlaying" class="play_btn vl_icon vl_icon_control_09" @click="openVideo(item)"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 视频全屏放大 -->
    <div style="width: 0; height: 0;" v-show="showLarge" :class="{vl_j_fullscreen: showLarge}">
      <video id="eventVideo" :src="videoDetail.path"></video>
      <div @click="closeVideo" class="vl_icon vl_icon_event_23 close_icon"></div>
      <div class="control_bottom">
        <div>{{videoDetail.cname}}</div>
        <div>
          <span @click="playLargeVideo(false)" class="vl_icon vl_icon_judge_01" v-if="isPlaying"></span>
          <span @click="playLargeVideo(true)" class="vl_icon vl_icon_control_09" v-else></span>
          <span @click="cutScreen" class="vl_icon vl_icon_control_07"></span>
          <span><a download="视频" :href="videoDetail.path" class="vl_icon vl_icon_event_26"></a></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {random14} from '@/utils/util.js';
export default {
  props: [ 'status', 'basicInfo' ],
  data () {
    return {
      uploadImgList: [],
      uplaodVideoList: [],
      showLarge: false, // 全屏显示
      videoDetail: {}, // 播放视频的信息
      isPlaying: false, // 是否播放视频
      isSmallPlaying: false, // 小屏显示
    }
  },
  mounted () {
    setTimeout(() => {
      if (this.basicInfo.attachmentList && this.basicInfo.attachmentList.length > 0) {
        this.basicInfo.attachmentList.map(item => {
          if (item.fileType === 1) {
            this.uploadImgList.push(item);
          } else {
            this.uplaodVideoList.push(item);
          }
        });
      }
    }, 500)
  },
  methods: {
    // 语音视频通话
    addCalling (type) {
      let _obj = {
        uid: this.basicInfo.reporterUserId,
        longitude: this.basicInfo.longitude,
        latitude: this.basicInfo.latitude,
        remoteId: this.basicInfo.reporterUserId,
        remoteName: this.basicInfo.reporterUserName,
        type: type, // 通话类型  1--视频  2--语音
        _id: 'mapCall' + random14(),
        _mid: '',
        isTime: false,
        minute: 0,
        second: 0,
        timer: null,
        mark: null,
        mute: false
      }
      this.$store.commit('WAIT_ADD', {oAdd: _obj})
    },
    // 点击视频播放按钮全屏播放视频
    openVideo (obj) {
      this.videoDetail = obj;
      this.showLarge = true;
    },
    // 关闭视频
    closeVideo () {
      this.showLarge = false;
      document.getElementById('eventVideo').pause();
    },
    // 暂停视频
    pauseLargeVideo () {
      document.getElementById('eventVideo').pause();
      this.isPlaying = false;
    },
    // 播放视频
    playLargeVideo (val) {
       if (val) {
        this.isPlaying = true;
        document.getElementById('eventVideo').play();
        this.handleVideoEnd();
      } else {
        this.isPlaying = false;
        document.getElementById('eventVideo').pause();
      }
    },
    // 监听视频是否已经播放结束
    handleVideoEnd () {
      let _this = this;
      const obj = document.getElementById('controlVideo');
      if (obj) {
        obj.addEventListener('ended', () => { // 当视频播放结束后触发
          _this.isPlaying = false;
        });
      }
    },
    // 截屏
    cutScreen () {},
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
    .upload_box {
      width: 415px;
      padding-left: 80px;
      display: flex;
      flex-wrap: wrap;
      .img-box, .video-box {
        position: relative;
        .play_icon {
          position: absolute;
          cursor: pointer;
          top: 25%;
          left: 28%;
          border-radius: 50%;
          background: #000;
          opacity: 0.6;
          width: 40px;
          height: 40px;
          .play_btn {
            margin-left: 37%;
            margin-top: 22%;
          }
        }
        img, video {
          border: 1px solid #ccc;
          width: 100px;
          height: 100px;
          border-radius: 4px;
          margin: 0 5px 5px 0;
          cursor: pointer;
        }
      }
    }
  }
}
.vl_j_fullscreen {
  position: fixed;
  width: 100% !important;
  height: 100% !important;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #000000;
  z-index: 9999;
  -webkit-transition: all .4s;
  -moz-transition: all .4s;
  -ms-transition: all .4s;
  -o-transition: all .4s;
  transition: all .4s;
  > video {
    width: 100%;
    height: 100%;
  }
  > .control_bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 48px;
    background: rgba(0, 0, 0, .65);
    > div {
      float: left;
      width: 50%;
      height: 100%;
      line-height: 48px;
      text-align: right;
      padding-right: 20px;
      color: #FFFFFF;
      &:first-child {
        text-align: left;
        padding-left: 20px;
      }
      > span {
        display: inline-block;
        height: 22px;
        margin-left: 10px;
        vertical-align: middle;
        cursor: pointer;
        a {
          font-size: 25px;
          text-decoration: none;
          color: #ffffff;
          vertical-align: top;
        }
      }
    }
  }
}
.close_icon {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 1000;
  cursor: pointer;
}
</style>

