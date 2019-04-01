<template>
  <div class="vi_list_empty">
    <div class="com_trans50_lt">
      <img src="../../../../assets/img/video/vi_101.png" alt="">
      <p>{{msg}}</p>
      <div v-if="btn">
        <el-button size="small" @click="addVideoEvent">{{btnText ? btnText : '添加视频'}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['tipMsg', 'btn', 'btnText'],
  data () {
    return {
      msg: '点击或拖拽设备列表图标至此'
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
    addVideoEvent () {
      this.$emit('showListEvent');
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
