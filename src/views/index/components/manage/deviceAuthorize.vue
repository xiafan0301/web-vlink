<template>
  <div class="device_authorize">
    <div class="device_left">
      <ul class="tab_box">
        <li :class="{'active': tabState === 1}" @click="tabState = 1">机构授权</li>
        <li :class="{'active': tabState === 2}" @click="tabState = 2">临时授权</li>
      </ul>
      <template v-if="tabState === 1">
        <ul class="au_left_content">
          <li>
            <div class="parent_content" :class="{'active_li': arrowActive === true}" @click="arrowActive = !arrowActive">
              <i :class="[arrowActive === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
              <span>所属部门</span>
            </div>
            <template v-if="arrowActive === true">
              <div class="content_detail">
                <p>镇综治中心</p>
                <p>镇综治中心</p>
                <p>镇综治中心</p>
                <p>镇综治中心</p>
                <p>镇综治中心</p>
              </div>
            </template>
          </li>
          <li>
            <div class="parent_content" :class="{'active_li': arrowActive === true}" @click="arrowActive = !arrowActive">
              <i :class="[arrowActive === false ? 'el-icon-arrow-right' : 'el-icon-arrow-down']"></i>
              <span>所属部门</span>
            </div>
            <template v-if="arrowActive === true">
              <div class="content_detail">
                <p>镇综治中心</p>
                <p>镇综治中心</p>
                <p>镇综治中心</p>
                <p>镇综治中心</p>
                <p>镇综治中心</p>
              </div>
            </template>
          </li>
        </ul>
      </template>
      <template v-if="tabState === 2">
        <div class="temp_left_content">
          <div class="add_btn">
            <i class="vl_icon vl_icon_manage_4" @click="skipTempGrantPage"></i>
            <span>临时授权</span>
          </div>
          <ul>
            <li class="active_name">镇综治中心</li>
            <li>镇综治中心</li>
            <li>镇综治中心</li>
            <li>镇综治中心</li>
            <li>镇综治中心</li>
          </ul>
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
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="effect_status">生效中</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="grant_status">已授权</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="invalid_status">已失效</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
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
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="effect_status">生效中</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="grant_status">已授权</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="invalid_status">已失效</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
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
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="effect_status">生效中</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="grant_status">已授权</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="invalid_status">已失效</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
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
            <span>可用设备 (100个)</span>
          </p>
          <div class="search_box" style="margin-top: 15px;">
            <el-date-picker
              style="width: 300px;margin-right: 30px;"
              v-model="value6"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-select v-model="value" placeholder="请选择" style="margin-right: 30px;width: 250px;">
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
          <div class="divide"></div>
        </div>
        <el-button class="all_stop_btn" @click="showGrantDialog">全部终止</el-button>
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
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="effect_status">生效中</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="grant_status">已授权</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="invalid_status">已失效</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
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
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="effect_status">生效中</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="grant_status">已授权</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="invalid_status">已失效</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
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
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="effect_status">生效中</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="grant_status">已授权</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
                    <li>
                      <p>广场监控点1-300</p>
                      <p>
                        <span class="invalid_status">已失效</span>
                        <span class="time"> (2018-1112:00:00至2018-11-21200:00)</span>
                      </p>
                      <i class="vl_icon vl_icon_manage_6"></i>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </vue-scroll>
        </div>
      </div>
    </template>
    <!--全部终止授权弹出框-->
    <el-dialog
      title="是否终止对用户的全部临时授权?"
      :visible.sync="stopGrantDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <div slot="footer" class="dialog-footer">
        <el-button @click="stopGrantDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="stopGrantDialog = false">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value6: null,
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      tabState: 2,
      arrowActive: false, // false-未展开的箭头， true-展开的箭头
      arrowActiveTemp: false,
      stopGrantDialog: false, // 终止授权弹出框
    }
  },
  methods: {
    // 显示终止授权的弹出框
    showGrantDialog () {
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
    border-right: 1px solid #f2f2f2;
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
      >ul {
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
        width: 310px;
        height: 100%;
        border-right: 1px solid #f2f2f2;
        margin-top: 10px;
        > li {
          width: auto;
          cursor: pointer;
          font-size: 16px;
          line-height: 26px;
          color: #333333;
          .parent_temp_li {
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
              margin: 10px 0 10px 40px;
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
              width: 98%;
              >li {
                padding-bottom: 10px;
                font-size: 14px;
                color: #666666;
                position: relative;
                i {
                  position: absolute;
                  right: 0;
                  top: 0;
                }
                .effect_status {
                  color: #4FCB61;
                  font-size: 12px;
                }
                .grant_status {
                  font-size: 12px;
                  color: #F94539;
                }
                .invalid_status {
                  color: #BFBFBF;
                  font-size: 12px;
                }
                .time {
                  font-size: 12px;
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

