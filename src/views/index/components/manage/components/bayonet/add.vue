<template>
  <div class="bayonet_manage_add">
    <div is="vlBreadcrumb" :breadcrumbData="breadcrumbData"></div>
    <div class="add_form">
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px" :label-position="labelPosition">
        <el-form-item prop="bayonetName" label="卡口名称">  
          <el-input show-word-limit maxlength="20" v-model="addForm.bayonetName" placeholder="请输入卡口名称，不超过20字"></el-input>
        </el-form-item>
        <el-form-item prop="bayonetNum" label="卡口编号">
          <el-input v-model="addForm.bayonetNum" placeholder="请输入卡口编号"></el-input>
        </el-form-item>
        <el-form-item prop="organ" label="所属机构">
          <el-select v-model="addForm.organ" placeholder="请搜索选择所属机构单位">
            <el-option
              v-for="item in organList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="use" label="卡口用途">
          <el-select v-model="addForm.use" placeholder="请输入用途">
            <el-option
              v-for="item in useList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经纬度" required class="longlat">
          <el-form-item prop="longitude">
            <el-input v-model="addForm.longitude" placeholder="请输入经度"></el-input>
          </el-form-item>
          <span>(经度)</span>
          <el-form-item prop="Latitude">
            <el-input v-model="addForm.Latitude" placeholder="请输入纬度"></el-input>
          </el-form-item>
          <span>(纬度)</span>
          <span><i class="el-icon-circle-plus-outline"></i> 地图选择</span>
        </el-form-item>

        <el-form-item label="卡口地址" required class="bayonet_address">
          <el-form-item prop="county">
            <el-select v-model="addForm.county">
              <el-option
                v-for="item in countyList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="town">
            <el-select v-model="addForm.town">
              <el-option
                v-for="item in townList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="community">
            <el-select v-model="addForm.community">
              <el-option
                v-for="item in communityList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="address">
            <el-input v-model="addForm.address" placeholder="请输入详细地址"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item prop="describe" label="描述">
          <el-input show-word-limit maxlength="150" type="textarea" v-model="addForm.describe" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="卡口设备" required></el-form-item>
        <div class="main_tab_box">
          <ul class="tab_list">
            <li :class="{'active_li': tabState === 1}" @click="tabState = 1">地图选择</li>
            <li :class="{'active_li': tabState === 2}" @click="tabState = 2">列表选择</li>
          </ul>
          <div class="select_map_area" v-show="tabState === 1">
            <div class="select_map_left">
              <div class="select_top">
                <span>已有设备 ()</span>
                <template>
                  <p style="color: #0C70F8">移除设备</p>
                </template>
                <template v-if="false">
                  <p style="cursor:default;">移除设备</p>
                </template>
              </div>
              <vue-scroll style="height: calc(100% - 45px)">
                <ul class="dev_box">
                  <li v-for="item in '1234567897891231'" :key="item.id">
                    <el-checkbox style="margin-right: 10px;"></el-checkbox>
                    <span>广场监控点1-300</span>
                  </li>
                </ul>
              </vue-scroll>
            </div>
            <div class="select_map_right">
              <div class="select_map_right_title">
                <span>可选设备</span>
                <span>()</span>
              </div>
              <div id="mapMap"></div>
              <div class="right-flag">
                <ul class="map-rrt map_rrt_u1">
                  <li :class="{'vl_icon_sed': selAreaAcitve}" @click="selArea">
                    <i class="vl_icon vl_icon_041"></i>
                    <span>选择区域</span>
                  </li>
                </ul>
                <ul class="map-rrt">
                  <li><i class="vl_icon vl_icon_control_23" @click="resetMapTwo"></i></li>
                </ul>
                <ul class="map-rrt map_rrt_u2">
                  <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
                  <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="select_list_area" v-show="tabState === 2">
            <div class="select_list_left">
              <div class="select_top">
                <span>已有设备 ()</span>
                <template>
                  <p style="color: #0C70F8">移除设备</p>
                </template>
                <template v-if="false">
                  <p style="cursor:default;">移除设备</p>
                </template>
              </div>
              <vue-scroll style="height: calc(100% - 45px)">
                <ul class="dev_box">
                  <li v-for="item in '1234567897891231'" :key="item.id">
                    <el-checkbox style="margin-right: 10px;"></el-checkbox>
                    <span>广场监控点1-300</span>
                  </li>
                </ul>
              </vue-scroll>
            </div>
            <div class="select_list_right">
              <div class="select_top">
                <span>可选设备 ()</span>
                <template>
                  <p style="color: #0C70F8">添加设备</p>
                </template>
                <template v-if="false">
                  <p style="cursor:default;">添加设备</p>
                </template>
              </div>
              <vue-scroll style="height: calc(100% - 45px)">
                <ul class="dev_box">
                  <li v-for="item in '1234567897891231'" :key="item.id">
                    <el-checkbox style="margin-right: 10px;"></el-checkbox>
                    <span>广场监控点1-300</span>
                  </li>
                </ul>
              </vue-scroll>
            </div>
          </div>

        </div>
      </el-form>
      <div id="mapBox"></div>
      <div class="operate_btn">
        <el-button class="reset_btn">取消</el-button>
        <el-button class="select_btn">确定</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
import {mapXupuxian} from '@/config/config.js';
import { getAllMonitorList } from '@/views/index/api/api.control.js';
import {cameraData} from '@/views/index/components/control/testData.js';
import {random14} from '@/utils/util.js';
export default {
  components: {vlBreadcrumb},
  data () {
    return {
      breadcrumbData: [{name: '系统管理', routerName: 'manage'}, {name: '卡口管理', routerName: 'bayonet_manage'}],
      pageType: null,// 1为新增，2为编辑
      labelPosition: 'right',
      // 表单参数
      addForm: {
        bayonetName: null,
        bayonetNum: null,
        organ: null,
        use: null,
        longitude: null,
        Latitude: null,
        county: null,
        town: null,
        community: null,
        address: null,
        describe: null
      },
      // 表单列表参数
      organList: [],// 机构列表
      useList: [],// 用途列表
      countyList: [],// 县列表
      townList: [],// 镇列表
      communityList: [],// 社区列表
      // 表单验证规则
      addFormRules: {
        bayonetName: [{required: true, message: '请填写姓名', trigger: 'blur'}],
        bayonetNum: [{required: true, message: '请选择证件类型', trigger: 'blur'}],
        organ: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        use: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        longitude: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        Latitude: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        county: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        town: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        community: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        address: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        describe: [{required: true, message: '请填写证件号码', trigger: 'blur'}]
      },
      // 地图参数
      mapOne: null,
      zoomLevel: 16,
      lngLat: null,//经纬度
      autoComplete: null,
      marker: null,
      // 卡口设备选择参数
      tabState: 1,
      // 选择区域
      mapTwo: null,
      selAreaAcitve: false,
      selAreaPolygon: null,
      mouseTool: null,
      selAreaAble: false,
     
      finalDeviceList: [],
      selectDeviceList: [],
      unCheckDeviceList: [],
      isSelected: false,
      kkList: [],
      sxtList: [],
      sxtMapMarkers: [],
      kkMapMarkers: [],

    }
  },
  
  mounted () {
    this.pageType = parseInt(this.$route.query.type);
    if (this.pageType === 1) {
      this.breadcrumbData.push({name: '新增卡口'});
    } else {
      this.breadcrumbData.push({name: '编辑卡口'});
    }
    this.resetMapOne();
    
    this.getAllMonitorList();
    this.initMapTwo();
    
    
  },
  methods: {
    /* 地图选择经纬度方法start */
    resetMapOne () {
      let _this = this;
      let map = new window.AMap.Map('mapBox', {
        zoom: this.zoomLevel,
        center: mapXupuxian.center
      });
      map.setMapStyle('amap://styles/whitesmoke');
      map.plugin('AMap.Autocomplete', () => {
        let autoOptions = {
          city: '溆浦县'
        }
        _this.autoComplete = new window.AMap.Autocomplete(autoOptions);
      })
      map.on('click', function (e) {
        console.log(e, 'eeee')
        new window.AMap.service('AMap.Geocoder',function(){//回调函数
            let geocoder = null;
            //实例化Geocoder
            geocoder = new window.AMap.Geocoder({
                city: ""//城市，默认：“全国”
            });
            var lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];//地图上所标点的坐标
            _this.addForm.longitude = lnglatXY[0];
            _this.addForm.Latitude = lnglatXY[1];
            geocoder.getAddress(lnglatXY, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    //获得了有效的地址信息:
                    //即，result.regeocode.formattedAddress
                    _this.markLocation(e.lnglat.getLng(), e.lnglat.getLat(), result.regeocode.formattedAddress);

                }else{
                    //获取地址失败
                    _this.$message.error('没有获取到地址');
                }
            });
        })

      })
      _this.mapOne = map;
    },
    // 输入追踪点定位圆形覆盖物的中心点
    markLocation(lng, lat, address) {
      let _this = this;
      if (_this.marker) {
        _this.mapOne.remove(_this.marker);
      }
      _this.lngLat = [lng, lat];
      // 追踪点标记
      let offSet = [-20.5, -48], _hoverWindow = null;
      if (lng > 0 && lat > 0) {
        _this.marker = new window.AMap.Marker({ // 添加自定义点标记
          map: _this.mapOne,
          position: [lng, lat],
          offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          extData: '',
          // 自定义点标记覆盖物内容
          content: '<div class="vl_icon vl_icon_message_7"></div>'
        });
        // hover
        _this.marker.on('mouseover', function () {
          let _sContent = `<div class="vl_map_hover">
            <div class="vl_map_hover_main"><ul>
              <li><span>事发地点：</span><span>${address}</span></li>
            </ul></div>`;
          _hoverWindow = new window.AMap.InfoWindow({
            isCustom: true,
            closeWhenClickMap: true,
            offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
            content: _sContent
          });
          _hoverWindow.open(_this.mapOne, new window.AMap.LngLat(lng, lat));
        });
        _this.marker.on('mouseout', function () {
          if (_hoverWindow) { _hoverWindow.close(); }
        });
        _this.mapOne.setCenter([lng, lat]);
        _this.marker.setMap(_this.mapOne);
      }
    },
    /* 地图选择经纬度方法end */

    /* 卡口设备选择方法start */
    initMapTwo () {
      let _this = this;
      let map = new window.AMap.Map('mapMap', {
        zoom: 18, // 级别
        // center: [112.974691, 28.093846], // 中心点坐标
        center: [110.596015, 27.907662], // 中心点坐标
        // viewMode: '3D' // 使用3D视图
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.mapTwo = map;
      // 在地图中添加MouseTool插件
      let mouseTool = new window.AMap.MouseTool(map);
      _this.mouseTool = mouseTool;
      // 添加事件
      window.AMap.event.addListener(mouseTool, 'draw', function (e) { // 画
        setTimeout(() => {
          _this.selAreaRest(true);
          let polygon = new window.AMap.Polygon({ // 构造多边形对象
            map: map, // 地图对象
            strokeColor: '#FA453A', // 线条颜色
            strokeOpacity: 1, // 轮廓线透明度 [0,1]
            strokeWeight: 1, // 轮廓线宽度
            fillColor: '#FA453A', //多边形填充颜色
            fillOpacity: 0.2, // 多边形填充透明度
            path: e.obj.getPath(), // 多边形轮廓线的节点坐标数组
            zIndex: 12 // 多边形覆盖物的叠加顺序,级别高的在上层显示
          });

          _this.selAreaPolygon = polygon;
          _this.selAreaAble = true;
          _this.mapMarkHandler();

        }, 100);
      });
    },
    // 获取所有监控设备列表
    getAllMonitorList () {
      const params = {ccode: mapXupuxian.adcode}
      // getAllMonitorList(params).then(res => {
      //   if (res && res.data) {

      //   }
      // })
      this.sxtList = cameraData;
      console.log(cameraData, 'cameraData')
      this.mapMarkHandler();
      
    },
    // 地图标记处理
    mapMarkHandler () {
      // 摄像头
      this.mapClearMarkers(this.sxtMapMarkers);
      this.mapMark(this.sxtList, this.sxtMapMarkers, 'sxt');
      
      // 卡口
      // this.mapClearMarkers(this.kkMapMarkers);
      // this.mapMark(this.kkList, this.kkMapMarkers, 'kk');
      
    },
    // 地图标记
    mapMark (data, aMarkers, keyWord) {
      console.log(1111111111111)
      if (data && data.length > 0) {
        
        let _this = this;
        // _this.finalDeviceList = [];
        for (let i = 0; i < data.length; i++) {
          let obj = data[i];
          obj.sid = keyWord + '_' + i + '_' + random14();
          if (obj.longitude > 0 && obj.latitude > 0) {

            _this.mapTwo && _this.mapTwo.setCenter([obj.longitude, obj.latitude]);

            let offSet = [-20.5, -48], selClass = '', hoverWindow = null;
            if (_this.selAreaPolygon && !_this.selAreaPolygon.contains(new window.AMap.LngLat(obj.longitude, obj.latitude))) {
              // 多边形存在且不在多边形之中
              selClass = "vl_map_selarea_hide";
              this.unCheckDeviceList.push(obj); // 没有选中的设备
            }
            if (_this.selAreaPolygon && _this.selAreaPolygon.contains(new window.AMap.LngLat(obj.longitude, obj.latitude))) { // 在多边形中且选中的设备
              _this.finalDeviceList.push(obj);
            }
            let marker = new window.AMap.Marker({ // 添加自定义点标记
              map: _this.mapTwo,
              // 110.601394, 27.909162
              position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
              // position: [110.601394, 27.909162], // 基点位置 [116.397428, 39.90923]
              offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: obj, // 用户自定义属性
              // 自定义点标记覆盖物内容
              content: '<div id="' + obj.sid + '" class="vl_icon vl_icon_' + keyWord + ' ' + selClass + '"></div>'
            });
            // myAMap.hoverMarkerHandler(map, marker, obj);
            _this.marker = marker;

            let title = '';
            if (keyWord === 'kk') {
              title = '卡口名称：' + obj.deviceName;
            } else {
              title = '摄像头名称：' + obj.deviceName;
            }
            _this.marker.on('mouseover', function () {
              let sContent = '<div class="vl_map_hover" >' +
                '<div class="vl_main_hover_address" style="min-width: 300px;padding: 15px"><p>' + title + '</p></div></div>';
              hoverWindow = new window.AMap.InfoWindow({
                isCustom: true,
                closeWhenClickMap: true,
                offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
                content: sContent
              });
              hoverWindow.open(_this.mapTwo, new window.AMap.LngLat(obj.longitude, obj.latitude));
            });
            _this.marker.on('mouseout', function () {
              if (hoverWindow) { hoverWindow.close(); }
            });
            if (!aMarkers) { aMarkers = []; }
            aMarkers.push(marker);
            
          }
        }
        if ( _this.selAreaPolygon) {
          setTimeout(() => {
            _this.mapTwo.remove(_this.selAreaPolygon);
            _this.selAreaPolygon = null;
            _this.mapTwo.remove(_this.marker);

            _this.mapMarkHandler();
          }, 1000);

        }
      }
    },
    // 清除所有
    resetTools () {
      this.selAreaRest();
    },
    // 清除地图标记
    mapClearMarkers (aMarkers) {
      if (this.mapTwo && aMarkers && aMarkers.length > 0) {
        this.mapTwo.remove(aMarkers);
        aMarkers = [];
      }
    },
    // 选择区域
    selArea () {
      if (this.selAreaAcitve) {
        this.resetTools();
        return false;
      }
      this.resetTools();
      if (this.mapTwo && this.mouseTool) {
        this.selAreaAcitve = true;
        this.mouseTool.close(true);
        this.mapTwo.setDefaultCursor('crosshair');
        this.mouseTool.polygon({
          zIndex: 13,
          strokeColor: '#FA453A',
          strokeOpacity: 1,
          strokeWeight: 1,
          fillColor: '#FA453A',
          fillOpacity: 0.2
        });
      }
    },
    // 重置选择区域
    selAreaRest (notClearPolygon) {
      this.selAreaAcitve = false;
      this.mouseTool.close(true);
      this.mapTwo.setDefaultCursor('');
      if (!notClearPolygon && this.selAreaPolygon) {
        this.mapTwo.remove(this.selAreaPolygon);
        this.selAreaPolygon = null;
        this.selAreaAble = false;
      }
    },
    // 重置地图
    resetMapTwo () {
      this.initMapTwo();
    },
    mapZoomSet (val) {
      if (this.mapTwo) {
        this.mapTwo.setZoom(this.mapTwo.getZoom() + val);
      }
    },
    /* 卡口设备选择方法end */
  }
}
</script>
<style lang="scss" scoped>
.bayonet_manage_add{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .add_form{
    padding: 20px;
    width: 100%;
    height: calc(100% - 50px);
    overflow-y: auto;
    #mapBox{
      width: 100%;
      height: 500px;
    }
    .main_tab_box {
      height: 100%;
      margin-top: 10px;
      border: 1px solid #D3D3D3;
      margin-bottom: 20px;
      border-radius:4px 4px 0px 0px;
      .tab_list {
        height: 44px;
        line-height: 44px;
        background-color: #FAFAFA;
        border-bottom: 1px solid #F2F2F2;
        >li {
          display: inline-block;
          margin: 0 20px;
          color: #333333;
          cursor: pointer;
          &.active_li {
            color: #0C70F8;
            border-bottom: 2px solid #0C70F8;
          }
        }
      }
      .select_map_area{
        width: 100%;
        display: flex;
        height: 490px;
        .select_map_left{
          width: 300px;
          height: 100%;
          .select_top {
            display: flex;
            justify-content: space-between;
            height: 45px;
            line-height: 45px;
            padding: 0 10px;
            border-top: 1px solid #F2F2F2;
            border-bottom: 1px solid #F2F2F2;
            border-right: 1px solid #F2F2F2;
            >span {
              color: #333333;
            }
            >p {
              color: #B2B2B2;
              cursor: pointer;
            }
          }
          .dev_box{
            height: 100%;
            padding: 10px 20px;
            li{
              height: 36px;
              line-height: 36px;
              > span{
                color: #666;
              }
            } 
          }
        } 
        .select_map_right {
          width: calc(100% - 300px);
          height: 100%;
          position: relative;
          .select_map_right_title {
            width: 100%;
            left: 0;
            top: 0;
            z-index: 1;
            position: absolute;
            color: #333333;
            height: 45px;
            line-height: 45px;
            padding: 0 5px;
            border-top: 1px solid #f2f2f2;
          }
          #mapMap {
            width: 100%;
            height: calc(100% - 45px);
            margin-top: 45px;
          }
          .right-flag {
            position: absolute;
            right: 30px;
            bottom: 10px;
            transition: right .3s ease-out;
            animation: fadeInRight .4s ease-out .4s both;
            .map-rrt {
              margin-bottom: 20px;
              box-shadow: 0 0 10px rgba(148,148,148,0.24);
              >li {
                padding: 12px 5px;
                background-color: #ffffff;
                cursor: pointer;
                border-bottom: 1px solid #eee;
                text-align: center;
                >i {
                  font-size: 20px;
                  color: #0B6FF7;
                }
                >span {
                  font-size: 12px;
                }
                &:last-child { border-bottom: 0; }
              }
            }
            .map_rrt_u1 {
              >li {
                display: flex;
                flex-direction: column;
                align-items: center;
                i {
                  text-align: center;
                  display: block;
                }
                span {
                  text-align: center;
                  display: block;
                }
              }
            }
          }
        }
        .el-checkbox {
          margin-right: 10px;
        }
        .close_arrow {
          position: absolute;
          i {
            color: #F94439;
            font-size: 20px;
          }
        }
      }
      .select_list_area {
        width: 100%;
        display: flex;
        height: 490px;
        border-top: 1px solid #f2f2f2;
        .select_list_left {
          width: 300px;
          height: 100%;
          border-right: 1px solid #F2F2F2;
          .select_top {
            display: flex;
            justify-content: space-between;
            height: 45px;
            line-height: 45px;
            padding: 0 10px;
            border-bottom: 1px solid #F2F2F2;
            >span {
              color: #333333;
            }
            >p {
              color: #B2B2B2;
              cursor: pointer;
            }
          }
          .dev_box{
            height: 100%;
            padding: 10px 20px;
            li{
              height: 36px;
              line-height: 36px;
              > span{
                color: #666;
              }
            } 
          }
        }
        .select_list_right {
          width: 300px;
          height: 100%;
          border-right: 1px solid #F2F2F2;
          .select_top {
            display: flex;
            justify-content: space-between;
            height: 45px;
            line-height: 45px;
            padding: 0 10px;
            border-bottom: 1px solid #F2F2F2;
            >span {
              color: #333333;
            }
            >p {
              color: #B2B2B2;
              cursor: pointer;
            }
          }
          .dev_box{
            height: 100%;
            padding: 10px 20px;
            li{
              height: 36px;
              line-height: 36px;
              > span{
                color: #666;
              }
            } 
          }
          .search_box {
            margin: 4px 10px;
            /deep/ .el-input--small .el-input__inner {
              width: 220px;
              border-radius: 40px;
              background-color: #F2F2F2;
              color: #999999;
            }
            .search_icon{
              margin-top: 8px;
              cursor: pointer; 
              // margin-right: 35px;
            }
            /deep/ .el-input__suffix {
              right: 48px;
            }
          }
          .all_select_checkbox {
            padding: 10px 20px 0;
          }
        }
        .el-checkbox {
          margin-right: 10px;
        }
      }
    }
  }
  .operate_btn{
    width: 100%;
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
    border-top: 1px solid #e6e6e6;
    background: #fff;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 999;
  }
}
</style>
<style lang="scss">
.bayonet_manage_add{
  .add_form{
    .longlat > .el-form-item__content{
      display: flex;
      flex-wrap: nowrap;
    }
    .bayonet_address > .el-form-item__content{
      display: flex;
      flex-wrap: nowrap;
    }
  }
}
</style>

