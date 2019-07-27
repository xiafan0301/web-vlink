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
          status-icon
          ref="ruleForm"
          :rules="rules"
          label-width="0px"
          class="demo-ruleForm"
        >
        <el-form-item  prop="data1">
            <el-date-picker
              v-model="ruleForm.data1"
              type="date"
              placeholder="开始时间"
              :picker-options="pickerOptions"
              class="full vl_date"
              :clearable="false"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item  prop="data2">
            <el-date-picker
              v-model="ruleForm.data2"
              :clearable="false"
              type="date"
              :picker-options="pickerOptions"
              placeholder="结束时间"
              class="full vl_date vl_date_end"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <!-- <el-form-item class="firstItem" prop="data1">
            <el-date-picker
          v-model="ruleForm.data1"
          type="daterange"
          :clearable="false"
          class="full vl_date"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
          </el-form-item> -->

          <el-form-item prop="input3">
            <p class="carCold">车牌：</p>
            <el-input placeholder="请输入车牌号" v-model="ruleForm.input3" class="input-with-select">
              <el-select>
                <el-option v-for="(item, index) in pricecode" :label="item" :value="item" :key="'cph_' + index"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <!-- <el-form-item prop="input4" >
            <el-row :gutter="5">
              <el-col :span="22">
                <div>
                  <el-input placeholder="不小于" v-model="ruleForm.input4" class="insetIput">
                    <i slot="prefix" class="inset">落脚点次数</i>
                  </el-input>
                </div>
              </el-col>
              <el-col :span="2">
                <div class="line40">次</div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="抓拍区域：" label-width="72px" prop="input5">
            <el-radio-group v-model="ruleForm.input5" @change="changeTab">
               <el-row :gutter="10">
                <el-col :span="12">
                  <el-radio label="1">列表选择</el-radio>
                </el-col>
                <el-col :span="12">
                  <div @click="clickTab">
                    <el-radio label="2">地图选择</el-radio>
                  </div>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="ruleForm.input5=='1'" prop="value1">
            <el-select v-model="ruleForm.value1" multiple collapse-tags placeholder="请选择" class="full">
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
          <el-form-item v-if="ruleForm.input5=='2'" >
            <el-input  v-model="selectValue" :disabled="true">
            </el-input>
          </el-form-item> -->
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
        <el-table :data="evData" style="width: 100%">
          <el-table-column  type="index" :show-overflow-tooltip="true" label="序号"></el-table-column>
          <el-table-column  prop="address" :show-overflow-tooltip="true" label="落脚点位置"></el-table-column>
          <el-table-column prop="stopOverTime" width="110px" sortable label="停留时长">
            <template slot-scope="scope">
              <span>{{ scope.row.stopOverTime | transMinute }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="insetLeft2" @click="hideResult"></div>
      </div>
    </div>
<!-- 视频播放 -->
<el-dialog :visible.sync="dialogVisible" width="100%" style="height:100vh;">
    <div style="width:100%; height:100%">
      <div is="flvplayer" :index="1" :oData="playUrl" :bResize="bResize" :oConfig="{fit: false, sign: false, close: false, pause: true,fullscreen:false}"  ></div>
    </div>
  </el-dialog>
    <!-- 地图选择 -->
    <!-- <el-dialog :visible.sync="dialogVisible" width="80%">
        <mapselect @selectMap="mapPoint" @closeMap="hideMap" :allPoints="allDevice" :allBayonets="allBayonet"></mapselect>
    </el-dialog> -->
    <!-- D设备 B卡口  这里是设备和卡口 -->
    <!-- <div is="mapSelector" :open="dialogVisible" :showTypes="'DB'" @mapSelectorEmit="mapPoint"></div> -->
  </div>
</template>
<script>
import flvplayer from '@/components/common/flvplayer.vue';
import { mapXupuxian } from "@/config/config.js";
import { cityCode } from "@/utils/data.js";
import { transMinute } from '@/utils/util.js';
import { getVehicleShot,getAllDevice } from "@/views/index/api/api.judge.js";
import { getAllBayonetList } from "@/views/index/api/api.base.js";
import { MapGETmonitorList } from "@/views/index/api/api.map.js";
// import mapselect from "@/views/index/components/common/mapSelect";
import mapSelector from '@/components/common/mapSelector.vue';
export default {
  components: {
    mapSelector,
    flvplayer
  },
  data() {
    return {
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
        data1:null,
        data2:null,
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
             required: true, message: '请输入正确车牌', trigger: 'blur'
          },{
            pattern:/([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/,
            message: '常规格式：湘A12345',
            trigger: 'blur'
            }]
       },
      pricecode:cityCode,
     
      options: [],
      evData: [],
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
            return time.getTime() > Date.now() || time.getTime() < threeMonths;
          }
        },
    };
  },
  mounted() {
    //this.getControlMap(1);
    this.setDTime();
    let pNo=this.$route.query.plateNo
    //this.select = pNo?pNo.substring(0,1):"湘";
    this.ruleForm.input3 = pNo;
    let map = new window.AMap.Map("mapBox", {
      zoom: 10,
      center: mapXupuxian.center
    });
    map.setMapStyle("amap://styles/whitesmoke");
    this.amap = map;
    this.getMapGETmonitorList()//查询行政区域
    // this.getAllDevice() //查询所有的设备
    // this.getAllBayonetList() //查询所有的卡口
    
  },
  methods: {
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
      this.ruleForm.data1 = _s
      this.ruleForm.data2 =  _s
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
      let isP=/([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/
      let  result = isP.test(this.ruleForm.input3);
      if(this.ruleForm && this.ruleForm.data1 && this.ruleForm.data2 && this.ruleForm.input3){
      let pg={
        //shotTime:+"_"+this.ruleForm.data1[1]+" 23:59:59",
        startTime:this.ruleForm.data1+" 00:00:00",
        endTime:this.ruleForm.data2+" 23:59:59",
        //shotTime:this.ruleForm.data1[0]+"_"+this.ruleForm.data1[1],
        // minSnapNum: this.ruleForm.input4 || 0,
        plateNo: this.ruleForm.input3 ,
      }
      // if(this.ruleForm.input5==1 && this.ruleForm.value1.length!=0){
      //   pg.areaIds=this.ruleForm.value1.join(",")
      // }
      // if(this.ruleForm.input5==2){
      //    pg.deviceIds=this.selectDevice.join(",")
      //    pg.bayonetIds=this.selectBayonet.join(",")
      // }
      
      if(!result){
        if(!document.querySelector('.el-message--info')){
           this.$message.info("请输入正确的车牌号码。");
        }
        
         return;
      }

      this.getVehicleShot(pg);
      }else{
        if(!document.querySelector('.el-message--info')){
         this.$message.info("请输入开始时间和车牌号码。");
        }
      }
    },
    resetForm(v){
     
      this.setDTime() 
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
            //this.searching = false;
            return false;
          }
          this.evData = res.data.map(x => {
            x.checked = false;
            return x;
          });
        //  console.log(this.evData);
          
          this.amap.clearMap();
          this.evData.sort(this.compare("shotNum"))
          this.drawMarkers(this.evData);
          //this.showEventList();
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
      //console.log(data);
      // let limit = 0
      // if(data.length > 3){
      //    limit= data[2].shotNum
      // }
      let _this = this
      for (let i = 0; i < data.length; i++) {
        let obj = data[i];
        let _idWin = "vlJfoImg" + i;
        // let isBig = obj.shotNum >= limit?true:false
       // if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
            let _sContent = `<div id="${_idWin}" class="vl_jig_mk_p"><img class="igm" src="${obj.storagePath}"><p class='addres'>${obj.address} <i class='el-icon-caret-right'></i></p><p class='times'>${transMinute(obj.stopOverTime)}</p></div>`;
            // 窗体
            let marker = new AMap.Marker({
              // 添加自定义点标记
              map: this.amap,
              position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
              offset: new AMap.Pixel(-90, -184), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: obj,
              // 自定义点标记覆盖物内容
              content: _sContent,
              zIndex: 1000
            });
            // let clickWindow = new window.AMap.InfoWindow({
            //   isCustom: true,
            //   closeWhenClickMap: false,
            //   offset: new window.AMap.Pixel(0, -40), // 相对于基点的偏移位置
            //   content: obj.sContent
            // });
            // clickWindow.open(self.amap, new window.AMap.LngLat(obj.shotPlaceLongitude, obj.shotPlaceLatitude));
            //obj.sContent=_sContent
            
          // 打开弹窗
          
          // 摄像头
            let _id = "vlJfoSxt" + i;
            let _content =
              "<div id=" +
              _id +
              ' class="vl_icon vl_jfo_sxt vl_icon_judge_04"></div>';
            marker = new AMap.Marker({
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
            setTimeout(() => {
              this.addListen($("#" + _id), "mouseover", i,obj);
              this.addListen($("#" + _id), "mouseout", i, obj);
              // this.addListen($("#" + _id), "click", i, obj);
              this.addListen($("#" + _idWin), "click", i, obj);
              this.addListen($("#" + _idWin), "mouseover", i, obj);
              this.addListen($("#" + _idWin), "mouseout", i, obj);
              //this.addListen($("#" + _id), "click", i, obj);
            }, 300);
          // }
      //  }
      }
      this.amap.setFitView();
    },
    addListen(el, evType, key, obj = {}) {
      let self = this;
      let _key;
      el.bind(evType, function() {
        
        switch (evType) {
          case "mouseover":
            $("#vlJfoImg" + key).addClass("vl_jig_mk_img_show");
            $("#vlJfoSxt" + key).addClass("vl_icon_judge_02");
            break;
          case "mouseout":
            if (!obj.checked) {
              $("#vlJfoImg" + key).removeClass("vl_jig_mk_img_show");
              $("#vlJfoSxt" + key).removeClass("vl_icon_judge_02");
            }
            break;
          case "click":
            self.showVideo(obj);
            break;
        }
      });
    },
    
    showVideo(v){

     // console.log(v);
      this.dialogVisible=true
      this.playUrl = {
            type: 3,
            title: '',
            video: {
              uid: 1,
              downUrl: v.videoPath
            }
          }
      
    }
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

.vl_jig_mk_p {
  display: none;
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
