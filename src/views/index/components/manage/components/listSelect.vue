<template>
  <div class="select_list_area">
    <div class="select_list_left">
      <div class="select_top">
        <span>已有设备 (12)</span>
        <p>移除设备</p>
      </div>
      <div class="detail_list">
        <vue-scroll>
          <ul class="temp_detail_info">
            <li>
              <div class="parent_temp_li" :class="{'temp_active': arrowActiveLeft === true}" @click="arrowActiveLeft = !arrowActiveLeft">
                <el-checkbox style="margin-right: 10px;"></el-checkbox>
                <i :class="[arrowActiveLeft === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                <span>重点场所</span>
                <i class="del_btn operation_btn vl_icon vl_icon_manage_8"></i>
                <i class="edit_btn operation_btn vl_icon vl_icon_manage_7"></i>
              </div>
              <div class="child_temp" v-show="arrowActiveLeft">
                <div class="temp_tab">
                  <span class="active_span">摄像头</span>
                  <span>卡口</span>
                </div>
                <ul class="child_temp_detail">
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </vue-scroll>
      </div>
    </div>
    <div class="select_list_right">
      <div class="select_top">
        <span>可选设备 (12)</span>
        <p>添加设备</p>
      </div>
      <div class="search_box">
        <el-input placeholder="请输入设备名称" size="small">
          <i
          class="search_icon vl_icon vl_icon_manage_1"
          slot="suffix"
          @click="handleIconClick">
        </i>
        </el-input>
      </div>
      <div class="all_select_checkbox">
        <el-checkbox>全选</el-checkbox>
      </div>
      <div class="detail_list">
        <vue-scroll>
          <ul class="temp_detail_info">
            <li>
              <div class="parent_temp_li" :class="{'temp_active': arrowActiveRight === true}" @click="arrowActiveRight = !arrowActiveRight">
                <el-checkbox style="margin-right: 10px;"></el-checkbox>
                <i :class="[arrowActiveRight === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                <span>重点场所</span>
                <i class="del_btn operation_btn vl_icon vl_icon_manage_8"></i>
                <i class="edit_btn operation_btn vl_icon vl_icon_manage_7"></i>
              </div>
              <div class="child_temp" v-show="arrowActiveRight">
                <div class="temp_tab">
                  <span class="active_span">摄像头</span>
                  <span>卡口</span>
                </div>
                <ul class="child_temp_detail">
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div class="parent_temp_li" :class="{'temp_active': arrowActiveRight === true}" @click="arrowActiveRight = !arrowActiveRight">
                <el-checkbox style="margin-right: 10px;"></el-checkbox>
                <i :class="[arrowActiveRight === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                <span>重点场所</span>
                <i class="del_btn operation_btn vl_icon vl_icon_manage_8"></i>
                <i class="edit_btn operation_btn vl_icon vl_icon_manage_7"></i>
              </div>
              <div class="child_temp" v-show="arrowActiveRight">
                <div class="temp_tab">
                  <span class="active_span">摄像头</span>
                  <span>卡口</span>
                </div>
                <ul class="child_temp_detail">
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div class="parent_temp_li" :class="{'temp_active': arrowActiveRight === true}" @click="arrowActiveRight = !arrowActiveRight">
                <el-checkbox style="margin-right: 10px;"></el-checkbox>
                <i :class="[arrowActiveRight === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
                <span>重点场所</span>
                <i class="del_btn operation_btn vl_icon vl_icon_manage_8"></i>
                <i class="edit_btn operation_btn vl_icon vl_icon_manage_7"></i>
              </div>
              <div class="child_temp" v-show="arrowActiveRight">
                <div class="temp_tab">
                  <span class="active_span">摄像头</span>
                  <span>卡口</span>
                </div>
                <ul class="child_temp_detail">
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                  <li>
                    <el-checkbox></el-checkbox>
                    <span>广场监控点1-300</span>
                    <i class="vl_icon vl_icon_manage_6"></i>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </vue-scroll>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      arrowActiveRight: false,
      arrowActiveLeft: false,
      arrowActiveTemp: false,
    }
  },
  methods: {
    handleIconClick () {}
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
      // border-top: 1px solid #F2F2F2;
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
                i:hover {

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
      // border-top: 1px solid #F2F2F2;
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
