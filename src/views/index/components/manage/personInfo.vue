<template>
  <vue-scroll>
    <div class="basic_info">
      <div class="basic_info_left">
        <el-select v-model="selectMethod" @change="handleChangePerson" style="width: 220px;margin: 15px;" size="small" placeholder="请选择">
          <el-option
            v-for="item in selectType"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <div class="search_box">
          <el-input placeholder="搜索组" size="small"  v-model="searchGroupName" @input="changeGroupName">
            <i v-show="closeShow" slot="suffix" @click="onClear" class="search_icon el-icon-close" style="font-size: 16px;margin-right: 5px"></i>
            <i
              v-show="!closeShow"
              class="search_icon vl_icon vl_icon_manage_1"
              slot="suffix"
              @click="searchData">
            </i>
          </el-input>
        </div>
        <template v-if="selectMethod === 1">
          <div class="left_content_box">
            <div class="add_btn">
              <i class="vl_icon vl_icon_manage_4" @click="showAddGroupDialog"></i>
              <span>新增分组</span>
            </div>
            <vue-scroll>
              <ul class="group_ul">
                <li :class="[activeSelect === -1 ? 'active_select' : '']" @click="getPerDetailInfo('', 1)">全部人像({{allPerGroupNumber}})</li>
                <li :class="[activeSelect == item.id ? 'active_select' : '']" v-for="(item, index) in perGroupList" :key="'item' + index" @click="getPerDetailInfo(item, 1)">
                  <span>{{item.name}}({{item.portraitNum}})</span>
                  <i class="vl_icon vl_icon_manage_10" @click="skipAdminPersonPage(item.id, 1, $event)"></i>
                </li>
              </ul>
            </vue-scroll>
          </div>
        </template>
        <template v-if="selectMethod === 2">
          <div class="left_content_box">
            <vue-scroll>
              <ul class="group_ul">
                <li :class="[activeSelect === -1 ? 'active_select' : '']" @click="getPerDetailInfo('', 2)">全部人像({{allPerBottomNameNumber}})</li>
                <li :class="[activeSelect == item.id ? 'active_select' : '']" v-for="(item, index) in perBottomBankList" :key="'item' + index" @click="getPerDetailInfo(item, 2)">
                  <span>{{item.title}}({{item.portraitNum}})</span>
                  <i class="vl_icon vl_icon_manage_10" @click="skipAdminPersonPage(item.id, 2, $event)"></i>
                </li>
              </ul>
            </vue-scroll>
          </div>
        </template>
      </div>
      <div class="basic_info_right_group">
        <div class="search_right_box">
          <el-form :inline="true" :model="searchForm" class="event_form" ref="searchForm">
            <el-form-item style="width: 240px;" prop="idNo">
              <el-input style="width: 240px;" type="text" placeholder="请输入姓名或证件号" v-model="searchForm.idNo" />
            </el-form-item>
            <el-form-item prop="idType">
              <el-select v-model="searchForm.idType" style="width: 240px;" placeholder="证件类型">
                <el-option label="身份证" :value="1"></el-option>
                <el-option label="护照" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="sex">
              <el-select v-model="searchForm.sex" style="width: 240px;" placeholder="性别">
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <template v-if="selectMethod === 1">
              <el-form-item prop="albumId">
                <el-select v-model="searchForm.albumId" style="width: 240px;" placeholder="底库筛选" clearable> <!--底库列表-->
                  <el-option
                    v-for="(item, index) in perBottomBankList"
                    :key="index"
                    :label="item.title" 
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
            <template v-if="selectMethod === 2">
              <el-form-item prop="groupId">
                <el-select v-model="searchForm.groupId" style="width: 240px;" placeholder="分组筛选" clearable> <!--分组-->
                  <el-option
                    v-for="(item, index) in perGroupList"
                    :key="index"
                    :label="item.name" 
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item>
              <el-button class="select_btn" @click="searchPersonData">查询</el-button>
              <el-button class="reset_btn" @click="resetForm('searchForm')">重置</el-button>
            </el-form-item>
          </el-form>
          <div class="divide"></div>
        </div>
        <div class="table_box">
          <div class="add_btn_box">
            <div class="add_event_btn" :class="[multipleSelection.length === 0 ? 'disabled_btn' : '']" @click="showGroupDialog">
              <span>+</span>
              <span>加入组</span>
            </div>
            <div class="group_info" v-show="showGroup">
              <div class="group_info_list">
                <vue-scroll>
                  <ul class="group_info_ul">
                    <template v-if="selectMethod === 1">
                      <li
                        v-for="(item, index) in copyPerGroupInfoList"
                        :key="'item' + index"
                        @click="handleCopyGroup(item.id)"
                      >{{item.name}}</li>
                    </template>
                    <template v-else>
                      <li
                        v-for="(item, index) in perGroupList"
                        :key="'item' + index"
                        @click="handleCopyGroup(item.id)"
                      >{{item.name}}</li>
                    </template>
                  </ul>
                </vue-scroll>
              </div>
              <div class="add_btn" @click="showAddGroupCopyDialog">
                <i class="vl_icon vl_icon_manage_4" ></i>
                <span>新增分组</span>
              </div>
            </div>
          </div>
          <template v-if="selectMethod === 1">
            <el-table
              class="event_table"
              :data="personGroupList"
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
                  <span v-show="scope.row.idType === 1">身份证</span>
                  <span v-show="scope.row.idType === 2">护照</span>
                </template>
              </el-table-column>
              <el-table-column
                label="证件号码"
                prop="idNo"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="底库信息"
                prop="albumList"
                :show-overflow-tooltip='true'
              >
                <template slot-scope="scope">
                <span v-for="(item, index) in scope.row.albumList" :key="index">
                  {{item.name + ' '}}
                </span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                  <span class="operation_btn" @click="showLookDetailInfo(scope.row)">查看</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template v-else>
            <el-table
              class="event_table"
              :data="personGroupList"
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
                  <span v-show="scope.row.idType === 1">身份证</span>
                  <span v-show="scope.row.idType === 2">护照</span>
                </template>
              </el-table-column>
              <el-table-column
                label="证件号码"
                prop="idNo"
                show-overflow-tooltip
                >
              </el-table-column>
              <el-table-column
                label="分组信息"
                prop="groupList"
                :show-overflow-tooltip='true'
              >
                <template slot-scope="scope">
                <span v-for="(item, index) in scope.row.groupList" :key="index">
                  {{item.name + ' '}}
                </span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                  <span class="operation_btn" @click="showLookDetailInfo(scope.row)">查看</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pagination.pageNum"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="pagination.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
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
              <span>{{personDetailInfo.idType === 1 ? '身份证' : personDetailInfo.idType ===2 ? '护照' : ''}}</span>
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
              <span></span>
            </li>
            <li>
              <span>分组信息：</span>
              <span></span>
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
        <el-form :model="addGroupForm" ref="addGroupForm" :rules="rules">
          <el-form-item label=" " prop="userGroupName" label-width="20px" class="group_name">
            <el-input placeholder="请输入组名" style="width: 90%;" v-model="addGroupForm.userGroupName"></el-input>
            <p class="group_error_tip" v-show="isShowError">分组名称不允许重复</p>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAddGroup('addGroupForm')">取消</el-button>
          <el-button class="operation_btn function_btn" @click="addGroupInfo('addGroupForm')">确认</el-button>
        </div>
      </el-dialog>
      <!--新增组弹出框-->
      <el-dialog
        title="新增分组"
        :visible.sync="addGroupCopyDialog"
        width="482px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        class="dialog_comp"
        >
        <div class="content_body">
          <span>您已选择{{multipleSelection.length}}个对象，输入组名后已选对象将自动加入。</span>
          <el-form :model="addGroupForm" ref="addGroupForm" :rules="rules">
            <el-form-item label=" " prop="userGroupName" label-width="20px" class="group_name">
              <el-input placeholder="请输入组名" style="width: 90%;" v-model="addGroupForm.userGroupName"></el-input>
              <p class="group_error_tip" v-show="isShowError">分组名称不允许重复</p>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAddGroupCopy('addGroupForm')">取消</el-button>
          <el-button class="operation_btn function_btn" @click="addCopyGroupInfo('addGroupForm')">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </vue-scroll>
</template>
<script>
import { validateName } from '@/utils/validator.js';
import { getPerBottomBankList, getPerGroupList, getPersonData, addGroup, 
getPersonDetail, judgePerson, copyPersonGroup, addGroupCopyPerson } from '@/views/index/api/api.manage.js';
export default {
  data () {
    return {
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      userGroupName: null,
      searchGroupName: null, // 搜索组名
      closeShow: false,
      activeSelect: -1, // 默认选中的分组
      allPerBottomNameNumber: 0, // 所有人员底库数量
      allPerGroupNumber: 0, // 所有人员分组数量
      selectType: [
        {
          id: 1,
          name: '按分组查看'
        },
        {
          id: 2,
          name: '按底库查看'
        }
      ],
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
      selectMethod: 1, // 左侧查看方式  1--分组方式查看 2--底库查看
      searchForm: {
        idNo: null,
        idType: null,
        sex: null,
        albumId: null,
        groupId: null
      },
      personGroupList: [],
      isShowError: false,
      showGroup: false,
      personDetailInfo: {}, // 人员详细信息
      perosnDetailInfoDialog: false, // 查看人员信息弹出框
      addGroupDialog: false, // 新增分组弹出框
      addGroupCopyDialog: false, // 加入组-新增分组弹出框
      perGroupList: [], // 分组列表
      perBottomBankList: [], // 底库列表
      copyPerGroupInfoList: [],
      multipleSelection: [], // 表格多选
    }
  },
  mounted () {
    this.getGroupList();
    // this.getBottomBankList();
    // this.getPersonList();
  },
  methods: {
    // 获取分组列表
    getGroupList () {
      const params = {
        type: 4, // 4---人像
        name: this.searchGroupName
      }
      getPerGroupList(params)
        .then(res => {
          if (res) {
            this.perGroupList = res.data.groupNumList;
            this.copyPerGroupInfoList = JSON.parse(JSON.stringify(res.data.groupNumList));
            this.allPerGroupNumber = res.data.portraitNum;
            this.getPersonList();
          }
        })
        .catch(() => {})
    },
    // 获取底库列表
    getBottomBankList () {
      const params = {
        type: 1, // 1--人像库
        name: this.searchGroupName
      }
      getPerBottomBankList(params)
        .then(res => {
          if (res) {
            this.perBottomBankList = res.data;
             this.perBottomBankList.map(item => {
              this.allPerBottomNameNumber += item.portraitNum;
            })
          }
        })
        .catch(() => {})
    },
    // 获取人员列表
    getPersonList () {
      const params = {
        // 'where.type': this.selectMethod,
        'where.keyWord': this.searchForm.keyWord,
        'where.albumId': this.searchForm.albumId,
        'where.groupId': this.searchForm.groupId,
        'where.idType': this.searchForm.idType,
        'where.idNo': this.searchForm.idNo,
        'where.sex': this.searchForm.sex,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      };
      getPersonData(params)
        .then(res => {
          if (res) {
            this.personGroupList = res.data.list;
            this.pagination.total = res.data.total;
          }
        })
        .catch(() => {})
    },
    // 表格多选
    handleSelectChange (val) {
      this.multipleSelection = val;
    },
    // 显示加入组tankuang
    showGroupDialog () {
      if (this.multipleSelection.length > 0) {
        this.showGroup = !this.showGroup;
      } else {
        this.showGroup = false;
      }
    },
    // 根据搜索条件查询人员列表
    searchPersonData () {
      this.pagination.pageNum = 1;
      this.getPersonList();
    },
    // 清空搜索人员列表框
    resetForm (form) {
      this.pagination.pageNum = 1;
      this.$refs[form].resetFields();
      this.getPersonList();
    },
    // 搜索框组名change
    changeGroupName (val) {
      if (!val) {
        this.closeShow = false;
        if (this.selectMethod === 1) {
          this.getGroupList();
        } else {
          this.getBottomBankList();
        }
      }
    },
    // 清空搜索框
    onClear () {
      this.closeShow = false;
      this.searchGroupName = null;
      if (this.selectMethod === 1) {
        this.getGroupList();
      } else {
        this.getBottomBankList();
      }
    },
    // 搜索组名
    searchData () {
      if (this.searchGroupName) {
        this.closeShow = true;
        if (this.selectMethod === 1) {
          this.getGroupList();
        } else {
          this.getBottomBankList();
        }
      }
    },
    cancelAddGroup (form) {
      this.addGroupDialog = false;
      this.$refs[form].resetFields();
      this.isShowError = false;
      this.addGroupForm.userGroupName = null;
    },
    // 显示加入组---取消新增分组
    cancelAddGroupCopy (form) {
      this.addGroupCopyDialog = false;
      this.isShowError = false;
      this.addGroupForm.userGroupName = null;
      this.$refs[form].resetFields();
    },
    // 复制或新增复制到组 --判断组名是否重复
    addCopyGroupInfo (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          const params = {
            name: this.addGroupForm.userGroupName
          };
          judgePerson(params)
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
    },
    // 复制或新增复制到组
    handleAddCopyGroupInfo () {
      let selectArr = [];
      this.multipleSelection.map(item => {
        selectArr.push(item.id);
      });
      const params = {
        newGroupName: this.addGroupForm.userGroupName || null,
        // groupId: id || null,
        memberIds: selectArr
      };
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
            this.addGroupCopyDialog = false;
          } else {
            this.$message({
              type: 'error',
              message: '新增失败',
              customClass: 'request_tip'
            })
          }
        })
        .catch(() => {})
    },
    // 点击左边分组获取右边人员列表
    getPerDetailInfo (obj, type) {
      this.pagination.pageNum = 1;
      this.showGroup = false;
      this.searchForm.groupId = null;
      this.searchForm.albumId = null;
      this.searchForm.keyWord = null;
      this.activeSelect = obj.id;
      if (type === 1) {
        this.searchForm.groupId = obj.id;
        this.perGroupList.map((item, index) => { // 在所有分组中去掉当前选中的组
          if (item.id === obj.id) {
            this.copyPerGroupInfoList.splice(index, 1);
          }
        })
      } else {
        this.searchForm.albumId = obj.id;
      }
      if (!obj) {
        this.activeSelect = -1;
      }
      this.getPersonList();
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
            this.getGroupList();
            this.showGroup = false;
          }
        })
        .catch(() => {})
    },
    // 选择方式的change
    handleChangePerson (val) {
      this.activeSelect = -1;
      this.searchGroupName = null;
      this.searchForm.groupId = null;
      this.searchForm.albumId = null;
      this.searchForm.keyWord = null;
      if (val === 1) {
        this.getGroupList();
      } else {
        this.getBottomBankList();
      }
    },
    handleCurrentChange (page) {
      this.showGroup = false;
      this.pagination.pageNum = page;
      // if (this.selectMethod === 1) {
        this.getPersonList();
      // }
    },
    // 显示新增分组弹出框
    showAddGroupDialog () {
      this.isShowError = false;
      this.addGroupForm.userGroupName = null;
      this.addGroupDialog = true;
    },
    // 新增分组
    addGroupInfo (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          const params = {
            name: this.addGroupForm.userGroupName
          };
          judgePerson(params)
            .then(res => {
              if (res.data) {
                this.isShowError = true;
              } else {
                this.isShowError= false;
                this.handleAddGroupInfo();
              }
            })
            .catch(() => {})
        }
      })
    },
    handleAddGroupInfo () {
      const params = {
        groupName: this.addGroupForm.userGroupName,
        groupType: 4
      };
      addGroup(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '新增成功',
              customClass: 'request_tip'
            })
            this.getGroupList();
            this.addGroupDialog = false;
          }
        })
        .catch(() => {})
    },
    // 显示加入组--新增分组弹出框
    showAddGroupCopyDialog () {
      this.addGroupCopyDialog = true;
    },
    // 显示查看详细信息弹出框
    showLookDetailInfo (obj) {
      this.perosnDetailInfoDialog = true;
      if (obj.id) {
        getPersonDetail(obj.id)
          .then(res => {
            if (res) {
              this.personDetailInfo = res.data;
            }
          })
          .catch(() => {})
      }
    },
    // 跳至管理人员组信息页面
    skipAdminPersonPage (id, val, e) {
      // console.log('111')
      e.stopPropagation();
      this.$router.push({name: 'admin_person_info', query: {type: val, id: id}});
    }
  }
}
</script>
<style lang="scss" scoped>
.basic_info {
  background-color: #ffffff;
  height: 100%;
  display: flex;
  .basic_info_left {
    width: 260px;
    height: 100%;
    border-right: 1px solid #f2f2f2;
    .search_box {
      padding: 0 18px 10px;
      /deep/ .el-input--small .el-input__inner {
        width: 220px;
        border-radius: 40px;
        background-color: #F2F2F2;
        color: #999999;
      }
      .search_icon{
        margin-top: 8px;
        cursor: pointer; 
      }
    }
    .left_content_box {
      .group_ul {
        >li {
          padding-left: 40px;
          height: 36px;
          line-height: 36px;
          display: flex;
          align-items: center;
          color: #333333;
          cursor: pointer;
          i {
            display: block;
            margin-left: 5px;
            &:hover {
              background-position: -412px -350px;
            }
          }
          &:hover {
            background-color: #E0F2FF;
            i {
              display: block;
            }
          }
        }
        .active_select {
          background-color: #E0F2FF;
          color: #0C70F8;
        }
      }
      .add_btn {
        padding: 15px;
        display: flex;
        color: #333333;
        align-items: center;
        i {
          cursor: pointer;
        }
        > span {
          margin-left: 5px;
        }
      }

    }
  }
  .basic_info_right_group {
    width: calc(100% - 260px);
    .search_right_box {
      width: 100%;
      padding: 20px;
      .event_form {
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
      .divide {
        border: 1px dashed #fafafa;
      }
    }
    .table_box {
      padding: 0 20px;
      .add_btn_box {
        position: relative;
        .add_event_btn {
          width: 108px;
          height: 40px;
          background-color: #0C70F8;
          color: #ffffff;
          font-size: 14px;
          line-height: 40px;
          text-align: center;
          border-radius: 3px;
          cursor: pointer;
          span:nth-child(1) {
            font-size: 16px;
          }
          span:nth-child(2) {
            margin-left: 5px;
          }
        }
        .disabled_btn {
          background-color: #D3D3D3;
          color: #B2B2B2;
          cursor: default;
        } 
        .group_info {
          z-index: 1;
          position: absolute;
          top: 45px;
          background-color: #ffffff;
          color: #333333;
          height: 170px;
          border-radius: 4px;
          box-shadow:5px 5px 8px 5px #949494;
          .group_info_list {
            height: calc(170px - 30px);
            .group_info_ul {
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
            text-align: center;
            padding: 0 10px;
            border-top: 1px solid #F2F2F2;
            span, i {
              display: inline-block;
              vertical-align: middle;
            }
          }
        }
      }
      .event_table {
        margin-top: 8px;
        /deep/ .el-checkbox__inner {
          z-index: 0;
        }
        .operation_btn {
          color: #0C70F8;
          cursor: pointer;
          padding: 0 10px;
          display: inline-block;
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


