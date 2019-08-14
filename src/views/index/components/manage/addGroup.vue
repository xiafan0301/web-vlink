<template>
<vue-scroll>
  <div class="add_group">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manage/videoSetting/customGroup' }">视频设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/videoSetting/customGroup' }">自定义组</el-breadcrumb-item>
        <el-breadcrumb-item>{{this.$route.query.groupId ? '编辑分组' : '新增分组'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_box">
      <div class="content_new_group">
        <span>分组名称:</span>
        <el-input style="width: 300px;" @input="changeGroupName" maxlength="10" v-model="groupName" placeholder="请输入分组名称"></el-input>
        <p v-show="isShowError" style="color: #F94539;margin-left: 10px;">{{errorText}}</p>
      </div>
      <div class="content_main_box">
        <p>选择方式:</p>
        <div class="main_tab_box">
          <ul class="tab_list">
            <li :class="{'active_li': tabState === 1}" @click="tabState = 1">地图选择</li>
            <li :class="{'active_li': tabState === 2}" @click="tabState = 2">列表选择</li>
          </ul>
          <div class="search_box">
            <el-form :inline="true" :model="searchForm" class="search_form" ref="searchForm">
              <el-form-item prop="intelCharac">
                <el-select  style="width: 240px;" v-model="searchForm.intelCharac" placeholder="智能特性">
                  <el-option value="全部特性"></el-option>
                  <el-option
                    v-for="(item, index) in intelCharacList"
                    :key="index"
                    :label="item.enumValue"
                    :value="item.enumField"
                    ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="dutyOrganId">
                <el-select style="width: 240px;" v-model="searchForm.dutyOrganId" placeholder="责任部门">
                  <el-option value="全部部门"></el-option>
                  <el-option
                    v-for="(item, index) in allDepartmentData"
                    :key="index"
                    :label="item.organName"
                    :value="item.uid"
                    ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button class="select_btn" @click="searchData">查询</el-button>
                <el-button class="reset_btn" @click="resetForm('searchForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <template v-if="tabState === 1">
            <mapSelect
              :isSelected="isSelected"
              :groupId="groupId"
              :isInitalState="isInitalState"
              :selectDeviceList="selectDeviceList"
              :currentDeviceList="currentDeviceList"
              :selectDeviceNumber="selectDeviceNumber"
              :leftDeviceNumber="leftDeviceNumber"
              @emitOpenLeftArrow="emitOpenLeftArrow"
              @emitLeftParentChecked="emitLeftParentChecked"
              @emitLeftChildChecked="emitLeftChildChecked"
              @emitFinalDevice="emitFinalDevice"
              @emitRemoveFinalDevice="emitRemoveFinalDevice"
              @emitChangeLDeviceType="emitChangeLDeviceType"
            ></mapSelect>
          </template>
          <template v-if="tabState === 2">
            <listSelect
              :leftDeviceNumber="leftDeviceNumber"
              :rightAllChecked="rightAllChecked"
              :selectDeviceList="selectDeviceList" 
              :selectDeviceNumber="selectDeviceNumber"
              :currentDeviceList="currentDeviceList"
              @emitOpenRightArrow="emitOpenRightArrow"
              @emitParentChecked="emitParentChecked"
              @emitChildChecked="emitChildChecked"
              @emitOpenLeftArrow="emitOpenLeftArrow"
              @emitLeftParentChecked="emitLeftParentChecked"
              @emitLeftChildChecked="emitLeftChildChecked"
              @emitAllChecked="emitAllChecked"
              @emitFinalDevice="emitFinalDevice"
              @emitRemoveFinalDevice="emitRemoveFinalDevice"
              @emitChangeRDeviceType="emitChangeRDeviceType"
              @emitChangeLDeviceType="emitChangeLDeviceType"
              @emitSearchData="emitSearchData"
            >
            </listSelect>
          </template>
        </div>
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn function_btn" :loading="isLoading" @click="submitData">保存</el-button>
      <el-button class="operation_btn back_btn" @click="cancelAdd">取消</el-button>
    </div>
    <!--返回提示弹出框-->
    <el-dialog
      title="提示"
      :visible.sync="backDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">返回后内容不会保存，您确定要返回吗?</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="backDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="sureBack">确认</el-button>
      </div>
    </el-dialog>
  </div>
</vue-scroll>
</template>
<script>
import { random14 } from '@/utils/util.js';
import listSelect from './components/listSelect.vue';
import mapSelect from './components/mapSelect.vue';
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
import { getAllDevices, addGroupDevice, getCurrentDevices, updateGroupDevice, getDepartmentList } from '@/views/index/api/api.manage.js';
export default {
  components: {listSelect, mapSelect},
  data () {
    return {
      backDialog: false, // 返回提示弹出框
      isSelected: 0, // 查询--重置
      tabState: 1, // 地图选择
      isShowError: false,
      errorText: null,
      searchForm: {
        intelCharac: '全部特性', // 智能特性
        dutyOrganId: '全部部门', // 责任部门id
        devName: null // 设备名称
      },
      groupName: '', // 新增分组名
      allDeviceList: [], // 所有设备列表数据
      selectDeviceList: [], // 可选设备列表
      selectDeviceNumber: 0, // 可选设备数量
      alcurrentDeviceList: [],
      currentDeviceList: [], // 已有的设备数据
      rightAllChecked: false, // 右侧设备全部选中
      groupId: null, // 当前分组id
      leftDeviceNumber: 0, // 左侧设备数量
      isLoading: false,
      userInfo: {}, // 用户信息
      allDepartmentData: [], // 部门列表
      intelCharacList: [], // 智能特性列表
      isInitalState: false // 判断是否点击过列表选择
    }
  },
  watch: {
    tabState (val) {
      if (val && val === 2) {
        this.isInitalState = true;
      }
    }
  },
  mounted () {
    this.userInfo = this.$store.state.loginUser;
    
    if (this.$route.query.groupId) {
      this.groupId = this.$route.query.groupId;
      this.groupName = this.$route.query.name;
      this.getCurrentDeviceList();
    }
    setTimeout(() => {
      this.getAllDevicesList();
    }, 1000)

    this.dataStr =  JSON.stringify(this.groupName); // 将初始数据转成字符串

    this.getIntelCharacList();
    this.getAllDepartList();
  },
  methods: {
    // 获取智能特性列表
    getIntelCharacList () {
      const intelCharacId = dataList.intelCharac;
      getDiciData(intelCharacId)
        .then(res => {
          if (res) {
            this.intelCharacList = res.data;
          }
        })
    },
    // 获取部门列表
    getAllDepartList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0,
      };
      getDepartmentList(params)
        .then(res => {
          if (res && res.data.list) {
            this.allDepartmentData = res.data.list;
          }
        })
    },
    // 根据设备名称搜索
    emitSearchData (val) {
      this.searchForm.devName = val;
      this.getAllDevicesList();
    },
    // 左侧切换摄像头和卡口
    emitChangeLDeviceType (index, val) {
      this.currentDeviceList[index].isSXT = val;
    },
    // 右侧切换摄像头和卡口
    emitChangeRDeviceType (index, val) {
      this.selectDeviceList[index].isSXT = val;
    },
    // 打开右侧箭头
    emitOpenRightArrow (index) {
      this.selectDeviceList[index].isOpenArrow = !this.selectDeviceList[index].isOpenArrow;
      this.selectDeviceList = JSON.parse(JSON.stringify(this.selectDeviceList));
    },
    // 打开左侧箭头
    emitOpenLeftArrow (index) {
      this.currentDeviceList[index].isOpenArrow = !this.currentDeviceList[index].isOpenArrow;
      this.currentDeviceList = JSON.parse(JSON.stringify(this.currentDeviceList));
    },
    // 右侧---全部选中
    emitAllChecked (val) {
      this.rightAllChecked = val;
      this.selectDeviceList.map(item => {
        item.isChecked = val;
        item.deviceList.map(itm => {
          itm.isChildChecked = val;
        });
        item.bayonetList.map(itm => {
          itm.isChildChecked = val;
        });
      });
      this.selectDeviceList = JSON.parse(JSON.stringify(this.selectDeviceList));
    },
    // 右侧--父级多选框选中
    emitParentChecked (index, val) {
      this.selectDeviceList[index].isChecked = val;
      this.selectDeviceList[index].deviceList.map(item => {
        item.isChildChecked = val;
      });
      this.selectDeviceList[index].bayonetList.map(item => {
        item.isChildChecked = val;
      });
      if (!val) {
        this.rightAllChecked = false;
      }
      this.selectDeviceList = JSON.parse(JSON.stringify(this.selectDeviceList)); // 必须放在过滤父级的上面，因为先要更新在过滤
      // 过滤出父级中没有选中
      let checkedParentArr = this.selectDeviceList.filter(itm => {
        return itm.isChecked === false;
      });
      // 如果父级全部选中， 则全选选中
      if (checkedParentArr.length === 0) {
        this.rightAllChecked = true;
      } else {
        this.rightAllChecked = false;
      }
    },
    // 左侧--父级多选框选中
    emitLeftParentChecked (index, val) {
      this.currentDeviceList[index].isChecked = val;
      this.currentDeviceList[index].deviceList.map(item => {
        item.isChildChecked = val;
      });
       this.currentDeviceList[index].bayonetList.map(item => {
        item.isChildChecked = val;
      });
      this.currentDeviceList = JSON.parse(JSON.stringify(this.currentDeviceList)); // 必须放在过滤父级的上面，因为先要更新在过滤
    },
    // 左侧--子级多选框选中
    emitLeftChildChecked (index, idx, val, isSxt) {
      if (isSxt) {
        this.currentDeviceList[index].deviceList[idx].isChildChecked = val;
      } else {
        this.currentDeviceList[index].bayonetList[idx].isChildChecked = val;
      }
      // 过滤出子级选中的(摄像头和卡口)
      let checkedSxtArr = [], checkedKKArr = [];
      if (this.currentDeviceList[index].deviceList.length > 0) {
        checkedSxtArr = this.currentDeviceList[index].deviceList.filter((item) => { // 摄像头
          return item.isChildChecked === true;
        });
      }
      if (this.currentDeviceList[index].bayonetList.length > 0) {
        checkedKKArr = this.currentDeviceList[index].bayonetList.filter((item) => { // 卡口
          return item.isChildChecked === true;
        });
      }

      if (checkedSxtArr.length === 0 && checkedKKArr.length === 0) { // 没有选中的
        this.currentDeviceList[index].isChecked = false;
      }

      if (checkedSxtArr.length === this.currentDeviceList[index].deviceList.length && checkedKKArr.length === this.currentDeviceList[index].bayonetList.length) { // 全选
        this.currentDeviceList[index].isChecked = true;
      }

      if (this.currentDeviceList[index].deviceList.length !== 0) {
        if (checkedSxtArr.length === 0 || checkedSxtArr.length < this.currentDeviceList[index].deviceList.length) {
          this.currentDeviceList[index].isChecked = false;
        }
      }
      if (this.currentDeviceList[index].bayonetList.length !== 0) {
        if (checkedKKArr.length === 0 || checkedKKArr.length < this.currentDeviceList[index].bayonetList.length) {
          this.currentDeviceList[index].isChecked = false;
        }
      }
      this.currentDeviceList = JSON.parse(JSON.stringify(this.currentDeviceList));
    },
    // 右侧--子级多选框选中
    emitChildChecked (index, idx, val, isSxt) {
      if (isSxt) {
        this.selectDeviceList[index].deviceList[idx].isChildChecked = val;
      } else {
        this.selectDeviceList[index].bayonetList[idx].isChildChecked = val;
      }
      // 过滤出子级选中的(摄像头和卡口)
      let checkedSxtArr = [], checkedKKArr = [];
      if (this.selectDeviceList[index].deviceList.length > 0) {
        checkedSxtArr = this.selectDeviceList[index].deviceList.filter((item) => { // 摄像头
          return item.isChildChecked === true;
        });
      }

      if (this.selectDeviceList[index].bayonetList.length > 0) {
        checkedKKArr = this.selectDeviceList[index].bayonetList.filter((item) => { // 卡口
          return item.isChildChecked === true;
        });
      }

      if (checkedSxtArr.length === 0 && checkedKKArr.length === 0) { // 没有选中的
        this.selectDeviceList[index].isChecked = false;
      }
      
      if (checkedSxtArr.length === this.selectDeviceList[index].deviceList.length && checkedKKArr.length === this.selectDeviceList[index].bayonetList.length) { // 全选
        this.selectDeviceList[index].isChecked = true;
      }

      if (this.selectDeviceList[index].deviceList.length !== 0) {
        if (checkedSxtArr.length === 0 || checkedSxtArr.length < this.selectDeviceList[index].deviceList.length) {
          this.selectDeviceList[index].isChecked = false;
        }
      }
      if (this.selectDeviceList[index].bayonetList.length !== 0) {
        if (checkedKKArr.length === 0 || checkedKKArr.length < this.selectDeviceList[index].bayonetList.length) {
          this.selectDeviceList[index].isChecked = false;
        }
      }

      this.selectDeviceList = JSON.parse(JSON.stringify(this.selectDeviceList));
      // 过滤出父级中没有选中
      let checkedParentArr = this.selectDeviceList.filter(itm => {
        return itm.isChecked === false;
      });
      // 如果父级全部选中， 则全选选中
      if (checkedParentArr.length === 0) {
        this.rightAllChecked = true;
      } else {
        this.rightAllChecked = false;
      }
    },
    // 获取当前分组下的设备列表
    getCurrentDeviceList () {
      if (this.groupId) {
        const params = {
          groupId: this.groupId
        }
        getCurrentDevices(params)
          .then(res => {
            if (res) {
              this.alcurrentDeviceList = JSON.parse(JSON.stringify(res.data)); // 保存一份原始的当前设备下的设备列表
              this.currentDeviceList = JSON.parse(JSON.stringify(res.data));
              this.currentDeviceList.map(item => {
                item.isOrigin = true;
                item.isOpenArrow = false; // 设置是否展开
                item.isChecked = false; // 父级是否选中
                item.isSXT = true; // 默认选中摄像头
                this.leftDeviceNumber += item.deviceList.length;
                this.leftDeviceNumber += item.bayonetList.length;
                item.deviceList.map(itm => {
                  item.isOrigin = true;
                  itm.isChildChecked = false; // 子级是否选中
                });
                item.bayonetList.map(itm => {
                  item.isOrigin = true;
                  itm.isChildChecked = false; // 子级是否选中
                });
              });
            }
          })
          .catch(() => {})
      }
    },
     // 获取所有可选的设备
    getAllDevicesList () {
      let dutyOrganId, intelCharac;
      if (this.searchForm.dutyOrganId === '全部部门') {
        dutyOrganId = null;
      } else {
        dutyOrganId = this.searchForm.dutyOrganId;
      }
      if (this.searchForm.intelCharac === '全部特性') {
        intelCharac = null;
      } else {
        intelCharac = this.searchForm.intelCharac;
      }

      this.selectDeviceNumber = 0;
      // this.selectDeviceList = [];

      const params = {
        dutyOrganId,
        intelCharac,
        devName: this.searchForm.devName
      }
      getAllDevices(params)
        .then(res => {
          if (res) {
            this.allDeviceList = res.data;
            this.selectDeviceList = res.data;
            //在可选设备中删除已有的设备
            // if (this.$route.query.groupId) {
              if (this.currentDeviceList.length > 0) {
                this.currentDeviceList.map(item => {
                  this.selectDeviceList.map((val) => {
                    if (item.uid === val.uid) {
                      item.deviceList.map(a => {
                        val.deviceList.map((b, i) => {
                          if (a.uid === b.uid) {
                            val.deviceList.splice(i, 1);
                          }
                        });
                      });
                      item.bayonetList.map(a => {
                        val.bayonetList.map((b, i) => {
                          if (a.uid === b.uid) {
                            val.bayonetList.splice(i, 1);
                          }
                        });
                      });
                    }
                  });

                  // 如果可选设备中卡口和摄像头都为空，则删除该设备
                  this.selectDeviceList.map((value, index) => {
                    if (value.deviceList.length === 0 && value.bayonetList.length === 0) {
                      this.selectDeviceList.splice(index, 1);
                    }
                  })
                });
              }
            // } else { // 新增---点击重置的时候将已有设备清零
            //   this.currentDeviceList = [];
            //   this.leftDeviceNumber = 0;
            // }
            this.selectDeviceList.map(item => {
              item.isOpenArrow = false; // 设置是否展开
              item.isChecked = false; // 父级是否选中
              item.isSXT = true; // 默认显示摄像头
              item.deviceList.map(itm => {
                itm.isChildChecked = false; // 子级是否选中
              });
              item.bayonetList.map(itm => {
                itm.isChildChecked = false; // 子级是否选中
              });
              // console.log('deviceList', item.deviceList)
              this.selectDeviceNumber += item.deviceList.length;
              this.selectDeviceNumber += item.bayonetList.length;
            });

            // console.log('selectDeviceNumber', this.selectDeviceNumber)
          }
        })
        .catch(() => {})
    },
    // 搜索框
    searchData () {
       if (this.searchForm.intelCharac || this.searchForm.dutyOrganId) {
         this.getAllDevicesList();
         setTimeout(() => { // 争对地图选择，每点一次查询或者重置，就更新一下isSelected，用来更新可用设备  sxtList --kkList
           this.isSelected = 1 + random14();
         }, 500)
       }
    },
    // 重置搜索框
    resetForm(form) {
      if (this.searchForm.intelCharac || this.searchForm.dutyOrganId) {
        this.$refs[form].resetFields();
        this.getAllDevicesList();
        setTimeout(() => { // 争对地图选择，每点一次查询或者重置，就更新一下isSelected，用来更新可用设备  sxtList --kkList
          this.isSelected = 1 + random14();
        }, 500)
      }
    },
    // 从添加设备接收要提交的设备
    emitFinalDevice (list, number, selectList, selectNum) {
      if (list) {
        let arr = [];
        if (list.length > 0) {
          if ((this.groupId || this.isInitalState) && this.tabState === 1) { // 如果是编辑分组
            this.currentDeviceList = [];
            this.leftDeviceNumber = 0;
          }
          // this.leftDeviceNumber = 0;
          list.map(item => {
            arr = this.currentDeviceList.filter(itm => {
              if (itm.uid === item.uid) {
                item.deviceList.map(val => {
                  itm.deviceList.push(val);
                });
                item.bayonetList.map(val => {
                  itm.bayonetList.push(val);
                });
                return item;
              }
            });
            if (arr.length === 0) {
              this.currentDeviceList.push(item);
            }
          });
          this.leftDeviceNumber += number;
        } else {
          this.currentDeviceList = [];
        }
      }
      if (selectList && selectList.length > 0) {
        this.selectDeviceList = [];
        selectList.map(item => {
          this.selectDeviceList.push(item);
        });
        // if (!this.groupId) { // 如果是新增分组
          this.selectDeviceNumber = selectNum && selectNum;
        // }
      } else {
        this.selectDeviceList = [];
        this.selectDeviceNumber = 0;
      }
    },
    // 从移除设备接受要提交的设备
    emitRemoveFinalDevice (list, number, selectList, selectNum) {
      this.currentDeviceList = [];
      if (list) {
        list.map(item => {
          this.currentDeviceList.push(item);
        });
        this.leftDeviceNumber = number;
      }
      if (selectList) {
        let arr = [];
        selectList.map(item => {
          arr = this.selectDeviceList.filter(itm => {
            if (itm.uid === item.uid) {
              item.deviceList.map(val => {
                itm.deviceList.push(val);
              });
              item.bayonetList.map(val => {
                itm.bayonetList.push(val);
              });
              return item;
            }
          });
          if (arr.length === 0) {
            this.selectDeviceList.push(item);
          }
        });
        this.selectDeviceNumber += selectNum;
      }
    },
    // change分组名称
    changeGroupName (val) {
      if (!val) {
        this.errorText = '该项内容不可为空';
        this.isShowError = true;
      } else if (val.length > 10){
        this.errorText = '最多输入10个字';
        this.isShowError = true;
      } else {
        this.errorText = '';
        this.isShowError = false;
      }
    },
    // 提交数据
    submitData () {
      if (this.$route.query.groupId) {
        this.editGroup(); // 编辑分组
      } else {
        this.addGroup(); // 新增分组
      }
    },
    // 新增分组 
    addGroup () {
      if (!this.groupName) {
        this.errorText = '该项内容不可为空';
        this.isShowError = true;
        return;
      }
      if (this.currentDeviceList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请先选择需要关联的设备',
          customClass: 'request_tip'
        });
        return;
      }
      let vehicleIds = [], bayonetIds = [];
      this.currentDeviceList.map(item => {
        if (item.deviceList.length > 0) {
          item.deviceList.map(itm => {
            vehicleIds.push(itm.uid);
          });
        }
        if (item.bayonetList.length > 0) {
          item.bayonetList.map(itm => {
            bayonetIds.push(itm.uid);
          });
        }
      });
      const params = {
        groupName: this.groupName,
        vehicleIds,
        bayonetIds
      };
      this.isLoading = true;
      addGroupDevice(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '保存成功',
              customClass: 'request_tip'
            });
            this.isLoading = false;
            this.$router.push({name: 'custom_group'});
          } else {
            this.isLoading = false;
          }
        })
        .catch(() => { this.isLoading = false; })
    },
    // 编辑分组
    editGroup () {
      if (!this.groupName) {
        this.errorText = '该项内容不可为空';
        this.isShowError = true;
        return;
      }
      let addIdList = [], delIdList = [];
      let allDeviceIds = []; // 当前分组下原始的所有的设备id（摄像头和卡口）
      let currDeviceIds = []; // 当前分组下所有的设备id（摄像头和卡口）
      if (this.currentDeviceList.length > 0) {
        this.currentDeviceList.map(item => {
          item.deviceList.map(a => {
            currDeviceIds.push(a.uid);
          });
          item.bayonetList.map(a => {
            currDeviceIds.push(a.uid);
          });
        });
        this.alcurrentDeviceList.map(item => {
          item.deviceList.map(a => {
            allDeviceIds.push(a.uid);
          });
          item.bayonetList.map(a => {
            allDeviceIds.push(a.uid);
          });
        });

        let newCurrDeviceIds = JSON.parse(JSON.stringify(currDeviceIds));
        let newAllDeviceIds = JSON.parse(JSON.stringify(allDeviceIds));
        // 筛选出新添加的设备
        for (let len = currDeviceIds.length, i = len -1; i >= 0; i--) {
          for (let length = allDeviceIds.length, j = length -1; j >= 0; j--) {
            if (currDeviceIds[i] === allDeviceIds[j]) {
              newCurrDeviceIds.splice(i, 1);
            }
          }
        }
        // 筛选出删除的设备
        for (let len = allDeviceIds.length, i = len -1; i >= 0; i--) {
          for (let length = currDeviceIds.length, j = length -1; j >= 0; j--) {
            if (allDeviceIds[i] === currDeviceIds[j]) {
              newAllDeviceIds.splice(i, 1);
            }
          }
        }
        addIdList = newCurrDeviceIds;
        delIdList = newAllDeviceIds;
      } else {
        this.alcurrentDeviceList.map(item => {
          item.deviceList.map(a => {
            delIdList.push(a.uid);
          });
          item.bayonetList.map(a => {
            delIdList.push(a.uid);
          });
        });
      }
      const params = {
        groupId: this.groupId,
        groupName: this.groupName,
        addIdList: addIdList.join(',') || null,
        delIdList: delIdList.join(',') || null
      };
      this.isLoading = false;
      updateGroupDevice(params)
        .then(res => {
          if (res) {
            console.log('res', res)
            if (res) {
               this.$message({
                type: 'success',
                message: '修改成功',
                customClass: 'request_tip'
              });
              this.isLoading = false;
              this.$router.push({name: 'set_video'});
            } else {
              this.isLoading = false;
            }
          }
        })
        .catch(() => {this.isLoading = false;})
    },
    // 返回
    cancelAdd () {
      const data = JSON.stringify(this.groupName);
      if (!this.groupId) { // 新增
        if (this.dataStr === data && this.currentDeviceList.length === 0) {
          this.$router.back(-1);  
        } else {
          this.backDialog = true;
        }
      } else { // 修改
        if (this.dataStr === data) {
          this.$router.back(-1);  
        } else {
          this.backDialog = true;
        }
      }
    },
    // 确定返回 
    sureBack () {
      this.backDialog = false;
      this.$router.back(-1);
    },
  }
}
</script>
<style lang="scss">
.add_group {
  height: 100%;
  .content_box {
    width: 98%;
    background-color: #ffffff;
    margin: 0 20px 60px 20px;
    padding-bottom: 5px;
    .content_new_group {
      padding: 20px;
      display: flex;
      align-items: center;
      >span {
        margin-right: 10px;
        color: #666666;
      }
    }
    .content_main_box {
      padding: 0 20px;
      >p {
        color: #666666;
      }
      .main_tab_box {
        height: 100%;
        margin-top: 10px;
        border: 1px solid #D3D3D3;
        margin-bottom: 20px;
        border-radius:4px 4px 0px 0px;
        .tab_list {
          height: 44px;
          line-height: 44px;
          background-color: #FAFAFA;
          border-bottom: 1px solid #F2F2F2;
          >li {
            display: inline-block;
            margin: 0 20px;
            color: #333333;
            cursor: pointer;
            &.active_li {
              color: #0C70F8;
              border-bottom: 2px solid #0C70F8;
            }
          }
        }
        .search_box {
          width: 100%;
          padding: 15px 20px 0;
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
          .divide {
            border: 1px dashed #fafafa;
          }
        }       
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
    z-index: 1;
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


