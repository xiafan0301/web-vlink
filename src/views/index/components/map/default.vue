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
  methods: {
  }
}
</script>
<style lang="scss">
.vl_map_main { height: 100%; overflow: hidden; }
.vl_map {
  position: relative;
  height: 100%;
  > .map_l {
    position: absolute; top: 0; left: 0; z-index: 2;
    padding: 20px 0 20px 20px;
    width: 280px; height: 100%;
    animation: fadeInLeft .4s ease-out .4s both;
    > div {
      position: relative;
      width: 260px; height: 100%;
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
            width: 50%; height: 50px; line-height: 50px;
            text-align: center;
            font-size: 14px; color: #666666;
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
        padding-top: 71px;
        height: 100%;
        > .map_lc_d {
          position: relative;
          height: 100%;
          > .map_lc_dt {
            position: absolute; top: 0; left: 0;
            width: 100%; height: 36px;
            padding: 2px 20px;
            > i {
              position: absolute; top: 11px; right: 35px;
              color: #999;
              font-weight: 600;
              cursor: pointer;
              font-size: 14px;
            }
          }
          > .map_lc_dc {
            height: 100%;
            padding-top: 46px;
            > div {
              width: 100%; height: 100%;
              overflow: auto;
              padding: 0 15px;
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
      position: absolute; top: 20px; left: 50%;
      margin-left: -220px;
      overflow: hidden;
      padding: 15px 30px;
      background:rgba(255,255,255,1); 
      box-shadow:0px 3px 10px 0px rgba(99,99,99,0.39);
      animation: fadeInDown .4s ease-out .4s both;
      > li {
        float: left;
      }
    }
    > .map_rrt {
      position: absolute; right: 20px; top: 50%;
      height: 510px;
      margin-top: -255px;
      transition: right .3s ease-out;
      animation: fadeInRight .4s ease-out .4s both;
      > ul {
        padding: 0 10px;
        background-color: #fff;
        font-size: 12px;
        box-shadow: 0 0 10px rgba(148,148,148,0.24);
        > li {
          padding: 10px 0;
          border-bottom: 1px solid #eee;
          height: 70px;
          text-align: center;
          cursor: pointer;
          overflow: hidden;
          transition: color .4s;
          > i {
            display: block;
            margin: 6px auto 0 auto;
            transition: all .4s;
          }
          > span {
            padding-top: 5px;
            display: block;
            text-align: center;
          }
          &:last-child { border-bottom: 0; }
          &:hover { color: #1264F8; }
          &.vl_icon_sed { color: #1264F8; }
        }
        &.map_rrt_u2 {
          margin-top: 20px;
          font-size: 20px; color: #1264F8;
          > li {
            line-height: 50px;
            > i {
              margin-top: 0;
              display: inline-block;
            }
          }
        }
      }
      &.map_rrt2 {
        right: 281px;
      }
    }
    > .map_rrc {
      position: absolute; right: 20px; top: 50%;
      padding: 5px;
      background: #fff;
      > li {
        width: 231px; height: 144px;
        padding: 5px;
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
            font-size: 16px;
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
              padding: 5px 5px;
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
