<template>
  <div class="th-driving-night">
    <div class="th-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>夜间行车分析</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button :loading="exportLoadingbtn" @click="onExport" class="th-button-export">导出</el-button>
    </div>
    <div class="the-bottom">
      <div class="the-left-search">
        
      </div>
      <div class="the-right-result">
        <vue-scroll>
          <div class="the-table">
            <el-table
              class="data_table" :data="oData.list">
              <el-table-column label="序号" width="150px" type="index" :index="indexMethod"></el-table-column>
              <el-table-column label="车牌号码" prop="vehicleNumber" show-overflow-tooltip></el-table-column>
              <el-table-column label="车辆类型" prop="vehicleType">
                <template slot-scope="scope">
                  <span>{{ scope.row.vehicleType }}</span>
                </template>
              </el-table-column>
              <el-table-column label="过车次数" prop="vehicleCount"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <span class="operation_btn th-separator" @click="onOpenRecord(scope.row)">抓拍记录</span>
                  <span class="operation_btn" @click="onOpenVehicleInfo(scope.row)">车辆信息</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              class="cum_pagination"
              @current-change="onPageChange"
              :current-page.sync="currentPage"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="pagination.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="oData.total">
            </el-pagination>
          </div>
        </vue-scroll>
      </div>
    </div> 
  </div>
</template>
<script>
export default {
  data () {
    return {
      oData: {
        list: [
          {
            uid: 1,
            vehicleNumber: '湘A99999',
            vehicleType: 1,
            vehicleCount: 3
          }, {
            uid: 2,
            vehicleNumber: '湘A99999',
            vehicleType: 2,
            vehicleCount: 2
          }, {
            uid: 3,
            vehicleNumber: '湘A99999',
            vehicleType: 3,
            vehicleCount: 1
          }, {
            uid: 4,
            vehicleNumber: '湘A99999',
            vehicleType: 3,
            vehicleCount: 1
          }, {
            uid: 5,
            vehicleNumber: '湘A99999',
            vehicleType: 3,
            vehicleCount: 1
          }, {
            uid: 6,
            vehicleNumber: '湘A99999',
            vehicleType: 3,
            vehicleCount: 1
          }, {
            uid: 7,
            vehicleNumber: '湘A99999',
            vehicleType: 3,
            vehicleCount: 1
          }, {
            uid: 8,
            vehicleNumber: '湘A99999',
            vehicleType: 3,
            vehicleCount: 1
          }, {
            uid: 9,
            vehicleNumber: '湘A99999',
            vehicleType: 3,
            vehicleCount: 1
          }, {
            uid: 10,
            vehicleNumber: '湘A99999',
            vehicleType: 3,
            vehicleCount: 1
          }
        ],
        total: 10
      },
      pagination: {
        pageNum: 1,
        pageSize: 10
      },
      currentPage: 1,
      exportLoadingbtn: false, // 导出按钮loading
    }
  },
  methods: {
    /**
     * 导出按钮
     */
    onExport () {
      this.exportLoadingbtn = true
    },
    /**
     * 查看抓拍记录
     */
    onOpenRecord (obj) {
      this.$router.push({name: 'vehicle_search_ycxc_record', query: {uid: obj.uid}})
    },
    /**
     * 查看车辆信息
     */
    onOpenVehicleInfo (obj) {
      console.log(obj)
    },
    /**
     * 分页赋值
     */
    onPageChange (page) {
      this.pagination.pageNum = page;
    },
    /**
     * 序号数字翻页递增
     */
    indexMethod (index) {
      return index + 1 + 10 * (this.pagination.pageNum - 1);
    },
  }
}
</script>
<style lang="scss" scoped>
.th-driving-night {
  width: 100%; height: 100%;
  .the-bottom {
    width: 100%;height: calc(100% - 60px);
    display: flex;
    position: relative;
    .the-left-search {
      width: 272px;height: 100%;
      background: #fff;
      box-shadow: 5px 0 10px #E5E7E7;
      animation: fadeInLeft .4s ease-out .3s both;
    }
    .the-right-result {
      width: calc(100% - 285px); height: 100%;
      margin-left: 13px;
      background: #F7F9F9;
      padding: 15px 12px 25px 0;
      overflow-y: hidden;
      .the-table {
        width: 100%; height: 100%;
        background: #fff;
        border-radius: 4px;
        padding: 18px 15px;
        .operation_btn {
          color: #0C70F8;
          cursor: pointer;
        }
        .th-separator:after {
          content: '丨';
          color: #F2F2F2;
          display: inline-block;
          padding: 0 2px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.the-right-result {
  .__view {
    background: #fff;
    box-shadow: 5px 0px 16px 0px rgba(169,169,169,0.2);
  }
}
</style>