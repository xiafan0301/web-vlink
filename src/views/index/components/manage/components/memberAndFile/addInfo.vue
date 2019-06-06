<template>
<vue-scroll>
  <div class="add_member">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manage/archivesManage/memberFile'}">档案管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/archivesManage/memberFile'}">一员一档</el-breadcrumb-item>
        <el-breadcrumb-item>新增</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="add_box">
      <p class="title">新增成员</p>
      <div class="content-body">
        <el-form :model="addUser" :rules="rules" ref="addUser" label-width="90px">
          <el-form-item label="成员账户:" prop="memberNo">
            <el-select
              style="width: 40%;"
              v-model="addUser.memberNo"
              multiple
              filterable
              remote
              reserve-keyword
              :multiple-limit="50"
              placeholder="请选择或输入成员账户"
              :remote-method="remoteMethod"
              :loading="loading">
              <el-option
                v-for="item in reportUserList"
                :key="item.uid"
                :label="item.userRealName"
                :value="item.uid">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名:" prop="userName">
            <el-input style="width: 40%;" placeholder="请输入姓名" v-model="addUser.userName"></el-input>
          </el-form-item>
          <el-form-item label="性别:" prop="userSex">
            <el-radio-group style="width: 40%;" v-model="addUser.userSex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="邮箱:" prop="userEmail">
            <el-input style="width: 40%;" placeholder="请输入邮箱" v-model="addUser.userEmail"></el-input>
          </el-form-item>
          <el-form-item label="所属单位:" prop="organId">
            <el-select style="width: 40%;" v-model="addUser.organId" placeholder="请选择所属单位">
              <!-- <el-option
                v-for="(item, index) in departmentData"
                :key="index"
                :label="item.organName"
                :value="item.uid"
              ></el-option> -->
            </el-select>
          </el-form-item>
           <el-form-item label="成员编号:" prop="memberNum">
            <el-input style="width: 40%;" placeholder="请输入成员的部门编号" v-model="addUser.memberNum"></el-input>
          </el-form-item>
          <el-form-item label="职位:" prop="job">
            <el-select style="width: 40%;" v-model="addUser.job" placeholder="请选择职位">
              <!-- <el-option
                v-for="(item, index) in departmentData"
                :key="index"
                :label="item.organName"
                :value="item.uid"
              ></el-option> -->
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="submitData('addUser')">确定</el-button>
      <el-button class="operation_btn back_btn" @click="cancelSubmit('addUser')">取消</el-button>
    </div>
  </div>
</vue-scroll>
</template>
<script>
export default {
  data () {
    return {
      loading: false,
      isAddLoading: false, // 添加加载中
      addUser: {
        memberNo: null,
        userName: null,
        userSex: 1,
        userEmail: null,
        organId: null,
        memberNum: null,
        job: null
      },
      rules: {
        memberNo: [
          { required: true, message: '该项内容不能为空', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '该项内容不能为空', trigger: 'blur' }
        ],
        userSex: [
          { required: true, message: '该项内容不能为空', trigger: 'blur' }
        ],
        organId: [
          { required: true, message: '该项内容不能为空', trigger: 'blur' }
        ]
      },
      reportUserList: [],
      userList: []
    }
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.reportUserList = this.userList.filter(item => {
            return item.userRealName.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.reportUserList = [];
      }
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
.add_member {
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

