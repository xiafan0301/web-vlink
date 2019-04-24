<template>
  <div class="vl_map_main">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="scss">
  html {
    font-size: 100px;
  }
  @media screen and (min-width: 960px) and (max-width: 1119px) {html {font-size: 60px !important;}}
  @media screen and (min-width: 1200px) and (max-width: 1439px) {html {font-size: 70px !important;}}
  @media screen and (min-width: 1440px) and (max-width: 1679px) {html {font-size: 80px !important;}}
  @media screen and (min-width: 1680px) and (max-width: 1919px) {html {font-size: 90px !important;}}
  @media screen and (min-width: 1920px) {html {font-size: 100px !important;} }
.vl_map_main { height: 100%; overflow: hidden; }
.vl_map {
  position: relative;
  height: 100%;
  > .map_l {
    position: absolute; top: 0; left: 0; z-index: 2;
    padding: .2rem 0 .2rem .2rem;
    width: 2.8rem; height: 100%;
    animation: fadeInLeft .4s ease-out .4s both;
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
            input {
              height: .32rem;
              line-height: .32rem;
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
            .is-expanded {
              > .el-tree-node__content {
                .el-tree-node__expand-icon{
                  color: #0C70F8;
                }
                .custom-tree-node {
                  color: #0C70F8;
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
    > .map_rm {
      width: 100%; height: 100%;
    }
    > .map_rt {
      position: absolute; top: .2rem; left: 50%;
      margin-left: -2.22rem;
      overflow: hidden;
      padding: .15rem .3rem;
      background:rgba(255,255,255,1); 
      box-shadow:0px 3px 10px 0px rgba(99,99,99,0.39);
      animation: fadeInDown .4s ease-out .4s both;
      > li {
        float: left;
      }
    }
    > .map_rrt {
      position: absolute; right: .2rem; top: 50%;
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
}
.map_rt_ck_num {
  font-size: 12px;
  color: #999;
  display: inline-block;
}
</style>
