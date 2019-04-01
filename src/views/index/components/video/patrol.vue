<template>
  <div class="vl_vid" id="videoPatrol">
    <div class="vid_show_menu" :class="{'vid_show_menu_active': showMenuActive}">
      <div class="show_menu_t" @click="showMenuActive = !showMenuActive">{{ showMenuActive ? '收起监控列表' : '展开监控列表' }}<i class="el-icon-caret-bottom"></i></div>
      <div class="show_menu_b">
        <div>
          <ul class="show_title">
            <li class="show_title_li" :class="{'show_title_active': showConTitle === 1}" @click="showConTitle = 1">监控列表</li>
            <li class="show_title_li" :class="{'show_title_active': showConTitle === 2}" @click="showConTitle = 2">播放历史</li>
            <li class="show_title_line" :class="{'show_title_line2': showConTitle === 2}"></li>
          </ul>
          <div class="show_content" v-show="showConTitle === 1">
            <div class="show_search">
              <div>
                <el-input
                  class="vl_map_lc_dt_inp"
                  size="small"
                  placeholder="请输入内容"
                  v-model="searchVal">
                </el-input>
                <i class="el-icon-search"></i>
              </div>
            </div>
            <div class="show_list">
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
                        v-if="!deviceIsPlaying(sitem)"
                        @dragstart="dragStart($event, sitem)" @dragend="dragEnd"
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
            <!-- <div class="show_his_btn" v-if="historyData && historyData.length > 0">清空记录</div>
            <ul class="show_his">
              <li v-for="(item, index) in historyData" :key="'hty_' + index">
                <h3 class="com_ellipsis">{{item.name}}</h3>
                <p>{{item.time}}</p>
                <i class="el-icon-delete"></i>
              </li>
            </ul> -->
          </div>
        </div>
      </div>
    </div>
    <div class="vid_title">
      <ul class="vid_show_type">
        <li class="vl_icon vl_icon_061" :class="{'vl_icon_sed': showType === 1}" @click="showType = 1"></li>
        <li class="vl_icon vl_icon_062" :class="{'vl_icon_sed': showType === 2}" @click="showType = 2"></li>
        <li class="vl_icon vl_icon_063" :class="{'vl_icon_sed': showType === 3}" @click="showType = 3"></li>
        <li class="vl_icon vl_icon_064" :class="{'vl_icon_sed': showType === 4}" @click="showType = 4"></li>
       <!--  <li class="vl_icon vl_icon_065" :class="{'vl_icon_sed': showType === 5}" @click="showType = 5"></li> -->
      </ul>
    </div>
    <div class="vid_opes">
      <el-button type="primary">暂停轮巡</el-button>
      <el-button>关闭轮巡</el-button>
    </div>
    <div class="vid_content">
      <ul class="vid_show_list" :class="'vid_list_st' + showType">
        <li v-for="(item, index) in videoList" :key="'video_list_' + index"
          @drop="dragDrop(item, index)" @dragover.prevent="dragOver">
          <div v-if="item && item.video">
            <div is="rtmpplayer" @playerClose="playerClose" :index="index" :oData="item" :signAble="true"></div>
          </div>
          <div class="vid_show_empty" v-else>
            <div is="videoEmpty" @showListEvent="showListEvent" :btn="true"></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { formatDate } from "@/utils/util.js";
import {videoTree} from '@/utils/video.tree.js';
import videoEmpty from './videoEmpty.vue';
import rtmpplayer from '@/components/common/rtmpplayer.vue';
import { apiDeviceList, apiVideoRecord } from "@/views/index/api/api.video.js";
export default {
  components: {videoEmpty, rtmpplayer},
  data () {
    return {
      // 设备列表
      deviceList: [],

      // {video: {}, title: ''},
      videoList: [{}, {}, {}, {}],
      showType: 2,
      showVideoTotal: 4,
      showMenuActive: false,
      showConTitle: 1,
      searchVal: '',
      dragActiveObj: null
    }
  },
  watch: {
    showType (newVal, oldVal) {
      if (this.showType === 1) {
        this.showVideoTotal = 1;
      } else if (this.showType === 2) {
        this.showVideoTotal = 4;
      } else if (this.showType === 3) {
        this.showVideoTotal = 5;
      } else if (this.showType === 4) {
        this.showVideoTotal = 9;
      } else if (this.showType === 5) {
        this.showVideoTotal = 16;
      }
      this.playersHandler(this.showVideoTotal);
    }
  },
  created () {
    // window.localStorage.getItem(name);
    let sType = window.localStorage.getItem('vlink_video_patrol_type');
    let sList = window.localStorage.getItem('vlink_video_patrol_list');
    if (sType && sType.length > 0) {
      sType = Number(sType);
      this.showType = sType;
    } else {
      // 第一次打开
      this.showMenuActive = true;
    }
    if (sList && sList.length > 0) {
      this.$nextTick(() => {
        sList = JSON.parse(sList);
        this.videoList = sList;
      });
    }

    // 监控列表
    this.getDeviceList();
  },
  mounted () {
    videoTree('videoListTree');
    $(window).on('unload', this.unloadSave);
  },
  methods: {
    /* 监控列表 */
    getDeviceList () {
      let sui = window.localStorage.getItem('userInfo');
      if (sui) { sui = JSON.parse(sui); }
      apiDeviceList({
        id: sui.uid,
        likeKey: ''
      }).then(res => {
        if (res && res.data) {
          this.deviceList = res.data;
        }
      }).catch(error => {
        console.log("apiSignContentList error：", error);
      });
    },
    deviceIsPlaying (item) {
      let flag = false;
      for (let i = 0; i < this.videoList.length; i++) {
        if (this.videoList[i].video && this.videoList[i].video.uid === item.uid) {
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
      window.localStorage.setItem('vlink_video_patrol_type', JSON.stringify(this.showType));
      window.localStorage.setItem('vlink_video_patrol_list', JSON.stringify(this.videoList));
    },
    unloadSave () {
      this.saveVideoList();
    },

    // 拖拽开始
    dragStart (ev, item) {
      // console.log('drag start', item)
      this.dragActiveObj = item;
      // 设置属性dataTransfer   两个参数   1：key   2：value
      if (!ev) { ev = window.event; }
      ev.dataTransfer.setData('name', 'ouyang');
    },
    dragOver () {
      // console.log('drag over')
    },
    dragDrop (item, index) {
      /* console.log('drag drop item', item);
      console.log('drag drop index', index); */
      if (this.dragActiveObj) {
        // this.videoList.splice(index, 1, Object.assign({}, this.dragActive));
        /* this.videoList[index] = {
          title: this.dragActiveObj.name,
          video: {
            url: Math.random() > 0.5 ? 'rtmp://live.hkstv.hk.lxdns.com/live/hks1' : 'rtmp://10.16.1.139/live/livestream'
          }
        } */
        // 湖南卫视   rtmp://58.200.131.2:1935/livetv/hunantv
        // console.log(Math.random());
        // rtmp://10.16.1.139/live/livestream
        // rtmp://10.16.1.139/live/livestream
        // rtmp://10.16.1.138/live/livestream
        // rtmp://live.hkstv.hk.lxdns.com/live/hks1
        let deviceSip = Math.random() > 0.5 ? 'rtmp://live.hkstv.hk.lxdns.com/live/hks1' : 'rtmp://10.16.1.139/live/livestream';
        console.log('deviceSip', deviceSip);
        this.videoList.splice(index, 1, {
          title: this.dragActiveObj.deviceName,
          video: Object.assign({}, this.dragActiveObj, {
            deviceSip: deviceSip
          })
        });
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
    playerClose (iIndex, sid) {
      console.log('playerClose' + iIndex);
      this.videoList.splice(iIndex, 1, {});
    },
    /* 播放器事件 end */

    showListEvent () {
      this.showMenuActive = true;
    },
    searchSubmit () {
      this.getData();
    },
    getData () {
      this.searchLoading = true;
      apiVideoDownloadList({
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        // orderBy: '',
        // order: '',
        'where.startTime': formatDate(this.formInline.time[0], 'yyyy-MM-dd 00:00:00'),
        'where.endTime': formatDate(this.formInline.time[1], 'yyyy-MM-dd 23:59:59'),
        'where.oprUserId': '1',
        'where.oprDeptId': '1'
      }).then(res => {
        if (res && res.data) {
          this.pagination.total = res.data.total;
          this.tableData = res.data.list;
        }
        this.searchLoading = false;
      }).catch(error => {
        this.searchLoading = false;
        console.log("apiVideoDownloadList error：", error);
      });
    }
  },
  destroyed () {
    // 播放记录
    for (let i = 0; i < this.videoList.length; i++) {
      let obj = this.videoList[i];
      console.log('obj', obj);
      if (obj && obj.video) {
        apiVideoRecord({
          deviceId: obj.video.uid, // 设备id
          // playBackEndTime: '', // 回放结束时间
          // playBackStartTime: '', // 回放开始时间
          playTime: formatDate(new Date().getTime()), // 播放结束时间
          // 播放类型 1:视频巡逻 2:视频回放
          playType: 1
        }).then(() => {
        }).catch(error => {
          console.log("apiVideoRecord error：", error);
        });
      }
    }
    

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
