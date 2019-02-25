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
            <el-input value-key="uid" v-model="addForm.phone" filterable placeholder="请选择"></el-input>
          </el-form-item>
          <el-form-item label="事发时间:" prop="time" class="time">
            <el-date-picker
              placeholder="选择日期时间"
              v-model="addForm.time"
              type="datetime"
             >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="事发地点:" prop="place">
            <el-input id="searchInput" v-model="addForm.place" placeholder="请输入事发地点" @keyup.enter.native="markLocation('mapBox', addForm.place)"></el-input>
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
            <div is="uploadPic" @uploadPicSubmit="uploadPicSubmit" @uploadPicFileList="uploadPicFileList" :maxSize="9"></div>
            <p class="vl_f_999">(最多传9张 支持JPEG、JPG、PNG、文件，大小不超过2M）</p>
          </el-form-item>
          <el-form-item label="推送消息:">
            <el-radio-group v-model="addForm.radio">
              <el-radio :label="1">不推送</el-radio>
              <el-radio :label="2">推送</el-radio>
            </el-radio-group>
            <p class="vl_f_999">(APP是否推送消息?）</p>
          </el-form-item>
          <el-form-item label="接收范围:">
            <el-select value-key="uid" v-model="addForm.scope" filterable placeholder="请选择">
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
          <div class="top"><i class="vl_icon vl_icon_control_23" @click="resetMap"></i></div>
          <ul class="bottom">
            <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
            <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
          </ul>
        </div>
      </div>
      <div class="add_footer">
        <el-button type="primary" @click="release('addForm')">确定发布</el-button>
        <el-button @click.native="skip(1)">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import uploadPic from '../control/components/uploadPic';
import {validatePhone} from '@/utils/validator.js';
export default {
  components: {uploadPic},
  props: ['pageType'],
  data () {
    return {
      type: null,//页面类型
      // 左侧表单参数
      addForm: {
        phone: null,
        time: null,
        place: null,
        situation: null,
        radio: 1,
        scope: null
      },
      addRules: {
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          { validator: validatePhone, trigger: 'blur' }
        ],
        time: [
          {required: true, message: '请选择上报时间', trigger: 'blur'}
        ],
        place: [
          {required: true, message: '请输入事发地点', trigger: 'blur'}
        ],
        situation: [
          {required: true, message: '请输入事件情况', trigger: 'blur'}
        ]
      },
      scopeList: [],
      // 地图参数
      map: null,
      // 上传参数
      fileList: []
    }
  },
  mounted () {
    this.resetMap();
    this.search();
  },
  methods: {
    skip (pageType) {
      this.$emit('changePage', pageType)
    },
    // 接收 到上传组件传过来的图片数据
    uploadPicSubmit (file) {
      console.log(file);
    },
    uploadPicFileList (fileList) {
      this.fileList = fileList;
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
    // 输入追踪点定位圆形覆盖物的中心点
    markLocation(mapId, address) {
      let _this = this;
      new window.AMap.plugin('AMap.Geocoder', function() {
          let geocoder = new window.AMap.Geocoder(); 
          console.log(address)           
          geocoder.getLocation(address, function(status, result) {
            if (status === 'complete' && result.info === 'OK') { 
              // 经纬度                      
              let lng = result.geocodes[0].location.lng;
              let lat = result.geocodes[0].location.lat;
              // 追踪点标记
              let offSet = [-20.5, -48], _hoverWindow = null;
              if (lng > 0 && lat > 0) {
                let _marker = new window.AMap.Marker({ // 添加自定义点标记
                  map: _this.map,
                  position: [lng, lat],
                  offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
                  draggable: false, // 是否可拖动
                  extData: '',
                  // 自定义点标记覆盖物内容
                  content: '<div class="vl_icon vl_icon_message_7"></div>'
                });
                // hover
                _marker.on('mouseover', function () {
                  let _sContent = '<div class="vl_map_hover">' +
                    '<div class="vl_map_hover_main"><ul>' + 
                      '<li><span>事发地点：</span>' + address + '</li>' + 
                    '</ul></div>';
                  _hoverWindow = new window.AMap.InfoWindow({
                    isCustom: true,
                    closeWhenClickMap: true,
                    offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
                    content: _sContent
                  });
                  _hoverWindow.open(_this.map, new window.AMap.LngLat(lng, lat));
                });
                _marker.on('mouseout', function () {
                  if (_hoverWindow) { _hoverWindow.close(); }
                });
                _marker.setMap(_this.map);
              }
            } else {
              console.log('定位失败！');
              _this.$message.error('定位失败！');
            }
          });
      });
    },
  
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    // 确定发布
    release (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addForm.time.getTime() < new Date().getTime()) {
            this.$message.error('事发时间不能晚于当前系统时间！');
            return false;
          }
          if (this.fileList.length === 0) {
            this.$message.error('请上传图片！');
            return false;
          }
          console.log('通过验证')
        } else {
          console.log(this.addForm.time.getTime())
          return false;
        }
      });
    },
    // 搜索事发地点
    search () {
      let _this = this;
        new Window.AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {

          var poiPicker = new PoiPicker({
              input: 'searchInput',
              placeSearchOptions: {
                  map: _this.map,
                  pageSize: 10
              },
              searchResultsContainer: 'searchResults'
          });

          poiPicker.on('poiPicked', function(poiResult) {
                console.log(poiResult)
                _this.addForm.place = poiResult.item.name;
              poiPicker.hideSearchResults();

              var source = poiResult.source,
                  poi = poiResult.item;

              if (source !== 'search') {

                  //suggest来源的，同样调用搜索
                  poiPicker.searchByKeyword(poi.name);

              } else {

                  //console.log(poi);
              }
          });

          poiPicker.onCityReady(function() {
              poiPicker.searchByKeyword('');
          });
      });
    }
  }
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
}
</style>

