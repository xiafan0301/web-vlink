<template>
<vue-scroll>
  <div class="add_car">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manage/archivesManage/carGear'}">档案管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/archivesManage/carGear'}">一车一档</el-breadcrumb-item>
        <el-breadcrumb-item>新增</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="add_box">
      <p class="title">新增车辆档案</p>
      <div class="content-body">
        <el-form :model="addCar" :rules="rules" ref="addCar" label-width="90px">
          <el-form-item label="车牌号码:" prop="vehicleNumber">
            <el-input style="width: 40%;" placeholder="请输入车牌号码" v-model="addCar.vehicleNumber" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="车辆编号:" prop="transportNo">
            <el-input style="width: 40%;" placeholder="请输入车辆编号" v-model="addCar.transportNo" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="识别代码:" prop="identityNo">
            <el-input style="width: 40%;" placeholder="请输入识别代码" v-model="addCar.identityNo" maxlength="17"></el-input>
          </el-form-item>
          <el-form-item label="车辆类型:" prop="vehicleType">
            <el-select style="width: 40%;" v-model="addCar.vehicleType" placeholder="请选择车辆类型">
              <el-option
                v-for="(item, index) in vehicleTypeList"
                :key="index"
                :label="item.enumValue"
                :value="item.enumField"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="核载人数:" prop="capacityPeople">
            <el-input style="width: 40%;" placeholder="请输入核载人数" v-model="addCar.capacityPeople" maxlength="2"></el-input>
          </el-form-item>
          <el-form-item label="车身颜色:" prop="vehicleColor">
            <el-select style="width: 40%;" v-model="addCar.vehicleColor" placeholder="请选择车身颜色">
              <el-option
                v-for="(item, index) in vehicleColorList"
                :key="index"
                :label="item.enumValue"
                :value="item.enumField"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="号牌种类:" prop="numberType">
            <el-select style="width: 40%;" v-model="addCar.numberType" placeholder="请选择号牌种类" @change="handleNumberType">
              <el-option
                v-for="(item, index) in numberTypeList"
                :key="index"
                :label="item.enumValue"
                :value="item.enumField"
              ></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="号牌颜色:" prop="numberColor">
            <span>{{addCar.numberColor}}</span>
          </el-form-item>
          <el-form-item label="所属单位:" prop="organId">
            <el-select style="width: 40%;" v-model="addCar.organId" placeholder="请选择所在部门单位">
              <el-option
                v-for="(item, index) in departmentList"
                :key="index"
                :label="item.organName"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运营公司:" prop="organId">
            <el-select style="width: 40%;" v-model="addCar.organId" placeholder="请选择运营公司">
              <el-option
                v-for="(item, index) in departmentList"
                :key="index"
                :label="item.organName"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备账号:" prop="deviceAccount">
            <el-input style="width: 40%;" placeholder="请输入设备账号" v-model="addCar.deviceAccount"></el-input>
          </el-form-item>
          <el-form-item label="访问密码:" prop="devicePassword">
            <el-input style="width: 40%;" placeholder="请输入访问密码" v-model="addCar.devicePassword"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="submitData('addCar')">确定</el-button>
      <el-button class="operation_btn back_btn" @click="cancelSubmit('addCar')">取消</el-button>
    </div>
  </div>
</vue-scroll>
</template>
<script>
import { validatePersonNum, checkPlateNumber } from '@/utils/validator.js';
import { dataList } from '@/utils/data.js';
// import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
import { getDepartmentList } from '@/views/index/api/api.manage.js';
import { addVehicle } from '@/views/index/api/api.archives.js';
export default {
  data () {
    return {
      isAddLoading: false, // 添加加载中
      addCar: {
        vehicleNumber: null, // 车牌号码
        transportNo: null, // 车牌编号
        identityNo: null, // 识别代码
        vehicleType: null, // 车辆类型
        capacityPeople: null, // 核载人数
        vehicleColor: null, // 车身颜色
        numberType: null, // 号牌种类
        numberColor: null, // 号牌颜色
        organId: null, // 所属单位
        deviceAccount: null, // 设备账号
        devicePassword: null // 访问密码
      },
      rules: {
        vehicleNumber: [
          { required: true, message: '该项内容不能为空', trigger: 'blur' },
          { validator: checkPlateNumber, trigger: 'blur' }
        ],
        vehicleType: [
          { required: true, message: '该项内容不能为空', trigger: 'blur' }
        ],
        capacityPeople: [
          { validator: validatePersonNum, trigger: 'blur' }
        ],
        organId: [
          { required: true, message: '该项内容不能为空', trigger: 'blur' }
        ]
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
      vehicleTypeList: [], // 车辆类型
      vehicleColorList: [], // 车身颜色
      userInfo: {}, // 用户信息
      numberTypeList: [], // 号牌种类
      departmentList: [], // 部门列表
    }
  },
  mounted () {
    this.userInfo = this.$store.state.loginUser;

    this.getVehicleTypeList();
    this.getVehicleColor();
    this.getNumberTypeList();
    this.getDepartList();
  },
  methods: {
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
    // 获取当前部门及子级部门
    getDepartList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        'where.organPid': this.$route.query.organObj.uid,
        pageSize: 0
      };
      getDepartmentList(params)
        .then(res => {
          if (res) {
            this.departmentList.push(this.$route.query.organObj);
            res.data.list.map(item => {
              this.departmentList.push(item);
            });
            this.departmentList.map(val => {
              if (val.uid == this.$route.query.organObj.uid) {
                this.addCar.organId = val.uid;
              } 
            });
          }
        })
    },
    // 号牌种类change
    handleNumberType (val) {
      this.numColorList.map(item => {
        if (item.value == val) {
          this.addCar.numberColor = item.label;
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
          this.isAddLoading = true;
          addVehicle(this.addCar)
            .then(res => {
              if (res) {
                this.isAddLoading = false;
                this.$message({
                  type: 'success',
                  message: '新增成功',
                  customClass: 'request_tip'
                });
                this.$router.push({name: 'car_gear'});
              } else {
                this.isAddLoading = false;
              }
            })
            .catch(() => {this.isAddLoading = false;})
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add_car {
  .add_box {
    margin: 0 10px 20px;
    // padding: 10px;
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

