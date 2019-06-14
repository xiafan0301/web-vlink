<template>
  <div class="unaudit">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/event/audit' }">事件管理</el-breadcrumb-item>
        <el-breadcrumb-item>受理核实</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-box">
      <div class="content-left">
        <div class="content_left_scroll">
          <vue-scroll>
            <div class="content_left">
              <ul>
                <li style="align-items: baseline;">
                  <span class="audit-label">状态:</span>
                  <span class="audit-status">待审核</span>
                </li>
                <li>
                  <span>事件编号:</span>
                  <span>{{addEventForm.eventCode}}</span>
                </li>
                <li>
                  <span>上报人:</span>
                  <div class="phone_box" style='margin-right:20px;'>
                    <span class="reportUser">{{addEventForm.reporterPhone}}</span>
                    <div class="phone_dialog">
                      <div>
                        <i class="vl_icon vl_icon_event_14"></i>
                        <span>语音通话</span>
                      </div>
                      <div>
                        <i class="vl_icon vl_icon_event_17"></i>
                        <span>视频通话</span>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <span>上报时间:</span>
                  <span>{{addEventForm.reportTime}}</span>
                </li>
              </ul>
              <el-form :inline="false" :model="addEventForm" class="add_event_form" :rules="rules" ref="addEventForm">
                <el-form-item label="事发地点:" label-width="85px" prop="eventAddress" class="address_input">
                  <el-input type="text" style='width: 95%' placeholder="请输入事发地点" id="address" v-model="addEventForm.eventAddress" @focus="getAutoInputAddress" @input="changeAddress" ></el-input>
                  <i class="vl_icon vl_icon_event_27 address_icon" @click="initMap"></i>
                </el-form-item>
                <el-form-item label="事件情况:" label-width="85px" prop="eventDetail">
                  <el-input type="textarea" rows="5" style='width: 95%' placeholder="请对事发情况进行描述，文字限制140字" v-model="addEventForm.eventDetail" maxlength="140"></el-input>
                </el-form-item>
                <div class="img-form-item">
                  <template v-if="uploadImgList.length > 0">
                    <div 
                      class="img_list"
                      v-for="(item, index) in uploadImgList"
                      :key="'item' + index"
                    >
                      <img :src="item.path" @click="openBigImg(index, uploadImgList)" />
                      <div class="close_icon" @click="removeImg(index)">
                        <i class="vl_icon vl_icon_event_24 "></i>
                      </div>
                    </div>
                  </template>
                  <template v-if="uplaodVideoList.length > 0">
                    <div class="video_box" v-for="(item ,index) in uplaodVideoList" :key="index">
                      <video :src="item.path" id="add_video"></video>
                      <div class="close_icon" @click="removeVideo(index)">
                        <i class="vl_icon vl_icon_event_24"></i>
                      </div>
                      <div class="play_icon">
                        <i v-show="isPlaying" class="pause_btn vl_icon vl_icon_judge_01" @click="playVideo(false)"></i>
                        <i v-show="!isPlaying" class="play_btn vl_icon vl_icon_control_09" @click="playVideo(true)"></i>
                      </div>
                    </div>
                  </template>
                  <el-upload
                    :action="uploadUrl"
                    list-type="picture-card"
                    accept=".png,.jpg,.jpeg,.mp4,.bmp"
                    multiple
                    :before-upload='handleBeforeUpload'
                    :on-success='handleSuccess'
                    :show-file-list='false'
                  >
                    <i class="el-icon-plus"></i>
                    <span class='add-img-text'>添加</span>
                  </el-upload>
                </div>
                <el-form-item label-width="85px" class="upload_tip">
                  <div style="color: #999999;">（只能上传视频或图片，视频最多1个，图片最多9张）</div>
                  <p class="error_tip" v-show="isShowErrorTip">{{errorText}}</p>
                </el-form-item>
                <el-form-item  label="处理单位:" prop="dealOrgId" label-width="85px">
                  <el-select v-model="addEventForm.dealOrgId" style='width: 95%'>
                    <el-option
                      v-for="(item, index) in handleUnitList"
                      :key="index"
                      :label="item.organName"
                      :value="item.uid"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  label="事件类型:" prop="eventType" label-width="85px">
                  <el-select v-model="addEventForm.eventType" style='width: 95%'>
                    <el-option
                      v-for="(item, index) in eventTypeList"
                      :key="index"
                      :label="item.enumValue"
                      :value="item.enumField"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="事件等级:" prop="eventLevel" label-width="85px">
                  <el-select v-model="addEventForm.eventLevel" style='width: 95%'>
                    <el-option
                      v-for="(item, index) in eventLevelList"
                      :key="index"
                      :label="item.enumValue"
                      :value="item.enumField"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="伤亡人员:" prop="casualtieName" label-width="85px">
                  <el-radio-group v-model="addEventForm.casualtieName" style='width: 230px'>
                    <el-radio label="无"></el-radio>
                    <el-radio label="不确定"></el-radio>
                    <el-radio label="有"></el-radio>
                  </el-radio-group>
                  <template v-if="addEventForm.casualtieName === '有'">
                    <el-input style='width: 120px;margin-left:-1%;font-size: 12px;' size="small" placeholder='请输入死亡人数' v-model='dieNumber'></el-input>
                    <span style='margin-left:1%'>人</span>
                    <div class="el-form-item__error--inline el-form-item__error" v-show="isDieError">{{dieTip}}</div>
                  </template>
                </el-form-item>
              </el-form>
            </div>
          </vue-scroll>
        </div>
      </div>
      <div class="content_right" v-show="isShowMap">
        <!--地图-->
        <div id="mapBox"></div>
        <div class="right-flag">
          <ul class="map-rrt">
            <li><i class="vl_icon vl_icon_control_23" @click="resetMap"></i></li>
          </ul>
          <ul class="map-rrt map_rrt_u2">
            <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
            <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
          </ul>
        </div>
        <i class="vl_icon vl_icon_event_23 close_btn" @click="closeMap"></i>
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn function_btn" :loading="isPassLoading" @click="submitData('addEventForm')">通过</el-button>
      <el-button class="operation_btn back_btn" @click="showRejectDialog">驳回</el-button>
      <el-button class="operation_btn back_btn" @click="back">返回</el-button>
    </div>
    <!-- 驳回弹出框 -->
    <el-dialog
      title="驳回"
      :visible.sync="rejectDialogVisible"
      width="482px"
      class="dialog_comp"
      >
      <div class="content-body">
        <p>请选择或输入驳回的原因。</p>
        <el-form :model="rejectForm" ref="rejectForm">
          <el-form-item label=" " prop="rejectReason" :rules="{ required: true, message: '请选择驳回原因', trigger: 'blur' }">
            <el-select v-model="rejectForm.rejectReason" style='width: 90%' @change="changeCloseReason" placeholder="驳回原因">
              <el-option
                v-for="(item, index) in rejectReasonList"
                :key="index"
                :label="item.enumValue"
                :value="item.enumField"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <template v-if="isShowRejectRemark">
            <el-form-item label=" " prop="rejectReasonDesci" :rules="{ required: true, message: '请简述驳回原因', trigger: 'blur' }">
              <el-input style="width: 90%" v-model="rejectForm.rejectReasonDesci" type="textarea" rows="6" placeholder="请简要描述驳回的原因。140字"></el-input>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelReject('rejectForm')">取 消</el-button>
        <el-button class="operation_btn function_btn" :loading="isRejectLoading" @click="rejectEvent('rejectForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--返回提示弹出框-->
    <el-dialog
      title="提示"
      :visible.sync="backDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;">返回后内容不会保存，您确定要返回吗?</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="backDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" @click="sureBack">确认</el-button>
      </div>
    </el-dialog>
    <BigImg :imgList="imgList1" :imgIndex='imgIndex' :isShow="isShowImg" @emitCloseImgDialog="emitCloseImgDialog"></BigImg>
  </div>
</template>
<script>
import { dataList, operationType } from '@/utils/data.js';
import { ajaxCtx } from '@/config/config.js';
import BigImg from '@/components/common/bigImg.vue';
import { getEventDetail, updateEvent } from '@/views/index/api/api.event.js';
import { getDepartmentList } from '@/views/index/api/api.manage.js';
import { getDiciData } from '@/views/index/api/api.js';
export default {
  components: { BigImg },
  data () {
    return {
      isShowMap: false, // 是否显示地图
      imgIndex: 0, // 点击的图片索引
      isShowImg: false, // 是否放大图片
      imgList1: [], // 要放大的图片
      uploadUrl: ajaxCtx.base + '/new', // 图片上传地址
      rejectDialogVisible: false, // 驳回弹出框
      backDialog: false, // 返回提示弹出框
      isImgNumber: false,
      newMarker: null,
      addEventForm: {
        uid: '',
        type: operationType.auditEvent, // 1-事件审核 2-事件处理 3-转到其他单位 4-结束事件
        reporterPhone: '', // 报案人  手机号码
        reportTime: '', // 上报时间
        eventAddress: '', // 事发地点
        eventDetail: '', // 事件情况
        eventType: '', // 事件类型
        eventLevel: '', // 事件等级
        casualtieName: '', // 伤亡人员
        casualties: '', // 伤亡人员
        longitude: '', // 经度
        latitude: '', // 纬度
        dealOrgId: '', // 处理单位
        acceptFlag: 2, // 证明是通过
        addList: [], // 图片文件
      },
      rules: {
        eventAddress: [
          { required: true, message: '请输入或选择事发地址', trigger: 'blur' }
        ],
        eventDetail: [
          { required: true, message: '请输入事件情况', trigger: 'blur' },
          { max: 140, message: '最多输入140字', trigger: 'blur' }
        ],
        eventType: [
          { required: true, message: '请选择事发类型', trigger: 'blur' }
        ],
        dealOrgId: [
          { required: true, message: '请选择处理单位', trigger: 'blur' }
        ]
      },
      rejectForm: {
        rejectReason: null,
        rejectReasonDesci: null
      },
      isShowRejectRemark: false, // 是否显示驳回原因备注
      map: null,
      dieNumber: null, // 死亡人数
      isDieError: false,
      dieTip: '死亡人数只能为正整数',
      eventLevelList: [], // 事件等级列表数据
      eventTypeList: [], // 事件类型列表数据
      handleUnitList: [], // 处理单位列表数据
      rejectReasonList: [], // 驳回原因列表数据
      userInfo: {},
      uploadImgList: [], // 要上传的图片列表
      uplaodVideoList: [], // 要上传的视频列表
      isRejectLoading: false, // 驳回加载中
      isPassLoading: false, // 通过加载中
      isPlaying: false, // 是否播放视频
      isShowErrorTip: false, // 是否显示图片上传错误提示
      errorText: null, // 图片上传错误提示
      autoInput: null, // 自动输入对象
    }
  },
  watch: {
    uplaodVideoList (val) {
      if (this.uploadImgList.length > 0 && val.length > 0) {
        this.isShowErrorTip = true;
        this.errorText = '图片和视频只能上传一种';
      } else if (this.uploadImgList.length > 9 || val.length > 1) {
        this.isShowErrorTip = true;
        this.errorText = '最多上传1个视频或9张图片';
      } 
      else {
        this.isShowErrorTip = false;
        this.errorText = null;
      }
    },
    uploadImgList (val) {
      if (this.uplaodVideoList.length > 0 && val.length > 0) {
        this.isShowErrorTip = true;
        this.errorText = '图片和视频只能上传一种';
      } else if (this.uplaodVideoList.length > 1 || val.length > 9) {
        this.isShowErrorTip = true;
        this.errorText = '最多上传1个视频或9张图片';
      } 
      else {
        this.isShowErrorTip = false;
        this.errorText = null;
      }
    }
  },
  created () {
    this.userInfo =  this.$store.state.loginUser;
    this.getEventLevelList();
    this.getHandleUnit();
    this.getEventTypeList();
    this.getRejectReasonList();
  },
  mounted () {
    // this.initMap();
    setTimeout(() => {
      this.dataStr = JSON.stringify(this.addEventForm); // 将初始数据转成字符串
    }, 1000);
    this.getDetail();
  },
  methods: {
    // 当获取地址输入框焦点时
    getAutoInputAddress () {
      this.autoInput = new window.AMap.Autocomplete({
        input: 'inputAddress'
      });
    },
    // 返回
    back () {
      const data = JSON.stringify(this.addEventForm);
      if (this.dataStr === data) {
        this.$router.back(-1);
      } else {
        this.backDialog = true;
      }
    },
    // 确定返回 
    sureBack () {
      this.backDialog = false;
      this.$router.back(-1);
    },
    // 获取驳回原因
    getRejectReasonList () {
      const reason = dataList.rejectReason;
      getDiciData(reason)
        .then(res => {
          if (res) {
            this.rejectReasonList = res.data;
          }
        })
        .catch(() => {})
    },
    // 获取处理单位
    getHandleUnit () {
      const params = {
        'where.proKey': this.userInfo.proKey,
        pageSize: 0,
      };
      getDepartmentList(params)
        .then(res => {
          if (res && res.data.list) {
            this.handleUnitList = res.data.list;
          }
        })
    },
    // 获取事件类型
    getEventTypeList () {
      const type = dataList.eventType;
      getDiciData(type)
        .then(res => {
          if (res) {
            this.eventTypeList = res.data;
          }
        })
        .catch(() => {})
    },
    // 获取事件等级
    getEventLevelList () {
      const level = dataList.eventLevel;
      getDiciData(level)
        .then(res => {
          if (res) {
            this.eventLevelList = res.data;
          }
        })
        .catch(() => {})
    },
    // 获取事件详情
    getDetail () {
      const eventId = this.$route.query.eventId;
      getEventDetail(eventId)
        .then(res => {
          if (res) {
            let eventType = res.data.eventType;
            let eventLevel = res.data.eventLevel;
           
           
            this.addEventForm.uid = res.data.uid;
            this.addEventForm.eventCode = res.data.eventCode;
            this.addEventForm.eventDetail = res.data.eventDetail;
            this.addEventForm.longitude = res.data.longitude;
            this.addEventForm.latitude = res.data.latitude;
            this.addEventForm.reporterPhone = res.data.reporterPhone;
            this.addEventForm.reportTime = res.data.reportTime;
            this.addEventForm.eventAddress = res.data.eventAddress;
            this.addEventForm.dealOrgId = res.data.dealOrgId;
           
            if (res.data.casualties === -1) {
              this.addEventForm.casualtieName = '不确定';
            } else if (res.data.casualties === 0) {
              this.addEventForm.casualtieName = '无';
            } else if (res.data.casualties > 0) {
              this.addEventForm.casualtieName = '有';
              this.dieNumber = res.data.casualties;
            }
            if (res.data.attachmentList && res.data.attachmentList.length > 0) {
              res.data.attachmentList.map(item => {
                if (item.fileType === 1) {
                  this.uploadImgList.push(item);
                } else {
                  this.uplaodVideoList.push(item);
                }
              })
            }
            
            this.addEventForm.eventType = eventType.toString(); // 将整型转成字符串
            this.addEventForm.eventLevel = eventLevel.toString();
          }
        })
        .catch(() => {})
    },
    // 关闭地图
    closeMap () {
      if (this.map) {
        this.map.destroy();
        this.isShowMap = false;
      }
    },
    initMap () {
      let _this = this;
      _this.isShowMap = true;

      _this.resetMap();
      let map = new window.AMap.Map('mapBox', {
        zoom: 16, // 级别
        center: [110.596015, 27.907662], // 中心点坐标[110.596015, 27.907662]
        // center: [_this.addEventForm.longitude, _this.addEventForm.latitude]
      });
      map.setMapStyle('amap://styles/whitesmoke');
      _this.map = map;

      _this.autoInput = new window.AMap.Autocomplete({
        input: 'address'
      })

      map.on('click', function(e) {
        if (_this.newMarker) {
          _this.map.remove(_this.newMarker);
          _this.newMarker = null;
        }
        _this.addEventForm.longitude = e.lnglat.getLng();
        _this.addEventForm.latitude = e.lnglat.getLat();
        window.AMap.service('AMap.Geocoder', function () { // 回调函数
          let geocoder = new window.AMap.Geocoder({});
          geocoder.getAddress([e.lnglat.getLng(), e.lnglat.getLat()], function (status, result) {
            let sAddr = '';
            if (status === 'complete' && result.info === 'OK') {
              // 获得了有效的地址信息: result.regeocode.formattedAddress
              // console.log(result.regeocode.formattedAddress);
              sAddr = result.regeocode.formattedAddress;
            }
            _this.addEventForm.eventAddress = sAddr;
            _this.mapMark(_this.addEventForm);
          });
        });
      });
      this.mapMark(this.addEventForm);
    },
    resetMap () {
      let _this = this;
      let map = new window.AMap.Map('mapBox', {
        zoom: 16, // 级别
        center: [112.980377, 28.100175], // 中心点坐标112.980377,28.100175
        // viewMode: '3D' // 使用3D视图
      });
      map.setMapStyle('amap://styles/whitesmoke');
      _this.map = map;
    },
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    // 地图标记
    mapMark (obj) {
      let _this = this;
      
      _this.map.clearMap();
      let hoverWindow = null;
      if (obj.longitude > 0 && obj.latitude > 0) {
        let offSet = [-20.5, -48];
       
        let marker = new window.AMap.Marker({ // 添加自定义点标记
          map: _this.map,
          position: [obj.longitude, obj.latitude],
          offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: '<div class="vl_icon vl_icon_control_30"></div>'
        });
        marker.setMap(_this.map);
        _this.newMarker = marker;
        // hover
        marker.on('mouseover', function () {
          let sContent = '<div class="vl_map_hover" >' +
            '<div class="vl_main_hover_address" style="min-width: 300px;padding: 15px"><p class="vl_map_hover_main_p">事发地点： ' + obj.eventAddress + '</p></div></div>';
          hoverWindow = new window.AMap.InfoWindow({
            isCustom: true,
            closeWhenClickMap: true,
            offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
            content: sContent
          });
          // aCenter = mEvent.target.F.position
          hoverWindow.open(_this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
          hoverWindow.on('close', function () {
            // console.log('infoWindow close')
          });
        });
        marker.on('mouseout', function () {
          if (hoverWindow) { hoverWindow.close(); }
        });
        if (_this.map) {
           _this.map.setCenter([obj.longitude, obj.latitude]); // 根据经纬度重新设置地图中心点
        }
      }
    },
    // 事件地址change
    changeAddress () {
      let _this = this;
      
      window.AMap.event.addListener(_this.autoInput, 'select', function (e) {
        _this.addEventForm.eventAddress = e.poi.name;
        window.AMap.service('AMap.Geocoder', () => {
          var geocoder = new window.AMap.Geocoder({});
          geocoder.getLocation(e.poi.name, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              _this.addEventForm.longitude = result.geocodes[0].location.lng;
              _this.addEventForm.latitude = result.geocodes[0].location.lat;
              _this.mapMark(_this.addEventForm);
            }
          });
        })
      }); // 注册监听，当选中某条记录时会触发
    },
    // 在图片上传之前
    handleBeforeUpload (file) {
      let isLtTenM;
      const isPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'video/mp4' || file.type === 'image/bmp';
      if (!isPng) {
        this.$message({
          type: 'warning',
          message: '上传文件只能是png、jpg、jpeg、mp4格式',
          customClass: 'upload_file_tip'
        });
      }
      if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp') {
        isLtTenM = file.size / 1024 / 1024 < 2;
      } else {
        isLtTenM = file.size / 1024 / 1024 < 10;
      }
      if (!isLtTenM) {
        this.$message({
          type: 'warning',
          message: '上传的图片大小不能超过2M,视频大小不能超过10M',
          customClass: 'upload_file_tip'
        });
      }
      if (this.isShowErrorTip) { // 上传错误提示
        return;
      }
      return isPng && isLtTenM;
    },
    // 关闭图片放大
    emitCloseImgDialog(value){
      this.imgList1 = [];
      this.isShowImg = value;
    },
    // 放大图片
    openBigImg (index, data) {
      this.isShowImg = true;
      this.imgIndex = index;
      this.imgList1 = JSON.parse(JSON.stringify(data));
    },
    // 移除图片
    removeImg (index) {
      this.uploadImgList.splice(index, 1);
    },
    // 移除视频
    removeVideo (index) {
      this.uplaodVideoList.splice(index, 1);
    },
    // 图片上传成功
    handleSuccess (res) {
      if (this.isShowErrorTip) { // 上传错误提示
        return;
      } else {
        if (res && res.data) {
          const fileName = res.data.fileName;
          let type, data;
          if (fileName) {
            type = fileName.substring(fileName.lastIndexOf('.'));
            if (type === '.png' || type === '.jpg' || type === '.jpeg' || type === '.bmp') {
              data = {
                contentUid: 0,
                fileType: dataList.imgId,
                path: res.data.fileFullPath,
                filePathName: res.data.filePath,
                cname: res.data.fileName,
                imgSize: res.data.fileSize,
                imgWidth: res.data.fileWidth,
                imgHeight: res.data.fileHeight,
                thumbnailPath: res.data.thumbnailFileFullPath,
              }
              this.uploadImgList.push(data);
            } else {
              data = {
                contentUid: 0,
                fileType: dataList.videoId,
                path: res.data.fileFullPath,
                filePathName: res.data.filePath,
                cname: res.data.fileName,
                imgSize: res.data.fileSize,
                imgWidth: res.data.fileWidth,
                imgHeight: res.data.fileHeight,
                thumbnailPath: res.data.thumbnailFileFullPath,
              }
              this.uplaodVideoList.push(data);
            }
          }
        }
      }
    },
    // 显示驳回弹出框
    showRejectDialog () {
      this.rejectDialogVisible = true;
    },
    // 取消驳回
    cancelReject (form) {
      this.$refs[form].resetFields();
      this.rejectDialogVisible = false;
    },
    // 驳回
    rejectEvent (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.isRejectLoading = true;
          const params = {
            uid: this.addEventForm.uid,
            acceptFlag: 3, // 证明是驳回
            type: operationType.auditEvent, // 1--事件审核
            rejectReasonDesci: this.rejectForm.rejectReasonDesci,
            rejectReason: this.rejectForm.rejectReason
          }
          updateEvent(params)
          .then(res => {
            if (res) {
              this.$message({
                type: 'success',
                message: '驳回成功',
                customClass: 'request_tip'
              });
              this.$router.push({name: 'event_audit'});
              this.rejectDialogVisible = false;
              this.isRejectLoading = false;
            } else {
              this.$message({
                type: 'error',
                message: '驳回失败',
                customClass: 'request_tip'
              })
              this.isRejectLoading = false;
            }
          })
          .catch(() => {this.isRejectLoading = false;})
        }
      })
    },
    // 驳回原因change
    changeCloseReason (val) {
      this.rejectForm.rejectReasonDesci = null;
      if (val === '4') {
        this.isShowRejectRemark = true;
      } else {
        this.isShowRejectRemark = false;
      }
    },
    submitData (form) { // 审核通过
      this.$refs[form].validate(valid => {
        if (valid) {
          this.addEventForm.addList = [];
          let reg = /^([1-9]\d*|0)(\.\d*[1-9])?$/; // 校验死亡人数
          if (this.addEventForm.casualtieName === '无') {
            this.addEventForm.casualties = 0;
          } else if (this.addEventForm.casualtieName === '不确定') {
            this.addEventForm.casualties = -1;
          } else if (this.addEventForm.casualtieName === '有') {
            if (!reg.test(this.dieNumber)) {
              this.isDieError = true;
              this.dieTip = '死亡人数只能为正整数';
              return false;
            } else {
              this.isDieError = false;
              this.dieTip = '';
            }
            if (parseInt(this.dieNumber) > 9999) {
              this.isDieError = true;
              this.dieTip = '可输入的最大死亡人数为9999';
              return false;
            } else {
              this.isDieError = false;
              this.dieTip = '';
            }
            this.addEventForm.casualties = this.dieNumber;
          }
          if (this.isShowErrorTip) { // 上传错误提示
            return;
          }
          this.uploadImgList.map(item => {
            if (item.uid) {
              item.uid = null;
            }
            this.addEventForm.addList.push(item);
          });
          this.uplaodVideoList.map(item => {
            if (item.uid) {
              item.uid = null;
            }
            this.addEventForm.addList.push(item);
          });
          this.isPassLoading = true;
          updateEvent(this.addEventForm)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '保存成功',
                  customClass: 'request_tip'
                });
                this.$router.push({name: 'event_audit'});
                this.isPassLoading = false;
              } else {
                this.isPassLoading = false;
              }
            })
            .catch(() => {this.isPassLoading = false;})
        }
      })
    },
    // 播放视频
    playVideo (val) {
      if (val) {
        this.isPlaying = true;
        document.getElementById('add_video').play();
        this.handleVideoEnd();
      } else {
        this.isPlaying = false;
        document.getElementById('add_video').pause();
      }
    },
    // 监听视频是否已经播放结束
    handleVideoEnd () {
      let _this = this;
      const obj = document.getElementById('add_video');
      if (obj) {
        obj.addEventListener('ended', () => { // 当视频播放结束后触发
          _this.isPlaying = false;
        });
      }
    }
  }
}
</script>
<style lang="scss">
.unaudit {
  width: 100%;
  height: 100%;
  .content-box {
    width: 98%;
    margin: 0 20px;
    height: calc(100% - 50px - 100px);
    display: flex;
    box-shadow: 5px 0px 16px 0px rgba(169,169,169,0.2);
    .content_left_scroll {
      width: 500px;
      height: 100%;
      background: #ffffff;
      /deep/ .__view {
        width: 100% !important;
      }
      .content_left {
        width: 100%;
        padding: 20px 10px 0 10px;
        > ul {
          width: 100%;
          font-size: 14px;
          > li {
            height: 35px;
            display: flex;
            > span:nth-child(1) {
              padding-right: 10px;
              color: #666666;
              width: 85px;
              display: inline-block;
              text-align: right;
              &.audit-label {
                color: #333333;
              }
            }
            > span:nth-child(2) {
              color: #333333;
              display: inline-block;
              &.audit-status {
                color: #0C70F8;
                font-size: 18px;
              }
              &.phone {
                color: #0C70F8;
              }
            }
            .phone_box {
              position: relative;
              padding-right: 10px;
              &:hover {
                .phone_dialog {
                  display: block;
                }
              }
              .reportUser {
                color: #0C70F8;
                cursor: pointer;
              }
              .phone_dialog {
                display: none;
                position: absolute;
                background-color: #ffffff;
                right: -30px;
                bottom: 30px;
                box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.15);
                >div {
                  padding: 5px 10px;
                  display: flex;
                  align-items: center;
                  cursor: pointer;
                  >span {
                    color: #333333;
                    font-size: 12px;
                  }
                  &:hover {
                    >span {
                      color: #0C70F8;
                    }
                  }
                }
              }
            }
          }
        }
        .add_event_form {
          // width: 100%;
          .address_input {
            position: relative;
            /deep/ .el-input__inner {
              padding: 0 20px 0 15px;
            }
            .address_icon {
              position: absolute;
              right: 6%; 
              top: 13px;
            }
          }
          /deep/ .el-form-item {
            margin-bottom: 20px;
          }
          .img-form-item {
            margin-left: 85px;
            width: 400px;
            display: flex;
            flex-wrap: wrap;
            /deep/ .el-upload--picture-card {
              margin-right: 5px;
            }
            .close_icon {
              position: absolute;
              right: 2px;
              top: 4px;
              cursor: pointer;
            }
            .play_icon {
              position: absolute;
              cursor: pointer;
              top: 30%;
              left: 30%;
              background: #000;
              opacity: 0.6;
              width: 40px;
              height: 40px;
              /* line-height: 40px; */
              /* text-align: center; */
              border-radius: 50%;
              .pause_btn {
                margin-left: 30%;
                margin-top: 22%;
              }
              .play_btn {
                margin-left: 37%;
                margin-top: 22%;
              }
            }
            .img_list, .video_box {
              width: 100px;
              height: 100px;
              margin: 0 5px 5px 0;
              cursor: pointer;
              position: relative;
              img, video {
                border: 1px solid #cccccc;
                border-radius: 6px;
                width: 100%;
                height: 100%;
              }
            }
          }
          /deep/ .el-form-item__label {
            color: #666666;
          }
          .upload_tip {
            /deep/ .el-form-item__content {
              line-height: 20px;
              .error_tip {
                padding-left: 5px;
                color: #F56C6C;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
    .content_right {
      width: 100%;
      height: 100%;
      position: relative;
      #mapBox{
        height: 100%;
        width: 100%;
      }
      .close_btn {
        position: absolute;
        right: 20px;
        top: 20px;
      }
      .right-flag {
        position: absolute; right: 20px; bottom: 0;
        height: 220px;
        transition: right .3s ease-out;
        animation: fadeInRight .4s ease-out .4s both;
        .map-rrt {
          padding: 0 5px;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(148,148,148,0.24);
          >li {
            padding: 15px 10px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            text-align: center;
            >i {
              font-size: 20px;
              color: #0B6FF7;
            }
            &:last-child { border-bottom: 0; }
          }
        }
        .map_rrt_u2 {
          margin-top: 20px;
        }
      }
    }
  }
  .operation-footer {
    border-left: 1px solid #F2F2F2;
    width: 100%;
    height: 65px;
    line-height: 65px;
    position: fixed;
    bottom: 0;
    background: #ffffff;
    padding-left: 20px;
    .operation_btn {
      padding: 0;
      width: 100px;
      height: 40px;
      text-align: center;
    }
    .function_btn {
      background: #0C70F8;
      color: #ffffff;
    }
    .back_btn {
      background: #ffffff;
      border: 1px solid #DDDDDD;
      color: #666666;
    }
  }
  .dialog_comp {
    .content-body {
      p {
        color: #999999;
        margin-bottom: 20px;
        // &::before {
        //   content: '*';
        //   color: #F94539;
        // }
      }
    }
  }
}
</style>


