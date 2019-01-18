<template>
  <div class="control_manage_d">
    <!-- 面包屑 -->
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>布控</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'control_manage' }">布控管理</el-breadcrumb-item>
        <el-breadcrumb-item>布控详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 详情 -->
    <div class="manage_d_box">
      <div class="manage_d_title">
        <div class="vl_f_16 vl_f_333">基本信息</div>
        <div class="vl_f_12 vl_f_666">创建于2018-11-1 11:00:00 ；更新于2018-11-1 11:00:00</div>
      </div>
      <div class="manage_d_content">
        <!-- 布控信息 -->
        <ul>
          <li>
            <div><span class="vl_f_666">布控编号：</span><span class="vl_f_333">b19344985</span></div>
            <div><span class="vl_f_666">布控类型：</span><span class="vl_f_333">短期布控</span></div>
          </li>
          <li>
            <div><span class="vl_f_666">布控名称：</span><span class="vl_f_333">名称默认为布控1</span></div>
            <div><span class="vl_f_666">布控日期：</span><span class="vl_f_333">2018-11-21 至2018-11-30</span></div>
          </li>
          <li>
            <div><span class="vl_f_666">告警级别：</span><span class="vl_f_333">一级</span></div>
            <div><span class="vl_f_666">布控时间：</span><span class="vl_f_333">10:00:00-12:00:00</span></div>
          </li>
        </ul>
        <div class="manage_d_c_e">
          <div class="vl_f_666">事件内容：</div>
          <div class="vl_f_333">园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火园区门口有电动车起火事件情况文字多行显示。<span>详情</span></div>
        </div>
        <div class="manage_d_c_o">
          <div><span class="vl_f_666">布控对象：</span><span class="vl_f_333">2</span></div>
          <div>
            <div class="manage_d_c_o_i" v-for="item in controlObjList" :key="item.id">
              <img :src="item.url" alt="">
              <p><i class="vl_icon vl_icon_control_05"></i><span class="vl_f_333">{{item.controlObjName}}</span></p>
              <p><i class="vl_icon vl_icon_control_05"></i><span class="vl_f_666">{{item.controlReason}}</span></p>
            </div>
          </div>
        </div>
        <div :class="['vl_control_state', controlState === '0' ? 'vl_control_s' : controlState === '1' ? 'vl_control_o' : 'vl_control_e']"></div>
        <!-- 布控范围 -->
        <div class="manage_d_c_scope">
          <div class="manage_d_s_t" @click="dpType = '布控范围'">
            <div>布控范围</div>
            <i class="el-icon-arrow-up" v-show="dpType !== '布控范围'"></i>
            <i class="el-icon-arrow-down" v-show="dpType === '布控范围'"></i>
          </div>
          <el-collapse-transition>
            <div class="manage_d_s_m" v-show="dpType === '布控范围'">
              <div id="mapBox"></div>
              <div class="manage_d_s_m_l">
                <div>
                  <p><span class="vl_f_666">设备组：</span><span class="vl_f_333">自定义组1</span></p>
                  <p><span class="vl_f_666">设备特性：</span><span class="vl_f_333">人脸识别</span></p>
                </div>
                <div>
                  <div class="vl_f_333 top">布控设备（12）</div>
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
                            <li v-for="equ in trackPoint.sxt" :key="equ.sid" @click="eid = equ.sid" :class="{'active': eid === equ.sid}"><span>{{equ.sxtName}}</span><i class="vl_icon vl_icon_control_05"></i></li>
                          </ul>
                          <ul v-else>
                            <li v-for="equ in equList" :key="equ.kid" @click="eid = equ.kid" :class="{'active': eid === equ.kid}"><span>{{equ.kName}}</span><i class="vl_icon vl_icon_control_05"></i></li>
                          </ul>
                        </div>
                      </el-collapse-transition>
                    </div>
                  </div>
                </div>
              </div>
              <div class="manage_d_s_m_r">
                <div class="top"><i class="vl_icon vl_icon_control_23"></i></div>
                <ul class="bottom">
                  <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
                  <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
                </ul>
              </div>
            </div>
          </el-collapse-transition>
        </div>
        <!-- 运行情况 -->
        <div class="manage_d_c_situ" v-if="controlState !== '0'">
          <div class="situ_title">运行情况</div>
          <div class="situ_time">
            <div><span>开始时间：</span><span>2018-11-21 10:00:00</span></div>
            <div v-if="controlState === '2'"><span>结束时间：</span><span>2018-11-21 10:00:00</span></div>
            <div><span>持续时间：</span><span>110:00:00</span></div>
          </div>
          <div class="situ_box" v-if="controlState === '1'">
            <div class="situ_top" @click="dpType = '运行情况'">
              <div>实时监控</div>
              <i class="el-icon-arrow-down" v-show="dpType === '运行情况'"></i>
              <i class="el-icon-arrow-up" v-show="dpType !== '运行情况'"></i>
            </div>
            <el-collapse-transition>
              <div class="situ_content" v-if="dpType === '运行情况'">
                <div class="situ_left">
                  <div>布控设备（12）</div>
                  <ul>
                    <li><span>摄像头001</span><i class="vl_icon vl_icon_control_05"></i></li>
                    <li><span>摄像头001</span><i class="vl_icon vl_icon_control_05"></i></li>
                    <li><span>摄像头001</span><i class="vl_icon vl_icon_control_05"></i></li>
                    <li><span>摄像头001</span><i class="vl_icon vl_icon_control_05"></i></li>
                    <li><span>摄像头001</span><i class="vl_icon vl_icon_control_05"></i></li>
                  </ul>
                </div>
                <div class="situ_right">
                  <div class="situ_r_video">
                    <video src="../../../../assets/video/video.mp4" autoplay loop></video>
                    <div>
                      <i class="vl_icon vl_icon_control_06"></i>
                      <i class="vl_icon vl_icon_control_11"></i>
                      <i class="vl_icon vl_icon_control_07"></i>
                    </div>
                    <i class="vl_icon vl_icon_control_13"></i>
                  </div>
                  <div class="situ_r_video">
                    <video src="../../../../assets/video/video.mp4" autoplay loop></video>
                    <div>
                      <i class="vl_icon vl_icon_control_06"></i>
                      <i class="vl_icon vl_icon_control_11"></i>
                      <i class="vl_icon vl_icon_control_07"></i>
                    </div>
                    <i class="vl_icon vl_icon_control_13"></i>
                  </div>
                  <div class="situ_r_video">
                    <video src="../../../../assets/video/video.mp4" autoplay loop></video>
                    <div>
                      <i class="vl_icon vl_icon_control_06"></i>
                      <i class="vl_icon vl_icon_control_11"></i>
                      <i class="vl_icon vl_icon_control_07"></i>
                    </div>
                    <i class="vl_icon vl_icon_control_13"></i>
                  </div>
                  <div class="situ_r_video">
                    <video src="../../../../assets/video/video.mp4" autoplay loop></video>
                    <div>
                      <i class="vl_icon vl_icon_control_06"></i>
                      <i class="vl_icon vl_icon_control_11"></i>
                      <i class="vl_icon vl_icon_control_07"></i>
                    </div>
                    <i class="vl_icon vl_icon_control_13"></i>
                  </div>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </div>
        <!-- 布控结果 -->
        <div class="manage_d_c_result" v-if="controlState !== '0'">
          <div class="result_title" @click="dpType = '布控结果'">
            <div>布控结果（200个）</div>
            <div>
              <el-input size="small" placeholder="请选择起止时间"></el-input>
              <el-input size="small">请搜索或选择设备</el-input>
            </div>
          </div>
          <div class="result_content" v-if="dpType === '布控结果'">
            <div class="result_img_box" v-for="item in '12345678'" :key="item.id">
              <img src="//via.placeholder.com/395x239" alt="">
              <div class="result_tool">
                <div>抓拍设备</div>
                <div>
                  <i class="vl_icon vl_icon_control_06"></i>
                  <i class="vl_icon vl_icon_control_11"></i>
                </div>
              </div>
              <div>
                <p><i class="vl_icon vl_icon_control_05"></i><span class="vl_f_333">匹配名称</span></p>
                <p><i class="vl_icon vl_icon_control_05"></i><span class="vl_f_999">抓拍时间</span></p>
              </div>
            </div>
            <el-pagination
              style="align-self: flex-start;"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, prev, pager, next, jumper"
              :total="400">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部操作按钮 -->
    <!-- 待开始 -->
    <div class="manage_f_box" v-if="controlState === '0'">
      <el-button type="primary">编辑</el-button>
      <el-button>删除</el-button>
    </div>
    <!-- 进行中 -->
    <div class="manage_f_box" v-if="controlState === '1'">
      <el-button type="primary">终止</el-button>
      <el-button>返回</el-button>
    </div>
    <!-- 已结束 -->
    <div class="manage_f_box" v-if="controlState === '2'">
      <el-button type="primary">复用</el-button>
      <el-button>删除</el-button>
    </div>
  </div>
</template>
<script>
import {conData} from './testData.js';
import {random14} from '../../../../utils/util.js';
export default {
  data () {
    return {
      controlState: null,//布控状态
      // 布控对象列表数据
      controlObjList: [
        {id: '1', url: '//via.placeholder.com/160x160', controlObjName: '马司小易', controlReason: '失踪儿童'},
        {id: '2', url: '//via.placeholder.com/160x160', controlObjName: '马司小易', controlReason: '失踪儿童'},
        {id: '3', url: '//via.placeholder.com/160x160', controlObjName: '马司小易', controlReason: '失踪儿童'},
        {id: '4', url: '//via.placeholder.com/160x160', controlObjName: '马司小易', controlReason: '失踪儿童'},
        {id: '5', url: '//via.placeholder.com/160x160', controlObjName: '马司小易', controlReason: '失踪儿童'},
        {id: '6', url: '//via.placeholder.com/160x160', controlObjName: '马司小易', controlReason: '失踪儿童'},
        {id: '7', url: '//via.placeholder.com/160x160', controlObjName: '马司小易', controlReason: '失踪儿童'},
        {id: '8', url: '//via.placeholder.com/160x160', controlObjName: '马司小易', controlReason: '失踪儿童'}
      ],
      // 地图参数
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
       // 翻页数据
      currentPage: 1,
      pageSzie: 10,
      pageNum: 1
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

    this.trackPointList.map(f => {
      this.$set(f, 'isDropdown', false);
    })
    this.mapMark();
  },
  methods: {
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
    },
    handleSizeChange () {

    },
    handleCurrentChange () {

    }
  }
}
</script>
<style lang="scss" scoped>
.control_manage_d{
  width: 100%;
  position: relative;
  .manage_d_box{
    width: calc(100% - 40px);
    min-height: 783px;
    margin-left: 20px;
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    background: #fff;
    border-radius:4px;
    .manage_d_title{
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      line-height: 50px;
    }
    .manage_d_content{
      padding-left: 20px;
      padding-bottom: 80px;
      border-top: 1px solid #F2F2F2;
      position: relative;
      > ul{
        display: flex;
        flex-wrap: nowrap;
        li{
          width: 28%;
          div{
            margin-top: 15px;
          }
        }
      }
      .manage_d_c_e{
        display: flex;
        flex-wrap: nowrap;
        margin-top: 15px;
        div:nth-child(2){
          span{
            color: #0C70F8;
            cursor: pointer;
          }
        }
      }
      .manage_d_c_o{
        >div:nth-child(1){
          padding-top: 15px;
        }
        >div:nth-child(2){
          display: flex;
          flex-wrap: wrap;
          padding: 0 20px 0 60px;
          .manage_d_c_o_i{
            width: 160px;
            height: 222px;
            border-radius:4px;
            border:1px solid rgba(211,211,211,1);
            margin-right: 20px;
            margin-top: 15px;
            p{
              padding-left: 10px;
              margin-top: 4px;
              i{
                vertical-align: middle;
                margin-bottom: 2px;
              }
            }
          }
        }
      }
      .vl_control_state{
        position: absolute;
        right: 0;
        top: 0;
      }
      .manage_d_c_scope{
        width:calc(100% - 20px);
        // height:848px;
        border-radius:4px 4px 0px 0px;
        border:1px solid rgba(211,211,211,1);
        margin-top: 20px;
        .manage_d_s_t{
          display: flex;
          justify-content: space-between;
          line-height: 44px;
          padding: 0 15px;
          background:rgba(250,250,250,1);
          cursor: pointer;
          > i{
            vertical-align: middle;
            margin-top: 10px;
            font-size: 18px;
          }
        }
      }
      .manage_d_c_situ{
        width: calc(100% - 20px);
        margin-top: 20px;
        background:rgba(255,255,255,1);
        box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
        border-radius:4px;
        .situ_title{
          line-height: 44px;
          padding-left: 15px;
          border-bottom: 1px solid #F2F2F2;
        }
        .situ_time{
          line-height: 44px;
          padding-left: 15px;
          display: flex;
          > div{
            width: 20%;
          }
        }
        .situ_box{
          margin: 0 20px 20px 20px;
          border-radius:4px 4px 0px 0px;
          border:1px solid #F2F2F2;
          .situ_top{
            display: flex;
            justify-content: space-between;
            line-height: 44px;
            padding: 0 15px;
            background:rgba(250,250,250,1);
            cursor: pointer;
            i{
              vertical-align: middle;
              margin-top: 10px;
              font-size: 18px;
            }
          }
          .situ_content{
            display: flex;
            flex-wrap: nowrap;
            .situ_left{
              width: 258px;
              min-height: 764px;
              border-right: 1px solid #F2F2F2;
              > div{
                width: 100%;
                padding: 0 10px;
                height: 50px;
                line-height: 50px;
                border-bottom: 1px solid #F2F2F2;
              }
              > ul{
                margin-top: 10px;
                li{
                  width: 100%;
                  height: 36px;
                  line-height: 36px;
                  display: flex;
                  flex-wrap: nowrap;
                  justify-content: space-between;
                  padding: 0 15px 0 40px;
                  color: #666666;
                  cursor: pointer;
                  i{
                    vertical-align: middle;
                    margin-top: 10px;
                  }
                  &:hover{
                    color: #B2B2B2;
                  }
                  &:active{
                    background:rgba(250,250,250,1);
                    color: #666666;
                  }
                }
              }
            }
            .situ_right{
              width: calc(100% - 258px);
              height: 100%;
              display: flex;
              flex-wrap: wrap;
              justify-content: space-between;
              padding-bottom: 20px;
              padding-right: 20px;
              .situ_r_video{
                width: 650px;
                height: 372px;
                padding: 20px;
                position: relative;
                overflow: hidden;
                video{
                  width: 660px;
                  height: 372px;
                }
                > div{
                  width: 100%;
                  height: 44px;
                  padding-right: 30px;
                  position: absolute;
                  left: 20px;
                  bottom: 0;
                  background: rgba(0,0,0,.4);
                  opacity: .4;
                  text-align: right;
                  i{
                    margin-right: 15px;
                    margin-top: 10px;
                    cursor: pointer;
                    &:last-child{
                      margin-right: 0;
                    }
                  }
                }
                > .vl_icon_control_13{
                  position: absolute;
                  right: 8px;
                  top: 30px;
                }
              }
            }
          }
         
        }
      }
      .manage_d_c_result{
        height: 100%;
        margin: 20px 20px 20px 0;
        background:rgba(255,255,255,1);
        box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
        border-radius:4px;
        .result_title{
          line-height: 44px;
          padding: 0 15px;
          border-bottom: 1px solid #F2F2F2;
          display: flex;
          justify-content: space-between;
          cursor: pointer;
          > div:nth-child(2){
            display: flex;
            .el-input{
              margin-left: 50px;
            }
          }
        }
        .result_content{
          width: 100%;
          height: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          .result_img_box{
            width: 395px;
            height: 301px;
            margin-top: 20px;
            position: relative;
            overflow: hidden;
            background:rgba(255,255,255,1);
            border-radius:4px;
            border:1px solid rgba(211,211,211,1);
            img{
              width: 100%;
            }
            .result_tool{
              width: 100%;
              height: 36px;
              line-height: 36px;
              background: rgba(0,0,0,.4);
              display: flex;
              justify-content: space-between;
              padding-left: 15px;
              position: absolute;
              bottom: 62px;
              left: 0;
              > div{
                color: #fff;
              }
              i{
                margin-top: 6px;
                margin-right: 10px;
                cursor: pointer;
              }
            }
            > div:nth-child(3){
              p{
                margin-top: 8px;
                padding-left: 10px;
                i{
                  vertical-align: middle;
                }
              }
            }
          }
        }
      }
    }
  }
  .manage_f_box{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height:60px;
    line-height: 60px;
    padding: 0 20px;
    background:rgba(255,255,255,1);
    box-shadow:0px -1px 2px 0px rgba(0,0,0,0.03);
    .el-button{
      width: 100px;
      height: 40px;
    }
  }
}
</style>