<template>
  <div class="point clcx">
    <div class="breadcrumb_heaer">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
          <el-breadcrumb-item>车辆查询</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="left">
      <div class="plane">
        <el-form
          :model="ruleForm"
          status-icon
          ref="ruleForm"
          label-width="0px"
          class="demo-ruleForm">
          <el-form-item  prop="dateStart">
            <el-date-picker
              v-model="ruleForm.dateStart"
              type="datetime"
              time-arrow-control
              :clearable="false"
              placeholder="开始时间"
              :picker-options="pickerOptions"
              class="full vl_date"
            ></el-date-picker>
          </el-form-item>
          <el-form-item  prop="dateEnd">
            <el-date-picker
              v-model="ruleForm.dateEnd"
              type="datetime"
              time-arrow-control
              :clearable="false"
              :picker-options="pickerOptions"
              placeholder="结束时间"
              class="full vl_date vl_date_end"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="_vehicleGroup" >
            <el-select v-model="ruleForm._vehicleGroup" class="full"  multiple collapse-tags placeholder="全部车辆分组">
              <el-option
                v-for="item in grounpOptions"
                :key="item.uid"
                :label="item.groupName"
                :value="item.uid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="vehicleClass" class="firstItem">
            <el-select v-model="ruleForm.vehicleClass" :class="{'blankinput': ruleForm.vehicleClass === ''}"   class="full" placeholder="全部车辆类型">
              <el-option label="全部车辆类型" value=""></el-option>
              <el-option
                v-for="item in vehicleOptions"
                :key="item.enumValue"
                :label="item.enumValue"
                :value="item.enumValue"
              ></el-option>
            </el-select>
          </el-form-item>
          
      
          <el-form-item class="firstItem">
            <div class="ytsr_xzsb_s" @click="clickTab" v-if="chooseType === 1">
              <span>选择设备</span>
              <span class="el-icon-arrow-down"></span>
            </div>
            <div class="ytsr_dtxz_rst" v-else>
              已选<span>{{dSum}}</span>个设备<a href="javascript: void(0);" @click="dialogVisible={}">重选</a>
            </div>
          </el-form-item>
          <el-form-item prop="plateNo" class="plate_no">
            <p class="carCold">车牌：<el-checkbox style="float: right;" v-model="ruleForm._include">排除</el-checkbox></p>

            <el-input
              placeholder
              v-model="ruleForm.plateNo"
              class="input-with-select width232"
            >
              <el-select
                clearable
                v-model="select"
                style="width: 70px;"
                slot="prepend"
                placeholder
              >
                <el-option
                  v-for="item in pricecode"
                  :key="item.enumField"
                  :label="item.enumValue"
                  :value="item.enumValue"
                ></el-option>
              </el-select>
            </el-input>
      
          </el-form-item>
          <el-form-item>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-button @click="resetForm('ruleForm')" class="full">重置</el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" :loading="isload" @click="submitForm('ruleForm')" class="select_btn full">确定</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="right">
      <p class="r_o_tab" v-show="!isNull">
        <span  class="is_tuwen" :class="{'active': isList}" @click="isList = true;"></span>
        <span  class="is_list" :class="{'active': !isList}" @click="isList = false;"></span>
        <el-button type="primary" size="small" :loading="isDao" @click="exportList" class="fright">导出</el-button>
      </p>
      <div v-if="!isNull">
        <h3 class="title">查询结果</h3>
        <el-table
        v-show="isList"
        :data="tableData"
        style="width: 100%; padding:20px;">
       <el-table-column  type="index" :show-overflow-tooltip="true" label="序号"  width="80"></el-table-column>
      <el-table-column
        prop="PlateNo"
        label="车牌号码">
      </el-table-column>
      <el-table-column
        prop="plateColorDesc"
        sortable
        label="号牌颜色">
      </el-table-column>
      <el-table-column
        prop="deviceName"
        label="设备名称">
      </el-table-column>
      <el-table-column
        prop="shotTime"
        label="过车时间">
      </el-table-column>
        <el-table-column
          prop="vehicleClassDesc"
          label="车辆类型">
        </el-table-column>
        <el-table-column
          prop="vehicleBrandDesc"
          label="品牌">
        </el-table-column>
        <el-table-column
                prop="vehicleGroup"
                label="所属分组">
        </el-table-column>
      <el-table-column
        label="是否是布控车辆">
        <template slot-scope="scope">
          <span v-if="scope.row.isSurveillance">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">抓拍详情</el-button>
        </template>
      </el-table-column>
    </el-table>
        <div class="right_tw_list" v-show="!isList">
          <div class="r_tw_l_item" v-for="item in tableData" :key="item.id" @click="handleClick(item)">
            <div class="r_tw_l_img">
              <img :src="item.StorageUrl1" alt="">
            </div>
            <p><span>车牌号：</span>{{item.PlateNo}}</p>
            <p><span>设备名称：</span>{{item.deviceName}}</p>
            <p><span>过车时间：</span>{{item.shotTime}}</p>
            <p><span>所属分组：</span>{{item.vehicleGroup}}</p>
            <p><span>是否是布控车辆：</span>{{item.isSurveillance ? '是' : '否'}}</p>
          </div>
        </div>
      </div>
      <div v-if="isNull" class="fnull">
        <div>
          <img src="../../../../../assets/img/null-content.png" alt="">
          选择设备和车辆类别，查询特定时间段内该类别车辆在所选设备的过车情况
        </div>

      </div>
      <el-pagination
        v-show="pagination.total > 0"
        class="cum_pagination"
        style="background-color: #fff;"
        @size-change="handleSizeChange"
        @current-change="onPageChange"
        :current-page.sync="pagination.pageNum"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="pagination.pageSize"
        layout="total, prev, pager, next"
        :total="pagination.total">
      </el-pagination>
    </div>
     <!-- 地图选择 -->
    <!-- <el-dialog :visible.sync="dialogVisible" width="80%">
        <mapselect @selectMap="mapPoint" @closeMap="hideMap" :allPoints="allDevice"></mapselect>
    </el-dialog> -->
    <!-- D设备 B卡口  这里是设备和卡口 -->
    <div is="mapSelector" :open="dialogVisible" :clear="msClear" :showTypes="'DB'" @mapSelectorEmit="mapPoint"></div>
    
    <div is="vehicleDetail" :detailData="detailData"></div>
  </div>
</template>
<script>
import vehicleDetail from '../common/vehicleDetail.vue';
import { dataList } from "@/utils/data.js";
import {getAllDevice,getGroups,getSnapList,exportNightVehicle} from "@/views/index/api/api.judge.js";
// import mapselect from "@/views/index/components/common/mapSelect";
import mapSelector from '@/components/common/mapSelector.vue';
import {formatDate, dateOrigin} from '@/utils/util.js';
export default {
  components: { mapSelector, vehicleDetail },
  data () {
    return {
      dSum: 0,
      chooseType: 1,
      msClear: {},
      isList: true, // 列表展示形式

      detailData: null,
      amap:null,
      markerPoint: null, // 地图点集合
      pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now() ;
          }
        },
      isNull:true,
      isDao:false,
      pricecode: this.dicFormater(dataList.ownership)[0].dictList,
      dialogVisible: false,
      strucDetailDialog: false,
      isload: false,
      value1: null,
      select: '',
      ruleForm: {
        dateStart: dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)),
        dateEnd: new Date(),
        _vehicleGroup:'',
        vehicleClass:null,
        include:1,
        _include:0,
        plateNo:'',
        pageNum:1,
        pageSize:10,
      },
      allDevice:[],
      selectDevice:[],
      selectBayonet:[],
      tableData: [],
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      vehicleOptions: [],
      grounpOptions: [
        
        {
          groupName:'布控车辆',
          uid:-2,
        },
        {
          groupName:'无牌车辆',
          uid:-3,
        },
       
       
      ]
    }
  },
  watch: {
    // stucOrder () {
    //   this.tcDiscuss(true);
    // },
    strucCurTab(e) {
      if (e === 2) {
        this.drawPoint(this.sturcDetail);
      } else if (e === 3) {
        this.videoUrl = document.getElementById("capVideo").src;
      }
    }
  },
   beforeRouteEnter(to, from, next) {
     next(vm => {
         // 通过 `vm` 访问组件实例
           if (from.name == 'vehicle_menu' && to.name == 'vehicle_search_clcx') {//一定是从A进到B页面才刷新
               vm.updataB(); 
           }
     })
},
  mounted() {
    this.setDTime()
    this.getGroups()
    let dic=this.dicFormater(dataList.vehicleType);
    this.vehicleOptions= [...dic[0].dictList]
    // let vd= JSON.parse(localStorage.getItem("searchD"))
    // if(vd && this.$route.query.dateStart){
    //   this.isNull=false;
    //   //this.getSnapList(vd)
    //   this.ruleForm= {
    //     dateStart:this.$route.query.dateStart,
    //     dateEnd:this.$route.query.dateEnd,
    //     _vehicleGroup:this.$route.query.vehicleGroup?this.$route.query.vehicleGroup.split(","):'',
    //     vehicleClass:this.$route.query.vehicleClass,
    //     include:this.$route.query.include,
    //     _include:0,
    //     plateNo:this.$route.query.plateNo,
    //     pageNum:1,
    //     pageSize:10,
    //   }
    //   this.value1 = this.$route.query.areaIds?this.$route.query.areaIds.split(","):''
    //   let da=  JSON.parse(localStorage.getItem("clcxData"))
    //   let numb= JSON.parse(localStorage.getItem("clcxPage"))
    //   // this.totalData = da
    //   // this.pagination.total=da.length
    //   this.pagination.pageNum = numb
    //   // this.tableData= this.totalData.slice((numb-1)*10,10*numb)
     
    // }
    //this.submitForm()
    
  },
  methods: {
    imgListTap(data, index) {
      // 点击swiper图片
       this.playing = false;
      this.curImgIndex = index;
      this.sturcDetail = data;
      this.drawPoint(data); // 重新绘制地图
    },
    //导出
    exportList(){
      this.isDao=true
      this.ruleForm.deviceIds  = this.selectDevice?this.selectDevice.join(","):''
      this.ruleForm.bayonetIds = this.selectBayonet?this.selectBayonet.join(","):''
      this.ruleForm.vehicleGroup = this.ruleForm._vehicleGroup?this.ruleForm._vehicleGroup.join(","):''
      this.ruleForm.dateStart = formatDate(this.ruleForm.dateStart);
      this.ruleForm.dateEnd = formatDate(this.ruleForm.dateEnd);
      this.ruleForm.vehicleClass = this.ruleForm.vehicleClass?this.ruleForm.vehicleClass:''
      this.ruleForm.pageNum =this.pagination.pageNum
      let d = JSON.stringify(this.ruleForm)
      d = JSON.parse(d)
      d.plateNo = this.select + this.ruleForm.plateNo;
      if(!d.plateNo){
        d.include=null
      }
      exportNightVehicle({
        vehicleSnapQueryDto:d,
        viewType:2
      }).then(res=>{
        if(res && res.data) {
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
          this.isDao=false
        }else{
          this.isDao=false
           //this.$message.error('导出失败！');
        }
      })
    },
    updataB(){
      //console.log(88888888888);
      this.isNull=true
      this.tableData = [];
      this.resetForm()
     // this.submitForm()
    },
    //设置默认时间
    setDTime() {
    },
    //查询所有的设备
    getAllDevice(){
      getAllDevice().then(res=>{
          // console.log(res);
          if(res.data && res.data.length>0){
            this.allDevice=res.data
          }

      })
    },
    //查询特殊组
    getGroups(){
      let d={
        groupType:9
      }
      getGroups(d).then(res=>{
          if(res.data && res.data.length>0){
            this.grounpOptions.push(...res.data)
            // console.log(this.grounpOptions);
          }
      })  
    },
    //查询车辆
    getSnapList(v){
      this.isload=true
      if(!this.ruleForm.dateStart || !this.ruleForm.dateEnd){
        if(!document.querySelector('.el-message--info')){
          this.$message.error("请输入开始时间和结束时间!");
          }
        return
      }
      this.ruleForm.deviceIds  = this.selectDevice?this.selectDevice.join(","):''
      this.ruleForm.bayonetIds = this.selectBayonet?this.selectBayonet.join(","):''
      this.ruleForm.vehicleGroup = this.ruleForm._vehicleGroup?this.ruleForm._vehicleGroup.join(","):''
      this.ruleForm.dateStart = formatDate(this.ruleForm.dateStart);
      this.ruleForm.dateEnd = formatDate(this.ruleForm.dateEnd);
      this.ruleForm.vehicleClass = this.ruleForm.vehicleClass?this.ruleForm.vehicleClass:''
      this.ruleForm.pageNum =this.pagination.pageNum
      let d = JSON.stringify(this.ruleForm)
      d = JSON.parse(d)
      d.plateNo = this.select + this.ruleForm.plateNo;
      d.pageNum = this.pagination.pageNum;
      d.pageSize = this.pagination.pageSize;
      if(!d.plateNo){
        d.include=null
      }
      if(v){
        d=v
      }else{
        localStorage.setItem("searchD",JSON.stringify(d))
      }
      getSnapList(d).then(res=>{
         this.isNull=false
        if(res && res.data && res.data.list.length>0){
          this.isload=false
          // console.log(res.data);
          //pagination: { total: 4, pageSize: 10, pageNum: 1 },
          this.pagination.total=res.data.total
          //this.pagination.pageNum=1
          //this.tableData= res.data
          this.totalData=res.data.list
          this.tableData= this.totalData.slice(0,10)
          // console.log(this.tableData);
          //let localData= JSON.stringify(this.totalData)
          // localStorage.setItem('clcxData',localData)
          // localStorage.setItem('clcxPage',"1")
          
        }else{
           this.isload=false
           if(!document.querySelector('.el-message--info')){
             this.$message.info("没有相关数据。");
          }
          this.pagination.total=0;
          this.pagination.pageNum=1;
          this.tableData=[]
        }
      }).catch(() => {
        this.isload=false
      });
    },
    // hideMap(){
    //   this.dialogVisible=false
    // },
    mapPoint(data){
      let v = data.deviceList;
      let p = data.bayonetList;
      // this.dialogVisible=false;
      this.selectDevice=[]
      this.selectBayonet=[]
      //返回有效点集合
      if(v && v.length>0){
        v.forEach(element => {
          this.selectDevice.push(element.uid)
        });
      }
      if(p && p.length>0){
        p.forEach(element => {
          this.selectBayonet.push(element.uid)
        });
      }

      this.dSum = this.selectDevice.length + this.selectBayonet.length;
      //this.selectDevice=v

      // console.log(this.selectDevice);
      
    },
  
    clickTab(){
      this.dialogVisible = !this.dialogVisible;
      this.chooseType = 2;
    },
    handleClick(v){
      this.detailData = {
        type: 11, // 11车辆查询
        params: {}, // 查询参数
        list: this.tableData, // 列表
        index: this.tableData.findIndex(x => x === v), // 第几个
        pageSize: this.tableData.length,
        total: this.tableData.length,
        pageNum: 1
      };
    },
    resetForm (){
      this.value1=null;
      // this.select=""
      this.ruleForm._vehicleGroup="" 
      this.ruleForm.vehicleClass="" 
      this.ruleForm.include="" 
      this.ruleForm._include="" 
      this.ruleForm.plateNo="" 
      this.ruleForm.dateStart = dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000));
      this.ruleForm.dateEnd = new Date();
      this.pagination.pageNum = 1;
      this.pagination.total = 0;
      this.tableData = [];
      this.isNull = true;
      this.msClear = {};
      this.dSum = 0;
    },
    submitForm(){
      this.ruleForm.include=this.ruleForm._include?0:1
      // console.log(this.ruleForm);
      this.pagination.pageNum = 1;
      this.getSnapList()
      
    },
    onPageChange (page) {
      //console.log(page);
      
      this.pagination.pageNum = page;
      // localStorage.setItem('clcxPage',page)
      // this.tableData= this.totalData.slice((page-1)*10,10*page)
      // this.grounpOptions.pageNum=page
      this.getSnapList()
    },
    handleSizeChange (val) {
      //i没有用到
      
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
     // this.getSnapList()
    },
  }
}
</script>
<style lang="scss" scoped>
.right_tw_list {
  width: 100%;
  padding: 20px 20px 0 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .r_tw_l_item {
    width: 290px;
    border: 1px solid #D3D3D3;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 20px;
    .r_tw_l_img {
      width: 100%;
      height: 200px;
      overflow: hidden;
      img {
        width: 100%;
        height: auto;
      }
    }
    p {
      padding-left: 20px;
      color: #333333;
      line-height: 24px;
      span {
        color: #666666;
      }
    }
  }
}
.ytsr_xzsb_s {
  height: 40px;
  line-height: 40px;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  cursor: pointer;
  color: #999999;
  padding: 0 6px;
  > span {
    display: inline-block;
    width: 50%;
    &:last-child {
      text-align: right;
    }
  }
}
.ytsr_dtxz_rst {
  width: 100%;
  line-height: 40px;
  padding: 0px 15px; margin-top: 5px;
  background-color: #F5F7FA;
  color: #C0C4CC;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  > span {
    display: inline-block;
    padding: 0 3px;
    color: #333;
  }
  > a {
    display: inline-block;
    padding-left: 5px;
    color: #2580FC !important;
    text-decoration: none !important;
    /*font-style: italic;*/
    cursor: pointer;
  }
}
.carCold{
  justify-content: space-between;
    display: flex;
}
.fright{
  float: right;
}
.fnull{
  text-align: center;
  line-height: 48px;
  font-size: 16px;
  color: #666666;
  display: flex;
  flex-flow: column;
  justify-content: center;
  height: 100%;;
  img{
    display: block;
    margin: auto;
    padding-bottom: 10px;
  }
}
.point {
  width: 100%;
  height: 100%;
}
.breadcrumb_heaer {
  background: #ffffff;
 
  border-bottom: solid 1px #eeeeee;
  
}
.full {
  width: 100%;
}
.title {
  padding-left: 20px;
  height: 50px;
  line-height: 50px;
  border-bottom: solid 1px #dddddd;
  font-size: 16px;
  font-weight: bold;
}

.right {
  width: calc(100% - 292px);
  height: calc(100% - 80px);
  float: right;
  /*background: #ffffff;*/
  /*margin-top: 20px;*/
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
  > div {
    background: #ffffff;
  }
  .r_o_tab {
    height: 60px;
    padding-top: 12px;
    padding-right: 20px;
    > span {
      color: #999999;
      font-size: 24px;
      cursor: pointer;
      display: inline-block;
      margin-right: 20px;
      width: 38px;
      height: 38px;
      background: url("../../../../../assets/img/icons.png") no-repeat;
    }
    .is_list {
      background-position: -1096px -259px;
    }
    .is_list.active {
      background-position: -1046px -259px;
    }
    .is_tuwen {
      background-position: -1197px -259px;
    }
    .is_tuwen.active {
      background-position: -1146px -259px;
    }
  }
}

.left {
  width: 272px;
  height: auto;
  min-height: calc(100% - 55px);
  background-color: #ffffff;
  float: left;
  z-index: 1;
  box-shadow: 4px 0px 10px 0px #838383;
  box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
  animation: fadeInLeft 0.4s ease-out 0.3s both;
  // transition: left 0.3s ease-in;
  .plane {
    padding:20px 20px;
    position: relative;
    height: 100%;
  }
  .line40 {
    line-height: 40px;
  }
  .inset {
    display: inline-block;
    line-height: 40px;
    font-style: normal;
  }
  .firstItem {
    margin-bottom: 10px;
  }
}
.select_btn {
  background-color: #0c70f8;
  color: #ffffff;
}
.select_btn:hover{
   background-color: #0466de;
}
</style>
<style lang="scss">
.clcx{
  .el-dialog__wrapper .el-dialog__body{
  padding: 0px;
}
.el-dialog__header{
  padding: 0px 20px 3px;
}
.el-dialog__headerbtn{
  z-index: 1;
}
}
.blankinput{
  .el-input__inner{
    color: #c6c6c6;
  }
}
.el-form-item__label{
  padding-right: 0px;
}
.plate_no .el-input-group__prepend{
  padding: 0px 15px!important;
  width: 56px!important;
  background: #fff;
}
</style>