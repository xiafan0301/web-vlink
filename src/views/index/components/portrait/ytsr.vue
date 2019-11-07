<template>
  <div class="vl_judge_tc_ytsr_base">
    <div class="">
      <div is="vlBreadcrumb"
           :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
            {name: '以图搜人', routerName: 'portrait_ytsr_moment'},
            {name: '搜索结果'}]">
      </div>
    </div>
    <div class="vl_j_left">
      <template v-if="showNewTask">
        <div class="vl_jtc_img_box">
          <div style="padding: 0 25px; height: 210px;">
            <div is="vlUpload" :clear="uploadClear" @uploadEmit="uploadEmit" :imgData="imgData"></div>
          </div>
        </div>
        <div class="per_semblance_ytsr"><span>相似度：≥</span><el-input oninput="value=value.replace(/[^0-9.]/g,''); if(value >= 100)value = 100" placeholder="填写相似度数字" v-model="searchData.minSemblance"></el-input>%</div>
        <!--查询范围-->
        <div class="ytsr_left_radio">
          <span>查询范围：</span>
          <span>
          <el-radio v-model="radio" label="1">基础信息库</el-radio>
          <el-radio style="display:block;" v-model="radio" label="2">抓拍视图库</el-radio>
          <el-radio style="display: block;" v-model="radio" label="3">布控库</el-radio>
        </span>
        </div>
        <div class="ytsr_left_search" v-show="radio === '1'">
          <el-select
                  v-model="searchData.portraitGroupId"
                  placeholder="全部人像"
                  multiple
                  collapse-tags
          >
            <el-option
                    v-for="item in portraitGroupList"
                    :key="item.uid"
                    :label="item.groupName"
                    :value="item.uid">
            </el-option>
          </el-select>
        </div>
        <div class="ytsr_left_search"  v-show="radio === '2'">
          <div class="left_time">
            <el-date-picker
                v-model="searchData.startTime"
                style="width: 100%;margin-bottom: 20px;"
                class="vl_date"
                type="datetime"
                :time-arrow-control="true"
                :picker-options="pickerOptions"
                value-format="timestamp"
                placeholder="选择日期时间">
            </el-date-picker>
            <el-date-picker
                style="width: 100%;"
                class="vl_date vl_date_end"
                v-model="searchData.endTime"
                :picker-options="pickerOptions"
                :time-arrow-control="true"
                value-format="timestamp"
                type="datetime"
                placeholder="选择日期时间">
            </el-date-picker>
          </div>
          <div class="ytsr_xzsb_s" @click="areaTypeChanged" v-if="chooseType === 1">
            <span>选择设备</span>
            <span class="el-icon-arrow-down"></span>
          </div>
          <div class="ytsr_dtxz_rst" v-else>
            已选<span>{{dSum}}</span>个设备<a href="javascript: void(0);" @click="openMap={}">重选</a>
          </div>
        </div>
        <div class="ytsr_left_search" v-show="radio === '3'">
          <el-select
                  v-model="searchData.portraitGroupId"
                  placeholder="全部人像"
                  multiple
                  collapse-tags
          >
            <el-option
                    v-for="item in controlGroupList"
                    :key="item.id"
                    :label="item.groupName"
                    :value="item.uid">
            </el-option>
          </el-select>
        </div>
        <div class="vl_jtc_search">
          <div style="text-align: center;margin-bottom: 0px;">
            <el-button @click="resetSearch">取消</el-button>
            <el-button type="primary" :loading="searching" @click="tcDiscuss(false)">确定</el-button>
          </div>
        </div>
      </template>
      <template v-else>
        <img :src="taskDetail.uploadImgUrls" alt="">
        <!--<img src="http://file.aorise.org/vlink/image/447e505b-03f9-4775-8416-68ca3f9e6ee5.jpg" alt="">-->
        <div class="vl_ytsr_left_line" v-show="taskDetail.taskName">
          <span>任务名称：</span>{{taskDetail.taskName}}
        </div>
        <div class="vl_ytsr_left_line">
          <span>相似度：</span>≥{{taskDetail ? taskDetail.minSemblance : 0}}%
        </div>
        <div class="vl_ytsr_left_line">
          <span v-if="radio === '1'">基础信息库：</span>
          <span v-else>布控库：</span>
          <span v-if="taskDetail.portraitGroupName && taskDetail.portraitGroupName.length">
            <p v-for="item in taskDetail.portraitGroupName" :key="item.id">{{item}}</p>
          </span>
          <span v-else>
            <p>全部人像</p>
          </span>
        </div>
        <div class="update_task">
          <el-button type="primary" @click="initParams">修改任务</el-button>
        </div>
      </template>
    </div>
    <div class="vl_s_right">
      <div class="vl_jig_right">
        <template v-if="strucInfoList && strucInfoList.length > 0">
          <div class="vl_jig_right_title">
            <div class="vl_jr_t_item">
              <span><span style="color: #333333">检索结果 </span> ({{strucInfoList.length}})</span>
            </div>
          </div>
          <div class="vl_jfo_event">
            <vue-scroll>
              <div class="vl_jfo_event_box clearfix">
                <div class="vl_jfo_box_item" v-for="(item, index) in curStrucInfoList" :key="item.id" @click="showStrucInfo(item, index)">
                  <div class="vl_jfo_i_left"><img :src="item.photoUrl" alt=""></div>
                  <div class="vl_jfo_i_right">
                    <p>检索资料</p>
                    <div class="vl_jfo_line"><span>{{item.name}}</span></div>
                    <br>
                    <div class="vl_jfo_line"><span>{{item.originBank}}</span></div>
                    <div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_03"></i>{{(item.semblance*1).toFixed(2)}}<span style="font-size: 12px;">%</span></div>
                  </div>
                </div>
              </div>
            </vue-scroll>
            <el-pagination
                    class="cum_pagination cum_pagination_shot"
                    @current-change="handleCurrentChange1"
                    :current-page.sync="pagination.pageNum"
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size="pagination.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="pagination.total"
            ></el-pagination>
          </div>
        </template>
        <template v-else>
          <div is="noResult"></div>
        </template>
        </div>
    </div>
    <!--检索详情弹窗-->
    <el-dialog
      :visible.sync="strucDetailDialog"
      class="struc_detail_dialog_ytsr"
      :close-on-click-modal="false"
      top="4vh"
      :show-close="false">
      <div class="struc_tab">
        <span>检索详情</span>
        <!--<span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>-->
        <!--<span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>-->
        <i class="el-icon-close" @click="strucDetailDialog = false"></i>
      </div>
      <div class="struc_main">
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img  class="bigImg" :src="sturcDetail.upPhotoUrl" alt="">
            <span>上传图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img">
              <img class="bigImg" :src="sturcDetail.photoUrl" alt="">
              <span>底库图</span>
            </div>
            <div class="struc_c_d_info">
              <h2>{{sturcDetail.name}}<div class="vl_jfo_sim" ><i class="vl_icon vl_icon_retrieval_03"></i>{{sturcDetail.semblance ? (sturcDetail.semblance*1).toFixed(2) : '0.00'}}<span style="font-size: 12px;">%</span></div></h2>
              <div class="struc_cdi_line">
                <span v-show="sturcDetail.sex">{{sturcDetail.sex}}</span>
                <span v-show="sturcDetail.nation">{{sturcDetail.nation}}</span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.birthDate}}</span>
              </div>
              <div class="struc_cdi_line">
                <span>{{sturcDetail.idNo}}<i class="el-icon-postcard"></i></span>
              </div>
              <div class="struc_cdi_line" v-show="sturcDetail.group">
                <span>{{sturcDetail.group}}</span>
              </div>
              <div class="struc_cdi_line"></div>
            </div>
            <span>信息库信息</span>
          </div>
        </div>
      </div>
      <div class="struc-list">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in curStrucInfoList" :key="item.id">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
              <img style="height: .88rem;width: 50%;padding-right: .02rem;" :src="item.upPhotoUrl" alt="">
              <img style="height: .88rem;width: 50%;padding-left: .02rem;" :src="item.photoUrl" alt="">
              <div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_05" :class="{'vl_icon_retrieval_06':  index === curImgIndex}"></i>{{item.semblance ? (item.semblance*1).toFixed(2) : '0.00'}}<span style="font-size: 12px;">%</span></div>
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
    </el-dialog>
    <!-- D设备 B卡口  这里是设备和卡口 -->
    <div
        is="mapSelector"
        :open="openMap"
        :clear="msClear"
        :showTypes="'DB'"
        @mapSelectorEmit="mapSelectorEmit">
    </div>
  </div>
</template>
<script>
  import vlBreadcrumb from '@/components/common/breadcrumb.vue';
  import mapSelector from '@/components/common/mapSelector.vue';
  import vlUpload from '@/components/common/upload.vue';
  import { formatDate } from "@/utils/util.js";
  import noResult from '@/components/common/noResult.vue';
  import { getPeopleTaskDetail } from '@/views/index/api/api.analysis.js';
  import { PortraitPostByphotoRealtime, PortraitPostByphotoTask} from '@/views/index/api/api.portrait.js';
  import {getGroups} from '../../api/api.judge.js';
  export default {
    components: {vlBreadcrumb, noResult, vlUpload, mapSelector},
    data() {
      return {
        // 修改任务相关
        imgData:null,
        imgList: null,
        portraitGroupList: [],
        controlGroupList: [],
        uploadClear: {},
        searchData: {
          minSemblance: 85, // 最小相似度
          portraitGroupId: [],
          startTime: '',
          endTime: ''
        },
        radio: "1",
        dSum: 0, // 设备总数
        selectCameraArr: [],
        selectBayonetArr: [],
        chooseType: 1, // 选择设备装备，1是刚进入，2是已选择
        showNewTask: false, // 展示修改任务
        searching: false,
        openMap: false,
        msClear: {},
        pickerOptions: {
          disabledDate (time) {
            return time > new Date();
          }
        },


        swiperOption: {
          slidesPerView: 5,
          spaceBetween: 10,
          slidesPerGroup: 5,
          loop: false,
          slideToClickedSlide: true,
          loopFillGroupWithBlank: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        },
        pagination: { total: 0, pageSize: 12, pageNum: 1 },
        mapData: [],
        amap: null, // 地图实例
        markerPoint: null, // 地图点集合
        InfoWindow: null,
        curVideoUrl: '',
        playing: false, // 视频播放是否
        historyPicDialog: false,
        stucOrder: 4, // 1升序，2降序，3监控，4相似度
        taskDetail: {},
        strucInfoList: [], // 检索抓拍信息
        strucCurTab: 1,
        curImgIndex: 0,
        sturcDetail: {},
        strucDetailDialog: false,
        videoUrl: '' // 弹窗视频回放里的视频
      }
    },
    mounted () {
      if (this.$route.query.uid) {
        this.getDetail();
      } else {
        this.getTheList();
      }

      // 获取人员组，跟车辆组列表, 修改任务相关
      getGroups({groupType: 4}).then(res => {
        if (res) {
          this.portraitGroupList = res.data;
        }
      })
      // 获取人员组，跟车辆组列表
      getGroups({groupType: 6}).then(res => {
        if (res) {
          this.controlGroupList = res.data;
        }
      })
      this.setDTime();
    },
    computed: {
      curStrucInfoList () {
        return this.strucInfoList.slice((this.pagination.pageNum - 1) * this.pagination.pageSize,  (this.pagination.pageNum) * this.pagination.pageSize)
      }
    },
    methods: {
      // 修改任务相关
      resetSearch () {
        this.msClear = {};
        this.dSum = 0;
        this.selectCameraArr = [];
        this.chooseType = 1;
        this.selectBayonetArr = [];
        this.showNewTask = false;
      },
      tcDiscuss (boolean) {
        let p1 = {
          origin: this.radio,
          taskOperateType: 1,
          taskName: this.taskDetail.taskName
        };
        let params = {
          origin: this.radio,
          taskOperateType: 1,
          taskName: this.taskDetail.taskName
        }
        if (!this.imgList) {
          if (!document.querySelector('.el-message--info')) {
            this.$message.info('请上传图片')
          }
          return false;
        } else {
          params['appendixIds'] = this.imgList.uid ? this.imgList.uid : null;
          params['uploadImgUrls'] = this.imgList.path;
        }
        if (this.searchData.minSemblance) {
          params['minSemblance'] = this.searchData.minSemblance;
        } else {
          params['minSemblance'] = 0;
        }
        if (this.radio === '1' || this.radio === '3') {
          p1['portraitGroupId'] = this.searchData.portraitGroupId.join(',');
          params['portraitGroupId'] = this.searchData.portraitGroupId.join(',');
          let pNameList = []
          this.searchData.portraitGroupId.forEach(x => {
            pNameList.push(this.portraitGroupList.find(y => y.uid === x).groupName)
          })
          params['portraitGroupName'] = pNameList;
        } else {
          if (this.dSum === 0) {
            this.$MyMessage('请选择设备')
            return false;
          }
          let dNameList = [];
          let dList = this.selectCameraArr.map(res =>  res.deviceName);
          let bList = this.selectBayonetArr.map(res => res.bayonetName);
          dNameList = dList.concat(bList);
          if (dNameList.length > 3) {
            params['deviceNames'] = dNameList.splice(0, 2);
            params['deviceNames'].push('等' + dNameList.length + '个设备');
            params['deviceNames'] =  params['deviceNames'].join(',')
          } else {
            params['deviceNames'] = dNameList.join(',')
          }
          p1['deviceIds'] = this.selectCameraArr.map(res => res.uid).join(',');
//          params['deviceIds'] = "5DTxZRNGOZuLsl07jcNO09";
          params['deviceIds'] = this.selectCameraArr.map(res => res.uid).join(',');
          p1['bayonetIds'] = this.selectBayonetArr.map(res => res.uid).join(',');
          params['bayonetIds'] = this.selectBayonetArr.map(res => res.uid).join(',');
          p1['startTime'] = formatDate(this.searchData.startTime, 'yyyy-MM-dd HH:mm:ss');
          params['startTime'] = formatDate(this.searchData.startTime, 'yyyy-MM-dd HH:mm:ss');
          p1['endTime'] = formatDate(this.searchData.endTime, 'yyyy-MM-dd HH:mm:ss');
          params['endTime'] = formatDate(this.searchData.endTime, 'yyyy-MM-dd HH:mm:ss');
        }
        if (!boolean) {
          this.searching = true;
        }
        this.searching = true;
        params.taskOperateType = 1;
        params.taskId = this.$route.query.uid;
        PortraitPostByphotoTask(params).then(res => {
          this.searching = false;
          if (res && res.data) {
            this.$message({
              type: 'success',
              message: '修改成功',
              customClass: 'request_tip'
            })
            this.$router.push({name: 'portrait_ytsr_moment'})
          }
        })
      },
      setDTime() {
        let date = new Date();
        let curDate = date.getTime();
        let curS = 1 * 24 * 3600 * 1000;
        let _sDate = new Date(curDate - curS);
        let _s = _sDate.getFullYear()+ '-' + (_sDate.getMonth() + 1) + '-' + _sDate.getDate() + ' 00:00:00' ;
        this.searchData.startTime = new Date(_s).getTime();
        this.searchData.endTime = curDate;
      },
      uploadEmit (data) {
        console.log('uploadEmit data', data);
        if (data && data.path) {
          this.imgList = data;
        } else {
          this.imgList = null;
        }
      },
      // 选择设备回调
      mapSelectorEmit (result) {
        if (result) {
          // bayonetList deviceList
          this.dSum = 0;
          this.selectCameraArr = [];
          this.selectBayonetArr = [];
          if (result.deviceList) {
            this.dSum = result.deviceList.length;
            this.selectCameraArr = result.deviceList;
          }
          if (result.bayonetList && result.bayonetList.length > 0) {
            this.dSum += result.bayonetList.length;
            this.selectBayonetArr = result.bayonetList;
          }
        }
      },
      areaTypeChanged () {
        this.chooseType = 2;
        this.openMap = {};
      },


      handleCurrentChange1 (e) {
        this.pagination.pageNum = e;

      },
      // 获取实时
      getTheList () {
          PortraitPostByphotoRealtime(this.$route.query)
            .then(sRes => {
              if (sRes) {
                this.$set(sRes.data, 'taskResult', JSON.parse(sRes.data.taskResult));
                this.$set(sRes.data, 'taskWebParam', JSON.parse(sRes.data.taskWebParam));
                console.log(sRes.data);
                this.strucInfoList = sRes.data.taskResult;
                this.taskDetail = sRes.data.taskWebParam;
              }
            })
      },
      // 获取离线任务详情
      getDetail () {
        const id = this.$route.query.uid
        if (id) {
          getPeopleTaskDetail(id)
              .then(res => {
                if (res) {
                  this.$set(res.data, 'taskResult', JSON.parse(res.data.taskResult));
                  this.$set(res.data, 'taskWebParam', JSON.parse(res.data.taskWebParam));
                  // res.data.taskResult.push(...res.data.taskResult)
                  this.strucInfoList = res.data.taskResult ? res.data.taskResult : [];
                  this.pagination.total = this.strucInfoList.length;
                  this.taskDetail = res.data.taskWebParam;
                }
              })
        }
      },
      initParams () {
        this.showNewTask = true;
        let {portraitGroupId, minSemblance, origin, uploadImgUrls} = this.taskDetail;
        this.radio = origin + '';
        this.$nextTick(() => {
          this.searchData.portraitGroupId = portraitGroupId.split(',');
        })
        this.searchData.minSemblance = minSemblance;
        this.setDTime();
        this.imgData = {
          cname: '带图' + Math.random(),
          filePathName: '带图' + Math.random(),
          path: uploadImgUrls
        }
      },
      showStrucInfo (data, index) {
        this.curImgIndex = index;
        this.strucDetailDialog = true;
        this.sturcDetail = data;
        console.log(JSON.stringify(data) , 'data')
      },
      imgListTap (data, index) {
        this.curImgIndex = index;
        this.sturcDetail = data;
      }
    },
    watch: {
      radio () {
        this.searchData.portraitGroupId = [];
        this.msClear = {};
        this.dSum = 0;
        this.selectCameraArr = [];
        this.chooseType = 1;
        this.selectBayonetArr = [];
      }
    }
  }
</script>
<style lang="scss" scoped="scoped">
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
</style>
<style lang="scss">
  .cum_pagination_shot {
    padding: 0px;
    padding-right: 30px;
  }
  .breadcrumb_heaer {
    background: #ffffff;
    border-bottom: 1px solid #D3D3D3;
  }
  .cap_info_win {
    background: #FFFFFF;
    padding: .18rem;
    font-size: .14rem;
    color: #666666;
    position: relative;
    &:after {
      display: block;
      content: '';
      border: .1rem solid #FFFFFF;
      border-color: #FFFFFF transparent transparent;
      position: absolute;
      bottom: -.2rem;
      left: calc(50% - .05rem);
    }
  }
  .vl_judge_tc_ytsr_base {
    width: 100%;
    height: 100%;
    .vl_j_left {
      float: left;
      width: 272px;
      padding-top: 20px;
      /*padding-left: 20px;*/
      height: calc(100% - 56px);
      min-height: 788px;
      background: #ffffff;
      box-shadow: 2px 3px 10px 0px rgba(131, 131, 131, 0.28);
      animation: fadeInLeft .4s ease-out .3s both;
      > img {
        width: 232px;
        height: 232px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        margin-bottom: 30px;
        margin-left: 20px;
      }
      .vl_ytsr_left_line {
        color: #555555;
        margin-bottom: 20px;
        margin-left: 20px;
        display: flex;
        span {
          /*width: 70px;*/
          text-align: right;
          display: block;
          color: #999999;
          p {
            color: #555555;
            text-align: left;
          }
          &:first-child {
            width: 85px;
          }
        }
      }
      .update_task {
        text-align: center;
      }
      .vl_jtc_img_box {
        width: 100%;
        height: auto;
        border-bottom: 1px solid #D3D3D3;
        padding-bottom: 30px;
        margin-bottom: 30px;
        .vl_jtc_img_list {
          width: 100%;
          margin-top: 10px;
          text-align: center;
          .middle_img {
            display: inline-block;
          }
          > div {
            width: 30%;
            padding-top: 30%;
            border: 1px dashed #D3D3D3;
            position: relative;
            &:hover {
              .del_mask {
                display: block;
              }
            }
            &:last-child {
              float: right;
            }
            &:first-child {
              float: left;
            }
            .del_mask {
              display: none;
              position: absolute;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, .2);
              top: 0;
              > i {
                cursor: pointer;
                display: block;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                color: #ffffff;
                width: 16px;
                height: 16px;
                text-align: center;
              }
            }
            > img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .ytsr_left_radio {
        padding-left: 20px;
        margin: 20px 0;
        display: flex;
        height: 40px;
        >span {
          display: block;
          &:first-child {
            width: 90px;
            line-height: 40px;
          }
        }
      }
      .ytsr_left_search {
        margin-left: 20px;
        width: 232px;
        .el-select {
          width: 100%;
        }
        .left_time {
          width: 100%;
          margin: 20px 0;
          .el-date-editor {
            width: 100%;
          }
          .el-range__close-icon {
            display: none;
          }
        }
      }
      .vl_jtc_search {
        width: 100%;
        height: auto;
        padding: 30px 0 20px 0;
        .el-input__inner {
          height: 40px!important;
          line-height: 40px!important;
        }
        .el-input__icon {
          height: 40px!important;
          line-height: 40px!important;
        }
        .el-range-editor {
          width: 100%;
          /*padding: 0;*/
          > .el-range__close-icon {
            display: none;
          }
          > input {
            width: 50%;
          }
        }
        button {
          width: 110px;
          height: 40px;
          line-height: 40px;
          padding: 0 12px;
        }
        .el-select {
          margin-bottom: 10px;
        }
        > div {
          margin-bottom: 10px;
        }
        .vl_jtc_search_item {
          height: 217px;
          .camera-tree {
            border: 1px solid #e4e7ed;
            border-radius: 4px;
            background-color: #fff;
            -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            -webkit-box-sizing: border-box;
          }
        }
      }
    }
    .vl_s_right {
      display: inline-block;
      width: calc(100% - 272px);
      height: calc(100% - 56px);
      position: relative;
      .vl_jig_right {
        width: 100%;
        height: calc(100% - 48px);
        padding: 0 20px;
        padding-right: 0;
        min-height: 738px;
        .vl_jig_right_title {
          width: 100%;
          height: 50px;
          line-height: 50px;
          color: #999999;
          .vl_jr_t_item {
            float: left;
            width: 50%;
            text-align: left;
            padding-left: 10px;
            >div {
              cursor: pointer;
              display: inline-block;
            }
            .active-item {
              color: #2580FC;
              i {
                color: #999999;
              }
              .active {
                color: #2580FC;
              }
            }
            &:first-child {
              padding-right: 10px;
              padding-left: 0;
              >div {
                float: right;
                span {
                  display: inline-block;
                  vertical-align: middle;
                  i {
                    display: block;
                    font-size: 10px;
                  }
                }
              }
            }
          }
        }
        .vl_jfo_event {
          height: calc(100% - 50px);
          min-height: 693px;
          .vl_jfo_event_box {
            width: 100%;
            height: auto;
            .vl_jfo_box_item {
              float: left;
              cursor: pointer;
              width: 387px;
              height: 203px;
              padding: 20px;
              margin-right: 20px;
              margin-bottom: 20px;
              background: rgba(255, 255, 255, 1);
              box-shadow: 0px 5px 16px 0px rgba(169, 169, 169, 0.2);
              .vl_jfo_i_left {
                float: left;
                width: 163px;
                height: 163px;
                >img {
                  width: 100%;
                  height: 100%;
                }
              }
              .vl_jfo_i_right {
                width: calc(100% - 163px);
                height: 100%;
                margin-left: 163px;
                padding-left: 10px;
                >p {
                  color: #999999;
                  margin-bottom: 13px;
                }
                .vl_jfo_line {
                  position: relative;
                  max-width: 100%;
                  display: inline-block;
                  height: 28px;
                  line-height: 28px;
                  margin-bottom: 8px;
                  border: 1px solid #F2F2F2;
                  background: #FAFAFA;
                  color: #333333;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  border-radius:3px;
                  font-size: 12px;
                  overflow: hidden;
                  padding-right: 4px;
                  > i {
                    vertical-align: middle;
                  }
                  span {
                    padding: 0 4px;
                  }
                }
              }
            }
          }
        }
      }
    }
    .vl_jfo_sim {
      color: #0C70F8;
      font-weight: bold;
      font-size: 24px;
      margin-top: -4px;
      i {
        vertical-align: text-top;
        margin-right: 10px;
      }
      span {
        font-weight: normal;
      }
    }
    .vl_j_fullscreen {
      position: fixed;
      width: 100%!important;
      height: 100%!important;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: #000000;
      z-index: 9999;
      -webkit-transition: all .4s;
      -moz-transition: all .4s;
      -ms-transition: all .4s;
      -o-transition: all .4s;
      transition: all .4s;
      > video {
        width: 100%;
        height: 100%;
      }
      > .control_bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 48px;
        background: rgba(0, 0, 0, .65);
        > div {
          float: left;
          width: 50%;
          height: 100%;
          line-height: 48px;
          text-align: right;
          padding-right: 20px;
          color: #FFFFFF;
          &:first-child {
            text-align: left;
            padding-left: 20px;
          }
          > span {
            display: inline-block;
            height: 22px;
            margin-left: 10px;
            vertical-align: middle;
            cursor: pointer;
            a {
              font-size: 25px;
              text-decoration: none;
              color: #ffffff;
              vertical-align: top;
            }
          }
        }
      }
    }
    .vl_j_cutscreen {
      position: fixed;
      width: 90%!important;
      height: 90%!important;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: #FFFFFF;
      z-index: 9999;
      -webkit-transition: all .4s;
      -moz-transition: all .4s;
      -ms-transition: all .4s;
      -o-transition: all .4s;
      transition: all .4s;
      padding: 20px;
      margin: auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .close_btn {
      position: absolute;
      top: 30px;
      right: 30px;
      font-size: .3rem;
      cursor: pointer;
      &:hover {
        color: #409EFF;
      }
    }
    .vl_jtc_mk {
      width: 2.18rem;
      height: 1.22rem;
      position: relative;
      > video {
        width: 100%;
        height: 100%;
      }
      > p {
        position: absolute;
        color: #FFFFFF;
        bottom: .08rem;
        font-size: .12rem;
        padding-left: .06rem;
      }
    }
    .vl_jtc_mk_check {
      > input {
        position: absolute;
        top: .08rem;
        right: .08rem;
        &:after {
          position: absolute;
          width: 14px;
          height: 14px;
          top: 0;
          content: '';
          background-color: #FFFFFF;
          color: #fff;
          display: block;
          border: 1px solid #409EFF;
          line-height: 11px;
          text-align: center;
          border-radius: 3px;
        }
      }
      > input:checked {
        &:after {
          background-color: #409EFF;
          content: '✓';
          font-size: 10px;
        }
      }
    }
    .history-pic-dialog {
      .el-dialog {
        max-width: 12.6rem;
        width: 100%!important;
      }
      .el-dialog__title {
        font-size: .16rem;
        color: #333333;
      }
      .el-dialog__body {
        padding: 0 .76rem .3rem;
      }
      .his-pic-box {
        width: 100%;
        height: 4.6rem!important;
        .his-pic-item {
          float: left;
          width: 1.38rem;
          height: 1.38rem;
          border: .02rem solid #FFFFFF;
          margin-right: .2rem;
          margin-bottom: .2rem;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .active {
          border-color: #0C70F8;
        }
      }
      .el-dialog__footer {
        button {
          width: 1.4rem!important;
          height: .4rem;
          line-height: .4rem;
          padding: 0;
        }
      }
    }
    .struc_detail_dialog_ytsr {
      .el-dialog {
        max-width: 13.06rem;
        width: 100%!important;
        /* 祖先元素设置了transform属性则会导致固定定位属性position: fixed失效。 */
        transform: none !important;
        top: calc(100% - 8.8rem);
        left: calc((100% - 13.06rem)/2);
      }
      .el-dialog__header {
        display: none;
      }
      .struc_tab {
        height: 1.16rem;
        padding: .3rem 0;
        position: relative;
        color: #333333;
        span {
          display: inline-block;
          margin-right: .55rem;
          padding-bottom: .1rem;
          cursor: pointer;
        }
        .active {
          color: #0C70F8;
          border-bottom: 2px solid #0C70F8;
        }
        i {
          display: block;
          position: absolute;
          top: .3rem;
          right: 0px;
          cursor: pointer;
        }
      }
      .struc_main {
        width: 11.46rem;
        height: 4.4rem;
        margin: 0 auto;
        border-bottom: 1px solid #F2F2F2;
        .struc_c_detail {
          width:  100%;
          height: 3.6rem;
          >div {
            float: left;
          }
          .struc_c_d_img {
            width: 3.6rem;
            height: 3.6rem;
            background: #EAEAEA;
            position: relative;
            img {
              width: 100%;
              height: auto;
              max-height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
            }
            i {
              display: block;
              position: absolute;
              bottom: .1rem;
              right: .1rem;
              line-height: .26rem;
              height: .26rem;
              background: #0C70F8;
              border-radius: .13rem;
              font-style: normal;
              color: #ffffff;
              font-size: 12px;
              padding: 0 .1rem;
              cursor: pointer;
            }
            &:before {
              display: block;
              content: '';
              position: absolute;
              top: -.5rem;
              left: -.5rem;
              transform: rotate(-45deg);
              border: .5rem solid #50CC62;
              border-color: transparent transparent #50CC62;
              z-index: 9;
            }
            span {
              display: block;
              position: absolute;
              top: .1rem;
              left: .1rem;
              width: .6rem;
              height: .6rem;
              text-align: center;
              color: #FFFFFF;
              font-size: .12rem;
              -webkit-transform: rotate(-45deg);
              -moz-transform: rotate(-45deg);
              -ms-transform: rotate(-45deg);
              -o-transform: rotate(-45deg);
              transform: rotate(-45deg);
              z-index: 99;
            }
          }
          .struc_c_d_qj {
            margin-right: .3rem;
            &:before {
              border: .5rem solid #0c70f8;
              border-color: transparent transparent #0C70F8;
            }
          }
          .struc_c_d_box {
            width: calc(100% - 3.9rem);
            box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
            border-radius:1px;
            position: relative;
            overflow: hidden;
            >div {
              float: left;
            }
            .struc_c_d_info {
              width: calc(100% - 3.6rem);
              padding-left: .24rem;
              color: #333333;
              h2 {
                font-weight: bold;
                line-height: .74rem;
                padding-right: 1rem;
                .vl_jfo_sim {
                  color: #0C70F8;
                  font-weight: bold;
                  font-size: .24rem;
                  float: right;
                  i {
                    vertical-align: text-bottom;
                    margin-right: .1rem;
                  }
                  span {
                    font-weight: normal;
                  }
                }
              }
              .struc_cdi_line {
                >span {
                  /*position: relative;*/
                  max-width: 100%;
                  display: inline-block;
                  height: .3rem;
                  line-height: .3rem;
                  margin-bottom: .08rem;
                  border: 1px solid #F2F2F2;
                  background: #FAFAFA;
                  color: #333333;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  border-radius:3px;
                  font-size: 12px;
                  overflow: hidden;
                  padding: 0 .1rem;
                  margin-right: .08rem;
                  > i {
                    vertical-align: middle;
                    margin-left: .1rem;
                  }
                  font {
                    color: #999999;
                    margin-left: 20px;
                  }
                }
                p {
                  color: #999999;
                }
              }
            }
            &:before {
              display: block;
              content: '';
              position: absolute;
              top: -.7rem;
              right: -.7rem;
              transform: rotate(-46deg);
              border: .7rem solid #0c70f8;
              border-color: transparent transparent transparent #0C70F8;
            }
            &:after {
              display: block;
              content: '';
              position: absolute;
              top: -.4rem;
              right: -.4rem;
              transform: rotate(-45deg);
              border: .4rem solid #FFFFFF;
              border-color: transparent transparent transparent #FFFFFF;
            }
            >span {
              display: block;
              position: absolute;
              top: .19rem;
              right: .19rem;
              width: 1rem;
              height: 1rem;
              text-align: center;
              color: #FFFFFF;
              font-size: .12rem;
              -webkit-transform: rotate(45deg);
              -moz-transform: rotate(45deg);
              -ms-transform: rotate(45deg);
              -o-transform: rotate(45deg);
              transform: rotate(45deg);
              z-index: 99;
            }
          }
        }
        .struc_c_address {
          height: 100%;
          #capMap {
            width:  100%;
            height: 100%;
          }
        }
        .struc_c_video {
          .struc_c_d_box {
            background: #E9E7E8;
            height: 100%;
            text-align: center;
            &:hover {
              .play_btn {
                display: block!important;
              }
            }
            .play_btn {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
              background: rgba(0, 0, 0, .4);
              width: 1rem;
              height: 1rem;
              text-align: center;
              line-height: 1rem;
              -webkit-border-radius: 50%;
              -moz-border-radius: 50%;
              border-radius: 50%;
              cursor: pointer;
              i {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                height: 22px!important;
              }
            }
            >video {
              width: auto;
              height: 100%;
            }
            &:after {
              content: none!important;
            }
            &:before {
              content: none!important;
            }
            -webkit-box-shadow: 0 0 0!important;
            -moz-box-shadow: 0 0 0!important;
            box-shadow: 0 0 0!important;
          }
          .download_btn {
            text-align: center;
            width: 1.1rem;
            height: .4rem;
            float: right!important;
            margin-top: .2rem;
            background: rgba(246,248,249,1);
            border: 1px solid rgba(211,211,211,1);
            border-radius: 4px;
            line-height: .4rem;
            cursor: pointer;
            color: #666666;
            position: relative;
            &:hover {
              color: #FFFFFF;
              background: #0C70F8;
              border-color: #0C70F8;
            }
            a {
              display: block;
              position: absolute;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .struc-list {
        width: 12.46rem;
        margin: 0 auto;
        padding: .44rem 0 .34rem 0;
        .swiper-container {
          padding: .02rem .5rem;
          &:before {
            display: block;
            content: '';
            width: .5rem;
            height: 110%;
            background: #FFFFFF;
            position: absolute;
            left: 0;
            z-index: 9;
            border: 1px solid #FFFFFF;
          }
          &:after {
            display: block;
            content: '';
            width: .5rem;
            height: 110%;
            background: #FFFFFF;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 9;
            border: 1px solid #FFFFFF;
          }
          .swiper-button-next {
            right:  0;
          }
          .swiper-button-prev {
            left: 0;
          }
          .swiper-slide {
            .swiper_img_item {
              cursor: pointer;
              border: 1px solid #FFFFFF;
              padding: 2px;
              img {
                width: 100%;
                height: 100%;
              }
              .vl_jfo_sim {
                font-size: .14rem;
                height: .3rem;
                margin-top: 0;
                /*display: inline-block;*/
                white-space: nowrap;
                text-align: center;
                color: #999999;
                i {
                  margin-right: 0;
                }
              }
            }
            .active {
              border-color: #0C70F8;
              box-shadow: inset 0px 3px 3px #c8c8c8;
              .vl_jfo_sim {
                color: #0C70F8;
              }
            }
          }
        }
      }
    }
  }
  .per_semblance {
    position: relative;
    >span {
      position: absolute;
      left: 20px;
      display: block;
      height: 40px;
      line-height: 40px;
      z-index: 9;
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
      width: 148px;
      input{
        text-indent: 60px;
      }
    }
  }
</style>