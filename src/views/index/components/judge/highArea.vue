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
          <el-select v-model="rightSex" placeholder="选择性别"  @select="getSnapList">
            <el-option v-for="item in sexList" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
          <el-select v-model="rightMinZ" placeholder="选择民族" @select="getSnapList">
            <el-option v-for="item in minZList" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </div>
        <vue-scroll>
          <div class="vl_jha_right_item" v-for="(item, index) in curSXT.childList" :key="item.id">
            <i :class="{'disabeld': index === 0}"></i>
            <i :class="{'disabeld': index === curSXT.childList.length - 1}"></i>
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
import {JfoGETGroup, JhaGETStatisicByAddress, JhaGETAlarmSnapByAddress} from '../../api/api';
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
        latitude: 28.093846,
        longitude: 112.974691
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
      markerImg: [], // 地图抓人人像集合
      searching: false,
      curVideo: {
        id: '',
        indexNum: null, // 当前展示的摄像头索引
        playNum: null, // 当前摄像头里正在大屏播放的索引
        playing: false
      }, // 当前被放大播放的video
      curSXT: {
        childList: []
      }, // 当前显示摄像头数据
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
      this.searchData.longitude = e.location.lng;
      this.searchData.latitude = e.location.lat;
      this.amap.setZoomAndCenter(16, [this.searchData.longitude, this.searchData.latitude]);
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
            this.drawMarkers(this.evData);
          }
        })
    },
    drawMarkers (data) {
      this.amap.clearMap();
      // let cWin = document.documentElement.clientWidth;
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
          let markerWindow = new AMap.Marker({ // 添加自定义点标记
            map: this.amap,
            position: [obj.addLongitude, obj.addLatitude], // 基点位置 [116.397428, 39.90923]
            offset: new AMap.Pixel(26, -40), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: _sContent
          });
          this.markerImg.push(markerWindow);
          // 摄像头
          let _class = 'vl_icon_judge_0' + (_i + 3);
          let _circle = '';
          if (obj.checked) {
            _class = 'vl_icon_judge_02';
            _circle = '<div class="my_circle"></div><div class="my_circle1"></div>';
          }
          let _content = '<div class="vl_icon vl_jha_sxt ' + _class + '">' + _circle + '</div>'
          let point = new AMap.Marker({ // 添加自定义点标记
            map: this.amap,
            position: [obj.addLongitude, obj.addLatitude], // 基点位置 [116.397428, 39.90923]
            offset: new AMap.Pixel(-28.5, -50), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: _content
          });
          point.on('mouseover', this.pointHover);
          this.markerPoint[i] = point;
        }
      }
      this.amap.setFitView();
    },
    updatePoint (obj) {
      let _i = this.evData.indexOf(obj);
      console.log(_i, obj)
      let i = 0;
      if (obj.snapNum > 79) {
        i = 3;
      } else if (obj.snapNum > 59) {
        i = 2;
      } else if (obj.snapNum > 19) {
        i = 1;
      } else {
        i = 0;
      }
      let _class = 'vl_icon_judge_0' + (i + 3);
      let _circle = '';
      if (obj.checked) {
        _class = 'vl_icon_judge_02';
        _circle = '<div class="my_circle"></div><div class="my_circle my_circle1"></div>';
      }
      let _content = '<div class="vl_icon vl_jha_sxt ' + _class + '">' + _circle + '</div>'
      if (obj.addLongitude > 0 && obj.addLatitude > 0) {
        let point = new AMap.Marker({ // 添加自定义点标记
          map: this.amap,
          position: [obj.addLongitude, obj.addLatitude], // 基点位置 [116.397428, 39.90923]
          offset: new AMap.Pixel(-28.5, -50), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          extData: obj,
          // 自定义点标记覆盖物内容
          content: _content
        });
        point.on('click', this.showVideo)
        point.on('mouseover', this.pointHover);
        point.on('mouseout', (e) => {
          let _i = this.evData.indexOf(e.target.C.extData);
          if (_i !== this.curVideo.indexNum) {
            e.target.C.extData.checked = false;
            this.updatePoint(obj);
          }
        })
        let self = this;
        setTimeout(() => {
          self.amap.remove(this.markerPoint[_i]);
          self.markerPoint[_i] = point;
        }, 0)
      }
    }, // 更新摄像头点
    pointHover (e) {
      if (!e.target.C.extData.checked) {
        e.target.C.extData.checked = true;
        this.evData.filter((x, index) => index !== this.curVideo.indexNum && x.checked === true && x !== e.target.C.extData).forEach(z => {
          z.checked = false;
          this.updatePoint(z);
        })
        this.updatePoint(e.target.C.extData);
      }
    },
    showVideo (e) {
      if (this.curVideo.indexNum !== null && this.curVideo.indexNum !== this.evData.indexOf(e.target.C.extData)) {
        this.evData[this.curVideo.indexNum].checked = false;
        this.updatePoint(this.evData[this.curVideo.indexNum]);
      }
      this.curVideo.indexNum = this.evData.indexOf(e.target.C.extData);
      this.curSXT = e.target.C.extData;
      this.showVideoList = true;
      this.getSnapList(this.curSXT.deviceId);
      this.pointHover(e);
    },
    getSnapList (deviceId) {
      let params = {
        deviceId: deviceId,
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
          if (res) {
            console.log(res)
          }
        })
    },
    hideVideoList () {
      this.evData[this.curVideo.indexNum].checked = false;
      this.updatePoint(this.evData[this.curVideo.indexNum]);
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
    background: #ffffff;
    animation: fadeInRight .4s ease-out .4s both;
    &:hover {
      .vl_jig_right_close {
        display: block;
      }
    }
    .vl_jig_right_title {
      width: 100%;
      height: .6rem;
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
    .my_circle {
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
    .my_circle1 {
      opacity: 0;
      -webkit-animation-delay: .7s;
      -moz-animation-delay: .7s;
      -o-animation-delay: .7s;
      animation-delay: .7s;
    }
  }
</style>