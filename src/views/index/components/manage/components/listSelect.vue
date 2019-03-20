<template>
  <div class="select_list_area">
    <div class="select_list_left">
      <div class="select_top">
        <span>已有设备 (12)</span>
        <p>移除设备</p>
      </div>
      <template v-if="currentDeviceList.length > 0">
        <div class="detail_list">
          <vue-scroll>
            <ul class="temp_detail_info">
              <li v-for="(item, index) in currentDeviceList" :key="'item' + index">
                <div class="parent_temp_li" :class="{'temp_active': arrowActiveLeft === true}" @click="arrowActiveLeft = !arrowActiveLeft">
                  <el-checkbox style="margin-right: 10px;"></el-checkbox>
                  <i :class="[arrowActiveLeft === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                  <span>{{item.cname}}</span>
                </div>
                <div class="child_temp" v-show="arrowActiveLeft">
                  <div class="temp_tab">
                    <span class="active_span">摄像头</span>
                    <span>卡口</span>
                  </div>
                  <ul class="child_temp_detail">
                    <li v-for="(itm, idx) in item.deviceList" :key="'itm' + idx">
                      <el-checkbox></el-checkbox>
                      <span>{{itm.deviceName}}</span>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </vue-scroll>
        </div>
      </template>
    </div>
    <div class="select_list_right">
      <div class="select_top">
        <span>可选设备 ({{selectDeviceNumber}})</span>
        <p>添加设备</p>
      </div>
      <template v-if="selectDeviceList.length > 0">
        <div class="search_box">
          <el-input placeholder="请输入设备名称" size="small">
            <i v-show="closeShow" slot="suffix" @click="onClear" class="search_icon el-icon-close" style="font-size: 16px;margin-right: 5px"></i>
            <i
              v-show="!closeShow"
              class="search_icon vl_icon vl_icon_manage_1"
              slot="suffix"
              @click="searchData">
            </i>
          </el-input>
        </div>
        <div class="all_select_checkbox">
          <el-checkbox>全选</el-checkbox>
        </div>
        <div class="detail_list">
          <vue-scroll>
            <ul class="temp_detail_info">
              <li v-for="(item, index) in selectDeviceList" :key="'item' + index">
                <span>{{item.isOpenArrow}}</span>
                <div class="parent_temp_li" :class="{'temp_active': item.isOpenArrow === true}" @click="item.isOpenArrow = !item.isOpenArrow">
                  <el-checkbox style="margin-right: 10px;"></el-checkbox>
                  <i :class="[item.isOpenArrow === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                  <span>{{item.cname}}</span>
                </div>
                <div class="child_temp" v-show="item.isOpenArrow === true">
                  <div class="temp_tab">
                    <span class="active_span">摄像头</span>
                    <span>卡口</span>
                  </div>
                  <ul class="child_temp_detail">
                    <li v-for="(itm, idx) in item.deviceList" :key="'itm' + idx">
                      <el-checkbox></el-checkbox>
                      <span>{{itm.deviceName}}</span>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </vue-scroll>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props: [ 'selectDeviceList', 'selectDeviceNumber', 'currentDeviceList' ],
  data () {
    return {
      arrowActiveRight: -1, // 右侧展开箭头
      arrowActiveLeft: false, // 左侧展开箭头
      arrowActiveTemp: false,
      closeShow: false,
    }
  },
  methods: {
    // 清空搜索框
    onClear () {
      this.closeShow = false;
    },
    // 搜索设备
    searchData () {
      this.closeShow = true;
    },
    // 展开右侧列表
    openRightArrow (index) {
      this.arrowActiveRight = index;
    }
  }
}
</script>
<style lang="scss">
.select_list_area {
  width: 100%;
  display: flex;
  height: 490px;
  border-top: 1px solid #f2f2f2;
  .select_list_left {
    width: 300px;
    height: 100%;
    border-right: 1px solid #F2F2F2;
    .select_top {
      display: flex;
      justify-content: space-between;
      height: 45px;
      line-height: 45px;
      padding: 0 10px;
      border-bottom: 1px solid #F2F2F2;
      >span {
        color: #333333;
      }
      >p {
        color: #B2B2B2;
        cursor: pointer;
      }
    }
    .detail_list {
      height: calc(100% - 60px);
      z-index: 0;
      margin: 10px 10px;
      .temp_detail_info {
        height: 100%;
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
                >span {
                  margin: 0 80px 0 15px;
                }
              }
            }
          }
        }
      }
    }
  }
  .select_list_right {
    width: 300px;
    height: 100%;
    border-right: 1px solid #F2F2F2;
    .select_top {
      display: flex;
      justify-content: space-between;
      height: 45px;
      line-height: 45px;
      padding: 0 10px;
      border-bottom: 1px solid #F2F2F2;
      >span {
        color: #333333;
      }
      >p {
        color: #B2B2B2;
        cursor: pointer;
      }
    }
    .search_box {
      margin: 4px 10px;
      /deep/ .el-input--small .el-input__inner {
        width: 220px;
        border-radius: 40px;
        background-color: #F2F2F2;
        color: #999999;
      }
      .search_icon{
        margin-top: 8px;
        cursor: pointer; 
        margin-right: 35px;
      }
    }
    .all_select_checkbox {
      padding: 10px 20px 0;
    }
    .detail_list {
      height: calc(100% - 140px);
      margin: 10px 10px;
      .temp_detail_info {
        height: 100%;
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
                >span {
                  margin: 0 80px 0 15px;
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
