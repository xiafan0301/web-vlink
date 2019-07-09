<template>
  <div class="vehicle-info">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>连续违法</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="vehicle-info-content">
      <!-- 搜索条件 -->
      <div class="info-left">
        <vue-scroll>
          <div>
            <el-radio-group v-model="input5" @change="changeTab">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-radio label="1">从图片提取</el-radio>
                </el-col>
                <el-col :span="12">
                  <el-radio label="2">自定义特征</el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </div>
          <!-- 上传 -->
          <div v-if="input5==1">
            <div class="vl_judge_tc_c_item">
              <el-upload
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
                    style="width: 100px;height: 85px;opacity: .5; position: absolute;top: 0;left: 0;right: 0;bottom: 0;margin: auto; color:#dddddd; font-size: 100px;"
                    class="vl_icon el-icon-camera-solid"
                  ></i>
                  <span>点击上传图片</span>
                </div>
              </el-upload>
              <p @click="showHistoryPic">从上传记录中选择</p>
              <div v-show="curImageUrl" class="del_icon">
                <i class="el-icon-delete" @click="delPic"></i>
              </div>
            </div>
            <div class="license-plate-search">
              <el-button type="primary" :disabled="curImageUrl==''" @click="getItem" :loading="searchings" class="select_btn full">获取特征</el-button>
              <div class="chara" v-if="photoAnalysis">
                <span v-if="photoAnalysis.plateNo">{{photoAnalysis.plateNo}}</span>
                <span>{{photoAnalysis.vehicleColor}}</span>
                <span>{{photoAnalysis.vehicleStyles}}</span>
                <span>{{photoAnalysis.vehicleRoof}}</span>
                <span>{{photoAnalysis.vehicleClass}}</span>
                <span>遮阳板{{photoAnalysis.sunvisor}}</span>
                <span v-if="photoAnalysis.plateColor">车牌{{photoAnalysis.plateColor}}色</span>
                <span v-if="plateType[photoAnalysis.plateClass*1-1].enumValue">{{plateType[photoAnalysis.plateClass*1-1].enumValue}}</span>
              </div>
            </div>
          </div>
           
          
          <div class="chbox" >
            <el-form :model="tzscMenuForm" ref="tzscMenuForm" :rules="rules">
              <div style="padding-right: 20px;" v-if="input5 == 2">
                <el-form-item label="号牌类型" label-width="70px" prop>
                  <el-select v-model="tzscMenuForm.licenseType" class="width132" placeholder="选择选项">
                    <el-option
                      v-for="item in plateType"
                      :key="item.enumValue"
                      :label="item.enumValue"
                      :value="item.enumValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="号牌颜色" label-width="70px" prop>
                  <el-select
                    v-model="tzscMenuForm.licenseColor"
                    class="width132"
                    placeholder="选择选项"
                  >
                    <el-option
                      v-for="item in plateColor"
                      :key="item.enumValue"
                      :label="item.enumValue"
                      :value="item.enumValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车辆类型" label-width="70px" prop>
                  <el-select v-model="tzscMenuForm.carType" class="width132" placeholder="选择选项">
                    <el-option
                      v-for="item in vehicleType"
                      :key="item.enumValue"
                      :label="item.enumValue"
                      :value="item.enumValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车辆颜色" label-width="70px" prop>
                  <el-select v-model="tzscMenuForm.carColor" class="width132" placeholder="选择选项">
                    <el-option
                      v-for="item in carColor"
                      :key="item.enumValue"
                      :label="item.enumValue"
                      :value="item.enumValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="车辆型号" label-width="70px" prop>
                  <el-select v-model="tzscMenuForm.carModel" class="width132" placeholder="选择选项">
                    <el-option
                      v-for="item in carModel"
                      :key="item.vehicleBrand"
                      :label="item.vehicleBrand"
                      :value="item.vehicleBrand"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="遮阳板" label-width="70px" prop>
                  <el-select v-model="tzscMenuForm.sunVisor" class="width132" placeholder="选择选项">
                    <el-option   key="收起" label="收起" value="收起"></el-option>
                    <el-option   key="放下" label="放下" value="放下"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="年检标数量" label-width="90px" prop>
                  <el-select
                    v-model="tzscMenuForm.inspectionCount"
                    class="width132"
                    placeholder="选择选项"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item> -->
                </div>
                 <!-- 时间 -->
                 <el-form-item >
                 <div class="time-search">
                  <el-date-picker
                    v-model="data1"
                    type="daterange"
                    class="full"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </div>
                </el-form-item>
                 <el-form-item prop="input4">
                   <div class="license-plate-search">
                  <el-row :gutter="5">
                    <el-col :span="22">
                      <div>
                        <el-input placeholder="多少" v-model="tzscMenuForm.input4" class="insetIput">
                          <i slot="prefix" class="inset">违章次数大于</i>
                        </el-input>
                      </div>
                    </el-col>
                    <el-col :span="2">
                      <div class="line40">次</div>
                    </el-col>
                  </el-row>
                </div>
                </el-form-item>
                
                
            </el-form>
              </div>
          
          
          
          <div class="search-btn">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-button @click="resetSearch" class="full">重置</el-button>
              </el-col>
              <el-col :span="12">
                <el-button
                  type="primary"
                  :loading="searching"
                  @click="getVehicleDetail"
                  class="select_btn full"
                >分析</el-button>
              </el-col>
            </el-row>
          </div>
        </vue-scroll>
      </div>
      <!-- 车辆信息 -->
      <div class="info-right" v-loading="searching">
        <div class="info-r-content">
          <!-- 违章信息 -->
          <div class="info-card">
            <p class="card-header">查询结果</p>
            <div class="table_box">
              <el-table :data="regulationsList">
                <el-table-column label="序号" type="index" width="100"></el-table-column>
                <el-table-column label="车牌号码" prop="plateNo" show-overflow-tooltip></el-table-column>
                <el-table-column label="违法次数" sortable prop="counts" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作"  show-overflow-tooltip>
 <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看详情</el-button>
      </template>

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
                class="cum_pagination"
              ></el-pagination>
            </template>
          </div>
        </div>
      </div>
    </div>

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

    <BigImg
      :imgList="imgList"
      :imgIndex="imgIndex"
      :isShow="isShowImg"
      @emitCloseImgDialog="emitCloseImgDialog"
    ></BigImg>
  </div>
</template>
<script>
import { ajaxCtx } from "@/config/config";
import BigImg from "@/components/common/bigImg.vue";
import {
  JtcPOSTAppendixInfo,
  JtcGETAppendixInfoList,
  JtcPUTAppendixsOrder,getPhotoAnalysis,getViolation
} from "../../../api/api.judge.js";
import { getCarmodelList } from "../../../api/api.base.js";
import { setTimeout } from "timers";
import { dataList } from '@/utils/data.js';
import { callbackify, error } from 'util';
export default {
  components: { BigImg },
  data() {
    
    return {
      photoAnalysis:null,//图片分析特征
      plateType:[],// 号牌类型
      plateColor:[],// 号牌颜色
      vehicleType:[],// 车辆类型
      carColor:[],// 车辆颜色
      uploadAcion: ajaxCtx.base + "/new", //上传路径
      uploading: false, // 是否上传中
      uploadFileList: [],
      curImageUrl: "", // 当前上传的图片
      historyPicList: [], // 上传历史记录
      historyPicDialog: false,
      loadingHis: false,
      imgData: null,
      input5: "1",
      data1: "",
      
       // 菜单表单变量
      tzscMenuForm: {
        input4: 3,
        selectDate: "",
        selectDevice: "",
        licenseType: "",
        licenseColor: "",
        carType: "",
        carColor: "",
        carModel: "",
        sunVisor: "",
        inspectionCount: ""
      },
      searchData: {
        //搜索参数
        time: null,
        licensePlateNum: null // 车牌号
      },
      pickerOptions: {
        disabledDate(time) {
          let date = new Date();
          let y = date.getFullYear();
          let m =
            date.getMonth() + 1 < 10
              ? "0" + (date.getMonth() + 1)
              : date.getMonth() + 1;
          let d = date.getDate();
          let threeMonths = "";
          let start = "";
          if (parseFloat(m) >= 2) {
            start = y + "-" + (m - 1) + "-" + d;
          } else {
            start = y - 1 + "-" + (m - 1 + 12) + "-" + d;
          }
          threeMonths = new Date(start).getTime();
          return time.getTime() > Date.now() || time.getTime() < threeMonths;
        }
      },
      searching: false,
      searchings: false,
      imgIndex: 0, // 点击的图片索引
      isShowImg: false, // 是否放大图片
      imgList: [],
      rules: {
        input4:  [{
              //pattern: /^[0-9]?$/,
              pattern: /^(0|([1-9]\d{0,2}))$/,
              trigger: 'blur',
							message: '请输入不大于999的整数值'
						}]
      },
      options: [
        {
          value: "1",
          label: "1"
        },
        {
          value: "2",
          label: "2"
        },
        {
          value: "3",
          label: "3"
        },
        {
          value: "4",
          label: "4"
        },
        {
          value: "5",
          label: "5"
        },
      ],
      carModel:[],
      regulationsList: [
      ], //违章信息列表
      pagination: { total: 0, pageSize: 10, pageNum: 1 }
    };
  },
  computed: {
    choosedHisPic() {
      return this.historyPicList.filter(x => x.checked);
    }
  },
  mounted() {
    let dic=this.dicFormater(dataList.vehicleType);
    let dic1=this.dicFormater(dataList.plateType);
    let dic2=this.dicFormater(dataList.plateColor);
    let dic3=this.dicFormater(dataList.carColor);
     
    this.plateType= [...dic1[0].dictList]// 号牌类型
    this.plateColor= [...dic2[0].dictList]// 号牌颜色
    this.vehicleType= [...dic[0].dictList]// 车辆类型
    this.carColor= [...dic3[0].dictList]// 车辆颜色
   // console.log(this.plateType[1]);
    
    this.setDTime();
  },
  methods: {
    getCarmodelList(){
      getCarmodelList().then(res=>{
        if(res && res.data && res.data.length>0){
          this.carModel=res.data
        }
      })
    },
    //获取图片信息
    getPhotoAnalysis(){
      let d={
        uploadImgUrls:""
      }
      getPhotoAnalysis(d).then(res=>{
        if(res){

        }
      })
    },
    //查看详情
    handleClick(v){
      console.log(v);
      v.datastart=this.data1[0]
      v.dataend=this.data1[1]
      if(this.curImageUrl){
        v.imgurl=this.curImageUrl
      }
      this.$router.push({name: 'vehicle_search_lxwfdetail', query: v});
    },
    // 上传图片
    beforeAvatarUpload(file) {
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
    //上传成功
    uploadSucess(response, file, fileList) {
      this.uploading = false;
      /* this.compSim = '';
      this.compSimWord = ''; */
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
      this.uploadFileList = fileList;
    },
    //上传失败
    handleError() {
      this.uploading = false;
      this.$message.error("上传失败");
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
    //删除图片
    delPic() {
      this.uploadFileList.splice(0, 1);
      this.curImageUrl = "";
    },
    //选择最近上传的图片
    chooseHisPic(item) {
      this.historyPicList.forEach(x => {
        x.checked = false;
      });
      item.checked = true;
    },
    //获取特征
    getItem(){
      this.searchings=true
      //this.curImageUrl =
      getPhotoAnalysis({
        uploadImgUrls :this.curImageUrl
      }).then(res=>{
        if(res.data && res.data.length>0){
          // console.log(res);
          this.searchings=!this.searchings
          this.photoAnalysis=res.data[0]
          
        }else{
           this.searchings=!this.searchings
        }
      })
    },
    //从历史上传图片中上传
    addHisToImg() {
      this.historyPicDialog = false;
      let _ids = [];
      this.choosedHisPic.forEach(x => {
        _ids.push(x.uid);
        this.curImageUrl = x.path;
        this.imgData = x;
      });
      let _obj = {
        appendixInfoIds: _ids.join(",")
      };
      JtcPUTAppendixsOrder(_obj);
    },
    //设置默认时间
    setDTime() {
      let date = new Date();
      let curDate = date.getTime();
      let curS = 30 * 24 * 3600 * 1000;
        let _sm =(new Date(curDate - curS).getMonth() + 1)>9?(new Date(curDate - curS).getMonth() + 1):("0"+(new Date(curDate - curS).getMonth() + 1))
      let _sd = new Date(curDate - curS).getDate()>9? new Date(curDate - curS).getDate() : ("0"+ new Date(curDate - curS).getDate())
      let _em = (date.getMonth() + 1)>9?(date.getMonth() + 1):("0"+(date.getMonth() + 1))
      let _ed =  date.getDate()>9?date.getDate():("0"+ date.getDate())
      
      let _s = new Date(curDate - curS).getFullYear() +
        "-" + _sm + "-" +_sd;
      let _e = date.getFullYear() + "-" + _em + "-" + _ed;
      this.data1 = [_e, _e];
    },
    //重置
    resetSearch() {
      //this.searchData.licensePlateNum = null;
      this.uploadFileList.splice(0, this.uploadFileList.length);
      this.imgData = null;
      this.curImageUrl = "";
      //this.tzscMenuForm.input4 = 3,
      this.tzscMenuForm= {
        input4: 3,
        selectDate: "",
        selectDevice: "",
        licenseType: "",
        licenseColor: "",
        carType: "",
        carColor: "",
        carModel: "",
        sunVisor: "",
        inspectionCount: ""
      },
      this.setDTime();
    //this.getVehicleDetail();
    },
    //查询
    getVehicleDetail() {
      this.searching = true;
     // console.log("======getVehicleDetail=====", this.searchData, this.imgData);

      
      if(this.input5==1){
        let datas={
        dateStart:this.data1[0] + " 00:00:00",
        dateEnd:this.data1[1] + " 23:59:59" ,
        vilolationNum:this.tzscMenuForm.input4,
        plateClass:this.plateType[this.photoAnalysis.plateClass*1-1].enumValue,
        plateColor:this.photoAnalysis.plateColor,
        vehicleClass:this.photoAnalysis.vehicleClass,
        vehicleColor:this.photoAnalysis.vehicleColor,
        vehicleModel:this.photoAnalysis.vehicleModel,
        sunvisor:this.photoAnalysis.sunVisor
      }
        this.getViolation(datas)
      }else{
        let params = {
        dateStart:this.data1[0] + " 00:00:00",
        dateEnd:this.data1[1] + " 23:59:59" ,
        vilolationNum:this.tzscMenuForm.input4,
        plateClass:this.tzscMenuForm.licenseType,
        plateColor:this.tzscMenuForm.licenseColor,
        vehicleClass:this.tzscMenuForm.carType,
        vehicleColor:this.tzscMenuForm.carColor,
        vehicleModel:this.tzscMenuForm.carModel,
        sunvisor:this.tzscMenuForm.sunVisor,
        // plateClass:this.input4,

      };
        this.getViolation(params)
      }
      
    
    },
    //按条件查询违章
    getViolation(d){
      getViolation(d).then(res=>{
       // console.log(res.data);
        
        if(res.data){

           this.searching = false;
          // pagination: { total: 20, pageSize: 10, pageNum: 1 }
          this.pagination.total=res.data.total
          this.pagination.pageNum=res.data.pageNum
          // this.pagination.total=res.data.total
          this.regulationsList=res.data.list
        }else{
           this.searching = false;
        }
      })
    },
    // 图片放大
    openBigImg(index, data) {
      console.log("--------------", index, data);
      this.imgList = data;
      this.isShowImg = true;
      this.imgIndex = index;
    },
    // 关闭图片放大
    emitCloseImgDialog(data) {
      this.imgList = [];
      this.isShowImg = data;
    },
    //分页
    handleSizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
      this.getTaskData();
    },
    onPageChange(page) {
      this.pagination.pageNum = page;
    },

    changeTab(v) {
      //console.log(v);
      // if (v == "2") {
      //   this.dialogVisible = true;
      // } else {
      //   this.dialogVisible = false;
      // }
    }
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
  .vehicle-info-content {
    height: 100%;
    display: flex;
    border-top: 1px solid #d3d3d3;
    .info-left {
      width: 272px;
      padding: 20px 0 20px 20px;
      color: #999;
      background: #fff;
      box-shadow: 5px 0px 16px 0px rgba(169, 169, 169, 0.2);
      .vl_judge_tc_c_item {
        width: 232px;
        height: 232px;
        display: inline-block;
        position: relative;
        margin-top: 16px;
        margin-bottom: 20px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        cursor: pointer;
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
          overflow: hidden;
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
      //车牌号搜索
      .license-plate-search {
        width: 232px;
        margin-bottom: 10px;
      }
    }
    .info-right {
      width: calc(100% - 272px);
      height: 100%;
      padding: 20px 0 20px 20px;
      .info-r-content {
        height: 100%;
        padding-right: 20px;
        .info-card {
          width: 100%;
          background: #fff;
          box-shadow: 5px 0px 16px 0px rgba(169, 169, 169, 0.2);
          border-radius: 4px;
          margin-bottom: 20px;
          .card-header {
            font-size: 16px;
            height: 55px;
            line-height: 55px;
            border-bottom: 1px solid #f2f2f2;
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
    }
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
.select_btn.el-button--primary.is-disabled{
background-color: #a0cfff;
  color: #ffffff;
}
.inset {
  display: inline-block;
  line-height: 40px;
  font-style: normal;
}
.line40 {
  line-height: 40px;
}
.chara {
  margin-top: 10px;
  padding-bottom: 10px;
  border-bottom: solid 1px #eeeeee;
  span {
    display: inline-block;
    line-height: 35px;
    height: 35px;
    background: rgba(250, 250, 250, 1);
    border: 1px solid rgba(242, 242, 242, 1);
    border-radius: 3px;
    margin-right: 10px;
    margin-top: 10px;
    padding: 0px 10px;
  }
}
</style>
<style lang="scss">
html {
  font-size: 100px;
}
@media screen and (min-width: 960px) and (max-width: 1119px) {
  html {
    font-size: 60px !important;
  }
}
@media screen and (min-width: 1200px) and (max-width: 1439px) {
  html {
    font-size: 70px !important;
  }
}
@media screen and (min-width: 1440px) and (max-width: 1679px) {
  html {
    font-size: 80px !important;
  }
}
@media screen and (min-width: 1680px) and (max-width: 1919px) {
  html {
    font-size: 90px !important;
  }
}
@media screen and (min-width: 1920px) {
  html {
    font-size: 100px !important;
  }
}
.info-left{
.el-date-editor .el-range-input{
 font-size: 12px;
}
}
.vehicle-info {
  .vl_judge_tc_c_item {
    .vl_jtc_upload {
      .el-upload {
        width: 100%;
        height: 100%;
       
        img {
          width: 100%;
          height: 100%;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          border-radius: 10px;
        }
      }
      .el-upload:hover{
         background: #2981f8;
        border: none;
        span {
          color: #ffffff;
        }
      }
    }
  }
  //时间搜索
  .time-search {
    // margin-bottom: 10px;
    margin-right: 20px;
    .el-date-editor--daterange.el-input,
    .el-date-editor--daterange.el-input__inner,
    .el-date-editor--timerange.el-input,
    .el-date-editor--timerange.el-input__inner {
      width: 232px;
    }
  }
  //搜索按钮
  .search-btn {
    width: 232px;
    text-align: center;
  }
  //弹窗
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
