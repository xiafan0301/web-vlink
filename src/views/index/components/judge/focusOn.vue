<template>
  <div class="vl_judge_tc">
    <div class="vl_j_left">
      <div class="vl_jtc_search" style="padding-top: 0;">
        <el-select v-model="searchData.type" @change="chooseType" placeholder="关注类型">
          <el-option
            v-for="item in focusType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div v-if="searchData.type !== 1" style="margin-bottom: 0;">
          <el-select v-model="searchData.vehicleGroupId" @change="chooseType" placeholder="选择车辆组">
            <el-option
              v-for="item in vehicleGroupList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="searchData.vehicleColor" @change="chooseType" placeholder="选择车辆颜色">
            <el-option
              v-for="item in vehicleColorList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="searchData.plateType" @change="chooseType" placeholder="选择号牌种类">
            <el-option
              v-for="item in plateTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div v-if="searchData.type !== 2" style="margin-bottom: 0;">
          <el-select v-model="searchData.portraitGroupId" @change="chooseType" placeholder="选择人员组">
            <el-option
              v-for="item in portraitGroupList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="searchData.sex" @change="chooseType" placeholder="选择性别">
            <el-option
              v-for="item in sexList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="searchData.ageGroup" @change="chooseType" placeholder="选择年龄段">
            <el-option
              v-for="item in ageGroupList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
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
        <el-input v-model="searchData.carNum" placeholder="关注范围"></el-input>
        <el-button  @click="resetSearch">重置</el-button>
        <el-button   :loading="searching" type="primary" @click="beginSearch">搜索</el-button>
      </div>
    </div>
    <div class="vl_j_right">
      <div id="tcMap"></div>
      <div class="vl_jfo_switch">
        <div><span :class="{'active': switchType === 0}" @click="switchType = 0">活动范围</span></div>
        <div><span :class="{'active': switchType === 1}" @click="switchType = 1;">关联事件</span></div>
      </div>
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
      <div class="vl_jig_event" v-show="switchType === 1">
        <div class="vl_jfo_event_box se_hi_box">
          <vue-scroll>
            <el-table
              :data="eventList"
              style="width: 100%">
              <el-table-column
                label="布控图片"
                align="center"
                min-width="120">
                <template slot-scope="scope">
                  <div class="tt_img">
                    <img :src="scope.row.surveillancePhoto" alt="" >
                    <span>{{scope.row.surveillancePhotoNum}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="eventNumber"
                label="事件编号"
                align="left"
                min-width="140">
              </el-table-column>
              <el-table-column
                min-width="150"
                label="事件内容">
                <template slot-scope="scope">
                  {{scope.row.describe.length > 28 ? (scope.row.describe.slice(0, 28) + '...') : scope.row.describe}}
                </template>
              </el-table-column>
              <el-table-column
                prop="departmentName"
                label="处理单位"
                min-width="80">
              </el-table-column>
              <el-table-column
                label="上报时间"
                min-width="120">
                <template slot-scope="scope">
                  {{scope.row.createTime.split(' ')[0]}}
                </template>
              </el-table-column>
              <el-table-column
                min-width="150"
                label="发生地点">
                <template slot-scope="scope">
                  {{scope.row.address.length > 28 ? (scope.row.address.slice(0, 28) + '...') : scope.row.address}}
                </template>
              </el-table-column>
              <el-table-column
                prop="processStatus"
                label="处理状态"
                min-width="100">
              </el-table-column>
              <el-table-column
                label="操作"
                min-width="100">
                <template slot-scope="scope">
                  <el-button type="text">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              v-show="pagination.total > 6"
              class="se_hi_pa"
              background
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
              :current-page="pagination.currentPage"
              :page-size="pagination.pageSize"
              :total="pagination.total">
            </el-pagination>
          </vue-scroll>
        </div>
      </div>
    </div>
    <div style="width: 0; height: 0;" v-show="showLarge" :class="{vl_j_fullscreen: showLarge}">
      <video id="vlJfoLargeV" src="../../../../assets/video/demo.mp4"></video>
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
import {JfoGETSurveillanceObject, JigGETAlarmSnapList, JfoGETEventList} from '../../api/api.js';
export default {
  data() {
    return {
      pagination: {
        currentPage: 1,
        pageSize: 6,
        total: 0
      },
      testData: testData,
      evData: [],
      searchData: {
        type: null, // 1：人， 2： 车,0 无限
        portraitGroupId: null,  // 人员组
        sex: null, // 1男，2女
        ageGroup: null, // 年龄段
        vehicleGroupId: null, // 车辆组
        vehicleColor: null,
        plateType: null, // 车牌种类
        time: null
      },
      sexList: [
        {value: 0, label: '不限'},
        {value: 1, label: '男'},
        {value: 2, label: '女'}
      ],
      portraitGroupList: [],
      vehicleGroupList: [],
      focusType: [
        {value: 0, label: '不限'},
        {value: 1, label: '布控人员'},
        {value: 2, label: '布控车辆'}
      ],
      ageGroupList: [
        {value: 0, label: '不限'},
        {value: 1, label: '0-10'},
        {value: 2, label: '10-20'},
        {value: 3, label: '20-30'},
        {value: 4, label: '30-40'},
        {value: 5, label: '40-50'},
        {value: 6, label: '50-70'},
        {value: 7, label: '70-'}
      ],
      vehicleColorList: [
        {value: 0, label: '不限'},
        {value: 1, label: '白'},
        {value: 2, label: '灰'},
        {value: 3, label: '黄'},
        {value: 4, label: '粉'},
        {value: 5, label: '红'},
        {value: 6, label: '紫'},
        {value: 7, label: '绿'},
        {value: 8, label: '蓝'},
        {value: 9, label: '棕'},
        {value: 10, label: '黑'},
        {value: 11, label: '其他'}
      ],
      plateTypeList: [
        {value: 0, label: '不限'},
        {value: 1, label: '大型汽车'},
        {value: 2, label: '小型汽车'},
        {value: 8, label: '轻便摩托车'},
        {value: 15, label: '挂车'},
        {value: 23, label: '警用汽车'},
        {value: 24, label: '警用摩托'},
        {value: 25, label: '小型新能源汽车'},
        {value: 26, label: '大型新能源汽车'},
        {value: 27, label: '小吨位货车'},
        {value: 28, label: '大吨位货车'},
        {value: 29, label: '客车'},
        {value: 99, label: '其他'}
      ],
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
      switchType: 0, // 0活动范围，1关联事件
      amap: null, // 地图实例
      searching: false,
      curVideo: {
        id: '',
        indexNum: null, // 当前展示的摄像头索引
        playNum: null, // 当前摄像头里正在大屏播放的索引
        playing: false,
        videoList: []
      }, // 当前被放大播放的video
      showVideoList: false,
      curSXT: {
        deviceName: '',
        snapNum: '',
        snapTime: ''
      }, // 显示的摄像头数据
      showLarge: false,
      showCut: false,
      curVideoUrl: '',
      demoImg: '',
      surveillanceIds: [], // 布控ids.
      eventList: []
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
    chooseType (e) {
      if (e === 1) {
        this.searchData.vehicleGroupId = null;
        this.searchData.plateType = null;
        this.searchData.vehicleColor = null;
      } else if (e === 2) {
        this.searchData.portraitGroupId = null;
        this.searchData.sex = null;
        this.searchData.ageScope = null;
      }
    },
    setDTime () {
      let date = new Date();
      let curDate = date.getTime();
      let curS = 15 * 24 * 3600 * 1000;
      let _s = new Date(curDate - curS).getFullYear() + '-' + (new Date(curDate - curS).getMonth() + 1) + '-' + new Date(curDate - curS).getDate();
      let _e = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      this.searchData.time = [_s, _e]
    },
    resetSearch () {
      this.searchData = {
        type: null, // 1：人， 2： 车,0 无限
        portraitGroupId: '',  // 人员组
        sex: null, // 1男，2女
        ageScope: null, // 年龄段
        vehicleGroupId: '', // 车辆组
        plateType: null, // 车牌种类
        time: null
      }
    },
    beginSearch () {
      this.searching = true;
      this.surveillanceIds = [];
      this.$_showLoading({
        target: '.se_hi_box'
      })
      let params = {
        dateStart: this.searchData.time[0],
        dateEnd: this.searchData.time[1]
      }
      for (let key in this.searchData) {
        if (this.searchData[key] && key !== 'time') {
          params[key] = this.searchData[key];
        }
      }
      JfoGETSurveillanceObject(params)
        .then(res => {
          this.searching = false;
          if (res) {
             res.data.list.forEach(z => {
              if (z.surveillanceId) {
                this.surveillanceIds.push(z.surveillanceId)
              }
            });
            this.evData = res.data.list.map(x => {
              x.checked = false;
              return x;
            })
            this.amap.clearMap();
            this.drawMarkers(this.evData);
            this.showEventList();
          }
        })
    },
    drawMarkers (data) {
      for (let  i = 0; i < data.length; i++) {
        let obj = data[i];
        let _idWin = 'vlJfoImg' + i;
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
          let _id = 'vlJfoSxt' + i;
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
      let _key = self.curVideo.indexNum;
      el.bind(evType, function () {
        switch (evType) {
          case 'mouseover':
            $('#vlJfoImg' + key).addClass('vl_jig_mk_img_hover')
            $('#vlJfoSxt' + key).addClass('vl_icon_judge_02')
            break;
          case 'mouseout':
            if (!obj.checked) {
              $('#vlJfoImg' + key).removeClass('vl_jig_mk_img_hover')
              $('#vlJfoSxt' + key).removeClass('vl_icon_judge_02')
            }
            break;
          case 'click':
            self.evData.forEach(z => {
              z.checked = false;
            })
            obj.checked = true;
            if (_key !== null) {
              $('#vlJfoImg' + _key).removeClass('vl_jig_mk_img_hover')
              $('#vlJfoSxt' + _key).removeClass('vl_icon_judge_02')
            }
            $('#vlJfoImg' + key).addClass('vl_jig_mk_img_hover')
            $('#vlJfoSxt' + key).addClass('vl_icon_judge_02')
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
      $('#vlJfoImg' + _key).removeClass('vl_jig_mk_img_hover')
      $('#vlJfoSxt' + _key).removeClass('vl_icon_judge_02')
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
        document.getElementById('vlJfoLargeV').play();
      }
      document.getElementById('vlJfoLargeV').addEventListener('ended', (e) => {
        e.target.currentTime = 0;
        vDom.currentTime = 0;
        document.getElementById('vlJfoLargeV').pause();
        this.curVideo.videoList[_i].playing = false;
        this.showLarge = false;
      })
      document.getElementById('vlJfoLargeV').currentTime = vDom.currentTime;
      this.curVideoUrl = vDom.src;
    },
    closeVideo () {
      let vDom = document.getElementById(this.curVideo.id);
      document.getElementById('vlJfoLargeV').pause();
      vDom.currentTime = document.getElementById('vlJfoLargeV').currentTime;
      this.showLarge = false;
      if (this.curVideo.playing) {
        this.curVideo.videoList[this.curVideo.playNum].playing = true;
        vDom.play();
      }
    },
    pauseLargeVideo () {
      this.curVideo.playing = false;
      this.curVideo.videoList[this.curVideo.playNum].playing = false;
      document.getElementById('vlJfoLargeV').pause();
    } ,
    playLargeVideo () {
      this.curVideo.playing = true;
      document.getElementById('vlJfoLargeV').play();
    },
    cutScreen () {
      this.showCut = true;
      let _canvas = document.createElement('canvas');
      _canvas.setAttribute('width', document.documentElement.clientWidth);
      _canvas.setAttribute('height', document.documentElement.clientHeight);
      let cxt = _canvas.getContext('2d');
      cxt.drawImage(document.getElementById('vlJfoLargeV'), 0, 0, _canvas.width, _canvas.height);
      this.demoImg = _canvas.toDataURL();
      setTimeout(() => {
        document.getElementById('vlJidDownloadImg').click();
      }, 200)
    },
    showEventList () {
      if (!this.$_loading) {
        this.$_showLoading({
          target: '.se_hi_box'
        })
      }
      let params = {
        'where.surveillanceIds': this.surveillanceIds.join(','),
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
        // surveillanceIds: '23, 11'
      }
      JfoGETEventList(params)
        .then(res => {
          this.$_hideLoading();
          if (res) {
            this.eventList = res.data.list;
            this.pagination.total = res.data.total;
          }
        }).catch(() => {
        this.$_hideLoading();
      })
    },
    handleCurrentChange (val) {
      this.pagination.currentPage = val;
      this.showEventList();
    }
  },
  watch: {}
}
</script>
<style lang="scss">
  .vl_jfo_switch {
    width: 2.34rem;
    height: .5rem;
    background: #FFFFFF;
    box-shadow:0px 3px 10px 0px rgba(99,99,99,0.39);
    position: absolute;
    top: .2rem;
    left: calc(50% - 1.17rem);
    z-index: 99;
    &:after {
      display: block;
      content: ' ';
      position: absolute;
      left: 50%;
      top: 0;
      width: 1px;
      background: #f2f2f2;
      height: .3rem;
      margin-top: .1rem;
    }
    > div {
      display: inline-block;
      width: 50%;
      height: 100%;
      text-align: center;
      span {
        display: inline-block;
        font-size: 14px;
        color: #666666;
        height: .46rem;
        line-height: .46rem;
        cursor: pointer;
        &:hover {
          color: #1264F8;
          border-bottom: .02rem solid #1264F8;
        }
      }
    }
    .active {
      color: #1264F8;
      border-bottom: .02rem solid #1264F8;
    }
  }
  .vl_jig_event {
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #fafafa;
    animation: fadeInRight .1s ease-out .1s both;
    z-index: 9;
    padding: 0 .2rem .4rem .2rem;
    .vl_jfo_event_box {
      width: 100%;
      height: 100%;
      background: #FFFFFF;
      padding-top: .9rem;
    }
  }
  .vl_jfo_right {
    position: absolute;
    right: .2rem;
    top: 0;
    width: 2.6rem;
    height: 100%;
    padding: .3rem .2rem .2rem .2rem;
    box-shadow: 0px 10px 12px 0px rgba(4,24,54,0.2);
    background: #ffffff;
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
  .vl_jtc_mk_img {
    width: 98px;
    height: 98px;
    border: .04rem solid #FFFFFF;
    img {
      width: 100%;
      height: 100%;
    }
    p {
      display: none;
    }
  }
  .vl_jtc_mk_img_hover {
    position: relative;
    border: .04rem solid #0C70F8;
    > div {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: .4rem;
      background: rgba(12, 112, 248, .8);
      p {
        display: block;
        color: #FFFFFF;
        font-size: .12rem;
        line-height: .2rem;
        text-indent: .08rem;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
</style>
<style lang="scss" scoped="scoped">
  .se_hi_box {
    width: 100%;
    height: 100%;
    /deep/.el-table {
      table {
        td {
          padding: 0!important;
          height: .98rem;
          line-height: .98rem;
        }
        th {
          padding: 0;
          height: .98rem;
          line-height: .98rem;
        }
      }
      table {
        thead {
          td {
            height: .54rem;
            line-height: .54rem;
          }
          th {
            height: .54rem;
            line-height: .54rem;
          }
        }
      }
    }
    .tt_img {
      width: .76rem;
      height: .76rem;
      position: relative;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
      margin: 0 auto;
      img {
        width:  100%;
        height: 100%;
      }
      > span {
        color: #FFFFFF;
        display: block;
        position: absolute;
        bottom: 5px;
        right: 5px;
        background: rgba(0, 0, 0, .6);
        width: .20rem;
        height: .20rem;
        line-height: .20rem;
        text-align: center;
        -webkit-border-radius: .1rem;
        -moz-border-radius: .1rem;
        border-radius: .1rem;
        font-size: .14rem;
      }
    }
  }
  .se_hi_pa {
    text-align: center;
  }
</style>