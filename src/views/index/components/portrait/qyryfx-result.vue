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
              <span>虚招张三的嫌疑人</span>
            </li>
            <li>
              <span>关注人群：</span>
              <span>重点关注人群</span>
            </li>
            <li>
              <span>性别：</span>
              <span>不限</span>
            </li>
            <li>
              <span>年龄段：</span>
              <span>不限</span>
            </li>
            <li class="area_list">
              <div>
                <span>区域1时间：</span>
                <div class="time_box">
                  <p>2018-12-12 12:12:12</p>
                  <p>2018-12-12 12:12:12</p>
                </div>
              </div>
              <div>
                <span>区域1设备：</span>
                <p>摄像头名称1、摄像头名称2、摄像头名称3</p>
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
        <!-- <div class="info_right" v-show="infoRightShow">
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
                  v-for="(item, index) in cameraPhotoList"
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
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import vlBreadcrumb from "@/components/common/breadcrumb.vue";
import { mapXupuxian } from "@/config/config.js";
export default {
  components: { vlBreadcrumb },
  data () {
    return {
      taskResult: null, // 分析结果
      taskParams: null, // 分析参数
      map: null, // 地图对象
    }
  },
  mounted () {
    this.initMap();
    if (this.$route.query.taskResult) {
      this.taskResult = JSON.parse(this.$route.query.taskResult);
    }
    if (this.$route.query.param) {
      this.taskParams = JSON.parse(this.$route.query.param);
    }
  },
  methods: {
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    resetZoom () {
      if (this.map) {
        this.map.setZoomAndCenter(15, mapXupuxian.center);
        this.map.setFitView();
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

      _this.map = map;

      // _this.mapMark(obj);
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
          span:first-child {
            color: #666666;
          }
          span:last-child {
            color: #222222;
          }
        }
        .area_list {
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