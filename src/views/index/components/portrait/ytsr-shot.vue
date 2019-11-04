<template>
  <div class="vl_judge_tc_ytsr_shot">
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
                    :key="item.id"
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
                    @change="chooseStartTime"
                    :picker-options="pickerOptions"
                    value-format="timestamp"
                    placeholder="选择日期时间">
            </el-date-picker>
            <el-date-picker
                    style="width: 100%;"
                    class="vl_date vl_date_end"
                    v-model="searchData.endTime"
                    @change="chooseEndTime"
                    :picker-options="pickerOptions"
                    :time-arrow-control="true"
                    value-format="timestamp"
                    type="datetime"
                    placeholder="选择日期时间">
            </el-date-picker>
          </div>
          <div class="ytsr_dtxz_rst">
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
            <el-button type="primary" :loading="searching" @click="tcDiscuss()">确定</el-button>
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
          <span>抓拍时间：</span>
          <span>
          <p>{{taskDetail.startTime}}</p>
          <p>{{taskDetail.endTime}}</p>
        </span>
        </div>
        <div class="vl_ytsr_left_line">
          <span>抓拍设备：</span>
          <span>
           <p v-for="item in taskDetail.deviceNames" :key="item.id">{{item}}</p>
        </span>
        </div>
        <div class="update_task">
          <el-button type="primary" @click="showNewTask = true;">修改任务</el-button>
        </div>
      </template>
    </div>
    <div class="vl_s_right">
      <div class="vl_jig_right">
        <template v-if="strucInfoList && strucInfoList.length > 0">
          <div class="vl_jig_right_title">
            <div class="vl_jr_t_item">
              <span><span style="color: #333333">检索结果 </span> ({{strucInfoList.length}})</span>
              <div :class="{'active-item': stucOrder < 3}" @click="timeOrderS">时间排序 <span><i :class="{'active': stucOrder === 2}" class="el-icon-caret-top"></i><i :class="{'active': stucOrder === 1}" class="el-icon-caret-bottom"></i></span></div>
            </div>
            <div class="vl_jr_t_item">
              <div :class="{'active-item': stucOrder === 3}" @click="stucOrder = 3">监控排序</div>
              <div :class="{'active-item': stucOrder === 4}" @click="stucOrder = 4" style="margin-left: .1rem;">相似度排序</div>
            </div>
          </div>
          <div class="vl_jfo_event">
            <vue-scroll>
              <div class="vl_jfo_event_box clearfix">
                <div class="vl_jfo_box_item" v-for="(item, index) in curStrucInfoList" :key="item.id" @click="showStrucInfo(item, index)">
                  <div class="vl_jfo_i_left"><img :src="item.subStoragePath" alt=""></div>
                  <div class="vl_jfo_i_right">
                    <p>检索资料</p>
                    <div class="vl_jfo_line"><span>{{item.shotTime}}</span></div>
                    <br>
                    <div class="vl_jfo_line"><span>{{item.deviceName}}</span></div>
                    <div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_03"></i>{{(item.semblance*1).toFixed(2)}}<span style="font-size: 12px;">%</span></div>
                  </div>
                </div>
              </div>
            </vue-scroll>
            <el-pagination
              class="cum_pagination cum_pagination_shot"
              @current-change="handleCurrentChange1"
              :current-page.sync="pagination1.pageNum"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="pagination1.pageSize"
              layout="total, prev, pager, next, jumper"
              :total="pagination1.total"
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
      class="struc_detail_dialog_ytsr_shot"
      :close-on-click-modal="false"
      top="4vh"
      :show-close="false">
      <div class="struc_tab">
        <span :class="{'active': strucCurTab === 1}" @click="strucCurTab = 1">检索详情</span>
        <span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>
        <span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>
        <i class="el-icon-close" @click="strucDetailDialog = false"></i>
      </div>
      <div class="struc_main">
        <ul v-show="strucCurTab === 1">
          <!-- <li><span>抓拍设备：{{sturcDetail.deviceName}}</span></li> -->
          <li><span style="line-height: 0.24rem;">抓拍地址：{{sturcDetail.address}}</span></li>
          <li style="color: #999;line-height: 0.24rem;">{{sturcDetail.shotTime}}</li>
        </ul>
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.PersonStoragePath" alt="">
            <span>上传图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img">
              <img class="bigImg" :src="showShotImg ? sturcDetail.subStoragePath : sturcDetail.storagePath" alt="">
              <i @click="showShotImg = !showShotImg">{{showShotImg ? '切换全景图' : '切换抓拍图'}}</i>
              <span>{{showShotImg ? '抓拍图' : '全景图'}}</span>
            </div>
            <div class="struc_c_d_info">
              <h2>分析结果<div class="vl_jfo_sim" ><span>相似度 </span>{{sturcDetail.semblance ? (sturcDetail.semblance*1).toFixed(2) : '0.00'}}<span style="font-size: 12px;">%</span></div></h2>
              <div class="struc_cd_info_main">
                <vue-scroll>
                  <ul>
                    <li><span>性别</span><span>{{sturcDetail.gender ? sturcDetail.gender : '未识别'}}</span></li>
                    <li><span>年龄段</span><span>{{sturcDetail.age ? sturcDetail.age : '未识别'}}</span></li>
                    <li><span>发型</span><span>{{sturcDetail.hairStyleDesc ? sturcDetail.hairStyleDesc : '未识别'}}</span></li>
                    <li><span>戴眼镜</span><span>{{sturcDetail.glasses ? sturcDetail.glasses : '未识别'}}</span></li>
                    <li><span>戴帽子</span><span>{{sturcDetail.hat ? sturcDetail.hat : '未识别'}}</span></li>
                    <li><span>戴口罩</span><span>{{sturcDetail.mask ? sturcDetail.mask : '未识别'}}</span></li>
                    <li><span>抱小孩</span><span>{{sturcDetail.baby ? sturcDetail.baby : '未识别'}}</span></li>
                    <li><span>拎东西</span><span>{{sturcDetail.bag ? sturcDetail.bag : '未识别'}}</span></li>
                    <li><span>上身款式</span><span>{{sturcDetail.coatLengthDesc ? sturcDetail.coatLengthDesc : '未识别'}}</span></li>
                    <li><span>上身颜色</span><span>{{sturcDetail.coatColorDesc ? sturcDetail.coatColorDesc : '未识别'}}</span></li>
                    <li><span>下身款式</span><span>{{sturcDetail.trousersLenDesc ? sturcDetail.trousersLenDesc : '未识别'}}</span></li>
                    <li><span>下身颜色</span><span>{{sturcDetail.trousersColorDesc ? sturcDetail.trousersColorDesc : '未识别'}}</span></li>
                  </ul>
                </vue-scroll>
              </div>
            </div>
          </div>
          <!--跳转按钮-->
          <div class="struc_t_btn">
            <a @click="gotoControl(sturcDetail.subStoragePath)">新建布控</a>
            <a @click="gotoLjd(sturcDetail.subStoragePath)">落脚点分析</a>
            <a @click="gotoGjfx(sturcDetail.subStoragePath)">轨迹分析</a>
            <!--<a @click="gotoIden(sturcDetail.subStoragePath)">身份确认</a>-->
          </div>
        </div>
        <div v-show="strucCurTab === 2" class="struc_c_address"></div>
        <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
          <div class="struc_c_d_qj struc_c_d_img">
            <img class="bigImg" :src="sturcDetail.subStoragePath" alt="">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box" style="float: left;" v-if="playerData">
            <div is="flvplayer" :oData="playerData"
                 :oConfig="{fit: false, sign: false, pause: true, close: false, tape: false, download: false}">
            </div>
          </div>
          <div class="struc_c_d_box struc_vid_empty" style="float: left;" v-else>
            <div class="struc_vid_empty_c com_trans50_lt">
              <div></div>
              <p>暂无视频</p>
            </div>
          </div>
          <p class="download_tips" v-show="sturcDetail.videoPath">下载提示：右键点击视频选择“另存视频为”即可下载视频。</p>
        </div>
      </div>
      <div class="struc-list">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in curStrucInfoList" :key="item.id">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
              <img style="height: .88rem;width: 50%;padding-right: .02rem;" :src="item.PersonStoragePath" alt="">
              <img style="height: .88rem;width: 50%;padding-left: .02rem;" :src="item.subStoragePath" alt="">
              <div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_05" :class="{'vl_icon_retrieval_06':  index === curImgIndex}"></i>{{item.semblance ? (item.semblance*1).toFixed(2) : '0.00'}}<span style="font-size: 12px;">%</span></div>
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
    </el-dialog>
    <div id="capMap"></div>
    <!-- D设备 B卡口  这里是设备和卡口 -->
    <div
            is="mapSelector"
            :open="openMap"
            :clear="msClear"
            :activeDeviceList="activeDBList"
            :showTypes="'DB'"
            @mapSelectorEmit="mapSelectorEmit">
    </div>
  </div>
</template>
<script>
  import mapSelector from '@/components/common/mapSelector.vue';
  import vlUpload from '@/components/common/upload.vue';
  import vlBreadcrumb from '@/components/common/breadcrumb.vue';
  import flvplayer from '@/components/common/flvplayer.vue';
  import { formatDate } from "@/utils/util.js";
  import { mapXupuxian } from "@/config/config.js";
  import noResult from '@/components/common/noResult.vue';
  import { getPeopleTaskDetail } from '@/views/index/api/api.analysis.js';
  import { PortraitPostByphotoRealtime, PortraitPostByphotoTask} from '@/views/index/api/api.portrait.js';
  import {getGroups} from '../../api/api.judge.js';
  let AMap = window.AMap;
  export default {
    components: {vlBreadcrumb, noResult, flvplayer, vlUpload, mapSelector},
    data() {
      return {
        // 修改任务相关
        activeDBList: [],
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
        radio: "2",
        dSum: 0, // 设备总数
        selectCameraArr: [],
        selectBayonetArr: [],
        showNewTask: false, // 展示修改任务
        searching: false,
        openMap: false,
        msClear: {},
        pickerOptions: {
          disabledDate (time) {
            return time > new Date();
          }
        },

        pagination1: { total: 0, pageSize: 12, pageNum: 1 },// 假分页
        showShotImg: true, // true展示抓拍，false,展示全景
        playerData: null,
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
        mapData: [],
        amap: null, // 地图实例
        markerPoint: null, // 地图点集合
        InfoWindow: null,
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
      // 弹窗地图
      let supMap = new AMap.Map('capMap', {
        center: mapXupuxian.center,
        zoom: 16
      });
      supMap.setMapStyle('amap://styles/whitesmoke');
      this.map = supMap;
      if (this.$route.query.uid) {
        this.getDetail();
      } else {
        this.getTheList();
      }

      // 获取人员组，跟车辆组列表， 修改任务相关
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
        return this.strucInfoList.slice((this.pagination1.pageNum - 1) * this.pagination1.pageSize,  (this.pagination1.pageNum) * this.pagination1.pageSize)
      }
    },
    methods: {
      // 修改任务相关
      resetSearch () {
        this.taskName = '';
        this.searchData.minSemblance = 85;
        this.imgList = '';
        this.radio = '1';
        this.searchData.portraitGroupId= [];
        this.msClear = {};
        this.uploadClear = {};
        this.setDTime();
        this.showNewTask = false;
      },
      tcDiscuss () {
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
        if (this.radio === '1') {
          params['portraitGroupId'] = this.searchData.portraitGroupId.join(',');
          let pNameList = []
          this.searchData.portraitGroupId.forEach(x => {
            pNameList.push(this.portraitGroupList.find(y => y.uid === x).groupName)
          })
          params['portraitGroupName'] = pNameList;
        } else {
          let dNameList = [];
          let dList = this.selectCameraArr.map(res =>  res.deviceName);
          let bList = this.selectBayonetArr.map(res => res.bayonetName);
          dNameList = dList.concat(bList);
          if (dNameList.length > 3) {
            params['deviceNames'] = dNameList.splice(0, 2);
            params['deviceNames'].push('等' + dNameList.length + '个设备');
            params['deviceNames'] =  params['deviceNames'].join(',')
          } else if (dNameList.length === 0) {
            params['deviceNames'] = this.taskDetail.deviceNames.join(',');
          } else {
            params['deviceNames'] = dNameList.join(',')
          }
          if (this.selectCameraArr.length || this.selectBayonetArr.length) {
            params['deviceIds'] = this.selectCameraArr.map(res => res.uid).join(',');
            params['bayonetIds'] = this.selectBayonetArr.map(res => res.uid).join(',');
          } else {
            params['deviceIds'] = this.taskDetail.deviceIds;
          }
          params['startTime'] = formatDate(this.searchData.startTime, 'yyyy-MM-dd HH:mm:ss');
          params['endTime'] = formatDate(this.searchData.endTime, 'yyyy-MM-dd HH:mm:ss');
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
      chooseEndTime (e) {
        if (e < this.searchData.startTime) {
          this.$message.info('结束时间必须大于开始时间才会有结果')
        }
      },
      chooseStartTime (e) {
        if (e > this.searchData.endTime) {
          this.$message.info('结束时间必须大于开始时间才会有结果')
        }
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
        this.openMap = {};
      },



      handleCurrentChange1 (e) {
        this.pagination1.pageNum = e;

      },
      gotoControl (url) {
        this.$router.push({ name: 'control_create', query: {modelName: "人员追踪", imgurl: url} })
      },
      gotoLjd (url) {
        this.$router.push({ name: 'portrait_ljd', query: {imgurl: url} })
      },
      gotoGjfx (url) {
        this.$router.push({ name: 'portrait_gjfx', query: {imgurl: url} })
      },
      gotoIden (url) {
        this.$router.push({ name: 'portrait_ljd', query: {imgurl: url} })
      },
      // 设置视频数据
      setPlayerData () {
        if (this.sturcDetail.videoPath) {
          this.playerData = {
            type: 3,
            title: this.sturcDetail.deviceName,
            video: {
              uid: new Date().getTime() + '',
              downUrl: this.sturcDetail.videoPath
            }
          }
        } else {
          this.playerData = null;
        }
      },
      timeOrderS () {
        if (this.stucOrder > 2) {
          this.stucOrder = 2;
        } else {
          this.stucOrder === 1 ? this.stucOrder = 2 : this.stucOrder = 1;
        }
      },
      // 获取实时
      getTheList () {
        PortraitPostByphotoRealtime(this.$route.query)
            .then(sRes => {
              if (sRes && sRes.data) {
                this.$set(sRes.data, 'taskResult', JSON.parse(sRes.data.taskResult));
                this.$set(sRes.data, 'taskWebParam', JSON.parse(sRes.data.taskWebParam));
                sRes.data.taskWebParam.deviceNames = sRes.data.taskWebParam.deviceNames.split(',')
                this.strucInfoList = sRes.data.taskResult ? sRes.data.taskResult : [];
                this.pagination1.total = this.strucInfoList.length;
                this.changeOrder();
                this.taskDetail = sRes.data.taskWebParam;
                console.log(sRes.data)
              } else {
                this.strucInfoList = [];
              }
            })
      },
      // 获取离线任务详情
      getDetail () {
        const id = this.$route.query.uid
        if (id) {
          getPeopleTaskDetail(id)
              .then(res => {
                if (res && res.data) {
                  this.$set(res.data, 'taskResult', JSON.parse(res.data.taskResult));
                  this.$set(res.data, 'taskWebParam', JSON.parse(res.data.taskWebParam));
                  res.data.taskWebParam.deviceNames = res.data.taskWebParam.deviceNames.split(',')
                  this.strucInfoList = res.data.taskResult ? res.data.taskResult : [];
                  this.pagination1.total = this.strucInfoList.length;
                  this.changeOrder();
                  this.taskDetail = res.data.taskWebParam;
                  let {minSemblance, startTime, endTime, deviceIds} = res.data.taskWebParam;
                  this.searchData.minSemblance = minSemblance;
                  this.activeDBList = deviceIds.split(',');
                  this.searchData.startTime = new Date(startTime).getTime();
                  this.searchData.endTime = new Date(endTime).getTime();
                  this.dSum = this.activeDBList.length;
                  console.log(res.data)
                  this.imgData = {
                    cname: '带图' + Math.random(),
                    filePathName: '带图' + Math.random(),
                    path: this.taskDetail.uploadImgUrls
                  }
                } else {
                  this.strucInfoList = [];
                }
              })
        }
      },
      changeOrder () {
        console.log(this.stucOrder);
        switch (this.stucOrder) {
          case 1:
            this.strucInfoList.sort((a, b) => {
              return new Date(b.shotTime).getTime() - new Date(a.shotTime).getTime();
            })
            break;
          case 2:
            this.strucInfoList.sort((a, b) => {
              return new Date(a.shotTime).getTime() - new Date(b.shotTime).getTime();
            })
            break;
          case 3:
            this.strucInfoList.sort((a, b) => {
              return a.deviceName.localeCompare(b, 'zh');
            })
            break;
          case 4:
            this.strucInfoList.sort((a, b) => {
              return b.semblance - a.semblance;
            })
            break;
        }
      },
      showStrucInfo (data, index) {
        this.curImgIndex = index;
        this.strucDetailDialog = true;
        this.sturcDetail = data;
        this.strucCurTab = 1;
        this.drawPoint(data);
        this.setPlayerData();
      },
      drawPoint (data) {
        this.$nextTick(() => {
          $('.struc_c_address').append($('#capMap'))
        })
        if (this.supMarkerPoint) {
          this.map.remove(this.supMarkerPoint)
        }
        let _content = '<div class="vl_icon vl_icon_judge_02"></div>'
        this.supMarkerPoint = new AMap.Marker({ // 添加自定义点标记
          map: this.map,
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
          offset: new AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: _content
        });
        this.map.setZoomAndCenter(16, [data.shotPlaceLongitude, data.shotPlaceLatitude]); // 自适应点位置
        let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`
        new AMap.InfoWindow({
          map: this.map,
          isCustom: true,
          closeWhenClickMap: false,
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude],
          offset: new AMap.Pixel(0, -70),
          content: sConent
        })
      },
      imgListTap (data, index) {
        this.curImgIndex = index;
        this.sturcDetail = data;
        this.drawPoint(data);
        this.setPlayerData();
      }
    },
    watch: {
      stucOrder () {
        this.changeOrder();
      },
      radio () {
        this.searchData.portraitGroupId = [];
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
  .vl_judge_tc_ytsr_shot {
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
        display: flex;
        margin-left: 20px;
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
    .struc_detail_dialog_ytsr_shot {
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
        height: 5rem;
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
                position: relative;
                .vl_jfo_sim {
                  color: #ffffff;
                  font-weight: bold;
                  font-size: .24rem;
                  float: right;
                  height: .34rem;
                  line-height: .34rem;
                  background: #50CC62;
                  position: absolute;
                  right: 0;
                  top: .2rem;
                  padding: 0 .2rem;
                  text-align: center;
                  border-radius: .17rem 0 0 .17rem;
                  i {
                    vertical-align: text-bottom;
                    margin-right: .1rem;
                  }
                  span {
                    font-weight: normal;
                    font-size: 12px;
                  }
                }
              }
              .struc_cd_info_main {
                height: 2.75rem;
                ul {
                  overflow: hidden;
                  > li {
                    float: left;
                    width: 50%;
                    overflow: hidden;
                    margin-bottom: 15px;
                    display: flex;
                    > span {
                      line-height: 26px; height: 28px;
                      border: 1px solid #ddd;
                      border-radius: 4px;
                      float: left;
                      overflow: hidden;
                      font-size: 14px;
                      &:first-child {
                        width: 68px;
                        background-color: #FAFAFA;
                        text-align: center;
                        border: 1px solid #f2f2f2;
                        border-radius: 4px 0 0 4px;
                        color: #999;
                      }
                      &:last-child {
                        max-width: 94px;
                        border: 1px solid #f2f2f2;
                        border-left: 0;
                        background-color: #fff;
                        padding: 0 9px 0 9px;
                        border-radius: 0 4px 4px 0;
                        overflow: hidden; text-overflow: ellipsis; white-space: nowrap; word-break: break-all;
                      }
                    }
                  }
                }
              }
              /*.struc_cdi_line {*/
                /*flex: none;*/
                /*width: 50%;*/
                /*display: inline-block;*/
                /*p {*/
                  /*max-width: 100%;*/
                  /*overflow: hidden;*/
                  /*display: table;*/
                  /*min-height: 30px;*/
                  /*margin-bottom: 0.08rem;*/
                  /*padding-right: 10px;*/
                  /*margin-right: 0.08rem;*/
                  /*border: 1px solid #f2f2f2;*/
                  /*border-radius: 3px;*/
                  /*font-size: 12px;*/
                  /*> b {*/
                    /*width: 70px;*/
                    /*background: #fafafa;*/
                    /*color: #999;*/
                    /*font-weight: normal;*/
                    /*padding-right: 10px;*/
                    /*padding-left: 10px;*/
                    /*display: table-cell;*/
                    /*vertical-align: middle;*/
                    /*border-right: 1px solid #f2f2f2;*/
                  /*}*/
                  /*>span {*/
                    /*display: table-cell;*/
                    /*vertical-align: middle;*/
                    /*padding-left: 5px;*/
                  /*}*/
                /*}*/
              /*}*/
            }
            &:before {
              display: block;
              content: none!important;
              position: absolute;
              top: -.7rem;
              right: -.7rem;
              transform: rotate(-46deg);
              border: .7rem solid #0c70f8;
              border-color: transparent transparent transparent #0C70F8;
            }
            &:after {
              display: block;
              content: none!important;
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
          .struc_t_btn {
            margin-top: .2rem;
            float: right;
            a {
              display: inline-block;
              text-align: center;
              line-height: .38rem;
              border: solid 1px #eeeeee;
              border-radius: 4px;
              margin-top: 10px;
              padding: 0px .15rem;
              text-decoration: none;
              margin-left: 10px;
              background: #0c70f8;
              border: solid 1px #0c70f8;
              cursor: pointer;
              color: #ffffff;
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
          .download_tips {
            float: left;
            width: 100%;
            text-align: right;
            padding-right: 40px; padding-top: 10px;
          }
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