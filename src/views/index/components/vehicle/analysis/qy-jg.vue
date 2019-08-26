<template>
  <div class="vehicle_content">
    <div class="vc_gcck_bd" is="vehicleBreadcrumb" :oData="[{name: '区域碰撞', routerName: 'vehicle_search_qy'}, {name: '碰撞结果'}]"></div>
    <div class="the-right-result">
      <div class="vc_main_left">
        <vue-scroll>
          <div class="vc_l_sup_m">
            <h5 class="">车辆列表</h5>
            <p @click="leftActive = -1" :class="{'active': leftActive === -1}">全部</p>
            <ul>
              <li :class="{'active': leftActive === index}" v-for="(item, index) in leftList" :key="item.id" @click="leftActive = index">{{item.vehicleNumber}}</li>
            </ul>
          </div>
        </vue-scroll>
      </div>
      <div class="vl_s_right">
        <div class="vl_jig_right">
          <div class="vl_jig_right_title">
            <div class="vl_jr_t_item">
              <span><span style="color: #333333">共有过车数据</span> ({{pagination.total}}) 条 </span>
              <div :class="{'active-item': stucOrder < 3}" @click="timeOrderS">时间排序 <span><i :class="{'active': stucOrder === 2}" class="el-icon-caret-top"></i><i :class="{'active': stucOrder === 1}" class="el-icon-caret-bottom"></i></span></div>
            </div>
            <div class="vl_jr_t_item">
              <div :class="{'active-item': stucOrder === 3}" @click="stucOrder = 3">监控排序</div>
            </div>
          </div>
          <div class="vl_jfo_event">
            <vue-scroll>
              <div class="vl_jfo_event_box clearfix">
                <div class="vl_jfo_box_item" v-for="(item, index) in strucInfoList" :key="item.id" @click="showStrucInfo(item, index)">
                  <img :src="item.subStoragePath" alt="">
                  <p class="time"><i></i>{{item.shotTime}}</p>
                  <p class="address"><i></i>抓拍设备:{{item.bayonetName ? item.bayonetName : item.deviceName}}</p>
                </div>
              </div>
              <el-pagination
                v-show="pagination.total > 10"
                style="text-align: center"
                background
                @current-change="handleCurrentChange"
                :current-page="pagination.pageNum"
                :page-size="pagination.pageSize"
                layout="prev, pager, next"
                :total="pagination.total">
              </el-pagination>
            </vue-scroll>
          </div>
        </div>
      </div>
    </div>
    <div is="vlDialog" :detailData="detailData"></div>
  </div>
</template>
<script>
  import vlDialog from '../common/vl-dialog.vue';
  import vehicleBreadcrumb from '../breadcrumb.vue';
  import {QypzGetAreaCross} from '@/views/index/api/api.judge.js'
  export default {
    components: {vehicleBreadcrumb, vlDialog},
    data () {
      return {
        firstIn: true,
        stucOrder: 2, // 1升序，2降序，3监控，4相似度
        pagination: { total: 0, pageSize: 10, pageNum: 1 },
        leftList: [],
        strucInfoList: [], // 检索抓拍信息
        leftActive: -1, // -1全部
        detailData: null
      }
    },
    computed: {
    },
    mounted () {
      this.getTheList();
    },
    methods: {
      getTheList () {
        this.$_showLoading({target: '.vl_jig_right'})
        let params = this.$route.query;
        params.pageNum = this.pagination.pageNum;
        params.pageSize = this.pagination.pageSize;
        params.order = this.stucOrder === 2 ? "desc" : "asc";
        params.orderBy= "shotTime";
        if (this.leftActive !== -1) {
          params.where['vehicleNumber'] =  this.leftList[this.leftActive].vehicleNumber;
        } else {
          params.where['vehicleNumber'] =  '';
        }
        QypzGetAreaCross(params).then(res => {
          this.$_hideLoading();
          if (res) {
            if(res.data.total === 0 && this.firstIn) {
              this.$message.info('抱歉，没有找到匹配结果');
              this.$router.push({name: "vehicle_search_qy"})
            }
            this.firstIn = false;
            this.strucInfoList = res.data.list[0].struVehicleDtoList;
            this.leftList = res.data.list[0].vehicleNumberList;
            this.pagination.pageNum = res.data.pageNum;
            this.pagination.total = res.data.total;
          } else {
            if(res.data.total === 0) {
              this.$message.info('抱歉，没有找到匹配结果');
              this.$router.push({name: "vehicle_search_qy"})
            }
          }
        }).catch(err => {
          this.$message.info('抱歉，没有找到匹配结果');
          this.$router.push({name: "vehicle_search_qy"})
        })
      },
      timeOrderS () {
        if (this.stucOrder > 2) {
          this.stucOrder = 2;
        } else {
          this.stucOrder === 1 ? this.stucOrder = 2 : this.stucOrder = 1;
        }
      },
      handleCurrentChange (e) {
        this.pagination.pageNum = e;
        this.getTheList();
      },
      showStrucInfo (data, index) {
        this.detailData = {
          index: index,
          list: this.strucInfoList
        }
      }
    },
    watch: {
      stucOrder () {
        this.getTheList();
      },
      leftActive () {
        this.pagination.pageNum = 1;
        this.getTheList();
      }
    }
  }
</script>
<style lang="scss" scoped>
  .vehicle_content {
    /*height: calc(100% - 50px);*/
  }
  .the-right-result {
    width: 100%; height: 100%;
    background: #F7F9F9;
    /*padding: 15px 12px 25px 0;*/
    display: flex;
    overflow-y: hidden;
    padding-top: 50px;
    .vc_main_left {
      width: 250px;
      height: 100%;
      color: #333333;
      text-indent: 20px;
      background: #ffffff;
      .vc_l_sup_m{
        > h5 {
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid #DCDCDC;
        }
        .active {
          background: #E0F3FF;
          color: #0C70F8;
          border-left-color: #0C70F8;
        }
        > p, ul li {
          height: 54px;
          line-height: 54px;
          border-bottom: 1px solid #DCDCDC;
          cursor: pointer;
          border-left: 4px solid #ffffff;
          &:hover {
            background: #E0F3FF;
            color: #0C70F8;
            border-left-color: #0C70F8;
          }
        }
      }
    }
    .vl_s_right {
      display: inline-block;
      width: calc(100% - 250px);
      height: 100%;
      position: relative;
      .vl_jig_right {
        width: 100%;
        height: 100%;
        padding: 0 20px;
        padding-right: 0;
        .vl_jig_right_title {
          width: 100%;
          height: 56px;
          line-height: 56px;
          color: #999999;
          .vl_jr_t_item {
            float: left;
            width: 50%;
            text-align: left;
            padding-left: 10px;
            >div {
              cursor: pointer;
              display: inline-block;
            }
            .active-item {
              color: #2580FC;
              i {
                color: #999999;
              }
              .active {
                color: #2580FC;
              }
            }
            &:first-child {
              padding-right: 10px;
              padding-left: 0;
              >div {
                float: right;
                span {
                  display: inline-block;
                  vertical-align: middle;
                  i {
                    display: block;
                    font-size: 10px;
                  }
                }
              }
            }
          }
        }
        .vl_jfo_event {
          height: calc(100% - 70px);
          .vl_jfo_event_box {
            width: 100%;
            height: auto;
            .vl_jfo_box_item {
              float: left;
              cursor: pointer;
              width: 292px;
              height: 346px;
              padding: 14px;
              margin-left: 24px;
              margin-bottom: 26px;
              background: rgba(255, 255, 255, 1);
              box-shadow: 0px 5px 16px 0px rgba(169, 169, 169, 0.2);
              img {
                display: inline-block;
                width: 265px;
                height: 263px;
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
                display: flex;
                align-items: center;
                padding: 10px 0 5px 0;
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
                i {
                  background: url("../../../../../assets/img/the-daynoint.png") no-repeat;
                  background-size: 15px 15px;
                }
              }
            }
          }
        }
      }
    }
    .the-result-box {
      width: calc(100% - 250px); height: 100%;
      background: #F6F8F9;
      .list-box {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        flex-flow: row wrap;
        // height: calc(100% - 45px);
        .list-item {
          width: 293px;
          height: 346px;
          padding: 14px;
          margin-bottom: 15px;
          background: #fff;
          margin-left: 1.3%;
          &:nth-child(4n - 3) {
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
            display: flex;
            align-items: center;
            padding: 10px 0 5px 0;
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
            i {
              background: url("../../../../../assets/img/the-daynoint.png") no-repeat;
              background-size: 15px 15px;
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
  .input-box-line {
    .el-input__inner:hover,
    .el-input__inner:focus {
      border-color: #DCDFE6;
    }
    .el-input-group__prepend {
      background: #fff;
      padding: 0 5px;
    }
    .left-none-border {
      .el-input__inner {
        border-left: none;
      }
    }
    .el-date-editor {
      .el-input__inner {
        padding-left: 15px;
      }
      .el-input__prefix {right: 5px;left: auto;}
    }
  }
  .the-left-search {
    .btn-box {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      position: fixed;
      bottom: 15px;
      left: 0;
      .el-button {
        width: 110px;height: 40px;
      }
      .el-button.th-btn-color {
        background: #0C70F8;
        color: #fff;
        border: none;
      }
    }
  }
</style>