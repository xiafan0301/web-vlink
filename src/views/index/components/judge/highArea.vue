<template>
  <div class="vl_judge_tc">
    <div class="vl_j_left">
      <div class="vl_jtc_search" style="padding-top: 0;">
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
        <el-select v-model="searchData.personGroupId">
          <el-option v-for="item in personList" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <el-select v-model="searchData.deviceGroupId">
          <el-option v-for="item in deviceList" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <el-select v-model="searchData.intelligentCharac">
          <el-option v-for="item in CharacList" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <el-autocomplete
          v-model="searchAdress"
          :fetch-suggestions="autoAdress"
          value-key="name"
          @select="chooseAddress"
          placeholder="输入地址">
        </el-autocomplete>
        <el-button @click="resetSearch">重置</el-button>
        <el-button :loading="searching" type="primary" @click="beginSearch">搜索</el-button>
      </div>
    </div>
    <div class="vl_j_right">
      <div id="tcMap"></div>
      <div class="vl_jha_right" v-show="showVideoList">
        <div class="vl_jig_right_title">
          <el-select v-model="rightSex" placeholder="选择性别"  @change="getSnapList(curSXT.deviceId)">
            <el-option v-for="item in sexList" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
          <el-select v-model="rightMinZ" placeholder="选择民族" @change="getSnapList(curSXT.deviceId)">
            <el-option v-for="item in minZList" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
        <vue-scroll>
          <div class="vl_jha_right_item" v-for="item in curVideo.childList" :key="item.id">
            <div class="switch_btn">
              <el-button type="text" @click="item.curIndex--" :disabled="item.curIndex === 0"><i class="el-icon-arrow-left"></i></el-button>
            </div>
            <div class="switch_body">
              <div><img :src="item.list[item.curIndex].snapPhoto ? item.list[item.curIndex].snapPhoto : item.list[item.curIndex].surveillancePhoto" alt=""></div>
              <div style="width: 22%;">
                <h2>{{item.list[item.curIndex].semblance}}</h2>
                <p>相似度</p>
                <el-select v-model="item.curIndex" >
                  <el-option v-for="(sItem, sIndex) in item.list" :key="sItem.id" :value="sIndex" :label="sItem.snapTime.slice(3, 14)">
                  </el-option>
                </el-select>
              </div>
              <div><img :src="item.list[item.curIndex].surveillancePhoto ? item.list[item.curIndex].surveillancePhoto : item.list[item.curIndex].snapPhoto" alt=""></div>
              <div style="text-align: left;">
                <h3>{{item.name}}</h3>
                <p>
                  <span>{{item.sex === 1 ? '男' : '女'}}</span>
                  <span>{{item.nation === 1 ? '汉族' : '其他族'}}</span>
                </p>
              </div>
            </div>
            <div class="switch_btn">
              <el-button type="text" @click="item.curIndex++" :disabled="item.curIndex === item.list.length - 1"><i class="el-icon-arrow-right"></i></el-button>
            </div>
            <span>{{item.snapNum}}次</span>
          </div>
        </vue-scroll>
        <div class="vl_jig_right_close"><i class="el-icon-error" @click="hideVideoList"></i></div>
      </div>
    </div>
  </div>
</template>
<script>
let AMap = window.AMap;
import {testData} from './testData';
import {JfoGETGroup, JhaGETStatisicByAddress, JhaGETAlarmSnapByAddress} from '../../api/api.judge.js';
export default {
  data() {
    return {
      testData: testData,
      evData: [],
      searchData: {
        time: null,
        personType: null,
        deviceType: null,
        CharacType: null,
        latitude: null,
        longitude: null
      },
      searchAdress: '',
      personList: [
        {value: 0, label: '不限'},
        {value: 1, label: '吸毒人员'},
        {value: 2, label: '形释解教人员'},
        {value: 3, label: '重点青少年'},
        {value: 4, label: '人像库'}
      ],
      deviceList: [
        {value: 0, label: '不限'},
        {value: 1, label: '主要道路节点'},
        {value: 2, label: '道路交叉口'},
        {value: 3, label: '案件高发区域'},
        {value: 4, label: '重点场所'},
      ],
      CharacList: [
        {value: 0, label: '不限'},
        {value: 1, label: '红外感应'},
        {value: 2, label: '人像识别'},
        {value: 3, label: '车像识别'},
        {value: 4, label: '热力感应'},
        {value: 5, label: '移动侦测'}
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
      amap: null, // 地图实例
      autoComplete: null,
      markerPoint: [], // 地图点集合
      searching: false,
      curVideo: {
        id: '',
        indexNum: null, // 当前展示的摄像头索引
        playNum: null, // 当前摄像头里正在大屏播放的索引
        playing: false,
        childList: []
      }, // 当前被放大播放的video
      curSXT: {}, // 当前显示摄像头数据
      showVideoList: false,
      rightSex: null,
      rightMinZ: null,
      sexList: [
        {value: 0, label: '不限'},
        {value: 1, label: '男'},
        {value: 2, label: '女'}
      ],
      minZList: [
        {value: 0, label: '不限'},
        {value: 1, label: '汉族'}
      ]
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
    map.plugin('AMap.Autocomplete', () => {
      let autoOptions = {
        city: '长沙'
      }
      this.autoComplete = new AMap.Autocomplete(autoOptions);
    })
    // this.getSelectData(); 调基础服务那边接口，还不通
  },
  methods: {
    getSelectData () {
      let params = {
        type: 1
      }
      JfoGETGroup(params).then(res => {
        if (res) {
          console.log(res)
        }
      })
    },
    autoAdress (queryString, cb) {
      if (queryString === '') {
        this.searchData.longitude = null;
        this.searchData.latitude = null;
        cb([])
      } else {
        this.autoComplete.search(queryString, (status, result) => {
          if (status === 'complete') {
            cb(result.tips);
          }
        })
      }
    },
    chooseAddress (e) {
      if (e.location) {
        this.searchData.longitude = e.location.lng;
        this.searchData.latitude = e.location.lat;
      } else {
        return this.$message.error('请选择一个具体地址')
      }
      this.amap.setZoomAndCenter(16, [this.searchData.longitude, this.searchData.latitude]);
      this.beginSearch();
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
        time: null,
        personGroupId: null,
        deviceGroupId: null,
        intelligentCharac: null,
        latitude: null,
        longitude: null
      }
    },
    beginSearch () {
      if (this.searchData.latitude === null || this.searchData.longitude === null) {
        return this.$message.error('请设置搜索区域的中心位置')
      }
      this.searching = true;
      let params = {
        dateStart: this.searchData.time[0],
        dateEnd: this.searchData.time[1]
      }
      for (let key in this.searchData) {
        if (this.searchData[key] && key !== 'time') {
          params[key] = this.searchData[key];
        }
      }
      JhaGETStatisicByAddress(params)
        .then(res => {
          this.searching = false;
          if (res) {
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
        if (obj.addLongitude > 0 && obj.addLatitude > 0) {
          let colorList = ['#0D9DF4', '#0C70F8', '#6262FF', '#8949F3'];
          let _i = 0;
          if (obj.snapNum > 79) {
            _i = 3;
          } else if (obj.snapNum > 59) {
            _i = 2;
          } else if (obj.snapNum > 19) {
            _i = 1;
          } else {
            _i = 0;
          }
          let _sContent = '<div style="background: ' + colorList[_i] + ';" class="vl_jha_mk_win">' + obj.snapNum + '人次</div>';
          // 窗体
          new AMap.Marker({ // 添加自定义点标记
            map: this.amap,
            position: [obj.addLongitude, obj.addLatitude], // 基点位置 [116.397428, 39.90923]
            offset: new AMap.Pixel(26, -20), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: _sContent
          });
          // 摄像头
          let _class = 'vl_icon_judge_0' + (_i + 3);
          let _id = 'vlJhaSxt' + i;
          if (obj.checked) {
            _class = 'vl_icon_judge_02';
          }
          let _content = '<div id=' + _id + ' class="vl_icon vl_jha_sxt ' + _class + '"><div class="my_circle"></div><div class="my_circle1"></div></div>'
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
            $('#vlJhaSxt' + key).addClass('vl_icon_judge_02 vl_jha_sxt_hover')
            break;
          case 'mouseout':
            if (!obj.checked) {
              $('#vlJhaSxt' + key).removeClass('vl_icon_judge_02 vl_jha_sxt_hover')
            }
            break;
          case 'click':
            _key  = self.curVideo.indexNum;
            self.evData.forEach(z => {
              z.checked = false;
            })
            obj.checked = true;
            if (_key !== null) {
              $('#vlJhaSxt' + _key).removeClass('vl_icon_judge_02 vl_jha_sxt_hover')
            }
            $('#vlJhaSxt' + key).addClass('vl_icon_judge_02 vl_jha_sxt_hover')
            self.showVideo(obj);
            break;
        }
      })
    },
    showVideo (data) {
      this.curVideo.indexNum = this.evData.indexOf(data);
      this.curSXT = data;
      this.showVideoList = true;
      this.getSnapList(this.curSXT.deviceId);
    },
    getSnapList (deviceId) {
      this.$_showLoading({
        target: '.__vuescroll'
      })
      let params = {
        deviceId: deviceId ? deviceId : '',
        dateStart: this.searchData.time[0],
        dateEnd: this.searchData.time[1]
      }
      if (this.rightSex) {
        params['sex'] = this.rightSex;
      }
      if (this.rightMinZ) {
        params['nation'] = this.rightMinZ;
      }
      JhaGETAlarmSnapByAddress(params)
        .then(res => {
          this.$_hideLoading();
          if (res) {
            this.curVideo.childList = res.data.map(x => {
              x['curIndex'] = 0;
              x['curSnapTime'] = '';
              return x;
            });
          }
        })
    },
    hideVideoList () {
      this.evData[this.curVideo.indexNum].checked = false;
      $('#vlJhaSxt' + this.curVideo.indexNum).removeClass('vl_icon_judge_02 vl_jha_sxt_hover')
      this.curVideo.indexNum = null;
      this.showVideoList = false;
    }
  },
  watch: {}
}
</script>
<style lang="scss">
  .vl_jha_right {
    position: absolute;
    right: .2rem;
    top: 0;
    width: 4.76rem;
    height: 100%;
    padding: .3rem .2rem .2rem .2rem;
    box-shadow: 0px 10px 12px 0px rgba(4,24,54,0.2);
    background: rgba(255, 255, 255, .8);
    animation: fadeInRight .4s ease-out .4s both;
    &:hover {
      .vl_jig_right_close {
        display: block;
      }
    }
    .vl_jig_right_title {
      width: 100%;
      height: .4rem;
      margin-bottom: .2rem;
      .el-select {
        width: 2rem;
        height: .4rem;
        &:last-child {
          float: right;
        }
        .el-input {
          input {
            height: .4rem;
            line-height: .4rem;
          }
          .el-select__caret {
            height: .4rem;
            line-height: .4rem;
          }
        }
      }
    }
    .vl_jha_right_item {
      padding: .3rem 0;
      height: 1.34rem;
      position: relative;
      display: flex;
      background: #FFFFFF;
      -webkit-box-shadow: 0px 5px 16px 0px rgba(169,169,169,0.2);
      -moz-box-shadow: 0px 5px 16px 0px rgba(169,169,169,0.2);
      box-shadow: 0px 5px 16px 0px rgba(169,169,169,0.2);
      &:before {
        display: block;
        content: '';
        position: absolute;
        top: -.4rem;
        right: -.4rem;
        transform: rotate(-46deg);
        border: .4rem solid #0c70f8;
        border-color: transparent transparent transparent #0C70F8;
      }
      &:after {
        display: block;
        content: '';
        position: absolute;
        top: -.2rem;
        right: -.2rem;
        transform: rotate(-45deg);
        border: .2rem solid #FFFFFF;
        border-color: transparent transparent transparent #FFFFFF;
      }
      >span {
        display: block;
        position: absolute;
        top: .06rem;
        right: .06rem;
        width: .5rem;
        height: .5rem;
        text-align: center;
        color: #FFFFFF;
        font-size: .12rem;
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
        z-index: 99;
      }
      >.switch_body {
        width: 3.68rem;
        display: flex;
        justify-content: space-around;
        >div {
          width: 26%;
          text-align: center;
          color: #333333;
          position: relative;
          img {
            width: .76rem;
            height: .76rem;
          }
          h2 {
            font-size: .26rem;
            font-weight: bold;
            color: #0C70F8;
          }
          h3 {
            font-size: .18rem;
            font-weight: bold;
            margin-bottom: .1rem;
          }
          p {
            font-size: 12px;
            > span {
              height: .26rem;
              padding: 0 .08rem;
              display: inline-block;
              background: #FAFAFA;
              &:first-child {
                background: #F2F2F2;
                margin-right: .08rem;
              }
            }
          }
          .el-select {
            position: absolute;
            padding: 0;
            left: calc((0.8rem - 100px) / 2);
            z-index: 9;
            input {
              height: 24px;
              line-height: 24px;
              padding-left: 8px;
              width: 100px;
              font-size: 10px;
              padding-right: 20px;
              border: none;
              -webkit-border-radius: 12px;
              -moz-border-radius: 12px;
              border-radius: 12px;
              border: 1px solid #D3D3D3;
            }
            .el-select__caret {
              line-height: 24px;
              width: 12px;
            }
          }
        }
      }
      >.switch_btn {
        width: .34rem;
        height: 100%;
        > button {
          width: 100%;
          height: 100%;
          font-size: 26px;
          i {
            font-weight: bold;
          }
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
  .vl_jha_mk_win {
    width: auto;
    height: .3rem;
    text-align: center;
    line-height: .3rem;
    -webkit-border-radius: .15rem;
    -moz-border-radius: .15rem;
    border-radius: .15rem;
    color: #FFFFFF;
    padding: 0 .16rem;
    white-space: nowrap;
  }
  .vl_jha_sxt {
    position: relative;
    -webkit-transition: 0s all;
    -moz-transition: 0s all;
    -ms-transition: 0s all;
    -o-transition: 0s all;
    transition: 0s all;
    > div {
      display: none;
      position: absolute;
      bottom: -46px;
      right: -20px;
      width: 100px;
      height: 100px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      background: #0C70F8;
      -webkit-animation: circleWave 1.4s infinite;
      -o-animation: circleWave 1.4s infinite;
      animation: circleWave 1.4s infinite;
    }
  }
  .vl_jha_sxt_hover {
    >div {
      display: block;
    }
    .my_circle1 {
      opacity: 0;
      -webkit-animation-delay: .7s;
      -moz-animation-delay: .7s;
      -o-animation-delay: .7s;
      animation-delay: .7s;
    }
  }
</style>