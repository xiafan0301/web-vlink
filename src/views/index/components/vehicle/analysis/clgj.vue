<template>
  <div class="point">
    <div class="">
      <div
              v-show="!isCut"
              is="vlBreadcrumb"
              :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle_menu'},
          {name: '车辆轨迹'}]"
      ></div>
    </div>

    <div :class="['left',{hide:hideleft}]">
      <div class="plane">
        <el-form
            :model="ruleForm"
            status-icon
            ref="ruleForm"
            label-width="0px"
            class="demo-ruleForm_clgj"
          >
          <el-form-item class="" prop="data1">
            <el-date-picker
              v-model="ruleForm.data1"
              style="width: 100%;"
              class="vl_date"
              :picker-options="pickerOptions"
              :time-arrow-control="true"
              type="datetime"
              value-format="timestamp"
              placeholder="请选择开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              style="width: 100%;"
              class="vl_date vl_date_end"
              :time-arrow-control="true"
              :picker-options="pickerOptions"
              v-model="ruleForm.data2"
              @change="chooseEndTime"
              value-format="timestamp"
              type="datetime"
              placeholder="请选择结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="input5">
            <div class="per-semblance per-semblance-is-max" v-if="ruleForm.input3.length >= 6"><el-input placeholder="已添加6辆车" :disabled="true"></el-input><i class="el-icon-circle-plus"></i></div>
            <div class="per-semblance" v-else><el-input placeholder="输入车牌号" v-model="ruleForm.input5"></el-input><i class="el-icon-circle-plus" @click="addPlateNo"></i></div>
          </el-form-item>
          <div class="add-plate-no">
            <div class="plate-item" v-for="(item, index) in ruleForm.input3" :key="item.id">
              <div>车牌号码{{index + 1}}：<span>{{item}}</span></div><i class="el-icon-remove" @click="removePlateNo(index)"></i>
            </div>
          </div>
          <el-form-item>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-button @click="resetForm('ruleForm')" class="full">重置</el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" :loading="serarchLoading" @click="submitForm()" class="select_btn full">分析</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div class="insetLeft vl_icon vl_icon_vehicle_02" :class="{'vl_icon_vehicle_03': hideleft}" @click="hideLeft"></div>
        <!--车辆切换列表-->
        <!-- <div class="clgj-s-list">
          <div v-for="(item, index) in evData" :key="item.id" :class="{'active': index === activeList}" @click="plateTap(item,index)">{{item.plateNo}}</div>
        </div> -->
      </div>
    </div>
    <div :class="['right',{hide:!hideleft}]" id="rightMap"></div>
     <!--地图操作按钮-->
    <ul class="map_rrt_u2_clgj">
      <li @click="resetZoom"><i class="el-icon-aim"></i></li>
      <li @click="mapZoomSet(1)"><i class="el-icon-plus"></i></li>
      <li @click="mapZoomSet(-1)"><i class="el-icon-minus"></i></li>
    </ul>
    <!--左侧车牌-->
    <div class="left_plate">
      <div v-for="(item,index) in evData" :key="'plate_'+index" class="plate_box">
        <template v-if="item.plateNo">
          <p :class="{'is_highlight': index === activeList}" @click="plateTap(item,index)">{{item.plateNo}}</p>
          <ul class="select_box" v-if="item.isShowBox">
            <li><el-checkbox v-model="selectShow.speed">车速信息</el-checkbox></li>
            <li><el-checkbox v-model="selectShow.snap">抓拍图片</el-checkbox></li>
            <li class="video_select">
              <div class="video_bg" :class="{'active': selectShow.video}" @click="slectVideo">
                <i class="vl_icon vl_icon_clgj_video"></i><span class="video_icon">视频接力</span>
              </div>
            </li>
          </ul>
        </template>
      </div>
    </div>
    <!--右侧区域列表-->
    <!-- 车速信息 -->
    <div class="speed_info" v-if="selectShow.speed">
      <vue-scroll>
        <div class="speed_box">
          <ul class="simple_speed">
            <li class="speed_title">
              <p>2019-9-30 15:05:18</p>
              <p>平均速度</p>
            </li>
            <li class="speed_addr">
              <p class="addr_name">新姚南路与黑石铺路交叉路口</p>
              <p class="num">35</p>
            </li>
            <li class="speed_distance">
              <p class="dis_desc">两次抓拍距离: <span class="dis_num">0.7 KM</span></p>
              <p>KM/H</p>
            </li>
          </ul>
          <ul class="simple_speed">
            <li class="speed_title">
              <p>2019-9-30 15:05:18</p>
              <p>平均速度</p>
            </li>
            <li class="speed_addr">
              <p class="addr_name">新姚南路与黑石铺路交叉路口</p>
              <p class="num">35</p>
            </li>
            <li class="speed_distance">
              <p class="dis_desc">两次抓拍距离: <span class="dis_num">0.7 KM</span></p>
              <p>KM/H</p>
            </li>
          </ul>
          <ul class="simple_speed">
            <li class="speed_title">
              <p>2019-9-30 15:05:18</p>
              <p>平均速度</p>
            </li>
            <li class="speed_addr">
              <p class="addr_name">新姚南路与黑石铺路交叉路口</p>
              <p class="num">35</p>
            </li>
            <li class="speed_distance">
              <p class="dis_desc">两次抓拍距离: <span class="dis_num">0.7 KM</span></p>
              <p>KM/H</p>
            </li>
          </ul>
        </div>
      </vue-scroll>
    </div>
    

    <div is="vlDialog" :detailData="detailData"></div>
  </div>
</template>
<script>
  import vlBreadcrumb from "@/components/common/breadcrumb.vue";
  import vlDialog from '../common/vl-dialog.vue';
  import { mapXupuxian } from "@/config/config.js";
  import { objDeepCopy, formatDate } from "@/utils/util.js";
  import { cityCode } from "@/utils/data.js";
  import { InvestigateGetTrace } from "@/views/index/api/api.judge.js";
  export default {
    components: {vlBreadcrumb, vlDialog},
    data() {
      return {
        isCut: false, // 是否为截屏跳转.
        detailData: null,
        activeList: 0,
        serarchLoading: false,
        selectMapClear: '',
        curChooseNum: '已选择0个设备',
        hover:null,
        input3: null,
        mouseTool: null,
        drawArea: null,
        amap: null,
        map: null,
        pointData: {
          deviceList: [],
          bayonetList: []
        },
        hideleft: false,
        timeOrder: false,
        ruleForm: {
          data1:null,
          data2: null,
          input5: '', // 当前输入的车牌号
          input3: [],
        },
        pricecode:cityCode,
        pickerOptions: {
          disabledDate (time) {
            return time > new Date();
          }
        },
        evData: [],
        curEvData: [],
        originEvData: [],
        marks: [[], []],
        markerLine: [], // 地图线集合
        markerPoint: [], // 地图点集合
        supMarkerPoint: null,
        curStrucList: [],
        strucCurTab: 1,
        curImgIndex: 0,
        sturcDetail: {},
        playing: false, // 视频播放是否
        strucDetailDialog: false,
        videoUrl: '', // 弹窗视频回放里的视频

        selectShow: {
          speed: false,
          snap: false,
          video: false,
        },
        plateList: [],
        selectPlate: '',
      };
    },
    mounted() {
      if (this.$route.query.plateNo) {
        this.ruleForm.input3 = this.$route.query.plateNo.split(',').splice(0, 6)
//        this.ruleForm.input5 = this.$route.query.plateNo;
      }
      if (this.$route.query.isCut) {
        this.isCut = true;
      }
      this.renderMap();
      this.setDTime();
    },
    methods: {
      //视频接力选中
      slectVideo() {
        this.selectShow.video = !this.selectShow.video
      },
      //车速列表展示
      plateTap(item,index) {
        this.amap.clearMap();
        this.activeList = index;
        if(item.traceList && item.traceList.length > 0) {
          this.filterData();
          this.drawLine();
        }
        this.evData.forEach(key => {
          this.$set(key, 'isShowBox', false)
        })
        this.$set(this.evData[index], 'isShowBox' , true)
        this.selectShow.speed = false
        this.selectShow.snap = false
        this.selectShow.video = false
        
        console.log("this",this.evData)
      },
      addPlateNo () {
        if (!this.ruleForm.input5.replace(/\s+|\s+$/g, '')) {
          if (!document.querySelector('.el-message--info')) {
            this.$message.info('车牌号码不能为空')
          }
        }else {
          if (this.ruleForm.input3.includes(this.ruleForm.input5.replace(/\s+|\s+$/g, ''))) {
            if (!document.querySelector('.el-message--info')) {
              this.$message.info('该车牌号码已经添加了')
            }
          } else {
            this.ruleForm.input3.push(this.ruleForm.input5.replace(/\s+|\s+$/g, ''))
            this.ruleForm.input5 = '';
          }
        }
      },
      removePlateNo (index) {
        this.ruleForm.input3.splice(index, 1)
      },
      chooseEndTime (e) {
        if (e < this.ruleForm.data1) {
          this.$message.info('结束时间必须大于开始时间才会有结果')
        }
      },
      mapZoomSet (val) {
        if (this.amap) {
          this.amap.setZoom(this.amap.getZoom() + val);
        }
      },
      resetZoom () {
        if (this.amap) {
          this.amap.setZoomAndCenter(14, mapXupuxian.center);
        }
      },
      setDTime () {
        let date = new Date();
        let curDate = date.getTime();
        let curS = 1 * 24 * 3600 * 1000;
        let _sDate = new Date(curDate - curS);
        let _s = _sDate.getFullYear()+ '-' + (_sDate.getMonth() + 1) + '-' + _sDate.getDate() + ' 00:00:00' ;
        this.ruleForm.data1 = new Date(_s).getTime();
        this.ruleForm.data2 = curDate;
      },
      hideLeft() {
        this.hideleft = !this.hideleft;
      },
      submitForm() {
        if(this.ruleForm && this.ruleForm.data1 && this.ruleForm.data2){
          if (this.ruleForm.input3.length || this.ruleForm.input5) {
            let pg = {
              vehicleNumber: ''
            }
            if (this.ruleForm.input3.includes(this.ruleForm.input5.replace(/\s+|\s+$/g, ''))) {
              if (!document.querySelector('.el-message--info')) {
                this.$message.info('输入框内的车牌已经添加了')
              }
              return false;
            }
            pg['startTime'] = formatDate(this.ruleForm.data1, 'yyyy-MM-dd HH:mm:ss');
            pg['endTime'] = formatDate(this.ruleForm.data2, 'yyyy-MM-dd HH:mm:ss');
//            if (this.ruleForm.input3.length) {
//              pg['vehicleNumber'] += this.ruleForm.input3.join(',');
//            }
            pg['vehicleNumber'] = this.ruleForm.input3.concat(this.ruleForm.input5).join(',')

            this.getVehicleShot(pg);
          } else {
            if (!document.querySelector('.el-message--info')) {
              this.$message.info("请输入车牌号码。");
            }
          }
        }else{
          if (!document.querySelector('.el-message--info')) {
            this.$message.info("请输入开始和结束时间。");
          }
        }
      },
      resetForm(){
        this.ruleForm.input3 = [];
        this.ruleForm.input5 = '';
        this.setDTime ();
        //this.$refs[v].resetFields();
      },

      renderMap() {
        let map = new window.AMap.Map("rightMap", {
          zoom: 10,
          center: mapXupuxian.center
        });
        map.setMapStyle("amap://styles/whitesmoke");
        this.amap = map;
      },
      getVehicleShot(d, bool) {
        this.activeList = 0;
        if (!bool) {
          this.serarchLoading = true;
        }
        this.count = 10;
        /* this.plateList = d.vehicleNumber.split(",").filter(v => v)
        this.plateList = this.plateList.map(p => {
          return {vehicleNumber: p, isShowBox: false}
        })
        console.log("1111111111111111",this.plateList) */
        InvestigateGetTrace(d).then(res => {
          this.serarchLoading = false;
          if (res) {
            // console.log(res);
            this.amap.clearMap();
            if (!res.data || res.data.length === 0) {
              this.$message.info("抱歉，没有找到匹配结果");
              return false;
            }
//            this.evData = res.data;
            res.data.forEach(x => {
              if(x.traceList && x.traceList.length > 0) {
                x.traceList.forEach(y => {
                  if (y.bayonetName) {
                    y.DeviceID = y.bayonetName;
                  }
                })
              }
            })
            console.log(res.data)
            this.originEvData = objDeepCopy(res.data);
            this.filterData();
            this.drawLine();
          }
        }).catch(() => {
          this.serarchLoading = false;
        });
      },
      filterData () {
        let _arr = [];
        this.evData = objDeepCopy(this.originEvData);
        this.evData.forEach((z, index) => {
          this.$set(z, 'isShowBox', false)
          if(z.traceList && z.traceList.length > 0) {
            z.traceList.forEach(x => {
              // 是否显示时间
              if (index === this.activeList) {
                x['showTime'] = true;
              } else {
                x['showTime'] = false;
              }
              // 判断是不是有卡口
              if (x.bayonetName) {
                x['dataType'] = 8;
              } else {
                x['dataType'] = 0;
              }
              let _i = _arr.findIndex(y => y.DeviceID === x.DeviceID);
              if (_i === -1) {
                _arr.push(x);
              } else {
                if (index === this.activeList) {
                  // 判断出现的重复点是不是同一辆车的
                  if (x.plateNo === _arr[_i].plateNo) {
                    _arr[_i]['shotTime'] += ',' + x.shotTime;
                    console.log('_arr[_i]', _arr[_i]['shotTime'])
                  } else {
                    x['simLength'] += 1;
                    _arr.splice(_i, 1, x);
                  }
                } else {
                  if (x.plateNo === _arr[_i].plateNo) {
                    _arr[_i]['shotTime'] += ',' + x.shotTime;
                  } else {
                    _arr[_i]['simLength'] += 1;
                  }
                }
              }
            })
          }
        });
        this.$set(this.evData[0], 'isShowBox' , true)
        _arr.forEach(x => {
          let b = true;
          this.evData.forEach(y => {
            if (y.traceList.findIndex(z => z.DeviceID === x.DeviceID) === -1){
              b = false;
            }
          })
          if (b && this.evData.length > 1) {
            if (x.bayonetName) {
              x['dataType'] = 12;
            } else {
              x['dataType'] = 13;
            }
          }
        })
        this.curEvData = this.originEvData[this.activeList].traceList;
        this.drawMapMarker(_arr);
      },
      //查询所有的卡口设备
      // 地图标记
      mapHoverInfo (data) {
        let str = '<div class="vl_map_hover_main"><ul>';
        if (data.dataType === 0) {
          str += '<li><span>设备名称：</span><p>' + data.infoName + '</p></li>';
          str += '<li><span>设备地址：</span><p>' + data.address + '</p></li>';
          str += '</ul></div>'
        } else if (data.dataType === 1) {
          str += '<li><span>卡口名称：</span><p>' + data.infoName + '</p></li>';
          str += '<li><span>卡口编号：</span><p>' + data.bayonetNo + '</p></li>';
          str += '<li><span>地理位置：</span><p>' + data.bayonetAddress + '</p></li>';
//          str += '<li><span>设备数量：</span><p>' + data.devNum + '</p></li>';
          str += '</ul></div>'
        }
        return str;
      },
      drawMapMarker (data) {
        for (let  i = 0; i < data.length; i++) {
          let obj = data[i];
          if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
            let $id = 'mapMark' + obj.dataType + obj.DeviceID;
            let _time = '', isStartEnd = false;
            if (obj.showTime) {
              _time = '<p class="vl_map_mark_time">';
              obj.shotTime.split(',').forEach(j => {
                _time += `<span>${j}</span>`
              })
              _time += '</p>';
            }
            let _content = `<div id="${$id}" class="vl_icon right_map_icon vl_icon_map_mark` + obj.dataType + `">` + _time + `</div>`
            // 判断是不是起止点
            let curList = this.evData[this.activeList].traceList;
            if (obj.DeviceID === curList[curList.length - 1].DeviceID) {
              _content = `<div id="${$id}" class="vl_icon vl_icon_map_mark_start">` + _time + `</div>`;
              isStartEnd = true;
            }
            if (obj.DeviceID === curList[0].DeviceID) {
              _content = `<div id="${$id}" class="vl_icon vl_icon_map_mark_end">` + _time + `</div>`;
              isStartEnd = true;
            }
            let point = new window.AMap.Marker({ // 添加自定义点标记
              map: this.amap,
              position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
              offset: new window.AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              // 自定义点标记覆盖物内容
              content: _content
            });
            point.on('click', () => {
              if (obj.showTime) {
                let newObj = objDeepCopy(obj);
                newObj.shotTime = newObj.shotTime.split(',')[0];
                this.showStrucInfo(newObj, i)
              }
            })
            this.markerPoint[i] = point;
            if (!isStartEnd) {
              point.on('mouseover', function () {
                $('#' + $id).addClass('vl_icon_map_hover_mark' + obj.dataType)
              })
              point.on('mouseout', function () {
                $('#' + $id).removeClass('vl_icon_map_hover_mark' + obj.dataType)
              })
            }
          }
        }
        this.amap.setFitView()
      },
      drawLine () {
        this.evData.forEach((x, index)  => {
          let path = [];
          x.traceList.forEach(y => {
            if (y.shotPlaceLatitude && y.shotPlaceLongitude) {
              let _path = [y.shotPlaceLongitude, y.shotPlaceLatitude];
              path.push(_path);
            }
          })
          var polyline = new window.AMap.Polyline({
            path: path,
            showDir: true,
            strokeColor: index === this.activeList ? '#61C772' : '#086AEA',
            strokeWeight: index === this.activeList ? 6 : 3,
            zIndex: index === this.activeList ? 6 : 4,
            extData: index
//            strokeOpacity: index === this.activeList ? 1 : 0,
          });
          polyline.on('click', ()=> {
            let aIndex = polyline.getExtData();
            if(aIndex !== this.activeList) {
              this.plateTap(x,aIndex)
            }
          })
          this.markerLine.push(polyline);
          this.amap.add([polyline]);
        })
      }, // 画线
      showStrucInfo (data, index) {
        this.amap.setZoomAndCenter(16, [data.shotPlaceLongitude, data.shotPlaceLatitude])
        this.curImgIndex = index;
        this.detailData = {
          index: index,
          list: this.curEvData
        }
      }
    }
  };
</script>
<style lang="scss">
  #rightMap {
    .vl_icon {
      width: 47px;
      position: relative;
      > .vl_map_mark_time {
        position: absolute; top: 10px; left: 98%;
        width: 130px;
        word-break:keep-all; 
        font-size: 12px; color: #fff;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 2px;
        padding: 2px 5px;
        span{
          display: block;
        }
      }
    }
    .vl_icon.vl_icon_map_mark_start {
      width: 80px;
      height: 80px;
      right: 20px;
    }
    .vl_icon.vl_icon_map_mark_end {
      width: 80px;
      height: 80px;
    }
  }
</style>
<style lang="scss" scoped>
  .add-plate-no {
    padding-left: 10px;
    .plate-item {
      height: 32px;
      line-height: 32px;
      margin-bottom: 10px;
      >div {
        width: 194px;
        display: inline-block;
        margin-right: 8px;
        color: #999999;
        span {
          color: #333333;
        }
      }
      > i{
        color: #D3D3D3;
        cursor: pointer;
        font-size: 20px;
        &:hover {
          color: #FA453A;
        }
      }
    }
  }
  .map_rrt_u2_clgj {
    position: absolute; right: 20px;
    bottom: 20px;
    margin-top: .2rem;
    font-size: 26px;
    background: #ffffff;
    width: 0.78rem;
    padding: 0 .1rem;
    > li {
      line-height: .7rem;
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
  .point {
    width: 100%;
    height: 100%;
  }
  .breadcrumb_heaer {
    background: #ffffff;
    border-bottom: 1px solid #D3D3D3;
  }
  .full {
    width: 100%;
  }
  .insetPadding {
    padding: 10px;
    height: 100%;
  }
  .right.hide {
    width: calc(100% - 272px);
    height: calc(100% - 55px);
    float: right;
  }
  .right {
    width: 100%;
    height: calc(100% - 55px);
    float: right;
  }
  .left.hide {
    margin-left: -272px;
    transition: marginLeft 0.3s ease-in;
    position: relative;
    z-index: 2;
    // animation: fadeOutLeft 0.4s ease-out 0.3s both;
  }
  .left {
    position: relative;
    width: 272px;
    height: calc(100% - 55px);
    background-color: #ffffff;
    float: left;
    z-index: 1;
    margin-left: 0px;
    /*box-shadow: 4px 0px 10px 0px #838383;*/
    /*box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);*/
    animation: fadeInLeft 0.4s ease-out 0.3s both;
    transition: marginLeft 0.3s ease-in;
    .plane {
      padding: 20px;
      position: relative;
      height: 100%;
    }
    .line40 {
      line-height: 40px;
    }
    .inset {
      display: inline-block;
      line-height: 40px;
      font-style: normal;
    }
    .firstItem {
      margin-bottom: 5px;
    }
  }
  .insetLeft {
    position: absolute;
    right: -28px;
    width: 25px;
    height: 178px;
    top: 50%;
    margin-top: -89px;
    display: inline-block;
    cursor: pointer;
  }
  .clgj-s-list {
    position: absolute;
    top: 15px;
    left: 298px;
    display: flex;
    > div {
      width: 92px;
      height: 40px;
      background: #F6F8F9;
      border: 1px solid #D3D3D3;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      text-align: center;
      line-height: 40px;
      color: #999999;
      cursor: pointer;
      margin-right: 10px;
      &:hover {
        background: #0C70F8;
        color: #ffffff;
        border-color: #0C70F8;
      }
    }
    .active {
      background: #0C70F8;
      color: #ffffff;
      border-color: #0C70F8;
    }
  }
  .hide {
    .insetLeft {
    }
  }
  .insetLeft2 {
    position: absolute;
    right: -28px;
    width: 28px;
    height: 178px;
    top: 50%;
    margin-top: -89px;
    display: inline-block;
    background-repeat: no-repeat;
    transform: rotate(180deg);
    background-image: url(../../../../../assets/img/icons.png);
    background-position: -318px -1269px;
    cursor: pointer;
  }
  .select_btn {
    background-color: #0c70f8;
    color: #ffffff;
  }
  .plane_main_box {
    height: calc(100% - 100px);
    padding-top: 10px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .plane_main {
    .p_main_list {
      height: 40px;
      overflow: hidden;
      -webkit-transition: all .3s;
      -moz-transition: all .3s;
      -ms-transition: all .3s;
      -o-transition: all .3s;
      transition: all .3s;
      .p_main_head {
        height: 40px;
        line-height: 40px;
        background: #F6F6F6;
        cursor: pointer;
        text-indent: 6px;
        border-bottom: 1px solid #F2F2F2;
        i{
          color: #999999;
        }
      }
      .p_main_item {
        width: 100%;
        height: 39px;
        cursor: pointer;
        &:hover{
          background: #E0F3FF;
          color: #0C70F8;
        }
        >div {
          display: inline-block;
          width: 50%;
          text-align: center;
          line-height: 39px;
          color: #666666;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          border-bottom: 1px solid #F2F2F2;
          &:first-child {
            width: 46%;
          }
        }
      }
    }
    .is_open {
      height: auto;
    }
    .th-center-pagination {
      text-align: center;
    }
  }
  .mapbox {
    width: 100%;
    height: 500px;
    .shrink {
      background: #ffffff;
      padding: 1px;
      position: absolute;
      right: 20px;
      bottom: 90px;
      box-shadow: 3px 4px 5px -5px #666666;
      span {
        display: block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        font-size: 28px;
        font-weight: normal;
        cursor: pointer;
        &:first-child {
          border-bottom: solid 1px #dddddd;
        }
      }
      span:hover {
        color: #0c70f8;
      }
    }
    .select_btn {
      background-color: #0c70f8;
      color: #ffffff;
    }
  }
  .bottomBox{
    background: #ffffff;
    width: 100%;
    padding: 10px 10px;
    text-align: center;
  }
  .setPost {
    position: absolute;
    left: 20px;
    top: 20px;
    width: 300px;
    .drawBox {
      margin-top: 20px;
      background: #ffffff;
      padding: 10px;
      .items {
        padding-top: 20px;
        span {
          display: inline-block;
          width: 55px;
          height: 55px;
          text-align: center;
          line-height: 55px;
          border-right: solid 1px #eeeeee;
          cursor: pointer;
          &:last-child {
            border-right: none;
          }
        }
        .cut1 {
          background: url(../../../../../assets/img/vehicle/cut1.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut1.hover {
          background: #f2f9ff url(../../../../../assets/img/vehicle/cut1m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut2 {
          background: url(../../../../../assets/img/vehicle/cut2.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut2.hover {
          background: #f2f9ff url(../../../../../assets/img/vehicle/cut2m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut3 {
          background: url(../../../../../assets/img/vehicle/cut3.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut4 {
          background: url(../../../../../assets/img/vehicle/cut4.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut5 {
          background: url(../../../../../assets/img/vehicle/cut5.png) center
          no-repeat;
          background-size: 80% 80%;
        }
        .cut3.hover {
          background: #f2f9ff url(../../../../../assets/img/vehicle/cut3m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut4.hover {
          background: #f2f9ff url(../../../../../assets/img/vehicle/cut4m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut5.hover {
          background: #f2f9ff url(../../../../../assets/img/vehicle/cut5m.png) center
          no-repeat;
          background-size: 80% 80%;
        }
      }
    }
  }
  /* 左侧车牌 */
  .left_plate {
    position: absolute;
    left: 302px;
    top: 70px;
    color: #666;
    overflow: hidden;
    .plate_box {
      float: left;
      margin-right: 12px;
    }
    p {
      height: 50px;
      width: 120px;
      text-align: center;
      line-height: 50px;
      background: #fff;
      border: 1px solid #d3d3d3;
      cursor: pointer;
      &:hover {
        border: 0;
        color: #fff;
        background: linear-gradient(90deg,rgba(8,106,234,1) 0%,rgba(4,102,222,1) 100%);
      }
    }
    .is_highlight {
      border: 0;
      color: #fff;
      background: linear-gradient(90deg,rgba(8,106,234,1) 0%,rgba(4,102,222,1) 100%);
    }
    .select_box {
      width: 120px;
      text-align: center;
      margin-top: 12px;
      background-color: #fff;
      li {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #F2F2F2;
        margin: 0 16px;
        cursor: pointer;
        &:last-child {
          border-bottom: 0;
          margin: 0 13px;
          padding: 10px 0;
        }
        .video_icon {
          display: inline-block;
          padding-left: 6px;
          line-height: 19px;
        }
        .vl_icon_clgj_video { 
          width: 14px;
          height: 14px;
          background-position: -1064px -1538px;
          background-color: #666;
          border-radius: 50%;
          line-height: 1;
          vertical-align: middle;
          margin-bottom: 2px;
        }
      }
      .video_select {
        .video_bg {
          height: 30px;
          width: 96px;
          border-radius: 4px;
          line-height: 30px;
        }
        .active {
          background-color: #0C70F8;
          color: #fff;
          .vl_icon_clgj_video { 
            background-color: #0C70F8;
          }
        }
      }
    }
  }
  /* 车速信息 */
  .speed_info {
    position: absolute;
    top: 70px;
    right: 20px;
    width: 380px;
    background-color: #fff;
    box-shadow:0px 3px 10px 0px rgba(99,99,99,0.39);
    .speed_box {
      max-height: 4.2rem;
      .simple_speed {
        padding: 12px 0;
        margin: 0 20px;
        border-bottom: 1px solid #f2f2f2;
        li {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 0 2px 0 4px;
        }
        .speed_title {
          color: #999;
          font-size: 12px;
        }
        .speed_addr {
          font-size: 16px;
          color: #333;
          .addr_name {
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
            white-space: normal !important;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            padding-right: 20px;
          }
          .num {
            font-size: 32px;
            color: #0C70F8;
          }
        }
        .speed_distance {
          font-size: 14px;
          color: #333;
          .dis_desc {
            color: #666;
          }
          .dis_num {
            color: #0C70F8;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .cap_info_win {
    background: #FFFFFF;
    padding: .18rem;
    font-size: .14rem;
    color: #666666;
    position: relative;
    &:after {
      display: block;
      content: '';
      border: .1rem solid #FFFFFF;
      border-color: #FFFFFF transparent transparent;
      position: absolute;
      bottom: -.2rem;
      left: calc(50% - .05rem);
    }
  }
  .demo-ruleForm_clgj {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
  .data_range {
    .el-range__close-icon {
      display: none;
    }
  }
  .vl_jtc_mk {
    display: none;
    width: 218px;
    height: 122px;
    position: relative;
    > img {
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
      bottom: 8px;
      font-size: 12px;
      padding: 0 6px;
      line-height: 20px;
      > i {
        height: 20px;
        float: right;
        vertical-align: middle;
      }
    }
  }
  .vl_jig_mk_p {
    width: 180px;
    height: auto;
    background: #ffffff;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    box-shadow: 4px 0px 10px 0px #838383;
    box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
    .big {
      font-size: 16px;
      font-weight: bold;
    }
    &:after {
      border-bottom-color: rgba(0, 0, 0, 1);
      content: "";
      display: inline-block;
      position: absolute;
      left: 50%;
      margin-left: -10px;
      bottom: -10px;
      border-top: 10px solid #fff;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
    }
    &.vl_jig_mk_img_hover {
      &:after {
        border-bottom-color: rgba(0, 0, 0, 1);
        content: "";
        display: inline-block;
        position: absolute;
        left: 50%;
        margin-left: -10px;
        bottom: -10px;
        border-top: 10px solid #0c70f8;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
      }
      background: rgba(12, 112, 248, 1);
      position: relative;
      border: 0.04rem solid #0c70f8;
      > p {
        color: #ffffff;
      }
    }
  }
  .map_select {
    /deep/.el-dialog__body,.el-dialog__header {
      padding: 0px;
    }
    .el-dialog__headerbtn {
      z-index: 1;
    }
  }
  .per-semblance {
    position: relative;
    >span {
      position: absolute;
      left: 10px;
      display: block;
      height: 40px;
      line-height: 40px;
      z-index: 9;
      color: #999999;
    }
    >i {
      color: #0C70F8;
      cursor: pointer;
      font-size: 20px;
    }
    .el-input {
      width: 204px;
      margin-right: 8px;
      /*input{*/
        /*text-indent: 10px;*/
      /*}*/
    }
  }
  .per-semblance-is-max {
    >i {
      color: #D3D3D3;
      cursor: not-allowed;
    }
  }
  /* 左侧车牌 */
  .left_plate {
    .select_box {
      .el-checkbox__label {
        padding-left: 6px;
      }
      .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #1264F8;
      }
    }
  }
</style>
