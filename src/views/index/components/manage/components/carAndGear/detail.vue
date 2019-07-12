<template>
<vue-scroll>
  <div class="car_detail">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/manage/archivesManage/carGear'}">档案管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/manage/archivesManage/carGear'}">一车一档</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="basic_info">
      <div class="status_img">
        <template v-if="detailInfo.onlineState && detailInfo.onlineState == 1">
          <i class="vl_icon vl_icon_archives_1"></i>
        </template>
        <template v-if="detailInfo.onlineState && detailInfo.onlineState == 2">
          <i class="vl_icon vl_icon_archives_5"></i>
        </template>
      </div>
      <div class="header member_header">
        <span>基本信息</span>
        <p>
          创建于{{detailInfo.createTime | fmTimestamp}}；
          最近更新于{{detailInfo.updateTime | fmTimestamp}}
        </p>
      </div>
      <div class="divide"></div>
      <ul class="detail_info clearfix">
        <li>
          <span>车辆编号:</span>
          <span>{{detailInfo.transportNo ? detailInfo.transportNo : '无'}}</span>
        </li>
        <li>
          <span>车牌号码:</span>
          <span>{{detailInfo.vehicleNumber ? detailInfo.vehicleNumber : '无'}}</span>
        </li>
        <li>
          <span>识别代码:</span>
          <span>{{detailInfo.identityNo ? detailInfo.identityNo : '无'}}</span>
        </li>
        <li>
          <span>车辆类型:</span>
          <span>{{detailInfo.vehicleType ? detailInfo.vehicleTypeName : '无'}}</span>
        </li>
        <li>
          <span>核载人数:</span>
          <span>{{detailInfo.capacityPeople}}人</span>
        </li>
        <li>
          <span>车身颜色:</span>
          <span>{{detailInfo.vehicleColor ? detailInfo.vehicleColorName : '无'}}</span>
        </li>
        <li>
          <span>所属单位:</span>
          <span>{{detailInfo.organName ? detailInfo.organName : '无'}}</span>
        </li>
        <li>
          <span>运营公司:</span>
          <span>{{detailInfo.brandName ? detailInfo.brandName : '无'}}</span>
        </li>
        <li>
          <span>号牌:</span>
          <span>{{detailInfo.numberType ? detailInfo.numberTypeName : '无'}}</span>
        </li>
        <li>
          <span>设备账户:</span>
          <span>{{detailInfo.deviceAccount ? detailInfo.deviceAccount : '无'}}</span>
        </li>
        <li>
          <span>访问密码:</span>
          <span>{{detailInfo.devicePassword ? detailInfo.devicePassword : '无'}}</span>
        </li>
      </ul>
    </div>
    <div class="video_replay">
      <div class="header">
        <span>录像回放</span>
      </div>
      <div class="divide"></div>
      <div class="replay_box">
        <div class="replay_left">
          <el-form ref="searchForm" :model="searchForm"  size="middle" class="replay_form">
            <el-form-item label="开始时间：" label-width="90px">
              <el-date-picker
                style="width: 200px;"
                v-model="searchForm.startDate"
                type="datetime"
                placeholder="开始时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：" label-width="90px">
              <el-date-picker
                style="width: 200px;"
                v-model="searchForm.endDate"
                type="datetime"
                placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
            <div class="divide"></div>
            <el-form-item label="视频通道：" label-width="90px">
              <el-checkbox-group v-model="searchForm.passageway">
                <el-checkbox label="CH0" value="1"></el-checkbox>
                <el-checkbox label="CH1" value="2"></el-checkbox>
                <el-checkbox label="CH2" value="3"></el-checkbox>
                <el-checkbox label="CH3" value="4"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label-width="20px">
              <el-button class="operation_btn function_btn">立即查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="replay_right">
          <ul>
            <li>

            </li>
            <li>

            </li>
            <li>

            </li>
            <li>

            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="location_info">
      <div class="header">
        <span>轨迹路线</span>
      </div>
      <div class="divide"></div>
      <div class="location_box">
        <div class="location_body">
          <div class="location_left">
            <el-form ref="searchForm" :model="tracksForm"  size="middle" class="replay_form">
              <el-form-item label="开始时间：" label-width="90px">
                <el-date-picker
                  style="width: 200px;"
                  v-model="tracksForm.startDate"
                  type="datetime"
                  clearable
                  placeholder="开始时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间：" label-width="90px">
                <el-date-picker
                  style="width: 200px;"
                  v-model="tracksForm.endDate"
                  clearable
                  type="datetime"
                  placeholder="结束时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label-width="20px">
                <el-button class="operation_btn function_btn" @click="getTracksInfo">立即查询</el-button>
              </el-form-item>
            </el-form>
            <div class="divide"></div>
            <div class="table_box">
              <div class="header">
                <span>轨迹数据</span>
              </div>
              <div class="table_container">
                <vue-scroll>
                  <el-table
                    class="list_table"
                    :data="dataList"
                    >
                    <el-table-column
                      label="定位时间"
                      prop="time"
                      show-overflow-tooltip
                      >
                    </el-table-column>
                    <el-table-column
                      label="定位位置"
                      prop="location"
                      show-overflow-tooltip
                      >
                    </el-table-column>
                    <el-table-column
                      label="速度"
                      prop="speed"
                      show-overflow-tooltip
                      >
                    </el-table-column>
                  </el-table>
                </vue-scroll>
              </div>
            </div>
          </div>
          <div class="location_right">
            <div class="map_content">
              <div id="mapBox"></div>
              <div class="control-box">
                <div class="control-checkbox">
                  <el-radio-group v-model="selectRadio" @change="buttonClick">
                    <el-radio-button v-for="item in buttons" :label="item.name" :key="item.value"></el-radio-button>
                  </el-radio-group>
                </div>
                <div class="control-slider">
                  <div class="slider-left">
                    <span class="label">时速：</span>
                    <span class="value">{{ speed * 10 }}km/h</span>
                  </div>
                  <div class="slider-right">
                    <el-slider v-model="speed" @change="setSpeed" :show-tooltip="false"></el-slider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn function_btn"  @click="skipEditPage">编辑信息</el-button>
      <el-button class="operation_btn back_btn" @click="showDeleteDialog">删除</el-button>
      <el-button class="operation_btn back_btn" @click="back">返回</el-button>
    </div>
    <!--删除弹出框-->
    <el-dialog
      title="是否删除该车辆及其档案信息？"
      :visible.sync="deleteDialog"
      width="482px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog_comp"
      >
      <span style="color: #999999;font-size: 12px;">删除后，本系统不能实时监管该车辆</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialog = false">取消</el-button>
        <el-button class="operation_btn function_btn" :loading="isDeleteLoading" @click="sureDelete">确认</el-button>
      </div>
    </el-dialog>
  </div>
</vue-scroll>
</template>
<script>
import { getVehicleDetail, delVehicle, getVehicleTracks } from '@/views/index/api/api.archives.js';
import { dataList } from '@/utils/data.js';
import { getDiciData } from '@/views/index/api/api.js';
export default {
  data () {
    return {
      deleteDialog: false, // 删除弹出框
      isDeleteLoading: false, // 删除加载中
      map: null, // 地图对象
      detailInfo: {
        eventAddress: '溆浦县第一中学',
        latitude: 27.906875,
        longitude: 110.609392
      },
      searchForm: {
        startDate: null,
        endDate: null,
        passageway: []
      },
      tracksForm: {
        startDate: null,
        endDate: null
      },
      dataList: [
        {
          time: '2018-12-12 12:12:12',
          location: '凯文中学旁100米',
          speed: '40km/h'
        },
        {
          time: '2018-12-12 12:12:12',
          location: '凯文中学旁100米',
          speed: '40km/h'
        },
        {
          time: '2018-12-12 12:12:12',
          location: '凯文中学旁100米',
          speed: '40km/h'
        },
        {
          time: '2018-12-12 12:12:12',
          location: '凯文中学旁100米',
          speed: '40km/h'
        },
        {
          time: '2018-12-12 12:12:12',
          location: '凯文中学旁100米',
          speed: '40km/h'
        },
        {
          time: '2018-12-12 12:12:12',
          location: '凯文中学旁100米',
          speed: '40km/h'
        }
      ],
      buttons: [
        { name: '开始', value: 1 },
        { name: '暂停', value: 2 },
        { name: '恢复', value: 3 },
        { name: '停止', value: 4 }
      ],
      selectRadio: '开始', // 选中的radio
      speed: 4, // 时速
      vehicleTypeList: [], // 车辆类型
      numberTypeList: [], // 号牌种类
      vehicleColorList: [], // 车身颜色
      operateCompanyList: [], // 运营公司列表
    }
  },
  mounted () {
    // this.initMap();
    this.getOperateCompanyList();
    this.getVehicleColor();
    this.getVehicleTypeList();
    this.getNumberTypeList();

    setTimeout(() =>{
      this.getDetail();
    }, 500)
  },
  methods: {
    // 获取运营公司列表
    getOperateCompanyList () {
      const operate = dataList.operateCompany;
      getDiciData(operate)
        .then(res => {
          if (res) {
            this.operateCompanyList = res.data;
          }
        })
    },
    // 获取车身颜色
    getVehicleColor () {
      const color = dataList.vehicleColor;
      getDiciData(color)
        .then(res => {
          if (res) {
            this.vehicleColorList = res.data;
          }
        })
        .catch(() => {})
    },
    // 获取号牌种类列表
    getNumberTypeList () {
      const type = dataList.numberType;
      getDiciData(type)
        .then(res => {
          if (res) {
            this.numberTypeList = res.data;
          }
        })
    },
    // 获取车辆类型列表
    getVehicleTypeList () {
      const type = dataList.vehicleType;
      getDiciData(type)
        .then(res => {
          if (res) {
            this.vehicleTypeList = res.data;
          }
        })
    },
    // 获取车辆轨迹数据
    getTracksInfo () {
      const params = {
        startTime: this.tracksForm.startDate,
        endTime: this.tracksForm.endDate
      };
      getVehicleTracks(params)
        .then(res => {

        })
    },
    // 获取车辆详情
    getDetail () {
      const vehicleId = this.$route.query.id;
      if (vehicleId) {
        getVehicleDetail(vehicleId)
          .then(res => {
            if (res) {
              this.detailInfo = res.data;
              
              this.vehicleTypeList.map(val => {
                if (this.detailInfo.vehicleType == val.enumField) {
                  this.detailInfo.vehicleTypeName = val.enumValue;
                }
              });
              this.numberTypeList.map(val => {
                if (this.detailInfo.numberType == val.enumField) {
                  this.detailInfo.numberTypeName = val.enumValue;
                }
              });
              this.vehicleColorList.map(val => {
                if (this.detailInfo.vehicleColor == val.enumField) {
                  this.detailInfo.vehicleColorName = val.enumValue;
                }
              });
              this.operateCompanyList.map(val => {
                if (this.detailInfo.brandNo == val.enumField) {
                  this.detailInfo.brandName = val.enumValue;
                }
              });
            }
          })
      }
    },
    // 设置播放速度
    setSpeed () {

    },
    // 切换radio
    buttonClick () {

    },
    // 重置地图
    resetMap () {
      this.initMap();
    },
    // 初始化地图
    initMap () {
      let _this = this;
      // _this.resetMap();
      let map = new window.AMap.Map('mapBox', {
        zoom: 16, // 级别
        center: [110.596015, 27.907662], // 中心点坐标[110.596015, 27.907662]
      });
      map.setMapStyle('amap://styles/whitesmoke');
      _this.map = map;

      _this.mapMark( _this.detailInfo);
      // map.on('click', function(e) {
        
      //   new window.AMap.service('AMap.Geocoder', function () { // 回调函数
      //     let geocoder = null;
      //     geocoder = new window.AMap.Geocoder({});
      //     const lnglatXY = [e.lnglat.getLng(), e.lnglat.getLat()];//地图上所标点的坐标

      //     geocoder.getAddress(lnglatXY, function (status, result) {
      //       console.log('result', result)
      //       if (status === 'complete' && result.info === 'OK') {
      //         _this.mapMark( _this.detailInfo);
      //       }
      //     });
      //   });
      // });
    },
    // 地图标记
    mapMark (obj) {
      console.log(obj)
      let _this = this;
      
      // _this.map.clearMap();
      let hoverWindow = null;
      if (obj.longitude > 0 && obj.latitude > 0) {
        console.log('nnnnnn')
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
          let sContent = '<div class="vl_map_hover machine_map_hover" >' +
            '<div class="vl_main_hover_address" style="min-width: 380px;padding: 10px 70px 10px 10px">'
            +'<p class="vl_map_hover_main_p">事发地点： ' + obj.eventAddress + '</p><p class="vl_map_hover_main_p">经纬度：经度' + obj.longitude + '；纬度：' + obj.latitude +'</p></div></div>';
          hoverWindow = new window.AMap.InfoWindow({
            isCustom: true,
            closeWhenClickMap: true,
            offset: new window.AMap.Pixel(0, 0), // 相对于基点的偏移位置
            content: sContent
          });
          // aCenter = mEvent.target.F.position
          hoverWindow.open(_this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
        });
        marker.on('mouseout', function () {
          if (hoverWindow) { hoverWindow.close(); }
        });
        _this.map.setCenter([obj.longitude, obj.latitude]); // 根据经纬度重新设置地图中心点

      }
    },
    // 跳至编辑页面
    skipEditPage () {
      this.$router.push({name: 'car_edit', query: { id: this.detailInfo.uid, organObj: this.$route.query.organObj }});
    },
    // 显示删除弹出框
    showDeleteDialog () {
      this.deleteDialog = true;
    },
    // 确认删除
    sureDelete () {
      if (this.detailInfo.uid) {
        this.isDeleteLoading = true;
        delVehicle(this.detailInfo.uid)
          .then(res => {
            if (res) {
              this.isDeleteLoading = false;
              this.$message({
                type: 'success',
                message: '删除成功',
                customClass: 'request_tip'
              });
              this.$router.push({name: 'car_gear'});
              this.deleteDialog = false;
            } else {
              this.isDeleteLoading = false;
            }
          })
          .catch(() => {this.isDeleteLoading = false;})
      }
    },
    // 返回
    back () {
      this.$router.back(-1);
    }
  }
}
</script>

<style lang="scss" scoped>
.car_detail {
  width: 100%;
  margin-bottom: 80px;
  .location_info {
    display: none;
    height: 600px;
    padding-bottom: 60px;
    .location_box {
      width: 100%;
      height: 100%;
      .location_body {
        width: 98%;
        height: 97%;
        border:1px solid rgba(211,211,211,1);
        border-radius:4px 4px 0px 0px;
        margin: 1%;
        display: flex;
        .location_left {
          height: 100%;
          width: 310px;
          border-right: 1px solid #D3D3D3;
          .divide {
            height: 1px;
            border-bottom: 1px dashed #D3D3D3;
          }
          .replay_form {
            padding: 10px 5px 0;
            .operation_btn {
              width: 248px;
              height: 40px;
              text-align: center;
            }
            .function_btn {
              background: #0C70F8;
              color: #ffffff;
            }
          }
          .table_box {
             height: calc(100% - 200px);
            .table_container {
              height: calc(100% - 40px);
            }
          }
        }
        .location_right {
          width: calc(100% - 310px);
          height: 100%;
          .map_content {
            position: relative;
            border-radius:4px 4px 0px 0px;
            width: 98%;
            height: 96%;
            margin: 1%;
            #mapBox {
              width: 100%;
              height: 100%;
            }
            .control-box {
              position: absolute;
              z-index: 100000;
              top: 10px;
              right: 10px;
              width: 210px;
              height: 76px;
              padding: 10px;
              background:rgba(255,255,255,1);
              border-radius:2px;
              box-shadow:0px 0px 6px rgba(0,0,0,0.03);
              .control-checkbox {
                /deep/ .el-radio-button__inner {
                  padding: 5px 8px;
                }
                /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
                  background:#0C70F8;
                  border-color: #0C70F8;
                  box-shadow: -1px 0 0 0 #0C70F8;
                }
                /deep/ .el-radio-button__inner:hover {
                  color: #0C70F8;
                }
              }
              .control-slider {
                display: flex;
                align-items: center;
                white-space: nowrap;
                .slider-left {
                  width: 95px;
                  .label, .value {
                    color: #666666;
                    font-size: 12px;
                  }
                }
                .slider-right {
                  flex: 1;
                  margin-left: 5px;
                  /deep/ .el-slider__bar {
                    background:#0C70F8;
                  }
                  /deep/ .el-slider__button {
                    width: 14px;
                    height: 14px;
                    border-color: #0C70F8;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .basic_info, .video_replay, .location_info {
    margin: 10px;
    position: relative;
    background-color: #ffffff;
    margin-bottom: 20px;
    box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
    border-radius:4px;
    .status_img {
      position: absolute;
      right: 0;
      top: 40px;
    }
    .header {
      > span {
        display: inline-block;
        padding: 10px;
        color: #333333;
        font-weight: 600;
        font-size: 16px;
      }
    }
    .member_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      >p {
        margin-right: 10px;
        color:#999999;
      }
    }
    .divide {
      width: 100%;
      height: 1px;
      background-color: #F2F2F2;
    }
    .detail_info {
      width: 100%;
      clear: both;
      padding: 10px 0;
      >li {
        float: left;
        width: 25%;
        height: 30px;
        span:first-child {
          display: inline-block;
          color: #666666;
          width: 70px;
          text-align: right;
          margin-right: 10px;
        }
        span:last-child {
          color: #333333;
        }
        // &:last-child {
        //   width: 100%;
        // }
      }
    }
    
  }
  .video_replay {
    display: none;
    height: 700px;
    // width: 100%;
    padding-bottom: 50px;
    .replay_box {
      width: 98%;
      height: 95%;
      border:1px solid rgba(211,211,211,1);
      border-radius:4px 4px 0px 0px;
      margin: 1%;
      display: flex;
      .replay_left {
        height: 100%;
        width: 310px;
        border-right: 1px solid #D3D3D3;
        .replay_form {
          padding: 10px 5px 0;
          .divide {
            height: 1px;
            border-bottom: 1px dashed #D3D3D3;
          }
          .operation_btn {
            // padding: 0;
            width: 248px;
            height: 40px;
            text-align: center;
          }
          .function_btn {
            background: #0C70F8;
            color: #ffffff;
          }
        }
      }
      .replay_right {
        height: 100%;
        width: calc(100% - 300px);
        > ul {
          width: 100%;
          height: 100%;
          display: flex;
          flex-wrap: wrap;
          >li {
            width: 48%;
            margin: 1%;
            height: 45%;
            border: 1px solid;
          }
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

