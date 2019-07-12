<template>
  <vue-scroll>
    <div class="admin_vehicle_info">
      <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/manage/basicInfo/personInfo' }">基础信息库</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/manage/basicInfo/vehicleInfo' }">车辆信息库</el-breadcrumb-item>
          <el-breadcrumb-item>管理组信息</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="content_box">
        <div class="btn_box">
          <div class="bnt_box_left">
            <span>{{groupName}}</span>
            <i class="edit_btn vl_icon vl_icon_manage_7" @click="showEditDialog"></i>
            <i class="del_btn vl_icon vl_icon_manage_8" @click="showDeleteDialog"></i>
          </div>
          <div class="bnt_box_right">
            <div class="oper_btn copy_btn" :class="[multipleSelection.length === 0 ? 'disabled_btn' : '']" :disabled="multipleSelection.length === 0 ? true : false" @click="showGroup = true">复制</div>
            <div class="oper_btn move_btn" :class="[multipleSelection.length === 0 ? 'disabled_btn' : '']" :disabled="multipleSelection.length === 0 ? true : false" @click="showMoveoutDialog">移出</div>
            <div class="copy_info" v-show="showGroup">
              <div class="copy_info_list">
                <vue-scroll>
                  <ul class="copy_info_ul">
                    <li
                      v-for="(item, index) in copyGroupList"
                      :key="index"
                      @click="handleCopyGroup(item.name)"
                    >{{item.name}}</li>
                  </ul>
                </vue-scroll>
              </div>
              <div class="add_btn" @click="showAddGroupDialog">
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
              <el-form-item prop="keyWord">
                <el-input style="width: 240px;" type="text" placeholder="请车牌号或车主或型号" v-model="searchForm.keyWord" />
              </el-form-item>
              <el-form-item>
                <el-button class="select_btn" @click="searchData">查询</el-button>
                <el-button class="reset_btn" @click="resetForm('searchForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table
            class="event_table"
            :data="vehicleList"
            @selection-change="handleSelectChange"
            >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="序号"
              type="index"
              >
            </el-table-column>
            <el-table-column
              label="车牌号"
              prop="vehicleNumber"
              show-overflow-tooltip
              >
              <template slot-scope="scope">
                <span>{{scope.row.vehicleNumber ? scope.row.vehicleNumber : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="车主"
              prop="ownerName"
              show-overflow-tooltip
              >
              <template slot-scope="scope">
                <span>{{scope.row.ownerName ? scope.row.ownerName : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="性别"
              prop="ownerSex"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              label="车辆型号"
              prop="vehicleModel"
              show-overflow-tooltip
              >
              <template slot-scope="scope">
                <span>{{scope.row.vehicleModel ? scope.row.vehicleModel : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="车辆颜色"
              prop="vehicleColor"
              show-overflow-tooltip
              >
              <template slot-scope="scope">
                <span>{{scope.row.vehicleColor ? scope.row.vehicleColor : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
              prop="desci"
              :show-overflow-tooltip='true'
            >
              <template slot-scope="scope">
                <span>{{scope.row.desci ? scope.row.desci : '-'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
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
      <!--查看车辆详细信息弹出框-->
      <el-dialog
        title="查看车辆信息"
        :visible.sync="vehicleDetailInfoDialog"
        width="722px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp_person"
        >
        <div class="content_body">
          <div class="content_left">
            <img :src="vehicleDetailInfo.vehicleImagePath" alt="">
          </div>
          <ul class="content_right">
            <li>
            <span>车牌号：</span>
            <span>{{vehicleDetailInfo.vehicleNumber ? vehicleDetailInfo.vehicleNumber : '无'}}</span>
          </li>
          <li>
            <span>车牌类型：</span>
            <span>{{vehicleDetailInfo.numberType ? vehicleDetailInfo.numberType : '无'}}</span>
          </li>
          <li>
            <span>车牌颜色：</span>
            <span>{{vehicleDetailInfo.numberColor ? vehicleDetailInfo.numberColor : '无'}}</span>
          </li>
          <li>
            <span>车主：</span>
            <span>{{vehicleDetailInfo.ownerName ? vehicleDetailInfo.ownerName : '无'}}</span>
          </li>
          <li>
            <span>证件号码：</span>
            <span>{{vehicleDetailInfo.ownerIdCard ? vehicleDetailInfo.ownerIdCard : '无'}}</span>
          </li>
          <li>
            <span>车辆类型：</span>
            <span>{{vehicleDetailInfo.vehicleType ? vehicleDetailInfo.vehicleType : '无'}}</span>
          </li>
          <li>
            <span>车辆型号：</span>
            <span>{{vehicleDetailInfo.vehicleModel ? vehicleDetailInfo.vehicleModel : '无'}}</span>
          </li>
          <li>
            <span>车辆颜色：</span>
            <span>{{vehicleDetailInfo.vehicleColor ? vehicleDetailInfo.vehicleColor : '无'}}</span>
          </li>
          <li>
            <span>车主性别：</span>
            <span>{{vehicleDetailInfo.ownerSex ? vehicleDetailInfo.ownerSex : '无'}}</span>
          </li>
          <li>
            <span>车主生日：</span>
            <span>{{vehicleDetailInfo.ownerBirth ? vehicleDetailInfo.ownerBirth : '无'}}</span>
          </li>
          <li>
            <span>底库信息：</span>
            <div class="group_box">
              <template v-if="albumList.length > 0">
                <!-- <span v-for="(item, index) in vehicleDetailInfo.albumList" :key="index">{{item.title + '、'}}</span> -->
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
              <template v-if="groupList.length > 0">
                <!-- <span v-for="(item, index) in vehicleDetailInfo.groupList" :key="index">{{item.groupName + '、'}}</span> -->
                <span>{{groupList.join('、')}}</span>
              </template>
              <template v-else>
                <span>无</span>
              </template>
            </div>
          </li>
            <li>
              <span>备注：</span>
              <span class="group_box">{{vehicleDetailInfo.desci ? vehicleDetailInfo.desci : '无'}}</span>
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
          <span>您已选择{{multipleSelection.length}}个对象，输入组名后已选对象将自动加入。</span>
          <el-form :model="addGroupForm" ref="addGroupForm" :rules="rules">
            <el-form-item label=" " prop="userGroupName" label-width="20px" class="group_name">
              <el-input @change="handleAGroupName" placeholder="请输入组名" style="width: 90%;" v-model="addGroupForm.userGroupName" maxlength="6"></el-input>
              <p class="group_error_tip" v-show="isShowError">分组名称不允许重复</p>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAddCopyGroup('addGroupForm')">取消</el-button>
          <el-button class="operation_btn function_btn" :loading="isAddCopyLoading" @click="addCopyGroupDialog('addGroupForm')">确认</el-button>
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
        <el-form :model="addGroupForm" ref="addGroupForm" :rules="rules">
          <el-form-item label=" " prop="userGroupName" label-width="20px" class="group_name">
            <el-input @change="handleEGroupName" placeholder="请输入组名" style="width: 90%;" v-model="addGroupForm.userGroupName" maxlength="6"></el-input>
            <p class="group_error_tip" v-show="isShowError">分组名称不允许重复</p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEditGroup('addGroupForm')">取消</el-button>
          <el-button class="operation_btn function_btn" :loading="isEditLoading" @click="editGroupInfo('addGroupForm')">确认</el-button>
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
        <span style="color: #999999;">删除后该组信息可在全部车辆中查找。</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="deleteGroupDialog = false">取消</el-button>
          <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="deleteGroup">确认</el-button>
        </div>
      </el-dialog>
      <!--移出组弹出框-->
      <el-dialog
        :title='delTitle'
        :visible.sync="moveoutGroupDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
        >
        <span style="color: #999999;">移除后该条信息可在全部车辆中查找。</span>
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
import { getVehicleInfo, editVeGroup, getVehicleGroup, delVeGroup, getAdminVelList, moveoutGroup,
  copyGroup, checkVelRename } from '@/views/index/api/api.manage.js';
export default {
  data () {
    return {
      delTitle: null,
      isShowError: false,
      groupId: null, // 要删除或修改的组id
      albumId: null, // 要删除或修改的底库id
      groupName: null, // 组名
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      showGroup: false,
      searchForm: {
        keyWord: null
      },
      addGroupForm: {
        userGroupName: null
      },
      rules: {
        userGroupName: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
          { max: 6, message: '最多输入6个字', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ]
      },
      vehicleList: [],
      albumList: [], // 底库列表
      groupList: [], // 分组列表
      vehicleDetailInfoDialog: false, // 查看车辆信息弹出框
      addGroupDialog: false, // 新增分组弹出框
      editGroupDialog: false, // 修改分组弹出框
      deleteGroupDialog: false, // 删除分组弹出框
      moveoutGroupDialog: false, // 移出组弹出框
      multipleSelection: [], // 表格选中的行
      vehicleDetailInfo: {}, // 车辆详情
      copyGroupList: [], // 可以复制的分组
      isAddCopyLoading: false, // 复制并加入组加载中
      isEditLoading: false, // 编辑组名加载中
      isDeleteLoading: false, // 删除组加载中
      isRemoveLoading: false, // 移除分组加载中
      originGroupName: null, // 最初始的组名
    }
  },
  mounted () {
    document.addEventListener('click', (e)=> {
      if (e.target.className != 'oper_btn copy_btn') {
        this.showGroup = false;
      }
    });

    this.groupId = this.$route.query.id;
    this.getList();
    this.getVeGroupInfo();
  },
  methods: {
    // 获取所有的车辆分组
    getVeGroupInfo () {
      getVehicleGroup()
        .then(res => {
          if (res && res.data) {
            // this.allGroupList = res.data;
            if (this.groupId) {
              res.data.groupNumList.map(item => {
                if (item.id == this.groupId) {
                  this.groupName = item.name;
                  this.originGroupName = item.name; // 保存下来，最后修改的时候比较是否有变化
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
    // 获取车辆列表数据
    getList () {
      const params = {
        'where.origin': 1, // 筛选底库的，不包括布控库
        'where.keyWord': this.searchForm.keyWord,
        'where.groupId': this.groupId,
        'where.albumId': this.albumId,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      }
      getAdminVelList(params)
        .then(res => {
          if (res) {
            this.vehicleList = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    // 搜索列表
    searchData () {
      this.getList();
    },
    // 清空搜索框
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getList();
    },
    handleSelectChange (val) {
      this.multipleSelection = val;
    },
    handleCurrentChange (page) {
      this.pagination.pageNum = page;
      this.getList();
    },
    // 当新增组名输入框改变时
    handleAGroupName () {
      this.isShowError = false;
    },
    // 当编辑组名输入框改变时
    handleEGroupName () {
      this.isShowError = false;
    },
    // 显示查看详细信息弹出框
    showLookDetailInfo (obj) {
      this.getVehicleDetailInfo(obj.uid);
      this.vehicleDetailInfoDialog = true;
    },
    // 查看车辆详情
    getVehicleDetailInfo (id) {
      if (id) {
        this.albumList = [];
        this.groupList = [];
        getVehicleInfo(id)
          .then(res => {
            if (res) {
              const birth = res.data.ownerBirth.substr(0, 10);
              this.vehicleDetailInfo = res.data;
              this.vehicleDetailInfo.ownerBirth = birth;

              this.vehicleDetailInfo.albumList.map(item => {
                this.albumList.push(item.title);
              });
              this.vehicleDetailInfo.groupList.map(item => {
                this.groupList.push(item.groupName);
              });
            }
          })
          .catch(() => {})
      }
    },
    // 显示编辑弹出框
    showEditDialog () {
      this.addGroupForm.userGroupName = this.groupName;
      this.isShowError = false;
      this.editGroupDialog = true;
    },
    // 取消编辑分组
    cancelEditGroup (form) {
      this.isShowError = false;
      this.$refs[form].resetFields();
      this.editGroupDialog = false;
      this.addGroupForm.userGroupName = null;
    },
    // 编辑组
    editGroupInfo (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.isShowError = false;
          const params = {
            groupName: this.addGroupForm.userGroupName
          };
          if (this.originGroupName === this.addGroupForm.userGroupName) {
            this.editGroupDialog = false;
            return;
          }
          checkVelRename(params)
            .then(res => {
              if (res.data) {
                this.isShowError = true;
              } else {
                this.isShowError = false;
                this.handleEditGroupInfo();
              }
            })
            .catch(() => {})
        }
      })
    },
    handleEditGroupInfo () {
      const params = {
        uid: parseInt(this.groupId),
        groupName: this.addGroupForm.userGroupName,
        groupType: 1
      };
      this.isEditLoading = true;
      editVeGroup(params)
        .then(res => {
          if (res) {
            this.getVeGroupInfo(parseInt(this.groupId));
            this.$message({
              type: 'success',
              message: '修改成功',
              customClass: 'request_tip'
            })
            this.editGroupDialog = false;
            this.isEditLoading = false;
            this.getVeGroupInfo(parseInt(this.groupId));
          }
            else {
            this.editGroupDialog = false;
          }
        })
        .catch(() => {this.editGroupDialog = false;})
    },
    // 显示删除弹出框
    showDeleteDialog () {
      this.deleteGroupDialog = true;
    },
    // 删除分组
    deleteGroup () {
      if (this.groupId) {
        this.isDeleteLoading = true;
        delVeGroup(this.groupId)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              })
              this.$router.back(-1);
              this.isDeleteLoading = false;
            } else {
              // this.$message({
              //   type: 'error',
              //   message: '删除失败',
              //   customClass: 'request_tip'
              // })
              this.isDeleteLoading = false;
            }
          })
          .catch(() => {this.isDeleteLoading = false;})
      }
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
        selectArr.push(item.uid);
      });
      selectArr = selectArr.join(',');
      const params = {
        groupId: this.groupId,
        vehicleIds: selectArr
      };
      this.isRemoveLoading = true;
      moveoutGroup(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '移出成功',
              customClass: 'request_tip'
            })
            this.getList();
            this.isRemoveLoading = false;
            this.moveoutGroupDialog = false;
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
    // 处理复制分组
    handleCopyGroup (name) {
      let selectArr = [];
      this.multipleSelection.map(item => {
        selectArr.push(item.uid);
      });
      const params = {
        // groupName: this.addGroupName || null,
        groupName: name || null,
        vehicleIds: selectArr
      };
      copyGroup(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '成功在' + name + '组中加入对象',
              customClass: 'request_tip'
            })
            this.getList();
            this.showGroup = false;
          }
        })
        .catch(() => {})
    },
    addCopyGroupDialog (form) {
      this.$refs[form].validate(valid => {
        this.isShowError = false;
        if (valid) {
          const params = {
            groupName: this.addGroupForm.userGroupName
          };
          checkVelRename(params)
            .then(res => {
              if (res.data) {
                this.isShowError = true;
              } else {
                this.isShowError = false;
                this.handleAddCopyGroupDialog();
              }
            })
            .catch(() => {})
        }
      })
    },
    // 复制或新增复制到组
    handleAddCopyGroupDialog () {
      let selectArr = [];
      this.multipleSelection.map(item => {
        selectArr.push(item.uid);
      });
      const params = {
        groupName: this.addGroupForm.userGroupName || null,
        // groupId: id || null,
        vehicleIds: selectArr
      };
      this.isAddCopyLoading = true;
      copyGroup(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '新增' + this.addGroupForm.userGroupName + '组，并成功加入对象',
              customClass: 'request_tip'
            })
            this.getList();
            this.addGroupDialog = false;
            this.isAddCopyLoading = false;
          } else {
            this.isAddCopyLoading = false;
          }
        })
        .catch(() => {this.isAddCopyLoading = false;})
    },
    // 显示新增分组弹出框
    showAddGroupDialog () {
      this.isShowError = false;
      this.addGroupForm.userGroupName = null;
      this.addGroupDialog = true;
    },
    // 取消新增分组弹出框
    cancelAddCopyGroup (form) {
      this.$refs[form].resetFields();
      this.isShowError = false;
      this.addGroupDialog = false;
      this.addGroupForm.userGroupName = null;
    }
  }
}
</script>
<style lang="scss" scoped>
.admin_vehicle_info {
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
            background-position: -694px -350px !important;
          }
        }
        .edit_btn {
          &:hover {
            background-position: -584px -350px !important;
          }
        }
      }
      .bnt_box_right {
        position: relative;
        display: flex;
        .copy_info {
          z-index: 1;
          width: auto;
          position: absolute;
          height: 170px;
          top: 45px;
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
            padding: 0 10px;
            cursor: pointer;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-top: 1px solid #F2F2F2;
            span, i {
              display: inline-block;
              vertical-align: middle;
            }
          }
        }
        .oper_btn {
          cursor: pointer;
          width:80px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-radius:4px;
        }
        .move_btn {
          border: 1px solid #D3D3D3;
          color: #666666;
          margin-left: 10px;
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
            width: calc(100% - 100px);
            color: #333333;
          }
        }
      }
    }
  }
  .dialog_comp {
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
    .content_body {
      >span {
        color: #999999;
        margin-bottom: 20px;
        display: inline-block;
      }
    }
  }
}
</style>
