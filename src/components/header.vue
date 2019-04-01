<template>
  <div class="vl_header">
    <div class="hd_log vl_icon vl_icon_logo">
    </div>
    <div class="hd_user">
      <img src="../assets/img/temp/vl_photo.png" alt="">
      <el-popover
        placement="bottom"
        trigger="click">
        <ul class="hd_user_pl">
          <li class="user_pl_dis">个人设置</li>
          <li @click="showUpdatePwdDialog">修改密码</li>
          <li @click="showLoginOutDialog">退出登录</li>
        </ul>
        <span slot="reference">{{ userInfo && userInfo.userRealName}}&nbsp;<i class="el-icon-arrow-down"></i></span>
      </el-popover>
      <ul>
        <li>
          <el-badge :value="sums.msg" class="item" :max="99">
            <i class="vl_icon vl_icon_011"></i>
          </el-badge>
        </li>
        <li>
          <el-badge :value="sums.events" class="item" :max="99">
            <i class="vl_icon vl_icon_012" :class="{'hd_user_is': sums.events > 0}"></i>
          </el-badge>
        </li>
      </ul>
    </div>
    <ul class="hd_menu">
      <li>
        <router-link :to="{name: 'video'}">
          <i class="vl_icon vl_icon_001"></i>
          <span>视频</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'map'}">
          <i class="vl_icon vl_icon_002"></i>
          <span>地图</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'event'}">
          <i class="vl_icon vl_icon_003"></i>
          <span>事件</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'judge'}">
          <i class="vl_icon vl_icon_004"></i>
          <span>研判</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'search'}">
          <i class="vl_icon vl_icon_005"></i>
          <span>检索</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'control'}">
          <i class="vl_icon vl_icon_006"></i>
          <span>布控</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'message'}">
          <i class="vl_icon vl_icon_007"></i>
          <span>消息</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'manage'}">
          <i class="vl_icon vl_icon_008"></i>
          <span>管理</span>
        </router-link>
      </li>
    </ul>
    <!--退出登录弹出框-->
    <el-dialog
      title="退出登录"
      :visible.sync="loginoutDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">您确定退出登录吗?</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="loginoutDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="loginOut">确认</el-button>
      </div>
    </el-dialog>
    <!--修改密码弹出框-->
    <el-dialog
      title="修改密码"
      :visible.sync="updatePwdDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div class="content_body">
        <p>如果忘记旧密码，请在登录页使用“忘记密码”功能重设密码。</p>
        <el-form :model="updateForm" ref="updateForm" :rules="rules" label-width="20px">
          <el-form-item label=" " prop="oldPwd">
            <el-input type="password" placeholder="请输入旧密码" v-model="updateForm.oldPwd"></el-input>
          </el-form-item>
          <el-form-item label=" " prop="newPwd">
            <el-input type="password" placeholder="请设置新密码" v-model="updateForm.newPwd"></el-input>
          </el-form-item>
          <el-form-item label=" " prop="sureNewPwd">
            <el-input type="password" placeholder="请确认密码" v-model="updateForm.sureNewPwd"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdate('updateForm')">取消</el-button>
        <el-button class="operation_btn function_btn" @click="updatePassword('updateForm')">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { logout, updatePwd } from '@/views/index/api/api.js';
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9]{6,16}$/;
      if (!reg.test(value)) {
        callback(new Error('密码为6-16个数字或英文字母组合'));
      } else {
        if (this.updateForm.sureNewPwd !== '') {
          this.$refs.updateForm.validateField('sureNewPwd');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
     if (value !== this.updateForm.newPwd) {
        callback(new Error('两次密码不一致'));
      } else {
        callback();
      }
    };
    return {
      sums: {
        msg: 109,
        events: 212
      },
      updateForm: {
        newPwd: null,
        sureNewPwd: null,
        oldPwd: null
      },
      rules: {
        oldPwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        sureNewPwd: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      userInfo: null,
      loginoutDialog: false, // 退出登录弹出框
      updatePwdDialog: false, // 修改密码弹出框
    }
  },
  mounted () {
    this.userInfo = this.$store.state.loginUser;
  },
  methods: {
    // 显示退出登录弹出框
    showLoginOutDialog () {
      this.loginoutDialog = true;
    },
    // 退出登录
    loginOut () {
      const params = {
        userMobile: this.userInfo.userMobile
      }
      logout(params)
        .then(res => {
          if (res) {
            this.loginoutDialog = false;
            this.$router.push({name: 'login'});
          } else {
            this.$message({
              type: 'error',
              message: '退出登录失败',
              customClass: 'request_tip'
            })
          }
        })
    },
    // 显示修改密码弹出框
    showUpdatePwdDialog () {
      this.updatePwdDialog = true;
    },
    // 取消修改密码
    cancelUpdate (form) {
      this.$refs[form].resetFields();
      this.updatePwdDialog = false;
    },
    // 修改密码
    updatePassword (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          const params = {
            newPwd: this.updateForm.newPwd,
            oldPwd: this.updateForm.oldPwd
          };
          updatePwd(params)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '修改密码成功',
                  customClass: 'request_tip'
                })
                this.updatePwdDialog = false;
                this.$router.push({name: 'login'});
              }
            })
            .catch(() => {})
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.vl_header {
  position: absolute; top: 0; left: 0;
  // z-index: 100;
  width: 100%;
  height: 100px;
  min-width: 1200px;
  background-color: #0C70F8;
  background: -webkit-linear-gradient(to bottom, #0C70F8, #0466DE);
  background: -moz-linear-gradient(to bottom, #0C70F8, #0466DE);
  background: linear-gradient(to bottom, #0C70F8, #0466DE);
  // animation: fadeInDown .4s ease-out .2s both;
  > .hd_log {
    display: block;
    float: left;
    width: 170px; height:  48px;
    margin: 26px 20px 0 20px;
  }
  > .hd_menu {
    overflow: hidden;
    padding-top: 10px;
    height: 100%;
    margin: 0 320px 0 210px;
    > li {
      float: left;
      height: 100%;
      width: 12.5%; max-width: 110px;
      > a {
        display: block;
        width: 100%; height: 90px;
        font-size: 16px; color: #fff;
        border-radius: 8px 8px 0 0;
        text-decoration: none !important;
        text-align: center;
        transition: all .4s ease-out;
        overflow: hidden;
        > i {
          display: block;
          margin: 15px auto 0 auto;
        }
        > span {
          display: block;
          padding-top: 4px;
        }
        &:hover {
          background-color: #1979fc;
        }
        &.router-link-active {
          background-color: #2682FF;
          cursor: default;
        }
      }
    }
  }
  > .hd_user {
    float: right;
    padding-right: 20px;
    height: 100%;
    > img {
      float: right;
      width: 50px; height: 50%;
      border-radius: 50%;
      margin-top: 25px;
    }
    > span {
      display: block;
      float: right;
      height: 20px; line-height: 20px;
      cursor: pointer;
      font-size: 16px; color: #fff;
      margin-top: 45px; padding: 0 10px 0 20px;
      border-left: 1px solid #ddd;
    }
    > ul {
      float: right;
      height: 100%;
      > li {
        float: left;
        padding: 30px 20px 0 0;
        cursor: pointer;
      }
    }
  }
}
.hd_user_pl {
  > li {
    height: 30px; line-height: 30px;
    text-align: center;
    cursor: pointer;
    color: #666;
    &:hover {
      background-color: #f6f6f6;
    }
    &.user_pl_dis {
      background-color: #fff;
      cursor: not-allowed;
      color: #999;
    }
  }
}
.hd_user_is {
  animation: twinkle 0.6s linear infinite both;
}
.dialog_comp {
  .content_body {
    >p {
      color: #F94539;
      margin-bottom: 20px;
    }
  }
}
</style>
