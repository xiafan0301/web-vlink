<template>
  <div class="vehicle-info d">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>连续违章</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="vehicle-info-content">
      <!-- 搜索条件 -->
      <div class="info-left">
        <vue-scroll>
          <div style="padding-right: 20px; margin-bottom: 10px">
            <el-date-picker
                v-model="data1"
                type="datetime"
                time-arrow-control
                :clearable="false"
                placeholder="开始时间"
                :picker-options="pickerOptions"
                class="full vl_date"
            ></el-date-picker>
          </div>
          <div style="padding-right: 20px; margin-bottom: 10px">
            <el-date-picker
                v-model="data2"
                :clearable="false"
                type="datetime"
                time-arrow-control
                :picker-options="pickerOptions"
                placeholder="结束时间"
                class="full vl_date vl_date_end"
            ></el-date-picker>
          </div>
          <div style="padding-right: 20px; margin-bottom: 10px">
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
          </div>
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
          <div v-show="input5==1">
            <div class="vl_judge_tc_c_item">
              <!-- <el-upload
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
              </div> -->
              <div is="vlUpload" :clear="uploadClear" @uploadEmit="uploadEmit"></div>
            </div>

            <div class="license-plate-search">
              <el-button
                :type="curImageUrl ? 'primary' : ''"
                :disabled="!curImageUrl"
                @click="getItem"
                style="width: 100%;"
                :loading="searchings"
              >获取特征</el-button>
              <div class="chara" v-if="photoAnalysis">
                <span
                  @click="clickTabItem('plateNo')"
                  :class="{red:sou.plateNo}"
                  v-if="photoAnalysis.plateNo"
                >车牌号：{{photoAnalysis.plateNo}}</span>
                <span
                  @click="clickTabItem('plateColor')"
                  :class="{red:sou.plateColor}"
                  v-if="photoAnalysis.plateColor"
                >号牌颜色：{{photoAnalysis.plateColor}}色</span>
                <span
                  @click="clickTabItem('vehicleModel')"
                  :class="{red:sou.vehicleModel}"
                  v-if="photoAnalysis.vehicleModel"
                >车辆型号:{{photoAnalysis.vehicleModel}}</span>
                <span
                  @click="clickTabItem('vehicleColor')"
                  :class="{red:sou.vehicleColor}"
                  v-if="photoAnalysis.vehicleColor"
                >车辆颜色：{{photoAnalysis.vehicleColor}}</span>
                <!-- <span
                  @click="clickTabItem('vehicleBrand')"
                  :class="{red:sou.vehicleBrand}"
                  v-if="photoAnalysis.vehicleBrand"
                >车辆品牌:{{photoAnalysis.vehicleBrand}}</span>
                <span
                  @click="clickTabItem('vehicleRoof')"
                  :class="{red:sou.vehicleRoof}"
                  v-if="photoAnalysis.vehicleRoof"
                >车顶{{photoAnalysis.vehicleRoof}}</span> -->
                <span
                  @click="clickTabItem('vehicleClass')"
                  :class="{red:sou.vehicleClass}"
                  v-if="photoAnalysis.vehicleClass"
                >车辆类型：{{photoAnalysis.vehicleClass}}</span>
                <!-- <span
                  @click="clickTabItem('sunvisor')"
                  :class="{red:sou.sunvisor}"
                  v-if="photoAnalysis.sunvisor"
                >遮阳板{{photoAnalysis.sunvisor}}</span> -->
                
                <span
                  @click="clickTabItem('_plateClass')"
                  :class="{red:sou._plateClass}"
                  v-if="photoAnalysis._plateClass"
                >号牌类型:{{photoAnalysis._plateClass}}</span>
              </div>
            </div>
          </div>

          <div class="chbox">
            <el-form :model="tzscMenuForm" ref="tzscMenuForm" :rules="rules">
              <div v-show="input5 == 2">
                <el-form-item prop>
                  <el-select
                    v-model="tzscMenuForm.licenseColor"
                    class="width132"
                    placeholder="选择号牌颜色"
                  >
                    <el-option
                      v-for="item in plateColor"
                      :key="item.enumField"
                      :label="item.enumValue"
                      :value="item.enumValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="carModel">
                  <el-cascader
                      class="width250"
                      style="width: 100%"
                      clearable
                      separator="-"
                      placeholder="选择车辆型号"
                      v-model="tzscMenuForm.carModel"
                      :options="carModel"
                  ></el-cascader>
<!--                  <el-select v-model="tzscMenuForm.carModel" class="width132" placeholder="选择车辆型号">-->
<!--                    <el-option-->
<!--                      v-for="item in carModel"-->
<!--                      :key="item.vehicleBrand"-->
<!--                      :label="item.vehicleBrand"-->
<!--                      :value="item.vehicleBrand"-->
<!--                    ></el-option>-->
<!--                  </el-select>-->
                </el-form-item>
                <el-form-item prop>
                  <el-select v-model="tzscMenuForm.carColor" class="width132" placeholder="选择车辆颜色">
                    <el-option
                      v-for="item in carColor"
                      :key="item.enumValue"
                      :label="item.enumValue"
                      :value="item.enumValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop>
                  <el-select v-model="tzscMenuForm.carType" class="width132" placeholder="选择车辆类型">
                    <el-option
                      v-for="item in vehicleType"
                      :key="item.enumValue"
                      :label="item.enumValue"
                      :value="item.enumValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop>
                  <el-select v-model="tzscMenuForm.licenseType" class="width132" placeholder="选择号牌类型">
                    <el-option
                      v-for="item in plateType"
                      :key="item.enumValue"
                      :label="item.enumValue"
                      :value="item.enumValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
                
                <!-- <el-form-item label="遮阳板" label-width="70px" prop>
                  <el-select v-model="tzscMenuForm.sunVisor" class="width132" placeholder="选择选项">
                    <el-option key="收起" label="收起" value="收起"></el-option>
                    <el-option key="放下" label="放下" value="放下"></el-option>
                  </el-select>
                </el-form-item> -->
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
                </el-form-item>-->
              </div>
              <!-- 时间 -->
              <!-- <el-form-item>
                <div class="time-search date-comp">
                  <el-date-picker
                    v-model="data1"
                    type="daterange"
                    class="full vl_date"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :clearable='false'
                  ></el-date-picker>
                </div>
              </el-form-item> -->
<!--              <el-form-item  prop="data1">-->
<!--                <el-date-picker-->
<!--                  v-model="data1"-->
<!--                  type="datetime"-->
<!--                  time-arrow-control-->
<!--                  :clearable="false"-->
<!--                  placeholder="开始时间"-->
<!--                  :picker-options="pickerOptions"-->
<!--                  class="full vl_date"-->
<!--                ></el-date-picker>-->
<!--              </el-form-item>-->
<!--              <el-form-item  prop="data2">-->
<!--                <el-date-picker-->
<!--                  v-model="data2"-->
<!--                  :clearable="false"-->
<!--                  type="datetime"-->
<!--                  time-arrow-control-->
<!--                  :picker-options="pickerOptions"-->
<!--                  placeholder="结束时间"-->
<!--                  class="full vl_date vl_date_end"-->
<!--                ></el-date-picker>-->
<!--              </el-form-item>-->
<!--              <el-form-item prop="input4">-->
<!--                <div class="license-plate-search">-->
<!--                  <el-row :gutter="5">-->
<!--                    <el-col :span="22">-->
<!--                      <div>-->
<!--                        <el-input placeholder="多少" v-model="tzscMenuForm.input4" class="insetIput">-->
<!--                          <i slot="prefix" class="inset">违章次数大于</i>-->
<!--                        </el-input>-->
<!--                      </div>-->
<!--                    </el-col>-->
<!--                    <el-col :span="2">-->
<!--                      <div class="line40">次</div>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
<!--                </div>-->
<!--              </el-form-item>-->
            </el-form>
          </div>

          <div class="search-btn">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-button  @click="resetSearch" class="full">重置</el-button>
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
        <div class="info-r-content" v-if="!isNull" >
          <!-- 违章信息 -->
          <div class="info-card">
            <p class="card-header">查询结果
               <el-button type="primary" size="small" :loading="isDao" @click="exportList" class="select_btn  fright">导出</el-button>
            </p>
            <div class="table_box">
              <el-table :data="regulationsList">
                <el-table-column label="序号" type="index" width="100"></el-table-column>
                <el-table-column label="车牌号码" prop="plateNo" show-overflow-tooltip></el-table-column>
                <el-table-column label="违章次数" sortable prop="counts" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" show-overflow-tooltip>
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
        <div v-if="isNull" class="fnull">
          <div><img src="../../../../../assets/img/null-content.png" alt="">
          选择车辆特征，查询具有相同特征车辆的连续违章记录</div>
          
        </div>
      </div>
    </div>

    <!--上传记录弹窗-->
    <!-- <el-dialog
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
    </el-dialog> -->

    <!-- <BigImg
      :imgList="imgList"
      :imgIndex="imgIndex"
      :isShow="isShowImg"
      @emitCloseImgDialog="emitCloseImgDialog"
    ></BigImg> -->
  </div>
</template>
<script>
import BigImg from "@/components/common/bigImg.vue";
import vlUpload from '@/components/common/upload.vue';
import {formatDate, dateOrigin} from '@/utils/util.js';
import {
  getPhotoAnalysis,
  getViolation,
  exportNightVehicle
} from "../../../api/api.judge.js";
import { getCarmodelList ,getVehicleList} from "../../../api/api.base.js";
import { dataList } from  '@/utils/data.js';
export default {
  components: { BigImg, vlUpload },
  data() {
    return {
      // disab: false,
      isNull: true,
      photoAnalysis: null, //图片分析特征
      plateType: [], // 号牌类型
      plateColor: [], // 号牌颜色
      vehicleType: [], // 车辆类型
      carColor: [], // 车辆颜色
      // uploading: false, // 是否上传中
      // uploadFileList: [],
      curImageUrl: "", // 当前上传的图片
      // historyPicList: [], // 上传历史记录
      // historyPicDialog: false,
      // loadingHis: false,
      isDao: false,
      // imgData: null,
      input5: "1",
      data1: dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)),
      data2: new Date(),

      uploadClear: {},

      // 菜单表单变量
      tzscMenuForm: {
        input4: 3,
        selectDate: "",
        selectDevice: "",
        licenseType: "",
        licenseColor: "",
        carType: "",
        carColor: "",
        carModel: [],
        // sunVisor: "",
        inspectionCount: ""
      },
      searchData: {
        //搜索参数
        time: null,
        licensePlateNum: null // 车牌号
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() ;
        }
      },
      searching: false,
      searchings: false,
      imgIndex: 0, // 点击的图片索引
      // isShowImg: false, // 是否放大图片
      // imgList: [],
      rules: {
        input4: [
          {
            //pattern: /^[0-9]?$/,
            pattern: /^(0|([1-9]\d{0,2}))$/,
            trigger: "blur",
            message: "请输入不大于999的整数值"
          }
        ]
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
        }
      ],
      carModel: [],
      regulationsList: [], //违章信息列表
      pagination: { total: 0, pageSize: 10, pageNum: 1 },
      sou: {
        plateNo: true,
        vehicleColor: true,
         vehicleModel: true,
        // vehicleRoof: true,
        vehicleClass: true,
        // sunvisor: true,
        plateColor: true,
        _plateClass: true
      }
    };
  },
  // computed: {
  //   choosedHisPic() {
  //     return this.historyPicList.filter(x => x.checked);
  //   }
  // },
 beforeRouteEnter(to, from, next) {
     next(vm => {
         // 通过 `vm` 访问组件实例
           if (from.name == 'vehicle_menu' && to.name == 'vehicle_search_lxwf') {//一定是从A进到B页面才刷新
               vm.updataB();//updataB是本来写在mounted里面的各种东东
           }
     })
},
  mounted() {
    this.plateType = this.dicFormater(dataList.plateType)[0].dictList;
    this.plateColor = this.dicFormater(dataList.licensePlateColor)[0].dictList;
    this.vehicleType = this.dicFormater(dataList.vehicleType)[0].dictList;
    this.carColor = this.dicFormater(dataList.carColor)[0].dictList;

//    this.plateType = [...dic1[0].dictList]; // 号牌类型
//    this.plateColor = [...dic2[0].dictList]; // 号牌颜色
//    this.vehicleType = [...dic[0].dictList]; // 车辆类型
//    this.carColor = [...dic3[0].dictList]; // 车辆颜色
    this.setDTime();
    getVehicleList().then(res => {
      this.carModel = res.data.map(item => {
        item.value = item.brand;
        item.label = item.brand;
        item.children = [];
        for (let i = 0; i < item.typeList.length; i++) {
          item.children.push({
            value: item.typeList[i],
            label: item.typeList[i]
          });
        }
        delete item.typeList;
        return item;
      });
    });
  },
  methods: {
    uploadEmit (data) {
      console.log('uploadEmit data', data);
      if (data && data.path) {
        this.curImageUrl = data.path;
      }
    },
    //导出
    exportList(){
      this.isDao=true
      let ad=null
      if (this.input5 == 1 ) {
        let datas = {
          dateStart: formatDate(this.data1),
          dateEnd: formatDate(this.data2),
          vilolationNum: this.tzscMenuForm.input4
        };
        if (this.sou.plateNo) {
          datas.plateNo = this.photoAnalysis.plateNo;
        }
        if (this.sou.vehicleColor) {
          datas.vehicleColor = this.photoAnalysis.vehicleColor;
        }
        if (this.sou.vehicleClass) {
          datas.vehicleClass = this.photoAnalysis.vehicleClass;
        }
        // if (this.sou.sunvisor) {
        //   datas.sunvisor = this.photoAnalysis.sunVisor;
        // }
        if (this.sou.plateColor) {
          datas.plateColor = this.photoAnalysis.plateColor;
        }
        if (this.sou._plateClass) {
          let a = this.plateType.map(
            el => el.enumField == this.photoAnalysis.plateClass
          );
          datas.plateClass = a.enumValue;
        }
        ad=datas
        //this.getViolation(datas);
      } else {
        let params = {
          dateStart: formatDate(this.data1),
          dateEnd: formatDate(this.data2),
          vilolationNum: this.tzscMenuForm.input4,
          plateClass: this.tzscMenuForm.licenseType,
          plateColor: this.tzscMenuForm.licenseColor,
          vehicleClass: this.tzscMenuForm.carType,
          vehicleColor: this.tzscMenuForm.carColor,
          vehicleModel: this.tzscMenuForm.carModel.join(""),
          // sunvisor: this.tzscMenuForm.sunVisor
          // plateClass:this.input4,
        };
        // params.pageNum=this.pagination.pageNum
        // params.pageSize=this.pagination.pageSize
        ad=params
       // this.getViolation(params);
      }
      exportNightVehicle({
        vehicleViolationDto:ad,
        viewType:3
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
      console.log(88888888888);
      this.isNull=true
      this.regulationsList = [];
      this.photoAnalysis=null
      this.resetSearch()
    },
    clickTabItem(v) {
      this.sou[v] = !this.sou[v];
      //if(this.sou[v])
    },
    getCarmodelList() {
      getCarmodelList().then(res => {
        if (res && res.data && res.data.length > 0) {
          this.carModel = res.data;
        }
      });
    },
    //获取图片信息
    // getPhotoAnalysis(){
    //   let d={
    //     uploadImgUrls:""
    //   }
    //   getPhotoAnalysis(d).then(res=>{
    //     if(res){

    //     }
    //   })
    // },
    //查看详情
    handleClick(v) {
      v.datastart = formatDate(this.data1);
      v.dataend = formatDate(this.data2);
      if (this.curImageUrl) {
        v.imgurl = this.curImageUrl;
      }
      v.reload=false
      this.$router.push({ name: "vehicle_search_lxwfdetail", query: v });
    },
    getItem() {
      this.searchings = true;
      //this.curImageUrl =
      getPhotoAnalysis({
        uploadImgUrls: this.curImageUrl
      }).then(res => {
        if (res && res.data && res.data.length > 0) {
          // console.log(res);
          this.searchings = false;
          this.photoAnalysis = res.data[0];
          this.plateType.map(
            el => {
              if (el.enumField == this.photoAnalysis.plateClass) {
                this.photoAnalysis._plateClass = el.enumValue;
              }
            }
          );

          this.sou ={
            plateNo: true,
            vehicleColor: true,
            vehicleModel: true,
            // vehicleRoof: true,
            vehicleClass: true,
            // sunvisor: true,
            plateColor: true,
            _plateClass: true
          }
          // this.disab = true;
        } else {
          this.searchings = false;
        }
      });
    },
    //设置默认时间
    setDTime() {
      /* let date = new Date();
      let curDate = date.getTime();
      let curS = 1 * 24 * 3600 * 1000;
      let _sm =(new Date(curDate - curS).getMonth() + 1)>9?(new Date(curDate - curS).getMonth() + 1):("0"+(new Date(curDate - curS).getMonth() + 1))
      let _sd = new Date(curDate - curS).getDate()>9? new Date(curDate - curS).getDate() : ("0"+ new Date(curDate - curS).getDate())
      // let _em =
      //   date.getMonth() + 1 > 9
      //     ? date.getMonth() + 1
      //     : "0" + (date.getMonth() + 1);
      // let _ed = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();

      let _s = new Date(curDate - curS).getFullYear() + "-" + _sm + "-" +_sd;
      // let _e = date.getFullYear() + "-" + _em + "-" + _ed;
      this.data1 = _s;
      this.data2 = _s; */
    },
    //重置
    resetSearch() {
      //this.searchData.licensePlateNum = null;
      // this.uploadFileList.splice(0, this.uploadFileList.length);
      // this.imgData = null;
      this.curImageUrl = "";
      this.uploadClear = {};
      //this.tzscMenuForm.input4 = 3,
      (this.tzscMenuForm = {
        input4: 3,
        selectDate: "",
        selectDevice: "",
        licenseType: "",
        licenseColor: "",
        carType: "",
        carColor: "",
        carModel: [],
        // sunVisor: "",
        inspectionCount: ""
      }),
      this.photoAnalysis = null;
      this.regulationsList = [];
      this.setDTime();
      this.data1 = dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000));
      this.data2 = new Date();
      //this.getVehicleDetail();
    },
    //查询
    getVehicleDetail() {
      this.searching = true;
      // console.log("======getVehicleDetail=====", this.searchData, this.imgData);

      if (this.input5 == 1 ) {
        
       
        if(!this.curImageUrl || !this.photoAnalysis){
           this.searching=false
          if(!document.querySelector('.el-message--info')){
            this.$message.info("请上传图片并获取特征");
          }
           return
        }
        let datas = {
          dateStart: formatDate(this.data1),
          dateEnd: formatDate(this.data2),
          vilolationNum: this.tzscMenuForm.input4
        };
        if (this.sou.plateNo) {
          datas.plateNo = this.photoAnalysis.plateNo;
        }
        if (this.sou.vehicleColor) {
          datas.vehicleColor = this.photoAnalysis.vehicleColor;
        }
        if (this.sou.vehicleClass) {
          datas.vehicleClass = this.photoAnalysis.vehicleClass;
        }
        if (this.sou.vehicleModel) {
          datas.vehicleModel = this.photoAnalysis.vehicleModel;
        }
        if (this.sou.plateColor) {
          datas.plateColor = this.photoAnalysis.plateColor;
        }
        if (this.sou._plateClass) {
          let a = this.plateType.map(
            el => el.enumField == this.photoAnalysis.plateClass
          );
          datas.plateClass = a.enumValue;
        }
        datas.pageNum=this.pagination.pageNum
        datas.pageSize=this.pagination.pageSize
        this.getViolation(datas);
      } else {
        let params = {
          dateStart: formatDate(this.data1),
          dateEnd: formatDate(this.data2),
          vilolationNum: this.tzscMenuForm.input4,
          plateClass: this.tzscMenuForm.licenseType,
          plateColor: this.tzscMenuForm.licenseColor,
          vehicleClass: this.tzscMenuForm.carType,
          vehicleColor: this.tzscMenuForm.carColor,
          vehicleModel: this.tzscMenuForm.carModel.join(""),
          // sunvisor: this.tzscMenuForm.sunVisor
          // plateClass:this.input4,
        };
        params.pageNum=this.pagination.pageNum
        params.pageSize=this.pagination.pageSize

        this.getViolation(params);
      }
    },
    //按条件查询违章
    getViolation(d) {
      getViolation(d).then(res => {
        if (res && res.data) {
          this.isNull=false
          this.searching = false;
          // pagination: { total: 20, pageSize: 10, pageNum: 1 }
          this.pagination.total = res.data.total;
          this.pagination.pageNum = res.data.pageNum;
          // this.pagination.total=res.data.total
          this.regulationsList = res.data.list;
        } else {
          this.isNull=false
          this.searching = false;
        }
      });
    },
    // 图片放大
    // openBigImg(index, data) {
    //   console.log("--------------", index, data);
    //   this.imgList = data;
    //   this.isShowImg = true;
    //   this.imgIndex = index;
    // },
    // 关闭图片放大
    // emitCloseImgDialog(data) {
    //   this.imgList = [];
    //   this.isShowImg = data;
    // },
    //分页
    handleSizeChange(val) {
      this.pagination.pageNum = 1;
      this.pagination.pageSize = val;
     // this.getTaskData();
    },
    onPageChange(page) {
      this.pagination.pageNum = page;
      this.getVehicleDetail()
    },

    changeTab() {
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
.chbox {
  padding-right: 20px;
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
        margin-top: 16px;
        margin-bottom: 20px;
        border-radius: 10px;
        text-align: center;
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
  width: 100% !important;
}
.select_btn {
  background-color: #0c70f8;
  color: #ffffff;
}
.select_btn:hover {
  background-color: #0466de;
}
.select_btn.el-button--primary.is-disabled {
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
    cursor: pointer;
    display: inline-block;
    line-height: 35px;
    height: 35px;
    font-size: 12px;
    color: #333333;
    background: rgba(250, 250, 250, 1);
    border: 1px solid rgba(242, 242, 242, 1);
    border-radius: 3px;
    margin-right: 10px;
    margin-top: 10px;
    padding: 0px 10px;
  }
  .red {
    border: 1px solid #F2F2F2;
    background-color: #0C70F8;
    color: #ffffff;
  }
}
.fright{
  float: right;
  margin-right: 10px;
  margin-top: 10px;
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
.info-left {
  .el-date-editor .el-range-input {
    /* font-size: 12px; */
  }
}
.d.vehicle-info{
  .el-form-item{
    margin-bottom: 15px;
  }
  .search-btn {
    .el-button {
      width: 100%;
    }
   
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
      .el-upload:hover {
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
.chbox {
  .el-select{
    width: 100%;
  }
}
</style>
