<template>
<vue-scroll>
  <div class="edit_room">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manage/archivesManage/roomStall'}">档案管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/archivesManage/roomStall'}">一室一档</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="edit_box">
      <p class="title">编辑点室</p>
      <div class="content-body">
        <div class="content_left">
          <el-form :model="editRoom" :rules="rules" ref="editRoom" label-width="90px" class="add_room_form">
            <el-form-item label="点室编号:" prop="roomNumber" style="margin-bottom:10px;">
              <span style="color: #333333;">{{editRoom.roomNumber ? editRoom.roomNumber : '无'}}</span>
            </el-form-item>
            <el-form-item label="点室名称:" prop="roomName">
              <el-input style="width: 100%;" placeholder="请输入点室名称" v-model="editRoom.roomName" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="所属单位:" prop="organId">
              <el-select style="width: 100%;" v-model="editRoom.organId" placeholder="请选择所属单位" @change="handleDepartment">
                <el-option
                  v-for="(item, index) in departmentList"
                  :key="index"
                  :label="item.organName"
                  :value="item.uid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="责任人:" prop="dutyUserName">
              <el-input style="width: 100%;" placeholder="请输入责任人姓名" v-model="editRoom.dutyUserName" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="联系电话:" prop="userMobile">
              <el-input style="width: 100%;" placeholder="请输入联系电话" v-model="editRoom.userMobile"></el-input>
            </el-form-item>
            <el-form-item label="所属地址:" prop="address" class="address_select">
              <el-select style="width: 24%;margin-right: 1%" v-model="editRoom.province" placeholder="省" @change="handleProvinceData">
                <el-option
                  v-for="(item, index) in provinceList"
                  :key="'item' + index"
                  :label="item.cname"
                  :value="item.uid"
                >
                </el-option>
              </el-select>
              <el-select style="width: 24%;margin-right: 1%" v-model="editRoom.city" placeholder="市" @change="handleCityData">
                <el-option
                  v-for="(item, index) in cityList"
                  :key="'item' + index"
                  :label="item.cname"
                  :value="item.uid"
                >
                </el-option>
              </el-select>
              <el-select style="width: 24%;margin-right: 1%" v-model="editRoom.region" placeholder="县" @change="handleRegionData">
                <el-option
                  v-for="(item, index) in countyList"
                  :key="'item' + index"
                  :label="item.cname"
                  :value="item.uid"
                >
                </el-option>
              </el-select>
              <el-select style="width: 25%;" v-model="editRoom.street" placeholder="镇">
                <el-option
                    v-for="(item, index) in streetList"
                    :key="'item' + index"
                    :label="item.cname"
                    :value="item.uid"
                  >
                  </el-option>
              </el-select>
              <el-input 
                type="text" 
                style="width: 80%;margin-top:20px;"
                :class="[isShowAddressTip ? 'input_address' : '']"  
                id="inputAddress" 
                placeholder="请输入详细地址" 
                v-model="editRoom.address" 
                @blur="handleBlurAddress"
                @input="changeAddress">
              </el-input>
              <span class="address_tip" v-show="isShowAddressTip">请输入正确的地址</span>
              <div class="map_select" @click="initMap">
                <i class="vl_icon vl_icon_archives_4"></i>
                <span>地图选择</span>
              </div>
            </el-form-item>
            <el-form-item label="使用状况:" prop="isEnable">
              <el-radio-group style="width: 100%;" v-model="editRoom.isEnable">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="2">停用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="描述:" prop="desci">
              <el-input type="textarea" rows="5" style="width: 100%;" placeholder="请输入描述内容" v-model="editRoom.desci" maxlength="150"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="content_right">
          <div id="mapBox" v-show="isShowClose"></div>
          <i class="vl_icon vl_icon_event_23 close_btn" v-show="isShowClose" @click="closeMap"></i>
        </div>
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn function_btn" :loading="isEditLoading" @click="submitData('editRoom')">保存</el-button>
      <el-button class="operation_btn back_btn" @click="cancelSubmit('editRoom')">取消</el-button>
    </div>
  </div>
</vue-scroll>
</template>
<script>
import { validatePhone } from '@/utils/validator.js';
import { getDepartmentList } from '@/views/index/api/api.manage.js';
import { apiAreaList } from '@/views/index/api/api.base.js';
import { updateRoom, getRoomDetail } from '@/views/index/api/api.archives.js';
export default {
  data () {
    return {
      isShowAddressTip: false, // 是否显示地址错误提示
      isShowClose: false, // 是否显示关闭地图按钮
      isEditLoading: false, // 添加加载中
      editRoom: {
        uid: null,
        desci: null, // 描述
        dutyUserName: null, // 责任人
        isEnable: null, // 使用状况
        userMobile: null, // 联系电话
        organId: null, // 所属单位
        organName: null, // 所属单位名称
        roomNumber: null, // 点室编号
        roomName: null, // 点室名称
        province: null, // 省
        region: null, // 县
        city: null, // 市
        street: null, // 镇
        address: null, // 所属地址
        longitude: null, // 经度
        latitude: null, // 纬度
      },
      rules: {
       roomName: [
          { required: true, message: '该项内容不能为空', trigger: 'blur' },
          { max: 50, message: '最多输入50个字', trigger: 'blur' }
        ],
        dutyUserName: [
          { max: 50, message: '最多输入50个字', trigger: 'blur' }
        ],
        roomNumber: [
          { max: 50, message: '最多输入50个字', trigger: 'blur' }
        ],
        userMobile: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '该项内容不能为空', trigger: 'blur' }
        ],
        organId: [
          { required: true, message: '该项内容不能为空', trigger: 'blur' }
        ],
        desci: [
          { max: 150, message: '最多输入150个字', trigger: 'blur' }
        ]
      },
      userInfo: {}, // 用户信息
      departmentList: [], // 部门列表
      areaId: 1, // 行政区域id 1--省
      areaName: null, // 行政区域change
      provinceList: [], // 省数据
      cityList: [], // 市数据
      countyList: [], // 县数据
      streetList: [], // 镇数据
      map: null, // 地图对象
      autoInput: null, // 自动输入对象
    }
  },
  mounted () {
    this.userInfo = this.$store.state.loginUser;

    this.getDepartList();
    this.getAreaList();

    this.getDetail();
  },
  methods: {
    // 事件地址失焦
    handleBlurAddress () {
      let _this = this;
      if (!_this.editRoom.address) {
        this.isShowAddressTip = false;
      } else {
        let placeSearch = new window.AMap.PlaceSearch({
          // city 指定搜索所在城市，支持传入格式有：城市名、citycode和adcode
          // city: '010'
        });
        placeSearch.search(_this.editRoom.address, function (status, result) {
          // 查询成功时，result即对应匹配的POI信息
          if (status === 'complete' && result.info === 'OK') {
            _this.isShowAddressTip = false;
  
            _this.editRoom.longitude = result.poiList.pois[0].location.lng;
            _this.editRoom.latitude = result.poiList.pois[0].location.lat;
          } else {
            _this.isShowAddressTip = true;
          }
        })
      }
    },
    // 获取点室详情
    getDetail () {
      const roomId = this.$route.query.id;
      if (roomId) {
        getRoomDetail(roomId)
          .then(res => {
            if (res) {
              let province = res.data.province;
              let city = res.data.city;
              let region = res.data.region;
              let street = res.data.street;

              this.editRoom.uid = res.data.uid;
              this.editRoom.desci = res.data.desci;
              this.editRoom.latitude = res.data.latitude;
              this.editRoom.longitude = res.data.longitude;
              this.editRoom.dutyUserName = res.data.dutyUserName;
              this.editRoom.isEnable = res.data.isEnable;
              this.editRoom.userMobile = res.data.userMobile;
              this.editRoom.organId = res.data.organId;
              this.editRoom.organName = res.data.organName;
              this.editRoom.roomNumber = res.data.roomNumber;
              this.editRoom.roomName = res.data.roomName;

              this.editRoom.address = res.data.address;

              this.editRoom.province = province.toString();
              this.editRoom.city = city.toString();
              this.editRoom.region = region.toString();
              if (street) {
                this.editRoom.street = street.toString();
              }
              this.getCountryList();
              this.getCityList();
              this.getStreetList();
            }
          })
      }
    },
    // 初始化地图
    initMap () {
      let _this = this;
      // _this.resetMap();
      let map = new window.AMap.Map('mapBox', {
        zoom: 16, // 级别
        center: [110.596015, 27.907662], // 中心点坐标[110.596015, 27.907662]
      });
      map.setMapStyle('amap://styles/whitesmoke');

      _this.autoInput = new window.AMap.Autocomplete({
        input: 'inputAddress'
      });



      map.on('click', function(e) {
        _this.editRoom.longitude = e.lnglat.getLng();
        _this.editRoom.latitude = e.lnglat.getLat();
        
        new window.AMap.service('AMap.Geocoder', function () { // 回调函数
          let geocoder = null;
          geocoder = new window.AMap.Geocoder({});

          const lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];//地图上所标点的坐标

          geocoder.getAddress(lnglatXY, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              _this.editRoom.address = result.regeocode.formattedAddress;
              _this.mapMark(e.lnglat.getLng(), e.lnglat.getLat());
            }
          });
        });
      });
      _this.map = map;

      _this.mapMark(_this.editRoom.longitude, _this.editRoom.latitude);


      _this.isShowClose = true;
    },
    // 地图标记
    mapMark (longitude, latitude) {
      let _this = this;
      if (_this.newMarker) {
        _this.map.remove(_this.newMarker);
        _this.newMarker = null;
      }
      let hoverWindow = null, offSet = [-20.5, -48];
      if (longitude > 0 && latitude > 0) {
        _this.newMarker = new window.AMap.Marker({ // 添加自定义点标记
          map: _this.map,
          position: [longitude, latitude],
          offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
          extData: '',
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: '<div class="vl_icon vl_icon_control_30"></div>'
        });
        _this.newMarker.on('mouseover', function () {
          let sContent = '<div class="vl_map_hover" >' +
            '<div class="vl_main_hover_address" style="min-width: 100px;padding: 15px"><p class="vl_map_hover_main_p">经度： ' + longitude + '</p><p class="vl_map_hover_main_p">纬度： ' + latitude + '</p></div></div>';
          hoverWindow = new window.AMap.InfoWindow({
            isCustom: true,
            closeWhenClickMap: true,
            offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
            content: sContent
          });
          hoverWindow.open(_this.map, new window.AMap.LngLat(longitude, latitude));
        });
        _this.newMarker.on('mouseout', function () {
          if (hoverWindow) { hoverWindow.close(); }
        });
        _this.map.setCenter([longitude, latitude]);
        _this.newMarker.setMap(_this.map);
      }
    },
    // 事件地址change
    changeAddress () {
      let _this = this;
      _this.autoInput = new window.AMap.Autocomplete({
        input: 'inputAddress'
      });
      
      window.AMap.event.addListener(_this.autoInput, 'select', function (e) {
        _this.editRoom.eventAddress = e.poi.name;
        window.AMap.service('AMap.Geocoder', () => {
          var geocoder = new window.AMap.Geocoder({});
          geocoder.getLocation(e.poi.name, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              _this.editRoom.longitude = result.geocodes[0].location.lng;
              _this.editRoom.latitude = result.geocodes[0].location.lat;

              _this.mapMark(_this.editRoom.longitude, _this.editRoom.latitude);
            }
          });
        })
      }); // 注册监听，当选中某条记录时会触发
    },
    // 关闭地图
    closeMap () {
      if (this.map) {
        this.map.destroy();
        this.isShowClose = false;
      }
    },
    // 获取行政区划数据
    getAreaList () {
      const params = {
        parentUid: this.areaId
      }
      apiAreaList(params)
        .then(res => {
          if (res) {
            if (!this.areaName) {
              this.provinceList = res.data;
            }
            if (this.areaName === '市') {
              this.cityList = res.data;
            }
            if (this.areaName === '县') {
              this.countyList = res.data;
            }
            if (this.areaName === '镇') {
              this.streetList = res.data;
            }
          }
        })
    },
    // 获取城市数据
    getCityList () {
      const params = {
        parentUid: this.editRoom.province
      }
      apiAreaList(params)
        .then(res => {
          if (res) {
            this.cityList = res.data;
          }
        })
    },
    // 获取城市数据
    getCountryList () {
      const params = {
        parentUid: this.editRoom.city
      }
      apiAreaList(params)
        .then(res => {
          if (res) {
            this.countyList = res.data;
          }
        })
    },
    // 获取街道数据
    getStreetList () {
      const params = {
        parentUid: this.editRoom.region
      }
      apiAreaList(params)
        .then(res => {
          if (res) {
            this.streetList = res.data;
          }
        })
    },
    // 省 change
    handleProvinceData (id) {
      this.areaName = '市';
      this.areaId = id;
      // this.cityList = [];
      this.editRoom.city = '';
      this.editRoom.region = '';
      this.editRoom.street = '';

      this.getAreaList();
    },
    // 市 change
    handleCityData (id) {
      this.areaName = '县';
      this.areaId = id;
      
      this.editRoom.region = '';
      this.editRoom.street = '';

      this.getAreaList();
    },
    // 县 change
    handleRegionData (id) {
      this.areaName = '镇';
      this.areaId = id;
      
      this.editRoom.street = '';

      this.getAreaList();
    },
    // 获取当前部门及子级部门
    getDepartList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        'where.organPid': JSON.parse(this.$route.query.organObj).uid,
        pageSize: 0
      };
      getDepartmentList(params)
        .then(res => {
          if (res) {
            this.departmentList.push(JSON.parse(this.$route.query.organObj));
            res.data.list.map(item => {
              this.departmentList.push(item);
            });
          }
        })
    },
    // 所属单位change
    handleDepartment (val) {
      this.departmentList.map(item => {
        if (item.uid === val) {
          this.editRoom.organName = item.organName;
        }
      })
    },
    // 取消提交
    cancelSubmit (form) {
      this.$refs[form].resetFields();
      this.$router.back(-1);
    },
    // 确认提交
    submitData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.isEditLoading = true;
          updateRoom(this.editRoom)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '修改成功',
                  customClass: 'request_tip'
                });
                this.isEditLoading = false;
                this.$router.push({name: 'room_stall'});
              } else {
                this.isEditLoading = false;
              }
            })
            .catch(() => {this.isEditLoading = false;})
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit_room {
  .edit_box {
    margin: 0 10px 100px 20px;
    background-color: #ffffff;
    .title {
      color: #333333;
      font-size: 16px;
      font-weight: bold;
      height: 55px;
      line-height: 55px;
      padding-left: 20px;
      border-bottom: 1px solid #F2F2F2;
    }
    .content-body {
      padding: 10px;
      display: flex;
      .content_left {
        width: 50%;
        .add_room_form {
          width: 100%;
          .address_select {
            position: relative;
            .input_address {
              border-color: #F56C6C;
            }
            .address_tip {
              position: absolute;
              display: block;
              color: #F56C6C;
              font-size: 12px;
              line-height: 1;
              padding-top: 4px;
              position: absolute;
              top: 100%;
              left: 0;
            }
            .map_select {
              // width: calc(100% - 85%);
              position: absolute;
              right: 0;
              bottom: 0;
              display: flex;
              align-items: center;
              cursor: pointer;
              >span {
                color: #0C70F8;
                margin-left: 5px;
              }
            }
          }
        }
      }
      .content_right {
        width: calc(100% - 50%);
        position: relative;
        #mapBox {
          width: 90%;
          height: 100%;
          margin-left: 10%;
          z-index: 100;
        }
        .close_btn {
          right: 20px;
          top: 20px;
          position: absolute;
          z-index: 10000;
          cursor: pointer;
        }
      }
      >p {
        color: #999999;
        margin-bottom: 20px;
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
    .operation_btn {
      padding: 0;
      width: 100px;
      height: 40px;
      text-align: center;
    }
    .function_btn {
      background: #0C70F8;
      color: #ffffff;
    }
    .back_btn {
      background: #ffffff;
      border: 1px solid #DDDDDD;
      color: #666666;
    }
  }
}
</style>

