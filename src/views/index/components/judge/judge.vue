<template>
  <div class="vl_judge_main clearfix">
    <ul class="vl_smenu">
      <li>
        <router-link :to="{name: 'trajectory_collide'}">轨迹碰撞</router-link>
      </li>
      <li>
        <router-link :to="{name: 'investigation'}">事件侦查</router-link>
      </li>
      <li>
        <router-link :to="{name: 'focus_on'}">重点关注</router-link>
      </li>
      <li>
        <router-link :to="{name: 'high_area'}">高危区域</router-link>
      </li>
    </ul>
    <div class="judge_content">
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
<style lang="scss" scoped>
  .vl_judge_main {
    position: relative;
    height: 100%;
    > .judge_content {
      height: 100%;
      padding-left: 200px;
    }
  }
</style>
<style lang="scss">
  html {
    font-size: 100px;
  }
  @media screen and (min-width: 960px) and (max-width: 1119px) {html {font-size: 60px !important;}}
  @media screen and (min-width: 1200px) and (max-width: 1439px) {html {font-size: 70px !important;}}
  @media screen and (min-width: 1440px) and (max-width: 1679px) {html {font-size: 80px !important;}}
  @media screen and (min-width: 1680px) and (max-width: 1919px) {html {font-size: 90px !important;}}
  @media screen and (min-width: 1920px) {html {font-size: 100px !important;} }
  .vl_judge_tc {
    width: 100%;
    height: 100%;
    .vl_j_left {
      float: left;
      width: 2.32rem;
      padding-top: 24px;
      height: 100%;
      margin-left: 0.2rem;
      background: #ffffff;
      box-shadow:4px 0px 10px 0px #838383;
      box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
      animation: fadeInLeft .4s ease-out .3s both;
      .vl_jtc_img_box {
        width: 100%;
        height: auto;
        padding: 0 .2rem;
        border-bottom: 1px dashed #D3D3D3;
        padding-bottom: .44rem;
        .vl_jtc_upload_img {
          position: relative;
          .vl_jtc_upload {
            .el-upload--picture-card {
              width: 100%!important;
              padding-top: 100%!important;
              position: relative!important;
              > i {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
              }
              > img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                -webkit-border-radius: 6px;
                -moz-border-radius: 6px;
                border-radius: 6px;
              }
            }
          }
          > p {
            position: absolute;
            bottom: 7px;
            text-align: center;
            font-size: 0.14rem;
            width: 100%;
            &:hover {
              text-decoration: underline;
            }
          }
        }
        .vl_jtc_img_list {
          width: 100%;
          margin-top: 10px;
          text-align: center;
          .middle_img {
            display: inline-block;
          }
          > div {
            width: 30%;
            padding-top: 30%;
            border: 1px dashed #D3D3D3;
            position: relative;
            &:hover {
              .del_mask {
                display: block;
              }
            }
            &:last-child {
              float: right;
            }
            &:first-child {
              float: left;
            }
            .del_mask {
              display: none;
              position: absolute;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, .2);
              top: 0;
              > i {
                cursor: pointer;
                display: block;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                color: #ffffff;
                width: 16px;
                height: 16px;
                text-align: center;
              }
            }
            > img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .vl_jtc_search {
        width: 100%;
        height: auto;
        padding: 0 .2rem;
        padding-top: .4rem;
        .el-input__inner {
          height: .4rem!important;
          line-height: .4rem!important;
        }
        .el-input__icon {
          height: .4rem!important;
          line-height: .4rem!important;
        }
        .el-range-editor {
          width: 100%;
          padding: 0;
          > i {
            display: none;
          }
          > input {
            width: 50%;
          }
          .el-range-separator {
            height: .4rem;
            line-height: .4rem;
            width: 10px;
            padding: 0;
          }
        }
        button {
          height: .4rem;
          line-height: .4rem;
          padding: 0 .12rem;
          background-color: #0C70F8!important;
          border-color: #0C70F8!important;
          color: #FFFFFF;
          &:hover {
          background-color: #409EFF!important;
            border-color: #409EFF!important;
          }
        }
        .el-select {
          margin-bottom: .1rem;
        }
        > div {
          margin-bottom: .1rem;
        }
      }
    }
    .vl_j_right {
      display: inline-block;
      width: calc(100% - 2.52rem);
      height: 100%;
      position: relative;
      #tcMap {
        width: 100%;
        height: 100%;
      }
    }
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
    .vl_jtc_mk {
      width: 2.18rem;
      height: 1.22rem;
      position: relative;
      > video {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }
      > p {
        width: 100%;
        position: absolute;
        color: #FFFFFF;
        bottom: .08rem;
        font-size: .12rem;
        padding: 0 .06rem;
        line-height: 20px;
        > i {
          height: 20px;
          float: right;
          vertical-align: middle;
        }
      }
    }
    .vl_jtc_mk_check {
      > input {
        position: absolute;
        top: 0;
        right: 0;
        &:after {
          position: absolute;
          width: 14px;
          height: 14px;
          top: 0;
          content: '';
          background-color: #FFFFFF;
          color: #fff;
          display: block;
          border: 1px solid #409EFF;
          line-height: 11px;
          text-align: center;
          border-radius: 3px;
        }
      }
      > input:checked {
        &:after {
          background-color: #409EFF;
          content: '✓';
          font-size: 10px;
        }
      }
    }
    .history-pic-dialog {
      .el-dialog {
        max-width: 12.6rem;
        width: 100%!important;
      }
      .el-dialog__title {
        font-size: .16rem;
        color: #333333;
      }
      .el-dialog__body {
        padding: 0 .76rem .3rem;
      }
      .his-pic-box {
        width: 100%;
        height: 4.6rem!important;
        .his-pic-item {
          float: left;
          width: 1.38rem;
          height: 1.38rem;
          border: .02rem solid #FFFFFF;
          margin-right: .2rem;
          margin-bottom: .2rem;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .active {
          border-color: #0C70F8;
        }
      }
      .el-dialog__footer {
        button {
          width: 1.4rem!important;
          height: .4rem;
          line-height: .4rem;
          padding: 0;
        }
      }
    }
    .vl_jig_mk_img {
      width: 98px;
      height: 98px;
      border: .04rem solid #FFFFFF;
      img {
        width: 100%;
        height: 100%;
      }
      p {
        display: none;
      }
    }
    .vl_jig_mk_img_hover {
      position: relative;
      border: .04rem solid #0C70F8;
      > div {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: .4rem;
        background: rgba(12, 112, 248, .8);
        p {
          display: block;
          color: #FFFFFF;
          font-size: .12rem;
          line-height: .2rem;
          text-indent: .08rem;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
    .vl_jfo_sxt {
      -webkit-transition: 0s all!important;
      -moz-transition: 0s all!important;
      -ms-transition: 0s all!important;
      -o-transition: 0s all!important;
      transition: 0s all!important;
    }
  }
</style>