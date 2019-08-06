<template>
  <div class="tpc">
    <div class="ccrc_breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }"><span style="color: #999999">车辆侦查</span></el-breadcrumb-item>
        <el-breadcrumb-item>套牌车分析</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="ccrc_content">
      <div class="ccrc_content_left">
        <div>
          <el-date-picker
              v-model="value1"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm:ss"
              class="full vl_date"
              @change="changval1"
              style="width: 230px; vertical-align: top"
              default-time="00:00:00"
              type="datetime"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="jiesu">
          <el-date-picker
              v-model="value2"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 230px; vertical-align: top"
              class="full vl_date vl_date_end"
              type="datetime"
              default-time="23:59:59"
              :picker-options="pickerOptions"
              placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="kaishi">
          <el-input v-model.trim="searchData.licensePlateNum" placeholder="请输入车牌号码搜索" clearable></el-input>
        </div>
        <div class="kaishi" style="padding-top: 20px">
          <el-button style="width: 110px" @click="rester">重置</el-button>
          <el-button type="primary" style="width: 110px" @click="search" :loading="searchLoading">查询</el-button>
        </div>
      </div>
      <div class="ccrc_content_right" v-if="regulationsList.length > 0" v-loading="searchLoading">
        <!--        <div class="clearfix">-->
        <!--          <div style="padding: 10px 0; float: right">-->
        <!--            <el-button type="primary" style="width: 110px">导出</el-button>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="ccrc_content_right_content">
          <div class="title">车辆登记信息</div>
          <div class="ccrc_content_right_table">
            <div>
              <div style="width: 70px" class="smalltitle">
                号牌号码：
              </div>
              <div class="ttt-1">{{vehicleArch.plateno}}</div>
            </div>
            <div>
              <div style="width: 80px; white-space:nowrap;" class="smalltitle">
                车辆所有人：
              </div>
              <div class="ttt-2">{{vehicleArch.owner}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                中文品牌：
              </div>
              <div class="ttt-2">{{vehicleArch.brand}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                车身颜色：
              </div>
              <div class="ttt-2">{{vehicleArch.color}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                车身形式：
              </div>
              <div class="ttt-2">{{vehicleArch.bodyform}}</div>
            </div>
            <div>
              <div style="width: 86px; white-space:nowrap" class="smalltitle">
                车门数：
              </div>
              <div class="ttt-2">{{vehicleArch.doornumber}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                发动机号：
              </div>
              <div class="ttt-2">{{vehicleArch.engineno}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                车辆类型：
              </div>
              <div class="ttt-2">{{vehicleArch.platetype}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                年款：
              </div>
              <div class="ttt-2">{{vehicleArch.model}}</div>
            </div>
            <div>
              <div style="width: 86px; white-space:nowrap" class="smalltitle">
                座位数：
              </div>
              <div class="ttt-2">{{vehicleArch.seatnumber}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                车辆状态：
              </div>
              <div class="ttt-2">{{vehicleArch.status}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                使用性质：
              </div>
              <div class="ttt-2">{{vehicleArch.usecharacter}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                车型：
              </div>
              <div class="ttt-2">{{vehicleArch.vehicletype}}</div>
            </div>
            <div>
              <div style="width: 86px; white-space:nowrap" class="smalltitle">
                厂商名称：
              </div>
              <div class="ttt-2">{{vehicleArch.vendor}}</div>
            </div>
            <div>
              <div style="width: 70px; white-space:nowrap" class="smalltitle">
                有效期止：
              </div>
              <div class="ttt-2">{{vehicleArch.validuntil}}</div>
            </div>
          </div>
        </div>
        <div class="ccrc_content_right_content" style="margin-top: 20px">
          <div class="title">套牌车抓拍信息</div>
          <div class="th-ycxc-record">
            <div class="th-ycxc-record-list">
              <div class="list-box">
                <div class="list-item" v-for="(item, index) in regulationsList" :key="item.uid" @click="onOpenDetail(index)">
                  <img :src="item.vehicleDto.subStoragePath" alt="">
                  <p class="time"><i></i>{{item.vehicleDto.shotTime}}</p>
                  <p class="address"><i></i>{{item.vehicleDto.deviceName}}</p>
                  <p class="address1" style="color: red; padding-top: 5px"><i></i>
                    {{item.fakeReason}}</p>
                </div>
                <el-pagination
                    class="cum_pagination th-center-pagination"
                    v-if ="pagination.total"
                    @current-change="onPageChange"
                    :current-page.sync="currentPage"
                    :page-size="pagination.pageSize"
                    layout="total, prev, pager, next"
                    :total="pagination.total">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="not_content" v-else v-loading="searchLoading">
        <img src="../../../../../assets/img/null-content.png" alt="" v-show="showimgnull">
        <img src="../../../../../assets/img/not-content.png" alt="" v-show="!showimgnull">
        <p style="color: #666666; margin-top: 30px;">{{nodata}}</p>
      </div>
    </div>
    <div is="vehicleDetail" :detailData="detailData"></div>
  </div>
</template>
<script>
import { formatDate } from "@/utils/util.js";
import {getArchives} from '../../../api/api.analysis.js';
import {JtcPOSTAppendtpInfo} from '../../../api/api.judge.js';
import vehicleDetail from '../common/vehicleDetail.vue';
export default {
  components: {
    vehicleDetail
  },
  data () {
    return {

      detailData: null,

      value1: '',
      nodata: '请在左侧输入查询条件',
      showimgnull: true,
      pickerOptions: {
      },
      searchData: {               //搜索参数
        time: [new Date(new Date().getTime() - 24*60*60*1000), new Date(new Date().getTime() - 24*60*60*1000)],
        licensePlateNum: null, // 车牌号
      },
      vehicleArch: {},      //车辆档案
      regulationsList: [],
      value2: '',
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      searchLoading: false,
      currentPage: 1,
      sortTimeType: null, // 时间排序active
      sortMonitoryType: null, // 监控排序active
    }
  },
  created () {
    this.setDTime();
    this.pickerOptions.disabledDate = this.disabledDate;
  },
  mounted() {
    this.setDTime();
    this.pickerOptions.disabledDate = this.disabledDate;
  },
  watch:{
    value1 (val) {
      if (val !== new Date().getTime() - 86400000) {
        this.pickerOptions.disabledDate = this.disabledDate;
      }
    }
  },
  methods: {
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
    changval1 (val) {
      // this.value2 = formatDate(val + 3*24*60*60*1000)
    },
    disabledDate(time) {
      // return  time.getTime() > this.value1 + 3*24*60*60*1000 || time.getTime() < this.value1 - 24*60*60*1000
    },
    setDTime () {
      let date = new Date();
      let curDate = date.getTime();
      let curS = 1 * 24 * 3600 * 1000;
      let sM = '', sD = '';
      if ((new Date(curDate - curS).getMonth() + 1) < 10 ) {
        sM = '0' + (new Date(curDate - curS).getMonth() + 1);
      } else {
        sM = (new Date(curDate - curS).getMonth() + 1)
      }
      if ( new Date(curDate - curS).getDate() < 10 ) {
        sD = '0' +  new Date(curDate - curS).getDate();
      } else {
        sD =  new Date(curDate - curS).getDate()
      }
      let _s = new Date(curDate - curS).getFullYear() + '-' + sM + '-' + sD + ' 00:00:00';
      let _e = new Date(curDate - curS).getFullYear() + '-' + sM + '-' + sD + ' 23:59:59';
      this.value1 = new Date(_s)
      this.value2 = _e
    },
    //查询
    search() {
      if (this.searchData.licensePlateNum){
        this.getSearchData();
      }else{
        this.$message.info("请输入车牌号码");
      }
      // if (this.checkPlateNumber(this.searchData.licensePlateNum)) {
      // }
    },
    getSearchData() {
      let params = {};
      if(this.value1 && this.value2) {
        params['startDate'] = formatDate(this.value1);
        params['endDate'] = this.value2;
        params['pageNum'] = this.pagination.pageNum;
        params['pageSize'] =this.pagination.pageSize;
      }
      if(this.searchData.licensePlateNum) {
        params['vehicleNumber'] = this.searchData.licensePlateNum
        params['plateNo'] = this.searchData.licensePlateNum
      }else {
        return false;
      }
      console.log("======getSearchData=====", this.searchData,params);
      this.getVehicle(params);
      this.getViolationList(params);
    },
    //获取车辆档案
    getVehicle(params) {
      this.searchLoading = true;
      const query = {
        plateNo: params.plateNo
      }
      this.searching = true;
      getArchives(query).then( res => {
        console.log("0000000000",res)
        if(res && res.data) {
          this.vehicleArch = res.data
        }
        this.searchLoading = false;
      }).catch(error => {
        console.log(error);
        this.searchLoading = false;
      })
    },
    getViolationList(params) {
      this.searchLoading = true;
      delete(params.plateNo)
      JtcPOSTAppendtpInfo(params).then(res => {
        console.log("----getViolation----", params)
        if(res && res.data) {
          this.regulationsList = res.data.list
          this.pagination.total = res.data.total
          if (this.regulationsList.length === 0) {
            this.nodata = "抱歉，没有相关结果"
            this.showimgnull = false
          }
        }
        this.$nextTick(() => {
          this.searchLoading = false;
        })
      }).catch( error => {
        console.log(error);
        this.searchLoading = false;

      })
    },
    /**
     * 按照时间排序
     */
    onSortByTime (type) {
      this.sortTimeType = type
    },
    /**
     * 按照监控排序
     */
    onSortByMonitory (type) {
      this.sortMonitoryType = type
    },
    /**
     * 分页赋值
     */
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.search()
    },
    rester() {
      this.setDTime();
      this.searchData.licensePlateNum = null
      this.regulationsList = []
      this.showimgnull = true
    },
    /**
     * 打开抓拍弹框
     */
    onOpenDetail (index) {
      /* pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }, */
      console.log(index)
      let params = {
        startDate: formatDate(this.value1),
        endDate: this.value2,
        vehicleNumber: this.searchData.licensePlateNum
      };
      this.detailData = {
        type: 5, // 5套牌车
        params: params, // 查询参数
        list: this.regulationsList, // 列表
        index: index, // 第几个
        pageSize: this.pagination.pageSize,
        total: this.pagination.total,
        pageNum: this.pagination.pageNum
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .tpc{
    height: 100%;
    .ccrc_breadcrumb{
      background-color: white;
      padding: 23px 20px;
      border-bottom: 2px solid #F7F9F9;
    }
    .ccrc_content{
      display: flex;
      height: calc(100% - 62px);
      .ccrc_content_left{
        height: 100%;
        background-color: white;
        width: 272px;
        padding: 20px;
        box-shadow: 5px 0 10px #E5E7E7;
        .kaishi{
          padding-top: 10px;
        }
        .jiesu{
          padding-top: 10px;
        }
      }
      .ccrc_content_right{
        height: 100%;
        background-color: #F7F9F9;
        width: calc(100% - 282px);
        margin-left: 10px;
        padding: 20px;
        overflow: auto;
        padding-top: 0;
        .ccrc_content_right_content{
          background-color: white;
          box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
          margin-top: 20px;
          .title{
            border-bottom: 1px solid #F2F2F2;
            padding: 20px;
            font-size:16px;
            color: #333333;
            font-weight:bold;
          }
          .ccrc_content_right_table{
            flex-wrap:wrap;
            display: flex;
            padding: 20px;
            >div{
              width: 25%;
              padding-bottom: 20px;
              display: flex;
              .smalltitle{
                text-align: right;
                color: #666666;
              }
              .ttt-1{
                width: calc(100% - 70px);
                word-wrap: break-word
              }
              .ttt-2{
                width: calc(100% - 80px);
                word-wrap: break-word
              }
            }
          }
          .cum_pagination{
            padding-right: 0;
          }
        }
      }
    }
    .not_content{
      width: calc(100% - 282px)!important;
    }
  }
  .th-ycxc-record {
    width: 100%;
    height: 100%;
    .th-ycxc-record-list {
      width: 100%;
      // height: calc(100% - 55px);
      padding: 0 20px;
      background: white;
      .list-box {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        flex-flow: row wrap;
        // height: calc(100% - 45px);
        .list-item {
          width: 19%;
          height: 320px;
          padding: 10px;
          margin-bottom: 15px;
          background: #fff;
          margin-left: 1.25%;
          &:nth-child(5n - 4) {
            margin-left: 0;
          }
          img {
            display: inline-block;
            width: 100%;
            height: calc(100% - 70px);
          }
          p {
            font-size: 14px;
            font-family: 'MicrosoftYaHei';
            font-weight: 500;
            color: #333;
            i {
              color: #999;
              margin-right: 3px;
              display: block;
              width: 15px;
              height: 15px;
            }
          }
          .time {
            padding: 10px 0 5px 0;
            display: flex;
            font-size: 0.14rem;
            align-items: center;
            i {
              background: url("../../../../../assets/img/the-time.png") no-repeat;
              background-size: 15px 15px;
            }
          }
          .address {
            display: flex;
            align-items: center;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 0.14rem;
            i {
              background: url("../../../../../assets/img/the-daynoint.png") no-repeat;
              background-size: 15px 15px;
            }
          }
          .address1 {
            display: flex;
            align-items: center;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 0.14rem;
            i {
              width: 15px;
              height: 15px;
              background: url("../../../../../assets/img/vehicle/chepai.png") no-repeat;
            }
          }
        }
      }
      .th-center-pagination {
        width: 100%;
        text-align: center;
        padding: 0 0 20px 0;
      }
    }
  }
</style>
<style lang="scss">
  .struc_detail_dialog {
    .el-dialog {
      max-width: 13.06rem;
      width: 100%!important;
    }
    .el-dialog__header {
      display: none;
    }
    .struc_tab {
      height: 1.16rem;
      padding: .3rem 0;
      position: relative;
      color: #999999;
      span {
        display: inline-block;
        margin-right: .55rem;
        padding-bottom: .1rem;
        cursor: pointer;
      }
      .active {
        color: #0C70F8;
        border-bottom: 2px solid #0C70F8;
      }
      i {
        display: block;
        position: absolute;
        top: .3rem;
        right: 0px;
        cursor: pointer;
      }
    }
    .struc_main {
      width: 11.86rem;
      height: 4.4rem;
      margin: 0 auto;
      border-bottom: 1px solid #F2F2F2;
      .download_btn {
        display: inline-block;
        width:160px;height:40px;
        background:rgba(246,248,249,1);
        border:1px solid rgba(211,211,211,1);
        border-radius:4px;
        text-align: center;
        line-height: 40px;
        position: absolute;
        top: 4.9rem;
        right: 0.68rem;
        text-decoration: none;
        color: #B2B2B2;
        cursor: pointer;
      }
      .struc_c_detail {
        width:  100%;
        height: 3.6rem;
        >div {
          float: left;
        }
        .struc_c_d_img {
          width: 3.6rem;
          height: 3.6rem;
          background: #EAEAEA;
          position: relative;
          img {
            width: 100%;
            height: auto;
            max-height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
          }
          i {
            display: block;
            position: absolute;
            top: .1rem;
            right: .1rem;
            line-height: .26rem;
            height: .26rem;
            background: rgba(255, 255, 255, .8);
            border-radius: .13rem;
            font-style: normal;
            color: #0C70F8;
            font-size: 12px;
            padding: 0 .1rem;
          }
        }
        .struc_c_d_qj {
          margin-right: .2rem;
          &:before {
            display: block;
            content: '';
            position: absolute;
            top: -.5rem;
            left: -.5rem;
            transform: rotate(-45deg);
            border: .5rem solid #50CC62;
            border-color: transparent transparent #50CC62;
            z-index: 9;
          }
          span {
            display: block;
            position: absolute;
            top: .1rem;
            left: .1rem;
            width: .6rem;
            height: .6rem;
            text-align: center;
            color: #FFFFFF;
            font-size: .12rem;
            -webkit-transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            transform: rotate(-45deg);
            z-index: 99;
          }
        }
        .struc_c_d_qii {
          // margin-right: .3rem;
          &:before {
            display: block;
            content: '';
            position: absolute;
            top: -.5rem;
            left: -.5rem;
            transform: rotate(-45deg);
            border: .5rem solid #0c70f8;
            border-color: transparent transparent #0C70F8;
            z-index: 9;
          }
          span {
            display: block;
            position: absolute;
            top: .1rem;
            left: .1rem;
            width: .6rem;
            height: .6rem;
            text-align: center;
            color: #FFFFFF;
            font-size: .12rem;
            -webkit-transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            transform: rotate(-45deg);
            z-index: 99;
          }
        }
        .struc_c_d_box {
          width: calc(100% - 3.9rem);
          display: flex;
          height: 3.6rem;
          box-shadow: 0px 5px 16px 0px rgba(169,169,169,0.2);
          border-radius: 1px;
          position: relative;
          overflow: hidden;
          &:before {
            display: block;
            content: '';
            position: absolute;
            top: -.5rem;
            left: -.5rem;
            -webkit-transform: rotate(-45deg);
            transform: rotate(-45deg);
            border: .5rem solid #0c70f8;
            border-color: transparent transparent #0C70F8;
            z-index: 9;
          }
          .th-video-text {
            display: block;
            position: absolute;
            top: .08rem;
            left: .08rem;
            width: 0.8rem;
            height: 0.8rem;
            text-align: center;
            color: #FFFFFF;
            font-size: .12rem;
            -webkit-transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            transform: rotate(-45deg);
            z-index: 99;
          }
          > div {
            float: left;
          }
          .struc_c_d_info {
            width: calc(100% - 3.6rem);
            padding-left: .24rem;
            color: #333333;
            h2 {
              font-weight: bold;
              line-height: .74rem;
              padding-right: 1rem;
            }
            .struc_cdi_line {
              span {
                /*position: relative;*/
                max-width: 100%;
                display: inline-block;
                height: .3rem;
                line-height: .3rem;
                margin-bottom: .08rem;
                border: 1px solid #F2F2F2;
                background: #FAFAFA;
                color: #333333;
                white-space: nowrap;
                text-overflow: ellipsis;
                border-radius:3px;
                font-size: 12px;
                overflow: hidden;
                padding: 0 .3rem 0 .1rem;
                margin-right: .08rem;
                > b {
                  color: #999;
                  font-weight: normal;
                  padding-right: 18px;
                }
              }
            }
          }
        }
      }
      .struc_c_address {
        width:  100%;
        height: 100%;
        #container {
          width:  100%;
          height: 100%;
        }
      }
    }
    .struc-list {
      width: 12.46rem;
      margin: 0 auto;
      padding: .44rem 0 .34rem 0;
      .swiper-container {
        padding: .02rem .5rem;
        &:before {
          display: block;
          content: '';
          width: .5rem;
          height: 110%;
          background: #FFFFFF;
          position: absolute;
          left: 0;
          z-index: 9;
          border: 1px solid #FFFFFF;
        }
        &:after {
          display: block;
          content: '';
          width: .5rem;
          height: 110%;
          background: #FFFFFF;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 9;
          border: 1px solid #FFFFFF;
        }
        .swiper-button-next {
          right:  0;
        }
        .swiper-button-prev {
          left: 0;
        }
        .swiper-slide {
          .swiper_img_item {
            cursor: pointer;
            border: 1px solid #FFFFFF;
            padding: 2px;
            .vl_jfo_sim {
              font-size: .14rem;
              height: .3rem;
              margin-top: 0;
              /*display: inline-block;*/
              white-space: nowrap;
              text-align: center;
              color: #999999;
              i {
                margin-right: 0;
              }
            }
          }
          .active {
            border-color: #0C70F8;
            box-shadow: inset 0px 3px 3px #c8c8c8;
            .vl_jfo_sim {
              color: #0C70F8;
            }
          }
        }
      }
    }
  }
  .cap_info_win {
    background: #FFFFFF;
    padding: .18rem;
    font-size: .14rem;
    color: #666666;
    position: relative;
    &:after {
      display: block;
      content: '';
      border: .1rem solid #FFFFFF;
      border-color: #FFFFFF transparent transparent;
      position: absolute;
      bottom: -.2rem;
      left: calc(50% - .05rem);
    }
  }
</style>