<template>
  <div class="vl_ph_main">
    <div class="">
      <!--<el-breadcrumb separator=">">-->
        <!--<el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>-->
        <!--<el-breadcrumb-item>区域碰撞</el-breadcrumb-item>-->
      <!--</el-breadcrumb>-->
      <div
              is="vlBreadcrumb"
              :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle_menu'},
          {name: '区域碰撞'}]"
      ></div>
    </div>

    <div class="vl_ph_content">
      <div :class="['right',{hide:!hideleft}]" id="mapSelect"></div>
      <div :class="['left',{hide:hideleft}]">
        <div class="plane">
          <div class="setPost">
            <div class="top_search_input">
              <el-autocomplete
                    class="inline-input"
                    v-model="input3"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入地名，快速定位地址"
                    value-key="name"
                    :trigger-on-focus="false"
                    @select="handleSelect"
              ></el-autocomplete>
              <!--<el-input placeholder="请输入地名，快速定位地址" v-model="input3" class="input-with-select">-->
              <el-button slot="append" icon="el-icon-search" class="select_btn" @click="setCenter()"></el-button>
              <!--</el-input>-->
            </div>
            <div style="width: 272px;height: calc(100% - 40px);">
              <vue-scroll>
                <div class="search_main">
                  <!--<div class="search_top">-->
                    <!--<span  @click="addArea"><i class="el-icon-circle-plus-outline"></i>增加区域列表</span>-->
                  <!--</div>-->
                  <!--区域选择-->
                  <div class="search_item">
                    <div class="search_line">
                      <!--<span class="time">开始</span>-->
                      <el-date-picker
                        v-model="curAddSearch.startTime"
                        style="width: 100%;"
                        class="vl_date"
                        @change="chooseStartTime"
                        type="datetime"
                        :picker-options="pickerOptions"
                        value-format="timestamp"
                        placeholder="请选择开始时间">
                      </el-date-picker>
                    </div>
                    <!--<p class="red_star"></p>-->
                    <div class="search_line">
                      <!--<span class="time">结束</span>-->
                      <el-date-picker
                              style="width: 100%;"
                              class="vl_date vl_date_end"
                              :picker-options="pickerOptions"
                              v-model="curAddSearch.endTime"
                              @change="chooseEndTime"
                              value-format="timestamp"
                              type="datetime"
                              placeholder="请选择结束时间">
                      </el-date-picker>
                    </div>
                    <div class="search_line_ts">
                      <div class="title">
                        <span class="">区域:</span>
                        <!--<span>-->
                        <!--<i class="choose_btn el-icon-location-outline" @click="setFitV(index)" :class="{'not-active': !item.area}"></i>-->
                        <!--<i class="choose_btn el-icon-delete" v-show="index > 1" @click="clearArea(index)"></i>-->
                        <!--</span>-->
                      </div>
                      <div class="drawBox">
                        <div class="items">
                          <span @click="clickTab('cut1', searchData.length)" :class="['cut1',{'hover':hover=='cut1'}]"></span>
                          <span @click="clickTab('cut2', searchData.length)"  :class="['cut2',{'hover':hover=='cut2'}]"></span>
                          <!--<span @click="clickTab('cut3', searchData.length)"  :class="['cut3',{'hover':hover=='cut3'}]"></span>-->
                          <span @click="clickTab('cut4', searchData.length)"  :class="['cut4',{'hover':hover=='cut4'}]"></span>
                          <!--<span @click="clickTab('cut5', searchData.length)"  :class="['cut5',{'hover':hover=='cut5'}]"></span>-->
                        </div>
                      </div>
                    </div>
                  </div>
                  <!--按钮-->
                  <div class="search_btn">
                    <el-button @click="clearAllArea">重置</el-button>
                    <el-button type="primary" :disabled="searchData.length < 2" @click="tcDiscuss">区域碰撞</el-button>
                  </div>
                </div>
              </vue-scroll>
            </div>
          </div>
          <div class="insetLeft vl_icon vl_icon_vehicle_02" :class="{'vl_icon_vehicle_03': hideleft}" @click="hideLeft"></div>
        </div>
      </div>
      <!--地图操作按钮-->
      <ul class="map_rrt_u2">
        <li @click="resetZoom"><i class="el-icon-aim"></i></li>
        <li @click="mapZoomSet(1)"><i class="el-icon-plus"></i></li>
        <li @click="mapZoomSet(-1)"><i class="el-icon-minus"></i></li>
      </ul>
      <!--右侧已选区域列表-->
      <div class="map_complete_area">
        <vue-scroll>
          <ul class="map_complete_cc">
            <li :class="{'active': index === curRightActive}" @click="changeRightActive(index)" v-for="(item, index) in searchData" :key="item.id">
              <div class="title">
                <span>区域{{index + 1}}</span>
                <div class="btn_list">
                  <span class="el-icon-location-outline"  @click.stop="setFitV(index)" ></span>
                  <span class="el-icon-delete"  @click.stop="clearArea(index)"></span>
                </div>
              </div>
              <div class="info_line">
                <span>时间：</span>
                <p>{{item.startTime}}至{{item.endTime}}</p>
              </div>
              <div class="info_line">
                <span>设备：</span>
                <p v-if="item.curPointData.length <= 2">
                  <template v-for="(sItem, dIndex) in item.curPointData">{{dIndex !== 0 ? ',' : ''}}{{sItem.deviceName}}</template>
                </p>
                <p v-else>
                  {{item.curPointData[0].deviceName}},{{item.curPointData[1].deviceName}}等{{item.curPointData.length}}个设备
                </p>
              </div>
            </li>
          </ul>
        </vue-scroll>
      </div>
    </div>

    <el-dialog
      title="清除确认"
      :visible.sync="delDialog"
      width="30%">
      <span>是否要清除{{clearAll ? '全部时间和' : '该条'}}抓拍区域？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmClear">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import vlBreadcrumb from "@/components/common/breadcrumb.vue";
  import { mapXupuxian } from "@/config/config.js";
//  import {getAllDevice} from '../../../api/api.judge.js';
  import {getAllMonitorList, getAllBayonetList} from '../../../api/api.base.js';
  import { objDeepCopy, formatDate, addCluster} from '../../../../../utils/util.js';
  export default {
    components: {vlBreadcrumb},
    data() {
      return {
        hideleft: false,
        tipInfo: null,
        map: null,
        input3: null,
        hover: null,
        // 选择区域
        mouseTool: null,
        lnglat:null,
        curAddSearch: {
          startTime: '',
          endTime: '',
          area: null,
          curPointData: [],
          curMarks: []
        },
        searchData: [],
        pickerOptions: {
          disabledDate (time) {
            return time > new Date();
          }
        },
        mapTreeData: [],
        marks: [],
        hoverWindow: null,// 全局信息窗口
        pointData: [[], []],
        circle: null,
        delDialog: false,
        curDrawIndex: 0, // 当前画区域的索引
        curRightActive: 0, // 右边已选区域当前激活索引
        clearAll: false,
        confirmIcon: null, // 选择区域之后的小弹窗
      };
    },
    mounted() {
      this.renderMap();
      // this.setDTime();
//      this.searchData.forEach(x => {
//        x.startTime = this.setDTime().startTime;
//        x.endTime = this.setDTime().endTime;
//      })
      this.getAllDevice();
      this.resetZoom();
      let that = this;
      $('body').on('click', '.vl_map_area_confirm', function (e) {
        if (e.target.classList.contains('el-icon-close')) {
          that.cancelAddArea();
        }
        if (e.target.classList.contains('vl_area_complete')) {
          // 判断有没有选时间
          if (that.curAddSearch.startTime && that.curAddSearch.endTime) {
            if (that.curAddSearch.curPointData.length) {
              let addObj = {};
              addObj.startTime = formatDate(that.curAddSearch.startTime, 'yyyy-MM-dd HH:mm:ss');
              addObj.endTime = formatDate(that.curAddSearch.endTime, 'yyyy-MM-dd HH:mm:ss');
              addObj.area = that.curAddSearch.area;
              addObj.curPointData = that.curAddSearch.curPointData;
              addObj.curMarks = that.curAddSearch.curMarks;
              that.addCompleteData(addObj);
              that.map.remove(that.confirmIcon);
            } else {
              that.showInfoMes('所选区域没有设备信息')
            }
          } else {
            that.showInfoMes('起止时间不能为空')
          }
        }
      })
    },
    methods: {
      chooseEndTime (e) {
        if (e < this.curAddSearch.startTime && this.curAddSearch.startTime) {
          this.$message.info('结束时间必须大于开始时间才会有结果')
          this.curAddSearch.endTime = '';
        }
      },
      chooseStartTime (e) {
        if (e > this.curAddSearch.endTime && this.curAddSearch.endTime) {
          this.$message.info('结束时间必须大于开始时间才会有结果')
          this.curAddSearch.startTime = '';
        }
      },
      hideLeft() {
        this.hideleft = !this.hideleft;
      },
      mapZoomSet (val) {
        if (this.map) {
          this.map.setZoom(this.map.getZoom() + val);
        }
      },
      resetZoom () {
        if (this.map) {
          this.map.setZoomAndCenter(14, mapXupuxian.center);
        }
      },
      querySearch(queryString, cb) {
        //this.seacher(queryString)

        this.$nextTick(() => {
          this.seacher(queryString).then(v => {
            //console.log(v);
            var restaurants = v;
            //  console.log(restaurants)
            var results = queryString
                ? restaurants.filter(this.createFilter(queryString))
                : restaurants;
            // console.log(results)
            cb(results);
            // 调用 callback 返回建议列表的数据
            // clearTimeout(this.timeout);
            //   this.timeout = setTimeout(() => {
            //     cb(results);
            //   }, 3000 * Math.random());
            // cb(results);
          });
        });
      },
      handleSelect(item) {
        // console.log(item);
        let new_center = item.location;
        this.map.setZoomAndCenter(16, new_center);
      },
      createFilter(queryString) {
        return restaurant => {
          // console.log(restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()));

          return (
              restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) > -1
          );
        };
      },
      seacher(v) {
        var placeSearch = new window.AMap.PlaceSearch({
          // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
          city: "湖南"
        });

        if (v) {
          let _this = this;
          return new Promise((resolve) => {
            placeSearch.search(v, (status, result) => {
              // 查询成功时，result即对应匹配的POI信息
              let pois = result.poiList.pois;
              _this.restaurants = pois;
              resolve(pois);
            });
          });
        }
        //return pois
      },
      getAllDevice(){
        getAllMonitorList({
          ccode: mapXupuxian.adcode
        }).then(res=>{
          if(res.data && res.data.length>0){
//            this.allDevice=res.data
            console.log(res.data)
            this.objSetItem(res.data, {infoName: 'deviceName', dataType: 0});
          }
          getAllBayonetList({
            areaId: mapXupuxian.adcode
          }).then(resBon => {
            console.log(resBon.data);
            if(resBon.data && resBon.data.length>0){
              this.objSetItem(resBon.data, {infoName: 'bayonetName', dataType: 1});
            }
            this.mapTreeData = res.data.concat(resBon.data)
            console.log(this.mapTreeData)
            this.mapMark(this.mapTreeData)
          })
        })
      },
      //获取地图信息列表
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
      mapMark (data) {
        if (data && data.length > 0) {
          let _this = this;
          data.forEach(obj => {
            if (obj.longitude > 0 && obj.latitude > 0) {
              let offSet = {0: [-15, -16],1: [-15, -16],2: [-15, -60],3: [-15, -16], 4: [-15, -16],5: [-15, -16]};
              let uContent = _this.setMarkContent(obj);
              // 给obj设置markIndex ,为当前在marks集合中所处的位置，
              obj['markIndex'] = _this.marks.length;
              let marker = new window.AMap.Marker({ // 添加自定义点标记
//                map: _this.map,
                position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
                offset: new window.AMap.Pixel(offSet[obj.dataType][0], offSet[obj.dataType][1]), // 相对于基点的偏移位置
                draggable: false, // 是否可拖动
                extData: obj,
                bubble: true,
                // 自定义点标记覆盖物内容
                content: uContent
              });
              _this.marks.push(marker);
              // hover
              marker.on('mouseover', function () {
//                  $('#' + obj.markSid).addClass('vl_icon_map_hover_mark' + obj.dataType)
                let curP = marker.getPosition();
                let sContent = '<div class="vl_map_hover" >' + _this.mapHoverInfo(obj) + '</div>';
                _this.hoverWindow = new window.AMap.InfoWindow({
                  isCustom: true,
                  closeWhenClickMap: true,
                  offset: new window.AMap.Pixel(9, 34), // 相对于基点的偏移位置
                  content: sContent,
                  bubble: true
                });
                _this.hoverWindow.open(_this.map, new window.AMap.LngLat(curP.lng, curP.lat));

              });
              marker.on('mouseout', function () {
//                  $('#' + obj.markSid).removeClass('vl_icon_map_hover_mark' + obj.dataType)
              })
            }
          })
          addCluster(_this.map, _this.marks);
          console.log(_this.map.cluster);
        }
      },
      setMarkContent (obj, type) {
        let sDataType, uContent;
        if (obj.dataType === 0 && obj.deviceStatus !== 1) {
          sDataType = 6;
        } else if (obj.dataType === 1 && !obj.isEnabled) {
          sDataType = 9
        } else {
          sDataType = obj.dataType;
        }
        uContent = '<div id="' + obj.markSid + '" class="map_icons vl_icon vl_icon_map_mark' + sDataType + '"></div>'
        if (type === 'error') {
          let sClass = 'vl_icon_map_sxt_in_area' + obj.dataType;
          uContent = '<div id="' + obj.markSid + '" class="map_icons vl_icon ' + sClass +'"></div>';
        }
        return uContent;
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
            _this.mouseTool.close(false);
            if (_this.curAddSearch.area) {
              _this.map.remove(_this.curAddSearch.area)
            }
            let circle = new window.AMap.Circle({
              center:e.lnglat,
              radius: 5000, //半径
              borderWeight: 3,
              strokeColor: "#FF33FF",
              strokeWeight: 1,
              strokeOpacity: 0.2,
              fillOpacity: 0.4,
              strokeStyle: 'solid',
              // strokeDasharray: [10, 10],
              // 线样式还支持 'dashed'
              fillColor: '#1791fc',
              zIndex: 50,
            })
            circle.setMap(_this.map);
            _this.curAddSearch.area = circle;
            // 画完区域取消地图工具激活状态
            _this.map.setDefaultCursor();
            _this.mouseTool.close(false);
            _this.hover = '';
            _this.createConfirmMark(e.lnglat);

            _this.checkout(circle,'AMap.circle');
            // 判断如果当前curAddSearch.curMarks有数据的话，恢复初始颜色
            if (_this.curAddSearch.curMarks.length) {
              _this.recoverSXTcolor(_this.curAddSearch.curMarks)
            }
            _this.curAddSearch.curMarks = [];
            _this.curAddSearch.curPointData.forEach(j => {
              _this.curAddSearch.curMarks.push(_this.marks[j.markIndex]);
            })
            _this.putSelectColor(_this.curAddSearch.curMarks)
          }

        });
        window.AMap.event.addListener(this.mouseTool, 'draw', function (e) {
          if (_this.curAddSearch.area) {_this.map.remove(_this.curAddSearch.area);}
          if (_this.confirmIcon) {_this.map.remove(_this.confirmIcon);}
          _this.curAddSearch.area = e.obj;
          // 画完区域取消地图工具激活状态
          _this.map.setDefaultCursor();
          _this.mouseTool.close(false);
          _this.hover = '';
          _this.createConfirmMark(e.obj.getPath()[e.obj.getPath().length - 1]);

          let a=e.obj;
          let t=e.obj.CLASS_NAME
          _this.checkout(a,t);
          console.log(_this.curAddSearch.curPointData)
          // 判断如果当前curAddSearch.curMarks有数据的话，先加入点聚合
          if (_this.curAddSearch.curMarks.length) {
            _this.recoverSXTcolor(_this.curAddSearch.curMarks)
          }
          _this.curAddSearch.curMarks = [];
          _this.curAddSearch.curPointData.forEach(j => {
            _this.curAddSearch.curMarks.push(_this.marks[j.markIndex]);
          })
          _this.putSelectColor(_this.curAddSearch.curMarks)
        });
      },
      // 改变右侧激活
      changeRightActive (index){
        this.curRightActive = index;
        for (let i = 0; i < this.searchData.length; i++) {
          if (i !== index) {
            this.searchData[i].curMarks.forEach(x => {
              let uContent = this.setMarkContent(x.getExtData())
              x.setContent(uContent);
            })
          } else {
            this.searchData[i].curMarks.forEach(x => {
              let uContent = this.setMarkContent(x.getExtData(), 'error')
              x.setContent(uContent);
            })
          }
        }
      },
      // 创建确定，取消区域的小marker
      createConfirmMark (path) {
        let m = new window.AMap.Marker({
          map: this.map,
          position: path,
          offset: new window.AMap.Pixel(-15, -16),
          draggable: false, // 是否可拖动
          zIndex: 200,
          bubble: false,
          content: '<div  class="vl_map_area_confirm"><span class="vl_area_cancel"><i class="el-icon-close"></i></span><span class="vl_area_complete el-icon-check">完成</span></div>'
        })
        this.confirmIcon = m;
      },
      // 将指定mark集合移除点聚合
      putSelectColor (mks) {
        mks.forEach(y => {
          let uContent = this.setMarkContent(y.getExtData(), 'error')
          y.setContent(uContent);
        })
      },
      // 画完区域完成，将数据添加到searchData,右侧列表
      addCompleteData (obj) {
        console.log(obj);
        this.searchData.push(obj);
        // 重置curAddSearch
        this.curAddSearch = {
          startTime: '',
          endTime: '',
          area: null,
          curPointData: [],
          curMarks: []
        };
        this.changeRightActive(this.searchData.length - 1)
      },
      // 删除区域之后将指定mark加入点聚合 mks当前区域的mark
      recoverSXTcolor (mks, index) {
        // 判断这个点是不是在其他区域被选中，选中了则不处理
        mks.forEach(x => {
          let b = true;
          this.searchData.forEach((y, sIndex) => {
            if (index !== sIndex && y.curPointData.includes(x.getExtData())) {
              b = false;
            }
          })
          if (b) {
            let uContent = this.setMarkContent(x.getExtData())
            x.setContent(uContent);
          }
        })
      },
      checkout(obj , type){
        this.curAddSearch.curPointData = [];
        if(type!="AMap.Polyline"){
          this.mapTreeData.forEach(el=>{
            let myLngLat=new window.AMap.LngLat(el.longitude,el.latitude);
            //  var isPointInRing = window.AMap.GeometryUtil.isPointInRing(myLngLat,obj.C.path);
            let isPointInRing = obj.contains(myLngLat);
            // console.log(marker.getPosition());
            if(isPointInRing){//如果点在圆内则输出
              let id = this.curAddSearch.curPointData.findIndex(item=>item.uid==el.uid)
              if(id == -1){
                this.curAddSearch.curPointData.push(el)
              }
            }
          })
        }else{
          this.mapTreeData.forEach(el=>{
            let myLngLat=new window.AMap.LngLat(el.longitude,el.latitude);
            // let  closestPositionOnLine  = AMap.GeometryUtil.closestOnLine(myLngLat,obj.C.path);
            // console.log(closestPositionOnLine);

            let distance =  Math.round(window.AMap.GeometryUtil.distanceToLine(myLngLat,obj.B.path));
            // console.log(distance);
            let id = this.curAddSearch.curPointData.findIndex(item=>item.uid==el.uid)
            if(id==-1 && distance <=1000){
              this.curAddSearch.curPointData.push(el)
            }
          })
        }
      },
      setCenter(){
        var _this=this
        // console.log(this.input3);
        var placeSearch = new window.AMap.PlaceSearch({
          // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
          city: '021'
        })
        placeSearch.search(this.input3, function (status, result) {
          // 查询成功时，result即对应匹配的POI信息
          //  console.log(result)
          var pois = result.poiList.pois;
          if(pois.length>0){
            let new_center=pois[0].location
            _this.map.setZoomAndCenter(16, new_center);
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
          this.map.setDefaultCursor();
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
//          str += '<li><span>设备数量：</span><p>' + data.devNum + '</p></li>';
          str += '</ul></div>'
        }
        return str;
      },
      setFitV (index) {
        this.map.setFitView([this.searchData[index].area]);
      },
      cancelAddArea () {
        if (this.curAddSearch.area) {this.map.remove(this.curAddSearch.area);}
        if (this.confirmIcon) {this.map.remove(this.confirmIcon)}
        // 先判断你选择的区域有没有设备,没有就不用做处理
        if (this.curAddSearch.curPointData.length) {
          this.recoverSXTcolor(this.curAddSearch.curMarks);
        }
      },
      delAllArea() {
        this.cancelAddArea();
        this.curAddSearch = {
          startTime: '',
          endTime: '',
          area: null,
          curPointData: [],
          curMarks: []
        };
        this.searchData.forEach((x, index) => {
          if (x.area) {
            this.map.remove(x.area);
            x.area = null;
            this.recoverSXTcolor(x.curMarks, index);
            this.searchData[index].curPointData = [];
          }
        })
        this.searchData = [];
        this.hover = null;
        this.mouseTool.close(false);
      },
      setDTime () {
        let date = new Date();
        let curDate = date.getTime();
        let curS = 1 * 24 * 3600 * 1000;
//        let _s = new Date(curDate - curS).getFullYear() + '-' + (new Date(curDate - curS).getMonth() + 1) + '-' + new Date(curDate - curS).getDate();
//        let _e = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        return {startTime: curDate - curS,endTime: curDate}
      },
      // 选择区域
      selArea (v) {
        this.map.setDefaultCursor('crosshair');
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
            });
            break ;
          case 'cut5' :
            break ;
        }
      },
      // 清除区域
      clearArea (index) {
        this.delDialog = true;
        this.clearAll = false;
        this.curDrawIndex = index;
      },
      clearAllArea () {
        this.delDialog = true;
        this.clearAll = true;
      },
      confirmClear () {
        this.delDialog = false;
        if (this.clearAll) {
          this.delAllArea();
        } else {
          this.mouseTool.close(false);
          if (this.searchData[this.curDrawIndex].area) {
            this.map.remove(this.searchData[this.curDrawIndex].area);
          }
          // 判断如果当前删除的是激活的区域，那么将curRightActive改变
          if(this.curDrawIndex === this.curRightActive) {
            if (this.curRightActive - 1 >= 0) {
              this.changeRightActive(this.curRightActive - 1)
            } else {
              this.changeRightActive(this.curRightActive + 1)
            }
          }
          this.recoverSXTcolor(this.searchData[this.curDrawIndex].curMarks, this.curDrawIndex)
          this.searchData.splice(this.curDrawIndex, 1)
        }
      },
      tcDiscuss () {
        let supQuery = {'where': {dtoList: []}};
          supQuery.where['dtoList'] = this.searchData.map(x => {
            let obj = {}
            obj['cameraIds'] = x.curPointData.filter(x => x.dataType === 0).map(y => {return y.uid}).join(',');
            obj['bayonetIds'] = x.curPointData.filter(x => x.dataType === 1).map(y => {return y.uid}).join(',');
            obj['startTime'] =  formatDate(x.startTime, 'yyyy-MM-dd HH:mm:ss');
            obj['endTime'] =  formatDate(x.endTime, 'yyyy-MM-dd HH:mm:ss');
            return obj;
          })
          window.sessionStorage.setItem('qyParam', JSON.stringify(supQuery));
          this.$router.push({name: 'vehicle_search_qy_jg'})
      },
      showInfoMes(mes) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info(mes);
        }
      }
    },
    beforeDestroy () {
      $('body').unbind('click');
    }
  };
</script>
<style lang="scss" scoped>
  // 右侧已选区域
  .map_complete_area {
    position: absolute;
    top: 40px;
    right: 0px;
    width: 376px;
    max-height: 4rem;
    background: #ffffff;
    .map_complete_cc {
      max-height: 4rem;
      li {
        padding: 0 24px 20px 20px;
        border-bottom: 1px solid #F2F2F2;
        &:last-child {
          border-bottom: none;
        }
        .title {
          height: 50px;
          line-height: 50px;
          >span {
            color: #333333;
          }
          .btn_list {
            float: right;
            color: #999999;
            >span {
              cursor: pointer;
              font-size: 17px;
            }
            .el-icon-location-outline {
              margin-right: 8px;
              &:hover {
                color: #0466DE;
              }
            }
            .el-icon-delete {
              &:hover {
                color: #FA453A;
              }
            }
          }
        }
        .info_line {
          display: flex;
          span {
            display: block;
            width: 42px;
            color: #999999;
          }
          p {
            width: 290px;
            color: #333333;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .active {
        color: #0466DE;
        .title >span {
          color: #0466DE;
        }
        .info_line span {
          color: #0466DE;
        }
        .info_line p {
          color: #0466DE;
        }
      }
    }
  }
  .right.hide {
    width: calc(100% - 272px);
    height: 100%;
    float: right;
  }
  .right {
    width: 100%;
    height: 100%;
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
    height: 100%;
    background-color: #ffffff;
    float: left;
    z-index: 1;
    margin-left: 0px;
    /*box-shadow: 4px 0px 10px 0px #838383;*/
    /*box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);*/
    animation: fadeInLeft 0.4s ease-out 0.3s both;
    transition: marginLeft 0.3s ease-in;
    .plane {
      padding: 10px;
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
  .hide {
    .insetLeft {
    }
  }
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
      width: 272px;
      height: calc(100% - 10px);
      .top_search_input {
        position: absolute;
        left: 302px;
        top: 30px;
      }
      .inline-input {
        width: 336px;
      }
      .select_btn {
        background-color: #0c70f8;
        color: #ffffff;
        width: 64px;
        position: absolute;
        right: 0;
      }
      .search_main {
        width: 272px;
        min-height: 569px;
        background: #ffffff;
        .search_top {
          height: 48px;
          line-height: 48px;
          display: flex;
          padding: 0 20px;
          span {
            display: block;
            width: 50%;
            color: #0C70F8;
            cursor: pointer;
          }
        }
        .search_btn {
          text-align: center;
          /*margin-top: 255px;*/
        }
        .search_item {
          >p {
            padding-left: 10px;
            height: 10px;
            line-height: 10px;
          }
          border-bottom: 1px solid #F2F2F2;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .search_line_ts {
          width: 232px;
          height: 106px;
          margin: 0 auto;
          margin-bottom: 10px;
          border: 1px solid #D3D3D3;
          .title {
            height: 38px;
            line-height: 38px;
            border-bottom: 1px solid #D3D3D3;
            display: flex;
            span {
              display: block;
              width: 50%;
              padding-left: 10px;
              /*&:last-child {*/
                /*text-align: right;*/
                /*padding-top: 2px;*/
                /*color: #999999;*/
                /*i{*/
                  /*margin-right: 10px;*/
                /*}*/
              /*}*/
            }
            .choose_btn {
              cursor: pointer;
              font-size: 20px;
            }
            .not-active {
              cursor:not-allowed;
            }
          }
          .drawBox{
            width: 100%;
            padding-top: 10px;
            .items{
              padding-top: 0px;
              span{
                display: inline-block;
                width: 50px;
                height: 46px;
                text-align: center;
                vertical-align: middle;
                line-height: 46px;
                cursor: pointer;
                margin: 0 3px;
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
        .search_line {
          position: relative;
          height: 50px;
          line-height: 50px;
          padding: 0 20px;
          color: #999999;
          .el-range-editor {
            > i {
              display: none;
            }
          }
          >span {
            display: inline-block;
            margin-right: 10px;
            vertical-align: middle;
          }
          .time {
            width: 10px;
            line-height: 20px;
          }
        }
      }

    }
  }
</style>
<style lang="scss">
  // 框选区域之后小弹窗
  .vl_map_area_confirm {
    background: #FFFFFF;
    box-shadow:0px 12px 12px 0px rgba(2,10,62,0.36);
    padding: 5px 0px;
    width: 100px;
    height: 30px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    display: flex;
    > span {
      display: block;
      height: 20px;
      text-align: center;
    }
    .vl_area_cancel {
      width: 30px;
      border-right: 1px solid #F2F2F2;
      i {
        color: #F95826;
        font-size: 20px;
        font-weight: bold;
      }
    }
    .vl_area_complete {
      width: 70px;
      vertical-align: middle;
      &:before {
        color: #1264F8;
        font-size: 20px;
        font-weight: bold;
        vertical-align: middle;
        margin-right: 3px;
      }
      color: #666666;
    }
  }
  .red_star {
    &:before {
      content: '*';
      color: #FF0000;
    }
  }
  .search_line {
    /deep/.el-date-editor {
      > i {
        display: none!important;
      }
    }
  }
</style>