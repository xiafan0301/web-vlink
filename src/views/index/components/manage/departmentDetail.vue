<template>
<vue-scroll>
  <div class="department-detail">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manage/department' }">部门架构</el-breadcrumb-item>
        <el-breadcrumb-item>{{departDetailInfo.organName}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="all_content">
      <ul class="header_tab">
        <li :class="{active: tabState === 1}" @click="tabState = 1">部门</li>
        <li :class="{active: tabState === 2}" @click="tabState = 2">成员</li>
      </ul>
      <template v-if="tabState === 1">
        <div class="basic_info">
          <p>
            <i class="vl_icon vl_icon_event_4"></i>
            <span>{{departDetailInfo.organName}}</span>
          </p>
          <ul class="basic_list">
            <li>
              <span>上级部门:</span>
              <span>{{departDetailInfo.parentOrganName}}</span>
            </li>
            <li>
              <span>负责人:</span>
              <span>{{departDetailInfo.chargeUserNameStr}}</span>
            </li>
            <li>
              <span>联系方式:</span>
              <span>{{departDetailInfo.chargeUserMobile}}</span>
            </li>
            <li>
              <span>创建时间:</span>
              <span>{{departDetailInfo.createTime | fmTimestamp}}</span>
            </li>
            <li>
              <span>更新时间:</span>
              <span>{{departDetailInfo.updateTime | fmTimestamp}}</span>
            </li>
          </ul>
        </div>
        <div class="junior_depart">
          <p>下级部门</p>
          <div class="depart_btn_box">
            <el-button class="add_btn" icon="el-icon-plus" @click="showNewDepartment">新增部门</el-button>
            <el-button class="del_btn" @click="showDeleteDialog">删除部门</el-button>
          </div>
          <div class="depart_tree" v-show="childDepartList.length > 0">
            <el-checkbox>全选</el-checkbox>
            <div class="depart_tree_list">
              <vue-scroll>
                <el-tree icon-class="el-icon-arrow-right" show-checkbox :data="childDepartList" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
              </vue-scroll>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="member_box">
          <div class="header">
            <el-button class="admin-btn" @click="showAdminMember">
              <i class="vl_icon vl_icon_manage_2"></i>
              <span>成员管理</span>
            </el-button>
            <el-input  placeholder="请输入账户名/姓名查找" style="width: 240px;" v-model="userName">
              <i v-show="closeShow" slot="suffix" @click="onClear" class="search_icon el-icon-close" style="font-size: 20px;"></i>
              <i
                v-show="!closeShow"
                class="search_icon vl_icon vl_icon_manage_1"
                slot="suffix"
                @click="searchData">
              </i>
            </el-input>
          </div>
          <div class="table_box">
            <el-table
              class="member_table"
              :data="memberListData"
              >
              <el-table-column
                fixed
                label="序号"
                type="index"
                :show-overflow-tooltip='true'
                >
              </el-table-column>
              <el-table-column
                label="账户名"
                prop="userMobile"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="姓名"
                prop="userName"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="性别"
                prop="userSex"
                show-overflow-tooltip
                >
                <template slot-scope="scope">
                  <span>{{scope.row.userSex === 1 ? '男' : scope.row.userSex === 2 ? '女' : '未知'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="邮箱"
                prop="userEmail"
                >
              </el-table-column>
              <el-table-column
                label="最后登录时间"
                prop="lastLoginTime"
                >
                <template slot-scope="scope">
                  <span>{{scope.row.lastLoginTime | fmTimestamp}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            class="cum_pagination"
            @current-change="handleCurrentChange"
            :current-page="pagination.pageNum"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="pagination.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pagination.total">
          </el-pagination>
        </div>
      </template>
    </div>
    <!--管理成员弹出框-->
    <el-dialog
      title="管理成员"
      :visible.sync="adminMemberDialog"
      width="521px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp_group"
      >
      <div class="userGroup_body">
        <div class="group_left clearfix">
          <p class="group_number">当前成员 (已选{{checkCurrMember.length > 0 ? checkCurrMember.length : 0}}个/共{{currentMembers.length > 0 ? currentMembers.length : 0}}个)</p>
          <div class="checkbox_box_left">
            <vue-scroll>
              <el-checkbox-group v-model="checkCurrMember">
                <el-checkbox v-for="(item, index) in currentMembers" :label="item" :key="index">{{item.userName}}</el-checkbox>
              </el-checkbox-group>
            </vue-scroll>
          </div>
          <div class="group_btn group_btn_left" @click="removeMembers">移除所选组</div>
        </div>
        <div class="group_right">
          <p class="group_number">可选成员 (已选{{checkSelectMember.length > 0 ? checkSelectMember.length : 0}}个/共{{searchSelectMembers.length > 0 ? searchSelectMembers.length : 0}}个)</p>
          <el-input placeholder="请输入成员姓名搜索" size="small" style="width: 220px;" v-model="searchMemberName">
            <i v-show="closeShowMember" slot="suffix" @click="onClearMember" class="search_icon el-icon-close" style="font-size: 20px;"></i>
            <i
              v-show="!closeShowMember"
              class="search_icon vl_icon vl_icon_manage_1"
              slot="suffix"
              @click="searchMember">
            </i>
          </el-input>
           <div class="checkbox_box_right">
            <vue-scroll>
              <el-checkbox-group v-model="checkSelectMember">
                <el-checkbox v-for="(item ,index) in searchSelectMembers" :label="item" :key="index">{{item.userName}}</el-checkbox>
              </el-checkbox-group>
            </vue-scroll>
          </div>
          <div class="group_btn group_btn_right" @click="addMembers">加入所选组</div>
        </div>
      </div>
    </el-dialog>
    <!--新增部门弹框-->
    <el-dialog
      title="新增部门"
      :visible.sync="newDepartmentDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div style="margin-top: 10px;">
        <el-form :model="addDepartment" :rules="addRules" ref="addDepartment" label-width="10px">
          <el-form-item label=" " prop="organName" class="organ_name">
            <el-input v-model="addDepartment.organName" @change="handleChangeOrganName" style="width: 95%;" placeholder="请输入部门名称"></el-input>
            <p class="organ_error_tip" v-show="isShowOrganError">部门已存在</p>
          </el-form-item>
          <el-form-item label=" " prop="organPid">
            <el-select style="width: 95%;" v-model="addDepartment.organPid" placeholder="请选择上级部门">
              <el-option
                v-for="(item, index) in departmentData"
                :key="'item' + index"
                :label="item.organName"
                :value="item.uid"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" " prop="chargeUserName">
            <el-select style="width: 95%" filterable v-model="addDepartment.chargeUserName" placeholder="请搜索部门负责人姓名">
              <el-option
                v-for="(item, index) in userList"
                :key="'item' + index"
                :label="item.userName"
                :value="item.uid"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('addDepartment')">取消</el-button>
        <el-button class="operation_btn function_btn" @click="addDepartmentInfo('addDepartment')">确认</el-button>
      </div>
    </el-dialog>
    <!--删除下级部门弹出框-->
    <el-dialog
      title="删除时将删除部门及其下级部门，是否确认删除？"
      :visible.sync="delChildDepartmentDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">您已选中4个部门</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delChildDepartmentDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="delChildDepartmentDialog = false">确认</el-button>
      </div>
    </el-dialog>
  </div>
</vue-scroll>
</template>
<script>
import { judgeDepart, getDepartDetail, getUserMember, getUserList, delUserMember,
  addUserMember, getDepartmentList, addDepart } from '@/views/index/api/api.manage.js';
export default {
  data () {
    return {
      isShowOrganError: false,
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      closeShow: false,
      closeShowMember: false,
      userName: null, // 要搜索的内容
      searchMemberName: null, // 要搜索的可选成员
      tabState: 1,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      memberListData: [],
      departDetailInfo: {}, // 部门详情数据,
      addDepartment: {
        proKey: null,
        organName: null,
        organPid: null,
        chargeUserName: null
      },
      addRules: {
        organName: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
        organPid: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
        chargeUserName: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ]
      },
      deleteArr: [], // 删除部门id集合
      adminMemberDialog: false, // 成员管理弹出框
      newDepartmentDialog: false, // 新建部门弹出框
      delChildDepartmentDialog: false, // 删除部门弹出框
      userInfo: {}, // 存储的用户信息
      userList: [], // 所有的用户
      departmentData: [], // 部门数据
      currentMembers: [], // 当前成员
      selectMembers: [], // 可选成员
      searchSelectMembers: [], // 搜索出的可选成员
      checkSelectMember: [], // 勾选种的可选成员
      checkCurrMember: [], // 勾选中的当前成员
      currentGroupId: null, // 当前用户组id
      childDepartList: [], // 下级部门
    }
  },
  created () {
    this.userInfo = this.$store.state.loginUser;
    this.addDepartment.proKey = this.userInfo.proKey;
  },
  mounted () {
    this.getDetail();
    // this.getDepartList();
    this.getAllUserList();
    this.getUserList();
  },
  methods: {
    // 获取列表数据
    getDepartList () {
      this.departmentData = [];
      this.childDepartList = [];
      const params = {
        'where.proKey': this.userInfo.proKey,
        'where.organPid': this.$route.query.id,
        pageSize: 0,
      };
      getDepartmentList(params)
        .then(res => {
          console.log('000', res)
          if (res && res.data.list) {
            let restArr = [];
            this.departmentData.push({
              uid: this.departDetailInfo.uid,
              organName: this.departDetailInfo.organName
            });
            res.data.list.map((item) => {
              this.departmentData.push({
                uid: item.uid,
                organName: item.organName
              });
              // if (item.organLayer === (this.departDetailInfo.organLayer + 1)) {
              //   this.childDepartList.push({
              //     uid: item.uid,
              //     name: item.organName,
              //     isShow: false,
              //     isSelect: false,
              //     children: []
              //   });
              // } else {
              //   restArr.push(item);
              // }
              console.log('rest', restArr);
            });
            // restArr.forEach(a => {
            //   this.childDepartList.forEach(b => {
            //     if (a.parentOrganName === b.name) {
            //       b.children.push({
            //         uid: a.uid,
            //         name: a.organName,
            //         isSelect: false
            //       })
            //     }
            //   })
            // })
          }
          console.log('childDepartList', this.childDepartList)
        })
    },
    handleTreeList (arr, obj, finalArr) {
      arr.map(item => {
        if (item.organLayer === (obj.organLayer + 1)) {
          const params = {
            uid: item.uid,
            name: item.organName,
            children: []
          }
          finalArr.push(params);
        }
      })
    },
    // 获取部门详情数据
    getDetail () {
      const id = this.$route.query.id;
      if (id) {
        const params = {
          uid: id,
          proKey: this.userInfo.proKey
        };
        getDepartDetail(params)
          .then(res => {
            if (res) {
              this.departDetailInfo = res.data;
              this.getDepartList();
            }
          })
      }
    },
    // 获取所有的用户
    getAllUserList () {
      const params = {
        pageSize: 0,
        'where.proKey': this.userInfo.proKey
      }
      getUserList(params)
        .then(res => {
          if (res) {
            this.userList = res.data.list;
          }
        })
        .catch(() => {})
    },
    // 获取成员
    getUserList () {
      const params = {
        'where.uid': this.$route.query.id,
        'where.proKey': this.userInfo.proKey,
        'where.userName': this.userName,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      };
      getUserMember(params)
        .then(res => {
          if (res) {
            this.memberListData = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getUserList();
    },
    // 清空搜索框
    onClear () {
      this.userName = null;
      this.closeShow = false;
      this.getUserList();
    },
    // 搜索成员数据
    searchData () {
      if (this.userName) {
        this.closeShow = true;
        this.getUserList();
      }
    },
    handleNodeClick () {},
    // 显示管理成员弹出框
    showAdminMember (obj) {
      this.currentMembers = [];
      this.searchSelectMembers = [];
      this.adminMemberDialog = true;
      this.currentGroupId = obj.uid;
      let allMembers; // 所有的用户
      const data = {
        'where.uid': this.$route.query.id,
        'where.proKey': this.userInfo.proKey,
        pageSize: 0
      }
      getUserMember(data)
        .then(res => {
          if (res) {
            res.data.list.map(item => {
              this.currentMembers.push({
                uid: item.uid,
                userName: item.userName
              })
            })
          }
        })
        .catch(() => {})
      const params = {
        pageSize: 0,
        'where.proKey': this.userInfo.proKey
      }
      getUserList(params)
        .then(res => {
          if (res) {
            allMembers = JSON.parse(JSON.stringify(res.data.list));
            if (this.currentMembers.length > 0) {
              this.currentMembers.map(item => {
                allMembers.map((itm, idx) => {
                  if (itm.userName === item.userName) {
                    allMembers.splice(idx, 1);
                  }
                });
              });
            }
            this.selectMembers = JSON.parse(JSON.stringify(allMembers));
            this.searchSelectMembers = JSON.parse(JSON.stringify(allMembers));
          }
        })
        .catch(() => {})
      
    },
    // 移出所选成员
    removeMembers () {
      if (this.checkCurrMember.length > 0) {
        let params = {
          proKey: this.userInfo.proKey,
          organId: this.$route.query.id,
          userIds: []
        };
        this.checkCurrMember.map(item => {
          params.userIds.push(item.uid);
        });
        params.userIds = params.userIds.join(',');
        delUserMember(params)
          .then(res => {
            if (res) {
              this.checkCurrMember.map(item => {
                this.currentMembers.map((itm, idx) => {
                  if (item.userName === itm.userName) {
                    this.currentMembers.splice(idx, 1);
                    this.searchSelectMembers.push({
                      uid: item.uid,
                      userName: item.userName
                    });
                  }
                });
              });
              this.getUserList();
              this.checkCurrMember = [];
            }
          })
          .catch(() => {})
      }
    },
    // 添加所选成员
    addMembers () {
      if (this.checkSelectMember.length > 0) {
        let params = {
          proKey: this.userInfo.proKey,
          organId: this.$route.query.id,
          userIds: []
        };
        this.checkSelectMember.map(item => {
          params.userIds.push(item.uid);
        });
        params.userIds = params.userIds.join(',');
        addUserMember(params)
          .then(res => {
            if (res) {
              this.checkSelectMember.map(item => {
                this.searchSelectMembers.map((itm, idx) => {
                  if (item.userName === itm.userName) {
                    this.searchSelectMembers.splice(idx, 1);
                    this.currentMembers.push({
                      uid: item.uid,
                      userName: item.userName
                    });
                  }
                });
              });
              this.getUserList();
              this.checkSelectMember = [];
            }
          })
          .catch(() => {})
      }
    },
    // 部门名称change
    handleChangeOrganName (val) {
      if (!val) {
        this.isShowOrganError = false;
      } 
    },
    // 显示新增部门弹出框
    showNewDepartment () {
      this.isShowOrganError = false;
      this.addDepartment.organName = null;
      this.addDepartment.chargeUserName = null;
      this.addDepartment.organPid = parseInt(this.$route.query.id);
      this.newDepartmentDialog = true;
    },
    // 添加部门
    addDepartmentInfo (form) {
      this.$refs[form].validate(valid => {
        this.isShowOrganError = false;
        if (valid) {
          const params = {
            proKey: this.userInfo.proKey,
            organName: this.addDepartment.organName
          }
          judgeDepart(params)
            .then(res => {
              if (res.data) {
                this.isShowOrganError = true;
              } else {
                this.isShowOrganError = false;
                this.handleAddDepartment();
              }
            })
            .catch(() => {})
        }
      })
    },
    handleAddDepartment () {
      addDepart(this.addDepartment)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '添加成功',
              customClass: 'request_tip'
            })
            this.newDepartmentDialog = false;
            this.getList();
          } else {
            this.$message({
              type: 'error',
              message: '添加失败',
              customClass: 'request_tip'
            })
          }
        })
        .catch(() => {})
    },
    // 取消添加
    cancelAdd (form) {
      this.isShowOrganError = false;
      this.$refs[form].resetFields();
      this.newDepartmentDialog = false;
    },
    // 显示删除部门弹出框
    showDeleteDialog () {
      if (this.deleteArr.length === 0) {
        this.$message({
          message: '请先选择需删除的部门',
          type: 'warning',
          customClass: 'delete_depart'
        });
      } else {
        this.delChildDepartmentDialog = true;
      }
    },
    // 搜索可选成员
    searchMember () {
      // if (this.searchMemberName) {
        let reg = new RegExp(this.searchMemberName);
        let arr = [];
        this.searchSelectMembers.map((item) => {
          let name = item.userName;
          if (name.match(reg)) {
            arr.push(item);
          }
        })
        this.searchSelectMembers = JSON.parse(JSON.stringify(arr));
        this.closeShowMember = true;
      // }
    },
    // 清除搜索可选成员输入框
    onClearMember () {
      this.searchMemberName = null;
      this.searchSelectMembers = JSON.parse(JSON.stringify(this.selectMembers));
      this.closeShowMember = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.department-detail {
  .all_content {
    padding: 0 20px;
    .header_tab {
      width: 100%;
      height: 44px;
      background-color: #ffffff;
      border-bottom: 1px solid #F2F2F2;
      >li {
        display: inline-block;
        height: 44px;
        line-height: 44px;
        color: #333333;
        font-size: 16px;
        margin: 0 15px;
        cursor: pointer;
        &.active {
          border-bottom: 1px solid #0C70F8;
          color: #0C70F8;
        }
      }
    }
    .basic_info {
      background-color: #ffffff;
      width: 100%;
      // margin: 0 20px;
      padding: 15px;
      // box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      > p {
        display: flex;
        width: 100%;
        >span {
          margin-left: 10px;
          color: #333333;
          font-size: 20px;
          font-weight: 600;
        }
      }
      .basic_list {
        padding-top: 10px;
        padding-left: 30px;
        >li {
          height: 30px;
          line-height: 30px;
          display: inline-block;
          width: 30%;
          span:first-child {
            color: #666666;
            margin-right: 10px;
          }
          span:last-child {
            color: #333333;
          }
        }
      }
    }
    .junior_depart {
      width: 100%;
      margin: 20px 0;
      background-color: #ffffff;
      > p {
        padding: 15px;
        color: #333333;
        font-size: 16px;
        font-weight: 600;
        border-bottom: 1px solid #F2F2F2;
      }
      .depart_btn_box {
        padding: 15px;
        .add_btn {
          background-color: #0C70F8;
          color: #ffffff;
        }
        .del_btn {
          color: #666666;
          border-color: #D3D3D3;
        }
      }
      .depart_tree {
        padding-left: 15px;
        padding-bottom: 15px;
        .depart_tree_list {
          width: 50%;
          height: 400px;
          margin-top: 15px;
          /deep/ .el-tree-node__content {
            display: inherit;
          }
          /deep/ .el-checkbox {
            margin-right: 0;
            float: left;
          }
          /deep/ .el-tree-node:focus>.el-tree-node__content {
            background-color: #ffffff;
            color: #0C70F8;
            >span {
              color: #0C70F8;
            }
          }
          /deep/ .el-tree-node:hover>.el-tree-node__content {
            background-color: #ffffff;
          }
          /deep/.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
            background-color: #0C70F8;
            border-color: #0C70F8;
          }
        }
      }
    }
    // 成员
    .member_box {
      background-color: #ffffff;
      width: 100%;
      .header {
        padding: 20px 10px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .admin-btn {
          background-color: #0C70F8;
          color: #fff;
          i {
            display: inline-block;
            vertical-align: middle;
          }
        }
        .search_icon{
          margin-top: 10px;
          cursor: pointer;
        }
      }
      .table_box {
        padding: 0 10px;
        .department_table {
          margin-top: 8px;
          .operation_btn {
            color: #0C70F8;
            cursor: pointer;
            padding: 0 10px;
            display: inline-block;
          }
        }
      }
    }
  }
  .dialog_comp_group {
    /deep/ .el-dialog__body {
      padding: 0 0 30px 0;
      .userGroup_body {
        width: 100%;
        clear: both;
        height: 577px;
        border-top: 1px solid #F2F2F2;
        .group_left {
          padding-top: 8px;
          width: 50%;
          height: 100%;
          border-right: 1px solid #F2F2F2;
          float: left;
          padding-left: 20px;
          .checkbox_box_left {
            height: calc(577px - 25px - 40px - 20px);
            margin-bottom: 20px;
            margin-top: 15px;
          }
          .group_btn_left {
            border: 1px solid #D3D3D3;
            color: #666666;
          }
        }
        .group_right {
          padding-top: 8px;
          width: 50%;
          height: 100%;
          padding-left: 20px;
          float: left;
          .checkbox_box_right {
            height: calc(577px - 25px - 40px - 20px - 42px);
            margin-bottom: 20px;
            margin-top: 15px;
          }
          /deep/ .el-input__inner {
            border-radius: 30px;
            background-color: #F2F2F2;
            color: #999999;
            border-color: #F2F2F2;
            margin-top: 10px;
          }
          .search_icon{
            margin-top: 17px;
            cursor: pointer;
          }
          .group_btn_right {
            background-color: #0C70F8;
            color: #ffffff;
          }
        }
        .group_btn {
          text-align: center;
          line-height: 40px;
          width: 220px;
          height: 40px;
          border-radius: 4px;
          cursor: pointer;
        }
        .group_number {
          color: #999999;
          font-size: 12px;
        }
        /deep/ .el-checkbox-group {
          display: flex;
          flex-wrap: wrap;
          flex-direction: column;
        }
        /deep/ .el-checkbox {
          padding-right: 20px;
          height: 25px;
        }
        /deep/ .el-checkbox+.el-checkbox {
          margin-left: 0;
        }
         /deep/ .el-checkbox:last-child {
          margin-right: 30px;
        }
        /deep/ .el-checkbox__label {
          float: left;
        }
        /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: #0C70F8;
          border-color: #0C70F8;
        }
        /deep/ .el-checkbox__input.is-checked+.el-checkbox__label{
          color: #666666;
        }
        /deep/ .el-checkbox__input {
          float: right;
        }
      }
    }
  }
  .dialog_comp {
    .organ_name {
      position: relative;
      .organ_error_tip {
        position: absolute;
        height: 10px;
        line-height: 10px;
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
      }
    }
  }
}
</style>


