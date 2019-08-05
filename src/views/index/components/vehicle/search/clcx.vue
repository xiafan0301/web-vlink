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
              type="date"
              :clearable="false"
              placeholder="开始时间"
              :picker-options="pickerOptions"
              class="full vl_date"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item  prop="dateEnd">
            <el-date-picker
              v-model="ruleForm.dateEnd"
              type="date"
              :clearable="false"
              :picker-options="pickerOptions"
              placeholder="结束时间"
              class="full vl_date vl_date_end"
              value-format="yyyy-MM-dd"
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
          
      
          <el-form-item label="抓拍区域：" label-width="72px" class="firstItem">
            <!-- <el-radio-group v-model="input5" @change="changeTab"> -->
            <el-radio-group v-model="input5" @change="changeTab">
               <el-row :gutter="10">
                <el-col :span="12">
                  <el-radio label="1">列表选择</el-radio>
                </el-col>
                <el-col :span="12" >
                  <div @click="clickTab"><el-radio label="2">地图选择</el-radio></div>
                  
                </el-col>
              </el-row>
               
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="input5=='2'" >
            <el-input  v-model="selectValue" :disabled="true">
            </el-input>
          </el-form-item>
          <el-form-item v-if="input5=='1'">
            <el-select v-model="value1" multiple collapse-tags placeholder="请选择" class="full">
            <el-option-group
              v-for="group in options"
              :key="group.areaName"
              :label="group.areaName">
              <el-option
                v-for="item in group.areaTreeList"
                :key="item.areaId"
                :label="item.areaName"
                :value="item.areaId">
              </el-option>
            </el-option-group>
          </el-select>
          </el-form-item>
          <el-form-item prop="plateNo">
            <p class="carCold">车牌：<el-checkbox style="float: right;" v-model="ruleForm._include">排除</el-checkbox></p>
            <el-input placeholder="请输入车牌号" v-model="ruleForm.plateNo" class="input-with-select">
              <el-select v-model="select" slot="prepend" placeholder="">
               <!-- <el-option v-for="item in pricecode" :label="item" :value="item"></el-option> -->
               <el-option v-for="(item, index) in pricecode" :label="item" :value="item" :key="'cph_' + index"></el-option>
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
      <div v-if="!isNull">
      <h3 class="title">查询结果 
        <el-button type="primary" size="small" :loading="isDao" @click="exportList" class="select_btn  fright">导出</el-button>
      </h3>
      <el-table
      :data="tableData"
      style="width: 100%; padding:20px;">
       <el-table-column  type="index" :show-overflow-tooltip="true" label="序号"  width="80"></el-table-column>
      <el-table-column
        prop="plateNo"
        label="车牌号码"
        width="180">
      </el-table-column>
      <el-table-column
        prop="snapNum"
        sortable
        label="抓拍次数">
      </el-table-column>
      <el-table-column
        prop="vehicleGroup"
        label="车辆分组">
      </el-table-column>
      <el-table-column
        label="是否是布控车辆">
        <template slot-scope="scope">
          <span v-if="scope.row.isSurveillance">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="vehicleClass"
        label="车辆类型">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">抓拍详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
    <div v-if="isNull" class="fnull">
      <div><img src="../../../../../assets/img/null-content.png" alt="">
      请在左侧输入查询条件</div>
       
    </div>
    <el-pagination
      v-show="pagination.total > 0"
      class="cum_pagination"
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
    <div is="mapSelector" :open="dialogVisible" :showTypes="'DB'" @mapSelectorEmit="mapPoint"></div>
    
    <div is="vehicleDetail" :detailData="detailData"></div>
  </div>
</template>
<script>
import vehicleDetail from '../common/vehicleDetail.vue';
import { mapXupuxian } from "@/config/config.js";
import { cityCode } from "@/utils/data.js";
import { getVehicleShot,getAllDevice,getGroups,getSnapList,exportNightVehicle,getSnapDetail} from "@/views/index/api/api.judge.js";
import { MapGETmonitorList } from "@/views/index/api/api.map.js";
// import mapselect from "@/views/index/components/common/mapSelect";
import mapSelector from '@/components/common/mapSelector.vue';
import { dataList } from '@/utils/data.js';
export default {
  components: { mapSelector, vehicleDetail },
  data () {
    return {
      detailData: null,
      amap:null,
      markerPoint: null, // 地图点集合
      pickerOptions: {
          disabledDate (time) {
            let date = new Date();
            let y = date.getFullYear();
            let m = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
            let d = date.getDate();
            let threeMonths = '';
            let start = '';
            if (parseFloat(m) >= 2) {
              start = y + '-' + (m - 1) + '-' + d;
            } else {
              start = (y - 1) + '-' + (m - 1 + 12) + '-' + d;
            }
            threeMonths = new Date(start).getTime();
            //return time.getTime() > Date.now() || time.getTime() < threeMonths;
            return time.getTime() > Date.now() ;
          }
        },
        isNull:true,
        isDao:false,
      pricecode:cityCode,
      input5: "1",
      dialogVisible: false,
      strucDetailDialog: false,
      isload: false,
      value1: null,
      select: "",
      selectValue:"已选设备0个",
      ruleForm: {
        dateStart:'',
        dateEnd:'',
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
      options: [],
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
    this.getMapGETmonitorList()//查询行政区域
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
    getSnapDetail(data){
      
      getSnapDetail(data).then(res=>{
        if(res && res.data && res.data.snapDtoList && res.data.snapDtoList.length > 0){
         /*  this.strucDetailDialog = true 
          this.sturcDetail=res.data.snapDtoList[0]
          if(res.data.snapDtoList && res.data.snapDtoList.length>0){
            this.strucInfoList = res.data.snapDtoList;
          } */
          let _d = res.data.snapDtoList;
          this.detailData = {
            type: 11, // 11车辆查询
            params: {
              where: {}
            }, // 查询参数
            list: _d, // 列表
            index: 0, // 第几个
            pageSize: _d.length,
            total: _d.length,
            pageNum: 1
          }
          
          //this.snapObj=res.data.snapDtoList[0]
         
          
        }else{

        }
      })
    },
    //导出
    exportList(){
      this.isDao=true
      if(this.input5==1){
        this.ruleForm.areaIds =this.value1?this.value1.join(","):''
      }else{
        /*   this.selectDevice=[]
      this.selectBayonet=[] */
        this.ruleForm.deviceIds  = this.selectDevice?this.selectDevice.join(","):''
        this.ruleForm.bayonetIds = this.selectBayonet?this.selectBayonet.join(","):''
      }
      this.ruleForm.vehicleGroup = this.ruleForm._vehicleGroup?this.ruleForm._vehicleGroup.join(","):''
      this.ruleForm.dateStart = this.ruleForm.dateStart.indexOf(":")>0?(this.ruleForm.dateStart):(this.ruleForm.dateStart +" 00:00:00")
      this.ruleForm.dateEnd = this.ruleForm.dateEnd.indexOf(":")>0?(this.ruleForm.dateEnd):(this.ruleForm.dateEnd+" 23:59:59")
      this.ruleForm.vehicleClass = this.ruleForm.vehicleClass?this.ruleForm.vehicleClass:''
      this.ruleForm.pageNum =this.pagination.pageNum
      let d = JSON.stringify(this.ruleForm)
      d = JSON.parse(d)
      d.plateNo= this.ruleForm.plateNo;
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
      let date = new Date();
      let curDate = date.getTime();
      let curS = 1 * 24 * 3600 * 1000;
      let _sm =(new Date(curDate - curS).getMonth() + 1)>9?(new Date(curDate - curS).getMonth() + 1):("0"+(new Date(curDate - curS).getMonth() + 1))
      let _sd = new Date(curDate - curS).getDate()>9? new Date(curDate - curS).getDate() : ("0"+ new Date(curDate - curS).getDate())
      let _em = (date.getMonth() + 1)>9?(date.getMonth() + 1):("0"+(date.getMonth() + 1))
      let _ed =  date.getDate()>9?date.getDate():("0"+ date.getDate())
      
      let _s = new Date(curDate - curS).getFullYear() +
        "-" + _sm + "-" +_sd;
      let _e = date.getFullYear() + "-" + _em + "-" + _ed;
      // this.data1 = [_e, _e];
      this.ruleForm.dateStart=_s
      this.ruleForm.dateEnd=_s
    },
    //查询行政区域
    getMapGETmonitorList(){
      let d={
        areaUid:mapXupuxian.adcode
      }
      MapGETmonitorList(d).then(res=>{
        if(res && res.data){
          this.options.push(res.data)
          // res.data.areaTreeList.forEach(el=>{
          //   this.value1.push(el.areaId)
          // })
        }
      })
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
      if(this.input5==1){
        this.ruleForm.areaIds =this.value1?this.value1.join(","):''
      }else{
        /*   this.selectDevice=[]
      this.selectBayonet=[] */
        this.ruleForm.deviceIds  = this.selectDevice?this.selectDevice.join(","):''
        this.ruleForm.bayonetIds = this.selectBayonet?this.selectBayonet.join(","):''
      }
      this.ruleForm.vehicleGroup = this.ruleForm._vehicleGroup?this.ruleForm._vehicleGroup.join(","):''
      this.ruleForm.dateStart = this.ruleForm.dateStart.indexOf(":")>0?(this.ruleForm.dateStart):(this.ruleForm.dateStart +" 00:00:00")
      this.ruleForm.dateEnd = this.ruleForm.dateEnd.indexOf(":")>0?(this.ruleForm.dateEnd):(this.ruleForm.dateEnd+" 23:59:59")
      this.ruleForm.vehicleClass = this.ruleForm.vehicleClass?this.ruleForm.vehicleClass:''
      this.ruleForm.pageNum =this.pagination.pageNum
      let d = JSON.stringify(this.ruleForm)
      d = JSON.parse(d)
      d.plateNo= this.ruleForm.plateNo;
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
      if(p.length==0 && v.length==0){
        if(!document.querySelector('.el-message--info')){
           this.$message.info("选择的区域没有设备，请重新选择区域");
        }
        return
      }
      this.selectValue="已选设备"+(this.selectDevice.length+this.selectBayonet.length)+"个"
      //this.selectDevice=v

      // console.log(this.selectDevice);
      
    },
  
    clickTab(){
      this.dialogVisible = !this.dialogVisible;
    },
    handleClick(v){
      //  this.strucDetailDialog = true 
        this.sturcDetail={}
        this.strucInfoList = [];
      // console.log(v);
      v.dateStart = this.ruleForm.dateStart
      v.dateEnd = this.ruleForm.dateEnd
      //this.strucDetailDialog = true 
      let d={
        dateStart:this.ruleForm.dateStart,
        dateEnd:this.ruleForm.dateEnd ,
        devIds:'',
        plateNo:v.plateNo,
        hasPlate:v.plateNo?'1':'0'
      }
      this.getSnapDetail(d)
      // this.$router.push({name: 'vehicle_search_clcxdetail', query: v});
    },
    changeTab(v) {
      //console.log(v);
      // if (v == "2") {
      //   this.dialogVisible = true;
      // } else {
      //   this.dialogVisible = false;
      // }
    },
    resetForm (){
      this.value1=null
      this.selectValue="已选设备0个",
      // this.select=""
      this.ruleForm._vehicleGroup="" 
      this.ruleForm.vehicleClass="" 
      this.ruleForm.include="" 
      this.ruleForm._include="" 
      this.ruleForm.plateNo="" 
      this.setDTime();
      this.pagination.pageNum = 1;
      this.pagination.total = 0;
      this.tableData = [];
      this.isNull = true;
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
  padding: 20px 20px;
  border-bottom: solid 1px #dddddd;
  font-size: 16px;
  font-weight: bold;
}

.right {
  width: calc(100% - 300px);
  height: calc(100% - 80px);
  float: right;
  background: #ffffff;
  margin-top: 20px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
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

</style>