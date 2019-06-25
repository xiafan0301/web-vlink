<template>
  <div class="tail_analysis">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>尾随分析</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_box">
      <div class="left">
        <el-form class="left_form" v-model="searchForm" ref="searchForm">
          <el-form-item>
            <el-input type="text" v-model="searchForm.vehicleNo" placeholder="请输入车牌号" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="开始" label-width="20px" class="date_time">
            <el-date-picker
              v-model="searchForm.startTime"
              type="datetime"
              style="width: 100%"
              placeholder="开始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束" label-width="20px" class="date_time">
            <el-date-picker
              v-model="searchForm.endTime"
              style="width: 100%"
              type="datetime"
              placeholder="结束时间"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select placeholder="请选择起点设备" style="width: 100%" v-model="searchForm.deviceList">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select placeholder="请选择尾随车辆类型" style="width: 100%" v-model="searchForm.vehicleType">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select placeholder="请选择尾随时间间隔" style="width: 100%" v-model="searchForm.duration">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button class="reset_btn">重置</el-button>
            <el-button class="select_btn">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <div class="content_top">
          <p>
            <span>查询结果</span>
            <span>（389）</span>
          </p>
          <el-button class="select_btn">导出</el-button>
        </div>
        <div class="result_detail">
          <ul class="clearfix">
            <li>
              <div class="de_left">
                <img src="../../../../../assets/img/temp/vis-eg.png" alt="">
              </div>
              <div class="de_right">
                <span class="title">查询资料</span>
                <p>
                  <span>
                    <i class="vl_icon_tail_2 vl_icon"></i>
                    湘A12345
                  </span>
                  <span class="vehicle_type">轿车</span>
                </p>
                <p>
                  <i class="vl_icon_tail_1 vl_icon"></i>
                  <span>2018-12-12 23:12:34</span>
                </p>
                <div class="record_btn" @click="skipWsReocrdPage">尾随记录</div>
              </div>
            </li>
            <li>
              <div class="de_left">
                <img src="../../../../../assets/img/temp/vis-eg.png" alt="">
              </div>
              <div class="de_right">
                <span class="title">查询资料</span>
                <p>
                  <span>
                    <i></i>
                    湘A12345
                  </span>
                  <span>轿车</span>
                </p>
                <p>
                  <i></i>
                  <span>2018-12-12 23:12:34</span>
                </p>
                <div class="record_btn">尾随记录</div>
              </div>
            </li>
            <li>
              <div class="de_left">
                <img src="../../../../../assets/img/temp/vis-eg.png" alt="">
              </div>
              <div class="de_right">
                <span class="title">查询资料</span>
                <p>
                  <span>
                    <i></i>
                    湘A12345
                  </span>
                  <span>轿车</span>
                </p>
                <p>
                  <i></i>
                  <span>2018-12-12 23:12:34</span>
                </p>
                <div class="record_btn">尾随记录</div>
              </div>
            </li>
            <li>
              <div class="de_left">
                <img src="../../../../../assets/img/temp/vis-eg.png" alt="">
              </div>
              <div class="de_right">
                <span class="title">查询资料</span>
                <p>
                  <span>
                    <i></i>
                    湘A12345
                  </span>
                  <span>轿车</span>
                </p>
                <p>
                  <i></i>
                  <span>2018-12-12 23:12:34</span>
                </p>
                <div class="record_btn">尾随记录</div>
              </div>
            </li>
            <li>
              <div class="de_left">
                <img src="../../../../../assets/img/temp/vis-eg.png" alt="">
              </div>
              <div class="de_right">
                <span class="title">查询资料</span>
                <p>
                  <span>
                    <i class="vl_icon_tail_1 vl_icon"></i>
                    湘A12345
                  </span>
                  <span class="vehicle_type">轿车</span>
                </p>
                <p>
                  <i class="vl_icon_tail_1 vl_icon"></i>
                  <span>2018-12-12 23:12:34</span>
                </p>
                <div class="record_btn" @click="skipWsReocrdPage">尾随记录</div>
              </div>
            </li>
            <li>
              <div class="de_left">
                <img src="../../../../../assets/img/temp/vis-eg.png" alt="">
              </div>
              <div class="de_right">
                <span class="title">查询资料</span>
                <p>
                  <span>
                    <i></i>
                    湘A12345
                  </span>
                  <span>轿车</span>
                </p>
                <p>
                  <i></i>
                  <span>2018-12-12 23:12:34</span>
                </p>
                <div class="record_btn">尾随记录</div>
              </div>
            </li>
            <li>
              <div class="de_left">
                <img src="../../../../../assets/img/temp/vis-eg.png" alt="">
              </div>
              <div class="de_right">
                <span class="title">查询资料</span>
                <p>
                  <span>
                    <i></i>
                    湘A12345
                  </span>
                  <span>轿车</span>
                </p>
                <p>
                  <i></i>
                  <span>2018-12-12 23:12:34</span>
                </p>
                <div class="record_btn">尾随记录</div>
              </div>
            </li>
            <li>
              <div class="de_left">
                <img src="../../../../../assets/img/temp/vis-eg.png" alt="">
              </div>
              <div class="de_right">
                <span class="title">查询资料</span>
                <p>
                  <span>
                    <i></i>
                    湘A12345
                  </span>
                  <span>轿车</span>
                </p>
                <p>
                  <i></i>
                  <span>2018-12-12 23:12:34</span>
                </p>
                <div class="record_btn">尾随记录</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      searchForm: {
        vehicleNo: null,
        deviceList: null,
        startTime: null,
        endTime: null,
        vehicleType: null,
        duration: null
      }
    }
  },
  methods: {
    // 跳至尾随记录页面
    skipWsReocrdPage () {
      console.log('3333')
      this.$router.push({name: 'ws_record'});
    }
  }
}
</script>
<style lang="scss" scoped>
.tail_analysis {
  height: 100%;
  .breadcrumb_heaer {
    background-color: #ffffff;
    border-bottom:1px solid #D3D3D3;
  }
  .content_box {
    width: 100%;
    height: calc(100% - 55px);
    display: flex;
    .left {
      width: 272px;
      height: 100%;
      background-color: #ffffff;
      box-shadow:2px 3px 10px 0px rgba(131,131,131,0.28);
      .left_form {
        width: 100%;
        padding: 15px 20px;
        font-size: 12px !important;
        /deep/ .el-form-item {
          margin-bottom: 15px;
        }
        .date_time {
          /deep/ .el-form-item__label {
            line-height: 20px;
            color: #999999;
          }
        }
      }
    }
    .right {
      width: calc(100% - 272px);
      padding: 10px 15px;
      .content_top {
        display: flex;
        justify-content: space-between;
        >p {
          span:first-child {
            color: #333333;
          }
          span:last-child {
            color: #666666;
          }
        }
      }
      .result_detail {
        width: 100%;
        >ul {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          margin-top: 15px;
          >li {
            background-color: #ffffff;
            height: 180px;
            width: 375px;
            max-width: 32%;
            display: flex;
            justify-content: space-between;
            padding: 20px;
            margin-right: 8px;
            margin-bottom: 20px;
            box-shadow: 0px 5px 16px 0px #A9A9A9;
            .de_left {
              width: 50%;
              img {
                width: 140px;
                height: 140px;
              }
            }
            .de_right {
              width: 50%;
              line-height: 30px;
              .title {
                color: #999999;
              }
              > p {
                // width:186px;
                // height:26px;
                margin-bottom: 10px;
                padding-left: 5px;
                background:rgba(250,250,250,1);
                border:1px solid rgba(242,242,242,1);
                border-radius:3px;
                color: #333333;
                font-size: 12px;
                i {
                  margin-right: 5px;
                }
                .vehicle_type {
                  margin-left: 10px;
                }
              }
              .record_btn {
                width:80px;
                height:30px;
                background:rgba(246,248,249,1);
                border:1px solid rgba(211,211,211,1);
                border-radius:4px;
                text-align: center;
                cursor: pointer;
                &:hover {
                  background-color: #ffffff;
                  color: #0C70F8;
                  border-color: #0C70F8;
                }
              }
            }
          }
        }
      }
    }
  }
  .reset_btn {
    width: 110px;
    background-color: #D3D3D3;
    color: #666666;
    border-radius: 4px;
    &:hover {
      background-color: #ffffff;
      color: #0C70F8;
      border-color: #0C70F8;
    }
  }
  .select_btn {
    width: 110px;
    background-color: #0C70F8;
    color: #ffffff;
    border-radius: 4px;
  }
}
</style>