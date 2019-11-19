<template>
  <div class="add_camera">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ name: 'camera_manage' }">摄像头管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{$route.query.id ? '编辑摄像头' : '新增摄像头'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_box">
      <p class="tab_p">{{isSelectTab === 1 ? '基本信息' : '联网信息'}}</p>
      <div class="basic_info" v-show="isSelectTab === 1">
        <vue-scroll>
          <el-form :model="cameraForm" :rules="rules" ref="cameraForm" label-width="100px" class="camera_form">
            <el-form-item label="摄像头编码:" v-show="deivceCodeId" style="margin-bottom:10px">
              <span>{{deivceCodeId}}</span>
            </el-form-item>
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
                  v-for="item in organList"
                  :key="item.uid"
                  :label="item.organName"
                  :value="item.uid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="摄像头编号:" prop="deviceSeq">
              <el-input v-model="cameraForm.deviceSeq" placeholder="请输入摄像头编号"></el-input>
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
            <el-form-item label="摄像头序列号:" prop="deviceSn">
              <el-input v-model="cameraForm.deviceSn" placeholder="请输入摄像头序列号"></el-input>
            </el-form-item>
            <el-form-item label="摄像头类型:" prop="type">
              <el-select v-model="cameraForm.type" placeholder="请选择摄像头类型" style="width: 100%">
                <el-option
                  v-for="item in cameraTypeList"
                  :key="item.enumField"
                  :label="item.enumValue"
                  :value="item.enumField">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="拍摄方向:" prop="filmDirection">
              <el-select v-model="cameraForm.filmDirection" placeholder="请选择拍摄方向" style="width: 100%">
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
            <el-form-item label="智能特性:" prop="intelligentCharaInfo">
              <el-select v-model="cameraForm.intelligentCharaInfo" placeholder="请选择智能特性" multiple style="width: 100%">
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
              <el-form-item label="IP:" prop="ip">
                <ul class="ip-adress">
                  <li v-for="(item,index) in onlineForm.ip" :key="index">
                    <el-input v-model="item.value" @change="checkIpVal(item)" @blur="setDefaultVal(item)" placeholder="255"></el-input>
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
                  <li class="map_li" @click="isShowMap = true">
                    <i class="vl_icon vl_icon_archives_4 address_icon"></i>
                    <span class="map_select">地图选择</span>
                  </li>
                </ul>
              </el-form-item>
              <el-form-item label="所在位置:" prop="address">
                <el-cascader v-model="onlineForm.locationName" :options="areaDataList" :props="areaProps" ref="cascaderAddr" style="width:100%" @change="handleChangeAddress" clearable placeholder="请选择省/市/县/乡"></el-cascader>
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
        <div class="right" v-show="isShowMap">
          <div id="mapContainer"></div>
          <i class="vl_icon vl_icon_event_23 close_btn" @click="closeMap"></i>
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
      <el-button class="operation_btn" type="primary" v-show="isSelectTab === 1" @click="nextStep('cameraForm')">下一步</el-button>
      <template v-if="$route.query.id"> <!-- 编辑 -->
        <el-button class="operation_btn" type="primary" v-show="isSelectTab === 1" :loading="isEditBaiscLoading" @click="submitBasicData('cameraForm')">确定</el-button>
      </template>
      <el-button class="operation_btn" type="primary" v-show="isSelectTab === 2" @click="preStep">上一步</el-button>
      <el-button class="operation_btn" type="primary" v-show="isSelectTab === 2" :loading="isAddLoading" @click="submitData('onlineForm')">确定</el-button>
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
import { addDeviceInfo, editDeviceInfo, getDeviceDetailById } from '@/views/index/api/api.base.js';
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import { mapXupuxian } from "@/config/config.js";
// import mapData from '@/config/mapdata.json';
import { getAreaList } from '@/views/index/api/api.user.js';
export default {
  components: { vlBreadcrumb },
  data () {
    return {
      isShowMap: false, // 是否显示右侧地图
      backDialog: false, // 取消弹出框
      loading: false,
      isSelectTab: 1, // 1---基础信息  2--联网信息
      isAddLoading: false, // 添加加载中
      isEditBaiscLoading: false, // 编辑基础信息加载中
      cameraForm: {
        uid: null, // 要修改的id
        dutyUserId: null, // 负责人
        dutyUnitId: null, // 所属机构
        maxPixel: null, // 最大像素
        manufacturer: null, // 厂商
        deviceName: null, // 摄像头名称
        type: null, // 摄像头类型
        deviceSeq: null, // 摄像头编号
        deviceSn: null, // 摄像头序列号
        filmDirection: null, // 拍摄方向
        intelligentCharaInfo: [], // 智能特性
        isActive: 1, // 是否启用
      },
      onlineForm: {
        deviceSip: null, // SIP编号
        deviceCode: null, // 视频接入编码
        viewClassCode: null, // 结构化编码
        ip: [{value: ''}, {value: ''}, {value: ''}, {value: ''}], // IP
        longitude: null, // 经度
        latitude: null, // 纬度
        importantLevel: null, // 重要级别
        account: null, // 账户名
        password: null, // 密码
        rtspPort: null, // RTSP端口
        locationName: [],
        areaId: null, // 区域id
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
        // isActive: [
        //   { required: true, message: '该项内容不可为空', trigger: 'blur' }
        // ]
      },
      onlineRules: {
        deviceSip: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
        deviceCode: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
        ip: [
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
        // location: [
        //   { required: true, message: '该项内容不可为空', trigger: 'blur' }
        // ],
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
      deivceCodeId: null, // 摄像头编码
      map: null, // 地图对象
      organList: [], // 机构单位
      // organList: [],
      // options: mapData,
      areaProps: {
        value: 'uid',
        label: 'cname',
        children: 'childList'
      },
      geolocation: null, // 地图定位对象
      t: 1,
      locationName: null, //省市区
      intelligentCharacList: [], // 智能特性
      cameraTypeList: [], // 摄像头类型
      importLevelList: [], // 级别
      manufacturerList: [], // 厂家
      maxPixelList: [], // 最大像素
      areaDataList: [] // 省市区县数据列表
    }
  },
  created () {
    this.userInfo = this.$store.state.loginUser;
    this.getAreaDataList();
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
    // 获取省市区县信息
    getAreaDataList () {
      const pid = 1;
      getAreaList(pid)
        .then(res => {
          if (res && res.data) {
            const data = this.handleAreaData(res.data.childList);
            this.areaDataList = data;

            if (this.$route.query.id) {
              this.cameraForm.uid = this.$route.query.id;
              this.getDetail();
            }
          }
        })
    },
    // 处理省市区县数据
    handleAreaData (data) {
      let _this =this;
      data.forEach((val) => {
        if (val.childList.length === 0) { // 当childList为[]时,删除childList
          _this.$delete(val, 'childList');
        } else {
          _this.handleAreaData(val.childList);
        }
      })
      return data;
    },
    // 获取摄像头详情
    getDetail () {
      const id = this.$route.query.id;
      if (id) {
        getDeviceDetailById({id})
          .then(res => {
            if (res && res.data) {
              let obj = res.data;

              this.deivceCodeId = obj.code;

              this.cameraForm.dutyUnitId = obj.dutyUnitId;
              this.cameraForm.dutyUserId = obj.dutyUserId;
              this.cameraForm.deviceName = obj.deviceName;
              this.cameraForm.deviceSeq = obj.deviceSeq;
              this.cameraForm.deviceSn = obj.deviceSn;
              this.cameraForm.filmDirection = obj.filmDirection;
              this.cameraForm.isActive = obj.isActive;
              this.cameraForm.maxPixel = obj.maxPixel && obj.maxPixel.toString();
              this.cameraForm.manufacturer = obj.manufacturer && obj.manufacturer.toString();
              this.cameraForm.type = obj.type && obj.type.toString();

              this.onlineForm.deviceSip = obj.deviceSip;
              this.onlineForm.deviceCode = obj.deviceCode;
              this.onlineForm.viewClassCode = obj.viewClassCode;
              this.onlineForm.longitude = obj.longitude;
              this.onlineForm.latitude = obj.latitude;
              this.onlineForm.importantLevel = obj.importantLevel && obj.importantLevel.toString();
              this.onlineForm.account = obj.account;
              this.onlineForm.password = obj.password;
              this.onlineForm.rtspPort = obj.rtspPort;
              // this.onlineForm.address = obj.address;
              this.onlineForm.deviceSip = obj.deviceSip;
              this.onlineForm.areaId = obj.areaId;


              const addr = this.getCascaderObj3(obj.areaId, this.areaDataList);
              this.resAddress = addr && addr.map(m => m.cname).join('');
              this.onlineForm.locationName = addr && addr.map(m => m.uid);
              this.onlineForm.address = addr && obj.address.replace(addr.map(m => m.cname).join(''), '');

              if (obj.intelligentCharac) {
                let arr = obj.intelligentCharac.split(',');
                arr.map(val => {
                  this.intelligentCharacList.map(item => {
                    if (val === item.enumValue) {
                      this.cameraForm.intelligentCharaInfo.push(item.enumField);
                    }
                  })
                })
              }
              if (obj.ipAddress) {
                let ipAddress = obj.ipAddress.split('.');
                ipAddress.map((item, index) => {
                  this.onlineForm.ip[index].value = item;
                })
              }
              
              if (this.$route.query.id) {
                this.markLocation(obj.address);
              }
            }
          })
      }
    },
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
    // 编辑基础信息
    submitBasicData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.organList.map(item => {
            if (item.uid === this.cameraForm.dutyUnitId) {
              this.cameraForm.dutyUserId = item.chargeUserName;
            }
          })
          let intelligentCharac = this.cameraForm.intelligentCharaInfo.join(',');
          const params = {
            ...this.cameraForm,
            intelligentCharac
          };
          this.isEditBaiscLoading = true;
          editDeviceInfo(params)
            .then(res => {
              if (res && res.code === '00000000') {
                this.$message({
                  type: 'success',
                  message: '修改成功',
                  customClass: 'request_tip'
                });
                this.$router.push({name: 'camera_manage'});
                this.isEditBaiscLoading = false;
              } else {
                this.isEditBaiscLoading = false;
              }
            })
            .catch(() => {this.isEditBaiscLoading = false;})
        }
      })
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
          this.organList = this.organList.filter(item => {
          return item.organName.toLowerCase()
            .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.organList = [];
      }
    },
    //input---ipaddress
    checkIpVal(item) {
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
    handleChangeAddress () {
      this.onlineForm.address = null;
      const arr = this.getCascaderObj(this.onlineForm.locationName, this.areaDataList);
      let str = arr.map(m => m.cname).join('');
      this.resAddress = str;
      if (this.onlineForm.address) str = str + this.onlineForm.address;
      this.markLocation(str);
    },
    // 获得选中的级联对象列表
    getCascaderObj(val, opt) {
      return val.map(value => {
        for (var itm of opt) {
          if (itm.uid == value) { opt = itm.childList; return itm; }
        }
        return null;
      });
    },
    //详细地址查询
    markAddress(val) {
      if(val) {
        this.markLocation(this.resAddress + val);
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
          }
        });
      });
    },
    addMarker (lnglatXY) {
      let hoverWindow = null;
      let _this = this;
      _this.removeAllOverlay();
      let content = '<i class="vl_icon vl_icon_control_30"></i>';
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
        _this.map.setZoom(14);
        marker.setMap(_this.map);
        _this.map.setFitView();// 执行定位
      }
      // hover
      marker.on("mouseover", function() {
        let sContent = '<div class="vl_map_hover" >' +
            '<div class="vl_main_hover_address" style="min-width: 100px;padding: 15px 10px">'+
            '<p class="vl_map_hover_main_p">经度： ' + lnglatXY[0] + '</p>'+
            '<p class="vl_map_hover_main_p">纬度： ' + lnglatXY[1] + '</p></div></div>';
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
        this.map.setZoomAndCenter(14, mapXupuxian.center);
        this.map.setFitView();
      }
    },
    // 关闭地图
    closeMap () {
      this.isShowMap = false;
      // this.map.clearMap();
    },
    // 初始化地图
    initMap () {
      let _this = this;
      let map = new window.AMap.Map("mapContainer", {
        zoom: 14, // 级别
        resizeEnable: true,
        center: mapXupuxian.center, // 中心点坐标[110.596015, 27.907662]
        // viewMode: '3D' // 使用3D视图
      });
      map.plugin("AMap.Geolocation", function() {
        let geolocation = new window.AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：无穷大
            maximumAge: 0, //定位结果缓存0毫秒，默认：0
            convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true, //显示定位按钮，默认：true
            buttonDom: '<input hidden="true" >',
            buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new window.AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        map.addControl(geolocation);
        // geolocation.getCurrentPosition();
        _this.geolocation = geolocation;
        window.AMap.event.addListener(geolocation, "error", onError); //返回定位出错信息
        function onError(data) {
          this.$message.error(data.message);
        }
      });

      let geocoder;
      window.AMap.service('AMap.Geocoder',function(){ //回调函数
        //实例化Geocoder   
        geocoder = new window.AMap.Geocoder({
          city: "全国", //城市，默认：“全国”
          radius: 500 //范围，默认：500
        })
        //TODO: 使用geocoder 对象完成相关功能
      })
      _this.geocoderInfo = geocoder;

      map.setMapStyle("amap://styles/whitesmoke");
      _this.map = map;

      // 在地图中添加MouseTool插件
      let mouseTool = new window.AMap.MouseTool(map);
      _this.mouseTool = mouseTool;


      //为地图注册click事件获取鼠标点击出的经纬度坐标
      _this.map.on('click', function(e) {
          _this.onlineForm.longitude = e.lnglat.getLng();
          _this.onlineForm.latitude = e.lnglat.getLat();

          // _this.$set(_this.InternetForm.lngLat,'lng',e.lnglat.getLng());
          // _this.$set(_this.InternetForm.lngLat,'lat',e.lnglat.getLat());
          // 填写地址
          _this.writeAddress([e.lnglat.getLng(),e.lnglat.getLat()]);

          _this.mapsearch(e.lnglat.getLng(),e.lnglat.getLat());
      });

      let auto = new window.AMap.Autocomplete(map);
      window.AMap.event.addListener(auto, "select", _this.select);//注册监听，当选中某条记录时会触发
    },
    select (e) {
      if (e.poi && e.poi.location) {
        /* map.setZoom(15); */
        this.map.setCenter(e.poi.location);
      }
    },
    //地图搜索
    mapsearch (lng,lat) {
      this.myMapViewLocation(lng, lat);
    },
    // 回显
    myMapViewLocation (mlon, mlat) {
      if(mlon && mlat){
        this.removeMarkers(lnglatXY);
        let lnglatXY = [mlon,mlat];
        this.addMarker(lnglatXY);
      }
    },
    removeAllOverlay () {
      // 清除地图上所有添加的覆盖物
      this.map.clearMap();
    },
    //移除之前的标点
    removeMarkers(lnglatXY) {
      let marker = new window.AMap.Marker({
        map: this.map,
        position: lnglatXY,
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        offset: new window.AMap.Pixel(-13, -30)
        });
        let markers = [];
        markers.push(marker);
        this.map.remove(markers);
    },
    // 填写地址
    writeAddress(lnglatXY){
      let _this = this;
      let geocoder = new window.AMap.Geocoder({
        city : "全国", //城市，默认：“全国”
      });
    geocoder.getAddress(lnglatXY, function(status, result) {
      if (status === 'complete' && result.info === 'OK') {
          _this.geocoder_CallBack(result);
        } else {
          //获取地址失败
          _this.$message.error('没有获取到地址');
        }
      });
    },
    // 地址回调
    geocoder_CallBack(data) {
      const {province, city, district, township} = data.regeocode.addressComponent;
      const adcode = data.regeocode.addressComponent.adcode;
      const arr = [province, city, district];

      const obj = this.getCascaderObj2(adcode, this.areaDataList);
      if (!obj) return this.$message.warning('所选地址在卡口地址下拉列表中无可匹配项'); 
      if (obj.hasOwnProperty('childList')) { // 若obj还有子级，则将township添加进去
        arr.push(township);
      }
      this.resAddress = arr.join('');
      const codeList = this.getCascaderObj3(adcode, this.areaDataList, township); // 根据省市区县回填省市区级联
      this.onlineForm.locationName = codeList && codeList.map(m => m.uid);
      let address = data.regeocode.formattedAddress.replace(arr.join(''),''); //返回地址描述
      this.onlineForm.address = address;
    },
    // 根据adcode找寻它所属对象
    getCascaderObj2 (val, list) {
      let result = null;
      let fun = (val, list) => {
        list.forEach(a => {
          if (a.uid == val) {
            result = a;
            // foreach.break = new Error("找到了就跳出循环");  
          } else {
            if (a.hasOwnProperty('childList')) {
              fun(val, a.childList);
            }
          }
        })
      }
      fun(val, list);
      return result;
    },
    // 回填级联时，根据详情返回的areaId，找到其所有的上级和下级
    getCascaderObj3 (val, list, township) {
      const obj = this.getCascaderObj2(val, list);
      if (!obj) return null;
      let res = [obj];
      if (obj.hasOwnProperty('childList') && township) {
        const _obj = obj.childList.find(c => c.cname === township);
        res.unshift(_obj);
      }
      let func = (val, opt) => {
        opt.forEach(f => {
          if (f.uid == val) { 
            res.push(f);
            if (f.parentUid !== '1') {
              func(f.parentUid, list);
            }
          } else {
            if (f.hasOwnProperty('childList')) {
              func(val, f.childList);
            }
          }
        })
      }
      func(obj.parentUid, list);
      return res.reverse();
    },
    // 提交数据
    submitData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let ipAddress = [];

          this.organList.map(item => {
            if (item.uid === this.cameraForm.dutyUnitId) {
              this.cameraForm.dutyUserId = item.chargeUserName;
            }
          })

          this.onlineForm.ip.map(item => {
            if (!item.value) {
              return;
            } else {
              ipAddress.push(item.value);
            }
          })
          let location = this.onlineForm.locationName && this.onlineForm.locationName.join(',');
          let intelligentCharac = this.cameraForm.intelligentCharaInfo.join(',');
          this.onlineForm.rtspPort = this.onlineForm.rtspPort && parseInt(this.onlineForm.rtspPort);

          if (!this.$route.query.id) {
            this.$delete(this.cameraForm, 'uid');
          }
          this.onlineForm.areaId = this.onlineForm.locationName[this.onlineForm.locationName.length - 1];
           this.onlineForm.address = this.resAddress + this.onlineForm.address;
          const params = {
            ...this.cameraForm,
            ...this.onlineForm,
            ipAddress: ipAddress.join('.'),
            intelligentCharac,
            location
          };
          this.isAddLoading = true;
          if (this.$route.query.id) {
            editDeviceInfo(params)
              .then(res => {
                if (res && res.code === '00000000') {
                  this.$message({
                    type: 'success',
                    message: '修改成功',
                    customClass: 'request_tip'
                  });
                  this.$router.push({name: 'camera_manage'});
                  this.isAddLoading = false;
                } else {
                  this.isAddLoading = false;
                }
              })
              .catch(() => {this.isAddLoading = false;})
          } else {
            addDeviceInfo(params)
              .then(res => {
                if (res && res.data) {
                  this.$message({
                    type: 'success',
                    message: '添加成功',
                    customClass: 'request_tip'
                  });
                  this.isAddLoading = false;
                  this.$router.push({name: 'camera_manage'});
                } else {
                  this.isAddLoading = false;
                }
              })
              .catch(() => {this.isAddLoading = false;})
          }
        }
      })
    },
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
    border-radius: 4px;
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    margin: 0 20px;
    .tab_p {
      width: 100%;
      border-bottom: 1px solid #F2F2F2;
      height: 55px;
      line-height: 55px;
      color: #333333;
      font-size: 16px;
      font-weight: bold;
      padding: 0 15px;
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
        width: 600px;
        height: 100%;
        padding-right: 10px;
        .online_form {
          width: 90%;
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
        width: calc(100% - 600px);
        height: 100%;
        position: relative;
        .close_btn {
          right: 20px;
          top: 20px;
          position: absolute;
          z-index: 10000;
          cursor: pointer;
        }
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
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
      .lng-tip, .lat-tip {
        margin-left: 8px;
        color: #D3D3D3;
      }
    }
    .map_li {
      cursor: pointer;
      .map_select {
        margin-left: 3px;
        color: #0C70F8;
      }
    }
    .el-input {
      display: inline-block;
      width: 110px;
    }
  }
}
</style>


