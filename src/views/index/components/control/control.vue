<template>
  <div class="vl_control clearfix">
    <ul class="vl_smenu">
      <li>
        <router-link :to="{name: 'control_map'}">布控分布</router-link>
      </li>
      <li>
        <router-link :to="{name: 'control_manage'}">布控管理</router-link>
      </li>
      <!-- 1.0v -->
      <!-- <li>
        <router-link :to="{name: 'control_create'}">新建布控</router-link>
      </li> -->
      <!-- 1.1v -->
      <li>
        <router-link :to="{name: 'control_add'}">新建布控</router-link>
      </li>
    </ul>
    <div class="con_content" id="conContent">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { setTimeout } from 'timers';
export default {
  data () {
    return {
    }
  },
  mounted () {
    setTimeout(() => {
      document.getElementById('conContent').scrollTop = 1000;
    } ,500)
  },
  methods: {
  }
}
</script>
<style lang="scss">
.vl_control {
  position: relative;
  height: 100%;
  > .con_content {
    height: 100%;
    padding-left: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    // 布控模块面包屑样式
    .con_back > .el-breadcrumb__inner{
      color: #999;
      &:hover{
        color: #409EFF;
        cursor: pointer;
      }
    }
    // 布控详情视频公共样式
    .vl_j_fullscreen {
      position: fixed;
      width: 100%!important;
      height: 100%!important;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: #000000;
      z-index: 9999;
      -webkit-transition: all .4s;
      -moz-transition: all .4s;
      -ms-transition: all .4s;
      -o-transition: all .4s;
      transition: all .4s;
      > video {
        width: 100%;
        height: 100%;
      }
      > .control_bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 48px;
        background: rgba(0, 0, 0, .65);
        > div {
          float: left;
          width: 50%;
          height: 100%;
          line-height: 48px;
          text-align: right;
          padding-right: 20px;
          color: #FFFFFF;
          &:first-child {
            text-align: left;
            padding-left: 20px;
          }
          > span {
            display: inline-block;
            height: 22px;
            margin-left: 10px;
            vertical-align: middle;
            cursor: pointer;
            a {
              font-size: 25px;
              text-decoration: none;
              color: #ffffff;
              vertical-align: top;
            }
          }
        }
      }
    }
    .vl_j_cutscreen {
      position: fixed;
      width: 90%!important;
      height: 90%!important;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: #FFFFFF;
      z-index: 9999;
      -webkit-transition: all .4s;
      -moz-transition: all .4s;
      -ms-transition: all .4s;
      -o-transition: all .4s;
      transition: all .4s;
      padding: 20px;
      margin: auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .close_btn {
      position: absolute;
      top: 30px;
      right: 30px;
      font-size: .3rem;
      cursor: pointer;
      &:hover {
        color: #409EFF;
      }
    }
    // 重置下拉多选列表的样式
    .el-select{
      .el-tag{
        background:rgba(242,242,242,1);
        border-radius:2px;
        border:1px solid rgba(217,217,217,1);
      }
      .el-tag__close.el-icon-close{
        margin-bottom: 2px; 
        background:rgba(242,242,242,1);
        font-size: 16px;
        color: #B2B2B2;
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
    // 重置marker hover 时弹出窗样式
    .vl_map_hover_main > ul > li > span{
      text-align: left;
      &:nth-child(1){
        width: 70px;
      }
      &:nth-child(2){
        width: 100px;
      }
    }
  }
  .vl_map_hover_main{
    bottom: 58px;
  }
}
</style>