<template>
  <div class="vl_vid">
    <div class="sign_list">
      <div>
        <div class="show_search">
          <div class="show_search_ti">
            <span>开始</span>
            <el-date-picker
              class="vl_vid_sdater"
              style="width: 175px"
              size="small"
              v-model="startTime"
              type="datetime"
              time-arrow-control
              :editable="false" :clearable="false"
              :picker-options="startTimeOptions"
              placeholder="选择开始时间">
            </el-date-picker>
          </div>
          <div class="show_search_ti">
            <span>结束</span>
            <el-date-picker
              class="vl_vid_sdater"
              style="width: 175px"
              size="small"
              v-model="endTime"
              type="datetime"
              time-arrow-control
              :editable="false" :clearable="false"
              :picker-options="endTimeOptions"
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
          <ul v-if="signList && signList.length > 0">
            <li v-for="(item, index) in signList" :key="'sign_list_' + index"
              :class="{'sigin_list_dis': item.type === 3, 'content_list_del_atv': item.id === delSignActive.id}">
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
                <div>{{item.userName}}<span>{{item.signTime | fmTimestamp}}</span></div>
                <i v-if="item.userId === userId" class="el-icon-delete" @click="delSign(item)"></i>
              </div>
              <!-- 播放中 -->
              <div v-else-if="deviceIsPlaying(item)" class="content_list_dis" draggable="false">
                <h3 :title="item.content" class="com_ellipsis">
                  {{item.content}}
                </h3>
                <p :title="item.deviceName" class="com_ellipsis">
                  <span class="vl_icon vl_icon_v11"></span>
                  {{item.deviceName}}
                </p>
                <div>{{item.userName}}<span>{{item.signTime | fmTimestamp('yyyy-MM-dd HH:mm')}}</span></div>
                <!-- <i class="el-icon-delete" style="cursor: not-allowed; " title="播放中，无法删除"></i> -->
              </div>
              <div class="content_list_able" @dragstart="dragStart($event, item)" @dragend="dragEnd" draggable="true" style="cursor: move;" v-else>
                <h3 :title="item.content" class="com_ellipsis">
                  {{item.content}}
                </h3>
                <p :title="item.deviceName" class="com_ellipsis">
                  <span class="vl_icon vl_icon_v11"></span>
                  {{item.deviceName}}
                </p>
                <div>{{item.userName}}<span>{{item.signTime | fmTimestamp('yyyy-MM-dd HH:mm')}}</span></div>
                <i v-if="item.userId === userId" class="el-icon-delete" @click="delSign(item)"></i>
              </div>
            </li>
          </ul>
          <div class="sign_content_list_empty" v-else>
            暂无
          </div>
          <div class="sign_content_pager">
            <el-pagination
              :small="true"
              :background="false"
              :pager-count="5"
              layout="pager"
              @current-change="handleCurrentChange"
              :current-page="pagination.currentPage"
              :page-size="pagination.pageSize"
              :total="pagination.total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="vid_content">
      <ul class="vid_show_list vid_list_st2">
        <li v-for="(item, index) in videoList" :key="'video_list_' + index"
          @drop="dragDrop(item, index)" @dragover.prevent="dragOver">
          <div v-if="item && item.video">
            <div is="flvplayer" @playerClose="playerClose" :index="index" :oData="item"
              :oConfig="{signEmit: true}" @signEmit="signEmit"></div>
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
import { apiVideoList, apiVideoSignPeopleList, apiSignContentList, apiVideoSignDel } from "@/views/index/api/api.video.js";
import { formatDate, dateOrigin } from "@/utils/util.js";
import videoEmpty from './videoEmpty.vue';
import flvplayer from '@/components/common/flvplayer.vue';
export default {
  components: {videoEmpty, flvplayer},
  data () {
    return {
      userId: '',

      tipMsg: '暂无视频播放，在标记列表选择视频进行查看',
      dragActiveObj: null,
      videoList: [null, null, null, null],

      searchLoading: false,
      signList: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      searchVal: '',
      startTime: new Date(dateOrigin().getTime() - 3600 * 1000 * 24 * 6),
      endTime: dateOrigin(true),
      signPeople: '',
      signContent: '',
      signPeopleList: [],
      signContentList: [],

      delSignActive: {},

      startTimeOptions: {
        disabledDate: (d) => {
          // d > new Date() || d > this.endTime
          if (d > new Date() || d > this.endTime) {
            return true;
          } else {
            return false;
          }
        }
      },
      endTimeOptions: {
        disabledDate: (d) => {
          if (d > new Date() || d < this.startTime) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  },
  created () {
    this.userId = this.$store.state.loginUser.uid;
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
    playerClose (iIndex) {
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
        let _endTime = this.dragActiveObj.signTime + 1000 * 60 * 60 * 24;
        if (_endTime > new Date().getTime()) {
          _endTime = new Date().getTime();
        }
        this.videoList.splice(index, 1, {
          type: 2, // 标记，暂定为回放
          title: this.dragActiveObj.deviceName,
          startTime: this.dragActiveObj.signTime,
          endTime: _endTime,
          video: Object.assign({}, this.dragActiveObj, {
            uid: this.dragActiveObj.deviceUid
          })
        });
      }
    },
    dragEnd () {
      // console.log('drag end')
      this.dragActiveObj = null;
    },

    searchReset () {
      this.startTime = new Date(dateOrigin().getTime() - 3600 * 1000 * 24 * 6);
      this.endTime = dateOrigin(true);
      this.signPeople = '';
      this.signContent = '';
      this.searchSubmit();
    },
    searchSubmit () {
      this.getData();
    },
    getData () {
      this.searchLoading = true;
      this.delSignActive = {};
      apiVideoList({
        'where.startTime': formatDate(this.startTime),
        'where.endTime': formatDate(this.endTime),
        'where.userId': this.signPeople,
        'where.contentId': this.signContent,
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }).then(res => {
        if (res && res.data) {
          this.pagination.total = res.data.total;
          this.signList = res.data.list;
        }
        this.searchLoading = false;
      }).catch(error => {
        this.searchLoading = false;
        console.log("apiVideoList error：", error);
      });
    },
    handleCurrentChange (val) {
      this.pagination.currentPage = val;
      this.searchSubmit();
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
    },
    delSign (item) {
      this.delSignActive = item;
      this.$msgbox({
        title: '提示',
        message: '确定删除该视频标记吗？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            apiVideoSignDel(item.id).then((res) => {
              if (res) {
                this.searchSubmit();
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
              }
              this.delSignActive = {};
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }).catch(error => {
              console.log("apiVideoSignDel error：", error);
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            });
          } else {
            done();
            this.delSignActive = {};
          }
        }
      }).then(action => {
      });
    },
    signEmit () {
      console.log('标记成功');
      this.searchSubmit();
    }
  }
}
</script>
<style lang="scss" scoped>
.vl_vid {
  height: 100%;
  position: relative;
  > .sign_list {
    position: absolute; top: 0; left: 10px;
    width: 230px; height: 100%;
    padding: 10px 0;
    > div {
      width: 100%; height: 100%;
      background: #fff;
      box-shadow: 4px 0px 10px 0px rgba(131,131,131,0.28);
    }
  }
  > .vid_content {
    height: 100%;
    overflow: hidden;
    padding-left: 240px;
  }
}
.show_search {
  position: absolute; top: 24px; left: 0; z-index: 2;
  width: 100%;
  padding-top: 15px; padding-bottom: 5px;
  border-bottom: 1px solid #f0f0f0;
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
  position: relative;
  height: 100%; padding-top: 240px; padding-bottom: 30px;
  > ul {
    height: 100%;
    overflow: auto;
    > li {
      padding: 10px 10px 10px 15px;
      border-bottom: 1px dotted #ddd;
      > div {
        position: relative;
        > .el-icon-delete {
          display: none;
          position: absolute; bottom: 1px; right: 0px;
          font-size: 16px;
          cursor: pointer;
          &:hover { color: #186DFB; }
        }
        > h3 {
          height: 24px; line-height: 24px;
          margin-right: 10px;
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
          margin-right: 10px; padding-left: 20px;
          color: #999; font-size: 12px;
          > span {
            position: absolute; top: 0px; left: 0;
          }
        }
        > div {
          color: #999; font-size: 12px;
          overflow: hidden;
          > span { float: right; padding-right: 25px; }
        }
        &.sigin_list_dis {
          color: #999;
          > p > i { border-color: #999; color: #999; }
        }
        &.content_list_able:hover {
          color: #186DFB;
          > p { color: #186DFB; }
          > div { color: #186DFB; }
        }
        &:hover {
          > .el-icon-delete { display: block; }
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
  .sign_content_pager {
    position: absolute; bottom: 0; left: 0;
    width: 100%; height: 30px;
    padding-top: 2px;
    text-align: center;
    border-top: 1px solid #eee;
  }
}
.sign_content_list_empty {
  color: #999;
  text-align: center;
  padding: 20px 20px 0 0;
}
.content_list_able:hover .vl_icon_v11 {
  background-position: -323px -350px;
}
.content_list_del_atv {
  background-color: #E0F3FF;
}
</style>
