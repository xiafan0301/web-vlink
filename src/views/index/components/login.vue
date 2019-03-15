<template>
  <div class="vl_login">
    <div class="vl_login_content">
      <div class="lg_main">
          <div class="lg_fm">
            <div class="lg_logo vl_icon vl_icon_lg_logo"></div>
            <el-form :inline="false" ref="loginForm" :model="loginForm" :rules="loginFormRules" class="lg_form">
              <el-form-item prop="userMobile" class="login_form_item">
                <el-input v-model="loginForm.userMobile" placeholder="请输入手机号"></el-input>
                <i class="vl_icon vl_icon_lg_01"></i>
              </el-form-item>
              <el-form-item prop="userPassword" class="login_form_item">
                <el-input v-model="loginForm.userPassword" :type="pwdShow ? 'text' : 'password'" placeholder="密码由6-16位字母、数字组成，区分大小写"></el-input>
                <i class="vl_icon vl_icon_lg_02"></i>
                <i class="vl_icon vl_icon_lg_03" @click="pwdShow = !pwdShow" :class="{'vl_icon_sed': !pwdShow}"></i>
              </el-form-item>
            </el-form>
            <div class="lg_info">
              <router-link :to="{name: 'findPwd'}">忘记密码</router-link>
                <!-- <span>没有账号？<router-link :to="{name: 'register'}">注册账号&gt;</router-link></span> -->
            </div>
            <div class="lg_btn">
              <el-button :class="[!loginForm.userMobile || !loginForm.userPassword ? 'disabled_btn' : 'default_btn']" @click="loginSubmit('loginForm')" :loading="loginBtnLoading" :disabled="!loginForm.userMobile || !loginForm.userPassword" >登&nbsp;&nbsp;录</el-button>
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
      <div is="vlFooter" class="lg_footer"></div>
    </div>
  </div>
</template>
<script>
// import VueQArt from 'vue-qart';
import QRCode from 'qrcodejs2';
import {validatePhone, validatePwd} from '@/utils/validator.js';
import vlFooter from '@/components/footer.vue';
import { login } from '@/views/index/api/api.js';
export default {
  components: {QRCode, vlFooter},
  data () {
    return {
      downloadHandler: false,
      dlQRcode: null,
      loginForm: {
        userMobile: '15675256052',
        userPassword: '123456'
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
      },
      pwdShow: false
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
          login(this.loginForm)
            .then(res => {
              if (res) {
                console.log(res)
                console.log(JSON.stringify(res.data))
                localStorage.setItem('userInfo', JSON.stringify(res.data));
                setTimeout(() => {
                  this.loginBtnLoading = false;
                  this.$router.push({name: 'index'});
                }, 1000);
              }
            })
          // todo
        } else {
          // 登陆中 登录按钮不可用
          this.loginBtnLoading = true;
          // todo
          setTimeout(() => {
            this.loginBtnLoading = false;
            this.$message({
              type: 'error',
              message: '登录失败',
              customClass: 'request_tip'
            })
            // this.$router.push({name: 'index'});
          }, 1000);
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
  height: 100%;
  background: -webkit-linear-gradient(to right bottom, #28A0FF, #017CFF);
  background: -moz-linear-gradient(to right bottom, #28A0FF, #017CFF);
  background: linear-gradient(to right bottom, #28A0FF, #017CFF);
  .vl_login_content {
    position: relative;
    height: 100%;
    min-height: 700px;
    background: url(../../../assets/img/login_bg.png) center bottom no-repeat;
    background-size: 100% auto;
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
          margin: 45px 0 35px 10px;
          animation: fadeIn .6s ease-out .2s both;
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
          .default_btn {
            width: 100%;
            background-color: #0C70F8;
            color: #fff;
            &:hover {
              opacity:0.85;
            }
          }
          .disabled_btn {
            width: 100%;
            background-color: #F2F2F2;
            color: #B2B2B2;
          }
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
        animation: fadeInUp .4s ease-out .2s both;
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
  }
}
.login_form_item {
  .el-form-item__content {
    position: relative;
    .vl_icon_lg_01 {
      position: absolute; top: 12px; left: 12px;
    }
    .vl_icon_lg_02 {
      position: absolute; top: 12px; left: 12px;
    }
    .vl_icon_lg_03 {
      position: absolute; top: 12px; right: 12px;
      cursor: pointer;
    }
  }
}
.lg_footer {
  position: absolute; bottom: 20px; left: 0;
  animation: fadeIn .6s ease-out .4s both;
}
</style>
