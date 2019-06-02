<template>
  <div class="vl_pwd">
    <div is="headerNormal"></div>
    <div class="pwd_main">
      <div class="pwd_t">
        <div class="pwd_ts_1" :class="{'pwd_ts_sed': step === 1}"><i>1</i>确认账号</div>
        <div class="pwd_ts_2" :class="{'pwd_ts_sed': step === 2}"><i>2</i>安全验证</div>
        <div class="pwd_ts_3" :class="{'pwd_ts_sed': step === 3}"><i>3</i>重置密码</div>
        <p class="pwd_tl_1"></p>
        <p class="pwd_tl_2"></p>
      </div>
      <ul class="pwd_ul">
        <!-- 确认账号 -->
        <li v-show="step === 1">
          <div>
            <h2>找回密码</h2>
            <el-form :model="pwdForm1" status-icon :rules="pwdForm1Rules" ref="pwdForm1">
                <el-form-item prop="mobile">
                  <el-input type="text" v-model="pwdForm1.mobile" autocomplete="off" placeholder="输入手机号"></el-input>
                </el-form-item>
                <el-form-item>
                  <div id="drag">
                    <div class="drag_bg"></div>
                    <div class="drag_text">{{dragText}}</div>
                    <div class="handler" :class="[confirmSuccess ? 'handler_ok_bg' : 'handler_bg']" @mousedown="mousedownFn($event, 'pwdForm1')">
                      <i :class="[confirmSuccess ? 'el-icon-circle-check' : 'el-icon-d-arrow-right']"></i>
                    </div>
                  </div>
                </el-form-item>
            </el-form>
          </div>
        </li>
        <!-- 安全验证 -->
        <li v-show="step === 2">
          <div>
            <h2>找回密码</h2>
            <p>为了您的账号安全，请完成身份认证</p>
            <p class="pwd_mobile_p">手机号：<span>{{pwdForm1.mobile | mobileSecurity}}</span></p>
            <el-form :model="pwdForm2" status-icon :rules="pwdForm2Rules" ref="pwdForm2" class="pwdForm_two">
              <el-form-item prop="code" class="code_name">
                <el-input style="width: 200px;" type="text" v-model="pwdForm2.code" autocomplete="off" :maxlength="16" placeholder="请输入验证码"></el-input>
                <el-button @click="getRegCode('pwdForm2')" :disabled="regCodeDis" class="pwd_code_btn">{{regCodeTip}}</el-button>
                <p class="error_tip" v-show="isShowError">验证码错误，请重新输入</p>
              </el-form-item>
              <el-form-item>
                <el-button :class="[!pwdForm2.code ? 'disabled_btn' : 'nextTwobtn']" :disabled="!pwdForm2.code" :loading="pwdForm2Loading" @click="nextStep2('pwdForm2')">下一步</el-button>
              </el-form-item>
            </el-form>
          </div>
        </li>
        <!-- 重置密码 -->
        <li v-show="step === 3">
          <div>
            <h2>重置密码</h2>
            <el-form :model="pwdForm3" status-icon :rules="pwdForm3Rules" ref="pwdForm3">
              <el-form-item prop="pass">
                <el-input type="password" v-model="pwdForm3.pass" autocomplete="off" placeholder="请输入新密码"></el-input>
              </el-form-item>
              <el-form-item prop="checkPass">
                <el-input type="password" v-model="pwdForm3.checkPass" autocomplete="off" placeholder="请确认新密码"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button :class="[!pwdForm3.pass || !pwdForm3.checkPass ? 'disabled_btn' : 'nextTwobtn']" :disabled="!pwdForm3.pass || !pwdForm3.checkPass" :loading="pwdForm3Loading" @click="nextStep3('pwdForm3')">完成</el-button>
              </el-form-item>
            </el-form>
          </div>
        </li>
      </ul>
    </div>
    <!--提交弹出框-->
    <el-dialog
      :visible.sync="dialogVisible"
      :show-close="false"
      class="dialog_comp"
      width="482px"
      >
      <div class="content-body">
        <i class="el-icon-success"></i>
        <p class="submit-status">密码重置成功</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$router.push({name: 'login'})">重新登录</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import headerNormal from '@/components/headerNormal.vue';
import {validatePhone} from '@/utils/validator.js';
import { isRegister, getCode, checkCode, resetPassword } from '@/views/index/api/api.user.js';
export default {
  components: {headerNormal},
  data () {
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入新密码'));
      } else {
        let reg = /^[a-zA-Z0-9]{6,16}$/;
        if (!reg.test(value)) {
          callback(new Error('密码为6-16个数字或英文字母组合'));
        } else {
          if (this.pwdForm3.checkPass !== '') {
            this.$refs.pwdForm3.validateField('checkPass');
          }
          callback();
        }
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.pwdForm3.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      isShowError: false,
      step: 1,
      pwdForm1: {
        mobile: ''
      },
      pwdForm1Rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ]
      },
      pwdForm1Loading: false,
      regCodeDis: false,
      regCodeTip: '获取验证码',
      regCodeTime: 60,
      regCodeVal: null,
      pwdForm2: {
        code: ''
      },
      pwdForm2Rules: {
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      pwdForm2Loading: false,
      pwdForm3: {
        pass: '',
        checkPass: ''
      },
      pwdForm3Rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      pwdForm3Loading: false,
      mouseMoveStata: false, // 触发滑块拖动状态判断
      beginClientX: 0, // 距离屏幕最左端距离
      maxWidth: 320, // 拖动的最大宽度
      confirmSuccess: false, // 滑块验证结果
      dragText: '向右滑动验证',
      dialogVisible: false, // 重置密码成功弹出框
    }
  },
  mounted () {
    let _this = this;
    $('.handler').on('mousemove', (e) => {
      if (_this.mouseMoveStata) {
        let width = e.clientX - _this.beginClientX;
        if (width > 0 && width <= _this.maxWidth) {
          $('.handler').css('left', width);
          $('.drag_bg').css('width', width);
        } else if ( width > _this.maxWidth ) {
          _this.successDrag();
        }
      }
    });
    $('.handler').on('mouseup', (e) => {
      _this.mouseMoveStata = false;
      let width = e.clientX - _this.beginClientX;
      if (width < _this.maxWidth) {
        $('.handler').css('left', 0);
        $('.drag_bg').css('width', 0);
      }
    })
  },
  methods: {
    // 拖动滑块按下时
    mousedownFn (e, form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.mouseMoveStata = true;
          this.beginClientX = e.clientX;
          this.dragText = '';
        }
      })
    },
    // 拖动滑块验证成功
    successDrag () {
      const params = {
        userMobile: this.pwdForm1.mobile
      };
      isRegister(params)
        .then(res => {
          if (!res.data) {
            this.confirmSuccess = false;
            $('.handler').removeClass('handler_ok_bg').addClass('handler_bg');
            this.dragText = '该手机账户不存在';
            $('.drag_text').css('color', "#fff");
            setTimeout(() => {
              $('.handler').css('left', 0);
              $('.drag_bg').css('width', 0);
              this.dragText = '向右滑动验证';
              $('.drag_text').css('color', "#666666");
            }, 1000)
          } else {
            $('.handler').removeClass('handler_bg').addClass('handler_ok_bg');
            this.confirmSuccess = true;
            this.dragText = '验证成功';
            $('.drag_text').css('color', "#fff");
            this.step = 2;
          }
        })
        .catch(() => {})
    },
    nextStep2 (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.pwdForm2Loading = true;
          const params = {
            userMobile: this.pwdForm1.mobile,
            validateCode: this.pwdForm2.code,
            msgType: 2 // 1--注册账号  2---找回密码
          }
          checkCode(params)
            .then(res => {
              if (res.data) {
                this.pwdForm2Loading = false;
                this.step = 3;
              } else {
                this.isShowError = true;
                this.pwdForm2Loading = false;
              }
            })
            .catch(() => {})
        } else {
          return false;
        }
      });
    },
    getRegCode () {
      this.regCodeDis = true;
      const params = {
        msgType: 2,
        userMobile: this.pwdForm1.mobile
      };
      getCode(params)
        .then(res => {
          this.$message({
            message: '验证码已发送，请注意查收',
            type: 'success',
            customClass: 'request_tip'
          });
          if (res) {
            this.regCodeTip = this.regCodeTime + 's';
            this.regCodeVal = setInterval(() => {
              if (this.regCodeTime > 0) {
                this.regCodeTime -= 1;
                this.regCodeTip = this.regCodeTime + 's';
              } else {
                if (this.regCodeVal) {
                  window.clearInterval(this.regCodeVal);
                }
                this.regCodeDis = false;
                this.regCodeTip = '获取验证码';
                this.regCodeTime = 60;
              }
            }, 1000);
          }
        })
        .catch(() => {})
    },

    nextStep3 (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.pwdForm3Loading = true;
          const params = {
            code: this.pwdForm2.code,
            userMobile: this.pwdForm1.mobile,
            newPassword: this.pwdForm3.pass
          };
          resetPassword(params)
            .then(res => {
              if (res) {
                this.pwdForm3Loading = false;
                this.dialogVisible = true;
              } else {
                this.pwdForm3Loading = false;
                this.$message({
                  message: '重置密码失败',
                  type: 'error',
                  customClass: 'request_tip'
                });
              }
            })
            .catch(() => {})
        } else {
          return false;
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.vl_pwd {
  position: relative;
  height: 100%;
  > .pwd_main {
    position: absolute; top: 200px; left: 50%;
    width: 800px; height: 400px;
    margin-left: -400px;
    > .pwd_t {
      height: 50px;
      position: relative;
      > div {
        position: absolute; top: 0; z-index: 2;
        width: 120px; height: 50px; line-height: 50px;
        padding-left: 40px;
        color: #999; font-size: 16px;
        transition: .4s ease-out;
        > i {
          position: absolute; top: 9px; left: 0;
          display: inline-block;
          width: 32px; height: 32px; line-height: 32px;
          border: 1px solid #999;
          border-radius: 50%;
          text-align: center;
          font-style: normal; font-size: 16px; color: #999;
          transition: .4s ease-out;
        }
        &.pwd_ts_1 {
          left: 0;
        }
        &.pwd_ts_2 {
          left: 50%;
          margin-left: -60px;
        }
        &.pwd_ts_3 {
          right: 0;
        }
        &.pwd_ts_sed {
          > i {
            border: 0;
            background-color: #0C70F8;
            color: #fff;
            font-weight: normal;
          }
          font-weight: bold;
          color: #333;
        }
      }
      > p {
        position: absolute; top: 25px; z-index: 1;
        height: 1px;
        overflow: hidden;
        background-color: #999;
        &.pwd_tl_1 {
          left: 120px;
          width: 200px;
        }
        &.pwd_tl_2 {
          right: 135px;
          width: 205px;
        }
      }
    }
    > .pwd_ul {
      padding: 30px;
      > li {
        > div {
          width: 360px;
          margin: 0 auto;
          .pwdForm_two {
            .code_name {
              position: relative;
              .error_tip {
                position: absolute;
                height: 10px;
                line-height: 10px;
                color: #f56c6c;
                font-size: 12px;
                line-height: 1;
                padding-top: 4px;
              }
            }
          }
          > h2 {
            font-size: 20px;
            color: #333;
            font-weight: bold;
            padding-bottom: 15px;
          }
          > p {
            font-size: 16px; color: #333;
            padding: 10px 0;
            &.pwd_mobile_p {
              color: #666;
              padding: 10px 0 20px 0;
            }
            > span {
              color: #333;
            }
          }
          #drag {
            width: 100%;
            position: relative;
            height: 40px;
            line-height: 40px;
            text-align: center;
            background-color: #F2F2F2;
            color: #666666;
            .drag_text{
              position: absolute;
              top: 0px;
              width: 100%;
              -moz-user-select: none;
              -webkit-user-select: none;
              user-select: none;
              -o-user-select:none;
              -ms-user-select:none; 
            }
            .drag_bg {
              background-color: #4FCB61;
              height: 40px;
              width: 0px;
              color: #ffffff;
            }
            .handler {
              position: absolute;
              top: 0px;
              left: 0px;
              width: 40px;
              height: 39px;
              background-color: #ffffff;
              border: 1px solid #F2F2F2;
              cursor: move;
              .el-icon-circle-check {
                color: #4FCB61;
              }
            }
          }
          .nextTwobtn {
            background-color: #0C70F8;
            color: #ffffff;
          }
          .disabled_btn {
            background-color: #F2F2F2;
            color: #B2B2B2;
          }
        }
      }
    }
  }
}
.pwd_code_btn {
  font-size: 16px;
  height: 40px;
  position: absolute; top: 0; right: 0;
  width: 120px;
  &:hover {
    color: #0C70F8;
    border-color: #0C70F8;
  }
}
.dialog_comp {
  .content-body {
    width: 50%;
    text-align: center;
    margin-left: 25%;
    i {
      font-size: 100px;
      color: #4FCB61;
    }
    .submit-status {
      color: #333333;
      font-size: 16px;
      margin: 20px 0;
    }
    .submit-tip {
      color: #999999;
    }
  }
}
</style>