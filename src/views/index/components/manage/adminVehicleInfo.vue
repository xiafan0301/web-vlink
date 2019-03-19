<template>
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
          <el-button class="oper_btn copy_btn" @click="showGroup = !showGroup">复制</el-button>
          <el-button class="oper_btn move_btn" @click="showMoveoutDialog">移出</el-button>
          <div class="copy_info" v-show="showGroup">
            <div class="copy_info_list">
              <vue-scroll>
                <ul class="copy_info_ul">
                  <li>分组命名文字限制十字</li>
                  <li>分组命名文字限制十字</li>
                  <li>分组命名文字限制十字</li>
                  <li>分组命名文字限制十字</li>
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
          </el-table-column>
          <el-table-column
            label="车主"
            prop="ownerName"
            show-overflow-tooltip
            >
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
          </el-table-column>
          <el-table-column
            label="车辆颜色"
            prop="vehicleColor"
            show-overflow-tooltip
            >
          </el-table-column>
          <el-table-column
            label="备注"
            prop="albumList"
            :show-overflow-tooltip='true'
          >
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <span class="operation_btn" @click="showLookDetailInfo(scope.row)">查看</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pagination.pageNum"
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
            <span>{{vehicleDetailInfo.vehicleNumber}}</span>
          </li>
          <li>
            <span>车牌类型：</span>
            <span>{{vehicleDetailInfo.numberType}}</span>
          </li>
          <li>
            <span>车牌颜色：</span>
            <span>{{vehicleDetailInfo.numberColor}}</span>
          </li>
          <li>
            <span>车主：</span>
            <span>{{vehicleDetailInfo.ownerName}}</span>
          </li>
          <li>
            <span>证件号码：</span>
            <span>{{vehicleDetailInfo.ownerIdCard}}</span>
          </li>
          <li>
            <span>车辆类型：</span>
            <span>{{vehicleDetailInfo.vehicleType}}</span>
          </li>
          <li>
            <span>车辆型号：</span>
            <span>{{vehicleDetailInfo.vehicleModel}}</span>
          </li>
          <li>
            <span>车辆颜色：</span>
            <span>{{vehicleDetailInfo.vehicleColor}}</span>
          </li>
          <li>
            <span>车主性别：</span>
            <span>{{vehicleDetailInfo.ownerSex}}</span>
          </li>
          <li>
            <span>车主生日：</span>
            <span>{{vehicleDetailInfo.ownerBirth | fmTimestamp }}</span>
          </li>
          <li>
            <span>底库信息：</span>
            <span>{{vehicleDetailInfo.albumList}}</span>
          </li>
          <li>
            <span>分组信息：</span>
            <span>{{vehicleDetailInfo.groupList}}</span>
          </li>
          <li>
            <span>备注：</span>
            <span>{{vehicleDetailInfo.desci}}</span>
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
        <el-input placeholder="请输入组名，名字限制在10个" v-model="userGroupName"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGroupDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="addGroupDialog = false">确认</el-button>
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
      <div class="content_body">
        <el-input placeholder="请输入组名，名字限制在10个" v-model="userGroupName"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editGroupDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="editGroupInfo">确认</el-button>
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
      <span style="color: #999999;">删除后该组信息可在系统默认中查找。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteGroupDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="deleteGroup">确认</el-button>
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
      <span style="color: #999999;">移除后该条信息可在系统默认中查找。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="moveoutGroupDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="moveoutGroupInfo">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getVehicleInfo, editVeGroup, getVehicleGroup, delVeGroup, getAdminVelList, moveoutGroup } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      delTitle: null,
      isGroup: true, // 是分组还是底库
      groupId: null, // 要删除或修改的组id
      albumId: null, // 要删除或修改的底库id
      groupName: null, // 组名
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      userGroupName: null,
      showGroup: false,
      searchForm: {
        keyWord: null
      },
      vehicleList: [],
      vehicleDetailInfoDialog: false, // 查看车辆信息弹出框
      addGroupDialog: false, // 新增分组弹出框
      editGroupDialog: false, // 修改分组弹出框
      deleteGroupDialog: false, // 删除分组弹出框
      moveoutGroupDialog: false, // 移出组弹出框
      multipleSelection: [], // 表格选中的行
      vehicleDetailInfo: {}, // 车辆详情
    }
  },
  mounted () {
    this.groupId = parseInt(this.$route.query.id);
    if (this.$route.query.type == 1) { // 分组查看
      this.isGroup = true;
    } else { // 底库查看
      this.isGroup = false;
    }
    this.getList();
    this.getVeGroupInfo(parseInt(this.$route.query.id));
  },
  methods: {
    // 获取所有的车辆分组
    getVeGroupInfo (uid) {
      getVehicleGroup()
        .then(res => {
          if (res && res.data) {
            res.data.map(item => {
              if (item.id === uid) {
                this.groupName = item.name;
              }
            });
          }
        })
        .catch(() => {})
    },
    // 获取车辆列表数据
    getList () {
      const params = {
        'where.type': parseInt(this.$route.query.type),
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
    // 显示查看详细信息弹出框
    showLookDetailInfo (obj) {
      this.getVehicleDetailInfo(obj.uid);
      this.vehicleDetailInfoDialog = true;
    },
    // 查看车辆详情
    getVehicleDetailInfo (id) {
      if (id) {
        getVehicleInfo(id)
          .then(res => {
            if (res) {
              this.vehicleDetailInfo = res.data;
            }
          })
          .catch(() => {})
      }
    },
    // 显示编辑弹出框
    showEditDialog () {
      this.userGroupName = this.groupName;
      this.editGroupDialog = true;
    },
    // 编辑组
    editGroupInfo () {
      const params = {
        uid: parseInt(this.groupId),
        groupName: this.userGroupName,
        groupType: 1
      }
      if (this.isGroup) {
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
            } else {
              this.$message({
                type: 'error',
                message: '修改失败',
                customClass: 'request_tip'
              })
            }
          })
          .catch(() => {})
      }
    },
    // 显示删除弹出框
    showDeleteDialog () {
      this.deleteGroupDialog = true;
    },
    // 删除分组
    deleteGroup () {
      if (this.groupId) {
        delVeGroup(this.groupId)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              })
              this.$router.back(-1);
            } else {
              this.$message({
                type: 'error',
                message: '删除失败',
                customClass: 'request_tip'
              })
            }
          })
          .catch(() => {})
      }
    },
    // 显示移出弹出框
    showMoveoutDialog () {
      const length = this.multipleSelection.length;
      this.delTitle = '是否确定将这 ' + length + ' 条人员数据移出该组?';
      if (length === 0) {
        this.$message({
          type: 'warning',
          message: '请先选择要移出数据',
          customClass: 'request_tip'
        })
      } else {
        this.moveoutGroupDialog = true;
      }
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
      moveoutGroup(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '移出成功',
              customClass: 'request_tip'
            })
            this.getList();
            this.moveoutGroupDialog = false;
          } else {
            this.$message({
              type: 'error',
              message: '移出失败',
              customClass: 'request_tip'
            })
          }
        })
        .catch(() => {})
    },
    // 显示新增分组弹出框
    showAddGroupDialog () {
      this.addGroupDialog = true;
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
        .copy_info {
          z-index: 1;
          position: absolute;
          top: 45px;
          background-color: #ffffff;
          color: #333333;
          border-radius: 4px;
          box-shadow:5px 5px 8px 5px #949494;
          .copy_info_list {
            height: 150px;
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
            display: flex;
            align-items: center;
            padding-left: 25%;
            border-top: 1px solid #F2F2F2;
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
          span:first-child {
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
