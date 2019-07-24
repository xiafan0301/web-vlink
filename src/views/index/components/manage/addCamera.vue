<template>
  <div class="add_camera">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ name: 'camera_manage' }">摄像头管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{this.$route.query.cameraId ? '编辑摄像头' : '新增摄像头'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_box">
      <ul class="tab_ul">
        <li :class="[isSelectTab === 1 ? 'is_active' : '']">基本信息</li>
        <li :class="[isSelectTab === 2 ? 'is_active' : '']">联网信息</li>
      </ul>
      <div class="basic_info" v-show="isSelectTab === 1">
        <vue-scroll>
          <el-form :model="cameraForm" :rules="rules" ref="cameraForm" label-width="100px" class="camera_form">
            <el-form-item label="所属机构:" prop="dutyUnitId">
              <el-select
                style="width: 100%"
                v-model="cameraForm.dutyUnitId"
                filterable
                remote
                reserve-keyword
                placeholder="请搜索选择所属机构单位"
                :remote-method="remoteMethod"
                :loading="loading">
                <el-option
                  v-for="item in departmentList"
                  :key="item.uid"
                  :label="item.organName"
                  :value="item.uid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="摄像头编号:" prop="code">
              <el-input v-model="cameraForm.code" placeholder="请输入摄像头编号"></el-input>
            </el-form-item>
            <el-form-item label="摄像头名称:" prop="deviceName">
              <el-input v-model="cameraForm.deviceName" placeholder="请输入摄像头名称" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="厂家:" prop="manufacturer">
              <el-select v-model="cameraForm.manufacturer" placeholder="请选择厂商" style="width: 100%" >
                <el-option
                  v-for="item in manufacturerList"
                  :key="item.enumField"
                  :label="item.enumValue"
                  :value="item.enumField">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="摄像头序列号" prop="serialNumber">
              <el-input v-model="cameraForm.serialNumber" placeholder="请输入摄像头序列号"></el-input>
            </el-form-item>
            <el-form-item label="摄像头类型::" prop="type">
              <el-select v-model="cameraForm.type" placeholder="请选择摄像头类型" style="width: 100%">
                <el-option
                  v-for="item in cameraTypeList"
                  :key="item.enumField"
                  :label="item.enumValue"
                  :value="item.enumField">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="拍摄方向:" prop="direction">
              <el-select v-model="cameraForm.direction" placeholder="请选择拍摄方向" style="width: 100%">
                <el-option
                  v-for="item in directionList"
                  :key="item.id"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="最大像素:" prop="maxPixel">
              <el-select v-model="cameraForm.maxPixel" placeholder="请选择最大像素" style="width: 100%">
                <el-option
                  v-for="item in maxPixelList"
                  :key="item.enumField"
                  :label="item.enumValue"
                  :value="item.enumField">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="智能特性:" prop="intelligentCharac">
              <el-select v-model="cameraForm.intelligentCharac" placeholder="请选择智能特性" multiple style="width: 100%">
                <el-option
                  v-for="item in intelligentCharacList"
                  :key="item.enumField"
                  :label="item.enumValue"
                  :value="item.enumField">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否启用:" prop="isActive">
              <el-radio-group v-model="cameraForm.isActive">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="2">调试</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </vue-scroll>
      </div>
      <div class="online_info" v-show="isSelectTab === 2">
        <div class="left">
          <vue-scroll>
            <el-form :model="onlineForm" :rules="onlineRules" ref="onlineForm" label-width="130px" class="online_form">
              <el-form-item label="SIP编号:" prop="deviceSip">
                <el-input v-model="onlineForm.deviceSip" placeholder="请输入SIP编号"></el-input>
              </el-form-item>
              <el-form-item label="视频接入编码:" prop="deviceCode">
                <el-input v-model="onlineForm.deviceCode" placeholder="请输入视频接入编码"></el-input>
              </el-form-item>
              <el-form-item label="结构化设备编码:" prop="viewClassCode">
                <el-input v-model="onlineForm.viewClassCode" placeholder="请输入结构化设备编码" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="IP:" prop="ipAddress">
                <ul class="ip-adress">
                  <li v-for="(item,index) in onlineForm.ipAddress" :key="index">
                    <el-input v-model="item.value" @change="checkIpVal(item,index)" @blur="setDefaultVal(item)" placeholder="255"></el-input>
                    <div class="dot"></div>
                  </li>
                </ul>
              </el-form-item>
              <el-form-item label="重要级别:" prop="importantLevel">
                <el-select v-model="onlineForm.importantLevel" placeholder="请选择重要级别" style="width: 100%">
                  <el-option
                    v-for="item in importLevelList"
                    :key="item.enumField"
                    :label="item.enumValue"
                    :value="item.enumField">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="经纬度:" prop="longitude">
                <ul class="lng-lat">
                  <li>
                    <el-input v-model="onlineForm.longitude" placeholder="请输入经度"></el-input>
                    <span class="lng-tip">(经度)</span>
                  </li>
                  <li>
                    <el-input v-model="onlineForm.latitude" placeholder="请输入纬度"></el-input>
                    <span class="lat-tip">(纬度)</span>
                  </li>
                </ul>
              </el-form-item>
              <el-form-item label="所在位置:" prop="location">
                <el-cascader v-model="onlineForm.location" :options="options" ref="cascaderAddr" style="width:100%" @change="handleChangeAddress" clearable placeholder="请选择省/市/县/乡"></el-cascader>
              </el-form-item>
              <el-form-item label="" prop="address">
                <el-input v-model="onlineForm.address" placeholder="请输入详细地址" @blur="markAddress(onlineForm.address)"></el-input>
              </el-form-item>
              <el-form-item label="账户名:" prop="account">
                <el-input v-model="onlineForm.account" placeholder="请输入账户名"></el-input>
              </el-form-item>
              <el-form-item label="密码:" prop="password">
                <el-input v-model="onlineForm.password" placeholder="请输入密码"></el-input>
              </el-form-item>
              <el-form-item label="RTSP端口:" prop="rtspPort">
                <el-input v-model="onlineForm.rtspPort" placeholder="请输入RTSP端口"></el-input>
              </el-form-item>
            </el-form>
          </vue-scroll>
        </div>
        <div class="right">
          <div id="mapContainer"></div>
          <!--地图操作按钮-->
          <ul class="map_rrt_u2">
            <li @click="resetZoom"><i class="el-icon-aim"></i></li>
            <li @click="mapZoomSet(1)"><i class="el-icon-plus"></i></li>
            <li @click="mapZoomSet(-1)"><i class="el-icon-minus"></i></li>
          </ul>
        </div>

      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn" type="primary" v-show="isSelectTab === 2" @click="preStep">上一步</el-button>
      <el-button class="operation_btn" type="primary" v-show="isSelectTab === 1" @click="nextStep('cameraForm')">下一步</el-button>
      <el-button class="operation_btn" type="primary" v-show="isSelectTab === 2" :loading="isLoading" @click="submitData">确定</el-button>
      <el-button class="operation_btn" @click="cancelSubmit">取消</el-button>
    </div>
    <!--返回提示弹出框-->
    <el-dialog
      title="提示"
      :visible.sync="backDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">取消后内容不会保存，您确定要取消吗?</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="backDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="sureBack">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDepartmentList} from '@/views/index/api/api.manage.js';
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import { mapXupuxian } from "@/config/config.js";
import mapData from '@/config/mapdata.json';
export default {
  components: { vlBreadcrumb },
  data () {
    return {
      backDialog: false, // 取消弹出框
      loading: false,
      isSelectTab: 1, // 1---基础信息  2--联网信息
      isLoading: false,
      cameraForm: {
        dutyUnitId: null, // 所属机构
        maxPixel: null, // 最大像素
        manufacturer: null, // 厂商
        deviceName: null, // 摄像头名称
        type: null, // 摄像头类型
        deviceSeq: null, // 摄像头编号
        deviceSn: null, // 摄像头序列号
        filmDirection: null, // 拍摄方向
        intelligentCharac: [], // 智能特性
        isActive: 1, // 是否启用
      },
      onlineForm: {
        deviceSip: null, // SIP编号
        deviceCode: null, // 视频接入编码
        viewClassCode: null, // 结构化编码
        ipAddress: [{value: ''}, {value: ''}, {value: ''}, {value: ''}], // IP
        longitude: null, // 经度
        latitude: null, // 纬度
        importantLevel: null, // 重要级别
        account: null, // 账户名
        password: null, // 密码
        rtspPort: null, // RTSP端口
        location: null,
        address: null, // 所在位置
      },
      rules: {
        dutyUnitId: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
        manufacturer: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
        maxPixel: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
        isActive: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ]
      },
      onlineRules: {
        deviceSip: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
        deviceCode: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
        ipAddress: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
        importantLevel: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
        longitude: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
        latitude: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
      },
      directionList: [
        {
          id: 1,
          value: '朝东'
        },
        {
          id: 2,
          value: '朝西'
        },
        {
          id: 3,
          value: '朝南'
        },
        {
          id: 4,
          value: '朝北'
        },
        {
          id: 5,
          value: '朝东北'
        },
        {
          id: 6,
          value: '朝东南'
        },
        {
          id: 7,
          value: '朝西北'
        },
        {
          id: 8,
          value: '朝西南'
        }
      ],
      map: null, // 地图对象
      departmentList: [], // 机构单位
      organList: [],
      options: mapData,
      geolocation: null, // 地图定位对象
      t: 1,
      locationName: null, //省市区
      intelligentCharacList: [], // 智能特性
      cameraTypeList: [], // 摄像头类型
      importLevelList: [], // 级别
      manufacturerList: [], // 厂家
      maxPixelList: [], // 最大像素
    }
  },
  created () {
    this.userInfo = this.$store.state.loginUser;
    this.getDepartList();
    this.getIntelligentCharacList();
    this.getCameraTypeList();
    this.getImportLevelList();
    this.getManufacturerList();
    this.getMaxPixelList();
  },
  mounted () {
    this.initMap();
    this.dataCameraStr = JSON.stringify(this.cameraForm); // 将初始数据转成字符串
    this.dataOnlineStr = JSON.stringify(this.onlineForm); // 将初始数据转成字符串
  },
  methods: {
    // cancelSubmit
    cancelSubmit () {
      const cameraData = JSON.stringify(this.cameraForm);
      const onlineData = JSON.stringify(this.onlineForm);
      if (this.dataCameraStr === cameraData && this.dataOnlineStr === onlineData) {
        this.$router.back(-1);  
      } else {
        this.backDialog = true;
      }
    },
    // 确认取消
    sureBack () {
      this.backDialog = false;
      this.$router.back(-1);
    },
    // 获取所有的智能特性
    getMaxPixelList () {
      const obj = dataList.maxPixel;
      getDiciData(obj)
        .then(res => {
          if (res) {
            this.maxPixelList = res.data;
          }
        })
    },
    // 获取所有的智能特性
    getIntelligentCharacList () {
      const obj = dataList.intelCharac;
      getDiciData(obj)
        .then(res => {
          if (res) {
            this.intelligentCharacList = res.data;
          }
        })
    },
    // 获取所有的摄像头类型
    getCameraTypeList () {
      const obj = dataList.cameraType;
      getDiciData(obj)
        .then(res => {
          if (res) {
            this.cameraTypeList = res.data;
          }
        })
    },
    // 获取所有的重要级别
    getImportLevelList () {
      const obj = dataList.importantLevel;
      getDiciData(obj)
        .then(res => {
          if (res) {
            this.importLevelList = res.data;
          }
        })
    },
    // 获取所有的厂家
    getManufacturerList () {
      const obj = dataList.manufacturer;
      getDiciData(obj)
        .then(res => {
          if (res) {
            this.manufacturerList = res.data;
          }
        })
    },
    // 获取所有的机构单位
    getDepartList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0,
      };
      getDepartmentList(params)
        .then(res => {
          if (res && res.data.list) {
            this.organList = res.data.list;
          }
        })
    },
    //机构数据获取
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.departmentList = this.organList.filter(item => {
          return item.organName.toLowerCase()
            .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.departmentList = [];
      }
    },
    //input---ipaddress
    checkIpVal(item, index) {
      console.log("===========",item,index)
      // let self = this;
      //确保每个值都处于0-255
      let val = item.value;
      //当输入的是空格时，值赋为空
      val = val.trim();
      val = parseInt(val, 10);
      if(isNaN(val)) {
        val = '';
      } else {
        val = val < 0 ? 0 : val;
        val = val > 255 ? 255 : val;
      }
      item.value = val;
    },
    setDefaultVal(item) {
      //当input失去焦点，而ip没有赋值时，会自动赋值为0
      // let self = this;
      let val = item.value;
      if(val == '') {
        item.value = '0';
      }
    },
    // 所在位置change
    handleChangeAddress (value) {
      this.$set(this.onlineForm,'address','');
      let labels = this.$refs['cascaderAddr'].currentLabels;
      console.log(labels,value)
      if(labels && labels.length > 0) {
        this.locationName = labels.join('');
        this.markLocation(this.locationName);
      } 
    },
    //详细地址查询
    markAddress(val) {
      if(val) {
        this.markLocation(this.locationName + val)
      }
    },
    //根据地址搜索
    markLocation(address) {
      let _this = this;
      _this.map.plugin('AMap.Geocoder', function() {
        let geocoder = new window.AMap.Geocoder();            
        geocoder.getLocation(address, function(status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // 经纬度                      
            let lon = result.geocodes[0].location.lng;
            let lat = result.geocodes[0].location.lat;
             
            _this.onlineForm.longitude = lon;
            _this.onlineForm.latitude = lat;
                      
             let lnglatXY = [lon, lat];
             _this.addMarker(lnglatXY);
            } else {
              console.log('定位失败！');
            }
        });
      });
    },
    addMarker (lnglatXY) {
      let hoverWindow = null;
      let _this = this;
      _this.removeAllOverlay();
      let content = '<i class="vl_icon vl_icon_gis_default"></i>';
      let marker = new window.AMap.Marker({
        // 添加自定义点标记
        map: _this.map,
        position: lnglatXY,
        offset: new window.AMap.Pixel(-23, -56),
        // 设置是否可以拖拽
        draggable: false,
        // 自定义点标记覆盖物内容
        content: content,
      });
      if(_this.t == 1) {
        console.log(lnglatXY);
        _this.map.add(marker);
        marker.setMap(_this.map);
        _this.map.setFitView();// 执行定位
        _this.t++;
      }
      
      //修改标点位置
      if(_this.t != 1){
        _this.map.add(marker);
        marker.setPosition(lnglatXY);
        _this.map.setCenter(lnglatXY);
        _this.map.setZoom(18);
        marker.setMap(_this.map);
        _this.map.setFitView();// 执行定位
      }  
      // hover
      marker.on("mouseover", function() {
        let sContent =
          '<div class="vl_map_hover vl_map_device">' +
          '<div class="vl_map_hover_main">' +
          _this.mapHoverInfo(lnglatXY[0],lnglatXY[1]) +
          "</div>";
        hoverWindow = new window.AMap.InfoWindow({
          isCustom: true,
          closeWhenClickMap: true,
          offset: new window.AMap.Pixel(54, 0), // 相对于基点的偏移位置
          content: sContent
        });
        // aCenter = mEvent.target.F.position
        hoverWindow.open(
          _this.map,
          new window.AMap.LngLat(lnglatXY[0],lnglatXY[1])
        );
        hoverWindow.on("close", function() {
          console.log("infoWindow close");
        });
      });
      marker.on("mouseout", function() {
        if (hoverWindow) {
          hoverWindow.close();
        }
      }); 
    },
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    resetZoom () {
      if (this.map) {
        this.map.setZoomAndCenter(18, mapXupuxian.center);
        this.map.setFitView();
      }
    },
    // 初始化地图
    initMap () {
      let _this = this;
      // _this.isShowMap = true;
      let map = new window.AMap.Map('mapContainer', {
        zoom: 16, // 级别
        center: mapXupuxian.center, // 中心点坐标[110.596015, 27.907662]
      });
      map.setMapStyle('amap://styles/whitesmoke');

      // this.autoInput = new window.AMap.Autocomplete({
      //   input: 'inputAddress'
      // });

      // map.on('click', function(e) {
      //   _this.addEventForm.longitude = e.lnglat.getLng();
      //   _this.addEventForm.latitude = e.lnglat.getLat();
        
      //   new window.AMap.service('AMap.Geocoder', function () { // 回调函数
      //     let geocoder = null;
      //     geocoder = new window.AMap.Geocoder({});

      //     const lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];//地图上所标点的坐标

      //     geocoder.getAddress(lnglatXY, function (status, result) {
      //       if (status === 'complete' && result.info === 'OK') {
      //         _this.addEventForm.areaCode = result.regeocode.addressComponent.adcode;
      //         _this.addEventForm.eventAddress = result.regeocode.formattedAddress;
      //         _this.mapMark(e.lnglat.getLng(), e.lnglat.getLat(), _this.addEventForm.eventAddress);
      //       }
      //     });
      //   });
      // });
      _this.map = map;

      // _this.mapMark(_this.addEventForm.longitude, _this.addEventForm.latitude, _this.addEventForm.eventAddress);
    },
    submitData () {},
    // 下一步
    nextStep (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.isSelectTab = 2;
        }
      })
    },
    // 上一步
    preStep () {
      this.isSelectTab = 1;
    }
  }
}
</script>

<style lang="scss" scoped>
.add_camera {
  height: 100%;
  .content_box {
    width: 98%;
    height: calc(100% - 80px - 65px);
    background-color: #ffffff;
    margin: 0 20px;
    .tab_ul {
      width: 100%;
      border-bottom: 1px solid #F2F2F2;
      display: flex;
      height: 55px;
      line-height: 55px;
      >li {
        margin: 0 15px;
        color: #333333;
        font-size: 16px;
        cursor: pointer;
      }
      .is_active {
        color: #0C70F8;
        border-bottom: 2px solid #0C70F8;
      }
    }
    .basic_info {
      height: calc(100% - 55px);
      padding: 15px 15px 0 15px;
      .camera_form {
        width: 50%;
      }
    }
    .online_info {
      height: calc(100% - 55px);
      padding: 15px;
      display: flex;
      flex-wrap: wrap;
      .left {
        width: 40%;
        height: 100%;
        padding-right: 10px;
        .online_form {
          width: 97%;
          //IP地址样式
          .ip-adress{
            display: flex;
            align-items: center;
            border: 1px solid #D3D3D3;
            width: 100%;
            height: 40px;
            border-radius: 4px;
            margin-right: 10px;
            &:hover, &:focus {
              border-color: #0C70F8;
            }
            li {
              position: relative;
              &:last-child .dot {
                display: none;
              }
              .el-input {
                width: 55px;
              }
              .dot{
                position: absolute;
                bottom: 15px;
                right: 0;
                border-radius: 50%;
                background: #D3D3D3;
                width: 2px;
                height: 2px;
              }
            }
          }
        }
      }
      .right {
        width: 60%;
        height: 100%;
        position: relative;
        .map_rrt_u2 {
          position: absolute; right: 30px;
          bottom: 20px;
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
        #mapContainer {
          height: 100%;
          width: 100%;
        }
      }
    }
  }
  .operation-footer {
    border-left: 1px solid #F2F2F2;
    width: 100%;
    height: 65px;
    line-height: 65px;
    position: fixed;
    bottom: 0;
    background: #ffffff;
    padding-left: 20px;
    z-index: 1;
    .operation_btn {
      padding: 0;
      width: 100px;
      height: 40px;
      text-align: center;
    }
  }
}
</style>
<style lang="scss">
.online_form {
  .ip-adress {
    .el-input__inner {
      border: none;
      height: 38px;
      text-align: center;
    }
  }
  //经纬度地址
  .lng-lat {
    display: flex;
    li {
      margin-right: 30px;
      &:last-child {
        margin-right: 0;
      }
      .lng-tip, .lat-tip {
        margin-left: 8px;
        color: #D3D3D3;
      }
    }
    .el-input {
      display: inline-block;
      width: 120px;
    }
  }
}
</style>


