<template>
  <div class="bayonet_manage_add">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ name: 'manage' }">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'bayonet_manage' }">卡口管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageType === 1 ? '新增卡口' : '编辑卡口'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_box">
      <div class="basic_Info_Form" v-show="stepIndex === 1">
        <h1>基本信息</h1>
        <div class="form_box">
          <vue-scroll>
            <el-form ref="basicInfoForm" :model="basicInfoForm" :rules="basicInfoFormRules" label-width="96px" :label-position="labelPosition">
              <el-form-item prop="organ" label="所属机构:">
                <el-select v-model="basicInfoForm.organ" value-key="uid" filterable placeholder="请搜索选择所属机构单位">
                  <el-option
                    v-for="item in organList"
                    :key="item.uid"
                    :label="item.organName"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="bayonetName" label="卡口名称:">  
                <el-input show-word-limit maxlength="20" v-model="basicInfoForm.bayonetName" placeholder="请输入卡口名称，不超过20字"></el-input>
              </el-form-item>
              <el-form-item label="卡口编号:">
                <el-input v-model="basicInfoForm.bayonetNum" placeholder="请输入卡口编号"></el-input>
              </el-form-item>

              <el-form-item prop="bayonetType" label="出入城卡口:" required>
                <el-radio-group v-model="basicInfoForm.bayonetType">
                  <el-radio :label="1">入城卡口</el-radio>
                  <el-radio :label="2">出城卡口</el-radio>
                  <el-radio :label="3">其他</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="卡口用途:">
                <el-select v-model="basicInfoForm.use" multiple collapse-tags placeholder="请输入卡口用途">
                  <el-option
                    v-for="item in useList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="bayonetIP" label="卡口IP:">
                <el-input v-model="basicInfoForm.bayonetIP"></el-input>
              </el-form-item>

              <el-form-item label="经纬度:" required class="longlat">
                <el-form-item prop="longitude">
                  <el-input v-model="basicInfoForm.longitude" placeholder="请输入经度"></el-input>
                </el-form-item>
                <span>(经度)</span>
                <el-form-item prop="Latitude" style="margin-left: 44px;">
                  <el-input v-model="basicInfoForm.Latitude" placeholder="请输入纬度"></el-input>
                </el-form-item>
                <span>(纬度)</span>
              </el-form-item>

              <el-form-item label="卡口地址:" prop="bayonetAddress" placeholder="请选择省/市/县/乡">
                <el-cascader v-model="basicInfoForm.bayonetAddress" :options="options" ref="cascaderAddr" style="width:100%" @change="handleChangeAddress" clearable placeholder="请选择省/市/县/乡"></el-cascader>
              </el-form-item>
              
              <el-form-item prop="address">
                <el-input v-model="basicInfoForm.address" placeholder="请输入详细地址" @blur="markAddress(basicInfoForm.address)"></el-input>
              </el-form-item>
              <el-form-item prop="laneNum" label="管理车道数:">
                <el-input v-model="basicInfoForm.laneNum" placeholder="请输入车道数"></el-input>
              </el-form-item>
              <el-form-item label="描述:">
                <el-input show-word-limit maxlength="150" type="textarea" v-model="basicInfoForm.describe" placeholder="请描述下，文字限制150字"></el-input>
              </el-form-item>
              <el-form-item label="使用状况:">
                <el-radio-group v-model="basicInfoForm.usage">
                  <el-radio :label="1">启用</el-radio>
                  <el-radio :label="2">停用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </vue-scroll>
          <div class="add_map">
            <div id="mapBox"></div>
            <div class="map_r">
              <div class="top"><i class="vl_icon vl_icon_control_23" @click="resetZoom"></i></div>
              <ul class="bottom">
                <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
                <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="operate_btn">
          <el-button class="btn_100" type="primary" @click="stepIndex = 2">下一步</el-button>
          <el-button class="btn_100" @click="toGiveUpDialog = true">取消</el-button>
        </div>
      </div>
      <div class="bayonet_dev_list" v-show="stepIndex === 2">
        <h1>卡口设备</h1>
        <el-button class="btn_120" type="primary" @click="popAddDevDialog()">添加卡口设备</el-button>
        <div class="table_box">
          <el-table
            v-loading="loading"
            :data="bayonetDevList"
            >
            <el-table-column
              label="摄像头名称"
              prop="cameraName"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="类型"
              prop="cameraType"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="智能特性"
              :show-overflow-tooltip="true"
              >
              <template slot-scope="scope">
                <span>{{scope.row.features.join(',')}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="厂家"
              prop="manufacturers"
              :show-overflow-tooltip="true"
              >
            </el-table-column>
            <el-table-column
              label="拍摄方向"
              prop="direction"
              :show-overflow-tooltip="true"
              >
            </el-table-column>
            <el-table-column
              label="服务端口"
              prop="servicePort"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="车道号"
              show-overflow-tooltip
              >
              <template slot-scope="scope">
                <span>{{scope.row.drivingInfo.map(m => m.laneNum).join(',')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <span class="operation_btn" @click="popEditDevDialog(scope.row, scope.$index)">编辑</span>
                <span class="operation_wire">|</span>
                <span class="operation_btn" @click="popDeleteBayonetDevDialog(scope.$index)">删除</span>
              </template>
            </el-table-column>
            <div class="not_content" slot="empty">
              <img src="../../../../../../assets/img/not-content.png" alt="">
              <p>暂无相关数据</p>
            </div>
          </el-table>
          <!-- <el-pagination
            class="cum_pagination"
            v-if="bayonetDevList && bayonetDevList.length > 0"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="30">
          </el-pagination> -->
        </div>
        <div class="operate_btn">
          <el-button class="btn_100" type="primary" @click="stepIndex = 1">上一步</el-button>
          <el-button class="btn_100" type="primary" @click="submitBayonet">确定</el-button>
          <el-button class="btn_100" @click="toGiveUpDialog = true">取消</el-button>
        </div>
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
        <el-button :loading="loadingBtn" class="btn_140" type="primary" @click="delDev">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="editDevDialog"
      :close-on-click-modal="false"
      class="edit_dev_dialog"
      width="800px"
      height="600px"
      top="40vh"
      title="添加卡口设备">
      <vue-scroll style="height: 500px">
        <el-form ref="bayonetDevForm" :model="bayonetDevForm" :rules="bayonetDevFormRules" label-width="120px" :label-position="labelPosition">
          <el-form-item prop="cameraName" label="摄像头名称:">
            <el-input v-model="bayonetDevForm.cameraName" placeholder="请输入摄像头名称，不超过20字"></el-input>
          </el-form-item>
          <el-form-item label="摄像头类型:">
            <el-select v-model="bayonetDevForm.cameraType">
              <el-option
                v-for="item in cameraTypeList"
                :key="item.enumField"
                :label="item.enumValue"
                :value="item.enumField">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="厂家:">
            <el-select v-model="bayonetDevForm.manufacturers">
              <el-option
                v-for="item in manufacturersList"
                :key="item.enumField"
                :label="item.enumValue"
                :value="item.enumField">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最大像素:">
            <el-select v-model="bayonetDevForm.pixel">
              <el-option
                v-for="item in pixelList"
                :key="item.enumField"
                :label="item.enumValue"
                :value="item.enumField">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="拍摄方向:">
            <el-select v-model="bayonetDevForm.direction">
              <el-option
                v-for="item in directionList"
                :key="item.id"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="智能特性:">
            <el-select multiple collapse-tags v-model="bayonetDevForm.features">
              <el-option
                v-for="item in featuresList"
                :key="item.enumField"
                :label="item.enumValue"
                :value="item.enumField">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="SIPNum" label="SIP编号:">
            <el-input v-model="bayonetDevForm.SIPNum" placeholder="请输入SIP编号"></el-input>
          </el-form-item>
          <el-form-item prop="accessCode" label="视频接入编码:">
            <el-input v-model="bayonetDevForm.accessCode" placeholder="请输入视频接入编码"></el-input>
          </el-form-item>
          <el-form-item label="结构化设备编码:">
            <el-input v-model="bayonetDevForm.devCode" placeholder="请输入结构化设备编码"></el-input>
          </el-form-item>
          <el-form-item prop="servicePort" label="服务端口:">
            <el-input v-model="bayonetDevForm.servicePort" placeholder="请输入服务端口"></el-input>
          </el-form-item>
          <el-form-item label="用途:">
            <el-radio-group v-model="bayonetDevForm.use">
              <el-radio :label="1">抓拍摄像头</el-radio>
              <el-radio :label="2">全景摄像头</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item class="driving_info" v-for="(item, index) in bayonetDevForm.drivingInfo" :key="index">
            <div class="vl_icon vl_icon_control_28" @click="delDrivingInfo(index)"></div>
            <el-form-item style="margin-top: 30px;" label="车道号" :prop="'drivingInfo.' + index + '.laneNum'" :rules="{ required: true, message: '请选择车道号', trigger: 'change'}" >
              <el-select v-model="item.laneNum">
                <el-option
                  v-for="item in laneNumList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-top: 30px;" label="行车方向" :prop="'drivingInfo.' + index + '.drivingDirection'" :rules="{ required: true, message: '请输入行车方向', trigger: 'change'}" >
              <el-select v-model="item.drivingDirection">
                <el-option
                  v-for="item in drivingDirectionList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="大车最低限速" :prop="'drivingInfo.' + index + '.cartMinSpeedLimit'" :rules="{ required: true, message: '请选择车道号', trigger: 'blur'}">
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
          </el-form-item>
          <el-form-item class="add_btn_form">
            <div class="add_btn" @click="addDrivingInfo">
              <i class="vl_icon vl_icon_control_22"></i><span>添加</span>
            </div>
          </el-form-item>
        </el-form>
      </vue-scroll>
      <div slot="footer">
        <el-button @click="toGiveUpDialog = true" class="btn_140">取消</el-button>
        <el-button :loading="loadingBtn" class="btn_140" type="primary" @click="addDevByTable">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDepartmentList} from '@/views/index/api/api.manage.js';
import { addBayonetInfo} from '@/views/index/api/api.base.js';
import {mapXupuxian} from '@/config/config.js';
import mapData from '@/config/mapdata.json';
import { dataList } from '@/utils/data.js';
import { objDeepCopy } from '@/utils/util.js';
export default {
  data () {
    return {
      userInfo: null,
      pageType: null,// 1为新增，2为编辑
      stepIndex: 2,//步骤1为卡口基本信息，2位添加卡口设备
      labelPosition: 'right',
      // 卡口基本信息表单参数
      basicInfoForm: {
        bayonetName: null,
        bayonetNum: null,
        organ: null,
        bayonetType: 3,
        use: [],
        bayonetIP: null,
        longitude: null,
        Latitude: null,
        bayonetAddress: null,
        address: null,
        laneNum: null,
        describe: null,
        usage: 1
      },
      options: mapData,
      // 卡口基本信息表单列表参数
      organList: [],// 机构列表
      useList: [
        {label: '人脸抓拍', value: 1},
        {label: '车辆抓拍', value: 2},
        {label: '全结构化', value: 3},
        {label: '其他用途', value: 4}
      ],// 用途列表
      // bayonetAddressList: [],// 县列表
      locationName: null,
      // 卡口基本信息表单验证规则
      basicInfoFormRules: {
        bayonetName: [{required: true, message: '该项内容不可为空', trigger: 'blur'}],
        organ: [{required: true, message: '该项内容不可为空', trigger: 'blur'}],
        bayonetIP: [{required: true, message: '该项内容不可为空', trigger: 'blur'}],
        longitude: [{required: true, message: '该项内容不可为空', trigger: 'blur'}],
        Latitude: [{required: true, message: '该项内容不可为空', trigger: 'blur'}],
        laneNum: [{required: true, message: '该项内容不可为空', trigger: 'blur'}],
        bayonetAddress: [{required: true, message: '该项内容不可为空', trigger: 'blur'}],
        address: [{required: true, message: '该项内容不可为空', trigger: 'blur'}]
      },
      // 地图参数
      map: null,
      zoomLevel: 16,
      lngLat: null,//经纬度
      autoComplete: null,
      marker: null,
      // 放弃本次操作弹窗参数
      toGiveUpDialog: false,
      loadingBtn: false,
      // 卡口设备列表参数
      loading: false,
      bayonetDevList: [],
      // 删除卡口设备弹窗参数
      delBayonetDevDialog: false,

      // 编辑卡口设备弹窗参数
      editDevDialog: false,
      // 编辑卡口表单参数
      bayonetDevForm: {
        cameraName: '摄像头名称',
        cameraType: '1',
        manufacturers: '1',
        pixel: '1',
        direction: '朝东',
        features: ['1','2'],
        SIPNum: 123,
        accessCode: 456,
        devCode: 123,
        servicePort: 80,
        use: 1,
        drivingInfo: [
          {
            laneNum: 1,
            drivingDirection: 1,
            cartMinSpeedLimit: 100,
            cartMaxSpeedLimit: 100,
            smallCarMinSpeedLimit: 100,
            smallCarMaxSpeedLimit: 100
          }
        ]
      },
      // 编辑卡口表单列表参数
      cameraTypeList: this.dicFormater(dataList.cameraType)[0].dictList,
      manufacturersList: this.dicFormater(dataList.manufacturer)[0].dictList,
      pixelList: this.dicFormater(dataList.maxPixel)[0].dictList,
      featuresList: this.dicFormater(dataList.intelCharac)[0].dictList,
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
      laneNumList: [
        {value: 1, label: '1'},
        {value: 2, label: '2'},
        {value: 3, label: '3'},
        {value: 4, label: '4'}
      ],
      drivingDirectionList: [
        {value: 1, label: '直行'},
        {value: 2, label: '左转'},
        {value: 3, label: '右转'},
        {value: 4, label: '调头'}
      ],
      // 编辑卡口表单验证规则
      bayonetDevFormRules: {
        cameraName: [{required: true, message: '该项内容不可为空', trigger: 'blur'}],
        SIPNum: [{required: true, message: '该项内容不可为空', trigger: 'blur'}],
        accessCode: [{required: true, message: '该项内容不可为空', trigger: 'blur'}],
        servicePort: [{required: true, message: '该项内容不可为空', trigger: 'blur'}]
      },
      // 翻页数据
      currentPage: 1,
      pageSize: 10,
      pageNum: 1,
      devIndex: null,
      operateDevType: null,
      devInfo: {},//单个设备信息，用来编辑
    }
  },
  mounted () {
    this.userInfo = this.$store.state.loginUser;
    this.pageType = parseInt(this.$route.query.type);
    this.resetMap();
    this.getDepartList();
  },
  methods: {
    // 添加设备至列表中
    addDevByTable () {
      // 新增
      if (this.operateDevType === 1) {
        this.bayonetDevList.push(objDeepCopy(this.bayonetDevForm));
        this.editDevDialog = false;
      // 编辑
      } else {
        this.bayonetDevList.splice(this.devIndex, 1, objDeepCopy(this.bayonetDevForm));
        this.editDevDialog = false;
      }
      console.log(this.bayonetDevList, 'this.bayonetDevList')
    },
    // 弹出删除卡口设备弹窗
    popDeleteBayonetDevDialog (index) {
      this.devIndex = index;
      this.delBayonetDevDialog = true;
    },
    // 删除设备
    delDev () {
      this.bayonetDevList.splice(this.devIndex, 1);
      this.delBayonetDevDialog = false;
    },
    // 弹出新增卡口设备弹窗
    popAddDevDialog () {
      this.editDevDialog = true;
      this.operateDevType = 1;
    },
    // 弹出编辑卡口设备弹窗
    popEditDevDialog (data, index) {
      this.bayonetDevForm = data;
      this.devIndex = index;
      this.operateDevType = 2;
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
    delDrivingInfo (index) {
       this.bayonetDevForm.drivingInfo.splice(index, 1);
    },
    // 新增卡口
    submitBayonet () {
      console.log(this.bayonetDevList, 'this.bayonetDevList')
      let bayonetDevInfoDtoList = objDeepCopy(this.bayonetDevList);
      bayonetDevInfoDtoList = bayonetDevInfoDtoList.map(m => {
        return {
          deviceName: m.cameraName,
          type: m.cameraType,
          manufacturer: m.manufacturers,
          maxPixel: m.pixel,
          filmDirection: m.direction,
          deviceSip: m.SIPNum,
          deviceCode: m.accessCode,
          viewClassCode: m.devCode,
          servicePort: m.servicePort,
          deviceUse: m.use,
          deviceIntelRelList: m.features.map(m => {
            return {intelligentCharac: m}
          }),
          cameraLaneRelList: m.drivingInfo.map(m => {
            return {
              laneNo: m.laneNum,
              direction: m.drivingDirection,
              bigMaxSpeed: m.cartMaxSpeedLimit,
              bigMinSpeed: m.cartMinSpeedLimit,
              smallMaxSpeed: m.smallCarMaxSpeedLimit,
              smallMinSpeed: m.smallCarMinSpeedLimit,
            }
          })
        }
      })
      let data = {
        bayonetNo: this.basicInfoForm.bayonetNum,
        bayonetName: this.basicInfoForm.bayonetName,   
        isEnterPoint: this.basicInfoForm.bayonetType,   
        desci: this.basicInfoForm.describe,          
        use: this.basicInfoForm.use,   
        longitude: this.basicInfoForm.longitude,      
        latitude: this.basicInfoForm.Latitude,       
        bayonetAddress: this.locationName + this.basicInfoForm.address,
        laneNum: this.basicInfoForm.laneNum,        
        isEnable: this.basicInfoForm.usage,       
        // onlineState: this.basicInfoForm., 
        ipAddress: this.basicInfoForm.bayonetIP,    
        dutyUnitId: this.basicInfoForm.organ && this.basicInfoForm.organ.uid,     
        dutyUnitName: this.basicInfoForm.organ && this.basicInfoForm.organ.organName,   
        bayonetDevInfoDtoList: bayonetDevInfoDtoList
      }
      addBayonetInfo(data).then(res => {

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
    // 所在位置change
    handleChangeAddress (value) {
      // this.$set(this.onlineForm,'address','');
      let labels = this.$refs['cascaderAddr'].currentLabels;
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
             _this.addMarker(lon, lat);
            } else {
              console.log('定位失败！');
            }
        });
      });
    },
    // 翻页
    handleCurrentChange (page) {
      this.pageNum = page;
      this.currentPage = page;
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
                    _this.addMarker(e.lnglat.getLng(), e.lnglat.getLat());

                }else{
                    //获取地址失败
                    _this.$message.error('没有获取到地址');
                }
            });
        })

      })
      _this.map = map;
    },
    // 输入追踪点定位圆形覆盖物的中心点
    addMarker (lng, lat) {
      let _this = this;
      if (_this.marker) {
        _this.map.remove(_this.marker);
      }
      _this.lngLat = [lng, lat];
      // 追踪点标记
      let offSet = [-20.5, -48], _hoverWindow = null;
      if (lng > 0 && lat > 0) {
        _this.marker = new window.AMap.Marker({ // 添加自定义点标记
          map: _this.map,
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
              <li><span>经度:</span><span>${lng}</span></li>
              <li><span>纬度:</span><span>${lat}</span></li>
            </ul></div>`;
          _hoverWindow = new window.AMap.InfoWindow({
            isCustom: true,
            closeWhenClickMap: true,
            offset: new window.AMap.Pixel(0, -20), // 相对于基点的偏移位置
            content: _sContent
          });
          _hoverWindow.open(_this.map, new window.AMap.LngLat(lng, lat));
        });
        _this.marker.on('mouseout', function () {
          if (_hoverWindow) { _hoverWindow.close(); }
        });
        _this.map.setCenter([lng, lat]);
        _this.marker.setMap(_this.map);
      }
    },
    resetZoom () {
      if (this.map) {
        this.map.setZoom(this.zoomLevel);
      }
    },
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    /* 地图选择经纬度方法end */
  }
}
</script>
<style lang="scss" scoped>
.bayonet_manage_add{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .content_box{
    height: calc(100% - 140px);
    margin: 0 20px 0;
    background: #fff;
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:2px;
    .basic_Info_Form, .bayonet_dev_list{
      width: 100%;
      height: 100%;
      > h1{
        height: 54px;
        line-height: 54px;
        padding: 0 20px;
        border-bottom: 1px solid #F2F2F2;
        font-size: 16px;
        font-weight: bold;
      }
      .form_box{
        width: 100%;
        height: calc(100% - 54px);
        display: flex;
        flex-wrap: nowrap;
        .el-form{
          width: 514px;
          height: 100%;
          padding: 20px;
        }
        .add_map{
          height: 100%;
          width: calc(100% - 514px);
          position: relative;
          #mapBox{
            width: 100%;
            height: 100%;
          }
          .map_r{
            width: 78px;
            position: absolute;
            right: 20px;
            bottom: 20px;
            .top, .bottom > li{
              width: 100%;
              height: 70px;
              line-height: 80px;
              background: #fff;
              text-align: center;
              cursor: pointer;
              i{
                margin-top: 15px;
                font-size: 20px;
                color: #999999;
              }
              &:hover{
                i{
                  color: #0C70F8;
                }
              }
            }
            .top{
              margin-bottom: 10px;
              p.active{
                color: #0C70F8;
              }
            }
            .top, .bottom{
              box-shadow:4px 0px 15px 0px rgba(131,131,131,0.23),0px 0px 13px 0px rgba(255,255,255,0.55);
            }
            .bottom > li:nth-child(1){
              border-bottom: 1px solid #F1F1F1;
            }
          }
        }
      }
    }
    .bayonet_dev_list{
      > .el-button{
        margin: 10px 20px;
      }
      .table_box{
        padding: 0 20px 20px;
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
}
</style>
<style lang="scss">
.bayonet_manage_add{
  .basic_Info_Form{
    .longlat > .el-form-item__content{
      display: flex;
      flex-wrap: nowrap;
      .el-form-item{
        width: 120px;
      }
      > span{
        margin-left: 10px;
        white-space: nowrap; 
        color: #D3D3D3;
      }
    }
    .el-form{
      .el-form-item{
        width: 100%;
        .el-select{
          width: 100%;
        }
      }
    }
    .__vuescroll{
      width: auto!important;
    }
  }
  .edit_dev_dialog{
    .el-form{
      display: flex;
      flex-wrap: wrap;
      padding: 20px;
      .el-form-item{
        width: 50%;
        .el-select{
          width: 100%;
        }
      }
      .driving_info{
        width: 100%;
        background: #FAFAFA;
        border-radius:2px;
        padding: 20px 20px 0;
        position: relative;
        .el-form-item__content{
          display: flex;
          flex-wrap: wrap;
          margin-left: 0!important;
          .el-form-item{
            width: 50%;
            margin-bottom: 20px;
          }
          .vl_icon_control_28{
            position: absolute;
            right: 0;
            top: 0;
            cursor: pointer;
          }
        }
      }
      .add_btn_form{
        width: 100%;
        .el-form-item__content{
          margin-left: 0!important;
          .add_btn{
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            background: #FAFAFA;
            border-radius:4px;
            border:1px solid rgba(217,217,217,1);
            cursor: pointer;
            > span, > i{
              color: #0C70F8;
            }
            > i{
              margin-right: 10px;
              vertical-align: middle;
              margin-top: -3px;
              font-size: 18px;
            }
          }
        }
      }
    }
  }
}
</style>

