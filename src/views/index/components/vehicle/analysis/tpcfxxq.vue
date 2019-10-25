<template>
  <div class="tpcfxxq">
    <div class="ccrc_breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }"><span style="color: #999999">车辆侦查</span></el-breadcrumb-item>
        <el-breadcrumb-item>套牌车分析</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tpcfxxq_content">
      <div class="tpcfxxq_content_cl">
        <div style="padding: 10px 20px; border-bottom: 1px solid #F2F2F2">车辆登记信息</div>
        <div class="cei_pai">{{this.$route.query.vehicleNumber}}</div>
        <div style="display: inline-block; line-height: 40px">
          <el-button type="primary" style="width: 80px" @click="serchtpc">查询</el-button>
        </div>
      </div>
      <div class="tpcfxxq_content_tp">
        <div style="padding: 10px 20px; border-bottom: 1px solid #F2F2F2">套牌拽拍信息</div>
        <div class="th-ycxc-record">
          <div class="th-ycxc-record-list">
            <div class="list-box">
              <div class="list-item" v-for="(item, index) in regulationsList" :key="item.uid" @click="onOpenDetail(index)">
                <img :src="item.vehicleDto.StorageUrl1" alt="">
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
    <div is="vehicleDetail" :detailData="detailData"></div>
  </div>
</template>

<script>
import {JtcPOSTAppendtpInfo} from '../../../api/api.judge.js';
import vehicleDetail from '../common/vl-dialog.vue';
import { formatDate } from "@/utils/util.js";
export default {
  name: "tpcfxxq",
  components: {
    vehicleDetail
  },
  data () {
    return {
      regulationsList: [],
      detailData: null,
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      currentPage: 1,
    }
  },
  created() {
  },
  mounted () {
    this.getViolationList()
  },
  methods: {
    serchtpc () {
      this.$router.push({ name: "vehicle_search_tpc" , query: {value1: formatDate(this.$route.query.value1), value2: formatDate(this.$route.query.value2), vehicleNumber: this.$route.query.vehicleNumber}});
    },
    getViolationList() {
      let params = {}
      params['startDate'] =formatDate(this.$route.query.value1)
      params['endDate'] = formatDate(this.$route.query.value2)
      params['pageNum'] = this.pagination.pageNum
      params['pageSize'] = this.pagination.pageSize
      params['vehicleNumber'] = this.$route.query.vehicleNumber
      JtcPOSTAppendtpInfo(params).then(res => {
        console.log("----getViolation----", params)
        if(res && res.data) {
          this.regulationsList = res.data.list
          this.pagination.total = res.data.total
        }
        this.$nextTick(() => {
        })
      }).catch( error => {
        console.log(error);
      })
    },
    /**
     * 分页赋值
     */
    onPageChange (page) {
      this.pagination.pageNum = page;
      this.getViolationList()
    },
    onOpenDetail (index) {
      let list = this.regulationsList.map((item)=>{
        return item.vehicleDto
      })
      console.log(this.regulationsList)
      this.detailData = {
        index: index,
        list: list,
        pageNum: this.pagination.pageNum
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .tpcfxxq{
   height: 100%;
    .ccrc_breadcrumb{
      background-color: white;
      padding: 23px 20px;
      border-bottom: 2px solid #F7F9F9;
    }
    .tpcfxxq_content{
      padding: 20px;
      height: calc(100% - 62px);
      overflow: auto;
      .tpcfxxq_content_cl{
        height:169px;
        background:rgba(255,255,255,1);
        box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
        border-radius:4px;
        .cei_pai{
          border: 1px solid #D3D3D3; width:232px; height: 40px; background:#F2F2F2; border-radius:4px; line-height: 40px;
          padding-left: 20px;
          margin: 20px 20px 0 25px;
          display: inline-block;
        }
      }
      .tpcfxxq_content_tp{
        margin-top: 20px;
        background:rgba(255,255,255,1);
        box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
        border-radius:4px;
      }
    }
    .th-ycxc-record {
      padding-top: 20px;
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
            margin-bottom: 15px;
            background: #fff;
            margin-left: 1.25%;
            padding-bottom: 15px;
            border: 1px solid #D3D3D3;
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
              padding: 10px 0 5px 10px;
              display: flex;
              font-size: 0.14rem;
              align-items: center;
              i {
                background: url("../../../../../assets/img/the-time.png") no-repeat;
                background-size: 15px 15px;
              }
            }
            .address {
              padding-left: 10px;
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
              padding-left: 10px;
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
  }
</style>