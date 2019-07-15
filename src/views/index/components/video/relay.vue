<template>
  <div class="relay_main">
    <div class="vl_vid" v-show="pageType === 1">
      <div class="vid_show_menu" :class="{'vid_show_menu_active': showMenuActive}">
        <div class="show_menu_b">
          <div>
            <ul class="show_title show_title_2">
              <li class="show_title_li" :class="{'show_title_active': showConTitle === 1}" @click="showConTitle = 1">进行中</li>
              <li class="show_title_li" :class="{'show_title_active': showConTitle === 2}" @click="showConTitle = 2">已结束</li>
              <li class="show_title_line" :class="{'show_title_line2': showConTitle === 2}"></li>
            </ul>
            <div class="show_content" v-show="showConTitle === 1">
              <div class="show_search" style="z-index: 2;">
                <div class="show_search_ti">
                  <span>开始</span>
                  <el-date-picker
                    class="vl_vid_sdater"
                    style="width: 175px"
                    size="small"
                    v-model="startTime"
                    type="date"
                    time-arrow-control
                    :editable="false" :clearable="false"
                    :picker-options="startTimeOptions"
                    @change="startTimeChange"
                    placeholder="选择开始时间">
                  </el-date-picker>
                </div>
                <div class="show_search_ti">
                  <span>结束</span>
                  <el-date-picker
                    class="vl_vid_sdater"
                    style="width: 175px"
                    size="small"
                    v-model="endTime"
                    type="date"
                    time-arrow-control
                    :editable="false" :clearable="false"
                    :picker-options="endTimeOptions"
                    @change="endTimeChange"
                    placeholder="选择结束时间">
                  </el-date-picker>
                </div>
                <div style="margin-left: 8%; width: 84%;">
                  <el-select size="small" style="width: 100%;" v-model="targetType" placeholder="选择目标类型">
                    <el-option :label="'人员'" :value="'人员'"></el-option>
                    <el-option :label="'车辆'" :value="'车辆'"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="show_list" style="padding-top: 142px; position: relative;">
                <!-- 直播列表 -->
                <div class="relay_ul_list">
                  <ul>
                    <li>
                      <div v-if="!deviceIsPlaying({uid: 3}, 1)"
                        @dragstart="dragStart($event, {uid: 3}, 1)" @dragend="dragEnd"
                        draggable="true" style="cursor: move;">
                        <div class="relay_ul_lit">2018-11-25 09:12<span class="relay_ul_lit_t2">告警</span></div>
                        <div class="relay_ul_lim">
                          <ul>
                            <li>车牌号码</li>
                            <li>湘A234A1</li>
                          </ul>
                        </div>
                        <div class="relay_ul_lid com_ellipsis">备注只显示一行，为空时不显示...</div>
                      </div>
                      <div  class="relay_ul_list_active" draggable="false" v-else>
                        <div class="relay_ul_lit">2018-11-25 09:12<span class="relay_ul_lit_t1">播放中</span></div>
                        <div class="relay_ul_lim">
                          <ul>
                            <li>车牌号码</li>
                            <li>湘A234A1</li>
                          </ul>
                        </div>
                        <div class="relay_ul_lid com_ellipsis">备注只显示一行，为空时不显示...</div>
                      </div>
                    </li>
                    <li v-for="(item, index) in 10" :key="index">
                      <div>
                        <div class="relay_ul_lit">2018-11-25 09:12<span class="relay_ul_lit_t2">告警</span></div>
                        <div class="relay_ul_lii">
                          <img src="../../../../assets/img/666.jpg" alt="">
                        </div>
                        <div class="relay_ul_lid com_ellipsis">备注只显示一行，为空时不显示...</div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="relay_ul_btn">
                  <el-button @click="changePage(2)" size="small" type="primary" style="width:60%;">新建任务</el-button>
                </div>
              </div>
            </div>
            <div class="show_content" v-show="showConTitle === 2">
              <div class="show_search" style="z-index: 2;">
                <div class="show_search_ti">
                  <span>开始</span>
                  <el-date-picker
                    class="vl_vid_sdater"
                    style="width: 175px"
                    size="small"
                    v-model="startTime"
                    type="date"
                    time-arrow-control
                    :editable="false" :clearable="false"
                    :picker-options="startTimeOptions"
                    @change="startTimeChange"
                    placeholder="选择开始时间">
                  </el-date-picker>
                </div>
                <div class="show_search_ti">
                  <span>结束</span>
                  <el-date-picker
                    class="vl_vid_sdater"
                    style="width: 175px"
                    size="small"
                    v-model="endTime"
                    type="date"
                    time-arrow-control
                    :editable="false" :clearable="false"
                    :picker-options="endTimeOptions"
                    @change="endTimeChange"
                    placeholder="选择结束时间">
                  </el-date-picker>
                </div>
                <div style="margin-left: 8%; width: 84%;">
                  <el-select size="small" style="width: 100%;" v-model="targetType" placeholder="选择目标类型">
                    <el-option :label="'人员'" :value="'人员'"></el-option>
                    <el-option :label="'车辆'" :value="'车辆'"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="show_list" style="padding-top: 142px; position: relative;">
                <!-- 直播列表 -->
                <div class="relay_ul_list">
                  <ul>
                    <li>
                      <div>
                        <div class="relay_ul_lit">2018-11-25 09:12<span class="relay_ul_lit_t3">重启任务</span></div>
                        <div class="relay_ul_lim">
                          <ul>
                            <li>车牌号码</li>
                            <li>湘A234A1</li>
                          </ul>
                        </div>
                        <div class="relay_ul_lid com_ellipsis">备注只显示一行，为空时不显示...</div>
                      </div>
                    </li>
                    <li v-for="(item, index) in 10" :key="index">
                      <div>
                        <div class="relay_ul_lit">2018-11-25 09:12<span class="relay_ul_lit_t3">重启任务</span></div>
                        <div class="relay_ul_lii">
                          <img src="../../../../assets/img/666.jpg" alt="">
                        </div>
                        <div class="relay_ul_lid com_ellipsis">备注只显示一行，为空时不显示...</div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="relay_ul_btn">
                  <el-button size="small" type="primary" style="width:60%;" @click="changePage(2)">新建任务</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span @click="showMenuActive = !showMenuActive;" class="vl_icon vid_icon_ssz" :class="{'vid_icon_sss': showMenuActive}"></span>
      </div>
      <div class="vid_content" :class="{'vid_content2': showMenuActive}">
        <div class="vid_title">
          <ul class="vid_show_type">
            <li class="vl_icon vl_icon_061" :class="{'vl_icon_sed': showVideoTotal === 1}" @click="showVideoTotal = 1"></li>
            <li class="vl_icon vl_icon_062" :class="{'vl_icon_sed': showVideoTotal === 4}" @click="showVideoTotal = 4"></li>
            <li class="vl_icon vl_icon_063" :class="{'vl_icon_sed': showVideoTotal === 5}" @click="showVideoTotal = 5"></li>
          </ul>
        </div>
        <ul class="vid_show_list" :class="'vid_list_st' + showVideoTotal">
          <li v-for="(item, index) in videoList" :key="'video_list_' + index"
            @drop="dragDrop(item, index)" @dragover.prevent="dragOver">
            <div v-if="item && item.video">
              <div is="flvplayer" @playerClose="playerClose" :index="index" :oData="item" :signAble="true" :bResize="showMenuActive"></div>
            </div>
            <div class="vid_show_empty" v-else>
              <div is="videoEmpty" :btn="false" :btn2="false" :tipMsg="'拖拽任务至窗口查看接力视频'"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="vl_vid relay_task" v-show="pageType === 2">
      <div class="relay_task_t">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item><span style="cursor: pointer;" @click="pageType = 1">视频接力</span></el-breadcrumb-item>
          <el-breadcrumb-item>新建任务</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="relay_task_m">
        <div>
          <div class="relay_task_mt">
            <div class="relay_task_mtl">
              <div class="task_mtl_t">
                <el-radio-group v-model="xjType" @change="xjTypeChanged">
                  <el-radio :label="1">人员</el-radio>
                  <el-radio :label="2">车辆</el-radio>
                </el-radio-group>
              </div>
              <div class="task_mtl_m">
                <i>*</i>
                <template v-if="xjType === 2 && xjVechicleType === 2">
                  车牌号码：
                </template>
                <template v-else>
                  目标图片：
                </template>
                <span @click="xjVechicleType = 2" v-show="xjType === 2 && xjVechicleType ===1">输入车牌号</span>
                <span @click="xjVechicleType = 1" v-show="xjType === 2 && xjVechicleType ===2">上传车辆图片</span>
              </div>
              <div class="task_mtl_u" v-if="xjType === 2 && xjVechicleType === 2">
                <el-input v-model="xjPlateNo" placeholder="请输入车牌号码"></el-input>
              </div>
              <div class="task_mtl_u" v-else>
                <el-upload
                  class="vid_relay_upload"
                  :show-file-list="false"
                  accept="image/*"
                  :action="uploadAcion"
                  list-type="picture-card"
                  :before-upload="beforeAvatarUpload"
                  :on-success="uploadSucess"
                  :on-error="handleError">
                  <i v-if="uploading" class="el-icon-loading"></i>
                  <img v-else-if="xjType === 1 && curImageUrl" :src="curImageUrl">
                  <img v-else-if="xjType === 2 && curImageUrl2" :src="curImageUrl2">
                  <div style="line-height: normal; padding-top: 35px;" v-else>
                    <span style="font-size: 60px; color: #999;" class="el-icon-plus"></span>
                    <p style="color: #999; padding-top: 15px;">请上传清晰图片</p>
                  </div>
                </el-upload>
                <p @click="showHistoryPic(1)">从上传记录中选择</p>
                <div v-show="curImageUrl" class="del_icon">
                  <i class="el-icon-delete" @click="delPic(1)"></i>
                </div>
              </div>
            </div>
            <div class="relay_task_mtr">
              <div v-show="false"></div>
            </div>
          </div>
          <div class="relay_task_mm">
            <span @click="xjMoreInfo = !xjMoreInfo">
              更多设置<i class="el-icon-arrow-down" :class="{'relay_task_mm_d2': xjMoreInfo}"></i>
            </span>
          </div>
          <div class="relay_task_mb" v-show="xjMoreInfo">
            <h3>选择设备：</h3>
            <div class="task_mb_map">
              <ul class="task_mb_mt">
                <li @click="xjSelType = 1" :class="{'task_mb_mt_sed': xjSelType === 1}">地图选择</li>
                <li @click="xjSelType = 2" :class="{'task_mb_mt_sed': xjSelType === 2}">列表选择</li>
              </ul>
              <div class="mb_map_map" v-show="xjSelType === 1">
                <div class="mb_map_map_l">
                  <div class="mb_map_map_lt">
                    已选设备（12）
                    <span>移除设备</span>
                  </div>
                  <div class="mb_map_map_lb"></div>
                </div>
                <div class="mb_map_map_r">
                  <h4>可选设备(300)</h4>
                  <div>
                    <div style="width: 100%; height: 100%;" id="video_relay_xj_map"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="task_mb_d">
              <span>备注说明：</span>
              <el-input v-model="xjDesVal" style="width: 500px;" size="small" placeholder="请输入50字以内的备注说明"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="relay_task_b">
        <el-button size="small" type="primary">&nbsp;&nbsp;&nbsp;&nbsp;确&nbsp;&nbsp;定&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
        <el-button size="small" @click="pageType = 1">&nbsp;&nbsp;&nbsp;&nbsp;取&nbsp;&nbsp;消&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
      </div>
    </div>
    <!--历史记录弹窗-->
    <el-dialog
        :visible.sync="historyPicDialog"
        class="history-pic-dialog"
        :close-on-click-modal="false"
        top="4vh"
        title="最近上传的图片">
      <div style="text-align: center;font-size: 20px;" v-if="loadingHis"><i class="el-icon-loading"></i></div>
      <vue-scroll style="height: 4.6rem !important;" v-else-if="historyPicList.length">
        <div style="float: left;width: 1.38rem;height: 1.38rem;border: 3px solid #FFFFFF;
          margin-right: .2rem; margin-bottom: .2rem; cursor: pointer;" 
          class="his-pic-item" :style="{'border-color': item.checked ? '#0C70F8' : '#FFFFFF'}" v-for="item in historyPicList" :key="item.id" @click="chooseHisPic(item)">
          <img style="width: 100%; height: 100%;" :src="item.path" alt="">
        </div>
        <div style="clear: both;"></div>
      </vue-scroll>
      <p v-else>暂无历史记录</p>
      <div slot="footer">
        <el-button @click="historyPicDialog = false">取消</el-button>
        <el-button type="primary" @click="addHisToImg()" :disabled="choosedHisPic.length === 0">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {ajaxCtx} from '@/config/config';
import {mapXupuxian} from '@/config/config.js';
import {videoTree} from '@/utils/video.tree.js';
import videoEmpty from './videoEmpty.vue';
import flvplayer from '@/components/common/flvplayer.vue';
import { apiAreaServiceDeviceList, getAllMonitorList, getAllBayonetList } from "@/views/index/api/api.base.js";
  import {JtcPOSTAppendixInfo, JtcGETAppendixInfoList} from '@/views/index/api/api.judge.js'
export default {
  components: {videoEmpty, flvplayer},
  data () {
    let _ndate = new Date();
    return {
      pageType: 1, // 1展示 2新建
      // {video: {}, title: ''},
      videoList: [{}, {}, {}, {}],
      showVideoTotal: 4,
      showMenuActive: false,
      showConTitle: 1,
      startTime: '',
      endTime: '',
      targetType: '人员',
      searchVal2: '',
      dragActiveObj: null,

      videoRecordList: [],

      initTime: [new Date(_ndate.getTime() - 3600 * 1000 * 24 * 2), _ndate],
      startTime: '',
      endTime: '',

      /* 新建任务 begin */
      xjType: 1, // 1人员 2车辆
      xjVechicleType: 1, // 1上传图片  2输入车牌号
      xjPlateNo: '',
      xjMoreInfo: false,
      xjSelType: 1, // 1地图选择  2列表选择

      xjMap: null,
      listDevice: [], // 设备
      listBayonet: [], // 卡口

      xjDesVal: '',

      uploadAcion: ajaxCtx.base + '/new',
      curImageUrl: '', // 当前上传的图片 人员
      curImageUrl2: '', // 当前上传的图片 车辆
      uploading: false, // 是否上传中
      uploadFileList: [],
      imgData: {
        imgOne: null,
        imgTwo: null
      },
      historyPicList: [], // 上传历史记录
      historyPicDialog: false,
      loadingHis: false,
      /* 新建任务 end */

      startTimeOptions: {
        disabledDate: (d) => {
          // d > new Date() || d > this.endTime
          if (d > new Date()) {
            return true;
          } else {
            return false;
          }
        }
      },
      endTimeOptions: {
        disabledDate: (d) => {
          if (d > new Date() || d < (this.startTime.getTime() - 3600 * 1000 * 24) || d.getTime() > (this.startTime.getTime() + 3600 * 1000 * 24)) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
  },
  watch: {
    showVideoTotal () {
      this.playersHandler(this.showVideoTotal);
    },
    xjMoreInfo (val) {
      console.log(val);
      if (val) {
        if (this.xjSelType === 1) {
          if (!this.xjMap) {
            window.setTimeout(() => {
              this.xjInitMap();
            }, 200);
          }
        }
      }
    },
    xjSelType (val) {
      if (val === 1) {
        if (!this.xjMap) {
          window.setTimeout(() => {
            this.xjInitMap();
          }, 200);
        }
      }
    }
  },
  computed: {
    choosedHisPic () {
      return this.historyPicList.filter(x => x.checked)
    }
  },
  created () {
    // window.localStorage.getItem(name);
    // 第一次打开
    this.showMenuActive = true;
    this.startTime = this.initTime[0];
    this.endTime = this.initTime[1];
  },
  mounted () {
    videoTree('videoListTree2');
  },
  methods: {

    xjInitMap () {
      let _this = this;
      let _config = Object.assign({}, {
        zoom: 11,
        center: mapXupuxian.center,
        zooms: [2, 18]
      });
      // console.log('_config', _config)
      // 初始化地图
      let map = new window.AMap.Map('video_relay_xj_map', _config);
      map.setMapStyle('amap://styles/light');
      // map.setMapStyle('amap://styles/a00b8c5653a6454dd8a6ec3b604ec50c');
      // console.log('_config', _config)
      _this.xjMap = map;
      this.getListDevice();
      this.getListBayonet();
    },
    // 设备
    getListDevice () {
      getAllMonitorList({ccode: mapXupuxian.adcode}).then(res => {
        if (res) {
          this.listDevice = res.data;
          for (let i = 0; i < this.listDevice.length; i++) {
            let _d = this.listDevice[i];
            let sC = 'vl_icon_sxt';
            if (_d.deviceStatus !== 1) { sC = 'vl_icon_sxt_dis'; }
            this.doMark([_d.longitude, _d.latitude],
              _d.deviceName, 'vl_icon ' + sC);
          }
        }
      });
    },
    // 卡口
    getListBayonet () {
      getAllBayonetList({areaId: mapXupuxian.adcode}).then(res => {
        if (res) {
          this.listBayonet = res.data;
          for (let i = 0; i < this.listBayonet.length; i++) {
            let _d = this.listBayonet[i];
            let sC = 'vl_icon_kk';
            if (!_d.isEnabled) { sC = 'vl_icon_kk_dis'; }
            this.doMark([_d.longitude, _d.latitude],
              _d.bayonetName, 'vl_icon ' + sC);
          }
        }
      });
    },
    // 
    doMark (lnglat, title, sClass) {
      // console.log('doMark', obj);
      let marker = new window.AMap.Marker({ // 添加自定义点标记
        map: this.xjMap,
        position: lnglat, // 基点位置 [116.397428, 39.90923]
        offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // extData: obj,
        // 自定义点标记覆盖物内容
        content: '<div title="' + title + '" class="map_icons ' + sClass + '"></div>'
      });
    },

    changePage (type) {
      this.pageType = type;
    },
    startTimeChange (val) {
      if (val.getTime() > new Date()) {
        this.startTime = new Date();
        this.endTime = new Date();
      } else {
        let pd = val.getTime() + 3600 * 1000 * 24;
        this.endTime = pd < new Date().getTime() ? new Date(pd) : new Date();
      }
    },
    endTimeChange (val) {
      if (val < this.startTime) {
        this.endTime = this.startTime;
      } else if (val > new Date()) {
        this.endTime = new Date();
      } else {
        let pd = this.startTime.getTime() + 3600 * 1000 * 24;
        if (val.getTime() > pd) {
          if (pd > new Date().getTime()) {
            pd = new Date().getTime();
          }
          this.endTime = new Date(pd);
        }
      }
    },
    deviceIsPlaying (item, type) {
      let flag = false;
      for (let i = 0; i < this.videoList.length; i++) {
        if (this.videoList[i].video && this.videoList[i].video.uid === item.uid) {
          flag = true;
          break;
        }
      }
      return flag;
    },
    playersHandler (sum) {
      // videoList
      let na = [], ii = 0;
      for (let i = 0; i < this.videoList.length; i++) {
        if (ii < sum) {
          if (this.videoList[i] && this.videoList[i].video) {
            na.push(this.videoList[i]);
            ii++;
          }
        } else {
          break;
        }
      }
      let il = sum - na.length;
      if (il > 0) {
        for (let j = 0; j < il; j++) {
          na.push({});
        }
      }
      this.videoList = na;
    },

    // 拖拽开始
    dragStart (ev, item, type) {
      // console.log('drag start', item)
      this.dragActiveObj = Object.assign(item, {
        ui_type: type
      });
      // 设置属性dataTransfer   两个参数   1：key   2：value
      if (!ev) { ev = window.event; }
      ev.dataTransfer.setData('name', 'ouyang');
    },
    dragOver () {
      // console.log('drag over')
    },
    dragDrop (item, index) {
      if (this.dragActiveObj) {
        // let deviceSip = Math.random() > 0.5 ? 'rtmp://live.hkstv.hk.lxdns.com/live/hks1' : 'rtmp://10.16.1.139/live/livestream';
        let type = this.dragActiveObj.ui_type;
        let obj = {
          type: 5,
          title: '视频接力测试视频',
          record: true,
          video: Object.assign({}, {
            uid: this.dragActiveObj.uid
          })
        }
        this.videoList.splice(index, 1, obj);
      }
    },
    dragEnd () {
      // console.log('drag end')
      this.dragActiveObj = null;
    },
    /* 播放器事件 begin */
    /**
     * 关闭播放器
     * @param {string} sid 视频ID
     */
    playerClose (iIndex) {
      this.videoList.splice(iIndex, 1, {});
    },
    /* 播放器事件 end */

    showListEvent (type) {
      this.showMenuActive = true;
      if (type === 2) {
        this.showConTitle = 2;
      } else {
        this.showConTitle = 1;
      }
    },

    /* 新建任务 */
    xjTypeChanged (type) {
    },
    // 上传图片
    beforeAvatarUpload (file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
      const isLt = file.size / 1024 / 1024 < 100;
      if (!isJPG) {
        this.$message.error('只能上传 JPG / PNG 格式图片!');
      }
      if (!isLt) {
        this.$message.error('上传图片大小不能超过 100MB!');
      }
      this.uploading = true;
      return isJPG && isLt;
    },
    uploadSucess (response, file, fileList) {
      this.uploading = false;
      this.compSim = '';
      this.compSimWord = '';
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
              x['uid'] = jRes.data;
              console.log(x);
            }
          })
          this.imgData.imgOne = x;
          this.curImageUrl = x.path;
        }
      }
      this.uploadFileList = fileList;
    },
    handleError () {
      this.uploading = false;
      this.$message.error('上传失败')
    },
    delPic (index) {
      this.compSim = '';
      this.compSimWord = '';
      if (index === 1) {
        this.uploadFileList.splice(0, 1);
        this.curImageUrl = '';
      } else {
        this.uploadFileList2.splice(0, 1);
        this.curImageUrl2 = '';
      }
    },
    showHistoryPic (index) {
      this.curIndex = index;
      this.loadingHis = true;
      this.historyPicDialog = true;
      let params = {
        userId: this.$store.state.loginUser.uid,
        fileType: 1
      }
      JtcGETAppendixInfoList(params).then(res => {
        if (res) {
          this.loadingHis = false;
          res.data.forEach(x => x.checked = false);
          this.historyPicList = res.data;
        }
      }).catch(() => {
        this.historyPicDialog = false;
      })
    },
    chooseHisPic (item) {
      this.historyPicList.forEach(x => {
        x.checked = false;
      })
      item.checked = true;
    },
    addHisToImg () {
      this.historyPicDialog = false;
      let _ids = [];
      this.choosedHisPic.forEach(x => {
        _ids.push(x.uid)
        if (this.xjType === 1) {
          this.curImageUrl = x.path;
          this.imgData.imgOne = x;
        } else {
          this.imgData.imgTwo = x;
          this.curImageUrl2 = x.path;
        }
      })
      let _obj = {
        appendixInfoIds: _ids.join(',')
      }
      // JtcPUTAppendixsOrder(_obj);
    },
  },
  destroyed () {
  }
}
</script>
<style lang="scss" scoped>
.mb_map_map {
  overflow: hidden;
  .mb_map_map_l {
    float: left;
    width: 250px;
    > .mb_map_map_lt {
      height: 40px; line-height: 40px;
      padding: 0 10px 0 10px;
      border-bottom: 1px solid #f2f2f2;
      overflow: hidden;
      > span {
        float: right;
        color: #999;
      }
    }
    > .mb_map_map_lb {
      width: 100%; height: 599px;
    }
  }
  .mb_map_map_r {
    margin-left: 250px;
    border-left: 1px solid rgba(242,242,242,1);
    > h4 {
      height: 40px; line-height: 40px;
      padding-left: 20px;
    }
    > div {
      position: relative;
      height: 600px;
    }
  }
}
.relay_task_mb {
  border-top: 1px solid #eee;
  > h3 {
    color: #666;
    padding-top: 10px;
  }
  > .task_mb_map {
    border-radius:4px 4px 0px 0px;
    border:1px solid rgba(211,211,211,1);
    > .task_mb_mt {
      border-bottom: 1px solid #eee;
      overflow: hidden;
      background-color: #FAFAFA;
      > li {
        float: left;
        height: 40px; line-height: 40px;
        margin: 0 20px;
        border-bottom: 2px solid #FAFAFA;
        cursor: pointer;
        &.task_mb_mt_sed {
          color: #0C70F8;
          border-bottom-color: #0C70F8;
          cursor: default;
        }
      }
    }
  }
  > .task_mb_d {
    padding: 15px 0 8px 0;
    > span { color: #666; }
  }
}
.relay_task_mm {
  padding: 15px 0;
  color: #0C70F8;
  > span {
    display: inline-block;
    cursor: pointer;
    > i {
      padding-left: 5px;
      color: #0C70F8; font-size: 16px;
      transition: all .4s ease-out;
      &.relay_task_mm_d2 {
        transform: rotate(180deg);
      }
    }
  }
}
.relay_task_mtl {
  float: left;
  width: 260px;
  height: 330px;
  border-radius:4px 4px 0px 0px;
  border:1px solid rgba(211,211,211,1);
  > .task_mtl_t {
    padding: 14px 0 14px 20px;
    text-align: left;
    background-color: #F2F2F2;
  }
  > .task_mtl_m {
    padding: 12px 25px 12px 25px;
    color: #666;
    overflow: hidden;
    > i {
      display: inline-block;
      color: red;
      font-style: normal;
    }
    > span {
      float: right;
      color: #0C70F8;
      cursor: pointer;
    }
  }
  > .task_mtl_u {
    position: relative;
    margin: 0 auto;
    width: 200px; height: 200px;
    > p {
      display: none;
      position: absolute; bottom: 0; left: 0;
      text-align: center;
      width: 100%; height: .4rem; line-height: .4rem;
      color: #FFFFFF;
      border-radius: 0 0 10px 10px;
      background: #0C70F8;
      cursor: pointer;
    }
    > .del_icon {
      display: none;
      position: absolute;
      top: 10px;
      right: 10px;
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 4px;
      color: #FFFFFF;
    }
    &:hover {
      > p { display: block; }
      > .del_icon { display: block; }
    }
  }
}
.relay_task_mtr {
  margin-left: 270px;
  height: 330px;
  > div {
    width: 100%; height: 100%;
    border-radius:4px 4px 0px 0px;
    border:1px solid rgba(211,211,211,1);
  }
}
.relay_task {
  position: relative;
  height: 100%;
  > .relay_task_t {
    position: absolute; top: 0; left: 0;
    width: 100%;
    padding: 15px 0 0 20px;
  }
  > .relay_task_m {
    height: 100%;
    padding: 40px 10px 70px 10px;
    > div {
      height: 100%;
      padding: 10px;
      overflow: auto;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #fff;
      box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
      border-radius:4px;
    }
  }
  > .relay_task_b {
    position: absolute; bottom: 0; left: 0; z-index: 20;
    width: 100%; height: 60px;
    padding: 14px 0 0 20px;
    background-color: #fff;
    border-left: 1px solid #ddd;
  }
  
}
.relay_main { width: 100%; height: 100%; }
.relay_ul_list {
  height: 100%;
  padding-bottom: 50px;
  border-top: 1px solid #eee;
  > ul {
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
    > li {
      padding: 10px 10px 10px 20px;
      border-bottom: 1px solid #eee;
      > div {
        > .relay_ul_lit {
          position: relative;
          font-size: 12px; color: #333;
          margin-bottom: 5px;
          height: 22px; line-height: 22px;
          > span {
            position: absolute; top: 2px; right: 0;
            &.relay_ul_lit_t1 { color: #4FCB61; }
            &.relay_ul_lit_t2 { color: #FA453A; }
            &.relay_ul_lit_t3 {
              display: none;
              line-height: normal;
              padding: 2px 5px;
              background:rgba(12,112,248,1);
              border-radius:4px;
              color: #fff; font-size: 12px;
              cursor: pointer;
            }
          }
        }
        > .relay_ul_lii {
          height: 60px;
          text-align: center;
          margin-bottom: 5px;
          > img { max-height: 100%; max-width: 100%; text-align: center; }
        }
        > .relay_ul_lid {
          height: 20px; line-height: 20px;
          font-size: 12px; color: #999;
        }
        > .relay_ul_lim {
          padding: 5px 0;
          > ul {
            width: 76px;
            margin: 0 auto; padding: 8px 0;
            background:rgba(242,242,242,1);
            border:1px solid rgba(211, 211, 211, 0.97);
            border-radius:3px;
            > li {
              text-align: center;
              font-size: 12px;
            }
          }
        }
        &.relay_ul_list_active {
          > .relay_ul_lit { color: #999; }
        }
        &:hover {
          > .relay_ul_lit {
            > span {
              &.relay_ul_lit_t3 { display: block; }
            }
          }
        }
      }
    }
  }
}
.relay_ul_btn {
  position: absolute; bottom: 0; left: 0;
  border-top: 1px solid #eee;
  padding-bottom: 2px;
  width: 100%; height: 50px; line-height: 48px;
  text-align: center;
  background-color: #fff;
}
</style>
<style lang="scss">
.vid_relay_upload {
  width: 200px; height: 200px;
  > .el-upload--picture-card {
    width: 200px; height: 200px; line-height: 200px;
    > img { height: 100%; width: 100%; }
  }
}
</style>
