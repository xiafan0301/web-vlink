<template>
  <div class="select_list_area">
    <div class="select_list_left">
      <div class="select_top">
        <span>已有设备 ({{leftDeviceNumber}})</span>
        <p @click="removeDevice">移除设备</p>
      </div>
      <template v-if="leftDeviceList.length > 0">
        <div class="detail_list">
          <vue-scroll>
            <ul class="temp_detail_info">
              <li v-for="(item, index) in leftDeviceList" :key="'item' + index">
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
  props: [ 'selectDeviceList', 'selectDeviceNumber', 'currentDeviceList', 'leftAllChecked', 'rightAllChecked' ],
  data () {
    return {
      arrowActiveLeft: false, // 左侧展开箭头
      closeShow: false,
      leftDeviceList: [], // 左侧的设备列表
      leftDeviceNumber: 0, // 左侧设备数
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
      console.log('00000')
      this.$emit('emitOpenRightArrow', index);
    },
    // 左侧---子级多选框change
    handleLeftChildChecked (index, idx, val) {
      this.leftDeviceList[index].deviceList[idx].isChildChecked = val;
      // 过滤出子级选中的
      let checkedArr = this.leftDeviceList[index].deviceList.filter((item) => {
        return item.isChildChecked === true;
      })
      if (checkedArr.length === 0) { // 没有选中的
        this.leftDeviceList[index].isChecked = false;
      }
      if (checkedArr.length === this.leftDeviceList[index].deviceList.length) { // 全选
        this.leftDeviceList[index].isChecked = true;
      }
      if (checkedArr.length === 0 || checkedArr.length < this.leftDeviceList[index].deviceList.length) {
        // this.rightAllChecked = false;
        this.leftDeviceList[index].isChecked = false;
      }

      // this.leftDeviceList = JSON.parse(JSON.stringify(this.leftDeviceList));
      // 过滤出父级中没有选中
      let checkedParentArr = this.leftDeviceList.filter(itm => {
        return itm.isChecked === false;
      });
    },
    // 左侧---展开左侧列表
    openLeftArrow (index) {
      console.log('33333')
      this.leftDeviceList[index].isOpenArrow = !this.leftDeviceList[index].isOpenArrow;
      console.log(this.selectDeviceList)
      // this.allDeviceList = JSON.parse(JSON.stringify(this.allDeviceList));
    },
    // 左侧--父级多选框
    handleLeftParentChecked (index, val) {
      this.leftDeviceList[index].isChecked = val;
      this.leftDeviceList[index].deviceList.map(item => {
        item.isChildChecked = val;
      });
      // this.leftDeviceList = JSON.parse(JSON.stringify(this.leftDeviceList)); // 必须放在过滤父级的上面，因为先要更新在过滤
      // 过滤出父级中没有选中
      let checkedParentArr = this.leftDeviceList.filter(itm => {
        return itm.isChecked === false;
      });
    },
    // 添加设备
    addDeviceToLeft () {
      let allDeviceList = JSON.parse(JSON.stringify(this.selectDeviceList));
      this.leftDeviceList = [];
      this.leftDeviceNumber = 0;
      allDeviceList.map(item => {
        if (item.isChecked === true) {
          this.leftDeviceList.push(item);
        } else {
          item.deviceList.map(itm => {
            if (itm.isChildChecked === true) {
              const params = {
                cname: item.cname,
                uid: item.uid,
                ctype: item.ctype,
                deviceList: []
              }
              params.deviceList.push(itm);
              this.leftDeviceList.push(params);
            }
          })
        }
      })
      this.leftDeviceList.map(item => {
        this.leftDeviceNumber += item.deviceList.length;
        item.isChecked = false;
        item.isOpenArrow = false;
        item.deviceList.map(itm => {
          itm.isChildChecked = false;
        })
      })
      this.$emit('emitFinalDevice', this.leftDeviceList);
    },
    // 移除设备
    removeDevice () {
      let removeDeviceList = JSON.parse(JSON.stringify(this.leftDeviceList));
      removeDeviceList.map((item, index) => {
        if (item.isChecked === true) {
          removeDeviceList.splice(index, 1);
        } else {
          item.deviceList.map((itm, idx) => {
            if (itm.isChildChecked === true) {
              item.deviceList[idx].splice(idx, 1);
            }
          });
        }
      });
      this.finalDeviceList = JSON.parse(JSON.stringify(removeDeviceList));
      this.$emit('emitFinalDevice', this.finalDeviceList);
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
