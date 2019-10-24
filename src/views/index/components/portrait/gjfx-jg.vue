<template>
  <div class="point">
    <div class="">
      <div is="vlBreadcrumb"
           :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
            {name: '轨迹分析', routerName: 'portrait_gjfx'},
            {name: '搜索结果'}]">
      </div>
    </div>

    <div class="vl_gjfx_jg_left">
      <template v-if="showNewTask">
        <div class="plane" style="padding-top: 20px;">
          <el-form
                  :model="ruleForm"
                  status-icon
                  ref="ruleForm"
                  label-width="0px"
                  class="demo-ruleForm"
          >
            <el-form-item class="" prop="data1">
              <el-date-picker
                      v-model="ruleForm.data1"
                      style="width: 100%;"
                      class="vl_date"
                      :picker-options="pickerOptions"
                      type="datetime"
                      time-arrow-control
                      placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                      style="width: 100%;"
                      class="vl_date vl_date_end"
                      v-model="ruleForm.data2"
                      :time-arrow-control="true"
                      :picker-options="pickerOptions"
                      @change="chooseEndTime"
                      type="datetime"
                      time-arrow-control
                      placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <div class="upload_warp">
                <div style="padding: 0px 15px; height: 210px;">
                  <div is="vlUpload" :clear="uploadClear" @uploadEmit="uploadEmit" :imgData="imgData"></div>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-button @click="resetForm('ruleForm')" class="full">取消</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button type="primary" :loading="searchLoading" @click="submitForm('ruleForm')" class="select_btn full">确定</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template v-else>
        <img :src="taskDetail.uploadImgUrls" alt="">
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
      <div class="insetLeft2 vl_icon vl_icon_vehicle_03" v-show="hideleft" @click="showResult"></div>
    </div>
    <div class="right" id="rightMap"></div>
    <div class="reselt" v-if="reselt && showLeft">
      <div class="plane insetPadding">
        <h3 class="title">分析结果<p>共经过{{totalAddressNum}}个地方，出现{{totalMapNum}}次</p></h3>
        <!--<div class="sup_title">-->
        <!--<div  @click="timeOrderS">时间排序 <span><i class="el-icon-caret-top" :class="{'active': !timeOrder}"></i><i :class="{'active': timeOrder}" class="el-icon-caret-bottom"></i></span></div>-->
        <!--<div>({{}}次)</div>-->
        <!--</div>-->
        <div class="plane_main_box"  @scroll="scrollIt">
          <!--<vue-scroll>-->
          <div class="plane_main">
            <!--可以展开列表-->
            <div class="infinite-list-wrapper" v-if="leftEvData.length" >
              <ul>
                <li class="p_main_list" :class="{'is_open': item.isOpen}" v-for="item in leftEvData" :key="item.id">
                  <div class="p_main_head" @click="item.isOpen = !item.isOpen"><i :class="{'el-icon-caret-right': !item.isOpen, 'el-icon-caret-bottom': item.isOpen}"></i>{{item.label}}({{item.times}}次)</div>
                  <div class="p_main_item" v-for="(sItem, sIndex) in item.list" :key="sItem.id" @click="showStrucInfo(sItem, evData.findIndex(function (u) {return u === sItem}))">
                    <div class="info">
                      <div class="info_left">
                        <img :src="sItem.subStoragePath" alt="">
                      </div>
                      <div class="info_right">
                        <p class="time"><i class="vl_icon vl_icon_retrieval_01"></i>{{sItem.shotTime.slice(-8)}}</p>
                        <div><i class="vl_icon vl_icon_retrieval_03"></i>{{sItem.semblance ? (sItem.semblance * 1).toFixed(2) : '0.00'}}%</div>
                      </div>
                    </div>
                    <div class="address"><i class="el-icon-location-outline"></i>{{sItem.bayonetAddress ? sItem.bayonetAddress : sItem.address}}</div>
                    <div class="del_icon el-icon-delete" @click.stop="updateLine(sItem, item.list, sIndex)"></div>
                  </div>
                </li>
              </ul>
              <p style="line-height: 40px;color: #0C70F8;text-align: center;" v-if="loading">加载中...</p>
              <p style="line-height: 40px;color: #999999;text-align: center;" v-if="noMore">没有更多了</p>
            </div>
            <p v-show="leftEvData.length === 0" style="line-height: 40px;color: #999999;text-align: center;">暂无数据</p>
          </div>
          <!--</vue-scroll>-->
        </div>
        <div class="insetLeft2 vl_icon vl_icon_vehicle_02" :class="{'vl_icon_vehicle_03': hideleft}" @click="hideResult"></div>
      </div>
    </div>
    <!--地图操作按钮-->
    <ul class="map_rrt_u2">
      <li @click="resetZoom"><i class="el-icon-aim"></i></li>
      <li @click="mapZoomSet(1)"><i class="el-icon-plus"></i></li>
      <li @click="mapZoomSet(-1)"><i class="el-icon-minus"></i></li>
    </ul>
    <el-dialog
            :visible.sync="strucDetailDialog"
            class="struc_detail_dialog_gjfx"
            :close-on-click-modal="false"
            top="4vh"
            :show-close="false">
      <div class="struc_tab">
        <span :class="{'active': strucCurTab === 1}" @click="strucCurTab = 1">抓拍详情</span>
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
            <img class="bigImg" :src="sturcDetail.subStoragePath" alt="">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img">
              <img class="bigImg" :src="sturcDetail.storagePath" alt="">
              <span>全景图</span>
            </div>
            <div class="struc_c_d_info">
              <h2>分析结果</h2>
              <div class="struc_cd_info_main">
                <vue-scroll>
                  <ul>
                    <li><span>性别</span><span>{{sturcDetail.sex ? sturcDetail.sex : '未识别'}}</span></li>
                    <li><span>年龄段</span><span>{{sturcDetail.age ? sturcDetail.age : '未识别'}}</span></li>
                    <li><span>发型</span><span>{{sturcDetail.hair ? sturcDetail.hair : '未识别'}}</span></li>
                    <li><span>戴眼镜</span><span>{{sturcDetail.glasses ? sturcDetail.glasses : '未识别'}}</span></li>
                    <li><span>戴帽子</span><span>{{sturcDetail.hat ? sturcDetail.hat : '未识别'}}</span></li>
                    <li><span>戴口罩</span><span>{{sturcDetail.mask ? sturcDetail.mask : '未识别'}}</span></li>
                    <li><span>抱小孩</span><span>{{sturcDetail.baby ? sturcDetail.baby : '未识别'}}</span></li>
                    <li><span>拎东西</span><span>{{sturcDetail.bag ? sturcDetail.bag : '未识别'}}</span></li>
                    <li><span>上身款式</span><span>{{sturcDetail.upperType ? sturcDetail.upperType : '未识别'}}</span></li>
                    <li><span>上身颜色</span><span>{{sturcDetail.upperColor ? sturcDetail.upperColor : '未识别'}}</span></li>
                    <li><span>下身款式</span><span>{{sturcDetail.bottomType ? sturcDetail.bottomType : '未识别'}}</span></li>
                    <li><span>下身颜色</span><span>{{sturcDetail.bottomColor ? sturcDetail.bottomColor : '未识别'}}</span></li>
                  </ul>
                </vue-scroll>
              </div>
            </div>
            <!--<span>抓拍信息</span>-->
          </div>
          <!--跳转按钮-->
          <div class="struc_t_btn">
            <a @click="gotoControl(sturcDetail.subStoragePath)">新建布控</a>
            <a @click="gotoLjd(sturcDetail.subStoragePath)">落脚点分析</a>
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
          <swiper-slide v-for="(item, index) in evData" :key="item.id">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
              <img style="width: 100%; height: .88rem;" :src="item.subStoragePath" alt="">
              <!--<div class="vl_jfo_sim" ><i class="vl_icon vl_icon_retrieval_05" :class="{'vl_icon_retrieval_06':  index === curImgIndex}"></i>{{item.semblance ? item.semblance : 92}}<span style="font-size: 12px;">%</span></div>-->
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
    </el-dialog>
    <div id="capMap"></div>
    <!--人工筛选-->
    <el-dialog
            title="人工筛选"
            :visible.sync="filterDialog"
            :close-on-click-modal="false"
            width="900px">
      <div style="height: 350px;">
        <div style="height: 96%">
          <vue-scroll>
            <div class="plane_main">
              <!--可以展开列表-->
              <div class="infinite-list-wrapper">
                <ul>
                  <li class="p_main_list" :class="{'is_open': item.isOpen}" v-for="item in curAllLeftEvData" :key="item.id">
                    <div class="p_main_head" @click="item.isOpen = !item.isOpen">
                      <i :class="{'el-icon-caret-right': !item.isOpen, 'el-icon-caret-bottom': item.isOpen}"></i>{{item.label}}({{item.times}}次)
                      <span class="del_icon el-icon-delete" @click.stop="delOneDay(item)"></span>
                    </div>
                    <div class="p_main_item p_main_dialog_item" v-for="(sItem, sIndex) in item.list" :key="sItem.id">
                      <div class="info">
                        <div class="info_left">
                          <img :src="sItem.subStoragePath" alt="">
                        </div>
                        <div class="info_right">
                          <p class="time"><i class="vl_icon vl_icon_retrieval_01"></i>{{sItem.shotTime.slice(-8)}}</p>
                          <div><i class="vl_icon vl_icon_retrieval_03"></i>{{sItem.semblance ? (sItem.semblance * 1).toFixed(2) : '0.00'}}%</div>
                        </div>
                      </div>
                      <div class="address"><i class="el-icon-location-outline"></i>{{sItem.bayonetAddress ? sItem.bayonetAddress : sItem.address}}</div>
                      <div class="del_icon el-icon-delete" @click.stop="delSitem(item, sItem, sIndex)"></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </vue-scroll>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="filterDialog = false">取 消</el-button>
        <el-button type="primary" @click="chooseOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import vlUpload from '@/components/common/upload.vue';
  import vlBreadcrumb from '@/components/common/breadcrumb.vue';
  import flvplayer from '@/components/common/flvplayer.vue';
  import { mapXupuxian,ajaxCtx } from "@/config/config.js";
  import { objDeepCopy, random14, formatDate, dateOrigin } from "@/utils/util.js";
  import { cityCode } from "@/utils/data.js";
  import {PortraitPostPersonTrace} from "@/views/index/api/api.portrait.js";
  import { MapGETmonitorList } from "@/views/index/api/api.map.js";
  import { getAllBayonetList } from "@/views/index/api/api.base.js";
  import { getPeopleTaskDetail } from '@/views/index/api/api.analysis.js';
  export default {
    components: {vlBreadcrumb, flvplayer, vlUpload},
    data() {
      return {
        showNewTask: false, // 展示修改任务


        taskDetail: {},
        imgData: null,
        uploadClear: {},
        playerData: null,
        filterDialog: false,
        showLeft: false,
        loading: false,
        count: 3,
        totalAddressNum: 0,
        totalMapNum: 4,
        searchLoading: false,
        curChooseNum: '已选择0个设备',
        uploadAcion: ajaxCtx.base + '/new',
        uploading: false,
        hover:null,
        input3: null,
        mouseTool: null,
        drawArea: null,
        swiperOption: {
          slidesPerView: 10,
          spaceBetween: 10,
          slidesPerGroup: 9,
          loop: false,
          slideToClickedSlide: true,
          loopFillGroupWithBlank: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        },
        dialogVisible: false,
        amap: null,
        map: null,
        pointData: {
          deviceList: [],
          bayonetList: []
        },
        reselt: false,
        hideleft: false,
        timeOrder: false,
        ruleForm: {
          data1: dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000)),
          data2: new Date(),
          input3: '',
          value1: null,
        },
        pricecode:cityCode,
        options: [],
        pickerOptions: {
          disabledDate (time) {
            return time > new Date();
          }
        },
        evData: [],
        leftEvData: [],
        allLeftEvData: [],
        marks: [[], []],
        markerLine: [], // 地图线集合
        markerPoint: [], // 地图点集合
        supMarkerPoint: null,
        curStrucList: [],
        strucCurTab: 1,
        curImgIndex: 0,
        sturcDetail: {},
        playing: false, // 视频播放是否
        strucDetailDialog: false,
        videoUrl: '' // 弹窗视频回放里的视频
      };
    },
    computed: {
      noMore () {
        return this.count >= this.totalMapNum;
      },
      // 过滤allLeftEvData里面list为空的数据，人工筛选的时候全部删除自动去除一列
      curAllLeftEvData () {
        return this.allLeftEvData.filter(x => x.list.length)
      }
    },
    mounted() {
      this.renderMap();
      if (this.$route.query.uid) {
        this.getDetail();
      }
    },
    methods: {
      // 获取离线任务详情
      getDetail () {
        const id = this.$route.query.uid
        if (id) {
          getPeopleTaskDetail(id)
              .then(res => {
                if (res) {
                  this.$set(res.data, 'taskResult', JSON.parse(res.data.taskResult));
                  this.$set(res.data, 'taskWebParam', JSON.parse(res.data.taskWebParam));
                  res.data.taskWebParam.deviceNames = res.data.taskWebParam.deviceNames ? res.data.taskWebParam.deviceNames.split(',') : '';
                  this.taskDetail = res.data.taskWebParam;
                  console.log(res.data)
                  this.imgData = {
                    cname: '带图' + Math.random(),
                    filePathName: '带图' + Math.random(),
                    path: this.taskDetail.uploadImgUrls
                  }
                  this.reselt = true;
                  this.evData = res.data.taskResult;
                  this.evData.forEach(x => {
                    if (x.bayonetName) {
                      x.DeviceID = x.bayonetName;
                    }
                  })
                  this.evData.sort(this.compare("shotTime", this.timeOrder ? false : true));
                  this.shotAddressAndTimes(this.evData)

                  //  重组数据，给左边列表使用
                  this.operData(true);
                  if (this.evData.length) {
                    this.filterDialog = true;
                  }
                }
              })
        }
      },

      uploadEmit (data) {
        console.log('uploadEmit data', data);
        if (data && data.path) {
          this.ruleForm.input3 = data.path;
        } else {
          this.ruleForm.input3 = '';
        }
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
      chooseEndTime (e) {
        if (e < this.ruleForm.data1) {
          this.$message.info('结束时间必须大于开始时间才会有结果')
        }
      },
      gotoControl (url) {
        this.$router.push({ name: 'control_create', query: {modelName: "人员追踪", imgurl: url} })
      },
      gotoLjd (url) {
        this.$router.push({ name: 'portrait_ljd', query: {imgurl: url} })
      },
      scrollIt (e) {
        if(e.srcElement.scrollTop + e.srcElement.offsetHeight > e.srcElement.scrollHeight - 10){
          if (!this.loading && !this.noMore) {
            this.loading = true;
            setTimeout(() => {
              this.count += 2;
              this.operData();
              this.loading = false;
            }, 2000)
          }
        }
      },
      setDTime () {
        this.ruleForm.data1 = dateOrigin(false, new Date(new Date().getTime() - 24 * 3600000));
        this.ruleForm.data2 = new Date();
      },
      hideResult() {
        this.reselt = false;
        this.hideleft = true;
      },
      showResult() {
        this.reselt = true;
        this.hideleft = false;
      },
      submitForm(v) {
        if(this.ruleForm && this.ruleForm.data1 && this.ruleForm.data2 && this.ruleForm.input3){
          let pg = {
          }
          pg['startTime'] = formatDate(this.ruleForm.data1);
          pg['endTime'] = formatDate(this.ruleForm.data2);
          pg['uploadImgUrls'] = this.ruleForm.input3;
          pg['taskId'] = this.$route.query.uid;
          pg['taskOperateType'] = 1;
          this.getVehicleShot(pg);
        }else{
          this.$message.info("请上传图片");
        }
      },
      resetForm(){
        this.setDTime();
        this.ruleForm.input3 = '';
        this.ruleForm.value1 = [];
        this.uploadClear = {};
        this.setDTime ();
        this.showNewTask = false;
      },
      renderMap() {
        let map = new window.AMap.Map("rightMap", {
          zoom: 10,
          center: mapXupuxian.center
        });
        map.setMapStyle("amap://styles/whitesmoke");
        this.amap = map;
        // 弹窗地图
        let supMap = new AMap.Map('capMap', {
          center: mapXupuxian.center,
          zoom: 16
        });
        supMap.setMapStyle('amap://styles/whitesmoke');
        this.map = supMap;
      },
      compare  (prop, bool) {
        return function (obj1, obj2) {
          var val1 = obj1[prop];
          var val2 = obj2[prop];
          if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
          }
          if (val1 < val2) {
            if (bool) {
              return -1;
            } else {
              return 1;
            }
          } else if (val1 > val2) {
            if (bool) {
              return 1;
            } else {
              return -1;
            }
          } else {
            return 0;
          }
        }
      },
      getVehicleShot(d) {
        this.searchLoading = true;
        PortraitPostPersonTrace(d).then(res => {
          this.searchLoading = false;
          this.$message.info("修改成功")
          this.$router.push({name: 'portrait_gjfx'})
        }).catch(() => {
          this.searchLoading = false;
        });
      },
      shotAddressAndTimes (data) {
        this.totalMapNum = data.length;
        // 计算经过多少个地方
        let dvIds = [];
        this.totalAddressNum = 0;
        data.forEach(x => {
          if(!dvIds.includes(x.DeviceID)) {
            this.totalAddressNum += 1;
            dvIds.push(x.DeviceID);
          }
        })
      },
      operData (isAll) {
        this.leftEvData = [];
        this.allLeftEvData = [];
        let keyArr = [];
        this.evData.forEach((x, index) => {
          if (!isAll) {
            if (index <= this.count) {
              let key = x.shotTime.slice(0, 10);
              if (!keyArr.includes(key)) {
                keyArr.push(key);
                let obj = {label: key,isOpen: true};
                obj.list = [];
                obj.times = 1;
                obj.list.push(x);
                this.leftEvData.push(obj);
              } else {
                this.leftEvData.find(y => y.label === key).list.push(x);
                this.leftEvData.find(y => y.label === key).times += 1;
              }
            }
          } else {
            let key = x.shotTime.slice(0, 10);
            if (!keyArr.includes(key)) {
              keyArr.push(key);
              let obj = {label: key,isOpen: true};
              obj.list = [];
              obj.times = 1;
              obj.list.push(x);
              this.allLeftEvData.push(obj);
            } else {
              this.allLeftEvData.find(y => y.label === key).list.push(x);
              this.allLeftEvData.find(y => y.label === key).times += 1;
            }
          }
        })
      },
      delOneDay (item) {
        item.list.forEach((x, index) => {
          this.delSitem(item, x, index)
        })
      },
      delSitem (item, sItem, index) {
        item.list.splice(index, 1);
        item.times--;
        this.evData.splice(this.evData.findIndex(x => x === sItem), 1);
        this.shotAddressAndTimes(this.evData);
      },
      chooseOk () {
        this.showLeft = true;
        this.filterDialog = false;
        this.drawMapMarker(this.evData);
        this.operData();
      },
      //查询所有的设备
      objSetItem (list, obj) {
        list.map(z => {
          for (let key in obj) {
            z[key] = z[obj[key]] ? z[obj[key]] : obj[key]
          }
          // 都加上markSid , 方便处理移动端发起的通话
          if (!z['markSid']) {
            z['markSid'] = 'mapMark' + z['dataType'] + z['uid'];
          }
          return z;
        })
        return list;
      },
      //查询所有的卡口设备
      timeOrderS () {
        this.timeOrder = !this.timeOrder;
        this.getVehicleShot(this.storeParam)
      },
      // 地图标记
      mapHoverInfo (data) {
        let str = '<div class="vl_map_hover_main"><ul>';
        if (data.dataType === 0) {
          str += '<li><span>设备名称：</span><p>' + data.infoName + '</p></li>';
          str += '<li><span>设备地址：</span><p>' + data.address + '</p></li>';
          str += '</ul></div>'
        } else if (data.dataType === 1) {
          str += '<li><span>卡口名称：</span><p>' + data.infoName + '</p></li>';
          str += '<li><span>卡口编号：</span><p>' + data.bayonetNo + '</p></li>';
          str += '<li><span>地理位置：</span><p>' + data.bayonetAddress + '</p></li>';
//          str += '<li><span>设备数量：</span><p>' + data.devNum + '</p></li>';
          str += '</ul></div>'
        }
        return str;
      },
      drawMapMarker (oData) {
        let data = this.fitlerSXT(oData);
        let path = [];
        for (let  i = 0; i < data.length; i++) {
          let obj = data[i];
          if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
            let _time = '';
            _time = '<p class="vl_map_mark_time">';
            obj.shotTime.split(',').forEach(j => {
              _time += `<span>${j}</span>`
            })
            _time += '</p>';
            let sClass = 'vl_icon_map_mark0';
            if (obj.bayonetName) {
              sClass = 'vl_icon_map_mark1'
            }
            let _content = `<div class="vl_icon ` + sClass + `">` + _time + `</div>`
            let point = new AMap.Marker({ // 添加自定义点标记
              map: this.amap,
              position: [obj.shotPlaceLongitude, obj.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
              offset: new AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
              draggable: false, // 是否可拖动
              // 自定义点标记覆盖物内容
              content: _content
            });
            point.on('click', () => {
              let newObj = objDeepCopy(obj);
              newObj.shotTime = newObj.shotTime.split(',')[0];
              this.showStrucInfo(newObj, i)
            })
            this.markerPoint[i] = [point];
          }
        }
        this.amap.setFitView()
        this.drawLine(oData);
      }, // 覆盖物（窗体和checkbox
      fitlerSXT (oData) {
        let data = objDeepCopy(oData), _arr = [];
        data.forEach(x => {
          let _i = _arr.findIndex(y => y.DeviceID === x.DeviceID);
          if (_i === -1) {
            _arr.push(x)
          } else {
            _arr[_i]['shotTime'] += ',' + x.shotTime;
          }
        })
        return _arr;
      },
      drawLine (oData) {
        let path = [];
        oData.forEach(obj => {
          let _path = [obj.shotPlaceLongitude, obj.shotPlaceLatitude];
          if (obj.shotPlaceLongitude > 0 && obj.shotPlaceLatitude > 0) {
            path.push(_path);
          }
        })
        var polyline = new AMap.Polyline({
          path: path,
          showDir: true,
          strokeColor: '#61C772',
          strokeWeight: 6
        });
        this.markerLine.push(polyline);
        this.amap.add([polyline]);
      }, // 画线
      updateLine (obj, list, index) {
        this.amap.clearMap();
        let _i = this.evData.indexOf(obj);
        // list.splice(index, 1)
        this.evData.splice(_i, 1);
        this.shotAddressAndTimes(this.evData);
        this.operData();
        this.drawMapMarker(this.evData)
      }, // 更新画线
      showStrucInfo (data, index) {
        this.amap.setZoomAndCenter(16, [data.shotPlaceLongitude, data.shotPlaceLatitude])
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
        let sClass = 'vl_icon_map_hover_mark0';
        if (data.bayonetName) {
          sClass = 'vl_icon_map_hover_mark1'
        }
        let _content = '<div class="vl_icon ' + sClass + '"></div>'
        this.supMarkerPoint = new AMap.Marker({ // 添加自定义点标记
          map: this.map,
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
          offset: new AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: _content
        });
        this.map.setZoomAndCenter(16, [data.shotPlaceLongitude, data.shotPlaceLatitude]); // 自适应点位置
        let sConent = `<div class="cap_info_win"><p>设备名称：${data.bayonetName ? data.bayonetName : data.deviceName}</p><p>抓拍地址：${data.bayonetAddress ? data.bayonetAddress : data.address}</p></div>`
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
      },
      mapZoomSet (val) {
        if (this.amap) {
          this.amap.setZoom(this.amap.getZoom() + val);
        }
      },
      resetZoom () {
        if (this.amap) {
          this.amap.setZoomAndCenter(14, mapXupuxian.center);
        }
      },
    }
  };
</script>
<style lang="scss" scoped>
  .vl_gjfx_jg_left {
    position: absolute;
    left: 0;
    width: 272px;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    height: calc(100% - 56px);
    min-height: 788px;
    background: #ffffff;
    box-shadow: 2px 3px 10px 0px rgba(131, 131, 131, 0.28);
    animation: fadeInLeft .4s ease-out .3s both;
    z-index: 9;
    > img {
      width: 232px;
      height: 232px;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      margin-bottom: 30px;
    }
    .vl_ytsr_left_line {
      color: #555555;
      margin-bottom: 20px;
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
  .upload_warp {
    position: relative;
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
    &:hover {
      .del_icon {
        display: block;
      }
    }
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
  .point {
    width: 100%;
    height: 100%;
  }
  .breadcrumb_heaer {
    background: #ffffff;
    border-bottom: 1px solid #D3D3D3;
    padding: 19px 20px;
  }
  .full {
    width: 100%;
  }
  .insetPadding {
    padding: 10px;
    height: 100%;
  }
  .right.hide {
    width: calc(100% - 272px);
    height: calc(100% - 54px);
    float: right;
    min-height: 560px;
  }
  .right {
    width: calc(100% - 272px);
    height: calc(100% - 54px);
    float: right;
  }
  .reselt {
    width: 290px;
    height: calc(100% - 54px);
    background-color: #ffffff;
    position: absolute;
    left: 273px;
    z-index: 2;
    /*box-shadow: 4px 0px 10px 0px #838383;*/
    /*box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);*/
    animation: fadeInLeft 0.4s ease-out 0.3s both;
    .title {
      font-size: 16px;
      font-weight: bold;
      padding-top: 10px;
      padding-bottom: 19px;
      color: #333333;
      p {
        color: #999999;
        font-size: 12px;
        font-weight: normal;
        margin-left: 20px;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .sup_title {
      height: 40px;
      line-height: 40px;
      background: #F6F6F6;
      color: #333333;
      > div {
        display: inline-block;
        width: 50%;
        text-align: center;
        &:first-child {
          cursor: pointer;
          >span {
            display: inline-block;
            height: 25px;
            vertical-align: middle;
            i {
              display: block;
              height: 10px;
            }
            .active {
              color: #2580FC;
            }
          }
        }
      }
    }
  }
  .insetLeft {
    position: absolute;
    right: -28px;
    width: 25px;
    height: 178px;
    top: 50%;
    margin-top: -89px;
    display: inline-block;
    cursor: pointer;
  }
  .hide {
  }
  .insetLeft2 {
    position: absolute;
    right: -28px;
    width: 28px;
    height: 178px;
    top: 50%;
    margin-top: -89px;
    display: inline-block;
    cursor: pointer;
  }
  .select_btn {
    background-color: #0c70f8;
    color: #ffffff;
  }
  .plane_main_box {
    height: calc(100% - 44px);
    padding-top: 10px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .plane_main {
    min-height: 700px;
    .p_main_list {
      height: 40px;
      overflow: hidden;
      -webkit-transition: all .3s;
      -moz-transition: all .3s;
      -ms-transition: all .3s;
      -o-transition: all .3s;
      transition: all .3s;
      border: 1px solid #D3D3D3;
      margin-bottom: 10px;
      .p_main_head {
        height: 40px;
        line-height: 40px;
        background: #F6F6F6;
        cursor: pointer;
        text-indent: 6px;
        border-bottom: 1px solid #F2F2F2;
        i{
          color: #999999;
        }
        span {
          margin-left: 30px;
          font-size: 20px;
          color: #999999;
          vertical-align: middle;
          &:hover {
            color: #0C70F8;
          }
        }
      }
      .p_main_item {
        width: 100%;
        cursor: pointer;
        position: relative;
        &:hover{
          background: #E0F3FF;
          .del_icon{
            display: block;
          }
          .info {
            .info_right{
              .time {
                background: #E0F3FF;
              }
            }
          }
        }
        .info {
          width: 100%;
          padding: 10px;
          .info_left {
            display: inline-block;
            width: 100px;
            height: 100px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .info_right {
            display: inline-block;
            width: 130px;
            height: 46px;
            padding-left: 10px;
            float: right;
            >div {
              font-size: 24px;
              color: #0C70F8;
              font-weight: bold;
              margin-top: 10px;
              i {
                margin: 0 4px;
                vertical-align: text-bottom;
              }
            }
            .time {
              color: #333333;
              vertical-align: bottom;
              background: #FAFAFA;
              border: 1px solid #F2F2F2;
              height: 24px;
              line-height: 24px;
              i{
                color: #999999;
                vertical-align: middle;
                margin: 0 4px;
              }
            }
          }
        }
        .address {
          line-height: 39px;
          color: #666666;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          /*border-bottom: 1px solid #F2F2F2;*/
          padding: 0 30px 0 10px;
        }
        .del_icon {
          font-size: 20px;
          position: absolute;
          bottom: 10px;
          right: 4px;
          display: none;
          color: #999999;
          &:hover {
            color: #0C70F8;
          }
        }
      }
      .p_main_dialog_item {
        width: 33%;
        display: inline-block;
        border: 1px solid #D3D3D3;
        margin: 5px;
      }
    }
    .is_open {
      height: auto;
    }
    .th-center-pagination {
      text-align: center;
    }
  }
  .mapbox {
    width: 100%;
    height: 500px;
    .shrink {
      background: #ffffff;
      padding: 1px;
      position: absolute;
      right: 20px;
      bottom: 90px;
      box-shadow: 3px 4px 5px -5px #666666;
      span {
        display: block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        font-size: 28px;
        font-weight: normal;
        cursor: pointer;
        &:first-child {
          border-bottom: solid 1px #dddddd;
        }
      }
      span:hover {
        color: #0c70f8;
      }
    }
    .select_btn {
      background-color: #0c70f8;
      color: #ffffff;
    }
  }
  .bottomBox{
    background: #ffffff;
    width: 100%;
    padding: 10px 10px;
    text-align: center;
  }
  .setPost {
    position: absolute;
    left: 20px;
    top: 20px;
    width: 300px;
    .drawBox {
      margin-top: 20px;
      background: #ffffff;
      padding: 10px;
      .items {
        padding-top: 20px;
        span {
          display: inline-block;
          width: 55px;
          height: 55px;
          text-align: center;
          line-height: 55px;
          border-right: solid 1px #eeeeee;
          cursor: pointer;
          &:last-child {
            border-right: none;
          }
        }
        .cut1 {
          background: url(../../../../assets/img/vehicle/cut1.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut1.hover {
          background: #f2f9ff url(../../../../assets/img/vehicle/cut1m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut2 {
          background: url(../../../../assets/img/vehicle/cut2.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut2.hover {
          background: #f2f9ff url(../../../../assets/img/vehicle/cut2m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut3 {
          background: url(../../../../assets/img/vehicle/cut3.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut4 {
          background: url(../../../../assets/img/vehicle/cut4.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut5 {
          background: url(../../../../assets/img/vehicle/cut5.png) center
          no-repeat;
          background-size: 80% 80%;
        }
        .cut3.hover {
          background: #f2f9ff url(../../../../assets/img/vehicle/cut3m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut4.hover {
          background: #f2f9ff url(../../../../assets/img/vehicle/cut4m.png) center
          no-repeat;
          background-size: 100% 100%;
        }
        .cut5.hover {
          background: #f2f9ff url(../../../../assets/img/vehicle/cut5m.png) center
          no-repeat;
          background-size: 80% 80%;
        }
      }
    }
  }
</style>
<style lang="scss">
  #rightMap {
    .vl_icon {
      width: 47px;
      position: relative;
      > .vl_map_mark_time {
        position: absolute; top: 10px; left: 98%;
        width: 130px;
        word-break:keep-all;
        font-size: 12px; color: #fff;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 2px;
        padding: 2px 5px;
        span{
          display: block;
        }
      }
    }
  }
  .clgj_map_show_pic {
    .vl_jtc_mk { display: block !important; }
    &#rightMap {
      .vl_icon.vl_icon_sxt {
        > p {
          display: none;
        }
      }
    }
  }
  .demo-ruleForm {
    .quyu {
      .el-form-item__label {
        padding: 0;
        white-space: nowrap;
      }
      .el-radio__label {
        padding: 0;
      }
    }
  }
  .vl_jtc_upload_gjfx {
    text-align: center;
    .el-upload--picture-card {
      width: 100%;
      padding-top: 100%;
      position: relative;
      > i {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
      > img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        -webkit-border-radius: 6px;
        -moz-border-radius: 6px;
        border-radius: 6px;
      }
    }
    span {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin-top: 126px;
      color: #999;
    }
    &:hover {
      span {
        color: #FFFFFF;
      }
    }
  }
  .gjfx_upload {
    &:hover {
      .el-upload--picture-card {
        background: #0C70F8;
      }
    }
  }
  .data_range {
    .el-range__close-icon {
      display: none;
    }
  }
  .struc_detail_dialog_gjfx {
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
      color: #999999;
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
        position: relative;
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
            top: .1rem;
            right: .1rem;
            line-height: .26rem;
            height: .26rem;
            background: rgba(255, 255, 255, .8);
            border-radius: .13rem;
            font-style: normal;
            color: #0C70F8;
            font-size: 12px;
            padding: 0 .1rem;
          }
          &:before {
            display: block;
            content: '';
            position: absolute;
            top: -.5rem;
            left: -.5rem;
            transform: rotate(-45deg);
            border: .5rem solid #0C70F8;
            border-color: transparent transparent #0C70F8;
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
            border: .5rem solid #50CC62;
            border-color: transparent transparent #50CC62;
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
            content: none;
            position: absolute;
            top: -.7rem;
            right: -.7rem;
            transform: rotate(-46deg);
            border: .7rem solid #0c70f8;
            border-color: transparent transparent transparent #0C70F8;
          }
          &:after {
            display: block;
            content: none;
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
            background: rgba(246, 248, 249, 1);
            border: 1px solid rgba(211, 211, 211, 1);
            cursor: pointer;
          }
          a:hover {
            background: #0c70f8;
            border: solid 1px #0c70f8;
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
  .vl_jtc_mk {
    width: 218px;
    height: 122px;
    position: relative;
    display: none;
    > img {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    > p {
      width: 100%;
      position: absolute;
      color: #FFFFFF;
      bottom: 8px;
      font-size: 12px;
      padding: 0 6px;
      line-height: 20px;
      > i {
        height: 20px;
        float: right;
        vertical-align: middle;
      }
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
  .map_select {
    /deep/.el-dialog__body,.el-dialog__header {
      padding: 0px;
    }
    .el-dialog__headerbtn {
      z-index: 1;
    }
  }
</style>