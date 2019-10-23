<template>
<vue-scroll>
  <div class="add_patrol">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manage/videoSetting/customGroup' }">视频设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/videoSetting/deviceAuthorize' }">设备授权</el-breadcrumb-item>
        <el-breadcrumb-item>管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_box">
      <div class="content_new_group">
        <el-form :inline="true" :model="addForm" class="search_form">
          <el-form-item label="授权对象:">
            <el-select  style="width: 500px;" v-model="addForm.eventType" placeholder="行政区划">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="content_main_box">
        <p>授权范围:</p>
        <div
          is="mapSelector"
          ref="addTGrantSelctor"
          :filter="1"
          isNotDialog
          :open="openMap"
          :clear="msClear"
          :showTypes="'DB'"
          :activeDeviceList="currentDeviceList"
        ></div>
        <!-- <div class="main_tab_box">
          <ul class="tab_list">
            <li :class="{'active_li': tabState === 1}" @click="tabState = 1">地图选择</li>
            <li :class="{'active_li': tabState === 2}" @click="tabState = 2">列表选择</li>
          </ul>
          <div class="search_box">
            <el-form :inline="true" :model="searchForm" class="search_form" ref="searchForm">
              <el-form-item prop="intelCharac">
                <el-select  style="width: 200px;" v-model="searchForm.intelCharac" placeholder="智能特性">
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
                <el-select  style="width: 200px;" v-model="searchForm.groupId" placeholder="自定义组">
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
                <el-select  style="width: 200px;" v-model="searchForm.dutyOrganId" placeholder="责任部门">
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
                <el-button class="reset_btn" @click="resetData('searchForm')">重置</el-button>
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
            ></listSelect>
          </template>
        </div> -->
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn function_btn" @click="submitData">保存</el-button>
      <el-button class="operation_btn back_btn" @click="cancelSubmit">取消</el-button>
    </div>
  </div>

</vue-scroll>
</template>
<script>
// import listSelect from './components/listSelect.vue';
// import mapSelect from './components/mapSelect.vue';
// import { dataList } from '@/utils/data.js';
// import { getDiciData } from '@/views/index/api/api.js';
// import { getDepartmentList, getCusGroup, getAllDevices } from '@/views/index/api/api.manage.js';
import mapSelector from '@/components/common/mapSelector.vue';
export default {
  components: { mapSelector },
  data () {
    return {
      openMap: true,
      msClear: {},
      // tabState: 1, // 地图选择
      addForm: {
        eventType: null,
        eventStatus: null,
        reportTime: null,
      },
      // searchForm: {
      //   igroupId: '全部分组', // 分组id
      //   intelCharac: '全部特性', // 智能特性
      //   dutyOrganId: '全部部门', // 责任部门id
      //   devName: null // 设备名称
      // },
      // userInfo: {}, // 存储的用户信息
      // allDeviceList: [], // 所有设备列表数据
      // selectDeviceList: [], // 可选设备列表
      // selectDeviceNumber: 0, // 可选设备数量
      alcurrentDeviceList: [],
      currentDeviceList: [], // 已有的设备数据
      // rightAllChecked: false, // 右侧设备全部选中
      // leftDeviceNumber: 0, // 左侧设备数量
      // intelCharacList: [], // 智能特性列表
      // groupsList: [], // 所有的自定义分组列表
      // allDepartmentData: [], // 所有的责任部门列表
    }
  },
  created () {
    this.userInfo =  this.$store.state.loginUser;
  },
  mounted () {
    // this.getDepartList();
    // this.getAllDevicesList();
    // this.getGroups();
    // this.getIntelCharacList();
  },
  methods: {
    
    // 提交数据
    submitData () {

    },
    // 取消提交
    cancelSubmit () {

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
    .content_alert {
      margin: 0 20px;
      padding: 15px 0 0;
      .alert_tip {
        color: #333333;
        background:rgba(230,247,255,1);
        border-radius:4px;
        border:1px solid rgba(186,231,255,1);
        /deep/ .el-icon-info:before {
          color: #0C70F8;
        }
      }
    }
    .content_new_group {
      padding: 20px 20px 0;
      display: flex;
      align-items: center;
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
