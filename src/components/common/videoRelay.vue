<template>
  <el-dialog
    class="video_replay_dialog"
    :visible.sync="dialogVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="12rem"
    >
    <div class="video_replay">
      <div class="video_container" v-if="videoList.length > 0">
        <div class="img_box">
          <div style="height: 100%">
            <div is="flvplayer" @playEnded="playEnded" :isVideoReplay="true" :oConfig="{close: false}" :index="videoActiveIndex" :oData="videoList[videoActiveIndex]" :signAble="true" :bResize="bResize"></div>
          </div>
          <!-- <img src="../../assets/img/666.jpg" alt="" /> -->
          <span class="sl_back_btn left el-icon-arrow-left" :class="{'back_btn_disabled': videoActiveIndex === 0}" @click="nextBackSingle(false)"></span>
          <span class="sl_back_btn right el-icon-arrow-right" :class="{'back_btn_disabled': videoActiveIndex === (videoList.length - 1)}" @click="nextBackSingle(true)"></span>
          <i class="vl_icon vl_icon_event_23 close_btn" @click="playerClose"></i>
          <!-- <div class="operation_box">
            aaaa
          </div>  -->
        </div>
        <div class="bottom">
          <p>{{videoActiveIndex + 1}}</p>
          <div class="right_info">
            <div class="top_info">
              <p>
                <i class="el-icon-time"></i>
                <span>{{videoList[videoActiveIndex].shotTime}}</span>
                <!-- <span>2018-11-12 20:55:47</span> -->
              </p>
              <p>
                <i class="vl_icon vl_icon_v11"></i>
                <span>{{videoList[videoActiveIndex].deviceName}}</span>
                <!-- <span>拍摄设备：摄像头RA325645</span> -->
              </p>
            </div>
            <div class="bottom_info">
              <i class="vl_icon vl_icon_event_27"></i>
              <span>{{videoList[videoActiveIndex].address}}</span>
              <!-- <span>长沙市天心区桂花坪街道芙蓉南路二段169号桂花坪街道芙蓉南路二段169号路二段169号桂花坪街道芙蓉南路二段169号</span> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>

</template>
<script>
import flvplayer from '@/components/common/flvplayer.vue';
export default {
  /**
   * videReplayList: []  视频数据
   */
  components: { flvplayer },
  props: [ 'videReplayList' ],
  data () {
    return {
      dialogVisible: false,
      bResize: {},
      videoActiveIndex: 0,
      videoList: [
        // {
        //   type: 3,
        //   video: {
        //     uid: '33',
        //     downUrl: require('../../assets/video/demo.mp4')
        //   },
        //   address: "湖南省怀化市溆浦县卢峰镇溆浦县老年大学1",
        //   deviceName: "模拟摄像头1",
        //   shotTime: "2019-11-08 00:45:02",
        // },{
        //   type: 3,
        //   video: {
        //     uid: '33',
        //     downUrl: require('../../assets/video/video.mp4')
        //   },
        //   address: "湖南省怀化市溆浦县卢峰镇溆浦县老年大学2",
        //   deviceName: "模拟摄像头2",
        //   shotTime: "2019-11-08 00:45:02",
        // },{
        //   type: 3,
        //   video: {
        //     uid: '33',
        //     downUrl: require('../../assets/video/demo.mp4')
        //   },
        //   address: "湖南省怀化市溆浦县卢峰镇溆浦县老年大学3",
        //   deviceName: "模拟摄像头3",
        //   shotTime: "2019-11-08 00:45:02",
        // }
      ]
    }
  },
  watch: {
    videReplayList (data) {
      this.videoList = data;
    }
  },
  mounted () {
    // if (this.videReplayList.length > 0) {
    //   // this.videoList = Object.assign(this.videoList, this.videReplayList);
    // }
  },
  methods: {
    /**
     * 关闭弹框
     */
    playerClose () {
      this.dialogVisible = false;
      this.videoActiveIndex = 0;
      this.$emit('closeDialog', false);
    },
    toogleVisiable (bool) {
      this.dialogVisible = bool;
    },
    // 判断当前视频是否已经播放完毕
    playEnded (val) {
      let length = this.videoList.length;
      if (val) {
        if (this.videoActiveIndex < (length - 1)) {
          this.videoActiveIndex ++;
        }
      } else {
        if (this.videoActiveIndex > 0 ) {
          this.videoActiveIndex --;
        }
      }
    },
    // 视频切换
    nextBackSingle (bool) {
      let length = this.videoList.length;
      if (bool) {
        if (this.videoActiveIndex < (length - 1)) {
          this.videoActiveIndex ++;
        }
      } else {
        if (this.videoActiveIndex > 0 ) {
          this.videoActiveIndex --;
        }
      }
    }
  }
}
</script>
<style lang="scss">
.video_replay_dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
  .back_btn_disabled {
    cursor: not-allowed !important;
    color: #999999 !important;
  }
}
</style>
<style lang="scss" scoped>
.video_replay {
  width: 100%;
  height: 600px;
  border-radius: 2px;
  .video_container {
    width: 100%;
    height: 100%;
    >.img_box {
      width: 100%;
      height: calc(100% - 70px);
      position: relative;
      // > .back_btn_disabled {
      //   cursor: not-allowed;
      //   color: #999999;
      // }
      .operation_box {
        width: 100%;
        display: none;
        position:absolute;
        bottom: 0;
        left: 0;
        background: #222222;
        opacity: .65;
        height: 50px;
        line-height: 50px;
        color: #fff;
        
      }
      &:hover {
        .operation_box {
          display: block;
          animation: fadeIn 0.3s ease-out 0.1s both;
        }
      }
      > img {
        width: 100%;
        height: 100%;
      }
      .close_btn {
        position: absolute;
        cursor: pointer;
        right: -35px;
        top: -35px;
      }
      .sl_back_btn {
        z-index: 250;
        position: absolute;
        top: 50%;
        cursor: pointer;
        color: #ffffff;
        font-size: 70px;
      }
      .left {
        left: 0;
      }
      .right {
        right: 0;
      }
    }
    .bottom {
      padding: 15px;
      height: 70px;
      >p {
        width: 40px;
        height: 40px;
        background:rgba(4,102,222,1);
        border-radius:2px;
        text-align: center;
        color: #ffffff;
        font-size: 18px;
        line-height: 40px;
        font-weight: bold;
        float:left;
      }
      .right_info {
        float: right;
        color: #333333;
        width: calc(100% - 70px);
        .top_info {
          > p { 
            // height: 20px;
            line-height: 20px;
            margin-right: 20px;
            float: left;
            > i, >span {
              margin-right: 5px;
              vertical-align: middle;
            }
          }
        }
        .bottom_info {
          clear: both;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          > i, >span {
            margin-right: 5px;
            vertical-align: middle;
          }
        }
      }
    }
  }
}
</style>