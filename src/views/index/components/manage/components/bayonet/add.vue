<template>
  <div class="bayonet_manage_add">
    <div is="vlBreadcrumb" :breadcrumbData="breadcrumbData"></div>
    <div class="basic_Info_Form" v-show="stepIndex === 1">
      <el-form ref="basicInfoForm" :model="basicInfoForm" :rules="basicInfoFormRules" label-width="80px" :label-position="labelPosition">
        <el-form-item prop="organ" label="所属机构">
          <el-select v-model="basicInfoForm.organ" placeholder="请搜索选择所属机构单位">
            <el-option
              v-for="item in organList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="bayonetName" label="卡口名称">  
          <el-input show-word-limit maxlength="20" v-model="basicInfoForm.bayonetName" placeholder="请输入卡口名称，不超过20字"></el-input>
        </el-form-item>
        <el-form-item label="卡口编号">
          <el-input v-model="basicInfoForm.bayonetNum" placeholder="请输入卡口编号"></el-input>
        </el-form-item>

        <el-form-item prop="bayonetType" label="出入城卡口" required>
          <el-radio-group v-model="basicInfoForm.bayonetType">
            <el-radio :label="1">入城卡口</el-radio>
            <el-radio :label="2">出城卡口</el-radio>
            <el-radio :label="3">其他</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="卡口用途">
          <el-select v-model="basicInfoForm.use" placeholder="请输入用途">
            <el-option
              v-for="item in useList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="bayonetIP" label="卡口IP" required>
          <el-input v-model="basicInfoForm.bayonetIP"></el-input>
        </el-form-item>

        <el-form-item label="经纬度" required class="longlat">
          <el-form-item prop="longitude">
            <el-input v-model="basicInfoForm.longitude" placeholder="请输入经度"></el-input>
          </el-form-item>
          <span>(经度)</span>
          <el-form-item prop="Latitude">
            <el-input v-model="basicInfoForm.Latitude" placeholder="请输入纬度"></el-input>
          </el-form-item>
          <span>(纬度)</span>
          <span><i class="el-icon-circle-plus-outline"></i> 地图选择</span>
        </el-form-item>

        <el-form-item label="卡口地址" required class="bayonet_address">
          <el-form-item prop="county">
            <el-select v-model="basicInfoForm.county">
              <el-option
                v-for="item in countyList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="town">
            <el-select v-model="basicInfoForm.town">
              <el-option
                v-for="item in townList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="community">
            <el-select v-model="basicInfoForm.community">
              <el-option
                v-for="item in communityList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="address">
            <el-input v-model="basicInfoForm.address" placeholder="请输入详细地址"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="管理车道数">
          <el-input-number v-model="basicInfoForm.laneNum" @change="handleChange" :min="1" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="描述">
          <el-input show-word-limit maxlength="150" type="textarea" v-model="basicInfoForm.describe" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="使用状况">
          <el-radio-group v-model="basicInfoForm.usage">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div id="mapBox"></div>
      <div class="operate_btn">
        <el-button class="reset_btn" @click="toGiveUpDialog = true">取消</el-button>
        <el-button class="select_btn" type="primary" @click="stepIndex = 2">下一步</el-button>
      </div>
    </div>
    <div class="bayonet_dev_list" v-show="stepIndex === 2">
      <h1>卡口设备</h1>
      <el-button class="btn_120" type="primary" @click="popEditDevDialog()">添加卡口设备</el-button>
      <div class="table_box">
        <el-table
          v-loading="loading"
          :data="bayonetDevList"
          >
          <el-table-column
            label="摄像头名称"
            prop="surveillanceName"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="类型"
            prop="num"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="智能特性"
            :show-overflow-tooltip="true"
            >
          </el-table-column>
          <el-table-column
            label="厂家"
            :show-overflow-tooltip="true"
            >
          </el-table-column>
          <el-table-column
            label="拍摄方向"
            :show-overflow-tooltip="true"
            >
          </el-table-column>
          <el-table-column
            label="服务端口"
            prop="eventCode"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="车道号"
            prop="eventCode"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="operation_btn" @click="popEditDevDialog(scope.row)">编辑</span>
              <span class="operation_wire">|</span>
              <span class="operation_btn" @click="popDeleteBayonetDevDialog()">删除</span>
            </template>
          </el-table-column>
          <div class="not_content" slot="empty">
            <img src="../../../../../../assets/img/not-content.png" alt="">
            <p>暂无相关数据</p>
          </div>
        </el-table>
      </div>
      <div class="operate_btn">
        <el-button class="reset_btn" @click="toGiveUpDialog = true">取消</el-button>
        <el-button class="select_btn" type="primary" @click="stepIndex = 1">上一步</el-button>
        <el-button class="select_btn" type="primary" @click="skipIsList">确定</el-button>
      </div>
    </div>
    <el-dialog
      :visible.sync="toGiveUpDialog"
      :close-on-click-modal="false"
      width="482px"
      top="40vh">
      <h4>是否放弃本次操作？</h4>
      <div slot="footer">
        <el-button :loading="loadingBtn" @click="skipIsList" class="btn_140" type="primary">放弃</el-button>
        <el-button class="btn_140" @click="toGiveUpDialog = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="delBayonetDevDialog"
      :close-on-click-modal="false"
      width="482px"
      top="40vh">
      <h4>是否确定删除该设备信息？</h4>
      <div slot="footer">
        <el-button @click="delBayonetDevDialog = false" class="btn_140">取消</el-button>
        <el-button :loading="loadingBtn" class="btn_140" type="primary">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="editDevDialog"
      :close-on-click-modal="false"
      width="800px"
      height="600px"
      top="40vh"
      title="添加卡口设备">
      <vue-scroll style="height: 500px">
        <el-form ref="bayonetDevForm" :model="bayonetDevForm" :rules="bayonetDevFormRules" label-width="100px" :label-position="labelPosition">
          <el-form-item prop="cameraName" label="摄像头名称">
            <el-input v-model="bayonetDevForm.cameraName" placeholder="请输入摄像头名称，不超过20字"></el-input>
          </el-form-item>
          <el-form-item label="摄像头类型">
            <el-select v-model="bayonetDevForm.cameraType">
              <el-option
                v-for="item in cameraTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="厂家">
            <el-select v-model="bayonetDevForm.manufacturers">
              <el-option
                v-for="item in manufacturersList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最大像素">
            <el-select v-model="bayonetDevForm.pixel">
              <el-option
                v-for="item in pixelList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="拍摄方向">
            <el-select v-model="bayonetDevForm.direction">
              <el-option
                v-for="item in directionList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="智能特性">
            <el-select v-model="bayonetDevForm.features">
              <el-option
                v-for="item in featuresList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="SIPNum" label="SIP编号">
            <el-input v-model="bayonetDevForm.SIPNum" placeholder="请输入SIP编号"></el-input>
          </el-form-item>
          <el-form-item prop="accessCode" label="视频接入编码">
            <el-input v-model="bayonetDevForm.accessCode" placeholder="请输入视频接入编码"></el-input>
          </el-form-item>
          <el-form-item label="结构化设备编码">
            <el-input v-model="bayonetDevForm.devCode" placeholder="请输入结构化设备编码"></el-input>
          </el-form-item>
          <el-form-item prop="servicePort" label="服务端口">
            <el-input v-model="bayonetDevForm.servicePort" placeholder="请输入服务端口"></el-input>
          </el-form-item>
          <el-form-item label="用途">
            <el-radio-group v-model="bayonetDevForm.use">
              <el-radio :label="1">抓拍摄像头</el-radio>
              <el-radio :label="2">全景摄像头</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item class="driving_info">
            <div v-for="(item, index) in bayonetDevForm.drivingInfo" :key="index">
              <el-form-item label="车道号" :prop="'drivingInfo.' + index + '.laneNum'" :rules="{ required: true, message: '请选择车道号', trigger: 'change'}" >
                <el-select v-model="item.laneNum">
                  <el-option
                    v-for="item in laneNumList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="行车方向" :prop="'drivingInfo.' + index + '.drivingDirection'" :rules="{ required: true, message: '请输入行车方向', trigger: 'change'}" >
                <el-select v-model="item.drivingDirection">
                  <el-option
                    v-for="item in drivingDirectionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="大车最低限速" :prop="'drivingInfo.' + index + '.cartMinSpeedLimit'">
                <el-input v-model="item.cartMinSpeedLimit"></el-input>
              </el-form-item>
              <el-form-item label="大车最高限速" :prop="'drivingInfo.' + index + '.cartMaxSpeedLimit'">
                <el-input v-model="item.cartMaxSpeedLimit"></el-input>
              </el-form-item>
              <el-form-item label="小车最低限速" :prop="'drivingInfo.' + index + '.smallCarMinSpeedLimit'">
                <el-input v-model="item.smallCarMinSpeedLimit"></el-input>
              </el-form-item>
              <el-form-item label="小车最高限速" :prop="'drivingInfo.' + index + '.smallCarMaxSpeedLimit'">
                <el-input v-model="item.smallCarMaxSpeedLimit"></el-input>
              </el-form-item>
            </div>
            <el-form-item class="driving_info_btn_box">
              <div @click="addDrivingInfo"><i class="vl_icon vl_icon_control_22"></i><span>添加</span></div>
              <div @click="delDrivingInfo"><i class="vl_icon vl_icon_control_28"></i><span>删除</span></div>
            </el-form-item>
          </el-form-item>

        </el-form>
      </vue-scroll>
      <div slot="footer">
        <el-button @click="toGiveUpDialog = true" class="btn_140">取消</el-button>
        <el-button :loading="loadingBtn" class="btn_140" type="primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
import {mapXupuxian} from '@/config/config.js';
export default {
  components: {vlBreadcrumb},
  data () {
    return {
      breadcrumbData: [{name: '系统管理', routerName: 'manage'}, {name: '卡口管理', routerName: 'bayonet_manage'}],
      pageType: null,// 1为新增，2为编辑
      stepIndex: 1,//步骤1为卡口基本信息，2位添加卡口设备
      labelPosition: 'right',
      // 卡口基本信息表单参数
      basicInfoForm: {
        bayonetName: null,
        bayonetNum: null,
        organ: null,
        bayonetType: null,
        use: null,
        bayonetIP: null,
        longitude: null,
        Latitude: null,
        county: null,
        town: null,
        community: null,
        address: null,
        laneNum: null,
        describe: null,
        usage: null
      },
      // 卡口基本信息表单列表参数
      organList: [],// 机构列表
      useList: [],// 用途列表
      countyList: [],// 县列表
      townList: [],// 镇列表
      communityList: [],// 社区列表
      // 卡口基本信息表单验证规则
      basicInfoFormRules: {
        bayonetName: [{required: true, message: '请填写姓名', trigger: 'blur'}],
        organ: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        longitude: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        Latitude: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        county: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        town: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        community: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        address: [{required: true, message: '请填写证件号码', trigger: 'blur'}]
      },
      // 地图参数
      mapOne: null,
      zoomLevel: 16,
      lngLat: null,//经纬度
      autoComplete: null,
      marker: null,
      // 放弃本次操作弹窗参数
      toGiveUpDialog: false,
      loadingBtn: false,
      // 卡口设备列表参数
      loading: false,
      bayonetDevList: [{}],
      // 删除卡口设备弹窗参数
      delBayonetDevDialog: false,

      // 编辑卡口设备弹窗参数
      editDevDialog: false,
      // 编辑卡口表单参数
      bayonetDevForm: {
        cameraName: null,
        cameraType: null,
        manufacturers: null,
        pixel: null,
        direction: null,
        features: null,
        SIPNum: null,
        accessCode: null,
        devCode: null,
        servicePort: null,
        use: null,
        drivingInfo: [
          {
            laneNum: null,
            drivingDirection: null,
            cartMinSpeedLimit: null,
            cartMaxSpeedLimit: null,
            smallCarMinSpeedLimit: null,
            smallCarMaxSpeedLimit: null
          }
        ]
      },
      // 编辑卡口表单列表参数
      cameraTypeList: [],
      manufacturersList: [],
      pixelList: [],
      directionList: [],
      featuresList: [],
      laneNumList: [],
      drivingDirectionList: [],

      // 编辑卡口表单验证规则
      bayonetDevFormRules: {
        cameraName: [{required: true, message: '请填写姓名', trigger: 'blur'}],
        SIPNum: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        accessCode: [{required: true, message: '请填写证件号码', trigger: 'blur'}],
        servicePort: [{required: true, message: '请填写证件号码', trigger: 'blur'}]
      }
    }
  },
  
  mounted () {
    this.pageType = parseInt(this.$route.query.type);
    if (this.pageType === 1) {
      this.breadcrumbData.push({name: '新增卡口'});
    } else {
      this.breadcrumbData.push({name: '编辑卡口'});
    }
    this.resetMap();
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
    // 跳转到卡口列表
    skipIsList () {
      this.$router.push({name: 'bayonet_manage_list'});
    },
    /* 地图选择经纬度方法start */
    resetMap () {
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
            _this.basicInfoForm.longitude = lnglatXY[0];
            _this.basicInfoForm.Latitude = lnglatXY[1];
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
    markLocation (lng, lat, address) {
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

    // 弹出删除卡口设备弹窗
    popDeleteBayonetDevDialog () {
      this.delBayonetDevDialog = true;
    },
    // 弹出新增/编辑卡口设备弹窗
    popEditDevDialog () {
      this.editDevDialog = true;
    },
    // 添加行车信息的动态表单
    addDrivingInfo () {
      this.bayonetDevForm.drivingInfo.push({
        laneNum: null,
        drivingDirection: null,
        cartMinSpeedLimit: null,
        cartMaxSpeedLimit: null,
        smallCarMinSpeedLimit: null,
        smallCarMaxSpeedLimit: null
      });
    },
    // 删除行车信息的动态表单
    delDrivingInfo () {
       this.bayonetDevForm.drivingInfo.pop();
    }
  }
}
</script>
<style lang="scss" scoped>
.bayonet_manage_add{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .basic_Info_Form{
    padding: 20px;
    width: 100%;
    height: calc(100% - 50px);
    overflow-y: auto;
    #mapBox{
      width: 100%;
      height: 500px;
    }
  }
  .operate_btn{
    width: 100%;
    height: 65px;
    line-height: 65px;
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
  .basic_Info_Form{
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

