<template>
  <vue-scroll>
    <div class="admin_person_info">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/manage/basicInfo/personInfo' }">基础信息库</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/manage/basicInfo/personInfo' }">人员信息库</el-breadcrumb-item>
          <el-breadcrumb-item>管理组信息</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content_box">
        <div class="btn_box">
          <div class="bnt_box_left">
            <span>{{groupName}}</span>
            <i class=" edit_btn vl_icon vl_icon_manage_7" @click="showEditDialog"></i>
            <i class=" del_btn vl_icon vl_icon_manage_8" @click="showDeleteDialog"></i>
          </div>
          <div class="bnt_box_right">
            <el-button class="oper_btn copy_btn" :class="[multipleSelection.length === 0 ? 'disabled_btn' : '']" :disabled="multipleSelection.length === 0 ? true : false" @click="showGroup = !showGroup">复制</el-button>
            <el-button class="oper_btn move_btn" :class="[multipleSelection.length === 0 ? 'disabled_btn' : '']" :disabled="multipleSelection.length === 0 ? true : false" @click="showMoveoutDialog">移出</el-button>
            <div class="copy_info" v-show="showGroup">
              <div class="copy_info_list">
                <vue-scroll>
                  <ul class="copy_info_ul">
                    <li
                      v-for="(item, index) in copyGroupList"
                      :key="index"
                      @click="handleCopyGroup(item.id)"
                    >{{item.name}}</li>
                  </ul>
                </vue-scroll>
              </div>
              <div class="add_btn"  @click="showAddGroupDialog">
                <i class="vl_icon vl_icon_manage_4"></i>
                <span>新增分组</span>
              </div>
            </div>
          </div>
        </div>
        <div class="divide"></div>
        <div class="table_box">
          <div class="search_box">
            <el-form :inline="true" :model="searchForm" class="search_form" ref="searchForm">
              <el-form-item prop="idNo">
                <el-input style="width: 240px;" type="text" placeholder="请输入姓名或证件号码" v-model="searchForm.idNo" />
              </el-form-item>
              <el-form-item prop="idType">
                <el-select v-model="searchForm.idType" style="width: 240px;" placeholder="证件类型">
                  <el-option label="身份证" :value="1"></el-option>
                  <el-option label="护照" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="sex">
                <el-select v-model="searchForm.sex" style="width: 240px;" placeholder="性别">
                  <!-- <el-option label="全部" :value="0"></el-option> -->
                  <el-option label="男" :value="1"></el-option>
                  <el-option label="女" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button class="select_btn" @click="searchData">查询</el-button>
                <el-button class="reset_btn" @click="resetForm('searchForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table
            class="event_table"
            :data="personInfoList"
            @selection-change="handleSelectChange"
            >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              fixed
              label="序号"
              type="index"
              >
            </el-table-column>
            <el-table-column
              label="姓名"
              prop="name"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="性别"
              prop="sex"
              show-overflow-tooltip
              >
              <template slot-scope="scope">
                <span>{{scope.row.sex == 1 ? '男' : '女'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="证件类型"
              prop="idType"
              show-overflow-tooltip
              >
              <template slot-scope="scope">
                <span>{{scope.row.idType === 1 ? '身份证' : '护照'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="证件号码"
              prop="idNo"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="备注信息"
              prop="remarks"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column label="操作" width="140">
              <template slot-scope="scope">
                <span class="operation_btn" @click="showLookDetailInfo(scope.row)">查看</span>
              </template>
            </el-table-column>
          </el-table>
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
      <!--查看人员详细信息弹出框-->
      <el-dialog
        title="查看人员信息"
        :visible.sync="perosnDetailInfoDialog"
        width="722px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp_person"
        >
        <div class="content_body">
          <div class="content_left">
            <img :src="personDetailInfo.photoUrl">
          </div>
          <ul class="content_right">
            <li>
              <span>姓名：</span>
              <span>{{personDetailInfo.name}}</span>
            </li>
            <li>
              <span>性别：</span>
              <span>{{personDetailInfo.sex === 1 ? '男' : '女'}}</span>
            </li>
            <li>
              <span>民族：</span>
              <span>{{personDetailInfo.nation === 1 ? '汉族' : personDetailInfo.nation}}</span>
            </li>
            <li>
              <span>证件类型：</span>
              <span>{{personDetailInfo.idType === 1 ? '身份证' : '护照'}}</span>
            </li>
            <li>
              <span>证件号码：</span>
              <span>{{personDetailInfo.idNo}}</span>
            </li>
            <li>
              <span>出生日期：</span>
              <span>{{personDetailInfo.birthDate | fmTimestamp}}</span>
            </li>
            <li>
              <span>底库信息：</span>
              <div class="group_box">
                <template v-if="albumList && albumList.length > 0">
                  <!-- <span v-for="(item, index) in personDetailInfo.albumList" :key="index">
                    {{item.title.concat('、')}}
                  </span> -->
                  <span>{{albumList.join('、')}}</span>
                </template>
                <template v-else>
                  <span>无</span>
                </template>
              </div>
            </li>
            <li>
              <span>分组信息：</span>
              <div class="group_box">
                <template v-if="groupList && groupList.length > 0">
                  <!-- <span v-for="(item, index) in personDetailInfo.groupList" :key="index">{{item.name + '、'}}</span> -->
                  <span>{{groupList.join('、')}}</span>
                </template>
                <template v-else>
                  <span>无</span>
                </template>
              </div>
            </li>
            <li>
              <span>备注：</span>
              <span>{{personDetailInfo.remarks}}</span>
            </li>
          </ul>
        </div>
      </el-dialog>
      <!--新增组弹出框-->
      <el-dialog
        title="新增分组"
        :visible.sync="addGroupDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
        >
        <div class="content_body">
          <span>您已选择1个对象，输入组名后已选对象将自动加入。</span>
          <el-form :model="groupForm" ref="groupForm" :rules="rules">
              <el-form-item label=" " prop="userGroupName" label-width="20px" class="group_name">
                <el-input @change="handleAGroupName" placeholder="请输入组名" style="width: 90%;" v-model="groupForm.userGroupName"></el-input>
                <p class="group_error_tip" v-show="isShowError">分组名称不允许重复</p>
              </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAddGroup('groupForm')">取消</el-button>
          <el-button class="operation_btn function_btn" :loading="isAddCopyLoading" @click="sureAddGroup('groupForm')">确认</el-button>
        </div>
      </el-dialog>
      <!--修改组弹出框-->
      <el-dialog
        title="修改组名"
        :visible.sync="editGroupDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
        >
        <el-form :model="groupForm" ref="groupForm" :rules="rules">
          <el-form-item label=" " prop="userGroupName" label-width="20px" class="group_name">
            <el-input @change="handleEGroupName" placeholder="请输入组名" style="width: 90%;" v-model="groupForm.userGroupName"></el-input>
            <p class="group_error_tip" v-show="isShowError">分组名称不允许重复</p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEdit('groupForm')">取消</el-button>
          <el-button class="operation_btn function_btn" :loading="isEditLoading" @click="editGroupInfo('groupForm')">确认</el-button>
        </div>
      </el-dialog>
      <!--删除组弹出框-->
      <el-dialog
        title="是否确定删除该组？"
        :visible.sync="deleteGroupDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
        >
        <span style="color: #999999;">删除后该组信息可在全部人像中查找。</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="deleteGroupDialog = false">取消</el-button>
          <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="sureDeleteGroup">确认</el-button>
        </div>
      </el-dialog>
      <!--移出组弹出框-->
      <el-dialog
        :title="delTitle"
        :visible.sync="moveoutGroupDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
        >
        <span style="color: #999999;">移除后该条信息可在全部人像中查找。</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="moveoutGroupDialog = false">取消</el-button>
          <el-button class="operation_btn function_btn" :loading="isRemoveLoading" @click="moveoutGroupInfo">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </vue-scroll>
</template>
<script>
import { validateName } from '@/utils/validator.js';
import { getPerGroupList, getPersonData, getPersonDetail, editVeGroup, copyPersonGroup,
moveoutPerson, deletePersonGroup, addGroupCopyPerson, judgePerson, getPerBottomBankList } from '@/views/index/api/api.manage.js';
export default {
  data () {
    return {
      isShowError: false,
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      groupForm: {
        userGroupName: null
      },
      rules: {
        userGroupName: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
          { max: 6, message: '最多输入6个字', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ]
      },
      showGroup: false,
      searchForm: {
        name: null,
        idType: null,
        sex: null
      },
      personInfoList: [],
      albumList: [], // 底库列表
      groupList: [], // 分组列表
      perosnDetailInfoDialog: false, // 查看人员信息弹出框
      addGroupDialog: false, // 新增分组弹出框
      editGroupDialog: false, // 修改分组弹出框
      deleteGroupDialog: false, // 删除分组弹出框
      moveoutGroupDialog: false, // 移出组弹出框
      perGroupList: [], // 人员分组列表
      groupId: null, // 分组id
      albumId: null, // 底库id
      isGroup: false,
      groupName: null, // 组名
      copyGroupList: [],
      multipleSelection: [], // 表格多选
      personDetailInfo: {}, // 人员详细信息
      delTitle: null,
      isAddCopyLoading: false, // 复制并加入组加载中
      isEditLoading: false, // 编辑组名加载中
      isDeleteLoading: false, // 删除组加载中
      isRemoveLoading: false, // 移除分组加载中
    }
  },
  mounted () {
    if (this.$route.query.type == 1) { // 分组查看
      this.isGroup = true;
      this.groupId = parseInt(this.$route.query.id);
    } else { // 底库查看
      this.isGroup = false;
      this.albumId = parseInt(this.$route.query.id);
      this.getBottomBankList(parseInt(this.$route.query.id));
    }
    this.getGroupList(parseInt(this.$route.query.id));
    this.getPersonList();
  },
  methods: {
    // 获取底库列表
    getBottomBankList (uid) {
      const params = {
        type: 1 // 1--人像库
      }
      getPerBottomBankList(params)
        .then(res => {
          if (res) {
            res.data.albumNumQueryDtoList.map(item => {
              if (item.id === uid) {
                this.groupName = item.title;
              }
            })
          }
        })
        .catch(() => {})
    },
    // 获取分组列表
    getGroupList (uid) {
      const params = {
        type: 4 // 4---人像
      }
      getPerGroupList(params)
        .then(res => {
          if (res) {
            if (this.groupId) {
              res.data.groupNumList.map(item => {
                if (item.id === uid) {
                  this.groupName = item.name;
                } else {
                  this.copyGroupList.push({
                    uid: item.id,
                    name: item.name
                  })
                }
              });
            } else {
              this.copyGroupList = res.data.groupNumList;
            }
          }
        })
        .catch(() => {})
    },
    // 获取人员列表
    getPersonList () {
      const params = {
        // 'where.type': this.selectMethod,
        'where.albumId': this.albumId,
        'where.groupId': this.groupId,
        'where.idType': this.searchForm.idType,
        'where.idNo': this.searchForm.idNo,
        'where.sex': this.searchForm.sex,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      };
      getPersonData(params)
        .then(res => {
          if (res) {
            this.personInfoList = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    // 搜索条件查询
    searchData () {
      this.getPersonList();
    },
    // 重置搜索框
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getPersonList();
    },
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getPersonList();
    },
    handleSelectChange (val) {
      this.multipleSelection = val;
    },
    // 当新增组名输入框改变时
    handleAGroupName () {
      this.isShowError = false;
    },
    // 当编辑组名输入框改变时
    handleEGroupName () {
      this.isShowError = false;
    },
    // 将人员复制到选择的组
    handleCopyGroup (id) {
      let selectArr = [];
      this.multipleSelection.map(item => {
        selectArr.push(item.id);
      });
      const params = {
        groupId: id || null,
        portraitIds: selectArr.join()
      };
      copyPersonGroup(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '复制成功',
              customClass: 'request_tip'
            })
            this.getPersonList();
            this.showGroup = false;
          }
        })
        .catch(() => {})
    },
    // 显示查看详细信息弹出框
    showLookDetailInfo (obj) {
      this.perosnDetailInfoDialog = true;
      if (obj.id) {
        getPersonDetail(obj.id)
          .then(res => {
            if (res) {
              this.personDetailInfo = res.data;
              this.personDetailInfo.albumList.map(item => {
                this.albumList.push(item.title);
              });
              this.personDetailInfo.groupList.map(item => {
                this.groupList.push(item.name);
              });
            }
          })
          .catch(() => {})
      }
    },
    // 显示编辑弹出框
    showEditDialog () {
      this.isShowError = false;
      this.groupForm.userGroupName = this.groupName;
      this.editGroupDialog = true;
    },
    // 取消编辑
    cancelEdit (form) {
      this.$refs[form].resetFields();
      this.groupForm.userGroupName = null;
      this.isShowError = false;
      this.editGroupDialog = false;
    },
    handleEditCopyGroupInfo () {
      const data = {
        groupName: this.groupForm.userGroupName,
        groupType: 4,
        uid: this.groupId
      };
      this.isEditLoading = true;
      editVeGroup(data)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '修改成功',
              customClass: 'request_tip'
            })
            this.editGroupDialog = false;
            this.isEditLoading = false;
            this.getGroupList(parseInt(this.groupId));
          } else {
            this.isEditLoading = false;
          }
        })
        .catch(() => {this.isEditLoading = false;})
    },
    // 确认编辑
    editGroupInfo (form) {
      this.$refs[form].validate(valid => {
        this.isShowError = false;
        if (valid) {
          const params = {
            name: this.groupForm.userGroupName
          };
          judgePerson(params)  // --判断组名是否重复
            .then(res => {
              if (res.data) {
                this.isShowError = true;
              } else {
                this.isShowError= false;
                this.handleEditCopyGroupInfo();
              }
            })
            .catch(() => {})
        }
      })
    },
    // 显示删除弹出框
    showDeleteDialog () {
      this.deleteGroupDialog = true;
    },
    // 确认删除分组
    sureDeleteGroup () {
      const params = {
        id: this.groupId
      };
      this.isDeleteLoading = true;
      deletePersonGroup(this.groupId, params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功',
              customClass: 'request_tip'
            });
            this.$router.push({name: 'person_info'});
            this.isDeleteLoading = false;
          } else {
            this.isDeleteLoading = false;
          }
        })
        .catch(() => {this.isDeleteLoading = false;})
    },
    // 显示移出弹出框
    showMoveoutDialog () {
      const length = this.multipleSelection.length;
      this.delTitle = '是否确定将这 ' + length + ' 条人员数据移出该组?';
      this.moveoutGroupDialog = true;
    },
    // 移出分组
    moveoutGroupInfo () {
      let selectArr = [];
      this.multipleSelection.map(item => {
        selectArr.push(item.id);
      });
      selectArr = selectArr.join(',');
      const params = {
        groupId: this.groupId,
        portraitIds: selectArr
      };
      this.isRemoveLoading = true;
      moveoutPerson(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '移出成功',
              customClass: 'request_tip'
            })
            this.getPersonList();
            this.moveoutGroupDialog = false;
            this.isRemoveLoading = false;
          } else {
            // this.$message({
            //   type: 'error',
            //   message: '移出失败',
            //   customClass: 'request_tip'
            // })
            this.isRemoveLoading = false;
          }
        })
        .catch(() => {this.isRemoveLoading = false;})
    },
    // 显示新增分组弹出框
    showAddGroupDialog () {
      this.groupForm.userGroupName = null;
      this.isShowError = false;
      this.addGroupDialog = true;
    },
    // 取消新增分组弹出框
    cancelAddGroup (form) {
      this.$refs[form].resetFields();
      this.groupForm.userGroupName = null;
      this.isShowError = false;
      this.addGroupDialog = false;
    },
    handleAddCopyGroupInfo () {
      let selectArr = [];
      this.multipleSelection.map(item => {
        selectArr.push(item.id);
      });
      const params = {
        newGroupName: this.groupForm.userGroupName || null,
        memberIds: selectArr
      };
      this.isAddCopyLoading = true;
      addGroupCopyPerson(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '新增成功',
              customClass: 'request_tip'
            })
            this.showGroup = false;
            this.getGroupList();
            this.addGroupDialog = false;
            this.isAddCopyLoading = false;
          } else {
            this.isAddCopyLoading = false;
          }
        })
        .catch(() => {this.isAddCopyLoading = false;})
    },
    // 确定新增分组
    sureAddGroup (form) {
      this.$refs[form].validate(valid => {
        this.isShowError = false;
        if (valid) {
          const params = {
            name: this.groupForm.userGroupName
          };
          judgePerson(params)  // --判断组名是否重复
            .then(res => {
              if (res.data) {
                this.isShowError = true;
              } else {
                this.isShowError= false;
                this.handleAddCopyGroupInfo();
              }
            })
            .catch(() => {})
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.admin_person_info {
  width: 100%;
  .content_box {
    margin: 0 20px;
    background-color: #ffffff;
    .btn_box {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      .bnt_box_left {
        display: flex;
        align-items: center;
        >span {
          color: #424242;
          font-size: 20px;
        }
        i {
          cursor: pointer;
          margin: 0 10px 0 20px;
        }
        .del_btn {
          &:hover {
            background-position: -694px -350px;
          }
        }
        .edit_btn {
          &:hover {
            background-position: -584px -350px;
          }
        }
      }
      .bnt_box_right {
        position: relative;
        .copy_info {
          z-index: 1;
          position: absolute;
          top: 45px;
          height: 170px;
          background-color: #ffffff;
          color: #333333;
          border-radius: 4px;
          box-shadow:5px 5px 8px 5px #949494;
          .copy_info_list {
            height: calc(170px - 30px);
            .copy_info_ul {
              >li {
                padding: 8px 10px;
                cursor: pointer;
                &:hover {
                  background-color: #E0F2FF;
                }
              }
            }
          }
          .add_btn {
            cursor: pointer;
            height: 30px;
            line-height: 30px;
            // display: flex;
            // align-items: center;
            text-align: center;
            padding: 0 10px;
            border-top: 1px solid #F2F2F2;
            span, i {
              display: inline-block;
              vertical-align: middle;
            }
          }
        }
        .oper_btn {
          width:80px;
          border-radius:4px;
        }
        .copy_btn {
          background-color: #0C70F8;
          color: #ffffff;
        }
        .disabled_btn {
          background-color: #D3D3D3;
          color: #B2B2B2;
          cursor: default;
        }
      }
    }
    .divide {
      width: 100%;
      border-bottom: 1px dashed #f2f2f2;
    }
    .table_box {
      padding: 20px;
      .search_box {
        width: 100%;
        .search_form {
          width: 100%;
          .select_btn, .reset_btn {
            width: 80px;
          }
          .select_btn {
            background-color: #0C70F8;
            color: #ffffff;
          }
          .reset_btn {
            background-color: #ffffff;
            color: #666666;
            border-color: #DDDDDD;
          }
        }
      }
    }
  }
   .dialog_comp_person {
    .content_body {
      width: 100%;
      display: flex;
      .content_left {
        width: 240px;
        border-right: 1px solid #f2f2f2;
        img {
          width: 160px;
          height: 160px;
          border-radius: 10px;
          margin: 50% 15%;
        }
      }
      .content_right {
        width: calc(100% - 240px);
        >li {
          width: 100%;
          padding: 8px 0;
          display: flex;
          .group_box {
            width: calc(100% - 100px);
            span {
              width: auto;
            }
          }
          >span:first-child {
            display: inline-block;
            width: 100px;
            color: #666666;
            text-align: right;
          }
          span:last-child {
            // width: calc(100% - 100px);
            color: #333333;
          }
        }
      }
    }
  }
  .dialog_comp {
    .content_body {
      >span {
        color: #999999;
        margin-bottom: 20px;
        display: inline-block;
      }
    }
    .group_name {
      position: relative;
      .group_error_tip {
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


