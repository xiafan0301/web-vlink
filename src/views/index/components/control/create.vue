<template>
  <div class="control_create">
    <!-- 面包屑 -->
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>布控</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'control_manage' }">布控管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑布控</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="create_box">
      <div class="create_num"><span class="vl_f_666">布控编号：</span><span class="vl_f_333">b19344985</span></div>
      <div class="create_content">
        <el-form ref="createForm" :label-position="labelPosition" :model="createForm" class="create_form">
          <el-form-item class="create_form_one">
            <el-form-item label="布控名称:" prop="controlName" style="width: 25%;">
              <el-input v-model="createForm.controlName"></el-input>
            </el-form-item>
            <el-form-item label="关联事件:" prop="event" style="width: 25%;">
              <el-input v-model="createForm.event"></el-input>
            </el-form-item>
            <el-form-item label="布控类型:" prop="controlType" style="width: 25%;">
              <el-select value-key="uid" v-model="createForm.controlType" filterable placeholder="请选择">
                <el-option
                  v-for="item in controlTypeList"
                  :key="item.uid"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="布控日期:" prop="controlDate" style="width: 25%;">
              <el-date-picker
                style="width: 192px;"
                v-model="createForm.controlDate"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <div v-for="(item, index) in createForm.periodTime" :key="index" style="width: 25%;" class="period_time">
              <el-form-item :label="index === 0 ? '布控时间段（可分时段布控,最多可设置5个时间段）' : ''" :prop="'periodTime.' + index + '.startTime'" :rules="{ required: true, message: '起始时间不能为空', trigger: 'blur'}" >
                <el-time-select
                  placeholder="起始时间"
                  v-model="item.startTime"
                  :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30'
                  }">
                </el-time-select>
              </el-form-item>
              <span class="vl_f_666">-</span>
              <el-form-item :prop="'periodTime.' + index + '.endTime'" :rules="{ required: true, message: '结束时间不能为空', trigger: 'blur'}" >
                <el-time-select
                  placeholder="结束时间"
                  v-model="item.endTime"
                  :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30',
                    minTime: item.startTime
                  }">
                </el-time-select>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item class="period_time_btn_box">
            <div class="period_time_btn" @click="addPeriodTime()"><i></i><span>添加布控时间段</span></div>
            <div class="period_time_btn" @click="removeDomain()"><i></i><span>删除布控时间段</span></div>
          </el-form-item>
          <el-form-item label="告警级别（在地图上显示颜色 ）:" prop="controlRank" style="width: 25%;">
            <el-select value-key="uid" v-model="createForm.controlRank" filterable placeholder="请选择">
              <el-option
                v-for="item in controlRankList"
                :key="item.uid"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="create_model">
            <span class="vl_f_666">分析模型：</span>
            <div class="create_model_box">
              <div class="model_checkbox">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox label="人员追踪"></el-checkbox>
                  <el-checkbox label="车辆追踪"></el-checkbox>
                  <el-checkbox label="越界分析"></el-checkbox>
                  <el-checkbox label="范围分析"></el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <!-- 图片上传 -->
            <el-form-item label="人员图片:" prop="personnelPic" style="width: 25%;">
              <div is="uploadPic" @uploadPicSubmit="uploadPicSubmit"></div>
              <div class="pic_format">
                <div>从库中选择</div>
                <div class="vl_f_999">（支持JPEG、JPG、PNG、每张大小不超过2M）</div>
              </div>
            </el-form-item>
            <el-form-item label="追踪点1:" :prop="'periodTime.' + index + '.point'" :rules="{ required: true, message: '起始时间不能为空', trigger: 'blur'}" v-for="(item, index) in createForm.periodTime" :key="index" style="width: 50%;" class="point">
              <el-input v-model="createForm.point"></el-input><i class="el-icon-delete"></i>
            </el-form-item>
            <el-form-item style="width: 50%;">
              <div class="add_point"><i class="el-icon-plus"></i>添加追踪点</div>
            </el-form-item>
          </div>
        </el-form>
        <div class="manage_d_s_m">
          <div id="mapBox"></div>
          <div class="manage_d_s_m_l">
            <div style="height: 130px;padding: 20px 20px;">
              <el-input placeholder="请输入范围半径值（单位千米）" style="width: 220px;margin-bottom: 10px;"></el-input>
              <el-select value-key="uid" v-model="features" filterable placeholder="选择设备特性" style="width: 220px;">
                <el-option
                  v-for="item in featuresTypeList"
                  :key="item.uid"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div style="height: 617px;">
              <div class="vl_f_333 top">
                <span>已选设备(12)</span>
                <i class="el-icon-setting" style="float: right;cursor: pointer;"></i>
              </div>
              <div class="dp_box">
                <div v-for="trackPoint in trackPointList" :key="trackPoint.tid">
                  <div class="track_t" @click="dropdown(trackPoint)" :class="{'active': trackPoint.isDropdown}">
                    <i class="el-icon-arrow-down" v-show="trackPoint.isDropdown"></i><i class="el-icon-arrow-right" v-show="!trackPoint.isDropdown"></i><span>{{trackPoint.trackPointName}}</span>
                  </div>
                  <el-collapse-transition>
                    <div v-show="trackPoint.isDropdown">
                      <div class="equ_m">
                        <div @click="getEquList('0', trackPoint)" :class="{'active': tid === trackPoint.tid && type === '0'}">摄像头</div>
                        <div @click="getEquList('1', trackPoint)" :class="{'active': tid === trackPoint.tid && type === '1'}">卡口</div>
                      </div>
                      <ul v-if="type === '0'">
                        <li v-for="equ in trackPoint.sxt" :key="equ.sid" @click="eid = equ.sid" :class="{'active': eid === equ.sid}">
                          <span>{{equ.sxtName}}<br/><span class="vl_f_666">距追踪点001 <span style="color: orange;">1.4km</span></span></span>
                          <div><i class="vl_icon vl_icon_camera"></i><i class="el-icon-delete"></i></div>
                        </li>
                      </ul>
                      <ul v-else>
                        <li v-for="equ in equList" :key="equ.kid" @click="eid = equ.kid" :class="{'active': eid === equ.kid}">
                          <span>{{equ.kName}}<br/><span class="vl_f_666">距追踪点001 <span style="color: orange;">1.4km</span></span></span>
                          <div><i class="vl_icon vl_icon_camera"></i><i class="el-icon-delete"></i></div>
                        </li>
                      </ul>
                    </div>
                  </el-collapse-transition>
                </div>
              </div>
            </div>
          </div>
          <div class="manage_d_s_m_r">
            <div class="top"><i class="el-icon-plus"></i></div>
            <ul class="bottom">
              <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
              <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import uploadPic from '@/components/uploadPic.vue';
import {conData} from './testData.js';
import {random14} from '../../../../utils/util.js';
export default {
  components: {uploadPic},
  data () {
    return {
      // 表单参数
      labelPosition: 'top',
      controlTypeList: [],//布控类型
      controlRankList: [],//告警类型
      createForm: {
        controlName: null,
        event: null,
        controlType: null,
        controlDate: null,
        controlRank: null,
        point: null,
        periodTime: [
          {
            startTime: null,
            endTime: null
          }
        ]
      },
      // 分析模型数据
      checkList: ['人员追踪','越界分析'],
      // 地图数据
      map: null,
      // 追踪点列表数据
      trackPointList: [
        {tid: '0', trackPointName: '追踪点001:长沙市天心区创谷广告产业园B3栋', 
          sxt: [
            {sid: '0', sxtName: '摄像头001'},
            {sid: '1', sxtName: '摄像头002'},
            {sid: '2', sxtName: '摄像头003'},
            {sid: '3', sxtName: '摄像头004'},
            {sid: '4', sxtName: '摄像头005'},
            {sid: '5', sxtName: '摄像头006'},
            {sid: '6', sxtName: '摄像头007'},
            {sid: '7', sxtName: '摄像头008'}
          ],
          kk: [
            {kid: '01', kName: '卡口0011'},
            {kid: '11', kName: '卡口0021'},
            {kid: '21', kName: '卡口0031'},
            {kid: '31', kName: '卡口0041'},
            {kid: '41', kName: '卡口0051'},
            {kid: '51', kName: '卡口0061'},
            {kid: '61', kName: '卡口0071'},
            {kid: '71', kName: '卡口0081'}
          ]
        },
        {tid: '1', trackPointName: '追踪点002:长沙市天心区创谷广告产业园B4栋', 
          sxt: [
            {sid: '8', sxtName: '摄像头0011'},
            {sid: '9', sxtName: '摄像头0021'},
            {sid: '10', sxtName: '摄像头0031'},
            {sid: '11', sxtName: '摄像头0041'},
            {sid: '12', sxtName: '摄像头0051'},
            {sid: '13', sxtName: '摄像头0061'},
            {sid: '14', sxtName: '摄像头0071'},
            {sid: '15', sxtName: '摄像头0081'}
          ],
          kk: [
            {kid: '81', kName: '卡口001'},
            {kid: '91', kName: '卡口002'},
            {kid: '101', kName: '卡口003'},
            {kid: '111', kName: '卡口004'},
            {kid: '121', kName: '卡口005'},
            {kid: '131', kName: '卡口006'},
            {kid: '141', kName: '卡口007'},
            {kid: '151', kName: '卡口008'}
          ]
        }
      ],
      equList: [], //设备列表
      type: '0',// 设备类型
      tid: null,//追踪点列表id
      eid: null,//设备列表id
      dpType: null,//展开类型
      features: null,//设备特性
      featuresTypeList: null,//设备特性列表
    }
  },
  mounted () {
    let _this = this;
    let map = new window.AMap.Map('mapBox', {
      zoom: 16, // 级别
      center: [112.980377, 28.100175], // 中心点坐标112.980377,28.100175
      // viewMode: '3D' // 使用3D视图
    });
    map.setMapStyle('amap://styles/whitesmoke');
    this.map = map;

    this.trackPointList.map(f => {
      this.$set(f, 'isDropdown', false);
    })
    this.mapMark();
  },
  methods: {
    // 新增时间段
    addPeriodTime() {
      this.createForm.periodTime.push({
        startTime: null,
        endTime: null
      });
    },
    // 删除时间段
    removeDomain(item) {
      this.createForm.periodTime.splice(this.createForm.periodTime.length - 1, 1)
    },
    // 接收到上传组件传过来的图片数据
    uploadPicSubmit (aUploadImg) {
      
    },
    // 切换设备类型获得设备列表数据
    getEquList (type, data) {
      this.type = type;
      this.tid = data.tid;
      if (type === '1') {
        this.equList = data.kk;
      }
    },
    // 展开或者闭合设备列表
    dropdown (data) {
      this.trackPointList.map(f => {
        if (data.tid === f.tid) {
          f.isDropdown = !f.isDropdown;
        } else {
          f.isDropdown = false;
        }
        this.getEquList('0', data);
      })
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
          let offSet = [-20.5, -48], selClass = '';
          let marker = new window.AMap.Marker({ // 添加自定义点标记
            map: _this.map,
            position: [obj.longitude, obj.latitude],
            offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: '<div id="' + obj.sid + '" class="vl_icon vl_icon_control"></div>'
          });
          // hover
          marker.on('mouseover', function () {
            let sContent = '<div class="vl_map_hover">' +
              '<div class="vl_map_hover_main"><ul>' + 
                '<li><span>设备名称：</span>' + obj.name + '</li>' + 
                '<li><span>设备地址：</span>' + obj.addr + '</li>' + 
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
    }
  }
}
</script>
<style lang="scss" scoped>
.control_create{
  width: 100%;
  height: 100%;
  .create_box{
    min-height: 875px;
    margin: 0 20px 20px 20px;
    padding: 0 20px 20px;
    background: #fff;
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    .create_num{
      line-height: 40px;
    }
  }
  .create_model{
    .create_model_box{
      margin-top: 10px;
      border-radius:4px 4px 0px 0px;
      border:1px solid rgba(211,211,211,1);
      .model_checkbox{
        width: 100%;
        height: 44px;
        line-height: 44px;
        padding-left: 15px;
        background:rgba(250,250,250,1);
        border-radius:5px 5px 0px 0px;
        border:1px solid rgba(242,242,242,1);
      }
    }
    .pic_format{
      line-height: 20px;
      margin-top: 10px;
      & > div:nth-child(1){
        color: #0C70F8;
        cursor: pointer;
      }
    }
    .add_point{
      background:rgba(255,255,255,1);
      border-radius:4px;
      text-align: center;
      border:1px dashed rgba(217,217,217,1);
      color: #0C70F8;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.control_create{
  .create_form {
    .create_form_one{
      .el-form-item__content{
        display: flex;
        flex-wrap: wrap;
        .el-form-item{
          padding-right: 40px;
          .el-input__inner, .el-select{
            width: 100%!important;
          }
          .el-form-item__label{
            padding-bottom: 0!important;
          }
        }
        .period_time{
          display: flex;
          margin-top: 40px;
          padding-right: 40px;
          > span{
            margin: 0 9px;
          }
          > .el-form-item{
            padding-right: 0!important;
            & > .el-form-item__label:nth-child(1){
              width: 330px;
              position: absolute;
              left: 0;
              top: 80px;
            }
          }
          .el-form-item__content{
            .el-date-editor{
              width: 100%!important;
            }
          }
        } 
      }
    }
    .period_time_btn_box{ 
      margin-bottom: 0!important;
      .el-form-item__content{
        display: flex;
        .period_time_btn{
          width: 164px;
          height:40px;
          line-height:40px;
          text-align: center;
          border-radius:4px;
          border:1px dashed rgba(217,217,217,1);
          cursor: pointer;
          &:nth-child(1){
            color: #0C70F8;
            margin-right: 25px;
          }
          &:nth-child(2){
            color: #F94539;
          }
        }
      }
    }
    .el-form-item{
      padding-right: 53px;
      .el-input__inner, .el-select{
        width: 100%!important;
      }
      .el-form-item__label{
        padding-bottom: 0!important;
      }
    }
    .point .el-form-item__content{
      display: flex;
      i{
        margin-top: 12px;
        margin-left: 10px;
        color: #F94539;
        cursor: pointer;
      }
    }
  }
}
</style>
