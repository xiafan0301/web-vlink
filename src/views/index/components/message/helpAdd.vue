<template>
  <div class="mes_help_add">
    <!-- 面包屑 -->
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item @click.native="skip(1)" class="mes_back">民众互助</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageType === 2 ? '新增' : '修改'}}互助</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="help_add_box">
      <div class="add_form">
        <el-form :rules="addRules" ref="addForm" label-position="right" :model="addForm" label-width="82px">
          <el-form-item label="联系电话:" prop="phone">
            <el-input value-key="uid" v-model="addForm.phone" filterable placeholder="请输入联系电话号码"></el-input>
          </el-form-item>
          <el-form-item label="事发时间:" prop="time" class="time">
            <el-date-picker
              placeholder="选择日期时间"
              v-model="addForm.time"
              type="datetime"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
             >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="事发地点:" prop="place">
            <el-autocomplete
              style="width: 450px;"
              v-model="addForm.place"
              :trigger-on-focus="false"
              :fetch-suggestions="autoAdress"
              value-key="name"
              @select="chooseAddress"
              placeholder="请输入事发地点">
            </el-autocomplete>
          </el-form-item>
          <el-form-item style="margin-bottom: 0;">
            <div id="searchResults"></div>
          </el-form-item>
          <el-form-item label="事件情况:" prop="situation">
            <el-input
              maxlength="140"
              type="textarea"
              :rows="4"
              placeholder="请对事发情况进行描述，文字限制140字"
              v-model="addForm.situation">
            </el-input>
          </el-form-item>
          <el-form-item>
            <div is="uploadPic" :fileList="fileList" @uploadPicDel="uploadPicDel" @uploadPicFileList="uploadPicFileList" :maxSize="9" :flag="1"></div>
            <p class="vl_f_999">（只能上传视频或图片，视频最多1个，图片最多9张）</p>
          </el-form-item>
          <el-form-item label="推送消息:">
            <el-radio-group v-model="addForm.radius">
              <el-radio :label="-1">不推送</el-radio>
              <el-radio :label="0" v-if="addForm.radius === -1">推送</el-radio>
              <el-radio :label="addForm.radius" v-if="addForm.radius >= 0">推送</el-radio>
            </el-radio-group>
            <p class="vl_f_999">(APP是否推送消息?）</p>
          </el-form-item>
          <el-form-item label="接收范围:" v-if="addForm.radius !== -1">
            <el-select value-key="uid" v-model="addForm.radius" filterable placeholder="请选择">
              <el-option
                v-for="item in scopeList"
                :key="item.uid"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="add_map">
        <div id="mapBox"></div>
        <div class="map_r">
          <div class="top"><i class="vl_icon vl_icon_control_23" @click="resetZoom"></i></div>
          <ul class="bottom">
            <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
            <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
          </ul>
        </div>
      </div>
      <div class="add_footer">
        <el-button v-if="pageType === 2" class="select_btn btn_100" :loading="loadingBtn" @click="addMutualHelp('addForm')">确定发布</el-button>
        <el-button v-if="pageType === 4" class="select_btn btn_100" :loading="loadingBtn" @click="putMutualHelp('addForm')">确定发布</el-button>
        <el-button @click.native="skip(1)" class="reset_btn btn_100">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import uploadPic from '../control/components/uploadPic';
import {validatePhone} from '@/utils/validator.js';
import {addEvent, updateEvent, getEventDetail} from '@/views/index/api/api.event.js';
import {mapXupuxian} from '@/config/config.js';
import {dataList} from '@/utils/data.js';
export default {
  components: {uploadPic},
  props: ['pageType', 'helpId'],
  data () {
    return {
      type: null,//页面类型
      // 左侧表单参数
      addForm: {
        phone: null,
        time: null,
        place: null,
        situation: null,
        radius: -1,
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      addRules: {
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          { validator: validatePhone, trigger: 'blur' }
        ],
        time: [
          {required: true, message: '请选择事发时间', trigger: 'blur'}
        ],
        place: [
          {required: true, message: '请输入事发地点', trigger: 'blur'}
        ],
        situation: [
          {required: true, message: '请输入事件情况', trigger: 'blur'}
        ]
      },
      scopeList: this.dicFormater(dataList.distanceId)[0].dictList.filter(f => f.enumField !== '-1').map(m => {
        return {
          value: parseInt(m.enumField),
          label: m.enumValue
        }
      }),
      loadingBtn: false,
      hId: null,//民众互助id，用于修改
      // 地图参数
      map: null,
      zoomLevel: 10,
      lngLat: null,//经纬度
      autoComplete: null,
      marker: null,
      // 上传参数
      fileList: []
    }
  },
  mounted () {
    this.resetMap();
  },
  methods: {
    skip (pageType) {
      this.$emit('changePage', pageType)
    },
    // 接收 到上传组件传过来的图片数据
    uploadPicFileList (fileList) {
      this.fileList = fileList;
      console.log(fileList)
    },
    uploadPicDel (fileList) {
      this.fileList = fileList;
      console.log(fileList)
    },
    resetMap () {
      let _this = this;
      let map = new window.AMap.Map('mapBox', {
        zoom: this.zoomLevel,
        center: mapXupuxian.center
      });
      map.setMapStyle('amap://styles/whitesmoke');
      map.plugin('AMap.Autocomplete', () => {
        let autoOptions = {
          city: '溆浦县'
        }
        _this.autoComplete = new window.AMap.Autocomplete(autoOptions);
      })
      map.on('click', function (e) {
        console.log(e, 'eeee')
        new window.AMap.service('AMap.Geocoder',function(){//回调函数
            let geocoder = null;
            //实例化Geocoder
            geocoder = new window.AMap.Geocoder({
                city: ""//城市，默认：“全国”
            });
            var lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];//地图上所标点的坐标
            geocoder.getAddress(lnglatXY, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    //获得了有效的地址信息:
                    //即，result.regeocode.formattedAddress
                    _this.addForm.place = result.regeocode.formattedAddress;
                    _this.$refs['addForm'].clearValidate(['place']);
                    _this.markLocation(e.lnglat.getLng(), e.lnglat.getLat(), _this.addForm.place);

                }else{
                    //获取地址失败
                    _this.$message.error('没有获取到地址');
                }
            });
        })

      })
      _this.map = map;
      // 修改，回填数据
      if (_this.pageType === 4) {
        _this.getMutualHelpDetail();
      }
    },
    autoAdress (queryString, cb) {
      if (queryString === '') {
        cb([])
      } else {
        this.autoComplete.search(queryString, (status, result) => {
          if (status === 'complete') {
            result.tips.forEach(f => {
              f.name = `${f.name}(${f.district})`;
            })
            cb(result.tips);
          } else {
            cb([]);
          }
        })
      }
    },
    chooseAddress (e) {
      console.log(e);
      if (!e.location) {
        this.$message.error('无法获取到经纬度！');
        return;
      }
      this.markLocation(e.location.lng, e.location.lat, e.address);
    },
    // 输入追踪点定位圆形覆盖物的中心点
    markLocation(lng, lat, address) {
      let _this = this;
      if (_this.marker) {
        _this.map.remove(_this.marker);
      }
      _this.lngLat = [lng, lat];
      // 追踪点标记
      let offSet = [-20.5, -48], _hoverWindow = null;
      if (lng > 0 && lat > 0) {
        _this.marker = new window.AMap.Marker({ // 添加自定义点标记
          map: _this.map,
          position: [lng, lat],
          offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          extData: '',
          // 自定义点标记覆盖物内容
          content: '<div class="vl_icon vl_icon_message_7"></div>'
        });
        // hover
        _this.marker.on('mouseover', function () {
          let _sContent = `<div class="vl_map_hover">
            <div class="vl_map_hover_main"><ul>
              <li><span>事发地点：</span><span>${address}</span></li>
            </ul></div>`;
          _hoverWindow = new window.AMap.InfoWindow({
            isCustom: true,
            closeWhenClickMap: true,
            offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
            content: _sContent
          });
          _hoverWindow.open(_this.map, new window.AMap.LngLat(lng, lat));
        });
        _this.marker.on('mouseout', function () {
          if (_hoverWindow) { _hoverWindow.close(); }
        });
        _this.map.setCenter([lng, lat]);
        _this.marker.setMap(_this.map);
      }
    },
    resetZoom () {
      if (this.map) {
        this.map.setZoom(this.zoomLevel);
      }
    },
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    getImageVideoType () {
      if (this.fileList.some(s => s.raw.type === 'video/mp4' || s.raw.type === 'video/bmp')) return 2;
      return 1;
    },
     // 新增民众互助
    addMutualHelp (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('通过验证')
          const data = {
            appendixInfoList: this.fileList.map(m => {
              delete m.response.data.sysAppendixInfo.uid;
              m.response.data.sysAppendixInfo.fileType = this.getImageVideoType();
              return m.response.data.sysAppendixInfo;
            }),//附件信息列表
            eventAddress: this.addForm.place,//事发地点
            eventDetail: this.addForm.situation,//事件详情
            eventSource: 1,//事件来源
            latitude: this.lngLat[1],//事发地点纬度
            longitude: this.lngLat[0],//事发地点经度
            radius: this.addForm.radius,//推送范围
            reportTime: this.addForm.time,//上报时间
            reporterPhone: this.addForm.phone,//上报手机号
            type: 2
          }
          console.log(JSON.stringify(data) )
          this.loadingBtn = true;
          addEvent(data).then(res => {
            if (res && res.data) {
              this.$message.success('发布成功');
              this.$emit('getMutualHelpList'); 
            }
          }).finally(() => {
              this.loadingBtn = false;
            })
        } else {
          return false;
        }
      });
    },
    // 根据id获取民众互助详情,用于回填数据
    getMutualHelpDetail () {
      getEventDetail(this.helpId).then(res => {
        if (res && res.data) {
          const detail = res.data;
          this.addForm.phone = detail.reporterPhone;
          this.addForm.time = detail.reportTime;
          this.addForm.place = detail.eventAddress;
          this.addForm.situation = detail.eventDetail;
          this.lngLat = [detail.longitude, detail.latitude];
          this.hId = detail.uid;
          detail.attachmentList.forEach(f => {
            f.url = f.path;
            delete f.path;
          })
          this.fileList = detail.attachmentList;
          this.addForm.radius = detail.radius;
          this.markLocation(detail.longitude, detail.latitude, detail.eventAddress);
        }
      })
    },
    // 修改民众互助
    putMutualHelp (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('通过验证')
          let _fileList = [];
          this.fileList.forEach(f => {
            if (f.response) {
              delete f.response.data.sysAppendixInfo.uid;
              f.response.data.sysAppendixInfo.fileType = this.getImageVideoType();
              _fileList.push(f.response.data.sysAppendixInfo);
            } else {
              f.path = f.url;
              delete f.url;
              delete f.uid;
              _fileList.push(f);
            }
          })
          const data = {
            addList: _fileList,//附件信息列表
            eventAddress: this.addForm.place,//事发地点
            eventDetail: this.addForm.situation,//事件详情
            eventSource: 1,//事件来源
            latitude: this.lngLat[1],//事发地点纬度
            longitude: this.lngLat[0],//事发地点经度
            radius: this.addForm.radius,//推送范围
            reportTime: this.addForm.time,//上报时间
            reporterPhone: this.addForm.phone,//上报手机号
            uid: this.hId,
            type: 5
          }
          this.loadingBtn = true;
          console.log(data)
          updateEvent(data).then(res => {
            if (res && res.data) {
              this.$message.success('修改成功');
              this.$emit('getMutualHelpList'); 
            }
          }).finally(() => {
              this.loadingBtn = false;
            })
        } else {
          return false;
        }
      });
    },
  },
  destroyed () {
    if (this.map) {
      this.map.destroy();
    }
  },
}
</script>
<style lang="scss" scoped>
.mes_help_add{
  width: 100%;
  position: relative;
  .help_add_box{
    margin: 0 20px 20px 20px;
    background: #fff;
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    display: flex;
    flex-wrap: nowrap;
    .add_form{
      width: 570px;
      height: 100%;
      padding: 20px;
      .el-form{
        width: 100%;
      }
      #searchResults{
        position: absolute;
        z-index: 999;
        overflow: auto;
        height: 400px;
      }
    }
    .add_map{
      height: 816px;
      width: calc(100% - 570px);
      position: relative;
      #mapBox{
        width: 100%;
        height: 100%;
      }
      .map_r{
        width: 78px;
        position: absolute;
        right: 20px;
        bottom: 20px;
        .top, .bottom > li{
          width: 100%;
          height: 70px;
          line-height: 80px;
          background: #fff;
          text-align: center;
          cursor: pointer;
          i{
            margin-top: 15px;
            font-size: 20px;
            color: #999999;
          }
          &:hover{
            i{
              color: #0C70F8;
            }
          }
        }
        .top{
          margin-bottom: 10px;
          p.active{
            color: #0C70F8;
          }
        }
        .top, .bottom{
          box-shadow:4px 0px 15px 0px rgba(131,131,131,0.23),0px 0px 13px 0px rgba(255,255,255,0.55);
        }
        .bottom > li:nth-child(1){
          border-bottom: 1px solid #F1F1F1;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.mes_help_add{
  .time .el-date-editor--datetime{
    width: 450px;
  }
  #mapBox{
    .vl_icon_control_01, .vl_icon_control_30{
      transition: none!important;
    }
  }
  .vl_map_hover_main{
    bottom: 58px;
    li{
      display: flex;
      > span{
        width: auto;
        text-align: left;
        &:nth-child(2){
          flex: 1;
        }
      }
     
    }
  }
}
</style>

