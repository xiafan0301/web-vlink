<template>
  <vue-scroll>
    <div class="add-user">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/manage/user' }">用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>新增用户</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="single-user">
        <p class="title">单个创建</p>
        <div class="content-body">
          <p>创建用户会为新用户创建账号，系统将密码以短信形式发送至新用户。</p>
          <el-form :model="addUser" :rules="rules" ref="addUser" label-width="90px">
            <el-form-item label="手机号码:" prop="userMobile">
              <el-input style="width: 40%;" placeholder="请输入手机号码" v-model="addUser.userMobile"></el-input>
            </el-form-item>
            <el-form-item label="姓名:" prop="userName">
              <el-input style="width: 40%;" placeholder="请输入姓名" v-model="addUser.userName"></el-input>
            </el-form-item>
            <el-form-item label="性别:" prop="name">
              <el-radio-group style="width: 40%;" v-model="addUser.userSex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="身份证号:" prop="userIdcard">
              <el-input style="width: 40%;" placeholder="请输入用户身份证号" v-model="addUser.userIdcard"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="userEmail">
              <el-input style="width: 40%;" placeholder="请输入邮箱" v-model="addUser.userEmail"></el-input>
            </el-form-item>
            <el-form-item label="所属部门:" prop="organId">
              <el-select style="width: 40%;" v-model="addUser.organId" placeholder="请选择部门">
                <el-option
                  v-for="(item, index) in departmentData"
                  :key="index"
                  :label="item.organName"
                  :value="item.uid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button class="user_btn function_btn" :loading="isAddLoading" @click="submitForm('addUser')">新增</el-button>
              <el-button class="user_btn back_btn" @click="resetForm('addUser')">返回</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="multiple-user">
        <p class="title">批量创建</p>
        <div class="multiple-content-body">
          <p>您需要下载模板文件并按要求填写相关信息，上传成功后，点击【批量新增】，批量创建用户账号。</p>
          <ul class="upload_box">
            <li>
              <p class="header">1、请下载导入模板，填写用户信息。</p>
              <div class="main_content download_box">
                <i class="vl_icon_manage_17 vl_icon"></i>
                <span>下载模板</span>
              </div>
            </li>
            <li>
              <p class="header">2、上传已填写的用户信息表。</p>
              <div class="main_content">
                <el-upload
                  accept=".xls,.xlsx"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-success="handleSuccess"
                  :limit="1"
                  >
                  <el-button size="small" class="upload-btn" icon="vl_icon_manage_18 vl_icon">上传文件</el-button>
                </el-upload>
              </div>
            </li>
            <li>
              <div class="main_content">
                <el-button class="user_btn function_btn" :loading="isMuliAddLoading">批量新增</el-button>
                <el-button class="user_btn back_btn">返回</el-button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </vue-scroll>
</template>
<script>
import { validatePhone, checkIdCard, checkEmail } from '@/utils/validator.js';
import { createUser, getDepartmentList } from '@/views/index/api/api.manage.js';
export default {
  data () {
    return {
      addUser: {
        // proKey: null,
        userMobile: null,
        userName: null,
        userSex: 0,
        userIdcard: null,
        userEmail: null,
        organId: null
      },
      rules: {
        userMobile: [
          { required: true, message: '该项内容不可为空' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '该项内容不可为空' },
        ],
        userIdcard: [
          { validator: checkIdCard, trigger: 'blur' }
        ],
        userEmail: [
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      userInfo: {},
      departmentData: [],
      isAddLoading: false, // 单个添加加载中
      isMuliAddLoading: false, // 批量添加加载中
    }
  },
  mounted () {
    this.userInfo =  this.$store.state.loginUser;
    // this.addUser.proKey = this.userInfo.proKey;
    this.getDepartList();
  },
  methods: {
    // 获取列表数据
    getDepartList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageNum: 1,
        pageSize: 0,
      };
      getDepartmentList(params)
        .then(res => {
          if (res && res.data.list) {
            this.departmentData = res.data.list;
          }
        })
    },
    submitForm (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.isAddLoading = true;
          createUser(this.addUser)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '新建成功',
                  customClass: 'request_tip'
                });
                this.isAddLoading = false;
                this.$router.push({name: 'user'});
              } else {
                // this.$message({
                //   type: 'error',
                //   message: '新建失败',
                //   customClass: 'request_tip'
                // });
                this.isAddLoading = false;
              }
            })
            .catch(() => {this.isAddLoading = false;})
        }
      })
    },
    resetForm (form) {
      this.$refs[form].resetFields();
      this.$router.back(-1);
    },
    handleSuccess () {}
  }
}
</script>
<style lang="scss" scoped>
.add-user {
  width: 100%;
  .single-user, .multiple-user {
    width: 98%;
    background-color: #ffffff;
    margin: 0 20px 20px 20px;
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
      padding: 20px;
      >p {
        color: #999999;
        margin-bottom: 20px;
      }
      
    }
    .multiple-content-body {
      padding: 20px;
      >p {
        color: #999999;
        margin-bottom: 20px;
      }
      .upload_box {
        > li {
          line-height: 40px;
          .header {
            color: #333333;
          }
          .main_content {
            width: 250px;
            margin-left: 30px;
            .upload-btn {
              color: #333333;
              border:1px solid #D3D3D3;
              display: flex;
              align-items: center;
            }
          }
          .download_box {
            cursor: pointer;
            text-align: center;
            width: 98px;
            height: 32px;
            line-height: 32px;
            color: #333333;
            border-radius:4px;
            border:1px solid #D3D3D3;
            i {
              vertical-align: middle;
            }
          }
          &:last-child {
            margin-top: 20px;
          }
        }
      }
    }
    .user_btn {
      width: 100px;
      border-radius: 4px;
      height: 40px;
    }
    .function_btn {
      background-color: #0C70F8;
      color: #ffffff;
    }
    .back_btn {
      border:1px solid rgba(211,211,211,1);
    }
  }
}
</style>


