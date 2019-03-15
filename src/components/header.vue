<template>
  <header class="vl_header clearfix">
    <div class="hd_log vl_icon vl_icon_logo">
    </div>
    <div class="hd_user">
      <img src="../assets/img/temp/vl_photo.png" alt="">
      <el-popover
        placement="bottom"
        trigger="click">
        <ul class="hd_user_pl">
          <li class="user_pl_dis">个人设置</li>
          <li class="user_pl_dis">修改密码</li>
          <li @click="loginOut">退出登录</li>
        </ul>
        <span slot="reference">管理员&nbsp;<i class="el-icon-arrow-down"></i></span>
      </el-popover>
      <ul>
        <li>
          <el-badge :value="sums.msg" class="item" :max="99">
            <i class="vl_icon vl_icon_011"></i>
          </el-badge>
        </li>
        <li>
          <!-- <template v-if="sums.events > 0">
            <el-badge :value="sums.events" class="item" :max="99">
              <img class="aa" src="../assets/img/vl-jq1.gif" alt="">l
            </el-badge>
          </template>
          <template v-else>
            <img src="../assets/img/vl-jq2.png" alt="">
          </template> -->
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
  </header>
</template>
<script>
export default {
  data () {
    return {
      sums: {
        msg: 109,
        events: 212
      }
    }
  },
  methods: {
    loginOut () {
      let _this = this;
      _this.$msgbox({
        title: '退出提示',
        message: '确定退出登录吗？',
        showCancelButton: true,
        confirmButtonText: '  确定  ',
        cancelButtonText: '  取消  ',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '正在退出...';
            // ajax
            setTimeout(() => {
              _this.$router.push({name: 'login'});
              instance.confirmButtonLoading = false;
              done();
            }, 2000);
          } else {
            done();
          }
        }
      }).then(() => {
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.vl_header {
  position: absolute; top: 0; left: 0; z-index: 100;
  width: 100%; height: 100px; min-width: 1200px;
  background-color: #0C70F8;
  background: -webkit-linear-gradient(to bottom, #0C70F8, #0466DE);
  background: -moz-linear-gradient(to bottom, #0C70F8, #0466DE);
  background: linear-gradient(to bottom, #0C70F8, #0466DE);
  animation: fadeInDown .4s ease-out .2s both;
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
      height: 20px; line-height: 20px; max-width: 150px;
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
</style>
