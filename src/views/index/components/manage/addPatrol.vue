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
          <el-form-item label="轮巡名称:" style="width: 49%;" prop="roundName">
            <el-input style="width: 100%;" v-model="addForm.roundName" placeholder="请输入轮巡名称" maxlength="10"></el-input>
          </el-form-item>
           <el-form-item label="轮巡时间:" style="width: 49%;" prop="dateTime">
            <el-date-picker
              style="width: 100%;"
              v-model="addForm.dateTime"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="-"
              :picker-options="pickerOptions0"
              @change="handleChangeDate"
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
          <el-form-item label="间隔时间(秒):" style="width: 49%;" prop="roundInterval">
            <el-input style="width: 100%;" v-model="addForm.roundInterval" placeholder="10-120秒"></el-input>
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
              <el-form-item prop="groupId">
                <el-select  style="width: 240px;" v-model="searchForm.groupId" placeholder="自定义组">
                  <el-option value="全部分组"></el-option>
                  <el-option
                    v-for="(item, index) in groupsList"
                    :key="index"
                    :label="item.groupName"
                    :value="item.uid"
                  >
                  </el-option>
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
              :groupId="patrolId"
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
              :currentDeviceList="currentDeviceList"
              :selectDeviceList="selectDeviceList"
              :selectDeviceNumber="selectDeviceNumber"
              @emitOpenRightArrow="emitOpenRightArrow"
              @emitParentChecked="emitParentChecked"
              @emitChildChecked="emitChildChecked"
              @emitAllChecked="emitAllChecked"
              @emitFinalDevice="emitFinalDevice"
              @emitRemoveFinalDevice="emitRemoveFinalDevice"
              @emitOpenLeftArrow="emitOpenLeftArrow"
              @emitLeftParentChecked="emitLeftParentChecked"
              @emitLeftChildChecked="emitLeftChildChecked"
              @emitChangeRDeviceType="emitChangeRDeviceType"
              @emitChangeLDeviceType="emitChangeLDeviceType"
              @emitSearchData="emitSearchData"
            ></listSelect>
          </template>
        </div>
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
import listSelect from './components/listSelect.vue';
import mapSelect from './components/mapSelect.vue';
import { formatDate, random14 } from '@/utils/util.js';
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
import { validateDurationTime } from '@/utils/validator.js';
import { getAllDevices, getCusGroup, getDepartmentList } from '@/views/index/api/api.manage.js';
import { addVideoRound, getVideoRoundDetail, updateVideoRoundState } from '@/views/index/api/api.video.js';
export default {
  components: {listSelect, mapSelect},
  data () {
    return {
      isSelected: 0, // 查询--重置
      backDialog: false, // 返回提示弹出框
      tabState: 1, // 地图选择
      addForm: {
        roundName: null, // 轮巡名称
        roundInterval: 60, // 间隔时间
        frameNum: 4, // 画面数
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
          // { max: 10, message: '最多输入10个字', trigger: 'blur' }
        ],
        dateTime: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
        ],
        roundInterval: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
          { validator: validateDurationTime, trigger: 'blur' }
        ],
        frameNum: [
          { required: true, message: '该项内容不可为空', trigger: 'blur' },
        ]
      },
      searchForm: {
        groupId: '全部分组', // 分组id
        intelCharac: '全部特性', // 智能特性
        dutyOrganId: '全部部门', // 责任部门id
        devName: null // 设备名称
      },
      allDeviceList: [], // 所有的设备列表
      selectDeviceList: [], // 可选的设备列表
      selectDeviceNumber: 0, // 可以选择的可选设备数量
      rightAllChecked: false, // 右侧设备全部选中
      leftDeviceNumber: 0, // 左侧设备数量
      currentDeviceList: [], // 要提交的设备
      alcurrentDeviceList: [],
      isAddLoading: false, // 新增轮巡加载中
      patrolId: null, // 要编辑的轮巡id
      groupsList: [], // 所有的分组列表
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
    this.dataStr = JSON.stringify(this.addForm); // 将初始数据转成字符串

    if (this.$route.query.id) {
      this.patrolId = this.$route.query.id;
      this.getDetail();
    }
    setTimeout(() => {
      this.getAllDevicesList();
    }, 1000)

    this.getGroups();
    this.getIntelCharacList();
    this.getAllDepartList();
  },
  methods: {
    // 根据设备名称搜索
    emitSearchData (val) {
      this.searchForm.devName = val;
      this.getAllDevicesList();
    },
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
    // 获取所有的分组
    getGroups () {
      getCusGroup()
        .then(res => {
          if (res) {
            this.groupsList = res.data;
          }
        })
        .catch(() => {})
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

              this.alcurrentDeviceList = JSON.parse(JSON.stringify(res.data.areaGroupList)); // 保存一份原始的当前设备下的设备列表
              this.currentDeviceList = JSON.parse(JSON.stringify(res.data.areaGroupList));

              this.currentDeviceList.map(item => {
                let cname = item.areaName;
                let uid = item.areaUid;
                item.isOrigin = true;
                item.isOpenArrow = false; // 设置是否展开
                item.isChecked = false; // 父级是否选中
                item.isSXT = true; // 默认选中摄像头
                item.cname = cname;
                item.uid = uid;
                
                item.deviceList.map(itm => {
                  item.isOrigin = true;
                  itm.isChildChecked = false; // 子级是否选中
                });
                item.bayonetList.map(itm => {
                  let deviceName = itm.bayonetName;

                  item.isOrigin = true;
                  itm.isChildChecked = false; // 子级是否选中

                  itm.deviceName = deviceName;
                });

                this.leftDeviceNumber += item.deviceList.length;
                this.leftDeviceNumber += item.bayonetList.length;
              });
            }
          })
          .catch(() => {})
      }
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
    // 右侧--子级多选框选中
    emitChildChecked (index, idx, val, isSxt) {
      if (isSxt) {
        this.selectDeviceList[index].deviceList[idx].isChildChecked = val;
      } else {
        this.selectDeviceList[index].bayonetList[idx].isChildChecked = val;
      }

      // 过滤出子级选中的
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
    // 打开左侧箭头
    emitOpenLeftArrow (index) {
      this.currentDeviceList[index].isOpenArrow = !this.currentDeviceList[index].isOpenArrow;
      this.currentDeviceList = JSON.parse(JSON.stringify(this.currentDeviceList));
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
    // 从添加设备接收要提交的设备
    emitFinalDevice (list, number, selectList, selectNum) {
      if (list) {
        let arr = [];
        if (list.length > 0) {
          if ((this.patrolId || this.isInitalState) && this.tabState === 1) { // 如果是编辑轮巡
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
        this.selectDeviceNumber = selectNum && selectNum;
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
    // 获取所有可选的设备
    getAllDevicesList () {
      let groupId, dutyOrganId, intelCharac;
      if (this.searchForm.groupId === '全部分组') {
        groupId = null;
      } else {
        groupId = this.searchForm.groupId;
      }
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

      const params = {
        groupId,
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
            if (this.patrolId) {
              if (this.currentDeviceList.length > 0) {
                this.currentDeviceList.map(item => {
                  this.selectDeviceList.map((val) => {
                    if (item.areaUid == val.uid) {
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
            } else { // 新增---点击重置的时候将已有设备清零
              this.currentDeviceList = [];
              this.leftDeviceNumber = 0;
            }
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
          }
        })
        .catch(() => {})
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
      if (this.currentDeviceList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请先选择需要关联的设备',
          customClass: 'request_tip'
        });
        return;
      }
      let devList = [], bayList = [];
      this.currentDeviceList.map(item => {
        if (item.deviceList.length > 0) {
          item.deviceList.map(itm => {
            devList.push(itm.uid);
          });
        }
        if (item.bayonetList.length > 0) {
          item.bayonetList.map(itm => {
            bayList.push(itm.uid);
          });
        }
      });
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
        // }
      // })
    },
    // 修改轮巡
    editPatrolInfo () {
      let devList = [], bayList = [];
      let allSxtDeviceIds = [], allKkDeviceIds = []; // 当前分组下原始的所有的设备id（摄像头和卡口）
      let currSxtDeviceIds = [], currKkDeviceIds = []; // 当前分组下所有的设备id（摄像头和卡口）
      // let delSxtList = [], delKkList = []; // 删除的摄像头和卡口
      if (this.currentDeviceList.length > 0) {
        this.currentDeviceList.map(item => {
          item.deviceList.map(a => {
            currSxtDeviceIds.push(a.uid);
          });
          item.bayonetList.map(a => {
            currKkDeviceIds.push(a.uid);
          });
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
            console.log('res', res)
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
    // 根据搜索条件查询可用设备
    searchData () {
      if (this.searchForm.intelCharac || this.searchForm.dutyOrganId || this.searchForm.groupId) {
        this.getAllDevicesList();
        setTimeout(() => { // 争对地图选择，每点一次查询或者重置，就更新一下isSelected，用来更新可用设备  sxtList --kkList
          this.isSelected = 1 + random14();
        }, 500)
      }
    },
    // 重置搜索条件
    resetForm (form) {
      if (this.searchForm.intelCharac || this.searchForm.dutyOrganId || this.searchForm.groupId) {
        this.$refs[form].resetFields();
        this.getAllDevicesList();
        setTimeout(() => { // 争对地图选择，每点一次查询或者重置，就更新一下isSelected，用来更新可用设备  sxtList --kkList
          this.isSelected = 1 + random14();
        }, 500)
      }
    },
    // 返回
    cancelSubmit () {
      console.log(this.currentDeviceList)
      const data = JSON.stringify(this.addForm);
      if (!this.patrolId) { // 新增
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
    // 轮巡时间change
    handleChangeDate (val) {
      console.log(val)
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
