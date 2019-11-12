<template>
  <el-dialog
    class="video_replay_dialog"
    :visible.sync="dialogVisible"
    width="9.2rem"
    >
    <div class="video_replay">
      <div class="img_box">
        <img src="../../assets/img/666.jpg" alt="" />
        <span class="sl_back_btn left el-icon-arrow-left" :class="{'back_btn_disabled': snapBackActiveIndex === 0}" @click="nextBackSingle(false)"></span>
        <span class="sl_back_btn right el-icon-arrow-right" :class="{'back_btn_disabled': snapBackActiveIndex === 19}" @click="nextBackSingle(true)"></span>
        <i class="vl_icon vl_icon_event_23 close_btn"></i>
        <div class="operation_box">
          aaaa
        </div> 
      </div>
      <div class="bottom">
        <p>1</p>
        <div class="right_info">
          <div class="top_info">
            <p>
              <i class="el-icon-time"></i>
              <span>2018-11-12 20:55:47</span>
            </p>
            <p>
              <i class="vl_icon vl_icon_v11"></i>
              <span>拍摄设备：摄像头RA325645</span>
            </p>
          </div>
          <div class="bottom_info">
            <i class="vl_icon vl_icon_event_27"></i>
            <span>长沙市天心区桂花坪街道芙蓉南路二段169号桂花坪街道芙蓉南路二段169号路二段169号桂花坪街道芙蓉南路二段169号</span>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>

</template>
<script>
export default {
  data () {
    return {
      dialogVisible: true,
      snapBackActiveIndex: 19
    }
  },
  methods: {
    nextBackSingle () {}
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
}
</style>
<style lang="scss" scoped>
.video_replay {
  width: 100%;
  height: 600px;
  border-radius: 2px;
  >.img_box {
    width: 100%;
    height: calc(100% - 70px);
    position: relative;
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
      position: absolute;
      top: 50%;
      cursor: pointer;
      color: #ffffff;
      font-size: 50px;
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
</style>