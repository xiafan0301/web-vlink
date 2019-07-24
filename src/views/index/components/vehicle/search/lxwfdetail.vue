<template>
  <div class="vehicle-info">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item  :to="{ path: '/vehicle/lxwf' }">连续违章</el-breadcrumb-item>
        <el-breadcrumb-item>连续违章详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="vehicle-info-content">
      <vue-scroll>
      <p class="daochu">
        <el-button type="primary" :loading="daochu" @click="dOut"
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
                <span>{{carInfo.plateno}}</span>
              </div>
              <!-- <div class="card-item">
                <label class="title">归属地：</label>
                <span>{{carInfo.vehicleLocation}}</span>
              </div> -->
              <div class="card-item">
                <label class="title">所有人：</label>
                <span>{{carInfo.owner	}}</span>
              </div>
              
              <div class="card-item">
                <label class="title">中文品牌：</label>
                <span>{{carInfo.brand}}</span>
              </div>
              <div class="card-item">
                <label class="title">车身颜色：</label>
                <span>{{carInfo.color}}</span>
              </div>
              <div class="card-item">
                <label class="title">车身形式：</label>
                <span>{{carInfo.bodyform}}</span>
              </div>
              <div class="card-item">
                <label class="title">车门数：</label>
                <span>{{carInfo.doornumber}}</span>
              </div>
              <div class="card-item">
                <label class="title">发动机号：</label>
                <span>{{carInfo.engineno}}</span>
              </div>
              <div class="card-item">
                <label class="title">车辆类型：</label>
                <span>{{carInfo.platetype}}</span>
              </div>
              <div class="card-item">
                <label class="title">年款：</label>
                <span>{{carInfo.model}}</span>
              </div>
              <div class="card-item">
                <label class="title">座位数：</label>
                <span>{{carInfo.seatnumber}}</span>
              </div>
              <div class="card-item">
                <label class="title">车辆状态：</label>
                <span>{{carInfo.status}}</span>
              </div>
              <div class="card-item">
                <label class="title">使用性质：</label>
                <span>{{carInfo.usecharacter}}</span>
              </div>
              <div class="card-item">
                <label class="title">车型：</label>
                <span>{{carInfo.vehicletype}}</span>
              </div>
              <div class="card-item">
                <label class="title">厂商名称：</label>
                <span>{{carInfo.vendor}}</span>
              </div>
              <div class="card-item">
                <label class="title">有效期止：</label>
                <span>{{carInfo.validuntil}}</span>
              </div>
              <!-- <div class="card-item vehicle-img">
                <label class="title">车辆登记照片：</label>
                <div class='upload_box'>
                  <div class="img-box" v-for="(item, index) in historyPicList" :key="index">
                     <div class="img-box"><img :src="carInfo.vehicleImage"/></div>
                  </div> @click="openBigImg(index, historyPicList)"
                </div>
              </div> -->
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
                  label="违章时间"
                  prop="vioDate"
                  show-overflow-tooltip
                  >
                </el-table-column>
                <el-table-column
                  label="违章地点"
                  prop="address"
                  show-overflow-tooltip
                  >
                </el-table-column>
                <el-table-column
                  label="城市名称"
                  prop="city"
                  show-overflow-tooltip
                  >
                </el-table-column>
                <el-table-column
                  label="罚款金额"
                  prop="fine"
                  show-overflow-tooltip
                  >
                </el-table-column>
                <el-table-column
                  label="违章归属地"
                  prop="vioAsPlace"
                  show-overflow-tooltip
                  >
                </el-table-column>
                <el-table-column
                  label="违章行为"
                  prop="vioName"
                  show-overflow-tooltip
                  >
                </el-table-column>
                <el-table-column
                  label="分类类型"
                  prop="vioCategory"
                  show-overflow-tooltip
                  >
                </el-table-column>
                <el-table-column
                  label="采集机关"
                  prop="vioCollectionOffice"
                  show-overflow-tooltip
                  >
                </el-table-column>
              </el-table>
            </div>
            <!-- <template v-if="pagination.total > 0">
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
            </template> -->
          </div>
        </div>
      </div>
      </vue-scroll>
      
    </div>
    <div class="bottom">
        <div class="tablink">
           <a @click="goToPage('control_create')">车辆布控</a>
          <a @click="goToPage('vehicle_analysis_clgj')">轨迹分析</a>
          <a @click="goToPage('vehicle_search_ljd')">落脚点分析</a>
          <a @click="goToPage('vehicle_search_txcl')">同行车分析</a>
        </div>
      </div>
  </div>
</template>
<script>
import {
  getViolationInfo,
  getArchives,exportNightVehicle
} from "../../../api/api.judge.js";
export default {
 
  data() {
    return {
      historyPicList: [], // 上传历史记录
      carInfo:{},
      daochu:false,
      searching:false,
      regulationsList: [],      //违章信息列表
          pagination: { total: 20, pageSize: 10, pageNum: 1 },
    };
  },

  computed: {
  
  },
  mounted() {
    this.getArchives()
    this.getViolationInfo()
  },
  methods: {
   
    dOut(){
       let today = new Date()
      let y = today.getFullYear()
      let m = today.getMonth()+1
      let r = today.getDay()
      let day= y +"-"+ m +"-" + r
      let sdate = this.$route.query.datastart ? this.$route.query.datastart.substr(0,10) : ''
      let edate = this.$route.query.dataend ? this.$route.query.dataend.substr(0,10) : ''
      this.daochu=true
      exportNightVehicle({
        vehicleViolationDto:{
          dateEnd:(edate || day) + " 23:59:59",
          dateStart:(sdate || day) + " 00:00:00",
          plateNo:this.$route.query.plateNo,
          
        },
        viewType:4
      }).then(res=>{
        if(res && res.data){
          const eleA = document.getElementById('export_id');
          if (eleA) {
            document.body.removeChild(eleA);
          }
          let a = document.createElement('a');
          a.setAttribute('href', res.data.fileUrl);
          a.setAttribute('target', '_self');
          a.setAttribute('id', 'export_id');
          document.body.appendChild(a);
          a.click();
          this.daochu=false
        }else{
          this.daochu=false
           this.$message('导出失败！');
        }
      })
    },
    goToPage(v){
      if(v=='control_create'){
        this.$router.push({name:v,query:{
            plateNo:this.$route.query.plateNo,
            imgurl:this.$route.query.imgurl || '',
            modelName:'车辆追踪'
        } });
      }else{
        this.$router.push({name:v,query:{
            plateNo:this.$route.query.plateNo,
            imgurl:this.$route.query.imgurl || ''
        } });
      }
        
    },
    getViolationInfo(){
      let today = new Date()
      let y = today.getFullYear()
      let m = today.getMonth()+1
      let r = today.getDay()
      let day= y +"-"+ m +"-" + r
      let sdate = this.$route.query.datastart ? this.$route.query.datastart.substr(0,10) : ''
      let edate = this.$route.query.dataend ? this.$route.query.dataend.substr(0,10) : ''
      let d={
        dateStart:(sdate || day) + " 00:00:00",
        dateEnd:(edate || day) + " 23:59:59",
        plateNo:this.$route.query.plateNo
      }
      getViolationInfo(d).then(res=>{
        if(res.data && res.data.length>0){
          this.regulationsList=res.data
        }
      })
    },
    getArchives(){
      let d={
        plateNo:this.$route.query.plateNo
      }
      getArchives(d).then(res=>{
        if(res && res.data){
          // console.log(res);
          this.carInfo=res.data
        }
      })
    },
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
.select_btn:hover{
   background-color: #0466de;
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