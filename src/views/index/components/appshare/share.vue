<template>
  <div class="share">
    <div class="share-title">
      民众互助
    </div>
    <div class="share-content">
      <div class="img-info">
        <template v-if="eventDetailObj.reporterRole === '市民'">
          <img src="../../../../assets/img/share/shimin.png" alt="">
        </template>
        <template v-else>
          <img src="../../../../assets/img/share/logo.png" alt="">
        </template>
        <div class="person-info">
          <span class="phone">{{eventDetailObj.reporterPhone}}</span>
          <span class="name">{{eventDetailObj.reporterRole}}</span>
        </div>
        <!-- <div class="part-in">
          <img src="../../../../assets/img/share/partin@2x.png" alt="">
          <span>已参与</span>
        </div> -->
      </div>
      <div class="content-info">
        <div class="content-detail">{{eventDetailObj.eventDetail}}</div>
        <div class="img-list">
          <template v-if="imgList && imgList.length > 0">
            <img
            v-for ="(item, index) in imgList"
            v-preview="item"
            :key="'item' + index"
            :src="item"
            preview-title-enable="true"
            preview-nav-enable="true"
            alt=""
            />
          </template>
          <template v-if="videoList && videoList.length > 0">
            <video id="my-video" class="video-js" preload="auto" controls
              data-setup="{}" v-for="(item, index) in videoList" :key="'item'+index">
              <source :src="item" type="video/mp4">
              <source :src="item" type="video/webm">
              <source :src="item" type="video/ogg">
              <p class="vjs-no-js"> 您的浏览器不支持 video 标签。</p>
            </video>
          </template>
        </div>
      </div>
      <div class="position">
        <div class="address">
          <img src="../../../../assets/img/share/position.png" alt="">
          <div class="address-detail">事发地点&nbsp;|&nbsp;{{eventDetailObj.eventAddress}}</div>
        </div>
        <div class="address-time">{{eventDetailObj.reportTime}}</div>
      </div>
    </div>
     <lg-preview></lg-preview>
  </div>
</template>
<script>
import { getEventDetail } from '@/views/index/api/api.event.js';
export default {
  data () {
    return {
      eventDetailObj: {},
      videoList: [],
      imgList: []
    }
  },
  created () {
    this.getEventDetail();
  },
  methods: {
    getEventDetail () {
      // 登录
      let eventId = this.$route.query.eventId;
      // const eventId = '1010b44e-68a2-4a7e-8c97-fa81a6156f24';
      const videoId = '55a7160c-9b6f-11e8-8458-3b3b0f4508db';
      getEventDetail(eventId)
        .then(res => {
          if (res && res.data) {
            res.data.attachmentList && res.data.attachmentList.map((item, index) => {
              if (item.fileType === 2) { // 视频
                this.videoList.push(item.path);
              } else if (item.fileType === 1) {
                this.imgList.push(item.path);
              }
            });
            this.eventDetailObj = res.data;
            this.eventDetailObj.reporterPhone = this.eventDetailObj.reporterPhone.substr(0, 3) + '****' + this.eventDetailObj.reporterPhone.substr(7);
          }
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.pswp--supports-fs .pswp__button--fs {
  display: none !important;
}
ul li {
  list-style: none;
}
.share {
  width: 100%;
}
.share-title {
  width: 100%;
  height: 50px;
  text-align: center;
  background: #0785FD;
  color: #fff;
  line-height: 50px;
}
.share-content {
  width: 100%;
  padding: 0 5%;
}
.img-info {
  margin-top: 20px;
  display: flex;
  align-items: center;
}
.img-info img {
  width: 50px;
  height: 50px;
}
.person-info {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}
.phone {
  color: #222222;
  font-size: 1.2rem;
}
.name {
  color: #F86D10;
  font-size: 1rem;
}
.content-info {
  margin-top: 10px;
}
.content-detail {
  font-size: 1rem;
  color: #222222;
  line-height: 20px;
}
.img-list {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
}
.img-list img {
  width: 30%;
  margin-right: 2%;
  margin-top: 1%;
  height: 100px;
}
.img-list { text-align: center; }
.img-list video {
  width: 80%;
  max-height: 300px;
  text-align: center;
  display: block;
  margin: 0 auto;
}
.position {
  margin-top: 15px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}
.address {
  width: 65%;
  max-width: 78%;
  // width: auto;
  margin-right: 10px;
  display: flex;
  align-items: center;
}
.address img {
  width: 40px;
  height: 40px;
}
.address-time {
  // width: auto;
  // min-width: 50px;
  color: #999999;
  font-size: 0.9rem;
}
.address-detail {
  width: 80%;
  height: 40px;
  line-height: 40px;
  padding: 0 3%;
  background: #F7F7F7;
  font-size: 0.9rem;
  color: #666666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
}
.divide-out {
  height: 1px;
  background: #E3E3E3;
  width: 100%;
  margin-top: -10px;
}
.comment-list {
  width: 100%;
}
.comment-ul {
  padding: 0;
}
.comment-title {
  display: flex;
  align-items: center
}
.comment-title img {
  width: 50px;
  height: 50px;
}
.comment-body {
  margin-left: 68px;
}
.divide {
  height: 1px;
  background: #E3E3E3;
  margin: 20px 0 20px 68px;
}
.comment-ul li:last-child .divide {
  display: none;
}
.part-in {
  float: right;
  width: 100px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  border-radius:6px;
  border: 1px solid #F86D10;
}
.part-in img {
  width: auto;
  height: auto;
}
.part-in span {
  color: #F86D10;
  font-size: 0.9rem;
}
@media screen and (max-width: 330px) {
  .address {
    width: 60%;
    // max-width: 73%;
  }
  .address-detail {
    font-size: 0.7rem;
  }
  .address-time {
    font-size: 0.7rem;
  }
}
</style>