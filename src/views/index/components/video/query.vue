<template>
  <div class="vl_vid" id="videoPatrol">
    <div class="vid_show_menu" :class="{'vid_show_menu_active': showMenuActive}">
      <div class="show_menu_t" @click="showMenuActive = !showMenuActive">{{ showMenuActive ? '收起监控列表' : '展开监控列表' }}<i class="el-icon-caret-bottom"></i></div>
      <div class="show_menu_b">
        <div>
          <ul class="show_title">
            <li class="show_title_li" :class="{'show_title_active': showConTitle === 1}" @click="showConTitle = 1">视频直播</li>
            <li class="show_title_li" :class="{'show_title_active': showConTitle === 2}" @click="showConTitle = 2">视频回放</li>
            <li class="show_title_line" :class="{'show_title_line2': showConTitle === 2}"></li>
          </ul>
          <div class="show_content" v-show="showConTitle === 1">
            <div class="show_search">
              <div style="margin-left: 8%; width: 84%;">
                <el-input
                  placeholder="请输入内容"
                  size="small"
                  v-model="searchVal">
                  <i slot="suffix" @click="getDeviceList(1)" class="el-input__icon el-icon-search" style="font-size: 20px;"></i>
                </el-input>
              </div>
              
              <!-- <div>
                <el-input
                  class="vl_map_lc_dt_inp"
                  size="small"
                  placeholder="请输入内容"
                  v-model="searchVal">
                </el-input>
                <i class="el-icon-search"></i>
              </div> -->
            </div>
            <div class="show_list">
              <!-- 直播列表 -->
              <ul class="show_list_c show_tree" id="videoListTree">
                <li v-for="(item, index) in deviceList" :key="'tree_' + index">
                  <div>
                    <div class="tree_title">
                      <i class="show_list_pi el-icon-arrow-right"></i>{{item.groupName}}
                    </div>
                  </div>
                  <ul class="tree_sli" v-if="item.deviceBasicList && item.deviceBasicList.length > 0">
                    <li v-for="(sitem, sindex) in item.deviceBasicList" :title="sitem.deviceName" :key="'dev_list_' + sindex">
                      <div class="com_ellipsis"
                        v-if="!deviceIsPlaying(sitem, 1)"
                        @dragstart="dragStart($event, sitem, 1)" @dragend="dragEnd"
                        draggable="true" style="cursor: move;">
                        {{sitem.deviceName}}
                        <span class="vl_icon vl_icon_v11"></span>
                      </div>
                      <div class="tree_li_dis" v-else>
                        {{sitem.deviceName}}
                        <span class="vl_icon vl_icon_v11"></span>
                      </div>
                    </li>
                  </ul>
                  <ul class="tree_sli" v-else>
                    <li class="tree_sli_empty">暂无</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div class="show_content" v-show="showConTitle === 2">
            <div class="show_search">
              <div style="margin-left: 7%; width: 86%; padding-bottom: 15px;">
                <el-input
                  placeholder="请输入内容"
                  size="small"
                  v-model="searchVal2">
                  <i slot="suffix" @click="getDeviceList(2)" class="el-input__icon el-icon-search" style="font-size: 20px;"></i>
                </el-input>
              </div>
              <div class="show_search_ti">
                <span>开始</span>
                <el-date-picker
                  style="width: 175px"
                  size="small"
                  v-model="startTime"
                  type="datetime"
                  placeholder="选择开始时间">
                </el-date-picker>
              </div>
              <div class="show_search_ti">
                <span>结束</span>
                <el-date-picker
                  style="width: 175px"
                  size="small"
                  v-model="endTime"
                  type="datetime"
                  placeholder="选择结束时间">
                </el-date-picker>
              </div>
            </div>
            <div class="show_list" style="padding-top: 152px;">
              <!-- 回放列表 -->
              <ul class="show_list_c show_tree" id="videoListTree2">
                <li v-for="(item, index) in deviceList2" :key="'tree_' + index">
                  <div>
                    <div class="tree_title">
                      <i class="show_list_pi el-icon-arrow-right"></i>{{item.groupName}}
                    </div>
                  </div>
                  <ul class="tree_sli" v-if="item.deviceBasicList && item.deviceBasicList.length > 0">
                    <li v-for="(sitem, sindex) in item.deviceBasicList" :title="sitem.deviceName" :key="'dev_list_' + sindex">
                      <div class="com_ellipsis"
                        v-if="!deviceIsPlaying(sitem, 2)"
                        @dragstart="dragStart($event, sitem, 2)" @dragend="dragEnd"
                        draggable="true" style="cursor: move;">
                        {{sitem.deviceName}}
                        <span class="vl_icon vl_icon_v11"></span>
                      </div>
                      <div class="tree_li_dis" v-else>
                        {{sitem.deviceName}}
                        <span class="vl_icon vl_icon_v11"></span>
                      </div>
                    </li>
                  </ul>
                  <ul class="tree_sli" v-else>
                    <li class="tree_sli_empty">暂无</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="vid_title">
      <ul class="vid_show_type">
        <li class="vl_icon vl_icon_061" :class="{'vl_icon_sed': showVideoTotal === 1}" @click="showVideoTotal = 1"></li>
        <li class="vl_icon vl_icon_062" :class="{'vl_icon_sed': showVideoTotal === 4}" @click="showVideoTotal = 4"></li>
        <li class="vl_icon vl_icon_063" :class="{'vl_icon_sed': showVideoTotal === 5}" @click="showVideoTotal = 5"></li>
        <li class="vl_icon vl_icon_064" :class="{'vl_icon_sed': showVideoTotal === 9}" @click="showVideoTotal = 9"></li>
       <!--  <li class="vl_icon vl_icon_065" :class="{'vl_icon_sed': showType === 5}" @click="showType = 5"></li> -->
      </ul>
    </div>
    <div class="vid_content">
      <ul class="vid_show_list" :class="'vid_list_st' + showVideoTotal">
        <li v-for="(item, index) in videoList" :key="'video_list_' + index"
          @drop="dragDrop(item, index)" @dragover.prevent="dragOver">
          <div v-if="item && item.video">
            <div is="flvplayer" @playerClose="playerClose" :index="index" :oData="item" :signAble="true"></div>
          </div>
          <div class="vid_show_empty" v-else>
            <div is="videoEmpty" @btnEvent="showListEvent" :btn="true" :btnText="'视频直播'" :btn2="true" :btnText2="'视频回放'"></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import {videoTree} from '@/utils/video.tree.js';
import videoEmpty from './videoEmpty.vue';
import flvplayer from '@/components/common/flvplayer.vue';
import { apiDeviceList } from "@/views/index/api/api.video.js";
export default {
  components: {videoEmpty, flvplayer},
  data () {
    return {
      // 直播列表
      deviceList: [],
      // 回放列表
      deviceList2: [],

      // {video: {}, title: ''},
      videoList: [{}, {}, {}, {}],
      showVideoTotal: 4,
      showMenuActive: false,
      showConTitle: 1,
      searchVal: '',
      searchVal2: '',
      dragActiveObj: null,

      videoRecordList: [],

      startTime: new Date(new Date() - 3600 * 1000 * 24 * 7),
      endTime: new Date(),
    }
  },
  watch: {
    showVideoTotal () {
      this.playersHandler(this.showVideoTotal);
    }
  },
  created () {
    // window.localStorage.getItem(name);
    let sType = window.localStorage.getItem('vlink_video_patrol_type3');
    if (sType && sType.length > 0) {
      sType = Number(sType);
      this.showVideoTotal = sType;
    } else {
      // 第一次打开
      this.showMenuActive = true;
    }
    // 监控列表
    this.getDeviceList();
  },
  mounted () {
    videoTree('videoListTree');
    videoTree('videoListTree2');
    $(window).on('unload', this.unloadSave);
  },
  methods: {
    /* 监控列表 */
    getDeviceList (type) {
      apiDeviceList({
        // id: sui.uid,
        likeKey: type === 1 ? this.searchVal : (type === 2 ? this.searchVal2 : '')
      }).then(res => {
        if (res && res.data) {
          if (type === 1) {
            this.deviceList = res.data;
          } else if (type === 2) {
            this.deviceList2 = res.data;
          } else {
            this.deviceList = res.data;
            this.deviceList2 = res.data;
          }
        }
      }).catch(error => {
        console.log("apiDeviceList error：", error);
      });
    },
    deviceIsPlaying (item, type) {
      let flag = false;
      for (let i = 0; i < this.videoList.length; i++) {
        if (this.videoList[i].video && this.videoList[i].type === type && this.videoList[i].video.uid === item.uid) {
          flag = true;
          break;
        }
      }
      return flag;
    },

    playersHandler (sum) {
      // videoList
      let na = [], ii = 0;
      for (let i = 0; i < this.videoList.length; i++) {
        if (ii < sum) {
          if (this.videoList[i] && this.videoList[i].video) {
            na.push(this.videoList[i]);
            ii++;
          }
        } else {
          break;
        }
      }
      let il = sum - na.length;
      if (il > 0) {
        for (let j = 0; j < il; j++) {
          na.push({});
        }
      }
      this.videoList = na;
    },
    // 缓存播放列表
    saveVideoList () {
      window.localStorage.setItem('vlink_video_patrol_type3', JSON.stringify(this.showVideoTotal));
    },
    unloadSave () {
      this.saveVideoList();
    },

    // 拖拽开始
    dragStart (ev, item, type) {
      // console.log('drag start', item)
      this.dragActiveObj = Object.assign(item, {
        ui_type: type
      });
      // 设置属性dataTransfer   两个参数   1：key   2：value
      if (!ev) { ev = window.event; }
      ev.dataTransfer.setData('name', 'ouyang');
    },
    dragOver () {
      // console.log('drag over')
    },
    dragDrop (item, index) {
      if (this.dragActiveObj) {
        // let deviceSip = Math.random() > 0.5 ? 'rtmp://live.hkstv.hk.lxdns.com/live/hks1' : 'rtmp://10.16.1.139/live/livestream';
        let type = this.dragActiveObj.ui_type;
        let obj = {
          type: type,
          title: this.dragActiveObj.deviceName,
          video: Object.assign({}, this.dragActiveObj)
        }
        if (type === 2) {
          Object.assign(obj, {
            startTime: this.startTime,
            endTime: this.endTime,
          });
        }
        this.videoList.splice(index, 1, obj);
      }
    },
    dragEnd () {
      // console.log('drag end')
      this.dragActiveObj = null;
    },
    /* 播放器事件 begin */
    /**
     * 关闭播放器
     * @param {string} sid 视频ID
     */
    playerClose (iIndex) {
      console.log('playerClose' + iIndex);
      this.videoList.splice(iIndex, 1, {});
    },
    /* 播放器事件 end */

    showListEvent (type) {
      this.showMenuActive = true;
      if (type === 2) {
        this.showConTitle = 2;
      } else {
        this.showConTitle = 1;
      }
    }
  },
  destroyed () {
    $(window).off('unload', this.unloadSave);
    this.saveVideoList();
  }
}
</script>
<style lang="scss" scoped>
.vl_vid {
  height: 100%;
  position: relative;
  > .vid_title {
    position: absolute; top: 0; left: 270px;
    height: 60px;
    padding: 20px 0 0 0;
  }
  > .vid_opes {
    position: absolute; top: 2px; right: 20px;
    height: 60px;
    padding: 20px 0 0 0;
  }
  > .vid_content {
    height: 100%;
    padding-top: 60px;
    overflow: hidden;
  }
}
</style>
