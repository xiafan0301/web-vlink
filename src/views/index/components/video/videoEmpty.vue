<template>
  <div class="vi_list_empty">
    <div class="com_trans50_lt">
      <img src="../../../../assets/img/video/vi_101.png" alt="">
      <p>{{msg}}</p>
      <div>
        <el-button v-if="btn" size="small" @click="btnEvent(1)">{{btnText ? btnText : '添加视频'}}</el-button>
        <el-button v-if="btn2" size="small" @click="btnEvent(2)">{{btnText2 ? btnText2 : '视频回放'}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['tipMsg', 'btn', 'btnText', 'btn2', 'btnText2'],
  data () {
    return {
      msg: '拖拽设备列表图标至此'
    }
  },
  /* watch: {
    tipMsg () {
      this.msg = this.tipMsg;
    }
  }, */
  created () {
    if (this.tipMsg) {
      this.msg = this.tipMsg;
    }
  },
  methods: {
    btnEvent (p1) {
      this.$emit('btnEvent', p1);
    }
  }
}
</script>
<style lang="scss" scoped>
.vi_list_empty {
  position: relative;
  width: 100%; height: 100%;
  > div {
    position: absolute; top: 50%; left: 50%;
    max-width: 80%;
    > img { width: 100%; }
    > p { text-align: center; color: #999; font-size: 12px; }
    > div { padding-top: 10px; text-align: center; }
  }
}
</style>
