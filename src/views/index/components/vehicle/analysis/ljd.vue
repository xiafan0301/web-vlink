<template>
  <div class="ljd point">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>落脚点分析</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div :class="['left',{hide:hideleft}]">
      <div class="plane">
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          :rules="rules"
          label-width="0px"
          class="demo-ruleForm"
        >
        <el-form-item  prop="data1">
            <el-date-picker
              v-model="ruleForm.data1"
              type="datetime"
              time-arrow-control
              placeholder="开始时间"
              :picker-options="pickerOptions"
              class="full vl_date"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item  prop="data2">
            <el-date-picker
              v-model="ruleForm.data2"
              :clearable="false"
              type="datetime"
              time-arrow-control
              :picker-options="pickerOptions"
              placeholder="结束时间"
              class="full vl_date vl_date_end"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="input3">
            <el-input placeholder="请输入车牌号" v-model="ruleForm.input3" class="input-with-select">
              <!-- <el-select>
                <el-option v-for="(item, index) in pricecode" :label="item" :value="item" :key="'cph_' + index"></el-option>
              </el-select> -->
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-button @click="resetForm('ruleForm')" class="full">重置</el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" :loading="isload" @click="submitForm('ruleForm')" class="select_btn full">分析</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div class="insetLeft" @click="hideLeft"></div>
      </div>
    </div>
    <div :class="['right',{hide:!hideleft}]" id="mapBox"></div>
    <ul class="map_rrt_u2">
        <li  @click="resemt"><i class="el-icon-aim"></i></li>
        <li @click="mapZoomSet(1)"><i class="el-icon-plus"></i></li>
        <li @click="mapZoomSet(-1)"><i class="el-icon-minus"></i></li>
      </ul>
    <div class="reselt" v-if="reselt">
      <div class="plane insetPadding">
        <h3 class="title">分析结果</h3>
        <el-table :data="evData" style="width: 100%;":height="tableHeight" @row-click="createInfoWindow($event)">
          <el-table-column  type="index" width="24px" label="序号"></el-table-column>
          <el-table-column  prop="address" :show-overflow-tooltip="true" label="落脚点位置"></el-table-column>
          <el-table-column prop="stopOverTime" width="120px" sortable label="停留时长">
            <template slot-scope="scope">
              <span>{{ scope.row.stopOverTime | transMinute }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="insetLeft2" @click="hideResult"></div>
      </div>
    </div>
<!-- 视频播放 -->
    <div is="mapVideoPlay" :oData="mapVideoData"></div>
    <!-- 地图选择 -->
    <!-- <el-dialog :visible.sync="dialogVisible" width="80%">
        <mapselect @selectMap="mapPoint" @closeMap="hideMap" :allPoints="allDevice" :allBayonets="allBayonet"></mapselect>
    </el-dialog> -->
    <!-- D设备 B卡口  这里是设备和卡口 -->
    <!-- <div is="mapSelector" :open="dialogVisible" :showTypes="'DB'" @mapSelectorEmit="mapPoint"></div> -->
  </div>
</template>
<script>
import { mapXupuxian } from "@/config/config.js";
// import { cityCode } from "@/utils/data.js";
import { transMinute, dateOrigin, formatDate } from '@/utils/util.js';
import { checkPlateNumber } from '@/utils/validator.js';
import { getVehicleShot,getAllDevice } from "@/views/index/api/api.judge.js";
import { getAllBayonetList } from "@/views/index/api/api.base.js";
import { MapGETmonitorList } from "@/views/index/api/api.map.js";
// import mapselect from "@/views/index/components/common/mapSelect";
import mapSelector from '@/components/common/mapSelector.vue';
import mapVideoPlay from '@/components/common/mapVideoPlay.vue';
export default {
  components: {
    mapSelector,
    mapVideoPlay
  },
  data() {
    return {
      hoverWindow: null,
      tableHeight: 400,
      curInfoWinVideoPath: '',

      mapVideoData: null,
      dialogVisible: false,
      isload: false,
      amap: null,
      allDevice:[],
      allBayonet:[],
      selectDevice:[],
      selectBayonet:[],
      selectValue:"已选设备0个",
      reselt: false,
      hideleft: false,
      bResize: {},
      playUrl: {},
      ruleForm: {
        data1: dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)),
        data2: new Date(),
        input3: null,
        input4: 3,
        input5: "1",
        value1: [],
      },
      rules: {input4: [ {
              pattern:  /^[1-9]\d*$/,
              trigger: 'blur',
							message: '请输入正确的数值'
						}
          ],
          input3:[{
             required: true, message: '请输入正确的车牌号码', trigger: 'blur'
          },{
            validator: checkPlateNumber,
            trigger: 'blur'
            }]
       },
      // pricecode:cityCode,
     
      options: [],
      evData: [],
      pickerOptions: {
          disabledDate (time) {
            // let date = new Date();
            // let y = date.getFullYear();
            // let m = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
            // let d = date.getDate();
            // let threeMonths = '';
            // let start = '';
            // if (parseFloat(m) >= 2) {
            //   start = y + '-' + (m - 1) + '-' + d;
            // } else {
            //   start = (y - 1) + '-' + (m - 1 + 12) + '-' + d;
            // }
            // threeMonths = new Date(start).getTime();
             return time.getTime() > Date.now();
            // return time.getTime() > Date.now() || time.getTime() < threeMonths;
          }
        },
    };
  },
  mounted() {
    //this.getControlMap(1);
    // this.setDTime();
    let pNo=this.$route.query.plateNo
    //this.select = pNo?pNo.substring(0,1):"湘";
    this.ruleForm.input3 = pNo;
    let map = new window.AMap.Map("mapBox", {
      zoom: 10,
      center: mapXupuxian.center
    });
    map.setMapStyle("amap://styles/whitesmoke");
    this.amap = map;
//    this.getMapGETmonitorList()//查询行政区域
    // this.getAllDevice() //查询所有的设备
    // this.getAllBayonetList() //查询所有的卡口
    // 查看当然table的高度
    this.tableHeight = $('#mapBox').height() - 41;
    // 监听地图信息窗体点击事件
    $('body').on('click', '.vl_vehicle_ljd_mk_p', () => {
      this.showVideo(this.curInfoWinVideoPath);
    })
  },
  methods: {
    // 关闭视频
    playerClose () {
      this.dialogVisible = false;
    },
    mapZoomSet(val) {
      if (this.amap) {
        this.amap.setZoom(this.amap.getZoom() + val);
      }
    },
    resemt(){
      if (this.amap) {
          this.amap.setZoomAndCenter(14, mapXupuxian.center);
        }
    },
    setDTime () {
    },
    hideResult() {
      this.reselt = false;
      this.hideLeft();
    },
    hideLeft() {
      this.hideleft = !this.hideleft;
      if (!this.hideleft && this.evData.length > 0) {
        this.reselt = true;
      }
    },
    clickTab() {
       this.dialogVisible = !this.dialogVisible;
    },
    // hideMap(){
    //   this.dialogVisible=false
    // },
    // mapPoint(data){
    //   let v = data.deviceList;
    //   let p = data.bayonetList;
    //   this.selectDevice=[]
    //   this.selectBayonet=[]
    //   //返回有效点集合
    //   if(v && v.length>0){
    //     v.forEach(element => {
    //       this.selectDevice.push(element.uid)
    //     });
    //   }
    //   if(p && p.length>0){
    //     p.forEach(element => {
    //       this.selectBayonet.push(element.uid)
    //     });
    //   }
    //   if(p.length==0 && v.length==0){
    //     if(!document.querySelector('.el-message--info')){
    //        this.$message.info("选择的区域没有设备，请重新选择区域");
    //     }
    //     return
    //   }
    //   this.selectValue="已选设备"+(this.selectDevice.length+this.selectBayonet.length)+"个"
    //   //this.selectDevice=v

    //   // console.log(this.selectDevice);
      
    // },
    changeTab(v) {
      //console.log(v);
      // if (v == "2") {
      //   this.dialogVisible = true;
      // } else {
      //   this.dialogVisible = false;
      // }
    },
    submitForm(v) {
      this.$refs[v].validate(valid => {
        if (valid) {
          // let isP=/([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/
          // let  result = isP.test(this.ruleForm.input3);
          // if(this.ruleForm && this.ruleForm.data1 && this.ruleForm.data2 && this.ruleForm.input3){
          let pg = {
            //shotTime:+"_"+this.ruleForm.data1[1]+" 23:59:59",
            startTime: formatDate(this.ruleForm.data1),
            endTime: formatDate(this.ruleForm.data2),
            //shotTime:this.ruleForm.data1[0]+"_"+this.ruleForm.data1[1],
            // minSnapNum: this.ruleForm.input4 || 0,
            plateNo: this.ruleForm.input3
          }
          // if(this.ruleForm.input5==1 && this.ruleForm.value1.length!=0){
          //   pg.areaIds=this.ruleForm.value1.join(",")
          // }
          // if(this.ruleForm.input5==2){
          //    pg.deviceIds=this.selectDevice.join(",")
          //    pg.bayonetIds=this.selectBayonet.join(",")
          // }
          
          // if(!result){
          //   if(!document.querySelector('.el-message--info')){
          //      this.$message.info("请输入正确的车牌号码。");
          //   }
            
          //    return;
          // }
    
          this.getVehicleShot(pg);
          // }else{
          //   if(!document.querySelector('.el-message--info')){
          //    this.$message.info("请输入开始时间和车牌号码。");
          //   }
          // }

        }
      })
    },
    resetForm(v){
      this.$refs[v].resetFields();
      this.ruleForm.data1 = dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000));
      this.ruleForm.data2 = new Date();
      this.ruleForm.input3=null
      // this.ruleForm.input4=3
      // this.ruleForm.input5="1"
      // this.ruleForm.value1=null
      // this.selectDevice=[]
      // this.selectBayonet=[]
      // this.selectValue="已选设备0个"
    },
    //查询行政区域
    getMapGETmonitorList(){
      let d={
        areaUid:mapXupuxian.adcode
      }
      MapGETmonitorList(d).then(res=>{
        if(res && res.data){
          this.options.push(res.data)
           res.data.areaTreeList.forEach(el=>{
            this.ruleForm.value1.push(el.areaId)
          })
          
        }
      })
    },
    compare  (prop) {
        return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 < val2) {
            return 1;
        } else if (val1 > val2) {
            return -1;
        } else {
            return 0;
        }            
      } 
    },
    getVehicleShot(d) {
      this.isload=true
      getVehicleShot(d).then(res => {
        if (res) {
          this.isload=false
          // console.log(res);
          this.reselt = true;
          if (!res.data || res.data.length === 0) {
            if(!document.querySelector('.el-message--info')){
             this.$message.info("抱歉，没有找到匹配结果");
            }
            this.evData=[]
            this.amap.clearMap();
            return false;
          }
          this.evData = res.data;
          this.amap.clearMap();
          this.evData.sort(this.compare("stopOverTime"))
          this.drawMarkers(this.evData);
        }else{
          this.isload=false
        }
      });
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
    //查询所有的卡口设备
    getAllBayonetList(){
      getAllBayonetList({
        areaId:mapXupuxian.adcode
      }).then(res=>{
          //  console.log(res.data);
          if(res.data && res.data.length>0){
            this.allBayonet=res.data
          }
          
      })
    },
    drawMarkers(data) {
      let _this = this
      for (let i = 0; i < data.length; i++) {
        let obj = data[i];
          // 摄像头
        let _id = "vlVehicleLjdSxt" + i;
        let _content =
          "<div id=" +
          _id +
          ' class="vl_icon vl_jfo_sxt vl_icon_judge_04"></div>';
        let marker = new AMap.Marker({
          // 添加自定义点标记
          map: this.amap,
          position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
          offset: new AMap.Pixel(-28.5, -50), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          extData: obj,
          // 自定义点标记覆盖物内容
          content: _content,
          zIndex: 100
        });
        marker.on('mouseover', function () {
          $("#" + _id).addClass("vl_icon_judge_02");
          _this.createInfoWindow(obj)
        })
        marker.on('mouseout', function () {
          $("#" + _id).removeClass("vl_icon_judge_02");
        })
      }
      this.amap.setFitView();
    },
    createInfoWindow (obj) {
      let _sContent = `<div class="vl_vehicle_ljd_mk_p"><img class="igm" src="${obj.storagePath}"><p class='addres'>${obj.address} <i class='el-icon-caret-right'></i></p><p class='times'>${transMinute(obj.stopOverTime)}</p></div>`;
      this.hoverWindow = new window.AMap.InfoWindow({
        isCustom: true,
        closeWhenClickMap: true,
        offset: new window.AMap.Pixel(-2, -50), // 相对于基点的偏移位置
        content: _sContent
      });
      this.hoverWindow.open(this.amap, new window.AMap.LngLat(obj.shotPlaceLongitude, obj.shotPlaceLatitude));
      this.curInfoWinVideoPath = obj.videoPath;
      this.amap.setCenter([obj.shotPlaceLongitude, obj.shotPlaceLatitude])
    },
    showVideo(path){
      this.mapVideoData = {
        name: Math.random(),
        url: path
      }
    }
  },
  beforeDestroy () {
    if (this.amap) {
      this.amap.destroy();
    }
    $('body').unbind('click');
  }
};
</script>
<style lang="scss" scoped>
.map_rrt_u2 {
    position: absolute; right: 30px;
    bottom: 30px;
    margin-top: .2rem;
    font-size: 26px;
    background: #ffffff;
    width: 78px;
    padding: 0 10px;
    > li {
      line-height: 70px;
      text-align: center;
      cursor: pointer;
      border-bottom: 1px solid #F2F2F2;
      > i {
        margin-top: 0;
        display: inline-block;
      }
      color: #999999;
      &:hover {
        color: #0C70F8;
      }
    }
  }
.point {
  width: 100%;
  height: 100%;
}
.breadcrumb_heaer {
  background: #ffffff;
}
.full {
  width: 100%;
}
.insetPadding {
  padding: 10px;
}
.right.hide {
  width: calc(100% - 272px);
  height: calc(100% - 54px);
  float: right;
}
.right {
  width: 100%;
  height: calc(100% - 54px);
  float: right;
}
.reselt {
  width: 272px;
  height: calc(100% - 54px);
  background-color: #ffffff;
  position: absolute;
  left: 275px;
  z-index: 2;
  box-shadow: 4px 0px 10px 0px #838383;
  box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
  animation: fadeInLeft 0.4s ease-out 0.3s both;
  overflow: hidden;
  .title {
    font-size: 14px;
    font-weight: bold;
    padding-bottom: 12px;
  }
}
.left.hide {
  margin-left: -272px;
  transition: marginLeft 0.3s ease-in;
  position: relative;
  z-index: 2;
  // animation: fadeOutLeft 0.4s ease-out 0.3s both;
}
.left {
  position: relative;
  width: 272px;
  height: calc(100% - 54px);
  background-color: #ffffff;
  float: left;
  z-index: 1;
  margin-left: 0px;
  box-shadow: 4px 0px 10px 0px #838383;
  box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
  animation: fadeInLeft 0.4s ease-out 0.3s both;
  transition: marginLeft 0.3s ease-in;
  .plane {
    padding: 20px;
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
    margin-bottom: 5px;
  }
}
.insetLeft,.insetLeft2 {
  position: absolute;
  right: -28px;
  width: 25px;
  height: 178px;
  top: 50%;
  margin-top: -89px;
  display: inline-block;
  background-repeat: no-repeat;
  transform: rotate(180deg);
  background-image: url(../../../../../assets/img/icons.png);
  background-position: -380px -1269px;
  cursor: pointer;
}
.hide {
  .insetLeft {
    transform: rotate(180deg);
    background-position: -504px -1269px;
  }
  .insetLeft:hover{
    transform: rotate(180deg);
    background-position: -440px -1269px;
  }
  
}
.insetLeft2:hover,.insetLeft:hover {
  position: absolute;
  right: -28px;
  width: 28px;
  height: 178px;
  top: 50%;
  margin-top: -89px;
  display: inline-block;
  background-repeat: no-repeat;
  transform: rotate(180deg);
  background-image: url(../../../../../assets/img/icons.png);
  background-position: -318px -1269px;
  cursor: pointer;
}
.select_btn {
  background-color: #0c70f8;
  color: #ffffff;
}
.select_btn:hover {
   background-color: #0466de;
}
.video_box {
  position: fixed;
  left:0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
}
.vl_map_video_box {
  // position: fixed!important;
  width: 100%;
  height: 100%;
  // top: 0!important;
}
</style>
<style lang="scss">
.ljd{
  .el-dialog__wrapper{
  .el-dialog{
    height: auto;
    min-height: 80vh;
  }
}
}

.vl_vehicle_ljd_mk_p {
  /*display: none;*/
  position: relative;
  width: 180px;
  height: auto;
  background: #ffffff;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  box-shadow: 4px 0px 10px 0px #838383;
  box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
  .times{
    position: absolute;
    left: 10px;
    top: 10px;
    background: #50CC62;
    padding: 0px 8px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    color: #ffffff;
  }
  .addres{
    right: 10px;
    text-align: left;
    position: absolute;
    left: 10px;
    bottom: 10px;
    color: #ffffff;
    i{
      float: right;
      font-size: 24px;;
    }
  }
  .igm{
    width: 100%;
    height: 100px;
    background: #666666;
  }
  .big {
    font-size: 16px;
    font-weight: bold;
  }
  &:after {
    border-bottom-color: rgba(0, 0, 0, 1);
    content: "";
    display: inline-block;
    position: absolute;
    left: 50%;
    margin-left: -10px;
    bottom: -10px;
    border-top: 10px solid #fff;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
  }
  &.vl_jig_mk_img_show{
    display: block;
  }
  &.vl_jig_mk_img_hover {
    &:after {
      border-bottom-color: rgba(0, 0, 0, 1);
      content: "";
      display: inline-block;
      position: absolute;
      left: 50%;
      margin-left: -10px;
      bottom: -10px;
      border-top: 10px solid #0c70f8;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
    }
    background: rgba(12, 112, 248, 1);
    position: relative;
    border: 0.04rem solid #0c70f8;
    > p {
      color: #ffffff;
    }
  }
}
.ljd {
  .el-date-editor .el-range-input{
    font-size: 13px;
  }
  .el-dialog__wrapper .el-dialog__body {
    padding: 0px;
  }
  .el-dialog__header {
    padding: 0px 20px 3px;
  }
  .el-dialog__headerbtn {
    z-index: 1;
  }
  .el-form-item__label{
  padding-right: 0px;
}
}
</style>
