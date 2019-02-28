<template>
  <div class="audit-detail">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/event/audit' }">事件管理</el-breadcrumb-item>
        <el-breadcrumb-item>事件审核</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-box">
      <div class="content-left">
        <div class="content_left_scroll">
          <vue-scroll>
            <div class="content_left">
              <ul>
                <li>
                  <span class="audit-label">状态:</span>
                  <span :class="[$route.query.status === 'pass' ? 'pass-status' : 'reject-status']">{{$route.query.status === 'pass' ? '通过' : '驳回'}}</span>
                </li>
                <li>
                  <span>事件编号:</span>
                  <span>XPZ180724001</span>
                </li>
                <li>
                  <span>上报人:</span>
                  <span>13890908080</span>
                  <span></span>
                  <span></span>
                </li>
                <li>
                  <span>上报时间:</span>
                  <span>2018-05-16 13:57:34</span>
                </li>
                <li>
                  <span>事发地点:</span>
                  <span>创谷产业园</span>
                </li>
                <li>
                  <span>事件情况:</span>
                  <span>创谷产业园啊撒扩大埃里克大数据看到家啊大家阿拉斯加的阿拉山口大家啊撒可怜见的克拉斯大街路就爱上邓丽君了</span>
                </li>
                <li>
                  <span>处理单位:</span>
                  <span>公安</span>
                </li>
                <li>
                  <span>事件类型:</span>
                  <span>刑事</span>
                </li>
                <li>
                  <span>事件等级:</span>
                  <span>I级</span>
                </li>
                <li>
                  <span>伤亡人员:</span>
                  <span>不确定</span>
                </li>
                <li>
                  <span>驳回原因:</span>
                  <span>不确定不确定不确定不确定不确定不确定不确定不确定不确定不确定不确定不确定不确定不确定不确定不确定不确定不确定不确定不确定不确定不确定</span>
                </li>
              </ul>
            </div>
          </vue-scroll>
        </div>
      </div>
      <div class="content-right">
        <!--地图-->
        <div id="mapBox"></div>
        <div class="right-flag">
          <ul class="map-rrt">
            <li><i class="vl_icon vl_icon_control_23" @click="mapZoomSet(1)"></i></li>
          </ul>
          <ul class="map-rrt map_rrt_u2">
            <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
            <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="operation-footer">
      <el-button class="operation_btn back_btn" @click="back">返回</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      addEventForm: {
        phone: null, // 手机号码
        reportTime: null, // 上报时间
        eventAddress: null, // 事发地点
        eventSummary: null, // 事件情况
        eventType: null, // 事件类型
        eventLevel: null, // 事件等级
        casualties: null // 伤亡人员
      },
      rules: {

      },
      map: null
    }
  },
  mounted () {
    let map = new window.AMap.Map('mapBox', {
      zoom: 16, // 级别
      center: [112.980377, 28.100175], // 中心点坐标112.980377,28.100175
      // viewMode: '3D' // 使用3D视图
    });
    map.setMapStyle('amap://styles/whitesmoke');
    this.map = map;
  },
  methods: {
    mapZoomSet (val) {
      if (this.map) {
        this.map.setZoom(this.map.getZoom() + val);
      }
    },
    markMark (data) {
      let _this = this;
      let marker = new window.AMap.Marker({ // 添加自定义点标记
        map: _this.map,
        position: new window.AMap.LngLat(data.longitude, data.latitude),
        offset: new window.AMap.Pixel(-15, -16), // 相对于基点的偏移位置
        draggable: false, // 是否可拖动
        // 自定义点标记覆盖物内容
        content: '<div class="vl_icon vl_icon_051"></div>'
      });
      console.log(marker);
      
    },
    back () { // 返回
      this.$router.back(-1);
    }
  }
}
</script>
<style lang="scss" scoped>
.audit-detail {
  width: 100%;
  height: 100%;
  .content-box {
    width: 98%;
    margin: 0 20px; 
    height: calc(100% - 50px - 100px);
    display: flex;
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    .content-left {
      .content_left_scroll {
        width: 500px;
        height: 100%;
        background: #ffffff;
        /deep/ .__view {
          width: 100% !important;
        }
        .content_left {
          width: 100%;
          padding: 20px 10px 0 10px;
          > ul {
            width: 100%;
            font-size: 14px;
            > li {
              line-height: 30px;
              display: flex;
              width: 100%;
              > span:nth-child(1) {
                padding-right: 10px;
                color: #666666;
                width: 20%;
                display: inline-block;
                text-align: right;
                &.audit-label {
                  color: #333333;
                }
              }
              > span:nth-child(2) {
                width: 70%;
                color: #333333;
                display: inline-block;
                &.pass-status {
                  font-size: 20px;
                  color: #4FCB61;
                }
                &.reject-status {
                  color: #F94539;
                  font-size: 20px;
                }
              }
            }
          }
          .add_event_form {
            width: 100%;
            /deep/ .el-form-item {
              margin-bottom: 15px;
            }
            .imgTips {
              width: 160px;
              border-radius: 2px;
              position: absolute;
              color: #F94539;
              padding-top: 0;
              -ms-flex-item-align: center;
              align-self: center;
              left: 90px;
              top: 35px;
            }
            .img-form-item /deep/ .el-form-item__content{
              display: flex;
              .img-list {
                width: 104px;
                height: 104px;
                margin-left: 10px;
                margin-bottom: 10px;
                display: flex;
                .error-item {
                  position: absolute;
                  top: -10px;
                  right: -8px;
                  font-size: 18px;
                  color: #666;
                  z-index: 1;
                }
              }
            }
            /deep/ .el-form-item__label {
              color: #666666;
            }
          }
        }
      }
    }
    .content-right {
      width: 100%;
      height: 100%;
      #mapBox{
        height: 100%;
        width: 100%;
      }
      .right-flag {
        position: absolute; right: 40px; bottom: 100px;
        height: 220px;
        transition: right .3s ease-out;
        animation: fadeInRight .4s ease-out .4s both;
        .map-rrt {
          padding: 0 5px;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(148,148,148,0.24);
          >li {
            padding: 15px 15px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            text-align: center;
            >i {
              font-size: 20px;
              color: #0B6FF7;
            }
            &:last-child { border-bottom: 0; }
          }
        }
        .map_rrt_u2 {
          margin-top: 20px;
        }
      }
    }
  }
  .operation-footer {
    border-left: 1px solid #F2F2F2;
    width: 100%;
    height: 65px;
    line-height: 65px;
    position: fixed;
    bottom: 0;
    background: #ffffff;
    padding-left: 20px;
    .operation_btn {
      padding: 0;
      width: 100px;
      height: 40px;
      text-align: center;
    }
    .function_btn {
      background: #0C70F8;
      color: #ffffff;
    }
    .back_btn {
      background: #ffffff;
      border: 1px solid #DDDDDD;
      color: #666666;
    }
  }
}
</style>
