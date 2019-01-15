<template>
  <el-form>
    <!-- 图片上传 -->
    <el-form-item label="人员图片:" prop="personnelPic" style="width: 25%;margin-bottom: 0;padding-left: 20px;padding-top: 10px;">
      <div is="uploadPic" @uploadPicSubmit="uploadPicSubmit"></div>
      <div class="pic_format">
        <div>从库中选择</div>
        <div class="vl_f_999">（支持JPEG、JPG、PNG、每张大小不超过2M）</div>
      </div>
    </el-form-item>
    <el-form-item v-if="modelMType !== '1'" label="车牌信息" placeholder="请补充车牌号码" style="width: 50%;padding-left: 20px;" :class="{'licenseNum': modelMType !== '4'}">
      <el-input v-model="createForm.licenseNum"></el-input>
    </el-form-item>
    <el-form-item v-if="modelMType === '3'"  label="受限范围" placeholder="请选择" style="width: 50%;padding-left: 20px;">
      <el-select value-key="uid" v-model="createForm.limitation" filterable placeholder="请选择">
        <el-option
          v-for="item in limitationList"
          :key="item.uid"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <template v-if="modelMType === '1' || modelMType === '2'">
      <el-form-item :label="'追踪点' + (index + 1) + ':'" :prop="'points.' + index + '.point'" :rules="{ required: true, message: '追踪点不能为空', trigger: 'blur'}" v-for="(item, index) in createForm.points" :key="index" style="width: 50%;padding-left: 20px;" class="point">
        <el-input v-model="item.point"></el-input><i class="el-icon-delete" @click="removePoint(item)"></i>
      </el-form-item>
      <el-form-item style="width: 50%;padding-left: 20px;">
        <div class="add_point" @click="addPoint"><i class="el-icon-plus"></i>添加追踪点</div>
      </el-form-item>
    </template>
    <!-- 地图 -->
    <div class="manage_d_s_m">
      <div :id="mapMId"></div>
      <div class="manage_d_s_m_l">
        <div style="height: 130px;padding: 20px 20px;" :class="{'equ_h': (modelMType === '3' || modelMType === '4')}">
          <el-input v-if="modelMType === '1' || modelMType === '2'" v-model="scopeRadius" @keyup.enter.native="mapCircle()" placeholder="请输入范围半径值（单位千米）" style="width: 220px;margin-bottom: 10px;"></el-input>
          <el-select value-key="uid" v-model="features" filterable placeholder="选择设备特性" style="width: 220px;">
            <el-option
              v-for="item in featuresTypeList"
              :key="item.uid"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="height: 617px;">
          <div class="vl_f_333 top">
            <span>已选设备({{trackPointList.length}})</span>
            <el-tooltip class="item" effect="light" content="恢复默认" placement="top">
              <i class="el-icon-setting" style="float: right;cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div class="dp_box">
            <div v-for="trackPoint in trackPointList" :key="trackPoint.tid">
              <div class="track_t" @click="dropdown(trackPoint)" :class="{'active': trackPoint.isDropdown}">
                <i class="el-icon-arrow-down" v-show="trackPoint.isDropdown"></i><i class="el-icon-arrow-right" v-show="!trackPoint.isDropdown"></i><span>{{trackPoint.trackPointName}}</span>
              </div>
              <el-collapse-transition>
                <div v-show="trackPoint.isDropdown">
                  <div class="equ_m">
                    <div @click="getEquList('0', trackPoint)" :class="{'active': tid === trackPoint.tid && type === '0'}">摄像头</div>
                    <div @click="getEquList('1', trackPoint)" :class="{'active': tid === trackPoint.tid && type === '1'}">卡口</div>
                  </div>
                  <ul v-if="type === '0'">
                    <li v-for="equ in trackPoint.sxt" :key="equ.sid" @click="eid = equ.sid" :class="{'active': eid === equ.sid}">
                      <span>{{equ.sxtName}}<br/><span class="vl_f_666">距追踪点001 <span style="color: orange;">1.4km</span></span></span>
                      <div><i class="vl_icon vl_icon_camera"></i><i class="el-icon-delete"></i></div>
                    </li>
                  </ul>
                  <ul v-else>
                    <li v-for="equ in equList" :key="equ.kid" @click="eid = equ.kid" :class="{'active': eid === equ.kid}">
                      <span>{{equ.kName}}<br/><span class="vl_f_666">距追踪点001 <span style="color: orange;">1.4km</span></span></span>
                      <div><i class="vl_icon vl_icon_camera"></i><i class="el-icon-delete"></i></div>
                    </li>
                  </ul>
                </div>  
              </el-collapse-transition>
            </div>
          </div>
        </div>
      </div>
      <div class="manage_d_s_m_r">
        <div class="top" @click="selAreaType()"><i class="el-icon-location"></i></div>
        <div v-if="modelMType === '4'" style="line-height: 14px;padding-top: 16px;" :class="['top', {'vl_icon_sed': rangingAcitve}]" @click="ranging()">
          <i class="vl_icon vl_icon_042"></i><p :class="{'active': rangingAcitve}">测距</p>
        </div>
        <ul class="bottom">
          <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
          <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
        </ul>
      </div>
    </div>
  </el-form>
</template>
<script>
import {conData} from './testData.js';
import {random14} from '../../../../utils/util.js';
import uploadPic from './uploadPic.vue';
export default {
  components: {uploadPic},
  name: 'model',
  props: ['mapId', 'modelType'],
  data () {
    return {
      createForm: {
        licenseNum: null,
        limitation: null,
        points: [
          {point: null}
        ],
      },
      limitationList: [],
      // 地图数据
      mapMId: null,
      modelMType: null,
      map: null,
      mouseTool: null,
      selAreaAcitve: false,
      selAreaAble: false,
      selAreaCircle: null,
      selAreaPolygon: null,
      // 测距
      rangingAcitve: false,
      rangingObj: null,
      // 追踪点列表数据
      trackPointList: [
        // {tid: '001', trackPointName: '追踪点001:长沙市天心区创谷广告产业园B3栋', 
        //   sxt: [
        //     {sid: '0', sxtName: '摄像头001'},
        //     {sid: '1', sxtName: '摄像头002'},
        //     {sid: '2', sxtName: '摄像头003'},
        //     {sid: '3', sxtName: '摄像头004'},
        //     {sid: '4', sxtName: '摄像头005'},
        //     {sid: '5', sxtName: '摄像头006'},
        //     {sid: '6', sxtName: '摄像头007'},
        //     {sid: '7', sxtName: '摄像头008'}
        //   ],
        //   kk: [
        //     {kid: '01', kName: '卡口0011'},
        //     {kid: '11', kName: '卡口0021'},
        //     {kid: '21', kName: '卡口0031'},
        //     {kid: '31', kName: '卡口0041'},
        //     {kid: '41', kName: '卡口0051'},
        //     {kid: '51', kName: '卡口0061'},
        //     {kid: '61', kName: '卡口0071'},
        //     {kid: '71', kName: '卡口0081'}
        //   ]
        // },
        // {tid: '002', trackPointName: '追踪点002:长沙市天心区创谷广告产业园B4栋', 
        //   sxt: [
        //     {sid: '8', sxtName: '摄像头0011'},
        //     {sid: '9', sxtName: '摄像头0021'},
        //     {sid: '10', sxtName: '摄像头0031'},
        //     {sid: '11', sxtName: '摄像头0041'},
        //     {sid: '12', sxtName: '摄像头0051'},
        //     {sid: '13', sxtName: '摄像头0061'},
        //     {sid: '14', sxtName: '摄像头0071'},
        //     {sid: '15', sxtName: '摄像头0081'}
        //   ],
        //   kk: [
        //     {kid: '81', kName: '卡口001'},
        //     {kid: '91', kName: '卡口002'},
        //     {kid: '101', kName: '卡口003'},
        //     {kid: '111', kName: '卡口004'},
        //     {kid: '121', kName: '卡口005'},
        //     {kid: '131', kName: '卡口006'},
        //     {kid: '141', kName: '卡口007'},
        //     {kid: '151', kName: '卡口008'}
        //   ]
        // }
      ],
      equList: [], //设备列表
      type: '0',// 设备类型
      tid: null,//追踪点列表id
      eid: null,//设备列表id
      dpType: null,//展开类型
      features: null,//设备特性
      featuresTypeList: [],//设备特性列表
      isBind: false, // 是否给map绑定点击事件
      scopeRadius: null, // 范围半径
      lnglat: null, // 坐标
    }
  },
  created () {
    this.mapMId = this.mapId;
    this.modelMType = this.modelType;
  },
  watch: {
    mapId (val) {
      this.mapMId = val;
    },
    modelType (val) {
      this.modelMType = val
    }
  },
  mounted () {
    console.log(1111111111)
    // 共有部分
    let _this = this;
    let map = new window.AMap.Map(_this.mapMId, {
      zoom: 16, // 级别
      center: [112.980377, 28.100175], // 中心点坐标112.980377,28.100175
      // viewMode: '3D' // 使用3D视图
    });
    map.setMapStyle('amap://styles/whitesmoke');
    _this.map = map;

    // 范围分析
    if (this.modelMType === '4') {
      // 在地图中添加MouseTool插件
      let mouseTool = new window.AMap.MouseTool(map);
      _this.mouseTool = mouseTool;
      // 添加事件
      window.AMap.event.addListener(mouseTool, 'draw', function (e) {
        console.log('drawPaths e', e); // 获取路径/范围
        console.log('drawPaths', e.obj.getPath()); // 获取路径/范围
        setTimeout(() => {
          _this.selAreaRest(true);
          let polygon = new window.AMap.Polygon({
            map: map,
            strokeColor: '#FA453A',
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: '#FA453A',
            fillOpacity: 0.2, 
            path: e.obj.getPath(),
            zIndex: 12
          });
          _this.selAreaPolygon = polygon;
          _this.selAreaAble = true;
          _this.getEquList(polygon);
        }, 100);
      });
    // 人员追踪/车辆追踪
    } else if (this.modelMType === '1' || this.modelMType === '2') {
      
    }
    _this.mapMark();
  },
  methods: {
    // 接收 到上传组件传过来的图片数据
    uploadPicSubmit (aUploadImg) {
      
    },
    // 添加追踪点
    addPoint () {
      this.createForm.points.push({
        point: null
      })
    },
    // 删除追踪点
    removePoint(item) {
      let index = this.createForm.points.indexOf(item)
      if (index !== -1) {
        this.createForm.points.splice(index, 1)
      }
    },
    // 切换设备类型获得设备列表数据
    getEquList (type, data) {
      this.type = type;
      this.tid = data.tid;
      if (type === '1') {
        this.equList = data.kk;
      }
    },
    // 展开或者闭合设备列表
    dropdown (data) {
      this.trackPointList.length > 0 && this.trackPointList.map(f => {
        if (data.tid === f.tid) {
          f.isDropdown = !f.isDropdown;
        } else {
          f.isDropdown = false;
        }
        this.getEquList('0', data);
      })
    },
    // 获得选取范围内的设备列表数据
    getEquList (graphics) {
      let _this = this;
      _this.trackPointList = [];
      let data = conData;
      console.log(data, 'data')
      for (let i = 0; i < data.length; i++) {
        let obj = data[i];
        obj.sid = obj.name + '_' + i + '_' + random14();
        if (obj.longitude > 0 && obj.latitude > 0) {
          let offSet = [-20.5, -48], selClass = '';
          if (graphics && graphics.contains(new window.AMap.LngLat(obj.longitude, obj.latitude))) {
            // 在圆形之中
            _this.$set(obj, 'isDropdown', false);
            _this.trackPointList.push(obj);
          }
        }
      }
    },
    // 地图标记
    mapMark () {
      let _this = this, hoverWindow = null;
      _this.trackPointList = [];
      let data = conData;
      console.log(data, 'data')
      for (let i = 0; i < data.length; i++) {
        let obj = data[i];
        obj.sid = obj.name + '_' + i + '_' + random14();
        if (obj.longitude > 0 && obj.latitude > 0) {
          let offSet = [-20.5, -48], selClass = '';
          let marker = new window.AMap.Marker({ // 添加自定义点标记
            map: _this.map,
            position: [obj.longitude, obj.latitude],
            offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: '<div id="' + obj.sid + '" class="vl_icon vl_icon_control"></div>'
          });
          // hover
          marker.on('mouseover', function () {
            let sContent = '<div class="vl_map_hover">' +
              '<div class="vl_map_hover_main"><ul>' + 
                '<li><span>设备名称：</span>' + obj.name + '</li>' + 
                '<li><span>设备地址：</span>' + obj.addr + '</li>' + 
              '</ul></div>';
            hoverWindow = new window.AMap.InfoWindow({
              isCustom: true,
              closeWhenClickMap: true,
              offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
              content: sContent
            });
            hoverWindow.open(_this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
            hoverWindow.on('close', function () {
              // console.log('infoWindow close')
            });
          });
          marker.on('mouseout', function () {
            if (hoverWindow) { hoverWindow.close(); }
          });
          marker.setMap(_this.map);
        }
      }
    },
    // 地图缩放
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    // 选择区域（圆形或者多边形）
    selAreaType () {
      if (this.modelMType === '1' || this.modelMType === '2') {
        this.mapBindClick();
      } else if (this.modelMType === '4') {
        this.selArea();
      }
    },
    // 为map绑定点击事件
    mapBindClick () {
      let _this = this, mapClickEvent = null;
      _this.isBind = !_this.isBind;
      if (_this.isBind) {
        console.log('绑定了')
        mapClickEvent = _this.map.on('click', function(e) {
          console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat(), 'target');
          _this.lnglat = [e.lnglat.getLng(), e.lnglat.getLat()];
          _this.mapCircle();
        });
      } else {
        _this.map.off(mapClickEvent);
        console.log('解绑了')
      }
    },
    // 标记地图范围，圆形覆盖物
    mapCircle () {
      let _this = this;
      if (_this.selAreaCircle) {
        _this.map.remove(_this.selAreaCircle);
      }
      let circle = new AMap.Circle({
        center: new AMap.LngLat(_this.lnglat[0], _this.lnglat[1]), // 圆心位置
        radius: _this.scopeRadius || 400,  //半径
        strokeColor: "#F33",  //线颜色
        strokeOpacity: 1,  //线透明度
        strokeWeight: 3,  //线粗细度
        fillColor: "#ee2200",  //填充颜色
        fillOpacity: 0.35 //填充透明度
      })
      _this.getEquList(circle);
      _this.selAreaCircle = circle;
      circle.setMap(_this.map)
    },
     // 选择区域
    selArea () {
      if (this.selAreaAcitve) {
        this.selAreaRest();
        return false;
      }
      this.selAreaRest();
      if (this.map && this.mouseTool) {
        this.selAreaAcitve = true;
        this.mouseTool.close(true);
        this.map.setDefaultCursor('crosshair');
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
      this.map.setDefaultCursor('');
      if (!notClearPolygon && this.selAreaPolygon) {
        this.map.remove(this.selAreaPolygon);
        this.selAreaPolygon = null;
        this.selAreaAble = false;
      }
    },
    // 测距
    ranging () {
      if (this.rangingAcitve) {
        this.rangingRest();
        return false;
      }
      this.rangingRest();
      this.rangingAcitve = true;
      // 自定义样式
      let startMarkerOptions= {
        content: '<div class="vl_map_ranging vl_map_ranging_s"><div></div></div>',
        offset: new window.AMap.Pixel(-12, -12)
      };
      let endMarkerOptions = {
        content: '<div class="vl_map_ranging vl_map_ranging_e"><div>终</div></div>',
        offset: new window.AMap.Pixel(-17, -17)
      };
      let midMarkerOptions = {
        content: '<div class="vl_map_ranging vl_map_ranging_m"><div></div></div>',
        offset: new window.AMap.Pixel(-12, -12)
      };
      let lineOptions = {
          strokeStyle: "solid",
          strokeColor: "#61C772",
          strokeOpacity: 1,
          strokeWeight: 8
      };
      let rulerOptions = {
        startMarkerOptions: startMarkerOptions,
        midMarkerOptions:midMarkerOptions,
        endMarkerOptions: endMarkerOptions,
        lineOptions: lineOptions
      };
      let ruler2 = new window.AMap.RangingTool(this.map, rulerOptions);
      ruler2.turnOn();
      this.rangingObj = ruler2;
    },
    // 重置测距
    rangingRest () {
      this.rangingAcitve = false;
      if (this.rangingObj) {
        this.rangingObj.turnOff();
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.pic_format{
  line-height: 20px;
  margin-top: 10px;
  & > div{
    white-space: nowrap;
  }
  & > div:nth-child(1){
    color: #0C70F8;
    cursor: pointer;
  }
}
.add_point{
  background:rgba(255,255,255,1);
  border-radius:4px;
  text-align: center;
  border:1px dashed rgba(217,217,217,1);
  color: #0C70F8;
  cursor: pointer;
}
.licenseNum{
  margin-bottom: 0!important;
}
</style>
<style lang="scss">
.point .el-form-item__content{
  display: flex;
  i{
    margin-top: 12px;
    margin-left: 10px;
    color: #F94539;
    cursor: pointer;
  }
}
</style>
