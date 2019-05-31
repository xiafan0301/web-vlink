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
                    <span :class="[item.isSXT ? 'active_span' : '']" @click="changeLDeviceType(index, true)">摄像头</span>
                    <span :class="[!item.isSXT ? 'active_span' : '']" @click="changeLDeviceType(index, false)">卡口</span>
                  </div>
                  <ul class="child_temp_detail" v-show="item.isSXT">
                    <li v-for="(itm, idx) in item.deviceList" :key="'itm' + idx">
                      <el-checkbox v-model="itm.isChildChecked" @change="handleLeftChildChecked(index, idx, itm.isChildChecked, item.isSXT)"></el-checkbox>
                      <span>{{itm.deviceName}}</span>
                    </li>
                  </ul>
                  <ul class="child_temp_detail" v-show="!item.isSXT">
                    <li v-for="(itm, idx) in item.bayonetList" :key="'itm' + idx">
                      <el-checkbox v-model="itm.isChildChecked" @change="handleLeftChildChecked(index, idx, itm.isChildChecked, item.isSXT)"></el-checkbox>
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
        <div class="search_box">
          <el-input placeholder="请输入设备名称" size="small" v-model="searchDeviceName">
            <i v-show="closeShow" slot="suffix" @click="onClear" class="search_icon el-icon-close" style="font-size: 16px;"></i>
            <i
              v-show="!closeShow"
              class="search_icon vl_icon vl_icon_manage_1"
              slot="suffix"
              @click="searchData">
            </i>
          </el-input>
        </div>
        <template v-if="selectDeviceList && selectDeviceList.length > 0">
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
                      <span :class="[item.isSXT ? 'active_span' : '']" @click="changeRDeviceType(index, true)">摄像头</span>
                      <span :class="[!item.isSXT ? 'active_span' : '']" @click="changeRDeviceType(index, false)">卡口</span>
                    </div>
                    <ul class="child_temp_detail" v-show="item.isSXT">
                      <li v-for="(itm, idx) in item.deviceList" :key="'itm' + idx">
                        <el-checkbox v-model="itm.isChildChecked" @change="handleChildChecked(index, idx, itm.isChildChecked, item.isSXT)"></el-checkbox>
                        <span>{{itm.deviceName}}</span>
                      </li>
                    </ul>
                    <ul class="child_temp_detail" v-show="!item.isSXT">
                      <li v-for="(itm, idx) in item.bayonetList" :key="'itm' + idx">
                        <el-checkbox v-model="itm.isChildChecked" @change="handleChildChecked(index, idx, itm.isChildChecked, item.isSXT)"></el-checkbox>
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
      finalDeviceList: [], // 最终选择的设备
      searchDeviceName: null // 设备名称
    }
  },
  methods: {
    // 清空搜索框
    onClear () {
      this.closeShow = false;
      this.searchDeviceName = null;
      this.$emit('emitSearchData', this.searchDeviceName);
    },
    // 搜索设备
    searchData () {
      this.closeShow = true;
      this.$emit('emitSearchData', this.searchDeviceName);
    },
    // 全选
    handleAllCheckd (val) {
      this.$emit('emitAllChecked', val);
    },
    // 右侧--父级多选框change
    handleParentChecked (index, val) {
      this.$emit('emitParentChecked', index, val);
    },
    // 右侧--子级多选框change
    handleChildChecked (index, idx, val, isSxt) {
      this.$emit('emitChildChecked', index, idx, val, isSxt);
    },
    // 展开右侧列表
    openRightArrow (index) {
      this.$emit('emitOpenRightArrow', index);
    },
    // 左侧---子级多选框change
    handleLeftChildChecked (index, idx, val, isSxt) {
      this.$emit('emitLeftChildChecked', index, idx, val, isSxt);
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
      let checkedDeviceList = [], checkedDeviceNumber = 0, selectDeviceNumber = 0, params;
      // console.log('selectDeviceList', this.selectDeviceList);
      if (this.rightAllChecked) { // 全选
        checkedDeviceList = this.selectDeviceList;
        willRemoveDevice = [];
        this.$emit('emitAllChecked', false); // 将全选赋值为false
      } else {
        for (let len = this.selectDeviceList.length, i = len - 1; i >= 0; i --) {
          if (this.selectDeviceList[i].isChecked === true) {
            checkedDeviceList.push(this.selectDeviceList[i]);
            willRemoveDevice.splice(i, 1);
          } else {
            params = {
              cname: this.selectDeviceList[i].cname,
              uid:this.selectDeviceList[i].uid,
              isSXT: true,
              deviceList: [],
              bayonetList: []
            };
            for (let length = this.selectDeviceList[i].deviceList.length, j = length - 1; j >= 0; j --) {
              if (this.selectDeviceList[i].deviceList[j].isChildChecked === true) {
                params.deviceList.push(this.selectDeviceList[i].deviceList[j]);
                willRemoveDevice[i].deviceList.splice(j, 1);
              }
            }
            for (let length = this.selectDeviceList[i].bayonetList.length, k = length - 1; k >= 0; k --) {
              if (this.selectDeviceList[i].bayonetList[k].isChildChecked === true) {
                params.bayonetList.push(this.selectDeviceList[i].bayonetList[k]);
                willRemoveDevice[i].bayonetList.splice(k, 1);
              }
            }
          }
        }
        if ((params.deviceList && params.deviceList.length !== 0) || (params.bayonetList && params.bayonetList.length !== 0)) {
          checkedDeviceList.push(params);
        }
      }
      if (checkedDeviceList && checkedDeviceList.length > 0) {
        checkedDeviceList.map(item => {
          checkedDeviceNumber += item.deviceList.length;
          checkedDeviceNumber += item.bayonetList.length;
          item.isChecked = false;
          item.isOpenArrow = false;
          item.deviceList.map(itm => {
            itm.isChildChecked = false;
          });
          item.bayonetList.map(itm => {
            itm.isChildChecked = false;
          });
        });
      }
      if (willRemoveDevice && willRemoveDevice.length > 0) {
        willRemoveDevice.map(item => {
          selectDeviceNumber += item.deviceList.length;
          selectDeviceNumber += item.bayonetList.length;
          item.isChecked = false;
          item.isOpenArrow = false;
          item.deviceList.map(itm => {
            itm.isChildChecked = false;
          });
          item.bayonetList.map(itm => {
            itm.isChildChecked = false;
          });
        });
      }
      this.$emit('emitFinalDevice', checkedDeviceList, checkedDeviceNumber, willRemoveDevice, selectDeviceNumber);
    },
    // 移除设备
    removeDevice () {
      let currDeviceList = JSON.parse(JSON.stringify(this.currentDeviceList));
      let checkedDeviceNumber = 0, selectDeviceNumber = 0, checkedDeviceList = [], params;
      if (this.currentDeviceList && this.currentDeviceList.length > 0) {
        for (let len = this.currentDeviceList.length, i = len - 1; i >= 0; i --) {
           if (this.currentDeviceList[i].isChecked === true) {
              checkedDeviceList.push(this.currentDeviceList[i]);
              currDeviceList.splice(i, 1);
            } else {
              params = {
                cname: this.currentDeviceList[i].cname,
                uid: this.currentDeviceList[i].uid,
                isSXT: true,
                deviceList: [],
                bayonetList: []
              }
              for (let length = this.currentDeviceList[i].deviceList.length, j = length - 1; j >= 0; j --) {
                if (this.currentDeviceList[i].deviceList[j].isChildChecked == true) {
                  params.deviceList.push(this.currentDeviceList[i].deviceList[j]);
                  currDeviceList[i].deviceList.splice(j, 1);
                }
              }
              for (let length = this.currentDeviceList[i].bayonetList.length, j = length - 1; j >= 0; j --) {
                if (this.currentDeviceList[i].bayonetList[j].isChildChecked == true) {
                  params.bayonetList.push(this.currentDeviceList[i].bayonetList[j]);
                  currDeviceList[i].bayonetList.splice(j, 1);

                }
              }
              if (params.deviceList.length !== 0 || params.bayonetList.length !== 0) {
                checkedDeviceList.push(params);
              }
            }
        }
        if (currDeviceList && currDeviceList.length > 0) {
          currDeviceList.map(item => {
            checkedDeviceNumber += item.deviceList.length;
            checkedDeviceNumber += item.bayonetList.length;
            item.isChecked = false;
            item.isOpenArrow = false;
            item.deviceList.map(itm => {
              itm.isChildChecked = false;
            });
            item.bayonetList.map(itm => {
              itm.isChildChecked = false;
            });
          });
        }
        if (checkedDeviceList && checkedDeviceList.length > 0) {
          checkedDeviceList.map(item => {
            selectDeviceNumber += item.deviceList.length;
            selectDeviceNumber += item.bayonetList.length;
            item.isChecked = false;
            item.isOpenArrow = false;
            item.deviceList.map(itm => {
              itm.isChildChecked = false;
            });
             item.bayonetList.map(itm => {
              itm.isChildChecked = false;
            });
          });
        }
        this.$emit('emitRemoveFinalDevice', currDeviceList, checkedDeviceNumber, checkedDeviceList, selectDeviceNumber);
      }
    },
    // 切换摄像头和卡口----right
    changeRDeviceType (index, val) {
      this.$emit('emitChangeRDeviceType', index, val);
    },
    // 切换摄像头和卡口----left
    changeLDeviceType (index, val) {
      this.$emit('emitChangeLDeviceType', index, val);
    },
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
            width: 100%;
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
            width: 100%;
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
