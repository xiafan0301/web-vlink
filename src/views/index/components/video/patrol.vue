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
              <div style="margin-left: 8%; width: 84%;">
                <el-input
                  placeholder="请输入内容"
                  size="small"
                  v-model="searchVal">
                  <i slot="suffix" @click="getDeviceList()" class="el-input__icon el-icon-search" style="font-size: 20px;"></i>
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
              <ul class="show_list_c show_tree" id="videoListTree">
                <li v-for="(item, index) in deviceList" :key="'tree_' + index">
                  <div>
                    <div class="tree_title">
                      <i class="show_list_pi el-icon-arrow-right"></i>{{item.groupName}}
                    </div>
                  </div>
                  <ul class="tree_sli" v-if="item.deviceBasicList && item.deviceBasicList.length > 0">
                    <li v-for="(sitem, sindex) in item.deviceBasicList" :title="sitem.deviceName" :key="'dev_list_' + sindex">
                      <!-- patrolParseDialogVisible -->
                      <div v-if="patrolActive === 1" class="tree_li_dis" 
                        @click="dragEndDis"
                        @dragend="dragEndDis"
                        draggable="true">
                        {{sitem.deviceName}}
                        <span class="vl_icon vl_icon_v11"></span>
                      </div>
                      <div class="com_ellipsis"
                        v-else-if="!deviceIsPlaying(sitem)"
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
            <div class="show_his_c">
              <div class="show_his_btn" @click="delAllVideoRecords" v-if="videoRecordList && videoRecordList.length > 0">清空记录</div>
              <div class="show_his_empty" v-else>暂无记录</div>
              <ul class="show_his">
                <li v-for="(item, index) in videoRecordList" :key="'hty_' + index">
                  <!-- 过期 -->
                  <div class="show_his_dis" v-if="item.expireFlag">
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
    </div>
    <div class="vid_title">
      <ul class="vid_show_type" :class="{'vid_show_type_dis': patrolActive === 1}">
        <li class="vl_icon vl_icon_061" :class="{'vl_icon_sed': showVideoTotal === 1}" @click="changeShowType(1)"></li>
        <li class="vl_icon vl_icon_062" :class="{'vl_icon_sed': showVideoTotal === 4}" @click="changeShowType(4)"></li>
        <li class="vl_icon vl_icon_063" :class="{'vl_icon_sed': showVideoTotal === 5}" @click="changeShowType(5)"></li>
        <li class="vl_icon vl_icon_064" :class="{'vl_icon_sed': showVideoTotal === 9}" @click="changeShowType(9)"></li>
       <!--  <li class="vl_icon vl_icon_065" :class="{'vl_icon_sed': showType === 5}" @click="showType = 5"></li> -->
      </ul>
    </div>
    <div class="vid_opes">
      <el-button v-if="patrolActive === 1" @click="patrolParse" type="primary">暂停轮巡</el-button>
      <el-button v-else-if="patrolActive === 2" @click="patrolContinue" type="primary">继续轮巡</el-button>
      <el-button v-if="patrolActive === 1 || patrolActive === 2" @click="patrolCloseDialogVisible = true">关闭轮巡</el-button>
    </div>
    <div class="vid_content">
      <ul class="vid_show_list" :class="'vid_list_st' + showVideoTotal">
        <li v-for="(item, index) in videoList" :key="'video_list_' + index"
          @drop="dragDrop(item, index)" @dragover.prevent="dragOver">
          <div v-if="item && item.video">
            <div is="flvplayer" @playerClose="playerClose" :index="index" :oData="item" :bResize="bResize"
              :oConfig="{sign: true}">
            </div>
          </div>
          <div class="vid_show_empty" v-else>
            <div is="videoEmpty" @btnEvent="showListEvent" :btn="true"></div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 轮巡提示 dialog -->
    <el-dialog :title="'轮巡预案名称'" :visible.sync="patrolTipDialogVisible" :center="false" :show-close="false" :close-on-click-modal="false" :append-to-body="true" width="400px">
      <div style="padding: 20px 0 20px 0; text-align: center; color: #666;">
        <el-progress type="circle" 
          :width="200" 
          :stroke-width="16"
          :percentage="patrolStartPercentage" 
          color="#1073F8"
          status="text">
          <p style="color: #000; text-align: center; font-size: 50px; font-weight: bold;">
            {{Math.ceil(patrolStartSecond / 10)}}
          </p>
          <P style="color: #666; text-align: center; font-size: 16px; padding: 10px 0 0 0;">秒</P>
        </el-progress>
      </div>
      <h3 style="color: #000; text-align: center; font-size: 18px; padding: 0 0 20px 0;">轮巡即将开始</h3>
      <p style="color: #666; text-align: center; font-size: 14px; padding: 0 20px 10px 20px;">打开轮巡后，您可查看固定地方的视频播放画面，还可以关闭轮巡。</p>
      <div slot="footer" class="dialog-footer" style="padding: 0 0 30px 0;">
        <el-button @click="patrolClose(true)">关闭轮巡</el-button>
        <el-button type="primary" @click="patrolStart">执行轮巡</el-button>
      </div>
    </el-dialog>
    <!-- 轮巡暂停提示 dialog -->
    <el-dialog title="是否暂停轮巡？" :visible.sync="patrolParseDialogVisible" :center="false" :append-to-body="true" width="500px">
      <div style="padding: 30px 0 20px 30px; text-align: left; color: #666;">轮巡正在进行中，如需要查看其它通路，请先暂停轮巡。</div>
      <div slot="footer" class="dialog-footer" style="padding: 0 0 20px 0;">
        <el-button @click="patrolParseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="patrolParse">确定暂停轮巡</el-button>
      </div>
    </el-dialog>
    <!-- 轮巡关闭提示 dialog -->
    <el-dialog title="确定关闭轮巡？" :visible.sync="patrolCloseDialogVisible" :center="false" :append-to-body="true" width="500px">
      <div style="padding: 30px 0 20px 30px; text-align: left; color: #666;">关闭轮巡后将不播放该地区的视频。</div>
      <div slot="footer" class="dialog-footer" style="padding: 0 0 20px 0;">
        <el-button @click="patrolCloseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="patrolClose">确定关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {videoTree} from '@/utils/video.tree.js';
import videoEmpty from './videoEmpty.vue';
import flvplayer from '@/components/common/flvplayer.vue';
// import flvplayer from '@/components/common/flvplayer.vue';
import { apiDeviceList, apiVideoRecordList, apiDelVideoRecord, apiDelVideoRecords } from "@/views/index/api/api.video.js";
export default {
  components: {videoEmpty, flvplayer},
  data () {
    return {
      //0 未进行  1进行中  2暂停
      patrolActive: 0, // 轮巡状态
      patrolTipDialogVisible: false,
      patrolParseDialogVisible: false,
      patrolCloseDialogVisible: false,
      patrolStartSecond: 600,
      patrolStartPercentage: 100,
      patrolInval: null,
      // 设备列表
      deviceList: [],

      // {video: {}, title: ''},
      videoList: [{}, {}, {}, {}],
      showVideoTotal: 4,
      bResize: {},
      showMenuActive: false,
      showConTitle: 1,
      searchVal: '',
      dragActiveObj: null,
      dragVideoType: 1,

      videoRecordList: [],

      patrolData: {
        current: {
          id: '111',
          name: '轮巡预案名称111',
          time: 10,
          sum: 4
        },
        next: {
          id: '222',
          name: '轮巡预案名称222',
          startTime: 50,
          time: 12,
          sum: 5
        }
      }
    }
  },
  watch: {
    patrolStartSecond () {
      this.patrolStartPercentage = this.patrolStartSecond / 600 * 100;
    },
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
    let sType = window.localStorage.getItem('vlink_video_patrol_type');
    let sList = window.localStorage.getItem('vlink_video_patrol_list');
    if (sType && sType.length > 0) {
      this.showVideoTotal = Number(sType);
      if (sList && sList.length > 0) {
        this.$nextTick(() => {
          sList = JSON.parse(sList);
          this.videoList = sList;
        });
      }
    } else {
      // 第一次打开
      this.showMenuActive = true;
    }

    // 监控列表
    this.getDeviceList();
  },
  mounted () {
    videoTree('videoListTree');
    $(window).on('unload', this.unloadSave);

    setTimeout(() => {
      this.patrolTipDialogVisible = true;
      this.patrolInval = window.setInterval(() => {
        if (this.patrolStartSecond <= 0) {
          if (this.patrolInval) {
            window.clearInterval(this.patrolInval);
          }
          this.patrolStart();
        } else {
          this.patrolStartSecond = Math.round(this.patrolStartSecond - 1);
        }
      }, 100);
    }, 3 * 1000);
  },
  methods: {
    /* 轮巡控制事件 */
    // 暂停轮巡
    patrolParse () {
      this.patrolParseDialogVisible = false;
      this.patrolActive = 2;
      this.$message('轮巡已暂停。');
    },
    // 继续轮巡
    patrolContinue () {
      this.patrolActive = 1;
      this.$message('轮巡已继续。');
    },
    // 执行轮巡
    patrolStart () {
      this.patrolActive = 1;
      this.patrolTipDialogVisible = false;
      if (this.patrolInval) {
        window.clearInterval(this.patrolInval);
      }
      window.setTimeout(() => {
        this.patrolStartSecond = 600;
      }, 500);
    },
    // 关闭轮巡   flag: true, 轮巡开始提示窗口的事件
    patrolClose (flag) {
      this.patrolParseDialogVisible = false;
      this.patrolCloseDialogVisible = false;
      this.patrolActive = 0;
      this.$message('轮巡已关闭。');
      if (flag) {
        this.patrolTipDialogVisible = false;
        if (this.patrolInval) {
          console.log('this.patrolInval', this.patrolInval);
          window.clearInterval(this.patrolInval);
        }
        window.setTimeout(() => {
          this.patrolStartSecond = 600;
        }, 500);
      }
    },
    dragEndDis () {
      this.patrolParseDialogVisible = true;
    },

    changeShowType (type) {
      if (this.showVideoTotal != type) {
        if (this.patrolActive === 1) {
          this.patrolParseDialogVisible = true;
        } else {
          this.showVideoTotal = type;
        }
      }
    },

    /* 播放记录 */
    getVideoRecordList () {
      // 播放类型 1:视频巡逻 2:视频回放
      apiVideoRecordList({
        playType: 1
      }).then(res => {
        if (res && res.data) {
          this.videoRecordList = res.data;
        }
      }).catch(error => {
        console.log("apiVideoRecordList error：", error);
      });
    },
    delVideoRecord (item) {
      apiDelVideoRecord(item.uid).then(() => {
        this.getVideoRecordList();
        this.$message({
          message: '删除成功！',
          type: 'success'
        });
      }).catch(error => {
        this.$message.error('删除失败！');
        console.log("apiDelVideoRecord error：", error);
      });
    },
    delAllVideoRecords () {
      // apiDelVideoRecords
      this.$confirm('确定删除所有的播放历史吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiDelVideoRecords({playType: 1}).then(() => {
          this.getVideoRecordList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(error => {
          this.$message.error('删除失败！');
          console.log("apiDelVideoRecords error：", error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    /* 监控列表 */
    getDeviceList () {
      // let sui = window.localStorage.getItem('userInfo');
      // if (sui) { sui = JSON.parse(sui); }
      apiDeviceList({
        // id: sui.uid,
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
      window.localStorage.setItem('vlink_video_patrol_type', JSON.stringify(this.showVideoTotal));
      window.localStorage.setItem('vlink_video_patrol_list', JSON.stringify(this.videoList));
    },
    unloadSave () {
      this.saveVideoList();
    },

    // 拖拽开始
    dragStart (ev, item, type) {
      // console.log('drag start', item)
      this.dragActiveObj = item;
      this.dragVideoType = type;
      // 设置属性dataTransfer   两个参数   1：key   2：value
      if (!ev) { ev = window.event; }
      ev.dataTransfer.setData('name', 'ouyang');
    },
    // 拖拽开始
    dragStart2 (ev, item, type) {
      // console.log('drag start', item)
      this.dragActiveObj = Object.assign({}, item, {
        uid: item.deviceUid
      });
      this.dragVideoType = type;
      // 设置属性dataTransfer   两个参数   1：key   2：value
      if (!ev) { ev = window.event; }
      ev.dataTransfer.setData('name', 'ouyang2');
    },
    dragOver () {
      // console.log('drag over')
    },
    dragDrop (item, index) {
      if (this.dragActiveObj) {
        let op = {};
        if (this.dragVideoType === 2) {
          op = {
            startTime: this.dragActiveObj.playBackStartTime,
            endTime: this.dragActiveObj.playBackEndTime,
          }
        }
        this.videoList.splice(index, 1, Object.assign({
          type: this.dragVideoType,
          title: this.dragActiveObj.deviceName,
          video: Object.assign({}, this.dragActiveObj)
        }, op));
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

    showListEvent () {
      this.showMenuActive = true;
      this.showConTitle = 1;
    }
  },
  destroyed () {
    // 播放记录
    /* for (let i = 0; i < this.videoList.length; i++) {
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
    } */
    if (this.patrolInval) {
      window.clearInterval(this.patrolInval);
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
