<template>
  <div class="control_map">
    <!-- 侧边栏搜索框 -->
    <div class="search_box">
      <p>选择一个或多个条件进行搜索</p>
      <el-form :model="mapForm" class="map_form">
        <el-form-item style="width: 192px;">
          <el-input v-model="mapForm.name" placeholder="请输入布控名称"></el-input>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-input v-model="mapForm.num" placeholder="请输入事件编号"></el-input>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-input v-model="mapForm.obj" placeholder="请输入布控对象"></el-input>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-select v-model="mapForm.state" placeholder="布控状态" @change="changeState()">
            <el-option
              v-for="item in stateList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-select v-model="mapForm.type" placeholder="设备类型">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-select v-model="mapForm.rank" placeholder="告警级别">
            <el-option
              v-for="item in rankList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            style="width: 192px;"
            v-model="mapForm.time"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="width: 192px;">
          <el-button class="reset_btn" type="primary" plain @click="resetForm()">重置</el-button>
          <el-button class="select_btn" type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="map_box">
      <!-- 地图 -->
      <div id="mapBox"></div>
      <!-- 抓拍列表 -->
      <div class="snap_box" v-if="!isShowPlayback">
        <el-card shadow="hover" class="more">
          <p>今日抓拍</p>
          <div>2354</div>
          <el-button size="small">查看更多</el-button>
        </el-card>
        <el-card class="pic" shadow="hover" v-for="item in snapList" :key="item.name">
          <div class="img">
            <img :src="item.url" alt="">
          </div>
          <ul>
            <li>
              <i class="vl_icon vl_icon_camera"></i>
              <span>{{item.name}}</span>
            </li>
            <li>
              <i class="vl_icon vl_icon_camera"></i>
              <span>{{item.time}}</span>
            </li>
            <li>
              <i class="vl_icon vl_icon_camera"></i>
              <span>{{item.monitoring}}</span>
            </li>
          </ul>
        </el-card>
      </div>
      <!-- 布控进行中页面 -->
      <div class="underway_box" v-if="isShowPlayback">
        <div class="video_box" :style="{'height': videoHeight + 'px'}">
          <div class="video">
            <div>
              <video src="../../../../assets/video/video.mp4" autoplay loop></video>
              <div class="toolbar">
                <div>环岛路摄像头001</div>
                <div>
                  <i class="vl_icon vl_icon_play"></i>
                  <i class="vl_icon vl_icon_volume"></i>
                  <i class="vl_icon vl_icon_sign"></i>
                  <i class="vl_icon vl_icon_transcribe"></i>
                  <i class="vl_icon vl_icon_screen"></i>
                  <i class="vl_icon vl_icon_unfold"></i>
                  <i class="vl_icon vl_icon_list"></i>
                </div>
              </div>
              <div class="vl_map_state">进行中</div>
              <div class="vl_icon vl_icon_video_close" @click="isShowPlayback = !isShowPlayback"></div>
            </div>
          </div>
        </div>
        <div class="control_box">
          <el-card class="more" shadow="hover">
            <p>布控对象</p>
            <div>10</div>
            <el-button size="small">查看更多</el-button>
          </el-card>
          <el-card class="pic" shadow="hover" v-for="item in controlObjList" :key="item.name">
            <img :src="item.url" alt="">
            <p>{{item.name}}</p>
          </el-card>
          <div class="control_info">
            <div class="control_info_list">
              <div><span>布控名称：</span><span>三岁小孩走失</span></div>
              <div><span>布控日期：</span><span>2018-11-01</span></div>
              <div><span>事件预览：</span><span>在雀园路与君逸路交叉口一3岁小孩与父母走丢，被保安发现带往天心区公安局，好心…</span></div>
            </div>
            <el-button type="primary" size="small">视频回放</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {testData} from './testData.js';
import {random14} from '../../../../utils/util.js';
export default {
  data () {
    return {
      // 左侧搜索参数
      mapForm: {
        name: null,
        num: null,
        obj: null,
        state: '1',
        type: null,
        rank: null,
        time: null
      },
      stateList: [
        {label: '待开始', value: '0'},
        {label: '进行中', value: '1'},
        {label: '已结束', value: '2'}
      ],
      typeList: [
        {label: '全部', value: 0},
        {label: '球机', value: 1},
        {label: '枪机', value: 2}
      ],
      rankList: [
        {label: '全部', value: 0},
        {label: '一级', value: 1},
        {label: '二级', value: 2},
        {label: '三级', value: 3},
        {label: '四级', value: 4},
        {label: '五级', value: 5}
      ],
      // 地图参数
      map: null,
      controlList: null, // 布控数据列表
      // 抓拍列表参数
      snapList: [
        {url: '//via.placeholder.com/130x130', name: '冯晓宁1', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},
        {url: '//via.placeholder.com/130x130', name: '冯晓宁2', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},
        {url: '//via.placeholder.com/130x130', name: '冯晓宁3', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},
        {url: '//via.placeholder.com/130x130', name: '冯晓宁4', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},
        {url: '//via.placeholder.com/130x130', name: '冯晓宁5', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},
        {url: '//via.placeholder.com/130x130', name: '冯晓宁6', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},
        {url: '//via.placeholder.com/130x130', name: '冯晓宁7', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'}
      ],
      // 布控对象列表参数
      controlObjList: [
        {url: '//via.placeholder.com/130x130', name: '冯晓宁1', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},
        {url: '//via.placeholder.com/130x130', name: '冯晓宁2', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'},
        {url: '//via.placeholder.com/130x130', name: '冯晓宁3', time: '18-12-24 14:12:17', monitoring: '环保路摄像头002'}      
      ],
      isShowPlayback: false, // 是否显示视频回放页面
      videoHeight: null
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
    // _this.getMapData();
    _this.changeState();
    _this.videoHeight = document.body.clientHeight - 336;
  },
  methods: {
    // 获取地图数据
    // getMapData () {
    //   setTimeout(() => {
    //     this.controlList = testData;
    //     console.log(this.controlList, 111111)
    //     this.mapMark();
    //   }, 200);
    // },
    // 地图标记
    mapMark () {
      let _this = this, clickWindow = null;
      let data = _this.controlList;
      console.log(data, 'data')
      _this.map.clearMap();
      for (let i = 0; i < data.length; i++) {
        let obj = data[i];
        obj.sid = obj.name + '_' + i + '_' + random14();
        let content = '';
        if (obj.controlList[0].alarmRank === '五级') {
          content = '<div id="' + obj.sid + '" class="vl_icon vl_icon_target"><div class="vl_icon_warning">发现可疑目标</div></div>';
        } else {
          content = '<div id="' + obj.sid + '" class="vl_icon vl_icon_control"></div>';
        }
        if (obj.longitude > 0 && obj.latitude > 0) {
          let offSet = [-20.5, -48], selClass = '';
          let marker = new window.AMap.Marker({ // 添加自定义点标记
            map: _this.map,
            position: [obj.longitude, obj.latitude],
            offset: new window.AMap.Pixel(offSet[0], offSet[1]), // 相对于基点的偏移位置
            draggable: false, // 是否可拖动
            extData: obj,
            // 自定义点标记覆盖物内容
            content: content
          });
          marker.setMap(_this.map);
          new window.AMap.event.addListener(marker, 'click', function(e) {
            console.log(e.target.C.extData.sid, 'e')
            // 点击切换图标
            $('#mapBox .vl_icon_click').addClass("vl_icon_control");
            $('#mapBox .vl_icon_click').removeClass("vl_icon_click");
            $('#' + e.target.C.extData.sid).addClass("vl_icon_click");
            $('#' + e.target.C.extData.sid).removeClass("vl_icon_control");
            let sContent = '';
            // 布控进行中
            if (_this.mapForm.state === '1') {
              // 一个摄像头只有一个布控时
              if (obj && obj.controlList.length === 1) {
                sContent = `
                  <div class="vl_map_click">
                    <div class="vl_map_close vl_icon vl_icon_fork"></div>
                    <div class="vl_map_click_main">
                      <div class="vl_map_img">
                        <video src="${require('../../../../assets/video/video.mp4')}" autoplay loop width="100%"></video>
                        <div class="vl_map_state">进行中</div>
                        <div class="vl_map_operate">
                          <div>摄像头12458 </div>
                          <div>
                            <i class="vl_icon vl_icon_sign"></i>
                            <i class="vl_icon vl_icon_screen"></i>
                            <i class="vl_icon vl_icon_unfold"></i>
                          </div>
                        </div>
                      </div>
                      <div class="vl_map_info">
                        <div><span>布控名称：</span><span>${obj.controlList[0].controlName}</span></div>
                        <div><span>布控日期：</span><span>2018-11-01</span></div>
                        <div><span>事件预览：</span><span>在雀园路与君逸路交叉口一3岁小孩与父母走丢，被保安发现带往天心区公安局，好心…</span></div>
                      </div>
                      <div class="vl_map_obj">
                        <div class="vl_map_obj_num">
                          <div><span>布控对象：</span><span>10</span></div>
                          <div>查看更多</div>
                        </div>
                        <div class="vl_map_obj_img">
                          <div><img src="//via.placeholder.com/60x60"><p>张三</p></div>
                          <div><img src="//via.placeholder.com/60x60"><p>张三</p></div>
                          <div><img src="//via.placeholder.com/60x60"><p>张三</p></div>
                          <div><img src="//via.placeholder.com/60x60"><p>张三</p></div>
                        </div>
                      </div>
                      <div class="vl_map_btn">视频回放</div>
                    </div>
                    <div class="vl_map_triangle"></div>
                  </div>
                  `;
              // 一个摄像头有多个布控时
              } else if (obj && obj.controlList.length > 1) {
                sContent = 
                  '<div class="vl_map_click">'
                    + '<div class="vl_map_close vl_icon vl_icon_fork"></div>' + 
                    '<div class="vl_map_click_main">' + 
                      '<div class="vl_map_img">' +
                        '<video src=' + require('../../../../assets/video/video.mp4') + ' + autoplay loop width="100%"></video>' +
                        '<div class="vl_map_state">进行中</div>' +
                      ' <div class="vl_map_operate">' +
                          '<div>摄像头12458 </div>' +
                          '<div>' +
                            '<i class="vl_icon vl_icon_sign"></i>' +
                            '<i class="vl_icon vl_icon_screen"></i>' +
                            '<i class="vl_icon vl_icon_unfold"></i>' +
                          '</div>' +
                        '</div>' +
                      '</div>';
                      for (let item of obj.controlList) {
                        sContent += 
                        '<div class="vl_map_info">' +
                          '<div><span>布控名称：</span><span>' + item.controlName + '</span></div>' +
                          '<div><span>布控日期：</span><span>2018-11-01</span></div>' +
                          '<div><span>事件预览：</span><span>在雀园路与君逸路交叉口一3岁小孩与父母走丢，被保安发现带往天心区公安局，好心…</span></div>' +
                        '</div>'
                      }
                      
                  sContent +=  '</div>' +
                    '<div class="vl_map_triangle"></div>' +
                  '</div>';
              }
            }
            // 布控待开始
            if (_this.mapForm.state === '0') {
              // 一个摄像头只有一个布控时
              if (obj && obj.controlList.length === 1) {
                sContent = `
                  <div class="vl_map_click">
                    <div class="vl_map_close vl_icon vl_icon_fork"></div>
                    <div class="vl_map_click_main">
                      <div class="vl_map_start">
                        <div class="vl_map_state">等待开始</div>
                        <span>摄像头524</span>
                      </div>
                      <div class="vl_map_info">
                        <div><span>布控名称：</span><span>${obj.controlList[0].controlName}</span></div>
                        <div><span>布控日期：</span><span>2018-11-01</span></div>
                        <div><span>事件预览：</span><span>在雀园路与君逸路交叉口一3岁小孩与父母走丢，被保安发现带往天心区公安局，好心…</span></div>
                      </div>
                      <div class="vl_map_obj">
                        <div class="vl_map_obj_num">
                          <div><span>布控对象：</span><span>10</span></div>
                          <div>查看更多</div>
                        </div>
                        <div class="vl_map_obj_img">
                          <div><img src="//via.placeholder.com/60x60"><p>张三</p></div>
                          <div><img src="//via.placeholder.com/60x60"><p>张三</p></div>
                          <div><img src="//via.placeholder.com/60x60"><p>张三</p></div>
                          <div><img src="//via.placeholder.com/60x60"><p>张三</p></div>
                        </div>
                      </div>
                    </div>
                    <div class="vl_map_triangle"></div>
                  </div>
                  `;
              // 一个摄像头有多个布控时
              } else if (obj && obj.controlList.length > 1) {
                sContent = 
                  '<div class="vl_map_click">'
                    + '<div class="vl_map_close vl_icon vl_icon_fork"></div>' + 
                    '<div class="vl_map_click_main">' + 
                      '<div class="vl_map_start">' +
                        '<div class="vl_map_state">等待开始</div>' +
                        '<span>摄像头0015</span>' +
                      '</div>';
                      for (let item of obj.controlList) {
                        sContent += 
                        '<div class="vl_map_info">' +
                          '<div><span>布控名称：</span><span>' + item.controlName + '</span></div>' +
                          '<div><span>布控日期：</span><span>2018-11-01</span></div>' +
                          '<div><span>事件预览：</span><span>在雀园路与君逸路交叉口一3岁小孩与父母走丢，被保安发现带往天心区公安局，好心…</span></div>' +
                        '</div>'
                      }
                  sContent +=  '</div>' +
                    '<div class="vl_map_triangle"></div>' +
                  '</div>';
              }
            }
            // 布控已结束
            if (_this.mapForm.state === '2') {
              // 一个摄像头只有一个布控时
              if (obj && obj.controlList.length === 1) {
                sContent = `
                  <div class="vl_map_click">
                    <div class="vl_map_close vl_icon vl_icon_fork"></div>
                    <div class="vl_map_click_main">
                      <div class="vl_map_start">
                        <div class="vl_map_state" style="background: #999999;">已结束</div>
                        <span>摄像头524</span>
                      </div>
                      <div class="vl_map_info">
                        <div><span>布控名称：</span><span>${obj.controlList[0].controlName}</span></div>
                        <div><span>布控日期：</span><span>2018-11-01</span></div>
                        <div><span>事件预览：</span><span>在雀园路与君逸路交叉口一3岁小孩与父母走丢，被保安发现带往天心区公安局，好心…</span></div>
                      </div>
                      <div class="vl_map_obj">
                        <div class="vl_map_obj_num">
                          <div><span>布控对象：</span><span>10</span></div>
                          <div>查看更多</div>
                        </div>
                        <div class="vl_map_obj_img">
                          <div><img src="//via.placeholder.com/60x60"><p>张三</p></div>
                          <div><img src="//via.placeholder.com/60x60"><p>张三</p></div>
                          <div><img src="//via.placeholder.com/60x60"><p>张三</p></div>
                          <div><img src="//via.placeholder.com/60x60"><p>张三</p></div>
                        </div>
                      </div>
                    </div>
                    <div class="vl_map_triangle"></div>
                  </div>
                  `;
              // 一个摄像头有多个布控时
              } else if (obj && obj.controlList.length > 1) {
                sContent = 
                  '<div class="vl_map_click">'
                    + '<div class="vl_map_close vl_icon vl_icon_fork"></div>' + 
                    '<div class="vl_map_click_main">' + 
                      '<div class="vl_map_start">' +
                        '<div class="vl_map_state" style="background: #999999;">已结束</div>' +
                        '<span>摄像头0015</span>' +
                      '</div>';
                      for (let item of obj.controlList) {
                        sContent += 
                        '<div class="vl_map_info">' +
                          '<div><span>布控名称：</span><span>' + item.controlName + '</span></div>' +
                          '<div><span>布控日期：</span><span>2018-11-01</span></div>' +
                          '<div><span>事件预览：</span><span>在雀园路与君逸路交叉口一3岁小孩与父母走丢，被保安发现带往天心区公安局，好心…</span></div>' +
                        '</div>'
                      }
                  sContent +=  '</div>' +
                    '<div class="vl_map_triangle"></div>' +
                  '</div>';
              }
            }
            clickWindow = new window.AMap.InfoWindow({
              isCustom: true,
              closeWhenClickMap: true,
              offset: new window.AMap.Pixel(-2, -60), // 相对于基点的偏移位置
              content: sContent
            });
            // 打开弹窗
            clickWindow.open(_this.map, new window.AMap.LngLat(obj.longitude, obj.latitude));
            // 防止重复绑定点击事件，先解绑
            $("#mapBox").unbind('click');
            // 利用事件冒泡,绑定关闭弹框的点击事件
            $('#mapBox').on('click', '.vl_map_close', function () {
              // 关闭弹窗
              if (clickWindow) { clickWindow.close(); }
            })
            // 利用事件冒泡,绑定视频回放按钮的点击事件
            $('#mapBox').on('click', '.vl_map_btn', function () {
              // 关闭弹窗
              if (clickWindow) { clickWindow.close(); }
              // 显示视频回放页面
              _this.isShowPlayback = true;
            })
          });
        }
      }
    },
    // 按布控状态来筛选地图标记
    changeState () {
      this.controlList = this.objDeepCopy(testData);
      for (let item of this.controlList) {
        item.controlList = item.controlList.filter(f => f.controlState === this.mapForm.state);
      }
      this.controlList = this.controlList.filter(f => f.controlList.length > 0);
      this.mapMark();
    },
    // 深度拷贝公共方法
    objDeepCopy (source) {
      var sourceCopy = source instanceof Array ? [] : {};
      for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? this.objDeepCopy(source[item]) : source[item];
      }
      return sourceCopy;
    },
    // 重置表单
    resetForm () {
      for (let key in this.mapForm) {
        this.mapForm[key] = null;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .control_map{
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    .search_box{
      position: absolute;
      left: 20px;
      top: 0;
      z-index: 999;
      height: 100%;
      width: 232px;
      background: #fff;
      box-shadow:4px 0px 10px 0px rgba(131,131,131,0.28);
      animation: fadeInLeft .4s ease-out .3s both;
      p{
        line-height: 60px;
        text-align: center;
        color: #999;
        border-bottom: 1px solid #d3d3d3;
      }
      .map_form{
        padding: 20px;
        .reset_btn, .select_btn{
          width: 90px;
        }
      }
    }
    .map_box{
      height: 100%;
      width: calc(100% - 252px);
      margin-left: 252px;
      position: relative;
      #mapBox{
        height: 100%;
        width: 100%;
      }
      .snap_box{
        width: 100%;
        overflow: hidden;
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        padding: 20px;
        .more.el-card{
          width: 152px;
          height: 245px;
          text-align: center;
          padding: 78px 0 87px 0;
          box-shadow:0px -4px 10px 0px rgba(131,131,131,0.28);
          p{
            line-height: 24px;
          }
          div{
            font-size: 24px;
            line-height: 24px;
            margin-bottom: 5px;
            color: #0769E7;
          }
          .el-button{
            width: 90px;
            height: 30px;
          }
        }
        .pic.el-card{
          width: 162px;
          height: 245px;
          padding: 15px 0;
          box-shadow:0px -4px 10px 0px rgba(131,131,131,0.28);
          ul{
            padding: 16px 0 0 16px;
            li i{
              vertical-align: middle;
              margin-bottom: 2px;
            }
            li:nth-child(1) span{
              color: #333333;
            }
            li:not(:nth-child(1)) span{
              color: #999999;
            }
          } 
          .img{
            width: 100%;
            text-align: center;
          }          
        }
      }
      .underway_box{
        width: 100%;
        height: 100%;
        padding: 18px;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 99;
        .video_box{
          width: 100%;
          // height: 602px;
          padding: 20px 80px;
          background:rgba(0,0,0,0.67);
          box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
          border-radius:3px;
          .video{
            width: 100%;
            height: 100%;
            > div{
              width: 100%;
              height: 100%;
              position: relative;
              background: #000;
              video{
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top:0;
                z-index: 999;
              }
              .toolbar{
                width: 100%;
                height: 48px;
                line-height: 48px;
                display: flex;
                flex-wrap: nowrap;
                justify-content: space-between;
                position: absolute;
                left: 0;
                bottom: 0;
                z-index: 999;
                padding-left: 15px;
                background:rgba(34,34,34,0.65);
                border-radius:0px 0px 3px 3px;
                > div{
                  color: #fff;
                  i{
                    margin-top: 12px;
                    cursor: pointer;
                  }
                }
                > div:not(:nth-child(1), :last-child) i{
                  margin-right: 15px;
                }
              }
              .vl_map_state{
                position: absolute;
                left: 0;
                top: 0;
                z-index: 9999;
                padding: 0 6px;
                border-radius: 0 10px 10px 0;
                line-height: 20px;
                margin-right: 10px;
                text-align: center;
                background: #0567E2;
                color: #fff;
                font-size: 12px;
              }
              .vl_icon_video_close{
                position: absolute;
                right: 10px;
                top: 10px;
                z-index: 9999;
                cursor: pointer;
              }
            }
          }
        }
        .control_box{
          width: 100%;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          .el-card{
            height: 182px;
            margin-top: 18px;
            text-align: center;
            box-shadow:0px -4px 10px 0px rgba(131,131,131,0.28);
          }
          .more.el-card{
            width: 152px;
            padding: 40px 0;
            p{
              line-height: 24px;
            }
            div{
              font-size: 24px;
              line-height: 24px;
              margin-bottom: 5px;
              color: #0769E7;
            }
            .el-button{
              width: 90px;
              height: 30px;
            }
          }
          .pic.el-card{
            width: 162px;
            padding-top: 10px;
            p{
              line-height: 30px;
              color: #333;
            }
          }
          .control_info{
            width: 344px;
            height: 182px;
            padding: 10px;
            margin-top: 18px;
            background: #fff;
            .control_info_list{
              padding: 10px 0;
              height: 110px;
              overflow: hidden;
              & > div:nth-child(1){
                font-size: 16px;
                color: #333;
                line-height:24px;
              }
              & > div:not(:nth-child(1)){
                font-size: 12px;
                color: #999999;
                line-height:22px;
              }
              & > div:nth-child(3){
                display: flex;
                flex-wrap: nowrap;
                > span:nth-child(1){
                  width: 19%;
                  height: 44px;
                  overflow: hidden;
                }
                > span:nth-child(2){
                  width: 81%;
                  height: 44px;
                  overflow: hidden;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss">
.control_map{
  .map_form{
    .el-form-item{
      margin-bottom: 10px!important;
    }
  }
  .map_box{
    .el-card__body{
      padding: 0!important;
    }
  }
  #mapBox{
    .vl_map_click{
      width: 340px;
      position: relative;
      background: #fff;
      .vl_map_close{
        position: absolute;
        right: -12px;
        top: -12px;
        cursor: pointer;
      }
      .vl_map_click_main{
        padding: 20px;
        .vl_map_img{
          position: relative;
          .vl_map_state{
            position: absolute;
            left: 0;
            top: 0;
            padding: 0 6px;
            border-radius: 0 10px 10px 0;
            line-height: 20px;
            text-align: center;
            background: #0567E2;
            color: #fff;
            font-size: 12px;
          }
        }
        .vl_map_operate{
          width: 100%;
          height: 30px;
          position: absolute;
          left: 0;
          bottom: 0;
          padding: 0 10px;
          line-height: 30px;
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          background: #000000;
          & > div{
            color: #fff;
            i{
              display: inline-block;
              margin-top: 3px;
              cursor: pointer;
            }
            i:not(:last-child){
              margin-right: 10px;
            }
          }
        }
        .vl_map_info{
          padding: 10px 0;
          &:not(:last-child){
            border-bottom: 1px solid #F2F2F2;
          }
          & > div:nth-child(1){
            font-size: 16px;
            color: #0567E1;
            line-height:24px;
          }
          & > div:not(:nth-child(1)){
            font-size: 12px;
            color: #999999;
            line-height:22px;
          }
          & > div:nth-child(3){
            display: flex;
            flex-wrap: nowrap;
            > span:nth-child(1){
              width: 150px;
            }
          }
        }
        .vl_map_obj{
          .vl_map_obj_num{
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            line-height: 40px;
            font-size: 12px;
            > div:nth-child(1){
              > span:nth-child(1){
                color: #999999;
              }
              > span:nth-child(2){
                color: #666666;
              }
            }
            > div:nth-child(2){
              color: #0567E1;
              cursor: pointer;
            }
          }
          .vl_map_obj_img{
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
            & > div{
              text-align: center;
              > p{
                line-height: 30px;
              }
              > p:hover{
                cursor: pointer;
                color: #0567E1;
              }
            }
          }
        }
        .vl_map_btn{
          width: 80px;
          height: 30px;
          background: #3a8ee6;
          border-radius: 5px;
          margin-top: 10px;
          line-height: 30px;
          text-align: center;
          color: #fff;
          cursor: pointer;
        }
        .vl_map_btn:hover{
          background: #66b1ff;
        }
        .vl_map_start{
          display: flex;
          .vl_map_state{
            padding: 0 6px;
            border-radius: 0 10px 10px 0;
            line-height: 20px;
            margin-right: 10px;
            text-align: center;
            background: #50CC62;
            color: #fff;
            font-size: 12px;
          }
          > span{
            margin-top: 2px;
            color: #999999;
          }
        }
      }
      .vl_map_triangle{
        border: 15px solid transparent;
        border-top-color: #fff;
        position: absolute;
        left: 50%;
        margin-left: -10px;
        bottom: -26px;
      }
    }
    .vl_icon{
      transition: none !important;
      position: relative;
      .vl_icon_warning{
        width: 115px;
        padding: 5px 0;
        border-radius: 15px;
        position: absolute;
        bottom: -6px;
        left: 40px;
        box-shadow:0px 8px 9px 0px rgba(39,40,40,0.2);
        text-align: center;
        background: #FA453A;
        color: #fff;
      }
    }
  }
}
</style>
