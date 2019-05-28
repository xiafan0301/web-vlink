<template>
  <div class="wrt_main">
    <h1 style="text-align: center;font-size: 40px;color: #0C70F8;">我是web端</h1>
    <ul style="padding: 100px 0 0 400px;">
      <li>
        <el-input style="width: 250px;" v-model="form.val1" placeholder="请输入对方ID"></el-input>
        <el-button style="margin-left: 20px;" @click="add">请求</el-button>
      </li>
      <li style="margin-top: 20px;">
        <el-input style="width: 250px;" v-model="form.val2" placeholder="请输入对方ID"></el-input>
        <el-button style="margin-left: 20px;" @click="del">断开</el-button>
      </li>
      <li>
        <div style="width: 400px; height: 300px;">
          <video id="localVideo" style="width: 100%; height: 100%; object-fit: fill;" autoplay></video>
        </div>
      </li>
    </ul>
    <div is="webrtc" @wrStateEmit="wrStateEmit" :oAdd="oAdd" :oDel="oDel"></div>
  </div>
</template>
<script>
import webrtc from '@/components/common/webrtc.vue';
export default {
  components: {webrtc},
  data () {
    return {
      oAdd: {},
      oDel: {},
      form: {
        val1: '',
        val2: ''
      },
      aData: [{}, {}, {}]
    }
  },
  mounted () {
  },
  methods: {
    add () {
      this.oAdd = {
        type: 1,
        remoteId: this.form.val1,
        remoteName: this.form.val1
      };
    },
    del () {
      this.oDel = {
        type: 1,
        remoteId: this.form.val2,
        remoteName: this.form.val2
      };
    },

    wrStateEmit (oData) {
      console.log('状态EMIT oData: ', oData);
    }
  }
}
</script>
<style lang="scss" scoped>
.wrt_main {
  position: relative;
  width: 100%; height: 100%;
}
</style>
