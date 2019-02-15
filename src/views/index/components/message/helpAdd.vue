<template>
  <div class="mes_help_add">
    <!-- 面包屑 -->
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item @click.native="skip(1)">民众互助</el-breadcrumb-item>
        <el-breadcrumb-item>新增互助</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="help_add_box">
      <div class="add_form">
        <el-form :rules="addRules" ref="addForm" label-position="right" :model="addForm" label-width="82px">
          <el-form-item label="联系电话:" prop="phone">
            <el-input value-key="uid" v-model="addForm.phone" filterable placeholder="请选择"></el-input>
          </el-form-item>
          <el-form-item label="上报时间:" prop="time" class="time">
            <el-date-picker
              placeholder="创建时间"
              v-model="addForm.time"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="事发地点:" prop="place">
            <el-input v-model="addForm.place" placeholder="请输入事发地点"></el-input>
          </el-form-item>
          <el-form-item label="事件情况:" prop="situation">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请对事发情况进行描述，文字限制140字"
              v-model="addForm.situation">
            </el-input>
          </el-form-item>
          <el-form-item>
            <div is="uploadPic" @uploadPicSubmit="uploadPicSubmit" :maxSize="9"></div>
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
          <div class="top"><i class="vl_icon vl_icon_control_23"></i></div>
          <ul class="bottom">
            <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
            <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
          </ul>
        </div>
      </div>
      <div class="add_footer">
        <el-button type="primary">确定发布</el-button>
        <el-button>返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import uploadPic from '../control/uploadPic';
import {conData} from '../control/testData.js';
import {random14} from '../../../../utils/util.js';
export default {
  components: {uploadPic},
  data () {
    return {
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
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        time: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        place: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ],
        situation: [
          {required: true, message: '不能为空', trigger: 'blur'}
        ]
      },
      scopeList: [],
      // 地图参数
      map: null,
    }
  },
  mounted () {
    let _this = this;
    _this.controlState = _this.$route.query.state;
    let map = new window.AMap.Map('mapBox', {
      zoom: 16, // 级别
      center: [112.980377, 28.100175], // 中心点坐标112.980377,28.100175
      // viewMode: '3D' // 使用3D视图
    });
    map.setMapStyle('amap://styles/whitesmoke');
    this.map = map;
    this.mapMark();
  },
  methods: {
    skip (pageType) {
      this.$emit('changePage', pageType)
    },
    // 接收 到上传组件传过来的图片数据
    uploadPicSubmit () {
      
    },
    mapMark () {
      let _this = this, hoverWindow = null;
      let data = conData;
      console.log(data, 'data')
      _this.map.clearMap();
      for (let i = 0; i < data.length; i++) {
        let obj = data[i];
        obj.sid = obj.name + '_' + i + '_' + random14();
        if (obj.longitude > 0 && obj.latitude > 0) {
          let offSet = [-20.5, -48];
          let marker = new window.AMap.Marker({ // 添加自定义点标记
            map: _this.map,
            position: [obj.longitude, obj.latitude],
            offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: '<div id="' + obj.sid + '" class="vl_icon vl_icon_control_01"></div>'
          });
          // hover
          marker.on('mouseover', function (e) {
            // hover切换图标
            $('#mapBox .vl_icon_control_30').addClass("vl_icon_control_01");
            $('#mapBox .vl_icon_control_30').removeClass("vl_icon_control_30");
            $('#' + e.target.C.extData.sid).addClass("vl_icon_control_30");
            $('#' + e.target.C.extData.sid).removeClass("vl_icon_control_01");
            let sContent = '<div class="vl_map_hover">' +
              '<div class="vl_map_hover_main"><ul>' + 
                '<li><span>事发地点：</span>' + obj.name + '</li>' + 
              '</ul></div>';
            hoverWindow = new window.AMap.InfoWindow({
              isCustom: true,
              closeWhenClickMap: true,
              offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
              content: sContent
            });
            hoverWindow.open(_this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
            hoverWindow.on('close', function () {
              // console.log('infoWindow close')
            });
          });
          marker.on('mouseout', function () {
            if (hoverWindow) { hoverWindow.close(); }
          });
          marker.setMap(_this.map);
        
        }
      }
    },
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
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
  .time .el-date-editor--datetimerange{
    width: 450px;
  }
  #mapBox{
    .vl_icon_control_01, .vl_icon_control_30{
      transition: none!important;
    }
  }
}
</style>

