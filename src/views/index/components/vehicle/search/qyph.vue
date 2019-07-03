<template>
  <div class="vl_ph_main">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>区域徘徊</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="vl_ph_content">
      <div class="mapbox" id="mapSelect"></div>
      <div class="setPost">
        <div>
          <el-input placeholder="请输入地名，快速定位地址" v-model="input3" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" class="select_btn" @click="setCenter()"></el-button>
          </el-input>
        </div>
        <div style="width: 272px;height: 100%;">
          <vue-scroll>
            <div class="search_main">
              <!--区域选择-->
              <div class="search_line">
                <span class="red_star">区域:</span>
                <span @click="activeArea = true" class="choose_btn vl_icon vl_icon_041"></span>
                <span class="choose_btn el-icon-delete" @click="clearArea"></span>
                <span class="choose_btn el-icon-location-outline" :class="{'not-active': !searchData.area}"></span>
                <div class="drawBox" v-show="activeArea">
                  <div class="items">
                    <span class="el-icon-arrow-left" @click="activeArea = false"></span>
                    <span @click="clickTab('cut1')" :class="['cut1',{'hover':hover=='cut1'}]"></span>
                    <span @click="clickTab('cut2')"  :class="['cut2',{'hover':hover=='cut2'}]"></span>
                    <span @click="clickTab('cut3')"  :class="['cut3',{'hover':hover=='cut3'}]"></span>
                    <span @click="clickTab('cut4')"  :class="['cut4',{'hover':hover=='cut4'}]"></span>
                    <span @click="clickTab('cut5')"  :class="['cut5',{'hover':hover=='cut5'}]"></span>
                  </div>
                </div>
              </div>
              <div class="search_line">
                <span class="time">开始</span>
                <el-date-picker
                        v-model="searchData.startTime"
                        style="width: 212px;"
                        :picker-options="pickerOptions"
                        type="datetime"
                        placeholder="选择日期时间">
                </el-date-picker>
              </div>
              <p class="red_star"></p>
              <div class="search_line">
                <span class="time">结束</span>
                <el-date-picker
                        style="width: 212px;"
                        :picker-options="pickerOptions1"
                        v-model="searchData.endTime"
                        type="datetime"
                        placeholder="选择日期时间">
                </el-date-picker>
              </div>
              <div class="search_line">
                <span class="red_star">频次：期间不少于 <el-input oninput="value=value.replace(/[^0-9.]/g,'')" style="width: 65px;" v-model="searchData.minTimes"></el-input> 次</span>
              </div>
              <el-divider></el-divider>
              <!--按钮-->
              <div class="search_btn">
                <el-button>重置</el-button>
                <el-button type="primary" @click="tcDiscuss">徘徊分析</el-button>
              </div>
            </div>
          </vue-scroll>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapXupuxian } from "@/config/config.js";
  import {MapGETmonitorList} from '../../../api/api.map.js';
  import { objDeepCopy, formatDate} from '../../../../../utils/util.js';
  export default {
    data() {
      return {
        map: null,
        input3: null,
        hover:null,
        // 选择区域
        activeArea: false,
        mouseTool: null,
        selAreaPolygon: null,
        delSelAreaIcon: null,
        lnglat:null,
        searchData: {
          area: null, // 区域
          startTime: '',
          endTime: '',
          minTimes: ''// 最少次数
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
        pickerOptions1: {
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
        mapTreeData: {},
        marks: [[], [], [], [], []],
        hoverWindow: null,// 全局信息窗口
      };
    },

    mounted() {
      this.renderMap();
      this.setDTime();
      this.getMapInfoList();
    },
    methods: {
      //获取地图信息列表
      getMapInfoList () {
        this.$_showLoading({target: '.vl_ph_content'})
        let params = {
          areaUid: '431224'
        }
        MapGETmonitorList(params)
            .then(res => {
              if (res) {
                this.mapTreeData = this.switchData(res.data);
                this.$_hideLoading();
                this.mapMark(this.mapTreeData.infoList);
              }
            })
      },
      // keys的各个props 代表接口返回的摄像头，人物，车辆，卡口的list的字段名及list里面元素name;;allKey
      switchData(data) {
        data['infoList'] = data.areaTreeList;
        data['infoName'] = data.areaName;
        data['infoList'].map(x => {
          x['infoName'] = x.areaName;
          x['isShow'] = true;
          // dataType = 0 摄像头，2车辆，1卡口，3人员,
          x['deviceBasicList'] = this.objSetItem(x['deviceBasicList'], {infoName: 'deviceName', areaType: '5', dataType: 0, isShow: true});
          x['bayonetList'] = this.objSetItem(x['bayonetList'], {infoName: 'bayonetName', areaType: '5', dataType: 1, areaUid: x.areaId, isShow: true});
          let oldArr = [...x['deviceBasicList'], ...x['bayonetList']];
          let newArr = objDeepCopy(oldArr)
          x['infoList'] = newArr;

          return x;
        })
        return data;
      },
      objSetItem (list, obj) {
        list.map(z => {
          for (let key in obj) {
            z[key] = z[obj[key]] ? z[obj[key]] : obj[key]
          }
          // 都加上markSid , 方便处理移动端发起的通话
          if (!z['markSid']) {
            z['markSid'] = 'mapMark' + z['dataType'] + z['uid'];
          }
          return z;
        })
        return list;
      },
      // 地图标记
      mapMark (data, isSetView) {
        if (data && data.length > 0) {
          let _this = this;
          for (let i = 0; i < data.length; i++) {
            data[i].infoList.forEach(obj => {
              if (obj.longitude > 0 && obj.latitude > 0) {
                let offSet = {0: [-15, -16],1: [-15, -16],2: [-15, -60],3: [-15, -16], 4: [-15, -16],5: [-15, -16]}, sDataType;
                if (obj.dataType === 0 && obj.deviceStatus !== 1) {
                  sDataType = 6;
                }else if (obj.dataType === 2) {
                  sDataType = '2' + obj.vehicleType
                } else {
                  sDataType = obj.dataType;
                }
                let uContent = '<div id="' + obj.markSid + '" class="map_icons vl_icon vl_icon_map_mark' + sDataType + '"></div>'
                if (obj.dataType === 2 && !_this.constObj[obj.dataType].supTypeList.includes(obj.vehicleType - 1)) {
                  uContent = '<div id="' + obj.markSid + '" class="map_icons vl_icon vl_icon_map_mark' + sDataType + ' '+ _this.hideClass +'"></div>'
                }
                let marker = new window.AMap.Marker({ // 添加自定义点标记
                  map: _this.map,
                  position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
                  offset: new window.AMap.Pixel(offSet[obj.dataType][0], offSet[obj.dataType][1]), // 相对于基点的偏移位置
                  draggable: false, // 是否可拖动
                  extData: obj,
                  // 自定义点标记覆盖物内容
                  content: uContent
                });
                _this.marks[obj.dataType].push(marker);
                // hover
                marker.on('mouseover', function () {
                  $('#' + obj.markSid).addClass('vl_icon_map_hover_mark' + obj.dataType)
                  let curP = marker.getPosition();
                  let sContent = '<div class="vl_map_hover" >' + _this.mapHoverInfo(obj) + '</div>';
                  let _px;
                  if (obj.dataType === 2) {
                    _px = -40;
                  } else {
                    _px = 0
                  }
                  _this.hoverWindow = new window.AMap.InfoWindow({
                    isCustom: true,
                    closeWhenClickMap: true,
                    offset: new window.AMap.Pixel(0, _px), // 相对于基点的偏移位置
                    content: sContent
                  });
                  _this.hoverWindow.on('open', function () { _this.showInfoWin = true; })
                  _this.hoverWindow.on('close', function () { _this.showInfoWin = false; })
                  _this.hoverWindow.open(_this.map, new window.AMap.LngLat(curP.lng, curP.lat));

                });
                marker.on('mouseout', function () {
                  $('#' + obj.markSid).removeClass('vl_icon_map_hover_mark' + obj.dataType)
                })
              }
            })
          }
          if (!isSetView) {
//          setTimeout(() => {
//            _this.map.setFitView()
//          }, 100)
          }
        }
      },
      renderMap() {
        let map = new window.AMap.Map("mapSelect", {
          zoom: 10,
          center: mapXupuxian.center
        });
        map.setMapStyle("amap://styles/whitesmoke");
        this.map = map;
        // 在地图中添加MouseTool插件
        this.mouseTool = new window.AMap.MouseTool(map);
        let _this=this
        this.map.on( 'click',   function (e) {
          //lnglatInput.value = e.lnglat.toString();
          if(_this.hover=='cut5'){
            var circle = new AMap.Circle({
              center:e.lnglat,
              radius: 5000, //半径
              borderWeight: 3,
              strokeColor: "#FF33FF",
              strokeOpacity: 1,
              strokeWeight: 1,
              strokeOpacity: 0.2,
              fillOpacity: 0.4,
              strokeStyle: 'solid',
              // strokeDasharray: [10, 10],
              // 线样式还支持 'dashed'
              fillColor: '#1791fc',
              zIndex: 50,
            })
            circle.setMap(_this.map)
          }

        });
      },
      setCenter(){
        var _this=this
        // console.log(this.input3);
        var placeSearch = new AMap.PlaceSearch({
          // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
          city: '021'
        })
        placeSearch.search(this.input3, function (status, result) {
          // 查询成功时，result即对应匹配的POI信息
          //  console.log(result)
          var pois = result.poiList.pois;
          if(pois.length>0){
            let new_center=pois[0].location
            _this.amap.setZoomAndCenter(16, new_center);
          }

          // for(var i = 0; i < pois.length; i++){
          //     var poi = pois[i];
          //     var marker = [];
          //     marker[i] = new AMap.Marker({
          //         position: poi.location,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          //         title: poi.name
          //     });
          //     // 将创建的点标记添加到已有的地图实例：
          //     _this.amap.add(marker[i]);
          // }
          // _this.amap.setFitView();

        })

      },
      clickTab(val){
        this.hover = this.hover==val?'':val
        if(!this.hover){
          this.amap.setDefaultCursor();
          this.mouseTool.close(false);
        }else{
          this.selArea(val)
        }

      },
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
          str += '<li><span>设备数量：</span><p>' + data.devNum + '</p></li>';
          str += '</ul></div>'
        }
        return str;
      },

      setDTime () {
        let date = new Date();
        let curDate = date.getTime();
        let curS = 3 * 24 * 3600 * 1000;
        let _s = new Date(curDate - curS).getFullYear() + '-' + (new Date(curDate - curS).getMonth() + 1) + '-' + new Date(curDate - curS).getDate();
        let _e = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        this.searchData.startTime = _s;
        this.searchData.endTime = _e;
      },
      // 选择区域
      selArea (v) {
        var _this=this
        this.amap.setDefaultCursor('crosshair');
        switch (v){
          case 'cut1' :
            this.mouseTool.rectangle({
              strokeColor:'#FA453A',
              strokeOpacity:1,
              strokeWeight: 1,
              fillColor:'#FA453A',
              fillOpacity:0.2,
              strokeStyle: 'solid',
            })
            break ;
          case 'cut2' :
            this.mouseTool.circle({
              strokeColor: "#FA453A",
              strokeOpacity: 1,
              strokeWeight: 1,
              strokeOpacity: 0.2,
              fillColor: '#FA453A',
              fillOpacity: 0.2,
              strokeStyle: 'solid',
              // 线样式还支持 'dashed'
              // strokeDasharray: [30,10],
            })
            break ;
          case 'cut3' :
            this.mouseTool.polyline({
              strokeColor: "#FA453A",
              strokeOpacity: 1,
              strokeWeight: 2,
              // 线样式还支持 'dashed'
              strokeStyle: "solid",
              // strokeStyle是dashed时有效
              // strokeDasharray: [10, 5],
            })

            break ;
          case 'cut4' :
            this.mouseTool.polygon({
              zIndex: 13,
              strokeColor: '#FA453A',
              strokeOpacity: 1,
              bubble: true,
              strokeWeight: 1,
              fillColor: '#FA453A',
              fillOpacity: 0.2,
              isRing: false
            });
            break ;
          case 'cut5' :

            break ;

        }



      },
      // 清除区域
      clearArea () {},
      tcDiscuss () {
        let sT = formatDate(this.searchData.startTime, 'yyyy-MM-dd HH:mm:ss');
        let eT = formatDate(this.searchData.endTime, 'yyyy-MM-dd HH:mm:ss');
        this.$router.push({name: 'vehicle_search_qyph_jg', query: {'where.cameraIds': '3,4','where.startTime': sT, 'where.endTime': eT,'where.frequence': this.searchData.minTimes}})
      }
    }
  };
</script>
<style lang="scss" scoped>
  .vl_ph_main {
    /*position: fixed;*/
    width: 100%;
    height: 100%;
  }
  .breadcrumb_heaer {
    background: #ffffff;
  }
  .vl_ph_content {
    width: 100%;
    height: calc(100% - 50px);
    top: 50px;
    position: absolute;
    .mapbox {
      width: 100%;
      height: 100%;
    }
    .setPost{
      position: absolute;
      left: 0px;
      top: 0px;
      width: 328px;
      height: 100%;
      .select_btn {
        background-color: #0c70f8;
        color: #ffffff;
      }
      .search_main {
        width: 272px;
        height: 569px;
        margin-top: 20px;
        background: #ffffff;
        .search_btn {
          text-align: center;
          margin-top: 255px;
        }
        >p {
          padding-left: 10px;
          height: 10px;
          line-height: 10px;
        }
        .search_line {
          position: relative;
          height: 50px;
          line-height: 50px;
          padding-left: 20px;
          color: #999999;
          .el-range-editor {
            > i {
              display: none;
            }
          }
          >span {
            display: inline-block;
            margin-right: 20px;
            vertical-align: middle;
          }
          .choose_btn {
            cursor: pointer;
            font-size: 20px;
          }
          .not-active {
            cursor:not-allowed;
          }
          .time {
            width: 10px;
            line-height: 20px;
          }
          .drawBox{
            position: absolute;
            background: #ffffff;
            left: 0;
            top: 0;
            padding: 10px;
            width: 100%;
            animation: fadeInLeft .4s ease-out both;
            .items{
              padding-top: 0px;
              span{
                display: inline-block;
                width: 34px;
                height: 34px;
                text-align: center;
                vertical-align: middle;
                line-height: 34px;
                border-right: solid 1px #eeeeee;
                cursor: pointer;
                &:last-child{
                  border-right: none;
                }
              }
              .cut1{
                background: url(../../../../../assets/img/vehicle/cut1.png) center no-repeat;
                background-size: 100% 100%;
              }
              .cut1.hover{
                background: #F2F9FF url(../../../../../assets/img/vehicle/cut1m.png) center no-repeat;
                background-size: 100% 100%;
              }
              .cut2{
                background: url(../../../../../assets/img/vehicle/cut2.png) center no-repeat;
                background-size: 100% 100%;
              }
              .cut2.hover{
                background:#F2F9FF url(../../../../../assets/img/vehicle/cut2m.png) center no-repeat;
                background-size: 100% 100%;
              }
              .cut3{
                background: url(../../../../../assets/img/vehicle/cut3.png) center no-repeat;
                background-size: 100% 100%;
              }
              .cut4{
                background: url(../../../../../assets/img/vehicle/cut4.png) center no-repeat;
                background-size: 100% 100%;
              }
              .cut5{
                background: url(../../../../../assets/img/vehicle/cut5.png) center no-repeat;
                background-size: 80% 80%;
              }
              .cut3.hover{
                background:#F2F9FF url(../../../../../assets/img/vehicle/cut3m.png) center no-repeat;
                background-size: 100% 100%;
              }
              .cut4.hover{
                background:#F2F9FF url(../../../../../assets/img/vehicle/cut4m.png) center no-repeat;
                background-size: 100% 100%;
              }
              .cut5.hover{
                background:#F2F9FF url(../../../../../assets/img/vehicle/cut5m.png) center no-repeat;
                background-size: 80% 80%;
              }
            }
          }
        }
      }
     
    }
  }
</style>
<style lang="scss">
.red_star {
  &:before {
    content: '*';
    color: #FF0000;
  }
}
.search_line {
  .el-date-editor {
    .el-input__suffix {
     &:last-child {
       i {
         display: none;
       }
     }
    }
  }
}
</style>