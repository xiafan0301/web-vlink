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
        <div
          is="mapSelector"
          ref="addGSelctor"
          :filter="2"
          isNotDialog
          :open="openMap"
          :clear="msClear"
          :showTypes="'DB'"
          :activeDeviceList="currentDeviceList"
        ></div>
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
// import { random14 } from '@/utils/util.js';
import mapSelector from '@/components/common/mapSelector.vue';
// import listSelect from './components/listSelect.vue';
// import mapSelect from './components/mapSelect.vue';
// import { dataList } from '@/utils/data.js';
// import { getDiciData } from '@/views/index/api/api.js';
import { addGroupDevice, getCurrentDevices, updateGroupDevice } from '@/views/index/api/api.manage.js';
export default {
  components: { mapSelector },
  data () {
    return {
      openMap: true,
      msClear: {},
      backDialog: false, // 返回提示弹出框
      isShowError: false,
      errorText: null,
      groupName: '', // 新增分组名
      // allDeviceList: [], // 所有设备列表数据
      // selectDeviceList: [], // 可选设备列表
      // selectDeviceNumber: 0, // 可选设备数量
      alcurrentDeviceList: [],
      currentDeviceList: [], // 已有的设备数据
      // rightAllChecked: false, // 右侧设备全部选中
      groupId: null, // 当前分组id
      // leftDeviceNumber: 0, // 左侧设备数量
      isLoading: false,
      // userInfo: {}, // 用户信息
      // allDepartmentData: [], // 部门列表
      // intelCharacList: [], // 智能特性列表
      // isInitalState: false // 判断是否点击过列表选择
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
    // this.userInfo = this.$store.state.loginUser;
    
    if (this.$route.query.groupId) {
      this.groupId = this.$route.query.groupId;
      this.groupName = this.$route.query.name;
      this.getCurrentDeviceList();
    }
    // setTimeout(() => {
    //   this.getAllDevicesList();
    // }, 1000)

    this.dataStr =  JSON.stringify(this.groupName); // 将初始数据转成字符串

    // this.getIntelCharacList();
    // this.getAllDepartList();
  },
  methods: {
    // 获取当前分组下的设备列表
    getCurrentDeviceList () {
      if (this.groupId) {
        const params = {
          groupId: this.groupId
        }
        getCurrentDevices(params)
          .then(res => {
            if (res && res.data) {
              this.alcurrentDeviceList = res.data; // 保存一份原始的当前设备下的设备列表
              
              res.data.map(item => {
                item.deviceList.map(itm => {
                  this.currentDeviceList.push(itm.uid);
                });
                item.bayonetList.map(itm => {
                  this.currentDeviceList.push(itm.uid);
                });
              })
            }
          })
          .catch(() => {})
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

      let selectDevicesList = this.$refs['addGSelctor'].getCheckedIds();
      let vehicleIds = [], bayonetIds = [];
      if(selectDevicesList.deviceList.length > 0 || selectDevicesList.bayonetList.length > 0) {
        selectDevicesList.deviceList.map(item => {
          vehicleIds.push(item.uid);
        });
        selectDevicesList.bayonetList.map(item => {
          bayonetIds.push(item.uid);
        });
      } else {
        this.$message({
          type: 'warning',
          message: '请先选择需要关联的设备',
          customClass: 'request_tip'
        });
        return;
      }
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
      let selectDevicesList = this.$refs['addGSelctor'].getCheckedIds();
      
      if (selectDevicesList.deviceList.length > 0 || selectDevicesList.bayonetList.length > 0) {
        selectDevicesList.deviceList.map(item => {
          currDeviceIds.push(item.uid);
        });
        selectDevicesList.bayonetList.map(item => {
          currDeviceIds.push(item.uid);
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
        if (this.dataStr === data) {
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
    border-radius: 4px;
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
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
        margin-bottom: 10px;
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


