<template>
  <div class="vl_ph_main">
    <div class="">
      <div
              is="vlBreadcrumb"
              :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle_menu'},
          {name: '区域徘徊'}]"
      ></div>
    </div>

    <div class="vl_ph_content">
      <div class="mapbox" id="mapSelect"></div>
      <div class="setPost">
        <div>
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
        <div style="width: 272px;height: 100%;">
          <div class="search_main">
              <!--区域选择-->
              <div class="search_line_ts">
                <div class="title">
                  <span class="red_star">抓拍区域:</span>
                  <span>
                    <i class="choose_btn el-icon-location-outline" @click="setFitV" :class="{'not-active': !searchData.area}"></i>
                    <i class="choose_btn el-icon-delete" @click="delDialog = true"></i>
                  </span>
                </div>
                <div class="drawBox">
                  <div class="items">
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
                <span class="red_star">频次：期间不少于 <el-input oninput="value=value.replace(/[^0-9.]/g,''); if(value >= 200)value = 200" style="width: 65px;" v-model="searchData.minTimes"></el-input> 次</span>
              </div>
              <!--按钮-->
              <div class="search_btn">
                <el-button @click="resetS">重置</el-button>
                <el-button type="primary" @click="tcDiscuss">徘徊分析</el-button>
              </div>
          </div>
        </div>
      </div>
      <!--地图操作按钮-->
      <ul class="map_rrt_u2">
        <li @click="resetZoom"><i class="el-icon-aim"></i></li>
        <li @click="mapZoomSet(1)"><i class="el-icon-plus"></i></li>
        <li @click="mapZoomSet(-1)"><i class="el-icon-minus"></i></li>
      </ul>
    </div>
    <el-dialog
      title="清除确认"
      :visible.sync="delDialog"
      width="30%">
      <span>是否要清除地图上的已选区域进行重新选择？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delDialog = false">取 消</el-button>
    <el-button type="primary" @click="clearArea">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
  import vlBreadcrumb from "@/components/common/breadcrumb.vue";
  import { mapXupuxian } from "@/config/config.js";
  import {getAllDevice} from '../../../api/api.judge.js';
  import {getAllBayonetList} from '../../../api/api.base.js';
  import { objDeepCopy, formatDate} from '../../../../../utils/util.js';
  export default {
    components: {vlBreadcrumb},
    data() {
      return {
        delDialog: false,
        map: null,
        input3: null,
        hover:null,
        // 选择区域
        activeArea: false,
        mouseTool: null,
        lnglat:null,
        searchData: {
          area: null, // 区域
          startTime: '',
          endTime: '',
          minTimes: 5// 最少次数
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
              start = y + '-' + (m - 1) + '-' + d;
            } else {
              start = (y - 1) + '-' + (m - 1 + 12) + '-' + d;
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
              start = y + '-' + (m - 1) + '-' + d;
            } else {
              start = (y - 1) + '-' + (m - 1 + 12) + '-' + d;
            }
            threeMonths = new Date(start).getTime();
            return time.getTime() > Date.now() || time.getTime() < threeMonths;
          }
        },
        mapTreeData: [],
        marks: [[], []],
        hoverWindow: null,// 全局信息窗口
        pointData:[],
        circle: null
      };
    },
    mounted() {
      this.renderMap();
      this.setDTime();
      this.getAllDevice() //查询所有的设备

    },
    methods: {
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
        var placeSearch = new AMap.PlaceSearch({
          // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
          city: "湖南"
        });

        if (!!v) {
          let _this = this;
          return new Promise((resolve, reject) => {
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
      setFitV () {
        this.map.setFitView([this.searchData.area]);
      },
      getAllDevice(){
        getAllDevice().then(res=>{
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
      // keys的各个props 代表接口返回的摄像头，人物，车辆，卡口的list的字段名及list里面元素name;;allKey
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
                  content: uContent,
                  bubble: true
                });
                _this.marks[obj.dataType].push(marker);
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
            _this.mouseTool.close(true);
            if (_this.circle) {
              _this.map.remove(_this.circle)
            }
            _this.circle = new AMap.Circle({
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
            _this.circle.setMap(_this.map);
            _this.searchData.area = _this.circle;
            _this.checkout(_this.circle,'AMap.circle')
          }

        });
        window.AMap.event.addListener(this.mouseTool, 'draw', function (e) {
          if (_this.searchData.area) {_this.map.remove(_this.searchData.area);}
          if (_this.circle) {
            _this.map.remove(_this.circle)
          }
          _this.searchData.area = e.obj;
          let a=e.obj
          let t=e.obj.CLASS_NAME
          _this.checkout(a,t)
        });
      },
      checkout(obj , type){
        this.pointData = [];
        if(type!="AMap.Polyline"){
          this.mapTreeData.forEach(el=>{
            let myLngLat=new AMap.LngLat(el.longitude,el.latitude);
            //  var isPointInRing = window.AMap.GeometryUtil.isPointInRing(myLngLat,obj.C.path);
            let isPointInRing = obj.contains(myLngLat);
            // console.log(marker.getPosition());
            if(isPointInRing){//如果点在圆内则输出
              let id = this.pointData.findIndex(item=>item.uid==el.uid)
              if(id == -1){
                this.pointData.push(el)
              }
            }
          })
        }else{
          this.mapTreeData.forEach(el=>{
            let myLngLat=new AMap.LngLat(el.longitude,el.latitude);
            // let  closestPositionOnLine  = AMap.GeometryUtil.closestOnLine(myLngLat,obj.C.path);
            // console.log(closestPositionOnLine);

            let distance =  Math.round(window.AMap.GeometryUtil.distanceToLine(myLngLat,obj.B.path));
            // console.log(distance);
            let id = this.pointData.findIndex(item=>item.uid==el.uid)
            if(id==-1 && distance <=1000){
              this.pointData.push(el)
            }
          })
        }
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

      resetS () {
        this.searchData.minTimes = 5;
        this.clearArea();
        this.setDTime();
      },
      setDTime () {
        let date = new Date();
        let curDate = date.getTime();
        let curS = 1 * 24 * 3600 * 1000;
        let sM = '', sD = '';
        if ((new Date(curDate - curS).getMonth() + 1) < 10 ) {
          sM = '0' + (new Date(curDate - curS).getMonth() + 1);
        } else {
          sM = (new Date(curDate - curS).getMonth() + 1)
        }
        if ( new Date(curDate - curS).getDate() < 10 ) {
          sD = '0' +  new Date(curDate - curS).getDate();
        } else {
          sD =  new Date(curDate - curS).getDate()
        }
        let _s = new Date(curDate - curS).getFullYear() + '-' + sM + '-' + sD;
        this.searchData.startTime = _s + " 00:00:00";
        this.searchData.endTime = _s + " 23:59:59";
      },
      // 选择区域
      selArea (v) {
        this.map.setDefaultCursor('crosshair');
        switch (v){
          case 'cut1' :
            this.mouseTool.rectangle({
              strokeColor:'#FA453A',
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
      clearArea () {
        this.hover = null;
        this.pointData = [];
        this.delDialog = false;
        this.mouseTool.close(true);
        if (this.circle) {
          this.map.remove(this.circle)
        }
        this.searchData.area = null;
      },
      tcDiscuss () {
        if (!this.searchData.minTimes) {
          if (!document.querySelector('.el-message--info')) {
            this.$message.info('请输入频次');
          }
          return false;
        }
        if (!this.searchData.area) {
          if (!document.querySelector('.el-message--info')) {
            this.$message.info('请先选择区域');
          }
          return false;
        }
        if (this.pointData.length === 0) {
          if (!document.querySelector('.el-message--info')) {
            this.$message.info('选择的区域没有设备，请重新选择区域');
          }
          return false;
        }
        let sT = formatDate(this.searchData.startTime, 'yyyy-MM-dd HH:mm:ss');
        let eT = formatDate(this.searchData.endTime, 'yyyy-MM-dd HH:mm:ss');
        let query = {'where': {}};
        query.where.startTime = sT;
        query.where.endTime = eT;
        query.where.frequence = this.searchData.minTimes;
        query.where['bayonetIds'] = this.pointData.filter(x => x.dataType === 1).map(y => {return y.uid}).join(',');
        query.where['cameraIds'] = this.pointData.filter(x => x.dataType === 0).map(y => {return y.uid}).join(',');
        this.$router.push({name: 'vehicle_search_qyph_jg', query: query})
      }
    }
  };
</script>
<style lang="scss" scoped>
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
      top: 10px;
      width: 397px;
      /*height: 100%;*/
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
        height: 370px;
        margin-top: 16px;
        background: #ffffff;
        padding-top: 20px;
        .search_btn {
          text-align: center;
          margin-top: 18px;
        }
        >p {
          padding-left: 10px;
          height: 10px;
          line-height: 10px;
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
              &:last-child {
                text-align: right;
                padding-top: 2px;
                color: #999999;
                i {
                  margin-right: 10px;
                }
              }
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
                width: 46px;
                height: 46px;
                text-align: center;
                vertical-align: middle;
                line-height: 46px;
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