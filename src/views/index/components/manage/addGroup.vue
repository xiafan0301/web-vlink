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
        <el-input style="width: 300px;" @change="changeGroupName" v-model="groupName" placeholder="请输入分组名称，例：案件频发区域1"></el-input>
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
              <el-form-item prop="areaId">
                <el-select  style="width: 240px;" v-model="searchForm.areaId" placeholder="行政区划">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="intelCharac">
                <el-select  style="width: 240px;" v-model="searchForm.intelCharac" placeholder="智能特性">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="dutyOrganId">
                <el-select  style="width: 240px;" v-model="searchForm.dutyOrganId" placeholder="责任部门">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
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
              :selectDeviceList="selectDeviceList"
              :currentDeviceList="currentDeviceList"
              :selectDeviceNumber="selectDeviceNumber"
              :leftDeviceNumber="leftDeviceNumber"
              @emitOpenLeftArrow="emitOpenLeftArrow"
              @emitLeftParentChecked="emitLeftParentChecked"
              @emitLeftChildChecked="emitLeftChildChecked"
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
  </div>
</vue-scroll>
</template>
<script>
import listSelect from './components/listSelect.vue';
import mapSelect from './components/mapSelect.vue';
import { testData } from './components/testData.js';
import { getAllDevices, addGroupDevice, getCurrentDevices } from '@/views/index/api/api.manage.js';
export default {
  components: {listSelect, mapSelect},
  data () {
    return {
      tabState: 1, // 地图选择
      isShowError: false,
      errorText: null,
      searchForm: {
        areaId: null, // 行政区域
        intelCharac: null, // 智能特性
        dutyOrganId: null // 责任部门
      },
      groupName: null, // 新增分组名
      allDeviceList: [], // 所有设备列表数据
      selectDeviceList: [], // 可选设备列表
      selectDeviceNumber: 0, // 可选设备数量
      currentDeviceList: [], // 已有的设备数据
      rightAllChecked: false, // 右侧设备全部选中
      groupId: null, // 当前分组id
      leftDeviceNumber: 0, // 左侧设备数量
      isLoading: false
    }
  },
  mounted () {
    if (this.$route.query.groupId) {
      this.groupId = this.$route.query.groupId;
    }
    this.getCurrentDeviceList();
    this.getAllDevicesList();
  },
  methods: {
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
              this.currentDeviceList = res.data;
              this.currentDeviceList.map(item => {
                item.isOpenArrow = false; // 设置是否展开
                item.isChecked = false; // 父级是否选中
                item.isSXT = true; // 默认选中摄像头
                this.leftDeviceNumber += item.deviceList.length;
                this.leftDeviceNumber += item.bayonetList.length;
                item.deviceList.map(itm => {
                  itm.isChildChecked = false; // 子级是否选中
                });
                item.bayonetList.map(itm => {
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
      this.allDeviceList = testData;
      this.selectDeviceList = testData;
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
        this.selectDeviceNumber += item.deviceList.length;
        this.selectDeviceNumber += item.bayonetList.length;
      });
      // getAllDevices(this.searchForm)
      //   .then(res => {
      //     if (res) {
      //       this.allDeviceList = res.data;
      //       this.selectDeviceList = res.data;
      //       this.selectDeviceList.map(item => {
      //         item.isOpenArrow = false; // 设置是否展开
      //         item.isChecked = false; // 父级是否选中
      //         item.isSXT = true; // 默认显示摄像头
      //         item.deviceList.map(itm => {
      //           itm.isChildChecked = false; // 子级是否选中
      //         });
      //         item.bayonetList.map(itm => {
      //           itm.isChildChecked = false; // 子级是否选中
      //         });
      //         this.selectDeviceNumber += item.deviceList.length;
      //         this.selectDeviceNumber += item.bayonetList.length;
      //       });
      //     }
      //   })
      //   .catch(() => {})
    },
    // 搜索框
    searchData () {
      this.getAllDevicesList();
    },
    // 重置搜索框
    resetForm(form) {
      this.$refs[form].resetFields();
      this.getAllDevicesList();
    },
    // 从添加设备接收要提交的设备
    emitFinalDevice (list, number, selectList, selectNum) {
      if (list) {
        let arr = [];
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
      }
      if (selectList) {
        this.selectDeviceList = [];
        selectList.map(item => {
          this.selectDeviceList.push(item);
        });
        this.selectDeviceNumber = selectNum;
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
      } else {
        this.errorText = '';
        this.isShowError = false;
      }
    },
    // 新增分组
    submitData () {
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
          item.bayonetIds.map(itm => {
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
    // 取消添加
    cancelAdd () {
      this.$router.back(-1);
    }
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


