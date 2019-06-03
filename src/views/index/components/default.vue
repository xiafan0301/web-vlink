<template>
  <div class="vl_main">
    <div is="vlinkHeader"></div>
    <div class="vl_content">
      <router-view></router-view>
    </div>
    <!-- 登录提示dialog -->
    <!-- <el-dialog
      title="登录提示"
      :visible.sync="loginDialogVisible"
      :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
      :append-to-body="true"
      width="400px">
      <p style="padding: 20px 0 10px 0;">登录已过期，请重新登录！</p>
      <p style="padding: 10px 0 0 0;">系统将在&nbsp;<span style="color: red; font-size: 16px;">{{time}}</span>&nbsp;秒后自动进入登录页面。</p>
      <div style="padding: 30px 0 10px 0; text-align: center;">
        <el-button style="width: 80%;" type="primary" @click="reLogin">重&nbsp;新&nbsp;登&nbsp;录</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>
<script>
import vlinkHeader from '../../../components/header.vue';
export default {
  components: {vlinkHeader},
  data () {
    return {
      /* loginDialogVisible: false,
      time: 10,
      intval: null */
    }
  },
  computed: {
    unLogin () {
      return this.$store.state.loginToken;
    }
  },
  watch: {
    unLogin () {
      console.log('relogin: ', this.$store.state.loginToken);
      this.reLogin();
      /* this.loginDialogVisible = true;
      if (this.intval) {
        window.clearInterval(this.intval);
      }
      this.intval = window.setInterval(() => {
        this.time -= 1;
        if (this.time <= 0) {
          this.reLogin();
          window.clearInterval(this.intval);
        }
      }, 1000); */
    }
  },
  methods: {
    reLogin () {
      if (this.intval) {
        window.clearInterval(this.intval);
      }
      localStorage.setItem('as_vlink_user_info', '');
      this.$router.push({name: 'login'});
    }
  }
}
</script>
<style lang="scss" scoped>
.vl_main {
  height: 100%;
  > .vl_content {
    padding-top: 100px;
    height: 100%;
    background-color: #fafafa;
  }
}
</style>
