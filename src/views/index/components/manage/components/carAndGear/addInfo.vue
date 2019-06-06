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
          <el-form-item label="车牌号码:" prop="vehicleNo">
            <el-input style="width: 40%;" placeholder="请输入车牌号码" v-model="addCar.vehicleNo"></el-input>
          </el-form-item>
          <el-form-item label="车辆编号:" prop="vehicleNum">
            <el-input style="width: 40%;" placeholder="请输入车辆编号" v-model="addCar.vehicleNum"></el-input>
          </el-form-item>
          <el-form-item label="识别代码:" prop="identCode">
            <el-input style="width: 40%;" placeholder="请输入识别代码" v-model="addCar.identCode"></el-input>
          </el-form-item>
          <el-form-item label="车辆类型:" prop="vehicleType">
            <el-select style="width: 40%;" v-model="addCar.vehicleType" placeholder="请选择车辆类型">
              <!-- <el-option
                v-for="(item, index) in departmentData"
                :key="index"
                :label="item.organName"
                :value="item.uid"
              ></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="核载人数:" prop="personNum">
            <el-input style="width: 40%;" placeholder="请输入核载人数" v-model="addCar.personNum"></el-input>
          </el-form-item>
          <el-form-item label="车身颜色:" prop="vehicleColor">
            <el-select style="width: 40%;" v-model="addCar.vehicleColor" placeholder="请选择车身颜色">
              <!-- <el-option
                v-for="(item, index) in departmentData"
                :key="index"
                :label="item.organName"
                :value="item.uid"
              ></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="号牌种类:" prop="numKind">
            <el-select style="width: 40%;" v-model="addCar.numKind" placeholder="请选择号牌种类">
              <!-- <el-option
                v-for="(item, index) in departmentData"
                :key="index"
                :label="item.organName"
                :value="item.uid"
              ></el-option> -->
            </el-select>
          </el-form-item>
           <el-form-item label="号牌颜色:" prop="numColor">
            <span>{{addCar.numColor}}</span>
          </el-form-item>
          <el-form-item label="所属单位:" prop="organId">
            <el-select style="width: 40%;" v-model="addCar.organId" placeholder="请选择所在部门单位">
              <!-- <el-option
                v-for="(item, index) in departmentData"
                :key="index"
                :label="item.organName"
                :value="item.uid"
              ></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="设备账号:" prop="deviceNo">
            <el-input style="width: 40%;" placeholder="请输入设备账号" v-model="addCar.deviceNo"></el-input>
          </el-form-item>
          <el-form-item label="访问密码:" prop="password">
            <el-input style="width: 40%;" placeholder="请输入访问密码" v-model="addCar.password"></el-input>
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
export default {
  data () {
    return {
      isAddLoading: false, // 添加加载中
      addCar: {
        vehicleNo: null,
        vehicleNum: null,
        identCode: null,
        vehicleType: null,
        personNum: null,
        vehicleColor: null,
        numKind: null,
        numColor: '蓝底白色',
        organId: null,
        deviceNo: null,
        password: null
      },
      rules: {
        vehicleNo: [
          { required: true, message: '该项内容不能为空', trigger: 'blur' }
        ],
        vehicleType: [
          { required: true, message: '该项内容不能为空', trigger: 'blur' }
        ],
        organId: [
          { required: true, message: '该项内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 取消提交
    cancelSubmit (form) {
      this.$refs[form].resetFields();
      this.$router.back(-1);
    },
    // 确认提交
    submitData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {}
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

