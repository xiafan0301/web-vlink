<template>
  <div class="relay_main">
    <div class="vl_vid" v-show="pageType === 1">
      <div class="vid_show_menu" :class="{'vid_show_menu_active': showMenuActive}">
        <div class="show_menu_b">
          <div>
            <ul class="show_title show_title_2">
              <li class="show_title_li" :class="{'show_title_active': showConTitle === 1}" @click="showConTitle = 1">进行中</li>
              <li class="show_title_li" :class="{'show_title_active': showConTitle === 2}" @click="showConTitle = 2">已结束</li>
              <li class="show_title_line" :class="{'show_title_line2': showConTitle === 2}"></li>
            </ul>
            <div class="show_content" v-show="showConTitle === 1">
              <div class="show_search" style="z-index: 2; padding: 15px 20px 0 20px;">
                <div class="show_search_ti">
                  <span>开始</span>
                  <el-date-picker
                    class="vl_vid_sdater vl_date"
                    style="width: 100%"
                    size="small"
                    v-model="startTime"
                    type="date"
                    time-arrow-control
                    :editable="false" :clearable="false"
                    @change="searchSubmit(false)"
                    :picker-options="startTimeOptions"
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
                    type="date"
                    time-arrow-control
                    :editable="false" :clearable="false"
                    @change="searchSubmit(false)"
                    :picker-options="endTimeOptions"
                    placeholder="选择结束时间">
                  </el-date-picker>
                </div>
                <div>
                  <el-select @change="searchSubmit(false)" size="small" style="width: 100%;" v-model="targetType" placeholder="选择目标类型">
                    <el-option :label="'全部'" :value="''"></el-option>
                    <el-option :label="'人员'" :value="'0'"></el-option>
                    <el-option :label="'车辆'" :value="'1'"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="show_list" style="padding-top: 142px; position: relative;">
                <!-- 直播列表 -->
                <div class="relay_ul_list">
                  <ul v-if="relayList && relayList.length > 0">
                    <!-- relayList -->
                    <template v-for="(item, index) in relayList">
                      <li v-if="item.videoPath" :key="'relay_li_' + index">
                        <div v-if="!deviceIsPlaying(item, 1)"
                          @dragstart="dragStart($event, item, 1)" @dragend="dragEnd"
                          draggable="true" style="cursor: move;">
                          <div class="relay_ul_lit">{{item.createTime}}<span class="relay_ul_lit_t2">告警</span></div>
                          <div class="relay_ul_lim" v-if="(item.type === 1 || item.type === '1') && item.plateNo && !item.subStoragePath">
                            <ul>
                              <li>车牌号码</li>
                              <li>{{item.plateNo}}</li>
                            </ul>
                          </div>
                          <div class="relay_ul_lii" v-else>
                            <img class="bigImg" :src="item.subStoragePath" alt="">
                          </div>
                          <div class="relay_ul_lid com_ellipsis">
                            <span v-if="item.remarks">{{item.remarks}}</span>
                            <span style="color: #999;" v-else>暂无备注</span>
                          </div>
                        </div>
                        <div class="relay_ul_list_active" draggable="false" v-else>
                          <div class="relay_ul_lit">{{item.createTime}}<span class="relay_ul_lit_t1">播放中</span></div>
                          <div class="relay_ul_lim" v-if="(item.type === 1 || item.type === '1') && item.plateNo && !item.storagePath">
                            <ul>
                              <li>车牌号码</li>
                              <li>{{item.plateNo}}</li>
                            </ul>
                          </div>
                          <div class="relay_ul_lii" v-else>
                            <img class="bigImg" :src="item.subStoragePath" draggable="false" alt="">
                          </div>
                          <div class="relay_ul_lid com_ellipsis">
                            <span v-if="item.remarks">{{item.remarks}}</span>
                            <span style="color: #999;" v-else>暂无备注</span>
                          </div>
                        </div>
                      </li>
                    </template>
                    <template v-for="(item, index) in relayList">
                      <li v-if="!item.videoPath" :key="'relay_li2_' + index">
                        <div v-if="!deviceIsPlaying(item, 1)"
                          @dragstart="dragStart($event, item, 1)" @dragend="dragEnd"
                          draggable="true" style="cursor: move;">
                          <div class="relay_ul_lit">{{item.createTime}}</div>
                          <div class="relay_ul_lim" v-if="(item.type === 1 || item.type === '1') && item.plateNo && !item.subStoragePath">
                            <ul>
                              <li>车牌号码</li>
                              <li>{{item.plateNo}}</li>
                            </ul>
                          </div>
                          <div class="relay_ul_lii" v-else>
                            <img class="bigImg" :src="item.subStoragePath" alt="">
                          </div>
                          <div class="relay_ul_lid com_ellipsis">
                            <span v-if="item.remarks">{{item.remarks}}</span>
                            <span style="color: #999;" v-else>暂无备注</span>
                          </div>
                        </div>
                        <div class="relay_ul_list_active" draggable="false" v-else>
                          <div class="relay_ul_lit">{{item.createTime}}<span class="relay_ul_lit_t1">播放中</span></div>
                          <div class="relay_ul_lim" v-if="(item.type === 1 || item.type === '1') && item.plateNo && !item.storagePath">
                            <ul>
                              <li>车牌号码</li>
                              <li>{{item.plateNo}}</li>
                            </ul>
                          </div>
                          <div class="relay_ul_lii" v-else>
                            <img class="bigImg" :src="item.subStoragePath" draggable="false" alt="">
                          </div>
                          <div class="relay_ul_lid com_ellipsis">
                            <span v-if="item.remarks">{{item.remarks}}</span>
                            <span style="color: #999;" v-else>暂无备注</span>
                          </div>
                        </div>
                      </li>
                    </template>
                  </ul>
                  <div class="relay_ul_et" v-else>
                    暂无数据
                  </div>
                  <div class="relay_ul_ld" v-if="searchLoading">
                    <div>
                      <i class="el-icon-loading"></i>加载中，请稍后...
                    </div>
                  </div>
                </div>
                <div class="relay_ul_btn">
                  <el-button @click="changePage(2)" size="small" type="primary" style="width:60%;">新建任务</el-button>
                </div>
              </div>
            </div>
            <div class="show_content" v-show="showConTitle === 2">
              <div class="show_search" style="z-index: 2; padding: 15px 20px 0 20px;">
                <div class="show_search_ti">
                  <span>开始</span>
                  <el-date-picker
                    class="vl_vid_sdater vl_date"
                    style="width: 100%"
                    size="small"
                    v-model="startTime2"
                    type="date"
                    time-arrow-control
                    :editable="false" :clearable="false"
                    @change="searchSubmit(true)"
                    :picker-options="startTimeOptions"
                    placeholder="选择开始时间">
                  </el-date-picker>
                </div>
                <div class="show_search_ti">
                  <span>结束</span>
                  <el-date-picker
                    class="vl_vid_sdater vl_date vl_date_end"
                    style="width: 100%"
                    size="small"
                    v-model="endTime2"
                    type="date"
                    time-arrow-control
                    :editable="false" :clearable="false"
                    @change="searchSubmit(true)"
                    :picker-options="endTimeOptions2"
                    placeholder="选择结束时间">
                  </el-date-picker>
                </div>
                <div>
                  <el-select @change="searchSubmit(true)" size="small" style="width: 100%;" v-model="targetType2" placeholder="选择目标类型">
                    <el-option :label="'全部'" :value="''"></el-option>
                    <el-option :label="'人员'" :value="'0'"></el-option>
                    <el-option :label="'车辆'" :value="'1'"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="show_list" style="padding-top: 142px; position: relative;">
                <!-- 直播列表 -->
                <div class="relay_ul_list">
                  <ul v-if="relayList2 && relayList2.length > 0">
                    <li v-for="(item, index) in relayList2" :key="'relay_list2_' + index">
                      <div class="relay_ul_list_active" draggable="false">
                        <div class="relay_ul_lit">{{item.createTime}}<span class="relay_ul_lit_t3" @click="relayRestart(item)">重启任务</span></div>
                        <div class="relay_ul_lim" v-if="(item.type === 1 || item.type === '1') && item.plateNo && !item.storagePath">
                          <ul>
                            <li>车牌号码</li>
                            <li>{{item.plateNo}}</li>
                          </ul>
                        </div>
                        <div class="relay_ul_lii" v-else>
                          <img class="bigImg" :src="item.subStoragePath" draggable="false" alt="">
                        </div>
                        <div class="relay_ul_lid com_ellipsis">
                          <span v-if="item.remarks">{{item.remarks}}</span>
                          <span style="color: #999;" v-else>暂无备注</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div class="relay_ul_et" v-else>
                    暂无数据
                  </div>
                  <div class="relay_ul_ld" v-if="searchLoading2">
                    <div>
                      <i class="el-icon-loading"></i>加载中，请稍后...
                    </div>
                  </div>
                </div>
                <div class="relay_ul_btn">
                  <el-button size="small" type="primary" style="width:60%;" @click="changePage(2)">新建任务</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span @click="showMenuActive = !showMenuActive;" class="vl_icon vid_icon_ssz" :class="{'vid_icon_sss': showMenuActive}"></span>
      </div>
      <div class="vid_content" :class="{'vid_content2': showMenuActive}">
        <div class="vid_title">
          <ul class="vid_show_type">
            <li class="vl_icon vl_icon_061" :class="{'vl_icon_sed': showVideoTotal === 1}" @click="playersChange(1)"></li>
            <li class="vl_icon vl_icon_062" :class="{'vl_icon_sed': showVideoTotal === 4}" @click="playersChange(4)"></li>
            <li class="vl_icon vl_icon_063" :class="{'vl_icon_sed': showVideoTotal === 5}" @click="playersChange(5)"></li>
          </ul>
        </div>
        <ul class="vid_show_list" :class="'vid_list_st' + showVideoTotal">
          <li v-for="(item, index) in videoList" :key="'video_list_' + index"
            @drop="dragDrop(item, index)" @dragover.prevent="dragOver">
            <div v-if="item && item.video">
              <div is="flvplayer" @playerClose="playerClose" :index="index" :oData="item" 
                :oConfig="{fit: false, sign: false, tape: false, download: false}"></div>
            </div>
            <div class="vid_show_empty" v-else>
              <div is="videoEmpty" :btn="false" :btn2="false" :tipMsg="'拖拽任务至窗口查看接力视频'"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="vl_vid relay_task" v-if="pageType === 2">
      <div is="relayNew" @closeNew="closeNew"></div>
    </div>
  </div>
</template>
<script>
import {ajaxCtx} from '@/config/config';
import {mapXupuxian} from '@/config/config.js';
import videoEmpty from './videoEmpty.vue';
import relayNew from './relay-new.vue';
import {formatDate} from '@/utils/util.js';
import flvplayer from '@/components/common/flvplayer.vue';
import { apiAreaServiceDeviceList, getAllMonitorList, getAllBayonetList } from "@/views/index/api/api.base.js";
import {selectVideoContinue, updVideoContinue, JtcPOSTAppendixInfo, JtcGETAppendixInfoList} from '@/views/index/api/api.judge.js'
import { error } from 'util';
export default {
  components: {videoEmpty, flvplayer, relayNew},
  data () {
    let _ndate = new Date();
    return {
      searchLoading: false,
      relayList: [],
      relayListIntval: null,
      searchLoading2: false,
      relayList2: [],

      pageType: 1, // 1展示 2新建
      // {video: {}, title: ''},
      videoList: [{}, {}, {}, {}],
      showVideoTotal: 4,
      showMenuActive: false,
      showConTitle: 1,
      startTime: '',
      endTime: '',
      targetType: '0',
      dragActiveObj: null,

      videoRecordList: [],

      initTime: [new Date(_ndate.getTime() - 3600 * 1000 * 24 * 2), _ndate],
      
      startTime2: '',
      endTime2: '',
      targetType2: '0',

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
          if (d > new Date() || d.getTime() < (this.startTime.getTime() - 3600 * 1000 * 24 + 1000)) {
            return true;
          } else {
            return false;
          }
        }
      },
      endTimeOptions2: {
        disabledDate: (d) => {
          if (d > new Date() || d.getTime() < (this.startTime2.getTime() - 3600 * 1000 * 24 + 1000)) {
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
    }
  },
  computed: {
  },
  created () {
    // window.localStorage.getItem(name);
    // 第一次打开
    this.showMenuActive = true;
    this.startTime = this.initTime[0];
    this.endTime = this.initTime[1];
    this.startTime2 = this.initTime[0];
    this.endTime2 = this.initTime[1];

    this.reSearch();
  },
  mounted () {
  },
  methods: {
    // bClear 关闭定时器
    intvalRelayList (bClear) {
      if (this.relayListIntval) {
        window.clearInterval(this.relayListIntval);
      }
      if (!bClear) {
        this.relayListIntval = window.setInterval(() => {
          this.reSearch(true);
        }, 10 * 60 * 1000);
      }
    },
    searchSubmit (isFinished) {
      if (isFinished) {
        this.getRelayList(true); // 已结束
      } else {
        this.getRelayList(); // 进行中
        this.intvalRelayList(false);
      }
    },
    // flag 
    reSearch (flag) {
      this.getRelayList(); // 进行中
      this.getRelayList(true); // 已结束
      this.intvalRelayList(false); // 开启定时器
    },
    getRelayList (isFinished) {
      let st = null, et = null, stype = '';
      if (isFinished) {
        st = this.startTime2;
        et = this.endTime2;
        stype = this.targetType2;
      } else {
        st = this.startTime;
        et = this.endTime;
        stype = this.targetType;
      }
      let params = {
        type: stype,
        beginTime: formatDate(st, 'yyyy-MM-dd 00:00:00'),
        endTime: formatDate(et, 'yyyy-MM-dd 23:59:59'),
        isFinished: isFinished ? 1 : 0
      }
      if (isFinished) { this.searchLoading2 = true; } else { this.searchLoading = true; }
      selectVideoContinue(params).then((res) => {
        if (res && res.data) {
          if (isFinished) {
            this.relayList2 = res.data;
          } else {
            this.relayList = res.data;
            // 播放中的视频处理
            this.relayPlayingHandler();
          }
        }
        if (isFinished) { this.searchLoading2 = false; } else { this.searchLoading = false; }
      }).catch((error => {
        if (isFinished) { this.searchLoading2 = false; } else { this.searchLoading = false; }
      }));
    },
    relayPlayingHandler () {
      for (let i = 0; i < this.videoList.length; i++) {
        if (this.videoList[i] && this.videoList[i].video) {
          let _o = this.videoList[i];
          // this.relayList
          for (let j = 0; j < this.relayList.length; j++) {
            if (_o.video.uid === this.relayList[j].uid) {
              this.videoList[i] = {
                type: 5,
                title: ' ',
                record: false,
                video: Object.assign({}, this.relayList[j], {
                  videos: []
                })
              };
              break;
            }
          }
        }
      }
    },
    closeNew (flag) {
      // console.log('closeNew', flag);
      this.changePage(1);
      if (flag) {
        this.reSearch();
      }
    },
    changePage (type) {
      this.pageType = type;
    },
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
    deviceIsPlaying (item, type) {
      let flag = false;
      for (let i = 0; i < this.videoList.length; i++) {
        if (this.videoList[i].video && this.videoList[i].video.uid === item.uid) {
          flag = true;
          break;
        }
      }
      return flag;
    },
    playersChange (sum) {
      // showVideoTotal
      if (sum != this.showVideoTotal) {
        if (sum < this.showVideoTotal) {
          this.$confirm('减少窗口后，将根据排列顺序结束多余的接力任务，确定切换吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.showVideoTotal = sum;
            this.playersHandler(sum);
          }).catch(() => {
            // 
          });
        } else {
          this.showVideoTotal = sum;
          this.playersHandler(sum);
        }
      }
    },
    playersHandler (sum) {
      // videoList
      let na = [], ii = 0, oa = [];
      for (let i = 0; i < this.videoList.length; i++) {
        if (ii < sum) {
          if (this.videoList[i] && this.videoList[i].video) {
            na.push(this.videoList[i]);
            ii++;
          }
        } else {
          if (this.videoList[i] && this.videoList[i].video) {
            oa.push(this.videoList[i]);
          }
        }
      }
      let il = sum - na.length;
      if (il > 0) {
        for (let j = 0; j < il; j++) {
          na.push({});
        }
      }
      this.videoList = na;
      if (oa && oa.length > 0) {
        for (let i = 0; i < oa.length; i++) {
          this.relayModify(oa[i].video.uid, oa[i].video.type, 1, 1);
        }
      }
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
        // let type = this.dragActiveObj.ui_type; // 1进行中 2已结束
        let obj = {
          type: 5,
          title: ' ',
          record: false,
          video: Object.assign({}, this.dragActiveObj, {
            videos: []
          })
          /* video: Object.assign({}, this.dragActiveObj, {
            videoPath: ''
            // videoPath: 'http://10.116.126.10/root/image/2019/08/02/34020000001320000003598820190802115400000001.mp4'
          }) */
        }
        let oldO = this.videoList[index];
        if (oldO && oldO.video) {
          this.$confirm('确定结束之前的接力任务吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.videoList.splice(index, 1, obj);
            this.relayModify(oldO.video.uid, oldO.video.type, 1, 1);
          }).catch(() => {
            this.videoList.splice(index, 1, obj);
          });
        } else {
          this.videoList.splice(index, 1, obj);
        }
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
    playerClose (iIndex, oData) {
      // console.log(iIndex);
      // console.log(oData);
      this.$confirm('确定结束该接力任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.videoList.splice(iIndex, 1, {});
        this.relayModify(oData.video.uid, oData.video.type, 1, 1);
      }).catch(() => {
        this.videoList.splice(iIndex, 1, {});
      });
    },
    /* 播放器事件 end */
    relayRestart (item) {
      // relayModify(item.uid, item.type, 0, 2)
      this.$confirm('确定重启该任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.relayModify(item.uid, item.type, 0, 2)
      }).catch(() => {
        // this.videoList.splice(iIndex, 1, {});
      });
    },
    // cbType  1结束任务 2重启任务
    relayModify (uid, type, isFinished, cbType) {
      if (cbType === 1) {
        let iInd = -1;
        for (let i = 0; i < this.relayList.length; i++) {
          if (this.relayList[i].uid === uid) {
            iInd = i;
            break;
          }
        }
        if (iInd >= 0) {
          this.relayList.splice(iInd, 1);
        }
      } else if (cbType === 2) {
        let iInd = -1;
        for (let i = 0; i < this.relayList2.length; i++) {
          if (this.relayList2[i].uid === uid) {
            iInd = i;
            break;
          }
        }
        if (iInd >= 0) {
          this.relayList2.splice(iInd, 1);
        }
      }
      this.relayModifyApi(uid, type, isFinished, cbType);
    },
    // cbType  1结束任务 2重启任务 为空则不会查询
    relayModifyApi (uid, type, isFinished, cbType) {
      updVideoContinue({
        uid: uid,
        type: type,
        isFinished: isFinished
      }).then(res => {
        if (res) {
          // this.reSearch();
        }
        if (cbType === 1) {
          this.getRelayList(true); // 已结束 
        } else if (cbType === 2) {
          this.getRelayList(); // 进行中
        }
          
      }).catch(error => {});
    },

    showListEvent (type) {
      this.showMenuActive = true;
      if (type === 2) {
        this.showConTitle = 2;
      } else {
        this.showConTitle = 1;
      }
    },
  },
  beforeDestroy () {
    for (let i = 0; i < this.videoList.length; i++) {
      if (this.videoList[i] && this.videoList[i].video) {
        this.relayModifyApi(this.videoList[i].video.uid, this.videoList[i].video.type, 1);
      }
    }
    if (this.relayListIntval) {
      window.clearInterval(this.relayListIntval);
    }
  }
}
</script>
<style lang="scss" scoped>
.mb_map_map {
  overflow: hidden;
  .mb_map_map_l {
    float: left;
    width: 250px;
    > .mb_map_map_lt {
      height: 40px; line-height: 40px;
      padding: 0 10px 0 10px;
      border-bottom: 1px solid #f2f2f2;
      overflow: hidden;
      > span {
        float: right;
        color: #999;
      }
    }
    > .mb_map_map_lb {
      width: 100%; height: 599px;
    }
  }
  .mb_map_map_r {
    margin-left: 250px;
    border-left: 1px solid rgba(242,242,242,1);
    > h4 {
      height: 40px; line-height: 40px;
      padding-left: 20px;
    }
    > div {
      position: relative;
      height: 600px;
      > ul {
        position: absolute; bottom: 20px; right: 10px;
        > li {
          box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
          background-color: #fff;
          padding: 10px 10px;
          text-align: center;
          cursor: pointer;
          > i { font-size: 24px; color: #0C70F8; }
          > p { font-size: 12px; position: relative; top: -2px; }
          &.vl_icon_sed {
            color: #0C70F8;
          }
        }
      }
    }
  }
}
.relay_task_mb {
  border-top: 1px solid #eee;
  > h3 {
    color: #666;
    padding-top: 10px;
  }
  > .task_mb_map {
    border-radius:4px 4px 0px 0px;
    border:1px solid rgba(211,211,211,1);
    > .task_mb_mt {
      border-bottom: 1px solid #eee;
      overflow: hidden;
      background-color: #FAFAFA;
      > li {
        float: left;
        height: 40px; line-height: 40px;
        margin: 0 20px;
        border-bottom: 2px solid #FAFAFA;
        cursor: pointer;
        &.task_mb_mt_sed {
          color: #0C70F8;
          border-bottom-color: #0C70F8;
          cursor: default;
        }
      }
    }
  }
  > .task_mb_d {
    padding: 15px 0 8px 0;
    > span { color: #666; }
  }
}
.relay_task_mm {
  padding: 15px 0;
  color: #0C70F8;
  > span {
    display: inline-block;
    cursor: pointer;
    > i {
      padding-left: 5px;
      color: #0C70F8; font-size: 16px;
      transition: all .4s ease-out;
      &.relay_task_mm_d2 {
        transform: rotate(180deg);
      }
    }
  }
}
.relay_task_mtl {
  float: left;
  width: 260px;
  height: 330px;
  border-radius:4px 4px 0px 0px;
  border:1px solid rgba(211,211,211,1);
  > .task_mtl_t {
    padding: 14px 0 14px 20px;
    text-align: left;
    background-color: #F2F2F2;
  }
  > .task_mtl_m {
    padding: 12px 25px 12px 25px;
    color: #666;
    overflow: hidden;
    > i {
      display: inline-block;
      color: red;
      font-style: normal;
    }
    > span {
      float: right;
      color: #0C70F8;
      cursor: pointer;
    }
  }
  > .task_mtl_u {
    position: relative;
    margin: 0 auto;
    width: 200px; height: 200px;
    > p {
      display: none;
      position: absolute; bottom: 0; left: 0;
      text-align: center;
      width: 100%; height: .4rem; line-height: .4rem;
      color: #FFFFFF;
      border-radius: 0 0 10px 10px;
      background: #0C70F8;
      cursor: pointer;
    }
    > .del_icon {
      display: none;
      position: absolute; top: 10px; right: 10px;
      width: 24px; height: 24px; line-height: 24px;
      text-align: center;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 4px;
      color: #FFFFFF;
    }
    &:hover {
      > p { display: block; }
      > .del_icon { display: block; }
    }
  }
}
.relay_task_mtr {
  margin-left: 270px;
  height: 330px;
  > div {
    width: 100%; height: 100%;
    border-radius:4px 4px 0px 0px;
    border:1px solid rgba(211,211,211,1);
  }
}
.relay_task {
  position: relative;
  height: 100%;
  > .relay_task_t {
    position: absolute; top: 0; left: 0;
    width: 100%;
    padding: 15px 0 0 20px;
  }
  > .relay_task_m {
    height: 100%;
    padding: 50px 10px 70px 10px;
    > div {
      height: 100%;
      padding: 10px;
      overflow: auto;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #fff;
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
    }
  }
  > .relay_task_b {
    position: absolute; bottom: 0; left: 0; z-index: 20;
    width: 100%; height: 60px;
    padding: 14px 0 0 20px;
    background-color: #fff;
    border-left: 1px solid #ddd;
  }
  
}
.relay_main { width: 100%; height: 100%; }
.relay_ul_list {
  position: relative;
  height: 100%;
  padding-bottom: 50px;
  border-top: 1px solid #eee;
  > .relay_ul_ld {
    position: absolute; top: 0px; left: 0;
    width: 100%;
    > div {
      margin-right: 20px;
      padding: 30px 0;
      background-color: #fff;
      text-align: center;
      > i { font-size: 20px; position: relative; top: 2px; margin-right: 5px; }
    }
    
  }
  > .relay_ul_et {
    padding-top: 20px;
    text-align: center;
    color: #999;
  }
  > ul {
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
    > li {
      padding: 10px 10px 10px 20px;
      border-bottom: 1px solid #eee;
      > div {
        > .relay_ul_lit {
          position: relative;
          font-size: 12px; color: #333;
          margin-bottom: 5px;
          height: 22px; line-height: 22px;
          > span {
            position: absolute; top: 2px; right: 0;
            &.relay_ul_lit_t1 { color: #4FCB61; }
            &.relay_ul_lit_t2 { color: #FA453A; }
            &.relay_ul_lit_t3 {
              display: none;
              line-height: normal;
              padding: 2px 5px 3px 5px;
              background:rgba(12,112,248,1);
              border-radius:4px;
              color: #fff; font-size: 12px;
              cursor: pointer;
            }
          }
        }
        > .relay_ul_lii {
          height: 60px;
          text-align: center;
          margin-bottom: 5px;
          > img { max-height: 100%; max-width: 100%; text-align: center; }
        }
        > .relay_ul_lid {
          height: 20px; line-height: 20px;
          font-size: 12px; color: #999;
        }
        > .relay_ul_lim {
          padding: 5px 0;
          > ul {
            width: 76px;
            margin: 0 auto; padding: 8px 0;
            background:rgba(242,242,242,1);
            border:1px solid rgba(211, 211, 211, 0.97);
            border-radius:3px;
            > li {
              text-align: center;
              font-size: 12px;
            }
          }
        }
        &.relay_ul_list_active {
          > .relay_ul_lit { color: #999; }
        }
        &:hover {
          > .relay_ul_lit {
            > span {
              &.relay_ul_lit_t3 { display: block; }
            }
          }
        }
      }
    }
  }
}
.relay_ul_btn {
  position: absolute; bottom: 0; left: 0;
  border-top: 1px solid #eee;
  padding-bottom: 2px;
  width: 100%; height: 50px; line-height: 48px;
  text-align: center;
  background-color: #fff;
}
</style>
<style lang="scss">
.vid_relay_upload {
  width: 200px; height: 200px;
  > .el-upload--picture-card {
    width: 200px; height: 200px; line-height: 200px;
    > img { height: 100%; width: 100%; }
  }
}
</style>
