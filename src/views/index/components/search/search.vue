<template>
  <div class="vl_judge_main clearfix">
    <ul class="vl_smenu">
      <li>
        <router-link :to="{name: 'search_capture'}">抓拍检索</router-link>
      </li>
      <li>
        <router-link :to="{name: 'search_portrait'}">人像检索</router-link>
      </li>
      <li>
        <router-link :to="{name: 'search_contrast'}">人像对比</router-link>
      </li>
      <li>
        <router-link :to="{name: 'search_history'}">检索历史</router-link>
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
      padding-top: 32px;
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
            color: #0C70F8;
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
          /*background-color: #0C70F8!important;*/
          /*border-color: #0C70F8!important;*/
          /*color: #FFFFFF;*/
          /*&:hover {*/
          /*background-color: #409EFF!important;*/
          /*border-color: #409EFF!important;*/
          /*}*/
        }
        .el-select {
          margin-bottom: .1rem;
        }
        > div {
          margin-bottom: .1rem;
        }
        .vl_jtc_search_item {
          height: 1.4rem;
          .camera-tree {
            border: 1px solid #e4e7ed;
            border-radius: 4px;
            background-color: #fff;
            -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            -webkit-box-sizing: border-box;
          }
        }
      }
    }
    .vl_s_right {
      display: inline-block;
      width: calc(100% - 2.52rem);
      height: 100%;
      position: relative;
      .vl_jig_right {
        width: 100%;
        height: 100%;
        padding: 0 .2rem;
        padding-right: 0;
        .vl_jig_right_title {
          width: 100%;
          height: .7rem;
          line-height: .7rem;
          color: #999999;
          .vl_jr_t_item {
            float: left;
            width: 50%;
            text-align: left;
            padding-left: .1rem;
            >div {
              cursor: pointer;
              display: inline-block;
            }
            .active-item {
              color: #2580FC;
              i {
                color: #999999;
              }
              .active {
                color: #2580FC;
              }
            }
            &:first-child {
              padding-right: .1rem;
              padding-left: 0;
              >div {
                float: right;
                span {
                  display: inline-block;
                  vertical-align: middle;
                  i {
                    display: block;
                    font-size: 10px;
                  }
                }
              }
            }
          }
        }
        .vl_jfo_event {
          height: calc(100% - .7rem);
          .vl_jfo_event_box {
            width: 100%;
            height: auto;
            .vl_jfo_box_item {
              float: left;
              cursor: pointer;
              width: 3.28rem;
              height: 1.8rem;
              padding: .2rem;
              margin-right: .2rem;
              margin-bottom: .2rem;
              background: rgba(255, 255, 255, 1);
              box-shadow: 0px 5px 16px 0px rgba(169, 169, 169, 0.2);
              .vl_jfo_i_left {
                float: left;
                width: 1.4rem;
                height: 1.4rem;
                >img {
                  width: 100%;
                  height: 100%;
                }
              }
              .vl_jfo_i_right {
                width: calc(100% - 1.4rem);
                height: 100%;
                margin-left: 1.4rem;
                padding-left: .1rem;
                >p {
                  color: #999999;
                  margin-bottom: .13rem;
                }
                .vl_jfo_line {
                  position: relative;
                  max-width: 100%;
                  display: inline-block;
                  height: .28rem;
                  line-height: .28rem;
                  margin-bottom: .08rem;
                  border: 1px solid #F2F2F2;
                  background: #FAFAFA;
                  color: #333333;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  border-radius:3px;
                  font-size: 12px;
                  overflow: hidden;
                  padding-right: 4px;
                  > i {
                    vertical-align: middle;
                  }
                  span {
                    padding: 0 .04rem;
                  }
                }
              }
            }
          }
        }
      }
    }
    .vl_jfo_sim {
      color: #0C70F8;
      font-weight: bold;
      font-size: .24rem;
      margin-top: -4px;
      i {
        vertical-align: text-top;
        margin-right: .1rem;
      }
      span {
        font-weight: normal;
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
      }
      > p {
        position: absolute;
        color: #FFFFFF;
        bottom: .08rem;
        font-size: .12rem;
        padding-left: .06rem;
      }
    }
    .vl_jtc_mk_check {
      > input {
        position: absolute;
        top: .08rem;
        right: .08rem;
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
    .struc_detail_dialog {
      .el-dialog {
        max-width: 13.06rem;
        width: 100%!important;
      }
      .el-dialog__header {
        display: none;
      }
      .struc_tab {
        height: 1.16rem;
        padding: .3rem 0;
        position: relative;
        color: #999999;
        span {
          display: inline-block;
          margin-right: .55rem;
          padding-bottom: .1rem;
          cursor: pointer;
        }
        .active {
          color: #0C70F8;
          border-bottom: 2px solid #0C70F8;
        }
        i {
          display: block;
          position: absolute;
          top: .3rem;
          right: 0px;
          cursor: pointer;
        }
      }
      .struc_main {
        width: 11.46rem;
        height: 4.4rem;
        margin: 0 auto;
        border-bottom: 1px solid #F2F2F2;
        .struc_c_detail {
          width:  100%;
          height: 3.6rem;
          >div {
            float: left;
          }
          .struc_c_d_img {
            width: 3.6rem;
            height: 3.6rem;
            background: #EAEAEA;
            position: relative;
            img {
              width: 100%;
              height: auto;
              max-height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
            }
            i {
              display: block;
              position: absolute;
              top: .1rem;
              right: .1rem;
              line-height: .26rem;
              height: .26rem;
              background: rgba(255, 255, 255, .8);
              border-radius: .13rem;
              font-style: normal;
              color: #0C70F8;
              font-size: 12px;
              padding: 0 .1rem;
            }
          }
          .struc_c_d_qj {
            margin-right: .3rem;
            &:before {
              display: block;
              content: '';
              position: absolute;
              top: -.5rem;
              left: -.5rem;
              transform: rotate(-45deg);
              border: .5rem solid #0c70f8;
              border-color: transparent transparent #0C70F8;
              z-index: 9;
            }
            span {
              display: block;
              position: absolute;
              top: .1rem;
              left: .1rem;
              width: .6rem;
              height: .6rem;
              text-align: center;
              color: #FFFFFF;
              font-size: .12rem;
              -webkit-transform: rotate(-45deg);
              -moz-transform: rotate(-45deg);
              -ms-transform: rotate(-45deg);
              -o-transform: rotate(-45deg);
              transform: rotate(-45deg);
              z-index: 99;
            }
          }
          .struc_c_d_box {
            width: calc(100% - 3.9rem);
            box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
            border-radius:1px;
            position: relative;
            overflow: hidden;
            >div {
              float: left;
            }
            .struc_c_d_info {
              width: calc(100% - 3.6rem);
              padding-left: .24rem;
              color: #333333;
              h2 {
                font-weight: bold;
                line-height: .74rem;
                padding-right: 1rem;
                .vl_jfo_sim {
                  color: #0C70F8;
                  font-weight: bold;
                  font-size: .24rem;
                  float: right;
                  i {
                    vertical-align: text-bottom;
                    margin-right: .1rem;
                  }
                  span {
                    font-weight: normal;
                  }
                }
              }
              .struc_cdi_line {
                span {
                  position: relative;
                  max-width: 100%;
                  display: inline-block;
                  height: .3rem;
                  line-height: .3rem;
                  margin-bottom: .08rem;
                  border: 1px solid #F2F2F2;
                  background: #FAFAFA;
                  color: #333333;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  border-radius:3px;
                  font-size: 12px;
                  overflow: hidden;
                  padding: 0 .1rem;
                  margin-right: .08rem;
                  > i {
                    vertical-align: middle;
                    margin-left: .1rem;
                  }
                }
              }
            }
            &:before {
              display: block;
              content: '';
              position: absolute;
              top: -.7rem;
              right: -.7rem;
              transform: rotate(-46deg);
              border: .7rem solid #0c70f8;
              border-color: transparent transparent transparent #0C70F8;
            }
            &:after {
              display: block;
              content: '';
              position: absolute;
              top: -.4rem;
              right: -.4rem;
              transform: rotate(-45deg);
              border: .4rem solid #FFFFFF;
              border-color: transparent transparent transparent #FFFFFF;
            }
            >span {
              display: block;
              position: absolute;
              top: .19rem;
              right: .19rem;
              width: 1rem;
              height: 1rem;
              text-align: center;
              color: #FFFFFF;
              font-size: .12rem;
              -webkit-transform: rotate(45deg);
              -moz-transform: rotate(45deg);
              -ms-transform: rotate(45deg);
              -o-transform: rotate(45deg);
              transform: rotate(45deg);
              z-index: 99;
            }
          }
        }
        .struc_c_address {
          height: 100%;
          #capMap {
            width:  100%;
            height: 100%;
          }
        }
      }
      .struc-list {
        width: 12.46rem;
        margin: 0 auto;
        padding: .44rem 0 .34rem 0;
        .swiper-container {
          padding: .02rem .5rem;
          &:before {
            display: block;
            content: '';
            width: .5rem;
            height: 110%;
            background: #FFFFFF;
            position: absolute;
            left: 0;
            z-index: 9;
            border: 1px solid #FFFFFF;
          }
          &:after {
            display: block;
            content: '';
            width: .5rem;
            height: 110%;
            background: #FFFFFF;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 9;
            border: 1px solid #FFFFFF;
          }
          .swiper-button-next {
            right:  0;
          }
          .swiper-button-prev {
            left: 0;
          }
          .swiper-slide {
            .swiper_img_item {
              cursor: pointer;
              border: 1px solid #FFFFFF;
              padding: 2px;
              .vl_jfo_sim {
                font-size: .14rem;
                height: .3rem;
                margin-top: 0;
                /*display: inline-block;*/
                white-space: nowrap;
                text-align: center;
                color: #999999;
                i {
                  margin-right: 0;
                }
              }
            }
            .active {
              border-color: #0C70F8;
              .vl_jfo_sim {
                color: #0C70F8;
              }
            }
          }
        }
      }
    }
  }
</style>