<template>
  <div class="ljd point">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/portrait/menu' }">人像侦查</el-breadcrumb-item>
        <el-breadcrumb-item>落脚点分析</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div :class="['left',{hide:hideleft}]">
      <div class="plane">
        <el-form
        :rules="rules"
          :model="ruleForm"
          status-icon
          ref="ruleForm"
          label-width="0px"
          class="demo-ruleForm"
        >
          <el-form-item>
            <div class="upload_warp" @drop="drop($event)" @dragover="allowDrop($event)">
              <el-upload
                @drop="drop($event)"
                :class="{'vl_jtc_upload': true}"
                :show-file-list="false"
                accept="image/*"
                :action="uploadAcion"
                list-type="picture-card"
                :before-upload="beforeAvatarUpload"
                :on-success="uploadSucess"
                :on-error="handleError"
              >
                <i v-if="uploading" class="el-icon-loading"></i>
                <img v-else-if="curImageUrl" :src="curImageUrl">
                <div v-else>
                  <i
                    style="width: 100px;height: 85px;opacity: .5; position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto;"
                    class="vl_icon vl_icon_vehicle_01"
                  ></i>
                  <span>点击上传图片</span>
                </div>
              </el-upload>
              <p @click="showHistoryPic">从上传记录中选择</p>
              <div v-show="curImageUrl" class="del_icon">
                <i class="el-icon-delete" @click="delPic"></i>
              </div>
            </div>
          </el-form-item>
          <el-form-item prop="data1">
            <el-date-picker
              v-model="ruleForm.data1"
              type="daterange"
              class="full vl_date"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              range-separator="至"
              :clearable="false"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="minFootholdTimes" class="firstItem">
            <el-row :gutter="5">
              <el-col :span="22">
                <div>
                  <el-input placeholder="不小于" v-model="ruleForm.minFootholdTimes" class="insetIput">
                    <i slot="prefix" class="inset">落脚点次数</i>
                  </el-input>
                </div>
              </el-col>
              <el-col :span="2">
                <div class="line40">次</div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item class="firstItem" label="抓拍区域：" label-width="72px" prop="input5">
            <!-- <el-radio-group v-model="input5" @change="changeTab"> -->
            <el-radio-group v-model="ruleForm.input5" @change="changeTab">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-radio label="1">列表选择</el-radio>
                </el-col>
                <el-col :span="12">
                  <div @click.stop="clickTab">
                    <el-radio label="2">地图选择</el-radio>
                  </div>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="ruleForm.input5=='1'" prop="value1">
            <el-select
              v-model="ruleForm.value1"
              multiple
              collapse-tags
              placeholder="请选择"
              class="full"
            >
              <el-option-group
                v-for="group in options"
                :key="group.areaName"
                :label="group.areaName"
              >
                <el-option
                  v-for="item in group.areaTreeList"
                  :key="item.areaId"
                  :label="item.areaName"
                  :value="item.areaId"
                ></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item v-if="ruleForm.input5=='2'">
            <el-input v-model="selectValue" :disabled="true"></el-input>
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
        <div class="limitBox">
          <vue-scroll>
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item  v-for="(item,index) in evData" :key="index" :title="item.groupName+'（'+item.totalNum+'次）'" :name="index">
              <div class="itembox" v-for="(v,d) in item.personDetailList">
                <div class="imgInfo"  @click.stop="onOpenDetail(v , item)">
                   <img :src="v.subStoragePath" class="img">
                   <div>
                     <p class="timedata"><i class="el-icon-time"></i>{{v.shotTime}}</p>
                    <span class="subdata">
                      <i class="vl_icon vl_icon_retrieval_03"></i>
                      <b v-if="v.semblance">{{(v.semblance*1).toFixed(2)}}</b>%
                    </span>
                   </div>
                  <i class="del el-icon-delete" @click.stop="delItems(d,index)"></i>
                </div>
              </div>
              
            </el-collapse-item>
            
          </el-collapse>
          </vue-scroll>
        </div>
        <div class="insetLeft2" @click="hideResult"></div>
      </div>
    </div>

    <!-- 地图选择 -->
    <!-- D设备 B卡口  这里是设备和卡口 -->
    <div is="mapSelector" :open="dialogVisible" :showTypes="'DB'" @mapSelectorEmit="mapPoint" ></div>
    <!-- <el-dialog :visible.sync="dialogVisible" width="80%">
      <mapselect
        @selectMap="mapPoint"
        @closeMap="hideMap"
        :allPoints="allDevice"
        :allBayonets="allBayonet"
      ></mapselect>
    </el-dialog> -->
    <!-- 人工筛选 -->
    <el-dialog
      title="人工筛选"
      :visible.sync="dialogChoose"
      width="900px">
      <div class="choose">
        <div class="limitBox">
          <vue-scroll>
          <el-collapse v-model="activeChoose" @change="handleChange">
            <el-collapse-item  v-for="(item,index) in chooseData" :key="index" :title="item.groupName+'（'+item.totalNum+'次）'" :name="index">
              <div class="itembox" v-for="(v,d) in item.personDetailList">
                <div class="imgInfo">
                   <img :src="v.subStoragePath" class="img">
                   <div>
                     <p class="timedata"><i class="el-icon-time"></i>{{v.shotTime}}</p>
                    <span class="subdata">
                      <i class="vl_icon vl_icon_retrieval_03"></i>
                      <b v-if="v.semblance">{{(v.semblance*1).toFixed(2)}}</b>%
                    </span>
                   </div>
                  <i class="del el-icon-delete" @click="delItem(d,index)"></i>
                </div>
              </div>
              
            </el-collapse-item>
            
            
          </el-collapse>
          </vue-scroll>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogChoose = false">取 消</el-button>
        <el-button type="primary" @click="chooseOk">确 定</el-button>
      </span>
    </el-dialog>

    
    <!--上传记录弹窗-->
    <el-dialog
      :visible.sync="historyPicDialog"
      class="history-pic-dialog"
      :close-on-click-modal="false"
      top="4vh"
      title="最近上传的图片"
    >
      <div style="text-align: center;font-size: 20px;" v-if="loadingHis">
        <i class="el-icon-loading"></i>
      </div>
      <vue-scroll class="his-pic-box" v-else-if="historyPicList.length">
        <div
          class="his-pic-item"
          :class="{'active': item.checked}"
          v-for="item in historyPicList"
          :key="item.uid"
          @click="chooseHisPic(item)"
        >
          <img :src="item.path" alt>
        </div>
        <div style="clear: both;"></div>
      </vue-scroll>
      <p v-else>暂无历史记录</p>
      <div slot="footer">
        <el-button @click="historyPicDialog = false">取消</el-button>
        <el-button type="primary" @click="addHisToImg" :disabled="choosedHisPic.length === 0">确认</el-button>
      </div>
    </el-dialog>
<!-- 抓拍信息 -->
     
    <portraitDetail :open="showDetail" @closeDialog="onCloseDetail" :detailData="deData" :scrollData="seData" :showItem="true" ></portraitDetail>
  </div>
</template>
<script>
import { ajaxCtx, mapXupuxian } from "@/config/config.js";
import { cityCode } from "@/utils/data.js";
import flvplayer from '@/components/common/flvplayer.vue';
import {
  getVehicleShot,
  getAllDevice,
  JtcPUTAppendixsOrder,
  JtcPOSTAppendixInfo,getFoothold,JtcGETAppendixInfoList
} from "@/views/index/api/api.judge.js";
import { getAllBayonetList } from "@/views/index/api/api.base.js";
import { MapGETmonitorList } from "@/views/index/api/api.map.js";
// import mapselect from "@/views/index/components/common/mapSelect";
import mapSelector from '@/components/common/mapSelector.vue';
import portraitDetail from '@/components/common/portraitDetail.vue';
import { log } from 'util';
export default {
  components: {
    mapSelector,
    flvplayer,
    portraitDetail
  },
  data() {
    return {
      rules: {
        minFootholdTimes: [
          {
            //pattern: /^[0-9]?$/,
            pattern: /^(0|([1-9]\d{0,2}))$/,
            trigger: "blur",
            message: "请输入不大于999的整数值"
          }
        ]
      },
      deData:null,
      seData:null,
      isload:false,
      dialogChoose:false,
      showDetail:false,
      pickerOptions: {
        disabledDate (time) {
          let date = new Date();
          let curDate = date.getTime();
          let curS = 30 * 24 * 3600 * 1000;
            let _sm =(new Date(curDate - curS).getMonth() + 1)>9?(new Date(curDate - curS).getMonth() + 1):("0"+(new Date(curDate - curS).getMonth() + 1))
          let _sd = new Date(curDate - curS).getDate()>9? new Date(curDate - curS).getDate() : ("0"+ new Date(curDate - curS).getDate())
          let _em = (date.getMonth() + 1)>9?(date.getMonth() + 1):("0"+(date.getMonth() + 1))
          let _ed =  date.getDate()>9?date.getDate():("0"+ date.getDate())
          let start = new Date(curDate - curS).getFullYear() +
        "-" + _sm + "-" +_sd;
          let threeMonths = new Date(start).getTime();
          return time.getTime() > Date.now() || time.getTime() < threeMonths;
        }
      },
    
      /* 上传图片变量 */
      uploadAcion: ajaxCtx.base + "/new", //上传路径
      uploading: false, // 是否上传中
      curImageUrl: "", // 当前上传的图片
      historyPicList: [], // 上传历史记录
      selectedHistoryPic: null, // 当前选中的历史图片
      historyPicDialog: false,
      loadingHis: false, // 加载效果
      imgData: null,
      dialogVisible: false,
      amap: null,
      allDevice: [],
      allBayonet: [],
      selectDevice: [],
      selectBayonet: [],
      selectValue: "已选设备0个",
      // select: "",
      reselt: false,
      hideleft: false,
      ruleForm: {
        data1: null,
        minFootholdTimes: 3,
        input5: "1",
        value1: null
      },
      activeNames: [],
      activeChoose: [],
      pricecode: cityCode,
      chooseData:[],
      options: [],
      evData: []
    };
  },
  mounted() {
    if( this.$route.query.imgurl || this.$route.query.path){
      let a =  this.$route.query.imgurl || this.$route.query.path ;
      this.curImageUrl= a
    }
    

    //this.getControlMap(1);
    this.setDTime()
    let map = new window.AMap.Map("mapBox", {
      zoom: 10,
      center: mapXupuxian.center
    });
    map.setMapStyle("amap://styles/whitesmoke");
    this.amap = map;
    this.getMapGETmonitorList(); //查询行政区域
    // this.getAllDevice(); //查询所有的设备
    // this.getAllBayonetList(); //查询所有的卡口
  },
   computed: {
    choosedHisPic() {
      return this.historyPicList.filter(x => x.checked);
    }
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
      this.ruleForm.data1 = [_s, _s]
    },
    /**
     * 弹框地图初始化
     */
    initMap () {
      // this.map.setZoomAndCenter(iZoom, aCenter);
      let map = new window.AMap.Map('container', {
        zoom: 14, // 级别
        center: [this.strucInfoList[0].longitude, this.strucInfoList[0].latitude], // 中心点坐标
      });
      map.setMapStyle('amap://styles/whitesmoke');
      this.map = map;
      this.drawPoint(this.strucInfoList[0])
    },
    /**
     * 地图描点
     */
    drawPoint (data) {
      console.log(data)
      if (this.markerPoint) {
        this.map.remove(this.markerPoint)
      }
      let _content = '<div class="vl_icon vl_icon_judge_02"></div>'
      this.markerPoint = new window.AMap.Marker({ // 添加自定义点标记
        map: this.map,
        position: [data.longitude, data.latitude], // 基点位置 [116.397428, 39.90923]
        offset: new window.AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // 自定义点标记覆盖物内容
        content: _content
      });
      this.map.setZoomAndCenter(16, [data.longitude, data.latitude]); // 自适应点位置
      let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`
      this.infoWindow = new window.AMap.InfoWindow({
        map: this.map,
        isCustom: true,
        closeWhenClickMap: false,
        position: [data.longitude, data.latitude],
        offset: new window.AMap.Pixel(0, -70),
        content: sConent
      })
    },
     /**
     * 打开抓拍弹框
     */
    onOpenDetail (obj,list) {
      this.showDetail=true;
      this.deData = obj
      this.seData = list.personDetailList
      // console.log(obj)
    },
    /**
     * 关闭抓拍弹框
     */
    onCloseDetail () {
      this.showDetail=false
    },
    /**
     * 图片切换
     */
    imgListTap (obj, i) {
      this.curImgIndex = i
    },
    handleChange(val) {
        console.log(val);
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
      //  console.log(12,this.dialogVisibles);
      this.dialogVisible = !this.dialogVisible;
      // if (!this.dialogVisible) {
      //   this.dialogVisible = true;
      //   this.dialogVisibles = !this.dialogVisibles;
      // }
    },
    // hideMap() {
    //   this.dialogVisibles = false;
    // },
    mapPoint(data) {
      let v = data.deviceList;
      let p = data.bayonetList;
      //this.dialogVisible = false;
      this.selectDevice = [];
      this.selectBayonet = [];
      //返回有效点集合
      if (v && v.length > 0) {
        v.forEach(element => {
          this.selectDevice.push(element.uid);
        });
      }
      if (p && p.length > 0) {
        p.forEach(element => {
          this.selectBayonet.push(element.uid);
        });
      }
      if(p.length==0 && v.length==0){
        if(!document.querySelector('.el-message--info')){
           this.$message.info("选择的区域没有设备，请重新选择区域");
        }
        return
      }
      this.selectValue =
        "已选设备" +
        (this.selectDevice.length + this.selectBayonet.length) +
        "个";
      //this.selectDevice=v

      // console.log(this.selectDevice);
    },
    changeTab(v) {
      //console.log(v);
      if (v == "2") {
        //this.dialogVisibles = !this.dialogVisibles;
        //this.dialogVisibles = true;
      } else{
        //this.dialogVisible=false
      }
    },
    submitForm(v) {

      if (
        this.ruleForm &&
        this.ruleForm.data1 &&
        this.ruleForm.data1.length > 0 &&
        this.curImageUrl
      ) {
        let pg = {
          startDate: this.ruleForm.data1[0] + " 00:00:00",
          endDate: this.ruleForm.data1[1] + " 23:59:59",
          minFootholdTimes: this.ruleForm.minFootholdTimes || 0,
        };
        if (this.ruleForm.input5 == 1 && this.ruleForm.value1.length != 0) {
          pg.areaIds = this.ruleForm.value1.join(",");
        }
        if (this.ruleForm.input5 == 2) {
          pg.cameraIds = this.selectDevice.join(",");
          pg.bayonetIds = this.selectBayonet.join(",");
        }
        pg.personPicUrl = this.curImageUrl
        this.getFoothold(pg);
      } else {
        this.$message.info("请上传图片。");
      }
    },
    resetForm(v) {
      this.curImageUrl = "";
      this.setDTime()
      this.ruleForm.minFootholdTimes=3 
      this.ruleForm.input5='1'
      this.ruleForm.value1=[]
      this.options[0].areaTreeList.forEach(el=>{
            this.ruleForm.value1.push(el.areaId)
          })
      //this.$refs[v].resetFields();
    },
    //查询行政区域
    getMapGETmonitorList() {
      let d = {
        areaUid: mapXupuxian.adcode
      };
      MapGETmonitorList(d).then(res => {
        if (res && res.data) {
          this.options.push(res.data);
          //res.data.
          // console.log(res.data);
          res.data.areaTreeList.forEach(el=>{
            this.ruleForm.value1.push(el.areaId)
          })
          //this.ruleForm.value1=[]
        }
      });
    },
    compare(prop) {
      return function(obj1, obj2) {
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
      };
    },
    //分析结果删除
    delItems(d,index){ 
      //this.chooseData.
      let arr=this.evData[index].personDetailList
      arr.splice(d, 1)
      this.evData[index].totalNum -=1;
      if(this.evData[index].totalNum==0){
        this.evData.splice(index,1)
      }
      this.amap.clearMap();
      this.drawMarkers(this.evData);
    },
    //人工筛选删除
    delItem(d,index){ 
      //this.chooseData.
      let arr=this.chooseData[index].personDetailList
      arr.splice(d, 1)
      this.chooseData[index].totalNum -=1;
      if(this.chooseData[index].totalNum==0){
        this.chooseData.splice(index,1)
      }
    },
    chooseOk(){
      this.reselt = true;
      this.dialogChoose = false
     // this.evData = this.chooseData
      this.evData = this.chooseData.map(x => {
            x.checked = false;
            return x;
          });
      for(let i=0; i<this.evData.length;i++){
          this.activeNames.push(i)
          this.evData[i].shotPlaceLongitude = this.evData[i].personDetailList[0].shotPlaceLongitude
          this.evData[i].shotPlaceLatitude = this.evData[i].personDetailList[0].shotPlaceLatitude
          //obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude
        }
        this.evData.sort(this.compare("totalNum"));
        this.drawMarkers(this.evData);
        //this.showEventList();
         //console.log();
          
    },
    getFoothold(d) {
      this.isload=true
      getFoothold(d).then(res => {
        if (res) {
          this.isload=false
          this.dialogChoose=true
          // console.log(res);
          
          if (!res.data || res.data.length === 0) {
            this.$message.info("抱歉，没有找到匹配结果");
            this.amap.clearMap();
            this.chooseData=[]
            this.evData=[]
            //this.searching = false;
            return false;
          }else{
            for(let i=0; i<res.data.length;i++){
              this.activeChoose.push(i)
            }
             this.chooseData=res.data
          }
          // this.evData = res.data.map(x => {
          //   x.checked = false;
          //   return x;
          // });
         
          this.amap.clearMap();
          //this.evData.sort(this.compare("shotNum"));
          //this.drawMarkers(this.evData);
          //this.showEventList();
        }else{
          this.isload=false
        }
      });
    },
    //查询所有的设备
    getAllDevice() {
      getAllDevice().then(res => {
        // console.log(res);
        if (res && res.data && res.data.length > 0) {
          this.allDevice = res.data;
        }
      });
    },
    //查询所有的卡口设备
    getAllBayonetList() {
      getAllBayonetList({
        areaId: mapXupuxian.adcode
      }).then(res => {
        if (res && res.data && res.data.length > 0) {
          this.allBayonet = res.data;
        }
      });
    },
    drawMarkers(data) {
      //console.log(data);
      let limit = 0;
      if (data.length > 3) {
        limit = data[2].totalNum;
      }

      for (let i = 0; i < data.length; i++) {
        let obj = data[i];
        let _idWin = "vlJfoImg" + i;
        let isBig = obj.totalNum >= limit ? true : false;
        if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
          if (isBig) {
            let _sContent = `<div id="${_idWin}" class="vl_jig_mk_p"><p>${
              obj.groupName
            }</p><p class="big">${obj.totalNum}次</p></div>`;
            // 窗体
            new AMap.Marker({
              // 添加自定义点标记
              map: this.amap,
              position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
              offset: new AMap.Pixel(-90, -124), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              extData: obj,
              // 自定义点标记覆盖物内容
              content: _sContent
            });
          }
          // 摄像头
          let _id = "vlJfoSxt" + i;
          let _content =
            "<div id=" +
            _id +
            ' class="vl_icon vl_jfo_sxt vl_icon_judge_04"></div>';
          new AMap.Marker({
            // 添加自定义点标记
            map: this.amap,
            position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
            offset: new AMap.Pixel(-28.5, -50), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: _content
          });
          setTimeout(() => {
            this.addListen($("#" + _id), "mouseover", i);
            this.addListen($("#" + _id), "mouseout", i, obj);
            this.addListen($("#" + _id), "click", i, obj);
          }, 300);
        }
      }
      this.amap.setFitView();
    },
    addListen(el, evType, key, obj = {}) {
      let self = this;
      let _key;
      el.bind(evType, function() {
        switch (evType) {
          case "mouseover":
            $("#vlJfoImg" + key).addClass("vl_jig_mk_img_hover");
            $("#vlJfoSxt" + key).addClass("vl_icon_judge_02");
            break;
          case "mouseout":
            if (!obj.checked) {
              $("#vlJfoImg" + key).removeClass("vl_jig_mk_img_hover");
              $("#vlJfoSxt" + key).removeClass("vl_icon_judge_02");
            }
            break;
          // case "click":
          //   _key = self.curVideo.indexNum;
          //   self.evData.forEach(z => {
          //     z.checked = false;
          //   });
          //   obj.checked = true;
          //   if (_key !== null) {
          //     $("#vlJfoImg" + _key).removeClass("vl_jig_mk_img_hover");
          //     $("#vlJfoSxt" + _key).removeClass("vl_icon_judge_02");
          //   }
          //   $("#vlJfoImg" + key).addClass("vl_jig_mk_img_hover");
          //   $("#vlJfoSxt" + key).addClass("vl_icon_judge_02");
          //   self.showVideo(obj);
          //   break;
        }
      });
    },
    /* 上传图片方法 */
    beforeAvatarUpload(file) {
      // 上传图片控制
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt = file.size / 1024 / 1024 < 100;
      if (!isJPG) {
        this.$message.error("只能上传 JPG / PNG 格式图片!");
      }
      if (!isLt) {
        this.$message.error("上传图片大小不能超过 100MB!");
      }
      this.uploading = true;
      return isJPG && isLt;
    },
    uploadSucess(response, file) {
      //上传成功
      this.uploading = false;
      console.log(file);
      if (response && response.data) {
        let oRes = response.data;
        if (oRes) {
          let x = {
            cname: oRes.fileName, // 附件名称 ,
            contentUid: this.$store.state.loginUser.uid,
            // desci: '', // 备注 ,
            filePathName: oRes.fileName, // 附件保存名称 ,
            fileType: 1, // 文件类型 ,
            imgHeight: oRes.fileHeight, // 图片高存储的单位位px ,
            imgSize: oRes.fileSize, // 图片大小存储的单位位byte ,
            imgWidth: oRes.fileWidth, //  图片宽存储的单位位px ,
            // otherFlag: '', // 其他标识 ,
            path: oRes.fileFullPath, // 附件路径 ,
            // path: oRes.path,
            thumbnailName: oRes.thumbnailFileName, // 缩略图名称 ,
            thumbnailPath: oRes.thumbnailFileFullPath // 缩略图路径 ,
            // uid: '' //  附件标识
          };
          JtcPOSTAppendixInfo(x).then(jRes => {
            if (jRes) {
              x["uid"] = jRes.data;
              console.log(x);
            }
          });
          this.imgData = x;
          this.curImageUrl = x.path;
        }
      }
    },
    /* 拖拽图片上传的方法 */
    drag(ev) {
      ev.dataTransfer.setData("Text", ev.target.currentSrc);
    },
    drop(e) {
      this.curImageUrl = e.dataTransfer.getData("Text");
      let x = {
        contentUid: this.$store.state.loginUser.uid,
        cname: "拖拽图片" + Math.random(),
        filePathName: "拖拽图片" + Math.random(),
        path: e.dataTransfer.getData("Text")
      };
      JtcPOSTAppendixInfo(x).then(jRes => {
        if (jRes) {
          x["uid"] = jRes.data;
          console.log(x);
        }
      });
    },
    allowDrop(e) {
      e.preventDefault();
    },
    handleError() {
      //上传失败
      this.uploading = false;
      this.$message.error("上传失败");
    },
     //选择最近上传的图片
    chooseHisPic(item) {
      this.historyPicList.forEach(x => {
        x.checked = false;
      });
      item.checked = true;
    },
    //获取上传记录
    showHistoryPic() {
      this.loadingHis = true;
      this.historyPicDialog = true;
      let params = {
        userId: this.$store.state.loginUser.uid,
        fileType: 1
      };
      JtcGETAppendixInfoList(params)
        .then(res => {
          if (res) {
            this.loadingHis = false;
            res.data.forEach(x => (x.checked = false));
            this.historyPicList = res.data;
          }
        })
        .catch(() => {
          this.historyPicDialog = false;
        });
    },
    //从历史上传图片中上传
    addHisToImg() {
      this.historyPicDialog = false;
      let _ids = [];
      this.choosedHisPic.forEach(x => {
        _ids.push(x.uid);
        this.curImageUrl = x.path;
        this.disab = false;
        this.imgData = x;
      });
      let _obj = {
        appendixInfoIds: _ids.join(",")
      };
      JtcPUTAppendixsOrder(_obj);
    },
    delPic() {
      //删除图片
      this.curImageUrl = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.fz12{
  font-size: 12px;
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
.insetLeft ,.insetLeft2{
  position: absolute;
  right: -28px;
  width: 25px;
  height: 178px;
  top: 50%;
  margin-top: -89px;
  display: inline-block;
  background-repeat: no-repeat;
  transform: rotate(180deg);
  background-image: url(../../../../assets/img/icons.png);
  background-position: -380px -1269px;
  cursor: pointer;
}
.insetLeft:hover,.insetLeft2:hover{
  position: absolute;
  right: -28px;
  width: 28px;
  height: 178px;
  top: 50%;
  margin-top: -89px;
  display: inline-block;
  background-repeat: no-repeat;
  transform: rotate(180deg);
  background-image: url(../../../../assets/img/icons.png);
  background-position: -318px -1269px;
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
.select_btn {
  background-color: #0c70f8;
  color: #ffffff;
}
.select_btn:hover{
   background-color: #0466de;
}
// 上传
.upload_warp {
  position: relative;
  height: 232px;
  max-height: 232px;
  overflow: hidden;
  cursor: pointer;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  &:hover {
    background: #2981f8;
    > p {
      display: block;
    }
    .del_icon {
      display: block;
    }
  }
  .vl_jtc_upload {
    width: 100%;
    height: 100%;
    background: none;
  }
  > p {
    display: none;
    position: absolute;
    bottom: 0;
    text-align: center;
    width: 100%;
    color: #ffffff;
    height: 40px;
    line-height: 40px;
    -webkit-border-radius: 0 0 10px 10px;
    -moz-border-radius: 0 0 10px 10px;
    border-radius: 0 0 10px 10px;
    background: #0c70f8;
  }
  .vl_jtc_ic_input {
    position: absolute;
    top: 0.2rem;
    width: 3rem;
    height: 0.26rem;
    left: 0.2rem;
    border: 1px solid #d3d3d3;
    -webkit-border-radius: 0.13rem;
    -moz-border-radius: 0.13rem;
    border-radius: 0.13rem;
    padding: 0 0.02rem;
    background: #ffffff;
    .el-form-item__content {
      height: 0.23rem;
      line-height: 0.23rem;
    }
    input {
      border: none !important;
      height: 0.23rem;
      line-height: 0.23rem;
    }
  }
  .del_icon {
    display: none;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background: rgba(0, 0, 0, 0.4);
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    color: #ffffff;
  }
}
.choose{
  height: 350px;
  padding: 0px 15px;
  overflow: hidden;
  .limitBox{
    .el-collapse-item{
    border: none;
    margin-top: 10px;
    box-shadow: 5px 5px 5px -5px #dddddd;
  }
    .itembox{
      
        width: 32.3%;
        margin-right: 1%;
        border: solid 1px rgba(211,211,211,1);
        padding: 10px 5px; 
        .imgInfo{
          display: flex;
          position: relative;
          .subdata{
            display: block;
            line-height: 28px;
          }
         
          .del{
            position: absolute;
            bottom: -10px;
            right: -5px;
            background: #999;
            color: #ffffff;
            padding: 4px;
            cursor: pointer;
          }
        }
      }
      .itembox:last-child{
   border: solid 1px rgba(211,211,211,1);
  }
  }
}
.del{
            position: absolute;
            bottom: -10px;
            right: -5px;
            background: #999;
            color: #ffffff;
            padding: 4px;
            cursor: pointer;
          }
.limitBox{
  height: 96%;
  .el-collapse-item{
    border: solid 1px rgba(211,211,211,1);
    margin-top: 10px;
  }
  .itembox:last-child{
  border: none;
  }
  
}

.plane{
  height: 100%;
}
.imgInfo{
  position: relative;
  .timedata{
    padding: 2px 6px;
    display: inline-block;
    background:rgba(250,250,250,1);
    border:1px solid rgba(242,242,242,1);
    border-radius:2px;
    i{
      margin-right: 2px;
      color: #999999;
    }
  }
  .subdata{
    color: #0c70f8;
    line-height: 36px;
    b{
      padding-left: 5px;
      font-size: 28px;
      
    }
  }
    .img{
      float: left;
      width: 62px;
      height: 62px;
      margin-right: 8px;
      // margin-bottom: 8px
      display: block;
    }
    &:after{
      display: block;
      content: "";
      clear: both;
    }
  }
  .itembox{
    margin-bottom: 10px;
    padding-bottom: 10px;
    margin-top: 10px;
    border-bottom: solid 1px #f2f2f2;
  }
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
</style>
<style lang="scss">
.choose{
  .el-collapse-item__content{
    display: flex;
        flex-direction: row;
    flex-wrap: wrap;
  }
}
.limitBox{
  height: 96%;

  .el-collapse-item{
    .el-collapse-item__header{
      background: #F6F6F6;
      padding-left: 10px;
      height: 40px;
      line-height: 40px;
    }
  }
  .el-collapse-item__content{
    padding: 10px;
  }
}
.vl_jig_mk_p {
  width: 180px;
  height: auto;
  background: #ffffff;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  box-shadow: 4px 0px 10px 0px #838383;
  box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
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
  .insetIput.el-input--prefix .el-input__inner {
    padding-left: 90px;
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
  .el-dialog__title{
    line-height: 48px;
  }
  // 上传
  .upload_warp .vl_jtc_upload {
    .el-upload {
      width: 100%;
      height: 100%;
      background: #f2f2f2;
      border: none;
      span {
        color: #999;
      }
      img {
        width: 100%;
        height: 100%;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
      }
    }
    .el-upload:hover{
      background: #0c70f8;
      span{
        color: #ffffff;
      }
    }
  }
  .el-form-item__label{
  padding-right: 0px;
}
.history-pic-dialog {
    .el-dialog {
      max-width: 12.6rem;
      width: 100% !important;
    }
    .el-dialog__title {
      font-size: 0.16rem;
      color: #333333;
    }
    .el-dialog__body {
      padding: 0 0.76rem 0.3rem;
    }
    .his-pic-box {
      width: 100%;
      height: 4.6rem !important;
      .his-pic-item {
        float: left;
        width: 1.38rem;
        height: 1.38rem;
        border: 0.02rem solid #ffffff;
        margin-right: 0.2rem;
        margin-bottom: 0.2rem;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .active {
        border-color: #0c70f8;
      }
    }
    .el-dialog__footer {
      button {
        width: 1.4rem !important;
        height: 0.4rem;
        line-height: 0.4rem;
        padding: 0;
      }
    }
  }
}
</style>
