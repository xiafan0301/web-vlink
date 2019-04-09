<template>
  <div class="alarm_today">
    <!-- 侧边栏搜索框 -->
    <div class="search_box">
      <div class="search_tab">
        <div class="tab_lt">
          <ul>
            <li :class="{'tab_lt_ul_sed': tabType === '1'}" @click="changeTab('1')">监控列表</li>
            <li :class="{'tab_lt_ul_sed': tabType === '2'}" @click="changeTab('2')">布防库</li>
          </ul>
          <div :style="{'left': tabType === '1' ? 0 : '50%'}"></div>
        </div>
      </div>
      <div class="group_input">
        <el-input v-model="groupName" size="small" placeholder="搜索组">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <vue-scroll>
        <div class="add_group">
          <el-tree
            icon-class="el-icon-arrow-right"
            :data="areasList"
            @check="operationChecked"
            @check-change="isNodeChecked"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[]"
            :default-checked-keys="[]"
            :props="defaultProps">
          </el-tree>
        </div>
      </vue-scroll>
      <!-- 组合搜索 -->
      <el-form :model="todayAlarmForm" class="lib_form" ref="todayAlarmForm">
        <el-form-item style="width: 192px;" prop="name">
          <el-input v-model="todayAlarmForm.name" placeholder="输入姓名"></el-input>
        </el-form-item>
        <el-form-item style="width: 192px;" prop="sex">
          <el-select v-model="todayAlarmForm.sex" placeholder="选择性别">
            <el-option
              v-for="item in sexList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 192px;" prop="age">
          <el-select v-model="todayAlarmForm.age" placeholder="选择年龄">
            <el-option
              v-for="item in ageList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-button style="width: 90px;" type="primary" plain @click.native="reset">重置</el-button>
          <el-button style="width: 90px;" type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="alarm_list">
      <div class="list_top">今日告警<span>(23)</span></div>
      <div class="list_content">
        <div class="list_box" v-for="item in '123456'" :key="item">
          <div class="list_img">
            <img src="//via.placeholder.com/140x140" alt="">
            <img src="//via.placeholder.com/140x140" alt="">
            <div class="list_sim">
              <i class="vl_icon vl_icon_alarm_1"></i>
              <div>
                相似<strong>99.12</strong><span>%</span>
              </div>
            </div>
          </div>
          <div class="list_con_info">
            <div>布控人员</div>
            <div>
              <span>摄像头001</span>
              <span>11-12 13:14</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tabType: '1',
      groupName: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      areasList: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      todayAlarmForm: {
        name: null,
        sex: null,
        age: null
      },
      sexList: [],
      ageList: [],
    }
  },
  methods: {
    changeTab (type) {
      this.tabType = type;
    },
    // 重置左侧组合搜索
    reset () {
      this.$refs['todayAlarmForm'].resetFields();
    },
    operationChecked (nede) {},
    // 获得当前节点是否被选中
    isNodeChecked (nede, isChecked) {
      // this.isChecked = isChecked;
    },
  },
}
</script>
<style lang="scss" scoped>
.alarm_today{
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  .search_box{
    position: absolute;
    left: 20px;
    top: 0;
    z-index: 999;
    width: 232px;
    background: #fff;
    box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
    animation: fadeInLeft .4s ease-out .3s both;
    .search_tab{
      position: relative;
      width: 100%; height: 60px;
      box-shadow:4px 0px 10px 0px #838383;
      box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
      background-color: #fff;
      .tab_lt{
        position: absolute; top: 0; left: 0;
        width: 100%;
        border-bottom: 1px solid #F2F2F2;
        > ul {
          overflow: hidden;
          > li {
            float: left;
            width: 50%; height: 50px; line-height: 50px;
            text-align: center;
            font-size: 14px; color: #666666;
            cursor: pointer;
            transition: color .4s ease-out;
            &.tab_lt_ul_sed {
              cursor: default;
              color: #0C70F8;
            }
          }
        }
        > div {
          position: absolute; left: 0; bottom: 0;
          width: 50%; height: 2px;
          background-color: #0C70F8;
          transition: left .3s ease-out;
        }
      }
    }
    .add_group{
      padding: 0 10px 10px;
      max-height: 540px;
    }
    .lib_form{
      margin-top: 30px;
      padding: 40px 20px 0;
      border-top: 1px solid rgba(211,211,211,1);
    }
  }
  .alarm_list{
    height: 100%;
    width: calc(100% - 252px);
    margin-left: 252px;
    position: relative;
    padding: 20px;
    .list_top{
      color: #333;
      > span{
        color: #666;
      }
    }
    .list_content{
      margin: 20px 0;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      .list_box{
        margin: 0 0.5%;
        max-width: 342px;
        width: 32%;
        height: 240px;
        padding: 20px;
        margin-bottom: 20px;
        background:rgba(255,255,255,1);
        box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
        overflow: hidden;
        .list_img{
          width: 100%;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          position: relative;
          padding-bottom: 20px;
          border-bottom: 1px solid #F2F2F2;
          .list_sim{
            position: absolute;
            bottom: 8px;
            left: 50%;
            margin-left: -57px;
            > div{
              position: absolute;
              left: 50%;
              bottom: 8px;
              margin-left: -43px;
              color: #fff;
              font-size:10px;
              font-family:MicrosoftYaHei;
              font-weight:400;
              > strong{
                font-size:18px;
                font-family:AuroraBT-BoldCondensed;
                font-weight:bold;
                color:rgba(255,255,255,1);
              }
              > span{
                font-size:16px;
                font-family:AuroraBT-BoldCondensed;
                font-weight:bold;
                color:rgba(255,255,255,1);
              }
            }
          }
        }
        .list_con_info{
          display: flex;
          justify-content: space-between;
          line-height: 50px;
          > div:nth-child(1){
            color: #333;
          }
          > div:nth-child(2) > span{
            color: #999;
            font-size: 12px;
          }
        }
      }
    }
  }
}
@media (max-width: 1400px) {
  .alarm_today .list_content .list_box{
    width: 49%!important;
  }
}
</style>
<style lang="scss">
.alarm_today{
  .search_box{
    .group_input{
      padding: 20px 10px;
      .el-input__inner{
        width: 212px;
        border-radius: 15px!important;
        background:rgba(242,242,242,1)!important;
        border: none;
      }
    }
    .lib_form .el-form-item{
      margin-bottom: 10px!important;
      .el-range-input{
        width: 62px;
      }
    }
  }
}

</style>
