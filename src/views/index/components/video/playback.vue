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
              <div class="show_search_se">
                <el-input
                  class="vl_map_lc_dt_inp"
                  size="small"
                  placeholder="请输入内容"
                  v-model="searchVal">
                </el-input>
                <i class="el-icon-search"></i>
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
                  v-model="startTime"
                  type="datetime"
                  placeholder="选择结束时间">
                </el-date-picker>
              </div>
            </div>
            <div class="show_list">
              <ul class="show_list_c show_tree" id="videoListTree">
                <li v-for="(item, index) in treeData" :key="'tree_' + index">
                  <div>
                    <div class="tree_title">
                      <i class="show_list_pi el-icon-arrow-right"></i>{{item.name}}
                    </div>
                  </div>
                  <ul class="tree_sli" v-if="item.children && item.children.length > 0">
                    <li class="com_ellipsis" v-for="(sitem, sindex) in item.children" :title="sitem.name" :key="'tree_s_' + sindex">{{sitem.name}}</li>
                  </ul>
                  <ul class="tree_sli" v-else>
                    <li class="tree_sli_empty">暂无</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div class="show_content" v-show="showConTitle === 2">
            <div class="show_his_btn" v-if="historyData && historyData.length > 0">清空记录</div>
            <ul class="show_his">
              <li v-for="(item, index) in historyData" :key="'hty_' + index">
                <h3 class="com_ellipsis">{{item.name}}</h3>
                <p>{{item.time}}</p>
                <i class="el-icon-delete"></i>
              </li>
            </ul>
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
        <li class="vl_icon vl_icon_065" :class="{'vl_icon_sed': showType === 5}" @click="showType = 5"></li>
      </ul>
    </div>
    <div class="vid_opes">
      <el-button type="primary">暂停轮巡</el-button>
      <el-button>关闭轮巡</el-button>
    </div>
    <div class="vid_content">
      <ul class="vid_show_list" :class="'vid_list_st' + showType">
        <li v-for="item in showVideoTotal" :key="'video_list_' + item">
          <div v-if="videoList && videoList[item - 1] && videoList[item - 1].video">
            <video class="com_trans50_lt" src="../../../../assets/video/video.mp4" autoplay loop controls></video>
          </div>
          <div class="vid_show_empty" v-else>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import {videoTree} from '@/utils/video.tree.js';
export default {
  data () {
    return {
      videoList: [
        {video: {}, title: ''},
        {video: {}, title: ''},
        {video: {}, title: ''},
        {video: {}, title: ''},
        {video: {}, title: ''},
        {video: {}, title: ''},
        {video: {}, title: ''},
        {video: {}, title: ''},
        {video: {}, title: ''},
        {video: {}, title: ''},
        {video: {}, title: ''},
      ],
      showType: 2,
      showVideoTotal: 4,
      showMenuActive: false,
      showConTitle: 1,
      searchVal: '',
      startTime: '',
      endTime: '',
      treeData: [
        {
          name: '公安专网',
          children: [{name: '摄像头001'}, {name: '摄像头002'}, {name: '摄像头003'}]
        }, {
          name: '教育专网',
          children: [{name: '摄像头011'}, {name: '摄像头012'}, {name: '摄像头013'}]
        }, {
          name: '医疗专网',
          children: []
        }, {
          name: '企业专网',
          children: [{name: '摄像头031'}, {name: '摄像头032'}, {name: '摄像头033'}]
        }
      ],
      historyData: [
        { name: '广发路广发银行-001', time: '2019-01-17 13:28:02' },
        { name: '广发路广发银行-002', time: '2019-01-17 13:28:02' },
        { name: '广发路广发银行-003', time: '2019-01-17 13:28:02' },
        { name: '广发路广发银行-004', time: '2019-01-17 13:28:02' },
        { name: '广发路广发银行-005', time: '2019-01-17 13:28:02' }
      ]
    }
  },
  watch: {
    showType () {
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
    }
  },
  mounted () {
    videoTree('videoListTree');
  },
  methods: {
  },
  destroyed () {
  }
}
</script>
<style>
  .show_search_ti .el-input--suffix .el-input__inner {
    padding-right: 0;
  }
</style>
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
.show_list {
  padding-top: 160px !important;
}
</style>