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
          <div class="show_search_ti" style="padding-left: 20px;">
            <el-select style="width: 190px;" v-model="signer" filterable placeholder="选择标记人" size="small">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="show_search_se">
            <el-input
              class="vl_map_lc_dt_inp"
              size="small"
              placeholder="请输入内容"
              v-model="searchVal">
            </el-input>
            <i class="el-icon-search" @click="searchSubmit"></i>
          </div>
        </div>
        <ul class="sign_content_list">
          <li v-for="(item, index) in signList" :key="'sign_list_' + index" :class="{'sigin_list_dis': item.type === 3}">
            <p :title="item.title">
              <i v-if="item.type === 1">最新</i>
              <i v-if="item.type === 3">已过期</i>
              {{item.content | strCutWithLen(45)}}
            </p>
            <div>{{item.userName}}&nbsp;&nbsp;{{item.time}}<i class="el-icon-delete"></i></div>
          </li>
        </ul>
      </div>
    </div>
    <div class="vid_content">
      <ul class="vid_show_list vid_list_st2">
        <li v-for="item in 4" :key="item">
          <div>
            <video class="com_trans50_lt" src="../../../../assets/video/video.mp4" autoplay loop controls></video>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { apiVideoList } from "@/views/index/api/api.video.js";
import { formatDate } from "@/utils/util.js";
export default {
  data () {
    return {
      searchLoading: false,
      signList: [],
      searchVal: '',
      startTime: new Date(new Date() - 3600 * 1000 * 24 * 7),
      endTime: new Date(),
      signer: '',
      options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }
      ]
    }
  },
  mounted () {
    this.searchSubmit();
  },
  methods: {
    searchSubmit () {
      this.getData();
    },
    getData () {
      this.searchLoading = true;
      apiVideoList({
        startTime: formatDate(this.startTime),
        endTime: formatDate(this.endTime),
        userId: '1'
      }).then(res => {
        if (res && res.data) {
          this.signList = res.data;
        }
        this.searchLoading = false;
      }).catch(error => {
        this.searchLoading = false;
        console.log("apiVideoList error：", error);
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
  width: 100%;  height: 66px;
  padding-top: 15px;
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
  > .show_search_se { margin-bottom: 10px; }
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
  height: 100%; padding-top: 200px;
  > li {
    padding: 15px 10px;
    border-bottom: 1px dotted #ddd;
    > p {
      cursor: pointer;
      > i {
        display: inline-block;
        font-style: normal;
        border: 1px solid #186DFB;
        font-size: 12px;
        border-radius: 2px;
        color: #186DFB;
      }
    }
    > div {
      position: relative;
      height: 20px; line-height: 20px;
      font-size: 12px;
      > i {
        position: absolute; top: 4px; right: 0;
        font-size: 14px;
        cursor: pointer;
      }
    }
    &.sigin_list_dis {
      color: #999;
      > p > i { border-color: #999; color: #999; }
    }
    &:hover {
      color: #186DFB;
    }
  }
}
</style>
