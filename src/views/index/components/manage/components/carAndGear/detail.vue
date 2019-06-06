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
        <i class="vl_icon vl_icon_archives_2"></i>
      </div>
      <div class="header member_header">
        <span>基本信息</span>
        <p>
          创建于2018-12-12 12:12:12；
          最近更新于2018-12-12 12:12:12
        </p>
      </div>
      <div class="divide"></div>
      <ul class="detail_info clearfix">
        <li>
          <span>车辆编号:</span>
          <span>2018121212121</span>
        </li>
        <li>
          <span>车牌号码:</span>
          <span>见风使舵看风景</span>
        </li>
        <li>
          <span>识别代码:</span>
          <span>张三</span>
        </li>
        <li>
          <span>车辆类型:</span>
          <span>1345555555</span>
        </li>
        <li>
          <span>核载人数:</span>
          <span>4人</span>
        </li>
        <li>
          <span>车身颜色:</span>
          <span>见风使舵看风景</span>
        </li>
        <li>
          <span>所属单位:</span>
          <span>见风使舵看风景</span>
        </li>
        <li>
          <span>号牌:</span>
          <span>见风使舵看风景</span>
        </li>
        <li>
          <span>设备账户:</span>
          <span>见风使舵看风景</span>
        </li>
        <li>
          <span>访问密码:</span>
          <span>见风使舵看风景</span>
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
              <el-form-item label-width="20px">
                <el-button class="operation_btn function_btn">立即查询</el-button>
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
        passageway: null
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
      ]
    }
  },
  mounted () {
    this.initMap();
  },
  methods: {
    // 重置地图
    resetMap () {
      this.initMap();
    },
    // 地图放大缩小
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
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
      this.$router.push({name: 'room_edit'});
    },
    // 显示删除弹出框
    showDeleteDialog () {
      this.deleteDialog = true;
    },
    // 确认删除
    sureDelete () {},
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
            // border:1px solid rgba(211,211,211,1);
            border-radius:4px 4px 0px 0px;
            width: 98%;
            height: 96%;
            margin: 1%;
            #mapBox {
              width: 100%;
              height: 100%;
            }
            .right-flag {
              position: absolute; right:60px; bottom: 40px;
              height: 220px;
              transition: right .3s ease-out;
              animation: fadeInRight .4s ease-out .4s both;
              .map-rrt {
                padding: 0 10px;
                background-color: #fff;
                box-shadow: 0 0 10px rgba(148,148,148,0.24);
                >li {
                  padding: 15px 5px;
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
    height: 550px;
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

