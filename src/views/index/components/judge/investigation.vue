<template>
  <div class="vl_judge_tc">
    <div class="vl_j_left">
      <div class="vl_jtc_search" style="padding-top: 0;">
        <el-autocomplete
          v-model="searchData.eventNo"
          :fetch-suggestions="autoEvent"
          @select="showChoose"
          value-key="eventDetail"
          placeholder="关联事件编号搜索">
        </el-autocomplete>
        <el-date-picker
          v-model="searchData.time"
          type="daterange"
          range-separator="-"
          value-format="yyyy-MM-dd"
          format="yy/MM/dd"
          :picker-options="pickerOptions"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-input v-model="searchData.carNum" placeholder="选择范围"></el-input>
        <el-button  @click="resetSearch">重置</el-button>
        <el-button  :loading="searching" :disabled="!curEvent" type="primary" @click="beginSearch">搜索</el-button>
      </div>
    </div>
    <div class="vl_j_right">
      <div id="tcMap"></div>
      <div class="vl_jfo_right" v-show="showVideoList">
        <div class="vl_jig_right_title">
          <span>{{curSXT.deviceName}}</span>
          <span>抓拍{{curSXT.snapNum}}次</span>
        </div>
        <vue-scroll>
          <div class="vl_jtc_mk" v-for="(item, index) in curVideo.videoList" :key="item.id">
            <video :id="'vlJigVideo' + index" src="../../../../assets/video/demo.mp4"></video>
            <p>{{item.snapTime}}</p>
            <div class="vl_jig_right_btn">
              <span class="vl_icon vl_icon_judge_01" @click="playVideo(index)" v-if="item.playing"></span>
              <span class="vl_icon vl_icon_control_09" @click="playVideo(index)" v-else></span>
              <span class="vl_icon vl_icon_control_08" @click="largeVideo(index)"></span>
            </div>
          </div>
        </vue-scroll>
        <div class="vl_jig_right_close"><i class="el-icon-error" @click="hideVideoList"></i></div>
      </div>
    </div>
    <div style="width: 0; height: 0;" v-show="showLarge" :class="{vl_j_fullscreen: showLarge}">
      <video id="vlJigLargeV" src="../../../../assets/video/demo.mp4"></video>
      <div @click="closeVideo" class="close_btn el-icon-error"></div>
      <div class="control_bottom">
        <div>{{curSXT.deviceName}}</div>
        <div>
          <span @click="pauseLargeVideo" class="vl_icon vl_icon_judge_01" v-if="curVideo.playing"></span>
          <span @click="playLargeVideo" class="vl_icon vl_icon_control_09" v-else></span>
          <span><a download="视频" :href="curVideoUrl" class="el-icon-download"></a></span>
          <span @click="cutScreen" class="vl_icon vl_icon_control_07"></span>
        </div>
      </div>
    </div>
    <div style="width: 0; height: 0;" v-show="showCut"  :class="{vl_j_cutscreen: showCut}">
      <img :src="demoImg" alt="">
      <i @click="showCut = false" class="close_btn el-icon-error"></i>
      <a download="截图" :href="demoImg" id="vlJidDownloadImg" ></a>
    </div>
  </div>
</template>
<script>
let AMap = window.AMap;
import {testData} from './testData';
import {JigGETEvent, JigGETEventAlarm, JigGETAlarmSnapList} from '../../api/api';
export default {
  data() {
    return {
      testData: testData,
      evData: [],
      searchData: {
        eventNo: '',
        time: null
      },
      pickerOptions: {
        disabledDate (time) {
          let date = new Date();
          let y = date.getFullYear();
          let m = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
          let d = date.getDate();
          let threeMonths = '';
          let start = '';
          if (parseFloat(m) >= 4) {
            start = y + '-' + (m - 3) + '-' + d;
          } else {
            start = (y - 1) + '-' + (m - 3 + 12) + '-' + d;
          }
          threeMonths = new Date(start).getTime();
          return time.getTime() > Date.now() || time.getTime() < threeMonths;
        }
      },
      amap: null, // 地图实例
      curVideo: {
        id: '',
        indexNum: null, // 当前展示的摄像头索引
        playNum: null, // 当前摄像头里正在大屏播放的索引
        playing: false,
        videoList: []
      }, // 当前被放大播放的video
      curEvent: null,
      searching: false,
      showVideoList: false,
      curSXT: {
        deviceName: '',
        snapNum: ''
      }, // 显示的摄像头数据
      showLarge: false,
      showCut: false,
      curVideoUrl: '',
      demoImg: ''
    }
  },
  mounted () {
    this.setDTime();
    let map = new AMap.Map('tcMap', {
      center: [112.974691, 28.093846],
      zoom: 16
    });
    map.setMapStyle('amap://styles/whitesmoke');
    this.amap = map;
  },
  methods: {
    setDTime () {
      let date = new Date();
      let curDate = date.getTime();
      let curS = 15 * 24 * 3600 * 1000;
      let _s = new Date(curDate - curS).getFullYear() + '-' + (new Date(curDate - curS).getMonth() + 1) + '-' + new Date(curDate - curS).getDate();
      let _e = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      this.searchData.time = [_s, _e]
    },
    resetSearch () {
      this.searchData.eventNo = '';
    },
    autoEvent (queryString, cb) {
      if (queryString === '') {
        cb([])
      } else {
        JigGETEvent({'where.otherQuery': queryString, 'where.eventFlag': 1}).then(result => {
          cb(result.data.list);
        })
      }
    },
    showChoose (e) {
      this.curEvent = e;
    },
    beginSearch () {
      this.searching = true;
      let params = {
        eventId: this.curEvent.eventId,
        // eventId: 103,
        dateStart: this.searchData.time[0],
        dateEnd: this.searchData.time[1]
      }
      JigGETEventAlarm(params)
        .then(res => {
          if (res) {
            this.searching = false;
            this.evData = res.data.map(x => {
              x.checked = false;
              return x;
            });
            this.amap.clearMap();
            this.drawMarkers(this.evData);
          }
        })
    },
    drawMarkers (data) {
      for (let  i = 0; i < data.length; i++) {
        let obj = data[i];
        let _idWin = 'vlJigImg' + i;
        if (obj.addLongitude > 0 && obj.addLatitude > 0) {
          let _sContent = `<div id="${_idWin}" class="vl_jig_mk_img"><img src="${obj.snapPhoto}"><div><p>${obj.deviceName}</p><p>抓拍${obj.snapNum}次</p></div></div>`;
          // 窗体
          new AMap.Marker({ // 添加自定义点标记
            map: this.amap,
            position: [obj.addLongitude, obj.addLatitude], // 基点位置 [116.397428, 39.90923]
            offset: new AMap.Pixel(-50, -144), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: _sContent
          });
          // 摄像头
          let _id = 'vlJigSxt' + i;
          let _content = '<div id=' + _id + ' class="vl_icon vl_jfo_sxt vl_icon_judge_04"></div>'
          new AMap.Marker({ // 添加自定义点标记
            map: this.amap,
            position: [obj.addLongitude, obj.addLatitude], // 基点位置 [116.397428, 39.90923]
            offset: new AMap.Pixel(-28.5, -50), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: _content
          });
          setTimeout(() => {
            this.addListen($('#' + _id), 'mouseover', i);
            this.addListen($('#' + _id), 'mouseout', i, obj);
            this.addListen($('#' + _id), 'click', i, obj);
          }, 300)
        }
      }
      this.amap.setFitView();
    },
    addListen (el, evType,key ,obj = {}) {
      let self = this;
      let _key;
      el.bind(evType, function () {
        switch (evType) {
          case 'mouseover':
            $('#vlJigImg' + key).addClass('vl_jig_mk_img_hover')
            $('#vlJigSxt' + key).addClass('vl_icon_judge_02')
            break;
          case 'mouseout':
            if (!obj.checked) {
              $('#vlJigImg' + key).removeClass('vl_jig_mk_img_hover')
              $('#vlJigSxt' + key).removeClass('vl_icon_judge_02')
            }
            break;
          case 'click':
            _key  = self.curVideo.indexNum;
            self.evData.forEach(z => {
              z.checked = false;
            })
            obj.checked = true;
            if (_key !== null) {
              $('#vlJigImg' + _key).removeClass('vl_jig_mk_img_hover')
              $('#vlJigSxt' + _key).removeClass('vl_icon_judge_02')
            }
            $('#vlJigImg' + key).addClass('vl_jig_mk_img_hover')
            $('#vlJigSxt' + key).addClass('vl_icon_judge_02')
            self.showVideo(obj);
            break;
        }
      })
    },
    showVideo (data) {
      this.curVideo.indexNum = this.evData.indexOf(data);
      this.curSXT = data;
      this.showVideoList = true;
      const params = {
        surveillanceId: this.curSXT.surveillanceId,
        deviceId: this.curSXT.deviceId
      }
      this.$_showLoading({target: '.__vuescroll'});
      JigGETAlarmSnapList(params)
        .then(res => {
          if (res) {
            this.curVideo.videoList = res.data.map(x => {
              x.playing = false;
              return x;
            });
            this.$_hideLoading();
          }
        })
    },
    hideVideoList () {
      this.evData.forEach(x => x.checked = false);
      const _key = this.curVideo.indexNum;
      $('#vlJigImg' + _key).removeClass('vl_jig_mk_img_hover')
      $('#vlJigSxt' + _key).removeClass('vl_icon_judge_02')
      this.curVideo.indexNum = null;
      this.showVideoList = false;
    },
    playVideo (_i) {
      let vDom = document.getElementById('vlJigVideo' + _i);
      if (this.curVideo.videoList[_i].playing) {
        vDom.pause();
      } else {
        vDom.play();
        vDom.addEventListener('ended', (e) => {
          e.target.currentTime = 0;
          vDom.pause();
          this.curVideo.videoList[_i].playing = false;
        })
      }
      this.curVideo.videoList[_i].playing = !this.curVideo.videoList[_i].playing;
    },
    largeVideo (_i) {
      let vDom = document.getElementById('vlJigVideo' + _i);
      vDom.pause();
      this.curVideo.id = 'vlJigVideo' + _i;
      this.curVideo.playing = this.curVideo.videoList[_i].playing;
      this.curVideo.playNum = _i;
      this.showLarge = true;
      if (this.curVideo.videoList[_i].playing) {
        document.getElementById('vlJigLargeV').play();
      }
      document.getElementById('vlJigLargeV').addEventListener('ended', (e) => {
        e.target.currentTime = 0;
        vDom.currentTime = 0;
        document.getElementById('vlJigLargeV').pause();
        this.curVideo.videoList[_i].playing = false;
        this.showLarge = false;
      })
      document.getElementById('vlJigLargeV').currentTime = vDom.currentTime;
      this.curVideoUrl = vDom.src;
    },
    closeVideo () {
      let vDom = document.getElementById(this.curVideo.id);
      document.getElementById('vlJigLargeV').pause();
      vDom.currentTime = document.getElementById('vlJigLargeV').currentTime;
      this.showLarge = false;
      if (this.curVideo.playing) {
        this.curVideo.videoList[this.curVideo.playNum].playing = true;
        vDom.play();
      }
    },
    pauseLargeVideo () {
      this.curVideo.playing = false;
      this.curVideo.videoList[this.curVideo.playNum].playing = false;
      document.getElementById('vlJigLargeV').pause();
    } ,
    playLargeVideo () {
      this.curVideo.playing = true;
      document.getElementById('vlJigLargeV').play();
    },
    cutScreen () {
      this.showCut = true;
      let _canvas = document.createElement('canvas');
      _canvas.setAttribute('width', document.documentElement.clientWidth);
      _canvas.setAttribute('height', document.documentElement.clientHeight);
      let cxt = _canvas.getContext('2d');
      cxt.drawImage(document.getElementById('vlJigLargeV'), 0, 0, _canvas.width, _canvas.height);
      this.demoImg = _canvas.toDataURL();
      setTimeout(() => {
        document.getElementById('vlJidDownloadImg').click();
      }, 200)
    }
  },
  watch: {}
}
</script>
<style lang="scss">
  .vl_jfo_right {
    position: absolute;
    right: .2rem;
    top: 0;
    width: 2.6rem;
    height: 100%;
    padding: .3rem .2rem .2rem .2rem;
    box-shadow: 0px 10px 12px 0px rgba(4,24,54,0.2);
    background: #ffffff;
    animation: fadeInRight .4s ease-out .4s both;
    &:hover {
      .vl_jig_right_close {
        display: block;
      }
    }
    .vl_jig_right_title {
      position: absolute;
      top: 0;
      width: 2.2rem;
      height: .3rem;
      padding-top: .1rem;
      text-align: left;
      span {
        display: inline-block;
        width: 50%;
        font-size: .14rem;
        color: #333333;
        white-space: nowrap;
        overflow: hidden;
        &:last-child {
          text-align: right;
          color: #999999;
        }
      }
    }
    .vl_jtc_mk {
      margin-top: .2rem;
      .vl_jig_right_btn {
        position: absolute;
        bottom: 0;
        right: 0;
        height: 28px;
        padding-top: 2px;
        span {
          cursor: pointer;
        }
      }
    }
    .vl_jig_right_close {
      display: none;
      position: absolute;
      width: .28rem;
      height: .5rem;
      line-height: .5rem;
      text-align: center;
      background: #FFFFFF;
      top: 50%;
      right: 100%;
      -webkit-border-radius: .14rem 0 0 .14rem;
      -moz-border-radius: .14rem 0 0 .14rem;
      border-radius: .14rem 0 0 .14rem;
      animation: fadeInRight .2s ease-out .2s both;
      > i {
        cursor: pointer;
        &:hover {
          color: #409EFF;
        }
      }
    }
  }
</style>