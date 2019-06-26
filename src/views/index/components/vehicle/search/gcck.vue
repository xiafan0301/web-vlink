<template>
  <div class="vehicle_content">
    <div class="vc_gcck_bd" is="vehicleBreadcrumb" :oData="[{name: '过车查看'}]"></div>
    <div class="vc_gcck">
      <div class="vc_gcck_con">
        <div class="vc_gcck_l">
        </div>
        <div class="vc_gcck_r">
          <ul class="vc_gcck_rt" :class="'video_list_' + videoTotal">
            <li v-for="item in videoTotal" :key="'video_list_' + item">
              <div v-if="videoList[item - 1]">
                <div is="flvplayer" :oData="videoList[item - 1]" :bResize="bResize"
                  :oConfig="{sign: true, close: false}">
                </div>
              </div>
              <div v-else>
              </div>
            </li>
          </ul>
          <ul class="vc_gcck_rb">
            <li >
              <div class="vc_gcck_rbc">
                <p>今日告警</p>
                <h2>2354</h2>
                <el-button size="small">查看更多</el-button>
              </div>
            </li>
            <li v-for="item in 10" :key="item">
              <div class="vc_gcck_rbl">
                <img src="../../../../../assets/img/temp/video_pic.png" alt="">
                <div><i class="vl_icon gcck_sj"></i>18-12-24 14:12:17</div>
                <div><i class="vl_icon gcck_sxt"></i>环保路摄像头002</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vehicleBreadcrumb from '../breadcrumb.vue';
import flvplayer from '@/components/common/flvplayer.vue';
export default {
  components: {vehicleBreadcrumb, flvplayer},
  data () {
    return {
      videoTotal: 2, // 1 / 2 / 8
      videoList: [
        { type: 1, title: '测试设备1', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备2', record: false, video: { uid: 4 } },
        { type: 1, title: '测试设备3', record: false, video: { uid: 5 } },
        { type: 1, title: '测试设备4', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备5', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备6', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备7', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备8', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备9', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备10', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备1', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备2', record: false, video: { uid: 4 } },
        { type: 1, title: '测试设备3', record: false, video: { uid: 5 } },
        { type: 1, title: '测试设备4', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备5', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备6', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备7', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备8', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备9', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备10', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备1', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备2', record: false, video: { uid: 4 } },
        { type: 1, title: '测试设备3', record: false, video: { uid: 5 } },
        { type: 1, title: '测试设备4', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备5', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备6', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备7', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备8', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备9', record: false, video: { uid: 3 } },
        { type: 1, title: '测试设备10', record: false, video: { uid: 3 } }
      ],
      bResize: {}
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.vc_gcck {
  height: 100%;
  padding-top: 50px;
  > .vc_gcck_con {
    height: 100%;
    position: relative;
    > .vc_gcck_l { 
      position: absolute; top: 0; left: 0;
      height: 100%; width: 272px;
      border-right: 1px solid #f6f6f6;
      box-shadow: 0 0 5px #ddd;
      background-color: #fff;
    }
    > .vc_gcck_r {
      position: relative;
      height: 100%;
      margin-left: 273px; padding-bottom: 238px;
      > .vc_gcck_rt {
        height: 100%;
        padding: 5px 5px 0 5px;
        overflow: hidden;
        > li { 
          padding: 5px;
          > div { width: 100%; height: 100%; }
        }
        &.video_list_1 {
          > li { width: 60%; height: 100%; margin: 0 auto; }
        }
        &.video_list_2 {
          > li { float: left; width: 50%; height: 100%; }
        }
        &.video_list_8 {
          > li { float: left; width: 25%; height: 50%; }
        }
        &.video_list_32 {
          > li { float: left; width: 12.5%; height: 25%; }
        }
      }
      > .vc_gcck_rb {
        position: absolute; bottom: 0; left: 0;
        width: 100%; height: 238px;
        overflow: hidden;
        padding: 5px;
        > li {
          float: left;
          height: 228px;
          padding: 5px;
          > div {
            width: 152px; height: 218px;
            background-color: #fff;
            box-shadow:0px -2px 5px 0px rgba(131,131,131,0.28);
            text-align: center;
            &.vc_gcck_rbc {
              > p {
                color: #666;
                padding: 50px 0 10px 0;
              }
              > h2 {
                color: #0C70F8; font-size: 24px; font-weight: bold;
                padding-bottom: 20px;
              }
            }
            &.vc_gcck_rbl {
              width: 162px;
              padding: 10px;
              > img {
                width: 142px; height: 142px;
                margin-bottom: 5px;
              }
              > div {
                position: relative;
                text-align: left;
                padding-left: 18px;
                color: #999; font-size: 12px;
                height: 22px; line-height: 22px;
                > i {
                  position: absolute; top: 3px; left: 0;
                  width: 12px; height: 15px;
                  &.gcck_sxt { background-position: -325px -377px; }
                  &.gcck_sj { background-position: -787px -376px; }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>