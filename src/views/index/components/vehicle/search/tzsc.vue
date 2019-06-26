<template>
  <!-- 特征搜车 -->
  <div class="tzsc_wrap">
    <!-- 面包屑通用样式 -->
    <div class="link_bread">
      <el-breadcrumb separator=">" class="bread_common">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">侦查</el-breadcrumb-item>
        <el-breadcrumb-item>特征搜车</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="sc_content">
      <!-- 通用的左边菜单 -->
      <div class="left_menu">
        <!-- 菜单表单 -->
        <vue-scroll>
          <div style="padding: 20px;">
            <!-- 选择搜车的类型 -->
            <div class="select_type">
              <el-radio-group v-model="selectType">
                <el-radio :label="1">从图片提取</el-radio>
                <el-radio :label="2">自定义特征</el-radio>
              </el-radio-group>
            </div>

            <div v-show="selectType === 1">
              <!-- 上传车像图片 -->
              <div class="upload_warp"></div>
              <!-- 检索结果 -->
              <div class="characteristic">
                <div class="btn">获取特征</div>
                <div class="characteristic_list"></div>
              </div>
            </div>

            <!-- 表单 -->
            <el-form :model="tzscMenuForm" ref="tzscMenuForm" :rules="rules">
              <!-- 自定义特征 -->
              <div v-show="selectType === 2">
                <el-form-item label="号牌类型" label-width="90px" prop>
                  <el-select v-model="tzscMenuForm.licenseType" class="width132" placeholder="选择选项">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="号牌颜色" label-width="90px" prop>
                  <el-select
                    v-model="tzscMenuForm.licenseColor"
                    class="width132"
                    placeholder="选择选项"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车辆类型" label-width="90px" prop>
                  <el-select v-model="tzscMenuForm.carType" class="width132" placeholder="选择选项">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车辆颜色" label-width="90px" prop>
                  <el-select v-model="tzscMenuForm.carColor" class="width132" placeholder="选择选项">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车辆型号" label-width="90px" prop>
                  <el-select v-model="tzscMenuForm.carModel" class="width132" placeholder="选择选项">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="遮阳板" label-width="90px" prop>
                  <el-select v-model="tzscMenuForm.sunVisor" class="width132" placeholder="选择选项">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="年检标数量" label-width="90px" prop>
                  <el-select
                    v-model="tzscMenuForm.inspectionCount"
                    class="width132"
                    placeholder="选择选项"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <el-form-item label prop="selectDate">
                <el-date-picker
                  v-model="tzscMenuForm.selectDate"
                  type="date"
                  class="width232"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label prop="selectDevice">
                <el-select v-model="tzscMenuForm.selectDevice" class="width232" placeholder="选择设备">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>

            <!-- 按钮样式 -->
            <div class="btn_warp">
              <el-button class="reset_btn">重置</el-button>
              <el-button class="select_btn">确定</el-button>
            </div>
          </div>
        </vue-scroll>
      </div>
      <!-- 通用的右边列表 -->
      <div class="right_img_list">
        <!-- 排序和结果 -->
        <div class="result_sort">
          <h3 class="result">检索结果（{{ strucInfoList.length }}）</h3>
          <div class="sort">
            <div class="sort_item" :class="{ 'active_sort': sortType === 1 }" @click="clickTime">
              时间排序
              <i
                :class="{'el-icon-arrow-down': timeSortType, 'el-icon-arrow-up': !timeSortType }"
              ></i>
            </div>
            <div
              class="sort_item"
              :class="{ 'active_sort': sortType === 2 }"
              @click="clickVideo"
            >监控排序</div>
          </div>
        </div>
        <!-- 图片列表 -->
        <div class="img_list">
          <vue-scroll>
            <div class="img_item" v-for="(item, index) in strucInfoList" :key="'img_list' + index">
              <div class="img_wrap">
                <img src="../../../../../assets/img/not-content.png">
              </div>
              <div class="text_wrap">
                <h3 class="text_name">检索资料</h3>
                <div class="text_message">{{item.time}}</div>
                <div class="text_message">{{item.video}}</div>
              </div>
            </div>
          </vue-scroll>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectType: 1,
      sortType: 1, // 1为时间排序， 2为监控排序
      timeSortType: true, // true为时间正序， false为时间倒序
      // 菜单表单变量
      tzscMenuForm: {
        selectDate: "",
        selectDevice: "",
        licenseType: "",
        licenseColor: "",
        carType: "",
        carColor: "",
        carModel: "",
        sunVisor: "",
        inspectionCount: ""
      },
      rules: {},
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        }
      ],
      stucOrder: 2, // 1升序，2降序，3监控，4相似度
      strucInfoList: [
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002"
        },
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002"
        },
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002"
        },
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002"
        },
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002"
        },
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002"
        },
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002"
        },
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002"
        },
        {
          time: "18-12-27  15:46:07",
          video: "环保路摄像头002"
        }

      ] // 检索列表数据
    };
  },
  methods: {
    clickTime() {
      if (this.sortType === 1) {
        this.timeSortType = !this.timeSortType;
      } else if (this.sortType === 2) {
        this.sortType = 1;
      }
    },
    clickVideo() {
      this.sortType = 2;
    }
  }
};
</script>
<style lang="scss" scoped>
.tzsc_wrap {
  height: 100%;
  position: relative;
  // 面包屑样式
  .link_bread {
    height: 60px;
    background: #fff;
    .bread_common {
      padding: 23px 0 0 20px;
    }
  }
  // 搜车主体页面
  .sc_content {
    height: calc(100% - 60px);
    overflow: hidden;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    // 左边菜单样式
    .left_menu {
      width: 272px;
      position: relative;
      background: #fff;
      box-shadow: 2px 3px 10px 0px rgba(131, 131, 131, 0.28);
      height: 100%;
      // padding: 20px;
      // 菜单的表单
      .width232 {
        width: 232px;
      }
      .width132 {
        width: 132px;
      }
      // 选择搜车类型
      .select_type {
        padding-bottom: 20px;
      }
      // 特征
      .characteristic {
        margin: 10px 0 38px 0;
        border-bottom: 1px solid #d3d3d3;
        .btn {
          line-height: 30px;
          height: 30px;
          background: #f2f2f2;
          border: 1px solid #d3d3d3;
          border-radius: 4px;
          text-align: center;
          color: #666666;
        }
        .characteristic_list {
          min-height: 40px;
        }
      }
      // 按钮
      .btn_warp {
        .select_btn {
          background: #0c70f8;
          color: #ffffff;
          width: 110px;
        }
        .reset_btn {
          background: #ffffff;
          border: 1px solid #dddddd;
          color: #666666;
          width: 110px;
        }
      }
      // 上传
      .upload_warp {
        height: 232px;
        background: #f2f2f2;
        border-radius: 10px;
      }
    }
    // 右边图片列表
    .right_img_list {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      overflow: hidden;
      position: relative;
      height: 100%;
      padding: 24px 20px 20px 20px;
      // 检索结果与排序
      .result_sort {
        overflow: hidden;
        .result {
          font-size: 14px;
          color: #666;
          float: left;
        }
        .sort {
          font-size: 14px;
          width: 220px;
          height: 14px;
          margin: 0 auto;
          .sort_item {
            text-align: center;
            width: 110px;
            float: left;
            color: #999;
            cursor: pointer;
          }
          .active_sort {
            color: #2580fc;
            i {
              color: #2580fc;
            }
          }
        }
      }
      // 图片列表
      .img_list {
        height: calc(100% - 19px);
        .img_item {
          width: 330px;
          padding: 20px;
          margin: 20px 20px 0 0;
          background: #fff;
          overflow: hidden;
          float: left;
          // 图片包裹
          .img_wrap {
            width: 118px;
            height: 118px;
            float: left;
            position: relative;
            img {
              width: 100%;
              height: 100%;
              display: block;
            }
          }
          // 文字的包裹
          .text_wrap {
            padding-left: 8px;
            float: left;
            // 标题
            .text_name {
              font-size: 14px;
              color: #999;
              padding-bottom: 5px;
            }
            // 检索的资料信息
            .text_message {
              margin-top: 8px;
              padding: 0 12px;
              font-size: 12px;
              line-height: 26px;
              height: 26px;
              background: #fafafa;
              border: 1px solid #f2f2f2;
              border-radius: 3px;
            }
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
</style>
