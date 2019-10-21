<template>
<vue-scroll>
  <div class="add_patrol">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manage/videoSetting/customGroup' }">视频设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/videoSetting/tirotationSetting' }">轮巡设置</el-breadcrumb-item>
        <el-breadcrumb-item>{{this.$route.query.id ? '编辑轮巡' : '新增轮巡'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_box">
      <div class="content_new_group">
        <el-form :inline="true" :model="addForm" :rules="rules" class="add_form" ref="addForm" label-width="110px">
          <el-form-item label="轮巡名称:" style="width: 49%;" prop="roundName" :class="{'round_name': isShowRoundName }">
            <el-input style="width: 100%;" v-model="addForm.roundName" placeholder="请输入轮巡名称" maxlength="10" @blur="blurRoundName"></el-input>
            <p class="round_error_tip" v-show="isShowRoundName">轮巡名称不允许重复</p>
          </el-form-item>
           <el-form-item label="轮巡时间:" style="width: 49%;" prop="dateTime">
            <el-date-picker
              style="width: 100%;"
              v-model="addForm.dateTime"
              type="datetimerange"
              :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="-"
              :picker-options="pickerOptions0"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="轮巡画面:" style="width: 49%;" prop="frameNum">
            <el-select style="width: 100%;" v-model="addForm.frameNum" placeholder="轮巡画面">
              <el-option label="1" :value="1"></el-option>
              <el-option label="4" :value="4"></el-option>
              <el-option label="5" :value="5"></el-option>
              <el-option label="9" :value="9"></el-option>
              <!-- <el-option label="16" :value="16"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="间隔时间(秒):" style="width: 49%;" prop="roundInterval">
            <el-input style="width: 100%;" v-model="addForm.roundInterval" placeholder="10-120秒"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="content_main_box">
        <p>选择设备:</p>
        <div
          is="mapSelector"
          ref="addPatrolSelctor"
          :filter="1"
          isNotDialog
          :open="openMap"
          :clear="msClear"
          :showTypes="'DB'"
          :activeDeviceList="currentDeviceList"
        ></div>
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="submitData('addForm')">保存</el-button>
      <el-button class="operation_btn back_btn" @click="cancelSubmit">取消</el-button>
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
import mapSelector from '@/components/common/mapSelector.vue';
import { formatDate } from '@/utils/util.js';
// import { dataList } from '@/utils/data.js';
// import { getDiciData } from '@/views/index/api/api.js';
import { validateDurationTime, validatePatrolTime } from '@/utils/validator.js';
// import { getAllDevices } from '@/views/index/api/api.manage.js';
import { addVideoRound, getVideoRoundDetail, updateVideoRoundState, judgeRoundName } from '@/views/index/api/api.video.js';
export default {
  components: { mapSelector },
  data () {
    return {
      openMap: true,
      msClear: {},
      isShowRoundName: false, // 是否显示轮巡名称重复提示
      // isSelected: 0, // 查询--重置
      backDialog: false, // 返回提示弹出框
      // tabState: 1, // 地图选择
      addForm: {
        roundName: null, // 轮巡名称
        roundInterval: 60, // 间隔时间
        frameNum: 4, // 画面数
        dateTime: [], // 轮巡时间
      },
      pickerOptions0: {
        disabledDate: (d) => {
          d = d.getTime();
          if (d < new Date().getTime() - 24 * 60 * 60 * 1000) {
            return true;
          } else {
            return false;
          }
        }
      },
      rules: {
        roundName: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
        ],
       dateTime: [
         { required: true, message: '该项内容不可为空', trigger: 'blur' },
         { validator: validatePatrolTime, trigger: 'blur' }
       ],
        roundInterval: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
          { validator: validateDurationTime, trigger: 'blur' }
        ],
        frameNum: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
        ]
      },
      // searchForm: {
      //   groupId: '全部分组', // 分组id
      //   intelCharac: '全部特性', // 智能特性
      //   dutyOrganId: '全部部门', // 责任部门id
      //   devName: null // 设备名称
      // },
      // allDeviceList: [], // 所有的设备列表
      // selectDeviceList: [], // 可选的设备列表
      // selectDeviceNumber: 0, // 可以选择的可选设备数量
      // rightAllChecked: false, // 右侧设备全部选中
      // leftDeviceNumber: 0, // 左侧设备数量
      currentDeviceList: [], // 要提交的设备
      alcurrentDeviceList: [],
      isAddLoading: false, // 新增轮巡加载中
      patrolId: null, // 要编辑的轮巡id
      // groupsList: [], // 所有的分组列表
      // userInfo: {}, // 用户信息
      // allDepartmentData: [], // 部门列表
      // intelCharacList: [], // 智能特性列表
      // isInitalState: false // 判断是否点击过列表选择
    }
  },
  mounted () {

    this.dataStr = JSON.stringify(this.addForm); // 将初始数据转成字符串

    if (this.$route.query.id) {
      this.patrolId = this.$route.query.id;
      this.getDetail();
    }
    // setTimeout(() => {
    //   this.getAllDevicesList();
    // }, 1000)

  },
  methods: {
    // 判断轮巡名称是否重复
    blurRoundName () {
      if (this.addForm.roundName) {
        if (!this.$route.query.id) { // 新增轮巡
          judgeRoundName(this.addForm.roundName)
            .then(res => {
              if (res && res.data) {
                this.isShowRoundName = true;
              } else {
                this.isShowRoundName = false;
              }
          })
        }
      } else {
        this.isShowRoundName = false;
      }
    },
    // 查看轮巡详情
    getDetail () {
      if (this.patrolId) {
        getVideoRoundDetail(this.patrolId)
          .then(res => {
            if (res.data) {
              
              this.addForm.roundName = res.data.roundName;
              this.addForm.roundInterval = res.data.roundInterval;
              this.addForm.frameNum = res.data.frameNum;
              this.addForm.dateTime.push(formatDate(res.data.startTime));
              this.addForm.dateTime.push(formatDate(res.data.endTime));

              this.alcurrentDeviceList = res.data.areaGroupList; // 保存一份原始的当前设备下的设备列表

              res.data.areaGroupList.map(item => {
                item.deviceList.map(itm => {
                  this.currentDeviceList.push(itm.uid);
                });
                item.bayonetList.map(itm => {
                  this.currentDeviceList.push(itm.uid);
                });
              });
            }
          })
          .catch(() => {})
      }
    },
    // 提交数据
    submitData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (this.patrolId) {
            this.editPatrolInfo();
          } else {
            this.addPatrolInfo();
          }
        }
      })
    },
    // 新增轮巡
    addPatrolInfo () {
      if (this.isShowRoundName) {
        return;
      }
      
      let selectDevicesList = this.$refs['addPatrolSelctor'].getCheckedIds();
      let devList = [], bayList = [];

      if(selectDevicesList.deviceList.length > 0 || selectDevicesList.bayonetList.length > 0) {
        selectDevicesList.deviceList.map(item => {
          devList.push(item.uid);
        });
        selectDevicesList.bayonetList.map(item => {
          bayList.push(item.uid);
        });
      } else {
        this.$message({
          type: 'warning',
          message: '请先选择需要关联的设备',
          customClass: 'request_tip'
        });
        return;
      }

      const devLength = devList.length + bayList.length;

      const params = {
        frameNum: this.addForm.frameNum,
        roundInterval: parseInt(this.addForm.roundInterval),
        roundName: this.addForm.roundName,
        startTime: this.addForm.dateTime[0],
        endTime: this.addForm.dateTime[1],
        devList,
        bayList,
        deviceNum: devLength
      }
      this.isAddLoading = true;
      addVideoRound(params)
        .then(res => {
          console.log('res', res)
          if (res) {
            this.$message({
              type: 'success',
              message: '新增成功',
              customClass: 'request_tip'
            });
            this.isAddLoading = false;
            this.$router.push({name: 'tirotation_setting'});
          } else {
            this.isAddLoading = false;
          }
        })
        .catch(() => {this.isAddLoading = false;})
    },
    // 修改轮巡
    editPatrolInfo () {
      let selectDevicesList = this.$refs['addPatrolSelctor'].getCheckedIds();

      let devList = [], bayList = [];
      let allSxtDeviceIds = [], allKkDeviceIds = []; // 当前分组下原始的所有的设备id（摄像头和卡口）
      let currSxtDeviceIds = [], currKkDeviceIds = []; // 当前分组下所有的设备id（摄像头和卡口）

      if (selectDevicesList.deviceList.length > 0 || selectDevicesList.bayonetList.length > 0) {
        selectDevicesList.deviceList.map(item => {
          currSxtDeviceIds.push(item.uid);
        });
        selectDevicesList.bayonetList.map(item => {
          currKkDeviceIds.push(item.uid);
        });
        
        this.alcurrentDeviceList.map(item => {
          item.deviceList.map(a => {
            allSxtDeviceIds.push(a.uid);
          });
          item.bayonetList.map(a => {
            allKkDeviceIds.push(a.uid);
          });
        });

        // console.log('currSxtDeviceIds', currSxtDeviceIds)
        // console.log('allSxtDeviceIds', allSxtDeviceIds)

        let newCurrSxtDeviceIds = JSON.parse(JSON.stringify(currSxtDeviceIds));
        let newAllSxtDeviceIds = JSON.parse(JSON.stringify(allSxtDeviceIds));

        let newCurrKkDeviceIds = JSON.parse(JSON.stringify(currKkDeviceIds));
        let newAllKkDeviceIds = JSON.parse(JSON.stringify(allKkDeviceIds));

        // 筛选出新添加的设备 -- 摄像头
        for (let len = currSxtDeviceIds.length, i = len -1; i >= 0; i--) {
          for (let length = allSxtDeviceIds.length, j = length -1; j >= 0; j--) {
            if (currSxtDeviceIds[i] === allSxtDeviceIds[j]) {
              newCurrSxtDeviceIds.splice(i, 1);
            }
          }
        }
        // 筛选出删除的摄像头设备 --- 摄像头
        for (let len = allSxtDeviceIds.length, i = len -1; i >= 0; i--) {
          for (let length = currSxtDeviceIds.length, j = length -1; j >= 0; j--) {
            if (allSxtDeviceIds[i] === currSxtDeviceIds[j]) {
              newAllSxtDeviceIds.splice(i, 1);
            }
          }
        }

        // 筛选出新添加的设备 -- 卡口
        for (let len = currKkDeviceIds.length, i = len -1; i >= 0; i--) {
          for (let length = allKkDeviceIds.length, j = length -1; j >= 0; j--) {
            if (currKkDeviceIds[i] === allKkDeviceIds[j]) {
              newCurrKkDeviceIds.splice(i, 1);
            }
          }
        }
        // 筛选出删除的摄像头设备 --- 卡口
        for (let len = allKkDeviceIds.length, i = len -1; i >= 0; i--) {
          for (let length = currKkDeviceIds.length, j = length -1; j >= 0; j--) {
            if (allKkDeviceIds[i] === currKkDeviceIds[j]) {
              newAllKkDeviceIds.splice(i, 1);
            }
          }
        }
        // console.log('currSxtDeviceIds', newCurrSxtDeviceIds)
        // console.log('allSxtDeviceIds', newAllSxtDeviceIds)
        devList = newCurrSxtDeviceIds;
        newAllSxtDeviceIds.map(item => {
          devList.push(item);
        });

        bayList = newCurrKkDeviceIds;
        newAllKkDeviceIds.map(item => {
          bayList.push(item);
        });

      } else {
        this.alcurrentDeviceList.map(item => {
          item.deviceList.map(a => {
            devList.push(a.uid);
          });
          item.bayonetList.map(a => {
            bayList.push(a.uid);
          });
        });
      }
      const params = {
        id: this.patrolId,
        frameNum: this.addForm.frameNum,
        roundInterval: parseInt(this.addForm.roundInterval),
        roundName: this.addForm.roundName,
        startTime: this.addForm.dateTime[0],
        endTime: this.addForm.dateTime[1],
        bayList,
        devList
      };
      this.isLoading = false;
      updateVideoRoundState(params)
        .then(res => {
          if (res) {
            if (res) {
               this.$message({
                type: 'success',
                message: '修改成功',
                customClass: 'request_tip'
              });
              this.isLoading = false;
              this.$router.push({name: 'tirotation_setting'});
            } else {
              this.isLoading = false;
            }
          }
        })
        .catch(() => {this.isLoading = false;})
    },
    // 返回
    cancelSubmit () {
      const data = JSON.stringify(this.addForm);
      if (!this.patrolId) { // 新增
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
    }
  }
}
</script>
<style lang="scss">
.add_patrol {
  height: 100%;
  .content_box {
    width: 98%;
    background-color: #ffffff;
    margin: 0 20px 60px 20px;
    padding-bottom: 5px;
    .content_new_group {
      padding: 10px 20px 0;
      display: flex;
      align-items: center;
      .add_form {
        width: 100%;
        .el-form-item__content {
          width: 75%;
        }
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
        .round_name {
          position: relative;
          /deep/ .el-input__inner {
            border-color: #f56c6c;
          }
          .round_error_tip {
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
