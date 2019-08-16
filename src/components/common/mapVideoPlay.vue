<template>
  <el-dialog
    :visible.sync="videoPlayDialog"
    class="map_video_play_dialog"
    :close-on-click-modal="true"
    :append-to-body="true"
    width="1000px"
    @close="videoPlayDialogClose"
    :show-close="true">
    <div class="relay_video">
      <div v-if="playerData" is="flvplayer" :oData="playerData" @playerClose="playerClose"
        :oConfig="{fit: false, sign: false, pause: false, close: true, tape: false, download: false}">
      </div>
    </div>
    <!-- <i class="relay_video_close el-icon-circle-close" @click="videoPlayDialog = false"></i> -->
  </el-dialog>
</template>
<script>
import flvplayer from '@/components/common/flvplayer.vue';
/*
* emit事件
* videoPlayDialogClose 窗口关闭
*/
export default {
  components: {flvplayer},
  /* 
  * oData:
  *   name 视频名称 必须
  *   url 视频地址  必须
  *   其它可自定义
  */
  props: ['oData'],
  data () {
    return {
      playerData: null,
      videoPlayDialog: false
    }
  },
  watch: {
    oData (val) {
      console.log('mapVideoPlay oData', val);
      if (val) {
        this.videoPlayDialog = true;
        this.$nextTick(() => {
          this.playerData = {
            type: 3,
            title: val.name,
            record: false,
            video: {
              uid: new Date().getTime(),
              downUrl: val.url
            }
          }
        });
      }
    }
  },
  methods: {
    // 关闭图片放大弹出框
    videoPlayDialogClose () {
      this.$emit("videoPlayDialogClose", Object.assign({}, this.oData));
      this.playerData = null;
    },
    playerClose () {
      this.videoPlayDialog = false;
    }
  }
}
</script>
<style lang="scss">
.map_video_play_dialog {
  .el-dialog {
    margin-left: -500px !important; margin-top: -300px !important;
    /* 祖先元素设置了transform属性则会导致固定定位属性position: fixed失效。 */
    transform: none !important;
  }
  .el-dialog__header { display: none; }
  .el-dialog__body { padding: 0; }
  .el-dialog__footer { display: none; }
  .relay_video {
    width: 1000px; height: 600px;
  }
  .relay_video_close {
    position: absolute; top: 10px; right: 10px; z-index: 400;
    color: #fff; font-size: 24px;
    cursor: pointer;
  }
}
</style>


