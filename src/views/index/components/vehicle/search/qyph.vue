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
            <div style="width: 272px;height: 100%;">
              <div class="search_main">
                <!--区域选择-->
                <div class="search_line">
                  <!--<span class="time">从</span>-->
                  <el-date-picker
                          v-model="searchData.startTime"
                          style="width: 100%;"
                          class="vl_date"
                          :time-arrow-control="true"
                          :picker-options="pickerOptions"
                          type="datetime"
                          value-format="timestamp"
                          placeholder="请选择开始时间">
                  </el-date-picker>
                </div>
                <div class="search_line">
                  <!--<span class="time">至</span>-->
                  <el-date-picker
                          style="width: 100%;"
                          class="vl_date vl_date_end"
                          :time-arrow-control="true"
                          v-model="searchData.endTime"
                          :picker-options="pickerOptions"
                          type="datetime"
                          @change="chooseEndTime"
                          value-format="timestamp"
                          placeholder="请选择结束时间">
                  </el-date-picker>
                </div>
                <div class="search_line_ts">
                  <div class="title">
                    <span class="">抓拍区域:</span>
                    <span>
                    <i class="choose_btn el-icon-location-outline" @click="setFitV" :class="{'not-active': !searchData.area}"></i>
                    <i class="choose_btn el-icon-delete" @click="delDialog = true"></i>
                  </span>
                  </div>
                  <div class="drawBox">
                    <div class="items">
                      <span @click="clickTab('cut1')" :class="['cut1',{'hover':hover=='cut1'}]"></span>
                      <span @click="clickTab('cut2')"  :class="['cut2',{'hover':hover=='cut2'}]"></span>
                      <!--<span @click="clickTab('cut3')"  :class="['cut3',{'hover':hover=='cut3'}]"></span>-->
                      <span @click="clickTab('cut4')"  :class="['cut4',{'hover':hover=='cut4'}]"></span>
                      <!--<span @click="clickTab('cut5')"  :class="['cut5',{'hover':hover=='cut5'}]"></span>-->
                    </div>
                  </div>
                </div>
                <div class="search_line">
                  <div class="per_semblance"><span>频次 <b>期间不少于</b></span><el-input oninput="value=value.replace(/[^0-9.]/g,''); if(value >= 200)value = 200;"  v-model="searchData.minTimes"></el-input> 次</div>
                </div>
                <!--按钮-->
                <div class="search_btn">
                  <el-button @click="resetS">重置</el-button>
                  <el-button type="primary" @click="tcDiscuss">徘徊分析</el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="insetLeft vl_icon vl_icon_vehicle_02"  :class="{'vl_icon_vehicle_03': hideleft}" @click="hideLeft"></div>
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
//  import {getAllDevice} from '../../../api/api.judge.js';
  import {getAllMonitorList, getAllBayonetList} from '../../../api/api.base.js';
  import { formatDate, addCluster} from '../../../../../utils/util.js';
  export default {
    components: {vlBreadcrumb},
    data() {
      return {
        hideleft: false,
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
          curPointData: [],
          curMarks: [],
          minTimes: 3// 最少次数
        },
        pickerOptions: {
          disabledDate (time) {
            return time > new Date();
          }
        },
        mapTreeData: [],
        marks: [],
        hoverWindow: null,// 全局信息窗口
        circle: null,
        confirmIcon: null, // 选择区域之后的小弹窗
      };
    },
    mounted() {
      this.renderMap();
      this.setDTime();
      this.getAllDevice() //查询所有的设备
      this.resetZoom();
      let that = this;
      $('body').on('click', '.vl_map_area_confirm', function (e) {
        if (e.target.classList.contains('el-icon-close')) {
          that.cancelAddArea();
        }
        if (e.target.classList.contains('vl_area_complete')) {
          // 判断有没有选时间
          if (that.searchData.curPointData.length) {
            that.map.remove(that.confirmIcon);
          } else {
            that.showInfoMes('所选区域没有设备信息')
          }
        }
      })

    },
    methods: {
      cancelAddArea () {
        if (this.searchData.area) {this.map.remove(this.searchData.area);}
        if (this.confirmIcon) {this.map.remove(this.confirmIcon)}
        // 先判断你选择的区域有没有设备,没有就不用做处理
        if (this.searchData.curPointData.length) {
          this.recoverSXTcolor(this.searchData.curMarks);
        }
      },
      // 摄像头恢复原始颜色
      recoverSXTcolor (mks) {
        mks.forEach(x => {
          let uContent = this.setMarkContent(x.getExtData())
          x.setContent(uContent);
        })
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
      // 给选中的设备上色
      putSelectColor (mks) {
        mks.forEach(y => {
          let uContent = this.setMarkContent(y.getExtData(), 'error')
          y.setContent(uContent);
        })
      },
      showInfoMes(mes) {
        if (!document.querySelector('.el-message--info')) {
          this.$message.info(mes);
        }
      },
      chooseEndTime (e) {
        if (new Date(e).getTime() < this.searchData.startTime) {
          this.$message.info('结束时间必须大于开始时间才会有结果')
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
      setFitV () {
        this.map.setFitView([this.searchData.area]);
      },
      getAllDevice(){
        let newBlist = [], newDlist = [];
        getAllMonitorList({
          ccode: mapXupuxian.adcode
        }).then(res=>{
          if(res.data && res.data.length>0){
            newDlist = this.objSetItem(res.data, {infoName: 'deviceName', dataType: 0});
          }
          getAllBayonetList({
            areaId: mapXupuxian.adcode
          }).then(resBon => {
            if(resBon.data && resBon.data.length>0){
              newBlist = this.objSetItem(resBon.data, {infoName: 'bayonetName', dataType: 1});
            }
            this.mapTreeData = newDlist.concat(newBlist)
            console.log(this.mapTreeData)
            this.mapMark(this.mapTreeData)
          })
        })
      },
      // keys的各个props 代表接口返回的摄像头，人物，车辆，卡口的list的字段名及list里面元素name;;allKey
      objSetItem (list, obj) {
        let result = [];
        list.map(z => {
          if (z.longitude && z.latitude) {
            for (let key in obj) {
              z[key] = z[obj[key]] ? z[obj[key]] : obj[key]
            }
            // 都加上markSid , 方便处理移动端发起的通话
            if (!z['markSid']) {
              z['markSid'] = 'mapMark' + z['dataType'] + z['uid'];
            }
          }
          result.push(z)
        })
        return result;
      },
      // 地图标记
      mapMark (data) {
        if (data && data.length > 0) {
          let _this = this;
          data.forEach((obj, _index) => {
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
                // 给obj设置markIndex ,为当前在marks集合中所处的位置，
                obj['markIndex'] = _index;
                let marker = new window.AMap.Marker({ // 添加自定义点标记
//                  map: _this.map,
                  position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
                  offset: new window.AMap.Pixel(offSet[obj.dataType][0], offSet[obj.dataType][1]), // 相对于基点的偏移位置
                  draggable: false, // 是否可拖动
                  extData: obj,
                  // 自定义点标记覆盖物内容
                  content: uContent,
                  bubble: true
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
          addCluster(_this.map, _this.marks)
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
            if (_this.searchData.area) {
              _this.map.remove(_this.searchData.area)
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
            _this.searchData.area = circle;
            // 画完区域取消地图工具激活状态
            _this.map.setDefaultCursor();
            _this.mouseTool.close(false);
            _this.hover = '';
            _this.createConfirmMark(e.lnglat);

            _this.checkout(circle,'AMap.circle')

            // 判断如果当前curAddSearch.curMarks有数据的话，先加入点聚合
            if (_this.searchData.curMarks.length) {
              _this.recoverSXTcolor(_this.searchData.curMarks)
            }
            _this.searchData.curMarks = [];
            _this.searchData.curPointData.forEach(j => {
              _this.searchData.curMarks.push(_this.marks[j.markIndex]);
            })
            _this.putSelectColor(_this.searchData.curMarks)
          }

        });
        window.AMap.event.addListener(this.mouseTool, 'draw', function (e) {
          if (_this.searchData.area) {_this.map.remove(_this.searchData.area);}
          if (_this.confirmIcon) {_this.map.remove(_this.confirmIcon);}
          _this.searchData.area = e.obj;
          // 画完区域取消地图工具激活状态
          _this.map.setDefaultCursor();
          _this.mouseTool.close(false);
          _this.hover = '';
          _this.createConfirmMark(e.obj.getPath()[e.obj.getPath().length - 1]);

          let a=e.obj
          let t=e.obj.CLASS_NAME
          _this.checkout(a,t);
          // 判断如果当前curAddSearch.curMarks有数据的话，恢复初始颜色
          if (_this.searchData.curMarks.length) {
            _this.recoverSXTcolor(_this.searchData.curMarks)
          }
          _this.searchData.curMarks = [];
          _this.searchData.curPointData.forEach(j => {
            _this.searchData.curMarks.push(_this.marks[j.markIndex]);
          })
          _this.putSelectColor(_this.searchData.curMarks)
        });
      },
      checkout(obj , type){
        this.searchData.curPointData = [];
        if(type!="AMap.Polyline"){
          this.mapTreeData.forEach(el=>{
            let myLngLat=new window.AMap.LngLat(el.longitude,el.latitude);
            //  var isPointInRing = window.AMap.GeometryUtil.isPointInRing(myLngLat,obj.C.path);
            let isPointInRing = obj.contains(myLngLat);
            // console.log(marker.getPosition());
            if(isPointInRing){//如果点在圆内则输出
              let id = this.searchData.curPointData.findIndex(item=>item.uid==el.uid)
              if(id == -1){
                this.searchData.curPointData.push(el)
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
            let id = this.searchData.curPointData.findIndex(item=>item.uid==el.uid)
            if(id==-1 && distance <=1000){
              this.searchData.curPointData.push(el)
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
        let _sDate = new Date(curDate - curS);
        let _s = _sDate.getFullYear()+ '-' + (_sDate.getMonth() + 1) + '-' + _sDate.getDate() + ' 00:00:00' ;
        this.searchData.startTime = new Date(_s).getTime();
        this.searchData.endTime = curDate;
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
        this.searchData.curPointData = [];
        this.delDialog = false;
        this.mouseTool.close(true);
        if (this.searchData.area) {
          this.map.remove(this.searchData.area)
        }
        this.recoverSXTcolor(this.searchData.curMarks)
        this.searchData.area = null;
      },
      tcDiscuss () {
        if (!this.searchData.minTimes || this.searchData.minTimes < 3) {
          this.showInfoMes('频次必须是3-200的数字')
          return false;
        }
        if (!this.searchData.area) {
          this.showInfoMes('请先选择区域')
          return false;
        }
        let sT = formatDate(this.searchData.startTime, 'yyyy-MM-dd HH:mm:ss');
        let eT = formatDate(this.searchData.endTime, 'yyyy-MM-dd HH:mm:ss');
        let query = {};
        query.startTime = sT;
        query.endTime = eT;
        query.frequence = this.searchData.minTimes;
        query['bayonetIds'] = this.searchData.curPointData.filter(x => x.dataType === 1).map(y => {return y.uid}).join(',');
        query['cameraIds'] = this.searchData.curPointData.filter(x => x.dataType === 0).map(y => {return y.uid}).join(',');
        window.sessionStorage.setItem('qyphParam', JSON.stringify(query));
        this.$router.push({name: 'vehicle_search_qyph_jg'})
      }
    },
    beforeDestroy () {
      $('body').unbind('click');
    }
  };
</script>
<style lang="scss" scoped>
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
      /*height: 100%;*/
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
  .el-date-editor {
    .el-input__suffix {
     &:last-child {
       i {
         display: none;
       }
     }
    }
  }
  .per_semblance {
    position: relative;
    >span {
      position: absolute;
      left: 10px;
      display: block;
      height: 50px;
      line-height: 50px;
      z-index: 9;
      b {
        color: #D3D3D3;
        font-weight: normal;
        margin-left: 10px;
      }
    }
    >i {
      display: inline-block;
      width: 20px;
      height: 1px;
      background: #999;
      margin: 19px 16px;
      vertical-align: middle;
    }
    .el-input {
      width: 198px;
      margin-right: 10px;
      input{
        text-indent: 130px;
      }
    }
  }
}
</style>