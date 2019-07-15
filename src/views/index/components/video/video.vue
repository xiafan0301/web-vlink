<template>
  <div class="vl_video clearfix">
    <ul class="vl_smenu">
      <li>
        <router-link :to="{name: 'video_patrol'}">视频巡逻</router-link>
      </li>
      <li>
        <router-link :to="{name: 'video_playback'}">视频回放</router-link>
      </li>
      <li>
        <router-link :to="{name: 'video_query'}">智能查看</router-link>
      </li>
      <li>
        <router-link :to="{name: 'video_relay'}">视频接力</router-link>
        <!-- <a href="javascript: void(0);" class="vl_smenu_dis">视频接力</a> -->
      </li>
      <li>
        <router-link :to="{name: 'video_signList'}">查看标记</router-link>
      </li>
      <!-- <li>
        <router-link :to="{name: 'video_videotape'}">录像记录</router-link>
      </li> -->
      <li>
        <router-link :to="{name: 'video_download'}">下载记录</router-link>
      </li>
      <!-- <li>
        <router-link :to="{name: 'video_statistics'}">设备概览</router-link>
      </li> -->
    </ul>
    <div class="vi_content">
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
<!-- 视频模块公用CSS -->
<style lang="scss">
.vl_vid {
  height: 100%;
  position: relative;
  > .vid_opes {
    position: absolute; top: 2px; right: 10px;
    height: 60px;
    padding: 16px 0 0 0;
  }
  > .vid_content {
    position: relative;
    height: 100%;
    overflow: hidden;
    &.vid_content2 {
      margin-left: 240px;
    }
    > .vid_title {
      position: absolute; top: 0; left: 10px;
      height: 60px;
      padding: 16px 0 0 0;
    }
    > .vid_show_list {
      height: 100%; padding-top: 65px;
    }
  }
}
.vid_show_type {
  float: left;
  > li {
    height: 40px;
    float: left;
    margin-right: 10px;
    cursor: pointer;
    &.vl_icon_sed {
      cursor: default;
    }
  }
  &.vid_show_type_dis {
    > li {
      cursor: default !important;
    }
  }
}
.vid_show_menu {
  position: absolute; top: 0; left: -230px; z-index: 10;
  width: 230px; height: 100%;
  transition: left 0.3s ease-out;
  > .show_menu_b {
    width: 100%; height: 100%;
    animation: fadeIn .4s ease-out both;
    > div {
      position: relative;
      width: 100%; height: 100%;
      background-color: #fff;
      box-shadow: 4px 0px 10px 0px rgba(131,131,131,0.28);
      > .show_title {
        overflow: hidden;
        position: absolute; top: 0; left: 0; z-index: 2;
        width: 100%;
        > .show_title_li {
          float: left;
          width: 33.33%; height: 48px; line-height: 48px;
          color: #999;
          border-bottom: 1px solid #ddd;
          text-align: center;
          cursor: pointer;
          &.show_title_active {
            cursor: default;
            color: #186DFB; font-size: 14px;
          }
        }
        > .show_title_line {
          position: absolute; bottom: 0; left: 0;
          height: 2px;
          background-color: #186DFB;
          overflow: hidden;
          width: 33.33%;
          transition: left 0.3s ease-out;
          &.show_title_line2 { left: 33.33%; }
          &.show_title_line3 { left: 66.67%; }
        }
        &.show_title_2 {
          > .show_title_li { width: 50%; }
          > .show_title_line {
            width: 50%;
            &.show_title_line2 { left: 50%; }
          }
        }
      }
      .show_content {
        position: relative;
        padding-top: 48px;
        height: 100%;
        overflow: auto;
        animation: fadeIn .4s ease-out both;
        > .show_search {
          position: absolute; top: 48px; left: 0;
          width: 100%;
          padding-top: 15px;
          /* > div {
            position: relative;
            width: 100%; height: 36px;
            padding: 2px 15px;
            > i {
              position: absolute; top: 11px; right: 35px;
              color: #999;
              font-weight: 600;
              cursor: pointer;
              font-size: 14px;
            }
          } */
          > .show_search_se { margin-bottom: 10px; }
          > .show_search_ti {
            position: relative;
            padding-left: 36px;
            margin-bottom: 10px;
            > span {
              position: absolute; top: 0px; left: 17px;
              width: 18px;
              color: #666; font-size: 12px;
            }
          }
        }
        > .show_list {
          padding-top: 62px;
          height: 100%;
          > .show_list_c {
            height: 100%;
            overflow: auto;
            padding-bottom: 10px;
          }
        }
        > .show_his_c {
          height: 100%;
          overflow: auto;
          > .show_his_btn {
            height: 40px; line-height: 40px;
            color: #999;
            text-align: center;
            cursor: pointer;
            &:hover { color: #186DFB; }
          }
          > .show_his_empty {
            padding: 20px 0;
            text-align: center;
            color: #999;
          }
          > .show_his {
            > li {
              > div {
                position: relative;
                padding-right: 40px;
                padding: 10px 40px 10px 20px;
                border-bottom: 1px dotted #ddd;
                cursor: default;
                > h3 { height: 20px; line-height: 20px; }
                > p { color: #999; height: 20px; line-height: 20px; }
                > i {
                  display: none;
                  position: absolute; top: 50%; right: 15px;
                  font-size: 16px;
                  margin-top: -8px;
                  cursor: pointer;
                }
                &:hover { 
                  color: #186DFB;
                  background-color: #E0F3FF;
                  > i { display: block; }
                }
                &.show_his_dis {
                  > h3 { color: #999; }
                }
              }
            }
          }
        }
      }
      .show_tree {
        > li {
          padding-bottom: 5px;
          > div {
            padding-left: 15px;
            overflow: hidden;
            > div {
              float: left;
              height: 30px; line-height: 30px;
              cursor: pointer;
              color: #222;
              > .show_list_pi {
                display: inline-block;
                transition: all .3s ease-out;
                position: relative; top: -1px;
                margin-right: 5px;
                &.show_list_pi2 {
                  transform: rotate(90deg);
                }
              }
              &:hover { color: #186DFB; }
            }
          }
          > ul {
            display: none;
            > li {
              > div {
                position: relative;
                padding: 0 35px 0 40px;
                height: 30px; line-height: 30px;
                overflow: hidden;
                cursor: pointer;
                color: #444;
                > .vl_icon_v11 {
                  position: absolute; top: 5px; right: 15px;
                }
                &:hover { color: #186DFB; }
                &.tree_li_dis {
                  color: #999 !important;
                  cursor: default !important;
                }
              }
              &.tree_sli_empty {
                color: #999;
                padding-left: 35px;
              }
            }
          }
        }
      }
    }
  }
  &.vid_show_menu_active {
    left: 10px;
  }
  > .vl_icon {
    position: absolute; top: 50%; left: 100%;
    margin-top: -80px;
    cursor: pointer;
  }
}
.vid_show_list {
  width: 100%; padding: 5px;
  > li {
    float: left;
    padding: 5px;
    width: 50%; height: 50%;
    transition: all .3s;
    > div {
      position: relative;
      width: 100%; height: 100%;
      overflow: hidden;
      background-color: #000;
      box-shadow: 0 0 5px #f1f1f1;
      > video {
        position: absolute;
        display: block;
        max-width: 100%; max-height: 100%;
        margin: 0 auto;
      }
      &.vid_show_empty {
        width: 100%; height: 100%;
        background-color: #fff;
      }
    }
  }
  &.vid_list_st1 > li {
    width: 100%; height: 100%;
  }
  &.vid_list_st4 > li {
    width: 50%; height: 50%;
  }
  &.vid_list_st5 > li {
    width: 33.33%; height: 40%;
    &:nth-child(1) {
      width: 50%; height: 60%;
    }
    &:nth-child(2) {
      width: 50%; height: 60%;
    }
  }
  &.vid_list_st9 > li {
    width: 33.33%; height: 33.33%;
  }
  &.vid_list_st16 > li {
    width: 25%; height: 25%;
  }
}
.show_list_empty { padding: 0 20px; color: #999; text-align: center; }
</style>
<style lang="scss" scoped>
.vl_video {
  position: relative;
  height: 100%;
  > .vi_content {
    height: 100%;
    padding-left: 200px;
    overflow: auto;
  }
}
</style>
