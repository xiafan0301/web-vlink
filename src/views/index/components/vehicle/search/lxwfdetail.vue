<template>
  <div class="vehicle-info">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item  :to="{ path: '/vehicle/lxwf' }">连续违法</el-breadcrumb-item>
        <el-breadcrumb-item>连续违法详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="vehicle-info-content">
      <vue-scroll>
      <p class="daochu">
        <el-button type="primary" :loading="searching"
                  class="select_btn"
                >导出</el-button>
      </p>
      <div class="car-info">
        <!-- <h3 class="title">车辆信息</h3> -->
        <!-- 车辆信息 -->
          <div class="info-card">
            <p class="card-header">车辆信息</p>
            <div class="card-row">
              <div class="card-item">
                <label class="title">车牌号牌：</label>
                <span>湘A51790</span>
              </div>
              <div class="card-item">
                <label class="title">归属地：</label>
                <span>雪佛兰科鲁兹</span>
              </div>
              <div class="card-item">
                <label class="title">车身颜色：</label>
                <span>红色</span>
              </div>
              <div class="card-item">
                <label class="title">中文品牌：</label>
                <span>正常</span>
              </div>
              <div class="card-item">
                <label class="title">所有人：</label>
                <span>周全</span>
              </div>
              <div class="card-item">
                <label class="title">身份证号：</label>
                <span>430111199071651322</span>
              </div>
              <div class="card-item">
                <label class="title">核定载客：</label>
                <span>5人</span>
              </div>
              <div class="card-item">
                <label class="title">机动车状态：</label>
                <span>正常</span>
              </div>
              <div class="card-item vehicle-img">
                <label class="title">车辆登记照片：</label>
                <div class='upload_box'>
                  <div class="img-box" v-for="(item, index) in historyPicList" :key="index">
                    <img
                      :src="item.path"
                      @click="openBigImg(index, historyPicList)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      <div class="leg-info">
        <h3 class="title">违章信息</h3>
        <div>
 <!-- 违章信息 -->
          <div class="info-card">
            <!-- <p class="card-header">违章信息</p> -->
            <div class="table_box">
              <el-table
                :data="regulationsList"
                >
                <el-table-column
                  label="序号"
                  type="index"
                  width="100"
                  >
                </el-table-column>
                <el-table-column
                  label="违法时间"
                  prop="date"
                  show-overflow-tooltip
                  >
                </el-table-column>
                <el-table-column
                  label="违法地点"
                  prop="address"
                  show-overflow-tooltip
                  >
                </el-table-column>
                <el-table-column
                  label="违法行为"
                  prop="name"
                  show-overflow-tooltip
                  >
                </el-table-column>
                <el-table-column
                  label="处理机关"
                  prop="name"
                  show-overflow-tooltip
                  >
                </el-table-column>
              </el-table>
            </div>
            <template v-if="pagination.total > 0">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="onPageChange"
                :current-page.sync="pagination.pageNum"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="pagination.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="pagination.total"
                class="cum_pagination">
              </el-pagination>
            </template>
          </div>
        </div>
      </div>
      </vue-scroll>
      
    </div>
    <div class="bottom">
        <div class="tablink">
          <a>车辆布控</a>
          <a>轨迹分析</a>
          <a>落脚点分析</a>
          <a>同行车分析</a>
        </div>
      </div>
  </div>
</template>
<script>

export default {
 
  data() {
    return {
      historyPicList: [], // 上传历史记录
      searching:false,
      regulationsList: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }
          , {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }
          , {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }
          , {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }
          , {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }
          , {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }
          , {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }],      //违章信息列表
          pagination: { total: 20, pageSize: 10, pageNum: 1 },
    };
  },
  computed: {
  
  },
  mounted() {
  
  },
  methods: {
   //分页
    handleSizeChange (val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getTaskData();

    },
    onPageChange (page) {
      this.pagination.pageNum = page;
    },
  }
};
</script>
<style lang="scss" scoped>
.chbox{
  padding-right:20px;
  padding-top: 10px;
}
.vehicle-info {
  height: calc(100% - 54px);
  .breadcrumb_heaer {
    background: #fff;
  }
  
}
.full {
  width: 100%;
}
.select_btn {
  background-color: #0c70f8;
  color: #ffffff;
}
.vehicle-info-content{
  height: calc(100% - 60px);
}
.bottom{
  height: 60px;
  background: #ffffff;
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  .tablink {
      height: 100%;
      width:100%;
      background: #ffffff;
      margin: 0px auto;
      padding: 0px 20px;
      border: solid 1px #f5f5f5;
      text-align: left;
      a {
        margin: 0px 10px;
        display: inline-block;
        text-align: center;
        width: 160px;
        line-height: 38px;
        border: solid 1px #eeeeee;
        border-radius: 4px;
        margin-top: 10px;
        text-decoration: none;
         background: #0c70f8;
        border: solid 1px #0c70f8;
        color: #ffffff;
        cursor: pointer;
        
      }
      
    }
}
.car-info{
    background: #ffffff;
    margin: 15px;
    box-shadow: 3px 3px 5px 1px #dddddd;
    .info-card {
          width: 100%;
          background: #fff;
          box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
          border-radius:4px;
          margin-bottom: 20px;
          .card-header {
              font-size: 16px;
              height: 55px;
              line-height: 55px;
              border-bottom: 1px solid #F2F2F2;
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
.leg-info{
  background: #ffffff;
  margin: 15px;
  box-shadow: 3px 3px 5px 1px #dddddd;
  .title{
    font-size: 16px;
    font-weight: bold;
    padding: 20px;
    border-bottom: solid 1px #eeeeee;
  }
  .info-card{
    margin: 15px;
  }
}
.daochu{
  padding:10px 20px ;
  text-align: right;
}

</style>