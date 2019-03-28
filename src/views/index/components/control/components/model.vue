<template>
  <el-form :ref="mapId" :model="modelForm">
    <!-- 图片上传 -->
    <el-form-item :label="changeObj" :rules="{ required: true, message: '', trigger: 'blur'}" style="margin-bottom: 0;padding-left: 20px;padding-top: 10px;">
      <div is="uploadPic" :fileList="fileList" @uploadPicDel="uploadPicDel" @uploadPicSubmit="uploadPicSubmit" @uploadPicFileList="uploadPicFileList"></div>
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
        :remote-method="getVehicleByIdNo"
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
      <el-select value-key="value" v-model="modelForm.limitation" multiple filterable allow-create default-first-option placeholder="请输入受限范围" @change="getLimitedScope">
        <el-option
          v-for="item in limitationList"
          :key="item.value"
          :label="item.label"
          :value="item.label">
        </el-option>
      </el-select>
    </el-form-item>
    <template v-if="modelType === '1' || modelType === '2'">
      <el-form-item :label="'追踪点' + (index + 1) + ':'" :prop="'points.' + index + '.point'" :rules="{ required: true, message: '追踪点不能为空', trigger: 'blur'}" v-for="(item, index) in modelForm.points" :key="index" style="width: 50%;padding-left: 20px;" class="point">
        <el-input v-model="item.point" @keyup.enter.native="markLocation(mapId, item.point, index)"></el-input><i class="vl_icon vl_icon_control_28" @click="removePoint(item)"></i>
      </el-form-item>
      <el-form-item style="width: calc(50% - 30px);padding-left: 20px;">
        <div class="add_point" @click="addPoint"><i class="vl_icon vl_icon_control_22"></i>添加追踪点</div>
      </el-form-item>
    </template>
    <!-- 地图 -->
    <div class="manage_d_s_m">
      <div :id="mapId"></div>
      <div class="manage_d_s_m_l">
        <div class="manage_t" style="height: 130px;padding: 20px 20px;" :class="{'equ_h': (modelType === '3' || modelType === '4')}">
          <el-input v-if="modelType === '1' || modelType === '2'" v-model="scopeRadius" @keyup.enter.native="mapCircle(circleIndex)" placeholder="请输入范围半径值（单位千米）" style="width: 220px;margin-bottom: 10px;"></el-input>
          <el-select value-key="uid" v-model="features" filterable placeholder="选择设备特性" style="width: 220px;">
            <el-option
              v-for="item in featuresTypeList"
              :key="item.uid"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="manage_b" style="height: 617px;">
          <div class="vl_f_333 top">
            <span>已选设备({{trackPointList.length}})</span>
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
                        <li :key="equ.uid" @click="devId = equ.uid" :class="['normal', {'active': devId === equ.uid}]" v-if="equ.type === 2 || equ.type === 3">
                          <span :class="{'four': modelType === '4'}">{{equ.deviceName}}<br/><span v-if="modelType === '1' || modelType === '2'" class="vl_f_666">距追踪点001 <span style="color: orange;">{{equ.distance}}km</span></span></span>
                          <div>
                            <i v-if="equ.deviceStatus" class="vl_icon vl_icon_control_05" style="margin-top: 8px;"></i>
                            <i v-else class="vl_icon vl_icon_control_32" style="margin-top: 8px;"></i>
                            <el-checkbox v-model="equ.isSelected" style="display:none;" @click.native="changeSelectedStatus(equ)"></el-checkbox>
                          </div>
                        </li>
                      </template>
                    </ul>
                  </vue-scroll>
                </div>  
              </el-collapse-transition>
              <!-- 越界分析 -->
              <el-collapse-transition v-if="modelType === '3'">
                <div v-show="trackPoint.isDropdown">
                  <vue-scroll>
                    <ul style="max-height: 346px;">
                      <template v-for="equ in trackPoint.devList">
                        <li :key="equ.uid" @click="devId = equ.uid" :class="['normal', {'active': devId === equ.uid}]" v-if="equ.type === 'kk' && equ.deviceStatus">
                          <span style="margin-top: 8px;">{{equ.deviceName}}</span>
                          <div>
                            <i v-if="equ.deviceStatus" class="vl_icon vl_icon_control_05" style="margin-top: 8px;"></i>
                            <i v-else class="vl_icon vl_icon_control_32" style="margin-top: 8px;"></i>
                            <el-checkbox v-model="equ.isSelected" style="display:none;" @click.native="changeSelectedStatus(equ)"></el-checkbox>
                          </div>
                        </li>
                      </template>
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
        <el-select v-model="targetObj" value-key="value" multiple filterable remote reserve-keyword :remote-method="repertorySel" :loading="loading" placeholder="请输入车牌号、姓名、证件号码、自定义组名搜索" style="width: 100%;margin-top: 20px;">
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
import {repertorySel, getVehicleByIdNo} from '@/views/index/api/api.js';
import uploadPic from './uploadPic.vue';
export default {
  components: {uploadPic},
  name: 'model',
  props: ['mapId', 'allDevData', 'modelType', 'checkList', 'modelDataOne', 'modelDataTwo', 'modelDataThree', 'modelDataFour'],
  data () {
    return {
      modelForm: {
        licenseNum: [],
        limitation: [],
        points: [
          {point: '九峰安置小区'}
        ],
      },
      circleIndex: null, //圆形覆盖物的下标
      limitationList: [{
          value: '431224',
          label: '溆浦县'
        }],
      licenseNumList: [],
      // 地图数据
      map: null,
      mouseTool: null,
      selAreaAcitve: false,
      selAreaAble: false,
      selAreaCircle: [],
      trackPointData: [],
      selAreaPolygon: null,
      marker: null,
      polygon: null,//越界覆盖物
      // 测距
      rangingAcitve: false,
      rangingObj: null,
      // 追踪点列表数据
      trackPointList: [],
      type: '0',// 设备类型
      tid: null,//追踪点列表id
      devId: null,//设备列表id
      features: 1,//设备特性
      featuresTypeList: [
        {label: '人脸识别', value: 1},
        {label: '车辆识别', value: 2}
      ],//设备特性列表
      scopeRadius: 20, // 范围半径
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
      // 上传参数
      fileList: []
    }
  },
  watch: {
    modelDataOne () {
      if (this.modelDataOne) {
        this.getModelDataOne();
      }
    },
    modelDataTwo () {
      if (this.modelDataTwo) {
        this.getModelDataTwo();
      }
    },
    modelDataThree () {
      if (this.modelDataThree) {
        this.getModelDataThree();
      }
    },
    modelDataFour () {
      if (this.modelDataFour) {
        this.getModelDataFour();
      }
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
    }
  },
  mounted () {
    this.resetMap();
  },
  methods: {
    // 通过车牌号搜索车像列表
    getVehicleByIdNo (query) {
      const idNo = this.Trim(query, 'g');
      const params = {
        vehicleNumber: idNo
      }
      if (idNo) {
        getVehicleByIdNo(params).then(res => {
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
      console.log(this.fileList, 'fileList')
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
          console.log(this.surveillanceObjectDtoList)
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
      console.log(this.modelForm.licenseNum)
      this.modelForm.licenseNum.forEach((f, index) => {
        if (!this.checkPlateNumber(f)) {
          this.modelForm.licenseNum.splice(index, 1);
        }
      })
    },
    // 点击设备列表的多选框切换marker的在圆形覆盖物的选中状态的公共方法
    changeSelectedStatus (_obj) {
      console.log(_obj, 'two')
      const devDom = $(`#${this.mapId} #${_obj.uid}`);
      // 摄像头
      if (_obj.type === 2 || _obj.type === 3) {
        if (_obj.deviceStatus && _obj.isSelected) {
          devDom.removeClass('vl_icon_sxt');
          devDom.addClass('vl_icon_sxt_uncheck');
        } else if (_obj.deviceStatus && !_obj.isSelected) {
          devDom.removeClass('vl_icon_sxt_uncheck');
          devDom.addClass('vl_icon_sxt');
        } else if (!_obj.deviceStatus && _obj.isSelected) {
          devDom.removeClass('vl_icon_sxt_not_choose');
          devDom.addClass('vl_icon_sxt_uncheck');
        } else if (!_obj.deviceStatus && !_obj.isSelected) {
          devDom.removeClass('vl_icon_sxt_uncheck');
          devDom.addClass('vl_icon_sxt_not_choose');
        }
      // 卡口
      } else {
        if (_obj.deviceStatus && _obj.isSelected) {
          devDom.removeClass('vl_icon_kk');
          devDom.addClass('vl_icon_kk_uncheck');
        } else if (_obj.deviceStatus && !_obj.isSelected) {
          devDom.removeClass('vl_icon_kk_uncheck');
          devDom.addClass('vl_icon_kk');
        } else if (!_obj.deviceStatus) {
          console.log(1111)
        }
      }
    },
    // 上传方法
    uploadPicDel (fileList) {
      this.fileList = fileList;
      console.log(fileList)
    },
    uploadPicSubmit () {
    },
    uploadPicFileList (fileList) {
      this.fileList = fileList;
      console.log(this.fileList)
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
            groupName: null,//编辑参数
            groupId: t .groupId,
            bayonetList: t.devList.filter(f => (f.isSelected === true)).map(m => {
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
    // 清除表单验证公共方法
    reset () {
      this.$refs[this.mapId].clearValidate();
    },
    // 添加追踪点
    addPoint () {
      console.log(this.fileList)
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
      if (_this.modelForm.points.length === 1) {
        _this.$message.error('至少要有一个追踪点！');
        return false;
      }
      let index = _this.modelForm.points.indexOf(item)
      if (index !== -1) {
        _this.modelForm.points.splice(index, 1)
      }
    
      // 移除重复添加的追踪点覆盖物
      let circleObj = _this.selAreaCircle.find(f => f.index === index);
      let circle = circleObj ? circleObj._circle : '';

      // 移除追踪点的点标记
      const delMakerList = _this.trackPointData.filter(f => f.C.position.lat === circle.C.center.lat);
      if (delMakerList.length > 0) {
        _this.map.remove(delMakerList);
      }

      if (circle) {
        _this.map.remove(circle);
        _this.selAreaCircle = _this.selAreaCircle.filter(f => f.index !== index);
      }
     
      // 移除覆盖物内对应的设备
      const delEquIndex = _this.trackPointList.findIndex(p => p.latitude === circle.C.center.lat);
      if (delEquIndex !== -1) {
        const _obj = _this.trackPointList.splice(delEquIndex, 1);
        // 把覆盖物内的设备置为未选中
        _obj[0].devList.forEach(f => {
          if (f.isSelected) {
            _this.changeSelectedStatus(f);
          }
        })
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
        // this.changeEquList('0', data);
      })
    },
    // 初始化地图
    resetMap () {
      // 共有部分
      let _this = this, _hoverWindow = null;
      let map = new window.AMap.Map(_this.mapId, {
        zoom: 12, // 级别27.898681, longitude: 110.690875
        center: [112.97503, 28.09358], // 中心点坐标[112.97503, 28.09358]
        // viewMode: '3D' // 使用3D视图
      });
      map.setMapStyle('amap://styles/whitesmoke');
      _this.map = map;
      if (this.modelType !== '3') {
        map.on('mouseover', function() {
          let   _sContent = `<div class="vl_map_hover">
            <div class="vl_map_hover_main">`
            if (_this.modelType === '1' || _this.modelType === '2') {
              _sContent += `<ul><li>输入半径或地图选择</li></ul>`;
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
        _this.mapMark();
        _this.trackPointList = [];
      }
    },
    // 地图标记
    mapMark () {
      let _this = this, _hoverWindow = null;
      // 遍历追踪点范围内的设备列表，包括摄像头、卡口
      for (let i = 0; i < _this.allDevData.length; i++) {
        let offSet = [-20.5, -48];
        let _obj = _this.allDevData[i];
        if (_obj.longitude > 0 && _obj.latitude > 0) {
          let _content = null;
          if (_obj.type === 2 || _obj.type === 3) {
            if (_obj.deviceStatus && _obj.isSelected) {
              _content = '<div id="' + _obj.uid + '" class="vl_icon vl_icon_sxt"></div>';
            } else if (_obj.deviceStatus && !_obj.isSelected) {
              _content = '<div id="' + _obj.uid + '" class="vl_icon vl_icon_sxt_uncheck"></div>';
            } else if (!_obj.deviceStatus && _obj.isSelected) {
              _content = '<div id="' + _obj.uid + '" class="vl_icon vl_icon_sxt_not_choose"></div>';
            } else if (!_obj.deviceStatus && !_obj.isSelected) {
              _content = '<div id="' + _obj.uid + '" class="vl_icon vl_icon_sxt_uncheck"></div>';
            }
          } else {
            if (_obj.deviceStatus && _obj.isSelected) {
              _content = '<div id="' + _obj.uid + '" class="vl_icon vl_icon_kk"></div>';
            } else if (_obj.deviceStatus && !_obj.isSelected) {
              _content = '<div id="' + _obj.uid + '" class="vl_icon vl_icon_kk_uncheck"></div>';
            } else if (!_obj.deviceStatus) {
              _content = '';
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
          // hover
          _marker.on('click', function () {
            let _sContent = '<div class="vl_map_hover">' +
              '<div class="vl_map_hover_main"><ul>' + 
                '<li><span>设备名称：</span>' + _obj.deviceName + '</li>' + 
                '<li><span>设备地址：</span>' + _obj.address + '</li>' + 
              '</ul></div>';
            _hoverWindow = new window.AMap.InfoWindow({
              isCustom: true,
              closeWhenClickMap: true,
              offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
              content: _sContent
            });
            _hoverWindow.open(_this.map, new window.AMap.LngLat(_obj.longitude, _obj.latitude));
            // 判断当前点标记是否在圆形覆盖物之内，只有在范围之内才能点击切换选中状态
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
                  }
                })
              })
              _obj.isSelected = !_obj.isSelected;//切换marker选中状态图标
              _this.changeSelectedStatus(_obj); 
            }
          });
          _marker.setMap(_this.map);
        }
      }
    },
    // 地图缩放
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    // 输入追踪点定位圆形覆盖物的中心点
    markLocation(mapId, address, index) {
      let _this = this;
      // 清空上一次输入的追踪点产生的marker
      if (_this.circleIndex === index) {
        if (_this.marker) {
          _this.map.remove(_this.marker);
        }
      }
      new window.AMap.plugin('AMap.Geocoder', function() {
          let geocoder = new window.AMap.Geocoder(); 
          console.log(address)           
          geocoder.getLocation(address, function(status, result) {
            if (status === 'complete' && result.info === 'OK') { 
              // 经纬度                      
              let lng = result.geocodes[0].location.lng;
              let lat = result.geocodes[0].location.lat;
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
                  content: '<div class="vl_icon vl_icon_zzd"></div>'
                });
                // hover
                _this.marker.on('click', function () {
                  let _sContent = '<div class="vl_map_hover">' +
                    '<div class="vl_map_hover_main"><ul>' + 
                      '<li><span>追踪点地址：</span>' + address + '</li>' + 
                    '</ul></div>';
                  _hoverWindow = new window.AMap.InfoWindow({
                    isCustom: true,
                    closeWhenClickMap: true,
                    offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
                    content: _sContent
                  });
                  _hoverWindow.open(_this.map, new window.AMap.LngLat(lng, lat));
                  console.log(_this.trackPointList)
                  // 展开追踪点的设备列表
                  _this.trackPointList.forEach(f => f.isDropdown = false);//首先全置为false
                  const obj = _this.trackPointList.find(f => f.address === address);
                  if (obj) {
                    _this.tid = obj.tid;
                    obj.isDropdown = true;
                  }
                });
                _this.marker.setMap(_this.map);
                // 画圆形覆盖物
                _this.trackPointData.push(_this.marker);
                _this.lnglat = [lng, lat];
                _this.mapCircle(index)
              }
            } else {
              console.log('定位失败！');
              _this.$message.error('定位失败！');
            }
          });
      });
    },
    // 标记地图范围，圆形覆盖物
    mapCircle (index) {
      let _this = this;
      if (_this.lnglat.length === 0) {
        this.$message.error('请输入追踪点');
        return false;
      }
      if (_this.scopeRadius < 0) {
        _this.$message.error('半径为正数');
        return false;
      } else if (_this.scopeRadius > 20) {
        _this.$message.error('半径不可超过20千米');
        return false;
      }
      _this.circleIndex = index;
      // 移除重复添加的追踪点
      let circleObj = _this.selAreaCircle.find(f => f.index === index);
      let circle = circleObj ? circleObj._circle : '';
      if (circle) {
        _this.map.remove(circle);
        _this.selAreaCircle = _this.selAreaCircle.filter(f => f.index !== index);
      }
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
          _this.map.remove(_circle);
          _this.map.remove(_marker);
          // 移除覆盖物内对应的设备
          const delObjIndex = _this.trackPointList.findIndex(p => p.latitude === e.target.C.center.lat);
          console.log(_this.trackPointList)
          const _obj = _this.trackPointList.splice(delObjIndex, 1);
          // 把覆盖物内的设备置为未选中
          _obj[0].devList.forEach(f => {
            if (f.isSelected) {
              _this.changeSelectedStatus(f);
            }
          })
          // 移除追踪点的点标记
          const delMakerList = _this.trackPointData.filter(f => f.C.position.lat === e.target.C.center.lat);
          if (delMakerList.length > 0) {
            _this.map.remove(delMakerList);
          }
        })
        _marker.setMap(_this.map);
      })
      _circle.on('mouseout', function() {
        setTimeout(() => {
          _this.map.remove(_marker);//移除删除小图标
        }, 100)
      })
      _this.getTraceEquList(_circle);
      _this.selAreaCircle.push({_circle, index});
      _circle.setMap(_this.map)
    },
    // 获得人员追踪、车辆追踪内的设备列表数据
    getTraceEquList (graphics) {
      let _this = this;
      let data = objDeepCopy(_this.allDevData);
      console.log(data, 'data')
      let obj = {
        tid: _this.circleIndex, 
        trackPointName: '追踪点00' + (_this.circleIndex + 1),
        address: _this.modelForm.points[_this.circleIndex].point,
        deviceChara: _this.features,//设备特性
        longitude: _this.lnglat[0],//追踪点经度
        latitude: _this.lnglat[1],//追踪点纬度
        radius: _this.scopeRadius,//范围半径
        groupId: 1,//设备组id,先写死
        devList: []//设备列表
      }
      // 把在圆形覆盖物范围之内的追踪点添加进来
      if (_this.lnglat[0] > 0 && _this.lnglat[1] > 0) {
        if (graphics && graphics.contains(new window.AMap.LngLat(_this.lnglat[0], _this.lnglat[1]))) {
          // 在圆形之中
          _this.$set(obj, 'isDropdown', false);
          if (_this.trackPointList.findIndex(f => f.tid === _this.circleIndex) !== -1) {
            _this.trackPointList.splice(_this.trackPointList.findIndex(f => f.tid === _this.circleIndex), 1);
          }
          _this.trackPointList.push(obj);
        }
      }
      let index = _this.trackPointList.indexOf(obj);
      _this.trackPointList[index].devList = [];
      // 把在圆形覆盖物范围之内的设备添加进来
      for (let s = 0; s < data.length; s++) {
        let _obj = data[s];
        if (_obj.longitude > 0 && _obj.latitude > 0) {
          if (graphics && graphics.contains(new window.AMap.LngLat(_obj.longitude, _obj.latitude))) {
            // 在圆形之中
            setTimeout(() => {
              //在覆盖物内的置为选中-图标
              const devDom = $(`#${this.mapId} #${_obj.uid}`);
              // 摄像头
              _obj.isSelected = false;
              if (_obj.type === 2 || _obj.type === 3) {
                if (_obj.deviceStatus && !_obj.isSelected) {
                  devDom.removeClass('vl_icon_sxt_uncheck');
                  devDom.addClass('vl_icon_sxt');
                } else if (!_obj.deviceStatus && !_obj.isSelected) {
                  devDom.removeClass('vl_icon_sxt_uncheck');
                  devDom.addClass('vl_icon_sxt_not_choose');
                }
              // 卡口
              } else {
                if (_obj.deviceStatus && !_obj.isSelected) {
                  devDom.removeClass('vl_icon_kk_uncheck');
                  devDom.addClass('vl_icon_kk');
                } else if (!_obj.deviceStatus) {
                  console.log(11111)
                }
              }
              // 计算追踪点到设备的距离km
              const p1 = [_obj.longitude, _obj.latitude];
              const distance = AMap.GeometryUtil.distance(_this.lnglat, p1);
              console.log(distance, 'distance')
              _obj.distance = (distance / 1000).toFixed(1);
              _obj.isSelected = true;//在覆盖物内的置为选中-多选框
              _this.trackPointList[index].devList.push(_obj);
              console.log(_this.trackPointList, 'trackPointList')
            }, 100)
          }
        }
      }
    },
    // 绑定draw
    bindDraw () {
      let _this = this;
      // 在地图中添加MouseTool插件
      let mouseTool = new window.AMap.MouseTool(_this.map);
      _this.mouseTool = mouseTool;
      // 添加事件
      window.AMap.event.addListener(mouseTool, 'draw', function (e) {
        console.log('drawPaths e', e); // 获取路径/范围
        console.log('drawPaths', e.obj.getPath()); // 获取路径/范围
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
              const delObjIndex = _this.trackPointList.findIndex(p => p.latitude === e.obj.getPath()[0].lat);
              console.log(_this.trackPointList)
              const _obj = _this.trackPointList.splice(delObjIndex, 1);
              // 把覆盖物内的设备置为未选中
              _obj[0].devList.forEach(f => {
                if (f.isSelected) {
                  _this.changeSelectedStatus(f);
                }
              })
            })
            _marker.setMap(_this.map);
          })
          polygon.on('mouseout', function() {
            setTimeout(() => {
              _this.map.remove(_marker);//移除删除小图标
            }, 100)
          })
          _this.selAreaPolygon = polygon;
          _this.selAreaAble = true;
          _this.getScopeEquList(polygon, 1);
        }, 100);
        _this.polygonLnglat = e.obj.getPath();
      });
      _this.selArea();
    },
    // 选择区域
    selArea () {
      // if (this.selAreaAcitve) {
      //   this.selAreaRest();
      //   return false;
      // }
      // this.selAreaRest();
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
    // 获取越界分析、范围分析选取范围内的设备列表数据
    getScopeEquList (graphics, type) {
      let _this = this;
      let data = objDeepCopy(this.allDevData);
      const i = _this.trackPointList.length + 1;
      let obj = {
        tid: i, 
        trackPointName: type === 1 ? ('范围00'  + i) : (_this.modelForm.limitation.length > 0 && _this.modelForm.limitation[0]),
        address: type === 1 ? ('范围00'  + i) : (_this.modelForm.limitation.length > 0 && _this.modelForm.limitation[0]),
        deviceChara: _this.features,//设备特性
        latitude: type === 1 ? _this.polygonLnglat.map(m => m.lat).join(',') : '',
        longitude: type === 1 ? _this.polygonLnglat.map(m => m.lng).join(',') : '',
        groupId: 1,//设备组id,先写死
        devList: []//设备列表
      }
      _this.$set(obj, 'isDropdown', false);
      _this.trackPointList.push(obj);
      let index = _this.trackPointList.indexOf(obj);

      // 把多边形覆盖物范围之内的设备添加进来
      for (let s = 0; s < data.length; s++) {
        let _obj = data[s];
        if (_obj.longitude > 0 && _obj.latitude > 0) {
          if (graphics && graphics.contains(new window.AMap.LngLat(_obj.longitude, _obj.latitude))) {
            // 在圆形之中
            _this.$nextTick(() => {
              //在覆盖物内的置为选中-图标
              const devDom = $(`#${this.mapId} #${_obj.devDom}`);
              // 摄像头
              _obj.isSelected = false;
              if (_obj.type === 2 || _obj.type === 3) {
                if (_obj.deviceStatus && !_obj.isSelected) {
                  devDom.removeClass('vl_icon_sxt_uncheck');
                  devDom.addClass('vl_icon_sxt');
                } else if (!_obj.deviceStatus && !_obj.isSelected) {
                  devDom.removeClass('vl_icon_sxt_uncheck');
                  devDom.addClass('vl_icon_sxt_not_choose');
                }
              // 卡口
              } else {
                if (_obj.deviceStatus && !_obj.isSelected) {
                  devDom.removeClass('vl_icon_kk_uncheck');
                  devDom.addClass('vl_icon_kk');
                } else if (!_obj.deviceStatus) {
                  console.log(1111)
                }
              }
              _obj.isSelected = true;//在覆盖物内的置为选中-多选框
              _this.trackPointList[index].devList.push(_obj);
            })
          }
        }
      }
    },

    // 切换受限范围
    getLimitedScope () {
      let _this = this;
      console.log(_this.modelForm.limitation)
        if (_this.modelForm.limitation.some(s => s === '431224')) {
          // 添加点标记
          // _this.getScopeEquList(_this.polygon, 2);
        } else {
          if (_this.polygon) {
            _this.map.remove(_this.polygon);
          } 
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
          url: m.photoUrl || 'https://apirel.aorise.org/medical-his/image/a24f4ecb-9252-4067-8c97-fa33e66ae056.jpg'
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
        this.features = this.modelDataOne.pointDtoList[0].deviceChara;
        this.modelDataOne.pointDtoList.forEach((m, index) => {
          // 回填追踪点列表
          this.markLocation(this.mapId, m.address, index)
        })
      }
    },
    // 回填车辆追踪数据
    getModelDataTwo() {
      console.log(2222)
      this.fileList = this.modelDataTwo.surveillanceObjectDtoList.map(m => {
        return {
          objId: m.objId,
          objType: m.objType,
          url: m.photoUrl || 'https://apirel.aorise.org/medical-his/image/a24f4ecb-9252-4067-8c97-fa33e66ae056.jpg'
        }
      });
      // 回填车牌信息
      if (this.modelDataTwo.carNumberInfo.includes(',')) {
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
        this.features = this.modelDataTwo.pointDtoList[0].deviceChara;
        this.modelDataTwo.pointDtoList.forEach((m, index) => {
          // 回填追踪点列表
          this.markLocation(this.mapId, m.address, index)
        })
      }
    },
    // 回填越界分析数据
    getModelDataThree () {
      console.log(3333)
      this.fileList = this.modelDataThree.surveillanceObjectDtoList.map(m => {
        return {
          objId: m.objId,
          objType: m.objType,
          url: m.photoUrl || 'https://apirel.aorise.org/medical-his/image/a24f4ecb-9252-4067-8c97-fa33e66ae056.jpg'
        }
      });
      // 回填车牌信息
      if (this.modelDataThree.carNumberInfo.includes(',')) {
        this.modelForm.licenseNum = this.modelDataThree.carNumberInfo.split(',');
      } else {
        this.modelForm.licenseNum = [this.modelDataThree.carNumberInfo];
      }
      if (this.modelDataThree.pointDtoList.length > 0) {
        // 回填越界分析的受限范围
        this.modelForm.limitation = this.modelDataThree.pointDtoList.map(m => m.address);
        // 回填设备特性
        this.features = this.modelDataThree.pointDtoList[0].deviceChara;

        this.modelDataThree.pointDtoList.forEach(() => {
          // 回填受限范围
          this.getLimitedScope();
        })
      }
    },
    // 回填范围分析数据
    getModelDataFour () {
      console.log(4444)
      this.fileList = this.modelDataFour.surveillanceObjectDtoList.map(m => {
        return {
          objId: m.objId,
          objType: m.objType,
          url: m.photoUrl || 'https://apirel.aorise.org/medical-his/image/a24f4ecb-9252-4067-8c97-fa33e66ae056.jpg'
        }
      });
      // 回填车牌信息
      if (this.modelDataFour.carNumberInfo.includes(',')) {
        this.modelForm.licenseNum = this.modelDataFour.carNumberInfo.split(',');
      } else {
        this.modelForm.licenseNum = [this.modelDataFour.carNumberInfo];
      }
      if (this.modelDataFour.pointDtoList.length > 0) {
        // 回填设备特性
        this.features = this.modelDataFour.pointDtoList[0].deviceChara;
        let _this = this;
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
              const delObjIndex = _this.trackPointList.findIndex(p => p.latitude === f.latitude);
              console.log(_this.trackPointList)
              _this.trackPointList.splice(delObjIndex, 1);
            })
            _marker.setMap(_this.map);
          })
          polygon.on('mouseout', function() {
            setTimeout(() => {
              _this.map.remove(_marker);//移除删除小图标
            }, 100)
          })
          _this.polygonLnglat = _this.getLngLatList(f);
          if (_this.polygonLnglat) {
            _this.getScopeEquList(polygon, 1);
          }
        })
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
    }
  }
}
</script>
<style lang="scss" scoped>
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
</style>
<style lang="scss">
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
.create_model_box{
  .el-form-item__content{
    line-height: 0;
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
</style>
