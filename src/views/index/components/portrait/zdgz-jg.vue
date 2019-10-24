<template>
  <div class="judge_content">
    <div class="vl_judge_tc">
      <div class="Breadc">
        <div is="vlBreadcrumb"
             :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},{name: '重点人群关注', routerName: 'portrait_zdgz'},
          {name: '分析结果'}]">
        </div>
      </div>

      <div :class="['vl_j_left']">
        <template v-if="showNewTask">
          <div class="vl_jtc_search" style="padding-top: 0;">
            <!--<div class="zdgz_left_radio">-->
              <!--<span>任务名称：</span>-->
              <!--<span>-->
                <!--<el-input v-model="taskName" placeholder="请输入任务名称" maxlength="20"></el-input>-->
              <!--</span>-->
            <!--</div>-->
            <el-date-picker
                    v-model="searchData.time1"
                    type="datetime"
                    placeholder="开始时间"
                    :time-arrow-control="true"
                    class="full vl_date"
                    :clearable="false"
                    value-format="timestamp"
            ></el-date-picker>
            <el-date-picker
                    v-model="searchData.time2"
                    type="datetime"
                    :clearable="false"
                    :time-arrow-control="true"
                    placeholder="结束时间"
                    class="full vl_date vl_date_end"
                    value-format="timestamp"
            ></el-date-picker>
            <el-select class="full" v-model="searchData.portraitGroupId" placeholder="关注人群">
              <el-option
                      v-for="item in portraitGroupList"
                      :key="item.id"
                      :label="item.groupName"
                      :value="item.uid">
              </el-option>
            </el-select>
            <el-select class="full" v-model="searchData.sex" placeholder="请选择性别" clearable>
              <el-option
                      v-for="item in sexList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
            <el-select class="full" v-model="searchData.ageGroup" placeholder="请选择年龄段" clearable>
              <el-option
                      v-for="item in ageGroupList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
            <div class="zdgz_xzsb_s" @click="clickTab" v-if="mapSelectType === 0">
              <span>选择设备</span>
              <span class="el-icon-arrow-down"></span>
            </div>
            <div class="zdgz_dtxz_rst" v-else>
              已选<span>{{dSum}}</span>个设备<a href="javascript: void(0);" @click="dialogVisible={}">重选</a>
            </div>
            <div>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-button  @click="resetSearch" class="full">取消</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button  :loading="searching" type="primary" @click="beginSearch"
                              class="select_btn full"
                  >确定</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="vl_ytsr_left_line" v-show="taskDetail.taskName">
            <span>任务名称：</span>{{taskDetail.taskName}}
          </div>
          <div class="vl_ytsr_left_line">
            <span>所选时间：</span>
            <span>
            <p>{{taskDetail.startTime}}</p>
            <p>{{taskDetail.endTime}}</p>
          </span>
          </div>
          <div class="vl_ytsr_left_line">
            <span>所选人群：</span>
            <span>
            <p>{{taskDetail.portraitGroupName}}</p>
          </span>
          </div>
          <div class="vl_ytsr_left_line">
            <span>性别：</span>
            <span>
            <p>{{taskDetail.sex ? taskDetial.sex : '不限'}}</p>
          </span>
          </div>
          <div class="vl_ytsr_left_line">
            <span>年龄段：</span>
            <span>
            <p>{{taskDetail.age ? taskDetial.age : '不限'}}</p>
          </span>
          </div>
          <div class="vl_ytsr_left_line">
            <span>抓拍设备：</span>
            <span>
           <p v-for="item in taskDetail.deviceNames" :key="item.id">{{item}}</p>
        </span>
          </div>
          <div class="update_task">
            <el-button type="primary" @click="showNewTask = true;">修改任务</el-button>
          </div>
        </template>
      </div>
      <div :class="['vl_j_right']">
        <div id="tcMap"></div>
        <ul class="map_rrt_u2">
          <li  @click="resemt"><i class="el-icon-aim"></i></li>
          <li @click="mapZoomSet(1)"><i class="el-icon-plus"></i></li>
          <li @click="mapZoomSet(-1)"><i class="el-icon-minus"></i></li>
        </ul>
        <div class="vl_jfo_right" v-show="showVideoList">
          <div class="vl_jig_right_title">
            <p><i class="vl_icon vl_icon_v11"></i><span :title="curSXT.deviceName">{{curSXT.deviceName}}</span></p>
            <p><i class="vl_icon vl_icon_position_1"></i><span :title="curSXT.address">{{curSXT.address}}</span></p>
            <!-- < span>抓拍{{curSXT.shotNum}}次</span> -->
          </div>
          <div class="video_container">
            <vue-scroll>
              <div class="vl_jtc_mk" v-for="(item, index) in curVideo.videoList" :key="item.id">
                <p>{{item.shotTime}}</p>
                <div is="flvplayer" :oData="item.playerData"
                     :oConfig="{fit: false, sign: false, pause: true, close: false, tape: false, download: false}">
                </div>
              </div>
            </vue-scroll>
          </div>
          <div class="vl_jig_right_close"><i class="el-icon-error" @click="hideVideoList"></i></div>
        </div>
      </div>
    </div>
    <div is="mapSelector" :open="dialogVisible" :showTypes="'DB'" :clear="clearMapSelect" @mapSelectorEmit="mapPoint"></div>
  </div>
</template>
<script>
  let AMap = window.AMap;
  import mapSelector from '@/components/common/mapSelector.vue';
  import vlBreadcrumb from '@/components/common/breadcrumb.vue';
  import { getPeopleTaskDetail } from '@/views/index/api/api.analysis.js';
  import {PortraitPostFocusTask} from "@/views/index/api/api.judge.js";
  import { random14, formatDate } from '@/utils/util.js';
  import { mapXupuxian } from "@/config/config.js";
  import flvplayer from '@/components/common/flvplayer.vue';
  import {getGroupListIsPortrait} from '../../api/api.control.js';
  export default {
    components: {
      mapSelector,
      vlBreadcrumb,
      flvplayer
    },
    data() {
      return {
        sexList: [
          {value: '男', label: '男'},
          {value: '女', label: '女'}
        ],
        portraitGroupList: [],
        ageGroupList: [
          // {value: null, label: '不限'},
          {value: '儿童', label: '儿童'},
          {value: '少年', label: '少年'},
          {value: '青年', label: '青年'},
          {value: '中年', label: '中年'},
          {value: '老年', label: '老年'},
          // {value: 6, label: '50-70'},
          // {value: 7, label: '70-'}
        ],
        selectDevice:[],
        selectBayonet:[],
        dSum: 0, // 设备总数
        mapSelectType: 0,
        showNewTask: false, // 展示修改任务
        searchData: {
          portraitGroupId: null,  // 人员组
          sex: null, // 1男，2女
          ageGroup: null, // 年龄段
          time1: null,
          time2: null
        },
        searching: false,
        dialogVisible: false,
        clearMapSelect: null, // 清除地图选择


        taskDetail: {},
        evData: [],
        amap: null, // 地图实例
        curVideo: {
          id: '',
          indexNum: null, // 当前展示的摄像头索引
          playNum: null, // 当前摄像头里正在大屏播放的索引
          videoList: []
        }, // 当前被放大播放的video
        showVideoList: false,
        curSXT: {
          deviceName: '',
          shotNum: '',
          // snapTime: ''
        }, // 显示的摄像头数据
      }
    },
    mounted () {
      let map = new AMap.Map('tcMap', {
        center: [112.974691, 28.093846],
        zoom: 16
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.amap = map;
      this.setDTime();
      ///新的
      this.getDetail();
      // 获取人员组，跟车辆组列表
      getGroupListIsPortrait().then(res => {
        if (res) {
          this.portraitGroupList = res.data;
          this.portraitGroupList.map(item => {
            if (!item.uid) {
              this.searchData.portraitGroupId = item.uid;
            }
          })
        }
      })
    },
    methods: {
      setDTime () {
        let date = new Date();
        let curDate = date.getTime();
        let curS = 1 * 24 * 3600 * 1000;
        let _sDate = new Date(curDate - curS);
        let _s = _sDate.getFullYear()+ '-' + (_sDate.getMonth() + 1) + '-' + _sDate.getDate() + ' 00:00:00' ;
        this.searchData.time1 = new Date(_s).getTime();
        this.searchData.time2 = curDate;
      },
      resetSearch () {
        this.setDTime()
//        this.taskName = '';
        this.searchData.portraitGroupId = null;
        this.searchData.sex = null;
        this.searchData.ageGroup = null;
        this.selectDevice = [];
        this.selectBayonet = [];
        this.dSum = 0;
        this.showNewTask = false;

        this.clearMapSelect = !this.clearMapSelect; // 清除地图选择

      },
      clickTab() {
        this.dialogVisible = !this.dialogVisible;
        this.mapSelectType = 1;
      },
      mapPoint(data){
        this.selectDevice = data.deviceList;
        this.selectBayonet = data.bayonetList;
        this.dSum = 0;
        this.dSum = data.bayonetList.length + data.deviceList.length;
      },
      beginSearch () {
        let _todo = false;
        if(this.selectBayonet.length === 0 && this.selectDevice.length === 0) {
          if (!document.querySelector('.el-message--info')) {
            this.$message.info('请至少选择一个设备')
          }
          return false;
        }
        for (let key in this.searchData) {
          if (this.searchData[key] && key !== 'time1') {
            _todo = true;
          }
        }
        if (!_todo) {
          this.$message.warning('请至少输入一个搜索条件');
          return false;
        }
        this.searching = true;
        this.surveillanceIds = [];
        let params = {
          startTime: formatDate(this.searchData.time1, 'yyyy-MM-dd HH:mm:ss'),
          endTime: formatDate(this.searchData.time2, 'yyyy-MM-dd HH:mm:ss'),
          personGroupId: this.searchData.portraitGroupId || "" ,
//        personGroupId: '1lwx3mJIbdF4c4vEgpyLk0' ,
          // sex: this.searchData.sex || "",
          // age: this.searchData.ageGroup || "" ,
        }
        console.log(this.searchData.ageGroup);

        if(this.searchData.sex){
          params.sex=this.searchData.sex
        }
        if(this.searchData.ageGroup){
          params.age=this.searchData.ageGroup
        }
        let dNameList = [];
        let dList = this.selectDevice.map(res =>  res.deviceName);
        let bList = this.selectBayonet.map(res => res.bayonetName);
        dNameList = dList.concat(bList);
        console.log(dNameList, this.selectDevice)
        if (dNameList.length > 3) {
          params['deviceNames'] = dNameList.splice(0, 2);
          params['deviceNames'].push('等' + dNameList.length + '个设备');
          params['deviceNames'] =  params['deviceNames'].join(',')
        } else {
          params['deviceNames'] = dNameList.join(',')
        }
        if (this.selectBayonet.length) {
          params['bayonetIds'] = this.selectBayonet.map(res => res.uid).join(',');
        }
        if (this.selectDevice.length) {
          params['deviceIds'] = this.selectDevice.map(res => res.uid).join(',');
        }
        params['portraitGroupName'] = this.portraitGroupList.find(y => y.uid === this.searchData.portraitGroupId).groupName;
        params.taskId = this.$route.query.uid;
        params.taskOperationType = '2';
        PortraitPostFocusTask(params).then(res => {
          this.searching = false;
          if (res && res.data) {
            this.$message({
              type: 'success',
              message: '修改成功',
              customClass: 'request_tip'
            })
            this.$router.push({name: 'portrait_zdgz'})
          }
        })
      },


      randerMap () {
        this.$nextTick(() => {
          this.amap.clearMap();
          this.drawMarkers(this.evData);
        })
      },
      // 获取离线任务详情
      getDetail () {
        const id = this.$route.query.uid
        if (id) {
          getPeopleTaskDetail(id)
              .then(res => {
                if (res) {
                  this.$set(res.data, 'taskResult', JSON.parse(res.data.taskResult));
                  this.$set(res.data, 'taskWebParam', JSON.parse(res.data.taskWebParam));
                  res.data.taskWebParam.deviceNames = res.data.taskWebParam.deviceNames.split(',')
                  this.evData = res.data.taskResult;
                  this.taskDetail = res.data.taskWebParam;
                  console.log(res.data)
                  this.randerMap(this.evData)
                }
              })
        }
      },
      mapZoomSet(val) {
        if (this.amap) {
          this.amap.setZoom(this.amap.getZoom() + val);
        }
      },
      resemt(){
        if (this.amap) {
          this.amap.setZoomAndCenter(14, mapXupuxian.center);
        }
      },
      drawMarkers (data) {
        console.log(data);

        for (let  i = 0; i < data.length; i++) {
          let obj = data[i];
          let _idWin = 'vlJfoImg' + i;
          if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
            let name = '', className = 'vl_icon_map_mark0';
            if (obj.bayonetName) {
              name = obj.bayonetName;
              className = 'vl_icon_map_mark1'
            } else {
              name = obj.deviceName
            }
            let _sContent = `<div id="${_idWin}" class="vl_jig_mk_img"><img src="${obj.subStoragePath}"><div><p>${name}</p><p>抓拍${obj.shotNum}次</p></div></div>`;
            // 窗体
            new AMap.Marker({ // 添加自定义点标记
              map: this.amap,
              position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
              offset: new AMap.Pixel(-50, -144), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: obj,
              // 自定义点标记覆盖物内容
              content: _sContent
            });
            // 摄像头
            let _id = 'vlJfoSxt' + i;
            let _content = '<div id=' + _id + ' class="vl_icon ' + className + ' "></div>'
            new AMap.Marker({ // 添加自定义点标记
              map: this.amap,
              position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
              offset: new AMap.Pixel(-28.5, -50), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: obj,
              // 自定义点标记覆盖物内容
              content: _content
            });
            setTimeout(() => {
              this.addListen($('#' + _id), 'mouseover', i, obj);
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
              $('#vlJfoImg' + key).addClass('vl_jig_mk_img_hover');
              if (obj.bayonetName) {
                $('#vlJfoSxt' + key).addClass('vl_icon_map_hover_mark1');
              } else {
                $('#vlJfoSxt' + key).addClass('vl_icon_judge_02');
              }
              break;
            case 'mouseout':
              if (!obj.checked) {
                $('#vlJfoImg' + key).removeClass('vl_jig_mk_img_hover')
                if (obj.bayonetName) {
                  $('#vlJfoSxt' + key).removeClass('vl_icon_map_hover_mark1');
                } else {
                  $('#vlJfoSxt' + key).removeClass('vl_icon_judge_02');
                }
              }
              break;
            case 'click':
              _key  = self.curVideo.indexNum;
              self.evData.forEach(z => {
                z.checked = false;
              })
              obj.checked = true;
              if (_key !== null) {
                $('#vlJfoImg' + _key).removeClass('vl_jig_mk_img_hover')
                if (obj.bayonetName) {
                  $('#vlJfoSxt' + _key).removeClass('vl_icon_map_hover_mark1');
                } else {
                  $('#vlJfoSxt' + _key).removeClass('vl_icon_judge_02');
                }
              }
              $('#vlJfoImg' + key).addClass('vl_jig_mk_img_hover')
              if (obj.bayonetName) {
                $('#vlJfoSxt' + key).addClass('vl_icon_map_hover_mark1');
              } else {
                $('#vlJfoSxt' + key).addClass('vl_icon_judge_02');
              }
              self.showVideo(obj);
              break;
          }
        })
      },
      showVideo (data) {
        console.log(data)
        this.curVideo.indexNum = this.evData.indexOf(data);
        this.curSXT = data;
        this.showVideoList = true;
        this.curVideo.videoList = data.focusList.map(x => {
          this.setPlayerData(x);
          return x;
        });
      },
      setPlayerData (obj) {
        if (obj.videoPath) {
          obj.playerData = {
            type: 3,
            title: obj.deviceName,
            video: {
              uid: new Date().getTime() + '',
              downUrl: obj.videoPath
            }
          }
        } else {
          obj.playerData = null;
        }
      },
      hideVideoList () {
        this.evData.forEach(x => x.checked = false);
        const _key = this.curVideo.indexNum;
        $('#vlJfoImg' + _key).removeClass('vl_jig_mk_img_hover')
        if (document.getElementById('vlJfoSxt' + _key).classList.contains('vl_icon_map_hover_mark1')) {
          $('#vlJfoSxt' + _key).removeClass('vl_icon_map_hover_mark1')
        } else {
          $('#vlJfoSxt' + _key).removeClass('vl_icon_judge_02')
        }
        this.curVideo.indexNum = null;
        this.showVideoList = false;
      }
    },
    watch: {}
  }
</script>
<style lang="scss">
  .vl_jfo_right {
    position: absolute;
    right: 0;
    top: 0;
    width: 2.6rem;
    height: 100%;
    padding: 0.08rem .2rem .2rem .2rem;
    box-shadow: 0px 10px 12px 0px rgba(4,24,54,0.2);
    background: #ffffff;
    &:hover {
      .vl_jig_right_close {
        display: block;
      }
    }
    .video_container {
      height: calc(100% - 30px);
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
    }
    .vl_jig_right_title {
      width: 2.2rem;
      color: #333333;
      >p {
        width: 100%;
        display: flex;
        align-items: center;
        i {
          margin-right: 5px;
        }
        span {
          width: calc(100% - 17px);
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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


  .vl_judge_tc {
    .Breadc{
      position: absolute;
      top: 0px;
      width: 100%;
      height: 50px;
      left: 0px;
    }
    position: relative;

    width: 100%;
    height: 100%;
    .camera-select {
      .el-select-dropdown {
        display: none;
      }
      .el-select__tags {
        >span {
          white-space: nowrap;
          display: block;
          width: 100%;
          overflow: hidden;
        }
      }
    }
    .vl_j_left {
      position: relative;
      z-index: 11;
      float: left;
      width: 272px;
      min-height: 547px;
      padding-top: 24px;
      height: 100%;
      // margin-left: 0.2rem;
      background: #ffffff;
      box-shadow:4px 0px 10px 0px #838383;
      box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
      animation: fadeInLeft .4s ease-out .3s both;
      .vl_ytsr_left_line {
        color: #555555;
        margin-bottom: 20px;
        display: flex;
        span {
          /*width: 70px;*/
          text-align: right;
          display: block;
          color: #999999;
          p {
            color: #555555;
            text-align: left;
          }
          &:first-child {
            width: 85px;
          }
        }
      }
      .update_task {
        text-align: center;
      }
    }
    .vl_j_right {
      display: inline-block;
      width: calc(100% - 272px);
      height: calc(100% - 5px);
      position: relative;
      #tcMap {
        width: 100%;
        height: 100%;
      }
    }
    .close_btn {
      position: absolute;
      top: 30px;
      right: 30px;
      font-size: .3rem;
      cursor: pointer;
      &:hover {
        color: #409EFF;
      }
    }
    .vl_jtc_mk {
      width: 2.18rem;
      height: 1.22rem;
      position: relative;
      > video {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
      }
      > p {
        width: 100%;
        position: absolute;
        color: #FFFFFF;
        bottom: .08rem;
        font-size: .12rem;
        padding: 0 .06rem;
        line-height: 20px;
        > i {
          height: 20px;
          float: right;
          vertical-align: middle;
        }
      }
    }
    .vl_jtc_mk_check {
      > input {
        position: absolute;
        top: 0;
        right: 0;
        &:after {
          position: absolute;
          width: 14px;
          height: 14px;
          top: 0;
          content: '';
          background-color: #FFFFFF;
          color: #fff;
          display: block;
          border: 1px solid #409EFF;
          line-height: 11px;
          text-align: center;
          border-radius: 3px;
        }
      }
      > input:checked {
        &:after {
          background-color: #409EFF;
          content: '✓';
          font-size: 10px;
        }
      }
    }
    .history-pic-dialog {
      .el-dialog {
        max-width: 12.6rem;
        width: 100%!important;
      }
      .el-dialog__title {
        font-size: .16rem;
        color: #333333;
      }
      .el-dialog__body {
        padding: 0 .76rem .3rem;
      }
      .his-pic-box {
        width: 100%;
        height: 4.6rem!important;
        .his-pic-item {
          float: left;
          width: 1.38rem;
          height: 1.38rem;
          border: .02rem solid #FFFFFF;
          margin-right: .2rem;
          margin-bottom: .2rem;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .active {
          border-color: #0C70F8;
        }
      }
      .el-dialog__footer {
        button {
          width: 1.4rem!important;
          height: .4rem;
          line-height: .4rem;
          padding: 0;
        }
      }
    }
    .vl_jig_mk_img {
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
    .vl_jig_mk_img_hover {
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
    .vl_jfo_sxt {
      -webkit-transition: 0s all!important;
      -moz-transition: 0s all!important;
      -ms-transition: 0s all!important;
      -o-transition: 0s all!important;
      transition: 0s all!important;
    }
  }
  .judge_content {
    .el-dialog__wrapper .el-dialog__body {
      padding: 0px;
    }
    .el-dialog__header {
      padding: 0px 20px 3px;
    }
    .el-dialog__headerbtn {
      z-index: 1;
    }
  }
</style>
<style lang="scss" scoped="scoped">
  .map_rrt_u2 {
    position: absolute; right: 30px;
    bottom: 30px;
    margin-top: .2rem;
    font-size: 26px;
    background: #ffffff;
    width: 78px;
    padding: 0 10px;
    > li {
      line-height: 70px;
      text-align: center;
      cursor: pointer;
      border-bottom: 1px solid #F2F2F2;
      > i {
        margin-top: 0;
        display: inline-block;
      }
      color: #999999;
      &:hover {
        color: #0C70F8;
      }
    }
  }
  .vl_judge_tc{
    padding-top: 50px;
  }
  .full {
    width: 100%;
  }
  .select_btn {
    background-color: #0c70f8;
    color: #ffffff;
  }
  .select_btn:hover {
    background-color: #0466de;
  }
  .judge_content {
    height: 100%;

  }
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
  .event_status {
    &:before {
      content: '.';
      font-size: 30px;
      margin-right: 4px;
      vertical-align: super;
    }
  }
  .untreated_event {
    &:before {
      color: #0C70F8;
    }
  }
  .treating_event {
    &:before {
      color: #63C751;
    }
  }
  .end_event {
    &:before {
      color: #B8B8B8;
    }
  }
</style>