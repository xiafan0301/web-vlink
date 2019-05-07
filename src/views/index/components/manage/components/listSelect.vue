<template>
  <div class="select_list_area">
    <div class="select_list_left">
      <div class="select_top">
        <span>已有设备 ({{leftDeviceNumber}})</span>
        <p @click="removeDevice">移除设备</p>
      </div>
      <template v-if="currentDeviceList && currentDeviceList.length > 0">
        <div class="detail_list">
          <vue-scroll>
            <ul class="temp_detail_info">
              <li v-for="(item, index) in currentDeviceList" :key="'item' + index">
                <div style="display: flex; padding: 0 10px;">
                  <el-checkbox v-model="item.isChecked" style="margin-right: 10px;" @change="handleLeftParentChecked(index, item.isChecked)"></el-checkbox>
                  <div class="parent_temp_li" :class="{'temp_active': item.isOpenArrow === true}" @click="openLeftArrow(index)">
                    <i :class="[item.isOpenArrow === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                    <span>{{item.cname}}</span>
                  </div>
                </div>
                <div class="child_temp" v-show="item.isOpenArrow === true">
                  <div class="temp_tab">
                    <span class="active_span">摄像头</span>
                    <span>卡口</span>
                  </div>
                  <ul class="child_temp_detail">
                    <li v-for="(itm, idx) in item.deviceList" :key="'itm' + idx">
                      <el-checkbox v-model="itm.isChildChecked" @change="handleLeftChildChecked(index, idx, itm.isChildChecked)"></el-checkbox>
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
        <p @click="addDeviceToLeft">添加设备</p>
      </div>
      <template v-if="selectDeviceList && selectDeviceList.length > 0">
        <div class="search_box">
          <el-input placeholder="请输入设备名称" size="small">
            <i v-show="closeShow" slot="suffix" @click="onClear" class="search_icon el-icon-close" style="font-size: 16px;"></i>
            <i
              v-show="!closeShow"
              class="search_icon vl_icon vl_icon_manage_1"
              slot="suffix"
              @click="searchData">
            </i>
          </el-input>
        </div>
        <div class="all_select_checkbox">
          <el-checkbox :value="rightAllChecked" @change="handleAllCheckd">全选</el-checkbox>
        </div>
        <div class="detail_list">
          <vue-scroll>
            <ul class="temp_detail_info">
              <li v-for="(item, index) in selectDeviceList" :key="'item' + index">
                <div style="display: flex; padding: 0 10px;">
                  <el-checkbox v-model="item.isChecked" style="margin-right: 10px;" @change="handleParentChecked(index, item.isChecked)"></el-checkbox>
                  <div class="parent_temp_li" :class="{'temp_active': item.isOpenArrow === true}" @click="openRightArrow(index)">
                    <i :class="[item.isOpenArrow === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                    <span>{{item.cname}}</span>
                  </div>
                </div>
                <div class="child_temp" v-show="item.isOpenArrow === true">
                  <div class="temp_tab">
                    <span class="active_span">摄像头</span>
                    <span>卡口</span>
                  </div>
                  <ul class="child_temp_detail">
                    <li v-for="(itm, idx) in item.deviceList" :key="'itm' + idx">
                      <el-checkbox v-model="itm.isChildChecked" @change="handleChildChecked(index, idx, itm.isChildChecked)"></el-checkbox>
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
  props: [ 'selectDeviceList', 'selectDeviceNumber', 'currentDeviceList', 'rightAllChecked', 'leftDeviceNumber' ],
  data () {
    return {
      arrowActiveLeft: false, // 左侧展开箭头
      closeShow: false,
      checkedDeviceList: [],
      // leftDeviceList: [], // 左侧的设备列表
      // leftDeviceNumber: 0, // 左侧设备数
      finalDeviceList: [], // 最终选择的设备
    }
  },
  mounted () {
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
    // 全选
    handleAllCheckd (val) {
      this.$emit('emitAllChecked', val);
    },
    // 父级多选框change
    handleParentChecked (index, val) {
      this.$emit('emitParentChecked', index, val);
    },
    // 子级多选框change
    handleChildChecked (index, idx, val) {
      this.$emit('emitChildChecked', index, idx, val);
    },
    // 展开右侧列表
    openRightArrow (index) {
      this.$emit('emitOpenRightArrow', index);
    },
    // 左侧---子级多选框change
    handleLeftChildChecked (index, idx, val) {
      this.$emit('emitLeftChildChecked', index, idx, val);
      
    },
    // 左侧---展开左侧列表
    openLeftArrow (index) {
      this.$emit('emitOpenLeftArrow', index);
    },
    // 左侧--父级多选框
    handleLeftParentChecked (index, val) {
      this.$emit('emitLeftParentChecked', index, val);
    },
    // 添加设备
    addDeviceToLeft () {
      let willRemoveDevice = JSON.parse(JSON.stringify(this.selectDeviceList));
      let checkedDeviceList = [], checkedDeviceNumber = 0, selectDeviceNumber = 0;
      for (let len = this.selectDeviceList.length, i = len - 1; i >= 0; i --) {
        if (this.selectDeviceList[i].isChecked === true) {
          checkedDeviceList.push(this.selectDeviceList[i]);
          willRemoveDevice.splice(i, 1);
        } else {
          let params;
          for (let length = this.selectDeviceList[i].deviceList.length, j = length - 1; j >= 0; j --) {
            if (this.selectDeviceList[i].deviceList[j].isChildChecked === true) {
              params = {
                cname: this.selectDeviceList[i].cname,
                uid:this.selectDeviceList[i].uid,
                ctype: this.selectDeviceList[i].ctype,
                deviceList: []
              }
              params.deviceList.push(this.selectDeviceList[i].deviceList[j]);
              checkedDeviceList.push(params);
              willRemoveDevice[i].deviceList.splice(j, 1);
            }
          }
        }
      }
      if (checkedDeviceList && checkedDeviceList.length > 0) {
        checkedDeviceList.map(item => {
          checkedDeviceNumber += item.deviceList.length;
          item.isChecked = false;
          item.isOpenArrow = false;
          item.deviceList.map(itm => {
            itm.isChildChecked = false;
          });
        });
      }
      if (willRemoveDevice && willRemoveDevice.length > 0) {
        willRemoveDevice.map(item => {
          selectDeviceNumber += item.deviceList.length;
          item.isChecked = false;
          item.isOpenArrow = false;
          item.deviceList.map(itm => {
            itm.isChildChecked = false;
          });
        });
      }
      this.$emit('emitFinalDevice', checkedDeviceList, checkedDeviceNumber, willRemoveDevice, selectDeviceNumber);
      
    },
    // 移除设备
    removeDevice () {
      console.log(this.currentDeviceList)
      let currDeviceList = JSON.parse(JSON.stringify(this.currentDeviceList));
      let checkedDeviceNumber = 0, selectDeviceNumber = 0, checkedDeviceList = [];
      if (this.currentDeviceList && this.currentDeviceList.length > 0) {
        for (let len = this.currentDeviceList.length, i = len - 1; i >= 0; i --) {
           if (this.currentDeviceList[i].isChecked === true) {
              checkedDeviceList.push(this.currentDeviceList[i]);
              currDeviceList.splice(i, 1);
            } else {
              let params;
              for (let length = this.currentDeviceList[i].deviceList.length, j = length - 1; j >= 0; j --) {
                if (this.currentDeviceList[i].deviceList[j].isChildChecked == true) {
                  params = {
                    cname: this.currentDeviceList[i].cname,
                    uid: this.currentDeviceList[i].uid,
                    ctype: this.currentDeviceList[i].ctype,
                    deviceList: []
                  }
                  params.deviceList.push(this.currentDeviceList[i].deviceList[j]);
                  checkedDeviceList.push(params);

                  currDeviceList[i].deviceList.splice(idx, 1);

                }
              }
            }
        }
        console.log('currDeviceList', currDeviceList)
        if (currDeviceList && currDeviceList.length > 0) {
          currDeviceList.map(item => {
            checkedDeviceNumber += item.deviceList.length;
            item.isChecked = false;
            item.isOpenArrow = false;
            item.deviceList.map(itm => {
              itm.isChildChecked = false;
            });
          });
        }
        if (checkedDeviceList && checkedDeviceList.length > 0) {
          checkedDeviceList.map(item => {
            selectDeviceNumber += item.deviceList.length;
            item.isChecked = false;
            item.isOpenArrow = false;
            item.deviceList.map(itm => {
              itm.isChildChecked = false;
            });
          });
        }
        this.$emit('emitRemoveFinalDevice', currDeviceList, checkedDeviceNumber, checkedDeviceList, selectDeviceNumber);
      }
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
            // padding: 0 10px;
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
                  margin: 0 80px 0 0;
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
        // margin-right: 35px;
      }
      /deep/ .el-input__suffix {
        right: 48px;
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
            // padding: 0 10px;
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
                  margin: 0 80px 0 0;
                }
              }
            }
          }
        }
      }
    }
  }
  .el-checkbox {
    margin-right: 10px;
  }
}
</style>
