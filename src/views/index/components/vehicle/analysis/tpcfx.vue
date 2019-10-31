<template>
  <div class="tpcfx">
    <div class="ccrc_breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }"><span style="color: #999999">车辆侦查</span></el-breadcrumb-item>
        <el-breadcrumb-item>套牌车分析</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tpcfx_bot">
      <div class="tpcfx_left">
        <div style="text-align: center">
          <el-date-picker
              v-model="value1"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              class="full vl_date"
              style="width: 230px; vertical-align: top"
              default-time="00:00:00"
              type="datetime"
              placeholder="请选择开始时间">
          </el-date-picker>
        </div>
        <div style="text-align: center; margin-top: 10px">
          <el-date-picker
              v-model="value2"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              style="width: 230px; vertical-align: top"
              class="full vl_date vl_date_end"
              type="datetime"
              default-time="23:59:59"
              placeholder="请选择结束时间">
          </el-date-picker>
        </div>
        <div style="padding-top: 20px">
          <el-button style="width: 110px" @click="reset">重置</el-button>
          <el-button type="primary" style="width: 110px" @click="serch" :loading="searchLoading">查询</el-button>
        </div>
      </div>
      <div class="tpcfx_right" v-loading="searchLoading" v-if="list.length > 0">
        <div style="font-size:14px;font-weight:400;color:rgba(51,51,51,1); padding: 10px 0 0 10px">套牌车分析({{pagination.total}})</div>
        <div class="tpcfx_right_content">
          <div class="tpcfx_img" v-for="(item, index ) in list" :key="index" @click="godetail(item)">
            <div class="tpcfx_img_1">
              <div style="height: 150px; overflow: hidden;background-color: #EAEAEA; position: relative">
                <img :src="item.StorageUrl1" alt="" title="点击放大图片">
              </div>
              <div style="text-align: center">{{item.PlateNo}}</div>
            </div>
          </div>
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
      <div class="not_content" v-else v-loading="searchLoading">
        <img src="../../../../../assets/img/null-content.png" alt="" v-show="showimgnull">
        <img src="../../../../../assets/img/not-content.png" alt="" v-show="!showimgnull">
        <p style="color: #666666; margin-top: 30px;">{{nodata}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {JtcPOSTAppendtpInfos} from '../../../api/api.judge.js';
import { formatDate } from "@/utils/util.js";
export default {
  name: "tpcfx",
  data () {
    return {
      value1: '2019-08-10 00:00:00',
      value2: '2019-08-10 23:59:59',
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 18,
        total: 0
      },
      currentPage: 1,
      searchLoading: false,
      nodata: '选择分析时间段，查询这段时间内的全部套牌车记录',
      showimgnull: true,
    }
  },
  mounted() {
    this.setDTime();
    // this.JtcPOSTAppendtpInfoss()
  },
  created() {
  },
  methods: {
    reset () {
      this.setDTime()
      this.list = []
      this.showimgnull = true
    },
    godetail (val) {
      this.$router.push({ name: "vehicle_search_tpcfxxq" , query: {value1: this.value1, value2: this.value2, vehicleNumber: val.PlateNo}});
    },
    serch () {
      this.JtcPOSTAppendtpInfoss()
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
      // let _e = new Date(curDate - curS).getFullYear() + '-' + sM + '-' + sD + ' 23:59:59';
      this.value1 = formatDate(_s);
      this.value2 = formatDate(curDate);
    },
    JtcPOSTAppendtpInfoss () {
      let params = {
        endDate: formatDate(this.value2),
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
        startDate: formatDate(this.value1)
      }
      this.searchLoading = true;
      JtcPOSTAppendtpInfos(params).then(res => {
        console.log("----getViolation----", params)
        if(res && res.data) {
          this.list = res.data.list
          this.pagination.total = res.data.total
          if (this.list.length === 0) {
            this.nodata = "抱歉，没有相关结果!"
            this.showimgnull = false
          }
        }
        this.$nextTick(() => {
          this.searchLoading = false;
        })
      }).catch( error => {
        this.searchLoading = false;
        console.log(error);
      })
    },
    /**
     * 分页赋值
     */
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.JtcPOSTAppendtpInfoss()
    },
  },
}
</script>

<style scoped lang="scss">
.tpcfx{
  height: 100%;
  .ccrc_breadcrumb{
    background-color: white;
    padding: 23px 20px;
    border-bottom: 2px solid #F7F9F9;
  }
  .tpcfx_bot{
    display: flex;
    height: calc(100% - 62px);
    .tpcfx_left{
      height: 100%;
      background-color: white;
      width: 272px;
      box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
      padding: 20px;
    }
    .tpcfx_right{
      width: calc(100% - 272px);
      overflow: auto;
      height: 100%;
      .tpcfx_right_content{
        width: 100%;
        padding: 10px 1px;
        display: flex;
        flex-wrap:wrap;
        .tpcfx_img{
          width: 16.6%;
          /*width: 251px;*/
          padding: 10px 8px;
          /*margin: 0 10px;*/
          .tpcfx_img_1{
            background-color: white;
            width: 100%;
            box-shadow:0px -4px 10px 0px rgba(131,131,131,0.28);
            padding: 10px;
            height: 180px;
            img{
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
          }
        }
      }
      .cum_pagination{
        text-align: center;
      }
    }
  }
}
</style>