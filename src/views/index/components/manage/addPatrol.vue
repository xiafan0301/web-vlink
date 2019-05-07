<template>
<vue-scroll>
  <div class="add_patrol">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manage/videoSetting/customGroup' }">视频设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/videoSetting/tirotationSetting' }">轮巡设置</el-breadcrumb-item>
        <el-breadcrumb-item>新增轮巡</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_box">
      <div class="content_new_group">
        <el-form :inline="true" :model="addForm" :rules="rules" class="add_form" ref="addForm" label-width="100px">
          <el-form-item label="轮巡名称:" style="width: 49%;" prop="roundName">
            <el-input style="width: 100%;" v-model="addForm.roundName" placeholder="请输入轮巡名称"></el-input>
          </el-form-item>
           <el-form-item label="轮巡时间:" style="width: 49%;" prop="dateTime">
            <!-- <el-date-picker type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions0" style='width: 100%;' placeholder="选择日期" v-model="addForm.dateTime" ></el-date-picker> -->
            <el-date-picker
              style="width: 100%;"
              v-model="addForm.dateTime"
              type="datetimerange"
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
              <el-option label="16" :value="16"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="间隔时间:" style="width: 49%;" prop="roundInterval">
            <el-input style="width: 100%;" v-model="addForm.roundInterval" placeholder="5-120秒"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="content_main_box">
        <p>选择设备:</p>
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
              :selectDeviceList="allDeviceList"
              :selectDeviceNumber="selectDeviceNumber"
            ></mapSelect>
          </template>
          <template v-if="tabState === 2">
            <listSelect
              :selectDeviceList="allDeviceList"
              :selectDeviceNumber="selectDeviceNumber"
              @emitOpenRightArrow="emitOpenRightArrow"
              @emitParentChecked="emitParentChecked"
              @emitChildChecked="emitChildChecked"
              @emitAllChecked="emitAllChecked"
              @emitFinalDevice="emitFinalDevice"
            ></listSelect>
          </template>
        </div>
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="addPatrolInfo('addForm')">保存</el-button>
      <el-button class="operation_btn back_btn" @click="cancelSubmit">取消</el-button>
    </div>
  </div>
</vue-scroll>
</template>
<script>
import listSelect from './components/listSelect.vue';
import mapSelect from './components/mapSelect.vue';
import { formatDate } from '@/utils/util.js';
import { getAllDevices } from '@/views/index/api/api.manage.js';
import { addVideoRound, getVideoRoundDetail } from '@/views/index/api/api.video.js';
export default {
  components: {listSelect, mapSelect},
  data () {
    return {
      tabState: 1, // 地图选择
      addForm: {
        roundName: null, // 轮巡名称
        roundInterval: null, // 间隔时间
        frameNum: null, // 画面数
        dateTime: [] // 轮巡时间
      },
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() < (new Date().getTime() - 24 * 3600 * 1000);
        }
      },
      rules: {
        roundName: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
          { max: 10, message: '最多输入10个字', trigger: 'blur' }
        ],
        dateTime: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
        ],
        roundInterval: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
          // { min: 5, message: '请正确输入5-120之间的整数', trigger: 'blur' },
          // { max: 150, message: '请正确输入5-120之间的整数', trigger: 'blur' },
          // { type: 'number', message: '请正确输入5-120之间的整数', trigger: 'blur' }
        ],
        frameNum: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
        ]
      },
      searchForm: {
        areaId: null, // 行政区划
        intelCharac: null, // 智能特性
        dutyOrganId: null // 责任部门id
      },
      allDeviceList: [], // 所有的可选设备
      selectDeviceNumber: 0, // 可以选择的可选设备数量
      rightAllChecked: false, // 右侧设备全部选中
      currentDeviceList: [], // 要提交的设备
      isAddLoading: false, // 新增轮巡加载中
      patrolId: null, // 要编辑的轮巡id
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.patrolId = this.$route.query.id;
      this.getDetail();
    }
    this.getAllDevicesList();
  },
  methods: {
    // 查看轮巡详情
    getDetail () {
      if (this.patrolId) {
        getVideoRoundDetail(this.patrolId)
          .then(res => {
            console.log(res);
            if (res.data) {
              this.addForm.roundName = res.data.roundName;
              this.addForm.roundInterval = res.data.roundInterval;
              this.addForm.frameNum = res.data.frameNum;
              this.addForm.dateTime.push(formatDate(res.data.startTime));
              this.addForm.dateTime.push(formatDate(res.data.endTime));
            }
          })
          .catch(() => {})
      }
    },
    // 接收已有的设备
    emitFinalDevice (list) {
      this.currentDeviceList = [];
      if (list) {
        this.currentDeviceList = JSON.parse(JSON.stringify(list));
      }
    },
    // 打开右侧箭头
    emitOpenRightArrow (index) {
      this.allDeviceList[index].isOpenArrow = !this.allDeviceList[index].isOpenArrow;
      this.allDeviceList = JSON.parse(JSON.stringify(this.allDeviceList));
    },
    // 右侧---全部选中
    emitAllChecked (val) {
      this.rightAllChecked = val;
      this.allDeviceList.map(item => {
        item.isChecked = val;
        item.deviceList.map(itm => {
          itm.isChildChecked = val;
        });
      });
      this.allDeviceList = JSON.parse(JSON.stringify(this.allDeviceList));
    },
    // 右侧--父级多选框选中
    emitParentChecked (index, val) {
      this.allDeviceList[index].isChecked = val;
      this.allDeviceList[index].deviceList.map(item => {
        item.isChildChecked = val;
      });
      if (!val) {
        this.rightAllChecked = false;
      }
      this.allDeviceList = JSON.parse(JSON.stringify(this.allDeviceList)); // 必须放在过滤父级的上面，因为先要更新在过滤
      // 过滤出父级中没有选中
      let checkedParentArr = this.allDeviceList.filter(itm => {
        return itm.isChecked === false;
      });
      // 如果父级全部选中， 则全选选中
      if (checkedParentArr.length === 0) {
        this.rightAllChecked = true;
      } else {
        this.rightAllChecked = false;
      }
    },
    // 右侧--子级多选框选中
    emitChildChecked (index, idx, val) {
      this.allDeviceList[index].deviceList[idx].isChildChecked = val;
      // 过滤出子级选中的
      let checkedArr = this.allDeviceList[index].deviceList.filter((item) => {
        return item.isChildChecked === true;
      })
      if (checkedArr.length === 0) { // 没有选中的
        this.allDeviceList[index].isChecked = false;
      }
      if (checkedArr.length === this.allDeviceList[index].deviceList.length) { // 全选
        this.allDeviceList[index].isChecked = true;
      }
      if (checkedArr.length === 0 || checkedArr.length < this.allDeviceList[index].deviceList.length) {
        // this.rightAllChecked = false;
        this.allDeviceList[index].isChecked = false;
      }

      this.allDeviceList = JSON.parse(JSON.stringify(this.allDeviceList));
      // 过滤出父级中没有选中
      let checkedParentArr = this.allDeviceList.filter(itm => {
        return itm.isChecked === false;
      });
      // 如果父级全部选中， 则全选选中
      if (checkedParentArr.length === 0) {
        this.rightAllChecked = true;
      } else {
        this.rightAllChecked = false;
      }
    },
    // 获取所有可选的设备
    getAllDevicesList () {
      getAllDevices(this.searchForm)
        .then(res => {
          if (res) {
            this.allDeviceList = res.data;
            this.allDeviceList.map(item => {
              item.isOpenArrow = false; // 设置是否展开
              item.isChecked = false; // 父级是否选中
              item.deviceList.map(itm => {
                itm.isChildChecked = false; // 子级是否选中
              });
              this.selectDeviceNumber += item.deviceList.length;
            });
          }
        })
        .catch(() => {})
    },
    // 新增轮巡
    addPatrolInfo (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let device = [];
          if (this.currentDeviceList.length > 0) {
            this.currentDeviceList.map(item => {
              if (item.deviceList.length > 0) {
                item.deviceList.map(itm => {
                  device.push(itm.uid);
                })
              }
            })
          }
          console.log('currentDeviceList', this.currentDeviceList)
          console.log('addForm', this.addForm)
          const params = {
            frameNum: this.addForm.frameNum,
            roundInterval: parseInt(this.addForm.roundInterval),
            roundName: this.addForm.roundName,
            startTime: this.addForm.dateTime[0],
            endTime: this.addForm.dateTime[1],
            devList: device,
            deviceNum: device.length
          }
          console.log(params)
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
        }
      })
    },
    // 根据搜索条件查询可用设备
    searchData () {
      this.getAllDevicesList();
    },
    // 重置搜索条件
    resetForm (form) {
      this.$refs[form].resetFields();
      this.getAllDevicesList();
    },
    // 返回
    cancelSubmit () {
      // this.$refs[form].resetFields();
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
          width: 80%;
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
