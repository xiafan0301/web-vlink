<template>
  <div class="add_event">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/event/audit' }">受理核实</el-breadcrumb-item>
        <el-breadcrumb-item>新增事件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_box">
      <div class="content-left">
        <div class="content_left_scroll">
          <vue-scroll>
            <div class="content_left">
              <el-form :inline="false" :model="addEventForm" class="add_event_form" :rules="rules" ref="addEventForm">
                <el-form-item label="手机号码:" prop="reporterPhone" label-width="85px">
                  <el-input type="text" style='width: 95%' placeholder="请输入上报人手机号码" v-model="addEventForm.reporterPhone" />
                </el-form-item>
                <el-form-item label="上报时间:" prop="reportTime" label-width="85px">
                  <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :picker-options="pickerOptions0" style='width: 95%' placeholder="选择日期" v-model="addEventForm.reportTime" ></el-date-picker>
                </el-form-item>
                <el-form-item label="事发地点:" prop="eventAddress" label-width="85px">
                  <el-input type="text" id="address" style='width: 95%' placeholder="请输入事发地点"  @input="changeAddress" v-model="addEventForm.eventAddress" />
                </el-form-item>
                <el-form-item label="事件情况:" prop="eventDetail" label-width="85px" class="limit_parent">
                  <!-- <p class="limit_number">(<span style="color: red">{{addEventForm.eventDetail && addEventForm.eventDetail.length || 0}}</span>/140)</p> -->
                  <el-input type="textarea" rows="5" style='width: 95%' placeholder="请对事发情况进行描述，文字限制140字" v-model="addEventForm.eventDetail" />
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
                    :disabled="imgDisabled"
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
                <el-form-item label="伤亡人员:" prop="casualties" label-width="85px">
                  <el-radio-group v-model="addEventForm.casualties" style='width: 230px'>
                    <el-radio label="无"></el-radio>
                    <el-radio label="不确定"></el-radio>
                    <el-radio label="有"></el-radio>
                  </el-radio-group>
                  <template v-if="addEventForm.casualties === '有'">
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
      <div class="content_right">
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
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn function_btn" :loading="isAddHandleLoading" @click="skipHandlePage('addEventForm')">保存并处理</el-button>
      <el-button class="operation_btn function_btn" :loading="isAddLoading" @click="submitData('addEventForm')">保存</el-button>
      <el-button class="operation_btn back_btn" @click="back">返回</el-button>
    </div>
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
import { dataList } from '@/utils/data.js';
import { ajaxCtx } from '@/config/config.js';
import { validatePhone } from '@/utils/validator.js';
import BigImg from '@/components/common/bigImg.vue';
import { addEvent } from '@/views/index/api/api.event.js';
import { getDiciData } from '@/views/index/api/api.js';
import { getDepartmentList } from '@/views/index/api/api.manage.js';
export default {
  components: { BigImg },
  data () {
    return {
      isPlaying: false, // 是否播放视频
      imgIndex: 0, // 点击的图片索引
      isShowImg: false, // 是否放大图片
      isAddHandleLoading: false,
      isAddLoading: false,
      uploadUrl: ajaxCtx.base + '/new', // 图片上传地址
      // isImgNumber: false, // 是否显示图片超过最大数提示
      backDialog: false, // 返回提示弹出框
      imgDisabled: false, // 是否禁用上传按钮
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() > (new Date().getTime());
        }
      },
      addEventForm: {
        eventSource: '1',
        type: 1, // 1---事件  2---互助
        reporterPhone: '', // 报案人  手机号码
        reportTime: '', // 上报时间
        eventAddress: '', // 事发地点
        eventDetail: '', // 事件情况
        eventType: '', // 事件类型
        eventLevel: '', // 事件等级
        casualties: '不确定', // 伤亡人员 --默认不确定
        longitude: '', // 经度
        latitude: '', // 纬度
        dealOrgId: '', // 处理单位
        // radius: -1, // 是否推送
        appendixInfoList: [], // 图片文件
      },
      rules: {
        reporterPhone:[
          { required: true, message: '请输入上报人手机号码', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur'}
        ],
        reportTime:[
          { required: true, message: '请选择上报时间', trigger: 'blur' }
        ],
        eventAddress:[
          { required: true, message: '请输入事发地点', trigger: 'blur' }
        ],
        eventDetail:[
          { required: true, message: '请输入事情情况', trigger: 'blur' },
          { max: 140, message: '最多可以输入140个字' }
        ],
        eventType:[
          { required: true, message: '请选择事件类型', trigger: 'blur' }
        ],
        dealOrgId:[
          { required: true, message: '请选择处理单位', trigger: 'blur' }
        ]
      },
      map: null, // 地图对象
      dieNumber: null, // 死亡人数
      isDieError: false,
      dieTip: '死亡人数只能为正整数',
      eventLevelList: [], // 事件等级列表数据
      eventTypeList: [], // 事件类型列表数据
      handleUnitList: [], // 处理单位列表数据
      userInfo: {}, // 存储的用户信息
      uploadImgList: [], // 要上传的图片列表
      uplaodVideoList: [], // 要上传的视频列表
      imgList1: [], // 要放大的图片
      isShowErrorTip: false, // 是否显示图片上传错误提示
      errorText: null, // 图片上传错误提示
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
  },
  mounted () {
    this.dataStr = JSON.stringify(this.addEventForm); // 将初始数据转成字符串
    this.initMap();
  },
  methods: {
    // 初始化地图
    initMap () {
      let _this = this;
      // _this.resetMap();
      let map = new window.AMap.Map('mapBox', {
        zoom: 16, // 级别
        center: [110.596015, 27.907662], // 中心点坐标[110.596015, 27.907662]
      });
      map.setMapStyle('amap://styles/whitesmoke');
      map.on('click', function(e) {
        _this.addEventForm.longitude = e.lnglat.getLng();
        _this.addEventForm.latitude = e.lnglat.getLat();
        
        new window.AMap.service('AMap.Geocoder', function () { // 回调函数
          let geocoder = null;
          geocoder = new window.AMap.Geocoder({});

          const lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];//地图上所标点的坐标

          geocoder.getAddress(lnglatXY, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              _this.addEventForm.eventAddress = result.regeocode.formattedAddress;
              _this.mapMark(e.lnglat.getLng(), e.lnglat.getLat(), _this.addEventForm.eventAddress);
            }
          });
        });
      });
      _this.map = map;
    },
    // 地图标记
    mapMark (longitude, latitude, eventAddress) {
      let _this = this;
      if (_this.newMarker) {
        _this.map.remove(_this.newMarker);
        _this.newMarker = null;
      }
      let hoverWindow = null, offSet = [-20.5, -48];
      if (longitude > 0 && latitude > 0) {
        _this.newMarker = new window.AMap.Marker({ // 添加自定义点标记
          map: _this.map,
          position: [longitude, latitude],
          offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
          extData: '',
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: '<div class="vl_icon vl_icon_control_30"></div>'
        });
        _this.newMarker.on('mouseover', function () {
          let sContent = '<div class="vl_map_hover" >' +
            '<div class="vl_main_hover_address" style="min-width: 300px;padding: 15px"><p class="vl_map_hover_main_p">事发地点： ' + eventAddress + '</p></div></div>';
          hoverWindow = new window.AMap.InfoWindow({
            isCustom: true,
            closeWhenClickMap: true,
            offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
            content: sContent
          });
          hoverWindow.open(_this.map, new window.AMap.LngLat(longitude, latitude));
        });
        _this.newMarker.on('mouseout', function () {
          if (hoverWindow) { hoverWindow.close(); }
        });
        _this.map.setCenter([longitude, latitude]);
        _this.newMarker.setMap(_this.map);
      }
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
    // 重置地图
    resetMap () {
      this.initMap();
    },
    // 事件地址change
    changeAddress () {
      let _this = this;
      let autoInput = new window.AMap.Autocomplete({
        input: 'address'
      })
      window.AMap.event.addListener(autoInput, 'select', function (e) {
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
    // 地图放大缩小
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    handleBeforeUpload (file) { // 图片上传之前
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
      if (this.isShowErrorTip) {
        return;
      }
      return isPng && isLtTenM;
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
      if (this.isShowErrorTip) {
        return false;
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
                thumbnailPath: res.data.thumbnailFileFullPath
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
                thumbnailPath: res.data.thumbnailFileFullPath
              }
              this.uplaodVideoList.push(data);
            }
          }
        }
      }
    },
    // 保存提交数据
    submitData (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.addEventForm.appendixInfoList = [];
          let reg = /^[1-9]\d*$/; // 校验死亡人数
          if (this.addEventForm.casualties === '无') {
            this.addEventForm.casualties = 0;
          } else if (this.addEventForm.casualties === '不确定') {
            this.addEventForm.casualties = -1;
          } else if (this.addEventForm.casualties === '有') {
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
            this.addEventForm.appendixInfoList.push(item);
          });
          this.uplaodVideoList.map(item => {
            this.addEventForm.appendixInfoList.push(item);
          });
          this.isAddLoading = true;
          addEvent(this.addEventForm)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '保存成功',
                  customClass: 'request_tip'
                })
                this.$router.push({name: 'event_audit'});
                this.isAddLoading = false;
              } 
              else {
                this.isAddLoading = false;
              }
            })
            .catch(() => {this.isAddLoading = false;})
        }
      })
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
    // 保存并处理
    skipHandlePage (form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.addEventForm.appendixInfoList = [];
          let reg =/^[1-9]\d*$/; // 校验死亡人数
          if (this.addEventForm.casualties === '无') {
            this.addEventForm.casualties = 0;
          } else if (this.addEventForm.casualties === '不确定') {
            this.addEventForm.casualties = -1;
          } else if (this.addEventForm.casualties === '有') {
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
          // if (this.uploadImgList.length > 0 && this.uplaodVideoList.length > 0) {
          //   this.$message({
          //     type: 'warning',
          //     message: '图片和视频只能上传一种',
          //     customClass: 'request_tip'
          //   });
          //   return;
          // } else if (this.uploadImgList.length > 9 || this.uplaodVideoList.length > 1) {
          //   this.$message({
          //     type: 'warning',
          //     message: '最多上传1个视频或9张图片',
          //     customClass: 'request_tip'
          //   });
          //   return;
          // }
          if (this.isShowErrorTip) { // 上传错误提示
            return;
          }
          this.uploadImgList.map(item => {
            this.addEventForm.appendixInfoList.push(item);
          });
          this.uplaodVideoList.map(item => {
            this.addEventForm.appendixInfoList.push(item);
          });
          this.isAddHandleLoading = true;
          addEvent(this.addEventForm)
            .then(res => {
              if (res) {
                this.isAddHandleLoading = false;
                this.$router.push({name: 'untreat_event_detail', query: {status: 'unhandle', eventId: res.data}});
              } 
              else {
                this.isAddHandleLoading = false;
              }
            })
            .catch(() => {this.isAddHandleLoading = false;})
        }
      })
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

<style lang="scss" scoped>
.add_event {
  width: 100%;
  height: 100%;
  .content_box {
    width: 98%;
    margin: 10px 20px;
    height: calc(100% - 50px - 100px);
    display: flex;
    .content_left_scroll {
      width: 500px;
      height: 100%;
      background: #ffffff;
      /deep/ .__view {
        width: 100% !important;
      }
      .content_left {
        width: 96%;
        margin: 20px 0 0 2%;
        .add_event_form {
          // width: 100%;
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
            .upload_tip {
            margin-left: 85px;
            // /deep/ .el-form-item__content {
              // line-height: 20px;
              .error_tip {
                padding-left: 5px;
                color: #F56C6C;
                font-size: 12px;
              }
            // }
          }
          }
          .limit_parent {
            position: relative;
            .limit_number {
              position: absolute;
              left: -70px;
              top: 25px;
            }
          }
          
        }
      }
    }
    .content_right {
      width: 100%;
      height: 100%;
      #mapBox {
        width: 100%;
        height: 100%;
      }
      .right-flag {
        position: absolute; right: 40px; bottom: 100px;
        height: 220px;
        transition: right .3s ease-out;
        animation: fadeInRight .4s ease-out .4s both;
        .map-rrt {
          padding: 0 10px;
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
}
</style>
