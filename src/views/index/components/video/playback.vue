<template>
  <div class="vl_vid" id="videoPatrol">
    <div class="vid_show_menu" :class="{'vid_show_menu_active': showMenuActive}">
      <div class="show_menu_b">
        <div>
          <ul class="show_title">
            <li class="show_title_li" :class="{'show_title_active': showConTitle === 3}" @click="showConTitle = 3">监控列表</li>
            <li class="show_title_li" :class="{'show_title_active': showConTitle === 1}" @click="showConTitle = 1">监控分组</li>
            <li class="show_title_li" :class="{'show_title_active': showConTitle === 2}" @click="showConTitle = 2">播放历史</li>
            <li class="show_title_line" :class="{'show_title_line2': showConTitle === 1, 'show_title_line3': showConTitle === 2}"></li>
          </ul>
          <div class="show_content" v-show="showConTitle === 3">
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
                  @keyup.enter.native="getDeviceList3()"
                  v-model="searchVal3">
                  <i slot="suffix" @click="getDeviceList3()" class="el-input__icon el-icon-search" style="font-size: 20px;"></i>
                </el-input>
              </div>
            </div>
            <div class="show_list" style="padding-top: 142px;">
              <ul class="show_list_c show_tree" id="videoList3Tree">
                <template v-if="deviceList3 && deviceList3.areaTreeList && deviceList3.areaTreeList.length > 0">
                  <li v-for="(item, index) in deviceList3.areaTreeList" :key="'tree3_' + index">
                    <div>
                      <div class="tree_title">
                        <i class="show_list_pi el-icon-arrow-right"></i>{{item.areaName}}
                      </div>
                    </div>
                    <ul class="tree_sli" v-if="item.deviceBasicList && item.deviceBasicList.length > 0">
                      <li v-for="(sitem, sindex) in item.deviceBasicList" :title="sitem.deviceName" :key="'dev_list_' + sindex">
                        <div class="com_ellipsis"
                          @dragstart="dragStart($event, sitem)" @dragend="dragEnd"
                          draggable="true" style="cursor: move;">
                          {{sitem.deviceName}}
                          <span class="vl_icon vl_icon_v11"></span>
                        </div>
                        <!-- 
                        v-if="!deviceIsPlaying(sitem)"
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
          <div class="show_content" v-show="showConTitle === 1">
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
                  placeholder="请输入设备或分组名称"
                  size="small"
                  @keyup.enter.native="getDeviceList()"
                  v-model="searchVal">
                  <i slot="suffix" @click="getDeviceList()" class="el-input__icon el-icon-search" style="font-size: 20px;"></i>
                </el-input>
              </div>
            </div>
            <div class="show_list" style="padding-top: 142px;">
              <ul class="show_list_c show_tree" id="videoListTree">
                <template v-if="deviceList && deviceList.length > 0">
                  <li v-for="(item, index) in deviceList" :key="'tree_' + index">
                    <div>
                      <div class="tree_title">
                        <i class="show_list_pi el-icon-arrow-right"></i>{{item.groupName}}
                      </div>
                    </div>
                    <ul class="tree_sli" v-if="item.deviceBasicList && item.deviceBasicList.length > 0">
                      <li v-for="(sitem, sindex) in item.deviceBasicList" :title="sitem.deviceName" :key="'dev_list3_' + sindex">
                        <div class="com_ellipsis"
                          @dragstart="dragStart($event, sitem)" @dragend="dragEnd"
                          draggable="true" style="cursor: move;">
                          {{sitem.deviceName}}
                          <span class="vl_icon vl_icon_v11"></span>
                        </div>
                        <!-- 
                          v-if="!deviceIsPlaying(sitem)"
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
          <div class="show_content" v-show="showConTitle === 2">
            <div class="show_his_c">
              <div class="show_his_btn" @click="delAllVideoRecords" v-if="videoRecordList && videoRecordList.length > 0">清空记录</div>
              <div class="show_his_empty" v-else>暂无记录</div>
              <ul class="show_his">
                <li v-for="(item, index) in videoRecordList" :key="'hty_' + index">
                  <!-- 过期 -->
                  <div draggable="false" class="show_his_dis" v-if="item.expireFlag">
                    <h3 class="com_ellipsis">{{item.deviceName}}</h3>
                    <p>{{item.playTime | fmTimestamp}}</p>
                    <i class="el-icon-delete" @click="delVideoRecord(item)"></i>
                  </div>
                  <div @dragstart="dragStart2($event, item, 2)" @dragend="dragEnd"
                    draggable="true" style="cursor: move;" v-else>
                    <h3 class="com_ellipsis">{{item.deviceName}}</h3>
                    <p>{{item.playTime | fmTimestamp}}</p>
                    <i class="el-icon-delete" @click="delVideoRecord(item)"></i>
                  </div>
                </li>
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
            <div is="flvplayer" @playerClose="playerClose" :index="index" :oData="item" :signAble="true" :bResize="bResize"></div>
          </div>
          <div class="vid_show_empty" v-else>
            <div is="videoEmpty" @btnEvent="showListEvent" :btn="true"></div>
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
import { apiDeviceList, apiVideoRecordList, apiDelVideoRecord, apiDelVideoRecords } from "@/views/index/api/api.video.js";
export default {
  components: {videoEmpty, flvplayer},
  data () {
    let _ndate = new Date();
    return {
      // 设备列表
      deviceList: [], // 监控分组
      deviceList3: null, // 监控列表

      bResize: {},
      // {video: {}, title: ''},
      videoList: [{}, {}, {}, {}],
      showVideoTotal: 4,
      showMenuActive: true,
      showConTitle: 3,
      searchVal: '',
      searchVal3: '',
      dragActiveObj: null,

      videoRecordList: [],
      videoRecordSearchTime: null,

      initTime: [new Date(_ndate.getTime() - 3600 * 1000 * 24 * 1), _ndate],
      startTime: '',
      endTime: '',
      startTimeOptions: {
        disabledDate: (d) => {
          // console.log(d);
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
          if (d > new Date() || d.getTime() < (this.startTime.getTime() - 3600 * 1000 * 24) || d.getTime() > (this.startTime.getTime() + 3600 * 1000 * 24)) {
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
    },
    showConTitle (newVal) {
      if (newVal === 2) {
        this.getVideoRecordList();
      }
    }
  },
  created () {
    // window.localStorage.getItem(name);
    let sType = window.localStorage.getItem('vlink_video_patrol_type2');
    if (sType && sType.length > 0) {
      sType = Number(sType);
      this.showVideoTotal = sType;
    } else {
      // 第一次打开
      this.showMenuActive = true;
    }

    // /:uid/:deviceName
    let _uid = this.$route.query.uid;
    if (_uid) {
      let _name = this.$route.query.deviceName;
      if (!_name) { _name = ''; }
      // 看的是之前的24小时
      let _nd = new Date();
      this.endTime = _nd;
      this.startTime = new Date(_nd.getTime() - 3600 * 1000 * 24);
      this.videoList.splice(0, 1, {
        type: 2,
        title: _name,
        startTime: this.startTime,
        endTime: this.endTime,
        video: {
          uid: _uid
        }
      });
    }
    // console.log(_uid);
    this.startTime = this.initTime[0];
    this.endTime = this.initTime[1];
    // 监控列表
    this.getDeviceList3();
    // 监控分组
    this.getDeviceList();
  },
  mounted () {
    videoTree('videoListTree');
    videoTree('videoList3Tree');
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

    /* 播放记录 */
    getVideoRecordList () {
      // 播放类型 1:视频巡逻 2:视频回放
      apiVideoRecordList({
        playType: 2
      }).then(res => {
        // videoRecordSearchTime
        if (res && res.data) {
          this.videoRecordList = res.data;
        }
      }).catch(error => {
        console.log("apiVideoRecordList error：", error);
      });
    },
    delVideoRecord (item) {
      apiDelVideoRecord(item.uid).then((res) => {
        if (res) {
          this.getVideoRecordList();
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
        }
      }).catch(error => {
        // this.$message.error('删除失败！');
        console.log("apiDelVideoRecord error：", error);
      });
    },
    delAllVideoRecords () {
      // apiDelVideoRecords
      this.$confirm('确定删除所有的播放历史吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        apiDelVideoRecords({playType: 2}).then((res) => {
          if (res) {
            this.getVideoRecordList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        }).catch(error => {
          // this.$message.error('删除失败！');
          console.log("apiDelVideoRecords error：", error);
        });
      }).catch(() => {
      });
    },

    /* 监控列表 */
    getDeviceList3 () {
      apiAreaServiceDeviceList({
        areaUid: mapXupuxian.adcode,
        likeKey: this.searchVal3
      }).then(res => {
        if (res && res.data) {
          this.deviceList3 = res.data;
        }
      }).catch(error => {
        console.log("apiAreaServiceDeviceList error：", error);
      });
    },

    /* 监控分组 */
    getDeviceList () {
      apiDeviceList({
        likeKey: this.searchVal
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
      window.localStorage.setItem('vlink_video_patrol_type2', JSON.stringify(this.showVideoTotal));
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
    // 设备ID字段名不一样。。。。
    dragStart2 (ev, item) {
      // console.log('drag start', item)
      this.dragActiveObj = Object.assign({}, item, {
        uid: item.deviceUid,
        _record: true
      });
      // console.log('this.dragActiveObj', this.dragActiveObj)
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
        let sT = this.startTime, sE = this.endTime;
        if (this.dragActiveObj._record) {
          sT = this.dragActiveObj.playBackStartTime;
          sE = this.dragActiveObj.playBackEndTime;
        }
        this.videoList.splice(index, 1, Object.assign({}, {
          type: 2,
          title: this.dragActiveObj.deviceName,
          startTime: sT,
          endTime: sE,
          record: true,
          video: Object.assign({}, this.dragActiveObj)
        }));
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

    showListEvent () {
      this.showMenuActive = true;
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