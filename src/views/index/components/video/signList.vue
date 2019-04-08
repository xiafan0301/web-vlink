<template>
  <div class="vl_vid">
    <div class="sign_list">
      <div>
        <div class="show_search">
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
          <div class="show_search_se" style="padding-left: 20px;">
            <el-select style="width: 191px;" v-model="signPeople" filterable placeholder="选择标记人" size="small">
              <el-option
                v-for="item in signPeopleList"
                :key="'people_list_' + item.userId"
                :label="item.userName"
                :value="item.userId">
              </el-option>
            </el-select>
          </div>
          <div class="show_search_se" style="padding-left: 20px;">
            <el-select style="width: 191px;" v-model="signContent" filterable placeholder="选择标记内容" size="small">
              <el-option
                v-for="item in signContentList"
                :key="'content_list_' + item.uid"
                :label="item.content"
                :value="item.uid">
              </el-option>
            </el-select>
          </div>
          <div class="show_search_se" style="text-align: center;padding-right: 10px;">
            <el-button size="small" @click="searchReset">重置</el-button>
            <el-button type="primary" :loading="searchLoading" size="small" @click="searchSubmit">搜索</el-button>
          </div>
        </div>
        <div class="sign_content_list">
          <ul>
            <li v-for="(item, index) in signList" :key="'sign_list_' + index" :class="{'sigin_list_dis': item.type === 3}">
              <!-- 过期 -->
              <div v-if="item.signFlag" class="content_list_dis">
                <h3 :title="item.content" class="com_ellipsis">
                  <span>已过期</span>
                  {{item.content}}
                </h3>
                <p :title="item.deviceName" class="com_ellipsis">
                  <span class="vl_icon vl_icon_v11"></span>
                  {{item.deviceName}}
                </p>
                <div>{{item.userName}}<span>{{item.deviceConstructTime | fmTimestamp}}</span></div>
                <i class="el-icon-delete"></i>
              </div>
              <!-- 播放中 -->
              <div v-else-if="deviceIsPlaying(item)">
                <h3 :title="item.content" class="com_ellipsis">
                  <span>播放中</span>
                  {{item.content}}
                </h3>
                <p :title="item.deviceName" class="com_ellipsis">
                  <span class="vl_icon vl_icon_v11"></span>
                  {{item.deviceName}}
                </p>
                <div>{{item.userName}}<span>{{item.deviceConstructTime | fmTimestamp}}</span></div>
                <i class="el-icon-delete"></i>
              </div>
              <div @dragstart="dragStart($event, item)" @dragend="dragEnd" draggable="true" style="cursor: move;" v-else>
                <h3 :title="item.content" class="com_ellipsis">
                  {{item.content}}
                </h3>
                <p :title="item.deviceName" class="com_ellipsis">
                  <span class="vl_icon vl_icon_v11"></span>
                  {{item.deviceName}}
                </p>
                <div>{{item.userName}}<span>{{item.signTime | fmTimestamp}}</span></div>
                <i class="el-icon-delete"></i>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="vid_content">
      <ul class="vid_show_list vid_list_st2">
        <li v-for="(item, index) in videoList" :key="'video_list_' + index"
          @drop="dragDrop(item, index)" @dragover.prevent="dragOver">
          <div v-if="item && item.video">
            <div is="rtmpplayer" @playerClose="playerClose" :index="index" :oData="item" :signAble="true"></div>
          </div>
          <div class="vid_show_empty" v-else>
            <div is="videoEmpty" :tipMsg="tipMsg"></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { apiVideoList, apiVideoSignPeopleList, apiSignContentList } from "@/views/index/api/api.video.js";
import { formatDate } from "@/utils/util.js";
import videoEmpty from './videoEmpty.vue';
import rtmpplayer from '@/components/common/rtmpplayer.vue';
export default {
  components: {videoEmpty, rtmpplayer},
  data () {
    return {
      tipMsg: '暂无视频播放，在标记列表选择视频进行查看',
      dragActiveObj: null,
      videoList: [null, null, null, null],

      searchLoading: false,
      signList: [],
      searchVal: '',
      startTime: new Date(new Date() - 3600 * 1000 * 24 * 7),
      endTime: new Date(),
      signPeople: '',
      signContent: '',
      signPeopleList: [],
      signContentList: []
    }
  },
  mounted () {
    this.searchSubmit();
    this.getSignPeopleList();
    this.getSignContent();
  },
  methods: {
    /**
     * 关闭播放器
     * @param {string} sid 视频ID
     */
    playerClose (iIndex, sid) {
      this.videoList.splice(iIndex, 1, {});
    },
    deviceIsPlaying (item) {
      let flag = false;
      for (let i = 0; i < this.videoList.length; i++) {
        if (this.videoList[i] && this.videoList[i].video && this.videoList[i].video.id === item.id) {
          flag = true;
          break;
        }
      }
      return flag;
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
    },
    dragDrop (item, index) {
      if (this.dragActiveObj) {
        let deviceSip = Math.random() > 0.5 ? 'rtmp://live.hkstv.hk.lxdns.com/live/hks1' : 'rtmp://10.16.1.139/live/livestream';
        console.log('deviceSip', deviceSip);
        this.videoList.splice(index, 1, {
          title: this.dragActiveObj.deviceName,
          video: Object.assign({}, this.dragActiveObj, {
            uid: this.dragActiveObj.deviceUid,
            deviceSip: deviceSip
          })
        });
      }
    },
    dragEnd () {
      // console.log('drag end')
      this.dragActiveObj = null;
    },

    searchReset () {
      this.startTime = new Date(new Date() - 3600 * 1000 * 24 * 7);
      this.endTime = new Date();
      this.signPeople = '';
      this.signContent = '';
    },
    searchSubmit () {
      this.getData();
    },
    getData () {
      this.searchLoading = true;
      apiVideoList({
        'where.startTime': formatDate(this.startTime),
        'where.endTime': formatDate(this.endTime),
        'where.userId': this.signPeople,
        'where.contentId': this.signContent,
        pageNum: 1,
        pageSize: 50
      }).then(res => {
        if (res && res.data) {
          this.signList = res.data;
        }
        this.searchLoading = false;
      }).catch(error => {
        this.searchLoading = false;
        console.log("apiVideoList error：", error);
      });
    },
    getSignPeopleList () {
      apiVideoSignPeopleList().then(res => {
        if (res && res.data) {
          this.signPeopleList = res.data;
        }
      }).catch(error => {
        console.log("apiVideoSignPeopleList error：", error);
      });
    },
    getSignContent () {
      apiSignContentList({}).then(res => {
        if (res && res.data) {
          this.signContentList = res.data;
        }
      }).catch(error => {
        console.log("apiSignContentList error：", error);
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.vl_vid {
  height: 100%;
  position: relative;
  > .sign_list {
    position: absolute; top: 0; left: 20px;
    width: 230px; height: 100%;
    padding: 20px 0;
    > div {
      width: 100%; height: 100%;
      background: #fff;
      box-shadow: 4px 0px 10px 0px rgba(131,131,131,0.28);
    }
  }
  > .vid_content {
    height: 100%;
    overflow: hidden;
    padding-left: 250px;
  }
}
.show_search {
  position: absolute; top: 24px; left: 0;
  width: 100%;
  padding-top: 15px; padding-bottom: 5px;
  border-bottom: 1px solid #f6f6f6;
  > div {
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
  }
  > .show_search_se { margin-bottom: 5px; }
  > .show_search_ti {
    position: relative;
    padding-left: 36px;
    margin-bottom: 10px;
    > span {
      position: absolute; top: 2px; left: 17px;
      width: 18px;
      color: #666; font-size: 12px;
    }
  }
}
.sign_content_list {
  height: 100%; padding-top: 240px;
  > ul {
    height: 100%;
    overflow: auto;
    > li {
      padding: 10px 10px 10px 15px;
      border-bottom: 1px dotted #ddd;
      > div {
        position: relative;
        > .el-icon-delete {
          position: absolute; top: 50%; right: 10px;
          margin-top: -10px;
          font-size: 16px;
          cursor: pointer;
        }
        > h3 {
          height: 24px; line-height: 24px;
          margin-right: 20px;
          > span {
            display: inline-block;
            font-style: normal; font-size: 12px; color: #186DFB;
            border: 1px solid #186DFB;
            line-height: normal;
            padding: 0 2px;
            border-radius: 2px;
          }
        }
        > p {
          position: relative;
          height: 22px; line-height: 22px;
          margin-right: 20px; padding-left: 20px;
          color: #999; font-size: 12px;
          > span {
            position: absolute; top: 0px; left: 0;
          }
        }
        > div {
          color: #999; font-size: 12px;
          overflow: hidden;
          > span { float: right; padding-right: 10px; }
        }
        &.sigin_list_dis {
          color: #999;
          > p > i { border-color: #999; color: #999; }
        }
        &:hover {
          color: #186DFB;
        }
        &.content_list_dis {
          > h3 {
            color: #999;
            > span {
              color: #999;
              border: 1px solid #999;
            }
          }
        }
      }
    }
  }
}
</style>
