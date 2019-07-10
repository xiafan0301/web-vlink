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
          <el-form-item label="成员账户:" prop="userMobile">
            <el-select
              style="width: 40%;"
              v-model="addUser.userMobile"
              filterable
              remote
              allow-create
              reserve-keyword
              :multiple-limit="50"
              placeholder="请选择或输入成员账户"
              :remote-method="remoteMethod"
              @change="handleUserChange"
              :loading="loading">
              <el-option
                v-for="item in reportUserList"
                :key="item.uid"
                :label="item.userMobile"
                :value="item.userMobile">
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
            <el-select style="width: 40%;" v-model="addUser.organId" placeholder="请选择所属单位" @change="handleDepartment">
              <el-option
                v-for="(item, index) in departmentList"
                :key="index"
                :label="item.organName"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="成员编号:" prop="memberNo">
            <el-input style="width: 40%;" placeholder="请输入成员的部门编号" v-model="addUser.memberNo"></el-input>
          </el-form-item>
          <el-form-item label="职位:" prop="position">
            <el-select style="width: 40%;" v-model="addUser.position" placeholder="请选择职位">
              <el-option
                v-for="(item, index) in memberJobList"
                :key="index"
                :label="item.enumValue"
                :value="item.enumField"
              >
              </el-option>
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
import { validatePhone } from '@/utils/validator.js';
import { createUser, getDepartmentList } from '@/views/index/api/api.manage.js';
import { getUserList, getUserDetail } from '@/views/index/api/api.user.js';
import { getDiciData } from '@/views/index/api/api.js';
import {dataList } from '@/utils/data.js';
export default {
  data () {
    return {
      loading: false,
      isAddLoading: false, // 添加加载中
      addUser: {
        memberNo: null, // 成员编号
        userName: null, // 姓名
        userSex: 1, // 性别
        userEmail: null, // 邮箱
        organId: null, // 所属机构id
        organName: null, // 所属机构名称
        userMobile: null, // 成员账户
        position: null // 职位
      },
      rules: {
        userMobile: [
          { required: true, message: '该项内容不能为空', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
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
      userList: [], // 已有用户
      memberJobList: [], // 成员职位
      departmentList: [], // 部门列表
    }
  },
  mounted () {
    this.userInfo = this.$store.state.loginUser;
    this.getMemberJobList();
    this.getDepartList();
    this.getList();
  },
  methods: {
    // 获取已有用户,未关联单位的
    getList () {
      const params = {
        'where.flag': 2, // 1正常查询（默认）、2只查没有所属单位的
        pageSize: 0
      };
      getUserList(params)
        .then(res => {
          if (res) {
            this.userList = res.data.list;
          }
        })
    },
    // 获取成员职位数据
    getMemberJobList () {
      const memberJob = dataList.memberJob;
      getDiciData(memberJob)
        .then(res => {
          if (res) {
            this.memberJobList = res.data;
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
                this.addUser.organId = val.uid;
                this.addUser.organName = val.organName;
              } 
            });
          }
        });
    },
    // 所属单位change
    handleDepartment (val) {
      this.departmentList.map(item => {
        if (item.uid === val) {
          this.addUser.organName = item.organName;
        }
      })
    },
    // 成员账户change
    handleUserChange (val) {
      let userId = null;
      if (val) {
        this.userList.map(item => {
          if (item.userMobile === val) {
            userId = item.uid;
          }
        });
        if (userId) {
          getUserDetail(userId)
            .then(res => {
              if (res) {
                console.log(res)
                if (res) {
                  this.addUser.userName = res.data.userName;
                  this.addUser.userSex = parseInt(res.data.userSex);
                  this.addUser.userEmail = res.data.userEmail;
                  this.addUser.memberNo = res.data.memberNo;
                  this.addUser.position = res.data.position;
                }
              }
            })
        } else {
          this.addUser.userName = '';
          this.addUser.userSex = 1;
          this.addUser.userEmail = '';
          this.addUser.memberNo = '';
          this.addUser.position = '';
        }
      } else {
        this.addUser.userName = '';
        this.addUser.userSex = 1;
        this.addUser.userEmail = '';
        this.addUser.memberNo = '';
        this.addUser.position = '';
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        // console.log(this.userList)
        setTimeout(() => {
          this.loading = false;
          this.reportUserList = this.userList.filter(item => {
            return item.userMobile.toLowerCase()
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
        if (valid) {
          this.isAddLoading = true;
          createUser(this.addUser)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '新增成功',
                  customClass: 'request_tip'
                });
                this.$router.push({name: 'member_file'});
                this.isAddLoading = false;
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

