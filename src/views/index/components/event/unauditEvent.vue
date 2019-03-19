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
                <li>
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
                <el-form-item label="事发地点:" label-width="85px" prop="eventAddress">
                  <el-input type="text" style='width: 95%' placeholder="请输入事发地点" id="address" v-model="addEventForm.eventAddress" @input="changeAddress" />
                </el-form-item>
                <el-form-item label="事件情况:" label-width="85px" prop="eventDetail">
                  <el-input type="textarea" rows="5" style='width: 95%' placeholder="请对事发情况进行描述，文字限制140字" v-model="addEventForm.eventDetail" />
                </el-form-item>
                <el-form-item label-width="85px" class="img-form-item">
                  <el-upload
                    :action="uploadUrl"
                    list-type="picture-card"
                    accept=".png,.jpg,.jpeg"
                    :limit='9'
                    :before-upload='handleBeforeUpload'
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success='handleSuccess'
                    :on-exceed="handleImgNumber"
                  >
                    <i class="el-icon-plus"></i>
                    <span class='add-img-text'>添加</span>
                    <span class="imgTips" v-show="isImgNumber">图片最多上传9张</span>
                  </el-upload>
                </el-form-item>
                <el-form-item label-width="85px">
                  <div style="color: #999999;">（最多传9张 支持JPEG、JPG、PNG、文件，大小不超过2M）</div>
                </el-form-item>
                <el-form-item  label="处理单位:" prop="dealOrgId" label-width="85px">
                  <el-select v-model="addEventForm.dealOrgId" style='width: 95%'>
                    <el-option
                      v-for="(item, index) in handleUnitList"
                      :key="index"
                      :label="item.enumValue"
                      :value="index"
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
                      :value="item.uid"
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
                      :value="item.uid"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="伤亡人员:" prop="casualtiesFlag" label-width="85px">
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
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn function_btn" @click="submitData('addEventForm')">通过</el-button>
      <el-button class="operation_btn back_btn" @click="showRejectDialog">驳回</el-button>
      <el-button class="operation_btn back_btn" @click="back">返回</el-button>
    </div>
    <el-dialog
      title="驳回"
      :visible.sync="rejectDialogVisible"
      width="482px"
      class="dialog_comp"
      >
      <div class="content-body">
        <p>请输入驳回的原因。</p>
        <el-input v-model="rejectReason" type="textarea" rows="6" placeholder="请简要描述驳回的原因。140字"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rejectDialogVisible = false">取 消</el-button>
        <el-button class="operation_btn function_btn" @click="rejectEvent">确 定</el-button>
      </div>
    </el-dialog>  
  </div>
</template>
<script>
import { dataList } from '@/utils/data.js';
import { ajaxCtx } from '@/config/config.js';
import { getEventDetail, updateEvent, getDiciData } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      uploadUrl: ajaxCtx.upload + '/new', // 图片上传地址
      rejectDialogVisible: false, // 驳回弹出框
      isImgNumber: false,
      newMarker: null,
      addEventForm: {},
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
      rejectReason: null, // 驳回理由
      map: null,
      dieNumber: null, // 死亡人数
      isDieError: false,
      dieTip: '死亡人数只能为正整数',
      eventLevelList: [], // 事件等级列表数据
      eventTypeList: [], // 事件类型列表数据
      handleUnitList: [], // 处理单位列表数据
    }
  },
  created () {
    this.getEventLevelList();
    this.getHandleUnit();
    this.getEventTypeList();
  },
  mounted () {
    this.getDetail();
    this.initMap();
  },
  methods: {
    // 获取处理单位
    getHandleUnit () {
      const handleUnit = dataList.handleUnit;
      getDiciData(handleUnit)
        .then(res => {
          if (res) {
            this.handleUnitList = res.data;
          }
        })
        .catch(() => {})
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
            console.log(res);
            this.addEventForm = JSON.parse(JSON.stringify(res.data));
            if (res.data.casualties === -1) {
                this.addEventForm.casualties = '不确定';
              } else if (res.data.casualties === 0) {
                this.addEventForm.casualties = '无';
              } else if (res.data.casualties > 0) {
                this.addEventForm.casualties = '有';
                this.dieNumber = res.data.casualties;
              }
            this.mapMark(this.addEventForm);
          }
        })
        .catch(() => {})
    },
    initMap () {
      let _this = this;
      _this.resetMap();
      let map = new window.AMap.Map('mapBox', {
        zoom: 16, // 级别
        center: [110.596015, 27.907662], // 中心点坐标[110.596015, 27.907662]
      });
      map.setMapStyle('amap://styles/whitesmoke');
      _this.map = map;
      map.on('click', function(e) {
        console.log(e);  
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
      console.log(_this.map);
      
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
      }
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
    // 在图片上传之前
    handleBeforeUpload (file) {
      console.log(file)
    },
    handlePictureCardPreview () {},
    handleRemove () {},
    // 图片上传成功
    handleSuccess (res) {
      const data = {
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
      this.addEventForm.attachmentList.push(data);
    },
    // 图片数量超出最大值限制
    handleImgNumber () {
      this.isImgNumber = true;
    },
    // 显示驳回弹出框
    showRejectDialog () {
      this.rejectDialogVisible = true;
    },
    // 驳回
    rejectEvent () {
      const params = {
        eventId: this.addEventForm.uid,
        closeRemark: this.rejectReason
      }
      updateEvent(params)
        .then(res => {
          if (res) {
            this.$message({
              type: 'success',
              message: '驳回成功',
              customClass: 'request_tip'
            })
            this.$router.push({name: 'event_audit'});
            this.rejectDialogVisible = false;
          } else {
            this.$message({
              type: 'error',
              message: '驳回失败',
              customClass: 'request_tip'
            })
          }
        })
        .catch(() => {})
    },
    // 处理要提交的数据
    handleFormData () {
      let reg = /^([1-9]\d*|0)(\.\d*[1-9])?$/; // 校验死亡人数
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
    },
    submitData (form) { // 审核通过
      this.$refs[form].validate(valid => {
        if (valid) {
          this.handleFormData();
          updateEvent(this.addEventForm)
            .then(res => {
              if (res) {
                this.$message({
                  type: 'success',
                  message: '保存成功',
                  customClass: 'request_tip'
                })
                this.$router.push({name: 'event_audit'});
              } else {
                this.$message({
                  type: 'error',
                  message: '保存失败',
                  customClass: 'request_tip'
                })
              }
            })
            .catch(() => {})
        }
      })
    },
    // 返回
    back () {
      this.$router.back(-1);
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
          width: 100%;
          /deep/ .el-form-item {
            margin-bottom: 20px;
          }
          .imgTips {
            width: 160px;
            border-radius: 2px;
            position: absolute;
            color: #F94539;
            padding-top: 0;
            -ms-flex-item-align: center;
            align-self: center;
            left: 90px;
            top: 35px;
          }
          .img-form-item /deep/ .el-form-item__content{
            display: flex;
            .img-list {
              width: 104px;
              height: 104px;
              margin-left: 10px;
              margin-bottom: 10px;
              display: flex;
              .error-item {
                position: absolute;
                top: -10px;
                right: -8px;
                font-size: 18px;
                color: #666;
                z-index: 1;
              }
            }
          }
          /deep/ .el-form-item__label {
            color: #666666;
          }
        }
      }
    }
    .content_right {
      width: 100%;
      height: 100%;
      #mapBox{
        height: 100%;
        width: 100%;
      }
      .right-flag {
        position: absolute; right: 40px; bottom: 100px;
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
        &::before {
          content: '*';
          color: #F94539;
        }
      }
    }
  }
}
</style>


