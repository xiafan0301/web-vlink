<template>
  <div class="device_authorize">
    <div class="device_left">
      <ul class="tab_box">
        <li :class="{'active': tabState === 1}" @click="tabState = 1">机构授权</li>
        <li :class="{'active': tabState === 2}" @click="tabState = 2">临时授权</li>
      </ul>
      <template v-if="tabState === 1">
        <div class="au_content_box">
          <vue-scroll>
            <ul class="au_left_content">
              <li v-for="(item, index) in departmentData" :key="'item' + index">
                <div class="parent_content" :class="{'active_li': item.isOpen === true}" @click="getMemberInfo(item.uid, index)">
                  <i :class="[item.isOpen === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                  <span>{{item.organName}}</span>
                </div>
                <template v-if="item.isOpen === true">
                  <div class="content_detail">
                    <p v-for="(itm, idx) in memberListData" :key="'itm' + idx">{{itm.userName}}</p>
                  </div>
                </template>
              </li>
            </ul>
          </vue-scroll>
        </div>
      </template>
      <template v-if="tabState === 2">
        <div class="temp_left_content">
          <div class="add_btn">
            <i class="vl_icon vl_icon_manage_4" @click="skipTempGrantPage"></i>
            <span>临时授权</span>
          </div>
          <div class="temp_content_box">
            <vue-scroll>
              <ul>
                <li
                  v-for="(item, index) in userListData"
                  :key="item.uid"
                  :class="[tempActiveUser === index ? 'active_name' : '']"
                  @click="getTempDetailDevice(item.uid, index)"
                >{{item.userName}}</li>
              </ul>
            </vue-scroll>
          </div>
        </div>
      </template>
    </div>
    <template v-if="tabState === 1">
      <div class="device_right device_right_authority">
        <div class="info_top">
          <p>
            <i class="vl_icon vl_icon_manage_5"></i>
            <span>可用设备 (100个)</span>
          </p>
          <el-button class="stop_btn" @click="skipAuthorizeGrantPage">管理</el-button>
          <div class="divide"></div>
        </div>
        <div class="search_box">
          <el-select v-model="value" placeholder="请选择" style="margin-right: 10px;width: 200px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="请选择" style="margin-right: 10px;width: 200px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="value" placeholder="请选择" style="margin-right: 10px;width: 200px;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button class="select_btn">查询</el-button>
          <el-button class="reset_btn">重置</el-button>
        </div>
        <div class="templ_detail_box">
          <vue-scroll>
            <ul class="temp_detail_info">
              <li>
                <div class="parent_temp_li" :class="{'temp_active': arrowActiveTemp === true}" @click="arrowActiveTemp = !arrowActiveTemp">
                  <i :class="[arrowActiveTemp === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                  <span>重点场所</span>
                </div>
                <div class="child_temp" v-show="arrowActiveTemp">
                  <div class="temp_tab">
                    <span class="active_span">摄像头</span>
                    <span>卡口</span>
                  </div>
                  <ul class="child_temp_detail">
                    <li>广场监控点1-300</li>
                    <li>广场监控点1-300</li>
                    <li>广场监控点1-300</li>
                  </ul>
                </div>
              </li>
              <li>
                <div class="parent_temp_li" :class="{'temp_active': arrowActiveTemp === true}" @click="arrowActiveTemp = !arrowActiveTemp">
                  <i :class="[arrowActiveTemp === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                  <span>重点场所</span>
                </div>
                <div class="child_temp" v-show="arrowActiveTemp">
                  <div class="temp_tab">
                    <span class="active_span">摄像头</span>
                    <span>卡口</span>
                  </div>
                  <ul class="child_temp_detail">
                    <li>广场监控点1-300</li>
                    <li>广场监控点1-300</li>
                    <li>广场监控点1-300</li>
                  </ul>
                </div>
              </li>
              <li>
                <div class="parent_temp_li" :class="{'temp_active': arrowActiveTemp === true}" @click="arrowActiveTemp = !arrowActiveTemp">
                  <i :class="[arrowActiveTemp === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                  <span>重点场所</span>
                </div>
                <div class="child_temp" v-show="arrowActiveTemp">
                  <div class="temp_tab">
                    <span class="active_span">摄像头</span>
                    <span>卡口</span>
                  </div>
                  <ul class="child_temp_detail">
                    <li>广场监控点1-300</li>
                    <li>广场监控点1-300</li>
                    <li>广场监控点1-300</li>
                  </ul>
                </div>
              </li>
            </ul>
          </vue-scroll>
        </div>
      </div>
    </template>
    <template v-if="tabState === 2">
      <div class="device_right device_right_temp">
        <div class="info_top">
          <p>
            <i class="vl_icon vl_icon_manage_5"></i>
            <span>可用设备 ({{tempDeviceNumber}}个)</span>
          </p>
          <div class="search_box" style="margin-top: 15px;">
            <el-date-picker
              style="width: 300px;margin-right: 30px;"
              v-model="tempSearchForm.selectTime"
              :picker-options="pickerOptions0"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-select v-model="tempSearchForm.authState" placeholder="请选择" style="margin-right: 30px;width: 250px;">
              <el-option label="已授权" :value="1"></el-option>
              <el-option label="生效中" :value="2"></el-option>
              <el-option label="已失效" :value="3"></el-option>
            </el-select>
            <el-button class="select_btn" @click="tempSearchData">查询</el-button>
            <el-button class="reset_btn" @click="tempResetData">重置</el-button>
          </div>
          <div class="divide"></div>
        </div>
        <template v-if="tempDeviceList.length > 0">
          <el-button class="all_stop_btn" @click="showGrantDialog">全部终止</el-button>
          <div class="templ_detail_box">
            <vue-scroll>
              <ul class="temp_detail_info">
                <li v-for="(item, index) in tempDeviceList" :key="'item' + index">
                  <div class="parent_temp_li" :class="{'temp_active': item.isOpenArrow === true}" @click="openTempArrow(index)">
                    <i :class="[item.isOpenArrow === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                    <span>{{item.groupName}}</span>
                  </div>
                  <div class="child_temp" v-show="item.isOpenArrow">
                    <div class="temp_tab">
                      <span class="active_span">摄像头</span>
                      <span>卡口</span>
                    </div>
                    <ul class="child_temp_detail">
                      <li class="right_li" v-for="(itm, idx) in item.deviceList" :key="'itm' + idx">
                        <span>{{itm.deviceName}}</span>
                        <template v-if="itm.authStatus === 1">
                          <span class="grant_status">已授权</span>
                        </template>
                        <template v-if="itm.authStatus === 2">
                          <span class="effect_status">生效中</span>
                        </template>
                        <template v-if="itm.authStatus === 3">
                          <span class="invalid_status">已失效</span>
                        </template>
                        <span> ({{itm.authStartTime | fmTimestamp}}至{{itm.authEndTime | fmTimestamp}})</span>
                        <i v-show="itm.authStatus !== 3" class="vl_icon vl_icon_manage_16" title="终止授权" @click="showAloneStopTerminateDialog(itm.authId)"></i>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </vue-scroll>
          </div>
        </template>
        <template v-else>
          无相关数据
        </template>
      </div>
    </template>
    <!--全部终止授权弹出框-->
    <el-dialog
      :title="stopTitle"
      :visible.sync="stopGrantDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div slot="footer" class="dialog-footer">
        <el-button @click="stopGrantDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="aloneStopTerminate">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUserList, getDepartmentList, getUserMember, getTempDeviceList, stopOneTerminate } from '@/views/index/api/api.manage.js';
export default {
  data () {
    return {
      stopTitle: null,
      tempSearchForm: {
        selectTime: [],
        authState: 1, // 授权状态
      },
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() < (new Date().getTime() - 3600 * 1000 * 24) ||  time.getTime() > (new Date().getTime() + 3600 * 1000 * 24 * 90);
        }
      },
      tempActiveUser: 0, // 临时授权选中的授权对象
      tabState: 2, // 1-机构授权  2-临时授权
      arrowActive: false, // false-未展开的箭头， true-展开的箭头
      arrowActiveTemp: false,
      stopGrantDialog: false, // 终止授权弹出框
      userInfo: {}, // 存储的用户信息
      userListData: [], // 所有的用户--授权对象
      departmentData: [], // 所有的机构
      memberListData: [], // 机构下的成员
      tempDeviceList: [], // 临时授权--可选的设备列表
      tempDeviceNumber: 0, // 临时授权--可用设备数量
      userId: null, // 点击的授权对象
      stopGrantId: null, // 单个终止授权id
    }
  },
  created () {
    this.userInfo = this.$store.state.loginUser;
  },
  mounted () {
    this.getList();
    this.getDepartList();
  },
  methods: {
    // 获取列表数据
    getDepartList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0,
      };
      getDepartmentList(params)
        .then(res => {
          if (res && res.data.list) {
            this.departmentData = JSON.parse(JSON.stringify(res.data.list));
            this.departmentData.map(item => {
              item.isOpen = false;
              // if (item.deviceList && item.deviceList.length > 0) {
              //   this.tempDeviceNumber += item.deviceList.length;
              // }
            })
          }
        })
    },
    // 获取机构下的成员
    getMemberInfo (id, index) {
      if (id) {
        const params = {
          'where.uid': id,
          'where.proKey': this.userInfo.proKey,
          pageSize: 0
        };
        getUserMember(params)
        .then(res => {
          if (res) {
            this.memberListData = res.data.list;
          }
        })
        .catch(() => {})
      }
      this.departmentData[index].isOpen = !this.departmentData[index].isOpen;
      this.departmentData = JSON.parse(JSON.stringify(this.departmentData));
    },
    // 获取所有的用户
    getList () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0
      }
      getUserList(params)
        .then(res => {
          if (res) {
            this.userListData = res.data.list;
            this.getTempDetailDevice(res.data.list[0].uid, 0);
          }
        })
        .catch(() => {})
    },
    // 临时授权---点击左侧授权对象获取设备列表
    getTempDetailDevice (id, index) {
      this.tempDeviceNumber = 0;
      this.tempActiveUser = index;
      this.userId = id;
      if (id) {
        const params = {
          uid: id,
          startTime: this.tempSearchForm.selectTime[0],
          endTime: this.tempSearchForm.selectTime[1],
          authState: this.tempSearchForm.authState,
          type: 2 // 1-机构 2-用户
        };
        getTempDeviceList (params)
          .then(res => {
            if (res) {
              this.tempDeviceList = JSON.parse(JSON.stringify(res.data));
              this.tempDeviceList.map(item => {
                item.isOpenArrow = false;
                if (item.deviceList && item.deviceList.length > 0) {
                  this.tempDeviceNumber += item.deviceList.length;
                }
              })
            }
          })
          .catch(() => {})
      }
    },
    // 临时授权--搜索数据
    tempSearchData () {
      this.getTempDetailDevice(this.userId);
    },
    // 临时授权--重置
    tempResetData() {
      this.tempSearchForm.selectTime = [];
      this.tempSearchForm.authState = 1;
      this.getTempDetailDevice(this.userId);
    },
    // 临时授权--右侧设备展开
    openTempArrow (index) {
      console.log(index)
      this.tempDeviceList[index].isOpenArrow = !this.tempDeviceList[index].isOpenArrow;
      this.tempDeviceList = JSON.parse(JSON.stringify(this.tempDeviceList));
    },
    // 显示单个终止授权弹出框
    showAloneStopTerminateDialog (uid) {
      this.stopGrantId = uid;
      this.stopTitle = '是否终止该设备的临时授权?';
      this.stopGrantDialog = true;
    },
    // 单个设备终止授权
    aloneStopTerminate () {
      const params = {
        uid: this.stopGrantId,
        type: 2, // 1--机构  2--用户
      };
      stopOneTerminate(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '终止成功',
              customClass: 'request_tip'
            });
            this.stopGrantDialog = false;
            this.getTempDetailDevice(this.userId);
          } else {
            this.$message({
              type: 'error',
              message: '终止失败',
              customClass: 'request_tip'
            })
          }
        })
        .catch(() => {})
    },
    // 显示终止授权的弹出框
    showGrantDialog () {
      this.stopTitle = '是否终止对用户的全部临时授权?';
      this.stopGrantDialog = true;
    },
    // 跳至临时授权页面
    skipTempGrantPage () {
      this.$router.push({name: 'add_temp_grant'});
    },
    // 跳至机构授权页面
    skipAuthorizeGrantPage () {
      this.$router.push({name: 'authorize_grant'});
    },
  }
}
</script>
<style lang="scss" scoped>
.device_authorize {
  background-color: #ffffff;
  display: flex;
  height: 100%;
  .device_left {
    width: 260px;
    height: 100%;
    border-right: 1px solid #f2f2f2;
    .au_content_box {
      height: calc(100% - 50px);
      .au_left_content {
        padding: 10px 20px 10px;
        >li {
          line-height: 30px;
          color: #333333;
          .parent_content {
            >span {
              margin-left: 5px;
            }
            &.active_li {
              i, span {
                color: #0C70F8;
              }
            }
          }
          .content_detail {
            color: #666666;
            padding-left: 17px;
          }
        }
      }
    }
    .tab_box {
      >li {
        width: 50%;
        height: 45px;
        line-height: 45px;
        text-align: center;
        cursor: pointer;
        color: #333333;
        display: inline-block;
        border-bottom: 1px solid #f2f2f2;
        &.active {
          color: #0C70F8;
          border-bottom: 2px solid #0C70F8;
        }
      }
    }
    
    .temp_left_content {
      height: calc(100% - 45px);
      .add_btn {
        padding: 10px 20px 10px;
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
      .temp_content_box {
        height: calc(100% - 40px);
        ul {
          >li {
            color: #666666;
            cursor: pointer;
            height: 36px;
            line-height: 36px;
            padding-left: 45px;
            &.active_name {
              background-color: #E0F2FF;
              color: #0C70F8;
            }
          }
        }
      }
    }
  }
  .device_right {
    width: calc(100% - 260px);
    padding: 15px 15px 0;
    .info_top {
      width: 100%;
      >p {
        display: flex;
        align-items: center;
        >span {
         color: #333333;
         font-weight: bold;
         font-size: 20px;
         margin-left: 10px; 
        }
      }
      .stop_btn {
        background-color: #0C70F8;
        color: #ffffff;
        margin-top: 20px;
      }
      .divide {
        margin: 15px 0;
        width: 100%;
        height: 1px;
        background-color: #f2f2f2;
      }
    }
    .all_stop_btn{
      background-color: #0C70F8;
      color: #ffffff;
      // margin-top: 20px;
    }
    .search_box {
      .select_btn {
        width:80px;
        height:40px;
        background:rgba(12,112,248,1);
        border-radius:4px;
        color: #ffffff;
      }
      .reset_btn {
        color: #666666;
        width:80px;
        height:40px;
      }
    }
    .templ_detail_box {
      height: calc(100% - 200px);
      .temp_detail_info {
        width: 100%;
        height: 100%;
        // border-right: 1px solid #f2f2f2;
        margin-top: 10px;
        > li {
          width: 100%;
          cursor: pointer;
          font-size: 14px;
          line-height: 26px;
          color: #333333;
          .parent_temp_li {
            background-color: #F6F6F6;
            padding: 3px 5px;
            i {
              padding: 0 5px;
            }
            &.temp_active {
              i, span {
                color: #0C70F8;
              }
            }
          }
          .child_temp {
            width: 100%;
            .temp_tab {
              color: #666666;
              padding: 10px 10px 0;
              border-bottom: 1px solid #f2f2f2;
              > span {
                width: auto;
                text-align: center;
                display: inline-block;
                line-height: 26px;
                margin: 0 10px;
                &.active_span {
                  color: #0C70F8;
                  border-bottom: 2px solid #0C70F8;
                }
              }
            }
            .child_temp_detail {
              width: 100%;
              >li {
                padding: 10px 15px 10px;
                font-size: 14px;
                color: #666666;
                border-bottom: 1px solid #f2f2f2;
                span {
                  margin-right: 15px;
                }
                i {
                  display: inline-block;
                  vertical-align: middle;
                  &:hover {
                    background-position: -527px -671px;
                  }
                }
                .effect_status {
                  color: #4FCB61;
                }
                .grant_status {
                  color: #F94539;
                }
                .invalid_status {
                  color: #BFBFBF;
                }
              }
              .right_li {
                &:hover {
                  background-color: #E0F2FF;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

