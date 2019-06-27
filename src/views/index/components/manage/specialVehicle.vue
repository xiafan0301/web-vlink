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
              :class="[activeId === item.uid ? 'temp_active' : '']"
              v-for="(item, index) in groupList"
              :key="'item' + index"
              @click="showGroupDeviceInfo(item.uid)"
            >
              <span>{{item.groupName}}  (112)</span>
              <i class="operation_btn del_btn vl_icon vl_icon_manage_8" @click="showDeleteDialog(item.uid)"></i>
              <i class="operation_btn edit_btn vl_icon vl_icon_manage_7" @click="showOperateGroupDialog('edit', item)"></i>
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
              range-separator="-"
              start-placeholder="开始日期"
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
          <el-form-item class="operation_form_btn" style="width: 250px;">
            <el-button class="select_btn" @click="searchData">查询</el-button>
            <el-button class="reset_btn" @click="resetData('searchForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="divide"></div>
      </div>
      <div class="button_box">
        <el-button class="select_btn" @click="showAddVehicleDialog('add')">新增车辆</el-button>
        <el-button class="reset_btn">导入车辆</el-button>
        <el-button class="reset_btn">导出车辆</el-button>
        <el-button class="reset_btn">删除车辆</el-button>
      </div>
      <div class="vehicle_box">
        <ul>
          <li>
            <div class="left">
              <img src="../../../../assets/img/temp/vis-eg.png" />
            </div>
            <div class="right">
              <div class="title">
                <p>
                  <span>详细资料</span>
                  <i class="operation_btn edit_btn vl_icon vl_icon_manage_7" @click="showAddVehicleDialog('edit')"></i>
                </p>
                <el-checkbox class="check_box"></el-checkbox>
              </div>
              <div class="info_list">
                <span>湘A123456</span>
                <span>车身白色</span>
                <span>大客车</span>
                <span>大众旗悦</span>
              </div>
              <div class="info_list">
                <span>蓝底白字（小型汽车号牌）</span>
              </div>
              <div class="info_list">
                <span>张三（432512199009087653）</span>
              </div>
              <div class="info_list">
                <span>自定义组名称12自定义组名称12自定义组名称12自定义组名称12自定义组名称12自定义组名称12自定义组名称12自定义组名称12</span>
              </div>
              <div class="info_list">
                <span>红名单</span>
                <span>网约车</span>
                <span>遮牌车</span>
                <span>更多组</span>
              </div>
            </div>
          </li>
          <li>
            <div class="left">
              <img src="../../../../assets/img/temp/vis-eg.png" />
            </div>
            <div class="right">
              <div class="title">
                <p>
                  <span>详细资料</span>
                  <i class="operation_btn edit_btn vl_icon vl_icon_manage_7"></i>
                </p>
                <el-checkbox class="check_box"></el-checkbox>
              </div>
              <div class="info_list">
                <span>湘A123456</span>
                <span>车身白色</span>
                <span>大客车</span>
                <span>大众旗悦</span>
              </div>
              <div class="info_list">
                <span>蓝底白字（小型汽车号牌）</span>
              </div>
              <div class="info_list">
                <span>张三（432512199009087653）</span>
              </div>
              <div class="info_list">
                <span>自定义组名称12自定义组名称12自定义组名称12自定义组名称12自定义组名称12自定义组名称12自定义组名称12自定义组名称12</span>
              </div>
              <div class="info_list">
                <span>红名单</span>
                <span>网约车</span>
                <span>遮牌车</span>
                <span>更多组</span>
              </div>
            </div>
          </li>
          <li>
            <div class="left">
              <img src="../../../../assets/img/temp/vis-eg.png" />
            </div>
            <div class="right">
              <div class="title">
                <p>
                  <span>详细资料</span>
                  <i class="operation_btn edit_btn vl_icon vl_icon_manage_7"></i>
                </p>
                <el-checkbox class="check_box"></el-checkbox>
              </div>
              <div class="info_list">
                <span>湘A123456</span>
                <span>车身白色</span>
                <span>大客车</span>
                <span>大众旗悦</span>
              </div>
              <div class="info_list">
                <span>蓝底白字（小型汽车号牌）</span>
              </div>
              <div class="info_list">
                <span>张三（432512199009087653）</span>
              </div>
              <div class="info_list">
                <span>自定义组名称12自定义组名称12自定义组名称12自定义组名称12自定义组名称12自定义组名称12自定义组名称12自定义组名称12</span>
              </div>
              <div class="info_list">
                <span>红名单</span>
                <span>网约车</span>
                <span>遮牌车</span>
                <span>更多组</span>
              </div>
            </div>
          </li>
          <li>
            <div class="left">
              <img src="../../../../assets/img/temp/vis-eg.png" />
            </div>
            <div class="right">
              <div class="title">
                <p>
                  <span>详细资料</span>
                  <i class="operation_btn edit_btn vl_icon vl_icon_manage_7"></i>
                </p>
                <el-checkbox class="check_box"></el-checkbox>
              </div>
              <div class="info_list">
                <span>湘A123456</span>
                <span>车身白色</span>
                <span>大客车</span>
                <span>大众旗悦</span>
              </div>
              <div class="info_list">
                <span>蓝底白字（小型汽车号牌）</span>
              </div>
              <div class="info_list">
                <span>张三（432512199009087653）</span>
              </div>
              <div class="info_list">
                <span>自定义组名称12自定义组名称12自定义组名称12自定义组名称12自定义组名称12自定义组名称12自定义组名称12自定义组名称12</span>
              </div>
              <div class="info_list">
                <span>红名单</span>
                <span>网约车</span>
                <span>遮牌车</span>
                <span>更多组</span>
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
              :disabled="isAddDisabled"
              ref="uploadPic"
              accept="image/*"
              :limit="1"
              :action="uploadUrl"
              :data="{projectType: 2}"
              list-type="picture-card"
              :on-success="uploadPicSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
              :file-list="fileList">
              <i class="vl_icon vl_icon_control_14"></i>
            </el-upload>
          </div>
          <template v-if="!isAddDisabled">
            <h1 class="vl_f_999">点击修改车像</h1>
            <p>请上传车辆图片</p>
          </template>
        </div>
        <div class="right">
          <vue-scroll>
            <el-form ref="carForm" :model="carForm">
              <el-form-item label=" ">
                <el-input v-model="form.name" placeholder="车牌号码" style="width: 85%;"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-select v-model="form.region" placeholder="请选择车身颜色" style="width: 85%;">
                  <el-option
                    v-for="(item, index) in vehicleColorList"
                    :key="index"
                    :label="item.enumValue"
                    :value="item.enumField"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-select v-model="form.region" placeholder="请选择车辆类型" style="width: 85%;">
                  <el-option
                    v-for="(item, index) in vehicleTypeList"
                    :key="index"
                    :label="item.enumValue"
                    :value="item.enumField"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-select v-model="form.region" placeholder="请选择品牌" style="width: 37%;">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
                <el-select v-model="form.region" placeholder="请选择型号" style="width: 45%; margin-left: 3%">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-select v-model="form.region" placeholder="请选择号牌类型" style="width: 85%;">
                  <el-option
                    v-for="(item, index) in numberTypeList"
                    :key="index"
                    :label="item.enumValue"
                    :value="item.enumField"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-select v-model="form.region" placeholder="请选择号牌颜色" style="width: 85%;">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label=" ">
                <el-input v-model="form.name" placeholder="车主姓名" style="width: 85%;"></el-input>
              </el-form-item>
              <el-form-item label=" ">
                <el-select v-model="form.region" placeholder="证件类型" style="width: 85%;">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label=" ">
                <el-input v-model="form.name" placeholder="证件号码" style="width: 85%;"></el-input>
              </el-form-item>
              <el-form-item label=" ">
                <el-input v-model="form.name" placeholder="车牌号码" style="width: 85%;"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-select v-model="form.region" placeholder="所属组" style="width: 85%;">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="">
                <el-input type="textarea" show-word-limit maxlength="100" rows="3" style="width: 85%;" v-model="form.name" placeholder="描述"></el-input>
              </el-form-item>
              <el-form-item style="margin-left: 20px;">
                <el-button class="reset_btn" style="width: 140px;">取消</el-button>
                <el-button class="disabled_btn"  @click="onSubmit" style="width: 140px;">保存</el-button>
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
        <el-form :model="groupForm" ref="groupForm" :rules="groupRules" >
          <el-form-item label="组名:" prop="groupName" label-width="70px">
            <el-input placeholder="请输入组名称" v-model="groupForm.groupName" style="width: 100%;" maxlength="6"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelOperation('groupForm')">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isAddloading" @click="addGroup('groupForm')" v-if="dialogTitle === '新增组'">新增</el-button>
        <el-button class="operation_btn function_btn" :loading="isAddloading" @click="editGroup('groupForm')" v-if="dialogTitle === '编辑组'">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ajaxCtx } from '@/config/config.js';
import { checkPlateNumber} from '@/utils/validator.js';
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
export default {
  data () {
    return {
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
      deleteId: null, // 要删除的组id
      delGroupDialog: false, // 删除组弹出框
      isDeleteLoading: false, // 删除组加载中
      showGroupDialog: false, // 新增/修改组弹出框
      isAddloading: false, // 新增组弹出框
      dialogVisiable: false, // 新建/修改车辆弹出框
      fileList: [],
      dialogImageUrl: null,
      uploadUrl: ajaxCtx.base + '/appendix', // 图片上传地址
      activeId: 1,
      isAddDisabled: false, // 是否能添加图片
      picHeight: null,
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      groupList: [
        {
          uid: 1,
          groupName: '红名单(112)'
        },
        {
          uid: 2,
          groupName: '网约车(101)'
        },
        {
          uid: 3,
          groupName: '遮牌车(451)'
        },
        {
          uid: 4,
          groupName: '自定义（0）'
        },
        {
          uid: 1,
          groupName: '红名单(112)'
        },
        {
          uid: 2,
          groupName: '网约车(101)'
        },
        {
          uid: 3,
          groupName: '遮牌车(451)'
        },
        {
          uid: 4,
          groupName: '自定义（0）'
        },
        {
          uid: 1,
          groupName: '红名单(112)'
        },
        {
          uid: 2,
          groupName: '网约车(101)'
        },
        {
          uid: 3,
          groupName: '遮牌车(451)'
        },
        {
          uid: 4,
          groupName: '自定义（0）'
        },
        {
          uid: 1,
          groupName: '红名单(112)'
        },
        {
          uid: 2,
          groupName: '网约车(101)'
        },
        {
          uid: 3,
          groupName: '遮牌车(451)'
        },
        {
          uid: 4,
          groupName: '自定义（0）'
        },
        {
          uid: 2,
          groupName: '网约车(101)'
        },
        {
          uid: 3,
          groupName: '遮牌车(451)'
        },
        {
          uid: 4,
          groupName: '自定义（0）'
        }
      ],
      searchForm: {
        dateTime: [],
        vehicleNo: null, // 车牌号码
        numType: null, // 号牌类型
        vehicleType: null, // 车辆类型
        vehicleColor: null, // 车身颜色
      },
      // 新增车像参数
      carForm: {
        vehicleNumber: null,
        vehicleColor: null,
        vehicleType: null,
        numberType: 2,
        numberColor: 2,
        groupIds: [],
        desci: ''
      },
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      numColorList: [
        {label: '黄底黑字', value: 1},
        {label: '蓝底白字', value: 2},
        {label: '蓝底白字', value: 8},
        {label: '黄底黑字黑框线', value: 15},
        {label: '白底黑字、红“警”字', value: 23},
        {label: '白底黑字、红“警”字', value: 24},
        {label: '渐变绿底黑字', value: 25},
        {label: '黄绿双拼底黑字', value: 26},
        // {label: '蓝底白字', value: 27},
        // {label: '黄底黑字', value: 28},
        // {label: '黄底黑字', value: 29},
        {label: '其他', value: 99}
      ],//号牌颜色列表
      vehicleTypeList: [], // 车辆类型列表
      vehicleColorList: [], // 车身颜色列表
      numberTypeList: [], // 号牌种类列表
    }
  },
  mounted () {
    this.getVehicleTypeList();
    this.getVehicleColor();
    this.getNumberTypeList();
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
    // 确认删除组
    deleteGroup () {

    },
    // 取消添加/编辑组
    cancelOperation (form) {
      this.$refs[form].resetFields();
      this.groupForm.groupName = null;
      this.showGroupDialog = false;
    },
    // 新增组
    addGroup (form) {
      this.$refs[form].validate(valid => {
        if (valid) {

        }
      });
    },
    // 编辑组
    editGroup (form) {
      this.$refs[form].validate(valid => {
        if (valid) {

        }
      });
    },
    onSubmit () {},
    handleRemove () {
      this.dialogImageUrl = null;
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadPicSuccess (file) {
      this.dialogImageUrl = file.data.sysCommonImageInfo.fileFullPath;
      // this.$message.success('上传成功！');
    },
    uploadPicError () {
      this.$message.error('上传失败！');
    },
    uploadPicExceed () {
      this.$message.warning('最多一次可上传1张图片,不能上传非图片文件');
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
    // 通过车牌号搜索车辆
    getVehicleByVehicleNumber () {
      const carIdNo = this.Trim(this.carForm.vehicleNumber, 'g');
      if (this.lastCarIdNo === carIdNo) return;
      this.lastCarIdNo = carIdNo;
      const params = {
        vehicleNumber: carIdNo
      }
      if (carIdNo) {
        getVehicleByVehicleNumber(params).then(res => {
          // 已存在车像
          if (res && res.data && res.data.length > 0) {
            let carInfo = res.data[0];
            if (carInfo.origin === 1) {
              this.fileList = carInfo.vehicleImagePath ? [{url: carInfo.vehicleImagePath}] : [];//回填图片
              this.dialogImageUrl = carInfo.vehicleImagePath;
              carInfo.groupIds = carInfo.groupList.filter(f => f.selected).map(m => m.uid);
              this.isAddDisabled = true;
              carInfo.uid = this.carForm.uid;
              carInfo.origin = this.carForm.origin;
              this.carForm = carInfo;
            } else {
              this.isAddDisabled = false;
              this.$message.warning('布控库已存在，请修改车牌号码');
            }
          // 不存在车像
          } else {
            this.isAddDisabled = false;
          }
        })
      }
    },
    showGroupDeviceInfo () {},
    // 显示删除组弹出框
    showDeleteDialog (id) {
      this.deleteId = id;
      this.delGroupDialog = true;
    },
    // 显示新增/编辑组弹出框
    showOperateGroupDialog (type, val) {
      if (type === 'add') {
        this.dialogTitle = '新增组';
      } else {
        this.dialogTitle = '编辑组';
      }
      this.showGroupDialog = true;
    },
    // 显示新增--修改车辆弹出框
    showAddVehicleDialog (type) {
      if (type === 'add') {
        this.vehicleTitle = '新增';
      } else {
        this.vehicleTitle = '修改';
      }
      this.dialogVisiable = true;
    },
    searchData () {},
    resetData () {},
    handleCurrentChange () {}
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
          width: 80px;
        }
        .operation_form_btn {
          float: right;
          margin-right: 40px;
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
              // margin: 5px 0;
              display: flex;
              flex-wrap: wrap;
              // width: 100%;
              >span {
                // width: 100%;
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
  }
}
</style>

