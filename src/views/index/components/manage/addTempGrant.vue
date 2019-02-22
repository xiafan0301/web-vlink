<template>
<vue-scroll>
  <div class="add_patrol">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manage/videoSetting/customGroup' }">视频设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/videoSetting/deviceAuthorize' }">设备授权</el-breadcrumb-item>
        <el-breadcrumb-item>新增临时授权</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_box">
      <div class="content_alert">
        <el-alert class="alert_tip" show-icon :closable="false" title="授权对象必须为本系统的用户，否则无法临时授权！"></el-alert>
      </div>
      <div class="content_new_group">
        <el-form :inline="true" :model="addForm" class="search_form">
          <el-form-item label="授权对象:">
            <el-select  style="width: 500px;" v-model="addForm.eventType" placeholder="行政区划">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="授权时间:">
            <el-date-picker type="date" style='width: 240px;' placeholder="选择日期" v-model="addForm.reportTime" ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="content_main_box">
        <p>授权范围:</p>
        <div class="main_tab_box">
          <ul class="tab_list">
            <li :class="{'active_li': tabState === 1}" @click="tabState = 1">地图选择</li>
            <li :class="{'active_li': tabState === 2}" @click="tabState = 2">列表选择</li>
          </ul>
          <div class="search_box">
            <el-form :inline="true" :model="searchForm" class="search_form">
              <el-form-item>
                <el-select  style="width: 200px;" v-model="searchForm.eventType" placeholder="行政区划">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select  style="width: 200px;" v-model="searchForm.eventStatus" placeholder="智能特性">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select  style="width: 200px;" v-model="searchForm.userName" placeholder="自定义组">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select  style="width: 200px;" v-model="searchForm.userName" placeholder="责任部门">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button class="select_btn">查询</el-button>
                <el-button class="reset_btn">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <template v-if="tabState === 1">
            <mapSelect></mapSelect>
          </template>
          <template v-if="tabState === 2">
            <listSelect></listSelect>
          </template>
        </div>
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn function_btn">保存</el-button>
      <el-button class="operation_btn back_btn">取消</el-button>
    </div>
  </div>

</vue-scroll>
</template>
<script>
import listSelect from './components/listSelect.vue';
import mapSelect from './components/mapSelect.vue';
export default {
  components: {listSelect, mapSelect},
  data () {
    return {
      tabState: 1, // 地图选择
      addForm: {
        eventType: null,
        eventStatus: null,
        reportTime: null,
      },
      searchForm: {
        eventType: null,
        eventStatus: null,
        userName: null
      },
    }
  },
  methods: {
    
  }
}
</script>
<style lang="scss">
.add_patrol {
  height: 100%;
  .content_box {
    width: 98%;
    background-color: #ffffff;
    margin: 0 20px 80px 20px;
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
