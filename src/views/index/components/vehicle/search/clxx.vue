<template>
  <div class="vehicle-info">
    <div class>
      <div
        is="vlBreadcrumb"
        :breadcrumbData="[{name: '车辆侦查', routerName: 'vehicle_menu'},
          {name: '车辆档案'}]"
      ></div>
      <!-- <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>车辆档案</el-breadcrumb-item>
      </el-breadcrumb>-->
    </div>
    <div class="vehicle-info-content">
      <!-- 搜索条件 -->
      <div class="info-left">
        <vue-scroll>
          <!-- 车牌号搜索 -->
          <div class="license-plate-search">
            <el-input v-model="searchData.licensePlateNum" placeholder="请输入车牌号码搜索" clearable></el-input>
          </div>
          <!-- 时间 -->
          <div class="time-search date-comp">
            <el-date-picker
              class="vl_date"
              v-model="searchData.time"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
            ></el-date-picker>
          </div>
          <div class="search-btn">
            <el-button @click="resetSearch">重置</el-button>
            <el-button type="primary" :loading="searching" @click="search">查询</el-button>
          </div>
        </vue-scroll>
      </div>
      <!-- 车辆信息 -->
      <div class="info-right" v-loading="searching">
        <vue-scroll>
          <div class="info-r-content">
            <!-- 车辆信息 -->
            <div class="info-card">
              <p class="card-header">车辆信息</p>
              <div class="card-row">
                <div class="card-item">
                  <label class="title">车牌号牌：</label>
                  <span>{{vehicleArch.plateno}}</span>
                </div>
                <div class="card-item">
                  <label class="title">车辆所有人：</label>
                  <span>{{vehicleArch.owner}}</span>
                </div>
                <div class="card-item">
                  <label class="title">中文品牌：</label>
                  <span>{{vehicleArch.brand}}</span>
                </div>
                <div class="card-item">
                  <label class="title">车身颜色：</label>
                  <span>{{vehicleArch.color}}</span>
                </div>
                <div class="card-item">
                  <label class="title">车身形式：</label>
                  <span>{{vehicleArch.bodyform}}</span>
                </div>
                <div class="card-item">
                  <label class="title">车门数：</label>
                  <span>{{vehicleArch.doornumber}}</span>
                </div>
                <div class="card-item">
                  <label class="title">发动机号：</label>
                  <span>{{vehicleArch.engineno}}</span>
                </div>
                <div class="card-item">
                  <label class="title">车辆类型：</label>
                  <span>{{vehicleArch.platetype}}</span>
                </div>
                <div class="card-item">
                  <label class="title">年款：</label>
                  <span>{{vehicleArch.model}}</span>
                </div>
                <div class="card-item">
                  <label class="title">座位数：</label>
                  <span>{{vehicleArch.seatnumber}}</span>
                </div>
                <div class="card-item">
                  <label class="title">车辆状态：</label>
                  <span>{{vehicleArch.status}}</span>
                </div>
                <div class="card-item">
                  <label class="title">使用性质：</label>
                  <span>{{vehicleArch.usecharacter}}</span>
                </div>
                <div class="card-item">
                  <label class="title">车型：</label>
                  <span>{{vehicleArch.vehicletype}}</span>
                </div>
                <div class="card-item">
                  <label class="title">厂商名称：</label>
                  <span>{{vehicleArch.vendor}}</span>
                </div>
                <div class="card-item">
                  <label class="title">有效期止：</label>
                  <span>{{vehicleArch.validuntil}}</span>
                </div>
              </div>
            </div>
            <!-- 违章信息 -->
            <div class="info-card">
              <p class="card-header">违章信息</p>
              <div class="table_box">
                <el-table :data="regulationsList">
                  <el-table-column label="序号" type="index" width="100"></el-table-column>
                  <el-table-column label="违法时间" prop="vioDate" show-overflow-tooltip></el-table-column>
                  <el-table-column label="违法地点" prop="address" show-overflow-tooltip></el-table-column>
                  <!-- <el-table-column label="城市名称" prop="city" show-overflow-tooltip></el-table-column> -->
                  <el-table-column label="罚款金额" prop="fine" show-overflow-tooltip></el-table-column>
                  <el-table-column label="违章归属地" prop="vioAsPlace" show-overflow-tooltip></el-table-column>
                  <el-table-column label="违法行为" prop="vioName" show-overflow-tooltip></el-table-column>
                  <el-table-column label="分类类型" prop="vioCategory" show-overflow-tooltip></el-table-column>
                  <el-table-column label="采集机关" prop="vioCollectionOffice" show-overflow-tooltip></el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </vue-scroll>
      </div>
    </div>
  </div>
</template>
<script>
import { getArchives, getViolation } from "../../../api/api.analysis.js";
import { formatDate } from "@/utils/util.js";
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
export default {
  components: { vlBreadcrumb },
  data() {
    return {
      searchData: {
        //搜索参数
        time: null,
        licensePlateNum: null // 车牌号
      },
      pickerOptions: {
        disabledDate(time) {
          /*  let date = new Date();
          let y = date.getFullYear();
          let m =
            date.getMonth() + 1 < 10
              ? "0" + (date.getMonth() + 1)
              : date.getMonth() + 1;
          let d = date.getDate();
          let threeMonths = "";
          let start = "";
          if (parseFloat(m) >= 4) {
            start = y + "-" + (m - 3) + "-" + d;
          } else {
            start = y - 1 + "-" + (m - 3 + 12) + "-" + d;
          }
          threeMonths = new Date(start).getTime(); */
          return time.getTime() > Date.now();
        }
      },
      searching: false,
      regulationsList: [], //违章信息列表
      vehicleArch: {} //车辆档案
    };
  },
  computed: {},
  mounted() {
    if (this.$route.query.plateNo) {
      this.searchData.licensePlateNum = this.$route.query.plateNo;
    }
    this.setDTime();
    this.getSearchData();
  },
  methods: {
    // 验证车牌号方法
    checkPlateNumber(value) {
      let reg = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/;
      if (value) {
        if (!reg.test(value)) {
          if (!document.querySelector(".el-message")) {
            this.$message.info("请正确输入车牌号码");
          }
          return false;
        } else {
          return true;
        }
      } else {
        if (!document.querySelector(".el-message")) {
          this.$message.info("请输入车牌号码");
        }
        return false;
      }
    },
    //设置默认时间
    setDTime() {
      let date = new Date();
      let curDate = date.getTime();
      let curS = 30 * 24 * 3600 * 1000;
      let _s =
        new Date(curDate - curS).getFullYear() +
        "-" +
        (new Date(curDate - curS).getMonth() + 1) +
        "-" +
        new Date(curDate - curS).getDate();
      let _e =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      this.searchData.time = [_s, _e];
    },
    //重置
    resetSearch() {
      this.searchData.licensePlateNum = null;
      this.vehicleArch = {};
      this.regulationsList = [];
      this.setDTime();
    },
    //查询
    search() {
      if (this.checkPlateNumber(this.searchData.licensePlateNum)) {
        this.getSearchData();
      }
    },
    getSearchData() {
      let params = {};
      if (this.searchData.time && this.searchData.time.length > 0) {
        params["dateStart"] =
          formatDate(this.searchData.time[0], "yyyy-MM-dd") + " 00:00:00";
        params["dateEnd"] =
          formatDate(this.searchData.time[1], "yyyy-MM-dd") + " 23:59:59";
      }
      if (this.searchData.licensePlateNum) {
        params["plateNo"] = this.searchData.licensePlateNum;
      } else {
        return false;
      }
      console.log("======getSearchData=====", this.searchData, params);
      this.getVehicle(params);
      this.getViolationList(params);
    },
    //获取车辆档案
    getVehicle(params) {
      const query = {
        plateNo: params.plateNo
      };
      this.searching = true;
      getArchives(query)
        .then(res => {
          console.log("0000000000", res);
          if (res && res.data) {
            this.vehicleArch = res.data;
          }
          this.$nextTick(() => {
            this.searching = false;
          });
        })
        .catch(error => {
          this.searching = false;
          console.log(error);
        });
    },
    //获取违章信息
    getViolationList(params) {
      this.regulationsList = [];
      this.searching = true;
      getViolation(params)
        .then(res => {
          console.log("----getViolation----", res);
          if (res && res.data) {
            this.regulationsList = res.data;
          }
          this.$nextTick(() => {
            this.searching = false;
          });
        })
        .catch(error => {
          this.searching = false;
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.vehicle-info {
  height: calc(100% - 50px);
  .breadcrumb_heaer {
    background: #fff;
  }
  .vehicle-info-content {
    height: 100%;
    display: flex;
    border-top: 1px solid #d3d3d3;
    .info-left {
      width: 272px;
      padding: 20px 0 20px 20px;
      color: #999;
      background: #fff;
      box-shadow: 5px 0px 16px 0px rgba(169, 169, 169, 0.2);
      animation: fadeInLeft 0.4s ease-out 0.3s both;
      .tip {
        margin-bottom: 36px;
      }
      //车牌号搜索
      .license-plate-search {
        width: 232px;
        margin-bottom: 10px;
      }
    }
    .info-right {
      width: calc(100% - 272px);
      height: 100%;
      padding: 20px 0 20px 20px;
      .info-r-content {
        height: 100%;
        padding-right: 20px;
        .info-card {
          width: 100%;
          background: #fff;
          box-shadow: 5px 0px 16px 0px rgba(169, 169, 169, 0.2);
          border-radius: 4px;
          margin-bottom: 20px;
          .card-header {
            font-size: 16px;
            height: 55px;
            line-height: 55px;
            border-bottom: 1px solid #f2f2f2;
            color: #333;
            padding-left: 20px;
          }
          .card-row {
            display: flex;
            flex-wrap: wrap;
            padding-left: 20px;
            padding-bottom: 20px;
            .card-item {
              color: #666;
              width: 25%;
              margin-top: 16px;
              .title {
                width: 98px;
                display: inline-block;
                text-align: right;
              }
              .upload_box {
                width: 415px;
                display: flex;
                flex-wrap: wrap;
                .img-box {
                  position: relative;
                  .play_icon {
                    position: absolute;
                    cursor: pointer;
                    top: 25%;
                    left: 28%;
                    border-radius: 50%;
                    background: #000;
                    opacity: 0.6;
                    width: 40px;
                    height: 40px;
                    .play_btn {
                      margin-left: 37%;
                      margin-top: 22%;
                    }
                  }
                  img {
                    border: 1px solid #ccc;
                    width: 100px;
                    height: 100px;
                    border-radius: 4px;
                    margin: 0 5px 5px 0;
                    cursor: pointer;
                  }
                }
              }
            }
            .vehicle-img {
              display: flex;
              width: 100%;
            }
          }
          .table_box {
            padding: 20px 20px 0;
          }
          .yearly-inspection {
            padding: 20px;
            .title {
              color: #666;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.vehicle-info {
  //时间搜索
  .time-search {
    margin-bottom: 10px;
    .el-date-editor--daterange.el-input,
    .el-date-editor--daterange.el-input__inner,
    .el-date-editor--timerange.el-input,
    .el-date-editor--timerange.el-input__inner {
      width: 232px;
    }
  }
  //搜索按钮
  .search-btn {
    width: 232px;
    text-align: center;
    .el-button {
      width: 45%;
    }
    .el-button--primary {
      background-color: #0c70f8;
      border-color: #0c70f8;
    }
  }
  //弹窗
  .history-pic-dialog {
    .el-dialog {
      max-width: 12.6rem;
      width: 100% !important;
    }
    .el-dialog__title {
      font-size: 0.16rem;
      color: #333333;
    }
    .el-dialog__body {
      padding: 0 0.76rem 0.3rem;
    }
    .his-pic-box {
      width: 100%;
      height: 4.6rem !important;
      .his-pic-item {
        float: left;
        width: 1.38rem;
        height: 1.38rem;
        border: 0.02rem solid #ffffff;
        margin-right: 0.2rem;
        margin-bottom: 0.2rem;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .active {
        border-color: #0c70f8;
      }
    }
    .el-dialog__footer {
      button {
        width: 1.4rem !important;
        height: 0.4rem;
        line-height: 0.4rem;
        padding: 0;
      }
    }
  }
  .__view {
    width: 100% !important; // vue-scroll样式重置
  }
}
</style>
