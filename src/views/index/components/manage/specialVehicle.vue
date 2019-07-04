<template>
  <div class="special_vehicle">
    <div class="vehicle_left">
      <div class="add_btn" @click="showOperateGroupDialog('add')">
        <i class="vl_icon vl_icon_manage_4"></i>
        <span>新增分组</span>
      </div>
      <div class="content_box">
        <vue-scroll>
          <ul class="temp_detail_info">
            <li
              :class="[activeId === item.id ? 'temp_active' : '']"
              v-for="(item, index) in groupList"
              :key="'item' + index"
              @click="showGroupDeviceInfo(item.id)"
            >
              <span>{{item.name}}  ({{item.portraitNum}})</span>
              <template v-if="!item.isDefault">
                <i class="operation_btn del_btn vl_icon vl_icon_manage_8" @click="showDeleteDialog(item.id)"></i>
                <i class="operation_btn edit_btn vl_icon vl_icon_manage_7" @click="showOperateGroupDialog('edit', item)"></i>
              </template>
            </li>
          </ul>
        </vue-scroll>
      </div>
    </div>
    <div class="vehicle_right">
      <div class="search_right_box">
        <el-form :inline="true" :model="searchForm" class="search_form clearfix" ref="searchForm">
          <el-form-item prop="idType">
            <el-date-picker
              style="width: 250px;"
              v-model="searchForm.dateTime"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              range-separator="-"
              start-placeholder="开始日期"
              :default-time="['00:00:00', '23:59:59']"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="vehicleColor">
            <el-select v-model="searchForm.vehicleColor" style="width: 250px;" placeholder="车身颜色">
              <el-option value='不限'></el-option>
              <el-option
                v-for="(item, index) in vehicleColorList"
                :key="index"
                :label="item.enumValue"
                :value="item.enumField"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="vehicleType">
            <el-select v-model="searchForm.vehicleType" style="width: 250px;" placeholder="车辆类型" clearable> <!--底库列表-->
              <el-option value='不限'></el-option>
              <el-option
                v-for="(item, index) in vehicleTypeList"
                :key="index"
                :label="item.enumValue"
                :value="item.enumField"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="numType">
            <el-select v-model="searchForm.numType" style="width: 250px;" placeholder="号牌类型" clearable> <!--分组-->
              <el-option value='不限'></el-option>
              <el-option
                v-for="(item, index) in numberTypeList"
                :key="index"
                :label="item.enumValue"
                :value="item.enumField"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="vehicleNo">
            <el-input style="width: 250px;" type="text" placeholder="请输入车牌号码" v-model="searchForm.vehicleNo" />
          </el-form-item>
          <el-form-item class="operation_form_btn" style="width: 260px;">
            <el-button class="reset_btn" @click="exportVehicle">导出车辆</el-button>
            <el-button class="select_btn" @click="searchData">查询</el-button>
            <el-button class="reset_btn" @click="resetData('searchForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="divide"></div>
      </div>
      <div class="button_box">
        <el-button class="select_btn" @click="showAddVehicleDialog('carForm', 'add')">新增车辆</el-button>
        <el-button class="reset_btn">导入车辆</el-button>
        <el-button :class="[!isDisabled ? 'reset_btn' : 'disabled_btn']" :disabled="isDisabled" :loading="isDeleteVehicleLoading" @click="deleteVehicle">删除车辆</el-button>
      </div>
      <template v-if="vehicleList && vehicleList.length > 0">
        <div class="vehicle_box">
          <ul>
            <li v-for="(item, index) in vehicleList" :key="index">
              <div class="left">
                <img :src="item.vehicleImagePath" />
              </div>
              <div class="right">
                <div class="title">
                  <p>
                    <span>详细资料</span>
                    <i class="operation_btn edit_btn vl_icon vl_icon_manage_7" @click="showAddVehicleDialog('carForm', 'edit', item)"></i>
                  </p>
                  <el-checkbox class="check_box" v-model="item.isDelete" @change="handleChangeCheckBox(index, item.isDelete)"></el-checkbox>
                </div>
                <div class="info_list">
                  <span v-show="item.vehicleNumber">{{item.vehicleNumber && item.vehicleNumber}}</span>
                  <span v-show="item.vehicleColor">{{item.vehicleColor && item.vehicleColor}}</span>
                  <span v-show="item.vehicleType">{{item.vehicleType && item.vehicleType}}</span>
                  <span v-show="item.vehicleModel">{{item.vehicleModel && item.vehicleModel}}</span>
                </div>
                <div class="info_list">
                  <span v-show="item.numberColor">{{item.numberColor}}</span>
                </div>
                <div class="info_list">
                  <span v-show="item.ownerName">{{item.ownerName && item.ownerName}}<span v-show="item.ownerIdCard">({{item.ownerIdCard}})</span></span>
                  <!-- <span v-show="item.ownerIdCard">({{item.ownerIdCard}})</span> -->
                </div>
                <div class="info_list">
                  <span v-show="item.desci" :title="item.desci">{{item.desci && item.desci}}</span>
                </div>
                <div class="info_list group_list" v-show="item.groupList && item.groupList.length > 0">
                  <span v-show="index < 2" v-for="(item, index) in item.groupList" :key="index" :title="item.groupName">{{item.groupName}}</span>
                  <template v-if="item.groupList.length > 2">
                    <div class="more">
                      <el-popover
                        placement="left-start"
                        width="220"
                        popper-class="more_popover_box"
                        trigger="hover">
                        <vue-scroll>
                          <template>
                            <div class="more_popover">
                              <span :title="val.groupName" v-for="(val, index) in item.groupList" :key="index + val">{{val.groupName}}</span>
                            </div>
                          </template>
                        </vue-scroll>
                        <span slot="reference" class="more_hover">更多组</span>
                      </el-popover>
                    </div>
                  </template>
                </div>
              </div>
            </li>
          </ul>
          <el-pagination
            class="cum_pagination"
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.pageNum"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="pagination.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pagination.total">
          </el-pagination>
        </div>
      </template>
      <template v-else>
        <div class="not_content">
          <img src="../../../../assets/img/not-content.png" alt="">
          <p style="color: #666666; margin-top: 30px;">抱歉，没有相关的结果!</p>
        </div>
      </template>
    </div>
    <!--新建/修改车辆弹出框-->
    <el-dialog
      :title="`${vehicleTitle}车辆`"
      :visible.sync="dialogVisiable"
      width="722px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp_vehicle"
      >
      <div class="content_body">
        <div class="left">
          <div :class="['upload_pic', {'hidden': dialogImageUrl}]">
            <el-upload
              :disabled="isAddImgDisabled"
              ref="uploadPic"
              accept="image/*"
              :limit="1"
              :action="uploadUrl"
              list-type="picture-card"
              :on-success="uploadPicSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
              :file-list="fileList">
              <i class="vl_icon vl_icon_control_14"></i>
            </el-upload>
          </div>
          <template v-if="!isAddImgDisabled">
            <h1 class="vl_f_999">点击修改车像</h1>
            <p>请上传车辆图片</p>
          </template>
        </div>
        <div class="right">
          <vue-scroll>
            <el-form ref="carForm" :model="carForm" :rules="carRules" label-position="right" label-width="10px">
              <el-form-item label=" " prop="vehicleNumber" >
                <el-input v-model="carForm.vehicleNumber" placeholder="车牌号码" :disabled="isAddDisabled" style="width: 85%;" @blur="handleCheckVehicle"></el-input>
              </el-form-item>
              <el-form-item prop="vehicleColor">
                <el-select v-model="carForm.vehicleColor" placeholder="请选择车身颜色" style="width: 85%;" :disabled="isAddDisabled">
                  <el-option
                    v-for="(item, index) in vehicleColorList"
                    :key="index"
                    :label="item.enumValue"
                    :value="item.enumField"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="vehicleType">
                <el-select v-model="carForm.vehicleType" placeholder="请选择车辆类型" style="width: 85%;" :disabled="isAddDisabled">
                  <el-option
                    v-for="(item, index) in vehicleTypeList"
                    :key="index"
                    :label="item.enumValue"
                    :value="item.enumField"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-select v-model="carForm.region" placeholder="请选择品牌" style="width: 37%;" :disabled="isAddDisabled">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
                <el-select v-model="carForm.vehicleModel" placeholder="请选择型号" style="width: 45%; margin-left: 3%" :disabled="isAddDisabled">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="numberType">
                <el-select v-model="carForm.numberType" placeholder="请选择号牌类型" style="width: 85%;" :disabled="isAddDisabled" @change="carForm.numberColor = carForm.numberType">
                  <el-option
                    v-for="(item, index) in numberTypeList"
                    :key="index"
                    :label="item.enumValue"
                    :value="item.enumField"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="numberColor">
                <el-select v-model="carForm.numberColor" placeholder="请选择号牌颜色" style="width: 85%;" disabled>
                  <el-option
                    v-for="item in numColorList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="ownerName">
                <el-input v-model="carForm.ownerName" placeholder="车主姓名" style="width: 85%;" :disabled="isAddDisabled"></el-input>
              </el-form-item>
              <el-form-item prop="ownerIdType">
                <el-select v-model="carForm.ownerIdType" placeholder="证件类型" style="width: 85%;" :disabled="isAddDisabled">
                  <el-option
                    v-for="item in cardTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="ownerIdCard">
                <el-input v-model="carForm.ownerIdCard" placeholder="证件号码" style="width: 85%;" :disabled="isAddDisabled"></el-input>
              </el-form-item>
              <el-form-item prop="groupList">
                <el-select v-model="carForm.groupList" placeholder="所属组" style="width: 85%;" clearable multiple>
                  <el-option
                    v-for="item in groupList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="desci">
                <el-input type="textarea" :show-word-limit="true" maxlength="100" rows="3" style="width: 85%;" v-model="carForm.desci" placeholder="描述" :disabled="isAddDisabled"></el-input>
              </el-form-item>
              <el-form-item style="margin-left: 20px;">
                <el-button class="reset_btn" style="width: 140px;" @click="cancelOperation('carForm')">取消</el-button>
                <template v-if="isAddVehicle">
                  <el-button :class="[isSubmitData ? 'select_btn' : 'disabled_btn']"  :loading="isVehicleLoading" @click="addVehicle('carForm')" style="width: 140px;">保存</el-button>
                </template>
                <template v-else>
                  <el-button :class="[isSubmitData ? 'select_btn' : 'disabled_btn']"  :loading="isVehicleLoading" @click="updateVehicle('carForm')" style="width: 140px;">确定</el-button>
                </template>
              </el-form-item>
            </el-form>
          </vue-scroll>
        </div>
      </div>
    </el-dialog>
    <!--删除组弹出框-->
    <el-dialog
      title="是否确定删除该组?"
      :visible.sync="delGroupDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">删除后数据不可恢复。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delGroupDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="deleteGroup">确认</el-button>
      </div>
    </el-dialog>
    <!--新增/编辑组弹出框-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showGroupDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div class="content_body">
        <el-form :model="groupForm" ref="groupForm" :rules="groupRules" class="group_form">
          <el-form-item label="组名:" prop="groupName" label-width="70px">
            <el-input placeholder="请输入组名称" :class="[isShowError ? 'error_input' : '']" v-model="groupForm.groupName" style="width: 100%;" maxlength="6" @blur="handleCheckGroupName"></el-input>
            <span class="group_error_tip" v-show="isShowError">分组名称不允许重复</span>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelOperationGroup('groupForm')">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="addGroup('groupForm')" v-if="dialogTitle === '新增组'">新增</el-button>
        <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="editGroup('groupForm')" v-if="dialogTitle === '编辑组'">确认</el-button>
      </div>
    </el-dialog>
    <!--导入弹出框-->
    <el-dialog
      title="是否确定删除该组?"
      :visible.sync="delGroupDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">删除后数据不可恢复。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delGroupDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="deleteGroup">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ajaxCtx } from '@/config/config.js';
import { checkPlateNumber, checkIdCard } from '@/utils/validator.js';
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
import { getSpecialGroup, addSpecialVehicle, editSpecialVehicle, getSpecialVehicleDetail, 
  getSpecialVehicleList, addGroup, checkRename, editVeGroup, delGroup, moveoutGroup, vehicleImport, vehicleExport } from '@/views/index/api/api.manage.js';
import { getVehicleByVehicleNumber } from '@/views/index/api/api.control.js';
export default {
  data () {
    return {
      isDisabled: true, // 导入-导出-删除车辆禁用
      isShowError: false, // 是否显示错误提示信息
      dialogTitle: null, // 新增/编辑组标题
      vehicleTitle: null, // 新增-修改车辆
      groupForm: {
        groupName: null
      },
      groupRules: {
        groupName: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ]
      },
      isDeleteVehicleLoading: false, // 删除车辆加载中
      isVehicleLoading: false, // 新增--修改车辆加载中
      isSubmitData: true, // 是否能提交数据
      isAddVehicle: true, // 是否是新增车辆
      isAddGroup: true, // 是否是新增组
      isAddDisabled: false, // 是否能修改信息
      currentGroupId: null, // 要修改--删除的组id
      delGroupDialog: false, // 删除组弹出框
      isDeleteLoading: false, // 删除组加载中
      showGroupDialog: false, // 新增/修改组弹出框
      isAddLoading: false, // 新增--修改组加载中
      dialogVisiable: false, // 新建/修改车辆弹出框
      fileList: [],
      dialogImageUrl: null,
      uploadUrl: ajaxCtx.base + '/new', // 图片上传地址
      activeId: null, // 当前选中的分组id
      isAddImgDisabled: false, // 是否能添加图片
      picHeight: null,
      pagination: { total: 0, pageSize: 4, pageNum: 1 },
      groupList: [], // 车辆分组
      //证件类型列表数据
      cardTypeList: [
        {label: '身份证', value: 1}
      ],
      searchForm: {
        dateTime: [],
        vehicleNo: null, // 车牌号码
        numType: '不限', // 号牌类型
        vehicleType: '不限', // 车辆类型
        vehicleColor: '不限', // 车身颜色
      },
      // 新增车像参数
      carForm: {
        vehicleImagePath: null, // 车牌图片地址
        vehicleNumber: null, // 车牌号码
        vehicleColor: null, // 车身颜色
        vehicleBrand: null, // 车辆品牌
        vehicleType: null, // 车辆类型
        numberType: null, // 号牌类型
        numberColor: null, // 号牌颜色
        ownerName: null, // 车主姓名
        ownerIdType: null, // 证件类型
        ownerIdCard: null, // 车主身份证号
        vehicleModel: null, // 车辆型号
        groupList: [], // 分组
        desci: null, // 描述
      },
      carRules: {
        vehicleNumber: [
          { required: true, message: '该项内容不能为空', trigger: 'blur' },
          { validator: checkPlateNumber, trigger: 'blur'}
        ],
        ownerIdCard: [
          { validator: checkIdCard, trigger: 'blur'}
        ]
      },
      numColorList: [
        {label: '黄底黑字', value: '1'},
        {label: '蓝底白字', value: '2'},
        {label: '蓝底白字', value: '8'},
        {label: '黄底黑字黑框线', value: '15'},
        {label: '白底黑字、红“警”字', value: '23'},
        {label: '白底黑字、红“警”字', value: '24'},
        {label: '渐变绿底黑字', value: '25'},
        {label: '黄绿双拼底黑字', value: '26'},
        {label: '其他', value: '99'}
      ],//号牌颜色列表
      vehicleTypeList: [], // 车辆类型列表
      vehicleColorList: [], // 车身颜色列表
      numberTypeList: [], // 号牌种类列表
      vehicleList: [], // 特殊车辆列表
    }
  },
  watch: {
    vehicleList (val) {
      if (val) {
        let array = [];
        val.map(item => {
          if (item.isDelete) {
            array.push(item.uid);
          }
        });
        if (array.length > 0) {
          this.isDisabled = false;
        } else {
          this.isDisabled = true;
        }
      }
    }
  },
  mounted () {
    this.getVehicleTypeList();
    this.getVehicleColor();
    this.getNumberTypeList();
    this.getGroupList();
    
  },
  methods: {
    // 获取车辆类型列表
    getVehicleTypeList () {
      const type = dataList.vehicleType;
      getDiciData(type)
        .then(res => {
          if (res) {
            this.vehicleTypeList = res.data;
          }
        })
    },
    // 获取车身颜色
    getVehicleColor () {
      const color = dataList.vehicleColor;
      getDiciData(color)
        .then(res => {
          if (res) {
            this.vehicleColorList = res.data;
          }
        })
        .catch(() => {})
    },
    // 获取号牌种类列表
    getNumberTypeList () {
      const type = dataList.numberType;
      getDiciData(type)
        .then(res => {
          if (res) {
            this.numberTypeList = res.data;
          }
        })
    },
    // 获取所有车辆组
    getGroupList () {
      getSpecialGroup()
        .then(res => {
          if (res) {
            this.groupList = res.data;
            this.activeId = res.data[0].id;
            this.getVehicleList();
          }
        })
    },
    // 获取特殊车辆列表
    getVehicleList () {
      let vehicleColor, vehicleType, numType;
      if (this.searchForm.vehicleType === '不限') {
        vehicleType = null;
      } else {
        vehicleType = this.searchForm.vehicleType;
      }
      if (this.searchForm.vehicleColor === '不限') {
        vehicleColor = null;
      } else {
        vehicleColor = this.searchForm.vehicleColor;
      }
      if (this.searchForm.numType === '不限') {
        numType = null;
      } else {
        numType = this.searchForm.numType;
      }
      const params = {
        'where.startTime': this.searchForm.dateTime[0],
        'where.endTime': this.searchForm.dateTime[1],
        'where.vehicleColor': vehicleColor,
        'where.vehicleType': vehicleType,
        'where.numberType': numType,
        'where.vehicleNumber': this.searchForm.vehicleNo,
        'where.groupId': this.activeId,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      };
      getSpecialVehicleList(params)
        .then(res => {
          if (res) {
            this.vehicleList = res.data.list;
            this.pagination.total = res.data.total;
            this.vehicleList.map(item => {
              item.isDelete = false;
              this.vehicleTypeList.map(val => {
                if (val.enumField === item.vehicleType) {
                  item.vehicleType = val.enumValue;
                }
              });
              this.vehicleColorList.map(val => {
                if (val.enumField === item.vehicleColor) {
                  item.vehicleColor = val.enumValue;
                }
              });
              this.numberTypeList.map(val => {
                if (val.enumField === item.numberType) {
                  item.numberType = val.enumValue;
                }
              });
              this.numColorList.map(val => {
                if (val.value === item.numberColor) {
                  item.numberColor = val.label;
                }
              });
            });
          }
        })
    },
    // 判断分组名称是否重复
    handleCheckGroupName () {
      if (this.groupForm.groupName) {
        const params = {
          groupName: this.groupForm.groupName
        };
        checkRename(params)
          .then(res => {
            if (res && res.data) {
              this.isShowError = true;
            } else {
              this.isShowError = false;
            }
          })
      } else {
        this.isShowError = false;
      }
    },
    // change  勾选duoxuankuang
    handleChangeCheckBox (index, val) {
      this.vehicleList[index].isDelete = val;
      this.vehicleList = JSON.parse(JSON.stringify(this.vehicleList));
    },
    // 车牌号check
    handleCheckVehicle () {
      const carIdNo = this.Trim(this.carForm.vehicleNumber, 'g');
       const params = {
        vehicleNumber: carIdNo
      };
      getVehicleByVehicleNumber(params)
        .then(res => {
          if (res && res.data && res.data.length > 0) {
            this.isAddDisabled = true;

            let carInfo = res.data[0];

            let vehicleColor = carInfo.vehicleColor;
            let vehicleType = carInfo.vehicleType;
            let numberType = carInfo.numberType;
            let numberColor = carInfo.numberColor;

            this.fileList = carInfo.vehicleImagePath ? [{url: carInfo.vehicleImagePath}] : [];//回填图片
            this.dialogImageUrl = carInfo.vehicleImagePath;

            this.carForm.vehicleNumber = carInfo.vehicleNumber;
            this.carForm.desci = carInfo.desci;

            this.carForm.vehicleColor = vehicleColor && vehicleColor.toString();
            this.carForm.vehicleType = vehicleType && vehicleType.toString();
            this.carForm.numberType = numberType && numberType.toString();
            this.carForm.numberColor = numberColor && numberColor.toString();

          } else {
            this.isAddDisabled = false;
          }
        })
    },
    // 确认删除组
    deleteGroup () {
      if (this.currentGroupId) {
        this.isDeleteLoading = true;
        delGroup(this.currentGroupId)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              });
              this.isDeleteLoading = false;
              this.delGroupDialog = false;
              this.getGroupList();
              this.getVehicleList();
            } else {
              this.isDeleteLoading = false;
            }
          })
          .catch(() => {this.isDeleteLoading = false;})
      }
    },
    // 取消添加/编辑组
    cancelOperationGroup (form) {
      this.$refs[form].resetFields();
      this.groupForm.groupName = null;
      this.showGroupDialog = false;
      this.isShowError = false;
    },
    // 新增组
    addGroup (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.isShowError) {
            return;
          }
          const params = {
            groupName: this.groupForm.groupName,
            groupType: 9 // 9---特殊车辆
          };
          this.isAddLoading = true;
          addGroup(params)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '新建成功',
                  customClass: 'request_tip'
                });
                this.isAddLoading = false;
                this.showGroupDialog = false;
                this.getGroupList();
              } else {
                this.isAddLoading = false;
              }
            })
            .catch(() => {this.isAddLoading = false;})
        }
      });
    },
    // 编辑组
    editGroup (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.isShowError) {
            return;
          }
          const params = {
            uid: this.currentGroupId,
            groupName: this.groupForm.groupName,
            groupType: 9 // 9---特殊车辆
          };
          this.isAddLoading = true;
          editVeGroup(params)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '修改成功',
                  customClass: 'request_tip'
                });
                this.isAddLoading = false;
                this.showGroupDialog = false;
                this.getGroupList();
              } else {
                this.isAddLoading = false;
              }
            })
            .catch(() => {this.isAddLoading = false;})
        }
      });
    },
    // 添加车辆
    addVehicle (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (!this.dialogImageUrl) {
            this.$message({
              type: 'error',
              message: '请先上传车辆照片',
              customClass: 'request_tip'
            })
            return;
          }
          if (this.carForm.groupList.length === 0) {
            this.$message({
              type: 'error',
              message: '请先选择所属组',
              customClass: 'request_tip'
            })
            return;
          }
          this.carForm.vehicleImagePath = this.dialogImageUrl;
          this.isVehicleLoading = true;
          addSpecialVehicle(this.carForm)
            .then(res => {
              if (res && res.data) {
                this.$message({
                  type: 'success',
                  message: '新建成功',
                  customClass: 'request_tip'
                });
                this.isVehicleLoading = false;
                this.dialogVisiable = false;
                this.isAddDisabled = false;
                this.getGroupList();
                this.getVehicleList();
              } else {
                this.isVehicleLoading = false;
              }
              // this.$refs[form].resetFields();
            })
            .catch(() => {this.isVehicleLoading = false;})
        }
      });
    },
    // 修改车辆
    updateVehicle (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (!this.dialogImageUrl) {
            this.$message({
              type: 'error',
              message: '请先上传车辆照片',
              customClass: 'request_tip'
            })
            return;
          }
          if (this.carForm.groupList.length === 0) {
            this.$message({
              type: 'error',
              message: '请先选择所属组',
              customClass: 'request_tip'
            })
            return;
          }
          this.carForm.vehicleImagePath = this.dialogImageUrl;
          this.isVehicleLoading = true;
          editSpecialVehicle(this.carForm)
            .then(res => {
              if (res && res.data) {
                this.$message({
                  type: 'success',
                  message: '修改成功',
                  customClass: 'request_tip'
                });
                this.isVehicleLoading = false;
                this.dialogVisiable = false;
                this.isAddDisabled = false;
                this.getGroupList();
                this.getVehicleList();
              } else {
                this.isVehicleLoading = false;
              }
              // this.$refs[form].resetFields();
            })
            .catch(() => {this.isVehicleLoading = false;})
        }
      })
    },
    // 删除车辆
    deleteVehicle () {
      let deleteIds = [];
      this.vehicleList.map(item => {
        if (item.isDelete) {
          deleteIds.push(item.uid);
        }
      });
      const params = {
        groupId: this.activeId,
        vehicleIds: deleteIds.join(',')
      };
      this.isDeleteVehicleLoading = true;
      moveoutGroup(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功',
              customClass: 'request_tip'
            });
            this.getGroupList();
            this.getVehicleList();
            this.isDeleteVehicleLoading = false;
          } else {
            this.isDeleteVehicleLoading = false;
          }
        })
        .catch(() => {this.isDeleteVehicleLoading = false;})
    },
    handleRemove () {
      this.dialogImageUrl = null;
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadPicSuccess (file) {
      this.dialogImageUrl = file.data.fileFullPath;
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      const isLt4M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        this.$message.error('上传图片只能是 jpeg、jpg、png 格式!');
      }
      if (!isLt4M) {
        this.$message.error('上传图片大小不能超过 4MB!');
      }
      return isJPG && isLt4M;
    },
    // 点击左边分组获取特殊车辆
    showGroupDeviceInfo (id) {
      this.activeId = id;
      this.pagination.pageNum = 1;
      this.getVehicleList();
    },
    // 显示删除组弹出框
    showDeleteDialog (id) {
      this.currentGroupId = id;
      this.delGroupDialog = true;
    },
    // 显示新增/编辑组弹出框
    showOperateGroupDialog (type, val) {
      this.groupForm.groupName = '';
      if (type === 'add') {
        this.isAddGroup = true;
        this.dialogTitle = '新增组';
      } else {
        this.currentGroupId = val.id;
        this.isAddGroup = false;
        this.dialogTitle = '编辑组';
        this.groupForm.groupName = val.name;
      }
      this.showGroupDialog = true;
    },
    // 显示新增--修改车辆弹出框
    showAddVehicleDialog (form, type, obj) {
      // 清除已上传的图片
      if (this.$refs['uploadPic']) {
        this.$refs['uploadPic'].clearFiles();
        this.dialogImageUrl = null;
      }
      // 清空表单
      if (this.$refs[form]) {
        this.$refs[form].resetFields();
      }
      this.carForm.uid = null;
      if (type === 'add') {
        this.isAddVehicle = true;
        this.vehicleTitle = '新增';
      } else {
        this.isAddVehicle = false;
        this.vehicleTitle = '修改';
        if (obj.origin === 1) { // 底库的基础数据不可修改，只能修改所属组
          this.isAddDisabled = true;
        } else {
          this.isAddDisabled = false;
        }
        this.getDetail(obj);
      }
      this.dialogVisiable = true;
    },
    getDetail (obj) {
      if (obj) {
        getSpecialVehicleDetail(obj.uid)
          .then(res => {
            if (res) {
              let vehicleColor = res.data.vehicleColor;
              let vehicleType = res.data.vehicleType;
              let numberType = res.data.numberType;
              let numberColor = res.data.numberColor;
      
              this.fileList = res.data.vehicleImagePath ? [{url: res.data.vehicleImagePath}] : [];//回填图片
              this.dialogImageUrl = res.data.vehicleImagePath;
              this.carForm.uid = res.data.uid;
              this.carForm.vehicleNumber = res.data.vehicleNumber;
              this.carForm.desci = res.data.desci;
              this.carForm.ownerName = res.data.ownerName;
              this.carForm.ownerIdCard = res.data.ownerIdCard;
              this.carForm.ownerIdType = res.data.ownerIdType;
      
              if (res.data.groupList.length > 0) {
                res.data.groupList.map(item => {
                  this.carForm.groupList.push(item.uid);
                });
              }
              this.carForm.vehicleColor = res.data.vehicleColor;;
              this.carForm.vehicleType = res.data.vehicleType;
              this.carForm.numberType = res.data.numberType;
              this.carForm.numberColor = numberColor && numberColor.toString();

            }
          })
      }
    },
    // 取消新增--修改车辆
    cancelOperation (form) {
      this.$refs[form].resetFields();
      this.dialogVisiable = false;
    },
    // 根据搜索条件查询车辆
    searchData () {
      this.pagination.pageNum = 1;
      this.getVehicleList();
    },
    // 重置搜索条件
    resetData (form) {
      this.pagination.pageNum = 1;
      this.$refs[form].resetFields();
      this.getVehicleList();
    },
    // 分页
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getVehicleList();
    },
    // 导出车辆
    exportVehicle () {
      let vehicleColor, vehicleType, numberType;
      if (this.searchForm.vehicleType === '不限') {
        vehicleType = null;
      } else {
        vehicleType = this.searchForm.vehicleType;
      }
      if (this.searchForm.vehicleColor === '不限') {
        vehicleColor = null;
      } else {
        vehicleColor = this.searchForm.vehicleColor;
      }
      if (this.searchForm.numType === '不限') {
        numberType = null;
      } else {
        numberType = this.searchForm.numType;
      }
      const params = {
        viewType: 1, // 1--特殊车辆
        vehicleQueryDto: {
          endTime: this.searchForm.dateTime[1],
          startTime: this.searchForm.dateTime[0],
          vehicleColor,
          vehicleType,
          numberType,
          vehicleNumber: this.searchForm.vehicleNo,
          groupId: this.activeId
        }
      };
      vehicleExport(params)
        .then(res => {
          if (res) {
            // console.log('res', res)
            // let a = document.createElement('a');
            // a.setAttribute('href', res.data);
            // a.setAttribute('id', 'export_id');
            // a.setAttribute('target', '_blank');
            // // 防止反复添加
            // if (document.getElementById('export_id')) {
            //   document.body.removeChild(document.getElementById('export_id'));
            // }
            // document.body.appendChild(a);
            // a.click();
          }
        })
    },
  }
}
</script>

<style lang="scss" scoped>
.special_vehicle {
  padding: 20px;
  height: 100%;
  width: 100%;
  display: flex;
  .vehicle_left {
    width: 260px;
    height: 100%;
    border-right: 1px solid #F2F2F2;
    background-color: #ffffff;
    .add_btn {
      margin-top: 20px;
      padding: 0 15px 10px;
      display: flex;
      color: #333333;
      align-items: center;
      width: 120px;
      cursor: pointer;
      > span {
        margin-left: 5px;
      }
    }
    .content_box {
      height: calc(100% - 60px);
      .temp_detail_info {
        height: 100%;
        > li {
          width: auto;
          cursor: pointer;
          font-size: 14px;
          line-height: 26px;
          color: #333333;
          padding: 0 30px 0;
            >span {
              margin-left: 5px;
            }
            .operation_btn {
              display: none;
              float: right;
              margin: 5px 5px 0;
            }
            .del_btn {
              &:hover {
                background-position: -694px -350px !important;
              }
            }
            .edit_btn {
              &:hover {
                background-position: -584px -350px !important;
              }
            }
            &:hover {
              background-color: #E0F2FF;
              .operation_btn {
                display: block;
              }
            }
            &.temp_active {
              background-color: #E0F2FF;
              i, span {
                color: #0C70F8;
              }
            }
        }
      }
    }
  }
  .vehicle_right {
    width: calc(100% - 260px);
    background-color: #ffffff;
    .search_right_box {
      width: 100%;
      padding: 20px 0 20px 20px;
      .search_form {
        width: 100%;
        .select_btn, .reset_btn {
          // width: 80px;
        }
        .operation_form_btn {
          // float: right;
          // margin-right: 40px;
        }
      }
      .divide {
        border: 1px dashed #fafafa;
      }
    }
    .button_box {
      padding-left: 20px;
    }
    .vehicle_box {
      width: 100%;
      height: calc(100% - 240px);
      overflow-y: scroll;
      padding: 0 20px;
      ul {
        display: flex;
        flex-wrap: wrap;
        >li {
          margin-top: 20px;
          width: 49%;
          box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
          border-radius:4px;
          border:1px solid rgba(211,211,211,1);
          padding: 15px;
          display: flex;
          &:nth-child(even) {
            margin-left: 1%;  
          }
          .left {
            width: 200px;
            height: 200px;
            position: relative;
            > img {
              position: absolute;
              margin-left: -75px;
              margin-top: -75px;
              left: 50%;
              top: 50%;
              display: block;
              width: 150px;
              height: 150px;
              max-width: 200px;
              max-height: 200px;
            }
          }
          .right {
            width: calc(100% - 150px);
            padding-left: 15px;
            .title {
              display: flex;
              justify-content: space-between;
              >p {
                display: flex;
                align-items: center;
                >span {
                  color: #999999;
                  margin-right: 5px;
                  margin-bottom: 5px;
                }
                .edit_btn {
                  cursor: pointer;
                  &:hover {
                    background-position: -584px -350px !important;
                  }
                }
              }
              
            }
            .info_list {
              display: flex;
              flex-wrap: wrap;
              .more {
                >span {
                  background-color: #FAFAFA;
                  color: #333333;
                  font-size: 12px;
                  border-radius:3px;
                  padding: 5px 8px;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  border: 1px solid #F2F2F2;
                  display: inline-block;
                  cursor: pointer;
                  &:hover {
                    border-color: #0C70F8;
                    color: #0C70F8;
                    background-color: #ffffff;
                  }
                }
              }
              >span {
                display: inline-block;
                background-color: #FAFAFA;
                color: #333333;
                font-size: 12px;
                border-radius:3px;
                padding: 5px 8px;
                margin-right: 5px;
                margin-bottom: 5px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                border: 1px solid #F2F2F2;
              }
            }
            .group_list {
              >span {
                max-width: 80px;
              }
            }
          }
        }
      }
    }
  }
  .select_btn {
    background-color: #0C70F8;
    color: #ffffff;
  }
  .disabled_btn {
    background:rgba(242,242,242,1);
    border:1px solid rgba(211,211,211,1);
    border-radius:4px;
    color: #B2B2B2;
  }
  .reset_btn {
    background-color: #ffffff;
    color: #666666;
    border-color: #DDDDDD;
    &:hover {
      background-color: #ffffff;
      color: #0C70F8;
      border-color: #0C70F8;

    }
  }
}
.dialog_comp_vehicle {
  width: 100%;
  /deep/ .el-dialog__header {
    padding-left: 45px;
    font-size: 16px;
    color: #333333;
    font-weight: bold;
  }
  .content_body {
    width: 100%;
    display: flex;
    height: 577px;
    .left {
      width:240px;
      border-right: 1px solid #F2F2F2;
      padding-top: 168px;
      text-align: center;
      .upload_pic {
        text-align: center;
        margin-left: 30px;
        width: 160px;
        height: 160px;
        overflow: hidden;
        margin-bottom: 25px;
        /deep/ .el-upload {
          width: 160px;
          height: 160px;
          
          i {
             width: 120px;
            height: 110px;
          }
          &:hover{
            background: #0C70F8;
            i.vl_icon_control_14{
              background-position: -228px -570px;
            }
          }
        }
        &.hidden /deep/ .el-upload--picture-card{
          display: none!important;
        }
        /deep/ .el-upload-list__item {
          width: 160px;
          height: 160px;
        }
      }
      .vl_f_999 {
        color: #999999;
        margin-right: 20px;
      }
      > p {
        margin-right: 20px;
        margin-top: 92px;
        color: #D3D3D3;
      }
    }
    .right {
      width: calc(100% - 240px);
      padding: 0 10px 0 20px;
    }
  }
}
.dialog_comp {
  .content_body {
    margin-top: 20px;
    /deep/ .el-dialog__body {
      padding: 0px 20px 10px;
    }
    .group_form {
      .error_input {
        /deep/ .el-input__inner {
          border-color: #F56C6C;
        }
      }
    }
    .group_error_tip {
      font-size: 12px;
      color: #F56C6C;
    }
  }
}
// 重置布控库popover
.more_popover_box .more_popover{
  max-height: 240px;
  display: flex;
  flex-wrap: wrap;
  > span{
    background-color: #FAFAFA;
    color: #333333;
    font-size: 12px;
    border-radius:3px;
    padding: 5px 8px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    border: 1px solid #F2F2F2;
    margin-bottom: 10px;
    margin-right: 5px;
    display: inline-block;
    cursor: pointer;
  }
}
</style>

