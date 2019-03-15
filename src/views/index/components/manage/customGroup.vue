<template>
  <div class="custom_group">
    <div class="custom_group_left">
      <div class="search_box">
        <el-input  placeholder="搜索组" size="small" style="width: 220px;">
          <i
          class="search_icon vl_icon vl_icon_manage_1"
          slot="suffix"
          @click="handleIconClick">
        </i>
        </el-input>
      </div>
      <div class="add_btn">
        <i class="vl_icon vl_icon_manage_4" @click="skipAddGroupPage"></i>
        <span>新增分组</span>
      </div>
      <div class="content_box">
        <vue-scroll>
          <ul class="temp_detail_info">
            <li>
              <div class="parent_temp_li" :class="{'temp_active': arrowActiveTemp === true}" @click="arrowActiveTemp = !arrowActiveTemp">
                <i :class="[arrowActiveTemp === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                <span>重点场所</span>
                <i class="operation_btn del_btn vl_icon vl_icon_manage_8"></i>
                <i class="operation_btn edit_btn vl_icon vl_icon_manage_7"></i>
              </div>
              <div class="child_temp" v-show="arrowActiveTemp">
                <div class="temp_tab">
                  <span class="active_span">摄像头</span>
                  <span>卡口</span>
                </div>
                <ul class="child_temp_detail">
                  <li>
                    <span>广场监控点1-300</span>
                  </li>
                  <li>
                    <span>广场监控点1-300</span>
                  </li>
                  <li>
                    <span>广场监控点1-300</span>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div class="parent_temp_li" :class="{'temp_active': arrowActiveTemp === true}" @click="arrowActiveTemp = !arrowActiveTemp">
                <i :class="[arrowActiveTemp === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                <span>其他自定义</span>
                <i class="operation_btn vl_icon vl_icon_manage_8"></i>
                <i class="operation_btn vl_icon vl_icon_manage_7"></i>
              </div>
              <div class="child_temp" v-show="arrowActiveTemp">
                <div class="temp_tab">
                  <span class="active_span">摄像头</span>
                  <span>卡口</span>
                </div>
                <ul class="child_temp_detail">
                  <li>
                    <span>广场监控点1-300</span>
                  </li>
                  <li class="isProhibit">
                    <span>广场监控点1-300</span>
                  </li>
                  <li>
                    <span>广场监控点1-300</span>
                  </li>
                  <li>
                    <span>广场监控点1-300</span>
                  </li>
                  <li>
                    <span>广场监控点1-300</span>
                  </li>
                  <li>
                    <span>广场监控点1-300</span>
                  </li>
                  <li>
                    <span>广场监控点1-300</span>
                  </li>
                  <li>
                    <span>广场监控点1-300</span>
                  </li>
                  <li>
                    <span>广场监控点1-300</span>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div class="parent_temp_li" :class="{'temp_active': arrowActiveTemp === true}" @click="arrowActiveTemp = !arrowActiveTemp">
                <i :class="[arrowActiveTemp === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                <span>重点场所</span>
                <i class="operation_btn vl_icon vl_icon_manage_8"></i>
                <i class="operation_btn vl_icon vl_icon_manage_7"></i>
              </div>
              <div class="child_temp" v-show="arrowActiveTemp">
                <div class="temp_tab">
                  <span class="active_span">摄像头</span>
                  <span>卡口</span>
                </div>
                <ul class="child_temp_detail">
                  <li>
                    <span>广场监控点1-300</span>
                    <!-- <i class="vl_icon vl_icon_manage_6"></i> -->
                  </li>
                  <li>
                    <span>广场监控点1-300</span>
                    <!-- <i class="vl_icon vl_icon_manage_6"></i> -->
                  </li>
                  <li>
                    <span>广场监控点1-300</span>
                    <!-- <i class="vl_icon vl_icon_manage_6"></i> -->
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </vue-scroll>
      </div>
    </div>
    <div class="custom_group_right">
      <div class="no_data">
        <i class="vl_icon_manage_9 vl_icon"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      arrowActiveTemp: false,
      groupData: [
        {
          groupName: '常用点位',
          deviceList: [
            {
              name: '广场监控点1-300',
              isProhibit: false
            }
          ]
        },
        {
          groupName: '常用点位',
          deviceList: [
            {
              name: '广场监控点1-300',
              isProhibit: false
            }
          ]
        },
        {
          groupName: '常用点位',
          deviceList: [
            {
              name: '广场监控点1-300',
              isProhibit: false
            }
          ]
        }
      ], // 所有的组名数据
    }
  },
  methods: {
    handleIconClick () {},
    // 跳至新增分组页面
    skipAddGroupPage () {
      this.$router.push({name: 'add_group'});
    },
  }
}
</script>
<style lang="scss" scoped>
.custom_group {
  background-color: #ffffff;
  height: 100%;
  display: flex;
  .custom_group_left {
    height: 100%;
    width: 260px;
    border-right: 1px solid #F2F2F2;
    .search_box {
      padding: 15px;
      /deep/ .el-input--small .el-input__inner {
        border-radius: 40px;
        background-color: #F2F2F2;
        color: #999999;
      }
      .search_icon{
        margin-top: 8px;
        cursor: pointer; 
      }
    }
    .add_btn {
      padding: 15px;
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
    .content_box {
      height: calc(100% - 120px);
      .temp_detail_info {
        height: 100%;
        border-right: 1px solid #f2f2f2;
        > li {
          width: auto;
          cursor: pointer;
          font-size: 14px;
          line-height: 26px;
          color: #333333;
          .parent_temp_li {
            padding: 0 10px;
            >span {
              margin-left: 5px;
            }
            .operation_btn {
              display: none;
              float: right;
              margin: 5px 5px 0;
            }
            .del_btn {
              &:hover {
                background-position: -694px -350px !important;
              }
            }
            .edit_btn {
              &:hover {
                background-position: -584px -350px !important;
              }
            }
            &.temp_active {
              &:hover {
                background-color: #E0F2FF;
                .operation_btn {
                  display: block;
                }
              }
              i, span {
                color: #0C70F8;
              }
            }
          }
          .child_temp {
            width: 100%;
            .temp_tab {
              color: #666666;
              margin: 10px 0 10px 20px;
              font-size: 12px;
              width: 220px;
              height: 26px;
              border: 1px solid #D3D3D3;
              border-radius:4px;
              > span {
                width: 50%;
                text-align: center;
                display: inline-block;
                line-height: 26px;
                height: 100%;
                &.active_span {
                  color: #0C70F8;
                  background-color: #E0F2FF;
                }
              }
              span:first-child {
                border-right: 1px solid #D3D3D3;
              }
            }
            .child_temp_detail {
              padding-left: 30px;
              padding-right: 10px;
              >li {
                padding-bottom: 10px;
                font-size: 14px;
                color: #666666;
                display: flex;
                align-items: center;
                justify-content: space-between;
              }
              .isProhibit {
                color: #DFDFDF;
              }
            }
          }
        }
      }
    }
  }
  .custom_group_right {
    width: calc(100% - 260px);
    .no_data {
      width: 186px;
      height: 196px;
      margin-left: 40%;
      margin-top: 15%;
    }
  }
}
</style>

