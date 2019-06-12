<template>
<vue-scroll>
  <div class="edit_member">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manage/archivesManage/memberFile'}">档案管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/archivesManage/memberFile'}">一员一档</el-breadcrumb-item>
        <el-breadcrumb-item>编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="edit_box">
      <p class="title">编辑档案</p>
      <div class="content-body">
        <el-form :model="editUser" :rules="rules" ref="editUser" label-width="90px">
          <el-form-item label="成员账户:" prop="userMobile">
            <span style="color: #333333">{{editUser.userMobile}}</span>
          </el-form-item>
          <el-form-item label="姓名:" prop="userName">
            <el-input style="width: 40%;" placeholder="请输入姓名" v-model="editUser.userName"></el-input>
          </el-form-item>
          <el-form-item label="性别:" prop="userSex">
            <el-radio-group style="width: 40%;" v-model="editUser.userSex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="邮箱:" prop="userEmail">
            <el-input style="width: 40%;" placeholder="请输入邮箱" v-model="editUser.userEmail"></el-input>
          </el-form-item>
          <el-form-item label="所属单位:" prop="organId">
            <el-select style="width: 40%;" v-model="editUser.organId" placeholder="请选择所属单位">
              <el-option
                v-for="(item, index) in departmentList"
                :key="index"
                :label="item.organName"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="成员编号:" prop="memberNo">
            <el-input style="width: 40%;" placeholder="请输入成员的部门编号" v-model="editUser.memberNo"></el-input>
          </el-form-item>
          <el-form-item label="职位:" prop="position">
            <el-select style="width: 40%;" v-model="editUser.position" placeholder="请选择职位">
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
      <el-button class="operation_btn function_btn" :loading="isEditLoading" @click="submitData('editUser')">保存</el-button>
      <el-button class="operation_btn back_btn" @click="cancelSubmit('editUser')">取消</el-button>
    </div>
  </div>
</vue-scroll>
</template>
<script>
import { validatePhone } from '@/utils/validator.js';
import { getDepartmentList } from '@/views/index/api/api.manage.js';
import { getUserDetail, updateUserInfo } from '@/views/index/api/api.user.js';
import { getDiciData } from '@/views/index/api/api.js';
import {dataList } from '@/utils/data.js';
export default {
  data () {
    return {
      isEditLoading: false, // 编辑加载中
      editUser: {
        uid: null,
        proKey: null,
        memberNo: null, // 成员编号
        userName: null, // 姓名
        userSex: null, // 性别
        userEmail: null, // 邮箱
        organId: null, // 所属机构id
        organName: null, // 所属机构名称
        userMobile: null, // 成员账户
        position: null // 职位
      },
      rules: {
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
      userList: [],
      memberJobList: [], // 成员职位
      departmentList: [], // 部门列表
    }
  },
   mounted () {
    this.userInfo = this.$store.state.loginUser;
    this.editUser.proKey = this.userInfo.proKey;
    
    this.getMemberJobList();
    this.getDepartList();
    this.getDetail();
  },
  methods: {
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
    // 获取用户详情
    getDetail () {
      const userId = this.$route.query.id;
      if (userId) {
        getUserDetail(userId)
          .then(res => {
            if (res) {
              let position = res.data.position;

              this.editUser.uid = res.data.uid;
              this.editUser.memberNo = res.data.memberNo;
              this.editUser.userName = res.data.userName;
              this.editUser.userSex = parseInt(res.data.userSex);
              this.editUser.userEmail = res.data.userEmail;
              this.editUser.organId = res.data.organId;
              this.editUser.organName = res.data.organName;
              this.editUser.userMobile = res.data.userMobile;

              this.editUser.position = position.toString();
            }
          })
      }
    },
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
    // 所属单位change
    handleDepartment (val) {
      this.departmentList.map(item => {
        if (item.uid === val) {
          this.editUser.organName = item.organName;
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
          this.isEditLoading = true;
          updateUserInfo(this.editUser)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '修改成功',
                  customClass: 'request_tip'
                });
                this.$router.push({name: 'member_file'});
                this.isEditLoading = false;
              } else {
                this.isEditLoading = false;
              }
            })
            .catch(() => {this.isEditLoading = false;})
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit_member {
  .edit_box {
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

