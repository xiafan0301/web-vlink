<template>
  <el-form :ref="mapId" :model="modelForm" class="control_model">
    <!-- 图片上传 -->
    <el-form-item :label="changeObj" :rules="{ required: true, message: '', trigger: 'blur'}" style="margin-bottom: 0;padding-left: 20px;padding-top: 10px;">
      <div is="uploadPic" :fileList="fileList" @uploadPicDel="uploadPicDel" @uploadPicFileList="uploadPicFileList"></div>
      <div class="pic_format">
        <div @click="popSel">从库中选择</div>
      </div>
    </el-form-item>
    <el-form-item v-if="modelType !== '1'" label="车牌信息" placeholder="请补充车牌号码" style="width: 50%;padding-left: 20px;" :class="{'licenseNum': modelType !== '4'}">
      <el-select
        v-model="modelForm.licenseNum"
        filterable
        remote
        multiple
        reserve-keyword
        allow-create
        @change="getLicenseNum"
        value-key="value"
        placeholder="请输入车牌信息"
        :remote-method="getVehicleByVehicleNumber"
        :loading="loading">
        <el-option
          v-for="item in licenseNumList"
          :key="item.value"
          :label="item.label"
          :value="item.label">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="modelType === '3'" label="受限范围" placeholder="请选择" style="width: 50%;padding-left: 20px;">
      <el-select value-key="value" v-model="modelForm.limitation" multiple filterable allow-create default-first-option placeholder="请输入受限范围" @change="getAllBayontListByAreaId">
        <el-option
          v-for="item in areaList"
          :key="item.value"
          :label="item.label"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>
    <template v-if="modelType === '1' || modelType === '2'">
      <el-form-item :label="'追踪点' + (index + 1) + ':'" :prop="'points.' + index + '.point'" :rules="{ required: true, message: '追踪点不能为空', trigger: 'blur'}" v-for="(item, index) in modelForm.points" :key="index" style="width: 50%;padding-left: 20px;" class="point">
        <el-autocomplete
          style="width: 490px;"
          v-model="item.point"
          :trigger-on-focus="false"
          :fetch-suggestions="autoAdress"
          value-key="name"
          @focus="pointIndex = index"
          @select="chooseAddress"
          placeholder="请输入追踪点">
        </el-autocomplete>
        <i class="vl_icon vl_icon_control_28" @click="removePoint(item)" v-if="modelForm.points.length > 1"></i>
      </el-form-item>
      <el-form-item style="width: calc(50% - 30px);padding-left: 20px;">
        <div class="add_point" @click="addPoint"><i class="vl_icon vl_icon_control_22"></i>添加追踪点</div>
      </el-form-item>
    </template>
    <!-- 地图 -->
    <div class="manage_d_s_m">
      <div :id="mapId"></div>
      <div class="manage_d_s_m_l">
        <!-- 人员追踪/车辆追踪 -->
        <div class="manage_t" style="height: 130px;padding: 20px 20px;" v-if="modelType === '1' || modelType === '2'">
          <el-input v-model="scopeRadius" @blur="setCircleRadius" placeholder="请输入范围半径值（单位千米）" style="width: 220px;margin-bottom: 10px;"></el-input>
          <el-select value-key="uid" v-model="featuresId" filterable placeholder="选择设备特性" style="width: 220px;" @change="getAllMonitorList(null)">
            <el-option
              v-for="item in featuresTypeList"
              :key="item.uid"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!-- 范围分析 -->
        <div class="manage_t equ_h" style="height: 130px;padding: 20px 20px;" v-if="modelType === '4'">
          <el-select value-key="uid" v-model="devGroupId" filterable placeholder="选择设备组" style="width: 220px;" @change="getAllMonitorList(null)">
            <el-option label="不限" :value="null"></el-option>
            <el-option
              v-for="item in devGroupList"
              :key="item.uid"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>

        <div class="manage_b" style="height: 617px;">
          <div class="vl_f_333 top">
            <span>已选{{modelType !== '3' ? '设备' : '卡口'}}({{selDevOrBayNum}})</span>
          </div>
          <div class="dp_box">
            <div v-for="trackPoint in trackPointList" :key="trackPoint.tid">
              <div class="track_t" @click="dropdown(trackPoint)" :class="{'active': trackPoint.isDropdown}">
                <i class="el-icon-arrow-down" v-show="trackPoint.isDropdown"></i><i class="el-icon-arrow-right" v-show="!trackPoint.isDropdown"></i><span>{{trackPoint.trackPointName}}</span>
              </div>
              <!-- 人员追踪、车辆追踪、范围分析 -->
              <el-collapse-transition v-if="modelType !== '3'">
                <div v-show="trackPoint.isDropdown">
                  <vue-scroll>
                    <ul style="max-height: 346px;">
                      <template v-for="equ in trackPoint.devList">
                        <li :key="equ.uid" @click="devHighlight(equ)" :class="['normal', {'active': devId === equ.uid}]">
                          <span :class="{'four': modelType === '4'}">{{equ.deviceName}}<br/><span v-if="modelType === '1' || modelType === '2'" class="vl_f_666">距追踪点001 <span style="color: orange;">{{equ.distance}}km</span></span></span>
                          <div>
                            <i v-if="equ.deviceStatus" class="vl_icon vl_icon_control_05" style="margin-top: 8px;"></i>
                            <i v-else class="vl_icon vl_icon_control_32" style="margin-top: 8px;"></i>
                            <el-checkbox v-model="equ.isSelected" style="display:none;" @click.native="changeSelectedStatus(equ)"></el-checkbox>
                          </div>
                        </li>
                      </template>
                      <li v-show="trackPoint.devList.length === 0" style="padding-left: 34px;"><span>范围内无设备</span></li>
                    </ul>
                  </vue-scroll>
                </div>  
              </el-collapse-transition>
              <!-- 越界分析 -->
              <el-collapse-transition v-if="modelType === '3'">
                <div v-show="trackPoint.isDropdown">
                  <vue-scroll>
                    <ul style="max-height: 346px;">
                      <template v-for="equ in trackPoint.bayonetList">
                        <li :key="equ.uid" @click="devHighlight(equ)" :class="['normal', {'active': devId === equ.uid}]">
                          <span style="margin-top: 8px;">{{equ.bayonetName}}</span>
                          <div>
                            <i class="vl_icon vl_icon_control_05" style="margin-top: 8px;"></i>
                            <el-checkbox v-model="equ.isSelected" style="display:none;" @click.native="changeSelectedStatus(equ)"></el-checkbox>
                          </div>
                        </li>
                      </template>
                      <li v-show="trackPoint.bayonetList.length === 0" style="padding-left: 34px;"><span>范围内无卡口</span></li>
                    </ul>
                  </vue-scroll>
                </div>  
              </el-collapse-transition>
            </div>
          </div>
        </div>
      </div>
      <div class="manage_d_s_m_r">
        <div class="area top" v-if="modelType === '4'" @click="bindDraw" :class="{'active': selAreaAcitve}">
          <i class="vl_icon vl_icon_041"></i>
          <p>选中区域</p>
        </div>
        <div class="top"><i class="vl_icon vl_icon_control_23" @click="resetMap()"></i></div>
        <ul class="bottom">
          <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
          <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
        </ul>
      </div>
    </div>
    <!-- 从库中选择模态框 -->
    <div class="create_sel_dialog">
      <el-dialog
        :visible.sync="createSelDialog"
        :close-on-click-modal="false"
        width="482px"
        top="40vh"
        title="选择目标">
        <el-select v-model="targetObj" value-key="value" multiple filterable remote reserve-keyword :remote-method="repertorySel" :loading="loading" :placeholder="changeRepertorySel" style="width: 100%;margin-top: 20px;">
          <!-- 只有成员对象类型 -->
          <template v-if="surveillanceObjectDtoList.length > 0 && groups.length === 0">
            <el-option
              v-for="item in surveillanceObjectDtoList"
              :key="item.value"
              :label="item.label"
              :value="item">
              <!-- 人像 -->
              <div style="display: flex;line-height: 16px;" v-if="item.objType	=== 1">
                <img :src="item.photoUrl" alt="" style="width: 40px;height: 40px;margin-right: 10px;">
                <div>
                  <p style="font-size: 12px;">姓名：<span>{{item.label}}</span></p>
                  <p style="font-size: 12px;">证件号码：<span>{{item.idNo}}</span></p>
                </div>
              </div>
              <!-- 车像 -->
              <div style="display: flex;line-height: 16px;" v-if="item.objType	=== 2">
                <img :src="item.photoUrl" alt="" style="width: 40px;height: 40px;margin-right: 10px;">
                <div>
                  <p style="font-size: 12px;">车牌号码：<span>{{item.label}}</span></p>
                </div>
              </div>
            </el-option>
          </template>
          <!-- 只有组类型 -->
          <template v-if="groups.length > 0 && surveillanceObjectDtoList.length === 0">
            <el-option
              v-for="item in groups"
              :key="item.value"
              :label="item.label"
              :value="item">
            </el-option>
          </template>
          <!-- 成员对象、组都有 -->
          <template v-if="surveillanceObjectDtoList.length > 0 && groups.length > 0">
            <el-option
              v-for="item in groups"
              :key="item.value"
              :label="item.label"
              :value="item">
            </el-option>
            <el-option
              v-for="item in surveillanceObjectDtoList"
              :key="item.value"
              :label="item.label"
              :value="item">
              <!-- 人像 -->
              <div style="display: flex;line-height: 16px;" v-if="item.objType	=== 1">
                <img :src="item.photoUrl" alt="" style="width: 40px;height: 40px;margin-right: 10px;">
                <div>
                  <p style="font-size: 12px;">姓名：<span>{{item.label}}</span></p>
                  <p style="font-size: 12px;">证件号码：<span>{{item.idNo}}</span></p>
                </div>
              </div>
              <!-- 车像 -->
              <div style="display: flex;line-height: 16px;" v-if="item.objType	=== 2">
                <img :src="item.photoUrl" alt="" style="width: 40px;height: 40px;margin-right: 10px;">
                <div>
                  <p style="font-size: 12px;">车牌号码：<span>{{item.label}}</span></p>
                </div>
              </div>
            </el-option>
          </template>
        </el-select>
        <div slot="footer">
          <el-button @click="createSelDialog = false">取消</el-button>
          <el-button :loading="loadingBtn" type="primary" @click="seltarget">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </el-form>
</template>
<script>
import {objDeepCopy} from '@/utils/util.js';
import {getAreas, repertorySel, getVehicleByVehicleNumber, getAllBayontListByAreaId, getAllMonitorGroupList, getAllMonitorList} from '@/views/index/api/api.control.js';
import uploadPic from './uploadPic.vue';
import {mapXupuxian} from '@/config/config.js';
export default {
  components: {uploadPic},
  name: 'model',
  props: ['mapId','operateType', 'allDevData', 'modelType', 'checkList', 'modelDataOne', 'modelDataTwo', 'modelDataThree', 'modelDataFour'],
  data () {
    return {
      // 模型表单
      modelForm: {
        licenseNum: [],
        limitation: [],
        points: [
          {point: null}
        ],
      },
      licenseNumList: [],
      autoComplete: null,
      // 地图数据
      modelDevData: this.allDevData,
      map: null,
      mouseTool: null,
      selAreaAcitve: false,
      selAreaAble: false,
      selAreaCircle: [],
      trackPointData: [],
      selAreaPolygon: null,
      marker: null,
      polygon: null,//越界覆盖物
      allBayData: [],//所有卡口点位
      allBayMarker: {},//每次选择的行政区对应的卡口点标记列表集合
      lastLimitationNum: 0,
      lastSelList: [],
      // 测距
      rangingAcitve: false,
      rangingObj: null,
      // 追踪点列表数据
      pointIndex: null,
      trackPointList: [],
      type: '0',// 设备类型
      tid: null,//追踪点列表id
      devId: null,//设备列表id
      featuresId: null,//设备特性
      featuresTypeList: [
        {label: '不限', value: null},
        {label: '人脸识别', value: 1},
        {label: '结构分析', value: 2},
        {label: '车辆识别', value: 3},
        {label: '智能监控', value: 4},
        {label: '红外感光', value: 5},
        {label: '其它', value: 9}
      ],//设备特性列表
      devGroupList: [],//设备组下拉列表
      devGroupId: null,//设备组id
      scopeRadius: 20, // 范围半径
      lastScopeRadius: 20,//记录最后一次输入的范围半径
      lnglat: [], // 圆形覆盖物圆心坐标
      polygonLnglat: null, // 多边形覆盖物坐标集合
      mapClickEvent: null,
      // 从库中选择模态框参数
      targetObj: [],
      groups: [],//组列表
      surveillanceObjectDtoList: [],//成员对象列表
      createSelDialog: false,
      loading: false,
      loadingBtn: false,
      fileList: [],// 上传参数
      areaList: []//受限范围
    }
  },
  computed: {
    changeObj () {
      if (this.modelType === '1') {
        return '人员图片:（支持JPEG、JPG、PNG、每张大小不超过2M）';
      } else if (this.modelType === '2') {
        return '车辆图片:（支持JPEG、JPG、PNG、每张大小不超过2M）';
      } else {
        return '目标图片:（支持JPEG、JPG、PNG、每张大小不超过2M）';
      }
    },
    changeRepertorySel () {
      if (this.modelType === '1') {
        return '请输入姓名、证件号码、自定义组名搜索，可多选';
      } else if (this.modelType === '2') {
        return '请输入车牌号码、自定义组名搜索，可多选';
      } else {
        return '请输入车牌号、姓名、证件号码、自定义组名搜索，可多选';
      }
    },
    // 计算已选设备数量
    selDevOrBayNum () {
      if (this.modelType !== '3') {
        let devList = [];
        this.trackPointList.forEach(t => {
          t.devList.forEach(f => {
            if (f.isSelected) {
              devList.push(f);
            }
          })
        })
        return devList.length;
      } else {
        let bayList = [];
        this.trackPointList.forEach(t => {
          t.bayonetList.forEach(f => {
            if (f.isSelected) {
              bayList.push(f);
            }
          })
        })
        return bayList.length;
      }
    }
  },
  mounted () {
    console.log(this.modelType, 'this.modelType')
    if (this.modelType !== '3' && this.modelDevData && this.modelDevData.length > 0) {
      this.resetMap();
      if (this.modelType === '4') {
        this.getAllMonitorGroupList();
      }
      // 编辑、复用回填数据时
      if (this.operateType === 2 || this.operateType === 3) {
        if (this.modelDataOne && this.modelDataOne !== 1) {
          this.getModelDataOne();
        }
        if (this.modelDataTwo && this.modelDataTwo !== 1) {
          this.getModelDataTwo();
        }
        if (this.modelDataFour && this.modelDataFour !== 1) {
          this.getModelDataFour();
        }
      }
    } else {
      this.getAreas();
    }
  },
  methods: {
    // 上传方法
    uploadPicDel (fileList) {
      this.fileList = fileList;
    },
    uploadPicFileList (fileList) {
      this.fileList = fileList;
    },
    // 弹出从库中选择框
    popSel () {
      this.targetObj = [];
      this.groups = [];
      this.surveillanceObjectDtoList = [];
      this.createSelDialog = true;
    },
    // 从库中选择确定
    seltarget () {
      let groupList = [],objList = [];
      // 过滤组
      groupList = this.targetObj.filter(f => f.surveillanceObjectDtoList !== undefined);
      if (groupList.length > 0) {
        let arr = [];
        groupList.forEach(f => {
          arr = f.surveillanceObjectDtoList.map(m => {
            return {
              objType: m.objType,
              url: m.photoUrl,
              objId: m.objId
            }
          })
          this.fileList = this.fileList.concat(arr);
        })
      }
      // 过滤成员对象
      objList = this.targetObj.filter(f => f.surveillanceObjectDtoList === undefined);
      if (objList.length > 0) {
        const fileList = objList.map(m => {
          return {
            objType: m.objType,
            url: m.photoUrl,
            objId: m.value
          }
        })
        this.fileList = this.fileList.concat(fileList);
      }
      this.createSelDialog = false;
    },
    // 从库中选择
    repertorySel (query) {
      const params = {
        key: query,
        modelType: parseInt(this.modelType)
      }
      repertorySel(params).then(res => {
        if (res && res.data) {
          if (res.data.groups && res.data.groups.length > 0) {
            this.groups = res.data.groups.map((m, index) => {
              return {
                label: m.groupName,
                surveillanceObjectDtoList: m.surveillanceObjectDtoList,
                value: m.groupName + '_' + index
              }
            });
          }
          if (res.data.surveillanceObjectDtoList && res.data.surveillanceObjectDtoList.length > 0) {
            this.surveillanceObjectDtoList = res.data.surveillanceObjectDtoList.map(m => {
              return {
                label: m.objType === 1 ? m.name : m.objType === 2 ? m.vehicleNumber : '',
                value: m.objId,
                idNo: m.idNo,
                objType: m.objType,
                photoUrl: m.objType === 1 ? m.photoUrl : m.objType === 2 ? m.vehicleImagePath : '',
              }
            });
          }
        }
      })
    },
    // 验证车牌号方法
    checkPlateNumber (value) {
      let reg = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/;
      if (value && !reg.test(value)) {
        this.$message.error('请正确输入车牌号码');
        return false;
      } else {
        return true;
      }
    },
    // 验证列表的车牌号是否符合规则
    getLicenseNum () {
      this.modelForm.licenseNum.forEach((f, index) => {
        if (!this.checkPlateNumber(f)) {
          this.modelForm.licenseNum.splice(index, 1);
        }
      })
    },
    // 通过车牌号搜索车像列表
    getVehicleByVehicleNumber (query) {
      const idNo = this.Trim(query, 'g');
      const params = {
        vehicleNumber: idNo
      }
      if (idNo) {
        getVehicleByVehicleNumber(params).then(res => {
          if (res && res.data && res.data.length > 0) {
            this.licenseNumList = res.data.map(m => {
              return {
                value: m.uid,
                label: m.vehicleNumber
              }
            });
          }
        })
      }
    },
    // 清除表单验证公共方法
    reset () {
      this.$refs[this.mapId].clearValidate();
    },

    // 验证人员追踪的必填项
    validateModelOne () {
      if (this.checkList.some(s => s === '人员追踪')) {
        this.$refs[this.mapId].validate((valid) => {
          if (valid) {
            if (this.fileList.length === 0) {
              this.$emit('sendModelDataOne', null);
              this.$message.error('请上传图片！');
              return false;
            }
            const pointDtoList = this.trackPointList.map(t => {
              return {
                address: t.address,
                deviceChara: t.deviceChara,
                groupId: t .groupId,
                groupName: null,//编辑参数
                latitude: t .latitude,
                longitude: t .longitude,
                radius: t.radius,
                devList: t.devList.filter(f => (f.isSelected === true)).map(m => {
                  return {
                    deviceId: m.uid,
                    deviceName: m.equName//编辑参数
                  }
                })
              }
            });
            console.log(this.fileList, 'this.fileList')
            let fileListOne = [],fileListTwo = [],fileList = [];
            // 从库中选择的
            if (this.fileList.filter(f => f.objType !== undefined).length > 0) {
              fileListOne = this.fileList.filter(f => f.objType).map(m => {
                return {
                  objId: m.objId,
                  objType: m.objType,
                  photoUrl: m.url//编辑参数
                }
              })
            }
            //本地上传的
            if (this.fileList.filter(f => f.objType === undefined).length > 0) {
              fileListTwo = this.fileList.filter(f => !f.objType).map(m => {
                return {
                  objId: m.response.data.sysAppendixInfo.uid,
                  objType: 3,
                  photoUrl: m.response.data.sysCommonImageInfo.fileFullPath//编辑参数
                }
              })
            }
            
            fileList = [...fileListOne, ...fileListTwo];
            console.log(1111)
            const data = {
              modelType: 1,
              pointDtoList: pointDtoList,
              surveillanceObjectDtoList: fileList
            }
            this.$emit('sendModelDataOne', data);
          } else {
            this.$emit('sendModelDataOne', null);
            return false;
          }
        })
      }
    },
    // 验证车辆追踪的必填项
    validateModelTwo () {
      if (this.checkList.some(s => s === '车辆追踪')) {
        console.log('车辆追踪')
        this.$refs[this.mapId].validate((valid) => {
          if (valid) {
            if (this.fileList.length === 0) {
              this.$emit('sendModelDataTwo', null);
              this.$message.error('请上传图片！');
              return false;
            }
            const pointDtoList = this.trackPointList.map(t => {
              return {
                address: t.address,
                deviceChara: t.deviceChara,
                groupId: t .groupId,
                groupName: null,//编辑参数
                latitude: t .latitude,
                longitude: t .longitude,
                radius: t.radius,
                devList: t.devList.filter(f => (f.isSelected === true)).map(m => {
                  return {
                    deviceId: m.uid,
                    deviceName: m.equName//编辑参数
                  }
                })
              }
            });
            let fileListOne = [],fileListTwo = [],fileList = [];
            // 从库中选择的
            if (this.fileList.filter(f => f.objType !== undefined).length > 0) {
              fileListOne = this.fileList.filter(f => f.objType).map(m => {
                return {
                  objId: m.objId,
                  objType: m.objType,
                  photoUrl: m.url//编辑参数
                }
              })
            }
            //本地上传的
            if (this.fileList.filter(f => f.objType === undefined).length > 0) {
              fileListTwo = this.fileList.filter(f => !f.objType).map(m => {
                return {
                  objId: m.response.data.sysAppendixInfo.uid,
                  objType: 3,
                  photoUrl: m.response.data.sysCommonImageInfo.fileFullPath//编辑参数
                }
              })
            }
            fileList = [...fileListOne, ...fileListTwo];
            const data = {
              carNumberInfo: this.modelForm.licenseNum.join(','),
              modelType: 2,
              pointDtoList: pointDtoList,
              surveillanceObjectDtoList: fileList
            }
            this.$emit('sendModelDataTwo', data);
          } else {
            this.$emit('sendModelDataTwo', null);
            return false;
          }
        })
      }
    },
    // 验证越界分析的必填项
    validateModelThree () {
      if (this.checkList.some(s => s === '越界分析')) {
        console.log('越界分析')
        if (this.fileList.length === 0) {
          this.$emit('sendModelDataThree', null);
          this.$message.error('请上传图片！');
          return false;
        }
        const pointDtoList = this.trackPointList.map(t => {
          return {
            address: t.address,
            deviceChara: t.deviceChara,
            latitude: 0,
            longitude: 0,
            groupName: null,//编辑参数
            groupId: t.groupId,
            bayonetList: t.bayonetList.filter(f => (f.isSelected === true)).map(m => {
              return {
                bayonetId: m.uid
              }
            })
          }
        });
        let fileListOne = [],fileListTwo = [],fileList = [];
        // 从库中选择的
        if (this.fileList.filter(f => f.objType !== undefined).length > 0) {
          fileListOne = this.fileList.filter(f => f.objType).map(m => {
            return {
              objId: m.objId,
              objType: m.objType,
              photoUrl: m.url//编辑参数
            }
          })
        }
        //本地上传的
        if (this.fileList.filter(f => f.objType === undefined).length > 0) {
          fileListTwo = this.fileList.filter(f => !f.objType).map(m => {
            return {
              objId: m.response.data.sysAppendixInfo.uid,
              objType: 3,
              photoUrl: m.response.data.sysCommonImageInfo.fileFullPath//编辑参数
            }
          })
        }
        fileList = [...fileListOne, ...fileListTwo];
        const data = {
          carNumberInfo: this.modelForm.licenseNum.join(','),
          modelType: 3,
          pointDtoList: pointDtoList,
          surveillanceObjectDtoList: fileList
        }
        this.$emit('sendModelDataThree', data);
      } else {
        this.$emit('sendModelDataThree', null);
        return false;
      }
    },
    // 验证范围分析的必填项
    validateModelFour () {
      if (this.checkList.some(s => s === '范围分析')) {
        console.log('范围分析')
        if (this.fileList.length === 0) {
          this.$emit('sendModelDataFour', null);
          this.$message.error('请上传图片！');
          return false;
        }
        const pointDtoList = this.trackPointList.map(t => {
          return {
            address: t.address,
            deviceChara: t.deviceChara,
            latitude: t .latitude,
            longitude: t .longitude,
            groupName: null,//编辑参数
            groupId: t .groupId,
            devList: t.devList.filter(f => (f.isSelected === true)).map(m => {
              return {
                deviceId: m.uid,
                deviceName: m.equName//编辑参数
              }
            })
          }
        });
        let fileListOne = [],fileListTwo = [],fileList = [];
        // 从库中选择的
        if (this.fileList.filter(f => f.objType !== undefined).length > 0) {
          fileListOne = this.fileList.filter(f => f.objType).map(m => {
            return {
              objId: m.objId,
              objType: m.objType,
              photoUrl: m.url//编辑参数
            }
          })
        }
        //本地上传的
        if (this.fileList.filter(f => f.objType === undefined).length > 0) {
          fileListTwo = this.fileList.filter(f => !f.objType).map(m => {
            return {
              objId: m.response.data.sysAppendixInfo.uid,
              objType: 3,
              photoUrl: m.response.data.sysCommonImageInfo.fileFullPath//编辑参数
            }
          })
        }
        fileList = [...fileListOne, ...fileListTwo];
        const data = {
          carNumberInfo: this.modelForm.licenseNum.join(','),
          modelType: 4,
          pointDtoList: pointDtoList,
          surveillanceObjectDtoList: fileList
        }
        this.$emit('sendModelDataFour', data);
      } else {
        this.$emit('sendModelDataFour', null);
        return false;
      }
    },

    // 回填人员追踪数据
    getModelDataOne() {
      console.log(1111)
      // 回填图片
      this.fileList = this.modelDataOne.surveillanceObjectDtoList.map(m => {
        return {
          objId: m.objId,
          objType: m.objType,
          url: m.photoUrl
        }
      });
      if (this.modelDataOne.pointDtoList.length > 0) {
        // 回填追踪点表单
        this.modelForm.points = this.modelDataOne.pointDtoList.map((m) => {
          return {point: m.address};
        })
        // 回填半径
        this.scopeRadius = this.modelDataOne.pointDtoList[0].radius;
        // 回填设备特性
        this.featuresId = this.modelDataOne.pointDtoList[0].deviceChara;
        this.getAllMonitorList(1);
      }
    },
    // 回填车辆追踪数据
    getModelDataTwo() {
      console.log(2222)
      this.fileList = this.modelDataTwo.surveillanceObjectDtoList.map(m => {
        return {
          objId: m.objId,
          objType: m.objType,
          url: m.photoUrl
        }
      });
      // 回填车牌信息
      if (!this.modelDataTwo.carNumberInfo) {
        this.modelForm.licenseNum = [];
      } else if (this.modelDataTwo.carNumberInfo.includes(',')) {
        this.modelForm.licenseNum = this.modelDataTwo.carNumberInfo.split(',');
      } else {
        this.modelForm.licenseNum = [this.modelDataTwo.carNumberInfo];
      }
      if (this.modelDataTwo.pointDtoList.length > 0) {
        // 回填追踪点表单
        this.modelForm.points = this.modelDataTwo.pointDtoList.map((m) => {
          return {point: m.address};
        })
        // 回填半径
        this.scopeRadius = this.modelDataTwo.pointDtoList[0].radius;
        // 回填设备特性
        this.featuresId = this.modelDataTwo.pointDtoList[0].deviceChara;
        this.getAllMonitorList(1);
      }
    },
    // 回填越界分析数据
    getModelDataThree () {
      console.log(3333)
      this.fileList = this.modelDataThree.surveillanceObjectDtoList.map(m => {
        return {
          objId: m.objId,
          objType: m.objType,
          url: m.photoUrl
        }
      });
      // 回填车牌信息
      if (!this.modelDataThree.carNumberInfo) {
        this.modelForm.licenseNum = [];
      } else if (this.modelDataThree.carNumberInfo.includes(',')) {
        this.modelForm.licenseNum = this.modelDataThree.carNumberInfo.split(',');
      } else {
        this.modelForm.licenseNum = [this.modelDataThree.carNumberInfo];
      }
      if (this.modelDataThree.pointDtoList.length > 0) {
        // 回填越界分析的受限范围
        this.modelForm.limitation = this.modelDataThree.pointDtoList.map(m => {
          return this.areaList.find(f => f.label === m.address);
        });
        // 回填设备特性
        this.featuresId = this.modelDataThree.pointDtoList[0].deviceChara;
        let _data = [];
            _data = this.modelDataThree.pointDtoList.map(m => {
              return {
                area: this.areaList.find(f => f.label === m.address),
                bayonetList: m.bayonetList
              }
            })
            _data.forEach(f => {
              // 回填受限范围
              this.getAllBayontListByAreaId(f.area, f.bayonetList);
            })
          this.lastSelList = this.modelForm.limitation;
          this.lastLimitationNum = this.modelForm.limitation.length;
      }
    },
    // 回填范围分析数据
    getModelDataFour () {
      console.log(4444)
      this.fileList = this.modelDataFour.surveillanceObjectDtoList.map(m => {
        return {
          objId: m.objId,
          objType: m.objType,
          url: m.photoUrl
        }
      });
      // 回填车牌信息
      if (!this.modelDataFour.carNumberInfo) {
        this.modelForm.licenseNum = [];
      } else if (this.modelDataFour.carNumberInfo.includes(',')) {
        this.modelForm.licenseNum = this.modelDataFour.carNumberInfo.split(',');
      } else {
        this.modelForm.licenseNum = [this.modelDataFour.carNumberInfo];
      }
      if (this.modelDataFour.pointDtoList.length > 0) {
        // 回填设备组
        this.devGroupId = this.modelDataFour.pointDtoList[0].groupId;
        this.getAllMonitorList(1);
      }
    },
    // 获得坐标列表公共方法
    getLngLatList (data) {
      let one = data.latitude.split(',');
      let two = data.longitude.split(',');
      let arr = [];
      for (let i = 0; i < one.length; i++) {
        arr.push(new window.AMap.LngLat(two[i], one[i]));
      }
      return arr;
    },
    // 地图缩放
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    // 初始化地图
    resetMap () {
      // 共有部分
      let _this = this, _hoverWindow = null;
      let map = new window.AMap.Map(_this.mapId, {
        zoom: 10,
        center: mapXupuxian.center
      });
      map.setMapStyle('amap://styles/whitesmoke');
      map.plugin('AMap.Autocomplete', () => {
        let autoOptions = {
          city: '溆浦县'
        }
        _this.autoComplete = new window.AMap.Autocomplete(autoOptions);
      })
      _this.map = map;
      if (_this.modelType !== '3') {
        map.on('mouseover', function() {
          let   _sContent = `<div class="vl_map_hover">
            <div class="vl_map_hover_main">`
            if (_this.modelType === '1' || _this.modelType === '2') {
              _sContent += `<ul><li>输入追踪点后可以改变范围半径大小</li></ul>`;
            } else if (_this.modelType === '4') {
              _sContent += `<ul><li>单击选择范围，双击完成</li></ul>`;
            }
            _sContent += `</div></div>`;
          _hoverWindow = new window.AMap.InfoWindow({
            isCustom: true,
            closeWhenClickMap: true,
            offset: new window.AMap.Pixel(40, 40), // 相对于基点的偏移位置
            content: _sContent
          });
          _hoverWindow.open(_this.map, new window.AMap.LngLat(112.97503, 28.09358));
        })
        map.on('mouseout', function() {
          if (_hoverWindow) { _hoverWindow.close(); }
        })
        if (_this.operateType === 1 || (_this.modelType === '1' && (!_this.modelDataOne || _this.modelDataOne === 1)) || (_this.modelType === '2' && (!_this.modelDataTwo || _this.modelDataTwo === 1)) || (_this.modelType === '4' && (!_this.modelDataFour || _this.modelDataFour === 1))) {
          _this.mapMark(_this.modelDevData);
        }
        _this.trackPointList = [];
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
      })
    },
    // 地图标记 data:摄像头数据/卡口数据
    mapMark (data, selBayList, type) {
      let _this = this, _hoverWindow = null, areaName = null, markerList = [];
      // 卡口
      if (data.length > 0 && data[0].type === 2) {
        if (selBayList) {
          if (selBayList instanceof Array) {
            areaName = _this.modelForm.limitation[_this.modelForm.limitation.length - 1].label;
          } else {
            areaName = selBayList.label;
          }
        }
        _this.allBayMarker[areaName] = [];
      }
      // 遍历列表，摄像头 或者卡口
      for (let i = 0; i < data.length; i++) {
        let offSet = [-20.5, -48];
        let _obj = data[i];
        if (_obj.longitude > 0 && _obj.latitude > 0) {
          let _content = null;
          // 摄像头
          if (_obj.type === 1) {
            if (_obj.deviceStatus && _obj.isSelected) {
              _content = '<div id="' + _obj.uid + '_sxt' + '" class="vl_icon vl_icon_sxt"></div>';
            } else if (_obj.deviceStatus && !_obj.isSelected) {
              _content = '<div id="' + _obj.uid + '_sxt' + '" class="vl_icon vl_icon_sxt_uncheck"></div>';
            } else if (!_obj.deviceStatus && _obj.isSelected) {
              _content = '<div id="' + _obj.uid + '_sxt' + '" class="vl_icon vl_icon_sxt_not_choose"></div>';
            } else if (!_obj.deviceStatus && !_obj.isSelected) {
              _content = '<div id="' + _obj.uid + '_sxt' + '" class="vl_icon vl_icon_sxt_uncheck"></div>';
            }
          // 卡口
          } else {
            if (_obj.isSelected) {
              _content = '<div id="' + _obj.uid + '_kk' + '" class="vl_icon vl_icon_kk"></div>';
            } else {
              _content = '<div id="' + _obj.uid + '_kk' + '" class="vl_icon vl_icon_kk_uncheck"></div>';
            }
          }
          let _marker = new window.AMap.Marker({ // 添加自定义点标记
            map: _this.map,
            position: [_obj.longitude, _obj.latitude],
            offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: _obj,
            // 自定义点标记覆盖物内容
            content: _content
          });
          // mouseover
          _marker.on('mouseover', function () {
            let _sContent = `<div class="vl_map_hover">
              <div class="vl_map_hover_main"><ul>`;
              if (_obj.type === 1) {
                _sContent += `<li><span>设备名称：</span><span>${_obj.deviceName}</span></li>
                <li><span>设备地址：</span><span>${_obj.address}</span></li>`;
              } else {
                _sContent += `<li><span>卡口名称：</span><span>${_obj.bayonetName}</span></li>
                <li><span>卡口地址：</span><span>${_obj.bayonetAddress}</span></li>`;
              }
              _sContent += '</ul></div>';
            _hoverWindow = new window.AMap.InfoWindow({
              isCustom: true,
              closeWhenClickMap: true,
              offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
              content: _sContent
            });
            _hoverWindow.open(_this.map, new window.AMap.LngLat(_obj.longitude, _obj.latitude));
            _this.devId = _obj.uid;
            $(`#${_this.mapId} .vl_icon_control_37`).removeClass('vl_icon_control_37');
            let objIsSel = null;
            // 卡口
            if (_this.modelType === '3') {
              if ($(`#${_this.mapId} #${_obj.uid}_kk`).hasClass('vl_icon_control_36') || $(`#${_this.mapId} #${_obj.uid}_kk`).hasClass('vl_icon_control_35')) {
                return;
              } 
              $(`#${_this.mapId} .vl_icon_control_36`).removeClass('vl_icon_control_36');
              $(`#${_this.mapId} .vl_icon_control_35`).removeClass('vl_icon_control_35');
              _this.trackPointList.forEach(f => {
                f.bayonetList.forEach(d => {
                  if (_obj.uid === d.uid) {
                    objIsSel = d.isSelected;
                  }
                })
              })
              if (objIsSel) {
                $(`#${_this.mapId} #${_obj.uid}_kk`).addClass('vl_icon_control_36');
              } else {
                $(`#${_this.mapId} #${_obj.uid}_kk`).addClass('vl_icon_control_35');
              }
            // 设备
            } else {
              if ($(`#${_this.mapId} #${_obj.uid}_sxt`).hasClass('vl_icon_control_36') || $(`#${_this.mapId} #${_obj.uid}_sxt`).hasClass('vl_icon_control_34')) {
                return;
              } 
              $(`#${_this.mapId} .vl_icon_control_36`).removeClass('vl_icon_control_36');
              $(`#${_this.mapId} .vl_icon_control_34`).removeClass('vl_icon_control_34');
              _this.trackPointList.forEach(f => {
                f.devList.forEach(d => {
                  if (_obj.uid === d.uid) {
                    objIsSel = d.isSelected;
                  }
                })
              })
              if (objIsSel) {
                $(`#${_this.mapId} #${_obj.uid}_sxt`).addClass('vl_icon_control_36');
              } else {
                $(`#${_this.mapId} #${_obj.uid}_sxt`).addClass('vl_icon_control_34');
              }
            }
          });
          // click
          _marker.on('click', function () {
            // 判断当前点标记是否在圆形覆盖物之内，只有在范围之内才能点击切换选中状态
            // 摄像头
            if (_obj.type === 1) {
              const isClick = _this.trackPointList.some(f => {
                return f.devList.some(d => d.uid === _obj.uid);
              })
              if (isClick) {
                _this.devId = _obj.uid;//点击设备marker,使其在设备列表背景颜色高亮
                // 切换设备列表中设备的选择状态
                _this.trackPointList.forEach(f => {
                  f.devList.forEach(d => {
                    if (d.uid === _obj.uid) {
                      d.isSelected = !d.isSelected;
                      _this.changeSelectedStatus(d);
                    }
                  })
                })
              }
            // 卡口
            } else {
              const isClick = _this.trackPointList.some(f => {
                return f.bayonetList.some(d => d.uid === _obj.uid);
              })
              if (isClick) {
                _this.devId = _obj.uid;//点击设备marker,使其在设备列表背景颜色高亮
                // 切换设备列表中设备的选择状态
                _this.trackPointList.forEach(f => {
                  f.bayonetList.forEach(d => {
                    if (d.uid === _obj.uid) {
                      d.isSelected = !d.isSelected;
                      _this.changeSelectedStatus(d); 
                    }
                  })
                })
              }
            }
          })
          // 卡口
          if (_obj.type === 2) {
            _this.allBayMarker[areaName].push(_marker);
          }
          markerList.push(_marker);
        }
      }
      if ((_this.operateType === 2 || _this.operateType === 3) && type) {
       
        if (_this.modelType === '1') {
          _this.modelDataOne.pointDtoList.forEach((m, index) => {
            // 回填追踪点列表
            _this.markLocation(m.longitude, m.latitude, m.address, index, m.devList)
          })
        }
        if (_this.modelType === '2') {
          _this.modelDataTwo.pointDtoList.forEach((m, index) => {
            // 回填追踪点列表
            _this.markLocation(m.longitude, m.latitude, m.address, index, m.devList)
          })
        }
        if (_this.modelType === '4') {
          _this.modelDataFour.pointDtoList.forEach((f) => {
            // 回填范围分析
            let polygon = new window.AMap.Polygon({
              map: _this.map,
              strokeColor: '#FA453A',
              strokeOpacity: 1,
              strokeWeight: 1,
              fillColor: '#FA453A',
              fillOpacity: 0.2, 
              path: _this.getLngLatList(f),
              zIndex: 12
            });
            // 移入覆盖物生成删除小图标
            let offSet = [-10, -10], _marker = null;
            polygon.on('mouseover', function(e) {
              // if (_this.trackPointList.length === 1) return;//只有一个追踪点时，不生成删除小图标
              if (_marker) return;
              _marker = new window.AMap.Marker({ // 添加自定义点标记
                map: _this.map,
                position: [e.lnglat.lng, e.lnglat.lat],
                offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
                draggable: false, // 是否可拖动
                extData: '',
                // 自定义点标记覆盖物内容
                content: `<div class="el-icon-error" style="font-size: 20px; color: red;"></div>`
              });
              // 点击小图标移除覆盖物和删除小图标
              _marker.on('click', function() {
                _this.map.remove(polygon);
                _this.map.remove(_marker);
                // 移除覆盖物内对应的设备
                const delObjIndex = _this.trackPointList.findIndex(p => p.latitude == f.latitude && p.longitude == f.longitude);
                console.log(_this.trackPointList)
                _this.trackPointList.splice(delObjIndex, 1);
              })
              _marker.setMap(_this.map);
            })
            polygon.on('mouseout', function() {
              // if (_this.trackPointList.length === 1) return;//只有一个追踪点时，不生成删除小图标
              setTimeout(() => {
                _this.map.remove(_marker);//移除删除小图标
                _marker = null;
              }, 100)
            })
            _this.polygonLnglat = _this.getLngLatList(f);
            if (_this.polygonLnglat) {
              _this.getScopeEquList(polygon, f.devList);
            }
          })
        }
      }
      _this.map.add(markerList);
      _this.map.setFitView();
    },
    // 点击设备列表的多选框切换marker的在圆形覆盖物的选中状态的公共方法
    changeSelectedStatus (_obj, type) {
      console.log(_obj, '_obj')
      let devDom = null;
      setTimeout(() => {
        if (this.modelType === '3') {
          // 操作左侧列表其中一个设备，让列表相同id的设备同时联动，选中或未选中
          this.trackPointList.forEach(f => {
            f.bayonetList.forEach(d => {
              if (d.uid === _obj.uid) {
                d.isSelected = _obj.isSelected
              }
            })
          })
          devDom = $(`#${this.mapId} #${_obj.uid}_kk`);
        } else {
          // 操作左侧列表其中一个设备，让列表相同id的设备同时联动，选中或未选中
          this.trackPointList.forEach(f => {
            f.devList.forEach(d => {
              if (d.uid === _obj.uid) {
                d.isSelected = _obj.isSelected
              }
            })
          })
          devDom = $(`#${this.mapId} #${_obj.uid}_sxt`);
        }
        // 摄像头
        if (_obj.type === 1) {
          if (_obj.deviceStatus && !_obj.isSelected) {
            devDom.removeClass('vl_icon_sxt');
            devDom.addClass('vl_icon_sxt_uncheck');
            devDom.removeClass('vl_icon_control_36');
            if (type === undefined) {
              devDom.addClass('vl_icon_control_34');
            }
          } else if (_obj.deviceStatus && _obj.isSelected) {
            devDom.removeClass('vl_icon_sxt_uncheck');
            devDom.addClass('vl_icon_sxt');
            devDom.removeClass('vl_icon_control_34');
            if (type === undefined) {
              devDom.addClass('vl_icon_control_36');
            }
          } else if (!_obj.deviceStatus && !_obj.isSelected) {
            devDom.removeClass('vl_icon_sxt_not_choose');
            devDom.addClass('vl_icon_sxt_uncheck');
          } else if (!_obj.deviceStatus && _obj.isSelected) {
            devDom.removeClass('vl_icon_sxt_uncheck');
            devDom.addClass('vl_icon_sxt_not_choose');
          }
        // 卡口
        } else {
          if (_obj.isSelected) {
            devDom.removeClass('vl_icon_kk_uncheck');
            devDom.addClass('vl_icon_kk');
            devDom.removeClass('vl_icon_control_35');
            if (type === undefined) {
              devDom.addClass('vl_icon_control_36');
            }
          } else {
            devDom.removeClass('vl_icon_kk');
            devDom.addClass('vl_icon_kk_uncheck');
            devDom.removeClass('vl_icon_control_36');
            if (type === undefined) {
              devDom.addClass('vl_icon_control_35');
            }
          }
        }
      }, 50)
    },
    // 点击左侧列表置为选中,弹出气泡
    devHighlight (_obj) {
      let _this = this;
      _this.devId = _obj.uid;
      let _hoverWindow = null;
      let _sContent = `<div class="vl_map_hover">
      <div class="vl_map_hover_main"><ul>`;
      if (_obj.type === 1) {
        _sContent += `<li><span>设备名称：</span><span>${_obj.deviceName}</span></li>
        <li><span>设备地址：</span><span>${_obj.address}</span></li>`;
      } else {
        _sContent += `<li><span>卡口名称：</span><span>${_obj.bayonetName}</span></li>
        <li><span>卡口地址：</span><span>${_obj.bayonetAddress}</span></li>`;
      }
      _sContent += '</ul></div>';
      _hoverWindow = new window.AMap.InfoWindow({
        isCustom: true,
        closeWhenClickMap: true,
        offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
        content: _sContent
      });
      _hoverWindow.open(_this.map, new window.AMap.LngLat(_obj.longitude, _obj.latitude));
      $(`#${_this.mapId} .vl_icon_control_37`).removeClass('vl_icon_control_37');
      if (_this.modelType === '3') {
        $(`#${_this.mapId} .vl_icon_control_36`).removeClass('vl_icon_control_36');
        $(`#${_this.mapId} .vl_icon_control_35`).removeClass('vl_icon_control_35');
        if (_obj.isSelected) {
          $(`#${_this.mapId} #${_obj.uid}_kk`).addClass('vl_icon_control_36');
        } else {
          $(`#${_this.mapId} #${_obj.uid}_kk`).addClass('vl_icon_control_35');
        }
      } else {
        $(`#${_this.mapId} .vl_icon_control_36`).removeClass('vl_icon_control_36');
        $(`#${_this.mapId} .vl_icon_control_34`).removeClass('vl_icon_control_34');
        if (_obj.isSelected) {
          $(`#${_this.mapId} #${_obj.uid}_sxt`).addClass('vl_icon_control_36');
        } else {
          $(`#${_this.mapId} #${_obj.uid}_sxt`).addClass('vl_icon_control_34');
        }
      }
    },
    // 获取所有监控设备列表,初始化地图
    getAllMonitorList (type) {
      const params = {
        ccode: mapXupuxian.adcode,
        intelligentCharac: this.featuresId,// 设备特性id
        groupId: this.devGroupId// 设备组id
      }
      getAllMonitorList(params).then(res => {
        if (res && res.data) {
          this.modelDevData = res.data;
          this.modelDevData.forEach(f => {
            this.$set(f, 'isSelected', false);
            this.$set(f, 'type', 1);
          });
          if (!type) {
            this.modelForm.points = [{point: null}];
          }
          if (this.modelType === '1' || this.modelType === '2') {
            this.selAreaCircle = [];
            this.trackPointData = [];
          }
          this.trackPointList = [];
          this.map.clearMap();
          this.mapMark(this.modelDevData, null, type);
        }
      })
    },
    /******************************* 人员、车辆追踪方法start **************************/
    autoAdress (queryString, cb) {
      if (queryString === '') {
        cb([])
      } else {
        this.autoComplete.search(queryString, (status, result) => {
          if (status === 'complete') {
            console.log(result.tips, 'result.tips')
            cb(result.tips);
          } else {
            cb([]);
          }
        })
      }
    },
    // 获取追踪点
    chooseAddress (e) {
      console.log(e);
      this.markLocation(e.location.lng, e.location.lat, e.address, this.pointIndex);
    },
     // 添加追踪点
    addPoint () {
      if (this.modelForm.points.length === 10) {
        this.$message.error('最多10个追踪点！');
        return false;
      }
      this.modelForm.points.push({
        point: null
      })
    },
    // 删除追踪点
    removePoint(item) {
      let _this = this;
      let index = _this.modelForm.points.indexOf(item)
      if (index !== -1) {
        // 移除追踪点input
        _this.modelForm.points.splice(index, 1)
      }
    
      
      let circleObj = _this.selAreaCircle.find(f => f.index === index);
      let circle = circleObj ? circleObj._circle : '';
      // 移除圆形覆盖物
      if (circle) {
        _this.map.remove(circle);
        _this.selAreaCircle = _this.selAreaCircle.filter(f => f.index !== index);
        // 移除完后重新排序
        _this.selAreaCircle.forEach((f, index) => {
          f.index = index;
        })
      }

      // 移除追踪点的点标记
      const delMakerObjIndex = _this.trackPointData.findIndex(f => f.marker.C.position.lat == circle.C.center.lat && f.marker.C.position.lng == circle.C.center.lng);
      if (delMakerObjIndex !== -1) {
        console.log('qqqqqqqqqqqqqqqqq')
        const delMakerObj = _this.trackPointData.splice(delMakerObjIndex, 1);
        _this.map.remove(delMakerObj[0].marker);
        // 删除后重新排序
        _this.trackPointData.forEach((f, index) => {
          f.index = index;
        })
      }
     

      const delEquIndex = _this.trackPointList.findIndex(p => p.latitude == circle.C.center.lat && p.longitude == circle.C.center.lng);
      if (delEquIndex !== -1) {
        // 移除追踪点左侧的列表数据
        const _obj = _this.trackPointList.splice(delEquIndex, 1);
        // 移除完后重新排序
        _this.trackPointList.forEach((f, index) => {
          f.tid = index;
          f.trackPointName = '追踪点00' + (index + 1);
          f.address = _this.modelForm.points[index].point;
        })
        // 覆盖物中还有追踪点时不能把里面设备全部置为未选中
        if (_this.selAreaCircle.findIndex(f => f._circle.C.center.lat == circle.C.center.lat && f._circle.C.center.lng == circle.C.center.lng) === -1) {
          // 把覆盖物内的设备置为未选中
          _obj[0].devList.forEach(f => {
            if (f.isSelected) {
              f.isSelected = !f.isSelected;
              _this.changeSelectedStatus(f, 1);
            }
          })
        }

      }
     
      
    },
    // 输入追踪点定位圆形覆盖物的中心点，并生产追踪点的点标记
    markLocation(lng, lat, address, index, resDevList) {
      let _this = this;
      let circleObj = _this.selAreaCircle.find(f => f.index === index);
      let circle = circleObj ? circleObj._circle : '';
      console.log(circle, 'circlecircle')
      if (circle) {
        // 移除圆形覆盖物
        _this.map.remove(circle);
        _this.selAreaCircle = _this.selAreaCircle.filter(f => f.index !== index);
        // 移除左侧追踪点列表数据
        const delObjIndex = _this.trackPointList.findIndex(p => p.tid === index);
        const _obj = _this.trackPointList.splice(delObjIndex, 1);
        // 覆盖物中还有追踪点时不能把里面设备全部置为未选中
        if (_this.selAreaCircle.findIndex(f => f._circle.C.center.lat == circle.C.center.lat && f._circle.C.center.lng == circle.C.center.lng) === -1) {
          // 把覆盖物内的设备置为未选中
          _obj[0].devList.forEach(f => {
            if (f.isSelected) {
              f.isSelected = !f.isSelected;
              _this.changeSelectedStatus(f, 1);
            }
          })
        }
        // 清空上一次输入的追踪点产生的marker
        const _index = _this.trackPointData.findIndex(f => f.index === index);
        if (_index !== -1) {
          _this.map.remove(_this.trackPointData[_index].marker);
          _this.trackPointData.splice(_index, 1);
          console.log(index, 'index')
          console.log(_index, '_index')
        }
      }
     
      // 追踪点标记
      let offSet = [-20.5, -48], _hoverWindow = null, pointId = index + address, marker = null;
      if (lng > 0 && lat > 0) {
        marker = new window.AMap.Marker({ // 添加自定义点标记
          map: _this.map,
          position: [lng, lat],
          offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          extData: '',
          // 自定义点标记覆盖物内容
          content: `<div id="${pointId}" class="vl_icon vl_icon_zzd"></div>`
        });
        // mouseover
        marker.on('mouseover', function () {
          let _sContent = `<div class="vl_map_hover">
            <div class="vl_map_hover_main"><ul>
              <li><span>追踪点地址：</span><span>${address}</span></li>
            </ul></div>`;
          _hoverWindow = new window.AMap.InfoWindow({
            isCustom: true,
            closeWhenClickMap: true,
            offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
            content: _sContent
          });
          _hoverWindow.open(_this.map, new window.AMap.LngLat(lng, lat));
          console.log(_this.trackPointList)

          _this.devId = null;
          $(`#${_this.mapId} .vl_icon_control_36`).removeClass('vl_icon_control_36');
          $(`#${_this.mapId} .vl_icon_control_37`).removeClass('vl_icon_control_37');
          $(`#${_this.mapId} .vl_icon_control_34`).removeClass('vl_icon_control_34');
          $(`#${_this.mapId} .vl_icon_control_35`).removeClass('vl_icon_control_35');
          $('#' + pointId).addClass('vl_icon_control_37');

          // 展开追踪点的设备列表
          _this.trackPointList.forEach(f => f.isDropdown = false);//首先全置为false
          const obj = _this.trackPointList.find(f => f.address === address);
          if (obj) {
            _this.tid = obj.tid;
            obj.isDropdown = true;
          }
        });
        marker.setMap(_this.map);
        _this.trackPointData.splice(index, 0, {marker, index});
        console.log(_this.trackPointData, '_this.trackPointData')
        _this.lnglat = [lng, lat];
        _this.map.setCenter([lng, lat]);
        // 画圆形覆盖物
        _this.mapCircle(index, resDevList)
      }
    },
    // 标记地图范围，圆形覆盖物
    mapCircle (index, resDevList) {
      console.log(11111,'1111')
      let _this = this;
      let _circle = new window.AMap.Circle({
        center: new window.AMap.LngLat(_this.lnglat[0], _this.lnglat[1]), // 圆心位置
        radius: _this.scopeRadius * 100,  //半径
        strokeColor: "#F33",  //线颜色
        strokeOpacity: 1,  //线透明度
        strokeWeight: 3,  //线粗细度
        fillColor: "#ee2200",  //填充颜色
        fillOpacity: 0.35 //填充透明度
      })
      // 移入覆盖物生成删除小图标
      let offSet = [0, 0], _marker = null;
      _circle.on('mouseover', function(e) {
        console.log(e, 'eee')
        if (_this.trackPointList.length === 1) return;//只有一个追踪点时，不生成删除小图标
        if (_marker) return;
        _marker = new window.AMap.Marker({ // 添加自定义点标记
          map: _this.map,
          position: [e.lnglat.lng, e.lnglat.lat],
          offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          extData: '',
          // 自定义点标记覆盖物内容
          content: `<div class="el-icon-error" style="font-size: 20px; color: red;"></div>`
        });
        // 点击小图标移除覆盖物和删除小图标
        _marker.on('click', function() {
          _this.map.remove(_marker);//移除删除小图标
          // 移除圆形覆盖物
          _this.map.remove(_circle);
          const _index = _this.selAreaCircle.findIndex(f => f._circle.C.center.lat == e.target.C.center.lat && f._circle.C.center.lng == e.target.C.center.lng)
          _this.selAreaCircle = _this.selAreaCircle.filter(f => f.index !== _index);
          // 删除完后重新排序
          _this.selAreaCircle.forEach((f, index) => {
            f.index = index;
          })

          // 移除追踪点的点标记
          const delMakerObjIndex = _this.trackPointData.findIndex(f => f.marker.C.position.lat == e.target.C.center.lat && f.marker.C.position.lng == e.target.C.center.lng);
          if (delMakerObjIndex !== -1) {
            const delMakerObj = _this.trackPointData.splice(delMakerObjIndex, 1);
            _this.map.remove(delMakerObj[0].marker);
            // 删除后重新排序
            _this.trackPointData.forEach((f, index) => {
              f.index = index;
            })
          }
         
          // 移除左侧追踪点列表数据
          const delObjIndex = _this.trackPointList.findIndex(p => p.latitude == e.target.C.center.lat && p.longitude == e.target.C.center.lng);
          const _obj = _this.trackPointList.splice(delObjIndex, 1);
          // 删除完后重新排序
          _this.trackPointList.forEach((f, index) => {
            f.tid = index;
            f.trackPointName = '追踪点00' + (index + 1);
            f.address = _this.modelForm.points[index].point;
          })

          _this.modelForm.points.splice(delObjIndex, 1);//删除对应的追踪点input
         
          // 覆盖物中还有追踪点时不能把里面设备全部置为未选中
          if (_this.selAreaCircle.findIndex(f => f._circle.C.center.lat == e.target.C.center.lat && f._circle.C.center.lng == e.target.C.center.lng) === -1) {
            // 把覆盖物内的设备置为未选中
            _obj[0].devList.forEach(f => {
              if (f.isSelected) {
                f.isSelected = !f.isSelected;
                _this.changeSelectedStatus(f, 1);
              }
            })
          }
        })
        _marker.setMap(_this.map);
      })
      _circle.on('mouseout', function(e) {
        if (_this.trackPointList.length === 1) return;//只有一个追踪点时，不生成删除小图标
        setTimeout(() => {
          if (_circle && _circle.contains(new window.AMap.LngLat(e.lnglat.lng, e.lnglat.lat))) {
            return;
          }
          _this.map.remove(_marker);//移除删除小图标
          _marker = null;
        }, 100)
      })
      _this.getTraceEquList(_circle, resDevList, index);
      _this.selAreaCircle.splice(index, 0, {_circle, index});
      _circle.setMap(_this.map);
    },
    // 获得人员追踪、车辆追踪内的设备列表数据
    getTraceEquList (graphics, resDevList, index) {
      let _this = this;
      let data = objDeepCopy(_this.modelDevData);
      console.log(data, 'data')
      let obj = {
        tid: index, 
        trackPointName: '追踪点00' + (index + 1),
        address: _this.modelForm.points[index].point,
        deviceChara: _this.featuresId,//设备特性
        longitude: _this.lnglat[0],//追踪点经度
        latitude: _this.lnglat[1],//追踪点纬度
        radius: _this.scopeRadius,//范围半径
        groupId: 1,//设备组id,随便传个
        devList: []//设备列表
      }
      // 把在圆形覆盖物范围之内的追踪点添加进来
      if (_this.lnglat[0] > 0 && _this.lnglat[1] > 0) {
        if (graphics && graphics.contains(new window.AMap.LngLat(_this.lnglat[0], _this.lnglat[1]))) {
          // 在圆形之中
          _this.$set(obj, 'isDropdown', false);
          _this.trackPointList.splice(index, 0, obj);
          console.log(1111111111111111111)
        }
      }
      console.log(_this.trackPointList, '_this.trackPointList_this.trackPointList')
      const _index = _this.trackPointList.indexOf(obj);
      _this.trackPointList[_index].devList = [];
      // 把在圆形覆盖物范围之内的设备添加进来
      for (let s = 0; s < data.length; s++) {
        let _obj = data[s];
        if (_obj.longitude > 0 && _obj.latitude > 0) {
          if (graphics && graphics.contains(new window.AMap.LngLat(_obj.longitude, _obj.latitude))) {
            // 在圆形之中
            setTimeout(() => {
              //在覆盖物内的置为选中-图标
              const devDom = $(`#${_this.mapId} #${_obj.uid}_sxt`);
              // 回填时
              if (resDevList !== undefined) {
                if (resDevList.some(s => s.deviceId === _obj.uid)) {
                  _obj.isSelected = true;//在覆盖物内的置为选中-多选框
                  // 摄像头
                  if (_obj.deviceStatus) {
                    console.log(devDom, 'devDom')
                    devDom.removeClass('vl_icon_control_34');
                    devDom.removeClass('vl_icon_sxt_uncheck');
                    devDom.addClass('vl_icon_sxt');
                  } else if (!_obj.deviceStatus) {
                    devDom.removeClass('vl_icon_sxt_uncheck');
                    devDom.addClass('vl_icon_sxt_not_choose');
                  }
                }
              // 新增时
              } else {
                _obj.isSelected = true;//在覆盖物内的置为选中-多选框
                // 摄像头
                if (_obj.deviceStatus) {
                  devDom.removeClass('vl_icon_control_34');
                  devDom.removeClass('vl_icon_sxt_uncheck');
                  devDom.addClass('vl_icon_sxt');
                } else if (!_obj.deviceStatus) {
                  devDom.removeClass('vl_icon_sxt_uncheck');
                  devDom.addClass('vl_icon_sxt_not_choose');
                }
              }
              // 计算追踪点到设备的距离km
              const p1 = [_obj.longitude, _obj.latitude];
              const distance = window.AMap.GeometryUtil.distance(_this.lnglat, p1);
              _obj.distance = parseFloat((distance / 1000).toFixed(1));
              _this.trackPointList[_index].devList.push(_obj);
            }, 10)
          }
        }
      }
      // 左边设备列表从近到远排序
      setTimeout(() => {
        _this.trackPointList[_index].devList.sort((x, y) => {
          return x.distance - y.distance;
        })
      }, 20)
      
    },
    // 设备圆形覆盖物半径
    setCircleRadius () {
      // 只有在输入的半径有变化时才会执行下去
      if (this.scopeRadius === this.lastScopeRadius) {
        return;
      }
      this.lastScopeRadius = this.scopeRadius;
      if (this.lnglat.length === 0) {
        this.$message.error('请输入追踪点');
        return;
      }
      if (this.scopeRadius < 0) {
        this.$message.error('半径为正数');
        return;
      } else if (this.scopeRadius > 20) {
        this.$message.error('半径不可超过20千米');
        return;
      }
      this.trackPointList = [];
      let selAreaData = this.map.getAllOverlays('circle');//获得所有的圆形覆盖物
      // 遍历设置每个圆形覆盖物的半径
      selAreaData.forEach((f, index) => {
        // 先把圆形覆盖物内的设备点标记置为未选中状态
        this.modelDevData.forEach(obj => {
          if (f && f.contains(new window.AMap.LngLat(obj.longitude, obj.latitude))) {
            const devDom = $(`#${this.mapId} #${obj.uid}_sxt`);
            devDom.addClass('vl_icon_sxt_uncheck');
            devDom.removeClass('vl_icon_sxt');
          }
        })
        f.setRadius(parseInt(this.scopeRadius) * 100);//设置半径
        this.lnglat = [f.getCenter().lng, f.getCenter().lat];//重新获取追踪点坐标
        this.getTraceEquList(f, undefined, index);//重新获取圆形覆盖物内的设备
      })
     
    },
    /******************************* 人员、车辆追踪方法end ****************************/

    /******************************* 越界分析方法start **************************/
    // 获取所有行政区列表
    getAreas () {
      const params = {
        parentUid: mapXupuxian.adcode
      }
      getAreas(params).then(res => {
        if (res && res.data) {
          this.areaList = res.data.map(m => {
            return {
              value: m.uid,
              label: m.cname
            }
          });
          this.resetMap();
          // 编辑、复用回填数据时
          if (this.operateType === 2 || this.operateType === 3) {
            if (this.modelDataThree && this.modelDataThree !== 1 && this.areaList.length > 0) {
              this.getModelDataThree();
            }
          }
        }
      })
    },
    // 删除单个受限范围时，同时删除已选卡口列表和点标记
    removeTag (item) {
      this.allBayData = [];
      const trackPointIndex = this.trackPointList.findIndex(f => f.address === item.label);
      console.log(this.allBayMarker)
      this.trackPointList.splice(trackPointIndex, 1);
      // 移除单个行政区对应的点标记列表
      if (Object.keys(this.allBayMarker).length > 0) {
        this.map.remove(this.allBayMarker[item.label]);
      }
    },
    // 通过行政区id获取所有卡口列表
    getAllBayontListByAreaId (selBayList, resBayList) {
      let params = {};
      // 新增时
      if (selBayList instanceof Array) {
        if (this.modelForm.limitation.length < this.lastLimitationNum) {
          this.lastLimitationNum = this.modelForm.limitation.length;
          this.lastSelList.forEach(s => {
            if (selBayList.indexOf(s) === -1) {
              this.removeTag(s);
            }
          })
          this.lastSelList = selBayList;
          return;
        }
        this.lastLimitationNum = this.modelForm.limitation.length;
        this.lastSelList = selBayList;
        params = {
          areaId: this.modelForm.limitation[this.modelForm.limitation.length - 1].value
        }
      // 修改回填时
      } else {
        params = {
          areaId: selBayList.value
        }
      }
      getAllBayontListByAreaId(params).then(res => {
        if (res && res.data) {
          this.allBayData = res.data;
          this.allBayData.forEach(f => {
            this.$set(f, 'isSelected', false);
            this.$set(f, 'type', 2);
          });
          this.mapMark(this.allBayData, selBayList);
          this.getBoundaryBayonetList(selBayList, resBayList);
        }
      })
    },
    // 获得越界分析卡口列表数据
    getBoundaryBayonetList (selBayList, resBayList) {
      let _this = this;
      let data = objDeepCopy(_this.allBayData);
      let obj = {
        tid: _this.trackPointList.length + 1, 
        deviceChara: 1,//设备特性
        groupId: 1,//设备组id,随便传个
        bayonetList: []//设备列表
      }
      if (selBayList instanceof Array) {
        obj.trackPointName = _this.modelForm.limitation[this.modelForm.limitation.length - 1].label;
        obj.address = _this.modelForm.limitation[this.modelForm.limitation.length - 1].label;
      } else {
        obj.trackPointName = selBayList.label;
        obj.address = selBayList.label;
      }
      _this.$set(obj, 'isDropdown', false);
      _this.trackPointList.push(obj);
      let _index = _this.trackPointList.indexOf(obj);
      _this.trackPointList[_index].bayonetList = [];
      // 把属于当前行政区卡口添加进来
      for (let s = 0; s < data.length; s++) {
        let _obj = data[s];
        setTimeout(() => {
          //在覆盖物内的置为选中-图标
          const devDom = $(`#${_this.mapId} #${_obj.uid}_kk`);
          // 新增时
          if (resBayList === undefined) {
            devDom.removeClass('vl_icon_control_35');
            devDom.removeClass('vl_icon_kk_uncheck');
            devDom.addClass('vl_icon_kk');
            _obj.isSelected = true;//在范围内的置为选中-多选框
          // 回填时
          } else {
            if (resBayList.some(s => s.bayonetId === _obj.uid)) {
              devDom.removeClass('vl_icon_control_35');
              devDom.removeClass('vl_icon_kk_uncheck');
              devDom.addClass('vl_icon_kk');
              _obj.isSelected = true;//在范围内的置为选中-多选框
            }
          }
          _this.trackPointList[_index].bayonetList.push(_obj);
        }, 500)
      }
      // 左边卡口列表按a-z字母排序
      setTimeout(() => {
        _this.trackPointList[_index].bayonetList.sort((x, y) => x.bayonetName.localeCompare(y.bayonetName, 'zh'));
      }, 550)
    },
    /******************************* 越界分析方法end ****************************/

    /******************************* 范围分析方法start **************************/
    // 查询监控设备分组列表   
    getAllMonitorGroupList () {
      getAllMonitorGroupList().then(res => {
        if (res && res.data) {
          this.devGroupList = res.data.map(m => {
            return {
              value: parseInt(m.uid),
              label: m.groupName
            }
          });
        }
      })
    },
    // 绑定draw
    bindDraw () {
      let _this = this;
      // 在地图中添加MouseTool插件
      let mouseTool = new window.AMap.MouseTool(_this.map);
      _this.mouseTool = mouseTool;
      // 添加事件
      window.AMap.event.addListener(mouseTool, 'draw', function (e) {
        _this.polygonLnglat = null;
        setTimeout(() => {
          _this.selAreaRest(true);
          let polygon = new window.AMap.Polygon({
            map: _this.map,
            strokeColor: '#FA453A',
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: '#FA453A',
            fillOpacity: 0.2, 
            path: e.obj.getPath(),
            zIndex: 12
          });
          // 移入覆盖物生成删除小图标
          let offSet = [0, 0], _marker = null;
          polygon.on('mouseover', function(p) {
            // if (_this.trackPointList.length === 1) return;//只有一个追踪点时，不生成删除小图标
            if (_marker) return;
            _marker = new window.AMap.Marker({ // 添加自定义点标记
              map: _this.map,
              position: [p.lnglat.lng, p.lnglat.lat],
              offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: '',
              // 自定义点标记覆盖物内容
              content: `<div class="el-icon-error" style="font-size: 20px; color: red;"></div>`
            });
            // 点击小图标移除覆盖物和删除小图标
            _marker.on('click', function() {
              _this.map.remove(polygon);
              _this.map.remove(_marker);
              // 移除覆盖物内对应的设备
              const delObjIndex = _this.trackPointList.findIndex(p => p.latitude == e.obj.getPath()[0].lat && p.longitude == e.obj.getPath()[0].lng);
              const _obj = _this.trackPointList.splice(delObjIndex, 1);
              // 把覆盖物内的设备置为未选中
              for (let f of _obj[0].devList) {
                // 如果该设备还存在于其他覆盖物中，跳过此操作
                if (_this.trackPointList.some(t => t.devList.some(d => d.uid === f.uid))) {
                  continue;
                }
                if (f.isSelected) {
                  f.isSelected = !f.isSelected;
                  _this.changeSelectedStatus(f, 1);
                }
              }
            })
            _marker.setMap(_this.map);
          })
          polygon.on('mouseout', function(e) {
            // if (_this.trackPointList.length === 1) return;//只有一个范围时，不生成删除小图标
            setTimeout(() => {
              if (polygon && polygon.contains(new window.AMap.LngLat(e.lnglat.lng, e.lnglat.lat))) {
                return;
              }
              _this.map.remove(_marker);//移除删除小图标
              _marker = null;
            }, 100)
          })
          _this.selAreaPolygon = polygon;
          _this.selAreaAble = true;
          _this.getScopeEquList(polygon);
        }, 100);
        _this.polygonLnglat = e.obj.getPath();
      });
      _this.selArea();
    },
    // 选择区域
    selArea () {
      if (this.trackPointList.length > 9) {
        this.$message.error('最多可选取10个范围');
        return;
      }
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
    // 获取范围分析选取范围内的设备列表数据
    getScopeEquList (graphics, resDevList) {
      let _this = this;
      let data = objDeepCopy(this.modelDevData);
      let obj = {
        tid: _this.trackPointList.length + 1, 
        trackPointName: '范围00' + (_this.trackPointList.length + 1),
        address: '范围00' + (_this.trackPointList.length + 1),
        deviceChara: 1,//设备特性,随便传个
        latitude: _this.polygonLnglat.map(m => m.lat).join(','),
        longitude: _this.polygonLnglat.map(m => m.lng).join(','),
        groupId: _this.devGroupId,//设备组id,先写死
        devList: []//设备列表
      }
      _this.$set(obj, 'isDropdown', false);
      _this.trackPointList.push(obj);
      let _index = _this.trackPointList.indexOf(obj);

      // 把多边形覆盖物范围之内的设备添加进来
      for (let s = 0; s < data.length; s++) {
        let _obj = data[s];
        if (_obj.longitude > 0 && _obj.latitude > 0) {
          if (graphics && graphics.contains(new window.AMap.LngLat(_obj.longitude, _obj.latitude))) {
            // 在圆形之中
            setTimeout(() => {
              //在覆盖物内的置为选中-图标
              const devDom = $(`#${_this.mapId} #${_obj.uid}_sxt`);
              // 新增时
              if (resDevList === undefined) {
                if (_obj.deviceStatus) {
                  devDom.removeClass('vl_icon_control_34');
                  devDom.removeClass('vl_icon_sxt_uncheck');
                  devDom.addClass('vl_icon_sxt');
                } else if (!_obj.deviceStatus) {
                  devDom.removeClass('vl_icon_sxt_uncheck');
                  devDom.addClass('vl_icon_sxt_not_choose');
                }
                _obj.isSelected = true;//在覆盖物内的置为选中-多选框
              } else {
                if (resDevList.some(s => s.deviceId === _obj.uid)) {
                  if (_obj.deviceStatus) {
                    devDom.removeClass('vl_icon_control_34');
                    devDom.removeClass('vl_icon_sxt_uncheck');
                    devDom.addClass('vl_icon_sxt');
                  } else if (!_obj.deviceStatus) {
                    devDom.removeClass('vl_icon_sxt_uncheck');
                    devDom.addClass('vl_icon_sxt_not_choose');
                  }
                  _obj.isSelected = true;//在覆盖物内的置为选中-多选框
                }
              }
              _this.trackPointList[_index].devList.push(_obj);
            }, 1000)
          }
        }
      }
      // 左边设备列表按a-z字母排序
      setTimeout(() => {
        _this.trackPointList[_index].devList.sort((x, y) => x.deviceName.localeCompare(y.deviceName, 'zh'));
      }, 1050)
    },
    /******************************* 范围分析方法end ****************************/
    // 销毁地图实例
    isDestroyed () {
      if (this.map) {
        this.map.destroy();
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.control_model{
  .pic_format{
    line-height: 40px;
    display: inline-block;
    & > div{
      white-space: nowrap;
    }
    & > div:nth-child(1){
      color: #0C70F8;
      cursor: pointer;
    }
  }
  .add_point{
    margin-top: 20px;
    line-height: 40px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    text-align: center;
    border:1px dashed rgba(217,217,217,1);
    color: #0C70F8;
    cursor: pointer;
    .vl_icon_control_22{
      vertical-align: middle;
      margin-bottom: 5px;
      margin-right: 5px;
    }
  }
  .licenseNum{
    margin-bottom: 0!important;
  }
}

</style>
<style lang="scss">
.control_model{
  .point{
    margin-bottom: 10px;
    .el-form-item__content{
      display: flex;
      i{
        margin-top: 10px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  } 
  .el-select-dropdown.is-multiple{
    .el-select-dropdown__item{
      height: 50px;
      padding-top: 5px;
      p{
        margin-top: 3px;
        font-size: 12px;
      }
    }
  }
  .vl_map_hover_main{
    li{
      display: flex;
      > span{
        width: auto;
        text-align: left;
        &:nth-child(2){
          flex: 1;
        }
      }
     
    }
  }
}
</style>
