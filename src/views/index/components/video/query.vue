<template>
  <div class="vl_vid" id="videoPatrol">
    <div class="vid_show_menu" :class="{'vid_show_menu_active': showMenuActive}">
      <div class="show_menu_b">
        <div>
          <ul class="show_title show_title_2">
            <li class="show_title_li" :class="{'show_title_active': showConTitle === 1}" @click="showConTitle = 1">视频直播</li>
            <li class="show_title_li" :class="{'show_title_active': showConTitle === 2}" @click="showConTitle = 2">视频回放</li>
            <li class="show_title_line" :class="{'show_title_line2': showConTitle === 2}"></li>
          </ul>
          <div class="show_content" v-show="showConTitle === 1">
            <div class="show_search">
              <div>
                <el-input
                  placeholder="请输入设备或区域名称"
                  size="small"
                  @keyup.enter.native="getDeviceList(1)"
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
                <template v-if="deviceList && deviceList.areaTreeList && deviceList.areaTreeList.length > 0">
                  <li v-for="(item, index) in deviceList.areaTreeList" :key="'tree_' + index">
                    <div>
                      <div class="tree_title">
                        <i class="show_list_pi el-icon-arrow-right"></i>{{item.areaName}}
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
                        <div class="tree_li_dis" draggable="false" v-else>
                          {{sitem.deviceName}}
                          <span class="vl_icon vl_icon_v11"></span>
                        </div>
                      </li>
                    </ul>
                    <ul class="tree_sli" v-else>
                      <li class="tree_sli_empty">暂无</li>
                    </ul>
                  </li>
                </template>
                <template v-else>
                  <li class="show_list_empty">
                    暂无记录
                  </li>
                </template>
              </ul>
            </div>
          </div>
          <div class="show_content" v-show="showConTitle === 2">
            <div class="show_search">
              <div class="show_search_ti">
                <span>开始</span>
                <el-date-picker
                  class="vl_vid_sdater vl_date"
                  style="width: 100%"
                  size="small"
                  v-model="startTime"
                  type="datetime"
                  time-arrow-control
                  :editable="false" :clearable="false"
                  :picker-options="startTimeOptions"
                  @change="startTimeChange"
                  placeholder="选择开始时间">
                </el-date-picker>
              </div>
              <div class="show_search_ti">
                <span>结束</span>
                <el-date-picker
                  class="vl_vid_sdater vl_date vl_date_end"
                  style="width: 100%"
                  size="small"
                  v-model="endTime"
                  type="datetime"
                  time-arrow-control
                  :editable="false" :clearable="false"
                  :picker-options="endTimeOptions"
                  @change="endTimeChange"
                  placeholder="选择结束时间">
                </el-date-picker>
              </div>
              <div style="padding-bottom: 15px;">
                <el-input
                  placeholder="请输入设备或区域名称"
                  size="small"
                  @keyup.enter.native="getDeviceList(2)"
                  v-model="searchVal2">
                  <i slot="suffix" @click="getDeviceList(2)" class="el-input__icon el-icon-search" style="font-size: 20px;"></i>
                </el-input>
              </div>
            </div>
            <div class="show_list" style="padding-top: 142px;">
              <!-- 回放列表 -->
              <ul class="show_list_c show_tree" id="videoListTree2">
                <template v-if="deviceList2 && deviceList2.areaTreeList && deviceList2.areaTreeList.length > 0">  
                  <li v-for="(item, index) in deviceList2.areaTreeList" :key="'tree_' + index">
                    <div>
                      <div class="tree_title">
                        <i class="show_list_pi el-icon-arrow-right"></i>{{item.areaName}}
                      </div>
                    </div>
                    <ul class="tree_sli" v-if="item.deviceBasicList && item.deviceBasicList.length > 0">
                      <li v-for="(sitem, sindex) in item.deviceBasicList" :title="sitem.deviceName" :key="'dev_list_' + sindex">
                        <div class="com_ellipsis"
                          @dragstart="dragStart($event, sitem, 2)" @dragend="dragEnd"
                          draggable="true" style="cursor: move;">
                          {{sitem.deviceName}}
                          <span class="vl_icon vl_icon_v11"></span>
                        </div>
                        <!-- 
                          v-if="!deviceIsPlaying(sitem, 2)"
                          <div class="tree_li_dis" v-else>
                          {{sitem.deviceName}}
                          <span class="vl_icon vl_icon_v11"></span>
                        </div> -->
                      </li>
                    </ul>
                    <ul class="tree_sli" v-else>
                      <li class="tree_sli_empty">暂无</li>
                    </ul>
                  </li>
                </template>
                <template v-else>
                  <li class="show_list_empty">
                    暂无记录
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <span @click="showMenuActive = !showMenuActive; bResize = {};" class="vl_icon vid_icon_ssz" :class="{'vid_icon_sss': showMenuActive}"></span>
    </div>
    <div class="vid_content" :class="{'vid_content2': showMenuActive}">
      <div class="vid_title">
        <ul class="vid_show_type">
          <li class="vl_icon vl_icon_061" :class="{'vl_icon_sed': showVideoTotal === 1}" @click="showVideoTotal = 1"></li>
          <li class="vl_icon vl_icon_062" :class="{'vl_icon_sed': showVideoTotal === 4}" @click="showVideoTotal = 4"></li>
          <li class="vl_icon vl_icon_063" :class="{'vl_icon_sed': showVideoTotal === 5}" @click="showVideoTotal = 5"></li>
          <li class="vl_icon vl_icon_064" :class="{'vl_icon_sed': showVideoTotal === 9}" @click="showVideoTotal = 9"></li>
        <!--  <li class="vl_icon vl_icon_065" :class="{'vl_icon_sed': showType === 5}" @click="showType = 5"></li> -->
        </ul>
      </div>
      <ul class="vid_show_list" :class="'vid_list_st' + showVideoTotal">
        <li v-for="(item, index) in videoList" :key="'video_list_' + index"
          @drop="dragDrop(item, index)" @dragover.prevent="dragOver">
          <div v-if="item && item.video">
            <div is="flvplayer" @playerClose="playerClose" :index="index" :oData="item" :signAble="true" :bResize="bResize" :oConfig="{snap: true}"></div>
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
import {mapXupuxian} from '@/config/config.js';
import {videoTree} from '@/utils/video.tree.js';
import videoEmpty from './videoEmpty.vue';
import flvplayer from '@/components/common/flvplayer.vue';
import { apiAreaServiceDeviceList } from "@/views/index/api/api.base.js";
export default {
  components: {videoEmpty, flvplayer},
  data () {
    let _ndate = new Date();
    return {
      // 直播列表
      deviceList: [],
      // 回放列表
      deviceList2: [],

      bResize: null,

      // {video: {}, title: ''},
      videoList: [{}, {}, {}, {}],
      showVideoTotal: 4,
      showMenuActive: true,
      showConTitle: 1,
      searchVal: '',
      searchVal2: '',
      dragActiveObj: null,

      videoRecordList: [],

      initTime: [new Date(_ndate.getTime() - 3600 * 1000 * 24 * 1), _ndate],
      startTime: '',
      endTime: '',
      startTimeOptions: {
        disabledDate: (d) => {
          // d > new Date() || d > this.endTime
          if (d > new Date()) {
            return true;
          } else {
            return false;
          }
        }
      },
      endTimeOptions: {
        disabledDate: (d) => {
          if (d > new Date() || d < (this.startTime.getTime() - 3600 * 1000 * 24) || d.getTime() > (this.startTime.getTime() + 3600 * 1000 * 24)) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  },
  watch: {
    showVideoTotal () {
      this.playersHandler(this.showVideoTotal);
      this.bResize = {};
    }
  },
  created () {
    // window.localStorage.getItem(name);
    let sType = window.localStorage.getItem('vlink_video_patrol_type3');
    let sList = window.localStorage.getItem('vlink_video_patrol_list3');
    if (sType && sType.length > 0) {
      sType = Number(sType);
      this.showVideoTotal = sType;
      if (sList && sList.length > 0) {
        this.$nextTick(() => {
          sList = JSON.parse(sList);
          // console.log(sList);
          for (let i = 0; i < sList.length; i++) {
            sList[i].record = false;
          }
          this.videoList = sList;
        });
      }
    } else {
      // 第一次打开
      this.showMenuActive = true;
    }
    this.startTime = this.initTime[0];
    this.endTime = this.initTime[1];
    // 监控列表
    this.getDeviceList();
  },
  mounted () {
    videoTree('videoListTree');
    videoTree('videoListTree2');
    $(window).on('unload', this.unloadSave);
  },
  methods: {
    startTimeChange (val) {
      if (val.getTime() > new Date()) {
        this.startTime = new Date();
        this.endTime = new Date();
      } else {
        let pd = val.getTime() + 3600 * 1000 * 24;
        this.endTime = pd < new Date().getTime() ? new Date(pd) : new Date();
      }
    },
    endTimeChange (val) {
      if (val < this.startTime) {
        this.endTime = this.startTime;
      } else if (val > new Date()) {
        this.endTime = new Date();
      } else {
        let pd = this.startTime.getTime() + 3600 * 1000 * 24;
        if (val.getTime() > pd) {
          if (pd > new Date().getTime()) {
            pd = new Date().getTime();
          }
          this.endTime = new Date(pd);
        }
      }
    },

    /* 监控列表 */
    getDeviceList (type) {
      apiAreaServiceDeviceList({
        areaUid: mapXupuxian.adcode,
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
      // console.log(this.videoList);
      window.localStorage.setItem('vlink_video_patrol_type3', JSON.stringify(this.showVideoTotal));
      for (let i = 0; i < this.videoList.length; i++) {
        if (this.videoList[i] && this.videoList[i].type != 1) {
          this.videoList[i] = {};
        }
      }
      window.localStorage.setItem('vlink_video_patrol_list3', JSON.stringify(this.videoList));
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
          record: true,
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
</style>
