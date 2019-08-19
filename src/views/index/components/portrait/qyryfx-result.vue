<template>
  <div class="qyryfx_result">
    <!-- 面包屑通用样式 -->
    <div class="vc_gcck_bd">
      <div
        is="vlBreadcrumb"
        :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
            {name: '区域人员分析', routerName: 'portrait_qyryfx' }, { name: '分析结果'}]"
      ></div>
    </div>
    <div class="content_box">
      <div class="left">
        <vue-scroll>
          <ul class="result_ul">
            <li>
              <span>任务名称：</span>
              <span>{{taskParams && taskParams.taskName}}</span>
            </li>
            <li class="person_list">
              <span>关注人群：</span>
              <p>{{taskParams && taskParams.personGroupId}}</p>
            </li>
            <li>
              <span>性别：</span>
              <span>{{taskParams && taskParams.sex}}</span>
            </li>
            <li>
              <span>年龄段：</span>
              <span>{{taskParams && taskParams.age}}</span>
            </li>
            <li class="area_list" v-for="(item, index) in taskParams && taskParams.deviceAndTimeList" :key="index">
              <div>
                <span>区域1时间：</span>
                <div class="time_box">
                  <p>{{item.startTime}}</p>
                  <p>{{item.endTime}}</p>
                </div>
              </div>
              <div>
                <span>区域1设备：</span>
                <p>{{item.deviceNames}}</p>
              </div>
            </li>
          </ul>
        </vue-scroll>
      </div>
      <div class="right">
        <div class="gis_content" id="gis_content">
          <div class="map_rm" id="mapMap"></div>
          <div class="map_control">
            <div class="photo_count_level">
              <div class="colors">
                <div></div>
                <p>&gt;500</p>
              </div>
              <div class="colors">
                <div></div>
                <p>201-500</p>
              </div>
              <div class="colors">
                <div></div>
                <p>101-200</p>
              </div>
              <div class="colors">
                <div></div>
                <p>51-100</p>
              </div>
              <div class="colors">
                <div></div>
                <p>20-50</p>
              </div>
              <div class="colors">
                <div></div>
                <p>&lt;20</p>
              </div>
            </div>
            <ul class="map_rrt_u2">
              <li @click="resetZoom">
                <i class="el-icon-aim"></i>
              </li>
              <li>
                <i class="el-icon-plus" @click="mapZoomSet(1)"></i>
              </li>
              <li>
                <i class="el-icon-minus" @click="mapZoomSet(-1)"></i>
              </li>
            </ul>
          </div>
        </div>
        <!-- 页面的右边 -->
        <div class="info_right" v-show="infoRightShow">
          <div class="danger_people_wrap">
            <vue-scroll>
              <h3 class="camera_name">
                <span>{{ selectedDevice.deviceName }}</span>
                &nbsp;
                <span>{{'(' + currentClickDevice.shotNum + '次)'}}</span>
                <i class="el-icon-close" @click="infoRightShow = false;" title="关闭"></i>
              </h3>
              <div class="danger_people_list">
                <div
                  class="people_item"
                  v-for="(item, index) in currentClickDevice"
                  :key="'people_item' + index"
                >
                  <div v-for="(sItem, sIndex) in item.detailList" :key="'my_swiper' + sIndex">
                    <div class="swiper_contents" v-if="item.currentIndex === sIndex">
                      <div class="shot_times">{{ item.detailList.length + '次'}}</div>
                      <div class="img_warp">
                        <img :src="sItem.upPhotoUrl" title="点击放大图片" class="bigImg" alt />
                      </div>
                      <div class="similarity">
                        <p class="similarity_count">{{sItem.semblance}}</p>
                        <p class="similarity_title">相似度</p>
                        <div class="select_time">
                          <el-select
                            v-model="item.currentIndex"
                            @change="slideToIndex(item.currentIndex, index)"
                            placeholder="请选择"
                          >
                            <el-option
                              v-for="(gItem, gIndex) in item.detailList"
                              :key="gIndex"
                              :label="item.shotTimes[gIndex]"
                              :value="gIndex"
                            ></el-option>
                          </el-select>
                        </div>
                      </div>
                      <div class="img_warp">
                        <img :src="sItem.subStoragePath" title="点击放大图片" class="bigImg" alt />
                      </div>
                      <div class="people_message">
                        <h2 class="name">{{item.name}}</h2>
                        <div class="tips_wrap">
                          <p class="tip">{{item.sex}}</p>
                          <p class="tip">{{item.age}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div @click="prev(index)" class="swiper-button-prev change_img"></div>
                  <div @click="next(index)" class="swiper-button-next change_img"></div>
                </div>
              </div>
            </vue-scroll>
          </div>
          <div class="right_black"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
import { mapXupuxian } from "@/config/config.js";
import { getGroupAllList } from "@/views/index/api/api.control.js";
import {
  getAllMonitorList,
  getAllBayonetList
} from "@/views/index/api/api.base.js";
export default {
  components: { vlBreadcrumb },
  data () {
    return {
      taskResult: null, // 分析结果
      taskParams: null, // 分析参数
      amap: null, // 地图对象
      peopleGroupOptions: [], // 关注人群数据列表
      infoRightShow: false, // 右边菜单状态
      listDevice: [], // 设备
      listBayonet: [], // 卡口
      showTypes: "DB", //设备类型
      selectedDevice: {}, // 当前选中的设备信息
      currentClickDevice: [],
      swiper: null,
    }
  },
  created () {
    // 获取到监控人群分组
    getGroupAllList().then(res => {
      if (res) {
        this.peopleGroupOptions = [
          ...res.data.filter(item => item.uid !== null)
        ];
      }
    });
    this.getTreeList();
  },
  mounted () {
    this.initMap();
    if (this.$route.query.result) {
      this.taskResult = JSON.parse(this.$route.query.result);
    }
    if (this.$route.query.param) {
      this.taskParams = JSON.parse(this.$route.query.param);
        let personGroupIdName = []; 
        this.taskParams.personGroupId && this.taskParams.personGroupId.split().map(val => {
          this.peopleGroupOptions.map(item => {
          if (item.uid === val) {
            personGroupIdName.push(item.groupName);
          }
        });
      });
      if (personGroupIdName.length > 0) {
        this.taskParams.personGroupId = personGroupIdName;
      }
    }
  },
  methods: {
    // 切换照片
    prev(val) {
      const ind = this.currentClickDevice[val].detailList.length - 1;
      if (this.currentClickDevice[val].currentIndex === 0) {
        const obj = objDeepCopy(this.currentClickDevice[val]);
        obj.currentIndex = ind;
        this.$set(this.currentClickDevice, val, obj);
      } else {
        const obj = objDeepCopy(this.currentClickDevice[val]);
        obj.currentIndex = obj.currentIndex - 1;
        this.$set(this.currentClickDevice, val, obj);
      }
    },
    next(val) {
      const ind = this.currentClickDevice[val].detailList.length - 1;
      if (this.currentClickDevice[val].currentIndex === ind) {
        const obj = objDeepCopy(this.currentClickDevice[val]);
        obj.currentIndex = 0;
        this.$set(this.currentClickDevice, val, obj);
      } else {
        const obj = objDeepCopy(this.currentClickDevice[val]);
        obj.currentIndex = obj.currentIndex + 1;
        this.$set(this.currentClickDevice, val, obj);
      }
    },
    slideToIndex(val, ind) {
      const obj = objDeepCopy(this.currentClickDevice[ind]);
      obj.currentIndex = val;
      this.$set(this.currentClickDevice, ind, obj);
    },
    mapZoomSet (val) {
      if (this.amap) {
        this.amap.setZoom(this.amap.getZoom() + val);
      }
    },
    resetZoom () {
      if (this.amap) {
        this.amap.setZoomAndCenter(15, mapXupuxian.center);
        this.amap.setFitView();
      }
    },
    // 初始化地图
    initMap (obj) {
      let _this = this;
      let map = new window.AMap.Map('mapMap', {
        zoom: 15, // 级别
        center: mapXupuxian.center, // 中心点坐标[110.596015, 27.907662]
      });
      map.setMapStyle('amap://styles/whitesmoke');

      _this.amap = map;

      // _this.mapMark(obj);
    },
    
    /** 点击摄像头查看此摄像头抓拍详情信息 */
    clickGetCameraData(device) {
      this.infoRightShow = true;
      this.currentClickDevice = device;
      for (let i = 0; i < this.currentClickDevice.length; i++) {
        const item = this.currentClickDevice[i];
        if (item.detailList.length) {
          item.currentIndex = item.detailList.length - 1;
          item.detailList = item.detailList.map(item => {
            item.semblance = Number(item.semblance).toFixed(2); // 保留2位小数点
            return item;
          });
        } else {
          item.currentIndex = 0;
        }
      }
    },
    getTreeList() {
      if (this.showTypes.indexOf("D") >= 0) {
        this.getListDevice();
      }
      if (this.showTypes.indexOf("B") >= 0) {
        this.getListBayonet();
      }
    },
    // // 获取到设备数据
    getListDevice() {
      getAllMonitorList({ ccode: mapXupuxian.adcode }).then(res => {
        if (res) {
          this.listDevice = res.data;
          // this.setMarks(); // 初始化设备
        }
      });
    },
    // 获取到卡口数据
    getListBayonet() {
      getAllBayonetList({ areaId: mapXupuxian.adcode }).then(res => {
        if (res) {
          this.listBayonet = res.data;
          // this.setMarks(); // 初始化卡口
        }
      });
    },
    // D设备 B卡口
    setMarks(deviceList = null) {
      console.log('deviceList', deviceList)
      // 展示设备和卡口
      // if (init) {
      //   // 初始化的时候展示所有的设备
      //   for (let i = 0; i < this.listDevice.length; i++) {
      //     this.doMark(this.listDevice[i], deviceList, "vl_icon vl_icon_sxt");
      //   }
      //   for (let i = 0; i < this.listBayonet.length; i++) {
      //     this.doMark(this.listBayonet[i], deviceList, "vl_icon vl_icon_kk");
      //   }
      //   this.amap.setFitView();
      // } else {
        for (let i = 0; i < this.listDevice.length; i++) {
          const listItem = this.listDevice[i];
          let flag = false;
          for (let j = 0; j < deviceList.length; j++) {
            const deviceItem = deviceList[j];
            if (deviceItem.groupName === listItem.viewClassCode) {
              this.doMark(listItem, deviceItem, "vl_icon vl_icon_sxt", false);
              flag = true;
              break;
            }
          }
          if (!flag) {
            this.doMark(this.listDevice[i], null, "vl_icon vl_icon_sxt");
          }
        }
        for (let i = 0; i < this.listBayonet.length; i++) {
          const listItem = this.listBayonet[i];
          let flag = false;
          for (let j = 0; j < deviceList.length; j++) {
            const deviceItem = deviceList[j];
            if (deviceItem.groupName === listItem.viewClassCode) {
              this.doMark(listItem, deviceItem, "vl_icon vl_icon_kk", false);
              flag = true;
              break;
            }
          }
          if (!flag) {
            this.doMark(this.listBayonet[i], null, "vl_icon vl_icon_kk");
          }
        }
      // }
    },
    // 地图标记
    doMark(obj, device, sClass, init = true) {
      console.log('obj', obj)
      console.log('obj', device)
      let marker;
      if (!init && device.shotNum > 0) {
        // 非初始化的状态
        let level;
        if (device.shotNum < 20) {
          level = "level6";
        } else if (device.shotNum <= 50 && device.shotNum >= 20) {
          level = "level5";
        } else if (device.shotNum <= 100 && device.shotNum >= 51) {
          level = "level4";
        } else if (device.shotNum <= 200 && device.shotNum >= 101) {
          level = "level3";
        } else if (device.shotNum <= 500 && device.shotNum >= 201) {
          level = "level2";
        } else if (device.shotNum > 500) {
          level = "level1";
        }
        marker = new window.AMap.Marker({
          // 添加自定义点标记
          map: this.amap,
          position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
          offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // extData: obj,
          // 自定义点标记覆盖物内容
          content: `<div class='qyryfx_vl_icon_wrap' title="点击查询设备抓拍照片"> <div class="map_icons ${sClass}"></div> <div class='people_counts_l1 ${level}'> ${device.shotNum}人次 </div> </div>`
        });
        let _this = this;
        // 给标记绑定一个点击事件
        marker.on("click", function() {
          // _this.currentClickDevice = device.areaListWeb;
          _this.selectedDevice = device;
          _this.clickGetCameraData(device.areaListWeb);
        });
        this.markerList = [...this.markerList, marker];
      } else {
        marker = new window.AMap.Marker({
          // 添加自定义点标记
          map: this.amap,
          position: [obj.longitude, obj.latitude], // 基点位置 [116.397428, 39.90923]
          offset: new window.AMap.Pixel(-20, -48), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // extData: obj,
          // 自定义点标记覆盖物内容
          content: `<div style="cursor:not-allowed;" class="map_icons ${sClass}"></div>`
        });
        this.markerList = [...this.markerList, marker];
      }
      this.amap.setFitView();
    },
  }
}
</script>
<style lang="scss" scoped>
.vc_gcck_bd {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 50px; line-height: 50px;
}
.qyryfx_result {
  height: 100%;
  .content_box {
    width: 100%;
    height: 100%;
    padding-top: 50px;
    display: flex;
    .left {
      width: 272px;
      height: 100%;
      background-color: #ffffff;
      box-shadow: 2px 3px 10px 0px rgba(131,131,131,0.28);
      .result_ul {
        width: 100%;  
        margin-top: 10px;
        padding-left: 20px;
        padding-right: 10px;
        >li {
          width: 100%;
          line-height: 30px;
          display: flex;
          flex-wrap: wrap;
          span:first-child {
            color: #666666;
          }
          span:last-child {
            color: #222222;
          }
        }
        .person_list {
          >span {
            width: 70px;
            display: inline-block;
          }
          >p {
            width: calc(100% - 70px);
          }
        }
        .area_list{
          width: 100%;
          display: inherit;
          >div {
            display: flex;
            >span {
              width: 80px;
              display: inline-block;
            }
            >p {
              width: calc(100% - 80px);
            }
          }
        }
        
      }
    }
    .right {
      width: calc(100% - 272px);
      height: 100%;
      position: relative;
      //地图样式
      .gis_content {
        height: 100%;
        position: relative;
        overflow: hidden;
        .map_rm {
          width: 100%;
          height: 100%;
        }
        // 地图搜索
        .sd_search {
          position: absolute;
          top: 0.3rem;
          left: 0.3rem;
          z-index: 1000;
          background-color: #fff;
          overflow: hidden;

          > .sd_search_input {
            float: left;
            width: 360px;
            height: 36px;
            line-height: 36px;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0px 3px 10px 0px rgba(99, 99, 99, 0.39);
            border: 0;
            padding: 0 15px;
            border: none;
          }
          > span {
            float: left;
            width: 60px;
            height: 36px;
            line-height: 36px;
            background-color: #0c70f8;
            cursor: pointer;
            text-align: center;
            > i {
              position: relative;
              top: 2px;
              color: #fff;
              font-size: 20px;
            }
          }
        }
        //定位
        .map_control {
          position: absolute;
          bottom: 0.3rem;
          right: 0.2rem;
          transition: right 0.3s ease-out;
          animation: fadeInRight 0.4s ease-out 0.4s both;
          .photo_count_level {
            background: #fff;
            width: 0.68rem;
            padding: 0.1rem;
            font-size: 12px;
            text-align: center;
            margin-bottom: 0.2rem;
            .colors {
              padding-bottom: 0.1rem;
              > p {
                color: #999999;
              }
              > div {
                width: 0.48rem;
                height: 0.1rem;
                border-radius: 0.05rem;
              }
            }
            .colors:nth-of-type(1) > div {
              background: #fa453a;
            }
            .colors:nth-of-type(2) > div {
              background: #f4ba18;
            }
            .colors:nth-of-type(3) > div {
              background: #8949f3;
            }
            .colors:nth-of-type(4) > div {
              background: #6262ff;
            }
            .colors:nth-of-type(5) > div {
              background: #0c70f8;
            }
            .colors:nth-of-type(6) > div {
              background: #0d9df4;
            }
          }
          // 地图控制按钮
          .map_rrt_u2 {
            width: 0.68rem;
            text-align: center;
            padding: 0 0.1rem;
            font-size: 0.2rem;
            color: #1264f8;
            background-color: #fff;
            > li {
              line-height: 0.5rem;
              border-bottom: 1px solid #eee;
              padding: 0.1rem 0;
              cursor: pointer;
              &:last-child {
                border-bottom: none;
              }
              > i {
                margin-top: 0;
                display: inline-block;
              }
            }
          }
        }
      }
    }
  }
}
</style>