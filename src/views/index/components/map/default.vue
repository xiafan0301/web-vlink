<template>
  <div class="vl_map_main">
    <!--侧边栏-->
    <div is="sideNav" :sideList="sideList"></div>
    <router-view></router-view>
  </div>
</template>
<script>
  import sideNav from '@/components/common/sideNav.vue';
export default {
  components: {sideNav},
  data () {
    return {
      sideList: [
        {
          path: '/map/map',
          routerName: '电子地图'
        },
        {
          path: '/map/etc',
          routerName: '智能围堵'
        },
        {
          path: '/map/video',
          routerName: '视频N+1'
        },
        {
          path: '/map/trace',
          routerName: '线性追踪'
        },
      ]
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="scss">
.vl_map_main {
  height: 100%; overflow: hidden;
  display: flex; }
.vl_map {
  position: relative;
  height: 100%;
  width: calc(100% - 2rem);
  .vl_map_hover_main {
    left: -96px;
    bottom: 28px;
  }
  > .map_l {
    z-index: 2;
    width: 2.8rem; height: 100%;
    animation: fadeInLeft .4s ease-out .4s both;
    float: left;
    padding-left: .2rem;
    > div {
      position: relative;
      width: 2.6rem; height: 100%;
      box-shadow:4px 0px 10px 0px #838383;
      box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
      background-color: #fff;
      > .map_lt {
        position: absolute; top: 0; left: 0;
        width: 100%;
        border-bottom: 1px solid #F2F2F2;
        > ul {
          overflow: hidden;
          > li {
            float: left;
            width: 50%; height: .5rem; line-height: .5rem;
            text-align: center;
            font-size: .14rem; color: #666666;
            cursor: pointer;
            transition: color .4s ease-out;
            &.map_lt_ul_sed {
              cursor: default;
              color: #0C70F8;
            }
          }
        }
        > div {
          position: absolute; left: 0; bottom: 0;
          width: 50%; height: 2px;
          background-color: #0C70F8;
          transition: left .3s ease-out;
        }
      }
      > .map_lc {
        padding-top: .7rem;
        height: 100%;
        > .map_lc_d {
          position: relative;
          height: 100%;
          > .map_lc_dt {
            position: absolute; top: 0; left: 0;
            width: 100%; height: .36rem;
            padding: 2px .2rem;
            display: flex;
            input, button , .el-input__suffix{
              height: .32rem;
              line-height: .32rem;
            }
            .el-input__suffix {
              padding: 0;
              i {
                height: .32rem;
                line-height: .32rem;
              }
            }
            button {
              padding: 0 .08rem;
              margin-left: .1rem;
              i {
                line-height: .32rem;
              }
            }
            > i {
              position: absolute; top: .1rem; right: .35rem;
              color: #999;
              font-weight: 600;
              cursor: pointer;
              font-size: .14rem;
            }
          }
          > .map_lc_dc {
            height: 100%;
            padding-top: .46rem;
            > div {
              width: 100%; height: 100%;
              overflow: auto;
              padding: 0 .15rem;
            }
            .map_lc_dc_mark {
              width: 2.6rem;
              padding: .2rem;
              border-bottom: 1px dashed #D3D3D3;
              .dc_mark_c {
                color: #333333;
                margin-bottom: .15rem;
                word-wrap: break-word;
              }
              > p {
                color: #999999;
                font-size: 12px;
                margin-bottom: .1rem;
                span {
                  &:last-child {
                    float: right;
                  }
                }
              }
              .dc_mark_b {
                font-size: 12px;
                position: relative;
                width: calc(100% - 12px);
                .el-icon-delete {
                  float: right;
                  display: none;
                  position: absolute;
                  right: -12px;
                  bottom: 0px;
                  cursor: pointer;
                }
                .el-icon-location-outline {
                  margin-right: .04rem;
                }
              }
              &:hover {
                background: #E0F3FF;
                .dc_mark_c {
                  color: #0C70F8;
                }
                > p {
                  color: #0C70F8;
                }
                .dc_mark_b {
                  color: #0C70F8;
                  .el-icon-delete {
                    display: block;
                  }
                }
              }
            }
            .is-expanded {
              > .el-tree-node__content {
                .el-tree-node__expand-icon{
                  /*color: #0C70F8;*/
                }
                .custom-tree-node {
                  /*color: #0C70F8;*/
                }
              }
            }
            .map_tree_tab {
              width: 2.2rem;
              border:1px solid rgba(211,211,211,1);
              -webkit-border-radius: 3px;
              -moz-border-radius: 3px;
              border-radius: 3px;
              box-sizing: border-box;
              display: flex;
              margin: .07rem auto;
              height: .28rem;
              line-height: .28rem;
              >span {
                display: block;
                width: 23%;
                text-align: center;
                cursor: pointer;
                &:first-child {
                  width: 31%;
                }
              }
              .active {
                color: #0C70F8;
                background: #ECF0F2;
              }
            }
          }
          > .dc_clear_mark {
            position: absolute;
            bottom: .2rem;
            width: 2.2rem;
            height: .4rem;
            line-height: .4rem;
            padding: 0;
            left: .2rem;
          }
        }
        > .map_lc_b {
          height: 100%;
        }
      }
    }
  }
  > .map_r {
    position: relative; z-index: 1;
    height: 100%;
    float: left;
    width: calc(100% - 2.8rem);
    > .map_rm {
      width: 100%; height: 100%;
    }
    > .map_rt {
      position: absolute; top: .2rem; left: 5.94rem;
      overflow: hidden;
      padding: .15rem .3rem;
      background:rgba(255,255,255,1);
      box-shadow:0px 3px 10px 0px rgba(99,99,99,0.39);
      animation: fadeInDown .4s ease-out .4s both;
      > li {
        float: left;
      }
      > .vl_map_rt_cks {
        .el-button-group {
          button {
            border: none;
            &:hover {
              background: #ffffff;
            }
            &:focus {
              background: #ffffff;
            }
            &:first-child {
              padding: 0 0.02rem 0 0.1rem;
            }
            &:last-child {
              padding: 0 0.1rem 0 0;
            }
          }
        }
        > .el-dropdown {
          &:first-child {
            .el-dropdown__caret-button {
              .el-icon-arrow-down {
                display: none;
              }
            }
          }
          .el-checkbox {
            margin-right: 0px;
          }
        }
      }
    }
    > .map_rrt {
      position: absolute; right: .2rem; top: 45%;
      height: 5.1rem;
      margin-top: -2.55rem;
      transition: right .3s ease-out;
      animation: fadeInRight .4s ease-out .4s both;
      > ul {
        padding: 0 .1rem;
        background-color: #fff;
        font-size: 12px;
        box-shadow: 0 0 10px rgba(148,148,148,0.24);
        > li {
          padding: .1rem 0;
          border-bottom: 1px solid #eee;
          /*height: .7rem;*/
          text-align: center;
          cursor: pointer;
          overflow: hidden;
          transition: color .4s;
          > i {
            display: block;
            margin: .06rem auto 0 auto;
            transition: all .4s;
          }
          > span {
            padding-top: .05rem;
            display: block;
            text-align: center;
          }
          &:last-child { border-bottom: 0; }
          &:hover { color: #1264F8; }
          &.vl_icon_sed { color: #1264F8; }
        }
        &.map_rrt_u2 {
          margin-top: .2rem;
          font-size: .2rem; color: #1264F8;
          > li {
            line-height: .5rem;
            > i {
              margin-top: 0;
              display: inline-block;
            }
          }
        }
      }
      &.map_rrt2 {
        right: 2.8rem;
      }
    }
    > .map_rrc {
      position: absolute; right: .2rem; top: 50%;
      padding: .05rem;
      background: #fff;
      > li {
        width: 2.3rem; height: 1.44rem;
        padding: .05rem;
        > div {
          position: relative;
          width: 100%; height: 100%;
          background-color: #000;
          vertical-align: middle;
          overflow: hidden;
          > img { max-width: 100%; max-height: 100%; }
          > video {
            display: inline-block;
            position: absolute; top: 50%;
            max-width: 100%; max-height: 100%;
            vertical-align: middle;
          }
          > i {
            display: none;
            position: absolute; top: 0px; right: 0px; z-index: 3;
            font-size: .16rem;
            cursor: pointer;
            background: #fff;
            border-radius: 50%;
            animation: fadeInDown .4s ease-out both;
          }
          > div {
            display: none;
            position: absolute; bottom: 0; left: 0;
            width: 100%;
            animation: fadeInUp .4s ease-out both;
            > div {
              background-color: rgba(0, 0, 0, 0.6);
              color: #fff;
              padding: .05rem;
              font-size: .14rem;
            }
          }
          &:hover {
            > div { display: block; }
            > i { display: block; }
          }
        }
      }
    }
  }
  .my-tip {
    position: fixed;
    top: 500px;
    left: 800px;
    padding: 14px;
    z-index: 9;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    -webkit-transition: all .1s;
    -moz-transition: all .1s;
    -ms-transition: all .1s;
    -o-transition: all .1s;
    transition: all .1s;
  }
  .vl_map_selarea_hide {
    display: none;
  }
  .vl_cut_screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
    background: #ffffff;
    >img {
      width: 100%;
      height: auto;
    }
    >div {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      background: rgba(0, 0, 0, .4);
      cursor: crosshair;
      >span {
        display: block;
        overflow: hidden;
        position: absolute;
        width: 0px;
        height: 0px;
        &:after {
          content: '';
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          cursor: move;
          top: 0;
          left: 0;
          margin: auto;
          bottom: 0;
          right: 0;
        }
        >img {
          width: auto;
          height: auto;
          position: absolute;
        }
        > i {
          position: absolute;
          width: 7px;
          height: 7px;
          background: #0C70F8;
          z-index: 8;
        }
        >.move_icon1 {cursor: nw-resize; top: 0px;left: 0px;}
        >.move_icon8 {cursor: nw-resize; bottom: 0px;right: 0px;}
        >.move_icon2 {cursor: n-resize; left: 50%;top: 0px;}
        >.move_icon7 {cursor: n-resize; left: 50%; bottom: 0px;}
        >.move_icon3 {cursor: sw-resize;top: 0px;right: 0px;}
        >.move_icon6 {cursor: sw-resize;left: 0px;bottom: 0px;}
        >.move_icon4 {cursor: w-resize;top: 50%;left: 0px;}
        >.move_icon5 {cursor: w-resize;top: 50%;right: 0px;}
      }
      .cut_end {
        position: absolute;
        bottom: 500px;
        left: 500px;
        height: 30px;
        background: #ffffff;
        width: 100px;
        box-shadow: 0px 12px 12px 0px rgba(2,10,62,0.36);
        border-radius: 4px;
        line-height: 30px;
        span {
          cursor: pointer;
          vertical-align: middle;
          padding: 0 5px;
          i {
            color: #F95826;
            font-weight: bold;
            font-size: 20px;
            vertical-align: inherit;
            padding: 0 1px;
          }
          &:last-child {
            i {
              color: #1264F8;
            }
          }
        }
      }
    }
  }
  /*2.0相关*/
  .vl_map_search_point {
    position: absolute;
    left: 3rem;
    top: .3rem;
    z-index: 2;
    .inline-input {
      width: 3.04rem;
    }
    .select_btn {
      background-color: #0c70f8;
      color: #ffffff;
      width: .64rem;
      position: absolute;
      right: 0;
      height: 40px;
      padding: 0;
    }
    .vl_res_btn {
      display: flex;
      width: 102px;
      height: 40px;
      position: absolute;
      right: -112px;
      top: 0px;
      background: #ffffff;
      box-shadow:0px 3px 10px 0px rgba(99,99,99,0.39);
      cursor: pointer;
      color: #333333;
      align-items: center;
      justify-content: center;
      p {
        height: 20px;
        line-height: 20px;
        margin-left: 5px;
        vertical-align: middle;
      }
      .vl_res_list {
        position: absolute;
        top: 50px;
        left: 0px;
        width: 192px;
        height: 200px;
        -webkit-transition: height .1s ease-in;
        -moz-transition: height .1s ease-in;
        -ms-transition: height .1s ease-in;
        -o-transition: height .1s ease-in;
        transition: height .1s ease-in;
        background: #ffffff;
        border:1px solid #D3D3D3;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
      }
    }
    .vl_res_show {
      p {
        color: #0C70F8;
      }
    }

  }
}
.map_rt_ck_num {
  font-size: 12px;
  color: #999;
  display: inline-block;
}
.map_icons {
  -webkit-transition: 0s all!important;
  -moz-transition: 0s all!important;;
  -ms-transition: 0s all!important;;
  -o-transition: 0s all!important;;
  transition: 0s all!important;;
}
  textarea {
    overflow: hidden;
  }
</style>
