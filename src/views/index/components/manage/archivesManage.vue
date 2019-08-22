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
            ref="departTree"
            class="depart_tree_list"
            :data="allDepartmentList"
            node-key="uid"
            highlight-current
            current-node-key
            :default-expanded-keys="defaultExpandKey"
            icon-class="el-icon-arrow-right"
            @node-click="handleNodeClick"
            :props="defaultProps"
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span :class="[data.isShow ? 'orang_name' : '']">{{ data.organName }}</span>
              <span class="operation">
                <i class="vl_icon vl_icon_manage_13 add_btn"  @click="onAddDepart(data, $event)" title="添加"></i>
                <i class="vl_icon vl_icon_manage_7 edit_btn" @click="onEditDepart(data, $event)" title="编辑"></i>
                <i class="vl_icon vl_icon_manage_8 del_btn" @click="onDeleteDepart(data, $event)" title="删除"></i>
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
        <el-form :model="addUnit" :rules="rules" ref="addUnit" label-width="10px">
          <el-form-item label=" " prop="organName" class="organ_name">
            <el-input v-model="addUnit.organName" style="width: 95%;" placeholder="请输入单位名称" maxlength="10"></el-input>
            <!-- <p class="organ_error_tip" v-show="isShowOrganError">单位已存在</p> -->
          </el-form-item>
          <el-form-item label=" " prop="organPid">
            <el-select style="width: 95%;" v-model="addUnit.organPid" placeholder="请选择上级单位">
              <el-option
                v-for="(item, index) in departmentFormList"
                :key="'item' + index"
                :label="item.organName"
                :value="item.uid"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" " prop="province">
            <el-select style="width: 47%;margin-right: 5px;" v-model="addUnit.province" placeholder="省" @change="handleProvinceData(addUnit.province, 'add')">
              <el-option
                v-for="(item, index) in provinceList"
                :key="'item' + index"
                :label="item.cname"
                :value="item.uid"
              >
              </el-option>
            </el-select>
            <el-select style="width: 47%" v-model="addUnit.city" placeholder="市" @change="handleCityData(addUnit.city, 'add')">
              <el-option
                v-for="(item, index) in cityList"
                :key="'item' + index"
                :label="item.cname"
                :value="item.uid"
              >
              </el-option>
            </el-select>
            <el-select style="width: 47%;margin-right: 5px;margin-top: 20px;" v-model="addUnit.region" placeholder="县" @change="handleRegionData(addUnit.region, 'add')">
              <el-option
                v-for="(item, index) in countyList"
                :key="'item' + index"
                :label="item.cname"
                :value="item.uid"
              >
              </el-option>
            </el-select>
            <el-select style="width: 47%" v-model="addUnit.street" placeholder="镇">
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
    <!--编辑单位弹框-->
    <el-dialog
      title="编辑单位"
      :visible.sync="editDepartmentDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div style="margin-top: 10px;">
        <el-form :model="editUnit" :rules="rules" ref="editUnit" label-width="10px">
          <el-form-item label=" " prop="organName" class="organ_name">
            <el-input v-model="editUnit.organName" style="width: 95%;" placeholder="请输入单位名称" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label=" " prop="organPid">
            <el-select style="width: 95%;" v-model="editUnit.organPid" placeholder="请选择上级单位" disabled>
              <el-option
                v-for="(item, index) in editDepartmentFormList"
                :key="'item' + index"
                :label="item.organName"
                :value="item.uid"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" " prop="province">
            <el-select style="width: 47%;margin-right: 5px;" v-model="editUnit.province" placeholder="省" @change="handleProvinceData(editUnit.province, 'edit')">
              <el-option
                v-for="(item, index) in provinceList"
                :key="'item' + index"
                :label="item.cname"
                :value="item.uid"
              >
              </el-option>
            </el-select>
            <el-select style="width: 47%" v-model="editUnit.city" placeholder="市" @change="handleCityData(editUnit.city, 'edit')">
              <el-option
                v-for="(item, index) in cityList"
                :key="'item' + index"
                :label="item.cname"
                :value="item.uid"
              >
              </el-option>
            </el-select>
            <el-select style="width: 47%;margin-right: 5px;margin-top: 20px;" v-model="editUnit.region" placeholder="县" @change="handleRegionData(editUnit.region, 'edit')">
              <el-option
                v-for="(item, index) in countyList"
                :key="'item' + index"
                :label="item.cname"
                :value="item.uid"
              >
              </el-option>
            </el-select>
            <el-select style="width: 47%" v-model="editUnit.street" placeholder="镇">
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
        <el-button @click="cancelEdit('editUnit')">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isEditLoading" @click="editUnitInfo('editUnit')">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getDepartmentList, delDepart, addDepart, updateDepart, getUserList, getDepartDetail } from '@/views/index/api/api.manage.js';
import { apiAreaList } from '@/views/index/api/api.base.js';
export default {
  data () {
    return {
      isSearch: false, // 是否搜索部门
      keyWord: null, // 根据部门名称搜索部门
      closeShow: false, // 显示清除输入框图标
      state: 1,
      activeSelect: null, // 当前节点选中
      isAddLoading: false, // 添加单位加载中
      isEditLoading: false, // 编辑单位加载中
      isShowOrganError: false,
      newDepartmentDialog: false, // 新增单位弹出框
      editDepartmentDialog: false, // 编辑单位弹出框
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
        proKey: null,
        chargeUserName: null, // 组织机构负责人
        organName: null, // 单位名称
        organPid: null, // 上级单位
        province: null, // 省
        city: null, // 市
        region: null, // 县
        street: null // 镇
      },
      editUnit: {
        uid: null,
        proKey: null,
        chargeUserName: null, // 组织机构负责人
        organName: null, // 单位名称
        organPid: null, // 上级单位
        province: null, // 省
        city: null, // 市
        region: null, // 县
        street: null // 镇
      },
      rules: {
        organName: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
          // { max: 10, message: '最多输入10个字', trigger: 'blur' }
        ],
        organPid: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' }
        ]
      },
      editDepartmentFormList: [],
      departmentFormList: [], // 新增和修改的单位
      allDepartmentList: [],  // 当前用户所属单位及下级单位
      departmentList: [], // 下级单位
      // departmentList: { A: [], B: [], C: [], D: [], E: [] }, // 部门树
      userInfo: {}, // 用户信息
      areaId: 1, // 行政区域id 1--省
      areaName: null, // 行政区域change
      provinceList: [], // 省数据
      cityList: [], // 市数据
      countyList: [], // 县数据
      streetList: [], // 街道数据
      // userList: [], // 用户数据
      finalData: []
    }
  },
  mounted () {
    this.userInfo = this.$store.state.loginUser;
    console.log('userInfo', this.userInfo)
    this.addUnit.proKey = this.userInfo.proKey;
    this.editUnit.proKey = this.userInfo.proKey;

    this.getDepartList();
    this.getAreaList();
    this.getUsersData();
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
            if (this.areaName === '镇') {
              this.streetList = res.data;
            }
          }
        })
    },
    // 省 change
    handleProvinceData (id, val) {
      this.areaName = '市';
      this.areaId = id;
      // this.cityList = [];
      if (val === 'add') {
        this.addUnit.city = '';
        this.addUnit.region = '';
        this.addUnit.street = '';
      } else {
        this.editUnit.city = '';
        this.editUnit.region = '';
        this.editUnit.street = '';
      }

      this.getAreaList();
    },
    // 市 change
    handleCityData (id, val) {
      this.areaName = '县';
      this.areaId = id;
      
      if (val === 'add') {
        this.addUnit.region = '';
        this.addUnit.street = '';
      } else {
        this.editUnit.region = '';
        this.editUnit.street = '';
      }

      this.getAreaList();
    },
    // 县 change
    handleRegionData (id, val) {
      this.areaName = '镇';
      this.areaId = id;
      
      if (val === 'add') {
        this.addUnit.street = '';
      } else {
        this.editUnit.street = '';
      }

      this.getAreaList();
    },
    // 获取用户数据
    getUsersData () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0,
      };
      getUserList(params)
        .then(res => {
          if (res && res.data.list) {
            // 默认一个机构负责人
            this.addUnit.chargeUserName = res.data.list[0].uid;
            this.editUnit.chargeUserName = res.data.list[0].uid;
          }
        })
        .catch(() => {})
    },
    handleDepartData (parentArr, childArr) {
      childArr.forEach(a => {
        parentArr.forEach(b => {
          if (a.organPid == b.uid) {
            if (!b.children.find(c => {return a.uid == c.uid})) 
              b.children.push(a);
              if (b.children && b.children.length > 0) {
                this.handleDepartData(b.children, childArr);
              }
          }
        });
      });
      this.allDepartmentList = parentArr;
    },
    // 获取当前部门及子级部门
    getDepartList () {
      console.log('this.userInfo.organList[0].uid', this.userInfo.organList[0].uid)
       this.allDepartmentList = [];
       this.departmentList = [];
       let organPid = null;
       if (this.isSearch) {
         organPid = null;
       } else {
         organPid = this.userInfo.organList[0].uid;
       }
      
      const params = {
        'where.organName': this.keyWord,
        'where.proKey': this.userInfo.proKey,
        'where.organPid': organPid,
        pageSize: 0
      };
      getDepartmentList(params)
        .then(res => {
          if (res) {
            const params = {
              uid: this.userInfo.organList[0].uid,
              organName: this.userInfo.organList[0].organName,
              chargeUserName: this.userInfo.organList[0].chargeUserName,
              isShow: true,
              children: []
            };
            this.allDepartmentList.push(params);

            res.data.list.map(item => {
              item.children = [];
              this.departmentList.push(item);
            });

            if (this.isSearch) {
              let departmentList = [];
              departmentList.push(this.departmentList[0]);

              this.defaultExpandKey.push(this.departmentList[0].uid);
              
              this.handleDepartData(departmentList, this.departmentList);
            } else {
              this.defaultExpandKey.push(this.allDepartmentList[0].uid);
              this.handleDepartData(this.allDepartmentList, this.departmentList);
            }
          }
        })
    },
    // 节点被选中
    handleNodeClick (obj) {
      this.activeSelect = obj.uid;
      this.$store.commit('setCurrentOrgan', {
        currentOrganObj: obj
      });
    },
    // 根据部门进行搜索
    searchData () {
      // if (this.keyWord) {
      //   }
      this.closeShow = true;
      this.isSearch = true;
      this.getDepartList();
    },
    // 清空搜索框
    onClear () {
      this.isSearch = false;
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
    // 添加单位
    addUnitInfo (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.provinceList.map(item => {
            if (item.uid === this.addUnit.province) {
              this.addUnit.province = item.cname;
            }
          })
          this.cityList.map(item => {
            if (item.uid === this.addUnit.city) {
              this.addUnit.city = item.cname;
            }
          })
          this.countyList.map(item => {
            if (item.uid === this.addUnit.region) {
              this.addUnit.region = item.cname;
            }
          })
          this.streetList.map(item => {
            if (item.uid === this.addUnit.street) {
              this.addUnit.street = item.cname;
            }
          })
          this.isAddLoading = true;
          addDepart(this.addUnit)
            .then(res => {
              if (res) {
                 this.$message({
                  type: 'success',
                  message: '添加成功',
                  customClass: 'request_tip'
                });
                this.newDepartmentDialog = false;
                this.getDepartList();
                this.isAddLoading = false;
              } else {
                this.isAddLoading = false;
              }
            })
            .catch(() => {this.isAddLoading = false;})
        }
      });
    },
    // 取消添加
    cancelAdd (form) {
      this.$refs[form].resetFields();
      this.newDepartmentDialog = false;
    },
    // 取消添加
    cancelEdit (form) {
      this.$refs[form].resetFields();
      this.editDepartmentDialog = false;
    },
    // 显示添加部门弹出框
    onAddDepart (obj, e) {
      console.log(obj)
      e.stopPropagation();
      this.departmentFormList = [];
      this.addUnit = {
        proKey: this.userInfo.proKey,
        // chargeUserName: null, // 组织机构负责人
        organName: null, // 单位名称
        // organPid: null, // 上级单位
        province: null, // 省
        city: null, // 市
        region: null, // 县
        street: null // 镇
      };
      this.newDepartmentDialog = true;

      this.addUnit.organPid = obj.uid;
      this.addUnit.chargeUserName = obj.chargeUserName;

      const params = {
        'where.proKey': this.userInfo.proKey,
        'where.organPid': obj.uid,
        pageSize: 0
      };
      getDepartmentList(params)
        .then(res => {
          if (res) {
            this.departmentFormList.push(obj);
            res.data.list.map(item => {
              this.departmentFormList.push(item);
            });
          }
        })
    },
    // 显示编辑部门弹出框
    onEditDepart (obj, e) {
      e.stopPropagation();
      this.editDepartmentFormList = [];
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0
      };
      getDepartmentList(params)
        .then(res => {
          if (res) {
            res.data.list.map(item => {
              this.editDepartmentFormList.push(item);
            });
          }
        })

      this.getDetail(obj.uid);

      this.editDepartmentDialog = true;
    },
    // 确认编辑部门
    editUnitInfo (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.provinceList.map(item => {
            if (item.uid === this.editUnit.province) {
              this.editUnit.province = item.cname;
            }
          })
          this.cityList.map(item => {
            if (item.uid === this.editUnit.city) {
              this.editUnit.city = item.cname;
            }
          })
          this.countyList.map(item => {
            if (item.uid === this.editUnit.region) {
              this.editUnit.region = item.cname;
            }
          })
          this.streetList.map(item => {
            if (item.uid === this.editUnit.street) {
              this.editUnit.street = item.cname;
            }
          })
          this.isEditLoading = true;
          updateDepart(this.editUnit)
            .then(res => {
              if (res && res.data) {
                 this.$message({
                  type: 'success',
                  message: '修改成功',
                  customClass: 'request_tip'
                });
                this.editDepartmentDialog = false;
                this.getDepartList();
                this.isEditLoading = false;
              } else {
                this.isEditLoading = false;
              }
            })
            .catch(() => {this.isEditLoading = false;})
        }
      })
    },
    // 显示删除部门弹出框
    onDeleteDepart (obj, e) {
       e.stopPropagation();

      this.deleteId = obj.uid;
      if ((obj.organRight - obj.organLeft) > 1) {
        this.delChildDepartmentDialog = true;
      } else {
        this.delDepartmentDialog = true;
      }
    },
    // 获取机构详情
    getDetail (id) {
      this.editUnit.uid = id;
      const params = {
        uid: id,
        proKey: this.userInfo.proKey
      };
      getDepartDetail(params)
        .then(res => {
          if (res && res.data) {
            this.editUnit.organName = res.data.organName;
            this.editUnit.province = res.data.province;
            this.editUnit.city = res.data.city;
            this.editUnit.region = res.data.region;
            this.editUnit.street = res.data.street;
            this.editUnit.organPid = res.data.organPid;
          }
        })
    }
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

