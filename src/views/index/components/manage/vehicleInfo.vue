<template>
  <div class="vehicle_info">
    <div class="vehicle_info_left">
      <el-select v-model="selectMethod" @change="handleChangeVehicle" style="width: 220px;margin: 15px;" size="small" placeholder="请选择">
        <el-option
          v-for="item in selectType"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <div class="search_box">
        <el-input placeholder="搜索组" size="small" v-model="searchGroupName" @change="changeGroupName">
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
          <div class="one_group_ul">
            <vue-scroll>
              <ul class="group_ul">
                <li :class="[activeSelect === -1 ? 'active_select' : '']" @click="getVeDetailInfo('', 1)">全部车辆({{allVelGroupNumber}})</li>
                <li :class="[activeSelect == item.id ? 'active_select' : '']" v-for="(item, index) in vehicleGroupList" :key="'item' + index" @click="getVeDetailInfo(item, 1)">
                  <span>{{item.name}}({{item.portraitNum}})</span>
                  <i class="vl_icon vl_icon_manage_10" @click="skipAdminVehiclePage(item.id, 1, $event)"></i>
                </li>
              </ul>
            </vue-scroll>
          </div>
        </div>
      </template>
      <template v-if="selectMethod === 2">
        <div class="left_content_box">
          <vue-scroll>
            <ul class="group_ul">
              <li :class="[activeSelect === -1 ? 'active_select' : '']" @click="getVeDetailInfo('', 2)">全部车辆({{allVelBottomNameNumber}})</li>
              <li :class="[activeSelect == item.id ? 'active_select' : '']" v-for="(item, index) in vehicleBottomNameList" :key="'item' + index" @click="getVeDetailInfo(item, 2)">
                <span>{{item.title}}({{item.portraitNum}})</span>
                <i class="vl_icon vl_icon_manage_10" @click="skipAdminVehiclePage(item.id, 2, $event)"></i>
              </li>
            </ul>
          </vue-scroll>
        </div>
      </template>
    </div>
    <div class="vehicle_info_right_group">
      <vue-scroll>
        <div class="search_right_box">
          <el-form :inline="true" :model="searchForm" class="event_form" ref="searchForm">
            <el-form-item style="width: 240px;" prop="keyWord">
              <el-input style="width: 240px;" type="text" placeholder="请输入车牌号或车主或型号" v-model="searchForm.keyWord" />
            </el-form-item>
            <template v-if="selectMethod === 1">
              <el-form-item prop="albumId">
                <el-select v-model="searchForm.albumId" style="width: 240px;" placeholder="底库筛选" clearable> <!--底库列表-->
                  <el-option
                    v-for="(item, index) in vehicleBottomNameList"
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
                    v-for="(item, index) in vehicleGroupList"
                    :key="index"
                    :label="item.name" 
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item>
              <el-button class="select_btn" @click="selectDataList">查询</el-button>
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
                        v-for="(item, index) in copyGroupInfoList"
                        :key="'item' + index"
                        @click="handleCopyGroup(item.name)"
                      >{{item.name}}</li>
                    </template>
                    <template v-else>
                      <li
                        v-for="(item, index) in vehicleGroupList"
                        :key="'item' + index"
                        @click="handleCopyGroup(item.name)"
                      >{{item.name}}</li>
                    </template>
                  </ul>
                </vue-scroll>
              </div>
              <div class="add_btn"  @click="showAddGroupCopyDialog">
                <i class="vl_icon vl_icon_manage_4"></i>
                <span>新增分组</span>
              </div>
            </div>
          </div>
          <template v-if="selectMethod === 1">
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
                label="底库信息"
                prop="albumList"
                :show-overflow-tooltip='true'
              >
                <template slot-scope="scope">
                  <span v-for="(item, index) in scope.row.albumList" :key="index">
                    {{item.title + ' '}}
                  </span>
                </template>
                <!-- <span>{{albumList.join('、')}}</span> -->
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
                label="分组信息"
                prop="groupList"
                :show-overflow-tooltip='true'
              >
                <template slot-scope="scope">
                  <span v-for="(item, index) in scope.row.groupList" :key="index">
                    {{item.groupName + ' '}}
                  </span>
                </template>
                <!-- <span>{{groupList.join('、')}}</span> -->
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
          class="cum_pagination"
          @current-change="handleCurrentChange"
          :current-page="pagination.pageNum"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="pagination.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
      </vue-scroll>
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
            <div class="group_box">
              <template v-if="albumDetailList.length > 0">
                <!-- <span v-for="(item, index) in vehicleDetailInfo.albumList" :key="index">{{item.title + '、'}}</span> -->
                <span>{{albumDetailList.join('、')}}</span>
              </template>
              <template v-else>
                <span>无</span>
              </template>
            </div>
          </li>
          <li>
            <span>分组信息：</span>
            <div class="group_box">
              <template v-if="groupDetailList.length > 0">
                <!-- <span v-for="(item, index) in vehicleDetailInfo.groupList" :key="index">{{item.groupName + '、'}}</span> -->
                <span>{{groupDetailList.join('、')}}</span>
              </template>
              <template v-else>
                <span>无</span>
              </template>
            </div>
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
      <el-form :model="addGroupForm" ref="addGroupForm" :rules="rules">
        <el-form-item label=" " prop="userGroupName" label-width="20px" class="group_name">
          <el-input placeholder="请输入组名" style="width: 90%;" v-model="addGroupForm.userGroupName"></el-input>
          <p class="group_error_tip" v-show="isShowError">分组名称不允许重复</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddGroup('addGroupForm')">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="addGroupInfo('addGroupForm')">确认</el-button>
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
        <el-button class="operation_btn function_btn" :loading="isAddCopyLoading" @click="addCopyGroupInfo('addGroupForm')">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { validateName } from '@/utils/validator.js';
import { getVehicleGroup, getVehicleBottomName, getVehicleDataList, addGroup, getVehicleInfo,
  copyGroup, checkVelRename } from '@/views/index/api/api.manage.js';
export default {
  data () {
    return {
      isShowError: false,
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      userGroupName: null, // 新增分组组名
      addCopyGroupName: null, // 新增复制组名
      searchGroupName: null, // 搜索组
      closeShow: false,
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
      activeSelect: -1, // 默认选中的分组
      selectMethod: 1, // 左侧查看方式  1--分组方式查看 2--底库查看
      searchForm: {
        keyWord: null, // 车牌号/车主/型号
        albumId: null, // 底库id
        groupId: null // 分组id
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
      albumDetailList: [], // 详情底库列表
      groupDetailList: [], // 分详情组列表
      showGroup: false,
      vehicleDetailInfoDialog: false, // 查看车辆信息弹出框
      addGroupDialog: false, // 新增分组弹出框
      addGroupCopyDialog: false, // 加入组-新增分组弹出框
      vehicleGroupList: [], // 车辆分组数据
      allVelGroupNumber: 0, // 所有车辆组数量
      vehicleBottomNameList: [], // 车辆底库数据
      allVelBottomNameNumber: 0, // 所有车辆底库数量
      multipleSelection: [], // 表格选中的行
      vehicleDetailInfo: {}, // 车辆详细信息
      copyGroupInfoList: [], // 可复制的分组
      currSelectGroupId: null, // 当前选中的组名id
      isAddLoading: false, // 加入组加载中
      isAddCopyLoading: false, // 复制并加入组加载中
    }
  },
  mounted () {
    this.getVeGroupInfo();
    this.getVelBottomNameInfo();
  },
  methods: {
    // 列表查询
    selectDataList () {
      this.pagination.pageNum = 1;
      this.getVehicleInfoList();
    },
    // 清空列表查询
    resetForm (form) {
      this.pagination.pageNum = 1;
      this.$refs[form].resetFields();
      this.getVehicleInfoList();
    },
    // 获取车辆列表数据
    getVehicleInfoList () {
      const params = {
        // 'where.type': type,
        'where.keyWord': this.searchForm.keyWord,
        'where.albumId': this.searchForm.albumId,
        'where.groupId': this.searchForm.groupId,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize
      }
      getVehicleDataList(params)
        .then(res => {
          if (res) {
            this.vehicleList = res.data.list;
            this.pagination.total = res.data.total;
            // this.vehicleList.map(val => {
            //   val.albumList.map(item => {
            //     this.albumList.push(item.title);
            //   });
            //   val.groupList.map(item => {
            //     this.groupList.push(item.name);
            //   });
            // })
          }
        })
        .catch(() => {})
    },
    // 根据具体的车辆分组或底库获取车辆列表数据
    getVeDetailInfo (obj, type) {
      this.searchForm.groupId = null;
      this.searchForm.albumId = null;
      this.searchForm.keyWord = null;
      this.activeSelect = obj.id;
      this.showGroup = false;
      if (type === 1) {
        if (obj) {
          this.searchForm.groupId = obj.id;
          this.vehicleGroupList.map((item, index) => { // 在所有分组中去掉当前选中的组
            if (item.id === obj.id) {
              this.copyGroupInfoList.splice(index, 1);
            }
          });
        }
      } else {
        this.searchForm.albumId = obj.id;
      }
      if (!obj) {
        this.activeSelect = -1;
        this.copyGroupInfoList = JSON.parse(JSON.stringify(this.vehicleGroupList));
      }
      this.getVehicleInfoList();
    },
    // 查询车辆分组
    getVeGroupInfo () {
      this.allVelGroupNumber = 0;
      this.pagination.pageNum = 1;
      const params = {
        groupName: this.searchGroupName
      }
      getVehicleGroup(params)
        .then(res => {
          if (res) {
            this.vehicleGroupList = res.data.groupNumList;
            this.copyGroupInfoList = JSON.parse(JSON.stringify(res.data.groupNumList));
            this.allVelGroupNumber = res.data.portraitNum;
            this.getVehicleInfoList();
          }
        })
        .catch(() => {})
    },
    // 查询车辆底库
    getVelBottomNameInfo () {
      this.allVelBottomNameNumber = 0;
      this.pagination.pageNum = 1;
      const params = {
        bankName: this.searchGroupName
      }
      getVehicleBottomName(params)
        .then(res => {
          if (res) {
            this.vehicleBottomNameList = res.data.albumNumQueryDtoList;
            // this.vehicleBottomNameList.map(item => {
              this.allVelBottomNameNumber = res.data.total;
            // })
            this.getVehicleInfoList();
          }
        })
        .catch(() => {})
    },
    // 查看车辆详情
    getVehicleDetailInfo (id) {
      if (id) {
        getVehicleInfo(id)
          .then(res => {
            if (res) {
              this.vehicleDetailInfo = res.data;
              this.vehicleDetailInfo.albumList.map(item => {
                this.albumDetailList.push(item.title);
              });
              this.vehicleDetailInfo.groupList.map(item => {
                this.groupDetailList.push(item.groupName);
              });
              console.log(this.groupDetailList)
            }
          })
          .catch(() => {})
      }
    },
    // 选择方式的change
    handleChangeVehicle (val) {
      this.activeSelect = -1;
      this.searchGroupName = null;
      this.searchForm.groupId = null;
      this.searchForm.albumId = null;
      this.searchForm.keyWord = null;
      if (val === 1) {
        this.getVeGroupInfo();
      } else {
        this.getVelBottomNameInfo();
      }
    },
    // 搜索组change
    changeGroupName (val) {
      if (!val) {
        this.closeShow = false;
        if (this.selectMethod === 1) {
          this.getVeGroupInfo();
        } else {
          this.getVelBottomNameInfo();
        }
      }
    },
    // 清空搜索组框
    onClear () {
      this.closeShow = false;
      this.searchGroupName = null;
      if (this.selectMethod === 1) {
        this.getVeGroupInfo();
      } else {
        this.getVelBottomNameInfo();
      }
    },
    // 搜索组
    searchData () {
      if (this.searchGroupName) {
        this.closeShow = true;
        if (this.selectMethod === 1) {
          this.getVeGroupInfo();
        } else {
          this.getVelBottomNameInfo();
        }
      }
    },
    // 表格多选
    handleSelectChange (val) {
      this.multipleSelection = val;
    },
    handleCurrentChange (page) {
      this.showGroup = false;
      this.pagination.pageNum = page;
      this.getVehicleInfoList();
    },
    // 取消新增分组 
    cancelAddGroup (form) {
      this.$refs[form].resetFields();
      this.addGroupDialog = false;
      this.isShowError = false;
    },
    // 显示新增分组弹出框
    showAddGroupDialog () {
      this.addGroupForm.userGroupName = null;
      this.isShowError = false;
      this.addGroupDialog = true;
    },
    // 新增分组
    addGroupInfo (form) {
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
        groupType: 1
      };
      this.isAddLoading = true;
      addGroup(params)
      .then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: '新增成功',
            customClass: 'request_tip'
          })
          this.getVeGroupInfo();
          this.addGroupDialog = false;
          this.isAddLoading = false;
        } else {
          this.isAddLoading = false;
        }
      })
      .catch(() => {this.isAddLoading = false;})
    },
    // 显示加入组--新增分组弹出框
    showAddGroupCopyDialog () {
      this.isShowError = false;
      this.addGroupForm.userGroupName = null;
      this.addGroupCopyDialog = true;
    },
    // 显示加入组---取消新增分组
    cancelAddGroupCopy (form) {
      this.isShowError = false;
      this.addGroupCopyDialog = false;
      this.addGroupForm.userGroupName = null;
      this.$refs[form].resetFields();
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
              message: '复制成功',
              customClass: 'request_tip'
            })
            this.getVeGroupInfo();
            this.showGroup = false;
          } 
        })
        .catch(() => {})
    },
    // 复制或新增复制到组 --判断组名是否重复
    addCopyGroupInfo (form) {
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
              message: '新增成功',
              customClass: 'request_tip'
            })
            this.showGroup = false;
            this.getVeGroupInfo();
            this.addGroupCopyDialog = false;
            this.isAddCopyLoading = false;
          } else {
            this.isAddCopyLoading = false;
          }
        })
        .catch(() => {this.isAddCopyLoading = false;})
    },
    // 显示查看车辆信息弹出框
    showLookDetailInfo (obj) {
      this.vehicleDetailInfoDialog = true;
      this.getVehicleDetailInfo(obj.uid);
    },
    // 跳至管理车辆组信息页面
    skipAdminVehiclePage (id, val, e) {
      e.stopPropagation();
      this.$router.push({name: 'admin_vehicle_info', query: {type: val, id: id}});
    },
    // 显示加入组tankuang
    showGroupDialog () {
      if (this.multipleSelection.length > 0) {
        this.showGroup = !this.showGroup;
      } else {
        this.showGroup = false;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.vehicle_info {
  background-color: #ffffff;
  height: 100%;
  display: flex;
  .vehicle_info_left {
    width: 260px;
    height: 100%;
    border-right: 1px solid #f2f2f2;
    .search_box {
      padding: 0 18px;
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
      margin-top: 10px;
      height: calc(100% - 105px);
      .one_group_ul {
        height: calc( 100% - 35px );
      }
      .group_ul {
        height: 100%;
        >li {
          padding-left: 40px;
          height: 36px;
          line-height: 36px;
          display: flex;
          align-items: center;
          color: #333333;
          cursor: pointer;
          // .group_box {}
          i {
            display: none;
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
        padding: 5px 15px;
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
  .vehicle_info_right_group {
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
          height: 170px;
          background-color: #ffffff;
          color: #333333;
          border-radius: 4px;
          box-shadow: 5px 5px 8px 5px #949494;
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