<template>
  <el-dialog
    :visible.sync="strucDetailDialog"
    class="rx_detail_dialog"
    :close-on-click-modal="false"
    :append-to-body="true"
    :show-close="false"
    >
    <div class="struc_tab">
      <span :class="{'active': strucCurTab === 1}" @click="strucCurTab = 1">抓拍详情</span>
      <span :class="{'active': strucCurTab === 2}" @click="strucCurTab = 2">抓拍地点</span>
      <span :class="{'active': strucCurTab === 3}" @click="strucCurTab = 3">视频回放</span>
      <i class="el-icon-close" @click="strucDetailDialog = false"></i>
    </div>
    <div class="struc_main" >
      <i class="el-icon-arrow-left" title="上一个搜索结果" @click="sliderDetail(false)" :class="{'slider_dis': strucIndex === 0 && pagination.pageNum === 1, 'slider_sding': slidering}"></i>
      <i class="el-icon-arrow-right" title="下一个搜索结果" @click="sliderDetail(true)" :class="{'slider_dis': strucIndex === (strucInfoList.length - 1) && pagination.total <= (pagination.pageSize * (pagination.pageNum - 1) + strucIndex + 1), 'slider_sding': slidering}"></i>
      <div v-show="strucCurTab === 1" class="struc_c_detail">
        <ul>
          <!-- <li><span>抓拍设备：{{sturcDetail.deviceName}}</span></li> -->
          <li><span>抓拍地址：{{sturcDetail.address}}</span></li>
          <li style="color: #999;">{{sturcDetail.shotTime}}</li>
        </ul>
        <div class="struc_c_d_qj struc_c_d_img">
          <img :src="sturcDetail.storagePath" class="bigImg" title="点击放大图片" alt />
          <span>全景图</span>
        </div>
        <div class="struc_c_d_box">
          <div class="struc_c_d_img struc_c_d_img_green">
            <img :src="sturcDetail.subStoragePath" class="bigImg" title="点击放大图片" alt />
            <span>抓拍图</span>
          </div>
          <div class="struc_c_d_info">
            <h2>分析结果：</h2>
            <ul>
              <li><span>性别</span><span>{{sturcDetail.gender ? sturcDetail.gender : '未识别'}}</span></li>
              <li><span>年龄段</span><span>{{sturcDetail.age ? sturcDetail.age : '未识别'}}</span></li>
              <li><span>发型</span><span>{{sturcDetail.hairStyleDesc ? sturcDetail.hairStyleDesc : '未识别'}}</span></li>
              <li><span>戴眼镜</span><span>{{sturcDetail.glasses ? sturcDetail.glasses : '未识别'}}</span></li>
              <li><span>戴帽子</span><span>{{sturcDetail.hat ? sturcDetail.hat : '未识别'}}</span></li>
              <li><span>戴口罩</span><span>{{sturcDetail.mask ? sturcDetail.mask : '未识别'}}</span></li>
              <li><span>抱小孩</span><span>{{sturcDetail.baby ? sturcDetail.baby : '未识别'}}</span></li>
              <li><span>拎东西</span><span>{{sturcDetail.bag ? sturcDetail.bag : '未识别'}}</span></li>
              <li><span>上身款式</span><span>{{sturcDetail.coatLengthDesc ? sturcDetail.coatLengthDesc : '未识别'}}</span></li>
              <li><span>上身颜色</span><span>{{sturcDetail.coatColorDesc ? sturcDetail.coatColorDesc : '未识别'}}</span></li>
              <li><span>下身款式</span><span>{{sturcDetail.trousersLenDesc ? sturcDetail.trousersLenDesc : '未识别'}}</span></li>
              <li><span>下身颜色</span><span>{{sturcDetail.trousersColorDesc ? sturcDetail.trousersColorDesc : '未识别'}}</span></li>
            </ul>
             <!--  <span class='tz' v-if="sturcDetail.features"><b>特征码：</b>{{sturcDetail.features}}</span> -->
          </div>
        </div>
      </div>
      <div v-show="strucCurTab === 2" class="struc_c_address">
        <div id="portraitDetail_capMap"></div>
      </div>
      <div v-show="strucCurTab === 3" class="struc_c_detail struc_c_video clearfix">
        <div class="struc_c_d_qj struc_c_d_img" style="float: left;">
          <img class="bigImg" title="点击放大图片" :src="sturcDetail.subStoragePath" alt />
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
        <!-- <div class="download_btn" v-show="sturcDetail.videoPath">
          <a download="视频" :href="sturcDetail.videoPath">下载视频</a>
        </div> -->
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { mapXupuxian } from "@/config/config.js";
import flvplayer from '@/components/common/flvplayer.vue';
import {getFaceRetrievalPerson} from '../../../api/api.judge.js';
export default {
  /* 
    oData
      type: 1, // 1特征搜人 2以图搜人 3落脚点分析
      params: {}, // 查询参数  列表查询的参数，结果需保持一致
      list: [], // 列表
      index: 0, // 当前页的第几个（点击的人像所在的页的序号）
      pageSize: //
      total: // 
      pageNum: // 当前页（点击的人像所在的页码）
   */
  components: {flvplayer},
  props: ['detailData'],
  data () {
    return {
      type: 1,
      strucDetailDialog: false,
      slidering: false,
      /* 检索详情弹窗变量 */
      amap: null,
      markerPoint: null,
      infoWindow: null,
      playerData: null,
      strucCurTab: 1, // 1抓拍详情 2抓拍地点 3抓拍视频
      sturcDetail: {},
      strucInfoList: [],
      strucIndex: 0,
      pagination: {
        total: 0,
        pageSize: 10,
        pageNum: 1
      },
      searchLoading: false,
      params: null
    }
  },
  watch: {
    detailData (val) {
      console.log('detailData', val);
      if (val) {
        this.strucCurTab = 1;
        this.strucDetailDialog = true;
        this.strucIndex = val.index;
        this.strucInfoList = val.list;
        this.sturcDetail = this.strucInfoList[this.strucIndex];
        this.type = val.type;
        this.pagination = {
          total: val.total,
          pageSize: val.pageSize,
          pageNum: val.pageNum
        }
        this.params = val.params;
        console.log('this.sturcDetail', this.sturcDetail);
      }
    },
    // 监听人像详细信息
    sturcDetail (val) {
      // 更新地图
      if (this.strucCurTab === 2) {
        this.drawPoint(val);
      }
      // 更新视频
      if (this.strucCurTab === 3) {
        this.setPlayerData();
      }
    },
    // 监听tab
    strucCurTab(e) {
      if (e === 2) {
        this.drawPoint(this.sturcDetail);
      }
      if (e === 3) {
        this.setPlayerData();
      }
    }
  },
  methods: {
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
    // flag false 上一个， true 下一个
    sliderDetail (flag) {
      if (!this.slidering) {
        this.slidering = true;
        this.doSliderDetail(flag);
        window.setTimeout(() => {
          this.slidering = false;
        }, 600);
      }
    },
    // flag false 上一个， true 下一个
    doSliderDetail (flag) {
      // console.log(this.strucIndex);
      // console.log(this.strucInfoList.length);
      // console.log(this.pagination);
      if (flag) {
        // 下一个
        if (this.strucIndex < (this.strucInfoList.length - 1)) {
          // 序号小于LIST长度-1
          this.strucIndex = this.strucIndex + 1;
          this.sturcDetail = this.strucInfoList[this.strucIndex];
        } else {
          // 序号超出
          if (this.pagination.total > 
            (this.pagination.pageSize * (this.pagination.pageNum - 1) + this.strucIndex + 1)) {
            // 需要分页
            this.pagination.pageNum = this.pagination.pageNum + 1;
            this.strucIndex = 0;
            this.getList();
          }
        }
      } else {
        if (this.strucIndex > 0) {
          this.strucIndex = this.strucIndex - 1;
          this.sturcDetail = this.strucInfoList[this.strucIndex];
        } else {
          if (this.pagination.pageNum > 1) {
            this.pagination.pageNum = this.pagination.pageNum - 1;
            this.strucIndex = this.pagination.pageSize - 1;
            this.getList();
          }
        }
      }
      /* console.log('this.strucIndex', this.strucIndex);
      console.log('this.pagination.pageNum', this.pagination.pageNum); */
    },
    // 获取列表数据
    getList () {
      // type === 1 for 特征搜人
      if (this.type === 1) {
        let params = Object.assign(this.params, {
          pageSize: this.pagination.pageSize,
          pageNum: this.pagination.pageNum
        });
        getFaceRetrievalPerson(params).then(res => {
          if (res && res.data) {
            this.pagination.total = res.data.total;
            this.sturcDetail = res.data.list[this.strucIndex];
            this.strucInfoList = res.data.list;
          }
        }).catch(() => {
        });
      }
    },
    // 绘制地图
    drawPoint(data) {
      if (!this.amap) {
        // 地图不存在 初始化地图
        let map = new window.AMap.Map("portraitDetail_capMap", {
          center:mapXupuxian.center,
          zoom: 16
        });
        map.setMapStyle("amap://styles/whitesmoke");
        this.amap = map;
      }
      // 已有标记则清除标记
      if (this.markerPoint) {
        this.amap.remove(this.markerPoint);
        this.markerPoint = null;
      }
      let _content = '<div class="vl_icon vl_icon_judge_02 portrait_detail_mk">' +
          '<ul class="com_keepall com_trans50_l">' +
            '<li><span>设备名称：</span>' + data.deviceName + '</li>' +
            '<li><span>抓拍地址：</span>' + data.address + '</li>' +
            '<li><span>抓拍时间：</span>' + data.shotTime + '</li>' +
          '</ul>' +
        '</div>';
      this.markerPoint = new window.AMap.Marker({
        // 添加自定义点标记
        map: this.amap,
        position: [data.shotPlaceLongitude, data.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
        offset: new window.AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // 自定义点标记覆盖物内容
        content: _content
      });
      this.amap.setZoomAndCenter(16, [
        data.shotPlaceLongitude,
        data.shotPlaceLatitude
      ]); // 自适应点位置
    },
  },
  beforeDestroy () {
    if (this.amap) {
      this.amap.destroy();
    }
  }
}
</script>
<style lang="scss">
// 抓拍详情弹窗
.rx_detail_dialog {
  .el-dialog {
    width: 1100px;
    margin-left: -550px !important; margin-top: -276px !important;
    /* 祖先元素设置了transform属性则会导致固定定位属性position: fixed失效。 */
    transform: none !important;
  }
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0 30px;
  }
  .struc_tab {
    padding: 20px 20px 20px 20px;
    position: relative;
    color: #999999;
    span {
      display: inline-block;
      margin-right: 30px; padding-bottom: 8px;
      font-size: 15px;
      cursor: pointer;
    }
    .active {
      color: #0c70f8;
      border-bottom: 2px solid #0c70f8;
    }
    i {
      display: block;
      position: absolute; top: 20px; right: 0;
      cursor: pointer;
      font-size: 20px;
    }
  }
  .struc_main {
    position: relative;
    margin: 0 auto;
    padding: 0 30px;
    border-bottom: 1px solid #f2f2f2;
    > i {
      position: absolute; top: 50%;
      font-size: 60px; color: #0c70f8;
      margin-top: -40px;
      cursor: pointer;
      &.el-icon-arrow-left {
        left: -30px;
      }
      &.el-icon-arrow-right {
        right: -30px;
      }
      &.slider_sding { color: #999; cursor: default; }
      &.slider_dis { color: #999; cursor: not-allowed; }
    }
    .struc_c_detail {
      width: 100%;
      padding: 0 0 30px 0;
      overflow: hidden;
      > ul {
        > li {
          padding-bottom: 6px;
        }
      }
      > div {
        float: left;
      }
      // 默认为蓝色
      .struc_c_d_img {
        position: relative;
        width: 300px; height: 400px;
        background: #eaeaea;
        img {
          width: 100%; height: auto; max-height: 100%;
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          margin: auto;
        }
        i {
          display: block;
          position: absolute; top: 0.1rem; right: 0.1rem;
          height: 0.26rem; line-height: 0.26rem;
          padding: 0 0.1rem;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 0.13rem;
          font-style: normal; color: #0c70f8; font-size: 12px;
        }
      }
      // 绿色标签
      .struc_c_d_img_green {
        &:before {
          display: block;
          content: "";
          position: absolute; top: -40px; left: -40px; z-index: 9;
          transform: rotate(-45deg);
          border: 40px solid #50cc62;
          border-color: transparent transparent #50cc62;
        }
        span {
          display: block;
          position: absolute; top: 5px; left: 5px; z-index: 99;
          width: 50px; height: 50px;
          text-align: center;
          color: #ffffff; font-size: 12px;
          -webkit-transform: rotate(-45deg);
          -moz-transform: rotate(-45deg);
          -ms-transform: rotate(-45deg);
          -o-transform: rotate(-45deg);
          transform: rotate(-45deg);
        }
        i {
          color: #50cc62;
        }
      }
      .struc_c_d_qj {
        margin-right: 20px;
        &:before {
          display: block;
          content: "";
          position: absolute;
          top: -40px; left: -40px;
          transform: rotate(-45deg);
          border: 40px solid #0c70f8;
          border-color: transparent transparent #0c70f8;
          z-index: 9;
        }
        span {
          display: block;
          position: absolute; top: 5px; left: 5px;
          width: 50px; height: 50px;
          text-align: center;
          color: #ffffff;
          font-size: 12px;
          -webkit-transform: rotate(-45deg);
          -moz-transform: rotate(-45deg);
          -ms-transform: rotate(-45deg);
          -o-transform: rotate(-45deg);
          transform: rotate(-45deg);
          z-index: 99;
        }
      }
      .struc_c_d_box {
        box-shadow: 0px 5px 16px 0px rgba(169, 169, 169, 0.2);
        border-radius: 1px;
        position: relative;
        overflow: hidden;
        > div {
          float: left;
        }
        .struc_c_d_info {
          width: 350px; height: 400px;
          padding: 0 5px 0 20px;
          color: #333333;
          overflow: auto;
          > h2 {
            font-weight: bold; font-size: 18px;
            height: 50px; line-height: 50px;
          }
          > ul {
            overflow: hidden;
            > li {
              float: left;
              width: 50%;
              overflow: hidden;
              margin-bottom: 15px;
              > span {
                line-height: 26px; height: 28px;
                border: 1px solid #ddd;
                border-radius: 4px;
                float: left;
                overflow: hidden;
                font-size: 14px;
                &:first-child {
                  width: 68px;
                  background-color: #FAFAFA;
                  text-align: center;
                  border: 1px solid #f2f2f2;
                  border-radius: 4px 0 0 4px;
                  color: #999;
                }
                &:last-child {
                  max-width: 94px;
                  border: 1px solid #f2f2f2;
                  border-left: 0;
                  background-color: #fff;
                  padding: 0 9px 0 9px;
                  border-radius: 0 4px 4px 0;
                  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; word-break: break-all;
                }
              }
            }
          }
        }
        &.struc_vid_empty {
          position: relative;
          > .struc_vid_empty_c {
            > div {
              width: 134px; height: 89px;
              background: url(../../../../../assets/img/video/video_empty.png) center center no-repeat;
            }
            > p {
              padding-top: 10px;
              text-align: center;
              color: #666;
            }
          }
        }
      }
    }
    // 抓拍视频
    .struc_c_video {
      height: 480px;
      padding: 0 0 0 50px;
      position: relative;
      .struc_c_d_box {
        background: #e9e7e8;
        width: 560px; height: 400px;
        text-align: center;
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
      .download_tips {
        float: left;
        width: 100%;
        text-align: right;
        padding-right: 40px; padding-top: 10px;
      }
      .download_btn {
        position: absolute; top: 415px; right: 30px;
        text-align: center;
        width: 80px; height: 30px; line-height: 30px;
        background: rgba(246, 248, 249, 1);
        border: 1px solid rgba(211, 211, 211, 1);
        border-radius: 4px;
        cursor: pointer;
        color: #666666;
        &:hover {
          color: #ffffff;
          background: #0c70f8;
          border-color: #0c70f8;
        }
        a {
          display: inline-block;
          width: 100%; height: 100%;
          text-decoration: none !important;
        }
      }
    }
    .struc_c_address {
      height: 480px;
      padding-bottom: 30px;
      #portraitDetail_capMap {
        width: 100%;
        height: 100%;
      }
    }
  }
  .portrait_detail_mk {
    position: relative;
    > ul {
      position: absolute; bottom: 120%; left: 50%;
      background-color: #fff;
      background:rgba(255,255,255,1);
      box-shadow:0px 12px 14px 0px rgba(148,148,148,0.4);
      padding: 10px 20px;
      border-radius: 4px;
      > li {
        position: relative;
        width: 250px;
        word-break: break-all; white-space: normal;
        color: #333;
        padding: 2px 0 2px 80px;
        > span {
          position: absolute; top: 2px; left: 0;
          width: 80px;
          color: #666;
        }
      }
      &::after {
        border-bottom-color: rgba(0, 0, 0, 0.2);
        content: "";
        display: inline-block;
        position: absolute;
      }
      &::after {
        left: 50%; bottom: -12px;
        margin-left: -12px;
        border-top: 12px solid #fff;
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
      }
    }
  }
}
</style>