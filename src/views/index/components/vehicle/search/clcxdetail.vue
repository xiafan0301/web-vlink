<template>
  <div class="point">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/vehicle/menu' }">车辆侦查</el-breadcrumb-item>
        <el-breadcrumb-item>车辆查询</el-breadcrumb-item>
        <el-breadcrumb-item>过车详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="left">
      <div class="plane">
        <h3 class="title">车辆详情</h3>
        <div class="infomation">
          <div class="first">
            <span>{{detailData.plateno}}</span>
            <span>{{detailData.color}}</span>
          </div>
          <div class="div">
            <span>{{detailData.brand}}</span>
            <label>中文品牌</label>
          </div>
          <div class="div">
            <span>{{detailData.status}}</span>
            <label>机动车状态</label>
          </div>
          <div class="div">
            <span>{{detailData.vehicleLocation}}</span>
            <label>归属地</label>
          </div>
          <div class="div">
            <span>{{detailData.owner}}</span>
            <label>车辆所有人</label>
          </div>
          <div class="div">
            <span>{{detailData.idCard}}</span>
            <label>身份证</label>
          </div>
          <div class="div">
            <span>{{detailData.seatnumber}}人</span>
            <label>核定载客</label>
          </div>
          <div class="div">
            <span>{{detailData.validuntil}}</span>
            <label>有效期</label>
          </div>
          <div class="div">
            <span>{{detailData.isSurveillance}}</span>
            <label>布控车辆</label>
          </div>
          <p class="blue" @click="goToPage('vehicle_search_lxwfdetail')">查看违章记录</p>
        </div>
      </div>
    </div>
    <div class="right disflex">
      <div class="main">
        <div class="infobox">
          <div class="flex1 bkt">
            <img
              :src="snapObj.storagePath"
              class="spimg"
              v-if="showimg"
            >
            <div v-if="!showimg">
            <video id="capVideo"
              :src="snapObj.videoPath"
              class="spimg"
              autoplay
            ></video>
            <div class="play_btn" @click="videoTap" v-show="!playing">
              <i class="vl_icon vl_icon_judge_01" v-if="playing"></i>
              <i class="vl_icon vl_icon_control_09" v-else></i>
            </div>
             </div>
          </div>
          <div class="flex1">
            <h3 class="titles">抓拍信息</h3>
            <div class="infom">
              <div>
                <p class="div">
                  <span>{{snapObj.snapTime}}</span>
                  <label>抓拍时间</label>
                </p>
              </div>
              <div>
                <p class="div">
                  <span>{{snapObj.snapDevice}}</span>
                  <label>抓拍设备</label>
                </p>
              </div>
              <div>
                <p class="div">
                  <span>{{snapObj.address}}</span>
                  <label>抓拍地址</label>
                </p>
              </div>
              <span class="playSee" v-if="showimg" @click="showimg=!showimg">视频回放</span>
              <span class="playSee" v-if="!showimg" @click="showimg=!showimg">抓拍图</span>
            </div>
          </div>
        </div>
        <div class="struc-list" v-if="strucInfoList && strucInfoList.length>1">
          <swiper :options="swiperOption" ref="mySwiper">
            <!-- slides -->
            <swiper-slide v-for="(item, index) in strucInfoList" :key="item.id">
              <div
                class="swiper_img_item"
                :class="{'active': index === curImgIndex}"
                @click="imgListTap(item, index)"
              >
                <img style="width: 100%; height: 100%; min-height:0.88rem;" :src="item.subStoragePath" >
                <!-- <div class="vl_jfo_sim" v-show="showSim">
                  <i
                    class="vl_icon vl_icon_retrieval_05"
                    :class="{'vl_icon_retrieval_06':  index === curImgIndex}"
                  ></i>
                  {{item.semblance ? item.semblance : 92}}
                  <span
                    style="font-size: 12px;"
                  >%</span>
                </div> -->
              </div>
            </swiper-slide>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
          </swiper>
        </div>
      </div>
      <div class="ment">
        <div class="tablink">
          <a @click="goToPage('control_map')">车辆布控</a>
          <a @click="goToPage('vehicle_analysis_clgj')">轨迹分析</a>
          <a @click="goToPage('vehicle_search_ljd')">落脚点分析</a>
          <a @click="goToPage('vehicle_search_ws')">尾随分析</a>
          <a @click="goToPage('vehicle_search_ycsc')">以图搜车</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ScpGETstrucInfoList } from "@/views/index/api/api.search.js";
import { getSnapDetail,getArchives } from "@/views/index/api/api.judge.js";
export default {
  data() {
    return {
      curImgIndex: 0,
      showSim: false,
      showimg: true,
      playing: true,
      snapObj:{},
      strucInfoList: [
        {
          id: 1,
          photoPath:"http://webdev.aorise.org/web-vlink/assets/img/vl_photo.6f88162c.png"
        },
        {
          id: 2,
          photoPath:"http://webdev.aorise.org/web-vlink/assets/img/vl_photo.6f88162c.png"
        },
        {
          id: 3,
          photoPath:"http://webdev.aorise.org/web-vlink/assets/img/vl_photo.6f88162c.png"
        },
        {
          id: 4,
          photoPath:"http://webdev.aorise.org/web-vlink/assets/img/vl_photo.6f88162c.png"
        },
        {
          id: 5,
          photoPath:"http://webdev.aorise.org/web-vlink/assets/img/vl_photo.6f88162c.png"
        },
        {
          id: 6,
          photoPath:"http://webdev.aorise.org/web-vlink/assets/img/vl_photo.6f88162c.png"
        },
        {
          id: 7,
          photoPath:"http://webdev.aorise.org/web-vlink/assets/img/vl_photo.6f88162c.png"
        }
      ],
      swiperOption: {
        slidesPerView: 10,
        spaceBetween: 8,
        slidesPerGroup: 10,
        loop: false,
        slideToClickedSlide: true,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      detailData:{}

    };
  },
  mounted() {
    // this.tcDiscuss();
    this.getSnapDetail()
    this.getArchives()
  },
  methods: {
    goToPage(v){
      if(v=="vehicle_search_lxwfdetail"){
        this.$router.push({name:v , query:{
          datastart:this.$route.query.dateStart,
          dataend:this.$route.query.dateEnd,
          plateNo:this.$route.query.plateNo,
        }});
      }else{
        this.$router.push({name:v });
      }
        
    },
    getArchives(){
      let d={
        plateNo:this.$route.query.plateNo || "湘AN8888"
      }
      getArchives(d).then(res=>{
        if(res && res.data){
          // console.log(res);
          this.detailData=res.data
        }
      })
    },
    //
    getSnapDetail(){
      let d={
        dateStart:this.$route.query.dateStart,
        dateEnd:this.$route.query.dateEnd,
        devIds:'',
        plateNo:this.$route.query.plateNo,
        hasPlate:this.$route.query.plateNo?'1':'0'
      }
      getSnapDetail(d).then(res=>{
        if(res){
          //this.detailData=res.data
          if(res.data.snapDtoList && res.data.snapDtoList.length>0)
          this.strucInfoList = res.data.snapDtoList;
          this.snapObj=res.data.snapDtoList[0]
          // console.log(res.data);
          
        }
      })
    },
    imgListTap(data, index) {
      this.curImgIndex = index;
      console.log(index);
      this.snapObj = this.strucInfoList[index]
      // this.sturcDetail = data;
      //this.drawPoint(data);
    },
    videoTap() {
      let vDom = document.getElementById("capVideo");
      if (this.playing) {
        vDom.pause();
      } else {
        vDom.play();
      }
      vDom.addEventListener("ended", e => {
        e.target.currentTime = 0;
        this.playing = false;
      });
      this.playing = !this.playing;
    },
   
  }
};
</script>
<style lang="scss" scoped>
.point {
  width: 100%;
  height: 100%;
}
.breadcrumb_heaer {
  height: 54px;
  line-height: 54px;
  background: #ffffff;
}
.full {
  width: 100%;
}
.blue {
  color: #0c70f8;
  cursor: pointer;
}
.title {
  padding: 10px 20px;
  border-bottom: solid 1px #dddddd;
  font-size: 16px;
  font-weight: bold;
}
.titles {
  padding: 10px 20px;
  font-size: 16px;
  margin-top: 20px;
  font-weight: bold;
}
.right {
  width: calc(100% - 300px);
  height: calc(100% - 80px);
  float: right;

  margin-top: 20px;
}
.disflex {
  display: flex;
  .main {
    overflow: hidden;
    flex: 1;
    min-height: 460px;
    height: calc(100% - 20px);
    background: #ffffff;
  }
  .ment {
    width: 227px;
    height: calc(100% - 20px);

    .tablink {
      height: 100%;
      width: 197px;
      background: #ffffff;
      margin: 0px auto;
      padding: 0px 20px;
      border: solid 1px #f5f5f5;
      a {
        display: block;
        text-align: center;
        line-height: 38px;
        border: solid 1px #eeeeee;
        border-radius: 4px;
        margin-top: 20px;
        text-decoration: none;
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
}

.left {
  width: 272px;
  height: auto;
  min-height: calc(100% - 54px);
  background-color: #ffffff;
  float: left;
  z-index: 1;
  box-shadow: 4px 0px 10px 0px #838383;
  box-shadow: 4px 0px 10px 0px rgba(131, 131, 131, 0.28);
  animation: fadeInLeft 0.4s ease-out 0.3s both;
  // transition: left 0.3s ease-in;
  .plane {
    padding: 10px;
    position: relative;
    height: 100%;
  }

  .firstItem {
    margin-bottom: 5px;
  }
  .infomation {
    div:first-child {
      padding: 10px 0px;
      span {
        display: inline-block;
        padding: 6px 10px;
        background: rgba(250, 250, 250, 1);
        border: 1px solid rgba(242, 242, 242, 1);
        border-radius: 3px;
        margin-right: 10px;
      }
    }
  }
}
.playSee {
  display: inline-block;
  margin-top: 10px;
  padding: 6px 25px;
  border-radius: 4px;
  cursor: pointer;
  background: #0c70f8;
  border: solid 1px #0c70f8;
  color: #ffffff;
}
.div {
  display: inline-block;
  padding: 5px 10px;
  margin: 5px 0px;
  background: rgba(250, 250, 250, 1);
  border: 1px solid rgba(242, 242, 242, 1);
  label {
    font-size: 14px;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 24px;
    border-left: solid 1px rgba(242, 242, 242, 1);
    padding-left: 10px;
  }
  span {
    padding-right: 10px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 24px;
  }
}
.select_btn {
  background-color: #0c70f8;
  color: #ffffff;
}
.infobox {
  margin: 35px auto;
  width: 90%;
  height: calc(100% - 270px);
  min-height: 260px;
  box-shadow: 5px 5px 15px 1px #dddddd;
  display: flex;
  .flex1 {
    flex: 1;
  }
  .spimg {
    width: 100%;
    height: 100%;
  }
  .infom {
    padding: 0px 20px;
  }
}
.bkt {
  background: #e9e7e8;
  height: 100%;
  text-align: center;
  &:hover {
    .play_btn {
      display: block !important;
    }
  }
  .play_btn {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: rgba(0, 0, 0, 0.4);
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
      height: 22px !important;
    }
  }
  > video {
    width: auto;
    height: 100%;
  }
  &:after {
    content: none !important;
  }
  &:before {
    content: none !important;
  }
  -webkit-box-shadow: 0 0 0 !important;
  -moz-box-shadow: 0 0 0 !important;
  box-shadow: 0 0 0 !important;
}
.bkt {
  background: #eeeeee;
  // width: 40rem;
  // height: 40rem;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center; /*垂直居中*/
  justify-content: center; /*水平居中*/
  .spimg {
    width: 100%;
    height: auto;
    max-height: 100%;
    display: block;
    vertical-align: middle;
    align-items: center;
  }
}
.point{
.struc-list {
  // height: 100px;
  width: 90%;
  margin: 0 auto;
  padding: 0.44rem 0 0.34rem 0;
  .swiper-container {
    padding: 5px 40px;
    &:before {
      display: block;
      content: "";
      width: 30px;
      height: 110%;
      background: #ffffff;
      position: absolute;
      left: 0;
      z-index: 9;
      border: 1px solid #ffffff;
    }
    &:after {
      display: block;
      content: "";
      width: 30px;
      height: 110%;
      background: #ffffff;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 9;
      border: 1px solid #ffffff;
    }
    .swiper-button-next {
      right: 0;
    }
    .swiper-button-prev {
      left: 0;
    }
    .swiper-slide {
      .swiper_img_item {
        cursor: pointer;
        border: 1px solid #ffffff;
        padding: 2px;
        .vl_jfo_sim {
          font-size: 12px;
          height: 16px;
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
        border-color: #0c70f8;
        .vl_jfo_sim {
          color: #0c70f8;
        }
      }
    }
  }
}
}
</style>
<style lang="scss">
</style>