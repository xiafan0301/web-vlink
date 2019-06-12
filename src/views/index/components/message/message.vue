<template>
  <div class="vl_message clearfix">
    <ul class="vl_smenu">
      <li>
        <router-link :to="{name: 'message_help'}">民众互助</router-link>
      </li>
      <li>
        <router-link :to="{name: 'message_notice'}">公告管理</router-link>
      </li>
      <!-- <li>
        <router-link :to="{name: 'message_note'}">短信通知</router-link>
      </li> -->
      <li>
        <router-link :to="{name: 'message_system'}">系统消息</router-link>
      </li>
    </ul>
    <div class="mes_content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="scss">
.vl_message {
  position: relative;
  height: 100%;
  > .mes_content {
    height: 100%;
    overflow: auto;
    padding-left: 200px;
    // 消息模块底部按钮公共样式
    .add_footer{
      width: 100%;
      height: 64px;
      line-height: 64px;
      position: absolute;
      left: 0;
      bottom: -104px;
      padding-left: 20px;
      background:rgba(255,255,255,1);
      box-shadow:0px -1px 2px 0px rgba(0,0,0,0.03);
      filter:blur(0px);
      > .el-button{
        width: 100px;
      }
    }
    // 消息模块面包屑样式
    .mes_back > .el-breadcrumb__inner{
      color: #999;
      &:hover{
        color: #409EFF;
        cursor: pointer;
      }
    }
    // 重置按钮样式
    .select_btn, .reset_btn {
      width: 80px;
    }
    .btn_90{
      width: 90px!important;
    }
    .btn_100{
      width: 100px!important;
    }
    .btn_140{
      width: 140px!important;
    }
    .select_btn {
      background-color: #0C70F8;
      color: #ffffff;
    }
    .reset_btn {
      background-color: #ffffff;
      color: #666666;
      border-color: #DDDDDD;
    }
    // 重置日期选择框样式
    .el-range__icon.el-icon-date{
      display: none;
    }
    .el-date-editor, .el-select{
      width: 100%;
    }
  }
}
</style>