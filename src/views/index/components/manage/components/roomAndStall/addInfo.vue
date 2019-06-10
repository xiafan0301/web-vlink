<template>
<vue-scroll>
  <div class="add_room">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manage/archivesManage/roomStall'}">档案管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/archivesManage/roomStall'}">一室一档</el-breadcrumb-item>
        <el-breadcrumb-item>新增</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="add_box">
      <p class="title">新增点室</p>
      <div class="content-body">
        <el-form :model="addRoom" :rules="rules" ref="addRoom" label-width="90px">
          <el-form-item label="点室名称:" prop="roomName">
            <el-input style="width: 600px;" placeholder="请输入点室名称" v-model="addRoom.roomName"></el-input>
          </el-form-item>
          <el-form-item label="点室编号:" prop="roomNumber">
            <el-input style="width: 40%;" placeholder="请输入点室编号" v-model="addRoom.roomNumber"></el-input>
          </el-form-item>
          <el-form-item label="所属单位:" prop="organId">
            <el-select style="width: 40%;" v-model="addRoom.organId" placeholder="请选择所属单位">
              <el-option
                v-for="(item, index) in departmentList"
                :key="index"
                :label="item.organName"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="责任人:" prop="dutyUserName">
            <el-input style="width: 40%;" placeholder="请输入责任人姓名" v-model="addRoom.dutyUserName"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" prop="userMobile">
            <el-input style="width: 40%;" placeholder="请输入联系电话" v-model="addRoom.userMobile"></el-input>
          </el-form-item>
          <el-form-item label="所属地址:" prop="address">
            <el-select style="width: 200px;" v-model="addRoom.province" placeholder="省">
              <!-- <el-option
                v-for="(item, index) in departmentData"
                :key="index"
                :label="item.organName"
                :value="item.uid"
              ></el-option> -->
            </el-select>
            <el-select style="width: 100px;" v-model="addRoom.address" placeholder="市">
              <!-- <el-option
                v-for="(item, index) in departmentData"
                :key="index"
                :label="item.organName"
                :value="item.uid"
              ></el-option> -->
            </el-select>
            <el-select style="width: 100px;" v-model="addRoom.address" placeholder="县">
              <!-- <el-option
                v-for="(item, index) in departmentData"
                :key="index"
                :label="item.organName"
                :value="item.uid"
              ></el-option> -->
            </el-select>
            <el-select style="width: 100px;" v-model="addRoom.address" placeholder="镇">
              <!-- <el-option
                v-for="(item, index) in departmentData"
                :key="index"
                :label="item.organName"
                :value="item.uid"
              ></el-option> -->
            </el-select>
            <el-select style="width: 100px;" v-model="addRoom.address" placeholder="区">
              <!-- <el-option
                v-for="(item, index) in departmentData"
                :key="index"
                :label="item.organName"
                :value="item.uid"
              ></el-option> -->
            </el-select>
            <el-input type="text" style="width: 40%;" placeholder="请输入详细地址" v-model="addRoom.address"></el-input>
          </el-form-item>
          <el-form-item label="使用状况:" prop="isEnable">
            <el-radio-group style="width: 40%;" v-model="addRoom.isEnable">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="2">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述:" prop="desci">
            <el-input type="textarea" rows="5" style="width: 40%;" placeholder="请输入描述内容" v-model="addRoom.desci"></el-input>
          </el-form-item>
          
        </el-form>
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="submitData('addRoom')">确定</el-button>
      <el-button class="operation_btn back_btn" @click="cancelSubmit('addRoom')">取消</el-button>
    </div>
  </div>
</vue-scroll>
</template>
<script>
import { validatePhone } from '@/utils/validator.js';
import { getDepartmentList } from '@/views/index/api/api.manage.js';
export default {
  data () {
    return {
      isAddLoading: false, // 添加加载中
      addRoom: {
        desci: null, // 描述
        dutyUserName: null, // 责任人
        staisEnabletus: 1, // 使用状况
        userMobile: null, // 联系电话
        organId: null, // 所属单位
        roomNumber: null, // 点室编号
        roomName: null, // 点室名称
        province: null, // 省
        address: null // 所属地址
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
    }
  },
  mounted () {
    this.userInfo = this.$store.state.loginUser;

    this.getDepartList();
  },
  methods: {
    // 获取当前部门及子级部门
    getDepartList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        'where.organPid': this.userInfo.organList[0].uid,
        pageSize: 0
      };
      getDepartmentList(params)
        .then(res => {
          if (res) {
            this.departmentList.push(this.userInfo.organList[0]);
            res.data.list.map(item => {
              this.departmentList.push(item);
            });
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
        if (valid) {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add_room {
  .add_box {
    margin: 0 10px 20px;
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

