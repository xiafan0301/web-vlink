<template>
  <div class="add_event">
    <div class="breadcrumb_heaer">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/event/manage' }">事件管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增事件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content_box">
      <div class="content_left_scroll">
        <vue-scroll>
          <div class="content_left">
            <el-form :inline="false" :model="addEventForm" class="add_event_form" :rules="rules" ref="addEventForm">
              <el-form-item label="手机号码:" prop="phone" label-width="85px">
                <el-input type="text" style='width: 95%' placeholder="请输入上报人手机号码" v-model="addEventForm.phone" />
              </el-form-item>
              <el-form-item label="上报时间:" prop="reportTime" label-width="85px">
                <el-date-picker type="date" style='width: 95%' placeholder="选择日期" v-model="addEventForm.reportTime" ></el-date-picker>
              </el-form-item>
              <el-form-item label="事发地点:" prop="eventAddress" label-width="85px">
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
              <el-form-item>
                <el-button class="operation_btn function_btn" type="primary">审核通过</el-button>
                <el-button class="operation_btn function_btn" type="primary">审核不通过</el-button>
                <el-button class="operation_btn back_btn" type="primary">返回</el-button>
              </el-form-item>
            </el-form>
          </div>
        </vue-scroll>
      </div>
      <div class="content_right">
        <div class="map_rm" id="mapMap"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isImgNumber: true, // 是否显示图片超过最大数提示
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
        phone:[
          { required: true, message: '请输入上报人手机号码', trigger: 'blur' }
        ],
        reportTime:[
          { required: true, message: '请选择上报时间', trigger: 'blur' }
        ],
        eventAddress:[
          { required: true, message: '请输入事发地点', trigger: 'blur' }
        ],
        eventSummary:[
          { required: true, message: '请输入事情情况', trigger: 'blur' }
        ],
        eventType:[
          { required: true, message: '请选择事件类型', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    let _this = this;
    let map = new window.AMap.Map('mapMap', {
      zoom: 18, // 级别
      center: [112.974691, 28.093846], // 中心点坐标
      // viewMode: '3D' // 使用3D视图
    });
    map.setMapStyle('amap://styles/whitesmoke');
    _this.map = map;
    // 在地图中添加MouseTool插件
    let mouseTool = new window.AMap.MouseTool(map);
    _this.mouseTool = mouseTool;
    console.log(mouseTool)
    // 添加事件
    // window.AMap.event.addListener(_this.mouseTool, 'draw', function (e) {
    //   console.log('2222')
    //   // _this.drawPaths = e.obj.getPath();
    //   console.log('drawPaths e', e); // 获取路径/范围
    //   console.log('drawPaths', e.obj.getPath()); // 获取路径/范围
    //   setTimeout(() => {
    //     _this.selAreaRest(true);
    //     let polygon = new window.AMap.Polygon({
    //       map: map,
    //       strokeColor: '#FA453A',
    //       strokeOpacity: 1,
    //       strokeWeight: 1,
    //       fillColor: '#FA453A',
    //       fillOpacity: 0.2,
    //       path: e.obj.getPath(),
    //       zIndex: 12
    //     });
    //     _this.selAreaPolygon = polygon;
    //     _this.selAreaAble = true;
    //     // _this.mapMarkHandler();
    //   }, 100);
    // });
  },
  methods: {
    handleBeforeUpload (file) { // 图片上传之前
      this.isImgDisabled = true;
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLtTenM = file.size / 1024 / 1024 < 2;
      if (!isImg) {
        this.$message.error('上传的图片只能是jpeg、jpg、png格式!');
        this.isImgDisabled = false;
      }
      if (!isLtTenM) {
        this.$message.error('上传的图片大小不能超过2M');
        this.isImgDisabled = false;
      }
      return isImg && isLtTenM;
    },
    handleImgNumber (files, fileList) { // 图片超出最大个数限制
      this.isImgNumber = true;
    },
    handlePictureCardPreview () {},
    handleRemove () {},
    handleSuccess () {}
  }
}
</script>

<style lang="scss" scoped>
.add_event {
  width: 98%;
  height: 100%;
  .content_box {
    padding: 0 20px;
    height: calc(100% - 50px);
    display: flex;
    .content_left_scroll {
      width: 500px;
      height: 100%;
      background: #ffffff;
      /deep/ .__view {
        width: 100% !important;
      }
      .content_left {
        width: 96%;
        margin: 20px 0 0 2%;
        // background: red;
        .add_event_form {
          width: 100%;
          .operation_btn {
            padding: 0;
            width: 100px;
            height: 40px;
            text-align: center;
          }
          .function_btn {
            background: #0C70F8;
          }
          .back_btn {
            background: #ffffff;
            border: 1px solid #DDDDDD;
            color: #666666;
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
        }
      }
    }
    .content_right {
      width: calc(100% - 500px);
    }
  }
}
</style>
