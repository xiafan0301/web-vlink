<template>
  <div class="vl_judge_tc">
    <div class="">
      <div is="vlBreadcrumb"
           :breadcrumbData="[{name: '人像侦查', routerName: 'portrait_menu'},
            {name: '以图搜人', routerName: 'portrait_ytsr_moment'},
            {name: '搜索结果'}]">
      </div>
    </div>
    <div class="vl_j_left">
      <img :src="taskDetail.uploadImgUrls" alt="">
      <!--<img src="http://file.aorise.org/vlink/image/447e505b-03f9-4775-8416-68ca3f9e6ee5.jpg" alt="">-->
      <div class="vl_ytsr_left_line" v-show="taskDetail.taskName">
        <span>任务名称：</span>{{taskDetail.taskName}}
      </div>
      <div class="vl_ytsr_left_line">
        <span>相似度：</span>≥{{taskDetail ? taskDetail.minSemblance : 0}}%
      </div>
      <div class="vl_ytsr_left_line">
        <span>抓拍时间：</span>
        <span>
          <p>{{taskDetail.startTime}}</p>
          <p>{{taskDetail.endTime}}</p>
        </span>
      </div>
      <div class="vl_ytsr_left_line">
        <span>抓拍设备：</span>
        <span>
           <p v-for="item in taskDetail.deviceNames" :key="item.id">{{item}}</p>
        </span>
      </div>
    </div>
    <div class="vl_s_right">
      <div class="vl_jig_right">
        <template v-if="strucInfoList && strucInfoList.length > 0">
          <div class="vl_jig_right_title">
            <div class="vl_jr_t_item">
              <span><span style="color: #333333">检索结果 </span> ({{strucInfoList.length}})</span>
              <div :class="{'active-item': stucOrder < 3}" @click="timeOrderS">时间排序 <span><i :class="{'active': stucOrder === 2}" class="el-icon-caret-top"></i><i :class="{'active': stucOrder === 1}" class="el-icon-caret-bottom"></i></span></div>
            </div>
            <div class="vl_jr_t_item">
              <div :class="{'active-item': stucOrder === 3}" @click="stucOrder = 3">监控排序</div>
              <div :class="{'active-item': stucOrder === 4}" @click="stucOrder = 4" style="margin-left: .1rem;">相似度排序</div>
            </div>
          </div>
          <div class="vl_jfo_event">
            <vue-scroll>
              <div class="vl_jfo_event_box clearfix">
                <div class="vl_jfo_box_item" v-for="(item, index) in strucInfoList" :key="item.id" @click="showStrucInfo(item, index)">
                  <div class="vl_jfo_i_left"><img :src="item.subStoragePath" alt=""></div>
                  <div class="vl_jfo_i_right">
                    <p>检索资料</p>
                    <div class="vl_jfo_line"><span>{{item.shotTime}}</span></div>
                    <br>
                    <div class="vl_jfo_line"><span>{{item.deviceName}}</span></div>
                    <div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_03"></i>{{(item.semblance*1).toFixed(2)}}<span style="font-size: 12px;">%</span></div>
                  </div>
                </div>
              </div>
            </vue-scroll>
          </div>
        </template>
        <template v-else>
          <div is="noResult"></div>
        </template>
      </div>
    </div>
    <!--检索详情弹窗-->
    <el-dialog
      :visible.sync="strucDetailDialog"
      class="struc_detail_dialog_ytsr_shot"
      :close-on-click-modal="false"
      top="4vh"
      :show-close="false">
      <div class="struc_tab">
        <span :class="{'active': strucCurTab === 1}" @click="strucCurTab = 1">检索详情</span>
        <span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>
        <span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>
        <i class="el-icon-close" @click="strucDetailDialog = false"></i>
      </div>
      <div class="struc_main">
        <ul v-show="strucCurTab === 1">
          <!-- <li><span>抓拍设备：{{sturcDetail.deviceName}}</span></li> -->
          <li><span style="line-height: 0.24rem;">抓拍地址：{{sturcDetail.address}}</span></li>
          <li style="color: #999;line-height: 0.24rem;">{{sturcDetail.shotTime}}</li>
        </ul>
        <div v-show="strucCurTab === 1" class="struc_c_detail">
          <div class="struc_c_d_qj struc_c_d_img">
            <img :src="sturcDetail.personStoragePath" alt="">
            <span>上传图</span>
          </div>
          <div class="struc_c_d_box">
            <div class="struc_c_d_img">
              <img class="bigImg" :src="sturcDetail.subStoragePath" alt="">
              <span>抓拍图</span>
            </div>
            <div class="struc_c_d_info">
              <h2>分析结果<div class="vl_jfo_sim" ><i class="vl_icon vl_icon_retrieval_03"></i>{{sturcDetail.semblance ? (sturcDetail.semblance*1).toFixed(2) : '0.00'}}<span style="font-size: 12px;">%</span></div></h2>
              <div class="struc_cd_info_main">
                <vue-scroll>
                  <div class="struc_cdi_line" v-if="sturcDetail.sex">
                    <p>
                      <b>性别</b>
                      <span>{{sturcDetail.sex}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.age">
                    <p>
                      <b>年龄段</b>
                      <span>{{sturcDetail.age}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.glasses">
                    <p>
                      <b>眼镜</b>
                      <span>{{sturcDetail.glasses}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.hat">
                    <p>
                      <b>帽子</b>
                      <span>{{sturcDetail.hat}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.mask">
                    <p>
                      <b>口罩</b>
                      <span>{{sturcDetail.mask}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.hair">
                    <p>
                      <b>发型</b>
                      <span>{{sturcDetail.hair}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.upperType">
                    <p>
                      <b>上身款式</b>
                      <span>{{sturcDetail.upperType}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.upperColor">
                    <p>
                      <b>上身颜色</b>
                      <span>{{sturcDetail.upperColor}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.bottomType">
                    <p>
                      <b>下身款式</b>
                      <span>{{sturcDetail.bottomType}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.bottomColor">
                    <p>
                      <b>下身颜色</b>
                      <span>{{sturcDetail.bottomColor}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.baby">
                    <p>
                      <b>抱小孩</b>
                      <span>{{sturcDetail.baby}}</span>
                    </p>
                  </div>
                  <div class="struc_cdi_line" v-if="sturcDetail.bag">
                    <p>
                      <b>拎东西</b>
                      <span>{{sturcDetail.bag}}</span>
                    </p>
                  </div>
                </vue-scroll>
              </div>
            </div>
          </div>
          <!--跳转按钮-->
          <div class="struc_t_btn">
            <a @click="gotoControl(sturcDetail.subStoragePath)">新建布控</a>
            <a @click="gotoLjd(sturcDetail.subStoragePath)">落脚点分析</a>
            <a @click="gotoGjfx(sturcDetail.subStoragePath)">轨迹分析</a>
            <!--<a @click="gotoIden(sturcDetail.subStoragePath)">身份确认</a>-->
          </div>
        </div>
        <div v-show="strucCurTab === 2" class="struc_c_address"></div>
        <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video">
          <div class="struc_c_d_qj struc_c_d_img">
            <img class="bigImg" :src="sturcDetail.subStoragePath" alt="">
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_box" style="float: left;" v-if="playerData">
            <div is="flvplayer" :oData="playerData"
                 :oConfig="{fit: false, sign: false, pause: true, close: false, tape: false, download: false}">
            </div>
          </div>
          <div class="struc_c_d_box struc_vid_empty" style="float: left;" v-else>
            <div class="struc_vid_empty_c com_trans50_lt">
              <div></div>
              <p>暂无视频</p>
            </div>
          </div>
          <p class="download_tips" v-show="sturcDetail.videoPath">下载提示：右键点击视频选择“另存视频为”即可下载视频。</p>
        </div>
      </div>
      <div class="struc-list">
        <swiper :options="swiperOption" ref="mySwiper">
          <!-- slides -->
          <swiper-slide v-for="(item, index) in strucInfoList" :key="item.id">
            <div class="swiper_img_item" :class="{'active': index === curImgIndex}" @click="imgListTap(item, index)">
              <img style="height: .88rem;width: 50%;padding-right: .02rem;" :src="item.personStoragePath" alt="">
              <img style="height: .88rem;width: 50%;padding-left: .02rem;" :src="item.subStoragePath" alt="">
              <div class="vl_jfo_sim"><i class="vl_icon vl_icon_retrieval_05" :class="{'vl_icon_retrieval_06':  index === curImgIndex}"></i>{{item.semblance ? (item.semblance*1).toFixed(2) : '0.00'}}<span style="font-size: 12px;">%</span></div>
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
    </el-dialog>
    <div id="capMap"></div>
  </div>
</template>
<script>
  import vlBreadcrumb from '@/components/common/breadcrumb.vue';
  import flvplayer from '@/components/common/flvplayer.vue';
  import { formatDate } from "@/utils/util.js";
  import { mapXupuxian } from "@/config/config.js";
  import noResult from '@/components/common/noResult.vue';
  import { getPeopleTaskDetail } from '@/views/index/api/api.analysis.js';
  import { PortraitPostByphotoRealtime} from '@/views/index/api/api.portrait.js';
  let AMap = window.AMap;
  export default {
    components: {vlBreadcrumb, noResult, flvplayer},
    data() {
      return {
        playerData: null,
        swiperOption: {
          slidesPerView: 5,
          spaceBetween: 10,
          slidesPerGroup: 5,
          loop: false,
          slideToClickedSlide: true,
          loopFillGroupWithBlank: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        },
        pagination: { total: 0, pageSize: 12, pageNum: 1 },
        mapData: [],
        amap: null, // 地图实例
        markerPoint: null, // 地图点集合
        InfoWindow: null,
        curVideoUrl: '',
        playing: false, // 视频播放是否
        historyPicDialog: false,
        stucOrder: 4, // 1升序，2降序，3监控，4相似度
        taskDetail: {},
        strucInfoList: [], // 检索抓拍信息
        strucCurTab: 1,
        curImgIndex: 0,
        sturcDetail: {},
        strucDetailDialog: false,
        devicePinYin: 'abcdefghijklmnopqrstuvwxyz',
        videoUrl: '' // 弹窗视频回放里的视频
      }
    },
    mounted () {
      // 弹窗地图
      let supMap = new AMap.Map('capMap', {
        center: mapXupuxian.center,
        zoom: 16
      });
      supMap.setMapStyle('amap://styles/whitesmoke');
      this.map = supMap;
      if (this.$route.query.uid) {
        this.getDetail();
      } else {
        this.getTheList();
      }
    },
    methods: {
      gotoControl (url) {
        this.$router.push({ name: 'control_create', query: {modelName: "人员追踪", imgurl: url} })
      },
      gotoLjd (url) {
        this.$router.push({ name: 'portrait_ljd', query: {imgurl: url} })
      },
      gotoGjfx (url) {
        this.$router.push({ name: 'portrait_gjfx', query: {imgurl: url} })
      },
      gotoIden (url) {
        this.$router.push({ name: 'portrait_ljd', query: {imgurl: url} })
      },
      // 设置视频数据
      setPlayerData () {
        if (this.sturcDetail.videoPath) {
          this.playerData = {
            type: 3,
            title: this.sturcDetail.deviceName,
            video: {
              uid: new Date().getTime() + '',
              downUrl: this.sturcDetail.videoPath
            }
          }
        } else {
          this.playerData = null;
        }
      },
      timeOrderS () {
        if (this.stucOrder > 2) {
          this.stucOrder = 2;
        } else {
          this.stucOrder === 1 ? this.stucOrder = 2 : this.stucOrder = 1;
        }
      },
      // 获取实时
      getTheList () {
        PortraitPostByphotoRealtime(this.$route.query)
            .then(sRes => {
              if (sRes) {
                this.$set(sRes.data, 'taskResult', JSON.parse(sRes.data.taskResult));
                this.$set(sRes.data, 'taskWebParam', JSON.parse(sRes.data.taskWebParam));
                sRes.data.taskWebParam.deviceNames = sRes.data.taskWebParam.deviceNames.split(',')
                this.strucInfoList = sRes.data.taskResult;
                this.changeOrder();
                this.taskDetail = sRes.data.taskWebParam;
                console.log(sRes.data)
              }
            })
      },
      // 获取离线任务详情
      getDetail () {
        const id = this.$route.query.uid
        if (id) {
          getPeopleTaskDetail(id)
              .then(res => {
                if (res) {
                  this.$set(res.data, 'taskResult', JSON.parse(res.data.taskResult));
                  this.$set(res.data, 'taskWebParam', JSON.parse(res.data.taskWebParam));
                  res.data.taskWebParam.deviceNames = res.data.taskWebParam.deviceNames.split(',')
                  this.strucInfoList = res.data.taskResult;
                  this.changeOrder();
                  this.taskDetail = res.data.taskWebParam;
                  console.log(res.data)
                }
              })
        }
      },
      changeOrder () {
        console.log(this.stucOrder);
        switch (this.stucOrder) {
          case 1:
            this.strucInfoList.sort((a, b) => {
              return new Date(b.shotTime).getTime() - new Date(a.shotTime).getTime();
            })
            break;
          case 2:
            this.strucInfoList.sort((a, b) => {
              return new Date(a.shotTime).getTime() - new Date(b.shotTime).getTime();
            })
            break;
          case 3:
            this.strucInfoList.sort((a, b) => {
              return this.devicePinYin.indexOf(b.deviceNamePinyin.toLowerCase()[0]) - this.devicePinYin.indexOf(a.deviceNamePinyin.toLowerCase()[0]);
            })
            break;
          case 4:
            this.strucInfoList.sort((a, b) => {
              return b.semblance - a.semblance;
            })
            break;
        }
      },
      showStrucInfo (data, index) {
        this.curImgIndex = index;
        this.strucDetailDialog = true;
        this.sturcDetail = data;
        this.strucCurTab = 1;
        this.drawPoint(data);
        this.setPlayerData();
      },
      drawPoint (data) {
        this.$nextTick(() => {
          $('.struc_c_address').append($('#capMap'))
        })
        if (this.supMarkerPoint) {
          this.map.remove(this.supMarkerPoint)
        }
        let _content = '<div class="vl_icon vl_icon_judge_02"></div>'
        this.supMarkerPoint = new AMap.Marker({ // 添加自定义点标记
          map: this.map,
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
          offset: new AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: _content
        });
        this.map.setZoomAndCenter(16, [data.shotPlaceLongitude, data.shotPlaceLatitude]); // 自适应点位置
        let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`
        new AMap.InfoWindow({
          map: this.map,
          isCustom: true,
          closeWhenClickMap: false,
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude],
          offset: new AMap.Pixel(0, -70),
          content: sConent
        })
      },
      imgListTap (data, index) {
        this.curImgIndex = index;
        this.sturcDetail = data;
        this.drawPoint(data);
        this.setPlayerData();
      },
      tcDiscuss () {},
      videoTap () {
        let vDom = document.getElementById('capVideo')
        if (this.playing) {
          vDom.pause();
        } else {
          vDom.play();
        }
        vDom.addEventListener('ended', (e) => {
          e.target.currentTime = 0;
          this.playing = false;
        })
        this.playing = !this.playing;
      }
    },
    watch: {
      stucOrder () {
        this.changeOrder();
      }
    }
  }
</script>
<style lang="scss">
  .breadcrumb_heaer {
    background: #ffffff;
    border-bottom: 1px solid #D3D3D3;
  }
  .cap_info_win {
    background: #FFFFFF;
    padding: .18rem;
    font-size: .14rem;
    color: #666666;
    position: relative;
    &:after {
      display: block;
      content: '';
      border: .1rem solid #FFFFFF;
      border-color: #FFFFFF transparent transparent;
      position: absolute;
      bottom: -.2rem;
      left: calc(50% - .05rem);
    }
  }
  .vl_judge_tc {
    width: 100%;
    height: 100%;
    .vl_j_left {
      float: left;
      width: 272px;
      padding-top: 20px;
      padding-left: 20px;
      height: calc(100% - 56px);
      min-height: 788px;
      background: #ffffff;
      box-shadow: 2px 3px 10px 0px rgba(131, 131, 131, 0.28);
      animation: fadeInLeft .4s ease-out .3s both;
      > img {
        width: 232px;
        height: 232px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        margin-bottom: 30px;
      }
      .vl_ytsr_left_line {
        color: #555555;
        margin-bottom: 20px;
        display: flex;
        span {
          /*width: 70px;*/
          text-align: right;
          display: block;
          color: #999999;
          p {
            color: #555555;
            text-align: left;
          }
          &:first-child {
            width: 85px;
          }
        }
      }
    }
    .vl_s_right {
      display: inline-block;
      width: calc(100% - 272px);
      height: calc(100% - 60px);
      position: relative;
      .vl_jig_right {
        width: 100%;
        height: 100%;
        padding: 0 20px;
        padding-right: 0;
        .vl_jig_right_title {
          width: 100%;
          height: 70px;
          line-height: 70px;
          color: #999999;
          .vl_jr_t_item {
            float: left;
            width: 50%;
            text-align: left;
            padding-left: 10px;
            >div {
              cursor: pointer;
              display: inline-block;
            }
            .active-item {
              color: #2580FC;
              i {
                color: #999999;
              }
              .active {
                color: #2580FC;
              }
            }
            &:first-child {
              padding-right: 10px;
              padding-left: 0;
              >div {
                float: right;
                span {
                  display: inline-block;
                  vertical-align: middle;
                  i {
                    display: block;
                    font-size: 10px;
                  }
                }
              }
            }
          }
        }
        .vl_jfo_event {
          height: calc(100% - 70px);
          min-height: 693px;
          .vl_jfo_event_box {
            width: 100%;
            height: auto;
            .vl_jfo_box_item {
              float: left;
              cursor: pointer;
              width: 387px;
              height: 203px;
              padding: 20px;
              margin-right: 20px;
              margin-bottom: 20px;
              background: rgba(255, 255, 255, 1);
              box-shadow: 0px 5px 16px 0px rgba(169, 169, 169, 0.2);
              .vl_jfo_i_left {
                float: left;
                width: 163px;
                height: 163px;
                >img {
                  width: 100%;
                  height: 100%;
                }
              }
              .vl_jfo_i_right {
                width: calc(100% - 163px);
                height: 100%;
                margin-left: 163px;
                padding-left: 10px;
                >p {
                  color: #999999;
                  margin-bottom: 13px;
                }
                .vl_jfo_line {
                  position: relative;
                  max-width: 100%;
                  display: inline-block;
                  height: 28px;
                  line-height: 28px;
                  margin-bottom: 8px;
                  border: 1px solid #F2F2F2;
                  background: #FAFAFA;
                  color: #333333;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  border-radius:3px;
                  font-size: 12px;
                  overflow: hidden;
                  padding-right: 4px;
                  > i {
                    vertical-align: middle;
                  }
                  span {
                    padding: 0 4px;
                  }
                }
              }
            }
          }
        }
      }
    }
    .vl_jfo_sim {
      color: #0C70F8;
      font-weight: bold;
      font-size: 24px;
      margin-top: -4px;
      i {
        vertical-align: text-top;
        margin-right: 10px;
      }
      span {
        font-weight: normal;
      }
    }
    .vl_j_fullscreen {
      position: fixed;
      width: 100%!important;
      height: 100%!important;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: #000000;
      z-index: 9999;
      -webkit-transition: all .4s;
      -moz-transition: all .4s;
      -ms-transition: all .4s;
      -o-transition: all .4s;
      transition: all .4s;
      > video {
        width: 100%;
        height: 100%;
      }
      > .control_bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 48px;
        background: rgba(0, 0, 0, .65);
        > div {
          float: left;
          width: 50%;
          height: 100%;
          line-height: 48px;
          text-align: right;
          padding-right: 20px;
          color: #FFFFFF;
          &:first-child {
            text-align: left;
            padding-left: 20px;
          }
          > span {
            display: inline-block;
            height: 22px;
            margin-left: 10px;
            vertical-align: middle;
            cursor: pointer;
            a {
              font-size: 25px;
              text-decoration: none;
              color: #ffffff;
              vertical-align: top;
            }
          }
        }
      }
    }
    .vl_j_cutscreen {
      position: fixed;
      width: 90%!important;
      height: 90%!important;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: #FFFFFF;
      z-index: 9999;
      -webkit-transition: all .4s;
      -moz-transition: all .4s;
      -ms-transition: all .4s;
      -o-transition: all .4s;
      transition: all .4s;
      padding: 20px;
      margin: auto;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .close_btn {
      position: absolute;
      top: 30px;
      right: 30px;
      font-size: .3rem;
      cursor: pointer;
      &:hover {
        color: #409EFF;
      }
    }
    .vl_jtc_mk {
      width: 2.18rem;
      height: 1.22rem;
      position: relative;
      > video {
        width: 100%;
        height: 100%;
      }
      > p {
        position: absolute;
        color: #FFFFFF;
        bottom: .08rem;
        font-size: .12rem;
        padding-left: .06rem;
      }
    }
    .vl_jtc_mk_check {
      > input {
        position: absolute;
        top: .08rem;
        right: .08rem;
        &:after {
          position: absolute;
          width: 14px;
          height: 14px;
          top: 0;
          content: '';
          background-color: #FFFFFF;
          color: #fff;
          display: block;
          border: 1px solid #409EFF;
          line-height: 11px;
          text-align: center;
          border-radius: 3px;
        }
      }
      > input:checked {
        &:after {
          background-color: #409EFF;
          content: '✓';
          font-size: 10px;
        }
      }
    }
    .history-pic-dialog {
      .el-dialog {
        max-width: 12.6rem;
        width: 100%!important;
      }
      .el-dialog__title {
        font-size: .16rem;
        color: #333333;
      }
      .el-dialog__body {
        padding: 0 .76rem .3rem;
      }
      .his-pic-box {
        width: 100%;
        height: 4.6rem!important;
        .his-pic-item {
          float: left;
          width: 1.38rem;
          height: 1.38rem;
          border: .02rem solid #FFFFFF;
          margin-right: .2rem;
          margin-bottom: .2rem;
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .active {
          border-color: #0C70F8;
        }
      }
      .el-dialog__footer {
        button {
          width: 1.4rem!important;
          height: .4rem;
          line-height: .4rem;
          padding: 0;
        }
      }
    }
    .struc_detail_dialog_ytsr_shot {
      .el-dialog {
        max-width: 13.06rem;
        width: 100%!important;
      }
      .el-dialog__header {
        display: none;
      }
      .struc_tab {
        height: 1.16rem;
        padding: .3rem 0;
        position: relative;
        color: #333333;
        span {
          display: inline-block;
          margin-right: .55rem;
          padding-bottom: .1rem;
          cursor: pointer;
        }
        .active {
          color: #0C70F8;
          border-bottom: 2px solid #0C70F8;
        }
        i {
          display: block;
          position: absolute;
          top: .3rem;
          right: 0px;
          cursor: pointer;
        }
      }
      .struc_main {
        width: 11.46rem;
        height: 5rem;
        margin: 0 auto;
        border-bottom: 1px solid #F2F2F2;
        .struc_c_detail {
          width:  100%;
          height: 3.6rem;
          >div {
            float: left;
          }
          .struc_c_d_img {
            width: 3.6rem;
            height: 3.6rem;
            background: #EAEAEA;
            position: relative;
            img {
              width: 100%;
              height: auto;
              max-height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
            }
            i {
              display: block;
              position: absolute;
              top: .1rem;
              right: .1rem;
              line-height: .26rem;
              height: .26rem;
              background: rgba(255, 255, 255, .8);
              border-radius: .13rem;
              font-style: normal;
              color: #0C70F8;
              font-size: 12px;
              padding: 0 .1rem;
            }
            &:before {
              display: block;
              content: '';
              position: absolute;
              top: -.5rem;
              left: -.5rem;
              transform: rotate(-45deg);
              border: .5rem solid #50CC62;
              border-color: transparent transparent #50CC62;
              z-index: 9;
            }
            span {
              display: block;
              position: absolute;
              top: .1rem;
              left: .1rem;
              width: .6rem;
              height: .6rem;
              text-align: center;
              color: #FFFFFF;
              font-size: .12rem;
              -webkit-transform: rotate(-45deg);
              -moz-transform: rotate(-45deg);
              -ms-transform: rotate(-45deg);
              -o-transform: rotate(-45deg);
              transform: rotate(-45deg);
              z-index: 99;
            }
          }
          .struc_c_d_qj {
            margin-right: .3rem;
            &:before {
              border: .5rem solid #0c70f8;
              border-color: transparent transparent #0C70F8;
            }
          }
          .struc_c_d_box {
            width: calc(100% - 3.9rem);
            box-shadow:0px 5px 16px 0px rgba(169,169,169,0.2);
            border-radius:1px;
            position: relative;
            overflow: hidden;
            >div {
              float: left;
            }
            .struc_c_d_info {
              width: calc(100% - 3.6rem);
              padding-left: .24rem;
              color: #333333;
              h2 {
                font-weight: bold;
                line-height: .74rem;
                padding-right: 1rem;
                .vl_jfo_sim {
                  color: #0C70F8;
                  font-weight: bold;
                  font-size: .24rem;
                  float: right;
                  i {
                    vertical-align: text-bottom;
                    margin-right: .1rem;
                  }
                  span {
                    font-weight: normal;
                  }
                }
              }
              .struc_cd_info_main {
                height: 2.75rem;
              }
              .struc_cdi_line {
                flex: none;
                width: 50%;
                display: inline-block;
                p {
                  max-width: 100%;
                  overflow: hidden;
                  display: table;
                  min-height: 30px;
                  margin-bottom: 0.08rem;
                  padding-right: 10px;
                  margin-right: 0.08rem;
                  border: 1px solid #f2f2f2;
                  border-radius: 3px;
                  font-size: 12px;
                  > b {
                    width: 70px;
                    background: #fafafa;
                    color: #999;
                    font-weight: normal;
                    padding-right: 10px;
                    padding-left: 10px;
                    display: table-cell;
                    vertical-align: middle;
                    border-right: 1px solid #f2f2f2;
                  }
                  >span {
                    display: table-cell;
                    vertical-align: middle;
                    padding-left: 5px;
                  }
                }
              }
            }
            &:before {
              display: block;
              content: none!important;
              position: absolute;
              top: -.7rem;
              right: -.7rem;
              transform: rotate(-46deg);
              border: .7rem solid #0c70f8;
              border-color: transparent transparent transparent #0C70F8;
            }
            &:after {
              display: block;
              content: none!important;
              position: absolute;
              top: -.4rem;
              right: -.4rem;
              transform: rotate(-45deg);
              border: .4rem solid #FFFFFF;
              border-color: transparent transparent transparent #FFFFFF;
            }
            >span {
              display: block;
              position: absolute;
              top: .19rem;
              right: .19rem;
              width: 1rem;
              height: 1rem;
              text-align: center;
              color: #FFFFFF;
              font-size: .12rem;
              -webkit-transform: rotate(45deg);
              -moz-transform: rotate(45deg);
              -ms-transform: rotate(45deg);
              -o-transform: rotate(45deg);
              transform: rotate(45deg);
              z-index: 99;
            }
          }
          .struc_t_btn {
            margin-top: .2rem;
            float: right;
            a {
              display: inline-block;
              text-align: center;
              line-height: .38rem;
              border: solid 1px #eeeeee;
              border-radius: 4px;
              margin-top: 10px;
              padding: 0px .15rem;
              text-decoration: none;
              margin-left: 10px;
              background: rgba(246, 248, 249, 1);
              border: 1px solid rgba(211, 211, 211, 1);
              cursor: pointer;
            }
            a:hover {
              background: #0c70f8;
              border: solid 1px #0c70f8;
              color: #ffffff;
            }
          }
        }
        .struc_c_address {
          height: 100%;
          #capMap {
            width:  100%;
            height: 100%;
          }
        }
        .struc_c_video {
          .download_tips {
            float: left;
            width: 100%;
            text-align: right;
            padding-right: 40px; padding-top: 10px;
          }
          .struc_c_d_box {
            background: #E9E7E8;
            height: 100%;
            text-align: center;
            &:hover {
              .play_btn {
                display: block!important;
              }
            }
            .play_btn {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
              background: rgba(0, 0, 0, .4);
              width: 1rem;
              height: 1rem;
              text-align: center;
              line-height: 1rem;
              -webkit-border-radius: 50%;
              -moz-border-radius: 50%;
              border-radius: 50%;
              cursor: pointer;
              i {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                height: 22px!important;
              }
            }
            >video {
              width: auto;
              height: 100%;
            }
            &:after {
              content: none!important;
            }
            &:before {
              content: none!important;
            }
            -webkit-box-shadow: 0 0 0!important;
            -moz-box-shadow: 0 0 0!important;
            box-shadow: 0 0 0!important;
          }
          .download_btn {
            text-align: center;
            width: 1.1rem;
            height: .4rem;
            float: right!important;
            margin-top: .2rem;
            background: rgba(246,248,249,1);
            border: 1px solid rgba(211,211,211,1);
            border-radius: 4px;
            line-height: .4rem;
            cursor: pointer;
            color: #666666;
            position: relative;
            &:hover {
              color: #FFFFFF;
              background: #0C70F8;
              border-color: #0C70F8;
            }
            a {
              display: block;
              position: absolute;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .struc-list {
        width: 12.46rem;
        margin: 0 auto;
        padding: .44rem 0 .34rem 0;
        .swiper-container {
          padding: .02rem .5rem;
          &:before {
            display: block;
            content: '';
            width: .5rem;
            height: 110%;
            background: #FFFFFF;
            position: absolute;
            left: 0;
            z-index: 9;
            border: 1px solid #FFFFFF;
          }
          &:after {
            display: block;
            content: '';
            width: .5rem;
            height: 110%;
            background: #FFFFFF;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 9;
            border: 1px solid #FFFFFF;
          }
          .swiper-button-next {
            right:  0;
          }
          .swiper-button-prev {
            left: 0;
          }
          .swiper-slide {
            .swiper_img_item {
              cursor: pointer;
              border: 1px solid #FFFFFF;
              padding: 2px;
              img {
                width: 100%;
                height: 100%;
              }
              .vl_jfo_sim {
                font-size: .14rem;
                height: .3rem;
                margin-top: 0;
                /*display: inline-block;*/
                white-space: nowrap;
                text-align: center;
                color: #999999;
                i {
                  margin-right: 0;
                }
              }
            }
            .active {
              border-color: #0C70F8;
              box-shadow: inset 0px 3px 3px #c8c8c8;
              .vl_jfo_sim {
                color: #0C70F8;
              }
            }
          }
        }
      }
    }
  }
  .per_semblance {
    position: relative;
    >span {
      position: absolute;
      left: 20px;
      display: block;
      height: 40px;
      line-height: 40px;
      z-index: 9;
    }
    >i {
      display: inline-block;
      width: 20px;
      height: 1px;
      background: #999;
      margin: 19px 16px;
      vertical-align: middle;
    }
    .el-input {
      width: 148px;
      input{
        text-indent: 60px;
      }
    }
  }
</style>