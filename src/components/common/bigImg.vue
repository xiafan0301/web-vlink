<template>
  <el-dialog
    :visible.sync="isShow"
    width="100%"
    append-to-body
    class="big_img_box"
    >
    <div class="box">
      <el-carousel :autoplay="false" arrow="always" height="100%" :initial-index="imgIndex">
        <el-carousel-item v-for="(item, index) in imgList" :key="index">
          <img :src="item.path" alt="">
        </el-carousel-item>
      </el-carousel>
      <i class="vl_icon vl_icon_event_23 close_icon" @click="closeImgDialog"></i>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: [ 'imgList', 'isShow', 'imgIndex' ],
  data () {
    return {
    }
  },
  methods: {
    // 关闭图片放大弹出框
    closeImgDialog () {
      this.$emit("emitCloseImgDialog", false);
    }
  }
}
</script>
<style lang="scss">
.big_img_box {
  width: 100%;
  height: 100%;
  .el-dialog {
    background-color: transparent;
    width: 100%;
    height: 100%;
    margin: 0 !important;
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
      height: 100%;
      .box {
        width: 100%;
        height: 100%;
        position: relative;
        .el-carousel {
          height: 100%;
          img {
            width: 100%;
            height: 100%;
          }
          .el-carousel__arrow {
            width: 64px;
            height: 64px;
            background-color: #0C70F8;
            i {
              font-size: 35px;
            }
          }
        }
        .close_icon {
          position: absolute;
          right: 20px;
          top: 30px;
          z-index: 1000;
          cursor: pointer;
        }
      }
    }
  }
  .el-carousel__indicators {
    display: none;
  }
}
</style>


