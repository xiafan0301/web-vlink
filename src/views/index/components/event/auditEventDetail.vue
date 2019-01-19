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
                  <span class="audit-status">待审核</span>
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
                  <span>是否有人员上亡:</span>
                  <span>不确定</span>
                </li>
              </ul>
              <!-- <el-form :inline="false" :model="addEventForm" class="add_event_form" :rules="rules" ref="addEventForm">
                <el-form-item label="事发地点:" label-width="85px">
                  <el-input type="text" style='width: 95%' placeholder="请输入事发地点" v-model="addEventForm.eventAddress" />
                </el-form-item>
                <el-form-item label="事件情况:" prop="eventSummary" label-width="85px">
                  <el-input type="textarea" rows="5" style='width: 95%' placeholder="请对事发情况进行描述，文字限制140字" v-model="addEventForm.eventSummary" />
                </el-form-item>
                <el-form-item  label-width="85px" class="img-form-item">
                  <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    accept=".png,.jpg,.jpeg"
                    :limit='9'
                    :before-upload='handleBeforeUpload'
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success='handleSuccess'
                    :on-exceed="handleImgNumber"
                  >
                    <i class="el-icon-plus"></i>
                    <span class='add-img-text'>添加</span>
                    <span class="imgTips" v-show="isImgNumber">图片最多上传9张</span>
                  </el-upload>
                </el-form-item>
                <el-form-item label-width="85px">
                  <div style="color: #999999;">（最多传9张 支持JPEG、JPG、PNG、文件，大小不超过2M）</div>
                </el-form-item>
                <el-form-item  label="处理单位:" prop="eventType" label-width="85px">
                  <el-select v-model="addEventForm.eventType" style='width: 95%'>
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item  label="事件类型:" prop="eventType" label-width="85px">
                  <el-select v-model="addEventForm.eventType" style='width: 95%'>
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="事件等级:" prop="eventLevel" label-width="85px">
                  <el-select v-model="addEventForm.eventLevel" style='width: 95%'>
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="伤亡人员:" prop="casualties" label-width="85px">
                  <el-radio-group v-model="addEventForm.casualties" style='width: 95%'>
                    <el-radio label="无"></el-radio>
                    <el-radio label="不确定"></el-radio>
                    <el-radio label="有"></el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form> -->
            </div>
          </vue-scroll>
        </div>
      </div>
      <div class="content-right">
        <!--地图-->
        <div id="mapBox"></div>
        <div class="right-flag">
          <ul class="map-rrt">
            <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
          </ul>
          <ul class="map-rrt map_rrt_u2">
            <li><i class="el-icon-plus" @click="mapZoomSet(1)"></i></li>
            <li><i class="el-icon-minus" @click="mapZoomSet(-1)"></i></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="operation-footer">
      <!-- <el-button class="operation_btn function_btn">审核通过</el-button> -->
      <!-- <el-button class="operation_btn back_btn">审核不通过</el-button> -->
      <el-button class="operation_btn back_btn">返回</el-button>
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
  }
}
</script>
<style lang="scss" scoped>
.audit-detail {
  width: 100%;
  height: 100%;
  .content-box {
    width: 100%;
    padding: 20px;  
    height: calc(100% - 50px - 100px);
    display: flex;
    box-shadow:5px 0px 16px 0px rgba(169,169,169,0.2);
    .content-left {
      .content_left_scroll {
        width: 450px;
        height: 100%;
        background: #ffffff;
        /deep/ .__view {
          width: 100% !important;
        }
        .content_left {
          width: 96%;
          margin: 20px 0 0 2%;
          > ul {
            width: 100%;
            font-size: 14px;
            > li {
              height: 30px;
              > span:nth-child(1) {
                padding-right: 10px;
                color: #666666;
                width: 85px;
                display: inline-block;
                text-align: right;
                &.audit-label {
                  color: #333333;
                }
              }
              > span:nth-child(2) {
                color: #333333;
                display: inline-block;
                &.audit-status {
                  color: #0C70F8;
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
        position: absolute; right: 20px; bottom: 15%;
        height: 220px;
        transition: right .3s ease-out;
        animation: fadeInRight .4s ease-out .4s both;
        .map-rrt {
          padding: 0 10px;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(148,148,148,0.24);
          >li {
            padding: 20px 15px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
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
