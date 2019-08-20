<template>
  <div>fawe</div>
</template>
<script>
  import flvplayer from '@/components/common/flvplayer.vue';
  import { mapXupuxian } from "@/config/config.js";
  export default {
    /*
    * detailData, 两个值，index（当前展示第几个）跟list(所有展示数据的集合),
    * btnList, 例如区域徘徊
    * this.btnList = [
            {
            disabled: data.isInSur, // 弹窗出现应该就能确定按钮是否禁用，
            label: '加入布控库', // 按钮的文字
            cb: 'gotoControl' // 点击按钮emit出来的方法，参数为当前车辆数据vehicleDetial
          }
        ]
        *<div is="vlDialog" :detailData="detailData" :btnList="btnList" @gotoControl="gotoControl"></div>
        * detailLeftInfo,detailRightInfo,detailBottomInfo,
        *
    * */
    name: 'VlDialog',
    /* props: {
      detailData: {
        type: Object,
        default: () => {}
      },
      btnList: {
        type: Array,
        default: () => []
      },
      detailLeftInfo: {
        type: Object,
        default: () => {
          return {
            name: '抓拍图',
            imgKey: 'subStoragePath'
          }
        }
      },
      detailRightInfo: {
        type: Object,
        default: () => {
          return {
            name: '全景图',
            imgKey: 'storagePath'
          }
        }
      },
      detailBottomInfo: {
        type: Object,
        default: () => {
          return {
            imgKey: 'subStoragePath'
          }
        }
      }
    }, */
    components: {flvplayer},
    data() {
      return {
        capMapId: 'capMap_' + new Date().getTime(),
        playerData: null,
        swiperOption: {
          slidesPerView: 10,
          spaceBetween: 10,
          slidesPerGroup: 9,
          loop: false,
          slideToClickedSlide: true,
          loopFillGroupWithBlank: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        },
        amap: null, // 地图实例
        markerPoint: null, // 地图点集合
        InfoWindow: null,
        strucInfoList: [],
        strucCurTab: 1,
        curImgIndex: 0,
        sturcDetail: {},
        strucDetailDialog: false,
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
      drawPoint (data) {
        console.log(data)
        if (!this.amap) {
          // 地图不存在 初始化地图
          let map = new window.AMap.Map(this.capMapId, {
            center:mapXupuxian.center,
            zoom: 16
          });
          map.setMapStyle("amap://styles/whitesmoke");
          this.amap = map;
        }
        if (this.markerPoint) {
          this.amap.remove(this.markerPoint)
        }
        let _content = '<div class="vl_icon vl_icon_judge_02"></div>'
        this.markerPoint = new AMap.Marker({ // 添加自定义点标记
          map: this.amap,
          position: [data.shotPlaceLongitude, data.shotPlaceLatitude], // 基点位置 [116.397428, 39.90923]
          offset: new AMap.Pixel(-20.5, -50), // 相对于基点的偏移位置
          draggable: false, // 是否可拖动
          // 自定义点标记覆盖物内容
          content: _content
        });
        this.amap.setZoomAndCenter(16, [data.shotPlaceLongitude, data.shotPlaceLatitude]); // 自适应点位置
        let sConent = `<div class="cap_info_win"><p>设备名称：${data.deviceName}</p><p>抓拍地址：${data.address}</p></div>`
        this.infoWindow = new AMap.InfoWindow({
          map: this.amap,
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
      pageJump (data, curBtn) {
        this.$emit(curBtn.cb, data)
      }
    },
    watch: {
      detailData (val) {
        this.strucCurTab = 1;
        this.curImgIndex = val.index;
        this.strucInfoList = val.list;
        this.sturcDetail = val.list[val.index]
        this.strucDetailDialog = true;
      },
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
    beforeDestroy () {
      if (this.amap) {
        this.amap.destroy();
      }
    }
  }
</script>
<style lang="less">
</style>
