<template>
  <div class="vehicle_content">
    <div class="vc_gcck_bd" is="vehicleBreadcrumb" :oData="[{name: '区域徘徊', routerName: 'vehicle_search_qyph'}, {name: '分析结果'}]"></div>
    <div class="the-right-result">
      <div class="the-result-box">
        <vue-scroll>
          <div class="list-box">
            <div class="list-item" v-for="(item, index) in strucInfoList" :key="item.id" @click="showStrucInfo(item, index)">
              <img :src="item.vehicleDetailList[0] ? item.vehicleDetailList[0].subStoragePath : ''" alt="">
              <p class="time">车牌号:{{item.groupName}}</p>
              <p class="address">次数:{{item.totalNum}}</p>
            </div>
            <el-pagination
              v-show="pagination.total > 12"
              class="cum_pagination th-center-pagination"
              @current-change="onPageChange"
              :current-page.sync="pagination.pageNum"
              :page-size="pagination.pageSize"
              layout="prev, pager, next"
              :total="pagination.total">
            </el-pagination>
          </div>
        </vue-scroll>
      </div>
    </div>
    <div is="vlDialog" :detailData="detailData" :btnList="btnList" @gotoControl="gotoControl"></div>
  </div>
</template>
<script>
  import vlDialog from '../common/vl-dialog.vue';
  import vehicleBreadcrumb from '../breadcrumb.vue';
  import {QyphGetAreaWander} from '@/views/index/api/api.judge.js'
  export default {
    components: {vehicleBreadcrumb, vlDialog},
    data () {
      return {
        detailData: null,
        btnList: [],
        pagination: { total: 0, pageSize: 12, pageNum: 1 },
        strucInfoList: [], // 检索抓拍信息
        curStrucList: [],
      }
    },
    mounted () {
      this.$_showLoading('.vehicle_content')
      this.getTheList();
    },
    methods: {
      gotoControl (data){
        this.$router.push({ name: 'control_library', query: {imgurl: data.subStoragePath, plateNo: data.plateNo} })
      },
      getTheList () {
        let query = JSON.parse(window.sessionStorage.getItem('qyphParam'));
        let params = {where: query};
        params.pageNum = this.pagination.pageNum;
        params.pageSize = this.pagination.pageSize;
        params.firstSetted = true;
        params.order = "desc";
        params.orderBySetted = true;
        params.pageSizeSetted = true;
        QyphGetAreaWander(params).then(res => {
          this.$_hideLoading();
          if (res) {
            console.log(res)
            if(res.data.list.length === 0) {
              this.$message.info('抱歉，没有找到匹配结果');
              this.$router.push({name: "vehicle_search_qyph"})
            }
            this.strucInfoList = res.data.list;
            this.pagination.pageNum = res.data.pageNum;
            this.pagination.total = res.data.total;
          } else {
            this.$message.info('抱歉，没有找到匹配结果');
            this.$router.push({name: "vehicle_search_qyph"})
          }
        }).catch(err => {
          this.$_hideLoading();
          this.$message.info('抱歉，没有找到匹配结果');
          this.$router.push({name: "vehicle_search_qyph"})
        })
      },
      onPageChange (page) {
        this.pagination.pageNum = page;
        this.getTheList();
      },
      showStrucInfo (data, index) {
        this.curStrucList = this.strucInfoList[index].vehicleDetailList;
        this.detailData = {
          index: 0,
          list: this.curStrucList
        };
        this.btnList = [
            {
            disabled: data.isInSur,
            label: '加入布控库',
            cb: 'gotoControl'
          }
        ]
      },
    },
    watch: {
    }
  }
</script>
<style lang="scss" scoped>
  .the-right-result {
    width: 100%; height: 100%;
    background: #F7F9F9;
    padding-top: 20px;
    display: flex;
    overflow-y: hidden;
    padding-top: 70px;
    .the-result-box {
      width: 100%; height: 100%;
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
          margin-left: 22px;
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