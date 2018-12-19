<template>
  <div class="vl_login">
    <div class="lg_main">
        <div class="lg_fm">
          <div class="lg_logo">Logo</div>
          <el-form :inline="false" ref="loginForm" :model="loginForm" :rules="loginFormRules" class="lg_form">
            <el-form-item prop="userMobile" class="login-form-item">
              <el-input v-model="loginForm.userMobile" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item prop="userPassword" class="login-form-item">
              <el-input v-model="loginForm.userPassword" placeholder="请输密码"></el-input>
            </el-form-item>
          </el-form>
          <div class="lg_info">
            <a>忘记密码</a>
              <span>没有账号？<a>注册账号&gt;</a></span>
          </div>
          <div class="lg_btn">
            <el-button @click="loginSubmit('loginForm')" :loading="loginBtnLoading" :disabled="!loginForm.userMobile || !loginForm.userPassword" style="width: 100%;" type="primary">登&nbsp;&nbsp;录</el-button>
          </div>
        </div>
        <div class="lg_vc" @click="downloadHandler = !downloadHandler">
          <span v-if="downloadHandler">关闭二维码</span>
          <span v-else>下载APP</span>
          <div v-show="downloadHandler">
            <div id="download_qrcode" ref="download_qrcode"></div>
          </div>
        </div>
    </div>
    <footer>
      <P>技术支持：湖南奥昇信息技术有限责任公司</P>
      <p>copyright &copy; 2018 - 2019 aorise.com ALL Rights Reserved</p>
    </footer>
  </div>
</template>
<script>
// import VueQArt from 'vue-qart';
import QRCode from 'qrcodejs2';
import {validatePhone, validatePwd} from '@/utils/validator.js';
export default {
  components: {QRCode},
  data () {
    return {
      downloadHandler: false,
      dlQRcode: null,
      loginForm: {
        userMobile: '',
        userPassword: ''
      },
      loginBtnLoading: false,
      isRemember: false, // 是否记住用户名
      loginFormRules: {
        userMobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        userPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePwd, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.downloadQRcode();
  },
  methods: {
    loginSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 登陆中 登录按钮不可用
          this.loginBtnLoading = true;
          // todo
          setTimeout(() => {
            this.loginBtnLoading = false;
            this.$router.push({name: 'index'});
          }, 2000);
        } else {
          // 登陆中 登录按钮不可用
          this.loginBtnLoading = true;
          // todo
          setTimeout(() => {
            this.loginBtnLoading = false;
            this.$router.push({name: 'index'});
          }, 2000);
          // return false;
        }
      });
    },
    downloadQRcode () {
      let qrcode = new QRCode('download_qrcode', {  
        width: 200,  // 设置宽度 
        height: 200, // 设置高度
        text: 'https://baidu.com',
        colorDark: '#0C70F8', // 
        colorLight: '#ffffff' // 
        // correctLevel: '', // [L|M|Q|H]
      })  
      this.dlQRcode = qrcode;
    }
  }
}
</script>
<style lang="scss" scoped>
.vl_login {
  position: relative;
  height: 100%;
  min-height: 700px;
  background-color: #28A0FF;
  > .lg_main {
    position: absolute; top: 50%; left: 50%;
    width: 488px; height: 520px;
    margin-left: -244px; margin-top: -265px;
    > .lg_fm {
      height: 436px;
      padding: 0 50px;
      background-color: #fff;
      border-radius: 6px;
      box-shadow: 0 0 5px #ddd;
      animation: fadeIn .6s ease-out both;
      .lg_logo {
        height: 160px;
        padding: 30px 0;
      }
      .lg_form {
      }
      .lg_info {
        padding-bottom: 20px;
        overflow: hidden;
        a {
          color: #0C70F8;
          cursor: pointer;
          &:hover {
            text-decoration: none;
          }
        }
        span {
          float: right;
        }
      }
      .lg_btn {
        text-align: center;
      }
    }
    > .lg_vc {
      position: absolute; bottom: 0; left: 0;
      width: 100%; height: 60px; line-height: 60px;
      background-color: #fff;
      border-radius: 6px;
      color: #0088FA; font-size: 14px;
      text-align: center;
      cursor: pointer;
      box-shadow: 0 0 5px #ddd;
      animation: fadeInUp .4s ease-out both;
      > div {
        position: absolute; bottom: 84px;
        width: 100%;
        text-align: center;
        box-shadow: 0 0 5px #ddd;
        background-color: #fff;
        border-radius: 2px;
        animation: fadeIn .4s ease-out both;
        > div {
          width: 200px;
          margin: 0 auto; padding: 40px 0;
        }
        &::after {
          border-bottom-color: rgba(0, 0, 0, 1);
          content: "";
          display: inline-block;
          position: absolute;
          left: 50%;
          margin-left: -15px;
          bottom: -18px;
          border-top: 18px solid #fff;
          border-left: 18px solid transparent;
          border-right: 18px solid transparent;
        }
      }
      &:hover {
        > div {
          display: block;
        }
      }
    }
  }
  > footer {
    position: absolute; bottom: 20px; left: 0;
    width: 100%;
    color: #fff;
    text-align: center;
    animation: fadeIn .6s ease-out .4s both;
    > p {
      padding: 5px 0;
    }
  }
}
</style>
