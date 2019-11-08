<template>
  <div class="analysis-results">
    <div class="">
      <div is="vlBreadcrumb" 
          :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
            {name: '频繁出没', routerName: 'portrait_new_pfcm'},
            {name: '分析结果'}]">
        </div>
    </div>
      <div class="analysis-r-body">
        <div class="task-info" v-if="analysisObj && !isEdit">
          <vue-scroll> 
          <div class="task-info-row"><span class="left-text">任务名称：</span><span class="right-text">{{analysisObj.taskName}}</span></div>
          <div class="task-info-row double-row"><span class="left-text">所选时间：</span><span class="right-text">{{analysisObj.taskParam.startDate}}</span></div>
          <div class="task-info-row"><span class="left-text none-text">所选时间：</span><span class="right-text">{{analysisObj.taskParam.endDate}}</span></div>
          <div class="task-info-row"><span class="left-text">相似度：</span><span class="right-text">≥ {{analysisObj.taskParam.semblance}}%</span></div>
          <div class="task-info-row"><span class="left-text">频次：</span><span class="right-text">{{analysisObj.taskParam.frequency}}</span></div>
          <template v-if="analysisObj.taskParam.webShowName">
            <div class="task-info-row" v-for="(item,index) in analysisObj.taskParam.webName" :key="index" :class="{'double-row': index < (analysisObj.taskParam.webName.length - 1)}">
              <span class="left-text" :class="{'none-text': index > 0}">区域设备：</span>
              <span class="right-text">{{item}}</span>
            </div>
          </template>
          <div class="edit-btn">
            <el-button type="primary" @click="editTask">修改任务</el-button>
          </div>
          </vue-scroll>
        </div>
        <!-- 搜索条件 -->
      <div class="info-left" v-if="isEdit">
        <vue-scroll>
          <el-form
            :model="searchData"
            ref="searchForm"
            :rules="rules"
            :hide-required-asterisk="true"
          >
            <!-- 任务名称 -->
            <el-form-item prop="taskName">
              <div class="task-name">
                <span class="left-text">任务名称：</span><span class="right-text">{{searchData.taskName}}</span>
                <!-- <el-input v-model="searchData.taskName" placeholder="请输入任务名称" disabled></el-input> -->
              </div>
            </el-form-item>
            <!-- 时间 -->
            <el-form-item prop="startTime">
              <div class="time-search">
                <!-- <p>开始</p> -->
                <el-date-picker
                  class="vl_date"
                  v-model="searchData.startTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="startDateOpt"
                  placeholder="开始时间"
                  :clearable="false"
                  :time-arrow-control="true"
                  default-time="00:00:00"
                ></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item prop="endTime">
              <div class="time-search">
                <!-- <p>结束</p> -->
                <el-date-picker
                  class="vl_date vl_date_end"
                  v-model="searchData.endTime"
                  :picker-options="endDateOpt"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  default-time="23:59:59"
                  placeholder="结束时间"
                  :time-arrow-control="true"
                  :clearable="false"
                ></el-date-picker>
              </div>
            </el-form-item>
            <!-- 区域选择 -->
            <el-form-item>
                <div class="select_map"><span>区域：</span><span @click="selectMap" class="select_map_color">地图框选区域</span></div>
            </el-form-item>
            <el-form-item>
              <div class="select_db">
                已选<span>{{dSum}}</span>个设备
              </div>
            </el-form-item>
            <!-- 相似度搜索 -->
            <el-form-item prop="similarity">
              <div class="similarity">
                <div class="per_semblance_pfcm"><span>相似度：≥</span><el-input oninput="value=value.replace(/[^0-9.]/g,''); if(value >= 100)value = 100" placeholder="填写相似度数字" v-model="searchData.similarity"></el-input>%</div>
                <!-- <ul class="similarity-input">
                  <li class="input-name">
                    <el-input placeholder="相似度" readonly v-model="searchData.similarityName"></el-input>
                  </li>
                  <li class="input-value">
                    <el-input v-model="searchData.similarity" placeholder></el-input>
                  </li>
                </ul>
                <p class="symbol"></p>
                <p class="max-value">100</p> -->
              </div>
            </el-form-item>
            <!-- 频次搜索 -->
            <el-form-item prop="frequency">
              <div class="frequency">
                <ul class="frequency-input">
                  <li class="input-name">
                    <el-input placeholder="频次不少于" readonly v-model="searchData.frequencyName"></el-input>
                  </li>
                  <li class="input-value">
                    <el-input v-model="searchData.frequency" placeholder></el-input>
                  </li>
                </ul>
                <p class="another-value">次</p>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="search-btn">
                <el-button @click="resetSearch('searchForm')">取消</el-button>
                <el-button
                  type="primary"
                  @click="submitForm('searchForm')"
                  :loading="searching"
                >确定</el-button>
              </div>
            </el-form-item>
          </el-form>
        </vue-scroll>
      </div>
      <div v-loading="loading" class="analysis-rc-info">
      <vue-scroll> 
      <div v-if="list && list.length > 0">
        <p class="result-info">检索结果<span class="num">({{list.length}})</span></p>
        <div class="analysis-r-content">
          <div class="img-item" v-for="(item,index) of list.slice((pagination.pageNum-1)*pagination.pageSize,pagination.pageNum*pagination.pageSize)" :key="index">
            <div class="img-box" @click="toSnapDetail(item)">
              <img alt="头像" :src="item.personDetailList[0].subStoragePath">
              <i class="vl_icon vl_icon_portrait_01"></i>
              <p class="num">
                <span>{{item.appearTotal}}</span>
                <span class="text">次</span>
              </p>
            </div>
          </div>
        </div>
        <template v-if="pagination.total > 0">
          <el-pagination
            class="cum_pagination"
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.pageNum"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="pagination.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="pagination.total"
          ></el-pagination>
        </template>
      </div>
      <div class="no-data" v-if="isShow && (!list || list.length <= 0) ">
        <div class="content">
        <img src="../../../../assets/img/not-content.png" alt="">
        <p style="color: #666666; margin-top: 30px;">抱歉，没有相关的结果!</p>
        </div>
      </div>
      </vue-scroll>  
      </div>
      </div>
      <snapDialog ref="snapDialogComp" :snapObj="snapObj"></snapDialog>

      <div is="mapSelector" singleAreas :editAble="editAble" hideDBlist :open="openMap" :activeDeviceList="activeDeviceList" :clear="msClear" :showTypes="'DB'" @mapSelectorEmit="mapSelectorEmit"></div>
    
  </div>
</template>

<script>
import { getTaskInfosDetail, postModifyTaskAnalysis } from "../../api/api.analysis.js";
import { getCaBa } from "@/views/index/api/api.base.js";
import snapDialog from './components/snapDetail';
import vlBreadcrumb from '@/components/common/breadcrumb.vue';
import mapSelector from '@/components/common/mapSelector.vue';
import { validateSimilarity, validateFrequency } from "@/utils/validator.js";
import { dateOrigin, formatDate  } from "@/utils/util.js";
export default {
  components: { snapDialog , vlBreadcrumb, mapSelector},
  data() {
    return {
      uid: '',
      pagination: { total: 0, pageSize: 18, pageNum: 1 },
      list: [],
      snapObj: {},
      isShow: false,
      loading: false,
      analysisObj: null,
      cameraIds: [], //摄像头
      bayonetIds: [], //卡口
      allNames: '',
      isEdit: false,
      searchData: {
        //搜索参数
        address: "",
        taskName: "",
        startTime: "",
        endTime: "",
        similarityName: "相似度",
        similarity: "85", // 相似度
        frequency: "3", //频次
        frequencyName: "频次不少于"
      },
      rules: {
        taskName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" },
          { min: 0, max: 20, message: "最大长度为20个字符", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ],
        similarity: [
          { required: true, message: "相似度不能为空", trigger: "blur" },
          { validator: validateSimilarity, trigger: "blur" }
        ],
        frequency: [
          { required: true, message: "频次不能为空", trigger: "blur" },
          { validator: validateFrequency, trigger: "blur" }
        ]
      },
      startDateOpt: {
        disabledDate: time => {
          if (this.searchData.endTime) {
            return (
              time.getTime() > new Date(this.searchData.endTime).getTime()
              /*  || time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 30 */
            );
          } else {
            return (
              /* time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 30 || */
              time.getTime() > new Date().getTime()
            );
          }
        }
      },
      endDateOpt: {
        disabledDate: time => {
          if (this.searchData.startTime) {
            return (
              time.getTime() < new Date(this.searchData.startTime).getTime() ||
              time.getTime() > new Date().getTime()
            );
          } else {
            return (
              /* time.getTime() < new Date().getTime() - 3600 * 1000 * 24 * 30 || */
              time.getTime() > new Date().getTime()
            );
          }
        }
      },
      searching: false,
      /* 区域选择 */
      openMap: false,
      editAble: true,
      hideDBlist: false,
      showTypes: "DB", //设备类型
      msClear: null,
      activeDeviceList: [],
      dSum: 0, // 设备总数
    };
  },
  mounted() {
    this.uid = this.$route.query.uid
    /* for(let i=0; i<50; i++) {
      let personDetailList = []
      for(let k=0; k<4;k++) {
        personDetailList.push({
            "feature": "青年，女性",
            "deviceName": "摄像头k"+k,
            "deviceNamePinyin": "摄像头3",
            "address": "长沙市天心区上街广发银行北门003_"+k,
            "videoPath": "http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4",
            "shotPlaceLongitude": 110.594419,
            "shotPlaceLatitude": 27.908869,
            "subStoragePath": "http://file.aorise.org/vlink/image/f93bdaff-e12c-4a08-a596-402fcdd1a10d.png",
            "shotTime": "2018-11-12 13:14:16",
            "personStoragePath": "http://file.aorise.org/vlink/image/9fcfc0db-c70e-4cfa-adbe-4f0f6b9ecee8.png",
            "bussId": "1111111111111111111111111111111",
        })
      personDetailList.push({
            "feature": "少年，女性",
            "deviceName": "人像摄像"+k,
            "deviceNamePinyin": "摄像头3",
            "address": "湖南省长沙市天心区黑石铺街道九峰路九峰安置小区——"+k,
            "videoPath": "http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4",
            "shotPlaceLongitude": 112.973613,
            "shotPlaceLatitude": 28.095893,
            "subStoragePath": "http://file.aorise.org/vlink/image/9fcfc0db-c70e-4cfa-adbe-4f0f6b9ecee8.png",
            "shotTime": "2019-11-12 13:14:16",
            "personStoragePath": "http://file.aorise.org/vlink/image/40946e56-3292-4c3b-bd34-199f647ac8b8.png",
            "bussId": "2222222222222222222222222222222",
        })
        personDetailList.push({
            "feature": "少年，男性",
            "deviceName": "哈哈哈"+k,
            "deviceNamePinyin": "摄像头3",
            "address": "湖南省长沙市天心区黑石铺街道黑石铺路——"+k,
            "videoPath": "http://file.aorise.org/vlink/file/544df0f0-dea9-46d8-b02a-3f6c1c86e28a.mp4",
            "shotPlaceLongitude": 112.973334,
            "shotPlaceLatitude": 28.097071,
            "subStoragePath": "http://file.aorise.org/vlink/image/40946e56-3292-4c3b-bd34-199f647ac8b8.png",
            "shotTime": "2019-11-12 13:14:16",
            "personStoragePath": "http://file.aorise.org/vlink/image/f93bdaff-e12c-4a08-a596-402fcdd1a10d.png",
            "bussId": "33333333333333333333333333333333",
        })
    }
    this.list.push({
        "appearTotal": i,
        "personDetailList": [...personDetailList]
      })
    }
    this.list.sort(this.sortVal) */
    this.getDetail();
  },
  methods: {
    //重置
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.setDate();
      this.msClear = !this.msClear; // 清除地图选择
      this.isEdit = false
      /* this.resetZoom(); */
    },
    //新建
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            jobName: this.searchData.taskName,
            startDate: formatDate(this.searchData.startTime),
            endDate: formatDate(this.searchData.endTime),
            semblance: this.searchData.similarity,
            frequency: this.searchData.frequency,
            id: this.uid,
          };
          if (this.cameraIds && this.cameraIds.length > 0) {
            this.cameraIds &&
              this.cameraIds.length > 0 &&
              (params["deviceIds"] = this.cameraIds.join(","));
          } else {
            if(this.analysisObj.taskParam.deviceIds) {
              params["deviceIds"] = this.analysisObj.taskParam.deviceIds;
            }
            if(this.analysisObj.taskParam.areaIds) {
              params["areaIds"] = this.analysisObj.taskParam.areaIds;
            }
          }
          if (this.bayonetIds && this.bayonetIds.length > 0) {
            this.bayonetIds &&
              this.bayonetIds.length > 0 &&
              (params["bayonetIds"] = this.bayonetIds.join(","));
          } else {
            if(this.analysisObj.taskParam.bayonetIds) {
              params["bayonetIds"] = this.analysisObj.taskParam.bayonetIds;
            }
            if(this.analysisObj.taskParam.areaIds) {
              params["areaIds"] = this.analysisObj.taskParam.areaIds;
            }
          }
          let ids = {
            id: this.uid
          }
          console.log("-------submitForm-------", params);
          this.searching = true;
          postModifyTaskAnalysis(params, ids)
            .then(res => {
              console.log(res);
              if (res) {
                /* this.$router.push({
                  name: "portrait_pfcm"
                }); */
                this.$MyMessage("修改离线分析任务成功！", 'success');
                this.$router.push({name: 'portrait_new_pfcm'})
              }
              this.$nextTick(() => {
                this.searching = false;
              });
            })
            .catch(error => {
              console.log(error);
              this.searching = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //选择区域
    selectMap() {
      this.openMap = !this.openMap;
      this.editAble = true;
    },
    //设置时间
    setDate() {
      let _s = dateOrigin(false, new Date(new Date().getTime() - 3600 * 1000 * 24 * 1));
      let _e = new Date();
      this.searchData.startTime = _s;
      this.searchData.endTime = _e;
    },
    mapSelectorEmit (result) {
      if (result) {
        console.log("------------",result)
        this.dSum = 0;
        this.cameraIds = []
        this.bayonetIds = []
        this.cameraIds = result.deviceList.map(item => item.uid)
        this.bayonetIds = result.bayonetList.map(item => item.uid)
        this.dSum = this.cameraIds.length + this.bayonetIds.length;
      }
    },
    editTask() {
      this.isEdit = true
      this.$set(this.searchData, 'taskName', this.analysisObj.taskName)
      this.$set(this.searchData, 'startTime', this.analysisObj.taskParam.startDate)
      this.$set(this.searchData, 'endTime', this.analysisObj.taskParam.endDate)
      this.$set(this.searchData, 'similarity', this.analysisObj.taskParam.semblance)
      this.$set(this.searchData, 'frequency', this.analysisObj.taskParam.frequency)
      console.log("-------------",this.analysisObj)
      if(this.analysisObj.taskParam.deviceIds || this.analysisObj.taskParam.bayonetIds) {
        let deviceIds = [], bayonetIds = []
        if(this.analysisObj.taskParam.deviceIds) {
          deviceIds = this.analysisObj.taskParam.deviceIds.split(",")
        }
        if(this.analysisObj.taskParam.bayonetIds) {
          bayonetIds = this.analysisObj.taskParam.bayonetIds.split(",")
        }
        this.activeDeviceList = [...bayonetIds, ...deviceIds]
      }else if(this.analysisObj.taskParam.areaIds) {
        getCaBa({areaIds:this.analysisObj.taskParam.areaIds}).then(res => {
          if(res && res.data) {
            let bayonetList = [], deviceList = []
            if(res.data.bayonetList && res.data.bayonetList.length > 0) {
              bayonetList = res.data.bayonetList.map(key => key.uid)
            }
            if(res.data.deviceList && res.data.deviceList.length > 0) {
              deviceList = res.data.deviceList.map(key => key.uid)
            }
            this.activeDeviceList = [...bayonetList, ...deviceList]
            this.dSum = this.activeDeviceList.length
          }
        })
      }
    },

    handleCurrentChange(page) {
      this.pagination.pageNum = page;
    },
    //分析结果
    getDetail() {
      this.loading = true
      getTaskInfosDetail(this.uid).then(res => {
        console.log("------getTaskInfosDetail-------",res,JSON.parse(res.data.taskResult))
        if(res && res.data) {
          let taskResult = JSON.parse(res.data.taskResult)
          let taskWebParam = JSON.parse(res.data.taskWebParam)
          this.analysisObj = res.data
          let webShowName = taskWebParam.webShowName
          if(webShowName && webShowName.length > 0 ) {
            let webName = webShowName.split(",")
            this.$set(taskWebParam,'webName',webName)
          }
          this.$set(this.analysisObj,'taskParam',taskWebParam)
          let deviceIds = [], bayonetIds = []
          if(this.analysisObj.taskParam.deviceIds) {
            deviceIds = this.analysisObj.taskParam.deviceIds.split(",")
          }
          if(this.analysisObj.taskParam.bayonetIds) {
            bayonetIds = this.analysisObj.taskParam.bayonetIds.split(",")
          }
          /* let deviceIds = this.analysisObj.taskParam.deviceIds.split(",")
          let bayonetIds = this.analysisObj.taskParam.bayonetIds.split(",") */
          this.dSum = deviceIds.length + bayonetIds.length
          this.list = taskResult.resultList
          if(this.list && this.list.length > 0) {
            this.list.sort(this.sortVal)
            this.pagination.total = this.list.length
          }else {
            this.$nextTick(() => {
              this.isShow = true
            })
          }
          /* this.getListDevice();
          this.getListBayonet(); */
        }
        this.$nextTick(() => {
          this.loading = false
        })
      }).catch(error => {
        this.isShow = true
        this.loading = false
        console.log(error)
      })
    },
    //排序
    sortVal(a, b) {
      console.log(a,b)
      return b.appearTotal - a.appearTotal;
    },
    //详情弹窗
    toSnapDetail(obj) {
      console.log("obj",obj)
      this.snapObj = obj;
      this.$refs["snapDialogComp"].toogleVisiable(true);
    },
  }
};
</script>

<style lang="scss" scoped>
.analysis-results {
  width: 100%;
  height: calc(100% - 50px);
  .breadcrumb_heaer {
    background: #fff;
    border-bottom: 1px solid #d3d3d3;
  }
  .analysis-r-body {
    height: 100%;
    display: flex;
    .task-info {
      width: 272px;
      height: 100%;
      padding: 20px 0 20px 20px;
      color: #999;
      background: #fff;
      box-shadow: 2px 3px 10px 0px rgba(131, 131, 131, 0.28);
      /* animation: fadeInLeft 0.4s ease-out 0.3s both; */
      .task-info-row {
        line-height: 24px;
        padding-bottom: 10px;
        display: flex;
        margin-right: 20px;
        .left-text {
          flex: none;
          width: 70px;
        }
        .none-text {
          color: #fff;
          visibility: hidden;
        }
        .right-text {
          color: #555;
        }
      }
      .double-row {
        padding-bottom: 0;
      }
      .edit-btn {
        text-align: center;
        margin-right: 20px;
      }
    }
    .info-left {
      position: relative;
      width: 272px;
      padding: 20px 0 20px 20px;
      color: #999;
      background: #fff;
      box-shadow: 2px 3px 10px 0px rgba(131, 131, 131, 0.28);
      /* animation: fadeInLeft 0.4s ease-out 0.3s both; */
      .time-search {
        display: flex;
        p {
          width: 20px;
        }
      }
      .select_map {
          .select_map_color {
              color: #0C70F8;
              cursor: pointer;
          }
      }
      .select_db {
        width: 232px;
        padding: 2px 15px;
        background-color: #F5F7FA;
        color: #C0C4CC;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        > span {
          display: inline-block;
          padding: 0 3px;
          color: #333;
        }
      }
      .vl_judge_tc_c_item {
        width: 232px;
        height: 232px;
        display: inline-block;
        position: relative;
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
      //下划线
      .line {
        width: 232px;
        height: 1px;
        background-color: #d3d3d3;
        margin: 6px 0;
      }
      //相似度,频次,任务名称搜索
      .task-name {
        width: 232px;
        .right-text {
          color: #555;
        }
      }
      /* .similarity {
        width: 232px;
        display: flex;
        .similarity-input {
          display: flex;
          border: 1px solid #dcdfe6;
          width: 148px;
          height: 40px;
          border-radius: 4px;
          &:hover,
          &:focus {
            border-color: #0c70f8;
          }
          .input-name {
            width: 60px;
          }
          .input-value {
            width: 88px;
          }
        }
        .symbol {
          margin: 19px 16px;
          width: 20px;
          height: 1px;
          background: #999;
        }
        .max-value {
          color: #333;
          line-height: 40px;
        }
      } */
      .frequency {
        width: 232px;
        display: flex;
        .frequency-input {
          display: flex;
          border: 1px solid #dcdfe6;
          width: 202px;
          height: 40px;
          border-radius: 4px;
          &:hover,
          &:focus {
            border-color: #0c70f8;
          }
          .input-name {
            width: 88px;
          }
          .input-value {
            width: 112px;
          }
        }
        .another-value {
          color: #333;
          line-height: 40px;
          margin-left: 8px;
        }
      }
      .width232 {
        width: 232px;
      }
    }
  .analysis-rc-info {
      width: calc(100% - 272px);
      height: 100%;
      .result-info {
        color: #333;
        font-size: 14px;
        padding: .2rem;
        .num {
          color: #666;
        }
      }
      .analysis-r-content {
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        .img-item {
          width: 2.36rem;
          height: 2.36rem;
          margin: 0 0 .2rem .2rem;
          background-color: #fff;
          box-shadow: 0px 2px 10px 0px rgba(131, 131, 131, 0.12);
          .img-box {
            position: relative;
            width: 2.02rem;
            height: 2.02rem;
            background-color: #999;
            margin: .16rem;
            >img {
              width: 2.02rem;
              height: 2.02rem;
            }
            i {
              position: absolute;
              top: -0.01rem;
              right: -0.01rem;
            }
            .num {
              display: block;
              position: absolute;
              top: -3px;
              right: -5px;
              width: 100px;
              height: 100px;
              text-align: center;
              font-size: .2rem;
              font-weight: 600;
              color: #fff;
              -webkit-transform: rotate(45deg);
              -moz-transform: rotate(45deg);
              -ms-transform: rotate(45deg);
              -o-transform: rotate(45deg);
              transform: rotate(45deg);
              z-index: 99;
            }
            .text {
              font-weight: 500;
              font-size: 12px;  
            }
          }
        }
      }
      .cum_pagination {
        padding: .3rem 0 .4rem 0;
        text-align: center;
      }
    }
    .no-data {
      position: fixed;
      top: 1.5rem;
      right: 0;
      bottom: 0;
      left: 272px;
      text-align: center;
      font-size: 0;
      white-space: nowrap;
      overflow: auto;
      &:after {
        content: '';
        display: inline-block;
        height: 100%;
        vertical-align: middle;
        margin-top: -.3rem;
      }
      .content {
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        font-size: 14px;
        white-space: normal;
        margin-top: -.3rem;
      }
    }
  }
  
}
</style>
<style lang="scss">
html {font-size: 100px;}
  @media screen and (min-width: 960px) and (max-width: 1119px) {html {font-size: 60px !important;}}
  @media screen and (min-width: 1200px) and (max-width: 1439px) {html {font-size: 70px !important;}}
  @media screen and (min-width: 1440px) and (max-width: 1679px) {html {font-size: 80px !important;}}
  @media screen and (min-width: 1680px) and (max-width: 1919px) {html {font-size: 90px !important;}}
  @media screen and (min-width: 1920px) {html {font-size: 100px !important;} }
.analysis-results {
  .__view {
    width: 100% !important; // vue-scroll样式重置
  }
  // 搜索框
  .search-wrap {
    .el-input__inner {
      background: #f2f2f2;
      border-width: 0;
      border-radius: 20px;
    }
  }
  .search_box {
      .el-form-item {
          margin-bottom: 20px;
      }
  }
  //相似度搜索
  .similarity {
    .per_semblance_pfcm {
      color: #555;
      position: relative;
      >span {
        position: absolute;
        left: 0;
        display: block;
        height: 40px;
        line-height: 40px;
        z-index: 9;
        color: #606266;
        width: 82px;
        padding-left: 12px;
      }
      >i {
        display: inline-block;
        width: 20px;
        height: 1px;
        background: #999;
        margin: 19px 16px;
        vertical-align: middle;
      }
      .el-input {
        width: 202px;
        margin-right: 10px;
        input{
          text-indent: 69px;
        }
      }
    }
  }
  .frequency {
    .el-input__inner {
      border: none;
      height: 38px;
    }
    .input-name {
      .el-input__inner {
        padding: 0 0 0 15px;
      }
    }
  }
  //频次
  /* .frequency {
    .el-input {
      width: 126px;
    }
  } */
  //车牌颜色
  .license-plate-color {
    .el-select {
      width: 232px;
    }
  }
  //时间搜索
  .time-search {
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 232px;
    }
  }
  //搜索按钮
  .search-btn {
    width: 232px;
    text-align: center;
    margin-top: 10px;
    .el-button {
      width: 110px;
    }
    .el-button--primary {
      background-color: #0c70f8;
      border-color: #0c70f8;
    }
    .el-button+.el-button {
      margin-left: 12px;
    }
  }
  .info-left {
    .el-form-item {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .el-form-item__content {
      line-height: 1.5;
    }
    .under-line {
      .el-form-item__content {
        line-height: 1;
      }
    }
  }
  /* 表单错误提示 */
  .el-form-item__error {
    position: static;
    padding-top: 0;
    margin-bottom: -10px;
    line-height: 20px;
  }
}
</style>



