<template>
  <div class="archives_manage">
    <div class="archives_left">
      <div class="search_box">
        <el-input placeholder="请输入部门单位名称搜索" size="small" style="width: 220px;" v-model="keyWord">
          <i v-show="closeShow" slot="suffix" @click="onClear" class="search_icon el-icon-close" style="font-size: 16px;margin-right: 5px"></i>
          <i
            v-show="!closeShow"
            class="search_icon vl_icon vl_icon_manage_1"
            slot="suffix"
            @click="searchData">
          </i>
        </el-input>
      </div>
      <vue-scroll>
        <div class="content">
          <el-tree
            class="depart_tree_list"
            :data="departmentList.A"
            node-key="uid"
            highlight-current
            :current-node-key="activeSelect"
            :default-expanded-keys="defaultExpandKey"
            icon-class="el-icon-arrow-right"
            @node-click="handleNodeClick"
            :props="defaultProps"
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span :class="[data.isShow ? 'orang_name' : '']">{{ data.organName }}</span>
              <span class="operation">
                <i class="vl_icon vl_icon_manage_13 add_btn"  @click="onAddDepart(data)" title="添加"></i>
                <i class="vl_icon vl_icon_manage_7 edit_btn" @click="onEditDepart(data)" title="编辑"></i>
                <i class="vl_icon vl_icon_manage_8 del_btn" @click="onDeleteDepart(data)" title="删除"></i>
              </span>
            </span>
          </el-tree>
        </div>
      </vue-scroll>
    </div>
    <div class="archives_right">
      <div class="ar-tab-nav">
        <div><router-link :to="{ name: 'member_file'}" @click.native = "state = 1">一员一档</router-link></div>
        <div><router-link :to="{ name: 'car_gear'}" @click.native = "state = 2">一车一档</router-link></div>
        <div><router-link :to="{ name: 'room_stall'}" @click.native = "state = 3">一室一档</router-link></div>
        <div><router-link :to="{ name: 'machine_gear'}" @click.native = "state = 4">一机一档</router-link></div>
      </div>
      <div>
        <router-view></router-view>
      </div>
    </div>
    <!--删除部门弹出框-->
    <el-dialog
      title="是否确认删除部门？"
      :visible.sync="delDepartmentDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">删除后数据不可恢复。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delDepartmentDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="deleteDepartment">确认</el-button>
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
      <span style="color: #999999;">删除后数据不可恢复。</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delChildDepartmentDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteChildLoading" @click="delChildDepart">确认</el-button>
      </div>
    </el-dialog>
    <!--新增单位弹框-->
    <el-dialog
      title="新增单位"
      :visible.sync="newDepartmentDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div style="margin-top: 10px;">
        <el-form :model="addUnit" :rules="addRules" ref="addUnit" label-width="10px">
          <el-form-item label=" " prop="organName" class="organ_name">
            <el-input v-model="addUnit.organName" @change="handleChangeOrganName" style="width: 95%;" placeholder="请输入单位名称" maxlength="10"></el-input>
            <!-- <p class="organ_error_tip" v-show="isShowOrganError">单位已存在</p> -->
          </el-form-item>
          <el-form-item label=" " prop="organPid">
            <el-select style="width: 95%;" v-model="addUnit.organPid" placeholder="请选择上级单位">
              <el-option
                v-for="(item, index) in allDepartmentList"
                :key="'item' + index"
                :label="item.organName"
                :value="item.uid"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" " prop="chargeUserName">
            <el-select style="width: 47%;margin-right: 5px;" clearable v-model="addUnit.province" placeholder="省" @change="handleAreaData(addUnit.province, '市')">
              <el-option
                v-for="(item, index) in provinceList"
                :key="'item' + index"
                :label="item.cname"
                :value="item.uid"
              >
              </el-option>
            </el-select>
            <el-select style="width: 47%" clearable v-model="addUnit.city" placeholder="市" @change="handleAreaData(addUnit.city, '县')">
              <el-option
                v-for="(item, index) in cityList"
                :key="'item' + index"
                :label="item.cname"
                :value="item.uid"
              >
              </el-option>
            </el-select>
            <el-select style="width: 47%;margin-right: 5px;margin-top: 20px;" clearable v-model="addUnit.county" placeholder="县" @change="handleAreaData(addUnit.county, '街道')">
              <el-option
                v-for="(item, index) in countyList"
                :key="'item' + index"
                :label="item.cname"
                :value="item.uid"
              >
              </el-option>
            </el-select>
            <el-select style="width: 47%" clearable v-model="addUnit.street" placeholder="街道">
              <el-option
                v-for="(item, index) in streetList"
                :key="'item' + index"
                :label="item.cname"
                :value="item.uid"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('addUnit')">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="addUnitInfo('addUnit')">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDepartmentList, delDepart } from '@/views/index/api/api.manage.js';
import { apiAreaList } from '@/views/index/api/api.base.js';
export default {
  data () {
    return {
      keyWord: null, // 根据部门名称搜索部门
      closeShow: false, // 显示清除输入框图标
      state: 1,
      activeSelect: null, // 当前节点选中
      isAddLoading: false, // 添加单位加载中
      isShowOrganError: false,
      newDepartmentDialog: false, // 新增单位弹出框
      delDepartmentDialog: false, // 删除部门弹出框
      delChildDepartmentDialog: false, // 删除下级部门弹出框
      isDeleteLoading: false, // 删除部门加载中
      isDeleteChildLoading: false, // 删除子级部门加载中
      deleteId: null, // 要删除的部门id
      defaultProps: {
        children: 'children',
        label: 'organName'
      },
      defaultExpandKey: [], // 默认展开的key
      addUnit: {
        organName: null, // 单位名称
        organPid: null, // 上级单位
        province: null,
        city: null,
        county: null,
        street: null
      },
      addRules: {
        organName: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
          { max: 10, message: '最多输入10个字', trigger: 'blur' }
        ],
        organPid: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ]
      },
      allDepartmentList: [],  // 当前用户所属单位及下级单位
      departmentList: { A: [], B: [], C: [], D: [], E: [] }, // 部门树
      userInfo: {}, // 用户信息
      areaId: 1, // 行政区域id 1--省
      areaName: null, // 行政区域change
      provinceList: [], // 省数据
      cityList: [], // 市数据
      countyList: [], // 县数据
      streetList: [], // 街道数据
    }
  },
  mounted () {
    this.userInfo = this.$store.state.loginUser;

    this.getDepartList();
    this.getAreaList();
  },
  methods: {
    // 获取行政区划数据
    getAreaList () {
      const params = {
        parentUid: this.areaId
      }
      apiAreaList(params)
        .then(res => {
          if (res) {
            if (!this.areaName) {
              this.provinceList = res.data;
            }
            if (this.areaName === '市') {
              this.cityList = res.data;
            }
            if (this.areaName === '县') {
              this.countyList = res.data;
            }
            if (this.areaName === '街道') {
              this.streetList = res.data;
            }
          }
        })
    },
    // 省 change
    handleAreaData (id, val) {
      this.areaName = val;
      this.areaId = id;
      this.getAreaList();
    },
    // 获取当前部门及子级部门
    getDepartList () {
      this.departmentList.A = [];
      this.departmentList.B = [];
      this.departmentList.C = [];
      this.departmentList.D = [];
      this.departmentList.E = [];
      this.allDepartmentList = [];
      const params = {
        'where.organName': this.keyWord,
        'where.proKey': this.userInfo.proKey,
        'where.organPid': this.userInfo.organList[0].uid,
        pageSize: 0
      };
      getDepartmentList(params)
        .then(res => {
          if (res) {
            this.allDepartmentList.push(this.userInfo.organList[0]);
            res.data.list.map(item => {
              this.allDepartmentList.push(item);
            });
            this.allDepartmentList.map((item, index) => {
              if (item.organLayer === 1) {
                this.departmentList.A.push({
                  uid: item.uid,
                  organPid: item.organPid,
                  organRight: item.organRight,
                  organLeft: item.organLeft,
                  organLayer: item.organLayer,
                  organName: item.organName,
                  parentOrganName: item.parentOrganName,
                  isShow: false,
                  isChecked: false,
                  children: []
                })
              }
             if (item.organLayer === 2) {
                this.departmentList.B.push({
                  uid: item.uid,
                  organPid: item.organPid,
                  organRight: item.organRight,
                  organLeft: item.organLeft,
                  organLayer: item.organLayer,
                  organName: item.organName,
                  parentOrganName: item.parentOrganName,
                  isShow: false,
                  isChecked: false,
                  children: []
                })
              }
              if (item.organLayer === 3) {
                this.departmentList.C.push({
                  uid: item.uid,
                  organPid: item.organPid,
                  organRight: item.organRight,
                  organLeft: item.organLeft,
                  organLayer: item.organLayer,
                  organName: item.organName,
                  parentOrganName: item.parentOrganName,
                  isShow: false,
                  isChecked: false,
                  children: []
                })
              }
              if (item.organLayer === 4) {
                this.departmentList.D.push({
                  uid: item.uid,
                  organPid: item.organPid,
                  organRight: item.organRight,
                  organLeft: item.organLeft,
                  organLayer: item.organLayer,
                  organName: item.organName,
                  parentOrganName: item.parentOrganName,
                  isShow: false,
                  isChecked: false,
                  children: []
                })
              }
              if (item.organLayer === 5) {
                this.departmentList.E.push({
                  uid: item.uid,
                  organPid: item.organPid,
                  organRight: item.organRight,
                  organLeft: item.organLeft,
                  organLayer: item.organLayer,
                  organName: item.organName,
                  parentOrganName: item.parentOrganName,
                  isChecked: false,
                })
              }
            });
            // 2
            this.departmentList.A.forEach(a => {
              if (a.uid === this.userInfo.organList[0].uid) {
                a.isShow = true;
                this.activeSelect = a.uid;
                this.defaultExpandKey.push(a.uid);
                this.$store.commit('setCurrentOrgan', {
                  currentOrganId: a.uid
                });
              }
              this.departmentList.B.forEach(b => {
                if (a.uid === b.organPid) {
                  a.children.push(b);
                }
              })
            })
            // 3
            this.departmentList.A.forEach(a => {
              if (a.children && a.children.length > 0) {
                a.children.forEach(b => {
                  this.departmentList.C.forEach(c => {
                    if (b.uid === c.organPid) {
                      b.children.push(c);
                    }
                  })
                })
              }
            })
            // 4
            this.departmentList.A.forEach(a => {
              if (a.children && a.children.length > 0) {
                a.children.forEach(b => {
                  if (b.children && b.children.length > 0) {
                    b.children.forEach(c => {
                      this.departmentList.D.forEach(d => {
                        if (c.uid === d.organPid) {
                          c.children.push(d);
                        }
                      })
                    })
                  }
                })
              }
            })
            // 5
            this.departmentList.A.forEach(a => {
              if (a.children && a.children.length > 0) {
                a.children.forEach(b => {
                  if (b.children && b.children.length > 0) {
                    b.children.forEach(c => {
                      if (c.children && c.children.length > 0) {
                        c.children.forEach(d => {
                          this.departmentList.E.forEach(e => {
                            if (d.uid === e.organPid) {
                              d.children.push(e);
                            }
                          })
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
    },
    // 节点被选中
    handleNodeClick (obj) {
      this.activeSelect = obj.uid;
      this.$store.commit('setCurrentOrgan', {
        currentOrganId: obj.uid
      });
    },
    // 根据部门进行搜索
    searchData () {
      this.getDepartList();
      this.closeShow = true;
    },
    // 清空搜索框
    onClear () {
      this.closeShow = false;
      this.keyWord = null;
      this.getDepartList();
    },
    //删除部门
    deleteDepartment () {
      const params = {
        deleteId: this.deleteId,
        proKey: this.userInfo.proKey
      };
      this.isDeleteLoading = true;
      delDepart(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功',
              customClass: 'request_tip'
            });
            this.getDepartList();
            this.delDepartmentDialog = false;
            this.isDeleteLoading = false;
          } else {
            this.isDeleteLoading = false;
          }
        })
        .catch(() => {this.isDeleteLoading = false;})
    },
    // 删除部门及子级部门
    delChildDepart () {
      const params = {
        deleteId: this.deleteId,
        proKey: this.userInfo.proKey
      };
      this.isDeleteChildLoading = true;
      delDepart(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功',
              customClass: 'request_tip'
            });
            this.getDepartList();
            this.delChildDepartmentDialog = false;
            this.isDeleteChildLoading = false;
          } else {
            this.isDeleteChildLoading = false;
          }
        })
        .catch(() => {this.isDeleteChildLoading = false;})
    },
    // 单位名称change
    handleChangeOrganName (val) {
      if (!val) {
        this.isShowOrganError = false;
      } 
    },
    // 添加单位
    addUnitInfo (form) {
      this.$refs[form].validate(valid => {
        if (valid) {}
      });
    },
    // 取消添加
    cancelAdd (form) {
      this.$refs[form].resetFields();
      this.newDepartmentDialog = false;
    },
    // 显示添加部门弹出框
    onAddDepart (obj) {
      this.newDepartmentDialog = true;
    },
    // 显示编辑部门弹出框
    onEditDepart (obj) {},
    // 显示删除部门弹出框
    onDeleteDepart (obj) {
      this.deleteId = obj.uid;
      if ((obj.organRight - obj.organLeft) > 1) {
        this.delChildDepartmentDialog = true;
      } else {
        this.delDepartmentDialog = true;
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.archives_manage {
  padding: 20px;
  height: 100%;
  width: 100%;
  display: flex;
  .archives_left {
    width: 260px;
    height: 100%;
    background-color: #ffffff;
    border-right: 1px solid #F2F2F2;
    .search_box {
      padding: 15px 15px 10px;
      /deep/ .el-input--small .el-input__inner {
        border-radius: 40px;
        background-color: #F2F2F2;
        color: #999999;
      }
      .search_icon {
        margin-top: 8px;
        cursor: pointer; 
      }
    }
    .content {
      /deep/.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background: #E0F2FF;
      }
      .depart_tree_list {
        /deep/ .is-expanded {
          .el-tree-node__expand-icon.expanded, .orang_name {
            color: #0C70F8;
          }
        }
         /deep/ .custom-tree-node {
          margin-left: 8px;
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: space-between;
          >span {
            color: #333333;
            font-size: 14px;
          }
        }
        /deep/ .el-tree-node__content {
          height: 30px;
          line-height: 30px;
        }

        /deep/ .el-tree-node__content:hover {
          background: #E0F2FF;
          .operation {
            display: block;
          }
        }
        .operation {
          margin-right: 30px;
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
          .add_btn {
            &:hover {
              background-position: -831px -553px;
            }
          }
          i {
            vertical-align: middle;
          }
          display: none;
        }
      }
    }
  }
  .archives_right {
    width: calc(100% - 260px);
    height: 100%;
    background-color: #ffffff;
    overflow-y: scroll;
    .ar-tab-nav {
      background-color: #ffffff;
      padding-top: 8px;
      overflow: hidden;
      border-bottom: 1px solid #F2F2F2;
      > div {
          float: left;
          width: auto;
          font-size: 16px;
          margin: 0 20px;
        > a {
          display: block;
          height: 44px;
          line-height: 44px;
          text-align: center;
          cursor: pointer;
          color: #333333;
          text-decoration: none !important;
          &.router-link-exact-active {
            color: #0C70F8;
            cursor: default;
            border-bottom: 2px solid #0C70F8;
          }
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

